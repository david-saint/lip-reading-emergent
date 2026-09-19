"""Lip-reading test harness.

Runs each selected model over each clip and scores the response against the
ground-truth sentence. Replaces the separate run.py / run_gemini.py split — all
three providers now go through one runner.

    uv run run.py --dry-run                 # show what would be sent
    uv run run.py                           # full run, current defaults
    uv run run.py --preset baseline         # reproduce the 2026-03 conditions
    uv run run.py --sweep 1,5,10,30         # frame-rate sweep
    uv run run.py --task describe           # positive control: can it see the clip?
"""

import argparse
import json
import time
from dataclasses import replace
from datetime import datetime, timezone

from config import ALL_MODELS, BASE_DIR, BASELINE_PRESET, CLIPS, MODELS, TASKS
from evaluate import aggregate, score
from preprocessing import probe_mp4
from providers import describe_request, query_model


def parse_args():
    parser = argparse.ArgumentParser(description="Lip-reading model test harness")
    parser.add_argument("--model", help="Comma-separated model names (default: the four in MODELS)")
    parser.add_argument("--clip", help="Comma-separated clip ids, e.g. clip_1,clip_2")
    parser.add_argument("--task", default="lipread", choices=sorted(TASKS), help="Prompt to run")
    parser.add_argument("--fps", type=float, help="Override sampling frame rate for every model")
    parser.add_argument("--sweep", help="Comma-separated frame rates to run in sequence")
    parser.add_argument("--max-frames", type=int, help="Cap on frames per frame-sequence request")
    parser.add_argument("--media-resolution", choices=["LOW", "MEDIUM", "HIGH"], help="Gemini only")
    parser.add_argument("--effort", choices=["low", "medium", "high", "xhigh", "max"])
    parser.add_argument("--preset", choices=["baseline"], help="baseline = the 2026-03 conditions")
    parser.add_argument("--delay", type=float, default=1.0, help="Seconds between API calls")
    parser.add_argument("--allow-audio", action="store_true", help="Skip the silent-audio preflight")
    parser.add_argument("--dry-run", action="store_true", help="Show what would run, call nothing")
    return parser.parse_args()


def select_models(args) -> list:
    models = MODELS
    if args.model:
        wanted = [name.strip().lower() for name in args.model.split(",")]
        models = [m for m in ALL_MODELS if m.name.lower() in wanted]
        missing = set(wanted) - {m.name.lower() for m in models}
        if missing:
            raise SystemExit(
                f"Unknown model(s): {', '.join(sorted(missing))}\n"
                f"Available: {', '.join(m.name for m in ALL_MODELS)}"
            )

    overrides = dict(BASELINE_PRESET) if args.preset == "baseline" else {}
    if args.fps is not None:
        overrides["fps"] = args.fps
    if args.max_frames is not None:
        overrides["max_frames"] = args.max_frames
    if args.media_resolution:
        overrides["media_resolution"] = args.media_resolution
    if args.effort:
        overrides["effort"] = args.effort

    if not overrides:
        return list(models)
    # media_resolution / effort only mean something to the providers that take them.
    resolved = []
    for model in models:
        applicable = {
            k: v
            for k, v in overrides.items()
            if not (k == "media_resolution" and model.provider != "gemini")
            and not (k == "effort" and model.provider == "gemini")
        }
        resolved.append(replace(model, **applicable))
    return resolved


def select_clips(args) -> list:
    if not args.clip:
        return CLIPS
    wanted = [c.strip() for c in args.clip.split(",")]
    clips = [c for c in CLIPS if c.id in wanted]
    missing = set(wanted) - {c.id for c in clips}
    if missing:
        raise SystemExit(f"Unknown clip(s): {', '.join(sorted(missing))}")
    return clips


def preflight(clips, allow_audio: bool) -> list[dict]:
    """The clips must be silent: native-video models ingest audio as well."""
    probes = []
    for clip in clips:
        info = probe_mp4(clip.full_path)
        probes.append({"clip_id": clip.id, **info.__dict__})
        print(f"  {clip.id}: {info.summary}")
        if info.has_audio and not info.audio_looks_silent and not allow_audio:
            raise SystemExit(
                f"\n{clip.id} carries a non-silent audio track. A model with native "
                f"video input would transcribe it instead of lip-reading.\n"
                f"Strip it with: uv run strip_audio.py   (or re-run with --allow-audio)"
            )
    return probes


