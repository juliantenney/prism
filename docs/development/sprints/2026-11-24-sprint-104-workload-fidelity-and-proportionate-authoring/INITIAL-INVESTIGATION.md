# Sprint 104 — Initial Investigation (Phase 104A): Workload Fidelity & Proportionate Authoring

**Status:** **Complete (read-only investigation — no code, prompts, contracts, or validators altered)**  
**Date:** 2026-11-24  
**Baseline commit:** `1515cd4`  
**Primary backlog item:** [PB-FA-025](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-025--duration-fidelity-learner-workload-budgeting)  
**Reference journey:** *Correlation and Causation: Making Sense of Economic Evidence* (90 minutes across 2 weeks: 6 commissioned components, 8 Practice activities, 10 substantive constructed responses, 8 Learning Journal contributions)

---

## 1. Evidence scope & explicit boundary

| Source | Status in `104A` | Evidence class |
| ------ | ---------------- | -------------- |
| Full PRISM commissioning, planning, authoring & validation source (`app.js`, `lib/*.js`, `domains/learning-design/domain-learning-design-step-patterns.md`) | **Directly inspected** | Code-verified |
| **C01** (*Interpreting relationships in economic data*, Practice) JSON & HTML (`C:\Users\cczjrt\AppData\Local\Temp\c01-page.json`, `c01-zip\learner-page.html`) + execution of `lib/interactive-workload-feasibility-adapter.js` on `C01` | **Directly inspected & measured** | Empirical capture + runtime check |
| **C02** (*What does a causal claim actually mean?*, Expository) capture metadata (`c02-page.json`) | **Directly inspected** | Capture boundary check |
| **C06** (*Making an independent judgement about economic evidence*, Assessment Pack) fixture (`tests/fixtures/assessment-pack-c06-design-page-d09-scatterplot.json`, `c06-zip\learner-page.html`) | **Directly inspected** | Fixture-measured |
| **C04** (*Comparing competing economic explanations*, 8 min Practice) observables; **C03**, **C05**, and whole-journey totals (6 components, 8 Practice activities, 10 constructed responses, 8 Journal entries) | **Reported in Sprint 104 brief** (raw captures external to repository; user `Downloads` directory untouched per boundary) | User-reported baseline + exact pipeline mechanism proof |

---

## 2. Executive summary of findings

**Why an 8-minute Practice commission (`C04`) expands into two substantial activities, two datasets, 180–280 words of constructed response, structured decisions, and six diagnostic review criteria:**

Disproportionate workload is **not** primarily an LLM verbosity problem. It is the deterministic consequence of five interlocking structural mechanisms in PRISM's commissioning and Practice pipeline:

1. **Authoritative duration is dropped at commission intake.** Learning Journey Design Page (`commissions[]`) stores `"Approximate learner time: 8 minutes"` only in unstructured `specification_text` prose (`S100-AD-006`). `commissionToIntakeEnvelope` → `intakeCommission` → `buildFirstClassWorkflowFamily` → `applyAcceptedCommissionIntake` drop duration completely, leaving `resolvedFactors.duration_minutes === undefined`. As a result, `resolveEffectiveWorkflowDurationMinutes(wf)` returns **`null`**, `"Duration"` disappears from `AUTHORITATIVE WORKFLOW PARAMETERS`, and `appendLearningSequenceDurationComplianceErrors` **never runs**.
2. **Every Learning Outcome deterministically multiplies into a full 12–15 beat Interactive Episode Plan.** `step_design_episode_plan` runs in `deterministic_derive` mode (`deriveDesignEpisodePlanCaptureJson` → `deriveEpisodePlansFromLearningOutcomes`) with **no duration or product parameter**. It converts **1 LO → 1 full Activity** (`A1`, `A2`, …) using fixed `ARCHETYPE_TEMPLATES` (`understand` 12 beats, `apply` 12 beats, `analyse` 13 beats, `evaluate` 15 beats) — even though `episode-plan-v1-archetype-grammar.js` permits shorter sequences (`min: 0` on optional beats) and Practice's own contract tells Episode Plan to omit Interactive ceremony.
3. **DLA is population-locked to those beats while Practice's contract stacks full reasoning loops without a time budget.** `episode-plan-population-contract.js` + `episode-plan-dla-integration.js` lock DLA so it cannot drop beats or merge activities, turning every `material`-class beat into a `required_materials[]` obligation. Meanwhile, `lib/ld-practice-presentation-contracts.js` (`101G-CONTROL-LED-JUSTIFICATION-V1`) has **zero duration-scaling rules** and steers every compound activity toward separate worked models (`S78-WS-2`), guided selection chains + datasets, independent decision chains + focal datasets, a constructed response `template`, `sample_output`, diagnostic `checklist`, and `consolidation_summary`.
4. **An un-gated GAM checklist contract forces at least 3 criteria per checklist.** `lib/guided-review-generation-contract.js:285–307` (unconditionally injected via `lib/ld-gam-page-enrich-contract.js:56–61`) mandates `"3–4 criteria"` and declares `"< 3 criteria ... is an instructional FAIL"`, directly overriding Practice's `"typically 2–3 criteria"` and `page-gam-enrich.js` (`GUIDED_CRITERIA_MIN = 2`). Across 2 activities, `2 × 3 = 6` diagnostic review criteria (`12–18` expected/repair pairs) is guaranteed — matching both `C04` and `C01`.
5. **Existing workload estimators/validators are silenced, post-hoc, non-blocking, and blind to non-prose Practice demands.** When `C01` is passed to `lib/interactive-workload-feasibility-adapter.js`, it returns **`warnings: []`** because `declaredDurationMinutes` is `null` on both activities and `learning_sequence`. Meanwhile, `lib/learning-journey-workload-feasibility-adapter.js:182–186` contains an operator-precedence bug (`|| product === "practice"`) that tags **every** Practice commission as `"mathematical_problem"`, and `workload-feasibility-estimator.js` omits dataset inspection, selection decision chains, worked examples/sample outputs, and checklist review effort.

