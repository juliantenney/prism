/**
 * Targeted regression tests for C6 Practice publication QA defects:
 * 1. Evidence placement: task evidence (e.g. data_table + visual hooks) precedes
 *    the learner decision workspace, while feedback evidence (sample_output /
 *    post-attempt deferred materials) stays in Check after the workspace.
 * 2. Matching-answer serialisation: array-of-objects, tuples, and map pair shapes
 *    all normalise and serialise cleanly as `leftId:rightId|...` (never `[object Object]`),
 *    and the assessment runtime correctly grades both correct and incorrect submissions.
 * 3. Orphaned navigation: pages with interactive Practice selection workspaces
 *    (which include assessment-runtime.js containing `data-region="assessment"` in JS)
 *    do not emit a phantom `#journey-assessment` ("Self assessment") nav destination
 *    when no assessment section is published.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");
const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model.js");
const { normalizeSelectionSemantics, normalizeMatchingPairsMap } = require("../lib/learner-renderer-vnext/normalize-selection.js");
const assessmentInteractive = require("../lib/learner-renderer-vnext/assessment-interactive.js");
const { installAssessmentRuntime } = require("../lib/learner-renderer-vnext/assessment-runtime.js");
const sectionNav = require("../lib/learner-renderer-vnext/sequential-section-nav.js");

function buildC6ShapedPracticePage(pairsPayload) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: "Retrieving the principles of statistical and causal reasoning",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    page_synthesis: {
      overview: {
        body: "Retrieve and apply core distinctions between statistical association and causal explanation.",
        format: "markdown"
      }
    },
    learning_outcomes: [
      { id: "LO1", statement: "Interpret correlation coefficients alongside observed distributions." },
      { id: "LO2", statement: "Distinguish statistical association from competing causal explanations." }
    ],
    episode_plans: [
      {
        activity_id: "A1",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan: {
          archetype: "apply",
          beats: [
            { function: "activation" },
            { function: "explanation" },
            { function: "independent_performance" },
            { function: "verification" }
          ]
        }
      },
      {
        activity_id: "A2",
        mapped_learning_outcome_ids: ["LO2"],
        episode_plan: {
          archetype: "apply",
          beats: [
            { function: "activation" },
            { function: "explanation" },
            { function: "independent_performance" },
            { function: "verification" }
          ]
        }
      }
    ],
    activities: [
      {
        activity_id: "A1",
        title: "Interpreting correlation and graphical evidence",
        duration_minutes: 2.5,
        mapped_learning_outcomes: ["LO1"],
        activity_preamble: "How much can you remember about interpreting economic relationships?",
        reasoning_orientation: "Consider the coefficient and the distribution of observations together.",
        learner_task: [
          "1. Examine the observations and coefficients in the first example.",
          "2. Examine the observations and coefficient in the second example. Select the interpretation that best describes the relationship.",
          "3. Examine the third example and compare the two reported coefficients. Select the conclusion that best accounts for the difference.",
          "4. Review the feedback after making your selections. Reconsider any interpretation that you would now change."
        ].join("\n"),
        expected_output: "Three evidence-based interpretive decisions.",
        required_materials: [
          { material_id: "A1-M1", type: "data_table", purpose: "Paired observations and correlation coefficients" },
          { material_id: "A1-M2", type: "selection", purpose: "Matching interpretive decisions" },
          { material_id: "A1-M3", type: "sample_output", purpose: "Post-attempt explanatory feedback" }
        ],
        materials: [
          {
            material_id: "A1-M1",
            type: "data_table",
            title: "Simulated economic evidence cases",
            body_format: "markdown",
            body: "### Case 1: Comparing two markets\n\n| Business | Advertising | Sales |\n| --- | --- | --- |\n| B1 | 10 | 20 |\n| B2 | 20 | 25 |\n\nPearson correlation: \\(r=0.30\\)."
          },
          {
            material_id: "A1-M2",
            type: "selection",
            title: "Interpret the three statistical relationships",
            selection: {
              form: "matching",
              prompt: "Match each case to its most appropriate interpretation.",
              left: [
                { id: "case1", text: "Case 1: Comparing two markets" },
                { id: "case2", text: "Case 2: Ticket prices and revenue" },
                { id: "case3", text: "Case 3: Staffing and restaurant revenue" }
              ],
              right: [
                { id: "1a", text: "Market A has the stronger linear association." },
                { id: "1b", text: "Market B has the stronger linear association." },
                { id: "2c", text: "Curved relationship balances out to r = 0.00." },
                { id: "3c", text: "One observation shifts r from 1.00 to 0.33." }
              ],
              pairs: pairsPayload,
              rationale: "Compare both the magnitude of r and the shape of the paired observations."
            }
          },
          {
            material_id: "A1-M3",
            type: "sample_output",
            title: "Explanatory feedback for the three cases",
            body_format: "markdown",
            body: "Review after attempting all three decisions.\n\n### Case 1\nMarket B has the stronger linear association (|−1.00| > |0.30|)."
          }
        ],
        episode_plan: {
          archetype: "apply",
          beats: [
            { function: "activation" },
            { function: "explanation" },
            { function: "independent_performance" },
            { function: "verification" }
          ]
        }
      },
      {
        activity_id: "A2",
        title: "Distinguishing association and causal explanations",
        duration_minutes: 2.5,
        mapped_learning_outcomes: ["LO2"],
        activity_preamble: "Retrieve the causal reasoning distinctions.",
        reasoning_orientation: "Attend to observed association versus proposed causal directions.",
        learner_task: "1. Select the conclusion warranted by the survey.",
        expected_output: "One warranted causal conclusion.",
        required_materials: [
          { material_id: "A2-M1", type: "selection", purpose: "Single-select causal decision" }
        ],
        materials: [
          {
            material_id: "A2-M1",
            type: "selection",
            title: "Packaging survey judgement",
            selection: {
              form: "single_select",
              prompt: "Which conclusion is warranted by the same-year survey?",
              options: [
                { key: "a", text: "Switching packaging caused higher sales." },
                { key: "b", text: "An association is observed, but reverse causality and confounding remain possible." }
              ],
              correct_answer: "b",
              rationale: "Same-year association alone does not establish causal direction."
            }
          }
        ],
        episode_plan: {
          archetype: "apply",
          beats: [
            { function: "activation" },
            { function: "explanation" },
            { function: "independent_performance" },
            { function: "verification" }
          ]
        }
      }
    ],
    learning_sequence: {
      total_duration_minutes: 5,
      ordered_activity_ids: ["A1", "A2"],
      timeline: [
        { activity_id: "A1", duration_minutes: 2.5, start_seconds: 0, end_seconds: 150 },
        { activity_id: "A2", duration_minutes: 2.5, start_seconds: 150, end_seconds: 300 }
      ]
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["episode_plan", "dla", "gam", "learning_sequence", "design_page"]
    }
  };
}

/** Minimal DOM harness to execute installAssessmentRuntime on a matching workspace. */
function runMatchingRuntimeCheck(correctMapAttr, selectedValuesBySubject) {
  let resultHtml = "";
  let resultHidden = true;
  const attrs = {
    "data-assessment-form": "matching",
    "data-assessment-correct-map": correctMapAttr,
    "data-assessment-checked": "false"
  };

  const selects = Object.keys(selectedValuesBySubject).map((subject) => ({
    value: selectedValuesBySubject[subject],
    getAttribute(name) {
      if (name === "data-assessment-subject") return subject;
      return null;
    }
  }));

  const resultRegion = {
    get hidden() {
      return resultHidden;
    },
    set hidden(v) {
      resultHidden = !!v;
    },
    className: "",
    get innerHTML() {
      return resultHtml;
    },
    set innerHTML(v) {
      resultHtml = String(v || "");
    },
    textContent: ""
  };

  const item = {
    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(attrs, name) ? attrs[name] : null;
    },
    setAttribute(name, val) {
      attrs[name] = String(val);
    },
    removeAttribute(name) {
      delete attrs[name];
    },
    closest() {
      return null;
    },
    querySelector(sel) {
      if (sel === "[data-assessment-result]") return resultRegion;
      if (sel === "[data-assessment-explanation]") return null;
      return null;
    },
    querySelectorAll(sel) {
      if (sel === "select[data-assessment-pair]") return selects;
      return [];
    }
  };

  const checkButton = {
    closest(sel) {
      if (sel === "[data-assessment-check]") return checkButton;
      if (sel === ".util-assessment-item--interactive") return item;
      return null;
    }
  };

  const listeners = {};
  const root = {
    addEventListener(type, fn) {
      listeners[type] = fn;
    },
    removeEventListener(type) {
      delete listeners[type];
    },
    querySelectorAll() {
      return [];
    },
    querySelector() {
      return null;
    }
  };

  const handle = installAssessmentRuntime(root);
  assert.equal(handle.ok, true);
  listeners.click({ target: checkButton, preventDefault() {} });

  return {
    checked: attrs["data-assessment-checked"],
    lastResult: attrs["data-assessment-last-result"] || null,
    resultHtml,
    resultHidden
  };
}

