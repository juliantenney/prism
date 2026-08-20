# Sprint 56 — DLA Guided-Learning Scaffold SSOT Specification

**Status:** Design authority — Sprint 56 Phase 2 (DLA-03 / DLA-04)  
**SSOT owner:** `LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT`  
**SSOT module:** `lib/ld-guided-learning-scaffold.js`  
**SSOT emitter:** `applyLdGuidedLearningScaffoldContractToDraft` (sole DLA scaffold prose emitter after DLA-05)  
**Evaluation path:** Copy → `buildWorkflowStepInstructions` → `resolveStepPromptText` → `applyWorkflowStepRuntimePromptAugmentations`  
**Workflow profile (baseline):** Self-directed RNA/HCV learner-page · `step_design_learning_activities`  
**Evidence inputs:** [SPRINT-55-CLOSURE-REPORT.md](../sprints/2026-06-29-sprint-55-educational-product-experience/SPRINT-55-CLOSURE-REPORT.md) · [SPRINT-55-DLA-EMITTED-PROMPT-AUDIT.md](../sprints/2026-06-29-sprint-55-educational-product-experience/SPRINT-55-DLA-EMITTED-PROMPT-AUDIT.md) · [SPRINT-55-DLA-PROMPT-RATIONALISATION-AUDIT.md](../sprints/2026-06-29-sprint-55-educational-product-experience/SPRINT-55-DLA-PROMPT-RATIONALISATION-AUDIT.md) · [SPRINT-56-BASELINE-METRICS.md](../sprints/2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/SPRINT-56-BASELINE-METRICS.md)

---

## 1. Scope

### In scope (SSOT owns)

All **learner-facing scaffold prose quality rules** for DLA `activities[]` rows on learner-page briefs:

- Word-count ranges for scaffold fields listed in §4
- Mandatory scaffold field coverage (§5)
- Anti-terse / forbidden patterns (§6)
- Unified PRE-EMIT scaffold gate (§7)
- Single exemplar policy (§8)
- Explicit `learner_task` vs scaffold brevity rule

### Out of scope (orthogonal — retain separate emitters)

| Concern | Owner | Marker |
|---------|-------|--------|
| Table spec shape | `lib/ld-table-fidelity.js` | `LD-TABLE-FIDELITY` |
| Math notation | `lib/ld-math-render.js` | `LD-MATH-RENDER` |
| Obligation / material population | Domain-pack base `Task:` template | Base template |
| Episode-plan population | `applyEpisodePlanDlaPopulationPromptBlockToDraft` | Conditional block |
| Material shape + timeline | `buildSelfDirectedLearnerPageMaterialShapePromptBlock`, timeline block | Auto-applied markers |
| Design Page compose preservation | `lib/ld-design-page-compose-contract.js` | `LD-DESIGN-PAGE-COMPOSE-CONTRACT` (Design Page only; pointer to SSOT, no duplicate ranges) |

### Non-goals

- New learner-facing fields or schema changes
- Capture-side repair, resolver, storage, rehydration, or post-generation normalization
- GAM or Design Page implementation (Design Page references SSOT by pointer only in later sprint work)

### Preservation constraint (Sprint 55 → Sprint 56)

Sprint 55 scaffold **semantics** must survive rationalisation:

- Word floors, anti-terse intent, PRE-EMIT self-check, and evaluator behaviour in `evaluateGuidedLearningScaffoldEvidence` remain authoritative
- Base domain-pack obligation population (`required_materials`, IFP gates, DLA-WB rows) is **not** consolidated into scaffold SSOT
- Capture-side repair (`applyGuidedLearningScaffoldRepairToDlaCapture`) remains for non-Copy paths; it must read ranges from SSOT module constants after DLA-05

---

## 2. Current duplicated scaffold layers

Baseline (Sprint 55 emitted prompt): **5 overlapping scaffold contract layers** inside `applySelfDirectedLearnerPageStepScaffoldsToDraft`, totalling ~19,000 chars of redundant guidance.

