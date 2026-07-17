# Sprint 65 — Fresh Pipeline Artifact Validation

## Task

**S65-BL-008b — Fresh Pipeline Artifact Validation**

Validate whether BL-008’s coverage finding (`10/12` bit-identical; activation concentrated on beat-plan pages) reflects the **current pipeline**, or an outdated / mixed evidence base.

```text
BL-008 Outcome B — unchanged
Prototype accepted
Production readiness not established
```

**This task validates inputs, not outputs.** Prototype code, activation logic, and renderer behaviour were not modified.

## Core question

> If we generate a fresh corpus from the current codebase and current pipeline today, does the prototype still only activate on a small subset of pages?

**Answer:** On the live Sprint 42-4 pipeline today, **Composition C does not activate at all** (0/3 fresh pages; 0/3 matched historical pipeline pages). Page-level journey-overview omit can still fire when a Learning Journey section exists. BL-008’s 2/12 activation rate came from **historical beat-rich fixtures**, not from live pipeline artefacts.

## Status preserved

| Item | Status |
| ---- | ------ |
| BL-008 Outcome B | Unchanged |
| Prototype disposition | Unchanged — default `current` |
| Production readiness | **Not established** |
| BL-009 | Not started |
| Prototype / activation code | **Unchanged** this task |

---

## Phase 1 — Corpus audit (BL-008 samples)

**Rule:** A sample participates as *fresh* only if generated through the current pipeline with recorded timestamp, commit, workflow, and preserved inputs/outputs. `tests/fixtures/page-render/*` have **no** npm regeneration path; they are lock fixtures.

| Sample | Origin | Generation date | Commit | Fresh? | Evidence |
| ------ | ------ | --------------- | ------ | ------ | -------- |
| rna-hcv | `tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json` (hand/assembled lock; beat-rich) | File mtime 2026-07-16; last commit `ac79470` (docs/fixture formalize) | `ac79470` | **Historical** | 22 beats · 6 episode_plans · archetypes present · **not** live-capture output |
| rna-assessment | Fixture lock | 2026-05-19 | May-era fixture | **Historical** | 0 beats |
| kitchen-sink | Fixture lock | 2026-06-01 | June fixture | **Historical** | 0 beats · unknown keys |
| marx-beat | Fixture lock | 2026-06-30 · commit `f7d2cde` | `f7d2cde` | **Historical** | 21 beats · 5 episode_plans · archetypes |
| marx-self-study | Fixture lock (related to Sprint 42 Marx theme) | 2026-06-11 | June fixture | **Historical** | 0 beats · not today’s live run |
| inflation | Fixture lock | 2026-05-19 · commit `4a58897` | `4a58897` | **Historical** | 0 beats |
| climate | Fixture lock | 2026-05-21 | May fixture | **Historical** | 0 beats |
| self-directed | Fixture lock | 2026-06-01 | June fixture | **Historical** | 0 beats |
| shape-metadata | Fixture lock | 2026-05-15 | May fixture | **Historical** | Sparse · 0 beats |
| confidence-multitable | Fixture lock | 2026-06-03 | June fixture | **Historical** | 0 beats |
| sequencing-rollout | Fixture lock | 2026-06-02 | June fixture | **Historical** | 0 beats |
| shape-assessment-mcq | Fixture lock | 2026-05-15 | May fixture | **Historical** | Sparse · 0 beats |

### Classification summary

| Class | Count | Notes |
| ----- | ----- | ----- |
| Fresh | **0 / 12** | None meet corpus freshness rules |
| Historical | **12 / 12** | Fixture locks; two are synthetic beat-plan pages |
| Unknown | 0 | Provenance weak for some commits, but all are clearly non–live-today |

**Implication:** BL-008 measured a **mixed historical fixture corpus**, not a fresh current-pipeline corpus. The only pages that activated Composition C (`rna-hcv`, `marx-beat`) are the only fixtures that contain `episode_plan.beats`.

---

## Phase 2 — Fresh corpus generation

### Workflow

Current live assembly path (OpenAI available):

```text
node tools/sprint-42-4-live-capture.mjs marx-self-study
node tools/sprint-42-4-live-capture.mjs inflation-workshop
node tools/sprint-42-4-live-capture.mjs climate-workshop
```

Commit at generation: **`d36af7d`** (working tree dirty — Sprint 65 prototype wiring present; prototype **not** altered for this task).  
Model recorded in provenance: `gpt-4.1-mini`.

### Generation records