test("Defect 1: Task evidence (data_table) precedes matching workspace while feedback evidence (sample_output) stays in Check", () => {
  const page = buildC6ShapedPracticePage([
    { left_id: "case1", right_id: "1b" },
    { left_id: "case2", right_id: "2c" },
    { left_id: "case3", right_id: "3c" }
  ]);
  const rendered = renderLearnerPageHtml(page, { includeRuntimeScripts: true });
  assert.equal(rendered.error, null, String(rendered.error || ""));

  const html = rendered.html;
  const a1Start = html.indexOf('data-activity-id="A1"');
  const a2Start = html.indexOf('data-activity-id="A2"');
  assert.ok(a1Start >= 0 && a2Start > a1Start, "Expected A1 and A2 sections");
  const a1Html = html.slice(a1Start, a2Start);

  const evidencePos = a1Html.indexOf('data-material-id="A1-M1"');
  const workspacePos = a1Html.indexOf('data-workspace-capability="matching"');
  const checkHeadingPos = a1Html.indexOf('id="learner-check-a1-heading"');
  const feedbackPos = a1Html.indexOf('data-material-id="A1-M3"');

  assert.ok(evidencePos >= 0, "A1-M1 data_table evidence must be rendered");
  assert.ok(workspacePos >= 0, "A1-M2 matching workspace must be rendered");
  assert.ok(checkHeadingPos >= 0, "Check heading must be rendered");
  assert.ok(feedbackPos >= 0, "A1-M3 sample_output feedback must be rendered");

  assert.ok(
    evidencePos < workspacePos,
    "Required task evidence (A1-M1) must appear BEFORE the matching workspace (A1-M2)"
  );
  assert.ok(
    workspacePos < checkHeadingPos,
    "Matching workspace (A1-M2) must appear BEFORE Check your response"
  );
  assert.ok(
    checkHeadingPos < feedbackPos,
    "Feedback evidence (A1-M3 sample_output) must remain inside Check after the workspace"
  );
});

