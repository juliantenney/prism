/**
 * Sprint 29-2 — cognition field semantic blocks in Utilities HTML renderer.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const kitchenSinkPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "renderer-kitchen-sink-page.json"
);

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
    getAttribute() {
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {}
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
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem() {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
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
  assert.ok(api);
  return api;
}

function sectionScope(html, headingText) {
  const re = new RegExp(
    headingText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\s\\S]*?(?=<h2|<details class=\"util-meta\"|$)",
    "i"
  );
  const m = html.match(re);
  return m ? m[0] : html;
}

function documentBodyHtml(html) {
  const m = String(html || "").match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return m ? m[1] : String(html || "");
}

function hasCognitionMarkupInBody(html) {
  return /class="util-cognition\b/.test(documentBodyHtml(html));
}

const api = loadPrismTestApi();

test("slice 31-2: cognition blocks remain with softened hierarchy CSS", () => {
  const r = api.buildUtilityStructuredHtmlForTest({
    artifact_type: "page",
    title: "Cognition hierarchy",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            title: "Explain step",
            learner_task: "Write a short explanation.",
            self_explanation_prompt: "State your mechanism in one sentence."
          }
        ]
      }
    ]
  });
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.match(html, /util-cognition/);
  assert.match(html, /data-cognition-field="self_explanation_prompt"/);
  assert.match(html, /State your mechanism in one sentence/);
  assert.match(html, /util-activity-task--primary/);
  assert.match(html, /\.util-cognition__body\{[^}]*font-size:\.875rem/);
  const taskIdx = html.indexOf("util-activity-task--primary");
  const cognitionIdx = html.indexOf('class="util-cognition');
  assert.ok(taskIdx !== -1 && cognitionIdx !== -1);
  assert.ok(taskIdx < cognitionIdx, "primary task precedes cognition block");
});

test("29-2: peer-instruction cognition fields render as labelled util-cognition blocks", () => {
  const page = {
    artifact_type: "page",
    title: "Peer instruction cognition render",
    metadata: {
      cognition_profile: {
        active: true,
        pack_ids: ["peer_instruction_pack"],
        cognition_fields: ["initial_position_prompt", "revision_trigger", "reasoning_revision_prompt"]
      }
    },
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            title: "Predict individually",
            learner_task: "Answer each MCQ on your own first.",
            initial_position_prompt: "Record your first choice before discussion.",
            revision_trigger: "Reconsider after hearing your partner.",
            reasoning_revision_prompt: "Explain how your reasoning changed."
          }
        ]
      }
    ]
  };
  const r = api.buildUtilityStructuredHtmlForTest(page);
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  const activities = sectionScope(html, "Learning Activities");
  assert.match(activities, /util-cognition util-material-role-thinking util-cognition--revision/);
  assert.match(activities, /util-cognition__label/);
  assert.match(activities, /util-cognition__body/);
  assert.match(activities, /data-cognition-field="initial_position_prompt"/);
  assert.match(activities, /Record your first choice before discussion/);
  assert.match(activities, /Explain how your reasoning changed/);
  const cognitionIdx = activities.indexOf('class="util-cognition');
  const materialsDivIdx = activities.search(/<div class="util-activity-materials"/);
  if (materialsDivIdx !== -1) {
    assert.ok(cognitionIdx !== -1 && cognitionIdx < materialsDivIdx, "cognition block should precede materials");
  }
});

test("29-2: misconception repair fields use repair modifier", () => {
  const page = {
    artifact_type: "page",
    title: "Misconception repair render",
    metadata: { cognition_profile: { active: true, pack_ids: ["misconception_repair_pack"] } },
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            title: "Repair workshop",
            learner_task: "Discuss the claim with evidence.",
            misconception_claim: "CO2 cannot warm the planet.",
            reconciliation_prompt: "Reconcile using measured data.",
            evidence_contrast: "Lab record vs anecdote."
          }
        ]
      }
    ]
  };
  const r = api.buildUtilityStructuredHtmlForTest(page);
  assert.ok(r && !r.error);
  const html = sectionScope(String(r.html || ""), "Learning Activities");
  assert.match(html, /util-cognition--repair/);
  assert.match(html, /Misconception claim/);
  assert.match(html, /CO2 cannot warm the planet/);
});

test("29-2: row-level cognition fields skip duplicate materials keys", () => {
  const page = {
    artifact_type: "page",
    title: "Materials dedupe",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            title: "Pair step",
            learner_task: "Discuss with a partner.",
            reasoning_revision_prompt: "Semantic block body text.",
            materials: {
              task_cards: "Card A",
              reasoning_revision_prompt: "Should not appear as generic material heading."
            }
          }
        ]
      }
    ]
  };
  const r = api.buildUtilityStructuredHtmlForTest(page);
  assert.ok(r && !r.error);
  const html = sectionScope(String(r.html || ""), "Learning Activities");
  assert.match(html, /util-cognition__item/);
  assert.match(html, /Semantic block body text/);
  assert.doesNotMatch(html, /Should not appear as generic material heading/);
});

test("29-2: pages without cognition row fields omit util-cognition chrome", () => {
  const kitchen = JSON.parse(fs.readFileSync(kitchenSinkPath, "utf8"));
  const laSection = (kitchen.sections || []).find(function (s) {
    return s && s.section_id === "learning_activities";
  });
  if (laSection && Array.isArray(laSection.content)) {
    laSection.content = laSection.content.filter(function (row) {
      var id = String((row && row.activity_id) || "");
      return id !== "KS-A5" && id !== "KS-A7";
    });
  }
  const r = api.buildUtilityStructuredHtmlForTest(kitchen);
  assert.ok(r && !r.error);
  const html = String(r.html || "");
  assert.equal(hasCognitionMarkupInBody(html), false);
});

test("29-2: plain activity without cognition fields has no util-cognition", () => {
  const page = {
    artifact_type: "page",
    title: "Plain activity",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [{ title: "Read", learner_task: "Read the chapter.", expected_output: "Notes." }]
      }
    ]
  };
  const r = api.buildUtilityStructuredHtmlForTest(page);
  assert.ok(r && !r.error);
  assert.equal(hasCognitionMarkupInBody(String(r.html || "")), false);
});