---

## 3. Stage-by-stage trace of `C04` (*Comparing competing economic explanations*, 8 min)

### 3.1 Journey planning and duration allocation (`lib/learning-journey-sibling-prompts.js`)

- **What happens:**
  - `learning_progression` and `learning_elements` (`lib/learning-journey-sibling-prompts.js:330–500`) and `learning_commissions` (`lines 1160–1220`) plan 6 components within 90 minutes (`C01`–`C06`, averaging 15 min; `C04` allocated 8 min).
  - Sprint 103 added solid qualitative *DURATION FIDELITY* prose (`lines 615–627`) reminding the planner to consider reading, reasoning, writing, feedback, and revision, distinguish familiar vs unfamiliar evidence, and avoid mechanical division.
- **Where workload becomes disproportionate:**
  - **No structural component viability / budget rule:** Nothing prevents commissioning four full Practice components inside 90 minutes, nor prevents giving an **8-minute** Practice component (`C04`) **2 component learning outcomes** (at `analyse`/`evaluate` cognitive demand) and **substantive constructed-text + Journal elicitations**.
  - **Learning Journal producer pressure:** `learning_elements` (`line 480`), `learning_commissions` (`lines 1168–1177`), and `learning-journey-design-page.js` (`lines 463–466`) default to `journal.enabled: true` for multi-artefact arcs and promote `{commission_id}.{elicitation_id}` constructed-text producers across components. Across 6 components this directly encourages the baseline's **10 constructed responses and 8 Journal entries**.

### 3.2 Commission scope (`lib/learning-journey-design-page.js`)

- **What happens:**
  - `commissions[]` schema (`lines 407–419`) and `validateLearningJourneyDesignPage` (`lines 686–727`) support only `commission_id`, `section_id`, `order`, `title`, `product_id`, `status`, `specification_text`, `journey_context_text`, and `dependencies`.
- **Where workload breaks (`S100-AD-006`):**
  - There is **no numeric `duration_minutes` or `allocated_minutes` field** on a commission. `"Approximate learner time: 8 minutes"` exists only inside `specification_text` prose.

### 3.3 Commission-native intake & workflow seeding (`lib/learning-journey-design-page.js`, `lib/first-class-commission-intake.js`, `lib/first-class-workflow-family.js`, `app.js`)

- **Exact code drop path:**
  1. `commissionToIntakeEnvelope` (`lib/learning-journey-design-page.js:860–902`) omits any duration field.
  2. `normalizeCommissionEnvelope` & `intakeCommission` (`lib/first-class-commission-intake.js:149–184`, `231–447`) pass `{ ldCreateOutputType, product, focus, startingArtefact, audience, scopeScale }` — **no duration field**.
  3. `buildFirstClassWorkflowFamily` (`lib/first-class-workflow-family.js:1026–1060` for `product === "practice"`) populates `deliverySeed` with `topic`, `page_kind = "practice"`, `learner_level`, `audience`, and `scope_scale` — **`duration_minutes` omitted**.
  4. `applyAcceptedCommissionIntake` (`app.js:27139–27208`) copies `deliverySeed` into `workflowBriefResolved.resolvedFactors`, leaving **`resolvedFactors.duration_minutes === undefined`**.
  5. `resolveCommissionedWorkflowDurationMinutes(wf)` (`app.js:42000–42012`) **explicitly forbids** parsing `specification_text` prose (`// Do not parse commission specification prose for runtime duration checks`) and returns **`null`**. Therefore `resolveEffectiveWorkflowDurationMinutes(wf)` (`app.js:42735–42742`) returns **`null`**.
