/**
 * C4 learner HTML: guided-review questions stay visible while their guidance
 * and post-attempt verified feedback start closed.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const fflate = require("fflate");

const learnerPackage = require("../lib/learner-package.js");
const learnerPackageZip = require("../lib/learner-package-zip.js");
const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext/render-learner-page.js");

const fixturePath = path.join(
  __dirname,
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

function pipeTable(headers, rows) {
  const line = (cells) => "| " + cells.join(" | ") + " |";
  return [line(headers), line(headers.map(() => "---")), ...rows.map(line)].join("\n");
}

function material(id, type, title, body, bodyFormat) {
  return {
    material_id: id,
    material_type: type,
    activity_id: "A4",
    title: title,
    body_format: bodyFormat || "markdown",
    body: body
  };
}

const TEACHING_BODY = [
  "Compare the recorded dissolution times only after you have inspected each trial.",
  "",
  "Condition A was recorded at 20 °C and Condition B at 40 °C. The twelve measurements are the evidence for the comparison."
].join("\n");

const WORKED_EXAMPLE_BODY = [
  "A separate practice set, 10 s, 12 s and 14 s, shows how a sample standard deviation is calculated.",
  "",
  "These values are not measurements from the tablet investigation."
].join("\n");

const MECHANISM_BODY = [
  "Read this mechanism before you calculate.",
  "",
  "The mean describes the average recorded time. The range and sample standard deviation describe variation within one condition."
].join("\n");

const INTERPRETATION_BODY = [
  "Use this table after you have completed your own comparison.",
  "",
  pipeTable(
    ["Condition", "Mean (s)"],
    [
      ["A: 20 °C", "91.67"],
      ["B: 40 °C", "75.50"]
    ]
  ),
  "",
  "This table is context for the comparison. It is not a post-attempt answer key."
].join("\n");

const VERIFIED_RESULTS_BODY = [
  "### Reveal after completing and reviewing your comparison",
  "",
  pipeTable(
    ["Statistic", "Condition A", "Condition B"],
    [
      ["Sample standard deviation (s)", "3.3267", "4.0373"]
    ]
  ),
  "",
  "Rounded to two decimal places, the sample standard deviations are 3.33 s and 4.04 s."
].join("\n");

const VERIFIED_FEEDBACK_BODY = [
  "### Reveal after completing and reviewing your calculation",
  "",
  "The signed difference, Condition B minus Condition A, is approximately −16.17 s.",
  "",
  "This describes the two synthetic sample means. It does not establish a general causal effect."
].join("\n");

const OBSERVATIONS_BODY = [
  "Recorded dissolution times for the twelve independent trials.",
  "",
  pipeTable(
    ["Trial", "Condition A (s)", "Condition B (s)"],
    [
      ["1", "93", "78"],
      ["6", "87", "77"]
    ]
  )
].join("\n");

const SCENARIO_BODY = [
  "The individual-value plot places every Condition A marker from 87 s to 96 s.",
  "",
  "Use the common seconds axis while the markers are in view."
].join("\n");

const TEMPLATE_BODY = "Record the signed difference in seconds, then explain what the sign means for these samples.";

const SAMPLE_BODY =
  "One possible comparison names the shorter observed mean and the slightly larger spread in Condition B.";

const CHECKLIST_BODY = {
  review_mode: "guided_criteria",
  criteria: [
    {
      statement: "Have you calculated the descriptive statistics for both conditions?",
      why_it_matters: "A mixed sample would misrepresent the recorded averages.",
      features: [
        {
          expected: "Each mean uses the six times from its own condition.",
          repair: "Add the six times in each condition separately and divide by six."
        }
      ]
    },
    {
      statement: "Have you distinguished the difference between the means from variation within each condition?",
      why_it_matters: "Average time and dispersion answer different questions.",
      features: [
        {
          expected: "The range comparison concerns spread within each condition.",
          repair: "Compare the two ranges separately from the two means."
        }
      ]
    }
  ]
};

function c4Page() {
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const a4 = page.activities.find((activity) => activity.activity_id === "A4");
  a4.title = "Compare the Recorded Dissolution Times";
  a4.materials = [
    material("A4-M1", "text", "How to compare the conditions", TEACHING_BODY),
    material("A4-M2", "worked_example", "Practice standard deviation", WORKED_EXAMPLE_BODY),
    material("A4-M3", "modelling_note", "Mean and spread", MECHANISM_BODY),
    material("A4-M4", "reference_table", "Comparison context", INTERPRETATION_BODY),
    material("A4-M5", "reference_table", "Verified Descriptive Statistics", VERIFIED_RESULTS_BODY),
    material("A4-M6", "text", "Verified Difference Between the Means", VERIFIED_FEEDBACK_BODY),
    material("A4-M7", "data_table", "Recorded Dissolution Times", OBSERVATIONS_BODY),
    material("A4-M8", "scenario", "Individual-value plot", SCENARIO_BODY),
    material("A4-M9", "template", "Signed difference workspace", TEMPLATE_BODY),
    material("A4-M10", "sample_output", "Example comparison sentence", SAMPLE_BODY),
    material("A4-M11", "checklist", "Review Your Numerical Comparison", CHECKLIST_BODY, "json")
  ];
  a4.required_materials = a4.materials.map((item) => ({
    material_id: item.material_id,
    type: item.material_type,
    purpose: item.title,
    specification: "C4 progressive disclosure regression."
  }));
  return page;
}

function articleHtml(html, materialId) {
  const marker = 'data-material-id="' + materialId + '"';
  const at = html.indexOf(marker);
  assert.ok(at >= 0, "missing material " + materialId);
  const open = html.lastIndexOf("<article", at);
  const end = html.indexOf("</article>", at);
  return html.slice(open, end + "</article>".length);
}

function revealWrapping(html, materialId) {
  const article = articleHtml(html, materialId);
  const at = html.indexOf(article);
  const before = html.slice(Math.max(0, at - 360), at);
  const match = before.match(
    /<details class="util-composition-reveal[^"]*" data-reveal-mode="details">\s*<summary>([^<]*)<\/summary>\s*<div class="util-composition-reveal__body">\s*$/
  );
  if (!match) return null;
  const detailsAt = at - match[0].length;
  const end = html.indexOf("</details>", at);
  return {
    summary: match[1],
    open: /\sopen(?:\s|>)/.test(html.slice(detailsAt, detailsAt + match[0].length)),
    block: html.slice(detailsAt, end + "</details>".length)
  };
}

function renderC4() {
  const rendered = renderLearnerPageHtml(c4Page(), { compositionMode: "moments" });
  assert.equal(rendered.error, null, rendered.error);
  return String(rendered.html || "");
}

function assertDisclosure(html) {
  const checklist = articleHtml(html, "A4-M11");
  assert.equal(revealWrapping(html, "A4-M11"), null);
  assert.match(checklist, /data-guided-review-presentation="listed"/);
  assert.equal((checklist.match(/<details\b/g) || []).length, 2);
  assert.doesNotMatch(checklist, /<details[^>]*\sopen(?:\s|>)/);

  const questions = [
    "Have you calculated the descriptive statistics for both conditions?",
    "Have you distinguished the difference between the means from variation within each condition?"
  ];
  questions.forEach((question, index) => {
    const panelStart = checklist.indexOf('data-guided-review-index="' + index + '"');
    const panelEnd =
      index === questions.length - 1
        ? checklist.length
        : checklist.indexOf('data-guided-review-index="' + (index + 1) + '"');
    const panel = checklist.slice(panelStart, panelEnd);
    const statementAt = panel.indexOf(question);
    const guidanceAt = panel.indexOf("<details");
    const whyAt = panel.indexOf("Why this matters");
    const lookAt = panel.indexOf("What to look for");
    const repairAt = panel.indexOf("If something is missing");
    const guidanceEnd = panel.indexOf("</details>");
    assert.ok(statementAt >= 0 && statementAt < guidanceAt, question);
    assert.ok(guidanceAt < whyAt && whyAt < lookAt && lookAt < repairAt);
    assert.ok(repairAt < guidanceEnd);
    assert.match(panel, /<summary>Show guidance<span class="util-visually-hidden"> for criterion /);
    assert.match(panel, /Criterion /);
  });
  assert.match(checklist, /A mixed sample would misrepresent the recorded averages/);
  assert.match(checklist, /Each mean uses the six times from its own condition/);
  assert.match(checklist, /Add the six times in each condition separately and divide by six/);
  assert.match(checklist, /Average time and dispersion answer different questions/);
  assert.match(checklist, /Compare the two ranges separately from the two means/);
  assert.equal((checklist.match(/Why this matters/g) || []).length, 2);
  assert.equal((checklist.match(/What to look for/g) || []).length, 2);
  assert.equal((checklist.match(/If something is missing/g) || []).length, 2);

  const checkAt = html.indexOf('id="learner-check-a4"');
  const checkOpen = html.lastIndexOf("<section", checkAt);
  assert.match(html.slice(checkOpen, checkAt), /^<section\b/);
  assert.match(html.slice(checkAt, checkAt + 2500), />Check your response<\/h3>/);

  const results = revealWrapping(html, "A4-M5");
  assert.ok(results, "verified results disclosure");
  assert.equal(results.summary, "Reveal verified results");
  assert.equal(results.open, false);
  assert.equal((results.block.match(/<details\b/g) || []).length, 1);
  assert.match(results.block, /3\.3267/);
  assert.match(results.block, /4\.0373/);
  assert.match(results.block, /3\.33 s and 4\.04 s/);

  const feedback = revealWrapping(html, "A4-M6");
  assert.ok(feedback, "verified feedback disclosure");
  assert.equal(feedback.summary, "Reveal verified feedback");
  assert.equal(feedback.open, false);
  assert.equal((feedback.block.match(/<details\b/g) || []).length, 1);
  assert.match(feedback.block, /−16\.17 s/);
  assert.match(feedback.block, /does not establish a general causal effect/);

  ["A4-M1", "A4-M2", "A4-M3", "A4-M4", "A4-M7", "A4-M8", "A4-M9"].forEach((id) => {
    assert.equal(revealWrapping(html, id), null, id + " should stay visible");
  });
  assert.match(articleHtml(html, "A4-M1"), /twelve measurements are the evidence/);
  assert.match(articleHtml(html, "A4-M2"), /10 s, 12 s and 14 s/);
  assert.match(articleHtml(html, "A4-M3"), /variation within one condition/);
  assert.match(articleHtml(html, "A4-M4"), /91\.67/);
  assert.match(articleHtml(html, "A4-M4"), /not a post-attempt answer key/);
  assert.match(articleHtml(html, "A4-M7"), />93</);
  assert.match(articleHtml(html, "A4-M7"), />78</);
  assert.match(articleHtml(html, "A4-M8"), /87 s to 96 s/);
  assert.match(articleHtml(html, "A4-M9"), /signed difference in seconds/);

  const sample = revealWrapping(html, "A4-M10");
  assert.ok(sample, "example response keeps its own disclosure");
  assert.equal(sample.summary, "Review the example response");
  assert.equal((sample.block.match(/<details\b/g) || []).length, 1);
  assert.match(sample.block, /slightly larger spread/);

  assert.match(html, /data-guided-review-presentation"\) === "listed"/);
}

test("C4 learner HTML lists every diagnostic question and conceals post-attempt feedback", () => {
  assertDisclosure(renderC4());
});

test("exported C4 learner HTML keeps the same closed disclosures", () => {
  const html = renderC4();
  const packaged = learnerPackage.buildLearnerPackage({
    html: html,
    visualAssetManifest: { assets: [] },
    title: "Comparing Experimental Conditions"
  });
  assert.equal(packaged.ok, true, JSON.stringify(packaged.error || {}));
  const zipped = learnerPackageZip.serializeLearnerPackageToZip(packaged.package);
  assert.equal(zipped.ok, true, JSON.stringify(zipped.error || {}));
  const entries = fflate.unzipSync(zipped.bytes);
  assertDisclosure(fflate.strFromU8(entries["learner-page.html"]));
});
