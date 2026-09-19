# Selected Models

Run 2 lineup (2026-09). Prices are per million tokens.

## Native video input

### 1. Gemini 3.8 Flash — `gemini-3.8-flash`
- **Provider:** Google · **Input:** $0.75 · **Output:** $3.75 (introductory through 2026-12-31, then $1.50 / $7.50)
- **Why:** Current Flash-tier workhorse, released 2026-09-02. Takes text, image, audio, video and PDF with a 1M-token context. Run at thinking level `HIGH`, which Google recommends for split-second movement detection — the closest thing in their guidance to what lip-reading asks for.

### 2. Gemini 3.1 Pro — `gemini-3.1-pro`
- **Provider:** Google · **Input:** $2.00 · **Output:** $12.00
- **Why:** Still the Pro tier six months on (GA since 2026-02-19). Was the best of the Run 1 group at WER 0.95, so it is the direct point of comparison.

## Frame sequence (no video input)

### 3. Claude Opus 5 — `claude-opus-5`
- **Provider:** Anthropic · **Input:** $5.00 · **Output:** $25.00
- **Why:** Not in Run 1 at all. No native video, so frames go in as images and we set the frame rate ourselves — the cleanest test of the "1fps sampling is the bottleneck" hypothesis. Rejects `temperature`; thinking is on by default.

### 4. Claude Fable 5.1 — `claude-fable-5-1`
- **Provider:** Anthropic · **Input:** $10.00 · **Output:** $50.00
- **Why:** Anthropic's most capable model, on the same frame sequence as Opus 5 — so Fable-vs-Opus isolates model capability with the visual input held constant. Thinking is always on and cannot be disabled. Two caveats: it may return `stop_reason: "refusal"` with empty content (recorded as a refusal, not an empty response), and it requires 30-day data retention — a zero-data-retention org gets a 400.

### 5. GPT-6 Astra — `gpt-6-astra`
- **Provider:** OpenAI · **Input:** $10.00 · **Output:** $50.00
- **Why:** OpenAI's frontier model, lab-proclaimed AGI. Also image-only — OpenAI has no native video input — so it runs on the same frame sequence as Claude, which makes the two directly comparable. Rejects `temperature` and `top_p`; takes `reasoning.effort` up to `max`.

## Also configured (not run by default)

- **Gemini 3.7 Flash** — `gemini-3.7-flash`. Previous Flash generation (2026-08-13).
- **Gemini 3.6 Flash** — `gemini-3.6-flash`. Two generations back.

Both are there for a within-family comparison: if 3.8 Flash moves on this task
and its predecessors do not, that is a capability change rather than noise.

Select either with `--model "<name>"`.

## Model ids, verified against the live API (2026-09-19)

Checked with `client.models.list()` on the Gemini API and OpenRouter's
`/api/v1/models`. Both contradicted what published write-ups said, so treat the
endpoints as authoritative and re-check before a run.

| Id | Status |
|---|---|
| `gemini-3.1-pro-preview` | **Live.** No `gemini-3.1-pro` GA id exists — it 404s. Run 1 used this same id |
| `gemini-3-flash-preview` | **Live.** Superseded by 3.5-3.8 Flash, but still served |
| `gemini-3.1-flash-lite-preview` | **Live**, alongside the GA `gemini-3.1-flash-lite` |
| `gemini-embedding-2` | **Live.** GA; `gemini-embedding-2-preview` is also still served |
| `anthropic/claude-fable-5.1` | OpenRouter spells it with a **dot**, not `claude-fable-5-1` |

So Run 1's Gemini ids were never the blocker — they all still resolve. What did
have to change: `media_resolution` belongs on `GenerateContentConfig`, not on the
video `Part` (the per-Part field 400s), and the frame-sequence models reject
`temperature`.

Because `gemini-3.1-pro-preview` is the id Run 1 used and no GA replacement
exists, the Pro arm is a clean within-model control: same model, changed
conditions.

Qwen VL Max and the self-hosted MiniCPM arm are not part of Run 2; the Colab
notebook is left as-is.
