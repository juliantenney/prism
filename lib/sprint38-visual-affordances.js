/**
 * Sprint 38 — page visual affordance validation and compose normalization.
 * Exposed as window.PRISM_SPRINT38_VISUAL_AFFORDANCES (browser) and module.exports (Node tests).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_SPRINT38_VISUAL_AFFORDANCES = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var SCHEMA_VERSION = "38.4";

  var PURPOSES = [
    "distinction",
    "comparison",
    "classification",
    "mechanism",
    "evidence_structure",
    "data_pattern_reading"
  ];

  var REPRESENTATIONS = [
    "comparison_framework",
    "classification_matrix",
    "causal_model",
    "evidence_t_chart",
    "number_line_segments",
    "ordered_bar_strip",
    "labelled_contrast_panel"
  ];

  var DEFER_REASONS = ["worked_example_sufficient_first", "model_row_sufficient_first"];

  var REJECTION_REASONS = [
    "low_pedagogical_value",
    "debrief_without_new_reasoning",
    "duplicate_existing_structure",
    "decorative_only",
    "spoiler_risk",
    "assessment_text_sufficient",
    "insufficient_source_basis"
  ];

  var ACTIVITY_VISUAL_VALUE_DECISIONS = ["high", "medium", "low", "none"];

  var TIERS = ["essential", "valuable"];

  var LEARNER_STAGES = ["pre_classification", "post_reasoning"];

  var DISCIPLINE_RISK_LEVELS = ["low", "medium", "high"];

  var VISUAL_SLOTS = [
    "activity-after-header",
    "materials-entry",
    "materials-card-grid-after",
    "materials-table-pair-between",
    "assessment-before-checkpoint"
  ];

  var REPRESENTATION_AVOID = [
    "summary_table",
    "filled_worksheet",
    "stock_photography",
    "generic_infographic",
    "unsupported_causal_arrow",
    "numeric_claim_without_source",
    "topic_hero_image",
    "assessment_answer_visual",
    "author_portrait_collage",
    "duplicate_mechanism_and_evidence"
  ];

  var TOPIC_ONLY_RATIONALE_RE =
    /^(?:illustrate|show|depict|visuali[sz]e)\s+(?:the\s+)?(?:topic|subject|theme)\b/i;

  function isNonEmptyString(v) {
    return typeof v === "string" && String(v).trim().length > 0;
  }

  function isStringArrayMin(arr, min) {
    if (!Array.isArray(arr)) return false;
    var n = 0;
    for (var i = 0; i < arr.length; i += 1) {
      if (isNonEmptyString(arr[i])) n += 1;
    }
    return n >= min;
  }

  function inList(value, list) {
    return list.indexOf(String(value || "").trim()) !== -1;
  }

  function normalizeAffordanceIdKey(id) {
    return String(id || "")
      .trim()
      .toLowerCase();
  }

  function isTopicOnlyAffordance(record) {
    if (!record || typeof record !== "object") return true;
    if (record.topic != null && String(record.topic).trim()) return true;
    if (record.visual_decision !== "generate") return false;
    if (!isNonEmptyString(record.purpose) || !isNonEmptyString(record.preferred_representation)) {
      return true;
    }
    var rationale = String(record.rationale || "").trim();
    if (TOPIC_ONLY_RATIONALE_RE.test(rationale)) return true;
    if (/this topic can be illustrated/i.test(rationale)) return true;
    if (/topic.?only|illustrate inflation$/i.test(rationale)) return true;
    return false;
  }

  function validateSpoilerBoundary(record, errors, prefix) {
    if (!record.anti_spoiler) return;
    var sb = record.spoiler_boundary;
    if (!sb || typeof sb !== "object" || Array.isArray(sb)) {
      errors.push(prefix + "spoiler_boundary object required when anti_spoiler is true");
      return;
    }
    ["hide_answers", "hide_classification_keys", "hide_model_solution", "allow_structural_hint"].forEach(
      function (key) {
        if (typeof sb[key] !== "boolean") {
          errors.push(prefix + "spoiler_boundary." + key + " must be boolean");
        }
      }
    );
  }

  function validateGenerateAffordance(record, index) {
    var errors = [];
    var prefix = "visual_affordances[" + index + "]: ";
    var requiredStrings = [
      "purpose",
      "preferred_representation",
      "reasoning_supported",
      "canonical_discipline_note",
      "source_basis",
      "caption_intent"
    ];
    requiredStrings.forEach(function (key) {
      if (!isNonEmptyString(record[key])) errors.push(prefix + key + " is required for generate");
    });
    if (!inList(record.purpose, PURPOSES)) {
      errors.push(prefix + "purpose must be one of: " + PURPOSES.join(", "));
    }
    if (!inList(record.preferred_representation, REPRESENTATIONS)) {
      errors.push(prefix + "preferred_representation must be one of: " + REPRESENTATIONS.join(", "));
    }
    if (!isStringArrayMin(record.representation_avoid, 1)) {
      errors.push(prefix + "representation_avoid must be a non-empty string array");
    } else {
      record.representation_avoid.forEach(function (token, ti) {
        if (!isNonEmptyString(token) || !inList(token, REPRESENTATION_AVOID)) {
          errors.push(
            prefix +
              "representation_avoid[" +
              ti +
              "] must be one of: " +
              REPRESENTATION_AVOID.join(", ")
          );
        }
      });
    }
    if (!isNonEmptyString(record.visual_slot)) {
      errors.push(prefix + "visual_slot is required for generate");
    }
    if (typeof record.anti_spoiler !== "boolean") {
      errors.push(prefix + "anti_spoiler must be boolean");
    }
    validateSpoilerBoundary(record, errors, prefix);
    if (!isStringArrayMin(record.must_show, 1)) {
      errors.push(prefix + "must_show must have at least one entry");
    }
    if (!isStringArrayMin(record.must_not_show, 1)) {
      errors.push(prefix + "must_not_show must have at least one entry");
    }
    if (!isStringArrayMin(record.allowed_claims, 1)) {
      errors.push(prefix + "allowed_claims must have at least one entry");
    }
    if (!isStringArrayMin(record.disallowed_claims, 1)) {
      errors.push(prefix + "disallowed_claims must have at least one entry");
    }
    if (typeof record.requires_exact_data_match !== "boolean") {
      errors.push(prefix + "requires_exact_data_match must be boolean");
    }
    if (
      record.preferred_representation === "number_line_segments" &&
      record.requires_exact_data_match !== true
    ) {
      errors.push(
        prefix + "requires_exact_data_match must be true when preferred_representation is number_line_segments"
      );
    }
    if (!inList(record.discipline_risk_level, DISCIPLINE_RISK_LEVELS)) {
      errors.push(prefix + "discipline_risk_level must be low | medium | high");
    }
    if (!inList(record.tier, TIERS)) {
      errors.push(prefix + "tier must be essential | valuable");
    }
    if (!inList(record.learner_stage, LEARNER_STAGES)) {
      errors.push(prefix + "learner_stage must be pre_classification | post_reasoning");
    }
    if (isNonEmptyString(record.visual_slot) && !inList(record.visual_slot, VISUAL_SLOTS)) {
      errors.push(prefix + "visual_slot is not a known Sprint 36 slot: " + record.visual_slot);
    }
    if (isTopicOnlyAffordance(record)) {
      errors.push(prefix + "topic-only or under-specified generate affordance rejected");
    }
    return errors;
  }

  function validateDeferAffordance(record, index) {
    var errors = [];
    var prefix = "visual_affordances[" + index + "]: ";
    if (!inList(record.defer_reason, DEFER_REASONS)) {
      errors.push(prefix + "defer_reason must be one of: " + DEFER_REASONS.join(", "));
    }
    if (isNonEmptyString(record.purpose)) {
      errors.push(prefix + "defer must not include purpose");
    }
    if (isNonEmptyString(record.preferred_representation)) {
      errors.push(prefix + "defer must not include preferred_representation");
    }
    if (isNonEmptyString(record.visual_slot)) {
      errors.push(prefix + "defer must not include visual_slot");
    }
    return errors;
  }

  function validateRejectAffordance(record, index) {
    var errors = [];
    var prefix = "visual_affordances[" + index + "]: ";
    if (!inList(record.rejection_reason, REJECTION_REASONS)) {
      errors.push(prefix + "rejection_reason must be one of: " + REJECTION_REASONS.join(", "));
    }
    if (isNonEmptyString(record.purpose)) {
      errors.push(prefix + "reject must not include purpose");
    }
    if (isNonEmptyString(record.preferred_representation)) {
      errors.push(prefix + "reject must not include preferred_representation");
    }
    if (isNonEmptyString(record.visual_slot)) {
      errors.push(prefix + "reject must not include visual_slot");
    }
    return errors;
  }

  function validateAffordanceEnvelope(record, index) {
    var errors = [];
    var prefix = "visual_affordances[" + index + "]: ";
    if (!isNonEmptyString(record.affordance_id)) {
      errors.push(prefix + "affordance_id is required");
    }
    if (!isNonEmptyString(record.activity_id)) {
      errors.push(prefix + "activity_id is required");
    }
    if (!isNonEmptyString(record.rationale)) {
      errors.push(prefix + "rationale is required");
    }
    var decision = String(record.visual_decision || "").trim();
    if (decision !== "generate" && decision !== "defer" && decision !== "reject") {
      errors.push(prefix + 'visual_decision must be "generate", "defer", or "reject"');
      return errors;
    }
    if (decision === "generate") {
      errors = errors.concat(validateGenerateAffordance(record, index));
    } else if (decision === "defer") {
      errors = errors.concat(validateDeferAffordance(record, index));
    } else {
      errors = errors.concat(validateRejectAffordance(record, index));
    }
    return errors;
  }

  function validateActivitiesVisualReview(reviews) {
    var errors = [];
    if (!Array.isArray(reviews)) {
      return { valid: false, errors: ["activities_visual_review must be an array"] };
    }
    var seen = {};
    reviews.forEach(function (row, index) {
      var prefix = "activities_visual_review[" + index + "]: ";
      if (!row || typeof row !== "object") {
        errors.push(prefix + "must be an object");
        return;
      }
      if (!isNonEmptyString(row.activity_id)) {
        errors.push(prefix + "activity_id is required");
        return;
      }
      var aid = normalizeAffordanceIdKey(row.activity_id);
      if (seen[aid]) errors.push(prefix + "duplicate activity_id " + row.activity_id);
      seen[aid] = true;
      var gate = row.activity_visual_value;
      if (!gate || typeof gate !== "object") {
        errors.push(prefix + "activity_visual_value is required");
        return;
      }
      if (!inList(gate.decision, ACTIVITY_VISUAL_VALUE_DECISIONS)) {
        errors.push(
          prefix + "activity_visual_value.decision must be high | medium | low | none"
        );
      }
      if (!isNonEmptyString(gate.rationale)) {
        errors.push(prefix + "activity_visual_value.rationale is required");
      }
    });
    return { valid: errors.length === 0, errors: errors };
  }

  function validatePageVisualAffordances(page) {
    var errors = [];
    if (!page || typeof page !== "object") {
      return { valid: false, errors: ["page must be an object"], records: [], review: null };
    }
    var reviews = page.activities_visual_review;
    var affordances = page.visual_affordances;
    if (reviews != null) {
      var reviewResult = validateActivitiesVisualReview(reviews);
      if (!reviewResult.valid) errors = errors.concat(reviewResult.errors);
    }
    var records = Array.isArray(affordances) ? affordances : [];
    var validRecords = [];
    var invalidRecords = [];
    var seenIds = {};
    records.forEach(function (record, index) {
      if (!record || typeof record !== "object") {
        invalidRecords.push({ index: index, record: record, errors: ["must be an object"] });
        return;
      }
      var idKey = normalizeAffordanceIdKey(record.affordance_id);
      if (idKey && seenIds[idKey]) {
        invalidRecords.push({
          index: index,
          record: record,
          errors: ["duplicate affordance_id " + record.affordance_id]
        });
        return;
      }
      if (idKey) seenIds[idKey] = true;
      var rowErrors = validateAffordanceEnvelope(record, index);
      if (rowErrors.length) {
        invalidRecords.push({ index: index, record: record, errors: rowErrors });
      } else {
        validRecords.push(record);
      }
    });
    invalidRecords.forEach(function (inv) {
      errors = errors.concat(inv.errors);
    });
    return {
      valid: errors.length === 0,
      errors: errors,
      validRecords: validRecords,
      invalidRecords: invalidRecords,
      activitiesVisualReview: Array.isArray(reviews) ? reviews : []
    };
  }

  function applyToComposedPage(page, options) {
    if (!page || typeof page !== "object") return page;
    var opts = options && typeof options === "object" ? options : {};
    var next = JSON.parse(JSON.stringify(page));
    if (!Array.isArray(next.visual_affordances)) next.visual_affordances = [];
    if (!Array.isArray(next.activities_visual_review)) next.activities_visual_review = [];

    var validation = validatePageVisualAffordances(next);
    var kept = validation.validRecords || [];
    var dropped = validation.invalidRecords || [];

    if (opts.strictValidation && dropped.length) {
      if (!next.generation_notes || typeof next.generation_notes !== "object") {
        next.generation_notes = {};
      }
      if (!Array.isArray(next.generation_notes.limitations)) {
        next.generation_notes.limitations = [];
      }
      dropped.forEach(function (d) {
        var line =
          "[PRISM visual affordance] Dropped invalid affordance " +
          (d.record && d.record.affordance_id ? d.record.affordance_id : "#" + d.index) +
          ": " +
          (d.errors || []).join("; ");
        if (next.generation_notes.limitations.indexOf(line) === -1) {
          next.generation_notes.limitations.push(line);
        }
      });
    }

    next.visual_affordances = kept;
    next.visual_affordance_schema_version = SCHEMA_VERSION;

    if (!next.generation_notes || typeof next.generation_notes !== "object") {
      next.generation_notes = {};
    }
    next.generation_notes.visual_affordance_validation = {
      valid: validation.valid,
      kept_count: kept.length,
      dropped_count: dropped.length,
      errors: validation.errors.slice(0, 50)
    };

    if (!next.constraints_applied || typeof next.constraints_applied !== "object") {
      next.constraints_applied = {};
    }
    next.constraints_applied.visual_affordance_schema_version = SCHEMA_VERSION;

    return next;
  }

  function findAffordance(page, matcher) {
    var list = page && Array.isArray(page.visual_affordances) ? page.visual_affordances : [];
    for (var i = 0; i < list.length; i += 1) {
      if (matcher(list[i], i)) return list[i];
    }
    return null;
  }

  function normalizeActivityIdKey(id) {
    return String(id == null ? "" : id).trim().toLowerCase();
  }

  function normalizeVisualSlotKey(slot) {
    return String(slot == null ? "" : slot)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-");
  }

  /**
   * Renderer plan: legacy preserves Sprint 36 heuristics; authoritative uses generate+visual_slot only.
   */
  function buildVisualAffordanceRenderPlan(page) {
    var list =
      page && Array.isArray(page.visual_affordances) ? page.visual_affordances : [];
    if (!list.length) {
      return { legacy: true, slotGenerate: {} };
    }
    var slotGenerate = {};
    list.forEach(function (row) {
      if (!row || typeof row !== "object") return;
      if (String(row.visual_decision || "").trim() !== "generate") return;
      var slot = normalizeVisualSlotKey(row.visual_slot);
      if (!slot) return;
      var aid = normalizeActivityIdKey(row.activity_id);
      if (!aid) return;
      var key = aid + "|" + slot;
      slotGenerate[key] = {
        affordance_id: String(row.affordance_id || "").trim(),
        activity_id: String(row.activity_id || "").trim(),
        visual_slot: slot,
        purpose: row.purpose,
        preferred_representation: row.preferred_representation
      };
    });
    return {
      legacy: false,
      slotGenerate: slotGenerate,
      affordance_count: list.length
    };
  }

  function resolveSlotGenerate(plan, activityId, slot) {
    if (!plan || plan.legacy) return null;
    var aid = normalizeActivityIdKey(activityId);
    var slotId = normalizeVisualSlotKey(slot);
    if (!aid || !slotId) return null;
    return plan.slotGenerate[aid + "|" + slotId] || null;
  }

  /**
   * VEU handover modes (38-5). Used by tests and operator documentation.
   */
  function detectVisualAffordanceHandoverMode(page) {
    var list =
      page && Array.isArray(page.visual_affordances) ? page.visual_affordances : [];
    if (!list.length) return "legacy";
    var reviews =
      page && Array.isArray(page.activities_visual_review)
        ? page.activities_visual_review
        : [];
    var schema = String(
      (page && page.visual_affordance_schema_version) || ""
    ).trim();
    if (schema === SCHEMA_VERSION && reviews.length > 0) {
      var envelopeOk = true;
      for (var i = 0; i < list.length; i += 1) {
        var row = list[i];
        if (
          !row ||
          !isNonEmptyString(row.affordance_id) ||
          !isNonEmptyString(row.activity_id) ||
          !isNonEmptyString(row.rationale) ||
          !isNonEmptyString(row.visual_decision)
        ) {
          envelopeOk = false;
          break;
        }
      }
      if (envelopeOk) {
        var validation = validatePageVisualAffordances(page);
        if (validation.valid) return "authoritative";
      }
    }
    return "hybrid";
  }

  function loadVeuBundle(version) {
    var fs;
    var path;
    try {
      fs = require("fs");
      path = require("path");
    } catch (_e) {
      return null;
    }
    var file =
      version === "1.2.1"
        ? "visual-enhancement-utility-v1.2.1.json"
        : "visual-enhancement-utility-v1.2.json";
    var p = path.join(
      __dirname,
      "..",
      "utilities",
      "visual-enhancement-utility",
      file
    );
    try {
      return JSON.parse(fs.readFileSync(p, "utf8"));
    } catch (_e2) {
      return null;
    }
  }

  function getVeuStepPrompt(bundle, canonicalStepId) {
    if (!bundle || !Array.isArray(bundle.workflows) || !bundle.workflows[0]) {
      return "";
    }
    var steps = bundle.workflows[0].steps || [];
    for (var i = 0; i < steps.length; i += 1) {
      if (steps[i].canonical_step_id === canonicalStepId) {
        return String(steps[i].override_prompt_body || "");
      }
    }
    return "";
  }

  return {
    SCHEMA_VERSION: SCHEMA_VERSION,
    PURPOSES: PURPOSES,
    REPRESENTATIONS: REPRESENTATIONS,
    REPRESENTATION_AVOID: REPRESENTATION_AVOID,
    DEFER_REASONS: DEFER_REASONS,
    REJECTION_REASONS: REJECTION_REASONS,
    ACTIVITY_VISUAL_VALUE_DECISIONS: ACTIVITY_VISUAL_VALUE_DECISIONS,
    VISUAL_SLOTS: VISUAL_SLOTS,
    isTopicOnlyAffordance: isTopicOnlyAffordance,
    validateAffordanceEnvelope: validateAffordanceEnvelope,
    validateActivitiesVisualReview: validateActivitiesVisualReview,
    validatePageVisualAffordances: validatePageVisualAffordances,
    applyToComposedPage: applyToComposedPage,
    findAffordance: findAffordance,
    buildVisualAffordanceRenderPlan: buildVisualAffordanceRenderPlan,
    resolveSlotGenerate: resolveSlotGenerate,
    normalizeActivityIdKey: normalizeActivityIdKey,
    normalizeVisualSlotKey: normalizeVisualSlotKey,
    detectVisualAffordanceHandoverMode: detectVisualAffordanceHandoverMode,
    loadVeuBundle: loadVeuBundle,
    getVeuStepPrompt: getVeuStepPrompt
  };
});
