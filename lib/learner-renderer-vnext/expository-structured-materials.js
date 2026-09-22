"use strict";

/**
 * Expository structured XM body support.
 * Preserves semantic object bodies; never coerces them via String(object).
 * formal_notes remain authoring guidance and must not become learner prose.
 */

var html = require("./render-html-utils");

function isPlainObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function text(value) {
  return String(value == null ? "" : value).trim();
}

function normalizeKind(kind) {
  return String(kind == null ? "" : kind)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

/**
 * Compact worked-example body:
 * { title?, scenario, stages[{label,description}], synthesis? }
 */
function isCompactWorkedExampleBody(body) {
  if (!isPlainObject(body)) return false;
  if (!Array.isArray(body.stages) || !body.stages.length) return false;
  return body.stages.every(function (stage) {
    return isPlainObject(stage) && (text(stage.label) || text(stage.description));
  });
}

/**
 * Conceptual / synthesis diagram body:
 * { title?, elements[], relationships[], caption?, compact_rendering?, possible_contributors? }
 */
function isDiagramSpecBody(body) {
  if (!isPlainObject(body)) return false;
  return Array.isArray(body.elements) && Array.isArray(body.relationships);
}

/**
 * @param {Object} source assembled XM material row
 * @param {string} sectionId
 * @param {number} sourceOrder
 * @returns {Object|null}
 */
function buildExpositionStructuredMaterial(source, sectionId, sourceOrder) {
  if (!source || typeof source !== "object") return null;
  var kind = text(source.kind || source.type || source.material_type);
  var materialId =
    text(source.material_id) || sectionId + "-material-" + (sourceOrder + 1);
  var body = source.body;

  // Authoring guidance — never copy into learner-facing fields.
  var formalNotes = text(source.formal_notes);

  if (typeof body === "string") {
    return null; // caller uses ordinary prose/material path
  }

  if (isCompactWorkedExampleBody(body)) {
    return {
      id: materialId,
      kind: kind || "worked_example",
      type: "expository_compact_worked_example",
      sectionId: sectionId,
      commissionId: text(source.commission_id),
      sourceOrder: sourceOrder,
      title: text(body.title),
      scenario: text(body.scenario),
      stages: body.stages.map(function (stage, index) {
        return {
          label: text(stage.label) || "Stage " + (index + 1),
          description: text(stage.description)
        };
      }),
      synthesis: text(body.synthesis),
      // Keep formal notes off the learner model surface.
      _authorFormalNotes: formalNotes
    };
  }

  if (isDiagramSpecBody(body)) {
    // Diagram learner representation is owned by section-scoped visual affordances.
    // Preserve only a compact caption/title companion — do not dump elements/relationships.
    return {
      id: materialId,
      kind: kind || "conceptual_diagram",
      type: "expository_diagram_caption",
      sectionId: sectionId,
      commissionId: text(source.commission_id),
      sourceOrder: sourceOrder,
      title: text(body.title),
      caption: text(body.caption),
      suppressStructuralDump: true,
      _authorFormalNotes: formalNotes
    };
  }

  if (isPlainObject(body) || Array.isArray(body)) {
    return {
      id: materialId,
      kind: kind || "structured",
      type: "expository_structured_unsupported",
      sectionId: sectionId,
      commissionId: text(source.commission_id),
      sourceOrder: sourceOrder,
      title: text(source.title),
      _authorFormalNotes: formalNotes
    };
  }

  return null;
}

function renderMarkdownOrPlain(value) {
  var textValue = text(value);
  if (!textValue) return "";
  return html.renderMarkdownBlock(textValue) || html.renderPlainText(textValue);
}

function renderCompactWorkedExample(material) {
  var title = text(material && material.title);
  var scenario = text(material && material.scenario);
  var synthesis = text(material && material.synthesis);
  var stages = Array.isArray(material && material.stages) ? material.stages : [];
  var stagesHtml = stages
    .map(function (stage) {
      return (
        '<li class="util-exposition-worked-stage">' +
        '<p class="util-exposition-worked-stage__label"><strong>' +
        html.escapeHtml(stage.label) +
        "</strong></p>" +
        (stage.description
          ? '<div class="util-exposition-worked-stage__description util-prose-measure">' +
            renderMarkdownOrPlain(stage.description) +
            "</div>"
          : "") +
        "</li>"
      );
    })
    .join("");

  return (
    '<article class="util-material-block util-worked-example util-prose-measure util-exposition-material" data-material-id="' +
    html.escapeAttribute(material.id) +
    '" data-material-kind="' +
    html.escapeAttribute(material.kind || "") +
    '" data-material-type="expository_compact_worked_example" data-section-id="' +
    html.escapeAttribute(material.sectionId || "") +
    '" data-expository-structured="compact_worked_example">' +
    (title ? "<h3>" + html.escapeHtml(title) + "</h3>" : "") +
    (scenario
      ? '<div class="util-exposition-worked-scenario" data-field="scenario">' +
        renderMarkdownOrPlain(scenario) +
        "</div>"
      : "") +
    (stagesHtml
      ? '<ol class="util-exposition-worked-stages" data-field="stages">' +
        stagesHtml +
        "</ol>"
      : "") +
    (synthesis
      ? '<div class="util-exposition-worked-synthesis" data-field="synthesis">' +
        renderMarkdownOrPlain(synthesis) +
        "</div>"
      : "") +
    "</article>"
  );
}

/**
 * Diagram specs: caption/title companion only.
 * Full graphic + a11y live on the section visual affordance.
 */
function renderDiagramCaption(material) {
  var title = text(material && material.title);
  var caption = text(material && material.caption);
  if (!title && !caption) {
    // Structured diagram present but no learner caption — emit a silent marker
    // so attachment remains inspectable without dumping authoring structure.
    return (
      '<article class="util-material-block util-exposition-material util-exposition-diagram-caption" hidden aria-hidden="true" data-material-id="' +
      html.escapeAttribute(material.id) +
      '" data-material-kind="' +
      html.escapeAttribute(material.kind || "") +
      '" data-material-type="expository_diagram_caption" data-section-id="' +
      html.escapeAttribute(material.sectionId || "") +
      '" data-expository-structured="diagram_caption" data-diagram-represented-by="section-visual-affordance"></article>'
    );
  }
  return (
    '<article class="util-material-block util-prose-measure util-exposition-material util-exposition-diagram-caption" data-material-id="' +
    html.escapeAttribute(material.id) +
    '" data-material-kind="' +
    html.escapeAttribute(material.kind || "") +
    '" data-material-type="expository_diagram_caption" data-section-id="' +
    html.escapeAttribute(material.sectionId || "") +
    '" data-expository-structured="diagram_caption" data-diagram-represented-by="section-visual-affordance">' +
    (title ? "<h3>" + html.escapeHtml(title) + "</h3>" : "") +
    (caption
      ? '<p class="util-exposition-diagram-caption__text" data-field="caption">' +
        html.escapeHtml(caption) +
        "</p>"
      : "") +
    "</article>"
  );
}

function renderUnsupportedStructured(material) {
  return (
    '<article class="util-material-block util-material-unsupported util-exposition-material" data-material-id="' +
    html.escapeAttribute(material.id) +
    '" data-material-kind="' +
    html.escapeAttribute(material.kind || "") +
    '" data-material-type="expository_structured_unsupported" data-section-id="' +
    html.escapeAttribute(material.sectionId || "") +
    '" data-render-status="unsupported" data-expository-structured="unsupported">' +
    '<p class="util-support-note">Structured material body is not supported for learner rendering.</p>' +
    "</article>"
  );
}

/**
 * @param {Object} material
 * @returns {string|null} HTML, or null when caller should use ordinary renderMaterial
 */
function renderExpositionStructuredMaterial(material) {
  if (!material || typeof material !== "object") return null;
  var type = String(material.type || "");
  if (type === "expository_compact_worked_example") {
    return renderCompactWorkedExample(material);
  }
  if (type === "expository_diagram_caption") {
    return renderDiagramCaption(material);
  }
  if (type === "expository_structured_unsupported") {
    return renderUnsupportedStructured(material);
  }
  return null;
}

module.exports = {
  isPlainObject: isPlainObject,
  isCompactWorkedExampleBody: isCompactWorkedExampleBody,
  isDiagramSpecBody: isDiagramSpecBody,
  normalizeKind: normalizeKind,
  buildExpositionStructuredMaterial: buildExpositionStructuredMaterial,
  renderExpositionStructuredMaterial: renderExpositionStructuredMaterial
};
