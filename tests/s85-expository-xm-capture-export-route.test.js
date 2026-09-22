/**
 * Sprint 85 — XM structured-material live export seam.
 *
 * Root cause of live `[object Object]`: capture rewrote Raw to a normalized
 * view that had already coerced object bodies via String(object). Assembly
 * preferRaw then fed poisoned string bodies into the ordinary text renderer,
 * bypassing expository-structured-materials (typeof body === "string" → null).
 *
 * Node module tests never exercised that capture → Raw → assemble → export path.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  injectLearnerRendererVNextInSandbox,
  wirePageVnextAssembleForTests
} = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturesDir = path.join(__dirname, "fixtures");

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

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
    getAttribute() {
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {},
    querySelector(sel) {
      return (this._qs && this._qs[sel]) || null;
    }
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
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
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem() {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    Blob: function Blob() {}
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(
    sandbox,
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat([
      "lib/expository-contracts.js",
      "lib/page-vnext-assemble.js"
    ])
  );
  wirePageVnextAssembleForTests(windowStub, repoRoot);
  injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  assert.ok(
    sandbox.window.PRISM_LEARNER_RENDERER_VNEXT,
    "export route requires browser learner renderer bundle"
  );
  assert.equal(
    typeof sandbox.window.PRISM_LEARNER_RENDERER_VNEXT.renderLearnerPageHtml,
    "function"
  );
  return { api, createElementStub };
}

const { api, createElementStub: createEl } = loadPrismTestApi();

function makeExpositoryWf() {
  return {
    id: "wf-expo-xm-export-route",
    name: "Create an Expository Resource: formative",
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_EXPOSITORY,
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true },
    steps: [
      {
        id: "ejp_step",
        title: "Expository Journey Plan",
        canonical_step_id: "step_expository_journey_plan",
        outputName: "expository_journey_plan"
      },
      {
        id: "xd_step",
        title: "Expository Development",
        canonical_step_id: "step_expository_development",
        outputName: "expository_development"
      },
      {
        id: "xm_step",
        title: "Expository Materials",
        canonical_step_id: "step_expository_materials",
        outputName: "expository_materials"
      },
      {
        id: "dp_step",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "page"
      }
    ]
  };
}

function buildRunLi(stepId, paste) {
  const li = createEl();
  li.getAttribute = (name) => (name === "data-step-id" ? stepId : null);
  const ta = createEl();
  ta.value = paste;
  const outName = createEl();
  outName.value = "expository_materials";
  const status = createEl();
  li._qs = {
    '[data-field="runStepOutput"]': ta,
    '[data-field="outputName"]': outName,
    '[data-role="run-step-output-status"]': status
  };
  return { li, ta };
}

function buildXdWithStructuredCommissions() {
  return {
    artifact_type: "expository_development",
    schema_version: "1.0.0",
    sections: [
      {
        section_id: "S2",
        explanation_intent: "Establish the loop.",
        exposition:
          "Formative assessment can be understood as a recurring relationship among intended learning, evidence, interpretation and action.",
        invitations_to_think: [],
        continuity_hooks: [],
        materials_commission: [
          {
            commission_id: "MC-S2-01",
            section_id: "S2",
            kind: "conceptual_diagram",
            intent: "loop figure"
          }
        ]
      },
      {
        section_id: "S5",
        explanation_intent: "Extend actors.",
        exposition:
          "Peers and learners can contribute judgement inside the same four-part loop without inventing new stages.",
        invitations_to_think: [],
        continuity_hooks: [],
        materials_commission: [
          {
            commission_id: "MC-S5-01",
            section_id: "S5",
            kind: "compact_worked_example",
            intent: "peer judgement example"
          }
        ]
      },
      {
        section_id: "S6",
        explanation_intent: "Return to the loop.",
        exposition:
          "Returning to the loop, judgement roles may enrich the same structure without a competing framework.",
        invitations_to_think: [],
        continuity_hooks: [],
        materials_commission: [
          {
            commission_id: "MC-S6-01",
            section_id: "S6",
            kind: "synthesis_diagram",
            intent: "integrated loop"
          }
        ]
      }
    ]
  };
}

function poisonedXmFromStructured(structured) {
  return {
    artifact_type: "expository_materials",
    schema_version: "1.0.0",
    materials: structured.materials.map((row) =>
      Object.assign({}, row, { body: "[object Object]" })
    )
  };
}

test("XM capture preserves operator paste object bodies on Raw (preferRaw seam)", () => {
  const wf = makeExpositoryWf();
  const xmStep = wf.steps[2];
  const structuredPaste = JSON.stringify(readJson("s85-expository-live-xm-structured.json"), null, 2);

  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({});
  api.setWorkflowRunCapturedOutputsRawForTest({});

  const { li } = buildRunLi(xmStep.id, structuredPaste);
  api.syncWorkflowRunCapturedOutputToState(li, { source: "user_input" });

  const rawMap = api.getWorkflowRunCapturedOutputsRawForTest() || {};
  const finalMap = api.getWorkflowRunCapturedOutputsForTest() || {};
  const storedRaw = String(rawMap[xmStep.id] || "");
  const storedFinal = String(finalMap[xmStep.id] || "");
  assert.ok(storedRaw.trim(), "Raw capture required for preferRaw assembly");
  assert.ok(storedFinal.trim(), "Final capture should still store normalized view");

  const rawParsed = JSON.parse(storedRaw);
  assert.equal(typeof rawParsed.materials[0].body, "object");
  assert.notEqual(rawParsed.materials[0].body, "[object Object]");
  assert.equal(Array.isArray(rawParsed.materials[0].body.elements), true);
  assert.equal(typeof rawParsed.materials[1].body, "object");
  assert.equal(rawParsed.materials[1].body.title, "Peer judgement inside the same loop");
  assert.equal(Array.isArray(rawParsed.materials[1].body.stages), true);
  assert.equal(rawParsed.materials[1].body.stages.length, 4);

  // Final may be pretty-printed/normalized, but must not coerce bodies either.
  const finalParsed = JSON.parse(storedFinal);
  assert.equal(typeof finalParsed.materials[0].body, "object");
  assert.notEqual(finalParsed.materials[0].body, "[object Object]");
});

test("poisoned Raw alone reproduces live [object Object] on standalone export route", () => {
  const wf = makeExpositoryWf();
  const structured = readJson("s85-expository-live-xm-structured.json");
  const poisoned = poisonedXmFromStructured(structured);
  const ejp = readJson("s85-expository-live-ejp.json");
  const xd = buildXdWithStructuredCommissions();
  const dp = Object.assign({}, readJson("s85-expository-dp-raw-paste.json"), {
    artifact_type: "page",
    schema_version: "2.0.0"
  });

  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    ejp_step: JSON.stringify(ejp),
    xd_step: JSON.stringify(xd),
    xm_step: JSON.stringify(poisoned),
    dp_step: JSON.stringify(dp)
  });
  api.setWorkflowRunCapturedOutputsRawForTest({
    ejp_step: JSON.stringify(ejp),
    xd_step: JSON.stringify(xd),
    xm_step: JSON.stringify(poisoned),
    dp_step: JSON.stringify(dp)
  });

  const exported = api.runUtilityPageExportPipelineForTest(dp, {
    workflow: wf,
    applyCompositionValidation: false
  });
  assert.equal(exported.error, null, exported.error || "");
  const html = String(exported.html || "");
  assert.match(html, /\[object Object\]/);
  assert.doesNotMatch(html, /Peer judgement inside the same loop/);
});

test("capture→Raw→assemble→standalone export: structured XM, zero [object Object]", () => {
  const wf = makeExpositoryWf();
  const xmStep = wf.steps[2];
  const structuredPaste = JSON.stringify(readJson("s85-expository-live-xm-structured.json"), null, 2);
  const ejp = readJson("s85-expository-live-ejp.json");
  const xd = buildXdWithStructuredCommissions();
  const dp = Object.assign({}, readJson("s85-expository-dp-raw-paste.json"), {
    artifact_type: "page",
    schema_version: "2.0.0"
  });

  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({});
  api.setWorkflowRunCapturedOutputsRawForTest({});

  // Capture XM through the live sync path (the evidenced seam).
  const { li } = buildRunLi(xmStep.id, structuredPaste);
  api.syncWorkflowRunCapturedOutputToState(li, { source: "user_input" });

  const rawMap = api.getWorkflowRunCapturedOutputsRawForTest() || {};
  const finalMap = api.getWorkflowRunCapturedOutputsForTest() || {};
  assert.ok(String(rawMap[xmStep.id] || "").trim());

  // Seed sibling stages; keep the XM Raw/Final from the capture sync above.
  api.setWorkflowRunCapturedOutputsForTest(
    Object.assign({}, finalMap, {
      ejp_step: JSON.stringify(ejp),
      xd_step: JSON.stringify(xd),
      dp_step: JSON.stringify(dp)
    })
  );
  api.setWorkflowRunCapturedOutputsRawForTest(
    Object.assign({}, rawMap, {
      ejp_step: JSON.stringify(ejp),
      xd_step: JSON.stringify(xd),
      dp_step: JSON.stringify(dp)
    })
  );

  const assembled = api.resolvePageForRenderOrAssembly(dp, wf, {});
  assert.ok(assembled && assembled.sections);
  const s5 = assembled.sections.find((s) => s.section_id === "S5");
  assert.ok(s5, "S5 section present after assembly");
  assert.equal(typeof s5.materials[0].body, "object");
  assert.equal(s5.materials[0].body.title, "Peer judgement inside the same loop");

  const exported = api.runUtilityPageExportPipelineForTest(dp, {
    workflow: wf,
    applyCompositionValidation: false
  });
  assert.equal(exported.error, null, exported.error || "");
  const html = String(exported.html || "");

  assert.doesNotMatch(html, /\[object Object\]/);
  assert.doesNotMatch(html, /AUTHOR-ONLY/);
  assert.doesNotMatch(html, /formal_notes/);

  // S5 compact worked example learner-facing structure
  assert.match(html, /Peer judgement inside the same loop/);
  assert.match(html, /students exchange draft abstracts/i);
  assert.match(html, /data-expository-structured="compact_worked_example"/);
  assert.match(html, /data-material-type="expository_compact_worked_example"/);

  // S2/S6 diagram treatment: caption companions, not text"[object Object]"
  assert.match(html, /data-expository-structured="diagram_caption"/);
  assert.match(html, /Evidence-to-action formative loop/);
  assert.match(html, /Integrated formative design loop/);
  assert.doesNotMatch(html, /Shapes what evidence is worth eliciting/);

  // Section graphics unchanged
  assert.match(html, /data-affordance-id="va-S2-evidence-action-01"/);
  assert.match(html, /data-affordance-id="va-S6-synthesis-01"/);

  // Ordinary text coercion path must not fire for structured bodies
  assert.doesNotMatch(
    html,
    /data-material-type="text"[^>]*>\s*<p>\[object Object\]<\/p>/
  );
  assert.match(html, /data-expository-structured=/);
});
