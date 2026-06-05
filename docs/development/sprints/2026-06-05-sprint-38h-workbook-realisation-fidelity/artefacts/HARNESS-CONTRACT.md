# Evaluation harness contract — Sprint 38-H

**Version:** 38H-4b  
**Script:** `ev-38h-inflation-pipeline-capture-once.mjs`  
**Purpose:** Production-aligned inflation anchor capture for workbook evaluation runs.

---

## Pipeline path (38H-4+)

```text
Brief (inline BRIEF constant)
  → Generate Learning Content     → learning_content
  → Model Knowledge               → knowledge_model
  → Define Learning Outcomes      → learning_outcomes  (pack §4 + KM upstream)
  → Design Learning Activities    → learning_activities
  → Generate Activity Materials   → activity_materials (gam.txt)
  → Design Page                   → page
```

**Not in harness:** Normalize Content (no source transcript on anchor), assessment steps, learning sequence.

---

## Artefact naming

| File | Step output |
|------|-------------|
| `{RUN_PREFIX}-learning-content.json` | `learning_content` |
| `{RUN_PREFIX}-knowledge-model.json` | `knowledge_model` |
| `{RUN_PREFIX}-learning-outcomes.json` | `learning_outcomes` |
| `{RUN_PREFIX}-dla-learning-activities.json` | `learning_activities` |
| `{RUN_PREFIX}-gam.txt` | `activity_materials` |
| `{RUN_PREFIX}-design-page.json` | `page` |
| `{RUN_PREFIX}-run-log.json` | Run metadata |

**Default `RUN_PREFIX`:** `EV-38H-AFTER` (override via `PRISM_RUN_PREFIX` env).

---

## Frozen comparators (do not overwrite)

`EV-01` · `EV-38E5-AFTER-*` · `EV-38E10-AFTER-*` · `EV-38F-AFTER-*` · `EV-38G-AFTER-*`

Legacy scripts (`ev-38g-inflation-pipeline-capture-once.mjs`, etc.) remain unchanged for historical comparison.

---

## Brief anchor

Same inflation self-study brief as `EV-38G-AFTER` / `EV-38F-AFTER`:

- CPI, GDP deflator, household scenarios, policy communication
- First-year undergraduate economics (self-directed study)
- Learner-facing page output

---

## Upstream wiring

| Downstream step | Receives |
|-----------------|----------|
| Model Knowledge | `learning_content` |
| Define Learning Outcomes | `knowledge_model` (+ optional `learning_content`) |
| DLA | `learning_outcomes`, `knowledge_model` |
| GAM | `learning_activities`, `knowledge_model` |
| Design Page | `learning_activities`, `activity_materials`, `knowledge_model`, `learning_outcomes` |

---

## Production isolation

- Harness is **docs/artefacts only** — does not modify `app.js`, workflow UI, or pack.
- Uses `__PRISM_TEST_API` + pack augmentation (same pattern as 38G capture).

---

## Model Knowledge output contract (38H-4b)

Step 2 (`knowledge_model`) must be capture-safe:

- One fenced ` ```json ` block with valid JSON only inside the fence
- No prose before the fence
- Runner footer **outside** the fence: `STEP 2 OUTPUT: knowledge_model`
- Top-level keys: `concepts`, `relationships`, `groupings`, `processes`, `misconceptions` (empty arrays when none apply)

Harness uses `parseKnowledgeModelCapture` + `sanitizePrismRunCapturedOutput` (same footer strip as production). Parse failure aborts the run and writes `{RUN_PREFIX}-knowledge-model-raw.txt`.

KM-only probe:

```bash
PRISM_HARNESS_KM_ONLY=1 node docs/development/sprints/2026-06-05-sprint-38h-workbook-realisation-fidelity/artefacts/ev-38h-inflation-pipeline-capture-once.mjs
```

---

## Run

```bash
node docs/development/sprints/2026-06-05-sprint-38h-workbook-realisation-fidelity/artefacts/ev-38h-inflation-pipeline-capture-once.mjs
```

Requires `OPENAI_API_KEY` in repo-root `.env.local`. Optional: `PRISM_PROBE_MODEL`, `PRISM_RUN_PREFIX`, `PRISM_HARNESS_KM_ONLY`.
