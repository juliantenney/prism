# Design Page — Core Reduction Analysis

**Sprint:** 56A — Design Page Simplification Planning  
**Status:** Planning artefact — analytical only  
**Date:** 2026-07-06  
**Authoritative inventory:** [DESIGN-PAGE-RESPONSIBILITY-MATRIX.md](DESIGN-PAGE-RESPONSIBILITY-MATRIX.md)  
**Related:** [DESIGN-PAGE-FAILURE-MODES.md](DESIGN-PAGE-FAILURE-MODES.md), [DESIGN-PAGE-ARCHITECTURE-AUDIT.md](../2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/DESIGN-PAGE-ARCHITECTURE-AUDIT.md)

**Purpose:** Determine whether the responsibilities classified as **Core** in the matrix genuinely represent Design Page’s minimum architectural identity, or whether the Core set mixes fundamentals with derived rules, guardrails, validation, and implementation detail.

**Inventory note:** The matrix summary states **44 Core**; the responsibility table contains **40** rows marked Core (R-01–R-86, excluding Secondary/External). This analysis audits all **40** table rows. The 4-count gap should be reconciled in a future matrix revision.

**This document does not redesign Design Page, propose changes, or define target architecture.**

---

## Executive summary

| Metric | Value |
| ------ | ----: |
| Core responsibilities reviewed | **40** (matrix table rows; summary claims 44) |
| **Fundamental** (minimum identity) | **11** |
| **Derived** (necessary elaboration of fundamentals) | **12** |
| **Guardrail** (boundary / precedence rules) | **12** |
| **Validation** (fail-before-emit / checks) | **2** |
| **Implementation detail** (plumbing / SSOT / format) | **3** |
| **Estimated minimum architectural identity set** | **10–14 obligations** (see Phase 3) |
| Ambiguous after analysis | **6** (see end) |

**Finding:** The Core set (**40** table rows; **44** in matrix summary) **overstates** minimum architectural identity by approximately **3–4×**. Inflation is driven by (1) fragmentation of one transport operation into many L4 invariants, (2) classification of guardrails and validation as Core because their absence causes failure, (3) implementation plumbing (SSOT, augmentation order, JSON contract), and (4) historical accretion of preservation patches each elevated to Core status.

---

## Phase 1 — Core responsibility audit

### Audit legend

| Candidate type | Meaning |
| -------------- | ------- |
| **Fundamental** | Independently defines what Design Page *is*; survives any first-principles rebuild |
| **Derived** | Necessary specification of *how* a fundamental responsibility is fulfilled; not independent |
| **Guardrail** | Prevents a forbidden transformation; exists because other responsibilities or modules create risk |
| **Validation** | Check or fail condition; not a deliverable behaviour itself |
| **Implementation detail** | Runtime/governance mechanism; not learner-facing architectural responsibility |

### Phase 1 table (all 40 Core responsibilities in matrix table)

