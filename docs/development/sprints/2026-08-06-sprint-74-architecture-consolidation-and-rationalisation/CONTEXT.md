# Sprint 74 — Context

**Status:** **OPEN** (opened 2026-08-06)  
**Role:** Durable context for architecture consolidation discovery  
**Predecessor authority:** Sprint 73 closed pack — **link, do not rewrite evidence**  
**Theme:** Architecture Consolidation and Rationalisation (discovery wrapper)

---

## Binding architectural constraints

**Authoritative:** [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) (`S74-D03`…`S74-D05`, `S74-D07`, **`S74-D09`**)

Prism is **browser-only at runtime** (static deployment via `index.html`). Node.js is **development/test tooling only**. Rationalisation targets **one definitive path** per major responsibility. `app.js` is rationalised by **ownership**, not size.

**Pre-release Compatibility (`S74-D09`):** Historical persisted state and superseded implementation paths have **no automatic Compatibility requirement**. Preserve **current intended functionality**; Compatibility is opt-in by explicit product requirement.

---

## Why this sprint exists

Sprint 73 delivered first-class Workflow Resources and closed successfully. Prism is approaching v1.0 feature completeness. The next maturation need is not another large feature by default — it is **understanding which architecture is supported**, where compatibility and duplication remain, and how to sequence **evidence-based** rationalisation without indiscriminate cleanup.

Related backlog signals (not auto-consumed as Sprint 74 implementation scope):

- [PB-FA-003 — Pipeline integrity](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-003--pipeline-integrity)  
- [PB-S-004 — Duplicate / legacy UI–state pathways](../../../backlog/PRODUCT-BACKLOG.md)  
- [PB-S-001 — Known broad-suite fixture failures](../../../backlog/PRODUCT-BACKLOG.md)

---

## Platform phase (maturation)

| Aspect | State at Sprint 74 open |
| ------ | ------------------------ |
| Instructional architecture | Productised (Sprint 72) |
| Workflow Resources | Shipped (Sprint 73) |
| Learner renderer vNext | Production **browser** path (Sprint 67+) |
| Authoring surface | Primary workflow authoring environment (UI label post-S73) |
| Emphasis | Durability · clarity · one supported path · sequenced rationalisation |
| Verification | Continuous (`S72-D14`); focused Node-based suites = test evidence; production browser path = deployment confidence |

---

## Architectural reference points (why current architecture exists)

Link only — do not reconstruct implementation history:

| Reference | Why it matters |
| --------- | -------------- |
| Sprint 38 programme | Major pedagogical / visual-affordance / LD overhaul series |
| Sprint 56 / 56F | vNext prompt rationalisation and progressive page enrichment |
| Sprint 67 | Learner-renderer-vNext introduction |
| Sprint 73 | Workflow Resources ownership and persistence |

Live architecture docs: [docs/architecture/](../../../architecture/) · rolling snapshot [current-state.md](../../current-state.md).

---

## Supported product narrative (at open)

Authors create and run workflows, assemble learner pages, author graphics/video/resources, and export preview HTML / standalone HTML / learner ZIP — primarily through:

**Create Workflow → My Workflows → Authoring → (vNext) Preview / HTML / ZIP**

Prompt Studio and Prompt Library remain parallel prompt-development surfaces.

---

## Working posture

- Discovery first; evidence before conclusions  
- Classify findings; do not mark removable without evidence  
- No runtime changes in discovery/planning tasks under this wrapper  
- Obey [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md)  
- Sprint 74A **COMPLETE / Closed**  
- Sprint 74B **OPEN** — implement in 74B pack; 74C **Not opened**  
- Engineering practice: [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)  

---

## Inherited binding decisions (link)

| ID | Carry-forward |
| -- | ------------- |
| `S72-D14` | Continuous verification — stop, fix owning layer, focused regression |
| `S72-D09` / Sprint 73 | Shared Workflow Resources model for durable assets |
| `S73-D01`…`S73-D03` | Workflow Resources scope, conditional persistence, verbatim video embed |
| `S74-D03`…`S74-D05` | Browser-only + static deployment; one supported path; `app.js` by ownership |
| `S74-D07` / `S74A-D02` | One definitive codebase; vNext replaces obsolete learner renderer (removal after inventory) |
| `S74-D09` | Pre-release Compatibility is not a default requirement — preserve current intended functionality |

---

## Related

- Constraints: [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md)  
- Engineering disciplines: [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)  
- Charter: [SPRINT-74-CHARTER.md](SPRINT-74-CHARTER.md)  
- Discovery: [S74-T-001-codebase-rationalisation-discovery.md](S74-T-001-codebase-rationalisation-discovery.md)  
- Domain refinement: [S74-T-010-rationalisation-domain-refinement.md](S74-T-010-rationalisation-domain-refinement.md)  
- Sprint 73 Final Report: [SPRINT-73-FINAL-REPORT.md](../2026-08-06-sprint-73-workflow-resources/SPRINT-73-FINAL-REPORT.md)  
