# Sprint 65

**Sprint:** 65 — Renderer Learner Experience Optimisation  
**Working title:** Working With What We Have  
**Status:** **In progress** (S65-BL-001 … S65-BL-006 complete; implementation not started)  
**Opened:** 2026-07-16  
**Nature:** Implementation-oriented **renderer** sprint (evidence-led; audit before code)  
**Predecessor:** [Sprint 64 close](../2026-07-16-sprint-64-cognitive-structure-preservation-investigation/sprint-64-final-recommendation.md) · [Sprint 63 findings](../2026-07-16-sprint-63-cognitive-flow-and-reasoning-visibility/sprint-63-authoritative-findings.md) · [Sprint 62 renderer pass](../2026-07-16-sprint-62-coherent-renderer-pass/SPRINT-62-CLOSURE.md)

| Document | Role |
| -------- | ---- |
| [SPRINT-65-START-HERE.md](SPRINT-65-START-HERE.md) | Reading order |
| [next-chat-briefing.md](next-chat-briefing.md) | Paste handover briefing |
| [SPRINT-65-CHARTER.md](SPRINT-65-CHARTER.md) | Authoritative scope |
| [sprint-summary.md](sprint-summary.md) | Living sprint summary |
| [baseline-learner-experience-audit.md](baseline-learner-experience-audit.md) | S65-BL-001 |
| [renderer-signal-inventory.md](renderer-signal-inventory.md) | S65-BL-002 |
| [signal-inventory-table.md](signal-inventory-table.md) | Full signal table |
| [learner-activity-contract-comparison.md](learner-activity-contract-comparison.md) | S65-BL-003 |
| [archetype-sensitive-manifestation-rules.md](archetype-sensitive-manifestation-rules.md) | S65-BL-004 |
| [page-information-architecture.md](page-information-architecture.md) | S65-BL-005 |
| [material-role-and-beat-presentation.md](material-role-and-beat-presentation.md) | S65-BL-006 |
| [backlog.md](backlog.md) | Ordered backlog |
| [decisions.md](decisions.md) | Decision log |
| [evidence-log.md](evidence-log.md) | Evidence log |
| [findings-log.md](findings-log.md) | Findings log |
| [evaluation-framework.md](evaluation-framework.md) | Before/after audit matrix |
| [links-to-predecessors.md](links-to-predecessors.md) | Sprint 62–64 links |
| [samples/](samples/) | Captures + inventory scan |
| [experiments/](experiments/) | BL-003–006 demos (not production) |
| [screenshots/baseline/](screenshots/baseline/) | S65-BL-001 captures |
| [Canonical charter](../../../sprints/sprint-65-renderer-learner-experience-optimisation.md) | Canonical pointer |

---

## Purpose

Improve the learner-facing page renderer so it produces the strongest possible instructional experience using **only data already available after the GAM boundary**.

> Use the signals that already survive into the page artifact to maximise learner comprehension, orientation, cognitive signalling, activity differentiation, sequencing clarity and perceived instructional quality.

---

## Core product question

> How can the renderer make each activity’s intended learner thinking, progression, task structure and success criteria immediately understandable using only current page-artifact data?

---

## Authoritative reference samples

| Role | Location |
| ---- | -------- |
| Primary RNA assembled page | [`tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json`](../../../../tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json) |
| RNA assessment companion | [`tests/fixtures/page-render/ld-rna-hcv-assessment-page.json`](../../../../tests/fixtures/page-render/ld-rna-hcv-assessment-page.json) |
| Sample index | [samples/README.md](samples/README.md) |

Baseline HTML: [`samples/rna-hcv-baseline-render.html`](samples/rna-hcv-baseline-render.html). Historical Sprint 30 artefacts are optional context only.

---

## Relationship to Sprints 63 and 64

| Sprint | Inheritance for Sprint 65 |
| ------ | ------------------------- |
| **63** | Tier 2 differentiation is real; some upstream plan structure is **not** recoverable downstream — treat as settled ceiling |
| **64** | Experimental preservation feasible; **production preservation not authorised**; no schema redesign; no renderer consumption of hidden plans |

Sprint 65 does **not** reopen preservation architecture. Missing archetype-plan fields are a **known architecture ceiling**, not a Sprint 65 renderer defect.

---

## Explicit scope boundary

**In scope:** Renderer presentation, information architecture, progressive disclosure, archetype-sensitive manifestation from **existing** page fields, material-role clarity, diagnostic gating, accessibility/responsive/print, tests.

**Out of scope:** Schema redesign · GAM redesign · Sprint 64 envelopes · inferring `required_links` / `stages` / `key_relationships` / `governing_constraint` · generic cognitive schemas · inventing instructional content · unrestricted visual redesign · new design system.

---

## Immediate next task

**S65-BL-007 — Bounded Renderer Prototype** (experimental; reversible; no production hardening).
