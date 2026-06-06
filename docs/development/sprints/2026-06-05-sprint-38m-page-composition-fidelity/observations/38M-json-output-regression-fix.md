# 38M — JSON output regression fix (Model Knowledge + Learning Sequence)

**Date:** 2026-06-05  
**Type:** Urgent regression fix  
**Scope:** Strict JSON-only output contracts and runtime validation for **Model Knowledge** and **Construct Learning Sequence** only.

---

## §1 Problem

During normal workflow runs, **Model Knowledge** and **Construct Learning Sequence** could emit prose-wrapped or markdown-fenced output. Downstream behaviour relied on lenient salvage parsing (`tryParseWorkflowArtefactJson` brace-slicing, fenced-block extraction), allowing the run to advance with degraded captures.

---

## §2 Root cause

| Layer | Finding |
|-------|---------|
| **Learning Sequence prompt** | Pack §10 said “Return only the JSON” but lacked the explicit strict contract already present on Model Knowledge §3 (no fences, no prose wrapper, no comments). `structureStyle` was not declared (runtime inferred `schema_structured` from `preferredOutputFormat: json`, but prompt text was weak). |
| **Runtime parsing** | `tryParseWorkflowArtefactJson` and harness `parseJsonObjectFromArtefact` accepted preamble, markdown fences, and embedded JSON extraction. |
| **Workflow run gate** | **Next** advanced steps without validating KM/LS captures; no fail-fast on non-JSON bodies. |
| **Prompt augmentation** | Runtime augmentations did not append strict JSON contract blocks for KM/LS drafts. |

**Not root cause:** Model Knowledge pack §3 already had strict JSON language; regression was primarily **lenient acceptance** + **Learning Sequence contract gap**.

---

## §3 Files modified

| File | Change |
|------|--------|
| `lib/workflow-artefact-json-strict.js` | **New** — strict parse, shape validation, contract blocks |
| `domains/learning-design/domain-learning-design-step-patterns.md` | §10 Learning Sequence strict JSON contract + `structureStyle` + `defaultPromptNotes` |
| `app.js` | Run-mode validation, Next-step gate, prompt augmentation hook, test API exports |
| `index.html` | Script tag for `workflow-artefact-json-strict.js` |
| `docs/.../ev-harness-artefact-parse.js` | Delegates to strict parse (no fence/prose salvage) |
| `tests/workflow-artefact-json-strict.test.js` | **New** |
| `tests/ev-harness-knowledge-model-parse.test.js` | Updated for strict rejection |
| `tests/knowledge-model-pack-output-contract.test.js` | Added §10 LS contract tests |
| `tests/evaluation-harness-fidelity.test.js` | Harness contract assertion aligned |

**Not modified:** DLA §5, GAM §6, 38M page fidelity, ACM, renderer, workflow topology/schema.

---

## §4 Contracts strengthened

### Model Knowledge (`knowledge_model`)

- Pack §3 requires **exactly one ```json fenced block** containing the `knowledge_model` object.
- Required top-level keys: `concepts`, `relationships`, `groupings`, `processes`, `misconceptions`.
- Forbidden: prose before/after the fence, raw JSON without fence, JSON comments, STEP N OUTPUT footers in model body (Copilot paste footers stripped by `sanitizePrismRunCapturedOutput` before validation).

### Construct Learning Sequence (`learning_sequence`)

Pack §10 `promptTemplate` requires **exactly one ```json fenced block** (same contract as Model Knowledge):

- The fenced block body must be the `learning_sequence` root object as valid JSON
- No prose before/after the fence, no raw JSON without fence, no comments, no STEP footers
- Top-level keys: `sequence_title`, `total_duration_minutes`, `timeline`, `activities_used`, `activities_omitted`, `checks`
- `structureStyle: "schema_structured"`
- `defaultPromptNotes`: raw JSON only

Runtime augmentation appends matching **Output contract (strict — parseable JSON artefact only)** blocks when absent from drafts.

---

## §5 Validators added

### `lib/workflow-artefact-json-strict.js`

