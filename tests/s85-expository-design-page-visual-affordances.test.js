/**
 * Sprint 85 — Expository Design Page section-scoped visual affordances.
 * Interactive Sprint 38 / VPC activity|page contracts remain the protected baseline.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const sibling = require("../lib/expository-sibling-prompts.js");
const sprint38 = require("../lib/sprint38-visual-affordances.js");
const vpc = require("../lib/visual-planning-contract.js");
const planner = require("../lib/prism-visual-jobs-planner.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

function makeS5FeedbackLoopAffordance(overrides) {
  return Object.assign(
    {
      affordance_id: "va-S5-feedback-loop-01",
      scope: "section",
      section_id: "S5",
      visual_decision: "generate",
      visual_slot: "section-after-content",
      tier: "essential",
      purpose: "synthesis",
      preferred_representation: "process",
      subject: "Integrating feedback-loop diagram",
      context:
        "Visual brief: synthesise the closed feedback loop across upstream sections so learners can see how earlier moves integrate; preserve claim bounds from S5 substance and avoid inventing activity worksheets.",
      evidence_anchors: [
        "S1.purpose",
        "S2.knowledge_focus",
        "S3.synthesis",
        "S4.purpose",
        "S5.synthesis"
      ],
      rationale:
        "Makes the integrative feedback loop inspectable at the journey synthesis point without inventing activities.",
      reasoning_supported: "Learners integrate prior section moves into one closed loop.",
      learner_stage: "post_reasoning",
      anti_spoiler: false,
      representation_avoid: ["generic_infographic", "topic_hero_image"],
      canonical_discipline_note: "Show only relationships warranted by upstream sections.",
      requires_exact_data_match: false,
      must_show: ["closed feedback loop", "labelled stage nodes from S1–S5"],
      must_not_show: ["unsupported causal shortcuts", "activity worksheets"],
      allowed_claims: ["Earlier sections contribute distinct moves that integrate in S5."],
      disallowed_claims: ["Claims absent from upstream substance."],
      source_basis: "S1.purpose; S5.synthesis",
      caption_intent: "Synthesis feedback loop across the expository journey.",
      alt_text: "Feedback-loop diagram integrating S1–S5 moves; detailed description follows.",
      detailed_description:
        "A closed process loop links the ordered section moves into one integrative cycle. Each node names a warranted stage from the upstream journey; arrows show return paths without inventing new mechanisms.",
      discipline_risk_level: "medium"
    },
    overrides || {}
  );
}

function makeExpositoryDpCapture(affordance) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Feedback loops in adaptive systems",
    page_synthesis: {
      overview: "Thin orientation to the authored journey.",
      learning_purpose: "Help learners integrate the feedback-loop arc.",
      knowledge_summary: "S5 consolidates the loop across prior sections."
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["design_page"]
    },
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [],
    visual_affordances: [affordance]
  };
}

function makeAssembledExpositoryPage(affordance) {
  const capture = makeExpositoryDpCapture(affordance);
  return Object.assign({}, capture, {
    activities: [],
    sections: [
      {
        section_id: "S1",
        title: "Signal",
        purpose: "Introduce the control signal",
        knowledge_focus: "inputs",
        synthesis: "signal established"
      },
      {
        section_id: "S2",
        title: "Sensor",
        purpose: "Sense deviation",
        knowledge_focus: "measurement",
        synthesis: "deviation detectable"
      },
      {
        section_id: "S3",
        title: "Comparator",
        purpose: "Compare to goal",
        knowledge_focus: "error",
        synthesis: "error computed"
      },
      {
        section_id: "S4",
        title: "Actuator",
        purpose: "Correct the system",
        knowledge_focus: "action",
        synthesis: "correction applied"
      },
      {
        section_id: "S5",
        title: "Integrating loop",
        purpose: "Synthesise the closed loop",
        knowledge_focus: "integration",
        synthesis: "closed feedback loop across S1–S4"
      }
    ],
    materials: [
      {
        material_id: "feedback_loop",
        section_id: "S5",
        kind: "diagram_commission",
        body: "Commissioned feedback-loop figure."
      }
    ]
  });
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
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
      getAttribute() { return null; },
      addEventListener() {},
      removeEventListener() {},
      focus() {},
      click() {}
    };
  }
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
    localStorage: { getItem: () => null, setItem() {} },
    PrismExpositorySiblingPrompts: sibling
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
      "lib/expository-contracts.js"
    ])
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

test("Expository DP sibling prompt requires full section-scoped graphics contract", () => {
  const body = sibling.resolveTemplate("design_page");
  assert.match(body, /scope": "section"|scope:\s*"section"|Allowed scopes:\s*"section"/i);
  assert.match(body, /section_id/);
  assert.match(body, /visual_affordance_schema_version/);
  assert.match(body, /activities_visual_review must be \[\]/);
  assert.match(body, /must_show/);
  assert.match(body, /preferred_representation/);
  assert.match(body, /section-after-content/);
  assert.match(body, /do NOT set activity_id/i);
  assert.doesNotMatch(body, /one object per upstream activity_id/i);
});

test("1/2/3/4: Expository section generate affordance validates without activity_id", () => {
  const row = makeS5FeedbackLoopAffordance();
  assert.equal(row.activity_id, undefined);
  const envelope = sprint38.validateAffordanceEnvelope(row, 0);
  assert.deepEqual(envelope, []);

  const capture = makeExpositoryDpCapture(row);
  const shape = vpc.validateVisualPlanningCaptureShape(capture);
  assert.equal(shape.valid, true, JSON.stringify(shape.errors, null, 2));

  const assembled = makeAssembledExpositoryPage(row);
  const contract = vpc.validateVisualPlanningContract(assembled);
  assert.equal(contract.valid, true, JSON.stringify(contract.errors, null, 2));
  assert.equal(contract.summary.section_scoped, 1);
  assert.equal(contract.summary.activity_scoped, 0);

  // Expository evidence anchors use section semantics, not activity unknown-id failures.
  assert.equal(
    (contract.errors || []).filter((e) => /unknown activity_id/i.test(e.message || "")).length,
    0
  );
});

test("section scope rejects inventing activity_id", () => {
  const row = makeS5FeedbackLoopAffordance({ activity_id: "A1" });
  const errors = sprint38.validateAffordanceEnvelope(row, 0);
  assert.ok(errors.some((e) => /activity_id must not be set when scope is section/i.test(e)));
});

test("lightweight Expository visual row still fails closed (prompt/validator agreement)", () => {
  const lightweight = {
    affordance_id: "va-lite",
    section_id: "S5",
    kind: "diagram",
    rationale: "feedback loop"
  };
  const errors = sprint38.validateAffordanceEnvelope(lightweight, 0);
  assert.ok(errors.length > 0);
  assert.ok(errors.some((e) => /visual_decision|purpose|preferred_representation|subject|context/i.test(e)));
});

test("5: S5 synthesis/process diagram reaches visual-jobs planner path", () => {
  const row = makeS5FeedbackLoopAffordance();
  const page = makeAssembledExpositoryPage(row);
  const planned = planner.planPrismVisualJobs(page);
  assert.equal(planned.valid, true, JSON.stringify(planned.errors, null, 2));
  assert.equal(planned.jobs.length, 1);
  assert.equal(planned.jobs[0].scope, "section");
  assert.equal(planned.jobs[0].section_id, "S5");
  assert.equal(planned.jobs[0].preferred_representation, "process");
  assert.equal(planned.jobs[0].purpose, "synthesis");
  assert.ok(!planned.jobs[0].activity_id);
  assert.equal(planned.diagnostics.section_scoped_jobs, 1);

  const plan = sprint38.buildVisualAffordanceRenderPlan(page);
  assert.equal(plan.legacy, false);
  assert.ok(plan.slotGenerate["section:s5|section-after-content"]);
});

test("Design Page capture API accepts Expository section VA", () => {
  const api = loadPrismTestApi();
  const capture = makeExpositoryDpCapture(makeS5FeedbackLoopAffordance());
  const result = api.validateDesignPagePartialPageCapture(capture);
  assert.equal(result.ok, true, (result.errors || []).join(" | "));
});

test("WP4 repair: closing_paragraph anchor + canonical representation_avoid pass DP/VA validation", () => {
  const body = sibling.resolveTemplate("design_page");
  assert.match(body, /page_synthesis\.closing_paragraph|closing_paragraph/);
  assert.match(
    body,
    /representation_avoid[\s\S]*summary_table[\s\S]*filled_worksheet[\s\S]*hierarchical_org_chart/
  );
  assert.match(body, /Never invent free-form phrases/i);
  assert.match(body, /use ONLY the shared Sprint 38 closed vocabulary/i);

  const pageAffordance = {
    affordance_id: "va-page-knowledge-summary-01",
    scope: "page",
    region: "knowledge_summary",
    visual_decision: "generate",
    visual_slot: "knowledge-summary-after-content",
    tier: "essential",
    purpose: "synthesis",
    preferred_representation: "concept_map",
    subject: "Whole-resource synthesis map",
    context:
      "Visual brief: consolidate authorised relationships from the knowledge summary and closing paragraph without inventing new claims.",
    evidence_anchors: [
      "page_synthesis.knowledge_summary",
      "page_synthesis.closing_paragraph",
      "S5.synthesis"
    ],
    rationale:
      "Externalises the integrative model so learners can revisit how closing carry-away ideas rest on authored exposition.",
    reasoning_supported: "Learners consolidate relationships already explained upstream.",
    learner_stage: "post_reasoning",
    anti_spoiler: false,
    representation_avoid: [
      "generic_infographic",
      "topic_hero_image",
      "filled_worksheet",
      "summary_table"
    ],
    canonical_discipline_note: "Show only relationships warranted by upstream prose.",
    requires_exact_data_match: false,
    must_show: ["authorised relationship nodes", "closing carry-away links"],
    must_not_show: ["new mechanisms", "activity worksheets"],
    allowed_claims: ["Closing ideas rest on relationships already explained."],
    disallowed_claims: ["Claims absent from upstream substance."],
    source_basis: "page_synthesis.knowledge_summary; page_synthesis.closing_paragraph; S5.synthesis",
    caption_intent: "Map authorised synthesis links including the closing carry-away.",
    alt_text: "Concept map of authorised synthesis relationships; detailed description follows.",
    detailed_description:
      "A concept map links knowledge-summary nodes to the closing carry-away without adding new mechanisms.",
    discipline_risk_level: "medium"
  };

  assert.deepEqual(sprint38.validateAffordanceEnvelope(pageAffordance, 0), []);
  pageAffordance.representation_avoid.forEach((token) => {
    assert.ok(
      sprint38.REPRESENTATION_AVOID.indexOf(token) !== -1,
      "expected canonical representation_avoid token: " + token
    );
  });

  const capture = makeExpositoryDpCapture(pageAffordance);
  capture.page_synthesis.closing_paragraph =
    "Carry away that each stage of the loop depends on the previous move — not a checklist of tips.";
  capture.sections = makeAssembledExpositoryPage(pageAffordance).sections;

  const shape = vpc.validateVisualPlanningCaptureShape(capture);
  assert.equal(shape.valid, true, JSON.stringify(shape.errors, null, 2));

  const assembled = makeAssembledExpositoryPage(pageAffordance);
  assembled.page_synthesis.closing_paragraph =
    capture.page_synthesis.closing_paragraph;
  const contract = vpc.validateVisualPlanningContract(assembled);
  assert.equal(contract.valid, true, JSON.stringify(contract.errors, null, 2));
  assert.equal(
    (contract.errors || []).filter((e) =>
      /unknown page_synthesis field 'closing_paragraph'/i.test(e.message || "")
    ).length,
    0
  );

  const api = loadPrismTestApi();
  const result = api.validateDesignPagePartialPageCapture(capture);
  assert.equal(result.ok, true, (result.errors || []).join(" | "));

  // Fail-closed: free-form avoidance tokens remain rejected (no silent coerce).
  const poisoned = Object.assign({}, pageAffordance, {
    representation_avoid: ["decorative_equation", "unlabelled_chart", "new worked example"]
  });
  const poisonedErrors = sprint38.validateAffordanceEnvelope(poisoned, 0);
  assert.ok(poisonedErrors.some((e) => /representation_avoid/i.test(e)));
});

test("WP4 repair: Interactive study_tips page_synthesis anchor remains valid", () => {
  assert.ok(vpc.PAGE_SYNTHESIS_ANCHOR_FIELDS.indexOf("study_tips") !== -1);
  assert.ok(vpc.PAGE_SYNTHESIS_ANCHOR_FIELDS.indexOf("closing_paragraph") !== -1);
  assert.equal(vpc.isCanonicalEvidenceAnchorSyntax("page_synthesis.study_tips"), true);
  assert.equal(vpc.isCanonicalEvidenceAnchorSyntax("page_synthesis.closing_paragraph"), true);
});

test("6: Interactive activity generate affordance still validates unchanged", () => {
  const interactive = {
    affordance_id: "va-A3-classification-01",
    scope: "activity",
    activity_id: "A3",
    visual_decision: "generate",
    visual_slot: "materials-entry",
    tier: "valuable",
    purpose: "classification",
    preferred_representation: "classification_matrix",
    subject: "Inflation mechanism classification cues",
    context:
      "Visual brief: compare demand-pull, cost-push, and wage-price spiral mechanisms by their triggering drivers.",
    evidence_anchors: ["A3.learner_task", "A3.materials.scenarios"],
    rationale: "Makes cause-type pathway cues inspectable before the analysis table.",
    reasoning_supported: "Learners classify without completed classifications.",
    learner_stage: "pre_classification",
    anti_spoiler: true,
    spoiler_boundary: {
      hide_answers: true,
      hide_classification_keys: true,
      hide_model_solution: true,
      allow_structural_hint: true
    },
    representation_avoid: ["filled_worksheet", "summary_table", "generic_infographic", "topic_hero_image"],
    canonical_discipline_note: "Empty labelled cause structures only.",
    requires_exact_data_match: false,
    must_show: ["demand-pull pathway cues", "cost-push shock pathway"],
    must_not_show: ["scenario answer key", "completed classification cells"],
    allowed_claims: ["Different causal mechanisms can produce inflation."],
    disallowed_claims: ["All inflation has one cause."],
    source_basis: "A3.learner_task; A3.materials.scenarios",
    caption_intent: "Cause-type cues only — not the learner table.",
    alt_text: "Inflation cause-type cues; detailed description follows.",
    detailed_description: "Three parallel cause pathways sit side by side with empty cells.",
    discipline_risk_level: "medium"
  };
  assert.deepEqual(sprint38.validateAffordanceEnvelope(interactive, 0), []);
  assert.ok(sprint38.SCOPES.indexOf("activity") !== -1);
  assert.ok(sprint38.SCOPES.indexOf("page") !== -1);
  assert.ok(sprint38.SCOPES.indexOf("section") !== -1);
});
