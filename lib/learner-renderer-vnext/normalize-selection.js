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

/**
 * Extract numbered learner-facing stems from a multi-question prompt.
 * Example: "Intro\n\n1. Allocation\n\n2. Applicability" → stems + leftover intro.
 */
function extractNumberedSelectionStems(prompt) {
  var text = String(prompt || "").replace(/\r\n/g, "\n").trim();
  if (!text) return { intro: "", stems: [] };
  var stemRe = /^(\d+)[.)]\s+(.+)$/gm;
  var matches = [];
  var m;
  while ((m = stemRe.exec(text)) !== null) {
    matches.push({
      index: m.index,
      end: m.index + m[0].length,
      number: Number(m[1]),
      stem: String(m[2] || "").trim()
    });
  }
  if (matches.length < 2) return { intro: text, stems: [] };
  var stems = matches.map(function (row) {
    return row.stem;
  });
  var intro = text.slice(0, matches[0].index).trim();
  return { intro: intro, stems: stems };
}

/**
 * Group options into separate decision rows when keys restart (A,B,C,A,B,C…).
 * Returns null when the list is not a repeated-key multi-question flatten.
 */
function groupOptionsByRepeatedKeys(options) {
  var list = Array.isArray(options) ? options : [];
  if (list.length < 4) return null;
  var groups = [];
  var current = [];
  var seen = Object.create(null);
  var i;
  for (i = 0; i < list.length; i += 1) {
    var option = list[i];
    var key = String((option && option.key) || "").trim();
    if (!key) key = String((option && option.text) || "").trim();
    if (current.length > 0 && key && seen[key]) {
      groups.push(current);
      current = [option];
      seen = Object.create(null);
      seen[key] = true;
    } else {
      current.push(option);
      if (key) seen[key] = true;
    }
  }
  if (current.length) groups.push(current);
  if (groups.length < 2) return null;
  if (
    groups.some(function (group) {
      return !group || group.length < 2;
    })
  ) {
    return null;
  }
  return groups;
}

/**
 * Split equal-sized option chunks when a multi-stem prompt is present.
 */
function groupOptionsByStemCount(options, stemCount) {
  var list = Array.isArray(options) ? options : [];
  var count = Number(stemCount) || 0;
  if (count < 2 || list.length < count * 2) return null;
  if (list.length % count !== 0) return null;
  var size = list.length / count;
  if (size < 2) return null;
  var groups = [];
  var i;
  for (i = 0; i < count; i += 1) {
    groups.push(list.slice(i * size, (i + 1) * size));
  }
  return groups;
}

/**
 * Parse option labels that embed the question number + stem:
 * "1. Allocation credibility — Extract A provides…"
 * Returns null when the label is not a numbered multi-question option.
 */
function parseLeadingQuestionOptionLabel(text) {
  var value = String(text == null ? "" : text).replace(/\s+/g, " ").trim();
  if (!value) return null;
  var withBody = value.match(/^(\d+)[.)]\s+(.+?)\s*[—–\-:]+\s+(.+)$/);
  if (withBody) {
    return {
      number: Number(withBody[1]),
      stem: String(withBody[2] || "").trim(),
      body: String(withBody[3] || "").trim()
    };
  }
  var stemOnly = value.match(/^(\d+)[.)]\s+(.+)$/);
  if (!stemOnly) return null;
  return {
    number: Number(stemOnly[1]),
    stem: String(stemOnly[2] || "").trim(),
    body: String(stemOnly[2] || "").trim()
  };
}

/**
 * Group options by leading "N. Stem — …" labels (unique keys, question # in text).
 * Clinical C3 appraisal shape: design_a/app_a/… with "1. Allocation…", "2. Applicability…".
 */
