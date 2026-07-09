/**
 * Sprint 56F Phase 4 — GAM enrich-in-place tests.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const shellCreate = require(path.join(repoRoot, "lib", "page-shell-create.js"));
const dlaEnrich = require(path.join(repoRoot, "lib", "page-dla-enrich.js"));
const gamEnrich = require(path.join(repoRoot, "lib", "page-gam-enrich.js"));
const templates = require(path.join(repoRoot, "lib", "episode-plan-v1-templates.js"));
const integration = require(path.join(repoRoot, "lib", "episode-plan-dla-integration.js"));
const validation = require(path.join(repoRoot, "lib", "episode-plan-v1-validation.js"));
const strictJson = require(path.join(repoRoot, "lib", "workflow-artefact-json-strict.js"));

const SAMPLE_LO = {
  learning_outcomes: [
    { id: "LO1", cognitive_level: "understand", statement: "Explain inflation drivers." },
    { id: "LO2", cognitive_level: "apply", statement: "Apply CPI calculations." }
  ]
};

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() { return false; } },
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
  windowStub.PRISM_EPISODE_PLAN_V1_TEMPLATES = templates;
  windowStub.PRISM_EPISODE_PLAN_DLA_INTEGRATION = integration;
  windowStub.PRISM_EPISODE_PLAN_V1_VALIDATION = validation;
  windowStub.PRISM_WORKFLOW_ARTEFACT_JSON_STRICT = strictJson;
  runPrismLibScriptsInSandbox(
    sandbox,
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat([
      "lib/page-shell-create.js",
      "lib/ld-dla-page-enrich-contract.js",
      "lib/page-dla-enrich.js",
      "lib/ld-gam-page-enrich-contract.js",
      "lib/page-gam-enrich.js",
      "lib/episode-plan-population-contract.js"
    ])
  );
  vm.runInContext(
    fs.readFileSync(path.join(repoRoot, "lib", "ld-design-page-compose-contract.js"), "utf8"),
    sandbox,
    { filename: "ld-design-page-compose-contract.js" }
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

function buildEpisodePlansFromLo(lo) {
  return integration.deriveEpisodePlansFromLearningOutcomes(lo);
}

function buildPageShellFromLo(lo, options) {
  const episodePlans = buildEpisodePlansFromLo(lo);
  return shellCreate.createPageShellFromEpisodePlan(
    episodePlans,
    Object.assign({ learning_outcomes: lo }, options || {})
  );
}

function buildDlaEnrichedPage(lo) {
  const shell = buildPageShellFromLo(lo, {
    title: "Inflation page",
    audience: "Year 12 learners"
  });
  return dlaEnrich.enrichPageWithDla(shell);
}

function buildTestWorkflow(overrides) {
  return Object.assign(
    {
      id: "wf-gam-test",
      goal: "Inflation learning page",
      steps: [
        { id: "lo_step", title: "Define Learning Outcomes", outputName: "learning_outcomes" },
        {
          id: "ep_step",
          title: "Design Episode Plan",
          outputName: "episode_plans",
          canonical_step_id: "step_design_episode_plan"
        },
        {
          id: "dla_step",
          title: "Design Learning Activities",
          outputName: "learning_activities",
          canonical_step_id: "step_design_learning_activities"
        },
        {
          id: "gam_step",
          title: "Generate Activity Materials",
          outputName: "activity_materials",
          canonical_step_id: "step_generate_activity_materials",
          override_prompt_body: "Populate materials[] from required_materials[] on the upstream DLA page."
        }
      ]
    },
    overrides || {}
  );
}

function setupWorkflowCaptures(api, wf, lo) {
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    lo_step: JSON.stringify(lo, null, 2)
  });
}

function extractUpstreamDlaPageEmbedJson(promptText) {
  const text = String(promptText || "");
  const marker = "### Upstream DLA page";
  const markerIdx = text.indexOf(marker);
  if (markerIdx < 0) return null;
  const fencedIdx = text.indexOf("```json", markerIdx);
  if (fencedIdx < 0) return null;
  const afterFence = text.slice(fencedIdx + "```json".length);
  const endFenceIdx = afterFence.indexOf("```");
  if (endFenceIdx < 0) return null;
  const jsonText = afterFence.slice(0, endFenceIdx).trim();
  if (!jsonText) return null;
  try {
    return JSON.parse(jsonText);
  } catch (_) {
    return null;
  }
}

function buildDlaPageFixtureWithFullActivityFields() {
  const page = buildDlaEnrichedPage(SAMPLE_LO);
  page.activities = [
    {
      activity_id: "A1",
      title: "Strategic Role of HR",
      grouping: "pairs",
      duration_minutes: 10,
      mapped_learning_outcomes: ["LO1"],
      activity_preamble: "Read and compare strategic HR approaches.",
      learner_task: "Compare two strategic HR approaches in context.",
      expected_output: "A short comparison with justified implications.",
      reasoning_orientation: "Relate strategic intent to workforce outcomes.",
      required_materials: [
        { material_id: "A1-M1", material_type: "text", purpose: "Concept grounding", specification: "Define strategic HR in HE context." },
        { material_id: "A1-M2", material_type: "worked_example", purpose: "Reasoning model", specification: "Show strategic HR reasoning chain." }
      ],
      materials: [],
      episode_plan: {
        archetype: "understand",
        beats: [{ function: "orient", note: "orient learners" }]
      }
    }
  ];
  page.learning_outcomes = [{ id: "LO1", cognitive_level: "understand", statement: "Explain strategic HR." }];
  page.episode_plans = [
    {
      activity_id: "A1",
      mapped_learning_outcome_ids: ["LO1"],
      episode_plan_id: "EP-A1",
      episode_plan: { archetype: "understand", beats: [{ function: "orient", note: "orient learners" }] }
    }
  ];
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  return page;
}

const api = loadPrismTestApi();

let dlaBaseline;
let gamEnrichedPage;

test("setup: build DLA-enriched baseline", () => {
  dlaBaseline = buildDlaEnrichedPage(SAMPLE_LO);
  const check = dlaEnrich.validateDlaEnrichedPage(dlaBaseline, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(dlaBaseline.assembly_state.current_stage, "dla");
});

test("GAM accepts a DLA-enriched vNext page as input", () => {
  assert.doesNotThrow(() => {
    gamEnrichedPage = gamEnrich.enrichPageWithGam(dlaBaseline);
  });
  assert.equal(gamEnrichedPage.artifact_type, "page");
  assert.equal(gamEnrichedPage.schema_version, "2.0.0");
});

test("GAM returns a full vNext page object, not a standalone materials artefact", () => {
  assert.ok(gamEnrichedPage);
  assert.equal(gamEnrichedPage.artifact_type, "page");
  assert.equal("activity_materials" in gamEnrichedPage, false);
  assert.ok(Array.isArray(gamEnrichedPage.activities));
  assert.ok(Array.isArray(gamEnrichedPage.learning_outcomes));
});

test("every required_material gets a matching material entry", () => {
  gamEnrichedPage.activities.forEach((activity) => {
    const requiredIds = activity.required_materials.map((row) => row.material_id);
    const materialIds = activity.materials.map((row) => row.material_id);
    assert.equal(requiredIds.length, materialIds.length);
    requiredIds.forEach((id) => {
      assert.ok(materialIds.includes(id), "missing material for " + id);
    });
  });
});

test("material IDs are preserved exactly from required_materials", () => {
  gamEnrichedPage.activities.forEach((activity, index) => {
    const baseline = dlaBaseline.activities[index];
    const requiredIds = baseline.required_materials.map((row) => row.material_id);
    const materialIds = activity.materials.map((row) => row.material_id);
    assert.deepEqual(materialIds, requiredIds);
  });
});

test("material titles are present", () => {
  gamEnrichedPage.activities.forEach((activity) => {
    activity.materials.forEach((material) => {
      assert.ok(material.title && String(material.title).trim().length > 0);
    });
  });
});

test("material bodies are present", () => {
  gamEnrichedPage.activities.forEach((activity) => {
    activity.materials.forEach((material) => {
      assert.ok(material.body && String(material.body).trim().length > 0);
    });
  });
});

test('material body_format is "markdown"', () => {
  gamEnrichedPage.activities.forEach((activity) => {
    activity.materials.forEach((material) => {
      assert.equal(material.body_format, "markdown");
    });
  });
});

test("DLA-owned activity fields remain unchanged", () => {
  gamEnrichedPage.activities.forEach((activity, index) => {
    const baseline = dlaBaseline.activities[index];
    assert.equal(
      gamEnrich.activitiesMatchExceptMaterials(baseline, activity),
      true,
      "activity " + activity.activity_id
    );
  });
});

test("required_materials[] remain unchanged", () => {
  gamEnrichedPage.activities.forEach((activity, index) => {
    assert.deepEqual(activity.required_materials, dlaBaseline.activities[index].required_materials);
  });
});

test("page_synthesis remains {}", () => {
  assert.deepEqual(gamEnrichedPage.page_synthesis, {});
});

test("no sections[] are written", () => {
  assert.equal("sections" in gamEnrichedPage, false);
});

test('assembly_state.current_stage becomes "gam"', () => {
  assert.equal(gamEnrichedPage.assembly_state.current_stage, "gam");
});

test('assembly_state.enriched_by includes episode_plan, dla, and gam', () => {
  assert.deepEqual(gamEnrichedPage.assembly_state.enriched_by, ["episode_plan", "dla", "gam"]);
});

test("activity IDs are preserved", () => {
  assert.deepEqual(
    dlaBaseline.activities.map((row) => row.activity_id),
    gamEnrichedPage.activities.map((row) => row.activity_id)
  );
});

test("activity order is preserved", () => {
  assert.deepEqual(
    dlaBaseline.activities.map((row) => row.activity_id),
    gamEnrichedPage.activities.map((row) => row.activity_id)
  );
});

test("GAM-enriched page renders through Phase 8 adapter with authored materials", () => {
  const normalized = api.normalizePageForRenderForTest(gamEnrichedPage);
  assert.equal(normalized.__prismRenderNormalized, true);
  const renderResult = api.buildUtilityStructuredHtmlForTest(normalized, {
    applyCompositionValidation: false
  });
  assert.ok(renderResult && !renderResult.error, renderResult && renderResult.error);
  const html = String(renderResult.html || "");
  assert.ok(html.length > 0);
  const firstMaterial = gamEnrichedPage.activities[0].materials[0];
  assert.ok(firstMaterial && firstMaterial.title);
  assert.match(html, new RegExp(firstMaterial.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("GAM v2 path stays active even when workflow flag is set false", () => {
  const wf = buildTestWorkflow({ pageEnrichmentV2: false });
  setupWorkflowCaptures(api, wf, SAMPLE_LO);
  const json = api.deriveGenerateActivityMaterialsCaptureJson(wf);
  assert.ok(json);
  const page = JSON.parse(json);
  const check = api.validateGamOrPageCapture(page, null);
  assert.equal(check.ok, true);
  assert.equal(page.artifact_type, "page");
  assert.equal(page.schema_version, "2.0.0");
});

test("GAM copy prompt expects page input and page output under v2", () => {
  const wf = buildTestWorkflow();
  setupWorkflowCaptures(api, wf, SAMPLE_LO);
  const gamStep = wf.steps.find((s) => s.canonical_step_id === "step_generate_activity_materials");
  const instr = api.buildWorkflowStepInstructions(gamStep, 3, null);
  assert.match(instr, /STEP 4 OUTPUT: page/i);
  assert.match(instr, /Sprint 56F GAM|enrich-in-place/i);
  assert.match(instr, /Upstream DLA page/i);
  assert.match(instr, /Do NOT emit pack text|activity_materials/i);
  assert.match(instr, /required_materials/i);
  assert.match(instr, /never empty|Do not empty.*required_materials/i);
  assert.match(
    instr,
    /Return the entire input page unchanged except for activities\[\]\.materials\[\]/i
  );
  assert.match(instr, /Activity count invariant/i);
  assert.match(instr, /exactly \d+ entries/i);
  assert.match(instr, /output learning_outcomes\.length == input learning_outcomes\.length/i);
  assert.match(instr, /output episode_plans\.length == input episode_plans\.length/i);
  assert.match(instr, /Do not stop after the first few activities/i);
  assert.match(instr, /opening `\{` to final `\}`/i);

  // PAGE-15 architecture headings
  assert.match(instr, /# Identity/i);
  assert.match(instr, /# Ownership/i);
  assert.match(instr, /## Ownership Boundary/i);
  assert.match(instr, /## Field Registry/i);
  assert.match(instr, /## Activity Integrity/i);
  assert.match(instr, /## Ownership Failure Conditions/i);
  assert.match(instr, /# Execution/i);
  assert.match(instr, /# Quality/i);
  assert.match(instr, /# Budget/i);
  assert.match(instr, /# Examples/i);

  // Retired standalone headings must not reappear
  assert.doesNotMatch(instr, /# Activity Object Preservation Rule/i);
  assert.doesNotMatch(instr, /# Verbatim Activity Rule/i);
  assert.doesNotMatch(instr, /# Field Presence Rule/i);
  assert.doesNotMatch(instr, /# Navigation Preservation Rule/i);
  assert.doesNotMatch(instr, /# Complete all activities before output/i);
  assert.doesNotMatch(instr, /# Immutable non-owned fields/i);
  assert.doesNotMatch(instr, /# Specification Fulfilment Rule/i);
  assert.doesNotMatch(instr, /# Depth Floor Interpretation/i);
  assert.doesNotMatch(instr, /# L3 Depth Realisation Rule/i);
  assert.doesNotMatch(instr, /# Minimum Depth Expectations/i);
  assert.doesNotMatch(instr, /# Depth Sufficiency Test/i);
  assert.doesNotMatch(instr, /# Sufficiency Ceiling Rule/i);
  assert.doesNotMatch(instr, /# Compact Completeness Rule/i);
  assert.doesNotMatch(instr, /# Owned-Need Rule/i);
  assert.doesNotMatch(instr, /# Constraint Response Rule/i);
  assert.doesNotMatch(instr, /# Ownership-Constrained Optimisation Rule/i);
  assert.doesNotMatch(instr, /# Structural Equality Rule/i);
  assert.doesNotMatch(instr, /# Compression Target Rule/i);
  assert.doesNotMatch(instr, /# Depth Efficiency Rule/i);
  assert.doesNotMatch(instr, /# Material-Type Expectations/i);
  assert.doesNotMatch(instr, /# Specification Coverage Invariant/i);
  assert.doesNotMatch(instr, /# Preservation-First Execution Order/i);
  assert.doesNotMatch(instr, /# Non-Negotiable Preservation Rule/i);
  assert.doesNotMatch(instr, /# Activity Survival Rule/i);
  assert.doesNotMatch(instr, /# Structure Preservation Rule/i);
  assert.doesNotMatch(instr, /# Depth Subordination Rule/i);
  assert.doesNotMatch(instr, /### Complete full-page emission/i);
  assert.doesNotMatch(instr, /### No meta-output/i);
  assert.doesNotMatch(instr, /### Activity object shape preservation/i);
  assert.doesNotMatch(instr, /### Immutable copy rules/i);

  // Core Identity language
  assert.match(instr, /immutable document|edit in place/i);
  assert.match(instr, /A1 is not special/i);
  assert.match(instr, /Do not emit the page after completing A1/i);
  assert.match(instr, /Completion is determined by the entire page/i);
  assert.match(instr, /Activity count must never decrease/i);
  assert.match(instr, /top-level note/i);
  assert.match(instr, /too large|cannot be reproduced/i);
  assert.match(instr, /Do not include explanations, apologies, limitation statements/i);

  // Core Ownership language
  assert.match(instr, /not authorised to rewrite, shorten, paraphrase/i);
  assert.match(instr, /Preserve all visible non-owned fields from the supplied DLA page as fully as possible/i);
  assert.match(instr, /Budget pressure does not create an exception/i);
  assert.match(instr, /every activity field except materials/i);
  assert.match(instr, /output activity\.learner_task == input activity\.learner_task/i);
  assert.match(instr, /output activity\.expected_output == input activity\.expected_output/i);
  assert.match(instr, /output activity\.required_materials == input activity\.required_materials/i);
  assert.match(instr, /output activity\.episode_plan == input activity\.episode_plan/i);
  assert.match(instr, /character-for-character|byte-for-byte/i);
  assert.match(instr, /Do not generate assessment content/i);
  assert.match(instr, /Do not generate learning-sequence content/i);
  assert.match(instr, /Do not restate learner_task, expected_output, or required_materials in prose/i);
  assert.match(instr, /activity object is an immutable container/i);
  assert.match(instr, /must equal input activity object \+ materials/i);
  assert.match(instr, /Do not create new activity objects/i);
  assert.match(instr, /Do not emit \{ activity_id, materials \} objects/i);
  assert.match(instr, /replace only the materials value|replace only materials value/i);
  assert.match(instr, /if a field exists in the input activity, it must exist in the output activity/i);
  assert.match(instr, /All nested structures must remain unchanged/i);
  assert.match(instr, /metadata supports downstream rendering and navigation/i);
  assert.match(instr, /must never be removed, omitted, compacted, or replaced/i);
  assert.match(instr, /generation_notes/i);
  assert.match(instr, /Do not truncate episode_plans|truncating episode_plans/i);

  // Core Execution language
  assert.match(instr, /Preservation-First Execution Order/i);
  assert.match(instr, /Priority 1: Preserve the complete input page/i);
  assert.match(instr, /Priority 5: Reach the instructional floor/i);
  assert.match(instr, /Lower-priority requirements must never cause violation of higher-priority requirements/i);
  assert.match(instr, /depth improvements.*never justify/i);
  assert.match(instr, /Structural Copy-Forward Rule/i);
  assert.match(instr, /copy the entire embedded DLA page object as the output base/i);
  assert.match(instr, /Then apply exactly two patches/i);
  assert.match(instr, /Replace each activities\[i\]\.materials value/i);
  assert.match(instr, /Update assembly_state\.current_stage and assembly_state\.enriched_by/i);
  assert.match(instr, /Do not create a fresh page object/i);
  assert.match(instr, /Do not select fields to include/i);
  assert.match(instr, /Do not rebuild activities from activity_id and materials/i);
  assert.match(instr, /For each activity index i: output\.activities\[i\] must contain every non-materials field present in input\.activities\[i\], with identical values/i);
  assert.match(instr, /Preserve all visible fields from the supplied DLA page/i);
  assert.match(instr, /Do not intentionally omit, summarise, or rebuild non-owned fields/i);
  assert.match(instr, /If uncertainty exists, copy the visible DLA structure as fully as possible and continue/i);
  assert.match(instr, /Never replace the page with a status\/error object/i);
  assert.match(instr, /Never return a top-level status-only\/error-only response/i);
  assert.match(instr, /Work method/i);
  assert.match(instr, /Treat the supplied DLA page as the base JSON object/i);
  assert.match(instr, /Copy every activity object in full/i);
  assert.match(instr, /replace only its materials array/i);
  assert.match(instr, /Do not emit activity summaries/i);
  assert.match(instr, /Do not emit activity objects containing only activity_id and materials/i);
  assert.match(instr, /For every input activity: output the full original activity object/i);
  assert.match(instr, /preserve all keys and values exactly except materials/i);
  assert.match(instr, /required_materials must remain present/i);
  assert.match(instr, /episode_plan must remain present/i);
  assert.match(instr, /learner_task and expected_output must remain present/i);
  assert.match(instr, /Do not emit partial activity objects/i);
  assert.match(instr, /Do not omit fields to save space/i);
  assert.match(instr, /for each required_materials\[j\], create exactly one corresponding materials\[j\] unless impossible/i);
  assert.match(instr, /preserve the same material_id as required_materials\[j\]/i);
  assert.match(instr, /Do not collapse multiple required materials into one generic text material/i);

  // Core Quality language
  assert.match(instr, /Quality defines the instructional floor/i);
  assert.match(instr, /required_materials\[\]\.specification as a mandatory content contract/i);
  assert.match(instr, /depth_floor:L3 means/i);
  assert.match(instr, /depth_floor:L3 is not satisfied by short summaries/i);
  assert.match(instr, /Could a learner realistically complete the associated activity using this material alone/i);
  assert.match(instr, /Material-type matrix/i);

  // Core Budget language
  assert.match(instr, /Budget defines the instructional ceiling/i);
  assert.match(instr, /Budget optimisation may occur only within GAM-owned materials/i);
  assert.match(instr, /minimum complete material needed to satisfy/i);
  assert.match(instr, /once a material is instructionally sufficient, stop/i);
  assert.match(instr, /concise enough to preserve downstream page capacity/i);
  assert.match(instr, /may occur only within GAM-owned material bodies/i);
  assert.match(instr, /may not optimise, summarise, shorten, rewrite, remove, compact/i);
  assert.match(instr, /Reduce verbosity only inside GAM-generated material content/i);
  assert.match(instr, /Never reduce, remove, rewrite, or summarise non-owned content/i);
  assert.match(instr, /Never emit status-only or error-only objects/i);
  assert.match(instr, /Never say generation cannot be completed because of response size/i);
  assert.match(instr, /concept, relationship, consequence, context, and example or reasoning step/i);

  // Examples coverage (one pair per failure cluster)
  assert.match(instr, /Full-page in-place edit example/i);
  assert.match(instr, /INVALID example \(compacted activity object\)/i);
  assert.match(instr, /INVALID example \(still partial activity object\)/i);
  assert.match(instr, /VALID example \(activity object preserved, materials appended\)/i);
  assert.match(instr, /INVALID structural copy-forward example/i);
  assert.match(instr, /VALID structural copy-forward example/i);
  assert.match(instr, /INVALID example \(rewritten non-owned fields\)/i);
  assert.match(instr, /VALID example \(non-owned fields copied exactly; only materials populated\)/i);
  assert.match(instr, /INVALID specification-fulfilment example/i);
  assert.match(instr, /VALID specification-fulfilment example/i);
  assert.match(instr, /INVALID shallow-depth example/i);
  assert.match(instr, /VALID sufficiency example/i);
  assert.match(instr, /INVALID ownership-constrained optimisation example/i);
  assert.match(instr, /VALID ownership-constrained optimisation example/i);
  assert.match(instr, /INVALID meta-output example/i);
  assert.match(instr, /INVALID status\/error-only example/i);
  assert.match(instr, /VALID best-effort preservation example/i);
  assert.match(instr, /INVALID early-stop \/ completion example/i);
  assert.match(instr, /VALID early-stop \/ completion example/i);

  assert.match(instr, /learning_outcomes/i);
  assert.match(instr, /episode_plans/i);
  assert.match(instr, /Material authoring guidance \(Sprint 56F v2/i);
  assert.doesNotMatch(instr, /Realise all required_materials as activity_materials/i);
  assert.doesNotMatch(instr, /Treat learning_activities as the source of truth/i);
  assert.doesNotMatch(instr, /Here is the core prompt for this step:/i);
  assert.doesNotMatch(instr, /Material:\s*<material_id>/i);
  assert.doesNotMatch(instr, /Content:\s*\n<full usable material content>/i);
});

test("GAM v2 copy prompt suppresses legacy catalog output-shape instructions", () => {
  const wf = buildTestWorkflow({
    steps: buildTestWorkflow().steps.map((row) =>
      row.id === "gam_step"
        ? Object.assign({}, row, {
            override_prompt_body:
              "Context:\nYou are provided with learning_activities containing required_materials.\n\nTask:\nRealise all required_materials as activity_materials for immediate delivery.\n\nInstructions:\n- Treat learning_activities as the source of truth\n\nOutput organisation:\nActivity ID: <activity_id>\nMaterial: <material_id> (<type>)\nContent:\n<full usable material content>"
          })
        : row
    )
  });
  setupWorkflowCaptures(api, wf, SAMPLE_LO);
  const gamStep = wf.steps.find((s) => s.canonical_step_id === "step_generate_activity_materials");
  const instr = api.buildWorkflowStepInstructions(gamStep, 3, null);
  assert.match(instr, /Material authoring guidance \(Sprint 56F v2/i);
  assert.doesNotMatch(instr, /Realise all required_materials as activity_materials/i);
  assert.doesNotMatch(instr, /Treat learning_activities as the source of truth/i);
  assert.doesNotMatch(instr, /Material:\s*<material_id>/i);
  assert.doesNotMatch(instr, /Here is the core prompt for this step:/i);
});

test("GAM regression fixture enforces full activity-field copy-forward prompt language", () => {
  const wf = buildTestWorkflow();
  const dlaFixture = buildDlaPageFixtureWithFullActivityFields();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    lo_step: JSON.stringify(SAMPLE_LO, null, 2),
    dla_step: JSON.stringify(dlaFixture, null, 2)
  });
  const gamStep = wf.steps.find((s) => s.canonical_step_id === "step_generate_activity_materials");
  const instr = api.buildWorkflowStepInstructions(gamStep, 3, null);
  const embedded = extractUpstreamDlaPageEmbedJson(instr);
  assert.ok(embedded);
  assert.ok(Array.isArray(embedded.activities) && embedded.activities.length === 1);
  const activity = embedded.activities[0];
  assert.ok("activity_id" in activity);
  assert.ok("title" in activity);
  assert.ok("grouping" in activity);
  assert.ok("duration_minutes" in activity);
  assert.ok("mapped_learning_outcomes" in activity);
  assert.ok("activity_preamble" in activity);
  assert.ok("learner_task" in activity);
  assert.ok("expected_output" in activity);
  assert.ok("reasoning_orientation" in activity);
  assert.ok("required_materials" in activity && Array.isArray(activity.required_materials));
  assert.equal(activity.required_materials.length, 2);
  assert.ok("materials" in activity);
  assert.ok("episode_plan" in activity);
  assert.match(instr, /Do not emit activity objects containing only activity_id and materials/i);
  assert.match(instr, /Do not emit partial activity objects/i);
  assert.match(instr, /for each required_materials\[j\], create exactly one corresponding materials\[j\] unless impossible/i);
});

test("GAM bindings use page artefact from Design Learning Activities", () => {
  const wf = buildTestWorkflow();
  const bindings = api.ensureGamPageInputBindingsForSteps(wf.steps, wf);
  const gam = bindings.find((s) => s.id === "gam_step");
  const dlaBinding = (gam.inputBindings || []).find((b) => b.sourceStepId === "dla_step");
  assert.ok(dlaBinding);
  assert.equal(dlaBinding.artifactName, "page");
});

test("deriveGenerateActivityMaterialsCaptureJson emits GAM-enriched vNext page", () => {
  const wf = buildTestWorkflow();
  setupWorkflowCaptures(api, wf, SAMPLE_LO);
  const dlaJson = api.deriveDesignLearningActivitiesCaptureJson(wf);
  assert.ok(dlaJson);
  const dlaBaselineFromDerive = JSON.parse(dlaJson);
  const json = api.deriveGenerateActivityMaterialsCaptureJson(wf);
  assert.ok(json);
  const page = JSON.parse(json);
  const check = api.validateGamOrPageCapture(page, dlaBaselineFromDerive);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(page.assembly_state.current_stage, "gam");
});

test("validateGamEnrichedPage rejects material without matching required_material", () => {
  const bad = JSON.parse(JSON.stringify(gamEnrichedPage));
  bad.activities[0].materials.push({
    material_id: "ORPHAN-M99",
    material_type: "text",
    title: "Orphan",
    body: "Should fail",
    body_format: "markdown"
  });
  const check = gamEnrich.validateGamEnrichedPage(bad, dlaBaseline);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((err) => /no matching required_material|count must match/i.test(err)));
});

test("validateGamEnrichedPage rejects empty material body", () => {
  const bad = JSON.parse(JSON.stringify(gamEnrichedPage));
  bad.activities[0].materials[0].body = "   ";
  const check = gamEnrich.validateGamEnrichedPage(bad, dlaBaseline);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((err) => /body required/i.test(err)));
});

function buildDlaBaselineWithFullEpisodePlans() {
  const page = buildDlaEnrichedPage(SAMPLE_LO);
  page.episode_plans = page.episode_plans.map((row, index) =>
    Object.assign({}, row, {
      activity_id: row.activity_id || "A" + (index + 1),
      mapped_learning_outcome_ids: [SAMPLE_LO.learning_outcomes[index].id],
      episode_plan_id: "EP-" + (index + 1),
      episode_plan: {
        archetype: row.episode_plan.archetype,
        beats: row.episode_plan.beats.map((beat) => Object.assign({}, beat, { note: "full-beat" }))
      }
    })
  );
  return page;
}

function buildTruncatedGamCapture(baseline, materialsOverride) {
  function defaultMaterials(activity) {
    return activity.required_materials.map((req, index) => ({
      material_id: req.material_id,
      material_type: req.material_type || req.type || "text",
      title: "Authored " + (index + 1),
      body: "Authored body " + (index + 1),
      body_format: "markdown"
    }));
  }
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Truncated title",
    audience: "Truncated audience",
    page_profile: { profile_type: "facilitator" },
    assembly_state: { current_stage: "gam", enriched_by: ["episode_plan", "dla", "gam"] },
    page_synthesis: {},
    learning_outcomes: [{ outcome_id: "X", statement: "Truncated LO" }],
    episode_plans: baseline.episode_plans.map((row) => ({ activity_id: row.mapped_learning_outcome_ids[0] })),
    activities: baseline.activities.map((activity, index) =>
      Object.assign({}, activity, {
        learner_task: "Short task",
        expected_output: "Short output",
        activity_preamble: "Short preamble",
        reasoning_orientation: "Short reasoning",
        self_explanation_prompt: "Short prompt",
        materials: materialsOverride
          ? materialsOverride(activity, index)
          : defaultMaterials(activity)
      })
    )
  };
}

test("top-level episode_plans[] preserved with nested episode_plan objects", () => {
  const baseline = buildDlaBaselineWithFullEpisodePlans();
  const capture = buildTruncatedGamCapture(baseline);
  const merged = gamEnrich.normalizeGamCaptureToPage(baseline, capture);
  assert.ok(merged);
  assert.deepEqual(merged.episode_plans, baseline.episode_plans);
  assert.ok(merged.episode_plans[0].episode_plan);
  assert.ok(merged.episode_plans[0].episode_plan.beats.length > 0);
  const check = gamEnrich.validateGamEnrichedPage(merged, baseline);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("shortened learner_task is rejected if baseline had longer text", () => {
  const bad = JSON.parse(JSON.stringify(gamEnrichedPage));
  const original = bad.activities[0].learner_task;
  bad.activities[0].learner_task = original.slice(0, Math.max(1, original.length - 20));
  const check = gamEnrich.validateGamEnrichedPage(bad, dlaBaseline);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((err) => /learner_task.*shortened/i.test(err)));
});

test("shortened expected_output is rejected if baseline had longer text", () => {
  const bad = JSON.parse(JSON.stringify(gamEnrichedPage));
  const original = bad.activities[0].expected_output;
  bad.activities[0].expected_output = original.slice(0, Math.max(1, original.length - 15));
  const check = gamEnrich.validateGamEnrichedPage(bad, dlaBaseline);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((err) => /expected_output.*shortened/i.test(err)));
});

test("shortened activity_preamble is rejected", () => {
  const bad = JSON.parse(JSON.stringify(gamEnrichedPage));
  bad.activities[0].activity_preamble = "Too short.";
  const check = gamEnrich.validateGamEnrichedPage(bad, dlaBaseline);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((err) => /activity_preamble.*shortened|activity_preamble must match/i.test(err)));
});

test("cognition/scaffold field drift is rejected", () => {
  const bad = JSON.parse(JSON.stringify(gamEnrichedPage));
  bad.activities[0].reasoning_orientation = "Rewritten shorter cognition.";
  bad.activities[0].scaffold_hint_sequence = ["Only one hint"];
  const check = gamEnrich.validateGamEnrichedPage(bad, dlaBaseline);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((err) => /reasoning_orientation|scaffold_hint_sequence/i.test(err)));
});

test("normalizeGamCaptureToPage merges only materials[] from capture onto baseline page", () => {
  const baseline = buildDlaBaselineWithFullEpisodePlans();
  const longTask = baseline.activities[0].learner_task;
  const capture = buildTruncatedGamCapture(baseline, (activity) =>
    activity.required_materials.map((req, index) => ({
      material_id: req.material_id,
      material_type: req.material_type || "text",
      title: "Capture title " + (index + 1),
      body: "Capture body " + (index + 1),
      body_format: "markdown"
    }))
  );
  const merged = gamEnrich.normalizeGamCaptureToPage(baseline, capture);
  assert.ok(merged);
  assert.equal(merged.activities[0].learner_task, longTask);
  assert.equal(merged.activities[0].expected_output, baseline.activities[0].expected_output);
  assert.equal(merged.activities[0].activity_preamble, baseline.activities[0].activity_preamble);
  assert.equal(merged.activities[0].reasoning_orientation, baseline.activities[0].reasoning_orientation);
  assert.deepEqual(merged.episode_plans, baseline.episode_plans);
  assert.ok(merged.activities[0].materials.every((row) => /^Capture body/.test(row.body)));
});

test("Copilot-authored GAM capture cannot overwrite DLA-owned fields", () => {
  const baseline = buildDlaBaselineWithFullEpisodePlans();
  const capture = buildTruncatedGamCapture(baseline);
  const merged = gamEnrich.normalizeGamCaptureToPage(baseline, capture);
  assert.ok(merged);
  baseline.activities.forEach((baseActivity, index) => {
    const mergedActivity = merged.activities[index];
    gamEnrich.GAM_DLA_OWNED_STRING_FIELDS.forEach((field) => {
      if (field in baseActivity) {
        assert.equal(mergedActivity[field], baseActivity[field], field);
      }
    });
    assert.deepEqual(mergedActivity.required_materials, baseActivity.required_materials);
    assert.deepEqual(mergedActivity.episode_plan, baseActivity.episode_plan);
  });
});

test("rendered HTML shorter than JSON is renderer presentation, not GAM mutation", () => {
  const normalized = api.normalizePageForRenderForTest(gamEnrichedPage);
  const renderResult = api.buildUtilityStructuredHtmlForTest(normalized, {
    applyCompositionValidation: false
  });
  const html = String(renderResult.html || "");
  const jsonTask = gamEnrichedPage.activities[0].learner_task;
  const jsonPreamble = gamEnrichedPage.activities[0].activity_preamble;
  assert.ok(jsonTask.length > 40);
  assert.ok(jsonPreamble.length > 10);
  assert.equal(gamEnrichedPage.activities[0].learner_task, dlaBaseline.activities[0].learner_task);
  if (!html.includes(jsonTask)) {
    assert.ok(
      html.includes(jsonPreamble) || html.includes(gamEnrichedPage.activities[0].reasoning_orientation),
      "renderer uses manifestation grammar sections rather than dumping full learner_task verbatim"
    );
  }
});
