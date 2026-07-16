/**
 * Sprint 62 — minimum learner-journey presentation slice.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");
const registry = require("../lib/beat-material-registry.js");

const repoRoot = path.resolve(__dirname, "..");
const rnaFixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "rna-hcv-assembled-vnext-materials-page.json"
);

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add() {},
      remove() {},
      contains() {
        return false;
      },
      toggle() {
        return false;
      }
    },
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
    PEDAGOGICAL_ICON_LIBS.concat([
      "lib/page-render-normalize.js",
      "lib/ld-instructional-manifestation-render.js"
    ])
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function renderPage(api, page) {
  const r = api.buildUtilityStructuredHtmlForTest(page, ["sections"], {
    applyCompositionValidation: false
  });
  assert.ok(r && !r.error, r && r.error);
  return String(r.html || "");
}

function activitySlice(html, title, nextTitle) {
  const start = html.indexOf(title);
  assert.ok(start !== -1, "missing activity " + title);
  const end = nextTitle ? html.indexOf(nextTitle, start + 1) : html.length;
  return html.slice(start, end > start ? end : html.length);
}

function plain(html) {
  return String(html || "")
    .replace(/<\/(h[1-6]|p|div|section|li)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .trim();
}

test("learner-facing beat labels map known episode functions", () => {
  assert.equal(registry.learnerFacingEpisodeFunctionLabel("explanation"), "Understand");
  assert.equal(registry.learnerFacingEpisodeFunctionLabel("worked_thinking"), "See it modelled");
  assert.equal(registry.learnerFacingEpisodeFunctionLabel("worked_judgement"), "See it modelled");
  assert.equal(registry.learnerFacingEpisodeFunctionLabel("guided_practice"), "Your turn");
  assert.equal(registry.learnerFacingEpisodeFunctionLabel("verification"), "Check your work");
  assert.equal(registry.learnerFacingEpisodeFunctionLabel("transfer"), "Apply elsewhere");
});

test("unknown beat functions fall back to structural episodeFunctionLabel", () => {
  assert.equal(
    registry.learnerFacingEpisodeFunctionLabel("orientation"),
    registry.episodeFunctionLabel("orientation")
  );
  assert.equal(
    registry.learnerFacingEpisodeFunctionLabel("mystery_custom_beat"),
    registry.episodeFunctionLabel("mystery_custom_beat")
  );
});

test("RNA A2: goal-shaped opening, phase labels, success promotion, no trailing Output", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(rnaFixturePath, "utf8"));
  const html = renderPage(api, page);
  const a2 = activitySlice(html, "Analyse HCV Replication Steps", "Plan an Outbreak Response");
  const text = plain(a2);

  assert.match(a2, /Your goal/i);
  assert.doesNotMatch(a2, /<h4[^>]*>\s*What to do\s*<\/h4>/i);
  assert.match(text, /Complete the analysis table using the worked example/i);
  assert.match(a2, /Success looks like/i);
  assert.match(text, /causal order preserved/i);
  assert.match(text, /host and viral roles distinguished/i);

  const goalIdx = text.indexOf("Your goal");
  const successIdx = text.indexOf("Success looks like");
  const understandIdx = text.indexOf("Understand");
  const modelIdx = text.indexOf("See it modelled");
  const applyIdx = text.indexOf("Your turn");
  const checkIdx = text.lastIndexOf("Check your work");
  assert.ok(goalIdx < successIdx && successIdx < understandIdx);
  assert.ok(understandIdx < modelIdx && modelIdx < applyIdx && applyIdx < checkIdx);

  assert.doesNotMatch(a2, />Explanation</);
  assert.doesNotMatch(a2, />Worked Thinking</);
  assert.doesNotMatch(a2, />Practice</);
  assert.doesNotMatch(a2, />Check Your Thinking</);

  assert.match(a2, /S62-RNA-A2-M1-BODY/);
  assert.match(a2, /S62-RNA-A2-M2-BODY/);
  assert.match(a2, /S62-RNA-A2-M3-ROW/);
  assert.match(a2, /S62-RNA-A2-M4-C1/);
  assert.equal((a2.match(/S62-RNA-A2-M1-BODY/g) || []).length, 1);
  assert.doesNotMatch(a2, /S62 RNA A2-M1 Replication Overview/);
  assert.doesNotMatch(text, /\bOutput\b/);
  assert.doesNotMatch(text, /Completed analysis table verified with checklist/);
});

test("inventory-style learner_task is not rewritten as Your goal", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(rnaFixturePath, "utf8"));
  const html = renderPage(api, page);
  const a1 = activitySlice(html, "Classify RNA Virus Genomes", "Analyse HCV Replication Steps");
  const a6 = html.slice(html.indexOf("Evaluate Outbreak Priorities"));

  assert.doesNotMatch(a1, /Your goal/i);
  assert.match(a1, /What to do/i);
  assert.match(a1, /Study the exposition, worked example, classification table, and checklist/i);

  assert.doesNotMatch(a6, /Your goal/i);
  assert.match(a6, /What to do/i);
  assert.match(
    a6,
    /Complete the decision table, memo template, checklist, and transfer prompt/i
  );
});

test("RNA A6: phase labels apply, materials complete, transfer order preserved, no invented goal", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(rnaFixturePath, "utf8"));
  const html = renderPage(api, page);
  const a6 = html.slice(html.indexOf("Evaluate Outbreak Priorities"));
  const text = plain(a6);

  assert.match(a6, /Understand/);
  assert.match(a6, /See it modelled/);
  assert.match(a6, /Your turn/);
  assert.match(a6, /Apply elsewhere/);
  assert.match(a6, /Check your work/);

  const applyElsewhere = text.indexOf("Apply elsewhere");
  const check = text.lastIndexOf("Check your work");
  assert.ok(applyElsewhere !== -1 && check !== -1);
  assert.ok(applyElsewhere < check, "transfer beat remains before verification in this slice");

  ["A6-M1", "A6-M2", "A6-M3", "A6-M4", "A6-M5", "A6-M6", "A6-M7"].forEach((id) => {
    assert.ok(a6.includes("S62-RNA-" + id) || a6.includes(id), "missing " + id);
  });
  assert.match(a6, /S62-RNA-A6-M1-BODY/);
  assert.match(a6, /S62-RNA-A6-M7-BODY/);
  assert.match(a6, /S62-RNA-A6-M4-ROW/);
  assert.match(a6, /S62-RNA-A6-M6-C1/);
});

test("fixture/test material titles are suppressed; production titles remain", () => {
  const api = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Title suppression fixture",
    page_profile: "learner",
    activities: [
      {
        activity_id: "A1",
        title: "Title Rules Activity",
        learner_task: "Complete the analysis table comparing options.",
        expected_output: "Completed analysis table.",
        episode_plan: {
          archetype: "analyse",
          beats: [{ function: "explanation" }, { function: "guided_practice" }]
        },
        materials: [
          {
            material_id: "A1-M1",
            material_type: "text",
            title: "S62 RNA A1-M1 Fixture Title Should Hide",
            body: "Marker KEEP-BODY-A."
          },
          {
            material_id: "A1-M2",
            material_type: "analysis_table",
            title: "Replication Comparison Grid",
            body: "| A | B |\n| --- | --- |\n| 1 | 2 |"
          },
          {
            material_id: "A1-M3",
            material_type: "text",
            title: "S62 Fallback Experimental Card",
            body: "Marker KEEP-FALLBACK-TITLE."
          }
        ]
      }
    ]
  };
  const html = renderPage(api, page);
  assert.doesNotMatch(html, /S62 RNA A1-M1 Fixture Title Should Hide/);
  assert.match(html, /KEEP-BODY-A/);
  assert.match(html, /Replication Comparison Grid/);
  assert.match(html, /S62 Fallback Experimental Card/);
  assert.match(html, /KEEP-FALLBACK-TITLE/);
});

test("diagnostics remain unchanged by presentation slice", () => {
  const api = loadPrismTestApi();
  const beats = require("../lib/utility-pedagogical-beats.js");
  const page = JSON.parse(fs.readFileSync(rnaFixturePath, "utf8"));
  const norm = api.normalizePageForRenderForTest(JSON.parse(JSON.stringify(page)));
  const result = registry.validatePageBeatMaterialClosure(norm, {
    classifyFromText: beats.classifyPedagogicalBeat
  });
  assert.equal(result.diagnostics.conflicts.length, 0);
  const unassigned = result.diagnostics.unassigned_materials.map((row) => row.material_key);
  assert.deepEqual(unassigned, ["planning_table"]);
  assert.equal(result.messages.join(" ").includes("_material_ids"), false);
});
