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
 * Remove a leading markdown heading when it duplicates a renderer-owned title.
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
  } else if (titleNorm && REDUNDANT_MATERIAL_HEADINGS.indexOf(headingNorm) >= 0) {
    shouldStrip = titleNorm.indexOf(headingNorm) >= 0;
  }

  if (!shouldStrip) return source;
  return source.slice(match[0].length).replace(/^\s+/, "");
}

module.exports = {
  normalizeHeadingToken: normalizeHeadingToken,
  stripLeadingMatchingMarkdownHeading: stripLeadingMatchingMarkdownHeading
};
