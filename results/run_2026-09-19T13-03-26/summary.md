# Lip-Reading Results — lipread

Run: 2026-09-19T13-03-26

| Model | clip_1 | clip_2 | clip_3 | clip_4 | Avg WER | 1st-sentence WER | Best | Avg words | Attempts |
|---|---|---|---|---|---|---|---|---|---|
| Gemini 3.8 Flash | 4.80 | 2.80 | 0.86 | 3.40 | 3.56 | **2.96** | 0.86 | 18.75 | 4/4 |
| Gemini 3.1 Pro | _error_ | _error_ | _error_ | _error_ | — | **—** | — | — | 0/4 |
| Claude Opus 5 | 3.40 | 4.40 | 3.43 | 5.80 | 17.33 | **4.26** | 3.40 | 94.50 | 4/4 |
| Claude Fable 5.1 | 4.80 | 7.40 | _refusal_ | _refusal_ | 6.10 | **6.10** | 4.80 | 31.00 | 2/4 |
| GPT-6 Astra | 0.60 | 0.40 | 0.86 | 0.00 | 1.20 | **0.46** | 0.00 | 9.75 | 4/4 |

Per-clip cells are first-sentence WER. Models that answer and then loop
score badly on raw WER because the repetition counts as insertions, so the
first sentence is the fairer read. WER covers genuine attempts only;
refusals, empty and truncated responses are counted under Attempts.

## Responses

**Gemini 3.8 Flash** + clip_1 — _attempt_
- Ground truth: 'What are you doing today?'
- Response: 'So to all my teacher friends who are starting this week, or who are already back at school, I just wanted to say you got this.'
- WER: 4.80 | CER: 4.33 | Similarity: 0.22
- Request: {'video_mode': 'native_video', 'requested_fps': 10, 'media_resolution': 'HIGH', 'media_processing': 'STATIC', 'thinking_level': 'HIGH'}
- Usage: {'prompt_tokens': 21382, 'completion_tokens': 29, 'thinking_tokens': 14704}

**Gemini 3.8 Flash** + clip_2 — _attempt_
- Ground truth: "It's very warm this morning."
- Response: 'I just wanted to say thank you so much for all the birthday wishes'
- WER: 2.80 | CER: 2.00 | Similarity: 0.24
- Request: {'video_mode': 'native_video', 'requested_fps': 10, 'media_resolution': 'HIGH', 'media_processing': 'STATIC', 'thinking_level': 'HIGH'}
- Usage: {'prompt_tokens': 21382, 'completion_tokens': 14, 'thinking_tokens': 15361}

**Gemini 3.8 Flash** + clip_3 — _attempt_
- Ground truth: "I'd like to take a vacation soon."
- Response: "Can't wait to see you"
- WER: 0.86 | CER: 0.81 | Similarity: 0.31
- Request: {'video_mode': 'native_video', 'requested_fps': 10, 'media_resolution': 'HIGH', 'media_processing': 'STATIC', 'thinking_level': 'HIGH'}
- Usage: {'prompt_tokens': 26712, 'completion_tokens': 7, 'thinking_tokens': 15363}

**Gemini 3.8 Flash** + clip_4 — _attempt_
- Ground truth: 'Did you feed the dog?'
- Response: 'I get a lot of questions about the sunroom and if it gets too cold in the winter. It does get chilly in here, especially at night and in the'
- WER: 5.80 | CER: 6.10 | Similarity: 0.15
- Request: {'video_mode': 'native_video', 'requested_fps': 10, 'media_resolution': 'HIGH', 'media_processing': 'STATIC', 'thinking_level': 'HIGH'}
- Usage: {'prompt_tokens': 24047, 'completion_tokens': 33, 'thinking_tokens': 11557}

**Gemini 3.1 Pro** + clip_1 — _error_
- Ground truth: 'What are you doing today?'
- Response: 'None'
- Error: ClientError: 404 NOT_FOUND. {'error': {'code': 404, 'message': 'models/gemini-3.1-pro is not found for API version v1beta, or is not supported for generateContent. Call ModelService.ListModels to see the list of available models and their supported methods.', 'status': 'NOT_FOUND'}}

**Gemini 3.1 Pro** + clip_2 — _error_
- Ground truth: "It's very warm this morning."
- Response: 'None'
- Error: ClientError: 404 NOT_FOUND. {'error': {'code': 404, 'message': 'models/gemini-3.1-pro is not found for API version v1beta, or is not supported for generateContent. Call ModelService.ListModels to see the list of available models and their supported methods.', 'status': 'NOT_FOUND'}}

**Gemini 3.1 Pro** + clip_3 — _error_
- Ground truth: "I'd like to take a vacation soon."
- Response: 'None'
- Error: ClientError: 404 NOT_FOUND. {'error': {'code': 404, 'message': 'models/gemini-3.1-pro is not found for API version v1beta, or is not supported for generateContent. Call ModelService.ListModels to see the list of available models and their supported methods.', 'status': 'NOT_FOUND'}}