| Sample ID | Timestamp | Commit | Workflow | Source run dir | Preserved input |
| --------- | --------- | ------ | -------- | -------------- | --------------- |
| fresh-marx-2026-07-16 | 2026-07-16T14:33:08.207Z | d36af7d | marx-self-study | `…/42-4-live-runs/marx-self-study-2026-07-16T14-30-30/` | `samples/fresh-validation/fresh-marx-2026-07-16-input-page.json` (+ DLA) |
| fresh-inflation-2026-07-16 | 2026-07-16T14:35:27.182Z | d36af7d | inflation-workshop | `…/inflation-workshop-2026-07-16T14-33-34/` | `…/fresh-inflation-2026-07-16-input-page.json` (+ DLA) |
| fresh-climate-2026-07-16 | 2026-07-16T14:38:51.763Z | d36af7d | climate-workshop | `…/climate-workshop-2026-07-16T14-35-28/` | `…/fresh-climate-2026-07-16-input-page.json` (+ DLA) |

Render harness (does not overwrite BL-008):

```text
node docs/development/sprints/2026-07-16-sprint-65-renderer-learner-experience-optimisation/samples/capture-fresh-validation-render.js
```

Captured at: **2026-07-16T14:40:09.468Z** · meta: [`samples/fresh-validation/fresh-capture-meta.json`](samples/fresh-validation/fresh-capture-meta.json)

### Coverage vs target matrix

| Target coverage | Achieved with fresh live runs? | Notes |
| --------------- | ------------------------------ | ----- |
| Archetypes understand/apply/analyse/evaluate/missing | **Missing only** | Live design-pages emit **no** archetypes |
| Density sparse/medium/rich | Partial | Fresh marx/inflation design-pages thin (0 sections); climate + June hist richer |
| Clean beat mapping | **No** | 0 beats in all live outputs |
| Residual-heavy / orphan / unknown-type | Not in fresh set | Would require fixture or richer assembly |
| Assessment-heavy | Not generated | Out of Sprint 42-4 workshop trio |
| Diagnostic-rich/light | Light–medium | Provenance + DLA cognition present; page diagnostics vary |

**Objective was coverage, not quantity.** The critical coverage fact is structural: **current live pipeline does not emit `episode_plan.beats` or page archetypes** for these workflows.

### Comparison anchors (pipeline-historical, not fresh)

Same workflow family from 2026-06-11 live runs, re-rendered today for comparison only:

| Sample ID | Class | Generated |
| --------- | ----- | --------- |
| pipeline-hist-marx-2026-06-11 | pipeline-historical | 2026-06-11 |
| pipeline-hist-inflation-2026-06-11 | pipeline-historical | 2026-06-11 |
| pipeline-hist-climate-2026-06-11 | pipeline-historical | 2026-06-11 |

---

## Phase 3 — Shape inspection

| Sample | Beats present | Archetype | Materials / activities | Assessment | Notes |
| ------ | ------------- | --------- | ---------------------- | ---------- | ----- |
| fresh-marx | **0** (page + DLA) | none | DLA: 3 learner_tasks / 3 activity_ids; page sections **0** | No | Thin design-page; cognition on DLA only |
| fresh-inflation | **0** | none | DLA: 4 tasks / 4 ids; page sections **0** | No | Same thin-page pattern |
| fresh-climate | **0** | none | Page: 4 activity_ids · 11 cognition hits · 1 section; DLA parallel | No | Richest fresh page; still **0 beats** |
| pipeline-hist-marx | **0** | none | Page richer (4 sections · tasks present) | No | Confirms June live path also beatless |
| pipeline-hist-inflation | **0** | none | 3 sections · tasks | No | Beatless |
| pipeline-hist-climate | **0** | none | 3 sections · tasks | No | Beatless |

**Most important measurement**

```text
Current-pipeline artefacts containing structures required to mount Composition C
(episode_plan.beats non-empty): 0 / 6 inspected live-family pages
```

Evidence: [`evidence/fresh-validation/shape-inspection.json`](evidence/fresh-validation/shape-inspection.json)

---

## Phase 4 — Prototype activation audit

Modes: `renderMode=current` vs `renderMode=s65-prototype`.  
Outputs: [`samples/fresh-validation/`](samples/fresh-validation/)  
Audit JSON: [`evidence/fresh-validation/activation-audit.json`](evidence/fresh-validation/activation-audit.json)

| Sample | Prototype activated? | Why? | Evidence |
| ------ | -------------------- | ---- | -------- |
| fresh-marx | **Partial page-IA only** — Composition C **Not activated** | 0 beats → activity contract not mounted; Learning Journey overview reprint omitted under prototype (`intro` → `purpose`-only) | HTML Δ −396; Your task Δ 0; Mode badge Δ 0 |
| fresh-inflation | **Partial page-IA only** — Composition C **Not activated** | Same | Δ −617; contract markers 0 |
| fresh-climate | **Partial page-IA only** — Composition C **Not activated** | Same | Δ −345; contract markers 0 |
| pipeline-hist-marx | **Not activated** | 0 beats; bit-identical | Δ 0 |
| pipeline-hist-inflation | **Not activated** | 0 beats; bit-identical | Δ 0 |
| pipeline-hist-climate | **Not activated** | 0 beats; bit-identical | Δ 0 |

