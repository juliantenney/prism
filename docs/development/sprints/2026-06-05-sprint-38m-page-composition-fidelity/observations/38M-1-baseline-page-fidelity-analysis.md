# 38M-1 — Baseline page fidelity analysis

**Date:** 2026-06-05  
**Sprint:** 38-M Page Composition Fidelity  
**Phase:** 38M-1 (analysis only — no implementation)  
**Run:** `EV-38L-AFTER` · captured `2026-06-05T12:14:01Z` · model `gpt-4.1-mini`  
**Method:** Read-only quantitative comparison of frozen pipeline artefacts + `buildUtilityStructuredHtmlForTest` render of `EV-38L-AFTER-design-page.json` (no code/pack changes, no re-run).

**Inputs:**

- `../2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/EV-38L-AFTER-gam.json`
- `../2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/EV-38L-AFTER-design-page.json`
- [38L-instructional-function-loss-trace.md](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-instructional-function-loss-trace.md)
- [38L-page-preservation-and-json-validity-fix.md](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-page-preservation-and-json-validity-fix.md)

**Comparator benchmark:** [38I-4 A4 evaluate learner episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)

---

## §1 Executive summary

**Primary finding confirmed:** Instructional fidelity loss on `EV-38L-AFTER` is **not uniform**. The pipeline splits into two distinct failure modes at different stages:

| Activity | GAM → Page fidelity | Primary loss stage | Learner-facing symptom |
|----------|---------------------|--------------------|------------------------|
| **A3 Analyse** | **100%** character parity (4/4 materials exact or ≥99%) | **Render sequencing** (not compose) | Full bodies present; checklist renders before worked pass; episode does not read as stepped 38I-style sequence |
| **A4 Evaluate** | **45%** aggregate character parity (1/8 materials ≥90%; 5/8 severely compressed) | **L4 Design Page composition** | All material keys survive; capstone bodies replaced by catalogue synopses and table shells |

**Quantitative headline:**

```text
A1 Understand   aggregate GAM→Page ratio: 100%  (5,659 → 5,647 chars)
A2 Apply        aggregate GAM→Page ratio:  99%  (3,306 → 3,288 chars)
A3 Analyse      aggregate GAM→Page ratio: 100%  (4,854 → 4,854 chars)
A4 Evaluate     aggregate GAM→Page ratio:  45%  (6,850 → 3,063 chars)
```

**Loss stage verdict:**

- **A4:** Primary loss point is **L4 Design Page composition** (`step_design_page` LLM output). GAM carries full scenario, worked judgement, and guided table bodies; composed page JSON thins or synopsis-replaces them. Render faithfully exposes page JSON — no additional A4 body loss at render.
- **A3:** **No GAM→Page body loss.** Loss is **pedagogical presentation**: renderer inverts DLA `scaffold_hint_sequence` (checklist before worked pass) and fuses guided/independent analysis into a single `analysis_table` material row.

**Artefact state:** `EV-38L-AFTER-design-page.json` has **no** `metadata.gam_materials_preserve_applied` flag. This artefact predates (or bypassed) the post-run `page-gam-materials-preserve` merge documented in [38L-page-preservation-and-json-validity-fix.md](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-page-preservation-and-json-validity-fix.md). The frozen comparator therefore represents **raw LLM compose output** — the correct baseline for 38M fidelity work.

**38M-2 readiness:** Baseline quantifies which materials require preservation policy. Five A4 capstone materials (M12–M15, M18) plus M19 consolidation are high-risk; M16 has a pre-existing GAM depth gap (218-char header stub).

---

## §2 Fidelity matrix — GAM vs Page vs Render

**Legend:**

- **Ratio:** `pageLen / gamLen × 100%`
- **Substantive:** ratio ≥ 90% AND key instructional markers present in page body
- **Loss type:** `none` · `minor_whitespace` · `moderate_compression` · `severe_compression` · `synopsis_replacement` · `table_shell_collapse` · `meta_replacement`
- **Render:** whether page body content appears in `buildUtilityStructuredHtmlForTest` output (page JSON is render source of truth)

### A1 — Understand CPI/GDP

