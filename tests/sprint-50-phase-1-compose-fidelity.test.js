/**
 * Sprint 50 Phase 1 — Design Page compose fidelity (authoritative page.json activity rows).
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

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
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

const api = loadPrismTestApi();

const marxPage = JSON.parse(fs.readFileSync(path.join(marxDir, "page.json"), "utf8"));
const marxDla = JSON.parse(fs.readFileSync(path.join(marxDir, "learning_activities.json"), "utf8"));
const marxDlaJson = JSON.stringify(marxDla);

function learningActivityRows(page) {
  const section = page.sections.find((sec) => sec.section_id === "learning_activities");
  assert.ok(section, "learning_activities section present");
  return Array.isArray(section.content) ? section.content : section.content.activities;
}

function setupMarxWorkflowCaptures(captures) {
  api.setSelectedWorkflowIdForTest("wf-marx");
  api.setWorkflowsForTest([
    {
      id: "wf-marx",
      steps: [
        {
          id: "dla",
          title: "Design Learning Activities",
          outputName: "learning_activities"
        },
        { id: "page", title: "Design Page", outputName: "page" }
      ]
    }
  ]);
  api.setWorkflowRunCaptureMapsForTest(captures.sanitized || {}, captures.raw || {});
}

test("Sprint 50: Marx page.json is missing PEL fields before compose (regression anchor)", () => {
  const a1 = learningActivityRows(marxPage).find((row) => row.activity_id === "A1");
  assert.equal(a1.activity_preamble, undefined);
  assert.equal(a1.reasoning_orientation, undefined);
});

test("Sprint 50: compose merges activity_preamble and reasoning_orientation from upstream DLA", () => {
  const page = JSON.parse(JSON.stringify(marxPage));
  api.applyPageCompositionValidationForUtilitiesPage(page, {
    upstreamLearningActivities: marxDla
  });
  const a1 = learningActivityRows(page).find((row) => row.activity_id === "A1");
  assert.match(
    String(a1.activity_preamble || ""),
    /foundation for the session/i
  );
  assert.match(
    String(a1.reasoning_orientation || ""),
    /structured analytical method/i
  );
  assert.match(String(a1.self_explanation_prompt || ""), /worked example clarified/i);
});

test("Sprint 50: upstream resolution reads workflowRunCapturedOutputsRaw when sanitized map is empty", () => {
  setupMarxWorkflowCaptures({ sanitized: {}, raw: { dla: marxDlaJson } });
  const upstream = api.resolveUpstreamLearningActivitiesFromWorkflowCaptures();
  assert.ok(upstream && Array.isArray(upstream.activities));
  const page = JSON.parse(JSON.stringify(marxPage));
  api.applyPageCompositionValidationForUtilitiesPage(page, {});
  const a1 = learningActivityRows(page).find((row) => row.activity_id === "A1");
  assert.ok(a1.activity_preamble, "activity_preamble merged from raw-only DLA capture");
  assert.ok(a1.reasoning_orientation, "reasoning_orientation merged from raw-only DLA capture");
});

test("Sprint 50: captured-page compose uses binding upstream and persists merged framing fields", () => {
  setupMarxWorkflowCaptures({
    sanitized: { dla: marxDlaJson },
    raw: { dla: marxDlaJson }
  });
  const stepLi = {
    getAttribute: (name) =>
      name === "data-input-bindings"
        ? JSON.stringify([
            {
              kind: "internal",
              sourceStepId: "dla",
              artifactName: "learning_activities"
            }
          ])
        : ""
  };
  const rawPage = JSON.stringify(marxPage, null, 2);
  const result = api.applyPageCompositionValidationForCapturedPage(stepLi, rawPage);
  assert.ok(result && result.json, "composed page json returned");
  const composed = JSON.parse(result.json);
  const a1 = learningActivityRows(composed).find((row) => row.activity_id === "A1");
  assert.ok(a1.activity_preamble);
  assert.ok(a1.reasoning_orientation);
  assert.ok(
    api.workflowRunCaptureJsonSemanticallyEquivalent(result.json, rawPage) === false,
    "composed page differs from pre-merge capture"
  );
});

test("Sprint 50: all Marx activities receive activity_preamble after compose", () => {
  const page = JSON.parse(JSON.stringify(marxPage));
  api.applyPageCompositionValidationForUtilitiesPage(page, {
    upstreamLearningActivities: marxDla
  });
  const rows = learningActivityRows(page);
  const dlaIds = marxDla.activities.map((row) => row.activity_id);
  dlaIds.forEach((id) => {
    const row = rows.find((entry) => entry.activity_id === id);
    const upstream = marxDla.activities.find((entry) => entry.activity_id === id);
    assert.ok(row, "page row for " + id);
    if (upstream && upstream.activity_preamble) {
      assert.equal(row.activity_preamble, upstream.activity_preamble);
    }
  });
});
