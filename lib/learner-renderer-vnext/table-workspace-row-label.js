"use strict";

/**
 * Conservative classification for synthetic table row placeholder labels.
 * Only exact trimmed-value matches are treated as synthetic.
 */
var SYNTHETIC_ROW_LABEL_RE = /^(Response row|Blank row|Editable row) (\d+)$/i;

/**
 * @param {string|null|undefined} value
 * @returns {boolean}
 */
function isSyntheticRowLabel(value) {
  return SYNTHETIC_ROW_LABEL_RE.test(String(value == null ? "" : value).trim());
}

/**
 * @param {string|null|undefined} rawFirstCell
 * @param {number} rowIndex
 * @returns {{
 *   rawRowLabel: string,
 *   internalRowId: string,
 *   visibleRowLabel: string|null,
 *   isSyntheticRowLabel: boolean,
 *   hasMeaningfulRowLabel: boolean,
 *   needsStructuralRowHeader: boolean,
 *   accessibilityRowDescriptor: string|null
 * }}
 */
function classifyTableWorkspaceRowLabel(rawFirstCell, rowIndex) {
  var trimmed = String(rawFirstCell == null ? "" : rawFirstCell).trim();
  var isSynthetic = isSyntheticRowLabel(trimmed);
  var isBlank = !trimmed;
  var hasMeaningful = !isBlank && !isSynthetic;

  return {
    rawRowLabel: trimmed,
    internalRowId: "row-" + rowIndex,
    visibleRowLabel: hasMeaningful ? trimmed : null,
    isSyntheticRowLabel: isSynthetic,
    hasMeaningfulRowLabel: hasMeaningful,
    needsStructuralRowHeader: hasMeaningful || isSynthetic,
    accessibilityRowDescriptor: hasMeaningful ? null : "row " + (rowIndex + 1)
  };
}

/**
 * Neutral accessible name when no meaningful row label exists.
 *
 * @param {string} rowDescriptor
 * @param {string} columnLabel
 * @returns {string}
 */
function buildNeutralInputAccessibleName(rowDescriptor, columnLabel) {
  return "Response field, " + rowDescriptor + ", column " + columnLabel;
}

module.exports = {
  SYNTHETIC_ROW_LABEL_RE: SYNTHETIC_ROW_LABEL_RE,
  isSyntheticRowLabel: isSyntheticRowLabel,
  classifyTableWorkspaceRowLabel: classifyTableWorkspaceRowLabel,
  buildNeutralInputAccessibleName: buildNeutralInputAccessibleName
};
