/**
 * 38B-1 — LD priority workflow prompt size audit (documentation probe).
 * Run: node scripts/probe-38b1-ld-workflow-prompt-audit.js
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const repoRoot = path.resolve(__dirname, "..");
const md = fs.readFileSync(
  path.join(repoRoot, "domains", "learning-design", "domain-learning-design-step-patterns.md"),
  "utf8"
);

const STEP_SPECS = [
  { key: "model_knowledge", heading: "## 3. Model Knowledge", canonical: "step_model_knowledge", title: "Model Knowledge", outputName: "knowledge_model" },
  { key: "define_outcomes", heading: "## 4. Define Learning Outcomes", canonical: "step_define_learning_outcomes", title: "Define Learning Outcomes", outputName: "learning_outcomes" },
  { key: "dla", heading: "## 5. Design Learning Activities", canonical: "step_design_learning_activities", title: "Design Learning Activities", outputName: "learning_activities" },
  { key: "gam", heading: "## 6. Generate Activity Materials", canonical: "step_generate_activity_materials", title: "Generate Activity Materials", outputName: "activity_materials" },
  { key: "assessment_items", heading: "## 9. Generate Assessment Items", canonical: "step_generate_assessment_items", title: "Generate Assessment Items", outputName: "assessment_items" },
  { key: "sequence", heading: "## 10. Construct Learning Sequence", canonical: "step_construct_learning_sequence", title: "Construct Learning Sequence", outputName: "learning_sequence" },
  { key: "design_page", heading: "## 13. Design Page", canonical: "step_design_page", title: "Design Page", outputName: "page" }
];

function extractFactory(heading) {
  const re = new RegExp(
    heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
      "[\\s\\S]*?### Prompt Factory\\s*```json\\s*([\\s\\S]*?)\\s*```"
  );
  const m = md.match(re);
  if (!m) throw new Error("Prompt Factory not found for " + heading);
  return JSON.parse(m[1].trim());
}

function createElementStub() {
  return {
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
const sandbox = {
  console,
  setTimeout,
  clearTimeout,
  Promise,
  _: { debounce: (fn) => fn }
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
vm.runInContext(
  fs.readFileSync(path.join(repoRoot, "lib", "ld-design-page-compose-contract.js"), "utf8"),
  sandbox,
  { filename: "ld-design-page-compose-contract.js" }
);
vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, { filename: "app.js" });
const api = sandbox.window.__PRISM_TEST_API;
if (!api) throw new Error("__PRISM_TEST_API missing");

const wfSelfDirected = {
  goal: "Learner self-study inflation workshop with learner-facing page",
  desiredOutputs: "learning_outcomes, learning_activities, activity_materials, page",
  workflowOutputs: ["page", "learning_activities", "activity_materials"],
  workflowBriefResolution: {
    resolvedFactors: {
      delivery_context: "self_directed",
      learning_environments: ["self_study"]
    }
  }
};
const wfFacilitated = {
  goal: "Facilitated inflation workshop session",
  desiredOutputs: "learning_activities, activity_materials, page",
  workflowOutputs: ["page"],
  workflowBriefResolution: {
    resolvedFactors: {
      delivery_context: "in_person",
      learning_environments: ["classroom"]
    }
  }
};

function measureStep(spec, wf) {
  const factory = extractFactory(spec.heading);
  const step = {
    canonical_step_id: spec.canonical,
    title: spec.title,
    outputName: spec.outputName
  };
  const seeded = api.buildSeededStepPromptForWorkflowStep({
    workflowName: "Inflation workshop audit",
    step,
    matchedPattern: { promptFactory: factory }
  });
  const augmented = api.applyWorkflowStepRuntimePromptAugmentations(seeded, step, wf, {});
  const blocks = [];
  const re = /(?:^|\n)([^\n]+ \(auto-applied\)):/gi;
  let m;
  while ((m = re.exec(augmented)) !== null) blocks.push(m[1].trim());
  const blob = (factory.promptTemplate || "") + (factory.defaultPromptNotes || "");
  return {
    key: spec.key,
    canonical: spec.canonical,
    packTemplateChars: (factory.promptTemplate || "").length,
    packNotesChars: (factory.defaultPromptNotes || "").length,
    packTableMentions: (blob.match(/\btable\b|\|[^\n]+\|/gi) || []).length,
    packPipeTableExplicit: /\bpipe table/i.test(blob),
    seededChars: seeded.length,
    augmentedChars: augmented.length,
    deltaChars: augmented.length - seeded.length,
    blockCount: [...new Set(blocks)].length,
    blockTitles: [...new Set(blocks)]
  };
}

const results = STEP_SPECS.map((s) => ({
  self_directed: measureStep(s, wfSelfDirected),
  facilitated: measureStep(s, wfFacilitated)
}));

console.log(JSON.stringify({ measuredAt: new Date().toISOString(), results }, null, 2));
