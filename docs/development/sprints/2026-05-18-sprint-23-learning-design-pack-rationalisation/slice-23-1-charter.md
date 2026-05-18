# Sprint 23 Slice 23-1 — LD pack inventory + semantics matrix (placeholder)

**Date:** 2026-05-18  
**Status:** **Proposed — not chartered**  
**Sprint:** 23 — Learning Design pack rationalisation  
**Slice:** 23-1

**Bootstrap:** [`sprint-23-bootstrap.md`](sprint-23-bootstrap.md)  
**Predecessor baseline:** Sprint 22 — **185 tests** documented — [`../2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md`](../2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md)

---

## Objective (proposed)

Produce an **inventory and semantics matrix** of the Learning Design domain pack: `requiredFactors`, `optionalFactors`, `mappingRules`, `workflowParameterControls`, `stepParameterControls`, and Prompt Factory `userOptions` — without mandatory pack edits in this slice.

**Thesis (slice):** *You cannot rationalise metadata until every semantic surface is visible in one matrix.*

---

## Scope (proposed)

| In scope | Detail |
|----------|--------|
| **Pack inventory** | All workflow/step controls and brief factors |
| **mappingRules trace** | Targets vs declared controls — gaps and duplicates |
| **PF surface list** | `userOptions` per canonical step |
| **Semantics matrix** | Term → storage → UI surface → downstream consumer |
| **Design Assessment row** | Priority section in matrix |
| **Deliverable** | Markdown artefact in sprint pack or `docs/audits/` (charter decides path) |

| Out of scope (later slices) | Detail |
|-----------------------------|--------|
| Pack metadata edits | Slice **23-6** |
| Runtime bespoke removal | Slice **23-3** / **23-5** + chartered runtime |
| Elicitation code changes | Slice **23-2** |
| Unified Settings changes | **Forbidden** — Sprint 22 preserved |

---

## Verification (expected at charter)

```bash
node --test tests/*.test.js
```

**Floor:** **185+** passed, 0 failed (inventory slice should not reduce tests).

---

## Handoff (proposed)

- **23-2:** Elicitation classification using matrix `elicitation` column  
- **23-3:** Bespoke PF audit keyed off matrix gaps  
- **23-5:** Design Assessment deep-dive expands matrix section  

---

## Charter checklist (before implementation)

- [ ] Confirm deliverable path and naming  
- [ ] Confirm LD-only scope (Research frozen)  
- [ ] Confirm no runtime edits in 23-1  
- [ ] Approve matrix column schema  
