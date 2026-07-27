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

test("contract: DLA output contract requires intellectual_coherence_bridge on every A2+ activity", () => {
  const prompt = dlaRuntimePrompt();
  const scaffold = scaffoldLib.buildLdGuidedLearningScaffoldPromptBlock();
  assert.match(prompt, /mandatory on every activity after the first \(A2\+\)/i);
  assert.match(prompt, /Omit on the first activity/i);
  assert.match(prompt, /activity-row learner copy, not a page-level field/i);
  assert.match(prompt, /"activity_id": "A2"/);
  assert.match(prompt, /"intellectual_coherence_bridge":/);
  assert.match(scaffold, /intellectual_coherence_bridge \(30–60 words per activity after the first\)/i);
  assert.doesNotMatch(
    prompt,
    /Page-level additive fields[^\n]*intellectual_coherence_bridge/i
  );
});

test("contract: A1 does not require an intellectual_coherence_bridge", () => {
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
        "You defined residual variance and distinguished constant from changing error spread. This activity carries that distinction into residual-plot reading: judge whether the residual cloud stays even or fans out across fitted values using the same spread criterion."
    }
  ]);
  const a1Failure = (coverage.activityFailures || []).find(
    (row) => String(row.activity_id) === "A1"
  );
  assert.equal(a1Failure, undefined);
  assert.ok(
    !(coverage.activityFailures || []).some((row) =>
      (row.missing || []).includes("intellectual_coherence_bridge") &&
      String(row.activity_id) === "A1"
    )
  );

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
          "You defined residual variance and distinguished constant from changing error spread. This activity carries that distinction into residual-plot reading with the same spread criterion rather than isolated unusual points alone."
      }
    ]
  });
  assert.equal(pel.satisfied, true);
  assert.equal(Array.from(pel.missingBridgeActivityIds || []).join("|"), "");
});

test("validation: a single bridge on A5 no longer satisfies a five-activity lesson", () => {
  const activities = (hetero.activities || []).map((row, index) => {
    const next = clone(row);
    if (index > 0 && index < 4) delete next.intellectual_coherence_bridge;
    return next;
  });
  const coverage = api.evaluateLearnerPageDlaActivityFramingCoverage(activities);
  assert.equal(coverage.meetsMandatoryFraming, false);
  const failedIds = (coverage.activityFailures || [])
    .map((row) => String(row.activity_id))
    .join("|");
  assert.equal(failedIds, "A2|A3|A4");
  coverage.activityFailures.forEach((failure) => {
    assert.ok(failure.missing.includes("intellectual_coherence_bridge"));
  });

  const pel = api.evaluatePelOrientationContractSatisfaction({ activities });
  assert.equal(pel.satisfied, false);
  assert.ok(pel.missingFields.includes("intellectual_coherence_bridge"));
  assert.equal(Array.from(pel.missingBridgeActivityIds || []).join("|"), "A2|A3|A4");
});

test("repair: stripped A2–A4 bridges are restored and A1 remains empty", () => {
  const capture = {
    artifact_type: "learning_activities",
    activities: (hetero.activities || []).map((row, index) => {
      const next = clone(row);
      if (index === 0) {
        next.intellectual_coherence_bridge = "Should be cleared for the first activity.";
      } else if (index < 4) {
        delete next.intellectual_coherence_bridge;
      }
      return next;
    })
  };
  const repaired = scaffoldLib.repairGuidedLearningScaffoldOnDlaCapture(capture, {
    learningSequence: hetero.learning_sequence || {},
    workflowGoal: String(hetero.title || "")
  });
  const rows = repaired.parsed.activities;
  assert.ok(!String(rows[0].intellectual_coherence_bridge || "").trim());
  ["A2", "A3", "A4", "A5"].forEach((activityId, offset) => {
    const row = rows[offset + 1];
    assert.equal(row.activity_id, activityId);
    assert.ok(
      wordCount(row.intellectual_coherence_bridge) >=
        scaffoldLib.FIELD_WORD_RANGES.intellectual_coherence_bridge.min,
      activityId + " bridge restored"
    );
    assert.equal(scaffoldLib.bridgeLooksSchedulingOnly(row.intellectual_coherence_bridge), false);
  });
});

