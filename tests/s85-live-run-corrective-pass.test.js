/**
 * Sprint 85 — live-run corrective pass (WP1–WP3 integration defects).
 * Covers Interactive-factor leak, GLC/LO sibling resolution, EJP bindings,
 * EJP/XD/XM capture gates, and sequence advance readiness.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const sibling = require("../lib/expository-sibling-prompts.js");
const contracts = require("../lib/expository-contracts.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

function extractWorkflowPolicy(md) {
  const idx = md.indexOf("### Workflow Policy");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowPolicy;
}

function loadPrismTestApi() {
  const { createRequire } = require("module");
  const requireFromApp = createRequire(appJsPath);
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    require: requireFromApp,
    module: { exports: {} },
    exports: {},
    __dirname: repoRoot,
    __filename: appJsPath
  };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  sandbox.globalThis = sandbox;
  windowStub.window = windowStub;
  windowStub.PrismExpositorySiblingPrompts = sibling;
  windowStub.PrismExpositoryContracts = contracts;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

const api = loadPrismTestApi();
const workflowPolicy = extractWorkflowPolicy(fs.readFileSync(ldPatternsPath, "utf8"));

function makeExpositorySteps() {
  return [
    {
      id: "glc1",
      title: "Generate Learning Content",
      canonical_step_id: "step_generate_learning_content",
      outputName: "learning_content",
      inputBindings: []
    },
    {
      id: "mk1",
      title: "Model Knowledge",
      canonical_step_id: "step_model_knowledge",
      outputName: "knowledge_model",
      inputBindings: []
    },
    {
      id: "lo1",
      title: "Define Learning Outcomes",
      canonical_step_id: "step_define_learning_outcomes",
      outputName: "learning_outcomes",
      inputBindings: []
    },
    {
      id: "ejp1",
      title: "Expository Journey Plan",
      canonical_step_id: "step_expository_journey_plan",
      outputName: "expository_journey_plan",
      inputBindings: []
    },
    {
      id: "xd1",
      title: "Expository Development",
      canonical_step_id: "step_expository_development",
      outputName: "expository_development",
      inputBindings: []
    },
    {
      id: "xm1",
      title: "Expository Materials",
      canonical_step_id: "step_expository_materials",
      outputName: "expository_materials",
      inputBindings: []
    },
    {
      id: "dp1",
      title: "Design Page",
      canonical_step_id: "step_design_page",
      outputName: "page",
      inputBindings: []
    }
  ];
}

function makeExpositoryWf(steps) {
  return {
    id: "wf-expo-live",
    name: "Expository live corrective",
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_EXPOSITORY,
    workflowOutputSpec: {
      pageEnrichmentV2: true,
      partialPageOutputs: true,
      constraints: "design_scope: single_activity; feedback_required: item_level; page_profile: learner"
    },
    steps: steps || makeExpositorySteps()
  };
}

test("A: Expository generation factors strip Interactive-only assessment/activity defaults", () => {
  const sanitized = api.sanitizeExpositoryGenerationFactors({
    topic: "Photosynthesis",
    learner_level: "undergraduate",
    scope_scale: "10-minute read",
    input_strategy: "generate_from_topic",
    delivery_context: "self_directed",
    page_profile: "learner",
    design_scope: "single_activity",
    question_style_mix: "mixed_response_modes",
    assessment_type: "mixed",
    feedback_required: "item_level",
    difficulty_profile: "balanced",
    assessment_total_items: 8,
    feedback_display: "immediate",
    learner_answer_visibility: "visible",
    feedback_timing: "immediate",
    assessment_semantics_constraints_applied: "{}",
    activities_required: true
  });
  assert.equal(sanitized.topic, "Photosynthesis");
  assert.equal(sanitized.scope_scale, "10-minute read");
  assert.equal(sanitized.delivery_context, "self_directed");
  assert.equal(sanitized.activities_required, false);
  assert.equal(sanitized.design_scope, undefined);
  assert.equal(sanitized.feedback_required, undefined);
  assert.equal(sanitized.assessment_type, undefined);
  assert.equal(sanitized.question_style_mix, undefined);
  assert.equal(sanitized.assessment_total_items, undefined);

  const patch = api.sanitizeExpositoryConstraintPatch({
    design_scope: "single_activity",
    feedback_required: "item_level",
    page_profile: "learner",
    input_strategy: "generate_from_topic"
  });
  assert.equal(patch.design_scope, undefined);
  assert.equal(patch.feedback_required, undefined);
  assert.equal(patch.page_profile, "learner");
  assert.equal(patch.input_strategy, "generate_from_topic");

  const resolved = api.resolveWorkflowBriefFactors(
    {
      requiredFactors: [
        { id: "topic", required: true },
        { id: "design_scope", required: true, default: "session" },
        { id: "input_strategy", required: true }
      ],
      optionalFactors: [
        { id: "feedback_required", default: "item_level" },
        { id: "assessment_type", default: "mixed" }
      ],
      refinementFactors: []
    },
    {
      topic: "Photosynthesis",
      input_strategy: "generate_from_topic",
      design_scope: "single_activity",
      feedback_required: "item_level"
    },
    {},
    {},
    {
      ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_EXPOSITORY,
      scopeScale: "10-minute read"
    }
  );
  assert.ok(!Object.prototype.hasOwnProperty.call(resolved.resolved, "design_scope"));
  assert.ok(!Object.prototype.hasOwnProperty.call(resolved.resolved, "feedback_required"));
  assert.ok(!Object.prototype.hasOwnProperty.call(resolved.resolved, "assessment_type"));
  assert.equal(resolved.resolved.topic, "Photosynthesis");
});

test("B: Expository GLC runtime prompt uses sibling pedagogical body", () => {
  const wf = makeExpositoryWf();
  const glc = wf.steps[0];
  glc.prompt_source_type = "local_override";
  glc.override_prompt_body =
    "Task:\nGenerate teaching-ready learning_content suitable for downstream learning design.\nOrganise intellectual progression for activity design.";
  const resolved = api.resolveStepPromptText(glc, wf);
  const body = String((resolved && resolved.text) || "");
  assert.match(body, /explanatory richness spine/i);
  assert.match(body, /do NOT design the final learner-facing chapter journey/i);
  assert.doesNotMatch(body, /suitable for downstream learning design/i);
  assert.doesNotMatch(body, /for activity design/i);
});

test("C: Expository LO runtime prompt uses sibling pedagogical body", () => {
  const wf = makeExpositoryWf();
  const lo = wf.steps[2];
  lo.prompt_source_type = "local_override";
  lo.override_prompt_body =
    'Generate clear, observable, and assessable learning outcomes.\nKeep wording precise so outcomes can be reused directly for assessment and activity design.\nIf the design is a short session (<= 30 minutes) or explicitly single_activity, prefer tightly focused, demonstrable outcomes.';
  const resolved = api.resolveStepPromptText(lo, wf);
  const body = String((resolved && resolved.text) || "");
  assert.match(body, /intended understanding \/ competence/i);
  assert.match(body, /do NOT require Interactive evidence production/i);
  assert.doesNotMatch(body, /observable, and assessable/i);
  assert.doesNotMatch(body, /single_activity/i);
  assert.doesNotMatch(body, /assessment and activity design/i);
});

test("D: Interactive GLC and LO prompt bodies remain unchanged in the domain pack", () => {
  const text = fs.readFileSync(ldPatternsPath, "utf8");
  const glcIdx = text.indexOf("## 2. Generate Learning Content");
  const mkIdx = text.indexOf("## 3. Model Knowledge");
  const loIdx = text.indexOf("## 4. Define Learning Outcomes");
  const epIdx = text.indexOf("## 5. Design Episode Plan");
  const glcChunk = text.slice(glcIdx, mkIdx);
  const loChunk = text.slice(loIdx, epIdx);
  assert.match(glcChunk, /suitable for downstream learning design/i);
  assert.doesNotMatch(glcChunk, /expositoryPromptTemplate/);
  assert.match(loChunk, /observable, and assessable/i);
  assert.match(loChunk, /assessment and activity design/i);
  assert.match(loChunk, /single_activity/i);
  assert.doesNotMatch(loChunk, /expositoryPromptTemplate/);
});

test("E: EJP runtime binding includes LC + MK + LO when available", () => {
  const steps = makeExpositorySteps();
  const wired = api.ensureExpositorySiblingInputBindingsForSteps(steps, {
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_EXPOSITORY,
    steps
  });
  const ejp = wired.find((s) => s.id === "ejp1");
  assert.ok(ejp);
  const arts = (ejp.inputBindings || []).map((b) => String(b.artifactName || ""));
  assert.ok(arts.includes("learning_outcomes"), arts.join(","));
  assert.ok(arts.includes("knowledge_model"), arts.join(","));
  assert.ok(arts.includes("learning_content"), arts.join(","));

  assert.equal(
    workflowPolicy.dependencies["Expository Journey Plan"].requires.includes("learning_content"),
    true
  );
  assert.equal(
    workflowPolicy.dependencies["Expository Journey Plan"].requires.includes("knowledge_model"),
    true
  );
});

test("F/G/H: EJP/XD/XM capture producers accept valid artefacts and gate advance", () => {
  const steps = makeExpositorySteps();
  const wf = makeExpositoryWf(steps);
  const ejp = steps[3];
  const xd = steps[4];
  const xm = steps[5];

  assert.equal(api.isWorkflowStepRunCaptureProducer(ejp, wf), true);
  assert.equal(api.isWorkflowStepRunCaptureProducer(xd, wf), true);
  assert.equal(api.isWorkflowStepRunCaptureProducer(xm, wf), true);
  assert.equal(api.isWorkflowStepPageStructureProducer(ejp, wf), false);

  assert.equal(api.isWorkflowRunStepCaptureReadyForAdvance(ejp, "ejp1", wf, null), false);
  assert.match(
    api.resolveWorkflowRunNextStepDisabledReason(ejp, "ejp1", wf, null, 3, 7),
    /Paste a valid result/i
  );

  const ejpObj = contracts.normalizeExpositoryJourneyPlan({
    title: "Journey",
    sections: [{ title: "S1", purpose: "orient", knowledge_focus: "core" }]
  });
  const xdObj = contracts.normalizeExpositoryDevelopment({
    sections: [
      {
        section_id: "section_1",
        explanation_intent: "clarify",
        exposition: "Clarify the opening idea so the journey can proceed.",
        materials_commission: []
      }
    ]
  });
  assert.equal(
    contracts.validateExpositoryArtefactShape(xdObj, "expository_development").ok,
    true
  );  const xmObj = contracts.normalizeExpositoryMaterials({
    materials: []
  });

  assert.equal(ejpObj.artifact_type, "expository_journey_plan");
  assert.equal(xdObj.artifact_type, "expository_development");
  assert.equal(xmObj.artifact_type, "expository_materials");

  const wired = api.ensureExpositorySiblingInputBindingsForSteps(steps, wf);
  const xdRow = wired.find((s) => s.id === "xd1");
  const xmRow = wired.find((s) => s.id === "xm1");
  assert.ok(
    (xdRow.inputBindings || []).some((b) => b.artifactName === "expository_journey_plan")
  );
  assert.ok(
    (xmRow.inputBindings || []).some((b) => b.artifactName === "expository_development")
  );
});

test("I: Expository stage sequence constructs GLC→MK→LO→EJP→XD→XM→DP with DP purpose wording", () => {
  const out = api.applyWorkflowDesignHeuristics(
    {
      status: "complete",
      summary: "draft",
      steps: [
        { title: "Generate Learning Content", role: "" },
        { title: "Model Knowledge", role: "" },
        { title: "Define Learning Outcomes", role: "" },
        { title: "Design Episode Plan", role: "" },
        { title: "Design Learning Activities", role: "" },
        { title: "Generate Activity Materials", role: "" },
        { title: "Construct Learning Sequence", role: "" },
        { title: "Design Page", role: "" }
      ]
    },
    {
      goal: "Create an Expository Resource: Photosynthesis",
      inputs: "",
      desiredOutputs: "",
      startingArtefact: "generate_from_topic",
      selectedDomains: ["learning-design"],
      ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_EXPOSITORY,
      workflowPolicy,
      stepPatternCatalog: [],
      resolvedBriefFactors: {
        delivery_context: "self_directed",
        session_materials: ["page"],
        page_profile: "learner",
        activities_required: false,
        input_strategy: "generate_from_topic"
      },
      explicitBriefFactors: {
        session_materials: ["page"],
        activities_required: false
      }
    }
  );
  const titles = (out.steps || []).map((s) => String(s.title || "").trim());
  assert.equal(titles.join(" > "), [
    "Generate Learning Content",
    "Model Knowledge",
    "Define Learning Outcomes",
    "Expository Journey Plan",
    "Expository Development",
    "Expository Materials",
    "Design Page"
  ].join(" > "));
  const dp = (out.steps || []).find((s) => String(s.title || "").trim() === "Design Page");
  assert.ok(dp);
  assert.match(String(dp.role || ""), /title, orientation and synthesis/i);
  assert.doesNotMatch(String(dp.role || ""), /page_synthesis|activities\[\]\.materials/i);
});

test("Expository GLC/LO sibling templates differ from Interactive pack templates", () => {
  const glc = sibling.resolveTemplate("generate_learning_content");
  const lo = sibling.resolveTemplate("define_learning_outcomes");
  assert.match(glc, /Judgement rule/i);
  assert.match(lo, /Do NOT design exposition sections/i);
});
