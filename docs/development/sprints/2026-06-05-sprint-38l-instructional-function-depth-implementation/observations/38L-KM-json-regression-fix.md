# 38L — Knowledge Model JSON emission regression fix

**Date:** 2026-06-05  
**Status:** **FIXED**  
**Type:** Urgent regression — KM output contract only  
**Blocks:** Inflation pipeline KM step → downstream LO/DLA/GAM

---

## Cause

The Model Knowledge step carried **conflicting output instructions**:

1. **Pack §3** (post–38H-4b) required a **markdown fenced** `json` block plus optional **STEP N OUTPUT** footer outside the fence.
2. **`preferredOutputFormat: json`** and Prism transformation runner guidance expect a **raw JSON artefact** with no workflow metadata prefix.
3. **38L inflation harness** repeated the fenced-block + STEP footer contract in `kmSystemPrompt` while also injecting a long 38L workbook `ctxHeader` — models sometimes returned conversational prose or malformed wrappers instead of parseable JSON.

`parseKnowledgeModelCapture` could salvage some fenced/inline cases, but unreliable emission blocked the pipeline on rerun.

---

## Files modified

| File | Change |
|------|--------|
| `domains/learning-design/domain-learning-design-step-patterns.md` | **§3 Model Knowledge only** — strict raw JSON output contract; `defaultPromptNotes`; `defaultOutputStructure.keys` includes `groupings` |
| `docs/.../ev-harness-artefact-parse.js` | `buildKmHarnessOutputContract` aligned to raw JSON (no fences, no STEP footer) |
| `docs/.../ev-38l-inflation-pipeline-capture-once.mjs` | `kmSystemPrompt` aligned to raw JSON |
| `tests/knowledge-model-pack-output-contract.test.js` | **New** — regression guard |
| `tests/evaluation-harness-fidelity.test.js` | Assert raw JSON harness contract (not STEP footer) |

**Not modified:** §5 DLA (38L depth floors), §6 GAM (38L depth bodies), schema, ACM, renderer, workflow, `app.js`.

---

## Contract strengthened (exact requirements)

Pack §3 `promptTemplate` **Output requirements** now mandate:

- Exactly **one valid JSON object** — the `knowledge_model` root object
- **No** markdown code fences
- **No** prose, headings, or commentary before/after
- **No** JSON comments
- **No** `STEP N OUTPUT` metadata lines
- Required top-level keys: `concepts`, `relationships`, `groupings`, `processes`, `misconceptions` (empty arrays allowed)
- `concepts[]` entries with `name` and `definition` when supported by source

`defaultPromptNotes`: *"Return raw JSON only… No markdown fences, no prose wrapper."*

Harness `buildKmHarnessOutputContract` and 38L `kmSystemPrompt` mirror the same contract.

---

## Tests added/updated

| File | Tests |
|------|-------|
| `tests/knowledge-model-pack-output-contract.test.js` | **8** new assertions |
| `tests/evaluation-harness-fidelity.test.js` | 1 assertion updated (STEP footer → raw JSON) |
| `tests/ev-harness-knowledge-model-parse.test.js` | Unchanged — parser still accepts fenced/inline for salvage |

---

## Test results

```text
node --test tests/knowledge-model-pack-output-contract.test.js  → 8/8 pass
node --test tests/ev-harness-knowledge-model-parse.test.js      → 6/6 pass
node --test tests/evaluation-harness-fidelity.test.js           → 8/8 pass
node --test tests/workbook-contract-prompt-surface.test.js      → 42/42 pass
```

**Total relevant:** **64/64 pass**

---

## §5/§6 38L instructional-depth confirmation

Verified unchanged by `knowledge-model-pack-output-contract.test.js`:

- `IFP-09`, `DLA-WB-31` (38L-4) still in §5
- `GAM-PRES-10`, `GAM-WB-31` (38L-4) still in §6

Only **§3 Model Knowledge** prompt factory was edited.

---

## Success criterion

Inflation pipeline can resume: KM step prompt and harness contract now consistently require **parseable raw JSON** in the expected five-key structure. Re-run:

```bash
node docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/ev-38l-inflation-pipeline-capture-once.mjs
```

---

**Parent:** [38L observations](README.md)
