/**
 * Sprint 55 — guided learning scaffold prose quality contracts.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const rnaDlaPath = path.join(
  repoRoot,
  "docs",
  "development",
  "sprints",
  "2026-05-21-sprint-30-pedagogic-enrichment-layer",
  "context-files",
  "live-artefacts",
  "rna-learning-activities.json"
);
const OBSERVED_TERSE_DLA_PATH = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "dla",
  "rna-hcv-observed-terse-full.json"
);
const LATEST_RUN_DLA_PATH = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "dla",
  "rna-hcv-latest-run.json"
);

const EXACT_FAILING_SCAFFOLD_STRINGS = [
  "This activity builds a foundation by clarifying how different RNA genomes relate to translation and replication.",
  "Focus on why translation differs between genome types.",
  "Compare single vs multi-receptor entry outcomes.",
  "Use evidence → comparison → judgement."
];
const rnaHcvTerseFixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "dla",
  "rna-hcv-terse-scaffold-dla.json"
);
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

const RNA_HCV_BRIEF = {
  goal:
    "Create a self-directed learning page on RNA virus genome organisation, replication, HCV mechanisms, and transmission strategies.",
  inputs: "Undergraduate biomedical students (self-directed study)",
  desiredOutputs: "Learner-facing page",
  selectedDomains: ["learning-design"]
};

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
}

function resolveRnaBrief(api) {
  const ldBriefConfig = api.normalizeWorkflowBriefConfig(
    extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"))
  );
  const explicit = api.extractWorkflowBriefExplicitFactors(RNA_HCV_BRIEF);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    RNA_HCV_BRIEF.goal,
    RNA_HCV_BRIEF.inputs
  );
  return api.resolveWorkflowBriefFactors(ldBriefConfig, explicit, {}, inferred, RNA_HCV_BRIEF)
    .resolved;
}

function rnaDlaContext(api, resolved) {
  return {
    workflowGoal: RNA_HCV_BRIEF.goal,
    desiredOutputs: RNA_HCV_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Design Learning Activities",
    stepCanonicalStepId: "step_design_learning_activities",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
}

const marxFixturePath = path.join(repoRoot, "tests", "fixtures", "page-render", "marx-beat-render-page.json");

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

function loadGuidedLearningLib() {
  const sandbox = {};
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, [
    "lib/ld-guided-learning-scaffold.js",
    "lib/page-gam-materials-preserve.js"
  ]);
  return sandbox.PRISM_LD_GUIDED_LEARNING_SCAFFOLD;
}

test("guided learning: detects terse RNA-style scaffold labels", () => {
  const lib = loadGuidedLearningLib();
  assert.equal(lib.scaffoldLooksLikeTerseLabel("Trace mechanism → function relationships."), true);
  assert.equal(lib.scaffoldLooksLikeTerseLabel("Contrast positive vs negative-sense RNA."), true);
  assert.equal(
    lib.scaffoldLooksLikeTerseLabel(
      "criteria → comparison → judgement → justification"
    ),
    true
  );
  assert.equal(
    lib.scaffoldLooksLikeTerseLabel(
      "Completed analysis table linking mechanism and function."
    ),
    true
  );
  const rich =
    "As you analyse each stage, ask two questions: what is the virus doing, and what problem does this solve? Avoid simply listing lifecycle events. Strong answers connect each mechanism to a functional consequence such as entry, replication, persistence, or spread.";
  assert.equal(lib.scaffoldLooksLikeTerseLabel(rich), false);
});

test("guided learning: RNA live DLA artefact fails terse scaffold quality", () => {
  const lib = loadGuidedLearningLib();
  const dla = JSON.parse(fs.readFileSync(rnaDlaPath, "utf8"));
  const evidence = lib.evaluateGuidedLearningScaffoldEvidence(dla);
  assert.ok(evidence.activityCount >= 1);
  assert.ok(evidence.issueCount >= 1, "expected terse RNA scaffold fields to be flagged");
  const a1 = evidence.issues.find((row) => row.activity_id === "A1");
  assert.ok(a1, "expected A1 issues");
  assert.ok(a1.fields.includes("reasoning_orientation") || a1.fields.includes("activity_preamble"));
});

test("guided learning: rich scaffold exemplar passes quality evaluation", () => {
  const api = loadPrismTestApi();
  const rich = {
    activities: [
      {
        activity_id: "A1",
        activity_preamble:
          "RNA viruses use different genome organisations, and those differences are not cosmetic labels. They determine whether the host cell can translate viral RNA immediately or must first produce complementary copies. Before you compare types in the table, notice that polarity changes the entire route from genome entry to protein production — that is the conceptual problem this activity addresses.",
        reasoning_orientation:
          "As you analyse each stage, ask two questions: what is the virus doing, and what problem does this solve? Avoid simply listing lifecycle events. Strong answers connect each mechanism to a functional consequence such as entry, replication, persistence, or spread.",
        conceptual_contrast_prompt:
          "When comparing genome types, focus on whether the genome can be translated immediately and whether a transcription step is needed first. The key distinction is not just polarity, but how polarity changes the route from genome entry to protein production.",
        expected_output:
          "Your completed table should explain what happens at each lifecycle stage and why it matters. Strong entries should include specific mechanisms, a clear functional purpose, and a short reasoning statement that links the mechanism to viral survival, replication, or persistence.",
        learner_task: "Complete the comparison table using the reference text."
      }
    ]
  };
  const evidence = api.evaluateGuidedLearningScaffoldEvidence(rich);
  assert.equal(evidence.meetsGuidedLearningScaffoldQuality, true);
});

test("guided learning: scaffold contract block includes word targets", () => {
  const lib = loadGuidedLearningLib();
  const block = lib.buildLdGuidedLearningScaffoldPromptBlock();
  assert.match(block, /LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT/);
  assert.match(block, /35–80 words/);
  assert.match(block, /50–120 words/);
  assert.match(block, /Trace mechanism → function relationships/);
});

test("guided learning: GAM worked_example paraphrase triggers merge", () => {
  const sandbox = {};
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, ["lib/page-gam-materials-preserve.js"]);
  const preserve = sandbox.PRISM_PAGE_GAM_MATERIALS_PRESERVE;
  const gamBody =
    "### Worked Example\n\n**Step 1:** Identify entry receptors.\n\n## What experts notice\n\n- Experts link receptor binding to functional entry.\n\n**Bridge:** Use the same reasoning pattern for the remaining stages: identify the mechanism, ask what biological problem it solves, then explain the functional consequence.";
  const pageBody = "Worked example showing entry steps.";
  assert.equal(preserve.shouldMergeGamBody(pageBody, gamBody, "worked_example", {}, {}), true);
});

test("guided learning: field preserve repairs compressed scaffold from upstream", () => {
  const api = loadPrismTestApi();
  const upstream = {
    activities: [
      {
        activity_id: "A1",
        reasoning_orientation:
          "As you analyse each stage, ask two questions: what is the virus doing, and what problem does this solve? Avoid simply listing lifecycle events. Strong answers connect each mechanism to a functional consequence such as entry, replication, persistence, or spread.",
        expected_output:
          "Your completed table should explain what happens at each lifecycle stage and why it matters. Strong entries should include specific mechanisms, a clear functional purpose, and a short reasoning statement."
      }
    ]
  };
  const page = {
    artifact_type: "page",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        content: [
          {
            activity_id: "A1",
            reasoning_orientation: "Trace mechanism → function.",
            expected_output: "Completed table."
          }
        ]
      }
    ]
  };
  api.repairLearnerPageCompositionFromUpstream(page, upstream);
  const row = page.sections[0].content[0];
  assert.match(String(row.reasoning_orientation), /what is the virus doing/i);
  assert.match(String(row.expected_output), /Strong entries should include/i);
});

test("guided learning: beat-first Marx A1 renders expected_output", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  const a1 = html.match(
    /Historical Materialism and Capitalism[\s\S]*?(?=Surplus Value and Exploitation|Is Marx Still Relevant|$)/i
  );
  assert.ok(a1);
  // Sprint 62: output may appear as promoted Success looks like rather than trailing util-output-block.
  assert.match(a1[0], /util-output-block|util-activity-success-looks-like|revised using the checklist/i);
});

test("guided learning: DLA runtime prompt includes scaffold word targets and terse forbid", () => {
  const api = loadPrismTestApi();
  const resolved = resolveRnaBrief(api);
  const wf = {
    goal: RNA_HCV_BRIEF.goal,
    desiredOutputs: RNA_HCV_BRIEF.desiredOutputs,
    workflowOutputs: ["Learner-facing page"],
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  const step = {
    title: "Design Learning Activities",
    canonical_step_id: "step_design_learning_activities"
  };
  const draft = api.applyWorkflowStepRuntimePromptAugmentations(
    "Design learning activities for RNA viruses.\n\nOutput:\n",
    step,
    wf,
    {}
  );
  assert.match(draft, /LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT/);
  assert.match(draft, /activity_preamble 50–120/i);
  assert.match(draft, /reasoning_orientation, self_explanation_prompt, conceptual_contrast_prompt, argument_structure_hint, transfer_or_application_task 35–80/i);
  assert.match(draft, /expected_output 30–70/i);
  assert.match(draft, /FORBIDDEN on scaffold fields/i);
  assert.match(draft, /Self-check: count words in every scaffold field/i);
  assert.match(draft, /MANDATORY PER ACTIVITY/i);
  assert.match(draft, /DLA PRE-EMIT SCAFFOLD GATE/i);
});

test("guided learning: RNA/HCV terse fixture fails before repair and passes after", () => {
  const lib = loadGuidedLearningLib();
  const fixture = JSON.parse(fs.readFileSync(rnaHcvTerseFixturePath, "utf8"));
  const before = lib.evaluateGuidedLearningScaffoldEvidence(fixture);
  assert.ok(before.issueCount >= 3, "expected multiple terse scaffold fields");
  assert.equal(before.meetsGuidedLearningScaffoldQuality, false);
  const lo1Before = before.issues.find((row) => row.activity_id === "LO1");
  assert.ok(lo1Before && lo1Before.fields.includes("activity_preamble"));

  const repaired = lib.repairGuidedLearningScaffoldOnDlaCapture(fixture);
  assert.equal(repaired.repairApplied, true);
  const after = repaired.evidence;
  assert.equal(after.meetsGuidedLearningScaffoldQuality, true);

  const lo1 = repaired.parsed.activities.find((row) => row.activity_id === "LO1");
  assert.ok(lib.wordCount(lo1.activity_preamble) >= 50);
  assert.match(lo1.activity_preamble, /genome|RNA|distinction|translation/i);

  const lo4 = repaired.parsed.activities.find((row) => row.activity_id === "LO4");
  assert.match(lo4.reasoning_orientation, /mechanism|evidence|reasoning/i);

  const lo5 = repaired.parsed.activities.find((row) => row.activity_id === "LO5");
  assert.match(lo5.argument_structure_hint, /consistent criteria/i);
});

test("guided learning: DLA capture return path repairs scaffold before gate clears", () => {
  const api = loadPrismTestApi();
  api.setWorkflowRunCapturedOutputsForTest({});
  const resolved = resolveRnaBrief(api);
  const ctx = rnaDlaContext(api, resolved);
  const fixture = JSON.parse(fs.readFileSync(rnaHcvTerseFixturePath, "utf8"));
  const raw = JSON.stringify(fixture, null, 2);
  const repairedRaw = api.applyGuidedLearningScaffoldRepairToDlaCapture(raw, ctx, "dla-rna-hcv");
  const parsed = JSON.parse(repairedRaw);
  const evidence = api.evaluateGuidedLearningScaffoldEvidence(parsed);
  assert.equal(evidence.meetsGuidedLearningScaffoldQuality, true);
  assert.equal(api.getWorkflowRunGuidedLearningScaffoldValidationForTest("dla-rna-hcv"), "");
  assert.equal(api.getWorkflowRunCaptureGatesBlockReasonForTest("dla-rna-hcv"), "");
});

test("guided learning: non-learner-intent DLA capture still enforces scaffold repair", () => {
  const api = loadPrismTestApi();
  api.setWorkflowRunCapturedOutputsForTest({});
  const fixture = JSON.parse(fs.readFileSync(OBSERVED_TERSE_DLA_PATH, "utf8"));
  const raw = JSON.stringify(fixture, null, 2);
  const ctx = {
    stepCanonicalTitle: "Design Learning Activities",
    stepCanonicalStepId: "step_design_learning_activities",
    workflowGoal: "Prepare virology materials pack",
    desiredOutputs: "JSON artefact"
  };
  const repairedRaw = api.applyGuidedLearningScaffoldRepairToDlaCapture(
    raw,
    ctx,
    "dla-non-learner-intent"
  );
  const parsed = JSON.parse(repairedRaw);
  const evidence = api.evaluateGuidedLearningScaffoldEvidence(parsed);
  assert.equal(evidence.meetsGuidedLearningScaffoldQuality, true);
  parsed.activities.forEach((row) => {
    assert.ok(api.evaluateGuidedLearningScaffoldEvidence({ activities: [row] }).meetsGuidedLearningScaffoldQuality);
  });
  assert.equal(api.getWorkflowRunGuidedLearningScaffoldValidationForTest("dla-non-learner-intent"), "");
});

function buildMockDlaRunLi(stepId, jsonText) {
  const textarea = { value: jsonText };
  return {
    li: {
      classList: { contains: (name) => name === "workflow-step" },
      getAttribute(name) {
        if (name === "data-step-id") return stepId;
        return "";
      },
      querySelector(selector) {
        if (selector === '[data-field="runStepOutput"]') return textarea;
        if (selector === '[data-field="outputName"]') return { value: "learning_activities" };
        return null;
      }
    },
    textarea
  };
}

function setupRnaWorkflowForCaptureTest(api) {
  const resolved = resolveRnaBrief(api);
  api.setWorkflowsForTest([
    {
      id: "wf-rna-capture",
      goal: RNA_HCV_BRIEF.goal,
      desiredOutputs: RNA_HCV_BRIEF.desiredOutputs,
      workflowOutputs: ["Learner-facing page"],
      workflowBriefResolution: { resolvedFactors: resolved },
      steps: [
        {
          id: "dla-step-observed",
          title: "Design Learning Activities",
          canonical_step_id: "step_design_learning_activities",
          outputName: "learning_activities"
        }
      ]
    }
  ]);
  api.setSelectedWorkflowIdForTest("wf-rna-capture");
  api.setWorkflowRunCapturedOutputsForTest({});
  return resolved;
}

function setupNonCanonicalDlaWorkflowForCaptureTest(api) {
  api.setWorkflowsForTest([
    {
      id: "wf-rna-noncanonical",
      goal: "Prepare virology artefacts",
      desiredOutputs: "JSON outputs",
      workflowOutputs: ["learning_activities"],
      steps: [
        {
          id: "dla-step-noncanonical",
          title: "Phase 2 output",
          canonical_step_id: "",
          outputName: "learning_activities"
        }
      ]
    }
  ]);
  api.setSelectedWorkflowIdForTest("wf-rna-noncanonical");
  api.setWorkflowRunCapturedOutputsForTest({});
}

function assertNoExactFailingScaffoldStrings(text, label) {
  EXACT_FAILING_SCAFFOLD_STRINGS.forEach((snippet) => {
    assert.equal(
      String(text || "").includes(snippet),
      false,
      `${label} still contains terse scaffold: ${snippet}`
    );
  });
}

function assertScaffoldQualityAfterRepair(api, text, label) {
  const parsed = JSON.parse(String(text || "{}"));
  const evidence = api.evaluateGuidedLearningScaffoldEvidence(parsed);
  assert.equal(
    evidence.meetsGuidedLearningScaffoldQuality,
    true,
    `${label} should meet scaffold quality after repair`
  );
}

test("guided learning: syncWorkflowRunCapturedOutputToState repairs DLA before store", () => {
  const api = loadPrismTestApi();
  setupRnaWorkflowForCaptureTest(api);
  const fixture = JSON.parse(fs.readFileSync(OBSERVED_TERSE_DLA_PATH, "utf8"));
  const raw = JSON.stringify(fixture, null, 2);
  const { li, textarea } = buildMockDlaRunLi("dla-step-observed", raw);
  api.syncWorkflowRunCapturedOutputToState(li);

  const storedSanitized = api.getWorkflowRunCapturedOutputsForTest()["dla-step-observed"] || "";
  const storedRaw = api.getWorkflowRunCapturedOutputsRawForTest()["dla-step-observed"] || "";
  const upstream = api.readWorkflowRunUpstreamCaptureTextForStepId("dla-step-observed");
  const resolved = api.readWorkflowRunCaptureTextForStepId("dla-step-observed");

  assertScaffoldQualityAfterRepair(api, textarea.value, "textarea");
  assertScaffoldQualityAfterRepair(api, storedRaw, "workflowRunCapturedOutputsRaw");
  assertScaffoldQualityAfterRepair(api, storedSanitized, "workflowRunCapturedOutputs");
  assertScaffoldQualityAfterRepair(api, upstream, "readWorkflowRunUpstreamCaptureTextForStepId");
  assertScaffoldQualityAfterRepair(api, resolved, "readWorkflowRunCaptureTextForStepId");

  const evidence = api.evaluateGuidedLearningScaffoldEvidence(JSON.parse(storedSanitized));
  assert.equal(evidence.meetsGuidedLearningScaffoldQuality, true);
  assert.equal(api.getWorkflowRunGuidedLearningScaffoldValidationForTest("dla-step-observed"), "");
});

test("guided learning: noncanonical DLA step id still repairs across resolvers", () => {
  const api = loadPrismTestApi();
  setupNonCanonicalDlaWorkflowForCaptureTest(api);
  const fixture = JSON.parse(fs.readFileSync(OBSERVED_TERSE_DLA_PATH, "utf8"));
  const raw = JSON.stringify(fixture, null, 2);
  const { li, textarea } = buildMockDlaRunLi("dla-step-noncanonical", raw);

  api.syncWorkflowRunCapturedOutputToState(li);

  const storedSanitized = api.getWorkflowRunCapturedOutputsForTest()["dla-step-noncanonical"] || "";
  const storedRaw = api.getWorkflowRunCapturedOutputsRawForTest()["dla-step-noncanonical"] || "";
  const captureText = api.readWorkflowRunCaptureTextForStepId("dla-step-noncanonical");
  const upstreamText = api.readWorkflowRunUpstreamCaptureTextForStepId("dla-step-noncanonical");
  const resolvedText = api.resolveCaptureTextForWorkflowStep({ id: "dla-step-noncanonical" }, null);

  assertScaffoldQualityAfterRepair(api, textarea.value, "noncanonical textarea");
  assertScaffoldQualityAfterRepair(api, storedRaw, "noncanonical raw store");
  assertScaffoldQualityAfterRepair(api, storedSanitized, "noncanonical sanitized store");
  assertScaffoldQualityAfterRepair(api, captureText, "readWorkflowRunCaptureTextForStepId");
  assertScaffoldQualityAfterRepair(api, upstreamText, "readWorkflowRunUpstreamCaptureTextForStepId");
  assertScaffoldQualityAfterRepair(api, resolvedText, "resolveCaptureTextForWorkflowStep");

  const evidence = api.evaluateGuidedLearningScaffoldEvidence(JSON.parse(storedSanitized));
  assert.equal(evidence.meetsGuidedLearningScaffoldQuality, true);
});

test("guided learning: scheduling-only bridge repaired on capture", () => {
  const api = loadPrismTestApi();
  const scaffoldLib = loadGuidedLearningLib();
  setupNonCanonicalDlaWorkflowForCaptureTest(api);
  const fixture = JSON.parse(fs.readFileSync(OBSERVED_TERSE_DLA_PATH, "utf8"));
  fixture.activities[1].intellectual_coherence_bridge = "Then do the next activity.";
  const raw = JSON.stringify(fixture, null, 2);
  const repairedRaw = api.applyGuidedLearningScaffoldRepairToDlaCapture(
    raw,
    {
      stepCanonicalTitle: "Phase 2 output",
      stepCanonicalStepId: "",
      stepOutputName: "learning_activities",
      desiredOutputs: "JSON outputs"
    },
    "dla-step-fail"
  );
  const parsed = JSON.parse(repairedRaw);
  const evidence = api.evaluateGuidedLearningScaffoldEvidence(parsed);
  assert.equal(evidence.meetsGuidedLearningScaffoldQuality, true);
  assert.equal(
    scaffoldLib.bridgeLooksSchedulingOnly(parsed.activities[1].intellectual_coherence_bridge),
    false
  );
  assert.equal(api.getWorkflowRunGuidedLearningScaffoldValidationForTest("dla-step-fail"), "");
});

test("guided learning: upstream artefact resolver normalizes DLA before DOM fallback parse", () => {
  const api = loadPrismTestApi();
  setupNonCanonicalDlaWorkflowForCaptureTest(api);
  const fixture = JSON.parse(fs.readFileSync(LATEST_RUN_DLA_PATH, "utf8"));
  const raw = JSON.stringify(fixture, null, 2);
  const { li } = buildMockDlaRunLi("dla-step-noncanonical", raw);
  api.setWorkflowStepElementsForTest([li]);

  const resolved = api.resolveUpstreamWorkflowArtefactFromCaptures("learning_activities", {});
  assert.ok(resolved && Array.isArray(resolved.activities));
  const resolvedText = JSON.stringify(resolved);
  assertNoExactFailingScaffoldStrings(resolvedText, "upstream resolver DOM fallback");

  const evidence = api.evaluateGuidedLearningScaffoldEvidence(resolved);
  assert.equal(evidence.meetsGuidedLearningScaffoldQuality, true);
});
