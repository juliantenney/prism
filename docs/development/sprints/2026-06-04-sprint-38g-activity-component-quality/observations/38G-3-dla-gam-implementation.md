# Slice 38G-3 — DLA/GAM implementation

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Implementation (pack-only)  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38G-3  
**Inputs:** [38G-1](38G-1-first-glance-workbook-quality-analysis.md), [38G-2](38G-2-activity-component-model.md)  
**Scope enforced:** `domains/learning-design/domain-learning-design-step-patterns.md` §5 and §6 only

---

## 1. Purpose

Implement the 38G-2 Activity Component Model into DLA/GAM prompt contracts so workbook activities become coached instructional episodes rather than brief LO->task shells, while preserving 38E/38F structural obligations.

---

## 2. Files changed

| File | Sections changed | Notes |
|---|---|---|
| `domains/learning-design/domain-learning-design-step-patterns.md` | `## 5. Design Learning Activities`, `## 6. Generate Activity Materials` | Prompt/template and notes updates only |

No other production files were edited for this slice.

---

## 3. Summary of edits

### 3.1 DLA (§5) changes

Updated `Prompt Factory` fields:

1. **`promptTemplate`** expanded with ACM logic:
   - Requires explicit use of existing KM/LO affordances:
     - KM: concepts, definitions, relationships, processes, groupings, misconceptions
     - LOs: concept mappings, cognitive levels, progression, outcome intent
   - Adds component decision obligations:
     - orientation
     - concept elucidation
     - knowledge activation
     - misconception handling
     - worked reasoning
     - guidance
     - practice
     - verification/self-check
     - reflection
     - transition
   - Adds cognitive-level bundles:
     - Understand => orientation + concept elucidation + check
     - Apply => worked example + guided practice + verification
     - Analyse => comparison/classification + reasoning scaffold + verification + transition
     - Evaluate => trade-offs + judgement + justification + reflection + transition
   - Adds learner-friendly wording constraint (no forced component headings).

2. **DLA workbook clause additions:**
   - **DLA-WB-20 (38G-3 ACM trace):** encode activity-component coverage with existing fields/material specs.
   - **DLA-WB-21 (38G-3 ACM trace):** use KM affordances in purpose/specification language; do not rely on LO labels alone.

3. **`defaultPromptNotes`** updated to reinforce coached-episode generation and LO-level component bundles.

### 3.2 GAM (§6) changes

Updated `Prompt Factory` fields:

1. **`defaultPromptNotes`** expanded to require ACM-aligned material realisation based on DLA LO/KM intent.

2. **`promptTemplate`** expanded with:
   - KM/LO-aware realisation requirement (using existing structures only),
   - explicit component-realisation expectation in learner-facing language,
   - prohibition on literal component-heading forcing.

3. **GAM workbook clause addition:**
   - **GAM-WB-21 (38G-3 ACM trace):** where DLA specifies component-oriented intent, realise materials that support all relevant components with learner-friendly rhetoric.

---

## 4. Exact clauses/rows changed

### 4.1 DLA rows added/changed

| Area | Change |
|---|---|
| §5 `promptTemplate` instructions | Added KM/LO affordance exploitation rules and LO-level component bundles |
| §5 DLA-WB block | Added **DLA-WB-20**, **DLA-WB-21** |
| §5 `defaultPromptNotes` | Added ACM summary + anti-LO->task guidance |

### 4.2 GAM rows added/changed

| Area | Change |
|---|---|
| §6 `defaultPromptNotes` | Added ACM-aware material realisation expectation |
| §6 `promptTemplate` instructions | Added component-realisation instruction set using existing affordances |
| §6 GAM-WB block | Added **GAM-WB-21** |

---

## 5. ACM traceability (38G-2 -> pack clauses)

| 38G-2 ACM component | DLA/GAM clause realisation |
|---|---|
| Orientation | DLA prompt bundle + DLA-WB-20 + GAM-WB-21 |
| Concept elucidation | DLA instruction on teach/activate split + GAM text/exposition guidance + GAM-WB-21 |
| Knowledge activation | DLA prompt requiring activation decisions + DLA-WB-20 |
| Misconception handling | DLA misconception requirement + GAM misconception-aware prompts + GAM-WB-21 |
| Worked reasoning | DLA process-based worked reasoning requirement + existing WB-08 + GAM-WB-02/03 + GAM-WB-21 |
| Guidance | DLA executable task guidance requirement + GAM support alignment |
| Practice | Existing DLA-WB-10 + table/scenario rows retained + GAM-WB-04 |
| Verification / self-check | Existing DLA-WB-11 + GAM-WB-05 + new LO-level bundle rules |
| Reflection | Existing DLA-WB-12/13/14 + GAM-WB-06/07/08 + GAM-WB-21 |
| Transition | DLA LO progression + new Analyse/Evaluate bundle transition rule + DLA-WB-20 |

---

## 6. Hold-condition preservation check

All required 38E/38F structural obligations remain intact and were not weakened:

| Hold item | Status |
|---|---|
| scenario requirement (V-05) | **Retained** (`DLA-WB-18`, `GAM-WB-10`) |
| worked_example | **Retained** (`DLA-WB-08`, `GAM-WB-02`) |
| sample_output | **Retained** (`DLA-WB-08`, `GAM-WB-02`) |
| consolidation_summary | **Retained** (`DLA-WB-12`, `GAM-WB-06`) |
| table family / V-01 | **Retained** (`DLA-WB-06a`, `GAM-WB-38F-01`) |
| 38E/38F fail rules and anti-pattern guards | **Retained** (F1–F6, AP rules still present) |

ACM additions are additive to these holds.

---

## 7. Non-target change confirmation

| Area | Changed? |
|---|:---:|
| `app.js` | No |
| Pipeline code/scripts | No |
| Schemas | No |
| Renderer code | No |
| Preservation architecture | No |
| Tests | No (deferred to 38G-4 unless explicitly requested earlier) |

---

## 8. Expected quality shift (implementation intent)

With these clause updates, DLA/GAM are now instructed to transform existing KM/LO information into richer activity episodes.  
This should reduce brief task-shell behaviour and support expansions like the Inflation anchor’s analysis/evaluation stages into coached sequences (teaching -> worked reasoning -> guided task -> self-check -> transition/reflection), without changing material-type preservation obligations.

---

## 9. Completion statement

| Criterion | Met? |
|---|:---:|
| Implement ACM in §5 and §6 only | Yes |
| Keep 38E/38F hold conditions intact | Yes |
| Produce 38G-3 implementation observation | Yes |
| Avoid forbidden code/schema/pipeline/render edits | Yes |

**Slice 38G-3:** **COMPLETE**  
**Next:** 38G-4 — regression and preservation review

