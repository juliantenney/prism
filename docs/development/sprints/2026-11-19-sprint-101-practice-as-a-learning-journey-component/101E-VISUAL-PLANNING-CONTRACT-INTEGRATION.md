# Sprint 101E — Practice visual-planning contract integration

**Status:** Corrected (not closed) — ready to regenerate Design Page on saved C2  
**Date:** 2026-11-19  
**Do not mark 101E complete** until live C2 Design Page re-capture validates and Graphics is clean.

---

## Defect

Live Practice component **Formulate and Solve Multiplier Equations** (Lagrange Multipliers LJ):

1. Design Page paste initially failed validation on `visual_affordances[]`.
2. After reaching Authoring, Graphics still reported `VPC_AFFORDANCE_ROW_INVALID`.
3. Authoring showed **Graphics (1)** while the visual-planning contract remained invalid — easy to mistake for a successful graphics plan.

Observed row failures (unchanged from prior diagnosis): missing `affordance_id`; incomplete `generate` metadata; `defer`/`reject` carrying generate-only fields; bad `defer_reason`/`skip_reason`; invented slot `materials-after-feedback`.

---

## Root cause (multi-layer)

Not exclusively a prompt wording problem.

| Layer | Cause |
| ----- | ----- |
| **Prompt route** | Practice `promptRoute: "practice"` early-returned without injecting the shared Sprint 38 visual-affordance authoring contract (Interactive still received it). Practice contracts alone were too thin. *(Addressed in the prior 101E VA prompt fix; retained here.)* |
| **Copy instructions** | Practice fell through the Interactive `pageEnrichmentV2` Design Page copy path, forcing mandatory `editorial_opening_image` **generate** and Interactive furniture language that conflicted with Practice optional opening / no mandatory KS. |
| **Editorial classification** | `isInteractivePage()` treated any page with activities + `design_page` enrichment as Interactive — so Practice pages commissioned Interactive-style editorial openings. |
| **Graphics UX** | When VPC was invalid, planner correctly emitted **zero** jobs, but the workspace still appended an editorial opening brief → **Graphics (1)** beside `VPC_AFFORDANCE_ROW_INVALID`, looking like success. |
| **Saved C2 artefact** | Current stored Design Page / assembled page still carries the invalid affordance rows generated before the fix. Code changes do not rewrite that JSON. |

Validation was correct and fail-closed. Invalid plans must not be accepted by inventing slots or weakening VPC.

---

## Correction (narrow)

| File | Change |
| ---- | ------ |
| `app.js` | Practice Design Page still gets Sprint 38 VA injection without Interactive partial/KS stack. Practice-specific Design Page **Copy** instructions (optional editorial; mandatory Sprint 38 row shape; no Interactive KS). Graphics tab count uses `countAuthoringGraphicsJobs` (0 when VPC invalid). |
| `lib/ld-practice-presentation-contracts.js` | Point at Sprint 38; allowed slots; forbid invented slots; shape snippet includes `visual_affordance_schema_version` / empty AVR / empty VA. |
| `lib/expository-editorial-opening.js` | Recognise Practice (`product_id` / `page_kind`); do not classify as Interactive; optional editorial (explicit generate only). |
| `lib/utilities-visual-jobs-workspace.js` | Withhold all briefs (including editorial) when authoritative planning is present but VPC invalid; Graphics count 0; clear “jobs withheld” message. |
| `tests/prism-vm-lib-bootstrap.js` | Copy `PRISM_LD_PRACTICE_PRESENTATION_CONTRACTS` onto VM window (browser parity). |
| `index.html` | Cache pins for Practice/editorial/workspace/`app.js`. |
| `tests/s101e-practice-dp-visual-affordances.test.js` | Prompt, generate/defer/skip, slots, anti-spoiler, capture fail-closed, Graphics withhold, Interactive non-regression. |

Preserved: `promptRoute: "practice"`, `pageKind: "practice"`, shared Sprint 38 / VPC schema, purposeful math/conceptual imagery, anti-spoiler controls. No Interactive mandatory knowledge summary. No new visual slots. No silent acceptance of invalid rows. Lagrange exemplar untouched. **No commit/push.**

---

## Graphics (1) explained

**Graphics (N)** = length of `compilerResult.briefs` (Authoring graphics jobs).

On the broken C2 page, VPC failed on `visual_affordances[]`, so the planner produced **no** activity/page jobs. The single counted job was almost certainly the **editorial opening image** (Practice misclassified as Interactive + Copy forcing generate), not a valid Sprint 38 graphic.

After this fix: invalid VPC ⇒ briefs withheld ⇒ **Graphics (0)** with an explicit “jobs withheld until visual planning is valid” message. Editorial opening alone is no longer mistaken for a successful plan.

---

## Can existing C2 be repaired without rebuilding the LJ?

**Yes — regenerate / replace Design Page only** on the existing Practice workflow.

1. Hard-refresh PRISM so cache pins load (`app.js?v=20261119-s101e-practice-vpc`, Practice contracts, editorial opening, visual jobs workspace).
2. Open the existing Practice workflow (do **not** rebuild the Learning Journey or re-run DLA/GAM unless those stages are independently wrong).
3. Copy Design Page instructions — confirm they include:
   - `LD-PRACTICE-PRESENTATION-CONTRACTS (auto-applied)`
   - `Sprint 38 visual affordance authoring contract (auto-applied):`
   - Practice Copy notes (optional editorial; no mandatory KS)
4. Re-author Design Page JSON with schema-valid `visual_affordances` (or `[]` if none warranted). Prefer empty `[]` over invented slots.
5. Capture Design Page again (capture gate uses `validateVisualPlanningCaptureShape` — invalid rows must fail here, not at Graphics).
6. Re-assemble / open Authoring → Graphics: VPC should be valid; jobs appear only for valid generate rows (+ optional editorial if explicitly generated).

Do **not** automatically overwrite the current C2 output; operator regenerates DP deliberately.

---

## Tests run

| Suite | Result |
| ----- | ------ |
| `tests/s101e-practice-dp-visual-affordances.test.js` | **9/9 pass** |
| `tests/s101-practice-product-identity-and-intake.test.js` | pass |
| `tests/s101-practice-render-and-package.test.js` | pass |
| `tests/sprint-38-visual-affordances.test.js` | pass |
| `tests/sprint-70-slice-6a-learner-stage-and-error-dedupe.test.js` | pass |

Note: `tests/s96-interactive-editorial-opening.test.js` has one pre-existing figcaption assertion (`title then opening image then Overview`) that expects a visible figcaption on decorative Interactive openings; Interactive editorial commissioning and other s96 checks still pass. Not part of this Practice VPC fix.

---

## Remaining / before calling 101E done

- Operator must **re-capture Design Page** on the live C2 workflow and confirm Graphics has no `VPC_AFFORDANCE_ROW_INVALID`.
- Prompt sufficiency still does not guarantee model compliance; capture must keep failing invalid rows.
- Shared Sprint 38 prompt still says new slots may be introduced “when genuinely required”; Practice contracts forbid inventing outside the controlled list — consider tightening shared wording in a later sprint if models keep inventing slots.
