"use strict";

/**
 * S68-IMP-009 — Capture beats vs moments A4 composition review artefacts.
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
    if (depth === 0) return source.slice(openTagStart, tagRe.lastIndex);
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
  const a4 = extractActivityHtml(html, "A4");
  const doSection = momentSection(a4, "do");
  const momentOrder = [];
  const momentRe = /data-composition-moment="([^"]+)"/g;
  let m;
  while ((m = momentRe.exec(a4)) !== null) momentOrder.push(m[1]);

  const promptQuestions = countMatches(a4, /What changes in the residuals|Which regression assumption|How can standard errors|confidence intervals|research conclusion/gi);

  return {
    label,
    a4_bytes: a4.length,
    composition_moments: momentOrder,
    beat_sections: countMatches(a4, /data-beat-function="/g),
    beat_functions: [...a4.matchAll(/data-beat-function="([^"]+)"/g)].map((x) => x[1]),
    a4_m1: countMatches(a4, /data-material-id="A4-M1"/g),
    a4_m2: countMatches(a4, /data-material-id="A4-M2"/g),
    a4_m3: countMatches(a4, /data-material-id="A4-M3"/g),
    a4_m4: countMatches(a4, /data-material-id="A4-M4"/g),
    prompt_set_items: countMatches(a4, /util-prompt-set/g),
    prompt_question_markers: promptQuestions,
    free_text_workspaces: countMatches(a4, /data-workspace-capability="text_entry"/g),
    free_text_controls: countMatches(a4, /util-learner-workspace__input/g),
    table_workspaces: countMatches(a4, /data-workspace-kind="table_entry"/g),
    duplicated_prompt_set_material: (a4.match(/data-material-id="A4-M3"/g) || []).length,
    check_guidance: countMatches(a4, /Complete your response first/i)
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

  const beatsPath = path.join(outDir, "heteroscedasticity-a4-beats-mode-export.html");
  const momentsPath = path.join(outDir, "heteroscedasticity-a4-moments-mode-export.html");
  const beatsA4Path = path.join(outDir, "heteroscedasticity-a4-beats-mode-a4-only.html");
  const momentsA4Path = path.join(outDir, "heteroscedasticity-a4-moments-mode-a4-only.html");
  const comparePath = path.join(outDir, "heteroscedasticity-a4-composition-structural-comparison.json");
  const capturePath = path.join(outDir, "heteroscedasticity-a4-composition-ux-review.capture.json");

  fs.writeFileSync(beatsPath, beatsHtml);
  fs.writeFileSync(momentsPath, momentsHtml);
  fs.writeFileSync(beatsA4Path, extractActivityHtml(beatsHtml, "A4"));
  fs.writeFileSync(momentsA4Path, extractActivityHtml(momentsHtml, "A4"));

  const comparison = {
    captured_at: new Date().toISOString(),
    reviewer_task: "S68-IMP-009",
    fixture: "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json",
    notes:
      "A4-M3 prompt_set renders structurally; one combined text_entry workspace for the chain-of-effects response.",
    beats: structuralSummary(beatsHtml, "beats"),
    moments: structuralSummary(momentsHtml, "moments")
  };
  fs.writeFileSync(comparePath, JSON.stringify(comparison, null, 2));
  fs.writeFileSync(
    capturePath,
    JSON.stringify(
      {
        ...comparison,
        artefacts: {
          beats_full: path.relative(repoRoot, beatsPath).replace(/\\/g, "/"),
          moments_full: path.relative(repoRoot, momentsPath).replace(/\\/g, "/"),
          beats_a4: path.relative(repoRoot, beatsA4Path).replace(/\\/g, "/"),
          moments_a4: path.relative(repoRoot, momentsA4Path).replace(/\\/g, "/"),
          structural_comparison: path.relative(repoRoot, comparePath).replace(/\\/g, "/")
        }
      },
      null,
      2
    )
  );
  console.log(JSON.stringify(comparison, null, 2));
}

main();
