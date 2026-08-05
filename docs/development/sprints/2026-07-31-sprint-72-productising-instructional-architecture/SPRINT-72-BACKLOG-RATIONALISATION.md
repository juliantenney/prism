# Sprint 72 — Backlog rationalisation (`S72-T-077`)

**Date:** 2026-08-05  
**Status:** Complete (historical — Sprint 72 now **CLOSED**)  
**Task ID note:** `S72-T-076` remains the DLA optional evidence-guidance UX slice. This rationalisation is **`S72-T-077`**. Do not reuse or rename T-076.

**Superseded for ongoing planning by:** [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md) (`S72-D15`).  
**Closure addendum:** Finish items `S72-T-070` / `S72-T-073` were closed via continuous-verification strategy (`S72-D14`), not a formal sweep. Former “Sprint 73/74/75 candidates” are recorded in the product backlog as **PB-FA-001…003 without sprint numbers**. This file remains cut-line evidence only.

**Original purpose:** Reconcile Sprint 72 task table against the implemented slice and migrate unfinished work into finish / future-architecture / product-idea buckets.

---

## Planning rule (binding)

> A backlog item should only remain within a sprint when it has a concrete implementation approach and clear acceptance criteria. Ideas and possible future enhancements belong in the product backlog until they are ready for planning.

Apply this rule to Sprint 72 closeout and to future sprint packs.

---

## Completed Sprint 72 implementation (primary objective met)

Primary objective — productise the instructional architecture validated in Sprint 71 — was delivered. Much of the primary slice is in repository history; late slices (T-075/T-076 wiring and closure docs) may still await operator commit.

| Area | Status at rationalisation |
| ---- | ------------------------- |
| Evidence-centred activity architecture | Implemented |
| Simulated + conversation-attachment source-bound evidence | Implemented (`S72-D10` byte storage out of scope) |
| Guided-review / delayed-disclosure diagnostic slice | Implemented |
| Bridge semantics + learner-page presentation refinements | Implemented |
| Headings / nav bounded fixes (`S72-T-056`) | Done |
| Pipeline Copilot follow-up suppression (`S72-T-075`) | Done (may be uncommitted late slice) |
| DLA optional evidence upload guidance (`S72-T-076`) | Done (may be uncommitted late slice) |
| Indicative benchmarks | RNA ~93; Heteroscedasticity ~92; Owen source-bound ~92 |

### Test posture

| Suite | Status |
| ----- | ------ |
| Focused bridge / presentation / T-075 / T-076 | Passing (see STATUS) |
| Broader `sprint-72-evidence-centred-activity-slice.test.js` | **Not green** — 28 known pre-existing failures (`intellectual_coherence_bridge` fixtures) |

**Do not claim the complete evidence-centred suite is green.**

---

## 1. Finish in Sprint 72

> **Closure note:** At Sprint 72 close, `S72-T-070` and `S72-T-073` were closed via continuous-verification strategy (`S72-D14`), not as a formal executed sweep. `S72-T-071`/`T-072` completed with closure artefacts. `S72-T-074` remains operator commit follow-up only.

Small, well-defined work that naturally closes this sprint (historical cut-line table):

| ID / item | Disposition | Notes |
| --------- | ----------- | ----- |
| `S72-T-073` | **Finish** | Owen rerender + operator inspection (blocks commit) |
| `S72-T-070` | **Finish** | Focused cross-discipline regression for the implemented slice |
| `S72-T-074` | **Finish** | Commit verified Sprint 72 implementation slice |
| `S72-T-071` | **Finish** | Final STATUS / traceability after commit |
| `S72-T-072` | **Finish (after commit)** | Sprint synthesis + closure pack when verification warrants it |
| `S72-T-023` (remaining) | **Finish via T-070** | Focused validation of shipped diagnostic/evidence slices only — not a new programme |
| `S72-T-054` / `S72-T-055` (remaining “full acceptance”) | **Close as Done-enough** | Bounded fixes shipped via `S72-T-056`; further polish → product backlog |
| `S72-T-020` (remaining behaviour-spec depth) | **Close as Done-enough for S72** | Guided-review slice satisfies the committed diagnostic improvement; deeper Design Feedback programme → product backlog |
| `S72-T-033` (remaining) | **Close as Done-enough for S72** | Source-bound guidance + DLA optional-evidence run-summary shipped; upload-byte elicitation → Sprint 73 candidate |
| `S72-T-061` (remaining analysis) | **Close as Done-enough** | Ceiling baseline selected (`T-060`); further 95–98 analysis → product backlog |
| `S72-B-005` | **Close as Done-enough** | Bounded nav/title fixes via T-056; residual overflow polish → product backlog |

