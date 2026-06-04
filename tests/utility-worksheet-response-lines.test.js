/**

 * Worksheet response-line semantics — blank markdown lists vs instructional bullets.

 */



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

    classList: {

      add: () => {},

      remove: () => {},

      contains: () => false,

      toggle: () => false

    },

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

  vm.runInContext(source, sandbox, { filename: "app.js" });

  const api = sandbox.window.__PRISM_TEST_API;

  assert.ok(api);

  return api;

}



const api = loadPrismTestApi();



function countResponseLines(html) {

  return (String(html || "").match(/class="util-response-line"/g) || []).length;

}



function activityMaterialsScope(html) {
  const m = String(html || "").match(
    /<div class="util-activity-materials"[^>]*>([\s\S]*?)<\/div>/i
  );
  return m ? m[1] : String(html || "");
}

function assertNoListWrappedWorksheetBlanks(html) {
  const scope = activityMaterialsScope(html);
  assert.doesNotMatch(
    scope,
    /<li[^>]*>(?:(?!<\/li>)[\s\S])*util-worksheet-blank/i,
    "worksheet blank must not appear inside a list item"
  );
}



test("utilityIsWorksheetResponseLineBody: placeholders only", () => {

  assert.equal(api.utilityIsWorksheetResponseLineBodyForTest("________"), true);

  assert.equal(api.utilityIsWorksheetResponseLineBodyForTest("---"), true);

  assert.equal(api.utilityIsWorksheetResponseLineBodyForTest(""), true);

  assert.equal(api.utilityIsWorksheetResponseLineBodyForTest("Compare CPI and GDP deflator"), false);

});



test("markdown block: blank-only hyphen list is response lines not bullets", () => {

  const md =

    "Write a one-sentence definition of inflation.\n\n- ________\n- ________";

  const html = api.utilityRenderMarkdownBlockForTest(md);

  assert.match(html, /Write a one-sentence definition of inflation/i);

  assert.match(html, /util-response-lines/);

  assert.equal(countResponseLines(html), 2);

  assert.doesNotMatch(html, /<ul>/);

  assert.doesNotMatch(html, /<li>/);

  assertNoListWrappedWorksheetBlanks(html);

});



test("markdown block: instructional bullet list for 2–3 bullet points stays ul", () => {

  const md =

    "Write 2–3 bullet points summarising your view.\n\n- First point to develop\n- Second point to develop";

  const html = api.utilityRenderMarkdownBlockForTest(md);

  assert.match(html, /<ul>/);

  assert.match(html, /<li>[\s\S]*First point/i);

  assert.match(html, /<li>[\s\S]*Second point/i);

  assert.doesNotMatch(html, /util-response-lines/);

});



test("markdown block: genuine instructional bullets stay ul/li", () => {

  const md =

    "- Compare CPI and GDP deflator at an introductory level.\n- Note one limitation for each measure.";

  const html = api.utilityRenderMarkdownBlockForTest(md);

  assert.match(html, /<ul>/);

  assert.match(html, /<li>[\s\S]*Compare CPI/i);

  assert.match(html, /<li>[\s\S]*limitation/i);

  assert.doesNotMatch(html, /util-response-lines/);

});



test("markdown block: mixed instructional and blank lines keep bullet list", () => {

  const md = "- Name one group winner.\n- ________";

  const html = api.utilityRenderMarkdownBlockForTest(md);

  assert.match(html, /<ul>/);

  assert.match(html, /<li>/);

  assert.doesNotMatch(html, /util-response-lines/);

});



test("markdown block: numbered blank-only lines render as response lines", () => {

  const md = "1. ________\n2. ________";

  const html = api.utilityRenderMarkdownBlockForTest(md);

  assert.match(html, /util-response-lines/);

  assert.equal(countResponseLines(html), 2);

  assert.doesNotMatch(html, /<ol>/);

  assertNoListWrappedWorksheetBlanks(html);

});



