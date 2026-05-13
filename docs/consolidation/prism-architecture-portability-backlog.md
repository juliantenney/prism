# PRISM — architecture and portability backlog (consolidated)

**Date:** 2026-05-13  
**Path:** `docs/consolidation/prism-architecture-portability-backlog.md`

**Role:** Consolidate **unfinished** architecture and portability themes now visible after **Sprint 12** and **Sprint 13** consolidation — **descriptive backlog only**. This note **does not** charter implementation, **does not** supersede individual sprint closure documents, and **does not** add product commitments.

**Primary sources:** `docs/consolidation/sprint-12-first-pass-structural-observability-closure.md`, `docs/consolidation/sprint-12-candidate-prep-note.md`, `docs/consolidation/sprint-13-index.md`, `docs/consolidation/sprint-13-first-pass-closure.md`, `docs/consolidation/sprint-13-portability-boundary-summary.md`, `docs/consolidation/sprint-13-portability-strategy-synthesis.md`, and linked Sprint 13 audits / closure notes referenced from **`sprint-13-index.md`**.

**Documentation only:** **No** code, domain-pack, prompt, persistence, import/export, or orchestration edits accompany this backlog.

---

## 1. What Sprint 12 completed

**Bounded first-pass structural observability (Phases A–E)** — **closed** per [`sprint-12-first-pass-structural-observability-closure.md`](sprint-12-first-pass-structural-observability-closure.md):

- **Structural tests** (Node) on **`workflowGenerationContext.js`** **`buildWorkflowGenerationContext`** → **`promptContext`** assembly: section heading order (**Phase A**), **`### File:`** provenance ordering (**Phase B**), happy-path return shape (**Phase C**), **`selectedDomains`** token order (**Phase E**).
- **`app.js`** **Phase D**: **source-level** check of the design user payload join (`promptContext` + compact directive) — **no execution** seam.
- **Explicit non-claim:** closure **does not** complete broader Sprint 12 candidate work from [`sprint-12-candidate-prep-note.md`](sprint-12-candidate-prep-note.md) (prep **only**, not approved umbrella program).

---

## 2. What Sprint 13 completed

Per [`sprint-13-index.md`](sprint-13-index.md) and [`sprint-13-first-pass-closure.md`](sprint-13-first-pass-closure.md), plus post–first-pass closure notes linked from the index:

| Class | What shipped |
|-------|----------------|
| **Documentation (delivered)** | **S13-07** — v1 reference: General, **`alwaysOnDomains`**, **`normalizeSelectedDomains`**, first structured domain for **`getWorkflowBriefConfig`**, Factory domain list context, manifest vs embedded fallback — [`sprint-13-general-alwayson-first-structured-domain-behaviour.md`](sprint-13-general-alwayson-first-structured-domain-behaviour.md). |
| **Narrow implementation (delivered)** | **S13-01** — strict-parity-preserving **`#wfDesignDomainSelect`** tidy (**`app.js`** only) with parity matrix + runtime baselines. |
| **Narrow implementation (delivered, post-index posture)** | **S13-03 (DOM-only)** — Factory hint copy in **`renderWorkflowFactoryDomainUiHints`** only — [`sprint-13-s13-03-dom-only-hint-neutralisation-closure.md`](sprint-13-s13-03-dom-only-hint-neutralisation-closure.md). Broader S13-03 remains **gated** — [`sprint-13-s13-03-decision-gate-note.md`](sprint-13-s13-03-decision-gate-note.md). |
| **Read-only consolidation (not “portability implementation”)** | Audits and decision notes: default-domain framing (**S13-02** options, no policy pick), prompt/config tracing, persistence/export tracing, pragmatic portability target, workflow semantics / orchestration audit, portability boundary summary, strategy synthesis, starting-artefact audit + parity matrix + runtime baseline + **deferral closure** — see **`sprint-13-index.md` §3**. |

**Explicit non-claim:** Sprint 13 **did not** establish **drop-in** domain-pack portability — [`sprint-13-portability-boundary-summary.md`](sprint-13-portability-boundary-summary.md), [`sprint-13-first-pass-closure.md`](sprint-13-first-pass-closure.md) §Portability claim.

---

## 3. What remains unfinished

In aggregate, after Sprint 12 **A–E** and Sprint 13 first-pass + audits:

- **WGC / runtime** observability beyond the **happy-path structural** slices (fetch failures, caches, missing files, semantic assertions).
- **Default domain and selection policy** (**S13-02**) — framed, **not** implemented.
- **Hint and markdown channel partitioning** beyond **S13-03 narrow** (pack vs prompt vs DOM proof obligations).
- **Starting artefact / LD starting-point** structural moves — **deferred** — [`sprint-13-starting-artefact-portability-deferral-note.md`](sprint-13-starting-artefact-portability-deferral-note.md).
- **Workflow semantics / orchestration** rationalisation beyond documentation (generation, refinement, title heuristics, LD coupling) — audit exists; **no** umbrella implementation charter from Sprint 13.
- **Persistence / export / import / versioning** round-trip guarantees and migration posture — traced, **not** solved.
- **`briefLines` / extraction / multi-domain brief** evolution — explicitly deferred across Sprint 13 closure and Sprint 9/10/11 boundaries.
- **`app.js` decomposition** and large-scale refactor — repeatedly deferred (Sprint 3, Sprint 13 deferred list, portability boundary summary).

