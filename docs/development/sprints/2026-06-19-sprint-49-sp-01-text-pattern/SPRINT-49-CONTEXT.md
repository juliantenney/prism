# Sprint 49 Context

## Operating assumption

PRISM is a **human-mediated prompt orchestration framework**. Runtime slices augment copied prompts and validate captures; they do not autonomously execute workflows.

**Validation workflow:** Marx self-directed learner-page workflow (`marx-capitalism-v1` or equivalent).

---

## Sprint 48 baseline (frozen for Sprint 49 startup)

| Capability | Location | Notes |
| ---------- | -------- | ----- |
| GAM capture gate | `lib/gam-output-format.js`, `app.js` | Tier 1–2 blocking; self-directed learner-page GAM |
| Pattern injection | `lib/instructional-pattern-prompt.js`, `app.js` | SP-02, SP-03, SP-04, SP-05, SP-06 |
| Scope gate | `shouldApplySelfDirectedLearnerPageGamMaterialScaffold` | Facilitator GAM excluded |
| Prompt order | `applyWorkflowStepRuntimePromptAugmentations` | Cognition → EQF → **patterns** → LD/self-directed scaffolds |

Sprint 48 commit range: `cd59779` through `4a916b6` on `master`.

---

## SP-01 problem statement

**Material type:** `text` (44-2 §5.1)  
**Pattern:** SP-01 / TEXT-SP-01 — connective exposition prose  
**Intent:** Substantive prose linking ≥2 ideas; teaches without assigning the learner deliverable; optional applied illustration (Marx M1).

**Blocker:** FM-07 cognition-cue collapse.

At GAM stage, `buildPedagogicCognitionContractPromptBlock` currently says:

> For each activity material block, add a learner-facing Cognition cues section…

SP-01 requires `text` bodies to remain **exposition-only** — cognition cues belong in designated non-`text` materials or separate slots, not appended after exposition (Photosynthesis M1 pattern).

Implementing SP-01 as a lib-only marker block **without** reconciling this instruction risks contradictory copied prompts.

---

## Reconciliation design space (49-1)

Options to evaluate (not pre-decided):

| Option | Change locus | Trade-off |
| ------ | ------------ | --------- |
| **A** | Scope cognition contract: “per material block **except** `Material: … (text)`” | Touches `app.js`; clearest single source of truth |
| **B** | SP-01 block overrides: “for `(text)` only, do not append Cognition cues in Content” | Lib + pattern order reliance; model may follow last instruction |
| **C** | Route cognition to `prompt_set` / dedicated material in GAM prompt rules | May need cognition block wording change + SP-01 |
| **D** | Material-type-aware cognition injection in cognition builder | Higher coupling; explicit routing |

Sprint 49 should **record the chosen option** before implementation.

---

## Minimal SP-01 implementation target (post-reconciliation)

Align with Slices 3–7 directive style; **minimum uncontested bar only:**

- MUST: substantive connective prose; ≥2 linked ideas; distinct from task assignment
- MUST NOT: cognition-cue appendage in `text` body (FM-07)
- GOOD: Marx M1 shape (progression + relational links + optional Example paragraph)
- FORBIDDEN: specification synopsis; task-instruction-as-exposition; appended `Cognition cues:` block
- **Exclude:** FM-08 as blocking MUST; Strong-calibration features

---

## Secondary: two-column presentation

**Settled direction (Sprint 43):** Left column = lightweight journey compass (signposts, inquiry orientation); right column = full disciplinary resource.

**Sprint 49 scope:** Investigation only — map current `design_page` / renderer output against prototype intent; identify gap list. **No renderer implementation** until SP-01 thread is stable.

**References:**

- [`../2026-06-12-sprint-43-educational-salience/43-05-seamless-chat-handover-pack.md`](../2026-06-12-sprint-43-educational-salience/43-05-seamless-chat-handover-pack.md)
- [`../2026-06-15-sprint-44/context-pack/02-settled-decisions-register.md`](../2026-06-15-sprint-44/context-pack/02-settled-decisions-register.md) — two-column decision

---

## Out of scope (Sprint 49 unless explicitly chartered)

- New workflow steps or topology changes
- Instructional-shape capture validators for `text`
- SP-02–SP-06 block changes (maintain-test only)
- Full two-column renderer implementation
- Reopening investigation-primary / ownership architecture
