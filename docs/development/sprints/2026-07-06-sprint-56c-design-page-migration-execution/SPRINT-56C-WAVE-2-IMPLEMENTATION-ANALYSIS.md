# Sprint 56C — Wave 2 Implementation Analysis

**Sprint:** 56C — Design Page Migration Execution  
**Wave:** 2 — Boundary refactoring (implementation planning)  
**Date:** 2026-07-06  
**Status:** Analysis complete — **no implementation performed**

**Authority:** [Thin Bridge Definition](SPRINT-56C-WAVE-2-THIN-ASSEMBLY-COHERENCE-BRIDGE-DEFINITION.md) · [Wave 2 Discovery](SPRINT-56C-WAVE-2-ASSEMBLY-COHERENCE-DISCOVERY.md) · [Wave 1 Closure](SPRINT-56C-WAVE-1-CLOSURE-SUMMARY.md) · [CP-4 Brief](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-CP-4-ARCHITECTURE-APPROVAL-BRIEF.md) · [Guardrails](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-ARCHITECTURE-GUARDRAILS.md)

**Frozen target (not reopened):** Layer 1 Preserve & Embed · Layer 2 Organise · Layer 3 Thin Assembly-Coherence Bridge · Layer 4 Guardrails.

---

## Executive summary

The **smallest safe implementation** to realise frozen Wave 2 architecture is:

1. **New lib contract** `lib/ld-thin-assembly-coherence.js` (`LD-THIN-ASSEMBLY-COHERENCE-CONTRACT`)
2. **Single runtime inject** in `applyWorkflowStepRuntimePromptAugmentations` immediately **after** `applyLdDesignPageComposeContractToDraft`
3. **SSOT migration** — move R-40/R-44/R-45/R-47 obligation text from scattered labels into the bridge; replace compose `FIELD_AUTHORIZING_LINES` R-40 clause with a pointer
4. **W2.5 domain cleanup** — narrow R-83 / remove ambiguous “readable page” optimise cues in domain §13
5. **Gate tests** — new `tests/sprint-56c-wave2-gates.test.js`; extend Wave 1 regression gates

**Not required for frozen architecture realisation:** re-injecting authorial/journey libs, SQ-1/SQ-2 upstream packaging (W2.4), lib soak deletion, renderer changes, or post-compose logic changes.

**Estimated touch surface:** ~6 implementation files + 2–3 test files + deprecation register + checklist sign-off. **No new architecture decisions required.**

---

## Section 1 — Current implementation inventory

### 1.1 Design Page runtime augment chain (post–Wave 1)

**Location:** `app.js` → `applyWorkflowStepRuntimePromptAugmentations` (≈11287–11310)

| Order | Function | DP active? | Relevance |
| ----- | -------- | ---------- | --------- |
| 1 | `applyLdGuidedLearningScaffoldContractToDraft` | Conditional | **Active** — `composeOnly` preservation slice when learner framing applies |
| 2 | `applyPedagogicCognitionContractScaffoldToDraft` | No | **Inactive** on DP (DLA/GAM only) |
| 3 | `applyEducationalQualityFrameworkPromptBlockToDraft` | No | **Inactive** on DP (Wave 1) |
| 4 | `applyInstructionalPatternPromptBlockToDraft` | No | **Inactive** on DP (GAM) |
| 5 | `applySelfDirectedLearnerPageStepScaffoldsToDraft` | No | **Inactive** on DP — rhetoric removed (Wave 1) |
| 6 | `applyLdTableFidelityContractToDraft` | No | **Inactive** on DP — embedded in compose |
| 7 | `applyLdMaterialsCopyContractToDraft` | No | **Inactive** on DP — embedded in compose |
| 8 | `applyPedagogicEnrichmentContractScaffoldToDraft` | No | **Inactive** on DP — PEL orientation/reasoning gated to `isDla` / `isGam` only (≈11184–11212) |
| 9 | `applyLdDesignPageComposeContractToDraft` | **Yes** | **Active** — primary DP contract |
| 10 | `applySprint38VisualAffordanceContractToDraft` | No | **Inactive** — passthrough (Wave 1) |
| 11 | `applyMathSafeOutputContractToDraft` | Yes | **Active** |
| 12 | `applyStrictJsonArtefactContractToDraft` | Yes | **Active** |
| **Gap** | *Thin assembly-coherence bridge* | **Missing** | **Not present** in chain |

