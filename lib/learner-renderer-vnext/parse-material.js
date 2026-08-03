"use strict";

var normalizeContent = require("./normalize-content");
var guidedChecklist = require("./parse-guided-checklist");

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
  "reference_table",
  "data_table",
  "impact_table",
  "template",
  "task_card",
  "transfer_prompt",
  "consolidation_summary"
]);

var MATERIAL_TYPE_ALIASES = Object.freeze({
  checklists: "checklist",
  examples: "worked_example",
  worked_examples: "worked_example",
  exposition: "text",
  reading: "text",
  reading_text: "text",
  prompt: "prompt_set",
  prompts: "prompt_set",
  scenarios: "scenario",
  study_scenarios: "scenario",
  templates: "template",
  worksheet_template: "template",
  task_cards: "task_card",
  cards: "task_card",
  strategy_options: "task_card",
  strategy: "task_card",
  strategies: "task_card",
  rubric: "checklist"
});

var NON_RENDERABLE_MATERIAL_TYPES = Object.freeze({
  expected_output: "activity_field",
  output: "activity_field",
  materials: "structural_container",
  metadata: "metadata",
  production: "metadata",
  criteria_exposition: "episode_function_or_guidance_field",
  discussion: "episode_function_or_prompt_field",
  guidance: "instructional_field",
  instructions: "instructional_field",
  what_to_do: "instructional_field",
  support_note: "activity_field",
  support_notes: "page_section_field"
});

var LEGACY_GENERIC_TABLE_TYPES = Object.freeze({
  table: true,
  worksheet: true
});

var EXPLICIT_TABLE_CANONICAL_TYPES = Object.freeze({
  reference_table: true,
  data_table: true,
  impact_table: true,
  classification_table: true,
  planning_table: true,
  comparison_table: true,
  analysis_table: true,
  decision_table: true
});

