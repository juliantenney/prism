/**
 * S78-T-042 — Learner workspace authoring fidelity (structured template vs bold labels).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const dlaContract = require(path.join(repoRoot, "lib", "ld-dla-page-enrich-contract.js"));
const gamContract = require(path.join(repoRoot, "lib", "ld-gam-page-enrich-contract.js"));
const { parseTemplateSections } = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "parse-template-sections.js"
));
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  injectLearnerRendererVNextInSandbox
} = require("./prism-vm-lib-bootstrap.js");

const owenFixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "owen-a1-assembled-shape.json"
);

const WORKSPACE_MARKER = /S78-T-042/;
const CANONICAL_TEMPLATE_SYNTAX = /\*\*Label:\*\*/;

const CANONICAL_SOLUTION_TEMPLATE_BODY = [
  "**Lagrangian:**",
  "Record the Lagrangian for this constrained case.",
  "",
  "**First-order condition with respect to x:**",
  "Record the first-order condition with respect to x.",
  "",
  "**First-order condition with respect to y:**",
  "Record the first-order condition with respect to y.",
  "",
  "**Relationship obtained by combining the first two conditions:**",
  "Record the relationship obtained by combining those conditions.",
  "",
  "**Candidate value of x:**",
  "Record the candidate value of x."
].join("\n");

const STRANDED_BOLD_BODY = [
  "**Lagrangian**",
  "**First-order condition with respect to x**",
  "**First-order condition with respect to y**",
  "**Candidate value of x**"
].join("\n");

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

function loadExportPrismTestApi() {
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
  runPrismLibScriptsInSandbox(
    sandbox,
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat(["lib/page-vnext-assemble.js"])
  );
  injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api };
}

function buildGamV2Workflow() {
  return {
    id: "wf-s78-t042-gam",
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
  };
}

function pageWithCanonicalTemplateWorkspace() {
  const page = JSON.parse(fs.readFileSync(owenFixturePath, "utf8"));
  const activity = page.activities[0];
  activity.required_materials = (activity.required_materials || []).concat([
    {
      material_id: "A1-M6",
      type: "template",
      purpose: "Structured solution workspace for ordered learner derivation steps.",
      specification:
        "Author as template with successive **Label:** sections for each ordered working step; blank learner response after each label; Depth_floor L3."
    }
  ]);
  activity.materials = (activity.materials || []).concat([
    {
      material_id: "A1-M6",
      material_type: "template",
      activity_id: "A1",
      title: "Solution workspace",
      body_format: "markdown",
      body: CANONICAL_SOLUTION_TEMPLATE_BODY
    }
  ]);
  return page;
}

function pageWithComparisonTable() {
  const page = JSON.parse(fs.readFileSync(owenFixturePath, "utf8"));
  const activity = page.activities[0];
  activity.materials = (activity.materials || []).concat([
    {
      material_id: "A1-M7",
      material_type: "comparison_table",
      activity_id: "A1",
      title: "Perspective comparison",
      body_format: "markdown",
      body:
        "| Criterion | Owen | Later poet |\n| --- | --- | --- |\n| Vantage |  |  |\n| Thematic focus |  |  |"
    }
  ]);
  return page;
}

test("T-042 DLA commissioning requires structured workspace material shape not bold-label scaffolds", () => {
  const commissioning = dlaContract.assembleDlaCanonicalContract().sections.commissioning;
  assert.match(commissioning, WORKSPACE_MARKER);
  assert.match(commissioning, /structured learner workspace fidelity/i);
  assert.match(commissioning, /material_type template/i);
  assert.match(commissioning, CANONICAL_TEMPLATE_SYNTAX);
  assert.match(commissioning, /standalone bold prose labels/i);
  assert.match(commissioning, /comparison\/diagnostic\/completion tables|table-family/i);
  assert.match(commissioning, /Editable mathematical input remains a separate parked capability/i);
  assert.doesNotMatch(commissioning, /Lagrange|shadow price|first-order condition|MathQuill|MathLive/i);
});

test("T-042 GAM enrich contract forbids stranded bold labels and requires **Label:** template syntax", () => {
  const block = gamContract.buildGamPageEnrichContractBlock();
  assert.match(block, /S78-T-042 structured workspace fidelity/i);
  assert.match(block, CANONICAL_TEMPLATE_SYNTAX);
  assert.match(block, /standalone bold lines without the trailing colon/i);
  assert.match(block, /Ordinary inline emphasis/i);
  assert.match(block, /keep the table-family type|Keep genuine tables/i);
  assert.match(block, /do not invent an equation editor/i);
  assert.doesNotMatch(block, /Lagrange|shadow price|MathQuill|MathLive/i);
});