test("Defect 2: Matching pairs normalise and serialise generically without [object Object], and runtime grades correct/incorrect/incomplete submissions", () => {
  const left = [
    { id: "case1", text: "Case 1" },
    { id: "case2", text: "Case 2" },
    { id: "case3", text: "Case 3" }
  ];
  const right = [
    { id: "1a", text: "Market A stronger" },
    { id: "1b", text: "Market B stronger" },
    { id: "2c", text: "Curved zero r" },
    { id: "3c", text: "Single outlier shifts r" }
  ];

  // Array of { left_id, right_id }
  assert.deepEqual(
    normalizeMatchingPairsMap(
      [
        { left_id: "case1", right_id: "1b" },
        { left_id: "case2", right_id: "2c" },
        { left_id: "case3", right_id: "3c" }
      ],
      left,
      right
    ),
    { case1: "1b", case2: "2c", case3: "3c" }
  );

  // Array of { subject, match } and 2-tuples and plain map
  assert.deepEqual(
    normalizeMatchingPairsMap(
      [
        { subject: "case1", match: "1b" },
        { left: "case2", right: "2c" },
        ["case3", "3c"]
      ],
      left,
      right
    ),
    { case1: "1b", case2: "2c", case3: "3c" }
  );
  assert.deepEqual(
    normalizeMatchingPairsMap({ case1: "1b", case2: "2c", case3: "3c" }, left, right),
    { case1: "1b", case2: "2c", case3: "3c" }
  );

  // Full page render with array-of-objects pairs (the C6 defect shape)
  const page = buildC6ShapedPracticePage([
    { left_id: "case1", right_id: "1b" },
    { left_id: "case2", right_id: "2c" },
    { left_id: "case3", right_id: "3c" }
  ]);
  const rendered = renderLearnerPageHtml(page, { includeRuntimeScripts: true });
  assert.equal(rendered.error, null, String(rendered.error || ""));
  assert.doesNotMatch(rendered.html, /\[object Object\]/);
  const mapMatch = rendered.html.match(/data-assessment-correct-map="([^"]+)"/);
  assert.ok(mapMatch, "Expected data-assessment-correct-map attribute on matching workspace");
  assert.equal(mapMatch[1], "case1:1b|case2:2c|case3:3c");

  // Direct renderMatchingItem call with array-of-objects pairs (assessment-pack / direct caller)
  const directHtml = assessmentInteractive.renderAssessmentItem(
    {
      id: "m-direct",
      item_type: "matching",
      stem: "Match each case.",
      prompt: { left, right },
      judgement: {
        pairs: [
          { left_id: "case1", right_id: "1b" },
          { left_id: "case2", right_id: "2c" },
          { left_id: "case3", right_id: "3c" }
        ]
      }
    },
    0
  );
  assert.doesNotMatch(directHtml, /\[object Object\]/);
  assert.match(directHtml, /data-assessment-correct-map="case1:1b\|case2:2c\|case3:3c"/);

  // Runtime checking: correct submission
  const correctRes = runMatchingRuntimeCheck(mapMatch[1], {
    case1: "1b",
    case2: "2c",
    case3: "3c"
  });
  assert.equal(correctRes.checked, "true");
  assert.equal(correctRes.lastResult, "correct");
  assert.match(correctRes.resultHtml, /Correct\./);

  // Runtime checking: incorrect submission
  const wrongRes = runMatchingRuntimeCheck(mapMatch[1], {
    case1: "1a",
    case2: "2c",
    case3: "3c"
  });
  assert.equal(wrongRes.checked, "true");
  assert.equal(wrongRes.lastResult, "incorrect");
  assert.match(wrongRes.resultHtml, /Not quite\./);

  // Runtime checking: incomplete submission
  const incompleteRes = runMatchingRuntimeCheck(mapMatch[1], {
    case1: "1b",
    case2: "",
    case3: "3c"
  });
  assert.equal(incompleteRes.lastResult, null);
  assert.match(incompleteRes.resultHtml, /Choose a match for each item before checking\./);
});

