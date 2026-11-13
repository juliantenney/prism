/**
 * Completed answers / worked solutions intended for post-attempt review must
 * not appear as ordinary pre-task Learn content. Learners can still open them
 * deliberately in Check after undertaking the task.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext/render-learner-page.js");
const {
  shouldDeferMaterialToCheck,
  materialMatchesPostAttemptReveal
} = require("../lib/learner-renderer-vnext/compose-generic-moments.js");

function material(id, type, title, body, bodyFormat) {
  return {
    material_id: id,
    material_type: type,
    activity_id: id.split("-")[0],
    title: title,
    body_format: bodyFormat || "markdown",
    body: body
  };
}

function applyActivity() {
  return {
    activity_id: "A2",
    title: "Test which rectangles are feasible",
    learner_task: [
      "1. Inspect the four proposed side-length pairs.",
      "2. Classify each rectangle as feasible or infeasible and calculate its area.",
      "3. Compare the areas of the feasible rectangles.",
      "4. Explain why the largest numerical area may not be acceptable.",
      "5. Review your calculations using the feedback before continuing."
    ].join("\n"),
    expected_output: "A completed comparison covering the supplied rectangles.",
    episode_plan: {
      archetype: "apply",
      beats: [
        { function: "orientation" },
        { function: "framing" },
        { function: "activation" },
        { function: "criteria_exposition" },
        { function: "worked_thinking" },
        { function: "guided_practice" },
        { function: "independent_performance" },
        { function: "verification" },
        { function: "revision" },
        { function: "reflection" },
        { function: "transfer" },
        { function: "transition" }
      ]
    },
    materials: [
      material(
        "A2-M1",
        "scenario",
        "Four proposed rectangles",
        "Four proposed rectangles have dimensions (2,8), (4,6), (5,5) and (6,6)."
      ),
      material(
        "A2-M2",
        "text",
        "How feasibility changes a comparison",
        "## Two checks for every proposed rectangle\n\nArea and feasibility need separate calculations. Apply this distinction to the four proposed rectangles."
      ),
      material(
        "A2-M3",
        "comparison_table",
        "Rectangle feasibility and area comparison",
        [
          "| Side lengths | Feasible or infeasible | Area |",
          "| --- | --- | --- |",
          "| (2,8) |  |  |",
          "| (4,6) |  |  |",
          "| (5,5) |  |  |",
          "| (6,6) |  |  |"
        ].join("\n")
      ),
      material(
        "A2-M4",
        "checklist",
        "Diagnose your rectangle comparison",
        {
          review_mode: "guided_criteria",
          criteria: [
            {
              statement: "Have you checked the perimeter restrictions?",
              why_it_matters: "Feasibility depends on the stated conditions.",
              features: [
                {
                  expected: "Every row contains a perimeter check.",
                  repair: "Add the two side lengths and compare with 10."
                }
              ]
            }
          ]
        },
        "json"
      ),
      material(
        "A2-M5",
        "sample_output",
        "Worked comparison and feedback",
        [
          "## Reveal after completing your comparison",
          "",
          "| Side lengths | Feasibility | Area |",
          "| --- | --- | --- |",
          "| (2,8) | Feasible | 16 |",
          "| (4,6) | Feasible | 24 |",
          "| (5,5) | Feasible | 25 |",
          "| (6,6) | Infeasible | 36 |",
          "",
          "Among the supplied feasible alternatives, (5,5) has the greatest area."
        ].join("\n")
      )
    ]
  };
}

function analyseActivity() {
  return {
    activity_id: "A3",
    title: "Defend the best permissible choice",
    learner_task: [
      "1. Revisit your original rectangle prediction.",
      "2. Explain which supplied feasible rectangle offers the greatest area.",
      "3. Explain how the fixed-perimeter constraint changes the problem.",
      "4. Record whether your initial prediction is supported or challenged.",
      "5. Apply the same reasoning to the resource-allocation claim."
    ].join("\n"),
    expected_output: "An evidence-supported explanation and transfer decision.",
    episode_plan: {
      archetype: "analyse",
      beats: [
        { function: "orientation" },
        { function: "framing" },
        { function: "activation" },
        { function: "criteria_exposition" },
        { function: "explanation" },
        { function: "worked_thinking" },
        { function: "guided_inquiry" },
        { function: "guided_practice" },
        { function: "independent_performance" },
        { function: "verification" },
        { function: "reflection" },
        { function: "transfer" },
        { function: "transition" }
      ]
    },
    materials: [
      material(
        "A3-M1",
        "task_card",
        "Two claims about the rectangle",
        "Candidate claim 1 prefers (6,6). Candidate claim 2 prefers (5,5) among feasible alternatives."
      ),
      material(
        "A3-M2",
        "scenario",
        "A limited-resource allocation",
        "Current allocation (7,5). Proposed allocation (8,5). Fixed total 12."
      ),
      material(
        "A3-M3",
        "template",
        "Explain, reconsider and transfer",
        "**Original prediction:**\n\n\n**Resource-allocation decision:**\n\n"
      ),
      material(
        "A3-M4",
        "transfer_prompt",
        "Advise the resource manager",
        "Write a brief recommendation using the limited-resource allocation scenario."
      ),
      material(
        "A3-M5",
        "checklist",
        "Review your explanation and transfer",
        {
          review_mode: "guided_criteria",
          criteria: [
            {
              statement: "Have you identified the objective and restriction?",
              why_it_matters: "Roles must stay distinct.",
              features: [
                {
                  expected: "The area objective is identified.",
                  repair: "Connect the product of the dimensions to the objective."
                }
              ]
            }
          ]
        },
        "json"
      ),
      material(
        "A3-M6",
        "text",
        "Why the restriction changes the answer",
        [
          "## Review after completing your explanations",
          "",
          "The alternative (5,5) satisfies the required sum and has area 25.",
          "The proposed allocation (8,5) uses 13 resource units and is not permissible.",
          "",
          "Completing the square gives A(x,10-x)=25-(x-5)^2."
        ].join("\n")
      )
    ]
  };
}

function pageWithActivities(activities) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Understanding Constraints in Optimisation",
    activities: activities
  };
}

function momentHtml(html, activityId, kind) {
  const marker =
    'data-composition-moment="' + kind + '" data-activity-id="' + activityId + '"';
  const at = html.indexOf(marker);
  assert.ok(at >= 0, "missing " + kind + " moment for " + activityId);
  const start = html.lastIndexOf("<section", at);
  const next = html.indexOf('data-composition-moment="', at + marker.length);
  const end = next >= 0 ? next : html.length;
  return html.slice(start, end);
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
  const before = html.slice(Math.max(0, at - 420), at);
  const match = before.match(
    /<details class="util-composition-reveal[^"]*"([^>]*)>\s*<summary>([^<]*)<\/summary>\s*<div class="util-composition-reveal__body">\s*$/
  );
  if (!match) return null;
  return {
    summary: match[2],
    open: /\sopen(?:\s|=)/.test(match[1]),
    beforeLearn: before.indexOf('data-composition-moment="learn"') >= 0
  };
}

function render(page) {
  const rendered = renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(rendered.error, null, rendered.error && rendered.error.message);
  return String(rendered.html || "");
}

test("post-attempt detectors recognise Reveal/Review/Release after wording", () => {
  assert.equal(
    materialMatchesPostAttemptReveal({
      title: "Worked comparison",
      body: "## Reveal after completing your comparison\n\nDone."
    }),
    true
  );
  assert.equal(
    materialMatchesPostAttemptReveal({
      title: "Why the restriction changes the answer",
      body: "## Review after completing your explanations\n\nDone."
    }),
    true
  );
  assert.equal(
    materialMatchesPostAttemptReveal({
      title: "Feedback",
      body: "Release only after independent learner production.\n\nAnswer: 25."
    }),
    true
  );
  assert.equal(
    materialMatchesPostAttemptReveal({
      title: "Teaching text",
      body: "Use this table after you have completed your own comparison. It is not a post-attempt answer key."
    }),
    false
  );
  assert.equal(
    shouldDeferMaterialToCheck({
      type: "sample_output",
      title: "Worked comparison",
      body: "## Reveal after completing your comparison\n\n(5,5) area 25."
    }),
    true
  );
  assert.equal(
    shouldDeferMaterialToCheck({
      type: "text",
      title: "Why the restriction changes the answer",
      body: "## Review after completing your explanations\n\nArea 25."
    }),
    true
  );
  assert.equal(
    shouldDeferMaterialToCheck({
      type: "text",
      title: "How feasibility changes a comparison",
      body: "Area and feasibility need separate calculations."
    }),
    false
  );
  assert.equal(
    shouldDeferMaterialToCheck({
      type: "worked_example",
      title: "Practice on distinct data",
      body: "A separate practice set shows the method without answering the task."
    }),
    false
  );
});

test("A2 sample_output solution is withheld from Learn and available closed in Check", () => {
  const html = render(pageWithActivities([applyActivity()]));
  const learn = momentHtml(html, "A2", "learn");
  const check = momentHtml(html, "A2", "check");
  const doMoment = momentHtml(html, "A2", "do");

  assert.doesNotMatch(learn, /data-material-id="A2-M5"/);
  assert.doesNotMatch(learn, /Among the supplied feasible alternatives/);
  assert.doesNotMatch(doMoment, /data-material-id="A2-M5"/);
  assert.match(learn, /data-material-id="A2-M2"/);
  assert.match(learn, /Area and feasibility need separate calculations/);
  assert.match(doMoment, /data-material-id="A2-M3"/);

  assert.match(check, /data-material-id="A2-M5"/);
  assert.match(check, /data-material-id="A2-M4"/);
  const reveal = revealWrapping(html, "A2-M5");
  assert.ok(reveal, "A2-M5 must use deliberate disclosure");
  assert.equal(reveal.open, false);
  assert.equal(reveal.summary, "Review the example response");
  assert.match(articleHtml(html, "A2-M5"), /\(5,5\).*greatest area|greatest area.*\(5,5\)/s);
  assert.match(check, /Have you checked the perimeter restrictions/);
});

test("A3 Review-after text solution is withheld from Learn and available closed in Check", () => {
  const activity = analyseActivity();
  activity.materials.unshift(
    material(
      "A3-M0",
      "text",
      "What the constraint changes",
      "Before writing your explanation, recall that the objective measures area while the perimeter restriction defines which rectangles are permissible."
    )
  );
  const html = render(pageWithActivities([activity]));
  const learn = momentHtml(html, "A3", "learn");
  const check = momentHtml(html, "A3", "check");

  assert.match(learn, /data-material-id="A3-M0"/);
  assert.doesNotMatch(learn, /data-material-id="A3-M6"/);
  assert.doesNotMatch(learn, /proposed allocation \(8,5\) uses 13/);
  assert.doesNotMatch(learn, /A\(x,10-x\)=25-\(x-5\)\^2/);

  assert.match(check, /data-material-id="A3-M6"/);
  const reveal = revealWrapping(html, "A3-M6");
  assert.ok(reveal, "A3-M6 must use deliberate disclosure");
  assert.equal(reveal.open, false);
  assert.equal(reveal.summary, "Reveal verified feedback");
  assert.match(articleHtml(html, "A3-M6"), /proposed allocation \(8,5\) uses 13/);
  assert.match(check, /data-material-id="A3-M5"/);
  assert.match(check, /Have you identified the objective and restriction/);
});

test("pre-task explanations and legitimate worked examples stay visible in Learn", () => {
  const activity = applyActivity();
  activity.materials.push(
    material(
      "A2-M6",
      "worked_example",
      "Practice on a distinct rectangle",
      "A separate practice rectangle with sides 3 and 7 shows how to check x+y=10 without answering the four supplied cases."
    )
  );
  const html = render(pageWithActivities([activity]));
  const learn = momentHtml(html, "A2", "learn");
  assert.match(learn, /data-material-id="A2-M2"/);
  assert.match(learn, /data-material-id="A2-M6"/);
  assert.match(learn, /separate practice rectangle with sides 3 and 7/);
  assert.equal(revealWrapping(html, "A2-M2"), null);
  assert.equal(revealWrapping(html, "A2-M6"), null);
});
