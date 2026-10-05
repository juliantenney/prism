const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

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
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
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
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

const api = loadPrismTestApi();

test("composition metadata: non-sequencing rows remain untouched", () => {
  const page = {
    sections: [
      {
        section_id: "learning_activities",
        content: [
          {
            activity_id: "A2",
            title: "Concept discussion",
            learner_task: "Discuss the concept in pairs."
          }
        ]
      }
    ]
  };
  const before = JSON.stringify(page);
  const touched = api.applySequencingInteractionMetadataToPageActivities(page, []);
  assert.equal(touched, 0);
  assert.equal(JSON.stringify(page), before);
});

test("composition metadata: deterministic learner order is stable across runs", () => {
  const mkPage = () => ({
    title: "Ranking task",
    metadata: { workflow_id: "wf-rank-1" },
    sections: [
      {
        section_id: "learning_activities",
        content: [{ activity_id: "A9", learner_task: "Rank these from highest to lowest." }]
      }
    ]
  });
  const upstream = [{ activity_id: "A9", activity_interaction_type: "ranking", correct_order: ["R1", "R2", "R3", "R4"] }];

  const p1 = mkPage();
  const p2 = mkPage();
  api.applySequencingInteractionMetadataToPageActivities(p1, upstream);
  api.applySequencingInteractionMetadataToPageActivities(p2, upstream);
  assert.deepEqual(
    Array.from(p1.sections[0].content[0].ordering.learner_display_order),
    Array.from(p2.sections[0].content[0].ordering.learner_display_order)
  );
});
