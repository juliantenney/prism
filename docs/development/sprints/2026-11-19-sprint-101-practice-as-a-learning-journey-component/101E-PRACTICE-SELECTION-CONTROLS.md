# Sprint 101E — Option B: Practice Do selection controls

**Status:** Implemented (vertical slice) — **101E not closed**  
**Date:** 2026-11-20  
**Contract:** `101E-PRACTICE-SELECTION-CONTROLS-V1`  
**Out of scope:** C2/C3 overwrite; marking 101E complete; commit/push; in-cell table widgets (Option C); Interactive prompt changes

---

## Objective

Let Practice Do moments commission **selectable** structured judgements (`single_select`, `multi_select`, `matching`) with native accessible controls, determinate Check answer when a key is authored, and retained criterion guided review — without Assessment Pack chrome and without inventing in-cell dropdowns.

---

## What landed

| Layer | Change |
| ----- | ------ |
| **Material** | `selection` material type (aliases preserved); payload via `selection` / normalize path |
| **Normalize / workspace** | `normalize-selection.js`, `build-selection-workspace-model.js`, `render-selection-workspace.js` |
| **Registry** | `single_select` / `multi_select` / `matching` un-stubbed; composition + beats-fallback both render |
| **Beats fallback** | `render-material.js` — `MATERIAL_CLASS_BY_TYPE.selection` + `renderSelectionBody` (was “Unsupported material kind”) |
| **Compose** | `compose-response-parts` `partFromSelectionMaterial`; decision-grid layout in composed moments |
| **Check / draft** | Assessment-runtime determinate check + draft adapters; guided checklist still required for criterion review |
| **Guided checklist** | `diagnostic_review` accepted as alias of `guided_review`; string `look_for` + `if_missing[]` pair into features |
| **Contracts** | Practice DLA/GAM repertoire documents selection materials; Interactive unchanged |
| **Browser** | `npm run build:learner-renderer-vnext-browser` rebuilt + check OK |

---

## Files (primary)

| File | Role |
| ---- | ---- |
| `lib/learner-renderer-vnext/normalize-selection.js` | Semantics + diagnostics for selection payloads |
| `lib/learner-renderer-vnext/build-selection-workspace-model.js` | Workspace model for registry / compose |
| `lib/learner-renderer-vnext/render-selection-workspace.js` | Radios / checkboxes / labelled `<select>`s |
| `lib/learner-renderer-vnext/render-material.js` | Beats-fallback selection body |
| `lib/learner-renderer-vnext/compose-response-parts.js` | Selection response parts |
| `lib/learner-renderer-vnext/parse-guided-checklist.js` | `diagnostic_review` + string look_for |
| `lib/ld-practice-presentation-contracts.js` | Contract version + repertoire |
| `app.js` | Practice selection presentation CSS (as needed) |
| `lib/learner-renderer-vnext-browser.js` | Regenerated bundle |
| `tests/s101e-practice-selection-controls.test.js` | Vertical-slice suite |

---

## Acceptance (fixture / unit)

Generated Practice learner HTML for the Option B fixture:

1. Renders radios / checkboxes / matching selects with fieldset/legend or labelled controls  
2. Supports determinate Check your work when a correct key is present  
3. Emits guided-review shell (`data-guided-review="true"`) for diagnostic checklist  
4. Serializes / restores drafts  
5. Practice contracts mention selection; Interactive DLA does not carry `101E-PRACTICE-SELECTION-CONTROLS`

---

## Tests

| Suite | Result |
| ----- | ------ |
| `tests/s101e-practice-selection-controls.test.js` | **6/6 pass** |
| `tests/s101e-practice-discipline-first.test.js` | **4/4 pass** |
| `tests/s101e-practice-progressive-interaction.test.js` | **4/4 pass** |
| `tests/s101-practice-render-and-package.test.js` | pass |
| `tests/learner-renderer-vnext-compose-full-page.test.js` | pass |
| `tests/learner-renderer-vnext-browser-registration.test.js` | pass |
| `tests/learner-renderer-vnext-guided-review.test.js` | **10/10 pass** |
| `tests/s93-assessment-pack-learner-render.test.js` + persistence | **30/30 pass** (Assessment Pack isolation) |

---

## Manual verification (new Practice commission — do not overwrite C2/C3)

1. Commission a **new** Practice activity (or regenerate DLA/GAM on a disposable workflow) that includes `type: "selection"` materials (`single_select` / `multi_select` / `matching`) plus a checklist with `mode: "diagnostic_review"` (or `guided_review`) and a short math/text field.  
2. Open the learner page preview/export.  
3. Confirm radios/checkboxes/selects are usable by keyboard; labels associate correctly.  
4. Choose answers → **Check** → see feedback without losing guided-review criteria.  
5. Revise selections → refresh → drafts restore.  
6. Confirm Interactive / Assessment Pack pages still render their own selection chrome unchanged.

---

## Explicit non-claims

- IndexedDB C1 persistence blocker remains **OPEN** pending browser verify.  
- 101E is **not** complete.  
- Existing C2/C3 pages are unchanged until deliberately regenerated.  
- No commit/push in this pass.

---

## Related

- Plan origin: [101E-DISCIPLINE-FIRST-INTERACTIONS.md](101E-DISCIPLINE-FIRST-INTERACTIONS.md) §8  
- Progressive repertoire: [101E-PROGRESSIVE-INTERACTION-DESIGN.md](101E-PROGRESSIVE-INTERACTION-DESIGN.md)
