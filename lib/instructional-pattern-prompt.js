/**
 * INSTRUCTIONAL-PATTERN-PROMPT — Sprint 48 runtime prompt contract.
 * Operationalises Pattern Library SP-01 through SP-07 for GAM material authoring.
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
  var MARKER_SP01 = "INSTRUCTIONAL-PATTERN-SP-01 (auto-applied)";
  var MARKER_SP02 = "INSTRUCTIONAL-PATTERN-SP-02 (auto-applied)";
  var MARKER_SP03 = "INSTRUCTIONAL-PATTERN-SP-03 (auto-applied)";
  var MARKER_SP04 = "INSTRUCTIONAL-PATTERN-SP-04 (auto-applied)";
  var MARKER_SP05 = "INSTRUCTIONAL-PATTERN-SP-05 (auto-applied)";
  var MARKER_SP06 = "INSTRUCTIONAL-PATTERN-SP-06 (auto-applied)";
  var MARKER_SP07 = "INSTRUCTIONAL-PATTERN-SP-07 (auto-applied)";

  var SP01_LINES = [
    "",
    MARKER_SP01 + ":",
    "- Module: " + MODULE_ID + " | Pattern: SP-01 / TEXT-SP-01 connective exposition prose | Contract: 44-2 §5.1",
    "- When emitting Material: ... (text): every text body MUST provide substantive connective exposition — not a label, specification synopsis, or task-instruction duplicate.",
    "- MUST use substantive connective prose linking at least two distinct ideas with explicit relational language.",
    "- MUST teach and explain for the learner — clearly distinct from assigning the learner deliverable or expected_output task.",
    "- MUST NOT append Cognition cues sections, orientation metadata, or cognition-field blocks inside the text Content — exposition-only (FM-07).",
    "- Do not supply a completed learner response or pre-written deliverable in exposition; teach and frame only (MP-1).",
    "- A text body that appends cognition cues or orientation metadata after exposition is an instructional FAIL (FM-07) — do not emit.",
    "- GOOD shape example (copy structure; adapt concepts to upstream arc):",
    "  [Concept A] — explanatory definitional prose with application meaning.",
    "  [Concept B] — linked with relational language (leads to / difference between / both X and Y).",
    "  [Concept C] — builds intellectual progression toward integrative insight.",
    "  **Example:** Substantive applied illustration bridging concepts to a concrete case — do not pre-answer the learner's independent task.",
    "- FORBIDDEN: appended Cognition cues: block or orientation metadata inside text Content — FM-07.",
    "- FORBIDDEN: specification synopsis only; definition table without connective prose; dominant task-assignment mode.",
    "- Domain-appropriate content only — do not transplant benchmark prose."
  ];

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

  var SP04_LINES = [
    "",
    MARKER_SP04 + ":",
    "- Module: " + MODULE_ID + " | Pattern: SP-04 / CS-SP-01 multi-angle consolidation scaffold | Contract: 44-2 §5.9",
    "- When emitting Material: ... (consolidation_summary): every consolidation_summary body MUST scaffold learner-produced synthesis — not a spoiler essay, completed summary, learning-outcomes replay, or teacher-written conclusion.",
    "- MUST require learner-produced synthesis — imperative learner-write instruction (e.g. write / summarise / bring together your understanding).",
    "- MUST include an operational completion criterion — stated word band and/or required elements to address.",
    "- MUST include at least three synthesis angles or prompts in bullet form.",
    "- Synthesis angles MUST focus on reflection, distinction, judgement, uncertainty, and/or future questions — not a replay of learning outcomes.",
    "- Do not supply a completed consolidation essay, capstone judgement, or pre-written synthesis; scaffolding only (MP-1).",
    "- A consolidation_summary that is too thin to guide learner synthesis (insufficient guidance, bullet prompts only with no synthesis expectation, or no learner-write requirement) is an instructional FAIL (FM-10) — do not emit.",
    "- GOOD shape example (copy structure; adapt angles and word band to upstream arc):",
    "  Write [word band] synthesising your understanding. Do not introduce new topics — consolidate what you worked through.",
    "  • What key distinction can you now make?",
    "  • Where does the framework fit or fall short?",
    "  • What uncertainty or open question remains?",
    "  • What would you test or apply next?",
    "  You might begin with: \"One idea that now seems clearer is…\" / \"A limitation I can now explain is…\"",
    "- FORBIDDEN: past-tense session summary (e.g. \"In this session you learned…\") — learner must write, not read a conclusion.",
    "- FORBIDDEN: completed consolidation summary or model essay fulfilling the closure task.",
    "- FORBIDDEN: learning-outcomes replay or capstone judgement written for the learner.",
    "- Domain-appropriate content only — do not transplant benchmark prose."
  ];

  var SP05_LINES = [
    "",
    MARKER_SP05 + ":",
    "- Module: " + MODULE_ID + " | Pattern: SP-05 / CL-SP-01 criteria-linked verification checklist | Contract: 44-2 §5.7",
    "- When emitting Material: ... (checklist): every checklist body MUST provide criteria-linked learner self-check verification — not a pointer stub, reflection-only list, or generic completion audit.",
    "- MUST include at least four checkable items tied to expected_output or activity criteria.",
    "- MUST use learner-check imperatives (Have you / Did you / Does your) on every item.",
    "- After check items and before revise guidance, MUST include `## Common mistakes` with 2–4 discipline-specific novice traps or weak-response shapes tied to the deliverable — diagnostic, not motivational.",
    "- MUST end with `### If any check is not met:` followed by specific, actionable revision moves (what to add, re-read, or restructure) — not generic advice.",
    "- Do not supply completed learner work or model answers in checklist items (MP-1).",
    "- A checklist that verifies row, table, or task completion only without reasoning-quality or criteria-evidence checks is an instructional FAIL (FM-09) — do not emit.",
    "- A checklist with fewer than four checkable items, a pointer-only body (e.g. as above), or no verification function is an instructional FAIL — do not emit.",
    "- A checklist without `## Common mistakes` or without a substantive `### If any check is not met:` revise block is an instructional FAIL (FM-13) — do not emit.",
    "- GOOD shape example (copy structure; adapt criteria to upstream learner_task and expected_output):",
    "  Use this to evaluate your [deliverable]:",
    "  • Have you [criterion tied to expected_output]?",
    "  • Have you [accuracy / evidence check], not just named it?",
    "  • Have you [application to the specific task], not described in general?",
    "  • Have you [relationship or reasoning quality check]?",
    "  ## Common mistakes",
    "  - A common weak response identifies concepts but does not explain the mechanism linking them.",
    "  - Learners often describe outcomes without explaining how the pressure reaches the agents affected.",
    "  - Generic justification that could apply to any case, with no scenario-specific evidence.",
    "  ### If any check is not met:",
    "  Revise your [deliverable] by (1) adding a mechanism sentence for each major claim, (2) citing one scenario detail per point, and (3) naming one genuine uncertainty you still hold.",
    "- FORBIDDEN in checklist: motivational coaching (`Reflect on…`, `Think about…`, `Consider whether…`) without naming a weak pattern or revision move.",
    "- FORBIDDEN: generic revise guidance (`Revise until correct`, `check your work again`) without specific remediation.",
    "- FORBIDDEN: pointer or stub checklist (e.g. as above) — emit a full verification body.",
    "- FORBIDDEN: Did you finish? or other generic completion checks without criteria linkage.",
    "- FORBIDDEN: reflection-only verification (how did you feel?) without criteria retrieval.",
    "- FORBIDDEN: completion-dominant structures (e.g. Is each row complete?) without reasoning-quality checks — FM-09.",
    "- Domain-appropriate content only — do not transplant benchmark prose."
  ];

  var SP06_LINES = [
    "",
    MARKER_SP06 + ":",
    "- Module: " + MODULE_ID + " | Pattern: SP-06 / WE-SP-01 visible-reasoning worked example | Contract: 44-2 §5.2",
    "- When emitting Material: ... (worked_example): every worked_example body MUST include an explicit parallel-task bridge from the modelled method to the learner's equivalent independent task.",
    "- Show labelled steps with visible reasoning on a model item distinct from the learner deliverable — model the move before independent production (MP-2).",
    "- After labelled steps and before **Bridge:**, MUST include `## What experts notice` with at least 2 concise bullets exposing key reasoning moves, important relationships, or novice blind spots the example demonstrates — expert disciplinary reasoning, not generic praise.",
    "- A worked_example with steps but no `## What experts notice` section is an instructional FAIL (FM-12) — do not emit.",
    "- End with a bridge sentence directing the learner to apply the same step sequence or analytic method on their assigned scenario, task, or explanation — transfer the method, not the answer (MP-3).",
    "- Do not supply the learner's independent deliverable, completed parallel response, or copy-paste answer — scaffolding only (MP-1).",
    "- A worked_example that ends at the model conclusion with no learner application guidance is an instructional FAIL (FM-05) — do not emit.",
    "- GOOD shape example (copy structure; adapt steps and bridge to upstream learner_task):",
    "  Step 1: … Step 2: … Step 3: … [visible because/reasoning between steps on the model item]",
    "  ## What experts notice",
    "  - This explanation links [concept A] to [concept B] through a mechanism, not a list of terms.",
    "  - Novices often stop at description; this model shows how to explain the relationship between cause and effect.",
    "  **Bridge:** Now use the same method on your [assigned scenario / parallel task from learner_task] — do not copy the model outcome.",
    "- FORBIDDEN in What experts notice: bullets that only praise clarity, detail, structure, or being well written without naming a disciplinary move.",
    "- MUST NOT embed checklist bodies, verification lists (`Have you` / `Did you` items), or `## Common mistakes` inside worked_example — realise verification as a separate Material: ... (checklist).",
    "- A worked_example containing checklist or verification items is an instructional FAIL (FM-14) — do not emit.",
    "- FORBIDDEN: step chain + model conclusion only, with no parallel-task bridge — that is FM-05.",
    "- Domain-appropriate model content only — do not transplant benchmark prose."
  ];

  var SP07_LINES = [
    "",
    MARKER_SP07 + ":",
    "- Module: " + MODULE_ID + " | Pattern: SP-07 / SO-SP-01 annotated sample output | Contract: 44-2 §5.5",
    "- When emitting Material: ... (sample_output): every sample_output body MUST include the exemplar response or product, then `## Why this works` with 3–5 concise bullets explaining disciplinary strengths of the example.",
    "- Bullets MUST name reasoning quality, conceptual connections, analytical moves, evaluative moves, or disciplinary judgement — not generic writing praise.",
    "- End with: Use this as a quality guide, not as text to copy.",
    "- The exemplar item MUST be parallel to but not identical with the learner's assigned deliverable when independent production is required (MP-1).",
    "- A sample_output with exemplar text only and no `## Why this works` section is an instructional FAIL (FM-11) — do not emit.",
    "- GOOD shape example (copy structure; adapt content to upstream learner_task and expected_output):",
    "  > [Parallel scenario response demonstrating structure and depth expected in expected_output…]",
    "  ## Why this works",
    "  - Links concepts through a causal mechanism rather than listing definitions.",
    "  - Uses scenario-specific evidence to support the analytical move, not generic claims.",
    "  - Moves beyond description by explaining relationships and implications.",
    "  Use this as a quality guide, not as text to copy.",
    "- FORBIDDEN in Why this works: bullets that only say clear, detailed, well written, or good structure without tying to disciplinary reasoning.",
    "- FORBIDDEN: sample_output identical to the learner's assigned task pre-answered — MP-1.",
    "- Domain-appropriate content only — do not transplant benchmark prose."
  ];

  function sp01MarkerRegex() {
    return /INSTRUCTIONAL-PATTERN-SP-01 \(auto-applied\)/i;
  }

  function sp02MarkerRegex() {
    return /INSTRUCTIONAL-PATTERN-SP-02 \(auto-applied\)/i;
  }

  function sp03MarkerRegex() {
    return /INSTRUCTIONAL-PATTERN-SP-03 \(auto-applied\)/i;
  }

  function sp04MarkerRegex() {
    return /INSTRUCTIONAL-PATTERN-SP-04 \(auto-applied\)/i;
  }

  function sp05MarkerRegex() {
    return /INSTRUCTIONAL-PATTERN-SP-05 \(auto-applied\)/i;
  }

  function sp06MarkerRegex() {
    return /INSTRUCTIONAL-PATTERN-SP-06 \(auto-applied\)/i;
  }

  function sp07MarkerRegex() {
    return /INSTRUCTIONAL-PATTERN-SP-07 \(auto-applied\)/i;
  }

  function sp01AlreadyPresent(text) {
    return sp01MarkerRegex().test(String(text || ""));
  }

  function sp02AlreadyPresent(text) {
    return sp02MarkerRegex().test(String(text || ""));
  }

  function sp03AlreadyPresent(text) {
    return sp03MarkerRegex().test(String(text || ""));
  }

  function sp04AlreadyPresent(text) {
    return sp04MarkerRegex().test(String(text || ""));
  }

  function sp05AlreadyPresent(text) {
    return sp05MarkerRegex().test(String(text || ""));
  }

  function sp06AlreadyPresent(text) {
    return sp06MarkerRegex().test(String(text || ""));
  }

  function sp07AlreadyPresent(text) {
    return sp07MarkerRegex().test(String(text || ""));
  }

  function buildSp01PromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var includeMarker = opts.includeMarker !== false;
    var lines = includeMarker ? SP01_LINES.slice() : SP01_LINES.slice(2);
    return lines.join("\n");
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

  function buildSp04PromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var includeMarker = opts.includeMarker !== false;
    var lines = includeMarker ? SP04_LINES.slice() : SP04_LINES.slice(2);
    return lines.join("\n");
  }

  function buildSp05PromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var includeMarker = opts.includeMarker !== false;
    var lines = includeMarker ? SP05_LINES.slice() : SP05_LINES.slice(2);
    return lines.join("\n");
  }

  function buildSp06PromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var includeMarker = opts.includeMarker !== false;
    var lines = includeMarker ? SP06_LINES.slice() : SP06_LINES.slice(2);
    return lines.join("\n");
  }

  function buildSp07PromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var includeMarker = opts.includeMarker !== false;
    var lines = includeMarker ? SP07_LINES.slice() : SP07_LINES.slice(2);
    return lines.join("\n");
  }

  function buildInstructionalPatternPromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var parts = [];
    if (
      !opts.sp03Only &&
      !opts.sp05Only &&
      !opts.sp06Only &&
      !opts.sp07Only &&
      !opts.sp04Only &&
      !opts.sp01Only
    ) {
      parts.push(buildSp02PromptBlock(opts));
    }
    if (
      !opts.sp02Only &&
      !opts.sp05Only &&
      !opts.sp06Only &&
      !opts.sp07Only &&
      !opts.sp04Only &&
      !opts.sp01Only
    ) {
      parts.push(buildSp03PromptBlock(opts));
    }
    if (
      !opts.sp02Only &&
      !opts.sp03Only &&
      !opts.sp05Only &&
      !opts.sp04Only &&
      !opts.sp01Only &&
      !opts.sp07Only
    ) {
      parts.push(buildSp06PromptBlock(opts));
    }
    if (
      !opts.sp02Only &&
      !opts.sp03Only &&
      !opts.sp05Only &&
      !opts.sp06Only &&
      !opts.sp04Only &&
      !opts.sp01Only &&
      !opts.sp07Only
    ) {
      parts.push(buildSp07PromptBlock(opts));
    }
    if (
      !opts.sp02Only &&
      !opts.sp03Only &&
      !opts.sp05Only &&
      !opts.sp06Only &&
      !opts.sp07Only &&
      !opts.sp01Only
    ) {
      parts.push(buildSp04PromptBlock(opts));
    }
    if (
      !opts.sp02Only &&
      !opts.sp03Only &&
      !opts.sp04Only &&
      !opts.sp06Only &&
      !opts.sp07Only &&
      !opts.sp01Only
    ) {
      parts.push(buildSp05PromptBlock(opts));
    }
    if (
      !opts.sp02Only &&
      !opts.sp03Only &&
      !opts.sp04Only &&
      !opts.sp05Only &&
      !opts.sp06Only &&
      !opts.sp07Only
    ) {
      parts.push(buildSp01PromptBlock(opts));
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
    if (!sp07AlreadyPresent(out)) {
      out = (out + buildSp07PromptBlock()).trim();
    }
    if (!sp04AlreadyPresent(out)) {
      out = (out + buildSp04PromptBlock()).trim();
    }
    if (!sp05AlreadyPresent(out)) {
      out = (out + buildSp05PromptBlock()).trim();
    }
    if (!sp01AlreadyPresent(out)) {
      out = (out + buildSp01PromptBlock()).trim();
    }
    return out;
  }

  return {
    MODULE_ID: MODULE_ID,
    MARKER_SP01: MARKER_SP01,
    MARKER_SP02: MARKER_SP02,
    MARKER_SP03: MARKER_SP03,
    MARKER_SP04: MARKER_SP04,
    MARKER_SP05: MARKER_SP05,
    MARKER_SP06: MARKER_SP06,
    MARKER_SP07: MARKER_SP07,
    buildSp01PromptBlock: buildSp01PromptBlock,
    buildSp02PromptBlock: buildSp02PromptBlock,
    buildSp03PromptBlock: buildSp03PromptBlock,
    buildSp04PromptBlock: buildSp04PromptBlock,
    buildSp05PromptBlock: buildSp05PromptBlock,
    buildSp06PromptBlock: buildSp06PromptBlock,
    buildSp07PromptBlock: buildSp07PromptBlock,
    buildInstructionalPatternPromptBlock: buildInstructionalPatternPromptBlock,
    applyInstructionalPatternPromptBlockToDraft: applyInstructionalPatternPromptBlockToDraft,
    sp01MarkerRegex: sp01MarkerRegex,
    sp02MarkerRegex: sp02MarkerRegex,
    sp03MarkerRegex: sp03MarkerRegex,
    sp04MarkerRegex: sp04MarkerRegex,
    sp05MarkerRegex: sp05MarkerRegex,
    sp06MarkerRegex: sp06MarkerRegex,
    sp07MarkerRegex: sp07MarkerRegex,
    sp01AlreadyPresent: sp01AlreadyPresent,
    sp02AlreadyPresent: sp02AlreadyPresent,
    sp03AlreadyPresent: sp03AlreadyPresent,
    sp04AlreadyPresent: sp04AlreadyPresent,
    sp05AlreadyPresent: sp05AlreadyPresent,
    sp06AlreadyPresent: sp06AlreadyPresent,
    sp07AlreadyPresent: sp07AlreadyPresent
  };
});
