/**
 * Sprint 38-E / 38-F — Workbook contract prompt surface (pack §5 DLA / §6 GAM).
 * 38E: V-02 (AP-01), V-08, V-09, V-03/V-04/V-05/V-06/V-07, preservation unchanged.
 * 38F: V-01 (DLA-WB-06a, GAM-WB-38F-01), V-05 (DLA-WB-18, GAM-WB-10 F5), 38E-8/9 co-presence, V-13.
 * 38J: IFP-04..10 (38J-3 §5; 38S-2A removed IFP-00..03/07/08), DLA-WB-22..25; GAM-PRES, GAM-WB-22..25, F8 (38J-4 §6).
 * 38L: IFP-09..10, DLA-WB-26..30 (38L-2 §5); GAM-PRES-08/09, GAM-WB-26..30, F9 (38L-3 §6);
 * 38L-4: INF-EVAL-01, EV-CAP-04, DLA-WB-31 (§5); GAM-PRES-10, GAM-WB-31 (§6); harness alignment.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

function extractPromptFactory(heading) {
  const md = fs.readFileSync(ldPatternsPath, "utf8");
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    escaped +
      "[\\s\\S]*?### Prompt Factory\\s*```json\\s*([\\s\\S]*?)\\s*```"
  );
  const m = md.match(re);
  if (!m) throw new Error("Prompt Factory not found for " + heading);
  return JSON.parse(m[1].trim());
}

const dla = extractPromptFactory("## 5. Design Learning Activities");
const gam = extractPromptFactory("## 6. Generate Activity Materials");

test("pack §5: self-study workbook DLA-WB block and delivery_notes schema", () => {
  const t = dla.promptTemplate;
  assert.match(t, /Self-study workbook contract \(DLA-WB/i);
  assert.match(t, /resource_intent/i);
  assert.match(t, /session_duration_target_minutes/i);
  assert.match(t, /workbook_contract_applied/i);
  assert.match(t, /DLA-WB-06/i);
  assert.match(t, /MUST NOT be table-only/i);
  assert.match(t, /DLA-WB-03/i);
  assert.match(t, /50.?70/i);
  assert.match(t, /consolidation_requirement/i);
  assert.doesNotMatch(t, /GAM-WB/i);
});

test("pack §6: self-study workbook GAM-WB block and AP-01 invalid", () => {
  const t = gam.promptTemplate;
  assert.match(t, /Self-study workbook genre contract \(GAM-WB/i);
  assert.match(t, /Table-only workbook is contractually invalid/i);
  assert.match(t, /AP-01/i);
  assert.match(t, /GAM-WB-MIX-01/i);
  assert.match(t, /consolidation_summary/i);
  assert.match(t, /Design Page cannot compose workbook genres/i);
  assert.match(t, /do not weaken/i);
  assert.match(t, /LD-MATERIALS-COPY/i);
  assert.match(t, /LD-TABLE-FIDELITY/i);
  assert.doesNotMatch(t, /DLA-WB-/i);
});

test("pack §6: genre material guidance covers CW-REF minimum tokens", () => {
  const t = gam.promptTemplate;
  assert.match(t, /scenario:/i);
  assert.match(t, /sample_output|worked_example/i);
  assert.match(t, /task_cards:/i);
  assert.match(t, /checklist|retrieval_check/i);
  assert.match(t, /transfer_prompt/i);
  assert.match(t, /rubric|quality_criteria/i);
});

test("preservation lib modules: workbook contract did not alter LD module files", () => {
  const ldTable = fs.readFileSync(
    path.join(repoRoot, "lib", "ld-table-fidelity.js"),
    "utf8"
  );
  const ldCopy = fs.readFileSync(
    path.join(repoRoot, "lib", "ld-materials-copy.js"),
    "utf8"
  );
  const ldCompose = fs.readFileSync(
    path.join(repoRoot, "lib", "ld-design-page-compose-contract.js"),
    "utf8"
  );
  assert.match(ldTable, /LD-TABLE-FIDELITY/);
  assert.match(ldCopy, /LD-MATERIALS-COPY/);
  assert.match(ldCompose, /LD-DESIGN-PAGE-COMPOSE-CONTRACT/);
  assert.doesNotMatch(ldTable, /GAM-WB|DLA-WB/i);
  assert.doesNotMatch(ldCopy, /GAM-WB|DLA-WB/i);
  assert.doesNotMatch(ldCompose, /GAM-WB|DLA-WB/i);
});

// --- Sprint 38-F (38F-2 refinements) ---

test("pack §5 38F-2: V-01 DLA-WB-06a mandatory table/reference row when workbook applied", () => {
  const t = dla.promptTemplate;
  assert.match(t, /DLA-WB-06a/i);
  assert.match(t, /38F-2/i);
  assert.match(t, /workbook_contract_applied/i);
  assert.match(t, /reference_table|data_table|decision_table|planning_table/i);
  assert.match(t, /analysis_table|comparison_table|classification_table/i);
  assert.match(t, /practice-oriented activity/i);
  assert.match(t, /NOT on the capstone alone/i);
  assert.match(t, /coexist with DLA-WB-08/i);
  assert.match(t, /consolidation_summary/i);
});

test("pack §5 38F-2: output schema co-presence rows (1)–(4) must not drop 38E-8/9", () => {
  const t = dla.promptTemplate;
  assert.match(t, /DLA-WB-08.*worked_example/i);
  assert.match(t, /DLA-WB-12.*consolidation_summary/i);
  assert.match(t, /DLA-WB-06a/i);
  assert.match(t, /DLA-WB-18/i);
  assert.match(t, /must all coexist|do not drop worked/i);
});

test("pack §5 38F-2: V-05 DLA-WB-18 distinct scenario row; task_cards not sole carrier", () => {
  const t = dla.promptTemplate;
  assert.match(t, /DLA-WB-18.*38F-2|38F-2.*V-05/i);
  assert.match(t, /type scenario/i);
  assert.match(t, /≥2 cases/i);
  assert.match(t, /task_cards.*MUST NOT be the sole carrier|sole carrier of case/i);
  assert.match(t, /embedding.*only inside task_cards.*FAIL/i);
});

test("pack §5 38E-8/9: worked example and consolidation mandatory rows preserved", () => {
  const t = dla.promptTemplate;
  assert.match(t, /DLA-WB-08.*mandatory/i);
  assert.match(t, /worked_example AND type sample_output/i);
  assert.match(t, /DLA-WB-12.*mandatory/i);
  assert.match(t, /≥80 words.*≥3 key ideas|≥3 key ideas.*≥80 words/i);
  assert.match(t, /prompt_set.*does NOT replace consolidation_summary/i);
  assert.match(t, /capstone integrative template.*does NOT satisfy DLA-WB-08/i);
  assert.match(t, /modelling_note/i);
});

test("pack §6 38F-2: V-01 GAM-WB-38F-01 pipe table realisation and support-not-dump", () => {
  const t = gam.promptTemplate;
  assert.match(t, /GAM-WB-38F-01/i);
  assert.match(t, /LD-TABLE-FIDELITY pipe/i);
  assert.match(t, /reference_table|data_table|decision_table|planning_table/i);
  assert.match(t, /learner rank\/rate\/judgement cells empty|judgement cells empty/i);
  assert.match(t, /companion\/support material|not a reference dump/i);
  assert.match(t, /coexist.*worked_example|worked_example.*consolidation_summary/i);
  assert.match(t, /\(F6\)/i);
});

test("pack §6 38F-2: V-05 GAM-WB-10 scenario Material; task_cards cannot replace (F5)", () => {
  const t = gam.promptTemplate;
  assert.match(t, /Material:.*\(scenario\)/i);
  assert.match(t, /≥2 named cases/i);
  assert.match(t, /MUST NOT replace scenario Material|cannot replace scenario/i);
  assert.match(t, /task_cards-only|only inside task_cards/i);
  assert.match(t, /\(F5\)/i);
  assert.match(t, /AP-04/i);
});

test("pack §6 38E-8/9: GAM worked/consolidation enforcement and fail rules preserved", () => {
  const t = gam.promptTemplate;
  assert.match(t, /GAM-WB-02.*38E-9 mandatory|38E-9 mandatory.*GAM-WB-02/i);
  assert.match(t, /GAM-WB-06.*38E-9 mandatory|38E-9 mandatory.*GAM-WB-06/i);
  assert.match(t, /consolidation_summary.*≥80 words/i);
  assert.match(t, /prompt_set-only capstone closure = FAIL|MIX-03/i);
  assert.match(t, /template-only.*worked_example|MIX-04/i);
  assert.match(t, /\(F1\).*consolidation_summary/i);
  assert.match(t, /\(F2\).*prompt_set/i);
  assert.match(t, /\(F3\).*worked_example/i);
  assert.match(t, /\(F4\).*template-only/i);
  assert.match(t, /worked_example.*sample_output.*modelling_note/i);
});

test("pack §6 38H-2: GAM-WB-06b anti-spoiler consolidation discipline", () => {
  const t = gam.promptTemplate;
  assert.match(t, /GAM-WB-06b/i);
  assert.match(t, /38H-2/i);
  assert.match(t, /scaffold/i);
  assert.match(t, /\(F7\)/i);
  assert.match(t, /AP-05/i);
  assert.match(t, /you have learned|model essay/i);
  assert.match(t, /learner-production/i);
  assert.match(gam.defaultPromptNotes, /38H-2|GAM-WB-06b/i);
});

test("pack §6 38F-2: defaultPromptNotes cite 38F-2 and preservation modules", () => {
  assert.match(gam.defaultPromptNotes, /38F-2/i);
  assert.match(gam.defaultPromptNotes, /GAM-WB-38F-01/i);
  assert.match(gam.defaultPromptNotes, /F1–F9|F1-F9/i);
  assert.match(gam.defaultPromptNotes, /LD-MATERIALS-COPY/i);
  assert.match(gam.defaultPromptNotes, /LD-TABLE-FIDELITY/i);
  assert.match(dla.defaultPromptNotes, /38F-2/i);
  assert.match(dla.defaultPromptNotes, /DLA-WB-06a/i);
});

// --- Sprint 38-J (38J-3 IFP in pack §5) ---

test("pack §5 38J-3 / 38S-2A: superseded IFP planning blocks removed; obligation gates retained", () => {
  const t = dla.promptTemplate;
  assert.doesNotMatch(t, /IFP-00 SEQUENCE/i);
  assert.doesNotMatch(t, /IFP-01 ARCHETYPE SELECTION/i);
  assert.doesNotMatch(t, /IFP-02 ARCHETYPE TEMPLATES/i);
  assert.doesNotMatch(t, /IFP-03 KM TRIGGERS/i);
  assert.doesNotMatch(t, /IFP-07 SESSION ARC/i);
  assert.doesNotMatch(t, /- IFP-08:/i);
  assert.match(t, /IFP-04 INFERENCE CONTRACTS/i);
  assert.match(t, /IFP-05 ANTI-SHELL/i);
  assert.match(t, /IFP-06 ANTI-SPOILER/i);
  assert.match(t, /IFP-09 DEPTH FLOORS/i);
  assert.match(t, /IFP-10 CLOSURE EMISSION GATES/i);
  assert.match(t, /upstream episode_plans owns archetype and beat order/i);
  assert.doesNotMatch(t, /Apply LO cognitive-demand component bundles/i);
});

test("pack §5 38J-3: inference, anti-shell, anti-spoiler retained (planning moved to Episode Plan)", () => {
  const t = dla.promptTemplate;
  assert.doesNotMatch(t, /LO-ARC-03/i);
  assert.doesNotMatch(t, /AP-OVERRIDE-01/i);
  assert.match(t, /INF-01/i);
  assert.match(t, /worked judgement weak/i);
  assert.match(t, /AS-FAIL-01/i);
  assert.match(t, /SP-01/i);
  assert.doesNotMatch(t, /IFP-07 SESSION ARC/i);
});

test("pack §5 38J-3: DLA-WB-22..25 archetype and gate rows", () => {
  const t = dla.promptTemplate;
  assert.match(t, /DLA-WB-22.*38J-3/i);
  assert.match(t, /DLA-WB-23.*worked_example/i);
  assert.match(t, /DLA-WB-24.*AS-FAIL/i);
  assert.match(t, /DLA-WB-25.*session arc|ARC-01/i);
  assert.match(t, /EV-CAP-01/i);
});

test("pack §5 38J-3: defaultPromptNotes reinforce IFP obligation gates (38S-2A)", () => {
  assert.match(dla.defaultPromptNotes, /38J-3|38S-2A/i);
  assert.match(dla.defaultPromptNotes, /IFP-04/i);
  assert.match(dla.defaultPromptNotes, /IFP-05|AS-FAIL/i);
  assert.match(dla.defaultPromptNotes, /DLA-WB-22/i);
  assert.doesNotMatch(dla.defaultPromptNotes, /LO→archetype/i);
});

// --- Sprint 38-J (38J-4 GAM preservation in pack §6) ---

test("pack §6 38J-4: GAM-PRES preservation block — DLA decides, GAM realises", () => {
  const t = gam.promptTemplate;
  assert.match(t, /GAM-PRES-00/i);
  assert.match(t, /DLA decides, GAM realises/i);
  assert.match(t, /GAM-PRES-01 FUNCTION ORDER/i);
  assert.match(t, /GAM-PRES-02 NO COLLAPSE/i);
  assert.match(t, /GAM-PRES-03 FUNCTION REALISATION/i);
  assert.match(t, /GAM-PRES-04 ANTI-SHELL/i);
  assert.match(t, /GAM-PRES-05 ANTI-SPOILER/i);
  assert.match(t, /GAM-PRES-06 EVALUATE PRESERVATION/i);
  assert.doesNotMatch(t, /IFP-01 ARCHETYPE/i);
  assert.doesNotMatch(t, /primary_archetype/i);
  assert.doesNotMatch(t, /DLA-WB-/i);
});

test("pack §6 38J-4: function-order and no-collapse (GAM-WB-22/23, F8)", () => {
  const t = gam.promptTemplate;
  assert.match(t, /GAM-WB-22.*38J-4/i);
  assert.match(t, /GAM-WB-23.*no-collapse|NO COLLAPSE/i);
  assert.match(t, /criteria exposition.*worked judgement.*guided judgement/i);
  assert.match(t, /\(F8\)/i);
  assert.match(t, /F1–F9|F1-F9/i);
});

test("pack §6 38J-4: Evaluate A4 preservation and anti-spoiler", () => {
  const t = gam.promptTemplate;
  assert.match(t, /GAM-WB-24.*38J-4|38I-4 A4/i);
  assert.match(t, /weak vs strong/i);
  assert.match(t, /EV-GAM-FAIL/i);
  assert.match(t, /AS-GAM-FAIL/i);
  assert.match(t, /GAM-WB-06b/i);
  assert.match(t, /scaffold-only/i);
});

test("pack §6 38J-4: defaultPromptNotes reinforce preservation without replanning", () => {
  assert.match(gam.defaultPromptNotes, /38J-4/i);
  assert.match(gam.defaultPromptNotes, /DLA decides, GAM realises/i);
  assert.match(gam.defaultPromptNotes, /F1–F9|F1-F9/i);
  assert.match(gam.defaultPromptNotes, /GAM-WB-24/i);
  assert.doesNotMatch(gam.defaultPromptNotes, /IFP-00/i);
});

test("pack §5 after 38J-4 / 38S-2A: IFP obligation gates and DLA-WB-22 still present", () => {
  assert.match(dla.promptTemplate, /IFP-04 INFERENCE/i);
  assert.match(dla.promptTemplate, /DLA-WB-22/i);
  assert.doesNotMatch(dla.promptTemplate, /IFP-00 SEQUENCE/i);
});

// --- Sprint 38-L (38L-2 depth floors + emission gates in pack §5) ---

test("pack §5 38L-2: IFP-09 depth floors and IFP-10 emission gates", () => {
  const t = dla.promptTemplate;
  assert.match(t, /IFP-09 DEPTH FLOORS/i);
  assert.match(t, /38L-2 R2/i);
  assert.match(t, /depth_floor L3/i);
  assert.match(t, /IFP-10 CLOSURE EMISSION GATES/i);
  assert.match(t, /38L-2 R4/i);
  assert.match(t, /EMIT-FAIL-01/i);
  assert.match(t, /EMIT-FAIL-04/i);
  assert.match(t, /IFP-04–10|IFP-04-10/i);
});

test("pack §5 38L-2: universal verification and closure material rows", () => {
  const t = dla.promptTemplate;
  assert.match(t, /DLA-WB-26.*38L-2/i);
  assert.match(t, /EVERY activity MUST include.*checklist/i);
  assert.match(t, /DLA-WB-28.*38L-2/i);
  assert.match(t, /transfer_prompt/i);
  assert.match(t, /independent judgement/i);
  assert.match(t, /EV-CAP-03/i);
});

test("pack §5 38L-2: Analyse worked analytic pass obligation", () => {
  const t = dla.promptTemplate;
  assert.match(t, /DLA-WB-27.*38L-2/i);
  assert.match(t, /worked analytic pass/i);
  assert.match(t, /BEFORE analysis_table/i);
  assert.match(t, /≥1 exemplar row/i);
});

test("pack §5 38L-2: anti-emission and depth spec discipline", () => {
  const t = dla.promptTemplate;
  assert.match(t, /DLA-WB-29.*38L-2/i);
  assert.match(t, /DLA-WB-30.*38L-2/i);
  assert.match(t, /transfer_or_application_task.*without.*transfer_prompt/i);
  assert.match(t, /type-only specifications are depth FAIL/i);
});

test("pack §5 38L-DLA diagnosis: output PRE-EMIT rows (5)–(8) for mandatory 38L materials", () => {
  const t = dla.promptTemplate;
  assert.match(t, /\(5\) DLA-WB-26/i);
  assert.match(t, /\(6\) DLA-WB-27/i);
  assert.match(t, /\(7\) DLA-WB-28\/31/i);
  assert.match(t, /PRE-EMIT GATE/i);
});

test("pack §5 38L-2: defaultPromptNotes reinforce depth + emission gates", () => {
  assert.match(dla.defaultPromptNotes, /38L-2/i);
  assert.match(dla.defaultPromptNotes, /IFP-09/i);
  assert.match(dla.defaultPromptNotes, /IFP-10/i);
  assert.match(dla.defaultPromptNotes, /DLA-WB-26/i);
});

test("pack §6 unchanged after 38L-2: no IFP-09/10 in GAM template", () => {
  assert.doesNotMatch(gam.promptTemplate, /IFP-09 DEPTH FLOORS/i);
  assert.doesNotMatch(gam.promptTemplate, /DLA-WB-26.*38L-2/i);
  assert.match(gam.promptTemplate, /GAM-PRES-00/i);
});

// --- Sprint 38-L (38L-3 depth-shaped bodies in pack §6) ---

test("pack §6 38L-3: GAM-PRES-08 depth-shaped bodies and GAM-PRES-09 anti-collapse", () => {
  const t = gam.promptTemplate;
  assert.match(t, /GAM-PRES-08 DEPTH-SHAPED BODIES/i);
  assert.match(t, /38L-3 R2\/R3/i);
  assert.match(t, /depth_floor L3/i);
  assert.match(t, /GAM-PRES-09 ANTI-DEPTH-COLLAPSE/i);
  assert.match(t, /DEPTH-COLLAPSE-01/i);
  assert.match(t, /contract FAIL \(F9\)/i);
  assert.doesNotMatch(t, /IFP-09 DEPTH FLOORS/i);
});

test("pack §6 38L-3: verification realisation (R1)", () => {
  const t = gam.promptTemplate;
  assert.match(t, /GAM-WB-26.*38L-3/i);
  assert.match(t, /38L-3 verification R1/i);
  assert.match(t, /repair.*fail|repair-if-fail|repair path/i);
  assert.match(t, /NOT reflective question only/i);
});

test("pack §6 38L-3: Analyse worked analytic pass (R6)", () => {
  const t = gam.promptTemplate;
  assert.match(t, /GAM-WB-27.*38L-3/i);
  assert.match(t, /worked analytic pass/i);
  assert.match(t, /analytical lens/i);
  assert.match(t, /DEPTH-COLLAPSE-03/i);
});

test("pack §6 38L-3: Evaluate completion realisation (R5)", () => {
  const t = gam.promptTemplate;
  assert.match(t, /GAM-WB-28.*38L-3/i);
  assert.match(t, /38L-3 R5 transfer/i);
  assert.match(t, /independent judgement/i);
  assert.match(t, /consolidation_summary must NOT absorb/i);
});

test("pack §6 38L-3: GAM-WB-29/30 and F9 fail rule", () => {
  const t = gam.promptTemplate;
  assert.match(t, /GAM-WB-29.*38L-3/i);
  assert.match(t, /GAM-WB-30.*38L-3/i);
  assert.match(t, /\(F9\)/i);
  assert.match(t, /F1–F9|F1-F9/i);
});

test("pack §6 38L-3: defaultPromptNotes reinforce depth-shaped bodies", () => {
  assert.match(gam.defaultPromptNotes, /38L-3/i);
  assert.match(gam.defaultPromptNotes, /GAM-PRES-08/i);
  assert.match(gam.defaultPromptNotes, /GAM-WB-26/i);
  assert.match(gam.defaultPromptNotes, /DEPTH-COLLAPSE/i);
});

test("pack §5 unchanged after 38L-3: IFP-09 and DLA-WB-26..30 still present", () => {
  assert.match(dla.promptTemplate, /IFP-09 DEPTH FLOORS/i);
  assert.match(dla.promptTemplate, /DLA-WB-26.*38L-2/i);
  assert.doesNotMatch(gam.promptTemplate, /IFP-10 CLOSURE EMISSION/i);
});

// --- Sprint 38-L (38L-4 closure integration + Evaluate benchmark alignment) ---

test("pack §5 38L-4: INF-EVAL-01 household Evaluate anchor and EV-CAP-04 termination", () => {
  const t = dla.promptTemplate;
  assert.match(t, /INF-EVAL-01/i);
  assert.match(t, /38I-4 A4/i);
  assert.match(t, /EV-CAP-04/i);
  assert.match(t, /guided judgement alone CANNOT terminate|cannot end at guided comparison/i);
  assert.match(t, /AS-FAIL-06.*38L-4/i);
});

test("pack §5 38L-4: KM-T05/T08 and DLA-WB-31 completion pack", () => {
  const t = dla.promptTemplate;
  assert.match(t, /INF-EVAL-01.*38L-4/i);
  assert.match(t, /KM-T05|household budget impacts/i);
  assert.match(t, /KM-T08.*MUST NOT be primary Evaluate|KM-T08.*macro context only/i);
  assert.match(t, /DLA-WB-31.*38L-4/i);
  assert.match(t, /independent judgement \+ verification \+ transfer/i);
});

test("pack §5 38L-4: defaultPromptNotes reinforce closure integration", () => {
  assert.match(dla.defaultPromptNotes, /38L-4/i);
  assert.match(dla.defaultPromptNotes, /INF-EVAL-01/i);
  assert.match(dla.defaultPromptNotes, /DLA-WB-31/i);
});

test("pack §6 38L-4: GAM-PRES-10 and GAM-WB-31 Evaluate completion termination", () => {
  const t = gam.promptTemplate;
  assert.match(t, /GAM-PRES-10.*38L-4/i);
  assert.match(t, /EV-GAM-FAIL-07/i);
  assert.match(t, /GAM-WB-31.*38L-4/i);
  assert.match(t, /guided judgement table alone is insufficient/i);
});

test("pack §6 38L-4: defaultPromptNotes reinforce completion termination", () => {
  assert.match(gam.defaultPromptNotes, /38L-4/i);
  assert.match(gam.defaultPromptNotes, /GAM-PRES-10/i);
  assert.match(gam.defaultPromptNotes, /EV-GAM-FAIL-07/i);
});

test("38L-4 harness: frozen LO contract and benchmark-aligned capture script", () => {
  const harnessPath = path.join(
    repoRoot,
    "docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/ev-38l-inflation-pipeline-capture-once.mjs"
  );
  const frozenPath = path.join(
    repoRoot,
    "docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/ev-38l-frozen-learning-outcomes.json"
  );
  const harness = fs.readFileSync(harnessPath, "utf8");
  const frozen = JSON.parse(fs.readFileSync(frozenPath, "utf8"));
  assert.match(harness, /EV-38L-AFTER/);
  assert.match(harness, /loadFrozenLearningOutcomes/);
  assert.match(harness, /INF-EVAL-01/i);
  assert.match(harness, /GAM-PRES-10/i);
  assert.match(harness, /38I-4 A4/i);
  assert.match(harness, /NOT policy communication summary/i);
  assert.equal(frozen.learning_outcomes[3].cognitive_level, "Evaluate");
  assert.match(frozen.learning_outcomes[3].statement, /household/i);
  assert.doesNotMatch(frozen.learning_outcomes[3].statement, /Summarize.*policy communication/i);
});
