/**
 * Sprint 92 final presentation refinement:
 * optional record.entries[].placement.after_section_id + situated_task page-kind.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const situated = require("../lib/situated-task-design-page.js");
const renderer = require("../lib/learner-renderer-vnext");
const composeSituated = require("../lib/learner-renderer-vnext/compose-situated-record-surfaces.js");
const buildPageModel = require("../lib/learner-renderer-vnext/build-page-model.js");
const family = require("../lib/first-class-workflow-family.js");

function stampIdentity(page, workflowId) {
  return renderer.attachLearnerPageIdentityFromWorkflow(page, {
    id: workflowId || "wf-situated-placement"
  });
}

function renderHtml(page) {
  stampIdentity(page);
  const rendered = renderer.renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(rendered.error, null, rendered.error);
  return rendered.html;
}

function pageWithEntries(overrides) {
  const fixture = situated.buildSituatedTaskDesignPageFixture(overrides || {});
  assert.equal(fixture.ok, true, (fixture.errors || []).join("; "));
  return fixture.page;
}

function workspaceIdFor(entryId) {
  const partSlug = String(entryId || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return "learner-workspace-situated-record-" + partSlug;
}

function indexOfWorkspace(html, entryId) {
  return html.indexOf('data-workspace-id="' + workspaceIdFor(entryId) + '"');
}

function indexOfSection(html, sectionId) {
  return html.indexOf('data-section-id="' + sectionId + '"');
}

test("1. Unplaced record entries still render in consolidated situated-record region", () => {
  const page = pageWithEntries();
  const html = renderHtml(page);
  assert.match(html, /data-region=["']situated-record["']/);
  assert.doesNotMatch(html, /data-region=["']situated-record-embedded["']/);
  ["expectation", "observation", "divergence", "limitations"].forEach((id) => {
    assert.match(html, new RegExp('data-workspace-id="' + workspaceIdFor(id) + '"'));
  });
  assert.deepEqual(page.activities, []);
});

test("2. Placed entry renders immediately after referenced learner-facing section", () => {
  const page = pageWithEntries({
    recordEntries: [
      {
        entry_id: "evidence",
        order: 1,
        label: "What you observed",
        prompt: "Note what you saw.",
        placement: { after_section_id: "task" }
      }
    ]
  });
  const html = renderHtml(page);
  const sectionIdx = indexOfSection(html, "task");
  const embedIdx = html.indexOf('data-region="situated-record-embedded"');
  const wsIdx = indexOfWorkspace(html, "evidence");
  assert.ok(sectionIdx >= 0);
  assert.ok(embedIdx > sectionIdx);
  assert.ok(wsIdx > embedIdx);
  assert.match(
    html,
    /data-region="situated-record-embedded"[^>]*data-after-section-id="task"/
  );
  assert.doesNotMatch(html, /data-region=["']situated-record["']/);
});

test("3. Entries may be placed after different sections", () => {
  const page = pageWithEntries({
    recordEntries: [
      {
        entry_id: "expectation",
        order: 1,
        label: "What you expected",
        placement: { after_section_id: "task" }
      },
      {
        entry_id: "observation",
        order: 2,
        label: "What you observed",
        placement: { after_section_id: "support" }
      }
    ]
  });
  const html = renderHtml(page);
  const taskSection = indexOfSection(html, "task");
  const supportSection = indexOfSection(html, "support");
  const expectationWs = indexOfWorkspace(html, "expectation");
  const observationWs = indexOfWorkspace(html, "observation");
  assert.ok(taskSection < expectationWs && expectationWs < supportSection);
  assert.ok(supportSection < observationWs);
  assert.doesNotMatch(html, /data-region=["']situated-record["']/);
});

test("4. Multiple entries after the same section preserve canonical entry order", () => {
  const page = pageWithEntries({
    recordEntries: [
      {
        entry_id: "meaning",
        order: 1,
        label: "What the evidence means",
        placement: { after_section_id: "support" }
      },
      {
        entry_id: "changed",
        order: 2,
        label: "What you changed",
        placement: { after_section_id: "support" }
      }
    ]
  });
  const html = renderHtml(page);
  const meaningIdx = indexOfWorkspace(html, "meaning");
  const changedIdx = indexOfWorkspace(html, "changed");
  assert.ok(meaningIdx >= 0 && changedIdx > meaningIdx);

  const placement = composeSituated.composeSituatedRecordWorkspacePlacement(page);
  assert.deepEqual(
    placement.bySectionId.support.map((ws) => ws.responsePartId),
    ["meaning", "changed"]
  );
});

test("5. Hybrid: placed alongside sections; unplaced in consolidated record region", () => {
  const page = pageWithEntries({
    recordEntries: [
      {
        entry_id: "expectation",
        order: 1,
        label: "What you expected",
        placement: { after_section_id: "task" }
      },
      {
        entry_id: "carry_forward",
        order: 2,
        label: "What you will carry forward"
      }
    ]
  });
  const html = renderHtml(page);
  assert.match(html, /data-region=["']situated-record-embedded["']/);
  assert.match(html, /data-region=["']situated-record["']/);
  assert.ok(indexOfWorkspace(html, "expectation") > indexOfSection(html, "task"));
  const consolidatedIdx = html.indexOf('data-region="situated-record" aria-label="Record"');
  const carryIdx = indexOfWorkspace(html, "carry_forward");
  assert.ok(consolidatedIdx >= 0 && carryIdx > consolidatedIdx);
  assert.ok(carryIdx > indexOfSection(html, "return"));
  assert.equal(html.includes('data-response-part-id="carry_forward"'), true);
});

test("6. Nonexistent section reference is rejected", () => {
  const raw = pageWithEntries();
  raw.situated_learning.record.entries = [
    {
      entry_id: "evidence",
      order: 1,
      label: "What you observed",
      placement: { after_section_id: "does-not-exist" }
    }
  ];
  const gate = situated.validateSituatedTaskDesignPage(raw);
  assert.equal(gate.ok, false);
  assert.ok(
    (gate.errors || []).some((e) => /unknown section_id:does-not-exist/.test(e)),
    (gate.errors || []).join("; ")
  );
});

test("7. Empty or malformed placement is rejected", () => {
  const base = pageWithEntries({ recordEntries: null });
  base.situated_learning.record.entries = [
    { entry_id: "a", order: 1, label: "A", placement: { after_section_id: "" } }
  ];
  assert.equal(situated.validateSituatedTaskDesignPage(base).ok, false);

  const malformed = pageWithEntries({ recordEntries: null });
  malformed.situated_learning.record.entries = [
    { entry_id: "a", order: 1, label: "A", placement: "task" }
  ];
  assert.equal(situated.validateSituatedTaskDesignPage(malformed).ok, false);

  const emptyObj = pageWithEntries({ recordEntries: null });
  emptyObj.situated_learning.record.entries = [
    { entry_id: "a", order: 1, label: "A", placement: {} }
  ];
  assert.equal(situated.validateSituatedTaskDesignPage(emptyObj).ok, false);
});

test("8–10. Workspace IDs, responsePartIds, and draft persistence identity unchanged by placement", () => {
  const consolidated = pageWithEntries({
    recordEntries: [
      { entry_id: "evidence", order: 1, label: "What you observed" }
    ]
  });
  const placed = pageWithEntries({
    recordEntries: [
      {
        entry_id: "evidence",
        order: 1,
        label: "What you observed",
        placement: { after_section_id: "task" }
      }
    ]
  });

  const wsA = composeSituated.composeSituatedRecordWorkspaces(consolidated);
  const wsB = composeSituated.composeSituatedRecordWorkspaces(placed);
  assert.equal(wsA.length, 1);
  assert.equal(wsB.length, 1);
  assert.equal(wsA[0].responsePartId, "evidence");
  assert.equal(wsB[0].responsePartId, "evidence");

  const htmlA = renderHtml(consolidated);
  const htmlB = renderHtml(placed);
  assert.match(htmlA, new RegExp('data-workspace-id="' + workspaceIdFor("evidence") + '"'));
  assert.match(htmlB, new RegExp('data-workspace-id="' + workspaceIdFor("evidence") + '"'));
  assert.match(htmlA, /data-learner-draft-controls/);
  assert.match(htmlB, /data-learner-draft-controls/);
  assert.match(htmlA, /data-persistence-page-key=/);
  assert.match(htmlB, /data-persistence-page-key=/);
  assert.match(htmlA, /learner-renderer-vnext:draft:/);
  assert.match(htmlB, /learner-renderer-vnext:draft:/);
});

test("11. activities remains []", () => {
  const page = pageWithEntries({
    recordEntries: [
      {
        entry_id: "evidence",
        order: 1,
        label: "What you observed",
        placement: { after_section_id: "task" }
      }
    ]
  });
  assert.deepEqual(page.activities, []);
  assert.equal(situated.validateSituatedTaskDesignPage(page).ok, true);
  const html = renderHtml(page);
  assert.doesNotMatch(html, /data-region=["']activities["']/);
});

test("12. Stage 5 prompt: placement optional by educational need, not mechanically required", () => {
  const prompt = situated.buildSituatedTaskDesignPagePrompt();
  assert.match(prompt, /RECORD PLACEMENT/i);
  assert.match(prompt, /EMBEDDED/i);
  assert.match(prompt, /CONSOLIDATED/i);
  assert.match(prompt, /HYBRID/i);
  assert.match(prompt, /after_section_id/);
  assert.match(prompt, /Do NOT require every entry to have placement/i);
  assert.match(prompt, /Do NOT mechanically mirror every section/i);
  assert.match(prompt, /OMIT placement/i);
  const copy = situated.buildSituatedTaskDesignPageCopyInstructions();
  assert.match(copy, /optional placement\.after_section_id/i);
  assert.match(copy, /embedded \/ consolidated \/ hybrid/i);
});

test("13. Situated Task learner HTML uses data-page-kind=situated_task", () => {
  const page = pageWithEntries();
  const model = buildPageModel.buildPageModel(page);
  assert.equal(model.ok, true, (model.errors || []).join("; "));
  assert.equal(model.model.pageKind, "situated_task");
  assert.equal(buildPageModel.isSituatedTaskLearnerPage(page), true);

  const html = renderHtml(page);
  assert.match(html, /data-page-kind="situated_task"/);
  assert.match(html, /util-page--situated-task/);
  assert.doesNotMatch(html, /data-page-kind="interactive"/);
});

test("14. Interactive learner pages continue to identify as Interactive", () => {
  const interactive = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "fixtures", "page-render", "roman-roads-page.json"),
      "utf8"
    )
  );
  assert.equal(buildPageModel.isSituatedTaskLearnerPage(interactive), false);
  const model = buildPageModel.buildPageModel(interactive);
  assert.equal(model.ok, true, (model.errors || []).join("; "));
  assert.equal(model.model.pageKind, "interactive");

  const rendered = renderer.renderLearnerPageHtml(interactive, { compositionMode: "moments" });
  assert.equal(rendered.error, null, rendered.error);
  assert.match(rendered.html, /data-page-kind="interactive"/);
  assert.doesNotMatch(rendered.html, /data-page-kind="situated_task"/);
  assert.doesNotMatch(rendered.html, /util-page--situated-task/);

  const familyBuilt = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "self_study_resource",
    focus: "Bayes",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(familyBuilt.identity.product, "interactive");
});

test("15. Page-kind correction does not alter Situated record composition or persistence", () => {
  const page = pageWithEntries({
    recordEntries: [
      {
        entry_id: "evidence",
        order: 1,
        label: "What you observed",
        placement: { after_section_id: "task" }
      },
      {
        entry_id: "carry_forward",
        order: 2,
        label: "What you will carry forward"
      }
    ]
  });
  const workspaces = composeSituated.composeSituatedRecordWorkspaces(page);
  assert.deepEqual(
    workspaces.map((ws) => ws.responsePartId),
    ["evidence", "carry_forward"]
  );
  assert.deepEqual(
    workspaces.map((ws) => ws.capability),
    ["text_entry", "text_entry"]
  );

  const html = renderHtml(page);
  assert.match(html, /data-page-kind="situated_task"/);
  assert.match(html, new RegExp('data-workspace-id="' + workspaceIdFor("evidence") + '"'));
  assert.match(html, new RegExp('data-workspace-id="' + workspaceIdFor("carry_forward") + '"'));
  assert.match(html, /data-persistence-page-key=/);
  assert.match(html, /data-learner-draft-controls/);
  assert.deepEqual(page.activities, []);
});

test("Valid placement accepted; entries without placement remain valid", () => {
  const withPlacement = pageWithEntries({
    recordEntries: [
      {
        entry_id: "evidence",
        order: 1,
        label: "What you observed",
        placement: { after_section_id: "task" }
      }
    ]
  });
  assert.equal(situated.validateSituatedTaskDesignPage(withPlacement).ok, true);

  const without = pageWithEntries();
  assert.equal(situated.validateSituatedTaskDesignPage(without).ok, true);
  without.situated_learning.record.entries.forEach((entry) => {
    assert.equal(Object.prototype.hasOwnProperty.call(entry, "placement"), false);
  });
});
