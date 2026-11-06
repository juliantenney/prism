/**
 * Desktop Check your work sidebar: generated learner HTML and exported package.
 * Static HTML keeps the listed guidance fallback. The sidebar runtime opens one
 * criterion at a time beside the task.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("path");
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

function material(activityId, id, type, title, body, bodyFormat) {
  return {
    material_id: id,
    material_type: type,
    activity_id: activityId,
    title: title,
    body_format: bodyFormat || "markdown",
    body: body
  };
}

function criterion(statement, why, expected, repair) {
  return {
    statement: statement,
    why_it_matters: why,
    features: [{ expected: expected, repair: repair }]
  };
}

const A4_CRITERIA = [
  criterion(
    "Have you calculated the descriptive statistics for both conditions?",
    "A mixed sample would misrepresent the recorded averages.",
    "Each mean uses the six times from its own condition.",
    "Add the six times in each condition separately and divide by six."
  ),
  criterion(
    "Have you distinguished the difference between the means from variation within each condition?",
    "Average time and dispersion answer different questions.",
    "The range comparison concerns spread within each condition.",
    "Compare the two ranges separately from the two means."
  ),
  criterion(
    "Have you kept the sign of the difference between the two means?",
    "The sign records which condition was faster in these samples.",
    "The difference is Condition B minus Condition A.",
    "Subtract Condition A from Condition B and keep the negative sign."
  ),
  criterion(
    "Have you limited the claim to these recorded samples?",
    "Two samples do not establish a general causal effect.",
    "The wording stays with the twelve recorded times.",
    "Remove any claim that the temperature caused a general change."
  )
];

function assign(activity, id, title, materials) {
  activity.title = title;
  activity.materials = materials;
  activity.required_materials = materials.map((item) => ({
    material_id: item.material_id,
    type: item.material_type,
    purpose: item.title,
    specification: "C4 check sidebar regression."
  }));
}

function sidebarPage() {
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const a2 = page.activities.find((activity) => activity.activity_id === "A2");
  const a4 = page.activities.find((activity) => activity.activity_id === "A4");
  assign(a4, "A4", "Compare Averages and Variation", [
    material(
      "A4",
      "A4-M1",
      "text",
      "How to compare the conditions",
      "The twelve measurements are the evidence for the comparison."
    ),
    material(
      "A4",
      "A4-M2",
      "template",
      "Comparison workspace",
      "Record the signed difference in seconds, then explain what the sign means for these samples."
    ),
    material(
      "A4",
      "A4-M3",
      "reference_table",
      "Verified Descriptive Statistics",
      [
        "### Reveal after completing and reviewing your comparison",
        "",
        "| Statistic | Condition A | Condition B |",
        "| --- | --- | --- |",
        "| Sample standard deviation (s) | 3.3267 | 4.0373 |"
      ].join("\n")
    ),
    material(
      "A4",
      "A4-M4",
      "text",
      "Verified Difference Between the Means",
      "### Reveal after completing and reviewing your calculation\n\nThe signed difference is approximately −16.17 s."
    ),
    material("A4", "A4-M5", "checklist", "Review the comparison", {
      review_mode: "guided_criteria",
      criteria: A4_CRITERIA
    }, "json")
  ]);
  a2.episode_plan = {
    archetype: "understand",
    beats: [
      { function: "orientation" },
      { function: "explanation" },
      { function: "guided_practice" },
      { function: "verification" }
    ]
  };
  assign(a2, "A2", "Interpret the Residual Plot", [
    material(
      "A2",
      "A2-M1",
      "text",
      "What the plot shows",
      "Read the residual spread before you name the pattern."
    ),
    material(
      "A2",
      "A2-M2",
      "template",
      "Plot interpretation workspace",
      "Name whether the residual spread stays similar or changes."
    ),
    material(
      "A2",
      "A2-M3",
      "text",
      "Verified plot interpretation",
      "### Reveal after completing and reviewing your interpretation\n\nThe spread increases as the fitted values increase."
    ),
    material("A2", "A2-M4", "checklist", "Review the plot reading", {
      review_mode: "guided_criteria",
      criteria: [
        criterion(
          "Have you described the spread rather than a single residual?",
          "One residual does not show whether the spread changes.",
          "The description covers the whole plot.",
          "Look across the fitted values before naming the pattern."
        ),
        criterion(
          "Have you avoided treating every residual as evidence of changing spread?",
          "Residuals are expected even when the spread is stable.",
          "The claim depends on a change in spread.",
          "Separate the existence of residuals from a change in their spread."
        )
      ]
    }, "json")
  ]);
  return page;
}

function renderSidebarPage() {
  const rendered = renderLearnerPageHtml(sidebarPage(), { compositionMode: "moments" });
  assert.equal(rendered.error, null, rendered.error);
  return String(rendered.html || "");
}

function sliceBetween(html, startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  assert.ok(start >= 0, startMarker);
  const end = endMarker ? html.indexOf(endMarker, start) : html.length;
  assert.ok(end > start, endMarker || "end");
  return html.slice(start, end);
}

function assertActivityReview(html, activitySlug, endMarker, questions, verifiedLabel) {
  const taskAt = html.indexOf('id="learner-task-' + activitySlug + '"');
  const checkAt = html.indexOf('id="learner-check-' + activitySlug + '"');
  assert.ok(taskAt >= 0 && checkAt > taskAt, activitySlug);
  const task = sliceBetween(html, 'id="learner-task-' + activitySlug + '"', 'id="learner-check-' + activitySlug + '"');
  assert.match(task, /data-check-sidebar-open/);
  assert.match(task, />Check your work</);
  assert.match(task, new RegExp('aria-controls="learner-check-' + activitySlug + '"'));
  assert.match(task, /aria-expanded="false"/);

  const check = sliceBetween(html, 'id="learner-check-' + activitySlug + '"', endMarker);
  assert.match(check, /data-check-sidebar="available"/);
  assert.match(check, /data-check-sidebar-close/);
  assert.match(check, /aria-label="Close check your work"/);
  assert.match(check, /data-check-sidebar-progress/);
  assert.match(check, /M6 6l12 12M18 6L6 18/);
  assert.match(check, />Check your response<\/h3>/);
  assert.match(check, /data-guided-review-presentation="listed"/);
  assert.match(check, /data-guided-review-prev/);
  assert.match(check, /data-guided-review-next/);
  assert.equal((check.match(/<details class="util-composition-reveal util-guided-review__guidance/g) || []).length, questions.length);
  assert.doesNotMatch(check, /<details class="util-composition-reveal util-guided-review__guidance[^>]*\sopen/);

  questions.forEach((question, index) => {
    const panelStart = check.indexOf('data-guided-review-index="' + index + '"');
    const panelEnd = check.indexOf('data-guided-review-index="' + (index + 1) + '"');
    const panel = check.slice(panelStart, panelEnd > panelStart ? panelEnd : check.indexOf("data-verified-review"));
    assert.ok(panel.indexOf(question) >= 0 && panel.indexOf(question) < panel.indexOf("<details"), question);
    assert.match(panel, /Why this matters/);
    assert.match(panel, /What to look for/);
    assert.match(panel, /If something is missing/);
    assert.match(panel, /My response now meets this criterion/);
    assert.match(panel, new RegExp("Criterion " + (index + 1) + " of " + questions.length));
  });

  const verifiedAt = check.indexOf("data-verified-review");
  const lastQuestion = check.lastIndexOf(questions[questions.length - 1]);
  assert.ok(lastQuestion >= 0 && verifiedAt > lastQuestion);
  assert.match(check, new RegExp(">" + verifiedLabel + "<"));
  assert.match(check, /data-verified-review-panel/);
  assert.doesNotMatch(check, /data-verified-visible="true"/);
  return check;
}

function assertSidebarHtml(html) {
  assert.match(html, /Compare Averages and Variation/);
  assert.match(html, /Interpret the Residual Plot/);
  assert.match(html, /The twelve measurements are the evidence/);
  assert.match(html, /Read the residual spread before you name the pattern/);
  assert.match(html, /prism-check-sidebar-css/);
  assert.match(
    html,
    /width:calc\(\(100vw - var\(--learner-reading-width,70ch\)\) \/ 2 - var\(--learner-page-gutter,1rem\)\)/
  );
  assert.match(html, /border-left:1px solid #e5e7eb/);
  assert.match(html, /background:#f8fafc/);
  assert.match(
    html,
    /data-check-sidebar-state='open'\]\{position:fixed;z-index:60;top:0;right:0;bottom:0;/
  );
  assert.match(html, /data-check-sidebar-open/);
  assert.match(html, /data-guided-review-presentation"\) === "listed"/);

  const task = html.indexOf('id="learner-task-a4"');
  const verifiedResults = html.indexOf("A4-M3");
  const verifiedFeedback = html.indexOf("A4-M4");
  assert.ok(task >= 0 && task < verifiedResults && task < verifiedFeedback);
  assert.ok(html.indexOf(">Your task</h3>") < html.indexOf(">Reveal verified results<"));

  const a4 = assertActivityReview(
    html,
    "a4",
    'id="activity-A5"',
    A4_CRITERIA.map((item) => item.statement),
    "View verified results / feedback"
  );
  assert.match(a4, /3\.3267/);
  assert.match(a4, /4\.0373/);
  assert.match(a4, /−16\.17 s/);
  assert.match(a4, /<summary>Reveal verified results<\/summary>/);
  assert.match(a4, /<summary>Reveal verified feedback<\/summary>/);
  assert.doesNotMatch(a4, /<details class="util-composition-reveal util-prose-measure"[^>]*\sopen/);
  assert.match(html, /overflow-x:auto/);

  const teaching = html.slice(html.indexOf('id="activity-A4"'), html.indexOf('id="learner-task-a4"'));
  assert.match(teaching, /twelve measurements are the evidence/);
  assert.doesNotMatch(teaching, /Reveal verified results/);
  assert.doesNotMatch(teaching, /−16\.17 s/);

  const a2 = assertActivityReview(
    html,
    "a2",
    'id="activity-A3"',
    [
      "Have you described the spread rather than a single residual?",
      "Have you avoided treating every residual as evidence of changing spread?"
    ],
    "View verified feedback"
  );
  assert.match(a2, /The spread increases as the fitted values increase/);
  assert.equal((html.match(/id="learner-check-a4"/g) || []).length, 1);
  assert.equal((html.match(/id="learner-check-a2"/g) || []).length, 1);
}

test("C4 learner HTML places diagnostic review in a Check your work sidebar", () => {
  assertSidebarHtml(renderSidebarPage());
});

test("exported C4 package keeps the sidebar markup and verified values", () => {
  const packaged = learnerPackage.buildLearnerPackage({
    html: renderSidebarPage(),
    visualAssetManifest: { assets: [] },
    title: "Compare Averages and Variation"
  });
  assert.equal(packaged.ok, true, JSON.stringify(packaged.error || {}));
  const zipped = learnerPackageZip.serializeLearnerPackageToZip(packaged.package);
  assert.equal(zipped.ok, true, JSON.stringify(zipped.error || {}));
  const entries = fflate.unzipSync(zipped.bytes);
  assertSidebarHtml(fflate.strFromU8(entries["learner-page.html"]));
});