### 1.2 R-40 — Wrapper transition / thin assembly-coherence

| File | Function / artefact | Active on DP path? | Runtime relevance |
| ---- | ------------------- | ------------------ | ----------------- |
| `lib/ld-design-page-compose-contract.js` | `FIELD_AUTHORIZING_LINES` — “overview / learning_purpose — thin assembly-coherence only (R-40)” | **Yes** | **Label only** — no procedural bridge |
| `lib/ld-materials-copy.js` | `ARCHIVAL_FIELD_LINES` / `PRESERVE_LINES` — same R-40 pointer | **Yes** (embedded in compose) | Transport-slot classification |
| `domains/.../domain-learning-design-step-patterns.md` §13 | `defaultPromptNotes`, `promptTemplate`, learner `promptInstruction` | **Yes** | “thin assembly-coherence” wording |
| `lib/ld-journey-assimilation.js` | `TRANSITION_LINES` | **No** | Lib soak — **not called** from compose |
| `lib/ld-guided-learning-scaffold.js` | `TRANSITION_LINES` | **No** on DP | `composeOnly` path excludes (Wave 1) |
| `lib/ld-authorial-exposition.js` | `TRANSITION_LINES` | **No** | Lib soak — **not injected** |
| `app.js` | `applyLdJourneyAssimilationContractToDraft` | **No** | Callable via test API only; **not** in augment chain |
| `app.js` | `buildPelOrientationContractPromptBlock` — stakes/tension/progression on overview | **No** on DP | PEL orientation **DLA-only** (≈11186) |

### 1.3 R-44 — Role separation

| File | Function / artefact | Active on DP path? | Runtime relevance |
| ---- | ------------------- | ------------------ | ----------------- |
| `lib/ld-authorial-exposition.js` | `ROLE_SEPARATION_LINES` | **No** | Full block in lib; **not injected** since Wave 1 |
| `app.js` | `applyLdAuthorialExpositionContractToDraft` | **No** | Test API / legacy helper; not in augment chain |
| `lib/ld-design-page-compose-contract.js` | — | — | **No R-44 text** |

### 1.4 R-45 — Transition quality across arc

| File | Function / artefact | Active on DP path? | Runtime relevance |
| ---- | ------------------- | ------------------ | ----------------- |
| `lib/ld-authorial-exposition.js` | `TRANSITION_LINES` (momentum, formulaic openers) | **No** | Lib soak |
| `lib/ld-journey-assimilation.js` | `TRANSITION_LINES` | **No** | Lib soak |
| Compose / domain | — | — | **No R-45 text** on path |

### 1.5 R-47 — Anti-redundancy

| File | Function / artefact | Active on DP path? | Runtime relevance |
| ---- | ------------------- | ------------------ | ----------------- |
| `lib/ld-authorial-exposition.js` | `ANTI_REDUNDANCY_LINES` | **No** | Lib soak |
| Compose / domain | — | — | **No R-47 text** on path |

### 1.6 R-83 — Readable assembly (guardrail)

| File | Function / artefact | Active on DP path? | Runtime relevance |
| ---- | ------------------- | ------------------ | ----------------- |
| `lib/ld-materials-copy.js` | `PRESERVE_LINES` L144 — “Readable page assembly applies to section structure, headings, ordering, and transport-slot assembly only” | **Yes** | **Partial** — narrowed wording present in L4 |
| `lib/ld-materials-copy.js` | `MATERIAL_PRESERVATION_OVERRIDES_PAGE_OPTIMISATION_LINES` (F40) | **Yes** | **Active** — anti-condense guardrail |
| `lib/ld-design-page-compose-contract.js` | `UPSTREAM_CONSUMPTION_LINES` — F40 pointer | **Yes** | **Active** |
| `domains/.../domain-learning-design-step-patterns.md` §13 | Purpose: “readable page artefact”; `what_this_step_does`: “readable page”; `promptTemplate`: “Assemble one readable…” | **Yes** | **Legacy residue** — ambiguous optimise cue |
| Renderer (`app.js` utilities) | Section icons, HTML layout for `overview` / `learning_purpose` | **Yes** | Presentation only — **not** R-83 generative |

