# Notes — Sprint 38-O

**Purpose:** Working notes during discovery. Not authoritative — observations docs supersede.

---

## 2026-06-05 — Sprint pack created

- Charter issued from [38N-5 follow-on](../2026-06-05-sprint-38n-page-fidelity-hardening/observations/38N-5-sprint-closure.md).
- 38O-1 initial trace completed on `EV-38M-AFTER` / `EV-38N-AFTER`.
- Key early signal: A4 post-merge carries **both** thin compose stubs and full merged bodies; render lists weak blocks first.

---

## 2026-06-05 — 38O-2 complete

- Formal taxonomy (17 role families) + mapping tables M1–M20.
- A4 deep dive with render h4 positions (Modelling Note 8995 vs Worked Judgement 16908).
- Authority analysis: merge contract vs page key vs render heading.
- Hypotheses H1–H8 drafted for 38O-3.

---

## 2026-06-05 — 38O-3 complete

- 10 failure modes catalogued; full inventory M1–M20.
- Frequency: CP/RI A4-only; RN/DP system-wide.
- A4 = one pattern (compose weaken → merge overlay → render precedence).
- O2-H1–H6 supported; causal model for 38O-4.

---

## 2026-06-05 — 38O-5 sprint closed

- Verdict: SUCCESS.
- Hypothesis supported: role fidelity distinct from body fidelity.
- Disposition: charter future implementation sprint (F1 registry-led hybrid).
- No implementation in 38O.

---

## Open questions (for future implementation sprint)

1. Is there a canonical role ontology in IFP/GAM-PRES that the page model should enforce?
2. Does manual inflation testing run without `applyGamMaterialsToComposedPage` (explaining “page thinner” UX)?
3. Which render paths assign headings from page keys vs GAM type/purpose?
4. Do scaffold hints at activity-row level compensate for missing material-level reasoning supports in learner UX?

---

## Do not do in 38O

- Reopen 38M/38N
- Change prompts, renderer, validators, or production libs
- Implement fixes before 38O-4 recommendation and separate implementation charter
