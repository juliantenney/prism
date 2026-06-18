/**
 * Sprint 50 Phase 1b — page.json persistence path (DLA framing → authoritative page rows).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const marxDir = path.join(
  repoRoot,
  "docs/development/sprints/2026-06-19-sprint-49-sp-01-text-pattern/marx-run-artefacts-run2"
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
    querySelector: () => createElementStub(),
    addEventListener: () => {},
    removeEventListener: () => {},
    focus: () => {},
    click: () => {}
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (f) => f } };
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
    Utils: { debounce: (f) => f },
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
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

const api = loadPrismTestApi();
const marxPage = JSON.parse(fs.readFileSync(path.join(marxDir, "page.json"), "utf8"));
const marxDla = JSON.parse(fs.readFileSync(path.join(marxDir, "learning_activities.json"), "utf8"));
const marxDlaJson = JSON.stringify(marxDla);
const marxPageDraftJson = JSON.stringify(marxPage, null, 2);

function learningActivityRows(page) {
  const section = page.sections.find((sec) => sec.section_id === "learning_activities");
  assert.ok(section, "learning_activities section present");
  return Array.isArray(section.content) ? section.content : section.content.activities;
}

function setupMarxWorkflow() {
  api.setSelectedWorkflowIdForTest("wf-marx");
  api.setWorkflowsForTest([
    {
      id: "wf-marx",
      steps: [
        {
          id: "dla",
          title: "Design Learning Activities",
          outputName: "learning_activities",
          canonical_step_id: "step_design_learning_activities"
        },
        {
          id: "page",
          title: "Design Page",
          outputName: "page",
          canonical_step_id: "step_design_page",
          inputBindings: [
            {
              kind: "internal",
              sourceStepId: "dla",
              artifactName: "learning_activities"
            }
          ]
        }
      ]
    }
  ]);
}

function renderPage(page) {
  const result = api.runUtilityPageExportPipelineForTest(page, {
    applyCompositionValidation: false
  });
  assert.equal(result.error, null, result.error || "render failed");
  return result.html;
}

test("Sprint 50 Phase 1b: upstream capture prefers raw DLA when sanitized map is stale", () => {
  setupMarxWorkflow();
  const staleDla = JSON.parse(marxDlaJson);
  delete staleDla.activities[0].activity_preamble;
  api.setWorkflowRunCaptureMapsForTest(
    { dla: JSON.stringify(staleDla) },
    { dla: marxDlaJson }
  );
  const upstreamText = api.readWorkflowRunUpstreamCaptureTextForStepId("dla");
  const upstream = JSON.parse(upstreamText);
  const a1 = upstream.activities.find((row) => row.activity_id === "A1");
  assert.ok(a1.activity_preamble, "raw map authoritative for compose upstream");
  assert.equal(
    api.readWorkflowRunCaptureTextForStepId("dla"),
    JSON.stringify(staleDla),
    "display path still prefers sanitized when present"
  );
});

test("Sprint 50 Phase 1b: page draft without preamble persists merge on captured-page compose", () => {
  setupMarxWorkflow();
  api.setWorkflowRunCaptureMapsForTest({}, { dla: marxDlaJson });
  const stepLi = {
    getAttribute: (name) =>
      name === "data-step-id"
        ? "page"
        : name === "data-input-bindings"
          ? JSON.stringify([
              {
                kind: "internal",
                sourceStepId: "dla",
                artifactName: "learning_activities"
              }
            ])
          : name === "data-canonical-step-id"
            ? "step_design_page"
            : ""
  };
  const result = api.applyPageCompositionValidationForCapturedPage(stepLi, marxPageDraftJson);
  assert.ok(result && result.json, "composed page json returned");
  const composed = JSON.parse(result.json);
  const a1 = learningActivityRows(composed).find((row) => row.activity_id === "A1");
  assert.match(String(a1.activity_preamble || ""), /foundation for the session/i);
  assert.match(String(a1.reasoning_orientation || ""), /structured analytical method/i);
  assert.match(renderPage(composed), /Why this activity/);
});

test("Sprint 50 Phase 1b: recompose after DLA arrives updates saved page capture", () => {
  setupMarxWorkflow();
  const pageDraft = JSON.parse(marxPageDraftJson);
  api.setWorkflowRunCaptureMapsForTest(
    { page: marxPageDraftJson },
    { page: marxPageDraftJson }
  );
  let a1 = learningActivityRows(pageDraft).find((row) => row.activity_id === "A1");
  assert.equal(a1.activity_preamble, undefined, "draft omits preamble");

  api.setWorkflowRunCaptureMapsForTest(
    { page: marxPageDraftJson },
    { page: marxPageDraftJson, dla: marxDlaJson }
  );
  const recomposed = api.recomposeWorkflowPageCapturesFromUpstream();
  assert.equal(recomposed, 1);
  const savedPage = JSON.parse(api.readWorkflowRunUpstreamCaptureTextForStepId("page"));
  a1 = learningActivityRows(savedPage).find((row) => row.activity_id === "A1");
  assert.ok(a1.activity_preamble, "recomposed page capture includes activity_preamble");
  assert.match(renderPage(savedPage), /Why this activity/);
});

test("Sprint 50 Phase 1b: utilities compose persists merged page.json in parsed object", () => {
  setupMarxWorkflow();
  api.setWorkflowRunCaptureMapsForTest({}, { dla: marxDlaJson });
  const page = JSON.parse(marxPageDraftJson);
  api.applyPageCompositionValidationForUtilitiesPage(page, {});
  const a1 = learningActivityRows(page).find((row) => row.activity_id === "A1");
  assert.ok(a1.activity_preamble);
  assert.match(renderPage(page), /Why this activity/);
});
