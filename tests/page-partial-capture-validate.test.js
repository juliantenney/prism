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
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat([
      "lib/page-shell-create.js",
      "lib/ld-activity-title-contract.js",
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
dlaPartial.activities[0].learner_task = "Compare inflation drivers using the classification framework.";
dlaPartial.activities[0].expected_output = "A structured comparison paragraph.";
dlaPartial.activities[1].learner_task = "Apply CPI calculations using the scaffold.";
dlaPartial.activities[1].expected_output = "Completed calculation worksheet showing each step.";
dlaPartial.activities.forEach((activity) => {
  activity.evidence_decision = {
    required: false,
    reason: "Task completes from scaffolded materials without external evidence inspection.",
    provider_material_ids: []
  };
});
const gamPartial = loadFixture("gam-partial.json");
const lsPartial = loadFixture("ls-partial.json");
const dpPartial = loadFixture("dp-partial.json");
const daPartial = loadFixture("assessment-design-partial.json");
const gaiPartial = loadFixture("assessment-items-partial.json");

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
  assert.equal(check.ok, false);
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

test("episode plan parser accepts fenced page shell JSON", () => {
  const api = loadPrismTestApi();
  const pageRaw = JSON.stringify(epShell, null, 2);
  const pageResult = api.parseEpisodePlanOrPageCaptureForStorage(pageRaw);
  assert.equal(pageResult.ok, true, pageResult.message || (pageResult.errors || []).join("; "));
  assert.equal(String(pageResult.parsed.artifact_type || "").toLowerCase(), "page");
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

function c4Material(id, type, title, body, bodyFormat) {
  const activityId = id.split("-")[0];
  return {
    material_id: id,
    material_type: type,
    activity_id: activityId,
    title: title,
    body_format: bodyFormat || "markdown",
    body: body
  };
}

function c4Checklist(statements) {
  return {
    review_mode: "guided_criteria",
    criteria: statements.map((statement) => ({
      statement: statement,
      why_it_matters: "The comparison must stay consistent with the recorded samples.",
      features: [
        {
          expected: "The response uses the recorded values for the named condition.",
          repair: "Revise the response so it matches the recorded dissolution times."
        }
      ]
    }))
  };
}

function c4ComparingConditionsGamCapture() {
  const degree = "\u00B0";
  const plot = [
    "## Individual-value dot plot",
    "",
    "The plot below represents the twelve synthetic educational measurements. Each marker is one independent trial. Both conditions use the same linear horizontal axis, from 60 to 100 seconds, with labelled ticks at 60, 70, 80, 90 and 100. The marker symbols distinguish the conditions without relying on colour.",
    "",
    "```text",
    "                         Dissolution time (s)",
    "                    60        70        80        90       100",
    "                    |---------|---------|---------|---------|",
    "Condition B: 40 " + degree + "C            \u25CF \u25CF  \u25CF \u25CF\u25CF  \u25CF",
    "Condition A: 20 " + degree + "C                             \u25C6 \u25C6 \u25C6 \u25C6\u25C6 \u25C6",
    "                    |---------|---------|---------|---------|",
    "                    60        70        80        90       100",
    "```",
    "",
    "**Plot key:** \u25CF = Condition B at 40 " + degree + "C; \u25C6 = Condition A at 20 " + degree + "C.",
    "",
    "Use the common axis and the accompanying exact-value table to examine each condition's location and spread. Record your own graphical interpretation before revealing the explanatory feedback. No mean markers or model comparison are supplied in this plot."
  ].join("\n");
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "gam", enriched_by: ["gam"] },
    activities: [
      {
        activity_id: "A1",
        materials: [
          c4Material(
            "A1-M1",
            "data_table",
            "Recorded Dissolution Times",
            "These synthetic educational observations record the time taken for a soluble tablet to dissolve.\n\n| Trial | Condition A: 20 " + degree + "C (s) | Condition B: 40 " + degree + "C (s) |\n|---|---:|---:|\n| 1 | 93 | 78 |\n| 6 | 87 | 77 |"
          ),
          c4Material(
            "A1-M2",
            "comparison_table",
            "Compare the Descriptive Statistics",
            "| Statistic | Condition A: 20 " + degree + "C | Condition B: 40 " + degree + "C | Comparison or interpretation |\n|---|---|---|---|\n| Mean dissolution time (s) | | | |\n| Range (s) | | | |\n| Sample standard deviation (s) | | | |"
          ),
          c4Material(
            "A1-M3",
            "checklist",
            "Review Your Numerical Comparison",
            c4Checklist([
              "Have you calculated the descriptive statistics for both conditions using the correct observations, conventions and units?",
              "Does your interpretation identify the condition with the shorter observed mean correctly?"
            ]),
            "json"
          ),
          c4Material(
            "A1-M4",
            "reference_table",
            "Verified Descriptive Statistics",
            "### Reveal after completing and reviewing your comparison\n\n| Statistic | Condition A: 20 " + degree + "C | Condition B: 40 " + degree + "C |\n|---|---:|---:|\n| Mean dissolution time (s) | 91.6667 | 75.5000 |\n| Range (s) | 9 | 11 |\n| Sample standard deviation (s) | 3.3267 | 4.0373 |\n\nRounded to two decimal places, the sample standard deviations are 3.33 s and 4.04 s."
          )
        ]
      },
      {
        activity_id: "A2",
        materials: [
          c4Material(
            "A2-M1",
            "template",
            "Calculate and Interpret the Signed Mean Difference",
            "Follow the specified order, **Condition B minus Condition A**.\n\n**Subtraction and signed difference:**\n\n"
          ),
          c4Material(
            "A2-M2",
            "checklist",
            "Review Your Mean-Difference Calculation",
            c4Checklist([
              "Have you identified the correct sample mean for each condition?",
              "Does your calculation use Condition B minus Condition A in the required order?"
            ]),
            "json"
          ),
          c4Material(
            "A2-M3",
            "text",
            "Verified Difference Between the Means",
            "### Reveal after completing and reviewing your calculation\n\nThe verified sample means are 75.5000 s for Condition B at 40 " + degree + "C and 91.6667 s for Condition A at 20 " + degree + "C.\n\n\\[\n75.5000-91.6667\\approx-16.1667\n\\]\n\nThe signed difference is approximately **\u221216.17 s**."
          )
        ]
      },
      {
        activity_id: "A3",
        materials: [
          c4Material(
            "A3-M1",
            "scenario",
            "Individual-Value Dot Plot of Dissolution Times",
            plot
          ),
          c4Material(
            "A3-M2",
            "data_table",
            "Measurements Underlying the Dot Plot",
            "| Trial | Condition A: 20 " + degree + "C (s) | Condition B: 40 " + degree + "C (s) |\n|---|---:|---:|\n| 1 | 93 | 78 |"
          ),
          c4Material(
            "A3-M3",
            "template",
            "Interpret the Individual-Value Plot",
            "**Condition A pattern:**\n\n\n\n**Condition B pattern:**\n\n"
          ),
          c4Material(
            "A3-M4",
            "checklist",
            "Review Your Graphical Interpretation",
            c4Checklist([
              "Have you used accurate individual observations to support your descriptions of both conditions?",
              "Have you interpreted the two groups using the shared horizontal scale correctly?"
            ]),
            "json"
          ),
          c4Material(
            "A3-M5",
            "text",
            "What the Individual Measurements Reveal",
            "### Reveal after completing and reviewing your graphical interpretation\n\nThe Condition B observations range from **70 to 81 s**, while the Condition A observations range from **87 to 96 s**."
          )
        ]
      },
      {
        activity_id: "A4",
        materials: [
          c4Material(
            "A4-M1",
            "task_card",
            "Evidence Card: Tablet-Dissolution Investigation",
            "**Signed difference between sample means:** Condition B minus Condition A = **\u221216.1667 s**."
          ),
          c4Material(
            "A4-M2",
            "template",
            "Compose an Evidence-Based Provisional Comparison",
            "**Observed direction and magnitude:**\n\n"
          ),
          c4Material(
            "A4-M3",
            "transfer_prompt",
            "Write a Scientific Results Caption",
            "Write a concise scientific results caption for those readers."
          ),
          c4Material(
            "A4-M4",
            "template",
            "Your Scientific Results Caption",
            "**Scientific results caption:**\n\n"
          ),
          c4Material(
            "A4-M5",
            "checklist",
            "Review Your Provisional Comparison and Results Caption",
            c4Checklist([
              "Have you reported the observed direction, magnitude and units accurately in both written responses?",
              "Have you kept both interpretations within the evidential limits of the synthetic investigation?"
            ]),
            "json"
          ),
          c4Material(
            "A4-M6",
            "text",
            "Feedback: Strength and Limits of the Provisional Comparison",
            "### Reveal after completing and reviewing both written responses\n\n### Page learner-resource closure\n\n- Reconnect the mean with average recorded time."
          )
        ]
      }
    ]
  };
}

test("C4 GAM raw JSON with an internal text-diagram fence is accepted", () => {
  const api = loadPrismTestApi();
  const gamEnrich = require(path.join(repoRoot, "lib", "page-gam-enrich.js"));
  const capture = c4ComparingConditionsGamCapture();
  const pasted = "\n  " + JSON.stringify(capture, null, 2) + "\n";
  assert.equal(JSON.parse(pasted).artifact_type, "page");
  assert.match(pasted, /```text/);
  assert.doesNotMatch(pasted.trim(), /^```/);

  const result = api.parsePageArtefactCaptureForStorage(pasted);
  assert.equal(result.ok, true, result.message || (result.errors || []).join("; "));
  assert.equal(result.errors.length, 0);
  assert.equal(result.parsed.schema_version, "2.0.0");
  assert.equal(result.parsed.assembly_state.current_stage, "gam");
  assert.equal(result.parsed.activities.length, 4);
  const plotBody = result.parsed.activities[2].materials[0].body;
  assert.match(plotBody, /```text/);
  assert.match(plotBody, /Dissolution time \(s\)/);
  assert.match(result.parsed.activities[0].materials[3].body, /3\.3267/);
  assert.match(result.parsed.activities[0].materials[3].body, /4\.0373/);
  assert.match(result.parsed.activities[1].materials[2].body, /16\.17/);

  const partial = gamEnrich.validateGamPartialPageCapture(result.parsed, { baseline: null });
  assert.equal(partial.ok, true, (partial.errors || []).join("; "));

  const malformed = api.parsePageArtefactCaptureForStorage('{"artifact_type":"page",');
  assert.equal(malformed.ok, false);
  assert.match(String(malformed.message || ""), /parse failed|invalid|JSON/i);

  const notPage = api.parsePageArtefactCaptureForStorage(
    JSON.stringify({ artifact_type: "gam_notes", schema_version: "2.0.0", activities: [] })
  );
  assert.equal(notPage.ok, false);
  assert.match(String(notPage.message || ""), /artifact_type "page"/);

  const brokenFence = api.parsePageArtefactCaptureForStorage("```text\nnot json\n```");
  assert.equal(brokenFence.ok, false);
  assert.match(String(brokenFence.message || ""), /fenced/);
  assert.ok((brokenFence.errors || []).indexOf("invalid_fenced_block") >= 0);
});