test("preservation: Design Page compose does not drop or alter authored bridges", () => {
  const bridgeText =
    "You distinguished residual variance and now carry that distinction into residual-plot reading using the same spread criterion rather than isolated unusual points when judging heteroscedasticity.";
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
            "Focus on whether prediction error stays stable or changes across observations."
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

test("fixture: heteroscedasticity A1 omits bridge; A2–A5 carry meaningful bridges", () => {
  const rows = hetero.activities || [];
  assert.equal(rows.length, 5);
  assert.ok(!String(rows[0].intellectual_coherence_bridge || "").trim());
  const progression = String(
    (hetero.learning_sequence &&
      hetero.learning_sequence.navigation_guidance &&
      hetero.learning_sequence.navigation_guidance.progression_logic) ||
      ""
  ).trim();
  rows.slice(1).forEach((row) => {
    const bridge = String(row.intellectual_coherence_bridge || "").trim();
    assert.ok(wordCount(bridge) >= 30, row.activity_id + " bridge length");
    assert.notEqual(bridge, String(row.activity_preamble || "").trim());
    assert.notEqual(bridge, String(row.reasoning_orientation || "").trim());
    assert.notEqual(bridge, progression);
  });
  assert.match(rows[1].intellectual_coherence_bridge, /residual[- ]plot|spread criterion/i);
  assert.match(rows[2].intellectual_coherence_bridge, /economic|visual judgement/i);
  assert.match(rows[3].intellectual_coherence_bridge, /inference|standard errors/i);
  assert.match(rows[4].intellectual_coherence_bridge, /detection and remedy|trade-offs/i);
});

test("binding: bridge reaches Orient prompt fields for A2–A5", () => {
  const result = buildPageModel(hetero);
  assert.equal(result.ok, true);
  ["A2", "A3", "A4", "A5"].forEach((activityId) => {
    const activity = result.model.activities.find((row) => row.id === activityId);
    assert.ok(activity, activityId);
    const bridgePrompt = orientPrompts(activity).find(
      (prompt) => prompt.sourceField === "intellectual_coherence_bridge"
    );
    assert.ok(bridgePrompt, activityId + " Orient bridge prompt");
    assert.match(String(bridgePrompt.text || ""), /\S/);
  });
  const a1 = result.model.activities.find((row) => row.id === "A1");
  const a1Bridge = orientPrompts(a1).find(
    (prompt) => prompt.sourceField === "intellectual_coherence_bridge"
  );
  assert.equal(a1Bridge, undefined);
});

test("render: A2–A5 show Connect your learning; A1 has no bridge section", () => {
  const html = renderLearnerPageHtml(hetero, { compositionMode: "moments" }).html;
  assert.doesNotMatch(extractActivityHtml(html, "A1"), /Connect your learning/i);
  ["A2", "A3", "A4", "A5"].forEach((activityId) => {
    const activityHtml = extractActivityHtml(html, activityId);
    assert.match(activityHtml, /Connect your learning/i);
    assert.match(activityHtml, /intellectual_coherence_bridge/i);
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
    assert.notEqual(bridge, String(row.activity_preamble || "").trim());
    assert.notEqual(bridge, String(row.reasoning_orientation || "").trim());
    assert.notEqual(bridge, progression);
    const timelinePurpose = ((hetero.learning_sequence && hetero.learning_sequence.timeline) || [])
      .filter((entry) => String(entry.activity_id || "") === row.activity_id)
      .map((entry) => String(entry.purpose || "").trim())
      .filter(Boolean);
    timelinePurpose.forEach((purpose) => {
      assert.notEqual(bridge, purpose);
    });
  });
});
