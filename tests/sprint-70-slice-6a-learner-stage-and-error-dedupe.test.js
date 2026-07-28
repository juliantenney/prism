/**
 * Sprint 70 Slice 6A — learner_stage authoring repair + Visual Jobs error de-duplication.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);
const romanRoadsPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-assemble",
  "roman-roads-visual-jobs-valid.json"
);

const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");
const s38 = require("../lib/sprint38-visual-affordances.js");
const vpc = require("../lib/visual-planning-contract.js");
const planner = require("../lib/prism-visual-jobs-planner.js");
const compiler = require("../lib/prism-image-brief-compiler.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function extractDesignPagePromptFactory(md) {
  const dpSection = md.slice(md.indexOf("## 13. Design Page"));
  const match = dpSection.match(/### Prompt Factory\s*```json\s*([\s\S]*?)\s*```/);
  assert.ok(match, "Design Page prompt factory JSON not found");
  return JSON.parse(match[1].trim());
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = {
    document: documentStub,
    PRISM_SPRINT38_VISUAL_AFFORDANCES: s38
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  sandbox.PRISM_SPRINT38_VISUAL_AFFORDANCES = s38;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function baseGenerate(overrides) {
  return Object.assign(
    {
      affordance_id: "va-A1-generate-01",
      scope: "activity",
      activity_id: "A1",
      visual_decision: "generate",
      visual_slot: "materials-entry",
      tier: "valuable",
      purpose: "classification",
      preferred_representation: "classification_matrix",
      subject: "Inflation mechanism classification cues",
      context: "Visual brief: compare demand-pull and cost-push mechanisms.",
      evidence_anchors: ["A1.learner_task"],
      must_show: ["demand-pull pathway cues"],
      must_not_show: ["scenario answer key"],
      allowed_claims: ["Different causal mechanisms can produce inflation."],
      disallowed_claims: ["All inflation has one cause."],
      rationale: "Classify before analysis.",
      pedagogical_added_value: "Adds discriminating cues.",
      anti_spoiler: true,
      spoiler_boundary: {
        hide_answers: true,
        hide_classification_keys: true,
        hide_model_solution: true,
        allow_structural_hint: true
      },
      representation_avoid: ["filled_worksheet"],
      requires_exact_data_match: false,
      source_basis: "A1 learner_task",
      caption_intent: "Cause-type cues only.",
      discipline_risk_level: "medium",
      reasoning_supported: "Learners classify without completed classifications.",
      learner_stage: "pre_classification",
      canonical_discipline_note: "Empty labelled structures only."
    },
    overrides || {}
  );
}

function pageEnvelope(affordances) {
  return {
    artifact_type: "page",
    title: "Stage vocab page",
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [
      { activity_id: "A1", activity_visual_value: { decision: "high", rationale: "Needed." } }
    ],
    visual_affordances: affordances,
    activities: [{ activity_id: "A1", learner_task: "Compare drivers." }]
  };
}

const PROHIBITED_STAGE_EXAMPLES = [
  "introduction",
  "introductory",
  "foundation",
  "foundational",
  "pre_reasoning",
  "during_reasoning",
  "post_classification",
  "synthesis",
  "consolidation",
  "overview",
  "beginner",
  "intermediate",
  "advanced"
];

// --- Prompt authoring ---

test("Slice 6A: live Design Page prompt lists exactly pre_classification and post_reasoning", () => {
  const api = loadPrismTestApi();
  const block = api.buildSprint38VisualAffordanceDesignPagePromptBlock();
  assert.match(block, /learner_stage \(generate only\): must be exactly one of: "pre_classification" \| "post_reasoning"/);
  assert.deepEqual(s38.LEARNER_STAGES, ["pre_classification", "post_reasoning"]);
  assert.deepEqual(vpc.LEARNER_STAGES, s38.LEARNER_STAGES);
  PROHIBITED_STAGE_EXAMPLES.forEach((token) => {
    assert.match(
      block,
      new RegExp("Do not use learner_stage values[\\s\\S]*" + token),
      "expected prohibited token listed: " + token
    );
  });
});

test("Slice 6A: Prompt Factory prompt lists the same learner_stage values", () => {
  const factory = extractDesignPagePromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  const template = String(factory.promptTemplate || "");
  assert.match(template, /learner_stage \(generate only\) must be exactly one of: "pre_classification" \| "post_reasoning"/);
  assert.match(template, /"learner_stage":"pre_classification"/);
  assert.match(template, /"learner_stage":"post_reasoning"/);
});

test("Slice 6A: activity and page examples use valid learner_stage tokens", () => {
  const api = loadPrismTestApi();
  const block = api.buildSprint38VisualAffordanceDesignPagePromptBlock();
  assert.match(block, /"learner_stage": "pre_classification"/);
  assert.match(block, /"learner_stage": "post_reasoning"/);
  assert.match(block, /knowledge-summary-after-content[\s\S]*"learner_stage": "post_reasoning"/);
  assert.equal((block.match(/learner_stage \(generate only\): must be exactly one of/g) || []).length, 1);
});

test("Slice 6A: runtime and Prompt Factory paths remain unified on learner_stage vocabulary", () => {
  const api = loadPrismTestApi();
  const block = api.buildSprint38VisualAffordanceDesignPagePromptBlock();
  const factory = extractDesignPagePromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  assert.match(block, /pre_classification/);
  assert.match(String(factory.promptTemplate || ""), /pre_classification/);
  assert.deepEqual(vpc.LEARNER_STAGES, ["pre_classification", "post_reasoning"]);
});

// --- Contract behaviour ---

test("Slice 6A: pre_classification and post_reasoning pass; prohibited tokens fail", () => {
  assert.equal(vpc.validateVisualPlanningContract(pageEnvelope([baseGenerate()])).valid, true);
  assert.equal(
    vpc.validateVisualPlanningContract(
      pageEnvelope([baseGenerate({ learner_stage: "post_reasoning" })])
    ).valid,
    true
  );
  ["foundation", "introductory", "synthesis", "guided_practice", "early"].forEach((token) => {
    const result = vpc.validateVisualPlanningContract(
      pageEnvelope([baseGenerate({ learner_stage: token })])
    );
    assert.equal(result.valid, false, token + " should fail");
    const err = result.errors.find((e) => e.field === "learner_stage");
    assert.ok(err, "expected learner_stage field metadata for " + token);
    assert.equal(err.code, "VPC_AFFORDANCE_ROW_INVALID");
    assert.deepEqual(err.allowed_values, ["pre_classification", "post_reasoning"]);
  });
});

// --- Roman roads realistic page ---

test("Slice 6A: Roman roads affordances use only valid learner_stage tokens", () => {
  const page = loadJson(romanRoadsPath);
  const stages = page.visual_affordances.map((row) => ({
    id: row.affordance_id,
    stage: row.learner_stage
  }));
  assert.deepEqual(stages, [
    { id: "va-a1-concept-map-01", stage: "pre_classification" },
    { id: "va-a2-process-01", stage: "pre_classification" },
    { id: "va-a3-comparison-01", stage: "pre_classification" },
    { id: "va-page-knowledge-summary-01", stage: "post_reasoning" }
  ]);
});

test("Slice 6A: Roman roads page produces contract → jobs → briefs → cards", () => {
  const page = loadJson(romanRoadsPath);
  const before = clone(page);
  const contractResult = vpc.validateVisualPlanningContract(page);
  assert.equal(contractResult.valid, true, JSON.stringify(contractResult.errors));
  const plannerResult = planner.planPrismVisualJobs(page);
  assert.equal(plannerResult.valid, true, JSON.stringify(plannerResult.errors));
  assert.equal(plannerResult.jobs.length, 4);
  const compilerResult = compiler.compilePrismImageBriefs(plannerResult);
  assert.equal(compilerResult.valid, true, JSON.stringify(compilerResult.errors));
  assert.equal(compilerResult.briefs.length, 4);
  const html = workspace.renderVisualJobsWorkspaceHtml(
    workspace.buildVisualJobsWorkspaceState(page)
  );
  assert.equal((html.match(/data-brief-select-id=/g) || []).length, 4);
  assert.match(html, /Copy Prompt/);
  assert.deepEqual(page, before);
});

// --- Error presentation ---

test("Slice 6A: contract errors render once; planner/compiler show blocked-stage messages", () => {
  const page = loadJson(romanRoadsPath);
  page.visual_affordances.forEach((row, index) => {
    row.learner_stage = ["foundation", "introductory", "synthesis", "consolidation"][index];
  });
  const ws = workspace.buildVisualJobsWorkspaceState(page);
  const contractBefore = clone(ws.contractResult);
  const plannerBefore = clone(ws.plannerResult);
  const compilerBefore = clone(ws.compilerResult);
  assert.equal(ws.contractResult.valid, false);
  assert.ok(ws.plannerResult.errors.length >= ws.contractResult.errors.length);
  assert.ok(ws.compilerResult.errors.length >= ws.contractResult.errors.length);

  const presentation = workspace.buildStageErrorPresentation(ws);
  assert.ok(presentation.contractErrors.length >= 4);
  assert.equal(presentation.plannerErrors.length, 0);
  assert.equal(presentation.compilerErrors.length, 0);
  assert.match(presentation.plannerBlockedMessage, /Not run because the visual-planning contract is invalid/);
  assert.match(presentation.compilerBlockedMessage, /Not run because no valid visual-job plan is available/);

  const html = workspace.renderVisualJobsWorkspaceHtml(ws);
  assert.equal((html.match(/Invalid learner stage/g) || []).length, presentation.contractErrors.length);
  assert.match(html, /Not run because the visual-planning contract is invalid/);
  assert.match(html, /Not run because no valid visual-job plan is available/);
  assert.doesNotMatch(html, /Visual job planning[\s\S]*VPC_AFFORDANCE_ROW_INVALID[\s\S]*Image brief compilation[\s\S]*VPC_AFFORDANCE_ROW_INVALID/);
  assert.match(html, /Affordance: va-a1-concept-map-01/);
  assert.match(html, /Field: learner_stage/);
  assert.match(html, /Allowed values: pre_classification, post_reasoning/);
  assert.match(html, /VPC_AFFORDANCE_ROW_INVALID/);
  assert.doesNotMatch(html, /<div class="util-vj-summary"><\/div>/);
  assert.doesNotMatch(html, /<div class="util-vj-summary">\s*<\/div>/);

  assert.deepEqual(ws.contractResult, contractBefore);
  assert.deepEqual(ws.plannerResult, plannerBefore);
  assert.deepEqual(ws.compilerResult, compilerBefore);
});

test("Slice 6A: independent planner errors remain visible when contract is valid", () => {
  const page = loadJson(romanRoadsPath);
  page.visual_affordances[0].evidence_anchors = ["A1.materials.nonexistent_field"];
  const ws = workspace.buildVisualJobsWorkspaceState(page);
  assert.equal(ws.contractResult.valid, true);
  assert.equal(ws.plannerResult.valid, false);
  const presentation = workspace.buildStageErrorPresentation(ws);
  assert.equal(presentation.contractErrors.length, 0);
  assert.ok(presentation.plannerErrors.length >= 1);
  assert.match(presentation.compilerBlockedMessage, /no valid visual-job plan/i);
  const html = workspace.renderVisualJobsWorkspaceHtml(ws);
  assert.match(html, /Visual job planning/);
  assert.doesNotMatch(html, /Not run because the visual-planning contract is invalid/);
});

test("Slice 6A: no empty bordered summary strip in contract-error state", () => {
  const page = pageEnvelope([baseGenerate({ learner_stage: "foundation" })]);
  const html = workspace.renderVisualJobsWorkspaceHtml(workspace.buildVisualJobsWorkspaceState(page));
  assert.doesNotMatch(html, /class="util-vj-summary"/);
  assert.match(html, /Invalid learner stage/);
});

test("Slice 6A: no alias normalisation was added for invalid learner_stage", () => {
  const result = vpc.validateVisualPlanningContract(
    pageEnvelope([baseGenerate({ learner_stage: "foundation" })])
  );
  assert.equal(result.valid, false);
  assert.ok(result.errors.every((e) => e.message.indexOf("pre_classification | post_reasoning") !== -1));
});
