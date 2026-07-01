# Sprint 56 — Baseline Metrics

**Source:** Sprint 55 formal audits (2026-07-01)  
**Workflow profile:** Self-directed RNA/HCV learner-page · `step_design_learning_activities` · Copy path  
**Purpose:** Before/after evaluation of Sprint 56 rationalisation  

---

## Prompt size

| Metric | Value | Source |
|--------|------:|--------|
| Base domain-pack seeded prompt | **13,201** chars | `buildSeededStepPromptForWorkflowStep` |
| Emitted augmented core prompt | **49,949** chars | `applyWorkflowStepRuntimePromptAugmentations` |
| Augmentation delta | **+36,748** chars (+278%) | Rationalisation audit |
| Copy wrapper overhead | **~1,149** chars | `buildWorkflowStepInstructions` footer |
| Full Copy clipboard text | **~51,098** chars | Emitted core + wrapper |

### Sprint 56 targets (from charter)

| Metric | Target |
|--------|-------:|
| Emitted core prompt | ≤32,000 chars |
| Augmentation delta | ≤18,000 chars |
| Reduction vs baseline | ≥35% |

---

## Duplication

| Metric | Value |
|--------|------:|
| Estimated redundant Sprint 55 scaffold guidance | **~19,000** chars |
| `activity_preamble` rule copies | **5–6** |
| Cognition mandatory-set copies | **5–6** |
| Weak/strong exemplar sets (near-duplicate) | **3** modules |
| Sprint 56 target duplicate scaffold chars | **≤2,000** |

---

## Contract layering (DLA emitted prompt)

| Metric | Sprint 55 count | Sprint 56 target |
|--------|----------------:|-----------------:|
| Overlapping scaffold contract layers | **5** | **1** |
| Runtime augmentation steps adding chars | **6** | TBD (fewer blocks) |
| Largest single contributor | `applySelfDirectedLearnerPageStepScaffoldsToDraft` **30,164** chars | Consolidated |

### Layer inventory (baseline)

1. Learner-page activity framing (+ archetype)  
2. OUTPUT CONTRACT (learner-facing page)  
3. LD-ACTIVITY-PREAMBLE-EXPOSITION-CONTRACT  
4. LD-COGNITION-ORIENTATION-CONTRACT  
5. LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT (+ PRE-EMIT)  

*Plus supporting (non-scaffold): LD-SELF-DIRECTED-RHETORIC DLA rider, EQF, PEL, table/math.*

---

## Conflicting word-count rules

| Metric | Sprint 55 count | Sprint 56 target |
|--------|----------------:|-----------------:|
| Distinct conflict classes | **7** | **0** |
| Explicit competing numeric statements | **9+** | **0** |

### Conflict register (baseline)

| Field / topic | Competing values |
|---------------|------------------|
| `self_explanation_prompt` | 25–80 vs 35–80 |
| `transfer_or_application_task` | 30–70 vs 35–80 |
| `activity_preamble` | 2–4 sentences vs 50–120 words |
| `uncertainty_tension_prompt` | one sentence (adjacent to 35–80 fields) |
| `intellectual_frame` | 1–2 sentences |
| `expected_output` | 30–70 quality vs AS-05 observable evidence |
| Journey scaffolding | reduce scaffolding vs minimum prose |

---

## Gate systems

| Metric | Sprint 55 count | Sprint 56 target |
|--------|----------------:|-----------------:|
| Presence-only or minimisation gates (scaffold) | **7** | **0** (merged) |
| Word-count authoritative gate | **1** (late) | **1** (early + repeated once at PRE-EMIT) |

### Gate inventory (baseline)

| Gate | Type |
|------|------|
| IFP-05 anti-shell | Presence |
| activities[] schema reinforcement | Presence |
| LD-COGNITION PRE-EMIT | Presence |
| Activity framing archetype | Presence |
| PEL reasoning one cue set | Minimisation |
| EQF imply purpose | Weak |
| AS-05 / DLA-WB-19 | Non-empty |
| DLA PRE-EMIT SCAFFOLD GATE | Word count + self-check |

---

## Exemplar systems

| Metric | Sprint 55 count | Sprint 56 target |
|--------|----------------:|-----------------:|
| Scaffold exemplar systems in DLA prompt | **4** | **1** |
| Non-compliant “Strong” exemplars | **1** (LD-COGNITION self_explanation ~17w) | **0** |

### Exemplar inventory (baseline)

1. Self-directed activity JSON example (compliant)  
2. LD-ACTIVITY-PREAMBLE weak/strong  
3. LD-COGNITION weak/strong (**short Strong**)  
4. LD-GUIDED weak/strong  

---

## Top augmentation contributors (baseline)

| Rank | Block | Chars |
|------|-------|------:|
| 1 | `applySelfDirectedLearnerPageStepScaffoldsToDraft` | 30,164 |
| 2 | LD-GUIDED-LEARNING-SCAFFOLD | 5,269 |
| 3 | OUTPUT CONTRACT | ~5,011 |
| 4 | LD-SELF-DIRECTED-RHETORIC (DLA) | 4,230 |
| 5 | JSON example | ~3,032 |
| 6 | LD-COGNITION-ORIENTATION | 3,172 |
| 7 | LD-ACTIVITY-PREAMBLE | 2,945 |
| 8 | Activity framing | ~2,822 |
| 9 | LD-TABLE-FIDELITY | 1,967 |
| 10 | EDUCATIONAL-QUALITY-FRAMEWORK | 1,751 |

---

## Traceability

| Sprint 56 backlog ID | Baseline metric used |
|---------------------|---------------------|
| DLA-01 | Emitted core 49,949 chars |
| DLA-02 | 5 overlapping layers |
| DLA-03 | 7 conflict classes |
| DLA-04 | 7 presence-only gates |
| DLA-05 | ~19k duplicate chars |
| DLA-06 | 4 exemplar systems |
| GAM-01 | DLA accretion pattern (82% single step) |
| GOV-01 | All size/duplication metrics |

**Evidence:** [SPRINT-55-DLA-PROMPT-RATIONALISATION-AUDIT.md](../2026-06-29-sprint-55-educational-product-experience/SPRINT-55-DLA-PROMPT-RATIONALISATION-AUDIT.md)
