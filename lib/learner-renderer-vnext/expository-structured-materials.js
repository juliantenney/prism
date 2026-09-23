"use strict";

/**
 * Expository structured XM body support.
 * Preserves semantic object bodies; never coerces them via String(object).
 * formal_notes remain authoring guidance and must not become learner prose.
 *
 * Supported specialised shapes:
 * - compact worked-example-like: stages[]
 * - diagram-like: elements[] + relationships[] → caption companion only
 * - sequence-like: steps[] / sequence[]
 * - elements-only (no relationships): accessible element list
 * - tabular: columns[] + rows[], or rows[] of parallel objects
 * - equation-like: equation / latex / expression / formula (+ optional annotations)
 *
 * All other valid structured bodies use a generic semantic fallback
 * (no JSON dump; no learner-facing "unsupported" slogan).
 */

var html = require("./render-html-utils");

var MAX_STRUCTURE_DEPTH = 6;

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
 * Deterministic label for object keys — not pedagogical interpretation.
 * snake_case / kebab-case / camelCase → spaced words; keep acronyms readable.
 */
function humanizeKey(key) {
  var raw = String(key == null ? "" : key).trim();
  if (!raw) return "";
  var spaced = raw
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!spaced) return raw;
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
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
 * Sequence / reconstruction / appraisal shapes (AD-010 high-frequency kinds):
 * steps[] or sequence[] of labelled items or strings.
 */
function isSequenceBody(body) {
  if (!isPlainObject(body)) return false;
  if (Array.isArray(body.stages) && body.stages.length) return false; // owned by worked-example
  var list = null;
  if (Array.isArray(body.steps) && body.steps.length) list = body.steps;
  else if (Array.isArray(body.sequence) && body.sequence.length) list = body.sequence;
  if (!list) return false;
  return list.every(function (item) {
    if (typeof item === "string" || typeof item === "number") return text(item) !== "";
    if (!isPlainObject(item)) return false;
    return !!(
      text(item.label) ||
      text(item.title) ||
      text(item.description) ||
      text(item.text) ||
      text(item.content) ||
      text(item.step)
    );
  });
}

/**
 * Elements present without a relationships[] array — diagram-like commissions
 * that failed the exact diagram-spec gate (common AD-010 near-miss).
 */
function isElementsOnlyBody(body) {
  if (!isPlainObject(body)) return false;
  if (Array.isArray(body.relationships)) return false;
  if (!Array.isArray(body.elements) || !body.elements.length) return false;
  return body.elements.every(function (el) {
    if (typeof el === "string" || typeof el === "number") return text(el) !== "";
    if (!isPlainObject(el)) return false;
    return !!(
      text(el.label) ||
      text(el.title) ||
      text(el.name) ||
      text(el.id) ||
      text(el.description) ||
      text(el.supporting_text) ||
      text(el.text)
    );
  });
}

/**
 * Explicit tabular shape: columns[] + rows[], or rows[] of plain objects
 * with a shared key set (comparison tables from C01/C02/C05).
 */
function isTabularBody(body) {
  if (!isPlainObject(body)) return false;
  if (Array.isArray(body.columns) && body.columns.length && Array.isArray(body.rows)) {
    return true;
  }
  if (!Array.isArray(body.rows) || body.rows.length < 1) return false;
  if (!body.rows.every(isPlainObject)) return false;
  var firstKeys = Object.keys(body.rows[0]).sort().join("\0");
  if (!firstKeys) return false;
  return body.rows.every(function (row) {
    return Object.keys(row).sort().join("\0") === firstKeys;
  });
}

/**
 * Equation / annotated-equation commissions (C01).
 */
function isEquationBody(body) {
  if (!isPlainObject(body)) return false;
  return !!(
    text(body.equation) ||
    text(body.latex) ||
    text(body.expression) ||
    text(body.formula)
  );
}

/**
 * Side-by-side / contrast pairs (C05 concept contrast, C02 comparisons).
 * { contrasts|comparisons|pairs: [{label?, left|a|option_a, right|b|option_b, ...}] }
 */
