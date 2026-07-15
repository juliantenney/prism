# Sprint 61 — Benchmark Run Record (single scored run)

**Copy this file into:** `artefacts/phase-a/<benchmark-id>/<run-id>/classification.md`  
**Also fill:** `classification.json` (same fields, machine-readable)  
**Authority:** [PHASE-A-PROTOCOL.md](../PHASE-A-PROTOCOL.md) (frozen)

---

## Identity

| Field | Value |
| ----- | ----- |
| benchmark ID | S61-B__ |
| run ID | A-S61-B__-r_ |
| phase | A |
| scored | Yes / No (smoke = No) |
| operator | |
| timestamp (local ISO) | |
| workflow name / id | |

---

## Sets

| Field | Value |
| ----- | ----- |
| expected_set | e.g. `["mechanism_explanation"]` or `[]` |
| actual_set | e.g. `[]` or `["process_walkthrough"]` |

---

## Capture / plan / persist

| Field | Value (Y / N / NA) |
| ----- | ------------------ |
| archetype_plan present (any Priority-1 row) | |
| plan shape valid (all rows in actual_set) | |
| capture valid (`validateDlaPartialPageCapture`) | |
| persisted (fields survive persist/reload) | |

---

## Delivery

| Field | Value |
| ----- | ----- |
| delivery check required? | Yes if `actual_set` non-empty and plans valid; else NA |
| expected routes | |
| delivered routes | |
| `archetype_delivery.pass` | true / false / NA |

---

## Classification

| Field | Value |
| ----- | ----- |
| classification (one code) | |
| precedence step that fired | 1–10 from protocol §7 |
| ambiguous? | No / Yes → escalate (see execution guide) |

---

## Evidence files (tick = present in this run folder)

- [ ] `meta.json`
- [ ] `brief.txt`
- [ ] `activation.json`
- [ ] `dla-prompt-excerpt.txt`
- [ ] `dla-capture.json`
- [ ] `dla-validation.json`
- [ ] `persisted-page.json`
- [ ] `expected-set.json`
- [ ] `gam-prompt-final.txt` *(required when delivery check applies)*
- [ ] `prism-final-gam-prompt.json` *(required when delivery check applies)*
- [ ] `classification.json`
- [ ] `classification.md` *(this file)*

Incomplete pack → classify **`INVALID_TEST`**.

---

## Notes

_

---

## Matrix update

After saving this folder:

1. Update the matching row in [acceptance-matrix.md](../acceptance-matrix.md) Phase A run table.  
2. If r1–r3 for this brief are complete, update brief-level outcomes.  
3. Link artefact path: `artefacts/phase-a/<benchmark-id>/<run-id>/`
