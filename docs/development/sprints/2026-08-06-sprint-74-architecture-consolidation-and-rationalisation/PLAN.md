# Sprint 74 — Plan

**Status:** **OPEN** (2026-08-06) — discovery / planning refinement complete; implementation sub-sprints not opened  
**Theme:** Architecture Consolidation and Rationalisation  
**Charter:** [SPRINT-74-CHARTER.md](SPRINT-74-CHARTER.md)  
**Planning principle:** A backlog item should only enter a sprint when it has a concrete implementation approach, clear ownership and acceptance criteria.  
**Binding constraints:** [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) (`S74-D03`…`S74-D05`)

Task IDs: `S74-T-###`. Decision IDs: `S74-D##` in [decisions.md](decisions.md).

**Implementation is not assumed.** Sprint 74A / 74B / 74C are **not opened**. Opening 74A requires **operator approval**.

All 74A–C work (when opened) must preserve **browser-only runtime**, **static deployment**, **one supported path** labelling, and **ownership-based** `app.js` changes — not size-driven splits.

---

## Phase 1 — Codebase rationalisation discovery (committed)

| ID | Task | Status | Notes |
| -- | ---- | ------ | ----- |
| S74-T-001 | Codebase Rationalisation Discovery — map supported architecture, runtime path, ownership, schemas, bundles, tests; classify findings; recommend 74A/B/C domains | **Done** | [S74-T-001-codebase-rationalisation-discovery.md](S74-T-001-codebase-rationalisation-discovery.md) |

---

## Phase 2 — Domain sequencing (committed)

| ID | Task | Status | Notes |
| -- | ---- | ------ | ----- |
| S74-T-010 | Prioritise and refine recommended domains into planning-ready candidates | **Done** | [S74-T-010-rationalisation-domain-refinement.md](S74-T-010-rationalisation-domain-refinement.md) · `S74-D02` |
| S74-T-011 | Draft acceptance-criteria / readiness notes for the first selected domain (optional precursor to opening 74A) | **Not started** | Optional — Domain A AC outline already in T-010; use only if operator wants a thinner seed before pack open |

---

## Explicit non-scope (this plan)

- Runtime deletion / consolidation / rename / refactor  
- Opening Sprint 74A / 74B / 74C implementation packs (gated on operator approval)  
- PB-FA-002 programming resources  
- PB-FA-004 manually uploaded graphics (product backlog)  
- Reconstructing predecessor sprint histories  

---

## Execution order

```text
S74-T-001 (discovery) ✅
  → S74-T-010 (domain refinement) ✅
  → operator approval
  → Open Sprint 74A (separate pack) — NOT started
  → later 74B → 74C (not opened)
```

---

## Recommended domains (refined — not opened)

See [S74-T-010](S74-T-010-rationalisation-domain-refinement.md):

| Order | Domain | Theme |
| ----- | ------ | ----- |
| 74A | Authoring → learner export path integrity | Docs + production browser-path / generated-artefact verification + Legacy inventory |
| 74B | Generation-contract & capture-validator hygiene | Deprecated/legacy generation surfaces |
| 74C | Repository & fixture hygiene | Scratch audit + PB-S-001 fixtures |
