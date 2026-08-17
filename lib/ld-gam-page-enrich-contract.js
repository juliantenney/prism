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
      "- when required_materials[].evidence_requirement is present, treat it as binding for material content",
      "- when required_materials[].response_fulfilment.kind is learner_workspace on a table-family row, preserve blank learner-response cells in the authored table body — partial fixed/model rows are allowed when allows_partial_exemplar applies",
      "- when required_materials[].practice_independence is present on worked_example or modelling_note, author the model on a distinct operand instance; bound attempt_operand_material_ids rows are learner-owned — do not copy, solve, or substantially complete those operands in the model body (see S78-WS-2 block when injected)",
      "- when generated particulars are load-bearing for a commissioned learner action or promised worked/model result, ensure mutual consistency and sufficiency for that commission (see S78-OPERATIONAL-SUITABILITY block when injected)",
      "- if generation_notes.validation is present, do not emit pending_gam/shell_only coverage flags when materials are hydrated",
      "",
      "Material body representation (capture-binding):",
      '- Ordinary authored materials (every material that is not a guided-review checklist): body_format must be "markdown"; body must be a non-empty Markdown string.',
      "- Structured pedagogical content (workspaces, scenario sets, worked problem sets, tables, diagram packs, templates) belongs inside that Markdown string. Do not emit object-valued JSON bodies or body_format \"json\" for those materials.",
      '- Specialised JSON body is capture-supported only for checklist materials in guided-review form (body_format "json" with review_mode "guided_criteria"). Markdown checklists remain allowed for non-guided/legacy cases.',
      ""
    ]
      .concat(guidedLines)
      .concat([
        "",
        "Instructional depth (runtime — LD-GAM-INSTRUCTIONAL-DEPTH-CONTRACT, S59 Iteration 7):",
        "- materials[].body: subject-matter first — teach concepts/evidence/reasoning/decisions; internalise weak/better exemplars without surfacing \"weak/stronger explanation\" meta-commentary; retain exemplar pairs, intervening process, anti-rubric-gaming, authentic scenarios, and domain comparative reasoning.",
        "",
        "Evidence-centred fulfilment (when required_materials row includes evidence_requirement):",
        "- Generate directly inspectable learner evidence as observations/values/conditions/outputs/extracts (not assertion-only prose).",
        "- Ensure body supports the required learner_action and observable_features from evidence_requirement.",
        "- Keep evidence-provider materials separate from response scaffolds unless evidence_layout explicitly declares a combined evidence workspace.",
        "- For combined evidence workspace tables: fixed observation columns contain evidence; learner interpretation/judgement columns remain blank.",
        "- Keep evidence concise and proportionate to activity duration and prerequisite knowledge.",
        "- Preserve delayed disclosure: do not pre-state the target inference, provisional judgement, preferred mechanism, or model conclusion before learner response.",
        "- When evidence_decision.required is true, any pre-task teaching, worked_example, or modelling_note must not analyse the focal evidence provider, answer the focal learner task, state a preferred mechanism/option/interpretation, or provide the provisional/final judgement learners must derive.",
        "- A pre-task worked example may remain if it uses a distinct analogous case, demonstrates only the reasoning procedure, or models one reasoning step without resolving the focal question.",
        '- If provenance is "system_generated_simulation" (or equivalent simulated mode), label it explicitly for learners.',
        '- For combined_evidence_workspace materials with provenance "system_generated_simulation", ensure the learner-facing material title contains "Simulated" (e.g. "Simulated Entry Evidence Table") so honesty remains visible when table-workspace rendering suppresses body labels.',
        '- If provenance is "conversation_attachment" (canonical source-bound value), return to the authoritative material available in this Copilot conversation; reproduce task-appropriate excerpts accurately; preserve wording, punctuation, values, structure or lineation where materially important; when selecting only part of a line/sentence/unit, mark omission honestly with an ellipsis or clear excerpt treatment; identify the source clearly; place evidence beside/before the learner task that uses it.',
        "- For conversation_attachment: learner-facing evidence must be source-native (exact quotation/excerpt, data values/output, case observations, policy clauses, visible/source features). Do not replace with thematic summaries, conclusions, explanations of significance, technique-to-meaning claims, or preferred interpretations. Neutral source identification and brief task-direction language are allowed. Do not add a simulation label.",
        "- Do not satisfy inspectability with one genuine quotation while other evidence rows are summary-only; every row/unit learners analyse must include the source-native evidence itself.",
        "- Before the learner task, do not explain what the evidence proves or means (avoid phrases such as suggests that, presents X as, undermines, reveals, demonstrates, directly attacks, strips away, shows that). Move interpretation into learner response fields, post-task guided review, or genuinely analogous worked examples that do not resolve the focal evidence.",
        "- For combined_evidence_workspace with conversation_attachment: fixed_observation_fields must include an actual evidence content field (quotation/extract/value/observation/source content)—source name or category alone is insufficient; learner_response_fields remain blank; source evidence cells are fixed and non-editable.",
        "- If the specified conversation_attachment source is unavailable: do not fabricate it and do not reconstruct it from model memory; emit a clear learner-facing diagnostic note that the source-bound requirement could not be fulfilled (SOURCE_BOUND_UNFULFILLED); do not silently substitute simulated evidence where source identity is pedagogically material.",
        "- Never fabricate exact source-bound evidence when source text/data is unavailable.",
        "- Known boundary: Prism cannot access Copilot attachment bytes; exact file-byte verification is out of scope. Absence of attachments must not fail ordinary non-source-bound workflows.",
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
      '- body_format "json" or object-valued body on non-checklist materials',
      "- workspace / scenario_set / worked_problem_set (or similar ordinary types) emitted as JSON objects instead of Markdown strings",
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
