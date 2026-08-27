# Sprint 80 — Handover

**Kind:** Open discovery-sprint handover
**Sprint status:** **OPEN** (2026-08-27)
**Dashboard:** [STATUS.md](STATUS.md)
**Start here:** [SPRINT-80-START-HERE.md](SPRINT-80-START-HERE.md)

---

## Start here

Sprint 80 is **OPEN**. Discovery is finished; the T-006 gate is PASSED, T-005B.2 is ACCEPTED, and the T-007 plan is ACCEPTED. Seven authorised implementation slices are now complete, and the Adjustments architecture is proven end to end across four governed parameters.

Current: **operator review of [S80-S7](S80-S7-audience-governed-workflow-parameter.md)** (and S5/S6, still awaiting review), then authorisation of the next slice.

## Implementation state (2026-08-27)

| Slice | Status | Live model-visible behaviour? |
| ----- | ------ | ---------------------------- |
| **S1** — parameter registry + `workflow.adjustments` persistence | **COMPLETE — ACCEPTED** | **No** on its own. Contract, resolver and persistence only. |
| **S3** — per-step Additional Instruction | **COMPLETE — ACCEPTED** | **Yes.** Author steering is model-visible on the step it belongs to. Byte-identical when unset. |
| **S2** — Topic vertical proof | **COMPLETE — ACCEPTED** | **Yes.** Topic is projected into all 8 model-driven steps and overridable per run without regenerating the workflow. |
| **S4** — Adjustments UI repurpose | **COMPLETE** | **Yes, narrowly.** The panel change alters no prompt. Two authorised model-visible changes only: Episode Plan now consumes an Additional Instruction, and step 1 omits the commissioned `Goal:` when Topic is explicitly adjusted. |
| **S5** — Goal authority repair + Goal Adjustment | **COMPLETE** — awaiting review | **Yes.** Goal is a governed `multiline` parameter projected as subordinate intent prose; `#workflowGoal` retired to read-only. D4/D5/D6 fixed. |
| **S6** — Duration parameter + D1 timing repair | **COMPLETE** — awaiting review | **Yes.** Duration is a governed `number` parameter; canonical DLA timing is derived rather than hardcoded. D1 fixed; byte-identical at the 60-minute default. |
| **S7** — Audience governed workflow parameter | **COMPLETE** — awaiting review | **Yes.** Audience is a governed single-line `text` parameter in the authoritative block; the mutable `#workflowAudience` authority and the step-1 `Audience:` line are retired; `page.audience` reads the effective value. D13/D16 fixed. |
| S8–S10 (and Assessment) | NOT STARTED | — |

83 tests added (16 + 20 + 19 + 28), all passing; 155/155 across the focused set including the affected settings-UI suites. S4 was measured against a pre-S4 baseline captured from the working tree before any S4 edit: **zero new failing locations** (55 → 55 across a 93-suite targeted set). A wider 157-suite sweep found exactly one S4-sensitive failure — a `s75-d25` source scan for the deliberately removed step badge — now fixed. Earlier, S1–S3 measured against a pristine `git worktree` at commit `9cf0f1d`: **zero new failing locations** (full suite 3785 / 412 fail → 3840 / **393 fail**; targeted serial set 72 → **55** failing locations). The large absolute count is pre-existing **D-014** instability — identical at HEAD, concentrated in renderer/page suites and demonstrably order dependent. Comparing against a pristine worktree is now the recommended method; whole-suite counts alone are not a usable signal.

What a follow-on slice needs to know:

