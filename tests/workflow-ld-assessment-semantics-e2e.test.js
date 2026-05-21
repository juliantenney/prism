/**
 * Sprint 27 track 27-4f — full semantic path regressions (E → O → G contract → C → R).
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
const climateFixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "ld-climate-misconception-discussion-page.json"
);

const DISCUSSION_CHAIN_WRONG_ORDER = {
  steps: [
    { title: "Normalize Content", role: "" },
    { title: "Model Knowledge", role: "" },
    { title: "Define Learning Outcomes", role: "" },
    { title: "Generate Assessment Items", role: "" },
    { title: "Design Learning Activities", role: "" },
    { title: "Generate Activity Materials", role: "" },
    { title: "Design Page", role: "" }
  ]
};

const P27_02 = {
  goal:
    "Design a 60-minute seminar on ocean acidification for undergraduate marine science students. Small groups discuss scenario questions using provided prompts, then complete a 5-item formative check. Do not reveal correct answers on the student handout — tutor will debrief.",
  inputs:
    "Include facilitator notes with pacing for discussion, scenario prompts, and debrief guidance for the formative check.",
  desiredOutputs: "Learner handout page plus facilitator session notes.",
  startingArtefact: "generate_from_topic"
};

const P27_03 = {
  goal:
    "Create a peer instruction session on stoichiometry: students attempt problems individually, discuss in pairs, then revise answers. Include 6 MCQs and reflection prompts. Emphasise pair discussion before confirming solutions.",
  inputs: "First-year chemistry; 90-minute lab session.",
  desiredOutputs: "Learner-facing session page with activities and MCQ check.",
  startingArtefact: "generate_from_topic"
};

const P27_04 = {
  goal:
    "Using the uploaded lecture on climate change, create a misconception discussion workshop. Provide task cards of common false claims, an analysis worksheet, and discussion prompts. End with true/false diagnostic statements — learners should not see correct answers on the handout.",
  inputs: "Uploaded lecture transcript on climate change science.",
  desiredOutputs: "Learner page for workshop discussion and formative check.",
  startingArtefact: "provided_source_content"
};

function extractLdWorkflowPolicy(md) {
  const idx = md.indexOf("### Workflow Policy");
  assert.ok(idx !== -1);
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowPolicy;
}

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  assert.ok(idx !== -1);
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
}

function extractStepPromptTemplate(md, sectionTitle) {
  const idx = md.indexOf(sectionTitle);
  assert.ok(idx !== -1, "missing section: " + sectionTitle);
  const fence = md.indexOf("```json", md.indexOf("### Prompt Factory", idx));
  assert.ok(fence !== -1);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).promptTemplate;
}

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() { return false; } },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute: () => null,
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {}
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
  const documentStub = {
    readyState: "complete",
    addEventListener: () => {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      const store = loadPrismTestApi._elementStore || (loadPrismTestApi._elementStore = new Map());
      if (!store.has(id)) store.set(id, createElementStub());
      return store.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener: () => {},
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem: () => {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL: () => {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

function stepTitles(out) {
  return (out.steps || []).map((s) => String(s.title || "").trim());
}

function indexOfTitle(titles, name) {
  return titles.findIndex((t) => t.toLowerCase() === String(name).toLowerCase());
}

function sectionScope(html, headingText) {
  const re = new RegExp(
    headingText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\s\\S]*?(?=<h2|<details class=\"util-meta\"|$)",
    "i"
  );
  const m = html.match(re);
  return m ? m[0] : html;
}

function indexOfMarker(html, marker) {
  const idx = html.indexOf(marker);
  return idx === -1 ? Number.POSITIVE_INFINITY : idx;
}

function extractBrief(api, brief) {
  return api.extractWorkflowBriefExplicitFactors({
    goal: brief.goal,
    inputs: brief.inputs,
    desiredOutputs: brief.desiredOutputs,
    startingArtefact: brief.startingArtefact,
    selectedDomains: ["learning-design"]
  });
}

function resolveBrief(api, ldBriefConfig, brief, explicit) {
  return api.resolveWorkflowBriefFactors(ldBriefConfig, explicit, {}, {}, brief).resolved;
}

function applyTopology(api, ldWorkflowPolicy, brief, explicit, resolved) {
  return api.applyWorkflowDesignHeuristics(JSON.parse(JSON.stringify(DISCUSSION_CHAIN_WRONG_ORDER)), {
    selectedDomains: ["general", "learning-design"],
    workflowPolicy: ldWorkflowPolicy,
    stepPatternCatalog: [],
    goal: brief.goal,
    inputs: brief.inputs,
    desiredOutputs: brief.desiredOutputs,
    startingArtefact: brief.startingArtefact,
    explicitBriefFactors: explicit,
    resolvedBriefFactors: Object.assign(
      {
        session_materials: ["page"],
        input_strategy: brief.startingArtefact || "generate_from_topic",
        design_scope: "session",
        delivery_context: "in_person",
        assessment_required: true
      },
      resolved
    )
  });
}

const api = loadPrismTestApi();
const ldMd = fs.readFileSync(ldPatternsPath, "utf8");
const ldWorkflowPolicy = extractLdWorkflowPolicy(ldMd);
const ldBriefConfig = api.normalizeWorkflowBriefConfig(extractWorkflowBriefConfig(ldMd));

test("27-4f G contract: Generate Assessment Items prompt references assessment semantics", () => {
  const tpl = extractStepPromptTemplate(ldMd, "## 9. Generate Assessment Items");
  assert.match(tpl, /Assessment semantics/i);
  assert.match(tpl, /feedback_timing/i);
  assert.match(tpl, /learner_answer_visibility/i);
  assert.match(tpl, /ALWAYS populate answer-bearing fields/i);
  assert.match(tpl, /diagnostic_misconception/i);
  assert.match(tpl, /peer_instruction_phase/i);
});

test("27-4f G contract: Design Feedback prompt references delayed tutor reveal", () => {
  const tpl = extractStepPromptTemplate(ldMd, "## 8. Design Feedback");
  assert.match(tpl, /Assessment semantics/i);
  assert.match(tpl, /tutor_led_reveal_only/i);
  assert.match(tpl, /after_peer_discussion/i);
  assert.match(tpl, /hidden_until_reveal/i);
});

test("27-4f E2E P27-02: tutor-led delayed feedback full semantic path", () => {
  const explicit = extractBrief(api, P27_02);
  assert.notEqual(explicit.include_answers, true);
  assert.equal(explicit.learner_answer_visibility, "hidden_until_reveal");
  assert.equal(explicit.feedback_timing, "tutor_led_reveal_only");
  assert.equal(explicit.assessment_interaction_mode, "discussion_oriented");

  const resolved = resolveBrief(api, ldBriefConfig, P27_02, explicit);
  assert.equal(resolved.design_feedback_required, true);

  const topo = applyTopology(api, ldWorkflowPolicy, P27_02, explicit, resolved);
  const titles = stepTitles(topo);
  assert.ok(indexOfTitle(titles, "Design Feedback") !== -1, titles.join(" -> "));
  const dla = indexOfTitle(titles, "Design Learning Activities");
  const gam = indexOfTitle(titles, "Generate Activity Materials");
  const gai = indexOfTitle(titles, "Generate Assessment Items");
  assert.ok(dla < gam && gam < gai, titles.join(" -> "));

  const mapped = api.applyWorkflowBriefMappings(ldBriefConfig, resolved);
  const dp = mapped.stepParamPatch.step_design_page;
  assert.equal(dp.include_answers, "false");
  assert.equal(dp.feedback_display, "none");

  const gItems = {
    items: [
      {
        item_id: "OA-1",
        item_type: "true_false",
        proposition: "Ocean acidification only affects polar regions.",
        true_false_answer: "False",
        explanation_or_rationale: "Chemistry changes are global; debrief with pH evidence."
      }
    ]
  };
  const page = api.applyAssessmentSemanticsToComposedPage(
    {
      artifact_type: "page",
      title: "Ocean acidification seminar handout",
      sections: [
        {
          section_id: "assessment_check",
          heading: "Formative check",
          content: gItems
        }
      ]
    },
    resolved
  );
  assert.equal(page.feedback_display, "none");
  assert.equal(page.sections[0].content.items[0].true_false_answer, "False");

  const r = api.buildUtilityStructuredHtmlForTest(page);
  assert.ok(r && !r.error, r && r.error);
  const assessment = sectionScope(String(r.html), "Formative check");
  assert.doesNotMatch(assessment, /Correct answer/i);
});

test("27-4f E2E P27-03: peer instruction → reflection_then_answers path", () => {
  const explicit = extractBrief(api, P27_03);
  assert.equal(explicit.peer_instruction_phase, "think_pair_share");

  const resolved = resolveBrief(api, ldBriefConfig, P27_03, explicit);
  delete resolved.learner_answer_visibility;
  resolved.feedback_timing = "after_peer_discussion";
  resolved.assessment_required = true;

  const topo = applyTopology(api, ldWorkflowPolicy, P27_03, explicit, resolved);
  const titles = stepTitles(topo);
  assert.ok(indexOfTitle(titles, "Design Learning Activities") < indexOfTitle(titles, "Generate Assessment Items"));

  const presentation = api.resolveAssessmentPresentationFromBriefFactors(resolved);
  assert.equal(presentation.feedbackDisplay, "reflection_then_answers");

  const gItems = {
    items: [
      {
        item_id: "ST-1",
        stem: "Balance this redox half-equation in acidic solution.",
        options: { A: "Option 1", B: "Option 2" },
        correct_answer: "A",
        explanation_or_rationale: "Discuss in pairs before confirming."
      }
    ]
  };
  const page = api.applyAssessmentSemanticsToComposedPage(
    {
      artifact_type: "page",
      title: "Peer instruction stoichiometry",
      sections: [
        {
          section_id: "assessment_check",
          heading: "MCQ check",
          content: gItems
        }
      ]
    },
    resolved
  );
  assert.equal(page.feedback_display, "reflection_then_answers");
  assert.equal(page.sections[0].content.items[0].correct_answer, "A");

  const r = api.buildUtilityStructuredHtmlForTest(page);
  const html = String(r.html || "");
  const assessment = sectionScope(html, "MCQ check");
  assert.doesNotMatch(assessment, /Correct answer/i);
  assert.match(html, /Self-check answers/i);
  assert.ok(indexOfMarker(html, "Balance this redox") < indexOfMarker(html, "Self-check answers"));
});

test("27-4f E2E P27-04: diagnostic misconception retains answers in JSON, hides inline", () => {
  const explicit = extractBrief(api, P27_04);
  assert.equal(explicit.assessment_interaction_mode, "diagnostic_misconception");
  assert.equal(explicit.misconception_assessment_link, true);
  assert.equal(explicit.learner_answer_visibility, "hidden_until_reveal");

  const resolved = resolveBrief(api, ldBriefConfig, P27_04, explicit);
  const topo = applyTopology(api, ldWorkflowPolicy, P27_04, explicit, resolved);
  assert.ok(indexOfTitle(stepTitles(topo), "Design Feedback") !== -1);

  const climate = JSON.parse(fs.readFileSync(climateFixturePath, "utf8"));
  const stamped = api.applyAssessmentSemanticsToComposedPage(climate, resolved);
  const item = stamped.sections.find((s) => s.section_id === "assessment_check").content.items[0];
  assert.ok(item.true_false_answer);
  assert.equal(stamped.feedback_display, "none");

  const r = api.buildUtilityStructuredHtmlForTest(stamped);
  const assessment = sectionScope(String(r.html), "Formative assessment");
  assert.doesNotMatch(assessment, /Correct answer/i);
});
