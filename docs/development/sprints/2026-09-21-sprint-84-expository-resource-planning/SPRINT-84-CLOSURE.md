# Sprint 84 — Closure Record

**Sprint:** 84 — Expository Resource Planning  
**Opened:** 2026-09-21  
**Closed:** 2026-09-21  
**Status:** **COMPLETE / CLOSED**  
**Type:** Planning — **not** implementation  
**Backlog:** [PB-FA-011](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-011--expository-resource)  
**Opening:** [S84-D01](decisions.md#s84-d01--open-sprint-84--expository-resource-planning)  
**Brief:** [S84-D02](decisions.md#s84-d02--accept-detailed-sprint-84-planning-brief)  
**Close:** [S84-D12](decisions.md#s84-d12--accept-refined-planning-design-and-close-sprint-84)  
**Predecessor:** [Sprint 83 — CLOSED](../2026-09-21-sprint-83-expository-resource-investigation/SPRINT-83-CLOSURE.md)  
**Authoritative output:** [S84-EXPOSITORY-RESOURCE-DESIGN.md](S84-EXPOSITORY-RESOURCE-DESIGN.md)

---

## 1. Final conclusion

> Sprint 84 Expository Resource Planning is complete. The first-class Expository product, instructional-design model, workflow topology, authority boundaries, sibling-stage responsibilities, semantic section structure, capability-preservation requirements and implementation handoff are accepted. Implementation has not begun and must be opened separately.

[S84-EXPOSITORY-RESOURCE-DESIGN.md](S84-EXPOSITORY-RESOURCE-DESIGN.md) is the **authoritative Planning handoff** to a subsequent **Expository Resource implementation** sprint.

**No Expository implementation has been authorised.**  
**No production code, prompt, schema, UI, renderer, or test changes** occurred in this sprint.  
**No implementation sprint was opened** by this closure.

Alpha development remains **complete** (Sprint 82). Sprint 83 remains **CLOSED**. This closeout does not reopen prior sprints or alter the accepted S84 architecture.

---

## 2. What Sprint 84 established

| Established | Status |
| ----------- | ------ |
| Expository Resource as a first-class PRISM Learning Design product | **Accepted** |
| Protected Interactive baseline | **Accepted** (with S83-D04) |
| Sibling Expository pedagogical family | **Accepted** |
| PRISM capability-preservation principle | **Accepted** |
| Authority model: `learning_content` as explanatory richness spine; MK as conceptual graph | **Accepted** |
| Expository topology (below) | **Accepted** |
| Bypass of Interactive EP / DLA / GAM / Learning Sequence | **Accepted** |
| Instructional-design north star (progressive construction of understanding) | **Accepted** (S84-D10) |
| EJP ownership of whole-resource intellectual journey | **Accepted** |
| XD ownership of per-section explanatory treatment | **Accepted** |
| XM ownership of commissioned intellectual materials | **Accepted** |
| Ordered learner-facing exposition **sections** as semantic primary structure | **Accepted** (S84-D11) |
| Commission-lock discipline | **Accepted** |
| Thin Design Page / deterministic assembly / shared renderer | **Accepted** |
| Sibling EJP/XD/XM contracts (field-level schemas deferred) | **Accepted** |
| Preservation of applicable existing PRISM capabilities | **Accepted** |
| Judgement-based quality/acceptance framework | **Accepted** |
| Implementation handoff defined without authorising implementation | **Accepted** |
| Planning tasks S84-T-001…T-010 | **COMPLETE** |
| Expository implementation | **Not done / not authorised** |
| Implementation sprint | **Not opened** |

### Accepted topology

```text
Generate Learning Content → Model Knowledge → Learning Outcomes
  → Expository Journey Plan → Expository Development → Expository Materials
  → Design Page → deterministic assembly → learner-renderer-vnext
```

(Normalize optional when source supplied; Interactive EP / DLA / GAM / Learning Sequence bypassed.)

---

## 3. Remaining questions (correct level — not reasons to keep Sprint 84 open)

| Question | Level |
| -------- | ----- |
| Field-level section/page schema mechanics | **Implementation** |
| How much GAM body-authoring code can safely be reused behind XM | **Implementation** |
| Zero-workspace export/package edge cases | **Implementation verification** |
| Expository-specific Adjustments | **Defer** until evidence requires |
| Research Synthesis identity | **Open**, non-blocking |

---

## 4. Decisions at close

| ID | Summary |
| -- | ------- |
| S84-D01…D02 | Open pack; accept Planning brief |
| S84-D03…D09 | Product, authority, topology, continuity, materials/page, contracts, quality/handoff |
| S84-D10 | Instructional-design north star |
| S84-D11 | Ordered exposition sections as semantic primary structure |
| **S84-D12** | **Accept refined Planning design and close Sprint 84** |

Architecture detail: [decisions.md](decisions.md) · [S84-EXPOSITORY-RESOURCE-DESIGN.md](S84-EXPOSITORY-RESOURCE-DESIGN.md)

---

## 5. Successor programme

**Successor:** [Sprint 85 — Expository Resource Implementation](../2026-09-21-sprint-85-expository-resource-implementation/SPRINT-85-START-HERE.md) — **OPEN** ([S85-D01](../2026-09-21-sprint-85-expository-resource-implementation/decisions.md#s85-d01--open-sprint-85--expository-resource-implementation)).

Do not reopen Sprint 84 architecture. Do not invent implementation tasks from this Planning pack.

Programme pointer: [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md)

---

## 6. Pack index at close

- [S84-EXPOSITORY-RESOURCE-DESIGN.md](S84-EXPOSITORY-RESOURCE-DESIGN.md) — authoritative Planning design  
- [SPRINT-84-CLOSURE.md](SPRINT-84-CLOSURE.md) — this record  
- [decisions.md](decisions.md) — S84-D01…D12  
- [PLAN.md](PLAN.md) · [STATUS.md](STATUS.md) · [HANDOVER.md](HANDOVER.md)  
- [SPRINT-84-START-HERE.md](SPRINT-84-START-HERE.md) · [SPRINT-84-CHARTER.md](SPRINT-84-CHARTER.md)
