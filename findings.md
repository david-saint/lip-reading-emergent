# Findings

## Run 1 — 2026-03

### Summary

No model tested was able to lip-read from silent video. All models produced responses unrelated to the actual spoken sentences, with Word Error Rates (WER) at or above 1.0 across the board. This confirms that lip-reading is not an emergent capability of current multimodal LLMs.

### Models Tested

| Model | Method | Avg WER | Verdict |
|-------|--------|---------|---------|
| Gemini 3.1 Flash Lite | Google GenAI SDK (native video) | 1.15 | Random guesses |
| Gemini 3 Flash | Google GenAI SDK (native video) | 1.00 | Random guesses, one run produced looping output |
| Gemini 3.1 Pro | Google GenAI SDK (native video) | 0.95 | Best of the group, still no real accuracy |
| Qwen VL Max | OpenRouter (frame extraction) | 5.19 | Mostly refused, one verbose non-answer |
| MiniCPM-o 4.5 (INT4) | Google Colab T4 | N/A | Refused to attempt lip-reading |

### Test Clips

| Clip | Ground Truth | Duration |
|------|-------------|----------|
| clip_1 | "What are you doing today?" | 8s |
| clip_2 | "It's very warm this morning." | 8s |
| clip_3 | "I'd like to take a vacation soon." | 10s |
| clip_4 | "Did you feed the dog?" | 9s |

### Key Observations

#### Video is being received
We verified that Gemini models do receive and process the video — they accurately describe the speaker ("woman with short brown hair and glasses, wearing a maroon sweatshirt") and estimate clip duration. The failure is in inferring speech from lip movements, not in video ingestion.

#### Response patterns
- **Gemini models** attempt an answer but produce unrelated phrases like "I love you", "I don't know", "I'm so excited". No response matched or even resembled the ground truth.
- **Gemini 3 Flash** on one run entered a degenerate loop, repeating "I'm going to try to do this" until hitting the token limit.
- **Gemini 3.1 Pro** came closest on clip_1, outputting "what is" (ground truth: "What are you doing today?") — likely coincidence rather than real lip-reading.
- **Qwen VL Max** mostly refused, explaining that lip-reading from video is not possible. On clip_1 it hallucinated a long response ("Hello, how are you doing today?") that partially overlapped with the ground truth by chance.
- **MiniCPM-o 4.5** explicitly refused, stating "Lip-reading from still images is not accurate enough to infer speech reliably."

#### Token counts
Gemini models used ~741-950 prompt tokens per clip via the GenAI SDK, consistent across all three models. This is low but confirmed legitimate — the models are processing the video, just with efficient tokenization (~1fps sampling).

#### OpenRouter vs direct API
- OpenRouter worked for Gemini (native video via base64) and Qwen VL Max (frame extraction — base64 video was rejected with "No endpoints found that support base64 video input").
- The Google GenAI SDK provided a cleaner path for Gemini models with proper file upload and processing state management.

### Conclusion

Current multimodal LLMs cannot lip-read. While they can see and describe people speaking in video, they cannot decode lip movements into words. This is unsurprising — lip-reading requires fine-grained temporal analysis of mouth shapes (visemes change at 10-15 per second), and these models sample video at ~1fps. Even MiniCPM-o 4.5 at 10fps refused to attempt the task. Lip-reading likely requires purpose-built models trained specifically on visual speech recognition datasets.

### Caveats found when preparing Run 2

Three things about Run 1 that the write-up above does not reflect:

- **The clips still carry an audio track.** `videos/*.mp4` each contain an AAC
  stream — the audio was muted, not removed with `-an`. Every frame in every
  track is a constant 371-372 bytes, which is the signature of a constant
  (silent) signal, so the results stand. But models with native video input
  ingest audio, so this had to be verified rather than assumed. `run.py` now
  probes for it before each run.
- **The high-fps arm never ran at high fps.** MiniCPM was chosen specifically
  because it samples at 10fps. `colab_minicpm.ipynb` sets `MAX_FRAMES = 24`
  evenly spaced across the clip, which is ~3fps on an 8s clip. The hypothesis
  that motivated including it was not tested.
- **WER over refusals is not meaningful.** Qwen VL Max's 5.19 average is a
  measure of how verbose its refusal was, not of lip-reading accuracy. Run 2
  labels each response `attempt` / `refusal` / `empty` / `truncated` / `error`
  and averages over attempts only.

The per-clip artifacts from Run 1 were not committed (`results/` was in
`.gitignore`), so the tables above are all that survives of it.

## Run 2 — 2026-09-19

**GPT-6 Astra lip-read two of the four clips.** One exact match, one differing
only by a contraction. Run 1's conclusion — that lip-reading is not an emergent
capability of multimodal LLMs — no longer holds.

### Results

