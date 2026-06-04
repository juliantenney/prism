/**
 * One-off probe for 38B-1 — Design Page prompt size (audit only).
 * Run: node scripts/probe-38b1-design-page-prompt-size.js
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const repoRoot = path.resolve(__dirname, "..");
const md = fs.readFileSync(
  path.join(repoRoot, "domains", "learning-design", "domain-learning-design-step-patterns.md"),
  "utf8"
);
const section = md.match(
  /## 13\. Design Page[\s\S]*?### Prompt Factory\s*```json\s*([\s\S]*?)\s*```/
);
if (!section) throw new Error("Design Page Prompt Factory not found");
const factory = JSON.parse(section[1].trim());

const sandbox = {
  console,
  setTimeout,
  clearTimeout,
  Promise,
  _: { debounce: (fn) => fn }
};
function createElementStub() {
  const el = {
    value: "",
    textContent: "",
    className: "",
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => false },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
    focus: () => {},
    click: () => {}
  };
  return el;
}
const elementStore = new Map();
const documentStub = {
  readyState: "complete",
  addEventListener: () => {},
  createElement: () => createElementStub(),
  getElementById: (id) => {
    if (!elementStore.has(id)) elementStore.set(id, createElementStub());
    return elementStore.get(id);
  },
  querySelector: () => createElementStub(),
  querySelectorAll: () => [],
  body: { appendChild: () => {}, removeChild: () => {} }
};
const windowStub = {
  document: documentStub,
  addEventListener: () => {},
  location: { hash: "", pathname: "/" },
  _: sandbox._,
  Utils: { debounce: (fn) => fn },
  localStorage: { getItem: () => null, setItem: () => {} },
  URL: { createObjectURL: () => "", revokeObjectURL: () => {} },
  Blob: function Blob() {},
  Library: {
    importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
    getAllPrompts: () => Promise.resolve([])
  }
};
windowStub.window = windowStub;
sandbox.window = windowStub;
sandbox.document = documentStub;
vm.createContext(sandbox);
vm.runInContext(
  fs.readFileSync(path.join(repoRoot, "lib", "sprint38-visual-affordances.js"), "utf8"),
  sandbox,
  { filename: "sprint38-visual-affordances.js" }
);
vm.runInContext(
  fs.readFileSync(path.join(repoRoot, "lib", "ld-table-fidelity.js"), "utf8"),
  sandbox,
  { filename: "ld-table-fidelity.js" }
);
vm.runInContext(
  fs.readFileSync(path.join(repoRoot, "lib", "ld-materials-copy.js"), "utf8"),
  sandbox,
  { filename: "ld-materials-copy.js" }
);
vm.runInContext(
  fs.readFileSync(path.join(repoRoot, "lib", "ld-math-render.js"), "utf8"),
  sandbox,
  { filename: "ld-math-render.js" }
);
vm.runInContext(
  fs.readFileSync(path.join(repoRoot, "lib", "ld-self-directed-rhetoric.js"), "utf8"),
  sandbox,
  { filename: "ld-self-directed-rhetoric.js" }
);
vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, {
  filename: "app.js"
});
const api = sandbox.window.__PRISM_TEST_API;
if (!api) throw new Error("__PRISM_TEST_API missing");

const wfSelfDirected = {
  goal: "Learner self-study inflation workshop",
  desiredOutputs: "Learner-facing page",
  workflowOutputs: ["page"],
  workflowBriefResolution: {
    resolvedFactors: {
      delivery_context: "self_directed",
      learning_environments: ["self_study"]
    }
  }
};
const wfGeneric = {
  goal: "Inflation workshop page",
  desiredOutputs: "Learner-facing page",
  workflowOutputs: ["page"]
};
const step = {
  canonical_step_id: "step_design_page",
  title: "Design Page",
  outputName: "page"
};

function measure(label, wf) {
  const seeded = api.buildSeededStepPromptForWorkflowStep({
    workflowName: "Inflation workshop",
    step,
    matchedPattern: { promptFactory: factory }
  });
  const augmented = api.applyWorkflowStepRuntimePromptAugmentations(
    seeded,
    step,
    wf,
    {}
  );
  const markers = (augmented.match(/\(auto-applied\)/gi) || []).length;
  const blocks = [];
  const re =
    /(?:^|\n)([^\n]+ \(auto-applied\)):/gi;
  let m;
  while ((m = re.exec(augmented)) !== null) blocks.push(m[1].trim());
  return {
    label,
    seededChars: seeded.length,
    augmentedChars: augmented.length,
    deltaChars: augmented.length - seeded.length,
    autoAppliedMarkerCount: markers,
    blockTitles: [...new Set(blocks)]
  };
}

const packOnly = {
  promptTemplate: (factory.promptTemplate || "").length,
  defaultPromptNotes: (factory.defaultPromptNotes || "").length,
  promptTemplatePlusNotes:
    (factory.promptTemplate || "").length + (factory.defaultPromptNotes || "").length
};

const blocks = {
  materialsFidelity: api.buildDesignPageActivityMaterialsFidelityPromptBlock().length,
  sprint38: api.buildSprint38VisualAffordanceDesignPagePromptBlock().length,
  pelOrientation: api.buildPelOrientationContractPromptBlock().length,
  math: api.buildLdMathRenderPromptBlock().length
};

console.log(
  JSON.stringify(
    { packOnly, runtimeBlocks: blocks, scenarios: [measure("self_directed", wfSelfDirected), measure("generic_workshop", wfGeneric)] },
    null,
    2
  )
);
