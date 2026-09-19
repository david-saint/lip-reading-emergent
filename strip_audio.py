"""Write audio-free copies of the clips.

The committed clips carry a silent AAC track (muted, not removed), which the
preflight in run.py accepts. Any new clip must be checked: a model with native
video input ingests the audio track, and would transcribe it rather than
lip-read. Requires ffmpeg on PATH.
"""

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

from preprocessing import probe_mp4


def main():
    parser = argparse.ArgumentParser(description="Strip audio tracks from clips")
    parser.add_argument("--in-dir", default="videos", help="Directory of source clips")
    parser.add_argument("--out-dir", default="videos/silent", help="Where to write the copies")
    args = parser.parse_args()

    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg not found on PATH — install it, or strip the audio elsewhere.")

    in_dir, out_dir = Path(args.in_dir), Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    for source in sorted(in_dir.glob("*.mp4")):
        target = out_dir / source.name
        subprocess.run(
            ["ffmpeg", "-y", "-v", "error", "-i", str(source), "-an", "-c:v", "copy", str(target)],
            check=True,
        )
        info = probe_mp4(str(target))
        print(f"{source.name} -> {target}: {info.summary}")


if __name__ == "__main__":
    main()
