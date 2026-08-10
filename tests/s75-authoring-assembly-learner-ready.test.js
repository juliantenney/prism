/**
 * Sprint 75 — Authoring assembly readiness / partial-page merge (S75-D13).
 *
 * Episode Plan shells are not learner-ready. Available stage captures must merge
 * before readiness; incomplete runs must not silently preview as outcomes-only pages.
 * Uses production resolvePageForRenderOrAssembly + runUtilityPageExportPipeline
 * (not convertSectionsPageForVnextRender).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  injectLearnerRendererVNextInSandbox,
  wirePageVnextAssembleForTests
} = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");
const fixturesDir = path.join(__dirname, "fixtures", "page-assemble");
const assemble = require(path.join(repoRoot, "lib", "page-vnext-assemble.js"));

function loadFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

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
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
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
    PEDAGOGICAL_ICON_LIBS.concat(["lib/page-vnext-assemble.js"])
  );
  wirePageVnextAssembleForTests(windowStub, repoRoot);
  injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

function buildPartialWorkflow(id) {
  return {
    id: id || "wf-s75-assembly-ready",
    name: "S75 assembly readiness",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    steps: [
      {
        id: "ep_step",
        title: "Design Episode Plan",
        outputName: "page",
        canonical_step_id: "step_design_episode_plan"
      },
      {
        id: "dla_step",
        title: "Design Learning Activities",
        outputName: "page",
        canonical_step_id: "step_design_learning_activities"
      },
      {
        id: "gam_step",
        title: "Generate Activity Materials",
        outputName: "page",
        canonical_step_id: "step_generate_activity_materials"
      },
      {
        id: "ls_step",
        title: "Construct Learning Sequence",
        outputName: "page",
        canonical_step_id: "step_construct_learning_sequence"
      },
      {
        id: "dp_step",
        title: "Design Page",
        outputName: "page",
        canonical_step_id: "step_design_page"
      }
    ]
  };
}

function setCaptures(api, wf, map) {
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const serialized = {};
  Object.keys(map).forEach((stepId) => {
    serialized[stepId] =
      typeof map[stepId] === "string" ? map[stepId] : JSON.stringify(map[stepId], null, 2);
  });
  api.setWorkflowRunCaptureMapsForTest(serialized, Object.assign({}, serialized));
}

const epShell = loadFixture("ep-shell.json");
const dlaPartial = loadFixture("dla-partial.json");
const gamPartial = loadFixture("gam-partial.json");
const lsPartial = loadFixture("ls-partial.json");
const dpPartial = loadFixture("dp-partial.json");
const dpPartialWithVa = loadFixture("dp-partial-with-va.json");
const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
const appSource = fs.readFileSync(appJsPath, "utf8");

/** Fixture A2 template type is beat-incompatible with EP understand shells; keep bodies, fix type for render. */
function gamPartialForRender() {
  const gam = JSON.parse(JSON.stringify(gamPartial));
  gam.activities.forEach((activity) => {
    (activity.materials || []).forEach((material) => {
      if (String(material.material_type || "") === "template") {
        material.material_type = "text";
      }
    });
  });
  return gam;
}

test("predicate: EP shell is structural-ok but not learner-ready", () => {
  const structural = assemble.validateAssembledPageForRender(epShell);
  assert.equal(structural.ok, true, structural.errors && structural.errors.join("; "));
  assert.equal(assemble.isLearnerReadyAssembledPage(epShell), false);
  assert.equal(assemble.isPlaceholderOnlyActivitiesPage(epShell), true);
  const ready = assemble.assessAssembledPageLearnerReady(epShell, {
    partialsPresent: { dla: false, gam: false }
  });
  assert.equal(ready.ok, false);
  assert.match(ready.message, /learner activity content needed to assemble the page/i);
  assert.match(ready.message, /Learning Activities/);
  assert.match(ready.message, /Activity Materials/);
});

