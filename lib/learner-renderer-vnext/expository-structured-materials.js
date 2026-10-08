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
 *   (fuzzy column↔row key match; empty-matrix recovery from row keys;
 *   authored headings; never a generated "Column N" label)
 * - comparison schema: a column-definition array plus a matching row array
 *   → one table using those headings
 * - graph-like: nodes[]/vertices[] + edges[]/links[]/arcs[]
 * - node/relationship diagram spec: machine fields suppressed only when the
 *   section already has a finished figure; otherwise a learner-facing fallback
 * - diagram metadata keys (connections, display_guidance, branch_id, node_id,
 *   connection_id) are not learner headings; prose stored in an identifier
 *   field is kept, and a table is omitted only when nothing learner-facing remains
 * - equation-like: equation / latex / expression / formula (+ optional annotations)
 *
 * All other valid structured bodies use a generic semantic fallback
 * (no JSON dump; no learner-facing "unsupported" slogan;
 * schema/internal-id chrome suppressed; intellectual content preserved).
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

/** Collapse keys/labels for fuzzy column↔row matching (blank-table repair). */
function keyMatchToken(value) {
  return String(value == null ? "" : value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

/** PRISM/XM material ids and similar internal tokens. */
function isInternalMaterialId(value) {
  var raw = text(value);
  if (!raw) return false;
  return /^XM-MAT-/i.test(raw) || /^XM\d+$/i.test(raw) || /^COMM-/i.test(raw);
}

/**
 * Machine-only identifiers (snake_case tokens without spaces).
 * Do not treat ordinary multi-word learner labels as machine ids.
 */
function isMachineToken(value) {
  var raw = text(value);
  if (!raw) return false;
  if (isInternalMaterialId(raw)) return true;
  if (/\s/.test(raw)) return false;
  return /^[a-z][a-z0-9]*(?:_[a-z0-9]+)+$/.test(raw);
}

/**
 * Object keys that are container/schema machinery rather than intellectual categories.
 * Prefer specialised rendering or omit as section chrome.
 */
function isSchemaMechanicKey(key) {
  var token = keyMatchToken(key);
  return (
    token === "nodes" ||
    token === "edges" ||
    token === "vertices" ||
    token === "links" ||
    token === "arcs" ||
    token === "columns" ||
    token === "rows" ||
    token === "id" ||
    token === "ids" ||
    token === "materialid" ||
    token === "commissionid" ||
    token === "continuationof" ||
    token === "continuedfrom" ||
    token === "continues" ||
    token === "schema" ||
    token === "metadata" ||
    token === "meta" ||
    token === "data" ||
    token === "payload" ||
    token === "diagramlogic" ||
    token === "from" ||
    token === "to" ||
    token === "source" ||
    token === "target"
  );
}

function learnerFacingLabel(entity, fallback) {
  if (entity == null) return text(fallback);
  if (typeof entity === "string" || typeof entity === "number") {
    var scalar = text(entity);
    if (isMachineToken(scalar) || isInternalMaterialId(scalar)) return text(fallback);
    return scalar || text(fallback);
  }
  if (!isPlainObject(entity)) return text(fallback);
  var label =
    text(entity.label) ||
    text(entity.title) ||
    text(entity.name) ||
    text(entity.heading) ||
    text(entity.description) ||
    text(entity.caption) ||
    text(entity.meaning) ||
    text(entity.text);
  if (label) return label;
  var id = text(entity.id);
  if (id && !isMachineToken(id) && !isInternalMaterialId(id)) return id;
  return text(fallback);
}

function learnerFacingTitle(candidate, materialId) {
  var t = text(candidate);
  if (!t) return "";
  if (isInternalMaterialId(t)) return "";
  if (materialId && t === materialId) return "";
  if (isMachineToken(t)) return "";
  return t;
}

function lookupRowValueByToken(row, token) {
  if (!token || !isPlainObject(row)) return undefined;
  if (Object.prototype.hasOwnProperty.call(row, token)) return row[token];
  var keys = Object.keys(row);
  var i;
  for (i = 0; i < keys.length; i++) {
    if (keyMatchToken(keys[i]) === token) return row[keys[i]];
  }
  return undefined;
}

/**
 * Resolve one cell for a column definition against a row object/array.
 * Survives label↔key mismatch that previously yielded blank tables.
 */
function resolveRowCell(row, col, index, columnLabel) {
  if (Array.isArray(row)) {
    return row[index] != null ? row[index] : "";
  }
  if (!isPlainObject(row)) return "";
  if (isPlainObject(col)) {
    if (text(col.key) && Object.prototype.hasOwnProperty.call(row, text(col.key))) {
      return row[text(col.key)];
    }
    var keyTok = keyMatchToken(
      col.key || col.id || col.heading || col.header || col.name || col.label || col.title || columnLabel
    );
    var byKey = lookupRowValueByToken(row, keyTok);
    if (byKey !== undefined) return byKey;
  }
  if (typeof col === "string" || typeof col === "number") {
    var asKey = text(col);
    if (asKey && Object.prototype.hasOwnProperty.call(row, asKey)) return row[asKey];
    var byLabel = lookupRowValueByToken(row, keyMatchToken(asKey));
    if (byLabel !== undefined) return byLabel;
  }
  if (columnLabel) {
    if (Object.prototype.hasOwnProperty.call(row, columnLabel)) return row[columnLabel];
    var byColLabel = lookupRowValueByToken(row, keyMatchToken(columnLabel));
    if (byColLabel !== undefined) return byColLabel;
  }
  return "";
}

function countNonEmptyCells(matrix) {
  var n = 0;
  var r;
  var c;
  for (r = 0; r < matrix.length; r++) {
    var row = matrix[r] || [];
    for (c = 0; c < row.length; c++) {
      if (cellText(row[c])) n += 1;
    }
  }
  return n;
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
      label: learnerFacingLabel(el, "Element " + (index + 1)),
      description:
        text(el.description) ||
        text(el.supporting_text) ||
        text(el.text) ||
        text(el.guiding_question) ||
        ""
    };
  });
}

