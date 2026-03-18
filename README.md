# Lip Reading with Multimodal LLMs

An experiment to investigate whether multimodal LLMs can "read lips" — given a video of someone speaking with the audio stripped out, can the model infer what was said based on visual cues alone?

This is a curiosity-driven exploration, not a production system. We're testing the emergent capabilities of general-purpose vision-language models on a task they were never explicitly trained for.

## How It Works

1. Take a video of someone speaking
2. Strip the audio (`ffmpeg -i input.mp4 -an -c:v copy silent.mp4`)
3. Feed the silent video to various multimodal LLMs
4. Ask the model to infer what was said
5. Compare results across models
