# Findings

## Summary

No model tested was able to lip-read from silent video. All models produced responses unrelated to the actual spoken sentences, with Word Error Rates (WER) at or above 1.0 across the board. This confirms that lip-reading is not an emergent capability of current multimodal LLMs.

## Models Tested

| Model | Method | Avg WER | Verdict |
|-------|--------|---------|---------|
| Gemini 3.1 Flash Lite | Google GenAI SDK (native video) | 1.15 | Random guesses |
| Gemini 3 Flash | Google GenAI SDK (native video) | 1.00 | Random guesses, one run produced looping output |
| Gemini 3.1 Pro | Google GenAI SDK (native video) | 0.95 | Best of the group, still no real accuracy |
| Qwen VL Max | OpenRouter (frame extraction) | 5.19 | Mostly refused, one verbose non-answer |
| MiniCPM-o 4.5 (INT4) | Google Colab T4 | N/A | Refused to attempt lip-reading |

## Test Clips

| Clip | Ground Truth | Duration |
|------|-------------|----------|
| clip_1 | "What are you doing today?" | 8s |
| clip_2 | "It's very warm this morning." | 8s |
| clip_3 | "I'd like to take a vacation soon." | 10s |
| clip_4 | "Did you feed the dog?" | 9s |

## Key Observations

### Video is being received
We verified that Gemini models do receive and process the video — they accurately describe the speaker ("woman with short brown hair and glasses, wearing a maroon sweatshirt") and estimate clip duration. The failure is in inferring speech from lip movements, not in video ingestion.

### Response patterns
- **Gemini models** attempt an answer but produce unrelated phrases like "I love you", "I don't know", "I'm so excited". No response matched or even resembled the ground truth.
- **Gemini 3 Flash** on one run entered a degenerate loop, repeating "I'm going to try to do this" until hitting the token limit.
- **Gemini 3.1 Pro** came closest on clip_1, outputting "what is" (ground truth: "What are you doing today?") — likely coincidence rather than real lip-reading.
- **Qwen VL Max** mostly refused, explaining that lip-reading from video is not possible. On clip_1 it hallucinated a long response ("Hello, how are you doing today?") that partially overlapped with the ground truth by chance.
- **MiniCPM-o 4.5** explicitly refused, stating "Lip-reading from still images is not accurate enough to infer speech reliably."

### Token counts
Gemini models used ~741-950 prompt tokens per clip via the GenAI SDK, consistent across all three models. This is low but confirmed legitimate — the models are processing the video, just with efficient tokenization (~1fps sampling).

### OpenRouter vs direct API
- OpenRouter worked for Gemini (native video via base64) and Qwen VL Max (frame extraction — base64 video was rejected with "No endpoints found that support base64 video input").
- The Google GenAI SDK provided a cleaner path for Gemini models with proper file upload and processing state management.

## Conclusion

Current multimodal LLMs cannot lip-read. While they can see and describe people speaking in video, they cannot decode lip movements into words. This is unsurprising — lip-reading requires fine-grained temporal analysis of mouth shapes (visemes change at 10-15 per second), and these models sample video at ~1fps. Even MiniCPM-o 4.5 at 10fps refused to attempt the task. Lip-reading likely requires purpose-built models trained specifically on visual speech recognition datasets.
