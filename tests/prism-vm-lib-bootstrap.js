/**
 * Load PRISM lib scripts into a vm sandbox before app.js (Node tests + probes).
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const DEFAULT_LIBS = [
  "lib/sprint38-visual-affordances.js",
  "lib/visual-planning-contract.js",
  "lib/prism-visual-material-role-grounding.js",
  "lib/prism-visual-jobs-planner.js",
  "lib/prism-house-visual-language.js",
  "lib/prism-image-precision-fidelity.js",
  "lib/prism-image-brief-compiler.js",
  "lib/prism-visual-assets.js",
  "lib/prism-workflow-resources.js",
  "lib/utilities-visual-jobs-workspace.js",
  "lib/learner-package.js",
  "lib/learner-package-zip.js",
  "lib/learner-content-viewer.js",
  "lib/gam-output-format.js",
  "lib/ld-table-fidelity.js",
  "lib/ld-materials-copy.js",
  "lib/ld-math-render.js",
  "lib/ld-self-directed-rhetoric.js",
  "lib/ld-authorial-exposition.js",
  "lib/ld-journey-assimilation.js",
  "lib/ld-activity-preamble-exposition.js",
  "lib/ld-cognition-orientation.js",
  "lib/ld-guided-learning-scaffold.js",
  "lib/ld-activity-title-contract.js",
  "lib/ld-dla-page-enrich-contract.js",
  "lib/ld-gam-page-enrich-contract.js",
  "lib/ld-design-page-partial-contract.js",
  "lib/ld-thin-assembly-coherence.js",
  "lib/page-activity-field-preserve.js",
  "lib/page-gam-materials-preserve.js",
  "lib/page-render-normalize.js",
  "lib/ld-instructional-manifestation-render.js",
  "lib/ld-pedagogic-salience-render.js",
  "lib/ld-beat-assignment-compose.js",
  "lib/beat-material-registry.js",
  "lib/utility-pedagogical-icons.js",
  "lib/utility-pedagogical-beats.js",
  "lib/educational-quality-framework-prompt.js",
  "lib/instructional-pattern-prompt.js",
  "lib/gam-practice-independence-prompt.js",
  "lib/gam-operational-suitability-prompt.js",
  "lib/gam-operational-suitability-review.js",
  "lib/gam-canonical-assembler.js",
  "lib/first-class-workflow-family.js",
  "lib/learning-journey-design-page.js",
  "lib/learning-journey-commission-production-status.js",
  "lib/learning-journey-learner-package.js",
  "lib/learning-journey-workflow-hierarchy.js",
  "lib/learning-journey-sibling-prompts.js",
  "lib/situated-task-design-page.js",
  "lib/situated-task-sibling-prompts.js"
];

/**
 * Load PRISM lib scripts into a vm sandbox.
 *
 * D-014 RC1: by default also injects PRISM_LEARNER_RENDERER_VNEXT so app.js
 * learner-export paths match the browser dependency (window.PRISM_LEARNER_RENDERER_VNEXT).
 * Opt out with options.skipLearnerRendererVNextInject when a test intentionally
 * exercises the unavailable-renderer branch.
 *
 * PB-S-007 E: by default also ensures PRISM_GAM_CANONICAL_ASSEMBLER is loaded even
 * when a custom lib list omits it. Opt out with skipGamCanonicalAssemblerInject.
 *
 * Signature: (sandbox, repoRoot, libs?, options?)
 * libs may be omitted; pass options as the 3rd argument when no custom lib list.
 */
