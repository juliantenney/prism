const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("path");
const vm = require("node:vm");

// Markdown block-level shapes: full page HTML semantics live in utility-page-render.test.js
// (tests/fixtures/page-render/shape-*.json).

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

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
    removeEventListener() {},
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
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  assert.equal(typeof api.utilityRenderMarkdownBlockForTest, "function");
  assert.equal(typeof api.buildUtilityStructuredHtmlForTest, "function");
  return { api };
}

test("utilityRenderMarkdownBlock: newline bullet lines (•) become ul/li", () => {
  const { api } = loadPrismTestApi();
  const md = "• Item one.\n• Item two.\n• Item three.";
  const html = api.utilityRenderMarkdownBlockForTest(md);
  assert.match(html, /<ul>/);
  assert.match(html, /<\/ul>/);
  assert.equal((html.match(/<li>/g) || []).length, 3);
  assert.match(html, /Item one/);
  assert.match(html, /Item two/);
  assert.match(html, /Item three/);
});

test("utilityRenderMarkdownBlock: inline • run becomes ul/li", () => {
  const { api } = loadPrismTestApi();
  const md = "• item one. • item two. • item three.";
  const html = api.utilityRenderMarkdownBlockForTest(md);
  assert.match(html, /<ul>/);
  assert.equal((html.match(/<li>/g) || []).length, 3);
});

test("utilityRenderMarkdownBlock: prose + bullets + prose", () => {
  const { api } = loadPrismTestApi();
  const md = "Intro paragraph stays.\n\n• First bullet.\n• Second bullet.\n\nClosing line.";
  const html = api.utilityRenderMarkdownBlockForTest(md);
  assert.match(html, /Intro paragraph stays/);
  assert.match(html, /<ul>/);
  assert.match(html, /First bullet/);
  assert.match(html, /Second bullet/);
  assert.match(html, /Closing line/);
});

test("utilityRenderMarkdownBlock: markdown table still renders", () => {
  const { api } = loadPrismTestApi();
  const md = ["| Col A | Col B |", "| --- | --- |", "| x | y |"].join("\n");
  const html = api.utilityRenderMarkdownBlockForTest(md);
  assert.match(html, /<table>/);
  assert.match(html, /<\/table>/);
  assert.match(html, /Col A/);
});

test("utilityRenderMarkdownBlock: ordinary prose unchanged (single p)", () => {
  const { api } = loadPrismTestApi();
  const md = "Just a normal paragraph without list markers.";
  const html = api.utilityRenderMarkdownBlockForTest(md);
  assert.match(html, /^<p>/);
  assert.match(html, /<\/p>$/);
  assert.equal(html.includes("<ul>"), false);
});

test("utilityRenderMarkdownBlock: hyphen checklist lines stay ul (checkbox sanitize is downstream)", () => {
  const { api } = loadPrismTestApi();
  const md = "- ☐ First task\n- ☐ Second task";
  const html = api.utilityRenderMarkdownBlockForTest(md);
  assert.match(html, /<ul>/);
  assert.equal((html.match(/<li>/g) || []).length, 2);
  assert.match(html, /☐/);
});

test("utilityRenderMarkdownBlock: CR-only newlines still produce ul/li for bullet lines", () => {
  const { api } = loadPrismTestApi();
  const md = "• One.\r• Two.\r• Three.";
  const html = api.utilityRenderMarkdownBlockForTest(md);
  assert.match(html, /<ul>/);
  assert.equal((html.match(/<li>/g) || []).length, 3);
});

