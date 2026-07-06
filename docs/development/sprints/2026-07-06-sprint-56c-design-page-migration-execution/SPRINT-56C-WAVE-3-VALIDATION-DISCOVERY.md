# Sprint 56C — Wave 3 Validation Architecture Discovery

**Sprint:** 56C — Design Page Migration Execution  
**Wave:** 3 — Validation preparation (discovery)  
**Date:** 2026-07-06  
**Status:** Discovery complete — implementation not authorised by this document

**Authority:** [Generation Visibility Constraint](SPRINT-56C-GENERATION-VISIBILITY-CONSTRAINT.md) · [Wave 1 Closure](SPRINT-56C-WAVE-1-CLOSURE-SUMMARY.md) · [Wave 2 Closure](SPRINT-56C-WAVE-2-CLOSURE-SUMMARY.md) · [CP-4 Approval Brief](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-CP-4-ARCHITECTURE-APPROVAL-BRIEF.md) · [Architecture Guardrails](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-ARCHITECTURE-GUARDRAILS.md) · [Implementation Plan §7](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-IMPLEMENTATION-PLAN.md)

**Scope:** OQ-24 · OQ-25 · validation architecture only. Design Page architecture is **frozen** — no reopening of ownership, thin bridge, Wave 1 removals, or Wave 2 implementation.

---

## Section 1 — Validation problem statement

### Context

Sprint 56C Waves 1–2 implemented and closed the approved Design Page target architecture:

- **Wave 1** removed generative wrapper stack, EQF, VA authoring, synthesis mandates, and brevity shaping from the DP runtime path.
- **Wave 2** added the sole Layer 3 authority (`LD-THIN-ASSEMBLY-COHERENCE-CONTRACT`) and narrowed R-83 to a Layer 2 structural delimiter.

Prompts for Design Page execute in **Copilot**. Prism assembles prompts, hosts contracts, runs structural validators on **captured** page JSON when available, and can **repair** composition from upstream artefacts — but Prism does **not** observe live model generation.

### The problem

Stakeholders need confidence that the **implemented architecture remains compliant** and that **regression is detectable** before Wave 4 sign-off. Without a bounded validation architecture, teams risk either:

1. **False confidence** — treating Prism gate tests as proof that Copilot produces correct learner-facing pages; or  
2. **False impossibility** — assuming nothing can be validated because generation happens outside Prism.

Wave 3 must define what Prism **can** legitimately verify under the [Generation Visibility Constraint](SPRINT-56C-GENERATION-VISIBILITY-CONSTRAINT.md), and what must be delegated to Copilot capture/review workflows.

### Primary question

> **What can Prism legitimately verify about continued Design Page architecture compliance without claiming runtime-generation validation?**

### Wave 3 deliverables (from implementation plan)

| ID | Deliverable | Nature |
| -- | ----------- | ------ |
| **OQ-24** | Dual-path **review framework** (Copilot-primary vs PRISM-repair) | Policy + structural criteria per path |
| **OQ-25** | Canonical fixture **definitions** + acceptance-test readiness | Fixture catalogue + structural review checklists |
| **W3.3** | Failure modes A–G → structural review map | Checklist, not runtime proof |
| **W3.5** | Regression inventory | Existing tests vs guardrails |

Wave 3 **prepares** validation; it does **not** prove Copilot behavioural compliance.

---

## Section 2 — Generation Visibility constraints

### Hard boundary

| Environment | Observes |
| ----------- | -------- |
| **Copilot** | Live prompt execution, model outputs, conversational upstream context |
| **Prism/Cursor** | Prompt/contract text, code emit path, captured artefact JSON, structural validators, repair functions, governance docs, automated tests |

### Prism/Cursor **may** validate (from Generation Visibility Constraint)

- Architecture alignment with CP-4 and frozen governing principles  
- Prompt and contract text (ownership boundaries, allowed/disallowed categories)  
- Implementation alignment (code, workflows, emit-path obligations)  
- Artefact **structures** (page JSON shape, section membership, embed invariants)  
- Governance compliance (guardrails, Assembly-Time Ownership Test classification, inventory reconciliation)

### Prism/Cursor **may not** validate

- Copilot runtime outputs **as generation proof**  
- Generated content **quality**  
- Generated summaries, transitions, navigation prose **quality**  
- Model behavioural compliance with instructions  

### Implication for Wave 3

All Wave 3 artefacts must use language such as **“structural compliance review”**, **“prompt-path verification”**, and **“artefact-shape audit”** — never **“runtime acceptance passed”** or **“generation quality verified”** unless explicitly scoped to Copilot-side review with captured artefacts.

