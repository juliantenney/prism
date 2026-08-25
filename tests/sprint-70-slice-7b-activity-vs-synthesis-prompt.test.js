/**
 * Sprint 70 Slice 7B — activity vs Knowledge Summary human-prompt modes.
 * S78-T-047: synthesis now receives Concept / claim boundary + authorised evidence.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const workspace = require("../lib/utilities-visual-jobs-workspace.js");

const romanRoadsPath = path.join(
  __dirname,
  "fixtures",
  "page-assemble",
  "roman-roads-visual-jobs-valid.json"
);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const page = JSON.parse(fs.readFileSync(romanRoadsPath, "utf8"));
const ws = workspace.buildVisualJobsWorkspaceState(page);
const activityConceptMap = ws.compilerResult.briefs.find(
  (b) => b.affordance_id === "va-a1-concept-map-01"
);
const knowledgeSummary = ws.compilerResult.briefs.find(
  (b) => b.affordance_id === "va-page-knowledge-summary-01"
);
const canonicalBefore = clone(ws.compilerResult);

test("Slice 7B inventory: activity and page briefs differ by canonical scope fields", () => {
  assert.equal(activityConceptMap.scope, "activity");
  assert.equal(activityConceptMap.purpose, "classification");
  assert.equal(activityConceptMap.spoiler_constraints.learner_stage, "pre_classification");
  assert.equal(activityConceptMap.spoiler_constraints.anti_spoiler, true);
  assert.equal(activityConceptMap.visual_slot, "materials-entry");
  assert.ok(activityConceptMap.pedagogical_metadata.pedagogical_added_value);

  assert.equal(knowledgeSummary.scope, "page");
  assert.equal(knowledgeSummary.purpose, "synthesis");
  assert.equal(knowledgeSummary.spoiler_constraints.learner_stage, "post_reasoning");
  assert.equal(knowledgeSummary.region, "knowledge_summary");
  assert.equal(knowledgeSummary.visual_slot, "knowledge-summary-after-content");
});

test("Slice 7B: activity concept map receives activity-mode concept boundary", () => {
  assert.equal(
    workspace.resolveHumanPromptMode(activityConceptMap),
    "activity_learning_support"
  );
  const prompt = workspace.buildVisualJobHumanPrompt(activityConceptMap);
  assert.match(prompt, /Educational visual mode: activity learning support/i);
  assert.match(
    prompt,
    /Only depict the concepts, processes, categories and relationships supplied in Show/i
  );
  assert.match(prompt, /Do not invent additional concepts/i);
  assert.match(
    prompt,
    /Do not introduce additional concepts, processes, categories, relationships/i
  );
  assert.match(prompt, /Support learner investigation rather than replacing it/i);
  assert.match(prompt, /answer-key/i);
  assert.match(prompt, /Show relationships visually through arrows, grouping, hierarchy/i);
  assert.match(prompt, /Do not explain those relationships in prose/i);
  assert.match(prompt, /Pre-classification stage/i);
  assert.match(prompt, /explanatory prose/i);
  assert.doesNotMatch(prompt, /Educational visual mode: knowledge synthesis/i);
});

test("Slice 7B: Knowledge Summary retains synthesis behaviour with claim boundary (not activity-only scaffolding)", () => {
  assert.equal(workspace.resolveHumanPromptMode(knowledgeSummary), "knowledge_synthesis");
  const prompt = workspace.buildVisualJobHumanPrompt(knowledgeSummary);
  assert.match(prompt, /Educational visual mode: knowledge synthesis/i);
  assert.match(prompt, /synthesis artefact/i);
  assert.match(prompt, /system organisation/i);
  assert.match(prompt, /Concept \/ claim boundary:/i);
  assert.match(prompt, /AUTHORISED relationships from Show/i);
  assert.doesNotMatch(prompt, /Support learner investigation rather than replacing it/i);
  assert.doesNotMatch(prompt, /Pre-classification stage/i);
  assert.doesNotMatch(prompt, /Educational visual mode: activity learning support/i);
  assert.doesNotMatch(
    prompt,
    /Only depict the concepts, processes, categories and relationships supplied in Show/i
  );
});

test("Slice 7B: activity diagnostics pass; synthesis diagnostics reflect synthesis mode", () => {
  const activityDiag = workspace.diagnoseHumanPrompt(
    workspace.buildVisualJobHumanPrompt(activityConceptMap),
    activityConceptMap
  );
  assert.equal(activityDiag.activity_mode, true);
  assert.equal(activityDiag.synthesis_mode, false);
  assert.equal(activityDiag.concept_boundary_present, true);
  assert.equal(activityDiag.relationship_visualisation_present, true);
  assert.equal(activityDiag.no_extra_concepts_instruction_present, true);
  assert.equal(activityDiag.preclassification_boundary_present, true);

  const synthesisDiag = workspace.diagnoseHumanPrompt(
    workspace.buildVisualJobHumanPrompt(knowledgeSummary),
    knowledgeSummary
  );
  assert.equal(synthesisDiag.activity_mode, false);
  assert.equal(synthesisDiag.synthesis_mode, true);
  assert.equal(synthesisDiag.concept_boundary_present, true);
  assert.equal(synthesisDiag.no_extra_concepts_instruction_present, true);
  assert.equal(synthesisDiag.authorised_evidence_present, true);
  assert.equal(synthesisDiag.synthesis_integration_bounded, true);
  assert.equal(synthesisDiag.preclassification_boundary_present, true);
});

test("Slice 7B: presentation includes mode diagnostics without mutating compiler output", () => {
  const presentation = workspace.buildVisualJobPresentation(activityConceptMap, 0);
  assert.equal(presentation.prompt_quality_diagnostics.human_prompt_mode, "activity_learning_support");
  assert.equal(presentation.prompt_quality_diagnostics.activity_mode, true);
  assert.deepEqual(ws.compilerResult, canonicalBefore);
  assert.equal(
    workspace.getBriefGenerationInstruction(ws, activityConceptMap.brief_id),
    activityConceptMap.generation_instruction
  );
});

test("Slice 7B: all activity and page briefs get an appropriate concept / claim boundary", () => {
  ws.compilerResult.briefs.forEach((brief) => {
    const prompt = workspace.buildVisualJobHumanPrompt(brief);
    if (brief.scope === "activity") {
      assert.match(prompt, /Concept boundary:/i);
      assert.match(
        prompt,
        /Only depict the concepts, processes, categories and relationships supplied in Show/i
      );
    } else {
      assert.match(prompt, /Concept \/ claim boundary:/i);
      assert.match(prompt, /knowledge synthesis/i);
      assert.match(prompt, /Authorised source evidence:/i);
    }
  });
});

test("Slice 7B: identical activity input remains byte-identical", () => {
  assert.equal(
    workspace.buildVisualJobHumanPrompt(activityConceptMap),
    workspace.buildVisualJobHumanPrompt(activityConceptMap)
  );
});
