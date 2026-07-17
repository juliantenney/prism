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
  const matches = [
    ...scope.matchAll(/<section class="util-beat-section"[^>]*data-(?:beat|episode)-function="([^"]+)"/g)
  ];
  return matches.map((m) => m[1]);
}

function beatSectionHtml(html, fn, activityScope) {
  const scope = activityScope || html;
  const re = new RegExp(
    '<section class="util-beat-section"[^>]*data-(?:beat|episode)-function="' +
      fn +
      '"[\\s\\S]*?</section>',
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
  assert.deepEqual(beatSectionOrder(a1Html), [
    "explanation",
    "worked_thinking",
    "verification"
  ]);
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

test("renderer: beat what_to_do stays with its owning beat", () => {
  const api = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    page_profile: "learner",
    title: "Beat instruction placement",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            activity_id: "A1",
            title: "Residual patterns",
            learner_task: "Complete the activity instructions.",
            episode_plan: {
              beats: [
                {
                  function: "explanation",
                  title: "Interpret the residual pattern",
                  what_to_do:
                    "Compare the residual plots and identify whether their vertical spread changes."
                },
                {
                  function: "worked_thinking",
                  title: "Study the model",
                  what_to_do: {
                    first: "Trace how the model identifies changing spread.",
                    second: "Note the evidence used in the conclusion."
                  }
                },
                {
                  function: "verification",
                  title: "Check your interpretation"
                }
              ]
            },
            materials: {
              text: "Residual spread should remain stable under homoscedasticity.",
              worked_example: "The model compares low and high fitted-value regions.",
              checklist: "- Did you compare both regions?\n- Did you identify changing spread?"
            }
          }
        ]
      }
    ]
  };
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  const explanation = beatSectionHtml(html, "explanation");
  const model = beatSectionHtml(html, "worked_thinking");
  const verification = beatSectionHtml(html, "verification");

  assert.match(
    explanation,
    /<h3 class="util-beat-heading">Interpret the residual pattern<\/h3><div class="util-beat-instructions"><p class="util-beat-instruction">Compare the residual plots/
  );
  assert.ok(
    explanation.indexOf("util-beat-instruction") <
      explanation.indexOf("util-beat-materials")
  );
  assert.match(model, /<div class="util-beat-instructions">/);
  assert.match(model, /Trace how the model identifies changing spread/);
  assert.match(model, /Note the evidence used in the conclusion/);
  assert.ok(model.indexOf("util-beat-instruction") < model.indexOf("util-beat-materials"));
  assert.doesNotMatch(verification, /util-beat-instruction/);
  assert.match(verification, /util-beat-materials/);
  assert.doesNotMatch(
    html,
    /<section[^>]*util-instructional-do[^>]*>[\s\S]*?What to do/i
  );
  assert.doesNotMatch(html, />What to do<\/(?:h3|h4|p)>/i);
  assert.equal(
    (html.match(/Compare the residual plots and identify whether their vertical spread changes\./g) || [])
      .length,
    1
  );
});

test("renderer: Marx learner_task steps map into beat instructions", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  const a1Block = html.match(/Historical Materialism and Capitalism[\s\S]*?(?=Surplus Value and Exploitation|$)/i);
  assert.ok(a1Block, "expected A1 activity block");
  const a1Html = a1Block[0];

  assert.doesNotMatch(a1Html, />What to do<\/(?:h3|h4|p)>/i);
  assert.doesNotMatch(a1Html, /util-unmapped-beat-instructions/);
  assert.match(a1Html, /util-beat-instruction/);

  const explanation = beatSectionHtml(a1Html, "explanation");
  const model = beatSectionHtml(a1Html, "worked_thinking");
  const verification = beatSectionHtml(a1Html, "verification");

  assert.match(
    explanation,
    /util-beat-instruction[\s\S]*Read the explanatory text on historical materialism/
  );
  assert.ok(
    explanation.indexOf("util-beat-instruction") <
      explanation.indexOf("util-beat-materials")
  );
  assert.match(model, /util-beat-instruction/);
  assert.match(model, /Study the worked example carefully/);
  assert.match(verification, /util-beat-instruction/);
  assert.match(verification, /util-beat-materials/);
  // Excess prompts stay with the final contentful beat (no instruction-only padding).
  assert.match(verification, /Write a brief explanation \(100–120 words\)/);
  assert.match(verification, /Use the checklist to verify your explanation/);
  assert.equal((a1Html.match(/<section class="util-beat-section"/g) || []).length, 3);
});