/** Renderer-invented placeholders such as "Column 2" or "column_3". */
function isGenericColumnLabel(value) {
  var raw = text(value).replace(/[_-]+/g, " ");
  return /^column\s*\d+$/i.test(raw);
}

/**
 * A key may become a heading only when it names the column.
 * Placeholders and bare node ids are not headings.
 */
function isMeaningfulColumnKey(value) {
  var raw = text(value);
  if (!raw) return false;
  if (isGenericColumnLabel(raw)) return false;
  if (isInternalMaterialId(raw)) return false;
  if (/^n\d+$/i.test(raw)) return false;
  if (/^[a-z]\d+$/i.test(raw)) return false;
  if (isSchemaMechanicKey(raw) && keyMatchToken(raw) !== "label") return false;
  return true;
}

/**
 * Authored heading, header, name, label, or title.
 * A meaningful key is the only fallback. Never invent "Column N".
 */
function resolveColumnHeading(col) {
  if (typeof col === "string" || typeof col === "number") {
    var scalar = text(col);
    if (!scalar || isGenericColumnLabel(scalar)) return "";
    return scalar;
  }
  if (!isPlainObject(col)) return "";
  var authored =
    text(col.heading) ||
    text(col.header) ||
    text(col.name) ||
    text(col.label) ||
    text(col.title);
  if (authored && !isGenericColumnLabel(authored)) return authored;
  var key = text(col.key);
  if (isMeaningfulColumnKey(key)) return humanizeKey(key);
  var id = text(col.id);
  if (isMeaningfulColumnKey(id)) return humanizeKey(id);
  return "";
}

function columnHeadingFailure(columns) {
  return (
    !columns.length ||
    columns.some(function (heading) {
      return !text(heading) || isGenericColumnLabel(heading);
    })
  );
}

function authoredColumnHeading(item) {
  if (!isPlainObject(item)) return "";
  return (
    text(item.heading) ||
    text(item.header) ||
    text(item.name) ||
    text(item.label) ||
    text(item.title)
  );
}

/** { key, heading } style column schema — not a data row. */
function isColumnDefinitionItem(item) {
  if (!isPlainObject(item)) return false;
  var names = Object.keys(item);
  if (names.length < 2 || names.length > 3) return false;
  var key = text(item.key) || text(item.id);
  if (!key || !authoredColumnHeading(item)) return false;
  return names.every(function (name) {
    var token = keyMatchToken(name);
    return (
      token === "key" ||
      token === "id" ||
      token === "heading" ||
      token === "header" ||
      token === "name" ||
      token === "label" ||
      token === "title"
    );
  });
}

function isColumnDefinitionList(list) {
  return Array.isArray(list) && list.length >= 2 && list.every(isColumnDefinitionItem);
}

function rowsMatchColumnDefinitions(rows, definitions) {
  if (!Array.isArray(rows) || !rows.length || !rows.every(isPlainObject)) return false;
  var allowed = Object.create(null);
  definitions.forEach(function (definition) {
    allowed[definition.key] = true;
    allowed[keyMatchToken(definition.key)] = true;
  });
  return rows.every(function (row) {
    var keys = Object.keys(row);
    if (!keys.length) return false;
    var matched = 0;
    var i;
    for (i = 0; i < keys.length; i++) {
      if (allowed[keys[i]] || allowed[keyMatchToken(keys[i])]) matched += 1;
    }
    return matched > 0 && matched === keys.length;
  });
}

/**
 * Column-definition array plus a matching row array, under any property names.
 * Returns one table. Does not publish the definition list beside the rows.
 */
function extractAuthoredComparisonTable(body) {
  if (!isPlainObject(body)) return null;
  if (Array.isArray(body.columns) && body.columns.length && Array.isArray(body.rows)) {
    return null;
  }
  var keys = Object.keys(body);
  var definitions = [];
  var rowCandidates = [];
  keys.forEach(function (key) {
    var value = body[key];
    if (!Array.isArray(value) || !value.length || !value.every(isPlainObject)) return;
    if (isColumnDefinitionList(value)) definitions.push({ key: key, value: value });
    else rowCandidates.push({ key: key, value: value });
  });
  if (definitions.length !== 1 || !rowCandidates.length) return null;
  var definition = definitions[0];
  var parsed = definition.value.map(function (item) {
    return {
      key: text(item.key) || text(item.id),
      heading: authoredColumnHeading(item),
      source: item
    };
  });
  var matched = null;
  var i;
  for (i = 0; i < rowCandidates.length; i++) {
    if (!rowsMatchColumnDefinitions(rowCandidates[i].value, parsed)) continue;
    if (matched) return null;
    matched = rowCandidates[i];
  }
  if (!matched) return null;
  var columns = parsed.map(function (col) {
    return resolveColumnHeading(col.source);
  });
  var rows = matched.value.map(function (row) {
    return parsed.map(function (col, index) {
      return resolveRowCell(row, col.source, index, columns[index]);
    });
  });
  var companion = {};
  keys.forEach(function (key) {
    if (key === definition.key || key === matched.key) return;
    companion[key] = body[key];
  });
  return {
    columns: columns,
    rows: rows,
    companion: companion,
    publicationFailure: columnHeadingFailure(columns)
      ? "column_heading_unrecoverable"
      : ""
  };
}

