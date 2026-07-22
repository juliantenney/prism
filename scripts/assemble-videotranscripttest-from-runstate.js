"use strict";

/**
 * Assemble and capture the authoritative VideoTranscriptTest page from PRISM runstate.
 *
 * Usage:
 *   node scripts/assemble-videotranscripttest-from-runstate.js --runstate path/to/runstate.json
 *
 * The runstate file must be the JSON object stored at promptr.workflows.runstate.v1
 * (or the single-workflow entry keyed by workflow ID).
 */

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("../tests/prism-vm-lib-bootstrap.js");

const WORKFLOW_ID = "0d1c12c0-ad1c-449f-8ad9-8f90b8f01097";
const WORKFLOW_NAME = "VideoTranscriptTest";
const repoRoot = path.resolve(__dirname, "..");
const outPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "workflows",
  "videotranscripttest-assembled-page.json"
);

function parseArgs(argv) {
  var runstatePath = null;
  var workflowsPath = null;
  for (var i = 2; i < argv.length; i += 1) {
    if (argv[i] === "--runstate" && argv[i + 1]) {
      runstatePath = path.resolve(argv[++i]);
    } else if (argv[i] === "--workflows" && argv[i + 1]) {
      workflowsPath = path.resolve(argv[++i]);
    }
  }
  if (!runstatePath) {
    throw new Error("Missing required --runstate path");
  }
  return { runstatePath: runstatePath, workflowsPath: workflowsPath };
}

function createElementStub() {
  return {
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
  };
}

function loadPrismTestApi() {
  var source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  var sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  var elementStore = new Map();
  var documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  var windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/prism/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem() {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () =>
        Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
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
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function loadRunstateEntry(runstatePath) {
  var raw = JSON.parse(fs.readFileSync(runstatePath, "utf8"));
  if (raw && raw.capturedOutputs) return raw;
  if (raw && raw[WORKFLOW_ID]) return raw[WORKFLOW_ID];
  throw new Error("Runstate file does not contain VideoTranscriptTest entry");
}

function loadWorkflow(workflowsPath) {
  if (!workflowsPath) return { id: WORKFLOW_ID, name: WORKFLOW_NAME };
  var raw = JSON.parse(fs.readFileSync(workflowsPath, "utf8"));
  var workflows = Array.isArray(raw.workflows)
    ? raw.workflows
    : Array.isArray(raw)
      ? raw
      : raw.workflow
        ? [raw.workflow]
        : [];
  var workflow = workflows.find(function (row) {
    return String(row.id || row.workflow_id || "") === WORKFLOW_ID;
  });
  if (!workflow) {
    throw new Error("Workflow export does not contain VideoTranscriptTest");
  }
  return workflow;
}

function main() {
  var opts = parseArgs(process.argv);
  var api = loadPrismTestApi();
  var workflow = loadWorkflow(opts.workflowsPath);
  var runEntry = loadRunstateEntry(opts.runstatePath);

  api.setWorkflowsForTest([workflow]);
  api.setSelectedWorkflowIdForTest(WORKFLOW_ID);
  api.setWorkflowRunCapturedOutputsForTest(runEntry.capturedOutputs || runEntry);

  var captures = api.getWorkflowRunCapturedOutputsForTest();
  var pageRaw =
    captures.page ||
    captures.design_page ||
    captures.learner_page ||
    null;
  if (!pageRaw) {
    throw new Error("Runstate does not contain an assembled page capture");
  }
  var parsed = typeof pageRaw === "string" ? JSON.parse(pageRaw) : pageRaw;
  var assembled = api.resolvePageForRenderOrAssembly(parsed, workflow, {
    captures: runEntry.capturedOutputs || runEntry
  });
  assembled._workflow_provenance = {
    workflow_id: WORKFLOW_ID,
    workflow_name: WORKFLOW_NAME,
    captured_at: new Date().toISOString(),
    source_runstate: path.basename(opts.runstatePath)
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(assembled, null, 2));
  console.log("Wrote " + outPath);
}

main();
