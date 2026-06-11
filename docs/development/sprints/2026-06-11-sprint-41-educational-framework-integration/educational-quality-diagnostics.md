# Educational Quality Diagnostics (Sprint 41 Slice 4)

## Purpose

Sprint 41 Slice 4 provides **reporting and comparison infrastructure** for the Educational Quality Framework evaluator (`lib/educational-quality-framework-evaluator.js`).

This is **diagnostic only**. It does not change generation, prompts, schemas, renderer behaviour, or workflow execution.

## Important architectural constraint

PRISM does **not** see generated outputs during workflow execution.

Users copy prompts from PRISM and run them manually outside the system. Generated outputs are therefore **not available to PRISM automatically**.

Because of this:

- No runtime integration
- No workflow execution hooks
- No prompt-response capture
- No output interception
- No automatic evaluation of generated outputs

The evaluator operates only on:

- Saved artefacts
- Exported JSON
- Rendered fixtures
- Manually captured outputs
- Manually pasted or saved HTML/text files

## Tools

### Single-file diagnostic

```bash
node tools/evaluate-educational-quality-framework.js <path> [--threshold N]
```

**Supported inputs:**

| Type | Examples |
|------|----------|
| JSON artefacts | `learning_activities.json`, composed learner `page` JSON |
| HTML | Exported learner page HTML |
| Plain text | Manually saved LLM output |

**Exit code:** `0` on success (including low educational scores). Non-zero only when the file cannot be read or parsed.

Educational score is **never** a build gate.

### Comparison mode

Compare two manually supplied files (baseline vs candidate):

```bash
node tools/evaluate-educational-quality-framework.js baseline.json --compare candidate.json
```

Reports:

- Baseline score
- Candidate score
- Delta
- Dimension-level changes (gained/lost)

No statistical analysis — simple dimension presence comparison only.

### Benchmark runner

```bash
node tools/evaluate-sprint41-benchmarks.js
```

Evaluates known Sprint 40/41 fixtures when present:

- `tests/fixtures/page-render/ld-inflation-workshop-page.json`
- `tests/fixtures/page-render/ld-inflation-workshop-page-full.json`

Skips missing fixtures without failing.

## How to evaluate manually saved external outputs

1. Run your workflow step **outside PRISM** (copy prompt, execute in your LLM tool).
2. Save the result:
   - JSON artefact → `.json`
   - Rendered page → `.html` or export JSON from PRISM utilities if composed separately
   - Free text → `.txt`
3. Run the diagnostic tool on the saved file path.
4. Optionally compare against a baseline fixture or earlier saved output using `--compare`.

Example workflow:

```bash
# Baseline from repository fixture
node tools/evaluate-educational-quality-framework.js tests/fixtures/page-render/ld-inflation-workshop-page.json

# Candidate from manual capture
node tools/evaluate-educational-quality-framework.js ./captures/inflation-candidate-v2.json

# Compare
node tools/evaluate-educational-quality-framework.js tests/fixtures/page-render/ld-inflation-workshop-page.json --compare ./captures/inflation-candidate-v2.json
```

## Dimensions

The evaluator scans for **heuristic evidence** of eight framework dimensions:

| Dimension | What the scanner looks for |
|-----------|----------------------------|
| **Learner journey** | Progression, arc, overview-to-closure, staged development |
| **Understanding** | Explain, distinguish, concepts, misconceptions, contrast |
| **Capability** | Practice, application, worked/faded tasks, observable outputs |
| **Judgement** | Compare, evaluate, justify, critique, defend, criteria |
| **Independence** | Reduced scaffolding, transfer, self-check, learner decisions |
| **Metacognition** | Reflection, confidence, uncertainty, next steps, self-explanation |
| **Learning success** | Visible progress, expected outputs, study tips, “can do/judge” |
| **Cognitive activity** | Think, compare, evaluate, justify — not surface interaction only |

Default pass threshold for the diagnostic report: **5 / 8 dimensions present** (configurable with `--threshold`).

## Limitations

- The evaluator is **heuristic and diagnostic** — not a full educational quality model.
- Scores are **indicators**, not pass/fail educational judgements.
- Pattern matching can miss good pedagogy expressed in unexpected wording.
- Pattern matching can false-positive on thin keyword use.
- PRISM cannot automatically evaluate outputs produced by external LLM execution.
- Users must manually save, export, or provide outputs for evaluation.

## Related modules

| Module | Role |
|--------|------|
| `lib/educational-quality-framework-prompt.js` | Slice 1–2 runtime prompt contract |
| `lib/educational-quality-framework-evaluator.js` | Slice 3 evidence scanner |
| `tools/evaluate-educational-quality-framework.js` | Slice 4 CLI diagnostic |
| `tools/evaluate-sprint41-benchmarks.js` | Slice 4 benchmark helper |