function tabularColumnsAndRows(body) {
  var columns;
  var rows;
  if (Array.isArray(body.columns) && body.columns.length && Array.isArray(body.rows)) {
    columns = body.columns.map(function (col) {
      return resolveColumnHeading(col);
    });
    rows = body.rows.map(function (row) {
      return body.columns.map(function (col, i) {
        return resolveRowCell(row, col, i, columns[i]);
      });
    });
    // If headers survived but values mostly vanished (key mismatch), recover from row objects.
    var cellCount = columns.length * Math.max(rows.length, 1);
    if (
      cellCount > 0 &&
      countNonEmptyCells(rows) === 0 &&
      body.rows.length &&
      body.rows.every(isPlainObject)
    ) {
      var sampleKeys = Object.keys(body.rows[0]);
      // Prefer keeping authored column labels when key count aligns positionally.
      if (sampleKeys.length === columns.length) {
        var positionalRows = body.rows.map(function (row) {
          var keys = Object.keys(row);
          return columns.map(function (_c, i) {
            return row[keys[i]];
          });
        });
        if (countNonEmptyCells(positionalRows) > 0 && !columnHeadingFailure(columns)) {
          return { columns: columns, rows: positionalRows, publicationFailure: "" };
        }
      }
      var recoveredKeys = sampleKeys.filter(function (k) {
        return isMeaningfulColumnKey(k);
      });
      if (!recoveredKeys.length) {
        return {
          columns: columns,
          rows: rows,
          publicationFailure: "column_heading_unrecoverable"
        };
      }
      rows = body.rows.map(function (row) {
        return recoveredKeys.map(function (key) {
          return row[key];
        });
      });
      columns = recoveredKeys.map(function (key) {
        return humanizeKey(key);
      });
      return {
        columns: columns,
        rows: rows,
        publicationFailure: columnHeadingFailure(columns) ? "column_heading_unrecoverable" : ""
      };
    }
    return {
      columns: columns,
      rows: rows,
      publicationFailure: columnHeadingFailure(columns) ? "column_heading_unrecoverable" : ""
    };
  }
  // rows[] of parallel objects
  columns = Object.keys(body.rows[0]).filter(function (k) {
    // Prefer learner-facing columns; drop bare id when a label exists.
    if (keyMatchToken(k) === "id" && Object.prototype.hasOwnProperty.call(body.rows[0], "label")) {
      return false;
    }
    // Machine identifiers only. A prose value under this key stays a column.
    if (
      isDiagramIdentifierKey(k) &&
      body.rows.every(function (row) {
        return isMachineIdentifierCell(row[k]);
      })
    ) {
      return false;
    }
    return isMeaningfulColumnKey(k);
  });
  if (!columns.length) {
    return {
      columns: [],
      rows: [],
      publicationFailure: "column_heading_unrecoverable"
    };
  }
  rows = body.rows.map(function (row) {
    return columns.map(function (key) {
      return row[key];
    });
  });
  return {
    columns: columns.map(humanizeKey),
    rows: rows,
    publicationFailure: ""
  };
}

/**
 * Graph-like bodies (nodes + edges/links) — common C04 causal-network XM shape.
 * Prefer learner labels over machine ids; preserve relationships as readable edges.
 */
function isGraphLikeBody(body) {
  if (!isPlainObject(body)) return false;
  if (Array.isArray(body.elements) && Array.isArray(body.relationships)) return false;
  var nodes = Array.isArray(body.nodes)
    ? body.nodes
    : Array.isArray(body.vertices)
      ? body.vertices
      : null;
  var edges = Array.isArray(body.edges)
    ? body.edges
    : Array.isArray(body.links)
      ? body.links
      : Array.isArray(body.arcs)
        ? body.arcs
        : null;
  return !!(nodes && nodes.length && edges && edges.length);
}

function diagramNodeList(body) {
  if (Array.isArray(body.nodes) && body.nodes.length) return body.nodes;
  if (Array.isArray(body.vertices) && body.vertices.length) return body.vertices;
  return null;
}

/**
 * Diagram specification carried as nodes plus relationships.
 * Distinct from elements+relationships captions and from nodes+edges graphs.
 * Presence of this shape does not mean a figure has been rendered.
 */
function isNodeRelationshipDiagramBody(body) {
  if (!isPlainObject(body)) return false;
  if (isDiagramSpecBody(body)) return false;
  if (isGraphLikeBody(body)) return false;
  var nodes = diagramNodeList(body);
  var relationships = Array.isArray(body.relationships) ? body.relationships : null;
  return !!(nodes && relationships && relationships.length);
}

function isNodeIdToken(value) {
  var raw = text(value);
  if (!raw) return false;
  if (isMachineToken(raw) || isInternalMaterialId(raw)) return true;
  if (/^n\d+$/i.test(raw)) return true;
  if (/^node[_-]?\d+$/i.test(raw)) return true;
  return false;
}

function isDiagramMachineKey(key) {
  var token = keyMatchToken(key);
  return (
    token === "nodes" ||
    token === "vertices" ||
    token === "relationships" ||
    token === "edges" ||
    token === "links" ||
    token === "arcs" ||
    token === "elements" ||
    token === "layout" ||
    token === "diagramlayout" ||
    token === "representationtype" ||
    token === "diagramlogic" ||
    token === "id" ||
    token === "ids" ||
    token === "schema" ||
    token === "metadata" ||
    token === "meta"
  );
}

/** Named diagram-spec fields. Not a general identifier filter. */
function isDisplayGuidanceKey(key) {
  return keyMatchToken(key) === "displayguidance";
}

function isConnectionsKey(key) {
  return keyMatchToken(key) === "connections";
}

function isDiagramIdentifierKey(key) {
  var token = keyMatchToken(key);
  return (
    token === "branchid" ||
    token === "nodeid" ||
    token === "connectionid" ||
    token === "anchor"
  );
}