### Activation classes (Composition C = primary BL-008 LX gains)

| Class | Fresh (n=3) | Pipeline-hist (n=3) |
| ----- | ----------- | ------------------- |
| Activated (Composition C) | **0** | **0** |
| Eligible but unchanged (mounted equivalent) | 0 | 0 |
| Not activated (Composition C) | **3** | **3** |
| Partial page-IA only (journey omit) | **3** | 0 |

Harness initial labels “Eligible but unchanged / unclear delta” are superseded by the HTML inspection above: deltas are **journey overview omit**, not activity contracts.

---

## Phase 5 — Root cause analysis

| Hypothesis | Verdict | Evidence |
| ---------- | ------- | -------- |
| **A** — Prototype coverage genuinely limited | **Supported** | Live pipeline emits 0 beats → Composition C mount rate **0%** on fresh corpus |
| **B** — Historical corpus missing modern structures / misrepresents pipeline | **Supported (inverted mix)** | BL-008 beat activation came from **synthetic fixture beats**, which **over-represent** live coverage; live pages lack those structures |
| **C** — Both | **Accepted** | Path gate is real (A); BL-008 corpus was not a fresh pipeline sample (B) |
| **D** — Prototype activation defect (beyond documented gate) | **Not supported** | Gate behaves as coded (`hasEpisodePlanBeats`); no unexpected Composition C mounts; page-IA omit works when journey sections exist |

**Root-cause outcome: C**

BL-008 correctly identified the mount gate. It **overestimated** how often production-like pipeline pages would enter that gate, because 2/12 fixtures were beat-authored locks rather than live outputs.

---

## Phase 6 — Re-run validation (coverage focus)

For fresh pages, Composition C did not activate. Dimension review vs Sprint 65 framework:

| Dimension | Fresh current vs prototype | Notes |
| --------- | -------------------------- | ----- |
| Action | No Composition C change | No “Your task” |
| Output | No Composition C change | No “Produce” |
| Material role | No beat-path role grouping | Non-beat shell unchanged |
| Cognitive mode | No mode badges | No archetypes on live pages |
| Progression | Journey overview omit only | Page-IA partial |
| Residual safety | N/A (no activation class residuals) | — |
| Duplication | Overview reprint reduced when omit fires | Matches PROT journey omit |
| Density | Slightly lower journey text under prototype | Not a contract upgrade |

**Validation score summary (fresh Composition C path):** no activation-class pages → **no Action/Output/Mode score gains** on live pipeline today. BL-008 scores on rna-hcv / marx-beat remain valid **for beat-fixture path only**.

---

## Historical vs fresh comparison

| Measure | Historical corpus (BL-008 fixtures) | Fresh corpus (live 2026-07-16) | Difference |
| ------- | ----------------------------------- | ------------------------------ | ---------- |
| Beat presence | 2/12 pages (rna-hcv, marx-beat) | **0/3** | Live lacks beats entirely |
| Archetype presence | 2/12 (same two) | **0/3** | Live lacks archetypes |
| Cognition presence | Mixed; strong on kitchen-sink / marx-beat / self-directed | DLA cognition present; page thin on marx/inflation | Live cognition often on DLA, not design-page |
| Prototype Composition C activation | **2/12 (17%)** | **0/3 (0%)** | BL-008 **overestimated** live activation |
| Page-IA journey omit | Rarely visible (10/12 identical) | **3/3** fresh showed omit delta | Fresh surfaces page-IA without Composition C |
| Residual frequency (prototype attrs) | On rna-hcv only | **0** | Tied to beat path |
| Assessment frequency | 2 sparse assessment fixtures | **0** in fresh trio | Coverage gap for assessment |

**Does the historical corpus accurately represent the current pipeline?**  
**No** for activation rate. It mixed beat-authored fixtures with non-beat fixtures. Live pipeline today matches the **non-beat majority**, not the beat minority.

---

## Activation coverage analysis