test("Defect 3: Published navigation omits #journey-assessment when no assessment section exists, even when assessment-runtime script is embedded", () => {
  const page = buildC6ShapedPracticePage([
    { left_id: "case1", right_id: "1b" },
    { left_id: "case2", right_id: "2c" },
    { left_id: "case3", right_id: "3c" }
  ]);
  const built = buildPageModel(page);
  assert.equal(built.ok, true, JSON.stringify(built.errors || []));

  const rendered = renderLearnerPageHtml(page, { includeRuntimeScripts: true });
  assert.equal(rendered.error, null, String(rendered.error || ""));
  // Confirm assessment-runtime.js IS embedded (which contains `data-region="assessment"` in JS)
  assert.match(rendered.html, /<script[\s\S]*data-region="assessment"[\s\S]*<\/script>/);

  const prepared = sectionNav.prepareJourneySectionMarkers(rendered.html, built.model);
  const items = sectionNav.buildSectionNavItems(prepared, built.model);
  const navIds = items.map((i) => i.id);

  assert.deepEqual(navIds, ["journey-orient", "activity-A1", "activity-A2"]);
  assert.ok(!navIds.includes("journey-assessment"), "Must not emit orphaned #journey-assessment");

  const navHtml = sectionNav.renderSequentialSectionNavHtml(items);
  assert.match(navHtml, /data-journey-total="3"/);
  assert.doesNotMatch(navHtml, /href="#journey-assessment"/);
  assert.doesNotMatch(navHtml, /Self assessment/);

  // Positive control: a page WITH a real <section data-region="assessment"> still gets Self assessment
  const withAssessment = prepared + '<section data-region="assessment" id="journey-assessment"></section>';
  const withItems = sectionNav.buildSectionNavItems(withAssessment, built.model);
  assert.ok(withItems.some((i) => i.id === "journey-assessment"));
});

