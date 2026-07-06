# Design Page — Migration Strategy

**Sprint:** 56A — Design Page Simplification Planning  
**Status:** Planning artefact — sequencing only  
**Date:** 2026-07-06  
**Architectural hypothesis:** [DESIGN-PAGE-TARGET-ARCHITECTURE-DERIVATION.md](DESIGN-PAGE-TARGET-ARCHITECTURE-DERIVATION.md)  
**Dependency baseline:** [DESIGN-PAGE-DEPENDENCY-ANALYSIS.md](DESIGN-PAGE-DEPENDENCY-ANALYSIS.md)

**Purpose:** Answer — *Assuming the derived architecture is accepted, what sequence of architectural changes would minimise risk and maximise validation opportunities?*

**This document does not modify prompts, code, workflows, implementation plans, or create implementation tasks.**

---

## Executive summary (Phase 8)

### Recommended planning sequence

1. **Phase A — Clarification** — Resolve open questions that block scope decisions (OQ-02, OQ-17, OQ-13, OQ-24).
2. **Phase B — Boundary review** — Analyse Layer 3 candidates (wrapper, knowledge summary, VA, brevity params) against derived identity without changing anything.
3. **Phase C — Dependency resolution** — Map export contract, validator, and dual-path impacts per boundary decision.
4. **Phase D — Architecture approval** — Stakeholder sign-off on narrowed identity and Layer 3 disposition.
5. **Phase E — Implementation planning** — Populate `SPRINT-56A-IMPLEMENTATION-PLAN.md` only after Phase D go.

**Within boundary review (Phase B), lowest-risk-first sequencing for *analysis*:** generation notes → EQF/elicitation → guardrail consolidation mapping → brevity params → profiles → knowledge summary → wrapper stack → visual affordances → transport core affirmation.

### Highest-risk migration areas

| Area | Why |
| ---- | --- |
| **GAM/DLA transport (C2, C3)** | Export critical path; Copilot has no repair; failure modes B–G |
| **Wrapper stack (C6)** | Behavioural competition with transport; OQ-02 unresolved |
| **Visual affordances (C8)** | Compose pipeline hard-wired; downstream consumer uncertainty |
| **Page schema / export contract (C5, C14)** | Frozen renderer contract; structural ripple |

### Highest-confidence areas

| Area | Why |
| ---- | --- |
| **Derived Layer 1–2 identity** | Convergent evidence across audit, core reduction, derivation, pipeline |
| **Upstream ownership (DLA/GAM/DEP)** | Sprint 57 GREEN; ADRs 01–07 |
| **Failure mode → responsibility mapping** | Catalogue A–G complete |
| **Generation notes / EQF review scope** | Low dependency sensitivity |

### Key decisions still required

| Decision | Open question |
| -------- | ------------- |
| Author vs organise only on Design Page | OQ-02 |
| Knowledge summary policy | OQ-17 |
| VA placement | OQ-13, OQ-14 |
| Wrapper stack merge vs bound vs remove | OQ-09 |
| Copilot vs PRISM validation strategy | OQ-24 |
| Sprint 57 sequencing relative to DP migration | OQ-23 |
| Canonical acceptance fixtures | OQ-25 |

### Readiness assessment

| Gate | Status | Rationale |
| ---- | ------ | --------- |
| **Implementation planning** | **Partially Ready** | Architecture derivation and dependency map complete; Layer 3 disposition and six open questions block populated implementation plan |
| **Sprint 57 consumption of outcomes** | **Partially Ready** | Stage ownership unchanged — Sprint 57 may proceed on presentation if transport identity is frozen as constraint; narrowing Layer 3 should be decided before Sprint 57 assumes wrapper/VA behaviour |
| **Implementation sprint** | **Not Ready** | Charter requires approved migration plan; OQ-01–02, OQ-13, OQ-17, OQ-24 unresolved; no stakeholder approval on target architecture |

---

## Phase 1 — Current vs derived state

### Current state

#### Responsibility distribution

