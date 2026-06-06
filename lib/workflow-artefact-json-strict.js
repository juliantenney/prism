/**
 * Strict JSON-only workflow artefact capture validation (Model Knowledge, Learning Sequence, Learning Outcomes).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_WORKFLOW_ARTEFACT_JSON_STRICT = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var KM_REQUIRED_TOP_KEYS = [
    "concepts",
    "relationships",
    "groupings",
    "processes",
    "misconceptions"
  ];

  var LS_REQUIRED_TOP_KEYS = [
    "sequence_title",
    "total_duration_minutes",
    "timeline",
    "activities_used",
    "activities_omitted",
    "checks"
  ];

  var LO_OUTCOMES_ARRAY_KEYS = ["learning_outcomes", "outcomes"];

  function isCompleteFencedJsonBlock(text) {
    var trimmed = String(text || "").trim();
    return /^```json\s*\r?\n[\s\S]*\r?\n```\s*$/i.test(trimmed);
  }

  function stripTrailingStepFooter(raw) {
    var s = String(raw || "");
    var re = /\r?\nSTEP\s*\d+\s*OUTPUT:[\s\S]*$/i;
    var prev;
    do {
      prev = s;
      s = s.replace(re, "");
    } while (s !== prev);
    if (isCompleteFencedJsonBlock(s)) {
      return String(s).trimEnd();
    }
    var fenceLine = /\r?\n```[a-zA-Z0-9_-]*\s*$/;
    do {
      prev = s;
      s = s.replace(fenceLine, "");
    } while (s !== prev);
    if (/^\s*```[a-zA-Z0-9_-]*\s*$/.test(s)) {
      s = "";
    }
    return s;
  }

  function detectStrictJsonCaptureViolations(trimmed) {
    var text = String(trimmed || "");
    if (!text) return ["empty_capture"];
    if (/^```json\b/i.test(text)) return ["fenced_json_when_raw_required"];
    if (/```/.test(text)) return ["markdown_fence"];
    if (!/^\{/.test(text)) return ["prose_before_json"];
    if (!/\}$/.test(text)) return ["prose_after_json"];
    if (/\/\/|\/\*/.test(text)) return ["json_comments"];
    if (/\r?\nSTEP\s*\d+\s*OUTPUT:/i.test(text)) return ["step_output_footer"];
    return [];
  }

  function parseStrictJsonObjectCapture(raw, sanitizeFn) {
    var sanitized =
      typeof sanitizeFn === "function"
        ? sanitizeFn(raw)
        : stripTrailingStepFooter(raw);
    var trimmed = String(sanitized || "").trim();
    var violations = detectStrictJsonCaptureViolations(trimmed);
    if (violations.length) {
      return {
        ok: false,
        errors: violations,
        message: "Strict JSON capture violation: " + violations.join(", ")
      };
    }
    try {
      var parsed = JSON.parse(trimmed);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return {
          ok: false,
          errors: ["not_json_object"],
          message: "Strict JSON capture must be a single JSON object"
        };
      }
      return { ok: true, parsed: parsed, json: trimmed, errors: [] };
    } catch (err) {
      return {
        ok: false,
        errors: ["invalid_json"],
        message: "Strict JSON parse failed: " + String((err && err.message) || err)
      };
    }
  }

  function normalizeKnowledgeModelShape(obj) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return null;
    var out = Object.assign({}, obj);
    var i;
    for (i = 0; i < KM_REQUIRED_TOP_KEYS.length; i += 1) {
      var key = KM_REQUIRED_TOP_KEYS[i];
      if (!Array.isArray(out[key])) out[key] = [];
    }
    return out;
  }

  function validateKnowledgeModelShape(obj) {
    var normalized = normalizeKnowledgeModelShape(obj);
    if (!normalized) {
      return { ok: false, errors: ["knowledge_model:not_object"] };
    }
    if (!Array.isArray(normalized.concepts)) {
      return { ok: false, errors: ["knowledge_model:missing_concepts_array"] };
    }
    return { ok: true, value: normalized, errors: [] };
  }

  function normalizeLearningSequenceShape(obj) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return null;
    var out = Object.assign({}, obj);
    var i;
    for (i = 0; i < LS_REQUIRED_TOP_KEYS.length; i += 1) {
      var key = LS_REQUIRED_TOP_KEYS[i];
      if (key === "checks") {
        if (!out.checks || typeof out.checks !== "object" || Array.isArray(out.checks)) {
          out.checks = {};
        }
      } else if (!Array.isArray(out[key])) {
        out[key] = [];
      }
    }
    if (typeof out.sequence_title !== "string") out.sequence_title = String(out.sequence_title || "");
    if (typeof out.total_duration_minutes !== "number") {
      var n = Number(out.total_duration_minutes);
      out.total_duration_minutes = isFinite(n) ? n : 0;
    }
    return out;
  }

  function validateLearningSequenceShape(obj) {
    var normalized = normalizeLearningSequenceShape(obj);
    if (!normalized) {
      return { ok: false, errors: ["learning_sequence:not_object"] };
    }
    var errors = [];
    if (!Array.isArray(normalized.timeline)) {
      errors.push("learning_sequence:missing_timeline_array");
    }
    if (!Array.isArray(normalized.activities_used)) {
      errors.push("learning_sequence:missing_activities_used_array");
    }
    if (!Array.isArray(normalized.activities_omitted)) {
      errors.push("learning_sequence:missing_activities_omitted_array");
    }
    if (!normalized.checks || typeof normalized.checks !== "object" || Array.isArray(normalized.checks)) {
      errors.push("learning_sequence:missing_checks_object");
    }
    return errors.length
      ? { ok: false, errors: errors }
      : { ok: true, value: normalized, errors: [] };
  }

  function resolveLearningOutcomesArray(obj) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return null;
    var i;
    for (i = 0; i < LO_OUTCOMES_ARRAY_KEYS.length; i += 1) {
      var key = LO_OUTCOMES_ARRAY_KEYS[i];
      if (Array.isArray(obj[key])) return obj[key];
    }
    return null;
  }

  function normalizeLearningOutcomesShape(obj) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return null;
    var out = Object.assign({}, obj);
    var outcomes = resolveLearningOutcomesArray(out);
    if (!outcomes) {
      out.learning_outcomes = [];
    } else if (!Array.isArray(out.learning_outcomes)) {
      out.learning_outcomes = outcomes.slice();
    }
    return out;
  }

  function validateLearningOutcomesShape(obj) {
    var normalized = normalizeLearningOutcomesShape(obj);
    if (!normalized) {
      return { ok: false, errors: ["learning_outcomes:not_object"] };
    }
    if (!Array.isArray(normalized.learning_outcomes)) {
      return { ok: false, errors: ["learning_outcomes:missing_outcomes_array"] };
    }
    if (!normalized.learning_outcomes.length) {
      return { ok: false, errors: ["learning_outcomes:empty_outcomes_array"] };
    }
    return { ok: true, value: normalized, errors: [] };
  }

  function parseFencedJsonObjectCapture(raw, sanitizeFn, options) {
    var opts = options && typeof options === "object" ? options : {};
    var label = String(opts.label || "Knowledge model");
    var rootObject = String(opts.rootObject || "knowledge_model");
    var sanitized =
      typeof sanitizeFn === "function"
        ? sanitizeFn(raw)
        : stripTrailingStepFooter(raw);
    var trimmed = String(sanitized || "").trim();
    if (!trimmed) {
      return {
        ok: false,
        errors: ["empty_capture"],
        message: label + " capture is empty"
      };
    }
    if (/^\{/.test(trimmed) && !/^```json/i.test(trimmed)) {
      return {
        ok: false,
        errors: ["raw_json_without_fence"],
        message: label + " must be a fenced ```json block, not raw JSON text"
      };
    }
    if (!/^```json\s*\r?\n/i.test(trimmed)) {
      return {
        ok: false,
        errors: ["missing_fenced_json_block"],
        message: label + " output must start with exactly one ```json fenced block"
      };
    }
    if (!/\r?\n```\s*$/.test(trimmed)) {
      return {
        ok: false,
        errors: ["prose_after_fence"],
        message: label + " output must end immediately after the closing ``` fence"
      };
    }
    var fenceCount = (trimmed.match(/```json/gi) || []).length;
    if (fenceCount !== 1) {
      return {
        ok: false,
        errors: ["multiple_fenced_json_blocks"],
        message: label + " output must contain exactly one ```json fenced block"
      };
    }
    var bodyMatch = trimmed.match(/^```json\s*\r?\n([\s\S]*?)\r?\n```\s*$/i);
    if (!bodyMatch) {
      return {
        ok: false,
        errors: ["fenced_block_format"],
        message: label + " fenced block format is invalid"
      };
    }
    try {
      var parsed = JSON.parse(String(bodyMatch[1] || "").trim());
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return {
          ok: false,
          errors: ["not_json_object"],
          message: "Fenced " + rootObject + " content must be a single JSON object"
        };
      }
      return { ok: true, parsed: parsed, json: bodyMatch[1].trim(), errors: [] };
    } catch (err) {
      return {
        ok: false,
        errors: ["invalid_json"],
        message:
          "Fenced " + rootObject + " JSON parse failed: " + String((err && err.message) || err)
      };
    }
  }

  function parseKnowledgeModelCaptureStrict(raw, sanitizeFn) {
    var capture = parseFencedJsonObjectCapture(raw, sanitizeFn, {
      label: "Model Knowledge",
      rootObject: "knowledge_model"
    });
    if (!capture.ok) {
      throw new Error(
        "Model Knowledge capture is not fenced JSON output (" +
          capture.errors.join(", ") +
          ")"
      );
    }
    var shape = validateKnowledgeModelShape(capture.parsed);
    if (!shape.ok) {
      throw new Error("Model Knowledge JSON structure invalid: " + shape.errors.join("; "));
    }
    return shape.value;
  }

  function parseLearningSequenceCaptureStrict(raw, sanitizeFn) {
    var capture = parseFencedJsonObjectCapture(raw, sanitizeFn, {
      label: "Learning Sequence",
      rootObject: "learning_sequence"
    });
    if (!capture.ok) {
      throw new Error(
        "Learning Sequence capture is not fenced JSON output (" +
          capture.errors.join(", ") +
          ")"
      );
    }
    var shape = validateLearningSequenceShape(capture.parsed);
    if (!shape.ok) {
      throw new Error("Learning Sequence JSON structure invalid: " + shape.errors.join("; "));
    }
    return shape.value;
  }

  function parseLearningOutcomesCaptureStrict(raw, sanitizeFn) {
    var capture = parseFencedJsonObjectCapture(raw, sanitizeFn, {
      label: "Learning Outcomes",
      rootObject: "learning_outcomes"
    });
    if (!capture.ok) {
      throw new Error(
        "Learning Outcomes capture is not fenced JSON output (" +
          capture.errors.join(", ") +
          ")"
      );
    }
    var shape = validateLearningOutcomesShape(capture.parsed);
    if (!shape.ok) {
      throw new Error("Learning Outcomes JSON structure invalid: " + shape.errors.join("; "));
    }
    return shape.value;
  }

  function validateWorkflowStepStrictJsonCapture(raw, stepKind, sanitizeFn) {
    var kind = String(stepKind || "").trim().toLowerCase();
    if (
      kind !== "knowledge_model" &&
      kind !== "learning_sequence" &&
      kind !== "learning_outcomes"
    ) {
      return { ok: true, skipped: true, errors: [] };
    }
    var trimmed = String(raw || "").trim();
    if (!trimmed) {
      return { ok: false, errors: ["empty_capture"], message: "Step output is empty" };
    }
    var captureOptions =
      kind === "knowledge_model"
        ? { label: "Model Knowledge", rootObject: "knowledge_model" }
        : kind === "learning_sequence"
        ? { label: "Learning Sequence", rootObject: "learning_sequence" }
        : { label: "Learning Outcomes", rootObject: "learning_outcomes" };
    var capture = parseFencedJsonObjectCapture(raw, sanitizeFn, captureOptions);
    if (!capture.ok) {
      return {
        ok: false,
        errors: capture.errors,
        message: capture.message
      };
    }
    var shape =
      kind === "knowledge_model"
        ? validateKnowledgeModelShape(capture.parsed)
        : kind === "learning_sequence"
        ? validateLearningSequenceShape(capture.parsed)
        : validateLearningOutcomesShape(capture.parsed);
    if (!shape.ok) {
      return {
        ok: false,
        errors: shape.errors,
        message: shape.errors.join("; ")
      };
    }
    return { ok: true, parsed: shape.value, errors: [] };
  }

  function buildStrictKnowledgeModelOutputContractBlock() {
    return [
      "",
      "Output contract (strict — fenced JSON block only):",
      "- Return exactly one markdown fenced JSON block opened with ```json and closed with ```.",
      "- The fenced block body must be the knowledge_model root object as valid JSON.",
      "- Do NOT include any prose, headings, commentary, or explanations before or after the fenced block.",
      "- Do NOT return raw JSON without the ```json fence (unfenced JSON text is invalid).",
      "- Do NOT include JSON comments (no // or block comments).",
      "- Do NOT prefix or suffix workflow metadata (no STEP N OUTPUT lines).",
      "- JSON top-level keys (use empty arrays when none apply): concepts, relationships, groupings, processes, misconceptions.",
      "- Return only the single fenced block."
    ].join("\n");
  }

  function buildStrictLearningSequenceOutputContractBlock() {
    return [
      "",
      "Output contract (strict — fenced JSON block only):",
      "- Return exactly one markdown fenced JSON block opened with ```json and closed with ```.",
      "- The fenced block body must be the learning_sequence root object as valid JSON.",
      "- Do NOT include any prose, headings, commentary, or explanations before or after the fenced block.",
      "- Do NOT return raw JSON without the ```json fence (unfenced JSON text is invalid).",
      "- Do NOT include JSON comments (no // or block comments).",
      "- Do NOT prefix or suffix workflow metadata (no STEP N OUTPUT lines).",
      "- JSON top-level keys: sequence_title, total_duration_minutes, timeline, activities_used, activities_omitted, checks.",
      "- timeline: array of block objects with block_id, start_minute, duration_minutes, phase_type, and action fields.",
      "- Return only the single fenced block."
    ].join("\n");
  }

  function buildStrictLearningOutcomesOutputContractBlock() {
    return [
      "",
      "Output contract (strict — fenced JSON block only):",
      "- Return exactly one markdown fenced JSON block opened with ```json and closed with ```.",
      "- The fenced block body must be the learning_outcomes root object as valid JSON.",
      "- Do NOT include any prose, headings, commentary, or explanations before or after the fenced block.",
      "- Do NOT return raw JSON without the ```json fence (unfenced JSON text is invalid).",
      "- Do NOT include JSON comments (no // or block comments).",
      "- Do NOT prefix or suffix workflow metadata (no STEP N OUTPUT lines).",
      "- JSON top-level keys: learning_outcomes (required array), plus optional learner_level, scope, alignment_notes.",
      "- Each learning_outcomes entry must include statement, related_concepts, cognitive_level, and notes where needed.",
      "- Return only the single fenced block."
    ].join("\n");
  }

  return {
    KM_REQUIRED_TOP_KEYS: KM_REQUIRED_TOP_KEYS,
    LS_REQUIRED_TOP_KEYS: LS_REQUIRED_TOP_KEYS,
    stripTrailingStepFooter: stripTrailingStepFooter,
    detectStrictJsonCaptureViolations: detectStrictJsonCaptureViolations,
    parseStrictJsonObjectCapture: parseStrictJsonObjectCapture,
    parseFencedJsonObjectCapture: parseFencedJsonObjectCapture,
    normalizeKnowledgeModelShape: normalizeKnowledgeModelShape,
    validateKnowledgeModelShape: validateKnowledgeModelShape,
    normalizeLearningSequenceShape: normalizeLearningSequenceShape,
    validateLearningSequenceShape: validateLearningSequenceShape,
    LO_OUTCOMES_ARRAY_KEYS: LO_OUTCOMES_ARRAY_KEYS,
    normalizeLearningOutcomesShape: normalizeLearningOutcomesShape,
    validateLearningOutcomesShape: validateLearningOutcomesShape,
    parseKnowledgeModelCaptureStrict: parseKnowledgeModelCaptureStrict,
    parseLearningSequenceCaptureStrict: parseLearningSequenceCaptureStrict,
    parseLearningOutcomesCaptureStrict: parseLearningOutcomesCaptureStrict,
    validateWorkflowStepStrictJsonCapture: validateWorkflowStepStrictJsonCapture,
    buildStrictKnowledgeModelOutputContractBlock: buildStrictKnowledgeModelOutputContractBlock,
    buildStrictLearningSequenceOutputContractBlock: buildStrictLearningSequenceOutputContractBlock,
    buildStrictLearningOutcomesOutputContractBlock: buildStrictLearningOutcomesOutputContractBlock
  };
});
