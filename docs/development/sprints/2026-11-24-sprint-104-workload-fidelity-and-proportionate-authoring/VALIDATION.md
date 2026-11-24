# Sprint 104 — Validation ledger

**Status:** **OPEN — S104-D02 AGREED / MILESTONE 1 VERIFIED (AWAITING REVIEW BEFORE MILESTONE 2)**  
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

## Milestone 1 verification (Authoritative duration transport)

### Syntax checks (all 5 modified runtime/prompt modules)

| Check | Outcome |
| ----- | ------- |
| `node --check app.js` | **Pass** (exit 0) |
| `node --check lib/learning-journey-sibling-prompts.js` | **Pass** (exit 0) |
| `node --check lib/learning-journey-design-page.js` | **Pass** (exit 0) |
| `node --check lib/first-class-workflow-family.js` | **Pass** (exit 0) |
| `node --check lib/first-class-commission-intake.js` | **Pass** (exit 0) |

### Focused automated test suites (`node --test`, observed 2026-11-24)

| Suite / Scope | Result | Notes |
| ------------- | ------ | ----- |
| `tests/s104-m1-duration-transport.test.js` | **11 / 11 pass** | Step 4 origin & reconciled example; prose/non-integer/missing rejection; Step 4 `journey_allocated_minutes` matching parent LJ duration & component sum reconciliation; newly authored non-bypass vs legacy compatibility; Step 4↔5 reconciliation & conflict fail-closed; lossless batch/single/prompt/persistence/delete-recreate transport across Expository, Practice, Assessment Pack, and Situated Task; 5-min Practice & 12-min LJ-Expository UI rendering; legacy absence without prose fallback; envelope/intake conflict fail-closed; standalone Expository & Interactive non-regression |
| Focused closure & legacy non-regression re-verification bundle (12 files: `s104-m1`, `s103-duration-fidelity-guidance`, `s100c`, `s94-wp2`, `s96-lj-shared-source-design-page-boundary`, `s91-wp3/wp4/preview`, `qa-lj-*`, `s80-s6`, `s85-wp4`) | **158 / 158 pass** | Confirms Step 4 parent-allocation reconciliation, non-bypass for `duration_contract_version: "s104_m1"`, legacy fixture compatibility, and standalone Expository/Interactive preservation |
| Core duration, capability, workload & commission-native bundle (12 existing files alongside `s104-m1`: `s80-s6`, `s85-wp4`, `s100a`, `s100b1`, `s100b2`, `s100c`, `s101`, `s102`, `s102e`, `s103-duration-fidelity-guidance`, `s103-artefact-consumer-four-product`, `qa-c06`) | **167 / 167 pass** | Confirms standalone Interactive 10–480 adjustments, standalone Expository `Scope/extent` vs hidden `Duration`, S100 estimator contracts, S101/S102/S102e commission-native LO binding across 4 products, and S103 duration-fidelity guidance |
| LJ lifecycle, 4-product, continuity & S102e/S103 bundle (21 files: `qa-lj-commission-native-and-lifecycle`, `qa-lj-batch-component-creation`, `s91-wp3/wp4/preview/direct/run-stage/ui-orchestration/status`, `s92-slice1/lj-handoff/stage5`, `s94-wp1/wp2/wp5`, `s102e-clear/journal/gam`, `s103-clear/radio/json-fencing`) | **167 / 167 pass** | Confirms batch creation, single creation, deletion/recreation, continuity gates, Situated Task Stage 5, Expository/Practice/AP runtime & clear-run isolation |
| **Milestone 1 manual acceptance** | **Pending integrated live validation** | Deferred to integrated live authoring / Milestone 6–7 validation per Milestone 1 closeout instruction |
| Excluded pre-existing [PB-S-008](../../../backlog/PRODUCT-BACKLOG.md#pb-s-008--full-suite-pre-existing-failures-technical-debt) tests observed separately | Pre-existing failures unchanged | `s91-learning-journey-design-page-acceptance.test.js:76` (test harness omits `lib/learning-journey-shared-source.js`); `s94-learning-journey-wp3-original-brief.test.js:223` (stale Expository GLC brief test); `s88`, `s91-wp1-wp2`, `s92-slice3`, `s94-wp4/wp5`, `s97-m3-t1` observed as pre-existing baseline failures in earlier broad sweeps |

---

## Gated milestone validation plan (Milestones 1–7)

| Milestone | Requirement | State |
| --------- | ----------- | ----- |
| **Milestone 1 — Authoritative duration transport** | Step 4 origin (`<<<COMMISSION_DURATIONS_BEGIN>>>` / `END`), parent-allocation & sum reconciliation, non-bypass for new authoring (`duration_contract_version: "s104_m1"`), Step 4↔5 reconciliation, zero prose fallback, lossless envelope/intake/family transport across all 4 commissioned products, persistence, delete/recreate, legacy compatibility, component duration lock UI | **Committed checkpoint (automated verified; manual acceptance pending integrated live validation)** |
| **Milestone 2 — Practice Episode Plan design authority** | AI-authored, deterministically validated Practice Episode Plans responsive to purpose, outcomes, authoritative duration, prior learning, and journey context; single cohesive multi-LO activity assessment; no fixed duration tiers or beat targets; standalone/legacy Interactive preserved | **Not started** (gated on Milestone 1 review) |
| **Milestone 3 — Reconciliation of downstream Practice contracts** | Conditional DLA / GAM / Guided Review / Partial Design Page obligations keyed to Episode Plan selections; optional Practice editorial furniture; preserved structural/accessibility/material/artefact invariants | **Not started** (gated on Milestone 2) |
| **Milestone 4 — Proportionate Learning Journey commissioning** | Cross-journey pedagogical distribution, genuine learner performance & feedback reasoning, familiar-evidence reuse, progressive artefact reuse without Journal-driven extra writing, explicit infeasibility surfacing | **Not started** (gated on Milestone 3) |
| **Milestone 5 — Workload estimation corrections** | Fix `|| product === "practice"` precedence & prose-first duration lookup in `learning-journey-workload-feasibility-adapter.js`; wire cumulative workload against `commissioned_duration_minutes`; account for evidence, decisions, constructed responses & feedback; advisory warnings only | **Not started** (gated on Milestone 4) |
| **Milestone 6 — Practice duration sensitivity probes** | Live authoring runs for equivalent purpose at **5 min**, **15 min**, and **30 min** showing genuine structural & workload scaling with preserved pedagogical completeness | **Not started** (gated on Milestone 5) |
| **Milestone 7 — 90-minute Economics journey regeneration & runtime acceptance** | Regenerate 90-min journey from original brief without touching pre-intervention baseline captures; compare against untouched baseline; Educational QA + learner-runtime acceptance | **Not started** (gated on Milestone 6) |
