/**
 * INSTRUCTIONAL-PATTERN-PROMPT — Sprint 48 runtime prompt contract.
 * Operationalises Pattern Library SP-02, SP-03, and SP-06 for GAM material authoring.
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
  var MARKER_SP06 = "INSTRUCTIONAL-PATTERN-SP-06 (auto-applied)";

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
    "- When emitting Material: ... (transfer_prompt): every transfer_prompt body MUST provide substantive learner-owned transfer scaffolding — not a thin slot or generic apply-elsewhere instruction.",
    "- MUST include learner-context selection — learner chooses or owns the application context (platform, workplace, issue, or setting they select).",
    "- MUST include an operational completion criterion — stated word band and/or required elements to address.",
    "- MUST include at least three distinct application cues or analytical moves in bullet form.",
    "- MUST explicitly name or link to session criteria or key ideas from upstream materials when available (e.g. evaluation criteria, concepts from adjacent exposition).",
    "- Do not supply a pre-written learner transfer response; assign production to the learner (MP-1).",
    "- A transfer_prompt too thin to guide production (single sentence, no word/element band) is an instructional FAIL (FM-02) — do not emit.",
    "- A transfer_prompt that uses generic third-person application or claim correction without learner-owned context choice is an instructional FAIL (FM-03) — do not emit.",
    "- GOOD shape example (copy structure; adapt context and criteria to upstream arc):",
    "  Choose a [context you know] (e.g. …). Write [word band] addressing:",
    "  • Apply [core concept] to your chosen context",
    "  • Test where the framework fits or falls short",
    "  • Use [named session criterion / key idea] to justify your judgement",
    "  • State what transfers and what does not",
    "- FORBIDDEN: one-sentence transfer prompt — FM-02.",
    "- FORBIDDEN: generic \"apply this to a real-world case\" with no context choice or application cues — FM-02.",
    "- FORBIDDEN: third-person claim correction with no own-context choice — FM-03.",
    "- Domain-appropriate content only — do not transplant benchmark prose."
  ];

  var SP06_LINES = [
    "",
    MARKER_SP06 + ":",
    "- Module: " + MODULE_ID + " | Pattern: SP-06 / WE-SP-01 visible-reasoning worked example | Contract: 44-2 §5.2",
    "- When emitting Material: ... (worked_example): every worked_example body MUST include an explicit parallel-task bridge from the modelled method to the learner's equivalent independent task.",
    "- Show labelled steps with visible reasoning on a model item distinct from the learner deliverable — model the move before independent production (MP-2).",
    "- End with a bridge sentence directing the learner to apply the same step sequence or analytic method on their assigned scenario, task, or explanation — transfer the method, not the answer (MP-3).",
    "- Do not supply the learner's independent deliverable, completed parallel response, or copy-paste answer — scaffolding only (MP-1).",
    "- A worked_example that ends at the model conclusion with no learner application guidance is an instructional FAIL (FM-05) — do not emit.",
    "- GOOD shape example (copy structure; adapt steps and bridge to upstream learner_task):",
    "  Step 1: … Step 2: … Step 3: … [visible because/reasoning between steps on the model item]",
    "  **Bridge:** Now use the same method on your [assigned scenario / parallel task from learner_task] — do not copy the model outcome.",
    "- FORBIDDEN: step chain + model conclusion only, with no parallel-task bridge — that is FM-05.",
    "- Domain-appropriate model content only — do not transplant benchmark prose."
  ];

  function sp02MarkerRegex() {
    return /INSTRUCTIONAL-PATTERN-SP-02 \(auto-applied\)/i;
  }

  function sp03MarkerRegex() {
    return /INSTRUCTIONAL-PATTERN-SP-03 \(auto-applied\)/i;
  }

  function sp06MarkerRegex() {
    return /INSTRUCTIONAL-PATTERN-SP-06 \(auto-applied\)/i;
  }

  function sp02AlreadyPresent(text) {
    return sp02MarkerRegex().test(String(text || ""));
  }

  function sp03AlreadyPresent(text) {
    return sp03MarkerRegex().test(String(text || ""));
  }

  function sp06AlreadyPresent(text) {
    return sp06MarkerRegex().test(String(text || ""));
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

  function buildSp06PromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var includeMarker = opts.includeMarker !== false;
    var lines = includeMarker ? SP06_LINES.slice() : SP06_LINES.slice(2);
    return lines.join("\n");
  }

  function buildInstructionalPatternPromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var parts = [];
    if (!opts.sp03Only && !opts.sp06Only) {
      parts.push(buildSp02PromptBlock(opts));
    }
    if (!opts.sp02Only && !opts.sp06Only) {
      parts.push(buildSp03PromptBlock(opts));
    }
    if (!opts.sp02Only && !opts.sp03Only) {
      parts.push(buildSp06PromptBlock(opts));
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
    if (!sp06AlreadyPresent(out)) {
      out = (out + buildSp06PromptBlock()).trim();
    }
    return out;
  }

  return {
    MODULE_ID: MODULE_ID,
    MARKER_SP02: MARKER_SP02,
    MARKER_SP03: MARKER_SP03,
    MARKER_SP06: MARKER_SP06,
    buildSp02PromptBlock: buildSp02PromptBlock,
    buildSp03PromptBlock: buildSp03PromptBlock,
    buildSp06PromptBlock: buildSp06PromptBlock,
    buildInstructionalPatternPromptBlock: buildInstructionalPatternPromptBlock,
    applyInstructionalPatternPromptBlockToDraft: applyInstructionalPatternPromptBlockToDraft,
    sp02MarkerRegex: sp02MarkerRegex,
    sp03MarkerRegex: sp03MarkerRegex,
    sp06MarkerRegex: sp06MarkerRegex,
    sp02AlreadyPresent: sp02AlreadyPresent,
    sp03AlreadyPresent: sp03AlreadyPresent,
    sp06AlreadyPresent: sp06AlreadyPresent
  };
});
