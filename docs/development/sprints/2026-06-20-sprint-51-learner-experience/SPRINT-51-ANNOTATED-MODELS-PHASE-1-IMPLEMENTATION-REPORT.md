# Sprint 51 — Annotated Models Phase 1 Implementation Report

**Status:** Complete  
**Design authority:** [SPRINT-51-ANNOTATED-MODELS-IMPLEMENTATION-DESIGN.md](./SPRINT-51-ANNOTATED-MODELS-IMPLEMENTATION-DESIGN.md)  
**Date:** 2026-06-18

---

## Summary

Phase 1 moves learners from *what good work looks like* to *what good work looks like and why it is effective* by extending **GAM prompt contracts only**. Commentary is generated as `##` markdown subsections inside existing material bodies (`sample_output`, `worked_example`, judgement-oriented materials). No workflow stages, page schema, DLA fields, compose logic, or renderer changes were made.

---

## Files changed

| File | Change |
| ---- | ------ |
| `lib/instructional-pattern-prompt.js` | Extended SP-06 with `## What experts notice` (FM-12); added SP-07 with `## Why this works` (FM-11); wired SP-07 into full block and apply helper |
| `app.js` | Extended `buildSelfDirectedGamPelReasoningMaterialPromptBlock()` with SP-06/SP-07 commentary rules and weak/strong judgement headings |
| `tests/sprint-51-annotated-models-generation.test.js` | **New** — SP-06/SP-07 contracts, PEL block, example body shapes |
| `tests/workflow-instructional-pattern-prompt.test.js` | Updated SP-06 assertions; added SP-07 marker/runtime/duplication tests |

**Not changed (per constraint):** compose, renderer, DLA schema, workflow stages, `page.json` structure.

---

## Implementation approach

### 1. Instructional pattern SP-07 (`sample_output`)

New pattern block `INSTRUCTIONAL-PATTERN-SP-07` requires every `sample_output` body to:

1. Include the exemplar response or product.
2. Append `## Why this works` with 3–5 bullets naming reasoning quality, conceptual connections, analytical/evaluative moves, or disciplinary judgement.
3. End with: *Use this as a quality guide, not as text to copy.*

Missing commentary is an instructional **FAIL (FM-11)**. Generic praise (clear, detailed, well written, good structure) is explicitly forbidden unless tied to disciplinary reasoning.

### 2. Instructional pattern SP-06 extension (`worked_example`)

SP-06 now requires `## What experts notice` (≥2 bullets) **after labelled steps and before `**Bridge:**`**, exposing reasoning moves, relationships, or novice blind spots. Missing section is **FAIL (FM-12)**. Existing FM-05 bridge requirement is unchanged.

### 3. PEL reasoning material block (`app.js`)

`buildSelfDirectedGamPelReasoningMaterialPromptBlock()` reinforces the same conventions for self-directed GAM and adds weak/strong comparative judgement:

- `## A weaker response would`
- `## A stronger response would`

for `worked_judgement` / `modelling_note` purposes with criteria-led contrast (not generic advice).

### 4. Application path

Patterns auto-append on self-directed learner-page **Generate Activity Materials** via `applyInstructionalPatternPromptBlockToDraft()` — same scope gate as SP-01–SP-06 (facilitator and non-GAM steps excluded).

---

## Examples generated (prompt GOOD-shape conventions)

### Sample output (`## Why this works`)

```markdown
> [Parallel scenario response demonstrating structure and depth expected in expected_output…]

## Why this works
- Links concepts through a causal mechanism rather than listing definitions.
- Uses scenario-specific evidence to support the analytical move, not generic claims.
- Moves beyond description by explaining relationships and implications.

Use this as a quality guide, not as text to copy.
```

### Worked example (`## What experts notice`)

```markdown
Step 1: … Step 2: … Step 3: … [visible because/reasoning between steps on the model item]

## What experts notice
- This explanation links [concept A] to [concept B] through a mechanism, not a list of terms.
- Novices often stop at description; this model shows how to explain the relationship between cause and effect.

**Bridge:** Now use the same method on your [assigned scenario / parallel task from learner_task] — do not copy the model outcome.
```

### Judgement contrast

```markdown
## A weaker response would
Inflation is bad because prices rose a lot — a slogan without criteria.

## A stronger response would
Rates each criterion with evidence from the scenario and explains trade-offs between feasibility and impact.
```

These shapes are enforced in GAM prompts; domain-specific content is produced at generation time.

---

## Test results

```
node --test tests/sprint-51-annotated-models-generation.test.js \
         tests/workflow-instructional-pattern-prompt.test.js \
         tests/sprint-50-phase-2-renderer-instructional-grammar.test.js
```

| Suite | Result |
| ----- | ------ |
| `sprint-51-annotated-models-generation.test.js` | 6/6 pass |
| `workflow-instructional-pattern-prompt.test.js` | 51/51 pass (includes 2 new SP-07 tests, SP-06 updates) |
| `sprint-50-phase-2-renderer-instructional-grammar.test.js` | 9/9 pass — **manifestation behaviour unchanged** |

**Total:** 66/66 pass.

### Coverage verified

- `sample_output` prompt contract includes `## Why this works` (FM-11)
- `worked_example` prompt contract includes `## What experts notice` before Bridge (FM-12)
- PEL block reinforces weak/strong judgement headings
- SP-07 marker not duplicated on re-apply
- GAM runtime receives SP-07 on self-directed Marx brief; facilitator/non-GAM steps excluded
- Sprint 50 instructional grammar renderer output unchanged

---

## Risks

| Risk | Mitigation / note |
| ---- | ----------------- |
| **Model compliance** | FM-11/FM-12 are prompt-level fails; LLM may still omit sections until re-run or retry. Fresh Marx verification run recommended. |
| **Salience** | Commentary renders as plain markdown subsections — no callout styling (Phase 2 optional per design). |
| **DLA coverage** | `sample_output` / judgement materials must be declared in DLA `required_materials` for GAM to emit bodies; prompt cannot create obligations DLA did not list. |
| **Heading stability** | Renderer Phase 2 (if pursued) depends on stable `##` vocabulary — document any future renames. |

---

## Recommended next step

1. **Verification run:** Re-run Marx self-study GAM on a fresh workflow execution and inspect composed `page.json` for `## Why this works`, `## What experts notice`, and weak/strong sections in material bodies.
2. **Phase 2 (optional):** Lightweight renderer callout wrapper for recognised commentary headings (`util-model-commentary`) per design approach B — improves visibility without new data fields.
3. **Audit follow-up:** If `sample_output` remains absent on some activities, tighten DLA obligation coverage rather than adding schema.

---

## Success criterion

After a fresh Marx run, learners viewing **Read and model** (Study) materials should see not only the exemplar or worked example, but also inline expert commentary explaining *why* the example demonstrates strong disciplinary thinking — generated entirely within existing `materials.*` markdown strings.
