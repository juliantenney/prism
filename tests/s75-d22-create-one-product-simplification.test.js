/**
 * Sprint 75 — S75-D22 One workflow → one product; LD Create simplification.
 *
 * LD Create omits Supporting contents/materials + Scope/constraints.
 * Source material is conditional on Starting point.
 * Research retains Supporting + Constraints (no LD product picker).
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
const researchPatternsPath = path.join(
  repoRoot,
  "domains",
  "research",
  "domain-research-step-patterns.md"
);
const legacyWorkflowPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "educational-psychology-post-s68",
  "workflow.json"
);
const peNormalisePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "workflow-persistence-pass2",
  "pe-normalise-minimal.json"
);

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
}

function createElementStub(tagName = "div") {
  const classSet = new Set();
  const attrs = Object.create(null);
  return {
    tagName: String(tagName).toUpperCase(),
    value: "",
    checked: false,
    disabled: false,
    innerHTML: "",
    textContent: "",
    placeholder: "",
    className: "",
    classList: {
      add: (...names) => names.forEach((n) => classSet.add(String(n))),
      remove: (...names) => names.forEach((n) => classSet.delete(String(n))),
      contains: (name) => classSet.has(String(name)),
      toggle: (name, force) => {
        const key = String(name);
        if (force === true) {
          classSet.add(key);
          return true;
        }
        if (force === false) {
          classSet.delete(key);
          return false;
        }
        if (classSet.has(key)) {
          classSet.delete(key);
          return false;
        }
        classSet.add(key);
        return true;
      }
    },
    style: {},
    dataset: {},
    children: [],
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    setAttribute(name, value) {
      attrs[String(name)] = String(value);
      this[name] = value;
    },
    removeAttribute(name) {
      delete attrs[String(name)];
      delete this[name];
    },
    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(attrs, String(name))
        ? attrs[String(name)]
        : null;
    },
    hasAttribute(name) {
      return Object.prototype.hasOwnProperty.call(attrs, String(name));
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelector: () => createElementStub("div"),
    querySelectorAll: () => [],
    focus: () => {},
    click: () => {},
    scrollIntoView: () => {}
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const elementStore = new Map();
  const ensure = (id) => {
    if (!elementStore.has(id)) elementStore.set(id, createElementStub("div"));
    return elementStore.get(id);
  };
  [
    "wfDesignDesiredOutputsGroup",
    "wfDesignDesiredOutputs",
    "wfDesignDesiredOutputsLabel",
    "wfDesignDesiredOutputsHint",
    "wfDesignScopeConstraintsGroup",
    "wfDesignScopeConstraints",
    "wfDesignConstraintsHint",
    "wfDesignInputsGroup",
    "wfDesignInputs",
    "wfDesignInputsLabel",
    "wfDesignInputsHint",
    "wfDesignStartingArtefact",
    "wfLdCreateOutputTypeGroup",
    "wfLdCreateOutputType",
    "wfDesignBasicsIntro",
    "wfDesignIntentLabel",
    "wfDesignIntentHint",
    "wfDesignIntent",
    "wfDesignDomainSelect",
    "wfDesignScale",
    "wfDesignScaleLabel",
    "wfDesignScaleHint"
  ].forEach((id) => ensure(id));

  const documentStub = {
    readyState: "loading",
    addEventListener: () => {},
    createElement: (tag) => createElementStub(tag),
    getElementById: (id) => ensure(id),
    querySelector: () => createElementStub("div"),
    querySelectorAll: () => []
  };
  const windowStub = { document: documentStub };
  documentStub.defaultView = windowStub;
  windowStub.window = windowStub;
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    document: documentStub,
    window: windowStub
  };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api, source, elementStore, ensure };
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

function isGroupHidden(el) {
  return !!(el && (el.classList.contains("hidden") || el.hasAttribute("hidden")));
}

const { api, source, ensure } = loadPrismTestApi();
const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
const ldBriefConfig = api.normalizeWorkflowBriefConfig(
  extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"))
);
const researchBriefConfig = api.normalizeWorkflowBriefConfig(
  extractWorkflowBriefConfig(fs.readFileSync(researchPatternsPath, "utf8"))
);

test("A: LD Create no longer shows Supporting contents/materials as an active field", () => {
  assert.match(source, /ONE WORKFLOW → ONE PRODUCT \(S75-D22\)/);
  assert.match(
    source,
    /setWorkflowFactoryFormGroupHidden\(els\.wfDesignDesiredOutputsGroup, isLd\)/
  );
  api.refreshWfLdCreateOutputTypeElementRefs();
  api.syncWorkflowFactoryCreateProductFields("learning-design");
  assert.equal(isGroupHidden(ensure("wfDesignDesiredOutputsGroup")), true);
  assert.equal(ensure("wfDesignDesiredOutputs").value, "");
});

test("B: LD Create no longer shows Scope/constraints as an active field", () => {
  assert.match(
    source,
    /setWorkflowFactoryFormGroupHidden\(els\.wfDesignScopeConstraintsGroup, isLd\)/
  );
  api.refreshWfLdCreateOutputTypeElementRefs();
  api.syncWorkflowFactoryCreateProductFields("learning-design");
  assert.equal(isGroupHidden(ensure("wfDesignScopeConstraintsGroup")), true);
  assert.equal(ensure("wfDesignScopeConstraints").value, "");
});

test("C: Starting point = Generate from topic hides Source material (LD)", () => {
  api.syncWorkflowSelectedDomainsFromWorkflowRecord({
    selectedDomains: ["general", "learning-design"]
  });
  api.refreshWfLdCreateOutputTypeElementRefs();
  ensure("wfDesignStartingArtefact").value = "generate_from_topic";
  ensure("wfDesignInputs").value = "should clear";
  api.updateWorkflowFactoryInputsCopyFromStartingPoint();
  assert.equal(api.workflowFactoryStartingPointNeedsSourceDescription("generate_from_topic"), false);
  assert.equal(isGroupHidden(ensure("wfDesignInputsGroup")), true);
  assert.equal(ensure("wfDesignInputs").value, "");
});

test("D: Starting point = Use source material shows Source material (LD)", () => {
  api.syncWorkflowSelectedDomainsFromWorkflowRecord({
    selectedDomains: ["general", "learning-design"]
  });
  api.refreshWfLdCreateOutputTypeElementRefs();
  ensure("wfDesignStartingArtefact").value = "provided_source_content";
  api.updateWorkflowFactoryInputsCopyFromStartingPoint();
  assert.equal(
    api.workflowFactoryStartingPointNeedsSourceDescription("provided_source_content"),
    true
  );
  assert.equal(isGroupHidden(ensure("wfDesignInputsGroup")), false);
  assert.match(
    ensure("wfDesignInputsLabel").textContent,
    /What source material will you be working from\?/
  );
});

test("E: Starting point = Mix shows Source material (LD)", () => {
  api.syncWorkflowSelectedDomainsFromWorkflowRecord({
    selectedDomains: ["general", "learning-design"]
  });
  api.refreshWfLdCreateOutputTypeElementRefs();
  ensure("wfDesignStartingArtefact").value = "mixed";
  api.updateWorkflowFactoryInputsCopyFromStartingPoint();
  assert.equal(api.workflowFactoryStartingPointNeedsSourceDescription("mixed"), true);
  assert.equal(isGroupHidden(ensure("wfDesignInputsGroup")), false);
});

test("F: Source description still reaches brief/input-strategy heuristics", () => {
  const brief = {
    designIntent: "Create a self-study resource: RNA virus overview",
    goal: "Create a self-study resource: RNA virus overview",
    inputs: "Uploaded lecture transcript on RNA viruses",
    startingArtefact: "provided_source_content",
    audience: "undergraduates",
    scopeScale: "45 minutes",
    desiredOutputs: "",
    scopeConstraints: "",
    selectedDomains: ["learning-design"],
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_SELF_STUDY
  };
  const explicit = api.extractWorkflowBriefExplicitFactors(brief);
  assert.equal(explicit.input_strategy, "provided_source_content");
  const resolved = resolveBrief(api, ldBriefConfig, brief);
  assert.equal(resolved.input_strategy, "provided_source_content");
  assert.match(source, /You will supply it when you run the workflow/);
  assert.doesNotMatch(
    source,
    /wfDesignInputs[\s\S]{0,120}evidence_decision|evidence_decision[\s\S]{0,120}wfDesignInputs/
  );
});

test("G: C-06 Self-study coherent without desiredOutputs UI", () => {
  const brief = {
    designIntent: "Create a self-study resource: Managing Risk for programme managers",
    goal: "Create a self-study resource: Managing Risk for programme managers",
    desiredOutputs: "",
    audience: "programme managers",
    scopeScale: "60 minutes",
    inputs: "",
    selectedDomains: ["learning-design"],
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_SELF_STUDY
  };
  const resolved = resolveBrief(api, ldBriefConfig, brief);
  assert.equal(resolved.delivery_context, "self_directed");
  assert.equal(resolved.delivery_mode, "async");
  assert.equal(resolved.page_profile, "learner");
  assert.ok(Array.isArray(resolved.session_materials));
  assert.ok(resolved.session_materials.includes("page"));
});

test("H: C-06 Workshop coherent without desiredOutputs UI", () => {
  const brief = {
    designIntent: "Create a workshop: climate-change misconceptions discussion",
    goal: "Create a workshop: climate-change misconceptions discussion",
    desiredOutputs: "",
    audience: "undergraduate students",
    scopeScale: "90-minute workshop",
    inputs: "",
    selectedDomains: ["learning-design"],
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_WORKSHOP
  };
  const resolved = resolveBrief(api, ldBriefConfig, brief);
  assert.equal(resolved.delivery_mode, "live_workshop");
  assert.notEqual(resolved.delivery_context, "self_directed");
  assert.ok(Array.isArray(resolved.session_materials));
  assert.ok(resolved.session_materials.includes("page"));
});

test("I: Empty desiredOutputs compatibility path remains safe", () => {
  const brief = {
    designIntent: "Create a self-study resource: photosynthesis basics",
    goal: "Create a self-study resource: photosynthesis basics",
    desiredOutputs: "",
    audience: "year 10 students",
    scopeScale: "45 minutes",
    selectedDomains: ["learning-design"],
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_SELF_STUDY
  };
  const resolved = resolveBrief(api, ldBriefConfig, brief);
  assert.equal(resolved.delivery_context, "self_directed");
  assert.equal(resolved.duration_minutes, 45);
  assert.match(source, /desiredOutputs = ""/);
  assert.match(source, /desiredOutputsSeed = ""/);
});

test("J: Existing workflow fixtures with legacy desiredOutputs/workflowOutputs still load", () => {
  const legacy = JSON.parse(fs.readFileSync(legacyWorkflowPath, "utf8"));
  assert.ok(Object.prototype.hasOwnProperty.call(legacy, "workflowOutputs"));
  assert.ok(
    legacy.workflowBriefResolution &&
      legacy.workflowBriefResolution.initialBrief &&
      Object.prototype.hasOwnProperty.call(
        legacy.workflowBriefResolution.initialBrief,
        "desiredOutputs"
      )
  );
  const pe = JSON.parse(fs.readFileSync(peNormalisePath, "utf8"));
  assert.ok(
    pe.inputWorkflow && Object.prototype.hasOwnProperty.call(pe.inputWorkflow, "workflowOutputs")
  );
  // Compatibility: extractor still accepts legacy desiredOutputs when present.
  const withLegacy = {
    designIntent: "Create a workshop: peer instruction",
    goal: "Create a workshop: peer instruction",
    desiredOutputs: "learner handout and a short slide deck for the facilitator",
    audience: "undergraduates",
    scopeScale: "60-minute workshop",
    selectedDomains: ["learning-design"],
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_WORKSHOP
  };
  const resolved = resolveBrief(api, ldBriefConfig, withLegacy);
  assert.ok(resolved.session_materials.includes("page"));
  assert.ok(resolved.session_materials.includes("slide_deck"));
});

test("K: Duration in Scale/scope still resolves to duration_minutes", () => {
  const fromScale = api.extractWorkflowBriefExplicitFactors({
    designIntent: "Create a self-study resource: topic",
    goal: "Create a self-study resource: topic",
    scopeScale: "30 minutes",
    desiredOutputs: "",
    scopeConstraints: "",
    selectedDomains: ["learning-design"]
  });
  assert.equal(fromScale.duration_minutes, 30);
});

test("L: Constraint-like prose in What should this cover? remains visible to extraction", () => {
  const brief = {
    designIntent:
      "Managing Risk for programme managers; must use browser-based tools only; no face-to-face delivery",
    goal:
      "Create a self-study resource: Managing Risk for programme managers; must use browser-based tools only; no face-to-face delivery",
    desiredOutputs: "",
    scopeConstraints: "",
    audience: "programme managers",
    scopeScale: "60 minutes",
    selectedDomains: ["learning-design"],
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_SELF_STUDY
  };
  const explicit = api.extractWorkflowBriefExplicitFactors(brief);
  assert.match(String(explicit.design_intent || ""), /browser-based tools/);
  assert.equal(explicit.duration_minutes, 60);
  assert.match(indexHtml, /Describe the topic, purpose and anything important PRISM should take into account/);
});

test("M: Research retains Supporting + Constraints; objective_type still resolvable", () => {
  api.refreshWfLdCreateOutputTypeElementRefs();
  api.syncWorkflowFactoryCreateProductFields("research");
  assert.equal(isGroupHidden(ensure("wfDesignDesiredOutputsGroup")), false);
  assert.equal(isGroupHidden(ensure("wfDesignScopeConstraintsGroup")), false);

  api.syncWorkflowSelectedDomainsFromWorkflowRecord({
    selectedDomains: ["general", "research"]
  });
  ensure("wfDesignStartingArtefact").value = "generate_from_topic";
  api.updateWorkflowFactoryInputsCopyFromStartingPoint();
  // Research keeps source field visible even for topic generation.
  assert.equal(isGroupHidden(ensure("wfDesignInputsGroup")), false);

  const researchBrief = {
    designIntent: "Produce an evidence briefing on remote assessment policy",
    goal: "Produce an evidence briefing on remote assessment policy",
    desiredOutputs: "executive briefing",
    audience: "policy leads",
    scopeScale: "short briefing",
    inputs: "",
    selectedDomains: ["research"]
  };
  const resolved = resolveBrief(api, researchBriefConfig, researchBrief);
  assert.equal(resolved.objective_type, "briefing");
});

test("N: No new LD product options added", () => {
  assert.equal(api.LD_CREATE_OUTPUT_TYPE_CHOICES.length, 2);
  assert.equal(api.LD_CREATE_OUTPUT_TYPE_CHOICES[0].value, "self_study_resource");
  assert.equal(api.LD_CREATE_OUTPUT_TYPE_CHOICES[1].value, "workshop");
  assert.doesNotMatch(indexHtml, /value="slideshow"|value="assessment_pack"|value="module_outline"/);
  assert.match(indexHtml, /What source material will you be working from\?/);
  assert.match(indexHtml, /id="wfDesignDesiredOutputsGroup"/);
  assert.match(indexHtml, /id="wfDesignScopeConstraintsGroup"/);
});

test("O: DLA evidence behaviour unchanged / not wired from Create source", () => {
  assert.doesNotMatch(source, /wfDesignInputs[\s\S]{0,200}evidence_decision/);
  assert.doesNotMatch(source, /DLA[\s\S]{0,80}wfDesignInputs|wfDesignInputs[\s\S]{0,80}DLA/);
  assert.match(indexHtml, /this field does not upload or bind files automatically/);
});

test("P: Authoring Assemble remains page-primary / learner-ready (D13 contract intact)", () => {
  const assemblePath = path.join(repoRoot, "lib", "page-vnext-assemble.js");
  const assembleSrc = fs.readFileSync(assemblePath, "utf8");
  assert.match(assembleSrc, /function isLearnerReadyAssembledPage|isLearnerReadyAssembledPage\s*=/);
  const assemble = require(assemblePath);
  assert.equal(typeof assemble.isLearnerReadyAssembledPage, "function");
});

test("Q: Neighbouring C-05/C-06/C-07 contracts remain present", () => {
  assert.match(source, /ensureCreateWorkflowApiKeyPrerequisite|S75-D09/);
  assert.match(source, /LD_CREATE_OUTPUT_TYPE_SELF_STUDY|S75-D11/);
  assert.match(source, /setWorkflowMode\("run"\)|S75-D10/);
  assert.match(source, /getWorkflowRunUiStepDescription|S75-D08/);
});
