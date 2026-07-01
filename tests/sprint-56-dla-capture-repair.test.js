/**
 * Sprint 56 — DLA capture-side scaffold repair enhancements.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const lib = require("../lib/ld-guided-learning-scaffold.js");

const fixtureDir = path.join(__dirname, "fixtures", "dla");
const cognitionBestPath = path.join(fixtureDir, "rna-hcv-dla-08-cognition-best-run.json");
const stabRun1Path = path.join(fixtureDir, "rna-hcv-dla-08-stab-run-1.json");
const tersePath = path.join(fixtureDir, "rna-hcv-terse-scaffold-dla.json");

const COGNITION_FIELDS = [
  "reasoning_orientation",
  "self_explanation_prompt",
  "conceptual_contrast_prompt",
  "argument_structure_hint",
  "transfer_or_application_task"
];

function cloneJson(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function mandatoryPassPct(activities) {
  let pass = 0;
  activities.forEach((row, index, arr) => {
    const pre = lib.wordCount(row.activity_preamble) >= lib.FIELD_WORD_RANGES.activity_preamble.min;
    const exp = lib.wordCount(row.expected_output) >= lib.FIELD_WORD_RANGES.expected_output.min;
    const cog = COGNITION_FIELDS.some(
      (f) => row[f] && lib.wordCount(row[f]) >= lib.FIELD_WORD_RANGES[f].min
    );
    const br =
      index === 0 ||
      arr.length <= 1 ||
      lib.wordCount(row.intellectual_coherence_bridge) >=
        lib.FIELD_WORD_RANGES.intellectual_coherence_bridge.min;
    if (pre && exp && cog && br) pass += 1;
  });
  return activities.length ? Math.round((pass / activities.length) * 100) : 0;
}

test("capture repair: missing bridge synthesized on A2+", () => {
  const row = {
    activity_id: "A2",
    title: "Applying core ideas",
    learner_task: "Complete the comparison table for two strategies.",
    activity_preamble:
      "This activity builds on prior work by asking you to compare two strategies using consistent criteria and evidence from the materials provided in the session.",
    expected_output:
      "A completed comparison table with justified ratings and clear reasoning for each row.",
    reasoning_orientation:
      "Name the criteria you are using, cite evidence for each strategy, and explain what follows for the overall judgement before you conclude.",
    required_materials: [
      { material_id: "M1", type: "text", purpose: "comparison briefing", specification: "L3 depth" }
    ]
  };
  const prior = {
    activity_id: "A1",
    title: "Foundations",
    activity_preamble:
      "This activity introduces foundational distinctions you will reuse when comparing strategies in later work throughout the session.",
    learner_task: "Study the explanation and classify three examples."
  };
  const bridge = lib.expandIntellectualCoherenceBridge(row, prior, lib.buildRepairContext([row], {}));
  assert.ok(lib.wordCount(bridge) >= lib.FIELD_WORD_RANGES.intellectual_coherence_bridge.min);
  assert.equal(lib.bridgeLooksSchedulingOnly(bridge), false);
  assert.match(bridge, /comparison table|strategies|criteria/i);
});

test("capture repair: sub-floor bridge expanded in place", () => {
  const row = {
    activity_id: "A3",
    title: "Analysis phase",
    learner_task: "Analyse the mechanism in the case study.",
    intellectual_coherence_bridge: "This activity extends your prior work."
  };
  const prior = {
    activity_id: "A2",
    title: "Compare",
    activity_preamble:
      "You compared strategies using criteria and evidence; that reasoning move prepares you for deeper mechanism analysis.",
    learner_task: "Complete the comparison table."
  };
  const bridge = lib.expandIntellectualCoherenceBridge(row, prior, lib.buildRepairContext([row], {}));
  assert.ok(lib.wordCount(bridge) >= 30);
  assert.match(bridge, /extends your prior work/i);
});

test("capture repair: borderline cognition expanded via repair", () => {
  const row = {
    activity_id: "B1",
    title: "Classification task",
    learner_task: "Classify three examples and justify each choice.",
    activity_preamble:
      "This activity develops classification skills you will reuse when comparing examples using evidence from the materials throughout the session and beyond.",
    expected_output:
      "A classification set with justified reasoning that meets the task scope and quality criteria described in the materials.",
    self_explanation_prompt:
      "After reviewing each explanation, explain in your own words why the concept works as described in the materials."
  };
  assert.ok(lib.wordCount(row.self_explanation_prompt) < lib.FIELD_WORD_RANGES.self_explanation_prompt.min);
  const result = lib.repairGuidedLearningScaffoldOnActivities([row], {});
  const expanded = result.activities[0].self_explanation_prompt;
  assert.ok(lib.wordCount(expanded) >= lib.FIELD_WORD_RANGES.self_explanation_prompt.min);
  assert.match(expanded, /explain in your own words/i);
});

test("capture repair: expected_output label converted preserving deliverable detail", () => {
  const row = {
    title: "Table completion",
    learner_task: "Complete the analysis table for each mechanism.",
    expected_output: "Completed analysis table with mechanism and outcome columns."
  };
  const before = row.expected_output;
  const expanded = lib.expandExpectedOutput(row, {});
  assert.ok(lib.wordCount(expanded) >= lib.FIELD_WORD_RANGES.expected_output.min);
  assert.match(expanded, /analysis table/i);
  assert.notEqual(expanded, before);
  assert.doesNotMatch(expanded, /^Completed analysis table\.$/);
});

test("capture repair: no-op when already compliant", () => {
  const rich = {
    activities: [
      {
        activity_id: "A1",
        title: "Rich activity",
        activity_preamble:
          "This activity introduces a distinction you will reuse throughout the session. As you work, explain why each step matters for understanding the mechanism rather than memorising labels alone. The materials guide you from orientation through guided practice to independent verification with enough depth that a peer could follow your reasoning.",
        expected_output:
          "Your response should meet the task scope with clear reasoning, accurate terminology, and enough detail that a peer could assess quality against the checklist criteria and explain why each claim matters for the overall argument.",
        reasoning_orientation:
          "Name what evidence you are using, how it supports your claim, and one mistake to avoid when mechanism is described without functional consequence or explanatory depth in your written response to the task materials provided.",
        learner_task: "Study and classify three examples."
      }
    ]
  };
  const snapshot = JSON.stringify(rich);
  const result = lib.repairGuidedLearningScaffoldOnDlaCapture(cloneJson(rich), {});
  assert.equal(result.repairApplied, false);
  assert.equal(result.evidence.meetsGuidedLearningScaffoldQuality, true);
  assert.equal(JSON.stringify(result.parsed), snapshot);
});

test("capture repair: required_materials not mutated", () => {
  const fixture = cloneJson(JSON.parse(fs.readFileSync(tersePath, "utf8")));
  const beforeMats = fixture.activities.map((a) => JSON.stringify(a.required_materials));
  lib.repairGuidedLearningScaffoldOnDlaCapture(fixture, {});
  fixture.activities.forEach((row, i) => {
    assert.equal(JSON.stringify(row.required_materials), beforeMats[i]);
  });
});

test("capture repair: no schema change except mandatory scaffold keys", () => {
  const fixture = cloneJson(JSON.parse(fs.readFileSync(tersePath, "utf8")));
  const keysBefore = fixture.activities.map((a) => new Set(Object.keys(a)));
  lib.repairGuidedLearningScaffoldOnDlaCapture(fixture, {});
  const allowedNew = new Set([
    "intellectual_coherence_bridge",
    "reasoning_orientation",
    "self_explanation_prompt",
    "conceptual_contrast_prompt",
    "argument_structure_hint",
    "transfer_or_application_task"
  ]);
  fixture.activities.forEach((row, i) => {
    const before = keysBefore[i];
    const after = new Set(Object.keys(row));
    after.forEach((key) => {
      if (!before.has(key)) assert.ok(allowedNew.has(key), "unexpected key: " + key);
    });
  });
});

test("capture repair: generic non-RNA brief uses learner_task topic", () => {
  const parsed = {
    activities: [
      {
        activity_id: "G1",
        title: "Urban planning trade-offs",
        learner_task: "Compare two zoning proposals using equity and transport criteria.",
        activity_preamble: "Short preamble about zoning.",
        expected_output: "Completed decision matrix.",
        reasoning_orientation: "Use criteria consistently."
      }
    ]
  };
  const result = lib.repairGuidedLearningScaffoldOnDlaCapture(parsed, {
    workflowGoal: "Self-directed urban planning module for community stakeholders."
  });
  const preamble = result.parsed.activities[0].activity_preamble;
  assert.match(preamble, /zoning|urban planning|trade-offs/i);
  assert.ok(!/RNA|virus|HCV|genome/i.test(preamble));
});

test("capture repair: DLA-08 fixtures reach post-repair compliance", () => {
  const repairOptions = {
    workflowGoal: "RNA virus learning page",
    learningOutcomes: {
      learning_outcomes: [
        { id: "LO1", statement: "Explain RNA genome organisation." },
        { id: "LO2", statement: "Analyse replication mechanisms." }
      ]
    }
  };
  [cognitionBestPath, stabRun1Path].forEach((fixturePath) => {
    const parsed = cloneJson(JSON.parse(fs.readFileSync(fixturePath, "utf8")));
    const before = mandatoryPassPct(parsed.activities);
    const result = lib.repairGuidedLearningScaffoldOnDlaCapture(parsed, repairOptions);
    const after = mandatoryPassPct(result.parsed.activities);
    assert.ok(after >= 80, path.basename(fixturePath) + " post-repair mandatory pass " + after + "%");
    assert.ok(after >= before);
    assert.equal(result.evidence.meetsGuidedLearningScaffoldQuality, true);
  });
});

test("capture repair: scheduling-only bridge replaced", () => {
  const activities = [
    {
      activity_id: "A1",
      title: "First",
      activity_preamble:
        "This activity introduces foundational ideas you will apply in later steps throughout the session using guided and independent practice.",
      expected_output:
        "Responses demonstrating accurate understanding with reasoning a peer could follow and assess against the checklist.",
      reasoning_orientation:
        "Explain why each claim matters, cite evidence from the materials, and avoid listing features without functional consequence.",
      learner_task: "Study the explanation."
    },
    {
      activity_id: "A2",
      title: "Second",
      activity_preamble:
        "This activity extends the foundational ideas through applied comparison tasks using the same reasoning standards as the prior step.",
      expected_output:
        "A completed comparison with justified reasoning that a peer could assess using the task criteria and materials.",
      reasoning_orientation:
        "Use consistent criteria, cite evidence, and explain implications before you reach your judgement about each option.",
      learner_task: "Complete the comparison.",
      intellectual_coherence_bridge: "Then do the next activity."
    }
  ];
  const result = lib.repairGuidedLearningScaffoldOnActivities(activities, {});
  const a2 = result.activities[1];
  assert.equal(lib.bridgeLooksSchedulingOnly(a2.intellectual_coherence_bridge), false);
  assert.ok(
    lib.wordCount(a2.intellectual_coherence_bridge) >=
      lib.FIELD_WORD_RANGES.intellectual_coherence_bridge.min
  );
});
