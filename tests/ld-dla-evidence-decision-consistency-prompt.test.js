/**
 * Post-Sprint-74B manual-acceptance correction:
 * DLA producer contract must require a final per-activity evidence_decision
 * consistency audit (validator remains fail-closed / unchanged).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const dlaContract = require("../lib/ld-dla-page-enrich-contract.js");

test("DLA contract: final per-activity evidence_decision consistency audit is present", () => {
  const text = dlaContract.buildDlaPageEnrichContractBlock();
  assert.match(
    text,
    /FINAL PER-ACTIVITY EVIDENCE-DECISION CONSISTENCY AUDIT/i
  );
  assert.match(
    text,
    /After drafting each activity|not only during earlier Evidence-decision planning/i
  );
  assert.match(
    text,
    /cross-check evidence_decision\.required against learner_task, expected_output, evidence_use_prompt/i
  );
});

test("DLA contract: required:false forbids evidence-dependent learner wording", () => {
  const text = dlaContract.buildDlaPageEnrichContractBlock();
  assert.match(
    text,
    /If evidence_decision\.required is false:[\s\S]*provider_material_ids must be empty/i
  );
  assert.match(
    text,
    /no required_materials row may carry evidence_requirement/i
  );
  assert.match(
    text,
    /must not ask the learner to analyse or inspect supplied evidence/i
  );
  assert.match(
    text,
    /quote or cite supplied sources|use examples as evidence|interpret supplied texts/i
  );
});

test("DLA contract: evidence-dependent production requires required:true and a provider", () => {
  const text = dlaContract.buildDlaPageEnrichContractBlock();
  assert.match(
    text,
    /DO require inspection or use of supplied evidence:[\s\S]*evidence_decision\.required must be true/i
  );
  assert.match(
    text,
    /at least one genuine evidence provider material must exist/i
  );
  assert.match(
    text,
    /provider_material_ids must list those providers correctly/i
  );
  assert.match(
    text,
    /each listed provider row must include an explicit evidence_requirement/i
  );
});

test("DLA contract: includes invalid/valid evidence_decision contrast", () => {
  const text = dlaContract.buildDlaPageEnrichContractBlock();
  assert.match(text, /Invalid \/ valid contrast/i);
  assert.match(
    text,
    /Analyse the supplied case evidence and support your judgement with examples/i
  );
  assert.match(
    text,
    /Set evidence_decision\.required true[\s\S]*genuine evidence provider/i
  );
  assert.match(
    text,
    /Rewrite learner_task \/ expected_output \/ evidence_use_prompt/i
  );
});

test("S76: activity commissioning order is production → inputs → commissions → evidence", () => {
  const text = dlaContract.buildDlaPageEnrichContractBlock();
  assert.match(text, /Activity commissioning order/i);
  assert.match(text, /Define the learner production obligation/i);
  assert.match(text, /task_material_decision/i);
  assert.match(text, /non-empty purpose[\s\S]*non-empty specification/i);
  assert.match(text, /particulars-as-grounds/i);
  assert.match(text, /provider_material_ids must be a subset of task_input_material_ids/i);
  assert.doesNotMatch(text, /### Evidence-decision planning order/);
});

test("S76: canonical DLA shape includes task_material_decision and specification", () => {
  const snippet = dlaContract.buildCanonicalDlaPageShapeSnippet();
  const taskIdx = snippet.indexOf("task_material_decision");
  const materialsIdx = snippet.indexOf('"required_materials"');
  const evidenceIdx = snippet.lastIndexOf("evidence_decision");
  assert.ok(taskIdx >= 0);
  assert.ok(materialsIdx > taskIdx);
  assert.ok(evidenceIdx > materialsIdx);
  assert.match(snippet, /"specification":/);
  assert.equal(dlaContract.CONTRACT_VERSION, "76-DLA-PARTIAL-5");
});

test("S76 P01-R1: commissioning order distinguishes operand from model/workspace/scaffold", () => {
  const text = dlaContract.buildDlaPageEnrichContractBlock();
  assert.match(text, /particular content upon which the learner performs the required operation/i);
  assert.match(text, /operand\/stimulus/i);
  assert.match(text, /model = shows how/i);
  assert.match(text, /workspace = place\/structure/i);
  assert.match(text, /scaffold = prompts, supports or checks/i);
  assert.match(text, /when not already fully contained in learner_task/i);
  assert.match(text, /Used during the activity ≠ automatically a task input/);
  assert.match(
    text,
    /Listing a task input does not set evidence_decision\.required; P01 and P02 remain independent/
  );
  assert.match(text, /list only their material_ids in task_input_material_ids/);
  assert.doesNotMatch(text, /### Evidence-decision planning order/);
});
