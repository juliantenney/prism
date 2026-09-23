/**
 * S87-T-007 live finding — Expository Design Page must not require
 * page_synthesis.knowledge_summary (EQ7 / T-003 policy).
 *
 * Reproduces the workflow validation path that blocked a fresh Bayes Expository
 * Design Page with page_synthesis: {} and no knowledge_summary section.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const assemble = require("../lib/page-vnext-assemble.js");
const contracts = require("../lib/expository-contracts.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturesDir = path.join(__dirname, "fixtures", "page-assemble");

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
    setTimeout,
    clearTimeout,
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem() {} }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(
    sandbox,
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat([
      "lib/sprint38-visual-affordances.js",
      "lib/visual-planning-contract.js",
      "lib/expository-sibling-prompts.js",
      "lib/expository-contracts.js",
      "lib/page-vnext-assemble.js"
    ])
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

const api = loadPrismTestApi();

function makeExpositoryWf() {
  return {
    id: "wf-s87-t007-bayes-expo",
    name: "Create an Expository Resource: Bayes",
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_EXPOSITORY,
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true },
    steps: [
      {
        id: "ejp1",
        title: "Expository Journey Plan",
        canonical_step_id: "step_expository_journey_plan",
        outputName: "expository_journey_plan"
      },
      {
        id: "xd1",
        title: "Expository Development",
        canonical_step_id: "step_expository_development",
        outputName: "expository_development"
      },
      {
        id: "xm1",
        title: "Expository Materials",
        canonical_step_id: "step_expository_materials",
        outputName: "expository_materials"
      },
      {
        id: "dp1",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "page"
      }
    ]
  };
}

function makeEq7ExpositoryDpCapture(overrides) {
  return Object.assign(
    {
      artifact_type: "page",
      schema_version: "2.0.0",
      title: "Bayes: updating beliefs with evidence",
      // Live failure shape: empty synthesis — no overview / purpose / KS / closing.
      page_synthesis: {},
      visual_affordance_schema_version: "38.4",
      activities_visual_review: [],
      visual_affordances: [
        {
          affordance_id: "va-S2-bayes-01",
          scope: "section",
          section_id: "S2",
          visual_decision: "generate",
          visual_slot: "section-after-content",
          tier: "essential",
          purpose: "mechanism",
          preferred_representation: "process",
          subject: "Belief update loop",
          context: "Visual brief: show how prior and evidence update a posterior.",
          evidence_anchors: ["S2.purpose", "S2.synthesis"],
          rationale: "Makes the update relationship inspectable.",
          reasoning_supported: "Learners connect prior, evidence, and posterior.",
          learner_stage: "post_reasoning",
          anti_spoiler: false,
          representation_avoid: ["summary_table", "generic_infographic"],
          canonical_discipline_note: "Keep the update relationship qualitative.",
          requires_exact_data_match: false,
          must_show: ["prior", "evidence", "posterior"],
          must_not_show: ["numeric posterior without source"],
          allowed_claims: ["Evidence updates the prior toward a posterior."],
          disallowed_claims: ["The posterior is certain."],
          source_basis: "S2.purpose; S2.synthesis",
          caption_intent: "Prior and evidence update a posterior.",
          alt_text: "Diagram of prior, evidence, and posterior.",
          detailed_description: "A simple update loop from prior through evidence to posterior.",
          discipline_risk_level: "low"
        }
      ],
      assembly_state: {
        current_stage: "design_page",
        enriched_by: ["design_page"]
      }
    },
    overrides || {}
  );
}

test("LIVE PATH: Expository DP with empty page_synthesis passes partial-step validation", () => {
  const wf = makeExpositoryWf();
  const step = wf.steps[3];
  const capture = makeEq7ExpositoryDpCapture();

  assert.equal(Object.keys(capture.page_synthesis).length, 0);
  assert.ok(!Array.isArray(capture.sections) || capture.sections.length === 0);

  const partial = api.validatePartialPageCaptureForStep(capture, step, wf);
  assert.equal(partial.ok, true, (partial.errors || []).join("; "));
  assert.doesNotMatch((partial.errors || []).join("; "), /knowledge summary/i);

  const orPath = api.validateDesignPageOrPageCapture(capture, wf, step);
  assert.equal(orPath.ok, true, (orPath.errors || []).join("; "));

  const strict = api.validateStrictJsonWorkflowRunStepCaptureForTest(
    JSON.stringify(capture, null, 2),
    step,
    wf
  );
  assert.equal(strict.ok, true, (strict.errors || []).join("; "));
});

test("LIVE PATH: Expository DP without knowledge_summary section still validates", () => {
  const wf = makeExpositoryWf();
  const step = wf.steps[3];
  const capture = makeEq7ExpositoryDpCapture({
    page_synthesis: {},
    sections: [
      {
        section_id: "not_knowledge_summary",
        heading: "Should not satisfy KS requirement",
        content: "Irrelevant"
      }
    ]
  });
  const check = api.validateDesignPagePartialPageCapture(capture, wf);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("Interactive DP without knowledge_summary still fails (unchanged)", () => {
  const dpPartial = JSON.parse(
    fs.readFileSync(path.join(fixturesDir, "dp-partial.json"), "utf8")
  );
  delete dpPartial.page_synthesis.knowledge_summary;
  dpPartial.sections = (dpPartial.sections || []).filter(
    (row) => String(row && row.section_id || "").toLowerCase() !== "knowledge_summary"
  );
  const interactiveWf = {
    id: "wf-interactive-dp",
    name: "Self-study",
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_SELF_STUDY,
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true },
    steps: [
      {
        id: "dp1",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "page"
      }
    ]
  };
  const check = api.validateDesignPagePartialPageCapture(dpPartial, interactiveWf);
  assert.equal(check.ok, false);
  assert.match((check.errors || []).join("; "), /knowledge summary required/i);

  // Without workflow context, historical Interactive requirement remains.
  const noWf = api.validateDesignPagePartialPageCapture(dpPartial);
  assert.equal(noWf.ok, false);
  assert.match((noWf.errors || []).join("; "), /knowledge summary required/i);
});

test("Malformed Expository DP still fails for genuinely required fields", () => {
  const wf = makeExpositoryWf();
  const step = wf.steps[3];
  const missingSchema = makeEq7ExpositoryDpCapture();
  delete missingSchema.schema_version;
  const check = api.validateDesignPagePartialPageCapture(missingSchema, wf);
  assert.equal(check.ok, false);
  assert.match((check.errors || []).join("; "), /schema_version/i);

  const missingSynthesis = makeEq7ExpositoryDpCapture();
  delete missingSynthesis.page_synthesis;
  const check2 = api.validateDesignPagePartialPageCapture(missingSynthesis, wf);
  assert.equal(check2.ok, false);
  assert.match((check2.errors || []).join("; "), /page_synthesis and\/or sections required/i);

  // Wrong artifact_type is not auto-corrected and must fail closed on the live path.
  const badType = makeEq7ExpositoryDpCapture({ artifact_type: "learning_content" });
  const orPath = api.validateDesignPageOrPageCapture(badType, wf, step);
  assert.equal(orPath.ok, false);
  assert.match((orPath.errors || []).join("; "), /unrecognized Design Page capture shape|artifact_type/i);
});

test("T-003 assemble still strips Expository prospectus furniture", () => {
  const ejp = contracts.normalizeExpositoryJourneyPlan({
    title: "Bayes",
    audience: "learners",
    journey_intent: "Construct updating understanding.",
    commissioned_purpose: "Explain how evidence updates beliefs.",
    epistemic_form: "mechanism and evidential updating",
    sections: [
      {
        section_id: "S1",
        title: "Priors",
        purpose: "Establish prior",
        knowledge_focus: "prior belief",
        conceptual_move: "establish"
      },
      {
        section_id: "S2",
        title: "Updating",
        purpose: "Consolidate update",
        knowledge_focus: "posterior",
        conceptual_move: "consolidate"
      }
    ]
  });
  const xd = contracts.normalizeExpositoryDevelopment({
    sections: [
      {
        section_id: "S1",
        explanation_intent: "Set prior.",
        exposition: "A prior expresses belief before observing the new evidence."
      },
      {
        section_id: "S2",
        explanation_intent: "Consolidate update.",
        exposition:
          "Evidence revises the prior toward a posterior; the close belongs in this final section."
      }
    ]
  });
  const assembled = assemble.assembleVNextPageFromPartials({
    expository_journey_plan: ejp,
    expository_development: xd,
    design_page: {
      artifact_type: "page",
      schema_version: "2.0.0",
      title: "Bayes: updating beliefs with evidence",
      page_synthesis: {
        overview: "should be stripped",
        learning_purpose: "should be stripped",
        knowledge_summary: "should be stripped",
        closing_paragraph: "should be stripped"
      },
      assembly_state: { current_stage: "design_page", enriched_by: ["design_page"] }
    }
  });
  assert.equal(assembled.ok, true, JSON.stringify(assembled.errors || []));
  assert.deepEqual(assembled.page.page_synthesis, {});
  assert.equal(assembled.page.page_synthesis.knowledge_summary, undefined);
  assert.equal(assembled.page.page_synthesis.closing_paragraph, undefined);
});
