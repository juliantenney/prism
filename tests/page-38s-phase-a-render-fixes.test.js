/**
 * Sprint 38S — Page Rendering Phase A (renderer-only fixes).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const roleRender = require(path.join(repoRoot, "lib/page-role-render-sequencing.js"));

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
  const libs = [
    "sprint38-visual-affordances.js",
    "design-page-materials-fidelity.js",
    "page-gam-materials-preserve.js",
    "page-role-registry.js",
    "page-role-render-sequencing.js",
    "page-a3-materials-sequencing.js"
  ];
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
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    location: { hash: "", pathname: "/" },
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
  sandbox.globalThis = sandbox;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  libs.forEach((f) => {
    vm.runInContext(fs.readFileSync(path.join(repoRoot, "lib", f), "utf8"), sandbox, {
      filename: f
    });
  });
  if (sandbox.PRISM_PAGE_ROLE_RENDER_SEQUENCING) {
    windowStub.PRISM_PAGE_ROLE_RENDER_SEQUENCING = sandbox.PRISM_PAGE_ROLE_RENDER_SEQUENCING;
  }
  if (sandbox.PRISM_PAGE_ROLE_REGISTRY) {
    windowStub.PRISM_PAGE_ROLE_REGISTRY = sandbox.PRISM_PAGE_ROLE_REGISTRY;
  }
  vm.runInContext(fs.readFileSync(appJsPath, "utf8"), sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

function inflationLo1Page() {
  return {
    artifact_type: "page",
    title: "Inflation LO1",
    audience: "Learner",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "LO1",
            title: "LO1 Understand inflation",
            learner_task: "Complete the understand activity.",
            materials: {
              text: {
                M1: {
                  heading: "Key distinction",
                  content: "Inflation is a sustained rise in the general price level."
                }
              },
              worked_example: {
                M2: {
                  heading: "Worked example",
                  content: "Step 1: Identify the basket.\nStep 2: Compare periods."
                }
              },
              sample_output: {
                M3: {
                  heading: "Sample output",
                  content: "A concise learner response example."
                }
              },
              checklist: {
                M4: {
                  items: [
                    "☐ I can define inflation",
                    "☐ I can distinguish inflation from a one-off price change",
                    "☐ I can give an example",
                    "☐ I can explain why it matters"
                  ]
                }
              }
            }
          }
        ]
      }
    ]
  };
}

function inflationLo3Page() {
  return {
    artifact_type: "page",
    title: "Inflation LO3",
    audience: "Learner",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "LO3",
            title: "LO3 Analyse inflation drivers",
            learner_task: "Complete the analysis table.",
            materials: {
              modelling_note: {
                M8: {
                  heading: "Modelling note",
                  content: "Use the distribution lens to compare drivers."
                }
              },
              checklist: {
                M10: {
                  items: ["☐ Criterion A", "☐ Criterion B", "☐ Criterion C", "☐ Criterion D"]
                }
              },
              analysis_table: {
                M9: {
                  table: "| Driver | Evidence | Impact |\n| --- | --- | --- |\n| Demand | Spending data | Upward pressure |"
                }
              }
            }
          }
        ]
      }
    ]
  };
}

function evaluateLo5Page() {
  return {
    artifact_type: "page",
    title: "Inflation LO5",
    audience: "Learner",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "LO5",
            activity_archetype: "evaluate",
            title: "LO5 Evaluate policy response",
            learner_task: "Make and justify a decision.",
            materials: {
              scenario: {
                M14: {
                  heading: "Scenario",
                  content: "Household Maya faces rising grocery prices."
                }
              },
              decision_table: {
                M15: {
                  table: "| Option | Trade-off |\n| --- | --- |\n| A | Lower immediate cost |"
                }
              },
              template: {
                M16: {
                  heading: "Independent judgement template",
                  content: "My judgement:\nEvidence used:"
                }
              },
              checklist: {
                M17: {
                  items: ["☐ Criterion 1", "☐ Criterion 2", "☐ Criterion 3", "☐ Criterion 4"]
                }
              }
            }
          }
        ]
      }
    ]
  };
}

function mainBodyHtml(html) {
  return String(html || "").split('<details class="util-meta"')[0];
}

function extractMaterialsStack(html, activityTitle) {
  const body = mainBodyHtml(html);
  const titleIdx = body.indexOf(activityTitle);
  const searchFrom = titleIdx >= 0 ? titleIdx : 0;
  const stackStart = body.indexOf('class="util-materials-stack"', searchFrom);
  if (stackStart < 0) return "";
  const openDiv = body.lastIndexOf("<div", stackStart);
  const closeIdx = body.indexOf("</div>", stackStart);
  if (openDiv < 0 || closeIdx < 0) return body.slice(stackStart);
  let depth = 0;
  let pos = openDiv;
  while (pos < body.length) {
    const nextOpen = body.indexOf("<div", pos);
    const nextClose = body.indexOf("</div>", pos);
    if (nextClose < 0) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      pos = nextOpen + 4;
      continue;
    }
    depth -= 1;
    pos = nextClose + 6;
    if (depth === 0) return body.slice(openDiv, pos);
  }
  return body.slice(openDiv, closeIdx + 6);
}

function firstIndex(html, pattern) {
  const m = String(html || "").search(pattern);
  return m < 0 ? Number.POSITIVE_INFINITY : m;
}

test("38S Phase A — type-bucket fallback orders exposition before checklist (LO1)", () => {
  const activity = inflationLo1Page().sections[0].content[0];
  const plan = roleRender.buildTypeBucketRoleFallbackRenderPlan(activity, activity.materials);
  const keys = plan.map((p) => p.key);
  assert.deepEqual(keys.indexOf("text") < keys.indexOf("checklist"), true);
  assert.deepEqual(keys.indexOf("worked_example") < keys.indexOf("checklist"), true);
});

test("38S Phase A — evaluate arc type-bucket plan orders scenario before checklist (LO5)", () => {
  const activity = evaluateLo5Page().sections[0].content[0];
  const plan = roleRender.buildTypeBucketRoleFallbackRenderPlan(activity, activity.materials);
  const keys = plan.map((p) => p.key);
  const scenarioIdx = keys.findIndex((k) => /scenario/i.test(k));
  const checklistIdx = keys.findIndex((k) => /checklist/i.test(k));
  assert.ok(scenarioIdx >= 0 && checklistIdx > scenarioIdx);
});

test("38S Phase A — utilityRenderMarkdownInline normalises safe strong/em HTML", () => {
  const api = loadPrismTestApi();
  const out = api.utilityRenderMarkdownInlineForTest(
    "Examples: <strong>Inflation</strong> and <em>deflation</em>."
  );
  assert.match(out, /<strong>Inflation<\/strong>/);
  assert.match(out, /<em>deflation<\/em>/);
  assert.equal(out.includes("&lt;strong&gt;"), false);
  assert.equal(out.includes("&lt;em&gt;"), false);
});

test("38S Phase A — nested M-key analysis_table unwrap renders LO3 table", () => {
  const api = loadPrismTestApi();
  const nested = {
    M9: {
      table: "| Driver | Evidence |\n| --- | --- |\n| Demand | Spending |"
    }
  };
  const unwrapped = api.utilityUnwrapWorksheetTablePayloadForTest(nested);
  assert.ok(unwrapped);
  assert.match(String(unwrapped), /Driver/);

  const resolved = api.resolveWorksheetTableSourceWithMetaForTest(
    inflationLo3Page().sections[0].content[0].materials
  );
  assert.equal(resolved.sourceKey, "analysis_table");
  assert.ok(resolved.payload);
});
