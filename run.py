import argparse
import json
import time
from datetime import datetime, timezone
from pathlib import Path

from config import BASE_DIR, CLIPS, MODELS
from evaluate import compute_metrics
from providers import query_model


def main():
    parser = argparse.ArgumentParser(description="Lip-reading model test harness")
    parser.add_argument("--model", help="Run only this model (by name)")
    parser.add_argument("--clip", help="Run only this clip (by id, e.g. clip_1)")
    parser.add_argument("--delay", type=float, default=1.0, help="Seconds between API calls")
    parser.add_argument("--dry-run", action="store_true", help="Show what would run without calling APIs")
    args = parser.parse_args()

    models = MODELS
    clips = CLIPS
    if args.model:
        models = [m for m in models if m.name == args.model]
        if not models:
            print(f"Unknown model: {args.model}")
            print(f"Available: {', '.join(m.name for m in MODELS)}")
            return
    if args.clip:
        clips = [c for c in clips if c.id == args.clip]
        if not clips:
            print(f"Unknown clip: {args.clip}")
            print(f"Available: {', '.join(c.id for c in CLIPS)}")
            return

    pairs = [(m, c) for m in models for c in clips]
    total = len(pairs)

    if args.dry_run:
        print(f"Would run {total} test(s):")
        for m, c in pairs:
            print(f"  {m.name} + {c.id} ({c.ground_truth!r})")
        return

    run_id = datetime.now().strftime("%Y-%m-%dT%H-%M-%S")
    out_dir = BASE_DIR / "results" / f"run_{run_id}"
    out_dir.mkdir(parents=True, exist_ok=True)

    results = []
    for i, (model, clip) in enumerate(pairs, 1):
        print(f"[{i}/{total}] {model.name} + {clip.id}...", end=" ", flush=True)
        result = {
            "model": model.name,
            "model_id": model.model_id,
            "clip_id": clip.id,
            "ground_truth": clip.ground_truth,
            "response": None,
            "usage": None,
            "error": None,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        try:
            resp = query_model(clip.full_path, model)
            result["response"] = resp["response"]
            result["usage"] = resp["usage"]
            print(f"OK — {resp['response']!r}")
        except Exception as e:
            result["error"] = str(e)
            print(f"ERROR — {e}")

        results.append(result)
        # Save incrementally
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

    # Model averages
    model_names = list(dict.fromkeys(r["model"] for r in results))
    model_avgs = {}
    for name in model_names:
        model_scores = [s for s in scores if s["model"] == name]
        n = len(model_scores)
        model_avgs[name] = {
            "avg_wer": sum(s["wer"] for s in model_scores) / n,
            "avg_cer": sum(s["cer"] for s in model_scores) / n,
            "avg_similarity": sum(s["semantic_similarity"] for s in model_scores) / n,
            "exact_matches": sum(s["exact_match"] for s in model_scores),
            "total_clips": n,
        }

    summary = {"run_id": run_id, "scores": scores, "model_averages": model_avgs}
    (out_dir / "summary.json").write_text(json.dumps(summary, indent=2))

    # Markdown report
    clip_ids = list(dict.fromkeys(c.id for c in clips))
    md_lines = ["# Lip-Reading Results", "", f"Run: {run_id}", ""]
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

    # Print summary table
    print("\n" + "\n".join(md_lines[:len(model_names) + 4]))
    print(f"\nResults saved to {out_dir}")


if __name__ == "__main__":
    main()
