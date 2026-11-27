/**
 * Sprint 104 M6 — shared workload authoring principles.
 *
 * One canonical statement of the educational workload principles used by Learning Journey
 * commissioning and by Practice component authoring. Product-specific operational guidance
 * remains in its own contract; the underlying principles are stated here once so that the
 * commissioning stage, the Practice presentation contracts and the workload estimator stay
 * consistent. These are planning principles, not fixed limits or duration tiers.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_WORKLOAD_AUTHORING_PRINCIPLES = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var PRINCIPLES = [
    {
      id: "integrated_performance",
      text:
        "Where constructing a response is itself the reasoning performance, charge the cognition once: do not add separate reasoning and production surcharges for the same act. Apply the same principle to integrated evidence inspection, revision, feedback and self-evaluation."
    },
    {
      id: "genuine_additional_demand",
      text:
        "Keep the genuinely additional demands: unfamiliar evidence, independent production, and sequential rewriting after feedback. Do not remove them merely because they occur later in an activity sequence."
    },
    {
      id: "familiar_revisit",
      text:
        "Revisiting familiar material is lighter than first-pass inspection of unfamiliar evidence and should not be repeated as a full read."
    },
    {
      id: "complementary_feedback",
      text:
        "Feedback mechanisms (worked responses, explanatory feedback, review criteria, repair guidance) complement rather than duplicate one another within the authoritative duration."
    },
    {
      id: "revision_mode",
      text:
        "Distinguish revising a disciplinary object as the primary performance, targeted improvement of the learner's existing response, and substantial sequential rewriting after feedback. Targeted refinement is part of the workload but is not costed as a full rewrite."
    },
    {
      id: "scope_from_task",
      text:
        "Scope follows the intellectual task (evidence volume, response demand, reasoning complexity), not the allocated duration. A single item may still be demanding, and a short allocation does not justify a lower estimate."
    },
    {
      id: "heuristic_estimates",
      text:
        "Numerical workload bands are heuristic planning aids, not calibrated learner timings. Raise an advisory only where the corrected interpretation of the evidence supports it; do not optimise to eliminate it."
    }
  ];

  /** @returns {Array<{id: string, text: string}>} */
  function listPrinciples() {
    return PRINCIPLES.map(function (p) {
      return { id: p.id, text: p.text };
    });
  }

  /**
   * Prompt-ready lines. Callers prepend their own heading when embedding.
   * @returns {string[]}
   */
  function promptLines() {
    return PRINCIPLES.map(function (p) {
      return "- " + p.text;
    });
  }

  var PROMPT_HEADING = "SHARED WORKLOAD PRINCIPLES";
  var PROMPT_INTRO =
    "Apply these principles, shared with component authoring, when allocating minutes and scoping each commission:";

  /**
   * Single-source prompt block used verbatim by the Learning Journey commissioning prompts
   * (heading, one introductory sentence, then the canonical principle lines).
   * @returns {string}
   */
  function promptBlock() {
    return [PROMPT_HEADING, "", PROMPT_INTRO].concat(promptLines()).join("\n");
  }

  return {
    PROMPT_HEADING: PROMPT_HEADING,
    listPrinciples: listPrinciples,
    promptLines: promptLines,
    promptBlock: promptBlock
  };
});
