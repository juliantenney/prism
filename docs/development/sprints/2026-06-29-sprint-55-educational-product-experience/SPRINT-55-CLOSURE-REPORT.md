# Sprint 55 — Closure Report

**Sprint:** 55 — Educational Product Experience  
**Closed:** 2026-07-01  
**Successor:** Sprint 56 — Prompt Rationalisation & Contract Consolidation  
**Evidence index:** [SPRINT-55-DLA-EMITTED-PROMPT-AUDIT.md](SPRINT-55-DLA-EMITTED-PROMPT-AUDIT.md) · [SPRINT-55-DLA-PROMPT-RATIONALISATION-AUDIT.md](SPRINT-55-DLA-PROMPT-RATIONALISATION-AUDIT.md) · [SPRINT-55-GUIDED-LEARNING-QUALITY-AUDIT.md](SPRINT-55-GUIDED-LEARNING-QUALITY-AUDIT.md)

---

## Executive Summary

Sprint 55 delivered learner-product presentation improvements and a **guided-learning scaffold quality programme** (contracts, evaluators, capture-side repair, and DLA runtime prompt augmentation). Scaffold word-count targets and PRE-EMIT self-check instructions were successfully added to the **emitted DLA Copy prompt**. Despite this, **externally generated DLA outputs evaluated from copied prompts continued to violate scaffold length and prose-quality targets**.

Investigation traced the evaluation path to **prompt-copy generation only** — not capture repair, resolver, storage, or post-generation normalization. Root cause is **not absence of Sprint 55 rules** but **prompt accretion**: ~13k base domain-pack prompt expanded to ~50k emitted prompt via layered runtime augmentations, ~19k chars of duplicated scaffold guidance, conflicting word-count contracts, presence-only pre-emit gates that precede the authoritative quality gate, and instruction competition that biases models toward terse scaffold strings.

Sprint 55 is closed with scaffold **quality requirements codified** and **prompt architecture debt formally documented**. Remediation moves to Sprint 56 under rationalisation and contract consolidation — not additional prompt layers.

---

## Sprint Objective

Transform the exported learner page into a fully realised educational product experience, including **guided-learning scaffold prose quality** on DLA-generated activity rows (existing fields only; no new schema).

---

## Scope

**In scope (delivered or advanced):**

- Beat-first rendering and product-layer export improvements (per charter)
- `lib/ld-guided-learning-scaffold.js` — evaluator, repair, PRE-EMIT lines, word ranges
- DLA / Design Page prompt contract updates (OUTPUT CONTRACT, cognition, preamble, rhetoric)
- Capture-side scaffold repair and preservation wiring
- Test suite: `tests/sprint-55-guided-learning-quality.test.js`
- Formal prompt audits (emitted prompt + rationalisation)

**Explicitly out of scope for Sprint 55 closure:**

- Prompt rationalisation implementation
- Removal of superseded augmentation layers
- GAM / Design Page prompt accretion audits (deferred to Sprint 56)

---

## Implemented Changes

| Area | Summary |
|------|---------|
| **Scaffold module** | `LD-GUIDED-LEARNING-SCAFFOLD` — `FIELD_WORD_RANGES`, terse detection, `DLA_PRE_EMIT_LINES`, repair on capture |
| **DLA prompt augmentation** | OUTPUT CONTRACT overrides, activity framing, JSON example, preamble/cognition/guided contracts appended at runtime |
| **Supporting libs** | `ld-cognition-orientation`, `ld-activity-preamble-exposition`, `ld-self-directed-rhetoric` updates |
| **Capture path** | `applyGuidedLearningScaffoldRepairToDlaCapture`, sync to textarea/state (not on Copy generation path) |
| **Tests** | Terse fixture failure, repair pass, runtime prompt asserts for word ranges and PRE-EMIT |
| **Audits** | Emitted-prompt audit; rationalisation audit with char-level inventory |

---

## Validated Outcomes

| Outcome | Evidence |
|---------|----------|
| Sprint 55 scaffold ranges present in emitted DLA prompt | Emitted-prompt audit — all targets YES |
| PRE-EMIT self-check present in emitted prompt | Tests + emitted-prompt audit |
| Evaluator correctly fails terse DLA fixtures | `evaluateGuidedLearningScaffoldEvidence` tests |
| Repair expands terse fixtures when invoked | Capture-path tests |
| Copy path does not invoke repair | Trace: Copy → `buildWorkflowStepInstructions` → augmentations only |
| Prompt accretion quantified | 13,201 → 49,949 chars; +36,748 augmentation |
| Duplication quantified | ~19k chars redundant scaffold guidance |
| Conflicts catalogued | 7 conflict classes; 9+ numeric rule statements |
| Presence-only gates catalogued | 7 gates weakening 1 late word-count gate |

---

## Failed Assumptions

| Assumption | Disposition |
|------------|-------------|
| Strengthening runtime prompt contracts would cause external models to emit compliant scaffold prose | **Disproved** for Copy-evaluated artefacts |
| Adding PRE-EMIT word-count gate at end of prompt would dominate earlier instructions | **Disproved** — late gate loses to ~35k chars of competing text |
| Capture-side repair addresses user-visible Copy generation quality | **Disproved** for stated evaluation workflow (no paste-back) |
| One additional contract block is low-risk when requirements already exist elsewhere | **Disproved** — accretion without supersession increases conflict and dilution |
| Sprint 55 charter exclusion of “prompt contract redesign” prevented all prompt edits | **Partially disproved** — necessary augmentations were added; redesign debt remains |

