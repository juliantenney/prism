/**
 * S78-T-032 — GAM learner-closure packaging (S78-D04) prompt/contract regressions.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const gamContract = require(path.join(repoRoot, "lib", "ld-gam-page-enrich-contract.js"));
const designPagePartial = require(path.join(repoRoot, "lib", "ld-design-page-partial-contract.js"));
const thinAssembly = require(path.join(repoRoot, "lib", "ld-thin-assembly-coherence.js"));
const materialsCopy = require(path.join(repoRoot, "lib", "ld-materials-copy.js"));
const gamEnrich = require(path.join(repoRoot, "lib", "page-gam-enrich.js"));
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const CLOSURE_HEADING = gamContract.PAGE_LEARNER_RESOURCE_CLOSURE_HEADING;

function loadPrismTestApi() {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function buildGamV2Workflow(overrides) {
  return Object.assign(
    {
      id: "wf-s78-t032-gam",
      goal: "Learner page",
      pageEnrichmentV2: true,
      partialPageOutputs: true,
      steps: [
        { id: "lo_step", title: "Define Learning Outcomes", outputName: "learning_outcomes" },
        {
          id: "ep_step",
          title: "Design Episode Plan",
          outputName: "page",
          canonical_step_id: "step_design_episode_plan"
        },
        {
          id: "dla_step",
          title: "Design Learning Activities",
          outputName: "page",
          canonical_step_id: "step_design_learning_activities"
        },
        {
          id: "gam_step",
          title: "Generate Activity Materials",
          outputName: "page",
          canonical_step_id: "step_generate_activity_materials",
          override_prompt_body: "Populate materials[] from required_materials[]."
        }
      ]
    },
    overrides || {}
  );
}

function designPageAugmentedPrompt(api) {
  const step = {
    canonical_step_id: "step_design_page",
    canonical_title: "Design Page",
    title: "Design Page"
  };
  const wf = {
    goal: "Learner page",
    desiredOutputs: "Learner-facing page",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: { goal: "Learner page" }
  };
  return api
    .applyWorkflowStepRuntimePromptAugmentations("Assemble learner page.\n", step, wf)
    .trim();
}

const api = loadPrismTestApi();

test("T-032: GAM enrich contract commissions designated page learner-resource closure", () => {
  const block = gamContract.buildGamPageEnrichContractBlock();
  assert.equal(CLOSURE_HEADING, "### Page learner-resource closure");
  assert.match(block, /S78-D04 page learner-resource closure packaging/i);
  assert.match(block, /Page learner-resource closure/);
  assert.match(block, /page_synthesis\.study_tips/i);
  assert.match(block, /2–4 compact bullets/i);
  assert.match(block, /worked answer/i);
  assert.match(block, /Do not write page_synthesis/i);
  assert.match(block, /Honour S78-DP disciplinary warrant/i);
  assert.match(block, /NEVER host ### Page learner-resource closure inside a transfer_prompt/i);
  assert.doesNotMatch(block, /Prefer a consolidation_summary, transfer_prompt/);
  assert.doesNotMatch(block, /final_synthesis|next_steps/i);
});

test("T-032: live GAM V2 Copy prompt includes S78-D04 closure packaging", () => {
  const brief = api.buildGamV2CopyMaterialAuthoringBrief();
  assert.match(brief, /S78-D04 page learner-resource closure/i);
  assert.match(brief, /Page learner-resource closure/);
  assert.match(brief, /study_tips/i);
  assert.match(brief, /Do not put this substance in page_synthesis/i);

  const wf = buildGamV2Workflow();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const gamStep = wf.steps.find((s) => s.id === "gam_step");
  const copy = api.buildWorkflowStepInstructions(gamStep, 3, null);
  assert.match(copy, /S78-D04 page learner-resource closure/i);
  assert.match(copy, /### Page learner-resource closure/);
  assert.doesNotMatch(copy, /final_synthesis|next_steps/i);
});

test("T-032: GAM partial with designated closure section is accepted; page_synthesis study_tips still forbidden on enriched validate", () => {
  const closureBody =
    CLOSURE_HEADING +
    "\n\n- You can now distinguish model setup from interpreting a scoped result.\n" +
    "- Reconnect procedure → warranted claim strength before transferring.\n" +
    "- Try one nearby case with changed constraints — do not look for a worked key.";
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "gam", enriched_by: ["gam"] },
    activities: [
      {
        activity_id: "A4",
        materials: [
          {
            material_id: "A4-M1",
            material_type: "consolidation_summary",
            activity_id: "A4",
            title: "Session consolidation",
            body_format: "markdown",
            body: "## Consolidation\n\nReflect on the sequence.\n\n" + closureBody
          }
        ]
      }
    ]
  };
  const check = gamEnrich.validateGamPartialPageCapture(page);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  const extracted = gamContract.extractPageLearnerResourceClosureBody(
    page.activities[0].materials[0].body
  );
  assert.ok(extracted);
  assert.match(extracted, /distinguish model setup/i);
  assert.doesNotMatch(extracted, /### Page learner-resource closure/);

  const withForbiddenSynthesis = Object.assign({}, page, {
    page_synthesis: {
      study_tips: { body: extracted, format: "markdown" }
    },
    learning_outcomes: [{ outcome_id: "LO1", statement: "x" }],
    episode_plans: [{ episode_id: "EP1", beats: [] }],
    title: "T",
    audience: "a",
    page_profile: {}
  });
  const enrichedCheck = gamEnrich.validateGamEnrichedPage(withForbiddenSynthesis, null);
  assert.equal(enrichedCheck.ok, false);
  assert.ok(
    (enrichedCheck.errors || []).some((e) => /page_synthesis must remain empty/i.test(String(e))),
    enrichedCheck.errors && enrichedCheck.errors.join("; ")
  );
});

test("T-032: Design Page partial transports designated closure; omits when absent; no invent fields", () => {
  const block = designPagePartial.buildDesignPagePartialContractBlock();
  assert.match(block, /TRANSPORT ONLY \(S78-D04\)/i);
  assert.match(block, /### Page learner-resource closure/);
  assert.match(block, /copy that section's body verbatim/i);
  assert.match(block, /Omit study_tips when that designated section is absent/i);
  assert.match(block, /Do not synthesise study_tips/i);
  assert.match(block, /Do not invent final_synthesis or next_steps/i);
  assert.doesNotMatch(block, /must author.*study_tips|author short study_tips/i);

  const thin = thinAssembly.buildLdThinAssemblyCoherencePromptBlock();
  assert.match(thin, /### Page learner-resource closure/);
  assert.match(thin, /omit when none/i);
  assert.match(thin, /knowledge_summary or study_tips synthesis or authoring/i);
});

test("T-032: materials-copy transport cue names designated closure heading", () => {
  const text = materialsCopy.buildLdMaterialsCopyPromptBlock({
    role: "preserve",
    includeMarker: true
  });
  assert.match(text, /Page learner-resource closure/);
  assert.match(text, /study_tips/);
});

test("T-032: live Design Page partial path keeps transport-only study_tips salience", () => {
  const instr = designPageAugmentedPrompt(api);
  assert.match(instr, /LD-DESIGN-PAGE-PARTIAL-CONTRACT \(auto-applied\)/i);
  assert.match(instr, /TRANSPORT ONLY \(S78-D04\)/i);
  assert.match(instr, /### Page learner-resource closure/);
  assert.match(instr, /Omit study_tips when that designated section is absent/i);
  assert.match(instr, /LD-THIN-ASSEMBLY-COHERENCE-CONTRACT \(auto-applied\)/i);
  assert.match(instr, /Do not invent final_synthesis or next_steps fields/i);
  assert.doesNotMatch(instr, /LD-SELF-DIRECTED-RHETORIC \(auto-applied\)/i);
});

test("T-032: Design Page capture still accepts study_tips when supplied; knowledge_summary remains mandatory; omit tips ok", () => {
  const withTips = api.validateDesignPagePartialPageCapture({
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Resource title",
    assembly_state: { current_stage: "design_page", enriched_by: ["design_page"] },
    page_synthesis: {
      knowledge_summary: { body: "Key ideas.", format: "markdown" },
      study_tips: {
        body: "- Consolidate the sequence.\n- Try a lightly changed case.",
        format: "markdown"
      }
    },
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [],
    visual_affordances: []
  });
  assert.equal(withTips.ok, true, withTips.errors && withTips.errors.join("; "));

  const omitTips = api.validateDesignPagePartialPageCapture({
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Resource title",
    assembly_state: { current_stage: "design_page", enriched_by: ["design_page"] },
    page_synthesis: {
      knowledge_summary: { body: "Key ideas.", format: "markdown" }
    },
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [],
    visual_affordances: []
  });
  assert.equal(omitTips.ok, true, omitTips.errors && omitTips.errors.join("; "));
});