def run_cell(model, clip, task: str) -> dict:
    result = {
        "model": model.name,
        "model_id": model.model_id,
        "provider": model.provider,
        "clip_id": clip.id,
        "task": task,
        "ground_truth": clip.ground_truth,
        "response": None,
        "usage": None,
        "stop_reason": None,
        "request_meta": None,
        "error": None,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    try:
        response = query_model(clip.full_path, model, task)
        result.update(
            response=response["response"],
            usage=response["usage"],
            stop_reason=response.get("stop_reason"),
            request_meta=response.get("request_meta"),
        )
        print(f"OK — {str(response['response'])[:90]!r}")
    except Exception as exc:  # one bad cell shouldn't lose the run
        result["error"] = f"{type(exc).__name__}: {exc}"
        print(f"ERROR — {result['error'][:160]}")
    return result


def build_report(run_id: str, task: str, results: list[dict], clip_ids: list[str]) -> tuple[dict, str]:
    scored = []
    for r in results:
        if r["error"]:
            scored.append({**r, "outcome": "error"})
        else:
            scored.append({**r, **score(r["ground_truth"], r["response"], r["stop_reason"])})

    model_names = list(dict.fromkeys(r["model"] for r in results))
    averages = {
        name: aggregate([s for s in scored if s["model"] == name]) for name in model_names
    }
    summary = {"run_id": run_id, "task": task, "scores": scored, "model_averages": averages}

    lines = [f"# Lip-Reading Results — {task}", "", f"Run: {run_id}", ""]
    lines.append("| Model | " + " | ".join(clip_ids) + " | Avg WER | Attempts |")
    lines.append("|" + "---|" * (len(clip_ids) + 3))
    for name in model_names:
        row = f"| {name} "
        for clip_id in clip_ids:
            cell = next((s for s in scored if s["model"] == name and s["clip_id"] == clip_id), None)
            if cell is None:
                row += "| — "
            elif cell.get("outcome") != "attempt" or cell.get("wer") is None:
                row += f"| _{cell.get('outcome')}_ "
            else:
                row += f"| {cell['wer']:.2f} "
        avg = averages[name]
        wer = f"{avg['avg_wer']:.2f}" if avg["avg_wer"] is not None else "—"
        row += f"| **{wer}** | {avg['attempts']}/{avg['n']} |"
        lines.append(row)

    lines += ["", "WER is averaged over genuine attempts only; refusals, empty and", 
              "truncated responses are counted in the Attempts column instead.", "", "## Responses", ""]
    for s in scored:
        lines.append(f"**{s['model']}** + {s['clip_id']} — _{s.get('outcome')}_")
        lines.append(f"- Ground truth: {s['ground_truth']!r}")
        lines.append(f"- Response: {str(s.get('response'))[:400]!r}")
        if s.get("error"):
            lines.append(f"- Error: {s['error']}")
        if s.get("wer") is not None:
            lines.append(
                f"- WER: {s['wer']:.2f} | CER: {s['cer']:.2f} | Similarity: {s['semantic_similarity']:.2f}"
            )
        if s.get("request_meta"):
            lines.append(f"- Request: {s['request_meta']}")
        if s.get("usage"):
            lines.append(f"- Usage: {s['usage']}")
        lines.append("")

    return summary, "\n".join(lines)


def main():
    args = parse_args()
    models = select_models(args)
    clips = select_clips(args)
    frame_rates = [float(f) for f in args.sweep.split(",")] if args.sweep else [None]

    print("Preflight:")
    probes = preflight(clips, args.allow_audio)

    pairs = [
        (replace(m, fps=fps) if fps is not None else m, c)
        for fps in frame_rates
        for m in models
        for c in clips
    ]

    if args.dry_run:
        print(f"\nWould run {len(pairs)} call(s), task={args.task}:")
        for model, clip in pairs:
            print(f"  {model.name} ({model.model_id}) + {clip.id} — {describe_request(clip.full_path, model)}")
        return

    run_id = datetime.now().strftime("%Y-%m-%dT%H-%M-%S")
    out_dir = BASE_DIR / "results" / f"run_{run_id}"
    out_dir.mkdir(parents=True, exist_ok=True)
    print(f"\nRunning {len(pairs)} call(s) → {out_dir}\n")

    results = []
    for i, (model, clip) in enumerate(pairs, 1):
        print(f"[{i}/{len(pairs)}] {model.name} @ {model.fps}fps + {clip.id}...", end=" ", flush=True)
        results.append(run_cell(model, clip, args.task))
        (out_dir / "raw_responses.json").write_text(
            json.dumps({"run_id": run_id, "task": args.task, "probes": probes, "results": results}, indent=2)
        )
        if i < len(pairs):
            time.sleep(args.delay)

    summary, report = build_report(run_id, args.task, results, [c.id for c in clips])
    (out_dir / "summary.json").write_text(json.dumps(summary, indent=2))
    (out_dir / "summary.md").write_text(report)

    print("\n" + report.split("## Responses")[0])
    print(f"Results saved to {out_dir}")


if __name__ == "__main__":
    main()
