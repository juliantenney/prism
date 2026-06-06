# Notes — Sprint 38-P

**Status:** CHARTERED — 38P-1 next

---

## 2026-06-05 — Sprint pack created

- Implementation sprint chartered from 38O-5 disposition.
- F1 registry-led hybrid is mandated strategy.
- Seven phases: architecture → registry → supersession → render → validators → proof → closure.
- No code yet — 38P-1 design first.

---

## Pre-38P baseline (frozen)

| Run | proofOk | roleOk (conceptual) | Notes |
|-----|---------|---------------------|-------|
| `EV-38M-AFTER` | true | false (A4) | Primary evidence |
| `EV-38N-AFTER` | true | false (A4) | Render replay |

---

## A4 failure cases to fix (from 38O-1)

- `modelling_note` stub (273) before `worked_judgement_weak_strong` (1082)  
- `decision_table` shell before `guided_judgement_table` full  
- `transfer_prompt` stub before `transfer_prompt_evaluate` full  
- Duplicate weak+strong pairs in merged JSON and render

---

## Touch surfaces (indicative)

- `lib/page-gam-materials-preserve.js` — merge + registry  
- `lib/page-a3-materials-sequencing.js` — render ordering  
- `app.js` — render path  
- New validator module — roleOk  
- New test file — `tests/page-38p-role-fidelity.test.js`

Confirmed in 38P-1 architecture doc.

---

## Open questions

See [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) §Open implementation questions.