function runPrismLibScriptsInSandbox(sandbox, repoRoot, libs, options) {
  const root = repoRoot || path.resolve(__dirname, "..");
  var opts = options && typeof options === "object" ? options : {};
  var list = libs;
  if (list && !Array.isArray(list) && typeof list === "object") {
    opts = list;
    list = opts.libs;
  }
  list = Array.isArray(list) && list.length ? list : DEFAULT_LIBS;
  list.forEach(function (rel) {
    const filePath = path.join(root, rel);
    vm.runInContext(fs.readFileSync(filePath, "utf8"), sandbox, { filename: rel });
  });
  if (sandbox.window) {
    [
      "PRISM_GAM_OUTPUT_FORMAT",
      "PRISM_LD_TABLE_FIDELITY",
      "PRISM_LD_MATERIALS_COPY",
      "PRISM_LD_MATH_RENDER",
      "PRISM_LD_SELF_DIRECTED_RHETORIC",
      "PRISM_LD_AUTHORIAL_EXPOSITION",
      "PRISM_LD_JOURNEY_ASSIMILATION",
      "PRISM_LD_ACTIVITY_PREAMBLE_EXPOSITION",
      "PRISM_LD_COGNITION_ORIENTATION",
      "PRISM_LD_GUIDED_LEARNING_SCAFFOLD",
      "PRISM_LD_ACTIVITY_TITLE_CONTRACT",
      "PRISM_LD_DLA_PAGE_ENRICH_CONTRACT",
      "PRISM_LD_GAM_PAGE_ENRICH_CONTRACT",
      "PRISM_LD_DESIGN_PAGE_PARTIAL_CONTRACT",
      "PRISM_LD_THIN_ASSEMBLY_COHERENCE",
      "PRISM_PAGE_ACTIVITY_FIELD_PRESERVE",
      "PRISM_PAGE_GAM_MATERIALS_PRESERVE",
      "PRISM_PAGE_RENDER_NORMALIZE",
      "PRISM_LD_INSTRUCTIONAL_MANIFESTATION_RENDER",
      "PRISM_LD_PEDAGOGIC_SALIENCE_RENDER",
      "PRISM_LD_BEAT_ASSIGNMENT_COMPOSE",
      "PRISM_UTILITY_PEDAGOGICAL_ICONS",
      "PRISM_UTILITY_PEDAGOGICAL_BEATS",
      "PRISM_BEAT_MATERIAL_REGISTRY",
      "PRISM_INSTRUCTIONAL_PATTERN_PROMPT",
      "PRISM_GAM_PRACTICE_INDEPENDENCE_PROMPT",
      "PRISM_GAM_OPERATIONAL_SUITABILITY_PROMPT",
      "PRISM_GAM_OPERATIONAL_SUITABILITY_REVIEW",
      "PRISM_GAM_CANONICAL_ASSEMBLER",
      "PRISM_FIRST_CLASS_WORKFLOW_FAMILY",
      "PRISM_LEARNING_JOURNEY_DESIGN_PAGE",
      "PRISM_LEARNING_JOURNEY_COMMISSION_PRODUCTION_STATUS",
      "PRISM_LEARNING_JOURNEY_LEARNER_PACKAGE",
      "PRISM_LEARNING_JOURNEY_WORKFLOW_HIERARCHY",
      "PrismLearningJourneySiblingPrompts",
      "PRISM_SITUATED_TASK_DESIGN_PAGE",
      "PrismSituatedTaskSiblingPrompts",
      "PRISM_SPRINT38_VISUAL_AFFORDANCES",
      "PRISM_VISUAL_PLANNING_CONTRACT",
      "PRISM_VISUAL_MATERIAL_ROLE_GROUNDING",
      "PRISM_VISUAL_JOBS_PLANNER",
      "PRISM_IMAGE_BRIEF_COMPILER",
      "PRISM_VISUAL_ASSETS",
      "PRISM_UTILITIES_VISUAL_JOBS_WORKSPACE",
      "PRISM_LEARNER_PACKAGE",
      "PRISM_LEARNER_PACKAGE_ZIP",
      "PRISM_LEARNER_CONTENT_VIEWER"
    ].forEach(function (key) {
      if (sandbox[key]) {
        sandbox.window[key] = sandbox[key];
      }
    });
  }
  if (!opts.skipLearnerRendererVNextInject) {
    injectLearnerRendererVNextInSandbox(sandbox, root);
  }
  if (!opts.skipGamCanonicalAssemblerInject) {
    ensureGamCanonicalAssemblerInSandbox(sandbox, root);
  }
  if (!opts.skipFirstClassWorkflowFamilyInject) {
    ensureFirstClassWorkflowFamilyInSandbox(sandbox, root);
  }
}

const PEDAGOGICAL_ICON_LIBS = [
  "lib/ld-beat-assignment-compose.js",
  "lib/beat-material-registry.js",
  "lib/utility-pedagogical-icons.js",
  "lib/utility-pedagogical-beats.js",
  "lib/page-render-normalize.js"
];

const LEARNER_RENDERER_VNEXT_BROWSER_LIB = "lib/learner-renderer-vnext-browser.js";

function wireBrowserGlobalThis(sandbox) {
  if (sandbox.window && sandbox.globalThis !== sandbox.window) {
    sandbox.globalThis = sandbox.window;
  }
}

function loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot) {
  const root = repoRoot || path.resolve(__dirname, "..");
  wireBrowserGlobalThis(sandbox);
  vm.runInContext(
    fs.readFileSync(path.join(root, LEARNER_RENDERER_VNEXT_BROWSER_LIB), "utf8"),
    sandbox,
    { filename: LEARNER_RENDERER_VNEXT_BROWSER_LIB }
  );
  if (sandbox.window && sandbox.PRISM_LEARNER_RENDERER_VNEXT) {
    sandbox.window.PRISM_LEARNER_RENDERER_VNEXT = sandbox.PRISM_LEARNER_RENDERER_VNEXT;
  }
  return sandbox.window
    ? sandbox.window.PRISM_LEARNER_RENDERER_VNEXT
    : sandbox.PRISM_LEARNER_RENDERER_VNEXT;
}

function injectLearnerRendererVNextInSandbox(sandbox, repoRoot) {
  var root = repoRoot || path.resolve(__dirname, "..");
  var vnext = require("../lib/learner-renderer-vnext");
  sandbox.PRISM_LEARNER_RENDERER_VNEXT = vnext;
  if (sandbox.window) {
    sandbox.window.PRISM_LEARNER_RENDERER_VNEXT = vnext;
  }
  wireBrowserGlobalThis(sandbox);
  [
    "lib/learner-renderer-vnext-export-runtime-source.js",
    "lib/learner-renderer-vnext-standalone-embed.js"
  ].forEach(function (rel) {
    var filePath = path.join(root, rel);
    if (!fs.existsSync(filePath)) return;
    vm.runInContext(fs.readFileSync(filePath, "utf8"), sandbox, { filename: rel });
  });
  if (sandbox.window && sandbox.PRISM_LEARNER_VNEXT_STANDALONE_EMBED) {
    sandbox.window.PRISM_LEARNER_VNEXT_STANDALONE_EMBED =
      sandbox.PRISM_LEARNER_VNEXT_STANDALONE_EMBED;
  }
  if (sandbox.window && sandbox.PRISM_VNEXT_EXPORT_RUNTIME_SOURCE) {
    sandbox.window.PRISM_VNEXT_EXPORT_RUNTIME_SOURCE =
      sandbox.PRISM_VNEXT_EXPORT_RUNTIME_SOURCE;
  }
}

function createPrismVmElementStub() {
  var el = {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add: function () {},
      remove: function () {},
      contains: function () {
        return false;
      },
      toggle: function () {
        return false;
      }
    },
    style: {},
    dataset: {},
    children: [],
    appendChild: function () {},
    removeChild: function () {},
    setAttribute: function () {},
    removeAttribute: function () {},
    getAttribute: function () {
      return null;
    },
    querySelector: function () {
      return createPrismVmElementStub();
    },
    querySelectorAll: function () {
      return [];
    },
    addEventListener: function () {},
    removeEventListener: function () {},
    focus: function () {},
    click: function () {},
    remove: function () {}
  };
  return el;
}

/**
 * PB-S-007 E — ensure PRISM_GAM_CANONICAL_ASSEMBLER is present in vm sandboxes.
 * Custom lib lists often omit lib/gam-canonical-assembler.js; production Copy/Run
 * requires the global. Opt out with skipGamCanonicalAssemblerInject for fail-closed proofs.
 */
function ensureGamCanonicalAssemblerInSandbox(sandbox, repoRoot) {
  var root = repoRoot || path.resolve(__dirname, "..");
  if (
    (sandbox && sandbox.PRISM_GAM_CANONICAL_ASSEMBLER) ||
    (sandbox &&
      sandbox.window &&
      sandbox.window.PRISM_GAM_CANONICAL_ASSEMBLER)
  ) {
    if (
      sandbox.window &&
      sandbox.PRISM_GAM_CANONICAL_ASSEMBLER &&
      !sandbox.window.PRISM_GAM_CANONICAL_ASSEMBLER
    ) {
      sandbox.window.PRISM_GAM_CANONICAL_ASSEMBLER =
        sandbox.PRISM_GAM_CANONICAL_ASSEMBLER;
    }
    return sandbox.window
      ? sandbox.window.PRISM_GAM_CANONICAL_ASSEMBLER
      : sandbox.PRISM_GAM_CANONICAL_ASSEMBLER;
  }
  var rel = "lib/gam-canonical-assembler.js";
  vm.runInContext(fs.readFileSync(path.join(root, rel), "utf8"), sandbox, {
    filename: rel
  });
  if (sandbox.window && sandbox.PRISM_GAM_CANONICAL_ASSEMBLER) {
    sandbox.window.PRISM_GAM_CANONICAL_ASSEMBLER =
      sandbox.PRISM_GAM_CANONICAL_ASSEMBLER;
  }
  return sandbox.window
    ? sandbox.window.PRISM_GAM_CANONICAL_ASSEMBLER
    : sandbox.PRISM_GAM_CANONICAL_ASSEMBLER;
}

