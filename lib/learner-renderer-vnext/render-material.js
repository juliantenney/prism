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
  reference_table: "util-material-block util-material-table-block",
  data_table: "util-material-block util-material-table-block",
  impact_table: "util-material-block util-material-table-block",
  template: "util-template-block util-material-template",
  task_card: "util-material-block util-material-task-cards",
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

function renderChecklistBody(material, options) {
  var opts = options && typeof options === "object" ? options : {};
  var checklist = material.checklist;
  var criteria = checklist && html.arrayOrEmpty(checklist.criteria);
  var parts = [];

  // Applicability: material.type checklist + parsed criteria → interactive self-check.
  // Pure markdown bodies without criteria stay static via renderMarkdownBody fallback.
  var interactive = opts.interactive !== false && criteria && criteria.length > 0;
  var materialId = String((material && material.id) || "checklist");
  var activityId = String(opts.activityId || material.activityId || "activity");
  var workspaceId =
    "checklist-" +
    activityId
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") +
    "-" +
    materialId
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  if (interactive) {
    var legend = String((material && material.title) || "Self-check").trim() || "Self-check";
    var itemsHtml = criteria
      .map(function (criterion, index) {
        var itemId = workspaceId + "-item-" + String(index);
        var inputId = itemId;
        return (
          '<div class="util-interactive-checklist__item">' +
          '<input type="checkbox" class="util-interactive-checklist__input" id="' +
          html.escapeAttribute(inputId) +
          '" data-checklist-item-id="' +
          html.escapeAttribute(itemId) +
          '">' +
          '<label class="util-interactive-checklist__label" for="' +
          html.escapeAttribute(inputId) +
          '">' +
          html.renderMarkdownInline(criterion) +
          "</label></div>"
        );
      })
      .join("");

    parts.push(
      '<fieldset class="util-interactive-checklist" data-workspace-kind="checklist_entry" data-workspace-capability="checklist_entry" data-workspace-id="' +
        html.escapeAttribute(workspaceId) +
        '">' +
        "<legend>" +
        html.escapeHtml(legend) +
        "</legend>" +
        itemsHtml +
        "</fieldset>"
    );
  } else if (criteria && criteria.length) {
    parts.push(
      '<ul class="util-checklist">' +
        criteria
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

function renderTaskCardBody(material) {
  var taskCards = Array.isArray(material && material.taskCards) ? material.taskCards : [];
  if (!taskCards.length) return renderMarkdownBody(material);
  var cardsHtml = taskCards
    .map(function (card, index) {
      var title = String((card && card.title) || "Card " + (index + 1)).trim();
      var body = String((card && card.body) || "").trim();
      if (!body) return "";
      return (
        '<li class="util-task-card-list__item"><article class="util-task-card">' +
        '<p class="util-task-card__title">' +
        html.escapeHtml(title) +
        "</p>" +
        html.renderMarkdownBlock(body) +
        "</article></li>"
      );
    })
    .filter(Boolean)
    .join("");
  if (!cardsHtml) return renderMarkdownBody(material);
  return (
    '<ol class="util-task-card-list" aria-label="Task cards">' + cardsHtml + "</ol>"
  );
}

function renderMaterialBody(material, options) {
  var type = String(material.type || "");

  if (type === "checklist") {
    return renderChecklistBody(material, options);
  }

  if (type === "modelling_note") {
    return renderModellingNoteBody(material);
  }

  if (type === "task_card") {
    return renderTaskCardBody(material);
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
 * Checklist applicability: type === "checklist" with parsed criteria becomes an
 * interactive self-check fieldset. Checklist-like markdown without criteria stays static.
 *
 * @param {import("./types").LearnerMaterial} material
 * @param {{ activityId?: string, interactiveChecklist?: boolean }} [options]
 * @returns {string}
 */
function renderMaterial(material, options) {
  var opts = options && typeof options === "object" ? options : {};
  var type = String((material && material.type) || "");
  var className = MATERIAL_CLASS_BY_TYPE[type];
  if (!className) return renderUnsupportedMaterial(material || {});
  if (type === "modelling_note") {
    return wrapMaterial(material, className, renderModellingNoteBody(material), {
      omitHeading: true
    });
  }
  var bodyOptions = {
    activityId: opts.activityId,
    interactive: opts.interactiveChecklist !== false
  };
  var bodyHtml = renderMaterialBody(material, bodyOptions);
  var omitHeading =
    type === "checklist" &&
    bodyOptions.interactive !== false &&
    material.checklist &&
    html.arrayOrEmpty(material.checklist.criteria).length > 0;
  return wrapMaterial(material, className, bodyHtml, { omitHeading: omitHeading });
}

module.exports = {
  MATERIAL_CLASS_BY_TYPE: MATERIAL_CLASS_BY_TYPE,
  renderMaterial: renderMaterial
};
