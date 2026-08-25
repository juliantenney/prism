# S78-T-048 — Harden resource-level image visual consistency

**Task:** S78-T-048  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-25)  
**Mode:** Implementation (presentation / prompt assembly only)  
**Sprint 78:** OPEN · **T-013:** remains OPEN  

**Upstream:** [S78-T-046](S78-T-046-resource-level-image-consistency-diagnostic.md)  
**Separated:** [S78-T-047](S78-T-047-harden-image-instructional-fidelity-synthesis.md) instructional fidelity — **unchanged in intent**  

---

## 1. Root-cause / T-046 confirmation

No page/resource visual-style SSOT existed. Jobs already shared pedagogical constants and representation structure; **artistic family** (realism, palette, chrome, perspective) was model-discretionary → Hydrology drift (3D landscapes vs flat schematics vs mixed synthesis). Soft strength to harden — not a major defect.

---

## 2. House-style constant / block

New module: `lib/prism-house-visual-language.js` (`PRISM_HOUSE_VISUAL_LANGUAGE`).

Heading: **`Resource visual language:`**

Frozen lines (domain-generic): university-level educational illustration; explanatory not promotional; schematic default; spatial/landscape only when representation needs geography; restrained palette; consistent annotation/arrow/callout character; uncluttered backgrounds; same visual family; do not force identical compositions across representations.

No RGB tokens, no named commercial styles, no font dependencies, no sibling-image references.

---

## 3. Live human-prompt injection

`buildVisualJobHumanPrompt` (`lib/utilities-visual-jobs-workspace.js`) inserts the section after **Preferred visual output** and before **Representation**.

---

## 4. Deterministic

Same frozen array → byte-identical `formatResourceVisualLanguageSection()` for every job/page. Verified across multi-affordance Roman roads jobs.

---

## 5. No instructional claims

Style block excludes subject/`must_show`/claims/evidence/Concept boundary. Helper `resourceVisualLanguageLooksInstructional` + regressions guard this.

---

## 6. Representation structure unchanged

`HUMAN_REPRESENTATION_GUIDANCE` / Visual structure Prefer/Avoid untouched. Annotated System / Causal Model / Causal Chain / Concept Map retain distinct structure text.

---

## 7. T-047 fidelity unchanged

Synthesis still has Concept / claim boundary + Authorised source evidence + AUTHORISED integration wording. Activity Concept boundary intact. T-047 tests still pass.

---

## 8. Before / after prompt structure (human)

**Before:** … Preferred visual output → Representation → Subject → …  

**After:** … Preferred visual output → **Resource visual language** → Representation → Subject → Concept boundary → Authorised evidence → Visual structure → Show → …

Canonical `generation_instruction` mirrors the **same** lines as section **12. Resource visual language** (learner-facing copy renumbered to 13).

---

## 9–12. Regressions

Covered in `tests/s78-t-048-resource-visual-consistency-hardening.test.js` (+ Slice 5 section-order update; T-047 suite still green).

---

## 13. Parallel generation

Jobs remain independent. Style is textual policy only — no reference images, no chaining, no serialisation.

---

## 14. Tests / results

```text
node --test tests/s78-t-048-resource-visual-consistency-hardening.test.js \
  tests/s78-t-047-image-instructional-fidelity-hardening.test.js \
  tests/sprint-70-slice-5-image-brief-compiler.test.js \
  tests/sprint-70-slice-6-utilities-visual-jobs-workspace.test.js \
  tests/sprint-70-slice-7-visual-jobs-human-prompt.test.js \
  tests/sprint-70-slice-7a-human-prompt-quality.test.js \
  tests/sprint-70-slice-7b-activity-vs-synthesis-prompt.test.js
```

**Result:** all **pass** (113 in combined run).

Browser: `index.html` loads `prism-house-visual-language.js` before compiler/workspace; cache-bust `?v=20260825-t048`.

---

## 15. Files changed

| File | Change |
| ---- | ------ |
| `lib/prism-house-visual-language.js` | **New** SSOT |
| `lib/utilities-visual-jobs-workspace.js` | Inject + diagnostics + exports |
| `lib/prism-image-brief-compiler.js` | Canonical §12 from same module |
| `index.html` | Script include + cache bust |
| `tests/prism-vm-lib-bootstrap.js` | Load house module |
| `tests/s78-t-048-resource-visual-consistency-hardening.test.js` | **New** |
| `tests/sprint-70-slice-5-image-brief-compiler.test.js` | Section 12/13 |
| Sprint nav | STATUS, HANDOVER, PLAN, START-HERE, next-chat-briefing |

**Schema:** unchanged.

---

## 16. Regeneration required

| Artefact | Action |
| -------- | ------ |
| Existing page / DLA / GAM / DP | **No regen required** |
| Graphics human prompts | **Re-copy** to pick up house-style block |
| Images | **Regenerate/reassociate** to realise visual-family benefit |
| Future parallel jobs | Automatically receive house style |

---

## 17. Deviations / risks

- Soft model non-compliance still possible; this hardens prompts, not pixels.  
- Operator smoke check (not automated): figures should cohere as one family while layouts may differ by representation.  
- Over-strong “schematic default” could under-use legitimate landscape for annotated systems — mitigated by explicit exception when representation benefits from spatial geography.

---

## 18. Sprint state

**Sprint 78:** OPEN  
**T-013:** OPEN  
**T-046:** diagnostic complete  
**T-047:** implementation complete  
**T-048:** implementation complete  
**Learner-workspace/interactivity:** PARKED  

---

## Manual operator smoke check (future)

When generating several images independently for one resource:

- figures should read as one visual family;  
- label / annotation / arrow / palette character should broadly cohere;  
- representation layouts may still differ substantially;  
- spatial figures may be richer than abstract causal diagrams;  
- no reference image required.
