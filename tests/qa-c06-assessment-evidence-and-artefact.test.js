/**
 * C06 QA (Assessment Pack, "Making an independent judgement about economic evidence").
 *
 * F01: the published page referred to a scatterplot and data table for dataset
 *      D09 that were authored on elicitation.representation but never reached
 *      the learner. The authored scatterplot and its accessible data table must
 *      now be published, exactly, before and throughout the response.
 * F04: output_specification reproduces the learner's CURRENT response. Authoring
 *      guidance must not claim an original / pre-feedback snapshot is preserved.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const publish = require("../lib/assessment-pack-publish.js");
const family = require("../lib/first-class-workflow-family.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");

const FIXTURE = path.join(__dirname, "fixtures", "assessment-pack-c06-design-page-d09-scatterplot.json");

function c06Page() {
  return JSON.parse(fs.readFileSync(FIXTURE, "utf8"));
}

function render(page) {
  const published = publish.resolveAssessmentPackPublishPage({ page: page });
  assert.equal(published.ok, true, published && published.message);
  return renderLearnerPageHtml(published.page, { compositionMode: "beats" });
}

function representationRegion(html) {
  const start = html.indexOf('data-region="assessment-representation"');
  assert.ok(start > -1, "assessment-representation region is published");
  const statistic = html.indexOf("util-assessment-representation__statistic", start);
  assert.ok(statistic > -1, "authored statistic is published as text");
  return html.slice(start, html.indexOf("</p>", statistic) + 4);
}

function pearson(pairs) {
  const n = pairs.length;
  const mx = pairs.reduce((s, p) => s + p[0], 0) / n;
  const my = pairs.reduce((s, p) => s + p[1], 0) / n;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  pairs.forEach((p) => {
    sxy += (p[0] - mx) * (p[1] - my);
    sxx += (p[0] - mx) ** 2;
    syy += (p[1] - my) ** 2;
  });
  return sxy / Math.sqrt(sxx * syy);
}

test("C06 F01: authored D09 evidence exists upstream and the stimulus depends on it", () => {
  const page = c06Page();
  const elicitation = page.assessment_evidence.elicitations[0];
  assert.match(elicitation.stimulus, /scatterplot and accompanying data table/);
  assert.equal(elicitation.representation.dataset_id, "D09");
  assert.equal(elicitation.representation.authoritative_data.observations.length, 8);
  assert.equal(elicitation.representation.accessible_equivalent.rows.length, 8);
});

test("C06 F01: r = 0.92 is independently reproduced from the eight D09 observations", () => {
  const rep = c06Page().assessment_evidence.elicitations[0].representation;
  const columns = rep.authoritative_data.columns;
  const xi = columns.indexOf(rep.plot_specification.x_axis.variable_id);
  const yi = columns.indexOf(rep.plot_specification.y_axis.variable_id);
  const r = pearson(rep.authoritative_data.observations.map((row) => [row[xi], row[yi]]));
  assert.ok(Math.abs(r - 0.918194918818221) < 1e-9, "r = " + r);
  assert.equal(Number(r.toFixed(rep.statistical_summary.display_precision)), rep.statistical_summary.display_value);
  assert.equal(rep.statistical_summary.display_value, 0.92);
});

test("C06 F01: published page contains the exact scatterplot and semantic data table", () => {
  const page = c06Page();
  const rep = page.assessment_evidence.elicitations[0].representation;
  const rendered = render(page);
  assert.equal(rendered.error, null, rendered.error);
  const html = rendered.html;
  const region = representationRegion(html);

  // Semantic table: caption, three column headers, eight exact rows.
  assert.equal((html.match(/<table/g) || []).length, 1);
  assert.match(region, /<caption>Vocational training and employee productivity: eight synthetic employee observations\.<\/caption>/);
  rep.accessible_equivalent.column_headers.forEach((header) => {
    assert.ok(region.indexOf('<th scope="col">' + header + "</th>") > -1, header);
  });
  const rows = region.match(/<tbody>[\s\S]*?<\/tbody>/)[0].match(/<tr>[\s\S]*?<\/tr>/g);
  assert.equal(rows.length, 8);
  rows.forEach((row, i) => {
    const cells = (row.match(/<td>([\s\S]*?)<\/td>/g) || []).map((c) => c.replace(/<\/?td>/g, ""));
    assert.deepEqual(cells, rep.authoritative_data.observations[i].map(String));
  });

  // Figure: eight points at the exact authored values; axes as authored; no added geometry.
  const points = region.match(/<circle class="util-scatterplot-point"[^>]*>/g) || [];
  assert.equal(points.length, 8);
  points.forEach((tag, i) => {
    assert.ok(tag.indexOf('data-x="' + rep.authoritative_data.observations[i][1] + '"') > -1, tag);
    assert.ok(tag.indexOf('data-y="' + rep.authoritative_data.observations[i][2] + '"') > -1, tag);
  });
  assert.ok(region.indexOf(">" + rep.plot_specification.x_axis.label + "</text>") > -1);
  assert.ok(region.indexOf(">" + rep.plot_specification.y_axis.label + "</text>") > -1);
  assert.equal(region.indexOf("<path"), -1, "no trend or regression line");
  assert.equal(/regression|trend/i.test(region), false);

  // Accessible name from the authored alt text; statistic available as text.
  assert.ok(region.indexOf("<desc") > -1);
  assert.ok(region.indexOf(rep.accessible_equivalent.alt_text) > -1);
  assert.match(region, /<p class="util-assessment-representation__statistic">Pearson correlation coefficient: r = 0\.92<\/p>/);
});

test("C06 F01: evidence precedes the response workspace and the interpretation is not supplied", () => {
  const rep = c06Page().assessment_evidence.elicitations[0].representation;
  const html = render(c06Page()).html;
  const region = representationRegion(html);
  const textarea = html.indexOf("<textarea");
  assert.ok(html.indexOf('data-region="assessment-representation"') < textarea);
  // Figure/table markup carries only authored neutral content (no interpretation).
  assert.equal(/strong|weak|positive|linear|causal|confound|selection|motivation|randomi/i.test(region), false, region.slice(0, 200));
  // Interpretive feedback stays in the hidden post-response region, unchanged.
  const reviewIndex = html.indexOf("Statistical interpretation");
  assert.ok(reviewIndex > textarea, "feedback follows the workspace");
  assert.match(html, /data-assessment-review-region[^>]*hidden|hidden[^>]*data-assessment-review-region/);
  assert.ok(rep.must_not_show.length > 0);
});

test("C06 F01: learner agency, response identity and journal registration are unchanged", () => {
  const html = render(c06Page()).html;
  const textarea = html.match(/<textarea[^>]*>/)[0];
  assert.equal(/readonly|disabled/i.test(textarea), false);
  assert.match(textarea, /id="assessment-constructed-E1"/);
  assert.match(html, /data-assessment-output-mode="assemble"/);
});

test("C06 F01: inconsistent authored evidence fails closed instead of publishing contradictions", () => {
  const cases = [
    ["table row differs from authoritative observation", (rep) => (rep.accessible_equivalent.rows[3][2] = 19)],
    ["declared sample size differs", (rep) => (rep.authoritative_data.sample_size = 9)],
    ["axis variable is not an authoritative column", (rep) => (rep.plot_specification.x_axis.variable_id = "hours")],
    ["table is missing", (rep) => delete rep.accessible_equivalent],
    ["observation value is not numeric", (rep) => (rep.authoritative_data.observations[2][1] = "n/a")]
  ];
  cases.forEach(([name, mutate]) => {
    const page = c06Page();
    mutate(page.assessment_evidence.elicitations[0].representation);
    const rendered = renderLearnerPageHtml(
      publish.resolveAssessmentPackPublishPage({ page: page }).page || page,
      { compositionMode: "beats" }
    );
    assert.ok(rendered.error, name + " must not publish");
    assert.match(String(rendered.error), /representation/, name);
    assert.ok(!rendered.html, name + " must not return html");
  });
});

test("Assessment elicitations without an authored scatterplot are unchanged", () => {
  const page = c06Page();
  delete page.assessment_evidence.elicitations[0].representation;
  const html = render(page).html;
  assert.equal(html.indexOf('data-region="assessment-representation"'), -1);
  assert.equal((html.match(/<table/g) || []).length, 0);
  assert.equal((html.match(/<svg/g) || []).length, 0);
});

const RULE = /reproduces the learner's current response text each time the learner uses it/;

test("C06 F04: authoring guidance states that the output reproduces the current response", () => {
  const focuses = [
    "Learning Journey Assessment Pack commission for Your first explanation. Learners must write an independent first explanation of a fictional research finding and retain that explanation for later revision and comparison. Do not automatically grade unrestricted writing.",
    "Learning Journey Assessment Pack for an economic evidence judgement. The learner writes one independent evaluation."
  ];
  focuses.forEach((focus) => {
    const built = family.buildFirstClassWorkflowFamily({ product: "assessment_pack", focus: focus, startingPoint: "topic" });
    assert.equal(built.ok, true);
    const body = built.steps[6].promptBody;
    assert.match(body, RULE);
    assert.match(body, /does not store the response as it stood before the formative return or before a revision/);
    assert.match(body, /must not state or imply that the page itself preserves a pre-feedback, original, or unrevised version/);
    assert.match(body, /If the commission requires a stored earlier version, report that the page cannot hold it/);
    // Closed contract wording that other regressions pin is unchanged.
    assert.match(body, /specification_id, artefact_title, audience, purpose, action_label, missing_response_text, sections/);
  });
});

test("C06 F04: the retained-response example no longer primes an automatic 'original words' claim", () => {
  const built = family.buildFirstClassWorkflowFamily({
    product: "assessment_pack",
    focus:
      "Learning Journey Assessment Pack commission for Your first explanation. Learners must write an independent first explanation and retain that explanation for later revision and comparison.",
    startingPoint: "topic"
  });
  const body = built.steps[6].promptBody;
  assert.equal(body.indexOf("retention of the learner's original words"), -1);
  assert.match(body, /purpose stating that it reproduces the learner's own words as they stand when used/);
  assert.match(body, /You, for later revision and comparison/);
});

// ---------------------------------------------------------------------------
// Retained artefacts are the learner's CURRENT authored text, possibly revised
// after feedback: upstream guidance must not promise preservation of an
// initial / pre-feedback version or describe the text as independent / unaided.
// ---------------------------------------------------------------------------
const sibling = require("../lib/learning-journey-sibling-prompts.js");
const journeyDesign = require("../lib/learning-journey-design-page.js");

const ACCURACY = /A retained response is the learner's current written work, which the learner may have revised after feedback/;

test("C06 F04: Assessment Pack guidance (purpose to design stages) describes retained responses as current work", () => {
  const built = family.buildFirstClassWorkflowFamily({
    product: "assessment_pack",
    focus: "Learning Journey Assessment Pack for an economic evidence judgement. The learner writes one evaluation.",
    startingPoint: "topic"
  });
  assert.equal(built.ok, true);
  const bodies = built.steps.map((step) => step.promptBody || "");
  const carrying = bodies.filter((body) => ACCURACY.test(body));
  assert.ok(carrying.length >= 2, "accuracy rule reaches the evidence-purpose and design stages");
  carrying.forEach((body) => {
    assert.match(body, /Do not call it initial, first, original, pre-feedback, unrevised, independent, or unaided/);
    assert.match(body, /cannot verify independence, the conditions under which it was written, or which version it is/);
  });
  assert.match(bodies[6], /Apply the retained-response description above to artefact_title, purpose, section headings, contribution labels, and action_label/);
});

test("C06 F04: Learning Journey Design Page journal guidance does not promise an earlier version", () => {
  const prompt = journeyDesign.buildLearningJourneyDesignPagePrompt();
  assert.match(prompt, /Each entry shows the learner's current authored text, which they may have revised after feedback/);
  assert.match(prompt, /Do not describe an entry as the learner's initial, first, original, pre-feedback, unrevised, independent or unaided response/);
  assert.match(prompt, /do not promise that an earlier version is preserved/);
  // Existing producer-preservation guidance (entry inclusion) is unchanged.
  assert.match(prompt, /emit an entry for EVERY declared producer/);
  assert.match(prompt, /\{commission_id\}\.\{elicitation_id\}/);
});

test("C06 F04: Step 4 commissioning guidance names producers by artefact, not by version", () => {
  const commission = String(sibling.TEMPLATES.learning_commissions);
  assert.match(commission, /A Journal producer supplies the learner's current constructed text/);
  assert.match(commission, /may revise after feedback/);
  assert.match(commission, /do not specify that an initial, first, original or pre-feedback response must be preserved, and do not describe a Journal artefact as independent or unaided work/);
  assert.match(commission, /State a stable primary response\/elicitation_id for each journalable producer/);
});

test("Retained C06 artefact keeps its identity, persistence hooks and early access to feedback", () => {
  const html = render(c06Page()).html;
  assert.match(html, /id="assessment-constructed-E1"/);
  assert.match(html, /data-assessment-open-review/);
  assert.match(html, /data-assessment-output-spec=/);
  // The stored specification is published unchanged (no snapshot semantics added).
  const spec = c06Page().assessment_evidence.output_specification;
  assert.equal(spec.specification_id, "C06.E1");
  assert.equal(spec.sections[0].contributions[0].elicitation_id, "E1");
});

// ---------------------------------------------------------------------------
// Formative material bodies keep their authored paragraph boundaries.
// ---------------------------------------------------------------------------
function materialHtml(html, materialId) {
  const start = html.indexOf('data-material-id="' + materialId + '"');
  assert.ok(start > -1, materialId + " is published");
  return html.slice(start, html.indexOf("</article>", start));
}

test("formative material bodies preserve authored paragraph boundaries (C06 E1.FR01)", () => {
  const page = c06Page();
  const body = page.assessment_evidence.elicitations[0].formative_return.materials.find(
    (m) => m.material_id === "E1.FR01"
  ).body;
  const authored = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  assert.ok(authored.length > 3, "fixture body is multi-paragraph");
  const article = materialHtml(render(page).html, "E1.FR01");
  const rendered = (article.match(/<p>[\s\S]*?<\/p>/g) || []).map((p) => p.replace(/<\/?p>/g, ""));
  assert.equal(rendered.length, authored.length);
  rendered.forEach((text, i) => {
    assert.equal(text.replace(/&amp;/g, "&").replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"'), authored[i]);
  });
  assert.equal(/<p>[^<]*\n\s*\n/.test(article), false, "no paragraph still contains a blank line");
});

test("formative material text stays escaped and single-paragraph bodies are unchanged", () => {
  const page = c06Page();
  const materials = page.assessment_evidence.elicitations[0].formative_return.materials;
  materials[0].body = "First <script>alert(1)</script> & line\n\nSecond paragraph.";
  materials[1].body = "A single paragraph with no blank line.";
  const html = render(page).html;
  const first = materialHtml(html, materials[0].material_id);
  assert.match(first, /<p>First &lt;script&gt;alert\(1\)&lt;\/script&gt; &amp; line<\/p><p>Second paragraph\.<\/p>/);
  assert.equal(first.indexOf("<script"), -1);
  assert.match(materialHtml(html, materials[1].material_id), /<p>A single paragraph with no blank line\.<\/p>/);
});

test("guided self-evaluation panels preserve authored paragraph boundaries", () => {
  const page = c06Page();
  const elicitation = page.assessment_evidence.elicitations[0];
  elicitation.formative_return.materials = [
    { material_id: "E1.SE1", title: "Self-evaluation 1 of 2", body: "Para one.\n\nPara two." },
    { material_id: "E1.SE2", title: "Self-evaluation 2 of 2", body: "Only one paragraph." }
  ];
  const html = render(page).html;
  const panel = html.slice(html.indexOf('data-material-id="E1.SE1"'));
  assert.match(panel.slice(0, panel.indexOf("</section>")), /<p>Para one\.<\/p><p>Para two\.<\/p>/);
});

// ---------------------------------------------------------------------------
// Axis ticks and scale labels come from the authored plot_specification.
// (Regression: authored tick_interval was not normalised, so no ticks rendered.)
// ---------------------------------------------------------------------------
function svgOf(html) {
  const start = html.indexOf("<svg");
  return html.slice(start, html.indexOf("</svg>", start));
}

function tickLabels(svg, anchor) {
  return [...svg.matchAll(new RegExp('text-anchor="' + anchor + '"[^>]*fill="#334155">([^<]*)</text>', "g"))].map((m) =>
    Number(m[1])
  );
}

function range(min, max, step) {
  const out = [];
  for (let v = min; v <= max; v += step) out.push(v);
  return out;
}

test("C06 scatterplot shows numerical tick labels from the authored axis specification", () => {
  const rep = c06Page().assessment_evidence.elicitations[0].representation;
  const x = rep.plot_specification.x_axis;
  const y = rep.plot_specification.y_axis;
  const svg = svgOf(render(c06Page()).html);
  assert.deepEqual(tickLabels(svg, "middle"), range(x.minimum, x.maximum, x.tick_interval));
  assert.deepEqual(tickLabels(svg, "end"), range(y.minimum, y.maximum, y.tick_interval));
  // Tick marks and gridlines exist for every tick, in addition to the two axis lines.
  const ticksX = range(x.minimum, x.maximum, x.tick_interval).length;
  const ticksY = range(y.minimum, y.maximum, y.tick_interval).length;
  assert.equal((svg.match(/<line/g) || []).length, 2 + 2 * (ticksX + ticksY));
});

test("C06 scatterplot points sit at the scale positions implied by the authored axes", () => {
  const rep = c06Page().assessment_evidence.elicitations[0].representation;
  const x = rep.plot_specification.x_axis;
  const y = rep.plot_specification.y_axis;
  const svg = svgOf(render(c06Page()).html);
  // Plot area used by the shared renderer: left 74, right 576, top 24, bottom 318.
  const points = [...svg.matchAll(/<circle[^>]*cx="([\d.]+)" cy="([\d.]+)"[^>]*data-x="([^"]+)" data-y="([^"]+)"/g)];
  assert.equal(points.length, 8);
  points.forEach((m) => {
    const px = 74 + ((Number(m[3]) - x.minimum) / (x.maximum - x.minimum)) * (576 - 74);
    const py = 318 - ((Number(m[4]) - y.minimum) / (y.maximum - y.minimum)) * (318 - 24);
    assert.ok(Math.abs(Number(m[1]) - px) < 0.01, "x position for " + m[3]);
    assert.ok(Math.abs(Number(m[2]) - py) < 0.01, "y position for " + m[4]);
  });
});

test("scatterplot without an authored tick_interval still shows a numerical scale", () => {
  const page = c06Page();
  const spec = page.assessment_evidence.elicitations[0].representation.plot_specification;
  delete spec.x_axis.tick_interval;
  delete spec.y_axis.tick_interval;
  const svg = svgOf(render(page).html);
  assert.ok(tickLabels(svg, "middle").length >= 2);
  assert.ok(tickLabels(svg, "end").length >= 2);
});
