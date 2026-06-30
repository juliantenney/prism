/**
 * Page episode_plans closure validation + workflow trace.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);
const inflationPagePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "ld-inflation-workshop-page-full.json"
);
const upstreamLaPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "ld-inflation-workshop-upstream-learning-activities.json"
);

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add: () => {},
      remove: () => {},
      contains: () => false,
      toggle: () => false
    },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
    focus: () => {},
    click: () => {}
  };
}

function loadPrismTestApi(extraLibs) {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener: () => {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild: () => {}, removeChild: () => {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem: () => {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL: () => {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, [
    "lib/page-episode-plans-preserve.js",
    "lib/page-gam-materials-preserve.js",
    "lib/sprint38-visual-affordances.js",
    "lib/ld-table-fidelity.js",
    "lib/ld-materials-copy.js",
    "lib/ld-design-page-compose-contract.js",
    "lib/ld-instructional-manifestation-render.js",
    "lib/utility-pedagogical-icons.js",
    "lib/utility-pedagogical-beats.js",
    ...(extraLibs || [])
  ]);
  if (sandbox.PRISM_PAGE_EPISODE_PLANS_PRESERVE) {
    windowStub.PRISM_PAGE_EPISODE_PLANS_PRESERVE = sandbox.PRISM_PAGE_EPISODE_PLANS_PRESERVE;
  }
  if (sandbox.PRISM_PAGE_GAM_MATERIALS_PRESERVE) {
    windowStub.PRISM_PAGE_GAM_MATERIALS_PRESERVE = sandbox.PRISM_PAGE_GAM_MATERIALS_PRESERVE;
  }
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

function extractDesignPagePromptFactory(md) {
  const section = md.match(/## 13\. Design Page[\s\S]*?### Prompt Factory\s*```json\s*([\s\S]*?)\s*```/);
  assert.ok(section, "Design Page Prompt Factory JSON block");
  return JSON.parse(section[1].trim());
}

function inflationEpisodePlans() {
  const beats = [
    { function: "explanation" },
    { function: "worked_thinking" },
    { function: "verification" }
  ];
  return {
    episode_plans: ["A1", "A2", "A3", "A4", "A5"].map((activity_id) => ({
      activity_id,
      episode_plan: { archetype: "understand", beats }
    }))
  };
}

function setupInflationWorkflow(api) {
  const upstreamLa = JSON.parse(fs.readFileSync(upstreamLaPath, "utf8"));
  const plans = inflationEpisodePlans();
  api.setSelectedWorkflowIdForTest("wf-inflation-ep");
  api.setWorkflowsForTest([
    {
      id: "wf-inflation-ep",
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
        },
        {
          id: "page_step",
          title: "Design Page",
          outputName: "page",
          canonical_step_id: "step_design_page",
          inputBindings: [
            { kind: "internal", sourceStepId: "ep_step", artifactName: "episode_plans" },
            { kind: "internal", sourceStepId: "dla_step", artifactName: "learning_activities" }
          ]
        }
      ]
    }
  ]);
  api.setWorkflowRunCaptureMapsForTest(
    {},
    {
      ep_step: JSON.stringify(plans, null, 2),
      dla_step: JSON.stringify(upstreamLa, null, 2)
    }
  );
  return { upstreamLa, plans };
}

const api = loadPrismTestApi();

test("validatePageEpisodePlansClosure: skip when no upstream episode_plans", () => {
  const page = { artifact_type: "page", sections: [] };
  const result = api.validatePageEpisodePlansClosure(page, { upstreamEpisodePlans: null });
  assert.equal(result.outcome, "skip");
});

test("validatePageEpisodePlansClosure: fail when upstream exists but page lacks portable plans", () => {
  const page = JSON.parse(fs.readFileSync(inflationPagePath, "utf8"));
  page.source_artefacts = ["learning_activities", "episode_plans"];
  const plans = inflationEpisodePlans();
  const result = api.validatePageEpisodePlansClosure(page, { upstreamEpisodePlans: plans });
  assert.equal(result.outcome, "fail");
  assert.equal(result.missing_top_level_episode_plans, true);
  assert.ok(result.activities_missing_episode_plan.length >= 5);
  assert.ok(
    result.messages.some((m) => /page\.episode_plans is missing/i.test(m)),
    "must message missing top-level episode_plans"
  );
  assert.ok(
    result.messages.some((m) => /Activity A1/i.test(m)),
    "must identify missing per-activity plan"
  );
});

test("validatePageEpisodePlansClosure: pass when portable plans present on page and activities", () => {
  const page = JSON.parse(fs.readFileSync(inflationPagePath, "utf8"));
  const plans = inflationEpisodePlans();
  const enriched = api.applyComposedPageEpisodePlansPreserve(page, {
    upstreamEpisodePlans: plans,
    upstreamLearningActivities: JSON.parse(fs.readFileSync(upstreamLaPath, "utf8"))
  });
  const result = api.validatePageEpisodePlansClosure(enriched, { upstreamEpisodePlans: plans });
  assert.equal(result.outcome, "pass");
});

test("applyPageCompositionValidationForCapturedPage: workflow trace report", () => {
  setupInflationWorkflow(api);
  const page = JSON.parse(fs.readFileSync(inflationPagePath, "utf8"));
  page.source_artefacts = ["learning_activities", "activity_materials", "episode_plans"];
  const rawPageJson = JSON.stringify(page, null, 2);

  const ldMd = fs.readFileSync(ldPatternsPath, "utf8");
  const factory = extractDesignPagePromptFactory(ldMd);
  const seeded = api.buildSeededStepPromptForWorkflowStep({
    workflowName: "Inflation workshop",
    step: {
      id: "page_step",
      title: "Design Page",
      canonical_step_id: "step_design_page",
      outputName: "page",
      inputBindings: [
        { kind: "internal", sourceStepId: "ep_step", artifactName: "episode_plans" },
        { kind: "internal", sourceStepId: "dla_step", artifactName: "learning_activities" }
      ]
    },
    matchedPattern: { promptFactory: factory }
  });
  const freshAugmented = api.applyWorkflowStepRuntimePromptAugmentations(
    seeded,
    { canonical_step_id: "step_design_page", title: "Design Page", stepOutputName: "page" },
    { id: "wf-inflation-ep" }
  );
  const staleOverride =
    "LD-DESIGN-PAGE-COMPOSE-CONTRACT (auto-applied):\n- Module: LD-DESIGN-PAGE-COMPOSE-CONTRACT | L0–L3 read-only page compose\n- ACTIVITY MEMBERSHIP (hard): every upstream activity_id\n";
  const staleAugmented = api.applyWorkflowStepRuntimePromptAugmentations(
    staleOverride,
    { canonical_step_id: "step_design_page", title: "Design Page", stepOutputName: "page" },
    { id: "wf-inflation-ep" }
  );

  const stepLi = {
    getAttribute: (name) =>
      name === "data-step-id"
        ? "page_step"
        : name === "data-canonical-step-id"
          ? "step_design_page"
          : ""
  };

  const result = api.applyPageCompositionValidationForCapturedPage(stepLi, rawPageJson);
  assert.ok(result && result.json);

  const trace = {
    validator_after_compose: result.episodePlansValidation && result.episodePlansValidation.outcome,
    validator_before_compose:
      result.episodePlansValidationBefore && result.episodePlansValidationBefore.outcome,
    raw_design_page: result.rawEpisodePlansDiagnostic,
    compose_prompt: {
      fresh_has_episode_plan_contract: api.designPageComposeContractIncludesEpisodePlans(
        freshAugmented
      ),
      stale_marker_blocks_episode_plan_contract: api.designPageComposeContractStaleWithoutEpisodePlans(
        staleAugmented
      ),
      stale_override_skips_reappend: api.ldDesignPageComposeAlreadyPresent(staleOverride)
    }
  };

  console.log("\n[PRISM page episode plans workflow trace]\n" + JSON.stringify(trace, null, 2) + "\n");

  assert.equal(trace.validator_before_compose, "fail");
  assert.equal(trace.raw_design_page.raw_has_top_level_episode_plans, false);
  assert.equal(trace.raw_design_page.source_artefacts_lists_episode_plans, true);
  assert.equal(trace.compose_prompt.fresh_has_episode_plan_contract, true);
  assert.equal(trace.compose_prompt.stale_marker_blocks_episode_plan_contract, true);
  assert.equal(trace.compose_prompt.stale_override_skips_reappend, true);
  assert.equal(trace.validator_after_compose, "pass");
});