| # | Layer | Emitter / block | Baseline chars | Duplicates SSOT on |
|---|-------|-----------------|----------------:|-------------------|
| 1 | Learner-page activity framing | `buildSelfDirectedLearnerPageActivityFramingPromptBlock` | ~2,822 | preamble purpose, mandatory cognition set, archetype presence gate |
| 2 | OUTPUT CONTRACT (learner-facing page) | `buildLearnerPageDlaOutputContractOverrideBlock` | ~5,011 | all scaffold ranges, field semantics, some non-scaffold brevity rules |
| 2f | Schema line reinforcement | `augmentSelfDirectedDlaDraftOutputSection` | ~hundreds | field names only (presence-only gate) |
| 3 | LD-ACTIVITY-PREAMBLE-EXPOSITION | `applyLdActivityPreambleExpositionContractToDraft` | 2,945 | preamble 50–120, forbidden openers, weak/strong exemplars |
| 4 | LD-COGNITION-ORIENTATION | `applyLdCognitionOrientationContractToDraft` | 3,172 | mandatory set, 35–80 fields, weak/strong exemplars, **presence-only PRE-EMIT** |
| 5 | LD-GUIDED-LEARNING-SCAFFOLD | `applyLdGuidedLearningScaffoldContractToDraft` | 5,269 | ranges, exemplars, **word-count PRE-EMIT** (authoritative but late) |

**Adjacent duplication (not SSOT, trim candidates for DLA-07):**

| Block | Chars | Competition mechanism |
|-------|------:|----------------------|
| LD-SELF-DIRECTED-RHETORIC (DLA rider) | 4,230 | Restates OUTPUT CONTRACT pointers, facilitator ban |
| Self-directed activity JSON example | ~3,032 | Compliant shape — **retain once** inside or adjacent to SSOT |
| EDUCATIONAL-QUALITY-FRAMEWORK | 1,751 | “Reduce scaffolding” vs minimum prose |
| PEL orientation + reasoning | 1,646 | “One reasoning cue set” cardinality minimisation |

**Duplication matrix (source pairs):**

| Source A | Source B | Duplicated content |
|----------|----------|-------------------|
| Base `activities[]` line | OUTPUT CONTRACT | preamble + cognition REQUIRED |
| Activity framing | OUTPUT CONTRACT | 50–120 preamble, field list |
| OUTPUT CONTRACT | LD-ACTIVITY-PREAMBLE | preamble purpose, forbidden openers |
| OUTPUT CONTRACT | LD-COGNITION | 35–80 fields, mandatory set |
| OUTPUT CONTRACT | LD-GUIDED | ranges, PRE-EMIT, exemplars |
| LD-COGNITION | LD-GUIDED | weak/strong RNA exemplars |
| LD-ACTIVITY-PREAMBLE | LD-GUIDED | preamble rules |

---

## 3. Target SSOT architecture

### Composition after DLA-05 (DLA Copy path)

```
Domain pack promptTemplate (~13k)                    ← obligation population unchanged
  ↓ applyWorkflowStepRuntimePromptAugmentations
  ├─ applyEducationalQualityFrameworkPromptBlockToDraft   ← trim/qualify only (DLA-07); not SSOT
  ├─ applySelfDirectedLearnerPageStepScaffoldsToDraft
  │    ├─ material shape + timeline blocks                ← orthogonal (retain)
  │    ├─ OUTPUT CONTRACT (THIN INDEX)                    ← field list + pointer to SSOT; no ranges
  │    ├─ Self-directed activity JSON example             ← once; compliant (retain or embed in SSOT)
  │    ├─ augmentSelfDirectedDlaDraftOutputSection        ← field names only; pointer to SSOT for quality
  │    └─ applyLdGuidedLearningScaffoldContractToDraft    ← **SOLE scaffold authority**
  ├─ applyLdTableFidelityContractToDraft                  ← orthogonal
  ├─ applyPedagogicEnrichmentContractScaffoldToDraft      ← trim pointers (DLA-07)
  └─ applyMathSafeOutputContractToDraft                   ← orthogonal
```

**Removed from DLA emission (deprecated — pointer or silence):**