function isContrastPairsBody(body) {
  if (!isPlainObject(body)) return false;
  var list =
    (Array.isArray(body.contrasts) && body.contrasts) ||
    (Array.isArray(body.comparisons) && body.comparisons) ||
    (Array.isArray(body.pairs) && body.pairs) ||
    null;
  if (!list || !list.length) return false;
  return list.every(function (item) {
    if (!isPlainObject(item)) return false;
    var left = item.left != null ? item.left : item.a != null ? item.a : item.option_a;
    var right = item.right != null ? item.right : item.b != null ? item.b : item.option_b;
    return left != null || right != null;
  });
}

function normalizeSequenceItems(list) {
  return list.map(function (item, index) {
    if (typeof item === "string" || typeof item === "number") {
      return { label: "Step " + (index + 1), description: text(item) };
    }
    return {
      label:
        text(item.label) ||
        text(item.title) ||
        text(item.step) ||
        "Step " + (index + 1),
      description:
        text(item.description) ||
        text(item.text) ||
        text(item.content) ||
        ""
    };
  });
}

function normalizeElements(list) {
  return list.map(function (el, index) {
    if (typeof el === "string" || typeof el === "number") {
      return { label: text(el), description: "" };
    }
    return {
      label:
        text(el.label) ||
        text(el.title) ||
        text(el.name) ||
        text(el.id) ||
        "Element " + (index + 1),
      description:
        text(el.description) ||
        text(el.supporting_text) ||
        text(el.text) ||
        text(el.guiding_question) ||
        ""
    };
  });
}