| ID | Responsibility | Current Core rationale | Independent? | Depends on | Candidate type |
| -- | -------------- | ---------------------- | ------------ | ---------- | -------------- |
| R-01 | Page JSON schema emission | Defines deliverable shape | **Yes** | None | **Fundamental** |
| R-02 | Canonical section ordering | Organisation of page shell | No | R-01 | **Derived** |
| R-03 | Page profile selection | Multi-deliverable step variants | **Partial** | R-01, workflow | **Fundamental** (step capability) — see ambiguous |
| R-05 | Title and audience metadata | Minimum page metadata | Yes | R-01 | **Fundamental** |
| R-06 | Source artefact provenance | Audit trail / portability | No | R-12, bindings | **Derived** |
| R-09 | Workflow constraint enforcement | Honour brief component requests | Yes | Workflow brief | **Fundamental** |
| R-10 | Strict JSON output contract | Machine-parseable output | No | R-01, runner | **Implementation detail** |
| R-11 | Math notation preservation | STEM transport fidelity | No | R-17, R-28 (copy) | **Derived** |
| R-12 | Copilot upstream consumption | Primary upstream access path | **Yes** | Workflow bindings | **Fundamental** |
| R-13 | Context access rule | Chat history is context | No | R-12 | **Guardrail** |
| R-14 | Anti-reconstruction guard | No brief-only material compose | No | R-17 | **Guardrail** |
| R-15 | Per-binding consumption routing | Artefact-specific merge rules | No | R-12, bindings | **Derived** |
| R-16 | Read-only compose policy | Assemble not redesign | **Yes** | None | **Fundamental** |
| R-17 | GAM material block merge | Core materials payload | **Yes** | R-12 | **Fundamental** |
| R-18 | Opaque payload transport | Do not interpret before copy | No | R-17 | **Guardrail** |
| R-19 | GAM content binding | Metadata ≠ payload | No | R-17 | **Guardrail** |
| R-20 | Multi-material enumeration | One field per Material block | No | R-17 | **Derived** |
| R-21 | Full content body preservation | Entire Content: per field | No | R-17 | **Validation** |
| R-22 | Material preservation vs optimisation | Precedence over brevity | No | R-17, competing params | **Guardrail** |
| R-23 | Final learner output invariant | Self-contained page; no references | **Yes** | R-01, R-17 | **Fundamental** |
| R-24 | Authorable vs archival split | Materials not authored on DP | No | R-16, wrapper modules | **Guardrail** |
| R-25 | Table fidelity preserve | Tables high-loss | No | R-17 | **Derived** |
| R-27 | Activity membership closure | All activities present | **Yes** | DLA set | **Fundamental** |
| R-28 | DLA scaffold field preservation | Cognition/scaffold verbatim | **Yes** | R-12 | **Fundamental** |
| R-29 | Core task field preservation | learner_task, expected_output, support | No | R-28 | **Derived** |
| R-30 | Anti-scaffold compression | No label compression | No | R-28 | **Guardrail** |
| R-31 | Learning sequence order/timing | Order without replan | No | R-27 | **Derived** |
| R-46 | Authorial preservation boundary | Authorial excludes rows/materials | No | R-43 (Secondary/External), R-24 | **Guardrail** |
| R-50 | Rhetoric preservation boundary | Rhetoric excludes preserved fields | No | R-49 (External), R-24 | **Guardrail** |
| R-52 | Scaffold compose preservation slice | Compose-only preserve rules | No | R-28, R-30, ADR-02 | **Derived** |
| R-61 | Top-level episode_plans transport | Portable DEP copy | No | R-12, DEP binding | **Derived** |
| R-62 | Per-activity episode_plan attachment | Row-level plan | No | R-61 | **Derived** |
| R-63 | Episode beat verbatim copy | No replan | No | R-61 | **Derived** |
| R-64 | Episode plans excluded from section prose | Metadata not in sections | No | R-61, R-02 | **Guardrail** |
| R-66 | Assessment items transport | Items when bound | **Conditional** | R-12, assessment binding | **Fundamental** (when bound) |
| R-72 | Anti-restate guard (knowledge vs materials) | No material dump in summary | No | R-39 (External), wrapper | **Guardrail** |
| R-73 | Compose contract SSOT | Single assembly authority | No | All compose rules | **Implementation detail** |
| R-75 | Runtime augmentation ordering | Module inject sequence | No | R-73, app.js | **Implementation detail** |
| R-83 | Readable page assembly scope | Structure only, not materials | No | R-16, R-24 | **Guardrail** |
| R-86 | Pre-emit materials validation | Fail if materials invalid | No | R-17–R-23 | **Validation** |

### Phase 1 count by candidate type

| Candidate type | Count | IDs |
| -------------- | ----: | --- |
| **Fundamental** | 11 | R-01, R-03, R-05, R-09, R-12, R-16, R-17, R-23, R-27, R-28, R-66† |
| **Derived** | 12 | R-02, R-06, R-11, R-15, R-20, R-25, R-29, R-31, R-52, R-61, R-62, R-63 |
| **Guardrail** | 12 | R-13, R-14, R-18, R-19, R-22, R-24, R-30, R-46, R-50, R-64, R-72, R-83 |
| **Validation** | 2 | R-21, R-86 |
| **Implementation detail** | 3 | R-10, R-73, R-75 |

