# 37-6 — Workshop pedagogical support recalibration

**Date:** 2026-06-03  
**Evidence case:** Inflation learner workshop page (live `delivery_mode: live_workshop`, classroom environment).

## Observation

Sprint 37 intellectual supports (orientation rhetoric, progression signalling, conceptual tension, epistemic framing, transfer cues, safe visuals) remain valuable in **live workshop** handouts. The inflation workshop example shows that concise framing improves learner materials without replacing facilitation.

The prior policy risk was treating **workshop ≈ sparse worksheet**, conflating:

- learner-supportive scaffolding (should appear), and  
- facilitator-redundant / answer-revealing artefacts (should stay hidden).

## Reframed policy distinction

| Class | Learner workshop |
|-------|------------------|
| **Learner-supportive** | `activity_preamble`, `intellectual_coherence_bridge`, `reasoning_orientation`, `uncertainty_tension_prompt`, `study_orientation`, `intellectual_frame`, `transfer_or_application_task`, templates/task cards/scenarios, faded `worked_example`, epistemic `study_tips`, safe visual affordances |
| **Facilitator-only** | `facilitator_notes`, `facilitator_moves`, facilitation scripts, tutor checking notes, choreography-style `support_note` |
| **Answer-revealing** | `sample_output`, `answer_key`, `model_answer`, completed solutions, answer-revealing headings in material bodies |

**Principle:** A support is acceptable in live workshop mode when it supports reasoning, clarifies intellectual work, or structures inquiry — without replacing learner thinking, revealing answers, or scripting facilitator behaviour. Anti-preemption rules unchanged.

## Implementation (renderer / composition policy)

- `resolveLearnerWorkshopMaterialVisibilityPolicy` — workshop flag now means **suppress facilitator/answer artefacts**, not strip intellectual supports.
- `utilityClassifyLearnerWorkshopMaterialRole` — role-based material classification.
- `utilityShouldSuppressLearnerWorkshopMaterial` — suppresses only `facilitator_only` and `answer_revealing` roles.
- `pageIsLearnerWorkshopDelivery` — skips self-directed row sanitization that removed facilitator fields on misclassified workshop pages.
- `utilityShouldSuppressLearnerWorkshopSupportNote` — hides choreography-style support notes only.

Self-study (`async`) behaviour unchanged: no workshop suppression flag on non-workshop delivery.
