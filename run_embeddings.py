"""Test whether Gemini Embedding 2 encodes lip-reading signal in video embeddings.

Hypothesis: even if generative models can't *articulate* what's being said,
the embedding space might implicitly encode spoken content — making it
retrievable via text queries like "dog" for clip_4 ("Did you feed the dog?").

Approach:
  1. Upload each silent video clip via the Files API.
  2. Embed each clip with gemini-embedding-2-preview.
  3. Embed a set of text queries (ground-truth phrases + single keywords).
  4. Rank clips by cosine similarity for each query.
  5. Check whether the correct clip ranks first.
"""

import json
import math
import time
from datetime import datetime, timezone
from pathlib import Path

from google import genai

from config import BASE_DIR, CLIPS

MODEL = "gemini-embedding-2-preview"

# Text queries: ground-truth sentences + targeted keywords
QUERIES = [
    # Full ground-truth sentences
    "What are you doing today?",
    "It's very warm this morning.",
    "I'd like to take a vacation soon.",
    "Did you feed the dog?",
    # Single keywords that should surface the right clip
    "dog",
    "vacation",
    "warm",
    "today",
    # Distractors — shouldn't strongly match any clip
    "basketball",
    "computer",
]

# Map each query to the clip it *should* match (None for distractors)
EXPECTED = {
    "What are you doing today?": "clip_1",
    "It's very warm this morning.": "clip_2",
    "I'd like to take a vacation soon.": "clip_3",
    "Did you feed the dog?": "clip_4",
    "dog": "clip_4",
    "vacation": "clip_3",
    "warm": "clip_2",
    "today": "clip_1",
    "basketball": None,
    "computer": None,
}


def cosine_similarity(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def wait_for_active(client: genai.Client, file_ref, timeout: int = 120):
    """Poll until the uploaded file reaches ACTIVE state."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        f = client.files.get(name=file_ref.name)
        if f.state.name == "ACTIVE":
            return f
        time.sleep(2)
    raise TimeoutError(f"File {file_ref.name} did not become ACTIVE within {timeout}s")


def embed_video(client: genai.Client, video_path: str) -> list[float]:
    """Upload a video and return its embedding vector."""
    video_file = client.files.upload(file=video_path)
    video_file = wait_for_active(client, video_file)
    result = client.models.embed_content(
        model=MODEL,
        contents=video_file,
    )
    return result.embeddings[0].values


def embed_text(client: genai.Client, text: str) -> list[float]:
    """Return the embedding vector for a text query."""
    result = client.models.embed_content(
        model=MODEL,
        contents=text,
    )
    return result.embeddings[0].values


def main():
    client = genai.Client()

    run_id = datetime.now().strftime("%Y-%m-%dT%H-%M-%S")
    out_dir = BASE_DIR / "results" / f"embeddings_{run_id}"
    out_dir.mkdir(parents=True, exist_ok=True)

    # --- Embed videos ---
    print(f"Embedding {len(CLIPS)} video clips with {MODEL}...\n")
    clip_embeddings: dict[str, list[float]] = {}
    for clip in CLIPS:
        print(f"  {clip.id} ({clip.ground_truth!r})...", end=" ", flush=True)
        clip_embeddings[clip.id] = embed_video(client, clip.full_path)
        dim = len(clip_embeddings[clip.id])
        print(f"OK ({dim}d)")

    # --- Embed text queries ---
    print(f"\nEmbedding {len(QUERIES)} text queries...\n")
    query_embeddings: dict[str, list[float]] = {}
    for q in QUERIES:
        print(f"  {q!r}...", end=" ", flush=True)
        query_embeddings[q] = embed_text(client, q)
        print("OK")

    # --- Compute similarities & rank ---
    print("\n" + "=" * 70)
    print("RESULTS: cosine similarity (text query → video clip)")
    print("=" * 70)

    results = []
    hits = 0
    evaluated = 0

    for query in QUERIES:
        q_emb = query_embeddings[query]
        scores = {}
        for clip in CLIPS:
            scores[clip.id] = cosine_similarity(q_emb, clip_embeddings[clip.id])

        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        expected_clip = EXPECTED.get(query)
        top_clip = ranked[0][0]
        is_hit = expected_clip is not None and top_clip == expected_clip

        if expected_clip is not None:
            evaluated += 1
            if is_hit:
                hits += 1

        result = {
            "query": query,
            "expected": expected_clip,
            "ranking": [{"clip": cid, "similarity": round(sim, 4)} for cid, sim in ranked],
            "top_clip": top_clip,
            "hit": is_hit,
        }
        results.append(result)

        # Print
        marker = "HIT" if is_hit else ("MISS" if expected_clip else "---")
        print(f"\n  Query: {query!r}  [{marker}]")
        for cid, sim in ranked:
            flag = " ← expected" if cid == expected_clip else ""
            gt = next(c.ground_truth for c in CLIPS if c.id == cid)
            print(f"    {cid}: {sim:.4f}  ({gt!r}){flag}")

    accuracy = hits / evaluated if evaluated else 0
    print("\n" + "=" * 70)
    print(f"Retrieval accuracy: {hits}/{evaluated} = {accuracy:.0%}")
    print(f"  (random baseline: 25%)")
    print("=" * 70)

    # --- Save results ---
    output = {
        "run_id": run_id,
        "model": MODEL,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "clips": [{"id": c.id, "ground_truth": c.ground_truth} for c in CLIPS],
        "queries": QUERIES,
        "results": results,
        "summary": {
            "hits": hits,
            "evaluated": evaluated,
            "accuracy": accuracy,
        },
    }
    (out_dir / "embedding_results.json").write_text(json.dumps(output, indent=2))

    # Markdown summary
    md = [
        "# Gemini Embedding 2 — Lip-Reading Retrieval Test",
        "",
        f"Run: {run_id}  ",
        f"Model: `{MODEL}`",
        "",
        "## Hypothesis",
        "",
        "Even though generative models cannot lip-read, the embedding space",
        "might implicitly encode spoken content — making it retrievable via",
        "cross-modal text-to-video search.",
        "",
        "## Results",
        "",
        f"**Retrieval accuracy: {hits}/{evaluated} ({accuracy:.0%})**  ",
        f"Random baseline: 25%",
        "",
        "| Query | Expected | Top Match | Hit? | Similarity |",
        "|-------|----------|-----------|------|------------|",
    ]
    for r in results:
        exp = r["expected"] or "—"
        top = r["ranking"][0]
        hit = "Yes" if r["hit"] else ("No" if r["expected"] else "—")
        md.append(f"| {r['query']!r} | {exp} | {top['clip']} | {hit} | {top['similarity']:.4f} |")

    md.extend([
        "",
        "## Full Rankings",
        "",
    ])
    for r in results:
        md.append(f"### {r['query']!r}")
        md.append("")
        for rank in r["ranking"]:
            gt = next(c.ground_truth for c in CLIPS if c.id == rank["clip"])
            md.append(f"1. **{rank['clip']}** ({rank['similarity']:.4f}) — {gt!r}")
        md.append("")

    (out_dir / "embedding_results.md").write_text("\n".join(md))
    print(f"\nResults saved to {out_dir}")


if __name__ == "__main__":
    main()
