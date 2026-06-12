# Sprint 42-7 — GAM Preservation Audit

**Date:** 2026-06-11  
**Type:** Evidence-only trace (no workflow runs, no new captures, no implementation changes)  
**Question:** Where is Generate Activity Materials (GAM) content reduced between GAM output and the final Design Page learner resource?

**Evidence sets used (existing artefacts only):**

| Set | Role | Paths |
| --- | ---- | ----- |
| **Sprint 30 Marx (on-topic)** | Primary A1/A2 GAM→DP→render trace | `docs/development/sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/live-artefacts/marx-activity-materials.txt`, `marx-page.json`, `marx-render.html` |
| **Design-quality Marx fixture** | Contrasting thin page (DLA-shaped, not rich GAM) | `tests/fixtures/page-render/marx-self-study-design-quality-page.json` |
| **Inflation EV-38L (regression fixtures)** | Documented compose-time compression + post-merge restore | `tests/page-38m-gam-preservation.test.js`, `tests/page-gam-materials-projection.test.js` |
| **42-4 clean Marx capture** | Secondary: compose duplication pattern | `captures/.../marx-self-study-2026-06-11T16-23-03/gam-activity-materials.txt`, `design-page.json` |

---

## Required verdict (summary)

| Question | Answer |
| -------- | ------ |
| **Does Design Page receive full GAM content?** | **Yes, when wired** — `activity_materials` is in Design Page `optionalRequires` / `requiresAnyOf`; `buildWorkflowRunStepCopyPrompt` embeds bound GAM captures verbatim in the copy prompt. |
| **Is content being compressed?** | **Sometimes at LLM compose** — prompts forbid it; inflation EV-38L proves synopsis/table-shell thinning can occur pre-merge. **Not observed** in Sprint 30 Marx A1/A2 material fields. |
| **If so, where?** | **Primary loss point: LLM Design Page compose** (before post-processing). **Secondary:** duplicate bare activity rows (compose structure). **Post-compose:** `page-gam-materials-preserve` restores when page body is placeholder/synopsis/under ratio — not when LLM output is “good enough” length but semantically thin. |
| **Is workbook/task-stack feel partly from loss of explanatory GAM content?** | **Partly, but not mainly via Marx A1/A2 material compression.** Sprint 30 Marx preserves GAM exposition in `activity.materials.*`. Workbook feel aligns more with: (1) DLA material-type choices (task_cards + table in design-quality fixture), (2) visual dominance of tables/checklists in render, (3) missing page-level journey sections, (4) compose duplicate activity shells in some runs — not systematic stripping of rich GAM bodies in the on-topic Marx trace. |

---

## 1. Data-flow map: GAM → Design Page → Rendered Page

```mermaid
flowchart TB
  subgraph gam [Generate Activity Materials]
    GAM_OUT[activity_materials capture<br/>JSON or text blocks per activity]
  end

  subgraph prompt [Design Page prompt assembly]
    BIND[inputBindings → embed capture in copy prompt]
    TMPL[§13 promptTemplate + runtime contracts]
    L4[LD-MATERIALS-COPY PREC-02<br/>LD-TABLE-FIDELITY<br/>LD-DESIGN-PAGE-COMPOSE]
  end

  subgraph compose [LLM compose]
    LLM[page JSON with sections[]<br/>learning_activities.content[].materials.*]
  end

  subgraph post [Post-compose — app.js]
    DLA_REPAIR[repairLearnerPageCompositionFromUpstream<br/>DLA framing fields only]
    GAM_MERGE[applyComposedPageGamMaterialsPreserve<br/>page-gam-materials-preserve.js]
    SANITIZE[activity row sanitization / visual affordances]
  end

  subgraph render [Renderer]
    HTML[utility page render<br/>task blocks, tables, prose fields]
  end

  GAM_OUT --> BIND
  BIND --> TMPL
  TMPL --> L4
  L4 --> LLM
  LLM --> DLA_REPAIR
  DLA_REPAIR --> GAM_MERGE
  GAM_MERGE --> SANITIZE
  SANITIZE --> HTML
```