- `buildSelfDirectedLearnerPageActivityFramingPromptBlock` scaffold prose
- OUTPUT CONTRACT duplicate scaffold prose (ranges, exemplars, preamble/cognition depth)
- `applyLdActivityPreambleExpositionContractToDraft` full block
- `applyLdCognitionOrientationContractToDraft` full block
- LD-COGNITION PRE-EMIT checklist
- Duplicate weak/strong exemplar sets in deprecated blocks
- LD-SELF-DIRECTED-RHETORIC DLA rider overlap (facilitator ban → ≤3 lines in SSOT or thin rhetoric pointer)

### SSOT block structure (single emission)

`LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT (auto-applied)` contains, in order:

1. **Module header** — scope, learner_task vs scaffold brevity rule
2. **Authoritative field ranges** — §4 (one line per field)
3. **Field semantics** — what each field must teach (condensed from current FIELD_LINES)
4. **Mandatory coverage** — §5
5. **Anti-terse / forbidden patterns** — §6
6. **Single exemplar contrast set** — §8 (RNA-relevant weak/strong)
7. **Compliant JSON example reference** — pointer to embedded example or inline once
8. **Unified PRE-EMIT scaffold gate** — §7 (presence **and** word minimums)

### Pointer rule (governance)

Any non-SSOT block that mentions scaffold quality may use **at most 2 lines** referencing `LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT` — no restated numeric ranges, exemplars, or PRE-EMIT checklists.

### Size budget

| Metric | Baseline | Post DLA-05 target |
|--------|----------|-------------------|
| Emitted core prompt | 49,949 chars | ≤32,000 chars |
| Scaffold SSOT block | 5,269 (within stack) | ~6,500 (single authority, net stack reduction) |
| Duplicate scaffold chars | ~19,000 | ≤2,000 |

---

## 4. Authoritative scaffold field ranges

**One numeric range per field.** No `25–80`, no duplicate `30–70` on `transfer_or_application_task`. These values are the SSOT; all emitters and evaluators must align.

| Field | Min words | Max words | Notes |
|-------|----------:|----------:|-------|
| `activity_preamble` | 50 | 120 | Word count authoritative; “2–4 sentences” is guidance only, not a competing floor |
| `reasoning_orientation` | 35 | 80 | |
| `self_explanation_prompt` | 35 | 80 | **Supersedes** OUTPUT CONTRACT `25–80` and lib baseline `25–80` |
| `conceptual_contrast_prompt` | 35 | 80 | |
| `argument_structure_hint` | 35 | 80 | |
| `transfer_or_application_task` | 35 | 80 | **Supersedes** OUTPUT CONTRACT `30–70` duplicate |
| `expected_output` | 30 | 70 | Quality-target prose; AS-05 “observable evidence” is a label semantics note, not a competing max |
| `intellectual_coherence_bridge` | 30 | 60 | Required from activity 2 onward when sequence has prior activity |
| `support_note` | 20 | 70 | Optional when used |

### Fields explicitly outside scaffold word SSOT

| Field | Rule | Owner |
|-------|------|-------|
| `learner_task` | May stay concise and procedural | OUTPUT CONTRACT thin index |
| `uncertainty_tension_prompt` | Optional; if present, “one sentence” allowed — **not** a scaffold word-floor field | OUTPUT CONTRACT thin index |
| `intellectual_frame` | 1–2 sentences when used — **not** scaffold SSOT | OUTPUT CONTRACT thin index |
| `reasoning_orientation_prompt` | Legacy/alternate key; not in word-floor table | Cognition evaluator only if populated |

### Evaluator alignment

After DLA-05, `FIELD_WORD_RANGES` in `lib/ld-guided-learning-scaffold.js` must match this table exactly (`self_explanation_prompt` and `transfer_or_application_task` updated from Sprint 55 lib values).

---

## 5. Mandatory scaffold fields

### Per activity (DLA learner-page)

Every activity object in `activities[]` must include:

| Requirement | Rule |
|-------------|------|
| `activity_preamble` | Present, non-empty, **≥50 words** |
| `expected_output` | Present, non-empty, **≥30 words** (quality target, not deliverable label) |
| Cognition scaffold | At least **one** non-empty field from: `reasoning_orientation`, `self_explanation_prompt`, `conceptual_contrast_prompt`, `argument_structure_hint`, `transfer_or_application_task` |
| Procedural-only rows | **Forbidden** — rows with only `title`, `learner_task`, `expected_output`, `required_materials` |

### Sequence rules