test("T-042 live GAM V2 Copy / buildWorkflowStepInstructions receives workspace-fidelity guidance", () => {
  const { api } = loadFullPrismTestApi();
  const brief = api.buildGamV2CopyMaterialAuthoringBrief();
  assert.match(brief, /S78-T-042 structured workspace fidelity/i);
  assert.match(brief, CANONICAL_TEMPLATE_SYNTAX);
  assert.match(brief, /standalone bold labels without the colon/i);
  assert.match(brief, /Do not invent an equation editor/i);

  const wf = buildGamV2Workflow();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const gamStep = wf.steps.find((s) => s.id === "gam_step");
  const copy = api.buildWorkflowStepInstructions(gamStep, 3, null);
  assert.match(copy, /S78-T-042 structured workspace fidelity/i);
  assert.match(copy, CANONICAL_TEMPLATE_SYNTAX);
  assert.doesNotMatch(copy, /MathQuill|MathLive|equation editor dependency/i);

  const dlaLive = api.assembleLiveDlaCanonicalPrompt(
    { canonical_step_id: "step_design_learning_activities" },
    wf
  );
  assert.match(dlaLive, /S78-T-042 \(commissioning\)/);
  assert.match(dlaLive, CANONICAL_TEMPLATE_SYNTAX);
});

test("T-042 parseTemplateSections recognises canonical **Label:** sections in order", () => {
  const sections = parseTemplateSections(CANONICAL_SOLUTION_TEMPLATE_BODY);
  assert.equal(sections.length, 5);
  assert.deepEqual(
    sections.map((row) => row.label),
    [
      "Lagrangian",
      "First-order condition with respect to x",
      "First-order condition with respect to y",
      "Relationship obtained by combining the first two conditions",
      "Candidate value of x"
    ]
  );
  assert.match(sections[0].prompt, /Record the Lagrangian/i);
});

test("T-042 stranded bold labels without colon do not become template sections", () => {
  const sections = parseTemplateSections(STRANDED_BOLD_BODY);
  assert.equal(sections.length, 0);
});

test("T-042 ordinary inline bold emphasis is not treated as a workspace field", () => {
  const prose =
    "In your paragraph, identify **what the constraint represents** before solving.";
  assert.equal(parseTemplateSections(prose).length, 0);
  assert.equal(
    parseTemplateSections("Study the model. Then identify **key terms** carefully.").length,
    0
  );
});

test("T-042 live vNext export renders canonical template as labelled text_entry workspaces", () => {
  const { api } = loadExportPrismTestApi();
  const result = api.renderLearnerPageForTest(pageWithCanonicalTemplateWorkspace(), {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });
  assert.ok(result && !result.error, result && result.error);
  const html = String(result.html || "");

  assert.match(html, /data-workspace-kind="text_entry"/);
  assert.match(html, /<textarea\b/);
  assert.match(html, /Lagrangian/);
  assert.match(html, /First-order condition with respect to x/);
  assert.match(html, /Candidate value of x/);

  const textareas = html.match(/data-workspace-kind="text_entry"/g) || [];
  assert.ok(textareas.length >= 5, "expected at least five template section workspaces");
  assert.match(html, /a1-m6-section-/i);
  assert.doesNotMatch(html, /MathQuill|MathLive|contenteditable.*math/i);
});

test("T-042 stranded bold-without-colon template body does not fabricate workspaces", () => {
  const page = pageWithCanonicalTemplateWorkspace();
  page.activities[0].materials.find((row) => row.material_id === "A1-M6").body = STRANDED_BOLD_BODY;
  const { api } = loadExportPrismTestApi();
  const result = api.renderLearnerPageForTest(page, {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });
  assert.ok(result && !result.error, result && result.error);
  const html = String(result.html || "");
  // No template_section workspaces bound to the stranded labels.
  assert.doesNotMatch(html, /a1-m6-section-/i);
  assert.doesNotMatch(html, /data-response-part-id="[^"]*lagrangian[^"]*"/i);
  assert.doesNotMatch(html, /data-response-part-id="[^"]*first-order-condition-with-respect-to-x[^"]*"/i);
  // Static Markdown may still show the bold labels as prose.
  assert.match(html, /Solution workspace/);
});

test("T-042 genuine comparison tables remain tables, not templates", () => {
  const { api } = loadExportPrismTestApi();
  const result = api.renderLearnerPageForTest(pageWithComparisonTable(), {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });
  assert.ok(result && !result.error, result && result.error);
  const html = String(result.html || "");
  assert.match(html, /data-material-type="comparison_table"/);
  assert.match(html, /<table\b/i);
  assert.match(html, /Perspective comparison/);
});

test("T-042 domain-general: no Lagrangian-specific production rules; prior S78 markers preserved", () => {
  const dlaText = dlaContract.assembleDlaCanonicalContract().text;
  const gamBlock = gamContract.buildGamPageEnrichContractBlock();
  [dlaText, gamBlock].forEach((text) => {
    assert.match(text, WORKSPACE_MARKER);
    assert.doesNotMatch(text, /Lagrange multiplier|shadow price|g_i\(x\)|FOC wrt/i);
  });
  assert.match(dlaText, /S78-DP/);
  assert.match(dlaText, /S78-T-041/);
  assert.match(gamBlock, /S78-D04/);
  assert.match(gamBlock, /S78-T-041/);
});