function tabularColumnsAndRows(body) {
  var columns;
  var rows;
  if (Array.isArray(body.columns) && body.columns.length && Array.isArray(body.rows)) {
    columns = body.columns.map(function (col, index) {
      if (typeof col === "string" || typeof col === "number") return text(col) || "Column " + (index + 1);
      if (isPlainObject(col)) {
        return text(col.label) || text(col.title) || text(col.key) || text(col.id) || "Column " + (index + 1);
      }
      return "Column " + (index + 1);
    });
    var colKeys = body.columns.map(function (col, index) {
      if (isPlainObject(col) && text(col.key)) return text(col.key);
      if (typeof col === "string") return col;
      return String(index);
    });
    rows = body.rows.map(function (row) {
      if (Array.isArray(row)) {
        return columns.map(function (_c, i) {
          return row[i] != null ? row[i] : "";
        });
      }
      if (isPlainObject(row)) {
        return colKeys.map(function (key, i) {
          if (Object.prototype.hasOwnProperty.call(row, key)) return row[key];
          // fall back to column label / index
          var label = columns[i];
          if (Object.prototype.hasOwnProperty.call(row, label)) return row[label];
          return "";
        });
      }
      return columns.map(function () {
        return "";
      });
    });
    return { columns: columns, rows: rows };
  }
  // rows[] of parallel objects
  columns = Object.keys(body.rows[0]);
  rows = body.rows.map(function (row) {
    return columns.map(function (key) {
      return row[key];
    });
  });
  return {
    columns: columns.map(humanizeKey),
    rows: rows
  };
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

  if (isSequenceBody(body)) {
    var seqList = Array.isArray(body.steps) ? body.steps : body.sequence;
    return {
      id: materialId,
      kind: kind || "sequence",
      type: "expository_structured_sequence",
      sectionId: sectionId,
      commissionId: text(source.commission_id),
      sourceOrder: sourceOrder,
      title: text(body.title) || text(source.title),
      scenario: text(body.scenario) || text(body.context),
      steps: normalizeSequenceItems(seqList),
      synthesis: text(body.synthesis) || text(body.conclusion),
      _authorFormalNotes: formalNotes
    };
  }

  if (isElementsOnlyBody(body)) {
    return {
      id: materialId,
      kind: kind || "structured_elements",
      type: "expository_structured_elements",
      sectionId: sectionId,
      commissionId: text(source.commission_id),
      sourceOrder: sourceOrder,
      title: text(body.title) || text(source.title),
      caption: text(body.caption),
      elements: normalizeElements(body.elements),
      _authorFormalNotes: formalNotes
    };
  }

  if (isTabularBody(body)) {
    var table = tabularColumnsAndRows(body);
    return {
      id: materialId,
      kind: kind || "comparison_table",
      type: "expository_structured_table",
      sectionId: sectionId,
      commissionId: text(source.commission_id),
      sourceOrder: sourceOrder,
      title: text(body.title) || text(source.title),
      caption: text(body.caption),
      columns: table.columns,
      rows: table.rows,
      _authorFormalNotes: formalNotes
    };
  }

  if (isContrastPairsBody(body)) {
    var pairList =
      body.contrasts || body.comparisons || body.pairs || [];
    return {
      id: materialId,
      kind: kind || "concept_contrast",
      type: "expository_structured_contrast",
      sectionId: sectionId,
      commissionId: text(source.commission_id),
      sourceOrder: sourceOrder,
      title: text(body.title) || text(source.title),
      pairs: pairList.map(function (item, index) {
        var left = item.left != null ? item.left : item.a != null ? item.a : item.option_a;
        var right = item.right != null ? item.right : item.b != null ? item.b : item.option_b;
        return {
          label: text(item.label) || text(item.title) || "Contrast " + (index + 1),
          left: left,
          right: right,
          note: text(item.note) || text(item.comment) || text(item.explanation)
        };
      }),
      _authorFormalNotes: formalNotes
    };
  }

  if (isEquationBody(body)) {
    return {
      id: materialId,
      kind: kind || "equation",
      type: "expository_structured_equation",
      sectionId: sectionId,
      commissionId: text(source.commission_id),
      sourceOrder: sourceOrder,
      title: text(body.title) || text(source.title),
      equation:
        text(body.equation) ||
        text(body.latex) ||
        text(body.expression) ||
        text(body.formula),
      annotations: Array.isArray(body.annotations) ? body.annotations : [],
      caption: text(body.caption) || text(body.explanation),
      _authorFormalNotes: formalNotes
    };
  }

  if (isPlainObject(body) || Array.isArray(body)) {
    // Valid structured content — preserve body for generic semantic rendering.
    // Do not emit the AD-010 learner-facing unsupported slogan.
    return {
      id: materialId,
      kind: kind || "structured",
      type: "expository_structured_fallback",
      sectionId: sectionId,
      commissionId: text(source.commission_id),
      sourceOrder: sourceOrder,
      title: text(isPlainObject(body) ? body.title : "") || text(source.title),
      body: body,
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

function cellText(value) {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return text(value);
  }
  if (Array.isArray(value)) {
    return value
      .map(function (v) {
        return cellText(v);
      })
      .filter(Boolean)
      .join("; ");
  }
  if (isPlainObject(value)) {
    return Object.keys(value)
      .map(function (k) {
        var inner = cellText(value[k]);
        return inner ? humanizeKey(k) + ": " + inner : "";
      })
      .filter(Boolean)
      .join("; ");
  }
  return text(value);
}

function materialShellOpen(material, structuredToken, extraClass) {
  return (
    '<article class="util-material-block util-prose-measure util-exposition-material' +
    (extraClass ? " " + extraClass : "") +
    '" data-material-id="' +
    html.escapeAttribute(material.id) +
    '" data-material-kind="' +
    html.escapeAttribute(material.kind || "") +
    '" data-material-type="' +
    html.escapeAttribute(material.type || "") +
    '" data-section-id="' +
    html.escapeAttribute(material.sectionId || "") +
    '" data-expository-structured="' +
    html.escapeAttribute(structuredToken) +
    '">'
  );
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
    materialShellOpen(material, "compact_worked_example", "util-worked-example") +
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

function renderSequence(material) {
  var title = text(material && material.title);
  var scenario = text(material && material.scenario);
  var synthesis = text(material && material.synthesis);
  var steps = Array.isArray(material && material.steps) ? material.steps : [];
  var stepsHtml = steps
    .map(function (step) {
      return (
        "<li>" +
        '<p><strong>' +
        html.escapeHtml(step.label) +
        "</strong></p>" +
        (step.description
          ? '<div class="util-prose-measure">' + renderMarkdownOrPlain(step.description) + "</div>"
          : "") +
        "</li>"
      );
    })
    .join("");
  return (
    materialShellOpen(material, "sequence") +
    (title ? "<h3>" + html.escapeHtml(title) + "</h3>" : "") +
    (scenario ? '<div data-field="scenario">' + renderMarkdownOrPlain(scenario) + "</div>" : "") +
    (stepsHtml ? '<ol data-field="steps">' + stepsHtml + "</ol>" : "") +
    (synthesis
      ? '<div data-field="synthesis">' + renderMarkdownOrPlain(synthesis) + "</div>"
      : "") +
    "</article>"
  );
}

function renderElementsOnly(material) {
  var title = text(material && material.title);
  var caption = text(material && material.caption);
  var elements = Array.isArray(material && material.elements) ? material.elements : [];
  var listHtml = elements
    .map(function (el) {
      return (
        "<li>" +
        "<p><strong>" +
        html.escapeHtml(el.label) +
        "</strong></p>" +
        (el.description
          ? '<div class="util-prose-measure">' + renderMarkdownOrPlain(el.description) + "</div>"
          : "") +
        "</li>"
      );
    })
    .join("");
  return (
    materialShellOpen(material, "elements") +
    (title ? "<h3>" + html.escapeHtml(title) + "</h3>" : "") +
    (caption ? "<p data-field=\"caption\">" + html.escapeHtml(caption) + "</p>" : "") +
    (listHtml ? '<ul data-field="elements">' + listHtml + "</ul>" : "") +
    "</article>"
  );
}

function renderTable(material) {
  var title = text(material && material.title);
  var caption = text(material && material.caption);
  var columns = Array.isArray(material && material.columns) ? material.columns : [];
  var rows = Array.isArray(material && material.rows) ? material.rows : [];
  var head =
    "<thead><tr>" +
    columns
      .map(function (col) {
        return "<th scope=\"col\">" + html.escapeHtml(text(col)) + "</th>";
      })
      .join("") +
    "</tr></thead>";
  var body =
    "<tbody>" +
    rows
      .map(function (row) {
        var cells = Array.isArray(row) ? row : [];
        return (
          "<tr>" +
          columns
            .map(function (_col, i) {
              return "<td>" + html.escapeHtml(cellText(cells[i])) + "</td>";
            })
            .join("") +
          "</tr>"
        );
      })
      .join("") +
    "</tbody>";
  return (
    materialShellOpen(material, "table") +
    (title ? "<h3>" + html.escapeHtml(title) + "</h3>" : "") +
    '<table class="util-exposition-structured-table">' +
    (caption ? "<caption>" + html.escapeHtml(caption) + "</caption>" : "") +
    head +
    body +
    "</table>" +
    "</article>"
  );
}

function renderContrast(material) {
  var title = text(material && material.title);
  var pairs = Array.isArray(material && material.pairs) ? material.pairs : [];
  var pairsHtml = pairs
    .map(function (pair) {
      return (
        "<li>" +
        "<p><strong>" +
        html.escapeHtml(pair.label) +
        "</strong></p>" +
        "<dl>" +
        "<div><dt>First</dt><dd>" +
        renderStructuredValue(pair.left, 0) +
        "</dd></div>" +
        "<div><dt>Second</dt><dd>" +
        renderStructuredValue(pair.right, 0) +
        "</dd></div>" +
        "</dl>" +
        (pair.note
          ? '<div class="util-prose-measure">' + renderMarkdownOrPlain(pair.note) + "</div>"
          : "") +
        "</li>"
      );
    })
    .join("");
  return (
    materialShellOpen(material, "contrast") +
    (title ? "<h3>" + html.escapeHtml(title) + "</h3>" : "") +
    (pairsHtml ? '<ul data-field="contrasts">' + pairsHtml + "</ul>" : "") +
    "</article>"
  );
}

function renderEquation(material) {
  var title = text(material && material.title);
  var equation = text(material && material.equation);
  var caption = text(material && material.caption);
  var annotations = Array.isArray(material && material.annotations)
    ? material.annotations
    : [];
  var annHtml = annotations
    .map(function (ann) {
      if (typeof ann === "string" || typeof ann === "number") {
        return "<li>" + html.escapeHtml(text(ann)) + "</li>";
      }
      if (!isPlainObject(ann)) return "";
      var label = text(ann.label) || text(ann.symbol) || text(ann.term);
      var desc = text(ann.description) || text(ann.meaning) || text(ann.text);
      if (!label && !desc) return "";
      return (
        "<li>" +
        (label ? "<strong>" + html.escapeHtml(label) + "</strong>" : "") +
        (label && desc ? " — " : "") +
        (desc ? html.escapeHtml(desc) : "") +
        "</li>"
      );
    })
    .filter(Boolean)
    .join("");
  return (
    materialShellOpen(material, "equation") +
    (title ? "<h3>" + html.escapeHtml(title) + "</h3>" : "") +
    (equation
      ? '<p class="util-exposition-equation" data-field="equation"><code>' +
        html.escapeHtml(equation) +
        "</code></p>"
      : "") +
    (annHtml ? '<ul data-field="annotations">' + annHtml + "</ul>" : "") +
    (caption ? "<p data-field=\"caption\">" + html.escapeHtml(caption) + "</p>" : "") +
    "</article>"
  );
}

/**
 * Generic semantic rendering of arbitrary valid structured content.
 * Restrained HTML: p / ul / ol / dl / table / nested lists. No JSON dump.
 */
function renderStructuredValue(value, depth) {
  if (value == null) {
    return "";
  }
  if (depth > MAX_STRUCTURE_DEPTH) {
    return "<p>" + html.escapeHtml(cellText(value)) + "</p>";
  }
  if (typeof value === "string") {
    return renderMarkdownOrPlain(value);
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return "<p>" + html.escapeHtml(String(value)) + "</p>";
  }
  if (Array.isArray(value)) {
    if (!value.length) return "";
    var allPrimitive = value.every(function (item) {
      return (
        item == null ||
        typeof item === "string" ||
        typeof item === "number" ||
        typeof item === "boolean"
      );
    });
    if (allPrimitive) {
      return (
        "<ul>" +
        value
          .map(function (item) {
            if (item == null || text(item) === "") return "";
            return "<li>" + html.escapeHtml(text(item)) + "</li>";
          })
          .filter(Boolean)
          .join("") +
        "</ul>"
      );
    }
    // Parallel objects → table when keys align
    if (
      value.length >= 1 &&
      value.every(isPlainObject) &&
      (function () {
        var keys = Object.keys(value[0]).sort().join("\0");
        return (
          keys &&
          value.every(function (row) {
            return Object.keys(row).sort().join("\0") === keys;
          })
        );
      })()
    ) {
      var cols = Object.keys(value[0]);
      return (
        '<table class="util-exposition-structured-table"><thead><tr>' +
        cols
          .map(function (c) {
            return '<th scope="col">' + html.escapeHtml(humanizeKey(c)) + "</th>";
          })
          .join("") +
        "</tr></thead><tbody>" +
        value
          .map(function (row) {
            return (
              "<tr>" +
              cols
                .map(function (c) {
                  return "<td>" + html.escapeHtml(cellText(row[c])) + "</td>";
                })
                .join("") +
              "</tr>"
            );
          })
          .join("") +
        "</tbody></table>"
      );
    }
    return (
      "<ul>" +
      value
        .map(function (item) {
          var inner = renderStructuredValue(item, depth + 1);
          return inner ? "<li>" + inner + "</li>" : "";
        })
        .filter(Boolean)
        .join("") +
      "</ul>"
    );
  }
  if (isPlainObject(value)) {
    var keys = Object.keys(value).filter(function (k) {
      var v = value[k];
      if (v == null) return false;
      if (typeof v === "string") return text(v) !== "";
      if (typeof v === "number" || typeof v === "boolean") return true;
      if (isPlainObject(v) || Array.isArray(v)) return true;
      return text(v) !== "";
    });
    if (!keys.length) return "";
    // Prefer definition list for flat scalar maps
    var allScalar = keys.every(function (k) {
      var v = value[k];
      return (
        v == null ||
        typeof v === "string" ||
        typeof v === "number" ||
        typeof v === "boolean"
      );
    });
    if (allScalar) {
      return (
        "<dl>" +
        keys
          .map(function (k) {
            var v = value[k];
            if (v == null || (typeof v === "string" && !text(v))) return "";
            return (
              "<div><dt>" +
              html.escapeHtml(humanizeKey(k)) +
              "</dt><dd>" +
              html.escapeHtml(text(v)) +
              "</dd></div>"
            );
          })
          .filter(Boolean)
          .join("") +
        "</dl>"
      );
    }
    return keys
      .map(function (k) {
        var inner = renderStructuredValue(value[k], depth + 1);
        if (!inner) return "";
        // Nested object/array: heading + content (structurally justified)
        if (isPlainObject(value[k]) || Array.isArray(value[k])) {
          return (
            "<section>" +
            "<h4>" +
            html.escapeHtml(humanizeKey(k)) +
            "</h4>" +
            inner +
            "</section>"
          );
        }
        return (
          "<div><p><strong>" +
          html.escapeHtml(humanizeKey(k)) +
          "</strong></p>" +
          inner +
          "</div>"
        );
      })
      .filter(Boolean)
      .join("");
  }
  return "<p>" + html.escapeHtml(text(value)) + "</p>";
}

function renderStructuredFallback(material) {
  var title = text(material && material.title);
  var body = material && material.body;
  var content = renderStructuredValue(body, 0);
  // Empty but valid structured body: silent empty region (no AD-010 slogan).
  if (!title && !content) {
    return (
      materialShellOpen(material, "fallback", "util-exposition-structured-fallback") +
      "</article>"
    );
  }
  // When body is an object with its own title, avoid duplicating the title key inside.
  if (isPlainObject(body) && text(body.title) && title) {
    var bodyWithoutTitle = Object.assign({}, body);
    delete bodyWithoutTitle.title;
    content = renderStructuredValue(bodyWithoutTitle, 0) || content;
  }
  return (
    materialShellOpen(material, "fallback", "util-exposition-structured-fallback") +
    (title ? "<h3>" + html.escapeHtml(title) + "</h3>" : "") +
    content +
    "</article>"
  );
}

/**
 * Retained only for genuinely corrupt/non-structured diagnostic cases.
 * Valid structured bodies must not reach this path after S87-T-004.
 */
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
  if (type === "expository_structured_sequence") {
    return renderSequence(material);
  }
  if (type === "expository_structured_elements") {
    return renderElementsOnly(material);
  }
  if (type === "expository_structured_table") {
    return renderTable(material);
  }
  if (type === "expository_structured_contrast") {
    return renderContrast(material);
  }
  if (type === "expository_structured_equation") {
    return renderEquation(material);
  }
  if (type === "expository_structured_fallback") {
    return renderStructuredFallback(material);
  }
  if (type === "expository_structured_unsupported") {
    // Legacy model rows (tests / older assemblies): if a body was preserved, prefer fallback.
    if (material.body != null && (isPlainObject(material.body) || Array.isArray(material.body))) {
      return renderStructuredFallback(
        Object.assign({}, material, { type: "expository_structured_fallback" })
      );
    }
    return renderUnsupportedStructured(material);
  }
  return null;
}

module.exports = {
  isPlainObject: isPlainObject,
  isCompactWorkedExampleBody: isCompactWorkedExampleBody,
  isDiagramSpecBody: isDiagramSpecBody,
  isSequenceBody: isSequenceBody,
  isElementsOnlyBody: isElementsOnlyBody,
  isTabularBody: isTabularBody,
  isContrastPairsBody: isContrastPairsBody,
  isEquationBody: isEquationBody,
  normalizeKind: normalizeKind,
  humanizeKey: humanizeKey,
  buildExpositionStructuredMaterial: buildExpositionStructuredMaterial,
  renderExpositionStructuredMaterial: renderExpositionStructuredMaterial,
  renderStructuredValue: renderStructuredValue
};
