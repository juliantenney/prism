"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const indicative = require("../lib/indicative-duration.js");
const estimator = require("../lib/workload-feasibility-estimator.js");
const interactiveAdapter = require("../lib/interactive-workload-feasibility-adapter.js");
const assessmentAdapter = require("../lib/assessment-pack-workload-feasibility-adapter.js");
const situatedAdapter = require("../lib/situated-task-workload-feasibility-adapter.js");
const ljAdapter = require("../lib/learning-journey-workload-feasibility-adapter.js");

const buildActivityModel = require("../lib/learner-renderer-vnext/build-activity-model.js").buildActivityModel;
const renderActivity = require("../lib/learner-renderer-vnext/render-activity.js").renderActivity;
const renderPage = require("../lib/learner-renderer-vnext/render-page.js").renderPage;
const unifiedShell = require("../lib/learning-journey-unified-shell.js");

const ljPrompts = require("../lib/learning-journey-sibling-prompts.js");
const expoPrompts = require("../lib/expository-sibling-prompts.js");
const familyPrompts = require("../lib/first-class-workflow-family.js");
const practiceEpisodePlan = require("../lib/practice-episode-plan.js");
const practiceContracts = require("../lib/ld-practice-presentation-contracts.js");
const situatedDesignPage = require("../lib/situated-task-design-page.js");
const ljDesignPage = require("../lib/learning-journey-design-page.js");

test("1. Shared indicative duration helper matches S104 benchmark table and edge cases", () => {
  const benchmarks = [
    [5, "Around 5 minutes", 7, true],
    [10, "5–15 minutes", 15, false],
    [15, "10–20 minutes", 20, false],
    [20, "15–25 minutes", 25, false],
    [30, "20–40 minutes", 40, false],
    [45, "35–55 minutes", 55, false],
    [90, "75–105 minutes", 105, false]
  ];

  benchmarks.forEach(([mins, expectedLabel, expectedUpper, expectedShort]) => {
    const res = indicative.computeIndicativeDuration(mins);
    assert.ok(res, `Expected result for ${mins} min`);
    assert.equal(res.allocatedMinutes, mins);
    assert.equal(res.label, expectedLabel);
    assert.equal(res.upperBoundaryMinutes, expectedUpper);
    assert.equal(res.isShortAround, expectedShort);
    assert.equal(indicative.formatIndicativeDuration(mins), expectedLabel);
    assert.equal(indicative.getUpperIndicativeBoundaryMinutes(mins), expectedUpper);
  });

  // Short & fractional durations
  const fracShort = indicative.computeIndicativeDuration(2.5);
  assert.equal(fracShort.label, "Around 3 minutes");
  assert.equal(fracShort.isShortAround, true);
  assert.ok(fracShort.upperBoundaryMinutes >= 4);

  const fracMid = indicative.computeIndicativeDuration(12.5);
  assert.equal(fracMid.label, "8–18 minutes");
  assert.equal(fracMid.upperBoundaryMinutes, 18);

  // Extended duration
  const ext = indicative.computeIndicativeDuration(180);
  assert.equal(ext.label, "155–205 minutes");
  assert.equal(ext.upperBoundaryMinutes, 205);

  // Invalid inputs
  assert.equal(indicative.computeIndicativeDuration(0), null);
  assert.equal(indicative.computeIndicativeDuration(-5), null);
  assert.equal(indicative.computeIndicativeDuration(null), null);
  assert.equal(indicative.formatIndicativeDuration(NaN), "");

  // Monotonicity across 1..240
  let prevUpper = 0;
  for (let m = 1; m <= 240; m += 1) {
    const r = indicative.computeIndicativeDuration(m);
    assert.ok(r.upperBoundaryMinutes >= prevUpper, `Upper boundary non-monotonic at ${m}`);
    assert.ok(r.lowMinutes <= r.highMinutes, `Inverted bounds at ${m}`);
    prevUpper = r.upperBoundaryMinutes;
  }

  // Aggregate non-inflation: 6 x 15-min components sum to 90 min -> 75–105 (not 60–120)
  const componentSummedLower = 6 * indicative.computeIndicativeDuration(15).lowMinutes;
  const componentSummedUpper = 6 * indicative.computeIndicativeDuration(15).highMinutes;
  const journey90 = indicative.computeIndicativeDuration(90);
  assert.equal(componentSummedLower, 60);
  assert.equal(componentSummedUpper, 120);
  assert.equal(journey90.lowMinutes, 75);
  assert.equal(journey90.highMinutes, 105);
});

