"use strict";

/**
 * Guided-review generation quality refinement — GAM prompt/contract surfaces.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const patternLib = require("../lib/instructional-pattern-prompt.js");
const gamContract = require("../lib/ld-gam-page-enrich-contract.js");
const quality = require("../lib/guided-review-generation-contract.js");
const guidedParse = require("../lib/learner-renderer-vnext/parse-guided-checklist.js");
const { renderMaterial } = require("../lib/learner-renderer-vnext/render-material");
const parseMaterial = require("../lib/learner-renderer-vnext/parse-material");
const gamFormat = require("../lib/gam-output-format.js");

function deepExamplePayload() {
  return {
    review_mode: "guided_criteria",
    criteria: [
      {
        statement: "Have you identified the correct role of each replication component?",
        why_it_matters:
          "If roles are collapsed or swapped, the response cannot show how the replication system actually works.",
        features: [
          {
            expected: "IRES is connected to translation initiation.",
            repair:
              "State that the IRES recruits ribosomes to viral RNA, enabling translation without conventional cap-dependent initiation."
          },
          {
            expected: "microRNA-122 is connected to viral RNA stability.",
            repair:
              "Explain that microRNA-122 binding protects the HCV genome and supports its availability for translation and replication."
          },
          {
            expected: "NS5A and NS5B are assigned distinct but connected functions.",
            repair:
              "Distinguish NS5A’s coordinating role from NS5B’s RNA-polymerase activity, then explain why successful replication requires both."
          }
        ],
        confirmation_label: "My response now meets this criterion"
      }
    ]
  };
}

test("generation guidance requests 2–3 features normally", () => {
  const sp05 = patternLib.buildSp05PromptBlock();
  const enrich = gamContract.buildGamPageEnrichContractBlock();
  assert.match(sp05, /normally emit 2–3 independently observable/i);
  assert.match(enrich, /normally emit 2–3 independently observable/i);
  assert.match(sp05, /hard maximum 4|maximum 4/i);
  assert.match(enrich, /maximum 4/i);
  assert.doesNotMatch(sp05, /features:\s*1–4 objects/i);
  assert.doesNotMatch(enrich, /features:\s*1–4 objects/i);
});

test("generation guidance requires paired expected/repair and discipline-specific repairs", () => {
  const sp05 = patternLib.buildSp05PromptBlock();
  assert.match(sp05, /Every expected feature MUST have a paired repair/i);
  assert.match(sp05, /discipline-specific reasoning operation/i);
  assert.match(sp05, /appropriate disciplinary language/i);
  assert.match(sp05, /without supplying a complete replacement answer/i);
});

test("generation guidance prohibits generic-only repairs", () => {
  const sp05 = patternLib.buildSp05PromptBlock();
  const enrich = gamContract.buildGamPageEnrichContractBlock();
  [sp05, enrich].forEach((block) => {
    assert.match(block, /Forbidden as stand-alone repairs \(generic-only\)/i);
    assert.match(block, /revisit\/review the material/i);
    assert.match(block, /add more detail/i);
    assert.match(block, /use precise terminology/i);
    assert.match(block, /immediately followed by the specific content/i);
  });
});

test("generation guidance forbids complete model-answer repairs", () => {
  const sp05 = patternLib.buildSp05PromptBlock();
  assert.match(sp05, /complete model answer or finished deliverable/i);
  assert.match(sp05, /MP-1/i);
});

test("runtime SP-05 and Prompt Factory enrich contract stay consistent", () => {
  const sp05 = patternLib.buildSp05PromptBlock();
  const enrich = gamContract.buildGamPageEnrichContractBlock();
  const shared = quality.buildGuidedReviewGenerationGuidanceLines().join("\n");
  assert.match(sp05, /guided_criteria/);
  assert.match(enrich, /guided_criteria/);
  assert.match(sp05, /normally emit 2[\u2013\-]3 independently observable/i);
  assert.match(enrich, /normally emit 2[\u2013\-]3 independently observable/i);
  assert.match(shared, /normally emit 2[\u2013\-]3 independently observable/i);
  assert.match(sp05, /IRES recruits ribosomes/i);
  assert.match(enrich, /IRES recruits ribosomes/i);
  assert.match(gamContract.buildCanonicalGamMaterialShapeSnippet(), /microRNA-122/i);
});

test("soft diagnostics: deep guided body is clean", () => {
  const report = quality.diagnoseGuidedReviewGenerationQuality(deepExamplePayload());
  assert.equal(report.guided, true);
  assert.equal(report.ok, true);
  assert.equal(report.diagnostics.length, 0);
});

test("soft diagnostics: one-feature body warns but remains parseable/renderable", () => {
  const thin = {
    review_mode: "guided_criteria",
    criteria: [
      {
        statement: "Have you explained the mechanism?",
        why_it_matters: "Without a mechanism, facts do not show causal reasoning.",
        features: [
          {
            expected: "A cause-to-effect sentence",
            repair: "Add one sentence naming how evidence produces the claimed outcome."
          }
        ]
      },
      {
        statement: "Have you used scenario evidence?",
        why_it_matters: "Generic claims could fit any case.",
        features: [
          {
            expected: "One scenario-specific detail",
            repair: "Replace one general claim with a detail unique to this scenario."
          }
        ]
      }
    ]
  };
  const report = quality.diagnoseGuidedReviewGenerationQuality(thin);
  assert.equal(report.guided, true);
  assert.ok(report.diagnostics.some((d) => d.code === "GUIDED_REVIEW_FEATURE_DEPTH_THIN"));

  const parsed = guidedParse.parseGuidedChecklist(thin);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.model.mode, "guided_review");
  assert.equal(parsed.model.guidedCriteria.length, 2);

  const material = parseMaterial.buildMaterialModel(
    {
      material_id: "A1-M4",
      material_type: "checklist",
      title: "Review",
      body_format: "json",
      body: thin
    },
    0
  );
  const html = renderMaterial(material);
  assert.match(html, /data-guided-review="true"/);
});

test("soft diagnostics: generic repair-only treatment is flagged", () => {
  assert.equal(quality.looksGenericRepairOnly("Revisit any component whose purpose is unclear."), true);
  assert.equal(quality.looksGenericRepairOnly("Replace vague descriptions with precise terms."), true);
  assert.equal(quality.looksGenericRepairOnly("Add links showing how one component supports another."), true);
  assert.equal(
    quality.looksGenericRepairOnly(
      "State that the IRES recruits ribosomes to viral RNA, enabling translation without conventional cap-dependent initiation."
    ),
    false
  );

  const report = quality.diagnoseGuidedReviewGenerationQuality({
    review_mode: "guided_criteria",
    criteria: [
      {
        statement: "Have you identified roles?",
        why_it_matters: "Accuracy matters for quality.",
        features: [
          { expected: "Roles named", repair: "Revisit the material." },
          { expected: "Links shown", repair: "Add more detail." }
        ]
      }
    ]
  });
  assert.ok(report.diagnostics.some((d) => d.code === "GUIDED_REVIEW_REPAIR_GENERIC"));
  assert.ok(report.diagnostics.some((d) => d.code === "GUIDED_REVIEW_WHY_GENERIC"));
});

test("soft diagnostics: model-answer-sized repair is flagged", () => {
  const essay =
    "Write a complete finished answer covering IRES recruitment of ribosomes for cap-independent translation. " +
    "Then explain microRNA-122 genome protection in full. " +
    "Next distinguish NS5A coordination from NS5B polymerase catalysis in a finished multi-sentence account. " +
    "Finally produce the complete learner deliverable describing the entire replication system end to end with all components.";
  assert.equal(quality.looksCompleteModelAnswer(essay), true);
  const report = quality.diagnoseGuidedReviewGenerationQuality({
    review_mode: "guided_criteria",
    criteria: [
      {
        statement: "Have you identified roles?",
        why_it_matters: "Collapsed roles hide how the replication system works.",
        features: [
          { expected: "IRES linked to initiation", repair: essay },
          {
            expected: "NS5A vs NS5B distinguished",
            repair: "Distinguish NS5A coordination from NS5B polymerase activity for this pathway."
          }
        ]
      }
    ]
  });
  assert.ok(report.diagnostics.some((d) => d.code === "GUIDED_REVIEW_REPAIR_MODEL_ANSWER"));
});

test("legacy Markdown checklist guidance and rendering remain unchanged", () => {
  const sp05 = patternLib.buildSp05PromptBlock();
  assert.match(sp05, /Simple Markdown bullet checklists remain valid/i);
  const material = parseMaterial.buildMaterialModel(
    {
      material_id: "A1-M4",
      material_type: "checklist",
      title: "Check",
      body_format: "markdown",
      body: "- Criterion one\n- Criterion two\n\n### If any check is not met:\nRevise and retry."
    },
    0
  );
  assert.equal(material.checklist.mode, "simple");
  const html = renderMaterial(material);
  assert.match(html, /util-checklist-block|util-interactive-checklist/);
  assert.doesNotMatch(html, /data-guided-review="true"/);
});

test("pack-text GAM output contract advises guided-review feature depth", () => {
  const prompt = gamFormat.buildGamOutputContractSystemPrompt();
  assert.match(prompt, /2–3 independently observable expected\/repair pairs/i);
  assert.match(prompt, /generic-only repairs/i);
});
