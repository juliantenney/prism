const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS
} = require("./prism-vm-lib-bootstrap.js");

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add() {},
      remove() {},
      contains() { return false; },
      toggle() { return false; }
    },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() { return null; },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {}
  };
}

function loadPrismRuntime() {
  const canonical = require(path.join(root, "lib", "assessment-pack-canonical.js"));
  const publish = require(path.join(root, "lib", "assessment-pack-publish.js"));
  const family = require(path.join(root, "lib", "first-class-workflow-family.js"));

  const source = fs.readFileSync(path.join(root, "app.js"), "utf8");
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
    setTimeout,
    clearTimeout,
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem() {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
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
  runPrismLibScriptsInSandbox(
    sandbox,
    root,
    PEDAGOGICAL_ICON_LIBS.concat([
      "lib/assessment-pack-canonical.js",
      "lib/assessment-pack-publish.js",
      "lib/first-class-workflow-family.js",
      "lib/workload-feasibility-estimator.js",
      "lib/assessment-pack-workload-feasibility-adapter.js",
      "lib/page-shell-create.js",
      "lib/page-vnext-assemble.js"
    ])
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return {
    api,
    canonical,
    publish,
    family
  };
}

function makeCanonicalFourStageWorkflow(overrides = {}) {
  return Object.assign(
    {
      id: "wf-ap-c7",
      title: "C7 Assessment Pack",
      product: "assessment_pack",
      steps: [
        {
          id: "s1",
          canonical_step_id: "step_interpret_evidence_purpose",
          outputName: "assessment_evidence_purpose",
          title: "Interpret Evidence Purpose"
        },
        {
          id: "s2",
          canonical_step_id: "step_design_evidence_elicitation",
          outputName: "assessment_evidence_elicitation",
          title: "Design Evidence Elicitation"
        },
        {
          id: "s3",
          canonical_step_id: "step_author_formative_return",
          outputName: "assessment_formative_return",
          title: "Author Formative Return"
        },
        {
          id: "s4",
          canonical_step_id: "step_design_page",
          outputName: "page",
          title: "Design Page"
        }
      ]
    },
    overrides
  );
}

function makeLegacyAssessmentPackWorkflow() {
  return {
    id: "wf-ap-legacy",
    title: "Legacy Assessment Pack",
    product: "assessment_pack",
    steps: [
      { id: "s1", outputName: "assessment_pack", title: "Generate Assessment Pack" },
      { id: "s2", canonical_step_id: "step_design_page", outputName: "page", title: "Design Page" }
    ]
  };
}

function makeValidCanonicalAssessmentPage(overrides = {}) {
  const base = {
    schema_version: "2.0.0",
    artifact_type: "page",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Project Brief Readiness Check",
    framing: "Use this formative check to build and retain your concise project scoping brief.",
    attempt_instructions: "Complete the response, review the criteria, and generate your brief.",
    activities: [],
    sections: [],
    assessment_evidence: {
      purpose: {
        role: "R1",
        visibility_claim: "Whether the learner can formulate a scoped project brief grounded in evidence.",
        stop_rationale: "A short formative stop to build the brief before downstream workshop use.",
        forward_intent: "The learner leaves with a retained brief they can refine and carry forward."
      },
      learner_context: { depends_on_prior_work: false },
      elicitations: [
        {
          elicitation_id: "el_scope",
          order: 1,
          evidence_ask: "Define measurable project scope boundaries.",
          epistemic_class: "non_determinate",
          delivery: {
            kind: "constructed_performance",
            prompt: "Draft a 150-word project scope statement naming two measurable success criteria.",
            guidance: "Keep criteria observable and time-bound.",
            indicative_time: "5 minutes",
            response_workspace: {
              intention: "Draft a concise project scope statement in your own words."
            }
          },
          formative_return: {
            materials: [
              {
                material_id: "el_scope-review",
                body: "Verify that both in-scope and out-of-scope boundaries are explicit and measurable."
              }
            ],
            forward_orientation: "Refine your scope statement before generating your retained brief."
          }
        }
      ],
      pack_forward_orientation: "Review and refine your brief before carrying it into the workshop.",
      output_specification: {
        specification_id: "project_scoping_brief",
        artefact_title: "Project Scoping Brief",
        audience: "learner",
        purpose: "Retain the learner's current scoped brief for downstream workshop use.",
        action_label: "Generate Project Scoping Brief",
        missing_response_text: "Not yet entered.",
        sections: [
          {
            section_id: "sec_scope",
            order: 1,
            heading: "Scope and Success Criteria",
            contributions: [
              {
                contribution_id: "contrib_scope",
                label: "Scope statement",
                elicitation_id: "el_scope",
                response_part: "response_text"
              }
            ]
          }
        ]
      }
    }
  };
  return Object.assign(base, overrides);
}

test("Stage 4 canonical prompt includes required output_specification fields and valid example for BOTH structuredArtefact modes", () => {
  const canonical = require(path.join(root, "lib", "assessment-pack-canonical.js"));
  const family = require(path.join(root, "lib", "first-class-workflow-family.js"));

  const cases = [
    {
      label: "structuredArtefact=true",
      focus:
        "Learning Journey commissioning brief. The learner should leave with a structured brief they can copy into the next workflow as the specification."
    },
    {
      label: "structuredArtefact=false",
      focus: "Check how well the learner can identify a prior probability before new evidence."
    }
  ];

  for (const c of cases) {
    const built = family.buildFirstClassWorkflowFamily({
      product: "assessment_pack",
      focus: c.focus,
      startingPoint: "topic"
    });
    const designStep = built.steps[6];
    assert.ok(designStep && designStep.promptBody, `Expected Design Page promptBody (${c.label})`);
    const text = designStep.promptBody;

    for (const token of [
      "output_specification",
      "specification_id",
      "artefact_title",
      "audience",
      "purpose",
      "action_label",
      "missing_response_text",
      "section_id",
      "order",
      "heading",
      "contributions",
      "contribution_id",
      "label",
      "elicitation_id",
      "response_part"
    ]) {
      assert.ok(
        text.includes(token),
        `Expected Stage 4 prompt (${c.label}) to include "${token}"`
      );
    }

    const jsonMatch = text.match(/Canonical output_specification JSON example[^:]*:\s*(\{"specification_id":[^\n]+\})/);
    assert.ok(
      jsonMatch,
      `Expected Stage 4 prompt (${c.label}) to embed a canonical output_specification JSON example`
    );
    const parsedExample = JSON.parse(jsonMatch[1]);
    const referencedElId = parsedExample.sections[0].contributions[0].elicitation_id;

    const pageWithExample = makeValidCanonicalAssessmentPage();
    pageWithExample.assessment_evidence.elicitations[0].elicitation_id = referencedElId;
    pageWithExample.assessment_evidence.output_specification = parsedExample;

    const validated = canonical.validateAssessmentPackCanonicalPage(pageWithExample);
    assert.equal(
      validated.ok,
      true,
      `Canonical example from prompt (${c.label}) must pass validation: ${JSON.stringify(validated.errors)}`
    );
  }
});

test("Stage 4 capture rejects C7 missing output_specification fields (section_id, order, contribution_id) at both paste/save and step advance", () => {
  const { api } = loadPrismRuntime();
  const wf = makeCanonicalFourStageWorkflow();
  const designStep = wf.steps[3];

  const c7Malformed = makeValidCanonicalAssessmentPage();
  c7Malformed.assessment_evidence.output_specification = {
    specification_id: "c7_artefact",
    artefact_title: "C7 Retained Artefact",
    audience: "learner",
    purpose: "Retain learner work.",
    action_label: "Generate Artefact",
    missing_response_text: "Not yet entered.",
    sections: [
      {
        heading: "Section One",
        contributions: [
          {
            label: "Scope statement",
            elicitation_id: "el_scope",
            response_part: "response_text"
          }
        ]
      }
    ]
  };
  const raw = JSON.stringify(c7Malformed);

  // Paste/save gate
  const pasteCheck = api.validateStrictJsonWorkflowRunStepCaptureForTest(raw, designStep, wf);
  assert.equal(pasteCheck.ok, false);
  const pasteErrText = (pasteCheck.errors || []).join(" | ");
  assert.match(pasteErrText, /section_id/);
  assert.match(pasteErrText, /order/);
  assert.match(pasteErrText, /contribution_id/);

  // Step advance gate
  const advanceCheck = api.parseWorkflowRunPageStructureCaptureForStorage(raw, designStep, wf);
  assert.equal(advanceCheck.ok, false);
  const advanceErrText = (advanceCheck.errors || []).join(" | ");
  assert.match(advanceErrText, /section_id/);
  assert.match(advanceErrText, /order/);
  assert.match(advanceErrText, /contribution_id/);
});

test("Stage 4 capture accepts valid canonical Design Pages and preserves workload, determinate-key, and structured-stimulus checks", () => {
  const { api } = loadPrismRuntime();
  const wf = makeCanonicalFourStageWorkflow();
  const designStep = wf.steps[3];

  // 1. Valid canonical page with workload overload -> accepted with non-blocking advisory warning
  const overloadedValid = makeValidCanonicalAssessmentPage();
  overloadedValid.assessment_evidence.elicitations[0].delivery.prompt =
    "Write a 400-word evidence-based recommendation evaluating the stakeholder trade-offs.";
  overloadedValid.assessment_evidence.elicitations[0].delivery.indicative_time = "3 minutes";

  const pasteValid = api.validateStrictJsonWorkflowRunStepCaptureForTest(
    JSON.stringify(overloadedValid),
    designStep,
    wf
  );
  assert.equal(pasteValid.ok, true, (pasteValid.errors || []).join("; "));
  assert.ok(Array.isArray(pasteValid.warnings) && pasteValid.warnings.length >= 1);
  assert.match(pasteValid.warnings[0], /Workload feasibility/);

  const advanceValid = api.parseWorkflowRunPageStructureCaptureForStorage(
    JSON.stringify(overloadedValid),
    designStep,
    wf
  );
  assert.equal(advanceValid.ok, true, (advanceValid.errors || []).join("; "));
  assert.ok(Array.isArray(advanceValid.warnings) && advanceValid.warnings.length >= 1);

  // 2. Structured stimulus missing qualification -> rejected
  const badStimulus = makeValidCanonicalAssessmentPage();
  badStimulus.assessment_evidence.elicitations[0].delivery.stimulus = {
    scenario: "A team must pick a rollout path.",
    alternatives: [{ label: "Option A", description: "Phased launch" }],
    evidence: [{ heading: "Pilot note", information: "Pilot passed", qualification: "" }]
  };
  const stimCheck = api.parseAssessmentPackDesignPageCaptureForStorage(
    JSON.stringify(badStimulus),
    wf
  );
  assert.equal(stimCheck.ok, false);
  assert.match((stimCheck.errors || []).join(" | "), /qualification/);
});

test("Canonical four-stage Assessment Pack publication fails closed without falling back to legacy assembly", () => {
  const { api, publish } = loadPrismRuntime();
  const canonicalWf = makeCanonicalFourStageWorkflow();
  const legacyWf = makeLegacyAssessmentPackWorkflow();

  assert.equal(api.isCanonicalFourStageAssessmentPackWorkflow(canonicalWf), true);
  assert.equal(api.isCanonicalFourStageAssessmentPackWorkflow(legacyWf), false);

  // Malformed canonical Design Page omitting both product_id and assessment_evidence
  const malformedPage = {
    schema_version: "2.0.0",
    artifact_type: "page",
    title: "Broken Stage 4 Page",
    activities: []
  };

  // Canonical four-stage workflow passes requireCanonical: true -> MUST fail with assessment_evidence_invalid, NOT legacy assessment_pack_required
  const res = publish.resolveAssessmentPackPublishPage({
    page: malformedPage,
    designPage: malformedPage,
    assessmentPack: null,
    requireCanonical: true
  });
  assert.equal(res.ok, false);
  assert.equal(res.code, "assessment_evidence_invalid");
  assert.ok(Array.isArray(res.errors) && res.errors.length > 0);
  assert.notEqual(res.code, "assessment_pack_required");

  // Also rejected at Stage 4 capture when workflow is canonical 4-stage
  const captureRes = api.parseAssessmentPackDesignPageCaptureForStorage(
    JSON.stringify(malformedPage),
    canonicalWf
  );
  assert.equal(captureRes.ok, false);
  assert.match((captureRes.errors || []).join(" | "), /product_id|assessment_evidence/);
});

test("Genuine legacy Assessment Pack publication remains preserved when requireCanonical is not set", () => {
  const publish = require(path.join(root, "lib", "assessment-pack-publish.js"));

  const legacyDesignPage = {
    schema_version: "2.0.0",
    artifact_type: "page",
    title: "Legacy Self-Study Check",
    framing: "Check your understanding of the core definitions.",
    activities: []
  };
  const legacyAssessmentPack = {
    schema_version: "1.0.0",
    artifact_type: "assessment_pack",
    components: [
      {
        component_id: "c1",
        type: "short_response",
        prompt: "State one benefit of scoping a project early.",
        model_answer: "It prevents uncontrolled scope creep."
      }
    ]
  };

  const res = publish.resolveAssessmentPackPublishPage({
    designPage: legacyDesignPage,
    assessmentPack: legacyAssessmentPack
  });
  assert.equal(res.ok, true, res.message);
  assert.equal(res.source, "legacy_assessment_check");
  assert.equal(res.page.artifact_type, "page");
});

test("Live Copy path (resolveStepPromptText + buildWorkflowStepInstructions) upgrades stale pre-fix C7 Step 4 prompts without duplicating the contract", () => {
  const { api, canonical } = loadPrismRuntime();

  const staleC7DesignPrompt = [
    "Return JSON only with artifact_type \"page\", schema_version \"2.0.0\", product_id \"assessment_pack\", page_kind \"assessment\", title, activities [], and assessment_evidence.",
    "This commission does not ask for a structured learner-owned artefact. Omit output_specification unless the grounding context explicitly requires the learner to retain, reuse, or copy a structured output of their own words; then emit assessment_evidence.output_specification with closed fields only (specification_id, artefact_title, audience, purpose, action_label, missing_response_text, sections) mapped only to elicitations already designed."
  ].join("\n\n");

  const staleC7Workflow = makeCanonicalFourStageWorkflow();
  staleC7Workflow.steps[3].promptSourceType = "local_override";
  staleC7Workflow.steps[3].overridePromptBody = staleC7DesignPrompt;
  const designStep = staleC7Workflow.steps[3];

  // 1. resolveStepPromptText upgrades the stale saved prompt body
  const resolved = api.resolveStepPromptText(designStep, staleC7Workflow);
  assert.ok(resolved && resolved.text, "Expected resolved Step 4 prompt text");
  for (const token of [
    "section_id",
    "order",
    "heading",
    "contributions",
    "contribution_id",
    "label",
    "elicitation_id",
    "response_part",
    "Canonical output_specification JSON example",
    "does NOT conflict with preserving upstream content"
  ]) {
    assert.ok(
      resolved.text.includes(token),
      `Expected resolveStepPromptText on stale C7 step to include "${token}"`
    );
  }

  // 2. Live Copy path (buildWorkflowStepInstructions) delivers the upgraded contract
  //    with the canonical JSON example exactly once (no duplication)
  api.setWorkflowsForTest([staleC7Workflow]);
  api.setSelectedWorkflowIdForTest(staleC7Workflow.id);
  const copied = api.buildWorkflowStepInstructions(designStep, 3, null);
  assert.ok(copied && typeof copied === "string", "Expected live Copy prompt text");
  for (const token of [
    "section_id",
    "order",
    "contribution_id",
    "Canonical output_specification JSON example"
  ]) {
    assert.ok(copied.includes(token), `Expected live Copy output to include "${token}"`);
  }

  const exampleMatches = copied.match(/Canonical output_specification JSON example/g) || [];
  assert.equal(
    exampleMatches.length,
    1,
    `Expected canonical output_specification example once in live Copy output, found ${exampleMatches.length}`
  );

  const jsonMatch = copied.match(
    /Canonical output_specification JSON example[^:]*:\s*(\{"specification_id":[^\n]+\})/
  );
  assert.ok(jsonMatch, "Expected parseable canonical output_specification JSON example in live Copy output");
  const parsedExample = JSON.parse(jsonMatch[1]);
  const referencedElId = parsedExample.sections[0].contributions[0].elicitation_id;
  const pageWithExample = makeValidCanonicalAssessmentPage();
  pageWithExample.assessment_evidence.elicitations[0].elicitation_id = referencedElId;
  pageWithExample.assessment_evidence.output_specification = parsedExample;
  const validated = canonical.validateAssessmentPackCanonicalPage(pageWithExample);
  assert.equal(
    validated.ok,
    true,
    `Canonical example in live Copy output must pass validation: ${JSON.stringify(validated.errors)}`
  );
});

test("Stage 2 and Stage 4 prompts and live Copy path include canonical scatterplot representation contract", () => {
  const { api, family } = loadPrismRuntime();
  const built = family.buildFirstClassWorkflowFamily({
    product: "assessment_pack",
    focus: "Evaluate a transport and employment claim using two scatterplot panels.",
    startingPoint: "topic"
  });
  const stage2Prompt = built.steps[4].promptBody;
  for (const token of [
    "Canonical scatterplot representation contract",
    "authoritative_data",
    "columns",
    "observations",
    "plot_specification",
    "variable_id",
    "accessible_equivalent",
    "column_headers",
    "rows",
    "representation.panels[]"
  ]) {
    assert.ok(stage2Prompt.includes(token), `Expected Stage 2 prompt to include "${token}"`);
  }

  // Stale saved C7 workflow Stage 2 + Stage 4 live Copy paths both receive the contract
  const staleWf = makeCanonicalFourStageWorkflow();
  staleWf.steps[1].promptSourceType = "local_override";
  staleWf.steps[1].overridePromptBody = "Design elicitation for dataset F.";
  staleWf.steps[3].promptSourceType = "local_override";
  staleWf.steps[3].overridePromptBody = "Synthesise Design Page for dataset F.";
  api.setWorkflowsForTest([staleWf]);
  api.setSelectedWorkflowIdForTest(staleWf.id);

  const liveStage2 = api.buildWorkflowStepInstructions(staleWf.steps[1], 1, null);
  const liveStage4 = api.buildWorkflowStepInstructions(staleWf.steps[3], 3, null);
  assert.match(liveStage2, /Canonical scatterplot representation contract/);
  assert.match(liveStage2, /plot_specification/);
  assert.match(liveStage4, /Canonical scatterplot representation contract/);
  assert.match(liveStage4, /representation\.panels\[\]/);
});

test("Stage 2, Stage 3, and Stage 4 captures reject malformed C7 scatterplot representation (authoritative_data.panels / rendering_specification / table_specification)", () => {
  const { api } = loadPrismRuntime();
  const wf = makeCanonicalFourStageWorkflow();

  const malformedC7Representation = {
    kind: "data_figure",
    title: "Public transport accessibility and employment growth",
    figure_type: "scatterplot",
    layout: "two_separate_panels",
    authoritative_data: {
      dataset_id: "F",
      observation_fields: ["district", "accessibility", "employment_growth"],
      panels: [
        { panel_id: "F1", observations: [["F1A", 20, 0.4]] },
        { panel_id: "F2", observations: [["F2A", 20, 0.2]] }
      ]
    },
    rendering_specification: {
      x_axis: { label: "Accessibility (%)", minimum: 0, maximum: 100 },
      y_axis: { label: "Employment growth (%)", minimum: -2, maximum: 3 }
    },
    accessible_equivalent: {
      table_specification: {
        column_headers: ["District", "Accessibility (%)", "Employment growth (%)"]
      }
    }
  };

  // Stage 2 capture rejects
  const stage2Artefact = {
    artifact_type: "assessment_evidence_elicitation",
    elicitations: [
      {
        elicitation_id: "E7",
        order: 1,
        epistemic_class: "non_determinate",
        representation: malformedC7Representation
      }
    ]
  };
  const s2Check = api.validateStrictJsonWorkflowRunStepCaptureForTest(
    JSON.stringify(stage2Artefact),
    wf.steps[1],
    wf
  );
  assert.equal(s2Check.ok, false);
  const s2Err = (s2Check.errors || []).join(" | ");
  assert.match(s2Err, /authoritative_data\.columns/);
  assert.match(s2Err, /plot_specification x_axis and y_axis/);
  assert.match(s2Err, /accessible_equivalent data table/);

  // Stage 4 capture (paste/save + step advance) rejects
  const stage4Page = makeValidCanonicalAssessmentPage();
  stage4Page.assessment_evidence.elicitations[0].representation = malformedC7Representation;
  const s4Paste = api.validateStrictJsonWorkflowRunStepCaptureForTest(
    JSON.stringify(stage4Page),
    wf.steps[3],
    wf
  );
  assert.equal(s4Paste.ok, false);
  assert.match((s4Paste.errors || []).join(" | "), /plot_specification x_axis and y_axis/);

  const s4Advance = api.parseWorkflowRunPageStructureCaptureForStorage(
    JSON.stringify(stage4Page),
    wf.steps[3],
    wf
  );
  assert.equal(s4Advance.ok, false);
  assert.match((s4Advance.errors || []).join(" | "), /accessible_equivalent data table/);
});

test("Canonical multi-panel scatterplot (C7 F1 + F2) passes Stage 2, Stage 4 capture, and renders both SVG scatterplots and semantic tables cleanly; malformed panel fails closed", () => {
  const { api } = loadPrismRuntime();
  const { renderLearnerPageHtml } = require(
    path.join(root, "lib", "learner-renderer-vnext", "render-learner-page.js")
  );
  const wf = makeCanonicalFourStageWorkflow();

  const f1Obs = [
    ["F1A", 20, 0.4],
    ["F1B", 25, 0.9],
    ["F1C", 30, 0.7],
    ["F1D", 35, 1.4],
    ["F1E", 40, 1.1],
    ["F1F", 45, 1.9],
    ["F1G", 50, 1.6],
    ["F1H", 55, 2.4],
    ["F1I", 90, -1.2]
  ];
  const f2Obs = [
    ["F2A", 20, 0.2],
    ["F2B", 30, 1.0],
    ["F2C", 40, 1.6],
    ["F2D", 50, 2.0],
    ["F2E", 60, 2.2],
    ["F2F", 70, 2.0],
    ["F2G", 80, 1.6],
    ["F2H", 90, 1.0],
    ["F2I", 100, 0.2]
  ];

  const makePanel = (panelId, title, obs, rText) => ({
    panel_id: panelId,
    title,
    authoritative_data: {
      columns: ["district", "accessibility", "employment_growth"],
      observations: obs,
      sample_size: obs.length
    },
    plot_specification: {
      x_axis: {
        variable_id: "accessibility",
        label: "Accessibility (%)",
        minimum: 0,
        maximum: 100,
        tick_interval: 20
      },
      y_axis: {
        variable_id: "employment_growth",
        label: "Employment growth (%)",
        minimum: -2,
        maximum: 3,
        tick_interval: 1
      },
      point_count: obs.length
    },
    accessible_equivalent: {
      caption: title,
      alt_text: `Scatterplot for ${panelId}.`,
      column_headers: ["District", "Accessibility (%)", "Employment growth (%)"],
      rows: obs,
      statistical_summary_text: rText
    }
  });

  const validMultiPanel = {
    kind: "data_figure",
    figure_type: "scatterplot",
    dataset_id: "F",
    title: "Public transport accessibility and employment growth",
    panels: [
      makePanel("F1", "Panel F1: Public transport accessibility and employment growth", f1Obs, "Pearson correlation coefficient: r = -0.37."),
      makePanel("F2", "Panel F2: Public transport accessibility and employment growth", f2Obs, "Pearson correlation coefficient: r = 0.00.")
    ]
  };

  const page = makeValidCanonicalAssessmentPage();
  page.assessment_evidence.elicitations[0].representation = validMultiPanel;

  const capture = api.parseWorkflowRunPageStructureCaptureForStorage(
    JSON.stringify(page),
    wf.steps[3],
    wf
  );
  assert.equal(capture.ok, true, (capture.errors || []).join("; "));

  const rendered = renderLearnerPageHtml(page);
  const renderErrors = (rendered.diagnostics || []).filter(
    (d) => d && (d.level === "error" || d.severity === "error")
  );
  assert.equal(renderErrors.length, 0, JSON.stringify(renderErrors));
  assert.match(rendered.html, /data-representation-kind="scatterplot_panels"/);
  assert.match(rendered.html, /Panel F1: Public transport accessibility and employment growth/);
  assert.match(rendered.html, /Panel F2: Public transport accessibility and employment growth/);
  assert.match(rendered.html, /r = -0\.37/);
  assert.match(rendered.html, /r = 0\.00/);
  assert.match(rendered.html, /F1I/);
  assert.match(rendered.html, /F2I/);

  // Malformed second panel (mismatched table row) MUST fail closed at capture AND render
  const brokenPage = makeValidCanonicalAssessmentPage();
  const brokenPanels = JSON.parse(JSON.stringify(validMultiPanel));
  brokenPanels.panels[1].accessible_equivalent.rows[0][2] = 9.9;
  brokenPage.assessment_evidence.elicitations[0].representation = brokenPanels;

  const brokenCapture = api.parseWorkflowRunPageStructureCaptureForStorage(
    JSON.stringify(brokenPage),
    wf.steps[3],
    wf
  );
  assert.equal(brokenCapture.ok, false);
  assert.match((brokenCapture.errors || []).join(" | "), /does not match the authoritative observations/);

  const brokenRender = renderLearnerPageHtml(brokenPage);
  assert.ok(brokenRender.error, "Expected render error for mismatched panel table");
  assert.ok(!brokenRender.html, "Broken multi-panel page must not return html");
});
