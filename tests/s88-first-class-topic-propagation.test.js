/**
 * Sprint 88 — first-class topic survives into Generate Learning Content execution.
 *
 * Run-mode prompt assembly gathers editable step fields and must still see the
 * frozen Create brief, where commissioned Topic is stored.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const TOPIC = "Introduction to Bayes theorem";
const AUDIENCE = "University staff/postgraduates with little formal statistics";
const ADJUSTED = "Sampling distributions";

function createClassList(initial) {
  const set = new Set(initial || []);
  return {
    add(name) {
      set.add(String(name));
    },
    remove(name) {
      set.delete(String(name));
    },
    contains(name) {
      return set.has(String(name));
    },
    toggle(name, force) {
      const key = String(name);
      const on = force === undefined ? !set.has(key) : !!force;
      if (on) set.add(key);
      else set.delete(key);
      return on;
    }
  };
}

function createElementStub(id) {
  return {
    id: id || "",
    value: "",
    textContent: "",
    classList: createClassList(),
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    },
    addEventListener() {},
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    }
  };
}

function makeStepElement(step) {
  const fields = {
    title: step.title,
    roleLabel: "",
    promptId: "",
    inputKind: "text",
    outputName: step.outputName || "",
    notes: ""
  };
  return {
    classList: createClassList(["workflow-step"]),
    getAttribute(name) {
      if (name === "data-step-id") return step.id;
      if (name === "data-canonical-step-id") return step.canonical_step_id;
      if (name === "data-prompt-source") return "local_override";
      return null;
    },
    querySelector(sel) {
      const match = String(sel || "").match(/\[data-field="([^"]+)"\]/);
      if (!match || !Object.prototype.hasOwnProperty.call(fields, match[1])) return null;
      return {
        value: fields[match[1]],
        hasAttribute() {
          return false;
        },
        getAttribute() {
          return null;
        }
      };
    },
    querySelectorAll() {
      return [];
    },
    hasAttribute() {
      return false;
    }
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const byId = {};
  ["workflowDetail", "workflowModeRunBtn", "workflowModeEditBtn", "workflowModeSettingsBtn"].forEach(
    (id) => {
      byId[id] = createElementStub(id);
    }
  );
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!byId[id]) byId[id] = createElementStub(id);
      return byId[id];
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    location: { hash: "", pathname: "/" },
    localStorage: { getItem: () => null, setItem() {} },
    _: sandbox._,
    Utils: { debounce: (fn) => fn, uuid: () => "uuid-fixed" }
  };
  sandbox.fetch = function () {
    return Promise.reject(new Error("fetch must not be called"));
  };
  windowStub.fetch = sandbox.fetch;
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return { api: sandbox.window.__PRISM_TEST_API, byId };
}

function firstClassWorkflow(id, product) {
  return {
    id: id,
    name: "Bayes pack",
    product: product,
    ldCreateOutputType: product === "assessment_pack" ? "assessment_pack" : "self_study_resource",
    startingPoint: "topic",
    selectedDomains: ["general", "learning-design"],
    workflowOutputSpec: { audience: AUDIENCE, goal: TOPIC },
    workflowBriefResolution: {
      initialBrief: {
        goal: TOPIC,
        designIntent: TOPIC,
        audience: AUDIENCE,
        topic: TOPIC
      },
      resolvedFactors: { topic: TOPIC, audience: AUDIENCE },
      askedFactors: [],
      inferredFactors: {},
      mappedBindings: {},
      missing: []
    },
    steps: [
      {
        id: "glc",
        title: "Generate Learning Content",
        canonical_step_id: "step_generate_learning_content",
        outputName: "learning_content",
        override_prompt_body: "If source_material is not provided, generate content from topic, audience, and level"
      }
    ]
  };
}

function glcExecutionContext(api, byId, workflow) {
  api.setWorkflowsForTest([workflow]);
  api.setSelectedWorkflowIdForTest(workflow.id);
  api.setWorkflowStepElementsForTest(workflow.steps.map(makeStepElement));
  byId.workflowDetail.classList.add("run-mode");
  const resolved = api.resolveWorkflowForUpstreamArtefacts({});
  const step = workflow.steps[0];
  return {
    resolved: resolved,
    block: api.buildEffectiveWorkflowContextBlock(resolved, step),
    prompt: api.buildWorkflowStepInstructions(step, 0, null)
  };
}

test("first-class topic survives run-mode execution context for Generate Learning Content", () => {
  const { api, byId } = loadPrismTestApi();
  const assessment = glcExecutionContext(api, byId, firstClassWorkflow("pack", "assessment_pack"));
  assert.match(assessment.block, /Authoritative workflow parameters for this run:/);
  assert.match(assessment.block, new RegExp("Topic: " + TOPIC));
  assert.match(assessment.block, new RegExp("Audience: " + AUDIENCE));
  assert.match(assessment.prompt, new RegExp("Topic: " + TOPIC));
  assert.equal(assessment.resolved.workflowBriefResolution.resolvedFactors.topic, TOPIC);

  const interactive = glcExecutionContext(api, byId, firstClassWorkflow("interactive", "interactive"));
  assert.match(interactive.block, new RegExp("Topic: " + TOPIC));
  assert.match(interactive.prompt, new RegExp("Topic: " + TOPIC));
});

test("an explicit Topic adjustment still outranks the commissioned topic", () => {
  const { api, byId } = loadPrismTestApi();
  const workflow = firstClassWorkflow("pack", "assessment_pack");
  workflow.adjustments = { version: 1, parameters: { topic: ADJUSTED } };
  const result = glcExecutionContext(api, byId, workflow);
  assert.match(result.block, new RegExp("Topic: " + ADJUSTED));
  assert.doesNotMatch(result.block, new RegExp("Topic: " + TOPIC));
  assert.equal(result.resolved.workflowBriefResolution.resolvedFactors.topic, TOPIC);
});