- **Downstream consequences:**
  - `buildEffectiveWorkflowContextBlock` (`app.js:40224`) omits `Duration` from `"Authoritative workflow parameters for this run"`.
  - `buildLearningSequencePartialValidationOptions` (`app.js:11238–11245`) leaves `effectiveDurationMinutes` unset whenever `minutes == null`, silently disabling `appendLearningSequenceDurationComplianceErrors` (`app.js:11275–11313`).

### 3.4 Commission-native outcome authority (`lib/commission-native-lo-bind.js`, `app.js:6240–6370`)

- `applyCommissionNativeTopology` binds `<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>` directly into the Practice workflow and strips `Generate Learning Content`, `Model Knowledge`, and `Define Learning Outcomes`.
- `composeCommissionNativePlanningBlocks` (`app.js:6313–6370`) locks downstream planning to treat the component's `learning_outcomes[]` as authoritative and unmodifiable.
- Because LJ commissioning frequently emits **2 outcomes per Practice component** (verified directly in `C01`, and evidenced across the 4 Practice components producing 8 Practice activities), Practice receives 2 LOs for an 8-minute budget.
- *(Note: Even on non-commission-native Practice, `Define Learning Outcomes` in `domain-learning-design-step-patterns.md:2076,2127` sets `"default": 6` (`min: 3`) and instructs `"short session (<= 30 minutes) ... generate 2-4 outcomes maximum"`, still guaranteeing ≥2 outcomes for an 8- or 5-minute resource.)*

### 3.5 Design Episode Plan (`lib/episode-plan-v1-templates.js`, `lib/episode-plan-v1-archetype-grammar.js`, `app.js:15946–15975`, `16160–16280`)

- **Primary structural amplification point:**
  - `step_design_episode_plan` runs in `deterministic_derive` mode (`domain-learning-design-step-patterns.md:2648`). `resolveStepPromptText` (`app.js:37798`) ignores prompt bodies and `applyEpisodePlanCaptureCanonicalEnforcement` (`app.js:15946–15975`) overwrites any capture with `deriveDesignEpisodePlanCaptureJson(wf)` (`app.js:16160`).
  - `deriveEpisodePlansFromLearningOutcomes(learningOutcomes)` (`lib/episode-plan-v1-templates.js:146–177`) takes **no duration or product options**. It maps:
    - **Every 1 Learning Outcome → 1 full Activity (`A1`, `A2`, …)**.
    - **Every Activity → a full 12–15 beat Interactive template (`ARCHETYPE_TEMPLATES`, lines 11–84):**
      - `understand`: **12 beats** (`orientation, framing, activation, explanation, example, non_example, misconception_confrontation, guided_practice, independent_performance, verification, reflection, transition`)
      - `apply`: **12 beats** (`orientation, framing, activation, criteria_exposition, worked_thinking, guided_practice, independent_performance, verification, revision, reflection, transfer, transition`)
      - `analyse`: **13 beats** (`orientation, framing, activation, criteria_exposition, explanation, worked_thinking, guided_inquiry, guided_practice, independent_performance, verification, reflection, transfer, transition`)
      - `evaluate`: **15 beats** (`orientation, framing, activation, perspective_construction, criteria_exposition, criteria_construction, worked_judgement, guided_inquiry, guided_reasoning, independent_performance, evaluative_judgement, verification, reflection, transfer, transition`)
  - **Contradiction inside existing architecture:**
    - `lib/episode-plan-v1-archetype-grammar.js` already marks `orientation`, `framing`, `activation` (`min: 0, max: 1`), and optional secondary moves as **`card(0, 1)`** (`requiredBeats: []` for `apply`, `analyse`, and `evaluate`; only `requiredGroups` must have ≥1 beat per group). Lean **3–6 beat** Practice episodes are already **100% valid under the frozen V1 grammar**!
    - Practice's own contract (`lib/ld-practice-presentation-contracts.js:200–206`) explicitly asks Episode Plan to *"favour concise, action-oriented episodes... Omit mandatory interactive warm-up/orient-to-teach sequences"*. Because `step_design_episode_plan` is deterministic and ignores product/duration, that Practice instruction is **never executed**.
  - For `C04` (*Comparing competing economic explanations*), two `analyse`/`evaluate` LOs deterministically become **2 activities totalling 26–30 beats** inside an 8-minute budget.