| Field | Rule |
|-------|------|
| `intellectual_coherence_bridge` | Required on every activity **after the first** in a multi-activity sequence (≥30 words when present) |
| `support_note` | Optional; if present, must meet 20–70 words |

### Supersedes

- LD-COGNITION `MANDATORY PER ACTIVITY` block (deprecated as standalone)
- Activity framing archetype presence-only checklist
- `augmentSelfDirectedDlaDraftOutputSection` presence-only reinforcement

Mandatory coverage is enforced in the **unified PRE-EMIT gate** (§7) with word minimums — not presence-only.

---

## 6. Anti-terse / forbidden patterns

### Global forbidden on scaffold fields

- Labels, slogans, metadata tags, topic stubs
- One-line prompt stems (“Explain your answer.”)
- Arrow chains without explanatory prose (`mechanism → function`, `criteria → comparison → judgement`)
- Shorthand tags and task-direction stubs
- Restating `learner_task` verbatim in scaffold fields

### Field-specific forbidden

| Field | Forbidden |
|-------|-----------|
| `activity_preamble` | Openers: Begin by…, Develop understanding of…, Analyse how…, In this activity you will…; procedural task verbs as first sentence; topic labels without orienting reasoning |
| `reasoning_orientation` | Arrow-only scaffolds; single-line labels; restating `learner_task` |
| `conceptual_contrast_prompt` | Contrast X vs Y one-liners without comparison criteria |
| `argument_structure_hint` | Bare arrow scaffolds without learner-facing sentences |
| `self_explanation_prompt` | “Explain your answer” and equivalent single-token stems |
| `expected_output` | “Completed analysis table…” labels without quality criteria |
| `intellectual_coherence_bridge` | Scheduling-only transitions (Next complete…, Then do…, Move to Activity 2…) |

### `learner_task` brevity rule (instruction competition fix)

> **`learner_task` may stay concise and procedural.** Scaffold fields (`activity_preamble`, cognition fields, `expected_output`, bridges) **must not** stay concise — they require full word-floor prose. Do not generalise brevity from `learner_task` to scaffold fields.

### Evaluator patterns (retain in lib)

`TERSE_LABEL_PATTERNS`, `PROCEDURAL_PREAMBLE_RE`, and `scaffoldLooksLikeTerseLabel()` in `lib/ld-guided-learning-scaffold.js` remain the runtime terse detectors; prompt FORBIDDEN list must stay aligned with them.

---

## 7. Unified PRE-EMIT scaffold gate

**One gate system.** Replaces LD-COGNITION PRE-EMIT (presence-only) and consolidates DLA PRE-EMIT SCAFFOLD GATE (word-count).

### Gate marker

```
DLA PRE-EMIT SCAFFOLD GATE (mandatory before returning learning_activities JSON)
```

### Gate rules (all mandatory)

1. **Presence + word minimum:** Every populated scaffold field meets its §4 range minimum.
2. **Mandatory coverage:** Every activity satisfies §5 (preamble, expected_output, ≥1 cognition scaffold field).
3. **Anti-terse:** No §6 forbidden patterns on any scaffold field.
4. **Self-check:** Count words in every scaffold field; rewrite any field below its minimum before emit.
5. **No procedural-only rows.**

### Deprecate (must not appear as separate gates in DLA prompt)

| Deprecated gate | Reason |
|-----------------|--------|
| LD-COGNITION PRE-EMIT CHECKLIST | Presence-only; satisfied by terse strings |
| Activity framing archetype presence gate | Folded into §5 |
| IFP-05 preamble leg (presence only) | Clarified: non-empty insufficient — word minimum in SSOT |
| Schema line reinforcement (quality prose) | Field names only + SSOT pointer |
| PEL “one reasoning cue set” | Cardinality minimisation conflicts with word floors (DLA-07 trim) |

### Gate placement

- Emit **once** at end of SSOT block (repeated summary acceptable: early field-range table + single PRE-EMIT section — not two competing checklists).
- Optional future work (not DLA-05 minimum): move SSOT block earlier in augmentation order to reduce instruction competition from obligation-population mass — document in DLA-02 layer map if pursued.

---

## 8. Exemplar policy

### Rule: one exemplar system

