/**
 * Sprint 30 Slice 30-2 — reasoning_contract (PEL) resolver, prompts, evaluator.
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
const gamMarxLeakPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "workflow-brief",
  "gam-marx-facilitator-leak.txt"
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

const PEL_REASONING_MARKER =
  /pedagogic enrichment — reasoning contract \(auto-applied\)/i;
const PEL_ORIENTATION_MARKER =
  /pedagogic enrichment — orientation contract \(auto-applied\)/i;

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence +  7, close).trim()).workflowBriefConfig;
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

function gamScaffoldPrompt(brief) {
  const resolved = resolveBrief(brief);
  const ctx = {
    workflowGoal: brief.goal,
    desiredOutputs: brief.desiredOutputs,
    workflowInputs: brief.inputs || "",
    stepCanonicalStepId: "step_generate_activity_materials",
    stepCanonicalTitle: "Generate Activity Materials",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  return api.applyWorkflowStepRuntimePromptAugmentations(
    "Generate activity materials.\n",
    {
      canonical_step_id: "step_generate_activity_materials",
      canonical_title: "Generate Activity Materials",
      title: "Generate Activity Materials"
    },
    buildWorkflowRecord(brief, resolved)
  );
}

test("30-2: Marx self-directed resolves orientation_contract and reasoning_contract", () => {
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const ctx = buildStepContext(
    MARX_SELF_STUDY_BRIEF,
    resolved,
    "step_design_learning_activities",
    "Design Learning Activities"
  );
  const ids = [...api.resolvePedagogicEnrichmentContractIds(ctx)];
  assert.deepEqual(ids, ["orientation_contract", "reasoning_contract"]);
  assert.equal(api.SPRINT_30_PEC_REASONING_CONTRACT_ID, "reasoning_contract");
  assert.ok(api.PEL_REASONING_FIELD_IDS.includes("evidence_use_prompt"));
  assert.ok(api.PEL_REASONING_FIELD_IDS.includes("conceptual_contrast_prompt"));
});

test("30-2: RNA transcript self-study resolves reasoning_contract", () => {
  const resolved = resolveBrief(TRANSCRIPT_SELF_STUDY_BRIEF);
  const ctx = buildStepContext(
    TRANSCRIPT_SELF_STUDY_BRIEF,
    resolved,
    "step_design_learning_activities",
    "Design Learning Activities"
  );
  const ids = [...api.resolvePedagogicEnrichmentContractIds(ctx)];
  assert.ok(ids.includes("reasoning_contract"));
});

test("41-5: workshop learner handout resolves reasoning_contract", () => {
  const resolved = resolveBrief(WORKSHOP_BRIEF);
  const ctx = buildStepContext(
    WORKSHOP_BRIEF,
    resolved,
    "step_design_learning_activities",
    "Design Learning Activities"
  );
  const ids = [...api.resolvePedagogicEnrichmentContractIds(ctx)];
  assert.ok(ids.includes("reasoning_contract"));
});

test("30-2: facilitator-only workshop resolves no reasoning_contract", () => {
  const resolved = resolveBrief({
    goal: "Design a 90-minute facilitated workshop on team communication for nursing students.",
    inputs: "Face-to-face classroom with tutor facilitation",
    desiredOutputs: "Facilitator guide and slide deck",
    selectedDomains: ["learning-design"]
  });
  const ctx = buildStepContext(
    {
      goal: "Design a 90-minute facilitated workshop on team communication for nursing students.",
      inputs: "Face-to-face classroom with tutor facilitation",
      desiredOutputs: "Facilitator guide and slide deck",
      selectedDomains: ["learning-design"]
    },
    resolved,
    "step_design_learning_activities",
    "Design Learning Activities"
  );
  const ids = [...api.resolvePedagogicEnrichmentContractIds(ctx)];
  assert.equal(ids.length, 0);
});

test("30-2: DLA runtime prompt includes reasoning contract and field policy", () => {
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const prompt = applyRuntimePrompt(
    "Design executable learning activities.\n",
    MARX_SELF_STUDY_BRIEF,
    resolved,
    "step_design_learning_activities",
    "Design Learning Activities"
  );
  assert.match(prompt, PEL_REASONING_MARKER);
  assert.match(prompt, /SCAFFOLD GENRE/i);
  assert.match(prompt, /\bevidence_use_prompt\b/);
  assert.match(prompt, /\bargument_structure_hint\b/);
  assert.match(prompt, /\bconceptual_contrast_prompt\b/);
  assert.match(prompt, /\bdisciplinary_lens\b/);
  assert.match(prompt, /never restate learner_task, activity_preamble/i);
  assert.match(prompt, /think critically/i);
  assert.match(prompt, PEL_ORIENTATION_MARKER);
});

test("30-2: GAM runtime prompt includes reasoning materials without duplicate PEL reasoning contract", () => {
  const prompt = gamScaffoldPrompt(MARX_SELF_STUDY_BRIEF);
  assert.doesNotMatch(prompt, PEL_REASONING_MARKER);
  assert.match(prompt, /self-directed learner-page reasoning materials \(auto-applied\)/i);
  assert.match(prompt, /GAM-PRES-08 \(A1\)/i);
  assert.doesNotMatch(prompt, /short worked micro-example/i);
  assert.match(prompt, /before you re-read/i);
  assert.match(prompt, /self-directed learner-page self-study materials \(auto-applied\)/i);
  assert.match(prompt, /anti-redundancy must never reduce a material below the minimum instructional richness required by GAM-PRES-08/i);
  assert.doesNotMatch(prompt, PEL_ORIENTATION_MARKER);
});

test("30-2b: GAM prompts forbid facilitator labels; material voice preserves GAM-PRES-08 depth", () => {
  const prompt = gamScaffoldPrompt(MARX_SELF_STUDY_BRIEF);
  assert.match(prompt, /Tutor guidance/i);
  assert.match(prompt, /Never emit facilitator-facing headings/i);
  assert.match(prompt, /GAM-PRES-08/i);
  assert.match(prompt, /anti-redundancy must never reduce a material below the minimum instructional richness/i);
  assert.match(prompt, /Prefer instructional completeness over brevity/i);
  assert.doesNotMatch(prompt, /add artefacts \(tables, excerpts, worked rows\) only/i);
  assert.match(prompt, /comparison scaffolds and evidence tables/i);
});

function gamSanitizeContext(brief, resolved) {
  return {
    workflowGoal: brief.goal,
    desiredOutputs: brief.desiredOutputs,
    workflowInputs: brief.inputs || "",
    stepCanonicalStepId: "step_generate_activity_materials",
    stepCanonicalTitle: "Generate Activity Materials",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
}

test("30-2b: sanitizeSelfDirectedGamMaterialsOutput strips Facilitator use blocks", () => {
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const raw = fs.readFileSync(gamMarxLeakPath, "utf8");
  const result = api.sanitizeSelfDirectedGamMaterialsOutput(
    raw,
    gamSanitizeContext(MARX_SELF_STUDY_BRIEF, resolved)
  );
  assert.equal(result.sanitized, true);
  assert.ok(result.strippedLabels.length >= 1);
  assert.doesNotMatch(result.text, /Facilitator use:/i);
  assert.match(result.text, /Major Life Events and Phases of Karl Marx/i);
  assert.match(result.text, /Industrial Revolution/);
  assert.match(result.text, /\| Historical Event \|/);
});

test("30-2b: sanitizer no-op for facilitated workshop GAM", () => {
  const resolved = resolveBrief(WORKSHOP_BRIEF);
  const sample = "Facilitator use:\nRun the discussion at minute 10.\n\n| Step | Notes |\n| --- | --- |";
  const result = api.sanitizeSelfDirectedGamMaterialsOutput(
    sample,
    gamSanitizeContext(WORKSHOP_BRIEF, resolved)
  );
  assert.equal(result.sanitized, false);
  assert.equal(result.text, sample);
  assert.match(result.text, /Facilitator use:/i);
});

test("30-2b: sanitizer drops paragraph duplicating upstream learner_task", () => {
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const dupSentence =
    "Complete the comparison table for Manifesto and Kapital with purpose and difference.";
  const gam =
    "Material: M1\nPurpose: Table\nContent:\n\n" +
    dupSentence +
    "\n\n| Work | Purpose |\n| --- | --- |\n| Manifesto |  |\n| Das Kapital |  |";
  const ctx = gamSanitizeContext(MARX_SELF_STUDY_BRIEF, resolved);
  ctx.upstreamActivities = [
    {
      activity_id: "A3",
      learner_task: dupSentence,
      reasoning_orientation: "Compare as historical arguments."
    }
  ];
  const result = api.sanitizeSelfDirectedGamMaterialsOutput(gam, ctx);
  assert.equal(result.sanitized, true);
  assert.ok(result.droppedParagraphs.length >= 1);
  assert.doesNotMatch(result.text, /Complete the comparison table for Manifesto and Kapital/);
  assert.match(result.text, /\| Work \| Purpose \|/);
});

test("30-2b: evaluatePelGamMaterialStabilisation flags facilitator labels", () => {
  const bad = api.evaluatePelGamMaterialStabilisation(
    "Facilitator use:\nEncourage learners to discuss in groups.",
    {}
  );
  assert.equal(bad.satisfied, false);
  assert.ok(bad.facilitatorLabelsPresent);
  const good = api.evaluatePelGamMaterialStabilisation(
    "Purpose: Reference excerpt\n\n| Concept | Notes |\n| --- | --- |\n| HCV |  |",
    {}
  );
  assert.equal(good.satisfied, true);
});

test("30-2: Design Page prompt preserves reasoning fields but omits reasoning PEC block", () => {
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const prompt = applyRuntimePrompt(
    "Assemble learner page.\n",
    MARX_SELF_STUDY_BRIEF,
    resolved,
    "step_design_page",
    "Design Page"
  );
  assert.doesNotMatch(prompt, PEL_ORIENTATION_MARKER);
  assert.doesNotMatch(prompt, PEL_REASONING_MARKER);
  assert.match(prompt, /\bevidence_use_prompt\b/);
  assert.match(prompt, /\bconceptual_contrast_prompt\b/);
});

test("30-2: evaluatePelReasoningContractSatisfaction passes well-formed reasoning activities", () => {
  const good = {
    activities: [
      {
        activity_id: "A1",
        activity_preamble: "Orient to Marx's exile before the timeline task.",
        learner_task: "Place four life events in chronological order on the timeline.",
        reasoning_orientation:
          "Use chronological causation: ask which event could plausibly influence the next, not just dates.",
        self_explanation_prompt:
          "Before checking the answer key, write one sentence on which event surprised you."
      },
      {
        activity_id: "A2",
        title: "Compare major works",
        activity_preamble: "You will compare two texts side by side.",
        learner_task: "Complete the comparison table for Manifesto and Kapital.",
        reasoning_orientation:
          "Compare as historical arguments: claim, evidence, and implied audience — not plot summary.",
        argument_structure_hint: "Claim → cited passage → implication for each work.",
        conceptual_contrast_prompt:
          "Contrast revolutionary programme with systematic critique — avoid treating them as identical.",
        self_explanation_prompt: "State which text you find more convincing and why, in one sentence."
      }
    ]
  };
  const evalResult = api.evaluatePelReasoningContractSatisfaction(good);
  assert.equal(evalResult.satisfied, true);
  assert.equal(evalResult.reasoningOrientationCount, 2);
  assert.equal(evalResult.missingFields.length, 0);
});

test("30-2: evaluatePelReasoningContractSatisfaction flags source and generic gaps", () => {
  const sourceActivities = {
    activities: [
      {
        activity_id: "A1",
        learner_task: "Read the transcript excerpt and list genome types.",
        required_materials: [
          { material_id: "M1", type: "text", purpose: "Transcript excerpt on RNA viruses" }
        ],
        reasoning_orientation: "Think critically about the topic."
      },
      {
        activity_id: "A2",
        title: "Compare HCV to other RNA viruses",
        learner_task: "Distinguish HCV from other RNA viruses in a table.",
        reasoning_orientation: "Analyse the topic carefully."
      }
    ]
  };
  const evalResult = api.evaluatePelReasoningContractSatisfaction(sourceActivities, {
    sourceBrief: true,
    inputStrategy: "provided_source_content"
  });
  assert.equal(evalResult.satisfied, false);
  assert.ok(evalResult.missingFields.includes("evidence_use_prompt"));
  assert.ok(evalResult.missingFields.includes("argument_structure_hint"));
  assert.ok(evalResult.missingFields.includes("conceptual_contrast_prompt"));
  assert.ok(evalResult.missingFields.includes("generic_critical_thinking"));
  assert.ok(evalResult.missingFields.includes("self_explanation_prompt"));
});

test("30-2: evaluatePelReasoningContractSatisfaction warns on duplication with learner_task", () => {
  const dup = {
    activities: [
      {
        activity_id: "A1",
        learner_task: "Complete the comparison table for Manifesto and Kapital with purpose and difference.",
        reasoning_orientation:
          "Complete the comparison table for Manifesto and Kapital with purpose and difference.",
        self_explanation_prompt: "Write one reflective sentence after comparing."
      },
      {
        activity_id: "A2",
        learner_task: "Apply Marxist concepts to a contemporary labour dispute.",
        reasoning_orientation: "Trace claim and evidence when applying concepts to the dispute case.",
        self_explanation_prompt: "Explain your application in your own words before reading the sample."
      }
    ]
  };
  const evalResult = api.evaluatePelReasoningContractSatisfaction(dup);
  assert.ok(evalResult.warnings.some((w) => w.includes("substantially overlaps")));
  assert.ok(evalResult.missingFields.includes("reasoning_field_duplication"));
});

test("30-2: evaluatePedagogicEnrichmentContractSatisfaction routes reasoning_contract", () => {
  const routed = api.evaluatePedagogicEnrichmentContractSatisfaction(
    { activities: [] },
    { contractId: "reasoning_contract" }
  );
  assert.equal(routed.contractId, "reasoning_contract");
});

test("30-2: procedural Marx DLA fails reasoning evaluator", () => {
  const procedural = JSON.parse(fs.readFileSync(marxProceduralDlaPath, "utf8"));
  const evalResult = api.evaluatePelReasoningContractSatisfaction(procedural);
  assert.equal(evalResult.satisfied, false);
  assert.ok(evalResult.missingFields.length > 0);
});

test("30-2: facilitator language in GAM text fails reasoning evaluator", () => {
  const evalResult = api.evaluatePelReasoningContractSatisfaction(
    { activities: [{ activity_id: "A1", reasoning_orientation: "Trace mechanisms in the replication diagram." }] },
    { gamText: "Facilitator use: Run the discussion at minute 10." }
  );
  assert.ok(evalResult.missingFields.includes("facilitator_facing_language"));
});

function pageSanitizeContext(brief, resolved) {
  return {
    workflowGoal: brief.goal,
    desiredOutputs: brief.desiredOutputs,
    workflowInputs: brief.inputs || "",
    resolvedFactors: resolved,
    workflowBriefResolution: { resolvedFactors: resolved }
  };
}

function learningActivitiesRows(page) {
  const section = (page.sections || []).find(
    (s) => s.section_id === "learning_activities" || /learning activities/i.test(String(s.heading || ""))
  );
  if (!section) return [];
  const content = section.content;
  return Array.isArray(content) ? content : content?.activities || [];
}

test("30-2c: strips facilitator_notes from self-directed learner page activity rows", () => {
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const page = {
    artifact_type: "page",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            activity_id: "A1",
            learner_task: "Complete the timeline.",
            facilitator_notes: "Circulate during minutes 5–12 and prompt pairs.",
            facilitator_moves: "Ask groups to report back."
          }
        ]
      }
    ]
  };
  const result = api.sanitizeSelfDirectedLearnerPageActivityRows(
    page,
    pageSanitizeContext(MARX_SELF_STUDY_BRIEF, resolved)
  );
  assert.equal(result.sanitized, true);
  const row = learningActivitiesRows(result.page)[0];
  assert.equal(row.facilitator_notes, undefined);
  assert.equal(row.facilitator_moves, undefined);
  assert.match(result.meta.removedFields.join(","), /facilitator_notes/);
});

test("30-2c: strips choreographic support_note but preserves learner-facing support_note", () => {
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const page = {
    artifact_type: "page",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            activity_id: "A1",
            learner_task: "Use the checklist.",
            support_note: "Circulate during minutes 5–12."
          },
          {
            activity_id: "A2",
            learner_task: "Reflect on your answer.",
            support_note: "If you are stuck, use this checklist before moving on."
          }
        ]
      }
    ]
  };
  const result = api.sanitizeSelfDirectedLearnerPageActivityRows(
    page,
    pageSanitizeContext(MARX_SELF_STUDY_BRIEF, resolved)
  );
  assert.equal(result.sanitized, true);
  const rows = learningActivitiesRows(result.page);
  assert.equal(rows[0].support_note, undefined);
  assert.match(rows[1].support_note, /If you are stuck/i);
});

test("30-2c: facilitated workshop page keeps facilitator_notes and choreographic support_note", () => {
  const resolved = resolveBrief(WORKSHOP_BRIEF);
  const page = {
    artifact_type: "page",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            activity_id: "A1",
            facilitator_notes: "Time-check at minute 20.",
            support_note: "Circulate during minutes 5–12."
          }
        ]
      }
    ]
  };
  const result = api.sanitizeSelfDirectedLearnerPageActivityRows(
    page,
    pageSanitizeContext(WORKSHOP_BRIEF, resolved)
  );
  assert.equal(result.sanitized, false);
  const row = learningActivitiesRows(result.page)[0];
  assert.match(row.facilitator_notes, /Time-check/);
  assert.match(row.support_note, /Circulate/);
});

test("30-2c: renderer omits Support note after facilitator_notes stripped", () => {
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const page = {
    artifact_type: "page",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            activity_id: "A1",
            title: "Timeline task",
            learner_task: "Order the events.",
            facilitator_notes: "Ask students to share in pairs during class."
          },
          {
            activity_id: "A2",
            title: "Reflection",
            learner_task: "Write one sentence.",
            support_note: "Before moving on, explain your reasoning in your own words."
          }
        ]
      }
    ]
  };
  const dirtyHtml = api.buildUtilityStructuredHtmlForTest(page).html || "";
  assert.match(dirtyHtml, /util-support-note/i);
  api.applyPageCompositionValidationForUtilitiesPage(page, {
    resolvedFactors: resolved,
    base: MARX_SELF_STUDY_BRIEF,
    upstreamLearningActivities: { activities: [] }
  });
  const cleanHtml = api.buildUtilityStructuredHtmlForTest(page).html || "";
  assert.doesNotMatch(cleanHtml, /Ask students to share in pairs/i);
  assert.match(cleanHtml, /Before moving on/i);
  assert.equal(learningActivitiesRows(page)[0].facilitator_notes, undefined);
});

test("30-2c: Marx live page fixture stays clean through composition validation", () => {
  const livePath = path.join(
    repoRoot,
    "docs/development/sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/live-artefacts/marx-page.json"
  );
  if (!fs.existsSync(livePath)) return;
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const page = JSON.parse(fs.readFileSync(livePath, "utf8"));
  api.applyPageCompositionValidationForUtilitiesPage(page, {
    resolvedFactors: resolved,
    base: MARX_SELF_STUDY_BRIEF,
    upstreamLearningActivities: { activities: learningActivitiesRows(page) }
  });
  learningActivitiesRows(page).forEach((row) => {
    assert.equal(row.facilitator_notes, undefined);
    assert.equal(row.facilitator_note, undefined);
    if (row.support_note) {
      assert.equal(api.pelPageSupportNoteLooksFacilitatorChoreography(row.support_note), false);
    }
  });
});
