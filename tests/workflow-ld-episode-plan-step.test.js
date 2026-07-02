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
const strictJson = require(path.join(repoRoot, "lib", "workflow-artefact-json-strict.js"));

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
  windowStub.PRISM_WORKFLOW_ARTEFACT_JSON_STRICT = strictJson;
  vm.runInContext(
    fs.readFileSync(path.join(repoRoot, "lib", "ld-design-page-compose-contract.js"), "utf8"),
    sandbox,
    { filename: "ld-design-page-compose-contract.js" }
  );
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
  const epStep = out.steps[epIdx];
  assert.equal(
    String(epStep.outputName || "").trim(),
    "episode_plans",
    "Design Episode Plan step must produce episode_plans outputName"
  );
  assert.equal(
    String(epStep.canonical_step_id || "").trim(),
    "step_design_episode_plan",
    "Design Episode Plan step must carry canonical_step_id from pack"
  );
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
  assert.match(draftMissing, /Upstream episode_plans \(required — not embedded\)/i);
  assert.match(draftMissing, /Do not emit PF-11 solely because this prompt block omits an inline episode_plans JSON embed/i);
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

test("DLA resolves episode_plans when Design Episode Plan capture exists but outputName unset", () => {
  const lo = {
    learning_outcomes: [
      { id: "LO1", cognitive_level: "understand", statement: "Explain inflation." }
    ]
  };
  const plans = templates.deriveEpisodePlansFromLearningOutcomes(lo);
  const wf = {
    id: "wf-ep-no-oname",
    steps: [
      { id: "lo_step", title: "Define Learning Outcomes", outputName: "learning_outcomes" },
      {
        id: "ep_step",
        title: "Design Episode Plan",
        outputName: "",
        canonical_step_id: ""
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
  api.setSelectedWorkflowIdForTest("wf-ep-no-oname");
  api.setWorkflowRunCapturedOutputsForTest({
    lo_step: JSON.stringify(lo, null, 2),
    ep_step: JSON.stringify(plans, null, 2)
  });

  const resolved = api.resolveEpisodePlansForDlaPopulation({ workflow: wf });
  assert.ok(resolved && Array.isArray(resolved.episode_plans));
  assert.equal(resolved.episode_plans[0].episode_plan.archetype, "understand");

  const draft = api.applyEpisodePlanDlaPopulationPromptBlockToDraft(
    "Design learning activities.",
    {
      stepCanonicalStepId: "step_design_learning_activities",
      stepCanonicalTitle: "Design Learning Activities"
    },
    wf
  );
  assert.doesNotMatch(draft, /PF-11: upstream `episode_plans` capture is missing/i);
  assert.match(draft, /Upstream episode_plans/i);
});

test("DLA resolver accepts nested/wrapped episode_plans capture shapes", () => {
  const lo = {
    learning_outcomes: [
      { id: "LO1", cognitive_level: "understand", statement: "Explain inflation." }
    ]
  };
  const plans = templates.deriveEpisodePlansFromLearningOutcomes(lo);
  const baseRows = plans.episode_plans;
  const wf = {
    id: "wf-ep-nested-shapes",
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
  api.setSelectedWorkflowIdForTest("wf-ep-nested-shapes");

  const captureShapes = [
    { label: "shallow episode_plans[]", payload: { episode_plans: baseRows } },
    {
      label: "episode_plans.content.episode_plans",
      payload: { episode_plans: { content: { episode_plans: baseRows } } }
    },
    { label: "content.episode_plans", payload: { content: { episode_plans: baseRows } } },
    {
      label: "nested workflow wrapper",
      payload: { result: { output: { artefact: { content: { episode_plans: baseRows } } } } }
    },
    {
      label: "keyed map wrapper",
      payload: {
        output: {
          episode_plans: {
            LO1: Object.assign({}, baseRows[0], { activity_id: "LO1" })
          }
        }
      }
    }
  ];

  captureShapes.forEach((shape) => {
    api.setWorkflowRunCapturedOutputsForTest({
      ep_step: JSON.stringify(shape.payload, null, 2)
    });
    const resolved = api.resolveEpisodePlansForDlaPopulation({ workflow: wf });
    assert.ok(resolved && Array.isArray(resolved.episode_plans), shape.label + " resolved");
    assert.ok(resolved.episode_plans.length > 0, shape.label + " has rows");
    const first = resolved.episode_plans[0] || {};
    assert.ok(
      String(first.activity_id || first.episode_id || "").trim(),
      shape.label + " preserves activity/episode identifier"
    );
    if (Array.isArray(first.mapped_learning_outcome_ids) && first.mapped_learning_outcome_ids.length) {
      assert.ok(
        first.mapped_learning_outcome_ids.includes("LO1"),
        shape.label + " preserves LO mapping metadata"
      );
    }
    assert.equal(
      String(first.episode_plan.archetype || "").trim(),
      "understand",
      shape.label + " preserves archetype"
    );
    assert.ok(
      Array.isArray(first.episode_plan.beats) && first.episode_plan.beats.length > 0,
      shape.label + " preserves beats"
    );
  });
});

test("DLA resolver still reports PF-11 when episode_plans are genuinely missing", () => {
  const wf = {
    id: "wf-ep-missing-nested",
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
  api.setSelectedWorkflowIdForTest("wf-ep-missing-nested");
  api.setWorkflowRunCapturedOutputsForTest({
    ep_step: JSON.stringify({ result: { output: { artefact: { content: { not_episode_plans: [] } } } } })
  });
  const diag = api.resolveEpisodePlansForDlaPopulation({ workflow: wf, diagnostic: true });
  assert.equal(diag.episodePlans, null);
  assert.match(String(diag.reason || ""), /missing_capture|invalid_or_empty_capture/);
  const draftMissing = api.applyEpisodePlanDlaPopulationPromptBlockToDraft(
    "DLA task",
    { stepCanonicalStepId: "step_design_learning_activities" },
    wf
  );
  assert.match(draftMissing, /Upstream episode_plans \(required — not embedded\)/i);
  assert.match(draftMissing, /Do not emit PF-11 solely because this prompt block omits an inline episode_plans JSON embed/i);
});

test("DLA resolver falls back to capture-shape scan when EP step metadata is non-canonical", () => {
  const lo = {
    learning_outcomes: [
      { id: "LO1", cognitive_level: "understand", statement: "Explain inflation." }
    ]
  };
  const plans = templates.deriveEpisodePlansFromLearningOutcomes(lo);
  const wf = {
    id: "wf-ep-shape-fallback",
    steps: [
      {
        id: "mystery_ep_step",
        title: "Episode choreography custom",
        outputName: "",
        canonical_step_id: ""
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
  api.setSelectedWorkflowIdForTest("wf-ep-shape-fallback");
  api.setWorkflowRunCapturedOutputsForTest({
    mystery_ep_step: JSON.stringify(
      {
        result: {
          output: {
            artefact: {
              content: { episode_plans: plans.episode_plans }
            }
          }
        }
      },
      null,
      2
    )
  });
  const resolved = api.resolveEpisodePlansForDlaPopulation({ workflow: wf });
  assert.ok(resolved && Array.isArray(resolved.episode_plans), "fallback should resolve episode_plans");
  assert.equal(
    String(resolved.episode_plans[0].episode_plan.archetype || "").trim(),
    "understand"
  );
});

test("suggestWorkflowOutputNameForStepTitle uses policy produces when pattern missing", () => {
  const name = api.suggestWorkflowOutputNameForStepTitle(
    "Design Episode Plan",
    [],
    ldWorkflowPolicy
  );
  assert.equal(name, "episode_plans");
});

test("PF-11 diagnostic trace records missing capture when Episode Plan step has no sync", () => {
  const wf = {
    id: "wf-pf11-trace",
    steps: [
      {
        id: "ep_step",
        title: "Design Episode Plan",
        outputName: "",
        canonical_step_id: ""
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
  api.setSelectedWorkflowIdForTest("wf-pf11-trace");
  api.setWorkflowRunCapturedOutputsForTest({});
  const trace = api.emitPf11DlaUpstreamDiagnosticTrace(
    {
      stepCanonicalStepId: "step_design_learning_activities",
      stepCanonicalTitle: "Design Learning Activities",
      stepOutputName: "learning_activities"
    },
    wf,
    { reason: "test_missing_capture" }
  );
  assert.ok(trace);
  assert.equal(trace.pf11_emit_reason, "test_missing_capture");
  assert.equal(trace.resolver.resolveEpisodePlansForDlaPopulation.reason, "missing_capture");
  assert.equal(trace.workflow_has_design_episode_plan_step, true);
  const epRow = trace.prior_steps_in_run_order.find(function (row) {
    return row.title === "Design Episode Plan";
  });
  assert.ok(epRow);
  assert.equal(epRow.workflowStepProducesArtefact_episode_plans, true);
  assert.equal(epRow.capture_state_exists, false);
});

test("buildWorkflowStepInstructions chains episode_plans capture into DLA copy text", () => {
  const lo = {
    learning_outcomes: [
      { id: "LO1", cognitive_level: "understand", statement: "Explain inflation." }
    ]
  };
  const plans = {
    episode_plans: [
      {
        activity_id: "LO1",
        episode_plan: {
          archetype: "understand",
          beats: [
            { function: "explanation" },
            { function: "worked_thinking" },
            { function: "verification" }
          ]
        }
      }
    ]
  };
  const wf = {
    id: "wf-chain-dla",
    steps: [
      { id: "lo_step", title: "Define Learning Outcomes", outputName: "learning_outcomes" },
      {
        id: "ep_step",
        title: "Design Episode Plan",
        outputName: "",
        canonical_step_id: ""
      },
      {
        id: "dla_step",
        title: "Design Learning Activities",
        outputName: "learning_activities",
        canonical_step_id: "step_design_learning_activities",
        notes: "Populate learning activities from upstream episode plans.",
        override_prompt_body: "Design learning activities from the episode plan.",
        prompt_source_type: "local_override"
      }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest("wf-chain-dla");
  api.setWorkflowRunCapturedOutputsForTest({
    lo_step: JSON.stringify(lo, null, 2),
    ep_step: JSON.stringify(plans, null, 2)
  });

  const bindings = api.ensureDlaEpisodePlanInputBindingsForSteps(wf.steps);
  const dlaBindings = bindings.find((s) => s.id === "dla_step").inputBindings || [];
  assert.ok(
    dlaBindings.some(
      (b) => b.kind === "internal" && b.sourceStepId === "ep_step" && b.artifactName === "episode_plans"
    ),
    "DLA step must bind episode_plans from Design Episode Plan"
  );

  const instr = api.buildWorkflowStepInstructions(wf.steps[2], 2, null);
  assert.match(instr, /Upstream artefact "episode_plans"/);
  assert.match(instr, /workflow capture; use this text verbatim/);
  assert.match(instr, /"activity_id":\s*"LO1"/);
  assert.match(instr, /Upstream episode_plans/i);
  assert.doesNotMatch(instr, /PF-11: missing episode_plans upstream/i);
  assert.doesNotMatch(instr, /PF-11: upstream `episode_plans` capture is missing/i);
});

test("ensureEpisodePlanInputBindingsForSteps binds episode_plans into Design Page step", () => {
  const plans = {
    episode_plans: [
      {
        activity_id: "A1",
        episode_plan: {
          archetype: "analyse",
          beats: [
            { function: "explanation" },
            { function: "worked_thinking" },
            { function: "verification" }
          ]
        }
      }
    ]
  };
  const wf = {
    id: "wf-chain-page",
    steps: [
      {
        id: "ep_step",
        title: "Design Episode Plan",
        outputName: "episode_plans",
        canonical_step_id: "step_design_episode_plan"
      },
      {
        id: "page_step",
        title: "Design Page",
        outputName: "page",
        canonical_step_id: "step_design_page",
        override_prompt_body: "Assemble the learner page from upstream artefacts.",
        prompt_source_type: "local_override"
      }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest("wf-chain-page");
  api.setWorkflowRunCapturedOutputsForTest({
    ep_step: JSON.stringify(plans, null, 2)
  });

  const bindings = api.ensureEpisodePlanInputBindingsForSteps(wf.steps);
  const pageBindings = bindings.find((s) => s.id === "page_step").inputBindings || [];
  assert.ok(
    pageBindings.some(
      (b) => b.kind === "internal" && b.sourceStepId === "ep_step" && b.artifactName === "episode_plans"
    ),
    "Design Page step must bind episode_plans from Design Episode Plan"
  );

  const instr = api.buildWorkflowStepInstructions(wf.steps[1], 1, null);
  assert.match(instr, /Upstream artefact "episode_plans"/);
  assert.match(instr, /"archetype":\s*"analyse"/);
  assert.match(instr, /EPISODE PLANS \(portable page schema/i);
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

function extractEpisodePlanPromptFactory() {
  const md = fs.readFileSync(ldPatternsPath, "utf8");
  const re =
    /## 11\. Design Episode Plan[\s\S]*?### Prompt Factory\s*```json\s*([\s\S]*?)\s*```/;
  const m = md.match(re);
  assert.ok(m, "Design Episode Plan Prompt Factory");
  return JSON.parse(m[1].trim());
}

function extractDlaPromptFactory() {
  const md = fs.readFileSync(ldPatternsPath, "utf8");
  const idx = md.indexOf("## 5. Design Learning Activities");
  assert.ok(idx !== -1, "Design Learning Activities section");
  const rest = md.slice(idx);
  const pfIdx = rest.indexOf("### Prompt Factory");
  const jstart = rest.indexOf("```json", pfIdx);
  const jend = rest.indexOf("```", jstart + 7);
  return JSON.parse(rest.slice(jstart + 7, jend).trim());
}

test("Design Episode Plan pack requires pretty-printed fenced JSON output", () => {
  const factory = extractEpisodePlanPromptFactory();
  assert.match(factory.promptTemplate, /Pretty-print JSON with 2-space indentation/i);
  assert.match(factory.promptTemplate, /never minified single-line JSON/i);
  assert.match(factory.promptTemplate, /Return ONLY one markdown fenced JSON block/i);
  assert.match(factory.promptTemplate, /complete valid JSON only/i);
});

test("Design Episode Plan runtime prompt appends strict output contract", () => {
  const factory = extractEpisodePlanPromptFactory();
  const step = {
    canonical_step_id: "step_design_episode_plan",
    title: "Design Episode Plan",
    outputName: "episode_plans",
    override_prompt_body: factory.promptTemplate,
    prompt_source_type: "local_override"
  };
  const resolved = api.resolveStepPromptText(step, { id: "wf-ep-fmt" });
  assert.match(resolved.text, /Output contract \(strict — fenced JSON block only\)/i);
  assert.match(resolved.text, /Pretty-print JSON with 2-space indentation/i);
  assert.match(resolved.text, /Do NOT emit minified single-line JSON/i);
  assert.match(resolved.text, /"activity_id": "LO1"/);
});

test("final-sanitised DLA pack (38S) injects authoritative upstream episode_plans on copy", () => {
  const factory = extractDlaPromptFactory();
  assert.match(factory.promptTemplate, /upstream episode_plans/i);
  assert.doesNotMatch(factory.promptTemplate, /### Upstream episode_plans/i);

  const lo = {
    learning_outcomes: [
      { id: "LO1", cognitive_level: "understand", statement: "Explain inflation." }
    ]
  };
  const plans = templates.deriveEpisodePlansFromLearningOutcomes(lo);
  const seeded = api.buildSeededStepPromptForWorkflowStep({
    workflowName: "Inflation",
    step: {
      id: "dla_step",
      title: "Design Learning Activities",
      canonical_step_id: "step_design_learning_activities",
      outputName: "learning_activities"
    },
    matchedPattern: { promptFactory: factory }
  });
  assert.match(seeded, /upstream episode_plans/i);
  assert.doesNotMatch(
    seeded,
    /### Upstream episode_plans/i,
    "pack prose must not false-trigger upstream-section dedup"
  );

  const wf = {
    id: "wf-38s-final-dla-copy",
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
        canonical_step_id: "step_design_learning_activities",
        override_prompt_body: seeded,
        prompt_source_type: "local_override"
      }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest("wf-38s-final-dla-copy");
  api.setWorkflowRunCapturedOutputsForTest({
    lo_step: JSON.stringify(lo, null, 2),
    ep_step: JSON.stringify(plans, null, 2)
  });

  const instr = api.buildWorkflowStepInstructions(wf.steps[2], 2, null);
  assert.match(instr, /Upstream artefact "episode_plans"/);
  assert.match(instr, /### Upstream episode_plans \(authoritative/i);
  assert.match(instr, /"episode_plans"\s*:\s*\[/);
  assert.doesNotMatch(instr, /PF-11: missing episode_plans upstream/i);
  assert.doesNotMatch(instr, /PF-11: upstream `episode_plans` capture is missing/i);
});

test("DLA resolver uses canonical derive when EP capture fails V1 but LO exists", () => {
  const lo = {
    learning_outcomes: [
      { id: "LO1", cognitive_level: "understand", statement: "Explain inflation." }
    ]
  };
  const invalidEp = JSON.stringify(
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
  const wf = {
    id: "wf-ep-v1-fail",
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
        canonical_step_id: "step_design_learning_activities",
        override_prompt_body: "Populate learning activities.",
        prompt_source_type: "local_override"
      }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest("wf-ep-v1-fail");
  api.setWorkflowRunCapturedOutputsForTest({
    lo_step: JSON.stringify(lo, null, 2),
    ep_step: invalidEp
  });

  const diag = api.resolveEpisodePlansForDlaPopulation({ workflow: wf, diagnostic: true });
  assert.equal(diag.reason, "canonical_derive_fallback");
  assert.equal(diag.primary_fail_reason, "v1_validation_failed");
  assert.ok(diag.episodePlans && Array.isArray(diag.episodePlans.episode_plans));
  assert.match(diag.episodePlans.episode_plans[0].episode_plan.archetype, /understand/);

  const instr = api.buildWorkflowStepInstructions(wf.steps[2], 2, null);
  assert.match(instr, /"episode_plans" from step "Design Episode Plan"/);
  assert.match(instr, /### Upstream episode_plans \(authoritative/i);
  assert.doesNotMatch(instr, /PF-11: missing episode_plans upstream/i);
  assert.doesNotMatch(instr, /### Upstream episode_plans \(required — missing\)/i);
});

test("manual DLA copy refreshes stale persisted override from live catalog pack", () => {
  const factory = extractDlaPromptFactory();
  const staleOverride = [
    "Context:",
    "You are provided with learning_outcomes (and optionally knowledge_model or learning_content).",
    "",
    "Task:",
    "Design executable learning_activities that are directly runnable in teaching delivery.",
    "",
    "Instructional function planning (IFP — internal reasoning only):",
    "- IFP-00 SEQUENCE: collect mapped_learning_outcomes; replan IFP-00 A–K before JSON",
    "- IFP-01 ARCHETYPE SELECTION (38I-3 LO-ARC): primary_archetype = max cognitive demand",
    "- DLA-WB-25 (38J-3 session arc): document activity_index fade in delivery_notes — ARC-01..06"
  ].join("\n");

  api.setWorkflowStepPatternCatalogForTest([
    {
      title: "Design Learning Activities",
      canonicalStepId: "step_design_learning_activities",
      promptFactory: factory
    }
  ]);
  assert.ok(
    api.isStaleCatalogSeededStepOverride(staleOverride, factory.promptTemplate),
    "pre-38S-final override must be detected as stale"
  );

  const lo = {
    learning_outcomes: [
      { id: "LO1", cognitive_level: "understand", statement: "Explain inflation." }
    ]
  };
  const plans = templates.deriveEpisodePlansFromLearningOutcomes(lo);
  const wf = {
    id: "wf-stale-dla-copy",
    name: "Inflation",
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
        canonical_step_id: "step_design_learning_activities",
        override_prompt_body: staleOverride,
        prompt_source_type: "local_override"
      }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest("wf-stale-dla-copy");
  api.setWorkflowRunCapturedOutputsForTest({
    lo_step: JSON.stringify(lo, null, 2),
    ep_step: JSON.stringify(plans, null, 2)
  });

  const refreshed = api.resolveLiveCatalogStepPromptBody(wf.steps[2], wf);
  assert.ok(refreshed.length > staleOverride.length);
  assert.match(refreshed, /OBLIGATION POPULATION \(38S/i);
  assert.doesNotMatch(refreshed, /IFP-00 SEQUENCE/i);
  assert.doesNotMatch(refreshed, /IFP-01 ARCHETYPE SELECTION/i);
  assert.doesNotMatch(refreshed, /DLA-WB-25/i);

  const instr = api.buildWorkflowStepInstructions(wf.steps[2], 2, null);
  assert.match(instr, /OBLIGATION POPULATION \(38S/i);
  assert.doesNotMatch(instr, /IFP-00 SEQUENCE/i);
  assert.doesNotMatch(instr, /IFP-01 ARCHETYPE SELECTION/i);
  assert.doesNotMatch(instr, /DLA-WB-25/i);
  assert.doesNotMatch(instr, /Design executable learning_activities that are directly runnable/i);
  assert.match(instr, /### Upstream episode_plans \(authoritative/i);
  assert.doesNotMatch(instr, /PF-11: missing episode_plans upstream/i);
  assert.ok(
    instr.length < 28000,
    "manual copy must not balloon to pre-sanitisation ~33k; got " + instr.length
  );
});

test("DLA prompt injects authoritative upstream section when pack mentions upstream episode_plans", () => {
  const lo = {
    learning_outcomes: [
      { id: "LO1", cognitive_level: "understand", statement: "Explain inflation." }
    ]
  };
  const plans = templates.deriveEpisodePlansFromLearningOutcomes(lo);
  const wf = {
    id: "wf-ep-pack-mention",
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
  api.setSelectedWorkflowIdForTest("wf-ep-pack-mention");
  api.setWorkflowRunCapturedOutputsForTest({
    lo_step: JSON.stringify(lo, null, 2),
    ep_step: JSON.stringify(plans, null, 2)
  });

  const packDraft =
    "Instructional function planning: upstream episode_plans owns archetype and beat order.";
  const draft = api.applyEpisodePlanDlaPopulationPromptBlockToDraft(
    packDraft,
    {
      stepCanonicalStepId: "step_design_learning_activities",
      stepCanonicalTitle: "Design Learning Activities"
    },
    wf
  );
  assert.match(draft, /### Upstream episode_plans/i);
  assert.match(draft, /"episode_plans"/);
  assert.doesNotMatch(draft, /PF-11: upstream `episode_plans` capture is missing/i);
});

test("Design Episode Plan copy instructions include STEP N OUTPUT footer outside fenced JSON", () => {
  const factory = extractEpisodePlanPromptFactory();
  const step = {
    id: "ep_copy",
    canonical_step_id: "step_design_episode_plan",
    title: "Design Episode Plan",
    outputName: "episode_plans",
    override_prompt_body: factory.promptTemplate,
    prompt_source_type: "local_override"
  };
  const instr = api.buildWorkflowStepInstructions(step, 2);
  assert.match(instr, /Copilot output contract: return one pretty-printed fenced JSON block/i);
  assert.match(instr, /STEP\s+3\s+OUTPUT:\s+episode_plans/i);
  assert.doesNotMatch(instr, /At the end of your answer, restate the final output/i);
});
