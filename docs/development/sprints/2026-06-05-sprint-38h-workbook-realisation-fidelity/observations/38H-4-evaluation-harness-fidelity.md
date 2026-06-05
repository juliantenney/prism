# Slice 38H-4 — Evaluation Harness Fidelity

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Harness script + contract documentation (no pack/app/schema changes)  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38H-4  
**Inputs:** [38H-1](38H-1-workbook-realisation-fidelity-analysis.md) · [38G-5](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-5-acm-realisation-trace.md) · [38G-6](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-6-sprint-closure-and-retrospective.md)

---

## 1. Current harness recap (pre-38H-4)

| Script | Sprint | Pipeline | KM artefact |
|--------|--------|----------|-------------|
| `ev-38e10-inflation-pipeline-capture-once.mjs` | 38E | Brief → synthetic LO → DLA → GAM → Page | **No** |
| `ev-38f-inflation-pipeline-capture-once.mjs` | 38F | Same pattern | **No** |
| `ev-38g-inflation-pipeline-capture-once.mjs` | 38G | Brief → synthetic LO → DLA → GAM → Page | **No** |

**Captured (38G):** `dla-learning-activities.json`, `gam.txt`, `design-page.json`, `run-log.json`  
**Omitted:** `learning_content`, `knowledge_model`, `learning_outcomes` file

---

## 2. Root cause

Evaluation harnesses **short-circuited** the architecture at **Define Learning Outcomes** with a one-shot synthetic JSON task, bypassing:

- **Generate Learning Content** (§2)  
- **Model Knowledge** (§3)  
- Pack-augmented **LO** generation from `knowledge_model`

**Impact:** Cannot evaluate KM→LO→DLA exploitation claims (e.g. GDP deflator, programme misconceptions — 38G-5 Pattern E). **Does not affect** DLA→GAM→page fidelity tests (H-01/H-02) on frozen `EV-38G-AFTER`.

---

## 3. Files modified / created

| File | Action |
|------|--------|
| `artefacts/ev-38h-inflation-pipeline-capture-once.mjs` | **Created** — full evaluation harness |
| `artefacts/HARNESS-CONTRACT.md` | **Created** — harness contract |
| `tests/evaluation-harness-fidelity.test.js` | **Created** — static contract tests (7) |
| `ev-38g-inflation-pipeline-capture-once.mjs` | **Unchanged** — frozen comparator script |
| Pack, `app.js`, renderer, schemas | **Unchanged** |

---

## 4. Before / after flow diagrams

### 4.1 Before (EV-38G and predecessors)

```text
Brief (inline)
    ↓
Learning Outcomes (synthetic one-shot — NOT pack §4)
    ↓
DLA  →  GAM  →  Design Page
```

### 4.2 After (38H-4 harness → EV-38H-AFTER)

```text
Brief (inline)
    ↓
Generate Learning Content     →  learning-content.json
    ↓
Model Knowledge               →  knowledge-model.json
    ↓
Define Learning Outcomes      →  learning-outcomes.json  (pack §4 + KM)
    ↓
DLA                           →  dla-learning-activities.json
    ↓
GAM                           →  gam.txt
    ↓
Design Page                   →  design-page.json
```

---

## 5. Artefact changes

| Artefact | 38G harness | 38H harness |
|----------|-------------|-------------|
| `{PREFIX}-learning-content.json` | — | **New** |
| `{PREFIX}-knowledge-model.json` | — | **New** |
| `{PREFIX}-learning-outcomes.json` | — | **New** |
| `{PREFIX}-dla-learning-activities.json` | ✓ | ✓ |
| `{PREFIX}-gam.txt` | ✓ | ✓ |
| `{PREFIX}-design-page.json` | ✓ | ✓ |
| `{PREFIX}-run-log.json` | ✓ | ✓ (extended: `pipelinePath`, `knowledgeModelCaptured`, upstream `promptChars`) |

**Default prefix:** `EV-38H-AFTER` (`PRISM_RUN_PREFIX` override supported).

**Frozen:** `EV-38G-AFTER-*` and all prior comparators — harness writes to **38H artefacts folder only**.

---

## 6. Risks

| Risk | Mitigation |
|------|------------|
| Longer / costlier evaluation runs | Documented; 7 LLM steps vs 4 — acceptable for evaluation cadence |
| KM quality varies run-to-run | `run-log.json` records `knowledgeModelConceptCount`; 38H-5 trace compares |
| Downstream DLA/GAM output diverges from EV-38G | **Expected** — KM-enabled path; compare 38H vs 38G explicitly in 38H-5 |
| `app.js` inline LD-TABLE bootstrap stale | Browser loads `lib/` first; harness loads lib in vm — unchanged from 38G pattern |

---

## 7. Validation plan

### 7.1 Completed (38H-4)

- [x] Harness script with LC → KM → LO → DLA → GAM → Page  
- [x] `knowledge-model.json` write path  
- [x] KM passed to LO, DLA, GAM, Design Page prompts  
- [x] Legacy `ev-38g-*` script **unchanged**  
- [x] `tests/evaluation-harness-fidelity.test.js` — **7/7 PASS**  
- [x] [HARNESS-CONTRACT.md](../artefacts/HARNESS-CONTRACT.md)

### 7.2 On 38H-5 (pipeline execution)

```bash
node docs/development/sprints/2026-06-05-sprint-38h-workbook-realisation-fidelity/artefacts/ev-38h-inflation-pipeline-capture-once.mjs
```

1. Confirm `EV-38H-AFTER-knowledge-model.json` exists with `concepts` array.  
2. Confirm `run-log.json`: `knowledgeModelCaptured: true`, `pipelinePath` includes `model_knowledge`.  
3. Realisation trace vs `EV-38G-AFTER` for H-01/H-02/H-03 fixes.

---

## 8. Success criterion

| Criterion | Status |
|-----------|--------|
| Evaluation path includes KM stage | **DONE** (harness + contract) |
| `knowledge_model` artefact captured on run | **Pending** — 38H-5 execution |
| Comparator naming preserved | **DONE** — frozen EV-38G; new EV-38H prefix |
| No production pipeline impact | **DONE** — artefacts script only |
| Legacy harness unchanged | **DONE** — verified by test |

**Slice 38H-4:** **COMPLETE**  
**Next:** **38H-5** — run harness → `EV-38H-AFTER-*` + realisation trace
