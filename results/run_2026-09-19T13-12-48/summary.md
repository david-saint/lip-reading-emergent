# Lip-Reading Results — lipread

Run: 2026-09-19T13-12-48

| Model | clip_1 | clip_2 | clip_3 | clip_4 | Avg WER | 1st-sentence WER | Best | Avg words | Attempts |
|---|---|---|---|---|---|---|---|---|---|
| Gemini 3.1 Pro | 1.00 | 2.20 | 1.00 | 1.00 | 1.30 | **1.30** | 1.00 | 7.00 | 4/4 |

Per-clip cells are first-sentence WER. Models that answer and then loop
score badly on raw WER because the repetition counts as insertions, so the
first sentence is the fairer read. WER covers genuine attempts only;
refusals, empty and truncated responses are counted under Attempts.

## Responses

**Gemini 3.1 Pro** + clip_1 — _attempt_
- Ground truth: 'What are you doing today?'
- Response: 'What do we have to do'
- WER: 1.00 | CER: 0.58 | Similarity: 0.49
- Request: {'video_mode': 'native_video', 'requested_fps': 10, 'media_resolution': 'HIGH', 'media_processing': 'STATIC', 'thinking_level': 'HIGH'}
- Usage: {'prompt_tokens': 21382, 'completion_tokens': 6, 'thinking_tokens': 1944}

**Gemini 3.1 Pro** + clip_2 — _attempt_
- Ground truth: "It's very warm this morning."
- Response: "I don't want to complain but I don't want to work"
- WER: 2.20 | CER: 1.46 | Similarity: 0.30
- Request: {'video_mode': 'native_video', 'requested_fps': 10, 'media_resolution': 'HIGH', 'media_processing': 'STATIC', 'thinking_level': 'HIGH'}
- Usage: {'prompt_tokens': 21382, 'completion_tokens': 15, 'thinking_tokens': 1288}

**Gemini 3.1 Pro** + clip_3 — _attempt_
- Ground truth: "I'd like to take a vacation soon."
- Response: 'I think I just swallowed a fly'
- WER: 1.00 | CER: 0.81 | Similarity: 0.26
- Request: {'video_mode': 'native_video', 'requested_fps': 10, 'media_resolution': 'HIGH', 'media_processing': 'STATIC', 'thinking_level': 'HIGH'}
- Usage: {'prompt_tokens': 26712, 'completion_tokens': 7, 'thinking_tokens': 1510}

**Gemini 3.1 Pro** + clip_4 — _attempt_
- Ground truth: 'Did you feed the dog?'
- Response: "I'm just reflecting on"
- WER: 1.00 | CER: 0.80 | Similarity: 0.15
- Request: {'video_mode': 'native_video', 'requested_fps': 10, 'media_resolution': 'HIGH', 'media_processing': 'STATIC', 'thinking_level': 'HIGH'}
- Usage: {'prompt_tokens': 24047, 'completion_tokens': 6, 'thinking_tokens': 1619}
