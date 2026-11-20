/**
 * Sprint 101E — Practice editorial opening image is required and reaches Graphics.
 * Cross-checks Interactive / Expository / Assessment Pack editorial routes.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const editorial = require("../lib/expository-editorial-opening.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const practiceContracts = require("../lib/ld-practice-presentation-contracts.js");

function editorialBriefs(pipeline) {
  return (pipeline.compilerResult.briefs || []).filter(function (brief) {
    return brief && brief.editorial_opening === true;
  });
}

function openingGenerate(overrides) {
  return Object.assign(
    {
      decision: "generate",
      subject: "Restrained practice atmosphere",
      context: "Decorative opening; no solutions or classifications.",
      caption_intent: "Establish context without spoiling the task.",
      alt_text: "",
      detailed_description:
        "A decorative, text-free scene establishing atmosphere for the resource. It contains no overlays, labels, or answer-bearing content."
    },
    overrides || {}
  );
}

function practicePageNoInstructionalGraphics() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: "Evaluate what multiplier solutions establish",
    page_synthesis: {
      overview: {
        body: "Judge what follows from multiplier calculations.",
        format: "markdown"
      }
    },
    activities: [
      {
        activity_id: "A1",
        title: "Judge claims",
        learner_task: "Evaluate three claims."
      },
      {
        activity_id: "A3",
        title: "Counterexample",
        learner_task: "Examine the cubic case."
      }
    ],
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [
      {
        activity_id: "A1",
        activity_visual_value: {
          decision: "low",
          rationale: "Claims already inspectable in text."
        }
      },
      {
        activity_id: "A3",
        activity_visual_value: {
          decision: "low",
          rationale: "Text scenario sufficient for this fixture."
        }
      }
    ],
    visual_affordances: [],
    editorial_opening_image: openingGenerate({
      subject: "Quiet mathematical study desk for constrained optimisation practice"
    }),
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["design_page"],
      calls_model: true
    }
  };
}

function interactivePage() {
  const base = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "fixtures", "page-render", "roman-roads-page.json"),
      "utf8"
    )
  );
  base.product_id = "interactive";
  base.title = "Interactive editorial route";
  base.visual_affordance_schema_version = "38.4";
  base.activities_visual_review = [
    {
      activity_id: "A1",
      activity_visual_value: { decision: "low", rationale: "Text sufficient." }
    }
  ];
  base.visual_affordances = [];
  base.editorial_opening_image = openingGenerate({
    subject: "Quiet archive corridor"
  });
  base.assembly_state = {
    current_stage: "design_page",
    enriched_by: ["design_page"],
    calls_model: true
  };
  return base;
}

function expositoryPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Expository editorial route",
    expository_journey: { chapter_id: "ch-1" },
    sections: [{ section_id: "S1", title: "Opening" }],
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [],
    visual_affordances: [],
    editorial_opening_image: openingGenerate({
      subject: "Chapter atmosphere scene"
    }),
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["expository_development", "design_page"],
      calls_model: true
    }
  };
}

function assessmentPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Assessment editorial route",
    activities: [],
    assessment_evidence: {
      elicitations: []
    },
    editorial_opening_image: openingGenerate({
      subject: "Assessment context atmosphere"
    }),
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["design_page"],
      calls_model: true
    }
  };
}

test("101E: Practice with empty instructional visuals still commissions editorial opening", () => {
  const page = practicePageNoInstructionalGraphics();
  assert.equal(editorial.isPracticePage(page), true);
  assert.equal(editorial.isInteractivePage(page), false);

  const brief = editorial.buildEditorialOpeningBrief(page);
  assert.ok(brief);
  assert.equal(brief.editorial_opening, true);
  assert.equal(brief.editorial_product, "practice");

  const ws = workspace.buildVisualJobsWorkspaceState(page);
  assert.equal(ws.contractResult.valid, true, JSON.stringify(ws.contractResult.errors));
  const briefs = editorialBriefs(ws);
  assert.equal(briefs.length, 1);
  assert.equal(workspace.countAuthoringGraphicsJobs(ws), 1);
  assert.match(workspace.renderVisualJobsWorkspaceHtml(ws), /Editorial opening/i);
});

test("101E: Practice skip editorial produces no Graphics editorial job (no hidden fallback)", () => {
  const page = practicePageNoInstructionalGraphics();
  page.editorial_opening_image = {
    decision: "skip",
    skip_reason: "Legacy optional skip — must not invent a job."
  };
  assert.equal(editorial.buildEditorialOpeningBrief(page), null);
  const ws = workspace.buildVisualJobsWorkspaceState(page);
  assert.equal(editorialBriefs(ws).length, 0);
});

test("101E: Interactive generate editorial reaches Graphics", () => {
  const page = interactivePage();
  assert.equal(editorial.isInteractivePage(page), true);
  const brief = editorial.buildEditorialOpeningBrief(page);
  assert.ok(brief);
  assert.equal(brief.editorial_product, "interactive");
  const ws = workspace.buildVisualJobsWorkspaceState(page);
  assert.equal(editorialBriefs(ws).length, 1);
});

test("101E: Expository generate editorial reaches Graphics", () => {
  const page = expositoryPage();
  assert.equal(editorial.isExpositoryPage(page), true);
  const brief = editorial.buildEditorialOpeningBrief(page);
  assert.ok(brief);
  assert.equal(brief.editorial_product, "expository");
  const ws = workspace.buildVisualJobsWorkspaceState(page);
  assert.equal(editorialBriefs(ws).length, 1);
});

test("101E: Assessment Pack generate editorial reaches Graphics", () => {
  const page = assessmentPage();
  assert.equal(editorial.isAssessmentPackPage(page), true);
  const brief = editorial.buildEditorialOpeningBrief(page);
  assert.ok(brief);
  assert.equal(brief.editorial_product, "assessment_pack");
  const ws = workspace.buildVisualJobsWorkspaceState(page);
  assert.equal(editorialBriefs(ws).length, 1);
});

test("101E: Practice contract version marks required editorial opening", () => {
  assert.match(practiceContracts.CONTRACT_VERSION, /101[EFG]-/);
  const block = practiceContracts.buildPracticePresentationContractBlock("design_page");
  assert.match(block, /editorial_opening_image: REQUIRED/);
  assert.match(
    block,
    /Empty instructional visual_affordances is valid and does not remove the required editorial opening image/
  );
});
