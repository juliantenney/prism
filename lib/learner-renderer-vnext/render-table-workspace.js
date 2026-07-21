"use strict";

var html = require("./render-html-utils");
var learnerIcons = require("./learner-icon-renderer");
var completionTable = require("./completion-table-workspace");

function slugify(value) {
  return (
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
  );
}

function buildIdPrefix(material, activityId) {
  return [String(activityId || "activity"), String((material && material.id) || "table")]
    .map(slugify)
    .join("-");
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

function isBlankCell(value) {
  return !String(value == null ? "" : value).trim();
}

function renderFixedCell(cellHtml) {
  return (
    '<td class="util-learner-table-workspace__cell util-learner-table-workspace__cell--fixed">' +
    cellHtml +
    "</td>"
  );
}

function renderEditableCell(inputHtml) {
  return (
    '<td class="util-learner-table-workspace__cell util-learner-table-workspace__cell--editable">' +
    inputHtml +
    "</td>"
  );
}

/**
 * Render a completion-table workspace for a Do-moment material item.
 *
 * @param {import("./types").LearnerMaterial} material
 * @param {string} activityId
 * @returns {string}
 */
function renderTableWorkspace(material, activityId, options) {
  if (!material) return "";

  var opts = options && typeof options === "object" ? options : {};

  var tableData = extractTableFromMaterial(material);
  if (!tableData || !tableData.header.length) {
    return require("./render-material").renderMaterial(material);
  }

  var idPrefix = buildIdPrefix(material, activityId);
  var header = tableData.header;
  var rows = tableData.rows;
  var colIds = header.map(function (label, colIndex) {
    return idPrefix + "-col-" + slugify(label) + "-" + colIndex;
  });

  var headHtml =
    "<tr>" +
    header
      .map(function (label, colIndex) {
        return (
          '<th scope="col" id="' +
          html.escapeAttribute(colIds[colIndex]) +
          '">' +
          html.renderMarkdownInline(label) +
          "</th>"
        );
      })
      .join("") +
    "</tr>";

  var bodyHtml = rows
    .map(function (row, rowIndex) {
      var rowLabel = String(row[0] || "").trim();
      var rowId = idPrefix + "-row-" + rowIndex;
      var rowLabelText = rowLabel || "Response row " + (rowIndex + 1);
      var hasRowHeader = !isBlankCell(row[0]);
      var cells = [];
      var rowLabelAssigned = hasRowHeader;

      row.forEach(function (cell, colIndex) {
        var cellContent = html.renderMarkdownInline(cell);
        var isFirstColumn = colIndex === 0;

        if (isFirstColumn && hasRowHeader) {
          cells.push(
            '<th scope="row" id="' +
              html.escapeAttribute(rowId) +
              '" class="util-learner-table-workspace__cell util-learner-table-workspace__cell--fixed">' +
              cellContent +
              "</th>"
          );
          return;
        }

        if (!isBlankCell(cell)) {
          cells.push(renderFixedCell(cellContent));
          return;
        }

        var fieldId = idPrefix + "-input-r" + rowIndex + "-c" + colIndex;
        var labelledBy = rowId + " " + colIds[colIndex];
        var hiddenRowLabel = "";
        if (!rowLabelAssigned) {
          hiddenRowLabel =
            '<span id="' +
            html.escapeAttribute(rowId) +
            '" class="util-visually-hidden">' +
            html.escapeHtml(rowLabelText) +
            "</span>";
          rowLabelAssigned = true;
        }
        var inputHtml =
          hiddenRowLabel +
          '<input type="text" class="util-learner-table-workspace__input" id="' +
          html.escapeAttribute(fieldId) +
          '" name="' +
          html.escapeAttribute(fieldId) +
          '" aria-labelledby="' +
          html.escapeAttribute(labelledBy) +
          '" autocomplete="off" />';
        cells.push(renderEditableCell(inputHtml));
      });

      return "<tr>" + cells.join("") + "</tr>";
    })
    .join("");

  var tableHtml =
    '<div class="util-table-scroll util-learner-table-workspace__table">' +
    "<table>" +
    "<thead>" +
    headHtml +
    "</thead>" +
    (bodyHtml ? "<tbody>" + bodyHtml + "</tbody>" : "") +
    "</table></div>";

  var guidance = completionTable.TABLE_WORKSPACE_GUIDANCE;
  var heading = learnerIcons.renderMaterialHeading(material.title, material.type);
  var guidanceHtml = opts.omitGuidance
    ? ""
    : '<p class="util-learner-table-workspace__guidance">' +
      html.escapeHtml(guidance) +
      "</p>";

  return (
    '<div class="util-learner-table-workspace util-prose-measure" data-workspace-kind="table_entry" data-material-id="' +
    html.escapeAttribute(material.id) +
    '" data-activity-id="' +
    html.escapeAttribute(activityId) +
    '">' +
    '<article class="util-material-block util-learner-table-workspace__material" data-material-id="' +
    html.escapeAttribute(material.id) +
    '" data-material-type="' +
    html.escapeAttribute(material.type) +
    '" data-body-format="' +
    html.escapeAttribute(material.bodyFormat) +
    '" data-render-mode="table_workspace">' +
    heading +
    guidanceHtml +
    tableHtml +
    "</article></div>"
  );
}

module.exports = {
  renderTableWorkspace: renderTableWorkspace,
  extractTableFromMaterial: extractTableFromMaterial
};