**Binding:** Design Page policy lists `activity_materials` as `optionalRequires` and `requiresAnyOf` (`domain-learning-design-step-patterns.md` §workflowPolicy). Runtime embed (`app.js` `buildWorkflowRunStepCopyPrompt` ~23975–24020) inlines capture text for each internal binding.

**Instruction stance:** §13 Design Page `promptTemplate` and `LD-MATERIALS-COPY` (preserve role) require **verbatim** merge of `activity_materials` into `activity.materials.*` — no paraphrase, shorten, summarise, or compress. Forbidden **inflation-collapse** substitutes are explicitly listed (one-line exposition, outcome-only worked examples, etc.).

**Post-compose GAM merge:** `applyPedagogicCognitionSemanticsToComposedPage` always ends with `applyComposedPageGamMaterialsPreserve` (`app.js` ~36284, ~36342). Upstream GAM is resolved from `workflowRunCapturedOutputs` via `resolveUpstreamActivityMaterialsFromWorkflowCaptures` when not passed explicitly.

**Workflow capture path:** `applyPageCompositionValidationForCapturedPage` calls `applyPedagogicCognitionSemanticsToComposedPage` (DLA upstream only in opts) — GAM merge still runs if GAM capture exists in workflow state.

**Renderer:** Read-only presentation of `activity.materials` named fields; does not strip prose (`marx-render.html` shows full A2 summary bullets).

---

## 2. A1 worked trace — Chronological life phases (Marx)

**Artefact:** Sprint 30 live run (`marx-activity-materials.txt` / `marx-page.json`).

### GAM (Activity A1)

| Material | Type | Content character |
| -------- | ---- | ----------------- |
| M1 | `text` | Unordered life-event list (12 dated bullets). **No** separate worked_example, modelling_note, or reasoning-chain block. |

### Design Page (Activity A1)

| Field | Maps from | Preservation |
| ----- | --------- | ------------ |
| `materials.life_events_list` | M1 body | **Full preservation** — same 12 bullets, same dates/text |

### Survives

- Entire event list verbatim in page JSON and rendered HTML (`marx-render.html` — bullet list under “Life Events List”).

### Lost

- **Nothing from GAM M1** — there is no additional explanatory GAM prose to lose.
- Page-level **knowledge_summary** / central-inquiry exposition not present in this Sprint 30 page (section structure issue, not GAM field stripping).

### Where loss would occur (if GAM were richer)

| Stage | Risk for A1-like `text` list |
| ----- | ------------------------------ |
| LLM compose | Low for lists; higher for long `text` exposition (synopsis replacement) |
| `shouldMergeGamBody` | Merges if placeholder, synopsis, or page &lt; 99% GAM length (tier D default) |
| Renderer | Lists render as bullets — no compression |

**A1 conclusion:** Manual “missing exposition” on A1 is **not** Design Page compressing rich GAM — **GAM only supplied the event list**. Exposition for A1 lives in DLA fields (`activity_preamble`, `study_orientation`, `intellectual_frame`), which render separately from materials.

---

## 3. A2 worked trace — Cause-and-effect mapping (Marx)

**Artefact:** Sprint 30 live run.

### GAM (Activity A2)

| Material | Type | Content character |
| -------- | ---- | ----------------- |
| M2 | `template` | Cause–effect pipe table (8 blank rows) + **sample worked row** with full causal explanation paragraph |
| M3 | `text` | **Key 19th-Century Historical Events** (5 bullets) + **Marxist Theoretical Developments** (6 bullets) — substantive exposition |

### Design Page (Activity A2)

| Field | Maps from | Preservation |
| ----- | --------- | ------------ |
| `materials.cause_effect_template` | M2 table + sample worked pair | **Full preservation** — table rows and sample explanation paragraph present |
| `materials.historical_events_and_theories_summary` | M3 body | **Full preservation** — all event and theory bullets |

