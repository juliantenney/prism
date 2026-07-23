/**
 * Sprint 69 — heteroscedasticity interactive workflow path regression.
 *
 * Uses production workflow/runstate storage keys and loaders, not page-render
 * certification fixtures as the render source.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const migration = require("../lib/episode-plan-v1-persistence-migration.js");
const {
  buildPageModel,
  renderLearnerPageHtml,
  validatePageModel
} = require("../lib/learner-renderer-vnext");
const {
  runPrismLibScriptsInSandbox,
  DEFAULT_LIBS,
  PEDAGOGICAL_ICON_LIBS,
  loadLearnerRendererVNextBrowserInSandbox,
  wireBrowserGlobalThis
} = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const bundlePath = path.join(
  repoRoot,
  "tests/fixtures/workflows/heteroscedasticity-interactive-storage/workflow-storage-bundle.json"
);

const EXPECTED = Object.freeze({
  A1: Object.freeze(["orientation", "explanation", "verification"]),
  A2: Object.freeze([
    "orientation",
    "worked_thinking",
    "guided_practice",
    "verification"
  ]),
  A3: Object.freeze([
    "orientation",
    "worked_thinking",
    "guided_practice",
    "reflection"
  ]),
  A4: Object.freeze([
    "orientation",
    "explanation",
    "guided_practice",
    "verification"
  ]),
  A5: Object.freeze([
    "orientation",
    "worked_judgement",
    "guided_practice",
    "reflection"
  ])
});

function loadBundle() {
  return JSON.parse(fs.readFileSync(bundlePath, "utf8"));
}

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add() {},
      remove() {},
      contains() {
        return false;
      },
      toggle() {
        return false;
      }
    },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {}
  };
}

function loadProductionApiWithStorage(bundle) {
  const storage = {
    [bundle.storageKeys.workflows]: JSON.stringify(bundle.workflows),
    [bundle.storageKeys.runstate]: JSON.stringify(bundle.runstate)
  };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const localStorage = {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null;
    },
    setItem(key, value) {
      storage[key] = String(value);
    },
    removeItem(key) {
      delete storage[key];
    }
  };
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/", origin: "http://localhost" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: localStorage,
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () =>
        Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  wireBrowserGlobalThis(sandbox);
  vm.createContext(sandbox);
  const libs = DEFAULT_LIBS.concat([
    "lib/episode-plan-v1-vocabulary.js",
    "lib/episode-plan-v1-persistence-migration.js",
    "lib/page-shell-create.js",
    "lib/page-vnext-assemble.js"
  ]);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, libs);
  loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
  vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, {
    filename: "app.js"
  });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected production __PRISM_TEST_API");
  return { api, sandbox, storage, localStorage, windowStub };
}

test("bundle is workflow storage, not a page-render certification fixture", () => {
  const bundle = loadBundle();
  assert.equal(bundle.storageKeys.workflows, "promptr.workflows.v1");
  assert.equal(bundle.storageKeys.runstate, "promptr.workflows.runstate.v1");
  assert.equal(bundle.workflows.length, 1);
  assert.match(bundle.workflows[0].name, /Heteroscedasticity/i);
  assert.ok(bundle.runstate[bundle.workflows[0].id]);
  assert.equal(
    path.basename(path.dirname(bundlePath)),
    "heteroscedasticity-interactive-storage"
  );
});

test("production runstate loader migrates compressed Episode Plan to FunctionEnum", () => {
  const bundle = loadBundle();
  const workflowId = bundle.workflows[0].id;
  const { api, storage } = loadProductionApiWithStorage(bundle);

  // Force reload path used by interactive app.
  const store = api.loadWorkflowRunStateStoreForTest
    ? api.loadWorkflowRunStateStoreForTest()
    : JSON.parse(storage[bundle.storageKeys.runstate]);

  // Prefer explicit API when available; otherwise re-parse migrated storage.
  let migratedStore = store;
  if (typeof api.loadWorkflowRunStateStoreForTest === "function") {
    migratedStore = api.loadWorkflowRunStateStoreForTest();
  } else {
    // Call through restore which reads loadWorkflowRunStateStore.
    api.setWorkflowsForTest(bundle.workflows);
    api.setSelectedWorkflowIdForTest(workflowId);
    if (typeof api.restoreWorkflowRunStateForWorkflowForTest === "function") {
      api.restoreWorkflowRunStateForWorkflowForTest(workflowId);
    }
    migratedStore = JSON.parse(storage[bundle.storageKeys.runstate]);
  }

  const rec = migratedStore[workflowId];
  assert.ok(rec, "runstate record present for workflow id");
  const ep = JSON.parse(rec.capturedOutputsRaw["step-ep"]);
  ep.activities.forEach(function (activity) {
    assert.deepEqual(
      activity.episode_plan.beats.map(function (b) {
        return b.function;
      }),
      EXPECTED[activity.activity_id].slice()
    );
  });
});

test("interactive assemble+render path succeeds from migrated workflow storage", () => {
  const bundle = loadBundle();
  const workflow = bundle.workflows[0];
  const { api, storage } = loadProductionApiWithStorage(bundle);

  // Ensure persistence migration ran and was written back.
  if (typeof api.loadWorkflowRunStateStoreForTest === "function") {
    api.loadWorkflowRunStateStoreForTest();
  } else {
    // Touch storage via migration module + save through localStorage write already done by app load?
    const migrated = migration.migrateRunStateStore(bundle.runstate);
    storage[bundle.storageKeys.runstate] = JSON.stringify(migrated.store);
  }

  api.setWorkflowsForTest([workflow]);
  api.setSelectedWorkflowIdForTest(workflow.id);
  const rec = JSON.parse(storage[bundle.storageKeys.runstate])[workflow.id];
  api.setWorkflowRunCapturedOutputsForTest(rec.capturedOutputs);
  api.setWorkflowRunCapturedOutputsRawForTest(rec.capturedOutputsRaw);

  const seed = JSON.parse(
    loadBundle().runstate[workflow.id].capturedOutputsRaw["step-dp"]
  );
  // Pre-migration seed still has compressed functions; production path must migrate.
  assert.equal(seed.activities[0].episode_plan.beats[2].function, "check_understanding");

  const assembled = api.resolvePageForRenderOrAssembly(seed, workflow, {
    captures: rec.capturedOutputs,
    capturesRaw: rec.capturedOutputsRaw
  });
  assert.equal(assembled.artifact_type, "page");
  assembled.activities.forEach(function (activity) {
    assert.deepEqual(
      activity.episode_plan.beats.map(function (b) {
        return b.function;
      }),
      EXPECTED[activity.activity_id].slice()
    );
  });

  const built = buildPageModel(assembled);
  assert.equal(built.ok, true, JSON.stringify(built.errors));
  built.diagnostics.archetypeInspection.forEach(function (insp) {
    assert.equal(insp.validationRoute, "canonical-grammar");
    assert.equal(insp.runtimeAuthority, "shared-archetype-grammar");
  });
  assert.deepEqual(validatePageModel(assembled, built.model).errors, []);

  const nodeRender = renderLearnerPageHtml(assembled, { compositionMode: "moments" });
  assert.equal(nodeRender.error, null);
  assert.ok(nodeRender.html && nodeRender.html.length > 1000);

  const pipeline = api.runUtilityPageExportPipelineForTest(seed, {
    workflow: workflow,
    captures: rec.capturedOutputs,
    capturesRaw: rec.capturedOutputsRaw,
    rendererVersion: "vnext",
    compositionMode: "moments",
    applyCompositionValidation: false
  });
  assert.equal(pipeline.error, null, pipeline.error);
  assert.match(pipeline.html, /data-renderer="vnext"/);
});

test("workflow-backed page render preserves stable persistence identity", () => {
  const bundle = loadBundle();
  const workflow = bundle.workflows[0];
  const { api, sandbox, storage } = loadProductionApiWithStorage(bundle);

  api.loadWorkflowRunStateStoreForTest();
  api.setWorkflowsForTest([workflow]);
  api.setSelectedWorkflowIdForTest(workflow.id);
  const rec = JSON.parse(storage[bundle.storageKeys.runstate])[workflow.id];
  api.setWorkflowRunCapturedOutputsForTest(rec.capturedOutputs);
  api.setWorkflowRunCapturedOutputsRawForTest(rec.capturedOutputsRaw);

  const seed = JSON.parse(rec.capturedOutputsRaw["step-dp"]);
  const before = {
    workflowId: workflow.id,
    workflowSlug: workflow.slug || null,
    workflowName: workflow.name,
    pageWorkflowId: seed.workflow_id || (seed.metadata && seed.metadata.workflow_id) || null,
    pageId: seed.page_id || (seed.metadata && seed.metadata.page_id) || null
  };
  assert.equal(before.pageWorkflowId, null, "seed capture must lack workflow identity (precondition)");
  assert.equal(before.pageId, null, "seed capture must lack page identity (precondition)");

  const assembled = api.resolvePageForRenderOrAssembly(seed, workflow, {
    captures: rec.capturedOutputs,
    capturesRaw: rec.capturedOutputsRaw
  });

  assert.equal(assembled.workflow_id, workflow.id);
  assert.equal(assembled.metadata.workflow_id, workflow.id);
  assert.equal(assembled.page_id, "learner-page");
  assert.equal(assembled.metadata.page_id, "learner-page");

  const identity = sandbox.window.PRISM_LEARNER_RENDERER_VNEXT.buildLearnerDraftPageIdentity(
    assembled
  );
  assert.equal(identity.unstable, false);
  assert.equal(identity.components.workflowId, workflow.id);
  assert.equal(identity.components.pageId, "learner-page");
  assert.ok(!String(identity.pageKey).includes("no-workflow"));
  assert.ok(!String(identity.pageKey).includes("no-page-id"));
  assert.match(identity.storageKey, new RegExp("^learner-renderer-vnext:draft:"));
  assert.match(identity.pageKey, new RegExp(workflow.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(identity.pageKey, /learner-page/);

  const identityAgain = sandbox.window.PRISM_LEARNER_RENDERER_VNEXT.buildLearnerDraftPageIdentity(
    assembled
  );
  assert.equal(identity.pageKey, identityAgain.pageKey);
  assert.equal(identity.storageKey, identityAgain.storageKey);

  const pipeline = api.runUtilityPageExportPipelineForTest(seed, {
    workflow: workflow,
    captures: rec.capturedOutputs,
    capturesRaw: rec.capturedOutputsRaw,
    rendererVersion: "vnext",
    compositionMode: "moments",
    applyCompositionValidation: false
  });
  assert.equal(pipeline.error, null, pipeline.error);
  assert.match(
    pipeline.html,
    new RegExp(
      'data-persistence-page-key="[^"]*' +
        workflow.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
        '[^"]*"'
    )
  );
  assert.match(pipeline.html, /data-persistence-page-key="[^"]*learner-page[^"]*"/);
  assert.doesNotMatch(pipeline.html, /data-persistence-page-key="[^"]*no-workflow[^"]*"/);
  assert.doesNotMatch(pipeline.html, /data-persistence-page-key="[^"]*no-page-id[^"]*"/);
  assert.doesNotMatch(pipeline.html, /data-persistence-identity-unstable="true"/);
});

test("activity divider CSS separates consecutive activities only", () => {
  const bundle = loadBundle();
  const workflow = bundle.workflows[0];
  const { api, storage } = loadProductionApiWithStorage(bundle);

  api.loadWorkflowRunStateStoreForTest();
  api.setWorkflowsForTest([workflow]);
  api.setSelectedWorkflowIdForTest(workflow.id);
  const rec = JSON.parse(storage[bundle.storageKeys.runstate])[workflow.id];
  api.setWorkflowRunCapturedOutputsForTest(rec.capturedOutputs);
  api.setWorkflowRunCapturedOutputsRawForTest(rec.capturedOutputsRaw);

  const seed = JSON.parse(rec.capturedOutputsRaw["step-dp"]);
  const pipeline = api.runUtilityPageExportPipelineForTest(seed, {
    workflow: workflow,
    captures: rec.capturedOutputs,
    capturesRaw: rec.capturedOutputsRaw,
    rendererVersion: "vnext",
    compositionMode: "moments",
    applyCompositionValidation: false
  });
  assert.equal(pipeline.error, null, pipeline.error);
  const html = pipeline.html;

  assert.match(
    html,
    /\.util-learner-renderer-vnext\s+\.util-activity\s*\+\s*\.util-activity\s*\{[^}]*border-top:\s*1px\s+solid\s+#e5e7eb/
  );
  assert.match(
    html,
    /\.util-learner-renderer-vnext\s+\.util-activity\s*\+\s*\.util-activity\s*\{[^}]*margin-top:\s*4rem/
  );
  assert.match(
    html,
    /\.util-learner-renderer-vnext\s+\.util-activity\s*\+\s*\.util-activity\s*\{[^}]*padding-top:\s*3rem/
  );

  const activityArticles = html.match(/<article class="util-activity[^"]*"/g) || [];
  assert.equal(activityArticles.length, 5);
  ["A1", "A2", "A3", "A4", "A5"].forEach(function (id) {
    assert.match(html, new RegExp('id="activity-' + id + '"'));
  });

  // Adjacent-sibling rule must not invent a leading divider before the first activity.
  assert.doesNotMatch(
    html,
    /\.util-learning-activities\s*>\s*\.util-activity\s*:\s*first-child[^{]*\{[^}]*border-top/
  );
  assert.doesNotMatch(html, /data-composition-mode="beats"/);
  assert.match(html, /data-renderer="vnext"/);
  assert.match(html, /data-composition-moment="do"/);
});

test("argument_structure_hint renders before A5 evaluative workspace from workflow data", () => {
  const bundle = loadBundle();
  const workflow = bundle.workflows[0];
  const { api, sandbox, storage } = loadProductionApiWithStorage(bundle);

  api.loadWorkflowRunStateStoreForTest();
  api.setWorkflowsForTest([workflow]);
  api.setSelectedWorkflowIdForTest(workflow.id);
  const rec = JSON.parse(storage[bundle.storageKeys.runstate])[workflow.id];
  api.setWorkflowRunCapturedOutputsForTest(rec.capturedOutputs);
  api.setWorkflowRunCapturedOutputsRawForTest(rec.capturedOutputsRaw);

  const seed = JSON.parse(rec.capturedOutputsRaw["step-dp"]);
  const assembled = api.resolvePageForRenderOrAssembly(seed, workflow, {
    captures: rec.capturedOutputs,
    capturesRaw: rec.capturedOutputsRaw
  });
  const a5 = assembled.activities.find(function (row) {
    return row.activity_id === "A5";
  });
  assert.ok(a5);
  const hintText = String(a5.argument_structure_hint || "").trim();
  assert.match(
    hintText,
    /State the issue, apply evaluation criteria, weigh trade-offs/
  );

  const built = buildPageModel(assembled);
  assert.equal(built.ok, true, JSON.stringify(built.errors));
  const a5Model = built.model.activities.find(function (row) {
    return row.id === "A5";
  });
  const mappedPrompt = (a5Model.beats || [])
    .flatMap(function (beat) {
      return beat.prompts || [];
    })
    .find(function (prompt) {
      return prompt.sourceField === "argument_structure_hint";
    });
  assert.ok(mappedPrompt, "hint must bind onto a beat in the page model");
  assert.equal(mappedPrompt.text, hintText);
  assert.equal(
    (built.warnings || []).some(function (row) {
      return (
        row.code === "UNMAPPED_OPTIONAL_PROMPT" &&
        row.details &&
        row.details.sourceField === "argument_structure_hint"
      );
    }),
    false
  );

  const pipeline = api.runUtilityPageExportPipelineForTest(seed, {
    workflow: workflow,
    captures: rec.capturedOutputs,
    capturesRaw: rec.capturedOutputsRaw,
    rendererVersion: "vnext",
    compositionMode: "moments",
    applyCompositionValidation: false
  });
  assert.equal(pipeline.error, null, pipeline.error);
  const html = pipeline.html;

  const a5Start = html.indexOf('id="activity-A5"');
  const a5End = html.indexOf('id="activity-', a5Start + 1);
  const a5Html = html.slice(a5Start, a5End > a5Start ? a5End : html.length);
  assert.match(a5Html, /data-guidance-type="argument_structure_hint"/);
  assert.match(a5Html, /Structure your response/);
  assert.ok(a5Html.includes(hintText), "authored hint text must appear exactly");
  assert.equal(
    (a5Html.match(/data-guidance-type="argument_structure_hint"/g) || []).length,
    1,
    "no duplicate argument_structure_hint"
  );

  const hintIdx = a5Html.indexOf('data-guidance-type="argument_structure_hint"');
  const workspaceIdx = a5Html.indexOf("util-learner-workspace");
  assert.ok(hintIdx >= 0);
  assert.ok(workspaceIdx > hintIdx, "hint must precede the learner workspace");

  assert.match(html, /data-guidance-type="reasoning_orientation"|util-composition-reasoning-orientation/);
  ["A1", "A2", "A3", "A4", "A5"].forEach(function (id) {
    assert.match(html, new RegExp('id="activity-' + id + '"'));
  });
  assert.match(html, /A5-M1/);
  assert.match(html, /data-renderer="vnext"/);
  assert.match(html, /data-composition-moment=/);
  assert.doesNotMatch(html, /data-composition-mode="beats"/);

  const identity = sandbox.window.PRISM_LEARNER_RENDERER_VNEXT.buildLearnerDraftPageIdentity(
    assembled
  );
  assert.equal(identity.unstable, false);
  assert.equal(identity.components.workflowId, workflow.id);
  assert.equal(identity.components.pageId, "learner-page");
  assert.match(
    html,
    new RegExp(
      'data-persistence-page-key="[^"]*' +
        workflow.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
        '[^"]*"'
    )
  );

  // Absent field must not invent a hint.
  const withoutHint = JSON.parse(JSON.stringify(assembled));
  delete withoutHint.activities.find(function (row) {
    return row.activity_id === "A5";
  }).argument_structure_hint;
  const absentRender = renderLearnerPageHtml(withoutHint, { compositionMode: "moments" });
  assert.equal(absentRender.error, null, absentRender.error);
  assert.doesNotMatch(
    absentRender.html,
    /data-guidance-type="argument_structure_hint"/
  );
});

test("reintroducing compressed Episode Plan values still fails closed without migration", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "negative",
    activities: [
      {
        activity_id: "A1",
        title: "A1",
        materials: [{ material_id: "A1-M1", type: "text", body: "x" }],
        episode_plan: {
          archetype: "understand",
          beats: [
            { function: "orientation" },
            { function: "explanation" },
            { function: "check_understanding" }
          ]
        }
      }
    ]
  };
  const built = buildPageModel(page);
  assert.equal(built.ok, false);
  assert.ok(
    built.errors.some(function (row) {
      return (
        row.code === "MIXED_EPISODE_PLAN_VOCABULARY" ||
        row.code === "UNKNOWN_EPISODE_PLAN_BEAT"
      );
    })
  );
});
