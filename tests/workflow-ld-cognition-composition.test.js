/**
 * Sprint 28-5d — cognition-aware composition parity (bounded page preservation).
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
const rnaFixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "workflow-brief-ld-sparse",
  "rna-virus-activities-formative.json"
);

const PEER_GOAL =
  "Peer instruction session: individual answer, pair discussion, then revise answers after discussion.";

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
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function resolveBrief(api, config, brief) {
  const explicit = api.extractWorkflowBriefExplicitFactors({
    goal: brief.goal,
    inputs: brief.inputs || "",
    desiredOutputs: brief.desiredOutputs || "",
    startingArtefact: brief.startingArtefact || "",
    selectedDomains: ["learning-design"]
  });
  const { resolved } = api.resolveWorkflowBriefFactors(config, explicit, {}, {}, brief);
  const packs = api.resolvePedagogicCognitionPackIds(config, resolved, explicit, brief);
  const contract = api.resolvePedagogicCognitionContractRequirements(
    packs,
    resolved,
    explicit,
    config,
    brief
  );
  return { explicit, resolved, packs, contract };
}

function sectionIndex(page, kind) {
  return (page.sections || []).findIndex((s) => s.section_id === kind);
}

const api = loadPrismTestApi();
const ldBriefConfig = api.normalizeWorkflowBriefConfig(
  extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"))
);
const rnaFixture = JSON.parse(fs.readFileSync(rnaFixturePath, "utf8"));

test("28-5d: lean RNA page unchanged without cognition intent", () => {
  const page = {
    artifact_type: "page",
    title: "RNA quiz",
    sections: [
      {
        section_id: "assessment_check",
        heading: "Quiz",
        content: { items: [{ item_id: "Q1", stem: "Which is RNA?", correct_answer: "A" }] }
      }
    ]
  };
  const brief = { goal: rnaFixture.brief.goal, startingArtefact: "generate_from_topic" };
  const { resolved, explicit } = resolveBrief(api, ldBriefConfig, brief);
  const out = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    resolvedFactors: resolved,
    explicitBriefFactors: explicit,
    workflowBriefConfig: ldBriefConfig,
    base: brief
  });
  assert.equal(out.metadata && out.metadata.cognition_profile, undefined);
  assert.equal(out.sections.length, 1);
  assert.equal(out.sections[0].section_id, "assessment_check");
});

test("28-5d: peer instruction injects learning_activities before assessment", () => {
  const upstream = {
    activities: [
      {
        activity_id: "PI-1",
        title: "Predict and revise",
        initial_position_prompt: "State your prediction.",
        reasoning_revision_prompt: "Revise after pair discussion.",
        revision_trigger: "After pairs report back"
      }
    ]
  };
  const page = {
    artifact_type: "page",
    title: "Peer session",
    sections: [
      {
        section_id: "assessment_check",
        heading: "MCQ",
        content: {
          items: [{ item_id: "MCQ-1", stem: "Sample stem", correct_answer: "B" }]
        }
      }
    ]
  };
  const brief = { goal: PEER_GOAL };
  const { resolved, explicit, packs, contract } = resolveBrief(api, ldBriefConfig, brief);
  assert.ok(packs.includes("peer_instruction_pack"));
  const semantics = api.resolvePedagogicCognitionCompositionSemantics(
    packs,
    contract,
    resolved,
    explicit,
    brief,
    ldBriefConfig
  );
  assert.equal(semantics.cognitionCompositionActive, true);
  const out = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    resolvedFactors: resolved,
    explicitBriefFactors: explicit,
    workflowBriefConfig: ldBriefConfig,
    base: brief,
    upstreamLearningActivities: upstream
  });
  const laIdx = sectionIndex(out, "learning_activities");
  const acIdx = sectionIndex(out, "assessment_check");
  assert.ok(laIdx !== -1, "learning_activities section required");
  assert.ok(acIdx !== -1);
  assert.ok(laIdx < acIdx, "activities should precede assessment for cognition parity");
  const la = out.sections[laIdx];
  const row = Array.isArray(la.content) ? la.content[0] : null;
  assert.equal(row.reasoning_revision_prompt, "Revise after pair discussion.");
  assert.equal(row.initial_position_prompt, "State your prediction.");
  const trace = out.generation_notes.cognition_composition;
  assert.equal(trace.cognitionCompositionParity, true);
  assert.ok(trace.cognitionAssessmentDominancePrevented);
});

test("28-5d: misconception repair merges reconciliation fields from upstream", () => {
  const upstream = {
    activities: [
      {
        activity_id: "MR-1",
        title: "Misconception repair",
        misconception_claim: "CO2 cannot warm the planet.",
        reconciliation_prompt: "Use evidence to reconcile.",
        evidence_contrast: "Lab data vs claim."
      }
    ]
  };
  const page = {
    artifact_type: "page",
    title: "Climate repair",
    sections: [
      {
        section_id: "section_2",
        heading: "Workshop activities",
        content: [{ activity_id: "MR-1", title: "Misconception repair", learner_task: "Discuss." }]
      },
      {
        section_id: "assessment_check",
        heading: "Formative check",
        content: { items: [{ item_id: "TF-1", proposition: "Test", true_false_answer: "False" }] }
      }
    ]
  };
  const brief = {
    goal:
      "Confront the common misconception with evidence and reconcile student understanding before assessment."
  };
  const { resolved, explicit } = resolveBrief(api, ldBriefConfig, brief);
  const out = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    resolvedFactors: resolved,
    explicitBriefFactors: explicit,
    workflowBriefConfig: ldBriefConfig,
    base: brief,
    upstreamLearningActivities: upstream
  });
  const la = out.sections.find((s) => s.section_id === "learning_activities");
  assert.ok(la);
  const row = la.content[0];
  assert.equal(row.misconception_claim, "CO2 cannot warm the planet.");
  assert.equal(row.reconciliation_prompt, "Use evidence to reconcile.");
  assert.equal(row.evidence_contrast, "Lab data vs claim.");
  assert.ok(out.generation_notes.cognition_composition.cognitionFieldsMerged >= 3);
});

test("28-5d: transcript transformation preserves transformation activity fields", () => {
  const upstream = {
    activities: [
      {
        activity_id: "TT-1",
        title: "Apply transcript",
        transformation_activity: "Map claims to application tasks.",
        source_to_application_prompt: "How does the source apply here?"
      }
    ]
  };
  const page = {
    artifact_type: "page",
    title: "Transcript page",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Activities",
        content: [{ activity_id: "TT-1", title: "Apply transcript", learner_task: "Apply." }]
      }
    ]
  };
  const brief = {
    goal: "Transform the provided transcript into applied learning tasks.",
    startingArtefact: "provided_source_content",
    desiredOutputs: "learning activities"
  };
  const { resolved, explicit } = resolveBrief(api, ldBriefConfig, brief);
  const out = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    resolvedFactors: resolved,
    explicitBriefFactors: explicit,
    workflowBriefConfig: ldBriefConfig,
    base: brief,
    upstreamLearningActivities: upstream
  });
  const row = out.sections.find((s) => s.section_id === "learning_activities").content[0];
  assert.equal(row.transformation_activity, "Map claims to application tasks.");
  assert.equal(row.source_to_application_prompt, "How does the source apply here?");
});

test("28-5d: strips duplicate assessment rows from learning_activities", () => {
  const page = {
    artifact_type: "page",
    title: "Dedup",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Activities",
        content: [
          { activity_id: "A1", title: "Task" },
          { item_id: "DUP-1", stem: "Duplicate MCQ", correct_answer: "A" }
        ]
      },
      {
        section_id: "assessment_check",
        heading: "Check",
        content: { items: [{ item_id: "DUP-1", stem: "Duplicate MCQ", correct_answer: "A" }] }
      }
    ]
  };
  const brief = { goal: PEER_GOAL };
  const { resolved, explicit } = resolveBrief(api, ldBriefConfig, brief);
  const out = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    resolvedFactors: resolved,
    explicitBriefFactors: explicit,
    workflowBriefConfig: ldBriefConfig,
    base: brief,
    upstreamLearningActivities: { activities: [{ activity_id: "A1", title: "Task" }] }
  });
  const la = out.sections.find((s) => s.section_id === "learning_activities");
  assert.equal(la.content.length, 1);
  assert.equal(la.content[0].activity_id, "A1");
  assert.ok(out.generation_notes.cognition_composition.duplicateAssessmentRowsRemoved >= 1);
});

test("28-5d: assessment semantics unchanged when combined with cognition", () => {
  const page = {
    artifact_type: "page",
    title: "Combined",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Activities",
        content: [{ activity_id: "X1", title: "Discuss" }]
      },
      {
        section_id: "assessment_check",
        heading: "Check",
        content: {
          items: [
            {
              item_id: "ST-1",
              stem: "Balance equation",
              correct_answer: "A",
              explanation_or_rationale: "Discuss in pairs first."
            }
          ]
        }
      }
    ]
  };
  const brief = {
    goal: PEER_GOAL,
    inputs: "peer instruction formative check"
  };
  const { resolved, explicit } = resolveBrief(api, ldBriefConfig, brief);
  resolved.feedback_timing = "after_peer_discussion";
  resolved.assessment_required = true;
  delete resolved.learner_answer_visibility;
  let out = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    resolvedFactors: resolved,
    explicitBriefFactors: explicit,
    workflowBriefConfig: ldBriefConfig,
    base: brief,
    upstreamLearningActivities: {
      activities: [
        {
          activity_id: "X1",
          title: "Discuss",
          reasoning_revision_prompt: "Revise your reasoning."
        }
      ]
    }
  });
  out = api.applyAssessmentSemanticsToComposedPage(out, resolved);
  assert.equal(out.feedback_display, "reflection_then_answers");
  assert.equal(out.sections.find((s) => s.section_id === "learning_activities").content[0].reasoning_revision_prompt, "Revise your reasoning.");
  assert.ok(out.metadata.cognition_profile.active);
});

test("28-5d: utilities validation path applies cognition semantics", () => {
  const page = JSON.parse(
    JSON.stringify({
      artifact_type: "page",
      title: "Utilities path",
      sections: [
        {
          section_id: "assessment_check",
          heading: "Quiz",
          content: { items: [{ item_id: "Q1", stem: "Q?", correct_answer: "A" }] }
        }
      ]
    })
  );
  const brief = { goal: PEER_GOAL };
  const { resolved, explicit } = resolveBrief(api, ldBriefConfig, brief);
  const upstream = {
    activities: [
      {
        activity_id: "U1",
        title: "Peer task",
        revision_trigger: "After discussion"
      }
    ]
  };
  api.applyPageCompositionValidationForUtilitiesPage(page, {
    resolvedFactors: resolved,
    explicitBriefFactors: explicit,
    workflowBriefConfig: ldBriefConfig,
    base: brief,
    upstreamLearningActivities: upstream
  });
  assert.ok(page.sections.some((s) => s.section_id === "learning_activities"));
  assert.ok(page.metadata.cognition_profile.active);
});
