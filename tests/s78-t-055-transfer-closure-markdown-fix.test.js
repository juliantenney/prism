/**
 * S78-T-055 — Fix transfer/closure separation and transfer Markdown rendering.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const gamContract = require(path.join(repoRoot, "lib", "ld-gam-page-enrich-contract.js"));
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  injectLearnerRendererVNextInSandbox
} = require("./prism-vm-lib-bootstrap.js");

const CLOSURE_HEADING = gamContract.PAGE_LEARNER_RESOURCE_CLOSURE_HEADING;
const owenFixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "owen-a1-assembled-shape.json"
);

function loadPrismTestApi(extraLibs) {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
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
    addEventListener() {},
    createElement: () => ({
      value: "",
      textContent: "",
      className: "",
      classList: { add() {}, remove() {}, contains() { return false; }, toggle() { return false; } },
      style: {},
      dataset: {},
      children: [],
      appendChild() {},
      removeChild() {},
      setAttribute() {},
      removeAttribute() {},
      getAttribute() {
        return null;
      },
      addEventListener() {},
      removeEventListener() {},
      focus() {},
      click() {}
    }),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, documentStub.createElement());
      return elementStore.get(id);
    },
    querySelector: () => documentStub.createElement(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem() {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
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
  const libs = Array.isArray(extraLibs) ? extraLibs : [];
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS.concat(libs));
  if (libs.some((lib) => /page-vnext-assemble/.test(lib))) {
    injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
  }
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api };
}

function loadFullPrismTestApi() {
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
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api };
}

function buildGamV2Workflow() {
  return {
    id: "wf-s78-t055-gam",
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
        canonical_step_id: "step_generate_activity_materials"
      }
    ]
  };
}

function cleanTransferAndClosurePage() {
  const page = JSON.parse(fs.readFileSync(owenFixturePath, "utf8"));
  const activity = page.activities[0];
  activity.required_materials = (activity.required_materials || []).concat([
    {
      material_id: "A1-TX",
      type: "transfer_prompt",
      purpose: "Learner transfer production on a changed context.",
      specification: "Short production prompt; no worked answer."
    },
    {
      material_id: "A1-CL",
      type: "consolidation_summary",
      purpose: "Page consolidation vessel.",
      specification: "Host for page learner-resource closure."
    }
  ]);
  activity.materials = (activity.materials || []).concat([
    {
      material_id: "A1-TX",
      material_type: "transfer_prompt",
      activity_id: "A1",
      title: "Transfer: a different poetic vantage",
      body_format: "markdown",
      body:
        "Choose one contemporary conflict poem written by someone without battlefield service.\n\n" +
        "- In 80–120 words, explain how that poet's vantage might shape thematic focus differently from Owen's\n" +
        "- Use the experience→perspective→representation chain\n\n" +
        "Do not invent a model answer key."
    },
    {
      material_id: "A1-CL",
      material_type: "consolidation_summary",
      activity_id: "A1",
      title: "Page consolidation",
      body_format: "markdown",
      body:
        CLOSURE_HEADING +
        "\n\n- Reconnect experience, perspective, and representation before leaving.\n" +
        "- Keep claim strength scoped to the taught model class."
    }
  ]);
  page.page_synthesis = page.page_synthesis || {};
  page.page_synthesis.study_tips = {
    body:
      "- Reconnect experience, perspective, and representation before leaving.\n" +
      "- Keep claim strength scoped to the taught model class.",
    format: "markdown"
  };
  return page;
}

test("T-055 GAM enrich contract forbids transfer_prompt as page-closure host", () => {
  const block = gamContract.buildGamPageEnrichContractBlock();
  assert.match(block, /NEVER host ### Page learner-resource closure inside a transfer_prompt/i);
  assert.match(block, /Prefer a consolidation_summary or culminating closure\/debrief/i);
  assert.match(block, /NOT a transfer_prompt/i);
  assert.doesNotMatch(
    block,
    /Prefer a consolidation_summary, transfer_prompt, or culminating closure/
  );
  assert.match(block, /Do not author boilerplate headings such as ### Transfer task/i);
  assert.match(block, /Do not embed ### Page learner-resource closure/i);
});

test("T-055 live GAM V2 Copy path contains corrected transfer/closure separation", () => {
  const { api } = loadFullPrismTestApi();
  const brief = api.buildGamV2CopyMaterialAuthoringBrief();
  assert.match(brief, /NEVER host this section inside a transfer_prompt/i);
  assert.match(brief, /Prefer consolidation_summary or culminating closure\/debrief/i);
  assert.match(brief, /Do not author ### Transfer task boilerplate/i);
  assert.doesNotMatch(brief, /Prefer consolidation\/transfer\/closure materials/i);

  const wf = buildGamV2Workflow();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const gamStep = wf.steps.find((s) => s.id === "gam_step");
  const copy = api.buildWorkflowStepInstructions(gamStep, 3, null);
  assert.match(copy, /NEVER host this section inside a transfer_prompt/i);
  assert.match(copy, /### Page learner-resource closure/);
  assert.match(copy, /S78-T-041 transfer_prompt/i);
});

test("T-055 Studio enrich draft receives the same canonical transfer/closure rule", () => {
  const { api } = loadFullPrismTestApi();
  assert.equal(typeof api.applyGamPageEnrichPromptBlockToDraftForTest, "function");
  const wf = buildGamV2Workflow();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const draft = api.applyGamPageEnrichPromptBlockToDraftForTest(
    "GAM STUDIO LIBRARY DRAFT",
    {
      title: "Generate Activity Materials",
      canonical_step_id: "step_generate_activity_materials",
      stepCanonicalStepId: "step_generate_activity_materials",
      stepCanonicalTitle: "Generate Activity Materials"
    },
    wf
  );
  assert.match(String(draft || ""), /NEVER host ### Page learner-resource closure inside a transfer_prompt/i);
  assert.match(String(draft || ""), /Prefer a consolidation_summary or culminating closure\/debrief/i);
  assert.doesNotMatch(
    String(draft || ""),
    /Prefer a consolidation_summary, transfer_prompt, or culminating closure/
  );
});
test("T-055 clean fixture: transfer production only; closure in Study tips; block MD in Transfer response", () => {
  const { api } = loadPrismTestApi(["lib/page-vnext-assemble.js"]);
  const page = cleanTransferAndClosurePage();
  const transferBody = page.activities[0].materials.find((m) => m.material_id === "A1-TX").body;
  assert.doesNotMatch(transferBody, /Page learner-resource closure/i);
  assert.doesNotMatch(transferBody, /### Transfer task/i);
  assert.match(transferBody, /experience→perspective→representation/);

  const result = api.renderLearnerPageForTest(page, {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });
  assert.ok(result && !result.error, result && result.error);
  const html = String(result.html || "");

  assert.match(html, /data-composition-moment="transfer"/);
  assert.match(html, /Transfer your learning/);
  assert.match(html, /Transfer response/);
  assert.match(html, /Study tips/i);
  assert.match(html, /Reconnect experience, perspective, and representation/);

  const transferIdx = html.indexOf('data-composition-moment="transfer"');
  const studyIdx = html.lastIndexOf("util-study-tips");
  assert.ok(transferIdx >= 0 && studyIdx > transferIdx, "transfer precedes Study tips");

  const transferSlice = html.slice(transferIdx, studyIdx);
  assert.doesNotMatch(transferSlice, /Page learner-resource closure/i);
  assert.doesNotMatch(transferSlice, /### Transfer task/);
  assert.doesNotMatch(transferSlice, /### Page learner-resource/);
  assert.doesNotMatch(transferSlice, />-\s*In 80–120 words/);
  assert.match(transferSlice, /<ul>/i);
  assert.match(transferSlice, /util-learner-workspace__prompt--block/);
  assert.match(transferSlice, /experience→perspective→representation|contemporary conflict poem/i);

  const studySlice = html.slice(studyIdx);
  assert.match(studySlice, /Reconnect experience, perspective, and representation/);
});

test("T-055 leak fixture: re-export repairs literal ### Markdown; closure text needs GAM regen", () => {
  const { api } = loadPrismTestApi(["lib/page-vnext-assemble.js"]);
  const page = cleanTransferAndClosurePage();
  const transfer = page.activities[0].materials.find((m) => m.material_id === "A1-TX");
  transfer.body =
    "### Transfer task\n\nApply the chain to a changed case.\n\n- Keep claim strength scoped\n\n" +
    CLOSURE_HEADING +
    "\n\n- Consolidate key ideas";

  const result = api.renderLearnerPageForTest(page, {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });
  assert.ok(result && !result.error, result && result.error);
  const html = String(result.html || "");
  const transferIdx = html.indexOf('data-composition-moment="transfer"');
  const studyIdx = html.lastIndexOf("util-study-tips");
  const transferSlice = html.slice(
    transferIdx,
    studyIdx > transferIdx ? studyIdx : transferIdx + 8000
  );

  assert.doesNotMatch(transferSlice, /### Transfer task/);
  assert.doesNotMatch(transferSlice, /### Page learner-resource closure/);
  assert.match(transferSlice, /util-md-heading/);
  assert.match(transferSlice, /Transfer task/);
  // Semantic closure still present until GAM regen — no ad-hoc migration.
  assert.match(transferSlice, /Consolidate key ideas/);
});
