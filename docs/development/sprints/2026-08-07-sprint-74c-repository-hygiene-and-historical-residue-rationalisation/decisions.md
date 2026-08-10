# Sprint 74C — Decision Log

**Sprint status:** **COMPLETE / Closed** (2026-08-07)  
**Format:** ID · Decision · Status · Rationale · Consequences  
**Closure:** [S74C-T-050-final-verification-and-programme-closure.md](S74C-T-050-final-verification-and-programme-closure.md)

Inherited programme constraints are **linked, not duplicated** — [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md); parent decisions `S74-D01`…`S74-D11`.

Inherited working practice — [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md) *(not duplicated here)*.

Scope authority — [S74-programme-post-74B-review.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-programme-post-74B-review.md) (narrowed R1). Do **not** rewrite that review.

Retention matrix — [S74C-T-020-retention-and-deletion-decisions.md](S74C-T-020-retention-and-deletion-decisions.md).

---

## S74C-D01 Open Sprint 74C for Repository Hygiene & Historical Residue Rationalisation

- **Decision:** Operator approval has **opened Sprint 74C** — Repository Hygiene & Historical Residue Rationalisation — as the **final narrowed** Sprint 74 hygiene phase. Scope follows post-74B review option **R1**: reference-audited scratch/archive/probe classification and cleanup only. **PB-S-001**, WR orphan cleanup, and **PB-FA-004** are **excluded**. This is **not** an architectural redesign sprint and **not** original Domain C unchanged. Sprint 74 remains the open programme wrapper. Sprint 74A and 74B remain **COMPLETE / Closed**. Sprint 75 remains **not opened**. Pack initialisation (`S74C-T-001`) does **not** begin inventory execution or deletions. First implementation task when authorised: **S74C-T-010** (inventory only).

- **Status:** **Accepted** (2026-08-07) — fulfilled by pack open and completion

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
  7. Detailed retain/delete/defer matrix: [S74C-T-020-retention-and-deletion-decisions.md](S74C-T-020-retention-and-deletion-decisions.md).

- **Status:** **Accepted** (2026-08-07) — standing policy after 74C

- **Rationale:** T-010 showed tracked scratch, broken compose probes, and quarantine/capture trees without current consumers, while protected classes have clear operational value.

- **Consequences:** Hygiene executed under T-030/T-040; Group F remains deferred; protected classes retained.

---

## S74C-D03 Close Sprint 74C

- **Decision:** Sprint **74C** is **COMPLETE / Closed**. Acceptance criteria AC-01…AC-13 are met per [S74C-T-050-final-verification-and-programme-closure.md](S74C-T-050-final-verification-and-programme-closure.md). No further 74C hygiene work. **Group F** remains intentionally deferred and is **not** outstanding Sprint 74 work. Sprint **75** is **not opened** by this decision.

- **Status:** **Accepted** (2026-08-07)

- **Rationale:** T-010…T-040 complete; T-050 verification confirms objectives, protected classes, and policy. Operator authorised programme closure at T-050.

- **Consequences:** Pack frozen as historical evidence. Programme close recorded as [S74-D11](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d11--close-sprint-74-programme). Next programme is Sprint 75 when separately opened.

---

## Pending decisions

| Topic | Expected trigger |
| ----- | ---------------- |
| Group F tooling retain/delete (consumer proof) | Post-74 / separately authorised investigation — **not** Sprint 74 reopen |
| Open Sprint 75 | **Done** — opened 2026-08-10 as separate UX programme |
