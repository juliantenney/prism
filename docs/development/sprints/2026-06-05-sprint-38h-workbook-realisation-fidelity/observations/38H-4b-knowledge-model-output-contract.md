# 38H-4b — Model Knowledge artefact output contract fix

**Date:** 2026-06-05  
**Status:** Fixed and live-validated (harness + pack prompt contract)  
**Unblocks:** 38H-5 full pipeline rerun

---

## Problem

38H pipeline Step 2 (Model Knowledge) returned inline/conversational JSON instead of a clean fenced JSON artefact. Generic `parseJsonFromText` sometimes salvaged output, but capture was unreliable; on failure the harness silently wrote an empty `knowledge_model` shell.

---

## Root cause

1. **Weak harness prompts** — system message was `"Return JSON only for knowledge_model."` with no fenced-block or STEP footer contract aligned with production `buildWorkflowStepInstructions`.
2. **Pack §3 conflict** — `promptTemplate` said “JSON only (no prose outside JSON)” while the Prism runner expects a `STEP N OUTPUT:` footer **outside** the artefact body (`sanitizePrismRunCapturedOutput` strips it before binding).
3. **Silent fallback** — harness replaced parse failures with `{ concepts: [], … }` (missing `groupings`), masking bad captures and letting downstream steps run on empty KM.

---

## Files changed

| File | Change |
|------|--------|
| `artefacts/ev-harness-artefact-parse.js` | **New** — fenced JSON extraction, KM shape normalisation, strict `parseKnowledgeModelCapture` |
| `artefacts/ev-38h-inflation-pipeline-capture-once.mjs` | KM system/user contract, strict parse, `PRISM_HARNESS_KM_ONLY`, harness version `38H-4b` |
| `domains/learning-design/domain-learning-design-step-patterns.md` | §3 Model Knowledge `promptTemplate` output requirements — fenced `json` block + footer-outside-fence |
| `artefacts/HARNESS-CONTRACT.md` | Document KM output contract and KM-only probe |
| `tests/ev-harness-knowledge-model-parse.test.js` | **New** — parse contract unit tests |
| `tests/evaluation-harness-fidelity.test.js` | Assert harness uses strict KM parse (no silent empty fallback) |

**Out of scope (unchanged):** KM schema fields, DLA, GAM, Design Page, `app.js`, renderer.

---

## Validation performed

| Check | Result |
|-------|--------|
| `node --test tests/ev-harness-knowledge-model-parse.test.js` | PASS (6/6) |
| `node --test tests/evaluation-harness-fidelity.test.js` | PASS (8/8) |
| Live KM probe (`PRISM_HARNESS_KM_ONLY=1`) | PASS — 7 concepts captured |
| `EV-38H-AFTER-knowledge-model.json` valid JSON | PASS — all five top-level keys present |
| Downstream wiring | Unchanged — LO/DLA/GAM still receive `JSON.stringify(knowledge_model)` upstream blocks |

---

## Live probe result

```text
PRISM_HARNESS_KM_ONLY=1 node …/ev-38h-inflation-pipeline-capture-once.mjs
→ knowledgeModelConceptCount: 7
→ written: EV-38H-AFTER-knowledge-model.json
```

Disk validation: `JSON.parse` succeeds; keys `concepts`, `relationships`, `groupings`, `processes`, `misconceptions`.

---

## Pack edit note

Initial pack wording used literal triple-backticks inside the Prompt Factory markdown fence, which broke `extractFactory` JSON parsing. Wording changed to “markdown fenced JSON code block” (no literal backticks in the template string).
