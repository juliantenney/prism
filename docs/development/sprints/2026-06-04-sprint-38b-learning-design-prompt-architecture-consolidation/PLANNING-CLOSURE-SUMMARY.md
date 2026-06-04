# Sprint 38-B — Planning closure summary

**Date:** 2026-06-04  
**Pack:** `docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/`  
**Phase:** **Planning closed** — implementation programme **not started**  
**Charter:** [SPRINT-38-B-CHARTER.md](SPRINT-38-B-CHARTER.md)  
**Governance:** [observations/38B-7-governance-and-maintenance.md](observations/38B-7-governance-and-maintenance.md)

---

## 1. Planning phase verdict

Sprint 38-B **planning objectives are complete**. The programme documented LD prompt architecture debt, taxonomy, consolidation design, materials/table failure analysis, validation framework, and governance. **No runtime prompt consolidation** was performed in this phase (by charter).

| Gate | Result |
|------|--------|
| Charter success criteria (38B-1–38B-7) | **Met** |
| Open production regression (table fidelity) | **Acknowledged** — fix deferred to implementation |
| Sprint 39 | **Remains gated** |

---

## 2. Completed slices

| Slice | Document | Planning status | Notes |
|-------|----------|-----------------|-------|
| 38B-1 | [38B-1-prompt-audit.md](observations/38B-1-prompt-audit.md) | **COMPLETE** | Probe baselines; Design Page 45,791 aug chars |
| 38B-2 | [38B-2-instruction-taxonomy.md](observations/38B-2-instruction-taxonomy.md) | **COMPLETE** | 12 clusters; L0–L8; `LD-*` modules |
| 38B-3 | [38B-3-design-page-consolidation-plan.md](observations/38B-3-design-page-consolidation-plan.md) | **COMPLETE** | Strategy B; block→layer map; ≤3 append targets |
| 38B-4 | [38B-4-materials-and-table-fidelity.md](observations/38B-4-materials-and-table-fidelity.md) | **COMPLETE (planning)** | Regression **OPEN** B4-01/B4-02 |
| 38B-5 | [38B-5-workflow-wide-review.md](observations/38B-5-workflow-wide-review.md) | **COMPLETE** | Waves 1–4 reordered |
| 38B-6 | [38B-6-regression-validation-plan.md](observations/38B-6-regression-validation-plan.md) | **COMPLETE** | Assertions; anchors; sign-off process |
| 38B-7 | [38B-7-governance-and-maintenance.md](observations/38B-7-governance-and-maintenance.md) | **COMPLETE** | MR/GAP/CC/waivers/size policy |

---

## 3. Slice closure notes

### 38B-3 Design Page consolidation plan

**Verdict: COMPLETE for planning.**

Delivered: target hierarchy, pack §13 + 15 runtime markers → layers, three target append units, before/after metrics, migration sketch, **Strategy B** adopted.

**Not required for planning close:** full `LD-DESIGN-PAGE-COMPOSE-CONTRACT` prose (implementation Wave 3 deliverable).

**No blockers.**

### 38B-4 Materials and table fidelity

**Verdict: COMPLETE for planning; regression remains OPEN.**

