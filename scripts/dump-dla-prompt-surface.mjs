/**
 * Diagnostic: dump DLA prompt surfaces (harness path vs instructions path).
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const md = fs.readFileSync(
  path.join(repoRoot, "domains/learning-design/domain-learning-design-step-patterns.md"),
  "utf8"
);

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
    getAttribute() { return null; },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {}
  };
}

const sandbox = { console, setTimeout, clearTimeout, Promise, fetch: globalThis.fetch };
const elementStore = new Map();
const documentStub = {
  readyState: "complete",
  addEventListener: () => {},
  createElement: createElementStub,
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
  addEventListener: () => {},
  location: { hash: "", pathname: "/" },
  _: { debounce: (fn) => fn },
  Utils: { debounce: (fn) => fn },
  localStorage: { getItem: () => null, setItem: () => {} },
  URL: { createObjectURL: () => "", revokeObjectURL: () => "" },
  Blob: function Blob() {}
};
windowStub.window = windowStub;
sandbox.document = documentStub;
sandbox.window = windowStub;
vm.createContext(sandbox);
for (const f of [
  "sprint38-visual-affordances.js",
  "ld-table-fidelity.js",
  "ld-materials-copy.js",
  "ld-math-render.js",
  "ld-self-directed-rhetoric.js",
  "ld-design-page-compose-contract.js"
]) {
  vm.runInContext(fs.readFileSync(path.join(repoRoot, "lib", f), "utf8"), sandbox, { filename: f });
}
vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, { filename: "app.js" });
const api = sandbox.window.__PRISM_TEST_API;

const BRIEF = {
  goal: "Learner self-study inflation workshop",
  inputs: "First-year undergraduate economics (self-directed study)",
  desiredOutputs: "Learner-facing page",
  selectedDomains: ["learning-design"]
};

const cfgIdx = md.indexOf("### Workflow Brief Config");
const cfgFence = md.indexOf("```json", cfgIdx);
const cfgClose = md.indexOf("```", cfgFence + 7);
const wfCfg = JSON.parse(md.slice(cfgFence + 7, cfgClose).trim()).workflowBriefConfig;
const explicit = api.extractWorkflowBriefExplicitFactors(BRIEF);
const inferred = api.applyWorkflowBriefInferenceRules(wfCfg, BRIEF.goal, BRIEF.inputs);
const resolved = Object.assign(
  { delivery_context: "self_directed", learning_environments: ["self_study"] },
  api.resolveWorkflowBriefFactors(wfCfg, explicit, {}, inferred, BRIEF).resolved
);
const wf = {
  goal: BRIEF.goal,
  inputs: BRIEF.inputs,
  desiredOutputs: "learning_content, knowledge_model, learning_outcomes, learning_activities, activity_materials, page",
  workflowOutputs: ["page", "learning_activities", "activity_materials"],
  workflowOutputSpec: { goal: BRIEF.goal, desiredOutputs: BRIEF.desiredOutputs },
  workflowBriefResolution: { resolvedFactors: resolved }
};

function extractFactory(sectionHeading) {
  const idx = md.indexOf(sectionHeading);
  const fence = md.indexOf("```json", md.indexOf("### Prompt Factory", idx));
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim());
}

const factory = extractFactory("## 5. Design Learning Activities");
const step = {
  canonical_step_id: "step_design_learning_activities",
  canonical_title: "Design Learning Activities",
  title: "Design Learning Activities",
  outputName: "learning_activities"
};
const seeded = api.buildSeededStepPromptForWorkflowStep({
  workflowName: "Inflation EV-38L-AFTER",
  step,
  matchedPattern: { promptFactory: factory }
});
const augmented = api.applyWorkflowStepRuntimePromptAugmentations(seeded, step, wf, {});
const instructions = api.buildWorkflowStepInstructions(step, 4, null);

const markers = [
  "IFP-09",
  "IFP-10",
  "DLA-WB-26",
  "DLA-WB-27",
  "DLA-WB-28",
  "DLA-WB-29",
  "DLA-WB-30",
  "DLA-WB-31",
  "transfer_prompt",
  "depth_floor"
];

console.log(JSON.stringify({
  lengths: { seeded: seeded.length, augmented: augmented.length, instructions: instructions.length },
  markers: Object.fromEntries(
    markers.map((m) => [
      m,
      {
        seeded: seeded.includes(m),
        augmented: augmented.includes(m),
        instructions: instructions.includes(m)
      }
    ])
  ),
  exampleBlockThin:
    augmented.includes('"type": "text", "purpose": "Orienting extracts"') &&
    !augmented.includes('"type": "checklist"'),
  packTemplateHasChecklist: factory.promptTemplate.includes("DLA-WB-26"),
  has38LExampleNote: augmented.includes("38L mandatory rows not shown"),
  hasSelfDirectedExample: /self-directed activity json example/i.test(augmented)
}, null, 2));
