/**
 * Sprint 39 Workstream B — Design Page hygiene before/after metrics.
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sprintRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(sprintRoot, "..", "..", "..", "..");
const artefactsDir = path.join(sprintRoot, "artefacts");

const STEP1_BASELINE = JSON.parse(
  fs.readFileSync(path.join(artefactsDir, "EV-39S-DESIGN-PAGE-BASELINE.json"), "utf8")
);

const md = fs.readFileSync(
  path.join(repoRoot, "domains", "learning-design", "domain-learning-design-step-patterns.md"),
  "utf8"
);
const section = md.match(
  /## 13\. Design Page[\s\S]*?### Prompt Factory\s*```json\s*([\s\S]*?)\s*```/
);
if (!section) throw new Error("Design Page Prompt Factory not found");
const factory = JSON.parse(section[1].trim());

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
const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
const windowStub = {
  document: documentStub,
  addEventListener: () => {},
  location: { hash: "", pathname: "/" },
  _: sandbox._,
  Utils: { debounce: (fn) => fn },
  localStorage: { getItem: () => null, setItem: () => {} },
  URL: { createObjectURL: () => "", revokeObjectURL: () => "" },
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

for (const lib of [
  "sprint38-visual-affordances.js",
  "ld-table-fidelity.js",
  "ld-materials-copy.js",
  "ld-math-render.js",
  "ld-self-directed-rhetoric.js",
  "ld-design-page-compose-contract.js"
]) {
  vm.runInContext(fs.readFileSync(path.join(repoRoot, "lib", lib), "utf8"), sandbox, {
    filename: lib
  });
}
vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, {
  filename: "app.js"
});

const api = sandbox.window.__PRISM_TEST_API;
const step = {
  canonical_step_id: "step_design_page",
  title: "Design Page",
  outputName: "page"
};
const wf = {
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

const seeded = api.buildSeededStepPromptForWorkflowStep({
  workflowName: "Sprint 39 Design Page hygiene",
  step,
  matchedPattern: { promptFactory: factory }
});
const augmented = api.applyWorkflowStepRuntimePromptAugmentations(seeded, step, wf, {});

const blockTitles = [];
const re = /(?:^|\n)([^\n]+ \(auto-applied\)):/gi;
let m;
while ((m = re.exec(augmented)) !== null) blockTitles.push(m[1].trim());

const composeIdx = augmented.search(/LD-DESIGN-PAGE-COMPOSE-CONTRACT \(auto-applied\)/i);
const vaIdx = augmented.search(/sprint 38 visual affordance authoring contract \(auto-applied\)/i);

const pack = {
  promptTemplateChars: (factory.promptTemplate || "").length,
  defaultPromptNotesChars: (factory.defaultPromptNotes || "").length,
  whatToCheckChars: (factory.runnerInstructions?.what_to_check || "").length,
  packCombinedChars:
    (factory.promptTemplate || "").length + (factory.defaultPromptNotes || "").length
};

const measuredAt = new Date().toISOString();
const metrics = {
  phase: "39S-DESIGN-PAGE-HYGIENE",
  measuredAt,
  sprint: "39",
  authority: "sprint-39-work-packages.md Package 2",
  baseline: {
    measuredAt: STEP1_BASELINE.measuredAt,
    pack: STEP1_BASELINE.pack,
    whatToCheckChars: null,
    workflow: STEP1_BASELINE.workflow,
    autoAppliedBlockTitles: STEP1_BASELINE.autoAppliedBlockTitles
  },
  afterHygiene: {
    scenario: "inflation_self_directed",
    pack,
    workflow: {
      seededChars: seeded.length,
      augmentedChars: augmented.length,
      runtimeDeltaChars: augmented.length - seeded.length
    },
    autoAppliedBlockTitles: [...new Set(blockTitles)],
    ordering: {
      composeBeforeVisualAffordance: composeIdx >= 0 && vaIdx >= 0 && composeIdx < vaIdx,
      composeIndex: composeIdx,
      visualAffordanceIndex: vaIdx
    },
    checks: {
      composeContractPresent: composeIdx >= 0,
      visualAffordancePresent: vaIdx >= 0,
      noPelOrientation: !/pedagogic enrichment — orientation contract \(auto-applied\)/i.test(
        augmented
      ),
      noPelReasoning: !/pedagogic enrichment — reasoning contract \(auto-applied\)/i.test(augmented),
      noInlineVaProseInPack: !/hooks are not opportunities/i.test(factory.promptTemplate || ""),
      notesReferenceComposeContract: /LD-DESIGN-PAGE-COMPOSE-CONTRACT/i.test(
        factory.defaultPromptNotes || ""
      ),
      forbiddenCollapseInTemplate: /FORBIDDEN inflation-collapse substitutes/i.test(
        factory.promptTemplate || ""
      )
    }
  },
  delta: {
    packCombinedChars: pack.packCombinedChars - STEP1_BASELINE.pack.packCombinedChars,
    packTemplateChars: pack.promptTemplateChars - STEP1_BASELINE.pack.promptTemplateChars,
    packNotesChars: pack.defaultPromptNotesChars - STEP1_BASELINE.pack.defaultPromptNotesChars,
    augmentedChars: augmented.length - STEP1_BASELINE.workflow.augmentedChars,
    runtimeDeltaChars:
      augmented.length - seeded.length - STEP1_BASELINE.workflow.runtimeDeltaChars
  },
  decisions: {
    fieldPreservationBlock: "deleted — buildSelfDirectedLearnerPageDesignPageFieldPreservationBlock removed; LD-DESIGN-PAGE-COMPOSE-CONTRACT Activity field preservation is authoritative"
  }
};

fs.writeFileSync(
  path.join(artefactsDir, "EV-39S-DESIGN-PAGE-HYGIENE-metrics.json"),
  JSON.stringify(metrics, null, 2),
  "utf8"
);

console.log(JSON.stringify({ pack, delta: metrics.delta, ordering: metrics.afterHygiene.ordering }, null, 2));
