/**
 * S78-T-047 — Harden image instructional fidelity for synthesis visuals.
 * Domain-general (Roman roads fixture) — not Hydrology-specific.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const designPagePartial = require("../lib/ld-design-page-partial-contract.js");

const romanRoadsPath = path.join(
  __dirname,
  "fixtures",
  "page-assemble",
  "roman-roads-visual-jobs-valid.json"
);

const page = JSON.parse(fs.readFileSync(romanRoadsPath, "utf8"));
const ws = workspace.buildVisualJobsWorkspaceState(page);
const activityBrief = ws.compilerResult.briefs.find(
  (b) => b.affordance_id === "va-a1-concept-map-01"
);
const synthesisBrief = ws.compilerResult.briefs.find(
  (b) => b.affordance_id === "va-page-knowledge-summary-01"
);

test("T-047 inventory: Roman roads activity + page synthesis briefs present", () => {
  assert.ok(activityBrief, "activity brief");
  assert.ok(synthesisBrief, "synthesis brief");
  assert.equal(activityBrief.scope, "activity");
  assert.equal(synthesisBrief.scope, "page");
  assert.equal(synthesisBrief.purpose, "synthesis");
});

test("T-047 synthesis HUMAN prompt has explicit no-extra-concepts / processes / relationships boundary", () => {
  const prompt = workspace.buildVisualJobHumanPrompt(synthesisBrief);
  assert.match(prompt, /Concept \/ claim boundary:/i);
  assert.match(
    prompt,
    /Visualise only entities, processes, categories and relationships authorised by Show/i
  );
  assert.match(prompt, /Do not add textbook concepts, processes, categories/i);
  assert.match(prompt, /fluxes, boundary crossings or causal relationships/i);
  assert.match(prompt, /Do not strengthen qualified or conditional claims/i);
  assert.match(prompt, /must not invent new ones/i);
  assert.match(prompt, /multiple authorised relationships/i);
});

test("T-047 activity HUMAN prompt retains strengthened Concept boundary", () => {
  const prompt = workspace.buildVisualJobHumanPrompt(activityBrief);
  assert.match(prompt, /Concept boundary:/i);
  assert.match(
    prompt,
    /Only depict the concepts, processes, categories and relationships supplied in Show/i
  );
  assert.match(
    prompt,
    /Do not introduce additional concepts, processes, categories, relationships/i
  );
  assert.match(
    prompt,
    /Scientifically or disciplinarily plausible extras that are not authorised by this brief must still be omitted/i
  );
  assert.match(prompt, /Do not strengthen qualified or conditional claims/i);
  assert.match(prompt, /Subject and context are commissioning cues only/i);
});

test("T-047 synthesis HUMAN prompt includes compact authorised evidence from resolved anchors", () => {
  assert.ok(
    Array.isArray(synthesisBrief.source_evidence) && synthesisBrief.source_evidence.length,
    "compiler resolved source_evidence"
  );
  const prompt = workspace.buildVisualJobHumanPrompt(synthesisBrief);
  assert.match(prompt, /Authorised source evidence:/i);
  assert.match(prompt, /Knowledge summary:/i);
  assert.match(prompt, /imperial connectivity/i);
  assert.match(prompt, /differentiated road types|staged construction|networked/i);
  assert.doesNotMatch(prompt, /\[page_synthesis\.|brief_id|job_id|schema_version/i);
  const diag = workspace.diagnoseHumanPrompt(prompt, synthesisBrief);
  assert.equal(diag.authorised_evidence_present, true);
});

test("T-047 knowledge_summary evidence conveys specific authorised categories/relationships", () => {
  const lines = workspace.buildAuthorisedEvidenceLines(synthesisBrief);
  assert.ok(lines.length >= 1);
  const joined = lines.join("\n");
  assert.match(joined, /Knowledge summary:/i);
  assert.match(joined, /Roman roads supported imperial connectivity/i);
  assert.doesNotMatch(joined, /Atmospheric inputs|Upstream inflows|Outflows to other basins/i);
});

test("T-047 must_show / claims remain present and operative on synthesis human prompt", () => {
  const prompt = workspace.buildVisualJobHumanPrompt(synthesisBrief);
  assert.match(prompt, /Show:/i);
  assert.match(prompt, /connectivity synthesis links/i);
  assert.match(prompt, /road-type to function relationships/i);
  assert.match(prompt, /Claim discipline:/i);
  assert.match(prompt, /Supported claim boundary: Road networks supported imperial connectivity/i);
  assert.match(prompt, /Do not claim: Causal claims not present in the knowledge summary/i);
  assert.match(prompt, /Avoid:/i);
});

test("T-047 open-ended integrate-across-lesson wording is subordinated to authorised claims", () => {
  const prompt = workspace.buildVisualJobHumanPrompt(synthesisBrief);
  assert.doesNotMatch(prompt, /integrate relationships across the lesson/i);
  assert.match(prompt, /AUTHORISED relationships from Show/i);
  assert.match(
    prompt,
    /do not invent extra concepts, categories, processes, fluxes, or causal links/i
  );
  const diag = workspace.diagnoseHumanPrompt(prompt, synthesisBrief);
  assert.equal(diag.synthesis_integration_bounded, true);
  assert.equal(diag.concept_boundary_present, true);
  assert.equal(diag.no_extra_concepts_instruction_present, true);
});

test("T-047 Design Page live contract contains strengthened synthesis commissioning salience", () => {
  const block = designPagePartial.buildDesignPagePartialContractBlock();
  assert.match(block, /S78-VA synthesis commissioning/i);
  assert.match(block, /must_show and allowed_claims must name the taught entities/i);
  assert.match(block, /inputs and outputs around the system/i);
  assert.match(block, /plausible disciplinary extensions/i);
  assert.match(block, /must_not_show and\/or disallowed_claims/i);
  assert.match(block, /multiple AUTHORISED relationships/i);
  assert.doesNotMatch(block, /Atmospheric inputs|Hydrology|precipitation|drainage-basin/i);
});

test("T-047 domain-general: activity evidence also appears on activity human prompt when resolved", () => {
  const prompt = workspace.buildVisualJobHumanPrompt(activityBrief);
  if (Array.isArray(activityBrief.source_evidence) && activityBrief.source_evidence.length) {
    assert.match(prompt, /Authorised source evidence:/i);
  }
  assert.match(prompt, /activity learning support/i);
  assert.doesNotMatch(prompt, /knowledge synthesis/i);
});

test("T-047 human prompt byte-identical for same brief", () => {
  assert.equal(
    workspace.buildVisualJobHumanPrompt(synthesisBrief),
    workspace.buildVisualJobHumanPrompt(synthesisBrief)
  );
});
