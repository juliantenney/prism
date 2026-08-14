/**
 * Post–Sprint 77 bounded GAM output-contract repair:
 * ordinary materials emit markdown string bodies; only guided-review checklists may use JSON.
 */

"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const gamContract = require("../lib/ld-gam-page-enrich-contract.js");
const gamEnrich = require("../lib/page-gam-enrich.js");

function assertOrdinaryMarkdownBodyRule(text) {
  const body = String(text || "");
  assert.match(body, /Material body representation \(capture-binding\)/i);
  assert.match(body, /Ordinary authored materials/i);
  assert.match(body, /body_format must be "markdown"/i);
  assert.match(body, /non-empty Markdown string/i);
  assert.match(body, /workspaces, scenario sets, worked problem sets, tables/i);
  assert.match(body, /Do not emit object-valued JSON bodies/i);
  assert.match(body, /Specialised JSON body is capture-supported only for checklist materials/i);
  assert.match(body, /guided_criteria/);
}

function guidedCriteriaPayload() {
  return {
    review_mode: "guided_criteria",
    criteria: [
      {
        statement: "Have you used the given values?",
        why_it_matters: "Without the given values the response is not about this task.",
        features: [
          { expected: "Names the given values", repair: "Insert the given values from the material." }
        ]
      },
      {
        statement: "Have you stated a conclusion?",
        why_it_matters: "A conclusion is required.",
        features: [
          { expected: "States a conclusion", repair: "Add one concluding sentence." }
        ]
      },
      {
        statement: "Have you avoided generic filler?",
        why_it_matters: "Generic filler does not show applied judgement.",
        features: [
          { expected: "Uses task-specific language", repair: "Replace one generic sentence with a task-specific detail." }
        ]
      }
    ]
  };
}

function buildPartial(material) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "gam", enriched_by: ["gam"] },
    activities: [
      {
        activity_id: "A1",
        materials: [
          Object.assign(
            {
              material_id: "A1-M1",
              material_type: "workspace",
              activity_id: "A1",
              title: "Workspace"
            },
            material
          )
        ]
      }
    ]
  };
}

test("canonical GAM contract states ordinary markdown string bodies", () => {
  const block = gamContract.buildGamPageEnrichContractBlock();
  const shape = gamContract.buildCanonicalGamMaterialShapeSnippet();
  assertOrdinaryMarkdownBodyRule(block);
  assert.match(shape, /body_format "json" or object-valued body on non-checklist materials/);
  assert.match(shape, /workspace \/ scenario_set \/ worked_problem_set/);
  assert.match(block, /body_format: "json"/);
  assert.match(shape, /"body_format": "json"/);
  assert.match(shape, /"body_format": "markdown"/);
  assert.match(shape, /Demand-pull and cost-push/);
});

test("ordinary workspace JSON body remains rejected by capture", () => {
  const check = gamEnrich.validateGamPartialPageCapture(
    buildPartial({
      material_type: "workspace",
      body_format: "json",
      body: { kind: "workspace", rows: [] }
    })
  );
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((err) => /body required/i.test(err)), check.errors.join("; "));
  assert.ok(
    check.errors.some((err) => /body_format must be "markdown"/i.test(err)),
    check.errors.join("; ")
  );
});

test("ordinary markdown string body with a table remains accepted", () => {
  const check = gamEnrich.validateGamPartialPageCapture(
    buildPartial({
      material_type: "workspace",
      body_format: "markdown",
      body: "| Observation | Notes |\n| --- | --- |\n| Sample A | |"
    })
  );
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("guided-review checklist JSON body remains allowed", () => {
  const check = gamEnrich.validateGamPartialPageCapture(
    buildPartial({
      material_id: "A1-M4",
      material_type: "checklist",
      title: "Response quality review",
      body_format: "json",
      body: guidedCriteriaPayload()
    })
  );
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});
