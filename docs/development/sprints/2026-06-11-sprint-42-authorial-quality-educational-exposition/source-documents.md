# Source Documents for Sprint 42

**Sprint:** Authorial Quality / Educational Exposition  
**Status:** In progress — through Slice 42-10. See [`handover-from-sprint-41.md`](handover-from-sprint-41.md) → **Current Position**.

---

## Sprint 41 closure (authoritative predecessor)

| Document | Path |
| -------- | ---- |
| Closure report | `docs/development/sprints/2026-06-11-sprint-41-educational-framework-integration/sprint-41-closure-report.md` |
| Sprint 41 handover | `docs/development/sprints/2026-06-11-sprint-41-educational-framework-integration/handover-from-sprint-41.md` |
| Validation report | `.../sprint-41-validation-report.md` |
| Framework impact report | `.../sprint-41-framework-impact-report.md` |
| EQF diagnostics | `.../educational-quality-diagnostics.md` |

---

## Educational framework (reference only — no new dimensions)

Sprint 42 uses the framework as **design context**, not as a target for architectural extension.

| Document | Repository path |
| -------- | --------------- |
| North star | `docs/educational design/framework/north-star.md` |
| Educational Quality Framework | `docs/educational design/framework/educational-quality-framework.md` |
| Educational prompting guide | `docs/educational design/framework/educational-prompting-guide.md` |
| Framework overview | `docs/educational design/framework/framework-overview.md` |
| Sprint 40 validation | `docs/educational design/framework/sprint-40-validation-report.md` |

---

## Exposition benchmark artefacts

Primary fixtures for Sprint 42 audit and before/after comparison:

| Workflow | Fixture | Notes |
| -------- | ------- | ----- |
| Marx self-study (strong structure) | `tests/fixtures/page-render/marx-self-study-page.json` | 7/8 EQF; best journey + PEL exemplar |
| Marx self-study (thin variant) | `tests/fixtures/page-render/marx-self-study-design-quality-page.json` | 4/8 EQF; structural contrast |
| Inflation workshop | `tests/fixtures/page-render/ld-inflation-workshop-page.json` | 5/8 EQF |
| Inflation workshop (extended) | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` | 4/8 EQF |
| Climate / misconception workshop | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` | 5/8 EQF |
| Self-directed framing | `tests/fixtures/page-render/self-directed-activity-framing-page.json` | Framing field visibility |
| Procedural DLA (anti-pattern) | `tests/fixtures/workflow-brief/marx-dla-procedural-output.json` | Thin task-only shape |

Rendered HTML baselines (where available):

- Sprint 30 live: `docs/development/sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/.../live-artefacts/marx-render.html`
- Sprint 38S replay: `docs/development/sprints/2026-06-06-sprint-38s-episode-plan-v1-implementation/artefacts/EV-38S-AFTER-4-design-page-replay.json`

---

## Implementation files (Sprint 42 likely touch points)

### Prompt and compose (primary)

| File | Role |
| ---- | ---- |
| `app.js` | Augmentation chain; DLA OUTPUT CONTRACT; learner-page framing blocks; compose repair |
| `lib/ld-design-page-compose-contract.js` | Design Page read-only compose — **likely Slice 42-2** |
| `lib/ld-self-directed-rhetoric.js` | Rhetoric, closure, progression vocabulary |
| `lib/educational-quality-framework-prompt.js` | EQF manifestation — exposition lines only if needed |
| `domains/learning-design/domain-learning-design-step-patterns.md` | Step `promptTemplate` bodies |
| `domains/learning-design/domain-learning-design-prompt-rules.md` | Cross-step prompt rules |

### Preservation and framing (do not break)

| File / symbol | Role |
| ------------- | ---- |
| `repairLearnerPageCompositionFromUpstream` | Design Page framing preservation |
| `buildLearnerPageDlaOutputContractOverrideBlock` | Mandatory preamble + cognition |
| `evaluateLearnerPageDlaActivityFramingCoverage` | DLA capture validation |
| `LEARNER_PAGE_ACTIVITY_FRAMING_PRESERVATION_FIELD_IDS` | Field preservation list |

### Renderer (reference boundary — no structural redesign)

| File | Role |
| ---- | ---- |
| `app.js` — `renderLearningActivitiesBlocks`, `renderActivityFramingForActivity` | How preamble/cognition render today |
| `docs/architecture/renderer-export-behavior.md` | Export and section behaviour |

### Diagnostics (optional Sprint 42 tooling)

| File | Role |
| ---- | ---- |
| `lib/educational-quality-framework-evaluator.js` | Dimension presence — not prose quality |
| `tools/evaluate-educational-quality-framework.js` | Manual benchmark CLI |

---

## Sprint 41 regression tests (must stay green)

| Test file | Guards |
| --------- | ------ |
| `tests/workflow-learner-page-mandatory-framing.test.js` | Mandatory DLA framing |
| `tests/workflow-learner-page-design-page-preservation.test.js` | Compose preservation repair |
| `tests/workflow-learner-page-framing-delivery-mode.test.js` | Workshop + self-study framing gates |
| `tests/workflow-self-directed-activity-framing-adoption.test.js` | DLA prompt pipeline |
| `tests/utility-self-directed-activity-framing.test.js` | Renderer framing passthrough |
| `tests/utility-learner-workshop-material-visibility.test.js` | Workshop learner visibility |

---

## Prior sprint observation docs (exposition-relevant)

| Document | Relevance |
| -------- | --------- |
| `docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38C-design-page-richness-review.md` | Page richness and field transformation |
| `docs/development/sprints/2026-06-05-sprint-38k-instructional-function-depth/observations/38K-1-baseline-depth-analysis.md` | Shallow orientation examples |
| `docs/development/sprints/2026-06-01-sprint-31-page-rhetoric-renderer-experience/` | Repeated framing language |
| `docs/development/sprints/2026-06-03-sprint-35-pedagogical-refinement/observations/35-1-instructional-clarity.md` | Task/output rhetoric |

---

## Recommended capture locations (Sprint 42)

| Path | Purpose |
| ---- | ------- |
| `captures/sprint-42-exposition/` | Before/after page JSON and HTML for exposition slices |
| `docs/development/sprints/2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/` | Audit notes (Slice 42-1) |

---

## Sprint 41 context extracts (optional background)

`docs/development/sprints/2026-06-11-sprint-41-educational-framework-integration/context-files/`

Not authoritative for Sprint 42 implementation — use live repo paths above.
