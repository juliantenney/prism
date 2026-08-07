# Sprint 74C — Decision Log

**Sprint status:** **OPEN** (2026-08-07) — inventory + decisions Done; execution plan next  
**Format:** ID · Decision · Status · Rationale · Consequences  

Inherited programme constraints are **linked, not duplicated** — [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md); parent decisions `S74-D01`…`S74-D09`.

Inherited working practice — [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md) *(not duplicated here)*.

Scope authority — [S74-programme-post-74B-review.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-programme-post-74B-review.md) (narrowed R1). Do **not** rewrite that review.

Retention matrix — [S74C-T-020-retention-and-deletion-decisions.md](S74C-T-020-retention-and-deletion-decisions.md).

---

## S74C-D01 Open Sprint 74C for Repository Hygiene & Historical Residue Rationalisation

- **Decision:** Operator approval has **opened Sprint 74C** — Repository Hygiene & Historical Residue Rationalisation — as the **final narrowed** Sprint 74 hygiene phase. Scope follows post-74B review option **R1**: reference-audited scratch/archive/probe classification and cleanup only. **PB-S-001**, WR orphan cleanup, and **PB-FA-004** are **excluded**. This is **not** an architectural redesign sprint and **not** original Domain C unchanged. Sprint 74 remains the open programme wrapper. Sprint 74A and 74B remain **COMPLETE / Closed**. Sprint 75 remains **not opened**. Pack initialisation (`S74C-T-001`) does **not** begin inventory execution or deletions. First implementation task when authorised: **S74C-T-010** (inventory only).

- **Status:** **Accepted** (2026-08-07)

- **Rationale:** Supported page-spine ownership was consolidated in 74A/74B. Remaining Sprint 74 value is repository cleanliness before UI work. Post-74B review forbade unchanged Domain C because PB-S-001 is not sprint-ready and hygiene ≠ architecture.

- **Consequences:** Work proceeds under [PLAN.md](PLAN.md) starting at `S74C-T-010` when authorised. No product behaviour changes. If a hygiene action requires product-behaviour reasoning, **stop and report**. Further decisions: `S74C-D##`.

---

## S74C-D02 Git history is the default archive; active copies need current operational justification

- **Decision:** For Sprint 74C hygiene (and as standing repository policy after 74C unless superseded):

  1. **Git history** is the **default historical archive**.
  2. Active repository copies of historical material require a **current operational justification** (active tooling, authoritative sprint evidence, certification artefacts, current fixtures/build assets, or ongoing maintenance).
  3. **Historical existence alone is not sufficient** to retain an active copy (aligns charter Historical Retention Principle, Engineering Disciplines “Repository history is the archive”, `S74-D07`, `S74-D09`).
  4. **Do not** create replacement `_archive/` or `captures/` shelves when deleting forensic quarantine, scratch, or loose captures.
  5. Authoritative engineering history lives in **`docs/development/sprints/**`** evidence packs.
  6. **`archive/docs-legacy/`** is retained as the **ADR-named** thin legacy-docs shelf (`docs/architecture/decisions.md`); it is not a dump for failed investigations.
  7. Detailed retain/delete/defer matrix: [S74C-T-020-retention-and-deletion-decisions.md](S74C-T-020-retention-and-deletion-decisions.md). Execution remains **T-030 plan → T-040**.

- **Status:** **Accepted** (2026-08-07)

- **Rationale:** T-010 showed tracked scratch, broken compose probes, and quarantine/capture trees without current consumers, while protected classes have clear operational value. Formalising HRP prevents re-litigating “keep because old” at T-030/T-040.

- **Consequences:** T-030 must plan deletions for Groups A–E (as decided) and ignore expansion (Group G); must **not** execute Group F deletions; must protect listed classes. T-040 executes only after T-030.

---

## Pending decisions

| Topic | Expected trigger |
| ----- | ---------------- |
| Authorise T-040 deletion slices | **Ready** — [S74C-T-030](S74C-T-030-repository-hygiene-execution-plan.md); execute when operator authorises T-040 |
| Group F tooling retain/delete (consumer proof) | Post-74C or separately authorised investigation |
| Close Sprint 74 programme with 74C | S74C-T-050 / operator |
