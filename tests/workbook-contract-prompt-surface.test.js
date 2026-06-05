/**
 * Sprint 38-E / 38-F — Workbook contract prompt surface (pack §5 DLA / §6 GAM).
 * 38E: V-02 (AP-01), V-08, V-09, V-03/V-04/V-05/V-06/V-07, preservation unchanged.
 * 38F: V-01 (DLA-WB-06a, GAM-WB-38F-01), V-05 (DLA-WB-18, GAM-WB-10 F5), 38E-8/9 co-presence, V-13.
 * 38J: IFP-00..08, DLA-WB-22..25 (38J-3 §5); GAM-PRES, GAM-WB-22..25, F8 (38J-4 §6).
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
  assert.match(gam.defaultPromptNotes, /F1–F[78]|F1-F[78]/i);
  assert.match(gam.defaultPromptNotes, /LD-MATERIALS-COPY/i);
  assert.match(gam.defaultPromptNotes, /LD-TABLE-FIDELITY/i);
  assert.match(dla.defaultPromptNotes, /38F-2/i);
  assert.match(dla.defaultPromptNotes, /DLA-WB-06a/i);
});

// --- Sprint 38-J (38J-3 IFP in pack §5) ---

test("pack §5 38J-3: IFP mandatory internal planning block present", () => {
  const t = dla.promptTemplate;
  assert.match(t, /IFP-00 SEQUENCE/i);
  assert.match(t, /IFP-01 ARCHETYPE SELECTION/i);
  assert.match(t, /IFP-02 ARCHETYPE TEMPLATES/i);
  assert.match(t, /IFP-03 KM TRIGGERS/i);
  assert.match(t, /IFP-04 INFERENCE CONTRACTS/i);
  assert.match(t, /IFP-05 ANTI-SHELL/i);
  assert.match(t, /IFP-06 ANTI-SPOILER/i);
  assert.match(t, /IFP-07 SESSION ARC/i);
  assert.match(t, /IFP-08/i);
  assert.match(t, /not a stored artefact/i);
  assert.doesNotMatch(t, /Apply LO cognitive-demand component bundles/i);
});

test("pack §5 38J-3: archetype selection and 38I-3 authority", () => {
  const t = dla.promptTemplate;
  assert.match(t, /LO-ARC-03/i);
  assert.match(t, /AP-OVERRIDE-01/i);
  assert.match(t, /AN-ASSESS-01/i);
  assert.match(t, /primary_archetype/i);
  assert.match(t, /Evaluate > Analyse > Apply > Understand/i);
});

test("pack §5 38J-3: KM triggers, inference, anti-shell, anti-spoiler, session arc", () => {
  const t = dla.promptTemplate;
  assert.match(t, /KM-T01/i);
  assert.match(t, /KM-T03/i);
  assert.match(t, /INF-01/i);
  assert.match(t, /worked judgement weak/i);
  assert.match(t, /AS-FAIL-01/i);
  assert.match(t, /SP-01/i);
  assert.match(t, /ARC-01/i);
  assert.match(t, /ARC-LO-02/i);
});

test("pack §5 38J-3: DLA-WB-22..25 archetype and gate rows", () => {
  const t = dla.promptTemplate;
  assert.match(t, /DLA-WB-22.*38J-3/i);
  assert.match(t, /DLA-WB-23.*worked_example/i);
  assert.match(t, /DLA-WB-24.*AS-FAIL/i);
  assert.match(t, /DLA-WB-25.*session arc|ARC-01/i);
  assert.match(t, /EV-CAP-01/i);
});

test("pack §5 38J-3: defaultPromptNotes reinforce IFP mandatory planning", () => {
  assert.match(dla.defaultPromptNotes, /38J-3/i);
  assert.match(dla.defaultPromptNotes, /IFP mandatory/i);
  assert.match(dla.defaultPromptNotes, /anti-shell/i);
  assert.match(dla.defaultPromptNotes, /DLA-WB-22/i);
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
  assert.match(t, /F1–F8|F1-F8/i);
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
  assert.match(gam.defaultPromptNotes, /F1–F8|F1-F8/i);
  assert.match(gam.defaultPromptNotes, /GAM-WB-24/i);
  assert.doesNotMatch(gam.defaultPromptNotes, /IFP-00/i);
});

test("pack §5 unchanged after 38J-4: IFP block still present", () => {
  assert.match(dla.promptTemplate, /IFP-00 SEQUENCE/i);
  assert.match(dla.promptTemplate, /DLA-WB-22/i);
});
