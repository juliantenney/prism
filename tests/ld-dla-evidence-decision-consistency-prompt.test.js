/**
 * DLA producer contract — P04 + P01-R1 + T-033 + T-031 + S78-WS-1 (live 78-DLA-WS-1).
 * Historical per-activity / PRE-EMIT / INVALID–VALID audits are deleted.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const dlaContract = require("../lib/ld-dla-page-enrich-contract.js");

function liveText() {
  return dlaContract.assembleDlaCanonicalContract().text;
}

test("S76 P04: commissioning order is production → inputs → commissions → evidence", () => {
  const text = liveText();
  assert.match(text, /## 4\. LEARNER PRODUCTION/);
  assert.match(text, /Define the learner production obligation/i);
  assert.match(text, /task_material_decision/i);
  assert.match(text, /non-empty purpose[\s\S]*non-empty specification/i);
  assert.match(text, /particulars-as-grounds/i);
  assert.match(
    text,
    /list those task-input rows in provider_material_ids and attach evidence_requirement/i
  );
  assert.doesNotMatch(text, /### Evidence-decision planning order/);
});

test("S76: canonical DLA shape includes task_material_decision and specification", () => {
  const snippet = dlaContract.assembleDlaCanonicalContract().sections.examples;
  const taskIdx = snippet.indexOf("task_material_decision");
  const materialsIdx = snippet.indexOf('"required_materials"');
  const evidenceIdx = snippet.lastIndexOf("evidence_decision");
  assert.ok(taskIdx >= 0);
  assert.ok(materialsIdx > taskIdx);
  assert.ok(evidenceIdx > materialsIdx);
  assert.match(snippet, /"specification":/);
  assert.equal(dlaContract.CONTRACT_VERSION, "78-DLA-WS-3");
});

test("S76 P01-R1: commissioning order distinguishes operand from model/workspace/scaffold", () => {
  const text = liveText();
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

test("S76 P01-R1: intermediate object/state may be a system-supplied task input", () => {
  const text = liveText();
  const shape = dlaContract.assembleDlaCanonicalContract().sections.examples;
  assert.match(text, /already-formed object or state/);
  assert.match(text, /this activity.s operation acts on/);
  assert.match(text, /when the system must supply it/);
  assert.match(
    text,
    /Recording work in a workspace does not make the workspace the operand/
  );
  assert.match(text, /prior-activity product is not a new GAM commission/);
  assert.match(text, /P01 and P02 remain independent/);
  assert.match(
    text,
    /if they lose only an example of how, a place to write, guidance, or a checklist, it is not/
  );
  assert.doesNotMatch(text, /Lagrangian/);
  assert.doesNotMatch(text, /FINAL PRE-EMIT AUDIT/i);
  assert.doesNotMatch(text, /FINAL PER-ACTIVITY EVIDENCE-DECISION CONSISTENCY AUDIT/i);
  assert.equal((shape.match(/"activity_id": "A2"/g) || []).length, 0);
});

test("S76 T-033: Step 1 requires load-bearing mapped-LO operations", () => {
  const text = liveText();
  assert.match(
    text,
    /Completing it must require every load-bearing operation needed to demonstrate the mapped LO/
  );
  assert.match(
    text,
    /A supporting check must not substitute for the operation the mapped LO requires/
  );
  assert.match(
    text,
    /If completed perfectly, would the work demonstrate every load-bearing mapped-LO operation/
  );
  assert.match(text, /redesign production before commissioning materials/);
  assert.doesNotMatch(text, /Bloom/);
  assert.doesNotMatch(text, /one activity per/);
  assert.doesNotMatch(text, /mandatory activity splitting/);
});

test("S76 P04: step 4 is the compact particulars-as-grounds definition", () => {
  const text = liveText();
  assert.match(text, /DLA owns evidence_decision\.required/i);
  assert.match(text, /particulars-as-grounds/i);
  assert.match(text, /it does not mean no materials/i);
  assert.match(text, /Procedural operands may be task inputs/i);
  assert.match(text, /Provenance is not this boolean/i);
  assert.match(
    text,
    /does not by itself make the production sufficient for the mapped LO/i
  );
  assert.match(
    text,
    /not from nouns, activity_preamble, intellectual_coherence_bridge, or later-activity mentions/i
  );
});

test("S76 P04: protected step 1 and step 3 openings survive", () => {
  const text = liveText();
  assert.match(
    text,
    /Define the learner production obligation \(expected_output and learner_task intent\)\./
  );
  assert.match(text, /binding GAM bounds: content, load-bearing count\/variation\/constraints\/exclusions/);
  assert.match(text, /specification must not be only the material_type token/);
});

test("S76 P04: provider-authoring core retains Sprint 72 vocabulary", () => {
  const text = liveText();
  assert.match(text, /Evidence-provider authoring \(only when evidence_decision\.required is true\)/i);
  assert.match(text, /evidence_requirement\.learner_action/);
  assert.match(text, /evidence_requirement\.observable_features/);
  assert.match(text, /distinct analogous case|procedure-only modelling|focal evidence provider/i);
  assert.match(text, /system_generated_simulation/);
  assert.match(text, /conversation_attachment/);
  assert.match(text, /does not make that scaffold the evidence provider/i);
  assert.match(text, /combined_evidence_workspace/);
  assert.match(
    text,
    /fixed_observation_fields must name the source-native evidence field/i
  );
});

test("S76 P04: one attachment/source-use pre-step; no duplicate source-preference heading", () => {
  const text = liveText();
  assert.match(text, /## 3\. SOURCES AND ATTACHMENTS/);
  assert.match(text, /Inventory the source units actually available/i);
  assert.match(text, /Do not invent related but unattached works/i);
  assert.match(text, /Known boundary/i);
  assert.match(text, /learner_evidence_attachments/);
  assert.doesNotMatch(text, /### PRE-DESIGN:/);
  assert.doesNotMatch(text, /### Resource-level source-use commitment/);
  assert.doesNotMatch(text, /Source preference:/);
});

test("S76 P04: redundant evidence self-audits and noun force-true are absent", () => {
  const text = liveText();
  assert.doesNotMatch(text, /FINAL PRE-EMIT AUDIT/i);
  assert.doesNotMatch(text, /FINAL PER-ACTIVITY EVIDENCE-DECISION CONSISTENCY AUDIT/i);
  assert.doesNotMatch(text, /Invalid \/ valid contrast/i);
  assert.doesNotMatch(
    text,
    /Analyse the supplied case evidence and support your judgement with examples/i
  );
  assert.doesNotMatch(text, /must set evidence_decision\.required true/i);
  assert.doesNotMatch(text, /must set required true/i);
});

test("S76 T-031: Step 3 requires operational bounds for this commissioned operation", () => {
  const text = liveText();
  assert.match(
    text,
    /Include any pedagogically chosen method, condition, assumption, boundary, or exclusion the commissioned operation depends on/
  );
  assert.match(
    text,
    /If omitting it would permit an operand that requires a different operation or untaught reasoning, the specification is insufficient/
  );
  assert.match(text, /State bounds for this commissioned operation only/);
  assert.match(text, /specification must not be only the material_type token/);
  assert.match(
    text,
    /Completing it must require every load-bearing operation needed to demonstrate the mapped LO/
  );
  assert.match(text, /already-formed object or state/);
  assert.match(text, /P01 and P02 remain independent/);
  assert.match(text, /particulars-as-grounds/);
  assert.match(text, /list those task-input rows in provider_material_ids and attach evidence_requirement/);
  assert.doesNotMatch(text, /Lagrangian/);
  assert.doesNotMatch(text, /KKT/);
  assert.doesNotMatch(text, /Bloom/);
  assert.doesNotMatch(text, /FINAL PRE-EMIT AUDIT/i);
  assert.doesNotMatch(text, /FINAL PER-ACTIVITY EVIDENCE-DECISION CONSISTENCY AUDIT/i);
  assert.equal(dlaContract.CONTRACT_VERSION, "78-DLA-WS-3");
});

test("S76 P04: unique legacy contract+shape stays inside the rationalisation size band", () => {
  const block = dlaContract.buildDlaPageEnrichContractBlock();
  const shape = dlaContract.buildCanonicalDlaPageShapeSnippet();
  const unique = block.length + shape.length;
  assert.ok(unique > 18700, "unique contract+shape " + unique + " below 18700 — possible over-deletion");
  assert.ok(unique < 19150, "unique contract+shape " + unique + " above 19150 — possible leftover duplication");
});

test("S76 P04: canonical shape keeps one evidence-true example and one P01-true/P02-false contrast", () => {
  const snippet = dlaContract.assembleDlaCanonicalContract().sections.examples;
  assert.match(snippet, /"learner_action"/);
  assert.match(snippet, /"observable_features"/);
  assert.match(snippet, /"evidence_layout": "separate_provider"/);
  assert.match(
    snippet,
    /practice operands remain in task_input_material_ids with evidence_decision\.required false and no evidence_requirement/i
  );
});

test("S78-T-009: §10 output surface requires provider rows MUST carry evidence_requirement", () => {
  const output = dlaContract.assembleDlaCanonicalContract().sections.output;
  assert.match(
    output,
    /when evidence_decision\.required is true, every material_id in evidence_decision\.provider_material_ids MUST identify a required_materials\[\] row carrying a complete evidence_requirement/i
  );
  assert.match(output, /task_material_decision\.task_input_material_ids/);
  assert.doesNotMatch(
    output,
    /optional only on evidence-provider required_materials\[\] rows: evidence_requirement/
  );
});

test("S78-T-009: §10 pre-output checklist includes explicit P02 closure check", () => {
  const output = dlaContract.assembleDlaCanonicalContract().sections.output;
  assert.match(output, /Pre-output deterministic capture checks/i);
  assert.match(
    output,
    /for every provider_material_id, the matching required_materials\[\] row contains complete evidence_requirement/i
  );
  // T-050 adds FINAL SILENT PRE-EMIT CHECK (P02); do not reintroduce obsolete FINAL PRE-EMIT AUDIT wording.
  assert.doesNotMatch(output, /FINAL PRE-EMIT AUDIT/i);
  assert.match(output, /FINAL SILENT PRE-EMIT CHECK \(P02\)/i);
});

test("S78-T-009: §7/§8/§10/§11 remain mutually consistent on P02", () => {
  const assembled = dlaContract.assembleDlaCanonicalContract();
  const evidence = assembled.sections.evidence;
  const providers = assembled.sections.providers;
  const output = assembled.sections.output;
  const examples = assembled.sections.examples;
  assert.match(evidence, /attach evidence_requirement on those rows/i);
  assert.match(providers, /Evidence-provider authoring \(only when evidence_decision\.required is true\)/);
  assert.match(output, /P02 provider-row closure/i);
  assert.match(examples, /"evidence_requirement": \{/);
  assert.match(examples, /"provider_material_ids": \["A1-M1"\]/);
});
