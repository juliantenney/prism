/**
 * Design Page — rich activity materials must coexist with Sprint 38 visual affordances.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);
const inflationRichMaterialsPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "ld-inflation-workshop-learner-visibility-page.json"
);
const inflationFullPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "ld-inflation-workshop-page-full.json"
);
const s38RecordsPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "sprint-38",
  "affordance-records.json"
);

const fidelity = require("../lib/design-page-materials-fidelity.js");
const s38 = require("../lib/sprint38-visual-affordances.js");

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add: () => {},
      remove: () => {},
      contains: () => false,
      toggle: () => false
    },
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
    readyState: "loading",
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
    removeEventListener: () => {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem: () => {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL: () => {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

function extractDesignPagePromptFactory(md) {
  const section = md.match(/## 13\. Design Page[\s\S]*?### Prompt Factory\s*```json\s*([\s\S]*?)\s*```/);
  assert.ok(section, "Design Page Prompt Factory JSON block");
  return JSON.parse(section[1].trim());
}

function designPageAugmentedPrompt(api) {
  const factory = extractDesignPagePromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  const seeded = api.buildSeededStepPromptForWorkflowStep({
    workflowName: "Inflation workshop",
    step: {
      title: "Design Page",
      canonical_step_id: "step_design_page",
      inputBindings: []
    },
    matchedPattern: { promptFactory: factory }
  });
  return api.applyWorkflowStepRuntimePromptAugmentations(
    seeded,
    { canonical_step_id: "step_design_page", title: "Design Page" },
    {
      goal: "RNA/HCV self-directed learner-page brief",
      desiredOutputs: "learning_activities, activity_materials, page",
      workflowOutputs: ["page", "activity_materials"],
      workflowBriefResolution: {
        resolvedFactors: {
          delivery_context: "self_directed",
          learning_environments: ["self_study"]
        }
      }
    }
  );
}

/** Merge activity_materials section entries into per-activity materials (expected Design Page shape). */
function inflationPageWithMergedMaterials(basePage) {
  const page = JSON.parse(JSON.stringify(basePage));
  const matSection = page.sections.find((s) => s.section_id === "activity_materials");
  const actSection = page.sections.find((s) => s.section_id === "learning_activities");
  if (!matSection || !actSection || !Array.isArray(matSection.content) || !Array.isArray(actSection.content)) {
    return page;
  }
  const byId = {};
  matSection.content.forEach((entry) => {
    const aid = String(entry.activity_id || "").trim();
    if (!aid) return;
    if (!byId[aid]) byId[aid] = {};
    const typeKey = String(entry.type || entry.material_type || "content").replace(/\s+/g, "_");
    const payload = entry.content != null ? entry.content : entry;
    if (typeof payload === "string") {
      if (!byId[aid][typeKey]) byId[aid][typeKey] = payload;
      else if (Array.isArray(byId[aid][typeKey])) byId[aid][typeKey].push(payload);
      else byId[aid][typeKey] = [byId[aid][typeKey], payload];
    } else {
      byId[aid][typeKey] = payload;
    }
  });
  actSection.content.forEach((row) => {
    const aid = String(row.activity_id || "").trim();
    if (byId[aid]) row.materials = Object.assign({}, byId[aid], row.materials || {});
  });
  return page;
}

test("placeholder detector flags label-only materials", () => {
  assert.equal(
    fidelity.materialsObjectLooksPlaceholderOnly({
      scenarios: "Set of short scenarios describing price changes."
    }),
    true
  );
  assert.equal(
    fidelity.materialsObjectLooksPlaceholderOnly({
      analysis_table: "Calculation table with basket items."
    }),
    true
  );
});

test("placeholder detector accepts inflation-style rich materials", () => {
  const page = JSON.parse(fs.readFileSync(inflationRichMaterialsPath, "utf8"));
  assert.equal(fidelity.pageActivityMaterialsLookPlaceholderOnly(page), false);
  assert.equal(fidelity.pageActivityMaterialsHaveRichContent(page), true);
});