function groupOptionsByLeadingQuestionNumber(options) {
  var list = Array.isArray(options) ? options : [];
  if (list.length < 4) return null;
  var parsed = list.map(function (option) {
    var meta = parseLeadingQuestionOptionLabel(option && option.text);
    if (!meta || !Number.isFinite(meta.number) || meta.number < 1) return null;
    return {
      option: option,
      number: meta.number,
      stem: meta.stem,
      body: meta.body
    };
  });
  if (
    parsed.some(function (row) {
      return !row;
    })
  ) {
    return null;
  }
  var groups = [];
  var stems = [];
  var current = [];
  var currentNumber = 0;
  var currentStem = "";
  var i;
  for (i = 0; i < parsed.length; i += 1) {
    var row = parsed[i];
    if (current.length && row.number !== currentNumber) {
      if (row.number !== currentNumber + 1) return null;
      groups.push(current);
      stems.push(currentStem);
      current = [];
    }
    if (!current.length) {
      currentNumber = row.number;
      currentStem = row.stem;
    } else if (row.stem && currentStem && row.stem !== currentStem) {
      return null;
    }
    current.push({
      key: row.option.key,
      text: row.body || row.option.text,
      _questionNumber: row.number,
      _questionStem: row.stem
    });
  }
  if (current.length) {
    groups.push(current);
    stems.push(currentStem);
  }
  if (groups.length < 2) return null;
  if (
    groups.some(function (group) {
      return !group || group.length < 2;
    })
  ) {
    return null;
  }
  // Require contiguous numbering starting at 1.
  if (parsed[0].number !== 1) return null;
  return { groups: groups, stems: stems };
}

/**
 * Expand one flattened single_select payload into one selection per decision.
 * No-op (returns [selection]) when the payload is already a single decision.
 *
 * @param {object} selection
 * @returns {object[]}
 */
function expandFlattenedSingleSelectSelection(selection) {
  if (!selection || typeof selection !== "object") return [];
  var form = resolveForm(selection.form || selection.surfaceKind || selection.item_type);
  if (form && form !== types.SURFACE_KIND.SINGLE_SELECT) {
    return [selection];
  }
  var options = optionRecords(selection.options || selection.choices);
  if (options.length < 4) return [selection];

  var stemInfo = extractNumberedSelectionStems(
    selection.prompt || selection.stem || selection.question || ""
  );
  var labelGroups = groupOptionsByLeadingQuestionNumber(options);
  var groups =
    (labelGroups && labelGroups.groups) ||
    groupOptionsByRepeatedKeys(options) ||
    groupOptionsByStemCount(options, stemInfo.stems.length);
  if (!groups || groups.length < 2) return [selection];

  var stemsFromLabels = (labelGroups && labelGroups.stems) || [];

  return groups.map(function (groupOptions, index) {
    var stem =
      (stemsFromLabels[index] && String(stemsFromLabels[index]).trim()) ||
      (stemInfo.stems[index] && String(stemInfo.stems[index]).trim()) ||
      "Question " + String(index + 1);
    var next = Object.assign({}, selection, {
      form: selection.form || "single_select",
      prompt: stem,
      label: stem,
      options: groupOptions.map(function (row) {
        return { key: row.key, text: row.text };
      })
    });
    // A single parent correct_answer cannot be safely attributed after a flatten.
    delete next.correct_answer;
    delete next.correctAnswer;
    delete next.correct_answer_text;
    if (next.judgement && typeof next.judgement === "object") {
      next.judgement = Object.assign({}, next.judgement);
      delete next.judgement.correct_answer;
    }
    return next;
  });
}

module.exports = {
  normalizeSelectionSemantics: normalizeSelectionSemantics,
  resolveForm: resolveForm,
  optionRecords: optionRecords,
  FORM_ALIASES: FORM_ALIASES,
  extractNumberedSelectionStems: extractNumberedSelectionStems,
  groupOptionsByRepeatedKeys: groupOptionsByRepeatedKeys,
  parseLeadingQuestionOptionLabel: parseLeadingQuestionOptionLabel,
  groupOptionsByLeadingQuestionNumber: groupOptionsByLeadingQuestionNumber,
  expandFlattenedSingleSelectSelection: expandFlattenedSingleSelectSelection
};
