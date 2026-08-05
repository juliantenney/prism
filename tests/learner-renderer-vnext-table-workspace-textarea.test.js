/**
 * Shared table_entry editable cells use a three-line textarea.
 * Applies to every completion table routed through renderTableWorkspace.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  renderTableWorkspace
} = require("../lib/learner-renderer-vnext/render-table-workspace");
const { renderMaterial } = require("../lib/learner-renderer-vnext/render-material");
const {
  buildMaterialModel
} = require("../lib/learner-renderer-vnext/parse-material");
const learnerDraftAdapters = require("../lib/learner-renderer-vnext/learner-draft-adapters");

const appJsPath = path.join(__dirname, "..", "app.js");

const BLANK_TABLE_BODY = [
  "| Item | Observation | Judgement |",
  "| --- | --- | --- |",
  "| Case A | given value | |",
  "| Case B | | |"
].join("\n");

const POPULATED_TABLE_BODY = [
  "| Item | Observation | Judgement |",
  "| --- | --- | --- |",
  "| Case A | given value | complete |"
].join("\n");

function material(type, body, id) {
  return buildMaterialModel(
    {
      material_id: id || type + "-M1",
      material_type: type,
      title: type + " probe",
      body_format: "markdown",
      body: body
    },
    0
  );
}

function assertSharedThreeLineTextarea(html, expectedEditableCount) {
  assert.match(html, /data-workspace-kind="table_entry"/);
  assert.equal(
    (html.match(/<textarea\b[^>]*\bclass="util-learner-table-workspace__input"/g) || [])
      .length,
    expectedEditableCount
  );
  assert.equal((html.match(/rows="3"/g) || []).length, expectedEditableCount);
  assert.doesNotMatch(html, /rows="1"/);
  assert.doesNotMatch(html, /<input\b/);
  assert.doesNotMatch(html, /<textarea[^>]*\bvalue=/);

  const fixedCells = [
    ...String(html).matchAll(
      /<(?:td|th)\b[^>]*util-learner-table-workspace__cell--fixed[^>]*>([\s\S]*?)<\/(?:td|th)>/g
    )
  ].map((m) => m[1]);
  assert.ok(fixedCells.length > 0);
  fixedCells.forEach((cellHtml) => {
    assert.doesNotMatch(cellHtml, /<textarea\b/);
  });

  const headers = [...String(html).matchAll(/<th\b[^>]*scope="col"[^>]*>([\s\S]*?)<\/th>/g)].map(
    (m) => m[1]
  );
  headers.forEach((cellHtml) => {
    assert.doesNotMatch(cellHtml, /<textarea\b/);
  });
}

test("markup: data_table blank cells use shared three-line textarea", () => {
  const html = renderTableWorkspace(material("data_table", BLANK_TABLE_BODY), "A3");
  // Blank: Case A judgement + Case B observation + Case B judgement = 3
  assertSharedThreeLineTextarea(html, 3);
  assert.match(html, /data-material-type="data_table"/);
  assert.match(html, /given value/);
});

test("markup: impact_table blank cells use shared three-line textarea", () => {
  const html = renderTableWorkspace(material("impact_table", BLANK_TABLE_BODY), "A4");
  assertSharedThreeLineTextarea(html, 3);
  assert.match(html, /data-material-type="impact_table"/);
});

test("markup: classification_table blank cells use shared three-line textarea", () => {
  const html = renderTableWorkspace(
    material("classification_table", BLANK_TABLE_BODY),
    "A2"
  );
  assertSharedThreeLineTextarea(html, 3);
  assert.match(html, /data-material-type="classification_table"/);
});

test("static: populated tables and reference_table remain non-interactive", () => {
  ["data_table", "impact_table", "classification_table"].forEach((type) => {
    const mat = material(type, POPULATED_TABLE_BODY, type + "-static");
    const html = renderMaterial(mat);
    assert.match(html, /<table>/);
    assert.doesNotMatch(html, /util-learner-table-workspace/);
    assert.doesNotMatch(html, /<textarea/);
  });

  const reference = material("reference_table", BLANK_TABLE_BODY, "REF-static");
  // reference_table is never a table_entry workspace even with blanks
  const refHtml = renderMaterial(reference);
  assert.match(refHtml, /data-material-type="reference_table"/);
  assert.match(refHtml, /<table>/);
  assert.doesNotMatch(refHtml, /util-learner-table-workspace/);
  assert.doesNotMatch(refHtml, /<textarea/);
});

test("persistence: multiline special-character values survive serialize/restore", () => {
  const cellId = "a3-data-table-m1-input-r0-c2";
  const value = "Residual increases\nVariance widens\n<>&\"'";
  const control = {
    id: cellId,
    value: value,
    getAttribute(name) {
      if (name === "data-learner-cell" || name === "id") return cellId;
      return null;
    }
  };
  const workspace = {
    getAttribute(name) {
      if (name === "data-workspace-kind" || name === "data-workspace-capability") {
        return "table_entry";
      }
      return null;
    },
    querySelectorAll(selector) {
      return selector === ".util-learner-table-workspace__input" ? [control] : [];
    }
  };

  const serialized = learnerDraftAdapters.serializeWorkspaceState(workspace);
  assert.equal(serialized.ok, true);
  assert.equal(serialized.state.value.cells[cellId], value);

  control.value = "stale";
  const restored = learnerDraftAdapters.restoreWorkspaceState(
    workspace,
    serialized.state
  );
  assert.equal(restored.ok, true);
  assert.equal(control.value, value);
  assert.deepEqual(control.value.split("\n"), [
    "Residual increases",
    "Variance widens",
    "<>&\"'"
  ]);
});

test("layout css: textarea fills cell width, vertical resize, table scroll overflow", () => {
  const source = fs.readFileSync(appJsPath, "utf8");
  assert.match(
    source,
    /\.util-learner-table-breakout,\.util-learner-renderer-vnext \.util-material-table-block\{[^"]*width:min\(75rem,calc\(100vw - var\(--learner-breakout-left\) - var\(--learner-page-gutter\)\)\)[^"]*max-width:none/
  );
  assert.match(
    source,
    /\.util-learner-table-workspace__input\{[^"]*width:100%;[^"]*min-width:0;[^"]*min-height:4\.5rem;[^"]*resize:vertical/
  );
  assert.doesNotMatch(
    source,
    /\.util-learner-table-workspace__input\{[^"]*min-width:10rem/
  );
  assert.match(
    source,
    /\.util-learner-table-workspace__table table\{[^"]*width:100%;[^"]*table-layout:auto/
  );
  assert.doesNotMatch(
    source,
    /\.util-learner-table-workspace__table table\{[^"]*width:max-content/
  );
  assert.match(
    source,
    /\.util-table-scroll\.util-material-table table\{[^"]*width:100%;[^"]*table-layout:auto/
  );
  assert.match(
    source,
    /\.util-learner-table-workspace__table th,\.util-learner-renderer-vnext \.util-learner-table-workspace__table td\{[^"]*min-width:8rem;[^"]*overflow-wrap:normal;[^"]*word-break:normal/
  );
  assert.match(
    source,
    /th\[scope=\\"row\\"\].*min-width:6rem/
  );
  assert.match(
    source,
    /\.util-table-scroll\{[^"]*overflow-x:auto/
  );
  assert.match(
    source,
    /util-learner-table-workspace__table/
  );
});
