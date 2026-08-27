# Prism Architectural Debt

**Status:** Programme-level Governance artefact  
**Purpose:** Track unresolved architectural questions, temporary mechanisms, accepted debt, deferred work and retired directions whose rationale must remain visible.

---

# A. Active / pre-Alpha debt

## D-001 — Episode Plan → DLA lineage status

**Priority:** High  
**State:** Requires bounded repository verification  
**Milestone relevance:** Alpha

Historical Sprint 38S implemented explicit beat → DLA obligation traceability and anti-collapse rules.

Current status must be established for:

- `instructional_function`;
- `plan_beat_index`;
- `_learner_task_segments[]`;
- `_population_trace[]`;
- `episode_plan_ref`;
- `buildBeatTraceMatrix(...)`;
- population rules;
- anti-collapse rules.

For each mechanism classify:

```text
CURRENT
RELOCATED
SUPERSEDED
REMOVED DELIBERATELY
REGRESSED
UNKNOWN
```

Then identify what current mechanism, if any, preserves the same guarantee.

**Do not assume regression until repository evidence establishes it.**

---

## D-002 — Episode Plan selection adequacy

**Priority:** High  
**State:** Open generation/quality question  
**Milestone relevance:** Alpha

Recent runs show materially different Episode Plan richness.

Need to distinguish:

- legitimate pedagogical discrimination;
- underplanning;
- generation variability;
- weak planning contract.

Do not introduce minimum beat counts.

Assess whether the selected journey is appropriate to the learning outcome and activity.

---

## D-003 — Whole-resource conformance and lineage validation

**Priority:** High  
**State:** Required design/implementation work  
**Milestone relevance:** Alpha blocker candidate

Need deterministic evidence that required instructional obligations:

1. were selected/commissioned;
2. were emitted by the owning stage;
3. retained correct identity/binding;
4. survived capture/assembly;
5. reached the final learner resource;
6. manifest the intended function where deterministically testable.

Validation must be conditional and function-based, not maximalist component counting.

It should be capable of detecting, where evidence permits:

- missing obligations;
- wrong identity/binding;
- wrong order;
- collapsed functions;
- lost learner workspaces;
- missing evidence providers;
- model/practice leakage;
- missing required review/verification/transfer/closure.

---

## D-004 — GAM malformed-output E2 family

**Priority:** High while recurring  
**State:** Open / intermittent  
**Milestone relevance:** Alpha if repeatable enough to undermine safe generation

Known malformed-output family.

Current policy:

- fail closed;
- preserve evidence;
- no silent sanitisation.

Continue narrowing provenance between generation, capture and other tooling.

---

## D-005 — Temporary operational-suitability verifier

**Priority:** Medium  
**State:** Temporary instrumentation  
**Milestone relevance:** Alpha evidence support

Useful for identifying systemic GAM failure classes.

Target state is first-pass suitable generation, not permanent reliance on post-generation repair or checking.

Retire or reduce once failure classes are understood and generation is reliably suitable.

---

## D-006 — Release packaging

**Priority:** High  
**State:** Required  
**Milestone relevance:** Alpha release prerequisite

Need a reproducible method for producing a deployment package/folder from known-good project source rather than deploying directly from the working project folder.

The release process should establish what is shipped and from which verified state.

---

# B. Queued / conditional debt

## D-007 — Activity/session timing

**State:** Queued; not currently promoted to Alpha

Duration may exist upstream without explicit per-activity allocation.

If timing becomes a requirement, establish authoritative ownership and lineage from session duration through planning/sequence/assembly.

Do not assign it to the renderer by default.

---

## D-008 — GAM restructure

**State:** Conditional; post-Alpha by default

Do not restructure GAM while DLA/conformance behaviour remains unsettled.

Promote before Alpha only if evidence shows:

- current GAM architecture blocks Alpha reliability; or
- restructuring offers overwhelming risk-reduction/value.

Avoid architecture work driven solely by aesthetic symmetry.

---

## D-009 — Image consistency

**State:** Post-Alpha by default

Promote only if representative benchmark evidence shows image inconsistency materially invalidates Alpha instructional quality or usability.

Keep distinct from pedagogical-diagram architecture.

---

## D-010 — Settings → Adjustments

**State:** Decided and partially implemented — [Sprint 80 OPEN](../sprints/2026-08-26-sprint-80-settings-discovery-product-value-and-policy-architecture/SPRINT-80-START-HERE.md) (updated 2026-08-27)

Discovery is complete. The S80-T-006 gate decided **Option C**: the historical
41-control Settings catalogue is **superseded product design**, replaced by
**Adjustments** — a small allowlisted set of typed workflow parameters plus an
optional per-step natural-language author instruction. `[PRISM_STEP_PARAMS]` is
demoted to legacy with no reachable route to a model.

