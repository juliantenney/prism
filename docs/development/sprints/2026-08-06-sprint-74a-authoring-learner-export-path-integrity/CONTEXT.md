# Sprint 74A — Context

**Status:** **COMPLETE / Closed** (closed 2026-08-06)  
**Role:** Durable context for the sole learner-renderer architecture delivered by Sprint 74A  
**Parent:** Sprint 74 wrapper — **OPEN**; 74B/74C not opened  
**Programme principle:** [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality)  
**Sole renderer:** [S74A-D02](decisions.md#s74a-d02--vnext-replaces-the-obsolete-learner-renderer)

---

## Why this sprint existed

Sprint 74A established **one definitive learner-renderer implementation** around existing Authoring → export functionality. vNext is the architecture. The previous renderer was **obsolete** and has been removed.

---

## Final architecture

| Kind | State |
| ---- | ----- |
| **Sole learner-page renderer** | vNext — Authoring → Preview / HTML / ZIP / Open in New Tab via `runLearnerRendererVNextExport` |
| **Obsolete learner-page path** | Removed (T-045); residue cleaned (T-050) |
| **Non-page structured HTML** | `slide_deck` via `runUtilityRendererByPlan` → `buildUtilityStructuredHtml` |

Do not use **Compatibility** for the old renderer except historically (e.g. T-010-era classification).

---

## Binding constraints

[ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md) — browser-only; static deployment; one definitive implementation (`S74-D07`); `app.js` by ownership.

---

## Key surfaces

| Surface | Role |
| ------- | ---- |
| `lib/learner-renderer-vnext/*` + `learner-renderer-vnext-browser.js` | Sole learner-page renderer (source + generated artefact) |
| `scripts/build-learner-renderer-vnext-browser.js` | **One** generation mechanism |
| `npm run check:learner-renderer-vnext-browser` | Freshness gate (T-020) |
| `app.js` page-export pipeline | Unconditional vNext |
| `buildUtilityStructuredHtml` | Non-page / `slide_deck` only (pages rejected) |
| Export architecture docs | Sole-renderer narrative |

---

## Durable facts from S74A-T-010 (historical)

At audit time, Authoring defaulted to vNext while the old renderer remained selectable (then labelled Compatibility). Evidence report retained with **supersession** to sole-implementation / removal target (`S74A-D02`).

---

## Verification posture

- **T-030** — pre-removal production-browser + Node-based baseline  
- **T-050** — post-removal sole-renderer production-browser verification  
- Node-based tests = supporting evidence only  

---

## Engineering disciplines adopted during Sprint 74A

Implementation working practices evidenced by **T-020** and **T-030** (not new product architecture):

1. **Every verification claim requires explicit provenance.**
2. Generated browser artefacts must pass the freshness check (`npm run check:learner-renderer-vnext-browser`) before browser-facing verification.
3. Browser evidence must use the normal static `index.html` production path.
4. Node-based tests are supporting evidence, not deployment proof.
5. Existing exported HTML, ZIPs, screenshots, snapshots and fixtures are not current evidence unless regenerated and their provenance is recorded.
6. Controlled fixtures may provide inputs, but derived renderer output must be freshly generated.
7. A behavioural baseline must be established before removing an implementation (T-030 §8 before T-045).
8. Repository history is the archive; obsolete active-code implementations should not be retained solely for historical reference.
9. Cleanup includes a repository-wide residue sweep covering code, state, UI, tests, fixtures, scripts, styles, comments and documentation.
10. Every remaining residue match must be removed, reassigned to a current owner, renamed, or explicitly deferred with a reason.

### Known evidence limitations (T-030)

- **Assemble-from-current-run** was not exercised end-to-end because the saved run did not contain runnable prompts; the control and surrounding production path were observed. This was **not** treated as product failure; it remains a known evidence limitation for T-050 re-check.
- **Sprint-70 E4** Node suite failures were classified as stale `app.js?v=` test drift, **not** production-path failure. Do not treat them as removal blockers; do not fix that drift under T-040/T-045 renderer-removal work.

### Durable inventory finding (T-040) — superseded by T-045 for reachability

- **Pre-T-045:** Obsolete page renderer was reachable via Authoring `#utilitiesRendererVersion=legacy` → non-vNext branch of `runUtilityPageExportPipeline` → `buildUtilityStructuredHtml`.  
- **Post-T-045:** That path is **removed**. Pages always use vNext. See [S74A-T-045-obsolete-learner-renderer-removal.md](S74A-T-045-obsolete-learner-renderer-removal.md).  
- **`buildUtilityStructuredHtml` remains** for non-page **`slide_deck`** — retain that owner; do not delete the function wholesale.  
- No durable localStorage/IndexedDB renderer preference existed; selector removal + unconditional vNext was governed by **S74A-D02**.

### Durable ownership finding (T-042)

- **Activity-beat/task interleaving** is owned by vNext `parse-learner-task.js` (clause identity) and `compose-generic-moments.js` (Learn/Do placement). Not by Legacy/`buildUtilityStructuredHtml`.
- Unnumbered sequential `learner_task` clauses (`Then` / `Finally` / …) must split so study clauses stay with Learn materials and production clauses stay in Do.
- T-030 §8a qualifies aggregate terminal **Your task** as a regression, not required baseline.
---

## Predecessor links (only)

| Kind | Link |
| ---- | ---- |
| Discovery | [S74-T-001](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-001-codebase-rationalisation-discovery.md) |
| Domain refinement | [S74-T-010](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-010-rationalisation-domain-refinement.md) |
| vNext architecture | [learner-renderer-vnext.md](../../../architecture/learner-renderer-vnext.md) |
| PB-FA-003 | [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-003--pipeline-integrity) |
