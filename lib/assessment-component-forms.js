/**
 * Current first-class Assessment Pack component forms.
 * Deterministic judgement only. Not a plugin framework.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) root.PRISM_ASSESSMENT_COMPONENT_FORMS = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var FORMS = [
    "single_answer_mcq",
    "multiple_answer_mcq",
    "ordering",
    "classification",
    "matching"
  ];

  var LABELS = {
    single_answer_mcq: "Single-answer MCQ",
    multiple_answer_mcq: "Multiple-answer MCQ",
    ordering: "Ordering",
    classification: "Classification",
    matching: "Matching"
  };

  var AFFORDANCES = {
    single_answer_mcq:
      "Use when the evidence is one best or correct interpretation, identification, or application.",
    multiple_answer_mcq:
      "Use when several features, conditions, or examples are valid and partial or extra selection is informative.",
    ordering:
      "Use when the evidence is the sequence of a process, stages, events, or reasoning steps.",
    classification:
      "Use when the evidence is assigning examples or items to conceptual categories.",
    matching:
      "Use when the evidence is associating related concepts, examples, definitions, or causes and effects."
  };

  function emptyAllocation() {
    var out = {};
    FORMS.forEach(function (form) {
      out[form] = 0;
    });
    return out;
  }

  function normalizeAllocation(raw) {
    var out = emptyAllocation();
    var source = raw && typeof raw === "object" ? raw : {};
    FORMS.forEach(function (form) {
      var n = Math.round(Number(source[form]));
      out[form] = isFinite(n) && n > 0 ? n : 0;
    });
    return out;
  }

  function allocationTotal(allocation) {
    var total = 0;
    FORMS.forEach(function (form) {
      total += Number(allocation && allocation[form] ? allocation[form] : 0);
    });
    return total;
  }

  function formatAllocation(allocation) {
    return FORMS.map(function (form) {
      return form + ": " + String(allocation && allocation[form] ? allocation[form] : 0);
    }).join("; ");
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

  return {
    SUPPORTED_FORMS: FORMS.slice(),
    FORM_LABELS: LABELS,
    AFFORDANCES: AFFORDANCES,
    emptyAllocation: emptyAllocation,
    normalizeAllocation: normalizeAllocation,
    allocationTotal: allocationTotal,
    formatAllocation: formatAllocation,
    optionRecords: optionRecords
  };
});
