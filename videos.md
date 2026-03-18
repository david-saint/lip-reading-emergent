# Lip-Reading Experiment: Source Videos

I have identified five high-quality videos that meet the criteria of being clear, front-facing, well-lit, and containing simple sentences.

## Selected Videos

| Video # | Source / Channel | Sentence | Video URL |
| :--- | :--- | :--- | :--- |
| 1 | Speech Pathology | **"The quick brown fox jumps over the lazy dog"** | [View Video](https://www.youtube.com/watch?v=Xoy_fJ-9hpQ) |
| 2 | Anglo-Fluency Academy | **"Do you understand?"** | [View Video](https://www.youtube.com/shorts/F6BvoaJk4OQ) |
| 3 | Lipreading Practice | **"It's very warm this morning."** | [View Video](https://www.youtube.com/shorts/0V7f0KRUurs) |
| 4 | HEARa | **"I'm going to the shop."** | [View Video](https://www.youtube.com/shorts/TvL3ahXnJU8) |
| 5 | Read Our Lips (CHHA-NL) | **"Life doesn't happen in a quiet room."** | [View Video](https://www.youtube.com/watch?v=kJqnYBjTea8) |

## Quality Verification

Each of these videos has been manually verified for the following standards:
- **Framing**: Tight close-up or medium close-up of the mouth and face.
- **Lighting**: Bright, even lighting with minimal shadows.
- **Articulation**: Clear and deliberate speech suitable for lip-reading models.

> [!TIP]
> For the experiment, you can use `ffmpeg` to strip the audio as outlined in the [README.md](file:///Users/saint/clients/lip-reading/README.md).
>
> ```bash
> ffmpeg -i input.mp4 -an -c:v copy silent.mp4
> ```

## Verification Proof

I have recorded the verification process for Video 1, which confirms it features the requested pangram "The quick brown fox...".

![Verification Recording](file:///Users/saint/.gemini/antigravity/brain/3e7ed4e6-c1a5-4ee5-b77a-075620a727b5/verify_video_quality_1773785812328.webp)
