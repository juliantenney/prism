# Sprint 67 — Findings Log

| ID | Date | Finding | Severity | Status |
| -- | ---- | ------- | -------- | ------ |
| S67-F01 | 2026-07-17 | Sprint 66 root causes remain binding; do not reopen heuristic path | High | **Settled inheritance** |
| S67-F02 | 2026-07-21 | Browser Utilities could not invoke vNext: CJS modules were test-injected only; no `index.html` registration | High | **Resolved (S67-BL-006A)** — committed UMD bundle + script tag before `app.js` |

## M5 human review findings (2026-07-21)

| ID | Severity | Area | Description | Expected | Actual | Disposition |
| -- | -------- | ---- | ----------- | -------- | ------ | ----------- |
| S67-F03 | **Minor** | Page orientation · Study tips | Section wrapper already renders an `h2` (e.g. “Overview”); markdown body also contains `## Overview`, producing adjacent duplicate headings. | Single learner-facing section title per orientation block | Paired headings (“Overview” + “Overview”, “Learning purpose” + “Learning Purpose”, etc.) | **Accepted for controlled rollout.** Optional renderer fix: strip leading markdown heading when it matches section title. Backlog: post-M5 polish |
| S67-F04 | **Observation** | Material headings | Beat uses `h3`; material wrapper uses `h4`; material markdown bodies use `h2`/`h3`, skipping levels visually. | Smooth heading hierarchy | Usable but slightly uneven nesting | **Deferred** — styling/markdown normalisation; not M5 blocker |
| S67-F05 | **Observation** | Page-level outcomes | Fixture includes `learning_outcomes[]`; frozen vNext model does not surface them as a dedicated region. | Deferred sprint item | Outcomes not shown as separate learner section | **Deferred by design** — record for future model/render slice |
| S67-F06 | **Observation** | Expected output presentation | Expected-output blocks describe success criteria in prose; could be read as “answers” by anxious learners. | Clear self-check guidance | Criteria-style wording; appropriate for heteroscedasticity fixture | **No action** — acceptable pedagogical framing |

### M5 clean areas (no finding)

- Activity order A1–A5 and beat labels
- Material once-only rendering (24/24 IDs)
- Critical order A2-M3→A2-M2, A5-M8→A5-M7
- Checklists, tables, scenarios, templates, assessment without answer reveal
- Legacy/vNext isolation and browser runtime registration
- No blocker or major defects identified
