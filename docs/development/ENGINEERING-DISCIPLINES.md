# Prism Engineering Disciplines for Architectural Consolidation

**Purpose:** Operational practices for evidence-led architectural consolidation.  
**Provenance:** Practices proven during Sprint 74A (Authoring → learner export path integrity).  
**Relation:** Architectural constraints define **what** Prism must remain; this document defines **how** consolidation work is carried out safely.

Line-count reduction is **descriptive only**, never the target.

---

## Evidence provenance

- Every verification claim has explicit provenance (revision, command, browser observation, or artefact path).
- Production-browser evidence and Node-based evidence are labelled separately.
- Historical exports, screenshots, ZIPs, snapshots and fixtures are not current proof without provenance.

## Browser authority

- Prism is browser-only at runtime.
- The normal static `index.html` path is authoritative for deployment confidence.
- Node-based tests are supporting evidence only.

## Generated artefacts

- Generated browser artefacts must be freshness-checked before browser verification.
- Rebuild from authoritative source when required.
- Do not validate against stale or cached artefacts.

## Ownership before change

- One established responsibility should have one definitive owner.
- Investigate duplicate ownership, not only duplicate code.
- Do not trust filenames, comments or deprecation labels without tracing actual responsibility.

## Baseline before removal

- Establish current behavioural expectations before removing an implementation.
- Observed regressions are not automatically accepted as the required baseline.

## Inventory before removal

- Trace callers, state, UI, bootstrap, tests, fixtures, documentation and dynamic/global access before deletion.
- Removal follows evidence.

## Small reversible commits

- One coherent implementation slice per commit.
- Verify before committing.
- Keep explicit rollback checkpoints for large rationalisation work.

## Residue sweep

Every implementation/removal slice finishes with a sweep across:

- runtime code;
- routing;
- UI;
- state/persistence;
- browser bootstrap/globals;
- tests;
- fixtures/snapshots;
- CSS/selectors;
- tooling;
- generated artefacts;
- comments and active documentation.

Every remaining match must be:

- removed;
- assigned to a definitive current owner;
- renamed;
- or explicitly deferred with reason.

## Repository history is the archive

- Do not retain obsolete active code solely for historical reference.
- Git history preserves removed implementations.

## Pre-release Compatibility

Binding programme decision: [S74-D09](sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d09--pre-release-compatibility-is-not-a-default-requirement).

- Pre-release historical-state Compatibility is **not assumed**.
- Preserve **current product behaviour**, not obsolete internal development states.
- Do **not** introduce migrations merely to save historical internal data.
- Compatibility becomes mandatory only when **explicitly required** by product/release policy (revisit after external users or release commitments).

> Preserve current intended functionality, not historical pre-release data shapes or superseded implementation behaviour.

> Compatibility is opt-in by explicit product requirement, not opt-out by historical existence.

## Regression handling

- Stop on unexpected behaviour.
- Identify the owning layer.
- Add focused regression coverage.
- Repair the definitive path rather than patching multiple branches.

## Acceptance

Architectural consolidation is complete only when:

- required behaviour is verified;
- generated artefacts are current;
- production browser evidence is recorded where relevant;
- residue is accounted for;
- active documentation describes the definitive architecture;
- no plausible-but-wrong alternative remains.
