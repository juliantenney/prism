# 45.3 Recommendation - NTX Addendum

**Experiment:** 45.3-NTX Non-Target Comparator Extension  
**Type:** Recommendation addendum (historical-preserving re-review)  
**Status:** Finalised  
**Authority:** `45-3-ntx-scope-addendum.md` · `45-3-ntx-comparator-workbook.md` · `45-3-ntx-execution-status.md` · `45-3-recommendation.md` · `SPRINT-45-3-EXECUTION-STATUS.md`

---

## 1) Historical Preservation Record

### Original 45.3 recommendation snapshot (preserved, not rewritten)

| Field | Historical value |
| ----- | ---------------- |
| Original recommendation artefact | `45-3-recommendation.md` |
| Original selected route | Repeat |
| Original repeat drivers | A) frozen-reference counts pending, B) distribution shift descriptors pending, C) non-target regression partial/not-assessed |
| Closure-pass history | Targeted closure resolved A and B; C remained open and was carried as blocker |
| NTX rationale for extension | Add bounded comparator evidence to resolve C without modifying base 45.3 artefacts or scope locks |

No historical text in `45-3-recommendation.md` is replaced by this addendum.

---

## 2) NTX Evidence Summary

### NTX scope executed

- Frozen D3 non-target channel only.
- Approved 5-lane comparator surface only:
  - `NTX-TXT-MRX-A1`
  - `NTX-TXT-PS-A1`
  - `NTX-WE-MRX-A1`
  - `NTX-WE-PS-A1`
  - `NTX-CL-PS-A2`

### NTX outcomes (from NTX-4)

- Lane-level indicators: all `none`.
- Type-level statuses: `text` = none, `worked_example` = none, `checklist` = none.
- Overall non-target regression status: `none`.
- Evidence sufficiency status: sufficient (bounded NTX sample).
- Blocker review result: original non-target blocker closed.

Evidence source: `45-3-ntx-comparator-workbook.md` sections I-M.

---

## 3) Repeat-Driver Re-Review

| Driver | Original state | Closure activity | Current state |
| ------ | -------------- | ---------------- | ------------- |
| A - Frozen-reference counts | pending | Targeted closure pass (45.3) | closed |
| B - Distribution shift descriptors | pending | Targeted closure pass (45.3) | closed |
| C - Non-target regression | partial/not-assessed | NTX comparator extension (NTX-0..NTX-4) | closed |

### Active blocker check

Active blocker remains: **none**.

---

## 4) Route Re-Review (Post-NTX)

### Route evaluation

| Route | Selected |
| ----- | -------- |
| Proceed | [x] |
| Repeat | [ ] |
| Stop | [ ] |

### Rationale

Proceed is selected because all original Repeat drivers are now closed with provenance-complete evidence:

- A and B were closed in targeted closure.
- C is closed in NTX-4 with sufficient bounded non-target comparator evidence and overall non-target status `none`.

No failure-level condition requiring Stop is recorded, and no active evidence blocker requiring Repeat remains.

---

## 5) Governance Outcome

| Field | Determination |
| ----- | ------------- |
| Sprint 45.3 standing after NTX | Complete; blocker-cleared via extension evidence |
| Does NTX change recommendation status? | yes - from historical Repeat to post-NTX Proceed via addendum |
| Is 45.3 authorised to proceed beyond repeat status? | yes |

### Governance note

This addendum updates current standing without rewriting historical recommendation records.  
Base artefacts remain preserved; recommendation evolution is recorded additively.
