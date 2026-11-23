/**
 * JSON-producing workflow prompts must request ordinary inline fenced JSON,
 * not downloadable ChatGPT page/file artefacts.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const strict = require("../lib/workflow-artefact-json-strict.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

test("shared presentation requirement forbids downloadable artefacts", () => {
  const block = strict.buildInlineFencedJsonPresentationRequirement();
  assert.match(block, /OUTPUT PRESENTATION REQUIREMENT/);
  assert.match(block, /ordinary Markdown fenced code block/i);
  assert.match(block, /three backticks followed by `json`/);
  assert.match(block, /Do not create, attach or link to a downloadable file/i);
  assert.match(block, /Do not use a document-generation or file-creation capability/i);
  assert.match(block, /STEP N OUTPUT/);
});

test("append is idempotent", () => {
  const once = strict.appendInlineFencedJsonPresentationRequirement("Base prompt");
  const twice = strict.appendInlineFencedJsonPresentationRequirement(once);
  assert.equal(once, twice);
  assert.equal((once.match(/OUTPUT PRESENTATION REQUIREMENT/g) || []).length, 1);
});

test("strict artefact contracts include the presentation requirement", () => {
  [
    strict.buildStrictKnowledgeModelOutputContractBlock(),
    strict.buildStrictLearningContentOutputContractBlock(),
    strict.buildStrictLearningSequenceOutputContractBlock(),
    strict.buildStrictLearningOutcomesOutputContractBlock(),
    strict.buildStrictEpisodePlansOutputContractBlock(),
    strict.buildStrictExpositoryJourneyPlanOutputContractBlock()
  ].forEach(function (block) {
    assert.match(block, /OUTPUT PRESENTATION REQUIREMENT/);
    assert.match(block, /Do not create, attach or link to a downloadable file/i);
    assert.match(block, /fenced JSON block only/i);
  });
});

test("Practice Design Episode Plan prompt includes inline fenced JSON presentation", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: ["lib/workflow-artefact-json-strict.js"]
  });
  const family = require("../lib/first-class-workflow-family.js");
  const built = family.buildFirstClassWorkflowFamily({
    product: "practice",
    focus: "Feedback judgements",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(built.ok, true, JSON.stringify(built));
  const ep = {
    id: "s-ep",
    title: "Design Episode Plan",
    canonical_step_id: "step_design_episode_plan",
    outputName: "page"
  };
  const wf = {
    id: "wf-practice-json-presentation",
    product: "practice",
    steps: [ep],
    pageEnrichmentV2: true,
    workflowBriefResolution: {
      resolvedFactors: Object.assign({}, built.deliverySeed || {}, {
        topic: "Feedback judgements"
      }),
      initialBrief: { topic: "Feedback judgements", product: "practice" }
    }
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  const prompt = api.applyWorkflowStepRuntimePromptAugmentations(
    [
      "Design Episode Plan for a Practice resource.",
      "Copilot output contract: return one pretty-printed fenced JSON page artefact (triple-backtick json fence, 2-space indentation). No prose before the fence. After the closing fence emit exactly one runner footer line: STEP 1 OUTPUT: page."
    ].join("\n"),
    ep,
    wf,
    {}
  );
  assert.match(prompt, /OUTPUT PRESENTATION REQUIREMENT/);
  assert.match(prompt, /ordinary Markdown fenced code block/i);
  assert.match(prompt, /Do not create, attach or link to a downloadable file/i);
  assert.match(prompt, /Do not replace the JSON with a download link/i);
  assert.match(prompt, /literal text inside the code block/i);
  assert.match(prompt, /STEP N OUTPUT/);
  assert.equal((prompt.match(/OUTPUT PRESENTATION REQUIREMENT/g) || []).length, 1);
});
