# Lip Reading with Multimodal LLMs

An experiment to investigate whether multimodal LLMs can "read lips" — given a video of someone speaking with the audio stripped out, can the model infer what was said based on visual cues alone?

This is a curiosity-driven exploration, not a production system. We're testing the emergent capabilities of general-purpose vision-language models on a task they were never explicitly trained for.

## How It Works

1. Take a video of someone speaking
2. Strip the audio (`uv run strip_audio.py`, or `ffmpeg -i input.mp4 -an -c:v copy silent.mp4`)
3. Feed the silent video to various multimodal LLMs
4. Ask the model to infer what was said
5. Compare results across models

## The two arms

Only Gemini takes video natively. Claude and GPT-6 Astra accept images only, so
their clips are decoded to a frame sequence — which means **we** choose the frame
rate for those models rather than inheriting the provider's default.

| Arm | Models | Frames |
|---|---|---|
| `native_video` | Gemini 3.7 Flash, Gemini 3.1 Pro | `fps` passed as `videoMetadata`, `media_resolution=HIGH`, `media_processing=STATIC` |
| `frame_sequence` | Claude Opus 5, GPT-6 Astra | extracted locally at `fps`, capped at `max_frames`, long edge 1024px |

`media_processing=STATIC` is set deliberately. Gemini's agentic video mode (added
2026-09-01) lets the model choose which segments to look at and cuts video tokens
by up to 88% — the opposite of what lip-reading needs.

## Running it

```bash
uv sync
export GEMINI_API_KEY=...      # Gemini arm
export ANTHROPIC_API_KEY=...   # Claude arm
export OPENAI_API_KEY=...      # GPT-6 Astra arm

uv run run.py --dry-run              # show what would be sent, call nothing
uv run run.py                        # all four models x four clips, 10fps
uv run run.py --preset baseline      # reproduce the 2026-03 conditions (1fps)
uv run run.py --sweep 1,5,10,30      # frame-rate sweep
uv run run.py --task describe        # positive control: can the model see the clip?
uv run run.py --model "Claude Opus 5" --clip clip_1
```

Each run writes `results/run_<timestamp>/` with `raw_responses.json`,
`summary.json` and `summary.md`. Results are committed, not ignored — the 2026-03
run left no per-clip artifacts behind, so only its averages survive.

Frame-rate note: the frame-sequence arm caps a request at `max_frames` (default
80) to stay under per-request image limits, so `--sweep 30` on an 8s clip lands
at an effective 10fps. Raise `--max-frames` for a true high-rate run, and check
your provider's image-count limit first. Every result records the `effective_fps`
actually sent.

## Preflight

`run.py` probes each clip before calling anything and refuses to run if a clip
carries a **non-silent** audio track — a model with native video input would
transcribe the audio rather than lip-read. The four committed clips carry a
silent (muted, not removed) AAC track, which passes.

## Metrics

WER / CER / string similarity against the ground-truth sentence, plus an outcome
label per response: `attempt`, `refusal`, `empty`, `truncated`, or `error`.
Averages are taken over attempts only. A refusal is not a failed lip-reading
attempt, and scoring one as WER 5.19 (as the 2026-03 run did) makes the average
meaningless.

Every model in the current lineup is a reasoning model whose thinking tokens
count against the output budget, so `max_output_tokens` defaults to 8000. The
2026-03 harness used 200, which would now truncate before any answer appeared —
that case is detected and labelled `truncated` rather than scored as a miss.