### Survives (evidence)

- Page JSON (`marx-page.json` A2 `materials` object): M3 prose intact including Industrial Revolution, Paris Commune, Class Struggle, Alienation, Commodity Fetishism, Historical Materialism, etc.
- Rendered HTML (`marx-render.html`): “Historical Events And Theories Summary” section renders **all** M3 bullets; cause–effect table + sample row render in full.

### Lost

- **No material-body loss** observed between GAM and DP for M2/M3 in Sprint 30.
- M2 and M3 are **split across two material keys** on the page (compose naming), not merged into one field — both bodies present.

### Where loss occurs in other pipelines

Inflation EV-38L (`tests/page-38m-gam-preservation.test.js`):

- **Pre-merge** design page: `worked_judgement_weak_strong` → `synopsis_replacement`; `guided_judgement_table` → `table_shell_collapse`.
- **Post-merge** with `applyGamMaterialsToComposedPage`: ≥90% GAM parity restored.

That pattern is **LLM compose thinning**, corrected by **post-compose GAM overlay** when upstream GAM is available.

---

## 4. Preservation matrix (by material type)

Legend: **FP** full preservation · **PP** partial preservation · **TR** transformation (field rename/split, body kept) · **CP** compression · **OM** omission

| Material type | Prompt instruction (Design Page) | Post-compose overlay behaviour | Sprint 30 Marx evidence | Known loss mode (code/tests) |
| ------------- | -------------------------------- | ------------------------------ | ----------------------- | ---------------------------- |
| **text** | Verbatim copy; no summarise | Merge if placeholder/synopsis/under minRatio | A2 M3 **FP**; A1 M1 **FP** | Synopsis replacement (`design-page-materials-fidelity.js`; inflation test) |
| **worked_example** | Verbatim; anti-collapse rules | Merge if thin or &lt; ratio; maps to `worked_example` | N/A in Marx A1/A2 | One-sentence outcome collapse forbidden; EV-38L synopsis pre-merge |
| **worked_thinking** | Same L4 family as worked_example | Alias → `worked_example` if needed | N/A Marx | Same as worked_example |
| **modelling_note** | Verbatim | Maps to `modelling_note` or `worked_judgement_weak_strong` | N/A Marx; **FP** in 42-4 SDL A3 | Synopsis if LLM replaces with “stepwise reasoning” stub |
| **scenario** | Verbatim named scenarios | Tier A contracts (0.9 ratio) | N/A Marx A1/A2 | Synopsis “scenarios are provided…” |
| **transfer_prompt** | Verbatim; closure minima in GAM-PRES | `severeCompression` detector | N/A Marx | Bullet-level loss if &lt;50% length |
| **consolidation_summary** | Verbatim | `severeCompression` detector | N/A Marx | Short stub vs full guidance |
| **checklist** | Verbatim | Standard merge | 42-4 SDL **FP** | Rare compression |
| **template / tables** | Pipe table + adjunct prose (38H-3) | `tableShellCollapse` triggers merge | A2 M2 **FP** (table + sample row) | Partial example shell without exemplar row |
| **comparison_table** | Verbatim | Table fidelity tier D 0.99 | A3 in Sprint 30 **FP** | CSV/comma-row flattening forbidden |
| **task_cards** | Verbatim if upstream | Preserved as structured array | Design-quality fixture only — **never rich GAM** | Not compose loss — DLA requested cards |
| **sample_output** | Verbatim | Maps to `sample_output` | 42-4 SDL A1 **FP** | — |
| **prompt_set** | Verbatim | Standard merge | 42-4 SDL A4 **FP** | — |

**Cross-cutting compose behaviours (not type-specific):**