test("renderer: contentful beats keep instruction and materials together", () => {
  const api = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    page_profile: "learner",
    title: "Coherent beats",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            activity_id: "A1",
            title: "Defining Heteroscedasticity",
            learner_task:
              "1. Study the explanatory text introducing residuals.\n2. Work through the expert example showing residual variance.\n3. Compare the sample response with the explanation.\n4. Complete the self-check.\n5. Write a brief explanation in your own words.",
            episode_plan: {
              beats: [
                { function: "orientation" },
                { function: "explanation" },
                { function: "worked_thinking" },
                { function: "verification" }
              ]
            },
            materials: {
              text: "Residuals are observed minus predicted values.",
              worked_example: "Step 1: inspect residual spread across fitted values.",
              sample_output: "Homoscedasticity keeps residual spread stable.",
              checklist:
                "- Did you distinguish homoscedasticity from heteroscedasticity?\n\n**If any check is not met:**\nRevise before continuing."
            }
          }
        ]
      }
    ]
  };
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  const body = html.replace(/<style[\s\S]*?<\/style>/i, "");
  const sections = [
    ...body.matchAll(/<section class="util-beat-section"[^>]*>([\s\S]*?)<\/section>/g)
  ].map((m) => m[0]);

  // One episode-plan beat → one section (orientation may be framing-only).
  assert.equal(sections.length, 4);
  assert.match(body, /data-episode-function="orientation"/);
  assert.doesNotMatch(body, /util-unmapped-beat-instructions/);

  const contentful = sections.filter((section) => /util-beat-materials/.test(section));
  assert.equal(contentful.length, 3);
  contentful.forEach((section) => {
    assert.match(section, /util-beat-heading/);
    assert.match(section, /util-beat-instruction/);
    assert.match(section, /util-beat-materials/);
  });

  assert.match(contentful[0], /data-episode-function="explanation"/);
  assert.match(contentful[0], /Study the explanatory text introducing residuals/);
  assert.match(contentful[0], /Residuals are observed minus predicted/);

  assert.match(contentful[1], /data-episode-function="worked_thinking"/);
  assert.match(contentful[1], /Work through the expert example/);
  assert.match(contentful[1], /inspect residual spread/);
  assert.match(contentful[1], /Homoscedasticity keeps residual spread/);

  assert.match(contentful[2], /data-episode-function="verification"/);
  assert.match(contentful[2], /Complete the self-check/);
  assert.match(contentful[2], /Write a brief explanation in your own words/);
  assert.match(contentful[2], /util-checklist/);

  const headings = contentful.map(
    (s) => (s.match(/util-beat-heading">([^<]+)/) || [])[1]
  );
  assert.deepEqual(headings, ["Understand", "See it modelled", "Check your work"]);
});

test("renderer: thin episode plan keeps model materials inside check beat", () => {
  const api = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    page_profile: "learner",
    title: "Beat construction",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            activity_id: "A1",
            title: "Defining Heteroscedasticity",
            learner_task:
              "1. Study the explanatory text introducing residuals.\n2. Work through the expert example showing residual variance.\n3. Compare the sample response with the explanation.\n4. Complete the self-check.\n5. Write a brief explanation in your own words.",
            episode_plan: {
              beats: [{ function: "explanation" }, { function: "check_understanding" }]
            },
            materials: {
              text: "Residuals are observed minus predicted values.",
              worked_example: "Step 1: inspect residual spread across fitted values.",
              sample_output: "Homoscedasticity keeps residual spread stable.",
              checklist:
                "- Did you distinguish homoscedasticity from heteroscedasticity?\n\n**If any check is not met:**\nRevise before continuing."
            }
          }
        ]
      }
    ]
  };
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  const body = html.replace(/<style[\s\S]*?<\/style>/i, "");
  const sections = [
    ...body.matchAll(/<section class="util-beat-section"[^>]*>([\s\S]*?)<\/section>/g)
  ].map((m) => m[0]);

  assert.equal(sections.length, 2);
  assert.deepEqual(
    sections.map((s) => (s.match(/data-episode-function="([^"]+)"/) || [])[1]),
    ["explanation", "check_understanding"]
  );
  assert.deepEqual(
    sections.map((s) => (s.match(/util-beat-heading">([^<]+)/) || [])[1]),
    ["Understand", "Check your work"]
  );

  assert.match(sections[0], /Study the explanatory text introducing residuals/);
  assert.match(sections[0], /Residuals are observed minus predicted/);
  assert.doesNotMatch(sections[0], /util-worked-example/);
  assert.doesNotMatch(sections[0], /util-checklist/);

  assert.match(sections[1], /Work through the expert example/);
  assert.match(sections[1], /util-worked-example|inspect residual spread/);
  assert.match(sections[1], /Homoscedasticity keeps residual spread/);
  assert.match(sections[1], /Complete the self-check|Write a brief explanation/);
  assert.match(sections[1], /util-checklist/);
});

test("renderer: single-beat plan does not invent extra beat sections", () => {
  const api = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    page_profile: "learner",
    title: "Beat construction",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            activity_id: "A1",
            title: "Defining Heteroscedasticity",
            learner_task:
              "1. Study the explanatory text introducing residuals.\n2. Work through the expert example showing residual variance.\n3. Compare the sample response with the explanation.\n4. Complete the self-check.\n5. Write a brief explanation in your own words.",
            episode_plan: {
              beats: [{ function: "explanation" }]
            },
            materials: {
              text: "Residuals are observed minus predicted values.",
              worked_example: "Step 1: inspect residual spread across fitted values.",
              sample_output: "Homoscedasticity keeps residual spread stable.",
              checklist:
                "- Did you distinguish homoscedasticity from heteroscedasticity?\n\n**If any check is not met:**\nRevise before continuing."
            }
          }
        ]
      }
    ]
  };
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  const body = html.replace(/<style[\s\S]*?<\/style>/i, "");
  const sections = [
    ...body.matchAll(/<section class="util-beat-section"[^>]*>([\s\S]*?)<\/section>/g)
  ].map((m) => m[0]);

  assert.equal(sections.length, 1);
  assert.match(sections[0], /data-episode-function="explanation"/);
  assert.match(sections[0], /Residuals are observed minus predicted/);
  assert.match(sections[0], /inspect residual spread/);
  assert.match(sections[0], /util-checklist/);
});

test("renderer: beat diagnostics API matches registry resolver", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const a1 = activityFromPage(page, "A1");
  const viaApi = api.buildBeatRenderDiagnosticForTest(a1);
  const viaRegistry = registry.buildBeatRenderDiagnostic(a1);
  assert.equal(JSON.stringify(viaApi), JSON.stringify(viaRegistry));
});