### 3.6 Design Learning Activities (`lib/episode-plan-population-contract.js`, `lib/episode-plan-dla-integration.js`, `lib/ld-dla-page-enrich-contract.js`, `lib/ld-practice-presentation-contracts.js`, `lib/ld-self-directed-rhetoric.js`)

- **Population lock (`buildDlaPopulationOnlyPromptBlock`, `lib/episode-plan-dla-integration.js:346–366`):**
  - DLA is `"population-only"` and prohibited from removing beats or merging activities. Every `material`-class beat from EP generates a mandatory `required_materials[]` obligation (`buildObligationScaffoldFromPlan`, `lib/episode-plan-population-contract.js:244–320`).
- **Practice contract stacking (`lib/ld-practice-presentation-contracts.js`, `101G-CONTROL-LED-JUSTIFICATION-V1`):**
  - While `lib/ld-dla-page-enrich-contract.js:304–395` (`practiceProduct === true`) usefully relaxes mandatory `S78-WS-3` checklists, mandatory `S78-T-041` `transfer_prompt`, mandatory `intellectual_coherence_bridge`, and multi-field revision triads, **zero duration-scaling or time-budget instructions exist anywhere in `ld-practice-presentation-contracts.js`**.
  - `controlLedJustificationLines` + `dlaLines` steer every compound reasoning activity to include:
    1. A non-focal `worked_example` on a separate dataset (`S78-WS-2` `gam-practice-independence-prompt.js`)
    2. A guided `selection` decision chain + dataset
    3. An independent `selection` decision chain + separate focal dataset
    4. A constructed-response justification `template` (`response_fulfilment` when Journal-bound)
    5. A `sample_output` model
    6. A diagnostic `checklist`
    7. A `consolidation_summary`
  - Across **2 activities** (`A1`, `A2`), even "concise" per-activity targets (`90–140` words each in `C04`, `40–70w + 70–100w` in `C01`) sum to **180–280 words of constructed response**, **≥2 datasets**, multiple selection controls, worked models, sample outputs, and two diagnostic checklists.
  - Meanwhile, base `domain-learning-design-step-patterns.md:2226` and `lib/ld-self-directed-rhetoric.js:41–53` still inject Interactive/60-minute-workbook defaults (`expected_output` 30–70w, `support_note` 20–70w, `depth_floor: L3`, `IFP-05`, `G1–G5`) and `lib/episode-plan-population-contract.js:115` sets `verification` `pedagogical_spec` to `"Diagnostic guided review: 3–4 quality dimensions (max 5)"`.

### 3.7 Generate Activity Materials (`lib/gam-canonical-assembler.js`, `lib/ld-gam-page-enrich-contract.js`, `lib/guided-review-generation-contract.js`, `lib/page-gam-enrich.js`)

- **Hard-coded 3-criterion minimum explains `6 diagnostic review criteria` directly:**
  - `lib/ld-practice-presentation-contracts.js:116` allows `"typically 2–3 criteria"` and `lib/page-gam-enrich.js:22` validates `GUIDED_CRITERIA_MIN = 2`.
  - **However**, `lib/ld-gam-page-enrich-contract.js:56–61` unconditionally injects `lib/guided-review-generation-contract.js:285–307`, which commands GAM:
    - `"- Emit 3–4 criteria (hard maximum 5)."`
    - `"- A guided checklist with fewer than three complete criteria, missing feature/repair pairs, or pointer-only body is an instructional FAIL — do not emit."`
    - `"- Normally emit 2–3 {expected, repair} pairs per criterion (maximum 4)."`
  - Result: Any 2-activity Practice page with checklists (`C04` and `C01`) is **explicitly forced to emit ≥3 criteria × 2 activities = 6 diagnostic review criteria (and 12–18 expected/repair items)**!
- **Un-gated workbook closure & depth prompts:**
  - Even though `app.js:21244` skips appending the standalone `LD-GAM-INSTRUCTIONAL-DEPTH` block for Practice GAM, `lib/ld-gam-page-enrich-contract.js:104–106` still injects an inline `LD-GAM-INSTRUCTIONAL-DEPTH-CONTRACT` summary, and `lib/gam-canonical-assembler.js:251` unconditionally injects `S78-D04 page learner-resource closure` (`### Page learner-resource closure`, 2–4 consolidation bullets) for Design Page transport into `study_tips` — contradicting Practice's `designPageLines` (`"Study tips / closing essays: omit by default"`).
  - No token/word budget constrains GAM prose length against commissioned duration (in `C01`, GAM produced 4,305+ words inside `activities[].materials[]`).

