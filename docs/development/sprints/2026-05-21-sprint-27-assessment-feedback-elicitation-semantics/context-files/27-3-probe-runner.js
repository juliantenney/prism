/**
 * Sprint 27-3 — read-only probe capture (extract + topology + step flags).
 * Run from repo root:
 *   node docs/development/sprints/2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/context-files/27-3-probe-runner.js
 */
const fs = require("fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);
const climatePagePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "ld-climate-misconception-discussion-page.json"
);

const PROBES = [
  {
    id: "P27-02",
    brief: {
      goal:
        "Design a 60-minute seminar on ocean acidification for undergraduate marine science students. Small groups discuss scenario questions using provided prompts, then complete a 5-item formative check. Do not reveal correct answers on the student handout — tutor will debrief.",
      inputs:
        "Include facilitator notes with pacing for discussion, scenario prompts, and debrief guidance for the formative check.",
      desiredOutputs: "Learner handout page plus facilitator session notes.",
      startingArtefact: "generate_from_topic",
      selectedDomains: ["learning-design"]
    },
    resolved: {
      topic: "ocean acidification",
      design_scope: "session",
      session_materials: ["page"],
      delivery_pattern: "face_to_face",
      input_strategy: "generate_from_topic",
      learner_level: "undergraduate"
    },
    desiredSemantics: {
      feedback_timing: "after_peer_discussion | tutor_led_reveal_only",
      assessment_interaction_mode: "discussion_oriented",
      learner_answer_visibility: "hidden_until_reveal",
      tutor_answer_artefact: "generate_internal_only | include_in_facilitator_page",
      peer_instruction_phase: "small_group_discussion_then_check",
      misconception_assessment_link: "optional",
      confidence_rating_required: false,
      design_feedback_required: true
    }
  },
  {
    id: "P27-03",
    brief: {
      goal:
        "Create a peer instruction session on stoichiometry: students attempt problems individually, discuss in pairs, then revise answers. Include 6 MCQs and reflection prompts. Emphasise pair discussion before confirming solutions.",
      inputs: "First-year chemistry; 90-minute lab session.",
      desiredOutputs: "Learner-facing session page with activities and MCQ check.",
      startingArtefact: "generate_from_topic",
      selectedDomains: ["learning-design"]
    },
    resolved: {
      topic: "stoichiometry",
      design_scope: "session",
      session_materials: ["page"],
      delivery_pattern: "face_to_face",
      input_strategy: "generate_from_topic",
      learner_level: "undergraduate"
    },
    desiredSemantics: {
      feedback_timing: "after_peer_discussion",
      assessment_interaction_mode: "discussion_oriented | retrieval_practice",
      learner_answer_visibility: "hidden_until_reveal | show_after_activity_block",
      peer_instruction_phase: "think_pair_share",
      design_feedback_required: false
    }
  },
  {
    id: "P27-04",
    brief: {
      goal:
        "Using the uploaded lecture on climate change, create a misconception discussion workshop. Provide task cards of common false claims, an analysis worksheet, and discussion prompts. End with true/false diagnostic statements — learners should not see correct answers on the handout.",
      inputs: "Uploaded lecture transcript on climate change science.",
      desiredOutputs: "Learner page for workshop discussion and formative check.",
      startingArtefact: "provided_source_content",
      selectedDomains: ["learning-design"]
    },
    resolved: {
      topic: "climate change",
      design_scope: "session",
      session_materials: ["page"],
      input_strategy: "provided_source_content",
      delivery_pattern: "face_to_face"
    },
    desiredSemantics: {
      feedback_timing: "tutor_led_reveal_only | after_peer_discussion",
      assessment_interaction_mode: "diagnostic_misconception",
      learner_answer_visibility: "hidden_until_reveal",
      misconception_assessment_link: true,
      design_feedback_required: false
    }
  }
];

function loadApi() {
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise
  };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(appJsPath, "utf8"), sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function extractLdWorkflowPolicy(md) {
  const idx = md.indexOf("### Workflow Policy");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowPolicy;
}

function hasStep(steps, name) {
  const n = String(name).toLowerCase();
  return steps.some((t) => String(t).toLowerCase() === n);
}

