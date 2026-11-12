/**
 * C1 "Your first explanation" publishing completeness:
 * research-study evidence authored as delivery.stimulus_text must appear in
 * published learner HTML before the constructed-response workspace.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const publish = require("../lib/assessment-pack-publish.js");
const family = require("../lib/first-class-workflow-family.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");

const FIXTURE = path.join(__dirname, "fixtures", "assessment-pack-legacy-retain-first-explanation.json");

function c1Page() {
  return JSON.parse(fs.readFileSync(FIXTURE, "utf8"));
}

function publishedHtml(page) {
  const published = publish.resolveAssessmentPackPublishPage({ page: page });
  assert.equal(published.ok, true, published && published.message);
  const rendered = renderLearnerPageHtml(published.page, { compositionMode: "beats" });
  assert.equal(rendered.error, null, rendered.error);
  assert.ok(typeof rendered.html === "string" && rendered.html.length, "published HTML missing");
  return { published: published, html: rendered.html };
}

test("C1 stimulus_text study evidence appears in published HTML before the workspace", () => {
  const page = c1Page();
  assert.ok(page.assessment_evidence.elicitations[0].delivery.stimulus_text);
  assert.equal(page.assessment_evidence.elicitations[0].stimulus, undefined);
  assert.equal(page.assessment_evidence.elicitations[0].delivery.stimulus, undefined);

  const { html } = publishedHtml(page);
  const stimulusAt = html.indexOf('data-region="assessment-stimulus"');
  const workspaceAt = html.indexOf('data-workspace-kind="text_entry"');
  assert.ok(stimulusAt >= 0, "study stimulus region missing from published HTML");
  assert.ok(workspaceAt > stimulusAt, "study evidence must precede the constructed workspace");

  assert.match(html, /Study breaks and concentration among undergraduate students/);
  assert.match(html, /fictional, illustrative research study/);
  assert.match(
    html,
    /Is taking regular short breaks during independent study associated with students reporting good concentration\?/
  );
  assert.match(html, /observational survey of 200 undergraduate students/);
  assert.match(html, /Group A: Regular short breaks/);
  assert.match(html, /100 students/);
  assert.match(html, /72 reporting good concentration/);
  assert.match(html, /72%/);
  assert.match(html, /Group B: No regular short breaks/);
  assert.match(html, /58 reporting good concentration/);
  assert.match(html, /58%/);
  assert.match(html, /14 percentage points/);
  assert.match(html, /not a randomised experiment/);
  assert.match(html, /Methodological limitations/);
  assert.match(html, /No statistical significance, confidence interval or causal effect/);

  // Constructed response stays unmarked; no determinate check control.
  assert.match(html, /Your response is not marked correct or incorrect/);
  assert.doesNotMatch(html, /data-assessment-check="true"/);
  assert.doesNotMatch(html, /data-auto-checkable="true"/);
});

test("authoritative structured delivery.stimulus still publishes without stimulus_text recovery", () => {
  const page = c1Page();
  const delivery = page.assessment_evidence.elicitations[0].delivery;
  delete delivery.stimulus_text;
  delivery.stimulus = {
    title: "Committee traffic case",
    scenario: "A local authority must choose one traffic-management option for the school approach.",
    alternatives: [
      {
        id: "A",
        label: "Timed restrictions",
        description: "Restrict through traffic at drop-off and pick-up."
      }
    ],
    evidence: [
      {
        id: "EV1",
        heading: "Parent petition",
        information: "A petition records concern about congestion near the school gates.",
        qualification: "Petitions capture concern but do not measure collision risk."
      }
    ],
    evidence_boundary: "The evidence does not determine a single correct option."
  };

  const { html } = publishedHtml(page);
  assert.match(html, /data-stimulus-kind="structured"/);
  assert.match(html, /Timed restrictions/);
  assert.match(html, /Parent petition/);
  assert.doesNotMatch(html, /Study breaks and concentration among undergraduate students/);
});

test("elicitation stage forbids placing required findings only in stimulus_text", () => {
  const built = family.buildFirstClassWorkflowFamily({
    product: "assessment_pack",
    focus: "Learners write an independent first explanation of a fictional research finding and retain it.",
    startingPoint: "topic"
  });
  assert.equal(built.ok, true);
  const elicitation = built.steps[4];
  assert.match(
    elicitation.promptBody,
    /Do not place required findings, methods, or figures only in delivery\.stimulus_text/
  );
  assert.match(elicitation.promptBody, /elicitation\.stimulus \(prose\) or delivery\.stimulus/);
});
