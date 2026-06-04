# PR-W2b-1 — DLA pack authority trim

**Date:** 2026-06-04  
**Change class:** CC-CONTRACT (pack §5 only)  
**Charter:** [38B-W2B](38B-W2B-DLA-authority-review.md) §9  
**File:** `domains/learning-design/domain-learning-design-step-patterns.md` §5 Design Learning Activities

---

## 1. Summary

Pack §5 `promptTemplate` and `defaultPromptNotes` now **delegate** table spec, materials boundary, maths, and self-directed rhetoric to canonical runtime modules. **DLA ownership** is explicit: specify `required_materials` types and specifications; **GAM** authors full material bodies.

**No changes** to `app.js`, `lib/ld-*`, tests (behaviour), renderer, Sprint 38 schema, or VEU.

---

## 2. What changed

### 2.1 Removed or replaced (duplicates)

| Former pack content | Replaced with |
|---------------------|---------------|
| Standalone TeX delimiter paragraph in template | `LD-MATH-RENDER` / Math notation output contract ref in canonical contracts line (test anchor phrases retained) |
| `defaultPromptNotes` worked/faded/transfer sequencing | `LD-SELF-DIRECTED-RHETORIC` at runtime |
| Misconception / closure / study_tips / transfer bullets in notes | `LD-SELF-DIRECTED-RHETORIC` at runtime |
| Duplicate “do not generate full material” bullets | Single line + `LD-MATERIALS-COPY` ref |
| TeX block at end of notes | `LD-MATH-RENDER` ref (anchors in template) |
| Generic `type` list without table types | Extended enum: `classification_table`, `comparison_table`, `analysis_table`, `impact_table` |

### 2.2 Preserved (DLA-specific)

- Activity structure JSON schema (`activity_id`, `learner_task`, `expected_output`, grouping, duration)
- `required_materials` specification-only discipline
- Facilitator_moves / failure_mode gating for self_directed
- `activity_preamble` + cognition-orientation field keys in output
- Chronological ordering **spec** (mixed event lists; interpretation vs re-ordering)
- Page-focused self-directed task defaults; classroom orchestration avoidance
- Learner markdown subset on activity fields
- User options (pattern mix, grouping, difficulty, coverage)

### 2.3 Authority line (normative)

In template canonical contracts:

> LD-MATERIALS-COPY (specify types/requirements only; GAM authors material bodies)

In notes:

> DLA specifies material types and requirements; GAM authors material bodies (LD-MATERIALS-COPY)

Table spec:

> LD-TABLE-FIDELITY (spec role — table types → pipe tables in GAM, not descriptions only)

---

## 3. Probe impact (self-directed DLA)

Command: `node scripts/probe-38b1-ld-workflow-prompt-audit.js`

| Metric | Pre PR-W2b-1 (W1 exit) | Post PR-W2b-1 | Δ |
|--------|------------------------:|--------------:|--:|
| `packTemplateChars` | **3,805** | **4,058** | **+253** (canonical contracts line) |
| `packNotesChars` | **2,703** | **934** | **−1,769** |
| Pack template + notes (raw) | **6,508** | **4,992** | **−1,516** |
| `seededChars` | **3,470** | **3,723** | **+253** |
| `augmentedChars` | **18,054** | **18,307** | **+253** |
| Runtime `blockCount` | 5 | 5 | 0 |
| Markers | unchanged | unchanged | — |

**Interpretation:** Pack **duplication reduced** (−1,769 in notes). **Augmented** prompt rose **+253** because the template gained a canonical contracts block (authority investment); runtime blocks unchanged — same outcome class as early GAM trim before final pack tighten. **PR-W2b-2** (wire `LD-TABLE-FIDELITY` spec role at runtime) does not require further pack growth.

Four-step sum (DLA + GAM + Assessment + Design Page): **72,314** → **72,567** (**+253**; DLA pack-only delta).

---

## 4. Validation

| Check | Result |
|-------|--------|
| `node --test tests/*.test.js` | **722/722** pass |
| `node --test tests/mathjax-producer-prompt-contract.test.js` | **12/12** pass |
| Runtime behaviour | Unchanged (pack seed only) |
| B4 programme | **MONITORING** — no live output in this PR |
| mathjax DLA section anchors | Retained in template: `Math notation output contract`, `renderer-supported TeX delimiters`, `$...$`, `$$...$$`, `code spans/fences for equations` |

---

## 5. Authority boundaries (post-trim)

| Layer | Owner |
|-------|--------|
| L0/L3 activity structure | **DLA pack** |
| L4 `required_materials` **spec** | **DLA pack** + ref **`LD-TABLE-FIDELITY` (spec)** — runtime wire in PR-W2b-2 |
| L4 material **bodies** | **GAM** + `LD-MATERIALS-COPY` (author) |
| L5 cognition fields on activities | **DLA pack** + runtime OUTPUT CONTRACT / PEL / rhetoric |
| L7 maths in activity fields | **`LD-MATH-RENDER`** |
| L5/L7 rhetoric scaffolding | **`LD-SELF-DIRECTED-RHETORIC`** |

---

## 6. Next steps

| PR | Scope |
|----|--------|
| **PR-W2b-2** | `applyLdTableFidelityContractToDraft` — append `{ role: "dla" }` for self-directed DLA |
| **PR-W2b-3** (optional) | Merge OUTPUT CONTRACT + material-shape + activity framing runtime blocks |
| **Wave 3** | Design Page preserve contract |

---

## 7. Governance

Recorded under [38B-7](38B-7-governance-and-maintenance.md) CC-PROMPT — pack §5 edit by DLA step owner; table spec refs reviewed by materials fidelity owner.
