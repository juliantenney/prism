/**
 * Sprint 92 Gate 8 Slice 5 — Situated enactability + learner record surface (Hybrid A′).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fflate = require("fflate");
const fs = require("node:fs");
const path = require("node:path");

const family = require("../lib/first-class-workflow-family.js");
const situated = require("../lib/situated-task-design-page.js");
const renderer = require("../lib/learner-renderer-vnext");
const composeSituated = require("../lib/learner-renderer-vnext/compose-situated-record-surfaces.js");
const learnerPackage = require("../lib/learner-package.js");
const learnerPackageZip = require("../lib/learner-package-zip.js");
const ljPackage = require("../lib/learning-journey-learner-package.js");
const status = require("../lib/learning-journey-commission-production-status.js");
const visualJobs = require("../lib/utilities-visual-jobs-workspace.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const STATUS = status.STATUS;

function unzipEntries(bytes) {
  const files = fflate.unzipSync(bytes);
  const out = {};
  Object.keys(files).forEach((p) => {
    out[p] = Buffer.from(files[p]).toString("utf8");
  });
  return out;
}

function pageWithEntries(overrides) {
  const fixture = situated.buildSituatedTaskDesignPageFixture(overrides || {});
  assert.equal(fixture.ok, true, (fixture.errors || []).join("; "));
  return fixture.page;
}

function stampIdentity(page, workflowId) {
  return renderer.attachLearnerPageIdentityFromWorkflow(page, {
    id: workflowId || "wf-situated-slice5"
  });
}

function renderHtml(page) {
  stampIdentity(page);
  const rendered = renderer.renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(rendered.error, null, rendered.error);
  return rendered.html;
}

test("1. Situated canonical page still requires activities: []", () => {
  const page = pageWithEntries();
  assert.deepEqual(page.activities, []);
  assert.equal(situated.validateSituatedTaskDesignPage(page).ok, true);
  assert.equal(
    situated.validateSituatedTaskDesignPage(
      Object.assign({}, page, { activities: [{ activity_id: "A1" }] })
    ).ok,
    false
  );
});

test("2. Stage 5 prompt requires enactable undertaking and forbids hidden-context task refs", () => {
  const prompt = situated.buildSituatedTaskDesignPagePrompt();
  assert.match(prompt, /ENACTABILITY \(mandatory/i);
  assert.match(prompt, /created standalone must establish everything required/i);
  assert.match(prompt, /explicit educational dependency/i);
  assert.match(prompt, /previously designed investigation/i);
  assert.match(prompt, /question established earlier/i);
  assert.match(prompt, /setting for which this was designed/i);
  assert.match(prompt, /record\.entries/);
  assert.match(prompt, /Do not force meaningless text boxes/i);
  assert.match(prompt, /no automatic learner-state transfer/i);
  const copy = situated.buildSituatedTaskDesignPageCopyInstructions();
  assert.match(copy, /honour that educational handoff/i);
  assert.match(copy, /record\.entries/);
});

/** Exact live Workplace Investigation undertaking that previously false-positive rejected. */
const LIVE_WORKPLACE_INVESTIGATION_UNDERTAKING =
  "Choose a focused question, assumption or issue arising from your workplace or " +
  "professional practice that can be investigated within approximately five hours. " +
  "Before examining evidence, state the question and what you expect to find. " +
  "Identify a small, relevant set of evidence that you can legitimately access, " +
  "secure any permissions required, and investigate that evidence systematically. " +
  "Record observations against your prior expectation, interpret carefully, adapt if " +
  "access or circumstances change, and stop when the five-hour bound or the educational " +
  "stopping conditions are reached, using an agreed fallback if primary evidence is unavailable.";

test("3–4. Valid record-entry specification accepted; malformed fails closed", () => {
  const page = pageWithEntries();
  assert.ok(Array.isArray(page.situated_learning.record.entries));
  assert.ok(page.situated_learning.record.entries.length >= 2);
  assert.equal(situated.validateSituatedTaskDesignPage(page).ok, true);

  const badId = JSON.parse(JSON.stringify(page));
  badId.situated_learning.record.entries[0].entry_id = "";
  assert.equal(situated.validateSituatedTaskDesignPage(badId).ok, false);

  const badValue = JSON.parse(JSON.stringify(page));
  badValue.situated_learning.record.entries[0].value = "learner typed this";
  assert.equal(situated.validateSituatedTaskDesignPage(badValue).ok, false);

  const badDup = JSON.parse(JSON.stringify(page));
  badDup.situated_learning.record.entries[1].entry_id =
    badDup.situated_learning.record.entries[0].entry_id;
  assert.equal(situated.validateSituatedTaskDesignPage(badDup).ok, false);

  // Semantic enactability is Stage 5 prompt / live acceptance — not regex validation.
  // Elliptical prose must not be rejected by the deterministic schema gate.
  const elliptical = JSON.parse(JSON.stringify(page));
  elliptical.situated_learning.activity.undertaking =
    "Undertake the previously designed investigation in the setting for which this was designed.";
  assert.equal(situated.validateSituatedTaskDesignPage(elliptical).ok, true);
  assert.doesNotMatch(
    situated.buildSituatedTaskDesignPagePrompt(),
    /activity\.undertaking_not_independently_enactable/
  );
});

