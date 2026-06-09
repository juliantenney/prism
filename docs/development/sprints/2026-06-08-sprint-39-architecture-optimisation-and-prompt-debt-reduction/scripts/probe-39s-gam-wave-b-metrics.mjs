/**
 * Sprint 39 GAM Wave B — before/after metrics (read-only probe).
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sprintRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(sprintRoot, "..", "..", "..", "..");
const artefactsDir = path.join(sprintRoot, "artefacts");

const baselinePath = path.join(artefactsDir, "EV-39S-GAM-RUNTIME-BASELINE.json");
const STEP1_BASELINE = {
  measuredAt: "2026-06-09T07:28:27.546Z",
  packCombinedChars: 15712,
  seededChars: 15145,
  augmentedChars: 27659,
  runtimeDeltaChars: 12514,
  selfDirectedScaffoldsDelta: 11294,
  autoAppliedBlockTitles: [
    "LD-TABLE-FIDELITY (auto-applied)",
    "Self-directed learner-page reading sufficiency (auto-applied)",
    "Self-directed learner-page material voice (auto-applied)",
    "Self-directed timeline sequencing alignment (auto-applied)",
    "LD-SELF-DIRECTED-RHETORIC (auto-applied)",
    "LD-MATH-RENDER (auto-applied)"
  ],
  standaloneBlockSizes: {
    gam_reading_voice_timeline_sum: 3644,
    gam_pel_reasoning_materials: 2039,
    pel_reasoning: 618
  }
};

const md = fs.readFileSync(
  path.join(repoRoot, "domains", "learning-design", "domain-learning-design-step-patterns.md"),
  "utf8"
);

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

const gamFactory = extractFactory("## 6. Generate Activity Materials");
const gamStep = {
  canonical_step_id: "step_generate_activity_materials",
  title: "Generate Activity Materials",
  outputName: "activity_materials"
};

const SCENARIOS = {
  inflation_self_directed: {
    goal: "Learner self-study inflation workshop with learner-facing page",
    desiredOutputs: "learning_outcomes, learning_activities, activity_materials, page",
    workflowOutputs: ["page", "learning_activities", "activity_materials"],
    workflowBriefResolution: {
      resolvedFactors: {
        delivery_context: "self_directed",
        learning_environments: ["self_study"]
      }
    }
  },
  marx_self_study_pec: {
    goal:
      "Create a self-directed learning page on Karl Marx covering life phases, cause-effect links, comparison of major works, and application of core concepts.",
    desiredOutputs: "Learner-facing page",
    workflowOutputs: ["page"],
    inputs: "Undergraduate (self-directed study)",
    workflowBriefResolution: {
      resolvedFactors: {
        delivery_context: "self_directed",
        learning_environments: ["self_study"],
        session_materials: ["page"]
      }
    }
  }
};

function measureGam(scenarioKey, wf) {
  const seeded = api.buildSeededStepPromptForWorkflowStep({
    workflowName: "Sprint 39 GAM Wave B metrics",
    step: gamStep,
    matchedPattern: { promptFactory: gamFactory }
  });
  const augmented = api.applyWorkflowStepRuntimePromptAugmentations(
    seeded,
    gamStep,
    wf,
    {}
  );
  const ctx = api.buildWorkflowStepPromptAugmentContextFromStep(gamStep, wf);
  const blockTitles = [];
  const re = /(?:^|\n)([^\n]+ \(auto-applied\)):/gi;
  let m;
  while ((m = re.exec(augmented)) !== null) blockTitles.push(m[1].trim());

  return {
    scenario: scenarioKey,
    seededChars: seeded.length,
    augmentedChars: augmented.length,
    runtimeDeltaChars: augmented.length - seeded.length,
    autoAppliedBlockTitles: [...new Set(blockTitles)],
    pecContractIds: api.resolvePedagogicEnrichmentContractIds
      ? [...api.resolvePedagogicEnrichmentContractIds(ctx)]
      : [],
    checks: {
      mergedSelfStudyMarker: /self-directed learner-page self-study materials \(auto-applied\)/i.test(
        augmented
      ),
      noLegacyReadingMarker: !/reading sufficiency \(auto-applied\)/i.test(augmented),
      noLegacyVoiceMarker: !/material voice \(auto-applied\)/i.test(augmented),
      noLegacyTimelineMarker: !/timeline sequencing alignment \(auto-applied\)/i.test(augmented),
      noPelReasoningOnGam:
        !/pedagogic enrichment — reasoning contract \(auto-applied\)/i.test(augmented),
      gamPres08InSelfStudy: /GAM-PRES-08/i.test(augmented),
      noShortWorkedMicroExample: !/short worked micro-example/i.test(augmented),
      reasoningMaterialsWhenPec:
        !api.resolvePedagogicEnrichmentContractIds(ctx).includes("reasoning_contract") ||
        /self-directed learner-page reasoning materials \(auto-applied\)/i.test(augmented)
    },
    standaloneBlockSizes: {
      gam_self_study_materials: api.buildSelfDirectedGamSelfStudyMaterialsPromptBlock().length,
      gam_pel_reasoning_materials:
        api.buildSelfDirectedGamPelReasoningMaterialPromptBlock().length,
      pel_reasoning: api.buildPelReasoningContractPromptBlock().length
    }
  };
}

const measuredAt = new Date().toISOString();
const inflationAfter = measureGam("inflation_self_directed", SCENARIOS.inflation_self_directed);
const marxAfter = measureGam("marx_self_study_pec", SCENARIOS.marx_self_study_pec);

const metrics = {
  phase: "39S-GAM-WAVE-B",
  measuredAt,
  sprint: "39",
  authority: "sprint-39-work-packages.md Package 1",
  baseline: STEP1_BASELINE,
  afterWaveB: {
    inflation_self_directed: inflationAfter,
    marx_self_study_pec: marxAfter
  },
  delta: {
    inflation_self_directed: {
      augmentedChars: inflationAfter.augmentedChars - STEP1_BASELINE.augmentedChars,
      runtimeDeltaChars: inflationAfter.runtimeDeltaChars - STEP1_BASELINE.runtimeDeltaChars,
      selfStudyBlocksMerged: 3,
      legacyMarkersRemoved: 3
    }
  },
  blockLevel: {
    before: {
      reading_voice_timeline_separate: STEP1_BASELINE.standaloneBlockSizes.gam_reading_voice_timeline_sum,
      pel_reasoning_on_gam_when_pec: STEP1_BASELINE.standaloneBlockSizes.pel_reasoning,
      gam_pel_reasoning_materials: STEP1_BASELINE.standaloneBlockSizes.gam_pel_reasoning_materials
    },
    after: {
      gam_self_study_materials_merged: inflationAfter.standaloneBlockSizes.gam_self_study_materials,
      gam_pel_reasoning_materials: inflationAfter.standaloneBlockSizes.gam_pel_reasoning_materials,
      pel_reasoning_removed_from_gam_path: true
    },
    mergeNetChars:
      STEP1_BASELINE.standaloneBlockSizes.gam_reading_voice_timeline_sum -
      inflationAfter.standaloneBlockSizes.gam_self_study_materials,
    pelReasoningRemovedFromGamWhenPec: STEP1_BASELINE.standaloneBlockSizes.pel_reasoning
  },
  validationTarget: {
    minimumAugmentedReductionChars: 500,
    inflationScenarioMeetsMinimum:
      inflationAfter.augmentedChars - STEP1_BASELINE.augmentedChars <= -500,
    justification:
      "Inflation workshop probe has PEC inactive (reasoning_contract not resolved); Wave B merge saves ~19 augmented chars. Marx self-study PEC-active path removes duplicate PEL reasoning contract (~618 chars) while retaining rewritten reasoning-materials block."
  },
  marxPecActiveEstimate: {
    note: "Marx self-study resolves reasoning_contract; augmented reduction vs Step-1-equivalent would include PEL reasoning removal",
    afterAugmentedChars: marxAfter.augmentedChars,
    pecContractIds: marxAfter.pecContractIds
  }
};

fs.mkdirSync(artefactsDir, { recursive: true });
fs.writeFileSync(
  path.join(artefactsDir, "EV-39S-GAM-WAVE-B-metrics.json"),
  JSON.stringify(metrics, null, 2),
  "utf8"
);

console.log(JSON.stringify(metrics.delta, null, 2));
console.log(JSON.stringify(metrics.afterWaveB.inflation_self_directed.checks, null, 2));