### 1.7 Wrapper-slot population (`overview`, `learning_purpose`, `knowledge_summary`, `study_tips`)

| File | Function / artefact | Active? | Notes |
| ---- | ------------------- | ------- | ----- |
| `lib/ld-design-page-compose-contract.js` | `FIELD_AUTHORIZING_LINES` — transport vs archival | **Yes** | SSOT for slot policy |
| `lib/ld-materials-copy.js` | `ARCHIVAL_FIELD_LINES` | **Yes** | Duplicate policy (embedded) |
| `domains/.../domain-learning-design-step-patterns.md` §13 | `promptTemplate` — section ordering, thin assembly-coherence output line | **Yes** | Domain seed prompt |
| `app.js` | `utilityFindPageSectionContent`, renderer section mapping | **Yes** | **Consume** page JSON — no population logic |
| `app.js` | `applyPedagogicCognitionSemanticsToComposedPage` | **Yes** | Post-compose **preservation repair** — not wrapper authoring |

### 1.8 Assembly-time navigation logic

| File | Function | Active on DP? | Role |
| ---- | -------- | ------------- | ---- |
| `lib/ld-design-page-compose-contract.js` | `MEMBERSHIP_LINES`, `EPISODE_PLAN_LINES` | **Yes** | Layer 2 — membership, order, episode alignment |
| `lib/ld-design-page-compose-contract.js` | `CONTEXT_ACCESS_RULE_LINES` | **Yes** | Upstream artefact consumption |
| `app.js` | `repairLearnerPageCompositionFromUpstream` | **Yes** | Restore omitted activities/fields |
| `app.js` | `applyPageCompositionValidationForUtilitiesPage` | **Yes** | Structural closure validators |
| *Thin bridge* | — | **Missing** | **Only** generative navigation obligation absent |

### 1.9 Lib loading / bootstrap

| File | Relevance |
| ---- | --------- |
| `index.html` | Loads compose, materials-copy, guided-scaffold, authorial, journey — **no** thin-bridge script yet |
| `tests/prism-vm-lib-bootstrap.js` | `DEFAULT_LIBS` includes authorial/journey — **no** thin-bridge entry yet |
| `app.js` | `bootstrapLdDesignPageComposeInlineIfMissing` — fallback stub if lib missing |

---

## Section 2 — Gap analysis

Comparison: **current implementation** vs **[Thin Bridge Definition](SPRINT-56C-WAVE-2-THIN-ASSEMBLY-COHERENCE-BRIDGE-DEFINITION.md)**.

| Gap ID | Frozen requirement | Current state | Classification |
| ------ | ------------------ | ------------- | -------------- |
| G-01 | Single `LD-THIN-ASSEMBLY-COHERENCE-CONTRACT` on DP path | Not present | **Missing implementation** |
| G-02 | Transport-first gate (AC-01) before fallback prose | Policy in compose/materials labels only | **Partial implementation** |
| G-03 | R-44 wrapper slot discipline | In authorial lib only | **Legacy residue** (not on path) → merge into bridge |
| G-04 | R-45 forbidden patterns / bounded continuity | In authorial/journey libs only | **Legacy residue** → merge as constraints |
| G-05 | R-47 anti-redundancy across wrapper slots | In authorial lib only | **Legacy residue** → merge into bridge |
| G-06 | Volume caps (≤80 words / ≤60 words) | Not encoded | **Missing implementation** |
| G-07 | Forbidden patterns list (scheduling, facilitator, synthesis) | Scattered in removed modules; partial in materials F40 | **Partial implementation** |
| G-08 | R-40 consolidated in bridge SSOT | R-40 label in compose only | **Partial implementation** |
| G-09 | R-83 narrowed delimiter in domain §13 | Partial in materials-copy L144; domain still “readable page” | **Partial implementation** + **legacy residue** |
| G-10 | Layer 1 preserve & embed | Compose + L4 embed + repair | **Already compliant** |
| G-11 | Layer 2 organise | Membership, schema, episode plans | **Already compliant** |
| G-12 | No journey/authorial/rhetoric/EQF/VA on DP | Wave 1 gates pass | **Already compliant** |
| G-13 | `knowledge_summary` / `study_tips` transport-or-omit | Compose + domain | **Already compliant** |
| G-14 | Inject after compose + L4 preserve | N/A — no inject yet | **Missing implementation** |
| G-15 | Deprecation register bridge entry | Wave 1 entries only | **Missing implementation** (governance) |