### 3.8 Construct Learning Sequence & Design Page (`app.js:14841–14984`, `domain-learning-design-step-patterns.md:2444`, `lib/ld-design-page-partial-contract.js`)

- **`Construct Learning Sequence`:**
  - In `PageEnrichmentV2` partial mode, `buildLearningSequenceV2CopyAuthoringBrief` (`app.js:14841`) replaces the base template's strong timing/omission rules (`domain-learning-design-step-patterns.md:2444`: *"Only include an activity if there is enough time to run it properly... Prefer fewer well-run activities"*), does **not** mandate per-activity `duration_minutes`, and explicitly forbids omitting, merging, or compressing upstream activities (`validateLearningSequenceOrPageCapture`: *"Do not merge, omit, compact, or reorder activities"*).
  - With `effectiveDurationMinutes === null`, `appendLearningSequenceDurationComplianceErrors` (`app.js:11275–11313`) never runs. In `C01`, `learning_sequence` omitted `total_duration_minutes` and all activity `duration_minutes` completely.
- **`Design Page`:**
  - `lib/ld-design-page-partial-contract.js` requires `page_synthesis.knowledge_summary` (substantial advance organiser), `overview`, `learning_purpose`, `study_tips` (transporting `S78-D04` from GAM), mandatory `editorial_opening_image` (`decision: "generate"`, `"Do not use decision 'skip'"`), and `activities_visual_review[]` + `visual_affordances[]` (page Knowledge Summary figure + activity figures). On a 5- or 8-minute Practice micro-resource, this wrapper adds substantial reading/visual overhead regardless of budget.

### 3.9 Existing workload estimation & validation (`lib/workload-feasibility-estimator.js`, `lib/learning-journey-workload-feasibility-adapter.js`, `lib/interactive-workload-feasibility-adapter.js`, `lib/assessment-pack-workload-feasibility-adapter.js`)

1. **Advisory-only & post-hoc:** All adapters execute only at capture validation of LJ Design Page, Interactive/Practice Learning Sequence, or Assessment Pack — **never** feeding back into LJ progression/commissions, EP, DLA, or GAM.
2. **Silenced on Practice (`C01` empirical test):** Running `lib/interactive-workload-feasibility-adapter.js` directly on `C01` (`c01-page.json`) yields **`warnings: []`**: although the estimator calculates `22–46 min` (`A1`) + `19–42 min` (`A2`) = **`41–88 min`** (for a single component of a 90-minute journey!), both activities have `declaredDurationMinutes: null` and emit `"No declared duration supplied; feasibility comparison skipped."`
3. **Confirmed operator-precedence bug in `lib/learning-journey-workload-feasibility-adapter.js:182–186`:**
   ```js
   if (
     /\b(calculat|standard deviation|mathematical|equation)\b/i.test(text) &&
     product === "interactive" ||
     product === "practice"
   ) {
     return "mathematical_problem";
   }
   ```
   Because `&&` binds tighter than `||`, **every `product === "practice"` commission unconditionally maps to `"mathematical_problem"`**, applying an artificial `10–18 min` production floor regardless of domain or task type.
4. **Missing demand signals & keyword misfires:**
   - `workload-feasibility-estimator.js` & `interactive-workload-feasibility-adapter.js` have **no signals** for: `data_table` / dataset inspection volume, `selection` decision chains / sub-questions, `worked_example` and `sample_output` study load, or `checklist` diagnostic criteria/pairs (`6 criteria, 14 pairs` in `C01`).
   - Keyword inference misclassifies analytical Practice (`C01 A2` tagged `"institutional_recommendation"` with `dossier` implication because `"recommend"` appeared in text, and `"familiarMaterial": true` because `"revisit"` appeared for `D01` even though `D04` and `D05` were unseen datasets).
   - No cumulative component check sums all activities + synthesis reading against `resolvedFactors.duration_minutes`.

---

## 4. Systemic comparison across `C01`, `C03`, `C04`, `C05` (and `C02`/`C06` context)

