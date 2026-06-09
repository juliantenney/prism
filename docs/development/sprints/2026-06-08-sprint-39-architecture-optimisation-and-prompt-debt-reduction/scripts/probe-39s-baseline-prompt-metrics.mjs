/**
 * Sprint 39 Step 1 — Baseline prompt metrics (read-only probe).
 * Run: node docs/.../scripts/probe-39s-baseline-prompt-metrics.mjs
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sprintRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(sprintRoot, "..", "..", "..", "..");
const artefactsDir = path.join(sprintRoot, "artefacts");

const md = fs.readFileSync(
  path.join(repoRoot, "domains", "learning-design", "domain-learning-design-step-patterns.md"),
  "utf8"
);

const STEP_SPECS = {
  gam: {
    heading: "## 6. Generate Activity Materials",
    canonical: "step_generate_activity_materials",
    title: "Generate Activity Materials",
    outputName: "activity_materials"
  },
  dla: {
    heading: "## 5. Design Learning Activities",
    canonical: "step_design_learning_activities",
    title: "Design Learning Activities",
    outputName: "learning_activities"
  },
  design_page: {
    heading: "## 13. Design Page",
    canonical: "step_design_page",
    title: "Design Page",
    outputName: "page"
  }
};

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
if (!api) throw new Error("__PRISM_TEST_API missing");

const wfInflationSelfDirected = {
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

function measureLayerDeltas(seeded, step, wf) {
  const ctx = api.buildWorkflowStepPromptAugmentContextFromStep(step, wf);
  const layers = [
    {
      id: "pedagogic_cognition",
      apply: (t) => api.applyPedagogicCognitionContractScaffoldToDraft(t, ctx)
    },
    {
      id: "self_directed_scaffolds",
      apply: (t) => api.applySelfDirectedLearnerPageStepScaffoldsToDraft(t, ctx)
    },
    {
      id: "ld_table_fidelity",
      apply: (t) => api.applyLdTableFidelityContractToDraft(t, ctx)
    },
    {
      id: "ld_materials_copy",
      apply: (t) => api.applyLdMaterialsCopyContractToDraft(t, ctx)
    },
    {
      id: "pedagogic_enrichment_pec",
      apply: (t) => api.applyPedagogicEnrichmentContractScaffoldToDraft(t, ctx)
    },
    {
      id: "sprint38_visual_affordance",
      apply: (t) => api.applySprint38VisualAffordanceContractToDraft(t, ctx)
    },
    {
      id: "design_page_compose",
      apply: (t) => api.applyLdDesignPageComposeContractToDraft(t, ctx)
    },
    {
      id: "math_render",
      apply: (t) => api.applyMathSafeOutputContractToDraft(t, ctx)
    },
    {
      id: "episode_plan_population",
      apply: (t) => api.applyEpisodePlanDlaPopulationPromptBlockToDraft(t, ctx, wf)
    }
  ];

  let draft = seeded;
  const layerMetrics = [];
  for (const layer of layers) {
    const before = draft.length;
    draft = String(layer.apply(draft) || "").trim();
    const delta = draft.length - before;
    if (delta !== 0) {
      layerMetrics.push({ id: layer.id, deltaChars: delta, cumulativeChars: draft.length });
    }
  }
  return layerMetrics;
}

function measureStandaloneBlocks(stepKey, ctx) {
  const isGam = stepKey === "gam";
  const isDla = stepKey === "dla";
  const isPage = stepKey === "design_page";
  const blocks = {};

  const add = (id, fn) => {
    try {
      const text = String(fn() || "");
      if (text.length) blocks[id] = text.length;
    } catch (e) {
      blocks[id] = { error: e.message };
    }
  };

  add("ld_table_fidelity_author", () =>
    api.buildLdTableFidelityPromptBlock({ role: "author" })
  );
  add("ld_table_fidelity_spec", () =>
    api.buildLdTableFidelityPromptBlock({ role: "spec" })
  );
  add("ld_materials_copy_author", () =>
    api.buildLdMaterialsCopyPromptBlock({ role: "author" })
  );
  add("ld_materials_copy_preserve", () =>
    api.buildLdMaterialsCopyPromptBlock({ role: "preserve" })
  );
  add("ld_self_directed_rhetoric_gam", () =>
    api.buildLdSelfDirectedRhetoricPromptBlock({ stepRole: "gam" })
  );
  add("ld_self_directed_rhetoric_dla", () =>
    api.buildLdSelfDirectedRhetoricPromptBlock({ stepRole: "dla" })
  );
  add("ld_self_directed_rhetoric_design_page", () =>
    api.buildLdSelfDirectedRhetoricPromptBlock({ stepRole: "design_page" })
  );
  add("gam_self_study_materials", () =>
    api.buildSelfDirectedGamSelfStudyMaterialsPromptBlock
      ? api.buildSelfDirectedGamSelfStudyMaterialsPromptBlock()
      : ""
  );
  add("gam_learner_voice", () => api.buildSelfDirectedGamLearnerVoicePromptBlock());
  add("gam_pel_reasoning_materials", () =>
    api.buildSelfDirectedGamPelReasoningMaterialPromptBlock()
  );
  add("pel_orientation", () => api.buildPelOrientationContractPromptBlock());
  add("pel_reasoning", () => api.buildPelReasoningContractPromptBlock());
  add("pedagogic_cognition", () => api.buildPedagogicCognitionContractPromptBlock(ctx));
  add("sprint38_va_design_page", () => api.buildSprint38VisualAffordanceDesignPagePromptBlock());
  add("design_page_materials_fidelity", () =>
    api.buildDesignPageActivityMaterialsFidelityPromptBlock()
  );
  add("ld_design_page_compose", () => api.buildLdDesignPageComposePromptBlock({}));
  add("ld_math_render", () => api.buildLdMathRenderPromptBlock());
  add("episode_plan_population_block", () =>
    api.buildEpisodePlanDlaPopulationPromptBlock({})
  );

  if (!isGam) {
    delete blocks.gam_learner_voice;
    delete blocks.gam_pel_reasoning_materials;
    delete blocks.ld_self_directed_rhetoric_gam;
  }
  if (!isDla) {
    delete blocks.ld_self_directed_rhetoric_dla;
    delete blocks.episode_plan_population_block;
  }
  if (!isPage) {
    delete blocks.sprint38_va_design_page;
    delete blocks.design_page_materials_fidelity;
    delete blocks.ld_design_page_compose;
    delete blocks.ld_self_directed_rhetoric_design_page;
  }

  return blocks;
}

function measureStep(key) {
  const spec = STEP_SPECS[key];
  const factory = extractFactory(spec.heading);
  const step = {
    canonical_step_id: spec.canonical,
    title: spec.title,
    outputName: spec.outputName
  };
  const seeded = api.buildSeededStepPromptForWorkflowStep({
    workflowName: "Inflation workshop audit (Sprint 39 baseline)",
    step,
    matchedPattern: { promptFactory: factory }
  });
  const augmented = api.applyWorkflowStepRuntimePromptAugmentations(
    seeded,
    step,
    wfInflationSelfDirected,
    {}
  );
  const ctx = api.buildWorkflowStepPromptAugmentContextFromStep(step, wfInflationSelfDirected);
  const layerDeltas = measureLayerDeltas(seeded, step, wfInflationSelfDirected);
  const standaloneBlocks = measureStandaloneBlocks(key, ctx);

  const blockTitles = [];
  const re = /(?:^|\n)([^\n]+ \(auto-applied\)):/gi;
  let m;
  while ((m = re.exec(augmented)) !== null) blockTitles.push(m[1].trim());

  const packTemplateChars = (factory.promptTemplate || "").length;
  const packNotesChars = (factory.defaultPromptNotes || "").length;

  return {
    step: key,
    canonicalStepId: spec.canonical,
    scenario: "inflation_self_directed",
    pack: {
      promptTemplateChars: packTemplateChars,
      defaultPromptNotesChars: packNotesChars,
      packCombinedChars: packTemplateChars + packNotesChars
    },
    workflow: {
      seededChars: seeded.length,
      augmentedChars: augmented.length,
      runtimeDeltaChars: augmented.length - seeded.length,
      runtimeDeltaPctOfAugmented: Number(
        (((augmented.length - seeded.length) / augmented.length) * 100).toFixed(1)
      )
    },
    augmentationLayers: layerDeltas,
    autoAppliedBlockTitles: [...new Set(blockTitles)],
    standaloneBlockSizes: standaloneBlocks,
    pecContractIds: api.resolvePedagogicEnrichmentContractIds
      ? api.resolvePedagogicEnrichmentContractIds(ctx)
      : []
  };
}

const measuredAt = new Date().toISOString();
const gam = measureStep("gam");
const designPage = measureStep("design_page");
const dla = measureStep("dla");

function sortLayers(metrics) {
  return [...metrics.augmentationLayers].sort((a, b) => b.deltaChars - a.deltaChars);
}

function topContributors(metrics) {
  return sortLayers(metrics).slice(0, 8);
}

const gamBaseline = {
  phase: "39S-STEP-1",
  measuredAt,
  sprint: "39",
  authority: "sprint-39-handover-pack.md",
  scenario: gam.scenario,
  pack: gam.pack,
  workflow: gam.workflow,
  augmentationLayers: gam.augmentationLayers,
  topRuntimeContributors: topContributors(gam),
  autoAppliedBlockTitles: gam.autoAppliedBlockTitles,
  standaloneBlockSizes: gam.standaloneBlockSizes,
  pecContractIds: gam.pecContractIds,
  comparison38S: {
    packCombinedAfterWaveA: 15712,
    augmentedRange38S: "32692-35349",
    runtimeDeltaRange38S: "12514-15171"
  }
};

const designPageBaseline = {
  phase: "39S-STEP-1",
  measuredAt,
  sprint: "39",
  authority: "sprint-39-handover-pack.md",
  scenario: designPage.scenario,
  pack: designPage.pack,
  workflow: designPage.workflow,
  augmentationLayers: designPage.augmentationLayers,
  topRuntimeContributors: topContributors(designPage),
  autoAppliedBlockTitles: designPage.autoAppliedBlockTitles,
  standaloneBlockSizes: designPage.standaloneBlockSizes,
  pecContractIds: designPage.pecContractIds,
  comparison38S: {
    packCombinedProbe38S: 11302,
    packTemplateProbe38S: 9519,
    packNotesProbe38S: 1783,
    augmentedProbe38S: 27092,
    runtimeDeltaProbe38S: 17743
  }
};

const dlaBaseline = {
  phase: "39S-STEP-1",
  measuredAt,
  sprint: "39",
  authority: "sprint-39-handover-pack.md",
  scenario: dla.scenario,
  pack: dla.pack,
  workflow: dla.workflow,
  augmentationLayers: dla.augmentationLayers,
  topRuntimeContributors: topContributors(dla),
  autoAppliedBlockTitles: dla.autoAppliedBlockTitles,
  standaloneBlockSizes: dla.standaloneBlockSizes,
  pecContractIds: dla.pecContractIds,
  comparison38S: {
    packCombinedAfterFinalSanitisation: 13983,
    augmentedProbe38S: 42190,
    runtimeDeltaProbe38S: 17699
  }
};

fs.mkdirSync(artefactsDir, { recursive: true });
fs.writeFileSync(
  path.join(artefactsDir, "EV-39S-GAM-RUNTIME-BASELINE.json"),
  JSON.stringify(gamBaseline, null, 2),
  "utf8"
);
fs.writeFileSync(
  path.join(artefactsDir, "EV-39S-DESIGN-PAGE-BASELINE.json"),
  JSON.stringify(designPageBaseline, null, 2),
  "utf8"
);
fs.writeFileSync(
  path.join(artefactsDir, "EV-39S-DLA-RUNTIME-BASELINE.json"),
  JSON.stringify(dlaBaseline, null, 2),
  "utf8"
);

console.log(
  JSON.stringify(
    {
      measuredAt,
      gam: {
        pack: gam.pack.packCombinedChars,
        augmented: gam.workflow.augmentedChars,
        runtimeDelta: gam.workflow.runtimeDeltaChars
      },
      designPage: {
        pack: designPage.pack.packCombinedChars,
        augmented: designPage.workflow.augmentedChars,
        runtimeDelta: designPage.workflow.runtimeDeltaChars
      },
      dla: {
        pack: dla.pack.packCombinedChars,
        augmented: dla.workflow.augmentedChars,
        runtimeDelta: dla.workflow.runtimeDeltaChars
      }
    },
    null,
    2
  )
);
