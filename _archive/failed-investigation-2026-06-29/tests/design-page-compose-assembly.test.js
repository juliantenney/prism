/**
 * Design Page compose — assembly semantics vs regeneration (prompt contract).
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const compose = require("../lib/ld-design-page-compose-contract.js");
const fidelity = require("../lib/design-page-materials-fidelity.js");

const FULL_CHECKLIST =
  "### Evaluation checklist\n\n" +
  "- [ ] Item one with criterion text.\n" +
  "- [ ] Item two with criterion text.\n" +
  "- [ ] Item three with criterion text.\n" +
  "- [ ] Item four with criterion text.";

const SPEC_TEXT = "checklist with 4 items evaluating table completion";

function pageWithMaterial(activityId, materialId, type, content) {
  return {
    artifact_type: "page",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: activityId,
            title: "Composed activity framing is allowed",
            learner_task: "Learner-facing composed task instructions.",
            materials: {
              [materialId]: { material_id: materialId, type: type, content: content }
            }
          }
        ]
      }
    ]
  };
}

test("contract: material bodies remain authoritative in upstream GAM", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /Material bodies remain authoritative in upstream GAM/i);
  assert.match(text, /not regeneration of material bodies from specifications/i);
  assert.match(text, /material_bank/i);
});

test("contract: page framing may be composed but inlined bodies may not be abbreviated", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /ALLOWED composition:.*overview.*learning_purpose/is);
  assert.match(text, /FORBIDDEN on material bodies:.*do not regenerate from required_materials specifications/is);
  assert.match(text, /read-only composition of page structure/i);
});

test("contract: source precedence without budget failure semantics", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /SOURCE PRECEDENCE \(hard\)/i);
  assert.match(text, /no full generated body exists upstream, return page_generation_failure/i);
  assert.match(text, /do not recommend activity_chunked_composition_required/i);
  assert.doesNotMatch(text, /SINGLE-SHOT BUDGET RULE/i);
});

test("Case 1 — regeneration from spec is invalid when full upstream body exists", () => {
  const page = pageWithMaterial("A2", "M6", "checklist", "- [ ] Regenerated item one\n- [ ] Regenerated item two");
  const result = compose.validateDesignPageComposeMaterialBodies(page, {
    A2: [
      {
        material_id: "M6",
        type: "checklist",
        specification: SPEC_TEXT,
        content: FULL_CHECKLIST
      }
    ]
  });
  assert.equal(result.ok, false);
  assert.ok(
    result.issues.some(function (issue) {
      return issue.material_id === "M6" && (issue.defect === "truncated" || issue.defect === "regenerated_from_spec");
    })
  );
  assert.equal(result.failure.reason, "inline_material_body_defect");
});

test("Case 2 — specification fallback is invalid when no full upstream body exists", () => {
  const page = pageWithMaterial("A2", "M6", "checklist", SPEC_TEXT);
  assert.equal(compose.materialBodyMatchesSpecificationSubstitute(SPEC_TEXT, SPEC_TEXT), true);
  const result = compose.validateDesignPageComposeMaterialBodies(page, {
    A2: [{ material_id: "M6", type: "checklist", specification: SPEC_TEXT }]
  });
  assert.equal(result.ok, false);
  assert.ok(
    result.issues.some(function (issue) {
      return issue.material_id === "M6" && issue.defect === "specification_substitute";
    })
  );
});

test("Case 3 — composed framing with copied bodies is valid", () => {
  const page = pageWithMaterial("A2", "M6", "checklist", FULL_CHECKLIST);
  page.sections[0].content[0].learner_task =
    "Composed learner framing that differs from upstream while materials are copied verbatim.";
  const result = compose.validateDesignPageComposeMaterialBodies(page, {
    A2: [{ material_id: "M6", type: "checklist", content: FULL_CHECKLIST }]
  });
  assert.equal(result.ok, true);
  assert.equal(fidelity.materialBodyLooksAbbreviated(FULL_CHECKLIST), false);
});

test("Case 4 — budget-pressure abbreviation fails with inline_material_body_defect", () => {
  const abbreviated =
    "### Worked Example: Applying the Replication Cycle...";
  const page = pageWithMaterial("A3", "M7", "worked_example", abbreviated);
  const fullBody =
    "### Worked Example: Applying the Replication Cycle\n\n" +
    "1. Attachment and entry.\n2. Uncoating.\n3. Translation.\n4. Replication.\n5. Assembly.";
  const result = compose.validateDesignPageComposeMaterialBodies(page, {
    A3: [{ material_id: "M7", type: "worked_example", content: fullBody }]
  });
  assert.equal(result.ok, false);
  assert.ok(result.issues.some(function (issue) {
    return issue.material_id === "M7";
  }));
  assert.equal(result.failure.reason, "inline_material_body_defect");
  assert.equal(result.failure.generation_notes, undefined);
});