test("utilityRenderMarkdownBlock: ordered item keeps indented bullets nested", () => {
  const { api } = loadPrismTestApi();
  const md = [
    "1. Identify:",
    "  - \\(a\\)",
    "  - \\(b\\)",
    "  - \\(c\\)",
    "2. Substitute values in the quadratic formula."
  ].join("\n");
  const html = String(api.utilityRenderMarkdownBlockForTest(md) || "");
  assert.match(
    html,
    /<ol><li>Identify:<ul><li>\\\(a\\\)<\/li><li>\\\(b\\\)<\/li><li>\\\(c\\\)<\/li><\/ul><\/li><li>Substitute values in the quadratic formula\.<\/li><\/ol>/
  );
  assert.doesNotMatch(html, /<\/ol>\s*<ul>/);
});

test("buildUtilityStructuredHtml: materials content with newline • bullets yields ul/li (Research-style Key Findings text)", () => {
  const { api } = loadPrismTestApi();
  const keyFindingsBody =
    "• Infrastructure vs practice: tools exist but adoption lags.\n" +
    "• Efficiency vs impact: speed gains do not always improve outcomes.\n" +
    "• AI adoption pattern: pilots cluster in low-risk workflows first.";
  const r = api.buildUtilityStructuredHtmlForTest({
    artifact_type: "document",
    title: "Research briefing page",
    audience: "Stakeholders",
    sections: [
      {
        title: "Learning activities",
        content: [
          {
            title: "Synthesis block",
            materials: {
              heading: "Key Findings",
              content: keyFindingsBody
            }
          }
        ]
      }
    ]
  });
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.match(html, /<ul>/);
  assert.equal((html.match(/<li>/g) || []).length, 3);
  assert.match(html, /Infrastructure vs practice/);
  assert.match(html, /Efficiency vs impact/);
  assert.match(html, /AI adoption pattern/);
});

test("buildUtilityStructuredHtml: compact 'Steps: 1. ... 2. ...' normalizes to ordered list", () => {
  const { api } = loadPrismTestApi();
  const r = api.buildUtilityStructuredHtmlForTest({
    artifact_type: "page",
    title: "Compact steps normalization",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A1",
            title: "Z-score steps",
            learner_task: "Complete the method.",
            materials: {
              M1_text: "Steps: 1. Find mean 2. Subtract mean from each score 3. Divide by standard deviation"
            }
          }
        ]
      }
    ]
  });
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.doesNotMatch(html, /<p>Steps:\s*1\./i);
  assert.match(html, /<ol>/);
  assert.match(html, /<li>Find mean<\/li>/);
});

test("buildUtilityStructuredHtml: display math followed by compact dash bullets splits into ul", () => {
  const { api } = loadPrismTestApi();
  const r = api.buildUtilityStructuredHtmlForTest({
    artifact_type: "page",
    title: "Math bullet split",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A1",
            title: "Interpretation",
            learner_task: "Interpret signs.",
            materials: {
              M1_text: "\\[ z = \\\\frac{x-\\\\mu}{\\\\sigma} \\] - Positive: above mean - Negative: below mean - Larger magnitude: farther from mean"
            }
          }
        ]
      }
    ]
  });
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.doesNotMatch(html, /\\\]\s*-\s*Positive/i);
  assert.match(html, /\\\[ z = \\\\frac\{x-\\\\mu\}\{\\\\sigma\} \\\]/);
  assert.match(html, /<ul>/);
  assert.match(html, /Positive: above mean/);
  assert.match(html, /Negative: below mean/);
  assert.match(html, /Larger magnitude: farther from mean/);
});

test("buildUtilityStructuredHtml: compact worked-example labels and compressed table are separated", () => {
  const { api } = loadPrismTestApi();
  const r = api.buildUtilityStructuredHtmlForTest({
    artifact_type: "page",
    title: "Worked example formatting",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A1",
            title: "Worked summary",
            learner_task: "Review worked example.",
            materials: {
              M1_text: "Dataset: 4,6,8,10,12 Mean = 8 Deviations: -4,-2,0,2,4 Squared: 16,4,0,4,16",
              M2_sample_output:
                "| Step | Value | | --- | --- | | Mean | 8 | | Std dev | 2.83 |"
            }
          }
        ]
      }
    ]
  });
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.match(html, /Dataset: 4,6,8,10,12/);
  assert.match(html, /Mean = 8/);
  assert.match(html, /Deviations: -4,-2,0,2,4/);
  assert.match(html, /Squared: 16,4,0,4,16/);
  assert.doesNotMatch(html, /<p>[^<]*\|[^<]*---[^<]*\|/i);
  assert.match(html, /<table>/);
  assert.match(html, /<th>Step<\/th>/);
  assert.match(html, /<td>8<\/td>/);
});

