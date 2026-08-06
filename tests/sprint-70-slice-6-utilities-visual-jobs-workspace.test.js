/**
 * Sprint 70 Slice 6 — Visual Jobs workspace inside Utilities renderer.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const vpc = require("../lib/visual-planning-contract.js");
const planner = require("../lib/prism-visual-jobs-planner.js");
const compiler = require("../lib/prism-image-brief-compiler.js");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const ACTIVITIES = [
  {
    activity_id: "A1",
    learner_task: "Compare inflation drivers using evidence.",
    materials: [
      {
        material_id: "A1-M1",
        material_type: "scenarios",
        body: "## Scenarios\n\nDemand-pull vs cost-push cases."
      }
    ]
  },
  {
    activity_id: "A2",
    learner_task: "Apply CPI calculations.",
    materials: {
      comparison_table: "| Measure | Coverage |\n| --- | --- |\n| CPI | Consumer |"
    }
  }
];

function validActivityGenerate(overrides) {
  return Object.assign(
    {
      affordance_id: "va-A1-generate-01",
      scope: "activity",
      activity_id: "A1",
      visual_decision: "generate",
      visual_slot: "materials-entry",
      tier: "valuable",
      purpose: "classification",
      preferred_representation: "classification_matrix",
      subject: "Inflation mechanism classification cues",
      context: "Visual brief: compare demand-pull and cost-push mechanisms.",
      evidence_anchors: ["A1.learner_task", "A1.materials.scenarios"],
      must_show: ["demand-pull pathway cues"],
      must_not_show: ["scenario answer key"],
      allowed_claims: ["Different causal mechanisms can produce inflation."],
      disallowed_claims: ["All inflation has one cause."],
      rationale: "Classify scenarios by mechanism before the analysis table.",
      pedagogical_added_value: "Adds discriminating cause-type cues.",
      anti_spoiler: true,
      spoiler_boundary: {
        hide_answers: true,
        hide_classification_keys: true,
        hide_model_solution: true,
        allow_structural_hint: true
      },
      representation_avoid: ["filled_worksheet"],
      requires_exact_data_match: false,
      source_basis: "A1 learner_task",
      caption_intent: "Cause-type cues only.",
      discipline_risk_level: "medium",
      reasoning_supported: "Learners classify without completed classifications.",
      learner_stage: "pre_classification",
      canonical_discipline_note: "Empty labelled cause structures only."
    },
    overrides || {}
  );
}

function validDefer() {
  return {
    affordance_id: "va-A2-defer-01",
    scope: "activity",
    activity_id: "A2",
    visual_decision: "defer",
    defer_reason: "worked_example_sufficient_first",
    rationale: "Attempt the worked example before any visual summary.",
    subject: "CPI index discrimination",
    context: "Defer visual until after baseline work.",
    evidence_anchors: ["A2.learner_task"]
  };
}

function validSkip() {
  return {
    affordance_id: "va-A2-skip-01",
    scope: "activity",
    activity_id: "A2",
    visual_decision: "skip",
    skip_reason: "assessment_text_sufficient",
    rationale: "Debrief text is sufficient.",
    subject: "Debrief-only closure",
    context: "Skip visual for debrief-only closure.",
    evidence_anchors: ["A2.learner_task"]
  };
}

function validPageGenerate() {
  const row = validActivityGenerate({
    affordance_id: "va-page-knowledge-summary-01",
    scope: "page",
    region: "knowledge_summary",
    visual_slot: "knowledge-summary-after-content",
    tier: "essential",
    purpose: "synthesis",
    preferred_representation: "concept_map",
    subject: "Knowledge Summary inference map",
    context: "Visual brief: synthesize demand-pull and cost-push links.",
    evidence_anchors: ["page_synthesis.knowledge_summary"],
    learner_stage: "post_reasoning",
    source_basis: "page_synthesis.knowledge_summary",
    reasoning_supported: "Connect drivers, CPI reading, and judgement risks."
  });
  delete row.activity_id;
  return row;
}

function basePage(overrides) {
  return Object.assign(
    {
      artifact_type: "page",
      title: "Inflation workshop",
      visual_affordance_schema_version: "38.4",
      activities_visual_review: [
        { activity_id: "A1", activity_visual_value: { decision: "high", rationale: "Matrix." } },
        { activity_id: "A2", activity_visual_value: { decision: "medium", rationale: "Compare." } }
      ],
      visual_affordances: [
        validActivityGenerate(),
        validDefer(),
        validSkip(),
        validPageGenerate()
      ],
      activities: clone(ACTIVITIES),
      page_synthesis: {
        knowledge_summary: { body: "Core inflation concepts.", format: "markdown" },
        learning_purpose: { body: "Apply CPI reasoning.", format: "markdown" }
      }
    },
    overrides || {}
  );
}

function createElementStub(id) {
  const hidden = new Set();
  const attrs = new Map();
  const listeners = new Map();
  const stub = {
    id,
    value: "",
    textContent: "",
    innerHTML: "",
    srcdoc: "",
    className: "",
    classList: {
      add: (...names) => names.forEach((n) => hidden.add(n)),
      remove: (...names) => names.forEach((n) => hidden.delete(n)),
      contains: (name) => hidden.has(name),
      toggle: (name, force) => {
        if (force === true) hidden.add(name);
        else if (force === false) hidden.delete(name);
        else if (hidden.has(name)) hidden.delete(name);
        else hidden.add(name);
        return hidden.has(name);
      }
    },
    style: {},
    dataset: {},
    children: [],
    appendChild: () => {},
    removeChild: () => {},
    setAttribute: (k, v) => attrs.set(k, String(v)),
    getAttribute: (k) => (attrs.has(k) ? attrs.get(k) : null),
    removeAttribute: (k) => attrs.delete(k),
    addEventListener: (type, fn) => {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(fn);
    },
    removeEventListener: () => {},
    focus: () => {},
    click: function () {
      const fns = listeners.get("click") || [];
      fns.forEach((fn) => fn({ currentTarget: stub }));
    },
    querySelectorAll: function (sel) {
      if (sel === "[data-copy-brief-id]") {
        return stub._copyButtons || [];
      }
      return [];
    },
    dispatchEvent: () => true
  };
  stub._listeners = listeners;
  return stub;
}

function loadPrismTestApiWithWorkspace() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener: () => {},
    createElement: () => createElementStub("dynamic"),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub(id));
      return elementStore.get(id);
    },
    querySelector: () => createElementStub("query"),
    querySelectorAll: () => [],
    body: { appendChild: () => {}, removeChild: () => {} }
  };
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    navigator: { clipboard: { writeText: (text) => Promise.resolve(text) } },
    _: { debounce: (fn) => fn },
    document: documentStub,
    localStorage: { getItem: () => null, setItem: () => {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: sandbox.localStorage,
    URL: { createObjectURL: () => "blob:test", revokeObjectURL: () => {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    },
    navigator: sandbox.navigator
  };
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return { api, elements: elementStore, sandbox };
}

const samplePage = basePage();
const sampleWorkspace = workspace.buildVisualJobsWorkspaceState(samplePage);

// --- Placement / markup ---

test("Slice 6: index.html includes Utilities output view controls in preview panel", () => {
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  assert.match(html, /id="utilitiesOutputViewBar"/);
  assert.match(html, /id="utilitiesOutputViewLearnerBtn"/);
  assert.match(html, /id="utilitiesOutputViewVisualJobsBtn"/);
  assert.match(html, /id="utilitiesOutputViewVideoBtn"/);
  assert.match(html, /id="utilitiesOutputViewResourcesBtn"/);
  assert.match(html, /id="utilitiesVisualJobsPanel"/);
  assert.match(html, /utilities-visual-jobs-workspace\.js/);
  assert.match(html, /id="utilitiesPreviewFrame"/);
  assert.equal((html.match(/id="utilitiesJsonInput"/g) || []).length, 1);
});

test("Slice 6: no new top-level navigation item is added for Graphics tab", () => {
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  assert.doesNotMatch(html, /Graphics[\s\S]{0,80}tab-/i);
  assert.match(html, /id="tabUtilities"/);
  assert.match(
    html,
    /id="tabUtilities"[\s\S]*?>\s*Authoring\s*</
  );
  assert.match(
    html,
    /id="tabWorkflows"[\s\S]*?>\s*My Workflows\s*<\/button>\s*<button id="tabUtilities"/
  );
});

// --- Pipeline integration (module) ---

test("Slice 6: workspace runs contract → planner → compiler on assembled page", () => {
  const page = basePage();
  const ws = workspace.buildVisualJobsWorkspaceState(page);
  assert.ok(ws.contractResult);
  assert.ok(ws.plannerResult);
  assert.ok(ws.compilerResult);
  assert.equal(typeof ws.contractResult.valid, "boolean");
  assert.equal(typeof ws.plannerResult.valid, "boolean");
  assert.equal(typeof ws.compilerResult.valid, "boolean");
  assert.ok(Array.isArray(ws.compilerResult.briefs));
});

test("Slice 6: UI consumes compiler output without recrawling page", () => {
  const page = basePage();
  const ws = workspace.buildVisualJobsWorkspaceState(page);
  const html = workspace.renderVisualJobsWorkspaceHtml(ws);
  const brief = ws.compilerResult.briefs[0];
  assert.ok(brief);
  assert.match(html, /Generate a finished rendered educational image/i);
  assert.match(html, new RegExp(escapeRegex(brief.brief_id)));
  assert.notEqual(workspace.resolveWorkspaceStatus(ws), "no_assembled_page");
});

function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("Slice 6: visual jobs can display when learner rendering fails (workspace independent)", () => {
  const page = basePage();
  const ws = workspace.buildVisualJobsWorkspaceState(page);
  const html = workspace.renderVisualJobsWorkspaceHtml(ws);
  assert.match(html, /util-vj-two-pane/);
  assert.ok(ws.compilerResult.briefs.length >= 1);
});

// --- View model / cards ---

test("Slice 6: one brief renders one card in compiler order", () => {
  const ws = sampleWorkspace;
  const vm = workspace.buildVisualJobsWorkspaceViewModel(ws);
  assert.equal(vm.briefCards.length, ws.compilerResult.briefs.length);
  vm.briefCards.forEach((card, i) => {
    assert.equal(card.brief_id, ws.compilerResult.briefs[i].brief_id);
  });
  const html = workspace.renderVisualJobsWorkspaceHtml(ws);
  const itemCount = (html.match(/data-brief-select-id=/g) || []).length;
  assert.equal(itemCount, ws.compilerResult.briefs.length);
});

test("Slice 6: activity and page scoped cards have readable location labels", () => {
  const vm = workspace.buildVisualJobsWorkspaceViewModel(sampleWorkspace);
  const activityCard = vm.briefCards.find((c) => c.scope === "activity");
  const pageCard = vm.briefCards.find((c) => c.scope === "page");
  assert.ok(activityCard);
  assert.ok(pageCard);
  assert.match(activityCard.location_label, /Activity A1/);
  assert.match(pageCard.location_label, /Page/i);
  assert.match(activityCard.location_label, /Materials entry/);
  assert.equal(activityCard.representation_label, "Classification Matrix");
});

test("Slice 6: card shows purpose, subject, pedagogical rationale and constraints", () => {
  const vm = workspace.buildVisualJobsWorkspaceViewModel(sampleWorkspace);
  const card = vm.briefCards[0];
  assert.ok(card.purpose_text);
  assert.ok(card.title);
  assert.ok(card.human_prompt);
  assert.ok(Array.isArray(card.must_show));
  assert.ok(Array.isArray(card.must_not_show));
  assert.ok(Array.isArray(card.allowed_claims));
  assert.ok(Array.isArray(card.disallowed_claims));
  assert.equal(typeof card.anti_spoiler, "boolean");
  assert.ok(card.spoiler_boundary);
  assert.ok(card.caption_intent);
  const html = workspace.renderVisualJobsWorkspaceHtml(sampleWorkspace);
  assert.match(html, /Developer and debug details/);
  assert.match(html, /Selected image job/);
  assert.match(html, /Asset association metadata/);
  assert.match(html, /Different causal mechanisms can produce inflation/);
});

test("Slice 6: empty allowed claims remains explicit in constraints", () => {
  const ws = clone(workspace.buildVisualJobsWorkspaceState(basePage()));
  ws.compilerResult.briefs[0].claim_constraints = { allowed: [], disallowed: ["All inflation has one cause."] };
  const html = workspace.renderVisualJobsWorkspaceHtml(ws);
  assert.doesNotMatch(html, /Supported claim boundary:/);
});

test("Slice 6: evidence records remain separate with anchors", () => {
  const vm = workspace.buildVisualJobsWorkspaceViewModel(sampleWorkspace);
  const card = vm.briefCards.find((c) => c.source_evidence && c.source_evidence.length);
  assert.ok(card);
  const before = clone(card.source_evidence);
  const html = workspace.renderVisualJobsWorkspaceHtml(sampleWorkspace);
  assert.match(html, /<h6>Evidence<\/h6>/);
  card.source_evidence.forEach((src) => {
    assert.ok(src.anchor);
  });
  assert.deepEqual(card.source_evidence, before);
});

// --- Copy prompt ---

test("Slice 6: canonical generation_instruction remains retrievable byte-for-byte", async () => {
  const brief = sampleWorkspace.compilerResult.briefs[0];
  const instruction = workspace.getBriefGenerationInstruction(sampleWorkspace, brief.brief_id);
  assert.equal(instruction, brief.generation_instruction);
  let copied = "";
  const result = await workspace.copyVisualJobPrompt(instruction, {
    writeText: (text) => {
      copied = text;
      return Promise.resolve();
    }
  });
  assert.equal(result.ok, true);
  assert.equal(copied, brief.generation_instruction);
  assert.equal(copied, instruction);
});

test("Slice 6: copy failure leaves prompt available (no mutation)", async () => {
  const brief = sampleWorkspace.compilerResult.briefs[0];
  const before = clone(brief);
  const result = await workspace.copyVisualJobPrompt(brief.generation_instruction, null);
  assert.equal(result.ok, false);
  assert.deepEqual(brief, before);
});

// --- Diagnostics states ---

test("Slice 6: no assembled page empty state", () => {
  const html = workspace.renderVisualJobsWorkspaceHtml(workspace.emptyWorkspaceState());
  assert.match(html, /Assemble or preview a page to see its graphics jobs/);
  assert.doesNotMatch(html, /util-vj-two-pane/);
});

test("Slice 6: legacy page unavailable state", () => {
  const legacy = { artifact_type: "page", title: "Legacy", activities: ACTIVITIES };
  const ws = workspace.buildVisualJobsWorkspaceState(legacy);
  const html = workspace.renderVisualJobsWorkspaceHtml(ws);
  assert.match(html, /does not contain authoritative visual planning/);
});

test("Slice 6: zero generate jobs state", () => {
  const page = basePage({
    visual_affordances: [validDefer(), validSkip()]
  });
  const ws = workspace.buildVisualJobsWorkspaceState(page);
  const html = workspace.renderVisualJobsWorkspaceHtml(ws);
  assert.match(html, /No external images are required for this page/);
});

test("Slice 6: contract errors show stable codes", () => {
  const page = basePage();
  delete page.visual_affordances[0].learner_stage;
  const ws = workspace.buildVisualJobsWorkspaceState(page);
  const html = workspace.renderVisualJobsWorkspaceHtml(ws);
  assert.match(html, /Visual planning contract/);
  assert.match(html, /util-vj-code/);
  assert.doesNotMatch(html, /data-copy-brief-id=/);
});

test("Slice 6: defer and skip counts appear in summary", () => {
  const html = workspace.renderVisualJobsWorkspaceHtml(sampleWorkspace);
  assert.match(html, /deferred/i);
  assert.match(html, /skipped/i);
  assert.match(html, /Other visual decisions/);
});

// --- App integration ---

test("Slice 6: app test hooks build and render workspace from assembled page", () => {
  const { api } = loadPrismTestApiWithWorkspace();
  const page = basePage();
  const ws = api.buildVisualJobsWorkspaceStateForTest(page, { activeView: "learner_page" });
  assert.ok(ws.assembledPageSnapshot);
  assert.ok(ws.compilerResult);
  assert.equal(api.getUtilitiesOutputViewForTest(), "learner_page");
  api.setUtilitiesOutputViewForTest("visual_jobs");
  assert.equal(api.getUtilitiesOutputViewForTest(), "visual_jobs");
  const html = api.renderVisualJobsWorkspaceForTest();
  assert.match(html, /Graphics/);
  assert.match(html, /util-vj-two-pane/);
});

test("Slice 6: switching views does not reassemble or mutate JSON input", () => {
  const { api, elements } = loadPrismTestApiWithWorkspace();
  const page = basePage();
  const jsonEl = elements.get("utilitiesJsonInput");
  jsonEl.value = JSON.stringify(page);
  api.buildVisualJobsWorkspaceStateForTest(page);
  const wsBefore = api.getUtilitiesOutputWorkspaceForTest();
  api.setUtilitiesOutputViewForTest("visual_jobs");
  api.setUtilitiesOutputViewForTest("learner_page");
  const wsAfter = api.getUtilitiesOutputWorkspaceForTest();
  assert.deepEqual(wsAfter.compilerResult, wsBefore.compilerResult);
  assert.equal(jsonEl.value, JSON.stringify(page));
});

test("Slice 6: Graphics, Video, and Resources count labels always show counts", () => {
  const { api } = loadPrismTestApiWithWorkspace();
  const page = basePage();
  api.buildVisualJobsWorkspaceStateForTest(page);
  const count = api.getUtilitiesOutputWorkspaceForTest().compilerResult.briefs.length;
  assert.equal(api.getUtilitiesOutputViewVisualJobsLabelForTest(), "Graphics (" + count + ")");
  assert.equal(api.getUtilitiesOutputViewVideoLabelForTest(), "Video (0)");
  assert.equal(api.getUtilitiesOutputViewResourcesLabelForTest(), "Resources (0)");
});

test("Slice 6: Clear removes visual workspace state", () => {
  const { api } = loadPrismTestApiWithWorkspace();
  const page = basePage();
  api.buildVisualJobsWorkspaceStateForTest(page);
  api.handleUtilitiesClearForTest();
  const ws = api.getUtilitiesOutputWorkspaceForTest();
  assert.equal(ws.assembledPageSnapshot, null);
  assert.equal(api.getUtilitiesVisualJobsPanelHtmlForTest(), "");
});

test("Slice 6: view visibility toggles iframe and visual jobs panel", () => {
  const { api } = loadPrismTestApiWithWorkspace();
  api.buildVisualJobsWorkspaceStateForTest(basePage());
  api.setUtilitiesOutputViewForTest("visual_jobs");
  assert.equal(api.getUtilitiesPreviewFrameHiddenForTest(), true);
  assert.equal(api.getUtilitiesVisualJobsPanelHiddenForTest(), false);
  api.setUtilitiesOutputViewForTest("learner_page");
  assert.equal(api.getUtilitiesPreviewFrameHiddenForTest(), false);
  assert.equal(api.getUtilitiesVisualJobsPanelHiddenForTest(), true);
});

test("Slice 6: copyVisualJobPromptForTest copies human prompt by default", async () => {
  const { api } = loadPrismTestApiWithWorkspace();
  const page = basePage();
  api.buildVisualJobsWorkspaceStateForTest(page);
  const briefId = api.getUtilitiesOutputWorkspaceForTest().compilerResult.briefs[0].brief_id;
  const expected = workspace.buildVisualJobHumanPrompt(
    api.getUtilitiesOutputWorkspaceForTest().compilerResult.briefs[0]
  );
  let copied = "";
  await api.copyVisualJobPromptForTest(briefId, {
    writeText: (text) => {
      copied = text;
      return Promise.resolve();
    }
  });
  assert.equal(copied, expected);
  assert.doesNotMatch(copied, /^\{/);
});

test("Slice 6: copyVisualJobCanonicalPromptForTest copies generation_instruction exactly", async () => {
  const { api } = loadPrismTestApiWithWorkspace();
  const page = basePage();
  api.buildVisualJobsWorkspaceStateForTest(page);
  const briefId = api.getUtilitiesOutputWorkspaceForTest().compilerResult.briefs[0].brief_id;
  const expected = api
    .getUtilitiesOutputWorkspaceForTest()
    .compilerResult.briefs.find((b) => b.brief_id === briefId).generation_instruction;
  let copied = "";
  await api.copyVisualJobCanonicalPromptForTest(briefId, {
    writeText: (text) => {
      copied = text;
      return Promise.resolve();
    }
  });
  assert.equal(copied, expected);
  assert.doesNotMatch(copied, /^openai/i);
});

test("Slice 6: pipeline public APIs receive expected inputs", () => {
  const page = basePage();
  const contractResult = vpc.validateVisualPlanningContract(page);
  const plannerResult = planner.planPrismVisualJobs(page);
  const compilerResult = compiler.compilePrismImageBriefs(plannerResult);
  assert.equal(typeof contractResult.valid, "boolean");
  assert.ok(Array.isArray(plannerResult.jobs) || plannerResult.valid === false);
  assert.ok(Array.isArray(compilerResult.briefs));
});

test("Slice 6: accessibility hooks on view controls and copy buttons", () => {
  const { api } = loadPrismTestApiWithWorkspace();
  api.buildVisualJobsWorkspaceStateForTest(basePage());
  api.setUtilitiesOutputViewForTest("visual_jobs");
  const html = api.getUtilitiesVisualJobsPanelHtmlForTest();
  assert.match(html, /role="listbox"/);
  assert.match(html, /aria-selected="true"/);
  assert.match(html, /data-image-dropzone-brief-id=/);
  assert.match(html, /Copy Canonical Prompt/);
  assert.match(html, /Copy Prompt/);
});
