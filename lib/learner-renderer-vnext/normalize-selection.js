"use strict";

/**
 * Normalise Practice selection materials / response parts into a durable model.
 * Forms: single_select | multi_select | matching.
 * Determinate keys are optional — omit them for judgement without a forced key.
 */

var types = require("./response-part-types");

var FORM_ALIASES = Object.freeze({
  single_select: types.SURFACE_KIND.SINGLE_SELECT,
  single_answer_mcq: types.SURFACE_KIND.SINGLE_SELECT,
  single: types.SURFACE_KIND.SINGLE_SELECT,
  mcq: types.SURFACE_KIND.SINGLE_SELECT,
  multi_select: types.SURFACE_KIND.MULTI_SELECT,
  multiple_answer_mcq: types.SURFACE_KIND.MULTI_SELECT,
  multiple_select: types.SURFACE_KIND.MULTI_SELECT,
  multi: types.SURFACE_KIND.MULTI_SELECT,
  matching: types.SURFACE_KIND.MATCHING,
  match: types.SURFACE_KIND.MATCHING
});

function slugify(value, fallback) {
  var slug = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || String(fallback || "item");
}

function optionRecords(raw) {
  if (Array.isArray(raw)) {
    return raw
      .map(function (option, index) {
        if (option && typeof option === "object") {
          var key = String(option.key || option.id || option.value || "").trim();
          var text = String(
            option.text || option.label || option.value || option.prompt || ""
          ).trim();
          if (!key) key = text || "option-" + String(index + 1);
          if (!text) text = key;
          return { key: key, text: text };
        }
        var plain = String(option == null ? "" : option).trim();
        if (!plain || plain === "[object Object]") return null;
        return { key: plain, text: plain };
      })
      .filter(Boolean);
  }
  if (raw && typeof raw === "object") {
    return Object.keys(raw)
      .sort()
      .map(function (key) {
        var text = String(raw[key] == null ? "" : raw[key]).trim();
        return text ? { key: String(key), text: text } : null;
      })
      .filter(Boolean);
  }
  return [];
}

function pairRows(raw, textKey) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(function (row, index) {
      if (!row || typeof row !== "object") {
        var plain = String(row == null ? "" : row).trim();
        if (!plain) return null;
        return { id: slugify(plain, "row-" + (index + 1)), text: plain };
      }
      var id = String(row.id || row.key || "").trim();
      var text = String(row[textKey] || row.text || row.label || "").trim();
      if (!id) id = slugify(text, "row-" + (index + 1));
      if (!text) text = id;
      return { id: id, text: text };
    })
    .filter(Boolean);
}

function resolveForm(raw) {
  var key = String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  return FORM_ALIASES[key] || "";
}

