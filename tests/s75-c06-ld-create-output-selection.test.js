/**
 * Sprint 75 — C-06 Learning Design Create output selection (S75-D11).
 *
 * Explicit Create-time choice: Self-study resource | Workshop only.
 * Presentation: native select (not radios). Maps onto existing LD factor /
 * workflowOutputSpec machinery.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");
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
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api, source };
}

function resolveBrief(api, config, brief) {
  let explicit = api.extractWorkflowBriefExplicitFactors(brief);
  explicit = api.mergeLdCreateOutputTypeIntoExplicitFactors(
    explicit,
    brief.ldCreateOutputType || ""
  );
  const inferred = api.applyWorkflowBriefInferenceRules(
    config,
    [brief.designIntent || brief.goal || "", brief.desiredOutputs || ""].join("\n"),
    [brief.inputs || "", brief.scopeConstraints || "", brief.audience || "", brief.scopeScale || ""].join(
      "\n"
    )
  );
  return api.resolveWorkflowBriefFactors(config, explicit, {}, inferred, brief).resolved;
}

const { api, source } = loadPrismTestApi();
const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
const ldBriefConfig = api.normalizeWorkflowBriefConfig(
  extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"))
);

test("A: Learning Design shows a select, not radio buttons", () => {
  assert.match(indexHtml, /id="wfLdCreateOutputTypeGroup"/);
  assert.match(indexHtml, /What are you creating\?/);
  assert.match(indexHtml, /<select[^>]*id="wfLdCreateOutputType"/);
  assert.match(indexHtml, /label for="wfLdCreateOutputType"/);
  assert.doesNotMatch(indexHtml, /name="wfLdCreateOutputType"/);
  assert.doesNotMatch(indexHtml, /type="radio"[^>]*wfLdCreateOutputType|wfLdCreateOutputTypeSelfStudy|role="radiogroup"/);
  assert.doesNotMatch(indexHtml, /id="wfLdCreateOutputTypeSelfStudy"|id="wfLdCreateOutputTypeWorkshop"/);
});

test("B: Select contains exactly placeholder + Self-study + Workshop", () => {
  const selectMatch = indexHtml.match(
    /<select[^>]*id="wfLdCreateOutputType"[^>]*>([\s\S]*?)<\/select>/
  );
  assert.ok(selectMatch, "expected #wfLdCreateOutputType select");
  const options = [...selectMatch[1].matchAll(/<option[^>]*value="([^"]*)"[^>]*>([\s\S]*?)<\/option>/g)].map(
    (m) => ({ value: m[1], label: m[2].replace(/\s+/g, " ").trim() })
  );
  assert.equal(options.length, 3);
  assert.equal(options[0].value, "");
  assert.match(options[0].label, /Select what you are creating/);
  assert.equal(options[1].value, "self_study_resource");
  assert.equal(options[1].label, "Self-study resource");
  assert.equal(options[2].value, "workshop");
  assert.equal(options[2].label, "Workshop");
  assert.equal(api.LD_CREATE_OUTPUT_TYPE_CHOICES.length, 2);
});

test("C: Internal values remain self_study_resource / workshop", () => {
  assert.equal(api.LD_CREATE_OUTPUT_TYPE_SELF_STUDY, "self_study_resource");
  assert.equal(api.LD_CREATE_OUTPUT_TYPE_WORKSHOP, "workshop");
  assert.ok(
    api.LD_CREATE_OUTPUT_TYPE_CHOICES.some((c) => c.value === "self_study_resource")
  );
  assert.ok(api.LD_CREATE_OUTPUT_TYPE_CHOICES.some((c) => c.value === "workshop"));
  assert.match(source, /function getSelectedLdCreateOutputTypeFromUi/);
  assert.match(
    source,
    /normalizeLdCreateOutputType\(els\.wfLdCreateOutputType\.value\)/
  );
});

test("D: Default placeholder is invalid for Design workflow", () => {
  assert.equal(api.normalizeLdCreateOutputType(""), "");
  assert.match(indexHtml, /id="wfLdCreateOutputType"[\s\S]*?<option value="">Select what you are creating/);
  assert.match(
    source,
    /isLearningDesign && !ldCreateOutputType[\s\S]{0,80}Choose what you are creating/
  );
});

test("E: Selecting Self-study satisfies validation helpers", () => {
  assert.equal(
    api.normalizeLdCreateOutputType("self_study_resource"),
    api.LD_CREATE_OUTPUT_TYPE_SELF_STUDY
  );
  assert.equal(
    api.composeLdCreateDesignIntent(api.LD_CREATE_OUTPUT_TYPE_SELF_STUDY, "Managing Risk"),
    "Create a self-study resource: Managing Risk"
  );
});

test("F: Selecting Workshop satisfies validation helpers", () => {
  assert.equal(api.normalizeLdCreateOutputType("workshop"), api.LD_CREATE_OUTPUT_TYPE_WORKSHOP);
  assert.equal(
    api.composeLdCreateDesignIntent(api.LD_CREATE_OUTPUT_TYPE_WORKSHOP, "Misconception discussion"),
    "Create a workshop: Misconception discussion"
  );
});

test("G: Existing Self-study mapping remains unchanged", () => {
  const brief = {
    designIntent: "Create a self-study resource: Managing Risk for programme managers",
    goal: "Create a self-study resource: Managing Risk for programme managers",
    desiredOutputs: "Learner-facing page with short activities",
    audience: "programme managers",
    scopeScale: "60 minutes",
    inputs: "",
    selectedDomains: ["learning-design"],
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_SELF_STUDY
  };
  const resolved = resolveBrief(api, ldBriefConfig, brief);
  assert.equal(resolved.delivery_context, "self_directed");
  assert.equal(resolved.delivery_mode, "async");
  assert.equal(resolved.delivery_pattern, "mostly_online");
  assert.equal(resolved.page_profile, "learner");
  assert.ok(Array.isArray(resolved.session_materials));
  assert.ok(resolved.session_materials.includes("page"));
  const envs = Array.isArray(resolved.learning_environments)
    ? resolved.learning_environments
    : [resolved.learning_environments];
  assert.ok(!envs.includes("classroom"));
});

test("H: Existing Workshop mapping remains unchanged", () => {
  const brief = {
    designIntent: "Create a workshop: climate-change misconceptions discussion",
    goal: "Create a workshop: climate-change misconceptions discussion",
    desiredOutputs: "Facilitator handout and learner handout",
    audience: "undergraduate students",
    scopeScale: "90-minute workshop",
    inputs: "Uploaded lecture transcript",
    startingArtefact: "provided_source_content",
    selectedDomains: ["learning-design"],
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_WORKSHOP
  };
  const resolved = resolveBrief(api, ldBriefConfig, brief);
  assert.equal(resolved.delivery_mode, "live_workshop");
  assert.notEqual(resolved.delivery_context, "self_directed");
  assert.equal(resolved.delivery_pattern, "face_to_face");
  const envs = Array.isArray(resolved.learning_environments)
    ? resolved.learning_environments
    : [resolved.learning_environments];
  assert.ok(envs.includes("classroom"));
});

test("I: Fresh load / Create show sync does not require manual domain reselection", () => {
  assert.match(source, /function refreshWfLdCreateOutputTypeElementRefs/);
  assert.match(source, /syncWorkflowFactoryLdCreateOutputTypeUi\(selectedValue\)/);
  assert.match(
    source,
    /showWorkflowFactory[\s\S]{0,200}syncWorkflowFactoryLdCreateOutputTypeUi\(getWorkflowFactoryStructuredDomainId\(\)\)/
  );
  assert.match(source, /els\.wfLdCreateOutputType = document\.getElementById\("wfLdCreateOutputType"\)/);
});

test("J: Research hides the LD dropdown and retains existing Research UI", () => {
  assert.match(indexHtml, /class="[^"]*\bhidden\b[^"]*"[^>]*id="wfLdCreateOutputTypeGroup"|id="wfLdCreateOutputTypeGroup"[^>]*\bhidden\b/);
  assert.match(source, /var isLd = String\(structuredDomainId \|\| ""\) === "learning-design"/);
  assert.match(source, /classList\.toggle\("hidden", !isLd\)/);
  assert.match(source, /els\.wfLdCreateOutputType\.value = ""/);
  assert.doesNotMatch(source, /objective_type[\s\S]{0,80}ldCreateOutputType/);
  const researchish = {
    designIntent: "Produce an evidence briefing on remote assessment policy",
    goal: "Produce an evidence briefing on remote assessment policy",
    desiredOutputs: "executive briefing",
    selectedDomains: ["research"],
    ldCreateOutputType: ""
  };
  const seed = api.getLdCreateOutputTypePrimaryFactorSeed("");
  assert.equal(seed, null);
  const applied = api.applyLdCreateOutputTypePrimaryFactors(
    { objective_type: "briefing" },
    researchish
  );
  assert.equal(applied.objective_type, "briefing");
  assert.equal(applied.delivery_context, undefined);
  assert.equal(api.composeLdCreateDesignIntent("", "Produce an evidence briefing"), "Produce an evidence briefing");
});

test("K: Research → Learning Design sync shows/populates the dropdown immediately", () => {
  assert.equal(typeof api.syncWorkflowFactoryLdCreateOutputTypeUi, "function");
  assert.equal(typeof api.refreshWfLdCreateOutputTypeElementRefs, "function");
  assert.match(
    source,
    /Choose what you are creating: Self-study resource or Workshop[\s\S]{0,250}syncWorkflowFactoryLdCreateOutputTypeUi\("learning-design"\)/
  );
  assert.match(source, /els\.wfLdCreateOutputType\.focus/);
});

test("L: Prompt Studio #outputType remains unchanged", () => {
  assert.match(indexHtml, /id="outputType"/);
  assert.match(indexHtml, /id="outputTypeGroup"/);
  const psSelect = indexHtml.match(/<select[^>]*id="outputType"[^>]*>([\s\S]*?)<\/select>/);
  assert.ok(psSelect, "Prompt Studio #outputType select must remain");
  assert.match(psSelect[1], /value="text"/);
  assert.match(psSelect[1], /value="image"/);
  assert.match(psSelect[1], /value="code"/);
  assert.match(psSelect[1], /value="structured"/);
  assert.doesNotMatch(psSelect[1], /self_study_resource|workshop/);
  assert.ok(indexHtml.indexOf('id="outputTypeGroup"') < indexHtml.indexOf('id="wfLdCreateOutputTypeGroup"'));
});

test("M: No Other / slideshow / assessment-pack Create options", () => {
  assert.doesNotMatch(indexHtml, /value="other"|value="slideshow"|value="slide_deck"|value="assessment_pack"/);
  const choiceLabels = api.LD_CREATE_OUTPUT_TYPE_CHOICES.map((c) => String(c.label).toLowerCase());
  assert.ok(!choiceLabels.some((l) => /other|slideshow|assessment|module|lesson|xerte|vle/.test(l)));
  assert.equal(api.normalizeLdCreateOutputType("assessment_pack"), "");
  assert.equal(api.normalizeLdCreateOutputType("other"), "");
});

test("N: Supporting fields, legacy briefs, and topology helpers remain intact", () => {
  const brief = {
    designIntent: "Create a self-study resource: photosynthesis basics",
    goal: "Create a self-study resource: photosynthesis basics",
    desiredOutputs: "short learning activities and a formative knowledge check",
    audience: "year 10 students",
    scopeScale: "45 minutes",
    selectedDomains: ["learning-design"],
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_SELF_STUDY
  };
  const explicit = api.mergeLdCreateOutputTypeIntoExplicitFactors(
    api.extractWorkflowBriefExplicitFactors(brief),
    brief.ldCreateOutputType
  );
  const resolved = resolveBrief(api, ldBriefConfig, brief);
  assert.equal(resolved.delivery_context, "self_directed");
  assert.equal(resolved.assessment_required, true);
  assert.equal(resolved.duration_minutes, 45);
  assert.equal(explicit.activities_required, true);

  const workshopSlides = {
    designIntent: "Create a workshop: peer instruction on climate change",
    goal: "Create a workshop: peer instruction on climate change",
    desiredOutputs: "learner handout and a short slide deck for the facilitator",
    audience: "undergraduates",
    scopeScale: "60-minute workshop",
    selectedDomains: ["learning-design"],
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_WORKSHOP
  };
  const wsResolved = resolveBrief(api, ldBriefConfig, workshopSlides);
  assert.ok(wsResolved.session_materials.includes("page"));
  assert.ok(wsResolved.session_materials.includes("slide_deck"));

  const legacyBrief = {
    goal:
      "create a one hour self-study session for undergraduate students based on uploaded transcript",
    designIntent:
      "create a one hour self-study session for undergraduate students based on uploaded transcript",
    inputs: "Uploaded lecture transcript on RNA viruses and hepatitis C (HCV).",
    desiredOutputs: "Learner-facing page",
    startingArtefact: "provided_source_content",
    selectedDomains: ["learning-design"]
  };
  assert.equal(api.buildWorkflowDesignBase(legacyBrief).ldCreateOutputType, "");

  assert.match(source, /function mergeLdCreateOutputTypeIntoExplicitFactors/);
  assert.match(source, /function applyLdCreateOutputTypePrimaryFactors/);
  assert.match(source, /out = applyLdCreateOutputTypePrimaryFactors\(out, b\)/);
  assert.doesNotMatch(source, /supportedOutputs|outputKinds|ldOutputTypeEnum/);
  assert.match(indexHtml, /wf-layout-spacer/);
  assert.match(indexHtml, /app\.js\?v=20260811-s75-d26d/);
});