**Gemini 3.1 Pro** + clip_4 — _error_
- Ground truth: 'Did you feed the dog?'
- Response: 'None'
- Error: ClientError: 404 NOT_FOUND. {'error': {'code': 404, 'message': 'models/gemini-3.1-pro is not found for API version v1beta, or is not supported for generateContent. Call ModelService.ListModels to see the list of available models and their supported methods.', 'status': 'NOT_FOUND'}}

**Claude Opus 5** + clip_1 — _attempt_
- Ground truth: 'What are you doing today?'
- Response: "I don't know about you, but I'm so tired of feeling like I have to do everything myself. Like, why is it always me who has to remember? And I think a lot of women feel this way, you know? We're just exhausted. So I decided I'm done. I'm not doing it anymore. If you want something done, you can ask, or you can do it yourself. And honestly, it feels so good to finally say that out loud."
- WER: 15.40 | CER: 14.33 | Similarity: 0.00
- Request: {'video_mode': 'frame_sequence', 'route': 'openrouter', 'routed_model_id': 'anthropic/claude-opus-5', 'n_frames': 80, 'requested_fps': 10, 'effective_fps': 10.0, 'frame_width': 576, 'frame_height': 1024, 'crop': 'none'}
- Usage: {'prompt_tokens': 62496, 'completion_tokens': 127}

**Claude Opus 5** + clip_2 — _attempt_
- Ground truth: "It's very warm this morning."
- Response: "So I just wanted to come on here and share something with you guys, because I've been thinking about this a lot lately. You know, I've had so many people ask me about this, and honestly, I didn't really know what to say at first. But the more I thought about it, the more I realized how important it is to just be honest about where you're at. And I think a lot of us go through this and we don't tal"
- WER: 22.80 | CER: 20.00 | Similarity: 0.01
- Request: {'video_mode': 'frame_sequence', 'route': 'openrouter', 'routed_model_id': 'anthropic/claude-opus-5', 'n_frames': 80, 'requested_fps': 10, 'effective_fps': 10.0, 'frame_width': 576, 'frame_height': 1024, 'crop': 'none'}
- Usage: {'prompt_tokens': 62496, 'completion_tokens': 200}

**Claude Opus 5** + clip_3 — _attempt_
- Ground truth: "I'd like to take a vacation soon."
- Response: "I'm sitting here thinking about how much has changed over the past year, and honestly, I just wanted to share a few thoughts with you all. I know a lot of you have been asking me how I'm doing, and the truth is, some days are better than others. But I'm learning to take it one day at a time, and that's okay. So thank you for being here, and thank you for all your kind messages — they really do mea"
- WER: 11.71 | CER: 12.06 | Similarity: 0.01
- Request: {'video_mode': 'frame_sequence', 'route': 'openrouter', 'routed_model_id': 'anthropic/claude-opus-5', 'n_frames': 80, 'requested_fps': 10, 'effective_fps': 8.0, 'frame_width': 576, 'frame_height': 1024, 'crop': 'none'}
- Usage: {'prompt_tokens': 62496, 'completion_tokens': 128}

**Claude Opus 5** + clip_4 — _attempt_
- Ground truth: 'Did you feed the dog?'
- Response: "I've been thinking about this a lot lately, and I just wanted to share it with you guys, because I think a lot of people are going through the same thing. You know, it's one of those things where you don't really realize how much it affects you until you actually stop and look at it. And honestly, I feel so much better now that I've said it out loud. So if you're dealing with something similar, ju"
- WER: 19.40 | CER: 23.40 | Similarity: 0.00
- Request: {'video_mode': 'frame_sequence', 'route': 'openrouter', 'routed_model_id': 'anthropic/claude-opus-5', 'n_frames': 80, 'requested_fps': 10, 'effective_fps': 8.89, 'frame_width': 576, 'frame_height': 1024, 'crop': 'none'}
- Usage: {'prompt_tokens': 62496, 'completion_tokens': 147}

**Claude Fable 5.1** + clip_1 — _attempt_
- Ground truth: 'What are you doing today?'
- Response: "I don't know what you're going to do, but I think it's going to be really important that we figure it out before too long."
- WER: 4.80 | CER: 4.04 | Similarity: 0.26
- Request: {'video_mode': 'frame_sequence', 'route': 'openrouter', 'routed_model_id': 'anthropic/claude-fable-5.1', 'n_frames': 80, 'requested_fps': 10, 'effective_fps': 10.0, 'frame_width': 576, 'frame_height': 1024, 'crop': 'none'}
- Usage: {'prompt_tokens': 62498, 'completion_tokens': 33}

