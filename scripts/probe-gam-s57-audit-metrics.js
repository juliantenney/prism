/**
 * Sprint 57 GAM audit — full lib bootstrap prompt size + duplication counts.
 * Run: node scripts/probe-gam-s57-audit-metrics.js
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { runPrismLibScriptsInSandbox } = require("../tests/prism-vm-lib-bootstrap");

const repoRoot = path.resolve(__dirname, "..");
const md = fs.readFileSync(
  path.join(repoRoot, "domains", "learning-design", "domain-learning-design-step-patterns.md"),
  "utf8"
);
const m = md.match(
  /## 6\. Generate Activity Materials[\s\S]*?### Prompt Factory\s*```json\s*([\s\S]*?)\s*```/
);
if (!m) throw new Error("GAM Prompt Factory not found");
const factory = JSON.parse(m[1].trim());

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    style: {},
    dataset: {},
    appendChild() {},
    addEventListener() {}
  };
}
const elementStore = new Map();
const documentStub = {
  readyState: "loading",
  addEventListener: () => {},
  createElement: () => createElementStub(),
  getElementById: (id) => {
    if (!elementStore.has(id)) elementStore.set(id, createElementStub());
    return elementStore.get(id);
  },
  querySelector: () => createElementStub(),
  querySelectorAll: () => [],
  body: { appendChild: () => {} }
};
const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
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
runPrismLibScriptsInSandbox(sandbox, repoRoot);
vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, {
  filename: "app.js"
});
const api = sandbox.window.__PRISM_TEST_API;
if (!api) throw new Error("__PRISM_TEST_API missing");

const wfSelfDirected = {
  goal: "RNA/HCV self-directed learner-page brief",
  desiredOutputs: "learning_activities, activity_materials, page",
  workflowOutputs: ["page", "activity_materials"],
  workflowBriefResolution: {
    resolvedFactors: {
      delivery_context: "self_directed",
      learning_environments: ["self_study"]
    }
  }
};
const step = {
  canonical_step_id: "step_generate_activity_materials",
  title: "Generate Activity Materials",
  outputName: "activity_materials"
};
const seeded = api.buildSeededStepPromptForWorkflowStep({
  workflowName: "Sprint 57 GAM audit",
  step,
  matchedPattern: { promptFactory: factory }
});
const augmented = api.applyWorkflowStepRuntimePromptAugmentations(
  seeded,
  step,
  wfSelfDirected,
  {}
);

function blockSize(markerRe) {
  const idx = augmented.search(markerRe);
  if (idx < 0) return 0;
  const tail = augmented.slice(idx);
  const next = tail.slice(1).search(/\n[A-Z0-9][^\n]{0,80} \(auto-applied\):/);
  const end = next >= 0 ? next + 1 : tail.length;
  return tail.slice(0, end).length;
}

const phraseCounts = {};
[
  ["80 words", /80\s+words/gi],
  ["at least 80", /at least\s+80/gi],
  ["GAM-PRES-08", /GAM-PRES-08/gi],
  ["Common mistakes", /## Common mistakes/gi],
  ["facilitator", /facilitator/gi],
  ["anti-redundan", /anti-redundan/gi],
  ["INSTRUCTIONAL-PATTERN-SP", /INSTRUCTIONAL-PATTERN-SP-0[1-7]/gi],
  ["GOOD shape example", /GOOD shape example/gi],
  ["What experts notice", /What experts notice/gi],
  ["scaffold-only", /scaffold-only/gi],
  ["Do not pre-fill", /Do not pre-fill/gi]
].forEach(function (pair) {
  phraseCounts[pair[0]] = (augmented.match(pair[1]) || []).length;
});

const blocks = [];
const re = /(?:^|\n)([^\n]+ \(auto-applied\)):/gi;
let bm;
while ((bm = re.exec(augmented)) !== null) blocks.push(bm[1].trim());

const blockSizes = {
  eqf: blockSize(/EDUCATIONAL-QUALITY-FRAMEWORK \(auto-applied\)/),
  spTotal: ["01", "02", "03", "04", "05", "06", "07"].reduce(function (sum, n) {
    return sum + blockSize(new RegExp("INSTRUCTIONAL-PATTERN-SP-" + n + " \\(auto-applied\\)"));
  }, 0),
  selfStudy: blockSize(/Self-directed learner-page self-study materials \(auto-applied\)/),
  rhetoric: blockSize(/LD-SELF-DIRECTED-RHETORIC \(auto-applied\)/),
  pelReasoning: blockSize(/Self-directed learner-page reasoning materials \(auto-applied\)/),
  table: blockSize(/LD-TABLE-FIDELITY \(auto-applied\)/),
  materials: blockSize(/LD-MATERIALS-COPY \(auto-applied\)/),
  math: blockSize(/LD-MATH-RENDER \(auto-applied\)/)
};

console.log(
  JSON.stringify(
    {
      measuredAt: new Date().toISOString(),
      seededChars: seeded.length,
      augmentedChars: augmented.length,
      deltaChars: augmented.length - seeded.length,
      packTemplateChars: (factory.promptTemplate || "").length,
      blockCount: [...new Set(blocks)].length,
      blockTitles: [...new Set(blocks)],
      blockSizes,
      phraseCounts
    },
    null,
    2
  )
);
