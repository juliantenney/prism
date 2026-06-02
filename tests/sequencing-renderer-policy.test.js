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

function buildSequencingPage() {
  return {
    artifact_type: "page",
    title: "Sequencing test page",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        content: [
          {
            activity_id: "A1",
            title: "Chronology challenge",
            activity_interaction_type: "sequencing",
            ordering: {
              canonical_order: ["Event A", "Event B", "Event C"],
              learner_display_order: ["Event C", "Event A", "Event B"]
            },
            learner_task: "Arrange the events into chronological order.",
            learner_instructions: ["Event A", "Event B", "Event C"],
            materials: {
              task_cards: [
                { title: "Event A", instruction: "DETAIL_A_ONLY" },
                { title: "Event B", instruction: "DETAIL_B_ONLY" },
                { title: "Event C", instruction: "DETAIL_C_ONLY" }
              ]
            }
          }
        ]
      },
      {
        section_id: "learning_sequence",
        content: [
          {
            activity_id: "A1",
            start_minute: 0,
            duration_minutes: 15,
            learner_actions: "Sequence the events."
          }
        ]
      }
    ]
  };
}

test("policy enabled: task-card ordering follows learner_display_order", () => {
  const row = {
    activity_interaction_type: "sequencing",
    ordering: {
      canonical_order: ["Event A", "Event B", "Event C"],
      learner_display_order: ["Event C", "Event A", "Event B"]
    }
  };
  const cards = [
    { title: "Event A", instruction: "DETAIL_A_ONLY" },
    { title: "Event B", instruction: "DETAIL_B_ONLY" },
    { title: "Event C", instruction: "DETAIL_C_ONLY" }
  ];
  const ordered = api.orderTaskCardItemsForRender(
    cards,
    row,
    { sequencingPolicy: { enabled: true, strictLearnerMode: true, allowLegacyInference: true } },
    "learner"
  );
  assert.equal(ordered[0].title, "Event C");
  assert.equal(ordered[1].title, "Event A");
  assert.equal(ordered[2].title, "Event B");
});

test("policy enabled: duplicate learner instruction list suppression decision is true when cards match", () => {
  const row = {
    activity_interaction_type: "sequencing",
    ordering: {
      canonical_order: ["Event A", "Event B", "Event C"],
      learner_display_order: ["Event C", "Event A", "Event B"]
    }
  };
  const suppress = api.shouldSuppressInstructionList(
    row,
    {
      task_cards: [
        { title: "Event A", instruction: "..." },
        { title: "Event B", instruction: "..." },
        { title: "Event C", instruction: "..." }
      ]
    },
    ["Event A", "Event B", "Event C"],
    { sequencingPolicy: { enabled: true, strictLearnerMode: true, allowLegacyInference: true } },
    "learner"
  );
  assert.equal(suppress, true);
});

test("policy disabled: existing behavior unchanged (instruction list remains)", () => {
  const page = buildSequencingPage();
  const r = api.buildUtilityStructuredHtmlForTest(page, ["sections"], {});
  const html = r.html || "";
  assert.match(html, /<li>\s*Event A\s*<\/li>/i);
  assert.match(html, /<li>\s*Event B\s*<\/li>/i);
  assert.match(html, /<li>\s*Event C\s*<\/li>/i);
});

test("non-sequencing rows unchanged even when policy enabled", () => {
  const page = {
    artifact_type: "page",
    title: "Discussion page",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        content: [
          {
            activity_id: "D1",
            activity_interaction_type: "discussion",
            learner_task: "Discuss in pairs.",
            learner_instructions: ["Point 1", "Point 2"],
            materials: {
              task_cards: [
                { title: "Point 1", instruction: "Detail 1" },
                { title: "Point 2", instruction: "Detail 2" }
              ]
            }
          }
        ]
      },
      {
        section_id: "learning_sequence",
        content: [{ activity_id: "D1", start_minute: 0, duration_minutes: 10 }]
      }
    ]
  };
  const r = api.buildUtilityStructuredHtmlForTest(page, ["sections"], {
    sequencingPolicy: { enabled: true, strictLearnerMode: true, allowLegacyInference: true }
  });
  const html = r.html || "";
  assert.match(html, /<li>\s*Point 1\s*<\/li>/i);
  assert.match(html, /<li>\s*Point 2\s*<\/li>/i);
});

test("legacy rows degrade safely when policy enabled", () => {
  const page = {
    artifact_type: "page",
    title: "Legacy page",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        content: [
          {
            activity_id: "L1",
            learner_task: "Put these in order.",
            learner_instructions: ["Alpha", "Beta", "Gamma"],
            materials: {
              task_cards: [
                { title: "Alpha", instruction: "Alpha detail" },
                { title: "Beta", instruction: "Beta detail" },
                { title: "Gamma", instruction: "Gamma detail" }
              ]
            }
          }
        ]
      },
      {
        section_id: "learning_sequence",
        content: [{ activity_id: "L1", start_minute: 0, duration_minutes: 10 }]
      }
    ]
  };
  const r = api.buildUtilityStructuredHtmlForTest(page, ["sections"], {
    sequencingPolicy: { enabled: true, strictLearnerMode: true, allowLegacyInference: true }
  });
  assert.equal(typeof (r.html || ""), "string");
  assert.match(r.html || "", /Alpha detail/i);
});
