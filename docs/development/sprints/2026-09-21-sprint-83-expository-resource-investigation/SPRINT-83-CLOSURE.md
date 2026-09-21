# Sprint 83 — Closure Record

**Sprint:** 83 — Expository Resource Investigation  
**Opened:** 2026-09-21  
**Closed:** 2026-09-21  
**Status:** **COMPLETE / CLOSED**  
**Type:** Investigation — **not** implementation  
**Backlog:** [PB-FA-011](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-011--expository-resource)  
**Opening:** [S83-D01](decisions.md#s83-d01--open-sprint-83--expository-resource-investigation)  
**Brief:** [S83-D02](decisions.md#s83-d02--accept-detailed-expository-resource-investigation-brief)  
**Close:** [S83-D03](decisions.md#s83-d03--accept-investigation-report-and-close-sprint-83) · [S83-D04](decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline)  
**Predecessor:** [Sprint 82 — CLOSED](../2026-09-01-sprint-82-maths-entry-and-alpha-completion/SPRINT-82-CLOSURE.md) (Alpha development complete)  
**Authoritative output:** [S83-INVESTIGATION-REPORT.md](S83-INVESTIGATION-REPORT.md)

---

## 1. Final conclusion

Sprint 83 **investigation is complete** and **accepted**.

[S83-INVESTIGATION-REPORT.md](S83-INVESTIGATION-REPORT.md) is the **authoritative handoff** to a subsequent **Expository Resource Planning** sprint.

**No Expository implementation has been authorised.**  
**No production code, prompt, schema, UI, renderer, or test changes** occurred in this sprint.

Alpha development remains **complete** (Sprint 82). This closeout does not reopen Sprint 82 or alter the alpha milestone.

---

## 2. What Sprint 83 delivered

| Deliverable | Status |
| ----------- | ------ |
| Sprint pack + opening (S83-D01) | **COMPLETE** |
| Investigation brief acceptance (S83-D02) | **COMPLETE** |
| Investigation tasks S83-T-001…T-012 | **COMPLETE** |
| Investigation report (operator-accepted) | **COMPLETE** — [S83-INVESTIGATION-REPORT.md](S83-INVESTIGATION-REPORT.md) |
| Planning handoff principles (S83-D04) | **COMPLETE** |
| Expository implementation | **Not done / not authorised** |
| Planning sprint | **Not opened** |

---

## 3. Preserved finding distinctions (not architecture decisions)

The accepted report’s distinctions remain handoff evidence — **not** decided designs:

- Established subsystem **progression/machinery** is broadly reusable.
- **Model Knowledge** and **Learning Outcomes** appear substantially reusable.
- Existing **renderer/assembly** capabilities provide substantial reusable infrastructure.
- **Episode Plan**, **DLA**, and **GAM** contain stronger Interactive-specific semantics.
- Expository may therefore require **sibling** planning/development/material roles and contracts at corresponding architectural positions.
- **`learning_content` / source** currently retains explanatory richness that Model Knowledge deliberately compresses.
- Whole-resource **narrative continuity** is a significant Planning question.

### Explicitly not decided at close

Exact Expository stage names · exact topology · exact schemas · exact prompt contents · whether MK needs extension · who owns chapter continuity · final relationship to Interactive consumption · final relationship to Research Synthesis.

Those belong to the **Planning** sprint.

---

## 4. Binding Planning constraints (S83-D04)

### Sibling prompt-family principle

Expository should have its **own coherent sibling prompt family**, reusing proven architecture/capabilities — **not** Expository conditionals inside Interactive prompts, and **not** weakening Interactive pedagogy to share one prompt.

Study Interactive quality principles (grounding, depth, fidelity, claim scope, graphics, etc.) and express them appropriately in the Expository family.

### Protected-baseline principle

> Existing Interactive prompts are not to be modified in order to make Expository Resource possible.

Additive product-independent infrastructure (routing, sibling selection, additional artefact types, additive assembly) may be appropriate later if it **preserves** Interactive behaviour.

**Test:** Would this change alter an existing Interactive prompt or its pedagogical behaviour merely so Expository can work? → Prefer a sibling Expository solution.

Full text: [S83-D04](decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline).

---

## 5. Successor programme

**Intended next:** Expository Resource Planning sprint — **not opened** by this closure.

Open only via an explicit opening decision. Do not invent Planning tasks from this file.

Programme pointer: [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md)

---

## 6. Pack index at close

- [S83-INVESTIGATION-REPORT.md](S83-INVESTIGATION-REPORT.md) — authoritative findings  
- [decisions.md](decisions.md) — S83-D01…D04  
- [PLAN.md](PLAN.md) · [STATUS.md](STATUS.md) · [HANDOVER.md](HANDOVER.md)  
- [SPRINT-83-START-HERE.md](SPRINT-83-START-HERE.md) · [SPRINT-83-CHARTER.md](SPRINT-83-CHARTER.md)