| Component / Artefact | Product | Observed Structure & Load | Evidence Class & Mechanism Link |
| -------------------- | ------- | ------------------------- | ------------------------------- |
| **C01** — *Interpreting relationships in economic data* | Practice | **2 activities (`A1`, `A2`)**, both `apply` × 12 beats; **22 materials**; **5,264 total authored words** (264 in `page_synthesis`, 4,305+ in materials); **5 `data_table` datasets (`D01`–`D05`)**; **5 `selection` controls** (5–6 options each); **2 `template` constructed responses** (`40–70w` + `70–100w` = `110–170w`, `E1`/`E2`); **2 `worked_example`s**; **2 `sample_output`s** (214w + 429w); **6 diagnostic review criteria** (14 expected/repair pairs); **2 `consolidation_summary` closures**; **`duration_minutes` omitted** (`warnings: []` despite `41–88 min` raw estimate before datasets/selections/checklists). | **Directly measured** (`c01-page.json`, `c01-zip/learner-page.html`) |
| **C02** — *What does a causal claim actually mean?* | Expository | Expository sibling pipeline (no `activities[]` / `episode_plans[]`). | **Directly inspected** (`c02-page.json` confirms Expository pipeline) |
| **C04** — *Comparing competing economic explanations* | Practice (**8 min**) | **2 substantial activities**, **2 datasets**, **180–280 words constructed response**, **structured decisions**, **6 diagnostic review criteria**. | **Reported baseline**; exact `2 activities` + `6 criteria` + dataset/selection/template fingerprint proves identical `2 LO → 2 × 13/15-beat EP → 101G DLA → 3-criterion GAM floor` pipeline |
| **C03** & **C05** | Practice | Journey baseline totals **8 Practice activities** across 4 Practice components (`C01`, `C03`, `C04`, `C05` = `4 × 2 = 8`), contributing to **10 constructed responses** and **8 Learning Journal entries** across 6 components. | **Reported baseline + structural signature** (`4 × 2` Practice activity proliferation across the whole journey) |
| **C06** — *Making an independent judgement about economic evidence* | Assessment Pack (~11 min) | **1 `constructed_performance` elicitation (`E1`)**, `100–150 words`, scatterplot + data table (`D09`). | **Directly inspected fixture** (`assessment-pack-c06-design-page-d09-scatterplot.json`) — demonstrates that **non-EP** products (Assessment Pack) stay single-elicitation and compact, whereas Practice inherits EP's 1-LO→12–15-beat Interactive amplifier! |

**Conclusion on systemic proliferation:** Activity proliferation and workload expansion are **100% systemic across Practice components** (`C01`, `C03`, `C04`, `C05`), because the underlying deterministic EP/DLA/GAM pipeline treats every Practice component identically to an untimed multi-activity Interactive workbook regardless of commissioned duration.

---

## 5. Inventory of prompt instructions, contracts & validators

### 5.1 Supporting mechanisms (preserve & extend)

| Item | Location | Role |
| ---- | -------- | ---- |
| Planning `DURATION FIDELITY` & familiar/revisit guidance | `lib/learning-journey-sibling-prompts.js:615–627`, `1185–1193` | Accounts for reading/reasoning/writing/feedback/revision; avoids word-count formulas and double-counting |
| Optionality inside V1 Archetype Grammar | `lib/episode-plan-v1-archetype-grammar.js:203–580` | Marks `orientation`, `framing`, `activation`, `transfer`, etc. `card(0,1)`, making lean 4–6 beat episodes grammar-legal |
| Practice DLA relaxation guards | `lib/ld-dla-page-enrich-contract.js:304–395` | Exempts Practice from mandatory `S78-WS-3` checklists, mandatory `S78-T-041` `transfer_prompt`, mandatory bridges, and revision triads |
| Practice Episode Plan intent | `lib/ld-practice-presentation-contracts.js:200–206` | Asks to omit Interactive warm-up ceremony (needs wiring into deterministic EP) |
| Practice `page-gam-enrich.js` checklist min = 2 | `lib/page-gam-enrich.js:22` | Already accepts `2` criteria (validator ready for tighter criteria counts) |
| Learning Sequence duration compliance helper | `app.js:11238–11313` | Already built to validate activity/sequence minutes once `effectiveDurationMinutes` is populated |
| Sprint 100 + 103 Workload Estimator + Familiar band | `lib/workload-feasibility-estimator.js` | Coarse, explainable, non-word-count-only bands distinguishing `familiar` vs `moderate`/`dossier` |

### 5.2 Undermining mechanisms (fix / gate / align)