† R-66 counted as fundamental **when `assessment_items` is bound**; otherwise inapplicable. R-03 counted fundamental as step-level deliverable routing; profile-specific behaviour may be derived.

**Note on double-counting:** R-61–R-63 are three derived facets of one fundamental obligation: *transport episode plans verbatim when bound*. Similarly R-17–R-21 are one fundamental operation plus guardrails/validation.

---

## Phase 2 — Grouping analysis

Clusters identified from existing matrix structure — no new architecture invented.

### Cluster A — Upstream access and compose policy

| Members | Relationship |
| ------- | ------------- |
| R-12, R-13, R-15, R-16, R-14 | **Chain:** R-12 (access) → R-15 (routing) → R-16 (read-only) → R-14 (no spec-only materials); R-13 guards R-12 |

**Overlap:** R-14 and R-16 both forbid reconstruction; R-14 is materials-specific.

**Dependency:** All material/activity transport depends on this cluster.

---

### Cluster B — GAM materials transport

| Members | Relationship |
| ------- | ------------- |
| R-17, R-18, R-19, R-20, R-21, R-22, R-23, R-25, R-86 | **Chain:** R-17 (merge) ← guardrails R-18, R-19, R-22 ← derived R-20, R-25 ← validation R-21, R-86 ← deliverable contract R-23 |

**Overlap:** R-18–R-22 restate the same obligation (copy Content: fully) from different failure angles. High **fragmentation**.

**Dependency:** R-12, R-16, R-27 (activity row target).

---

### Cluster C — DLA activity transport

| Members | Relationship |
| ------- | ------------- |
| R-28, R-29, R-30, R-52 | **Chain:** R-28 (preserve fields) → R-29 (task subset) → R-30 (anti-compress) → R-52 (compose slice packaging) |

**Overlap:** R-29 is subset of R-28; R-52 duplicates R-28/R-30 in shorter form (ADR-02).

**Dependency:** R-12, R-27.

---

### Cluster D — Membership and organisation

| Members | Relationship |
| ------- | ------------- |
| R-27, R-31, R-02, R-09 | **Chain:** R-27 (who is on page) → R-31 (order) → R-02 (section shell) → R-09 (brief quantities) |

**Overlap:** R-31 and R-02 both concern ordering at different schema levels.

**Dependency:** DLA activity set; optional `learning_sequence`.

---

### Cluster E — Conditional payload transport

| Members | Relationship |
| ------- | ------------- |
| R-61, R-62, R-63, R-64, R-66 | Episode plan facets (when DEP bound); assessment (when items bound) |

**Overlap:** R-61–R-63 are one transport operation split three ways.

**Dependency:** R-12, R-27 (alignment).

---

### Cluster F — Preservation boundaries (cross-module)

| Members | Relationship |
| ------- | ------------- |
| R-24, R-46, R-50, R-72, R-83 | Boundaries between transport and wrapper/authorial modules |

**Overlap:** R-46 and R-50 are parallel boundaries for authorial vs rhetoric; both exist because External/Secondary wrapper modules are on the emit path.

**Dependency:** Existence of journey/authorial/rhetoric (not Core themselves).

---

### Cluster G — Page artefact shell

| Members | Relationship |
| ------- | ------------- |
| R-01, R-05, R-03, R-06, R-10 | JSON page object identity and metadata |

**Overlap:** R-10 is runner contract, not domain responsibility.

**Dependency:** None upstream.

---

### Cluster H — Governance and runtime plumbing

| Members | Relationship |
| ------- | ------------- |
| R-73, R-75 | SSOT module and injection order |

**Overlap:** Both describe how rules are delivered, not what the page contains.

**Dependency:** Entire prompt stack.

---

## Phase 3 — Reduction exercise

### Question

> If Design Page had to be rebuilt from first principles using the smallest possible responsibility set, which responsibilities would survive?

