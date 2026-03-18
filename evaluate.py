import difflib
import re

import jiwer


def normalize(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s]", "", text)
    text = re.sub(r"\s+", " ", text)
    return text


def compute_metrics(ground_truth: str, hypothesis: str) -> dict:
    gt = normalize(ground_truth)
    hyp = normalize(hypothesis)
    return {
        "exact_match": gt == hyp,
        "wer": jiwer.wer(gt, hyp),
        "cer": jiwer.cer(gt, hyp),
        "semantic_similarity": difflib.SequenceMatcher(None, gt, hyp).ratio(),
    }