/**
 * PB-S-007 — ensure PRISM_FIRST_CLASS_WORKFLOW_FAMILY is present in vm sandboxes.
 * Product identity (Interactive / Expository / Assessment Pack) depends on it.
 */
function ensureFirstClassWorkflowFamilyInSandbox(sandbox, repoRoot) {
  var root = repoRoot || path.resolve(__dirname, "..");
  if (
    (sandbox && sandbox.PRISM_FIRST_CLASS_WORKFLOW_FAMILY) ||
    (sandbox &&
      sandbox.window &&
      sandbox.window.PRISM_FIRST_CLASS_WORKFLOW_FAMILY)
  ) {
    if (
      sandbox.window &&
      sandbox.PRISM_FIRST_CLASS_WORKFLOW_FAMILY &&
      !sandbox.window.PRISM_FIRST_CLASS_WORKFLOW_FAMILY
    ) {
      sandbox.window.PRISM_FIRST_CLASS_WORKFLOW_FAMILY =
        sandbox.PRISM_FIRST_CLASS_WORKFLOW_FAMILY;
    }
    return sandbox.window
      ? sandbox.window.PRISM_FIRST_CLASS_WORKFLOW_FAMILY
      : sandbox.PRISM_FIRST_CLASS_WORKFLOW_FAMILY;
  }
  var rel = "lib/first-class-workflow-family.js";
  vm.runInContext(fs.readFileSync(path.join(root, rel), "utf8"), sandbox, {
    filename: rel
  });
  if (sandbox.window && sandbox.PRISM_FIRST_CLASS_WORKFLOW_FAMILY) {
    sandbox.window.PRISM_FIRST_CLASS_WORKFLOW_FAMILY =
      sandbox.PRISM_FIRST_CLASS_WORKFLOW_FAMILY;
  }
  return sandbox.window
    ? sandbox.window.PRISM_FIRST_CLASS_WORKFLOW_FAMILY
    : sandbox.PRISM_FIRST_CLASS_WORKFLOW_FAMILY;
}

/**
 * D-014 RC1 — canonical app.js vm harness for Node tests that exercise learner export.
 * Creates document/window stubs, loads libs (injects vNext by default), runs app.js.
 */
