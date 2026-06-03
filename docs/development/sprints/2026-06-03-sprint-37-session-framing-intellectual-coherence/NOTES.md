# Sprint 37 — programme notes

**Date:** 2026-06-03

---

## Founding note

PRISM should frame each learner page as a **coherent intellectual journey**, not merely a well-structured content artefact.

---

## Stable foundations (entry)

| Foundation | Detail |
|------------|--------|
| Renderer contracts | Sprint 34 golden fixture, MathJax, material markdown paths |
| Activity pedagogy | Sprint 35 learner-action rhetoric, fading, closure fields |
| Visual session design | Sprint 36 V31_7–V31_11, role grammar, affordance hook placement |
| **Test floor** | **593 pass / 0 fail** (`node --test tests/*.test.js`) |

---

## Evaluation anchors

| Anchor | Location |
|--------|----------|
| RNA enhanced | `tests/fixtures/page-render/ld-rna-hcv-assessment-page.json` + latest run HTML |
| RNA baselines | `RNAOriginal.html`, `RNAOLD.html` (manual) |
| Climate | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` + `climate change.html` |
| Confidence intervals | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` |
| Marx self-study | `tests/fixtures/page-render/marx-self-study-page.json` |

---

## Slice log

| Slice | Status | Notes file |
|-------|--------|------------|
| 37-1 Session orientation rhetoric | Complete | [observations/37-1-session-orientation-rhetoric.md](observations/37-1-session-orientation-rhetoric.md) |
| 37-2 Conceptual tension / why-this-is-hard | Complete | [observations/37-2-conceptual-tension-and-difficulty-framing.md](observations/37-2-conceptual-tension-and-difficulty-framing.md) |
| 37-3 Intellectual progression signalling | Complete | [observations/37-3-intellectual-progression-signalling.md](observations/37-3-intellectual-progression-signalling.md) |
| 37-4 Synthesis and epistemic closure | Complete | [observations/37-4-synthesis-and-epistemic-closure.md](observations/37-4-synthesis-and-epistemic-closure.md) |
| 37-5 Transfer and durable understanding | Complete | [observations/37-5-transfer-and-durable-understanding.md](observations/37-5-transfer-and-durable-understanding.md) |

---

## Programme constraints (repeat)

- **No workflow expansion**
- **No schema expansion**
- **No renderer/CSS** unless slice-documented and unavoidable
- **No adaptive tutoring or reflective diary engines**
- **No verbose motivational or generic reflection filler**
- **Preserve Sprint 34/35/36 regression contracts**
