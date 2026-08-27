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

## D-010 — Settings

**State:** Active discovery — [Sprint 80 OPEN](../sprints/2026-08-26-sprint-80-settings-discovery-product-value-and-policy-architecture/SPRINT-80-START-HERE.md) (2026-08-26)

Product capability under discovery/planning. Prior diagnostic verdict was redesign; Sprint 80 reassesses whether Settings should exist at all against current canonical DLA/GAM architecture.

Do not treat pack-declared Settings as requirements to activate. Operator decision gate: S80-T-006.

Likely still Beta/v1.0 territory for any implementation that follows Sprint 80.

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
