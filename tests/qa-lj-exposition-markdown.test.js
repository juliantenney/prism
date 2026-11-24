const test = require("node:test");
const assert = require("node:assert/strict");

const designMod = require("../lib/learning-journey-design-page.js");
const learnerPkgMod = require("../lib/learning-journey-learner-package.js");
const unifiedShellMod = require("../lib/learning-journey-unified-shell.js");

function makeSampleJourneyDoc(introTitle, introExposition, expExposition) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "Correlation and Causation",
    activities: [],
    learning_outcomes: [
      { id: "lo_1", text: "Distinguish correlation from causation in empirical claims." }
    ],
    sections: [
      {
        section_id: "journey_intro",
        title: introTitle,
        order: 1,
        exposition: introExposition
      },
      {
        section_id: "exp_1",
        title: "Investigating misleading headlines",
        order: 2,
        exposition: expExposition || "Start with the headline and test the underlying claim."
      }
    ],
    commissions: [
      {
        commission_id: "comm_1",
        section_id: "exp_1",
        order: 1,
        product_id: "expository",
        status: "supported",
        title: "Headline Evidence Guide",
        specification_text: "Examine how observational studies are reported in headlines.",
        journey_context_text: "First experience introducing correlation vs causation."
      }
    ]
  };
}

test("Authoring preview renders Markdown headings, emphasis, lists, and code safely without literal ##", () => {
  const introExposition = [
    "Welcome to **Correlation and Causation** — a _practical_ module.",
    "",
    "## Planning your learning",
    "",
    "Use these steps before diving in:",
    "- Review the **core concepts** and `r` values",
    "- Note any *confounding* variables",
    "",
    "### Suggested sequence",
    "",
    "1. Read the introductory guide",
    "2. Check __evidence__ against claims",
    "",
    "Unsafe tag check: <script>alert('xss')</script>"
  ].join("\n");

  const doc = makeSampleJourneyDoc("Introduction", introExposition);
  const preview = designMod.buildLearningJourneyCommissioningPreviewHtml(doc);
  assert.equal(preview.ok, true);
  const html = preview.html;

  // Heading renders semantically under the section <h2> without literal Markdown markers
  assert.ok(html.includes("<h2>Introduction</h2>"), "section h2 should be preserved");
  assert.ok(
    html.includes("<h3>Planning your learning</h3>"),
    "## heading should render as nested <h3>"
  );
  assert.ok(
    html.includes("<h4>Suggested sequence</h4>"),
    "### heading should render as nested <h4>"
  );
  assert.ok(!html.includes("## Planning your learning"), "no literal ## marker should leak");
  assert.ok(!html.includes("### Suggested sequence"), "no literal ### marker should leak");

  // Emphasis, inline code, unordered and ordered lists
  assert.ok(html.includes("<strong>Correlation and Causation</strong>"));
  assert.ok(html.includes("<em>practical</em>"));
  assert.ok(html.includes("<strong>evidence</strong>"));
  assert.ok(html.includes("<em>confounding</em>"));
  assert.ok(html.includes("<code>r</code>"));
  assert.ok(html.includes("<ul><li>Review the <strong>core concepts</strong>"));
  assert.ok(html.includes("<ol><li>Read the introductory guide</li>"));

  // HTML sanitisation preserved
  assert.ok(!html.includes("<script>alert('xss')</script>"));
  assert.ok(html.includes("&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"));

  // Commissioning controls remain intact
  assert.ok(html.includes('data-lj-action="create-product"'));
  assert.ok(html.includes('data-commission-id="comm_1"'));

  // Exposition heading & list styles present
  assert.ok(preview.cssText.includes(".lj-commissioning-preview__exposition h3{"));
  assert.ok(preview.cssText.includes(".lj-commissioning-preview__exposition ul,"));
});

test("Authoring preview preserves plain-text multi-paragraph exposition and line breaks", () => {
  const plainExposition = "First line.\nSecond line.\n\nSecond paragraph with plain text.";
  const doc = makeSampleJourneyDoc("Introduction", plainExposition);
  const preview = designMod.buildLearningJourneyCommissioningPreviewHtml(doc);
  assert.equal(preview.ok, true);
  const html = preview.html;

  assert.ok(
    html.includes(
      '<div class="lj-commissioning-preview__exposition"><p>First line.<br>Second line.</p><p>Second paragraph with plain text.</p></div>'
    ),
    "plain-text exposition formatting should remain intact"
  );
});

test("Standalone learner home page renders exposition Markdown with correct heading nesting", () => {
  const introExposition = [
    "Introductory overview.",
    "",
    "## Planning your learning",
    "",
    "### Check your readiness",
    "",
    "- First **point**",
    "- Second *point*"
  ].join("\n");

  // Case 1: Intro section title differs from journey title -> <h2> is emitted, so ## becomes <h3>
  const docWithIntroH2 = makeSampleJourneyDoc(
    "About this journey",
    introExposition,
    "## Before you start\n\nConsider the data."
  );
  const homeWithH2 = learnerPkgMod.buildLearningJourneyHomeHtml(docWithIntroH2);
  assert.equal(homeWithH2.ok, true);
  const htmlWithH2 = homeWithH2.html;

  assert.ok(htmlWithH2.includes("<h2>About this journey</h2>"));
  assert.ok(htmlWithH2.includes("<h3>Planning your learning</h3>"));
  assert.ok(htmlWithH2.includes("<h4>Check your readiness</h4>"));
  assert.ok(htmlWithH2.includes("<h3>Before you start</h3>"));
  assert.ok(!htmlWithH2.includes("## Planning your learning"));
  assert.ok(htmlWithH2.includes("<ul><li>First <strong>point</strong></li>"));

  // Case 2: Intro section title matches journey title -> no <h2> emitted, so ## becomes <h2> (no skipped h1->h3)
  const docWithoutIntroH2 = makeSampleJourneyDoc("Correlation and Causation", introExposition);
  const homeWithoutH2 = learnerPkgMod.buildLearningJourneyHomeHtml(docWithoutIntroH2);
  assert.equal(homeWithoutH2.ok, true);
  const htmlWithoutH2 = homeWithoutH2.html;

  assert.ok(
    htmlWithoutH2.includes("<h2>Planning your learning</h2>"),
    "when intro omits <h2>, ## heading should start at <h2> to preserve heading hierarchy"
  );
  assert.ok(
    htmlWithoutH2.includes("<h3>Check your readiness</h3>"),
    "when intro omits <h2>, ### heading should nest as <h3>"
  );
  assert.ok(!htmlWithoutH2.includes("## Planning your learning"));
});

test("Unified ZIP shell overview renders exposition Markdown headings without leakage", () => {
  const rendered = unifiedShellMod.renderOverviewMarkdown(
    "Overview paragraph.\n\n## Planning your learning\n\n- Check **assumptions**\n- Inspect <script>bad()</script>"
  );
  assert.ok(!rendered.includes("## Planning your learning"));
  assert.ok(rendered.includes("Planning your learning</h3>"));
  assert.ok(rendered.includes("<strong>assumptions</strong>"));
  assert.ok(!rendered.includes("<script>bad()</script>"));
});
