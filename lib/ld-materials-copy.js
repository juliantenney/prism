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
    "- Precedence (normative): materials fidelity (L4) overrides wrapper transport slots (overview, learning_purpose, study_tips only) — PREC-02. activity.materials.* must never be shortened for readability.",
    "- activity.materials must contain learner-ready artefacts, not catalogue descriptions of what could be provided.",
    "- Do not summarise, thin, paraphrase, shorten, simplify, compress, or replace materials bodies to make the page shorter or to write session narrative.",
    "- Table-shaped fields follow LD-TABLE-FIDELITY (pipe tables, anti-CSV rules) — not repeated here."
  ];

  var OPAQUE_PAYLOAD_LINES = [
    "- OPAQUE PAYLOAD TRANSPORT (activity.materials only — Design Page): do not interpret pedagogical purpose or material type before copying.",
    "- scenario, text, worked_example, sample_output, modelling_note, checklist, template, transfer_prompt, consolidation_summary, comparison_table, analysis_table, and all other materials.<field> keys are learner-facing content payloads — not metadata, summaries, descriptions, structures, labels, references, or prompts to regenerate.",
    "- Task is transport, not authoring: each upstream GAM Material Content: body equals destination activity.materials.<field> body (JSON string escaping only). Material type names and Purpose lines do not license rewriting.",
    "- FORBIDDEN pedagogically-reasonable substitutes (fail even if readable, concise, or learner-friendly):",
    "  • scenario → one-sentence scenario description (drops perspective sections, cases, or labelled scenario bodies)",
    "  • worked_example → model conclusion or judgement outcome only (drops step-by-step evaluation, weak/strong contrasts, expert-noticing, bridge)",
    "  • sample_output → description of what the sample demonstrates (drops quoted sample and Why-this-works bullets)",
    "  • modelling_note → framework label or arrow chain only (drops walkthrough examples)",
    "  • template → section-label chain only (drops blanks, memo body, sentence starters)",
    "  • checklist → criteria summary only (drops item-level checklist rows)",
    "  • transfer_prompt → apply-to-your-context summary (drops required inclusions, guiding questions, completion criterion)",
    "  • consolidation_summary → synthesis-summary descriptor (drops reflection questions and sentence starters)"
  ];

  var ARCHIVAL_FIELD_LINES = [
    "- TRANSPORT VS ARCHIVAL FIELDS (Design Page):",
    "- Transport slots (upstream body or omit; not authored here): knowledge_summary (when LC/KM bound), study_tips (when upstream provides closure/debrief), overview and learning_purpose (transport upstream body when present; wrapper-gap fallback obey LD-THIN-ASSEMBLY-COHERENCE-CONTRACT — procedural detail not in this block).",
    "- Organisation only: section headings and section ordering — no new educational substance.",
    "- Archival (verbatim GAM payload only): learning_activities.content[].materials.* — exact upstream Content: body.",
    "- For every field inside activity.materials.*:",
    "  • Populate only by direct copy from the matching upstream activity_materials Material Content: body.",
    "  • Do not generate, summarise, paraphrase, simplify, restructure, or convert material content into a description of itself.",
    "  • Do not replace full material bodies with outlines, labels, summaries, frameworks, or learner-facing representations.",
    "  • Do not modify materials for coherence, readability, page flow, deduplication, brevity, or visual presentation.",
    "- PRE-EMIT VALIDATION: before final output, verify that every populated activity.materials.* field is copied from an upstream Material Content: body and is not model-authored."
  ];

  var GAM_CONTENT_BINDING_LINES = [
    "- AUTHORITATIVE GAM CONTENT BINDING (pack-text activity_materials): distinguish metadata from payload.",
    "- Metadata (routing/mapping/field naming only — NEVER the value of activity.materials.*): Material name, Material ID, material type, Purpose, required_materials specifications, learning_activities material descriptions, inferred summaries, generated descriptions, catalogue labels, references to resource existence.",
    "- Payload (authoritative learner-facing material): the Content: body only.",
    "- Authoritative parsing (pack text):",
    "  Activity ID: <activity_id>",
    "  Material: <material_id> (<destination_field>)",
    "  Purpose: <purpose>",
    "  Content:",
    "  <material body>",
    "- Destination rule: learning_activities.content[].materials[<destination_field>] = the exact Content: body. Copy verbatim until the next Material:, Activity:, STEP marker, or end of activity_materials artefact.",
    "- FORBIDDEN field values (metadata-as-payload):",
    '  • "text": "RNA virus genome types and messenger RNA overview."',
    '  • "template": "Leadership memo template."',
    '  • "comparison_table": "DMV versus cell-to-cell spread table."',
    "- REQUIRED field values (Content: body as payload):",
    '  • "text": "## RNA Virus Genome Types and Messenger RNA\\n\\nAll RNA viruses..."',
    '  • "template": "## Leadership Memo Template\\n\\nWrite 100–150 words..."',
    '  • "comparison_table": "| Feature | Double-Membrane Vesicles | ..."',
    "- PRE-EMIT CONTENT BINDING VALIDATION: for every populated activity.materials.* field — (1) value originated from upstream Content:; (2) not derived from Material name/type/Purpose/required_materials; (3) contains copied learner-facing payload, not a description of the payload.",
    "- Fail validation if a field names a resource type (overview, template, worked example, comparison table, checklist, model answer, reference table) without the actual learner-facing body. Matching upstream Content: always overrides brevity, page size, composition convenience, readability optimisation, or summary generation."
  ];

  var MULTI_MATERIAL_ENUMERATION_LINES = [
    "- MULTI-MATERIAL ENUMERATION INVARIANT (pack-text GAM — per Activity ID):",
    "- For every Activity ID, enumerate every Material block in upstream activity_materials and emit one activity.materials.<destination_field> entry per block.",
    "- Required mapping example: Material: A1_WORKED (worked_example) + Content: <body> → \"materials\": { \"worked_example\": \"<exact Content body>\" }.",
    "- Do not: choose a representative material; collapse multiple materials into materials.text; omit worked_example, sample_output, classification_table, analysis_table, comparison_table, decision_table, template, checklist, scenario, transfer_prompt, consolidation_summary, or any other destination_field; summarise, rename, merge, deduplicate, or replace material bodies.",
    "- PRE-EMIT ENUMERATION VALIDATION (per Activity ID): count(activity.materials keys) must equal count(GAM Material blocks for that Activity ID).",
    "- For each GAM Material block: destination_field must exist in activity.materials; value must be the exact Content: body.",
    "- Fail before emit if: any GAM Material block lacks a corresponding activity.materials.<destination_field>; only materials.text is present when multiple GAM materials exist; a destination field is omitted because it is a table, checklist, template, worked example, scenario, transfer prompt, or consolidation scaffold."
  ];

  var FULL_CONTENT_BODY_PRESERVATION_LINES = [
    "- FULL CONTENT BODY PRESERVATION (per Material block):",
    "- For each Material block, activity.materials.<destination_field> must equal the entire Content: body — not the first heading, first sentence, first table row, label, excerpt, or representative line.",
    "- Content body extends from immediately after Content: until the next Material:, next Activity:, STEP marker, or EOF.",
    "- PRE-EMIT FULL-BODY VALIDATION: for each emitted activity.materials field, compare against its GAM Content: body — must include all paragraphs, bullets, table rows, and headings; must not be shortened to the first line; must not be excerpted.",
    "- Fail before emit if any material value is only a heading, opening sentence, table header, checklist first item, or template title."
  ];

  var MATERIAL_PRESERVATION_OVERRIDES_PAGE_OPTIMISATION_LINES = [
    "- MATERIAL PRESERVATION OVERRIDES PAGE OPTIMISATION (Design Page — hard):",
    "- Authoritative rule: for every GAM Material block, activity.materials.<destination_field> = exact Content: body. The Content: body is the only authoritative source — no Material name, Type, Purpose, required_materials, or page narrative may replace it.",
    "- Precedence (hard): material preservation overrides page-size optimisation, rendering practicality, brevity preferences, summarisation heuristics, condensation rules, token-reduction strategies, page-length limits, readability transformations, content simplification, and instructional rewriting.",
    "- If preserving Content: makes the page large — preserve the Content: body anyway. Large output is acceptable; condensed output is not.",
    "- FORBIDDEN Content: replacements: summary, label, title, heading only, purpose statement, specification statement, description, placeholder, representative excerpt, first sentence, first paragraph, condensed representation, practical rendering version.",
    "- Invalid examples (descriptions, not Content bodies):",
    '  • "template": "Leadership Judgement Memo template."',
    '  • "worked_example": "Model readiness judgement."',
    '  • "scenario": "Greenfield Health Group and Northbridge Manufacturing stakeholder cases."',
    "- PRE-EMIT VALIDATION (per activity.materials field): (1) locate matching GAM Material block; (2) extract entire Content: body; (3) compare emitted value to source.",
    "- Fail before emit if: emitted value is shorter than Content:; paragraphs, bullets, table rows, headings, or sections are missing; a summary, label, or description was substituted.",
    "- GENERATION NOTES RULE (hard): never state material bodies were represented in condensed form, condensed for practicality, shortened for page rendering, or summarised for brevity. If any material was condensed, fail generation — do not emit the page."
  ];

  var PAGE_ARTEFACT_FINAL_LEARNER_OUTPUT_LINES = [
    "- PAGE ARTEFACT IS FINAL LEARNER OUTPUT (Design Page — hard):",
    "- The Design Page artefact is the final learner-facing output — not a renderer contract, content index, material reference map, placeholder schema, downstream instruction set, or specification for another process to complete.",
    "- Every learner-facing material required by the page must be physically present inside the page artefact. Renderer behaviour is irrelevant; downstream systems may format, transform, or distribute the page but must not be required to dereference, recover, reconstruct, expand, or fetch missing learner content.",
    "- FORBIDDEN material reference values (must contain Content: body, not point to it):",
    '  • "Full explanatory text from LO1-TEXT."',
    '  • "Full worked example from LO1-WE."',
    '  • "Full checklist from LO1-CHK."',
    '  • "Full scenario content from LO2-SCN."',
    '  • "See upstream material"',
    '  • "Content from [material id]"',
    "  • any placeholder or reference to a GAM material instead of the GAM Content: body",
    "- Required invariant: for every activity in the learner journey and every material in that activity, activity.materials.<field> = complete learner-facing Content: body from the matching GAM Material block.",
    "- Whole learner journey must remain intact: do not omit activities, replace materials with references, or summarise materials to manage size.",
    "- Conflict resolution (hard): full learner journey preservation and full material body preservation override page size, response length, rendering practicality, brevity, and downstream convenience.",
    "- PRE-EMIT VALIDATION: fail before emit if any material value refers to content instead of containing it; says \"Full ... from ...\"; is a description of a material; is copied from Purpose or Specification; is condensed; is shorter than GAM Content:; omits paragraphs, bullets, rows, sections, examples, prompts, or checklist items.",
    "- GENERATION NOTES: must not excuse non-compliance. If the artefact is not the complete final learner-facing page, do not emit it as a valid page."
  ];

  var PRESERVE_LINES = [
    "- Preserve role (Design Page): when upstream activity_materials exist, each learning_activities.content[] row must carry the full materials object (merge every upstream block for that activity_id).",
  ].concat(OPAQUE_PAYLOAD_LINES).concat(ARCHIVAL_FIELD_LINES).concat(GAM_CONTENT_BINDING_LINES).concat(MULTI_MATERIAL_ENUMERATION_LINES).concat(FULL_CONTENT_BODY_PRESERVATION_LINES).concat(MATERIAL_PRESERVATION_OVERRIDES_PAGE_OPTIMISATION_LINES).concat(PAGE_ARTEFACT_FINAL_LEARNER_OUTPUT_LINES).concat([
    "- Copy learner-facing delivery content verbatim into activity.materials.*. Do not paraphrase, shorten, simplify, summarise, compress, convert, or rewrite material bodies.",
    "- Do not shorten activity.materials.* content. Material bodies are hard constraints: do not truncate, summarise, paraphrase, or omit sections of activity.materials.* for any reason including output limits. Do not use generation_notes.limitations to excuse material-body loss.",
    "- READABLE ASSEMBLY (R-83 guardrail — Layer 2 delimiter only): structural clarity for section structure, headings, ordering, and transport-slot assembly — forbids condensation, readability rewriting, brevity optimisation, and payload polishing; not rewriting activity.materials.*, DLA scaffold fields, or assessment items; wrapper-gap prose obey LD-THIN-ASSEMBLY-COHERENCE-CONTRACT only.",
    "- FORBIDDEN inflation-collapse substitutes (activity.materials.* must never look like revision notes):",
    "  • Full exposition → one key-point line (e.g. \"Inflation is a sustained increase in the general price level…\")",
    "  • Worked example with steps → outcome only (e.g. \"Year 1 basket = £100; Year 2 basket = £105; same money buys less\")",
    "  • Classification reasoning chain → arrow label (e.g. \"Demand exceeds supply → demand-pull inflation\")",
    "  • Calculation worked example → formula plus final result only (process prose omitted)",
    "  • Analytic worked example → one-sentence effect summary",
    "  • Recommendation/judgement template → section-label chain only (e.g. \"Context → Evaluation → Decision → Justification\")",
    "  • Transfer prompt → label-only instruction (e.g. \"Apply to real-world inflation\")",
    "- Forbidden placeholder-only phrasing unless the full content appears in the same field:",
    PLACEHOLDER_LABEL_LINES[0],
    PLACEHOLDER_LABEL_LINES[1],
    "- Every upstream Material Content: block for that activity_id must land in activity.materials.* as opaque payload — do not substitute a shorter pedagogical reconstruction.",
    "- overview / learning_purpose: upstream transport or LD-THIN-ASSEMBLY-COHERENCE-CONTRACT wrapper-gap fallback only — not summary-only substitutes for activity.materials.* bodies.",
    "- If activity_materials live in a separate upstream section, embed them into each activity.materials; do not leave materials empty while describing resources elsewhere."
  ]);

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
