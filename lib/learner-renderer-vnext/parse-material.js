"use strict";

var normalizeContent = require("./normalize-content");

var MATERIAL_RENDERER_TYPES = Object.freeze([
  "text",
  "worked_example",
  "sample_output",
  "checklist",
  "analysis_table",
  "scenario",
  "decision_table",
  "modelling_note",
  "prompt_set",
  "comparison_table",
  "classification_table",
  "planning_table",
  "template",
  "transfer_prompt",
  "consolidation_summary"
]);

function normalizeMaterialType(value) {
  return String(value == null ? "" : value)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

/**
 * Resolve material type from assembled-page aliases (matches page-render-normalize).
 *
 * @param {Object|null|undefined} source
 * @returns {string}
 */
function resolveMaterialType(source) {
  if (!source || typeof source !== "object") return "";
  var raw = source.material_type;
  if (raw == null || !String(raw).trim()) raw = source.type;
  if (raw == null || !String(raw).trim()) raw = source.materialType;
  if (raw == null || !String(raw).trim()) raw = source.kind;
  var normalized = normalizeMaterialType(raw);
  if (normalized === "scenarios" || normalized === "study_scenarios") {
    return "scenario";
  }
  return normalized;
}

function parseChecklistBody(body) {
  var source = String(body == null ? "" : body).replace(/\r\n?/g, "\n").trim();
  var lines = source.split("\n");
  var criteria = [];
  var trailing = [];
  var afterCriteria = false;

  lines.forEach(function (line) {
    var bullet = String(line || "").match(/^\s*[-*+]\s+(.+?)\s*$/);
    if (bullet && !afterCriteria) {
      criteria.push(bullet[1]);
      return;
    }
    if (!String(line || "").trim() && criteria.length && !afterCriteria) return;
    if (criteria.length) afterCriteria = true;
    if (afterCriteria && String(line || "").trim()) trailing.push(String(line).trim());
  });

  return {
    criteria: criteria,
    revisionInstruction: trailing.length ? trailing.join("\n") : null
  };
}

/**
 * @param {Object} source
 * @param {number} sourceOrder
 * @returns {import("./types").LearnerMaterial}
 */
function buildMaterialModel(source, sourceOrder) {
  var type = resolveMaterialType(source);
  var title = String((source && source.title) || "").trim();
  var body = normalizeContent.stripLeadingMatchingMarkdownHeading(
    String(source && source.body != null ? source.body : ""),
    title
  );
  return {
    id: String((source && source.material_id) || "").trim(),
    type: type,
    title: title,
    bodyFormat: String((source && source.body_format) || "markdown").trim(),
    body: body,
    sourceOrder: sourceOrder,
    checklist: type === "checklist" ? parseChecklistBody(body) : null
  };
}

function hasMaterialRenderer(type) {
  return MATERIAL_RENDERER_TYPES.indexOf(normalizeMaterialType(type)) !== -1;
}

module.exports = {
  MATERIAL_RENDERER_TYPES: MATERIAL_RENDERER_TYPES,
  normalizeMaterialType: normalizeMaterialType,
  resolveMaterialType: resolveMaterialType,
  parseChecklistBody: parseChecklistBody,
  buildMaterialModel: buildMaterialModel,
  hasMaterialRenderer: hasMaterialRenderer
};