Per-clip figures are first-sentence WER (see *Why Run 1's metric hid this*).

| Model | clip_1 | clip_2 | clip_3 | clip_4 | Avg | Best | Avg words | Attempts |
|---|---|---|---|---|---|---|---|---|
| **GPT-6 Astra** | 0.60 | 0.40 | 0.86 | **0.00** | **0.46** | 0.00 | 9.75 | 4/4 |
| Gemini 3.1 Pro | 1.00 | 2.20 | 1.00 | 1.00 | 1.30 | 1.00 | 7.00 | 4/4 |
| Gemini 3.8 Flash | 4.80 | 2.80 | 0.86 | 3.40 | 2.96 | 0.86 | 18.75 | 4/4 |
| Claude Opus 5 | 3.40 | 4.40 | 3.43 | 5.80 | 4.26 | 3.40 | 94.50 | 4/4 |
| Claude Fable 5.1 | 4.80 | 7.40 | refusal | refusal | 6.10 | 4.80 | 31.00 | 2/4 |

### What GPT-6 Astra returned

| Clip | Ground truth | Response (first sentence) | WER |
|---|---|---|---|
| clip_4 | "Did you feed the dog?" | "Did you feed the dog?" | **0.00** |
| clip_2 | "It's very warm this morning." | "It is very warm this morning." | 0.40 |
| clip_1 | "What are you doing today?" | "So, what did you do today?" | 0.60 |
| clip_3 | "I'd like to take a vacation soon." | "I like coffee too." | 0.86 |

### Ruling out the obvious explanations

- **Not audio.** The frame-sequence arm decodes the clip to JPEGs with OpenCV and
  sends images. There is no audio path in that code — nothing to transcribe.
- **Not captions.** Frames from clip_2 and clip_4 were inspected directly: a
  speaker against a sunroom window, no text overlay anywhere in frame.
- **Not chance.** Recovering "Did you feed the dog?" verbatim is not a lucky guess.

**The confound that remains is training-data contamination.** All four clips show
the same speaker and setting, so they come from one source, and they were sourced
from YouTube. A model that had memorized the source video could recall the
transcript from its appearance rather than read the lips.

Two things argue against it. A memorizing model should get all four clips right;
Astra missed clip_3. And its errors track *visual* ambiguity rather than memory
failure: on clip_3 it recovered the opening "I('d) like" and then diverged, and on
clip_1 it produced a visually near-identical paraphrase ("what did you do today"
for "what are you doing today"). That is the signature of viseme confusion.

The decisive test is a clip the model cannot have seen — record a new one and
re-run. Until then this is strong evidence, not proof.

### The frame-rate hypothesis is disconfirmed

Run 1 attributed the failure to ~1fps sampling against 10-15 visemes/sec. Run 2
tested it directly: both Gemini arms ran at 10fps with `media_resolution=HIGH`
(2,325 prompt tokens per clip against Run 1's 741 — roughly 3x the detail per
frame) and thinking level HIGH.

It changed nothing. Gemini 3.1 Pro — the same `gemini-3.1-pro-preview` id Run 1
used, making this a true within-model control — went from 0.95 avg WER to 1.30.
Still no lip-reading at ten times the frame rate.

Meanwhile GPT-6 Astra succeeded at the *same* 10fps. At matched frame rate the
difference is the model, not the sampling. Frame rate was never the binding
constraint.

### Why Run 1's metric hid this

Astra answers correctly and then repeats itself. Raw WER counts the repetition as
insertions, so its exact match on clip_4 scored **1.60** and its near-match on
clip_1 scored 1.80. Averaged, Astra looked like a 1.20 — a failure. Scoring the
first sentence gives 0.00 and 0.60.

Run 1 would have made the same mistake: its aggregate WER could only ever say
"all models fail", because a correct-then-verbose answer and a confabulation both
land above 1.0. Both metrics are now recorded per response.

### Failure modes, which differ sharply by model

- **GPT-6 Astra** — terse, correct, then loops.
- **Gemini 3.1 Pro** — short, plausible, wrong ("I think I just swallowed a fly").
- **Gemini 3.8 Flash** — invents social-media voiceover ("So to all my teacher
  friends who are starting this week...").
- **Claude Opus 5** — confabulates at length. 94 words on average against
  8-second clips, in fluent first-person influencer register, with no hedging.
  The most confidently wrong model in the run.
- **Claude Fable 5.1** — the only model to decline, on 2 of 4 clips, correctly
  noting that "p", "b" and "m" are visually identical. On the other two it
  confabulated like the rest.

### Cost

$6.70 for 24 calls, against a $8-12 estimate.

| Model | Input tokens | Output | Cost |
|---|---|---|---|
| Gemini 3.8 Flash | 93,523 | 83 | $0.07 |
| Gemini 3.1 Pro | 93,523 | 34 | $0.19 |
| Claude Opus 5 | 249,984 | 602 | $1.26 |
| Claude Fable 5.1 | 249,992 | 527 | $2.53 |
| GPT-6 Astra | 221,716 | 8,752 | $2.65 |

### What would settle it

1. **A new clip, recorded now.** Removes the contamination confound entirely.
2. **More clips.** n=4 with one model succeeding twice is a signal, not a rate.
3. **The `describe` positive control**, which has not been run yet.
4. **An fps sweep on Astra** — it succeeded at 10fps; does it hold at 1fps?
   That isolates whether frame rate matters for the model that can do the task.
