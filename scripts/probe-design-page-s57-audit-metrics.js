/**
 * Design Page prompt architecture audit — full lib bootstrap metrics.
 * Run: node scripts/probe-design-page-s57-audit-metrics.js
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
  /## 13\. Design Page[\s\S]*?### Prompt Factory\s*```json\s*([\s\S]*?)\s*```/
);
if (!m) throw new Error("Design Page Prompt Factory not found");
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
const wfFacilitated = {
  goal: "Facilitated inflation workshop session",
  desiredOutputs: "page",
  workflowBriefResolution: {
    resolvedFactors: {
      delivery_context: "in_person",
      learning_environments: ["classroom"]
    }
  }
};
const step = {
  canonical_step_id: "step_design_page",
  title: "Design Page",
  outputName: "page"
};

function measureBrief(wf) {
  const seeded = api.buildSeededStepPromptForWorkflowStep({
    workflowName: "Sprint 57 Design Page audit",
    step,
    matchedPattern: { promptFactory: factory }
  });
  const augmented = api.applyWorkflowStepRuntimePromptAugmentations(
    seeded,
    step,
    wf,
    {}
  );
  return { seeded, augmented };
}

function blockSize(text, markerRe) {
  const idx = text.search(markerRe);
  if (idx < 0) return 0;
  const tail = text.slice(idx);
  const next = tail.slice(1).search(/\n[A-Z0-9][^\n]{0,120} \(auto-applied\):/);
  const end = next >= 0 ? next + 1 : tail.length;
  return tail.slice(0, end).length;
}

function incrementalTrace(seeded, wf) {
  const stepCtx = api.buildWorkflowStepPromptAugmentContextFromStep
    ? null
    : null;
  const ctx = {
    workflowGoal: wf.goal,
    desiredOutputs: wf.desiredOutputs,
    workflowBriefResolution: wf.workflowBriefResolution,
    stepCanonicalStepId: step.canonical_step_id,
    stepCanonicalTitle: step.title,
    stepTitle: step.title,
    stepOutputName: step.outputName
  };
  const steps = [];
  let draft = seeded;
  function snap(label, fn) {
    const before = draft.length;
    draft = fn(draft);
    steps.push({ step: label, delta: draft.length - before, cumulative: draft.length });
  }
  snap("pedagogicCognition", (d) => api.applyPedagogicCognitionContractScaffoldToDraft(d, ctx));
  snap("eqf", (d) => api.applyEducationalQualityFrameworkPromptBlockToDraft(d, ctx));
  snap("instructionalPattern", (d) => api.applyInstructionalPatternPromptBlockToDraft(d, ctx));
  snap("selfDirectedScaffolds", (d) => api.applySelfDirectedLearnerPageStepScaffoldsToDraft(d, ctx));
  snap("tableFidelity", (d) => api.applyLdTableFidelityContractToDraft(d, ctx));
  snap("materialsCopy", (d) => api.applyLdMaterialsCopyContractToDraft(d, ctx));
  snap("pel", (d) => api.applyPedagogicEnrichmentContractScaffoldToDraft(d, ctx));
  snap("designPageCompose", (d) => api.applyLdDesignPageComposeContractToDraft(d, ctx));
  snap("sprint38Visual", (d) => api.applySprint38VisualAffordanceContractToDraft(d, ctx));
  snap("math", (d) => api.applyMathSafeOutputContractToDraft(d, ctx));
  if (typeof api.applyStrictJsonArtefactContractToDraftForTest === "function") {
    snap("strictJson", (d) => api.applyStrictJsonArtefactContractToDraftForTest(d, ctx));
  }
  return steps;
}

const self = measureBrief(wfSelfDirected);
const fac = measureBrief(wfFacilitated);

const augmented = self.augmented;
const phrasePairs = [
  ["verbatim", /verbatim/gi],
  ["PRESERVATION BOUNDARY", /PRESERVATION BOUNDARY/gi],
  ["activity.materials", /activity\.materials/gi],
  ["LD-DESIGN-PAGE-COMPOSE", /LD-DESIGN-PAGE-COMPOSE/gi],
  ["LD-GUIDED-LEARNING-SCAFFOLD", /LD-GUIDED-LEARNING-SCAFFOLD/gi],
  ["LD-JOURNEY-ASSIMILATION", /LD-JOURNEY-ASSIMILATION/gi],
  ["LD-AUTHORIAL-EXPOSITION", /LD-AUTHORIAL-EXPOSITION/gi],
  ["visual affordance", /visual affordance/gi],
  ["episode_plans", /episode_plans/gi],
  ["facilitator", /facilitator/gi],
  ["PRE-EMIT", /PRE-EMIT/gi],
  ["GOOD shape", /GOOD shape/gi],
  ["anti-redundan", /anti-redundan/gi],
  ["intellectual_coherence_bridge", /intellectual_coherence_bridge/gi]
];
const phraseCounts = {};
phrasePairs.forEach(function (pair) {
  phraseCounts[pair[0]] = (augmented.match(pair[1]) || []).length;
});

const blocks = [];
const re = /(?:^|\n)([^\n]+ \(auto-applied\)):/gi;
let bm;
while ((bm = re.exec(augmented)) !== null) blocks.push(bm[1].trim());

const blockSizes = {
  eqf: blockSize(augmented, /EDUCATIONAL-QUALITY-FRAMEWORK \(auto-applied\)/),
  rhetoric: blockSize(augmented, /LD-SELF-DIRECTED-RHETORIC \(auto-applied\)/),
  compose: blockSize(augmented, /LD-DESIGN-PAGE-COMPOSE-CONTRACT \(auto-applied\)/),
  authorial: blockSize(augmented, /LD-AUTHORIAL-EXPOSITION-CONTRACT \(auto-applied\)/),
  journey: blockSize(augmented, /LD-JOURNEY-ASSIMILATION-CONTRACT \(auto-applied\)/),
  scaffold: blockSize(augmented, /LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT \(auto-applied\)/),
  sprint38: blockSize(augmented, /Sprint 38 visual affordance authoring contract \(auto-applied\)/),
  sprint38Ped: blockSize(augmented, /Sprint 38 pedagogical added-value contract \(auto-applied\)/),
  math: blockSize(augmented, /LD-MATH-RENDER \(auto-applied\)/)
};

const packTemplate = factory.promptTemplate || "";
const packNotes = factory.defaultPromptNotes || "";

console.log(
  JSON.stringify(
    {
      measuredAt: new Date().toISOString(),
      self_directed: {
        seededChars: self.seeded.length,
        augmentedChars: self.augmented.length,
        deltaChars: self.augmented.length - self.seeded.length,
        packTemplateChars: packTemplate.length,
        packNotesChars: packNotes.length,
        blockCount: [...new Set(blocks)].length,
        blockTitles: [...new Set(blocks)],
        blockSizes,
        phraseCounts,
        incremental: incrementalTrace(self.seeded, wfSelfDirected)
      },
      facilitated: {
        seededChars: fac.seeded.length,
        augmentedChars: fac.augmented.length,
        deltaChars: fac.augmented.length - fac.seeded.length
      },
      historical: {
        sprint38b_self_directed_augmented: 45791,
        sprint38b_seeded: 9648
      }
    },
    null,
    2
  )
);