| Mechanism | Effect |
| --------- | ------ |
| **LLM compose** | Can emit synopsis, shorter bodies, or missing keys despite prompt — **documented** on inflation page pre-merge |
| **`shouldMergeGamBody`** | Only overwrites page when placeholder, synopsis/shell detectors fire, or length ratio below tier threshold — **won’t fix** semantic thinning that stays above ~99% length |
| **Duplicate activity rows** | 42-4 `design-page.json`: four rows **with** materials + four **without** (`activity_id` A1–A4 shells) — **OM** of materials on duplicate rows, not compression of merged row |
| **`mergeMaterialsObjects` skip list** | Skips overwriting some canonical keys when merging objects — list-level merge path uses `mergeMaterialsFromGamList` per material |
| **Renderer** | No evidence of prose stripping; tables/checklists dominate visual scan |

---

## 5. Code investigation answers

### A. Does Design Page receive full GAM content?

**Yes, when the workflow binds GAM** — capture text is embedded in the step copy prompt. §13 Context names `activity_materials`. Policy requires at least one of `activity_materials`, `knowledge_model`, `learning_content`, etc.

If GAM step is absent or capture empty, Design Page composes from `learning_activities` obligations only — **no GAM bodies to preserve**.

### B. Is Design Page instructed to preserve, summarise, compress, re-author, or excerpt?

| Instruction | Source |
| ----------- | ------ |
| **Preserve verbatim** | §13 promptTemplate; `LD-MATERIALS-COPY` preserve role; `LD-DESIGN-PAGE-COMPOSE-CONTRACT`; `LD-TABLE-FIDELITY` |
| **Do not summarise/compress** | Explicit; `generation_notes.limitations` if hard limit hit |
| **Re-author** | Forbidden for `activity.materials.*`; wrapper prose only |
| **Select excerpts** | Forbidden for materials; full merge per `activity_id` |

**Implicit pressure (wrapper only, not materials):** PREC-02 states materials fidelity **overrides** overview thinning — overview may be shorter; materials must not be.

**No token-budget instruction** in Design Page contracts targeting materials bodies.

### C. Are material types treated differently?

**In prompts:** Tables have extra pipe/adjunct rules; worked/consolidation/transfer called out in anti-collapse forbidden list.

**In post-compose (`page-gam-materials-preserve.js`):**

- Field key mapping by `type` + `purpose` (`pageFieldKeyForMaterial`)
- Tier A/B/C/D fidelity contracts with different `minRatio` (0.9–0.99)
- Special detectors: `catalogueSynopsis`, `tableShellCollapse`, `metaReplacement`, `severeCompression` for transfer/consolidation

### D. Pressure toward shorter / activity-first / worksheet outputs?

| Pressure | Applies to materials? | Evidence |
| -------- | ---------------------- | -------- |
| Read-only compose + activity membership | Structure — must include all activities | §13 ACTIVITY MEMBERSHIP |
| “Readable page assembly” on sections/headings | Wrapper | Not materials |
| Visual affordances additive only | No | Sprint 38 contract |
| LLM default brevity | **Yes — risk** | EV-38L pre-merge failures |
| Renderer task-block layout | **Perception** | Tables/cards visually dominate even when prose fields exist (`marx-render.html` A2) |
| DLA `task_cards` + `template` together | **Upstream** | `marx-self-study-design-quality-page.json` — thin by design, not DP compression |

---

## 6. Contrasting evidence — when “loss” is real vs perceived

### 6.1 Sprint 30 Marx (on-topic) — materials not lost

GAM richest exposition for A2 is M3 (`historical_events_and_theories_summary` on page). **Fully present** in JSON and HTML.

### 6.2 Design-quality Marx fixture — never had rich GAM

`tests/fixtures/page-render/marx-self-study-design-quality-page.json`: A2 has `task_cards` + `cause_effect_table` only — matches [hotfix investigation](docs/development/hotfix-marx-self-study-design-quality-investigation.md) verdict: **DLA material mix**, Design Page “faithful passthrough.”