### Dual-path framing (OQ-24)

| Path | What Prism validates | What Prism does not validate |
| ---- | -------------------- | ---------------------------- |
| **Copilot-primary** | That prompts/contracts **sent** to Copilot match frozen architecture; optional **post-capture** structural audit of saved page JSON | That the model **followed** those instructions during generation |
| **PRISM-repair** | That repair/validation functions exist, are invoked on capture, and preserve Layer 1 invariants; that repair does not silently mask failures without trace | That repair produces **pedagogically optimal** prose; that repair fixes all Copilot drift |

---

## Section 3 — Verifiable architecture controls

Controls Prism can verify **deterministically** (category **A**) or with high confidence via static analysis and fixture-backed structural tests.

### 3.1 Emit path and prompt composition (A)

| Control | Verification method | Existing evidence |
| ------- | ------------------- | ----------------- |
| Augment-chain membership | VM load `app.js` + libs; call `applyWorkflowStepRuntimePromptAugmentations` for `step_design_page` | `sprint-56c-wave1-phase1-gates.test.js`, `sprint-56c-wave2-gates.test.js` |
| Removed modules absent on DP | Assert prompt excludes rhetoric, journey, authorial, EQF, VA markers | Wave 1/2 gate tests |
| Compose contract present | Assert `LD-DESIGN-PAGE-COMPOSE-CONTRACT` marker | Wave 1/2 gates |
| Thin bridge present (DP only) | Assert `LD-THIN-ASSEMBLY-COHERENCE-CONTRACT` after compose | `sprint-56c-wave2-gates.test.js` |
| Inject order | Index of compose marker < bridge marker | Wave 2 gates |
| Idempotent append | Second augment does not duplicate bridge marker | Wave 2 gates |
| Non-DP paths unchanged | DLA/GAM prompts still receive their contracts | Phase 1 GAM rhetoric gate |

### 3.2 Contract and SSOT text (A)

| Control | Verification method | Existing evidence |
| ------- | ------------------- | ----------------- |
| Compose transport vs archival split | Unit tests on `buildLdDesignPageComposePromptBlock` | `ld-design-page-compose-contract.test.js` |
| Bridge SSOT pointers (no duplicate prose) | Compose slice excludes bridge procedural blocks | W2.3C gates |
| R-83 delimiter present | `READABLE ASSEMBLY (R-83 guardrail)` in compose/materials/domain | W2.5 gates |
| F40 anti-condense obligations | Materials preservation lines in prompt | Phase 2A/2B gates |
| Thin bridge contract prohibitions | Lib unit tests | `ld-thin-assembly-coherence.test.js` |
| Deprecation register alignment | Governance doc review | `DEPRECATION-REGISTER.md` Wave 1–2 |

### 3.3 Domain pack and governance (A)

| Control | Verification method | Existing evidence |
| ------- | ------------------- | ----------------- |
| §13 excludes removed module references | Parse Prompt Factory JSON; residue patterns | `sprint-56c-wave1-phase2b-gates.test.js` |
| §13 names thin bridge + R-83 | String assertions on factory surfaces | W2.3C/W2.5 gates |
| Brevity params detached from DP | Workflow brief config assertions | Phase 2B gates |
| Execution checklist wave status | Governance review | Checklist §D retained items |

### 3.4 Schema and wiring (A)

| Control | Verification method | Existing evidence |
| ------- | ------------------- | ----------------- |
| `index.html` / VM bootstrap lib load order | File presence and script tags | W2.3B integration |
| Test API exports for contracts | `__PRISM_TEST_API` surface | Gate test loaders |
| Page JSON root keys expected by domain | `defaultOutputStructure.keys` | Domain §13 |
| `artifact_type: page` contract | Domain template + validators | Domain pack |

### 3.5 Structural artefact review — when JSON is available (A for shape rules; B for content fidelity)

Prism **can** run validators on **captured or fixture** page JSON without claiming generation quality:

| Validator surface | Location | What it checks |
| --------------- | -------- | -------------- |
| `validatePageActivityClosure` | `app.js` | Activity membership vs upstream |
| `validatePageMaterialsClosure` | `lib/page-gam-materials-preserve.js` | GAM body embed vs upstream pack |
| `validatePageActivityFieldClosure` | `lib/page-activity-field-preserve.js` | DLA scaffold field preservation |
| `validatePageEpisodePlansClosure` | Episode plan libs | Portable episode_plans schema |
| `validatePageBeatMaterialClosure` | Beat material registry | Beat/material closure |
| `repairLearnerPageCompositionFromUpstream` | `app.js` | PRISM-path restoration from upstream |
| `applyPageCompositionValidationForCapturedPage` | `app.js` | Run-mode capture pipeline |