test("2. Workload estimator threshold policy: warn only when lower workload exceeds upper indicative boundary", () => {
  // Using assessCumulativeWorkload for exact controlled workload bands against 15-min allocation (indicative 10–20, upper = 20)
  const makeEst = (low, high) => ({
    sufficientEvidence: true,
    indicativeEffortMinutes: { low, high },
    components: {
      reading: { low: 0, high: 0 },
      evidenceInspection: { low: 0, high: 0 },
      workedExamples: { low: 0, high: 0 },
      decisions: { low: 0, high: 0 },
      reasoning: { low: 0, high: 0 },
      production: { low, high },
      feedback: { low: 0, high: 0 },
      revision: { low: 0, high: 0 }
    }
  });

  // 15-min allocation (indicative 10–20, upper boundary 20)
  const c12_18 = estimator.assessCumulativeWorkload([makeEst(12, 18)], 15);
  assert.equal(c12_18.plausiblyInsufficient, false);
  assert.equal(c12_18.rawExceedsAllocated, false);
  assert.equal(c12_18.upperIndicativeBoundaryMinutes, 20);

  const c16_28 = estimator.assessCumulativeWorkload([makeEst(16, 28)], 15);
  assert.equal(c16_28.plausiblyInsufficient, false);
  assert.equal(c16_28.rawExceedsAllocated, true); // underlying evidence preserved!
  assert.deepEqual(c16_28.cumulativeIndicativeMinutes, { low: 16, high: 28 });

  const c20_30 = estimator.assessCumulativeWorkload([makeEst(20, 30)], 15);
  assert.equal(c20_30.plausiblyInsufficient, false);
  assert.equal(c20_30.rawExceedsAllocated, true);

  const c25_40 = estimator.assessCumulativeWorkload([makeEst(25, 40)], 15);
  assert.equal(c25_40.plausiblyInsufficient, true);
  assert.equal(c25_40.overBudgetByMinutes, 5); // 25 - 20

  // Short 5-min allocation ("Around 5 minutes", internal upper boundary 7)
  const s6_9 = estimator.assessCumulativeWorkload([makeEst(6, 9)], 5);
  assert.equal(s6_9.indicativeDuration.label, "Around 5 minutes");
  assert.equal(s6_9.upperIndicativeBoundaryMinutes, 7);
  assert.equal(s6_9.plausiblyInsufficient, false);

  const s8_12 = estimator.assessCumulativeWorkload([makeEst(8, 12)], 5);
  assert.equal(s8_12.plausiblyInsufficient, true);
  assert.equal(s8_12.overBudgetByMinutes, 1); // 8 - 7

  // Insufficient evidence & duration unavailable remain explicit
  const noEvidence = estimator.estimateActivityWorkload({ declaredDurationMinutes: 15 });
  assert.equal(noEvidence.sufficientEvidence, false);
  assert.equal(noEvidence.plausiblyInsufficient, null);

  const noDuration = estimator.estimateActivityWorkload({
    activityType: "argumentative_writing",
    suggestedLengthWords: { min: 300, max: 400 },
    reasoningDemand: "argument",
    declaredDurationMinutes: null
  });
  assert.equal(noDuration.sufficientEvidence, true);
  assert.equal(noDuration.durationStatus, "unavailable");
  assert.equal(noDuration.plausiblyInsufficient, null);
});

