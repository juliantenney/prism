/**
 * Sprint 38-S — Design Episode Plan as first-class LD workflow step.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);
const templates = require(path.join(repoRoot, "lib", "episode-plan-v1-templates.js"));
const integration = require(path.join(repoRoot, "lib", "episode-plan-dla-integration.js"));
const validation = require(path.join(repoRoot, "lib", "episode-plan-v1-validation.js"));

function extractLdWorkflowPolicy(md) {
  const idx = md.indexOf("### Workflow Policy");
  assert.ok(idx !== -1);
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  const parsed = JSON.parse(md.slice(fence + 7, close).trim());
  return parsed.workflowPolicy;
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, module: { exports: {} }, exports: {} };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  sandbox.globalThis = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  windowStub.PRISM_EPISODE_PLAN_V1_TEMPLATES = templates;
  windowStub.PRISM_EPISODE_PLAN_DLA_INTEGRATION = integration;
  windowStub.PRISM_EPISODE_PLAN_V1_VALIDATION = validation;
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return { api, sandbox };
}

function stepTitles(out) {
  return (out.steps || []).map((s) => String(s.title || "").trim());
}

function indexOfTitle(titles, name) {
  return titles.findIndex((t) => t.toLowerCase() === String(name).toLowerCase());
}

const { api, sandbox } = loadPrismTestApi();
const ldMd = fs.readFileSync(ldPatternsPath, "utf8");
const ldWorkflowPolicy = extractLdWorkflowPolicy(ldMd);

test("LD workflow policy: Design Episode Plan is canonical between LO and DLA", () => {
  const steps = ldWorkflowPolicy.canonicalSteps || [];
  const loIdx = steps.indexOf("Define Learning Outcomes");
  const epIdx = steps.indexOf("Design Episode Plan");
  const dlaIdx = steps.indexOf("Design Learning Activities");
  assert.ok(epIdx !== -1, "canonicalSteps includes Design Episode Plan");
  assert.ok(loIdx < epIdx && epIdx < dlaIdx, "LO → Episode Plan → DLA order in canonicalSteps");
  const dep = ldWorkflowPolicy.dependencies["Design Episode Plan"];
  assert.deepEqual(dep.requires, ["learning_outcomes"]);
  assert.deepEqual(dep.produces, ["episode_plans"]);
  const dlaDep = ldWorkflowPolicy.dependencies["Design Learning Activities"];
  assert.ok((dlaDep.requires || []).includes("episode_plans"));
  const prec = ldWorkflowPolicy.precedenceRules || [];
  assert.ok(
    prec.some((p) => p[0] === "Define Learning Outcomes" && p[1] === "Design Episode Plan")
  );
  assert.ok(
    prec.some((p) => p[0] === "Design Episode Plan" && p[1] === "Design Learning Activities")
  );
});

test("LD heuristics: activity workflow inserts Design Episode Plan before DLA", () => {
  const out = api.applyWorkflowDesignHeuristics(
    {
      steps: [
        { title: "Model Knowledge", role: "" },
        { title: "Define Learning Outcomes", role: "" },
        { title: "Design Learning Activities", role: "" },
        { title: "Generate Activity Materials", role: "" },
        { title: "Design Page", role: "" }
      ]
    },
    {
      selectedDomains: ["general", "learning-design"],
      workflowPolicy: ldWorkflowPolicy,
      stepPatternCatalog: [],
      resolvedBriefFactors: {
        topic: "inflation",
        activities_required: true,
        session_materials: ["page"],
        input_strategy: "generate_from_topic"
      },
      goal: "Design learning activities and a learner page on household inflation impacts.",
      desiredOutputs: "learner-facing page"
    }
  );
  const titles = stepTitles(out);
  const loIdx = indexOfTitle(titles, "Define Learning Outcomes");
  const epIdx = indexOfTitle(titles, "Design Episode Plan");
  const dlaIdx = indexOfTitle(titles, "Design Learning Activities");
  assert.ok(epIdx !== -1, "generated workflow includes Design Episode Plan");
  assert.ok(loIdx < epIdx && epIdx < dlaIdx, "LO → Episode Plan → DLA ordering");
});

test("DLA prompt receives upstream episode_plans when capture exists", () => {
  const lo = {
    learning_outcomes: [
      { id: "LO1", cognitive_level: "understand", statement: "Explain inflation." },
      { id: "LO2", cognitive_level: "apply", statement: "Calculate CPI." }
    ]
  };
  const plans = templates.deriveEpisodePlansFromLearningOutcomes(lo);
  const wf = {
    id: "wf-ep-test",
    steps: [
      { id: "lo_step", title: "Define Learning Outcomes", outputName: "learning_outcomes" },
      {
        id: "ep_step",
        title: "Design Episode Plan",
        outputName: "episode_plans",
        canonical_step_id: "step_design_episode_plan"
      },
      {
        id: "dla_step",
        title: "Design Learning Activities",
        outputName: "learning_activities",
        canonical_step_id: "step_design_learning_activities"
      }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest("wf-ep-test");
  api.setWorkflowRunCapturedOutputsForTest({
    lo_step: JSON.stringify(lo, null, 2),
    ep_step: JSON.stringify(plans, null, 2)
  });

  const draft = api.applyEpisodePlanDlaPopulationPromptBlockToDraft(
    "Design learning activities.",
    {
      stepCanonicalStepId: "step_design_learning_activities",
      stepCanonicalTitle: "Design Learning Activities"
    },
    wf
  );
  assert.match(draft, /population contract \(38S-3/i);
  assert.match(draft, /Upstream episode_plans/i);
  assert.match(draft, /"episode_plans"/);
  assert.match(draft, /"archetype":\s*"understand"/);
});

test("DLA fails population gate when Episode Plan step present but capture missing", () => {
  const wf = {
    id: "wf-ep-missing",
    steps: [
      {
        id: "ep_step",
        title: "Design Episode Plan",
        outputName: "episode_plans",
        canonical_step_id: "step_design_episode_plan"
      },
      {
        id: "dla_step",
        title: "Design Learning Activities",
        outputName: "learning_activities",
        canonical_step_id: "step_design_learning_activities"
      }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest("wf-ep-missing");
  api.setWorkflowRunCapturedOutputsForTest({});
  const plans = api.resolveEpisodePlansForDlaPopulation({ workflow: wf });
  assert.equal(plans, null);
  const enforced = api.applyEpisodePlanPopulationEnforcementToDlaCapture(
    JSON.stringify({ activities: [] }, null, 2),
    { stepCanonicalStepId: "step_design_learning_activities" },
    "dla_step"
  );
  assert.equal(enforced, JSON.stringify({ activities: [] }, null, 2));
  const draftMissing = api.applyEpisodePlanDlaPopulationPromptBlockToDraft(
    "DLA task",
    { stepCanonicalStepId: "step_design_learning_activities" },
    wf
  );
  assert.match(draftMissing, /PF-11: upstream `episode_plans` capture is missing/i);
});

test("deterministic derive replaces prose capture with canonical nested episode_plans JSON", () => {
  const lo = {
    learning_outcomes: [
      { id: "LO1", cognitive_level: "understand", statement: "Explain inflation." }
    ]
  };
  const wf = {
    id: "wf-ep-prose",
    steps: [
      { id: "lo_step", title: "Define Learning Outcomes", outputName: "learning_outcomes" },
      {
        id: "ep_step",
        title: "Design Episode Plan",
        outputName: "episode_plans",
        canonical_step_id: "step_design_episode_plan"
      }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest("wf-ep-prose");
  api.setWorkflowRunCapturedOutputsForTest({
    lo_step: JSON.stringify(lo, null, 2)
  });
  const prose =
    "Episode 1: Learners will understand inflation through explanation and guided practice.";
  const fixed = api.applyEpisodePlanCaptureCanonicalEnforcement(
    prose,
    wf.steps[1],
    "ep_step"
  );
  assert.equal(typeof fixed, "string");
  const parsed = JSON.parse(fixed);
  const check = validation.validateEpisodePlansContainerV1(parsed);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.ok(parsed.episode_plans[0].episode_plan);
  assert.equal(parsed.episode_plans[0].episode_plan.archetype, "understand");
  assert.ok(Array.isArray(parsed.episode_plans[0].episode_plan.beats));
});

test("workflow artefact persistence: capture string parses to object with episode_plan wrapper", () => {
  const lo = {
    learning_outcomes: [
      { id: "LO1", cognitive_level: "apply", statement: "Calculate CPI." }
    ]
  };
  const wf = {
    id: "wf-ep-persist",
    steps: [
      { id: "lo_step", title: "Define Learning Outcomes", outputName: "learning_outcomes" },
      {
        id: "ep_step",
        title: "Design Episode Plan",
        outputName: "episode_plans",
        canonical_step_id: "step_design_episode_plan"
      }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest("wf-ep-persist");
  api.setWorkflowRunCapturedOutputsForTest({
    lo_step: JSON.stringify(lo, null, 2)
  });
  const flatValid = JSON.stringify(
    {
      episode_plans: [
        {
          activity_id: "A1",
          archetype: "apply",
          beats: [{ function: "worked_thinking" }, { function: "guided_practice" }]
        }
      ]
    },
    null,
    2
  );
  const persisted = api.applyEpisodePlanCaptureCanonicalEnforcement(
    flatValid,
    wf.steps[1],
    "ep_step"
  );
  assert.equal(typeof persisted, "string");
  const parsed = JSON.parse(persisted);
  assert.equal(typeof parsed, "object");
  assert.ok(parsed.episode_plans[0].episode_plan);
  assert.equal(parsed.episode_plans[0].episode_plan.archetype, "apply");
  api.setWorkflowRunCapturedOutputsForTest({
    lo_step: JSON.stringify(lo, null, 2),
    ep_step: persisted
  });
  const resolved = api.resolveEpisodePlansForDlaPopulation({ workflow: wf });
  assert.equal(typeof resolved, "object");
  assert.ok(resolved.episode_plans[0].episode_plan);
});

test("canonical enforcement replaces LLM invented taxonomy with frozen V1 derive", () => {
  const lo = {
    learning_outcomes: [
      { id: "LO1", cognitive_level: "understand", statement: "Explain inflation." }
    ]
  };
  const wf = {
    id: "wf-ep-fix",
    steps: [
      { id: "lo_step", title: "Define Learning Outcomes", outputName: "learning_outcomes" },
      {
        id: "ep_step",
        title: "Design Episode Plan",
        outputName: "episode_plans",
        canonical_step_id: "step_design_episode_plan"
      }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest("wf-ep-fix");
  api.setWorkflowRunCapturedOutputsForTest({
    lo_step: JSON.stringify(lo, null, 2)
  });
  const wrong = JSON.stringify(
    {
      episode_plans: [
        {
          activity_id: "A1",
          archetype: "concept_explanation",
          beats: [{ function: "introduce_concept" }]
        }
      ]
    },
    null,
    2
  );
  const fixed = api.applyEpisodePlanCaptureCanonicalEnforcement(
    wrong,
    wf.steps[1],
    "ep_step"
  );
  const parsed = JSON.parse(fixed);
  const check = validation.validateEpisodePlansContainerV1(parsed);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(parsed.episode_plans[0].episode_plan.archetype, "understand");
});

test("legacy workflow without Episode Plan step may use non-canonical LO fallback", () => {
  const lo = {
    learning_outcomes: [{ id: "LO1", cognitive_level: "evaluate", statement: "Judge household strategy." }]
  };
  const wf = {
    id: "wf-legacy",
    steps: [
      { id: "lo_step", title: "Define Learning Outcomes", outputName: "learning_outcomes" },
      {
        id: "dla_step",
        title: "Design Learning Activities",
        outputName: "learning_activities",
        canonical_step_id: "step_design_learning_activities"
      }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest("wf-legacy");
  api.setWorkflowRunCapturedOutputsForTest({
    lo_step: JSON.stringify(lo, null, 2)
  });
  const plans = api.resolveEpisodePlansForDlaPopulation({ workflow: wf });
  assert.ok(plans && Array.isArray(plans.episode_plans));
  assert.equal(plans.source, "learning_outcomes_fallback_non_canonical");
});