**Tests:** `page-materials-closure.test.js`, `utility-page-composition-closure.test.js`, `page-episode-plans-closure.test.js`, `workflow-learner-page-design-page-preservation.test.js`.

These verify **structural invariants** on known inputs — not that Copilot will produce compliant JSON on demand.

---

## Section 4 — Non-verifiable runtime behaviours

Category **C** — must not be claimed as Prism-validated.

| Behaviour | Why not verifiable in Prism | Delegation |
| --------- | --------------------------- | ---------- |
| Generated prose quality | No access to live model output | Copilot manual review |
| Generated summaries (`knowledge_summary`, wrapper bodies) | Semantic adequacy requires reading generated text | Copilot capture + human or LLM-in-Copilot review |
| Generated learner outcomes understanding | Pedagogical outcome not structurally encodable | Out of Prism scope |
| Generated transitions (quality, tone, teaching) | Thin bridge caps are prompt rules; compliance is behavioural | Copilot review; optional post-hoc audit of captured text |
| Generated navigation quality | “Minimal/capped” is subjective at runtime | Copilot review |
| Model follows transport-first ordering | Instruction adherence | Copilot observation |
| Model omits synthesis when LC absent | OQ-17 behavioural | Copilot capture review |
| Chat-history upstream access (failure mode F) | Copilot conversation state | Copilot runbook |
| Copilot token-limit truncation | Runtime environment | Copilot capture + structural diff if artefact saved |
| Learner-completable **experience** | Requires human learner or rich simulation | Acceptance review outside Prism |

### Partially verifiable (category B) — structural proxies only

| Behaviour | Prism can verify | Prism cannot verify |
| --------- | ---------------- | ------------------- |
| **Field preservation** | Captured JSON contains expected keys; closure validators pass vs upstream fixtures | Verbatim fidelity of every prose field without upstream snapshot |
| **Transport-first** | Prompt lacks synthesis mandates; domain/compose transport slots | Model chose transport over synthesis in output |
| **Bridge placement** | Runtime prompt order and DP-only gating | Model respected wrapper-gap-only fallback |
| **No condensation** | Validator flags placeholder/short bodies vs upstream GAM; inflation fixtures | All condensation patterns in the wild |
| **R-83 compliance** | Prompt forbids optimise language; anti-condense in contracts | Page reads “well” without structural defect |
| **Acceptance invariant** (learner-completable) | Structural checklist: materials present, no label-only placeholders, assessment items structured | Subjective readability and instructional effectiveness |

---

## Section 5 — Candidate validation framework

### 5.1 Classification matrix (required examples)

| Validation candidate | Class | Prism verification approach |
| -------------------- | ----- | ---------------------------- |
| Runtime prompt composition | **A** | Gate tests: augment chain, markers, order, exclusions |
| Contract presence | **A** | Lib + gate tests; domain factory parse |
| Contract order | **A** | Index assertions in augmented prompt string |
| Architecture boundaries | **A** | Guardrails + deprecation register + ownership residue patterns |
| Ownership allocation | **A** | Contract MODULE_ID lines; DP-only bridge; compose non-generative |
| Schema requirements | **A** | Domain `defaultOutputStructure`; page parse validators |
| Field preservation obligations | **B** | Prompt text (A) + `validatePageActivityFieldClosure` on fixtures/captures |
| Transport-first compliance | **B** | Prompt/domain (A for mandates) + materials closure vs upstream (B on captures) |
| Bridge placement | **A** | Wave 2 gate tests (static prompt path) |
| Generated prose quality | **C** | Not Prism — Copilot review |
| Generated summaries | **C** | Not Prism — Copilot review |
| Generated learner outcomes | **C** | Not Prism |
| Generated transitions | **C** | Not Prism — optional text audit in Copilot only |
| Generated navigation quality | **C** | Not Prism |

### 5.2 OQ-24 — Dual-path review framework (candidate)

**Decision to record in Wave 3 implementation** — discovery recommends:

