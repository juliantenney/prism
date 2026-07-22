"use strict";

/**
 * Sprint 68 — S68-IMP-017 multi-part text_entry composition tests.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const {
  buildPageModel,
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext");
const {
  composeDoMoment,
  composeCheckMoment
} = require("../lib/learner-renderer-vnext/compose-activity-moments");
const { resolveWorkspaceList } = require("../lib/learner-renderer-vnext/render-composed-moment");
const collectResponseParts = require("../lib/learner-renderer-vnext/compose-response-parts");
const composeLearnerSurfaces = require("../lib/learner-renderer-vnext/compose-learner-surfaces");
const { parseTemplateSections } = require("../lib/learner-renderer-vnext/parse-template-sections");
const { parsePromptSetItems } = require("../lib/learner-renderer-vnext/parse-prompt-set-items");
const learnerSurfaceRegistry = require("../lib/learner-renderer-vnext/learner-surface-registry");
const audit = require("../lib/learner-renderer-vnext/audit-learner-surfaces");
const types = require("../lib/learner-renderer-vnext/response-part-types");
const { buildResponsePart } = require("../lib/learner-renderer-vnext/compose-response-parts");
const {
  loadLearnerRendererVNextBrowserInSandbox,
  wireBrowserGlobalThis
} = require("./prism-vm-lib-bootstrap.js");

const heteroFixture = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);
const ksFixture = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "learner-renderer-kitchen-sink-page.json"
);
const vttFixture = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "workflows",
  "videotranscripttest-assembled-page.json"
);
const rnaFixture = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "rna-hcv-assembled-vnext-materials-page.json"
);

function loadJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));
}

function activityFromFixture(fixturePath, activityId) {
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const model = buildPageModel(page).model;
  const activity = model.activities.find((entry) => entry.id === activityId);
  assert.ok(activity, activityId + " missing");
  return { page, model, activity };
}

function textWorkspaces(moment) {
  return resolveWorkspaceList(moment).filter((workspace) => workspace.capability === "text_entry");
}

function extractActivityHtml(html, activityId) {
  const marker = 'id="activity-' + activityId + '"';
  const markerIndex = String(html || "").indexOf(marker);
  if (markerIndex < 0) return "";
  const openTagStart = String(html).lastIndexOf("<article", markerIndex);
  const source = String(html);
  const tagRe = /<(\/?)article\b[^>]*>/gi;
  tagRe.lastIndex = openTagStart;
  let depth = 0;
  let match;
  while ((match = tagRe.exec(source)) !== null) {
    if (match[1]) depth -= 1;
    else depth += 1;
    if (depth === 0) return source.slice(openTagStart, tagRe.lastIndex);
  }
  return "";
}

function loadBrowserRenderer() {
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise
  };
  sandbox.document = {
    createElement() {
      return { style: {}, appendChild() {}, setAttribute() {}, removeAttribute() {} };
    }
  };
  sandbox.window = sandbox;
  wireBrowserGlobalThis(sandbox);
  vm.createContext(sandbox);
  loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
  return sandbox.window.PRISM_LEARNER_RENDERER_VNEXT;
}

test("prompt set: one numbered item produces one text_entry workspace", () => {
  const items = parsePromptSetItems("1. Explain the first effect.");
  assert.equal(items.length, 1);
  const parts = collectResponseParts.partsFromPromptSetMaterial("A4", {
    id: "A4-M3",
    type: "prompt_set",
    body: "1. Explain the first effect."
  });
  assert.equal(parts.length, 1);
  assert.equal(parts[0].surfaceKind, types.SURFACE_KIND.TEXT_ENTRY);
});

test("prompt set: multiple numbered items produce multiple ordered workspaces", () => {
  const body =
    "1. What changes in the residuals?\n2. How could this affect inference?\n3. What evidence supports this?";
  const items = parsePromptSetItems(body);
  assert.equal(items.length, 3);
  assert.deepEqual(
    items.map((item) => item.order),
    [1, 2, 3]
  );
  const parts = collectResponseParts.partsFromPromptSetMaterial("A4", {
    id: "A4-M3",
    type: "prompt_set",
    body
  });
  assert.equal(parts.length, 3);
  assert.match(parts[1].prompt, /inference/);
});

test("prompt set: authored labels are preserved when present in prompt text", () => {
  const { activity } = activityFromFixture(heteroFixture, "A4");
  const workspaces = textWorkspaces(composeDoMoment(activity));
  assert.equal(workspaces.length, 5);
  assert.match(workspaces[0].prompt, /residuals/);
});

test("prompt set: internal response-part ids are not exposed as visible labels", () => {
  const { page } = activityFromFixture(heteroFixture, "A4");
  const html = renderLearnerPageHtml(page, { compositionMode: "moments" }).html;
  const a4 = extractActivityHtml(html, "A4");
  assert.doesNotMatch(a4, />Response 1<|>Response 2<|>text_entry_4</);
  assert.doesNotMatch(a4, /template_section_3/);
});

test("template: editable sections produce labelled workspaces; reference sections do not", () => {
  const body =
    "## Claim\nState your claim.\n\n## Evidence assessed against criteria\n- one\n- two\n\n## Limits\nState limits.";
  const sections = parseTemplateSections(body);
  assert.equal(sections.length, 2);
  assert.deepEqual(
    sections.map((section) => section.label),
    ["Claim", "Limits"]
  );
});

test("template: multiple editable sections preserve order and labels", () => {
  const { activity } = activityFromFixture(vttFixture, "A6");
  const workspaces = textWorkspaces(composeDoMoment(activity));
  assert.deepEqual(
    workspaces.map((workspace) => workspace.responseLabel),
    ["Claim", "Reasons", "Limits"]
  );
});

test("transfer: explicit transfer prompt produces one text_entry workspace", () => {
  const { activity } = activityFromFixture(heteroFixture, "A3");
  const check = composeCheckMoment(activity);
  const workspaces = textWorkspaces(check);
  assert.equal(workspaces.length, 1);
  assert.match(workspaces[0].prompt, /Identify another economic variable pair/i);
});

test("transfer: instructional review steps do not produce workspaces", () => {
  const { activity } = activityFromFixture(heteroFixture, "A3");
  const doMoment = composeDoMoment(activity);
  assert.equal(textWorkspaces(doMoment).length, 0);
});

test("reflection: written reflection step produces a workspace in VTT A6 Check", () => {
  const { activity } = activityFromFixture(vttFixture, "A6");
  const check = composeCheckMoment(activity);
  const labels = textWorkspaces(check).map((workspace) => workspace.responseLabel);
  assert.ok(labels.includes("Transfer response"));
  assert.ok(labels.includes("Reflection"));
});

test("deduplication: structured prompt set takes precedence over expected-output fallback", () => {
  const { activity } = activityFromFixture(heteroFixture, "A4");
  const doMoment = composeDoMoment(activity);
  const labels = textWorkspaces(doMoment).map((workspace) => workspace.sourceKind);
  assert.ok(labels.every((kind) => kind === "prompt_item"));
  assert.ok(!labels.includes("expected_output"));
});

test("deduplication: table workspace suppresses expected-output fallback on Do", () => {
  const { activity } = activityFromFixture(heteroFixture, "A3");
  const doMoment = composeDoMoment(activity);
  assert.equal(textWorkspaces(doMoment).length, 0);
  assert.ok(doMoment.items.some((item) => item.tableWorkspace));
});

test("deduplication: template sections suppress duplicate written task-step workspaces", () => {
  const { activity } = activityFromFixture(heteroFixture, "A5");
  const workspaces = textWorkspaces(composeDoMoment(activity));
  assert.equal(workspaces.length, 3);
  assert.ok(workspaces.every((workspace) => workspace.sourceKind === "template_section"));
});

test("single-text-entry activities remain unchanged", () => {
  const { activity } = activityFromFixture(heteroFixture, "A1");
  const workspaces = textWorkspaces(composeDoMoment(activity));
  assert.equal(workspaces.length, 1);
  assert.equal(workspaces[0].sourceKind, "task_step");
});

test("table-entry activities remain unchanged", () => {
  const { activity } = activityFromFixture(heteroFixture, "A2");
  const doMoment = composeDoMoment(activity);
  assert.equal(textWorkspaces(doMoment).length, 0);
  assert.ok(doMoment.items.some((item) => item.tableWorkspace));
});

test("mixed surfaces: table_entry and multiple text_entry can coexist", () => {
  const { activity } = activityFromFixture(heteroFixture, "A5");
  const doMoment = composeDoMoment(activity);
  assert.ok(doMoment.items.some((item) => item.tableWorkspace));
  assert.equal(textWorkspaces(doMoment).length, 3);
});

test("rendering: each workspace has label association and unique ids", () => {
  const { page } = activityFromFixture(heteroFixture, "A4");
  const html = renderLearnerPageHtml(page, { compositionMode: "moments" }).html;
  const a4 = extractActivityHtml(html, "A4");
  const labels = [...a4.matchAll(/<label[^>]+for="([^"]+)"/g)];
  const textareas = [...a4.matchAll(/<textarea[^>]+id="([^"]+)"/g)];
  assert.equal(labels.length, textareas.length);
  const ids = textareas.map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  labels.forEach((match) => {
    assert.ok(ids.includes(match[1]));
  });
});

test("rendering: generic labels avoid internal numbering", () => {
  const { page } = activityFromFixture(heteroFixture, "A4");
  const html = renderLearnerPageHtml(page, { compositionMode: "moments" }).html;
  const a4 = extractActivityHtml(html, "A4");
  assert.doesNotMatch(a4, /Response 1|Response 2|text_entry_4/);
});

test("unsupported surface: matching is diagnosed, not rendered as textarea", () => {
  const part = buildResponsePart("X1", {
    sourceKind: types.SOURCE_KIND.TASK_STEP,
    sourceId: "matching-demo",
    order: 1,
    label: "Match the pairs",
    prompt: "Match each term to its definition.",
    surfaceKind: types.SURFACE_KIND.MATCHING
  });
  const mapped = learnerSurfaceRegistry.workspaceFromResponsePart(part);
  assert.equal(mapped.ok, false);
  assert.equal(mapped.diagnostic.code, types.DIAGNOSTIC.UNSUPPORTED_LEARNER_SURFACE);
});

test("duplicate response parts are suppressed with diagnostic", () => {
  const part = buildResponsePart("X1", {
    sourceKind: types.SOURCE_KIND.TRANSFER_PROMPT,
    sourceId: "transfer",
    order: 1,
    label: "Transfer response",
    prompt: "Apply elsewhere."
  });
  const deduped = composeLearnerSurfaces.dedupeResponseParts([part, part]);
  assert.equal(deduped.parts.length, 1);
  assert.equal(deduped.diagnostics.length, 1);
});

test("target activities: workspace counts after IMP-017", () => {
  const expectations = [
    [heteroFixture, "A3", { do: 0, check: 1 }],
    [heteroFixture, "A4", { do: 5, check: 0 }],
    [vttFixture, "A6", { do: 3, check: 2 }],
    [ksFixture, "KS02", { do: 3, check: 0 }],
    [ksFixture, "KS04", { do: 0, check: 1 }],
    [ksFixture, "KS05", { do: 4, check: 1 }],
    [rnaFixture, "A6", { do: 3, check: 1 }]
  ];

  expectations.forEach(([fixturePath, activityId, counts]) => {
    const { activity } = activityFromFixture(fixturePath, activityId);
    const doCount = textWorkspaces(composeDoMoment(activity)).length;
    const checkCount = textWorkspaces(composeCheckMoment(activity)).length;
    assert.equal(doCount, counts.do, activityId + " Do");
    assert.equal(checkCount, counts.check, activityId + " Check");
  });
});

test("IMP-016 audit rerun: 25 fully supported after IMP-018 ordering", () => {
  const result = audit.runLearnerSurfaceAudit({ repoRoot });
  assert.equal(result.records.length, 25);
  assert.equal(result.adequacyTotals.fully_supported, 25);
  assert.equal(result.adequacyTotals.supported_imperfectly_represented || 0, 0);
  assert.equal(result.adequacyTotals.missing_capability || 0, 0);
  const orderingRow = result.capabilityMatrix.find((row) => row.capability === "ordering");
  assert.equal(orderingRow.currentStatus, "implemented");
  assert.equal(orderingRow.recommendation, "retain");
  assert.ok(orderingRow.evidenceCount >= 1);
});

test("browser and Node rendering remain equivalent for multi-part A4", () => {
  const { page } = activityFromFixture(heteroFixture, "A4");
  const nodeHtml = renderLearnerPageHtml(page, { compositionMode: "moments" }).html;
  const browser = loadBrowserRenderer();
  const browserHtml = browser.renderLearnerPageHtml(page, { compositionMode: "moments" }).html;
  const nodeA4 = extractActivityHtml(nodeHtml, "A4");
  const browserA4 = extractActivityHtml(browserHtml, "A4");
  assert.equal(
    (nodeA4.match(/util-learner-workspace__input/g) || []).length,
    (browserA4.match(/util-learner-workspace__input/g) || []).length
  );
  assert.equal(nodeA4.includes("util-learner-response-group"), browserA4.includes("util-learner-response-group"));
});

test("audit CLI remains deterministic after IMP-018", () => {
  const stdout = execFileSync(
    process.execPath,
    [path.join(repoRoot, "scripts/audit-learner-surfaces.js"), "--json"],
    { cwd: repoRoot, encoding: "utf8" }
  );
  const summary = JSON.parse(stdout);
  assert.equal(summary.adequacyTotals.fully_supported, 25);
});
