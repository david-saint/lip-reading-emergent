from dataclasses import dataclass, field
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
    base_url: str
    api_key_env: str
    video_mode: str  # "native_video" | "frame_sequence"
    fps: float | None = None
    extra_headers: dict = field(default_factory=dict)


CLIPS = [
    Clip("clip_1", "videos/clip_1.mp4", "What are you doing today?", 8),
    Clip("clip_2", "videos/clip_2.mp4", "It's very warm this morning.", 8),
    Clip("clip_3", "videos/clip_3.mp4", "I'd like to take a vacation soon.", 10),
    Clip("clip_4", "videos/clip_4.mp4", "Did you feed the dog?", 9),
]

OPENROUTER_BASE = "https://openrouter.ai/api/v1"
OPENROUTER_HEADERS = {"HTTP-Referer": "https://lip-reading-experiment"}

MODELS = [
    ModelConfig(
        name="Gemini 3.1 Flash Lite",
        model_id="google/gemini-3.1-flash-lite-preview",
        base_url=OPENROUTER_BASE,
        api_key_env="OPENROUTER_API_KEY",
        video_mode="native_video",
        extra_headers=OPENROUTER_HEADERS,
    ),
    ModelConfig(
        name="Gemini 3 Flash",
        model_id="google/gemini-3-flash-preview",
        base_url=OPENROUTER_BASE,
        api_key_env="OPENROUTER_API_KEY",
        video_mode="native_video",
        extra_headers=OPENROUTER_HEADERS,
    ),
    ModelConfig(
        name="Gemini 3.1 Pro",
        model_id="google/gemini-3.1-pro-preview",
        base_url=OPENROUTER_BASE,
        api_key_env="OPENROUTER_API_KEY",
        video_mode="native_video",
        extra_headers=OPENROUTER_HEADERS,
    ),
    ModelConfig(
        name="Qwen VL Max",
        model_id="qwen/qwen-vl-max",
        base_url=OPENROUTER_BASE,
        api_key_env="OPENROUTER_API_KEY",
        video_mode="frame_sequence",
        fps=2,
        extra_headers=OPENROUTER_HEADERS,
    ),
    ModelConfig(
        name="MiniCPM-o 4.5",
        model_id="openbmb/MiniCPM-o-4_5",
        base_url="http://localhost:8000/v1",
        api_key_env="VLLM_API_KEY",
        video_mode="frame_sequence",
        fps=10,
    ),
]

SYSTEM_PROMPT = (
    "You are analyzing a silent video of a person speaking. "
    "The audio has been removed. Based solely on the visual movement "
    "of the speaker's lips, face, and mouth, infer what they are saying. "
    "Respond with ONLY the words you believe were spoken, nothing else."
)