| Material ID | Type | Page key | GAM len | Page len | Ratio | Loss type | Substantive | Render |
|-------------|------|----------|---------|----------|-------|-----------|-------------|--------|
| M1 | text | `concept_exposition` | 1,903 | 1,903 | 100% | none | ✓ | ✓ |
| M2 | worked_example | `worked_example` | 1,748 | 1,736 | 99% | minor_whitespace | ✓ | ✓ |
| M3 | sample_output | `sample_output` | 973 | 973 | 100% | none | ✓ | ✓ |
| M4 | checklist | `checklist` | 1,035 | 1,035 | 100% | none | ✓ | ✓ |

### A2 — Apply CPI calculation

| Material ID | Type | Page key | GAM len | Page len | Ratio | Loss type | Substantive | Render |
|-------------|------|----------|---------|----------|-------|-----------|-------------|--------|
| M5 | worked_example | `worked_example` | 1,094 | 1,076 | 98% | minor_whitespace | ✓ | ✓ |
| M6 | classification_table | `classification_table` | 1,563 | 1,563 | 100% | none | ✓ | ✓ |
| M7 | checklist | `checklist` | 649 | 649 | 100% | none | ✓ | ✓ |

### A3 — Analyse household impact *(focus activity)*

| Material ID | Type | Page key | GAM len | Page len | Ratio | Loss type | Substantive | Render |
|-------------|------|----------|---------|----------|-------|-----------|-------------|--------|
| M8 | worked_example | `worked_analytic_pass` | 1,616 | 1,616 | 100% | none | ✓ | ✓ |
| M9 | scenario | `scenario_maya_households` | 733 | 733 | 100% | none | ✓ | ✓ |
| M10 | analysis_table | `analysis_table` | 1,901 | 1,901 | 100% | none | ✓ | ✓ (as Worksheet) |
| M11 | checklist | `checklist` | 604 | 604 | 100% | none | ✓ | ✓ |

**A3 aggregate:** 4,854 → 4,854 chars (**100%**). All four materials are exact GAM copies.

### A4 — Evaluate household strategy *(focus activity)*

| Material ID | Type | Page key | GAM len | Page len | Ratio | Loss type | Substantive | Render |
|-------------|------|----------|---------|----------|-------|-----------|-------------|--------|
| M12 | scenario | `scenario_maya_strategy_menu` | 817 | 222 | **27%** | synopsis_replacement | ✗ | ✓ (stub) |
| M13 | text | `criteria_exposition_evaluate` | 720 | 429 | 60% | moderate_compression | ✗ | ✓ |
| M14 | modelling_note | `worked_judgement_weak_strong` | 1,050 | 248 | **24%** | synopsis_replacement | ✗ | ✓ (stub) |
| M15 | decision_table | `guided_judgement_table` | 1,711 | 687 | **40%** | table_shell_collapse | ✗ | ✓ (shell) |
| M16 | template | `independent_judgement_template` | 218 | 255 | 117% | meta_replacement | ✗† | ✓ |
| M17 | checklist | `checklist_evaluate` | 621 | 591 | 95% | minor_whitespace | ✓ | ✓ |
| M18 | transfer_prompt | `transfer_prompt_evaluate` | 684 | 280 | **41%** | severe_compression | ✗ | ✓ |
| M19 | consolidation_summary | `consolidation_summary` | 1,029 | 351 | **34%** | severe_compression | ✗ | ✓ |

†M16: page body is **longer** than GAM but replaces memo header with meta bullet scaffold — not substantive parity.

**A4 aggregate:** 6,850 → 3,063 chars (**45%**). Only M17 checklist survives with substantive fidelity.

### Substantive marker survival (A4 capstone)

| Marker | GAM | Page | Render |
|--------|-----|------|--------|
| `Strategy A: Budget Tightening` | ✓ | ✗ | ✗ |
| `Weak Evaluation Example` | ✓ | ✗ | ✗ |
| `Strong Evaluation Example` | ✓ | ✗ | ✗ |
| Rich guided table exemplar rows (e.g. `Budget Tightening` judgements) | ✓ | ✗ | ✗ |
| `Partial example` (generic shell cells) | ✗ | ✓ | ✓ |
| `at least 80 words` (transfer task) | ✓ | ✓ | ✓ |

---

## §3 A3 findings — Analyse inflation household impact

**Activity ID:** `A3_Analyse_Inflation_Household_Impact`

### GAM → Page

**No fidelity loss.** All four GAM material bodies copy verbatim to page JSON:

- `worked_analytic_pass` — 1,616 chars, exact match
- `scenario_maya_households` — 733 chars, exact match
- `analysis_table` — 1,901 chars, exact match (pipe table with 2 exemplar rows + 2 learner entry rows)
- `checklist` — 604 chars, exact match

