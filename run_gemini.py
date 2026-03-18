"""Test Gemini models directly via the Google GenAI SDK (bypasses OpenRouter)."""

import argparse
import json
import time
from datetime import datetime, timezone
from pathlib import Path

from google import genai
from google.genai import types

from config import BASE_DIR, CLIPS, SYSTEM_PROMPT
from evaluate import compute_metrics

GEMINI_MODELS = [
    ("Gemini 3.1 Flash Lite", "gemini-3.1-flash-lite-preview"),
    ("Gemini 3 Flash", "gemini-3-flash-preview"),
    ("Gemini 3.1 Pro", "gemini-3.1-pro-preview"),
]


def wait_for_active(client: genai.Client, file_ref, timeout: int = 60):
    """Poll until the uploaded file reaches ACTIVE state."""
    import time as _time

    deadline = _time.time() + timeout
    while _time.time() < deadline:
        f = client.files.get(name=file_ref.name)
        if f.state.name == "ACTIVE":
            return f
        _time.sleep(2)
    raise TimeoutError(f"File {file_ref.name} did not become ACTIVE within {timeout}s")


def query_gemini(client: genai.Client, model_id: str, video_path: str) -> dict:
    video_file = client.files.upload(file=video_path)
    video_file = wait_for_active(client, video_file)

    response = client.models.generate_content(
        model=model_id,
        contents=[
            types.Content(
                parts=[
                    types.Part(text=SYSTEM_PROMPT),
                    types.Part.from_uri(file_uri=video_file.uri, mime_type="video/mp4"),
                    types.Part(text="What is this person saying?"),
                ]
            )
        ],
        config=types.GenerateContentConfig(
            temperature=0,
            max_output_tokens=200,
        ),
    )

    usage = response.usage_metadata
    return {
        "response": response.text,
        "usage": {
            "prompt_tokens": usage.prompt_token_count if usage else 0,
            "completion_tokens": usage.candidates_token_count if usage else 0,
        },
    }


def main():
    parser = argparse.ArgumentParser(description="Test Gemini models via GenAI SDK")
    parser.add_argument("--model", help="Run only this model (by name)")
    parser.add_argument("--clip", help="Run only this clip (by id, e.g. clip_1)")
    parser.add_argument("--delay", type=float, default=1.0, help="Seconds between calls")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    models = GEMINI_MODELS
    clips = CLIPS
    if args.model:
        models = [(n, m) for n, m in models if n == args.model]
        if not models:
            print(f"Unknown model: {args.model}")
            print(f"Available: {', '.join(n for n, _ in GEMINI_MODELS)}")
            return
    if args.clip:
        clips = [c for c in clips if c.id == args.clip]
        if not clips:
            print(f"Unknown clip: {args.clip}")
            return

    pairs = [(name, model_id, clip) for name, model_id in models for clip in clips]
    total = len(pairs)

    if args.dry_run:
        print(f"Would run {total} test(s):")
        for name, _, clip in pairs:
            print(f"  {name} + {clip.id} ({clip.ground_truth!r})")
        return

    client = genai.Client()

    run_id = datetime.now().strftime("%Y-%m-%dT%H-%M-%S")
    out_dir = BASE_DIR / "results" / f"gemini_{run_id}"
    out_dir.mkdir(parents=True, exist_ok=True)

    results = []
    for i, (name, model_id, clip) in enumerate(pairs, 1):
        print(f"[{i}/{total}] {name} + {clip.id}...", end=" ", flush=True)
        result = {
            "model": name,
            "model_id": model_id,
            "clip_id": clip.id,
            "ground_truth": clip.ground_truth,
            "response": None,
            "usage": None,
            "error": None,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        try:
            resp = query_gemini(client, model_id, clip.full_path)
            result["response"] = resp["response"]
            result["usage"] = resp["usage"]
            print(f"OK — {resp['response']!r}")
        except Exception as e:
            result["error"] = str(e)
            print(f"ERROR — {e}")

        results.append(result)
        (out_dir / "raw_responses.json").write_text(
            json.dumps({"run_id": run_id, "results": results}, indent=2)
        )
        if i < total:
            time.sleep(args.delay)

    # Evaluate
    scores = []
    for r in results:
        if r["response"] and not r["error"]:
            metrics = compute_metrics(r["ground_truth"], r["response"])
            scores.append({**r, **metrics})
        else:
            scores.append({**r, "exact_match": False, "wer": 1.0, "cer": 1.0, "semantic_similarity": 0.0})

    model_names = list(dict.fromkeys(name for name, _, _ in pairs))
    model_avgs = {}
    for name in model_names:
        ms = [s for s in scores if s["model"] == name]
        n = len(ms)
        model_avgs[name] = {
            "avg_wer": sum(s["wer"] for s in ms) / n,
            "avg_cer": sum(s["cer"] for s in ms) / n,
            "avg_similarity": sum(s["semantic_similarity"] for s in ms) / n,
            "exact_matches": sum(s["exact_match"] for s in ms),
            "total_clips": n,
        }

    summary = {"run_id": run_id, "scores": scores, "model_averages": model_avgs}
    (out_dir / "summary.json").write_text(json.dumps(summary, indent=2))

    clip_ids = list(dict.fromkeys(c.id for c in clips))
    md_lines = ["# Gemini Lip-Reading Results (GenAI SDK)", "", f"Run: {run_id}", ""]
    header = "| Model | " + " | ".join(clip_ids) + " | Avg WER |"
    sep = "|" + "---|" * (len(clip_ids) + 2)
    md_lines.extend([header, sep])
    for name in model_names:
        row = f"| {name} "
        for cid in clip_ids:
            s = next((s for s in scores if s["model"] == name and s["clip_id"] == cid), None)
            row += f"| {s['wer']:.2f} " if s else "| — "
        row += f"| **{model_avgs[name]['avg_wer']:.2f}** |"
        md_lines.append(row)

    md_lines.extend(["", "## Responses", ""])
    for s in scores:
        md_lines.append(f"**{s['model']}** + {s['clip_id']}")
        md_lines.append(f"- Ground truth: {s['ground_truth']!r}")
        md_lines.append(f"- Response: {s.get('response', 'ERROR')!r}")
        md_lines.append(f"- WER: {s['wer']:.2f} | CER: {s['cer']:.2f} | Similarity: {s['semantic_similarity']:.2f}")
        md_lines.append("")

    (out_dir / "summary.md").write_text("\n".join(md_lines))
    print("\n" + "\n".join(md_lines[:len(model_names) + 4]))
    print(f"\nResults saved to {out_dir}")


if __name__ == "__main__":
    main()