| Item | Location | How it undermines proportionate authoring |
| ---- | -------- | ----------------------------------------- |
| Prose-only LJ duration + intake drop | `lib/learning-journey-design-page.js:407–419, 860–902`, `lib/first-class-commission-intake.js`, `lib/first-class-workflow-family.js:1026–1060`, `app.js:42000–42012` | Drops `duration_minutes` before Practice/Expository/AP/ST ever starts; disables `DURATION` context & `appendLearningSequenceDurationComplianceErrors` |
| Unbounded LJ LO/Journal commissioning | `lib/learning-journey-sibling-prompts.js:440–480, 1168–1193` | Allows 2–3 LOs and Journal constructed-text expectations on 8-min components; no component viability floor |
| Deterministic 1-LO → 1 × 12–15-beat EP | `lib/episode-plan-v1-templates.js:11–84, 146–177`, `app.js:15946–15975, 16160` | Forces 12–15 beats per LO and 1 activity per LO regardless of duration or Practice product |
| Unconditional `verification` 3–4 criteria spec + DLA lock | `lib/episode-plan-population-contract.js:115`, `lib/episode-plan-dla-integration.js:346–366`, `domain-learning-design-step-patterns.md:2226` | Prevents DLA from trimming beats or merging LOs; locks every material beat into `required_materials[]` |
| Duration-blind Practice `101G` stacking | `lib/ld-practice-presentation-contracts.js` | No time tiers; encourages worked + guided + independent + datasets + template + sample + checklist on every activity |
| Hard 3-criterion GAM floor (`<3 = FAIL`) | `lib/guided-review-generation-contract.js:285–307`, `lib/ld-gam-page-enrich-contract.js:56–61` | Overrides Practice & `page-gam-enrich.js`; forces 6 criteria across 2 activities |
| Un-gated `S78-D04` closure & Design Page mandatory opening/summary/image | `lib/gam-canonical-assembler.js:251`, `lib/ld-gam-page-enrich-contract.js:104–106`, `lib/ld-design-page-partial-contract.js:81–145` | Forces `Page learner-resource closure` (`study_tips`), `knowledge_summary`, and `editorial_opening_image: generate` onto short Practice pages |
| LS partial brief removes duration rules & locks activities | `app.js:14841–14984` | Omits `duration_minutes` requirement and bars merging/dropping overloaded upstream activities |
| `practice` math precedence bug + silent/blind estimator | `lib/learning-journey-workload-feasibility-adapter.js:182–186`, `lib/interactive-workload-feasibility-adapter.js`, `lib/workload-feasibility-estimator.js` | False `mathematical_problem` on all Practice commissions; `warnings: []` when `duration_minutes` absent; blind to tables/selections/checklists |

---

## 6. Proposed interventions (for review and agreement prior to implementation)

### Intervention 1 — Structured Authoritative Duration Transport (`LJ → Intake → Workflow → LS/Validator`)
- Add optional numeric `allocated_minutes` (or `duration_minutes`) to `commissions[]` in `lib/learning-journey-design-page.js` (and `learning_time_minutes` at journey level), keeping conservative prose extraction only during intake normalisation if an older commission omits the numeric property.
- Thread `durationMinutes` through `commissionToIntakeEnvelope` → `normalizeCommissionEnvelope` / `intakeCommission` → `buildFirstClassWorkflowFamily` (`deliverySeed.duration_minutes`) → `applyAcceptedCommissionIntake` (`resolvedFactors.duration_minutes`) across Practice, Expository, Assessment Pack, and Situated Task.
- Outcome: `AUTHORITATIVE WORKFLOW PARAMETERS` shows `Duration: 8 minutes`, `resolveEffectiveWorkflowDurationMinutes` returns `8`, and `appendLearningSequenceDurationComplianceErrors` becomes active.

### Intervention 2 — Duration-Proportioned Journey & Component Commissioning (`lib/learning-journey-sibling-prompts.js`)
- Add explicit component-viability and workload-budget rules in `learning_progression`, `learning_elements`, and `learning_commissions`:
  - Short components (`≤ 10–12 min`) normally commission **1 focused `COMPONENT_LEARNING_OUTCOMES` entry** and **1 cohesive activity/task** (or are consolidated into a better-sized Practice component if the pedagogy requires multi-stage progression).
  - Restrict Learning Journal (`journal.enabled` / `{commission_id}.{elicitation_id}`) declarations to genuinely high-value reflective/evaluative performances rather than every component by default.
  - Explicitly identify **familiar/revisit** vs **new** evidence and **core study** vs **optional support**.

