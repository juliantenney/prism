"use strict";

/**
 * Learner-visible labels for canonical activities[].grouping tokens.
 * Presentation only — stored/model values remain machine tokens.
 */

var CANONICAL_GROUPING_DISPLAY_LABELS = Object.freeze({
  individual: "Individual",
  pair: "Pair",
  pairs: "Pairs",
  small_group: "Small group",
  whole_group: "Whole group",
  individual_then_small_group: "Individual then small group",
  individual_then_pair: "Individual then pair",
  mixed: "Mixed"
});

function normalizeGroupingToken(value) {
  return String(value == null ? "" : value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function humanizeGroupingTokenFallback(token) {
  var words = token.split("_").filter(Boolean);
  if (!words.length) return "";
  var phrase = words.join(" ");
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}

function labelForGroupingDisplay(grouping) {
  var raw = String(grouping == null ? "" : grouping).trim();
  if (!raw) return "";
  var token = normalizeGroupingToken(raw);
  if (Object.prototype.hasOwnProperty.call(CANONICAL_GROUPING_DISPLAY_LABELS, token)) {
    return CANONICAL_GROUPING_DISPLAY_LABELS[token];
  }
  return humanizeGroupingTokenFallback(token);
}

module.exports = {
  CANONICAL_GROUPING_DISPLAY_LABELS: CANONICAL_GROUPING_DISPLAY_LABELS,
  labelForGroupingDisplay: labelForGroupingDisplay
};