**Claude Fable 5.1** + clip_2 — _attempt_
- Ground truth: "It's very warm this morning."
- Response: "I just wanted to come on here and say thank you so much for all of your kind words and support, it really means a lot to me, and I'll keep you posted on how things go."
- WER: 7.40 | CER: 5.50 | Similarity: 0.15
- Request: {'video_mode': 'frame_sequence', 'route': 'openrouter', 'routed_model_id': 'anthropic/claude-fable-5.1', 'n_frames': 80, 'requested_fps': 10, 'effective_fps': 10.0, 'frame_width': 576, 'frame_height': 1024, 'crop': 'none'}
- Usage: {'prompt_tokens': 62498, 'completion_tokens': 133}

**Claude Fable 5.1** + clip_3 — _refusal_
- Ground truth: "I'd like to take a vacation soon."
- Response: 'I can\'t determine what\'s being said from these frames alone. Lip reading from still images isn\'t reliable — the visual mouth shapes are ambiguous and many different sounds look identical (e.g., "p," "b," and "m"). Without audio, any transcript I gave would be a guess rather than a genuine reading.'
- WER: 6.86 | CER: 8.03 | Similarity: 0.02
- Request: {'video_mode': 'frame_sequence', 'route': 'openrouter', 'routed_model_id': 'anthropic/claude-fable-5.1', 'n_frames': 80, 'requested_fps': 10, 'effective_fps': 8.0, 'frame_width': 576, 'frame_height': 1024, 'crop': 'none'}
- Usage: {'prompt_tokens': 62498, 'completion_tokens': 100}

**Claude Fable 5.1** + clip_4 — _refusal_
- Ground truth: 'Did you feed the dog?'
- Response: 'I can\'t reliably determine what\'s being said from these frames alone. Lip reading from still images is highly unreliable—many different sounds look identical on the lips (e.g., "p," "b," and "m"), and without audio, context, or continuous motion, any transcript I produced would be a guess rather than a genuine reading. The frames show a woman speaking calmly to the camera in a conversational, vlog'
- WER: 16.40 | CER: 24.15 | Similarity: 0.00
- Request: {'video_mode': 'frame_sequence', 'route': 'openrouter', 'routed_model_id': 'anthropic/claude-fable-5.1', 'n_frames': 80, 'requested_fps': 10, 'effective_fps': 8.89, 'frame_width': 576, 'frame_height': 1024, 'crop': 'none'}
- Usage: {'prompt_tokens': 62498, 'completion_tokens': 261}

**GPT-6 Astra** + clip_1 — _attempt_
- Ground truth: 'What are you doing today?'
- Response: 'So, what did you do today? What did you do today? What...'
- WER: 1.80 | CER: 1.33 | Similarity: 0.48
- Request: {'video_mode': 'frame_sequence', 'route': 'openrouter', 'routed_model_id': 'openai/gpt-6-astra', 'n_frames': 80, 'requested_fps': 10, 'effective_fps': 10.0, 'frame_width': 576, 'frame_height': 1024, 'crop': 'none'}
- Usage: {'prompt_tokens': 55429, 'completion_tokens': 1431}

**GPT-6 Astra** + clip_2 — _attempt_
- Ground truth: "It's very warm this morning."
- Response: 'It is very warm this morning.'
- WER: 0.40 | CER: 0.08 | Similarity: 0.96
- Request: {'video_mode': 'frame_sequence', 'route': 'openrouter', 'routed_model_id': 'openai/gpt-6-astra', 'n_frames': 80, 'requested_fps': 10, 'effective_fps': 10.0, 'frame_width': 576, 'frame_height': 1024, 'crop': 'none'}
- Usage: {'prompt_tokens': 55429, 'completion_tokens': 3333}

**GPT-6 Astra** + clip_3 — _attempt_
- Ground truth: "I'd like to take a vacation soon."
- Response: 'I like coffee too. I like coffee too.'
- WER: 1.00 | CER: 0.71 | Similarity: 0.52
- Request: {'video_mode': 'frame_sequence', 'route': 'openrouter', 'routed_model_id': 'openai/gpt-6-astra', 'n_frames': 80, 'requested_fps': 10, 'effective_fps': 8.0, 'frame_width': 576, 'frame_height': 1024, 'crop': 'none'}
- Usage: {'prompt_tokens': 55429, 'completion_tokens': 1967}

**GPT-6 Astra** + clip_4 — _attempt_
- Ground truth: 'Did you feed the dog?'
- Response: 'Did you feed the dog? Did you feed the dog? Did you feed...'
- WER: 1.60 | CER: 1.70 | Similarity: 0.54
- Request: {'video_mode': 'frame_sequence', 'route': 'openrouter', 'routed_model_id': 'openai/gpt-6-astra', 'n_frames': 80, 'requested_fps': 10, 'effective_fps': 8.89, 'frame_width': 576, 'frame_height': 1024, 'crop': 'none'}
- Usage: {'prompt_tokens': 55429, 'completion_tokens': 2021}
