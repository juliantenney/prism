# Validator Specification — Sprint 56E

## Purpose
Define a practical, repeatable, human-auditable external validation process for Design Page outputs against authoritative upstream artefacts.

## Validation Philosophy

Design Page validation is external to workflow execution.

Validation is performed against exported or pasted artefacts after a workflow run has completed.

The purpose of validation is to determine whether the Design Page artefact satisfies the Design Page contract and schema.

Validation is not used to influence workflow execution.

## Sprint 56E Validation Method

Primary validation method:

- User runs workflow
- User exports or pastes:
  - DLA output
  - GAM output
  - Episode Plans output
  - Learning Sequence output
  - Design Page output
- Artefacts are reviewed externally
- Validation report is produced

## Inputs
- DLA output (activity structure/IDs)
- GAM output (material IDs + full bodies)
- Episode Plans output
- Learning Sequence output (optional but binding when provided)
- Design Page output under test

## Validation Checks
1. Schema Shape
2. Activity Coverage
3. Activity Order Preservation
4. Material ID Coverage
5. Material Body Preservation
6. Episode Plan Attachment
7. Page Self-Containment
8. False Positive Validation Claims

## Failure reporting
- Report check name, failing path(s), and evidence excerpt.
- Distinguish structural failures vs semantic fidelity failures.
- Mark blocking vs non-blocking findings.

## Pass criteria
- All blocking checks pass.
- No false-positive validation claims detected.

## Output format
- Human-readable validation report (see `validation-report-template.md`).
- Optional machine-readable summary if generated externally.
