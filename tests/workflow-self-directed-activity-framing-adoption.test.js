/**
 * Self-directed activity framing adoption — prompt contract, DLA coverage, downstream preservation.
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
const LEGACY_DLA_LIBRARY_PROMPT =
  "Context:\nDesign executable learning_activities.\n\nInstructions:\n" +
  "- Every activity must include learner_task and expected_output\n" +
  "- Every activity must include facilitator_moves\n\nOutput:\n" +
  "- Return JSON with activities array\n" +
  "- Each activity includes activity_id, title, learner_task, expected_output, facilitator_moves\n";

const MARX_SELF_STUDY_BRIEF = {
  goal:
    "Create a self-directed learning page on Karl Marx covering life phases, cause-effect links, comparison of major works, and application of core concepts.",
  inputs: "Undergraduate (self-directed study)",
  desiredOutputs: "Learner-facing page",
  selectedDomains: ["learning-design"]
};

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

function applyDlaPromptPipeline(baseDraft, briefCtx, resolved) {
  const ctx = Object.assign({}, briefCtx, {
    workflowBriefResolution: { resolvedFactors: resolved }
  });
  return api.applySelfDirectedLearnerPageStepScaffoldsToDraft(
    api.applyPedagogicCognitionContractScaffoldToDraft(baseDraft, ctx),
    ctx
  );
}

function marxResolvedFactors() {
  const explicit = api.extractWorkflowBriefExplicitFactors(MARX_SELF_STUDY_BRIEF);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    MARX_SELF_STUDY_BRIEF.goal,
    MARX_SELF_STUDY_BRIEF.inputs
  );
  return api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    MARX_SELF_STUDY_BRIEF
  ).resolved;
}

test("Marx self-study brief: inferred factors trigger DLA framing without manual overrides", () => {
  const resolved = marxResolvedFactors();
  assert.equal(resolved.delivery_context, "self_directed");
  const sessionMats = resolved.session_materials;
  const hasPage = Array.isArray(sessionMats)
    ? sessionMats.map((x) => String(x).toLowerCase()).includes("page")
    : String(sessionMats || "").toLowerCase().includes("page");
  assert.ok(hasPage, "expected session_materials to include page from brief inference");
  const prompt = applyDlaPromptPipeline("Design executable learning activities.\n", {
    workflowGoal: MARX_SELF_STUDY_BRIEF.goal,
    desiredOutputs: MARX_SELF_STUDY_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Design Learning Activities",
    stepCanonicalStepId: "step_design_learning_activities"
  }, resolved);
  assert.match(prompt, /output contract \(self-directed learner page/i);
  assert.match(prompt, /each activity object must include activity_preamble/i);
  assert.match(prompt, /self_explanation_prompt: at least two activities/i);
  assert.match(prompt, /self-directed learner-page activity framing \(auto-applied\)/i);
  assert.match(
    prompt,
    /For self-directed learner-page workflows, each activity MUST also include activity_preamble/i
  );
  assert.match(prompt, /self-directed activity json example \(authoritative shape/i);
});

test("DLA prompt pipeline: output contract override reaches final prompt", () => {
  const resolved = marxResolvedFactors();
  const prompt = applyDlaPromptPipeline("Design executable learning activities.\n", {
    workflowGoal: MARX_SELF_STUDY_BRIEF.goal,
    desiredOutputs: MARX_SELF_STUDY_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Design Learning Activities",
    stepCanonicalStepId: "step_design_learning_activities"
  }, resolved);
  assert.match(prompt, /output contract \(self-directed learner page/i);
  assert.match(prompt, /each activity object must include activity_preamble/i);
  assert.match(prompt, /self_explanation_prompt: at least two activities/i);
  assert.match(prompt, /self-directed learner-page activity framing \(auto-applied\)/i);
  assert.match(prompt, /LD-SELF-DIRECTED-RHETORIC \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /learner-action rhetoric \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /worked-example and faded-support \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /epistemic synthesis and closure \(auto-applied\)/i);
  assert.match(prompt, /named move \+ changed context/i);
  assert.match(prompt, /limit of transfer/i);
  assert.match(prompt, /what should now be clearer/i);
  assert.match(prompt, /Explicitly avoid:.*reflect on your learning/i);
  assert.match(prompt, /intellectual_coherence_bridge: on each activity after the first/i);
  assert.match(prompt, /OUTPUT CONTRACT on Design Learning Activities/i);
  assert.match(prompt, /interpretive ambiguity/i);
  assert.match(prompt, /do not repeat the overview tension verbatim/i);
  assert.doesNotMatch(prompt, /reflect on uncertainties you encountered/i);
  assert.match(prompt, /coherent intellectual journey/i);
  assert.match(prompt, /do not repeat the full overview/i);
  assert.match(prompt, /What changed in your understanding/i);
  assert.match(prompt, /step → meaning/i);
  assert.match(prompt, /Check your thinking:/i);
  assert.match(prompt, /modelled reasoning/i);
  assert.match(prompt, /expected_output describes evidence of completion/i);
});

test("facilitated workshop brief: DLA prompt does not include self-directed output contract", () => {
  const brief = {
    goal: "Design a 90-minute facilitated workshop on team communication for nursing students.",
    inputs: "Face-to-face classroom with tutor facilitation",
    desiredOutputs: "Facilitator guide and slide deck",
    selectedDomains: ["learning-design"]
  };
  const explicit = api.extractWorkflowBriefExplicitFactors(brief);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    brief.goal,
    brief.inputs
  );
  const { resolved } = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    brief
  );
  const prompt = applyDlaPromptPipeline("Design executable learning activities.\n", {
    workflowGoal: brief.goal,
    desiredOutputs: brief.desiredOutputs,
    stepCanonicalTitle: "Design Learning Activities",
    stepCanonicalStepId: "step_design_learning_activities"
  }, resolved);
  assert.doesNotMatch(prompt, /output contract \(self-directed learner page/i);
  assert.doesNotMatch(prompt, /self-directed learner-page activity framing \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /LD-SELF-DIRECTED-RHETORIC \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /learner-action rhetoric \(auto-applied\)/i);
});

test("Design Page prompt: field preservation scaffold for self-directed learner page", () => {
  const resolved = marxResolvedFactors();
  resolved.delivery_context = "self_directed";
  resolved.session_materials = ["page"];
  const ctx = {
    workflowGoal: MARX_SELF_STUDY_BRIEF.goal,
    desiredOutputs: MARX_SELF_STUDY_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Design Page",
    stepCanonicalStepId: "step_design_page",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  const scaffolded = api.applySelfDirectedLearnerPageStepScaffoldsToDraft(
    "Assemble learner page.\n",
    ctx
  );
  const prompt = api.applyLdDesignPageComposeContractToDraft(scaffolded, ctx);
  assert.match(prompt, /LD-DESIGN-PAGE-COMPOSE-CONTRACT \(auto-applied\)/i);
  assert.match(prompt, /Activity field preservation/i);
  assert.match(prompt, /expected_output and support_note/i);
  assert.match(prompt, /LD-SELF-DIRECTED-RHETORIC \(auto-applied\)/i);
  assert.match(prompt, /Design Page rider/i);
  assert.match(prompt, /mechanism evidence does not transfer to policy/i);
  assert.match(prompt, /what distinction can now be sustained/i);
  assert.match(prompt, /cumulative reasoning journeys/i);
  assert.match(prompt, /plausible misconception/i);
  assert.match(prompt, /overview and\/or learning_purpose/i);
  assert.match(prompt, /activity_preamble/i);
  assert.match(prompt, /self_explanation_prompt/i);
});

test("evaluateSelfDirectedDlaActivityFramingCoverage: well-formed self-directed activities", () => {
  const cov = api.evaluateSelfDirectedDlaActivityFramingCoverage([
    {
      activity_id: "A1",
      activity_preamble: "Before analysing Marx's exile, consider how displacement shapes ideas.",
      prior_knowledge_activation: "Recall one historical example of exile.",
      learner_task: "Complete the table."
    },
    {
      activity_id: "A2",
      activity_preamble: "As you compare these texts, notice differences in audience and purpose.",
      self_explanation_prompt: "After comparing, state which text is more persuasive and why.",
      learner_task: "Fill the comparison table."
    },
    {
      activity_id: "A3",
      activity_preamble: "Apply Marx's concepts to the factory scenario step by step.",
      transfer_or_application_task: "Link your explanation to one concept from the checklist.",
      learner_task: "Write a short explanation."
    }
  ]);
  assert.equal(cov.meetsPreambleCoverage, true);
  assert.equal(cov.meetsSelectiveCognitionCoverage, true);
});

test("evaluateSelfDirectedDlaActivityFramingCoverage: procedural-only activities fail", () => {
  const cov = api.evaluateSelfDirectedDlaActivityFramingCoverage([
    { activity_id: "A1", learner_task: "Do the task.", expected_output: "Table" },
    { activity_id: "A2", learner_task: "Compare works.", expected_output: "Notes" }
  ]);
  assert.equal(cov.meetsPreambleCoverage, false);
});

test("downstream: mergeSelfDirectedActivityFramingFieldsIntoPageActivities preserves DLA fields", () => {
  const upstream = {
    activities: [
      {
        activity_id: "A2",
        title: "Linking Experience to Theory",
        activity_preamble: "Before analysing Marx's ideas, consider how exile shapes thinking.",
        self_explanation_prompt: "Note one way biography might influence theory.",
        learner_task: "Complete the table."
      }
    ]
  };
  const page = {
    artifact_type: "page",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            activity_id: "A2",
            title: "Linking Experience to Theory",
            learner_task: "Complete the table."
          }
        ]
      }
    ]
  };
  const merged = api.mergeSelfDirectedActivityFramingFieldsIntoPageActivities(page, upstream);
  assert.ok(merged >= 2);
  const row = page.sections[0].content[0];
  assert.match(String(row.activity_preamble || ""), /exile shapes thinking/i);
  assert.match(String(row.self_explanation_prompt || ""), /biography/i);
});

test("downstream: applyPedagogicCognitionSemanticsToComposedPage merges framing without cognition pack", () => {
  const upstream = {
    activities: [
      {
        activity_id: "A1",
        activity_preamble: "Orienting preamble from DLA.",
        learner_task: "Task"
      }
    ]
  };
  const page = {
    artifact_type: "page",
    sections: [
      {
        section_id: "learning_activities",
        content: [{ activity_id: "A1", learner_task: "Task only on page." }]
      }
    ]
  };
  const brief = MARX_SELF_STUDY_BRIEF;
  const explicit = api.extractWorkflowBriefExplicitFactors(brief);
  const { resolved } = api.resolveWorkflowBriefFactors(ldBriefConfig, explicit, {}, {}, brief);
  const out = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    upstreamLearningActivities: upstream,
    resolvedFactors: resolved,
    explicitBriefFactors: explicit,
    workflowBriefConfig: ldBriefConfig,
    base: brief
  });
  assert.match(
    String(out.sections[0].content[0].activity_preamble || ""),
    /Orienting preamble from DLA/
  );
});

test("runtime resolveStepPromptText: legacy library prompt receives self-directed output contract", () => {
  const resolved = marxResolvedFactors();
  const wf = {
    id: "wf-marx-self-study",
    name: "Marx self-study page",
    workflowOutputSpec: {
      goal: MARX_SELF_STUDY_BRIEF.goal,
      desiredOutputs: MARX_SELF_STUDY_BRIEF.desiredOutputs
    },
    workflowOutputs: ["Learner-facing page"],
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  api.setPromptsForTest([
    { id: "legacy-dla", title: "Legacy DLA", body: LEGACY_DLA_LIBRARY_PROMPT }
  ]);
  const step = {
    title: "Design Learning Activities",
    canonical_step_id: "step_design_learning_activities",
    outputName: "learning_activities",
    prompt_source_type: "library_prompt",
    promptId: "legacy-dla"
  };
  const resolvedPrompt = api.resolveStepPromptText(step, wf);
  assert.equal(resolvedPrompt.error, "");
  assert.match(resolvedPrompt.text, /output contract \(self-directed learner page/i);
  assert.match(resolvedPrompt.text, /activity_preamble/i);
  assert.match(resolvedPrompt.text, /facilitator_moves: omit for self-directed/i);
});

test("runtime buildWorkflowStepInstructions: Marx DLA run prompt includes framing contract", () => {
  const resolved = marxResolvedFactors();
  const wf = {
    id: "wf-marx-runtime",
    workflowOutputSpec: {
      goal: MARX_SELF_STUDY_BRIEF.goal,
      desiredOutputs: MARX_SELF_STUDY_BRIEF.desiredOutputs
    },
    workflowOutputs: ["Learner-facing page"],
    workflowBriefResolution: { resolvedFactors: resolved },
    steps: []
  };
  api.setWorkflowsForTest([wf]);
  api.setPromptsForTest([
    { id: "legacy-dla", title: "Legacy DLA", body: LEGACY_DLA_LIBRARY_PROMPT }
  ]);
  api.setSelectedWorkflowIdForTest("wf-marx-runtime");
  const step = {
    title: "Design Learning Activities",
    canonical_step_id: "step_design_learning_activities",
    outputName: "learning_activities",
    prompt_source_type: "library_prompt",
    promptId: "legacy-dla"
  };
  const instructions = api.buildWorkflowStepInstructions(step, 0, null);
  assert.match(instructions, /output contract \(self-directed learner page/i);
  assert.match(instructions, /self-directed activity json example/i);
});

test("Marx procedural DLA fixture: missing framing fails coverage heuristic", () => {
  const procedural = JSON.parse(fs.readFileSync(marxProceduralDlaPath, "utf8"));
  const cov = api.evaluateSelfDirectedDlaActivityFramingCoverage(procedural.activities);
  assert.equal(cov.meetsPreambleCoverage, false);
  assert.equal(cov.meetsSelectiveCognitionCoverage, false);
  assert.ok(cov.preambleCount === 0);
});

test("renderer: merged framing fields surface in HTML before What to do", () => {
  const page = {
    artifact_type: "page",
    title: "Marx",
    sections: [
      {
        section_id: "learning_activities",
        content: [
          {
            activity_id: "A2",
            title: "Compare works",
            activity_preamble: "As you compare these texts, notice how arguments differ.",
            self_explanation_prompt: "State which text you find more convincing.",
            learner_task: "Complete the comparison table."
          }
        ]
      }
    ]
  };
  const r = api.buildUtilityStructuredHtmlForTest(page);
  assert.ok(r && !r.error);
  const html = String(r.html);
  const preambleIdx = html.indexOf("util-activity-preamble");
  const taskIdx = html.indexOf("What to do");
  assert.ok(preambleIdx !== -1 && taskIdx !== -1);
  assert.ok(preambleIdx < taskIdx);
  assert.match(html, /util-cognition--explain/);
});
