/**
 * Sprint 56F Phase 4 — GAM enrich-in-place for vNext page artefacts.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "object" || !module.exports) {
    if (typeof root !== "undefined") {
      root.PRISM_PAGE_GAM_ENRICH = api;
    }
    return;
  }
  module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var ENRICH_VERSION = "56F-GAM-ENRICH-1";
  var SCHEMA_VERSION = "2.0.0";
  var BODY_FORMAT = "markdown";
  var BODY_FORMAT_JSON = "json";
  var GUIDED_REVIEW_MODE = "guided_criteria";
  var GUIDED_CRITERIA_MIN = 2;
  var GUIDED_CRITERIA_MAX = 5;
  var EVIDENCE_KIND = "learner_evidence";
  var PROVENANCE_SIMULATION = "system_generated_simulation";
  var PROVENANCE_SOURCE_BOUND = "conversation_attachment";

  function getLdMathRenderApi() {
    if (typeof require === "function") {
      try {
        return require("./ld-math-render.js");
      } catch (_) {}
    }
    if (typeof globalThis !== "undefined" && globalThis.PRISM_LD_MATH_RENDER) {
      return globalThis.PRISM_LD_MATH_RENDER;
    }
    if (typeof window !== "undefined" && window.PRISM_LD_MATH_RENDER) {
      return window.PRISM_LD_MATH_RENDER;
    }
    return null;
  }

  function pushMaterialMathIntegrityErrors(material, activityIndex, materialIndex, errors) {
    if (!material || !hasNonEmptyString(material.body)) return;
    var mathApi = getLdMathRenderApi();
    if (!mathApi || typeof mathApi.validateLearnerFacingMathIntegrity !== "function") {
      return;
    }
    var result = mathApi.validateLearnerFacingMathIntegrity(material.body);
    if (!result || result.ok) return;
    var materialLabel = hasNonEmptyString(material.material_id)
      ? String(material.material_id)
      : "#" + String(materialIndex);
    (result.issues || []).forEach(function (issue) {
      errors.push(
        "activities[" +
          activityIndex +
          "].materials[" +
          materialIndex +
          "] (" +
          materialLabel +
          "): math integrity — " +
          String((issue && issue.message) || (issue && issue.code) || "invalid TeX")
      );
    });
  }
  var GAM_DLA_OWNED_STRING_FIELDS = [
    "learner_task",
    "expected_output",
    "activity_preamble",
    "reasoning_orientation",
    "self_explanation_prompt",
    "evidence_use_prompt",
    "argument_structure_hint",
    "conceptual_contrast_prompt",
    "disciplinary_lens",
    "transfer_or_application_task",
    "uncertainty_tension_prompt",
    "prior_knowledge_activation",
    "study_orientation",
    "intellectual_frame",
    "intellectual_coherence_bridge",
    "support_note"
  ];

  var GAM_DLA_OWNED_JSON_FIELDS = [
    "scaffold_hint_sequence",
    "required_materials",
    "learning_outcome_ids",
    "episode_plan",
    "evidence_decision",
    "task_material_decision"
  ];

  var GAM_PRESERVED_TOP_LEVEL_KEYS = [
    "artifact_type",
    "schema_version",
    "title",
    "audience",
    "page_profile",
    "learning_outcomes",
    "episode_plans"
  ];

  function deepClone(value) {
    if (value == null || typeof value !== "object") return value;
    if (Array.isArray(value)) return value.map(deepClone);
    var out = {};
    Object.keys(value).forEach(function (key) {
      out[key] = deepClone(value[key]);
    });
    return out;
  }

  function nonEmptyString(value, fallback) {
    var text = String(value == null ? "" : value).trim();
    return text || fallback;
  }

  function hasNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  function isPlainObject(value) {
    return !!value && typeof value === "object" && !Array.isArray(value);
  }

  function normalizeMaterialTypeToken(value) {
    return String(value == null ? "" : value)
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_");
  }

  function isChecklistMaterialType(materialType) {
    var token = normalizeMaterialTypeToken(materialType);
    return token === "checklist" || token === "checklists" || token === "rubric";
  }

  function materialHasPresentBody(body) {
    if (typeof body === "string") return body.trim().length > 0;
    return isPlainObject(body);
  }

  function parseGuidedChecklistBodyCandidate(body) {
    if (isPlainObject(body)) {
      return { ok: true, value: body };
    }
    if (typeof body !== "string" || !body.trim()) {
      return { ok: false, error: "body required" };
    }
    try {
      var parsed = JSON.parse(body);
      if (!isPlainObject(parsed)) {
        return { ok: false, error: "body must be a JSON object" };
      }
      return { ok: true, value: parsed };
    } catch (_err) {
      return { ok: false, error: "body must be valid JSON" };
    }
  }

  function isAcceptedGuidedReviewMode(value) {
    var mode = String(value == null ? "" : value)
      .trim()
      .toLowerCase();
    return mode === GUIDED_REVIEW_MODE || mode === "guided_review";
  }

  /**
   * Field-specific capture validation for guided-review checklist JSON bodies.
   * Object-form and JSON-string-form bodies are both accepted.
   */
  function pushGuidedChecklistBodyErrors(body, pathPrefix, errors) {
    var parsed = parseGuidedChecklistBodyCandidate(body);
    if (!parsed.ok) {
      errors.push(pathPrefix + "." + parsed.error);
      return;
    }
    var payload = parsed.value;
    if (!isAcceptedGuidedReviewMode(payload.review_mode)) {
      errors.push(pathPrefix + '.body.review_mode must be "' + GUIDED_REVIEW_MODE + '"');
      return;
    }
    if (!Array.isArray(payload.criteria)) {
      errors.push(
        pathPrefix +
          ".body.criteria must be an array of " +
          GUIDED_CRITERIA_MIN +
          " to " +
          GUIDED_CRITERIA_MAX +
          " items"
      );
      return;
    }
    if (
      payload.criteria.length < GUIDED_CRITERIA_MIN ||
      payload.criteria.length > GUIDED_CRITERIA_MAX
    ) {
      errors.push(
        pathPrefix +
          ".body.criteria must contain " +
          GUIDED_CRITERIA_MIN +
          " to " +
          GUIDED_CRITERIA_MAX +
          " items"
      );
      return;
    }
    for (var i = 0; i < payload.criteria.length; i += 1) {
      var criterion = payload.criteria[i];
      var criterionPath = pathPrefix + ".body.criteria[" + i + "]";
      if (!isPlainObject(criterion)) {
        errors.push(criterionPath + " must be an object");
        continue;
      }
      if (!hasNonEmptyString(criterion.statement)) {
        errors.push(criterionPath + ".statement required");
      }
      if (!Array.isArray(criterion.features) || criterion.features.length < 1) {
        errors.push(criterionPath + ".features must include at least one item");
        continue;
      }
      for (var f = 0; f < criterion.features.length; f += 1) {
        var feature = criterion.features[f];
        var featurePath = criterionPath + ".features[" + f + "]";
        if (!isPlainObject(feature)) {
          errors.push(featurePath + " must be an object");
          continue;
        }
        if (!hasNonEmptyString(feature.expected)) {
          errors.push(featurePath + ".expected required");
        }
        if (!hasNonEmptyString(feature.repair)) {
          errors.push(featurePath + ".repair required");
        }
      }
    }
  }

  /**
   * Material body/body_format capture rules.
   * Checklist may use markdown (string) or json (guided_criteria object/JSON string).
   * All other material types remain markdown-only with a non-empty string body.
   */
  function pushMaterialBodyAndFormatErrors(material, activityIndex, materialIndex, errors) {
    var pathPrefix =
      "activities[" + activityIndex + "].materials[" + materialIndex + "]";
    var format = String(material && material.body_format != null ? material.body_format : "").trim();
    var body = material && material.body;
    var checklist = isChecklistMaterialType(material && material.material_type);

    if (checklist && format === BODY_FORMAT_JSON) {
      if (!materialHasPresentBody(body)) {
        errors.push(pathPrefix + ".body required");
        return;
      }
      pushGuidedChecklistBodyErrors(body, pathPrefix, errors);
      return;
    }

    if (checklist && format && format !== BODY_FORMAT && format !== BODY_FORMAT_JSON) {
      errors.push(pathPrefix + '.body_format must be "markdown" or "json"');
      return;
    }

    if (!hasNonEmptyString(body)) {
      errors.push(pathPrefix + ".body required");
    } else {
      pushMaterialMathIntegrityErrors(material, activityIndex, materialIndex, errors);
    }
    if (format !== BODY_FORMAT) {
      errors.push(pathPrefix + '.body_format must be "markdown"');
    }
  }

  function normalizeMaterialType(required) {
    return nonEmptyString(
      required.material_type || required.type || required.materialType,
      "text"
    );
  }

  function isResponseScaffoldMaterialType(materialType) {
    var token = normalizeMaterialTypeToken(materialType);
    return (
      token === "analysis_table" ||
      token === "decision_table" ||
      token === "comparison_table" ||
      token === "template" ||
      token === "task_cards" ||
      token === "prompt_set" ||
      token === "planning_table"
    );
  }

  function isPreTaskTeachingMaterialType(materialType) {
    var token = normalizeMaterialTypeToken(materialType);
    return (
      token === "worked_example" ||
      token === "modelling_note" ||
      token === "sample_output" ||
      token === "text"
    );
  }

  function extractEvidenceRequirement(required) {
    var value = required && required.evidence_requirement;
    if (!isPlainObject(value)) return null;
    if (nonEmptyString(value.kind, "") !== EVIDENCE_KIND) return null;
    return value;
  }

  function activityRequiresEvidence(activity) {
    var decision = activity && activity.evidence_decision;
    if (decision && decision.required === true) return true;
    var requiredRows = Array.isArray(activity && activity.required_materials)
      ? activity.required_materials
      : [];
    return requiredRows.some(function (row) {
      return !!extractEvidenceRequirement(row);
    });
  }

  function findRequiredRowForMaterial(activity, material) {
    var requiredRows = Array.isArray(activity && activity.required_materials)
      ? activity.required_materials
      : [];
    var materialId = nonEmptyString(material && material.material_id, "");
    if (!materialId) return null;
    for (var i = 0; i < requiredRows.length; i += 1) {
      if (nonEmptyString(requiredRows[i] && requiredRows[i].material_id, "") === materialId) {
        return requiredRows[i];
      }
    }
    return null;
  }

  function validateEvidenceRequirementShape(value, pathPrefix, errors) {
    if (!isPlainObject(value)) {
      errors.push(pathPrefix + ".evidence_requirement must be an object when present");
      return;
    }
    if (nonEmptyString(value.kind, "") !== EVIDENCE_KIND) {
      errors.push(pathPrefix + '.evidence_requirement.kind must be "' + EVIDENCE_KIND + '"');
    }
    if (!hasNonEmptyString(value.purpose)) {
      errors.push(pathPrefix + ".evidence_requirement.purpose required");
    }
    if (!hasNonEmptyString(value.learner_action)) {
      errors.push(pathPrefix + ".evidence_requirement.learner_action required");
    }
    if (!Array.isArray(value.observable_features) || !value.observable_features.length) {
      errors.push(
        pathPrefix + ".evidence_requirement.observable_features must be a non-empty string array"
      );
    } else {
      value.observable_features.forEach(function (item, index) {
        if (!hasNonEmptyString(item)) {
          errors.push(
            pathPrefix +
              ".evidence_requirement.observable_features[" +
              index +
              "] must be a non-empty string"
          );
        }
      });
    }
    [
      "minimum_suitable_form",
      "processing_notes",
      "provenance",
      "disclosure_constraint",
      "evidence_layout"
    ].forEach(function (key) {
      if (value[key] != null && !hasNonEmptyString(value[key])) {
        errors.push(pathPrefix + ".evidence_requirement." + key + " must be a non-empty string");
      }
    });
    ["fixed_observation_fields", "learner_response_fields"].forEach(function (key) {
      if (value[key] == null) return;
      if (!Array.isArray(value[key]) || !value[key].length) {
        errors.push(pathPrefix + ".evidence_requirement." + key + " must be a non-empty string array");
        return;
      }
      value[key].forEach(function (entry, index) {
        if (!hasNonEmptyString(entry)) {
          errors.push(
            pathPrefix + ".evidence_requirement." + key + "[" + index + "] must be a non-empty string"
          );
        }
      });
    });
  }

  function hasSourceBoundProvenance(evidenceRequirement) {
    return (
      nonEmptyString(evidenceRequirement && evidenceRequirement.provenance, "").toLowerCase() ===
      PROVENANCE_SOURCE_BOUND
    );
  }

  function hasSimulatedProvenance(evidenceRequirement) {
    if (hasSourceBoundProvenance(evidenceRequirement)) return false;
    return /system_generated_simulation|simulat|synthetic|fictional/i.test(
      nonEmptyString(evidenceRequirement && evidenceRequirement.provenance, "")
    );
  }

  function fieldNameLooksSourceContent(name) {
    return /\b(quot(?:ation|e)?|extract|excerpt|observation|value|clause|feature|passage|line(?:ation)?|data|output|wording|textual|source content|exact text|source (?:text|excerpt)|case note)\b/i.test(
      String(name || "")
    );
  }

  function fieldNameLooksMetaOnly(name) {
    var text = String(name || "").trim();
    if (!text) return false;
    return /^(poem|title|category|source|label|type|id|name|work)(\s|$)/i.test(text) ||
      /\b(poem title|evidence category|source name|source title|text title|work title)\b/i.test(text);
  }

  function fieldNameLooksLearnerResponse(name) {
    return /\b(interpretation|judgement|judgment|analysis|comparison|reasoning|response|conclusion|significance|meaning|evaluation|comment|notes?)\b/i.test(
      String(name || "")
    );
  }

  function extractMarkdownTableHeaders(body) {
    var text = String(body || "");
    var match = text.match(/^\s*\|([^\n]+)\|\s*$/m);
    if (!match) return [];
    return match[1]
      .split("|")
      .map(function (cell) {
        return String(cell || "").trim();
      })
      .filter(function (cell) {
        return cell && !/^[-:]+$/.test(cell);
      });
  }

  function unitLooksSourceNative(text) {
    var value = String(text || "").trim();
    if (!value) return false;
    if (/["“”][^"“”]{5,}["“”]/.test(value)) return true;
    if (/\b(observed|measurement|result|residual|value|data|output)\b/i.test(value) && /\d/.test(value)) {
      return true;
    }
    if (/\b(clause|section|policy|regulation)\b/i.test(value) && value.length > 24) return true;
    if (/\b(line|stanza|verse)\s+\d+/i.test(value)) return true;
    return false;
  }

  function unitLooksThematicSummary(text) {
    var value = String(text || "").trim();
    if (!value || unitLooksSourceNative(value)) return false;
    if (/["“”]/.test(value)) return false;
    if (/^(source\s*:|use these|use the|select|compare how|identify|cite|record|complete|##)/i.test(value)) {
      return false;
    }
    if (
      /\b(before (?:stating|completing|learner)|for close reading|learner completes|\*learner completes\*)\b/i.test(
        value
      )
    ) {
      return false;
    }
    return (
      /\b(theme|imagery|symbolism|motif|overall message|in summary|emphasis on|focus on|presents?\b|suggests?\b|undermin|reveals?\b|demonstrates?\b|attacks?\b|strips? away|significance|meaning that|heroic|patriotic|futile|mourning and loss|public celebration)\b/i.test(
        value
      ) ||
      (/^(focus|emphasis|presents|suggests|undermines|reveals|demonstrates)\b/i.test(value) &&
        value.length > 18)
    );
  }

  function extractEvidenceUnits(body) {
    var units = [];
    if (body && typeof body === "object" && !Array.isArray(body)) {
      ["rows", "units", "evidence_items", "items"].forEach(function (key) {
        if (!Array.isArray(body[key])) return;
        body[key].forEach(function (row) {
          if (row == null) return;
          if (typeof row === "string") {
            units.push(row);
            return;
          }
          if (typeof row !== "object") return;
          var parts = [];
          Object.keys(row).forEach(function (field) {
            if (row[field] == null) return;
            parts.push(String(row[field]));
          });
          if (parts.length) units.push(parts.join(" | "));
        });
      });
      if (units.length) return units.map(function (u) { return String(u).trim(); }).filter(Boolean);
    }

    var text = String(body || "");
    var lines = text.split(/\r?\n/);
    var tableRows = [];
    lines.forEach(function (line) {
      if (!/^\s*\|/.test(line) || /---/.test(line)) return;
      var cells = line
        .split("|")
        .map(function (cell) {
          return String(cell || "").trim();
        })
        .filter(function (cell, index, arr) {
          return cell && index > 0 && index < arr.length - 1 && !/^[-:]+$/.test(cell);
        });
      if (!cells.length) return;
      if (cells.every(fieldNameLooksMetaOnly) || cells.every(fieldNameLooksLearnerResponse)) return;
      if (cells.every(function (cell) {
        return fieldNameLooksSourceContent(cell) || fieldNameLooksMetaOnly(cell) || fieldNameLooksLearnerResponse(cell);
      }) && cells.some(fieldNameLooksSourceContent)) {
        return;
      }
      tableRows.push(cells.join(" | "));
    });
    if (tableRows.length >= 2) {
      return tableRows.slice(1);
    }

    var bulletUnits = [];
    lines.forEach(function (line) {
      var trimmed = String(line || "").trim();
      var bullet = trimmed.match(/^(?:[-*•]|\d+[.)])\s+(.+)$/);
      if (bullet && bullet[1]) bulletUnits.push(bullet[1].trim());
    });
    if (bulletUnits.length >= 2) return bulletUnits;

    var blocks = text
      .split(/\n\s*\n/)
      .map(function (block) {
        return String(block || "").trim();
      })
      .filter(function (block) {
        return block.length > 12 && !/^#{1,6}\s/.test(block) && !/^>/.test(block);
      });
    if (blocks.length >= 2) return blocks;
    return text.trim() ? [text.trim()] : [];
  }

  function bodyLooksThematicSummaryWithoutExcerpt(body) {
    var text = String(body || "");
    if (text.trim().length < 40) return true;
    var units = extractEvidenceUnits(body);
    if (units.length >= 2) {
      var nativeCount = units.filter(unitLooksSourceNative).length;
      var summaryCount = units.filter(unitLooksThematicSummary).length;
      if (nativeCount === 0 && summaryCount > 0) return true;
    }
    var hasExcerptMarkers =
      /["“”']/.test(text) ||
      /\b(line|stanza|verse|excerpt|quotation|quote|passage|extract)\b/i.test(text) ||
      (/\|/.test(text) && fieldNameLooksSourceContent(extractMarkdownTableHeaders(text).join(" "))) ||
      /\b(observed|measurement|result|data|value)\b/i.test(text);
    var hasThematicOnly =
      /\b(theme|imagery|symbolism|motif|overall message|in summary|presents war as|emphasis on|focus on)\b/i.test(
        text
      );
    return hasThematicOnly && !hasExcerptMarkers;
  }

  function bodyHasMixedSourceAndSummaryEvidence(body) {
    var units = extractEvidenceUnits(body);
    if (units.length < 2) return false;
    var nativeCount = units.filter(unitLooksSourceNative).length;
    var summaryCount = units.filter(unitLooksThematicSummary).length;
    return nativeCount >= 1 && summaryCount >= 1;
  }

  function bodyContainsInterpretationAsEvidence(body) {
    var text = String(body || "");
    if (!text.trim()) return false;
    var units = extractEvidenceUnits(body);
    var interpretiveUnit = units.some(function (unit) {
      return (
        unitLooksThematicSummary(unit) &&
        /\b(suggests?(?:\s+that)?|presents?\s+.{1,48}\s+as\b|undermin(?:es|ing)?\b|reveals?(?:\s+that)?|demonstrates?(?:\s+that)?|directly attacks|strips? away|shows that|emphasises?\s+(?:the\s+)?(?:theme|idea|message|futility|horror|impersonality|loss)|emphasizes?\s+(?:the\s+)?(?:theme|idea|message|futility|horror|impersonality|loss))\b/i.test(
          unit
        )
      );
    });
    if (interpretiveUnit) return true;
    return bodyDisclosesInterpretiveClaim(text);
  }

  function bodyDisclosesInterpretiveClaim(text) {
    var value = String(text || "");
    return /\b(suggests that|suggesting that|presents\s+.{1,48}\s+as\b|undermin(?:es|ing)\b|reveals that|demonstrates that|directly attacks|strips away|shows that|emphasises?\s+(?:the\s+)?(?:theme|idea|message|futility|horror|impersonality|loss)|emphasizes?\s+(?:the\s+)?(?:theme|idea|message|futility|horror|impersonality|loss))\b/i.test(
      value
    );
  }

  function quotedFragmentLooksSilentlyIncomplete(inner) {
    var compact = String(inner || "").replace(/\s+/g, " ").trim();
    if (!compact) return false;
    if (/…|\.\.\./.test(compact)) return false;
    if (compact.length > 90) return false;
    if (
      /\b(and|or|but|the|a|an|of|to|for|with|from|as|into|upon|who|which|that|like)$/i.test(compact)
    ) {
      return true;
    }
    var words = compact.replace(/[,;:]+$/g, "").split(/\s+/).filter(Boolean);
    if (words.length <= 5 && !/[.!?]$/.test(compact)) return true;
    if (words.length <= 6 && /^(like|as|and|or|but|with|from|into)\b/i.test(compact)) return true;
    return false;
  }

  function bodyLooksSilentIncompleteExcerpt(body) {
    var text = String(body || "");
    var quotePattern = /["“]([^"”]{4,120})["”]/g;
    var match;
    var flagged = 0;
    while ((match = quotePattern.exec(text))) {
      if (quotedFragmentLooksSilentlyIncomplete(match[1])) flagged += 1;
    }
    return flagged >= 1;
  }

  function combinedSourceBoundMissingEvidenceContentField(evidenceRequirement, material) {
    if (!hasSourceBoundProvenance(evidenceRequirement)) return false;
    if (evidenceLayout(evidenceRequirement) !== "combined_evidence_workspace") return false;
    var fixed = Array.isArray(evidenceRequirement.fixed_observation_fields)
      ? evidenceRequirement.fixed_observation_fields.map(function (item) {
          return String(item || "").trim();
        }).filter(Boolean)
      : [];
    var headers = extractMarkdownTableHeaders(material && material.body);
    var learnerFields = Array.isArray(evidenceRequirement.learner_response_fields)
      ? evidenceRequirement.learner_response_fields.map(function (item) {
          return String(item || "").trim().toLowerCase();
        })
      : [];
    var candidateFields = fixed.slice();
    if (!candidateFields.length && headers.length) {
      candidateFields = headers.filter(function (header) {
        var lower = String(header || "").trim().toLowerCase();
        if (learnerFields.indexOf(lower) !== -1) return false;
        return !fieldNameLooksLearnerResponse(header);
      });
    }
    if (!candidateFields.length) return true;
    if (candidateFields.some(fieldNameLooksSourceContent)) return false;
    if (candidateFields.every(fieldNameLooksMetaOnly)) return true;
    return true;
  }

  function ensureSourceContentFixedFields(evidenceRequirement) {
    var fixed = listOrFallback(
      evidenceRequirement && evidenceRequirement.fixed_observation_fields,
      ["Condition", "Observed data", "Change vs comparison"]
    );
    if (
      hasSourceBoundProvenance(evidenceRequirement) &&
      evidenceLayout(evidenceRequirement) === "combined_evidence_workspace" &&
      !fixed.some(fieldNameLooksSourceContent)
    ) {
      return fixed.concat(["Quotation / extract"]);
    }
    return fixed;
  }

  function bodyHasSourceAttribution(body, title) {
    var text = (String(title || "") + "\n" + String(body || "")).toLowerCase();
    return (
      /\b(source|from|excerpt from|quoted from|adapted from|attachment|title:)\b/.test(text) ||
      /\[[^\]]{2,80}\]/.test(text)
    );
  }

  function bodyClaimsSourceUnavailable(body) {
    return /source[- ]bound requirement could not be fulfilled|source (?:material|attachment) (?:is )?unavailable|could not (?:access|locate) the (?:attached|source)/i.test(
      String(body || "")
    );
  }

  function evidenceLayout(evidenceRequirement) {
    return nonEmptyString(evidenceRequirement && evidenceRequirement.evidence_layout, "separate_provider");
  }

  function listOrFallback(value, fallback) {
    if (Array.isArray(value) && value.length) {
      return value.map(function (item) {
        return String(item).trim();
      });
    }
    return fallback.slice();
  }

  function buildEvidenceHeaderLines(evidenceRequirement) {
    var lines = [
      "## Learner evidence",
      "",
      nonEmptyString(
        evidenceRequirement && evidenceRequirement.purpose,
        "Use this evidence to support your reasoning."
      )
    ];
    if (hasSimulatedProvenance(evidenceRequirement)) {
      lines.push("", "> Simulated results created for this learning activity.");
    }
    lines.push(
      "",
      "Use this evidence to:",
      "- " +
        nonEmptyString(
          evidenceRequirement && evidenceRequirement.learner_action,
          "inspect observations and justify your conclusion"
        )
    );
    var features = Array.isArray(evidenceRequirement && evidenceRequirement.observable_features)
      ? evidenceRequirement.observable_features
      : [];
    if (features.length) {
      lines.push("", "Focus on observable features:");
      features.forEach(function (feature) {
        lines.push("- " + String(feature).trim());
      });
    }
    return lines.join("\n");
  }

  function buildEvidenceObservationBody(evidenceRequirement) {
    var observations = listOrFallback(
      evidenceRequirement && evidenceRequirement.observable_features,
      [
        "Observed condition A and condition B outcomes",
        "Measured change reported between comparison conditions",
        "Presence or absence of a key marker under each condition"
      ]
    );
    var lines = ["### Observations", ""];
    observations.forEach(function (feature, index) {
      lines.push((index + 1) + ". " + feature + ".");
    });
    lines.push(
      "",
      "### Conditions",
      "",
      "- Control condition: baseline observation is reported.",
      "- Disruption condition: changed observation is reported.",
      "",
      "Use these observations as evidence before completing the response scaffold."
    );
    return lines.join("\n");
  }

  function buildCombinedEvidenceWorkspaceBody(evidenceRequirement) {
    var fixedCols = ensureSourceContentFixedFields(evidenceRequirement);
    var learnerCols = listOrFallback(
      evidenceRequirement && evidenceRequirement.learner_response_fields,
      ["Interpretation", "Consequence or judgement"]
    );
    var cols = fixedCols.concat(learnerCols);
    var header = "| " + cols.join(" | ") + " |";
    var sep = "| " + cols.map(function () { return "---"; }).join(" | ") + " |";
    var rowA = [];
    var rowB = [];
    cols.forEach(function (_col, index) {
      if (index < fixedCols.length) {
        rowA.push(index === 0 ? "Case A" : index === 1 ? "Control: 12; Disruption: 7" : "Decrease under disruption");
        rowB.push(index === 0 ? "Case B" : index === 1 ? "Control: absent; Disruption: present" : "Marker appears after disruption");
      } else {
        rowA.push("*Learner completes*");
        rowB.push("*Learner completes*");
      }
    });
    return [
      "### Evidence workspace",
      "",
      "Fixed evidence columns contain observations. Learner-response columns remain blank for learner analysis.",
      "",
      header,
      sep,
      "| " + rowA.join(" | ") + " |",
      "| " + rowB.join(" | ") + " |"
    ].join("\n");
  }

  function materialLooksConclusionOnly(body) {
    var text = String(body || "");
    var lower = text.toLowerCase();
    if (lower.length < 40) return true;
    var hasEvidenceMarkers =
      /\|/.test(text) ||
      /case\s+[ab]|observation|measure|result|value|data|evidence|signal|pattern|contrast/i.test(text);
    var hasConclusionLanguage =
      /therefore|thus|so the|in conclusion|this proves|correct answer|best answer/i.test(lower);
    return hasConclusionLanguage && !hasEvidenceMarkers;
  }

  function bodyDisclosesTargetConclusion(body) {
    var text = String(body || "");
    var lower = text.toLowerCase();
    if (
      /correct answer is|therefore the answer|you should conclude|a reasonable provisional judgement is|make the strongest contribution|contributes? most strongly|the overall judgement|therefore .* is most important|broadest support|preferred mechanism|provides? the (broadest|strongest)/i.test(
        lower
      )
    ) {
      return true;
    }
    return bodyDisclosesInterpretiveClaim(text);
  }

  function hasSimulatedLabel(body) {
    return /simulated results created for this learning activity|simulated instructional evidence|simulated|synthetic/i.test(
      String(body || "")
    );
  }

  function titleHasSimulatedLabel(title) {
    return /\bsimulat/i.test(String(title || ""));
  }

  var FOCAL_EVIDENCE_STOPWORDS = {
    about: true,
    after: true,
    against: true,
    among: true,
    because: true,
    before: true,
    between: true,
    compare: true,
    condition: true,
    conditions: true,
    evidence: true,
    from: true,
    into: true,
    learner: true,
    observed: true,
    observation: true,
    observations: true,
    provide: true,
    provides: true,
    reported: true,
    result: true,
    results: true,
    scenario: true,
    scenarios: true,
    should: true,
    their: true,
    these: true,
    those: true,
    under: true,
    using: true,
    which: true,
    with: true,
    would: true
  };

  function extractFocalEvidenceTokens(text) {
    var tokens = {};
    String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .forEach(function (token) {
        var cleaned = String(token || "").replace(/^-+|-+$/g, "");
        if (cleaned.length < 4) return;
        if (FOCAL_EVIDENCE_STOPWORDS[cleaned]) return;
        tokens[cleaned] = true;
      });
    return tokens;
  }

  function collectFocalEvidenceText(activity) {
    var chunks = [];
    var requiredRows = Array.isArray(activity && activity.required_materials)
      ? activity.required_materials
      : [];
    var materials = Array.isArray(activity && activity.materials) ? activity.materials : [];
    var providerIds = {};
    var decision = activity && activity.evidence_decision;
    if (decision && Array.isArray(decision.provider_material_ids)) {
      decision.provider_material_ids.forEach(function (id) {
        var key = nonEmptyString(id, "");
        if (key) providerIds[key] = true;
      });
    }
    requiredRows.forEach(function (row) {
      var evidenceRequirement = extractEvidenceRequirement(row);
      var materialId = nonEmptyString(row && row.material_id, "");
      var isProvider =
        !!evidenceRequirement || (materialId && providerIds[materialId]);
      if (!isProvider) return;
      chunks.push(nonEmptyString(row && row.purpose, ""));
      chunks.push(nonEmptyString(row && row.specification, ""));
      if (evidenceRequirement) {
        chunks.push(nonEmptyString(evidenceRequirement.purpose, ""));
        chunks.push(nonEmptyString(evidenceRequirement.learner_action, ""));
        if (Array.isArray(evidenceRequirement.observable_features)) {
          chunks.push(evidenceRequirement.observable_features.join(" "));
        }
      }
    });
    materials.forEach(function (material) {
      var materialId = nonEmptyString(material && material.material_id, "");
      var required = findRequiredRowForMaterial(activity, material);
      var evidenceRequirement = extractEvidenceRequirement(required);
      if (!(evidenceRequirement || (materialId && providerIds[materialId]))) return;
      chunks.push(nonEmptyString(material && material.title, ""));
      chunks.push(nonEmptyString(material && material.body, ""));
    });
    return chunks.join(" ");
  }

  function materialReusesFocalEvidence(body, activity) {
    var focalTokens = extractFocalEvidenceTokens(collectFocalEvidenceText(activity));
    var bodyTokens = extractFocalEvidenceTokens(body);
    var shared = 0;
    Object.keys(bodyTokens).forEach(function (token) {
      if (focalTokens[token]) shared += 1;
    });
    return shared >= 2;
  }

  function humanizeMaterialType(type) {
    return String(type || "material")
      .replace(/_/g, " ")
      .replace(/\b\w/g, function (ch) {
        return ch.toUpperCase();
      });
  }

  function withSimulatedTitlePrefix(title) {
    var trimmed = nonEmptyString(title, "Evidence Table");
    if (titleHasSimulatedLabel(trimmed)) return trimmed;
    return "Simulated " + trimmed;
  }

  function titleFromRequired(required) {
    var purpose = nonEmptyString(required.purpose || required.specification, "");
    var title;
    if (purpose) {
      var trimmed = purpose.replace(/\.$/, "");
      title = trimmed.length > 96 ? trimmed.slice(0, 93) + "..." : trimmed;
    } else {
      title = humanizeMaterialType(normalizeMaterialType(required));
    }
    var evidenceRequirement = extractEvidenceRequirement(required);
    if (
      evidenceRequirement &&
      hasSimulatedProvenance(evidenceRequirement) &&
      evidenceLayout(evidenceRequirement) === "combined_evidence_workspace"
    ) {
      return withSimulatedTitlePrefix(title);
    }
    return title;
  }

  function ensureSimulationHonestyTitles(page) {
    var activities = Array.isArray(page && page.activities) ? page.activities : [];
    activities.forEach(function (activity) {
      var materials = Array.isArray(activity && activity.materials) ? activity.materials : [];
      materials.forEach(function (material) {
        var required = findRequiredRowForMaterial(activity, material);
        var evidenceRequirement = extractEvidenceRequirement(required);
        if (!evidenceRequirement) return;
        if (!hasSimulatedProvenance(evidenceRequirement)) return;
        if (evidenceLayout(evidenceRequirement) !== "combined_evidence_workspace") return;
        material.title = withSimulatedTitlePrefix(
          nonEmptyString(material.title, titleFromRequired(required || {}))
        );
      });
    });
  }

  function bodyForTextMaterial(required, activity, loStatement) {
    var purpose = nonEmptyString(required.purpose || required.specification, loStatement);
    return (
      "## " +
      titleFromRequired(required) +
      "\n\n" +
      purpose +
      "\n\n### What to notice\n\n" +
      "- Connect the ideas to **" +
      loStatement +
      "**.\n" +
      "- Use evidence from this material when completing **" +
      nonEmptyString(activity.learner_task, "the activity task") +
      "**."
    );
  }

  function bodyForWorkedExample(required, activity, loStatement) {
    return (
      "## Worked example\n\n" +
      "This worked example models expert reasoning for: " +
      loStatement +
      ".\n\n" +
      "### Step 1 — Orient\n\n" +
      nonEmptyString(required.purpose, "Identify what the example is demonstrating.") +
      "\n\n" +
      "### Step 2 — Reasoning walkthrough\n\n" +
      "1. State the claim.\n" +
      "2. Cite supporting evidence.\n" +
      "3. Explain the mechanism linking evidence to the claim.\n\n" +
      "### Step 3 — Compare with your attempt\n\n" +
      "Before independent practice, explain one difference between the model reasoning and your first attempt."
    );
  }

  function bodyForModellingNote(required, activity, loStatement) {
    return (
      "## Modelling note\n\n" +
      "Expert reasoning orientation for **" +
      activity.title +
      "**:\n\n" +
      nonEmptyString(required.purpose, "Walk through how an expert approaches " + loStatement + ".") +
      "\n\n" +
      "> Think aloud: name the criterion, select evidence, and justify the inference before drafting your response."
    );
  }

  function bodyForChecklist(required) {
    return (
      "## Self-check checklist\n\n" +
      nonEmptyString(required.purpose, "Verify your response before submitting.") +
      "\n\n" +
      "- [ ] My response addresses the activity task directly.\n" +
      "- [ ] I cited specific evidence from the teaching materials.\n" +
      "- [ ] My reasoning explains how evidence supports the claim.\n" +
      "- [ ] I identified one limitation or uncertainty in my answer."
    );
  }

  function bodyForScenario(required) {
    return (
      "## Scenario\n\n" +
      nonEmptyString(required.purpose, "Use these cases to ground your analysis.") +
      "\n\n" +
      "### Case A\n\n" +
      "A realistic context with specific names, figures, and constraints that require judgement.\n\n" +
      "### Case B\n\n" +
      "A contrasting context that tests the same concept under different conditions."
    );
  }

  function bodyForTable(required) {
    return (
      "## Analysis framework\n\n" +
      nonEmptyString(required.purpose, "Complete the table using evidence from the activity.") +
      "\n\n" +
      "| Factor | Evidence | Your interpretation |\n" +
      "| --- | --- | --- |\n" +
      "| Example row | Modelled evidence | *Learner completes* |\n" +
      "|  |  |  |\n" +
      "|  |  |  |"
    );
  }

  function bodyForTransfer(required, loStatement) {
    return (
      "## Transfer task\n\n" +
      nonEmptyString(
        required.purpose,
        "Apply what you learned about " + loStatement + " to a new context."
      ) +
      "\n\n" +
      "1. Choose a context different from the teaching examples.\n" +
      "2. Explain which ideas transfer and which need adjustment.\n" +
      "3. Submit a short justification referencing criteria from the activity."
    );
  }

  function bodyForConsolidation(required, activity) {
    return (
      "## Activity recap\n\n" +
      nonEmptyString(required.purpose, "Consolidate the key ideas from this activity.") +
      "\n\n" +
      "Reflect on **" +
      activity.title +
      "**:\n\n" +
      "- What is the most important idea to remember?\n" +
      "- What evidence best supports your conclusion?\n" +
      "- What would you revise if you repeated the task?"
    );
  }

  function bodyForMaterial(required, activity, loStatement) {
    var type = normalizeMaterialType(required).toLowerCase();
    if (type === "worked_example" || type === "sample_output") {
      return bodyForWorkedExample(required, activity, loStatement);
    }
    if (type === "modelling_note") return bodyForModellingNote(required, activity, loStatement);
    if (type === "checklist" || type === "rubric") return bodyForChecklist(required);
    if (type === "scenario") return bodyForScenario(required);
    if (
      type.indexOf("table") !== -1 ||
      type === "template" ||
      type === "task_cards" ||
      type === "prompt_set"
    ) {
      return bodyForTable(required);
    }
    if (type === "transfer_prompt") return bodyForTransfer(required, loStatement);
    if (type === "consolidation_summary") return bodyForConsolidation(required, activity);
    return bodyForTextMaterial(required, activity, loStatement);
  }

  function buildMaterialFromRequired(required, activity, loStatement) {
    var materialId = nonEmptyString(required.material_id, "");
    if (!materialId) {
      throw new Error("buildMaterialFromRequired: material_id required");
    }
    var materialType = normalizeMaterialType(required);
    var evidenceRequirement = extractEvidenceRequirement(required);
    var body = bodyForMaterial(required, activity, loStatement);
    if (evidenceRequirement) {
      if (
        evidenceLayout(evidenceRequirement) === "combined_evidence_workspace" &&
        materialType.toLowerCase().indexOf("table") !== -1
      ) {
        body =
          buildEvidenceHeaderLines(evidenceRequirement) +
          "\n\n" +
          buildCombinedEvidenceWorkspaceBody(evidenceRequirement);
      } else {
        body =
          buildEvidenceHeaderLines(evidenceRequirement) +
          "\n\n" +
          buildEvidenceObservationBody(evidenceRequirement);
      }
    }
    return {
      material_id: materialId,
      material_type: materialType,
      title: titleFromRequired(required),
      body: body,
      body_format: BODY_FORMAT
    };
  }

  function collectEvidenceDiagnostics(activity, required, material, activityIndex, materialIndex, diagnostics) {
    var evidenceRequirement = extractEvidenceRequirement(required);
    if (!evidenceRequirement) return;
    var pathPrefix =
      "activities[" + activityIndex + "].materials[" + materialIndex + "] (" + material.material_id + ")";
    if (!hasNonEmptyString(evidenceRequirement.purpose)) {
      diagnostics.push({
        severity: "warn",
        code: "EVIDENCE_PURPOSE_MISSING",
        message: pathPrefix + " required_materials evidence purpose is missing."
      });
    }
    if (!hasNonEmptyString(evidenceRequirement.learner_action)) {
      diagnostics.push({
        severity: "warn",
        code: "EVIDENCE_LEARNER_ACTION_MISSING",
        message: pathPrefix + " required_materials learner_action is missing."
      });
    }
    if (
      !Array.isArray(evidenceRequirement.observable_features) ||
      !evidenceRequirement.observable_features.length
    ) {
      diagnostics.push({
        severity: "warn",
        code: "EVIDENCE_OBSERVABLE_FEATURES_MISSING",
        message: pathPrefix + " required_materials observable_features are missing."
      });
    }
    if (materialLooksConclusionOnly(material && material.body)) {
      diagnostics.push({
        severity: "warn",
        code: "EVIDENCE_BODY_GENERIC_CONCLUSION",
        message: pathPrefix + " appears conclusion-only and may not provide inspectable evidence."
      });
    }
    if (
      hasSimulatedProvenance(evidenceRequirement) &&
      !hasSimulatedLabel(material && material.body) &&
      !titleHasSimulatedLabel(material && material.title)
    ) {
      diagnostics.push({
        severity: "warn",
        code: "EVIDENCE_SIMULATION_LABEL_MISSING",
        message: pathPrefix + " is marked simulated but body lacks explicit simulation label."
      });
    }
    if (hasSourceBoundProvenance(evidenceRequirement)) {
      if (
        hasSimulatedLabel(material && material.body) ||
        titleHasSimulatedLabel(material && material.title)
      ) {
        diagnostics.push({
          severity: "warn",
          code: "SOURCE_BOUND_SIMULATION_LABEL",
          message:
            pathPrefix +
            " has conversation_attachment provenance but carries a simulation label."
        });
      }
      if (bodyClaimsSourceUnavailable(material && material.body)) {
        diagnostics.push({
          severity: "warn",
          code: "SOURCE_BOUND_UNFULFILLED",
          message:
            pathPrefix +
            " reports that the source-bound requirement could not be fulfilled."
        });
      } else {
        if (!bodyHasSourceAttribution(material && material.body, material && material.title)) {
          diagnostics.push({
            severity: "warn",
            code: "SOURCE_BOUND_ATTRIBUTION_MISSING",
            message:
              pathPrefix +
              " source-bound evidence should identify the source clearly."
          });
        }
        if (bodyLooksThematicSummaryWithoutExcerpt(material && material.body)) {
          diagnostics.push({
            severity: "warn",
            code: "SOURCE_BOUND_SUMMARY_ONLY",
            message:
              pathPrefix +
              " appears summary-only where an inspectable excerpt/quotation was required."
          });
        }
        if (bodyHasMixedSourceAndSummaryEvidence(material && material.body)) {
          diagnostics.push({
            severity: "warn",
            code: "SOURCE_BOUND_MIXED_SUMMARY_EVIDENCE",
            message:
              pathPrefix +
              " mixes inspectable source excerpts with summary-only claims; every analysed unit needs source-native evidence."
          });
        }
        if (bodyContainsInterpretationAsEvidence(material && material.body)) {
          diagnostics.push({
            severity: "warn",
            code: "SOURCE_BOUND_INTERPRETATION_AS_EVIDENCE",
            message:
              pathPrefix +
              " supplies interpretation or significance claims where learners need inspectable source material."
          });
        }
        if (combinedSourceBoundMissingEvidenceContentField(evidenceRequirement, material)) {
          diagnostics.push({
            severity: "warn",
            code: "SOURCE_BOUND_COMBINED_WITHOUT_EVIDENCE_FIELD",
            message:
              pathPrefix +
              " combined_evidence_workspace fixed fields lack quotation/extract/value/observation content."
          });
        }
        if (bodyLooksSilentIncompleteExcerpt(material && material.body)) {
          diagnostics.push({
            severity: "warn",
            code: "SOURCE_BOUND_SILENT_EXCERPT_OMISSION",
            message:
              pathPrefix +
              " appears to present a partial textual excerpt without honest ellipsis/omission marking."
          });
        }
        if (!hasNonEmptyString(material && material.body) || String(material.body).trim().length < 24) {
          diagnostics.push({
            severity: "warn",
            code: "SOURCE_BOUND_NO_IDENTIFIABLE_EVIDENCE",
            message:
              pathPrefix +
              " claims source-bound fulfilment but contains no identifiable evidence body."
          });
        }
      }
    }
    if (bodyDisclosesTargetConclusion(material && material.body)) {
      diagnostics.push({
        severity: "warn",
        code: "EVIDENCE_PRETASK_DISCLOSURE",
        message: pathPrefix + " appears to disclose the target conclusion before learner response."
      });
    }
    if (
      isResponseScaffoldMaterialType(material && material.material_type) &&
      bodyDisclosesTargetConclusion(material && material.body)
    ) {
      diagnostics.push({
        severity: "warn",
        code: "RESPONSE_SCAFFOLD_DISCLOSURE",
        message:
          pathPrefix +
          " response scaffold appears to include judgement language that should remain learner-authored."
      });
    }
  }

  function collectPageEvidenceDiagnostics(page) {
    var diagnostics = [];
    var activities = Array.isArray(page && page.activities) ? page.activities : [];
    activities.forEach(function (activity, activityIndex) {
      var materials = Array.isArray(activity && activity.materials) ? activity.materials : [];
      var evidenceRequired = activityRequiresEvidence(activity);
      materials.forEach(function (material, materialIndex) {
        var required = findRequiredRowForMaterial(activity, material);
        collectEvidenceDiagnostics(
          activity,
          required,
          material,
          activityIndex,
          materialIndex,
          diagnostics
        );
        var pathPrefix =
          "activities[" +
          activityIndex +
          "].materials[" +
          materialIndex +
          "] (" +
          nonEmptyString(material && material.material_id, "?") +
          ")";
        if (
          evidenceRequired &&
          isPreTaskTeachingMaterialType(material && material.material_type) &&
          bodyDisclosesTargetConclusion(material && material.body) &&
          materialReusesFocalEvidence(material && material.body, activity)
        ) {
          diagnostics.push({
            severity: "warn",
            code: "EVIDENCE_PRETASK_DISCLOSURE",
            message:
              pathPrefix +
              " pre-task material appears to analyse focal evidence or disclose the preferred judgement before learner response."
          });
        }
        if (
          !extractEvidenceRequirement(required) &&
          isResponseScaffoldMaterialType(material && material.material_type) &&
          bodyDisclosesTargetConclusion(material && material.body)
        ) {
          diagnostics.push({
            severity: "warn",
            code: "RESPONSE_SCAFFOLD_DISCLOSURE",
            message:
              pathPrefix +
              " response scaffold appears to include judgement language that should remain learner-authored."
          });
        }
      });
    });
    return diagnostics;
  }

  function resolveLoStatementForActivity(activity, loIndex) {
    var ids = Array.isArray(activity.learning_outcome_ids)
      ? activity.learning_outcome_ids
      : [];
    var i;
    for (i = 0; i < ids.length; i += 1) {
      var lo = loIndex[ids[i]];
      if (!lo) continue;
      var statement = nonEmptyString(lo.statement || lo.text || lo.description, "");
      if (statement) return statement;
    }
    return nonEmptyString(activity.title, "the learning outcome");
  }

  function learningOutcomesIndex(page) {
    var map = {};
    var rows = Array.isArray(page && page.learning_outcomes) ? page.learning_outcomes : [];
    rows.forEach(function (row, index) {
      if (typeof row === "string") {
        map["LO" + (index + 1)] = { outcome_id: "LO" + (index + 1), statement: row };
        return;
      }
      if (!row || typeof row !== "object") return;
      var id = nonEmptyString(row.outcome_id || row.id, "LO" + (index + 1));
      map[id] = row;
    });
    return map;
  }

  function snapshotActivityWithoutMaterials(activity) {
    var snap = deepClone(activity || {});
    delete snap.materials;
    return snap;
  }

  function activitiesMatchExceptMaterials(before, after) {
    var left = JSON.stringify(snapshotActivityWithoutMaterials(before));
    var right = JSON.stringify(snapshotActivityWithoutMaterials(after));
    return left === right;
  }

  function findBaselineActivityIdForMaterialId(baseline, materialId) {
    var mid = String(materialId || "").trim();
    if (!mid || !baseline || !Array.isArray(baseline.activities)) return "";
    var i;
    for (i = 0; i < baseline.activities.length; i += 1) {
      var activity = baseline.activities[i];
      var required = Array.isArray(activity.required_materials) ? activity.required_materials : [];
      var j;
      for (j = 0; j < required.length; j += 1) {
        if (String(required[j].material_id || "") === mid) {
          return String(activity.activity_id || "");
        }
      }
    }
    return "";
  }

  function isGamActivitySkeleton(activity) {
    if (!activity || typeof activity !== "object") return true;
    if (!hasNonEmptyString(activity.title)) return true;
    if (!hasNonEmptyString(activity.learner_task)) return true;
    if (!hasNonEmptyString(activity.expected_output)) return true;
    if (!hasNonEmptyString(activity.activity_preamble)) return true;
    if (!Array.isArray(activity.required_materials) || !activity.required_materials.length) return true;
    if (!activity.episode_plan || typeof activity.episode_plan !== "object") return true;
    return false;
  }

  function mergeMaterialsFromCaptureOntoBaseline(baseline, capturePage) {
    if (!baseline || !capturePage) return null;
    var out = deepClone(baseline);
    var baselineActivityIds = {};
    (baseline.activities || []).forEach(function (activity) {
      if (activity && activity.activity_id) {
        baselineActivityIds[String(activity.activity_id)] = true;
      }
    });
    var captureActivities = Array.isArray(capturePage.activities) ? capturePage.activities : [];
    var captureIdsMatchBaseline =
      !captureActivities.length ||
      captureActivities.every(function (activity) {
        var id = String((activity && activity.activity_id) || "");
        return !id || baselineActivityIds[id];
      });
    var materialsByBaselineActivityId = {};

    if (captureIdsMatchBaseline) {
      var captureById = {};
      captureActivities.forEach(function (activity) {
        if (activity && activity.activity_id) {
          captureById[String(activity.activity_id)] = activity;
        }
      });
      out.activities = out.activities.map(function (activity) {
        var merged = deepClone(activity);
        var incoming = captureById[String(activity.activity_id || "")];
        if (incoming && Array.isArray(incoming.materials)) {
          merged.materials = incoming.materials.map(deepClone);
        } else {
          merged.materials = [];
        }
        return merged;
      });
      return out;
    }

    captureActivities.forEach(function (captureActivity) {
      (captureActivity.materials || []).forEach(function (material) {
        var targetId = findBaselineActivityIdForMaterialId(baseline, material.material_id);
        if (!targetId) return;
        materialsByBaselineActivityId[targetId] = materialsByBaselineActivityId[targetId] || [];
        materialsByBaselineActivityId[targetId].push(deepClone(material));
      });
    });
    if (!Object.keys(materialsByBaselineActivityId).length) {
      return null;
    }
    out.activities = out.activities.map(function (activity, activityIndex) {
      var merged = deepClone(activity);
      merged.materials = materialsByBaselineActivityId[String(activity.activity_id || "")] || [];
      return merged;
    });
    return out;
  }

  function restoreGamBaselinePreservation(baseline, page) {
    if (!baseline) return null;
    return mergeMaterialsFromCaptureOntoBaseline(baseline, page || { activities: [] });
  }

  function activityFieldDriftMessage(index, field, baselineValue, currentValue) {
    if (
      typeof baselineValue === "string" &&
      typeof currentValue === "string" &&
      currentValue.length < baselineValue.length
    ) {
      return (
        "activities[" +
        index +
        "]." +
        field +
        " was shortened at GAM stage (baseline length " +
        baselineValue.length +
        ", got " +
        currentValue.length +
        ")"
      );
    }
    return "activities[" + index + "]." + field + " must match upstream DLA page at GAM stage";
  }

  function validateGamActivityFieldPreservation(baselineActivity, activity, index, errors) {
    if (!baselineActivity || !activity) return;
    var field;
    for (field = 0; field < GAM_DLA_OWNED_STRING_FIELDS.length; field += 1) {
      var fieldName = GAM_DLA_OWNED_STRING_FIELDS[field];
      if (!(fieldName in baselineActivity)) continue;
      var baseVal = baselineActivity[fieldName];
      var curVal = activity[fieldName];
      if (baseVal == null && curVal == null) continue;
      if (String(baseVal) !== String(curVal)) {
        errors.push(activityFieldDriftMessage(index, fieldName, baseVal, curVal));
      }
    }
    for (field = 0; field < GAM_DLA_OWNED_JSON_FIELDS.length; field += 1) {
      var jsonField = GAM_DLA_OWNED_JSON_FIELDS[field];
      if (!(jsonField in baselineActivity)) continue;
      if (JSON.stringify(baselineActivity[jsonField]) !== JSON.stringify(activity[jsonField])) {
        errors.push(
          activityFieldDriftMessage(
            index,
            jsonField,
            JSON.stringify(baselineActivity[jsonField]),
            JSON.stringify(activity[jsonField])
          )
        );
      }
    }
    if (String(baselineActivity.activity_id || "") !== String(activity.activity_id || "")) {
      errors.push("activities[" + index + "].activity_id must match upstream DLA page");
    }
    if (String(baselineActivity.title || "") !== String(activity.title || "")) {
      errors.push("activities[" + index + "].title must match upstream DLA page");
    }
  }

  function enrichActivityWithGam(activity, loStatement, options) {
    if (!activity || typeof activity !== "object") {
      throw new Error("enrichActivityWithGam: activity required");
    }
    var required = Array.isArray(activity.required_materials) ? activity.required_materials : [];
    if (!required.length) {
      throw new Error(
        "enrichActivityWithGam: activities[" +
          nonEmptyString(activity.activity_id, "?") +
          "].required_materials required"
      );
    }
    var enriched = deepClone(activity);
    enriched.materials = required.map(function (row) {
      return buildMaterialFromRequired(row, activity, loStatement);
    });
    return enriched;
  }

  function appendGamSourceArtefact(sourceArtefacts) {
    var rows = Array.isArray(sourceArtefacts) ? sourceArtefacts.slice() : [];
    var hasGam = rows.some(function (row) {
      return row && row.artefact_type === "generate_activity_materials";
    });
    if (!hasGam) {
      rows.push({
        artefact_type: "generate_activity_materials",
        source_label: "Generate Activity Materials",
        role: "materials"
      });
    }
    return rows;
  }

  function buildGamValidationReport(activityCount, materialCount, diagnostics) {
    return {
      activity_coverage: activityCount > 0 ? "gam_enriched" : "none",
      material_coverage: materialCount > 0 ? "authored" : "none",
      episode_plan_attachment: "attached",
      self_containment: "gam_enriched",
      schema_compliance: "gam_boundary",
      known_issues: materialCount > 0 ? [] : ["No materials authored at GAM stage"],
      quality_diagnostics: Array.isArray(diagnostics) ? diagnostics : []
    };
  }

  function finalizeGamPage(page, materialCount, baseline, diagnostics) {
    var out = baseline ? restoreGamBaselinePreservation(baseline, page) : deepClone(page);
    out.page_synthesis = {};
    var priorEnrichedBy = Array.isArray(out.assembly_state && out.assembly_state.enriched_by)
      ? out.assembly_state.enriched_by.slice()
      : ["episode_plan", "dla"];
    if (priorEnrichedBy.indexOf("gam") === -1) priorEnrichedBy.push("gam");
    out.assembly_state = Object.assign({}, out.assembly_state || {}, {
      current_stage: "gam",
      enriched_by: priorEnrichedBy
    });
    out.source_artefacts = appendGamSourceArtefact(out.source_artefacts);
    ensureSimulationHonestyTitles(out);
    var resolvedDiagnostics = collectPageEvidenceDiagnostics(out);
    if (Array.isArray(diagnostics) && diagnostics.length) {
      diagnostics.forEach(function (entry) {
        if (!entry || typeof entry !== "object") return;
        var duplicate = resolvedDiagnostics.some(function (existing) {
          return (
            existing &&
            existing.code === entry.code &&
            existing.message === entry.message
          );
        });
        if (!duplicate) resolvedDiagnostics.push(entry);
      });
    }
    out.generation_notes = Object.assign({}, out.generation_notes || {}, {
      validation: buildGamValidationReport(
        Array.isArray(out.activities) ? out.activities.length : 0,
        materialCount,
        resolvedDiagnostics
      ),
      notes:
        "Sprint 56F GAM page enrichment (" +
        ENRICH_VERSION +
        ") — page_synthesis pending finalise_page"
    });
    return out;
  }

  function enrichPageWithGam(pageInput, options) {
    if (!pageInput || typeof pageInput !== "object" || Array.isArray(pageInput)) {
      throw new Error("enrichPageWithGam: page required");
    }
    if (String(pageInput.artifact_type || "") !== "page") {
      throw new Error('enrichPageWithGam: artifact_type must be "page"');
    }
    if (!Array.isArray(pageInput.activities) || !pageInput.activities.length) {
      throw new Error("enrichPageWithGam: activities[] required");
    }
    var baseline = deepClone(pageInput);
    var out = deepClone(pageInput);
    var loIndex = learningOutcomesIndex(out);
    var materialCount = 0;
    var evidenceDiagnostics = [];
    out.activities = out.activities.map(function (activity, activityIndex) {
      var loStatement = resolveLoStatementForActivity(activity, loIndex);
      var enriched = enrichActivityWithGam(activity, loStatement, options || {});
      var requiredRows = Array.isArray(activity.required_materials) ? activity.required_materials : [];
      enriched.materials.forEach(function (material, index) {
        collectEvidenceDiagnostics(
          activity,
          requiredRows[index] || null,
          material,
          activityIndex,
          index,
          evidenceDiagnostics
        );
      });
      materialCount += enriched.materials.length;
      return enriched;
    });
    return finalizeGamPage(out, materialCount, baseline, evidenceDiagnostics);
  }

  function mergeGamMaterialsIntoPage(baseline, capturePage) {
    if (!baseline || !capturePage) return null;
    var out = mergeMaterialsFromCaptureOntoBaseline(baseline, capturePage);
    if (!out) return null;
    var materialCount = 0;
    (out.activities || []).forEach(function (activity) {
      materialCount += Array.isArray(activity.materials) ? activity.materials.length : 0;
    });
    return finalizeGamPage(out, materialCount, baseline, []);
  }

  function normalizeGamCaptureToPage(baseline, capture) {
    if (!capture || typeof capture !== "object") return null;
    if (!baseline || typeof baseline !== "object" || Array.isArray(baseline)) return null;
    return mergeGamMaterialsIntoPage(baseline, capture);
  }

  function pageSynthesisHasContent(pageSynthesis) {
    if (!pageSynthesis || typeof pageSynthesis !== "object") return false;
    return ["overview", "learning_purpose", "knowledge_summary", "study_tips", "support_notes"].some(
      function (key) {
        var slot = pageSynthesis[key];
        if (!slot) return false;
        if (typeof slot === "string") return hasNonEmptyString(slot);
        if (typeof slot === "object" && hasNonEmptyString(slot.body)) return true;
        if (key === "knowledge_summary" && slot && Array.isArray(slot.concepts) && slot.concepts.length) {
          return true;
        }
        return false;
      }
    );
  }

  function activityIdsInOrder(page) {
    return (page.activities || []).map(function (row) {
      return String(row.activity_id || "");
    });
  }

  function validateGamEnrichedPage(page, baseline) {
    var errors = [];
    if (!page || typeof page !== "object" || Array.isArray(page)) {
      return { ok: false, errors: ["page must be an object"] };
    }
    if (page.artifact_type !== "page") errors.push('artifact_type must be "page"');
    if (page.schema_version !== SCHEMA_VERSION) {
      errors.push('schema_version must be "' + SCHEMA_VERSION + '"');
    }
    if (page.sections != null) errors.push("sections[] must not be written at GAM stage");
    if (page.learning_sequence != null) {
      errors.push("learning_sequence must not be present at GAM stage");
    }
    if (page.assessment_check != null) {
      errors.push("assessment_check must not be present at GAM stage");
    }
    if (pageSynthesisHasContent(page.page_synthesis)) {
      errors.push("page_synthesis must remain empty at GAM stage");
    } else if (!page.page_synthesis || typeof page.page_synthesis !== "object") {
      errors.push("page_synthesis must be an object");
    }
    if (!page.assembly_state || typeof page.assembly_state !== "object") {
      errors.push("assembly_state required");
    } else {
      if (page.assembly_state.current_stage !== "gam") {
        errors.push('assembly_state.current_stage must be "gam"');
      }
      var enrichedBy = Array.isArray(page.assembly_state.enriched_by)
        ? page.assembly_state.enriched_by
        : [];
      if (enrichedBy.indexOf("gam") === -1) {
        errors.push('assembly_state.enriched_by must include "gam"');
      }
    }
    if (!Array.isArray(page.learning_outcomes) || !page.learning_outcomes.length) {
      errors.push("learning_outcomes[] required at GAM boundary");
    }
    if (!Array.isArray(page.episode_plans) || !page.episode_plans.length) {
      errors.push("episode_plans[] required at GAM boundary");
    }
    if (!Array.isArray(page.source_artefacts)) {
      errors.push("source_artefacts required at GAM boundary");
    }
    if (baseline) {
      if (activityIdsInOrder(page).join("|") !== activityIdsInOrder(baseline).join("|")) {
        errors.push("activity_id order must match upstream DLA page");
      }
      if (JSON.stringify(page.episode_plans || []) !== JSON.stringify(baseline.episode_plans || [])) {
        errors.push("episode_plans[] must match upstream DLA page (GAM must not strip nested episode_plan objects)");
      }
      if (
        JSON.stringify(page.learning_outcomes || []) !== JSON.stringify(baseline.learning_outcomes || [])
      ) {
        errors.push("learning_outcomes[] must match upstream DLA page");
      }
      GAM_PRESERVED_TOP_LEVEL_KEYS.forEach(function (key) {
        if (key === "episode_plans" || key === "learning_outcomes") return;
        if (!(key in baseline)) return;
        if (JSON.stringify(page[key]) !== JSON.stringify(baseline[key])) {
          errors.push(key + " must match upstream DLA page at GAM stage");
        }
      });
    }
    (page.activities || []).forEach(function (activity, index) {
      if (!activity || typeof activity !== "object") {
        errors.push("activities[" + index + "] must be an object");
        return;
      }
      if (isGamActivitySkeleton(activity)) {
        errors.push(
          "activities[" +
            index +
            "] missing DLA-owned fields — GAM output must preserve the full DLA activity row"
        );
        return;
      }
      var required = Array.isArray(activity.required_materials) ? activity.required_materials : [];
      var materials = Array.isArray(activity.materials) ? activity.materials : [];
      if (!required.length) {
        errors.push("activities[" + index + "].required_materials required at GAM boundary");
      }
      if (!materials.length) {
        errors.push("activities[" + index + "].materials must be populated at GAM stage");
      }
      if (required.length !== materials.length) {
        errors.push(
          "activities[" +
            index +
            "] materials count must match required_materials count (" +
            materials.length +
            " vs " +
            required.length +
            ")"
        );
      }
      var requiredIds = required.map(function (row) {
        return String(row.material_id || "");
      });
      required.forEach(function (row, reqIndex) {
        if (
          row &&
          typeof row === "object" &&
          !Array.isArray(row) &&
          Object.prototype.hasOwnProperty.call(row, "evidence_requirement")
        ) {
          validateEvidenceRequirementShape(
            row.evidence_requirement,
            "activities[" + index + "].required_materials[" + reqIndex + "]",
            errors
          );
        }
      });
      var materialIds = materials.map(function (row) {
        return String(row.material_id || "");
      });
      requiredIds.forEach(function (id, reqIndex) {
        if (!id) {
          errors.push("activities[" + index + "].required_materials[" + reqIndex + "].material_id required");
          return;
        }
        if (materialIds.indexOf(id) === -1) {
          errors.push("activities[" + index + "] missing material for required_material_id " + id);
        }
      });
      materials.forEach(function (material, mIndex) {
        if (!material || typeof material !== "object") {
          errors.push("activities[" + index + "].materials[" + mIndex + "] must be an object");
          return;
        }
        if (!hasNonEmptyString(material.material_id)) {
          errors.push("activities[" + index + "].materials[" + mIndex + "].material_id required");
        } else if (requiredIds.indexOf(String(material.material_id)) === -1) {
          errors.push(
            "activities[" +
              index +
              "].materials[" +
              mIndex +
              "] material_id " +
              material.material_id +
              " has no matching required_material"
          );
        }
        if (!hasNonEmptyString(material.title)) {
          errors.push("activities[" + index + "].materials[" + mIndex + "].title required");
        }
        pushMaterialBodyAndFormatErrors(material, index, mIndex, errors);
        if (!hasNonEmptyString(material.material_type)) {
          errors.push("activities[" + index + "].materials[" + mIndex + "].material_type required");
        }
      });
      if (baseline && baseline.activities && baseline.activities[index]) {
        validateGamActivityFieldPreservation(baseline.activities[index], activity, index, errors);
        if (!activitiesMatchExceptMaterials(baseline.activities[index], activity)) {
          errors.push("activities[" + index + "] DLA-owned fields were modified at GAM stage");
        }
        var baseRequired = JSON.stringify(baseline.activities[index].required_materials || []);
        var nextRequired = JSON.stringify(activity.required_materials || []);
        if (baseRequired !== nextRequired) {
          errors.push("activities[" + index + "].required_materials must not be modified at GAM stage");
        }
      }
      if (activity.materials && !Array.isArray(activity.materials) && typeof activity.materials === "object") {
        errors.push("activities[" + index + "].materials must be an array, not an object-map");
      }
    });
    var warnings = collectPageEvidenceDiagnostics(page);
    if (page && typeof page === "object" && !Array.isArray(page)) {
      page.generation_notes = Object.assign({}, page.generation_notes || {});
      var priorValidation =
        page.generation_notes.validation && typeof page.generation_notes.validation === "object"
          ? page.generation_notes.validation
          : {};
      page.generation_notes.validation = Object.assign({}, priorValidation, {
        quality_diagnostics: warnings
      });
    }
    return { ok: errors.length === 0, errors: errors, warnings: warnings };
  }

  function validateGamPartialPageCapture(page) {
    var errors = [];
    if (!page || typeof page !== "object" || Array.isArray(page)) {
      return { ok: false, errors: ["page must be an object"] };
    }
    if (page.artifact_type !== "page") errors.push('artifact_type must be "page"');
    if (page.schema_version !== SCHEMA_VERSION) {
      errors.push('schema_version must be "' + SCHEMA_VERSION + '"');
    }
    if (!Array.isArray(page.activities) || !page.activities.length) {
      errors.push("partial GAM page must include activities[]");
    }
    if (!page.assembly_state || typeof page.assembly_state !== "object") {
      errors.push("assembly_state required");
    }
    if (page.learning_sequence != null) {
      errors.push("learning_sequence must not be present in GAM partial");
    }
    if (page.assessment_check != null) {
      errors.push("assessment_check must not be present in GAM partial");
    }
    (page.activities || []).forEach(function (activity, index) {
      if (!activity || typeof activity !== "object" || Array.isArray(activity)) {
        errors.push("activities[" + index + "] must be an object");
        return;
      }
      if (!hasNonEmptyString(activity.activity_id)) {
        errors.push("activities[" + index + "].activity_id required");
      }
      if (!Array.isArray(activity.materials)) {
        errors.push("activities[" + index + "].materials array required");
        return;
      }
      var seenMaterialIds = {};
      activity.materials.forEach(function (material, mIndex) {
        if (!material || typeof material !== "object" || Array.isArray(material)) {
          errors.push("activities[" + index + "].materials[" + mIndex + "] must be an object");
          return;
        }
        if (!hasNonEmptyString(material.material_id)) {
          errors.push("activities[" + index + "].materials[" + mIndex + "].material_id required");
        } else {
          var mid = String(material.material_id);
          if (seenMaterialIds[mid]) {
            errors.push(
              "activities[" + index + "].materials has duplicate material_id " + mid
            );
          }
          seenMaterialIds[mid] = true;
        }
        if (!hasNonEmptyString(material.material_type)) {
          errors.push("activities[" + index + "].materials[" + mIndex + "].material_type required");
        }
        if (!hasNonEmptyString(material.title)) {
          errors.push("activities[" + index + "].materials[" + mIndex + "].title required");
        }
        pushMaterialBodyAndFormatErrors(material, index, mIndex, errors);
        if (
          !hasNonEmptyString(material.activity_id) &&
          !hasNonEmptyString(material.parent_activity_id)
        ) {
          errors.push(
            "activities[" +
              index +
              "].materials[" +
              mIndex +
              "].activity_id or parent_activity_id required"
          );
        }
      });
    });
    return { ok: errors.length === 0, errors: errors };
  }

  function isVNextPageAtGamStage(page) {
    return (
      page &&
      page.artifact_type === "page" &&
      page.schema_version === SCHEMA_VERSION &&
      page.assembly_state &&
      page.assembly_state.current_stage === "gam"
    );
  }

  return {
    ENRICH_VERSION: ENRICH_VERSION,
    SCHEMA_VERSION: SCHEMA_VERSION,
    BODY_FORMAT: BODY_FORMAT,
    GAM_DLA_OWNED_STRING_FIELDS: GAM_DLA_OWNED_STRING_FIELDS.slice(),
    GAM_DLA_OWNED_JSON_FIELDS: GAM_DLA_OWNED_JSON_FIELDS.slice(),
    buildMaterialFromRequired: buildMaterialFromRequired,
    enrichActivityWithGam: enrichActivityWithGam,
    enrichPageWithGam: enrichPageWithGam,
    normalizeGamCaptureToPage: normalizeGamCaptureToPage,
    isGamActivitySkeleton: isGamActivitySkeleton,
    restoreGamBaselinePreservation: restoreGamBaselinePreservation,
    validateGamEnrichedPage: validateGamEnrichedPage,
    validateGamPartialPageCapture: validateGamPartialPageCapture,
    validateGamActivityFieldPreservation: validateGamActivityFieldPreservation,
    isVNextPageAtGamStage: isVNextPageAtGamStage,
    activitiesMatchExceptMaterials: activitiesMatchExceptMaterials
  };
});
