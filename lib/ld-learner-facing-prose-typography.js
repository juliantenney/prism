/**
 * LD-LEARNER-FACING-PROSE-TYPOGRAPHY — global PRISM editorial standard.
 * Continuous learner-facing explanatory prose must not use discretionary
 * inline bold/italic/underline for emphasis. Structural/semantic formatting
 * remains permitted. Generation guidance only — not renderer sanitisation.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LD_LEARNER_FACING_PROSE_TYPOGRAPHY = api;
  }
})(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  function () {
    "use strict";

    var MODULE_ID = "LD-LEARNER-FACING-PROSE-TYPOGRAPHY";
    var MARKER = "LD-LEARNER-FACING-PROSE-TYPOGRAPHY (auto-applied)";

    var CORE_LINES = [
      "",
      MARKER + ":",
      "- Module: " +
        MODULE_ID +
        " | Global PRISM editorial standard for generated learner-facing prose (all resource types and routes).",
      "- Continuous learner-facing explanatory prose must not use discretionary inline bold, italic or underline for emphasis (including Markdown **bold**, *italic*, and __/__/_ forms used only to highlight words).",
      "- Communicate importance, contrast, definitions and conceptual distinctions through wording, sentence structure and organisation — not through typographic emphasis as a substitute for effective writing.",
      "- Do not replace removed emphasis with another decorative treatment (for example colour, ALL CAPS used only for stress, or repeated punctuation).",
      "- Preserve legitimate structural and semantic formatting: headings and section titles; interface labels, controls and disclosure summaries; structured checklist, table and response-field labels (including template **Label:** sections); mathematical notation and disciplinary conventions where formatting has a specific meaning; titles of works where italics are conventionally appropriate.",
      "- Distinction: formatting that communicates structure or meaning is permitted; formatting that merely draws attention to words in running prose is not."
    ];

    function markerRegex() {
      return /LD-LEARNER-FACING-PROSE-TYPOGRAPHY \(auto-applied\)/i;
    }

    function moduleIdInTextRegex() {
      return /LD-LEARNER-FACING-PROSE-TYPOGRAPHY \| Global PRISM editorial standard/i;
    }

    function proseTypographyAlreadyPresent(text) {
      var body = String(text || "");
      return markerRegex().test(body) || moduleIdInTextRegex().test(body);
    }

    function buildLearnerFacingProseTypographyPromptBlock(options) {
      var opts = options && typeof options === "object" ? options : {};
      var includeMarker = opts.includeMarker !== false;
      return (includeMarker ? CORE_LINES : CORE_LINES.slice(2)).join("\n");
    }

    function applyLearnerFacingProseTypographyContractToDraft(draftText, context) {
      var draftBody = String(draftText || "").trim();
      if (!draftBody) return "";
      if (proseTypographyAlreadyPresent(draftBody)) return draftBody;
      // context reserved for future step gating; current policy is global on
      // every learner-facing generation prompt that reaches runtime augmentation.
      void context;
      return (draftBody + buildLearnerFacingProseTypographyPromptBlock({ includeMarker: true })).trim();
    }

    return {
      MODULE_ID: MODULE_ID,
      MARKER: MARKER,
      buildLearnerFacingProseTypographyPromptBlock: buildLearnerFacingProseTypographyPromptBlock,
      applyLearnerFacingProseTypographyContractToDraft:
        applyLearnerFacingProseTypographyContractToDraft,
      proseTypographyAlreadyPresent: proseTypographyAlreadyPresent,
      markerRegex: markerRegex
    };
  }
);
