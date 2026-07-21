# Sprint 68 — Fixture References

## Primary

| Fixture | Path | Role |
| ------- | ---- | ---- |
| Heteroscedasticity beat assignment | `tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json` | Golden coherence fixture; known single bridge on A5 |

### Known transition-related fields (heteroscedasticity)

- `activity_preamble` on A1–A5
- `intellectual_coherence_bridge` on A5 only (~line 598)
- Page `page_synthesis.progression_guidance`
- Beat prompts: `reasoning_orientation`, `argument_structure_hint`, etc.

## Comparison fixtures (planned for S68-BL-002)

| Fixture | Path | Notes |
| ------- | ---- | ----- |
| RNA HCV | `tests/fixtures/page-render/ld-rna-hcv-assessment-page.json` | Assessment-heavy |
| Inflation workshop | `tests/fixtures/page-render/ld-inflation-workshop-page.json` | Journey nav patterns |
| Marx beat render | `tests/fixtures/page-render/marx-beat-render-page.json` | Alternate lesson family |

## Export artefacts (Sprint 67 baseline)

| Artefact | Path |
| -------- | ---- |
| Latest heteroscedasticity vNext export | `docs/development/sprints/2026-07-17-sprint-67-learner-renderer-vnext/artefacts/heteroscedasticity-vnext-icons-export.html` |

Sprint 68 coherence exports should be stored under this sprint's `artefacts/` directory when generated.