### 6.3 Inflation EV-38L — compose-time loss, post-merge restore

`tests/page-38m-gam-preservation.test.js`:

- Raw design page: synopsis replacements, table shell collapse (**loss at compose**).
- After `applyGamMaterialsToComposedPage`: ≥90% parity (**restore at post-compose**).

### 6.4 42-4 clean Marx — materials preserved on primary rows; structural duplication

`design-page.json` (SDL topic): first four activity objects contain **full** `worked_example` Reasoning Steps, `modelling_note`, `consolidation_summary`, etc. — byte-level match to `gam-activity-materials.txt`.

Additional A1–A4 rows **omit** `materials` entirely (compose duplication). Renderer/workbook feel may include **repeated activity headers without materials**, not stripped GAM prose on the primary row.

**Note:** 42-4 capture has **no** `metadata.gam_materials_preserve_applied` — either LLM copied materials faithfully without needing overlay, or post-process metadata not recorded on save. Materials on primary rows are complete either way.

---

## 7. Loss location summary

| Stage | What can be lost | Marx A1/A2 (Sprint 30) | Mitigation in codebase |
| ----- | ---------------- | ------------------------ | ---------------------- |
| **GAM generation** | Rich types not requested by DLA | A1: no exposition material spec | GAM cannot add unprompted bodies |
| **Prompt embed** | GAM not bound → model never sees bodies | N/A when wired | Workflow bindings |
| **LLM Design Page compose** | Synopsis, compression, missing keys, duplicate shells | **No body loss** Sprint 30; duplication in 42-4 | Prompt L4 contracts |
| **`repairLearnerPageCompositionFromUpstream`** | Framing fields only; **not** materials | No material change | DLA upstream |
| **`applyGamMaterialsToComposedPage`** | Restores when detectors fire | No-op if already full | `page-gam-materials-preserve.js` |
| **Renderer** | None observed | Full render | — |

---

## 8. Implications for manual Marx review (facts only)

1. **GAM → DP material bodies for on-topic Marx A2 are not systematically compressed** in the Sprint 30 trace; explanatory M3 prose survives end-to-end.
2. **A1 has no rich GAM exposition to lose** — only the event list; “why this matters” is in DLA preamble/orientation fields, not `materials.*`.
3. **Workbook/task-stack perception** on some Marx pages correlates with **DLA material shapes** (task_cards, bare comparison prompts) in fixtures like `marx-self-study-design-quality-page.json`, **not** with Design Page stripping rich GAM text that was present upstream.
4. **Compose-time compression is a real, tested failure mode** (inflation EV-38L) but **post-compose GAM merge is designed to repair it** when workflow captures are available.
5. **Journey/exposition loss** described in Sprint 42-5 is predominantly **wrapper prose and page sections** (overview, knowledge_summary), not verified stripping of GAM `activity.materials.*` in the on-topic Marx artefact set.

---

## 9. Key code references

| Concern | Location |
| ------- | -------- |
| Design Page §13 materials instructions | `domains/learning-design/domain-learning-design-step-patterns.md` (~3451) |
| LD-MATERIALS-COPY PREC-02 | `lib/ld-materials-copy.js` |
| Copy prompt embed | `app.js` `buildWorkflowRunStepCopyPrompt` |
| Post-compose GAM merge | `app.js` `applyComposedPageGamMaterialsPreserve`; `lib/page-gam-materials-preserve.js` |
| Merge decision logic | `shouldMergeGamBody`, `classifyLossType` |
| Synopsis detection | `lib/design-page-materials-fidelity.js` |
| DLA-only repair | `app.js` `repairLearnerPageCompositionFromUpstream` |
| Regression: compose loss + restore | `tests/page-38m-gam-preservation.test.js`, `tests/page-gam-materials-projection.test.js` |

---

**Investigation complete.** No workflows run. No implementation changes. No fix recommendations (per scope).