function mapCandidateSemantics(extract, steps, desired) {
  const e = extract || {};
  const out = {};
  out.feedback_timing = {
    desired: desired.feedback_timing,
    captured: null,
    note: "No brief factor; feedback_required is commentary mode only"
  };
  out.assessment_interaction_mode = {
    desired: desired.assessment_interaction_mode,
    captured: null,
    note: "No factor; infer from brief prose only (not in resolved JSON)"
  };
  out.learner_answer_visibility = {
    desired: desired.learner_answer_visibility,
    captured: e.include_answers === false ? "hidden (include_answers false)" : e.include_answers === true ? "show (include_answers true)" : "unset",
    note: e.include_answers === true && /do not reveal|should not see/i.test(JSON.stringify(e)) ? "FALSE POSITIVE RISK" : ""
  };
  out.tutor_answer_artefact = {
    desired: desired.tutor_answer_artefact || "n/a",
    captured: e.page_profile === "facilitator" ? "page_profile facilitator (collateral)" : "unset",
    note: "No tutor_answer_artefact factor"
  };
  out.peer_instruction_phase = {
    desired: desired.peer_instruction_phase || "n/a",
    captured: hasStep(steps, "Construct Learning Sequence") ? "sequence step present (weak proxy)" : "no sequence proxy",
    note: "pair/small_group not on assessment"
  };
  out.misconception_assessment_link = {
    desired: desired.misconception_assessment_link,
    captured: null,
    note: "No factor"
  };
  out.confidence_rating_required = {
    desired: desired.confidence_rating_required || false,
    captured: false,
    note: "Absent in extract"
  };
  out.design_feedback_required = {
    desired: desired.design_feedback_required,
    captured: hasStep(steps, "Design Feedback"),
    note: "Topology inclusion only"
  };
  return out;
}

function captureProbe(api, wp, probe) {
  const ex = api.extractWorkflowBriefExplicitFactors(probe.brief);
  const resolved = Object.assign({ session_materials: ["page"] }, ex, probe.resolved || {});
  const thin = {
    steps: [
      { title: "Normalize Content" },
      { title: "Model Knowledge" },
      { title: "Define Learning Outcomes" },
      { title: "Generate Assessment Items" },
      { title: "Design Page" }
    ]
  };
  const hints = {
    goal: probe.brief.goal || "",
    inputs: probe.brief.inputs || "",
    desiredOutputs: probe.brief.desiredOutputs || "",
    startingArtefact: probe.brief.startingArtefact || "",
    explicitBriefFactors: ex,
    resolvedBriefFactors: resolved
  };
  const out = api.applyWorkflowDesignHeuristics(thin, {
    selectedDomains: ["general", "learning-design"],
    workflowPolicy: wp,
    stepPatternCatalog: [],
    ...hints
  });
  const steps = (out.steps || []).map((s) => s.title);
  return {
    probeId: probe.id,
    brief: probe.brief,
    resolvedFactors: resolved,
    explicitExtract: ex,
    workflowSteps: steps,
    designAssessmentPresent: hasStep(steps, "Design Assessment"),
    designFeedbackPresent: hasStep(steps, "Design Feedback"),
    candidateSemantics: mapCandidateSemantics(ex, steps, probe.desiredSemantics),
    liveGeneration: {
      assessment_items: "PENDING — no Factory/OpenAI run in 27-3",
      feedback_pack: "PENDING",
      page: "PENDING"
    }
  };
}

function climateFixtureProxy(api) {
  if (!fs.existsSync(climatePagePath)) return null;
  const page = JSON.parse(fs.readFileSync(climatePagePath, "utf8"));
  const sections = (page.sections || []).map((s) => ({
    section_id: s.section_id,
    heading: s.heading
  }));
  const items = page.sections
    ? page.sections
        .filter((s) => s.section_id === "assessment_check")
        .flatMap((s) => (s.content && s.content.items ? s.content.items : []))
    : [];
  const r = api.buildUtilityStructuredHtmlForTest(page);
  const html = String((r && r.html) || "");
  const answersVisible =
    /Correct answer/i.test(html) ||
    /Answer Key/i.test(html) ||
    /util-answer-grid/i.test(html);
  return {
    source: "tests/fixtures/page-render/ld-climate-misconception-discussion-page.json",
    label: "27-1 fixture proxy — NOT generated from P27-04 exact brief in this run",
    page_profile: page.page_profile,
    feedback_display: page.feedback_display,
    include_answers: page.include_answers,
    sectionIdsHeadings: sections,
    assessmentItemsExcerpt: items.map((it) => ({
      item_id: it.item_id,
      item_type: it.item_type,
      has_true_false_answer: Object.prototype.hasOwnProperty.call(it, "true_false_answer"),
      true_false_answer: it.true_false_answer
    })),
    feedback_pack: "absent in fixture (no feedback_pack artefact)",
    exportHtmlAnswersVisible: answersVisible,
    exportHtmlTrueFalseOptions: /util-true-false-options/.test(html)
  };
}

const api = loadApi();
const wp = extractLdWorkflowPolicy(fs.readFileSync(ldPatternsPath, "utf8"));
const captures = PROBES.map((p) => captureProbe(api, wp, p));
const p04Proxy = climateFixtureProxy(api);

const report = {
  capturedAt: new Date().toISOString(),
  method: "Read-only: extractWorkflowBriefExplicitFactors + applyWorkflowDesignHeuristics; no live LLM",
  probes: captures,
  p27_04_fixtureProxy: p04Proxy
};

console.log(JSON.stringify(report, null, 2));
