# Sprint 74A — Next-chat briefing

**Pack status:** **OPEN** — T-001/T-010 Done; **S74A-D02 Accepted**; next **T-020**  
**Mission:** Sole / definitive vNext learner renderer; remove obsolete renderer  
**Decisions:** `S74A-D01` · **`S74A-D02`** · parent **`S74-D07`**  
**Constraints:** [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md)

---

## One-line mission

**Begin S74A-T-020** when authorised — vNext generated browser artefact integrity. Then baseline (T-030), removal inventory (T-040), remove obsolete implementation (T-045), verify/close (T-050).

---

## Read first

1. [SPRINT-74A-START-HERE.md](SPRINT-74A-START-HERE.md)  
2. [decisions.md](decisions.md) — **`S74A-D02`**  
3. [SPRINT-74A-CHARTER.md](SPRINT-74A-CHARTER.md) · [PLAN.md](PLAN.md) · [STATUS.md](STATUS.md)  

---

## Sequence

1. ~~T-010~~ Done (Compatibility-era audit; superseded as *target*)  
2. **T-020** artefact integrity ← **next**  
3. **T-030** definitive production-browser baseline  
4. **T-040** obsolete renderer responsibility + exact removal plan  
5. **T-045** remove obsolete learner-renderer implementation  
6. **T-050** sole-renderer verification + closure (AC-01…AC-15)  

---

## Hard rules

- One definitive codebase (`S74-D07`) — removal is the intended outcome when covered  
- Evidence-led; do not retain obsolete renderer as Compatibility by default  
- No dead flags / in-tree archive  
- Node-based tests ≠ deployment proof  
- No 74B/74C; no schema redesign; no size-driven `app.js` split  

---

## Terminology

definitive implementation · sole learner renderer · obsolete / superseded renderer · production browser path · generated browser artefact · Node-based test evidence
