# Test Strategy — Sprint 56F

## Validation philosophy

PRISM cannot inspect workflow artefacts after generation completes. PRISM cannot run post-generation validation against workflow outputs.

**All fidelity testing is external audit** — manual or agent-assisted review of exported/pasted artefacts.

## Audit workflow

1. Run workflow (or use committed fixtures when available)
2. Export at each enrichment boundary (optional during migration):
   - page after Episode Plan
   - page after DLA
   - page after GAM
   - page after Sequence
   - final page
3. Compare against audit checklist
4. Record in validation report (adapt [56E template](../2026-07-07-sprint-56e-design-page-minimal-refactor/validation-report-template.md))

## Audit checks

### Structural

- [ ] `artifact_type: page` present
- [ ] Activity IDs match DLA exactly (no `LO*` remapping)
- [ ] Material IDs match GAM exactly
- [ ] Required material IDs from DLA present in page

### Material fidelity

- [ ] Every `material.body` non-empty when GAM had content
- [ ] No summary/label bodies ("Lifecycle stage mapping table.")
- [ ] Bodies include end of source content (not opening excerpt only)
- [ ] Hash or length compare vs GAM source (when fixtures available)

### ID integrity

- [ ] No `A1` → `LO1` conversion
- [ ] No `A1-M1` → `LO1-M1` conversion
- [ ] No ID scheme reconciliation

### Enrichment boundaries

- [ ] GAM wrote bodies — Design Page did not re-author
- [ ] Episode plans attached to correct `activity_id`
- [ ] Sequence order matches `learning_sequence`

### Failure semantics

- [ ] Missing ID → structured failure with `missing_material_ids`
- [ ] No failure due to length/authority/validation gatekeeping

## Fixture strategy

- Commit HR Essentials enrichment fixtures when available
- Per-phase page snapshots for regression
- Do not assume runtime artefacts are available to Cursor without committed fixtures

## Repository tests (implementation phase)

When code changes begin:

- Unit tests for ID lookup enrichment logic
- Fixture-based body equality tests
- Regression gates for deprecated Design Page path (must not execute)

## Definition of test pass (target architecture)

HR Essentials: `A1-M1` through `A6-M7` full bodies embedded; renderer displays complete learner journey without GAM dereference.
