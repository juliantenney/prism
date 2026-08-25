/**
 * S78-T-018 — GAM verification UX + workflow integration (fail-closed completion).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const reviewLib = require(path.join(repoRoot, "lib", "gam-operational-suitability-review.js"));
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
const DLA_STEP = "dla_step";

function determinateDla() {
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

function studyOnlyDla() {
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
    { material_id: "A1-M1", material_type: "scenario", body: "Allocation instance: 12 units, costs 3 and 5." },
    { material_id: "A1-M2", material_type: "worked_example", body: "Complete worked solution reaching the promised optimum." }
  ]);
}

function studyOnlyGam() {
  return materialsGam("S1", [{ material_id: "S1-M1", body: "Glossary overview." }]);
}

function makeReview(dla, gam, verdictOverrides) {
  const obligations = reviewLib.collectObligations(dla);
  const fingerprint = reviewLib.fingerprintGamMaterials(dla, gam);
  const verdicts = obligations.map(function (row) {
    return Object.assign(
      {
        activity_id: row.activity_id,
        material_id: row.material_id,
        suitable: true,
        failure_class: "none",
        reason: ""
      },
      (verdictOverrides && verdictOverrides[row.material_id]) || {}
    );
  });
  return JSON.stringify({
    artifact_type: "gam_operational_suitability_review",
    schema_version: "1.0.0",
    gam_fingerprint: fingerprint,
    verdicts: verdicts
  });
}

function pages(dla, gam) {
  return { dlaPage: dla, gamPage: gam, gamStructurallyOk: true };
}

function capture(dla, gam) {
  api.resetGamOperationalSuitabilityReviewStateForTest();
  api.installGamVerificationScopeWorkflowForTest();
  return api.syncGamMaterialsVerificationAfterCaptureForTest(GAM_STEP, gam, dla);
}

test("R1: valid GAM + zero obligations → no verification UI, complete, Next enabled", () => {
  const view = capture(studyOnlyDla(), studyOnlyGam());
  assert.equal(view.phase, "gam_valid_no_review_required");
  assert.equal(view.showVerificationUi, false);
  assert.equal(view.showCopyPrompt, false);
  assert.equal(view.complete, true);
  assert.equal(view.nextBlocked, false);
  assert.equal(api.tryCompleteWorkflowRunStepIfCaptureGatesPassForTest(GAM_STEP), true);
});

test("R2: valid GAM + obligations → verification UI, not complete, Next disabled", () => {
  const view = capture(determinateDla(), determinateGam());
  assert.equal(view.phase, "gam_valid_review_required");
  assert.equal(view.showVerificationUi, true);
  assert.equal(view.complete, false);
  assert.equal(view.nextBlocked, true);
  assert.equal(view.stepStatusText, "Materials generated — verification required");
  assert.notEqual(view.stepStatusText, "Step complete");
  assert.equal(api.tryCompleteWorkflowRunStepIfCaptureGatesPassForTest(GAM_STEP), false);
  assert.ok(api.workflowRunStepHasBlockingCaptureErrors(GAM_STEP));
});

test("R3: Copy verification prompt appears only when verification is in play", () => {
  const none = capture(studyOnlyDla(), studyOnlyGam());
  assert.equal(none.showCopyPrompt, false);
  const required = capture(determinateDla(), determinateGam());
  assert.equal(required.showCopyPrompt, true);
  assert.equal(required.copyLabel, "Copy verification prompt");
});

test("R4: verification paste area appears only when review is required", () => {
  assert.equal(capture(studyOnlyDla(), studyOnlyGam()).showVerificationUi, false);
  assert.equal(capture(determinateDla(), determinateGam()).showVerificationUi, true);
  assert.equal(capture(determinateDla(), determinateGam()).pasteLabel, "Paste verification result");
});

test("R5: explicit Check verification action exists", () => {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  assert.match(source, /Check verification/);
  assert.match(source, /data-role", "run-step-suitability-check"/);
  assert.match(source, /function checkGamMaterialsVerificationFromDom/);
  const view = capture(determinateDla(), determinateGam());
  assert.equal(view.showCheckAction, true);
  assert.equal(view.checkLabel, "Check verification");
});

test("R6: all-PASS review → Verification passed, complete, Next enabled", () => {
  const dla = determinateDla();
  const gam = determinateGam();
  capture(dla, gam);
  const view = api.submitGamMaterialsVerificationForTest(GAM_STEP, makeReview(dla, gam), gam, dla);
  assert.equal(view.phase, "review_passed");
  assert.equal(view.complete, true);
  assert.equal(view.nextBlocked, false);
  assert.equal(view.stepStatusText, "Step complete");
  assert.equal(view.resultTitle, "Verification passed");
  assert.equal(api.tryCompleteWorkflowRunStepIfCaptureGatesPassForTest(GAM_STEP), true);
});

test("R7: any FAIL → issue summary, incomplete, Next disabled", () => {
  const dla = determinateDla();
  const gam = determinateGam();
  capture(dla, gam);
  const view = api.submitGamMaterialsVerificationForTest(
    GAM_STEP,
    makeReview(dla, gam, {
      "A1-M1": {
        suitable: false,
        failure_class: "contradiction",
        reason: "Particulars prevent the commissioned result."
      }
    }),
    gam,
    dla
  );
  assert.equal(view.phase, "review_failed");
  assert.equal(view.complete, false);
  assert.equal(view.nextBlocked, true);
  assert.equal(view.resultTitle, "Verification found an issue");
  assert.match(view.resultBody, /Regenerate the activity materials from the same DLA prompt/);
  assert.equal(view.failItems[0].label, "A1-M1");
  assert.match(view.failItems[0].reason, /Particulars prevent/);
  assert.equal(api.tryCompleteWorkflowRunStepIfCaptureGatesPassForTest(GAM_STEP), false);
});

test("R8: malformed review JSON → readable error, incomplete, Next disabled", () => {
  const dla = determinateDla();
  const gam = determinateGam();
  capture(dla, gam);
  const view = api.submitGamMaterialsVerificationForTest(GAM_STEP, "{not-json", gam, dla);
  assert.equal(view.phase, "review_invalid");
  assert.equal(view.complete, false);
  assert.equal(view.nextBlocked, true);
  assert.equal(view.resultTitle, "Verification result could not be read");
  assert.doesNotMatch(view.resultTitle + view.resultBody, /SyntaxError|invalid_json|S78_OPS2/);
  assert.equal(api.tryCompleteWorkflowRunStepIfCaptureGatesPassForTest(GAM_STEP), false);
});

test("R9: missing/extra/duplicate verdicts fail closed", () => {
  const dla = determinateDla();
  const gam = determinateGam();
  capture(dla, gam);
  const extra = JSON.parse(makeReview(dla, gam));
  extra.verdicts.push({
    activity_id: "A1",
    material_id: "A1-EXTRA",
    suitable: true,
    failure_class: "none",
    reason: ""
  });
  const extraView = api.submitGamMaterialsVerificationForTest(GAM_STEP, JSON.stringify(extra), gam, dla);
  assert.equal(extraView.complete, false);
  assert.equal(extraView.nextBlocked, true);
  const missing = JSON.parse(makeReview(dla, gam));
  missing.verdicts = missing.verdicts.slice(0, 1);
  const missingView = api.submitGamMaterialsVerificationForTest(GAM_STEP, JSON.stringify(missing), gam, dla);
  assert.equal(missingView.complete, false);
});

test("R10: stale review after GAM change clears PASS and disables Next", () => {
  const dla = determinateDla();
  const gam = determinateGam();
  capture(dla, gam);
  const passed = api.submitGamMaterialsVerificationForTest(GAM_STEP, makeReview(dla, gam), gam, dla);
  assert.equal(passed.phase, "review_passed");
  const changed = determinateGam();
  changed.activities[0].materials[0].body += "\nChanged particulars.";
  const stale = api.syncGamMaterialsVerificationAfterCaptureForTest(GAM_STEP, changed, dla);
  assert.equal(stale.complete, false);
  assert.equal(stale.nextBlocked, true);
  assert.match(stale.stepStatusText, /Materials changed — verification must be run again/);
  assert.equal(api.tryCompleteWorkflowRunStepIfCaptureGatesPassForTest(GAM_STEP), false);
});

test("R11: primary UI language hides schema/fingerprint internals", () => {
  const dla = determinateDla();
  const gam = determinateGam();
  const pending = capture(dla, gam);
  const failed = api.submitGamMaterialsVerificationForTest(
    GAM_STEP,
    makeReview(dla, gam, {
      "A1-M1": { suitable: false, failure_class: "contradiction", reason: "Inconsistent particulars." }
    }),
    gam,
    dla
  );
  const blob = [
    pending.heading,
    pending.intro,
    pending.stepStatusText,
    pending.copyLabel,
    pending.checkLabel,
    pending.pasteLabel,
    failed.resultTitle,
    failed.resultBody,
    failed.failItems.map((item) => item.label + item.reason).join(" ")
  ].join("\n");
  assert.doesNotMatch(blob, /gam_operational_suitability_review/);
  assert.doesNotMatch(blob, /gam_fingerprint|fingerprint/i);
  assert.doesNotMatch(blob, /failure_class/);
  assert.doesNotMatch(blob, /S78_OPS2|Stage-2|Stage 2/);
});

test("R12: no semantic content logic in JS verification path", () => {
  const reviewSource = fs.readFileSync(path.join(repoRoot, "lib", "gam-operational-suitability-review.js"), "utf8");
  const appSource = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const start = appSource.indexOf("var GAM_VERIFICATION_COPY");
  const slice = appSource.slice(start, appSource.indexOf("function resolveGamPracticeIndependencePromptLib"));
  assert.doesNotMatch(reviewSource, /Lagrangian|multiplier|\u03bb|FOC/i);
  assert.doesNotMatch(slice, /Lagrangian|multiplier|\u03bb|FOC|solveEquation/i);
});

test("R16: cannot show Step complete + Next enabled while verification is outstanding", () => {
  const dla = determinateDla();
  const gam = determinateGam();
  const pending = capture(dla, gam);
  assert.equal(pending.stepStatusText === "Step complete" && !pending.nextBlocked, false);
  assert.equal(pending.complete && pending.nextBlocked, false);
  assert.equal(pending.complete, false);
  assert.equal(pending.nextBlocked, true);
  const passed = api.submitGamMaterialsVerificationForTest(GAM_STEP, makeReview(dla, gam), gam, dla);
  assert.equal(passed.complete, true);
  assert.equal(passed.nextBlocked, false);
  assert.equal(passed.stepStatusText, "Step complete");
});

test("Case A — zero obligations is one-phase completion", () => {
  const view = capture(studyOnlyDla(), studyOnlyGam());
  assert.equal(view.phase, "gam_valid_no_review_required");
  assert.equal(view.showVerificationUi, false);
  assert.equal(view.complete, true);
});

test("Case B — obligations + PASS completes only after Check", () => {
  const dla = determinateDla();
  const gam = determinateGam();
  const pending = capture(dla, gam);
  assert.equal(pending.complete, false);
  const passed = api.submitGamMaterialsVerificationForTest(GAM_STEP, makeReview(dla, gam), gam, dla);
  assert.equal(passed.phase, "review_passed");
  assert.equal(passed.complete, true);
});

test("Case C — obligations + FAIL keeps Next disabled", () => {
  const dla = determinateDla();
  const gam = determinateGam();
  capture(dla, gam);
  const failed = api.submitGamMaterialsVerificationForTest(
    GAM_STEP,
    makeReview(dla, gam, {
      "A1-M2": { suitable: false, failure_class: "incomplete_model", reason: "Stops before the promised result." }
    }),
    gam,
    dla
  );
  assert.equal(failed.phase, "review_failed");
  assert.equal(failed.nextBlocked, true);
});

test("Case D — candidate change invalidates prior PASS", () => {
  const dla = determinateDla();
  const gam = determinateGam();
  capture(dla, gam);
  api.submitGamMaterialsVerificationForTest(GAM_STEP, makeReview(dla, gam), gam, dla);
  const changedDla = JSON.parse(JSON.stringify(dla));
  changedDla.activities[0].expected_output = "A different commissioned result.";
  const stale = api.syncGamMaterialsVerificationAfterCaptureForTest(GAM_STEP, gam, changedDla);
  assert.equal(stale.complete, false);
  assert.match(stale.stepStatusText, /Materials changed/);
});

test("T-018A: DLA paste with obligations does not enter GAM verification", () => {
  const dla = determinateDla();
  api.resetGamOperationalSuitabilityReviewStateForTest();
  api.installGamVerificationScopeWorkflowForTest();
  api.setWorkflowRunCapturedOutputsForTest({ [DLA_STEP]: JSON.stringify(dla) });
  const view = api.resolveGamMaterialsVerificationViewForTest(DLA_STEP);
  assert.equal(api.isGamMaterialGenerationStep(DLA_STEP), false);
  assert.equal(api.isGamMaterialGenerationStep(GAM_STEP), true);
  assert.equal(view.applies, false);
  assert.equal(view.phase, "not_gam");
  assert.equal(view.showVerificationUi, false);
  assert.equal(view.showCopyPrompt, false);
  assert.equal(view.showCheckAction, false);
  assert.equal(view.nextBlocked, false);
  assert.notEqual(view.stepStatusText, "Materials generated — verification required");
  assert.equal(api.workflowRunStepHasBlockingCaptureErrors(DLA_STEP), false);
  assert.equal(api.tryCompleteWorkflowRunStepIfCaptureGatesPassForTest(DLA_STEP), true);
});

test("T-018A: DLA cannot be classified as review-required even if a page is supplied as gamPage", () => {
  const dla = determinateDla();
  api.resetGamOperationalSuitabilityReviewStateForTest();
  api.installGamVerificationScopeWorkflowForTest();
  const view = api.resolveGamMaterialsVerificationViewForTest(DLA_STEP, {
    dlaPage: dla,
    gamPage: dla,
    gamStructurallyOk: true
  });
  assert.equal(view.phase, "not_gam");
  assert.equal(view.showVerificationUi, false);
  assert.equal(view.nextBlocked, false);
});

test("T-018A: GAM review-required behaviour is unchanged after DLA scope fix", () => {
  const view = capture(determinateDla(), determinateGam());
  assert.equal(view.phase, "gam_valid_review_required");
  assert.equal(view.showVerificationUi, true);
  assert.equal(view.nextBlocked, true);
});

test("T-043: verification wrap is a distinct secondary section under capture", () => {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const css = fs.readFileSync(path.join(repoRoot, "style.css"), "utf8");
  assert.match(source, /workflow-step-suitability-review/);
  assert.match(source, /workflow-step-suitability-review__title/);
  assert.match(source, /workflow-step-suitability-review__intro/);
  assert.match(source, /workflow-step-suitability-review__copy/);
  assert.match(source, /workflow-step-suitability-review__paste-label/);
  assert.match(source, /workflow-step-suitability-review__check/);
  // Capture → verification → continue (verification grouped under materials, not after continue)
  assert.match(
    source,
    /li\.appendChild\(userNotesWrap\);[\s\S]*?li\.appendChild\(suitabilityWrap\);[\s\S]*?li\.appendChild\(runContinue\);/
  );
  assert.match(css, /\.workflow-step-suitability-review\s*\{/);
  assert.match(css, /border-top:\s*1px solid var\(--border-subtle\)/);
  assert.match(css, /\.workflow-step-suitability-review__title\s*\{/);
  assert.match(css, /\.workflow-step-suitability-review__copy\s*\{/);
  // Behaviour roles unchanged
  assert.match(source, /data-role", "run-step-suitability-copy"/);
  assert.match(source, /data-role", "run-step-suitability-check"/);
  assert.match(source, /data-field", "runStepSuitabilityReview"/);
});