B4-01/B4-02 do **not** require live Inflation JSON attachment before planning closes. Rerun prose, fixture good shapes, hypotheses, and layer-4 requirements are sufficient. See [38B-4 § Planning closure](observations/38B-4-materials-and-table-fidelity.md#planning-closure--b4-01-and-b4-02-evidence).

**Implementation:** EV-38B4-01–03 recommended before Design Page Wave 3 merge.

---

## 4. Open evidence items (implementation phase)

| ID | Item | Blocks planning? | Blocks implementation? |
|----|------|------------------|------------------------|
| EV-38B4-01 | Live Inflation Design Page JSON excerpt (bad table paths) | No | Recommended before Wave 3 |
| EV-38B4-02 | Confirm `materials.<key>` vs orphan section for B4-02 | No | Recommended before Wave 3 |
| EV-38B4-03 | Same-run GAM `activity_materials` capture | No | Optional (GAM vs DP attribution) |
| B4-04 | CI multi-table case detail | No | Before CI anchor sign-off |
| Golden diff | Post-fix Inflation page vs `activity_materials` pipes | No | 38B-6 §7.5 programme exit |
| AUTO* detectors | L4-04 comma-row; L4-05 pipe rows | No | CC-MODULE / CC-CONTRACT |

**Production regression:** comma-row / Headers-Rows table shapes on Inflation — **OPEN** until Waves 1–3 land.

---

## 5. Implementation prerequisites

Planning close does **not** start implementation. Before the first **CC-CONTRACT** or **CC-MODULE** PR:

1. **Separate implementation charter** (or explicit programme lead authorisation) — not created in 38B planning.  
2. **38B-6 baseline** — probe + test count recorded (38B-1 numbers accepted as baseline).  
3. **38B-7** — change class, owner, and checklist per PR.  
4. **Sprint 38 freeze** — no CC-SCHEMA changes under 38B workstream.  
5. **Wave 1 first** — deploy shared modules before per-step rhetoric trim (38B-5, MR-10, GAP-02).  
6. **GAP-06** — no new L5–L7 appends while B4-01/B4-02 open except L4 precedence clarifiers (38B-7).  

**Not prerequisites:** live JSON attachment; Sprint 39 pack work; renderer/VEU changes.

---

## 6. Implementation wave order

Authoritative order from [38B-5](observations/38B-5-workflow-wide-review.md) + [38B-7](observations/38B-7-governance-and-maintenance.md):

```text
Wave 1 — Shared modules (foundation)
  LD-TABLE-FIDELITY, LD-MATERIALS-COPY, LD-MATH-RENDER, LD-SELF-DIRECTED-RHETORIC
       ↓
Wave 2a — Generate Activity Materials (table author)
       ↓
Wave 2b — Design Learning Activities (spec vocabulary)
       ↓
Wave 3 — Design Page (LD-DESIGN-PAGE-COMPOSE-CONTRACT + slim riders)
       ↓
Wave 4 — Generate Assessment Items; Construct Sequence; foundation pack trim
```

**Validation:** [38B-6 checklist](fixtures/probe-38B-6-regression-validation-checklist.md) per PR; Inflation **mandatory**; PREC-01–04 on L4/L6 changes.

**Intervention order for table fidelity:** GAM → Design Page layer 4 → 38B-6 anchors — not renderer.

---

## 7. Sprint 39 gate conditions

Sprint 39 (reasoning cue specification) stays **deferred** until **all** of the following:

| # | Condition | Evidence |
|---|-----------|----------|
| 1 | 38B **planning** closed | This document + 38B-7 §12 |
| 2 | 38B **implementation programme** exit | [38B-6 §7.5](observations/38B-6-regression-validation-plan.md#75-programme-completion-38b-implementation-exit) |
| 3 | Waves 1–3 complete | Design Page ≤22k aug; ≤3 markers; Inflation PREC + L4 pass |
| 4 | B4-01/B4-02 closed or programme-lead waiver with rollback plan | 38B-4 case matrix |
| 5 | New Sprint 39 instructions slot into **L5–L6** with taxonomy PR | 38B-7 MR-01, MR-09 |
| 6 | No unbounded append | 38B-7 GAP-01–GAP-06 |

**Planning close alone does not ungate Sprint 39.**

---

## 8. Sign-off

| Role | Name | Date |
|------|------|------|
| Programme lead | | |
| LD architecture maintainer | | |
| Materials fidelity owner | | |

**Recorded decisions (2026-06-04):**

- Planning phase closed; implementation not auto-started.  
- Sprint 38 architecture remains frozen.  
- Table fix order: `LD-TABLE-FIDELITY` → GAM → Design Page.  

---

## 9. Pointers

| Audience | Start here |
|----------|------------|
| Implementation lead | [38B-5](observations/38B-5-workflow-wide-review.md), [38B-6](observations/38B-6-regression-validation-plan.md), [checklist](fixtures/probe-38B-6-regression-validation-checklist.md) |
| Prompt authors | [38B-7](observations/38B-7-governance-and-maintenance.md) MR/GAP/CC |
| Table regression | [38B-4](observations/38B-4-materials-and-table-fidelity.md) |
| Design Page target shape | [38B-3](observations/38B-3-design-page-consolidation-plan.md) |
| Next chat | [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) |