function buildC2ReconsiderationPage(options) {
  const opts = options || {};
  const m4Type = opts.m4Type || "data_table";
  const m4Body =
    opts.m4Body ||
    [
      "Consult this comparison only after committing to your initial interpretation.",
      "",
      "| Sample | Pearson correlation |",
      "| --- | ---: |",
      "| All 10 retailers (R1–R10) | 0.47 |",
      "| 9 retailers excluding R10 (R1–R9) | 1.00 |"
    ].join("\n");
  const m4Purpose =
    opts.m4Purpose || "Supplementary evidence comparing correlation calculations for reconsideration";
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: "Interpreting contrasting statistical relationships",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    learning_outcomes: [
      { id: "LO1", statement: "Interpret correlation coefficients alongside scatterplots and outlier influence." }
    ],
    activities: [
      {
        activity_id: "A2",
        title: "Interpret advertising expenditure and sales revenue",
        duration_minutes: 10,
        mapped_learning_outcomes: ["LO1"],
        learner_task: [
          "1. Inspect the retailer scatterplot and data table.",
          "2. Write your initial interpretation of the relationship before consulting the comparison.",
          "3. Compare the two correlation calculations after committing to your initial interpretation and reconsider if needed."
        ].join("\n"),
        expected_output: "An initial interpretation and a reconsidered judgement grounded in the scatterplot.",
        required_materials: [
          { material_id: "A2-M1", type: "data_table", purpose: "Initial dataset and scatterplot for R1–R10" },
          { material_id: "A2-M2", type: "template", purpose: "Initial interpretation workspace" },
          { material_id: "A2-M4", type: m4Type, purpose: m4Purpose }
        ],
        materials: [
          {
            material_id: "A2-M1",
            type: "data_table",
            title: "Advertising expenditure and sales revenue",
            body_format: "markdown",
            body: "| Retailer | Advertising | Sales |\n| --- | ---: | ---: |\n| R1 | 1 | 18 |\n| R10 | 10 | 15 |\n\nPearson correlation: \\(r = 0.47\\).",
            scatterplot: {
              title: "Monthly advertising expenditure and monthly sales revenue",
              x_axis: { label: "Monthly advertising expenditure (£ thousands)", scale: "linear", minimum: 0, maximum: 10, tick_interval: 1 },
              y_axis: { label: "Monthly sales revenue (£ thousands)", scale: "linear", minimum: 0, maximum: 50, tick_interval: 10 },
              show_point_labels: true,
              observations: [
                { label: "R1", x: 1, y: 18 },
                { label: "R10", x: 10, y: 15 }
              ],
              accessible_description: "Scatterplot of retailer observations."
            }
          },
          {
            material_id: "A2-M2",
            type: "template",
            title: "Initial interpretation workspace",
            body_format: "markdown",
            body: "**Initial interpretation:**\n\nDescribe the relationship between advertising expenditure and sales revenue across the retailers."
          },
          {
            material_id: "A2-M4",
            type: m4Type,
            title: "Compare two correlation calculations",
            body_format: "markdown",
            body: m4Body
          }
        ],
        episode_plan: {
          archetype: "analyse",
          beats: [
            { function: "activation" },
            { function: "explanation" },
            { function: "guided_inquiry" },
            { function: "verification" }
          ]
        }
      }
    ],
    learning_sequence: {
      total_duration_minutes: 10,
      ordered_activity_ids: ["A2"],
      timeline: [
        Object.assign(
          { activity_id: "A2", duration_minutes: 10, start_seconds: 0, end_seconds: 600 },
          opts.studyFlow ? { learner_study_flow: opts.studyFlow } : {}
        )
      ]
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["episode_plan", "dla", "gam", "learning_sequence", "design_page"]
    }
  };
  if (opts.feedbackDisclosure) {
    page.learning_sequence.navigation = { feedback_disclosure: opts.feedbackDisclosure };
  }
  return page;
}

