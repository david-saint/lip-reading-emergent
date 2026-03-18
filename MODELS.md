# Selected Models

## 1. Gemini 3.1 Flash Lite
- **Provider:** Google · **Type:** API · **Input:** $0.25/M tokens · **Output:** $1.50/M tokens
- **Why:** Cheapest model with native video input. Scores 84.8% on Video-MMMU, the most relevant benchmark. A 30-second clip costs < $0.001.

## 2. Gemini 3 Flash
- **Provider:** Google · **Type:** API · **Input:** $0.50/M tokens · **Output:** $3.00/M tokens
- **Why:** Same family as Flash Lite but slightly more capable (79% MMMU Pro). Lets us A/B test whether the 2× price bump within Gemini's own lineup improves lip-reading ability.

## 3. Qwen VL Max
- **Provider:** Alibaba · **Type:** API · **Input:** $0.80/M tokens · **Output:** $3.20/M tokens
- **Why:** Non-Google API model with native video support. Adds diversity to the model family mix and represents a mid-range price point.

## 4. MiniCPM-o 4.5
- **Provider:** OpenBMB · **Type:** Self-hosted (9B params) · **Cost:** Free (needs ~24GB VRAM)
- **Why:** The dark horse. Samples at 10 fps — 10× more visual data than Gemini's 1 fps. If any model can catch fast mouth movements (10-15 visemes/sec in speech), it's this one. Also supports full-duplex live video streaming.

## 5. GPT-4o mini
- **Provider:** OpenAI · **Type:** API · **Input:** $0.15/M tokens · **Output:** $0.60/M tokens
- **Why:** Doesn't support native video — we extract frames and send as an image sequence. This is actually useful because we control the frame rate ourselves (can try 5fps, 10fps, etc.), giving an interesting comparison against native video models.
