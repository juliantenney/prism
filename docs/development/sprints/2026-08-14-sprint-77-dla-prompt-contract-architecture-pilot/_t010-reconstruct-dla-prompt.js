/**
 * S77-T-010 diagnostic runner — reconstruct live DLA Copy + Studio prompts.
 * Does not modify production assembly.
 *
 * Historical note (Phase D): Sprint 76 dual builders
 * (`buildDlaPageEnrichContractBlock` / `buildCanonicalDlaPageShapeSnippet`) were
 * retired from production. Sections below that call those APIs document the
 * pre-Phase-D inventory path and will throw if executed against current modules.
 * Prefer `assembleDlaCanonicalContract` for current live reconstruction.
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  injectLearnerRendererVNextInSandbox
} = require("../../../../tests/prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "../../../..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);
const outDir = __dirname;

function extractDlaPromptFactory(md) {
  const sectionIdx = md.indexOf("## 5. Design Learning Activities");
  const fence = md.indexOf("```json", md.indexOf("### Prompt Factory", sectionIdx));
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim());
}

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
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
    click() {}
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
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
    localStorage: { getItem: () => null, setItem() {} }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  sandbox.globalThis = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  windowStub.PRISM_EPISODE_PLAN_V1_TEMPLATES = require(path.join(
    repoRoot,
    "lib",
    "episode-plan-v1-templates.js"
  ));
  windowStub.PRISM_EPISODE_PLAN_DLA_INTEGRATION = require(path.join(
    repoRoot,
    "lib",
    "episode-plan-dla-integration.js"
  ));
  windowStub.PRISM_EPISODE_PLAN_V1_VALIDATION = require(path.join(
    repoRoot,
    "lib",
    "episode-plan-v1-validation.js"
  ));
  windowStub.PRISM_WORKFLOW_ARTEFACT_JSON_STRICT = require(path.join(
    repoRoot,
    "lib",
    "workflow-artefact-json-strict.js"
  ));
  runPrismLibScriptsInSandbox(sandbox, repoRoot, null);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, [
    "lib/ld-activity-title-contract.js",
    "lib/ld-dla-page-enrich-contract.js",
    "lib/page-dla-enrich.js",
    "lib/page-shell-create.js"
  ]);
  injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function countOccurrences(hay, needle) {
  if (!needle) return 0;
  let n = 0;
  let i = 0;
  while (true) {
    const j = hay.indexOf(needle, i);
    if (j === -1) break;
    n += 1;
    i = j + needle.length;
  }
  return n;
}

function uniqueCharsOf(parts) {
  const seen = new Set();
  let unique = 0;
  let exactDup = 0;
  for (const p of parts) {
    if (!p) continue;
    if (seen.has(p)) exactDup += p.length;
    else {
      seen.add(p);
      unique += p.length;
    }
  }
  return { unique, exactDup };
}

function tokenEstimate(chars) {
  return Math.round(chars / 4);
}

const ldMd = fs.readFileSync(ldPatternsPath, "utf8");
const dlaPf = extractDlaPromptFactory(ldMd);
const api = loadPrismTestApi();
const dlaContract = require(path.join(repoRoot, "lib", "ld-dla-page-enrich-contract.js"));
const titleMod = require(path.join(repoRoot, "lib", "ld-activity-title-contract.js"));
const integration = require(path.join(repoRoot, "lib", "episode-plan-dla-integration.js"));

const contract = dlaContract.buildDlaPageEnrichContractBlock();
const shape = dlaContract.buildCanonicalDlaPageShapeSnippet();
const pair = [contract, shape].filter(Boolean).join("\n");
const titleBlock = titleMod.buildDlaActivityTitleGuidance();
const archetype = dlaContract.buildInstructionalArchetypePlanningGuidance();
const legacyPop = integration.buildDlaPopulationOnlyPromptBlock();
const packTemplate = String(dlaPf.promptTemplate || "");
const packNotes = String(dlaPf.defaultPromptNotes || "");
const whatCheck = String((dlaPf.runnerInstructions && dlaPf.runnerInstructions.what_to_check) || "");
const whatDoes = String((dlaPf.runnerInstructions && dlaPf.runnerInstructions.what_this_step_does) || "");
const whatExpect = String((dlaPf.runnerInstructions && dlaPf.runnerInstructions.what_to_expect) || "");

api.setWorkflowStepPatternCatalogForTest([
  {
    title: "Design Learning Activities",
    canonicalStepId: "step_design_learning_activities",
    promptFactory: dlaPf
  }
]);

const brief = {
  goal:
    "Create a self-directed learning page on Karl Marx covering life phases, cause-effect links, comparison of major works, and application of core concepts.",
  inputs: "Undergraduate (self-directed study)",
  desiredOutputs: "Learner-facing page",
  selectedDomains: ["learning-design"]
};
const ldBriefConfig = api.normalizeWorkflowBriefConfig(extractWorkflowBriefConfig(ldMd));
const explicit = api.extractWorkflowBriefExplicitFactors(brief);
const inferred = api.applyWorkflowBriefInferenceRules(ldBriefConfig, brief.goal, brief.inputs);
const resolved = api.resolveWorkflowBriefFactors(
  ldBriefConfig,
  explicit,
  {},
  inferred,
  brief
).resolved;

const wf = {
  id: "wf-s77-t010",
  name: "S77 T-010 DLA inventory",
  goal: brief.goal,
  pageEnrichmentV2: true,
  partialPageOutputs: true,
  workflowOutputs: ["Learner-facing page"],
  workflowOutputSpec: { goal: brief.goal, desiredOutputs: brief.desiredOutputs },
  workflowBriefResolution: { resolvedFactors: resolved },
  steps: [
    {
      id: "lo_step",
      title: "Define Learning Outcomes",
      outputName: "learning_outcomes",
      canonical_step_id: "step_define_learning_outcomes"
    },
    {
      id: "ep_step",
      title: "Design Episode Plan",
      outputName: "page",
      canonical_step_id: "step_design_episode_plan"
    },
    {
      id: "dla_step",
      title: "Design Learning Activities",
      outputName: "page",
      canonical_step_id: "step_design_learning_activities",
      prompt_source_type: "local_override",
      override_prompt_body: packTemplate
    }
  ]
};

api.setWorkflowsForTest([wf]);
api.setSelectedWorkflowIdForTest(wf.id);

const dlaStep = wf.steps[2];
const copyPrompt = api.buildWorkflowStepInstructions(dlaStep, 2, null);

const studioSeed = api.buildSeededStepPromptForWorkflowStep({
  workflowGoal: brief.goal,
  workflowOutputs: wf.workflowOutputs,
  workflowOutputSpec: wf.workflowOutputSpec,
  step: dlaStep,
  matchedPattern: { promptFactory: dlaPf }
});
const studioPrompt = api.applyWorkflowStepRuntimePromptAugmentations(studioSeed, dlaStep, wf, {});

const embedFn = api.buildUpstreamPageShellEmbedSectionForDlaCopy;
let enrichInPlaceEmbed = "";
if (typeof embedFn === "function") {
  enrichInPlaceEmbed = embedFn({ pageEnrichmentV2: true, partialPageOutputs: false }) || "";
}

const markerContract = "### Sprint 58 vNext DLA partial-page contract (required)";
const markerShape = "Canonical DLA partial activity shape (required fields per activity):";
const copyContractHits = countOccurrences(copyPrompt, markerContract);
const copyShapeHits = countOccurrences(copyPrompt, markerShape);
const studioContractHits = countOccurrences(studioPrompt, markerContract);
const studioShapeHits = countOccurrences(studioPrompt, markerShape);

const pairInCopy = copyContractHits >= 2 && copyShapeHits >= 2;
const exactDupCharsCopy = pairInCopy ? pair.length : 0;

function findAll(hay, needle) {
  const out = [];
  let i = 0;
  while (needle) {
    const j = hay.indexOf(needle, i);
    if (j === -1) break;
    out.push({ start: j, end: j + needle.length });
    i = j + needle.length;
  }
  return out;
}

const copyMap = [];
const probes = [
  ["pipeline_open", "Execution mode: autonomous"],
  ["step_title", "This step is titled:"],
  ["partial_mode", "Sprint 58 DLA partial output mode"],
  ["copilot_output_contract", "Copilot output contract: return one pretty-printed fenced JSON page artefact"],
  ["contract_v1", markerContract],
  ["shape_v1", markerShape],
  ["role_purpose", "Role / purpose of this step:"],
  ["runner_guidance", "Runner guidance:"],
  ["core_prompt_header", "Here is the core prompt for this step:"],
  ["pack_context", "Context:\nYou are provided with learning_outcomes"],
  ["contract_v2", markerContract],
  ["shape_v2", markerShape],
  ["eqf", "EDUCATIONAL-QUALITY-FRAMEWORK (auto-applied)"],
  ["scaffold", "LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT (auto-applied)"],
  ["math", "LD-MATH-RENDER (auto-applied)"],
  ["table", "LD-TABLE-FIDELITY (auto-applied)"],
  ["output_contract", "OUTPUT CONTRACT (learner-facing copy fields"],
  ["sd_example", "Self-directed activity JSON example (authoritative shape"],
  ["material_shape", "self-directed learner-page material shape (auto-applied)"],
  ["timeline", "Self-directed timeline sequencing alignment (auto-applied)"],
  ["footer", "STEP 3 OUTPUT: page"],
  ["pipeline_close", "Pipeline completion rule:"]
];

let last = -1;
for (const [id, needle] of probes) {
  const idx = copyPrompt.toLowerCase().indexOf(needle.toLowerCase(), last + 1 >= 0 ? 0 : 0);
  const pos = copyPrompt.indexOf(needle);
  copyMap.push({
    id,
    needle: needle.slice(0, 80),
    firstIndex: pos,
    found: pos >= 0
  });
}

const componentSizes = {
  contract: contract.length,
  shape: shape.length,
  pair: pair.length,
  titleBlock: titleBlock.length,
  archetype: archetype.length,
  packTemplate: packTemplate.length,
  packNotes: packNotes.length,
  whatCheck: whatCheck.length,
  whatDoes: whatDoes.length,
  whatExpect: whatExpect.length,
  legacyPop: legacyPop.length,
  copyAssembled: copyPrompt.length,
  studioAssembled: studioPrompt.length,
  enrichInPlaceEmbed: enrichInPlaceEmbed.length
};

const summary = {
  head: "0b5402dcd989299bd284076efa1398d65eee63b5",
  contractVersion: dlaContract.CONTRACT_VERSION,
  componentSizes,
  copyContractHits,
  copyShapeHits,
  studioContractHits,
  studioShapeHits,
  exactDupCharsCopy,
  tokenEstimateCopy: tokenEstimate(copyPrompt.length),
  tokenEstimateStudio: tokenEstimate(studioPrompt.length),
  uniquePair: pair.length,
  assembledPairContribution: pair.length * copyContractHits,
  packTemplateInCopy: copyPrompt.includes("Populate executable learning_activities from upstream episode_plans"),
  copyMap,
  firstContract: findAll(copyPrompt, markerContract),
  firstShape: findAll(copyPrompt, markerShape)
};

fs.writeFileSync(
  path.join(outDir, "_t010-measurements.json"),
  JSON.stringify(summary, null, 2)
);

function delimited(label, text) {
  return "===== " + label + " =====\n" + text + "\n";
}

const diagTxt = [
  delimited("META", JSON.stringify({ copyLen: copyPrompt.length, studioLen: studioPrompt.length, version: dlaContract.CONTRACT_VERSION }, null, 2)),
  delimited("DLA-PB-CONTRACT", contract),
  delimited("DLA-PB-SHAPE", shape),
  delimited("DLA-PB-PACK-TEMPLATE", packTemplate),
  delimited("DLA-PB-PACK-NOTES", packNotes),
  delimited("ASSEMBLED-COPY-PRIMARY", copyPrompt),
  delimited("ASSEMBLED-STUDIO-AUGMENTED", studioPrompt)
].join("\n");

fs.writeFileSync(path.join(outDir, "S77-T-010-dla-assembled-prompt-diagnostic.txt"), diagTxt);

console.log(JSON.stringify(componentSizes, null, 2));
console.log("copy hits contract/shape", copyContractHits, copyShapeHits);
console.log("studio hits", studioContractHits, studioShapeHits);
console.log("copy length", copyPrompt.length);
console.log("studio length", studioPrompt.length);
