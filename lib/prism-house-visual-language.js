/**
 * S78-T-048 — Deterministic PRISM house educational visual language.
 * Presentation policy only: visual family for learner-resource figures.
 * Does NOT author instructional concepts, claims, or relationships (T-047 owns those).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_HOUSE_VISUAL_LANGUAGE = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var RESOURCE_VISUAL_LANGUAGE_HEADING = "Resource visual language:";

  /**
   * Shared house-style lines (bullet form for human prompt; same strings everywhere).
   * Domain-generic. No subject matter, must_show, claims, or evidence.
   */
  var HOUSE_VISUAL_LANGUAGE_LINES = Object.freeze([
    "Restrained, high-quality university-level educational illustration.",
    "Explanatory diagram character — not a promotional poster, marketing infographic, or decorative collage.",
    "Prefer coherent diagrammatic / schematic treatment by default.",
    "Use richer spatial or landscape treatment only when the chosen representation genuinely benefits from spatial geography.",
    "Keep palette character restrained and coherent across figures for this learner resource.",
    "Use consistent annotation, label, arrow and callout character.",
    "Keep backgrounds uncluttered; avoid decorative chrome that competes with instructional labels.",
    "Figures for this learner resource should feel like members of the same visual family.",
    "Do not force different representation types into identical compositions — layout follows Visual structure / Representation."
  ]);

  function getResourceVisualLanguageHeading() {
    return RESOURCE_VISUAL_LANGUAGE_HEADING;
  }

  function getHouseVisualLanguageLines() {
    return HOUSE_VISUAL_LANGUAGE_LINES.slice();
  }

  function formatResourceVisualLanguageSection() {
    return (
      RESOURCE_VISUAL_LANGUAGE_HEADING +
      "\n" +
      HOUSE_VISUAL_LANGUAGE_LINES.map(function (line) {
        return "- " + line;
      }).join("\n")
    );
  }

  /**
   * Extract the house-style block from a prompt for equality assertions.
   * Returns "" if missing.
   */
  function extractResourceVisualLanguageBlock(promptText) {
    var text = String(promptText || "");
    var start = text.indexOf(RESOURCE_VISUAL_LANGUAGE_HEADING);
    if (start === -1) return "";
    var after = text.slice(start);
    var nextSection = after.search(/\n\n[A-Z][^\n]*:\n/);
    if (nextSection === -1) {
      var closing = after.indexOf("\n\nReturn the finished visual itself");
      if (closing !== -1) return after.slice(0, closing).trim();
      return after.trim();
    }
    return after.slice(0, nextSection).trim();
  }

  function resourceVisualLanguageLooksInstructional(block) {
    var text = String(block || "");
    return (
      /must_show|must_not_show|allowed_claims|disallowed_claims/i.test(text) ||
      /Concept \/ claim boundary|Authorised source evidence/i.test(text) ||
      /Supported claim boundary|Do not claim:/i.test(text)
    );
  }

  return {
    MODULE_ID: "PRISM-HOUSE-VISUAL-LANGUAGE",
    RESOURCE_VISUAL_LANGUAGE_HEADING: RESOURCE_VISUAL_LANGUAGE_HEADING,
    HOUSE_VISUAL_LANGUAGE_LINES: HOUSE_VISUAL_LANGUAGE_LINES,
    getResourceVisualLanguageHeading: getResourceVisualLanguageHeading,
    getHouseVisualLanguageLines: getHouseVisualLanguageLines,
    formatResourceVisualLanguageSection: formatResourceVisualLanguageSection,
    extractResourceVisualLanguageBlock: extractResourceVisualLanguageBlock,
    resourceVisualLanguageLooksInstructional: resourceVisualLanguageLooksInstructional
  };
});