---

## 4. Unfinished work by theme

For each group: **evidence** = where the concern is already documented; **risk** = rough coupling / blast-radius if touched casually; **decision** = the class of governance choice still outstanding (not a pick).

### 4.1 Observability / structural architecture

| Field | Content |
|-------|---------|
| **Evidence** | Sprint 12 closure (Phases A–E + **deferred** list); [`sprint-12-candidate-prep-note.md`](sprint-12-candidate-prep-note.md) Passes A–C sketch; [`sprint-11-closure.md`](sprint-11-closure.md) deferred WGC/runtime coverage (cross-reference in current-state). |
| **Why it matters** | Without deeper observability, **silent drift** in **`promptContext`** assembly, ordering, and parallel channels is hard to detect before user-visible regressions. |
| **Risk** | **Medium** — expanding tests can still create **false confidence** if single-channel (candidate prep note risks). |
| **Likely future decision** | **Charter per pass** (which surfaces, which assertions, what is explicitly out of scope) before adding semantic or runtime assertions. |

### 4.2 Domain-pack portability

| Field | Content |
|-------|---------|
| **Evidence** | [`sprint-13-pragmatic-domain-pack-portability-target.md`](sprint-13-pragmatic-domain-pack-portability-target.md); [`sprint-13-portability-boundary-summary.md`](sprint-13-portability-boundary-summary.md) §§3–6; [`sprint-13-general-alwayson-first-structured-domain-behaviour.md`](sprint-13-general-alwayson-first-structured-domain-behaviour.md). |
| **Why it matters** | Packs, manifest, WGC, and **`app.js`** **co-own** behaviour; “portable pack” is **incremental clarity** for v1, not drop-in replacement without coordination. |
| **Risk** | **High** for schema / loader redesign; **medium** for documentation-only drift if packs and docs diverge. |
| **Likely future decision** | **Manifest schema / ownership** rules, fallback merge governance, and what “supported third-party pack” means **before** large pack or loader changes. |

### 4.3 Prompt / config contracts

| Field | Content |
|-------|---------|
| **Evidence** | [`sprint-13-prompt-config-portability-tracing-audit.md`](sprint-13-prompt-config-portability-tracing-audit.md); [`sprint-13-s13-03-decision-gate-note.md`](sprint-13-s13-03-decision-gate-note.md); canonical [`sprint-10-contract-audit.md`](sprint-10-contract-audit.md) (referenced across Sprint 9–13). |
| **Why it matters** | Same markdown can feed **DOM hints** and **model `promptContext`**; **`briefLines`** and pack JSON interact — channel boundaries are **semantic**, not file-slice alone. |
| **Risk** | **High** — prompt-facing edits affect generation, refinement, and audits under different charters. |
| **Likely future decision** | **Explicit channel charter** (what may change together, what proof is required for “display-only” claims) before refactors that move copy or factors. |

### 4.4 Orchestration semantics

| Field | Content |
|-------|---------|
| **Evidence** | [`sprint-13-workflow-semantics-orchestration-portability-audit.md`](sprint-13-workflow-semantics-orchestration-portability-audit.md); Sprint 12 candidate prep (orchestration / prompt slices); Sprint 11 closure deferred orchestration. |
| **Why it matters** | Design vs refinement vs run-time paths **diverge** in loaders and contracts; generation rationalisation ties to **learner-facing** workflow model (Sprint 07/08 lineage). |
| **Risk** | **High** — touches step identity, brief resolution, and user-visible workflow behaviour. |
| **Likely future decision** | **Semantics-first charter** (compatibility rules, pinned baselines) distinct from “fixture expansion” or “observability only” passes. |

### 4.5 Persistence / export / versioning

| Field | Content |
|-------|---------|
| **Evidence** | [`sprint-13-persistence-export-portability-audit.md`](sprint-13-persistence-export-portability-audit.md); portability boundary summary §Persistence; Sprint 12 candidate prep **Pass C** (dual-save sketch). |
| **Why it matters** | Saved workflows carry **ids and resolutions**, not full pack text; **replay** after pack edits depends on **versioning / compatibility** posture. |
| **Risk** | **High** — silent data loss or import skew if fields move without migration story. |
| **Likely future decision** | **Export/import version policy** and **field-preservation** test matrix under an explicit persistence charter. |

### 4.6 Starting artefacts / workflow inputs

