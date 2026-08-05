/**
 * Canonical execution directives for workflow pipeline prompts copied into Copilot.
 * Ownership: suppress speculative follow-up questions after successful step completion.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_WORKFLOW_PIPELINE_EXECUTION_DIRECTIVE = api;
  }
})(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  function () {
    "use strict";

    var PIPELINE_EXECUTION_OPENING_DIRECTIVE =
      "Execution mode: autonomous. Do not ask the user follow-up questions. If something is ambiguous, choose the most reasonable interpretation from provided workflow context and continue.";

    var PIPELINE_EXECUTION_COMPLETION_DIRECTIVE =
      "Pipeline completion rule: after you emit the required artefact and the exact runner footer line, stop immediately. Do not ask follow-up questions and do not offer optional next steps (including phrasing such as \"Would you like me to...\", \"Shall I also...\", \"Should I generate...\", \"Would you like another version...\", \"Any other changes?\", or \"Any further refinements?\").";

    var SPECULATIVE_FOLLOW_UP_PATTERNS = [
      /would you like me to/i,
      /shall i also/i,
      /should i generate/i,
      /would you like another version/i,
      /any other changes/i,
      /any further refinements/i
    ];

    function isSpeculativeCopilotFollowUpText(text) {
      var blob = String(text || "");
      if (!blob.trim()) return false;
      return SPECULATIVE_FOLLOW_UP_PATTERNS.some(function (pattern) {
        return pattern.test(blob);
      });
    }

    return {
      PIPELINE_EXECUTION_OPENING_DIRECTIVE: PIPELINE_EXECUTION_OPENING_DIRECTIVE,
      PIPELINE_EXECUTION_COMPLETION_DIRECTIVE: PIPELINE_EXECUTION_COMPLETION_DIRECTIVE,
      isSpeculativeCopilotFollowUpText: isSpeculativeCopilotFollowUpText
    };
  }
);
