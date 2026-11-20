/**
 * Sprint 101D — Practice learner-page render/package smoke.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const buildPageModel = require("../lib/learner-renderer-vnext/build-page-model.js");
const { renderPage } = require("../lib/learner-renderer-vnext/render-page.js");
const learnerPackage = require("../lib/learner-package.js");
const workload = require("../lib/learning-journey-workload-feasibility-adapter.js");

function practicePageFixture() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: "Seeing gradients — practice",
    page_synthesis: {
      overview: {
        body: "Use the fixed-perimeter rectangle to judge feasibility and first-order change.",
        format: "markdown"
      }
    },
    editorial_opening_image: {
      decision: "skip",
      skip_reason: "Journey framing already orients the learner."
    },
    activities: [
      {
        activity_id: "A1",
        title: "Predict increase versus feasibility",
        learner_task:
          "Classify (2,8), (4,6) and (6,6) for feasibility and area, then explain the distinction.",
        expected_output: "Classifications plus a short distinction between area and feasibility.",
        activity_preamble: "Keep area increase and constraint satisfaction as separate claims.",
        episode_plan: {
          archetype: "apply",
          beats: [
            { id: "orient", function: "framing" },
            { id: "model", function: "worked_thinking" },
            { id: "do", function: "guided_practice" },
            { id: "check", function: "verification" }
          ]
        },
        materials: [
          {
            material_id: "A1-M1",
            material_type: "text",
            title: "Working apparatus",
            body: "Maximise \\(A(x,y)=xy\\) subject to \\(x+y=10\\), \\(x>0\\), \\(y>0\\)."
          },
          {
            material_id: "A1-M2",
            material_type: "sample_output",
            title: "Reveal after attempt: model distinction",
            body:
              "Reveal after your attempt. (2,8) and (4,6) are feasible; (6,6) has larger area but breaks the perimeter."
          }
        ],
        required_materials: [
          {
            material_id: "A1-M1",
            type: "text",
            purpose: "stimulus",
            specification: "Working formulae"
          },
          {
            material_id: "A1-M2",
            type: "sample_output",
            purpose: "feedback",
            specification: "Post-attempt model"
          }
        ]
      }
    ],
    assembly_state: {
      current_stage: "design_page",
      enriched_by: [
        "episode_plan",
        "learning_activities",
        "activity_materials",
        "learning_sequence",
        "design_page"
      ],
      calls_model: true
    }
  };
}

test("Practice page builds with pageKind practice and renders learner HTML", () => {
  const page = practicePageFixture();
  const built = buildPageModel.buildPageModel(page);
  assert.equal(built.ok, true, JSON.stringify(built.errors || [], null, 2));
  assert.equal(built.model.pageKind, "practice");
  const html = renderPage(built.model, { includeRuntimeScripts: true });
  assert.match(html, /Seeing gradients/i);
  assert.match(html, /data-page-kind="practice"/);
  assert.ok(/A\s*\(\s*x\s*,\s*y\s*\)|xy|\\\\?\(A/.test(html) || html.includes("A(x,y)") || html.includes("xy"));
});

test("Practice page packages without requiring knowledge summary", () => {
  const page = practicePageFixture();
  const built = buildPageModel.buildPageModel(page);
  assert.equal(built.ok, true);
  const html = renderPage(built.model, { includeRuntimeScripts: true });
  const result = learnerPackage.buildLearnerPackage({
    html: html,
    title: page.title,
    pageSlug: "seeing-gradients-practice"
  });
  assert.equal(result.ok, true, JSON.stringify(result.error || result, null, 2));
  assert.match(String(result.package && result.package.html), /Seeing gradients/i);
  assert.equal(result.package.metadata.html_entry, "learner-page.html");
});

test("workload adapter maps Practice commissions like Interactive activity work", () => {
  const mapped = workload.mapCommissionToEstimatorInput({
    commission_id: "c-practice-1",
    product_id: "practice",
    title: "Practice stop",
    specification_text:
      "Learners write approximately 120 words of constructed reasoning with feedback and a short revision opportunity. Approximate learner time: 30 minutes."
  });
  assert.ok(mapped, "expected estimator mapping for Practice commission with demand signals");
  assert.equal(mapped.productId, "practice");
  assert.ok(mapped.input && mapped.input.activityType);
});