---

## Key Discoveries

1. **Emitted prompt contains Sprint 55 requirements** — failure is architectural, not a missing-instruction bug.
2. **~82% of augmentation** (+30,164 chars) comes from a single step: `applySelfDirectedLearnerPageStepScaffoldsToDraft`.
3. **Five overlapping contract layers** repeat the same scaffold rules (framing, OUTPUT CONTRACT, preamble, cognition, guided).
4. **Numeric conflicts** (25–80 vs 35–80; 30–70 vs 35–80) appear in OUTPUT CONTRACT before authoritative PRE-EMIT.
5. **Short “Strong” exemplars** in LD-COGNITION contradict 35–80 targets.
6. **Presence-only pre-emits** (IFP-05, LD-COGNITION checklist) allow terse strings to satisfy “gates” before word-count PRE-EMIT.
7. **Instruction competition:** obligation-population framing + `Return only the JSON` + `learner_task may stay concise` + EQF “reduce scaffolding” vs minimum prose requirements.

---

## Lessons Learned

1. **Do not add prompt layers without superseding prior layers** — accretion is the default failure mode.
2. **A single authoritative contract (SSOT) per concern** beats multiple modules each appending the same ranges and exemplars.
3. **Presence gates must not precede quality gates** — non-empty checks teach models that short strings suffice.
4. **Exemplars must meet the same numeric floors they teach** — labelled “Strong” short strings override word-range lines.
5. **Measure emitted prompt size** when evaluating instruction changes — char growth correlates with dilution, not compliance.
6. **Align evaluation path with fix path** — capture repair does not help Copy-only generation workflows.
7. **Rationalise before augmenting** — Sprint 56 principle derived from Sprint 55 evidence.

---

## Final Assessment

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Product / export goals | Advanced | Per parallel charter tracks |
| Scaffold requirement codification | **Complete** | Libs, tests, emitted prompt |
| Scaffold output quality (Copy path) | **Unresolved** | Terse outputs persist |
| Root cause identification | **Complete** | Accretion, duplication, conflict |
| Remediation | **Deferred** | Sprint 56 |

**Sprint 55 closure recommendation:** Close as **requirements-and-evidence complete**, **output-quality unresolved**, hand off to Sprint 56 for rationalisation.

---

## Formal Sprint Outcome

### What Sprint 55 achieved

- Codified Sprint 55 scaffold word ranges and anti-terse rules in `LD-GUIDED-LEARNING-SCAFFOLD` and related libs.
- Wired runtime prompt augmentation so **emitted DLA Copy prompts include** ranges, PRE-EMIT gate, and self-check.
- Built evaluator and capture-side repair for downstream PRISM paths.
- Produced **measurable baseline** for prompt size, duplication, conflicts, and gates.
- Formalised audits as governance evidence.

### What Sprint 55 disproved

- That **more prompt text** alone fixes terse external generation when duplicates and conflicts coexist.
- That capture repair fixes **Copy-evaluated** DLA quality.
- That PRE-EMIT at prompt tail automatically wins attention over obligation-population and presence-only gates.

### What Sprint 55 revealed

- **Prompt accretion architecture** as primary blocker to instruction effectiveness.
- **~19k chars** of redundant scaffold guidance in DLA emitted prompt.
- **Layering pattern** likely replicated on GAM and Design Page (audit recommended Sprint 56 P2/P3).

### What remains unresolved

- Externally generated DLA scaffold prose meeting word-range targets on Copy path.
- Consolidation of five scaffold contract layers into one SSOT.
- Alignment of conflicting word-count rules and exemplars.
- GAM / Design Page prompt rationalisation.
- Governance to prevent future accretion.

---

## Evidence

| Artefact | Location |
|----------|----------|
| DLA emitted-prompt audit | [SPRINT-55-DLA-EMITTED-PROMPT-AUDIT.md](SPRINT-55-DLA-EMITTED-PROMPT-AUDIT.md) |
| DLA prompt rationalisation audit | [SPRINT-55-DLA-PROMPT-RATIONALISATION-AUDIT.md](SPRINT-55-DLA-PROMPT-RATIONALISATION-AUDIT.md) |
| Guided learning quality audit | [SPRINT-55-GUIDED-LEARNING-QUALITY-AUDIT.md](SPRINT-55-GUIDED-LEARNING-QUALITY-AUDIT.md) |
| Sprint 56 baseline metrics | [SPRINT-56-BASELINE-METRICS.md](../2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/SPRINT-56-BASELINE-METRICS.md) |
| Tests | `tests/sprint-55-guided-learning-quality.test.js` |
| Scaffold module | `lib/ld-guided-learning-scaffold.js` |

---

## Sign-off

Sprint 55 closed **2026-07-01**. Sprint 56 opened for prompt rationalisation and contract consolidation per [SPRINT-56-CHARTER.md](../2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/SPRINT-56-CHARTER.md).
