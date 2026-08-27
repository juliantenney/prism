/**
 * Sprint 80 S1 — Adjustments: typed workflow-parameter registry + resolver.
 *
 * Proves: declaration validation; workflow.adjustments persistence and
 * carry-forward; historical workflows load unchanged; absence means Auto;
 * the resolver is deterministic (no AI/fetch) and mutates nothing; no new
 * [PRISM_STEP_PARAMS] authority; the registry alone changes no prompt text.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add() {},
      remove() {},
      contains() {
        return false;
      },
      toggle() {
        return false;
      }
    },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    hasAttribute() {
      return false;
    },
    getAttribute() {
      return null;
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {}
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const fetchCalls = [];
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    localStorage: { getItem: () => null, setItem() {} },
    _: sandbox._,
    Utils: { debounce: (fn) => fn, uuid: () => "uuid-fixed" }
  };
  // Any network attempt during resolution is a failure, so record instead of throw.
  sandbox.fetch = function (...args) {
    fetchCalls.push(args);
    return Promise.reject(new Error("fetch must not be called"));
  };
  windowStub.fetch = sandbox.fetch;
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return { api: sandbox.window.__PRISM_TEST_API, sandbox, fetchCalls };
}

const loaded = loadPrismTestApi();
const api = loaded.api;

// Values constructed inside the vm sandbox carry that realm's prototypes, which
// deepStrictEqual rejects. Compare structurally instead.
function plain(value) {
  return JSON.parse(JSON.stringify(value === undefined ? null : value));
}

const VALID_DECLARATION = {
  id: "sample_topic",
  label: "Sample topic",
  help: "Test-only declaration.",
  type: "text",
  owner: "runtime_context",
  projection: "workflowContext"
};

function resetRegistry() {
  api.setAdjustmentsRegistryForTest([]);
}

// ---------------------------------------------------------------------------
// 1. Registry declaration validation
// ---------------------------------------------------------------------------

test("S1: valid declaration passes validation and normalizes", () => {
  const verdict = api.validateAdjustmentsParameterDeclaration(VALID_DECLARATION);
  assert.equal(verdict.ok, true);
  assert.deepEqual(plain(verdict.errors), []);

  const row = api.normalizeAdjustmentsParameterDeclaration(VALID_DECLARATION);
  assert.equal(row.id, "sample_topic");
  assert.equal(row.label, "Sample topic");
  assert.equal(row.type, "text");
  assert.equal(row.owner, "runtime_context");
  assert.equal(row.projection, "workflowContext");
  // Applicability defaults to always-on.
  assert.deepEqual(plain(row.applicability), { always: true });
});

test("S1: declaration validation rejects each malformed shape", () => {
  const cases = [
    [{}, "id is required"],
    [Object.assign({}, VALID_DECLARATION, { id: "Bad-Id" }), "id must be lower_snake_case"],
    [Object.assign({}, VALID_DECLARATION, { label: "" }), "label is required"],
    [Object.assign({}, VALID_DECLARATION, { type: "" }), "type is required"],
    [Object.assign({}, VALID_DECLARATION, { type: "colour" }), "unsupported type: colour"],
    [
      Object.assign({}, VALID_DECLARATION, { type: "enum", options: [] }),
      "enum type requires options"
    ],
    [Object.assign({}, VALID_DECLARATION, { owner: "" }), "owner is required"],
    [Object.assign({}, VALID_DECLARATION, { projection: "" }), "projection is required"],
    [
      Object.assign({}, VALID_DECLARATION, { projection: "everywhere" }),
      "unsupported projection: everywhere"
    ],
    [
      Object.assign({}, VALID_DECLARATION, { type: "number", min: 10, max: 5 }),
      "min must not exceed max"
    ],
    [
      Object.assign({}, VALID_DECLARATION, { validate: "not-a-function" }),
      "validate must be a function when provided"
    ]
  ];
  cases.forEach(([declaration, expectedError]) => {
    const verdict = api.validateAdjustmentsParameterDeclaration(declaration);
    assert.equal(verdict.ok, false, "expected rejection for: " + expectedError);
    assert.ok(
      verdict.errors.includes(expectedError),
      "expected error '" + expectedError + "', got " + JSON.stringify(verdict.errors)
    );
    assert.equal(api.normalizeAdjustmentsParameterDeclaration(declaration), null);
  });
});

test("S1: enum and number values are validated against their declaration", () => {
  const enumDeclaration = api.normalizeAdjustmentsParameterDeclaration({
    id: "sample_mode",
    label: "Sample mode",
    type: "enum",
    options: ["alpha", "beta"],
    owner: "stage",
    projection: "stepScoped"
  });
  assert.equal(api.validateAdjustmentsParameterValue(enumDeclaration, "alpha").ok, true);
  assert.equal(api.validateAdjustmentsParameterValue(enumDeclaration, "gamma").ok, false);
  assert.equal(api.validateAdjustmentsParameterValue(enumDeclaration, "").ok, false);

  const numberDeclaration = api.normalizeAdjustmentsParameterDeclaration({
    id: "sample_minutes",
    label: "Sample minutes",
    type: "number",
    min: 10,
    max: 60,
    owner: "stage",
    projection: "stepScoped"
  });
  assert.equal(api.validateAdjustmentsParameterValue(numberDeclaration, 30).value, 30);
  assert.equal(api.validateAdjustmentsParameterValue(numberDeclaration, "45").value, 45);
  assert.equal(api.validateAdjustmentsParameterValue(numberDeclaration, 5).ok, false);
  assert.equal(api.validateAdjustmentsParameterValue(numberDeclaration, 90).ok, false);
  assert.equal(api.validateAdjustmentsParameterValue(numberDeclaration, "abc").ok, false);
});

// S2 declares the first live parameter. The registry stays a deliberate
// allowlist, so this asserts the exact shipped set rather than a count.
test("S1: shipped registry is a deliberate allowlist", () => {
  const fresh = loadPrismTestApi();
  const ids = fresh.api.getAdjustmentsParameterRegistry().map((row) => row.id);
  // S80-S5 adds Goal; S80-S6 adds Duration, the first number-typed parameter;
  // S80-S7 adds Audience.
  assert.deepEqual(plain(ids), ["topic", "goal", "duration_minutes", "audience"]);
  // A workflow with no commissioned topic and no adjustment resolves nothing.
  assert.deepEqual(plain(fresh.api.resolveEffectiveRunContext({ id: "wf" }).parameters), {});
});

test("S1: capability-gated applicability fails closed until a resolver exists", () => {
  const gated = api.normalizeAdjustmentsParameterDeclaration({
    id: "sample_items",
    label: "Sample items",
    type: "number",
    applicability: { requiresCapability: "assessment" },
    owner: "stage",
    projection: "stepScoped"
  });
  assert.deepEqual(plain(gated.applicability), { requiresCapability: "assessment" });
  assert.equal(api.isAdjustmentsParameterApplicable(gated, { id: "wf" }), false);

  api.setAdjustmentsCapabilityResolverForTest("assessment", () => true);
  assert.equal(api.isAdjustmentsParameterApplicable(gated, { id: "wf" }), true);
  api.setAdjustmentsCapabilityResolverForTest("assessment", null);
  assert.equal(api.isAdjustmentsParameterApplicable(gated, { id: "wf" }), false);
});

// ---------------------------------------------------------------------------
// 2 + 3. Persistence and historical workflows
// ---------------------------------------------------------------------------

test("S1: workflow.adjustments persists through normalization", () => {
  api.setAdjustmentsRegistryForTest([VALID_DECLARATION]);
  const normalized = api.normalizeWorkflowForV1(
    {
      id: "wf-adjust",
      name: "Adjust",
      steps: [],
      adjustments: { version: 1, parameters: { sample_topic: "Elizabeth I" } }
    },
    []
  );
  assert.equal(normalized.adjustments.version, api.ADJUSTMENTS_STATE_VERSION);
  assert.equal(normalized.adjustments.parameters.sample_topic, "Elizabeth I");
  resetRegistry();
});

test("S1: unknown and invalid stored parameters are dropped, not retained", () => {
  api.setAdjustmentsRegistryForTest([VALID_DECLARATION]);
  const normalized = api.normalizeWorkflowForV1(
    {
      id: "wf-unknown",
      name: "Unknown",
      steps: [],
      adjustments: {
        version: 1,
        parameters: {
          sample_topic: "Kept",
          // A retired historical control must not gain authority via Adjustments.
          include_examples: "yes",
          difficulty_profile: "higher_order"
        }
      }
    },
    []
  );
  assert.deepEqual(plain(Object.keys(normalized.adjustments.parameters)), ["sample_topic"]);
  resetRegistry();
});

test("S1: empty adjustments are omitted rather than stored as a container", () => {
  assert.equal(api.normalizeWorkflowAdjustments(null), null);
  assert.equal(api.normalizeWorkflowAdjustments({ version: 1, parameters: {} }), null);

  const normalized = api.normalizeWorkflowForV1(
    { id: "wf-empty", name: "Empty", steps: [], adjustments: { version: 1, parameters: {} } },
    []
  );
  assert.equal(
    Object.prototype.hasOwnProperty.call(normalized, "adjustments"),
    false,
    "empty adjustments must not persist an empty container"
  );
});

test("S1: historical workflow without adjustments loads unchanged", () => {
  const legacy = {
    id: "wf-legacy",
    name: "Legacy",
    steps: [{ id: "s1", title: "Model Knowledge", outputName: "knowledge_model" }],
    workflowBriefResolution: { resolvedFactors: { duration_minutes: 60 } }
  };
  const normalized = api.normalizeWorkflowForV1(JSON.parse(JSON.stringify(legacy)), []);
  assert.equal(Object.prototype.hasOwnProperty.call(normalized, "adjustments"), false);
  assert.equal(normalized.id, "wf-legacy");
  assert.equal(normalized.steps.length, 1);
  // Commissioning history is untouched by the new field.
  assert.equal(normalized.workflowBriefResolution.resolvedFactors.duration_minutes, 60);
  // And such a workflow resolves cleanly.
  assert.deepEqual(plain(api.resolveEffectiveRunContext(normalized).parameters), {});
});

test("S1: gather carries persisted adjustments forward instead of dropping them", () => {
  api.setAdjustmentsRegistryForTest([VALID_DECLARATION]);
  const wf = {
    id: "wf-carry",
    name: "Carry",
    steps: [],
    adjustments: { version: 1, parameters: { sample_topic: "Henry VIII" } }
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const gathered = api.gatherWorkflowDetailFormDataForTest();
  assert.equal(
    gathered.adjustments.parameters.sample_topic,
    "Henry VIII",
    "save must not silently discard Adjustments because there is no editor yet"
  );
  resetRegistry();
});

test("S1: gather emits no adjustments key when none are stored", () => {
  const wf = { id: "wf-none", name: "None", steps: [] };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const gathered = api.gatherWorkflowDetailFormDataForTest();
  assert.equal(Object.prototype.hasOwnProperty.call(gathered, "adjustments"), false);
});

// ---------------------------------------------------------------------------
// 4 + 6. Auto semantics and immutability
// ---------------------------------------------------------------------------

test("S1: absence means Auto and falls back to commissioned state", () => {
  api.setAdjustmentsRegistryForTest([
    Object.assign({}, VALID_DECLARATION, {
      resolveCommissioned: (wf) =>
        (wf.workflowBriefResolution &&
          wf.workflowBriefResolution.resolvedFactors &&
          wf.workflowBriefResolution.resolvedFactors.topic) ||
        ""
    })
  ]);

  const commissioned = {
    id: "wf-auto",
    workflowBriefResolution: { resolvedFactors: { topic: "Commissioned topic" } }
  };
  const autoContext = api.resolveEffectiveRunContext(commissioned);
  assert.equal(autoContext.parameters.sample_topic, "Commissioned topic");
  assert.equal(autoContext.provenance.sample_topic, "commissioned");

  const explicit = Object.assign({}, commissioned, {
    adjustments: { version: 1, parameters: { sample_topic: "Author topic" } }
  });
  const explicitContext = api.resolveEffectiveRunContext(explicit);
  assert.equal(explicitContext.parameters.sample_topic, "Author topic");
  assert.equal(explicitContext.provenance.sample_topic, "adjustment");

  // An invalid stored value must not defeat the commissioned fallback.
  const invalid = Object.assign({}, commissioned, {
    adjustments: { version: 1, parameters: { sample_topic: "   " } }
  });
  assert.equal(api.resolveEffectiveRunContext(invalid).provenance.sample_topic, "commissioned");

  // No commissioned source at all reports absent rather than inventing a value.
  const bare = api.resolveEffectiveRunContext({ id: "wf-bare" });
  assert.equal(bare.provenance.sample_topic, "absent");
  assert.equal(
    Object.prototype.hasOwnProperty.call(bare.parameters, "sample_topic"),
    false
  );
  resetRegistry();
});

test("S1: resolver does not mutate the workflow or resolvedFactors", () => {
  api.setAdjustmentsRegistryForTest([
    Object.assign({}, VALID_DECLARATION, {
      resolveCommissioned: (wf) => wf.workflowBriefResolution.resolvedFactors.topic
    })
  ]);
  const wf = {
    id: "wf-immutable",
    adjustments: { version: 1, parameters: { sample_topic: "Author topic" } },
    workflowBriefResolution: {
      resolvedFactors: { topic: "Original topic", duration_minutes: 60 },
      resolvedSources: { topic: "explicit" }
    }
  };
  const before = JSON.stringify(wf);
  api.resolveEffectiveRunContext(wf);
  assert.equal(JSON.stringify(wf), before, "resolver must be side-effect free");
  assert.equal(wf.workflowBriefResolution.resolvedFactors.topic, "Original topic");
  resetRegistry();
});

// ---------------------------------------------------------------------------
// 5 + 7 + 8. No AI, no legacy authority, no prompt change
// ---------------------------------------------------------------------------

test("S1: resolver performs no AI/fetch call", () => {
  const fresh = loadPrismTestApi();
  fresh.api.setAdjustmentsRegistryForTest([
    Object.assign({}, VALID_DECLARATION, {
      resolveCommissioned: () => "Commissioned"
    })
  ]);
  fresh.api.resolveEffectiveRunContext({
    id: "wf-no-fetch",
    adjustments: { version: 1, parameters: { sample_topic: "Author" } }
  });
  fresh.api.resolveEffectiveRunContext({ id: "wf-no-fetch-2" });
  assert.deepEqual(fresh.fetchCalls, [], "resolver must not issue any network request");
});

test("S1: adjustments introduce no PRISM_STEP_PARAMS write", () => {
  api.setAdjustmentsRegistryForTest([VALID_DECLARATION]);
  const normalized = api.normalizeWorkflowForV1(
    {
      id: "wf-no-params",
      name: "No params",
      notes: "Workflow notes",
      steps: [{ id: "s1", title: "Model Knowledge", notes: "Step notes" }],
      adjustments: { version: 1, parameters: { sample_topic: "Topic" } }
    },
    []
  );
  assert.doesNotMatch(String(normalized.notes || ""), /PRISM_STEP_PARAMS/);
  normalized.steps.forEach((step) => {
    assert.doesNotMatch(String(step.notes || ""), /PRISM_STEP_PARAMS/);
  });
  // The stored value lives only in the dedicated container.
  assert.equal(
    JSON.stringify(normalized).indexOf("PRISM_STEP_PARAMS"),
    -1,
    "no part of the persisted record may carry a step-param block"
  );
  resetRegistry();
});

test("S1: registry declaration alone changes no assembled prompt text", () => {
  const wf = {
    id: "wf-prompt-neutral",
    goal: "Registry neutrality",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true },
    steps: [
      {
        id: "mk_step",
        title: "Model Knowledge",
        outputName: "knowledge_model",
        canonical_step_id: "step_model_knowledge",
        prompt_source_type: "local_override",
        override_prompt_body: "Model the knowledge for this topic."
      }
    ]
  };
  api.setWorkflowsForTest([JSON.parse(JSON.stringify(wf))]);
  api.setSelectedWorkflowIdForTest(wf.id);

  resetRegistry();
  const baseline = api.buildWorkflowStepInstructions(wf.steps[0], 1, null);

  // A parameter whose projection strategy is not yet implemented must stay
  // inert. S2 implements `workflowContext`; `stepScoped` remains unimplemented,
  // so it is the honest subject for this claim.
  const STEP_SCOPED_DECLARATION = {
    id: "sample_minutes",
    label: "Sample minutes",
    type: "number",
    min: 10,
    max: 60,
    owner: "stage",
    projection: "stepScoped"
  };
  api.setAdjustmentsRegistryForTest([STEP_SCOPED_DECLARATION]);
  const withRegistry = api.buildWorkflowStepInstructions(wf.steps[0], 1, null);
  assert.equal(withRegistry, baseline, "registry declarations must be prompt-neutral");

  // Even a stored value is inert until a slice implements its projection.
  const wfWithValue = JSON.parse(JSON.stringify(wf));
  wfWithValue.adjustments = { version: 1, parameters: { sample_minutes: 42 } };
  api.setWorkflowsForTest([wfWithValue]);
  api.setSelectedWorkflowIdForTest(wfWithValue.id);
  const withValue = api.buildWorkflowStepInstructions(wfWithValue.steps[0], 1, null);
  assert.equal(withValue, baseline, "an unimplemented projection must not reach a prompt");
  assert.doesNotMatch(withValue, /42/);
  resetRegistry();
});
