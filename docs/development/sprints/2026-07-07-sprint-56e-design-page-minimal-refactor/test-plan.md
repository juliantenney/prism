# Test Plan — Sprint 56E

## Objective checks
1. Activity preservation
   - Every required upstream activity appears in output.
2. Material preservation
   - Every required upstream material appears in output.
3. Material fidelity
   - Material body matches authoritative GAM content body (no truncation/summarization).
4. Episode-plan attachment
   - Episode plans attached to correct activity rows.
5. Ordering preservation
   - Activity ordering matches Learning Sequence when sequence is provided.
6. Schema validity
   - Output validates against `design-page.schema.json`.
7. False-positive validation detection
   - Validator fails artefacts that self-report success while violating body fidelity.

## Workstream mapping
- A Responsibility Extraction: derive testable invariants from responsibilities.
- B Schema Definition: convert invariants into schema + external checks.
- C Minimal Implementation: run minimal prompt against controlled fixtures.
- D Validation: execute objective checks and report failures by invariant.
- E Comparison: compare minimal vs current Design Page outputs on same inputs.

## Test execution phases
1. Fixture baseline (known-good and known-bad patterns).
2. Minimal prompt run.
3. Current prompt run (comparison baseline).
4. External validator audit.
5. Recommendation package.

## External Audit Workflow

Validation for Sprint 56E is performed manually or through LLM-assisted review using pasted workflow artefacts.

No JavaScript tooling, workflow hooks, runtime validators, or PRISM-integrated checks are required for Sprint 56E.

The objective is to establish confidence in the Design Page contract before considering automation.
