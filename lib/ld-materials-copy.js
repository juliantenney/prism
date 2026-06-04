/**
 * LD-MATERIALS-COPY — canonical L4 materials verbatim / copy contract (Sprint 38-B Wave 1).
 * Lifecycle: canonical (Wave 1 exit, 2026-06-04).
 * Taxonomy: cluster 4, layer L4 ([38B-2]).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LD_MATERIALS_COPY = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var MODULE_ID = "LD-MATERIALS-COPY";
  var MARKER = "LD-MATERIALS-COPY (auto-applied)";

  var PLACEHOLDER_LABEL_LINES = [
    '  "Set of scenarios", "Set of short scenarios", "Calculation table", "Model showing", "Table linking",',
    '  "See provided scenarios", "Scenario set describing", "Table with basket items".'
  ];

  var CORE_LINES = [
    "",
    MARKER + ":",
    "- Module: " + MODULE_ID + " | Layer: L4 | Scope: activity.materials | Cluster: 4 (materials fidelity)",
    "- Precedence (normative): materials fidelity (L4) overrides overview/synthesis prose (scoped to overview, learning_purpose, study_tips only) and non-essential shortening — PREC-02.",
    "- activity.materials must contain learner-ready artefacts, not catalogue descriptions of what could be provided.",
    "- Do not summarise, thin, or replace materials bodies to make the page shorter or to write session narrative.",
    "- Table-shaped fields follow LD-TABLE-FIDELITY (pipe tables, anti-CSV rules) — not repeated here."
  ];

  var PRESERVE_LINES = [
    "- Preserve role (Design Page): when upstream activity_materials exist, each learning_activities.content[] row must carry the full materials object (merge every upstream block for that activity_id).",
    "- Copy concrete delivery content verbatim or near-verbatim: scenario narratives, worked examples, checklists, prompt sets, assessment stems in materials, and support content tied to activities.",
    "- Forbidden placeholder-only phrasing unless the full content appears in the same field:",
    PLACEHOLDER_LABEL_LINES[0],
    PLACEHOLDER_LABEL_LINES[1],
    "- Require per activity when upstream provides them: concrete scenarios (named cases with context/numbers), worked examples with visible steps, learner-completion templates with blank cells, assessment items with stems/options, and prompts/support_note content in materials when upstream supplied.",
    "- page_profile learner: substantive session overview in overview/learning_purpose — not summary-only activity.materials.",
    "- If activity_materials live in a separate upstream section, embed them into each activity.materials; do not leave materials empty while describing resources elsewhere.",
    "- source_basis paths in visual_affordances cite upstream evidence; citing a path does not satisfy the materials requirement."
  ];

  var AUTHOR_LINES = [
    "- Author role (Generate Activity Materials): realise full, directly usable content for every required_materials entry — not outlines, descriptions of what could be provided, or label-only strings.",
    "- Each generated material must support the activity learner_task and expected_output; do not substitute a shorter catalogue label for the body.",
    "- Do not emit describe-only or outline-only material sections when the specification requires learner-facing content.",
    "- Table-shaped materials follow LD-TABLE-FIDELITY (author role) for pipe tables and row adequacy."
  ];

  function buildLdMaterialsCopyPromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var role = String(opts.role || "core").toLowerCase();
    var includeMarker = opts.includeMarker !== false;
    var lines = includeMarker ? CORE_LINES.slice() : CORE_LINES.slice(2);
    if (role === "preserve" || role === "design_page" || role === "preserve_merge") {
      lines = lines.concat(PRESERVE_LINES);
    } else if (role === "author" || role === "gam") {
      lines = lines.concat(AUTHOR_LINES);
    } else if (role === "full") {
      lines = lines.concat(PRESERVE_LINES).concat(AUTHOR_LINES);
    }
    return lines.join("\n");
  }

  function markerRegex() {
    return /LD-MATERIALS-COPY \(auto-applied\)/i;
  }

  function moduleIdInTextRegex() {
    return /LD-MATERIALS-COPY \| Layer: L4/i;
  }

  return {
    MODULE_ID: MODULE_ID,
    MARKER: MARKER,
    buildLdMaterialsCopyPromptBlock: buildLdMaterialsCopyPromptBlock,
    markerRegex: markerRegex,
    moduleIdInTextRegex: moduleIdInTextRegex
  };
});