| Retain | Remove |
|--------|--------|
| **One** weak/strong contrast set inside SSOT (RNA-relevant) | LD-ACTIVITY-PREAMBLE exemplars |
| **One** compliant self-directed activity JSON example (Marx or RNA — compliant lengths) | LD-COGNITION weak/strong set |
| | LD-GUIDED duplicate if merged into single set |
| | LD-COGNITION Strong `self_explanation_prompt` (~17 words) — **non-compliant** |

### Weak vs Strong policy

| Type | Purpose | Word floor |
|------|---------|------------|
| Weak | Intentionally terse — shows failure pattern | Below floor (intentional) |
| Strong | Model to imitate | **Must meet §4 minimum** for that field |

### Required Strong exemplar fields (minimum set)

Include weak/strong pairs for at least:

- `reasoning_orientation`
- `conceptual_contrast_prompt`
- `argument_structure_hint`
- `expected_output`

`self_explanation_prompt` Strong exemplar must be **≥35 words** (fixes Sprint 55 LD-COGNITION ~17w contradiction).

### JSON example

Retain the self-directed activity JSON example (~3,032 chars) as the **sole positive structural exemplar** — either immediately before or after SSOT block, not duplicated in OUTPUT CONTRACT.

---

## 9. Deprecation mapping

| Deprecated authority | Superseded by | DLA-05 action |
|---------------------|---------------|---------------|
| Learner-page activity framing scaffold prose | SSOT §5–§7 | Stop appending `buildSelfDirectedLearnerPageActivityFramingPromptBlock` for DLA; retain archetype routing in thin OUTPUT CONTRACT index if needed |
| OUTPUT CONTRACT duplicate scaffold prose | SSOT + thin index | `buildLearnerPageDlaOutputContractOverrideBlock` — remove ranges, exemplars, depth prose; keep non-scaffold field list |
| `LD-ACTIVITY-PREAMBLE-EXPOSITION-CONTRACT` | SSOT §4–§6 | `applyLdActivityPreambleExpositionContractToDraft` — no-op for DLA emission |
| `LD-COGNITION-ORIENTATION-CONTRACT` | SSOT §4–§7 | `applyLdCognitionOrientationContractToDraft` — no-op for DLA emission |
| LD-COGNITION PRE-EMIT | SSOT §7 | Remove from cognition block |
| Duplicate weak/strong exemplar sets | SSOT §8 | Delete from deprecated blocks |
| `self_explanation_prompt` 25–80 | SSOT 35–80 | Remove from OUTPUT CONTRACT and lib constants |
| `transfer_or_application_task` 30–70 (duplicate) | SSOT 35–80 | Remove from OUTPUT CONTRACT |
| LD-SELF-DIRECTED-RHETORIC DLA rider overlap | SSOT header + thin pointer | Trim to ≤3 lines or silence for DLA |

**Lifecycle:** Log each deprecation in `docs/development/prompt-contracts/DEPRECATION-REGISTER.md` (DLA-09).

**Lib modules retained (not deleted):** `ld-activity-preamble-exposition.js`, `ld-cognition-orientation.js` — may still serve evaluators, tests, or non-DLA steps until formally removed; DLA prompt path must not emit full blocks.

---

## 10. Implementation notes for DLA-05

### Producing path

```
Copy → buildWorkflowStepInstructions
  → resolveStepPromptText
    → applyWorkflowStepRuntimePromptAugmentations
      → applySelfDirectedLearnerPageStepScaffoldsToDraft  ← primary edit surface
        → applyLdGuidedLearningScaffoldContractToDraft      ← SSOT builder
```

### Implementation sequence

1. **Update SSOT module** (`lib/ld-guided-learning-scaffold.js`):
   - Align `FIELD_WORD_RANGES` to §4
   - Consolidate prompt text: single exemplar set, unified PRE-EMIT
   - Export constants for tests and capture repair

2. **Thin OUTPUT CONTRACT** (`buildLearnerPageDlaOutputContractOverrideBlock` in `app.js`):
   - Keep: non-scaffold fields, `learner_task` brevity, optional field semantics (`uncertainty_tension_prompt`, `intellectual_frame`)
   - Remove: all §4 ranges, exemplars, preamble/cognition depth, conflicting 25–80 / duplicate 30–70