### Minimum architectural identity (10–14 obligations; 11 atomic fundamentals)

Stated as obligations, not implementation:

| # | Obligation | Matrix IDs | Justification |
| - | ---------- | ---------- | ------------- |
| 1 | **Emit a page artefact** — structured JSON (or equivalent) representing a complete learner-facing page | R-01 | Without this, the step has no deliverable type |
| 2 | **Identify the page** — title, audience, and deliverable variant (profile) | R-03, R-05 | Minimum metadata for a usable page object |
| 3 | **Obtain upstream content** — read full prior-step outputs from the workflow context (conversation or capture) | R-12 | Without access, assembly is fabrication |
| 4 | **Compose read-only** — assemble without replanning, respecifying, or redesigning pedagogy | R-16 | Defines the pipeline verb “assemble” (ADR-06, pipeline reference) |
| 5 | **Embed GAM materials** — merge every Material `Content:` body into matching `activity.materials.*` | R-17 | Primary learner payload from GAM stage |
| 6 | **Embed DLA activity content** — copy activity rows and scaffold fields verbatim | R-28 | Primary learner task framing from DLA stage |
| 7 | **Close activity membership** — include every upstream activity unless explicitly authorised otherwise | R-27 | Journey integrity |
| 8 | **Produce a self-contained final output** — learner can use the page without recovering upstream artefacts | R-23 | Defines “final” vs “index” deliverable |
| 9 | **Honour workflow constraints** — preserve requested components, quantities, exclusions from brief | R-09 | Contract with workflow layer |
| 10 | **Transport assessment items** — when bound, include assessment content on the page | R-66 | Conditional fundamental |
| 11 | **Transport episode plans** — when bound, copy portable episode choreography verbatim | R-61 (subsumes R-62, R-63) | Conditional fundamental |
| 12 | **Order activities** — apply sequence timing/order without replanning | R-31 | Organisation facet of membership |
| 13 | **Order sections** — place canonical sections in coherent sequence | R-02 | Organisation facet of page shell |
| 14 | **Record provenance** — cite which upstream artefacts were consumed | R-06 | Supports portability and audit (lightweight derived fundamental) |

**Consolidation note:** Items 11–14 are organisation and provenance facets of the same “assemble structured page from upstream” obligation. A stricter reduction could collapse to **10 atomic obligations** by merging 7+12+13 and 6+29.

### What does not survive minimum identity (but was Core)

| Category | IDs | Why excluded from minimum |
| -------- | --- | ------------------------- |
| Guardrails | R-13, R-14, R-18–R-19, R-22, R-24, R-30, R-46, R-50, R-64, R-72, R-83 | Necessary only when risks exist (wrapper modules, brevity params, VA, etc.) |
| Validation | R-21, R-86 | Enforcement of R-17/R-23 — quality gate, not identity |
| Derived detail | R-20, R-25, R-29, R-52, R-62, R-63 | Elaborations of R-17 or R-28 |
| Implementation | R-10, R-73, R-75 | PRISM/runtime mechanics |
| Special-case copy | R-11 | Instance of verbatim copy rule |

**Important:** Excluding guardrails from *minimum identity* does not mean they are unnecessary in the *current* system. They exist because Secondary and External Candidate responsibilities on the same emit path create transformation risk.

---

## Phase 4 — Core inflation assessment

### Does the Core set (40 table rows / 44 summary) represent genuine architectural complexity?

**Partially.** Design Page legitimately spans:

- Multiple upstream artefact types (DLA, GAM, DEP, assessment, sequence)
- A structured page schema with activities embedded in sections
- Copilot vs PRISM consumption paths

That warrants **more than a handful** of fundamentals — but not 40–44.

### Responsibility fragmentation

**Strong evidence.** Cluster B alone lists **9 Core IDs** for one operation (embed GAM materials):

```
R-17 → R-18, R-19, R-20, R-21, R-22, R-23, R-25, R-86
```