- The registry is a **deliberate allowlist** declaring `topic`, `goal`, `duration_minutes` and `audience`, and its contents are asserted exactly. Declaring a parameter is still not the same as authorising its projection.
- **Single-line vs `multiline` is a semantic decision, not styling.** Single-line parameters render into the *authoritative workflow parameters* section and structurally outrank prose; `multiline` renders as subordinate intent. Choosing correctly is how S7 got Audience precedence with **zero** new wording.
- **Two of the four parameters retired a legacy step-1 commissioning line outright** (`Goal:` at S5, `Audience:` at S7) rather than using `supersedesCommissionedContextFields`. That mechanism fires only on provenance `adjustment`, so it cannot close a two-authority defect for workflows left on Auto. It remains live and generic, proven against `constraints`.
- Only the **`workflowContext`** projection is implemented. `stepScoped` remains unimplemented and a declaration using it is inert — guarded by an S1 test, so it cannot ship looking live.
- **Adding a `workflowContext` parameter now requires no prompt edits.** Declare it in `ADJUSTMENTS_PARAMETER_DECLARATION_SOURCE` with a `resolveCommissioned` reader and it appears via the shared projector. This is asserted by test, not assumed.
- `resolveEffectiveRunContext(wf)` reports provenance (`adjustment` / `commissioned` / `absent` / `not_applicable`) and needs no extending.
- `requiresCapability` fails closed until S7 registers a resolver, so assessment parameters cannot leak early.
- Eligibility is **two predicates** since S4: `isWorkflowStepEligibleForAdditionalInstruction` (steering; every step, EP included; extension point `NON_STEERABLE_CANONICAL_STEP_IDS`, currently empty) and `isWorkflowStepEligibleForWorkflowContextProjection` (typed-parameter projection; excludes derived-shell steps, i.e. EP). Do not recombine them.
- Two instruction fields exist by design and **both are supported**: "Instructions" (`step.notes`, general-purpose, especially for hand-rolled workflows) and "Additional instruction" (`step.additional_instruction`, steers a PRISM stage through the shared subordinate block). S4 reconciled the UX; do **not** merge or migrate them.
- **Stale first-step `Goal:` prose is fixed (S4).** `buildWorkflowRuntimeContextText` omits a commissioned field when its typed parameter's provenance is `adjustment`, declared via `supersedesCommissionedContextFields` on the parameter. Topic declares `["goal"]`. Nothing changes while Topic is on Auto.
- Save-path normalization remains inconsistent with load-path normalization (`handleSaveWorkflow` does not call `normalizeWorkflowForV1`). S1 works around it in gather; it is recorded debt, not fixed.

## T-007 architecture (ACCEPTED; read [S80-T-007](S80-T-007-adjustments-target-architecture-and-implementation-plan.md))

```
wf.adjustments.parameters + step.additional_instruction
  → resolveEffectiveRunContext(wf)     [deterministic, no AI]
  → 3 projections (workflowContext | stepScoped | additionalInstruction)
  → 2 ingress points  →  clipboard  →  external Copilot  →  existing validators
```

Three findings that make this cheap, all verified directly:

1. **No model call at Run.** Every `api.openai.com` request is design-time; Run copies prompt text to the clipboard (`app.js:32063`). The no-API-key requirement is already satisfied structurally.
2. **Per-step author text already reaches the model** — `step.notes` minus the param block, injected at `app.js:33786–33793`, with a textarea already at `32442`. Additional Instruction is mostly separation and precedence framing.
3. **Topic is not baked** into any `override_prompt_body` (verified empirically), so it is genuinely late-bindable.

**T-007 §1.1 corrects T-006 §17C.** The chokepoint is `buildWorkflowStepInstructions` (`33394`) + `buildLiveGamV2CopyPromptViaCanonicalAssembler` (`33293`) — **not** `applyWorkflowStepRuntimePromptAugmentations` (`15990`), which gets an empty option map (`31443`), exposes only ~10 fixed fields (`15919`), is bypassed by DA/GAI/LS (`33810–33819`) and is never reached by GAM (`33424`).

Alpha minimum **S1+S2+S3+S4 is now implemented** (no canonical contract text touched). **Q1** is the only question gating it.

## T-006 decision (authoritative)

Settings is **superseded**. Option **C** adopted: **Adjustments**, with two deliberately separate mechanisms —

1. **Workflow parameters** — a small allowlisted set of typed values making an existing workflow reusable. Each requires type, valid values, one owning interpretation point, deterministic runtime semantics and a declared projection. v1 candidates: **Topic**, **Duration** (blocked on defect D1), **Audience/level** (needs canonical vocabulary), **assessment parameters** (conditional, pending capability investigation).
2. **Per-step additional instruction** — an optional natural-language author instruction on every model-driven step, composing with (never replacing) the canonical prompt.