test("merged inflation full fixture yields rich per-activity materials", () => {
  const merged = inflationPageWithMergedMaterials(
    JSON.parse(fs.readFileSync(inflationFullPath, "utf8"))
  );
  assert.equal(fidelity.pageActivityMaterialsHaveRichContent(merged), true);
  const a3 = merged.sections
    .find((s) => s.section_id === "learning_activities")
    .content.find((r) => r.activity_id === "A3");
  assert.ok(a3.materials.scenario || a3.materials.analysis_table);
  const scenarioText = String(a3.materials.scenario || "");
  assert.match(scenarioText, /Pensioner|Graduate|Dual-income/i);
});

test("inflation-style page: rich materials coexist with visual_affordances", () => {
  const records = JSON.parse(fs.readFileSync(s38RecordsPath, "utf8"));
  const merged = inflationPageWithMergedMaterials(
    JSON.parse(fs.readFileSync(inflationFullPath, "utf8"))
  );
  merged.visual_affordance_schema_version = "38.4";
  merged.activities_visual_review = [
    {
      activity_id: "A3",
      activity_visual_value: {
        decision: "high",
        rationale: "Classification matrix supports scenario typing before table completion."
      }
    }
  ];
  merged.visual_affordances = [records.inflation_a3_generate];
  assert.equal(fidelity.pageActivityMaterialsHaveRichContent(merged), true);
  const validation = s38.validatePageVisualAffordances(merged);
  assert.equal(validation.valid, true, validation.errors.join("; "));
  assert.equal(merged.visual_affordances.length, 1);
});

test("Design Page pack: materials fidelity delegated to compose contract in notes", () => {
  const factory = extractDesignPagePromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  assert.match(factory.defaultPromptNotes, /LD-DESIGN-PAGE-COMPOSE-CONTRACT/i);
  assert.match(factory.defaultPromptNotes, /LD-MATERIALS-COPY/i);
  assert.match(factory.defaultPromptNotes, /LD-TABLE-FIDELITY/i);
  assert.match(factory.promptTemplate, /LD-DESIGN-PAGE-COMPOSE-CONTRACT/i);
  assert.match(factory.promptTemplate, /embedded LD-MATERIALS-COPY and LD-TABLE-FIDELITY/i);
  assert.doesNotMatch(factory.promptTemplate, /FORBIDDEN inflation-collapse substitutes/i);
});

test("Design Page pack §13 38H-3: table-adjunct fidelity in notes and runtime compose", () => {
  const factory = extractDesignPagePromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  assert.match(factory.defaultPromptNotes, /LD-TABLE-FIDELITY/i);
  assert.match(factory.promptTemplate, /LD-DESIGN-PAGE-COMPOSE-CONTRACT/i);
  assert.doesNotMatch(factory.promptTemplate, /DP-TABLE-ADJ-01/i);
});

test("38S Phase 2C-a: Design Page pack defers materials rules to runtime compose", () => {
  const factory = extractDesignPagePromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  const surfaces = [
    factory.promptTemplate,
    factory.defaultPromptNotes,
    factory.runnerInstructions.what_to_check
  ];
  for (const text of surfaces) {
    assert.doesNotMatch(text, /near-verbatim/i, "must not license near-verbatim materials copy");
    assert.doesNotMatch(text, /shorten only clearly non-essential/i, "must not permit materials shortening");
  }
  assert.match(factory.promptTemplate, /Read-only composition step/i);
  assert.match(factory.promptTemplate, /LD-DESIGN-PAGE-COMPOSE-CONTRACT/i);
  assert.match(factory.promptTemplate, /never excuse material-body loss/i);
  assert.doesNotMatch(factory.promptTemplate, /FORBIDDEN inflation-collapse substitutes/i);
  assert.doesNotMatch(factory.promptTemplate, /Inflation is a sustained increase/i);
});

test("38S Phase 2C-a: runtime augmentation includes strict L4 preserve and forbidden collapse patterns", () => {
  const api = loadPrismTestApi();
  const augmented = designPageAugmentedPrompt(api);
  assert.doesNotMatch(augmented, /near-verbatim/i);
  assert.doesNotMatch(augmented, /shorten only clearly non-essential/i);
  assert.match(augmented, /FORBIDDEN inflation-collapse substitutes/i);
  assert.match(augmented, /copy activity\.materials\.\* verbatim from upstream activity_materials/i);
  assert.match(augmented, /Do not paraphrase, shorten, simplify, summarise, compress, convert, or rewrite material bodies/i);
  assert.match(augmented, /Material bodies are hard constraints/i);
  assert.match(augmented, /Do not use generation_notes\.limitations to excuse material-body loss/i);
});