| Dimension | Current state | Evidence |
| --------- | ------------- | -------- |
| **Total responsibilities** | 86 inventoried (R-01–R-86) | Responsibility matrix |
| **Classification** | Core 40 (table) / 44 (summary); Secondary 24; External Candidate 18 | Matrix summary |
| **Functional spread** | Transport, organisation, authoring, presentation, workflow on **one emit path** | Responsibility analysis; audit §1 |
| **Core inflation** | ~3.6× over 11 fundamentals — guardrails, validation, plumbing classified Core | Core reduction analysis |
| **Prompt modules on emit** | Compose + journey + authorial + rhetoric + VA + EQF + L4 embeds | Audit §1; Sprint 57 augmentation chain |
| **Quality layer** | PRISM validators + repair (materials, fields, episodes) | ADR-08; validation audit |

#### Dependency profile

| Dimension | Current state | Evidence |
| --------- | ------------- | -------- |
| **Upstream** | DLA, GAM, DEP, assessment, sequence, LC/KM, workflow brief, Copilot history | Dependency analysis Phase 2 |
| **Downstream** | Utilities export (`sections[]` authority), capture validators, compose repair pipeline | Export contract 25-3; validation audit |
| **Coupling** | High data + contractual on transport; high behavioural on wrapper/VA | Dependency analysis Phase 4 |
| **Dual path** | Copilot: prompt-only transport; PRISM: validators + repair mask drift | Dependency analysis Phase 3 |
| **Reflexive patterns** | Guardrail ↔ wrapper; validation ↔ transport failure; repair ↔ prompt gap | Dependency analysis Phase 6 |

#### Risk profile

| Risk category | Current severity | Evidence |
| ------------- | ---------------- | -------- |
| **Fidelity failures (live Copilot)** | High — modes A–G persist post-remediation | Failure modes catalogue |
| **Responsibility conflict** | High — competing optimise vs preserve mandates | Audit §2; matrix competition table |
| **Export breakage** | Medium if schema changes; low if prompt-only scope change | Export contract frozen |
| **False confidence from repair** | Medium — PRISM path may hide Copilot transport failures | OQ-24; ADR-08 |
| **Orchestration misplacement** | Low at stage level (Sprint 57 GREEN) | Architecture state |

### Derived state

#### Architectural identity

> Read-only **transport-and-organisation** step producing a **self-contained final learner-facing page** by preserving and arranging upstream content.

**Evidence:** Target architecture derivation Phase 2; audit §3.

#### Layered model

| Layer | Definition |
| ----- | ---------- |
| **Layer 1 — Preserve & embed** | Upstream access, read-only compose, GAM/DLA embed, self-contained output, conditional transport |
| **Layer 2 — Organise** | Schema, membership, order, metadata, workflow constraints |
| **Layer 3 — Optional & supporting** | Wrapper bridge, VA, guardrails, validation, brevity params, plumbing, repair |

**Evidence:** Target architecture derivation Phase 3.

#### Fundamental responsibilities (11)

R-01, R-03, R-05, R-09, R-12, R-16, R-17, R-23, R-27, R-28, R-66† (conditional).

**Evidence:** Core reduction analysis Phase 1, Phase 3.

### Major differences (current → derived)

| Dimension | Current | Derived | Gap type |
| --------- | ------- | ------- | -------- |
| **Step identity** | Assemble + author + specify + optimise | Assemble = transport + organise (+ optional bounded bridge) | Scope |
| **Core count semantics** | 40–44 “Core” mixed identity + guardrails | 11 fundamentals + derived facets | Classification |
| **Wrapper stack** | Three modules co-mandated on learner profile | Layer 3 optional, strictly bounded or absent | Scope |
| **Knowledge summary** | Authored from KM/LC on page step | Transport verbatim or omit — not re-author | Ownership |
| **Visual affordances** | On Design Page emit path | Outside identity — separate step or renderer | Placement |
| **Brevity params** | `output_density`, `depth_level` on compose | Not on Design Page per derived principles | Conflict removal |
| **Guardrails** | Elevated to Core identity | Defensive — shrink if Layer 3 risks removed | Prompt surface |
| **Validation posture** | Compensates for architectural conflict | Enforces Layer 1 — not substitute for scope fix | Strategy |
| **Sprint 57 alignment** | GREEN orchestration; DP still lists wrapper + VA | Stage map unchanged; **internal DP scope** narrows | Refinement not reversal |

