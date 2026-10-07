/**
 * Sprint 92 Gate 8 — live E2E defect regression:
 * Stage 5 omitted artifact_type / schema_version / situated_learning and emitted
 * Interactive-shaped page_synthesis because Copy wiring fell through to Sprint 58
 * Interactive Design Page instructions.
 *
 * Do not weaken validateSituatedTaskDesignPage; prove the live Copy path requires
 * the canonical Situated contract.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const family = require("../lib/first-class-workflow-family.js");
const design = require("../lib/situated-task-design-page.js");
const sibling = require("../lib/situated-task-sibling-prompts.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const appSource = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");

const REQUIRED_NESTED = [
  "purpose.learning_intent",
  "purpose.activity_rationale",
  "activity.undertaking",
  "activity.context",
  "activity.learner_agency",
  "record.retain",
  "reconnection.destination",
  "reconnection.use"
];

function buildSituatedWorkflow(overrides) {
  const built = family.buildFirstClassWorkflowFamily({
    product: "situated_task",
    focus: "Investigate what happens in practice",
    audience: "undergraduate students",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(built.ok, true);
  return Object.assign(
    {
      id: "wf-st-stage5-wiring",
      product: "situated_task",
      name: "Situated Stage 5 wiring",
      ldCreateOutputType: "situated_task",
      // Reproduce the live stamp that previously triggered Interactive DP copy notes.
      workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true },
      steps: built.steps.map((step, index) =>
        Object.assign({}, step, { id: "st-s5-" + (index + 1) })
      )
    },
    overrides || {}
  );
}

/** Live failure shape from Gate 8 E2E (Interactive-ish page without Situated envelope). */
function liveFailureStage5Payload() {
  return {
    title: "Investigate What Happens in Practice",
    page_synthesis: {
      overview: "Orient the learner to the practice situation.",
      knowledge_summary: "What tends to happen when teams investigate practice."
    },
    sections: [
      {
        section_id: "orient",
        title: "Orient",
        order: 1,
        exposition: "Investigate carefully."
      }
    ],
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["design_page"],
      calls_model: true
    }
  };
}

test("Stage 5 generation prompt explicitly requires canonical Situated envelope + JSON purity", () => {
  const prompt = design.buildSituatedTaskDesignPagePrompt();
  assert.match(prompt, /JSON PURITY \(mandatory/i);
  assert.match(prompt, /No prose outside the fenced JSON/i);
  assert.match(prompt, /:chatgpt-content-reference/i);
  assert.match(prompt, /MANDATORY top-level fields/i);
  assert.match(prompt, /artifact_type: exactly "page"/);
  assert.match(prompt, /schema_version: exactly "2\.0\.0"/);
  assert.match(prompt, /activities: exactly \[\]/);
  assert.match(prompt, /sections: ordered non-empty array/);
  assert.match(prompt, /situated_learning: required object/);
  assert.match(prompt, /Exact JSON envelope/);
  assert.match(prompt, /"artifact_type": "page"/);
  assert.match(prompt, /"schema_version": "2\.0\.0"/);
  assert.match(prompt, /"activities": \[\]/);
  assert.match(prompt, /"situated_learning"/);
  assert.match(prompt, /Never invent page_synthesis|Do not invent page_synthesis/);
  assert.doesNotMatch(prompt, /Sprint 58 Design Page partial output mode/);
  REQUIRED_NESTED.forEach((field) => {
    assert.match(prompt, new RegExp(field.replace(/\./g, "\\.")));
  });
  assert.equal(sibling.resolveTemplate("design_page"), prompt);

  const copy = design.buildSituatedTaskDesignPageCopyInstructions();
  assert.match(copy, /artifact_type "page"/);
  assert.match(copy, /schema_version "2\.0\.0"/);
  assert.match(copy, /activities: \[\]/);
  assert.match(copy, /situated_learning/);
  assert.match(copy, /purpose\.learning_intent/);
  assert.match(copy, /Do not invent page_synthesis/);
  assert.match(copy, /No prose outside the fenced JSON/);
});

test("app.js routes Situated Design Page away from Interactive pageEnrichmentV2", () => {
  assert.match(
    appSource,
    /Situated Task Design Page is GPT same-chat synthesis — not Interactive pageEnrichmentV2/
  );
  assert.match(appSource, /clearSituatedTaskDesignPageModelPromptSeed/);
  assert.match(appSource, /buildSituatedTaskDesignPageCopyInstructions/);
  assert.match(
    appSource,
    /String\(wf\.product \|\| ""\)\.trim\(\) !== "situated_task"/
  );
  const designPageBranch = appSource.indexOf("isWorkflowStepDesignPage({");
  assert.ok(designPageBranch !== -1);
  const stBranch = appSource.indexOf(
    "buildSituatedTaskDesignPageCopyInstructions",
    designPageBranch
  );
  const interactivePartial = appSource.indexOf(
    "Sprint 58 Design Page partial output mode: return a partial page artefact containing title, page_synthesis",
    designPageBranch
  );
  assert.ok(stBranch !== -1);
  assert.ok(interactivePartial !== -1);
  assert.ok(
    stBranch < interactivePartial,
    "Situated Copy notes must be selected before Interactive Sprint 58 Design Page partial"
  );
});

test("live Copy path emits Situated contract even when pageEnrichmentV2 was stamped", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/situated-task-design-page.js",
      "lib/situated-task-sibling-prompts.js"
    ]
  });
  assert.equal(typeof api.buildWorkflowStepInstructions, "function");
  assert.equal(typeof api.resolveStepPromptText, "function");

  const wf = buildSituatedWorkflow();
  const designStep = wf.steps.find((s) => s.title === "Design Page");
  assert.ok(designStep);
  assert.equal(designStep.outputName, "situated_task_page");

  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  const liveCopied = api.buildWorkflowStepInstructions(designStep, 4, null);
  assert.match(liveCopied, /Situated Task Design Page/i);
  assert.match(liveCopied, /situated_learning/);
  assert.match(liveCopied, /artifact_type/);
  assert.match(liveCopied, /schema_version/);
  assert.match(liveCopied, /activities/);
  assert.equal(
    liveCopied.indexOf("Sprint 58 Design Page partial output mode"),
    -1,
    "must not inject Interactive Sprint 58 Design Page partial instructions"
  );
  assert.equal(
    liveCopied.indexOf("return a partial page artefact containing title, page_synthesis"),
    -1
  );

  const resolved = api.resolveStepPromptText(designStep, wf);
  assert.ok(resolved && resolved.text);
  assert.match(resolved.text, /MANDATORY top-level fields/i);
  assert.match(resolved.text, /"artifact_type": "page"/);
  assert.match(resolved.text, /"schema_version": "2\.0\.0"/);
  assert.match(resolved.text, /"activities": \[\]/);
  assert.match(resolved.text, /"situated_learning"/);
  assert.match(resolved.text, /JSON PURITY \(mandatory/i);
  REQUIRED_NESTED.forEach((field) => {
    assert.match(resolved.text, new RegExp(field.replace(/\./g, "\\.")));
  });
  assert.doesNotMatch(resolved.text, /Sprint 58 Design Page partial/);
});

