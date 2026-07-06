/**
 * Sprint 21 — pack-defined step parameter controls (21-1 + 21-2).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

function extractJsonBlockAfterHeading(md, heading) {
  const idx = md.indexOf(heading);
  assert.ok(idx !== -1, `LD pack should contain ${heading}`);
  const fence = md.indexOf("```json", idx);
  assert.ok(fence !== -1, `json fence after ${heading}`);
  const close = md.indexOf("```", fence + 7);
  assert.ok(close !== -1);
  return JSON.parse(md.slice(fence + 7, close).trim());
}

function loadLdWorkflowBriefConfig() {
  const md = fs.readFileSync(ldPatternsPath, "utf8");
  const block = extractJsonBlockAfterHeading(md, "### Workflow Brief Config");
  return block.workflowBriefConfig;
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise
  };
  const documentStub = {
    readyState: "loading",
    addEventListener: () => {}
  };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

const sampleSelect = {
  key: "page_profile",
  canonicalStepId: "step_design_page",
  label: "Page profile",
  description: "Who the page is for.",
  controlType: "select",
  default: "learner",
  options: [
    { value: "learner", label: "Learner" },
    { value: "facilitator", label: "Facilitator" }
  ],
  visible: true,
  advanced: false,
  elicitation: "elicited"
};

test("normalizeWorkflowStepParameterControl accepts valid select metadata", () => {
  const api = loadPrismTestApi();
  const row = api.normalizeWorkflowStepParameterControl(sampleSelect);
  assert.equal(row.key, "page_profile");
  assert.equal(row.canonicalStepId, "step_design_page");
  assert.equal(row.controlType, "select");
  assert.equal(row.options.length, 2);
  assert.equal(row.options[0].value, "learner");
});

test("normalizeWorkflowStepParameterControl rejects unsupported control types", () => {
  const api = loadPrismTestApi();
  assert.equal(
    api.normalizeWorkflowStepParameterControl(
      Object.assign({}, sampleSelect, { controlType: "slider" })
    ),
    null
  );
});

test("normalizeWorkflowStepParameterControls dedupes by canonicalStepId and key", () => {
  const api = loadPrismTestApi();
  const rows = api.normalizeWorkflowStepParameterControls([
    sampleSelect,
    Object.assign({}, sampleSelect, { label: "Duplicate" }),
    Object.assign({}, sampleSelect, { key: "tone_style", elicitation: "settings-only" })
  ]);
  assert.equal(rows.length, 2);
});

test("filterWorkflowStepParameterControlsForStep filters by step and visible", () => {
  const api = loadPrismTestApi();
  const controls = api.normalizeWorkflowStepParameterControls([
    sampleSelect,
    Object.assign({}, sampleSelect, {
      key: "hidden_param",
      visible: false
    }),
    Object.assign({}, sampleSelect, {
      key: "activity_type",
      canonicalStepId: "step_design_assessment"
    })
  ]);
  const pageControls = api.filterWorkflowStepParameterControlsForStep(
    controls,
    "step_design_page"
  );
  assert.equal(pageControls.length, 1);
  assert.equal(pageControls[0].key, "page_profile");
});

test("resolveWorkflowStepParameterValue uses stored params over default", () => {
  const api = loadPrismTestApi();
  const control = api.normalizeWorkflowStepParameterControl(sampleSelect);
  assert.equal(
    api.resolveWorkflowStepParameterValue(control, { page_profile: "facilitator" }),
    "facilitator"
  );
  assert.equal(api.resolveWorkflowStepParameterValue(control, {}), "learner");
});

test("LD pack defines stepParameterControls for core LD workflow steps", () => {
  const config = loadLdWorkflowBriefConfig();
  assert.ok(Array.isArray(config.stepParameterControls));
  assert.equal(config.stepParameterControls.length, 37);
  const keys = config.stepParameterControls.map((c) => `${c.canonicalStepId}.${c.key}`);
  assert.ok(keys.includes("step_design_page.page_profile"));
  assert.ok(keys.includes("step_normalize_content.structure_mode"));
  assert.ok(keys.includes("step_model_knowledge.include_relationships"));
  assert.ok(keys.includes("step_define_learning_outcomes.learnerLevel"));
  assert.ok(keys.includes("step_design_learning_activities.activity_pattern_mix"));
  assert.ok(keys.includes("step_generate_activity_materials.session_materials"));
  assert.ok(keys.includes("step_construct_learning_sequence.sequencing_granularity"));
  assert.ok(!keys.some((k) => k.startsWith("step_generate_learning_content.")));
});

test("LD pack defines workflowParameterControls for mapped workflow constraints", () => {
  const config = loadLdWorkflowBriefConfig();
  assert.ok(Array.isArray(config.workflowParameterControls));
  assert.equal(config.workflowParameterControls.length, 4);
  const wfKeys = config.workflowParameterControls.map((c) => c.key);
  assert.ok(wfKeys.includes("delivery_context"));
  assert.ok(wfKeys.includes("design_scope"));
  assert.ok(wfKeys.includes("input_strategy"));
  assert.ok(wfKeys.includes("duration_minutes"));
});

test("getWorkflowStepParameterControlsFromBriefConfig loads LD pilot controls", () => {
  const api = loadPrismTestApi();
  const config = loadLdWorkflowBriefConfig();
  const controls = api.getWorkflowStepParameterControlsFromBriefConfig(config);
  assert.equal(controls.length, 37);
  const numberControl = controls.find(
    (c) => c.canonicalStepId === "step_generate_assessment_items" && c.key === "number_of_items"
  );
  assert.equal(numberControl.controlType, "number");
});

test("filterUserOptionsExcludingPackKeys dedupes overlapping userOptions", () => {
  const api = loadPrismTestApi();
  const controls = api.getWorkflowStepParameterControlsFromBriefConfig(loadLdWorkflowBriefConfig());
  const pageControls = api.filterWorkflowStepParameterControlsForStep(
    controls,
    "step_design_page"
  );
  const owned = api.buildPackOwnedUserOptionIdMap(pageControls);
  const filtered = api.filterUserOptionsExcludingPackKeys(
    [
      { id: "page_profile", label: "Page profile" },
      { id: "include_answers", label: "Include answers" }
    ],
    owned
  );
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, "include_answers");
});

test("mergeWorkflowStepParamValueMap and upsertWorkflowStepParamBlock persist values", () => {
  const api = loadPrismTestApi();
  const merged = api.mergeWorkflowStepParamValueMap(
    { tone_style: "academic" },
    [{ id: "page_profile", value: "facilitator" }]
  );
  assert.equal(merged.page_profile, "facilitator");
  assert.equal(merged.tone_style, "academic");
  const notes = api.upsertWorkflowStepParamBlock(
    "Author notes here.",
    api.workflowStepParamMapToSelectionRows(merged)
  );
  assert.match(notes, /\[PRISM_STEP_PARAMS\]/);
  assert.match(notes, /page_profile=facilitator/);
  const parsed = api.parseWorkflowStepParamBlock(notes);
  assert.equal(parsed.page_profile, "facilitator");
  assert.equal(parsed.tone_style, "academic");
  assert.match(notes, /Author notes here/);
});

test("select options are preserved through normalization", () => {
  const api = loadPrismTestApi();
  const toneControl = Object.assign({}, sampleSelect, {
    key: "tone_style",
    label: "Tone / style",
    options: [
      { value: "formal", label: "Formal" },
      { value: "friendly", label: "Friendly" },
      { value: "academic", label: "Academic" },
      { value: "conversational", label: "Conversational" }
    ]
  });
  const normalized = api.normalizeWorkflowStepParameterControl(toneControl);
  assert.ok(normalized.options.length >= 4);
  const values = normalized.options.map((o) => o.value);
  assert.ok(values.includes("academic"));
  assert.ok(values.includes("conversational"));
});

test("groupWorkflowStepParameterControlsForSettings splits basic and advanced", () => {
  const api = loadPrismTestApi();
  const controls = api.normalizeWorkflowStepParameterControls([
    sampleSelect,
    Object.assign({}, sampleSelect, { key: "tone_style", advanced: true }),
    Object.assign({}, sampleSelect, {
      key: "hidden_param",
      visible: false,
      advanced: true
    })
  ]);
  const visible = api.filterWorkflowStepParameterControlsForStep(
    controls,
    "step_design_page"
  );
  const sections = api.groupWorkflowStepParameterControlsForSettings(visible);
  assert.equal(sections.length, 2);
  assert.equal(sections[0].tier, "basic");
  assert.equal(sections[0].label, "Basic workflow parameters");
  assert.equal(sections[0].collapsed, false);
  assert.equal(sections[0].controls.length, 1);
  assert.equal(sections[1].tier, "advanced");
  assert.equal(sections[1].label, "Advanced workflow parameters");
  assert.equal(sections[1].collapsed, true);
  assert.equal(sections[1].controls.length, 1);
});

test("groupWorkflowStepParameterControlsForSettings preserves optional group labels", () => {
  const api = loadPrismTestApi();
  const controls = api.normalizeWorkflowStepParameterControls([
    Object.assign({}, sampleSelect, { group: "Page tuning", advanced: true }),
    Object.assign({}, sampleSelect, {
      key: "depth_level",
      group: "Page tuning",
      advanced: true
    })
  ]);
  const sections = api.groupWorkflowStepParameterControlsForSettings(controls);
  assert.equal(sections.length, 1);
  assert.equal(sections[0].label, "Page tuning");
  assert.equal(sections[0].tier, "advanced");
  assert.equal(sections[0].controls.length, 2);
});

test("hidden pack controls are excluded from render but still own userOptions keys", () => {
  const api = loadPrismTestApi();
  const controls = api.normalizeWorkflowStepParameterControls([
    sampleSelect,
    Object.assign({}, sampleSelect, { key: "hidden_param", visible: false })
  ]);
  const visible = api.filterWorkflowStepParameterControlsForStep(
    controls,
    "step_design_page"
  );
  assert.equal(visible.length, 1);
  assert.equal(visible[0].key, "page_profile");
  const allForStep = api.filterWorkflowStepParameterControlsForStep(
    controls,
    "step_design_page",
    { includeHidden: true }
  );
  assert.equal(allForStep.length, 2);
  const owned = api.buildPackOwnedUserOptionIdMap(allForStep);
  const filtered = api.filterUserOptionsExcludingPackKeys(
    [{ id: "page_profile", label: "Legacy" }],
    owned
  );
  assert.equal(filtered.length, 0);
});

const DA_CONTROL_KEYS = [
  "activity_type",
  "total_items",
  "coverage_scope",
  "difficulty_profile",
  "cognitive_demand",
  "assessment_cadence",
  "feedback_display"
];

const GEN_CONTROL_KEYS = [
  "number_of_items",
  "response_formats",
  "difficulty_profile",
  "coverage_mode",
  "composition_mode",
  "stimulus_mode",
  "scenario_scope",
  "cognitive_emphasis",
  "feedback_mode",
  "question_style_mix"
];

function loadLdPfUserOptionIds(md, sectionHeading) {
  const idx = md.indexOf(sectionHeading);
  assert.ok(idx !== -1, `LD pack should contain ${sectionHeading}`);
  const fence = md.indexOf("```json", idx);
  assert.ok(fence !== -1);
  const close = md.indexOf("```", fence + 7);
  const block = JSON.parse(md.slice(fence + 7, close).trim());
  const options = Array.isArray(block.userOptions) ? block.userOptions : [];
  return options.map((o) => o.id);
}

test("LD pack Design Assessment stepParameterControls include Sprint 23-6 authority fields", () => {
  const config = loadLdWorkflowBriefConfig();
  const da = config.stepParameterControls.filter(
    (c) => c.canonicalStepId === "step_design_assessment"
  );
  assert.equal(da.length, DA_CONTROL_KEYS.length);
  DA_CONTROL_KEYS.forEach((key) => {
    assert.ok(da.some((c) => c.key === key), `expected DA control ${key}`);
  });
});

test("LD pack Generate Assessment Items stepParameterControls include Sprint 23-6 fields", () => {
  const config = loadLdWorkflowBriefConfig();
  const gen = config.stepParameterControls.filter(
    (c) => c.canonicalStepId === "step_generate_assessment_items"
  );
  assert.equal(gen.length, GEN_CONTROL_KEYS.length);
  GEN_CONTROL_KEYS.forEach((key) => {
    assert.ok(gen.some((c) => c.key === key), `expected Gen control ${key}`);
  });
  const numberControl = gen.find((c) => c.key === "number_of_items");
  assert.equal(numberControl.elicitation, "settings-only");
});

test("LD Design Assessment PF userOptions ids match pack stepParameterControls", () => {
  const md = fs.readFileSync(ldPatternsPath, "utf8");
  const pfIds = loadLdPfUserOptionIds(md, "## 7. Design Assessment");
  const config = loadLdWorkflowBriefConfig();
  const daKeys = config.stepParameterControls
    .filter((c) => c.canonicalStepId === "step_design_assessment")
    .map((c) => c.key);
  pfIds.forEach((id) => {
    assert.ok(daKeys.includes(id), `PF userOption ${id} should match a DA control key`);
  });
  daKeys.forEach((key) => {
    if (key === "cognitive_demand" || key === "assessment_cadence") return;
    assert.ok(pfIds.includes(key), `DA control ${key} should have PF userOption when prompt-facing`);
  });
});

test("LD Generate Items PF userOptions exclude keys owned by pack stepParameterControls", () => {
  const api = loadPrismTestApi();
  const md = fs.readFileSync(ldPatternsPath, "utf8");
  const pfIds = loadLdPfUserOptionIds(md, "## 9. Generate Assessment Items");
  const config = loadLdWorkflowBriefConfig();
  const genControls = api.filterWorkflowStepParameterControlsForStep(
    api.getWorkflowStepParameterControlsFromBriefConfig(config),
    "step_generate_assessment_items",
    { includeHidden: true }
  );
  const owned = api.buildPackOwnedUserOptionIdMap(genControls);
  const filtered = api.filterUserOptionsExcludingPackKeys(
    pfIds.map((id) => ({ id, label: id })),
    owned
  );
  assert.equal(filtered.length, 0);
});

test("aggregateUnifiedWorkflowParameterSections includes expanded Design Assessment controls", () => {
  const api = loadPrismTestApi();
  const config = loadLdWorkflowBriefConfig();
  const wf = {
    id: "wf-da",
    name: "Assessment workflow",
    steps: [
      {
        id: "da1",
        title: "Design Assessment",
        canonical_step_id: "step_design_assessment",
        notes: "[PRISM_STEP_PARAMS]\nactivity_type=mcq\ntotal_items=10\n[/PRISM_STEP_PARAMS]"
      },
      {
        id: "gen1",
        title: "Generate Assessment Items",
        canonical_step_id: "step_generate_assessment_items",
        notes: ""
      }
    ]
  };
  const result = api.aggregateUnifiedWorkflowParameterSections(wf, config);
  const assessment = result.steps.find((s) => s.canonicalStepId === "step_design_assessment");
  assert.ok(assessment);
  assert.equal(assessment.controls.length, DA_CONTROL_KEYS.length);
  const gen = result.steps.find((s) => s.canonicalStepId === "step_generate_assessment_items");
  assert.ok(gen);
  assert.equal(gen.controls.length, GEN_CONTROL_KEYS.length);
});

test("resolveAssessmentItemsInheritedOptions reads canonical DA keys", () => {
  const api = loadPrismTestApi();
  const wf = {
    id: "wf-inherit",
    name: "Inherit test",
    steps: [
      {
        id: "da1",
        title: "Design Assessment",
        canonical_step_id: "step_design_assessment",
        notes:
          "[PRISM_STEP_PARAMS]\nactivity_type=mcq\ntotal_items=10\ndifficulty_profile=balanced\ncoverage_scope=balanced\n[/PRISM_STEP_PARAMS]"
      },
      {
        id: "gen1",
        title: "Generate Assessment Items",
        canonical_step_id: "step_generate_assessment_items",
        notes: ""
      }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest("wf-inherit");
  const resolved = api.resolveAssessmentItemsInheritedOptions(
    {
      workflowId: "wf-inherit",
      stepId: "gen1",
      stepCanonicalStepId: "step_generate_assessment_items",
      stepTitle: "Generate Assessment Items"
    },
    {},
    { allowInheritedOverrides: true }
  );
  assert.equal(resolved.response_formats, "single_answer_mcq");
  assert.equal(resolved.number_of_items, "10");
  assert.equal(resolved.difficulty_profile, "balanced");
  assert.equal(resolved.coverage_mode, "balanced");
});

test("resolveAssessmentItemsInheritedOptions supports legacy DA PF keys", () => {
  const api = loadPrismTestApi();
  const wf = {
    id: "wf-legacy",
    name: "Legacy inherit",
    steps: [
      {
        id: "da1",
        title: "Design Assessment",
        canonical_step_id: "step_design_assessment",
        notes:
          "[PRISM_STEP_PARAMS]\nactivity_type=mcq\ntotal_items=10\ndifficulty_level=moderate\ncoverage_breadth=balanced\n[/PRISM_STEP_PARAMS]"
      },
      {
        id: "gen1",
        title: "Generate Assessment Items",
        canonical_step_id: "step_generate_assessment_items",
        notes: ""
      }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest("wf-legacy");
  const resolved = api.resolveAssessmentItemsInheritedOptions(
    {
      workflowId: "wf-legacy",
      stepId: "gen1",
      stepCanonicalStepId: "step_generate_assessment_items"
    },
    {},
    { allowInheritedOverrides: true }
  );
  assert.equal(resolved.difficulty_profile, "balanced");
  assert.equal(resolved.coverage_mode, "balanced");
});

test("resolveWorkflowSettingsParamLabel prefers pack metadata with fallback", () => {
  const api = loadPrismTestApi();
  const config = loadLdWorkflowBriefConfig();
  assert.equal(
    api.resolveWorkflowSettingsParamLabel(
      "page_profile",
      "step_design_page",
      config
    ),
    "Page profile"
  );
  assert.equal(
    api.resolveWorkflowSettingsParamLabel(
      "unknown_param",
      "step_design_page",
      config
    ),
    "unknown param"
  );
  assert.equal(
    api.resolveWorkflowSettingsParamLabel("page_profile", "", config),
    "Page profile"
  );
});
