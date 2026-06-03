/* One-off structure probe for 36-1 — not a CI test */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const repo = path.resolve(__dirname, "../../../../../");
const app = fs.readFileSync(path.join(repo, "app.js"), "utf8");
function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() { return false; } },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() { return null; },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {}
  };
}
const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (f) => f } };
const elementStore = new Map();
const doc = {
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
sandbox.document = doc;
const windowStub = {
  document: doc,
  addEventListener() {},
  removeEventListener() {},
  location: { hash: "", pathname: "/" },
  _: sandbox._,
  Utils: { debounce: (f) => f },
  localStorage: { getItem: () => null, setItem() {} },
  URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
  Blob: function Blob() {},
  Library: {
    importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
    getAllPrompts: () => Promise.resolve([])
  }
};
windowStub.window = windowStub;
sandbox.window = windowStub;
vm.createContext(sandbox);
vm.runInContext(app, sandbox, { filename: "app.js" });
const api = sandbox.window.__PRISM_TEST_API;
const dir = path.join(repo, "tests/fixtures/page-render");
const fixtures = [
  "confidence-interval-a2-multitable-page.json",
  "marx-self-study-page.json",
  "ld-climate-misconception-discussion-page.json"
];
for (const f of fixtures) {
  const parsed = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  const r = api.buildUtilityStructuredHtmlForTest(parsed);
  const raw = String(r.html || "");
  const body = raw.replace(/<style[\s\S]*?<\/style>/i, "").split('<details class="util-meta"')[0];
  const n = (re) => (body.match(re) || []).length;
  console.log("\n=== " + f + " ===");
  console.log(
    JSON.stringify(
      {
        h2: n(/h2[^>]*util-section-heading/gi),
        activities: n(/<article class="util-task-block">/gi),
        taskPrimary: n(/<div class="util-activity-task util-activity-task--primary">/gi),
        cognition: n(/<div class="util-cognition /gi),
        output: n(/util-output-block/gi),
        support: n(/util-support-note/gi),
        tables: n(/<table>/gi),
        cardGrid: n(/util-card-grid/gi),
        taskCards: n(/util-task-card/gi),
        assessment: n(/util-assessment-item/gi),
        studyTips: /Study tips/i.test(body),
        closureDebrief: n(/### Closure|### Debrief|>Closure:/gi),
        purposeTaskP: n(/<p><strong>Task:<\/strong>/gi),
        framing: n(/util-activity-framing/gi),
        workedExample: n(/util-worked-example/gi),
        templateBlocks: n(/util-material-template/gi)
      },
      null,
      2
    )
  );
}