---

## Section 3 — Contract strategy

### 3.1 Is a new contract required?

**Yes.** The frozen definition mandates **one** consolidated generative contract distinct from:

- `LD-DESIGN-PAGE-COMPOSE-CONTRACT` (Layer 1–2 + preservation — non-generative identity)
- Removed `LD-AUTHORIAL-EXPOSITION` / `LD-JOURNEY-ASSIMILATION` (rejected architecture)

Extending compose in place would **blur Layer 2 vs Layer 3** and inflate the already-large compose block.

### 3.2 Recommendation: `LD-THIN-ASSEMBLY-COHERENCE`

| Question | Recommendation |
| -------- | -------------- |
| **New file?** | **Yes** — `lib/ld-thin-assembly-coherence.js` |
| **Module ID** | `LD-THIN-ASSEMBLY-COHERENCE` |
| **Marker** | `LD-THIN-ASSEMBLY-COHERENCE-CONTRACT (auto-applied):` |
| **Extend existing contract?** | **No** for generative prose. **Yes** for cross-reference only in compose (`FIELD_AUTHORIZING_LINES` → pointer to bridge SSOT) |
| **Compose integration** | Replace inline R-40 clause with: “Obey appended LD-THIN-ASSEMBLY-COHERENCE-CONTRACT for wrapper-gap fallback — transport-first.” |
| **Runtime inject point** | `app.js` → `applyWorkflowStepRuntimePromptAugmentations`, **immediately after** `applyLdDesignPageComposeContractToDraft` (≈11305), **before** VA passthrough |

**New `app.js` surface (planned):**

- `resolveLdThinAssemblyCoherenceLib()`
- `bootstrapLdThinAssemblyCoherenceInlineIfMissing()` (minimal — match other lib patterns)
- `buildLdThinAssemblyCoherencePromptBlock(options)`
- `applyLdThinAssemblyCoherenceContractToDraft(draftText, context)` — DP only; idempotent via `coherenceAlreadyPresent()`

**Inject conditions:**

- `isWorkflowStepDesignPage(context)` === true
- Marker not already present

**Do not:**

- Call from `applyLdDesignPageComposeContractToDraft` (keeps compose non-generative)
- Re-enable `applyLdAuthorialExpositionContractToDraft` or `applyLdJourneyAssimilationContractToDraft`

### 3.3 Contract content outline (implementation spec)

| Section | Source mapping | Approx. lines |
| ------- | -------------- | ------------- |
| Transport-first gate | AC-01 | 5–8 |
| Permitted surfaces | `overview`, `learning_purpose` only | 3–5 |
| Volume caps | §2.4 definition | 3–4 |
| R-44 slot discipline | Merged from authorial `ROLE_SEPARATION` — **structural** only | 6–8 |
| R-47 de-duplication | Merged from authorial `ANTI_REDUNDANCY` | 3–5 |
| R-40 / R-45 continuity | Navigational glue; forbidden scheduling-only | 5–8 |
| Prohibited list | §4 PB-01–PB-13 abbreviated | 8–12 |
| Preservation pointer | Single line → compose + L4 | 2 |
| **Total** | | **~40–55 lines** prompt block |

---

## Section 4 — Domain strategy

### 4.1 Required updates (`domain-learning-design-step-patterns.md` §13)

