/**
 * INSTRUCTIONAL-PATTERN-PROMPT — Sprint 48 runtime prompt contract.
 * Operationalises Pattern Library SP-02 and SP-03 for GAM material authoring.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_INSTRUCTIONAL_PATTERN_PROMPT = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var MODULE_ID = "INSTRUCTIONAL-PATTERN-PROMPT";
  var MARKER_SP02 = "INSTRUCTIONAL-PATTERN-SP-02 (auto-applied)";
  var MARKER_SP03 = "INSTRUCTIONAL-PATTERN-SP-03 (auto-applied)";

  var SP02_LINES = [
    "",
    MARKER_SP02 + ":",
    "- Module: " + MODULE_ID + " | Pattern: SP-02 / DT-SP-01 partial-exemplar decision table | Contract: 44-2 §5.6",
    "- When emitting Material: ... (decision_table): every decision_table body MUST include exactly one partial exemplar row that models evidence-gathering before learner judgement.",
    "- On the exemplar row only: populate evidence/reasoning cells with substantive domain-appropriate content; remaining rows leave learner-completion cells empty.",
    "- Judgement / decision / rating / alignment columns MUST stay empty on every row, including the exemplar row — learner owns evaluative conclusions (MP-1).",
    "- Do not pre-fill Correct/Incorrect, Impact, rank ordinals, align yes/partial/no, or final judgements in learner-owned columns.",
    "- An all-empty decision_table (valid pipe-table structure but no modelled row) is an instructional FAIL (FM-04) — do not emit.",
    "- GOOD shape example (copy structure; adapt labels and content to upstream criteria/scenarios):",
    "  | Item | Judgement (leave blank) | Evidence | Explanation |",
    "  | --- | --- | --- | --- |",
    "  | First criterion or scenario |  | Brief evidence citing the case | Brief reasoning linking evidence to the move — not a final judgement |",
    "  | Second item |  |  |  |",
    "- FORBIDDEN: criteria × scenario matrices or judgement grids with every cell empty and no exemplar row — that is FM-04.",
    "- Row labels and columns must align with upstream criteria and learner_task; domain-appropriate content only — do not transplant benchmark prose."
  ];

  var SP03_LINES = [
    "",
    MARKER_SP03 + ":",
    "- Module: " + MODULE_ID + " | Pattern: SP-03 / TP-SP-01 capstone transfer prompt | Contract: 44-2 §5.8",
    "- When emitting Material: ... (transfer_prompt): require substantive transfer scaffolding — not a thin slot or single-sentence correction task.",
    "- Include an operational completion criterion (word band and/or required elements to address).",
    "- Require learner-context selection — learner chooses or owns the application context (not third-person claim correction only).",
    "- Provide multiple distinct application cues or analytical moves in bullet form.",
    "- Link to session criteria or key ideas named in upstream materials where available.",
    "- Do not supply a pre-written learner transfer response; assign production to the learner (MP-1).",
    "- Avoid Failed-floor shapes: body too thin to guide production (FM-02); generic third-person procedural transfer without own-context (FM-03)."
  ];

  function sp02MarkerRegex() {
    return /INSTRUCTIONAL-PATTERN-SP-02 \(auto-applied\)/i;
  }

  function sp03MarkerRegex() {
    return /INSTRUCTIONAL-PATTERN-SP-03 \(auto-applied\)/i;
  }

  function sp02AlreadyPresent(text) {
    return sp02MarkerRegex().test(String(text || ""));
  }

  function sp03AlreadyPresent(text) {
    return sp03MarkerRegex().test(String(text || ""));
  }

  function buildSp02PromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var includeMarker = opts.includeMarker !== false;
    var lines = includeMarker ? SP02_LINES.slice() : SP02_LINES.slice(2);
    return lines.join("\n");
  }

  function buildSp03PromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var includeMarker = opts.includeMarker !== false;
    var lines = includeMarker ? SP03_LINES.slice() : SP03_LINES.slice(2);
    return lines.join("\n");
  }

  function buildInstructionalPatternPromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var parts = [];
    if (!opts.sp02Only) {
      parts.push(buildSp02PromptBlock(opts));
    }
    if (!opts.sp03Only) {
      parts.push(buildSp03PromptBlock(opts));
    }
    return parts.join("\n").trim();
  }

  function applyInstructionalPatternPromptBlockToDraft(draft, context) {
    var draftBody = String(draft || "").trim();
    if (!draftBody) return "";
    var out = draftBody;
    if (!sp02AlreadyPresent(out)) {
      out = (out + buildSp02PromptBlock()).trim();
    }
    if (!sp03AlreadyPresent(out)) {
      out = (out + buildSp03PromptBlock()).trim();
    }
    return out;
  }

  return {
    MODULE_ID: MODULE_ID,
    MARKER_SP02: MARKER_SP02,
    MARKER_SP03: MARKER_SP03,
    buildSp02PromptBlock: buildSp02PromptBlock,
    buildSp03PromptBlock: buildSp03PromptBlock,
    buildInstructionalPatternPromptBlock: buildInstructionalPatternPromptBlock,
    applyInstructionalPatternPromptBlockToDraft: applyInstructionalPatternPromptBlockToDraft,
    sp02MarkerRegex: sp02MarkerRegex,
    sp03MarkerRegex: sp03MarkerRegex,
    sp02AlreadyPresent: sp02AlreadyPresent,
    sp03AlreadyPresent: sp03AlreadyPresent
  };
});
