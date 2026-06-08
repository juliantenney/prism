/**
 * Sprint 38-S — Activity Materials → Page body projection (GAM preserve merge).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const fidelity = require(path.join(repoRoot, "lib", "design-page-materials-fidelity.js"));
const {
  applyGamMaterialsToComposedPage,
  parseUpstreamActivityMaterialsCapture,
  findLearningActivitiesRows
} = require(path.join(repoRoot, "lib", "page-gam-materials-preserve.js"));

const gamJsonPath = path.join(
  repoRoot,
  "docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/EV-38S-AFTER-4-gam.json"
);

const fullM1Body =
  "Inflation is the general increase in prices of goods and services over time, which reduces the purchasing power of money. " +
  "The Consumer Price Index (CPI) measures the average change over time in prices paid by urban consumers for a fixed basket of goods and services. " +
  "The GDP Deflator measures the change in prices of all domestically produced goods and services in an economy.";

test("synopsis detector flags description-only material strings", () => {
  assert.equal(
    fidelity.looksLikeMaterialDescriptionSynopsis(
      "Scenario comparison showing difference between demand-pull and cost-push inflation."
    ),
    true
  );
  assert.equal(
    fidelity.looksLikeMaterialDescriptionSynopsis(
      "Example showing demand-pull inflation reasoning with a short household illustration."
    ),
    true
  );
  assert.equal(fidelity.stringLooksPlaceholderOnly("Inflation refers to a sustained increase in prices."), true);
  assert.equal(fidelity.looksLikeMaterialDescriptionSynopsis(fullM1Body), false);
});

test("findLearningActivitiesRows resolves nested content.content wrapper", () => {
  const page = {
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: {
          content: [{ activity_id: "A1", materials: {} }]
        }
      }
    ]
  };
  const rows = findLearningActivitiesRows(page);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].activity_id, "A1");
});

test("parseUpstreamActivityMaterialsCapture reads EV GAM JSON activities[]", () => {
  const gam = JSON.parse(fs.readFileSync(gamJsonPath, "utf8"));
  const upstream = parseUpstreamActivityMaterialsCapture(gam, null);
  assert.ok(Array.isArray(upstream));
  assert.ok(upstream.length >= 4);
  assert.ok(upstream[0].materials && upstream[0].materials.length > 0);
  assert.ok(String(upstream[0].materials[0].content || "").length > 200);
});

test("GAM preserve replaces synopsis page materials with full activity_materials bodies", () => {
  const gam = JSON.parse(fs.readFileSync(gamJsonPath, "utf8"));
  const page = {
    artifact_type: "page",
    title: "Inflation workbook",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            activity_id: "A1",
            title: "Understanding Inflation Measurement Methods",
            learner_task: "Read and classify.",
            materials: {
              text: "Inflation refers to a sustained increase in general prices.",
              worked_example: "Example showing demand-pull inflation reasoning in brief."
            }
          }
        ]
      }
    ]
  };
  const merged = applyGamMaterialsToComposedPage(page, gam.activities);
  const rows = findLearningActivitiesRows(merged);
  assert.equal(rows.length, 1);
  const text = String(rows[0].materials.text || "");
  assert.ok(text.length > 500, "expected full M1 explanation body, got len=" + text.length);
  assert.match(text, /Consumer Price Index \(CPI\)/);
  const worked = String(rows[0].materials.worked_example || "");
  assert.ok(worked.length > 400, "expected full worked example body");
  assert.match(worked, /Step 1:/i);
  assert.equal(merged.metadata.gam_materials_preserve_applied, true);
});
