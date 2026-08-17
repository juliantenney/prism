/**
 * S78-T-017 — GAM operational suitability review pass (prompt-contract + gate tests).
 * Structural verdict-artefact validation only — no semantic solvers.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const opsLib = require(path.join(repoRoot, "lib", "gam-operational-suitability-prompt.js"));
const reviewLib = require(path.join(repoRoot, "lib", "gam-operational-suitability-review.js"));
const gamContract = require(path.join(repoRoot, "lib", "ld-gam-page-enrich-contract.js"));
const gamEnrich = require(path.join(repoRoot, "lib", "page-gam-enrich.js"));
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

function loadPrismTestApi() {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

const api = loadPrismTestApi();
api.installGamVerificationScopeWorkflowForTest();
const GAM_STEP = "gam_step";

function determinateQuantPage() {
  return {
    activities: [
      {
        activity_id: "A1",
        learner_task: "1. Solve the constrained allocation problem.\n2. Verify your candidate optimum.",
        expected_output: "Identification of optimal resource values.",
        task_material_decision: { task_input_material_ids: ["A1-M1"] },
        required_materials: [
          {
            material_id: "A1-M1",
            material_type: "scenario",
            purpose: "Supply the allocation problem instance.",
            specification: "One self-contained constrained allocation instance."
          },
          {
            material_id: "A1-M2",
            material_type: "worked_example",
            purpose: "Complete worked solution on a reference instance.",
            specification: "Complete worked solution demonstrating the method."
          }
        ]
      }
    ]
  };
}

function studyOnlyPage() {
  return {
    activities: [
      {
        activity_id: "S1",
        learner_task: "1. Read the overview.\n2. Review the glossary.",
        expected_output: "Familiarity with terminology.",
        required_materials: [
          {
            material_id: "S1-M1",
            material_type: "text",
            purpose: "Overview reading.",
            specification: "Short glossary-led overview."
          }
        ]
      }
    ]
  };
}

function openHumanitiesPage() {
  return {
    activities: [
      {
        activity_id: "H1",
        learner_task: "1. Read the passage.\n2. Write an interpretive response.",
        expected_output: "Open-ended interpretive analysis; multiple defensible readings are valid.",
        task_material_decision: { task_input_material_ids: ["H1-M1"] },
        required_materials: [
          {
            material_id: "H1-M1",
            material_type: "scenario",
            purpose: "Literary passage for interpretation.",
            specification: "Short passage with ambiguous symbolism."
          }
        ]
      }
    ]
  };
}

function deliberateInsufficiencyPage() {
  return {
    activities: [
      {
        activity_id: "D1",
        learner_task: "1. Diagnose what information is missing from the brief.",
        expected_output: "List of missing information required before a decision can be made.",
        task_material_decision: { task_input_material_ids: ["D1-M1"] },
        required_materials: [
          {
            material_id: "D1-M1",
            material_type: "task_card",
            purpose: "Deliberately incomplete decision brief.",
            specification: "Brief missing cost and capacity figures by design."
          }
        ]
      }
    ]
  };
}

function programmingPage() {
  return {
    activities: [
      {
        activity_id: "P1",
        learner_task: "1. Debug the supplied function so the listed tests pass.",
        expected_output: "Corrected function satisfying the supplied tests.",
        task_material_decision: { task_input_material_ids: ["P1-M1"] },
        required_materials: [
          {
            material_id: "P1-M1",
            material_type: "task_card",
            purpose: "Starter function and failing tests.",
            specification: "One function plus three unit tests the learner must satisfy."
          }
        ]
      }
    ]
  };
}

function dataTablePage() {
  return {
    activities: [
      {
        activity_id: "DT1",
        learner_task: "1. Calculate the requested totals from the supplied table.",
        expected_output: "Named totals implied by the table.",
        task_material_decision: { task_input_material_ids: ["DT1-M1"] },
        required_materials: [
          {
            material_id: "DT1-M1",
            material_type: "scenario",
            purpose: "Data table for the commissioned totals.",
            specification: "Table containing the variables named in expected_output."
          }
        ]
      }
    ]
  };
}

function candidate4ShapedDla() {
  return {
    activities: [
      {
        activity_id: "A4",
        learner_task:
          "1. Study the worked method.\n2. Solve the independent constrained allocation problem.\n3. Report the optimal values.",
        expected_output: "Optimal values implied by the supplied independent instance.",
        task_material_decision: { task_input_material_ids: ["A4-M2"] },
        required_materials: [
          {
            material_id: "A4-M1",
            material_type: "worked_example",
            purpose: "Model complete worked solution.",
            specification: "Complete worked solution on a distinct reference instance.",
            practice_independence: { attempt_operand_material_ids: ["A4-M2"] }
          },
          {
            material_id: "A4-M2",
            material_type: "task_card",
            purpose: "Independent practice operand.",
            specification: "Distinct instance for learner solve/verify."
          },
          {
            material_id: "A4-M3",
            material_type: "analysis_table",
            purpose: "Learner workspace.",
            specification: "Editable table for learner entries.",
            response_fulfilment: { kind: "learner_workspace", response_kind: "table_complete" }
          }
        ]
      }
    ]
  };
}

function materialsGam(activityId, rows) {
  return {
    activities: [
      {
        activity_id: activityId,
        materials: rows.map(function (row) {
          return {
            material_id: row.material_id,
            material_type: row.material_type || "text",
            activity_id: activityId,
            title: row.title || row.material_id,
            body_format: "markdown",
            body: row.body
          };
        })
      }
    ]
  };
}

function determinateGam() {
  return materialsGam("A1", [
    { material_id: "A1-M1", material_type: "scenario", body: "Allocation instance: 12 units, costs 3 and 5, unique feasible optimum." },
    { material_id: "A1-M2", material_type: "worked_example", body: "Complete worked solution reaching the promised optimum on a reference instance." }
  ]);
}

function candidate4ShapedGam() {
  return materialsGam("A4", [
    {
      material_id: "A4-M1",
      material_type: "worked_example",
      body: "Worked model on instance Alpha: a complete, internally consistent solution of a distinct problem."
    },
    {
      material_id: "A4-M2",
      material_type: "task_card",
      body:
        "Practice instance Beta. Condition set requires result value 8. The same condition set also requires result value 4. Report the unique result."
    },
    {
      material_id: "A4-M3",
      material_type: "analysis_table",
      body: "| x | y | result |\n| --- | --- | --- |\n| | | |"
    }
  ]);
}

function makeReview(dla, gam, verdictOverrides) {
  const obligations = reviewLib.collectObligations(dla);
  const fingerprint = reviewLib.fingerprintGamMaterials(dla, gam);
  const verdicts = obligations.map(function (row) {
    const extra = (verdictOverrides && verdictOverrides[row.material_id]) || {};
    return Object.assign(
      {
        activity_id: row.activity_id,
        material_id: row.material_id,
        suitable: true,
        failure_class: "none",
        reason: ""
      },
      extra
    );
  });
  return JSON.stringify(
    {
      artifact_type: "gam_operational_suitability_review",
      schema_version: "1.0.0",
      gam_fingerprint: fingerprint,
      verdicts: verdicts
    },
    null,
    2
  );
}

function applyGate(dla, gam, reviewRaw) {
  api.resetGamOperationalSuitabilityReviewStateForTest();
  api.installGamVerificationScopeWorkflowForTest();
  api.setWorkflowRunGamSuitabilityReviewRawForTest(GAM_STEP, reviewRaw || "");
  api.applyGamOperationalSuitabilityReviewGate(GAM_STEP, gam, dla);
}

test("R1: obligated GAM requires review before acceptance", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const gate = reviewLib.evaluateReviewGate(dla, gam, "");
  assert.equal(gate.required, true);
  assert.equal(gate.accepted, false);
  assert.match(gate.errors.join(" "), /S78_OPS2_REVIEW_REQUIRED/);
  applyGate(dla, gam, "");
  assert.ok(api.workflowRunStepHasBlockingCaptureErrors(GAM_STEP));
  assert.match(api.getWorkflowRunGamSuitabilityReviewValidationForTest(GAM_STEP), /verification required/i);
  assert.match(api.getWorkflowRunCaptureGatesBlockReasonForTest(GAM_STEP), /verification required/i);
});

test("R2: zero obligations bypass review", () => {
  const dla = studyOnlyPage();
  const gam = materialsGam("S1", [{ material_id: "S1-M1", body: "Glossary overview." }]);
  assert.equal(opsLib.collectSuitabilityObligationsFromPage(dla).length, 0);
  const gate = reviewLib.evaluateReviewGate(dla, gam, "");
  assert.equal(gate.required, false);
  assert.equal(gate.accepted, true);
  applyGate(dla, gam, "");
  assert.equal(api.getWorkflowRunGamSuitabilityReviewValidationForTest(GAM_STEP), "");
  assert.equal(api.workflowRunStepHasBlockingCaptureErrors(GAM_STEP), false);
});

test("R3: all suitable → PASS", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const review = makeReview(dla, gam);
  const gate = reviewLib.evaluateReviewGate(dla, gam, review);
  assert.equal(gate.required, true);
  assert.equal(gate.accepted, true);
  applyGate(dla, gam, review);
  assert.equal(api.getWorkflowRunGamSuitabilityReviewValidationForTest(GAM_STEP), "");
  assert.equal(api.tryCompleteWorkflowRunStepIfCaptureGatesPassForTest(GAM_STEP), true);
});

test("R4: one unsuitable → FAIL blocks completion", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const review = makeReview(dla, gam, {
    "A1-M1": {
      suitable: false,
      failure_class: "contradiction",
      reason: "Particulars prevent the commissioned result."
    }
  });
  const gate = reviewLib.evaluateReviewGate(dla, gam, review);
  assert.equal(gate.accepted, false);
  assert.match(gate.errors.join(" "), /S78_OPS2_REVIEW_FAIL/);
  applyGate(dla, gam, review);
  api.setWorkflowRunStepCompletedForTest({ [GAM_STEP]: true });
  api.applyGamOperationalSuitabilityReviewGate(GAM_STEP, gam, dla);
  assert.equal(api.isWorkflowRunStepCompletedForTest(GAM_STEP), false);
  assert.equal(api.tryCompleteWorkflowRunStepIfCaptureGatesPassForTest(GAM_STEP), false);
});

test("R5: contradiction FAIL", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const review = makeReview(dla, gam, {
    "A1-M1": {
      suitable: false,
      failure_class: "contradiction",
      reason: "Two mutually exclusive conditions for the same requested result."
    }
  });
  const parsed = JSON.parse(review);
  const check = reviewLib.validateReviewArtefact(parsed, {
    obligations: reviewLib.collectObligations(dla),
    expectedFingerprint: reviewLib.fingerprintGamMaterials(dla, gam)
  });
  assert.equal(check.ok, true);
  assert.equal(check.suitableAll, false);
  assert.equal(reviewLib.evaluateReviewGate(dla, gam, review).accepted, false);
});

test("R6: insufficiency FAIL", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const review = makeReview(dla, gam, {
    "A1-M1": {
      suitable: false,
      failure_class: "insufficiency",
      reason: "Operand omits a required relation for the commissioned result."
    }
  });
  assert.match(reviewLib.evaluateReviewGate(dla, gam, review).errors.join(" "), /S78_OPS2_REVIEW_FAIL/);
});

test("R7: incomplete_model FAIL blocks acceptance", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const review = makeReview(dla, gam, {
    "A1-M2": {
      suitable: false,
      failure_class: "incomplete_model",
      reason: "Model stops before the promised complete worked result."
    }
  });
  applyGate(dla, gam, review);
  assert.match(api.getWorkflowRunGamSuitabilityReviewValidationForTest(GAM_STEP), /Verification found an issue/i);
  assert.equal(api.tryCompleteWorkflowRunStepIfCaptureGatesPassForTest(GAM_STEP), false);
});

test("R8: open-ended PASS supported", () => {
  const dla = openHumanitiesPage();
  const gam = materialsGam("H1", [
    { material_id: "H1-M1", material_type: "scenario", body: "A short ambiguous passage that supports more than one reading." }
  ]);
  const prompt = reviewLib.buildReviewPrompt(dla, gam);
  assert.match(prompt, /multiple defensible answers are NOT a failure/i);
  const review = makeReview(dla, gam);
  assert.equal(reviewLib.evaluateReviewGate(dla, gam, review).accepted, true);
});

test("R9: deliberate insufficiency PASS supported", () => {
  const dla = deliberateInsufficiencyPage();
  const gam = materialsGam("D1", [
    { material_id: "D1-M1", material_type: "task_card", body: "Brief omits cost and capacity; identify what is missing." }
  ]);
  const prompt = reviewLib.buildReviewPrompt(dla, gam);
  assert.match(prompt, /Deliberate insufficiency/i);
  const review = makeReview(dla, gam);
  assert.equal(reviewLib.evaluateReviewGate(dla, gam, review).accepted, true);
});

test("R10: exact material-id closure", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const obligations = reviewLib.collectObligations(dla);
  const ids = obligations.map((row) => row.material_id).sort();
  assert.deepEqual(ids, ["A1-M1", "A1-M2"]);
  const extra = JSON.parse(makeReview(dla, gam));
  extra.verdicts.push({
    activity_id: "A1",
    material_id: "A1-EXTRA",
    suitable: true,
    failure_class: "none",
    reason: ""
  });
  const extraCheck = reviewLib.validateReviewArtefact(extra, {
    obligations: obligations,
    expectedFingerprint: extra.gam_fingerprint
  });
  assert.equal(extraCheck.ok, false);
  assert.ok(extraCheck.errors.some((err) => /unknown material_id A1-EXTRA/.test(err)));
});

test("R11: duplicate / extra / missing review rows fail", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const obligations = reviewLib.collectObligations(dla);
  const fingerprint = reviewLib.fingerprintGamMaterials(dla, gam);
  const duplicate = JSON.parse(makeReview(dla, gam));
  duplicate.verdicts.push(Object.assign({}, duplicate.verdicts[0]));
  assert.ok(
    reviewLib
      .validateReviewArtefact(duplicate, { obligations: obligations, expectedFingerprint: fingerprint })
      .errors.some((err) => /duplicate material_id/.test(err))
  );
  const missing = JSON.parse(makeReview(dla, gam));
  missing.verdicts = missing.verdicts.slice(0, 1);
  assert.ok(
    reviewLib
      .validateReviewArtefact(missing, { obligations: obligations, expectedFingerprint: fingerprint })
      .errors.some((err) => /missing verdict for obligated material_id A1-M2/.test(err))
  );
});

test("R12: malformed review JSON fails closed", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const gate = reviewLib.evaluateReviewGate(dla, gam, "{not-json");
  assert.equal(gate.accepted, false);
  assert.match(gate.errors.join(" "), /S78_OPS2_REVIEW_INVALID/);
  applyGate(dla, gam, "{not-json");
  assert.match(api.getWorkflowRunGamSuitabilityReviewValidationForTest(GAM_STEP), /could not be read/i);
});

test("R13: stale review fails after GAM regeneration", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const review = makeReview(dla, gam);
  const regenerated = determinateGam();
  regenerated.activities[0].materials[0].body += "\nRegenerated particulars.";
  const gate = reviewLib.evaluateReviewGate(dla, regenerated, review);
  assert.equal(gate.accepted, false);
  assert.ok(gate.errors.some((err) => /S78_OPS2_STALE_REVIEW/.test(err)));
});

test("R14: WS1 coexistence — blank-cell gate remains independent", () => {
  const dla = candidate4ShapedDla();
  const prompt = reviewLib.buildReviewPrompt(dla, candidate4ShapedGam());
  assert.match(prompt, /Do NOT check learner workspace blank cells \(WS1\)/);
  const filledWorkspace = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "WS1 coexistence",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    learning_outcomes: [{ outcome_id: "LO1", statement: "Compare." }],
    episode_plans: [
      {
        activity_id: "A1",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan_id: "EP-A1",
        episode_plan: { archetype: "apply", beats: [{ function: "guided_practice" }] }
      }
    ],
    source_artefacts: [],
    page_synthesis: {},
    generation_notes: {},
    assembly_state: { current_stage: "gam", enriched_by: ["episode_plan", "dla", "gam"] },
    activities: [
      {
        activity_id: "A1",
        title: "Compare entities",
        grouping: "individual",
        duration_minutes: 15,
        learning_outcome_ids: ["LO1"],
        learner_task: "Enter your responses into a comparison table.",
        expected_output: "Completed comparison table.",
        activity_preamble: "Complete the workspace.",
        intellectual_coherence_bridge: "Compare the entities in tabular form.",
        reasoning_orientation: "Compare dimensions systematically.",
        task_material_decision: { separate_inputs_required: false, task_input_material_ids: [] },
        required_materials: [
          {
            material_id: "A1-W1",
            material_type: "comparison_table",
            purpose: "Learner comparison workspace.",
            specification: "Learner-completion cells blank except one optional exemplar row.",
            response_fulfilment: {
              kind: "learner_workspace",
              response_kind: "table_compare",
              allows_partial_exemplar: true
            }
          }
        ],
        evidence_decision: { required: false, reason: "No inspectable particulars required.", provider_material_ids: [] },
        materials: [
          {
            material_id: "A1-W1",
            material_type: "comparison_table",
            activity_id: "A1",
            title: "Comparison workspace",
            body_format: "markdown",
            body: "| Dimension | Entity A | Entity B |\n| --- | --- | --- |\n| Cost | High | Low |\n| Risk | Medium | Low |"
          }
        ],
        episode_plan: { archetype: "apply", beats: [{ function: "guided_practice" }] }
      }
    ]
  };
  const blankCheck = gamEnrich.validateGamEnrichedPage(filledWorkspace, filledWorkspace);
  assert.equal(blankCheck.ok, false);
  assert.ok((blankCheck.errors || []).some((err) => /S78_WS_GAM_NO_BLANK_CELLS/.test(err)));
});

test("R15: WS2 PASS + suitability FAIL still blocks", () => {
  const dla = candidate4ShapedDla();
  const gam = candidate4ShapedGam();
  const modelBody = gam.activities[0].materials[0].body;
  const attemptBody = gam.activities[0].materials[1].body;
  assert.notEqual(modelBody, attemptBody);
  const review = makeReview(dla, gam, {
    "A4-M2": {
      suitable: false,
      failure_class: "contradiction",
      reason: "Operand conditions cannot jointly determine the commissioned unique result."
    }
  });
  applyGate(dla, gam, review);
  assert.equal(api.tryCompleteWorkflowRunStepIfCaptureGatesPassForTest(GAM_STEP), false);
  const failView = api.resolveGamMaterialsVerificationViewForTest(GAM_STEP, {
    dlaPage: dla,
    gamPage: gam,
    gamStructurallyOk: true
  });
  assert.equal(failView.phase, "review_failed");
  assert.ok(failView.failItems.some((item) => item.label === "A4-M2"));
});

test("R16: P02 unaffected by review pass", () => {
  const prompt = reviewLib.buildReviewPrompt(determinateQuantPage(), determinateGam());
  assert.doesNotMatch(prompt, /evidence_decision/);
  assert.doesNotMatch(prompt, /provider_material_ids/);
  const dlaSource = fs.readFileSync(path.join(repoRoot, "lib", "ld-dla-page-enrich-contract.js"), "utf8");
  assert.match(dlaSource, /evidence_decision/);
  const reviewSource = fs.readFileSync(path.join(repoRoot, "lib", "gam-operational-suitability-review.js"), "utf8");
  assert.doesNotMatch(reviewSource, /evidence_requirement/);
});

test("R17: complete model PASS", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const review = makeReview(dla, gam);
  const parsed = JSON.parse(review);
  const model = parsed.verdicts.find((row) => row.material_id === "A1-M2");
  assert.equal(model.suitable, true);
  assert.equal(model.failure_class, "none");
  assert.equal(reviewLib.evaluateReviewGate(dla, gam, review).accepted, true);
});

test("R18: cross-disciplinary prompt semantics remain commission-relative", () => {
  const programmingPrompt = reviewLib.buildReviewPrompt(
    programmingPage(),
    materialsGam("P1", [{ material_id: "P1-M1", material_type: "task_card", body: "function add(a,b){return a-b}\nassert add(2,2)===4" }])
  );
  assert.match(programmingPrompt, /Debug the supplied function/);
  assert.match(programmingPrompt, /commission-relative/);
  const dataPrompt = reviewLib.buildReviewPrompt(
    dataTablePage(),
    materialsGam("DT1", [{ material_id: "DT1-M1", material_type: "scenario", body: "| Item | Value |\n| --- | --- |\n| A | 2 |\n| B | 5 |" }])
  );
  assert.match(dataPrompt, /Calculate the requested totals/);
  assert.match(
    reviewLib.buildReviewPrompt(openHumanitiesPage(), materialsGam("H1", [{ material_id: "H1-M1", body: "extract" }])),
    /open.ended/i
  );
});

test("R19: review prompt contains commission + generated body", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const prompt = reviewLib.buildReviewPrompt(dla, gam);
  assert.match(prompt, /S78-OPS-2 OPERATIONAL-SUITABILITY REVIEW/);
  assert.match(prompt, /learner_task: 1\. Solve the constrained allocation problem/);
  assert.match(prompt, /expected_output: Identification of optimal resource values/);
  assert.match(prompt, /generated_body:/);
  assert.match(prompt, /Allocation instance: 12 units/);
  assert.match(prompt, /gam_fingerprint \(copy unchanged\)/);
});

test("T-018A: review prompt requires one fenced json block at the end", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const prompt = reviewLib.buildReviewPrompt(dla, gam);
  const returnIdx = prompt.lastIndexOf("RETURN FORMAT — REQUIRED");
  const materialsIdx = prompt.indexOf("Materials to review:");
  assert.ok(returnIdx > materialsIdx);
  assert.match(prompt.slice(returnIdx), /```json/);
  assert.match(prompt.slice(returnIdx), /No prose before the fence/);
  assert.match(prompt.slice(returnIdx), /Copy gam_fingerprint exactly/);
  assert.doesNotMatch(prompt, /Return raw JSON only \(no markdown fences\)/);
});

test("T-018A: fenced review JSON is accepted by the parser and gate", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const raw = makeReview(dla, gam);
  const fenced = "```json\n" + raw + "\n```";
  assert.equal(reviewLib.parseReviewJson(fenced).ok, true);
  assert.equal(reviewLib.evaluateReviewGate(dla, gam, fenced).accepted, true);
  assert.equal(reviewLib.parseReviewJson(raw).ok, true);
});

test("R20: review prompt excludes full GAM authoring contract", () => {
  const dla = candidate4ShapedDla();
  const gam = candidate4ShapedGam();
  const prompt = reviewLib.buildReviewPrompt(dla, gam);
  const authoring =
    api.buildGamV2CopyMaterialAuthoringBrief() +
    api.buildAuthoritativeDlaMaterialCommissionSectionFromPage(dla) +
    gamContract.buildGamPageEnrichContractBlock();
  assert.doesNotMatch(prompt, /Output contract: return a partial page artefact/);
  assert.doesNotMatch(prompt, /S78-OPERATIONAL-SUITABILITY \(auto-applied\)/);
  assert.doesNotMatch(prompt, /S78-WS-2 MODEL-PRACTICE-INDEPENDENCE/);
  assert.doesNotMatch(prompt, /now certify your own output/i);
  assert.match(api.buildAuthoritativeDlaMaterialCommissionSectionFromPage(dla), /S78-OPERATIONAL-SUITABILITY/);
  assert.doesNotMatch(api.buildAuthoritativeDlaMaterialCommissionSectionFromPage(dla), /S78-OPS-2 OPERATIONAL-SUITABILITY REVIEW/);
  assert.ok(prompt.length > 400, "review prompt unexpectedly small: " + prompt.length);
  assert.ok(prompt.length < authoring.length, "review prompt should be smaller than GAM authoring contract");
});

test("malformed artefact: invalid failure_class / PASS-FAIL consistency / missing reason", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const obligations = reviewLib.collectObligations(dla);
  const fingerprint = reviewLib.fingerprintGamMaterials(dla, gam);
  function check(overrides) {
    const parsed = JSON.parse(makeReview(dla, gam, overrides));
    return reviewLib.validateReviewArtefact(parsed, {
      obligations: obligations,
      expectedFingerprint: fingerprint
    });
  }
  assert.ok(check({ "A1-M1": { failure_class: "not_a_class" } }).errors.some((err) => /failure_class/.test(err)));
  assert.ok(
    check({ "A1-M1": { suitable: true, failure_class: "contradiction" } }).errors.some((err) =>
      /suitable=true requires failure_class none/.test(err)
    )
  );
  assert.ok(
    check({ "A1-M1": { suitable: false, failure_class: "none", reason: "x" } }).errors.some((err) =>
      /suitable=false must not use failure_class none/.test(err)
    )
  );
  assert.ok(
    check({ "A1-M1": { suitable: false, failure_class: "contradiction", reason: "  " } }).errors.some((err) =>
      /suitable=false requires a non-empty reason/.test(err)
    )
  );
});

test("review prompt notes WS2 bindings as out of scope", () => {
  const prompt = reviewLib.buildReviewPrompt(candidate4ShapedDla(), candidate4ShapedGam());
  assert.match(prompt, /Do NOT check whether model and attempt operands are distinct \(WS2\)/);
  assert.match(prompt, /practice_independence: present \(WS2 independence is out of scope/);
  assert.match(prompt, /Do NOT review learner diagnostic feedback or revision guidance/);
});

test("Stage-1 and Stage-2 share the T-015 obligation collector", () => {
  const dla = candidate4ShapedDla();
  const authoringIds = opsLib.collectSuitabilityObligationsFromPage(dla).map((row) => row.material_id);
  const reviewIds = reviewLib.collectObligations(dla).map((row) => row.material_id);
  assert.deepEqual(reviewIds, authoringIds);
  assert.ok(authoringIds.includes("A4-M1"));
  assert.ok(authoringIds.includes("A4-M2"));
  assert.equal(authoringIds.includes("A4-M3"), false, "workspace row is not a suitability obligation");
});

test("review source contains no domain-specific solvers", () => {
  const source = fs.readFileSync(path.join(repoRoot, "lib", "gam-operational-suitability-review.js"), "utf8");
  assert.doesNotMatch(source, /Lagrangian|multiplier|\u03bb|FOC|optimi[sz]ation/i);
});

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

test("T-017A R1: same commission + same GAM → same fingerprint", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  assert.equal(
    reviewLib.fingerprintGamMaterials(dla, gam),
    reviewLib.fingerprintGamMaterials(cloneJson(dla), cloneJson(gam))
  );
});

test("T-017A R2: changed GAM body → different fingerprint / stale review", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const original = reviewLib.fingerprintGamMaterials(dla, gam);
  const changed = cloneJson(gam);
  changed.activities[0].materials[0].body += "\nAltered operand particulars.";
  assert.notEqual(reviewLib.fingerprintGamMaterials(dla, changed), original);
  const review = makeReview(dla, gam);
  assert.ok(
    reviewLib.evaluateReviewGate(dla, changed, review).errors.some((err) => /S78_OPS2_STALE_REVIEW/.test(err))
  );
});

test("T-017A R3: changed expected_output → different fingerprint", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const original = reviewLib.fingerprintGamMaterials(dla, gam);
  const changed = cloneJson(dla);
  changed.activities[0].expected_output = "A different commissioned result.";
  assert.notEqual(reviewLib.fingerprintGamMaterials(changed, gam), original);
});

test("T-017A R4: changed material purpose → different fingerprint", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const original = reviewLib.fingerprintGamMaterials(dla, gam);
  const changed = cloneJson(dla);
  changed.activities[0].required_materials[0].purpose = "Supply a different allocation brief.";
  assert.notEqual(reviewLib.fingerprintGamMaterials(changed, gam), original);
});

test("T-017A R5: changed material specification → different fingerprint", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const original = reviewLib.fingerprintGamMaterials(dla, gam);
  const changed = cloneJson(dla);
  changed.activities[0].required_materials[0].specification = "Two linked allocation instances.";
  assert.notEqual(reviewLib.fingerprintGamMaterials(changed, gam), original);
});

test("T-017A R6: changed suitability role → different fingerprint", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const originalScope = reviewLib.collectOperationalSuitabilityReviewScope(dla, gam);
  const model = originalScope.rows.find((row) => row.material_id === "A1-M2");
  assert.equal(model.role, "model_complete");
  const changed = cloneJson(dla);
  changed.activities[0].required_materials[1].purpose = "Demonstration of the method on a reference instance.";
  changed.activities[0].required_materials[1].specification =
    "Show the method on a distinct instance; do not finish the learner's work.";
  const changedScope = reviewLib.collectOperationalSuitabilityReviewScope(changed, gam);
  const changedModel = changedScope.rows.find((row) => row.material_id === "A1-M2");
  assert.equal(changedModel.role, "model_demonstration");
  assert.notEqual(reviewLib.fingerprintReviewScope(changedScope), reviewLib.fingerprintReviewScope(originalScope));
});

test("T-017A R7: changed material_type → different fingerprint", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const original = reviewLib.fingerprintGamMaterials(dla, gam);
  const changed = cloneJson(dla);
  changed.activities[0].required_materials[0].material_type = "task_card";
  assert.equal(opsLib.collectSuitabilityObligationsFromPage(changed)[0].material_id, "A1-M1");
  assert.notEqual(reviewLib.fingerprintGamMaterials(changed, gam), original);
});

test("T-017A R8: unrelated non-review page metadata does not change fingerprint", () => {
  const dla = candidate4ShapedDla();
  const gam = candidate4ShapedGam();
  const original = reviewLib.fingerprintGamMaterials(dla, gam);
  const changedDla = cloneJson(dla);
  changedDla.title = "Unrelated page title";
  changedDla.audience = "Tutors";
  changedDla.page_profile = { profile_type: "learner", extra: true };
  changedDla.activities[0].title = "Unrelated activity title";
  changedDla.activities[0].grouping = "pairs";
  const changedGam = cloneJson(gam);
  changedGam.activities[0].materials[2].body = "| x | y | result |\n| --- | --- | --- |\n| a | b | c |";
  changedGam.title = "Unrelated GAM title";
  assert.equal(reviewLib.fingerprintGamMaterials(changedDla, changedGam), original);
});

test("T-017A R9: equivalent obligation row order does not alter fingerprint", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const reversed = cloneJson(dla);
  reversed.activities[0].required_materials = reversed.activities[0].required_materials.slice().reverse();
  assert.equal(
    reviewLib.fingerprintGamMaterials(reversed, gam),
    reviewLib.fingerprintGamMaterials(dla, gam)
  );
});

test("T-017A R10: prior review fingerprint against changed commission fails closed", () => {
  const dla = determinateQuantPage();
  const gam = determinateGam();
  const review = makeReview(dla, gam);
  const changed = cloneJson(dla);
  changed.activities[0].expected_output = "Report a different commissioned output.";
  const gate = reviewLib.evaluateReviewGate(changed, gam, review);
  assert.equal(gate.accepted, false);
  assert.ok(gate.errors.some((err) => /S78_OPS2_STALE_REVIEW/.test(err)));
  applyGate(changed, gam, review);
  assert.equal(api.tryCompleteWorkflowRunStepIfCaptureGatesPassForTest(GAM_STEP), false);
  assert.match(api.getWorkflowRunGamSuitabilityReviewValidationForTest(GAM_STEP), /Materials changed|verification must be run again/i);
});

test("T-017A R11: prompt and fingerprint derive from the same canonical review scope", () => {
  const dla = candidate4ShapedDla();
  const gam = candidate4ShapedGam();
  const scope = reviewLib.collectOperationalSuitabilityReviewScope(dla, gam);
  const prompt = reviewLib.buildReviewPrompt(dla, gam);
  const serialized = reviewLib.serializeReviewScope(scope);
  assert.ok(scope.rows.length > 0);
  assert.equal(reviewLib.fingerprintReviewScope(scope), reviewLib.fingerprintGamMaterials(dla, gam));
  assert.match(prompt, new RegExp("gam_fingerprint \\(copy unchanged\\): " + reviewLib.fingerprintReviewScope(scope)));
  scope.rows.forEach(function (row) {
    reviewLib.REVIEW_SCOPE_IDENTITY_FIELDS.forEach(function (field) {
      if (field === "role") return;
      const value = String(row[field] || "");
      if (!value) return;
      assert.ok(prompt.indexOf(value) !== -1, "prompt missing scope field " + field + " for " + row.material_id);
      assert.ok(serialized.indexOf(value) !== -1, "serialized scope missing " + field);
    });
    assert.ok(serialized.indexOf("role:" + row.role) !== -1);
  });
});

test("T-017A R12: zero-obligation path remains unchanged", () => {
  const dla = studyOnlyPage();
  const gam = materialsGam("S1", [{ material_id: "S1-M1", body: "Glossary overview." }]);
  const scope = reviewLib.collectOperationalSuitabilityReviewScope(dla, gam);
  assert.equal(scope.rows.length, 0);
  assert.equal(reviewLib.buildReviewPrompt(dla, gam), "");
  const gate = reviewLib.evaluateReviewGate(dla, gam, "");
  assert.equal(gate.required, false);
  assert.equal(gate.accepted, true);
  applyGate(dla, gam, "");
  assert.equal(api.workflowRunStepHasBlockingCaptureErrors(GAM_STEP), false);
});

