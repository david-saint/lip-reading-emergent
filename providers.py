"""One query function per provider, returning a uniform result dict.

Three arms:
  gemini     native video, with explicit fps / media-resolution control
  anthropic  frame sequence (Claude has no video input)
  openai     frame sequence (GPT-6 Astra has no video input)

`--route openrouter` sends the two frame-sequence arms through OpenRouter on a
single key instead of one key per vendor. It cannot carry the Gemini arm: the
OpenAI-compatible chat schema has no way to express `videoMetadata.fps`,
`media_resolution` or `media_processing`, which are the whole point of this run.
"""

import os

from config import OPENROUTER_BASE, OPENROUTER_HEADERS, TASKS, ModelConfig
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
            thinking_config=(
                types.ThinkingConfig(
                    thinking_level=getattr(types.ThinkingLevel, model_cfg.thinking_level)
                )
                if model_cfg.thinking_level
                else None
            ),
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
            "thinking_level": model_cfg.thinking_level or "default",
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

    # No temperature: current Claude models reject sampling parameters. No
    # server-side `fallbacks` either — a rescue by another model would be
    # recorded under this model's name and corrupt the comparison.
    response = client.messages.create(
        model=model_cfg.model_id,
        max_tokens=model_cfg.max_output_tokens,
        system=system_prompt,
        messages=[{"role": "user", "content": content}],
        **kwargs,
    )

    text = "".join(b.text for b in response.content if b.type == "text")
    if response.stop_reason == "refusal":
        details = getattr(response, "stop_details", None)
        category = getattr(details, "category", None)
        explanation = getattr(details, "explanation", "") or ""
        text = text or f"[refusal: {category}] {explanation}".strip()
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


def query_openrouter(clip_path: str, model_cfg: ModelConfig, task: str) -> dict:
    """Frame-sequence arms via OpenRouter's OpenAI-compatible chat endpoint."""
    from openai import OpenAI

    if not model_cfg.openrouter_id:
        raise RuntimeError(f"{model_cfg.name} has no openrouter_id set in config.py")

    system_prompt, question = TASKS[task]
    client = OpenAI(
        base_url=OPENROUTER_BASE,
        api_key=_require_key(model_cfg),
        default_headers=OPENROUTER_HEADERS,
    )
    frame_set = _frames_for(clip_path, model_cfg)

    content: list[dict] = [
        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{frame}"}}
        for frame in frame_set.frames
    ]
    content.append({"type": "text", "text": question})

    extra_body = {"reasoning": {"effort": model_cfg.effort}} if model_cfg.effort else {}

    # No temperature: both frame-sequence models reject sampling parameters.
    response = client.chat.completions.create(
        model=model_cfg.openrouter_id,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": content},
        ],
        max_tokens=model_cfg.max_output_tokens,
        extra_body=extra_body,
    )

    choice = response.choices[0]
    usage = response.usage
    return {
        "response": choice.message.content or None,
        "usage": {
            "prompt_tokens": getattr(usage, "prompt_tokens", 0) if usage else 0,
            "completion_tokens": getattr(usage, "completion_tokens", 0) if usage else 0,
        },
        "stop_reason": choice.finish_reason,
        "request_meta": {
            "video_mode": "frame_sequence",
            "route": "openrouter",
            "routed_model_id": model_cfg.openrouter_id,
            **frame_set.meta,
        },
    }


PROVIDERS = {
    "gemini": query_gemini,
    "anthropic": query_anthropic,
    "openai": query_openai,
    "openrouter": query_openrouter,
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
    routed = (
        {"route": "openrouter", "routed_model_id": model_cfg.openrouter_id}
        if model_cfg.provider == "openrouter"
        else {}
    )
    return {
        **frame_set.meta,
        **routed,
        "video_mode": "frame_sequence",
        "payload_kb": round(payload_bytes / 1024),
    }