| Path | Role | Prism structural criteria |
| ---- | ---- | --------------------------- |
| **Path A — Copilot-primary** | Authoritative learner page from workflow conversation | **Pre-flight:** prompt-path gates pass. **Post-capture (optional):** run `applyPageCompositionValidationForCapturedPage` on saved JSON; record warnings in `generation_notes` — failures are **artefact audit findings**, not generation proof. |
| **Path B — PRISM-repair** | Backstop when capture is incomplete or upstream-known | **Repair traceability:** `repairLearnerPageCompositionFromUpstream` must not pass without upstream; repaired fields logged. **Non-masking rule:** repair success on Layer 1 must not clear material-closure failures without explicit notes. |
| **Equivalence policy** | For canonical fixtures (OQ-25) | Layer 1 outcomes (membership, materials keys, embed length vs upstream) should be **comparable** across paths; prose in wrapper slots may differ without failing structural review. |

**Explicit non-goal:** Prove Path A and Path B produce identical pedagogy or prose.

### 5.3 OQ-25 — Canonical fixture baseline (candidate)

Map implementation plan §7 fixture classes to existing/near-existing assets:

| Fixture class | Purpose | Candidate source | Failure modes |
| ------------- | ------- | ---------------- | ------------- |
| Multi-activity learner page | Membership, ordering, multi-material | `tests/fixtures/page-render/ld-inflation-workshop-page.json` + upstream LA | C, G |
| Inflation / communication workshop | Historical mode A/G regression | `ld-inflation-workshop-*` fixtures | A, G |
| Knowledge-bound workflow | OQ-17 transport-or-omit review | Workflow brief + domain template (structural); capture TBD | A (synthesis) |
| Assessment-profile page | Structured item transport | `ld-rna-hcv-assessment-page.json` | E |
| Facilitator-profile page | Profile policy (SQ-F1/F2 deferred) | Brief/policy doc only until SQ-F closed | — |
| Marx self-study (rich DLA+GAM) | End-to-end preservation | `marx-self-study-page.json`, preservation tests | A, B, D |
| Copilot-generated capture slot | OQ-24 Path A artefact | **To be captured** — metadata + checklist only in Wave 3 | All |
| PRISM-repaired capture slot | OQ-24 Path B artefact | Repair test outputs / synthetic | All |

**Wave 3 output:** fixture **registry document** (IDs, paths, upstream bindings, structural checklist per fixture) — not mandatory Copilot re-runs.

### 5.4 Failure modes A–G → structural review criteria (W3.3)

| Mode | Structural review criterion (Prism-applicable) | Validator / test hook |
| ---- | ---------------------------------------------- | --------------------- |
| **A Summarisation** | `materials.*` length ≥ upstream Content threshold; no condensation phrases in `generation_notes` | Materials closure, fidelity lib |
| **B Metadata substitution** | Field values not matching Material-name patterns; GAM binding tests | `ld-materials-copy.test.js`, closure |
| **C Multi-material enumeration** | `count(materials keys) == count(GAM blocks)` per activity | Enumeration invariant tests |
| **D Truncation** | Body contains expected headings/rows from upstream | Closure diff tests |
| **E Placeholder substitution** | No “Full … from LO…” without embed | Placeholder detector tests |
| **F Upstream access denial** | N/A at generation time; **prompt** contains CONTEXT ACCESS RULE | Compose contract test |
| **G Reference without embed** | No label-only materials; page self-contained keys | Materials fidelity, closure |

Modes A–E/G are **B** on live Copilot output (requires capture); **A** on fixed fixtures with known upstream.

### 5.5 Three-layer compliance model (recommended)

```
Layer 0 — Governance frozen     → CP-4, guardrails, closure summaries (docs)
Layer 1 — Prompt/contract path  → sprint-56c gate tests, lib unit tests (A)
Layer 2 — Artefact structure    → validators + fixtures when JSON available (B)
Layer 3 — Generation behaviour  → Copilot only (C) — out of Prism scope
```

Wave 4 sign-off should require Layers 0–2 complete for canonical fixtures; Layer 3 explicitly delegated.

---

## Section 6 — Wave 3 implementation opportunities

Ordered work packages aligned to implementation plan §5 Wave 3. **No runtime architecture changes** — documentation, registry, test harness, and checklist completion.

| ID | Opportunity | Deliverable | Class focus |
| -- | ----------- | ----------- | ----------- |
| **W3.1** | Fixture registry (OQ-25) | `SPRINT-56C-WAVE-3-FIXTURE-REGISTRY.md` — IDs, paths, upstream bindings, per-fixture structural checklist | B |
| **W3.2** | Dual-path policy (OQ-24) | `SPRINT-56C-WAVE-3-DUAL-PATH-REVIEW-FRAMEWORK.md` — Path A/B criteria, equivalence, non-masking rules | Policy |
| **W3.3** | Failure-mode map | `SPRINT-56C-WAVE-3-FAILURE-MODE-STRUCTURAL-REVIEW.md` — A–G checklist columns | B |
| **W3.4** | Regression inventory | Matrix: existing tests → guardrail/R-id → gap column | A |
| **W3.5** | Unified gate bundle | `tests/sprint-56c-wave3-validation-readiness.test.js` — meta-test that registry paths exist, dual-path doc sections present, checklist §E boxes satisfied | A |
| **W3.6** | Checklist §E completion | Update `SPRINT-56C-EXECUTION-CHECKLIST.md` when W3.1–W3.3 done | Governance |
| **W3.7** | Capture playbook (Copilot) | Optional runbook: how to save Path A captures for fixture slots — **outside Prism codebase** | C delegation |