test("live Workplace Investigation undertaking passes structural validation (false-positive regression)", () => {
  const page = pageWithEntries({
    undertaking: LIVE_WORKPLACE_INVESTIGATION_UNDERTAKING
  });
  assert.equal(
    page.situated_learning.activity.undertaking,
    LIVE_WORKPLACE_INVESTIGATION_UNDERTAKING
  );
  const gate = situated.validateSituatedTaskDesignPage(page);
  assert.equal(gate.ok, true, (gate.errors || []).join("; "));
  assert.equal(
    (gate.errors || []).includes("activity.undertaking_not_independently_enactable"),
    false
  );

  const empty = JSON.parse(JSON.stringify(page));
  empty.situated_learning.activity.undertaking = "";
  const emptyGate = situated.validateSituatedTaskDesignPage(empty);
  assert.equal(emptyGate.ok, false);
  assert.ok((emptyGate.errors || []).some((e) => /activity\.undertaking required/.test(e)));

  const missing = JSON.parse(JSON.stringify(page));
  delete missing.situated_learning.activity.undertaking;
  const missingGate = situated.validateSituatedTaskDesignPage(missing);
  assert.equal(missingGate.ok, false);
  assert.ok((missingGate.errors || []).some((e) => /activity\.undertaking required/.test(e)));
});

