/**
 * Sprint 38-S — Design Page capture normalization (duplicate/fenced JSON repair).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const pageNorm = require(path.join(repoRoot, "lib", "workflow-page-capture-normalize.js"));
const appJsPath = path.join(repoRoot, "app.js");

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, module: { exports: {} }, exports: {} };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  sandbox.globalThis = windowStub;
  windowStub.window = windowStub;
  windowStub.PRISM_WORKFLOW_PAGE_CAPTURE_NORMALIZE = pageNorm;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

const canonicalPage = {
  artifact_type: "page",
  title: "Inflation Workbook",
  page_profile: "learner",
  sections: [
    { section_id: "overview", heading: "Overview", content: "Session context." },
    {
      section_id: "learning_activities",
      heading: "Learning Activities",
      content: {
        content: [
          {
            activity_id: "A2",
            learner_task: "Calculate CPI change.",
            materials: { checklist: "Check accurate calculation steps." }
          }
        ]
      }
    }
  ],
  visual_affordance_schema_version: "38.4",
  activities_visual_review: [],
  visual_affordances: []
};

const corruptedCapture = [
  "{",
  '  "artifact_type": "page",',
  '  "title": "Broken partial",',
  '  "sections": [',
  "    {",
  '      "section_id": "learning_activities",',
  '      "heading": "Learning Activities",',
  '      "content": {',
  '        "content": [',
  "          {",
  '            "activity_id": "A2",',
  '            "materials": {',
  '              "checklist": "Check accurate calculation```json',
  JSON.stringify(canonicalPage, null, 2),
  "```",
  "            }",
  "          }",
  "        ]",
  "      }",
  "    }",
  "  ]",
  "}"
].join("\n");

test("normalizePageWorkflowCapture: repairs fenced duplicate page object", () => {
  assert.throws(() => JSON.parse(corruptedCapture));
  const result = pageNorm.normalizePageWorkflowCapture(corruptedCapture);
  assert.equal(result.ok, true, result.message || (result.errors || []).join("; "));
  assert.equal(result.repaired, true);
  const parsed = JSON.parse(result.json);
  assert.equal(parsed.artifact_type, "page");
  assert.equal(parsed.title, "Inflation Workbook");
  assert.equal(parsed.sections.length, 2);
  assert.doesNotThrow(() => JSON.parse(result.json));
  assert.ok(!/```json/i.test(result.json));
});

test("normalizePageWorkflowCapture: keeps clean page JSON unchanged", () => {
  const clean = JSON.stringify(canonicalPage, null, 2);
  const result = pageNorm.normalizePageWorkflowCapture(clean);
  assert.equal(result.ok, true);
  assert.equal(result.repaired, false);
  const parsed = JSON.parse(result.json);
  assert.equal(parsed.title, "Inflation Workbook");
});

test("normalizePageWorkflowCapture: rejects prose-only capture", () => {
  const result = pageNorm.normalizePageWorkflowCapture(
    "This page explains inflation impacts for households."
  );
  assert.equal(result.ok, false);
  assert.match(result.message, /not valid JSON/i);
});

test("app normalizePageWorkflowRunCapture integrates module for Design Page step", () => {
  const api = loadPrismTestApi();
  const fixed = api.normalizePageWorkflowRunCapture(corruptedCapture, "page_step");
  assert.equal(fixed.ok, true);
  assert.doesNotThrow(() => JSON.parse(fixed.json));
  const parsed = JSON.parse(fixed.json);
  assert.equal(parsed.artifact_type, "page");
  assert.equal(parsed.title, "Inflation Workbook");
});
