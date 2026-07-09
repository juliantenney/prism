/**
 * Sprint 58 Phase 2A/2B — partial capture validators and capture-path gating tests.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturesDir = path.join(__dirname, "fixtures", "page-assemble");
const shellCreate = require(path.join(repoRoot, "lib", "page-shell-create.js"));

function loadFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

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
  runPrismLibScriptsInSandbox(
    sandbox,
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat([
      "lib/page-shell-create.js",
      "lib/ld-dla-page-enrich-contract.js",
      "lib/page-dla-enrich.js",
      "lib/ld-gam-page-enrich-contract.js",
      "lib/page-gam-enrich.js",
      "lib/page-vnext-assemble.js"
    ])
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

function buildRunLi(stepId, outputName, jsonText) {
  const textarea = { value: String(jsonText || "") };
  const output = { value: outputName };
  return {
    li: {
      classList: { contains: (name) => name === "workflow-step" },
      getAttribute(name) {
        if (name === "data-step-id") return stepId;
        return "";
      },
      querySelector(selector) {
        if (selector === '[data-field="runStepOutput"]') return textarea;
        if (selector === '[data-field="outputName"]') return output;
        if (selector === '[data-role="run-step-output-status"]') return { textContent: "", classList: { toggle() {} } };
        return null;
      }
    },
    textarea
  };
}

function buildWorkflow(overrides) {
  return Object.assign(
    {
      id: "wf-partial-validate",
      pageEnrichmentV2: true,
      partialPageOutputs: true,
      steps: [
        { id: "ep_step", title: "Design Episode Plan", outputName: "page", canonical_step_id: "step_design_episode_plan" },
        { id: "dla_step", title: "Design Learning Activities", outputName: "page", canonical_step_id: "step_design_learning_activities" },
        { id: "gam_step", title: "Generate Activity Materials", outputName: "page", canonical_step_id: "step_generate_activity_materials" },
        { id: "ls_step", title: "Construct Learning Sequence", outputName: "page", canonical_step_id: "step_construct_learning_sequence" },
        { id: "da_step", title: "Design Assessment", outputName: "page", canonical_step_id: "step_design_assessment" },
        { id: "gai_step", title: "Generate Assessment Items", outputName: "page", canonical_step_id: "step_generate_assessment_items" },
        { id: "dp_step", title: "Design Page", outputName: "page", canonical_step_id: "step_design_page" }
      ]
    },
    overrides || {}
  );
}

const epShell = loadFixture("ep-shell.json");
const dlaPartial = loadFixture("dla-partial.json");
const gamPartial = loadFixture("gam-partial.json");
const lsPartial = loadFixture("ls-partial.json");
const dpPartial = loadFixture("dp-partial.json");
const daPartial = loadFixture("assessment-design-partial.json");
const gaiPartial = loadFixture("assessment-items-partial.json");

test("DLA partial without title is valid", () => {
  const api = loadPrismTestApi();
  const wf = buildWorkflow();
  const check = api.validateDlaOrPageCapture(dlaPartial, epShell, wf);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("DLA partial containing forbidden ownership fields is invalid", () => {
  const api = loadPrismTestApi();
  const wf = buildWorkflow();
  const bad = JSON.parse(JSON.stringify(dlaPartial));
  bad.activities[0].materials = [
    {
      material_id: "A1-M1",
      body: "forbidden at DLA stage"
    }
  ];
  const check = api.validateDlaOrPageCapture(bad, epShell, wf);
  assert.equal(check.ok, false);
  assert.match((check.errors || []).join("; "), /forbidden/i);
});

test("GAM materials-only activities are valid", () => {
  const api = loadPrismTestApi();
  const wf = buildWorkflow();
  const check = api.validateGamOrPageCapture(gamPartial, dlaPartial, wf);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("LS partial without activities is valid", () => {
  const api = loadPrismTestApi();
  const check = api.validateLearningSequencePartialPageCapture(lsPartial);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("DP partial without activities is valid", () => {
  const api = loadPrismTestApi();
  const check = api.validateDesignPagePartialPageCapture(dpPartial);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("DP partial without knowledge summary is invalid", () => {
  const api = loadPrismTestApi();
  const bad = JSON.parse(JSON.stringify(dpPartial));
  if (bad.page_synthesis && bad.page_synthesis.knowledge_summary) {
    delete bad.page_synthesis.knowledge_summary;
  }
  if (Array.isArray(bad.sections)) {
    bad.sections = bad.sections.filter((row) => String(row && row.section_id || "").toLowerCase() !== "knowledge_summary");
  }
  const check = api.validateDesignPagePartialPageCapture(bad);
  assert.equal(check.ok, false);
  assert.match((check.errors || []).join("; "), /knowledge summary/i);
});

test("Design Assessment partial validates through strict capture path", () => {
  const api = loadPrismTestApi();
  const wf = buildWorkflow();
  const step = wf.steps.find((row) => row.id === "da_step");
  const check = api.validateStrictJsonWorkflowRunStepCaptureForTest(
    JSON.stringify(daPartial, null, 2),
    step,
    wf
  );
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("Generate Assessment Items partial validates through strict capture path", () => {
  const api = loadPrismTestApi();
  const wf = buildWorkflow();
  const step = wf.steps.find((row) => row.id === "gai_step");
  const check = api.validateStrictJsonWorkflowRunStepCaptureForTest(
    JSON.stringify(gaiPartial, null, 2),
    step,
    wf
  );
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("EP full shell still validated by existing full-page validation path", () => {
  const check = shellCreate.validatePageShellAgainstVNextSchema(epShell);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("partial capture path stores artefact without composition mutation", () => {
  const api = loadPrismTestApi();
  const wf = buildWorkflow();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({});
  api.setWorkflowRunCapturedOutputsRawForTest({});
  const raw = JSON.stringify(gamPartial, null, 2);
  const { li, textarea } = buildRunLi("gam_step", "page", raw);
  api.syncWorkflowRunCapturedOutputToState(li);
  const storedRaw = api.getWorkflowRunCapturedOutputsRawForTest().gam_step || "";
  const storedSanitized = api.getWorkflowRunCapturedOutputsForTest().gam_step || "";
  assert.equal(storedRaw.trim(), raw.trim());
  assert.equal(storedSanitized.trim(), raw.trim());
  assert.equal(textarea.value.trim(), raw.trim());
});

test("legacy path still follows existing validation path", () => {
  const api = loadPrismTestApi();
  const legacyWf = buildWorkflow({ pageEnrichmentV2: false, partialPageOutputs: false });
  const legacyCapture = {
    learning_activities: {
      activities: [{ activity_id: "A1", learner_task: "Task" }]
    }
  };
  const check = api.validateDlaOrPageCapture(legacyCapture, null, legacyWf);
  assert.equal(check.ok, true);
  assert.equal(check.legacy, true);
});

test("page artefact parser accepts raw JSON and single fenced JSON block", () => {
  const api = loadPrismTestApi();
  const raw = JSON.stringify(epShell, null, 2);
  const rawResult = api.parsePageArtefactCaptureForStorage(raw);
  assert.equal(rawResult.ok, true, rawResult.message || (rawResult.errors || []).join("; "));
  assert.equal(String(rawResult.parsed.artifact_type || "").toLowerCase(), "page");

  const fenced = "```json\n" + raw + "\n```";
  const fencedResult = api.parsePageArtefactCaptureForStorage(fenced);
  assert.equal(
    fencedResult.ok,
    true,
    fencedResult.message || (fencedResult.errors || []).join("; ")
  );
  assert.equal(String(fencedResult.parsed.artifact_type || "").toLowerCase(), "page");
});

test("episode plan parser accepts bare episode_plans JSON by converting to page shell", () => {
  const api = loadPrismTestApi();
  const epOnly = {
    episode_plans: [
      {
        activity_id: "LO1",
        episode_plan: {
          archetype: "understand",
          beats: [{ function: "explanation" }, { function: "worked_thinking" }, { function: "verification" }]
        }
      }
    ]
  };
  const epOnlyResult = api.parseEpisodePlanOrPageCaptureForStorage(JSON.stringify(epOnly, null, 2));
  assert.equal(epOnlyResult.ok, true, epOnlyResult.message || (epOnlyResult.errors || []).join("; "));
  assert.equal(String(epOnlyResult.parsed.artifact_type || "").toLowerCase(), "page");

  const pageRaw = JSON.stringify(epShell, null, 2);
  const pageResult = api.parseEpisodePlanOrPageCaptureForStorage(pageRaw);
  assert.equal(pageResult.ok, true, pageResult.message || (pageResult.errors || []).join("; "));
  assert.equal(String(pageResult.parsed.artifact_type || "").toLowerCase(), "page");

  const fenced = "```json\n" + pageRaw + "\n```";
  const fencedResult = api.parseEpisodePlanOrPageCaptureForStorage(fenced);
  assert.equal(
    fencedResult.ok,
    true,
    fencedResult.message || (fencedResult.errors || []).join("; ")
  );
  assert.equal(String(fencedResult.parsed.artifact_type || "").toLowerCase(), "page");
});

test("episode plan parser tolerates prose-wrapped page shell and extracts page object", () => {
  const api = loadPrismTestApi();
  const pageRaw = JSON.stringify(epShell, null, 2);
  const wrapped =
    "Here is the Episode Plan output:\n\n" +
    "```json\n" +
    pageRaw +
    "\n```\n\n" +
    "STEP 2 OUTPUT: page";
  const result = api.parseEpisodePlanOrPageCaptureForStorage(wrapped);
  assert.equal(result.ok, true, result.message || (result.errors || []).join("; "));
  assert.equal(String(result.parsed.artifact_type || "").toLowerCase(), "page");
});

test("episode plan parser tolerates prose-wrapped raw page JSON without fences", () => {
  const api = loadPrismTestApi();
  const pageRaw = JSON.stringify(epShell, null, 2);
  const wrapped = "Episode plan output:\n" + pageRaw + "\nSTEP 2 OUTPUT: page";
  const result = api.parseEpisodePlanOrPageCaptureForStorage(wrapped);
  assert.equal(result.ok, true, result.message || (result.errors || []).join("; "));
  assert.equal(String(result.parsed.artifact_type || "").toLowerCase(), "page");
});

test("episode plan validator auto-fills generation_notes.validation required fields", () => {
  const api = loadPrismTestApi();
  const partialEp = JSON.parse(JSON.stringify(epShell));
  partialEp.generation_notes = { validation: { coverage_mode: "activity_aligned", known_issues: [] } };
  const result = api.parseEpisodePlanOrPageCaptureForStorage(JSON.stringify(partialEp, null, 2));
  assert.equal(result.ok, true, result.message || (result.errors || []).join("; "));
  assert.equal(
    String(result.parsed.generation_notes.validation.activity_coverage || "").length > 0,
    true
  );
  assert.equal(
    String(result.parsed.generation_notes.validation.material_coverage || "").length > 0,
    true
  );
});

test("GAI parser accepts legacy assessment root and converts to page partial", () => {
  const api = loadPrismTestApi();
  const legacy = {
    assessment: {
      assessment_type: "mixed",
      items: [
        {
          item_id: "Q1",
          question_type: "multiple_choice",
          question: "Sample",
          options: ["A", "B", "C", "D"],
          correct_answer: "A"
        }
      ]
    }
  };
  const result = api.parseGenerateAssessmentItemsOrPageCaptureForStorage(
    JSON.stringify(legacy, null, 2)
  );
  assert.equal(result.ok, true, result.message || (result.errors || []).join("; "));
  assert.equal(String(result.parsed.artifact_type || "").toLowerCase(), "page");
  assert.equal(
    String(result.parsed.assembly_state.current_stage || "").toLowerCase(),
    "assessment_items"
  );
  assert.equal(
    Array.isArray(result.parsed.assessment_check && result.parsed.assessment_check.items),
    true
  );
});

test("page artefact parser rejects malformed/prose/multi-object captures", () => {
  const api = loadPrismTestApi();
  const malformed = api.parsePageArtefactCaptureForStorage('{"artifact_type":"page",');
  assert.equal(malformed.ok, false);
  assert.match(
    String(malformed.message || ""),
    /parse failed|invalid|single JSON object|only one JSON object/i
  );

  const proseWrapped = api.parsePageArtefactCaptureForStorage(
    "Here is the artefact:\n" + JSON.stringify(epShell, null, 2)
  );
  assert.equal(proseWrapped.ok, false);
  assert.match(String(proseWrapped.message || ""), /only one JSON object|raw JSON|fenced/i);

  const multiPage = api.parsePageArtefactCaptureForStorage(
    JSON.stringify(epShell, null, 2) + "\n" + JSON.stringify(epShell, null, 2)
  );
  assert.equal(multiPage.ok, false);
  assert.match(String(multiPage.message || ""), /multiple|single JSON object|parse failed|invalid/i);
});

test("all page-structure-producing Sprint 58 steps accept raw JSON page captures", () => {
  const api = loadPrismTestApi();
  const wf = buildWorkflow();
  const stepToRaw = {
    ep_step: JSON.stringify(epShell, null, 2),
    dla_step: JSON.stringify(dlaPartial, null, 2),
    gam_step: JSON.stringify(gamPartial, null, 2),
    ls_step: JSON.stringify(lsPartial, null, 2),
    dp_step: JSON.stringify(dpPartial, null, 2),
    da_step: JSON.stringify(daPartial, null, 2),
    gai_step: JSON.stringify(gaiPartial, null, 2)
  };
  Object.keys(stepToRaw).forEach((sid) => {
    const step = wf.steps.find((row) => row.id === sid);
    assert.equal(api.isWorkflowStepPageStructureProducer(step, wf), true, sid + " should be page producer");
    const result = api.parsePageArtefactCaptureForStorage(stepToRaw[sid]);
    assert.equal(result.ok, true, sid + ": " + (result.message || (result.errors || []).join("; ")));
  });
});

test("stored output visibility rule hides non-artefact steps and shows artefact steps", () => {
  const api = loadPrismTestApi();
  const wf = buildWorkflow({
    steps: buildWorkflow().steps.concat([
      {
        id: "non_art_step",
        title: "Reflect",
        outputName: "",
        canonical_step_id: "step_reflect_on_session"
      }
    ])
  });
  const pageStep = wf.steps.find((row) => row.id === "dp_step");
  const nonArtefactStep = wf.steps.find((row) => row.id === "non_art_step");
  assert.equal(api.workflowStepProducesStoredArtefact(pageStep, wf), true);
  assert.equal(api.workflowStepProducesStoredArtefact(nonArtefactStep, wf), false);
});
