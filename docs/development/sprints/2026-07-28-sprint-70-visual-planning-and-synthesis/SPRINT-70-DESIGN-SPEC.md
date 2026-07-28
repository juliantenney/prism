# Sprint 70 Design Specification (Recovery Redesign)

## 1) Problem statement

Prism has stable visual affordance hooks and Sprint 38 affordance semantics, but it lacks a full deterministic architecture for planning, jobing, attaching assets, and rendering pedagogical visuals safely.

Sprint 70 adds this architecture without destabilizing recovered Sprint 69 renderer behavior.

## 2) User and learning value

Visuals are for comprehension and transfer, not decoration. Planning should prioritize when a visual reduces cognitive load or clarifies relationships that prose alone handles poorly.

## 3) Visual planning model

Two scopes are required:

- **activity-level visual planning** tied to activity/material context;
- **page-level synthesis planning** tied to page synthesis regions.

### Knowledge Summary synthesis policy

- strong default: plan one high-priority synthesis visual for Knowledge Summary when eligible;
- skip only with explicit reason categories;
- recommended initial placement: after complete Knowledge Summary prose, associated with Knowledge Summary region, not inserted between summary paragraphs, not represented as synthetic activity material;
- omission must be safe when planning, generation, or asset loading fails.

Final contract fields remain Slice 1 ratification items.

## 4) Visual-form taxonomy (v1, extensible)

Planner may select a form from this initial versioned taxonomy:

- `concept_map`
- `causal_chain`
- `process`
- `comparison`
- `hierarchy`
- `decision_framework`
- `diagnostic_pathway`
- `annotated_system`

This taxonomy is not exhaustive. Planner must record why the selected form improves learning for the referenced content.

## 5) Contract direction and compatibility

Keep existing activity-level contract backward-compatible and add explicit page-level planning support (field naming ratified in Slice 1).

Candidate additive structure:

- `page_visual_affordances[]` entries containing `planning_id`, region/purpose/priority, planning decision, and evidence anchor references.

## 6) Identity model (mandatory separation)

- `planning_id`: stable planning-row identifier.
- `evidence_anchor_id`: identifier for supplied learning-content evidence anchor; not a DOM ID.
- `job_id`: deterministic operational visual-job identifier.
- `asset_id`: attached asset record identifier.
- `placement_key`: deterministic render placement identity.
- DOM identity: concrete rendered `id`/`data-*` attributes.

Rule: these identities must not be conflated. In particular, planning/evidence identities are not renderer DOM identities.

## 7) Lifecycle dimensions (do not conflate)

### Planning decision

- `generate`
- `defer`
- `skip`
- `none`

### Job state

- `planned`
- `prompt_ready`
- `awaiting_asset`
- `asset_attached`
- `failed`

### Placement/render state

- `unplaced`
- `placed`
- `rendered`
- `omitted`

These names are proposed and remain subject to Slice 1 schema ratification.

## 8) Determinism requirements

Given identical valid input + contract version:

- planning decisions are stable;
- `planning_id`/`evidence_anchor_id`/`job_id`/`placement_key` derivations are stable;
- prompt output is stable;
- package manifest ordering and filename/path generation are stable.

## 9) Evidence-grounding requirements

Generated prompts and labels must be derivable from supplied content only.

Disallow:

- invented entities/facts/relationships;
- inferred numeric claims not in source;
- unsupported labels added for stylistic reasons.

Require:

- `evidence_anchor_id` references for each generated job;
- explicit anti-invention constraints in prompt construction.

## 10) Accessibility requirements

All Sprint 70 visual contracts and rendering paths must enforce:

- source-grounded meaningful alt text;
- captions when extra explanatory context is needed;
- no essential learning information available only in a visual;
- no reliance on color alone for meaning;
- readable text and suitable contrast;
- avoidance of dense paragraph text embedded inside generated visuals;
- progressive enhancement behavior for assistive-technology users.

## 11) Asset and output constraints

Required constraints (ratify details in Slice 1):

- supported formats and MIME validation;
- asset digest recording;
- max dimensions and file-size policy (numeric limits unresolved unless already defined elsewhere);
- aspect-ratio policy;
- deterministic package filename/path;
- unsafe path and filename rejection;
- duplicate asset handling policy;
- alt-text and caption storage model;
- provenance metadata capture;
- stale/orphan asset treatment;
- replacement semantics;
- policy for labels/text embedded inside generated visuals.

## 12) Failure and progressive enhancement

Across planning, prompting, asset intake, rendering, and packaging:

- learner page remains complete and usable;
- core prose remains present and primary;
- omitted visuals degrade safely with diagnostics.

## 13) Renderer integration constraints

Sprint 70 must not silently alter beat ownership, composition ownership, or core material placement semantics. Any renderer changes must be slice-scoped with dedicated regression evidence.

## 14) Browser/server alignment

Maintain parity across Node test pipeline, browser Utilities preview path, and exported package behavior.

## 15) Migration and compatibility

- Sprint 38 activity-level affordance behavior remains supported.
- Page-level planning is additive and schema-gated.
- Pages without Sprint 70 planning remain valid.

## 16) Open Slice 1 decisions

1. Final field names and schema location for page-level planning entries.
2. Job persistence boundary (run-state/workflow-state/separate session store).
3. Canonical `job_id` and `evidence_anchor_id` derivation algorithm.
4. Knowledge Summary placement contract field shape.
5. Missing high-priority asset export policy (warn vs block).
6. Numeric limits for file size/dimensions and accepted MIME set if not already defined.

## 17) Acceptance criteria

- Planning contracts validate deterministically with explicit planning decision and lifecycle dimensions.
- Knowledge Summary strong-default planning behavior is present with explicit skip reasons and recommended placement policy.
- Identity boundaries (`planning_id`, `evidence_anchor_id`, `job_id`, `asset_id`, `placement_key`, DOM identity) are enforced and tested.
- Accessibility gates (alt text, caption policy, non-color-only semantics, prose completeness) are testable and included in browser checks.
- Locked heteroscedasticity fixture policy remains in force with hash verification before dependent tests.
- Utilities preview still renders full learner experience with safe visual omission.