Implemented so far: **S1** (parameter registry, `resolveEffectiveRunContext`,
`workflow.adjustments` persistence), **S3** (per-step
`step.additional_instruction`, model-visible via two ingress points) and **S2**
(the `topic` parameter, the shared `workflowContext` projector, and the
Henry VIII → Elizabeth I vertical proof on one saved workflow). The architecture
is now proven end to end. Slices S4–S10 are not started.

Do not treat pack-declared Settings as requirements to activate, and do not declare
a registry parameter live without implementing its projection and tests in the same
slice — that recreates the persisted-but-inert failure this debt records.

### Open sub-items introduced by S1/S3/S2/S4 (2026-08-27)

| Item | Note |
| ---- | ---- |
| **D1** | Canonical DLA contains hardcoded `~60` / `50–70` timing text. **Blocks Duration (S5).** Recorded, not fixed. |
| **D2** | Canonical DLA cognition block is bypassed. Recorded, not fixed. |
| **D3** | Learning Sequence duration step parameter never reaches the model. Recorded, not fixed. |
| ~~Stale first-step `Goal:` prose vs adjusted Topic~~ (S2) | **RESOLVED in S4.** Topic declares `supersedesCommissionedContextFields: ["goal"]`, and `buildWorkflowRuntimeContextText` omits a commissioned field when its typed parameter's provenance is `adjustment`. Unrelated commissioning context (audience, constraints, inputs, outputs) is retained, no prose is parsed or rewritten, and nothing changes while Topic is on Auto. |
| `stepScoped` projection unimplemented | Only `workflowContext` is implemented (S2). A declaration using `stepScoped` would persist and resolve but project nothing. Guarded by an S1 test so it cannot ship looking live. |
| ~~Duplicate instruction fields~~ | **RESOLVED in S4 as a UX distinction, not a merge.** The operator confirmed `step.notes` ("Instructions") is a **supported capability**, especially for hand-rolled workflows, and must not be migrated, merged or described as legacy. Both fields now carry distinct labels and help text. |
| ~~Deterministic-step exclusion is one predicate~~ | **RESOLVED in S4.** Split into `isWorkflowStepEligibleForAdditionalInstruction` (steering) and `isWorkflowStepEligibleForWorkflowContextProjection` (projection, via `isDerivedShellWorkflowStep`). Episode Plan is now steerable per explicit operator correction, while still receiving no projected parameters as a derived shell. |
| **Historical pack Settings code retained but inert** (new, S4) | S4 removed the pack-derived catalogue from the active UI but deliberately retained the parsing/aggregation/recovery code and all `[PRISM_STEP_PARAMS]` handling — `aggregateUnifiedWorkflowParameterSections`, `renderUnifiedWorkflowSettingsContent`, `syncUnifiedWorkflowSettingsToStepNotes`, `countUnifiedWorkflowVisibleParameterControls`, `isWorkflowStepConfigurableInSettings`, `recoverWorkflowBriefConfigForUnifiedSettings` and neighbours. Unreferenced from the Adjustments panel and still covered by 60+ passing unit tests, which is what makes retention safe. **Deeper retirement is separate work (S8);** the risk is future confusion, not live authority. |
| **`NON_STEERABLE_CANONICAL_STEP_IDS` is empty** (new, S4) | Deliberate: every current workflow step emits an author-facing prompt, so every step is steerable. A future non-prompt operation must be registered there or it will silently gain a meaningless field. |
| **Adjusted Topic drops commissioning nuance** (new, S4) | Omitting `Goal:` also drops any purpose/emphasis prose it carried, not only the stale subject. Authorised as the narrow fix, but a future Purpose/Intent parameter would let the useful part survive an adjusted Topic. |
| **`step.notes` has two editors** (new, S4) | The Edit tab and the Adjustments panel both edit `step.notes`. The panel prefers the Edit-tab textarea on read and mirrors on write, so gather keeps one source of truth. Residual risk only if the Edit-tab step list is unrendered while Adjustments is open. Worth an integration test in S9. |
| **Prompt Factory `Settings...` button** (new, S4) | An unrelated step-row button labelled `Settings...` seeds the Prompt Factory. Left untouched per S4 scope, but it now shares vocabulary with nothing else on screen. Small naming-clarity follow-up. |
| Save/load normalization asymmetry | `handleSaveWorkflow` does not call `normalizeWorkflowForV1`, so Save-path and load-path normalization differ. S1 works around it in the gather path. Pre-existing. |
| No capability resolvers | `applicability.requiresCapability` fails closed until S7 registers a detector. Intentional, but no parameter can be capability-gated until then. |

Likely still Beta/v1.0 territory for the remaining slices.

---

## D-011 — Slideshow / narrated MP4 workflow

**State:** Post-Alpha new capability

Concept: generate narrated video from slides/stills using TTS.

Potentially valuable, but not Alpha hardening.

---

## D-012 — Formal productisation of Governance

