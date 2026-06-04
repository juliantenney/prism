/**
 * Sprint 38 — representation pedagogical added-value contract (38-6).
 * Guidance catalog only; does not alter compose validation strictness.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_SPRINT38_REPRESENTATION_PEDAGOGICAL_VALUE = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var CONTRACT_VERSION = "38.6";

  var GENERIC_QA_RULE =
    "A generated visual must contribute a reasoning support not already adequately provided by the activity materials.";

  var GENERIC_QA_FAIL_CONDITIONS = [
    "duplicate worksheet",
    "duplicate table",
    "duplicate answer structure",
    "topic poster",
    "illustrated summary",
    "generic infographic"
  ];

  var HUMAN_DESIGNER_TEST_DRAW =
    "Could a competent learning designer draw the figure from the affordance record without reading the full page?";

  var HUMAN_DESIGNER_TEST_COGNITIVE_SUPPORT =
    "Could they explain what cognitive support the figure provides that materials do not already supply? If not, the affordance is incomplete.";

  /**
   * Per preferred_representation token: what the figure must add vs must not duplicate.
   * Keys align with lib/sprint38-visual-affordances.js REPRESENTATIONS.
   */
  var REPRESENTATION_PEDAGOGICAL_VALUE = {
    comparison_framework: {
      must_add: [
        "comparison dimensions",
        "salient differences",
        "confusable features"
      ],
      must_not_duplicate: [
        "two decorative columns",
        "duplicated table",
        "blank worksheet structure without discriminating cues"
      ]
    },
    classification_matrix: {
      must_add: [
        "discriminating cues",
        "decision criteria",
        "category distinctions"
      ],
      must_not_duplicate: [
        "blank worksheet duplication",
        "filled answer key",
        "completed classification cells"
      ]
    },
    causal_model: {
      must_add: [
        "mechanism visibility",
        "directionality",
        "intermediate relationships"
      ],
      must_not_duplicate: [
        "isolated labels",
        "topic diagram",
        "unsupported causal arrows"
      ]
    },
    evidence_t_chart: {
      must_add: [
        "evidence evaluation criteria",
        "strength distinctions"
      ],
      must_not_duplicate: [
        "copied evidence list",
        "pre-weighted verdict on card claims"
      ]
    },
    number_line_segments: {
      must_add: [
        "exact quantitative relationships from source",
        "shared axis with labelled endpoints"
      ],
      must_not_duplicate: [
        "approximate or invented intervals",
        "overlap or significance verdict replacing learner debrief"
      ]
    },
    ordered_bar_strip: {
      must_add: [
        "ordered magnitude relationship",
        "level-to-width or ordering cue from materials"
      ],
      must_not_duplicate: [
        "pie chart restatement",
        "fabricated bar widths",
        "duplicated statistics table"
      ]
    },
    labelled_contrast_panel: {
      must_add: [
        "named contrast dimension",
        "salient two-construct difference"
      ],
      must_not_duplicate: [
        "decorative two-column poster",
        "duplicated comparison table",
        "topic illustration"
      ]
    }
  };

  var REPRESENTATION_TOKEN_LIST = Object.keys(REPRESENTATION_PEDAGOGICAL_VALUE);

  function getPedagogicalValueForRepresentation(token) {
    return REPRESENTATION_PEDAGOGICAL_VALUE[String(token || "").trim()] || null;
  }

  function formatRepresentationGuidanceForPrompt(token) {
    var row = getPedagogicalValueForRepresentation(token);
    if (!row) return "";
    return (
      token +
      " must_add: " +
      row.must_add.join("; ") +
      " | must_not_duplicate: " +
      row.must_not_duplicate.join("; ")
    );
  }

  return {
    CONTRACT_VERSION: CONTRACT_VERSION,
    GENERIC_QA_RULE: GENERIC_QA_RULE,
    GENERIC_QA_FAIL_CONDITIONS: GENERIC_QA_FAIL_CONDITIONS,
    HUMAN_DESIGNER_TEST_DRAW: HUMAN_DESIGNER_TEST_DRAW,
    HUMAN_DESIGNER_TEST_COGNITIVE_SUPPORT: HUMAN_DESIGNER_TEST_COGNITIVE_SUPPORT,
    REPRESENTATION_PEDAGOGICAL_VALUE: REPRESENTATION_PEDAGOGICAL_VALUE,
    REPRESENTATION_TOKEN_LIST: REPRESENTATION_TOKEN_LIST,
    getPedagogicalValueForRepresentation: getPedagogicalValueForRepresentation,
    formatRepresentationGuidanceForPrompt: formatRepresentationGuidanceForPrompt
  };
});