### Explicitly out of Wave 3 scope

- Reopening ownership, bridge, or Wave 1/2 implementation  
- SQ-1 / SQ-2 upstream packaging (deferred W2.4)  
- New prompt contracts or augment-chain changes  
- Claiming Copilot runtime acceptance  
- Wave 4 full compliance audit (Wave 4 work package)

### Build on existing assets (do not reinvent)

| Asset | Reuse for Wave 3 |
| ----- | ---------------- |
| `sprint-56c-wave{1,2}-*.test.js` | Layer 1 regression bundle — cite in inventory |
| `page-materials-closure.test.js` | Layer 2 template for fixture-backed structural tests |
| `tests/fixtures/page-render/*` | OQ-25 canonical candidates |
| `repairLearnerPageCompositionFromUpstream` | OQ-24 Path B behavioural spec |
| `DESIGN-PAGE-FAILURE-MODES.md` | W3.3 source catalogue |

---

## Section 7 — Risks and limitations

### Risks

| Risk | Severity | Mitigation in Wave 3 framework |
| ---- | -------- | ------------------------------ |
| **False confidence** — gate tests mistaken for Copilot proof | High | Generation Visibility language in all Wave 3 docs; Layer 3 explicitly delegated |
| **PRISM repair masks Copilot failure** (RK-05) | Medium | OQ-24 non-masking rule; require `generation_notes` on repair; compare Path A vs B on fixtures |
| **Fixture drift** — captures age as architecture evolves | Medium | Fixture registry versioned; gate tests lock prompt path independently |
| **Incomplete fixture coverage** | Medium | OQ-25 minimum set from impl plan; gap column in regression inventory |
| **Structural pass but pedagogically broken** | Medium | Acknowledged limitation; Copilot review for Layer 3 |
| **Scope creep into Wave 4** | Low | Wave 3 limited to preparation artefacts per this discovery |

### Limitations (accepted)

1. Prism validates **instructions and structure**, not **model behaviour**.  
2. Thin bridge volume caps (80/60 words) are **contract-encoded** but not **runtime-enforced** in Copilot.  
3. Wrapper-gap fallback quality is **C** — only presence of correct prompt rules is **A**.  
4. Facilitator profile (SQ-F1/F2) lacks full fixture baseline until product policy closes.  
5. Full-repo `node --test tests/*.test.js` is optional; Wave 3 should define a **named bundle** (e.g. 56C validation readiness) rather than ad-hoc full suite.  
6. Wave 3 does not resolve SQ-1/SQ-2 — transport-or-omit **upstream packaging** remains a known gap for OQ-17 frequency in live workflows.

### Wave 3 exit criteria (proposed)

| Criterion | Evidence |
| --------- | -------- |
| OQ-24 dual-path review framework **documented** | W3.2 artefact |
| OQ-25 canonical fixtures **identified** with structural checklists | W3.1 artefact |
| Failure modes A–G mapped to structural criteria | W3.3 artefact |
| Regression inventory complete | W3.4 artefact |
| Checklist §E items checked | Checklist update |
| No claim of runtime generation validation | This discovery + Generation Visibility Constraint |

---

## Readiness preview (for governance closure)

| Question | Discovery answer |
| -------- | ---------------- |
| **Is Wave 3 discovery complete?** | **Yes** — validation boundary defined. |
| **Can Wave 3 implementation proceed?** | **Yes** — without reopening Waves 1–2 architecture. |
| **Does Prism validate Design Page compliance?** | **Partially** — Layers 0–2 yes; Layer 3 no. |

**Next step:** Wave 3 implementation (W3.1–W3.6) per Section 6, then Wave 4 architecture compliance review.

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `SPRINT-56C-WAVE-3-VALIDATION-DISCOVERY.md` |
| Type | Discovery — validation architecture |
| Runtime changes | **None** |
| Architecture changes | **None** |
| Supersedes | Ad-hoc OQ-24/OQ-25 notes in checklist only |