test("3. Actionable workload warnings: factor-grounded, advisory, and locked-duration aware", () => {
  const est = estimator.estimateActivityWorkload({
    activityType: "argumentative_writing",
    suggestedLengthWords: { min: 350, max: 500 },
    reasoningDemand: "argument",
    readingDemand: "substantial",
    requiresFeedbackInterpretation: true,
    requiresRevision: true,
    declaredDurationMinutes: 15
  });
  assert.equal(est.plausiblyInsufficient, true);

  // Unlocked component warning
  const unlockedMsg = estimator.formatActionableWorkloadWarning({
    scopePrefix: "Workload feasibility (advisory)",
    subjectLabel: "Policy brief",
    allocatedMinutes: 15,
    estimate: est,
    durationLocked: false
  });
  assert.match(unlockedMsg, /allocated duration of 15 minutes/);
  assert.match(unlockedMsg, /indicative learner-facing range: 10–20 minutes/);
  assert.match(unlockedMsg, /estimated workload range is approximately \d+–\d+ minutes/);
  assert.match(unlockedMsg, /driven principally by/i);
  assert.match(unlockedMsg, /tighten the scope or length of the written response/i);
  assert.match(unlockedMsg, /advisory/i);
  assert.match(unlockedMsg, /absence of a warning does not guarantee feasibility/i);
  assert.match(unlockedMsg, /professional judgement/i);

  // Locked commissioned duration warning: must NOT tell author to change duration locally
  const lockedMsg = estimator.formatActionableWorkloadWarning({
    scopePrefix: "Workload feasibility (advisory, Situated Task)",
    subjectLabel: "Commissioned task",
    allocatedMinutes: 15,
    estimate: est,
    durationLocked: true
  });
  assert.match(lockedMsg, /commissioned duration is locked and cannot be changed here/i);
  assert.match(lockedMsg, /upstream Learning Journey commissioning level/i);
  assert.doesNotMatch(lockedMsg, /increase the allocated duration and/i);

  // Adapter propagation of durationLocked across Situated Task, Assessment Pack, and Interactive
  const stPage = situatedDesignPage.buildSituatedTaskDesignPageFixture({
    title: "Heavy Situated Task"
  }).page;
  stPage.sections = [
    {
      section_id: "brief",
      title: "Brief",
      order: 1,
      exposition:
        "Read the full dossier carefully. " +
        "word ".repeat(650) +
        "\n\nWrite a 400–500 word reasoned recommendation evaluating all trade-offs, then review against criteria and revise your argument."
    }
  ];
  stPage.record = {
    entries: [{ entry_id: "e1", label: "Written recommendation (400–500 words)" }]
  };
  const stRes = situatedAdapter.assessSituatedTaskWorkload(stPage, {
    effectiveDurationMinutes: 10,
    durationLocked: true
  });
  assert.equal(stRes.status, "plausibly_insufficient");
  assert.ok(stRes.warnings.length >= 1);
  assert.match(stRes.warnings[0], /commissioned duration is locked and cannot be changed here/i);
  assert.match(stRes.warnings[0], /indicative learner-facing range: 5–15 minutes/i);
});

test("4. Learner-facing presentation: indicative header, single standalone note, suppressed activity badges, preserved internal data", () => {
  // Build activity models: routine activity vs explicitly timed activity
  const routineAct = buildActivityModel({
    activity_id: "A1",
    title: "Compare elastic and inelastic goods",
    duration_minutes: 8,
    grouping: "individual",
    activity_interaction_type: "choose",
    learner_task: "Select the most price-inelastic good."
  });
  // Internal durationMinutes preserved in model!
  assert.equal(routineAct.activity.durationMinutes, 8);
  assert.equal(routineAct.activity.explicitTimeLimit, false);

  const routineHtml = renderActivity(routineAct.activity);
  assert.doesNotMatch(routineHtml, /util-badge-time/);
  assert.doesNotMatch(routineHtml, /8 min/);

  // Explicitly timed activity STILL shows time badge
  const timedAct = buildActivityModel({
    activity_id: "A2",
    title: "Timed diagnostic checkpoint",
    duration_minutes: 10,
    explicit_time_limit: true,
    grouping: "individual",
    activity_interaction_type: "choose",
    learner_task: "Complete within the fixed time limit."
  });
  assert.equal(timedAct.activity.durationMinutes, 10);
  assert.equal(timedAct.activity.explicitTimeLimit, true);
  const timedHtml = renderActivity(timedAct.activity);
  assert.match(timedHtml, /util-badge-time/);
  assert.match(timedHtml, /data-explicit-time-limit="true"/);
  assert.match(timedHtml, /10 min/);

  // Standalone page header renders indicative duration + single explanatory wording
  const pageHtml = renderPage({
    pageKind: "practice",
    title: "Elasticity in Action",
    header: { description: "Apply elasticity concepts.", durationMinutes: 15 },
    orientationSections: [],
    learningOutcomes: [],
    activities: [routineAct.activity]
  });
  assert.match(pageHtml, /data-duration-minutes="15"/);
  assert.match(pageHtml, /data-indicative-duration="10–20 minutes"/);
  assert.match(pageHtml, />10–20 minutes<\/p>/);
  assert.ok(pageHtml.includes(indicative.LEARNER_TIMING_GUIDANCE_NOTE));
  assert.doesNotMatch(pageHtml, /util-badge-time/);

  // When suppressStandaloneTimingNote is set, note is omitted while indicative duration remains
  const suppressedHtml = renderPage(
    {
      pageKind: "practice",
      title: "Elasticity in Action",
      header: { description: "Apply elasticity concepts.", durationMinutes: 5 },
      orientationSections: [],
      learningOutcomes: [],
      activities: []
    },
    { suppressStandaloneTimingNote: true }
  );
  assert.match(suppressedHtml, />Around 5 minutes<\/p>/);
  assert.equal(suppressedHtml.includes(indicative.LEARNER_TIMING_GUIDANCE_NOTE), false);
});

