/**
 * LD-TABLE-FIDELITY — canonical L4 table fidelity prompt module (Sprint 38-B Wave 1).
 * Lifecycle: canonical (Wave 1 exit, 2026-06-04).
 * Taxonomy: cluster 5, layer L4 ([38B-2]).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LD_TABLE_FIDELITY = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var MODULE_ID = "LD-TABLE-FIDELITY";
  var MARKER = "LD-TABLE-FIDELITY (auto-applied)";

  var CORE_LINES = [
    "",
    MARKER + ":",
    "- Module: " + MODULE_ID + " | Layer: L4 | Scope: materials.<table_key> | Cluster: 5 (table fidelity)",
    "- Precedence (normative): source fidelity (L2) > activity membership (L3) > materials + table fidelity (L4) > pedagogical enrichment (L5) > visual affordance metadata (L6) > style/rhetoric (L7). Table fidelity overrides brevity, summarisation, and shorten-non-essential-prose for table-shaped content.",
    "- PREC-01: pipe tables and structured rows must survive compression — never substitute comma-row shorthand for markdown pipes.",
    "- Figure duplicate/avoid tokens (representation_avoid, must_not_duplicate) apply to generated figures only — never to page activity.materials or worksheet tables.",
    "- Table location: every table lives in materials.<named_table_field> as a markdown pipe-table string OR a structured rows array with explicit column keys — never CSV comma rows in prose, never bullet lists of comma-separated cells.",
    "- If a table is needed, produce a complete pipe table with header row, divider row (| --- |), and body rows — multiline, not one-line compressed.",
    "- GOOD example (copy shape; adapt columns and rows):",
    "  | Scenario | Who is affected? | Main price pressure |",
    "  | --- | --- | --- |",
    "  |  |  |  |",
    "- FORBIDDEN in materials table fields:",
    "  • Lines matching comma-row pseudo-tables (e.g. Scenario 1,,, or trailing ,,, rows)",
    "  • Prose sections titled Headers and Rows instead of a single named pipe field",
    "  • Label-only table strings without header row and body cells",
    "- Do not place raw markdown pipe tables inside bullet-list strings; keep tables in named material field values.",
    "- TeX in prose: see LD-MATH-RENDER; this module governs pipe-table shape in materials.* only."
  ];

  var AUTHOR_LINES = [
    "- Author role (Generate Activity Materials): realise required_materials table/template/analysis_table/comparison_table specs as full pipe tables in activity_materials content strings.",
    "- Row adequacy: tables, analysis_table, timeline templates, and mapping templates must include enough blank or prompt-labelled rows for the stated learner_task — never a single blank row when multiple learner responses are required.",
    "- Matching or mapping tasks: include one row per expected match when the activity lists events, stages, works, or prompts (e.g. four life events → at least four data rows).",
    "- Timeline table templates: include one blank/prompt-labelled row per listed stage or phase in learner_task or required_materials (row order in the template is not the answer key).",
    "- Comparison tables: include enough rows for each entity or dimension the learner must compare.",
    "- Label prompt rows in the first column when useful; leave response cells empty for learner completion."
  ];

  var PRESERVE_LINES = [
    "- Preserve role (Design Page): when upstream activity_materials contains table materials, copy the full upstream Content string into the matching activity.materials field key (analysis_table, comparison_table, impact_table, classification_table, reference_table, data_table, decision_table, planning_table, template, etc.) — pipe markdown block AND any table-adjunct instructional prose in the same field.",
    "- Table-adjunct prose (38H-3): preserve instructional context in the same materials.<table_key> body after or around the pipe table — e.g. *Instructions:*, completion guidance, interpretation prompts, worked/completion cues; do not strip non-pipe prose; pipe rows alone are insufficient when upstream includes adjunct guidance.",
    "- Do not flatten tables to comma-separated rows, Headers/Rows prose blocks, or catalogue labels when upstream already has pipe syntax.",
    "- Table fidelity overrides session overview synthesis and any shortening of materials.<table_key> bodies — adjunct guidance is L4-faithful instructional content, not overview prose."
  ];

  var SPEC_LINES = [
    "- Spec role (Design Learning Activities): required_materials types template, analysis_table, comparison_table, and integrated table scaffolds must be realised as pipe markdown tables in Generate Activity Materials — not table descriptions only."
  ];

  function buildLdTableFidelityPromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var role = String(opts.role || "core").toLowerCase();
    var includeMarker = opts.includeMarker !== false;
    var lines = includeMarker ? CORE_LINES.slice() : CORE_LINES.slice(2);
    if (role === "author" || role === "gam") {
      lines = lines.concat(AUTHOR_LINES);
    } else if (role === "preserve" || role === "design_page" || role === "preserve_merge") {
      lines = lines.concat(PRESERVE_LINES);
    } else if (role === "spec" || role === "dla") {
      lines = lines.concat(SPEC_LINES);
    } else if (role === "author_and_preserve" || role === "full") {
      lines = lines.concat(AUTHOR_LINES).concat(PRESERVE_LINES);
    }
    return lines.join("\n");
  }

  function markerRegex() {
    return /LD-TABLE-FIDELITY \(auto-applied\)/i;
  }

  /** Legacy GAM marker (pre–Wave 1); used to avoid duplicate append when migrating drafts. */
  function legacyGamTableRowAdequacyRegex() {
    return /self-directed learner-page table row adequacy \(auto-applied\)/i;
  }

  return {
    MODULE_ID: MODULE_ID,
    MARKER: MARKER,
    buildLdTableFidelityPromptBlock: buildLdTableFidelityPromptBlock,
    markerRegex: markerRegex,
    legacyGamTableRowAdequacyRegex: legacyGamTableRowAdequacyRegex
  };
});
