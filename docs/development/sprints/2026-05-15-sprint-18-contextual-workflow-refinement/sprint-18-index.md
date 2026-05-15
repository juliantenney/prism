# Sprint 18 — pack index

**Date:** 2026-05-15  
**Sprint title:** Sprint 18 — Contextual Workflow Refinement  
**Status:** **Checkpoint** — Slices 1–2 closed; Slice **3C chartered** (not implemented); **91 tests green**.

**Checkpoint (authoritative closeout):** [`SPRINT-18-CHECKPOINT.md`](SPRINT-18-CHECKPOINT.md)

**Fresh chat:** [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md) → [`HANDOVER.md`](HANDOVER.md) → [`SPRINT-18-CHECKPOINT.md`](SPRINT-18-CHECKPOINT.md)

---

## Goal

**Contextual Workflow Refinement** on pack-driven deterministic planning — **Research-first** — workflow-aware, usually non-blocking adequacy guidance after synthesis.

---

## Checkpoint summary (2026-05-15)

| Item | Status |
|------|--------|
| **Slice 1** | **Closed** — refinement context contract + Research `topic_scope_under_specified` rule + S7 + evaluator tests |
| **Slice 2** | **Closed** — post-synthesis Planning-panel `planning_adequacy` surfacing |
| **Verification** | **91 passed**, 0 failed |
| **S1–S6** | Unchanged (`workflow-research-sparse-briefs.test.js`) |
| **S7** | Proves topic-sufficiency adequacy notice (Sprint 17 smoke gap) |

**Out of scope (unless chartered):** chat clarification, dismiss/suppress, LD rollout, AI phrasing, renderer/schema redesign, Prompt Studio merge.

---

## Slice closeout detail

### Slice 1 (interpreter + pack)

| Phase | Deliverable | Status |
|-------|-------------|--------|
| **A** | Charter + RQ-T1–RQ-P1 | **Done** |
| **B** | Research pack `planningAdequacyChecks` + disclosure | **Done** |
| **C** | `app.js` interpreter + `__PRISM_TEST_API` | **Done** |
| **D** | S7 fixture + `workflow-research-adequacy.test.js` | **Done** |
| **E** | Manual M0, M2, M4 | **Optional** → candidate **Slice 3A** |

**Verification after Slice 1:** **88 passed**, 0 failed.

### Slice 2 (visibility)

Post-synthesis merge into `planningDisclosures`; `continueWorkflowDesignGeneration` panel refresh.

**Verification after Slice 2:** **91 passed**, 0 failed.

---

## Slice 3C (chartered — not implemented)

| Doc | Role |
|-----|------|
| [`docs/consolidation/sprint-18-slice-3c-charter.md`](../../../consolidation/sprint-18-slice-3c-charter.md) | **Implementation charter** |
| [`docs/consolidation/sprint-18-slice-3c-adequacy-proposal.md`](../../../consolidation/sprint-18-slice-3c-adequacy-proposal.md) | Design reference (checks A–E) |

| Phase | Scope |
|-------|--------|
| **3C-1** | Runtime: `briefFieldMentionAnyOf`, `stepsLackAny` / `stepsExclude`, `stepCountAtLeast`, `weakAudienceCue`; cap at **3** adequacy rows |
| **3C-2** | Pack + tests: checks **A**, **B**; fixtures **S8**, **S9**; negatives **S3**, **S7** (`output_depth: standard`) |
| **Deferred** | Checks **C–E**; S10–S12 |

**Constraints:** assistive-only; `planning_adequacy`; deterministic pack rules; no chat/dismiss/AI/LD/renderer/schema.

**Baseline:** 91 passed → ~95–97 expected after 3C-2.

---

## Other candidate slices (not chartered)

1. **Slice 3A** — manual M0/M2/M4 + copy polish  
2. **Slice 3B** — dismiss / recommendation lifecycle  
3. **Slice 3C-pass-2** — adequacy checks C–E + S10–S12  
4. **Renderer contract** — separate track

---

## Pack contents

| File | Role |
|------|------|
| [`SPRINT-18-CHECKPOINT.md`](SPRINT-18-CHECKPOINT.md) | **Checkpoint** — Slices 1–2 closeout + verification + next slices |
| [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md) | Fresh-chat entry + copy-paste block |
| [`HANDOVER.md`](HANDOVER.md) | Session handover summary |
| [`CURRENT-STATE.md`](CURRENT-STATE.md) | Active sprint pointer |
| [`SPRINT-CONTEXT.md`](SPRINT-CONTEXT.md) | Focus, boundaries, read-first |
| [`sprint-18-bootstrap.md`](sprint-18-bootstrap.md) | Architecture bootstrap |
| [`sprint-18-index.md`](sprint-18-index.md) | This index |
| [`review-log.md`](review-log.md) | Decisions and closeout log |
| [`context-files/README.md`](context-files/README.md) | Snapshot inventory |
| [`docs/consolidation/sprint-18-slice-1-charter.md`](../../../consolidation/sprint-18-slice-1-charter.md) | Slice 1 charter (closed) |
| [`docs/consolidation/sprint-18-slice-3c-charter.md`](../../../consolidation/sprint-18-slice-3c-charter.md) | Slice 3C charter (pending implementation) |
| [`docs/consolidation/sprint-18-slice-3c-adequacy-proposal.md`](../../../consolidation/sprint-18-slice-3c-adequacy-proposal.md) | Slice 3C design proposal |

---

## Live repo artefacts (canonical when mounted)

| Path | Role |
|------|------|
| `domains/research/domain-research-step-patterns.md` | Research pack — adequacy policy |
| `tests/fixtures/workflow-brief-research-sparse/S1`–`S7.json` | Sparse + adequacy fixtures |
| `tests/workflow-research-sparse-briefs.test.js` | S1–S6 regression |
| `tests/workflow-research-adequacy.test.js` | S7 + integration tests |
| `app.js` | Refinement context, adequacy eval, planning disclosures, Factory wiring |

---

## Sprint 17 bridge (closed)

| Artefact | Location |
|----------|----------|
| Implementation closeout | `docs/consolidation/sprint-17-implementation-summary.md` |
| Topic sufficiency gap | `context-files/sprint-17-topic-sufficiency-gap.md` |
| Sprint 17 pack | `docs/development/sprints/2026-05-15-sprint-17-research-elicitation-sparse-brief-testing/` |

**Tests at Sprint 17 closeout:** **85 passed**.

---

## Non-goals (ongoing)

Renderer/schema redesign, Prompt Studio merge, LD implementation (default), Sprint 17 reopen, step-settings-first refinement UX, chat/dismiss/AI phrasing until chartered.
