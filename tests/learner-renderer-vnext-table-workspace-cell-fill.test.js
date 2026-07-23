"use strict";

/**
 * Editable table-workspace cells must stretch with wrapped-row height.
 * Structural + CSS contract; layout verified in browser fixture separately.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  renderTableWorkspace
} = require("../lib/learner-renderer-vnext/render-table-workspace");
const learnerDraftAdapters = require("../lib/learner-renderer-vnext/learner-draft-adapters");
const {
  renderLearnerWorkspace
} = require("../lib/learner-renderer-vnext/render-composed-moment");

const appJsPath = path.join(__dirname, "..", "app.js");

function wrapMaterial(body, id) {
  return {
    id: id || "CELL-FILL-M1",
    type: "decision_table",
    title: "Cell fill probe",
    bodyFormat: "markdown",
    body: body
  };
}

const FIXTURE_BODY = [
  "| Label | Observation | Notes |",
  "| --- | --- | --- |",
  "| Short | | |",
  "| Two line label that wraps onto a second line in a narrow column | | |",
  "| Three line label that wraps onto a second line and then a third line when the column is constrained | | |",
  "| Four line label that wraps onto a second line then a third line and finally a fourth line under a narrow column constraint for depth | | |"
].join("\n");

function extractEditableCells(html) {
  return [...String(html).matchAll(
    /<td class="util-learner-table-workspace__cell util-learner-table-workspace__cell--editable">([\s\S]*?)<\/td>/g
  )].map((match) => match[1]);
}

function mockTableWorkspace(controls) {
  const byId = Object.create(null);
  controls.forEach((control) => {
    byId[control.id] = control;
  });
  return {
    getAttribute(name) {
      if (name === "data-workspace-kind" || name === "data-workspace-capability") {
        return "table_entry";
      }
      return null;
    },
    querySelectorAll(selector) {
      if (selector === ".util-learner-table-workspace__input") {
        return controls.slice();
      }
      return [];
    },
    querySelector(selector) {
      const list = this.querySelectorAll(selector);
      return list[0] || null;
    },
    getElementById(id) {
      return byId[id] || null;
    }
  };
}

test("markup: editable cells emit flex inner wrapper and one textarea control", () => {
  const html = renderTableWorkspace(wrapMaterial(FIXTURE_BODY), "A1");
  const cells = extractEditableCells(html);
  assert.equal(cells.length, 8);

  cells.forEach((cellHtml) => {
    assert.match(
      cellHtml,
      /^<div class="util-learner-table-workspace__cell--editable-inner"><textarea class="util-learner-table-workspace__input"/
    );
    assert.equal((cellHtml.match(/<textarea\b/g) || []).length, 1);
    assert.doesNotMatch(cellHtml, /<input\b/);
  });

  const ids = [...html.matchAll(/data-learner-cell="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(ids, [
    "a1-cell-fill-m1-input-r0-c1",
    "a1-cell-fill-m1-input-r0-c2",
    "a1-cell-fill-m1-input-r1-c1",
    "a1-cell-fill-m1-input-r1-c2",
    "a1-cell-fill-m1-input-r2-c1",
    "a1-cell-fill-m1-input-r2-c2",
    "a1-cell-fill-m1-input-r3-c1",
    "a1-cell-fill-m1-input-r3-c2"
  ]);
  ids.forEach((id) => {
    assert.match(
      html,
      new RegExp(
        '<textarea class="util-learner-table-workspace__input" id="' +
          id +
          '" name="' +
          id +
          '" data-learner-cell="' +
          id +
          '"'
      )
    );
  });
});

test("markup: one-line, multi-editable, long and empty responses keep persistence ids", () => {
  const html = renderTableWorkspace(
    wrapMaterial(
      [
        "| Criterion | A | B |",
        "| --- | --- | --- |",
        "| One line | | |",
        "| Wrapped label that is intentionally long enough to wrap across several lines in a constrained table column for regression coverage | | |"
      ].join("\n"),
      "PERSIST-M1"
    ),
    "A9"
  );

  const longId = "a9-persist-m1-input-r1-c1";
  const emptyId = "a9-persist-m1-input-r1-c2";
  assert.match(html, new RegExp('data-learner-cell="' + longId + '"'));
  assert.match(html, new RegExp('data-learner-cell="' + emptyId + '"'));
  assert.equal((html.match(/util-learner-table-workspace__input/g) || []).length, 4);

  const longControl = {
    id: longId,
    value:
      "A long learner response that continues for several sentences so draft persistence can round-trip multi-line cell text without changing identifiers.",
    getAttribute(name) {
      if (name === "data-learner-cell" || name === "id") return longId;
      return null;
    }
  };
  const emptyControl = {
    id: emptyId,
    value: "",
    getAttribute(name) {
      if (name === "data-learner-cell" || name === "id") return emptyId;
      return null;
    }
  };
  const workspace = mockTableWorkspace([
    {
      id: "a9-persist-m1-input-r0-c1",
      value: "",
      getAttribute(name) {
        if (name === "data-learner-cell" || name === "id") {
          return "a9-persist-m1-input-r0-c1";
        }
        return null;
      }
    },
    {
      id: "a9-persist-m1-input-r0-c2",
      value: "",
      getAttribute(name) {
        if (name === "data-learner-cell" || name === "id") {
          return "a9-persist-m1-input-r0-c2";
        }
        return null;
      }
    },
    longControl,
    emptyControl
  ]);

  const serialized = learnerDraftAdapters.serializeWorkspaceState(workspace);
  assert.equal(serialized.ok, true);
  assert.equal(serialized.state.kind, "table_entry");
  assert.equal(
    serialized.state.value.cells[longId].includes("long learner response"),
    true
  );
  assert.equal(serialized.state.value.cells[emptyId], "");

  const cleared = learnerDraftAdapters.clearWorkspaceState(workspace);
  assert.equal(cleared.ok, true);
  assert.equal(longControl.value, "");

  const restored = learnerDraftAdapters.restoreWorkspaceState(
    workspace,
    serialized.state
  );
  assert.equal(restored.ok, true);
  assert.equal(longControl.value.includes("long learner response"), true);
  assert.equal(emptyControl.value, "");
});

test("css: editable cell stretch contract is present in learner utility styles", () => {
  const source = fs.readFileSync(appJsPath, "utf8");
  assert.match(
    source,
    /\.util-learner-table-workspace__cell--editable\{[^"]*padding:2px[^"]*height:1px[^"]*vertical-align:top/
  );
  assert.match(
    source,
    /\.util-learner-table-workspace__cell--editable-inner\{display:flex;flex-direction:column;align-items:stretch;box-sizing:border-box;min-height:100%;height:100%\}/
  );
  assert.match(
    source,
    /\.util-learner-table-workspace__input\{flex:1 1 auto;[^"]*min-height:100%;[^"]*resize:none/
  );
  assert.match(
    source,
    /@media print\{[^"]*util-learner-table-workspace__input\{border-color:#94a3b8;background:transparent/
  );
});

test("scope: non-table text entry workspace markup is unchanged by table cell fill", () => {
  const html = renderLearnerWorkspace(
    {
      id: "ws-text",
      kind: "text_entry",
      capability: "text_entry",
      prompt: "Write a short answer.",
      responsePartId: "step-1",
      sourceStepNumber: 1
    },
    "A1"
  );
  assert.match(html, /util-learner-workspace__input/);
  assert.doesNotMatch(html, /util-learner-table-workspace/);
  assert.doesNotMatch(html, /cell--editable-inner/);
});
