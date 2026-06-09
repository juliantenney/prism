/**
 * Sprint 38 — LD compose visual affordance emission and validation.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const s38LibPath = path.join(repoRoot, "lib", "sprint38-visual-affordances.js");
const appJsPath = path.join(repoRoot, "app.js");
const recordsPath = path.join(repoRoot, "tests", "fixtures", "sprint-38", "affordance-records.json");
const inflationPagePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "ld-inflation-workshop-page-full.json"
);
const climatePagePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "ld-climate-misconception-discussion-page.json"
);
const ciPagePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "confidence-interval-a2-multitable-page.json"
);

const s38 = require(s38LibPath);
const records = JSON.parse(fs.readFileSync(recordsPath, "utf8"));

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

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const s38Source = fs.readFileSync(s38LibPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
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
  vm.runInContext(s38Source, sandbox, { filename: "sprint38-visual-affordances.js" });
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

function pageWithAffordances(basePage, affordanceList, reviewList) {
  const page = JSON.parse(JSON.stringify(basePage));
  page.visual_affordance_schema_version = "38.4";
  page.activities_visual_review = reviewList;
  page.visual_affordances = affordanceList.map((r) => JSON.parse(JSON.stringify(r)));
  return page;
}

const inflationReview = [
  { activity_id: "A2", activity_visual_value: { decision: "high", rationale: "Index confusion supports comparison_table." } },
  { activity_id: "A5", activity_visual_value: { decision: "none", rationale: "Debrief-only; no figure job." } }
];

test("validate: inflation A2 generate passes 38-4 contract", () => {
  const page = {
    visual_affordances: [records.inflation_a2_generate],
    activities_visual_review: inflationReview
  };
  const result = s38.validatePageVisualAffordances(page);
  assert.equal(result.valid, true, result.errors.join("; "));
  assert.equal(result.validRecords.length, 1);
  assert.equal(result.validRecords[0].purpose, "distinction");
  assert.equal(result.validRecords[0].preferred_representation, "comparison_framework");
});

test("validate: climate mechanism generate passes", () => {
  const page = {
    visual_affordances: [records.climate_mechanism_generate],
    activities_visual_review: [
      {
        activity_id: "CC-MIS-1",
        activity_visual_value: { decision: "high", rationale: "Mechanism before evidence template." }
      }
    ]
  };
  const result = s38.validatePageVisualAffordances(page);
  assert.equal(result.valid, true, result.errors.join("; "));
  assert.equal(result.validRecords[0].purpose, "mechanism");
  assert.equal(result.validRecords[0].preferred_representation, "causal_model");
});

test("validate: CI A4 number_line_segments requires exact data match", () => {
  const page = { visual_affordances: [records.ci_a4_generate] };
  const result = s38.validatePageVisualAffordances(page);
  assert.equal(result.valid, true, result.errors.join("; "));
  assert.equal(result.validRecords[0].requires_exact_data_match, true);
  assert.equal(result.validRecords[0].preferred_representation, "number_line_segments");
});

test("validate: inflation A5 reject passes", () => {
  const page = { visual_affordances: [records.inflation_a5_reject] };
  const result = s38.validatePageVisualAffordances(page);
  assert.equal(result.valid, true, result.errors.join("; "));
  assert.equal(result.validRecords[0].rejection_reason, "debrief_without_new_reasoning");
});

test("validate: topic-only affordance fails", () => {
  const page = { visual_affordances: [records.topic_only_invalid] };
  const result = s38.validatePageVisualAffordances(page);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => /topic-only|purpose|preferred_representation/i.test(e)));
});

test("validate: invalid purpose fails", () => {
  const bad = JSON.parse(JSON.stringify(records.inflation_a2_generate));
  bad.purpose = "topic_poster";
  const result = s38.validatePageVisualAffordances({ visual_affordances: [bad] });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => /purpose must be one of/i.test(e)));
});

test("validate: number_line without exact match fails", () => {
  const bad = JSON.parse(JSON.stringify(records.ci_a4_generate));
  bad.requires_exact_data_match = false;
  const result = s38.validatePageVisualAffordances({ visual_affordances: [bad] });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => /requires_exact_data_match must be true/i.test(e)));
});

test("applyToComposedPage: drops invalid and sets schema version", () => {
  const page = {
    artifact_type: "page",
    title: "Test",
    visual_affordances: [records.inflation_a2_generate, records.topic_only_invalid]
  };
  const next = s38.applyToComposedPage(page, { strictValidation: true });
  assert.equal(next.visual_affordance_schema_version, "38.4");
  assert.equal(next.visual_affordances.length, 1);
  assert.equal(next.visual_affordances[0].affordance_id, "va-A2-cpi-deflator-distinction");
  assert.ok(next.generation_notes.visual_affordance_validation.dropped_count >= 1);
});

test("integration: applyPedagogicCognitionSemantics preserves valid affordances on inflation page", () => {
  const api = loadPrismTestApi();
  const base = JSON.parse(fs.readFileSync(inflationPagePath, "utf8"));
  const page = pageWithAffordances(
    base,
    [records.inflation_a2_generate, records.inflation_a5_reject],
    inflationReview
  );
  const upstream = base.sections.find((s) => s.section_id === "learning_activities").content;
  const next = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    upstreamLearningActivities: upstream
  });
  assert.equal(next.visual_affordance_schema_version, "38.4");
  assert.ok(Array.isArray(next.activities_visual_review));
  assert.equal(next.activities_visual_review.length, 2);
  assert.equal(next.visual_affordances.length, 2);
  const a2 = s38.findAffordance(next, (r) => r.activity_id === "A2");
  assert.equal(a2.visual_decision, "generate");
  assert.equal(a2.purpose, "distinction");
  const a5 = s38.findAffordance(next, (r) => r.activity_id === "A5");
  assert.equal(a5.visual_decision, "reject");
  assert.equal(a5.rejection_reason, "debrief_without_new_reasoning");
});

test("integration: climate page affordances survive compose pass", () => {
  const api = loadPrismTestApi();
  const base = JSON.parse(fs.readFileSync(climatePagePath, "utf8"));
  const page = pageWithAffordances(
    base,
    [records.climate_mechanism_generate],
    [
      {
        activity_id: "CC-MIS-1",
        activity_visual_value: { decision: "high", rationale: "Mechanism before evidence." }
      }
    ]
  );
  const upstream = base.sections.find((s) => s.section_id === "learning_activities").content;
  const next = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    upstreamLearningActivities: upstream
  });
  const row = s38.findAffordance(next, (r) => r.activity_id === "CC-MIS-1");
  assert.equal(row.purpose, "mechanism");
  assert.equal(row.preferred_representation, "causal_model");
});

test("integration: CI page A4 quantitative affordance survives compose pass", () => {
  const api = loadPrismTestApi();
  const base = JSON.parse(fs.readFileSync(ciPagePath, "utf8"));
  const page = pageWithAffordances(base, [records.ci_a4_generate], [
    {
      activity_id: "A4",
      activity_visual_value: { decision: "high", rationale: "Interval overlap from scenario table." }
    }
  ]);
  const upstream = base.sections.find((s) => s.section_id === "learning_activities").content;
  const next = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    upstreamLearningActivities: upstream
  });
  const row = s38.findAffordance(next, (r) => r.activity_id === "A4");
  assert.equal(row.purpose, "data_pattern_reading");
  assert.equal(row.preferred_representation, "number_line_segments");
  assert.equal(row.requires_exact_data_match, true);
});

const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

function extractDesignPagePromptFactory(md) {
  const section = md.match(/## 13\. Design Page[\s\S]*?### Prompt Factory\s*```json\s*([\s\S]*?)\s*```/);
  assert.ok(section, "Design Page Prompt Factory JSON block");
  return JSON.parse(section[1].trim());
}

test("Design Page pack lists visual affordance output keys", () => {
  const pack = fs.readFileSync(ldPatternsPath, "utf8");
  assert.match(pack, /visual_affordance_schema_version/);
  assert.match(pack, /activities_visual_review/);
  assert.match(pack, /visual_affordances/);
  assert.match(pack, /VISUAL AFFORDANCES:/i);
});

test("Design Page promptTemplate: Sprint 38 runtime reference and mandatory root keys", () => {
  const factory = extractDesignPagePromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  const template = String(factory.promptTemplate || "");
  assert.match(template, /VISUAL AFFORDANCES: mandatory page-root metadata only/i);
  assert.match(template, /runtime Sprint 38 visual affordance contract/i);
  assert.doesNotMatch(template, /hooks are not opportunities/i);
  assert.match(template, /visual_affordance_schema_version \(required; must be "38\.4"\)/i);
  assert.match(template, /activities_visual_review \(required array; emit \[\] when no rows\)/i);
  assert.match(template, /visual_affordances \(required array; emit \[\] when no decisions/i);
});

test("Design Page seeded prompt includes Sprint 38 runtime reference and output keys", () => {
  const api = loadPrismTestApi();
  const factory = extractDesignPagePromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  const prompt = api.buildSeededStepPromptForWorkflowStep({
    workflowName: "Inflation workshop",
    workflowGoal: "Learner workshop page",
    step: {
      id: "dp1",
      title: "Design Page",
      canonical_step_id: "step_design_page",
      outputName: "page",
      inputBindings: [
        { artifactName: "learning_activities", kind: "internal" },
        { artifactName: "activity_materials", kind: "internal" }
      ]
    },
    matchedPattern: { promptFactory: factory }
  });
  assert.match(prompt, /VISUAL AFFORDANCES: mandatory page-root metadata only/i);
  assert.match(prompt, /activities_visual_review \(required array; emit \[\] when no rows\)/i);
  assert.match(prompt, /visual_affordances \(required array; emit \[\] when no decisions/i);
});

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
    { goal: "Learner page", desiredOutputs: "Learner-facing page" }
  );
}

test("Design Page runtime augmentation includes Sprint 38 authoring contract and examples", () => {
  const api = loadPrismTestApi();
  const augmented = designPageAugmentedPrompt(api);
  assert.match(augmented, /LD-DESIGN-PAGE-COMPOSE-CONTRACT \(auto-applied\)/i);
  assert.match(augmented, /additive page-root metadata only/i);
  assert.match(augmented, /sprint 38 visual affordance authoring contract \(auto-applied\)/i);
  assert.match(augmented, /Sprint 38 pedagogical added-value contract \(auto-applied\)/i);
  assert.match(augmented, /pedagogical_added_value/i);
  assert.match(augmented, /Example generate record/i);
  assert.match(augmented, /"affordance_id": "va-A3-classification-01"/);
  assert.match(augmented, /Example reject record/i);
  assert.match(augmented, /"rejection_reason": "assessment_text_sufficient"/);
  assert.match(augmented, /Example defer record/i);
  assert.match(augmented, /"defer_reason": "worked_example_sufficient_first"/);
  assert.match(augmented, /anti_spoiler and requires_exact_data_match are JSON booleans/i);
  assert.match(augmented, /tier \(generate only\): essential or valuable only/i);
  assert.match(augmented, /representation_avoid \(generate only\): use only allow-listed tokens/i);
  assert.match(augmented, /never prose labels such as "simple list"/i);
  assert.match(augmented, /generate rows must include: affordance_id, activity_id, visual_decision, rationale, visual_slot/i);
  assert.match(augmented, /hooks are not opportunities/i);
});

test("buildSprint38VisualAffordanceDesignPagePromptBlock includes valid JSON examples", () => {
  const api = loadPrismTestApi();
  const block = api.buildSprint38VisualAffordanceDesignPagePromptBlock();
  assert.match(block, /"visual_decision": "generate"/);
  assert.match(block, /"anti_spoiler": true/);
  assert.match(block, /"visual_slot": "materials-entry"/);
  assert.match(block, /"visual_decision": "reject"/);
  assert.match(block, /"visual_decision": "defer"/);
});

test("validate: inflation-like invalid model shape fails and drops on compose", () => {
  const page = {
    artifact_type: "page",
    title: "Invalid inflation shape",
    visual_affordances: [records.inflation_invalid_model_shape]
  };
  const result = s38.validatePageVisualAffordances(page);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => /anti_spoiler must be boolean/i.test(e)));
  assert.ok(result.errors.some((e) => /tier must be essential/i.test(e)));
  assert.ok(
    result.errors.some((e) => /representation_avoid\[\d+\] must be one of/i.test(e))
  );
  const next = s38.applyToComposedPage(page, { strictValidation: true });
  assert.equal(next.visual_affordances.length, 0);
  assert.ok(
    (next.generation_notes.limitations || []).some((line) =>
      /\[PRISM visual affordance\] Dropped invalid affordance/i.test(line)
    )
  );
});

test("validate: inflation A3 generate fixture passes 38-4 contract", () => {
  const page = { visual_affordances: [records.inflation_a3_generate] };
  const result = s38.validatePageVisualAffordances(page);
  assert.equal(result.valid, true, result.errors.join("; "));
  const next = s38.applyToComposedPage(page, { strictValidation: true });
  assert.equal(next.visual_affordances.length, 1);
  assert.equal(next.visual_affordances[0].activity_id, "A3");
  assert.equal(next.visual_affordances[0].purpose, "classification");
});

test("integration: valid A3 affordance survives compose pass on inflation page", () => {
  const api = loadPrismTestApi();
  const base = JSON.parse(fs.readFileSync(inflationPagePath, "utf8"));
  const page = pageWithAffordances(base, [records.inflation_a3_generate], [
    {
      activity_id: "A3",
      activity_visual_value: {
        decision: "high",
        rationale: "Classification matrix supports scenario analysis before table completion."
      }
    }
  ]);
  const upstream = base.sections.find((s) => s.section_id === "learning_activities").content;
  const next = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    upstreamLearningActivities: upstream
  });
  const row = s38.findAffordance(next, (r) => r.activity_id === "A3");
  assert.equal(row.visual_decision, "generate");
  assert.equal(row.visual_slot, "materials-entry");
  assert.equal(row.preferred_representation, "classification_matrix");
});

test("applyToComposedPage: empty arrays still set schema version at root", () => {
  const page = {
    artifact_type: "page",
    title: "Empty affordances",
    sections: []
  };
  const next = s38.applyToComposedPage(page, { strictValidation: true });
  assert.equal(next.visual_affordance_schema_version, "38.4");
  assert.deepEqual(next.activities_visual_review, []);
  assert.deepEqual(next.visual_affordances, []);
});

test("integration: compose pass preserves empty visual affordance root keys", () => {
  const api = loadPrismTestApi();
  const base = JSON.parse(fs.readFileSync(inflationPagePath, "utf8"));
  delete base.visual_affordance_schema_version;
  delete base.activities_visual_review;
  delete base.visual_affordances;
  const upstream = base.sections.find((s) => s.section_id === "learning_activities").content;
  const next = api.applyPedagogicCognitionSemanticsToComposedPage(base, {
    upstreamLearningActivities: upstream
  });
  assert.equal(next.visual_affordance_schema_version, "38.4");
  assert.ok(Array.isArray(next.activities_visual_review));
  assert.equal(next.activities_visual_review.length, 0);
  assert.ok(Array.isArray(next.visual_affordances));
  assert.equal(next.visual_affordances.length, 0);
});

test("applyToComposedPage: invalid affordance reported in generation_notes limitations", () => {
  const page = {
    artifact_type: "page",
    title: "Invalid row",
    visual_affordances: [records.topic_only_invalid]
  };
  const next = s38.applyToComposedPage(page, { strictValidation: true });
  assert.equal(next.visual_affordances.length, 0);
  assert.ok(
    (next.generation_notes.limitations || []).some((line) =>
      /\[PRISM visual affordance\] Dropped invalid affordance/i.test(line)
    )
  );
});
