# Sprint 74A — Decision Log

**Sprint status:** **COMPLETE / Closed** (2026-08-06)  
**Format:** ID · Decision · Status · Rationale · Consequences  

Inherited programme constraints are **linked, not duplicated** — [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md); parent decisions `S74-D01`…`S74-D07`.

---

## S74A-D01 Open Sprint 74A for Authoring → learner export path integrity

- **Decision:** Operator approval has **opened Sprint 74A** — Authoring → Learner Export Path Integrity. The sprint implements **Domain A** from [S74-T-010](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-010-rationalisation-domain-refinement.md), as recommended by parent [S74-D02](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d02-recommended-first-implementation-domain--authoring-export-path-integrity). Sprint 74 architectural constraints (`S74-D03`…`S74-D05`) remain **binding**. Sprint 74A does **not** remove Legacy runtime code. Sprint 74A does **not** open Sprint 74B or 74C. Further implementation decisions discovered during the sprint must be recorded separately with evidence.
- **Status:** Accepted (2026-08-06) — **superseded for renderer retention** by [S74A-D02](#s74a-d02--vnext-replaces-the-obsolete-learner-renderer). Opening of Sprint 74A and exclusion of 74B/74C remain in force.
- **Rationale:** Parent programme completed discovery and domain refinement; operator authorised the first implementation slice. Opening a bounded pack with explicit non-scope prevents Legacy deletion or scope bleed into 74B/74C.
- **Consequences:** Implementation proceeds under [PLAN.md](PLAN.md) starting at `S74A-T-010`; production browser-path evidence is required for deployment confidence; Node-based tests remain evidence only; parent Sprint 74 stays open as the governing wrapper. *(Subsequent operator direction: see S74A-D02.)*

---

## S74A-D02 — vNext replaces the obsolete learner renderer

- **Decision:** **vNext is the sole learner-renderer architecture.** The previous renderer is **obsolete**, not an ongoing Compatibility requirement. Sprint 74A will **remove** the obsolete renderer implementation after its invocation and responsibility inventory is complete. User-facing renderer selection will be removed. Page-export routing and fallbacks will converge **unconditionally** on vNext. Obsolete renderer-specific code, tests, and documentation will be removed where no current responsibility remains. Shared helpers or non-renderer functionality must be retained or moved only when evidence shows they remain required. Existing Authoring, Preview, HTML, ZIP, Open-in-New-Tab, and resource-rendering functionality must remain intact. Static deployment and browser-only runtime remain binding. This applies programme principle [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality). It **supersedes** the earlier Sprint 74A assumption (in `S74A-D01`, Domain A refinement, and T-010 documentation posture) that the old renderer would remain as selectable Compatibility, and strengthens any same-day draft that framed retirement without stating **removal of the obsolete implementation** as the intended outcome.
- **Status:** Accepted — **binding** (2026-08-06)
- **Rationale:** Operator definitive direction: establish one definitive codebase around existing functionality. There is no product or architectural requirement to retain the old renderer as Compatibility. Historical existence is not a compatibility requirement.
- **Consequences:** Charter/plan/ACs target sole implementation and removal. Sequence: artefact integrity (T-020) → definitive production-browser baseline (T-030) → obsolete-renderer responsibility/removal inventory (T-040) → remove obsolete implementation (T-045) → sole-renderer verification and closure (T-050). Do not retain dead code behind flags, hidden selectors, unreachable branches, or an in-tree archive copy. Do not default inventory items to Compatibility retention. Unrelated 74B/74C, schema redesign, and size-driven `app.js` work remain out of scope.

---

## Pending decisions

None. Sprint 74A closed under `S74A-D02` / `S74-D07`. `slide_deck` remains owned by `buildUtilityStructuredHtml`. No further 74A decisions required.
