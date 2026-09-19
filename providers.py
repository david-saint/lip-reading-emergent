"""One query function per provider, returning a uniform result dict.

Three arms:
  gemini     native video, with explicit fps / media-resolution control
  anthropic  frame sequence (Claude has no video input)
  openai     frame sequence (GPT-6 Astra has no video input)
"""

import os

from config import TASKS, ModelConfig
from preprocessing import FrameSet, encode_video_base64, extract_frames


def _require_key(model_cfg: ModelConfig) -> str:
    key = os.environ.get(model_cfg.api_key_env)
    if not key:
        raise RuntimeError(
            f"{model_cfg.name} needs {model_cfg.api_key_env} to be set in the environment"
        )
    return key


def _frames_for(clip_path: str, model_cfg: ModelConfig) -> FrameSet:
    return extract_frames(
        clip_path,
        fps=model_cfg.fps,
        max_frames=model_cfg.max_frames,
        max_long_edge=model_cfg.max_long_edge,
        jpeg_quality=model_cfg.jpeg_quality,
    )


def query_gemini(clip_path: str, model_cfg: ModelConfig, task: str) -> dict:
    from google import genai
    from google.genai import types

    system_prompt, question = TASKS[task]
    client = genai.Client(api_key=_require_key(model_cfg))

    video_part = types.Part(
        inline_data=types.Blob(
            data=open(clip_path, "rb").read(), mime_type="video/mp4"
        ),
        video_metadata=types.VideoMetadata(fps=model_cfg.fps),
        # STATIC, never AGENTIC: agentic processing lets the model skip
        # segments, which is the opposite of what lip-reading needs.
        media_processing=types.MediaProcessing.STATIC,
    )
    if model_cfg.media_resolution:
        video_part.media_resolution = getattr(
            types.MediaResolution, f"MEDIA_RESOLUTION_{model_cfg.media_resolution}"
        )

    response = client.models.generate_content(
        model=model_cfg.model_id,
        contents=[types.Content(role="user", parts=[video_part, types.Part(text=question)])],
        config=types.GenerateContentConfig(
            system_instruction=system_prompt,
            temperature=0,
            max_output_tokens=model_cfg.max_output_tokens,
        ),
    )

    usage = response.usage_metadata
    candidate = (response.candidates or [None])[0]
    finish = getattr(candidate, "finish_reason", None)
    return {
        "response": response.text,
        "usage": {
            "prompt_tokens": getattr(usage, "prompt_token_count", 0) or 0,
            "completion_tokens": getattr(usage, "candidates_token_count", 0) or 0,
            "thinking_tokens": getattr(usage, "thoughts_token_count", 0) or 0,
        },
        "stop_reason": str(finish) if finish else None,
        "request_meta": {
            "video_mode": "native_video",
            "requested_fps": model_cfg.fps,
            "media_resolution": model_cfg.media_resolution or "default",
            "media_processing": "STATIC",
        },
    }


def query_anthropic(clip_path: str, model_cfg: ModelConfig, task: str) -> dict:
    import anthropic

    system_prompt, question = TASKS[task]
    client = anthropic.Anthropic(api_key=_require_key(model_cfg))
    frame_set = _frames_for(clip_path, model_cfg)

    content: list[dict] = [
        {
            "type": "image",
            "source": {"type": "base64", "media_type": "image/jpeg", "data": frame},
        }
        for frame in frame_set.frames
    ]
    content.append({"type": "text", "text": question})

    kwargs = {}
    if model_cfg.effort:
        kwargs["output_config"] = {"effort": model_cfg.effort}

    # No temperature: current Claude models reject sampling parameters.
    response = client.messages.create(
        model=model_cfg.model_id,
        max_tokens=model_cfg.max_output_tokens,
        system=system_prompt,
        messages=[{"role": "user", "content": content}],
        **kwargs,
    )

    text = "".join(b.text for b in response.content if b.type == "text")
    usage = response.usage
    return {
        "response": text or None,
        "usage": {
            "prompt_tokens": usage.input_tokens,
            "completion_tokens": usage.output_tokens,
        },
        "stop_reason": response.stop_reason,
        "request_meta": {"video_mode": "frame_sequence", **frame_set.meta},
    }


def query_openai(clip_path: str, model_cfg: ModelConfig, task: str) -> dict:
    from openai import OpenAI

    system_prompt, question = TASKS[task]
    client = OpenAI(api_key=_require_key(model_cfg))
    frame_set = _frames_for(clip_path, model_cfg)

    content: list[dict] = [
        {
            "type": "input_image",
            "detail": "high",
            "image_url": f"data:image/jpeg;base64,{frame}",
        }
        for frame in frame_set.frames
    ]
    content.append({"type": "input_text", "text": question})

    kwargs = {}
    if model_cfg.effort:
        kwargs["reasoning"] = {"effort": model_cfg.effort}

    # No temperature: gpt-6-astra rejects temperature and top_p.
    response = client.responses.create(
        model=model_cfg.model_id,
        instructions=system_prompt,
        input=[{"role": "user", "content": content}],
        max_output_tokens=model_cfg.max_output_tokens,
        **kwargs,
    )

    usage = response.usage
    details = getattr(usage, "output_tokens_details", None)
    return {
        "response": response.output_text or None,
        "usage": {
            "prompt_tokens": getattr(usage, "input_tokens", 0),
            "completion_tokens": getattr(usage, "output_tokens", 0),
            "thinking_tokens": getattr(details, "reasoning_tokens", 0) if details else 0,
        },
        "stop_reason": response.status,
        "request_meta": {"video_mode": "frame_sequence", **frame_set.meta},
    }


PROVIDERS = {
    "gemini": query_gemini,
    "anthropic": query_anthropic,
    "openai": query_openai,
}


def query_model(clip_path: str, model_cfg: ModelConfig, task: str = "lipread") -> dict:
    try:
        provider = PROVIDERS[model_cfg.provider]
    except KeyError:
        raise ValueError(f"Unknown provider {model_cfg.provider!r}") from None
    return provider(clip_path, model_cfg, task)


def describe_request(clip_path: str, model_cfg: ModelConfig) -> dict:
    """What a call would send, without sending it (for --dry-run)."""
    if model_cfg.video_mode == "native_video":
        payload_bytes = len(encode_video_base64(clip_path))
        return {
            "video_mode": "native_video",
            "requested_fps": model_cfg.fps,
            "media_resolution": model_cfg.media_resolution or "default",
            "payload_kb": round(payload_bytes / 1024),
        }
    frame_set = _frames_for(clip_path, model_cfg)
    payload_bytes = sum(len(f) for f in frame_set.frames)
    return {
        **frame_set.meta,
        "video_mode": "frame_sequence",
        "payload_kb": round(payload_bytes / 1024),
    }