### Intervention 3 — Duration- & Product-Aware Episode Plan (`lib/episode-plan-v1-templates.js`, `app.js`)
- Extend `deriveEpisodePlansFromLearningOutcomes(learningOutcomes, options)` to accept `{ durationMinutes, product }` (standalone Interactive behaviour remains 100% unchanged when `!options` or standard Interactive):
  - **Compact / Micro Practice (`≤ 10 min`, e.g. 5 or 8 min):** Cap at **1 Activity** (binding 1–2 tightly related component LOs into one episode rather than duplicating 2 full loops) and select a **grammar-legal lean beat profile (`4–6 beats`)** under `lib/episode-plan-v1-archetype-grammar.js` (e.g., `framing` + `explanation`/`worked_thinking` + `guided_practice` or `independent_performance` + `verification` + `reflection`, omitting redundant `orientation`/`activation`/`criteria_exposition`/`guided_inquiry`/`transfer` bloat).
  - **Focused Practice (`11–20 min`, e.g. 15 min):** **1–2 Activities max**, concise 6–8 beat profiles omitting Interactive ceremony and redundant double-worked/double-transfer cycles.
  - **Extended Practice (`21–40+ min`, e.g. 30 min):** **2–3 progressive Activities** with full worked → guided → independent → revision/transfer progression scaled to budget.
- Call from `deriveDesignEpisodePlanCaptureJson(wf)` passing `resolveEffectiveWorkflowDurationMinutes(wf)` and commissioned product route.

### Intervention 4 — Proportionate Practice DLA, GAM, LS & Design Page Contracts
- **Gate checklist minima (`lib/guided-review-generation-contract.js`, `lib/ld-gam-page-enrich-contract.js`, `lib/episode-plan-population-contract.js`):** Gate the `"3–4 criteria / <3 criteria = instructional FAIL"` rule off for Practice (and compact durations), permitting **1–2 targeted criteria (`1–2` `{expected, repair}` pairs)** on `≤ 15 min` Practice or lightweight check/verification without 6-criterion rubrics.
- **Duration tiers in `lib/ld-practice-presentation-contracts.js`:**
  - **≤ 5–10 min Practice:** ≤1 compact/familiar dataset, 1 cohesive decision/reasoning chain (not worked + guided + independent separate datasets), concise justification (`~40–80w` or decision-plus-brief-rationale on 5 min), compact `worked_example`/`sample_output` if used, and clear separation of optional hints vs expected study.
  - **15 min Practice:** 1–2 datasets/cases, focused decision + justification (`~80–130w`) + 2 diagnostic criteria.
  - **30 min Practice:** Full staged progression across 2 activities (`2–4` datasets, `~150–250w` constructed reasoning, diagnostic checklists).
- **GAM & Design Page weight control (`lib/gam-canonical-assembler.js`, `lib/ld-design-page-partial-contract.js`):** Suppress mandatory `S78-D04` `Page learner-resource closure` on compact Practice (matching Practice's `"Study tips: omit by default"`), keep opening `page_synthesis` (`overview`, `learning_purpose`, `knowledge_summary`) concise and scaled to short Practice, and permit `editorial_opening_image: "skip"` (or optional) when short micro-Practice resources benefit from direct entry rather than page-wrapper inflation (subject to agreement).
- **Learning Sequence time allocation:** Require `duration_minutes` per activity + `total_duration_minutes` matching authoritative duration on Practice `learning_sequence` captures.

### Intervention 5 — Accurate, Un-Silenced Workload Estimators & Validators
- Fix operator precedence bug in `lib/learning-journey-workload-feasibility-adapter.js:182–186` (`(...) && (product === "interactive" || product === "practice")`).
- Update `lib/interactive-workload-feasibility-adapter.js` + `app.js` to accept `effectiveDurationMinutes` (`resolvedFactors.duration_minutes`) so cumulative page workload is always checked against the commissioned budget even if `activity.duration_minutes` is missing (eliminating silent `warnings: []`).
- Extend `lib/workload-feasibility-estimator.js` & adapters with coarse, explainable bands for `data_table` inspection, `selection` decision chains, `checklist` criteria/pairs, and `worked_example`/`sample_output` study load; fix false `"institutional_recommendation"` keyword triggers and mixed familiar+new dataset detection.

---

## 7. Open policy questions for agreement before Phase 104B

1. **Practice micro-resource page chrome (`Design Page`):** On ≤ 10–15 min Practice resources, should `Design Page` keep `knowledge_summary` ultra-brief (`~40–60w`) and allow `editorial_opening_image: "skip"` / omit `S78-D04` `study_tips`, or preserve `editorial_opening_image: "generate"` while slimming prose and activities?
2. **Workload overshoot handling at Practice LS / LJ Design Page:** Keep workload overshoot strictly non-blocking advisory warnings (Sprint 100 policy) — OR add an explicit pre-emit author confirmation / stronger warning banner when cumulative estimated effort exceeds `1.5×` commissioned duration?
3. **Economics regeneration freedom (Planned Acceptance #2):** Confirm that regenerating the 90-minute Economics journey post-implementation may vary component count (e.g., 4–5 well-proportioned components instead of 6 fragmented ones) while preserving the authoritative **90-minute** total and the pre-intervention baseline untouched.