**No implementation implied by this comparison — it defines the migration delta only.**

---

## Phase 2 — Migration candidates

Responsibility groups that **may require review** when moving toward derived architecture. “Derived fit” describes alignment with target derivation — not a decision to change.

| Responsibility area | Current role | Derived fit | Dependency level | Migration sensitivity |
| ------------------- | ------------ | ----------- | ---------------- | --------------------- |
| **Upstream access (C1)** | Consume Copilot history / captures; context access rule | **Identity (Layer 1)** | High — all clusters | **High** — Copilot path has no repair |
| **GAM transport (C2)** | Embed full `Content:` per material field | **Identity (Layer 1)** | High — export, validators | **High** — core deliverable |
| **DLA transport (C3)** | Verbatim row/scaffold preservation | **Identity (Layer 1)** | High — export, closure | **High** |
| **Conditional transport (C4)** | Assessment items; episode plans when bound | **Identity (conditional)** | Medium — binding-dependent | **Medium** |
| **Organisation (C5)** | Schema, membership, order, metadata | **Identity (Layer 2)** | High — export contract | **High** — structural |
| **Wrapper content (C6)** | Journey + authorial + rhetoric author wrapper sections | **Layer 3 optional** — disputed value | High — behavioural vs C2/C3 | **High** — OQ-02, OQ-09 |
| **Knowledge summaries (C7)** | Section slot + KM/LC re-synthesis | **Outside identity** — transport or omit | High — overlaps C2, C6 | **High** — OQ-17 |
| **Visual affordances (C8)** | Schema 38.4 specification on page | **Outside identity** | Medium–High — pipeline step 4 | **High** — OQ-13, OQ-14 |
| **Preservation guardrails (C9)** | Boundaries vs wrapper/VA/brevity | **Defensive** — not identity | Medium — depends on C6, C8 | **Medium** — shrinks with Layer 3 |
| **Validation & repair (C10)** | Closure validators; GAM/field/episode preserve | **Quality layer (ADR-08)** — not identity | High — PRISM path | **Medium–High** — strategy coupling |
| **Profiles (C11)** | Learner / facilitator / assessment variants | **Layer 2 metadata** — variants need review | Medium — gates C6 | **Medium** — OQ-06, OQ-08 |
| **Generation notes (C12)** | Transparency, warnings, omissions | **Supporting** — retain with strict rules | Low | **Low** |
| **Workflow plumbing (C13)** | Augmentation order, SSOT, strict JSON, brevity params | **Operational** — not learner architecture | High — delivers all rules | **Medium** — order affects precedence |
| **Renderer structures (C14)** | `sections[]` authority; material field shapes | **Contractual invariant** — preserve through migration | High — frozen export | **High** — cannot break |
| **Brevity / density params** | `output_density`, `depth_level` on Design Page | **Conflict with Layer 1** — review for removal from DP | Medium — competes R-22 | **Medium** — OQ-12 |
| **EQF on emit (R-74)** | Abstract design principles on compose | **Outside identity** | Low | **Low** |
| **Guardrail fragmentation (R-18–R-22, R-86)** | Nine Core IDs for one GAM embed | **Consolidatable specification** of Layer 1 | Medium — prompt volume | **Medium** — analysis only first |

---

## Phase 3 — Sequencing analysis

For each responsibility group: independence, prerequisites, open questions, export impact, learner output impact. **Documentation only — no recommended actions.**

