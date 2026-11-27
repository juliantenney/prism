/**
 * Sprint 104 F12 — a template material whose response sections are fully realised as
 * workspaces must not leave an orphaned title-only container behind. Unconsumed content
 * stays visible; ordinary materials and response workspaces are unchanged.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");
const {
  parseTemplateSections,
  templateResidualBody
} = require("../lib/learner-renderer-vnext/parse-template-sections.js");

const EPISODE_PLAN = {
  archetype: "apply",
  beats: [
    { function: "activation" },
    { function: "explanation" },
    { function: "independent_performance" },
    { function: "verification" }
  ]
};

function pageWith(materials, requiredOverrides) {
  const required = materials.map(function (m) {
    return Object.assign(
      { material_id: m.material_id, material_type: m.material_type, purpose: "p", specification: "s" },
      (requiredOverrides && requiredOverrides[m.material_id]) || {}
    );
  });
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: "Diagnostic tests",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    page_synthesis: { overview: { body: "Overview.", format: "markdown" } },
    learning_outcomes: [{ id: "LO1", statement: "Calculate sensitivity and specificity." }],
    episode_plans: [
      { activity_id: "A1", mapped_learning_outcome_ids: ["LO1"], episode_plan: EPISODE_PLAN }
    ],
    activities: [
      {
        activity_id: "A1",
        title: "Calculate",
        learner_task: "Calculate sensitivity and specificity from the table.",
        expected_output: "Two proportions.",
        activity_preamble: "Use the table.",
        duration_minutes: 3,
        mapped_learning_outcomes: ["LO1"],
        episode_plan: EPISODE_PLAN,
        required_materials: required,
        materials: materials
      }
    ],
    learning_sequence: {
      total_duration_minutes: 3,
      ordered_activity_ids: ["A1"],
      timeline: [{ activity_id: "A1", duration_minutes: 3, start_seconds: 0, end_seconds: 180 }]
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["episode_plan", "dla", "gam", "learning_sequence", "design_page"]
    }
  };
}

function render(materials, requiredOverrides) {
  const result = renderLearnerPageHtml(pageWith(materials, requiredOverrides), {
    includeRuntimeScripts: false,
    compositionMode: "moments"
  });
  assert.equal(result.error, null, result.error);
  return result.html;
}

const TABLE = {
  material_id: "A1-M1",
  material_type: "data_table",
  title: "Test results",
  body_format: "markdown",
  body: "| | D+ | D- |\n|---|---|---|\n| T+ | 90 | 20 |\n| T- | 10 | 80 |"
};

const NOTE = {
  material_id: "A1-M2",
  material_type: "text",
  title: "Reading the table",
  body_format: "markdown",
  body: "Rows show the test result; columns show the true condition."
};

function template(id, title, body) {
  return { material_id: id, material_type: "template", title: title, body_format: "markdown", body: body };
}

const SENSITIVITY = template(
  "A1-M4",
  "Calculate sensitivity",
  "**Numerator:** Enter the number of true positives.\n\n" +
    "**Denominator:** Enter the number of people with the condition.\n\n" +
    "**Sensitivity (%):** Enter the proportion as a percentage."
);
const SPECIFICITY = template(
  "A1-M7",
  "Calculate specificity",
  "### Numerator\nEnter the number of true negatives.\n\n" +
    "### Denominator\nEnter the number of people without the condition.\n\n" +
    "### Specificity (%)\nEnter the proportion as a percentage."
);

function materialArticle(html, materialId) {
  const re = new RegExp('<article[^>]*data-material-id="' + materialId + '"[^>]*>[\\s\\S]*?</article>');
  const match = html.match(re);
  return match ? match[0] : null;
}

function workspaceLabels(html) {
  const out = [];
  const re = /<label[^>]*util-learner-workspace__label[^>]*>([\s\S]*?)<\/label>/g;
  let m;
  while ((m = re.exec(html)) !== null) out.push(m[1].replace(/<[^>]+>/g, "").trim());
  return out;
}

function workspaceIds(html) {
  return Array.from(html.matchAll(/data-workspace-id="([^"]+)"/g)).map((m) => m[1]);
}

test("fully consumed templates leave no orphaned title container (bold-label and heading forms)", () => {
  const html = render([TABLE, SENSITIVITY, SPECIFICITY]);

  assert.equal(materialArticle(html, "A1-M4"), null, "A1-M4 shell suppressed");
  assert.equal(materialArticle(html, "A1-M7"), null, "A1-M7 shell suppressed");
  assert.doesNotMatch(html, />Calculate sensitivity</);
  assert.doesNotMatch(html, />Calculate specificity</);
  assert.doesNotMatch(html, /data-response-composed="true"/);

  // Every response field, label and instruction is still realised.
  assert.deepEqual(workspaceLabels(html), [
    "Numerator",
    "Denominator",
    "Sensitivity (%)",
    "Numerator",
    "Denominator",
    "Specificity (%)"
  ]);
  [
    "Enter the number of true positives.",
    "Enter the number of people with the condition.",
    "Enter the proportion as a percentage.",
    "Enter the number of true negatives.",
    "Enter the number of people without the condition."
  ].forEach(function (instruction) {
    assert.ok(html.includes(instruction), "instruction retained: " + instruction);
  });
});

test("response identity and persistence keys are unchanged by suppressing the shell", () => {
  const html = render([TABLE, SENSITIVITY, SPECIFICITY]);
  const ids = workspaceIds(html);
  assert.equal(new Set(ids).size, 6);
  assert.ok(ids.includes("learner-workspace-a1-a1-template-section-a1-m4-section-numerator-1"));
  assert.ok(ids.includes("learner-workspace-a1-a1-template-section-a1-m4-section-sensitivity-3"));
  assert.ok(ids.includes("learner-workspace-a1-a1-template-section-a1-m7-section-specificity-3"));
  assert.equal((html.match(/<textarea/g) || []).length, 6);
});

test("commissioned math response fields remain math workspaces after suppression", () => {
  const html = render([TABLE, SENSITIVITY], {
    "A1-M4": {
      response_fields: [
        { label: "Numerator", input_modality: "math" },
        { label: "Denominator", input_modality: "math" },
        { label: "Sensitivity (%)", input_modality: "math" }
      ]
    }
  });
  assert.equal(materialArticle(html, "A1-M4"), null);
  const withShell = render([TABLE, Object.assign({}, SENSITIVITY, { body: "Work through the steps.\n\n" + SENSITIVITY.body })], {
    "A1-M4": {
      response_fields: [
        { label: "Numerator", input_modality: "math" },
        { label: "Denominator", input_modality: "math" },
        { label: "Sensitivity (%)", input_modality: "math" }
      ]
    }
  });
  // Same workspace markup with or without a retained introduction.
  const strip = (h) => (h.match(/<div class="util-learner-workspace[\s\S]*?<\/div>/g) || []).join("");
  assert.equal(strip(html), strip(withShell));
  assert.deepEqual(workspaceLabels(html), ["Numerator", "Denominator", "Sensitivity (%)"]);
});

test("partially consumed template keeps its unconsumed content beneath the title", () => {
  const partial = template(
    "A1-M5",
    "Calculate prevalence",
    "Use the totals row of the table before answering.\n\n" +
      "**Prevalence (%):** Enter the proportion with the condition."
  );
  const html = render([TABLE, partial]);
  const article = materialArticle(html, "A1-M5");
  assert.ok(article, "shell retained because content remains");
  assert.match(article, /data-response-composed="true"/);
  assert.match(article, />Calculate prevalence</);
  assert.match(article, /Use the totals row of the table before answering\./);
  assert.doesNotMatch(article, /Prevalence \(%\)/, "consumed section is not duplicated in the shell");
  assert.deepEqual(workspaceLabels(html), ["Prevalence (%)"]);
  assert.ok(html.includes("Enter the proportion with the condition."));
});

test("heading-form template keeps leading text and the skipped evidence list", () => {
  const body =
    "Read the evidence first.\n\n" +
    "### Evidence assessed against criteria\n- Table of results\n- Totals row\n\n" +
    "### Judgement\nRecord your judgement.";
  const t = template("A1-M6", "Judge the evidence", body);
  assert.deepEqual(
    parseTemplateSections(body).map((s) => s.label),
    ["Judgement"]
  );
  const residual = templateResidualBody(body);
  assert.match(residual, /Read the evidence first\./);
  assert.match(residual, /Table of results/);
  assert.doesNotMatch(residual, /Record your judgement/);

  const html = render([TABLE, t]);
  const article = materialArticle(html, "A1-M6");
  assert.ok(article);
  assert.match(article, /Read the evidence first\./);
  assert.match(article, /Table of results/);
  assert.deepEqual(workspaceLabels(html), ["Judgement"]);
});

test("ordinary materials and their headings are unaffected", () => {
  const html = render([TABLE, NOTE, SENSITIVITY]);
  const table = materialArticle(html, "A1-M1");
  assert.ok(table);
  assert.match(table, /Test results/);
  assert.match(table, /<td>90<\/td>/);
  const note = materialArticle(html, "A1-M2");
  assert.ok(note, "text material still rendered");
  assert.match(note, /Reading the table/);
  assert.match(note, /Rows show the test result; columns show the true condition\./);
  assert.doesNotMatch(note, /data-response-composed/);
  assert.equal(materialArticle(html, "A1-M4"), null);
});

test("templateResidualBody: wholly consumed, preamble, and empty bodies", () => {
  assert.equal(templateResidualBody(SENSITIVITY.body), "");
  assert.equal(templateResidualBody(SPECIFICITY.body), "");
  assert.equal(templateResidualBody(""), "");
  assert.equal(templateResidualBody(null), "");
  assert.equal(templateResidualBody("Intro.\n\n**A:** one\n\n**B:** two"), "Intro.");
  assert.equal(templateResidualBody("Intro.\n\n### A\none"), "Intro.");
  // Bodies with no response sections are not "consumed": everything remains.
  assert.equal(templateResidualBody("Just prose."), "Just prose.");
  assert.deepEqual(parseTemplateSections("Just prose."), []);
});

test("a template with no response sections is not response-composed and renders as before", () => {
  const prose = template("A1-M8", "Worked layout", "Just prose with no response labels.");
  const html = render([TABLE, prose]);
  const article = materialArticle(html, "A1-M8");
  assert.ok(article);
  assert.match(article, /Worked layout/);
  assert.match(article, /Just prose with no response labels\./);
  assert.doesNotMatch(article, /data-response-composed/);
});
