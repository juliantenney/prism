"use strict";

/**
 * S68-IMP-008 — Capture beats vs moments A3 composition review artefacts.
 * Run: node docs/development/sprints/2026-07-21-sprint-68-learning-coherence-narrative-flow/artefacts/capture-a3-composition-ux-review.js
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  wireBrowserGlobalThis,
  loadLearnerRendererVNextBrowserInSandbox
} = require("../../../../../tests/prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..");
const outDir = __dirname;
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

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

function loadProductionApi() {
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
  sandbox.document = documentStub;
  sandbox.window = {
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
  sandbox.window.window = sandbox.window;
  wireBrowserGlobalThis(sandbox);
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
  vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, {
    filename: "app.js"
  });
  return {
    api: sandbox.window.__PRISM_TEST_API,
    vnext: sandbox.window.PRISM_LEARNER_RENDERER_VNEXT
  };
}

function extractActivityHtml(html, activityId) {
  const source = String(html || "");
  const marker = 'id="activity-' + activityId + '"';
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) return "";

  const openTagStart = source.lastIndexOf("<article", markerIndex);
  if (openTagStart < 0) return "";

  const tagRe = /<(\/?)article\b[^>]*>/gi;
  tagRe.lastIndex = openTagStart;
  let depth = 0;
  let match;
  while ((match = tagRe.exec(source)) !== null) {
    if (match[1]) depth -= 1;
    else depth += 1;
    if (depth === 0) {
      return source.slice(openTagStart, tagRe.lastIndex);
    }
  }
  return "";
}

function countMatches(source, re) {
  return (String(source).match(re) || []).length;
}

function momentSection(html, kind) {
  const marker = 'data-composition-moment="' + kind + '"';
  const start = html.indexOf(marker);
  if (start < 0) return "";
  const sectionStart = html.lastIndexOf("<section", start);
  const sectionEnd = html.indexOf("</section>", start);
  return sectionStart >= 0 && sectionEnd >= 0
    ? html.slice(sectionStart, sectionEnd + "</section>".length)
    : "";
}

function structuralSummary(html, label) {
  const a3 = extractActivityHtml(html, "A3");
  const learn = momentSection(a3, "learn");
  const doSection = momentSection(a3, "do");
  const momentOrder = [];
  const momentRe = /data-composition-moment="([^"]+)"/g;
  let m;
  while ((m = momentRe.exec(a3)) !== null) {
    momentOrder.push(m[1]);
  }
  return {
    label,
    a3_bytes: a3.length,
    composition_moments: momentOrder,
    beat_sections: countMatches(a3, /data-beat-function="/g),
    beat_functions: [...a3.matchAll(/data-beat-function="([^"]+)"/g)].map((x) => x[1]),
    orient_moment: countMatches(a3, /data-composition-moment="orient"/g),
    learn_moment: countMatches(a3, /data-composition-moment="learn"/g),
    do_moment: countMatches(a3, /data-composition-moment="do"/g),
    check_moment: countMatches(a3, /data-composition-moment="check"/g),
    a3_m1: countMatches(a3, /data-material-id="A3-M1"/g),
    a3_m2: countMatches(a3, /data-material-id="A3-M2"/g),
    a3_m3: countMatches(a3, /data-material-id="A3-M3"/g),
    a3_m4: countMatches(a3, /data-material-id="A3-M4"/g),
    reference_table_blocks: countMatches(learn, /util-material-table-block|<table>/g),
    interactive_table_workspaces: countMatches(a3, /data-workspace-kind="table_entry"/g),
    table_workspace_inputs: countMatches(doSection, /util-learner-table-workspace__input/g),
    reference_table_inputs: countMatches(learn, /<input/g),
    standalone_workspace: countMatches(a3, /util-learner-workspace__input/g),
    textarea_inputs: countMatches(a3, /<textarea/g),
    table_inputs: countMatches(a3, /<input/g),
    static_decision_table_beats: countMatches(a3, /data-material-type="decision_table"/g),
    table_workspace_guidance: countMatches(a3, /util-learner-table-workspace__guidance/g),
    transfer_reflection_prompt: countMatches(a3, /transfer_or_application_task|Identify another economic variable pair/gi)
  };
}

function renderWithShell(api, vnext, fixture, compositionMode) {
  const rendered = vnext.renderLearnerPageHtml(fixture, { compositionMode });
  if (!rendered || rendered.error) {
    throw new Error(compositionMode + " render failed: " + (rendered && rendered.error));
  }
  return api.composeStandaloneVnextLearnerExportForTest(
    rendered.html,
    rendered.modelResult,
    fixture
  );
}

function main() {
  const { api, vnext } = loadProductionApi();
  const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const beatsHtml = renderWithShell(api, vnext, fixture, "beats");
  const momentsHtml = renderWithShell(api, vnext, fixture, "moments");

  const beatsPath = path.join(outDir, "heteroscedasticity-a3-beats-mode-export.html");
  const momentsPath = path.join(outDir, "heteroscedasticity-a3-moments-mode-export.html");
  const beatsA3Path = path.join(outDir, "heteroscedasticity-a3-beats-mode-a3-only.html");
  const momentsA3Path = path.join(outDir, "heteroscedasticity-a3-moments-mode-a3-only.html");
  const comparePath = path.join(outDir, "heteroscedasticity-a3-composition-structural-comparison.json");
  const capturePath = path.join(outDir, "heteroscedasticity-a3-composition-ux-review.capture.json");

  fs.writeFileSync(beatsPath, beatsHtml);
  fs.writeFileSync(momentsPath, momentsHtml);
  fs.writeFileSync(beatsA3Path, extractActivityHtml(beatsHtml, "A3"));
  fs.writeFileSync(momentsA3Path, extractActivityHtml(momentsHtml, "A3"));

  const beatsSummary = structuralSummary(beatsHtml, "beats");
  const momentsSummary = structuralSummary(momentsHtml, "moments");
  const comparison = {
    captured_at: new Date().toISOString(),
    reviewer_task: "S68-IMP-008",
    fixture: "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json",
    invocation: {
      beats: 'renderLearnerPageHtml(page, { compositionMode: "beats" })',
      moments: 'renderLearnerPageHtml(page, { compositionMode: "moments" })'
    },
    shell: "composeStandaloneVnextLearnerExportForTest (production export CSS)",
    notes:
      "A3-M3 decision_table reuses renderTableWorkspace() unchanged in moments mode; beats mode remains static.",
    beats: beatsSummary,
    moments: momentsSummary
  };
  fs.writeFileSync(comparePath, JSON.stringify(comparison, null, 2));

  const capture = {
    ...comparison,
    artefacts: {
      beats_full: path.relative(repoRoot, beatsPath).replace(/\\/g, "/"),
      moments_full: path.relative(repoRoot, momentsPath).replace(/\\/g, "/"),
      beats_a3: path.relative(repoRoot, beatsA3Path).replace(/\\/g, "/"),
      moments_a3: path.relative(repoRoot, momentsA3Path).replace(/\\/g, "/"),
      structural_comparison: path.relative(repoRoot, comparePath).replace(/\\/g, "/")
    }
  };
  fs.writeFileSync(capturePath, JSON.stringify(capture, null, 2));

  console.log(JSON.stringify(capture, null, 2));
}

main();
