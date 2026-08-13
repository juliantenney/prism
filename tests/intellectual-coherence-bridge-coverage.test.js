/**
 * Intellectual coherence bridge — DLA contract, validation, repair, preserve, bind, render.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const scaffoldLib = require("../lib/ld-guided-learning-scaffold.js");
const pageDlaEnrich = require("../lib/page-dla-enrich.js");
const { applyS76CommissionShape } = require("./s76-dla-commission-shape.js");
const {
  buildPageModel,
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext");

const heteroPath = path.join(
  __dirname,
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

function loadPrismTestApi() {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function wordCount(text) {
  return String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function extractActivityHtml(html, activityId) {
  const source = String(html || "");
  const marker = 'id="activity-' + activityId + '"';
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) return "";
  const openTagStart = source.lastIndexOf("<article", markerIndex);
  if (openTagStart < 0) return "";
  const tagRe = /<(\/?)article\b[^>]*>/gi;
  tagRe.lastIndex = openTagStart;
  let depth = 0;
  let match;
  while ((match = tagRe.exec(source)) !== null) {
    if (match[1]) depth -= 1;
    else depth += 1;
    if (depth === 0) {
      return source.slice(openTagStart, tagRe.lastIndex);
    }
  }
  return "";
}

function orientPrompts(activity) {
  const orient = (activity.beats || []).find((beat) => beat.sourceFunction === "orientation");
  return orient && Array.isArray(orient.prompts) ? orient.prompts : [];
}

function countConnectYourLearning(html) {
  return (String(html || "").match(/Connect your learning/gi) || []).length;
}

const api = loadPrismTestApi();
const hetero = JSON.parse(fs.readFileSync(heteroPath, "utf8"));
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
}

const ldBriefConfig = api.normalizeWorkflowBriefConfig(
  extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"))
);

const MARX_SELF_STUDY_BRIEF = {
  goal:
    "Create a self-directed learning page on Karl Marx covering life phases, cause-effect links, comparison of major works, and application of core concepts.",
  inputs: "Undergraduate (self-directed study)",
  desiredOutputs: "Learner-facing page",
  selectedDomains: ["learning-design"]
};

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

function dlaRuntimePrompt() {
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  return api.applyWorkflowStepRuntimePromptAugmentations(
    "Design executable learning activities.\n",
    {
      canonical_step_id: "step_design_learning_activities",
      canonical_title: "Design Learning Activities",
      title: "Design Learning Activities"
    },
    buildWorkflowRecord(MARX_SELF_STUDY_BRIEF, resolved)
  );
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

function makeMinimalEnrichedPage(activities) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Owen bridge regression",
    audience: "learners",
    page_profile: "learner",
    assembly_state: { current_stage: "dla", enriched_by: ["episode_plan", "dla"] },
    page_synthesis: {},
    learning_outcomes: [{ id: "LO1", statement: "Interpret source evidence carefully." }],
    source_artefacts: [],
    generation_notes: {},
    activities: activities.map((row, index) =>
      applyS76CommissionShape(
        Object.assign(
          {
            activity_id: "A" + (index + 1),
            title: "Source evidence move " + (index + 1),
            learner_task: "Complete the task for activity " + (index + 1) + ".",
            expected_output: "A reasoned response with evidence for activity " + (index + 1) + ".",
            activity_preamble:
              "This activity develops focused reasoning about the page enquiry so you practise the move needed before later comparison and judgement work.",
            reasoning_orientation:
              "Name the claim you are testing, cite evidence from the materials, and explain what follows before you conclude.",
            required_materials: [
              {
                material_id: "A" + (index + 1) + "-M1",
                type: "text",
                purpose: "Orienting exposition",
                specification: "depth_floor: L3"
              }
            ],
            materials: [],
            episode_plan: { archetype: "understand", beats: [{ function: "orientation" }] }
          },
          row
        ),
        { fillEvidenceDecision: true }
      )
    )
  };
}

test("contract: DLA output contract requires intellectual_coherence_bridge on every activity including A1", () => {
  const prompt = dlaRuntimePrompt();
  const scaffold = scaffoldLib.buildLdGuidedLearningScaffoldPromptBlock({
    includeDlaPreEmit: true
  });
  const enrichContract = require("../lib/ld-dla-page-enrich-contract.js").buildDlaPageEnrichContractBlock();
  assert.match(prompt, /mandatory on every activity including A1/i);
  assert.doesNotMatch(prompt, /Omit on the first activity/i);
  assert.match(prompt, /activity-row learner copy|Activity-row learner copy/i);
  assert.match(prompt, /"activity_id": "A2"/);
  assert.match(prompt, /"intellectual_coherence_bridge":/);
  assert.match(scaffold, /mandatory every activity including A1/i);
  assert.match(enrichContract, /intellectual_coherence_bridge REQUIRED on every activity including A1/i);
  assert.match(
    fs.readFileSync(ldPatternsPath, "utf8"),
    /bridge mandatory on every activity including A1/i
  );
});

test("contract: A1 requires an intellectual_coherence_bridge", () => {
  const coverage = api.evaluateLearnerPageDlaActivityFramingCoverage([
    {
      activity_id: "A1",
      activity_preamble:
        "This opening activity establishes why residual variance matters before you interpret plots or judge remedies in later work.",
      reasoning_orientation:
        "Focus on whether prediction error stays stable or changes across observations before you move to visual evidence."
    },
    {
      activity_id: "A2",
      activity_preamble:
        "This activity teaches you to read residual-plot patterns as evidence of changing variance rather than isolated outliers.",
      reasoning_orientation:
        "Compare residual-cloud width across fitted values and decide whether the pattern supports heteroscedasticity.",
      intellectual_coherence_bridge:
        "You defined residual variance. This activity carries that distinction into residual-plot reading."
    }
  ]);
  const a1Failure = (coverage.activityFailures || []).find(
    (row) => String(row.activity_id) === "A1"
  );
  assert.ok(a1Failure);
  assert.ok((a1Failure.missing || []).includes("intellectual_coherence_bridge"));

  const pel = api.evaluatePelOrientationContractSatisfaction({
    activities: [
      {
        activity_id: "A1",
        activity_preamble: "Orient to residual variance before plots.",
        study_orientation: "Definition precedes interpretation and evaluation."
      },
      {
        activity_id: "A2",
        activity_preamble: "Interpret residual plots carefully.",
        intellectual_coherence_bridge:
          "You defined residual variance. This activity carries that distinction into residual-plot reading."
      }
    ]
  });
  assert.equal(pel.satisfied, false);
  assert.ok(pel.missingFields.includes("intellectual_coherence_bridge"));
  assert.ok((pel.missingBridgeActivityIds || []).includes("A1"));
});

test("validation: Owen-style bridges only on A4/A5 fail framing and hard DLA validation", () => {
  const activities = (hetero.activities || []).map((row, index) => {
    const next = clone(row);
    if (index < 3) delete next.intellectual_coherence_bridge;
    return next;
  });
  const coverage = api.evaluateLearnerPageDlaActivityFramingCoverage(activities);
  assert.equal(coverage.meetsMandatoryFraming, false);
  const failedIds = (coverage.activityFailures || [])
    .map((row) => String(row.activity_id))
    .join("|");
  assert.equal(failedIds, "A1|A2|A3");
  coverage.activityFailures.forEach((failure) => {
    assert.ok(failure.missing.includes("intellectual_coherence_bridge"));
  });

  const page = makeMinimalEnrichedPage(
    activities.map((row) => ({
      activity_id: row.activity_id,
      activity_preamble: row.activity_preamble,
      intellectual_coherence_bridge: row.intellectual_coherence_bridge,
      learner_task: row.learner_task,
      expected_output: row.expected_output,
      reasoning_orientation: row.reasoning_orientation,
      episode_plan: row.episode_plan,
      required_materials: row.required_materials || [],
      materials: []
    }))
  );
  const hard = pageDlaEnrich.validateDlaEnrichedPage(page);
  assert.equal(hard.ok, false);
  assert.ok(
    (hard.errors || []).some((err) => /intellectual_coherence_bridge/.test(err)),
    "hard validation must reject missing bridges"
  );
});

test("hard validation: missing A1 or A2+ bridge fails; preamble cannot substitute", () => {
  const base = makeMinimalEnrichedPage([
    {
      activity_id: "A1",
      intellectual_coherence_bridge:
        "The overview introduced residual variance. This first activity begins by using that foundation to define constant versus changing error spread."
    },
    {
      activity_id: "A2",
      intellectual_coherence_bridge:
        "You defined residual variance. This activity develops that capability by reading residual-plot patterns."
    }
  ]);
  assert.equal(pageDlaEnrich.validateDlaEnrichedPage(base).ok, true);

  const missingA1 = clone(base);
  delete missingA1.activities[0].intellectual_coherence_bridge;
  assert.equal(pageDlaEnrich.validateDlaEnrichedPage(missingA1).ok, false);

  const missingA2 = clone(base);
  delete missingA2.activities[1].intellectual_coherence_bridge;
  assert.equal(pageDlaEnrich.validateDlaEnrichedPage(missingA2).ok, false);

  const missingPreamble = clone(base);
  delete missingPreamble.activities[0].activity_preamble;
  assert.equal(pageDlaEnrich.validateDlaEnrichedPage(missingPreamble).ok, false);

  const dup = clone(base);
  dup.activities[1].intellectual_coherence_bridge = dup.activities[1].activity_preamble;
  const dupCheck = pageDlaEnrich.validateDlaEnrichedPage(dup);
  assert.equal(dupCheck.ok, false);
  assert.ok((dupCheck.errors || []).some((err) => /distinct from activity_preamble/.test(err)));

  const placeholder = clone(base);
  placeholder.activities[0].intellectual_coherence_bridge = "—";
  assert.equal(pageDlaEnrich.validateDlaEnrichedPage(placeholder).ok, false);
});

test("repair: Owen full-page missing A1–A3 bridges are restored; A4/A5 preserved", () => {
  const capture = {
    artifact_type: "page",
    schema_version: "2.0.0",
    activities: (hetero.activities || []).map((row, index) => {
      const next = clone(row);
      if (index < 3) delete next.intellectual_coherence_bridge;
      return next;
    })
  };
  const a4Before = String(capture.activities[3].intellectual_coherence_bridge || "");
  const a5Before = String(capture.activities[4].intellectual_coherence_bridge || "");
  const repaired = scaffoldLib.repairGuidedLearningScaffoldOnDlaCapture(capture, {
    learningSequence: hetero.learning_sequence || {},
    workflowGoal: String(hetero.title || "Heteroscedasticity learning page"),
    page: capture
  });
  const rows = repaired.parsed.activities;
  assert.ok(String(rows[0].intellectual_coherence_bridge || "").trim());
  assert.match(rows[0].intellectual_coherence_bridge, /overview|foundation|first activity/i);
  assert.doesNotMatch(
    rows[0].intellectual_coherence_bridge,
    /\bprevious activity\b|\bprior activity\b/i
  );
  ["A2", "A3"].forEach((activityId, offset) => {
    const row = rows[offset + 1];
    assert.equal(row.activity_id, activityId);
    assert.ok(String(row.intellectual_coherence_bridge || "").trim(), activityId + " restored");
    assert.equal(scaffoldLib.bridgeLooksSchedulingOnly(row.intellectual_coherence_bridge), false);
    assert.notEqual(
      String(row.intellectual_coherence_bridge || "").trim(),
      String(row.activity_preamble || "").trim()
    );
  });
  assert.equal(String(rows[3].intellectual_coherence_bridge || ""), a4Before);
  assert.equal(String(rows[4].intellectual_coherence_bridge || ""), a5Before);

  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Owen bridge regression",
    audience: "learners",
    page_profile: "learner",
    assembly_state: { current_stage: "dla", enriched_by: ["episode_plan", "dla"] },
    page_synthesis: {},
    learning_outcomes: [{ id: "LO1", statement: "Interpret source evidence carefully." }],
    source_artefacts: [],
    generation_notes: {},
    activities: rows.map((row, index) =>
      applyS76CommissionShape(
        {
          activity_id: row.activity_id,
          title: "Source evidence move " + (index + 1),
          learner_task: "Complete the evidential task for this activity.",
          expected_output: "A reasoned response with evidence and quality criteria a peer could assess.",
          activity_preamble:
            "This activity develops focused reasoning about the page enquiry so you practise the move needed before later comparison and judgement work.",
          intellectual_coherence_bridge: row.intellectual_coherence_bridge,
          reasoning_orientation:
            "Name the claim you are testing, cite evidence from the materials, and explain what follows before you conclude.",
          evidence_decision: { required: false, reason: "Conceptual orientation step.", provider_material_ids: [] },
          required_materials: [
            {
              material_id: String(row.activity_id || "A") + "-M1",
              type: "text",
              purpose: "Orienting exposition",
              specification: "depth_floor: L3"
            }
          ],
          materials: [],
          episode_plan: { archetype: "understand", beats: [{ function: "orientation" }] }
        },
        { fillEvidenceDecision: true }
      )
    )
  };
  assert.equal(pageDlaEnrich.validateDlaEnrichedPage(page).ok, true);
});

test("repair: A1 semantics connect orientation to first activity", () => {
  const activities = [
    {
      activity_id: "A1",
      title: "Define residual variance",
      activity_preamble:
        "This opening activity establishes why residual variance matters before you interpret plots in later work across the page.",
      expected_output:
        "A short explanation distinguishing constant from changing residual spread with enough depth that a peer could assess quality.",
      reasoning_orientation:
        "Focus on whether prediction error stays stable or changes across observations before you move to visual evidence from residual plots.",
      learner_task: "Explain homoscedasticity versus heteroscedasticity.",
      intellectual_frame: "Residual variance is the entry point for later plot reading and remedy judgement."
    }
  ];
  const result = scaffoldLib.repairGuidedLearningScaffoldOnActivities(activities, {
    workflowGoal: "Learn to detect and remedy heteroscedasticity"
  });
  const bridge = String(result.activities[0].intellectual_coherence_bridge || "");
  assert.ok(wordCount(bridge) >= scaffoldLib.FIELD_WORD_RANGES.intellectual_coherence_bridge.min);
  assert.match(bridge, /overview|foundation|first activity/i);
  assert.doesNotMatch(bridge, /\bprevious activity\b|\bprior activity\b|Activity 0\b/i);
  assert.notEqual(bridge.trim(), String(activities[0].activity_preamble || "").trim());
});

test("repair: A2+ carries prior learning; scheduling-only and preamble-duplicate repaired", () => {
  const activities = [
    {
      activity_id: "A1",
      title: "Foundations",
      activity_preamble:
        "This activity introduces foundational distinctions you will reuse when comparing strategies in later work throughout the session.",
      expected_output:
        "A classification set with justified reasoning that meets the task scope and quality criteria described in the materials.",
      reasoning_orientation:
        "Name the criteria you are using, cite evidence for each example, and explain what follows for the overall judgement.",
      learner_task: "Study the explanation and classify three examples.",
      intellectual_coherence_bridge:
        "The overview introduced foundational distinctions. This first activity begins by using that foundation to classify examples."
    },
    {
      activity_id: "A2",
      title: "Compare",
      activity_preamble:
        "This activity extends the foundational ideas through applied comparison tasks using the same reasoning standards as the prior step.",
      expected_output:
        "A completed comparison with justified reasoning that a peer could assess using the task criteria and materials.",
      reasoning_orientation:
        "Use consistent criteria, cite evidence, and explain implications before you reach your judgement about each option.",
      learner_task: "Complete the comparison.",
      intellectual_coherence_bridge: "Then do the next activity."
    },
    {
      activity_id: "A3",
      title: "Duplicate",
      activity_preamble:
        "This activity asks you to evaluate trade-offs using criteria established earlier and evidence from the comparison materials.",
      expected_output:
        "A reasoned judgement with criteria, evidence, and trade-offs that a peer could assess against the checklist.",
      reasoning_orientation:
        "Name criteria, cite evidence, weigh trade-offs, and explain why your judgement follows from the materials.",
      learner_task: "Write the judgement.",
      intellectual_coherence_bridge:
        "This activity asks you to evaluate trade-offs using criteria established earlier and evidence from the comparison materials."
    }
  ];
  const result = scaffoldLib.repairGuidedLearningScaffoldOnActivities(activities, {});
  assert.equal(scaffoldLib.bridgeLooksSchedulingOnly(result.activities[1].intellectual_coherence_bridge), false);
  assert.ok(String(result.activities[1].intellectual_coherence_bridge || "").trim());
  assert.notEqual(
    String(result.activities[2].intellectual_coherence_bridge || "").trim(),
    String(result.activities[2].activity_preamble || "").trim()
  );
});

test("concision: good bridge below 30 words is preserved", () => {
  const concise =
    "You defined residual variance. This activity develops that capability by reading residual-plot patterns.";
  assert.ok(wordCount(concise) < 30);
  assert.ok(wordCount(concise) >= scaffoldLib.FIELD_WORD_RANGES.intellectual_coherence_bridge.min);
  const row = {
    activity_id: "A2",
    title: "Interpret residual plots",
    activity_preamble:
      "Learn to read residual-plot patterns as evidence of changing variance rather than isolated outliers across fitted values.",
    expected_output:
      "A completed table with pattern, variance behaviour, and judgement that a peer could assess against checklist criteria.",
    reasoning_orientation:
      "Compare residual-cloud width across fitted values before you decide whether the pattern supports heteroscedasticity.",
    learner_task: "Complete the residual-plot analysis table.",
    intellectual_coherence_bridge: concise
  };
  const prior = {
    activity_id: "A1",
    activity_preamble:
      "Build a mental model of residual variance before you interpret residual plots in the next activity on this page.",
    learner_task: "Explain homoscedasticity versus heteroscedasticity.",
    expected_output:
      "A short explanation distinguishing constant from changing residual spread with enough depth for peer assessment.",
    reasoning_orientation:
      "Focus on whether prediction error stays stable or changes across observations before moving to visual evidence.",
    intellectual_coherence_bridge:
      "The overview introduced residual variance as the entry point. This first activity begins by using that foundation to define constant versus changing error spread."
  };
  const out = scaffoldLib.expandIntellectualCoherenceBridge(
    row,
    prior,
    scaffoldLib.buildRepairContext([prior, row], {})
  );
  assert.equal(out, concise);
  assert.equal(scaffoldLib.bridgeFailsSoftQuality(concise, row, 1), false);
});

test("capture-path parity: full vNext page and partial captures both repair missing bridges", () => {
  const sharedRows = [
    {
      activity_id: "A1",
      title: "Orient",
      activity_preamble:
        "This opening activity establishes the core distinction you will reuse when comparing and judging later on this page.",
      expected_output:
        "A short explanation of the core distinction with enough depth that a peer could assess quality against the checklist.",
      reasoning_orientation:
        "Name the distinction, cite one supporting idea from the materials, and explain what follows before you conclude.",
      learner_task: "Define the core distinction."
    },
    {
      activity_id: "A2",
      title: "Apply",
      activity_preamble:
        "This activity develops the core distinction through applied comparison using evidence from the supplied materials.",
      expected_output:
        "A completed comparison with justified reasoning that a peer could assess using the task criteria and materials.",
      reasoning_orientation:
        "Use consistent criteria, cite evidence, and explain implications before you reach your judgement about each option.",
      learner_task: "Complete the comparison table."
    }
  ];
  const fullPage = {
    artifact_type: "page",
    schema_version: "2.0.0",
    activities: clone(sharedRows)
  };
  const partial = {
    artifact_type: "learning_activities",
    activities: clone(sharedRows)
  };
  const fullRepaired = scaffoldLib.repairGuidedLearningScaffoldOnDlaCapture(fullPage, {
    workflowGoal: "Source evidence enquiry page"
  });
  const partialRepaired = scaffoldLib.repairGuidedLearningScaffoldOnDlaCapture(partial, {
    workflowGoal: "Source evidence enquiry page"
  });
  [fullRepaired, partialRepaired].forEach((result) => {
    assert.ok(String(result.parsed.activities[0].intellectual_coherence_bridge || "").trim());
    assert.ok(String(result.parsed.activities[1].intellectual_coherence_bridge || "").trim());
  });
});

test("preservation: Design Page compose does not drop or alter authored bridges", () => {
  const bridgeText =
    "You distinguished residual variance and now carry that distinction into residual-plot reading.";
  const upstream = {
    artifact_type: "learning_activities",
    content: {
      activities: [
        {
          activity_id: "A1",
          title: "Define residual variance",
          activity_preamble:
            "Build a mental model of residual variance before you interpret residual plots in the next activity.",
          learner_task: "Explain homoscedasticity versus heteroscedasticity.",
          expected_output: "A short explanation distinguishing constant from changing residual spread.",
          reasoning_orientation:
            "Focus on whether prediction error stays stable or changes across observations.",
          intellectual_coherence_bridge:
            "The overview introduced residual variance. This first activity begins by using that foundation to define constant versus changing error spread."
        },
        {
          activity_id: "A2",
          title: "Interpret residual plots",
          activity_preamble:
            "Learn to read residual-plot patterns as evidence of changing variance rather than isolated outliers.",
          learner_task: "Complete the residual-plot analysis table.",
          expected_output: "A completed table with pattern, variance behaviour, and judgement.",
          reasoning_orientation:
            "Compare residual-cloud width across fitted values before you decide.",
          intellectual_coherence_bridge: bridgeText
        }
      ]
    }
  };
  const page = {
    artifact_type: "page",
    page_profile: "learner",
    episode_plans: [
      {
        activity_id: "A1",
        episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] }
      },
      {
        activity_id: "A2",
        episode_plan: {
          archetype: "analyse",
          beats: [{ function: "orientation" }, { function: "guided_practice" }]
        }
      }
    ],
    sections: [
      {
        section_id: "learning_activities",
        content: [
          { activity_id: "A1", title: "Define residual variance", learner_task: "Read." },
          { activity_id: "A2", title: "Interpret residual plots", learner_task: "Analyse." }
        ]
      }
    ]
  };
  const out = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    upstreamLearningActivities: upstream,
    pageProfile: "learner"
  });
  const a2 = out.sections[0].content.find((row) => row.activity_id === "A2");
  assert.ok(a2);
  assert.equal(String(a2.intellectual_coherence_bridge || ""), bridgeText);
});

test("downstream: renderer emits one Connect your learning and one preamble per activity when bridges exist", () => {
  const page = clone(hetero);
  page.activities.forEach((row, index) => {
    if (!String(row.intellectual_coherence_bridge || "").trim()) {
      row.intellectual_coherence_bridge =
        index === 0
          ? "The overview introduced residual variance. This first activity begins by using that foundation to define constant versus changing error spread."
          : "You carried forward the prior reasoning move. This activity develops that capability with the next evidential demand.";
    }
  });
  const html = renderLearnerPageHtml(page, { compositionMode: "moments" }).html;
  assert.equal(countConnectYourLearning(html), page.activities.length);
  page.activities.forEach((row) => {
    const activityHtml = extractActivityHtml(html, row.activity_id);
    assert.match(activityHtml, /Connect your learning/i);
    assert.match(activityHtml, /intellectual_coherence_bridge/i);
    assert.match(activityHtml, /util-composition-preamble|activity_preamble|composition-preamble/i);
  });
});

test("binding: bridge reaches Orient prompt fields for every activity when present", () => {
  const page = clone(hetero);
  page.activities[0].intellectual_coherence_bridge =
    "The overview introduced residual variance. This first activity begins by using that foundation to define constant versus changing error spread.";
  const result = buildPageModel(page);
  assert.equal(result.ok, true);
  page.activities.forEach((row) => {
    const activity = result.model.activities.find((item) => item.id === row.activity_id);
    assert.ok(activity, row.activity_id);
    const bridgePrompt = orientPrompts(activity).find(
      (prompt) => prompt.sourceField === "intellectual_coherence_bridge"
    );
    assert.ok(bridgePrompt, row.activity_id + " Orient bridge prompt");
    assert.match(String(bridgePrompt.text || ""), /\S/);
  });
});

test("no invention: absent bridge field produces no title-derived bridge in the renderer", () => {
  const page = clone(hetero);
  const a2 = page.activities.find((row) => row.activity_id === "A2");
  delete a2.intellectual_coherence_bridge;
  const result = buildPageModel(page);
  assert.equal(result.ok, true);
  const activity = result.model.activities.find((row) => row.id === "A2");
  const bridgePrompt = orientPrompts(activity).find(
    (prompt) => prompt.sourceField === "intellectual_coherence_bridge"
  );
  assert.equal(bridgePrompt, undefined);
  const html = extractActivityHtml(
    renderLearnerPageHtml(page, { compositionMode: "moments" }).html,
    "A2"
  );
  assert.doesNotMatch(html, /Connect your learning/i);
  assert.doesNotMatch(html, /data-source-field="intellectual_coherence_bridge"/i);
});

test("semantic distinction: bridge text is not identical to preamble, reasoning orientation, or progression logic", () => {
  const rows = hetero.activities || [];
  const progression = String(
    (hetero.learning_sequence &&
      hetero.learning_sequence.navigation_guidance &&
      hetero.learning_sequence.navigation_guidance.progression_logic) ||
      ""
  ).trim();
  rows.slice(1).forEach((row) => {
    const bridge = String(row.intellectual_coherence_bridge || "").trim();
    assert.ok(bridge);
    assert.notEqual(bridge, String(row.activity_preamble || "").trim());
    assert.notEqual(bridge, String(row.reasoning_orientation || "").trim());
    assert.notEqual(bridge, progression);
  });
});

test("GAM ownership: page-gam-enrich lists preamble and bridge as DLA-owned preserved fields", () => {
  const gam = require("../lib/page-gam-enrich.js");
  const owned = gam.GAM_DLA_OWNED_STRING_FIELDS || [];
  assert.ok(owned.includes("activity_preamble"));
  assert.ok(owned.includes("intellectual_coherence_bridge"));
});