| Area | Independent analysis? | Prerequisite decisions | Unresolved questions | Affects export contract? | Affects learner outputs? |
| ---- | --------------------- | ------------------------ | -------------------- | ------------------------ | ------------------------ |
| **Upstream access** | Partially — needs dual-path context | None for analysis; Copilot strategy before implementation | OQ-24 | No (consumption policy) | **Yes** — failure mode F |
| **GAM transport** | No — tied to validators, export, guardrails | Identity acceptance; fixture baseline | OQ-01, OQ-25 | **Yes** — `materials.*` shapes | **Yes** — primary payload |
| **DLA transport** | No — tied to membership, export | ADR-01/02 accepted | OQ-01 | **Yes** — row field shapes | **Yes** — task framing |
| **Conditional transport** | Partially | Binding policy per workflow | OQ-05, OQ-06 | Partial — optional keys | Conditional |
| **Organisation** | No — schema is export authority | None for analysis | OQ-04 (omission valve) | **Yes** — `sections[]` | **Yes** — structure |
| **Wrapper content** | No — competes with transport | **OQ-02** (author vs organise) | OQ-03, OQ-09, OQ-10, OQ-11, OQ-12 | Partial — wrapper sections only | **Yes** — modes A,G |
| **Knowledge summaries** | No — depends on wrapper/LC policy | **OQ-17** | OQ-07, OQ-18, OQ-19 | Partial — `knowledge_summary` section | **Yes** — mode A |
| **Visual affordances** | No — compose pipeline wired | **OQ-13, OQ-14** | DQ-01 (renderer requires VA?) | No for HTML body today | Indirect — token competition |
| **Preservation guardrails** | Partially — map after C6/C8 decisions | Layer 3 disposition | R-83 ambiguity | No | **Yes** — enforcement |
| **Validation & repair** | No — tiered with transport | Dual-path strategy OQ-24 | OQ-26, OQ-27 | No direct | **Yes** — repaired content |
| **Profiles** | Partially | Wrapper scope OQ-11 | OQ-06, OQ-08 | Partial — section emphasis | **Yes** — assessment profile |
| **Generation notes** | **Yes** | None | R-08 misuse policy | No | No (metadata) |
| **Workflow plumbing** | No — cross-cutting | Architecture approval | OQ-20, OQ-22 | No direct | Indirect — rule delivery |
| **Brevity params** | Partially | Preservation principle acceptance | OQ-12 | No | **Yes** — modes A,D |
| **EQF / elicitation** | **Yes** | None | — | No | Low |

### Sequencing dependencies (planning-level)

```
Identity acceptance (Layer 1–2 fundamentals)
    ↓
OQ-02 author vs organise
    ↓
Wrapper (C6) + Knowledge (C7) boundary review
    ↓
OQ-13 VA placement
    ↓
C8 boundary review
    ↓
Guardrail consolidation mapping (C9) — depends on C6/C8 outcomes
    ↓
Validation strategy alignment (C10) — depends on dual-path decision OQ-24
    ↓
Export contract impact assessment (C14) — continuous constraint
    ↓
Architecture approval (Phase D)
    ↓
Implementation planning (Phase E)
```

**Transport core (C2, C3) should be affirmed and baselined early** — not because it changes first, but because it is the validation anchor for all other reviews (target derivation P2; dependency analysis Phase 8).

---

## Phase 4 — Risk-based ordering

### Lowest-risk review areas

| Area | Evidence for low risk |
| ---- | --------------------- |
| **Generation notes (C12)** | Low sensitivity; not export body; Secondary classification |
| **EQF on emit (R-74)** | External Candidate; abstract pressure only |
| **Intent-class elicitation (R-82)** | Not on compose emit path |
| **Scaffold transition duplicates (R-53)** | Governance debt; no unique consumer |
| **Guardrail mapping exercise (analysis only)** | Descriptive — no scope change until Layer 3 decided |

### Medium-risk review areas

| Area | Evidence for medium risk |
| ---- | ------------------------ |
| **Preservation guardrails (C9)** | Shrink when Layer 3 narrows; not independently migratable before C6/C8 |
| **Brevity params (R-78–R-80)** | High preservation conflict but removal is param-level not schema |
| **Profiles (C11)** | Domain artefacts §18 rules; assessment profile interacts with materials (OQ-06) |
| **Workflow plumbing (C13)** | Augmentation order affects precedence; no schema break |
| **Validation/repair strategy (C10)** | PRISM-only; changing strategy affects observed quality not export contract |
| **Guardrail consolidation (R-18–R-86)** | Prompt surface reduction; must not weaken Layer 1 semantics |
| **Conditional transport (C4)** | Binding-dependent; episode schema already portable |

