/**
 * Sprint 41 Slice 5 follow-up — preserve learner framing through Design Page composition.
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

const WORKSHOP_LEARNER_HANDOUT_BRIEF = {
  goal:
    "Using the uploaded lecture on climate change, create a misconception discussion workshop with task cards and small group discussion.",
  inputs: "Uploaded lecture transcript on climate change.",
  desiredOutputs: "Facilitator handout and learner handout",
  startingArtefact: "provided_source_content",
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

function workshopResolved() {
  const explicit = api.extractWorkflowBriefExplicitFactors(WORKSHOP_LEARNER_HANDOUT_BRIEF);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    WORKSHOP_LEARNER_HANDOUT_BRIEF.goal,
    WORKSHOP_LEARNER_HANDOUT_BRIEF.inputs
  );
  return api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    WORKSHOP_LEARNER_HANDOUT_BRIEF
  ).resolved;
}

function buildWorkshopUpstream() {
  return {
    activities: [
      {
        activity_id: "LO1",
        title: "Foundations",
        activity_preamble:
          "This activity builds your foundational understanding of climate mechanisms.",
        instructions: "Study the explanation and worked example.",
        reasoning_orientation: "Separate weather anecdotes from climate trend evidence."
      },
      {
        activity_id: "LO2",
        title: "Misconception cards",
        learner_task: "Discuss each card in your group."
      },
      {
        activity_id: "LO3",
        title: "Evidence sorting",
        learner_task: "Sort claims by evidence strength."
      },
      {
        activity_id: "LO4",
        title: "Synthesis",
        learner_task: "Draft a group response."
      },
      {
        activity_id: "LO5",
        title: "Reflection",
        learner_task: "Note one revised belief."
      }
    ]
  };
}

function buildTruncatedWorkshopPage() {
  return {
    artifact_type: "page",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            activity_id: "LO1",
            title: "Foundations",
            instructions: "Study the explanation and worked example."
          },
          {
            activity_id: "LO2",
            title: "Misconception cards",
            learner_task: "Discuss each card in your group."
          }
        ]
      }
    ],
    generation_notes: {
      activities_omitted: [
        {
          activity_id: "LO3",
          reason: "output size constraint",
          authority: "output_size"
        },
        {
          activity_id: "LO4",
          reason: "output size constraint",
          authority: "output_size"
        },
        {
          activity_id: "LO5",
          reason: "output size constraint",
          authority: "output_size"
        }
      ]
    }
  };
}

test("repairLearnerPageCompositionFromUpstream: workshop page preserves activity_preamble from DLA", () => {
  const page = buildTruncatedWorkshopPage();
  const upstream = buildWorkshopUpstream();
  const result = api.repairLearnerPageCompositionFromUpstream(page, upstream);
  assert.ok(result.framingFieldsMerged >= 1);
  const lo1 = page.sections[0].content.find((row) => row.activity_id === "LO1");
  assert.match(
    String(lo1.activity_preamble || ""),
    /foundational understanding of climate mechanisms/i
  );
});

test("repairLearnerPageCompositionFromUpstream: workshop page preserves cognition field reasoning_orientation", () => {
  const page = buildTruncatedWorkshopPage();
  const upstream = buildWorkshopUpstream();
  api.repairLearnerPageCompositionFromUpstream(page, upstream);
  const lo1 = page.sections[0].content.find((row) => row.activity_id === "LO1");
  assert.match(
    String(lo1.reasoning_orientation || ""),
    /weather anecdotes from climate trend evidence/i
  );
});

test("repairLearnerPageCompositionFromUpstream: restores all upstream activity IDs and strips output-size omissions", () => {
  const page = buildTruncatedWorkshopPage();
  const upstream = buildWorkshopUpstream();
  const result = api.repairLearnerPageCompositionFromUpstream(page, upstream);
  assert.equal(result.omissionsStripped, 3);
  assert.equal(result.activitiesRestored, 3);
  const ids = page.sections[0].content.map((row) => row.activity_id);
  assert.deepEqual(ids, ["LO1", "LO2", "LO3", "LO4", "LO5"]);
  assert.equal(
    (page.generation_notes.activities_omitted || []).length,
    0,
    "unauthorized output-size omissions removed"
  );
});

test("applyPedagogicCognitionSemanticsToComposedPage: facilitated learner handout preserves framing end-to-end", () => {
  const page = buildTruncatedWorkshopPage();
  const upstream = buildWorkshopUpstream();
  const resolved = workshopResolved();
  const explicit = api.extractWorkflowBriefExplicitFactors(WORKSHOP_LEARNER_HANDOUT_BRIEF);
  const out = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    upstreamLearningActivities: upstream,
    resolvedFactors: resolved,
    explicitBriefFactors: explicit,
    workflowBriefConfig: ldBriefConfig,
    base: WORKSHOP_LEARNER_HANDOUT_BRIEF,
    pageProfile: "learner"
  });
  const lo1 = out.sections[0].content.find((row) => row.activity_id === "LO1");
  assert.match(
    String(lo1.activity_preamble || ""),
    /foundational understanding of climate mechanisms/i
  );
  assert.match(
    String(lo1.reasoning_orientation || ""),
    /weather anecdotes from climate trend evidence/i
  );
  const laSection = out.sections.find((sec) => sec.section_id === "learning_activities");
  assert.ok(laSection, "learning_activities section present");
  const rows = Array.isArray(laSection.content)
    ? laSection.content
    : laSection.content && laSection.content.activities
      ? laSection.content.activities
      : [];
  const ids = rows.map((row) => row.activity_id);
  assert.equal(ids.length, 5);
  assert.ok(ids.includes("LO1"));
  assert.ok(ids.includes("LO3"));
  assert.ok(ids.includes("LO5"));
});

test("repairLearnerPageCompositionFromUpstream: facilitator page profile is not repaired", () => {
  const page = {
    page_profile: "facilitator",
    sections: [
      {
        section_id: "learning_activities",
        content: [{ activity_id: "LO1", facilitator_moves: ["Open with poll."] }]
      }
    ],
    generation_notes: {
      activities_omitted: [
        { activity_id: "LO2", reason: "output size constraint", authority: "output_size" }
      ]
    }
  };
  const upstream = buildWorkshopUpstream();
  const result = api.repairLearnerPageCompositionFromUpstream(page, upstream, {
    pageProfile: "facilitator"
  });
  assert.equal(result.repaired, false);
  assert.equal(page.sections[0].content.length, 1);
  assert.equal((page.generation_notes.activities_omitted || []).length, 1);
  assert.equal(page.sections[0].content[0].activity_preamble, undefined);
});

test("LEARNER_PAGE_ACTIVITY_FRAMING_PRESERVATION_FIELD_IDS includes support_note and expected_output", () => {
  const ids = api.LEARNER_PAGE_ACTIVITY_FRAMING_PRESERVATION_FIELD_IDS;
  assert.ok(ids.includes("activity_preamble"));
  assert.ok(ids.includes("support_note"));
  assert.ok(ids.includes("expected_output"));
});
