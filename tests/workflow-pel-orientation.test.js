/**
 * Sprint 30 Slice 30-1 — orientation_contract (PEL) resolver and prompt scaffolds.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);
const marxProceduralDlaPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "workflow-brief",
  "marx-dla-procedural-output.json"
);
const marxLiveDlaPath = path.join(
  repoRoot,
  "docs",
  "development",
  "sprints",
  "2026-05-21-sprint-30-pedagogic-enrichment-layer",
  "context-files",
  "live-artefacts",
  "marx-learning-activities.json"
);

const MARX_SELF_STUDY_BRIEF = {
  goal:
    "Create a self-directed learning page on Karl Marx covering life phases, cause-effect links, comparison of major works, and application of core concepts.",
  inputs: "Undergraduate (self-directed study)",
  desiredOutputs: "Learner-facing page",
  selectedDomains: ["learning-design"]
};

const TRANSCRIPT_SELF_STUDY_BRIEF = {
  goal:
    "create a one hour self-study session for undergraduate students based on uploaded transcript",
  inputs: "Uploaded lecture transcript on RNA viruses and hepatitis C (HCV).",
  desiredOutputs: "Learner-facing page",
  startingArtefact: "provided_source_content",
  selectedDomains: ["learning-design"]
};

const WORKSHOP_BRIEF = {
  goal:
    "Using the uploaded lecture on climate change, create a misconception discussion workshop with task cards and small group discussion.",
  inputs: "Uploaded lecture transcript on climate change.",
  desiredOutputs: "Facilitator handout and learner handout",
  startingArtefact: "provided_source_content",
  selectedDomains: ["learning-design"]
};

const FACILITATED_WORKSHOP_BRIEF = {
  goal: "Design a 90-minute facilitated workshop on team communication for nursing students.",
  inputs: "Face-to-face classroom with tutor facilitation",
  desiredOutputs: "Facilitator guide and slide deck",
  selectedDomains: ["learning-design"]
};

const PEER_SEMINAR_BRIEF = {
  goal:
    "Peer instruction seminar: individual answer, pair discussion, then revise answers after small-group discussion.",
  inputs: "Seminar room with facilitator",
  desiredOutputs: "Session plan and slides",
  selectedDomains: ["learning-design"]
};

const PEL_ORIENTATION_MARKER =
  /pedagogic enrichment — orientation contract \(auto-applied\)/i;

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

const api = loadPrismTestApi();
const ldBriefConfig = api.normalizeWorkflowBriefConfig(
  extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"))
);

function resolveBrief(brief) {
  const explicit = api.extractWorkflowBriefExplicitFactors(brief);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    brief.goal,
    brief.inputs
  );
  return api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    brief
  ).resolved;
}

function buildStepContext(brief, resolved, stepId, stepTitle) {
  return {
    workflowGoal: brief.goal,
    desiredOutputs: brief.desiredOutputs,
    workflowInputs: brief.inputs || "",
    stepCanonicalStepId: stepId,
    stepCanonicalTitle: stepTitle,
    workflowBriefResolution: { resolvedFactors: resolved }
  };
}

function buildWorkflowRecord(brief, resolved) {
  return {
    goal: brief.goal,
    inputs: brief.inputs || "",
    desiredOutputs: brief.desiredOutputs,
    startingArtefact: brief.startingArtefact || "",
    workflowOutputSpec: { goal: brief.goal },
    workflowBriefResolution: { resolvedFactors: resolved }
  };
}

function gamScaffoldPrompt(brief) {
  const explicit = api.extractWorkflowBriefExplicitFactors(brief);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    brief.goal,
    brief.inputs
  );
  const resolved = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    brief
  ).resolved;
  const ctx = {
    workflowGoal: brief.goal,
    desiredOutputs: brief.desiredOutputs,
    stepCanonicalStepId: "step_generate_activity_materials",
    stepCanonicalTitle: "Generate Activity Materials",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  return api.applySelfDirectedLearnerPageStepScaffoldsToDraft(
    "Generate activity materials.\n",
    ctx
  );
}

function applyRuntimePrompt(baseDraft, brief, resolved, stepId, stepTitle) {
  const step = {
    canonical_step_id: stepId,
    canonical_title: stepTitle,
    title: stepTitle
  };
  return api.applyWorkflowStepRuntimePromptAugmentations(
    baseDraft,
    step,
    buildWorkflowRecord(brief, resolved)
  );
}

test("30-1: Marx self-directed learner page resolves orientation_contract", () => {
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  assert.equal(resolved.delivery_context, "self_directed");
  const ctx = buildStepContext(
    MARX_SELF_STUDY_BRIEF,
    resolved,
    "step_design_learning_activities",
    "Design Learning Activities"
  );
  const ids = [...api.resolvePedagogicEnrichmentContractIds(ctx)];
  assert.deepEqual(ids, ["orientation_contract", "reasoning_contract"]);
  assert.equal(api.SPRINT_30_PEC_ORIENTATION_CONTRACT_ID, "orientation_contract");
});

test("30-1: RNA transcript self-study resolves orientation_contract (source content does not block)", () => {
  const resolved = resolveBrief(TRANSCRIPT_SELF_STUDY_BRIEF);
  assert.equal(resolved.input_strategy, "provided_source_content");
  assert.equal(resolved.delivery_context, "self_directed");
  const ctx = buildStepContext(
    TRANSCRIPT_SELF_STUDY_BRIEF,
    resolved,
    "step_design_learning_activities",
    "Design Learning Activities"
  );
  const ids = [...api.resolvePedagogicEnrichmentContractIds(ctx)];
  assert.deepEqual(ids, ["orientation_contract", "reasoning_contract"]);
});

test("30-1: facilitated workshop, seminar, and peer briefs resolve no PEC contracts", () => {
  const cases = [
    { label: "workshop with small group discussion", brief: WORKSHOP_BRIEF },
    { label: "facilitated F2F workshop", brief: FACILITATED_WORKSHOP_BRIEF },
    { label: "peer instruction seminar", brief: PEER_SEMINAR_BRIEF }
  ];
  for (const { label, brief } of cases) {
    const resolved = resolveBrief(brief);
    const ctx = buildStepContext(
      brief,
      resolved,
      "step_design_learning_activities",
      "Design Learning Activities"
    );
    const ids = [...api.resolvePedagogicEnrichmentContractIds(ctx)];
    assert.equal(ids.length, 0, `${label} should not activate orientation_contract`);
  }
});

test("30-1: DLA runtime prompt includes PEL orientation block and field names", () => {
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const prompt = applyRuntimePrompt(
    "Design executable learning activities.\n",
    MARX_SELF_STUDY_BRIEF,
    resolved,
    "step_design_learning_activities",
    "Design Learning Activities"
  );
  assert.match(prompt, PEL_ORIENTATION_MARKER);
  assert.match(prompt, /\bstudy_orientation\b/);
  assert.match(prompt, /\bintellectual_frame\b/);
  assert.match(prompt, /\bintellectual_coherence_bridge\b/);
  assert.match(prompt, /output contract \(self-directed learner page/i);
  assert.match(prompt, /each activity object must include activity_preamble/i);
  assert.match(prompt, /self_explanation_prompt: at least two activities/i);
  assert.match(prompt, /self-directed learner-page activity framing \(auto-applied\)/i);
});

test("30-1: Design Page runtime prompt includes PEL orientation and field preservation", () => {
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const prompt = applyRuntimePrompt(
    "Assemble learner page.\n",
    MARX_SELF_STUDY_BRIEF,
    resolved,
    "step_design_page",
    "Design Page"
  );
  assert.match(prompt, PEL_ORIENTATION_MARKER);
  assert.match(prompt, /LD-DESIGN-PAGE-COMPOSE-CONTRACT \(auto-applied\)/i);
  assert.match(prompt, /Activity field preservation/i);
  assert.match(prompt, /study_orientation, intellectual_frame, intellectual_coherence_bridge/);
  assert.match(prompt, /intellectual_coherence_bridge/i);
});

test("30-1: facilitated workshop DLA runtime prompt excludes PEL orientation marker", () => {
  const resolved = resolveBrief(WORKSHOP_BRIEF);
  const prompt = applyRuntimePrompt(
    "Design executable learning activities.\n",
    WORKSHOP_BRIEF,
    resolved,
    "step_design_learning_activities",
    "Design Learning Activities"
  );
  assert.doesNotMatch(prompt, PEL_ORIENTATION_MARKER);
  assert.doesNotMatch(prompt, /output contract \(self-directed learner page/i);
});

test("30-1c: GAM scaffold for self-directed learner page forbids facilitator-facing material voice", () => {
  const prompt = gamScaffoldPrompt(MARX_SELF_STUDY_BRIEF);
  assert.match(prompt, /self-directed learner-page material voice \(auto-applied\)/i);
  assert.match(prompt, /Facilitator use:/i);
  assert.match(prompt, /Teacher notes/i);
  assert.match(prompt, /Instructor guidance/i);
  assert.match(prompt, /Use this to/i);
  assert.match(prompt, /Check your notes against/i);
  assert.match(prompt, /Before moving on/i);
  assert.match(prompt, /GAM-PRES-08/i);
  assert.match(prompt, /Prefer instructional completeness over brevity/i);
  assert.doesNotMatch(prompt, /add artefacts \(tables, excerpts, worked rows\) only/i);
});

test("30-1c: facilitated workshop GAM scaffold is not constrained as self-directed learner voice", () => {
  const prompt = gamScaffoldPrompt(WORKSHOP_BRIEF);
  assert.doesNotMatch(prompt, /self-directed learner-page material voice \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /self-directed learner-page table row adequacy \(auto-applied\)/i);
});

test("30-1c: evaluatePelOrientationContractSatisfaction passes well-formed orientation activities", () => {
  const good = {
    activities: [
      {
        activity_id: "A1",
        activity_preamble: "Before you begin, note how Marx's exile shaped his writing.",
        study_orientation:
          "This self-study page moves from life phases to comparing texts and applying concepts."
      },
      {
        activity_id: "A2",
        activity_preamble: "As you analyse cause and effect, link each event to a concept.",
        intellectual_coherence_bridge:
          "Use your timeline from the previous activity when matching historical events."
      }
    ]
  };
  const evalResult = api.evaluatePelOrientationContractSatisfaction(good);
  assert.equal(evalResult.satisfied, true);
  assert.equal(evalResult.orientationContractSatisfied, true);
  assert.equal(evalResult.preambleCount, 2);
  assert.equal(evalResult.studyOrientationPresent, true);
  assert.equal(evalResult.bridgeCount, 1);
  assert.equal(evalResult.missingFields.length, 0);
});

test("30-1c: evaluatePelOrientationContractSatisfaction flags procedural DLA and facilitator GAM text", () => {
  const procedural = JSON.parse(fs.readFileSync(marxProceduralDlaPath, "utf8"));
  const evalDla = api.evaluatePelOrientationContractSatisfaction(procedural);
  assert.equal(evalDla.satisfied, false);
  assert.ok(evalDla.missingFields.includes("activity_preamble"));
  const withGam = api.evaluatePelOrientationContractSatisfaction(procedural, {
    gamText: "Facilitator use: Introduce the timeline during minutes 5–15."
  });
  assert.equal(withGam.satisfied, false);
  assert.ok(withGam.missingFields.includes("facilitator_facing_language"));
});

test("30-1c: evaluatePelOrientationContractSatisfaction accepts live Marx DLA with page rows", () => {
  if (!fs.existsSync(marxLiveDlaPath)) return;
  const dla = JSON.parse(fs.readFileSync(marxLiveDlaPath, "utf8"));
  const pagePath = path.join(
    repoRoot,
    "docs",
    "development",
    "sprints",
    "2026-05-21-sprint-30-pedagogic-enrichment-layer",
    "context-files",
    "live-artefacts",
    "marx-page.json"
  );
  if (!fs.existsSync(pagePath)) return;
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const evalResult = api.evaluatePelOrientationContractSatisfaction(dla, { page });
  assert.equal(evalResult.preambleCount, evalResult.activityCount);
  assert.ok(evalResult.studyOrientationPresent);
  assert.ok(evalResult.bridgeCount >= 1);
});