test("clearSituatedTaskDesignPageModelPromptSeed removes Interactive Design Page seed", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/situated-task-design-page.js",
      "lib/situated-task-sibling-prompts.js"
    ]
  });
  const wf = buildSituatedWorkflow();
  const step = wf.steps.find((s) => s.title === "Design Page");
  step.override_prompt_body =
    "Sprint 58 Design Page partial output mode: return a partial page artefact containing title, page_synthesis";
  step.prompt_source_type = "local_override";
  api.clearSituatedTaskDesignPageModelPromptSeed(wf);
  assert.equal(String(step.override_prompt_body || ""), "");
  assert.equal(String(step.prompt_source_type || ""), "none");
});

test("validator still rejects live failure shape and missing canonical fields", () => {
  const live = liveFailureStage5Payload();
  const liveResult = design.validateSituatedTaskDesignPage(live);
  assert.equal(liveResult.ok, false);
  assert.ok(
    (liveResult.errors || []).includes("wrong_artifact_type"),
    "live failure must remain wrong_artifact_type"
  );

  const fixture = design.buildSituatedTaskDesignPageFixture().page;
  assert.equal(design.validateSituatedTaskDesignPage(fixture).ok, true);

  assert.equal(
    design.validateSituatedTaskDesignPage(
      Object.assign({}, fixture, { artifact_type: "situated_task_page" })
    ).ok,
    false
  );
  assert.equal(
    design.validateSituatedTaskDesignPage(
      (() => {
        const clone = Object.assign({}, fixture);
        delete clone.artifact_type;
        return clone;
      })()
    ).ok,
    false
  );
  assert.equal(
    design.validateSituatedTaskDesignPage(
      Object.assign({}, fixture, { schema_version: "1.0.0" })
    ).ok,
    false
  );
  assert.equal(
    design.validateSituatedTaskDesignPage(
      (() => {
        const clone = Object.assign({}, fixture);
        delete clone.schema_version;
        return clone;
      })()
    ).ok,
    false
  );
  assert.equal(
    design.validateSituatedTaskDesignPage(
      (() => {
        const clone = Object.assign({}, fixture);
        delete clone.situated_learning;
        return clone;
      })()
    ).ok,
    false
  );

  const missingNestedCases = [
    ["purpose.learning_intent", (sl) => {
      delete sl.purpose.learning_intent;
    }],
    ["purpose.activity_rationale", (sl) => {
      delete sl.purpose.activity_rationale;
    }],
    ["activity.undertaking", (sl) => {
      delete sl.activity.undertaking;
    }],
    ["activity.context", (sl) => {
      delete sl.activity.context;
    }],
    ["activity.learner_agency", (sl) => {
      delete sl.activity.learner_agency;
    }],
    ["record.retain", (sl) => {
      delete sl.record.retain;
    }],
    ["reconnection.destination", (sl) => {
      delete sl.reconnection.destination;
    }],
    ["reconnection.use", (sl) => {
      delete sl.reconnection.use;
    }]
  ];
  missingNestedCases.forEach(([label, mutate]) => {
    const page = JSON.parse(JSON.stringify(fixture));
    mutate(page.situated_learning);
    const result = design.validateSituatedTaskDesignPage(page);
    assert.equal(result.ok, false, "must reject missing " + label);
  });
});
