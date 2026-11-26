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
 *   (exact or unique prefix/suffix column↔row key match; unmatched columns
 *   recover only when unused data keys align one-to-one; empty-matrix recovery;
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
 * - table companions: interpretation-support fields and accessible equivalents
 *   are not printed again beside a complete semantic table. Other companion
 *   prose still renders. The equivalent stays on the material and is shown
 *   when the table is not an accessible representation, or when the text
 *   does not restate the table rows.
 *
 * All other valid structured bodies use a generic semantic fallback
 * (no JSON dump; no learner-facing "unsupported" slogan;
 * schema/internal-id chrome suppressed; intellectual content preserved).
 *
 * Representation-specification fields (representation type, compact visual
 * labels, timeline element objects, accessible-equivalent headings, format
 * descriptors, and similar) are not learner table columns or headings. Their
 * educational prose, ordered comparison cases, and text equivalents still
 * render without production chrome such as "Format" or "Interpretive statement".
 */

var html = require("./render-html-utils");
var illustrationHandoff = require("../expository-xm-illustration-handoff.js");
var materialAnchors = require("../expository-material-anchors.js");
var visualAffordance = require("./render-visual-affordance");
var assessmentInteractive = require("./assessment-interactive");

function isProductionInstructionProse(value) {
  return !!(
    visualAffordance &&
    typeof visualAffordance.isGraphicsProductionProse === "function" &&
    visualAffordance.isGraphicsProductionProse(value)
  );
}

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
  // Sequence identifiers (claim_id, item_id, …) read more naturally without a trailing "id".
  if (/^(claim|item|entry|row|candidate)\s+id$/i.test(spaced)) {
    spaced = spaced.replace(/\s+id$/i, "");
  }
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
  return (
    /^XM-MAT-/i.test(raw) ||
    /^XM\d+$/i.test(raw) ||
    /^COMM-/i.test(raw) ||
    /^[A-Z]{1,4}\d+\.body(?:\.[a-z0-9_]+)+$/i.test(raw)
  );
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
    token === "target" ||
    // Dataset & internal cross-reference pointers — never learner headings or cells.
    token === "datasetid" ||
    token === "scatterplotreference" ||
    token === "accessibletablereference" ||
    token === "tablereference" ||
    token === "figurereference" ||
    token === "materialreference" ||
    token === "rowheadercolumn" ||
    // Journal / constructed-text contract identifiers — never learner headings.
    token === "responseid" ||
    token === "responsetype" ||
    token === "responsekind" ||
    token === "producer" ||
    token === "producerid" ||
    token === "producercommissionid" ||
    token === "stableidentifier" ||
    token === "stableid" ||
    token === "elicitationid" ||
    token === "artefactid" ||
    token === "artifactid" ||
    token === "workspaceid" ||
    token === "journalable"
  );
}