| Field | Content |
|-------|---------|
| **Evidence** | [`sprint-13-starting-artefact-portability-deferral-note.md`](sprint-13-starting-artefact-portability-deferral-note.md); [`sprint-13-starting-artefact-starting-point-code-derived-parity-matrix.md`](sprint-13-starting-artefact-starting-point-code-derived-parity-matrix.md); [`sprint-13-starting-artefact-runtime-parity-baseline.md`](sprint-13-starting-artefact-runtime-parity-baseline.md). |
| **Why it matters** | LD **trio**, allowlist, brief **`input_strategy`**, and WGC catalogue **split** pipelines; **`startingArtefact`** values are **semantic** downstream. |
| **Risk** | **High** for branch merges; **low** for Tier A literal dedup if ever taken — still **gated** by evidence gaps in deferral note. |
| **Likely future decision** | **Deferral lifted** only with matrix + restore + WGC-failure evidence and charter; optional **policy** for pack-owned allowlists vs **`app.js`**. |

### 4.7 `app.js` decomposition

| Field | Content |
|-------|---------|
| **Evidence** | Sprint 3 consolidation deferrals (current-state); [`sprint-13-first-pass-closure.md`](sprint-13-first-pass-closure.md) deferred list (“broad **`app.js`** refactor”); portability boundary summary §architecture-coupled. |
| **Why it matters** | Monolith **`app.js`** concentrates Factory, brief lines, persistence glue, and orchestration — **hard to change one concern** without accidental coupling. |
| **Risk** | **High** — module extraction without contract tests risks **wide** regressions. |
| **Likely future decision** | **Dedicated module-boundary sprint** with **non-goals** (which surfaces stay in place) and **incremental** extraction order. |

---

## 5. Three-way distinction (how to read the backlog)

| Type | Meaning | Examples in this backlog |
|------|---------|---------------------------|
| **Small parity-safe cleanup** | Single-control or literal-only change with **evidence matrix + runtime baseline** and **narrow file** scope — S13-01 pattern. | Tier A starting-artefact placeholder dedup (**if** chartered); similar **only** with same evidence bar. |
| **Decision-gated product policy** | Requires an explicit **product / governance pick** and often user-facing semantics. | **S13-02** default domain; **S13-03** beyond DOM-only; starting-artefact **policy** (pack vs app ownership). |
| **Architecture programme work** | Multi-layer, multi-file, or contract-spanning effort needing **sequenced charters**. | **`app.js`** decomposition; **prompt/channel** repartitioning; **persistence/versioning** migration; **orchestration** semantics programme. |

---

## 6. Suggested sequencing (descriptive only — not a roadmap)

1. **Hold Sprint 12 closure fixed** — do not treat candidate prep as approved scope; new passes need new charters (Sprint 12 closure, candidate prep §Approval boundary).
2. **Prefer evidence before motion** — extend observability / matrices **where** a future charter names a surface (Sprint 12 deferred list; Sprint 13 audit §7-style evidence lists).
3. **Stabilise selection and channel boundaries before large pack moves** — default-domain policy (**S13-02**) and prompt/config tracing conclusions should inform any pack or **`briefLines`** work (portability boundary summary).
4. **Persistence and export tests before schema migration** — align with candidate prep Pass C style **bounded** compatibility checks.
5. **`app.js` decomposition last among these** — only after narrower contracts have stronger automated guardrails (Sprint 3 deferral; Sprint 13 posture).

**Ordering is not approval:** each step still requires **explicit** sprint or charter acceptance.

---

## 7. Explicit non-goals

| Non-goal | Affirmation |
|----------|-------------|
| **No implementation now** | This backlog **does not** author code, pack, prompt, persistence, import/export, or orchestration changes. |
| **No reopening Sprint 12** | Sprint 12 **first-pass A–E** closure remains the **authoritative** completed slice; broader candidates are **prep / future** only — [`sprint-12-first-pass-structural-observability-closure.md`](sprint-12-first-pass-structural-observability-closure.md), [`sprint-12-candidate-prep-note.md`](sprint-12-candidate-prep-note.md). |
| **No claim Sprint 13 solved portability** | Sprint 13 **documented** boundaries and delivered **narrow** slices; **drop-in portability is not claimed** — [`sprint-13-portability-boundary-summary.md`](sprint-13-portability-boundary-summary.md). |
| **No roadmap commitment** | Nothing here **obligates** dates, resources, or sequencing beyond **descriptive** suggestions; **separate approval** required for any programme. |

---

## Related index

| Index | Role |
|-------|------|
| [`sprint-13-index.md`](sprint-13-index.md) | Sprint 13 consolidation map |
| [`docs/development/current-state.md`](../development/current-state.md) | Short pointer to this backlog |

---

## Review log

- **2026-05-13** — Consolidated PRISM architecture and portability backlog note drafted (`prism-architecture-portability-backlog.md`).
