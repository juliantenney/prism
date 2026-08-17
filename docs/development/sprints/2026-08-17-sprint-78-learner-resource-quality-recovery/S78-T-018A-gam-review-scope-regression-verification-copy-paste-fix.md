# S78-T-018A — GAM review scope regression + verification copy/paste fix

**Task:** S78-T-018A  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-17)  
**Mode:** Bounded T-018 corrective fix  
**Depends on:** [S78-T-018](S78-T-018-operational-suitability-review-ux-workflow-integration.md)  
**Does not include:** Semantic-review redesign · JS semantic judgement · DLA/GAM authoring contract changes · Lagrangian regeneration · T-013 execution · T-003

Sprint 78 remains **OPEN**. T-013 remains **OPEN**. T-017/T-017A/T-018 architecture is retained.

---

## 1. Proven cause of the DLA leak

T-018 added a GAM verification view-model (`resolveGamMaterialsVerificationView`) and wired it into:

- completion-status formatting (`updateRunStepOutputStatus`);
- Next enablement (`gamMaterialsVerificationBlocksAdvance` → capture gates);
- verification-panel visibility (`refreshGamSuitabilityReviewUi`);
- review textarea / Check / Copy actions.

That view **did not check the current workflow step kind**.

Live Step 5 (Design Learning Activities) after a valid DLA paste therefore:

1. treated the captured **page** JSON as `gamPage` (generic page-artefact parse);
2. collected T-015 obligations from that DLA (obligations exist at Step 5);
3. saw no GAM structural error on the DLA step (`gamStructurallyOk`);
4. classified the step as **`gam_valid_review_required`**.

So the leak was a **combination**:

- generic page artefact detection;
- DLA obligations available at Step 5;
- **insufficient step-kind gating** (primary);
- completion formatter, Next gating, and UI all using the same ungated view.

It was **not** merely a wrong label. GAM pack validation already gated on `isWorkflowStepGenerateActivityMaterials`; the T-018 **completion/Next/UI view did not**.

---

## 2. Scope invariant

Operational-suitability verification exists **only** when the current workflow step is Generate Activity Materials.

Identity uses the existing canonical helper `isWorkflowStepGenerateActivityMaterials` via one run-mode predicate:

`isGamMaterialGenerationStep(stepId)`

That looks up the selected workflow step row by id and recognises:

- `canonical_step_id === step_generate_activity_materials`
- title “Generate Activity Materials”

It does **not** infer GAM from:

- page artefact shape;
- `required_materials`;
- T-015 obligation presence;
- DLA commission fields;
- step index.

Non-GAM steps return phase `not_gam`: `applies: false`, no verification UI, Next not blocked by review.

---

## 3. DLA behaviour restored

Valid DLA paste → DLA validation PASS → **Step complete** → Next enabled. No verification heading, copy/paste/check, or passed/failed copy.

---

## 4. GAM behaviour preserved

T-018 sub-state model unchanged on the actual GAM step (zero-obligation complete; obligations pending until Check; PASS/FAIL/stale/malformed fail-closed).

---

## 5. Verification prompt output contract

The Copilot review prompt now ends with a salient **RETURN FORMAT — REQUIRED** block:

- exactly one complete JSON artefact;
- inside exactly one fenced `json` code block;
- no prose before or after the fence;
- copy `gam_fingerprint` unchanged.

Parser still accepts raw JSON **and** a fenced block (including a fence not occupying the entire paste), so copy/paste is easier without adding semantic logic.

---

## 6. Files changed

**Production**

- `app.js` — `isGamMaterialGenerationStep`; gate view / Next / UI / submit / copy; GAM-only verification panel mount
- `lib/gam-operational-suitability-review.js` — fenced return-format + parser extract
- `index.html` — cache-bust `s78-t018a-gam-scope` / `s78-ops-2b`

**Tests**

- `tests/s78-gam-verification-ux.test.js` — DLA scope regression + GAM preserved
- `tests/s78-gam-operational-suitability-review.test.js` — fenced prompt + parse/gate

**Documentation**

- this record; STATUS / PLAN / START-HERE / T-018 / T-013 pointers

DLA contracts, GAM authoring, schemas, assembly, renderer: **unchanged**.

---

## 7. Tests

T-018A DLA leak + GAM preserved + fenced prompt/parse, plus T-017/T-017A, T-015, T-012, T-011, WS1, P01/P02/P03, step-complete status: **145/145 PASS**.

---

## 8. Exact next action

**Resume S78-T-013** on the same from-top run (do not regenerate for this task):

```text
EP → DLA (Step complete / Next) → GAM → Verify generated materials → assembly → QA
```

Do not start T-003.