test("C2 Defect: Supplementary reconsideration evidence (A2-M4 data_table/comparison_table) defers to Check after the initial workspace while initial evidence (A2-M1) stays before it", () => {
  for (const m4Type of ["data_table", "comparison_table", "reference_table"]) {
    const page = buildC2ReconsiderationPage({ m4Type });
    const rendered = renderLearnerPageHtml(page, { includeRuntimeScripts: true });
    assert.equal(rendered.error, null, String(rendered.error || ""));
    const html = rendered.html;

    const initialEvidencePos = html.indexOf('data-material-id="A2-M1"');
    const workspacePos = html.indexOf("learner-workspace-a2");
    const checkHeadingPos = html.indexOf('id="learner-check-a2-heading"');
    const supplementaryPos = html.indexOf('data-material-id="A2-M4"');

    assert.ok(initialEvidencePos >= 0, `${m4Type}: A2-M1 initial evidence must render`);
    assert.ok(workspacePos >= 0, `${m4Type}: A2-M2 initial workspace must render`);
    assert.ok(checkHeadingPos >= 0, `${m4Type}: Check section must render`);
    assert.ok(supplementaryPos >= 0, `${m4Type}: A2-M4 supplementary comparison must render`);

    assert.ok(
      initialEvidencePos < workspacePos,
      `${m4Type}: Required initial evidence (A2-M1) must precede the initial workspace`
    );
    assert.ok(
      workspacePos < checkHeadingPos,
      `${m4Type}: Initial workspace must precede Check`
    );
    assert.ok(
      checkHeadingPos < supplementaryPos,
      `${m4Type}: Supplementary reconsideration evidence (A2-M4) must appear in Check AFTER the initial workspace`
    );
    // Preserves scatterplot and voluntary collapsed disclosure
    assert.ok(html.indexOf('class="util-scatterplot-svg"') >= 0, `${m4Type}: scatterplot must be preserved`);
    const checkSlice = html.slice(checkHeadingPos);
    assert.match(checkSlice, /<details class="util-composition-reveal[\s\S]*data-material-id="A2-M4"/);
  }
});

test("C2 Defect: Supplementary evidence defers to Check when marked post-attempt via learning_sequence study_flow or required_materials purpose, even with neutral body prose", () => {
  const neutralBody = "| Sample | r |\n| --- | ---: |\n| All 10 retailers | 0.47 |\n| Excluding R10 | 1.00 |";

  // Case A: learner_study_flow post_attempt disclosure
  const byStudyFlow = buildC2ReconsiderationPage({
    m4Type: "data_table",
    m4Body: neutralBody,
    m4Purpose: "Compare two correlation calculations",
    studyFlow: [
      { step: 1, disclosure: "initial_attempt", material_ids: ["A2-M1", "A2-M2"] },
      { step: 2, disclosure: "post_attempt", material_ids: ["A2-M4"] }
    ]
  });
  const htmlFlow = renderLearnerPageHtml(byStudyFlow).html;
  assert.ok(
    htmlFlow.indexOf('data-material-id="A2-M1"') < htmlFlow.indexOf("learner-workspace-a2") &&
      htmlFlow.indexOf("learner-workspace-a2") < htmlFlow.indexOf('id="learner-check-a2-heading"') &&
      htmlFlow.indexOf('id="learner-check-a2-heading"') < htmlFlow.indexOf('data-material-id="A2-M4"'),
    "learning_sequence learner_study_flow post_attempt must defer A2-M4 into Check"
  );

  // Case B: required_materials[].purpose states post-commitment disclosure
  const byPurpose = buildC2ReconsiderationPage({
    m4Type: "comparison_table",
    m4Body: neutralBody,
    m4Purpose: "Disclosed after the learner has committed to an initial interpretation for subsequent reconsideration."
  });
  const htmlPurpose = renderLearnerPageHtml(byPurpose).html;
  assert.ok(
    htmlPurpose.indexOf('data-material-id="A2-M1"') < htmlPurpose.indexOf("learner-workspace-a2") &&
      htmlPurpose.indexOf("learner-workspace-a2") < htmlPurpose.indexOf('id="learner-check-a2-heading"') &&
      htmlPurpose.indexOf('id="learner-check-a2-heading"') < htmlPurpose.indexOf('data-material-id="A2-M4"'),
    "required_materials purpose stating post-commitment disclosure must defer A2-M4 into Check"
  );
});
