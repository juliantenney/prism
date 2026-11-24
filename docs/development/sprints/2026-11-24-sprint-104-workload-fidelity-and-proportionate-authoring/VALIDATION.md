# Sprint 104 — Validation ledger

**Status:** **OPEN — PHASE 104A BASELINE CAPTURED (NO IMPLEMENTATION RUN YET)**  
**Baseline commit:** `1515cd4`

---

## Evidence boundary rules

- Distinguish **baseline direct measurement**, **reported baseline observation**, **focused automated tests**, **live authoring duration probes**, and **educational QA / learner-runtime acceptance**.
- Retain the existing *Correlation and Causation: Making Sense of Economic Evidence* journey and captures untouched as the pre-intervention baseline.
- Do **not** pull [PB-S-008](../../../backlog/PRODUCT-BACKLOG.md#pb-s-008--full-suite-pre-existing-failures-technical-debt) pre-existing failures into Sprint 104.

---

## Phase 104A pre-intervention baseline evidence

| Artefact / Check | Measured Result | Evidence Class |
| ---------------- | --------------- | -------------- |
| `git rev-parse --short HEAD` | `1515cd4` (clean baseline before Sprint 104 docs) | Repository check |
| **C01** (*Interpreting relationships in economic data*, Practice) | 2 LOs → 2 `apply` 12-beat episodes; 2 activities (`A1`, `A2`); 22 materials; **5,264 total words** (264 `page_synthesis`, 4,305+ materials); **5 `data_table` datasets** (`D01`–`D05`); **5 `selection` controls**; **2 `template` responses** (`40–70w` + `70–100w`); **6 diagnostic criteria** (14 pairs); **0 `duration_minutes` fields** | Direct capture measurement (`c01-page.json`, `c01-zip/learner-page.html`) |
| `lib/interactive-workload-feasibility-adapter.js` on **C01** | `warnings: []` (`declaredDurationMinutes: null` on `A1` & `A2`, skipping comparison despite `22–46 min` + `19–42 min` = `41–88 min` raw estimate before datasets/selections/checklists) | Direct runtime module execution |
| **C02** (*What does a causal claim actually mean?*, Expository) | Expository structure (`activities: []`, `episode_plans: []`) — distinct S85 sibling pipeline | Direct capture inspection (`c02-page.json`) |
| **C06** (*Making an independent judgement about economic evidence*, AP) | 1 `constructed_performance` elicitation (`E1`), ~11 min, ~100–150 words, D09 scatterplot + table | Direct fixture inspection (`tests/fixtures/assessment-pack-c06-design-page-d09-scatterplot.json`) |
| **Economics journey & C04** (*Comparing competing economic explanations*, 8 min) | 90 min / 2 weeks; 6 components, 8 Practice activities (`C01`, `C03`, `C04`, `C05`), 10 constructed responses, 8 Journal entries; `C04` has 2 substantial activities, 2 datasets, 180–280w constructed response, structured decisions, 6 diagnostic criteria | User-reported baseline (raw `C03`/`C04`/`C05`/LJ captures external to repo; `Downloads` untouched) |

---

## Planned validation gates (post-agreement implementation)

| Gate | Requirement | State |
| ---- | ----------- | ----- |
| **104B/C automated suites** | Duration transport, duration-aware EP derivation, Practice DLA/GAM/LS/DP scaling, `guided-review-generation-contract.js` gating, workload adapter precedence fix + dataset/selection/checklist estimation + standalone Interactive non-regression | Pending `S104-D02` |
| **104D sensitivity probes** | Equivalent learning-purpose Practice runs at **5 min**, **15 min**, and **30 min** demonstrating scaled structure + pedagogical completeness | Pending `104C` |
| **104E Economics regeneration & runtime** | Regenerated 90-min journey from original brief compared against untouched baseline; Educational QA + learner-runtime acceptance | Pending `104D` |
