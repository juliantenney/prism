# S77-T-010 — Assembled Copy prompt map (primary live path)

**Path:** `app.js` `buildWorkflowStepInstructions` for `step_design_learning_activities`  
**Mode reconstructed:** `pageEnrichmentV2: true`, `partialPageOutputs: true`, learner-facing page brief (Marx self-study).  
**Measured assembled length:** **75,991** characters.  
**Contract version:** `76-DLA-PARTIAL-9`.

Positions are 0-based indexes into the Copy string from the diagnostic reconstruction (HEAD `0b5402d`).

| # | Component | Inventory id | First index | Notes |
| - | --------- | ------------ | ----------- | ----- |
| 01 | Pipeline opening | DLA-PB-001 | 0 | Shared |
| 02 | Step title + Sprint 58 partial mode + Copilot fence/footer | DLA-PB-002 | 183 / 233 / 466 | Footer line also at 682 |
| 03 | Contract (injection 1) | DLA-PB-003 | 742 | Via `buildDlaV2CopilotSchemaInstructions` |
| 04 | Shape (injection 1) | DLA-PB-004 | 12916 | Same function; nested title + archetype |
| 05 | Runner guidance | DLA-PB-007 | 19616 | Pack `runnerInstructions` |
| 06 | “Here is the core prompt” + pack template | DLA-PB-008 | 20642 / 20682 | `resolveStepPromptText` → catalog template |
| 07 | Guided-learning scaffold | DLA-PB-010 | 35081 | Augmentation on pack body |
| 08 | EQF | DLA-PB-011 | 39218 | Augmentation |
| 09 | Timeline sequencing | DLA-PB-012 | 43160 | Self-directed scaffold |
| 10 | OUTPUT CONTRACT + JSON example | DLA-PB-013/014 | 44683 / 47216 | Learner-page |
| 11 | Table fidelity | DLA-PB-016 | 49990 | role `dla` |
| 12 | Math render | DLA-PB-017 | 53527 | Shared |
| 13 | Contract (injection 2) | DLA-PB-003 | **56388** | Byte-identical; `applyEpisodePlanDlaPopulationPromptBlockToDraft` |
| 14 | Shape (injection 2) | DLA-PB-004 | **68481** | Byte-identical |
| 15 | Strict JSON / literal footer restatement | DLA-PB-018 | after pair 2 | Wrapper |
| 16 | Pipeline completion | DLA-PB-019 | 75620 | Shared |

**P05:** injections 1 and 2 are byte-identical contract+shape. Unique pair **18,872** (12,174+6,698) or **18,873** with the join newline used by `buildDlaV2CopilotSchemaInstructions`. Dual assembled contribution **37,744–37,746**.

Studio-only path (`applyWorkflowStepRuntimePromptAugmentations` without Copy wrapper) measures **54,511** and contains **one** contract+shape pair.

Delimited dump: [S77-T-010-dla-assembled-prompt-diagnostic.txt](S77-T-010-dla-assembled-prompt-diagnostic.txt).