| Function | Purpose |
|----------|---------|
| `parseStrictJsonObjectCapture` | Fail on fences, prose wrapper, comments, non-object JSON |
| `validateKnowledgeModelShape` | Require `concepts` array + normalize top-level keys |
| `validateLearningSequenceShape` | Require `timeline`, `activities_used`, `activities_omitted`, `checks` |
| `validateWorkflowStepStrictJsonCapture` | Step-kind dispatch (`knowledge_model` / `learning_sequence`) |
| `parseKnowledgeModelCaptureStrict` / `parseLearningSequenceCaptureStrict` | Harness + hard parse entry points |

### `app.js` workflow run integration

| Hook | Behaviour |
|------|-----------|
| `syncWorkflowRunCapturedOutputToState` | Validates KM/LS captures; sets `workflowRunStrictJsonValidation[sid]`; clears step-completed flag on failure |
| **Next** button | **Blocks advance** with error toast when KM/LS body is non-empty and fails strict validation |
| `applyStrictJsonArtefactContractToDraft` | Injected via `applyWorkflowStepRuntimePromptAugmentations` |

**No silent fallback:** Lenient salvage is not used for KM/LS gate checks. Other steps unchanged.

---

## §6 Tests added/updated

| Suite | Coverage |
|-------|----------|
| `tests/workflow-artefact-json-strict.test.js` | Strict accept/reject matrix; pack §3/§10 contracts; app wiring |
| `tests/ev-harness-knowledge-model-parse.test.js` | Rejects fences/preamble; accepts raw JSON |
| `tests/knowledge-model-pack-output-contract.test.js` | §10 LS contract; 38L DLA/GAM unchanged guard |
| `tests/evaluation-harness-fidelity.test.js` | Harness contract text |

---

## §7 Test results

```bash
node --test tests/workflow-artefact-json-strict.test.js \
  tests/ev-harness-knowledge-model-parse.test.js \
  tests/knowledge-model-pack-output-contract.test.js \
  tests/evaluation-harness-fidelity.test.js
```

**Result:** **39/39 pass**

---

## §8 Stale examples / seeds

Checked `docs/examples/bundles/*` and workflow fixtures: no `override_prompt_body` prose overrides for Model Knowledge or Construct Learning Sequence. Archive examples use step titles only. **No example bundle updates required.**

---

## §9 Out-of-scope confirmation

| Area | Touched? |
|------|----------|
| 38L DLA §5 obligations | **No** |
| 38L GAM §6 obligations | **No** (verified by `pack §5/§6 38L depth rules unchanged` test) |
| 38M page fidelity (GAM→page merge, A3 sequencing) | **No** |
| ACM / renderer / workflow structure | **No** |

---

## §10 Success criterion

A normal workflow run **cannot advance past Model Knowledge or Construct Learning Sequence** unless the captured body is **exactly one ```json fenced block** containing valid JSON in the expected structure. Harness parse **throws** on unfenced raw JSON or prose-wrapped captures instead of salvaging.

**Residual note:** Copilot-pasted `STEP N OUTPUT:` footers are stripped by `sanitizePrismRunCapturedOutput` before validation (UI metadata, not model body). Model-emitted prose outside the fence or raw JSON without a fence still **fail**.

---

## §11 Addendum — Step 2 fenced JSON correction (2026-06-05)

Manual inflation exposed Step 2 emitting **raw JSON-like text** instead of the required **single ```json fenced block**. Corrected:

| Surface | Change |
|---------|--------|
| Pack §3 Model Knowledge | Output contract now requires fenced block; forbids raw JSON without fence |
| `parseFencedJsonObjectCapture` | New validator: exactly one fence, parse JSON inside, reject `raw_json_without_fence` |
| Workflow run gate + harnesses | KM uses fenced parser |
| Regression test | `{"concepts":[...]}` plain text rejected as `raw_json_without_fence` |

---

## §12 Addendum — Learning Sequence fenced JSON alignment (2026-06-05)

Manual inflation exposed Step 10 emitting **raw JSON-like text** instead of the required **single ```json fenced block**. Learning Sequence now matches Model Knowledge:

| Surface | Change |
|---------|--------|
| Pack §10 Construct Learning Sequence | Output contract requires fenced block; forbids raw JSON without fence |
| `parseLearningSequenceCaptureStrict` | Uses `parseFencedJsonObjectCapture` (rejects `raw_json_without_fence`) |
| Runtime augmentation + Next gate | LS draft contract and validation aligned to fenced block |
| Regression test | Plain `{"sequence_title":...}` text rejected as `raw_json_without_fence` |