This confirms the 38L forensic trace: **page composition is not the A3 loss stage.**

### Page → Render

Render exposes full page bodies but **inverts pedagogical order** relative to DLA `scaffold_hint_sequence`:

**DLA / cognition intended order:**

```text
worked analytic pass → scenarios → analysis table → checklist
```

**Observed render order** (within A3 activity block):

```text
checklist → worksheet (analysis table) → worked analytic pass → scenario
```

**Mechanism:** `app.js` early checklist render path fires before worksheet table resolution and worked-analytic-pass fallback. Bodies are present; sequence is inverted.

### Structural note (not a compose-loss issue)

DLA fuses `guided_analysis` and `independent_analysis` into a single `analysis_table` material (M10). GAM and page preserve this shape. The learner sees one **Worksheet** block, not separate guided/independent steps as in the 38I-4 episode model.

### A3 per-function verdict

| Function | GAM→Page | Page→Render | Lost at |
|----------|----------|-------------|---------|
| worked_analytic_pass | ✓ full | ✓ (wrong order) | **Sequencing** |
| guided_analysis | ✓† fused in M10 | ✓† inside Worksheet | **Structural** (DLA shape) |
| analysis_table | ✓ full | ✓ | **Not lost** |
| verification_checklist | ✓ full | ✓ (renders first) | **Sequencing** |

†Same material row; not a distinct function slot in DLA/GAM schema.

### A3 preservation-risk inventory

| Risk | Severity | Stage | Notes |
|------|----------|-------|-------|
| Body truncation at compose | **None observed** | — | 100% parity on EV-38L-AFTER |
| Checklist-first render order | Medium | Render / sequencing | Inverts stepped episode feel |
| Fused analysis_table | Low (structural) | DLA design | Not an L4 compose issue |
| Episode framing absence | Low | Presentation | No Step 1/Step 2 headings |

**38M-2 candidate targets (A3):** Sequencing policy only — not body preservation. Deferred to 38M-4 per charter.

---

## §4 A4 findings — Evaluate household inflation strategy

**Activity ID:** `A4_Evaluate_Household_Inflation_Strategy`

### GAM → Page — primary loss stage

**Confirmed: L4 Design Page composition is the primary A4 loss stage.**

All eight function material keys survive on the composed page. Loss is **body fidelity**, not omission. The LLM compose step replaced GAM-rich instructional bodies with catalogue synopses, compressed rubrics, and generic table shells — despite `LD-MATERIALS-COPY` and `LD-DESIGN-PAGE-COMPOSE-CONTRACT` prompt obligations cited in page `constraints_applied`.

**Compression profile by function:**

| Function | Material | GAM→Page ratio | Mechanism |
|----------|----------|----------------|-----------|
| scenario (strategy menu) | M12 | 27% | Synopsis replacement — catalogue sentence, no Strategy A–E list |
| criteria_rubric | M13 | 60% | Moderate compression — shortened rubric exposition |
| worked_judgement | M14 | 24% | Synopsis replacement — one-paragraph descriptor, no weak/strong exemplars |
| guided_judgement | M15 | 40% | Table shell collapse — generic "Partial example" cells |
| independent_judgement_template | M16 | 117%* | Meta replacement — bullet list of what memo should contain |
| verification_checklist | M17 | 95% | Largely preserved |
| transfer_prompt | M18 | 41% | Severe compression — shortened task body |
| consolidation_summary | M19 | 34% | Severe compression — reflection stub |

\*Length ratio misleading: page body is meta-description, not writable memo scaffold.

### Pre-existing GAM depth gap (M16)

GAM M16 delivers only **218 chars** — memo header fields (`To:`, `From:`, `Date:`, `Subject:`) with no section bodies or word-band scaffold required by DLA spec. Page compose then **replaces** even this thin header with a 255-char meta bullet scaffold. Loss is therefore **GAM generation (thin)** + **page composition (meta replace)** — a two-stage gap for independent judgement.

### Page → Render

Render **faithfully exposes page JSON** for all A4 materials. No additional body loss at render.

**Observed A4 render order** (matches cognition `scaffold_hint_sequence`):

```text
scenario → criteria → worked judgement → guided table → independent template → checklist → transfer → consolidation
```

