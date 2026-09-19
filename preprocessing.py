"""Video probing and frame extraction.

`probe_mp4` parses the MP4 container directly so the preflight checks work
without ffmpeg installed. The important one is `has_audio`: the models with
native video input ingest the audio track too, so a clip that still carries
real audio would be transcribed rather than lip-read.
"""

import base64
import struct
from dataclasses import dataclass, field
from pathlib import Path

import cv2


@dataclass
class VideoInfo:
    path: str
    duration_seconds: float
    video_fps: float
    frame_count: int
    width: int
    height: int
    has_audio: bool
    audio_looks_silent: bool | None = None

    @property
    def summary(self) -> str:
        audio = "no audio track"
        if self.has_audio:
            audio = "SILENT audio track" if self.audio_looks_silent else "AUDIO TRACK"
        return (
            f"{self.width}x{self.height} @ {self.video_fps:.1f}fps, "
            f"{self.duration_seconds:.1f}s, {self.frame_count} frames, {audio}"
        )


def _boxes(f, end):
    while f.tell() < end:
        start = f.tell()
        header = f.read(8)
        if len(header) < 8:
            return
        size, box_type = struct.unpack(">I4s", header)
        if size == 1:
            size = struct.unpack(">Q", f.read(8))[0]
        if size == 0:
            size = end - start
        if size < 8:
            return
        yield box_type.decode("latin1"), start, size
        f.seek(start + size)


def _walk(f, end, path=()):
    containers = ("moov", "trak", "mdia", "minf", "stbl")
    for box_type, start, size in _boxes(f, end):
        yield path + (box_type,), start, size
        if box_type in containers:
            f.seek(start + 8)
            yield from _walk(f, start + size, path + (box_type,))


def probe_mp4(path: str) -> VideoInfo:
    """Read track layout straight out of the MP4 boxes (no ffmpeg needed)."""
    total = Path(path).stat().st_size
    tracks: list[dict] = []
    current: dict = {}

    with open(path, "rb") as f:
        for box_path, start, size in _walk(f, total):
            box_type = box_path[-1]
            if box_type == "hdlr":
                f.seek(start + 8)
                current["handler"] = f.read(size - 8)[8:12].decode("latin1")
            elif box_type == "mdhd":
                f.seek(start + 8)
                data = f.read(size - 8)
                if data[0] == 0:
                    timescale, duration = struct.unpack(">II", data[12:20])
                else:
                    timescale, duration = struct.unpack(">IQ", data[20:32])
                current["duration"] = duration / timescale if timescale else 0.0
            elif box_type == "stsd":
                f.seek(start + 8)
                data = f.read(size - 8)
                if current.get("handler") == "vide" and len(data) >= 44:
                    current["size"] = struct.unpack(">HH", data[40:44])
            elif box_type == "stsz":
                f.seek(start + 8)
                data = f.read(size - 8)
                uniform, count = struct.unpack(">II", data[4:12])
                if uniform:
                    sizes = [uniform] * count
                else:
                    sizes = [
                        struct.unpack(">I", data[12 + 4 * i : 16 + 4 * i])[0]
                        for i in range(count)
                    ]
                current["sample_sizes"] = sizes
            elif box_type == "trak" and current:
                tracks.append(current)
                current = {}
    if current:
        tracks.append(current)

    video = next((t for t in tracks if t.get("handler") == "vide"), {})
    audio = next((t for t in tracks if t.get("handler") == "soun"), None)

    frames = len(video.get("sample_sizes", []))
    duration = video.get("duration", 0.0)
    width, height = video.get("size", (0, 0))

    silent = None
    if audio:
        sizes = audio.get("sample_sizes", [])
        # Real speech produces highly variable AAC frame sizes. A constant
        # frame size across the whole track means a constant signal, i.e. the
        # audio was muted rather than removed.
        silent = bool(sizes) and (max(sizes) - min(sizes)) <= 2

    return VideoInfo(
        path=path,
        duration_seconds=duration,
        video_fps=frames / duration if duration else 0.0,
        frame_count=frames,
        width=width,
        height=height,
        has_audio=audio is not None,
        audio_looks_silent=silent,
    )


@dataclass
class FrameSet:
    frames: list[str] = field(default_factory=list)  # base64 JPEG
    requested_fps: float = 0.0
    effective_fps: float = 0.0
    frame_size: tuple[int, int] = (0, 0)
    crop: str = "none"

    @property
    def meta(self) -> dict:
        return {
            "n_frames": len(self.frames),
            "requested_fps": self.requested_fps,
            "effective_fps": round(self.effective_fps, 2),
            "frame_width": self.frame_size[0],
            "frame_height": self.frame_size[1],
            "crop": self.crop,
        }


def _parse_crop(crop: str, width: int, height: int) -> tuple[int, int, int, int] | None:
    """Crop spec: 'none', 'center', or 'x,y,w,h' as fractions of the frame."""
    if crop in ("", "none"):
        return None
    if crop == "center":
        side = min(width, height)
        return ((width - side) // 2, (height - side) // 2, side, side)
    try:
        fx, fy, fw, fh = (float(v) for v in crop.split(","))
    except ValueError as exc:
        raise ValueError(
            f"Bad crop spec {crop!r}: expected 'none', 'center', or 'x,y,w,h' fractions"
        ) from exc
    return (int(fx * width), int(fy * height), int(fw * width), int(fh * height))


def extract_frames(
    video_path: str,
    fps: float = 5.0,
    max_frames: int = 80,
    max_long_edge: int = 1024,
    crop: str = "none",
    jpeg_quality: int = 80,
) -> FrameSet:
    """Sample frames at `fps`, evenly subsampling if that exceeds `max_frames`."""
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise RuntimeError(f"Could not open {video_path}")

    source_fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    duration = total / source_fps if source_fps else 0.0

    step = max(1, round(source_fps / fps)) if fps > 0 else 1
    wanted = list(range(0, total, step))
    if max_frames and len(wanted) > max_frames:
        # Keep the clip's full time span; thin the sampling instead of truncating.
        stride = len(wanted) / max_frames
        wanted = [wanted[int(i * stride)] for i in range(max_frames)]

    wanted_set = set(wanted)
    box = None
    size = (0, 0)
    frames: list[str] = []
    index = 0

    while True:
        ok, frame = cap.read()
        if not ok:
            break
        if index in wanted_set:
            height, width = frame.shape[:2]
            if box is None:
                box = _parse_crop(crop, width, height)
            if box:
                x, y, w, h = box
                frame = frame[max(0, y) : y + h, max(0, x) : x + w]
            height, width = frame.shape[:2]
            long_edge = max(width, height)
            if max_long_edge and long_edge > max_long_edge:
                scale = max_long_edge / long_edge
                frame = cv2.resize(
                    frame,
                    (round(width * scale), round(height * scale)),
                    interpolation=cv2.INTER_AREA,
                )
            size = (frame.shape[1], frame.shape[0])
            ok, buffer = cv2.imencode(
                ".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, jpeg_quality]
            )
            if ok:
                frames.append(base64.b64encode(buffer).decode("utf-8"))
        index += 1
    cap.release()

    return FrameSet(
        frames=frames,
        requested_fps=fps,
        effective_fps=len(frames) / duration if duration else 0.0,
        frame_size=size,
        crop=crop,
    )


def encode_video_base64(video_path: str) -> str:
    return base64.b64encode(Path(video_path).read_bytes()).decode("utf-8")