test("A: EP-only Assemble/Preview does not succeed as outcomes-only page", () => {
  const api = loadPrismTestApi();
  const wf = buildPartialWorkflow("wf-s75-ep-only");
  setCaptures(api, wf, { ep_step: epShell });

  assert.throws(
    () => api.resolvePageForRenderOrAssembly(epShell, wf, {}),
    /learner activity content needed to assemble the page/i
  );

  const preview = api.runUtilityPageExportPipelineForTest(epShell, {
    workflow: wf,
    skipWorkflowAssembly: true,
    applyCompositionValidation: false
  });
  assert.ok(preview && preview.error);
  assert.match(String(preview.error), /learner activity content needed to assemble the page/i);
  assert.equal(preview.html == null || preview.html === "", true);

  const assembleAttempt = api.runUtilityPageExportPipelineForTest(epShell, {
    workflow: wf,
    skipWorkflowAssembly: false,
    applyCompositionValidation: false
  });
  assert.ok(assembleAttempt && assembleAttempt.error);
  assert.match(
    String(assembleAttempt.error),
    /learner activity content needed to assemble the page/i
  );
});

test("B: EP + DLA — instructional content survives assembly", () => {
  const api = loadPrismTestApi();
  const wf = buildPartialWorkflow("wf-s75-ep-dla");
  setCaptures(api, wf, { ep_step: epShell, dla_step: dlaPartial });

  const resolved = api.resolvePageForRenderOrAssembly(epShell, wf, {});
  assert.equal(assemble.isLearnerReadyAssembledPage(resolved), true);
  const a1 = resolved.activities.find((row) => row.activity_id === "A1");
  assert.ok(a1);
  assert.equal(a1.learner_task, "Compare inflation drivers using evidence.");
  assert.equal(a1.expected_output, "A justified comparison paragraph.");
  assert.ok(Array.isArray(a1.required_materials) && a1.required_materials.length > 0);
  assert.deepEqual(
    (resolved.assembly_state && resolved.assembly_state.enriched_by) || [],
    ["episode_plan", "dla"]
  );
});

test("C: EP + DLA + GAM — tasks + materials survive assembly and render", () => {
  const api = loadPrismTestApi();
  const wf = buildPartialWorkflow("wf-s75-ep-dla-gam");
  const gam = gamPartialForRender();
  setCaptures(api, wf, {
    ep_step: epShell,
    dla_step: dlaPartial,
    gam_step: gam
  });

  const resolved = api.resolvePageForRenderOrAssembly(dlaPartial, wf, {});
  const a1 = resolved.activities.find((row) => row.activity_id === "A1");
  assert.equal(a1.learner_task, "Compare inflation drivers using evidence.");
  assert.equal(a1.materials[0].material_id, "A1-M1");
  assert.match(String(a1.materials[0].body || ""), /Demand-pull and cost-push/i);

  const rendered = api.runUtilityPageExportPipelineForTest(resolved, {
    workflow: wf,
    skipWorkflowAssembly: true,
    applyCompositionValidation: false
  });
  assert.ok(rendered && !rendered.error, rendered && rendered.error);
  const html = String(rendered.html || "");
  assert.match(html, /data-activity-id="A1"/);
  assert.match(html, /data-activity-id="A2"/);
  assert.match(html, /Demand-pull and cost-push/i);
});

test("D: structurally validating EP seed + DLA/GAM captures must merge (no early-return)", () => {
  const api = loadPrismTestApi();
  const wf = buildPartialWorkflow("wf-s75-no-early-return");
  setCaptures(api, wf, {
    ep_step: epShell,
    dla_step: dlaPartial,
    gam_step: gamPartial
  });

  assert.equal(assemble.validateAssembledPageForRender(epShell).ok, true);

  const resolved = api.resolvePageForRenderOrAssembly(epShell, wf, {});
  assert.notEqual(
    String(resolved.activities[0].learner_task || "").trim(),
    "—",
    "must not early-return Episode Plan shell"
  );
  assert.equal(
    resolved.activities[0].learner_task,
    "Compare inflation drivers using evidence."
  );
  assert.ok(resolved.activities[0].materials && resolved.activities[0].materials.length);
  assert.ok(
    (resolved.assembly_state.enriched_by || []).includes("dla"),
    "DLA must be merged"
  );
  assert.ok(
    (resolved.assembly_state.enriched_by || []).includes("gam"),
    "GAM must be merged"
  );
});

