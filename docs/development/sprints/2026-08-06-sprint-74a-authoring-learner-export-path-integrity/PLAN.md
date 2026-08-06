# Sprint 74A — Plan

**Status:** **OPEN** (2026-08-06)  
**Theme:** Authoring → Learner Export Path Integrity — sole / definitive vNext learner renderer  
**Charter:** [SPRINT-74A-CHARTER.md](SPRINT-74A-CHARTER.md)  
**Programme principle:** [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality)  
**Sole-renderer decision:** [S74A-D02](decisions.md#s74a-d02--vnext-replaces-the-obsolete-learner-renderer)  
**Constraints:** [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md)

Task IDs: `S74A-T-###`. Decision IDs: `S74A-D##` in [decisions.md](decisions.md).

Acceptance criteria AC-01…AC-15: [SPRINT-74A-CHARTER.md](SPRINT-74A-CHARTER.md).

---

## Execution order

```text
S74A-T-001 (pack init) ✅
  → S74A-T-010 (docs audit — Supported/Compatibility posture at the time) ✅
    → S74A-T-020 (vNext generated browser artefact integrity) ✅
      → S74A-T-030 (definitive vNext production-browser baseline) ✅
      → S74A-T-040 (obsolete renderer responsibility and removal inventory) ✅
      → S74A-T-042 (activity-beat/task interleaving definitive-path repair) ✅
      → S74A-T-045 (remove obsolete learner-renderer implementation) ← next
      → S74A-T-050 (sole-renderer verification and sprint closure)
```

T-042 completed after T-040 and **blocked T-045** until corrected interleaving had production-browser evidence. T-045 may now proceed via inventory slices S1–S8, preserving T-030 §8 **and** §8a / T-042 interleaving. T-050 closes only when AC-01…AC-15 are evidenced.

---

## Tasks

### S74A-T-001 — Sprint pack initialisation

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-06) |
| **Ownership** | Sprint documentation |
| **Approach** | Create 74A pack; link parent constraints and Domain A; record `S74A-D01` |
| **Acceptance** | Pack files present; relative links valid |
| **Verification** | Link/consistency check |

---

### S74A-T-010 — Supported export-path documentation audit and alignment

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-06) |
| **Ownership** | Documentation / architecture narrative |
| **Approach** | Audited claims vs implementation; documented vNext as Supported and the old renderer as Compatibility under the **then-current** posture |
| **Acceptance** | Historical — accurate for that time; **target superseded** by `S74A-D02` |
| **Verification** | [S74A-T-010-supported-export-path-documentation-audit.md](S74A-T-010-supported-export-path-documentation-audit.md) |
| **Note** | Do not falsify T-010. Add/keep dated supersession notes. Product docs reconciled to sole implementation in T-045/T-050. |

---

### S74A-T-020 — vNext generated browser artefact integrity

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-06) |
| **Ownership** | Development/test tooling + browser-loaded renderer artefact |
| **Surfaces** | `lib/learner-renderer-vnext/*`; `lib/learner-renderer-vnext-browser.js`; build + check scripts; npm scripts; architecture docs |
| **Approach** | Document single source/builder/artefact/load path; add freshness gate; no obsolete-renderer or export-behaviour changes |
| **Acceptance** | AC-04; contributes to AC-12, AC-13 |
| **Verification** | [S74A-T-020-vnext-generated-browser-artefact-integrity.md](S74A-T-020-vnext-generated-browser-artefact-integrity.md) |
| **Dependencies** | T-010 Done |

---

### S74A-T-030 — Definitive vNext production-browser baseline

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-06) |
| **Ownership** | Authoring export verification |
| **Surfaces** | Assemble; Preview; standalone HTML; learner ZIP; Open in New Tab; Workflow Resources panes; page fixture |
| **Approach** | Production browser path verification + separate Node supporting evidence; document behavioural baseline for T-045/T-050 |
| **Acceptance** | Contributes to AC-05, AC-11, AC-12, AC-13 |
| **Verification** | [S74A-T-030-production-browser-baseline.md](S74A-T-030-production-browser-baseline.md) |
| **Dependencies** | T-020 Done |

