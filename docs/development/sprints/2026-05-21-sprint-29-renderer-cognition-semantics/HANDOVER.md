# Session handover — Sprint 29

**Date:** 2026-05-21  
**Status:** **Closed** — investigation (29-0), HTML audit (29-1), bounded renderer (29-2)

---

## Start here (archive)

1. [`sprint-29-closure.md`](sprint-29-closure.md) — programme closure checklist  
2. [`renderer-cognition-evidence-matrix.md`](renderer-cognition-evidence-matrix.md) — probe scores (29-0 / 29-1 / 29-2)  
3. [`context-files/r29-p01-html-capture.md`](context-files/r29-p01-html-capture.md) — 29-1 HTML evidence (P02, P07)  
4. [`renderer-semantics-notes.md`](renderer-semantics-notes.md) — audit + class map  
5. [`tests/utility-renderer-cognition-fields.test.js`](../../../tests/utility-renderer-cognition-fields.test.js) — 29-2 regression tests  

---

## What shipped

| Layer | Sprint 29 change |
|-------|------------------|
| **R (renderer)** | `renderCognitionFieldsForActivity` + `util-cognition*` CSS for row-level cognition fields |
| **E / O / G / C** | **No changes** |
| **Assessment render** | **No changes** |

**Test floor:** **355** (`node --test tests/*.test.js`)

---

## Residual limitation

Cognition labels inside **`task_cards` markdown** are not promoted to semantic blocks. Row-level placement is owned by composition (Sprint 28), not further renderer work under this charter.

---

## Do not extend without new charter

- Additional renderer cognition features (29-3)  
- Workflow / factor / composition edits framed as “renderer follow-up”  
- Illustration or assessment styling conflation  

---

## Verification

```bash
node --test tests/*.test.js
```

Expected: **355** pass.
