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

test("markup: editable cells emit flex inner wrapper and one three-line textarea control", () => {
  const html = renderTableWorkspace(wrapMaterial(FIXTURE_BODY), "A1");
  const cells = extractEditableCells(html);
  assert.equal(cells.length, 8);

  cells.forEach((cellHtml) => {
    assert.match(
      cellHtml,
      /^<div class="util-learner-table-workspace__cell--editable-inner"><textarea class="util-learner-table-workspace__input"/
    );
    assert.match(cellHtml, /<textarea\b[^>]*\brows="3"/);
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
          '" rows="3"'
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

test("persistence: multiline cell values round-trip with line breaks and HTML-sensitive characters", () => {
  const cellId = "a1-multi-m1-input-r0-c1";
  const multiline =
    "Residual increases\nVariance widens\n<tag> & \"quotes\" 'apostrophe'";
  const control = {
    id: cellId,
    value: multiline,
    getAttribute(name) {
      if (name === "data-learner-cell" || name === "id") return cellId;
      return null;
    }
  };
  const workspace = mockTableWorkspace([control]);

  const serialized = learnerDraftAdapters.serializeWorkspaceState(workspace);
  assert.equal(serialized.ok, true);
  assert.equal(serialized.state.value.cells[cellId], multiline);
  assert.match(serialized.state.value.cells[cellId], /\n/);
  assert.match(serialized.state.value.cells[cellId], /</);
  assert.match(serialized.state.value.cells[cellId], /&/);

  control.value = "";
  const restored = learnerDraftAdapters.restoreWorkspaceState(
    workspace,
    serialized.state
  );
  assert.equal(restored.ok, true);
  assert.equal(control.value, multiline);
  assert.equal(control.value.split("\n").length, 3);
});

test("markup: initial editable textarea has empty text content (no value attribute)", () => {
  const html = renderTableWorkspace(wrapMaterial(FIXTURE_BODY), "A1");
  const match = html.match(
    /<textarea class="util-learner-table-workspace__input"[^>]*><\/textarea>/
  );
  assert.ok(match, "textarea should close with empty text content");
  assert.doesNotMatch(html, /<textarea[^>]*\bvalue=/);
});

test("css: editable cell three-line textarea contract is present in learner utility styles", () => {
  const source = fs.readFileSync(appJsPath, "utf8");
  assert.match(
    source,
    /\.util-learner-table-breakout,\.util-learner-renderer-vnext \.util-material-table-block\{[^"]*width:min\(75rem,calc\(100vw - var\(--learner-breakout-left\) - var\(--learner-page-gutter\)\)\)/
  );
  assert.match(
    source,
    /\.util-learner-table-workspace__cell--editable\{[^"]*padding:2px[^"]*min-width:8rem[^"]*height:1px[^"]*vertical-align:top/
  );
  assert.match(
    source,
    /\.util-learner-table-workspace__cell--editable-inner\{display:flex;flex-direction:column;align-items:stretch;box-sizing:border-box;min-height:100%;height:100%\}/
  );
  assert.match(
    source,
    /\.util-learner-table-workspace__input\{flex:1 1 auto;[^"]*width:100%;[^"]*min-width:0;[^"]*min-height:4\.5rem;[^"]*resize:vertical;[^"]*line-height:1\.4/
  );
  assert.match(
    source,
    /\.util-learner-table-workspace__table table\{[^"]*width:100%;[^"]*table-layout:auto/
  );
  assert.doesNotMatch(
    source,
    /\.util-learner-table-workspace__table table\{[^"]*width:max-content/
  );
  assert.doesNotMatch(
    source,
    /\.util-learner-table-workspace__input\{[^"]*min-width:10rem/
  );
  assert.match(
    source,
    /\.util-learner-table-workspace__table th,\.util-learner-renderer-vnext \.util-learner-table-workspace__table td\{[^"]*min-width:8rem;[^"]*white-space:normal;[^"]*overflow-wrap:anywhere/
  );
  assert.match(
    source,
    /th\[scope=\\"row\\"\],\.util-learner-renderer-vnext \.util-learner-table-workspace__table th:first-child,\.util-learner-renderer-vnext \.util-learner-table-workspace__table td:first-child\{[^"]*width:1%;[^"]*min-width:6rem/
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
