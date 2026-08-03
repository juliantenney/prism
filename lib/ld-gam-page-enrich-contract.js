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

  function resolveGuidedReviewGenerationContract() {
    if (typeof require === "function") {
      try {
        return require("./guided-review-generation-contract.js");
      } catch (_err) {}
    }
    if (typeof globalThis !== "undefined" && globalThis.PRISM_GUIDED_REVIEW_GENERATION_CONTRACT) {
      return globalThis.PRISM_GUIDED_REVIEW_GENERATION_CONTRACT;
    }
    if (typeof window !== "undefined" && window.PRISM_GUIDED_REVIEW_GENERATION_CONTRACT) {
      return window.PRISM_GUIDED_REVIEW_GENERATION_CONTRACT;
    }
    return null;
  }

  function buildGamPageEnrichContractBlock() {
    var guidedLines = [
      "Guided-review checklist materials (material_type checklist for verification):"
    ];
    var contract = resolveGuidedReviewGenerationContract();
    if (contract && typeof contract.buildGuidedReviewGenerationGuidanceLines === "function") {
      guidedLines = guidedLines.concat(contract.buildGuidedReviewGenerationGuidanceLines());
    } else {
      guidedLines = guidedLines.concat([
        '- Prefer body_format: "json" with structured guided-review body (not Markdown bullets).',
        '- Body object shape: { "review_mode": "guided_criteria", "criteria": [ ... ] }',
        "- Emit 3–4 criteria (maximum 5).",
        "- Normally emit 2–3 {expected, repair} pairs per criterion (maximum 4).",
        "- Repairs must help the learner improve their own response — never a complete replacement answer.",
        "- Simple Markdown checklists remain allowed only for non-guided/legacy cases."
      ]);
    }

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
      ""
    ]
      .concat(guidedLines)
      .concat([
        "",
        "Instructional depth (runtime — LD-GAM-INSTRUCTIONAL-DEPTH-CONTRACT, S59 Iteration 7):",
        "- materials[].body: subject-matter first — teach concepts/evidence/reasoning/decisions; internalise weak/better exemplars without surfacing \"weak/stronger explanation\" meta-commentary; retain exemplar pairs, intervening process, anti-rubric-gaming, authentic scenarios, and domain comparative reasoning.",
        "",
        "Explicitly forbidden:",
        "- full-page replay",
        "- shell fields: title, audience, page_profile, learning_outcomes, episode_plans",
        "- renaming activities[] or changing activities[].title (DLA owns the final learner-facing activity title)",
        "- DLA instructional scalar fields (learner_task/expected_output/activity_preamble/cognition fields)",
        "- required_materials mutation/removal",
        "- page_synthesis",
        "- learning_sequence",
        "- preserving, reconstructing, or copy-forwarding non-GAM stage fields",
        "",
        "Return one pretty-printed fenced JSON page artefact. Footer: STEP N OUTPUT: page"
      ])
      .join("\n");
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
      "        },",
      "        {",
      '          "material_id": "A1-M4",',
      '          "material_type": "checklist",',
      '          "activity_id": "A1",',
      '          "title": "Response quality review",',
      '          "body_format": "json",',
      '          "body": {',
      '            "review_mode": "guided_criteria",',
      '            "criteria": [',
      "              {",
      '                "statement": "Have you identified the correct role of each replication component?",',
      '                "why_it_matters": "If roles are collapsed or swapped, the response cannot show how the replication system actually works.",',
      '                "features": [',
      "                  {",
      '                    "expected": "IRES is connected to translation initiation.",',
      '                    "repair": "State that the IRES recruits ribosomes to viral RNA, enabling translation without conventional cap-dependent initiation."',
      "                  },",
      "                  {",
      '                    "expected": "microRNA-122 is connected to viral RNA stability.",',
      '                    "repair": "Explain that microRNA-122 binding protects the HCV genome and supports its availability for translation and replication."',
      "                  },",
      "                  {",
      '                    "expected": "NS5A and NS5B are assigned distinct but connected functions.",',
      '                    "repair": "Distinguish NS5A’s coordinating role from NS5B’s RNA-polymerase activity, then explain why successful replication requires both."',
      "                  }",
      "                ],",
      '                "confirmation_label": "My response now meets this criterion"',
      "              },",
      "              {",
      '                "statement": "Have you used scenario-specific evidence rather than generic claims?",',
      '                "why_it_matters": "Generic claims could fit any case and do not show applied judgement on this scenario.",',
      '                "features": [',
      "                  {",
      '                    "expected": "At least one concrete detail unique to the given scenario",',
      '                    "repair": "Replace one general statement with a detail that could only come from this scenario."',
      "                  },",
      "                  {",
      '                    "expected": "The chosen detail is linked to the claim it supports",',
      '                    "repair": "Add one sentence naming how the scenario detail supports or constrains your conclusion."',
      "                  }",
      "                ]",
      "              }",
      "            ]",
      "          }",
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
