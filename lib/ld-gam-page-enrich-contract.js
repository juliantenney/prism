/**
 * Sprint 58 Phase 3A — GAM partial page output contract.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "object" || !module.exports) {
    if (typeof root !== "undefined") {
      root.PRISM_LD_GAM_PAGE_ENRICH_CONTRACT = api;
    }
    return;
  }
  module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var CONTRACT_VERSION = "58-GAM-PARTIAL-1";

  function buildGamPageEnrichContractBlock() {
    return [
      "",
      "### Sprint 58 vNext GAM partial-page contract (required)",
      "",
      "Output a partial v2 page artefact for GAM-owned fields only.",
      "Do not return a full-page replay. Do not emit pack text or legacy activity_materials/session_materials artefacts.",
      "",
      "Required top-level envelope:",
      '- artifact_type: "page"',
      '- schema_version: "2.0.0"',
      '- assembly_state.current_stage: "gam"',
      '- assembly_state.enriched_by must include "gam"',
      "",
      "Required payload:",
      "- activities[] with activity_id and materials[] only",
      "- each material must keep stable material_id",
      "- each activity.materials[] entry must include: material_id, material_type, title, body_format, body, and activity_id (or parent_activity_id)",
      "- material order must match required_materials order for that activity",
      "- one-to-one coverage: every required_materials.material_id has exactly one matching materials[].material_id",
      "- no orphan materials (materials with no owning required_materials row)",
      "- if generation_notes.validation is present, do not emit pending_gam/shell_only coverage flags when materials are hydrated",
      "",
      "Explicitly forbidden:",
      "- full-page replay",
      "- shell fields: title, audience, page_profile, learning_outcomes, episode_plans",
      "- DLA instructional scalar fields (learner_task/expected_output/activity_preamble/cognition fields)",
      "- required_materials mutation/removal",
      "- page_synthesis",
      "- learning_sequence",
      "- preserving, reconstructing, or copy-forwarding non-GAM stage fields",
      "",
      "Return one pretty-printed fenced JSON page artefact. Footer: STEP N OUTPUT: page"
    ].join("\n");
  }

  function buildCanonicalGamMaterialShapeSnippet() {
    return [
      "Canonical GAM partial shape:",
      "```json",
      "{",
      '  "artifact_type": "page",',
      '  "schema_version": "2.0.0",',
      '  "assembly_state": { "current_stage": "gam", "enriched_by": ["gam"] },',
      '  "activities": [',
      "    {",
      '      "activity_id": "A1",',
      '      "materials": [',
      "        {",
      '          "material_id": "A1-M1",',
      '          "material_type": "text",',
      '          "activity_id": "A1",',
      '          "title": "Inflation drivers",',
      '          "body": "## Inflation drivers\\n\\nDemand-pull and cost-push interaction ...",',
      '          "body_format": "markdown"',
      "        }",
      "      ]",
      "    }",
      "  ]",
      "}",
      "```",
      "",
      "Invalid GAM outputs:",
      "- full page shell replay",
      "- activities rows with DLA instructional fields",
      "- missing activity_id",
      "- missing material_id",
      "- missing activity_id/parent_activity_id on material rows",
      "- missing body/body_format on material rows",
      "- duplicate or orphan material_id rows",
      "- page_synthesis / learning_sequence content"
    ].join("\n");
  }

  return {
    CONTRACT_VERSION: CONTRACT_VERSION,
    buildGamPageEnrichContractBlock: buildGamPageEnrichContractBlock,
    buildCanonicalGamMaterialShapeSnippet: buildCanonicalGamMaterialShapeSnippet
  };
});