/**
 * Machine tokens such as RCT-1 or N1. Learner prose in an identifier field
 * (for example "Intervention effect") is not a machine token.
 */
function isMachineIdentifierCell(value) {
  if (value != null && typeof value === "object") return true;
  var raw = text(value);
  if (!raw) return true;
  if (isNodeIdToken(raw) || isMachineToken(raw) || isInternalMaterialId(raw)) return true;
  if (/\s/.test(raw)) return false;
  if (/^[A-Za-z]{1,8}-?\d+$/.test(raw)) return true;
  if (/^[A-Za-z][A-Za-z0-9]*[_-][A-Za-z0-9]+$/.test(raw)) return true;
  return false;
}

/** Learner label only. Do not invent "Concept N" or surface a node id. */
function diagramNodeLabel(node) {
  if (typeof node === "string" || typeof node === "number") {
    var scalar = text(node);
    if (!scalar || isNodeIdToken(scalar)) return "";
    return scalar;
  }
  if (!isPlainObject(node)) return "";
  var label = text(node.label) || text(node.title) || text(node.name);
  if (label && !isNodeIdToken(label)) return label;
  var id = text(node.id);
  if (id && !isNodeIdToken(id) && !isMachineToken(id) && !isInternalMaterialId(id)) return id;
  return "";
}

function buildDiagramLabelMap(nodes) {
  var map = Object.create(null);
  nodes.forEach(function (node) {
    var label = diagramNodeLabel(node);
    if (!label) return;
    if (isPlainObject(node)) {
      var id = text(node.id);
      if (id) map[id] = label;
    } else {
      map[text(node)] = label;
    }
    map[label] = label;
  });
  return map;
}

function resolveDiagramEndpoint(value, labelMap) {
  var resolved = resolveEdgeEndpoint(value, labelMap);
  if (!resolved || isNodeIdToken(resolved)) return "";
  return resolved;
}

function diagramProseBody(body, title) {
  var prose = {};
  Object.keys(body).forEach(function (key) {
    if (isDiagramMachineKey(key)) return;
    var value = body[key];
    if (value == null) return;
    if (typeof value === "string" && !text(value)) return;
    if (keyMatchToken(key) === "title") {
      if (title && text(value) === title) return;
      if (typeof value === "string" && (isInternalMaterialId(value) || isMachineToken(value))) return;
    }
    prose[key] = value;
  });
  return prose;
}

function buildNodeLabelMap(nodes) {
  var map = Object.create(null);
  nodes.forEach(function (node, index) {
    if (typeof node === "string" || typeof node === "number") {
      map[text(node)] = text(node);
      return;
    }
    if (!isPlainObject(node)) return;
    var label = learnerFacingLabel(node, "Concept " + (index + 1));
    var id = text(node.id);
    if (id) map[id] = label;
    map[label] = label;
  });
  return map;
}

