# Sprint 75 — Closure Record

**Sprint:** 75 — PRISM User Experience and Interface  
**Opened:** 2026-08-10  
**Closed:** 2026-08-12  
**Status:** **COMPLETE / Closed**  
**Predecessor:** [Sprint 74 — COMPLETE / Closed](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/SPRINT-74-START-HERE.md) — architecture not reopened  
**Successor at closeout (2026-08-12):** Lagrangian Multipliers resource quality investigation → Settings (**PB-FA-005**)  
**Live successor (from 2026-08-13):** [Sprint 76 — OPEN](../2026-08-13-sprint-76-dla-rationalisation-and-content-quality-consistency/SPRINT-76-START-HERE.md) (that investigation lane formally opened as Sprint 76)  
**Final report:** [SPRINT-75-FINAL-REPORT.md](SPRINT-75-FINAL-REPORT.md)  
**Top-level closeout:** [docs/sprints/sprint-75-closeout.md](../../../sprints/sprint-75-closeout.md)  
**Decisions:** [decisions.md](decisions.md) (`S75-D01`…`S75-D32`)

---

## Closure authority

Sprint 75 is closed by operator closeout on **2026-08-12** after delivery of the UX / interaction-design programme across Create Workflow, My Workflows, Authoring handoffs, Run durability, Prompt Studio, and Prompt Library — within documented constraints and without reopening Sprint 74 architecture.

**No active implementation work remains under Sprint 75.** Sprint **76** was **not** opened by this closure document on 2026-08-12; it was opened separately on **2026-08-13** after post-closeout investigation evidence.

---

## Original objective

Systematically improve Prism’s user experience and interface for eventual users through evidence-led discovery and focused implementation across five programme domains (Create, My Workflows, Authoring, Prompt Studio, Prompt Library), now that underlying architecture is consolidated (Sprint 74 closed).

---

## Outcome summary

- **Create Workflow** — one-product LD brief; progressive assistant disclosure; hidden resolved-brief diagnostics; read-only Proposed workflow; Save Workflow handoff; API-key action gate; retired generic workflow reviewer and Create Draft/Refined chrome.
- **My Workflows** — Run default mode and session preservation; Run UX simplification (orientation, capture relevance, execution bar); segmented display-only progress and persisted-output indication; workflow lifecycle fixes (Rename identity, Delete cleanup, Import collision handling); control grouping aligned with Create; default list selection refinements.
- **Authoring** — Run→Authoring handoff and provenance; assembly learner-readiness gate; Learning object format retired.
- **Run persistence** — non-destructive merge; durable step.id; session-scoped run position; IndexedDB resource-backed captures (`S75-D21` **SETTLED**).
- **Prompt Studio** — Output type field visibility restored; Generate UX progressive disclosure; **Paste a prompt** / **Generate a prompt** split (Paste default); Paste metadata (title, tags, notes, body); authoritative `Library.savePrompt` path for standalone saves; workflow-step Prompt Studio remains distinct.
- **Prompt Library** — header action grouping and naming consistency (Copy prompt, Save, Use as template); detail pane de-duplicated; persistence and version history unchanged.
- **Cross-cutting** — compact PRISM status control (`S75-D26`); expanded `tests/s75-*` regression coverage.

---

## Completion criteria checklist

| Criterion | Status |
| --------- | ------ |
| Evidence-led programme structure (`S75-D02`) | **Met** |
| Create UX pass (`S75-D22`–`D25`) | **Met** |
| My Workflows Run and lifecycle refinements | **Met** (see Final Report §4) |
| Authoring / Run handoff and readiness (`S75-D04`, `D13`) | **Met** |
| Run capture durability and migration (`S75-D14`–`D21`) | **Met** — **SETTLED** |
| Prompt Studio and Prompt Library UX refinements | **Met** |
| Documentation / closure / handover | **Met** (this closeout) |
| Sprint 76 not prematurely opened | **Met** |

---

## Testing at close

| Suite | Result (2026-08-12 closeout verification) |
| ----- | ---------------------------------------- |
| **Authoritative Sprint 75 regression batch** (8 files — library layout, Prompt Studio suites, workflow import roundtrip, persistence pass 2) | **114 / 114 pass** |
| Extended `tests/s75-*.test.js` (full glob) | **1 stale assertion** in `s75-d26-compact-prism-status-control.test.js` (cache-bust string drift vs `index.html`) — not fixed during closeout; test maintenance only |
| `tests/workflow-design-page-upstream-prompt.test.js` | **3 / 3 pass** — prior `visual_need` failure **not reproduced** at closeout |

Detail: [SPRINT-75-FINAL-REPORT.md](SPRINT-75-FINAL-REPORT.md) §12.

---

## Known boundaries at close

- **Settings / parameterisation** — investigation complete during Sprint 75; implementation deferred → **[PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency)** (next product area after resource-quality investigation).
- **Advanced custom-workflow Edit machinery** — not reopened; may receive a dedicated future sprint if evidence warrants (**not** assigned here).
- **T-020 slices C-09 / C-11 / C-12** — remain deferred.
- **QA / refinement lifecycle** — **[PB-FA-006](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-006--qa--workflow-and-resource-refinement-lifecycle)**.
- **Storage management UX** — **[PB-FA-007](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-007--user-controlled-storage-management)**.
- Working-tree production and documentation changes may await **operator commit** — operational follow-up, not reopening of Sprint 75 scope.

---

## Binding carry-forward

Retain `S75-D01`…`S75-D32` unless a later programme revises them. Sprint 74 architectural constraints remain linked, not rewritten.

---

## Handover posture

> **Sprint 75 is complete. Sprint 76 is OPEN (DLA audit / content-quality consistency). Settings follows after the Sprint 76 decision gate.**

See [HANDOVER.md](HANDOVER.md) · [next-chat-briefing.md](next-chat-briefing.md) · live [Sprint 76 HANDOVER](../2026-08-13-sprint-76-dla-rationalisation-and-content-quality-consistency/HANDOVER.md) · [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md).
