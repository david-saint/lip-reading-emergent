# Run 3 candidate clips — contamination control

73 candidates, every one verified against yt-dlp on 2026-09-19: the id
resolves, and the upload date and duration below are the API's values, not a
harvester's claim.

## Why these and not more of the Run 1 kind

Run 1's four clips all came from one 2025-09-26 lipreading-practice compilation
(ReadMyLipsbyCynthia). GPT-6 Astra recovering two of them verbatim is therefore
compatible with genuine lip-reading *and* with having memorised that video.

Every clip here was uploaded on or after 2026-06-01, which is past Gemini 3.8
Flash's March 2026 training cutoff and past Claude Opus 5's May 2026 cutoff.
GPT-6 Astra's cutoff is not published; treat it as the weakest link in this
control until it is known.

## Selection criteria

- upload_date >= 2026-06-01 (the contamination control)
- duration 3-25s
- a single speaker facing camera, articulating clearly, in English

## Not yet done

- **Frame screening for burned-in text.** A model reading an on-screen word is
  indistinguishable from one reading lips. 16 rows are ASL channels, where
  vocabulary cards are common and the speaker may be signing rather than speaking.
- **Ground truth.** 38 of 73 carry auto-captions (ASR output, needs
  spot-checking). The rest need the phrase taken from the title or transcribed.
- **Audio stripping**, and a silence check as in run.py's preflight.

## Speaker concentration

20 channels. The top two supply 30 of 73 rows, so this is not 73 independent speakers —
weight results accordingly.

| Channel | Clips |
|---|---|
| Megija Liva | Speech Therapy | 18 |
| Sign & Wander  | 12 |
| Sound Smart | 6 |
| The English Coach | 6 |
| ASL Interactive | 4 |
| Let's Learn Together | 4 |
| Adventures in Speech Pathology | 3 |
| English by Stéaviñ | EBS Tutorials | 2 |
| HEARa | 2 |
| Jules Tush Speech Pathologist | 2 |
| PronounceRight | 2 |
| Pronunciation | 2 |
| Speech Secrets | 2 |
| Word in Seconds | 2 |
| Cambridge English Hub | 1 |
| Daily English Sentences | 1 |
| English with Bob | 1 |
| Mr. Hisham | 1 |
| Simple English Lessons | 1 |
| Wish Bloom | 1 |

## Candidates