### Highest-risk review areas

| Area | Evidence for high risk |
| ---- | ------------------------ |
| **GAM transport (C2)** | Export critical; 9 fragmented Core IDs; Copilot no repair; modes B,C,D,E,G |
| **DLA transport (C3)** | Closure validators; export row rendering; ADR-02 dependency |
| **Organisation / schema (C5, C14)** | Composition contract 25-2; export contract 25-3 frozen |
| **Wrapper stack (C6)** | Triple module overlap; failure modes A,G; OQ-02 blocks |
| **Knowledge summaries (C7)** | Audit §L clearest structural conflict; triggers mode A |
| **Visual affordances (C8)** | Largest non-transport load; compose pipeline step 4; OQ-13 blocks |
| **Upstream access (C1)** | Failure mode F; prerequisite for all transport |

---

## Phase 5 — Validation strategy

Validation **needs** per planning phase — not test definitions.

### Phase A — Clarification

| Validation need | Purpose |
| --------------- | ------- |
| Open question evidence gather | Decisions backed by artefact not opinion |
| Live failure exemplar catalogue | Anchor modes A–G to workflows (charter backlog C-04) |
| Copilot vs PRISM path inventory | Inform OQ-24 without assuming repair |

### Phase B — Boundary review

| Area under review | Validation needs |
| ------------------- | ---------------- |
| **Transport core (C2, C3)** | Preservation fidelity; material completeness; multi-material enumeration; scaffold verbatim; self-contained output (no placeholders) |
| **Wrapper (C6)** | Learner usability of exported HTML with/without wrapper authoring; overlap char budget |
| **Knowledge summary (C7)** | Side-by-side: authored vs transport vs omit; cross-field bleed to materials |
| **VA (C8)** | Renderer consumption audit — is VA required for HTML?; `source_basis` vs embed substitution |
| **Brevity params** | Trace params to augmented prompt; measure conflict with R-22 |
| **Profiles (C11)** | Profile matrix — learner vs facilitator vs assessment material expectations |
| **Guardrails (C9)** | Map each guardrail to risk it mitigates and module that creates risk |

### Phase C — Dependency resolution

| Validation need | Purpose |
| --------------- | ------- |
| **Export compatibility** | Any boundary change must preserve `sections[]` authority and `materials.*` shapes |
| **Renderer compatibility** | Utilities export path unchanged for Layer 1–2 payloads |
| **Validator alignment** | If prompt scope narrows, assess whether capture validators still match intent |
| **Dual-path parity** | Copilot path must meet Layer 1 without relying on repair |
| **Composition contract alignment** | ADR-06 compose SSOT vs Sprint 25-2 rules — DQ-02 |

### Phase D — Architecture approval

| Validation need | Purpose |
| --------------- | ------- |
| **Stakeholder review** | Charter exit criterion — target architecture accepted |
| **Sprint 57 impact statement** | OQ-23 — proceed/defer/narrow documented |
| **Regression baseline** | OQ-25 canonical fixtures identified |

### Phase E — Implementation planning

| Validation need | Purpose |
| --------------- | ------- |
| **Acceptance criteria per responsibility change** | Implementation plan §1–3 population |
| **Rollback triggers** | OQ-27 failure rate threshold |
| **Automated equality feasibility** | OQ-26 GAM Content vs emitted field |

---

## Phase 6 — Proposed migration phases

Planning phases only — **not engineering sprints**.

### Phase A — Clarification

**Objective:** Resolve or explicitly defer open questions that block boundary review.

| Input | Output |
| ----- | ------ |
| OQ-01–02, OQ-13, OQ-17, OQ-24, OQ-25 | Decision or deferred-with-owner record in open questions log |
| Failure mode exemplars | Evidence-linked catalogue entries |
| Dual-path inventory | Copilot vs PRISM capability matrix |

**Exit:** No unresolved **blocker** questions for Phase B (deferrals documented).

### Phase B — Boundary review

**Objective:** For each Layer 3 candidate and conflict source, document fit with derived identity and dependency impact — **no changes**.

