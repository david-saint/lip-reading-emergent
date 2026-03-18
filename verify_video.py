"""Verify that Gemini models are actually receiving and processing video content."""

from google import genai
from google.genai import types
import time

client = genai.Client()


def wait_for_active(file_ref, timeout=60):
    deadline = time.time() + timeout
    while time.time() < deadline:
        f = client.files.get(name=file_ref.name)
        if f.state.name == "ACTIVE":
            return f
        print(f"  File state: {f.state.name}, waiting...", flush=True)
        time.sleep(2)
    raise TimeoutError(f"File {file_ref.name} did not become ACTIVE")


# Upload once
print("Uploading clip_1.mp4...")
video_file = client.files.upload(file="videos/clip_1.mp4")
video_file = wait_for_active(video_file)
print(f"File ready: {video_file.name} ({video_file.size_bytes} bytes)\n")

models = [
    "gemini-3.1-flash-lite-preview",
    "gemini-3-flash-preview",
    "gemini-3.1-pro-preview",
]

for model_id in models:
    print(f"=== {model_id} ===")

    # Test 1: Ask to describe the video (proves it can see it)
    print("  Test 1: Describe what you see...")
    r1 = client.models.generate_content(
        model=model_id,
        contents=[
            types.Content(parts=[
                types.Part.from_uri(file_uri=video_file.uri, mime_type="video/mp4"),
                types.Part(text="Describe in detail what you see in this video. What does the person look like? What are they doing? How many seconds long is it?"),
            ])
        ],
        config=types.GenerateContentConfig(temperature=0, max_output_tokens=500),
    )
    usage1 = r1.usage_metadata
    print(f"  Tokens: prompt={usage1.prompt_token_count}, completion={usage1.candidates_token_count}")
    print(f"  Response: {r1.text[:200]}")
    print()

    # Test 2: Lip-reading prompt
    print("  Test 2: Lip-read...")
    r2 = client.models.generate_content(
        model=model_id,
        contents=[
            types.Content(parts=[
                types.Part.from_uri(file_uri=video_file.uri, mime_type="video/mp4"),
                types.Part(text="This is a silent video of a person speaking. The audio has been removed. What words are they saying? Try your best guess based on lip movements."),
            ])
        ],
        config=types.GenerateContentConfig(temperature=0, max_output_tokens=200),
    )
    usage2 = r2.usage_metadata
    print(f"  Tokens: prompt={usage2.prompt_token_count}, completion={usage2.candidates_token_count}")
    print(f"  Response: {r2.text[:200]}")
    print()
    time.sleep(1)