function loadPrismAppJsTestApi(options) {
  var opts = options && typeof options === "object" ? options : {};
  var root = opts.repoRoot || path.resolve(__dirname, "..");
  var appJsPath = path.join(root, "app.js");
  var source = fs.readFileSync(appJsPath, "utf8");
  var sandbox = {
    console: console,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    Promise: Promise,
    _: {
      debounce: function (fn) {
        return fn;
      }
    }
  };
  var elementStore = new Map();
  var documentStub = {
    readyState: "complete",
    addEventListener: function () {},
    createElement: function () {
      return createPrismVmElementStub();
    },
    getElementById: function (id) {
      if (!elementStore.has(id)) elementStore.set(id, createPrismVmElementStub());
      return elementStore.get(id);
    },
    querySelector: function () {
      return createPrismVmElementStub();
    },
    querySelectorAll: function () {
      return [];
    },
    body: {
      appendChild: function () {},
      removeChild: function () {}
    }
  };
  var windowStub = {
    document: documentStub,
    addEventListener: function () {},
    removeEventListener: function () {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: {
      debounce: function (fn) {
        return fn;
      }
    },
    localStorage: {
      getItem: function () {
        return null;
      },
      setItem: function () {}
    },
    URL: {
      createObjectURL: function () {
        return "blob:test";
      },
      revokeObjectURL: function () {}
    },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: function () {
        return Promise.resolve({ added: 0, updated: 0, skipped: 0 });
      },
      getAllPrompts: function () {
        return Promise.resolve([]);
      }
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  var libs =
    Array.isArray(opts.libs) && opts.libs.length ? opts.libs.slice() : PEDAGOGICAL_ICON_LIBS.slice();
  if (Array.isArray(opts.extraLibs) && opts.extraLibs.length) {
    libs = libs.concat(opts.extraLibs);
  }
  runPrismLibScriptsInSandbox(sandbox, root, libs, {
    skipLearnerRendererVNextInject: !!opts.skipLearnerRendererVNextInject,
    skipGamCanonicalAssemblerInject: !!opts.skipGamCanonicalAssemblerInject
  });
  vm.runInContext(source, sandbox, { filename: "app.js" });
  var api = sandbox.window.__PRISM_TEST_API;
  if (!api) {
    throw new Error("Expected window.__PRISM_TEST_API after loading app.js in test sandbox.");
  }
  return { api: api, sandbox: sandbox, window: sandbox.window };
}

function applyDlaIntellectualCoherenceBridgeForTests(page) {
  if (!page || !Array.isArray(page.activities)) return page;
  page.activities.forEach(function (activity, index) {
    if (!activity || typeof activity !== "object") return;
    var bridge =
      index === 0
        ? "Connect the page orientation and learning purpose to this first activity's reasoning demand."
        : "Carry forward prior reasoning and evidence from earlier activities into this task.";
    activity.intellectual_coherence_bridge = bridge;
  });
  return page;
}

function patchDlaEnrichBridgeForTests(dlaEnrichModule) {
  if (!dlaEnrichModule || dlaEnrichModule.__PRISM_TEST_BRIDGE_PATCHED) return;
  var original = dlaEnrichModule.enrichPageWithDla;
  if (typeof original !== "function") return;
  dlaEnrichModule.enrichPageWithDla = function enrichPageWithDlaForTests(shell, options) {
    var page = original.call(this, shell, options);
    return applyDlaIntellectualCoherenceBridgeForTests(page);
  };
  dlaEnrichModule.__PRISM_TEST_BRIDGE_PATCHED = true;
}

function wirePageVnextAssembleForTests(windowStub, repoRoot) {
  if (!windowStub) return;
  var root = repoRoot || path.resolve(__dirname, "..");
  var assemble = require(path.join(root, "lib", "page-vnext-assemble.js"));
  windowStub.PRISM_PAGE_VNEXT_ASSEMBLE = assemble;
}

function buildLegacyEpisodePlanWorkflow(overrides) {
  return Object.assign(
    {
      id: "wf-legacy-test",
      goal: "Legacy workflow test",
      pageEnrichmentV2: false,
      partialPageOutputs: false,
      steps: [
        { id: "lo_step", title: "Define Learning Outcomes", outputName: "learning_outcomes" },
        {
          id: "ep_step",
          title: "Design Episode Plan",
          outputName: "episode_plans",
          canonical_step_id: "step_design_episode_plan"
        },
        {
          id: "dla_step",
          title: "Design Learning Activities",
          outputName: "learning_activities",
          canonical_step_id: "step_design_learning_activities"
        },
        {
          id: "gam_step",
          title: "Generate Activity Materials",
          outputName: "activity_materials",
          canonical_step_id: "step_generate_activity_materials"
        }
      ]
    },
    overrides || {}
  );
}

function ensureActivityEpisodePlanBeats(activity) {
  var row = activity && typeof activity === "object" ? Object.assign({}, activity) : activity;
  if (!row || typeof row !== "object") return row;
  if (!String(row.expected_output || "").trim()) {
    row.expected_output = "Completed task output.";
  }
  if (!row.episode_plan || !Array.isArray(row.episode_plan.beats)) {
    row.episode_plan = {
      archetype: "understand",
      beats: [
        { function: "orientation" },
        { function: "explanation" },
        { function: "verification" }
      ]
    };
  }
  return row;
}

function convertSectionsPageForVnextRender(page) {
  if (!page || typeof page !== "object") return page;
  if (Array.isArray(page.activities) && page.activities.length) {
    var activitiesClone = JSON.parse(JSON.stringify(page));
    activitiesClone.activities = activitiesClone.activities.map(ensureActivityEpisodePlanBeats);
    return activitiesClone;
  }
  var clone = JSON.parse(JSON.stringify(page));
  var rows = [];
  (clone.sections || []).forEach(function (section) {
    if (!section || typeof section !== "object") return;
    var sid = String(section.section_id || section.id || "").toLowerCase();
    var heading = String(section.heading || section.title || "").toLowerCase();
    if (sid !== "learning_activities" && heading.indexOf("learning activit") === -1) return;
    var content = section.content;
    if (Array.isArray(content)) rows = rows.concat(content);
    else if (content && Array.isArray(content.content)) rows = rows.concat(content.content);
    else if (content && Array.isArray(content.activities)) rows = rows.concat(content.activities);
  });
  clone.schema_version = clone.schema_version || "2.0.0";
  clone.page_profile =
    typeof clone.page_profile === "object" && clone.page_profile
      ? clone.page_profile
      : { profile_type: String(clone.page_profile || "learner") };
  clone.assembly_state = clone.assembly_state || {
    enriched_by: ["design_page"],
    current_stage: "design_page"
  };
  clone.activities = rows.map(function (row) {
    var activity = ensureActivityEpisodePlanBeats(Object.assign({}, row));
    if (activity.materials && !Array.isArray(activity.materials)) {
      activity.materials = Object.keys(activity.materials).map(function (key) {
        return {
          material_id: String(activity.activity_id || "A1") + "-" + key,
          material_type: /checklist/i.test(key)
            ? "checklist"
            : /worked|example/i.test(key)
              ? "worked_example"
              : "text",
          title: key.replace(/_/g, " "),
          body: activity.materials[key],
          body_format: "markdown"
        };
      });
    } else if (!Array.isArray(activity.materials)) {
      activity.materials = [];
    }
    return activity;
  });
  return clone;
}

function renderUtilityPageHtmlForTest(api, page, options) {
  var opts = options && typeof options === "object" ? options : {};
  var renderPage = convertSectionsPageForVnextRender(page);
  return api.renderLearnerPageForTest(
    renderPage,
    Object.assign(
      {
        applyCompositionValidation: false,
        skipWorkflowAssembly: true
      },
      opts
    )
  );
}

/**
 * PB-S-007 C01 — wrap test-API render/export helpers so sections-shaped fixtures
 * are lifted to activities[] before hitting current vNext validate-input.
 * Does not change production app.js behaviour.
 */
function installVnextPageShapeCompatForTests(api) {
  if (!api || api.__PRISM_VNEXT_PAGE_SHAPE_COMPAT) return api;
  if (typeof api.buildUtilityStructuredHtmlForTest === "function") {
    var buildOrig = api.buildUtilityStructuredHtmlForTest.bind(api);
    api.buildUtilityStructuredHtmlForTest = function (page, sectionOrder, opts) {
      return buildOrig(convertSectionsPageForVnextRender(page), sectionOrder, opts);
    };
  }
  if (typeof api.runUtilityPageExportPipelineForTest === "function") {
    var exportOrig = api.runUtilityPageExportPipelineForTest.bind(api);
    api.runUtilityPageExportPipelineForTest = function (page, opts) {
      return exportOrig(convertSectionsPageForVnextRender(page), opts);
    };
  }
  if (typeof api.renderLearnerPageForTest === "function") {
    var renderOrig = api.renderLearnerPageForTest.bind(api);
    api.renderLearnerPageForTest = function (page, opts) {
      return renderOrig(convertSectionsPageForVnextRender(page), opts);
    };
  }
  api.__PRISM_VNEXT_PAGE_SHAPE_COMPAT = true;
  return api;
}

module.exports = {
  DEFAULT_LIBS,
  PEDAGOGICAL_ICON_LIBS,
  LEARNER_RENDERER_VNEXT_BROWSER_LIB,
  runPrismLibScriptsInSandbox,
  wireBrowserGlobalThis,
  loadLearnerRendererVNextBrowserInSandbox,
  injectLearnerRendererVNextInSandbox,
  ensureGamCanonicalAssemblerInSandbox,
  ensureFirstClassWorkflowFamilyInSandbox,
  loadPrismAppJsTestApi,
  createPrismVmElementStub,
  applyDlaIntellectualCoherenceBridgeForTests,
  patchDlaEnrichBridgeForTests,
  wirePageVnextAssembleForTests,
  buildLegacyEpisodePlanWorkflow,
  convertSectionsPageForVnextRender,
  renderUtilityPageHtmlForTest,
  installVnextPageShapeCompatForTests
};
