/**
 * Sprint 69 — interleaved learner-task prompt placement within composed moments.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("vm");

const {
  buildPageModel,
  buildComposedPageModel,
  renderLearnerPageHtml,
  buildLearnerDraftPageIdentity
} = require("../lib/learner-renderer-vnext");
const {
  classifyInstructionPlacement
} = require("../lib/learner-renderer-vnext/compose-moment-classification");
const {
  runPrismLibScriptsInSandbox,
  DEFAULT_LIBS,
  loadLearnerRendererVNextBrowserInSandbox,
  wireBrowserGlobalThis
} = require("./prism-vm-lib-bootstrap");

const repoRoot = path.resolve(__dirname, "..");
const pageFixturePath = path.join(
  __dirname,
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);
const workflowBundlePath = path.join(
  __dirname,
  "fixtures",
  "workflows",
  "heteroscedasticity-interactive-storage",
  "workflow-storage-bundle.json"
);

function loadPageFixture() {
  return JSON.parse(fs.readFileSync(pageFixturePath, "utf8"));
}

function extractActivityHtml(html, activityId) {
  const source = String(html || "");
  const marker = 'id="activity-' + activityId + '"';
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) return "";
  const openTagStart = source.lastIndexOf("<article", markerIndex);
  if (openTagStart < 0) return "";
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

function extractMomentHtml(activityHtml, momentKind) {
  const marker = 'data-composition-moment="' + momentKind + '"';
  const start = activityHtml.indexOf(marker);
  if (start < 0) return "";
  const sectionStart = activityHtml.lastIndexOf("<section", start);
  const next = activityHtml.indexOf('data-composition-moment="', start + marker.length);
  const end = next >= 0 ? activityHtml.lastIndexOf("</section>", next) + 10 : activityHtml.length;
  return activityHtml.slice(sectionStart >= 0 ? sectionStart : start, end);
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
  return { api: sandbox.window.__PRISM_TEST_API, sandbox, storage };
}

test("A1: each task prompt precedes its owned material, reveal, checklist, and workspace", () => {
  const sourcePage = loadPageFixture();
  const rendered = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" });
  assert.equal(rendered.error, null, rendered.error);
  const html = rendered.html;
  const a1 = extractActivityHtml(html, "A1");

  const learn = extractMomentHtml(a1, "learn");
  const doMoment = extractMomentHtml(a1, "do");
  const check = extractMomentHtml(a1, "check");

  const step1 = learn.indexOf('data-source-step-number="1"');
  const m1 = learn.indexOf('data-material-id="A1-M1"');
  const step2 = learn.indexOf('data-source-step-number="2"');
  const m2 = learn.indexOf('data-material-id="A1-M2"');
  const step3 = check.indexOf('data-source-step-number="3"');
  const m3 = check.indexOf('data-material-id="A1-M3"');
  const reveal = check.indexOf('data-reveal-mode="details"');
  const step4 = check.indexOf('data-source-step-number="4"');
  const m4 = check.indexOf('data-material-id="A1-M4"');
  const step5 = doMoment.indexOf('data-source-step-number="5"');
  const expected = doMoment.indexOf('data-source-field="expected_output"');
  const workspace = doMoment.indexOf("util-learner-workspace");

  assert.ok(step1 >= 0 && m1 > step1, "step 1 before A1-M1");
  assert.ok(step2 > m1 && m2 > step2, "step 2 before A1-M2");
  assert.ok(step3 >= 0 && m3 > step3, "step 3 before A1-M3");
  assert.ok(reveal >= 0 && m3 >= 0, "A1-M3 remains a reveal");
  assert.ok(step4 > m3 && m4 > step4, "step 4 before A1-M4 checklist");
  assert.ok(step5 >= 0 && expected > step5 && workspace > expected, "step 5 < EO < workspace");

  [1, 2, 3, 4, 5].forEach(function (step) {
    assert.equal(
      (a1.match(new RegExp('data-source-step-number="' + step + '"', "g")) || []).length,
      1,
      "step " + step + " appears exactly once"
    );
  });
  ["A1-M1", "A1-M2", "A1-M3", "A1-M4"].forEach(function (id) {
    assert.equal((a1.match(new RegExp('data-material-id="' + id + '"', "g")) || []).length, 1);
  });

  assert.match(learn, /data-source-step-number="1"/);
  assert.match(learn, /data-source-step-number="2"/);
  assert.doesNotMatch(learn, /data-source-step-number="5"/);
  assert.match(doMoment, /data-source-step-number="5"/);
  assert.doesNotMatch(doMoment, /data-source-step-number="1"/);
  assert.match(check, /data-source-step-number="3"/);
  assert.match(check, /data-source-step-number="4"/);

  assert.match(a1, /<textarea[^>]*class="util-learner-workspace__input"/);
  assert.match(a1, /data-workspace-kind="text_entry"/);
  assert.match(html, /data-renderer="vnext"/);
  assert.match(html, /data-composition-moment="do"/);
  assert.doesNotMatch(html, /data-composition-mode="beats"/);
  ["A1", "A2", "A3", "A4", "A5"].forEach(function (id) {
    assert.match(html, new RegExp('id="activity-' + id + '"'));
  });
});

test("synthetic fixture: interleaved units cover learn/do/check edge cases", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Synthetic interleave",
    workflow_id: "wf-interleave-1",
    page_id: "learner-page",
    learning_outcomes: [{ id: "LO1", statement: "Explain X." }],
    activities: [
      {
        activity_id: "S1",
        title: "Synthetic activity",
        duration_minutes: 10,
        grouping: "individual",
        mapped_learning_outcomes: ["LO1"],
        activity_preamble: "You will study, check, and write.",
        reasoning_orientation: "Keep criteria explicit.",
        expected_output: "A short justified recommendation.",
        learner_task:
          "1. Study the explanatory text about the concept.\n2. Work through the expert example carefully.\n3. Compare the sample response with your notes.\n4. Complete the self-check using the checklist.\n5. Write a brief independent judgement.",
        materials: [
          {
            material_id: "S1-M1",
            type: "text",
            title: "Concept text",
            body: "Concept body."
          },
          {
            material_id: "S1-M2",
            type: "worked_example",
            title: "Worked example",
            body: "Example body."
          },
          {
            material_id: "S1-M3",
            type: "sample_output",
            title: "Sample response",
            body: "Sample body."
          },
          {
            material_id: "S1-M4",
            type: "checklist",
            title: "Checklist",
            body: "- Criterion one\n- Criterion two"
          },
          {
            material_id: "S1-M5",
            type: "modelling_note",
            title: "Orphan modelling note",
            body: "No dedicated prompt owns this note."
          }
        ],
        episode_plan: {
          archetype: "understand",
          beats: [
            { function: "orientation" },
            { function: "explanation" },
            { function: "verification" }
          ]
        }
      }
    ]
  };

  assert.equal(classifyInstructionPlacement({ text: "Study the explanatory text." }), "learn");
  assert.equal(classifyInstructionPlacement({ text: "Write a brief independent judgement." }), "do");
  assert.equal(
    classifyInstructionPlacement({ text: "Compare the sample response with your notes." }),
    "check"
  );

  const built = buildPageModel(page);
  assert.equal(built.ok, true, JSON.stringify(built.errors));
  const composed = buildComposedPageModel(built, page, { compositionMode: "moments" });
  assert.equal(composed.ok, true, JSON.stringify(composed.errors));
  assert.equal((composed.beatsFallbackActivityIds || []).length, 0);

  const rendered = renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(rendered.error, null, rendered.error);
  const html = rendered.html;
  const activity = extractActivityHtml(html, "S1");

  const step1 = activity.indexOf('data-source-step-number="1"');
  const m1 = activity.indexOf('data-material-id="S1-M1"');
  const step2 = activity.indexOf('data-source-step-number="2"');
  const m2 = activity.indexOf('data-material-id="S1-M2"');
  const orphan = activity.indexOf('data-material-id="S1-M5"');
  const step3 = activity.indexOf('data-source-step-number="3"');
  const m3 = activity.indexOf('data-material-id="S1-M3"');
  const step4 = activity.indexOf('data-source-step-number="4"');
  const m4 = activity.indexOf('data-material-id="S1-M4"');
  const step5 = activity.indexOf('data-source-step-number="5"');
  const expected = activity.indexOf('data-source-field="expected_output"');
  const workspace = activity.indexOf("util-learner-workspace");

  assert.ok(step1 < m1 && step2 < m2, "multiple prompts interleaved in Learn");
  assert.ok(orphan > m2, "material without prompt still renders after paired units");
  assert.ok(step3 < m3 && activity.indexOf('data-reveal-mode="details"') >= 0, "reveal prompt before reveal");
  assert.ok(step4 < m4, "checklist prompt before checklist");
  assert.ok(step5 < expected && expected < workspace, "expected-output guidance between prompt and workspace");
  assert.match(activity, /data-guidance-type="reasoning_orientation"|util-composition-reasoning-orientation/);
});

test("workflow path: interleaved A1 prompts keep identity and moments renderer", () => {
  const bundle = JSON.parse(fs.readFileSync(workflowBundlePath, "utf8"));
  const workflow = bundle.workflows[0];
  const { api, storage } = loadProductionApiWithStorage(bundle);
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
  const identity = buildLearnerDraftPageIdentity(assembled);
  assert.equal(identity.unstable, false);
  assert.equal(identity.components.workflowId, workflow.id);

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
  const a1 = extractActivityHtml(html, "A1");
  assert.ok(a1.indexOf('data-source-step-number="1"') < a1.indexOf('data-material-id="A1-M1"'));
  assert.ok(a1.indexOf('data-source-step-number="5"') < a1.indexOf("util-learner-workspace"));
  assert.match(html, /data-renderer="vnext"/);
  assert.match(html, /data-composition-moment=/);
  assert.doesNotMatch(html, /data-composition-mode="beats"/);
  assert.match(
    html,
    new RegExp(
      'data-persistence-page-key="[^"]*' +
        workflow.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
        '[^"]*"'
    )
  );
  const a5 = extractActivityHtml(html, "A5");
  const hintIdx = a5.indexOf('data-guidance-type="argument_structure_hint"');
  const wsIdx = a5.indexOf("util-learner-workspace");
  assert.ok(hintIdx >= 0 && wsIdx > hintIdx);
});
