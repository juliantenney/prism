# Sprint 51 — Evaluative Coaching Phase 1 Implementation Report

**Status:** Complete  
**Design authority:** [SPRINT-51-EVALUATIVE-COACHING-DESIGN.md](./SPRINT-51-EVALUATIVE-COACHING-DESIGN.md)  
**Date:** 2026-06-18

---

## Summary

Phase 1 strengthens **learner self-regulation** by extending GAM prompt contracts for **Check** materials. Checklists now require diagnostic `## Common mistakes` sections and actionable `### If any check is not met:` revision guidance. Worked examples are forbidden from embedding verification content. No workflow, schema, compose, or renderer changes were made.

---

## Files changed

| File | Change |
| ---- | ------ |
| `lib/instructional-pattern-prompt.js` | Extended SP-05 with `## Common mistakes`, FM-13, motivational FORBIDDEN floors; extended SP-06 with FM-14 anti-embed rule |
| `app.js` | Extended `buildSelfDirectedGamPelReasoningMaterialPromptBlock()` — checklist coaching, worked_example separation, diagnostic evaluative prompts |
| `tests/sprint-51-evaluative-coaching-generation.test.js` | **New** — SP-05/SP-06 coaching contracts, PEL block, example body shapes |
| `tests/workflow-instructional-pattern-prompt.test.js` | Updated SP-05 assertions; added FM-13 / FM-14 tests |

**Not changed:** workflow stages, DLA schema, compose, renderer, instructional grammar.

---

## Implementation approach

### 1. SP-05 checklist extension (primary)

Every `checklist` body must now include:

1. ≥4 criteria-linked `Have you / Did you / Does your` checks (unchanged).
2. **`## Common mistakes`** — 2–4 discipline-specific novice traps or weak-response shapes tied to the deliverable.
3. **`### If any check is not met:`** — numbered, actionable revision moves (what to add, cite, or restructure).

Missing `## Common mistakes` or a substantive revise block is instructional **FAIL (FM-13)**.

**Governance:** FORBIDDEN motivational coaching (`Reflect on…`, `Think about…`, `Consider whether…`) and generic revise guidance (`Revise until correct`).

### 2. SP-06 anti-pattern (function separation)

Worked examples must model thinking only. Embedding checklist items, `Have you` / `Did you` verification, or `## Common mistakes` inside `worked_example` is **FAIL (FM-14)**. Verification must be emitted as a separate `Material: ... (checklist)`.

### 3. PEL reinforcement (`app.js`)

`buildSelfDirectedGamPelReasoningMaterialPromptBlock()` now:

- Cross-references SP-05 checklist coaching requirements.
- Forbids checklist content inside `worked_example`.
- Supplies diagnostic evaluative coaching prompt examples (explanation vs description, unsupported claims, evidence gaps).
- Reinforces diagnostic-not-motivational governance.

### 4. Application path

Unchanged from prior pattern blocks — auto-appended on self-directed learner-page **Generate Activity Materials** via `applyInstructionalPatternPromptBlockToDraft()`.

---

## Examples generated (prompt GOOD-shape conventions)

### Checklist (evaluative coaching)

```markdown
Use this to evaluate your [deliverable]:

• Have you [criterion tied to expected_output]?
• Have you [accuracy / evidence check], not just named it?
• Have you [application to the specific task], not described in general?
• Have you [relationship or reasoning quality check]?

## Common mistakes
- A common weak response identifies concepts but does not explain the mechanism linking them.
- Learners often describe outcomes without explaining how the pressure reaches the agents affected.
- Generic justification that could apply to any case, with no scenario-specific evidence.

### If any check is not met:
Revise your [deliverable] by (1) adding a mechanism sentence for each major claim, (2) citing one scenario detail per point, and (3) naming one genuine uncertainty you still hold.
```

### Worked example (thinking only — no embedded checklist)

```markdown
**Step 1:** … **Step 2:** …

## What experts notice
- Strong analysis names the transmission mechanism, not only a label.

**Bridge:** Apply the same sequence to your scenario — do not copy this conclusion.
```

### PEL diagnostic prompts (when used in checklist / prompt_set)

- Which part of your answer provides explanation rather than description?
- Which claim is least well supported?
- Where might a reader need more evidence or reasoning?

---

## Test results

```
node --test tests/sprint-51-evaluative-coaching-generation.test.js \
         tests/sprint-51-annotated-models-generation.test.js \
         tests/workflow-instructional-pattern-prompt.test.js \
         tests/sprint-50-phase-2-renderer-instructional-grammar.test.js
```

| Suite | Result |
| ----- | ------ |
| `sprint-51-evaluative-coaching-generation.test.js` | 7/7 pass |
| `sprint-51-annotated-models-generation.test.js` | 6/6 pass — **Annotated Models unchanged** |
| `workflow-instructional-pattern-prompt.test.js` | 53/53 pass |
| `sprint-50-phase-2-renderer-instructional-grammar.test.js` | 9/9 pass — **manifestation unchanged** |

**Total:** 75/75 pass.

### Coverage verified

- Checklists require `## Common mistakes` and substantive revise block (FM-13)
- Revision guidance is actionable in GOOD shape example
- Worked examples forbid embedded checklist (FM-14)
- PEL block reinforces separation and diagnostic prompts
- Sprint 50 renderer grammar unchanged
- Sprint 51 Annotated Models (SP-06/SP-07) behaviour unchanged

---

## Governance compliance

| Rule | Implementation |
| ---- | -------------- |
| Diagnostic, not motivational | SP-05 FORBIDDEN: `Reflect on`, `Think about`, `Consider whether` without weak-pattern naming |
| Actionable revision | GOOD shape requires numbered `Revise your [deliverable] by (1)…` |
| Function separation | SP-06 FM-14 + PEL line forbid checklist inside `worked_example` |
| No architecture change | Markdown subsections only in existing `materials.checklist` |
| Strengthen Check only | No Study/Do grammar or renderer changes |

---

## Risks

| Risk | Mitigation / note |
| ---- | ----------------- |
| **LLM non-compliance** | FM-13/FM-14 are prompt-level fails; fresh Marx run needed to verify composed bodies |
| **DLA does not list checklist** | Coaching only applies when `checklist` material is emitted — design Layer 2 (`prompt_set`) deferred |
| **Overlap with `What experts notice`** | Study = expert on model; Check = weak shapes on learner deliverable — distinct headings |
| **Checklist length** | Cap at 4 mistake bullets in contract; monitor corpus |

---

## Recommended next step

1. **Verification run:** Re-run Marx self-study GAM and inspect `page.json` — evaluate activities should have standalone `checklist` bodies with `## Common mistakes` and revise guidance; `worked_example` bodies should not contain `Have you` items.
2. **Layer 2 (optional):** `prompt_set` self-check pattern (`## Self-check your reasoning`) per design doc — during-task discriminative probes.
3. **Renderer salience (optional):** Callout wrapper for Check coaching headings after generation verified.

---

## Success criterion

After a fresh Marx run, learners using **Check your work** should be able to identify likely weaknesses in their draft and know at least one concrete revision action — from checklist materials, without inferring this solely from worked examples or model answers.

Prompt contracts are in place; LLM compliance is confirmed at generation time via a fresh workflow run.
