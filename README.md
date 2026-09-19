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
| `native_video` | Gemini 3.8 Flash, Gemini 3.1 Pro | `fps` passed as `videoMetadata`, `media_resolution=HIGH`, `media_processing=STATIC`, thinking level `HIGH` |
| `frame_sequence` | Claude Opus 5, Claude Fable 5.1, GPT-6 Astra | extracted locally at `fps`, capped at `max_frames`, long edge 1024px |

`media_processing=STATIC` is set deliberately. Gemini's agentic video mode (added
2026-09-01) lets the model choose which segments to look at and cuts video tokens
by up to 88% — the opposite of what lip-reading needs.

## Running it

```bash
uv sync
export GEMINI_API_KEY=...      # Gemini arm (always direct)
export ANTHROPIC_API_KEY=...   # Claude arms, direct route
export OPENAI_API_KEY=...      # GPT-6 Astra, direct route

uv run run.py --dry-run              # show what would be sent, call nothing
uv run run.py                        # all five models x four clips, 10fps
uv run run.py --preset baseline      # reproduce the 2026-03 conditions (1fps)
uv run run.py --sweep 1,5,10,30      # frame-rate sweep
uv run run.py --task describe        # positive control: can the model see the clip?
uv run run.py --model "Claude Opus 5" --clip clip_1
```

### One key instead of three

`--route openrouter` sends the frame-sequence arms (both Claude models and
GPT-6 Astra) through `OPENROUTER_API_KEY`:

```bash
export GEMINI_API_KEY=... OPENROUTER_API_KEY=...
uv run run.py --route openrouter
```

The Gemini arm always stays on the GenAI SDK. OpenRouter does carry one of
Gemini's video controls — `processing: "agentic" | "static"` on the `video_url`
part, which is `media_processing` under another name — but not `videoMetadata.fps`
or `media_resolution`. Frame rate is the variable this run exists to vary, and
OpenRouter drops an unsupported field rather than erroring, so a routed Gemini
call would silently sample at the 1fps default while the results file claimed
10fps.

Two things to check before trusting an OpenRouter run: the ids in
`config.py` (`openrouter_id`) against `https://openrouter.ai/api/v1/models`,
since coverage of the newest models lags their direct APIs; and request size —
a 10fps frame arm sends roughly 8MB of base64, so lower `--fps` or
`--max-frames` if the gateway rejects it.

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

## A note on fallbacks

The Claude arm deliberately does **not** enable server-side refusal fallbacks.
A fallback would let another model answer under this model's name, which is
fine in production and fatal to a comparison.

## Metrics

WER / CER / string similarity against the ground-truth sentence, plus an outcome
label per response: `attempt`, `refusal`, `empty`, `truncated`, or `error`. A
Claude `stop_reason: "refusal"` counts as a refusal even when the content is
empty, so a safety decline is never mistaken for a blank answer.
Averages are taken over attempts only. A refusal is not a failed lip-reading
attempt, and scoring one as WER 5.19 (as the 2026-03 run did) makes the average
meaningless.

Every model in the current lineup is a reasoning model whose thinking tokens
count against the output budget, so `max_output_tokens` defaults to 16000. The
2026-03 harness used 200, which would now truncate before any answer appeared —
that case is detected and labelled `truncated` rather than scored as a miss.
