# Failed investigation archive — 2026-06-29

**Quarantined during Sprint 53 bootstrap.**  
**Baseline commit:** `04c9e81` — close sprint 51 learner experience work and bootstrap sprint 52

These files were **untracked leftovers** from a 2026-06-29 Design Page fidelity investigation. They were **not** part of the committed repository at `04c9e81`.

## Do not use without re-verification

Most tests import APIs that **do not exist** in committed libs at the baseline, for example:

- `validateDesignPageComposeMaterialBodies`
- `validatePageMaterialsClosure`
- `hydratePageMaterialsFromMaterialBank`
- `validatePageArtifactMaterialFidelity`
- `embedPageActivityMaterialsSectionIntoLearningActivities`

## Contents

| Path | Type |
| ---- | ---- |
| `tests/design-page-compose-abbreviation.test.js` | Test (orphan) |
| `tests/design-page-compose-assembly.test.js` | Test (orphan) |
| `tests/design-page-live-fidelity-enforcement.test.js` | Test (orphan) |
| `tests/design-page-material-bank-fidelity.test.js` | Test (orphan) |
| `tests/design-page-material-bank-render.test.js` | Test (orphan) |
| `tests/page-materials-closure.test.js` | Test (orphan) |
| `tests/utility-page-material-render-fidelity.test.js` | Test (orphan) |
| `tests/fixtures/design-page-compose/rna-abbreviated-materials-page.json` | Fixture |
| `tests/fixtures/page-render/ld-material-render-fidelity-page.json` | Fixture |
| `tests/fixtures/workflow-episode-plans/rna-step5-analyse.json` | Fixture |
| `docs/.../SPRINT-52-ACTIVITY-ARCHETYPE-COVERAGE-AUDIT.md` | Draft sprint doc |

## Disposition

**Quarantine** — retained for forensic reference only. Do not copy back into `tests/` until each file is revalidated against committed APIs and passes independently.
