# Sprint 55 — DLA Prompt Rationalisation Audit

**Status:** Formal Sprint 55 evidence artefact  
**Scope:** Runtime augmentation inventory for DLA Copy prompt  
**Workflow profile:** Self-directed RNA/HCV learner-page brief  
**Date:** 2026-07-01  

---

## Augmentation pipeline (order)

```
applyPedagogicCognitionContractScaffoldToDraft          → 0 chars (inactive)
applyEducationalQualityFrameworkPromptBlockToDraft      → +1,751
applyInstructionalPatternPromptBlockToDraft             → 0 (GAM only)
applySelfDirectedLearnerPageStepScaffoldsToDraft        → +30,164
applyLdTableFidelityContractToDraft                     → +1,967
applyLdMaterialsCopyContractToDraft                       → 0 (GAM only)
applyPedagogicEnrichmentContractScaffoldToDraft           → +1,646
applyLdDesignPageComposeContractToDraft                   → 0 (Design Page only)
applySprint38VisualAffordanceContractToDraft              → 0 (Design Page only)
applyMathSafeOutputContractToDraft                        → +1,220
applyStrictJsonArtefactContractToDraft                    → 0
applyEpisodePlanDlaPopulationPromptBlockToDraft           → 0 (no upstream in bare run; ~789 when active)
```

**Total augmentation:** +36,748 chars (base 13,201 → emitted core 49,949).

---

## Applied augmentation inventory

| # | Source function | Block marker | Chars | Duplicates? | Conflicts? |
|---|-----------------|--------------|------:|-------------|------------|
| 1 | `applyEducationalQualityFrameworkPromptBlockToDraft` | EDUCATIONAL-QUALITY-FRAMEWORK | 1,751 | Yes | reduce scaffolding vs Sprint 55 mins |
| 2a | `applySelfDirectedLearnerPageStepScaffoldsToDraft` → material shape | Self-directed learner-page material shape | ~2,004 | Partial | short-text cues |
| 2b | → timeline alignment | Self-directed timeline sequencing alignment | ~1,523 | No | — |
| 2c | → activity framing | Learner-page activity framing | ~2,822 | **Heavy** | — |
| 2d | → output contract | OUTPUT CONTRACT (learner-facing page) | ~5,011 | **Heavy** | 25–80, 30–70, one-sentence fields |
| 2e | → JSON example | Self-directed activity JSON example | ~3,032 | Partial | Example compliant |
| 2f | → `augmentSelfDirectedDlaDraftOutputSection` | Schema line reinforcement | ~hundreds | Yes | Presence-only |
| 2g | → `applyLdActivityPreambleExpositionContractToDraft` | LD-ACTIVITY-PREAMBLE-EXPOSITION | 2,945 | **Heavy** | 2–4 sentences vs 50–120 words |
| 2h | → `applyLdCognitionOrientationContractToDraft` | LD-COGNITION-ORIENTATION | 3,172 | **Heavy** | Short Strong exemplar |
| 2i | → `applyLdGuidedLearningScaffoldContractToDraft` | LD-GUIDED-LEARNING-SCAFFOLD + PRE-EMIT | 5,269 | **Heavy** | learner_task concise |
| 2j | → `applyLdSelfDirectedRhetoricContractToDraft` | LD-SELF-DIRECTED-RHETORIC (DLA) | 4,230 | **Heavy** | — |
| 3 | `applyLdTableFidelityContractToDraft` | LD-TABLE-FIDELITY (DLA) | 1,967 | Partial | — |
| 4 | `applyPedagogicEnrichmentContractScaffoldToDraft` | PEL orientation + reasoning | 1,646 | Yes | one reasoning cue set |
| 5 | `applyMathSafeOutputContractToDraft` | LD-MATH-RENDER | 1,220 | Partial | — |

---

## Top 10 largest contributors

