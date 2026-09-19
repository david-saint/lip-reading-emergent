import difflib
import re
import statistics

import jiwer

# A refusal is not a failed lip-reading attempt, and scoring one as WER 5.19
# (as the 2026-03 run did for Qwen) poisons the average. Classify first, then
# aggregate WER over genuine attempts only.
REFUSAL_MARKERS = (
    "i cannot",
    "i can't",
    "i am unable",
    "i'm unable",
    "cannot determine",
    "can't determine",
    "not possible to",
    "unable to determine",
    "i don't have the ability",
    "lip-reading from",
    "lip reading from",
    "as an ai",
    "no audio",
)


def first_sentence(text: str) -> str:
    """Several models answer correctly and then loop. Raw WER counts the loop as
    insertions and buries the answer, so score the first sentence too."""
    return re.split(r"(?<=[.?!])\s+", (text or "").strip())[0]


def normalize(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s]", "", text)
    text = re.sub(r"\s+", " ", text)
    return text


def classify(response: str | None, stop_reason: str | None = None) -> str:
    """One of: attempt | refusal | empty | truncated."""
    if stop_reason == "refusal":  # Claude safety decline; content may be empty
        return "refusal"
    if response is None or not response.strip():
        if stop_reason and "MAX_TOKENS" in str(stop_reason).upper():
            return "truncated"
        if stop_reason == "incomplete" or stop_reason == "max_tokens":
            return "truncated"
        return "empty"
    lowered = response.lower()
    if any(marker in lowered for marker in REFUSAL_MARKERS):
        return "refusal"
    return "attempt"


def compute_metrics(ground_truth: str, hypothesis: str) -> dict:
    gt = normalize(ground_truth)
    hyp = normalize(hypothesis)
    if not hyp:
        return {"exact_match": False, "wer": 1.0, "cer": 1.0, "semantic_similarity": 0.0}
    return {
        "exact_match": gt == hyp,
        "wer": jiwer.wer(gt, hyp),
        "cer": jiwer.cer(gt, hyp),
        "semantic_similarity": difflib.SequenceMatcher(None, gt, hyp).ratio(),
    }


def score(ground_truth: str, response: str | None, stop_reason: str | None = None) -> dict:
    outcome = classify(response, stop_reason)
    if outcome in ("empty", "truncated"):
        return {
            "outcome": outcome,
            "exact_match": False,
            "wer": None,
            "cer": None,
            "semantic_similarity": None,
        }
    metrics = compute_metrics(ground_truth, response or "")
    first = compute_metrics(ground_truth, first_sentence(response))
    return {
        "outcome": outcome,
        "response_words": len(normalize(response or "").split()),
        "wer_first_sentence": first["wer"],
        "exact_match_first_sentence": first["exact_match"],
        **metrics,
    }


def aggregate(scores: list[dict]) -> dict:
    """Averages over attempts only; every other outcome is counted, not scored."""
    attempts = [s for s in scores if s.get("outcome") == "attempt"]
    counts: dict[str, int] = {}
    for s in scores:
        key = s.get("outcome") or "error"
        counts[key] = counts.get(key, 0) + 1

    def avg(field: str) -> float | None:
        values = [s[field] for s in attempts if s.get(field) is not None]
        return sum(values) / len(values) if values else None

    def med(field: str) -> float | None:
        values = [s[field] for s in attempts if s.get(field) is not None]
        return statistics.median(values) if values else None

    return {
        "n": len(scores),
        "outcomes": counts,
        "attempts": len(attempts),
        "avg_wer": avg("wer"),
        "median_wer": med("wer"),
        "avg_wer_first_sentence": avg("wer_first_sentence"),
        "best_wer_first_sentence": (
            min((s["wer_first_sentence"] for s in attempts
                 if s.get("wer_first_sentence") is not None), default=None)
        ),
        "avg_response_words": avg("response_words"),
        "avg_cer": avg("cer"),
        "avg_similarity": avg("semantic_similarity"),
        "exact_matches": sum(1 for s in attempts if s.get("exact_match")),
    }