| Location | Current | Required change | Package |
| -------- | ------- | ----------------- | ------- |
| **Purpose** bullet 1 | “Assemble one profile-aware **readable page** artefact” | “Assemble one profile-aware **self-contained, well-structured page** artefact” | W2.5 |
| **`what_this_step_does`** | “assembles a profile-aware **readable page**” | “assembles a profile-aware **self-contained page**” | W2.5 |
| **`promptTemplate` Task line** | “Assemble one **readable**, self-contained page” | “Assemble one **self-contained, well-structured** page” | W2.5 |
| **`defaultPromptNotes`** | References thin assembly-coherence | Add: “LD-THIN-ASSEMBLY-COHERENCE-CONTRACT at runtime for wrapper-gap fallback” | W2.3C |
| **`promptTemplate` Runtime authorities** | Lists compose, scaffold, math | Add thin bridge to authority list | W2.3C |
| **Learner `promptInstruction`** | thin assembly-coherence + transport | Add “transport-first; bridge fallback only when upstream body absent” | W2.3C |
| **New instruction block** | — | R-83 delimiter paragraph (Consolidation §6 approved wording) | W2.5 |

### 4.2 Bridge invocation conditions (domain text)

Domain should state explicitly:

1. Populate `overview` / `learning_purpose` from upstream LC/LO/LS when bodies exist.
2. **Omit** `knowledge_summary` when LC/KM unbound or no body (OQ-17).
3. **Omit** `study_tips` when no upstream closure/debrief body.
4. Apply **LD-THIN-ASSEMBLY-COHERENCE-CONTRACT** only for **remaining gaps** in `overview` / `learning_purpose`.
5. Never synthesize wrapper content from `knowledge_model`, GAM signals, or activity-row fields.

### 4.3 Files not requiring domain change

- Workflow brief inference rules (`readable page` intent matching in `app.js` ≈7159) — **out of scope**; brief elicitation ≠ DP compose mandate
- Other steps’ domain sections

---

## Section 5 — Test strategy

### 5.1 New tests

| File | Test | Purpose | Principle |
| ---- | ---- | ------- | --------- |
| `tests/sprint-56c-wave2-gates.test.js` | W2: DP runtime includes bridge marker | Bridge on path | CP-4 D6 / Layer 3 |
| same | W2: DP runtime excludes authorial/journey/rhetoric/EQF | Regression | Wave 1 guardrails |
| same | W2: bridge block contains transport-first gate | AC-01 | Preservation First |
| same | W2: bridge block contains volume cap + forbidden patterns | §2.4 | Assembly-Time Ownership |
| same | W2: bridge block prohibits synthesis on knowledge_summary/study_tips | PB-05/06 | OQ-17 |
| same | W2: compose still present; F40 preservation intact | Layer 1 regression | Preservation First |
| `tests/ld-thin-assembly-coherence.test.js` | Lib metadata, marker, idempotency, block shape | Contract unit tests | SSOT |
| same | `coherenceAlreadyPresent` detects marker | Idempotent inject | Plumbing |

### 5.2 Modified tests

| File | Change | Purpose |
| ---- | ------ | ------- |
| `tests/ld-design-page-compose-contract.test.js` | Assert compose **points to** bridge; R-40 detail **not** duplicated in compose | SSOT migration |
| `tests/sprint-56c-wave1-phase1-gates.test.js` | Optional: add bridge-present assertion | Wave 2 regression bundle |
| `tests/sprint-56c-wave1-phase2b-gates.test.js` | Update if domain Purpose/`what_this_step_does` wording changes | R-83 W2.5 |
| `tests/design-page-materials-fidelity.test.js` | Verify learner `promptInstruction` bridge invocation language | Domain alignment |

### 5.3 Preserved tests (no change expected)

| File | Reason |
| ---- | ------ |
| `tests/workflow-learner-page-journey-assimilation.test.js` | Asserts **exclusion** of journey on DP |
| `tests/workflow-learner-page-authorial-exposition.test.js` | Asserts **exclusion** of authorial on DP |
| `tests/workflow-educational-quality-framework-prompt.test.js` | Asserts EQF **exclusion** on DP |
| `tests/ld-authorial-exposition.test.js` | Lib soak unit tests |
| `tests/ld-journey-assimilation.test.js` | Lib soak unit tests |
| `tests/sprint-56c-wave1-phase{2a,3}-va-gates.test.js` | Orthogonal Wave 1 gates |
| `tests/workflow-learner-page-design-page-preservation.test.js` | Layer 1 preservation end-to-end |

### 5.4 Validation command (post-implementation)

