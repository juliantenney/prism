"use strict";

/**
 * Optional field-granular learner input modality on DLA required_materials[] rows.
 * DLA is the semantic authority; GAM preserves labels only.
 */

var INPUT_MODALITIES = Object.freeze(["text", "math"]);

var INPUT_MODALITY_SET = Object.freeze(
  INPUT_MODALITIES.reduce(function (acc, value) {
    acc[value] = true;
    return acc;
  }, Object.create(null))
);

var DEFAULT_INPUT_MODALITY = "text";

var RESPONSE_FIELDS_MATERIAL_TYPES = Object.freeze({
  template: true
});

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function materialTypeToken(row) {
  return String((row && (row.material_type || row.type)) || "").trim();
}

function normaliseLabel(value) {
  return String(value == null ? "" : value).trim();
}

/**
 * @param {unknown} value
 * @param {string} path
 * @param {string[]} errors
 * @param {{ material_type?: string, material_id?: string }=} rowContext
 */
function validateResponseFieldsShape(value, path, errors, rowContext) {
  if (value == null) return;
  if (!Array.isArray(value)) {
    errors.push(path + " must be an array when present");
    return;
  }
  if (!value.length) {
    errors.push(path + " must not be an empty array; omit the property instead");
    return;
  }

  var row = rowContext && typeof rowContext === "object" ? rowContext : {};
  var materialType = materialTypeToken(row);
  if (materialType && !RESPONSE_FIELDS_MATERIAL_TYPES[materialType]) {
    errors.push(
      path +
        " is only supported on template required_materials rows (material_type template)"
    );
  }

  var seenLabels = Object.create(null);
  value.forEach(function (field, index) {
    var fieldPath = path + "[" + index + "]";
    if (!field || typeof field !== "object" || Array.isArray(field)) {
      errors.push(fieldPath + " must be an object");
      return;
    }
    var label = normaliseLabel(field.label);
    if (!label) {
      errors.push(fieldPath + ".label required (non-empty string)");
      return;
    }
    if (seenLabels[label]) {
      errors.push(fieldPath + ".label duplicates an earlier response_fields label: " + label);
      return;
    }
    seenLabels[label] = true;

    if (!Object.prototype.hasOwnProperty.call(field, "input_modality")) {
      return;
    }
    var modality = String(field.input_modality || "").trim();
    if (!INPUT_MODALITY_SET[modality]) {
      errors.push(
        fieldPath +
          '.input_modality must be "text" or "math" when present (received: ' +
          JSON.stringify(field.input_modality) +
          ")"
      );
    }
  });
}

/**
 * @param {Array<Object>|null|undefined} requiredMaterials
 * @param {string} materialId
 * @returns {Array<{ label: string, input_modality?: string }>}
 */
function getResponseFieldsForMaterial(requiredMaterials, materialId) {
  var targetId = String(materialId || "").trim();
  if (!targetId) return [];
  var rows = Array.isArray(requiredMaterials) ? requiredMaterials : [];
  for (var i = 0; i < rows.length; i += 1) {
    var row = rows[i];
    if (!row || typeof row !== "object") continue;
    if (String(row.material_id || "").trim() !== targetId) continue;
    if (!Array.isArray(row.response_fields)) return [];
    return row.response_fields.slice();
  }
  return [];
}

/**
 * @param {Array<Object>|null|undefined} requiredMaterials
 * @param {string} materialId
 * @returns {Object.<string, string>}
 */
function buildModalityIndexForMaterial(requiredMaterials, materialId) {
  var index = Object.create(null);
  getResponseFieldsForMaterial(requiredMaterials, materialId).forEach(function (field) {
    var label = normaliseLabel(field && field.label);
    if (!label || Object.prototype.hasOwnProperty.call(index, label)) return;
    var modality = Object.prototype.hasOwnProperty.call(field, "input_modality")
      ? String(field.input_modality || "").trim()
      : DEFAULT_INPUT_MODALITY;
    index[label] = INPUT_MODALITY_SET[modality] ? modality : DEFAULT_INPUT_MODALITY;
  });
  return index;
}

/**
 * @param {string} label
 * @param {Object.<string, string>} modalityIndex
 * @param {{ materialId?: string, hasCommissionedFields?: boolean }=} options
 * @returns {{ inputModality: string, diagnostic: Object|null }}
 */
function resolveInputModalityForLabel(label, modalityIndex, options) {
  var opts = options && typeof options === "object" ? options : {};
  var normalised = normaliseLabel(label);
  if (!opts.hasCommissionedFields) {
    return { inputModality: DEFAULT_INPUT_MODALITY, diagnostic: null };
  }
  if (!normalised) {
    return { inputModality: DEFAULT_INPUT_MODALITY, diagnostic: null };
  }
  if (modalityIndex && Object.prototype.hasOwnProperty.call(modalityIndex, normalised)) {
    return {
      inputModality: modalityIndex[normalised],
      diagnostic: null
    };
  }
  return {
    inputModality: DEFAULT_INPUT_MODALITY,
    diagnostic: {
      code: "RESPONSE_FIELD_LABEL_MISMATCH",
      message:
        "Parsed template section label is not listed in commissioned response_fields; defaulting to text input modality.",
      materialId: String(opts.materialId || ""),
      label: normalised
    }
  };
}

/**
 * @param {string[]} parsedLabels
 * @param {Array<{ label?: string }>} commissionedFields
 * @param {string} materialId
 * @param {Object[]} diagnostics
 */
function appendComposeAlignmentDiagnostics(parsedLabels, commissionedFields, materialId, diagnostics) {
  if (!Array.isArray(commissionedFields) || !commissionedFields.length) return;
  var parsedSet = Object.create(null);
  (Array.isArray(parsedLabels) ? parsedLabels : []).forEach(function (label) {
    var normalised = normaliseLabel(label);
    if (normalised) parsedSet[normalised] = true;
  });
  commissionedFields.forEach(function (field) {
    var label = normaliseLabel(field && field.label);
    if (!label || parsedSet[label]) return;
    diagnostics.push({
      code: "COMMISSIONED_RESPONSE_FIELD_UNMATCHED",
      message:
        "Commissioned response_fields label has no matching parsed template section; modality will not be applied.",
      materialId: String(materialId || ""),
      label: label
    });
  });
}

module.exports = {
  INPUT_MODALITIES: INPUT_MODALITIES,
  DEFAULT_INPUT_MODALITY: DEFAULT_INPUT_MODALITY,
  validateResponseFieldsShape: validateResponseFieldsShape,
  getResponseFieldsForMaterial: getResponseFieldsForMaterial,
  buildModalityIndexForMaterial: buildModalityIndexForMaterial,
  resolveInputModalityForLabel: resolveInputModalityForLabel,
  appendComposeAlignmentDiagnostics: appendComposeAlignmentDiagnostics
};
