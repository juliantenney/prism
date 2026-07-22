"use strict";

var tableParse = require("./table-material-parse");
var rowLabel = require("./table-workspace-row-label");

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
 * Normalise parsed table rows for learner table workspace rendering.
 *
 * @param {import("./types").LearnerMaterial} material
 * @param {string} activityId
 * @returns {{
 *   idPrefix: string,
 *   header: string[],
 *   colIds: string[],
 *   rows: Array<{
 *     rowIndex: number,
 *     rowId: string,
 *     cells: string[],
 *     labelInfo: ReturnType<typeof rowLabel.classifyTableWorkspaceRowLabel>
 *   }>
 * }|null}
 */
function buildTableWorkspaceModel(material, activityId) {
  var tableData = tableParse.extractTableFromMaterial(material);
  if (!tableData || !tableData.header.length) return null;

  var idPrefix = buildIdPrefix(material, activityId);
  var header = tableData.header;
  var colIds = header.map(function (label, colIndex) {
    return idPrefix + "-col-" + slugify(label) + "-" + colIndex;
  });

  var rows = tableData.rows.map(function (row, rowIndex) {
    var labelInfo = rowLabel.classifyTableWorkspaceRowLabel(row[0], rowIndex);
    var cells = row.map(function (cell, colIndex) {
      if (colIndex === 0 && labelInfo.isSyntheticRowLabel) {
        return "";
      }
      return cell;
    });

    return {
      rowIndex: rowIndex,
      rowId: idPrefix + "-row-" + rowIndex,
      cells: cells,
      labelInfo: labelInfo
    };
  });

  return {
    idPrefix: idPrefix,
    header: header,
    colIds: colIds,
    rows: rows
  };
}

module.exports = {
  buildTableWorkspaceModel: buildTableWorkspaceModel
};
