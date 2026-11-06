"use strict";

var html = require("./render-html-utils");

function isBlankCell(value) {
  return !String(value == null ? "" : value).trim();
}

/**
 * Split a markdown body into prose and every pipe table, in authored order.
 * A blank line ends a table, so a later table is a separate segment.
 *
 * @param {string} body
 * @returns {Array<{ kind: "prose", text: string }|{ kind: "table", header: string[], rows: string[][] }>}
 */
function extractMarkdownBodySegments(body) {
  var raw = String(body || "").replace(/\r\n?/g, "\n").trim();
  if (!raw) return [];

  var lines = raw.split("\n");
  var segments = [];
  var prose = [];
  var index = 0;

  function flushProse() {
    var text = prose.join("\n").trim();
    prose = [];
    if (text) segments.push({ kind: "prose", text: text });
  }

  while (index < lines.length) {
    var line = String(lines[index] || "");
    if (line.indexOf("|") !== -1 && html.isMarkdownTableDivider(lines[index + 1] || "")) {
      flushProse();
      var header = html.parseMarkdownTableRow(line);
      var rows = [];
      index += 2;
      while (index < lines.length) {
        var rowLine = String(lines[index] || "");
        if (!rowLine.trim() || rowLine.indexOf("|") === -1) break;
        rows.push(html.parseMarkdownTableRow(rowLine));
        index += 1;
      }
      if (header.length) segments.push({ kind: "table", header: header, rows: rows });
      continue;
    }
    prose.push(line);
    index += 1;
  }
  flushProse();
  return segments;
}

/**
 * Extract the first markdown pipe table from a material body.
 *
 * @param {import("./types").LearnerMaterial} material
 * @returns {{ header: string[], rows: string[][] }|null}
 */
function extractTableFromMaterial(material) {
  var segments = extractMarkdownBodySegments(material && material.body);
  var index;
  for (index = 0; index < segments.length; index += 1) {
    if (segments[index].kind === "table") {
      return { header: segments[index].header, rows: segments[index].rows };
    }
  }
  return null;
}

/**
 * Whether a table material body includes at least one blank cell suitable for
 * learner completion (used for conditional table_entry routing).
 *
 * @param {import("./types").LearnerMaterial|null|undefined} material
 * @returns {boolean}
 */
function materialHasBlankTableCells(material) {
  var segments = extractMarkdownBodySegments(material && material.body);
  return segments.some(function (segment) {
    if (segment.kind !== "table" || !segment.rows.length) return false;
    return segment.rows.some(function (row) {
      return row.some(function (cell) {
        return isBlankCell(cell);
      });
    });
  });
}

module.exports = {
  isBlankCell: isBlankCell,
  extractMarkdownBodySegments: extractMarkdownBodySegments,
  extractTableFromMaterial: extractTableFromMaterial,
  materialHasBlankTableCells: materialHasBlankTableCells
};