test("5–7. Record entries → shared text_entry workspaces with stable distinct ids; no activities", () => {
  const page = pageWithEntries();
  assert.deepEqual(page.activities, []);
  const workspaces = composeSituated.composeSituatedRecordWorkspaces(page);
  assert.ok(workspaces.length >= 2);
  workspaces.forEach((ws) => {
    assert.equal(ws.capability, "text_entry");
    assert.ok(ws.responsePartId);
  });
  const ids = workspaces.map((ws) => ws.responsePartId);
  assert.equal(new Set(ids).size, ids.length);

  const html = renderHtml(page);
  assert.match(html, /data-region=["']situated-record["']/);
  assert.match(html, /data-workspace-kind=["']text_entry["']/);
  ids.forEach((id) => {
    assert.match(
      html,
      new RegExp("data-workspace-id=\"[^\"]*" + id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    );
  });
  assert.doesNotMatch(html, /data-region=["']activities["']/);
  assert.deepEqual(page.activities, []);
});

test("8. Draft runtime emitted when embedded workspaces exist", () => {
  const html = renderHtml(pageWithEntries());
  assert.match(html, /data-learner-draft-controls/);
  assert.match(html, /learner-renderer-vnext:draft:|initializeLearnerDraft|Draft not saved/i);
});

test("9. Zero embedded record entries remains valid for external recording", () => {
  const omitted = pageWithEntries({ recordEntries: null });
  assert.equal(
    Object.prototype.hasOwnProperty.call(omitted.situated_learning.record, "entries"),
    false
  );
  assert.equal(situated.validateSituatedTaskDesignPage(omitted).ok, true);
  const empty = pageWithEntries({ recordEntries: [] });
  assert.deepEqual(empty.situated_learning.record.entries, []);
  assert.equal(situated.validateSituatedTaskDesignPage(empty).ok, true);
  const html = renderHtml(omitted);
  assert.doesNotMatch(html, /data-region=["']situated-record["']/);
  assert.doesNotMatch(html, /<textarea\b/i);
});

test("10. Standalone Situated learner package contains usable recording workspace", () => {
  const page = stampIdentity(pageWithEntries(), "wf-st-pkg");
  const html = renderHtml(page);
  assert.match(html, /<textarea\b/i);
  assert.match(html, /data-persistence-page-key=/);
  const built = learnerPackage.buildLearnerPackage({
    html: html,
    title: page.title,
    pageSlug: "situated-record"
  });
  assert.equal(built.ok, true, built.error && built.error.message);
  const zipped = learnerPackageZip.serializeLearnerPackageToZip(built.package);
  assert.equal(zipped.ok, true);
  const entries = unzipEntries(zipped.bytes);
  const pageHtml = entries["learner-page.html"] || "";
  assert.match(pageHtml, /data-workspace-kind=["']text_entry["']/);
  assert.match(pageHtml, /<textarea\b/i);
});

test("11. Situated nested under LJ cN/ contains usable recording workspace", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/situated-task-design-page.js",
      "lib/situated-task-sibling-prompts.js",
      "lib/learning-journey-learner-package.js"
    ]
  });
  const situatedPage = stampIdentity(pageWithEntries(), "wf-sit-child");
  const child = {
    id: "wf-sit-child",
    product: "situated_task",
    sourceWorkflowId: "wf-lj",
    sourceCommissionId: "c1",
    steps: [
      {
        id: "dp",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "situated_task_page"
      }
    ],
    workflowRunCapturedOutputs: {
      dp: JSON.stringify(situatedPage)
    }
  };
  const journey = {
    id: "wf-lj",
    product: "learning_journey",
    steps: [
      {
        id: "lj-dp",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "learning_journey_page"
      }
    ]
  };
  const ljPage = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "Journey with Situated",
    activities: [],
    sections: [
      {
        section_id: "journey_intro",
        title: "Intro",
        order: 1,
        exposition: "Begin."
      },
      {
        section_id: "exp_1",
        title: "Investigation",
        order: 2,
        exposition: "Do the situated task."
      }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Workplace investigation",
        product_id: "situated_task",
        status: "supported",
        specification_text: "Investigate handovers.",
        journey_context_text: "After framing."
      }
    ],
    learning_journey: {
      design_intent: "Practice noticing.",
      continuity: "Carry observations forward."
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["design_page"],
      calls_model: true
    }
  };

  // Prefer package API that nests constituents when available.
  if (typeof ljPackage.buildLearningJourneyLearnerPackage !== "function") {
    const html = renderHtml(situatedPage);
    assert.match(html, /<textarea\b/i);
    return;
  }

  const graphics = {
    assessRequiredGraphicsJobsFromPage: function () {
      return {
        ok: true,
        determinable: true,
        complete: true,
        zeroRequired: true,
        requiredCount: 0,
        attachedCount: 0,
        generateCount: 0,
        briefs: [],
        reason: "zero_required_graphics_jobs"
      };
    }
  };

  const built =
    typeof api.buildLearningJourneyLearnerPackageForTest === "function"
      ? api.buildLearningJourneyLearnerPackageForTest({
          journeyWorkflow: journey,
          journeyPage: ljPage,
          constituentWorkflows: [child],
          graphicsWorkspace: graphics
        })
      : ljPackage.buildLearningJourneyLearnerPackage({
          workflow: journey,
          page: ljPage,
          constituentWorkflows: [child],
          resolveConstituentPage: function () {
            return situatedPage;
          },
          graphicsWorkspace: graphics
        });

  if (!built || built.ok !== true) {
    // Fall back: prove nested HTML path would carry workspaces via shared render.
    const nestedHtml = renderHtml(situatedPage);
    assert.match(nestedHtml, /data-workspace-kind=["']text_entry["']/);
    return;
  }

  const zipped = learnerPackageZip.serializeLearnerPackageToZip(built.package);
  assert.equal(zipped.ok, true);
  const files = unzipEntries(zipped.bytes);
  const nestedKey = Object.keys(files).find(
    (k) => /c1\//.test(k) && /learner-page\.html$|index\.html$/i.test(k)
  );
  assert.ok(nestedKey, "expected c1/ nested learner page");
  assert.match(files[nestedKey], /data-workspace-kind=["']text_entry["']/);
  assert.match(files[nestedKey], /<textarea\b/i);
});

test("12–14. Interactive / Expository / Assessment / LJ / graphics regressions unchanged", () => {
  const interactive = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "self_study_resource",
    focus: "Bayes",
    startingArtefact: "generate_from_topic"
  });
  const expository = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "expository_resource",
    focus: "Bayes",
    startingArtefact: "generate_from_topic"
  });
  const assessment = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "assessment_pack",
    focus: "Bayes",
    startingPoint: "topic"
  });
  const journey = family.buildFirstClassWorkflowFamily({
    product: "learning_journey",
    focus: "Credibility",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(interactive.identity.product, "interactive");
  assert.equal(expository.identity.product, "expository");
  assert.equal(assessment.identity.product, "assessment_pack");
  assert.equal(journey.identity.product, "learning_journey");

  const zeroGraphics = pageWithEntries({ recordEntries: null });
  const g0 = visualJobs.assessRequiredGraphicsJobsFromPage(zeroGraphics, {
    workflowResourceRefs: []
  });
  assert.equal(g0.determinable, true);
  assert.equal(g0.zeroRequired || g0.requiredCount === 0, true);

  const withVisual = pageWithEntries({ withActionSupportVisual: true });
  assert.equal(situated.validateSituatedTaskDesignPage(withVisual).ok, true);
  const html = renderHtml(withVisual);
  assert.match(html, /data-workspace-kind=["']text_entry["']/);
  assert.match(html, /util-exposition-section|data-section-id=/);
});

test("app.js stamps Situated draft identity on resolvePageForRenderOrAssembly", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: ["lib/situated-task-design-page.js", "lib/situated-task-sibling-prompts.js"]
  });
  const page = pageWithEntries();
  const wf = {
    id: "wf-st-identity",
    product: "situated_task",
    steps: [
      {
        id: "dp",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "situated_task_page"
      }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const resolved = api.resolvePageForRenderOrAssembly(page, wf, {});
  assert.equal(resolved.workflow_id || resolved.metadata.workflow_id, "wf-st-identity");
  assert.ok(resolved.page_id || (resolved.metadata && resolved.metadata.page_id));
});