test("5. Learning Journey unified shell: aggregate indicative total (no tolerance inflation), single overview note, component listing indicative durations", () => {
  const c1Html = renderPage({
    pageKind: "expository",
    title: "Foundations of Elasticity",
    header: { description: "Intro.", durationMinutes: 15 },
    orientationSections: [],
    learningOutcomes: [],
    activities: []
  });
  const c2Html = renderPage({
    pageKind: "practice",
    title: "Applying Elasticity",
    header: { description: "Practice.", durationMinutes: 15 },
    orientationSections: [],
    learningOutcomes: [],
    activities: []
  });

  const journey = ljDesignPage.buildLearningJourneyDesignPageFixture({
    title: "Economics Learning Journey"
  });
  assert.equal(journey.ok, true);
  journey.page.learning_journey = Object.assign({}, journey.page.learning_journey || {}, {
    allocated_minutes: 30
  });
  const supportedComms = journey.page.commissions.slice(0, 2);
  supportedComms.forEach((c) => {
    c.status = "supported";
    c.allocated_minutes = 15;
  });
  journey.page.commissions = supportedComms;

  const built = unifiedShell.buildLearningJourneyUnifiedShellHtml(journey.page, [
    {
      commissionId: supportedComms[0].commission_id,
      html: c1Html,
      title: supportedComms[0].title,
      productId: supportedComms[0].product_id,
      pageKey: "c1"
    },
    {
      commissionId: supportedComms[1].commission_id,
      html: c2Html,
      title: supportedComms[1].title,
      productId: supportedComms[1].product_id,
      pageKey: "c2"
    }
  ]);
  assert.equal(built.ok, true);

  // Journey overview shows indicative total from exact 30-min total -> 20–40 minutes
  assert.match(built.html, /data-duration-minutes="30" data-indicative-duration="20–40 minutes"/);
  assert.match(built.html, /Indicative duration: 20–40 minutes/);

  // Explanatory timing guidance note appears ONCE (at journey overview), NOT repeated inside C1/C2 templates
  const noteMatches = built.html.match(/data-timing-guidance-note="true"/g) || [];
  assert.equal(noteMatches.length, 1);
  assert.ok(built.html.includes(indicative.LEARNER_TIMING_GUIDANCE_NOTE));

  // Component listing (TOC) shows indicative component durations (10–20 minutes for each 15-min commission)
  const tocDurMatches = built.html.match(/class="lj-shell__toc-duration"[^>]*>10–20 minutes<\/span>/g) || [];
  assert.equal(tocDurMatches.length, 2);
});

test("6. Authoring prompts across product families align with S104 learner-facing timing policy", () => {
  const ljStage4 =
    (ljPrompts.STRUCTURED_TEMPLATES && ljPrompts.STRUCTURED_TEMPLATES.learning_commissions) ||
    fs.readFileSync(path.join(__dirname, "..", "lib", "learning-journey-sibling-prompts.js"), "utf8");
  assert.match(ljStage4, /Learner-facing timing presentation policy/i);
  assert.match(ljStage4, /shared indicative duration convention/i);

  const expoPrompt = JSON.stringify(expoPrompts.TEMPLATES || expoPrompts);
  assert.match(expoPrompt, /Learner-facing timing policy/i);
  assert.match(expoPrompt, /shared indicative duration convention/i);

  const apBuilt = familyPrompts.buildAssessmentPackStagePromptText
    ? familyPrompts.buildAssessmentPackStagePromptText("elicitation_design", {})
    : fs.readFileSync(path.join(__dirname, "..", "lib", "first-class-workflow-family.js"), "utf8");
  assert.match(apBuilt, /shared presentation layer displays indicative ranges deterministically/i);

  const pracPlan = practiceEpisodePlan.buildPracticeEpisodePlanPromptBlock
    ? practiceEpisodePlan.buildPracticeEpisodePlanPromptBlock({ durationMinutes: 15 })
    : fs.readFileSync(path.join(__dirname, "..", "lib", "practice-episode-plan.js"), "utf8");
  assert.match(pracPlan, /do NOT present fixed completion expectations/i);

  const pracContract = fs.readFileSync(
    path.join(__dirname, "..", "lib", "ld-practice-presentation-contracts.js"),
    "utf8"
  );
  assert.match(pracContract, /Learner-facing timing policy/i);

  const stPrompt = situatedDesignPage.buildSituatedTaskDesignPagePrompt();
  assert.match(stPrompt, /Learner-facing timing policy/i);
  assert.match(stPrompt, /shared presentation layer renders indicative ranges deterministically/i);
});