Each addresses a distinct failure mode (B, C, D, E, A) added in separate patches. Architecturally this is **one fundamental** with **multiple guardrails and validations** elevated to Core because matrix rules treated “removing it breaks the step” as Core.

Similarly Cluster C: **4 IDs** for DLA verbatim copy (R-28, R-29, R-30, R-52).

Episode plans: **4 IDs** (R-61–R-64) for one conditional transport.

### Implementation-detail leakage

**Evidence:**

| ID | Leakage type |
| -- | ------------ |
| R-10 | Output format is runner contract, not domain assembly |
| R-73 | Module SSOT is governance pattern (ADR-06), not page behaviour |
| R-75 | Injection order is `app.js` plumbing |
| R-52 | Packaging of preserve rules post-remediation, not new obligation |

These were classified Core because the step **fails operationally** without them in PRISM — conflating **runtime dependency** with **architectural identity**.

### Historical accretion

**Evidence** (from matrix concentration assessment, confirmed here):

| Period | Core IDs added (approx.) | Nature |
| ------ | ------------------------ | ------ |
| Sprint 25 / 38B | R-01, R-73, R-17 base | Identity + SSOT |
| Sprint 38S | R-61–R-64 | Conditional transport split |
| Sprint 40 | (EQF external) | — |
| Sprint 42–49 | R-46, R-50, R-72, R-83 | Guardrails for wrapper stack |
| Post-fidelity investigation | R-13, R-18–R-23, R-22, R-86 | L4 invariant fragmentation |

**Trend:** Later additions are predominantly **guardrails and validations**, not new fundamental capabilities.

### Mixed responsibility levels

The Core set mixes:

| Level | Count in Core audit |
| ----- | ------------------: |
| What the page **is** | 11 fundamental |
| How copy **must behave** | 12 derived |
| What **must not happen** | 12 guardrails |
| How we **check** | 2 validation |
| How PRISM **delivers rules** | 3 implementation |

**Conclusion:** The Core classification is **not** a clean measure of architectural complexity. It mixes identity with defensive specification accumulated across sprints.

---

## Phase 5 — Relationship to failure modes

### Association matrix

| Failure mode | Primary association | Core IDs most involved | Association type |
| ------------ | ------------------- | ------------------------ | ---------------- |
| **A** Summarisation | Guardrails insufficient vs Secondary/External authoring + R-83 ambiguity | R-22, R-24, R-83 vs R-37–R-41 (Secondary) | **Guardrails vs non-Core authoring** |
| **B** Metadata substitution | Fundamental transport violated | R-17, R-19 | **Fundamental + guardrail** |
| **C** Multi-material omission | Derived rule on fundamental | R-17, R-20, R-27 | **Derived** |
| **D** Truncation | Validation insufficient | R-17, R-21, R-86 | **Validation** |
| **E** Placeholder substitution | Fundamental contract violated | R-23 | **Fundamental** |
| **F** Context denial | Guardrail on access | R-12, R-13 | **Fundamental + guardrail** |
| **G** Material elision | Guardrails vs presentation External | R-17, R-23 vs R-59 (External) | **Fundamental vs non-Core** |

### Failure modes and responsibility inflation

| Hypothesis | Assessment |
| ---------- | ---------- |
| More Core responsibilities → better preservation | **Not observed** — failures persist after many Core L4 rules added |
| Inflation creates conflicting instructions | **Supported** — 40 Core items increase prompt surface; model optimises globally |
| Guardrails classified as Core obscure true identity | **Supported** — identity buried in defensive text |
| Fundamental responsibilities cause failures | **Rare** — failures are violations of R-17/R-23/R-12, not absence of R-18–R-22 as separate “jobs” |
| Validation-as-Core compensates for architectural conflict | **Supported** — R-86, R-21 exist because compose step still hosts authoring (Secondary/External) |

**Conclusion:** Failure modes A–G correlate **more strongly with non-Core responsibilities** (wrapper authoring, VA, brevity params) and with **insufficient obedience to ~11 fundamentals** than with absence of individual guardrail Core items. Responsibility inflation may **contribute** to failures by:

