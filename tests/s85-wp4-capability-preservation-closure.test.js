/**
 * Sprint 85 WP4 — Adjustments extent, domain-guidance cold cache, closing, maths.
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

const contracts = require("../lib/expository-contracts.js");
const guidance = require("../lib/expository-domain-guidance.js");
const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model.js");
const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext/render-learner-page.js");
const assemble = require("../lib/page-vnext-assemble.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

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
    click() {},
    querySelector(sel) {
      return (this._qs && this._qs[sel]) || null;
    }
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    fetch: async () => ({ ok: false, text: async () => "" }),
    XMLHttpRequest: function XMLHttpRequest() {
      this.status = 0;
      this.responseText = "";
      this.open = function () {};
      this.send = function () {};
    },
    require,
    process,
    __dirname: repoRoot,
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
    WorkflowGenerationContext: null
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(
    fs.readFileSync(path.join(repoRoot, "workflowGenerationContext.js"), "utf8"),
    sandbox,
    { filename: "workflowGenerationContext.js" }
  );
  windowStub.WorkflowGenerationContext = sandbox.window.WorkflowGenerationContext;
  runPrismLibScriptsInSandbox(
    sandbox,
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat([
      "lib/expository-contracts.js",
      "lib/expository-sibling-prompts.js",
      "lib/expository-domain-guidance.js",
      "lib/page-vnext-assemble.js"
    ])
  );
  wirePageVnextAssembleForTests(windowStub, repoRoot);
  injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
  // UMD libs attach to sandbox/globalThis; mirror onto window for app.js resolvers.
  [
    "PrismExpositoryContracts",
    "PrismExpositorySiblingPrompts",
    "PrismExpositoryDomainGuidance"
  ].forEach((key) => {
    if (sandbox[key]) windowStub[key] = sandbox[key];
  });
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api, sandbox, windowStub };
}

const { api, windowStub } = loadPrismTestApi();

function makeExpositoryWf(overrides) {
  return Object.assign(
    {
      id: "wf-expo-wp4",
      name: "Create an Expository Resource: formative",
      ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_EXPOSITORY,
      selectedDomains: ["general", "learning-design"],
      workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true },
      workflowBriefResolution: {
        initialBrief: {
          goal: "Build a short formative-assessment resource.",
          audience: "University lecturers"
        },
        resolvedFactors: {
          topic: "Formative assessment",
          scope_scale: "about a 10-minute read",
          expository_extent: contracts.normalizeExpositoryScopeExtent("about a 10-minute read"),
          duration_minutes: 10
        }
      },
      steps: [
        {
          id: "ejp_step",
          title: "Expository Journey Plan",
          canonical_step_id: "step_expository_journey_plan",
          outputName: "expository_journey_plan"
        },
        {
          id: "xd_step",
          title: "Expository Development",
          canonical_step_id: "step_expository_development",
          outputName: "expository_development"
        },
        {
          id: "dp_step",
          title: "Design Page",
          canonical_step_id: "step_design_page",
          outputName: "page"
        }
      ]
    },
    overrides || {}
  );
}

function makeInteractiveWf() {
  return {
    id: "wf-interactive-wp4",
    name: "Self-study page",
    ldCreateOutputType: "self_study_resource",
    selectedDomains: ["general", "learning-design"],
    workflowBriefResolution: {
      initialBrief: { goal: "Create a 60-minute self-study page.", audience: "Undergraduates" },
      resolvedFactors: { topic: "Elizabeth I", duration_minutes: 60 }
    },
    steps: [
      {
        id: "dla_step",
        title: "Design Learning Activities",
        canonical_step_id: "step_design_learning_activities",
        outputName: "learning_activities"
      }
    ]
  };
}

// ---------------------------------------------------------------------------
// A. Adjustments
// ---------------------------------------------------------------------------

test("WP4 Adjustments: Expository exposes Scope/extent and hides Duration", () => {
  const expo = makeExpositoryWf();
  const interactive = makeInteractiveWf();
  const registry = api.getAdjustmentsParameterRegistry();
  const duration = registry.find((r) => r.id === "duration_minutes");
  const scope = registry.find((r) => r.id === "expository_scope");
  assert.ok(duration);
  assert.ok(scope);
  assert.equal(scope.label, "Scope / extent");
  assert.equal(api.isAdjustmentsParameterApplicable(duration, expo), false);
  assert.equal(api.isAdjustmentsParameterApplicable(scope, expo), true);
  assert.equal(api.isAdjustmentsParameterApplicable(duration, interactive), true);
  assert.equal(api.isAdjustmentsParameterApplicable(scope, interactive), false);

  const topic = registry.find((r) => r.id === "topic");
  const goal = registry.find((r) => r.id === "goal");
  const audience = registry.find((r) => r.id === "audience");
  assert.equal(api.isAdjustmentsParameterApplicable(topic, expo), true);
  assert.equal(api.isAdjustmentsParameterApplicable(goal, expo), true);
  assert.equal(api.isAdjustmentsParameterApplicable(audience, expo), true);

  const itemCount = registry.find((r) => r.id === "assessment_item_count");
  assert.equal(api.isAdjustmentsParameterApplicable(itemCount, expo), false);
});

test("WP4 Adjustments: changing Scope/extent updates authoritative Expository extent", () => {
  const wf = makeExpositoryWf();
  const commissioned = api.resolveAuthoritativeExpositoryExtentFactors(wf);
  assert.match(commissioned.scope_scale, /10-minute read/i);
  assert.equal(commissioned.fromAdjustment, false);
  assert.ok(commissioned.expository_extent);
  assert.equal(commissioned.expository_extent.scope_text, "about a 10-minute read");
  assert.ok(
    commissioned.expository_extent.reading_minutes != null ||
      commissioned.expository_extent.words_equivalent != null ||
      commissioned.expository_extent.interpretation === "qualitative"
  );

  api.setWorkflowAdjustmentParameterValue(wf, "expository_scope", "around 2,000 words");
  const adjusted = api.resolveAuthoritativeExpositoryExtentFactors(wf);
  assert.equal(adjusted.fromAdjustment, true);
  assert.match(adjusted.scope_scale, /2,000 words/i);
  assert.equal(adjusted.expository_extent.words_equivalent, 2000);

  const ctx = api.resolveEffectiveRunContext(wf);
  assert.equal(ctx.provenance.expository_scope, "adjustment");
  assert.match(String(ctx.parameters.expository_scope), /2,000 words/i);
  assert.equal(ctx.provenance.duration_minutes, "not_applicable");
  assert.equal(Object.prototype.hasOwnProperty.call(ctx.parameters, "duration_minutes"), false);

  const block = api.buildEffectiveWorkflowContextBlock(wf, wf.steps[0]);
  assert.match(block, /Scope \/ extent:/i);
  assert.match(block, /2,000 words/i);
  assert.doesNotMatch(block, /^Duration:/m);
});

test("WP4 Adjustments: EJP capture stamp receives adjusted extent on rerun", () => {
  const wf = makeExpositoryWf();
  api.setWorkflowAdjustmentParameterValue(wf, "expository_scope", "concise");
  const auth = api.resolveAuthoritativeExpositoryExtentFactors(wf);
  const ejp = {
    artifact_type: "expository_journey_plan",
    schema_version: "1.0.0",
    title: "Formative assessment",
    audience: "Lecturers",
    journey_intent: "Build a practical model.",
    sections: [
      {
        section_id: "S1",
        title: "Purpose",
        purpose: "Orient",
        knowledge_focus: "purpose",
        conceptual_move: "reframe",
        order: 1
      }
    ]
  };
  const stamped = api.attachExpositoryExtentFromFactors(ejp, auth, { overwrite: true });
  assert.ok(stamped.extent);
  assert.match(String(stamped.extent.scope_text || ""), /concise/i);
});

test("WP4 Adjustments: Interactive Duration remains commissioned/adjustable", () => {
  const wf = makeInteractiveWf();
  const ctx = api.resolveEffectiveRunContext(wf);
  assert.equal(ctx.parameters.duration_minutes, 60);
  assert.equal(ctx.provenance.duration_minutes, "commissioned");
  assert.equal(ctx.provenance.expository_scope, "not_applicable");
  api.setWorkflowAdjustmentParameterValue(wf, "duration_minutes", 30);
  assert.equal(api.resolveEffectiveWorkflowDurationMinutes(wf), 30);
  const block = api.buildEffectiveWorkflowContextBlock(wf, wf.steps[0]);
  assert.match(block, /Duration: 30 minutes/);
  assert.doesNotMatch(block, /Scope \/ extent:/i);
});

// ---------------------------------------------------------------------------
// B. Domain guidance cold cache
// ---------------------------------------------------------------------------

test("WP4 domain guidance: cold WGC cache still loads filtered General+LD rules", () => {
  const wgc = windowStub.WorkflowGenerationContext;
  assert.ok(wgc);
  // Simulate cold cache: wipe known prompt-rule paths.
  const paths = guidance.resolvePromptRulePaths(["general", "learning-design"]);
  paths.forEach((row) => wgc.putCachedFileText(row.path, ""));
  paths.forEach((row) => {
    assert.equal(String(wgc.getCachedFileText(row.path) || "").trim(), "");
  });

  const wf = makeExpositoryWf();
  const loaded = api.collectExpositoryDomainGuidanceTexts(wf.selectedDomains);
  assert.ok(Object.keys(loaded.textsByPath).length >= 2);
  const generalPath = paths.find((p) => p.domainId === "general").path;
  const ldPath = paths.find((p) => p.domainId === "learning-design").path;
  assert.match(String(loaded.textsByPath[generalPath] || ""), /ground/i);
  assert.ok(String(loaded.textsByPath[ldPath] || "").length > 200);

  const draft = api.applyExpositoryDomainGuidanceToDraft(
    "PRIMARY IDENTITY — EXPOSITORY JOURNEY PLAN\n\nPlan the journey.",
    wf.steps[0],
    wf
  );
  assert.match(draft, /EXPOSITORY-DOMAIN-GUIDANCE/);
  assert.doesNotMatch(draft, /Domain prompt-rule files were not available in cache/);
  // Interactive rhetoric filtered from LD rules.
  assert.doesNotMatch(draft, /Learner-action rhetoric/i);
  assert.doesNotMatch(draft, /For activities:\s/i);
});

// ---------------------------------------------------------------------------
// C. Closing paragraph
// ---------------------------------------------------------------------------

test("WP4 closing_paragraph: Expository assemble strips page-level close (S87 EQ8)", () => {
  const ejp = {
    artifact_type: "expository_journey_plan",
    schema_version: "1.0.0",
    title: "Formative assessment",
    audience: "Lecturers",
    journey_intent: "Build a practical model.",
    commissioned_purpose: "Explain formative assessment as an evidence-to-action loop.",
    epistemic_form: "practical conceptual model",
    sections: [
      {
        section_id: "S1",
        title: "Purpose",
        purpose: "Orient",
        knowledge_focus: "purpose",
        conceptual_move: "reframe",
        order: 1
      },
      {
        section_id: "S2",
        title: "Evidence to action",
        purpose: "Model",
        knowledge_focus: "loop",
        conceptual_move: "establish",
        order: 2
      }
    ]
  };
  const xd = {
    artifact_type: "expository_development",
    schema_version: "1.0.0",
    sections: [
      {
        section_id: "S1",
        explanation_intent: "Open purpose.",
        exposition: "Formative assessment begins from purpose, not instrument choice.",
        invitations_to_think: [],
        continuity_hooks: [],
        materials_commission: []
      },
      {
        section_id: "S2",
        explanation_intent: "Establish loop and consolidate.",
        exposition:
          "Intended learning, evidence, interpretation and action form a recurring relationship the learner can now carry forward.",
        invitations_to_think: [],
        continuity_hooks: [],
        materials_commission: []
      }
    ]
  };
  const dp = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Formative assessment: from evidence to action",
    page_synthesis: {
      overview: "A short orientation to the resource.",
      learning_purpose: "Develop a practical formative model.",
      knowledge_summary: "Evidence becomes formative through interpretation and action.",
      closing_paragraph:
        "Carry away the loop itself: intended learning, evidence, interpretation and action — and ask what useful next step the evidence supports."
    },
    assembly_state: { current_stage: "design_page", enriched_by: ["design_page"] }
  };

  const assembled = assemble.assembleVNextPageFromPartials({
    expository_journey_plan: ejp,
    expository_development: xd,
    design_page: dp
  });
  assert.equal(assembled.ok, true);
  assert.equal(assembled.page.page_synthesis.closing_paragraph, undefined);
  assert.equal(assembled.page.page_synthesis.overview, undefined);
  assert.match(assembled.page.sections[1].exposition, /recurring relationship/i);

  const model = buildPageModel(assembled.page);
  assert.equal(model.ok, true, JSON.stringify(model.errors || []));
  assert.equal(String(model.model.closingParagraph || "").trim(), "");
  assert.equal(model.model.orientationSections.length, 0);

  const html = String(renderLearnerPageHtml(assembled.page).html || "");
  assert.doesNotMatch(html, /data-region="page-closing"/);
  assert.doesNotMatch(html, /data-region="orientation"/);
  assert.match(html, /data-region="exposition"/);
  assert.match(html, /recurring relationship/i);
  assert.doesNotMatch(html, /data-region="study-tips"/);
  assert.doesNotMatch(html, /data-workspace-kind=/);
  assert.doesNotMatch(html, /data-region="activities"/);
});

test("WP4 closing_paragraph: empty omits cleanly", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "No closing",
    activities: [],
    sections: [
      {
        section_id: "S1",
        title: "One",
        exposition: "Prose remains.",
        materials: []
      }
    ],
    page_synthesis: {
      overview: "Overview text",
      closing_paragraph: ""
    },
    assembly_state: {
      current_stage: "expository_development",
      enriched_by: ["expository_journey_plan", "expository_development"]
    }
  };
  const model = buildPageModel(page);
  assert.equal(model.ok, true);
  assert.equal(String(model.model.closingParagraph || "").trim(), "");
  const html = String(renderLearnerPageHtml(page).html || "");
  assert.doesNotMatch(html, /data-region="page-closing"/);
});

test("WP4 closing: Interactive study_tips fixture unchanged", () => {
  const interactive = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "tests/fixtures/page-render/roman-roads-page.json"), "utf8")
  );
  const html = String(renderLearnerPageHtml(interactive).html || "");
  assert.match(html, /data-region="activities"/);
  assert.doesNotMatch(html, /data-region="page-closing"/);
  assert.doesNotMatch(html, /data-expository-structured=/);
});

// ---------------------------------------------------------------------------
// D. Formal notation survival
// ---------------------------------------------------------------------------

test("WP4 formal notation: ordinary TeX delimiters survive Expository render/export", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Notation in exposition",
    activities: [],
    sections: [
      {
        section_id: "S1",
        title: "A simple identity",
        exposition:
          "Recall the identity \\( (a+b)^2 = a^2 + 2ab + b^2 \\). It organises expansion without inventing new stages.",
        materials: [
          {
            material_id: "mat-note",
            section_id: "S1",
            kind: "prose",
            body: "Keep the expanded form \\( a^2 + 2ab + b^2 \\) aligned with the squared binomial."
          }
        ]
      }
    ],
    page_synthesis: { overview: "A short notation check." },
    assembly_state: {
      current_stage: "expository_materials",
      enriched_by: ["expository_journey_plan", "expository_development", "expository_materials"]
    }
  };
  const html = String(renderLearnerPageHtml(page).html || "");
  assert.match(html, /\\\(\s*\(a\+b\)\^2/);
  assert.match(html, /a\^2 \+ 2ab \+ b\^2/);
  assert.doesNotMatch(html, /\[object Object\]/);
  assert.doesNotMatch(html, /@@PRISMMATH/);
});