/** Schema-mechanic keys whose scalar values are themselves internal metadata (omit key and value). */
function isOmittedSchemaScalarKey(key) {
  var token = keyMatchToken(key);
  return (
    token === "datasetid" ||
    token === "scatterplotreference" ||
    token === "accessibletablereference" ||
    token === "tablereference" ||
    token === "figurereference" ||
    token === "materialreference" ||
    token === "rowheadercolumn" ||
    token === "rowheadercolumnindex" ||
    token === "numericalsummaryreference" ||
    token === "datareference" ||
    token === "columnindex" ||
    token === "observationidentifiercolumnindex" ||
    token === "showobservationidentifiers" ||
    token === "showregressionline" ||
    token === "showconnectinglines" ||
    token === "showcausalarrows" ||
    token === "optionid" ||
    token === "correctoptionid" ||
    token === "categoryid" ||
    token === "correctcategoryid" ||
    token === "statementid" ||
    token === "feedbackcontrollabel" ||
    token === "materialid" ||
    token === "commissionid" ||
    token === "continuationof" ||
    token === "continuedfrom" ||
    token === "continues" ||
    token === "responseid" ||
    token === "responsetype" ||
    token === "responsekind" ||
    token === "producer" ||
    token === "producerid" ||
    token === "producercommissionid" ||
    token === "stableidentifier" ||
    token === "stableid" ||
    token === "elicitationid" ||
    token === "artefactid" ||
    token === "artifactid" ||
    token === "workspaceid" ||
    token === "journalable"
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

/**
 * Match a column token to a row value.
 * Exact token match first; then a unique prefix/suffix match so shortened
 * headers (Role, Example, Status, Relationship) still resolve snake_case keys
 * (variable_role, investigation_example, evidential_status, relationship_label).
 * Mid-string containment is not used — it falsely links Dimension↔dim and
 * blocks positional empty-matrix recovery. Ambiguous matches are ignored.
 */
function lookupRowKeyByToken(row, token) {
  if (!token || !isPlainObject(row)) return "";
  if (Object.prototype.hasOwnProperty.call(row, token)) return token;
  var keys = Object.keys(row);
  var exact = [];
  var fuzzy = [];
  var i;
  for (i = 0; i < keys.length; i++) {
    var keyTok = keyMatchToken(keys[i]);
    if (!keyTok) continue;
    if (keyTok === token) {
      exact.push(keys[i]);
      continue;
    }
    var shorter = token.length <= keyTok.length ? token : keyTok;
    var longer = token.length <= keyTok.length ? keyTok : token;
    // Suffix: Role→variable_role, Example→investigation_example, Status→evidential_status.
    var suffix = shorter.length >= 3 && longer.slice(longer.length - shorter.length) === shorter;
    // Prefix: Relationship→relationship_label. Require length ≥4 so Dimension↛dim.
    var prefix = shorter.length >= 4 && longer.slice(0, shorter.length) === shorter;
    if (!suffix && !prefix) continue;
    fuzzy.push({
      key: keys[i],
      score: (suffix ? 100 : 0) + (prefix ? 40 : 0) + shorter.length
    });
  }
  if (exact.length) return exact[0];
  if (!fuzzy.length) return "";
  if (fuzzy.length === 1) return fuzzy[0].key;
  fuzzy.sort(function (a, b) {
    return b.score - a.score;
  });
  if (fuzzy[0].score > fuzzy[1].score) return fuzzy[0].key;
  return "";
}

function lookupRowValueByToken(row, token) {
  var key = lookupRowKeyByToken(row, token);
  if (!key) return undefined;
  return row[key];
}

function columnKeyCandidate(col) {
  if (!isPlainObject(col)) return "";
  return (
    text(col.key) ||
    text(col.id) ||
    text(col.field) ||
    text(col.property) ||
    text(col.dataIndex) ||
    text(col.accessor) ||
    ""
  );
}

/**
 * Resolve one cell for a column definition against a row object/array.
 * Survives label↔key mismatch that previously yielded blank tables.
 */
function resolveMatchedRowKey(row, col, columnLabel) {
  if (!isPlainObject(row)) return "";
  if (isPlainObject(col)) {
    var directKey = columnKeyCandidate(col);
    if (directKey && Object.prototype.hasOwnProperty.call(row, directKey)) return directKey;
    var keyTok = keyMatchToken(
      directKey ||
        col.heading ||
        col.header ||
        col.name ||
        col.label ||
        col.title ||
        columnLabel
    );
    var byKey = lookupRowKeyByToken(row, keyTok);
    if (byKey) return byKey;
  }
  if (typeof col === "string" || typeof col === "number") {
    var asKey = text(col);
    if (asKey && Object.prototype.hasOwnProperty.call(row, asKey)) return asKey;
    var byLabel = lookupRowKeyByToken(row, keyMatchToken(asKey));
    if (byLabel) return byLabel;
  }
  if (columnLabel) {
    if (Object.prototype.hasOwnProperty.call(row, columnLabel)) return columnLabel;
    var byColLabel = lookupRowKeyByToken(row, keyMatchToken(columnLabel));
    if (byColLabel) return byColLabel;
  }
  return "";
}

function resolveRowCell(row, col, index, columnLabel) {
  if (Array.isArray(row)) {
    return row[index] != null ? row[index] : "";
  }
  var key = resolveMatchedRowKey(row, col, columnLabel);
  if (!key) return "";
  return row[key];
}

/**
 * Keys that are row metadata or representation notes, not unused data columns.
 * relationship_label is authoring prose stored beside the comparison, not a cell.
 */
function isUnusedTableDataKey(key) {
  if (!key) return false;
  if (isUnlabeledProseKey(key)) return false;
  if (isSchemaMechanicKey(key)) return false;
  if (isConstructionInstructionKey(key)) return false;
  if (isDiagramMachineKey(key) || isDiagramIdentifierKey(key)) return false;
  return isMeaningfulColumnKey(key);
}

function columnKeyMatchState(sourceRows, col, heading) {
  var keys = sourceRows.map(function (row) {
    return resolveMatchedRowKey(row, col, heading);
  });
  var first = keys[0] || "";
  if (first && keys.every(function (key) { return key === first; })) {
    return { status: "matched", key: first };
  }
  if (keys.every(function (key) { return !key; })) return { status: "unmatched", key: "" };
  return { status: "ambiguous", keys: keys };
}

/**
 * After exact and unique prefix/suffix matches, fill only columns that matched
 * no row key. Assignment is the unused data keys in authored order, and only
 * when that list is the same length as the unmatched columns and every key is
 * present on every row. Anything else stays blank.
 */
function fillUnmatchedColumnsFromUnusedKeys(sourceColumns, headings, matrix, sourceRows) {
  if (!Array.isArray(sourceRows) || !sourceRows.length || !sourceRows.every(isPlainObject)) {
    return matrix;
  }
  var used = Object.create(null);
  var unmatched = [];
  var i;
  for (i = 0; i < sourceColumns.length; i++) {
    var state = columnKeyMatchState(sourceRows, sourceColumns[i], headings[i]);
    if (state.status === "matched") {
      used[state.key] = true;
      continue;
    }
    if (state.status === "unmatched") {
      unmatched.push(i);
      continue;
    }
    (state.keys || []).forEach(function (key) {
      if (key) used[key] = true;
    });
  }
  if (!unmatched.length) return matrix;
  var leftover = Object.keys(sourceRows[0]).filter(function (key) {
    if (used[key] || !isUnusedTableDataKey(key)) return false;
    return sourceRows.every(function (row) {
      return Object.prototype.hasOwnProperty.call(row, key);
    });
  });
  if (leftover.length !== unmatched.length) return matrix;
  return matrix.map(function (row, rowIndex) {
    var next = row.slice();
    unmatched.forEach(function (colIndex, leftoverIndex) {
      next[colIndex] = sourceRows[rowIndex][leftover[leftoverIndex]];
    });
    return next;
  });
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
 * Scalar equation text from a string/number or structured formula object.
 * Never coerce plain objects via String(object) → "[object Object]".
 */
function equationExpressionFromValue(value) {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return text(value);
  if (!isPlainObject(value)) return "";
  return (
    text(value.expression) ||
    text(value.latex) ||
    text(value.equation) ||
    text(value.formula) ||
    text(value.notation_display) ||
    ""
  );
}

function scalarAnnotationText(value) {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return text(value);
  }
  return "";
}

function notationEntryHasFields(value) {
  return (
    value.symbol != null ||
    value.term != null ||
    value.meaning != null ||
    value.pronunciation != null ||
    value.description != null ||
    value.gloss != null
  );
}

/** One readable annotation. Objects and arrays are never passed through text(). */
function notationEntryAnnotation(entry) {
  if (typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean") {
    var scalar = text(entry);
    return scalar ? { label: "Notation", description: scalar } : null;
  }
  if (!isPlainObject(entry)) return null;
  var label =
    scalarAnnotationText(entry.symbol) ||
    scalarAnnotationText(entry.term) ||
    scalarAnnotationText(entry.label);
  var meaning =
    scalarAnnotationText(entry.meaning) ||
    scalarAnnotationText(entry.description) ||
    scalarAnnotationText(entry.gloss) ||
    scalarAnnotationText(entry.text);
  var pronunciation =
    scalarAnnotationText(entry.pronunciation) || scalarAnnotationText(entry.spoken);
  var description = meaning;
  if (pronunciation && pronunciation !== meaning && pronunciation !== label) {
    description = description ? description + " (" + pronunciation + ")" : pronunciation;
  }
  if (!label && !description) return null;
  return { label: label || "Notation", description: description };
}

/**
 * notation / symbols may be a string, a symbol→gloss map, or a list of
 * { symbol, meaning, pronunciation } entries. Never String(object).
 */
function readableNotationAnnotations(value) {
  if (value == null || value === "") return [];
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    var scalar = text(value);
    return scalar ? [{ label: "Notation", description: scalar }] : [];
  }
  if (Array.isArray(value)) {
    return value.map(notationEntryAnnotation).filter(Boolean);
  }
  if (!isPlainObject(value)) return [];
  if (notationEntryHasFields(value)) {
    var entry = notationEntryAnnotation(value);
    return entry ? [entry] : [];
  }
  return Object.keys(value)
    .map(function (key) {
      var gloss = value[key];
      if (typeof gloss === "string" || typeof gloss === "number" || typeof gloss === "boolean") {
        var description = text(gloss);
        var label = text(key);
        if (!label && !description) return null;
        return { label: label || "Notation", description: description };
      }
      if (!isPlainObject(gloss)) return null;
      var nested = notationEntryAnnotation(gloss);
      if (!nested) return null;
      if ((!nested.label || nested.label === "Notation") && text(key)) nested.label = text(key);
      return nested;
    })
    .filter(Boolean);
}

function annotationsFromFormulaObject(formula) {
  if (!isPlainObject(formula)) return [];
  var notes = [];
  var spoken =
    scalarAnnotationText(formula.spoken_equivalent) ||
    scalarAnnotationText(formula.spoken) ||
    scalarAnnotationText(formula.speech);
  if (spoken) notes.push({ label: "Spoken form", description: spoken });
  var expression = equationExpressionFromValue(formula);
  var notationNotes = readableNotationAnnotations(formula.notation);
  if (!notationNotes.length) notationNotes = readableNotationAnnotations(formula.notation_note);
  readableNotationAnnotations(formula.symbols).forEach(function (note) {
    notationNotes.push(note);
  });
  notationNotes.forEach(function (note) {
    if (note.label === "Notation" && note.description === expression) return;
    notes.push(note);
  });
  return notes;
}

/**
 * Equation / annotated-equation commissions (C01).
 */
function isEquationBody(body) {
  if (!isPlainObject(body)) return false;
  return !!(
    equationExpressionFromValue(body.equation) ||
    equationExpressionFromValue(body.latex) ||
    equationExpressionFromValue(body.expression) ||
    equationExpressionFromValue(body.formula)
  );
}

function resolveEquationFields(body) {
  var equation =
    equationExpressionFromValue(body.equation) ||
    equationExpressionFromValue(body.latex) ||
    equationExpressionFromValue(body.expression) ||
    equationExpressionFromValue(body.formula);
  var annotations = Array.isArray(body.annotations) ? body.annotations.slice() : [];
  if (isPlainObject(body.formula)) {
    annotations = annotations.concat(annotationsFromFormulaObject(body.formula));
  } else if (isPlainObject(body.equation)) {
    annotations = annotations.concat(annotationsFromFormulaObject(body.equation));
  }
  return {
    equation: equation,
    annotations: annotations,
    caption: text(body.caption) || text(body.explanation)
  };
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
  if (isConstructionInstructionKey(raw)) return false;
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
  var key = columnKeyCandidate(col);
  if (isMeaningfulColumnKey(key)) return humanizeKey(key);
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

function columnIsConstructionSpec(col) {
  if (typeof col === "string" || typeof col === "number") return isConstructionInstructionKey(col);
  if (!isPlainObject(col)) return false;
  var key = text(col.key) || text(col.id);
  var heading =
    text(col.heading) ||
    text(col.header) ||
    text(col.name) ||
    text(col.label) ||
    text(col.title);
  return isConstructionInstructionKey(key) || isConstructionInstructionKey(heading);
}

function authoredColumnsAreConstructionSpec(columns) {
  return Array.isArray(columns) && columns.length > 0 && columns.every(columnIsConstructionSpec);
}

/**
 * Parallel records that only carry diagram/graph construction fields
 * (plus an accessible description) are not comparison tables.
 */
function rowsAreConstructionSpecifications(rows) {
  if (!Array.isArray(rows) || !rows.length || !rows.every(isPlainObject)) return false;
  return rows.every(function (row) {
    var keys = Object.keys(row);
    if (!keys.some(isConstructionInstructionKey)) return false;
    return !keys.some(function (key) {
      if (isConstructionInstructionKey(key) || isUnlabeledProseKey(key)) return false;
      if (isSchemaMechanicKey(key) || isDiagramMachineKey(key)) return false;
      var token = keyMatchToken(key);
      return !(
        token === "caption" ||
        token === "title" ||
        token === "alttext" ||
        token === "detaileddescription" ||
        token === "explanatorycaption" ||
        token === "accessibledescription"
      );
    });
  });
}

function tabularColumnsAndRows(body) {
  var columns;
  var rows;
  if (Array.isArray(body.columns) && body.columns.length && Array.isArray(body.rows)) {
    var sourceColumns = body.columns.filter(function (col) {
      return !columnIsConstructionSpec(col);
    });
    columns = sourceColumns.map(function (col) {
      return resolveColumnHeading(col);
    });
    rows = body.rows.map(function (row) {
      return sourceColumns.map(function (col, i) {
        return resolveRowCell(row, col, i, columns[i]);
      });
    });
    rows = fillUnmatchedColumnsFromUnusedKeys(sourceColumns, columns, rows, body.rows);
    // If headers survived but every cell is still empty, recover from row objects.
    // Partial mismatches are handled above; this remains gated on a fully empty
    // matrix so intentional blank cells stay blank.
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
        return (
          isMeaningfulColumnKey(k) &&
          !isRepresentationOmissionKey(k) &&
          !isUnlabeledProseKey(k) &&
          !isUnlabeledStructureKey(k)
        );
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

function tableFooterCaption(footer) {
  if (footer == null) return "";
  if (typeof footer === "string" || typeof footer === "number" || typeof footer === "boolean") {
    return text(footer);
  }
  if (!isPlainObject(footer)) return "";
  var label = scalarAnnotationText(footer.label) || scalarAnnotationText(footer.heading);
  var expression =
    scalarAnnotationText(footer.expression) ||
    scalarAnnotationText(footer.value) ||
    scalarAnnotationText(footer.text) ||
    scalarAnnotationText(footer.result);
  if (label && expression) return label + ": " + expression;
  return label || expression;
}

/**
 * Learner table nested at body.table rather than body.columns / body.rows.
 * Column objects with a heading are resolved by the existing table builder.
 */
function nestedLearnerTable(body) {
  if (!isPlainObject(body)) return null;
  var tableKey = isPlainObject(body.table)
    ? "table"
    : isPlainObject(body.comparison_table)
      ? "comparison_table"
      : "";
  if (!tableKey) return null;
  var table = body[tableKey];
  if (!(Array.isArray(table.columns) && table.columns.length && Array.isArray(table.rows))) {
    return null;
  }
  var parsed = tabularColumnsAndRows(table);
  if (!parsed.columns.length && !parsed.rows.length) return null;
  var companion = {};
  Object.keys(body).forEach(function (key) {
    var token = keyMatchToken(key);
    if (
      token === "table" ||
      token === "comparisontable" ||
      token === "title" ||
      token === "heading" ||
      token === "formula" ||
      token === "equation" ||
      token === "expression" ||
      token === "latex"
    ) {
      return;
    }
    companion[key] = body[key];
  });
  return {
    columns: parsed.columns,
    rows: parsed.rows,
    rowHeaderColumn: resolveTableRowHeaderColumn(table),
    publicationFailure: parsed.publicationFailure || "",
    caption:
      tableFooterCaption(table.footer) ||
      scalarAnnotationText(table.caption) ||
      scalarAnnotationText(body.caption),
    companion: companion
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
function isDiagramEdge(edge) {
  return (
    isPlainObject(edge) &&
    (edge.from != null || edge.source != null) &&
    (edge.to != null || edge.target != null)
  );
}

/**
 * Relationship list for a node diagram.
 * Prefer relationships[]. A connections[] list is the same edge list when
 * every item names both ends. Other connection metadata is left alone.
 */
function diagramRelationshipSource(body) {
  if (!isPlainObject(body)) return null;
  if (Array.isArray(body.relationships) && body.relationships.length) {
    return { omitKey: "relationships", edges: body.relationships };
  }
  if (
    Array.isArray(body.connections) &&
    body.connections.length &&
    body.connections.every(isDiagramEdge)
  ) {
    return { omitKey: "connections", edges: body.connections };
  }
  return null;
}

function isNodeRelationshipDiagramBody(body) {
  if (!isPlainObject(body)) return false;
  if (isDiagramSpecBody(body)) return false;
  if (isGraphLikeBody(body)) return false;
  var nodes = diagramNodeList(body);
  var relationships = diagramRelationshipSource(body);
  return !!(nodes && relationships && relationships.edges.length);
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
    if (isDiagramMachineKey(key) || isConstructionInstructionKey(key)) return;
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

/** Learner explanation kept beside a graph. Construction fields and the caption are omitted. */
function learnerProseBesideStructure(body, title) {
  var prose = diagramProseBody(body, title);
  Object.keys(prose).forEach(function (key) {
    var token = keyMatchToken(key);
    if (token === "caption" || token === "summary" || token === "title") delete prose[key];
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
  // Preserve structured notes; never coerce objects to "[object Object]".
  var formalNotes =
    source.formal_notes == null
      ? ""
      : typeof source.formal_notes === "string"
        ? source.formal_notes.trim()
        : typeof source.formal_notes === "object"
          ? source.formal_notes
          : text(source.formal_notes);

  if (typeof body === "string") {
    return null; // caller uses ordinary prose/material path
  }

  if (isScatterplotMaterialBody(body)) {
    return normalizeScatterplotMaterial(source, body, materialId, kind, sectionId, sourceOrder, formalNotes);
  }

  if (isExpositoryResponseElicitationBody(body)) {
    return normalizeExpositoryResponseElicitation(source, body, materialId, kind, sectionId, sourceOrder, formalNotes);
  }

  if (isExpositoryFeedbackDisclosureBody(body)) {
    return normalizeExpositoryFeedbackDisclosure(source, body, materialId, kind, sectionId, sourceOrder, formalNotes);
  }

  if (isExpositoryFormativeCheckBody(body)) {
    return normalizeExpositoryFormativeCheck(source, body, materialId, kind, sectionId, sourceOrder, formalNotes);
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
      accessibleText:
        text(body.accessible_text_equivalent) ||
        (!isProductionInstructionProse(body.detailed_description)
          ? text(body.detailed_description)
          : "") ||
        text(body.alt_text) ||
        text(body.explanatory_caption) ||
        text(body.accessible_description),
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
      prose: learnerProseBesideStructure(
        body,
        learnerFacingTitle(body.title || source.title, materialId)
      ),
      suppressStructureWhenFigured: Object.keys(body).some(isConstructionInstructionKey),
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
    var diagramEdges = diagramRelationshipSource(body);
    var diagramLabelMap = buildDiagramLabelMap(diagramNodes);
    var diagramTitle = learnerFacingTitle(body.title || source.title, materialId);
    var diagramProse = diagramProseBody(body, diagramTitle);
    if (diagramEdges && diagramEdges.omitKey && diagramProse) {
      delete diagramProse[diagramEdges.omitKey];
    }
    return {
      id: materialId,
      kind: kind || "conceptual_diagram",
      type: "expository_diagram_specification",
      sectionId: sectionId,
      commissionId: text(source.commission_id),
      sourceOrder: sourceOrder,
      title: diagramTitle,
      prose: diagramProse,
      concepts: diagramNodes.map(function (node) {
        if (typeof node === "string" || typeof node === "number") {
          return { label: diagramNodeLabel(node), role: "", description: "" };
        }
        return {
          label: diagramNodeLabel(node),
          role: text(node.role),
          description:
            text(node.description) ||
            text(node.detail) ||
            text(node.supporting_text) ||
            text(node.text) ||
            ""
        };
      }),
      relationships: diagramEdges.edges
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
        accessibleText: tableAccessibleAlternative(body),
        publicationFailure: comparison.publicationFailure,
        _authorFormalNotes: formalNotes
      };
    }
  }

  if (
    isTabularBody(body) &&
    (rowsAreConstructionSpecifications(body.rows) ||
      authoredColumnsAreConstructionSpec(body.columns))
  ) {
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

  if (isTabularBody(body)) {
    var table = tabularColumnsAndRows(body);
    var tabularCompanion = {};
    Object.keys(body).forEach(function (key) {
      var token = keyMatchToken(key);
      if (
        token === "columns" ||
        token === "rows" ||
        token === "title" ||
        token === "columnheaders"
      ) {
        return;
      }
      tabularCompanion[key] = body[key];
    });
    return {
      id: materialId,
      kind: kind || "comparison_table",
      type: "expository_structured_table",
      sectionId: sectionId,
      commissionId: text(source.commission_id),
      sourceOrder: sourceOrder,
      title: learnerFacingTitle(body.heading || body.title || source.title, materialId),
      caption: text(body.caption),
      columns: table.columns,
      rows: table.rows,
      rowHeaderColumn: resolveTableRowHeaderColumn(body),
      companion: tabularCompanion,
      accessibleText: tableAccessibleAlternative(body),
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
    var equationFields = resolveEquationFields(body);
    var workedTable = nestedLearnerTable(body);
    return {
      id: materialId,
      kind: kind || "equation",
      type: "expository_structured_equation",
      sectionId: sectionId,
      commissionId: text(source.commission_id),
      sourceOrder: sourceOrder,
      title: learnerFacingTitle(body.title || source.title, materialId),
      equation: equationFields.equation,
      annotations: equationFields.annotations,
      caption: equationFields.caption,
      columns: workedTable ? workedTable.columns : [],
      rows: workedTable ? workedTable.rows : [],
      tableCaption: workedTable ? workedTable.caption : "",
      publicationFailure: workedTable ? workedTable.publicationFailure : "",
      _authorFormalNotes: formalNotes
    };
  }

  var nestedTable = isPlainObject(body) ? nestedLearnerTable(body) : null;
  if (nestedTable) {
    return {
      id: materialId,
      kind: kind || "comparison_table",
      type: "expository_structured_table",
      sectionId: sectionId,
      commissionId: text(source.commission_id),
      sourceOrder: sourceOrder,
      title: learnerFacingTitle(body.heading || body.title || source.title, materialId),
      caption: nestedTable.caption,
      columns: nestedTable.columns,
      rows: nestedTable.rows,
      rowHeaderColumn: nestedTable.rowHeaderColumn,
      companion: nestedTable.companion,
      accessibleText: tableAccessibleAlternative(body),
      publicationFailure: nestedTable.publicationFailure,
      _authorFormalNotes: formalNotes
    };
  }

  if (
    illustrationHandoff &&
    typeof illustrationHandoff.isUnrealizedIllustrationSpecification === "function" &&
    illustrationHandoff.isUnrealizedIllustrationSpecification(source)
  ) {
    var illustrationDescriptions = learnerDescriptionFields(body);
    return {
      id: materialId,
      kind: kind || "illustration",
      type: "expository_unfulfilled_illustration",
      sectionId: sectionId,
      commissionId: text(source.commission_id),
      sourceOrder: sourceOrder,
      title: learnerFacingTitle(body.title || source.title, materialId),
      caption: illustrationDescriptions.caption,
      accessibleText: illustrationDescriptions.accessible,
      _authorFormalNotes: formalNotes
    };
  }

  var commissionedTable = isPlainObject(body) ? findCommissionedComparisonTable(body) : null;
  if (commissionedTable) {
    var descriptions = learnerDescriptionFields(body);
    return {
      id: materialId,
      kind: kind || "comparison_table",
      type: "expository_structured_table",
      sectionId: sectionId,
      commissionId: text(source.commission_id),
      sourceOrder: sourceOrder,
      title: learnerFacingTitle(body.title || source.title, materialId),
      caption: descriptions.caption,
      accessibleText: descriptions.accessible,
      columns: commissionedTable.columns,
      rows: commissionedTable.rows,
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

/**
 * Caption and accessible-description roles. These are the learner-facing
 * words for a figure or table. They are not a list of specification fields.
 */
function isLearnerDescriptionKey(key) {
  var token = keyMatchToken(key);
  return (
    token === "caption" ||
    token === "summary" ||
    token === "textequivalent" ||
    token === "accessibletextequivalent" ||
    token === "accessibledescription" ||
    token === "detaileddescription" ||
    token === "explanatorycaption" ||
    token === "alttext" ||
    token === "textalternative"
  );
}

function collectLearnerDescriptionEntries(body) {
  var entries = [];
  function walk(value) {
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (!isPlainObject(value)) return;
    Object.keys(value).forEach(function (key) {
      var child = value[key];
      if (typeof child === "string" && text(child) && isLearnerDescriptionKey(key)) {
        entries.push({ key: key, text: text(child) });
        return;
      }
      if (isPlainObject(child) || Array.isArray(child)) walk(child);
    });
  }
  walk(body);
  return entries;
}

function learnerDescriptionFields(body) {
  var caption = "";
  var accessible = "";
  var fallbackDetailed = "";
  collectLearnerDescriptionEntries(body).forEach(function (entry) {
    if (isProductionInstructionProse(entry.text)) return;
    var token = keyMatchToken(entry.key);
    if ((token === "caption" || token === "summary") && !caption) caption = entry.text;
    if (token === "detaileddescription") {
      if (!fallbackDetailed) fallbackDetailed = entry.text;
      return;
    }
    if (
      !accessible &&
      token !== "caption" &&
      token !== "summary" &&
      token !== "alttext"
    ) {
      accessible = entry.text;
    }
  });
  return { caption: caption, accessible: accessible || fallbackDetailed };
}

/**
 * Accessible alternative for a table. Prefer the text equivalent; an alt
 * string is the fallback. This does not remove the authored field.
 */
function tableAccessibleAlternative(body) {
  var described = learnerDescriptionFields(body);
  if (described.accessible) return described.accessible;
  var alt = "";
  collectLearnerDescriptionEntries(body).forEach(function (entry) {
    if (!alt && keyMatchToken(entry.key) === "alttext") alt = entry.text;
  });
  return alt;
}

/**
 * Accessible alternatives are the wording of a figure or table, not a second
 * learner section. Caption and summary stay available as captions.
 */
function isAccessibleAlternativeKey(key) {
  if (!isLearnerDescriptionKey(key)) return false;
  var token = keyMatchToken(key);
  return token !== "caption" && token !== "summary";
}

/**
 * Interpretation support frames a table. It is not learner prose beside one.
 */
function isTableInterpretationSupportKey(key) {
  var token = keyMatchToken(key);
  return (
    token === "introductorytext" ||
    token === "integratedinterpretation" ||
    token === "interpretiveboundary"
  );
}

function renderLearnerDescriptionFields(body, title) {
  var seen = Object.create(null);
  return collectLearnerDescriptionEntries(body)
    .filter(function (entry) {
      if (isProductionInstructionProse(entry.text)) return false;
      if (keyMatchToken(entry.key) === "title" && title && entry.text === title) return false;
      if (seen[entry.text]) return false;
      seen[entry.text] = true;
      return true;
    })
    .map(function (entry) {
      return renderMarkdownOrPlain(entry.text);
    })
    .join("");
}

function isScalarValue(value) {
  return (
    value == null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function isParallelScalarRowArray(value) {
  if (!Array.isArray(value) || value.length < 2 || !value.every(isPlainObject)) return false;
  var signature = Object.keys(value[0]).sort().join("\0");
  if (!signature) return false;
  return value.every(function (row) {
    if (Object.keys(row).sort().join("\0") !== signature) return false;
    return Object.keys(row).every(function (key) {
      return isScalarValue(row[key]);
    });
  });
}

function isStringList(value) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(function (item) {
      return typeof item === "string" || typeof item === "number";
    })
  );
}

/**
 * A commissioned comparison is one object that holds the column headings and
 * the comparison rows, and nothing else structured. Diagram and graph
 * specifications nest further objects, so they do not match.
 */
function isCommissionedTableObject(value) {
  if (!isPlainObject(value)) return false;
  var rowArrays = 0;
  var headerLists = 0;
  var keys = Object.keys(value);
  var i;
  for (i = 0; i < keys.length; i++) {
    var child = value[keys[i]];
    if (isParallelScalarRowArray(child) && !child.every(isExplanationRecord)) {
      rowArrays += 1;
      continue;
    }
    if (isStringList(child)) {
      headerLists += 1;
      continue;
    }
    if (isScalarValue(child)) continue;
    return false;
  }
  return rowArrays === 1 && headerLists === 1;
}

function commissionedTableFromObject(tableObject) {
  var rows = null;
  Object.keys(tableObject).forEach(function (key) {
    var value = tableObject[key];
    if (isParallelScalarRowArray(value) && !value.every(isExplanationRecord)) rows = value;
  });
  if (!rows) return null;
  var columns = Object.keys(rows[0]).filter(function (key) {
    return isMeaningfulColumnKey(key);
  });
  if (!columns.length) return null;
  return {
    columns: columns.map(humanizeKey),
    rows: rows.map(function (row) {
      return columns.map(function (key) {
        return row[key];
      });
    })
  };
}

function findCommissionedComparisonTable(body) {
  var found = [];
  function walk(value) {
    if (!isPlainObject(value)) return;
    if (isCommissionedTableObject(value)) {
      found.push(value);
      return;
    }
    Object.keys(value).forEach(function (key) {
      if (isPlainObject(value[key])) walk(value[key]);
    });
  }
  walk(body);
  if (found.length !== 1) return null;
  return commissionedTableFromObject(found[0]);
}

/**
 * Diagram and graph construction instructions. Omit the field and its value.
 * These are authoring specifications for a figure, not learner chapter prose.
 */
function isConstructionInstructionKey(key) {
  var token = keyMatchToken(key);
  if (!token) return false;
  if (
    token === "panelid" ||
    token === "layout" ||
    token === "diagramlayout" ||
    token === "visualconventions" ||
    token === "energyflows" ||
    token === "conceptualtrajectory" ||
    token === "requiredvisualfeatures" ||
    token === "arrowplacement" ||
    token === "arrowplacementinstructions" ||
    token === "placementinstructions" ||
    token === "visualbrief" ||
    token === "renderinginstructions" ||
    token === "constructioninstructions" ||
    token === "diagraminstructions" ||
    token === "imageinstructions" ||
    token === "drawinginstructions"
  ) {
    return true;
  }
  return (
    token.indexOf("arrow") !== -1 &&
    (token.indexOf("plac") !== -1 || token.indexOf("instruction") !== -1)
  );
}

/**
 * Figure-production / material-spec instructions. Omit the field; the value is
 * not learner chapter prose (or is only a production descriptor).
 */
function isRepresentationOmissionKey(key) {
  var token = keyMatchToken(key);
  return (
    token === "representationtype" ||
    token === "compactvisuallabel" ||
    token === "format" ||
    token === "charttype" ||
    token === "datastatus" ||
    token === "comparisonfocus" ||
    token === "columnheaders" ||
    token === "surfacedescription" ||
    token === "visibleelements" ||
    token === "seriesid" ||
    token === "linestyle" ||
    isConstructionInstructionKey(key)
  );
}

/**
 * Educational prose stored under a representation-spec or scaffold field name.
 * Keep the sentences; do not use the schema field name as a learner-facing
 * heading, definition-list term, or column.
 */
function isUnlabeledProseKey(key) {
  var token = keyMatchToken(key);
  return (
    token === "centralconcept" ||
    token === "centralsynthesis" ||
    token === "accessibletextequivalent" ||
    token === "textequivalent" ||
    token === "temporalstructure" ||
    token === "investigationdirection" ||
    token === "relationshiplabel" ||
    token === "relationship" ||
    token === "sharedclinicalcontext" ||
    token === "detaileddescription" ||
    token === "alttext" ||
    token === "explanatorycaption" ||
    token === "accessibledescription" ||
    token === "caption" ||
    token === "interpretivestatement" ||
    token === "interpretation" ||
    token === "introduction" ||
    token === "intro" ||
    token === "preamble" ||
    token === "opening" ||
    token === "closing" ||
    token === "conclusion" ||
    token === "wrapup" ||
    token === "coda" ||
    token === "conceptualdistinction" ||
    token === "conceptualdistinctions" ||
    token === "context" ||
    token === "companiontext" ||
    token === "companionprose" ||
    token === "companionnote" ||
    token === "accessibledistributioncomparison" ||
    token === "comparisonguidance" ||
    token === "qualification" ||
    token === "prompt" ||
    token === "taskprompt" ||
    token === "learnerprompt"
  );
}

function isSourceNoteKey(key) {
  var token = keyMatchToken(key);
  return (
    token === "sourcenote" ||
    token === "sourceattribution" ||
    token === "attribution" ||
    token === "source"
  );
}

function renderSourceNoteHtml(value) {
  var shown = text(value);
  if (!shown) return "";
  return (
    '<p class="util-exposition-source-note"><small>' +
    html.renderMarkdownInline(shown) +
    "</small></p>"
  );
}

/**
 * Authored heading text stored under a generic "heading" key.
 * Publish the value as the heading; never display the word "Heading".
 */
function isPromotedHeadingKey(key) {
  return keyMatchToken(key) === "heading";
}

function authoredSectionTitle(obj) {
  if (!isPlainObject(obj)) return "";
  var heading = text(obj.heading);
  if (heading && !isMachineToken(heading) && !isInternalMaterialId(heading)) {
    return heading;
  }
  var title = text(obj.title);
  if (title && !isMachineToken(title) && !isInternalMaterialId(title)) {
    return title;
  }
  return "";
}

function omitPromotedTitleFields(obj, sectionTitle) {
  if (!isPlainObject(obj) || !sectionTitle) return obj;
  var next = null;
  Object.keys(obj).forEach(function (key) {
    var tok = keyMatchToken(key);
    if (tok !== "heading" && tok !== "title") return;
    if (text(obj[key]) !== sectionTitle) return;
    if (!next) next = Object.assign({}, obj);
    delete next[key];
  });
  return next || obj;
}

/**
 * Structured representation containers. Render the contents without the spec heading.
 */
function isUnlabeledStructureKey(key) {
  var token = keyMatchToken(key);
  return (
    token === "timelineelements" ||
    token === "timeline" ||
    token === "branches" ||
    token === "interpretiveannotations" ||
    token === "timeaxis" ||
    token === "panels" ||
    token === "panel" ||
    token === "representations" ||
    token === "alternatives" ||
    token === "cases" ||
    token === "series"
  );
}

function isTimeAxisObject(value) {
  if (!isPlainObject(value)) return false;
  var tokens = Object.keys(value).map(keyMatchToken);
  if (!tokens.length) return false;
  var known = tokens.every(function (token) {
    return (
      token === "label" ||
      token === "direction" ||
      token === "clarification" ||
      token === "note" ||
      token === "description"
    );
  });
  if (!known) return false;
  return tokens.some(function (token) {
    return token === "direction" || token === "clarification";
  });
}

function renderTimeAxisObject(value) {
  var label = text(value.label);
  var direction = text(value.direction);
  var clarification =
    text(value.clarification) || text(value.note) || text(value.description);
  var parts = [];
  if (label && direction) {
    parts.push("<p>" + html.escapeHtml(label + " (" + direction + ").") + "</p>");
  } else if (label || direction) {
    parts.push("<p>" + html.escapeHtml(label || direction) + "</p>");
  }
  if (clarification) parts.push(renderMarkdownOrPlain(clarification));
  return parts.join("");
}

/**
 * A named explanation step: label plus description, text, or role.
 * Position is ordering data, not learner copy.
 */
function isExplanationRecord(row) {
  if (!isPlainObject(row)) return false;
  var tokens = Object.keys(row).map(keyMatchToken);
  if (!tokens.length) return false;
  var hasName =
    tokens.indexOf("label") !== -1 ||
    tokens.indexOf("title") !== -1 ||
    tokens.indexOf("name") !== -1;
  var hasBody =
    tokens.indexOf("description") !== -1 ||
    tokens.indexOf("text") !== -1 ||
    tokens.indexOf("role") !== -1;
  if (!hasName || !hasBody) return false;
  return tokens.every(function (token) {
    return (
      token === "label" ||
      token === "title" ||
      token === "name" ||
      token === "description" ||
      token === "text" ||
      token === "role" ||
      token === "id" ||
      token === "position" ||
      token === "order"
    );
  });
}

function isMachineStepId(value) {
  var raw = text(value);
  if (!raw || /\s/.test(raw)) return false;
  if (isNodeIdToken(raw) || isMachineToken(raw) || isInternalMaterialId(raw)) return true;
  return /^[A-Za-z]{1,8}-?\d+$/.test(raw);
}

function renderExplanationItem(row) {
  var label = text(row.label) || text(row.title) || text(row.name);
  var description = text(row.description) || text(row.text);
  var role = text(row.role);
  if (!label || isMachineStepId(label)) label = "";
  if (!description && !label && !role) return "";
  var parts = "";
  if (label) {
    parts += "<p><strong>" + html.escapeHtml(label) + "</strong></p>";
  }
  if (description) parts += renderMarkdownOrPlain(description);
  if (role && role !== description && role !== label) {
    parts += renderMarkdownOrPlain(role);
  }
  return parts;
}

function renderExplanationList(rows) {
  var ordered = rows.slice();
  var hasPosition = ordered.some(function (row) {
    return row && (row.position != null || row.order != null);
  });
  if (hasPosition) {
    ordered.sort(function (a, b) {
      var ap = Number(a && a.position != null ? a.position : a && a.order);
      var bp = Number(b && b.position != null ? b.position : b && b.order);
      if (isNaN(ap) || isNaN(bp)) return 0;
      return ap - bp;
    });
  }
  var items = ordered
    .map(function (row) {
      var inner = renderExplanationItem(row);
      return inner ? "<li>" + inner + "</li>" : "";
    })
    .filter(Boolean)
    .join("");
  if (!items) return "";
  var tag = hasPosition ? "ol" : "ul";
  return (
    "<" +
    tag +
    ' class="util-exposition-explanation-list">' +
    items +
    "</" +
    tag +
    ">"
  );
}

function rowHeading(row) {
  var prefs = [
    "design",
    "studydesign",
    "label",
    "title",
    "name",
    "researchpurpose"
  ];
  var keys = Object.keys(row || {});
  var i;
  var j;
  for (i = 0; i < prefs.length; i++) {
    for (j = 0; j < keys.length; j++) {
      if (keyMatchToken(keys[j]) !== prefs[i]) continue;
      var value = row[keys[j]];
      if (value != null && typeof value === "object") continue;
      var shown = learnerFacingScalar(value);
      if (!shown) continue;
      return { key: keys[j], text: shown };
    }
  }
  return null;
}

function shouldRenderRowsAsSections(rows) {
  var keys = Object.keys(rows[0] || {}).filter(function (key) {
    return !isSchemaMechanicKey(key) && !isRepresentationOmissionKey(key);
  });
  if (keys.length > 6) return true;
  return rows.some(function (row) {
    return Object.keys(row).some(function (key) {
      if (
        isUnlabeledProseKey(key) ||
        isUnlabeledStructureKey(key) ||
        isRepresentationOmissionKey(key)
      ) {
        return true;
      }
      var value = row[key];
      return isPlainObject(value) || Array.isArray(value);
    });
  });
}

function renderComparisonSections(rows, renderCtx) {
  return rows
    .map(function (row) {
      var heading = rowHeading(row);
      var copy = {};
      Object.keys(row).forEach(function (key) {
        if (heading && key === heading.key) return;
        copy[key] = row[key];
      });
      var inner = renderStructuredValue(copy, 1, renderCtx);
      if (!heading && !inner) return "";
      if (!heading) return inner;
      return (
        '<section class="util-exposition-comparison-section">' +
        (heading ? "<h4>" + html.escapeHtml(heading.text) + "</h4>" : "") +
        inner +
        "</section>"
      );
    })
    .filter(Boolean)
    .join("");
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
    if (isTimeAxisObject(value)) {
      return [text(value.label), text(value.direction), text(value.clarification)]
        .filter(Boolean)
        .join(". ");
    }
    if (isExplanationRecord(value)) {
      var stepLabel = text(value.label) || text(value.title) || text(value.name);
      var stepBody = text(value.description) || text(value.text);
      var stepRole = text(value.role);
      if (isMachineStepId(stepLabel)) stepLabel = "";
      return [stepLabel, stepBody, stepRole].filter(Boolean).join(". ");
    }
    return Object.keys(value)
      .map(function (k) {
        if (isDisplayGuidanceKey(k) || isConnectionsKey(k)) return "";
        if (isRepresentationOmissionKey(k)) return "";
        var token = keyMatchToken(k);
        if (token === "position" || token === "order") return "";
        if (isDiagramIdentifierKey(k)) {
          if (isMachineIdentifierCell(value[k])) return "";
          return cellText(value[k]);
        }
        var inner = cellText(value[k]);
        if (!inner) return "";
        if (isUnlabeledProseKey(k) || isUnlabeledStructureKey(k)) return inner;
        return humanizeKey(k) + ": " + inner;
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

/**
 * Determine whether an Expository table is genuinely wide enough to warrant
 * breaking out past the 70ch reading column. Simple 2–3 column tables stay
 * within the reading column with responsive overflow-x fallback.
 */
function isWideExpositionTable(columns, rows) {
  var colCount = Array.isArray(columns) ? columns.length : 0;
  if (colCount >= 5) return true;
  if (colCount === 4) {
    var headerChars = columns.reduce(function (sum, col) {
      return sum + text(col).length;
    }, 0);
    if (headerChars > 100) return true;
    var maxRowChars = (Array.isArray(rows) ? rows : []).reduce(function (best, row) {
      var cells = Array.isArray(row)
        ? row
        : isPlainObject(row)
          ? Object.keys(row).map(function (k) {
              return row[k];
            })
          : [];
      var rowChars = cells.reduce(function (sum, cell) {
        return sum + cellText(cell).length;
      }, 0);
      return rowChars > best ? rowChars : best;
    }, 0);
    if (maxRowChars > 140) return true;
  }
  return false;
}

/** Overflow-safe host for Expository tables; breakout class only for genuinely wide tables. */
function wrapExpositionTableScroll(tableHtml, options) {
  var isWide = !!(options && options.wide);
  return (
    '<div class="util-table-scroll util-exposition-table-scroll' +
    (isWide ? " util-exposition-table-breakout" : "") +
    '">' +
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
  var accessibleText = text(material && material.accessibleText);
  if (accessibleText && accessibleText === caption) accessibleText = "";
  if (!title && !caption && !accessibleText) {
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
    (accessibleText
      ? '<p class="util-exposition-diagram-caption__text" data-field="accessible-description">' +
        html.escapeHtml(accessibleText) +
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

function expositionDataTableHtml(columns, rows, caption, options) {
  var opts = isPlainObject(options) ? options : {};
  var rowHeaderCol =
    typeof opts.rowHeaderColumn === "number" &&
    isFinite(opts.rowHeaderColumn) &&
    opts.rowHeaderColumn >= 0 &&
    opts.rowHeaderColumn < columns.length
      ? Math.floor(opts.rowHeaderColumn)
      : -1;
  var head =
    "<thead><tr>" +
    columns
      .map(function (col) {
        return '<th scope="col">' + html.escapeHtml(text(col)) + "</th>";
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
              if (i === rowHeaderCol) {
                return '<th scope="row">' + html.escapeHtml(cellText(cells[i])) + "</th>";
              }
              return "<td>" + html.escapeHtml(cellText(cells[i])) + "</td>";
            })
            .join("") +
          "</tr>"
        );
      })
      .join("") +
    "</tbody>";
  return wrapExpositionTableScroll(
    '<table class="util-exposition-structured-table">' +
      (caption ? "<caption>" + html.escapeHtml(caption) + "</caption>" : "") +
      head +
      body +
      "</table>",
    { wide: isWideExpositionTable(columns, rows) }
  );
}

function phraseKey(value) {
  return text(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function phraseOccurs(haystack, phrase) {
  var needle = phraseKey(phrase);
  if (!needle) return false;
  return (" " + phraseKey(haystack) + " ").indexOf(" " + needle + " ") !== -1;
}

/** A published table with headings and cell text is already an accessible representation. */
function tableHasAccessibleSemantics(columns, rows) {
  if (!Array.isArray(columns) || !columns.length || !Array.isArray(rows) || !rows.length) {
    return false;
  }
  if (
    !columns.some(function (column) {
      return !!text(column);
    })
  ) {
    return false;
  }
  return rows.some(function (row) {
    var cells = Array.isArray(row) ? row : [];
    return cells.some(function (cell) {
      return !!cellText(cell);
    });
  });
}

/**
 * The accessible equivalent restates this table when most row labels appear in it.
 * A text that does not name those rows is additional information and stays visible.
 */
function accessibleTextRestatesTable(accessibleText, rows) {
  var labels = tableRowLabels(rows);
  if (!labels.length) return false;
  var matched = labels.filter(function (label) {
    return phraseOccurs(accessibleText, label);
  });
  return matched.length * 2 >= labels.length;
}

function tableRowLabels(rows) {
  var labels = [];
  (Array.isArray(rows) ? rows : []).forEach(function (row) {
    var cells = Array.isArray(row) ? row : [];
    if (!cells.length) return;
    var label = cellText(cells[0]);
    if (phraseKey(label).length >= 3) labels.push(label);
  });
  return labels;
}

function splitProseSentences(value) {
  var normalized = String(value || "").replace(/\s+/g, " ").trim();
  var sentences = [];
  var start = 0;
  var i;
  for (i = 0; i < normalized.length; i++) {
    var ch = normalized.charAt(i);
    if (ch !== "." && ch !== "!" && ch !== "?") continue;
    while (i + 1 < normalized.length && /[.!?]/.test(normalized.charAt(i + 1))) i += 1;
    var piece = normalized.slice(start, i + 1).trim();
    if (piece) sentences.push(piece);
    while (i + 1 < normalized.length && /\s/.test(normalized.charAt(i + 1))) i += 1;
    start = i + 1;
  }
  if (start < normalized.length) {
    var tail = normalized.slice(start).trim();
    if (tail) sentences.push(tail);
  }
  return sentences;
}

function contentWords(value) {
  return phraseKey(value)
    .split(" ")
    .filter(function (word) {
      return word.length > 3;
    });
}

function majorityWordsOverlap(sentence, cell) {
  var sentenceWords = contentWords(sentence);
  var cellWords = contentWords(cell);
  if (!sentenceWords.length || cellWords.length < 3) return false;
  var hit = cellWords.filter(function (word) {
    return sentenceWords.indexOf(word) !== -1;
  });
  return hit.length * 2 >= cellWords.length;
}

function sentenceCoveredByTable(sentence, rows) {
  var labels = tableRowLabels(rows);
  if (
    labels.some(function (label) {
      return phraseOccurs(sentence, label);
    })
  ) {
    return true;
  }
  var hay = phraseKey(sentence);
  if (hay.length < 5) return true;
  return (Array.isArray(rows) ? rows : []).some(function (row) {
    return (Array.isArray(row) ? row : []).some(function (cell) {
      var cellPhrase = text(cellText(cell));
      if (!cellPhrase) return false;
      if (phraseOccurs(sentence, cellPhrase) || phraseOccurs(cellPhrase, sentence)) {
        return phraseKey(cellPhrase).length >= 12;
      }
      return majorityWordsOverlap(sentence, cellPhrase);
    });
  });
}

/**
 * When a text equivalent mostly restates the table, keep only a trailing
 * interpretive coda — final sentences that neither name row labels nor repeat
 * cell wording already published in the table.
 */
function accessibleInterpretiveSurplus(accessibleText, rows) {
  var sentences = splitProseSentences(accessibleText);
  if (!sentences.length) return "";
  var kept = [];
  var i;
  for (i = sentences.length - 1; i >= 0; i--) {
    if (sentenceCoveredByTable(sentences[i], rows)) break;
    kept.unshift(sentences[i]);
  }
  return kept.join(" ").trim();
}

function accessibleAlternativeHtml(material, columns, rows) {
  var accessibleText = text(material && material.accessibleText);
  var caption = text(material && material.caption);
  if (!accessibleText || accessibleText === caption) return "";
  var failed = !!text(material && material.publicationFailure);
  if (
    !failed &&
    tableHasAccessibleSemantics(columns, rows) &&
    accessibleTextRestatesTable(accessibleText, rows)
  ) {
    accessibleText = accessibleInterpretiveSurplus(accessibleText, rows);
    if (!accessibleText || accessibleText === caption) return "";
  }
  return (
    '<div data-field="accessible-description">' + renderMarkdownOrPlain(accessibleText) + "</div>"
  );
}

function isLeadingCompanionProseKey(key) {
  var token = keyMatchToken(key);
  return (
    token === "context" ||
    token === "introduction" ||
    token === "intro" ||
    token === "preamble" ||
    token === "opening"
  );
}

function renderTable(material) {
  var title = text(material && material.title);
  var caption = text(material && material.caption);
  var columns = Array.isArray(material && material.columns) ? material.columns : [];
  var rows = Array.isArray(material && material.rows) ? material.rows : [];
  var companionParts = splitCompanionProse(material && material.companion, title, caption);
  var beforeHtml = renderCompanionProse(companionParts.before, title, caption);
  var afterHtml = renderCompanionProse(companionParts.after, title, caption);
  var sourceNoteHtml = (companionParts.sourceNotes || [])
    .map(renderSourceNoteHtml)
    .filter(Boolean)
    .join("");
  var accessibleHtml = accessibleAlternativeHtml(material, columns, rows);
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
      beforeHtml +
      afterHtml +
      sourceNoteHtml +
      accessibleHtml +
      "</article>"
    );
  }
  return (
    materialShellOpen(material, "table") +
    (title ? "<h3>" + html.escapeHtml(title) + "</h3>" : "") +
    beforeHtml +
    expositionDataTableHtml(columns, rows, caption, {
      rowHeaderColumn: material && material.rowHeaderColumn
    }) +
    afterHtml +
    sourceNoteHtml +
    accessibleHtml +
    "</article>"
  );
}

function isDuplicateEditorialText(candidate, reference) {
  var a = phraseKey(candidate);
  var b = phraseKey(reference);
  return !!(a && b && a === b);
}

function splitCompanionProse(companion, title, caption) {
  var before = {};
  var after = {};
  var sourceNotes = [];
  if (!isPlainObject(companion)) {
    return { before: before, after: after, sourceNotes: sourceNotes };
  }
  Object.keys(companion).forEach(function (key) {
    var val = companion[key];
    if (keyMatchToken(key) === "title" && title && isDuplicateEditorialText(val, title)) return;
    if (keyMatchToken(key) === "caption") return;
    if (isAccessibleAlternativeKey(key)) return;
    if (isTableInterpretationSupportKey(key)) return;
    if (isRepresentationOmissionKey(key)) return;
    if (typeof val === "string" && caption && isDuplicateEditorialText(val, caption)) return;
    if (isSourceNoteKey(key)) {
      var noteText = text(val);
      if (noteText) sourceNotes.push(noteText);
      return;
    }
    if (isLeadingCompanionProseKey(key)) before[key] = val;
    else after[key] = val;
  });
  return { before: before, after: after, sourceNotes: sourceNotes };
}

function renderCompanionProse(companion, title, caption) {
  if (!isPlainObject(companion)) return "";
  var copy = {};
  Object.keys(companion).forEach(function (key) {
    var val = companion[key];
    if (keyMatchToken(key) === "title" && title && isDuplicateEditorialText(val, title)) return;
    if (keyMatchToken(key) === "caption") return;
    if (isAccessibleAlternativeKey(key)) return;
    if (isTableInterpretationSupportKey(key)) return;
    if (isRepresentationOmissionKey(key)) return;
    if (isSourceNoteKey(key)) return;
    if (typeof val === "string" && caption && isDuplicateEditorialText(val, caption)) return;
    copy[key] = val;
  });
  if (!Object.keys(copy).length) return "";
  return renderStructuredValue(copy, 0);
}

/**
 * Graph-like bodies: learner-facing concept list + readable relationships.
 * Preserves edge meaning; does not expose Nodes/Edges/From/To/Id schema chrome.
 */
function renderGraph(material, context) {
  var title = text(material && material.title);
  var caption = text(material && material.caption);
  var proseHtml = renderStructuredValue(material && material.prose, 0);
  var figurePresent = sectionHasFinishedFigure(
    context && context.section,
    context && context.visualOptions,
    material
  );
  var hideStructure = !!(figurePresent && material && material.suppressStructureWhenFigured);
  var nodes = hideStructure
    ? []
    : Array.isArray(material && material.nodes)
      ? material.nodes
      : [];
  var edges = hideStructure
    ? []
    : Array.isArray(material && material.edges)
      ? material.edges
      : [];
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
    proseHtml +
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
  var columns = Array.isArray(material && material.columns) ? material.columns : [];
  var rows = Array.isArray(material && material.rows) ? material.rows : [];
  var tableCaption = text(material && material.tableCaption);
  var tableHtml = "";
  if (text(material && material.publicationFailure)) {
    tableHtml =
      '<p class="util-support-note" data-publication-failure="' +
      html.escapeAttribute(text(material.publicationFailure)) +
      '">This table cannot be published because a column has no faithful heading.</p>';
  } else if (columns.length && rows.length) {
    tableHtml = expositionDataTableHtml(columns, rows, tableCaption);
  }
  return (
    materialShellOpen(material, "equation") +
    (title ? "<h3>" + html.escapeHtml(title) + "</h3>" : "") +
    (equation
      ? '<p class="util-exposition-equation" data-field="equation"><code>' +
        html.escapeHtml(equation) +
        "</code></p>"
      : "") +
    (annHtml ? '<ul data-field="annotations">' + annHtml + "</ul>" : "") +
    tableHtml +
    (caption && caption !== tableCaption
      ? '<p data-field="caption">' + html.escapeHtml(caption) + "</p>"
      : "") +
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
    if (isOmittedSchemaScalarKey(k)) return false;
    if (isRepresentationOmissionKey(k) || isUnlabeledStructureKey(k)) return false;
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
  if (isMachineIdentifierCell(from)) from = "";
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
  if (isMachineIdentifierCell(to)) to = "";
  var fromRaw = value.from != null ? value.from : value.source;
  var toRaw = value.to != null ? value.to : value.target;
  if (
    (fromRaw != null && fromRaw !== "" && isMachineIdentifierCell(fromRaw)) ||
    (toRaw != null && toRaw !== "" && isMachineIdentifierCell(toRaw))
  ) {
    from = "";
    to = "";
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
      "</tbody></table>",
    {
      wide: isWideExpositionTable(
        (rowLabelKey ? [rowLabelKey] : []).concat(cols),
        rows
      )
    }
  );
}

function isDirectScatterplotSpec(value) {
  if (!isPlainObject(value)) return false;
  if (!isPlainObject(value.x_axis) && !isPlainObject(value.y_axis)) return false;
  var extracted = extractScatterplotSpec(value);
  return !!(extracted && extracted.spec === value && extracted.observations.length >= 2);
}

function bodyContainsNestedScatterplotSpec(value, depth) {
  var d = typeof depth === "number" ? depth : 0;
  if (d > 4 || !value || typeof value !== "object") return false;
  if (Array.isArray(value)) {
    return value.some(function (item) {
      return bodyContainsNestedScatterplotSpec(item, d + 1);
    });
  }
  if (isDirectScatterplotSpec(value)) return true;
  return Object.keys(value).some(function (k) {
    return bodyContainsNestedScatterplotSpec(value[k], d + 1);
  });
}

function resolveTableRowHeaderColumn(tableObj) {
  if (!isPlainObject(tableObj)) return null;
  if (isPlainObject(tableObj.accessibility)) {
    var accIdx =
      typeof tableObj.accessibility.row_header_column === "number"
        ? tableObj.accessibility.row_header_column
        : tableObj.accessibility.row_header_column_index;
    if (typeof accIdx === "number" && isFinite(accIdx)) {
      return Math.floor(accIdx);
    }
  }
  var directIdx =
    typeof tableObj.row_header_column === "number"
      ? tableObj.row_header_column
      : tableObj.row_header_column_index;
  if (typeof directIdx === "number" && isFinite(directIdx)) {
    return Math.floor(directIdx);
  }
  return null;
}

function renderInlineStructuredTable(tableObj, depth, renderCtx) {
  var parsed = tabularColumnsAndRows(tableObj);
  if (!parsed || parsed.publicationFailure || !parsed.columns.length) return "";
  var caption = text(tableObj.caption) || text(tableObj.title);
  var rowHeaderCol = resolveTableRowHeaderColumn(tableObj);
  var tableHtml = expositionDataTableHtml(parsed.columns, parsed.rows, caption, {
    rowHeaderColumn: rowHeaderCol
  });
  var navText = text(tableObj.navigation_text);
  var navHtml = navText
    ? '<p class="util-table-navigation-note">' + html.renderMarkdownInline(navText) + "</p>"
    : "";
  var extra = {};
  var hasExtra = false;
  Object.keys(tableObj).forEach(function (k) {
    var tok = keyMatchToken(k);
    if (
      tok === "columns" ||
      tok === "rows" ||
      tok === "caption" ||
      tok === "title" ||
      tok === "rowheadercolumn" ||
      tok === "rowheadercolumnindex" ||
      tok === "numericalsummaryreference" ||
      tok === "accessibility" ||
      tok === "navigationtext" ||
      isOmittedSchemaScalarKey(k)
    ) {
      return;
    }
    extra[k] = tableObj[k];
    hasExtra = true;
  });
  var extraHtml = hasExtra ? renderStructuredValue(extra, depth + 1, renderCtx) : "";
  return tableHtml + navHtml + extraHtml;
}

function isCrossReferenceKey(key) {
  var tok = keyMatchToken(key);
  return (
    tok === "scatterplotreference" ||
    tok === "accessibletablereference" ||
    tok === "tablereference" ||
    tok === "figurereference" ||
    tok === "materialreference"
  );
}

/**
 * Array of panel/dataset cross-reference bindings (every item carries an
 * internal *_reference pointer such as M01.body.scatterplot). This is structural
 * wiring metadata rather than a standalone learner comparison table.
 */
function isCrossReferenceManifestArray(arr) {
  if (!Array.isArray(arr) || !arr.length || !arr.every(isPlainObject)) return false;
  return arr.every(function (item) {
    return Object.keys(item).some(isCrossReferenceKey);
  });
}

function renderCrossReferenceManifestProse(arr, depth, renderCtx) {
  var proseBlocks = [];
  arr.forEach(function (item) {
    var extra = {};
    var hasProse = false;
    Object.keys(item).forEach(function (k) {
      var tok = keyMatchToken(k);
      if (
        isCrossReferenceKey(k) ||
        isOmittedSchemaScalarKey(k) ||
        tok === "title" ||
        tok === "label" ||
        tok === "name" ||
        tok === "coefficient" ||
        tok === "coefficientdisplay" ||
        tok === "display"
      ) {
        return;
      }
      if (typeof item[k] === "string" && text(item[k])) {
        extra[k] = item[k];
        hasProse = true;
      }
    });
    if (hasProse) {
      var rendered = renderStructuredValue(extra, depth + 1, renderCtx);
      if (rendered) proseBlocks.push(rendered);
    }
  });
  return proseBlocks.join("");
}

function isPrimitiveArray(value) {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    value.every(function (item) {
      return (
        typeof item === "string" ||
        typeof item === "number" ||
        typeof item === "boolean"
      );
    })
  );
}

/**
 * Plain object pairing a numeric/scalar metric with a formatted display string
 * (e.g. { coefficient: -0.94, display: "r = -0.94", summary: "..." }).
 */
function isFormattedMetricObject(obj) {
  if (!isPlainObject(obj)) return false;
  var keys = Object.keys(obj);
  if (keys.length < 2) return false;
  var hasNested = keys.some(function (k) {
    return isPlainObject(obj[k]) || Array.isArray(obj[k]);
  });
  if (hasNested) return false;
  var displayKey = keys.find(function (k) {
    var tok = keyMatchToken(k);
    return tok === "display" || /display$/.test(tok);
  });
  if (!displayKey || typeof obj[displayKey] !== "string" || !text(obj[displayKey])) {
    return false;
  }
  var metricKey = keys.find(function (k) {
    if (k === displayKey) return false;
    var tok = keyMatchToken(k);
    return (
      tok === "coefficient" ||
      tok === "value" ||
      tok === "statistic" ||
      tok === "correlation" ||
      tok === "score" ||
      tok === "estimate" ||
      tok === "result" ||
      tok === "metric"
    );
  });
  return !!(metricKey && (typeof obj[metricKey] === "number" || typeof obj[metricKey] === "string"));
}

function renderFormattedMetricObject(obj, depth, renderCtx) {
  var keys = Object.keys(obj);
  var displayKey = keys.find(function (k) {
    var tok = keyMatchToken(k);
    return tok === "display" || /display$/.test(tok);
  });
  var displayText = displayKey ? text(obj[displayKey]) : "";
  var out = displayText
    ? '<p class="util-exposition-metric"><strong>' + html.escapeHtml(displayText) + "</strong></p>"
    : "";
  var rest = {};
  var hasRest = false;
  keys.forEach(function (k) {
    var tok = keyMatchToken(k);
    if (
      k === displayKey ||
      tok === "coefficient" ||
      tok === "value" ||
      tok === "statistic" ||
      tok === "correlation" ||
      tok === "score" ||
      tok === "estimate" ||
      tok === "result" ||
      tok === "metric" ||
      isOmittedSchemaScalarKey(k)
    ) {
      return;
    }
    rest[k] = obj[k];
    hasRest = true;
  });
  if (hasRest) {
    out += renderStructuredValue(rest, depth + 1, renderCtx);
  }
  return out;
}

function isDifferenceArrayKey(key) {
  var tok = keyMatchToken(key);
  return (
    tok.indexOf("diff") !== -1 ||
    tok.indexOf("change") !== -1 ||
    tok.indexOf("delta") !== -1
  );
}

function isIdColumnArrayKey(key) {
  var tok = keyMatchToken(key);
  return tok === "ids" || tok === "id" || /ids?$/.test(tok);
}

function columnarArrayHeading(key, meta) {
  var tok = keyMatchToken(key);
  if (isIdColumnArrayKey(key)) {
    var stem = String(key || "")
      .replace(/[_\s-]*ids?$/i, "")
      .trim();
    return stem ? humanizeKey(stem) : "Observation";
  }
  if (tok === "orderedvalues" || tok === "values") {
    return (meta && meta.verticalVariable) || "Value";
  }
  if (isDifferenceArrayKey(key)) {
    return meta && meta.differenceUnit
      ? "Change to next (" + meta.differenceUnit + ")"
      : "Change to next";
  }
  if (tok === "relativeverticalpositions") {
    return "Relative vertical position";
  }
  return humanizeKey(key);
}

/**
 * Column-oriented numeric series object: ≥2 primitive arrays of equal length N
 * (e.g. observation_ids[] + relative_vertical_positions[]), OR ordered values[N]
 * paired with successive differences[N - 1]. Renders as a semantic HTML table.
 */
function isColumnarSeriesObject(obj) {
  if (!isPlainObject(obj)) return false;
  var keys = Object.keys(obj);
  var arrayKeys = [];
  for (var i = 0; i < keys.length; i += 1) {
    var v = obj[keys[i]];
    if (isPlainObject(v)) return false;
    if (Array.isArray(v)) {
      if (!isPrimitiveArray(v)) return false;
      arrayKeys.push(keys[i]);
    }
  }
  if (arrayKeys.length < 2) return false;
  var firstLen = obj[arrayKeys[0]].length;
  var allEqual = arrayKeys.every(function (k) {
    return obj[k].length === firstLen;
  });
  if (allEqual) return true;
  if (arrayKeys.length === 2) {
    var aLen = obj[arrayKeys[0]].length;
    var bLen = obj[arrayKeys[1]].length;
    if (aLen === bLen + 1 && isDifferenceArrayKey(arrayKeys[1])) return true;
    if (bLen === aLen + 1 && isDifferenceArrayKey(arrayKeys[0])) return true;
  }
  return false;
}

function renderColumnarSeriesObject(obj, depth, renderCtx) {
  var keys = Object.keys(obj);
  var arrayKeys = keys.filter(function (k) {
    return isPrimitiveArray(obj[k]);
  });
  var meta = {
    title: text(obj.title) || text(obj.caption),
    horizontalVariable: text(obj.horizontal_variable),
    horizontalStep: text(obj.horizontal_step),
    verticalVariable: text(obj.vertical_variable),
    differenceUnit: text(obj.difference_unit) || text(obj.unit)
  };
  var columns = [];
  var rows = [];
  var rowHeaderColumn = -1;
  var firstLen = obj[arrayKeys[0]].length;
  var allEqual = arrayKeys.every(function (k) {
    return obj[k].length === firstLen;
  });
  if (allEqual) {
    // Place any identifier column first so each observation is a row header.
    var orderedKeys = arrayKeys.slice().sort(function (a, b) {
      var aId = isIdColumnArrayKey(a) ? 0 : 1;
      var bId = isIdColumnArrayKey(b) ? 0 : 1;
      return aId - bId;
    });
    if (isIdColumnArrayKey(orderedKeys[0])) rowHeaderColumn = 0;
    columns = orderedKeys.map(function (k) {
      return columnarArrayHeading(k, meta);
    });
    for (var r = 0; r < firstLen; r += 1) {
      rows.push(
        orderedKeys.map(function (k) {
          return obj[k][r];
        })
      );
    }
  } else {
    var valuesKey = obj[arrayKeys[0]].length > obj[arrayKeys[1]].length ? arrayKeys[0] : arrayKeys[1];
    var diffKey = valuesKey === arrayKeys[0] ? arrayKeys[1] : arrayKeys[0];
    var vals = obj[valuesKey];
    var diffs = obj[diffKey];
    rowHeaderColumn = 0;
    columns = [
      "Step",
      columnarArrayHeading(valuesKey, meta),
      columnarArrayHeading(diffKey, meta)
    ];
    for (var idx = 0; idx < vals.length; idx += 1) {
      rows.push([
        String(idx + 1),
        vals[idx],
        idx < diffs.length ? diffs[idx] : "—"
      ]);
    }
  }
  var contextHtml = "";
  if (meta.horizontalVariable && meta.horizontalStep) {
    contextHtml =
      '<p class="util-exposition-series-context">Ordered along ' +
      html.escapeHtml(meta.horizontalVariable) +
      " in steps of " +
      html.escapeHtml(meta.horizontalStep) +
      ".</p>";
  } else if (meta.horizontalVariable) {
    contextHtml =
      '<p class="util-exposition-series-context">Ordered along ' +
      html.escapeHtml(meta.horizontalVariable) +
      ".</p>";
  }
  var tableHtml = expositionDataTableHtml(columns, rows, meta.title, {
    rowHeaderColumn: rowHeaderColumn >= 0 ? rowHeaderColumn : null
  });
  var rest = {};
  var hasRest = false;
  keys.forEach(function (k) {
    var tok = keyMatchToken(k);
    if (
      arrayKeys.indexOf(k) !== -1 ||
      tok === "title" ||
      tok === "caption" ||
      tok === "horizontalvariable" ||
      tok === "horizontalstep" ||
      tok === "verticalvariable" ||
      tok === "differenceunit" ||
      tok === "unit" ||
      isOmittedSchemaScalarKey(k)
    ) {
      return;
    }
    rest[k] = obj[k];
    hasRest = true;
  });
  var restHtml = hasRest ? renderStructuredValue(rest, depth + 1, renderCtx) : "";
  return contextHtml + tableHtml + restHtml;
}

/**
 * Compact unit-labelled 1D value sequence (e.g. { unit: "£ per household", values: [3400, 3000, ...] }).
 */
function isUnitValueSequenceObject(obj) {
  if (!isPlainObject(obj) || !isPrimitiveArray(obj.values)) return false;
  var keys = Object.keys(obj);
  return keys.every(function (k) {
    var tok = keyMatchToken(k);
    if (tok === "values") return true;
    if (isPlainObject(obj[k]) || Array.isArray(obj[k])) return false;
    return (
      tok === "unit" ||
      tok === "title" ||
      tok === "caption" ||
      tok === "note" ||
      tok === "qualification" ||
      tok === "summary" ||
      tok === "description" ||
      isOmittedSchemaScalarKey(k)
    );
  });
}

function renderUnitValueSequenceObject(obj, depth, renderCtx) {
  var unitText = text(obj.unit);
  var formatted = obj.values
    .map(function (v) {
      return text(v);
    })
    .filter(Boolean)
    .join(", ");
  if (!formatted) return "";
  var out =
    '<p class="util-exposition-value-sequence">' +
    html.escapeHtml(formatted) +
    (unitText ? " (" + html.escapeHtml(unitText) + ")" : "") +
    "</p>";
  var rest = {};
  var hasRest = false;
  Object.keys(obj).forEach(function (k) {
    var tok = keyMatchToken(k);
    if (tok === "values" || tok === "unit" || tok === "title" || tok === "caption" || isOmittedSchemaScalarKey(k)) {
      return;
    }
    rest[k] = obj[k];
    hasRest = true;
  });
  if (hasRest) {
    out += renderStructuredValue(rest, depth + 1, renderCtx);
  }
  return out;
}

function isRedundantTableContainerKey(key) {
  var tok = keyMatchToken(key);
  return (
    tok === "accessibletable" ||
    tok === "datatable" ||
    tok === "table" ||
    tok === "comparisontable"
  );
}

/**
 * Generic semantic rendering of arbitrary valid structured content.
 * Restrained HTML: p / ul / ol / dl / table / inline SVG scatterplots / nested lists. No JSON dump.
 * Schema-mechanic keys are not shown as learner headings; their values still render unless internal.
 */
function renderStructuredValue(value, depth, renderCtx) {
  var ctx =
    renderCtx && typeof renderCtx === "object"
      ? renderCtx
      : { materialId: "structured", plotIndex: 0, sectionTitle: "" };
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
    // Cross-reference panel manifests (scatterplot_reference / accessible_table_reference)
    // are structural wiring metadata, not standalone learner tables or lists.
    if (isCrossReferenceManifestArray(value)) {
      return renderCrossReferenceManifestProse(value, depth, ctx);
    }
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
    if (value.length >= 1 && value.every(isExplanationRecord)) {
      return renderExplanationList(value);
    }
    if (value.length >= 1 && value.every(isColumnarSeriesObject)) {
      return renderComparisonSections(value, ctx);
    }
    // Parallel objects → readable sections when the row is a representation
    // spec or too wide; otherwise one selective table.
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
      // Column schema is binding metadata, not a learner table.
      if (isColumnDefinitionList(value)) return "";
      if (shouldRenderRowsAsSections(value)) return renderComparisonSections(value, ctx);
      return renderParallelObjectTable(value);
    }
    return (
      "<ul>" +
      value
        .map(function (item) {
          var inner = renderStructuredValue(item, depth + 1, ctx);
          return inner ? "<li>" + inner + "</li>" : "";
        })
        .filter(Boolean)
        .join("") +
      "</ul>"
    );
  }
  if (isPlainObject(value)) {
    // Nested structured scatterplot specification → deterministic inline SVG figure.
    if (isDirectScatterplotSpec(value)) {
      ctx.plotIndex = (Number(ctx.plotIndex) || 0) + 1;
      var plotId =
        String(ctx.materialId || "scatterplot") +
        (ctx.plotIndex > 1 ? "-plot-" + String(ctx.plotIndex) : "");
      var inlinePlotModel = buildScatterplotModelFromSpec(value, {
        id: plotId,
        fallbackTitle: text(value.title) || text(ctx.sectionTitle) || "Scatterplot"
      });
      if (inlinePlotModel) {
        return renderScatterplotEvidence(inlinePlotModel);
      }
    }
    // Nested tabular object (columns[] + rows[]) → semantic HTML data table.
    if (isTabularBody(value)) {
      var inlineTableHtml = renderInlineStructuredTable(value, depth, ctx);
      if (inlineTableHtml) return inlineTableHtml;
    }
    // Column-oriented numeric series (parallel arrays or ordered values + successive differences) → semantic HTML table.
    if (isColumnarSeriesObject(value)) {
      var seriesTableHtml = renderColumnarSeriesObject(value, depth, ctx);
      if (seriesTableHtml) return seriesTableHtml;
    }
    // Unit-labelled 1D value sequence → concise inline sequence without Unit/Values schema chrome.
    if (isUnitValueSequenceObject(value)) {
      var seqHtml = renderUnitValueSequenceObject(value, depth, ctx);
      if (seqHtml) return seqHtml;
    }
    // Formatted metric object (numeric statistic paired with formatted display string) → display metric + prose.
    if (isFormattedMetricObject(value)) {
      var metricHtml = renderFormattedMetricObject(value, depth, ctx);
      if (metricHtml) return metricHtml;
    }
    if (isTimeAxisObject(value)) {
      return renderTimeAxisObject(value);
    }
    if (objectHasRelationshipShape(value)) {
      return renderRelationshipObject(value);
    }
    if (isExplanationRecord(value)) {
      return renderExplanationItem(value);
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
      var parts = [];
      var definitionOpen = false;
      function closeDefinitions() {
        if (!definitionOpen) return;
        parts.push("</dl>");
        definitionOpen = false;
      }
      function openDefinitions() {
        if (definitionOpen) return;
        parts.push("<dl>");
        definitionOpen = true;
      }
      keys.forEach(function (k) {
        var v = value[k];
        if (v == null || (typeof v === "string" && !text(v))) return;
        var tok = keyMatchToken(k);
        if (isDisplayGuidanceKey(k) || isConnectionsKey(k)) return;
        if (isRepresentationOmissionKey(k)) return;
        if (isDiagramIdentifierKey(k)) {
          if (isMachineIdentifierCell(v)) return;
          openDefinitions();
          parts.push("<div><dd>" + html.escapeHtml(text(v)) + "</dd></div>");
          return;
        }
        if ((tok === "id" || tok === "ids") && hasLabelField) return;
        if (isSchemaMechanicKey(k) && tok !== "label") return;
        if (isInternalMaterialId(v) || (typeof v === "string" && isMachineToken(v))) {
          return;
        }
        var shown = typeof v === "string" ? learnerFacingScalar(v) || text(v) : text(v);
        if (!shown) return;
        if (isPromotedHeadingKey(k)) {
          closeDefinitions();
          parts.push("<h4>" + html.escapeHtml(shown) + "</h4>");
          return;
        }
        if (isSourceNoteKey(k)) {
          closeDefinitions();
          parts.push(renderSourceNoteHtml(shown));
          return;
        }
        if (isUnlabeledProseKey(k)) {
          closeDefinitions();
          parts.push(renderMarkdownOrPlain(shown));
          return;
        }
        openDefinitions();
        parts.push(
          "<div><dt>" +
            html.escapeHtml(humanizeKey(k)) +
            "</dt><dd>" +
            html.escapeHtml(shown) +
            "</dd></div>"
        );
      });
      closeDefinitions();
      return parts.join("");
    }
    var parentSectionTitle = authoredSectionTitle(value) || ctx.sectionTitle;
    return keys
      .map(function (k) {
        var child = value[k];
        // Nested object/array: omit schema-mechanic headings; keep intellectual ones.
        if (isPlainObject(child) || Array.isArray(child)) {
          if (isDisplayGuidanceKey(k) || isRepresentationOmissionKey(k)) return "";
          // Direct nested scatterplot object renders natively as an SVG figure without a "Scatterplot" chrome heading.
          if (isDirectScatterplotSpec(child)) {
            var plotCtx = {
              materialId: ctx.materialId,
              plotIndex: ctx.plotIndex,
              sectionTitle: parentSectionTitle
            };
            var plotOut = renderStructuredValue(child, depth + 1, plotCtx);
            ctx.plotIndex = plotCtx.plotIndex;
            return plotOut;
          }
          // Captioned tables render natively without redundant schema-key container headings.
          if (
            isTabularBody(child) &&
            (isRedundantTableContainerKey(k) || !authoredSectionTitle(child)) &&
            (text(child.caption) || text(child.title))
          ) {
            return renderStructuredValue(child, depth + 1, ctx);
          }
          if (
            isConnectionsKey(k) ||
            isSchemaMechanicKey(k) ||
            isUnlabeledStructureKey(k)
          ) {
            return renderStructuredValue(child, depth + 1, ctx);
          }
          var sectionTitle = authoredSectionTitle(child) || humanizeKey(k);
          var sectionBody = isPlainObject(child)
            ? omitPromotedTitleFields(child, sectionTitle)
            : child;
          var childCtx = {
            materialId: ctx.materialId,
            plotIndex: ctx.plotIndex,
            sectionTitle: sectionTitle || parentSectionTitle
          };
          var inner = renderStructuredValue(sectionBody, depth + 1, childCtx);
          ctx.plotIndex = childCtx.plotIndex;
          if (!inner) return "";
          return (
            "<section>" +
            "<h4>" +
            html.escapeHtml(sectionTitle) +
            "</h4>" +
            inner +
            "</section>"
          );
        }
        if (isOmittedSchemaScalarKey(k)) return "";
        if (isPlainObject(child) && isNumericalSummaryObject(child)) {
          var summaryDisplay = formatNumericalSummaryDisplay(child);
          return summaryDisplay
            ? '<p class="util-numerical-summary">' + html.renderMarkdownInline(summaryDisplay) + "</p>"
            : "";
        }
        var innerScalar = renderStructuredValue(child, depth + 1, ctx);
        if (!innerScalar) return "";
        if (isDisplayGuidanceKey(k) || isConnectionsKey(k)) return "";
        if (isRepresentationOmissionKey(k)) return "";
        if (isPromotedHeadingKey(k)) {
          var headingText =
            typeof child === "string" || typeof child === "number"
              ? text(child)
              : "";
          return headingText ? "<h4>" + html.escapeHtml(headingText) + "</h4>" : "";
        }
        if (isSourceNoteKey(k)) return renderSourceNoteHtml(child);
        if (isUnlabeledProseKey(k)) return innerScalar;
        if (isDiagramIdentifierKey(k)) {
          if (isMachineIdentifierCell(child)) return "";
          return innerScalar;
        }
        if (isSchemaMechanicKey(k)) return innerScalar;
        return (
          "<div><p><strong>" +
          html.escapeHtml(humanizeKey(k)) +
          "</strong></p>" +
          innerScalar +
          "</div>"
        );
      })
      .filter(Boolean)
      .join("");
  }
  return "<p>" + html.escapeHtml(text(value)) + "</p>";
}

function renderStructuredFallback(material, context) {
  var title = text(material && material.title);
  var body = material && material.body;
  if (
    isPlainObject(body) &&
    !bodyContainsNestedScatterplotSpec(body, 0) &&
    sectionHasFinishedFigure(context && context.section, context && context.visualOptions, material)
  ) {
    return (
      withArticleAttributes(materialShellOpen(material, "fallback", "util-exposition-structured-fallback"), {
        "data-representation-spec-suppressed": "section-figure"
      }) +
      (title ? "<h3>" + html.escapeHtml(title) + "</h3>" : "") +
      renderLearnerDescriptionFields(body, title) +
      "</article>"
    );
  }
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
  var renderCtx = {
    materialId: text(material && material.id) || "structured",
    plotIndex: 0,
    sectionTitle: title
  };
  var content = renderStructuredValue(body, 0, renderCtx);
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
    renderCtx.plotIndex = 0;
    content = renderStructuredValue(bodyWithoutTitle, 0, renderCtx) || content;
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

function hookHasExplicitMaterialLink(hook) {
  if (!hook || typeof hook !== "object") return false;
  if (text(hook.materialId || hook.material_id) || text(hook.commissionId || hook.commission_id)) {
    return true;
  }
  var anchors = Array.isArray(hook.evidenceAnchors)
    ? hook.evidenceAnchors
    : Array.isArray(hook.evidence_anchors)
      ? hook.evidence_anchors
      : [];
  for (var i = 0; i < anchors.length; i += 1) {
    if (/\.materials\.[^.\s]+$/i.test(text(anchors[i]))) return true;
  }
  var basis = text(hook.sourceBasis || hook.source_basis);
  if (basis && /\.materials\.[^.;,\s]+/i.test(basis)) return true;
  return false;
}

function hookResolvesFinishedImage(hook, resolver) {
  if (!hook || !text(hook.slot) || typeof resolver !== "function") return false;
  var asset = resolver(hook);
  var src = asset && asset.render_source ? text(asset.render_source.value) : "";
  return !!src;
}

/**
 * A finished section figure is an attached image with a renderable source.
 * A diagram specification, including layout, is not itself that figure.
 * When sectionVisualAffordances carry explicit material links, match strictly
 * to the material's own linked affordance(s) so an attached figure on one
 * material never suppresses an unfulfilled illustration on another material.
 */
function sectionHasFinishedFigure(section, visualOptions, material) {
  var resolver = visualOptions && visualOptions.resolveVisualAsset;
  if (typeof resolver !== "function") return false;
  var hooks =
    section && Array.isArray(section.sectionVisualAffordances)
      ? section.sectionVisualAffordances
      : [];
  if (hooks.length && material && typeof material === "object") {
    var linked = materialAnchors.findExplicitlyLinkedVisualAffordances(
      section.id,
      material,
      hooks
    );
    if (linked.length) {
      return linked.some(function (h) {
        return hookResolvesFinishedImage(h, resolver);
      });
    }
    if (hooks.every(hookHasExplicitMaterialLink)) {
      return false;
    }
  }
  var hook = section && section.visualAffordanceAfterContent;
  return hookResolvesFinishedImage(hook, resolver);
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
    context && context.visualOptions,
    material
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
 * Commissioned illustration that has not been rendered.
 * Publish the accessible alternative. Do not publish construction headings.
 * A finished section figure replaces this specification.
 */
function renderUnfulfilledIllustration(material, context) {
  var title = text(material && material.title);
  var caption = text(material && material.caption);
  var accessible = text(material && material.accessibleText);
  if (isProductionInstructionProse(caption)) caption = "";
  if (isProductionInstructionProse(accessible)) accessible = "";
  var prose = "";
  if (caption) prose += renderMarkdownOrPlain(caption);
  if (accessible && accessible !== caption) prose += renderMarkdownOrPlain(accessible);
  var figurePresent = sectionHasFinishedFigure(
    context && context.section,
    context && context.visualOptions,
    material
  );
  if (figurePresent) {
    return (
      withArticleAttributes(
        materialShellOpen(material, "unfulfilled_illustration"),
        { "data-representation-spec-suppressed": "section-figure" }
      ) +
      (title ? "<h3>" + html.escapeHtml(title) + "</h3>" : "") +
      prose +
      "</article>"
    );
  }
  return (
    withArticleAttributes(materialShellOpen(material, "unfulfilled_illustration"), {
      "data-illustration-status": "unfulfilled"
    }) +
    (title ? "<h3>" + html.escapeHtml(title) + "</h3>" : "") +
    '<p class="util-support-note" data-illustration-status="unfulfilled">The commissioned illustration is not yet available. The description below is its accessible alternative.</p>' +
    prose +
    "</article>"
  );
}

/**
 * @param {Object} material
 * @param {{ section?: Object, visualOptions?: Object }=} context
 * @returns {string|null} HTML, or null when caller should use ordinary renderMaterial
 */
function extractScatterplotSpec(body) {
  if (!isPlainObject(body)) return null;
  var spec = isPlainObject(body.scatterplot) ? body.scatterplot : body;
  var rawObs = Array.isArray(spec.observations)
    ? spec.observations
    : Array.isArray(spec.points)
      ? spec.points
      : null;
  if (!rawObs && Array.isArray(spec.series) && spec.series.length) {
    var collected = [];
    spec.series.forEach(function (entry) {
      if (!isPlainObject(entry)) return;
      var pts = Array.isArray(entry.points)
        ? entry.points
        : Array.isArray(entry.observations)
          ? entry.observations
          : null;
      if (!pts) return;
      pts.forEach(function (pt) {
        collected.push(pt);
      });
    });
    if (collected.length) rawObs = collected;
  }
  if (!rawObs || rawObs.length < 2) return null;
  var observations = [];
  rawObs.forEach(function (item, idx) {
    if (!isPlainObject(item)) return;
    var x = Number(item.x);
    var y = Number(item.y);
    if (!isFinite(x) || !isFinite(y)) return;
    var label =
      text(item.label) ||
      text(item.person) ||
      text(item.outlet) ||
      text(item.household) ||
      text(item.unit) ||
      text(item.id) ||
      text(item.name) ||
      "Point " + String(idx + 1);
    observations.push({ label: label, x: x, y: y });
  });
  if (observations.length < 2) return null;
  if (!isPlainObject(body.scatterplot) && !isPlainObject(spec.x_axis) && !isPlainObject(spec.y_axis)) {
    return null;
  }
  return { spec: spec, observations: observations };
}

function isScatterplotMaterialBody(body) {
  return !!extractScatterplotSpec(body);
}

function normalizeScatterplotAxis(axisRaw, values, fallbackLabel) {
  var axis = isPlainObject(axisRaw) ? axisRaw : {};
  var dataMin = Math.min.apply(null, values);
  var dataMax = Math.max.apply(null, values);
  var rawMin = axis.minimum != null ? axis.minimum : axis.min;
  var rawMax = axis.maximum != null ? axis.maximum : axis.max;
  var min = rawMin != null && isFinite(Number(rawMin)) ? Number(rawMin) : dataMin;
  var max = rawMax != null && isFinite(Number(rawMax)) ? Number(rawMax) : dataMax;
  if (!(max > min)) {
    min = dataMin - 1;
    max = dataMax + 1;
  }
  var rawStep = axis.tick_interval != null ? axis.tick_interval : axis.step;
  var tickInterval =
    rawStep != null && isFinite(Number(rawStep)) && Number(rawStep) > 0
      ? Number(rawStep)
      : (max - min) / 5;
  if ((max - min) / tickInterval > 30) {
    tickInterval = (max - min) / 6;
  }
  var rawLabel = text(axis.label) || fallbackLabel;
  var unitText = text(axis.unit);
  var axisLabel =
    unitText && rawLabel.indexOf(unitText) === -1
      ? rawLabel + " (" + unitText + ")"
      : rawLabel;
  return {
    label: axisLabel,
    minimum: min,
    maximum: max,
    tickInterval: tickInterval,
    scale: text(axis.scale) || "linear"
  };
}

function scatterplotShowsPointLabels(spec) {
  if (!isPlainObject(spec)) return false;
  if (
    spec.show_point_labels === true ||
    spec.point_labels === true ||
    spec.show_observation_labels === true
  ) {
    return true;
  }
  if (isPlainObject(spec.point_style)) {
    return (
      spec.point_style.show_observation_labels === true ||
      spec.point_style.show_point_labels === true
    );
  }
  return false;
}

function buildScatterplotModelFromSpec(specObj, options) {
  var extracted = extractScatterplotSpec(specObj);
  if (!extracted) return null;
  var opts = isPlainObject(options) ? options : {};
  var spec = extracted.spec;
  var observations = extracted.observations;
  var xs = observations.map(function (o) { return o.x; });
  var ys = observations.map(function (o) { return o.y; });
  var title = text(spec.title) || text(opts.fallbackTitle) || "Scatterplot";
  return {
    id: text(opts.id) || "scatterplot",
    title: title,
    scatterplot: {
      title: title,
      xAxis: normalizeScatterplotAxis(spec.x_axis, xs, "X"),
      yAxis: normalizeScatterplotAxis(spec.y_axis, ys, "Y"),
      observations: observations,
      showPointLabels: scatterplotShowsPointLabels(spec),
      caption: text(spec.caption),
      accessibleDescription:
        text(spec.accessible_description) ||
        text(spec.alternative_text) ||
        text(spec.alt_text)
    },
    table: null
  };
}

function isNumericalSummaryObject(obj) {
  if (!isPlainObject(obj)) return false;
  var hasDisplay = !!text(obj.display);
  var hasStatOrVal = !!text(obj.statistic) || obj.value != null || !!text(obj.symbol);
  if (!hasDisplay && !hasStatOrVal) return false;
  var keys = Object.keys(obj);
  return keys.length > 0 && keys.every(function (k) {
    var tok = keyMatchToken(k);
    return (
      tok === "display" ||
      tok === "statistic" ||
      tok === "symbol" ||
      tok === "value" ||
      tok === "label" ||
      tok === "unit" ||
      tok === "note" ||
      isOmittedSchemaScalarKey(k)
    );
  });
}

function formatNumericalSummaryDisplay(obj) {
  if (!isPlainObject(obj)) return "";
  var disp = text(obj.display);
  if (disp) return disp;
  var stat = text(obj.statistic) || text(obj.label);
  var val = obj.value != null ? String(obj.value).trim() : "";
  if (stat && val) return stat + ": " + val;
  return stat || val;
}

function resolveScatterplotTableObject(body, spec) {
  var candidates = [
    body && body.table,
    body && body.accessible_table,
    body && body.data_table,
    body && body.paired_observations,
    spec && spec.table,
    spec && spec.accessible_table,
    spec && spec.data_table
  ];
  for (var i = 0; i < candidates.length; i += 1) {
    if (isPlainObject(candidates[i]) && isTabularBody(candidates[i])) {
      return candidates[i];
    }
  }
  return null;
}

function normalizeScatterplotMaterial(source, body, materialId, kind, sectionId, sourceOrder, formalNotes) {
  var extracted = extractScatterplotSpec(body);
  var spec = extracted.spec;
  var observations = extracted.observations;
  var xs = observations.map(function (o) { return o.x; });
  var ys = observations.map(function (o) { return o.y; });
  var tableObj = resolveScatterplotTableObject(body, spec);
  var tableSpec = tableObj ? tabularColumnsAndRows(tableObj) : null;
  var tableRowHeaderCol = resolveTableRowHeaderColumn(tableObj);
  var numericalSummary = formatNumericalSummaryDisplay(body && body.numerical_summary);
  return {
    id: materialId,
    kind: kind || "scatterplot",
    type: "expository_structured_scatterplot",
    sectionId: sectionId,
    commissionId: text(source.commission_id),
    sourceOrder: sourceOrder,
    title: learnerFacingTitle(body.heading || body.title || spec.title || source.title, materialId),
    context: text(body.context) || text(body.introduction),
    readingNote: text(body.reading_note),
    numericalSummary: numericalSummary,
    sourceNote: text(body.source_note),
    scatterplot: {
      title: text(spec.title) || learnerFacingTitle(body.title || source.title, materialId),
      xAxis: normalizeScatterplotAxis(spec.x_axis, xs, "X"),
      yAxis: normalizeScatterplotAxis(spec.y_axis, ys, "Y"),
      observations: observations,
      showPointLabels: scatterplotShowsPointLabels(spec),
      caption: text(spec.caption) || text(body.caption),
      accessibleDescription:
        text(spec.accessible_description) ||
        text(body.accessible_description) ||
        text(spec.alternative_text) ||
        text(body.alternative_text) ||
        text(spec.alt_text) ||
        text(body.alt_text)
    },
    table: tableSpec && !tableSpec.publicationFailure && tableSpec.columns.length
      ? {
          caption: text(tableObj && tableObj.caption) || text(tableObj && tableObj.title),
          columns: tableSpec.columns,
          rows: tableSpec.rows,
          rowHeaderColumn: tableRowHeaderCol,
          navigationText: text(tableObj && tableObj.navigation_text)
        }
      : null,
    _authorFormalNotes: formalNotes
  };
}

function isExpositoryResponseElicitationBody(body) {
  if (!isPlainObject(body)) return false;
  if (!isPlainObject(body.response_field)) return false;
  var rf = body.response_field;
  return !!(text(rf.label) || text(rf.type));
}

function normalizeExpositoryResponseElicitation(source, body, materialId, kind, sectionId, sourceOrder, formalNotes) {
  var rf = body.response_field || {};
  var elicitationId =
    (isPlainObject(formalNotes) && (text(formalNotes.elicitation_id) || text(formalNotes.elicitationId))) ||
    text(source.elicitation_id) ||
    text(source.elicitationId) ||
    "";
  return {
    id: materialId,
    kind: kind || "response_elicitation",
    type: "expository_response_elicitation",
    sectionId: sectionId,
    commissionId: text(source.commission_id),
    sourceOrder: sourceOrder,
    heading: text(body.heading) || learnerFacingTitle(body.title || source.title, materialId),
    responseLabel: text(rf.label) || "Your response",
    responseExtent: text(rf.response_extent),
    elicitationId: elicitationId,
    _authorFormalNotes: formalNotes
  };
}

function isExpositoryFeedbackDisclosureBody(body) {
  if (!isPlainObject(body)) return false;
  if (!isPlainObject(body.feedback_content)) return false;
  return Array.isArray(body.feedback_content.blocks) && body.feedback_content.blocks.length > 0;
}

function normalizeExpositoryFeedbackDisclosure(source, body, materialId, kind, sectionId, sourceOrder, formalNotes) {
  var fc = body.feedback_content || {};
  var blocks = (Array.isArray(fc.blocks) ? fc.blocks : [])
    .map(function (blk) {
      if (!isPlainObject(blk)) return null;
      var heading = text(blk.heading) || text(blk.title);
      var paragraphs = Array.isArray(blk.paragraphs)
        ? blk.paragraphs.map(text).filter(Boolean)
        : text(blk.body)
          ? [text(blk.body)]
          : [];
      if (!heading && !paragraphs.length) return null;
      return { heading: heading, paragraphs: paragraphs };
    })
    .filter(Boolean);
  var replaces =
    text(fc.source_field).toLowerCase() === "exposition" ||
    (isPlainObject(formalNotes) && /once/i.test(text(formalNotes.assembly_requirement))) ||
    blocks.length > 0;
  return {
    id: materialId,
    kind: kind || "feedback_disclosure",
    type: "expository_feedback_disclosure",
    sectionId: sectionId,
    commissionId: text(source.commission_id),
    sourceOrder: sourceOrder,
    disclosureLabel: text(body.disclosure_label) || "Compare your explanation with the feedback",
    blocks: blocks,
    replacesSectionExposition: replaces,
    _authorFormalNotes: formalNotes
  };
}

function formatAxisTick(value, tickInterval) {
  var rounded = Math.round(value * 1000000) / 1000000;
  if (Math.abs(rounded) < 1e-9) rounded = 0;
  var decs = 0;
  if (tickInterval && tickInterval < 1) {
    var str = String(tickInterval);
    var dot = str.indexOf(".");
    if (dot !== -1) decs = Math.min(3, str.length - dot - 1);
  }
  return decs > 0 ? rounded.toFixed(decs) : String(rounded);
}

function buildLinearTicks(min, max, step) {
  var ticks = [];
  var count = 0;
  for (var v = min; v <= max + step * 1e-6 && count < 40; v += step) {
    ticks.push(Math.round(v * 1000000) / 1000000);
    count += 1;
  }
  return ticks;
}

/**
 * Figure and semantic data table only, without the Expository article shell,
 * heading, context or source note. Shared by Expository scatterplots and by
 * Assessment Evidence elicitation stimuli that carry an authored scatterplot
 * (the caller owns the surrounding structure and heading level).
 */
function renderScatterplotEvidence(material) {
  var sp = material && material.scatterplot;
  if (!sp || !Array.isArray(sp.observations) || !sp.observations.length) return "";
  var title = text(material.title) || text(sp.title);
  var caption = text(sp.caption);
  var accessibleDesc = text(sp.accessibleDescription);
  var safeId = String(material.id || "scatterplot").replace(/[^A-Za-z0-9_-]/g, "-");
  var svgTitleId = "scatterplot-title-" + safeId;
  var svgDescId = accessibleDesc ? "scatterplot-desc-" + safeId : "";

  var W = 600;
  var H = 380;
  var padL = 74;
  var padR = 24;
  var padT = 24;
  var padB = 62;
  var plotW = W - padL - padR;
  var plotH = H - padT - padB;

  var xAxis = sp.xAxis;
  var yAxis = sp.yAxis;
  var xSpan = xAxis.maximum - xAxis.minimum || 1;
  var ySpan = yAxis.maximum - yAxis.minimum || 1;
  function mapX(x) {
    return padL + ((x - xAxis.minimum) / xSpan) * plotW;
  }
  function mapY(y) {
    return padT + plotH - ((y - yAxis.minimum) / ySpan) * plotH;
  }

  var xTicks = buildLinearTicks(xAxis.minimum, xAxis.maximum, xAxis.tickInterval);
  var yTicks = buildLinearTicks(yAxis.minimum, yAxis.maximum, yAxis.tickInterval);

  var svgParts = [];
  svgParts.push(
    '<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 ' +
      W +
      " " +
      H +
      '" class="util-scatterplot-svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0.75rem 0;background:#ffffff;border:1px solid #d9e1e8;border-radius:6px;" aria-labelledby="' +
      html.escapeAttribute(svgTitleId + (svgDescId ? " " + svgDescId : "")) +
      '">'
  );
  svgParts.push('<title id="' + html.escapeAttribute(svgTitleId) + '">' + html.escapeHtml(title || "Scatterplot") + "</title>");
  if (svgDescId) {
    svgParts.push('<desc id="' + html.escapeAttribute(svgDescId) + '">' + html.escapeHtml(accessibleDesc) + "</desc>");
  }

  // Subtle gridlines and tick marks
  xTicks.forEach(function (xv) {
    var px = mapX(xv).toFixed(2);
    svgParts.push(
      '<line x1="' + px + '" y1="' + padT + '" x2="' + px + '" y2="' + (padT + plotH) + '" stroke="#e8edf2" stroke-width="1"></line>'
    );
    svgParts.push(
      '<line x1="' + px + '" y1="' + (padT + plotH) + '" x2="' + px + '" y2="' + (padT + plotH + 5) + '" stroke="#4a5568" stroke-width="1"></line>'
    );
    svgParts.push(
      '<text x="' + px + '" y="' + (padT + plotH + 20) + '" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="12" fill="#334155">' +
        html.escapeHtml(formatAxisTick(xv, xAxis.tickInterval)) +
        "</text>"
    );
  });

  yTicks.forEach(function (yv) {
    var py = mapY(yv).toFixed(2);
    svgParts.push(
      '<line x1="' + padL + '" y1="' + py + '" x2="' + (padL + plotW) + '" y2="' + py + '" stroke="#e8edf2" stroke-width="1"></line>'
    );
    svgParts.push(
      '<line x1="' + (padL - 5) + '" y1="' + py + '" x2="' + padL + '" y2="' + py + '" stroke="#4a5568" stroke-width="1"></line>'
    );
    svgParts.push(
      '<text x="' + (padL - 10) + '" y="' + (Number(py) + 4).toFixed(2) + '" text-anchor="end" font-family="system-ui,-apple-system,sans-serif" font-size="12" fill="#334155">' +
        html.escapeHtml(formatAxisTick(yv, yAxis.tickInterval)) +
        "</text>"
    );
  });

  // Axes
  svgParts.push(
    '<line x1="' + padL + '" y1="' + (padT + plotH) + '" x2="' + (padL + plotW) + '" y2="' + (padT + plotH) + '" stroke="#1e293b" stroke-width="1.5"></line>'
  );
  svgParts.push(
    '<line x1="' + padL + '" y1="' + padT + '" x2="' + padL + '" y2="' + (padT + plotH) + '" stroke="#1e293b" stroke-width="1.5"></line>'
  );

  // Axis labels
  var xLabelFontSize = xAxis.label.length > 52 ? "11" : "13";
  var yLabelFontSize = yAxis.label.length > 42 ? "11" : "13";
  svgParts.push(
    '<text x="' + (padL + plotW / 2).toFixed(2) + '" y="' + (H - 14) + '" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="' + xLabelFontSize + '" font-weight="600" fill="#1e293b">' +
      html.escapeHtml(xAxis.label) +
      "</text>"
  );
  svgParts.push(
    '<text x="18" y="' + (padT + plotH / 2).toFixed(2) + '" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="' + yLabelFontSize + '" font-weight="600" fill="#1e293b" transform="rotate(-90 18 ' + (padT + plotH / 2).toFixed(2) + ')">' +
      html.escapeHtml(yAxis.label) +
      "</text>"
  );

  // Observations: separate, equally prominent points (no connecting lines or regression lines)
  sp.observations.forEach(function (pt) {
    var px = mapX(pt.x).toFixed(2);
    var py = mapY(pt.y).toFixed(2);
    var ptTitle = pt.label + ": (" + pt.x + ", " + pt.y + ")";
    svgParts.push(
      '<circle class="util-scatterplot-point" cx="' +
        px +
        '" cy="' +
        py +
        '" r="5" fill="#1f4e79" stroke="#ffffff" stroke-width="1.5" data-point-label="' +
        html.escapeAttribute(pt.label) +
        '" data-x="' +
        html.escapeAttribute(String(pt.x)) +
        '" data-y="' +
        html.escapeAttribute(String(pt.y)) +
        '"><title>' +
        html.escapeHtml(ptTitle) +
        "</title></circle>"
    );
    if (sp.showPointLabels && pt.label) {
      var labelY = Math.max(padT + 11, Number(py) - 9).toFixed(2);
      svgParts.push(
        '<text class="util-scatterplot-point-label" x="' +
          px +
          '" y="' +
          labelY +
          '" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="11" fill="#334155">' +
          html.escapeHtml(pt.label) +
          "</text>"
      );
    }
  });

  svgParts.push("</svg>");

  var figureHtml =
    '<figure class="util-scatterplot-figure" data-scatterplot-figure="true">' +
    svgParts.join("") +
    (caption ? '<figcaption class="util-scatterplot-caption">' + html.renderMarkdownInline(caption) + "</figcaption>" : "") +
    "</figure>";

  var tableHtml =
    material.table && material.table.columns && material.table.columns.length
      ? expositionDataTableHtml(material.table.columns, material.table.rows, material.table.caption, {
          rowHeaderColumn: material.table.rowHeaderColumn
        }) +
        (material.table.navigationText
          ? '<p class="util-table-navigation-note">' +
            html.renderMarkdownInline(material.table.navigationText) +
            "</p>"
          : "")
      : "";

  return figureHtml + tableHtml;
}

function renderScatterplot(material) {
  var sp = material && material.scatterplot;
  if (!sp || !Array.isArray(sp.observations) || !sp.observations.length) return "";
  var title = text(material.title) || text(sp.title);
  var contextText = text(material.context);
  var readingNote = text(material.readingNote);
  var numericalSummary = text(material.numericalSummary);
  var sourceNote = text(material.sourceNote);

  return (
    materialShellOpen(material, "scatterplot", "util-exposition-scatterplot") +
    (title ? "<h3>" + html.escapeHtml(title) + "</h3>" : "") +
    (contextText ? '<p class="util-scatterplot-context">' + html.renderMarkdownInline(contextText) + "</p>" : "") +
    renderScatterplotEvidence(material) +
    (numericalSummary ? '<p class="util-numerical-summary">' + html.renderMarkdownInline(numericalSummary) + "</p>" : "") +
    (readingNote ? '<p class="util-scatterplot-reading-note">' + html.renderMarkdownInline(readingNote) + "</p>" : "") +
    (sourceNote ? '<p class="util-scatterplot-source-note"><small>' + html.renderMarkdownInline(sourceNote) + "</small></p>" : "") +
    "</article>"
  );
}

function renderExpositoryResponseElicitation(material, context) {
  var heading = text(material && material.heading);
  var elicitationId = text(material && material.elicitationId);
  var workspaceId = elicitationId
    ? "learner-constructed-" + elicitationId
    : "expository-response-" + text(material && material.id || "1");
  var renderWorkspaceGroupFn =
    context && typeof context.renderWorkspaceGroup === "function"
      ? context.renderWorkspaceGroup
      : null;

  var workspace = {
    mode: "inline",
    capability: "text_entry",
    sourceStepNumber: 1,
    instruction: text(material && material.responseExtent),
    responseLabel: text(material && material.responseLabel) || "Your response",
    prompt: text(material && material.responseExtent),
    responsePartId: elicitationId || text(material && material.id) || "response",
    sourceKind: "learner_artefact",
    sourceId: elicitationId || text(material && material.id) || "response",
    order: 1,
    rows: 6,
    persistenceAvailable: true,
    guidance: "Your draft is saved on this device when possible. It is not submitted.",
    workspaceId: workspaceId,
    artefactElicitationId: elicitationId || undefined
  };

  var workspaceHtml = renderWorkspaceGroupFn
    ? renderWorkspaceGroupFn([workspace], "learner-artefact", { omitGuidance: false })
    : '<div class="util-learner-workspace util-prose-measure" data-workspace-kind="text_entry" data-workspace-id="' +
      html.escapeAttribute(workspaceId) +
      '"' +
      (elicitationId ? ' data-artefact-elicitation-id="' + html.escapeAttribute(elicitationId) + '"' : "") +
      '><label class="util-learner-workspace__label" for="' +
      html.escapeAttribute(workspaceId) +
      '">' +
      html.escapeHtml(workspace.responseLabel) +
      '</label><textarea class="util-learner-workspace__input" id="' +
      html.escapeAttribute(workspaceId) +
      '" name="' +
      html.escapeAttribute(workspaceId) +
      '" rows="6"></textarea></div>';

  return (
    materialShellOpen(material, "response_elicitation", "util-exposition-response-elicitation") +
    (heading ? "<h3>" + html.escapeHtml(heading) + "</h3>" : "") +
    workspaceHtml +
    "</article>"
  );
}

function renderExpositoryFeedbackDisclosure(material) {
  var disclosureLabel = text(material && material.disclosureLabel) || "Compare your explanation with the feedback";
  var blocks = Array.isArray(material && material.blocks) ? material.blocks : [];
  if (!blocks.length) return "";
  var blocksHtml = blocks
    .map(function (blk) {
      var h = text(blk && blk.heading);
      var paras = (Array.isArray(blk && blk.paragraphs) ? blk.paragraphs : [])
        .map(function (p) {
          return renderMarkdownOrPlain(p);
        })
        .filter(Boolean)
        .join("");
      return (
        '<div class="util-expository-feedback-block">' +
        (h ? "<h4>" + html.renderMarkdownInline(h) + "</h4>" : "") +
        paras +
        "</div>"
      );
    })
    .join("");
  return (
    materialShellOpen(material, "feedback_disclosure", "util-exposition-feedback-disclosure") +
    '<details class="util-assessment-feedback util-expository-feedback-disclosure util-prose-measure" data-feedback-disclosure="true">' +
    '<summary class="util-expository-feedback-disclosure__summary">' +
    html.escapeHtml(disclosureLabel) +
    "</summary>" +
    '<div class="util-expository-feedback-disclosure__body">' +
    blocksHtml +
    "</div>" +
    "</details>" +
    "</article>"
  );
}

function isExpositoryFormativeCheckBody(body) {
  if (!isPlainObject(body)) return false;
  var rt = text(body.response_type).toLowerCase();
  if (rt === "single_selection") {
    return (
      !!(text(body.question) || text(body.prompt)) &&
      Array.isArray(body.options) &&
      body.options.length >= 2 &&
      !!text(body.correct_option_id)
    );
  }
  if (rt === "classification") {
    return (
      !!(text(body.instruction) || text(body.question) || text(body.prompt)) &&
      Array.isArray(body.response_categories) &&
      body.response_categories.length >= 2 &&
      Array.isArray(body.statements) &&
      body.statements.length >= 1
    );
  }
  return false;
}

function buildSingleSelectionRationale(body, options) {
  var fbList = Array.isArray(body.feedback) ? body.feedback : [];
  var correctId = text(body.correct_option_id);
  var optTextById = Object.create(null);
  options.forEach(function (o) {
    optTextById[o.key] = o.text;
  });
  var parts = [];
  var orderedFb = fbList.slice().sort(function (a, b) {
    var aCorrect = isPlainObject(a) && text(a.option_id || a.id) === correctId ? 0 : 1;
    var bCorrect = isPlainObject(b) && text(b.option_id || b.id) === correctId ? 0 : 1;
    return aCorrect - bCorrect;
  });
  orderedFb.forEach(function (entry) {
    if (!isPlainObject(entry)) return;
    var id = text(entry.option_id || entry.id);
    var fbText = text(entry.text || entry.feedback);
    if (!fbText) return;
    var optText = optTextById[id] || "";
    if (id && id === correctId && optText) {
      parts.push("**Best-fitting response — " + optText + ":** " + fbText);
    } else if (optText) {
      parts.push("**" + optText + ":** " + fbText);
    } else {
      parts.push(fbText);
    }
  });
  var shared = text(body.shared_feedback);
  if (shared) parts.push(shared);
  return parts.join("\n\n");
}

function buildClassificationRationale(body, categoryLabelById) {
  var statements = Array.isArray(body.statements) ? body.statements : [];
  var parts = [];
  statements.forEach(function (st, idx) {
    if (!isPlainObject(st)) return;
    var cid = text(st.correct_category_id);
    var catLabel = categoryLabelById[cid] || "";
    var fbText = text(st.feedback);
    var stText = text(st.text);
    var prefix = "Statement " + String(idx + 1);
    var header = catLabel ? "**" + prefix + " (" + catLabel + "):** " : "**" + prefix + ":** ";
    if (fbText) {
      parts.push(header + fbText);
    } else if (catLabel && stText) {
      parts.push(header + stText);
    }
  });
  var shared = text(body.shared_feedback);
  if (shared) parts.push(shared);
  return parts.join("\n\n");
}

function normalizeExpositoryFormativeCheck(source, body, materialId, kind, sectionId, sourceOrder, formalNotes) {
  var rt = text(body.response_type).toLowerCase();
  var heading = text(body.heading) || learnerFacingTitle(body.title || source.title, materialId);
  var checkLabel = text(body.feedback_control_label) || "Check your reasoning";
  var assessmentItem = null;

  if (rt === "single_selection") {
    var options = (Array.isArray(body.options) ? body.options : [])
      .map(function (opt, idx) {
        if (!isPlainObject(opt)) return null;
        var key = text(opt.option_id || opt.id || opt.key) || "opt-" + String(idx + 1);
        var optText = text(opt.text || opt.label);
        return optText ? { key: key, text: optText } : null;
      })
      .filter(Boolean);
    assessmentItem = {
      id: materialId,
      item_type: "single_answer_mcq",
      heading: heading,
      stem: text(body.question) || text(body.prompt),
      options: options,
      correct_answer: text(body.correct_option_id),
      check_label: checkLabel,
      explanation_or_rationale: buildSingleSelectionRationale(body, options)
    };
  } else if (rt === "classification") {
    var categoryLabelById = Object.create(null);
    var categories = (Array.isArray(body.response_categories) ? body.response_categories : [])
      .map(function (cat, idx) {
        if (!isPlainObject(cat)) return null;
        var id = text(cat.category_id || cat.id) || "cat-" + String(idx + 1);
        var label = text(cat.label || cat.text);
        if (!label) return null;
        categoryLabelById[id] = label;
        return { id: id, label: label };
      })
      .filter(Boolean);
    var assignments = Object.create(null);
    var items = (Array.isArray(body.statements) ? body.statements : [])
      .map(function (st, idx) {
        if (!isPlainObject(st)) return null;
        var id = materialId + "-s" + String(text(st.statement_id || st.id) || idx + 1);
        var stText = text(st.text);
        if (!stText) return null;
        var cid = text(st.correct_category_id);
        if (cid) assignments[id] = cid;
        return { id: id, text: stText };
      })
      .filter(Boolean);
    assessmentItem = {
      id: materialId,
      item_type: "classification",
      heading: heading,
      stem: text(body.instruction) || text(body.question) || text(body.prompt),
      prompt: { categories: categories, items: items },
      judgement: { assignments: assignments },
      check_label: checkLabel,
      explanation_or_rationale: buildClassificationRationale(body, categoryLabelById)
    };
  }

  return {
    id: materialId,
    kind: kind || rt,
    type: "expository_formative_check",
    sectionId: sectionId,
    commissionId: text(source.commission_id),
    sourceOrder: sourceOrder,
    responseType: rt,
    assessmentItem: assessmentItem,
    _authorFormalNotes: formalNotes
  };
}

function renderExpositoryFormativeCheck(material) {
  if (!material || !material.assessmentItem) return "";
  var itemHtml = assessmentInteractive.renderAssessmentItem(material.assessmentItem, 0);
  if (!itemHtml) return "";
  return (
    materialShellOpen(material, "formative_check", "util-exposition-formative-check") +
    itemHtml +
    "</article>"
  );
}

function renderExpositionStructuredMaterial(material, context) {
  if (!material || typeof material !== "object") return null;
  var type = String(material.type || "");
  if (type === "expository_structured_scatterplot") {
    return renderScatterplot(material);
  }
  if (type === "expository_response_elicitation") {
    return renderExpositoryResponseElicitation(material, context);
  }
  if (type === "expository_feedback_disclosure") {
    return renderExpositoryFeedbackDisclosure(material);
  }
  if (type === "expository_formative_check") {
    return renderExpositoryFormativeCheck(material);
  }
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
    return renderGraph(material, context);
  }
  if (type === "expository_structured_contrast") {
    return renderContrast(material);
  }
  if (type === "expository_structured_equation") {
    return renderEquation(material);
  }
  if (type === "expository_unfulfilled_illustration") {
    return renderUnfulfilledIllustration(material, context);
  }
  if (type === "expository_structured_fallback") {
    return renderStructuredFallback(material, context);
  }
  if (type === "expository_structured_unsupported") {
    // Legacy model rows (tests / older assemblies): if a body was preserved, prefer fallback.
    if (material.body != null && (isPlainObject(material.body) || Array.isArray(material.body))) {
      return renderStructuredFallback(
        Object.assign({}, material, { type: "expository_structured_fallback" }),
        context
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
  equationExpressionFromValue: equationExpressionFromValue,
  resolveEquationFields: resolveEquationFields,
  isInternalMaterialId: isInternalMaterialId,
  isMachineToken: isMachineToken,
  isSchemaMechanicKey: isSchemaMechanicKey,
  isRepresentationOmissionKey: isRepresentationOmissionKey,
  isUnlabeledProseKey: isUnlabeledProseKey,
  isPromotedHeadingKey: isPromotedHeadingKey,
  isUnlabeledStructureKey: isUnlabeledStructureKey,
  normalizeKind: normalizeKind,
  humanizeKey: humanizeKey,
  learnerFacingTitle: learnerFacingTitle,
  learnerFacingLabel: learnerFacingLabel,
  buildExpositionStructuredMaterial: buildExpositionStructuredMaterial,
  renderExpositionStructuredMaterial: renderExpositionStructuredMaterial,
  extractScatterplotSpec: extractScatterplotSpec,
  normalizeScatterplotAxis: normalizeScatterplotAxis,
  normalizeScatterplotMaterial: normalizeScatterplotMaterial,
  renderScatterplotEvidence: renderScatterplotEvidence,
  renderStructuredValue: renderStructuredValue
};