| Coverage measure | Historical (BL-008) | Fresh (live) |
| ---------------- | ------------------- | ------------ |
| Pages activating Composition C | 2/12 | **0/3** |
| Pages with beats | 2/12 | **0/3** |
| Pages with archetypes | 2/12 | **0/3** |
| Pages showing role grouping (prototype) | 2/12 | **0/3** |
| Pages showing mode cues | 2/12 | **0/3** |
| Pages showing residual handling (prototype) | 1/12 (rna A3) | **0/3** |
| Pages showing journey-overview omit | ≤2/12 (activation class) | **3/3** |

**Did BL-008 underestimate coverage?**  
**No — it overestimated Composition C coverage for live pipeline traffic.** It correctly measured fixture behaviour.

---

## Remediation review

| Remediation | Still needed? | Evidence |
| ----------- | ------------- | -------- |
| **S65-REM-001** Mount Composition C without requiring `episode_plan.beats` | **Confirmed (strengthened)** | Live activation rate **0%**; design intent requires task/output path |
| **S65-REM-002** Dual Orient/Think vs Why/Approach framing | **Weakened for live urgency**; still required on beat/fixture path | Fresh pages never reach dual framing; rna/marx-beat still show it |
| **S65-REM-003** Unknown residual role grouping on non-beat stacks | **Confirmed** | Live path **is** the non-beat stack; kitchen-sink gap remains relevant |

No new remediations invented. REM-004/005 unchanged optional/deferred.

---

## Decision review

| Decision | Amendment? | Clarification |
| -------- | ---------- | ------------- |
| **S65-D57** Outcome B → BL-009 with remediations | **No rewrite** | Clarification: proceed with **REM-001 prioritised** because live coverage is worse than fixture mix suggested |
| **S65-D58** Keep default `current`; no production readiness | **No rewrite** | Reaffirmed — fresh evidence does **not** establish readiness |
| **S65-D59** Path-coverage gap = defect for BL-009 | **No rewrite** | Clarification: gap is not only a fixture-path issue; it is the **dominant live-pipeline** behaviour |

### Decision clarifications (new)

| ID | Date | Clarification |
| -- | ---- | ------------- |
| S65-D60 | 2026-07-16 | Fresh-pipeline validation Outcome **F2** — BL-008 conclusions on the mount gate stand; live activation coverage is lower than the 2/12 fixture rate; BL-009 remediations revised in priority (REM-001 strengthened) |
| S65-D61 | 2026-07-16 | BL-008 fixture corpus classified **Historical** for freshness purposes; beat-rich fixtures remain valid for **beat-path** behaviour only, not as proxies for current live assembly |
| S65-D62 | 2026-07-16 | Production readiness remains **not established**; BL-009 may begin as hardening **investigation** only |

---

## Acceptance outcome

## Outcome F2

Fresh corpus **partially weakens** the BL-008 *coverage interpretation* (activation rate for live traffic), while **confirming** the technical path-gate finding.

**Proceed to BL-009 with revised remediations** (REM-001 strengthened; REM-002 deprioritised for live-first work; REM-003 confirmed).

Not F1 (coverage interpretation changed).  
Not F3 (no need to repeat full BL-008 scoring on beat fixtures).  
Not F4 (corpus was incomplete for live claims, but findings remain usable with clarification).

---

## Prototype integrity

| Check | Result |
| ----- | ------ |
| `lib/s65-learner-experience-prototype.js` modified this task? | **No** (SHA256 `5CCAFBBCA2BB6869A6A42A8849BD6A9F9AF48FCD6CC854C6D26FDE9B61FEF0E3`) |
| Activation / mount logic changed? | **No** |
| BL-008 `samples/validation/` overwritten? | **No** |
| Fresh artefacts generated? | **Yes** |
| Provenance recorded? | **Yes** (`provenance-manifest.json` + `fresh-capture-meta.json`) |

---

## Artefact index

| Artefact | Path |
| -------- | ---- |
| This deliverable | [`fresh-pipeline-artifact-validation.md`](fresh-pipeline-artifact-validation.md) |
| Fresh samples | [`samples/fresh-validation/`](samples/fresh-validation/) |
| Evidence | [`evidence/fresh-validation/`](evidence/fresh-validation/) |
| Screenshot notes | [`screenshots/fresh-validation/`](screenshots/fresh-validation/) |
| Live run sources | `docs/development/sprints/2026-06-11-sprint-42-authorial-quality-educational-exposition/captures/sprint-42-exposition/42-4-live-runs/*-2026-07-16*` |

---

## Recommendation for BL-009

1. Treat **REM-001** as the primary hardening investigation — without it, live pipeline learners get almost none of Composition C.  
2. Keep feature switch default **`current`**.  
3. Use beat fixtures (rna-hcv, marx-beat) only to regress beat-path behaviour; use **fresh-validation** samples to regress live/non-beat behaviour.  
4. Do **not** claim production readiness from BL-008 alone.
