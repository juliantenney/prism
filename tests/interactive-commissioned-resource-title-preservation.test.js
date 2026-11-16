/**
 * Commissioned Interactive resource titles must survive Design Page invention,
 * assembly, render identity and ZIP filename derivation.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const assemble = require("../lib/page-vnext-assemble.js");
const designPagePartial = require("../lib/ld-design-page-partial-contract.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const COMMISSIONED_TITLE = "Why the constraint matters";
const MODEL_INVENTED_TITLE = "Choosing the Best Rectangle";
const fixturesDir = path.join(__dirname, "fixtures", "page-assemble");

function boot() {
  return loadPrismAppJsTestApi({
    extraLibs: [
      "lib/ld-design-page-partial-contract.js",
      "lib/first-class-workflow-family.js",
      "lib/page-vnext-assemble.js"
    ]
  });
}

function loadFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

function commissionedInteractiveWorkflow(overrides) {
  return Object.assign(
    {
      id: "wf-commissioned-constraint",
      name: COMMISSIONED_TITLE,
      product: "interactive",
      variant: "self_study",
      goal: COMMISSIONED_TITLE,
      desiredOutputs: "Learner-facing page",
      pageEnrichmentV2: true,
      partialPageOutputs: true,
      workflowBriefResolution: {
        resolvedFactors: {
          topic: COMMISSIONED_TITLE,
          page_title: COMMISSIONED_TITLE
        }
      },
      steps: [
        {
          id: "s-dp",
          title: "Design Page",
          canonical_step_id: "step_design_page",
          canonical_title: "Design Page"
        }
      ]
    },
    overrides || {}
  );
}

test("Design Page contract requires retaining an authoritative resource title when supplied", () => {
  const text = designPagePartial.buildDesignPagePartialContractBlock();
  assert.match(text, /AUTHORITATIVE RESOURCE TITLE/i);
  assert.match(text, /emit that exact string as page\.title/i);
  assert.match(text, /Do not invent an alternative/i);
  assert.match(text, /Do not copy the original request\/brief as the title/i);
});

test("authoritative commissioned title outranks a model-invented Design Page title", () => {
  const { api } = boot();
  const wf = commissionedInteractiveWorkflow();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  assert.equal(api.resolveAuthoritativeResourceTitleForTest(wf), COMMISSIONED_TITLE);
  assert.equal(api.isScaffoldingResourceTitleForTest(COMMISSIONED_TITLE), false);
  assert.equal(
    api.isScaffoldingResourceTitleForTest(
      "Create a 60-minute self-study resource on rectangles"
    ),
    true
  );

  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: MODEL_INVENTED_TITLE,
    activities: []
  };
  const restored = api.applyAuthoritativeResourceTitleToPageForTest(page, wf);
  assert.equal(restored.title, COMMISSIONED_TITLE);

  const shell = api.buildPageShellOptionsFromWorkflow(wf, []);
  assert.equal(shell.title, COMMISSIONED_TITLE);
});

test("assembly keeps commissioned title when Design Page invents an alternative", () => {
  const { api } = boot();
  const wf = commissionedInteractiveWorkflow();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  const shell = loadFixture("ep-shell.json");
  shell.title = COMMISSIONED_TITLE;
  const dp = loadFixture("dp-partial-with-va.json");
  dp.title = MODEL_INVENTED_TITLE;

  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: shell,
    design_page: dp
  });
  assert.equal(result.ok, true);
  assert.equal(result.page.title, MODEL_INVENTED_TITLE, "raw assemble still applies Design Page title");

  const restored = api.applyAuthoritativeResourceTitleToPageForTest(result.page, wf);
  assert.equal(restored.title, COMMISSIONED_TITLE);

  const zipStem = api.getUtilityOutputBaseNameForTest(restored, "");
  assert.equal(zipStem, "why-the-constraint-matters");
  assert.notEqual(zipStem, "choosing-the-best-rectangle");
});

test("Design Page runtime prompt injects the authoritative commissioned title", () => {
  const { api } = boot();
  const wf = commissionedInteractiveWorkflow();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  const prompt = api.applyLdDesignPagePartialContractToDraft(
    "Design the learner-facing page.\n",
    {
      stepCanonicalStepId: "step_design_page",
      stepCanonicalTitle: "Design Page",
      stepTitle: "Design Page",
      workflowId: wf.id
    },
    wf
  );
  assert.match(prompt, /LD-DESIGN-PAGE-PARTIAL-CONTRACT \(auto-applied\)/i);
  assert.match(prompt, /AUTHORITATIVE RESOURCE TITLE \(auto-applied\)/i);
  assert.match(prompt, /Why the constraint matters/);
  assert.match(prompt, /Do not invent an alternative resource title/i);
});