test("Design Page learner page_profile does not bias materials summarisation", () => {
  const factory = extractDesignPagePromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  const learner = factory.userOptions.find((o) => o.id === "page_profile").choices.find(
    (c) => c.value === "learner"
  );
  assert.match(learner.promptInstruction, /session overview/i);
  assert.match(learner.promptInstruction, /never summary-only or placeholder-only materials/i);
});

test("Design Page runtime augmentation orders compose contract before Sprint 38 visual affordance", () => {
  const api = loadPrismTestApi();
  const augmented = designPageAugmentedPrompt(api);
  const composeIdx = augmented.search(/LD-DESIGN-PAGE-COMPOSE-CONTRACT \(auto-applied\)/i);
  const vaIdx = augmented.search(/sprint 38 visual affordance authoring contract \(auto-applied\)/i);
  assert.ok(composeIdx >= 0, "compose contract must be present");
  assert.ok(vaIdx >= 0, "Sprint 38 VA contract must be present");
  assert.ok(composeIdx < vaIdx, "compose contract must precede visual affordance block");
});

test("Design Page runtime augmentation includes compose contract with L4 preserve embed", () => {
  const api = loadPrismTestApi();
  const augmented = designPageAugmentedPrompt(api);
  assert.match(augmented, /LD-DESIGN-PAGE-COMPOSE-CONTRACT \(auto-applied\)/i);
  assert.doesNotMatch(augmented, /design page activity materials fidelity \(auto-applied\)/i);
  assert.match(augmented, /LD-MATERIALS-COPY \| Layer: L4/i);
  assert.match(augmented, /PREC-02/i);
  assert.match(augmented, /LD-TABLE-FIDELITY \| Layer: L4/i);
  assert.match(augmented, /Scenario 1,,,/i);
  assert.match(augmented, /Preserve role \(Design Page\)/i);
  assert.match(augmented, /38H-3/i);
  assert.match(augmented, /table-adjunct/i);
  assert.doesNotMatch(augmented, /LD-MATERIALS-COPY \(auto-applied\)/i);
  assert.match(augmented, /additive page-root metadata only/i);
  assert.match(augmented, /Set of scenarios/i);
  assert.match(augmented, /generated figures only/i);
  assert.match(augmented, /sprint 38 visual affordance authoring contract \(auto-applied\)/i);
});

test("Sprint 38 runtime block states affordances are additive to materials", () => {
  const api = loadPrismTestApi();
  const block = api.buildSprint38VisualAffordanceDesignPagePromptBlock();
  assert.match(block, /additive page-root metadata only/i);
  assert.match(block, /must not replace, summarise, or substitute for learning_activities\.content\[\]\.materials/i);
});

test("compose contract prompt block is idempotent on second application", () => {
  const api = loadPrismTestApi();
  const ctx = { stepCanonicalStepId: "step_design_page", stepTitle: "Design Page" };
  const once = api.applyLdDesignPageComposeContractToDraft("Base prompt", ctx);
  const twice = api.applyLdDesignPageComposeContractToDraft(once, ctx);
  assert.equal(once, twice);
  assert.equal(
    (twice.match(/LD-DESIGN-PAGE-COMPOSE-CONTRACT \(auto-applied\)/gi) || []).length,
    1
  );
});

test("Design Page compose path uses compose-only guided scaffold slice", () => {
  const api = loadPrismTestApi();
  const augmented = designPageAugmentedPrompt(api);
  assert.match(augmented, /LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT/);
  assert.match(augmented, /Design Page compose preservation/i);
  assert.match(augmented, /COMPOSE PRESERVATION \(Design Page\)/i);
  assert.doesNotMatch(augmented, /EXEMPLAR CONTRAST \(topic-specific/i);
  assert.doesNotMatch(augmented, /DLA PRE-EMIT SCAFFOLD GATE/i);
  assert.doesNotMatch(augmented, /activity_preamble \(50–120 words/i);
});
