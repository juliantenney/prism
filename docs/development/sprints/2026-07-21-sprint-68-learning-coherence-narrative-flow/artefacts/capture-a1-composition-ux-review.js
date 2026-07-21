"use strict";

/**
 * S68-CHK-001 — Capture beats vs moments A1 composition review artefacts.
 * Run: node docs/development/sprints/2026-07-21-sprint-68-learning-coherence-narrative-flow/artefacts/capture-a1-composition-ux-review.js
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

function structuralSummary(html, label) {
  const a1 = extractActivityHtml(html, "A1");
  const momentOrder = [];
  const momentRe = /data-composition-moment="([^"]+)"/g;
  let m;
  while ((m = momentRe.exec(a1)) !== null) {
    momentOrder.push(m[1]);
  }
  return {
    label,
    a1_bytes: a1.length,
    composition_moments: momentOrder,
    beat_sections: countMatches(a1, /data-beat-function="/g),
    beat_functions: [...a1.matchAll(/data-beat-function="([^"]+)"/g)].map((x) => x[1]),
    orientation_beat: /data-beat-function="orientation"/.test(a1),
    explanation_beat: /data-beat-function="explanation"/.test(a1),
    check_beat: /data-beat-function="check_understanding"/.test(a1),
    activity_framing: /util-activity-framing/.test(a1),
    orient_moment: countMatches(a1, /data-composition-moment="orient"/g),
    learn_moment: countMatches(a1, /data-composition-moment="learn"/g),
    do_moment: countMatches(a1, /data-composition-moment="do"/g),
    check_moment: countMatches(a1, /data-composition-moment="check"/g),
    a1_m1: countMatches(a1, /data-material-id="A1-M1"/g),
    a1_m2: countMatches(a1, /data-material-id="A1-M2"/g),
    a1_m3: countMatches(a1, /data-material-id="A1-M3"/g),
    a1_m4: countMatches(a1, /data-material-id="A1-M4"/g),
    workspace: countMatches(a1, /util-learner-workspace__input/g),
    check_details_closed: /<details[^>]*data-reveal-mode="details"(?![^>]*\bopen\b)/.test(a1),
    check_details_open: /<details[^>]*data-reveal-mode="details"[^>]*\bopen\b/.test(a1),
    study_step_1: countMatches(a1, /Study the explanatory text introducing residuals/gi),
    compare_step_3: countMatches(a1, /Compare the sample response with the explanation/gi),
    write_step_5: countMatches(a1, /Write a brief explanation distinguishing homoscedasticity/gi),
    self_explanation_orient: countMatches(a1, /Explain it to yourself/gi)
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

  const beatsPath = path.join(outDir, "heteroscedasticity-a1-beats-mode-export.html");
  const momentsPath = path.join(outDir, "heteroscedasticity-a1-moments-mode-export.html");
  const beatsA1Path = path.join(outDir, "heteroscedasticity-a1-beats-mode-a1-only.html");
  const momentsA1Path = path.join(outDir, "heteroscedasticity-a1-moments-mode-a1-only.html");
  const comparePath = path.join(outDir, "heteroscedasticity-a1-composition-structural-comparison.json");
  const capturePath = path.join(outDir, "heteroscedasticity-a1-composition-ux-review.capture.json");

  fs.writeFileSync(beatsPath, beatsHtml);
  fs.writeFileSync(momentsPath, momentsHtml);
  fs.writeFileSync(beatsA1Path, extractActivityHtml(beatsHtml, "A1"));
  fs.writeFileSync(momentsA1Path, extractActivityHtml(momentsHtml, "A1"));

  const beatsSummary = structuralSummary(beatsHtml, "beats");
  const momentsSummary = structuralSummary(momentsHtml, "moments");
  const comparison = {
    captured_at: new Date().toISOString(),
    reviewer_task: "S68-CHK-001",
    fixture: "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json",
    invocation: {
      beats: 'renderLearnerPageHtml(page, { compositionMode: "beats" })',
      moments: 'renderLearnerPageHtml(page, { compositionMode: "moments" })'
    },
    shell: "composeStandaloneVnextLearnerExportForTest (production export CSS)",
    beats: beatsSummary,
    moments: momentsSummary
  };
  fs.writeFileSync(comparePath, JSON.stringify(comparison, null, 2));

  const capture = {
    ...comparison,
    artefacts: {
      beats_full: path.relative(repoRoot, beatsPath).replace(/\\/g, "/"),
      moments_full: path.relative(repoRoot, momentsPath).replace(/\\/g, "/"),
      beats_a1: path.relative(repoRoot, beatsA1Path).replace(/\\/g, "/"),
      moments_a1: path.relative(repoRoot, momentsA1Path).replace(/\\/g, "/"),
      structural_comparison: path.relative(repoRoot, comparePath).replace(/\\/g, "/")
    }
  };
  fs.writeFileSync(capturePath, JSON.stringify(capture, null, 2));

  console.log(JSON.stringify(capture, null, 2));
}

main();
