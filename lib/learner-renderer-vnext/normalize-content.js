"use strict";

function normalizeHeadingToken(value) {
  return String(value == null ? "" : value)
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

var REDUNDANT_MATERIAL_HEADINGS = Object.freeze([
  "example",
  "overview",
  "introduction",
  "summary"
]);

/**
 * Exact aliases for renderer-owned orientation region labels.
 * Only the first leading markdown heading may be stripped when it matches.
 */
var REGION_HEADING_ALIASES = Object.freeze({
  overview: Object.freeze(["overview", "welcome", "introduction"]),
  "learning purpose": Object.freeze(["learning purpose", "purpose"]),
  "knowledge summary": Object.freeze(["knowledge summary"]),
  "study tips": Object.freeze(["study tips", "tips"])
});

function aliasesForContextTitle(contextTitle) {
  var titleNorm = normalizeHeadingToken(contextTitle);
  if (!titleNorm) return [];
  var aliases = REGION_HEADING_ALIASES[titleNorm];
  return Array.isArray(aliases) ? aliases : [];
}

/**
 * Remove a leading markdown heading when it duplicates a renderer-owned title
 * or a known semantic alias for that region (e.g. "## Welcome" under Overview).
 *
 * Only inspects the first meaningful markdown heading at the start of the body.
 * Does not rewrite the remainder of the body.
 *
 * @param {string} body
 * @param {string} contextTitle
 * @returns {string}
 */
function stripLeadingMatchingMarkdownHeading(body, contextTitle) {
  var source = String(body == null ? "" : body).replace(/\r\n?/g, "\n");
  if (!source.trim()) return source;

  var match = source.match(/^\s*(#{1,6})\s+([^\n]+)\n?/);
  if (!match) return source;

  var headingText = String(match[2] || "").trim();
  var headingNorm = normalizeHeadingToken(headingText);
  var titleNorm = normalizeHeadingToken(contextTitle);
  if (!headingNorm) return source;

  var shouldStrip = false;
  if (titleNorm && headingNorm === titleNorm) {
    shouldStrip = true;
  } else if (titleNorm && aliasesForContextTitle(contextTitle).indexOf(headingNorm) >= 0) {
    shouldStrip = true;
  } else if (titleNorm && REDUNDANT_MATERIAL_HEADINGS.indexOf(headingNorm) >= 0) {
    shouldStrip = titleNorm.indexOf(headingNorm) >= 0;
  }

  if (!shouldStrip) return source;
  return source.slice(match[0].length).replace(/^\s+/, "");
}

/**
 * Normalise Design Page–owned page_synthesis orientation bodies in place
 * (transport/render hygiene). Leaves materials and activity content untouched.
 *
 * @param {Object|null|undefined} pageSynthesis
 * @returns {Object|null|undefined}
 */
function normalizePageSynthesisOrientationBodies(pageSynthesis) {
  if (!pageSynthesis || typeof pageSynthesis !== "object" || Array.isArray(pageSynthesis)) {
    return pageSynthesis;
  }
  var fieldTitles = {
    overview: "Overview",
    learning_purpose: "Learning purpose",
    knowledge_summary: "Knowledge summary",
    study_tips: "Study tips"
  };
  Object.keys(fieldTitles).forEach(function (field) {
    var entry = pageSynthesis[field];
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return;
    if (!Object.prototype.hasOwnProperty.call(entry, "body")) return;
    entry.body = stripLeadingMatchingMarkdownHeading(entry.body, fieldTitles[field]);
  });
  return pageSynthesis;
}

module.exports = {
  normalizeHeadingToken: normalizeHeadingToken,
  stripLeadingMatchingMarkdownHeading: stripLeadingMatchingMarkdownHeading,
  normalizePageSynthesisOrientationBodies: normalizePageSynthesisOrientationBodies,
  REGION_HEADING_ALIASES: REGION_HEADING_ALIASES
};