function looksLikeMaterialWrapperWithoutForm(source) {
  var mt = String(source.material_type || source.authoredType || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  if (mt === "selection") return true;
  if (source.body_format != null || typeof source.body === "string") {
    if (source.material_id || source.materialId || source.id) {
      var hasFormHints =
        resolveForm(source.form || source.surfaceKind || source.item_type) ||
        Array.isArray(source.options) ||
        Array.isArray(source.left) ||
        Array.isArray(source.right);
      return !hasFormHints;
    }
  }
  return false;
}

function readSelectionPayload(source) {
  if (!source || typeof source !== "object") return null;
  if (source.selection && typeof source.selection === "object") return source.selection;
  if (source.decision && typeof source.decision === "object") return source.decision;
  // Material shell with Markdown-only body must not masquerade as a selection payload
  // (that path produced SELECTION_FORM_UNSUPPORTED for C3 "Form: single_select" prose).
  if (looksLikeMaterialWrapperWithoutForm(source)) return null;
  return source;
}

/**
 * @param {object} source material, part.selection, or raw selection object
 * @param {{ activityId?: string, materialId?: string }} [options]
 * @returns {{ ok: true, model: object }|{ ok: false, diagnostics: object[] }}
 */
function normalizeSelectionSemantics(source, options) {
  var opts = options || {};
  var payload = readSelectionPayload(source);
  var diagnostics = [];
  if (!payload || typeof payload !== "object") {
    return {
      ok: false,
      diagnostics: [
        {
          code: "SELECTION_PAYLOAD_MISSING",
          message:
            "Selection material requires a sibling selection object with form " +
            "(single_select|multi_select|matching), prompt, and options " +
            "(or left/right for matching). Do not encode the interactive form only as Markdown \"Form:\" prose.",
          materialId: opts.materialId || ""
        }
      ]
    };
  }

  var form = resolveForm(
    payload.form || payload.surfaceKind || payload.item_type || payload.type || ""
  );
  if (!form) {
    return {
      ok: false,
      diagnostics: [
        {
          code: "SELECTION_FORM_UNSUPPORTED",
          message:
            "Selection form must be single_select, multi_select, or matching.",
          materialId: opts.materialId || "",
          form: String(payload.form || "")
        }
      ]
    };
  }

  var prompt = String(
    payload.prompt ||
      payload.stem ||
      payload.question ||
      (source && (source.title || source.body)) ||
      ""
  ).trim();
  var label = String(payload.label || (source && source.title) || "Your decision").trim();
  var rationale = String(
    payload.feedback ||
      payload.rationale ||
      payload.explanation ||
      payload.feedback_note ||
      ""
  ).trim();

  var model = {
    form: form,
    surfaceKind: form,
    label: label || "Your decision",
    prompt: prompt,
    rationale: rationale,
    options: [],
    correctAnswer: "",
    correctAnswers: [],
    left: [],
    right: [],
    pairs: {},
    determinate: false,
    materialId: String(opts.materialId || (source && source.id) || "").trim()
  };

  if (form === types.SURFACE_KIND.MATCHING) {
    var left = pairRows(payload.left || (payload.prompt && payload.prompt.left), "text");
    var right = pairRows(payload.right || (payload.prompt && payload.prompt.right), "text");
    var pairs =
      payload.pairs && typeof payload.pairs === "object"
        ? payload.pairs
        : payload.judgement &&
            payload.judgement.pairs &&
            typeof payload.judgement.pairs === "object"
          ? payload.judgement.pairs
          : {};
    if (left.length < 1 || right.length < 1) {
      diagnostics.push({
        code: "SELECTION_MATCHING_SIDES_MISSING",
        message: "Matching selections require left and right items.",
        materialId: model.materialId
      });
      return { ok: false, diagnostics: diagnostics };
    }
    if (!prompt) {
      diagnostics.push({
        code: "SELECTION_PROMPT_MISSING",
        message: "Selection requires a learner-facing prompt or stem.",
        materialId: model.materialId
      });
      return { ok: false, diagnostics: diagnostics };
    }
    model.left = left;
    model.right = right;
    model.pairs = pairs && typeof pairs === "object" ? pairs : {};
    model.determinate = Object.keys(model.pairs).length > 0;
    return { ok: true, model: model, diagnostics: diagnostics };
  }

  var optionsList = optionRecords(payload.options || payload.choices);
  if (optionsList.length < 2) {
    diagnostics.push({
      code: "SELECTION_OPTIONS_MISSING",
      message: "Selection requires at least two options.",
      materialId: model.materialId
    });
    return { ok: false, diagnostics: diagnostics };
  }
  if (!prompt) {
    diagnostics.push({
      code: "SELECTION_PROMPT_MISSING",
      message: "Selection requires a learner-facing prompt or stem.",
      materialId: model.materialId
    });
    return { ok: false, diagnostics: diagnostics };
  }

  model.options = optionsList;

  if (form === types.SURFACE_KIND.MULTI_SELECT) {
    var multi =
      payload.correct_answers ||
      (payload.judgement && payload.judgement.correct_answers) ||
      payload.correctAnswers ||
      [];
    model.correctAnswers = Array.isArray(multi)
      ? multi.map(String).map(function (value) {
          return value.trim();
        }).filter(Boolean)
      : [];
    model.determinate = model.correctAnswers.length > 0;
  } else {
    var single = String(
      payload.correct_answer ||
        payload.correct_answer_text ||
        (payload.judgement && payload.judgement.correct_answer) ||
        payload.correctAnswer ||
        ""
    ).trim();
    if (single) {
      var matched = optionsList.find(function (option) {
        return (
          option.key === single ||
          option.text === single ||
          option.text.toLowerCase() === single.toLowerCase()
        );
      });
      if (!matched) {
        diagnostics.push({
          code: "SELECTION_CORRECT_ANSWER_MISMATCH",
          message: "correct_answer does not match any option key or text.",
          materialId: model.materialId,
          correctAnswer: single
        });
        return { ok: false, diagnostics: diagnostics };
      }
      model.correctAnswer = matched.key;
      model.determinate = true;
    }
  }

  return { ok: true, model: model, diagnostics: diagnostics };
}

module.exports = {
  normalizeSelectionSemantics: normalizeSelectionSemantics,
  resolveForm: resolveForm,
  optionRecords: optionRecords,
  FORM_ALIASES: FORM_ALIASES
};