test("buildUtilityStructuredHtml: template markdown tables render as tables (multiline + compressed)", () => {
  const { api } = loadPrismTestApi();
  const r = api.buildUtilityStructuredHtmlForTest({
    artifact_type: "page",
    title: "Template table rendering",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A1",
            title: "Confidence interval checks",
            learner_task: "Complete the template.",
            materials: {
              template: {
                sections: [
                  "### Confidence Interval Template\n| Statement | Correct? | Reason |\n|----------|----------|--------|\n| The interval crosses 0 | No | Excludes 0 |\n| The interval is narrow | Yes | Precision is high |",
                  "### Confidence Levels\n| Level | Lower | Upper |\n|------|-------|-------|\n| 90% | 66.08 | 73.92 |\n| 95% | 65.10 | 74.90 |",
                  "| Group | Interval | |------|----------| | Control | (66.08, 73.92) | | Treatment | (70.01, 78.44) |",
                  "| Pair | Overlap | |------|---------| | A vs B | Yes | | C vs D | No |"
                ]
              }
            }
          }
        ]
      }
    ]
  });
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.doesNotMatch(html, /<p>\s*\|\s*Statement\s*\|\s*Correct\?\s*\|\s*Reason\s*\|/i);
  assert.doesNotMatch(html, /<p>\s*\|\s*Level\s*\|/i);
  assert.doesNotMatch(html, /<p>\s*\|\s*Group\s*\|\s*Interval\s*\|/i);
  assert.doesNotMatch(html, /<p>\s*\|\s*Pair\s*\|\s*Overlap\s*\|/i);
  assert.match(html, /<table>/);
  assert.match(html, /Confidence Interval Template/);
  assert.match(html, /<th>Statement<\/th>/);
  assert.match(html, /<th>Level<\/th>/);
  assert.match(html, /<th>Group<\/th>/);
  assert.match(html, /<th>Pair<\/th>/);
  assert.match(html, /\(66\.08, 73\.92\)/);
});

test("buildUtilityStructuredHtml: assessment prompt intro + numbered lines render paragraph plus ordered list", () => {
  const { api } = loadPrismTestApi();
  const r = api.buildUtilityStructuredHtmlForTest({
    artifact_type: "page",
    title: "Assessment prompt formatting",
    sections: [
      {
        section_id: "assessment",
        heading: "Assessment",
        content: [
          {
            question: "p-value = 0.03 at \\( \\alpha = 0.05 \\):\n1. Decision?\n2. What does p-value represent?\n3. Is it practically significant?",
            options: ["Reject H0", "Fail to reject H0"]
          }
        ]
      }
    ]
  });
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.match(html, /util-assessment-prompt/);
  assert.match(html, /<ol>/);
  assert.doesNotMatch(html, /<p>[^<]*1\.\s*Decision\?/i);
  assert.match(html, /\\\( \\alpha = 0\.05 \\\)/);
});