**State:** Method now; implementation later

Governance can operate as a curated workflow/prompts before becoming a Prism-integrated feature.

Immediate value does not depend on agent implementation.

---

## D-013 — Formal productisation of Generation Forensics

**State:** Method now; implementation later

Use LLM/Copilot artefact-grounded diagnostics to localise likely first loss, then use Cursor/repository inspection to verify bounded findings.

Investigations should remain context-driven rather than forced into a rigid universal checklist.

---

## D-014 — Test-suite baseline instability and order dependence

**State:** Newly recorded 2026-08-27 (observed during Sprint 80 S1/S3 verification)

The full Node test suite does not run clean, and some failures depend on execution
order rather than on the code under test.

Measured at the Sprint 80 pre-implementation commit: **3785 tests, 3390 pass, 394
fail**. The failures cluster in the learner-renderer, page-render and utility-render
suites.

Two files demonstrated order dependence across otherwise identical runs
(`learner-renderer-vnext-non-renderable-material-types-phase3`,
`learner-renderer-vnext-support-note-family-phase6`): each **passes in isolation**
but flips verdict depending on what else runs, implying shared mutable state or
shared fixtures across suites.

Consequence for method: a raw pass/fail count cannot be used to judge a change.
Every slice must diff its failing-test list against a baseline captured from the
same commit — which is how S1/S3 established a zero-new-failure delta.

The counts are not even stable between runs of the same commit: the S2
verification measured **412** failures at the same pre-implementation commit that
previously measured 394. The absolute number is therefore meaningless on its own;
only a set difference of failing test locations is informative.

**Recommended method (used by S2).** Create a pristine `git worktree` at the
comparison commit, run the *identical* command in both trees, extract the failing
locations (`^test at `) from each, and diff the two sets. Prefer a targeted
serial run (`--test-concurrency=1`) over the whole suite, since concurrency
amplifies the cross-contamination. S2 recorded zero new failing locations by both
measures.

Not fixed. Fixing it means isolating renderer fixture state, which is its own task.

---

# C. Superseded / retired directions

These are retained as negative programme knowledge.

## R-001 — Whole-page progressive LLM enrichment

**Status:** Retired / empirically disproven

At realistic page sizes, LLM stages failed to preserve complete growing page state reliably despite prompt hardening.

Do not reintroduce without materially new evidence/capability.

---

## R-002 — LLM-owned final merge/composition

**Status:** Retired

Deterministic assembly is canonical.

---

## R-003 — Parallel/legacy learner rendering path

**Status:** Retired

The deterministic vNext learner renderer is canonical.

---

## R-004 — Heuristic renderer recovery of missing pedagogy

**Status:** Rejected

Do not reconstruct upstream semantics from prose, titles, IDs or fuzzy matching in the renderer.

---

## R-005 — Maximal pedagogical ontology / scaffold saturation

**Status:** Rejected

Prism deliberately uses proportional instructional support.

More fields/elements are not inherently better.

---

## R-006 — Silent repair/sanitisation of malformed authoritative generation

**Status:** Rejected

Fail closed and preserve evidence.

---

## R-007 — Append-now / rationalise-prompts-later

**Status:** Rejected engineering practice

Prompt architecture must be intentionally owned and behaviourally gated.

---

## R-008 — Standing temporary DLA rollback (Sprint 76 dual builders)

**Status:** Retired (Phase D, post–Sprint 79 maintenance)

Sprint 77 retained `buildDlaPageEnrichContractBlock` / `buildCanonicalDlaPageShapeSnippet` and `dlaCanonicalAssembler: false` as a temporary rollback rail after the canonical assembler switch. Canonical DLA later absorbed Sprint 78 commissioning; the rollback path became an obsolete normative fork.

Phase D removed the production rollback selector, dual-inject/append paths, and obsolete builders. Live V2 DLA fails closed if `assembleDlaCanonicalContract` is unavailable. Historical sprint records retain the migration narrative.

Do not reintroduce a standing temporary dual DLA constitution.

---

# D. Historical mechanisms not automatically considered debt

Do not convert every superseded historical mechanism into backlog.

Examples include:

- older Design Page ownership mechanisms;
- early two-column manifestation prototypes;
- legacy renderer affordances;
- obsolete pattern-library coverage gaps;
- earlier cognition-projection experiments.

Governance should preserve their rationale where useful while recognising that later architecture may already solve the underlying problem differently.

---

# E. Debt governance rules

At sprint opening/end, review this file and ask:

- Did evidence promote a hypothesis to proven debt?
- Did a temporary mechanism become permanent accidentally?
- Did a debt item become milestone-critical?
- Did a later architecture supersede an item?
- Has a retired idea reappeared without new evidence?
- Is an item merely desirable product development rather than architectural debt?

Keep the list bounded. Implementation tasks belong in sprint plans/backlogs; this file records programme-significant debt and rationale.
