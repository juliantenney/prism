"use strict";

/**
 * Sprint 68 IMP-014B — render VideoTranscriptTest through production learner pipeline.
 *
 * Usage:
 *   node scripts/capture-imp-014b-videotranscripttest.js
 *   node scripts/capture-imp-014b-videotranscripttest.js --workflow-bundle path/to/export.json
 *   node scripts/capture-imp-014b-videotranscripttest.js --runstate path/to/runstate.json
 *
 * Requires an authoritative assembled page tagged with workflow_id 0d1c12c0-...
 */

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  injectLearnerRendererVNextInSandbox
} = require("../tests/prism-vm-lib-bootstrap.js");

const {
  readVideoTranscriptTestPage,
  resolveVideoTranscriptTestPagePath,
  WORKFLOW_ID,
  WORKFLOW_NAME
} = require("../tests/videotranscripttest-workflow-fixture.js");
const repoRoot = path.resolve(__dirname, "..");
const artefactDir = path.join(
  "docs/development/sprints/2026-07-21-sprint-68-learning-coherence-narrative-flow/artefacts"
);

function parseArgs(argv) {
  const opts = { workflowBundle: null, assembledPage: null, runstate: null };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === "--workflow-bundle" && argv[i + 1]) {
      opts.workflowBundle = path.resolve(argv[i + 1]);
      i += 1;
    } else if (argv[i] === "--assembled-page" && argv[i + 1]) {
      opts.assembledPage = path.resolve(argv[i + 1]);
      i += 1;
    } else if (argv[i] === "--runstate" && argv[i + 1]) {
      opts.runstate = path.resolve(argv[i + 1]);
      i += 1;
    }
  }
  return opts;
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
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/prism/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn, copyText: () => Promise.resolve(true) },
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
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function metricsFromHtml(html) {
  const body = (String(html || "").match(/<body[^>]*>([\s\S]*)<\/body>/i) || [])[1] || html;
  const ids = [...String(html || "").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const momentCounts = {
    orient: (body.match(/data-composition-moment="orient"/g) || []).length,
    learn: (body.match(/data-composition-moment="learn"/g) || []).length,
    do: (body.match(/data-composition-moment="do"/g) || []).length,
    check: (body.match(/data-composition-moment="check"/g) || []).length
  };
  const renderPaths = {};
  (body.match(/data-activity-id="([^"]+)"[^>]*data-render-path="([^"]+)"/g) || []).forEach(
    function (chunk) {
      const activityId = (chunk.match(/data-activity-id="([^"]+)"/) || [])[1];
      const renderPath = (chunk.match(/data-render-path="([^"]+)"/) || [])[1];
      if (activityId) renderPaths[activityId] = renderPath;
    }
  );
  return {
    compositionMode: (html.match(/data-composition-mode="([^"]+)"/) || [])[1] || null,
    composedActivityCount: Number(
      (html.match(/data-composed-activity-count="(\d+)"/) || [])[1] || 0
    ),
    beatsFallbackActivityCount: Number(
      (html.match(/data-beats-fallback-activity-count="(\d+)"/) || [])[1] || 0
    ),
    compositionMoments: Object.values(momentCounts).reduce((sum, n) => sum + n, 0),
    momentCounts: momentCounts,
    textWorkspaces: (body.match(/data-workspace-capability="text_entry"/g) || []).length,
    tableWorkspaces: (body.match(/data-workspace-kind="table_entry"/g) || []).length,
    renderPaths: renderPaths,
    unsupportedTypes: [
      ...new Set(
        (html.match(/data-render-status="unsupported"[^>]*data-material-type="([^"]+)"/g) || [])
          .map((chunk) => (chunk.match(/data-material-type="([^"]+)"/) || [])[1])
          .filter(Boolean)
      )
    ],
    duplicateIdCount: ids.length - new Set(ids).size
  };
}

function activityDiagnostics(page) {
  const selectVariant =
    require("../lib/learner-renderer-vnext/archetype-rules").selectArchetypeVariant;
  return (page.activities || []).map(function (activity) {
    const ep = activity.episode_plan || {};
    const beatSequence = (ep.beats || []).map(function (beat) {
      return String(beat && beat.function || "").trim();
    });
    const variant = selectVariant(ep.archetype, beatSequence);
    return {
      activityId: activity.activity_id,
      title: activity.title,
      archetype: ep.archetype,
      beatSequence: beatSequence,
      variantId: variant ? variant.id : null,
      materialCount: (activity.materials || []).length
    };
  });
}

function resolvePageFromBundle(api, bundlePath) {
  const bundle = JSON.parse(fs.readFileSync(bundlePath, "utf8"));
  const workflows = Array.isArray(bundle.workflows)
    ? bundle.workflows
    : bundle.workflow
      ? [bundle.workflow]
      : [];
  const workflow =
    workflows.find(function (row) {
      return String(row.id || row.workflow_id || "") === WORKFLOW_ID;
    }) ||
    workflows.find(function (row) {
      return String(row.name || row.workflow_name || "").trim() === WORKFLOW_NAME;
    });
  if (!workflow) {
    throw new Error(
      "Workflow bundle does not contain VideoTranscriptTest (" + WORKFLOW_ID + ")"
    );
  }
  api.setWorkflowsForTest(workflows);
  api.setSelectedWorkflowIdForTest(workflow.id || workflow.workflow_id);
  if (bundle.runstate || bundle.workflowRunCapturedOutputs) {
    api.setWorkflowRunCapturedOutputsForTest(
      bundle.runstate || bundle.workflowRunCapturedOutputs
    );
  }
  const captures = api.getWorkflowRunCapturedOutputsForTest();
  const pageCapture =
    captures.page ||
    captures.design_page ||
    captures.learner_page ||
    null;
  if (!pageCapture) {
    throw new Error("Workflow bundle has no assembled page capture");
  }
  const parsed =
    typeof pageCapture === "string" ? JSON.parse(pageCapture) : pageCapture;
  return api.getPageForRenderForTest(parsed, { workflow: workflow });
}

function main() {
  const opts = parseArgs(process.argv);
  const api = loadPrismTestApi();
  let page;
  let sourceLabel;

  if (opts.workflowBundle) {
    page = resolvePageFromBundle(api, opts.workflowBundle);
    sourceLabel = "workflow-bundle:" + opts.workflowBundle;
  } else if (opts.runstate) {
    const { execFileSync } = require("node:child_process");
    execFileSync(
      process.execPath,
      [
        path.join(repoRoot, "scripts/assemble-videotranscripttest-from-runstate.js"),
        "--runstate",
        opts.runstate
      ],
      { stdio: "inherit" }
    );
    const loaded = readVideoTranscriptTestPage();
    page = loaded.page;
    sourceLabel = "runstate:" + opts.runstate;
  } else if (opts.assembledPage) {
    page = JSON.parse(fs.readFileSync(opts.assembledPage, "utf8"));
    sourceLabel = "assembled-page:" + opts.assembledPage;
  } else {
    const fixturePath = resolveVideoTranscriptTestPagePath();
    if (!fixturePath) {
      throw new Error(
        "VideoTranscriptTest authoritative page missing. Provide --runstate, --assembled-page, or capture tests/fixtures/workflows/videotranscripttest-assembled-page.json"
      );
    }
    const loaded = readVideoTranscriptTestPage();
    page = loaded.page;
    sourceLabel = "fixture:" + fixturePath;
  }

  const provenance = page._workflow_provenance || {};
  if (String(provenance.workflow_id || "") !== WORKFLOW_ID) {
    throw new Error(
      "Refusing to render: page is not tagged with VideoTranscriptTest workflow_id " + WORKFLOW_ID
    );
  }

  const diagnostics = {
    workflowId: WORKFLOW_ID,
    workflowName: WORKFLOW_NAME,
    source: sourceLabel,
    activities: activityDiagnostics(page),
    assemblyState: page.assembly_state || null
  };

  const exportResult = api.renderLearnerPageForTest(page, {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });

  if (exportResult.error) {
    diagnostics.renderError = exportResult.error;
    const outJson = path.join(artefactDir, "videotranscripttest-imp-014b-diagnostics.json");
    fs.mkdirSync(artefactDir, { recursive: true });
    fs.writeFileSync(outJson, JSON.stringify(diagnostics, null, 2));
    console.error("Render failed:", exportResult.error);
    process.exit(1);
  }

  const html = exportResult.html || "";
  const metrics = metricsFromHtml(html);
  diagnostics.render = metrics;
  diagnostics.momentCounts = metrics.momentCounts;

  fs.mkdirSync(artefactDir, { recursive: true });
  const htmlPath = path.join(artefactDir, "videotranscripttest-imp-014b-export.html");
  const jsonPath = path.join(artefactDir, "videotranscripttest-imp-014b-diagnostics.json");
  fs.writeFileSync(htmlPath, html);
  fs.writeFileSync(jsonPath, JSON.stringify(diagnostics, null, 2));

  console.log(JSON.stringify({ htmlPath: htmlPath, diagnosticsPath: jsonPath, metrics: metrics }, null, 2));
}

main();
