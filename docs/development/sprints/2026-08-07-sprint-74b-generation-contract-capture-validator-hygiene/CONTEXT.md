# Sprint 74B — Context

**Status:** **OPEN** (opened 2026-08-07)  
**Role:** Durable context for generation-contract & capture-validator hygiene  
**Parent:** Sprint 74 wrapper — **OPEN**; 74C **Not opened**  
**Programme principle:** [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality) · [S74-D09](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d09--pre-release-compatibility-is-not-a-default-requirement)  
**Predecessor:** [Sprint 74A](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/SPRINT-74A-FINAL-REPORT.md) — sole vNext learner export **closed**

---

## Why this sprint exists

Sprint 74B applies `S74-D07` to **generation surfaces**: prompt builders, generation contracts, capture validators, and compose / partial roles. Sprint 74A proved that duplicate **ownership** inside a supported path can be as harmful as obsolete implementations. Domain B therefore begins with architectural discovery and an **ownership inventory**, not deletion.

**Pre-release Compatibility (`S74-D09` / `S74B-D03`):** Old local workflows/runstate do **not** block rationalisation. Preserve current intended functionality and current supported contracts — not historical pre-release shapes.

---

## Architectural baseline (T-010)

[S74B-T-010-generation-pipeline-architectural-discovery.md](S74B-T-010-generation-pipeline-architectural-discovery.md) is the authoritative pre-renderer pipeline map for the remainder of Sprint 74B.

Durable facts:

- “Generation” names **multiple** responsibilities (workflow design LLM, prompt/contract assembly, external capture, deterministic page assembly, learner HTML).  
- Domain B hygiene targets **prompt/contract & capture-validation** — not Create Workflow redesign or the learner renderer.  
- Four live `{ legacy: true }` always-pass capture shims; PR-W\* deprecated aliases remain on the test API.  
- Operator A/B/C clusters are storytelling aids; ownership work uses the finer phase list in T-010.  

---

## Compose vs partial (T-020 + S74B-D02 / D03)

[S74B-T-020](S74B-T-020-compose-vs-partial-contract-role-documentation.md) · [S74B-D02](decisions.md#s74b-d02--partial--deterministic-assemble-is-the-sole-definitive-page-construction-architecture) **Accepted** · [S74B-D03](decisions.md#s74b-d03--historical-pre-release-workflowrunstate-compatibility-does-not-block-rationalisation) **Accepted**

| Path | Role |
| ---- | ---- |
| **Partial + `assembleVNextPageFromPartials`** | **Sole definitive** supported page-construction architecture |
| **Full Design Page compose** | **Obsolete** — removal planned in [T-030](S74B-T-030-deprecated-helper-compose-legacy-validator-removal-plan.md); not yet executed; **no** rollback Compatibility requirement |
| **`partialPageOutputs: false`** | **Obsolete** unless a current supported responsibility is evidenced — not retained for old local state |
| **Legacy `{ ok: true, legacy: true }` shims** | Fail-closed authorised; no migration solely for historical runstate |

Design Page partial owns title / `page_synthesis` / visual planning. Activities, materials, sequence, and assessment content are owned by upstream partials + assemble + P11a.

---

## Authoritative domain planning

[S74-T-010 Domain B](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-010-rationalisation-domain-refinement.md#domain-b--generation-contract--capture-validator-hygiene-recommended-sprint-74b) — historical planning text preserved; post-74A methodology refinement (2026-08-07) governs execution order.

---

## Binding constraints

[ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md) — browser-only; static deployment; one definitive implementation (`S74-D07`); pre-release Compatibility not default (`S74-D09`); `app.js` by ownership.

---

## Engineering disciplines (inherited)

**Do not duplicate** the full text. All 74B work inherits:

[ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)

Architectural constraints define what Prism must remain; Engineering Disciplines define how consolidation work is carried out safely.

Key practices for 74B:

- **Ownership before change** — inventory duplicate ownership, not only duplicate code  
- **Inventory before removal** — trace callers, browser/test/dynamic access  
- **Baseline before removal** — supported prompt behaviour must be understood before thinning surfaces  
- **Small reversible commits** — one slice per commit; every intermediate commit must stay green; retarget tests before/with module deletion  

---

## Key surfaces (from S74-T-010)

| Surface | Role |
| ------- | ---- |
| `app.js` deprecated PR-W* prompt wrappers | Hygiene / ownership investigation |
| `app.js` legacy capture validator returns | Obsolete pre-release shims — fail-closed planned (S74B-D03); not Compatibility retention |
| `lib/ld-*-contract.js` | Contract boundaries |
| Compose vs partial Design Page modules | Compose obsolete (D02); removal planned |
| Focused generation/contract tests | Guardians of **current** intended behaviour |

---

## Out of scope (unchanged from Domain B)

- Learner-renderer-vNext / Authoring export (74A closed)  
- Workflow Resources persistence  
- Prompt Library product model  
- Repository / fixture hygiene (**74C**)  
- Pedagogy redesign  

---

## Predecessor links

| Kind | Link |
| ---- | ---- |
| Sprint 74A outcome | [SPRINT-74A-FINAL-REPORT.md](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/SPRINT-74A-FINAL-REPORT.md) |
| Discovery | [S74-T-001](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-001-codebase-rationalisation-discovery.md) |
| Domain refinement | [S74-T-010](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-010-rationalisation-domain-refinement.md) |
| Partial PB-S-004 | [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md) |

---

## Verification posture

- Primary evidence: focused contract/generation **Node-based** suites  
- Authoring export: **unchanged** — spot-check only if a touched surface might affect browser-loaded prompt paths  
- Production browser path: mandatory check before deleting surfaces that might still load in the browser  

---

## Known risks (from programme)

- **Silent prompt drift** — mitigated by call-path tracing and golden prompts  
- **Silent ownership drift** — mitigated by ownership inventory and matrix before merge  