---

### S74A-T-040 — Obsolete renderer responsibility and removal inventory

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-06) |
| **Ownership** | Definitive-codebase removal design |
| **Approach** | Complete code-level inventory of every old-renderer surface. For each: file; function/symbol; caller; responsibility; vNext replacement; shared?; test-only?; unreachable?; removal action; verification protecting removal. Classify: **remove** · **retain as shared** · **move to definitive owner** · **rename** · **investigate**. Produce the **exact removal plan** (slices S1–S8). Do **not** default to retaining code as Compatibility. |
| **Acceptance** | AC-06; enables AC-07…AC-10 |
| **Verification** | [S74A-T-040-obsolete-renderer-responsibility-removal-inventory.md](S74A-T-040-obsolete-renderer-responsibility-removal-inventory.md) |
| **Dependencies** | T-030 Done; **must** complete before T-045 |
| **Runtime** | **Unchanged** (docs/inventory only) |

---

### S74A-T-042 — Activity-beat/task interleaving provenance and definitive-path repair

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-06) |
| **Ownership** | Definitive vNext compose/parse path |
| **Approach** | Reproduce from fresh artefacts; layer trace; repair sole owner (`parse-learner-task` + `compose-generic-moments`); strengthen ordering regression tests; production-browser verify; qualify T-030; refine T-040/T-045 notes. Do not begin T-045 in the same change. |
| **Acceptance** | Corrected interleaving on production browser path; one definitive owner; no Legacy involvement |
| **Verification** | [S74A-T-042-activity-task-interleaving-definitive-path-repair.md](S74A-T-042-activity-task-interleaving-definitive-path-repair.md) |
| **Dependencies** | After T-040; **blocked T-045** until Done |

---

### S74A-T-045 — Remove obsolete learner-renderer implementation

| Field | Content |
| ----- | ------- |
| **Status** | **Not started** |
| **Ownership** | Authoring page-export / renderer codebase |
| **Approach** | Execute the T-040 removal plan. Expected where evidenced: remove Authoring renderer selector; remove renderer-version state used only for obsolete selection; route page export directly to vNext; remove obsolete branches/fallbacks/implementation/exclusive helpers/globals/script loading; remove tests/fixtures protecting only obsolete behaviour; remove obsolete docs/comments; narrowly rename misleading terminology; update focused tests for the single path. Do **not** retain dead code behind flags, comments, hidden selectors, or unreachable branches. Do **not** create an in-tree archive/compatibility module. Repository history preserves deleted code. |
| **Acceptance** | AC-02, AC-03, AC-07, AC-08, AC-09, AC-10, AC-11, AC-15 |
| **Verification** | Diff vs T-040 plan; focused tests; no reachable obsolete path |
| **Dependencies** | T-030 Done; T-040 Done |

---

### S74A-T-050 — Sole-renderer verification and sprint closure

| Field | Content |
| ----- | ------- |
| **Status** | **Not started** |
| **Ownership** | Sprint closure |
| **Approach** | After removal: confirm no user-facing choice, no reachable obsolete branch, no obsolete script loaded, no runtime symbol depends on removed implementation; Preview/HTML/ZIP/Open in New Tab and required resources via vNext; generated artefact current; focused Node suites pass (evidence only); production browser path passes; static deployment intact; docs describe one renderer only; searches find no misleading active references to obsolete-renderer availability. Prepare closure only when AC-01…AC-15 evidenced. |
| **Acceptance** | AC-01, AC-05, AC-11…AC-15; prior task ACs met; 74B/74C not opened |
| **Verification** | Evidence pack + STATUS complete |
| **Dependencies** | T-020…T-045 Done |

---

## Explicit non-scope (plan)

See charter. Removal of the obsolete learner renderer is an **intended outcome** of T-040 → T-045 under `S74A-D02` / `S74-D07` — evidence-led, not indiscriminate, and not Compatibility retention by default.
