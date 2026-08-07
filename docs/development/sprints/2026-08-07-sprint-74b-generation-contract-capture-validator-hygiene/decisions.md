# Sprint 74B — Decision Log

**Sprint status:** **OPEN** (2026-08-07)  
**Format:** ID · Decision · Status · Rationale · Consequences  

Inherited programme constraints are **linked, not duplicated** — [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md); parent decisions `S74-D01`…`S74-D09`.

Inherited working practice — [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md) *(not duplicated here)*.

---

## S74B-D01 Open Sprint 74B for Generation-contract & capture-validator hygiene

- **Decision:** Operator approval has **opened Sprint 74B** — Generation-contract & capture-validator hygiene. The sprint implements **Domain B** from [S74-T-010](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-010-rationalisation-domain-refinement.md), as sequenced after Sprint 74A closure. Sprint 74 architectural constraints (`S74-D03`…`S74-D05`, `S74-D07`) and [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md) remain **binding**. Sprint 74B does **not** open Sprint 74C. The first implementation task is **ownership-first investigation** (`S74B-T-010`). Pack initialisation (`S74B-T-001`) does **not** begin runtime implementation.
- **Status:** Accepted (2026-08-07)
- **Rationale:** Sprint 74A closed with sole vNext learner export verified. Domain B planning and post-74A methodology refinement establish ownership inventory before removal. Opening a bounded pack with explicit non-scope prevents export-path regression and 74C scope bleed.
- **Consequences:** Implementation proceeds under [PLAN.md](PLAN.md) starting at `S74B-T-010` when authorised. Removal or consolidation follows ownership proof. Authoring export remains out of scope. Parent Sprint 74 stays open as programme wrapper. Further decisions discovered during the sprint must be recorded as `S74B-D##` with evidence.

---

## S74B-D02 — Partial + deterministic assemble is the sole definitive page-construction architecture

- **Decision:** For Learning Design Sprint 58 page-pipeline workflows, the **sole definitive page-construction architecture** is:
  1. **`lib/ld-design-page-partial-contract.js`** (`LD-DESIGN-PAGE-PARTIAL-CONTRACT`) as the supported Design Page contract;
  2. stage partial captures under `partialPageOutputs` + `pageEnrichmentV2`;
  3. deterministic final page merge owned by **`assembleVNextPageFromPartials`** (`PRISM_PAGE_VNEXT_ASSEMBLE`);
  4. post-assembly composition validation (P11a) before renderer hand-off.

  Full compose via **`lib/ld-design-page-compose-contract.js`** (`LD-DESIGN-PAGE-COMPOSE-CONTRACT`) and its `app.js` inject/apply path is **obsolete residue**, not a current Compatibility product requirement.

  Newly created supported Learning Design workflows use the partial architecture (`handleSaveDesignedWorkflow` forces both flags true). Load migration/defaulting (`migrateWorkflowToSprint58PageArtefactContract`) converges supported persisted Learning Design page-pipeline workflows onto the partial architecture. No current required supported behaviour is compose-only.

  Full compose may still be reachable through tests or explicitly forced in-memory state (`partialPageOutputs: false`); that does **not** make it a supported product path. Obsolete compose surfaces should be removed once `S74B-T-030` proves exact callers, dependent tests, migration implications, and ownership hand-offs. Repository history preserves the retired implementation; active code should not retain it solely for history.

  This decision applies programme principle [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality) and is evidenced by [S74B-T-020](S74B-T-020-compose-vs-partial-contract-role-documentation.md).

- **Status:** **Accepted** (2026-08-07)
- **Rationale:** T-020 proved partial + assemble is the supported architecture; compose is obsolete but still reachable; historical existence is not a Compatibility requirement.
- **Consequences:** T-030 plans removal/consolidation under this decision. T-040 may execute only after the plan is complete and slices are authorised. Active docs treat compose as obsolete, not as an ongoing choice.

### S74B-D02 does **not** authorise

- Immediate removal in the decision-recording change itself  
- Rewrite of deterministic assembly (`assembleVNextPageFromPartials`)  
- Pedagogy redesign  
- Renderer / Authoring export-path changes (Sprint 74A closed)  
- Workflow-formation / Create Workflow product redesign  
- Sprint 74C work  

---

## S74B-D03 — Historical pre-release workflow/runstate Compatibility does not block rationalisation

- **Decision:** Under programme [S74-D09](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d09--pre-release-compatibility-is-not-a-default-requirement) and [S74B-D02](#s74b-d02--partial--deterministic-assemble-is-the-sole-definitive-page-construction-architecture):

  - `partialPageOutputs: false` does **not** need to remain a supported mode merely for old local state;  
  - compose rollback paths do **not** need preservation;  
  - the four `{ ok: true, legacy: true }` capture-validator shims do **not** need to accept old shapes solely for historical runstate;  
  - tests protecting obsolete pre-release shapes should be **removed or rewritten** against the definitive current architecture;  
  - old locally persisted runstate may **fail** and require **re-run / re-capture**;  
  - **no migration layer** should be added purely to preserve obsolete pre-release state unless a current product requirement is discovered.

  Current intended functionality, supported partial contracts, deterministic assemble, and modern capture shapes remain the preservation target.

- **Status:** **Accepted** (2026-08-07)
- **Rationale:** Applies S74-D09 to Domain B surfaces inventoried in T-010/T-020/T-030.
- **Consequences:** T-030 plan reconciled; T-040 may fail-close obsolete modes without Compatibility migrations. Removals still require ownership evidence and green intermediate commits.

---

## Pending decisions

| Topic | Expected trigger |
| ----- | ---------------- |
| Exact T-040 commit execution | Operator authorises T-040 against reconciled [T-030](S74B-T-030-deprecated-helper-compose-legacy-validator-removal-plan.md) |
| Open Sprint 74C | After 74B closure or operator resequence |

Do not execute removals without the T-030 plan and focused verification per Engineering Disciplines.