function normalizeMaterialType(value) {
  return String(value == null ? "" : value)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function canonicalMaterialType(value) {
  var normalized = normalizeMaterialType(value);
  return MATERIAL_TYPE_ALIASES[normalized] || normalized;
}

function isNonRenderableMaterialType(value) {
  return !!NON_RENDERABLE_MATERIAL_TYPES[normalizeMaterialType(value)];
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
  if (LEGACY_GENERIC_TABLE_TYPES[normalized]) {
    var legacyResolution = resolveLegacyTableWorksheet(source);
    if (legacyResolution.ok) return legacyResolution.canonicalType;
  }
  return canonicalMaterialType(raw);
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

function firstDefinedValue(values) {
  var i;
  for (i = 0; i < values.length; i += 1) {
    if (values[i] != null) return values[i];
  }
  return null;
}

function extractRawPayload(source) {
  if (!source || typeof source !== "object") return "";
  return firstDefinedValue([source.body, source.content, source.text, ""]);
}

function rowsToMarkdown(rows, columns) {
  var header = (Array.isArray(columns) ? columns : []).map(function (entry, index) {
    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
      return String(entry.label || entry.title || entry.name || entry.key || "Column " + (index + 1));
    }
    return String(entry == null ? "Column " + (index + 1) : entry);
  });
  if (!header.length && Array.isArray(rows) && rows.length) {
    var firstRow = rows[0];
    if (firstRow && typeof firstRow === "object" && !Array.isArray(firstRow)) {
      header = Object.keys(firstRow);
    } else if (Array.isArray(firstRow)) {
      header = firstRow.map(function (_entry, index) {
        return "Column " + (index + 1);
      });
    }
  }
  if (!header.length) return "";
  var divider = header.map(function () {
    return "---";
  });
  var lines = [
    "| " + header.join(" | ") + " |",
    "| " + divider.join(" | ") + " |"
  ];
  (Array.isArray(rows) ? rows : []).forEach(function (row) {
    var cells;
    if (Array.isArray(row)) {
      cells = row.map(function (cell) {
        return String(cell == null ? "" : cell);
      });
    } else if (row && typeof row === "object") {
      cells = header.map(function (column) {
        return String(row[column] == null ? "" : row[column]);
      });
    } else {
      cells = [String(row == null ? "" : row)];
    }
    while (cells.length < header.length) cells.push("");
    lines.push("| " + cells.slice(0, header.length).join(" | ") + " |");
  });
  return lines.join("\n");
}

function extractExplicitCanonicalSubtype(source, payload) {
  var subtypeRaw = firstDefinedValue([
    source && source.subtype,
    source && source.table_subtype,
    source && source.material_subtype,
    source && source.table_type,
    source && source.canonical_type,
    payload && payload.subtype,
    payload && payload.table_subtype,
    payload && payload.material_subtype,
    payload && payload.table_type,
    payload && payload.canonical_type
  ]);
  var subtype = canonicalMaterialType(subtypeRaw);
  return EXPLICIT_TABLE_CANONICAL_TYPES[subtype] ? subtype : "";
}

function parseWorksheetAsTemplate(payload) {
  if (typeof payload === "string") {
    var body = String(payload).trim();
    return body ? body : "";
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return "";
  var sections = Array.isArray(payload.sections) ? payload.sections : [];
  var fields = Array.isArray(payload.fields) ? payload.fields : [];
  var lines = [];
  if (sections.length) {
    sections.forEach(function (section, index) {
      if (typeof section === "string") {
        lines.push("### Section " + (index + 1));
        lines.push(String(section).trim());
        lines.push("");
        return;
      }
      if (!section || typeof section !== "object") return;
      lines.push("### " + String(section.heading || section.title || "Section " + (index + 1)).trim());
      var items = Array.isArray(section.items) ? section.items : [];
      if (items.length) {
        items.forEach(function (item) {
          lines.push("- " + String(item == null ? "" : item));
        });
      } else if (section.body != null || section.content != null || section.text != null) {
        lines.push(String(firstDefinedValue([section.body, section.content, section.text, ""])));
      }
      lines.push("");
    });
  }
  if (fields.length) {
    lines.push("### Fields");
    fields.forEach(function (field) {
      if (field && typeof field === "object") {
        lines.push(
          "- " + String(field.label || field.name || field.key || "Field") + ": " + String(field.value || "")
        );
      } else {
        lines.push("- " + String(field == null ? "" : field));
      }
    });
    lines.push("");
  }
  return lines.join("\n").trim();
}

function resolveLegacyTableWorksheet(source) {
  var authored = normalizeMaterialType(
    firstDefinedValue([
      source && source.material_type,
      source && source.type,
      source && source.materialType,
      source && source.kind,
      ""
    ])
  );
  if (!LEGACY_GENERIC_TABLE_TYPES[authored]) {
    return { ok: true, canonicalType: canonicalMaterialType(authored), body: null };
  }

  var payload = extractRawPayload(source);
  var payloadObject =
    payload && typeof payload === "object" && !Array.isArray(payload) ? payload : null;
  var structuredSource =
    source &&
    typeof source === "object" &&
    !Array.isArray(source) &&
    (source.rows != null ||
      source.columns != null ||
      source.header != null ||
      source.editable != null ||
      source.interaction_type != null ||
      source.interaction != null)
      ? source
      : null;
  var payloadShape = payloadObject || structuredSource;
  var explicitSubtype = extractExplicitCanonicalSubtype(source, payloadShape);
  if (explicitSubtype) {
    var explicitBody =
      typeof payload === "string"
        ? String(payload)
        : payloadShape && Array.isArray(payloadShape.rows)
        ? rowsToMarkdown(payloadShape.rows, payloadShape.columns || payloadShape.header)
        : String(firstDefinedValue([payloadShape && payloadShape.body, payloadShape && payloadShape.content, ""]));
    return { ok: true, canonicalType: explicitSubtype, body: explicitBody || "" };
  }

  if (payloadShape && Array.isArray(payloadShape.rows)) {
    var hasEditableFlag = payloadShape.editable === true || payloadShape.interactive === true;
    var interactionType = normalizeMaterialType(payloadShape.interaction_type || payloadShape.interaction);
    if (hasEditableFlag || interactionType === "table_entry" || interactionType === "completion_table") {
      return {
        ok: true,
        canonicalType: "data_table",
        body: rowsToMarkdown(payloadShape.rows, payloadShape.columns || payloadShape.header)
      };
    }
    return {
      ok: false,
      code: "AMBIGUOUS_MATERIAL_TYPE",
      reason: "Generic table payload requires explicit canonical subtype or interaction metadata."
    };
  }

  if (payloadShape && Object.prototype.hasOwnProperty.call(payloadShape, "rows")) {
    return {
      ok: false,
      code: "INVALID_MATERIAL_PAYLOAD",
      reason: "Structured table payload rows must be an array."
    };
  }

  if (authored === "worksheet") {
    var templateBody = parseWorksheetAsTemplate(payload);
    if (templateBody) {
      return {
        ok: true,
        canonicalType: "template",
        body: templateBody
      };
    }
    return {
      ok: false,
      code: "AMBIGUOUS_MATERIAL_TYPE",
      reason: "Worksheet payload must declare subtype, editable table metadata, or template sections."
    };
  }

  return {
    ok: false,
    code: "AMBIGUOUS_MATERIAL_TYPE",
    reason: "Generic table payload requires explicit canonical subtype."
  };
}

function firstNonEmptyText(values) {
  var index;
  for (index = 0; index < values.length; index += 1) {
    var value = values[index];
    if (value == null) continue;
    var text = String(value).trim();
    if (text) return text;
  }
  return "";
}

function parseTaskCardHeading(line) {
  var raw = String(line == null ? "" : line).trim().replace(/\u2014|\u2013/g, "-");
  var match = raw.match(/^#{2,3}\s+Card\s+(\d+)\s*(?:[:-]\s*(.*))?$/i);
  if (!match) return null;
  var cardNumber = String(match[1] || "").trim();
  var suffix = String(match[2] || "").trim();
  return {
    label: "Card " + cardNumber,
    title: suffix ? "Card " + cardNumber + " - " + suffix : "Card " + cardNumber
  };
}

function splitTaskCardMarkdownSections(text) {
  var raw = String(text == null ? "" : text).replace(/\r\n?/g, "\n").trim();
  if (!raw) return [];
  var lines = raw.split("\n");
  var cards = [];
  var current = null;

  function pushCurrent() {
    if (!current) return;
    var body = String(current.lines.join("\n") || "").trim();
    if (!body) return;
    cards.push({
      title: current.title || current.label || "",
      label: current.label || "",
      body: body
    });
  }

  lines.forEach(function (line) {
    var heading = parseTaskCardHeading(line);
    if (heading) {
      pushCurrent();
      current = {
        title: heading.title,
        label: heading.label,
        lines: []
      };
      return;
    }
    if (!current) {
      current = { title: "", label: "", lines: [] };
    }
    current.lines.push(line);
  });
  pushCurrent();
  return cards;
}

function parseTaskCardEntry(entry, index) {
  if (entry == null) {
    return { ok: false, reason: "null_card_entry", index: index };
  }
  if (typeof entry === "string") {
    var body = String(entry).trim();
    if (!body) return { ok: false, reason: "empty_string_card_entry", index: index };
    return {
      ok: true,
      card: {
        title: "Card " + (index + 1),
        label: "Card " + (index + 1),
        body: body
      }
    };
  }
  if (typeof entry !== "object" || Array.isArray(entry)) {
    return { ok: false, reason: "invalid_card_entry_type", index: index };
  }
  var bodyText = firstNonEmptyText([
    entry.instruction,
    entry.prompt,
    entry.content,
    entry.text,
    entry.body,
    entry.task,
    entry.description,
    entry.rationale,
    entry.summary
  ]);
  if (!bodyText) return { ok: false, reason: "missing_card_body", index: index };
  var title = firstNonEmptyText([
    entry.title,
    entry.card_title,
    entry.name,
    entry.label,
    entry.option
  ]);
  return {
    ok: true,
    card: {
      title: title || "Card " + (index + 1),
      label: title || "Card " + (index + 1),
      body: bodyText
    }
  };
}

function parseTaskCardPayload(payload) {
  if (payload == null) return { ok: false, reason: "missing_task_card_payload", cards: [] };

  if (typeof payload === "string") {
    var markdownCards = splitTaskCardMarkdownSections(payload);
    if (markdownCards.length > 1) return { ok: true, cards: markdownCards };
    var singleBody = String(payload).trim();
    if (!singleBody) return { ok: false, reason: "empty_task_card_string", cards: [] };
    return {
      ok: true,
      cards: [{ title: "Card 1", label: "Card 1", body: singleBody }]
    };
  }

  if (Array.isArray(payload)) {
    var listCards = [];
    var i;
    for (i = 0; i < payload.length; i += 1) {
      var parsed = parseTaskCardEntry(payload[i], i);
      if (!parsed.ok) return { ok: false, reason: parsed.reason, index: parsed.index, cards: [] };
      listCards.push(parsed.card);
    }
    if (!listCards.length) return { ok: false, reason: "empty_task_card_array", cards: [] };
    return { ok: true, cards: listCards };
  }

  if (typeof payload === "object") {
    var nestedList = null;
    if (Array.isArray(payload.cards)) nestedList = payload.cards;
    else if (Array.isArray(payload.items)) nestedList = payload.items;
    else if (Array.isArray(payload.options)) nestedList = payload.options;
    else if (Array.isArray(payload.strategies)) nestedList = payload.strategies;
    if (nestedList) return parseTaskCardPayload(nestedList);
    var single = parseTaskCardEntry(payload, 0);
    if (!single.ok) return { ok: false, reason: single.reason, index: single.index, cards: [] };
    return { ok: true, cards: [single.card] };
  }

  return { ok: false, reason: "invalid_task_card_payload_type", cards: [] };
}

/**
 * @param {Object} source
 * @param {number} sourceOrder
 * @returns {import("./types").LearnerMaterial}
 */
function buildMaterialModel(source, sourceOrder) {
  var legacyResolution = resolveLegacyTableWorksheet(source);
  var type = legacyResolution.ok ? legacyResolution.canonicalType : resolveMaterialType(source);
  var authoredType = "";
  if (source && typeof source === "object") {
    authoredType = source.material_type;
    if (authoredType == null || !String(authoredType).trim()) authoredType = source.type;
    if (authoredType == null || !String(authoredType).trim()) authoredType = source.materialType;
    if (authoredType == null || !String(authoredType).trim()) authoredType = source.kind;
    authoredType = normalizeMaterialType(authoredType);
  }
  var title = String((source && source.title) || "").trim();
  var rawBody =
    legacyResolution.ok && legacyResolution.body != null
      ? legacyResolution.body
      :
    source && source.body != null
      ? source.body
      : source && source.content != null
      ? source.content
      : source && source.text != null
      ? source.text
      : "";
  var bodyFormatRaw = String((source && source.body_format) || "").trim();
  var isObjectBody = !!(rawBody && typeof rawBody === "object" && !Array.isArray(rawBody));
  var resolvedBodyFormat =
    bodyFormatRaw ||
    (type === "checklist" && isObjectBody ? "json" : "markdown");
  var body =
    typeof rawBody === "string"
      ? normalizeContent.stripLeadingMatchingMarkdownHeading(rawBody, title)
      : isObjectBody
        ? JSON.stringify(rawBody)
        : "";
  var taskCardModel =
    type === "task_card" ? parseTaskCardPayload(rawBody) : { ok: true, cards: [] };
  var checklistModel =
    type === "checklist"
      ? guidedChecklist.resolveChecklistModel(rawBody, resolvedBodyFormat, {
          materialId: String((source && source.material_id) || "").trim() || "checklist",
          parseChecklistBody: parseChecklistBody
        })
      : null;
  var model = {
    id: String((source && source.material_id) || "").trim(),
    type: type,
    title: title,
    bodyFormat: resolvedBodyFormat,
    body: body,
    sourceOrder: sourceOrder,
    checklist: checklistModel
  };
  if (type === "task_card") {
    model.taskCards = taskCardModel.ok ? taskCardModel.cards : [];
  }
  if (authoredType && authoredType !== type) {
    model.authoredType = authoredType;
  }
  return model;
}

function hasMaterialRenderer(type) {
  return MATERIAL_RENDERER_TYPES.indexOf(canonicalMaterialType(type)) !== -1;
}

module.exports = {
  MATERIAL_RENDERER_TYPES: MATERIAL_RENDERER_TYPES,
  MATERIAL_TYPE_ALIASES: MATERIAL_TYPE_ALIASES,
  NON_RENDERABLE_MATERIAL_TYPES: NON_RENDERABLE_MATERIAL_TYPES,
  normalizeMaterialType: normalizeMaterialType,
  canonicalMaterialType: canonicalMaterialType,
  isNonRenderableMaterialType: isNonRenderableMaterialType,
  resolveMaterialType: resolveMaterialType,
  parseChecklistBody: parseChecklistBody,
  parseGuidedChecklist: guidedChecklist.parseGuidedChecklist,
  resolveChecklistModel: guidedChecklist.resolveChecklistModel,
  parseTaskCardPayload: parseTaskCardPayload,
  resolveLegacyTableWorksheet: resolveLegacyTableWorksheet,
  buildMaterialModel: buildMaterialModel,
  hasMaterialRenderer: hasMaterialRenderer
};