```bash
node --test tests/sprint-56c-wave2-gates.test.js \
  tests/ld-thin-assembly-coherence.test.js \
  tests/sprint-56c-wave1-phase1-gates.test.js \
  tests/sprint-56c-wave1-phase2a-gates.test.js \
  tests/sprint-56c-wave1-phase2b-gates.test.js \
  tests/sprint-56c-wave1-phase3-va-gates.test.js \
  tests/ld-design-page-compose-contract.test.js \
  tests/workflow-learner-page-journey-assimilation.test.js \
  tests/workflow-learner-page-authorial-exposition.test.js
```

---

## Section 6 — Migration plan

Lowest-risk sequence. Each phase ends with targeted tests before proceeding.

### Phase W2.3A — Contract (lib only)

| Step | Action |
| ---- | ------ |
| A1 | Create `lib/ld-thin-assembly-coherence.js` per §3.3 outline |
| A2 | Create `tests/ld-thin-assembly-coherence.test.js` |
| A3 | **Do not** wire `app.js` yet |

**Exit:** Lib unit tests pass in isolation.

### Phase W2.3B — Runtime integration

| Step | Action |
| ---- | ------ |
| B1 | Add script to `index.html` |
| B2 | Add to `tests/prism-vm-lib-bootstrap.js` `DEFAULT_LIBS` + global export |
| B3 | Add `resolve` / `build` / `apply` / `bootstrap` in `app.js` |
| B4 | Insert `applyLdThinAssemblyCoherenceContractToDraft` in augment chain after compose |
| B5 | Export on `__PRISM_TEST_API` |

**Exit:** `sprint-56c-wave2-gates.test.js` runtime tests pass; Wave 1 exclusion gates still pass.

### Phase W2.3C — SSOT deduplication + domain bridge refs

| Step | Action |
| ---- | ------ |
| C1 | `ld-design-page-compose-contract.js` — replace R-40 inline mandate with bridge pointer |
| C2 | Optional: trim duplicate R-40 line in `ld-materials-copy.js` to pointer (avoid triple duplication) |
| C3 | Domain §13 — authority list + bridge invocation conditions (§4.2) |
| C4 | Update `tests/ld-design-page-compose-contract.test.js` |

**Exit:** Compose tests + phase2b gates + wave2 gates pass.

### Phase W2.5 — R-83 / domain cleanup

| Step | Action |
| ---- | ------ |
| D1 | Domain §13 Purpose, `what_this_step_does`, `promptTemplate` Task — remove ambiguous “readable” optimise cue |
| D2 | Add R-83 delimiter paragraph to `promptTemplate` Instructions |
| D3 | Optional: add `READABLE_ASSEMBLY_DELIMITER_LINES` cross-ref in compose or materials (single line pointer to domain) |
| D4 | Update phase2b / materials-fidelity tests if assertions reference exact Purpose strings |
| D5 | `SPRINT-56C-EXECUTION-CHECKLIST.md` — check W2.3 + W2.5 boxes |

**Exit:** Full Wave 2 gate bundle (§5.4) passes.

### Phase W2.GOV — Governance (parallel with W2.3C)

| Step | Action |
| ---- | ------ |
| G1 | `DEPRECATION-REGISTER.md` — bridge replaces R-40/R-44/R-45/R-47 on DP path |
| G2 | `SPRINT-56C-WAVE-2-IMPLEMENTATION-REPORT.md` (post-implementation, not this analysis) |

### Explicitly deferred (not blocking frozen architecture)

| Item | Package | Reason |
| ---- | ------- | ------ |
| SQ-1 / SQ-2 upstream packaging | W2.4 | Transport enabler — not bridge contract |
| R-38 `learning_purpose` transport-only policy expansion | W2.6 | Covered by bridge transport-first gate |
| Facilitator R-84/R-85 | W2.7 | SQ-F1/F2 |
| Lib soak deletion (authorial/journey) | Post-soak | Not on path |
| `buildPelOrientationContractPromptBlock` substantive overview line cleanup | Optional | **Inactive** on DP today |

---