**Sprint 72 remaining execution order:**

1. `S72-T-073` — Owen rerender / inspection  
2. `S72-T-070` — Focused cross-discipline QA  
3. `S72-T-074` — Commit verified slice  
4. `S72-T-071` — Traceability / STATUS finalisation  
5. `S72-T-072` — Closure pack when ready  

---

## 2. Promote to future sprint candidates

> **Closure note:** These are now **PB-FA-001…003** in [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md) **without assigned sprint numbers**. Labels “Sprint 73/74/75” below are historical cut-line shorthand only.

Large, coherent implementation. **Successor sprint candidates only** — do **not** create Sprint 73+ packs in this task.

### Sprint 73 — Workflow Asset Persistence (candidate)

Shared workflow asset model (`S72-D09` / `S72-D10` carry-forward).

| From Sprint 72 | Topic |
| -------------- | ----- |
| `S72-T-040` (remaining storage/ingestion) | Request / upload-select / store / associate / reuse / version |
| `S72-T-041` | How generated activities reference author-supplied artefacts |
| `S72-T-042` | Persist workflow ↔ author-evidence associations |
| `S72-T-044` | Thin vertical slice upload → consume |
| `S72-T-051` / `S72-B-002` | Image / generated-asset persistence, IDs, metadata, reconnect, selective regen |
| `S72-D10` deferred boundary | Conversation-attachment persistence; stable asset identity; byte-level fidelity |

### Sprint 74 — Programming Learning Resources (candidate)

| From Sprint 72 | Topic |
| -------------- | ----- |
| `S72-T-052` / `S72-B-003` / `S71-F-014` | Programming/code first-class support |
| (capacity cut-line) | Learner code handling; programming workspaces; language-aware rendering; programming evidence |

### Sprint 75 — Pipeline Integrity (candidate)

| From Sprint 72 / capacity cut-line | Topic |
| ---------------------------------- | ----- |
| Schema-currency audit | Finalized-page schema currency |
| Model-to-DOM / render closure | Render-closure validation |
| Renderer contract validation | Pipeline integrity checks |

These items are **removed from the active Sprint 72 backlog** as finish work; they remain documented only as successor candidates.

---

## 3. Product backlog (not sprint allocated)

Ideas, possibilities, and future directions. **No Sprint 72 task IDs.** Not assigned to Sprint 73–75 until planned with approach + acceptance criteria.

| Idea | Former Sprint 72 link (retired from S72 backlog) |
| ---- | ------------------------------------------------ |
| Image-style consistency hardening (run/workflow visual style profile) | `S72-T-050` / `S72-B-001` |
| Specialist representations architecture (music / maths / chem / eng) | `S72-T-053` / `S72-B-004` |
| Shared evidence spines / dedicated case-study page type | Charter / README non-requirement |
| Richer evidence visualisations | — |
| Full Design Feedback attribution programme | `S72-T-021` |
| Broader Layer-1 uncertainty / timing programme beyond shipped slices | `S72-T-024` |
| Progressive-disclosure elicitation model + UX prototype | `S72-T-030`–`S72-T-032` |
| Controlled raise-the-ceiling experiment (~95–98) | `S72-T-062` (+ residual `T-061` depth) |
| Further nav/heading a11y polish beyond T-056 | Residual `T-054` / `T-055` / `B-005` |
| Any other unplanned enhancements | — |

---

## Operator backlog (`S72-B-*`) final disposition

| ID | Topic | Cut-line |
| -- | ----- | -------- |
| B-001 | Image consistency | **Product backlog** |
| B-002 | Image persistence | **Sprint 73 candidate** |
| B-003 | Programming / code | **Sprint 74 candidate** |
| B-004 | Specialist representations | **Product backlog** |
| B-005 | Nav long titles / overflow | **Done-enough in S72** (bounded); residual → product backlog |

---

## Explicit non-actions

- Did not reopen or edit Sprint 71 evidence.  
- Did not create Sprint 73+ documentation packs.  
- Did not implement software changes.  
- Did not assign product-backlog ideas new `S72-T-*` IDs.  
- Did not rename or reuse `S72-T-076`.