Sequencing is correct at render; bodies are thin because page JSON is thin.

### Comparison to 38I-4 A4 benchmark

[38I-4 A4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) delivers a stepped instructional episode: perspectives → criteria construction → worked economist judgement → guided table → independent memo → transfer. On `EV-38L-AFTER`, GAM carries a structurally similar function chain with full bodies, but composed page + render reduce the capstone to "worksheet + checklist" feel — keys present, instructional episode prose absent.

---

## §5 Compression examples

### Example 1 — M12 Scenario: synopsis replacement (73% loss)

**GAM (817 chars) — excerpt:**

```text
Maya's household faces rising inflation that affects her fixed pension income.
To manage this, five neutral strategies are proposed:

- **Strategy A: Budget Tightening**
  Reduce discretionary spending and prioritize essentials.

- **Strategy B: Income Diversification**
  Seek part-time work or passive income sources.
  [... Strategy C, D, E ...]
```

**Page (222 chars) — full body:**

```text
**Maya Household Scenario with Neutral Strategy Menu A–E**

Detailed Maya household budget and five neutral inflation management strategies (A–E)
are provided to evaluate different approaches to managing inflation effects.
```

**Symptom:** Catalogue pointer sentence. Strategy A–E list absent. Learner cannot evaluate without upstream scenario detail.

---

### Example 2 — M14 Worked judgement: synopsis replacement (76% loss)

**GAM (1,050 chars) — excerpt:**

```text
- **Weak Evaluation Example:**
  "Strategy A is best because it saves money."
  This is a slogan-based judgement with no explanation [...]

- **Strong Evaluation Example:**
  "Strategy A offers immediate cost savings by prioritizing essential expenses,
  which is crucial for Maya's fixed income. However, it may limit quality of life
  and lacks adaptability if inflation rises sharply. [...]"
```

**Page (248 chars) — full body:**

```text
**Worked Judgement: Contrasting Weak and Strong Evaluations**

This note shows stepwise reasoning contrasting weak slogan-based evaluations with
strong criteria-led evaluations, illustrating how to justify strategy choices with
explicit trade-offs.
```

**Symptom:** Describes what the note does; does not contain the weak/strong exemplars learners need to model judgement.

---

### Example 3 — M15 Guided judgement table: shell collapse (60% loss)

**GAM (1,711 chars) — excerpt:**

```text
| A: Budget Tightening | Moderate: Focuses on spending cuts but limited long-term planning |
| Low: Fixed cuts may not adapt well if inflation changes | Moderate: Applicable to many households |
| Example: Saves money but may reduce living standards |
[... rich exemplar rows for B, C, D, E ...]
```

**Page (687 chars) — excerpt:**

```text
| A        | Partial example    | Partial example | Partial example |                             |
| B        |                   |              |                 |                             |
[... empty shell rows ...]
```

**Symptom:** Table structure preserved; instructional exemplar judgements replaced by placeholder cells. Learner loses the modelling scaffold that guided analysis requires.

---

### Example 4 — M18 Transfer prompt: severe compression (59% loss)

**GAM (684 chars) — excerpt:**

```text
Write at least 80 words applying the evaluation criteria of depth, adaptability,
and transferability to a household inflation management strategy relevant to your
own situation or one you are familiar with. Consider:

- What strategy or approach is used to manage inflation effects?
- How thoroughly is the strategy planned and implemented?
[... four guiding questions ...]
```

**Page (280 chars) — full body:**

```text
**Transfer Task: Apply Evaluation Criteria to Your Own Context**

Write at least 80 words applying the evaluation criteria to your own household
inflation strategy or a familiar context. Discuss how your chosen strategy meets
depth, adaptability, and transferability requirements.
```

**Symptom:** Word-count obligation survives; guiding questions and contextual framing removed.

---

### Example 5 — M16 Independent template: meta replacement (GAM already thin)

**GAM (218 chars):**

```text
**Memo: Evaluation of Household Inflation Management Strategy**

**To:** [Recipient Name or Self]
**From:** [Your Name]
**Date:** [Date]
**Subject:** Evaluation and Recommendation of Inflation Management Strategy
```

**Page (255 chars):**

```text
**Independent Judgement Memo Template**

Use this scaffold to write a memo including:
- Strategy choice
- Justification using evaluation criteria
- Discussion of trade-offs
- Conclusion

Includes word band guidance to support structured reasoning.
```