test("E: Design Page partial retains title/synthesis while DLA/GAM bodies survive", () => {
  const api = loadPrismTestApi();
  const wf = buildPartialWorkflow("wf-s75-dp-partial");
  const dp = JSON.parse(JSON.stringify(dpPartialWithVa));
  setCaptures(api, wf, {
    ep_step: epShell,
    dla_step: dlaPartial,
    gam_step: gamPartial,
    ls_step: lsPartial,
    dp_step: dp
  });

  const resolved = api.resolvePageForRenderOrAssembly(dp, wf, {});
  assert.equal(resolved.title, "Inflation Drivers and CPI Reasoning");
  assert.ok(resolved.page_synthesis && resolved.page_synthesis.knowledge_summary);
  assert.match(
    String(resolved.page_synthesis.knowledge_summary.body || ""),
    /Core inflation concepts/i
  );
  assert.equal(
    resolved.activities[0].learner_task,
    "Compare inflation drivers using evidence."
  );
  assert.equal(resolved.activities[0].materials[0].material_id, "A1-M1");
  assert.equal(Array.isArray(dp.activities) ? dp.activities.length : 0, 0);
});

test("F: complete page through production Authoring export pipeline", () => {
  const api = loadPrismTestApi();
  const wf = buildPartialWorkflow("wf-s75-export-pipeline");
  const gam = gamPartialForRender();
  setCaptures(api, wf, {
    ep_step: epShell,
    dla_step: dlaPartial,
    gam_step: gam,
    ls_step: lsPartial,
    dp_step: dpPartial
  });

  const rendered = api.runUtilityPageExportPipelineForTest(dpPartial, {
    workflow: wf,
    skipWorkflowAssembly: false,
    applyCompositionValidation: false
  });
  assert.ok(rendered && !rendered.error, rendered && rendered.error);
  const html = String(rendered.html || "");
  assert.match(html, /Learning outcomes/i);
  assert.ok((html.match(/data-activity-id=/g) || []).length >= 2);
  assert.match(html, /Demand-pull and cost-push|CPI worksheet|inflation drivers/i);
});

test("G: content-rich assembled page remains green on production export path", () => {
  const api = loadPrismTestApi();
  const wf = buildPartialWorkflow("wf-s75-rich");
  const gam = gamPartialForRender();
  setCaptures(api, wf, {
    ep_step: epShell,
    dla_step: dlaPartial,
    gam_step: gam,
    dp_step: dpPartial
  });
  const page = api.resolvePageForRenderOrAssembly(dpPartial, wf, {});
  assert.equal(assemble.isLearnerReadyAssembledPage(page), true);
  const rendered = api.runUtilityPageExportPipelineForTest(page, {
    skipWorkflowAssembly: true,
    applyCompositionValidation: false
  });
  assert.ok(rendered && !rendered.error, rendered && rendered.error);
  assert.match(String(rendered.html || ""), /data-activity-id="A1"/);
  assert.match(String(rendered.html || ""), /Demand-pull and cost-push/i);
});

test("H: D12 remains retired — no Presentation mode / learning_object", () => {
  assert.doesNotMatch(indexHtml, /id="utilitiesPresentationMode"/);
  assert.doesNotMatch(indexHtml, /Learning object HTML/i);
  assert.doesNotMatch(indexHtml, /value="learning_object"/);
  assert.doesNotMatch(appSource, /utilitiesPresentationMode/);
  assert.doesNotMatch(appSource, /buildUtilityLearningObjectHtml/);
});

test("early-return on structural validate is removed from production assembly path", () => {
  assert.match(
    appSource,
    /Partial-page workflows always merge available stage captures/
  );
  assert.doesNotMatch(
    appSource,
    /completeCheck && completeCheck\.ok\) \{\s*return attachLearnerPageIdentityFromWorkflow/
  );
});
