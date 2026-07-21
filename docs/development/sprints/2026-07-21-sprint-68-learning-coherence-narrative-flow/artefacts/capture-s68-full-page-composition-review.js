"use strict";

/**
 * S68-IMP-011 — Capture full-page beats vs moments Sprint 68 review artefacts.
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

function countMatches(source, re) {
  return (String(source).match(re) || []).length;
}

function collectIds(html) {
  return [...String(html || "").matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
}

function duplicateIds(html) {
  const ids = collectIds(html);
  const seen = Object.create(null);
  const duplicates = [];
  ids.forEach(function (id) {
    if (seen[id]) duplicates.push(id);
    seen[id] = true;
  });
  return duplicates.sort();
}

function activityMomentCounts(html) {
  const counts = Object.create(null);
  ["A1", "A2", "A3", "A4", "A5"].forEach(function (activityId) {
    const marker = 'id="activity-' + activityId + '"';
    const start = html.indexOf(marker);
    const nextActivities = ["A1", "A2", "A3", "A4", "A5"]
      .filter(function (id) {
        return id !== activityId;
      })
      .map(function (id) {
        return html.indexOf('id="activity-' + id + '"', start + 1);
      })
      .filter(function (index) {
        return index > start;
      })
      .sort(function (a, b) {
        return a - b;
      })[0];
    const slice =
      start >= 0
        ? html.slice(start, nextActivities >= 0 ? nextActivities : html.length)
        : "";
    counts[activityId] = countMatches(slice, /data-composition-moment="/g);
  });
  return counts;
}

function bodyHtml(html) {
  const match = String(html || "").match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return match ? match[1] : String(html || "");
}

function structuralSummary(html, label, compositionMode) {
  const body = bodyHtml(html);
  return {
    label: label,
    active_composition_mode: compositionMode,
    page_bytes: html.length,
    activity_count: countMatches(body, /id="activity-A[1-5]"/g),
    composition_moments: countMatches(body, /data-composition-moment="/g),
    composition_moments_by_activity: activityMomentCounts(body),
    beat_sections: countMatches(body, /data-beat-function="/g),
    table_entry_workspaces: countMatches(body, /data-workspace-kind="table_entry"/g),
    text_entry_workspaces: countMatches(body, /data-workspace-capability="text_entry"/g),
    table_inputs: countMatches(body, /util-learner-table-workspace__input/g),
    textareas: countMatches(body, /util-learner-workspace__input/g),
    reference_tables: countMatches(body, /data-workspace-kind="table_entry"[\s\S]*?data-material-type="comparison_table"/g),
    reference_tables_in_learn: countMatches(
      body,
      /data-composition-moment="learn"[\s\S]*?util-learner-table-workspace/g
    ),
    prompt_occurrences: countMatches(
      body,
      /data-source-field="(self_explanation_prompt|argument_structure_hint|transfer_or_application_task|intellectual_coherence_bridge)"/g
    ),
    duplicate_ids: duplicateIds(body),
    unsupported_capability_fallbacks: countMatches(html, /data-workspace-capability="unsupported"/g)
  };
}

function renderWithShell(api, vnext, fixture, compositionMode) {
  const rendered = vnext.renderLearnerPageHtml(
    fixture,
    compositionMode ? { compositionMode: compositionMode } : undefined
  );
  if (!rendered || rendered.error) {
    throw new Error(String(compositionMode || "default") + " render failed: " + (rendered && rendered.error));
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
  const momentsHtml = renderWithShell(api, vnext, fixture, undefined);

  const beatsPath = path.join(outDir, "heteroscedasticity-s68-full-page-beats-mode-export.html");
  const momentsPath = path.join(outDir, "heteroscedasticity-s68-full-page-moments-mode-export.html");
  const comparePath = path.join(
    outDir,
    "heteroscedasticity-s68-full-page-composition-structural-comparison.json"
  );
  const capturePath = path.join(outDir, "heteroscedasticity-s68-full-page-review.capture.json");

  fs.writeFileSync(beatsPath, beatsHtml);
  fs.writeFileSync(momentsPath, momentsHtml);

  const comparison = {
    captured_at: new Date().toISOString(),
    reviewer_task: "S68-IMP-011",
    fixture: "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json",
    notes:
      "Full-page moments mode is now the default application path for preview and export. Beats mode remains available via compositionMode: \"beats\".",
    default_composition_mode: vnext.DEFAULT_COMPOSITION_MODE || "moments",
    beats: structuralSummary(beatsHtml, "beats", "beats"),
    moments: structuralSummary(momentsHtml, "moments", vnext.DEFAULT_COMPOSITION_MODE || "moments")
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
          structural_comparison: path.relative(repoRoot, comparePath).replace(/\\/g, "/"),
          side_by_side_review: path
            .relative(repoRoot, path.join(outDir, "heteroscedasticity-s68-full-page-review.html"))
            .replace(/\\/g, "/")
        }
      },
      null,
      2
    )
  );
  console.log(JSON.stringify(comparison, null, 2));
}

main();
