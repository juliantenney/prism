"use strict";

/**
 * S68-IMP-010 — Capture beats vs moments A5 capstone composition review artefacts.
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

function capabilitySequence(doSection) {
  const sequence = [];
  if (/data-workspace-kind="table_entry"/.test(doSection)) sequence.push("table_entry");
  if (/data-workspace-capability="text_entry"/.test(doSection)) sequence.push("text_entry");
  return sequence;
}

function structuralSummary(html, label) {
  const a5 = extractActivityHtml(html, "A5");
  const doSection = momentSection(a5, "do");
  const momentOrder = [];
  const momentRe = /data-composition-moment="([^"]+)"/g;
  let m;
  while ((m = momentRe.exec(a5)) !== null) momentOrder.push(m[1]);

  return {
    label,
    a5_bytes: a5.length,
    composition_moments: momentOrder,
    beat_sections: countMatches(a5, /data-beat-function="/g),
    beat_functions: [...a5.matchAll(/data-beat-function="([^"]+)"/g)].map((x) => x[1]),
    a5_m1: countMatches(a5, /data-material-id="A5-M1"/g),
    a5_m4: countMatches(a5, /data-material-id="A5-M4"/g),
    a5_m5: countMatches(a5, /data-material-id="A5-M5"/g),
    a5_m6: countMatches(a5, /data-material-id="A5-M6"/g),
    a5_m7: countMatches(a5, /data-material-id="A5-M7"/g),
    a5_m8: countMatches(a5, /data-material-id="A5-M8"/g),
    table_workspaces: countMatches(a5, /data-workspace-kind="table_entry"/g),
    table_inputs: countMatches(a5, /util-learner-table-workspace__input/g),
    text_workspaces: countMatches(a5, /data-workspace-capability="text_entry"/g),
    text_controls: countMatches(a5, /util-learner-workspace__input/g),
    learner_surface_sequence: capabilitySequence(doSection),
    duplicated_argument_structure_hint: countMatches(
      a5,
      /argument_structure_hint|Structure your response/gi
    ),
    reference_tables_in_learn: countMatches(momentSection(a5, "learn"), /util-learner-table-workspace/g),
    check_guidance: countMatches(a5, /Complete your response first/i),
    transfer_or_consolidation: countMatches(a5, /Transfer Task|Key Takeaways/i)
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

  const beatsPath = path.join(outDir, "heteroscedasticity-a5-beats-mode-export.html");
  const momentsPath = path.join(outDir, "heteroscedasticity-a5-moments-mode-export.html");
  const beatsA5Path = path.join(outDir, "heteroscedasticity-a5-beats-mode-a5-only.html");
  const momentsA5Path = path.join(outDir, "heteroscedasticity-a5-moments-mode-a5-only.html");
  const comparePath = path.join(outDir, "heteroscedasticity-a5-composition-structural-comparison.json");
  const capturePath = path.join(outDir, "heteroscedasticity-a5-composition-ux-review.capture.json");

  fs.writeFileSync(beatsPath, beatsHtml);
  fs.writeFileSync(momentsPath, momentsHtml);
  fs.writeFileSync(beatsA5Path, extractActivityHtml(beatsHtml, "A5"));
  fs.writeFileSync(momentsA5Path, extractActivityHtml(momentsHtml, "A5"));

  const comparison = {
    captured_at: new Date().toISOString(),
    reviewer_task: "S68-IMP-010",
    fixture: "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json",
    notes:
      "A5 capstone Do moment composes comparison_table (table_entry) followed by written judgement (text_entry) without an activity-specific renderer.",
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
          beats_a5: path.relative(repoRoot, beatsA5Path).replace(/\\/g, "/"),
          moments_a5: path.relative(repoRoot, momentsA5Path).replace(/\\/g, "/"),
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
