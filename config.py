from dataclasses import dataclass
from pathlib import Path

BASE_DIR = Path(__file__).parent


@dataclass
class Clip:
    id: str
    path: str
    ground_truth: str
    duration_seconds: float

    @property
    def full_path(self) -> str:
        return str(BASE_DIR / self.path)


@dataclass
class ModelConfig:
    name: str
    model_id: str
    provider: str  # "gemini" | "anthropic" | "openai" | "openrouter"
    video_mode: str  # "native_video" | "frame_sequence"
    api_key_env: str
    fps: float = 10.0
    max_frames: int = 80  # frame_sequence only; stays under per-request image caps
    max_long_edge: int = 1024  # frame_sequence only
    jpeg_quality: int = 80  # frame_sequence only; 80 keeps a 10fps request under ~8MB
    media_resolution: str | None = None  # gemini only: LOW | MEDIUM | HIGH
    thinking_level: str | None = None  # gemini only: MINIMAL | LOW | MEDIUM | HIGH
    effort: str | None = None  # anthropic / openai reasoning effort
    max_output_tokens: int = 16000
    openrouter_id: str | None = None  # used by --route openrouter
    notes: str = ""


CLIPS = [
    Clip("clip_1", "videos/clip_1.mp4", "What are you doing today?", 8),
    Clip("clip_2", "videos/clip_2.mp4", "It's very warm this morning.", 8),
    Clip("clip_3", "videos/clip_3.mp4", "I'd like to take a vacation soon.", 10),
    Clip("clip_4", "videos/clip_4.mp4", "Did you feed the dog?", 9),
]

MODELS = [
    ModelConfig(
        name="Gemini 3.8 Flash",
        model_id="gemini-3.8-flash",
        provider="gemini",
        video_mode="native_video",
        api_key_env="GEMINI_API_KEY",
        fps=10,
        media_resolution="HIGH",
        thinking_level="HIGH",
        notes="Native video, released 2026-09-02. Google recommends thinking "
        "level HIGH for split-second movement detection.",
    ),
    ModelConfig(
        name="Gemini 3.1 Pro",
        model_id="gemini-3.1-pro",
        provider="gemini",
        video_mode="native_video",
        api_key_env="GEMINI_API_KEY",
        fps=10,
        media_resolution="HIGH",
        thinking_level="HIGH",
        notes="Native video. GA id; the 2026-03 run used the retired -preview id.",
    ),
    ModelConfig(
        name="Claude Opus 5",
        model_id="claude-opus-5",
        provider="anthropic",
        video_mode="frame_sequence",
        api_key_env="ANTHROPIC_API_KEY",
        fps=10,
        effort="high",
        openrouter_id="anthropic/claude-opus-5",
        notes="No video input — frames as images, so we control the frame rate.",
    ),
    ModelConfig(
        name="Claude Fable 5.1",
        model_id="claude-fable-5-1",
        provider="anthropic",
        video_mode="frame_sequence",
        api_key_env="ANTHROPIC_API_KEY",
        fps=10,
        effort="high",
        openrouter_id="anthropic/claude-fable-5-1",
        notes="Anthropic's most capable model. Thinking is always on; may "
        "return stop_reason=refusal. Needs 30-day data retention.",
    ),
    ModelConfig(
        name="GPT-6 Astra",
        model_id="gpt-6-astra",
        provider="openai",
        video_mode="frame_sequence",
        api_key_env="OPENAI_API_KEY",
        fps=10,
        effort="high",
        openrouter_id="openai/gpt-6-astra",
        notes="No video input — frames as images. Rejects temperature/top_p.",
    ),
]

# Not run by default; select with --model "<name>".
EXTRA_MODELS = [
    ModelConfig(
        name="Gemini 3.7 Flash",
        model_id="gemini-3.7-flash",
        provider="gemini",
        video_mode="native_video",
        api_key_env="GEMINI_API_KEY",
        fps=10,
        media_resolution="HIGH",
        thinking_level="HIGH",
        notes="Previous Flash generation (2026-08-13), for a within-family comparison.",
    ),
    ModelConfig(
        name="Gemini 3.6 Flash",
        model_id="gemini-3.6-flash",
        provider="gemini",
        video_mode="native_video",
        api_key_env="GEMINI_API_KEY",
        fps=10,
        media_resolution="HIGH",
        thinking_level="HIGH",
        notes="Two Flash generations back, for a within-family comparison.",
    ),
]

ALL_MODELS = MODELS + EXTRA_MODELS

# Reproduces the 2026-03 conditions: Gemini's 1fps default at default media
# resolution, and sparse frame sampling for everything else.
BASELINE_PRESET = {"fps": 1.0, "media_resolution": None, "max_frames": 24}

SYSTEM_PROMPT = (
    "You are analyzing a silent video of a person speaking. "
    "The audio has been removed. Based solely on the visual movement "
    "of the speaker's lips, face, and mouth, infer what they are saying. "
    "Respond with ONLY the words you believe were spoken, nothing else."
)

LIPREAD_PROMPT = "What is this person saying?"

# Positive control: if a model cannot describe the clip, a failure to lip-read
# says nothing about lip-reading.
DESCRIBE_PROMPT = (
    "Describe in detail what you see. What does the person look like, and what "
    "are they doing? How many seconds long is the clip, and roughly how many "
    "distinct mouth movements does the speaker make?"
)

TASKS = {
    "lipread": (SYSTEM_PROMPT, LIPREAD_PROMPT),
    "describe": ("You are analyzing a silent video clip.", DESCRIBE_PROMPT),
}

OPENROUTER_BASE = "https://openrouter.ai/api/v1"
OPENROUTER_HEADERS = {"HTTP-Referer": "https://lip-reading-experiment"}