| Rank | Contributor | Chars |
|------|-------------|------:|
| 1 | `applySelfDirectedLearnerPageStepScaffoldsToDraft` (total) | 30,164 |
| 2 | LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT + PRE-EMIT | 5,269 |
| 3 | OUTPUT CONTRACT (learner-facing page) | ~5,011 |
| 4 | LD-SELF-DIRECTED-RHETORIC (DLA rider) | 4,230 |
| 5 | Self-directed activity JSON example | ~3,032 |
| 6 | LD-COGNITION-ORIENTATION-CONTRACT | 3,172 |
| 7 | LD-ACTIVITY-PREAMBLE-EXPOSITION-CONTRACT | 2,945 |
| 8 | Learner-page activity framing (+ archetype) | ~2,822 |
| 9 | `applyLdTableFidelityContractToDraft` | 1,967 |
| 10 | EDUCATIONAL-QUALITY-FRAMEWORK | 1,751 |

---

## Duplication estimate

| Topic | Approx. copies in emitted prompt |
|-------|--------------------------------|
| activity_preamble 50–120 + required | 5–6 |
| cognition field mandatory set | 5–6 |
| reasoning/contrast/argument 35–80 | 4 + 3 exemplar sets |
| expected_output 30–70 | 3 |
| weak/strong exemplars | 3 modules (near-identical) |
| facilitator / self-study ban | 3 |
| procedural-only row prohibition | 4 |

**Estimated redundant Sprint 55-related guidance:** ~19,000 chars recoverable through consolidation.

---

## Conflicting word-count rules (inventory)

| Field | Competing values | Sources |
|-------|------------------|---------|
| `self_explanation_prompt` | 25–80 vs 35–80 | OUTPUT CONTRACT vs LD-GUIDED PRE-EMIT |
| `transfer_or_application_task` | 30–70 vs 35–80 | OUTPUT CONTRACT vs PRE-EMIT |
| `activity_preamble` | 2–4 sentences vs 50–120 words | Framing, preamble contract, guided |
| `uncertainty_tension_prompt` | one sentence | OUTPUT CONTRACT |
| `intellectual_frame` | 1–2 sentences | OUTPUT CONTRACT |
| `expected_output` | quality target vs observable evidence | PRE-EMIT vs AS-05 |
| Journey scaffolding | reduce vs minimum prose | EQF vs PRE-EMIT |

**Count:** 7 distinct conflict classes; 9+ explicit numeric rule statements.

---

## Overlapping gate systems

| Gate | Type | Weakens later gate? |
|------|------|---------------------|
| IFP-05 anti-shell | Presence (preamble + task + materials) | Yes |
| activities[] schema line | Presence | Yes |
| LD-COGNITION PRE-EMIT | Presence | Yes |
| Activity framing archetype | Presence | Yes |
| PEL reasoning one cue set | Cardinality minimisation | Yes |
| EQF manifestation | imply purpose | Yes |
| AS-05 / DLA-WB-19 | non-empty expected_output | Yes |
| DLA PRE-EMIT SCAFFOLD GATE | Word count + self-check | Authoritative (late) |

**Count:** 7 presence-only or minimisation gates; 1 word-count gate (late).

---

## Exemplar systems

| System | Role | Sprint 55 alignment |
|--------|------|---------------------|
| Self-directed activity JSON example | Authoritative shape | Compliant lengths |
| LD-ACTIVITY-PREAMBLE weak/strong | Contrast | Weak intentional; Strong compliant |
| LD-COGNITION weak/strong | Contrast | **Strong self_explanation ~17w — non-compliant** |
| LD-GUIDED weak/strong | Contrast + PRE-EMIT | Weak intentional; field lines authoritative |

**Count:** 4 exemplar systems; 3 near-duplicate contrast sets.

---

## Minimum composition estimate (Sprint 56 planning input)

| Component | Est. chars |
|-----------|----------:|
| Base domain-pack prompt | ~13,200 |
| Consolidated Sprint 55 contract (single SSOT) | ~6,500 |
| Material shape + timeline | ~3,500 |
| LD-TABLE-FIDELITY + LD-MATH-RENDER | ~3,200 |
| Episode plan block (when upstream present) | ~800–3,000 |
| **Pragmatic rationalised total** | **~27,000–30,000** |

**Potential reduction:** ~40–46% vs current ~50k emitted core.

---

## Traceability to Sprint 56

See [SPRINT-56-DLA-RATIONALISATION-PROGRAMME.md](../2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/SPRINT-56-DLA-RATIONALISATION-PROGRAMME.md).
