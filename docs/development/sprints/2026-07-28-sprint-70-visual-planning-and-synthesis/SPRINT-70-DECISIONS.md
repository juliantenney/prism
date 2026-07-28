# Sprint 70 Decisions Log

Format:

- **Decision**
- **Status**
- **Rationale**
- **Consequences**
- **Alternatives considered**

---

## D70-01 Recovery baseline is authoritative

- **Decision:** Sprint 70 work must descend from recovery baseline `6853376`; before each slice, confirm production code/tests/fixtures remain equivalent except explicitly reviewed Sprint 70 slice commits.
- **Status:** Accepted
- **Rationale:** It is the certified post-recovery stable state with renderer and identity regressions addressed.
- **Consequences:** Sprint 70 work must prove non-regression against this baseline.
- **Alternatives considered:** Continue from abandoned Sprint 70 work; rejected due rollback and instability.

## D70-02 Sprint 70 is redesigned, not resumed

- **Decision:** Treat prior Sprint 70 artifacts as evidence only.
- **Status:** Accepted
- **Rationale:** Prior attempt was reverted; learned constraints changed architecture priorities.
- **Consequences:** No blind resurrection of old modules/tests.
- **Alternatives considered:** Restore old plan as-is; rejected.

## D70-03 Delivery proceeds in slices

- **Decision:** Implementation must be incremental with isolated commit boundaries.
- **Status:** Accepted
- **Rationale:** Limits blast radius and improves reviewability/rollback safety.
- **Consequences:** Multi-slice gating and per-slice regressions are mandatory.
- **Alternatives considered:** Single large implementation phase; rejected.

## D70-04 Knowledge Summary synthesis is strong-default

- **Decision:** Plan one high-priority Knowledge Summary synthesis visual by default, with explicit skip reasons.
- **Status:** Accepted
- **Rationale:** Page-level synthesis improves coherence when content supports visual abstraction.
- **Consequences:** Contract must encode skip rationale and priority semantics.
- **Alternatives considered:** Always mandatory; rejected. Entirely optional; rejected.

## D70-05 Progressive enhancement is mandatory

- **Decision:** Learner page must remain complete and usable without generated visuals.
- **Status:** Accepted
- **Rationale:** Rendering resilience is required under planning/generation/storage failure.
- **Consequences:** Failure modes require safe fallback behavior and diagnostics.
- **Alternatives considered:** Block rendering/export when visuals missing; rejected as default.

## D70-06 Identity separation must be explicit

- **Decision:** Keep `planning_id`, `evidence_anchor_id`, `job_id`, `asset_id`, `placement_key`, and DOM identity distinct.
- **Status:** Accepted
- **Rationale:** Recovery proved duplicate DOM identity can occur without semantic ambiguity.
- **Consequences:** Schema and tests must enforce identity boundary semantics.
- **Alternatives considered:** Reuse one ID across layers; rejected.

## D70-10 Accessibility and progressive enhancement gates

- **Decision:** Alt text, caption policy, non-color-only semantics, readable contrast, and no visual-only essential learning information are mandatory Sprint 70 quality gates.
- **Status:** Accepted
- **Rationale:** Visuals are progressive enhancement and must remain usable with assistive technologies.
- **Consequences:** Test plan, checklist, and browser checks include explicit accessibility gates.
- **Alternatives considered:** Treat accessibility as post-sprint polish; rejected.

## D70-11 Knowledge Summary placement starting recommendation

- **Decision:** Initial recommended placement is after full Knowledge Summary prose, directly associated with Knowledge Summary region, not synthetic activity material, with safe omission on failure.
- **Status:** Recommended starting position (Slice 1 ratification required)
- **Rationale:** Preserves prose continuity while enabling page-level synthesis.
- **Consequences:** Design/test docs reference this as recommendation, not final contract.
- **Alternatives considered:** Mid-paragraph insertion; synthetic activity material injection; both rejected as default.

## D70-12 Fixture hash lock policy

- **Decision:** Locked fixture `tests/fixtures/page-render/hetero-dup-investigation-source.json` must match SHA-256 `df7cc025ece109280c46e0422a9e3cb99e34c945929dba92b80987eb678e62f5` for dependent tests.
- **Status:** Accepted
- **Rationale:** Prevents silent fixture drift.
- **Consequences:** Hash verification is a precondition in dependent tests and docs.
- **Alternatives considered:** Path-only fixture checks; rejected.

## D70-07 Renderer safety boundary

- **Decision:** Do not modify beat ownership/composition ownership in Sprint 70 unless explicitly required by a slice with dedicated evidence.
- **Status:** Accepted
- **Rationale:** These ownership layers were recently stabilized and are high-risk.
- **Consequences:** Early slices focus on contracts/jobs/persistence outside core ownership logic.
- **Alternatives considered:** Broad renderer refactor early; rejected.

## D70-08 No implementation before pack review

- **Decision:** Sprint 70 production code implementation starts only after this handover pack is reviewed.
- **Status:** Accepted
- **Rationale:** Avoid repeat of unstable architecture changes without agreed constraints.
- **Consequences:** Current output is documentation and planning only.
- **Alternatives considered:** Immediate coding in same pass; rejected.

## D70-09 Historical evidence classification policy

- **Decision:** Separate verified repository evidence from inference and recommendation in Sprint 70 reporting.
- **Status:** Accepted
- **Rationale:** Prevents false historical certainty and architectural drift.
- **Consequences:** Evidence report uses explicit sections for verified/inferred/recommended items.
- **Alternatives considered:** Narrative-only retrospective; rejected.