function resolveEdgeEndpoint(value, labelMap) {
  if (value == null) return "";
  if (isPlainObject(value)) return learnerFacingLabel(value, "");
  var raw = text(value);
  if (!raw) return "";
  if (labelMap && labelMap[raw]) return labelMap[raw];
  if (isMachineToken(raw) || isInternalMaterialId(raw)) return "";
  return raw;
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
      title: learnerFacingTitle(body.title || source.title, materialId),
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
      title: learnerFacingTitle(body.title || source.title, materialId),
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
      title: learnerFacingTitle(body.title || source.title, materialId),
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
      title: learnerFacingTitle(body.title || source.title, materialId),
      caption: text(body.caption),
      elements: normalizeElements(body.elements),
      _authorFormalNotes: formalNotes
    };
  }

  if (isGraphLikeBody(body)) {
    var graphNodes = Array.isArray(body.nodes) ? body.nodes : body.vertices;
    var graphEdges = Array.isArray(body.edges)
      ? body.edges
      : Array.isArray(body.links)
        ? body.links
        : body.arcs;
    var labelMap = buildNodeLabelMap(graphNodes);
    return {
      id: materialId,
      kind: kind || "concept_graph",
      type: "expository_structured_graph",
      sectionId: sectionId,
      commissionId: text(source.commission_id),
      sourceOrder: sourceOrder,
      title: learnerFacingTitle(body.title || source.title, materialId),
      caption: text(body.caption) || text(body.summary),
      nodes: graphNodes.map(function (node, index) {
        if (typeof node === "string" || typeof node === "number") {
          return { label: text(node), description: "" };
        }
        return {
          label: learnerFacingLabel(node, "Concept " + (index + 1)),
          description:
            text(node.description) ||
            text(node.supporting_text) ||
            text(node.text) ||
            ""
        };
      }),
      edges: graphEdges
        .map(function (edge) {
          if (!isPlainObject(edge)) return null;
          var from =
            resolveEdgeEndpoint(
              edge.from != null ? edge.from : edge.source,
              labelMap
            ) || "";
          var to =
            resolveEdgeEndpoint(edge.to != null ? edge.to : edge.target, labelMap) ||
            "";
          if (!from && !to) return null;
          return {
            from: from,
            to: to,
            label:
              text(edge.label) ||
              text(edge.meaning) ||
              text(edge.relation) ||
              text(edge.description) ||
              ""
          };
        })
        .filter(Boolean),
      _authorFormalNotes: formalNotes
    };
  }

  if (isNodeRelationshipDiagramBody(body)) {
    var diagramNodes = diagramNodeList(body);
    var diagramLabelMap = buildDiagramLabelMap(diagramNodes);
    var diagramTitle = learnerFacingTitle(body.title || source.title, materialId);
    return {
      id: materialId,
      kind: kind || "conceptual_diagram",
      type: "expository_diagram_specification",
      sectionId: sectionId,
      commissionId: text(source.commission_id),
      sourceOrder: sourceOrder,
      title: diagramTitle,
      prose: diagramProseBody(body, diagramTitle),
      concepts: diagramNodes.map(function (node) {
        if (typeof node === "string" || typeof node === "number") {
          return { label: diagramNodeLabel(node), role: "", description: "" };
        }
        return {
          label: diagramNodeLabel(node),
          role: text(node.role),
          description:
            text(node.description) ||
            text(node.supporting_text) ||
            text(node.text) ||
            ""
        };
      }),
      relationships: body.relationships
        .map(function (edge) {
          if (!isPlainObject(edge)) return null;
          var from = resolveDiagramEndpoint(
            edge.from != null ? edge.from : edge.source,
            diagramLabelMap
          );
          var to = resolveDiagramEndpoint(
            edge.to != null ? edge.to : edge.target,
            diagramLabelMap
          );
          var label =
            text(edge.label) ||
            text(edge.meaning) ||
            text(edge.relation) ||
            text(edge.description) ||
            "";
          if (!from && !to && !label) return null;
          return { from: from, to: to, label: label };
        })
        .filter(Boolean),
      _authorFormalNotes: formalNotes
    };
  }

  if (!isTabularBody(body)) {
    var comparison = extractAuthoredComparisonTable(body);
    if (comparison) {
      return {
        id: materialId,
        kind: kind || "comparison_table",
        type: "expository_structured_table",
        sectionId: sectionId,
        commissionId: text(source.commission_id),
        sourceOrder: sourceOrder,
        title: learnerFacingTitle(body.title || source.title, materialId),
        caption: text(body.caption),
        columns: comparison.columns,
        rows: comparison.rows,
        companion: comparison.companion,
        publicationFailure: comparison.publicationFailure,
        _authorFormalNotes: formalNotes
      };
    }
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
      title: learnerFacingTitle(body.title || source.title, materialId),
      caption: text(body.caption),
      columns: table.columns,
      rows: table.rows,
      publicationFailure: table.publicationFailure || "",
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
      title: learnerFacingTitle(body.title || source.title, materialId),
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
      title: learnerFacingTitle(body.title || source.title, materialId),
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
      title: learnerFacingTitle(
        (isPlainObject(body) ? body.title : "") || source.title,
        materialId
      ),
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
        if (isDisplayGuidanceKey(k) || isConnectionsKey(k)) return "";
        if (isDiagramIdentifierKey(k)) {
          if (isMachineIdentifierCell(value[k])) return "";
          return cellText(value[k]);
        }
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

function withArticleAttributes(openTag, attrs) {
  if (!attrs) return openTag;
  var extra = "";
  Object.keys(attrs).forEach(function (name) {
    if (attrs[name] == null || attrs[name] === "") return;
    extra += " " + name + '="' + html.escapeAttribute(String(attrs[name])) + '"';
  });
  if (!extra) return openTag;
  return openTag.replace(/>$/, extra + ">");
}

/** Breakout + overflow-fallback host for Expository tables (prose measure unchanged). */
function wrapExpositionTableScroll(tableHtml) {
  return (
    '<div class="util-table-scroll util-exposition-table-scroll util-exposition-table-breakout">' +
    tableHtml +
    "</div>"
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
  var companionHtml = renderCompanionProse(material && material.companion, title);
  if (text(material && material.publicationFailure)) {
    return (
      withArticleAttributes(materialShellOpen(material, "table"), {
        "data-publication-status": "failed",
        "data-publication-failure": text(material.publicationFailure)
      }) +
      (title ? "<h3>" + html.escapeHtml(title) + "</h3>" : "") +
      '<p class="util-support-note" data-publication-failure="' +
      html.escapeAttribute(text(material.publicationFailure)) +
      '">This table cannot be published because a column has no faithful heading.</p>' +
      companionHtml +
      "</article>"
    );
  }
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
    wrapExpositionTableScroll(
      '<table class="util-exposition-structured-table">' +
        (caption ? "<caption>" + html.escapeHtml(caption) + "</caption>" : "") +
        head +
        body +
        "</table>"
    ) +
    companionHtml +
    "</article>"
  );
}

function renderCompanionProse(companion, title) {
  if (!isPlainObject(companion)) return "";
  var copy = {};
  Object.keys(companion).forEach(function (key) {
    if (keyMatchToken(key) === "title" && title && text(companion[key]) === title) return;
    if (keyMatchToken(key) === "caption") return;
    copy[key] = companion[key];
  });
  if (!Object.keys(copy).length) return "";
  return renderStructuredValue(copy, 0);
}

/**
 * Graph-like bodies: learner-facing concept list + readable relationships.
 * Preserves edge meaning; does not expose Nodes/Edges/From/To/Id schema chrome.
 */
function renderGraph(material) {
  var title = text(material && material.title);
  var caption = text(material && material.caption);
  var nodes = Array.isArray(material && material.nodes) ? material.nodes : [];
  var edges = Array.isArray(material && material.edges) ? material.edges : [];
  var nodesHtml = nodes
    .map(function (node) {
      var label = text(node && node.label);
      var description = text(node && node.description);
      if (!label && !description) return "";
      return (
        "<li>" +
        (label ? "<p><strong>" + html.escapeHtml(label) + "</strong></p>" : "") +
        (description
          ? '<div class="util-prose-measure">' +
            renderMarkdownOrPlain(description) +
            "</div>"
          : "") +
        "</li>"
      );
    })
    .filter(Boolean)
    .join("");
  var edgesHtml = edges
    .map(function (edge) {
      var from = text(edge && edge.from);
      var to = text(edge && edge.to);
      var label = text(edge && edge.label);
      if (!from && !to) return "";
      var relation = from && to ? from + " → " + to : from || to;
      return (
        "<li>" +
        "<p>" +
        html.escapeHtml(relation) +
        (label ? " — " + html.escapeHtml(label) : "") +
        "</p>" +
        "</li>"
      );
    })
    .filter(Boolean)
    .join("");
  return (
    materialShellOpen(material, "graph") +
    (title ? "<h3>" + html.escapeHtml(title) + "</h3>" : "") +
    (caption ? "<p data-field=\"caption\">" + html.escapeHtml(caption) + "</p>" : "") +
    (nodesHtml ? '<ul data-field="concepts">' + nodesHtml + "</ul>" : "") +
    (edgesHtml ? '<ul data-field="relationships">' + edgesHtml + "</ul>" : "") +
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
 * Visible scalar for fallback: suppress internal ids / bare machine tokens.
 */
function learnerFacingScalar(value) {
  var raw = text(value);
  if (!raw) return "";
  if (isInternalMaterialId(raw) || isMachineToken(raw)) return "";
  return raw;
}

/**
 * Keys to keep when rendering parallel object rows as a table.
 * Prefer labels over machine ids; drop bare schema id columns when a label exists.
 */
function learnerFacingTableColumns(sampleRow) {
  var keys = Object.keys(sampleRow || {});
  var hasLabel = keys.some(function (k) {
    var t = keyMatchToken(k);
    return t === "label" || t === "title" || t === "name" || t === "heading";
  });
  return keys.filter(function (k) {
    var t = keyMatchToken(k);
    if (t === "id" || t === "ids") return !hasLabel;
    if (
      t === "from" ||
      t === "to" ||
      t === "source" ||
      t === "target" ||
      t === "materialid" ||
      t === "commissionid" ||
      t === "continuationof" ||
      t === "continuedfrom"
    ) {
      return false;
    }
    return true;
  });
}

/**
 * Relationship-shaped scalar object → readable prose instead of From/To/Id chrome.
 */
function renderRelationshipObject(value) {
  if (!isPlainObject(value)) return "";
  var from = learnerFacingLabel(
    {
      label: value.from_label || value.source_label,
      id: value.from != null ? value.from : value.source
    },
    ""
  );
  if (!from) {
    from = learnerFacingScalar(value.from != null ? value.from : value.source);
  }
  var to = learnerFacingLabel(
    {
      label: value.to_label || value.target_label,
      id: value.to != null ? value.to : value.target
    },
    ""
  );
  if (!to) {
    to = learnerFacingScalar(value.to != null ? value.to : value.target);
  }
  var label =
    text(value.label) ||
    text(value.meaning) ||
    text(value.relation) ||
    text(value.description) ||
    "";
  if (!from && !to && !label) return "";
  var relation = from && to ? from + " → " + to : from || to || "";
  var prose = relation
    ? relation + (label ? " — " + label : "")
    : label;
  return prose ? "<p>" + html.escapeHtml(prose) + "</p>" : "";
}

function objectHasRelationshipShape(value) {
  if (!isPlainObject(value)) return false;
  var hasFrom = value.from != null || value.source != null;
  var hasTo = value.to != null || value.target != null;
  return hasFrom && hasTo;
}

function shownTableCell(cell) {
  if (typeof cell === "string" || typeof cell === "number") {
    return (
      learnerFacingScalar(cell) ||
      (!isMachineToken(cell) && !isInternalMaterialId(cell) ? text(cell) : "")
    );
  }
  return cellText(cell);
}

/**
 * Parallel objects as one table.
 * Named diagram metadata columns are not headings. Prose kept in an identifier
 * field becomes a row label. Omit the table when no learner column remains.
 */
function renderParallelObjectTable(rows) {
  var sample = rows[0];
  var rowLabelKey = "";
  var cols = learnerFacingTableColumns(sample).filter(function (key) {
    if (isConnectionsKey(key) || isDisplayGuidanceKey(key)) return false;
    if (!isDiagramIdentifierKey(key)) return true;
    var hasProse = rows.some(function (row) {
      var cell = row[key];
      return (
        (typeof cell === "string" || typeof cell === "number") &&
        text(cell) &&
        !isMachineIdentifierCell(cell)
      );
    });
    if (hasProse && !rowLabelKey) rowLabelKey = key;
    return false;
  });
  if (!cols.length) {
    if (!rowLabelKey) return "";
    var labels = rows
      .map(function (row) {
        var label = text(row[rowLabelKey]);
        if (!label || isMachineIdentifierCell(row[rowLabelKey])) return "";
        return "<li><p>" + html.escapeHtml(label) + "</p></li>";
      })
      .filter(Boolean)
      .join("");
    return labels ? "<ul>" + labels + "</ul>" : "";
  }
  var head =
    (rowLabelKey ? '<th scope="col"></th>' : "") +
    cols
      .map(function (c) {
        return '<th scope="col">' + html.escapeHtml(humanizeKey(c)) + "</th>";
      })
      .join("");
  var body = rows
    .map(function (row) {
      var rowHead = "";
      if (rowLabelKey) {
        var label = text(row[rowLabelKey]);
        if (!label || isMachineIdentifierCell(row[rowLabelKey])) label = "";
        rowHead = '<th scope="row">' + html.escapeHtml(label) + "</th>";
      }
      return (
        "<tr>" +
        rowHead +
        cols
          .map(function (c) {
            return "<td>" + html.escapeHtml(shownTableCell(row[c])) + "</td>";
          })
          .join("") +
        "</tr>"
      );
    })
    .join("");
  return wrapExpositionTableScroll(
    '<table class="util-exposition-structured-table"><thead><tr>' +
      head +
      "</tr></thead><tbody>" +
      body +
      "</tbody></table>"
  );
}

/**
 * Generic semantic rendering of arbitrary valid structured content.
 * Restrained HTML: p / ul / ol / dl / table / nested lists. No JSON dump.
 * Schema-mechanic keys are not shown as learner headings; their values still render.
 */
function renderStructuredValue(value, depth) {
  if (value == null) {
    return "";
  }
  if (depth > MAX_STRUCTURE_DEPTH) {
    return "<p>" + html.escapeHtml(cellText(value)) + "</p>";
  }
  if (typeof value === "string") {
    if (isInternalMaterialId(value) || isMachineToken(value)) return "";
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
            if (item == null) return "";
            var itemText = learnerFacingScalar(item);
            if (!itemText && (typeof item === "number" || typeof item === "boolean")) {
              itemText = text(item);
            }
            if (!itemText) return "";
            return "<li>" + html.escapeHtml(itemText) + "</li>";
          })
          .filter(Boolean)
          .join("") +
        "</ul>"
      );
    }
    // Parallel relationship objects → readable list (not From/To tables).
    if (value.length >= 1 && value.every(objectHasRelationshipShape)) {
      var relList = value
        .map(function (item) {
          var inner = renderRelationshipObject(item);
          return inner ? "<li>" + inner + "</li>" : "";
        })
        .filter(Boolean)
        .join("");
      return relList ? "<ul>" + relList + "</ul>" : "";
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
      return renderParallelObjectTable(value);
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
    if (objectHasRelationshipShape(value)) {
      return renderRelationshipObject(value);
    }
    var keys = Object.keys(value).filter(function (k) {
      var v = value[k];
      if (v == null) return false;
      if (typeof v === "string") {
        // Drop empty / internal-id / bare machine-token scalars.
        return !!learnerFacingScalar(v) || (!isMachineToken(v) && !isInternalMaterialId(v) && text(v) !== "");
      }
      if (typeof v === "number" || typeof v === "boolean") return true;
      if (isPlainObject(v) || Array.isArray(v)) return true;
      return text(v) !== "";
    });
    if (!keys.length) return "";
    var hasLabelField = keys.some(function (k) {
      var t = keyMatchToken(k);
      return t === "label" || t === "title" || t === "name" || t === "heading";
    });
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
            var tok = keyMatchToken(k);
            if (isDisplayGuidanceKey(k) || isConnectionsKey(k)) return "";
            if (isDiagramIdentifierKey(k)) {
              if (isMachineIdentifierCell(v)) return "";
              return "<div><dd>" + html.escapeHtml(text(v)) + "</dd></div>";
            }
            if ((tok === "id" || tok === "ids") && hasLabelField) return "";
            if (isSchemaMechanicKey(k) && tok !== "label") return "";
            if (isInternalMaterialId(v) || (typeof v === "string" && isMachineToken(v))) {
              return "";
            }
            var shown =
              typeof v === "string" ? learnerFacingScalar(v) || text(v) : text(v);
            if (!shown) return "";
            return (
              "<div><dt>" +
              html.escapeHtml(humanizeKey(k)) +
              "</dt><dd>" +
              html.escapeHtml(shown) +
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
        // Nested object/array: omit schema-mechanic headings; keep intellectual ones.
        if (isPlainObject(value[k]) || Array.isArray(value[k])) {
          if (isDisplayGuidanceKey(k)) return "";
          if (isConnectionsKey(k) || isSchemaMechanicKey(k)) {
            return inner;
          }
          return (
            "<section>" +
            "<h4>" +
            html.escapeHtml(humanizeKey(k)) +
            "</h4>" +
            inner +
            "</section>"
          );
        }
        if (isDisplayGuidanceKey(k) || isConnectionsKey(k)) return "";
        if (isDiagramIdentifierKey(k)) {
          if (isMachineIdentifierCell(value[k])) return "";
          return inner;
        }
        if (isSchemaMechanicKey(k)) return inner;
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
  // Strip internal title / continuation / id chrome from the visible body copy.
  if (isPlainObject(body)) {
    var sanitized = {};
    Object.keys(body).forEach(function (k) {
      var tok = keyMatchToken(k);
      if (
        tok === "title" &&
        (isInternalMaterialId(body[k]) ||
          isMachineToken(body[k]) ||
          (title && text(body[k]) === title))
      ) {
        return;
      }
      if (
        tok === "materialid" ||
        tok === "commissionid" ||
        tok === "continuationof" ||
        tok === "continuedfrom" ||
        tok === "continues" ||
        tok === "metadata" ||
        tok === "meta" ||
        tok === "schema"
      ) {
        return;
      }
      sanitized[k] = body[k];
    });
    body = sanitized;
  }
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
 * A finished section figure is an attached image with a renderable source.
 * A diagram specification, including layout, is not itself that figure.
 */
function sectionHasFinishedFigure(section, visualOptions) {
  var hook = section && section.visualAffordanceAfterContent;
  if (!hook || !text(hook.slot)) return false;
  var resolver = visualOptions && visualOptions.resolveVisualAsset;
  if (typeof resolver !== "function") return false;
  var asset = resolver(hook);
  var src = asset && asset.render_source ? text(asset.render_source.value) : "";
  return !!src;
}

function diagramFallbackIsFaithful(material) {
  var proseHtml = renderStructuredValue(material && material.prose, 0);
  if (proseHtml) return true;
  var concepts = Array.isArray(material && material.concepts) ? material.concepts : [];
  var i;
  for (i = 0; i < concepts.length; i++) {
    var concept = concepts[i];
    if (text(concept && concept.label) || text(concept && concept.role) || text(concept && concept.description)) {
      return true;
    }
  }
  var relationships = Array.isArray(material && material.relationships) ? material.relationships : [];
  for (i = 0; i < relationships.length; i++) {
    var edge = relationships[i];
    if ((text(edge && edge.from) && text(edge && edge.to)) || text(edge && edge.label)) return true;
  }
  return false;
}

function renderDiagramConcepts(concepts) {
  return concepts
    .map(function (concept) {
      var label = text(concept && concept.label);
      var role = text(concept && concept.role);
      var description = text(concept && concept.description);
      if (!label && !role && !description) return "";
      return (
        "<li>" +
        (label ? "<p><strong>" + html.escapeHtml(label) + "</strong></p>" : "") +
        (role ? "<p>" + html.escapeHtml(role) + "</p>" : "") +
        (description
          ? '<div class="util-prose-measure">' + renderMarkdownOrPlain(description) + "</div>"
          : "") +
        "</li>"
      );
    })
    .filter(Boolean)
    .join("");
}

function renderDiagramRelationships(relationships) {
  return relationships
    .map(function (edge) {
      var from = text(edge && edge.from);
      var to = text(edge && edge.to);
      var label = text(edge && edge.label);
      if (from && isNodeIdToken(from)) from = "";
      if (to && isNodeIdToken(to)) to = "";
      if (!from && !to && !label) return "";
      var relation = from && to ? from + " → " + to : from || to || "";
      var prose = relation ? relation + (label ? " — " + label : "") : label;
      return prose ? "<li><p>" + html.escapeHtml(prose) + "</p></li>" : "";
    })
    .filter(Boolean)
    .join("");
}

/**
 * Node/relationship specifications.
 * Machine fields are omitted when this section already has a finished figure.
 * Without that figure, publish the learner explanation and a label-based fallback.
 * If neither the figure nor a faithful description exists, fail closed.
 */
function renderDiagramSpecification(material, context) {
  var title = text(material && material.title);
  var proseHtml = renderStructuredValue(material && material.prose, 0);
  var figurePresent = sectionHasFinishedFigure(
    context && context.section,
    context && context.visualOptions
  );
  if (figurePresent) {
    if (!title && !proseHtml) {
      return (
        '<article class="util-material-block util-exposition-material util-exposition-diagram-caption" hidden aria-hidden="true" data-material-id="' +
        html.escapeAttribute(material.id) +
        '" data-material-kind="' +
        html.escapeAttribute(material.kind || "") +
        '" data-material-type="expository_diagram_specification" data-section-id="' +
        html.escapeAttribute(material.sectionId || "") +
        '" data-expository-structured="diagram_specification" data-diagram-machine-suppressed="section-figure"></article>'
      );
    }
    return (
      withArticleAttributes(materialShellOpen(material, "diagram_specification"), {
        "data-diagram-machine-suppressed": "section-figure"
      }) +
      (title ? "<h3>" + html.escapeHtml(title) + "</h3>" : "") +
      proseHtml +
      "</article>"
    );
  }
  if (!diagramFallbackIsFaithful(material)) {
    return (
      withArticleAttributes(materialShellOpen(material, "diagram_specification"), {
        "data-publication-status": "failed",
        "data-publication-failure": "diagram_representation_unavailable"
      }) +
      (title ? "<h3>" + html.escapeHtml(title) + "</h3>" : "") +
      '<p class="util-support-note" data-publication-failure="diagram_representation_unavailable">This diagram cannot be published because its figure is missing and the specification has no learner-facing description.</p>' +
      "</article>"
    );
  }
  var concepts = Array.isArray(material && material.concepts) ? material.concepts : [];
  var relationships = Array.isArray(material && material.relationships) ? material.relationships : [];
  var conceptsHtml = renderDiagramConcepts(concepts);
  var relationshipsHtml = renderDiagramRelationships(relationships);
  return (
    withArticleAttributes(materialShellOpen(material, "diagram_specification"), {
      "data-diagram-fallback": "learner-facing"
    }) +
    (title ? "<h3>" + html.escapeHtml(title) + "</h3>" : "") +
    proseHtml +
    (conceptsHtml ? '<ul data-field="concepts">' + conceptsHtml + "</ul>" : "") +
    (relationshipsHtml ? '<ul data-field="relationships">' + relationshipsHtml + "</ul>" : "") +
    "</article>"
  );
}

/**
 * @param {Object} material
 * @param {{ section?: Object, visualOptions?: Object }=} context
 * @returns {string|null} HTML, or null when caller should use ordinary renderMaterial
 */
function renderExpositionStructuredMaterial(material, context) {
  if (!material || typeof material !== "object") return null;
  var type = String(material.type || "");
  if (type === "expository_compact_worked_example") {
    return renderCompactWorkedExample(material);
  }
  if (type === "expository_diagram_caption") {
    return renderDiagramCaption(material);
  }
  if (type === "expository_diagram_specification") {
    return renderDiagramSpecification(material, context);
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
  if (type === "expository_structured_graph") {
    return renderGraph(material);
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
  isGraphLikeBody: isGraphLikeBody,
  isContrastPairsBody: isContrastPairsBody,
  isEquationBody: isEquationBody,
  isInternalMaterialId: isInternalMaterialId,
  isMachineToken: isMachineToken,
  isSchemaMechanicKey: isSchemaMechanicKey,
  normalizeKind: normalizeKind,
  humanizeKey: humanizeKey,
  learnerFacingTitle: learnerFacingTitle,
  learnerFacingLabel: learnerFacingLabel,
  buildExpositionStructuredMaterial: buildExpositionStructuredMaterial,
  renderExpositionStructuredMaterial: renderExpositionStructuredMaterial,
  renderStructuredValue: renderStructuredValue
};
