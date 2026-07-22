"use strict";

/**
 * Sprint 68 — S68-IMP-016 learner-surface capability audit tests.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const audit = require("../lib/learner-renderer-vnext/audit-learner-surfaces");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");
const browserBundlePath = path.join(repoRoot, "lib", "learner-renderer-vnext-browser.js");

const heteroFixture = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

function runAudit(extraOptions) {
  return audit.runLearnerSurfaceAudit(
    Object.assign({ repoRoot: repoRoot }, extraOptions || {})
  );
}

function recordsForFixture(result, fixtureId) {
  return result.records.filter(function (record) {
    return record.fixtureId === fixtureId;
  });
}

function recordKey(record) {
  return record.fixtureId + "/" + record.activityId;
}

test("corpus: every authoritative workflow activity appears exactly once", () => {
  const result = runAudit();
  audit.AUDIT_CORPUS.forEach(function (entry) {
    const rows = recordsForFixture(result, entry.id);
    const source = JSON.parse(
      fs.readFileSync(path.join(repoRoot, entry.fixturePath), "utf8")
    );
    const expectedIds = source.activities.map(function (activity) {
      return String(activity.activity_id || "");
    });
    assert.equal(rows.length, expectedIds.length, entry.id + " activity count");
    assert.deepEqual(
      rows.map(function (row) {
        return row.activityId;
      }).sort(),
      expectedIds.slice().sort()
    );
  });
  assert.equal(result.records.length, 25);
});

test("classification: each activity receives exactly one adequacy value", () => {
  const result = runAudit();
  const allowed = new Set(Object.values(audit.ADEQUACY));
  result.records.forEach(function (record) {
    assert.ok(allowed.has(record.adequacy), recordKey(record));
    assert.ok(String(record.evidence || "").trim(), recordKey(record));
    assert.ok(String(record.recommendation || "").trim(), recordKey(record));
  });
});

test("classification: each activity records a current surface or none explicitly", () => {
  const result = runAudit();
  result.records.forEach(function (record) {
    assert.ok(Array.isArray(record.currentSurface));
    assert.ok(record.currentSurface.length >= 1, recordKey(record));
    if (record.currentSurface.indexOf("none") >= 0) {
      assert.equal(record.currentSurface.length, 1);
    }
  });
});

test("determinism: repeated audits produce identical adequacy signatures", () => {
  function signature(result) {
    return result.records
      .map(function (record) {
        return [
          record.fixtureId,
          record.activityId,
          record.adequacy,
          record.currentSurface.join("+"),
          record.learnerAction
        ].join("|");
      })
      .join("\n");
  }
  const first = runAudit();
  const second = runAudit();
  assert.equal(signature(first), signature(second));
});

test("surfaces: text_entry activities are recognised from task evidence", () => {
  const result = runAudit();
  const a1 = result.records.find(function (record) {
    return record.fixtureId === "heteroscedasticity" && record.activityId === "A1";
  });
  assert.ok(a1);
  assert.deepEqual(a1.currentSurface, ["text_entry"]);
  assert.match(a1.learnerAction, /brief explanatory summary/i);
});

test("surfaces: table_entry activities are recognised from completion tables", () => {
  const result = runAudit();
  const a2 = result.records.find(function (record) {
    return record.fixtureId === "videotranscripttest" && record.activityId === "A2";
  });
  assert.ok(a2);
  assert.deepEqual(a2.currentSurface, ["table_entry"]);
  assert.match(a2.responseShape, /table_entry/);
});

test("evidence: activity type names do not automatically create capability requirements", () => {
  const sourceActivity = {
    learner_task: "1. Study the scenario.\n2. Complete the analysis table.\n3. Verify with the checklist.",
    expected_output: "Completed analysis table."
  };
  const action = audit.inferLearnerAction(
    sourceActivity,
    [{ sourceStepNumber: 2, text: "Complete the analysis table." }],
    ["analysis_table"]
  );
  assert.match(action, /analysis table/i);
  assert.doesNotMatch(action, /ordering|matching|single_select/i);
});

test("classification_table does not automatically imply a new classification surface", () => {
  const result = runAudit();
  const a1 = result.records.find(function (record) {
    return record.fixtureId === "videotranscripttest" && record.activityId === "A1";
  });
  assert.ok(a1);
  assert.equal(a1.adequacy, audit.ADEQUACY.FULLY_SUPPORTED);
  assert.equal(a1.classificationAudit.currentSurfaceAdequate, true);
  assert.notEqual(a1.candidateCapability, "categorisation");
});

test("ordering: sequenced process content does not automatically imply ordering surface", () => {
  const ordering = audit.detectOrderingEvidence(
    {
      learner_task:
        "1. Trace entry, translation, replication, and assembly in order.\n2. Complete the analysis table."
    },
    [{ sourceStepNumber: 1, text: "Trace entry, translation, replication, and assembly in order." }]
  );
  assert.equal(ordering.authoredOrderAlreadyFixed, true);
  assert.equal(ordering.orderingJustified, false);
});

test("ordering: explicit reorder instructions are detected as ordering evidence", () => {
  const ordering = audit.detectOrderingEvidence(
    {
      learner_task: "1. Put the steps in order from earliest to latest infection stage."
    },
    [{ sourceStepNumber: 1, text: "Put the steps in order from earliest to latest infection stage." }]
  );
  assert.equal(ordering.explicitReorderLanguage, true);
  assert.equal(ordering.mustLearnerReorder, true);
  // Wording alone is not enough without an authoritative item list.
  assert.equal(ordering.orderingJustified, false);
});

test("ordering: fixed-order process tables are not classified as ordering gaps in corpus", () => {
  const result = runAudit();
  const justified = result.orderingCandidates.filter(function (row) {
    return row.orderingJustified;
  });
  assert.deepEqual(
    justified.map(function (row) {
      return row.activity;
    }),
    ["authoritative-ordering/A1"]
  );
});

test("multi-part: composed text_entry workspaces satisfy authored response parts", () => {
  const result = runAudit();
  const imperfect = result.records.filter(function (record) {
    return record.adequacy === audit.ADEQUACY.IMPERFECT;
  });
  assert.equal(imperfect.length, 0);
  assert.equal(result.adequacyTotals.fully_supported, 25);
  assert.match(
    result.recommendation.statement,
    /Ordering is implemented where authoritative sequencing or ranking activities are present/i
  );
  assert.match(
    result.recommendation.statement,
    /Fixed authored sequences remain distinct from learner ordering interactions/i
  );
});

test("selection: assessment-option selection is excluded from workspace gap classification", () => {
  const result = runAudit();
  const hetero = result.workflows.find(function (workflow) {
    return workflow.corpus.id === "heteroscedasticity";
  });
  assert.ok(hetero);
  assert.ok(hetero.assessmentItems.length >= 4);
  hetero.assessmentItems.forEach(function (item) {
    assert.equal(item.interaction, "assessment_selection");
  });
  result.records.forEach(function (record) {
    assert.notEqual(record.candidateCapability, "single_select");
  });
});

test("lifecycle: persistence concerns are recorded separately from surface adequacy", () => {
  const result = runAudit();
  result.records.forEach(function (record) {
    assert.ok(record.lifecycleNeeds);
    assert.equal(record.lifecycleNeeds.localDraftPersistence, true);
    assert.equal(record.lifecycleNeeds.localDraftPersistenceStatus, "implemented");
    assert.equal(record.lifecycleNeeds.crossPageRestoration, true);
    assert.equal(record.lifecycleNeeds.submission, false);
    assert.equal(record.lifecycleNeeds.teacherReview, false);
    assert.equal(record.lifecycleNeeds.remoteSynchronisation, false);
    assert.match(record.lifecycleNeeds.note, /Local draft persistence/i);
    assert.notEqual(record.adequacy, "missing_capability");
  });
});

test("recommendations: capability matrix cites concrete activities", () => {
  const result = runAudit();
  result.capabilityMatrix.forEach(function (row) {
    if (row.evidenceCount > 0) {
      assert.ok(row.representativeActivities.length >= 1, row.capability);
    }
  });
  assert.equal(result.recommendation.justified, false);
  assert.match(result.recommendation.statement, /No new learner surface is currently justified/i);
  assert.ok(Array.isArray(result.recommendation.examples));
});

test("regression: production rendering output is unchanged", () => {
  const sourcePage = JSON.parse(fs.readFileSync(heteroFixture, "utf8"));
  const rendered = renderLearnerPageHtml(sourcePage);
  assert.equal(rendered.error, null);
  const html = String(rendered.html || "");
  assert.match(html, /data-workspace-capability="text_entry"/);
  assert.match(html, /data-workspace-kind="table_entry"/);
  assert.doesNotMatch(html, /Response row \d+/);
  assert.equal((html.match(/data-composition-moment="do"/g) || []).length, 5);
});

test("regression: browser bundle does not include audit-only module", () => {
  const bundle = fs.readFileSync(browserBundlePath, "utf8");
  assert.doesNotMatch(bundle, /runLearnerSurfaceAudit/);
  assert.doesNotMatch(bundle, /audit-learner-surfaces/);
});

test("command: audit script emits deterministic JSON summary", () => {
  const stdout = execFileSync(
    process.execPath,
    [path.join(repoRoot, "scripts/audit-learner-surfaces.js"), "--json"],
    {
      cwd: repoRoot,
      encoding: "utf8"
    }
  );
  const summary = JSON.parse(stdout);
  assert.equal(summary.records.length, 25);
  assert.equal(summary.adequacyTotals.fully_supported, 25);
  assert.equal(summary.adequacyTotals.supported_imperfectly_represented || 0, 0);
  assert.equal(summary.recommendation.justified, false);
});

test("activity surface usage totals include text, table, ordering, and none buckets", () => {
  const result = runAudit();
  assert.equal(result.activitySurfaceUsage.text_entry, 11);
  assert.equal(result.activitySurfaceUsage.table_entry, 18);
  assert.equal(result.activitySurfaceUsage.ordering, 1);
  assert.equal(result.activitySurfaceUsage.no_learner_workspace, 1);
});