Hard rules: no new AI interpretation call; structured parameters editable without model capability; instructions may not override schemas, validators, typed parameters, upstream artefacts, topology/capability or canonical requirements; parameters may not change topology; extensibility must be `declare → type → owning interpretation point → runtime projection`.

Record: [S80-T-006](S80-T-006-operator-product-architecture-decision-gate.md). Decision log entry: **S80-D06**.

## Key T-005B.2 takeaway

Of **44** resolved brief keys, only **25** have a proven current effect, **17** have none, and only **6** produce model-visible text. The Create-time bake reads no brief factor at all (`app.js:5373` hardcodes an empty option list and strips the param block), and `[PRISM_STEP_PARAMS]` has **no reachable route to any model** — the only caller of the builder that would emit it sits behind a provably unreachable guard (`app.js:27107` vs `27126`). Brief factors earn their keep through **topology** (17 keys, much of it test-backed) and a small **runtime scaffold** route reading frozen `resolvedFactors` directly. An Adjustments surface cannot be built on existing plumbing.

T-005B.2 also corrected T-005B.1 in four places and recorded two probable defects (canonical-DLA cognition bypass; hardcoded DLA duration literals) **without fixing them**.

## Key T-005B.1 takeaway

The resolved brief model is **42 keys**, not the 28 the pack declares: 8 undeclared passthrough keys and 5 conditionally code-merged cognition factors exist only in `app.js`, plus one `topic` alias. `resolvedSources` cannot distinguish pack defaults from derived consequences, nor author choice from product-kind implication. `topic` is the only strong parameter candidate with no enum conflict, no topology gate and no dependent factors.
S80-T-001 … S80-T-004 are **COMPLETE — ACCEPTED**.

## Key T-005B takeaway

For Topic / Duration / Audience the blocker is **not** value ambiguity — all three are already deterministic after Create resolution, and **no AI is needed to understand a new value**. The blocker is that **none of them reaches a Run prompt today**: the Create bake carries no goal/audience/duration (`selectedOptions = []`, `app.js:5373`), the one projector is gated off for LD steps (`app.js:34369–34384`), and step params are stripped before Copy (`app.js:33786`).

**Feasibility:** Topic **B**, Duration **B**, Audience **B** (needs a typed level companion — free text cannot imply `learner_level`). Source description = **commissioning-only metadata**.

**Watch the two hardcoded literals** that would silently contradict any parameter: DLA `~60` / `50–70` (`lib/ld-dla-page-enrich-contract.js:493,495`) and the page-shell audience constant `"Learners"` (`app.js:11638`).

## Do not

- Treat the T-005B v1 surface as approved design — T-006 §8 supersedes it.
- Treat the T-005B.1 parameterisation-relevance column as a chosen parameter set — it is evidence only.
- Treat the T-005B.2 "candidate for Adjustments" column as a chosen surface — T-006 §8 supersedes it.
- Fix defects **D1**, **D2** or **D3** without a separate authorised task — all three remain recorded, not fixed.
- Begin any slice beyond S1/S3 without explicit authorisation. **S1 and S3 are done; S2 and S4–S10 are not.**
- Declare a registry parameter live without also implementing its projection and tests — that recreates the persisted-but-inert failure Sprint 80 exists to end.
- Refresh a prompt golden to absorb a diff. S3 preserved byte identity instead; the two structural regressions found were fixed in production code, leaving the guard tests unmodified.
- Inject parameters or instructions at `applyWorkflowStepRuntimePromptAugmentations` (`15990`) — superseded, see T-007 §1.1.
- Revive `selectedOptions` / `{{option:}}` (`app.js:5373`, `6104`) to activate assessment parameters — Create-time bake path and legacy plumbing.
- Add an Additional Instruction field to Design Episode Plan — it is a deterministic derive step.
- Ship a learner-level enum in v1 — deferred; Audience is free text (T-007 §9).
- Ship Duration before defect **D1** (hardcoded DLA `~60` / `50–70` timing text) is resolved.
- Merge the two Adjustments mechanisms into a single typed catalogue.
- Revive `[PRISM_STEP_PARAMS]` or the unreachable Studio path as a projection route.
- Infer `learner_level` from audience prose (reintroduces elicitation AI).
- Equate transcript reuse with "all Create fields are parameters."
