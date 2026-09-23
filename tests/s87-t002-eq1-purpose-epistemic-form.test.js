/**
 * Sprint 87 T-002 — EQ1 commissioned_purpose + epistemic_form on Expository EJP.
 *
 * Bounded: Expository-only contract, sibling prompts, assembly metadata stamp.
 * Does not cover EQ7/EQ8/AD-010/typography.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const contracts = require("../lib/expository-contracts.js");
const sibling = require("../lib/expository-sibling-prompts.js");
const assemble = require("../lib/page-vnext-assemble.js");

function baseEjp(overrides) {
  return Object.assign(
    {
      title: "Sample chapter",
      audience: "learners",
      journey_intent: "Build understanding progressively.",
      commissioned_purpose:
        "explain why informed interpreters can assign different causal weight to broadly shared evidence",
      epistemic_form: "competing interpretive weightings",
      sections: [
        {
          section_id: "s1",
          title: "Shared evidence",
          purpose: "Establish the common evidentiary base",
          knowledge_focus: "shared facts",
          conceptual_move: "set the common ground"
        },
        {
          section_id: "s2",
          title: "Divergent weightings",
          purpose: "Show how interpreters weight evidence differently",
          knowledge_focus: "weighting disagreement",
          conceptual_move: "preserve plurality"
        }
      ]
    },
    overrides || {}
  );
}

test("EQ1: EJP accepts valid commissioned_purpose + epistemic_form", () => {
  const check = contracts.validateExpositoryArtefactShape(
    baseEjp(),
    "expository_journey_plan"
  );
  assert.equal(check.ok, true);
  assert.equal(
    check.normalized.commissioned_purpose,
    "explain why informed interpreters can assign different causal weight to broadly shared evidence"
  );
  assert.equal(check.normalized.epistemic_form, "competing interpretive weightings");
});

test("EQ1: missing/empty commissioned_purpose fails validation", () => {
  const missing = contracts.validateExpositoryArtefactShape(
    baseEjp({ commissioned_purpose: undefined }),
    "expository_journey_plan"
  );
  // normalize clears undefined → empty
  const empty = contracts.validateExpositoryArtefactShape(
    baseEjp({ commissioned_purpose: "   " }),
    "expository_journey_plan"
  );
  assert.equal(missing.ok, false);
  assert.match(missing.errors.join("; "), /commissioned_purpose required/i);
  assert.equal(empty.ok, false);
  assert.match(empty.errors.join("; "), /commissioned_purpose required/i);
});

test("EQ1: missing/empty epistemic_form fails validation", () => {
  const empty = contracts.validateExpositoryArtefactShape(
    baseEjp({ epistemic_form: "" }),
    "expository_journey_plan"
  );
  assert.equal(empty.ok, false);
  assert.match(empty.errors.join("; "), /epistemic_form required/i);
});

test("EQ1: free-text epistemic_form is preserved — not enum-normalised", () => {
  const form =
    "deductive validity contrasted with everyday appraisal of persuasiveness";
  const ejp = contracts.normalizeExpositoryJourneyPlan(
    baseEjp({
      commissioned_purpose:
        "Distinguish formal validity from everyday judgements of persuasiveness",
      epistemic_form: "  " + form + "  "
    })
  );
  assert.equal(ejp.epistemic_form, form);
  assert.doesNotMatch(ejp.epistemic_form, /^mechanism$/i);
  assert.doesNotMatch(ejp.epistemic_form, /^interpretation$/i);
  const check = contracts.validateExpositoryArtefactShape(ejp, "expository_journey_plan");
  assert.equal(check.ok, true);
  assert.equal(check.normalized.epistemic_form, form);
});

test("EQ1: EJP sibling prompt requires both fields and purpose-fit preservation", () => {
  const ejp = sibling.resolveTemplate("expository_journey_plan");
  assert.match(ejp, /commissioned_purpose/i);
  assert.match(ejp, /epistemic_form/i);
  assert.match(ejp, /Purpose-fit \/ epistemic form/i);
  assert.match(ejp, /neighbouring/i);
  assert.match(ejp, /not a closed list/i);
  assert.match(ejp, /user\/workflow topic or commission/i);
  assert.match(ejp, /commissioned_purpose \(required non-empty\)/i);
  assert.match(ejp, /epistemic_form \(required non-empty free text\)/i);
});

test("EQ1: XD sibling prompt treats EJP purpose/form as binding", () => {
  const xd = sibling.resolveTemplate("expository_development");
  assert.match(xd, /commissioned_purpose/i);
  assert.match(xd, /epistemic_form/i);
  assert.match(xd, /binding/i);
  assert.match(xd, /Do not silently replan/i);
  assert.match(xd, /explanation_intent designs the explanation/i);
  assert.match(xd, /exposition is the explanation/i);
  assert.match(xd, /do not invent a replacement epistemic form/i);
});

test("EQ1: assembled Expository metadata preserves both fields", () => {
  const ejp = contracts.normalizeExpositoryJourneyPlan(
    baseEjp({
      commissioned_purpose:
        "Explain how light-driven electron transfer produces ATP and NADPH",
      epistemic_form: "mechanism and causal sequence"
    })
  );
  const xd = contracts.normalizeExpositoryDevelopment({
    sections: [
      {
        section_id: "s1",
        explanation_intent: "establish shared ground",
        exposition: "Shared evidence is introduced as common ground."
      },
      {
        section_id: "s2",
        explanation_intent: "show mechanism steps",
        exposition: "Electron transfer proceeds through ordered carriers."
      }
    ]
  });
  const result = assemble.assembleVNextPageFromPartials({
    expository_journey_plan: ejp,
    expository_development: xd
  });
  assert.equal(result.ok, true);
  const page = result.page;
  assert.equal(
    page.expository_journey.commissioned_purpose,
    "Explain how light-driven electron transfer produces ATP and NADPH"
  );
  assert.equal(page.expository_journey.epistemic_form, "mechanism and causal sequence");
});

test("EQ1: fields do not automatically create learner-facing orientation furniture", () => {
  const ejp = contracts.normalizeExpositoryJourneyPlan(baseEjp());
  const xd = contracts.normalizeExpositoryDevelopment({
    sections: [
      {
        section_id: "s1",
        explanation_intent: "open",
        exposition: "Opening prose for the commissioned purpose."
      },
      {
        section_id: "s2",
        explanation_intent: "develop",
        exposition: "Development preserves competing weightings."
      }
    ]
  });
  const result = assemble.assembleVNextPageFromPartials({
    expository_journey_plan: ejp,
    expository_development: xd
  });
  assert.equal(result.ok, true);
  const page = result.page;
  assert.ok(page.expository_journey.commissioned_purpose);
  assert.ok(page.expository_journey.epistemic_form);
  // Metadata only — not stamped into page_synthesis orientation fields.
  assert.equal(page.page_synthesis.overview, undefined);
  assert.equal(page.page_synthesis.learning_purpose, undefined);
  assert.equal(page.page_synthesis.knowledge_summary, undefined);
  assert.deepEqual(page.page_synthesis, {});
  // Not injected as a fake orientation section.
  assert.equal(page.sections.length, 2);
  assert.ok(!page.sections.some((s) => /commissioned_purpose|epistemic_form/i.test(s.title)));
});

test("EQ1: Interactive assemble path unchanged (episode_plan does not require EQ1 fields)", () => {
  const episode = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Interactive episode",
    audience: "learners",
    page_profile: { profile_type: "learner" },
    page_synthesis: {},
    activities: [
      {
        activity_id: "a1",
        title: "Warm-up",
        activity_type: "discussion",
        learner_task: "Discuss the prompt.",
        expected_output: "Short oral contribution"
      }
    ],
    sections: [],
    learning_outcomes: [],
    episode_plans: [],
    source_artefacts: [],
    generation_notes: {},
    assembly_state: {
      current_stage: "episode_plan",
      enriched_by: ["episode_plan"]
    }
  };
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: episode
  });
  assert.equal(result.ok, true);
  assert.equal(result.page.title, "Interactive episode");
  assert.equal(result.page.activities.length, 1);
  assert.equal(result.page.expository_journey, undefined);
});

test("EQ1: Interactive sibling prompts remain free of Expository EQ1 fields", () => {
  // Shared Interactive step-pattern bodies must not gain Expository EQ1 fields.
  const stepPatterns = fs.readFileSync(
    path.join(__dirname, "..", "domains/learning-design/domain-learning-design-step-patterns.md"),
    "utf8"
  );
  const glcIdx = stepPatterns.indexOf("## 2. Generate Learning Content");
  const mkIdx = stepPatterns.indexOf("## 3. Model Knowledge");
  assert.ok(glcIdx !== -1 && mkIdx !== -1);
  const glcChunk = stepPatterns.slice(glcIdx, mkIdx);
  assert.doesNotMatch(glcChunk, /commissioned_purpose/);
  assert.doesNotMatch(glcChunk, /epistemic_form/);
  assert.doesNotMatch(glcChunk, /expositoryPromptTemplate/);
  // Expository EQ1 lives only in Expository sibling prompt module.
  assert.match(sibling.resolveTemplate("expository_journey_plan"), /commissioned_purpose/);
});
