import os

from openai import OpenAI

from config import SYSTEM_PROMPT, ModelConfig
from preprocessing import encode_video_base64, extract_frames_base64


def build_messages(clip_path: str, model_cfg: ModelConfig) -> list[dict]:
    if model_cfg.video_mode == "native_video":
        video_b64 = encode_video_base64(clip_path)
        content = [
            {"type": "text", "text": SYSTEM_PROMPT},
            {
                "type": "video_url",
                "video_url": {"url": f"data:video/mp4;base64,{video_b64}"},
            },
            {"type": "text", "text": "What is this person saying?"},
        ]
    else:
        frames = extract_frames_base64(clip_path, fps=model_cfg.fps or 5)
        content = [{"type": "text", "text": SYSTEM_PROMPT}]
        for frame_b64 in frames:
            content.append(
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{frame_b64}"},
                }
            )
        content.append({"type": "text", "text": "What is this person saying?"})

    return [{"role": "user", "content": content}]


def query_model(clip_path: str, model_cfg: ModelConfig) -> dict:
    client = OpenAI(
        base_url=model_cfg.base_url,
        api_key=os.environ[model_cfg.api_key_env],
        default_headers=model_cfg.extra_headers or {},
    )
    messages = build_messages(clip_path, model_cfg)
    response = client.chat.completions.create(
        model=model_cfg.model_id,
        messages=messages,
        max_tokens=200,
        temperature=0,
    )
    usage = response.usage
    return {
        "model": model_cfg.name,
        "model_id": model_cfg.model_id,
        "response": response.choices[0].message.content,
        "usage": {
            "prompt_tokens": usage.prompt_tokens if usage else 0,
            "completion_tokens": usage.completion_tokens if usage else 0,
        },
    }
