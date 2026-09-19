# Selected Models

Run 2 lineup (2026-09). Prices are per million tokens.

## Native video input

### 1. Gemini 3.7 Flash — `gemini-3.7-flash`
- **Provider:** Google · **Input:** $0.75 · **Output:** $3.75 (introductory through 2026-12-31, then $1.50 / $7.50)
- **Why:** Current Flash-tier workhorse, released 2026-08-13. Takes text, image, audio, video and PDF with a 1M-token context. Replaces the `gemini-3-flash-preview` used in Run 1.

### 2. Gemini 3.1 Pro — `gemini-3.1-pro`
- **Provider:** Google · **Input:** $2.00 · **Output:** $12.00
- **Why:** Still the Pro tier six months on (GA since 2026-02-19). Was the best of the Run 1 group at WER 0.95, so it is the direct point of comparison.

## Frame sequence (no video input)

### 3. Claude Opus 5 — `claude-opus-5`
- **Provider:** Anthropic · **Input:** $5.00 · **Output:** $25.00
- **Why:** Not in Run 1 at all. No native video, so frames go in as images and we set the frame rate ourselves — the cleanest test of the "1fps sampling is the bottleneck" hypothesis. Rejects `temperature`; thinking is on by default.

### 4. GPT-6 Astra — `gpt-6-astra`
- **Provider:** OpenAI · **Input:** $10.00 · **Output:** $50.00
- **Why:** OpenAI's frontier model, lab-proclaimed AGI. Also image-only — OpenAI has no native video input — so it runs on the same frame sequence as Claude, which makes the two directly comparable. Rejects `temperature` and `top_p`; takes `reasoning.effort` up to `max`.

## Also configured (not run by default)

- **Claude Fable 5.1** — `claude-fable-5-1`, $10 / $50. Anthropic's most capable model.
- **Gemini 3.6 Flash** — `gemini-3.6-flash`. Previous Flash generation, for a within-family comparison.

Select either with `--model "<name>"`.

## Retired since Run 1 (2026-03)

| Run 1 model | Status |
|---|---|
| `gemini-3.1-flash-lite-preview` | Shut down 2026-05-25. GA id is `gemini-3.1-flash-lite` |
| `gemini-3-flash-preview` | Superseded by 3.5 / 3.6 / 3.7 Flash |
| `gemini-3.1-pro-preview` | GA as `gemini-3.1-pro` since 2026-02-19 |
| `gemini-embedding-2-preview` | GA as `gemini-embedding-2` since 2026-04-22 |

Qwen VL Max and the self-hosted MiniCPM arm are not part of Run 2; the Colab
notebook is left as-is.
