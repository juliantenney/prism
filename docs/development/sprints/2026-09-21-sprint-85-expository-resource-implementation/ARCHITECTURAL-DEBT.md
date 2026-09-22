# Sprint 85 — Architectural debt ledger

Debt relevant to Sprint 85 scope. This file records **status at close** only.

**Sprint 85 is COMPLETE / CLOSED (2026-09-22).** See [SPRINT-85-CLOSURE.md](SPRINT-85-CLOSURE.md).

## Protected prior programme state

| Item | State |
| ---- | ----- |
| Alpha development | **Complete** (unchanged by S85) |
| Sprint 82 | **CLOSED** |
| Sprint 83 | **CLOSED** — investigation accepted |
| Sprint 84 | **CLOSED** — Planning design accepted |
| Sprint 85 | **COMPLETE / CLOSED** — first-class Expository implemented |
| First-class gate | **339/339** |
| Focused S85 gate | **78/78** |
| Interactive prompt family | **Protected baseline** ([S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline)) |
| Accepted Expository design | [S84 design](../2026-09-21-sprint-84-expository-resource-planning/S84-EXPOSITORY-RESOURCE-DESIGN.md) — do not reopen |

## Closure distinction

> S85 establishes functional first-class Expository capability. It does not claim that the learner-facing presentation is polished or final.

## Binding handoff (not debt)

| Source | Constraint |
| ------ | ---------- |
| S83-D04 | Sibling Expository prompt family; do not modify Interactive prompts to enable Expository |
| S84-D03…D12 | Product, topology, authority, north star, sections, contracts, quality — accepted |
| S85-D08 | Sprint closed; no polish programme invented by closeout |

## Carried / deferred items (non-blocking)

| ID | Finding | Notes |
| -- | ------- | ----- |
| S85-AD-001 | Field-level section/page schema mechanics | Delivered sufficiently for first-class use; residual identity/assembly debts deferred |
| S85-AD-002 | GAM body-authoring reuse behind XM | **CLOSED** — S85-D06: no GAM Interactive reuse |
| S85-AD-003 | Zero-workspace export/package edge cases | Exercised in final live E2E; residual edge cases deferred |
| S85-AD-004 | Research Synthesis identity | **Open**, non-blocking — remains with [PB-FA-011](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-011--expository-resource) |
| S85-AD-005 | Expository Adjustments (Scope / extent) | **Delivered** in WP4 via `expository_extent` |
| S85-AD-006 | Domain-pack guidance consumption | **CLOSED** (WP3 + WP4 cold-cache repair) |
| S85-AD-007 | `expository_extent` persistence | Delivered for Create + Adjustments → EJP path |
| S85-AD-008 | Zero-workspace renderer / export | **Delivered** for first-class path |
| S85-AD-009 | Product-independent XM body overlays (CAS/table maths) | **Out of scope** — shared delimiter + MathJax path only |

## Non-blocking refinement observations (not Sprint 85 work)

| Observation | Level |
| ----------- | ----- |
| Learner-facing front matter can feel mechanical/repetitive | Polish / product design |
| Step 3 workflow purpose wording (“measurable learning outcomes”) slightly Interactive/assessment-flavoured | Wording refinement |
| Adjustments UI is text-heavy | UX polish |
| Generated prose rhythm may merit later refinement | Prompt/product polish |
| Possible XM intellectual-artefact vs DP visual-affordance overlap | Product-design consideration |
| Expository → Interactive relationship | Open architectural hypothesis |
| Future maths/CAS/table-maths | [PB-M-001](../../../backlog/PRODUCT-BACKLOG.md#pb-m-001--future-maths-capabilities) |

Do **not** promote these into an automatic Expository polish programme.