1. Increasing cognitive load on a single LLM step
2. Masking the small fundamental set under defensive duplication
3. Creating false confidence that “~47% Core = mostly transport” when only ~28% of Core is truly fundamental

No solutions proposed in this section.

---

## Phase 6 — Planning conclusions

### Responsibilities requiring deeper review

| ID(s) | Why |
| ----- | --- |
| R-03 | Fundamental for step vs profile-specific behaviour split |
| R-66, R-61 | Conditional fundamentality — required only when bindings exist |
| R-06 | Provenance: minimum identity vs optional metadata |
| R-72 | Guardrail for External/Secondary knowledge path — Core only if summary remains |
| R-83 | Wording ambiguity — guardrail or disguised authoring licence |

### Responsibilities requiring dependency analysis

| Cluster | Dependency question |
| ------- | ------------------- |
| B (GAM) | Can R-18–R-22, R-86 collapse to one transport spec without losing failure coverage? |
| F (boundaries) | Do R-46, R-50 remain necessary if wrapper modules are demoted? |
| H (plumbing) | R-73 vs R-75 — governance vs runtime; not identity but affects all planning |
| E (episode) | R-61–R-64 — renderer requirements for portable schema |

### Responsibilities that may distort future architecture discussions

| Risk | IDs | Distortion |
| ---- | --- | ----------- |
| “Core = important” conflation | All 40 Core | Stakeholders may resist demoting guardrails from Core even when not identity |
| L4 fragmentation presented as architecture | R-18–R-22, R-86 | Planning may optimise prompts instead of responsibility count |
| Implementation as identity | R-73, R-75, R-10 | Migration plans may focus on module order instead of step scope |
| Conditional transport as always-on | R-61–R-66 | Minimum page definition may over-require DEP/assessment |
| Guardrails for External modules | R-46, R-50, R-72 | Suggests wrapper stack is permanent; obscures External Candidate review |

### Recommended Sprint 56A planning actions (analysis only)

| Action | Backlog linkage |
| ------ | --------------- |
| Document **fundamental 11** (+ organisation/provenance facets) as separate layer in implementation plan skeleton | Implementation plan §1 — do not populate yet per charter |
| Map each guardrail Core to the **risk it mitigates** and the **non-Core module** that creates risk | Open questions OQ-09–OQ-11 |
| Quantify Cluster B prompt duplication (chars) | Backlog V-06 |
| Decide whether Core classification should be **split** into Identity / Derived / Guardrail in future matrix revision | Charter exit criteria discussion |
| Use minimum identity set as acceptance test anchor | Backlog V-05 |

**No implementation actions. No architecture changes. No migration plan updates.**

---

## Ambiguous responsibilities after analysis

| ID | Ambiguity | Provisional resolution |
| -- | --------- | ---------------------- |
| **R-03** | Page profile is step infrastructure vs learner-only fundamental | **Fundamental** at step level; profile variants need separate review |
| **R-06** | Provenance essential to “page” vs operational metadata | **Derived** in reduction; included in minimum 14 as lightweight |
| **R-66** | Fundamental only when assessment bound | **Conditional fundamental** |
| **R-61** | Same as R-66 for DEP | **Conditional fundamental**; R-62–R-63 derived |
| **R-72** | Core only if knowledge_summary authoring remains | **Guardrail** contingent on External R-39 |
| **R-83** | Scope delimiter vs optimise licence | **Guardrail** with **high ambiguity** — distorts failure mode A |

---

## Document control

| Field | Value |
| ----- | ----- |
| Core responsibilities reviewed | **40** (matrix table; summary says 44) |
| Fundamental (estimated) | **11** |
| Minimum architectural identity set | **10–14 obligations** (11 atomic fundamentals + organisation/provenance facets) |
| Inflation factor (Core vs fundamental) | **~3.6×** (40÷11) |
| Next consumer | Sprint 56A open questions; implementation plan §1 (when authorised) |

**Analytical only. Does not redesign Design Page or update the implementation plan.**
