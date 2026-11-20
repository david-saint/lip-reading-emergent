/* ==========================================================================
   SILENT SPEECH & VISUAL PHONETICS — Interactive Scientific Instruments
   Zero external libraries · Pure SVG & DOM · Grounded in repo summary.json
   ========================================================================== */

(function () {
  "use strict";

  const DATA = window.EXPERIMENT_DATA || { scores: [], candidates: [], channels: [] };

  /* ------------------------------------------------------------------------
     1. CANONICAL CLIP METADATA, IPA PHONOLOGY & VISEME SEQUENCES
     ------------------------------------------------------------------------ */
  const CLIPS = [
    {
      id: "clip_4",
      label: "clip_4 · 9s",
      shortLabel: "CLIP 04",
      duration: 9,
      effFps: 8.89,
      gt: "Did you feed the dog?",
      ipa: "/dɪd juː fiːd ðə dɒɡ/",
      astraWerFirst: 0.0,
      astraWerRaw: 1.6,
      verdict: "EXACT VERBATIM MATCH · 1ST-SENT WER 0.00",
      verdictSub: "RAW WER 1.60 DUE TO REPETITION ECHO LOOP",
      note: "GPT-6 Astra decoded all five words cleanly on the first sentence — then repeated the phrase twice more until trailing off. Raw WER penalized those repeated words as insertions (1.60), completely masking a verbatim lip-reading recovery.",
      alignment: [
        { gt: "Did", ipa: "/dɪd/", hyp: "Did", status: "exact" },
        { gt: "you", ipa: "/juː/", hyp: "you", status: "exact" },
        { gt: "feed", ipa: "/fiːd/", hyp: "feed", status: "exact" },
        { gt: "the", ipa: "/ðə/", hyp: "the", status: "exact" },
        { gt: "dog?", ipa: "/dɒɡ/", hyp: "dog?", status: "exact" },
      ],
      loopTail: "Did you feed the dog? Did you feed...",
      visemes: [
        { sym: "d", cls: "Alveolar", w: 66, h: 16, round: 0.15, teeth: true, tuck: false, tongue: false, mm: 9 },
        { sym: "ɪ", cls: "Spread", w: 72, h: 24, round: 0.1, teeth: true, tuck: false, tongue: false, mm: 13 },
        { sym: "d", cls: "Alveolar", w: 64, h: 14, round: 0.15, teeth: true, tuck: false, tongue: false, mm: 8 },
        { sym: "j", cls: "Palatal", w: 70, h: 18, round: 0.25, teeth: false, tuck: false, tongue: false, mm: 10 },
        { sym: "uː", cls: "Rounded", w: 34, h: 20, round: 0.92, teeth: false, tuck: false, tongue: false, mm: 11 },
        { sym: "f", cls: "Labiodental", w: 68, h: 10, round: 0.08, teeth: true, tuck: true, tongue: false, mm: 4 },
        { sym: "iː", cls: "Wide Spread", w: 80, h: 18, round: 0.05, teeth: true, tuck: false, tongue: false, mm: 10 },
        { sym: "d", cls: "Alveolar", w: 64, h: 14, round: 0.15, teeth: true, tuck: false, tongue: false, mm: 8 },
        { sym: "ð", cls: "Interdental", w: 68, h: 16, round: 0.1, teeth: true, tuck: false, tongue: true, mm: 9 },
        { sym: "ə", cls: "Neutral", w: 60, h: 24, round: 0.3, teeth: false, tuck: false, tongue: false, mm: 14 },
        { sym: "d", cls: "Alveolar", w: 64, h: 14, round: 0.15, teeth: true, tuck: false, tongue: false, mm: 8 },
        { sym: "ɒ", cls: "Open Round", w: 54, h: 42, round: 0.65, teeth: false, tuck: false, tongue: false, mm: 24 },
        { sym: "ɡ", cls: "Velar", w: 60, h: 22, round: 0.25, teeth: false, tuck: false, tongue: false, mm: 12 },
      ],
    },
    {
      id: "clip_2",
      label: "clip_2 · 8s",
      shortLabel: "CLIP 02",
      duration: 8,
      effFps: 10.0,
      gt: "It's very warm this morning.",
      ipa: "/ɪts ˈvɛri wɔːrm ðɪs ˈmɔːrnɪŋ/",
      astraWerFirst: 0.4,
      astraWerRaw: 0.4,
      verdict: "CONTRACTION DIFFERENCE ONLY · 96.3% SIMILARITY",
      verdictSub: "CER 0.08 · ZERO REPETITION LOOP ON THIS CLIP",
      note: "Astra produced \"It is very warm this morning.\" — differing from the ground-truth transcript solely by expanding the contraction \"It's\" into \"It is\". All four content words (very, warm, this, morning) including the labiodental /v/, rounded /w/, interdental /ð/, and bilabial /m/ matched cleanly.",
      alignment: [
        { gt: "It's", ipa: "/ɪts/", hyp: "It is", status: "near" },
        { gt: "very", ipa: "/ˈvɛri/", hyp: "very", status: "exact" },
        { gt: "warm", ipa: "/wɔːrm/", hyp: "warm", status: "exact" },
        { gt: "this", ipa: "/ðɪs/", hyp: "this", status: "exact" },
        { gt: "morning.", ipa: "/ˈmɔːrnɪŋ/", hyp: "morning.", status: "exact" },
      ],
      loopTail: null,
      visemes: [
        { sym: "ɪ", cls: "Spread", w: 72, h: 20, round: 0.1, teeth: true, tuck: false, tongue: false, mm: 11 },
        { sym: "ts", cls: "Alveolar", w: 66, h: 12, round: 0.12, teeth: true, tuck: false, tongue: false, mm: 6 },
        { sym: "v", cls: "Labiodental", w: 68, h: 10, round: 0.08, teeth: true, tuck: true, tongue: false, mm: 4 },
        { sym: "ɛ", cls: "Mid Open", w: 72, h: 32, round: 0.2, teeth: true, tuck: false, tongue: false, mm: 18 },
        { sym: "r", cls: "Rounded", w: 46, h: 20, round: 0.72, teeth: false, tuck: false, tongue: false, mm: 11 },
        { sym: "i", cls: "Wide Spread", w: 78, h: 18, round: 0.05, teeth: true, tuck: false, tongue: false, mm: 10 },
        { sym: "w", cls: "Tight Round", w: 32, h: 16, round: 0.96, teeth: false, tuck: false, tongue: false, mm: 9 },
        { sym: "ɔː", cls: "Open Round", w: 50, h: 40, round: 0.72, teeth: false, tuck: false, tongue: false, mm: 23 },
        { sym: "m", cls: "Bilabial", w: 68, h: 2, round: 0.04, teeth: false, tuck: false, tongue: false, mm: 0 },
        { sym: "ð", cls: "Interdental", w: 68, h: 15, round: 0.1, teeth: true, tuck: false, tongue: true, mm: 8 },
        { sym: "s", cls: "Alveolar", w: 70, h: 10, round: 0.08, teeth: true, tuck: false, tongue: false, mm: 5 },
        { sym: "m", cls: "Bilabial", w: 68, h: 2, round: 0.04, teeth: false, tuck: false, tongue: false, mm: 0 },
        { sym: "ɔː", cls: "Open Round", w: 50, h: 38, round: 0.7, teeth: false, tuck: false, tongue: false, mm: 22 },
        { sym: "ŋ", cls: "Velar Nasal", w: 62, h: 20, round: 0.2, teeth: false, tuck: false, tongue: false, mm: 11 },
      ],
    },
    {
      id: "clip_1",
      label: "clip_1 · 8s",
      shortLabel: "CLIP 01",
      duration: 8,
      effFps: 10.0,
      gt: "What are you doing today?",
      ipa: "/wʌt ɑːr juː ˈduːɪŋ təˈdeɪ/",
      astraWerFirst: 0.6,
      astraWerRaw: 1.8,
      verdict: "VISEME-NEAR PARAPHRASE · 1ST-SENT WER 0.60",
      verdictSub: "RAW WER 1.80 · LABIAL & ALVEOLAR CADENCE PRESERVED",
      note: "\"What did you do today?\" shares nearly the same visible labial-alveolar envelope as \"What are you doing today?\" — initial rounded /w/, alveolar closure, rounded /uː/, and final \"today\". This visual proximity argues for genuine viseme decoding rather than memorized text recall.",
      alignment: [
        { gt: "—", ipa: "—", hyp: "So,", status: "miss" },
        { gt: "What", ipa: "/wʌt/", hyp: "what", status: "exact" },
        { gt: "are", ipa: "/ɑːr/", hyp: "did", status: "near" },
        { gt: "you", ipa: "/juː/", hyp: "you", status: "exact" },
        { gt: "doing", ipa: "/ˈduːɪŋ/", hyp: "do", status: "near" },
        { gt: "today?", ipa: "/təˈdeɪ/", hyp: "today?", status: "exact" },
      ],
      loopTail: "What did you do today? What...",
      visemes: [
        { sym: "w", cls: "Tight Round", w: 32, h: 16, round: 0.95, teeth: false, tuck: false, tongue: false, mm: 9 },
        { sym: "ʌ", cls: "Open Mid", w: 62, h: 34, round: 0.28, teeth: false, tuck: false, tongue: false, mm: 19 },
        { sym: "t", cls: "Alveolar", w: 64, h: 13, round: 0.14, teeth: true, tuck: false, tongue: false, mm: 7 },
        { sym: "ɑː", cls: "Wide Open", w: 64, h: 46, round: 0.35, teeth: false, tuck: false, tongue: false, mm: 27 },
        { sym: "r", cls: "Rounded", w: 46, h: 20, round: 0.7, teeth: false, tuck: false, tongue: false, mm: 11 },
        { sym: "juː", cls: "Rounded", w: 36, h: 18, round: 0.9, teeth: false, tuck: false, tongue: false, mm: 10 },
        { sym: "d", cls: "Alveolar", w: 64, h: 14, round: 0.15, teeth: true, tuck: false, tongue: false, mm: 8 },
        { sym: "uː", cls: "Tight Round", w: 34, h: 18, round: 0.92, teeth: false, tuck: false, tongue: false, mm: 10 },
        { sym: "ɪŋ", cls: "Spread", w: 72, h: 20, round: 0.12, teeth: true, tuck: false, tongue: false, mm: 11 },
        { sym: "t", cls: "Alveolar", w: 64, h: 13, round: 0.14, teeth: true, tuck: false, tongue: false, mm: 7 },
        { sym: "d", cls: "Alveolar", w: 64, h: 14, round: 0.15, teeth: true, tuck: false, tongue: false, mm: 8 },
        { sym: "eɪ", cls: "Wide Spread", w: 76, h: 26, round: 0.12, teeth: true, tuck: false, tongue: false, mm: 15 },
      ],
    },
    {
      id: "clip_3",
      label: "clip_3 · 10s",
      shortLabel: "CLIP 03",
      duration: 10,
      effFps: 8.0,
      gt: "I'd like to take a vacation soon.",
      ipa: "/aɪd laɪk tə teɪk ə veɪˈkeɪʃən suːn/",
      astraWerFirst: 0.86,
      astraWerRaw: 1.0,
      verdict: "OPENING LOCK, THEN VISEME DIVERGENCE · WER 0.86",
      verdictSub: "EVIDENCE AGAINST PURE MEMORIZATION",
      note: "A model recalling a memorized compilation transcript should ace all four clips equally. Instead, Astra locked cleanly onto the opening \"I('d) like\", then diverged visually on \"take a vacation soon\" → \"coffee too\" — swapping labiodental /v/ for /f/ and final rounded /uː/ for \"too\".",
      alignment: [
        { gt: "I'd", ipa: "/aɪd/", hyp: "I", status: "near" },
        { gt: "like", ipa: "/laɪk/", hyp: "like", status: "exact" },
        { gt: "to take a", ipa: "/tə teɪk ə/", hyp: "—", status: "miss" },
        { gt: "vacation", ipa: "/veɪˈkeɪʃən/", hyp: "coffee", status: "miss" },
        { gt: "soon.", ipa: "/suːn/", hyp: "too.", status: "miss" },
      ],
      loopTail: "I like coffee too.",
      visemes: [
        { sym: "aɪ", cls: "Open Glide", w: 66, h: 44, round: 0.25, teeth: false, tuck: false, tongue: false, mm: 26 },
        { sym: "l", cls: "Alveolar", w: 66, h: 20, round: 0.15, teeth: true, tuck: false, tongue: true, mm: 11 },
        { sym: "aɪ", cls: "Open Glide", w: 68, h: 40, round: 0.2, teeth: false, tuck: false, tongue: false, mm: 23 },
        { sym: "k", cls: "Velar", w: 60, h: 22, round: 0.2, teeth: false, tuck: false, tongue: false, mm: 12 },
        { sym: "t", cls: "Alveolar", w: 64, h: 13, round: 0.14, teeth: true, tuck: false, tongue: false, mm: 7 },
        { sym: "eɪ", cls: "Spread", w: 74, h: 26, round: 0.12, teeth: true, tuck: false, tongue: false, mm: 15 },
        { sym: "v", cls: "Labiodental", w: 68, h: 10, round: 0.08, teeth: true, tuck: true, tongue: false, mm: 4 },
        { sym: "eɪ", cls: "Spread", w: 74, h: 26, round: 0.12, teeth: true, tuck: false, tongue: false, mm: 15 },
        { sym: "ʃ", cls: "Protruded", w: 46, h: 18, round: 0.76, teeth: true, tuck: false, tongue: false, mm: 10 },
        { sym: "s", cls: "Alveolar", w: 70, h: 10, round: 0.08, teeth: true, tuck: false, tongue: false, mm: 5 },
        { sym: "uː", cls: "Tight Round", w: 34, h: 18, round: 0.94, teeth: false, tuck: false, tongue: false, mm: 10 },
        { sym: "n", cls: "Alveolar", w: 64, h: 14, round: 0.15, teeth: true, tuck: false, tongue: false, mm: 8 },
      ],
    },
  ];

  /* ------------------------------------------------------------------------
     2. HERO INSTRUMENT — LIVE SILENT LIP-APERTURE SYNTH
     ------------------------------------------------------------------------ */
  let heroClipIdx = 0; // clip_4 default
  let heroPhonemeIdx = 0;
  let heroPlaying = true;
  let heroTimer = null;

  function renderMouthSVG(svgEl, v, options = {}) {
    const cx = options.cx || 130;
    const cy = options.cy || 96;
    const rx = v.w;
    const ry = Math.max(v.h, 1.5);
    const outerTopY = cy - ry * 0.62 - (10 - v.round * 2);
    const outerBotY = cy + ry * 0.66 + (11 + v.round * 2);
    const bowDip = cy - ry * 0.48 - (5.5 - v.round * 1.5);
    const innerTopY = cy - ry * 0.48;
    const innerBotY = cy + ry * 0.52;
    const leftX = cx - rx;
    const rightX = cx + rx;

    const outerUpper = `M ${leftX} ${cy} Q ${cx - rx * 0.42} ${outerTopY} ${cx - rx * 0.12} ${outerTopY + 1} Q ${cx} ${bowDip} ${cx + rx * 0.12} ${outerTopY + 1} Q ${cx + rx * 0.42} ${outerTopY} ${rightX} ${cy}`;
    const outerLower = `M ${leftX} ${cy} Q ${cx} ${outerBotY} ${rightX} ${cy}`;

    const isClosed = v.h <= 3;
    const cavityPath = isClosed
      ? `M ${leftX + 3} ${cy} L ${rightX - 3} ${cy}`
      : `M ${leftX + 6} ${cy} Q ${cx} ${innerTopY} ${rightX - 6} ${cy} Q ${cx} ${innerBotY} ${leftX + 6} ${cy} Z`;

    const teethEl =
      !isClosed && v.teeth
        ? `<path d="M ${cx - rx * 0.54} ${cy - ry * 0.18} Q ${cx} ${innerTopY + 1} ${cx + rx * 0.54} ${cy - ry * 0.18} L ${cx + rx * 0.46} ${cy - ry * 0.02 + 4} Q ${cx} ${cy - ry * 0.02 + 6} ${cx - rx * 0.46} ${cy - ry * 0.02 + 4} Z" fill="#FFFFFF" stroke="#161614" stroke-width="1"/>`
        : "";

    const tongueEl =
      !isClosed && v.tongue
        ? `<path d="M ${cx - rx * 0.34} ${cy + ry * 0.15} Q ${cx} ${cy - ry * 0.05} ${cx + rx * 0.34} ${cy + ry * 0.15} Q ${cx} ${innerBotY - 1} ${cx - rx * 0.34} ${cy + ry * 0.15} Z" fill="#D94226" opacity="0.55"/>`
        : "";

    const tuckNote = v.tuck
      ? `<line x1="${cx - rx * 0.38}" y1="${cy + 4}" x2="${cx + rx * 0.38}" y2="${cy + 4}" stroke="#147A5E" stroke-width="2" stroke-dasharray="3 2"/>`
      : "";

    // Caliper vertical measurement lines on right
    const calX = cx + 96;
    const calTop = isClosed ? cy - 2 : innerTopY;
    const calBot = isClosed ? cy + 2 : innerBotY;

    svgEl.innerHTML = `
      <!-- Optical Drafting Crosshairs -->
      <line x1="18" y1="${cy}" x2="242" y2="${cy}" stroke="#D6D4CC" stroke-width="1" stroke-dasharray="3 4"/>
      <line x1="${cx}" y1="16" x2="${cx}" y2="180" stroke="#D6D4CC" stroke-width="1" stroke-dasharray="3 4"/>

      <!-- Precision Corner Viewfinder Brackets -->
      <path d="M 22 36 L 22 22 L 36 22 M 224 22 L 238 22 L 238 36 M 22 164 L 22 178 L 36 178 M 224 178 L 238 178 L 238 164" stroke="#161614" stroke-width="1.2" fill="none"/>

      <!-- Lip Width Horizon Guide -->
      <line x1="${leftX}" y1="164" x2="${rightX}" y2="164" stroke="#727068" stroke-width="1"/>
      <line x1="${leftX}" y1="159" x2="${leftX}" y2="169" stroke="#727068" stroke-width="1"/>
      <line x1="${rightX}" y1="159" x2="${rightX}" y2="169" stroke="#727068" stroke-width="1"/>

      <!-- Aperture Height Caliper -->
      <line x1="${calX}" y1="${calTop}" x2="${calX}" y2="${calBot}" stroke="#D94226" stroke-width="1.4"/>
      <line x1="${calX - 5}" y1="${calTop}" x2="${calX + 5}" y2="${calTop}" stroke="#D94226" stroke-width="1.2"/>
      <line x1="${calX - 5}" y1="${calBot}" x2="${calX + 5}" y2="${calBot}" stroke="#D94226" stroke-width="1.2"/>

      <!-- Oral Cavity Fill -->
      ${
        isClosed
          ? `<path d="${cavityPath}" stroke="#161614" stroke-width="2.2" fill="none"/>`
          : `<path d="${cavityPath}" fill="#161614" opacity="0.88"/>`
      }
      ${teethEl}
      ${tongueEl}
      ${tuckNote}

      <!-- Vermilion Outer Lip Contours -->
      <path d="${outerUpper}" stroke="#D94226" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="${outerLower}" stroke="#D94226" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      ${
        !isClosed
          ? `<path d="${cavityPath}" stroke="#161614" stroke-width="1.4" fill="none"/>`
          : ""
      }

      <!-- Registration Nodes at Lip Corners -->
      <circle cx="${leftX}" cy="${cy}" r="2.6" fill="#161614"/>
      <circle cx="${rightX}" cy="${cy}" r="2.6" fill="#161614"/>

      <!-- IPA Phoneme Tag in Upper-Left Corner -->
      <text x="32" y="42" font-family="IBM Plex Mono, monospace" font-size="13" font-weight="600" fill="#D94226">/${v.sym}/</text>
      <text x="228" y="42" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="10" fill="#727068">${v.mm}mm</text>
    `;
  }

  function buildHeroTabs() {
    const tabsEl = document.getElementById("hero-clip-tabs");
    if (!tabsEl) return;
    tabsEl.innerHTML = CLIPS.map(
      (c, i) => `
      <button type="button" class="clip-tab ${i === heroClipIdx ? "is-active" : ""}" role="tab" aria-selected="${i === heroClipIdx}" data-hero-clip="${i}">
        ${c.shortLabel} (${c.duration}s)
      </button>`
    ).join("");

    tabsEl.querySelectorAll(".clip-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        heroClipIdx = Number(btn.dataset.heroClip);
        heroPhonemeIdx = 0;
        updateHeroClip();
      });
    });
  }

  function updateHeroClip() {
    const clip = CLIPS[heroClipIdx];
    document.querySelectorAll("#hero-clip-tabs .clip-tab").forEach((b, i) => {
      b.classList.toggle("is-active", i === heroClipIdx);
      b.setAttribute("aria-selected", String(i === heroClipIdx));
    });

    document.getElementById("hero-clip-sentence").textContent = `"${clip.gt}"`;
    document.getElementById("hero-clip-ipa").textContent = clip.ipa;
    document.getElementById("hero-clip-meta").textContent =
      `${clip.id.toUpperCase()} · ${clip.duration}.0s · 80 FRAMES @ ${clip.effFps.toFixed(2)} EFF. FPS · SILENT`;

    const rail = document.getElementById("hero-phoneme-rail");
    rail.innerHTML = clip.visemes
      .map(
        (v, idx) => `
        <button type="button" class="phoneme-cell ${idx === heroPhonemeIdx ? "is-current" : ""}" data-pidx="${idx}">
          <span class="phoneme-cell__sym">/${v.sym}/</span>
          <span class="phoneme-cell__cls">${v.cls}</span>
        </button>`
      )
      .join("");

    rail.querySelectorAll(".phoneme-cell").forEach((cell) => {
      cell.addEventListener("click", () => {
        heroPhonemeIdx = Number(cell.dataset.pidx);
        heroPlaying = false;
        syncPlayButton();
        paintCurrentHeroPhoneme();
      });
    });

    paintCurrentHeroPhoneme();
  }

  function paintCurrentHeroPhoneme() {
    const clip = CLIPS[heroClipIdx];
    const v = clip.visemes[heroPhonemeIdx % clip.visemes.length];
    const svg = document.getElementById("live-mouth-svg");
    if (svg) renderMouthSVG(svg, v);

    document.getElementById("mouth-viseme-readout").textContent = `VISEME: ${v.cls.toUpperCase()}`;
    document.getElementById("mouth-aperture-readout").textContent = `APERTURE: ${v.mm} mm`;

    document.querySelectorAll("#hero-phoneme-rail .phoneme-cell").forEach((c, idx) => {
      c.classList.toggle("is-current", idx === heroPhonemeIdx);
    });
  }

  function syncPlayButton() {
    const label = document.getElementById("btn-play-label");
    if (label) label.textContent = heroPlaying ? "Pause Articulation" : "Resume Articulation";
  }

  function startHeroLoop() {
    if (heroTimer) clearInterval(heroTimer);
    heroTimer = setInterval(() => {
      if (!heroPlaying) return;
      const clip = CLIPS[heroClipIdx];
      heroPhonemeIdx = (heroPhonemeIdx + 1) % clip.visemes.length;
      paintCurrentHeroPhoneme();
    }, 520);
  }

  /* ------------------------------------------------------------------------
     3. SECTION 01 — RUN 1 VS RUN 2 WER HORIZON & METRIC TRAP CHART
     ------------------------------------------------------------------------ */
  const WER_SERIES = [
    { name: "GPT-6 Astra", run: "Run 2 · 10 fps", first: 0.46, raw: 1.2, best: 0.0, accent: "viridian", note: "2/4 decoded (clip_4 0.00); loops raise Raw WER to 1.20" },
    { name: "Gemini 3.1 Pro", run: "Run 2 · 10 fps HIGH", first: 1.3, raw: 1.3, best: 1.0, accent: "ink", note: "Within-model control (same ID as Run 1)" },
    { name: "Gemini 3.8 Flash", run: "Run 2 · 10 fps HIGH", first: 2.96, raw: 3.56, best: 0.86, accent: "ink", note: "Invents social-media voiceover (~57k thinking tok)" },
    { name: "Claude Opus 5", run: "Run 2 · 10 fps", first: 4.26, raw: 17.33, best: 3.4, accent: "ochre", note: "94.5 avg words/clip — off-scale at 17.33 Raw WER" },
    { name: "Claude Fable 5.1", run: "Run 2 · 2/4 attempts", first: 6.1, raw: 6.1, best: 4.8, accent: "rust", note: "Declined clip_3 & clip_4 citing /p b m/ ambiguity" },
    { name: "Gemini 3.1 Pro (Run 1)", run: "Run 1 · ~1 fps", first: 0.95, raw: 0.95, best: null, accent: "muted", note: "Mar 2026 baseline (~741 tokens/clip)" },
    { name: "Gemini 3 Flash (Run 1)", run: "Run 1 · ~1 fps", first: 1.0, raw: 1.0, best: null, accent: "muted", note: "Mar 2026 baseline; looped on one clip" },
    { name: "Qwen VL Max (Run 1)", run: "Run 1 · refusals scored", first: 5.19, raw: 5.19, best: null, accent: "muted", note: "Verbose refusals poisoned Run 1 WER average" },
  ];

  let werMode = "first";

  function renderWerChart() {
    const svg = document.getElementById("wer-comparison-svg");
    if (!svg) return;

    const W = 1120;
    const leftPad = 236;
    const rightPad = 148;
    const plotW = W - leftPad - rightPad;
    const maxVal = werMode === "first" ? 6.5 : 7.0;
    const xOf = (val) => leftPad + (Math.min(val, maxVal) / maxVal) * plotW;

    const topY = 48;
    const rowH = 44;
    const archiveGap = 48; // clean open divider band between Run 2 (0..4) and Run 1 (5..7)
    const yOfRow = (idx) => topY + idx * rowH + 14 + (idx >= 5 ? archiveGap : 0);
    const bottomAxisY = yOfRow(WER_SERIES.length - 1) + 26;
    const dividerY = topY + 5 * rowH + 22;

    const ticks = werMode === "first" ? [0, 0.5, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0] : [0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0];
    const xOne = xOf(1.0);

    let out = `
      <!-- Viridian Signal Zone (WER < 1.00) -->
      <rect x="${leftPad}" y="${topY - 12}" width="${xOne - leftPad}" height="${bottomAxisY - (topY - 12)}" fill="#147A5E" opacity="0.06"/>

      <!-- Axis Ticks & Gridlines -->
      ${ticks
        .map((t) => {
          const x = xOf(t);
          const isOne = Math.abs(t - 1.0) < 0.001;
          return `
            <line x1="${x}" y1="${topY - 12}" x2="${x}" y2="${bottomAxisY}"
              stroke="${isOne ? "#D94226" : "#E3E1DA"}"
              stroke-width="${isOne ? 1.5 : 1}"
              ${isOne ? 'stroke-dasharray="5 4"' : ""} />
            <text x="${x}" y="${topY - 24}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11"
              fill="${isOne ? "#D94226" : "#727068"}" font-weight="${isOne ? 600 : 400}">${t.toFixed(1)}</text>
          `;
        })
        .join("")}

      <!-- Horizon Labels (Cleanly separated left & right of 1.00 meridian) -->
      <text x="${(leftPad + xOne) / 2}" y="${bottomAxisY + 24}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" fill="#147A5E" font-weight="600">&lt; 1.0 SIGNAL</text>
      <text x="${xOne + 14}" y="${bottomAxisY + 24}" font-family="IBM Plex Mono, monospace" font-size="10" fill="#D94226">1.00 FAILURE HORIZON — FULL SENTENCE MISS / CONFABULATION →</text>

      <!-- Divider between Run 2 and Run 1 inside generous gap -->
      <line x1="0" y1="${dividerY}" x2="${W}" y2="${dividerY}" stroke="#161614" stroke-width="1" stroke-dasharray="2 4" opacity="0.35"/>
      <text x="0" y="${dividerY + 18}" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="#727068" letter-spacing="0.1em">RUN 1 ARCHIVE · MAR 2026 (BASELINE)</text>
    `;

    WER_SERIES.forEach((m, i) => {
      const y = yOfRow(i);
      const val = werMode === "first" ? m.first : m.raw;
      const overflow = val > maxVal;
      const xEnd = xOf(val);

      let stroke = "#161614";
      if (m.accent === "viridian") stroke = werMode === "first" ? "#147A5E" : "#D94226";
      else if (m.accent === "ochre") stroke = "#B87014";
      else if (m.accent === "rust") stroke = "#9E3B2B";
      else if (m.accent === "muted") stroke = "#9E9B92";

      const bestMarker =
        werMode === "first" && m.best === 0.0
          ? `<polygon points="${xOf(0)},${y - 6} ${xOf(0) + 6},${y} ${xOf(0)},${y + 6} ${xOf(0) - 6},${y}" fill="#147A5E"/>
             <text x="${xOf(0) + 10}" y="${y - 11}" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="#147A5E" font-weight="600">BEST 0.00 (clip_4)</text>`
          : "";

      const trapDelta =
        werMode === "raw" && m.name === "GPT-6 Astra"
          ? `<line x1="${xOf(m.first)}" y1="${y}" x2="${xEnd}" y2="${y}" stroke="#D94226" stroke-width="3.5" opacity="0.28"/>
             <circle cx="${xOf(m.first)}" cy="${y}" r="4.5" fill="none" stroke="#147A5E" stroke-width="1.6"/>
             <text x="${xEnd + 58}" y="${y + 4}" font-family="IBM Plex Mono, monospace" font-size="10.5" fill="#D94226" font-weight="600">← HIDDEN BY LOOP (+0.74)</text>`
          : "";

      const overflowArrow = overflow
        ? `<path d="M ${xEnd - 10} ${y - 5} L ${xEnd + 2} ${y} L ${xEnd - 10} ${y + 5}" fill="none" stroke="${stroke}" stroke-width="2"/>`
        : `<circle cx="${xEnd}" cy="${y}" r="${m.name === "GPT-6 Astra" ? 6.5 : 5}" fill="${stroke}"/>`;

      out += `
        <g>
          <text x="0" y="${y + 1}" font-family="Space Grotesk, sans-serif" font-size="14" font-weight="${m.name === "GPT-6 Astra" ? 700 : 600}" fill="${m.accent === "muted" ? "#6F6D66" : "#161614"}">${m.name}</text>
          <text x="0" y="${y + 15}" font-family="IBM Plex Mono, monospace" font-size="10" fill="#727068">${m.run}</text>

          <line x1="${leftPad}" y1="${y}" x2="${xEnd}" y2="${y}" stroke="${stroke}" stroke-width="${m.name === "GPT-6 Astra" ? 3 : 2}"/>
          ${trapDelta}
          ${bestMarker}
          ${overflowArrow}

          <text x="${xEnd + 14}" y="${y + 4}" font-family="IBM Plex Mono, monospace" font-size="12.5" font-weight="600" fill="${stroke}">${val.toFixed(2)}${overflow ? " ↗" : ""}</text>
        </g>
      `;
    });

    svg.innerHTML = out;
  }

  /* ------------------------------------------------------------------------
     4. SECTION 02 — INTERACTIVE 6-CLASS VISEME ATLAS
     ------------------------------------------------------------------------ */
  const VISEME_CLASSES = [
    {
      code: "V-01",
      family: "BILABIAL CLOSURE",
      ipa: "/p/ · /b/ · /m/",
      shortLabel: "Bilabial stops & nasal",
      desc: "Complete horizontal compression of upper and lower lips. Voicing (/b/), aspiration (/p/), and velum opening (/m/) happen strictly out of camera sight.",
      examples: "pat / bat / mat · pay / bay / may",
      cues: "0 mm gap · Full lip press",
      hidden: "Vocal-fold vibration · Nasal airflow",
      run2: "clip_2 (\"warm\", \"morning\") · Cited in Fable refusals",
      shape: { sym: "p·b·m", w: 68, h: 2, round: 0.04, teeth: false, tuck: false, tongue: false, mm: 0 },
    },
    {
      code: "V-02",
      family: "LABIODENTAL FRICTION",
      ipa: "/f/ · /v/",
      shortLabel: "Teeth-on-lip fricatives",
      desc: "Upper front incisors press onto the inner edge of the lower lip. One of the sharpest visual markers in silent video, though voiced /v/ and voiceless /f/ remain indistinguishable.",
      examples: "fan / van · fine / vine · feed / veed",
      cues: "4 mm gap · Lower-lip tuck under teeth",
      hidden: "Laryngeal voicing contrast",
      run2: "clip_4 (\"feed\") · clip_2 (\"very\") · clip_3 (/v/→/f/ drift)",
      shape: { sym: "f·v", w: 68, h: 10, round: 0.08, teeth: true, tuck: true, tongue: false, mm: 4 },
    },
    {
      code: "V-03",
      family: "INTERDENTAL PROTRUSION",
      ipa: "/θ/ · /ð/",
      shortLabel: "Tongue-tip dental fricatives",
      desc: "Tongue tip advances visibly between upper and lower front teeth. Highly legible at 10 fps, making function words like \"the\" and \"this\" strong visual anchors.",
      examples: "thigh / thy · thin / then · the / this",
      cues: "8–9 mm gap · Visible tongue tip",
      hidden: "Voicing contrast (/θ/ vs /ð/)",
      run2: "clip_4 (\"the\") · clip_2 (\"this\") — both recovered by Astra",
      shape: { sym: "θ·ð", w: 68, h: 16, round: 0.1, teeth: true, tuck: false, tongue: true, mm: 9 },
    },
    {
      code: "V-04",
      family: "ALVEOLAR CLUSTER",
      ipa: "/t/ · /d/ · /n/ · /s/ · /z/ · /l/",
      shortLabel: "Six-way hidden collapse",
      desc: "Six of English's most frequent consonants share a narrow, slightly parted aperture while the tongue taps the alveolar ridge behind the upper teeth — creating massive homophene overlap.",
      examples: "do / to / no / so · did / lid / tin",
      cues: "6–9 mm gap · Narrow dental slit",
      hidden: "Tongue-ridge contact · Sibilance · Nasality",
      run2: "clip_1 (\"are you doing\" ↔ \"did you do\")",
      shape: { sym: "t·d·n·s", w: 66, h: 14, round: 0.14, teeth: true, tuck: false, tongue: false, mm: 8 },
    },
    {
      code: "V-05",
      family: "LABIAL ROUNDING",
      ipa: "/w/ · /uː/ · /ʃ/ · /r/",
      shortLabel: "Protruded circular aperture",
      desc: "Strong lip rounding and forward protrusion compress horizontal mouth width by over 50%. Easily spotted even in medium-framing video, anchoring word boundaries.",
      examples: "what / warm / you / soon / too",
      cues: "Tight circular O · >50% width contraction",
      hidden: "Posterior tongue elevation",
      run2: "clip_1 (\"what\", \"you\") · clip_2 (\"warm\") · clip_3 (\"soon\"→\"too\")",
      shape: { sym: "w·uː", w: 34, h: 18, round: 0.94, teeth: false, tuck: false, tongue: false, mm: 10 },
    },
    {
      code: "V-06",
      family: "OPEN JAW VOWELS",
      ipa: "/ɑː/ · /ɒ/ · /aɪ/ · /ɔː/",
      shortLabel: "Maximum jaw drop",
      desc: "Vertical mandibular depression reaches 22–28 mm. Forms the rhythmic syllable skeleton of silent speech, letting decoders count stressed syllables even when consonants blur.",
      examples: "dog / warm / morning / I'd / like",
      cues: "22–27 mm vertical jaw opening",
      hidden: "Backness & pharyngeal resonance",
      run2: "clip_4 (\"dog\") · clip_3 (\"I'd like\" opening lock)",
      shape: { sym: "ɑː·ɒ", w: 56, h: 43, round: 0.55, teeth: false, tuck: false, tongue: false, mm: 25 },
    },
  ];

  let activeVisemeIdx = 0;

  function buildVisemeLab() {
    const sel = document.getElementById("viseme-selector");
    if (!sel) return;
    sel.innerHTML = VISEME_CLASSES.map(
      (vc, i) => `
      <button type="button" class="viseme-btn ${i === activeVisemeIdx ? "is-active" : ""}" role="tab" aria-selected="${i === activeVisemeIdx}" data-vidx="${i}">
        <span class="viseme-btn__ipa">${vc.ipa}</span>
        <span class="viseme-btn__label">${vc.code} · ${vc.shortLabel}</span>
      </button>`
    ).join("");

    sel.querySelectorAll(".viseme-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeVisemeIdx = Number(btn.dataset.vidx);
        updateVisemeLab();
      });
    });

    updateVisemeLab();
  }

  function updateVisemeLab() {
    const vc = VISEME_CLASSES[activeVisemeIdx];
    document.querySelectorAll("#viseme-selector .viseme-btn").forEach((b, i) => {
      b.classList.toggle("is-active", i === activeVisemeIdx);
      b.setAttribute("aria-selected", String(i === activeVisemeIdx));
    });

    const svg = document.getElementById("viseme-detail-svg");
    if (svg) renderMouthSVG(svg, vc.shape, { cx: 120, cy: 96 });

    document.getElementById("viseme-code").textContent = vc.code;
    document.getElementById("viseme-family").textContent = vc.family;
    document.getElementById("viseme-ipa-big").textContent = vc.ipa;
    document.getElementById("viseme-desc").textContent = vc.desc;
    document.getElementById("viseme-examples").textContent = vc.examples;
    document.getElementById("viseme-cues").textContent = vc.cues;
    document.getElementById("viseme-hidden").textContent = vc.hidden;
    document.getElementById("viseme-run2").textContent = vc.run2;
  }

  /* ------------------------------------------------------------------------
     5. SECTION 03 — INTERACTIVE SHUTTER-SLIT SAMPLER (1 FPS VS 10 FPS)
     ------------------------------------------------------------------------ */
  let activeFps = 10;

  function renderShutterSim() {
    const svg = document.getElementById("shutter-sim-svg");
    if (!svg) return;

    const W = 680;
    const padL = 44;
    const padR = 24;
    const plotW = W - padL - padR;
    const baseY = 175;
    const amp = 115;

    // Continuous synthetic lip-aperture trajectory over 2.4s active speech window of clip_4 ("Did you feed the dog?")
    const curveFn = (t) => {
      // t in [0, 1] -> multi-peak speech articulation envelope
      const peaks = [
        [0.08, 0.45, 0.045], // D-i
        [0.2, 0.35, 0.04],   // you
        [0.34, 0.14, 0.032], // f (labiodental tuck!)
        [0.44, 0.56, 0.05],  // ee
        [0.58, 0.32, 0.04],  // d / th
        [0.68, 0.48, 0.042], // e
        [0.82, 0.92, 0.062], // d-O-g (max open vowel!)
        [0.93, 0.34, 0.04],  // g
      ];
      let y = 0.08;
      for (const [mu, h, s] of peaks) {
        y += h * Math.exp(-0.5 * Math.pow((t - mu) / s, 2));
      }
      return Math.min(y, 1.0);
    };

    // High-res ground-truth curve
    const pts = [];
    const steps = 160;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = padL + t * plotW;
      const y = baseY - curveFn(t) * amp;
      pts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }

    // Sample points at 1 fps (3 samples in 2.4s window) vs 10 fps (24 samples)
    const sampleCount = activeFps === 1 ? 3 : 24;
    const sampledPts = [];
    for (let i = 0; i < sampleCount; i++) {
      const t = (i + 0.4) / sampleCount;
      const x = padL + t * plotW;
      const y = baseY - curveFn(t) * amp;
      sampledPts.push({ x, y, t });
    }

    const reconstructed = sampledPts
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ");

    const phonemes = [
      { t: 0.08, label: "/dɪ/" },
      { t: 0.2, label: "/juː/" },
      { t: 0.34, label: "/f/" },
      { t: 0.44, label: "/iːd/" },
      { t: 0.62, label: "/ðə/" },
      { t: 0.82, label: "/dɒɡ/" },
    ];

    svg.innerHTML = `
      <!-- Horizontal Reference Guides -->
      <line x1="${padL}" y1="${baseY}" x2="${W - padR}" y2="${baseY}" stroke="#161614" stroke-width="1.2"/>
      <line x1="${padL}" y1="${baseY - amp * 0.5}" x2="${W - padR}" y2="${baseY - amp * 0.5}" stroke="#E3E1DA" stroke-width="1" stroke-dasharray="3 4"/>
      <line x1="${padL}" y1="${baseY - amp}" x2="${W - padR}" y2="${baseY - amp}" stroke="#E3E1DA" stroke-width="1" stroke-dasharray="3 4"/>

      <!-- Y Axis Labels -->
      <text x="0" y="${baseY + 3}" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="#727068">0mm</text>
      <text x="0" y="${baseY - amp * 0.5 + 3}" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="#727068">12mm</text>
      <text x="0" y="${baseY - amp + 3}" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="#727068">25mm</text>

      <!-- True Continuous Viseme Envelope -->
      <path d="${pts.join(" ")}" fill="none" stroke="#B8B5AA" stroke-width="2" stroke-dasharray="4 3"/>

      <!-- Reconstructed Sampled Path -->
      <path d="${reconstructed}" fill="none" stroke="${activeFps === 10 ? "#147A5E" : "#D94226"}" stroke-width="2.2"/>

      <!-- Vertical Shutter Needles & Captured Aperture Dots -->
      ${sampledPts
        .map(
          (p) => `
          <line x1="${p.x.toFixed(1)}" y1="${baseY}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}"
            stroke="${activeFps === 10 ? "#147A5E" : "#D94226"}" stroke-width="${activeFps === 10 ? 1 : 1.5}" opacity="0.45"/>
          <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${activeFps === 10 ? 3.5 : 5.5}"
            fill="${activeFps === 10 ? "#147A5E" : "#D94226"}"/>`
        )
        .join("")}

      <!-- Phoneme Labels along Time Axis -->
      ${phonemes
        .map(
          (ph) => `
          <text x="${(padL + ph.t * plotW).toFixed(1)}" y="${baseY + 20}" text-anchor="middle"
            font-family="IBM Plex Mono, monospace" font-size="11" fill="#161614" font-weight="500">${ph.label}</text>`
        )
        .join("")}

      <!-- Legend Top Right -->
      <g transform="translate(${padL}, 22)">
        <line x1="0" y1="0" x2="22" y2="0" stroke="#B8B5AA" stroke-width="2" stroke-dasharray="4 3"/>
        <text x="28" y="4" font-family="IBM Plex Mono, monospace" font-size="10" fill="#727068">TRUE LIP APERTURE (10–15 VISEMES/S)</text>
        <circle cx="290" cy="0" r="4" fill="${activeFps === 10 ? "#147A5E" : "#D94226"}"/>
        <text x="300" y="4" font-family="IBM Plex Mono, monospace" font-size="10" font-weight="600" fill="${activeFps === 10 ? "#147A5E" : "#D94226"}">${activeFps === 10 ? "10 FPS SHUTTER (RUN 2)" : "1 FPS SHUTTER (RUN 1 — ALIASED)"}</text>
      </g>
    `;

    const cap = document.getElementById("shutter-caption");
    if (cap) {
      cap.textContent =
        activeFps === 10
          ? "10 FPS SAMPLING · 80 CAPTURED FRAMES · 24,047 PROMPT TOKENS (GEMINI HIGH RES) — EVERY ARTICULATORY PEAK RESOLVED, YET GEMINI STILL FAILED (1.30 WER)"
          : "1 FPS SAMPLING · ~8 CAPTURED FRAMES · ~741 PROMPT TOKENS (RUN 1 BASELINE) — ALIASING MISSES RAPID LABIODENTAL /f/ AND OPEN /ɒ/ PEAKS";
    }
  }

  /* ------------------------------------------------------------------------
     6. SECTION 04 — DARKROOM FORENSIC ALIGNMENT & ALL-MODEL TRANSCRIPTS
     ------------------------------------------------------------------------ */
  let forensicClipIdx = 0; // clip_4 default

  const MODEL_ORDER = [
    "GPT-6 Astra",
    "Gemini 3.1 Pro",
    "Gemini 3.8 Flash",
    "Claude Opus 5",
    "Claude Fable 5.1",
  ];

  function buildForensicNav() {
    const nav = document.getElementById("forensic-clip-nav");
    if (!nav) return;

    nav.innerHTML = CLIPS.map(
      (c, i) => `
      <button type="button" class="forensic-tab ${i === forensicClipIdx ? "is-active" : ""}" role="tab" aria-selected="${i === forensicClipIdx}" data-fidx="${i}">
        <div class="forensic-tab__id">
          <span>${c.shortLabel} · ${c.duration}S</span>
          <span class="forensic-tab__wer">ASTRA ${c.astraWerFirst.toFixed(2)}</span>
        </div>
        <div class="forensic-tab__gt">"${c.gt}"</div>
      </button>`
    ).join("");

    nav.querySelectorAll(".forensic-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        forensicClipIdx = Number(btn.dataset.fidx);
        updateForensicView();
      });
    });

    updateForensicView();
  }

  function renderAlignmentSVG(clip) {
    const svg = document.getElementById("forensic-align-svg");
    if (!svg) return;

    const cols = clip.alignment.length;
    const hasLoop = Boolean(clip.loopTail);
    const totalSlots = hasLoop ? cols + 1.55 : cols;
    const W = 1080;
    const slotW = W / totalSlots;

    const gtY = 44;
    const hypY = 148;

    let html = `
      <text x="0" y="16" font-family="IBM Plex Mono, monospace" font-size="10" fill="#828078" letter-spacing="0.1em">GROUND TRUTH SPOKEN STREAM</text>
      <text x="0" y="176" font-family="IBM Plex Mono, monospace" font-size="10" fill="#33B38E" letter-spacing="0.1em">GPT-6 ASTRA FIRST-SENTENCE DECODING</text>
    `;

    clip.alignment.forEach((pair, i) => {
      const cx = i * slotW + slotW * 0.44;
      const color =
        pair.status === "exact" ? "#33B38E" : pair.status === "near" ? "#E5A03D" : "#EF5E42";
      const dash = pair.status === "exact" ? "" : pair.status === "near" ? 'stroke-dasharray="4 3"' : 'stroke-dasharray="2 4"';
      const tag =
        pair.status === "exact" ? "LOCK" : pair.status === "near" ? "VISEME ≈" : "DIVERGE";

      html += `
        <!-- Ground truth word & IPA -->
        <text x="${cx}" y="${gtY}" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="22" font-weight="700" fill="#F3F3EE">${pair.gt}</text>
        <text x="${cx}" y="${gtY + 20}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="#828078">${pair.ipa}</text>

        <!-- Vertical Optical Alignment Beam -->
        <line x1="${cx}" y1="${gtY + 30}" x2="${cx}" y2="${hypY - 26}" stroke="${color}" stroke-width="1.6" ${dash}/>
        <circle cx="${cx}" cy="${gtY + 30}" r="2.8" fill="${color}"/>
        <circle cx="${cx}" cy="${hypY - 26}" r="2.8" fill="${color}"/>

        <!-- Match Status Micro-Label -->
        <text x="${cx + 8}" y="${(gtY + hypY) / 2 + 4}" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="${color}" letter-spacing="0.06em">${tag}</text>

        <!-- Decoded Word -->
        <text x="${cx}" y="${hypY}" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="21" font-weight="600" fill="${color}">${pair.hyp}</text>
      `;
    });

    if (hasLoop) {
      const lx = cols * slotW + 18;
      const lw = W - lx - 10;
      html += `
        <line x1="${lx - 12}" y1="30" x2="${lx - 12}" y2="162" stroke="#2C2B27" stroke-width="1" stroke-dasharray="3 3"/>
        <text x="${lx}" y="46" font-family="IBM Plex Mono, monospace" font-size="10" fill="#EF5E42" letter-spacing="0.08em">REPETITION ECHO TAIL</text>
        <!-- Crisp repeating pulse icon -->
        <path d="M ${lx} 96 L ${lx + 16} 96 L ${lx + 24} 78 L ${lx + 32} 112 L ${lx + 40} 96 L ${lx + 56} 96 L ${lx + 64} 82 L ${lx + 72} 108 L ${lx + 80} 96 L ${lx + 96} 96 L ${lx + 102} 87 L ${lx + 108} 103 L ${lx + 114} 96 L ${lx + Math.min(lw, 220)} 96"
          fill="none" stroke="#EF5E42" stroke-width="1.5" opacity="0.85"/>
        <text x="${lx}" y="146" font-family="IBM Plex Mono, monospace" font-size="11.5" fill="#828078">"${clip.loopTail.slice(0, 32)}${clip.loopTail.length > 32 ? "…" : ""}"</text>
      `;
    }

    svg.innerHTML = html;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatTranscript(row, clip) {
    const resp = row.response || "—";
    if (row.outcome === "refusal") {
      return `<span class="transcript-row__refusal">[REFUSAL]</span> ${escapeHtml(resp)}`;
    }
    if (row.model === "GPT-6 Astra" && clip.loopTail) {
      const idx = resp.indexOf(clip.loopTail);
      if (idx > 0) {
        const firstPart = resp.slice(0, idx);
        const loopPart = resp.slice(idx);
        return `<strong>${escapeHtml(firstPart)}</strong><span class="transcript-row__loop" title="Repeated tail penalized by Raw WER">${escapeHtml(loopPart)}</span>`;
      }
    }
    return escapeHtml(resp);
  }

  function updateForensicView() {
    const clip = CLIPS[forensicClipIdx];
    document.querySelectorAll("#forensic-clip-nav .forensic-tab").forEach((t, i) => {
      t.classList.toggle("is-active", i === forensicClipIdx);
      t.setAttribute("aria-selected", String(i === forensicClipIdx));
    });

    document.getElementById("forensic-gt").textContent = `"${clip.gt}"`;
    document.getElementById("forensic-ipa").textContent = clip.ipa;
    document.getElementById("forensic-verdict").innerHTML =
      `${clip.verdict}<span>${clip.verdictSub}</span>`;
    document.getElementById("forensic-note").textContent = clip.note;

    renderAlignmentSVG(clip);

    const listEl = document.getElementById("forensic-transcripts");
    const clipRows = MODEL_ORDER.map((name) =>
      DATA.scores.find((s) => s.clip_id === clip.id && s.model === name)
    ).filter(Boolean);

    listEl.innerHTML = clipRows
      .map((r) => {
        const isAstra = r.model === "GPT-6 Astra";
        const isRefusal = r.outcome === "refusal";
        const wer1 = isRefusal ? "refusal" : r.wer_first_sentence.toFixed(2);
        const werRaw = isRefusal ? "—" : r.wer.toFixed(2);
        const sim = isRefusal ? "—" : `${Math.round(r.semantic_similarity * 100)}%`;
        const tokens = r.usage
          ? `${(r.usage.prompt_tokens / 1000).toFixed(1)}k in / ${r.usage.completion_tokens}${r.usage.thinking_tokens ? ` (+${(r.usage.thinking_tokens / 1000).toFixed(1)}k think)` : ""}`
          : "—";

        const werClass = !isRefusal && r.wer_first_sentence <= 0.6 ? "tstat__v--good" : isRefusal ? "tstat__v--warn" : "";

        return `
          <div class="transcript-row ${isAstra ? "is-astra" : ""}">
            <div>
              <div class="transcript-row__model">${escapeHtml(r.model)}</div>
              <div class="transcript-row__meta">${r.request_meta ? r.request_meta.video_mode : ""} · ${r.response_words} words</div>
              <div class="transcript-row__meta" style="margin-top:0.15rem;">${tokens}</div>
            </div>
            <p class="transcript-row__text">${formatTranscript(r, clip)}</p>
            <div class="transcript-row__stats">
              <div><span class="tstat__k">1st-Sent WER</span><span class="tstat__v ${werClass}">${wer1}</span></div>
              <div><span class="tstat__k">Raw WER</span><span class="tstat__v">${werRaw}</span></div>
              <div><span class="tstat__k">Similarity</span><span class="tstat__v">${sim}</span></div>
              <div><span class="tstat__k">Outcome</span><span class="tstat__v ${isRefusal ? "tstat__v--warn" : ""}">${r.outcome}</span></div>
            </div>
          </div>`;
      })
      .join("");
  }

  /* ------------------------------------------------------------------------
     7. SECTION 05 — FAILURE TAXONOMY SCATTER & 5 CADENCE SIGNATURES
     ------------------------------------------------------------------------ */
  const FAILURE_VOICES = [
    {
      id: "astra",
      name: "GPT-6 Astra",
      words: 9.75,
      wer: 0.46,
      archetype: "Terse, accurate, then loops",
      color: "#147A5E",
      quote: "“Did you feed the dog? Did you feed the dog? Did you feed...”",
      ribbonPath: "M 4 22 L 16 22 L 22 8 L 28 34 L 34 22 L 48 22 L 54 10 L 60 32 L 66 22 L 80 22 L 86 14 L 92 28 L 98 22 L 116 22",
    },
    {
      id: "pro",
      name: "Gemini 3.1 Pro",
      words: 7.0,
      wer: 1.3,
      archetype: "Short, plausible, wrong",
      color: "#161614",
      quote: "“I think I just swallowed a fly” / “I'm just reflecting on”",
      ribbonPath: "M 4 22 L 32 22 L 38 14 L 46 28 L 54 17 L 62 24 L 72 22 L 116 22",
    },
    {
      id: "flash",
      name: "Gemini 3.8 Flash",
      words: 18.75,
      wer: 2.96,
      archetype: "Scene-cued social voiceover",
      color: "#D94226",
      quote: "“I get a lot of questions about the sunroom and if it gets too cold in the winter...”",
      ribbonPath: "M 4 22 Q 18 10 30 22 T 56 22 T 82 18 T 116 24",
    },
    {
      id: "opus",
      name: "Claude Opus 5",
      words: 94.5,
      wer: 4.26,
      archetype: "94-word unhedged influencer monologue",
      color: "#B87014",
      quote: "“So I just wanted to come on here and share something with you guys, because I've been thinking about this a lot lately...”",
      ribbonPath: "M 4 22 Q 10 4 16 22 T 28 22 T 40 22 T 52 22 T 64 22 T 76 22 T 88 22 T 100 22 T 112 22",
    },
    {
      id: "fable",
      name: "Claude Fable 5.1",
      words: 31.0,
      wer: 6.1,
      archetype: "Declines 2/4 citing /p b m/ · Confabulates 2/4",
      color: "#9E3B2B",
      quote: "“Many different sounds look identical on the lips (e.g., ‘p,’ ‘b,’ and ‘m’)...”",
      ribbonPath: "M 4 22 Q 16 8 28 22 T 52 22 L 58 22 M 64 14 L 64 30 M 72 22 L 116 22",
    },
  ];

  let activeVoiceId = "astra";

  function buildFailureSection() {
    const roster = document.getElementById("voices-roster");
    if (!roster) return;

    roster.innerHTML = FAILURE_VOICES.map(
      (v) => `
      <div class="voice-item ${v.id === activeVoiceId ? "is-active" : ""}" data-vid="${v.id}" tabindex="0" role="button">
        <div>
          <div class="voice-item__head">
            <span class="voice-item__name">${v.name}</span>
            <span class="voice-item__stat">${v.words.toFixed(1)} w · ${v.wer.toFixed(2)} WER</span>
          </div>
          <div class="voice-item__archetype" style="color:${v.color};">${v.archetype}</div>
          <p class="voice-item__quote">${v.quote}</p>
        </div>
        <svg class="voice-item__ribbon" viewBox="0 0 120 44" aria-hidden="true">
          <line x1="0" y1="22" x2="120" y2="22" stroke="#D6D4CC" stroke-width="1"/>
          <path d="${v.ribbonPath}" fill="none" stroke="${v.color}" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </div>`
    ).join("");

    roster.querySelectorAll(".voice-item").forEach((el) => {
      const activate = () => {
        activeVoiceId = el.dataset.vid;
        updateFailureViews();
      };
      el.addEventListener("click", activate);
      el.addEventListener("mouseenter", activate);
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
      });
    });

    updateFailureViews();
  }

  function updateFailureViews() {
    document.querySelectorAll("#voices-roster .voice-item").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.vid === activeVoiceId);
    });

    const svg = document.getElementById("failure-scatter-svg");
    if (!svg) return;

    const W = 600;
    const H = 410;
    const padL = 56;
    const padR = 36;
    const padT = 30;
    const padB = 54;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    // Log10 X scale for words (5 .. 120) so 7, 9.75, 18.75, 31, 94.5 spread gracefully!
    const xOf = (w) => {
      const minL = Math.log10(5);
      const maxL = Math.log10(130);
      return padL + ((Math.log10(w) - minL) / (maxL - minL)) * plotW;
    };
    // Linear Y scale for WER (0 .. 6.8) with 0 at bottom!
    const yOf = (wer) => padT + (1 - wer / 6.8) * plotH;

    const xTicks = [5, 10, 20, 40, 100];
    const yTicks = [0, 1, 2, 3, 4, 5, 6];
    const yOne = yOf(1.0);

    let out = `
      <!-- Viridian Signal Band (WER < 1.0) -->
      <rect x="${padL}" y="${yOne}" width="${plotW}" height="${yOf(0) - yOne}" fill="#147A5E" opacity="0.08"/>
      <line x1="${padL}" y1="${yOne}" x2="${W - padR}" y2="${yOne}" stroke="#147A5E" stroke-width="1.3" stroke-dasharray="4 4"/>
      <text x="${W - padR - 4}" y="${yOne - 7}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="#147A5E" font-weight="600">WER = 1.00 SIGNAL THRESHOLD</text>

      <!-- Gridlines & Axes -->
      ${xTicks
        .map(
          (t) => `
          <line x1="${xOf(t)}" y1="${padT}" x2="${xOf(t)}" y2="${H - padB}" stroke="#E3E1DA" stroke-width="1"/>
          <text x="${xOf(t)}" y="${H - padB + 20}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.5" fill="#727068">${t}w</text>`
        )
        .join("")}
      ${yTicks
        .map(
          (t) => `
          <line x1="${padL}" y1="${yOf(t)}" x2="${W - padR}" y2="${yOf(t)}" stroke="${t === 0 ? "#161614" : "#E3E1DA"}" stroke-width="${t === 0 ? 1.2 : 1}"/>
          <text x="${padL - 12}" y="${yOf(t) + 4}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="10.5" fill="#727068">${t.toFixed(1)}</text>`
        )
        .join("")}

      <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${H - padB}" stroke="#161614" stroke-width="1.2"/>
      <text x="${padL + plotW / 2}" y="${H - 10}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.5" fill="#727068" letter-spacing="0.08em">AVERAGE RESPONSE LENGTH (WORDS, LOG SCALE)</text>
      <text x="16" y="${padT + plotH / 2}" text-anchor="middle" transform="rotate(-90 16 ${padT + plotH / 2})" font-family="IBM Plex Mono, monospace" font-size="10.5" fill="#727068" letter-spacing="0.08em">FIRST-SENTENCE WER</text>
    `;

    FAILURE_VOICES.forEach((v) => {
      const x = xOf(v.words);
      const y = yOf(v.wer);
      const active = v.id === activeVoiceId;
      const anchor = v.words > 60 ? "end" : "start";
      const dx = v.words > 60 ? -14 : 14;

      out += `
        <g style="cursor:pointer;" data-point-vid="${v.id}">
          ${
            active
              ? `<line x1="${padL}" y1="${y}" x2="${x}" y2="${y}" stroke="${v.color}" stroke-width="1" stroke-dasharray="3 3" opacity="0.65"/>
                 <line x1="${x}" y1="${H - padB}" x2="${x}" y2="${y}" stroke="${v.color}" stroke-width="1" stroke-dasharray="3 3" opacity="0.65"/>
                 <circle cx="${x}" cy="${y}" r="14" fill="none" stroke="${v.color}" stroke-width="1.4" opacity="0.4"/>`
              : ""
          }
          <circle cx="${x}" cy="${y}" r="${active ? 7.5 : 5.5}" fill="${v.color}"/>
          <text x="${x + dx}" y="${y - 4}" text-anchor="${anchor}" font-family="Space Grotesk, sans-serif" font-size="${active ? 13.5 : 12}" font-weight="${active ? 700 : 600}" fill="${active ? v.color : "#161614"}">${v.name}</text>
          <text x="${x + dx}" y="${y + 11}" text-anchor="${anchor}" font-family="IBM Plex Mono, monospace" font-size="10" fill="#727068">${v.words}w · ${v.wer.toFixed(2)}</text>
        </g>
      `;
    });

    svg.innerHTML = out;
    svg.querySelectorAll("[data-point-vid]").forEach((g) => {
      g.addEventListener("click", () => {
        activeVoiceId = g.dataset.pointVid;
        updateFailureViews();
      });
    });
  }

  /* ------------------------------------------------------------------------
     8. SECTION 06 — MP4 STSZ SILENCE AUDIT & COST/TOKEN LEDGER SVGS
     ------------------------------------------------------------------------ */
  function renderPreflightSVG() {
    const svg = document.getElementById("aac-preflight-svg");
    if (!svg) return;

    const bars = 42;
    const speechHeights = [26, 48, 34, 62, 74, 52, 22, 18, 66, 78, 64, 42, 30, 58, 72, 46, 20, 16, 40, 68, 76, 54, 38, 62, 70, 44, 24, 52, 66, 58, 36, 20, 48, 72, 60, 42, 28, 56, 68, 44, 30, 18];

    let html = `
      <!-- Top Track: Real Speech AAC Byte Size Variance -->
      <text x="0" y="14" font-family="IBM Plex Mono, monospace" font-size="10" fill="#9E3B2B" font-weight="600">REAL SPEECH AAC FRAMES — HIGH BYTE VARIANCE (REJECTED BY PREFLIGHT)</text>
      <line x1="0" y1="88" x2="510" y2="88" stroke="#D6D4CC" stroke-width="1"/>
      ${speechHeights
        .map(
          (h, i) =>
            `<rect x="${i * 12}" y="${88 - h * 0.78}" width="7.5" height="${h * 0.78}" fill="#9E3B2B" opacity="0.55"/>`
        )
        .join("")}

      <!-- Bottom Track: Verified Silent AAC (Constant 371-372 Bytes) -->
      <text x="0" y="118" font-family="IBM Plex Mono, monospace" font-size="10" fill="#147A5E" font-weight="600">COMMITTED CLIPS 1–4 — FLAT 371–372 BYTE FRAMES (VERIFIED SILENT)</text>
      <line x1="0" y1="172" x2="510" y2="172" stroke="#161614" stroke-width="1"/>
      ${Array.from({ length: bars })
        .map(
          (_, i) =>
            `<rect x="${i * 12}" y="${172 - (i % 5 === 0 ? 22 : 21)}" width="7.5" height="${i % 5 === 0 ? 22 : 21}" fill="#147A5E"/>`
        )
        .join("")}
      <line x1="0" y1="150" x2="510" y2="150" stroke="#147A5E" stroke-width="1" stroke-dasharray="3 3" opacity="0.6"/>
      <text x="510" y="144" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="#147A5E">371–372 B</text>
    `;
    svg.innerHTML = html;
  }

  function renderCostLedgerSVG() {
    const svg = document.getElementById("cost-ledger-svg");
    if (!svg) return;

    const costs = [
      { model: "GPT-6 Astra", input: "221,716", output: "8,752", cost: 2.65, color: "#147A5E" },
      { model: "Claude Fable 5.1", input: "249,992", output: "527", cost: 2.53, color: "#9E3B2B" },
      { model: "Claude Opus 5", input: "249,984", output: "602", cost: 1.26, color: "#B87014" },
      { model: "Gemini 3.1 Pro", input: "93,523", output: "34 (+6.4k think)", cost: 0.19, color: "#161614" },
      { model: "Gemini 3.8 Flash", input: "93,523", output: "83 (+57k think)", cost: 0.07, color: "#D94226" },
    ];

    const leftX = 224;
    const maxW = 258;
    const maxCost = 2.8;

    let out = "";
    costs.forEach((c, i) => {
      const y = 26 + i * 50;
      const bw = Math.max((c.cost / maxCost) * maxW, 6);
      out += `
        <text x="0" y="${y}" font-family="Space Grotesk, sans-serif" font-size="13.5" font-weight="600" fill="#161614">${c.model}</text>
        <text x="0" y="${y + 15}" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="#727068">${c.input} in · ${c.output} out</text>

        <rect x="${leftX}" y="${y - 9}" width="${maxW}" height="12" fill="#EAE9E3"/>
        <rect x="${leftX}" y="${y - 9}" width="${bw.toFixed(1)}" height="12" fill="${c.color}"/>

        <text x="${leftX + maxW + 14}" y="${y + 1}" font-family="IBM Plex Mono, monospace" font-size="13" font-weight="600" fill="#161614">$${c.cost.toFixed(2)}</text>
      `;
    });

    svg.innerHTML = out;
  }

  /* ------------------------------------------------------------------------
     9. SECTION 07 — RUN 3 TIMELINE, CHANNEL CONCENTRATION & 73-CLIP INDEX
     ------------------------------------------------------------------------ */
  function renderCutoffTimelineSVG() {
    const svg = document.getElementById("cutoff-timeline-svg");
    if (!svg) return;

    const W = 1120;
    const y = 104;
    const xStart = 32;
    const xEnd = W - 32;
    const span = xEnd - xStart;

    const milestones = [
      { t: 0.04, date: "2025-09-26", title: "Run 1/2 Source Video", sub: "ReadMyLipsbyCynthia (4 clips)", color: "#727068", above: true },
      { t: 0.41, date: "2026-03", title: "Gemini 3.8 Flash Cutoff", sub: "Run 1 completed", color: "#161614", above: false },
      { t: 0.56, date: "2026-05", title: "Claude Opus 5 Cutoff", sub: "Training window ends", color: "#161614", above: true },
      { t: 0.66, date: "2026-06-01", title: "RUN 3 HARD FLOOR", sub: "All 73 clips uploaded ≥ Jun 1", color: "#D94226", above: false, major: true },
      { t: 0.96, date: "2026-09-19", title: "Run 2 + yt-dlp Audit", sub: "73 IDs verified · Astra cutoff unpublished", color: "#147A5E", above: true },
    ];

    const floorX = xStart + 0.66 * span;

    let html = `
      <!-- Post-Cutoff Safe Zone Shading -->
      <rect x="${floorX}" y="22" width="${xEnd - floorX}" height="162" fill="#147A5E" opacity="0.08"/>
      <text x="${xEnd - 12}" y="172" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="10" fill="#147A5E" font-weight="600" letter-spacing="0.08em">POST-CUTOFF SPECIMEN WINDOW (73 CLIPS) →</text>

      <!-- Main Horizontal Axis -->
      <line x1="${xStart}" y1="${y}" x2="${xEnd}" y2="${y}" stroke="#161614" stroke-width="1.5"/>

      <!-- Vertical Vermilion Cutoff Horizon -->
      <line x1="${floorX}" y1="16" x2="${floorX}" y2="188" stroke="#D94226" stroke-width="2"/>
    `;

    milestones.forEach((m) => {
      const x = xStart + m.t * span;
      const anchor = m.major ? "start" : m.t < 0.15 ? "start" : m.t > 0.85 ? "end" : "middle";
      const textX = m.major ? x + 12 : x;
      const ty = m.above ? y - 34 : y + 38;
      const sy = m.above ? y - 19 : y + 53;
      const dy = m.above ? y - 50 : y + 23;

      html += `
        ${m.major ? "" : `<line x1="${x}" y1="${y}" x2="${x}" y2="${m.above ? y - 12 : y + 12}" stroke="${m.color}" stroke-width="1.4"/>`}
        <circle cx="${x}" cy="${y}" r="${m.major ? 6 : 4.5}" fill="${m.color}"/>
        <text x="${textX}" y="${dy}" text-anchor="${anchor}" font-family="IBM Plex Mono, monospace" font-size="10.5" font-weight="600" fill="${m.color}">${m.date}</text>
        <text x="${textX}" y="${ty}" text-anchor="${anchor}" font-family="Space Grotesk, sans-serif" font-size="13" font-weight="700" fill="#161614">${m.title}</text>
        <text x="${textX}" y="${sy}" text-anchor="${anchor}" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="#727068">${m.sub}</text>
      `;
    });

    svg.innerHTML = html;
  }

  function renderChannelConcentrationSVG() {
    const svg = document.getElementById("channel-bars-svg");
    if (!svg || !DATA.channels.length) return;

    const top = DATA.channels.slice(0, 10);
    const othersCount = DATA.channels.slice(10).reduce((acc, c) => acc + c.count, 0);
    const rows = [...top, { name: "10 other channels (1–2 clips each)", count: othersCount, asl: false, other: true }];

    const barStartX = 216;
    const maxBarW = 198;
    const maxCount = 18;

    let out = "";
    rows.forEach((ch, i) => {
      const y = 20 + i * 31;
      const bw = (ch.count / maxCount) * maxBarW;
      const fill = ch.asl ? "#B87014" : ch.other ? "#B8B5AA" : i === 0 ? "#D94226" : "#161614";
      const label = ch.name.length > 26 ? ch.name.slice(0, 25) + "…" : ch.name;

      out += `
        <text x="0" y="${y + 4}" font-family="DM Sans, sans-serif" font-size="12" font-weight="${i < 2 ? 600 : 400}" fill="${ch.other ? "#727068" : "#161614"}">${escapeHtml(label)}</text>
        <rect x="${barStartX}" y="${y - 6}" width="${bw.toFixed(1)}" height="12" fill="${fill}"/>
        <text x="${barStartX + bw + 8}" y="${y + 4}" font-family="IBM Plex Mono, monospace" font-size="11" font-weight="600" fill="${fill}">${ch.count}${ch.asl ? " ASL" : ""}</text>
      `;
    });

    svg.innerHTML = out;
  }

  let corpusFilter = "all";
  let corpusQuery = "";

  function renderCorpusList() {
    const list = document.getElementById("corpus-list");
    if (!list) return;

    const q = corpusQuery.trim().toLowerCase();
    const filtered = DATA.candidates.filter((c) => {
      if (corpusFilter === "captioned" && !c.captions) return false;
      if (corpusFilter === "speech" && c.asl) return false;
      if (corpusFilter === "asl" && !c.asl) return false;
      if (q) {
        const hay = `${c.id} ${c.channel} ${c.title} ${c.date}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (!filtered.length) {
      list.innerHTML = `<p class="mono" style="font-size:0.8rem; color:var(--ink-muted); padding:1.5rem 0;">No verified clips match that filter.</p>`;
      return;
    }

    list.innerHTML = filtered
      .map((c) => {
        const flagHtml = c.asl
          ? `<span class="corpus-row__flag flag-asl">ASL · ${c.duration}s</span>`
          : c.captions
          ? `<span class="corpus-row__flag flag-cc">CC · ${c.duration}s</span>`
          : `<span class="corpus-row__flag flag-raw">RAW · ${c.duration}s</span>`;

        return `
          <div class="corpus-row">
            <span class="corpus-row__date">${c.date}</span>
            <div class="corpus-row__title">
              ${escapeHtml(c.title)}
              <span class="corpus-row__channel">${escapeHtml(c.channel)} · <code class="mono">${escapeHtml(c.id)}</code></span>
            </div>
            ${flagHtml}
          </div>`;
      })
      .join("");
  }

  /* ------------------------------------------------------------------------
     10. NAVIGATION SCROLL-SPY & INITIALIZATION
     ------------------------------------------------------------------------ */
  function initScrollSpy() {
    const links = Array.from(document.querySelectorAll(".topnav__link"));
    const sections = links
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);

    if (!("IntersectionObserver" in window) || !sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = "#" + entry.target.id;
            links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === id));
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((s) => io.observe(s));
  }

  function init() {
    // Hero Articulator
    buildHeroTabs();
    updateHeroClip();
    startHeroLoop();

    const playBtn = document.getElementById("btn-play-visemes");
    if (playBtn) {
      playBtn.addEventListener("click", () => {
        heroPlaying = !heroPlaying;
        syncPlayButton();
      });
    }

    // Section 01 WER Mode Toggle
    document.querySelectorAll("[data-wer-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        werMode = btn.dataset.werMode;
        document.querySelectorAll("[data-wer-mode]").forEach((b) =>
          b.classList.toggle("is-active", b.dataset.werMode === werMode)
        );
        const note = document.getElementById("wer-mode-note");
        if (note) {
          note.innerHTML =
            werMode === "first"
              ? "Scoring the first sentence isolates decoding accuracy from repetition loops: GPT-6 Astra drops to <strong>0.46 avg WER</strong> (<strong>0.00</strong> on clip_4). Toggle to Raw WER to see how repetition buries it at <strong>1.20</strong>."
              : "Under Run 1's raw aggregate metric, GPT-6 Astra's repetition loops count as insertions — pushing its exact clip_4 match to 1.60 and its average to <strong>1.20</strong>, making a breakthrough look like a miss. Claude Opus 5 spikes off-scale to <strong>17.33</strong>.";
        }
        renderWerChart();
      });
    });
    renderWerChart();

    // Section 02 Viseme Lab
    buildVisemeLab();

    // Section 03 Shutter Sampler
    document.querySelectorAll("[data-fps]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeFps = Number(btn.dataset.fps);
        document.querySelectorAll("[data-fps]").forEach((b) =>
          b.classList.toggle("is-active", Number(b.dataset.fps) === activeFps)
        );
        renderShutterSim();
      });
    });
    renderShutterSim();

    // Section 04 Darkroom Forensic Decoder
    buildForensicNav();

    // Section 05 Failure Taxonomy
    buildFailureSection();

    // Section 06 Apparatus SVGs
    renderPreflightSVG();
    renderCostLedgerSVG();

    // Section 07 Run 3 Corpus Explorer
    renderCutoffTimelineSVG();
    renderChannelConcentrationSVG();
    renderCorpusList();

    document.querySelectorAll("#corpus-filters .filter-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        corpusFilter = btn.dataset.filter;
        document.querySelectorAll("#corpus-filters .filter-tab").forEach((b) =>
          b.classList.toggle("is-active", b.dataset.filter === corpusFilter)
        );
        renderCorpusList();
      });
    });

    const searchInput = document.getElementById("corpus-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        corpusQuery = e.target.value;
        renderCorpusList();
      });
    }

    initScrollSpy();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