**Symptom:** Page replaces thin but writable memo header with meta bullet list. Neither GAM nor page delivers a full independent judgement scaffold comparable to 38I-4 Step 5.

---

## §6 Preservation-risk inventory

Ranked by evidence from this baseline (candidate targets for 38M-2 — **no implementation proposed here**).

| Rank | Material | Function | GAM len | Page len | Ratio | Risk type | Priority |
|------|----------|----------|---------|----------|-------|-----------|----------|
| 1 | M14 | worked_judgement | 1,050 | 248 | 24% | Synopsis replacement | **Critical** |
| 2 | M15 | guided_judgement | 1,711 | 687 | 40% | Table shell collapse | **Critical** |
| 3 | M12 | scenario (strategy menu) | 817 | 222 | 27% | Synopsis replacement | **Critical** |
| 4 | M18 | transfer_prompt | 684 | 280 | 41% | Severe compression | **High** |
| 5 | M19 | consolidation_summary | 1,029 | 351 | 34% | Severe compression | **High** |
| 6 | M13 | criteria_rubric | 720 | 429 | 60% | Moderate compression | **Medium** |
| 7 | M16 | independent_judgement_template | 218 | 255 | 117%* | GAM thin + meta replace | **Medium** (upstream + compose) |
| 8 | M17 | verification_checklist | 621 | 591 | 95% | Minor whitespace | Low |

### Activity-level risk summary

| Activity | Materials at risk | Compose risk | Render risk |
|----------|-------------------|--------------|-------------|
| A1 | 0 / 4 | None | None |
| A2 | 0 / 3 | None | None |
| A3 | 0 / 4 (body) | None | Sequencing only |
| A4 | 6 / 8 | **Severe** | None (faithful to thin page) |

### Existing preserve layer coverage (38-L post-work)

`lib/page-gam-materials-preserve.js` + `validate38LPageGamPreservation` already target M12, M14, M17, M18, and A3 worked analytic pass. Replay on frozen artefacts:

| Check | Before merge | After merge (replay) |
|-------|--------------|----------------------|
| Validator | **FAIL** | **PASS** |
| M12 scenario length | 222 | 817 |
| M14 worked judgement length | 248 | 1,050 |

Source: [38L-page-preservation-and-json-validity-fix.md](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-page-preservation-and-json-validity-fix.md). 38M-2 should formalise and extend this layer; 38M-1 establishes that the frozen comparator **requires** it.

---

## §7 Recommended measurement gates for `EV-38M-AFTER`

Derived from charter success criteria, this baseline, and 38I-4 calibration. Gates apply to **post-merge composed page JSON** and **rendered output**.

### Hard gates (blocking)

| Gate ID | Check | Threshold | Materials |
|---------|-------|-----------|-----------|
| **G1** | A4 worked judgement char parity | Page len ≥ **90%** of GAM M14 | `worked_judgement_weak_strong` |
| **G2** | A4 guided judgement char parity | Page len ≥ **90%** of GAM M15 | `guided_judgement_table` |
| **G3** | A4 scenario substantive survival | Page body contains `Strategy A:` AND `Strategy E:` | `scenario_maya_strategy_menu` |
| **G4** | No synopsis replacement on capstone | Page body contains `Weak Evaluation Example` AND `Strong Evaluation Example` | `worked_judgement_weak_strong` |
| **G5** | Guided table exemplar survival | Page table contains `Budget Tightening` judgement text; must NOT be only `Partial example` cells | `guided_judgement_table` |
| **G6** | Transfer prompt body survival | Page len ≥ **80%** of GAM M18; must contain `at least 80 words` | `transfer_prompt_evaluate` |
| **G7** | A3 body parity (regression guard) | All A3 materials ≥ **99%** of GAM | M8–M11 |
| **G8** | Checklist survival A1–A4 | Checklist present and ≥ 80 chars per activity | M4, M7, M11, M17 |

### Soft gates (warning / calibration)

| Gate ID | Check | Threshold | Notes |
|---------|-------|-----------|-------|
| **G9** | A4 criteria exposition parity | Page len ≥ **85%** of GAM M13 | Moderate compression acceptable if markers present |
| **G10** | Consolidation summary parity | Page len ≥ **70%** of GAM M19 | Closure material; lower bar than capstone |
| **G11** | Independent template depth | Page len ≥ GAM M16 OR contains writable memo sections | May require upstream GAM fix if M16 stays at 218 chars |
| **G12** | Render reflects page JSON | Spot-check: GAM markers in render HTML match page JSON, not GAM-only | Confirms no render-stage loss |

