"use strict";

var html = require("./render-html-utils");

function isBlankCell(value) {
  return !String(value == null ? "" : value).trim();
}

/**
 * Extract the first markdown pipe table from a material body.
 *
 * @param {import("./types").LearnerMaterial} material
 * @returns {{ header: string[], rows: string[][] }|null}
 */
function extractTableFromMaterial(material) {
  var body = String((material && material.body) || "")
    .replace(/\r\n?/g, "\n")
    .trim();
  if (!body) return null;

  var lines = body.split("\n");
  var index = 0;
  while (index < lines.length) {
    var trimmed = String(lines[index] || "").trim();
    if (!trimmed) {
      index += 1;
      continue;
    }
    if (html.isMarkdownTableDivider(lines[index + 1] || "")) {
      var header = html.parseMarkdownTableRow(lines[index]);
      var rows = [];
      index += 2;
      while (index < lines.length) {
        var line = String(lines[index] || "");
        if (!String(line || "").trim()) break;
        if (line.indexOf("|") === -1) break;
        rows.push(html.parseMarkdownTableRow(line));
        index += 1;
      }
      return { header: header, rows: rows };
    }
    index += 1;
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
  var tableData = extractTableFromMaterial(material);
  if (!tableData || !tableData.rows.length) return false;
  return tableData.rows.some(function (row) {
    return row.some(function (cell) {
      return isBlankCell(cell);
    });
  });
}

module.exports = {
  isBlankCell: isBlankCell,
  extractTableFromMaterial: extractTableFromMaterial,
  materialHasBlankTableCells: materialHasBlankTableCells
};