3. **Gate deprecated emitters** in `applySelfDirectedLearnerPageStepScaffoldsToDraft`:
   - Skip `applyLdActivityPreambleExpositionContractToDraft` for DLA
   - Skip `applyLdCognitionOrientationContractToDraft` for DLA
   - Skip or drastically trim activity framing block for DLA
   - Trim `applyLdSelfDirectedRhetoricContractToDraft` DLA rider

4. **Schema reinforcement** (`augmentSelfDirectedDlaDraftOutputSection`):
   - Field names + “see LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT for prose quality” — no duplicate ranges

5. **Tests** (`tests/sprint-55-guided-learning-quality.test.js`, new Sprint 56 guards):
   - Assert SSOT marker **once**
   - Assert deprecated markers **absent** (full text) on DLA emitted prompt
   - Assert no conflicting range regex (25–80; duplicate transfer 30–70)
   - Update char count ceiling: ≤32,000 emitted core

6. **Do not touch** (unless DLA-07):
   - Base domain-pack obligation population
   - `applyGuidedLearningScaffoldRepairToDlaCapture` (align constants only)
   - LD-TABLE-FIDELITY, LD-MATH-RENDER emitters

### Estimated savings (from rationalisation audit)

| Deletion / merge | Est. chars |
|------------------|----------:|
| Standalone LD-ACTIVITY-PREAMBLE | ~2,945 |
| Standalone LD-COGNITION | ~3,172 |
| Activity framing prose | ~2,822 |
| OUTPUT CONTRACT duplicate prose | ~3,500 |
| Rhetoric DLA rider trim | ~3,500 |
| Duplicate exemplar sets | ~2,000 |
| **Total recoverable (scaffold)** | **~19,000** |

---

## 11. Validation checks

### Automated (CI — DLA-01, DLA-05, GOV-02)

| Check | Pass criterion |
|-------|----------------|
| Emitted core char count | RNA HCV DLA ≤32,000 (baseline regression floor 49,949 until DLA-05 merges) |
| SSOT marker count | `LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT (auto-applied)` exactly **1** |
| Deprecated marker absence | No full `LD-ACTIVITY-PREAMBLE-EXPOSITION-CONTRACT`, `LD-COGNITION-ORIENTATION-CONTRACT` blocks in DLA emitted prompt |
| Range conflict scan | No `25–80` on `self_explanation_prompt`; no `transfer_or_application_task` 30–70 alongside 35–80 |
| Per-field range uniqueness | Each §4 field appears with **one** min–max pair in emitted prompt |
| Exemplar fingerprint | `reasoning_orientation — Weak` count ≤1; `reasoning_orientation — Strong` count ≤1 |
| PRE-EMIT gate count | One `DLA PRE-EMIT SCAFFOLD GATE` block; no separate `LD-COGNITION` PRE-EMIT checklist |

### Evaluator (existing — align constants)

| Check | Pass criterion |
|-------|----------------|
| `evaluateGuidedLearningScaffoldEvidence` | Terse RNA fixtures fail; rich exemplar passes |
| `fieldFailsScaffoldQuality` | Uses §4 ranges after lib update |
| Capture repair | Still expands terse fixtures when invoked (constants sync) |

### Manual (DLA-08)

| Check | Pass criterion |
|-------|----------------|
| Copy → external model | RNA/HCV sample run: ≥80% activities meet word floors |
| Spot-check record | Document model, date, activity IDs, word counts |

### Brief matrix (regression)

Before merge, verify emitted prompt on:

- Self-directed learner-page (RNA/HCV baseline)
- Facilitated learner-page (if framing block changes affect facilitated branch)

---

## Traceability

| Backlog item | This spec section |
|--------------|-------------------|
| DLA-02 | §2, §3 |
| DLA-03 | §4 |
| DLA-04 | §7 |
| DLA-05 | §3, §9, §10 |
| DLA-06 | §8 |
| DLA-09 | §9 |
| GOV-01 | Pointer rule §3, deprecation §9 |

**Governance:** [SPRINT-56-PROMPT-GOVERNANCE.md](../sprints/2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/SPRINT-56-PROMPT-GOVERNANCE.md)
