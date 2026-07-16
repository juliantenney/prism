/**
 * Beat-first activity rendering driven by activity.episode_plan.beats.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const marxFixturePath = path.join(repoRoot, "tests", "fixtures", "page-render", "marx-beat-render-page.json");
const registry = require("../lib/beat-material-registry.js");

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => false },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
    focus: () => {},
    click: () => {}
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener: () => {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild: () => {}, removeChild: () => {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem: () => {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL: () => {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function activityFromPage(page, activityId) {
  const sec = page.sections.find((s) => s.section_id === "learning_activities");
  return sec.content.find((row) => row.activity_id === activityId);
}

function beatSectionOrder(html, activityScope) {
  const scope = activityScope || html;
  const matches = [...scope.matchAll(/data-episode-function="([^"]+)"/g)];
  return matches.map((m) => m[1]);
}

function beatSectionHtml(html, fn, activityScope) {
  const scope = activityScope || html;
  const re = new RegExp(
    '<section class="util-beat-section" data-episode-function="' + fn + '"[\\s\\S]*?</section>',
    "i"
  );
  const hit = scope.match(re);
  return hit ? hit[0] : "";
}

test("resolveBeatMaterials: A1 maps materials to episode-plan beats", () => {
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const a1 = activityFromPage(page, "A1");
  const diag = registry.buildBeatRenderDiagnostic(a1);
  assert.deepEqual(diag, {
    activity: "A1",
    beats: [
      { beat: "explanation", materials: ["text"] },
      { beat: "worked_thinking", materials: ["worked_example", "sample_output"] },
      { beat: "verification", materials: ["checklist"] }
    ]
  });
});

test("resolveBeatMaterials: A5 maps practice and transfer beats", () => {
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const a5 = activityFromPage(page, "A5");
  const diag = registry.buildBeatRenderDiagnostic(a5);
  assert.deepEqual(diag.beats, [
    { beat: "explanation", materials: ["reference_table"] },
    { beat: "worked_thinking", materials: ["worked_example"] },
    { beat: "guided_practice", materials: ["decision_table", "template"] },
    { beat: "transfer", materials: ["transfer_prompt", "consolidation_summary"] },
    { beat: "verification", materials: ["checklist"] }
  ]);
});

test("renderer: Marx A1 beat sections in episode-plan order", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const r = api.buildUtilityStructuredHtmlForTest(page);
  const html = r.html || "";
  const a1Block = html.match(
    /Historical Materialism and Capitalism[\s\S]*?(?=Surplus Value and Exploitation|Is Marx Still Relevant|$)/i
  );
  assert.ok(a1Block, "expected A1 activity block");
  const a1Html = a1Block[0];
  assert.deepEqual(beatSectionOrder(a1Html), ["explanation", "worked_thinking", "verification"]);
  assert.match(a1Html, /util-beat-ordered-materials/);
  assert.match(beatSectionHtml(a1Html, "explanation"), /Historical Materialism as a Method/);
  assert.match(beatSectionHtml(a1Html, "worked_thinking"), /Worked Example/);
  assert.match(beatSectionHtml(a1Html, "worked_thinking"), /Annotated Sample Explanation/);
  assert.match(beatSectionHtml(a1Html, "verification"), /checklist to review your explanation/i);
  assert.doesNotMatch(a1Html, /Beat 1|Beat 2|Beat 3/i);
  assert.match(a1Html, />Understand</);
  assert.match(a1Html, />See it modelled</);
  assert.match(a1Html, />Check your work</);
});

test("renderer: Marx A5 beat sections group template and transfer materials", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const r = api.buildUtilityStructuredHtmlForTest(page);
  const html = r.html || "";
  const a5Block = html.match(/Is Marx Still Relevant Today\?[\s\S]*$/i);
  assert.ok(a5Block, "expected A5 activity block");
  const a5Html = a5Block[0];
  assert.deepEqual(beatSectionOrder(a5Html), [
    "explanation",
    "worked_thinking",
    "guided_practice",
    "transfer",
    "verification"
  ]);
  const practice = beatSectionHtml(a5Html, "guided_practice");
  assert.match(practice, /Judgement Memo Template/);
  assert.match(practice, /Criterion \| Judgement/);
  const transfer = beatSectionHtml(a5Html, "transfer");
  assert.match(transfer, /transfer_prompt|contemporary economic issue/i);
  assert.match(transfer, /consolidation|take forward/i);
});

test("renderer: beat diagnostics API matches registry resolver", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const a1 = activityFromPage(page, "A1");
  const viaApi = api.buildBeatRenderDiagnosticForTest(a1);
  const viaRegistry = registry.buildBeatRenderDiagnostic(a1);
  assert.equal(JSON.stringify(viaApi), JSON.stringify(viaRegistry));
});