| Video | Uploaded | Secs | Channel | Captions | Title |
|---|---|---|---|---|---|
| `ETfHOFHCSOA` | 20260819 | 21 | ASL Interactive | no | ⬆️ Ready for fall? I got you BOO 🎃 Five new 24/7 |
| `RnzLM21rjsA` | 20260901 | 15 | ASL Interactive | no | Level up your ASL signs in minutes #ASL #ASLprac |
| `9LCfbY9x2zg` | 20260902 | 15 | ASL Interactive | no | Learn drink signs while you study! #asl #signlan |
| `J95jkjD4TQM` | 20260915 | 15 | ASL Interactive | no | Don't Miss This ASL 4 Vocabulary Drill ❄️ Full l |
| `WOBScWYtieU` | 20260906 | 21 | Adventures in Speech Pathology | yes | Final consonant deletion toolkit: Everything you |
| `ga3qYIpVWww` | 20260909 | 15 | Adventures in Speech Pathology | yes | Visual cues not working in speech therapy? Try g |
| `t_dAmJ7_xCM` | 20260915 | 21 | Adventures in Speech Pathology | yes | Why It Takes Me TWO Sessions to Assess Articulat |
| `fi7n4VvUXpo` | 20260608 | 10 | Cambridge English Hub | yes | Silent G Words: GNOME & SIGN Pronunciation #Shor |
| `6cld1Mn-Zjo` | 20260718 | 3 | Daily English Sentences | yes | Daily English Speaking Practice #Shorts #English |
| `GIGjxsCr9t4` | 20260905 | 21 | English by Stéaviñ | EBS Tutorials | no | How to Pronounce Eat |
| `Wbl5QT43yc8` | 20260912 | 22 | English by Stéaviñ | EBS Tutorials | yes | How to Pronounce Cummingtonite |
| `SJhrkN24yC0` | 20260918 | 20 | English with Bob | yes | How to Pronounce Acknowledge in American English |
| `3zEQxCXuPCU` | 20260615 | 9 | HEARa | yes | Have hearing loss, but don’t need help |
| `29rQtTfuEyU` | 20260619 | 23 | HEARa | yes | Learn to read lips No. 42 |
| `SN1dpdjxIKE` | 20260828 | 17 | Jules Tush Speech Pathologist | yes | The Relief Grief Speech Pathology #speechtherapy |
| `QrdK2Hm-OIY` | 20260915 | 15 | Jules Tush Speech Pathologist | yes | Sometimes we need a reminder... we don't need to |
| `e1TxlgG-Vtg` | 20260816 | 16 | Let's Learn Together | yes | How to pronounce EPITOME? #english #learnenglish |
| `JuwAm7FZZKs` | 20260816 | 7 | Let's Learn Together | yes | How to pronounce “NICHE” |
| `l9LAX64jXxU` | 20260816 | 22 | Let's Learn Together | yes | How to pronounce COLONEL? #learnenglish #vocabul |
| `qvf5yO6GFXg` | 20260816 | 10 | Let's Learn Together | yes | How to pronounce COLONEL? #english #learnenglish |
| `wRKiTVUXeMs` | 20260721 | 9 | Megija Liva | Speech Therapy | no | Speech Delay or Autism? 5 Signs It's More Likely |
| `r_OpTLX8p2g` | 20260722 | 13 | Megija Liva | Speech Therapy | no | Speech Delay or Autism? 5 Signs It's More Likely |
| `6mcj2LlFtew` | 20260729 | 7 | Megija Liva | Speech Therapy | no | Speech Delay or Autism? The Biggest Mistake Pare |
| `1Ue1-UlwuI4` | 20260803 | 21 | Megija Liva | Speech Therapy | no | 5 Things Parents Worry About (That Matter Much L |
| `apEVNWrLINs` | 20260812 | 17 | Megija Liva | Speech Therapy | no | What If Your Toddler Could Finally Tell You What |
| `zdjbURIFx18` | 20260824 | 12 | Megija Liva | Speech Therapy | no | Full explanation + what these play styles can ac |
| `Ga7iO7ZeJRw` | 20260825 | 6 | Megija Liva | Speech Therapy | no | Want the full explanation? 👀 Check the pinned co |
| `Z2FCROUjB4o` | 20260827 | 7 | Megija Liva | Speech Therapy | no | Speech Delay or Autism? 5 Key Signs 👇 Check the  |
| `z1wWtR_cJMk` | 20260831 | 12 | Megija Liva | Speech Therapy | no | Autism or speech delay? Full description in the  |
| `WuCKkpUOCSY` | 20260903 | 18 | Megija Liva | Speech Therapy | no | Behind the scenes = teamwork 💛. Latest YouTube:  |
| `f-QCk1WlUXc` | 20260907 | 12 | Megija Liva | Speech Therapy | no | 📍 Check the pinned comment for the full explanat |
| `BvrgFNNHlbY` | 20260908 | 10 | Megija Liva | Speech Therapy | no | Comment 7 STEPS and I’ll help you get started wi |
| `mS3eYq-Dw_k` | 20260909 | 13 | Megija Liva | Speech Therapy | no | Your turn 👇 What’s the one toy you’d 100% put on |
| `tpP83Hoszg8` | 20260911 | 9 | Megija Liva | Speech Therapy | no | You know that feeling when you’re waiting for yo |
| `4uhn5CjvC7s` | 20260914 | 8 | Megija Liva | Speech Therapy | no | Autism or Typical Play? Can You Tell the Differe |
| `0poENK70E1k` | 20260915 | 8 | Megija Liva | Speech Therapy | no | Stop Asking Your Toddler to Say It 👀 Full explan |
| `gJ3A_ZDp65M` | 20260916 | 17 | Megija Liva | Speech Therapy | no | Top Baby Toys for 0–12 Months | Speech Therapist |
| `AXdptFjszEg` | 20260917 | 7 | Megija Liva | Speech Therapy | no | 3 Mistakes to Stop Making If Your Toddler Isn’t  |
| `3i3w9g6vkqg` | 20260905 | 16 | Mr. Hisham | yes | Ubiquitous Meaning in English | Pronunciation, D |
| `x_6cqwnG0gU` | 20260605 | 9 | PronounceRight | yes | Bureaucracy Pronunciation (Very Tricky!) 😲 #pron |
| `TajziP9rnY4` | 20260610 | 9 | PronounceRight | yes | Chthonic Pronunciation (Hardest Word Ever?) 😳 #p |
| `XkHpVG-vFeg` | 20260903 | 9 | Pronunciation | yes | How do you pronounce “Tomato” correctly? 🍅 |
| `wGYgR2BJ1W4` | 20260904 | 9 | Pronunciation | yes | How do you pronounce “Herb” correctly? 🌿 |
| `bCssFrPvadA` | 20260603 | 4 | Sign & Wander | no | How to sign QR in ASL. #asl |
| `vvwSJMAd_is` | 20260604 | 7 | Sign & Wander | no | How to sign TELEPROMPTER in ASL. #asl |
| `P-nboRFzS94` | 20260607 | 3 | Sign & Wander | no | Learning in ASL CREATOR . |
| `qPngaXIPKQc` | 20260609 | 21 | Sign & Wander | no | How to sign BLUETOOTH in ASL. #asl |
| `p5IrupFlY5A` | 20260613 | 7 | Sign & Wander | no | How to sign Happy Pride day in ASL #asl |
| `8c69Efv1jk4` | 20260614 | 10 | Sign & Wander | no | How to sign different sign for HELL |
| `FEwgv-ADobc` | 20260715 | 19 | Sign & Wander | no | One English word, Many ASL Meanings: FRAME | ASL |
| `tC2H64k_Xjw` | 20260717 | 5 | Sign & Wander | no | Why Are Your Pants inside Out?| ASL Sentence Pra |
| `WV04n2Nr7vw` | 20260727 | 13 | Sign & Wander | no | How to sign: GOOD LUCK in ASL - two signs. #asl |
| `jjTnDHXPinA` | 20260801 | 4 | Sign & Wander | no | Human Trafficking. Learn how to sign "human traf |
| `r5UMx2MDnXc` | 20260807 | 19 | Sign & Wander | no | ASL Semantics: Book- how to sign in ASL. |
| `RdOJgExRPHs` | 20260815 | 20 | Sign & Wander | no | TAKE Has Different Meanings in ASL | ASL Semanti |
| `Raj4h85njEs` | 20260826 | 20 | Simple English Lessons | yes | How To Say Hello in English #Shorts |
| `8jZcp93gJw4` | 20260603 | 9 | Sound Smart | yes | Vignette Pronunciation (Very Tricky!) 😲 #pronunc |
| `OmyCqvf9kFQ` | 20260608 | 9 | Sound Smart | yes | Forte Pronunciation (You're Probably Saying It W |
| `_aSjnLZ2fqQ` | 20260613 | 9 | Sound Smart | yes | Bdellium Pronunciation (Impossible Word? 😳) #pro |
| `x3kegFYz8hY` | 20260618 | 9 | Sound Smart | yes | Nauseous Pronunciation (You're Probably Saying I |
| `1Dtq8ofJp0U` | 20260624 | 9 | Sound Smart | yes | Carapace Pronunciation (Hard Word Alert!) 🐢 #pro |
| `9wBAWi95p3E` | 20260626 | 6 | Sound Smart | yes | Cognizant Pronunciation (99% Get It Wrong!) 🔥 #p |
| `WOQR9_lbhmI` | 20260715 | 23 | Speech Secrets | yes | SLOP means 🗣️#speech #therapy #speechtherapy #ar |
| `ePKjWXN6yY0` | 20260812 | 25 | Speech Secrets | yes | Every New Rehab Tool Needs a Volunteer… |
| `2AcUO-7TW0I` | 20260605 | 13 | The English Coach | yes | Different Spelling, Same Pronunciation (They're/ |
| `oTWArk3bzew` | 20260617 | 23 | The English Coach | yes | When the T flaps 🇺🇸 |
| `JMKCniDrJng` | 20260619 | 15 | The English Coach | yes | T Drop After N in American English 🇺🇸 |
| `Z8PGCAxzagA` | 20260722 | 15 | The English Coach | yes | The 3 levels of reducing “them” in English |
| `cD8DWht_eLE` | 20260723 | 21 | The English Coach | yes | Arnch = Aren’t |
| `eOv5HD3RJGY` | 20260724 | 20 | The English Coach | yes | 10 Word English Challenge 🇺🇸 |
| `y6uybCd-uk8` | 20260917 | 23 | Wish Bloom | yes | Good Morning 17 September 2026 | Beautiful Good  |
| `8WF5_pYAX70` | 20260629 | 12 | Word in Seconds | yes | Success Meaning in English | Pronunciation & Exa |
| `WSOh12ZJWQQ` | 20260630 | 10 | Word in Seconds | yes | Dream Meaning in English | Pronunciation & Examp |
