# Sprint 50 Context

**Optimised for:** Fresh chat resuming Sprint 50 with minimal context loss  
**Read order:** This file → [`SPRINT-50-HANDOVER-PACK.md`](SPRINT-50-HANDOVER-PACK.md) → [`SPRINT-50-CHARTER.md`](SPRINT-50-CHARTER.md) → `marx-run-artefacts-run2/`

---

## One-line frontier

**Pedagogy is preserved; make it experienced.** Audit and improve learner-facing manifestation — not generation contracts.

---

## Repository state

| Area | State |
| ---- | ----- |
| **Sprint 49** | Closed — Complete with follow-on work |
| **Sprint 50** | Planned — bootstrap only (this folder) |
| **Marx validation corpus** | [`../2026-06-19-sprint-49-sp-01-text-pattern/marx-run-artefacts-run2/`](../2026-06-19-sprint-49-sp-01-text-pattern/marx-run-artefacts-run2/) |
| **Primary codebase** | `app.js` (workflow, compose, render), `lib/` pattern and LD modules |
| **Test baseline** | Sprint 48–49 gate + pattern + renderer suites (run before/after slices) |

**Operating assumption:** PRISM is human-mediated prompt orchestration. Runtime augments copied prompts and validates captures.

---

## Current architecture state (frozen baseline)

### Generation layer — stable

- **DLA:** `LD-ACTIVITY-PREAMBLE-EXPOSITION` + `LD-COGNITION-ORIENTATION` wired in `applySelfDirectedLearnerPageStepScaffoldsToDraft`
- **GAM:** SP-01–SP-06 via `lib/instructional-pattern-prompt.js`; D-49-01 cognition scoping
- **Schema:** Domain `activities[]` requires preamble + ≥1 cognition field (learner-page); `reinforceLearnerPageDlaActivitiesOutputSchema` patches stale prompts

### Gate layer — stable

- **GAM capture gate** (Sprint 48) — tier-1 blocking on self-directed learner-page GAM
- **DLA Framing Gate v1** (Sprint 49) — `meetsMandatoryFraming` blocks workflow Next; no auto-repair

### Preservation layer — largely stable

- GAM material bodies survive compose into `page.json` `materials.*`
- PEL merge/repair paths exist when upstream DLA carries fields

### Manifestation layer — Sprint 50 focus

- Renderer emits `util-activity-preamble`, `util-cognition*`, `util-journey-compass` when data available
- **Gap:** `page.json` may not echo all DLA PEL keys on activity rows while HTML still renders them
- **Gap:** Visual salience, reading order, Journey Compass usefulness — unaudited against rubric

---

## Recent discoveries (Sprint 49 — settled)

1. **Generation bottleneck was upstream of renderer** — fixed for Marx run2.
2. **Manifestation ≠ presence** — fields can exist without owning learner experience.
3. **Schema authority beats OUTPUT CONTRACT** — do not solve manifestation with more contracts.
4. **Authoring modules pattern works** — small DLA libs + schema alignment > contract sprawl.
5. **Page JSON vs HTML divergence** — compose fidelity audit warranted (run2 partial echo).

---

## What not to revisit

- SP-01 / TEXT-SP-01 implementation or D-49-01 reconciliation
- Cognition-cue placement in GAM `text` bodies (FM-07)
- New DLA/GAM blocking gates or auto-retry
- OUTPUT CONTRACT expansion for generation compliance
- Cognition ontology redesign
- Facilitator workflow scope
- Re-diagnosing “missing pedagogy” or “missing workflow stage” (Sprints 42–43 settled)

---

## Evidence that already exists

### Primary — use first

| Evidence | Path |
| -------- | ---- |
| Marx run2 DLA output | `marx-run-artefacts-run2/learning_activities.json` |
| Marx run2 GAM output | `marx-run-artefacts-run2/activity_materials.md` |
| Marx run2 page model | `marx-run-artefacts-run2/page.json` |
| Marx run2 rendered page | `marx-run-artefacts-run2/page.html` |
| Sprint 49 closure analysis | `../2026-06-19-sprint-49-sp-01-text-pattern/SPRINT-49-CLOSURE-REPORT.md` |

### Secondary — historical diagnosis

| Evidence | Path |
| -------- | ---- |
| Salience / ownership (Sprint 43) | `../2026-06-12-sprint-43-educational-salience/43-05-seamless-chat-handover-pack.md` |
| Design Page bottleneck (Sprint 42) | `../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/42-11A-design-page-static-provenance-audit.md` |
| Renderer cognition tests | `tests/utility-renderer-cognition-fields.test.js` |
| Marx design quality tests | `tests/utility-marx-self-study-design-quality.test.js` |

### Missing from artefact folder (capture on refresh if needed)

- Exported DLA / GAM / Design Page **prompts**
- Formal **observations log** for run2
- Second validation fixture (workshop corpus)

---

## Recommended first actions

1. **Read** [`SPRINT-50-CHARTER.md`](SPRINT-50-CHARTER.md) — confirm non-goals with user before any code.
2. **Audit** `marx-run-artefacts-run2/` side-by-side (DLA JSON → page JSON → page HTML) for one activity (start A1).
3. **Draft manifestation rubric** — salience, reading order, intelligibility, PEL visibility (document in sprint folder; not code).
4. **Trace compose path** — where DLA PEL keys drop between `learning_activities.json` and `page.json` (if confirmed).
5. **Map renderer order** — `app.js` framing block assembly vs target: orientation → reasoning → task → materials.
6. **Run regression** — `workflow-dla-framing-capture-validation-gate.test.js`, `workflow-ld-cognition-contracts.test.js`, `utility-page-render.test.js` to establish green baseline.
7. **Propose slices** only after rubric + audit — each slice must cite a manifestation finding.

---

## Scope gate (D-50-01)

Pedagogic manifestation before architecture expansion. If a fix requires new prompt layers, stop and document evidence — do not implement by default.

---

*Context v1 — fresh-chat entry point.*