test("buildUtilityStructuredHtml: linked activity resources path renders markdown tables (no literal pipe paragraphs)", () => {
  const { api } = loadPrismTestApi();
  const r = api.buildUtilityStructuredHtmlForTest({
    artifact_type: "page",
    title: "Linked resources table path",
    sections: [
      {
        section_id: "activity_resources",
        heading: "Activity materials",
        content: [
          "| Statement | Correct? | Reason |\n|----------|----------|--------|\n| CI crosses 0 | No | Excludes 0 |",
          "| Group | Interval | |------|----------| | A | (60,70) | | B | (65,75) |",
          "| Pair | Overlap | |------|---------| | A vs B | Yes | | B vs C | No |",
          "Use nearby maths delimiter \\(n = 10\\) when interpreting overlaps."
        ]
      }
    ]
  });
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.doesNotMatch(html, /<p>\s*\|\s*Statement\s*\|/i);
  assert.doesNotMatch(html, /<p>\s*\|\s*Group\s*\|\s*Interval\s*\|/i);
  assert.doesNotMatch(html, /<p>\s*\|\s*Pair\s*\|\s*Overlap\s*\|/i);
  assert.match(html, /<table>/);
  assert.match(html, /<th>Statement<\/th>/);
  assert.match(html, /<th>Group<\/th>/);
  assert.match(html, /<th>Pair<\/th>/);
  assert.match(html, /\\\(n = 10\\\)/);
});

test("buildUtilityStructuredHtml: learning_activities A2 template string + A4 scenario string render tables (live artefact shape)", () => {
  const { api } = loadPrismTestApi();
  const r = api.buildUtilityStructuredHtmlForTest({
    artifact_type: "page",
    title: "Confidence intervals page",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A2",
            title: "Confidence interval template",
            learner_task: "Complete the confidence interval template.",
            materials: {
              template:
                "### Confidence Interval Template\n| Statement | Correct? | Reason |\n|----------|----------|--------|\n| The interval crosses 0 | No | Excludes 0 |\n| The interval is narrow | Yes | Precision is high |"
            }
          },
          {
            activity_id: "A4",
            title: "Interval comparison scenario",
            learner_task: "Compare the intervals in the scenario table.",
            materials: {
              scenario:
                "| Group | Interval | |------|----------| | Control | (66.08, 73.92) | | Treatment | (70.01, 78.44) |"
            }
          }
        ]
      }
    ]
  });
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.doesNotMatch(html, /<p>\s*\|\s*Statement\s*\|/i);
  assert.doesNotMatch(html, /<p>\s*\|\s*Group\s*\|\s*Interval\s*\|/i);
  assert.match(html, /<table>/);
  assert.match(html, /<th>Statement<\/th>/);
  assert.match(html, /<th>Group<\/th>/);
  assert.match(html, /Confidence Interval Template/);
  assert.match(html, /\(66\.08, 73\.92\)/);
});

test("buildUtilityStructuredHtml: A2 template string with multiple heading+table sections renders all tables", () => {
  const { api } = loadPrismTestApi();
  const r = api.buildUtilityStructuredHtmlForTest({
    artifact_type: "page",
    title: "Confidence intervals page",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A2",
            title: "Confidence interval template",
            learner_task: "Complete both template tables.",
            materials: {
              template:
                "### Confidence Interval Template\n| Statement | Correct? | Reason |\n|----------|----------|--------|\n| 95% probability true mean lies in interval | | |\n| Method captures mean 95% of time | | |\n\n### Confidence Levels\n| Level | Width | Explanation |\n|------|-------|-------------|\n| 90% | | |\n| 95% | | |\n| 99% | | |"
            }
          }
        ]
      }
    ]
  });
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.doesNotMatch(html, /<p>\s*\|\s*Statement\s*\|/i);
  assert.doesNotMatch(html, /<p>\s*\|\s*Level\s*\|/i);
  assert.match(html, /Confidence Interval Template/);
  assert.match(html, /Confidence Levels/);
  assert.match(html, /<th>Statement<\/th>/);
  assert.match(html, /<th>Level<\/th>/);
  assert.match(html, /<th>Width<\/th>/);
  const tableCount = (html.match(/<table>/gi) || []).length;
  assert.ok(tableCount >= 2, "expected at least two rendered tables, got " + tableCount);
});
