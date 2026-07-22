"use strict";

var html = require("./render-html-utils");
var learnerIcons = require("./learner-icon-renderer");
var tableTypes = require("./table-material-types");

var MATERIAL_CLASS_BY_TYPE = Object.freeze({
  text: "util-material-block",
  worked_example: "util-worked-example",
  sample_output: "util-material-block util-sample-output",
  checklist: "util-checklist-block util-material-role-checklist",
  analysis_table: "util-material-block util-material-table-block",
  scenario: "util-scenario-card util-material-role-scenario",
  decision_table: "util-material-block util-material-table-block",
  modelling_note: "util-support-note",
  prompt_set: "util-prompt-set",
  comparison_table: "util-material-block util-material-table-block",
  classification_table: "util-material-block util-material-table-block",
  planning_table: "util-material-block util-material-table-block",
  template: "util-template-block util-material-template",
  transfer_prompt: "util-prompt-set util-transfer-prompt",
  consolidation_summary: "util-material-block util-consolidation-summary"
});

var TABLE_MATERIAL_TYPES = tableTypes.TABLE_MATERIAL_TYPES;

function wrapMaterial(material, className, bodyHtml, options) {
  var opts = options && typeof options === "object" ? options : {};
  var proseClass = TABLE_MATERIAL_TYPES[material.type] ? "" : " util-prose-measure";
  return (
    '<article class="' +
    html.escapeAttribute(className + proseClass) +
    '" data-material-id="' +
    html.escapeAttribute(material.id) +
    '" data-material-type="' +
    html.escapeAttribute(material.type) +
    '" data-body-format="' +
    html.escapeAttribute(material.bodyFormat) +
    '">' +
    (opts.omitHeading ? "" : learnerIcons.renderMaterialHeading(material.title, material.type)) +
    bodyHtml +
    "</article>"
  );
}

function renderMarkdownBody(material, options) {
  var body = html.renderMarkdownBlock(material.body, options);
  if (body) return body;
  return html.renderPlainText(material.body);
}

function renderChecklistBody(material) {
  var checklist = material.checklist;
  var parts = [];

  if (checklist && html.arrayOrEmpty(checklist.criteria).length) {
    parts.push(
      '<ul class="util-checklist">' +
        checklist.criteria
          .map(function (criterion) {
            return "<li>" + html.renderMarkdownInline(criterion) + "</li>";
          })
          .join("") +
        "</ul>"
    );
  }

  if (checklist && String(checklist.revisionInstruction || "").trim()) {
    parts.push(
      '<p class="util-checklist-instruction">' +
        html.renderMarkdownInline(checklist.revisionInstruction) +
        "</p>"
    );
  }

  if (!parts.length) {
    return renderMarkdownBody(material);
  }

  return parts.join("");
}

function renderModellingNoteBody(material) {
  var title = String(material.title || "").trim();
  var body = renderMarkdownBody(material);
  if (!title) return body;
  return (
    '<p class="util-support-note-label">' +
    html.escapeHtml(title) +
    "</p>" +
    body
  );
}

function renderMaterialBody(material) {
  var type = String(material.type || "");

  if (type === "checklist") {
    return renderChecklistBody(material);
  }

  if (type === "modelling_note") {
    return renderModellingNoteBody(material);
  }

  if (TABLE_MATERIAL_TYPES[type]) {
    return renderMarkdownBody(material, { wrapTables: true });
  }

  return renderMarkdownBody(material);
}

function renderUnsupportedMaterial(material) {
  return (
    '<article class="util-material-block util-material-unsupported" data-material-id="' +
    html.escapeAttribute(material.id) +
    '" data-material-type="' +
    html.escapeAttribute(material.type) +
    '" data-render-status="unsupported">' +
    '<p class="util-support-note">Unsupported material kind: ' +
    html.escapeHtml(material.type || "unknown") +
    "</p></article>"
  );
}

/**
 * Render one canonical LearnerMaterial without resolving ownership or order.
 *
 * @param {import("./types").LearnerMaterial} material
 * @returns {string}
 */
function renderMaterial(material) {
  var type = String((material && material.type) || "");
  var className = MATERIAL_CLASS_BY_TYPE[type];
  if (!className) return renderUnsupportedMaterial(material || {});
  if (type === "modelling_note") {
    return wrapMaterial(material, className, renderModellingNoteBody(material), {
      omitHeading: true
    });
  }
  return wrapMaterial(material, className, renderMaterialBody(material));
}

module.exports = {
  MATERIAL_CLASS_BY_TYPE: MATERIAL_CLASS_BY_TYPE,
  renderMaterial: renderMaterial
};
