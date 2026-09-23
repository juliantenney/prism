/**
 * Sprint 87 T-003 — Expository chapter form (EQ7 / EQ8) + Design Page sections safety.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const sibling = require("../lib/expository-sibling-prompts.js");
const contracts = require("../lib/expository-contracts.js");
const assemble = require("../lib/page-vnext-assemble.js");
const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model.js");
const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext/render-learner-page.js");

function baseEjp() {
  return contracts.normalizeExpositoryJourneyPlan({
    title: "Interpretive weightings",
    audience: "learners",
    journey_intent: "Preserve disagreement as the learning object.",
    commissioned_purpose:
      "explain why informed interpreters can assign different causal weight to broadly shared evidence",
    epistemic_form: "competing interpretive weightings",
    learning_outcomes: [
      { id: "LO1", statement: "Explain how shared evidence can support different weightings." }
    ],
    sections: [
      {
        section_id: "s1",
        title: "Shared evidence",
        purpose: "Common ground",
        knowledge_focus: "shared facts",
        conceptual_move: "establish"
      },
      {
        section_id: "s2",
        title: "Why weightings diverge",
        purpose: "Consolidate plurality",
        knowledge_focus: "weighting disagreement",
        conceptual_move: "consolidate"
      }
    ]
  });
}

function baseXd() {
  return contracts.normalizeExpositoryDevelopment({
    sections: [
      {
        section_id: "s1",
        explanation_intent: "Set shared evidence.",
        exposition: "Interpreters often begin from a shared evidentiary base."
      },
      {
        section_id: "s2",
        explanation_intent: "Consolidate why weightings differ.",
        exposition:
          "What the learner can now see is how legitimate disagreement persists even when the evidence is shared: the question is weighting, not inventing different facts."
      }
    ]
  });
}

test("EQ7: Expository DP prompt does not require/default overview / learning_purpose / knowledge_summary", () => {
  const dp = sibling.resolveTemplate("design_page");
  assert.match(dp, /Do NOT generate by default/i);
  assert.match(dp, /page_synthesis\.overview/);
  assert.match(dp, /page_synthesis\.learning_purpose/);
  assert.match(dp, /page_synthesis\.knowledge_summary/);
  assert.match(dp, /normally empty object/i);
  assert.doesNotMatch(dp, /page_synthesis\.overview \/ learning_purpose \/ knowledge_summary as thin transport/i);
});

test("EQ8: Expository DP prompt does not require/default closing_paragraph", () => {
  const dp = sibling.resolveTemplate("design_page");
  assert.match(dp, /page_synthesis\.closing_paragraph/);
  assert.match(dp, /final substantive XD exposition section owns/i);
  assert.match(dp, /Do NOT add a separate page-level Closing/i);
  assert.doesNotMatch(dp, /closing_paragraph — brief learner-facing closure after the authored exposition \(optional/i);
});

test("EQ8: XD prompt notes final section owns form-appropriate consolidation", () => {
  const xd = sibling.resolveTemplate("expository_development");
  assert.match(xd, /Final section consolidation \(EQ8\)/i);
  assert.match(xd, /final substantive section owns/i);
  assert.match(xd, /legitimate plurality/i);
});

test("EQ7/EQ8: normal assembled Expository page has no prospectus furniture or page-level close", () => {
  const result = assemble.assembleVNextPageFromPartials({
    expository_journey_plan: baseEjp(),
    expository_development: baseXd(),
    design_page: {
      artifact_type: "page",
      schema_version: "2.0.0",
      title: "Interpretive weightings",
      page_synthesis: {},
      assembly_state: { current_stage: "design_page", enriched_by: ["design_page"] }
    }
  });
  assert.equal(result.ok, true);
  assert.equal(result.page.title, "Interpretive weightings");
  assert.deepEqual(result.page.page_synthesis, {});
  assert.equal(result.page.page_synthesis.overview, undefined);
  assert.equal(result.page.page_synthesis.learning_purpose, undefined);
  assert.equal(result.page.page_synthesis.knowledge_summary, undefined);
  assert.equal(result.page.page_synthesis.closing_paragraph, undefined);
  assert.equal(result.page.sections.length, 2);
  assert.match(result.page.sections[1].exposition, /legitimate disagreement persists/i);
  assert.equal(
    result.page.expository_journey.commissioned_purpose,
    baseEjp().commissioned_purpose
  );
  assert.equal(result.page.expository_journey.epistemic_form, "competing interpretive weightings");
  assert.deepEqual(result.page.learning_outcomes, []);
  assert.ok(Array.isArray(result.page.expository_journey.learning_outcomes));
  assert.equal(result.page.expository_journey.learning_outcomes.length, 1);
});

test("EQ7/EQ8: stale DP prospectus + closing furniture is stripped on Expository assemble", () => {
  const result = assemble.assembleVNextPageFromPartials({
    expository_journey_plan: baseEjp(),
    expository_development: baseXd(),
    design_page: {
      artifact_type: "page",
      schema_version: "2.0.0",
      title: "Interpretive weightings",
      page_synthesis: {
        overview: "This resource will cover weighting.",
        learning_purpose: "You will learn about historians.",
        knowledge_summary: "Causes come in levels.",
        closing_paragraph: "In summary, one neat model explains the war."
      },
      assembly_state: { current_stage: "design_page", enriched_by: ["design_page"] }
    }
  });
  assert.equal(result.ok, true);
  assert.equal(result.page.page_synthesis.overview, undefined);
  assert.equal(result.page.page_synthesis.closing_paragraph, undefined);
  assert.deepEqual(Object.keys(result.page.page_synthesis), []);
});

test("DP sections safety: conflicting Expository DP sections cannot overwrite authoritative XD exposition", () => {
  const result = assemble.assembleVNextPageFromPartials({
    expository_journey_plan: baseEjp(),
    expository_development: baseXd(),
    design_page: {
      artifact_type: "page",
      schema_version: "2.0.0",
      title: "Hijacked title still ok",
      sections: [
        {
          section_id: "s1",
          title: "REPLACED",
          exposition: "Malicious overwrite of exposition."
        }
      ],
      page_synthesis: {},
      assembly_state: { current_stage: "design_page", enriched_by: ["design_page"] }
    }
  });
  assert.equal(result.ok, true);
  assert.equal(result.page.title, "Hijacked title still ok");
  assert.equal(result.page.sections.length, 2);
  assert.equal(result.page.sections[0].title, "Shared evidence");
  assert.match(result.page.sections[0].exposition, /shared evidentiary base/i);
  assert.doesNotMatch(result.page.sections[0].exposition, /Malicious overwrite/i);
  assert.ok(!assemble.EXPOSITORY_DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS.includes("sections"));
  assert.ok(assemble.DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS.includes("sections"));
});

test("Renderer: normal new Expository shape has title + sections, no Overview/Closing regions", () => {
  const result = assemble.assembleVNextPageFromPartials({
    expository_journey_plan: baseEjp(),
    expository_development: baseXd(),
    design_page: {
      artifact_type: "page",
      schema_version: "2.0.0",
      title: "Interpretive weightings",
      page_synthesis: {},
      assembly_state: { current_stage: "design_page", enriched_by: ["design_page"] }
    }
  });
  const model = buildPageModel(result.page);
  assert.equal(model.ok, true, JSON.stringify(model.errors || []));
  assert.equal(model.model.title, "Interpretive weightings");
  assert.equal(model.model.orientationSections.length, 0);
  assert.equal(String(model.model.closingParagraph || "").trim(), "");
  assert.equal(model.model.expositionSections.length, 2);
  assert.match(model.model.expositionSections[1].explanation, /legitimate disagreement persists/i);

  const html = String(renderLearnerPageHtml(result.page).html || "");
  assert.match(html, /<h1[^>]*>Interpretive weightings<\/h1>/i);
  assert.match(html, /data-region="exposition"/);
  assert.doesNotMatch(html, /data-region="orientation"/);
  assert.doesNotMatch(html, /data-orientation-type="overview"/);
  assert.doesNotMatch(html, /data-orientation-type="learning_purpose"/);
  assert.doesNotMatch(html, /data-orientation-type="knowledge_summary"/);
  assert.doesNotMatch(html, /data-region="page-closing"/);
  assert.doesNotMatch(html, />Closing</);
  assert.doesNotMatch(html, /commissioned_purpose/i);
  assert.doesNotMatch(html, /epistemic_form/i);
});

test("Legacy/generic page model may still render orientation + closing when fields present", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Legacy page",
    activities: [],
    sections: [],
    page_synthesis: {
      overview: "Legacy overview text.",
      learning_purpose: "Legacy purpose.",
      knowledge_summary: "Legacy summary.",
      closing_paragraph: "Legacy closing sentence."
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["episode_plan", "design_page"]
    }
  };
  const model = buildPageModel(page);
  assert.equal(model.ok, true);
  assert.ok(model.model.orientationSections.length >= 1);
  assert.match(model.model.closingParagraph, /Legacy closing/i);
  const html = String(renderLearnerPageHtml(page).html || "");
  assert.match(html, /data-region="orientation"/);
  assert.match(html, /Overview/i);
  assert.match(html, /data-region="page-closing"/);
});

test("Interactive Design Page ownership still includes sections (shared list unchanged)", () => {
  assert.ok(assemble.DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS.includes("sections"));
  assert.ok(assemble.DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS.includes("page_synthesis"));
});
