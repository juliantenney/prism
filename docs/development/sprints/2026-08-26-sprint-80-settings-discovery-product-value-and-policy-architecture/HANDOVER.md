# Sprint 80 — Handover

**Kind:** Open discovery-sprint handover
**Sprint status:** **OPEN** (2026-08-27)
**Dashboard:** [STATUS.md](STATUS.md)
**Start here:** [SPRINT-80-START-HERE.md](SPRINT-80-START-HERE.md)

---

## Start here

Sprint 80 is **OPEN** as discovery/planning only.

Current: **operator review of the S80-T-007 plan**, plus answers to **Q1–Q4**. Then authorise slice **S1** and/or **S3**. The T-006 gate is PASSED; T-005B.2 is ACCEPTED.

## T-007 architecture (plan; read [S80-T-007](S80-T-007-adjustments-target-architecture-and-implementation-plan.md))

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

Alpha minimum: **S1+S2+S3+S4** (no canonical contract text touched). **Q1** is the only question gating it.

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
- Fix the two defects T-005B.2 records without a separate authorised task.
- Begin implementation. T-007 is design/planning; slices need explicit authorisation.
- Inject parameters or instructions at `applyWorkflowStepRuntimePromptAugmentations` (`15990`) — superseded, see T-007 §1.1.
- Revive `selectedOptions` / `{{option:}}` (`app.js:5373`, `6104`) to activate assessment parameters — Create-time bake path and legacy plumbing.
- Add an Additional Instruction field to Design Episode Plan — it is a deterministic derive step.
- Ship a learner-level enum in v1 — deferred; Audience is free text (T-007 §9).
- Ship Duration before defect **D1** (hardcoded DLA `~60` / `50–70` timing text) is resolved.
- Merge the two Adjustments mechanisms into a single typed catalogue.
- Revive `[PRISM_STEP_PARAMS]` or the unreachable Studio path as a projection route.
- Infer `learner_level` from audience prose (reintroduces elicitation AI).
- Equate transcript reuse with "all Create fields are parameters."
