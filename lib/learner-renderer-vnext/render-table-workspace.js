"use strict";

var html = require("./render-html-utils");
var learnerIcons = require("./learner-icon-renderer");
var tableParse = require("./table-material-parse");
var buildTableWorkspaceModel =
  require("./build-table-workspace-model").buildTableWorkspaceModel;
var rowLabel = require("./table-workspace-row-label");

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
    '<div class="util-learner-table-workspace__cell--editable-inner">' +
    inputHtml +
    "</div></td>"
  );
}

function renderRowHeaderCell(rowId, visibleContent) {
  return (
    '<th scope="row" id="' +
    html.escapeAttribute(rowId) +
    '" class="util-learner-table-workspace__cell util-learner-table-workspace__cell--fixed">' +
    visibleContent +
    "</th>"
  );
}

function renderEditableInput(fieldId, accessibilityAttrs) {
  // Three-line textarea: short learner responses (calculations, notes,
  // judgements). Restored values are assigned via DOM (.value), not markup.
  return (
    '<textarea class="util-learner-table-workspace__input" id="' +
    html.escapeAttribute(fieldId) +
    '" name="' +
    html.escapeAttribute(fieldId) +
    '" data-learner-cell="' +
    html.escapeAttribute(fieldId) +
    '" rows="3" ' +
    accessibilityAttrs +
    ' autocomplete="off"></textarea>'
  );
}

/**
 * Render a completion-table workspace for a Do-moment material item.
 *
 * @param {import("./types").LearnerMaterial} material
 * @param {string} activityId
 * @returns {string}
 */
function renderWorkspaceTable(model) {
  var header = model.header;
  var colIds = model.colIds;
  var idPrefix = model.idPrefix;
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

  var bodyHtml = model.rows
    .map(function (rowModel) {
      var row = rowModel.cells;
      var labelInfo = rowModel.labelInfo;
      var rowId = rowModel.rowId;
      var rowIndex = rowModel.rowIndex;
      var hasRowHeader = labelInfo.needsStructuralRowHeader;
      var cells = [];

      row.forEach(function (cell, colIndex) {
        var cellContent = html.renderMarkdownInline(cell);
        var isFirstColumn = colIndex === 0;

        if (isFirstColumn && hasRowHeader) {
          var visibleContent = labelInfo.visibleRowLabel
            ? html.renderMarkdownInline(labelInfo.visibleRowLabel)
            : "";
          cells.push(renderRowHeaderCell(rowId, visibleContent));
          return;
        }

        if (!tableParse.isBlankCell(cell)) {
          cells.push(renderFixedCell(cellContent));
          return;
        }

        var fieldId = idPrefix + "-input-r" + rowIndex + "-c" + colIndex;
        var columnLabel = header[colIndex] || "column " + (colIndex + 1);
        var accessibilityAttrs = "";

        if (labelInfo.hasMeaningfulRowLabel) {
          accessibilityAttrs =
            'aria-labelledby="' +
            html.escapeAttribute(rowId + " " + colIds[colIndex]) +
            '"';
        } else {
          accessibilityAttrs =
            'aria-label="' +
            html.escapeAttribute(
              rowLabel.buildNeutralInputAccessibleName(
                labelInfo.accessibilityRowDescriptor || "row " + (rowIndex + 1),
                columnLabel
              )
            ) +
            '"';
        }

        cells.push(renderEditableCell(renderEditableInput(fieldId, accessibilityAttrs)));
      });

      return "<tr>" + cells.join("") + "</tr>";
    })
    .join("");

  return (
    '<div class="util-table-scroll util-learner-table-workspace__table">' +
    "<table>" +
    "<thead>" +
    headHtml +
    "</thead>" +
    (bodyHtml ? "<tbody>" + bodyHtml + "</tbody>" : "") +
    "</table></div>"
  );
}

function renderTableWorkspace(material, activityId, options) {
  if (!material) return "";

  var opts = options && typeof options === "object" ? options : {};
  var segments = tableParse.extractMarkdownBodySegments(material.body);
  var tables = segments.filter(function (segment) {
    return segment.kind === "table";
  });
  if (!tables.length) {
    return require("./render-material").renderMaterial(material);
  }

  var multipleTables = tables.length > 1;
  var tableIndex = 0;
  var bodyParts = [];
  segments.forEach(function (segment) {
    if (segment.kind === "prose") {
      if (!multipleTables) return;
      var proseHtml = html.renderMarkdownBlock(segment.text);
      if (proseHtml) bodyParts.push(proseHtml);
      return;
    }
    var model = buildTableWorkspaceModel(material, activityId, {
      table: { header: segment.header, rows: segment.rows },
      tableIndex: tableIndex,
      disambiguate: multipleTables
    });
    tableIndex += 1;
    if (model) bodyParts.push(renderWorkspaceTable(model));
  });

  var workspaceModel = buildTableWorkspaceModel(material, activityId, {
    table: { header: tables[0].header, rows: tables[0].rows }
  });
  var workspaceId = workspaceModel ? workspaceModel.baseId : "";

  var guidance = require("./completion-table-workspace").TABLE_WORKSPACE_GUIDANCE;
  var heading = learnerIcons.renderMaterialHeading(material.title, material.type);
  var guidanceHtml = opts.omitGuidance
    ? ""
    : '<p class="util-learner-table-workspace__guidance">' +
      html.escapeHtml(guidance) +
      "</p>";

  return (
    '<div class="util-learner-table-workspace util-learner-table-breakout" data-workspace-kind="table_entry" data-workspace-capability="table_entry" data-workspace-id="' +
    html.escapeAttribute(workspaceId) +
    '" data-material-source-id="' +
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
    bodyParts.join("") +
    "</article></div>"
  );
}

module.exports = {
  renderTableWorkspace: renderTableWorkspace,
  extractTableFromMaterial: tableParse.extractTableFromMaterial,
  buildTableWorkspaceModel: buildTableWorkspaceModel
};

