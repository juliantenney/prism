/**
 * Sprint 96 — resource-fidelity gate (unified graphics + editable tables).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const unifiedShell = require("../lib/learning-journey-unified-shell.js");

const STANDALONE_C2 = path.join(
  __dirname,
  "..",
  "tmp-duu-standalone-m2-overflow",
  "c2",
  "index.html"
);
const STANDALONE_C4 = path.join(
  __dirname,
  "..",
  "tmp-duu-standalone-m2-overflow",
  "c4",
  "index.html"
);

function hasFixture(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (_err) {
    return false;
  }
}

test("extractRendererFragmentFromHtml keeps nested articles and media", () => {
  if (!hasFixture(STANDALONE_C2)) {
    // Fixture is produced from the author's exported multi-doc ZIP during local fidelity work.
    return;
  }
  const html = fs.readFileSync(STANDALONE_C2, "utf8");
  const extracted = unifiedShell.extractRendererFragmentFromHtml(html);
  assert.equal(extracted.ok, true, extracted.code);
  assert.match(extracted.html, /util-visual-asset-image/);
  assert.match(extracted.html, /media\/knowledge-summary-after-content\.png/);
  assert.match(extracted.html, /util-learner-table-workspace__input/);
  assert.match(extracted.html, /Four-Source Evaluation|Your Four-Source/i);
});

test("rewriteAssetPaths remaps relative media/ and assets/ without touching absolute URLs", () => {
  const sample =
    '<img src="media/diagram.png" srcset="media/diagram.png 1x, https://cdn.example/x.png 2x" alt="D">' +
    '<img src="./assets/legacy.png" alt="L">' +
    '<a href="#section">jump</a>' +
    '<a href="https://example.com/doc">ext</a>' +
    '<img src="media/c2/already.png" alt="ok">';
  const out = unifiedShell.rewriteAssetPaths(sample, "media/c2/");
  assert.match(out, /src="media\/c2\/diagram\.png"/);
  assert.match(out, /src="media\/c2\/legacy\.png"/);
  assert.match(out, /srcset="media\/c2\/diagram\.png 1x, https:\/\/cdn\.example\/x\.png 2x"/);
  assert.match(out, /href="#section"/);
  assert.match(out, /href="https:\/\/example\.com\/doc"/);
  assert.match(out, /src="media\/c2\/already\.png"/);
  assert.doesNotMatch(out, /media\/c2\/c2\//);
});

test("prepareUnifiedShellResources prefers learnerPackage HTML over sourcePage re-render", () => {
  if (!hasFixture(STANDALONE_C2)) return;
  const packageHtml = fs.readFileSync(STANDALONE_C2, "utf8");
  const prepared = unifiedShell.prepareUnifiedShellResources(
    [
      {
        commissionId: "c2",
        title: "Evaluating and Weighing Evidence",
        productId: "interactive",
        // Deliberately empty/minimal sourcePage path is not used when package HTML exists.
        sourcePage: {
          artifact_type: "page",
          schema_version: "2.0.0",
          product_id: "interactive",
          title: "Evaluating and Weighing Evidence",
          activities: []
        },
        learnerPackage: {
          html: packageHtml,
          assets: [
            {
              path: "media/knowledge-summary-after-content.png",
              bytes: new Uint8Array([1, 2, 3])
            },
            {
              path: "activity-a2-materials-entry.png",
              bytes: new Uint8Array([4, 5, 6])
            }
          ]
        }
      }
    ],
    {}
  );
  assert.equal(prepared.ok, true);
  assert.equal(prepared.resources.length, 1);
  const html = prepared.resources[0].html;
  assert.match(html, /src="media\/c2\/knowledge-summary-after-content\.png"/);
  assert.match(html, /src="media\/c2\/activity-a2-materials-entry\.png"/);
  assert.match(html, /util-learner-table-workspace__input/);
  assert.match(html, /Four-Source Evaluation|Your Four-Source/i);
});

test("C4 package extract retains compare-alternatives table inputs when present standalone", () => {
  if (!hasFixture(STANDALONE_C4)) return;
  const packageHtml = fs.readFileSync(STANDALONE_C4, "utf8");
  const prepared = unifiedShell.prepareUnifiedShellResources(
    [
      {
        commissionId: "c4",
        title: "Reconsidering a Provisional Decision",
        productId: "interactive",
        learnerPackage: { html: packageHtml, assets: [] }
      }
    ],
    {}
  );
  assert.equal(prepared.ok, true);
  const html = prepared.resources[0].html;
  assert.match(html, /util-visual-asset-image/);
  assert.match(html, /src="media\/c4\//);
  const standaloneHasInputs = /util-learner-table-workspace__input/i.test(packageHtml);
  assert.equal(
    standaloneHasInputs,
    true,
    "standalone C4 fixture should include editable table inputs for comparison"
  );
  assert.match(html, /util-learner-table-workspace__input/);
});