test("live path: template material uses response lines not ul for blank-only bullets", () => {
  const md =
    "Write a one-sentence definition of inflation in your own words.\n\n- ________\n- ________";
  const page = {
    artifact_type: "page",
    title: "Inflation worksheet probe",
    page_profile: "learner",
    constraints_applied: {
      delivery_mode: "live_workshop",
      learning_environments: ["classroom"]
    },
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A1",
            title: "Define inflation",
            learner_task: "Complete the worksheet.",
            materials: { template: md }
          }
        ]
      }
    ]
  };
  const r = api.buildUtilityStructuredHtmlForTest(page);
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.match(html, /one-sentence definition of inflation/i);
  assert.match(html, /util-response-lines/);
  assert.equal(countResponseLines(html), 2);
  assertNoListWrappedWorksheetBlanks(html);
});

test("live path: activity_materials task_cards block matches production merge render", () => {
  const page = {
    artifact_type: "page",
    title: "Inflation workshop",
    page_profile: "learner",
    constraints_applied: {
      delivery_mode: "live_workshop",
      learning_environments: ["classroom"]
    },
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A1",
            title: "Inflation concepts warm-up",
            learner_task: "Complete the task cards.",
            materials: {}
          }
        ]
      },
      {
        section_id: "activity_materials",
        heading: "Activity materials",
        content: [
          {
            activity_id: "A1",
            type: "task_cards",
            content:
              "### Card 1 — Define inflation\nWrite a one-sentence definition of inflation in your own words.\n\n- ________\n- ________\n\n### Card 2 — Spot the price change\nList three prices that increased."
          }
        ]
      }
    ]
  };
  const r = api.buildUtilityStructuredHtmlForTest(page);
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  const cardScope = html.match(/Card 1[\s\S]*?(?=Card 2|$)/i);
  assert.ok(cardScope, "card 1 scope in merged materials render");
  assert.match(cardScope[0], /one-sentence definition of inflation/i);
  assert.match(cardScope[0], /util-response-lines/);
  assert.equal(countResponseLines(cardScope[0]), 2);
  assertNoListWrappedWorksheetBlanks(cardScope[0]);
});

test("page render: task card blank list is response lines preserving authored count", () => {

  const page = {

    artifact_type: "page",

    title: "Workshop probe",

    page_profile: "learner",

    constraints_applied: {

      delivery_mode: "live_workshop",

      learning_environments: ["classroom"]

    },

    sections: [

      {

        section_id: "learning_activities",

        heading: "Learning activities",

        content: [

          {

            activity_id: "A1",

            title: "Define inflation",

            learner_task: "Write a one-sentence definition of inflation.",

            materials: {

              task_cards: [

                {

                  title: "Card 1 — Define inflation",

                  instruction:

                    "Write a one-sentence definition of inflation in your own words.\n\n- ________\n- ________"

                }

              ]

            }

          }

        ]

      }

    ]

  };

  const r = api.buildUtilityStructuredHtmlForTest(page);

  assert.ok(r && !r.error, r && r.error);

  const html = String(r.html || "");

  const cardScope = html.match(/Card 1[\s\S]*?(?=Card 2|<\/article>|$)/i);

  assert.ok(cardScope, "task card scope");

  assert.match(cardScope[0], /util-response-lines/);

  assert.equal(countResponseLines(cardScope[0]), 2);

  assertNoListWrappedWorksheetBlanks(cardScope[0]);

});



test("existing blank inline and table semantics remain stable", () => {

  const md = "Your answer: _____\n\n| Year | CPI |\n| --- | --- |\n| 2021 | _____ |";

  const html = api.utilityRenderMarkdownBlockForTest(md);

  assert.doesNotMatch(html, /@@PRISMBLANK/i);

  assert.match(html, /util-worksheet-blank/);

  assert.match(html, /<table>/);

  assert.doesNotMatch(html, /util-response-lines/);

  assertNoListWrappedWorksheetBlanks(html);

});