| Review order (low → high sensitivity) | Scope |
| --------------------------------------- | ----- |
| 1. Generation notes, EQF, elicitation | Supporting / External |
| 2. Brevity params trace | Conflict documentation |
| 3. Guardrail-to-risk mapping | C9 descriptive |
| 4. Profiles matrix | C11 vs C6 gating |
| 5. Knowledge summary policy options | C7 — requires OQ-17 |
| 6. Wrapper stack overlap analysis | C6 — requires OQ-02 |
| 7. VA renderer consumption audit | C8 — requires OQ-13 |
| 8. Transport core affirmation | C1–C3 baseline — validation anchor |

**Exit:** Boundary disposition **options** documented per area (not selected).

### Phase C — Dependency resolution

**Objective:** For each boundary option, trace export, validator, renderer, and learner-output dependencies.

| Work | Dependency analysis consumer |
| ---- | ---------------------------- |
| Export contract impact per option | C14 |
| Validator/repair tier alignment | C10, OQ-24 |
| Sprint 57 product layer constraints | Pipeline reference §Product |
| Composition contract / ADR-06 coherence | DQ-02 |

**Exit:** Dependency impact matrix complete; no option without traced downstream effect.

### Phase D — Architecture approval

**Objective:** Stakeholder acceptance of derived identity and Layer 3 disposition.

| Deliverable | Charter link |
| ----------- | ------------ |
| Approved target architecture summary | Exit criterion 2 |
| Sprint 57 impact decision | Exit criterion 5; OQ-23 |
| Resolved/deferred open questions | Exit criterion 4 |
| Implementation plan header approval gate | Exit criterion 3 prerequisite |

**Exit:** `SPRINT-56A-IMPLEMENTATION-PLAN.md` approval field ready to populate.

### Phase E — Implementation planning

**Objective:** Populate implementation plan skeleton with sequencing, risks, validation strategy — **still no code or prompt changes**.

| Section | Content type |
| ------- | ------------ |
| §1 Responsibility matrix | Current → target mapping from approved disposition |
| §2 Sequencing | Engineering phase order derived from Phase C impacts |
| §3 Validation strategy | From Phase 5 needs |
| §4 Risks | From dependency risk concentration |
| §5 Sprint 57 handoff | Documented per OQ-23 decision |

**Exit:** Implementation plan ready for stakeholder **approval** before any implementation sprint charters.

---

## Phase 7 — Go / no-go criteria

### Conditions required before implementation planning begins (Phase E)

| # | Condition | Status |
| - | --------- | ------ |
| G1 | Target architecture derivation **accepted** as planning hypothesis | **Met** (this strategy assumes it) |
| G2 | Dependency analysis **accepted** | **Met** |
| G3 | **OQ-02** resolved or explicitly deferred with accepted risk | **Not met** |
| G4 | **OQ-17** (knowledge summary) resolved or deferred | **Not met** |
| G5 | **OQ-13** (VA placement) resolved or deferred | **Not met** |
| G6 | Phase B boundary review **complete** for C6, C7, C8 | **Not met** |
| G7 | Phase C dependency impact matrix **complete** | **Not met** |
| G8 | Canonical acceptance fixtures **identified** (OQ-25) | **Not met** |
| G9 | Dual-path strategy **documented** (OQ-24) | **Not met** |

### Conditions required before Sprint 57 can safely consume outcomes

| # | Condition | Rationale |
| - | --------- | --------- |
| S1 | Layer 1–2 identity **frozen as constraint** for product work | Sprint 57 must not assume summarisation/elision is acceptable |
| S2 | Sprint 57 impact decision **recorded** (OQ-23) | Charter exit criterion 5 |
| S3 | Export contract **unchanged** or versioned explicitly | Renderer work depends on stable `sections[]` + materials |
| S4 | No contradiction between Sprint 57 presentation goals and derived P1–P6 | Product polish must not require wrapper authoring that competes with transport |

**Sprint 57 may proceed in parallel with Phase A–C** if S1 is accepted as a working constraint — presentation improvements on trustworthy payloads do not require Layer 3 disposition finalised.

### Remaining blockers