### A3 sequencing gates (38M-4 scope — record at proof time)

| Gate ID | Check | Target order |
|---------|-------|--------------|
| **G13** | A3 render material order | worked analytic pass → scenario → analysis table → checklist |
| **G14** | Page JSON material key order | Align with DLA `scaffold_hint_sequence` where schema permits |

### Harness artefacts

| Artefact | Role |
|----------|------|
| `EV-38M-AFTER-gam.json` | Upstream GAM comparator |
| `EV-38M-AFTER-design-page.json` | Post-merge composed page (must show `gam_materials_preserve_applied: true`) |
| `EV-38M-AFTER-workbook.md` | GAM-faithful export (diagnostic only — not learner-facing QA source) |
| Render capture from `buildUtilityStructuredHtmlForTest` | Learner-facing fidelity check |

### Validator contract sketch (for 38M-2)

```text
validate38MPageFidelity(page, { gamSource }) → { ok, errors[], metrics[] }

metrics[] per material: { material_id, gamLen, pageLen, ratio, markers[], lossType }
errors[] on hard gate failure (G1–G8)
```

---

## §8 Primary loss stage confirmation

| Question | Answer | Evidence |
|----------|--------|----------|
| Is L4 Design Page composition the primary A4 loss stage? | **Yes** | A4 aggregate 45% parity; A1–A3 at 99–100%; all A4 keys present with thinned bodies |
| Is GAM generation the A4 loss stage? | **Partially** (M16 only) | M12–M15, M18 rich in GAM; M16 thin at 218 chars |
| Is render an additional A4 loss stage? | **No** | Render contains page stubs; GAM markers absent because page JSON lacks them |
| Is L4 compose the A3 loss stage? | **No** | 100% GAM→Page parity on all A3 materials |
| Is render the A3 loss stage? | **Sequencing only** | Full bodies present; checklist-first order inverts episode |

---

## §9 38M-2 candidate preservation targets (evidence only)

**No implementation or solution design here** — inventory for the preservation model phase.

### A4 body preservation (38M-3 scope)

1. **M12** — scenario strategy menu (synopsis → full A–E list)
2. **M14** — worked judgement weak/strong exemplars
3. **M15** — guided judgement table exemplar rows
4. **M18** — transfer prompt full task body with guiding questions
5. **M19** — consolidation summary reflection prose
6. **M13** — criteria exposition (moderate compression threshold)

### A4 upstream + compose (cross-phase)

7. **M16** — independent judgement template: GAM depth calibration may be required before page preservation alone suffices

### A3 sequencing (38M-4 scope)

8. **A3 render order** — restore worked pass → scenario → table → checklist without renderer CSS redesign
9. **A3 episode shape** — structural DLA fusion of guided/independent analysis (lower priority than A4 body loss)

### Anti-synopsis detection candidates

- Page body < 50% GAM length on capstone materials → merge trigger (existing 10% rule in `page-gam-materials-preserve.js`)
- Absence of function-specific markers (`Strategy A:`, `Weak Evaluation Example`, rich table exemplars)
- Presence of catalogue phrases (`are provided to evaluate`, `This note shows stepwise reasoning`)

---

## §10 Success condition check (38M-1)

| Criterion | Status |
|-----------|--------|
| Quantified GAM → Page fidelity per function (A3, A4) | ✓ |
| Material-by-material fidelity matrix | ✓ |
| Compression / synopsis / sequencing loss identified | ✓ |
| Primary loss stage confirmed (L4 compose for A4) | ✓ |
| Render learner output inspected | ✓ |
| Preservation-risk inventory for 38M-2 | ✓ |
| Recommended `EV-38M-AFTER` measurement gates | ✓ |
| No implementation / code / pack changes | ✓ |

**38M-1 complete.** Next phase: **38M-2** Page Composition Preservation Model.

---

## References

- [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)
- [38L-6 sprint closure](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-6-sprint-closure.md)
- [38L instructional function loss trace](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-instructional-function-loss-trace.md)
- [38L page preservation fix](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-page-preservation-and-json-validity-fix.md)
- [38I-4 A4 evaluate learner episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)
- `lib/page-gam-materials-preserve.js` · `tests/page-38l-gam-preservation.test.js`