## Section 7 — Risk assessment

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| **Bridge becomes new wrapper stack** | Medium | High | Single lib; volume caps; forbidden patterns; smaller than removed modules |
| **Accidental authorial/journey reinjection** | Low | High | Wave 1 regression gates in every wave2 run; do not wire old apply functions |
| **Compose + bridge contradiction** | Medium | Medium | W2.3C pointer migration; compose tests |
| **R-83 “readable page” misread during W2.5** | Medium | Medium | W2.5 explicit delimiter; tests on domain strings |
| **Duplicate policy in compose + materials + bridge** | Medium | Low | SSOT in bridge; pointers elsewhere |
| **Test false positive** (bridge text in domain only) | Low | Medium | Runtime augment tests via `applyWorkflowStepRuntimePromptAugmentations` |
| **Inline app.js bootstrap drift** | Low | Low | Prefer lib; minimal bootstrap stub only |
| **Scope creep into W2.4–W2.7** | Medium | Medium | This plan limits MVP to W2.3 + W2.5 |

---

## Section 8 — Implementation readiness recommendation

### 8.1 Readiness verdict

**Ready to implement** — frozen architecture is sufficiently specified; gap analysis identifies a **small, bounded** change set; no open ownership decisions.

### 8.2 Smallest safe change set (MVP)

| # | File | Change type |
| - | ---- | ----------- |
| 1 | `lib/ld-thin-assembly-coherence.js` | **Create** |
| 2 | `app.js` | **Add** inject + helpers (~50 lines) |
| 3 | `index.html` | **Add** script tag |
| 4 | `tests/prism-vm-lib-bootstrap.js` | **Add** lib entry |
| 5 | `lib/ld-design-page-compose-contract.js` | **Edit** — R-40 → pointer |
| 6 | `domains/.../domain-learning-design-step-patterns.md` §13 | **Edit** — W2.5 + bridge refs |
| 7 | `tests/sprint-56c-wave2-gates.test.js` | **Create** |
| 8 | `tests/ld-thin-assembly-coherence.test.js` | **Create** |
| 9 | `tests/ld-design-page-compose-contract.test.js` | **Edit** |
| 10 | `docs/.../DEPRECATION-REGISTER.md` | **Edit** |
| 11 | `SPRINT-56C-EXECUTION-CHECKLIST.md` | **Edit** — W2 sign-off |

**Not in MVP:** `app.js` removal of dormant `applyLdAuthorialExposition*` (optional cleanup later).

### 8.3 Implementer checklist (no new architecture decisions)

- [ ] Bridge is the **only** new generative inject on DP
- [ ] Transport-first ordering encoded in contract
- [ ] Surfaces limited to `overview` / `learning_purpose` gaps
- [ ] Volume caps and forbidden patterns present
- [ ] R-44/R-45/R-47 merged as **constraints**, not separate modules
- [ ] R-83 domain cleanup separate from bridge generative text
- [ ] Wave 1 exclusion gates remain green
- [ ] No Copilot runtime output claims in report

### 8.4 Post-implementation success criteria

Wave 2 architecture is **realised** when:

1. `LD-THIN-ASSEMBLY-COHERENCE-CONTRACT` appears on DP runtime augment path
2. R-40/R-44/R-45/R-47 obligations live in bridge SSOT (not authorial/journey inject)
3. R-83 narrowed wording in domain §13
4. Checklist §D retained items W2.3 + W2.5 checked
5. Gate tests §5.4 pass

---

## References

| Document | Role |
| -------- | ---- |
| [SPRINT-56C-WAVE-2-THIN-ASSEMBLY-COHERENCE-BRIDGE-DEFINITION.md](SPRINT-56C-WAVE-2-THIN-ASSEMBLY-COHERENCE-BRIDGE-DEFINITION.md) | Frozen normative target |
| [SPRINT-56B-IMPLEMENTATION-PLAN.md](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-IMPLEMENTATION-PLAN.md) | W2.3, W2.5 packages |
| [SPRINT-56C-EXECUTION-CHECKLIST.md](SPRINT-56C-EXECUTION-CHECKLIST.md) | W2 gate checkboxes |

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `SPRINT-56C-WAVE-2-IMPLEMENTATION-ANALYSIS.md` |
| Type | Implementation planning / gap analysis |
| Implementation | **Not authorised** by this document |
| Runtime changes | **None** |