| Blocker | Blocks |
| ------- | ------ |
| OQ-02 author vs organise | Wrapper boundary review; guardrail scope |
| OQ-13 VA on Design Page | C8 review; compose pipeline planning |
| OQ-17 knowledge summary policy | C7 review; mode A structural fix |
| OQ-24 dual-path strategy | Validation tier alignment; Copilot acceptance criteria |
| OQ-25 canonical fixtures | Baseline for any future change verification |
| Stakeholder architecture approval | Implementation sprint charter |
| Matrix Core count reconciliation (40 vs 44) | Clean responsibility tracking in implementation plan |

### Remaining uncertainties

| Uncertainty | Impact |
| ----------- | ------ |
| DQ-01: Renderer requires VA for HTML? | VA relocation feasibility |
| DQ-02: Compose rules split pack vs lib? | Plumbing migration scope |
| R-83 readable assembly scope | Mode A — boundary delimiter vs optimise |
| Product value of wrapper prose | OQ-02 evidence quality |
| Live Copilot failure rate post-scope-narrowing | OQ-27 rollback unknown |
| Sprint 57 GREEN vs 56A fidelity findings | Stakeholder reconciliation |

---

## Phase 8 — Executive summary (detail)

### Recommended planning sequence

| Step | Phase | Focus |
| ---- | ----- | ----- |
| 1 | **A** | Close or defer OQ-02, OQ-13, OQ-17, OQ-24, OQ-25 |
| 2 | **B** | Low-sensitivity reviews first; transport core baseline last as anchor |
| 3 | **C** | Trace each boundary option to export/validator/learner impact |
| 4 | **D** | Stakeholder sign-off; Sprint 57 impact decision |
| 5 | **E** | Populate implementation plan — still no code |

**Critical path:** OQ-02 → wrapper review → OQ-09 → guardrail mapping → OQ-13 → VA review → Phase C → approval.

### Highest-risk areas

Transport (C2, C3), wrapper (C6), VA (C8), schema/export (C5, C14), upstream access (C1).

### Highest-confidence areas

Layer 1–2 derived identity, upstream ownership map, failure mode catalogue, low-sensitivity reviews (C12, EQF, elicitation).

### Readiness assessment

| Gate | Status |
| ---- | ------ |
| **Implementation planning (Phase E)** | **Partially Ready** — evidence complete; blocker OQs and Phase B–C incomplete |
| **Sprint 57 consumption** | **Partially Ready** — with Layer 1–2 frozen as constraint |
| **Implementation sprint** | **Not Ready** — no approved plan; blocker OQs open |

---

## Confidence assessment

| Conclusion | Confidence |
| ---------- | ---------- |
| Phase sequencing logic (A→E) | **High** — follows dependency analysis coordinated review areas |
| Risk ordering (low/medium/high) | **High** — aligned with sensitivity analysis |
| Transport-first validation anchor | **High** — convergent across failure modes, derivation, export contract |
| Wrapper/VA as highest scope-review risk | **High** — audit §2 severity; dependency Phase 6 |
| Sprint 57 parallel feasibility | **Medium** — depends on OQ-23 stakeholder decision |
| Timeline to "Ready for implementation planning" | **Medium** — blocked on OQ-02, OQ-13, OQ-17 minimum |

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `DESIGN-PAGE-MIGRATION-STRATEGY.md` |
| Migration phases identified | **5 planning phases** (A Clarification → E Implementation planning) |
| Highest-risk migration areas | C2 GAM transport, C6 wrapper, C8 VA, C5/C14 schema/export, C1 upstream access |
| Lowest-risk migration areas | C12 generation notes, R-74 EQF, R-82 elicitation, R-53 duplicates |
| Blockers | OQ-02, OQ-13, OQ-17, OQ-24, OQ-25; stakeholder approval; Phase B–C incomplete |
| Readiness | Implementation planning: **Partially Ready** · Sprint 57: **Partially Ready** · Implementation sprint: **Not Ready** |
| Next consumer | Phase A open question resolution; `SPRINT-56A-IMPLEMENTATION-PLAN.md` (Phase E only) |

**Planning only. Does not create implementation tasks, modify artefacts, or assign owners.**
