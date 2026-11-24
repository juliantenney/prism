/**
 * Sprint 102D — Commission-native learning-outcome extract / validate / topology.
 *
 * Deterministic only. Never invents, rewrites, or fabricates DLO/GLC/KM captures.
 * Binds COMPONENT outcomes only — never substitutes journey outcomes.
 */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.PRISM_COMMISSION_NATIVE_LO_BIND = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  var COMPONENT_BEGIN = "<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>";
  var COMPONENT_END = "<<<COMPONENT_LEARNING_OUTCOMES_END>>>";
  var JOURNEY_BEGIN = "<<<JOURNEY_LEARNING_OUTCOMES_BEGIN>>>";
  var JOURNEY_END = "<<<JOURNEY_LEARNING_OUTCOMES_END>>>";

  var FOUNDATION_TITLES = {
    "generate learning content": true,
    "model knowledge": true,
    "define learning outcomes": true,
    "normalize content": true
  };

  function asText(value) {
    return String(value == null ? "" : value).trim();
  }

  function normalizeNewlines(value) {
    return asText(value).replace(/\r\n/g, "\n");
  }

  function resolveStrictMod() {
    if (typeof module === "object" && module.exports) {
      try {
        return require("./workflow-artefact-json-strict.js");
      } catch (_err) {}
    }
    if (root && root.PRISM_WORKFLOW_ARTEFACT_JSON_STRICT) {
      return root.PRISM_WORKFLOW_ARTEFACT_JSON_STRICT;
    }
    if (typeof globalThis !== "undefined" && globalThis.PRISM_WORKFLOW_ARTEFACT_JSON_STRICT) {
      return globalThis.PRISM_WORKFLOW_ARTEFACT_JSON_STRICT;
    }
    return null;
  }

  function countMarker(text, marker) {
    var n = 0;
    var from = 0;
    var at;
    while ((at = text.indexOf(marker, from)) !== -1) {
      n += 1;
      from = at + marker.length;
    }
    return n;
  }

  function extractMarkedJsonBlock(text, beginMarker, endMarker, kind) {
    var body = normalizeNewlines(text);
    if (!body) {
      return { ok: false, kind: "missing", value: null, errors: [kind + "_block_missing"] };
    }
    var beginCount = countMarker(body, beginMarker);
    var endCount = countMarker(body, endMarker);
    if (beginCount === 0 && endCount === 0) {
      return { ok: false, kind: "missing", value: null, errors: [kind + "_markers_missing"] };
    }
    if (beginCount !== 1 || endCount !== 1) {
      return {
        ok: false,
        kind: "malformed",
        value: null,
        errors: [kind + "_markers_duplicate_or_unbalanced"]
      };
    }
    var beginAt = body.indexOf(beginMarker);
    var endAt = body.indexOf(endMarker);
    if (endAt <= beginAt) {
      return {
        ok: false,
        kind: "malformed",
        value: null,
        errors: [kind + "_markers_unordered"]
      };
    }
    var inner = body.slice(beginAt + beginMarker.length, endAt).trim();
    if (!inner) {
      return { ok: false, kind: "malformed", value: null, errors: [kind + "_block_empty"] };
    }
    // Tolerate optional markdown fences inside markers without rewriting outcomes.
    var fenceMatch = inner.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    if (fenceMatch) inner = String(fenceMatch[1] || "").trim();
    var parsed;
    try {
      parsed = JSON.parse(inner);
    } catch (_err) {
      return {
        ok: false,
        kind: "malformed",
        value: null,
        errors: [kind + "_json_invalid"]
      };
    }
    return { ok: true, kind: "present", value: parsed, errors: [], rawInner: inner };
  }

  function thinRowChecks(learningOutcomesObj) {
    var errors = [];
    var rows =
      learningOutcomesObj && Array.isArray(learningOutcomesObj.learning_outcomes)
        ? learningOutcomesObj.learning_outcomes
        : [];
    var i;
    for (i = 0; i < rows.length; i += 1) {
      var row = rows[i];
      if (!row || typeof row !== "object" || Array.isArray(row)) {
        errors.push("learning_outcomes[" + i + "]:not_object");
        continue;
      }
      var stmt = asText(
        row.statement || row.text || row.description || row.outcome || row.outcome_statement
      );
      if (!stmt) {
        errors.push("learning_outcomes[" + i + "]:missing_statement");
      } else if (!asText(row.statement)) {
        row.statement = stmt;
      }
    }
    return errors;
  }

  function normalizeCandidateLearningOutcomesInput(raw) {
    if (Array.isArray(raw)) {
      return { learning_outcomes: raw.slice() };
    }
    if (raw && typeof raw === "object") {
      if (
        !Array.isArray(raw.learning_outcomes) &&
        !Array.isArray(raw.outcomes) &&
        Array.isArray(raw.component_learning_outcomes)
      ) {
        return Object.assign({}, raw, {
          learning_outcomes: raw.component_learning_outcomes.slice()
        });
      }
      return raw;
    }
    return raw;
  }

  function validateLearningOutcomesObject(obj) {
    var candidate = normalizeCandidateLearningOutcomesInput(obj);
    var strict = resolveStrictMod();
    var value = candidate;
    if (strict && typeof strict.validateLearningOutcomesShape === "function") {
      var shape = strict.validateLearningOutcomesShape(candidate);
      if (!shape.ok) {
        return { ok: false, value: null, errors: (shape.errors || []).slice() };
      }
      value = shape.value;
    } else {
      if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
        return { ok: false, value: null, errors: ["learning_outcomes:not_object"] };
      }
      if (!Array.isArray(candidate.learning_outcomes) || !candidate.learning_outcomes.length) {
        return {
          ok: false,
          value: null,
          errors: ["learning_outcomes:empty_or_missing_outcomes_array"]
        };
      }
    }
    var rowErrors = thinRowChecks(value);
    if (rowErrors.length) {
      return { ok: false, value: null, errors: rowErrors };
    }
    return { ok: true, value: value, errors: [] };
  }

  function extractComponentLearningOutcomes(specificationText) {
    var extracted = extractMarkedJsonBlock(
      specificationText,
      COMPONENT_BEGIN,
      COMPONENT_END,
      "component_lo"
    );
    if (!extracted.ok) return extracted;
    var validated = validateLearningOutcomesObject(extracted.value);
    if (!validated.ok) {
      return {
        ok: false,
        kind: "malformed",
        value: null,
        errors: validated.errors
      };
    }
    return {
      ok: true,
      kind: "present",
      value: validated.value,
      errors: []
    };
  }

  function extractJourneyLearningOutcomes(journeyContextText) {
    var extracted = extractMarkedJsonBlock(
      journeyContextText,
      JOURNEY_BEGIN,
      JOURNEY_END,
      "journey_lo"
    );
    if (!extracted.ok) return extracted;
    var validated = validateLearningOutcomesObject(extracted.value);
    if (!validated.ok) {
      return {
        ok: false,
        kind: "malformed",
        value: null,
        errors: validated.errors
      };
    }
    return {
      ok: true,
      kind: "present",
      value: validated.value,
      errors: []
    };
  }

  function isFoundationTitle(title) {
    return !!FOUNDATION_TITLES[String(title || "").trim().toLowerCase()];
  }

  function omitFoundationTitles(titles) {
    var list = Array.isArray(titles) ? titles : [];
    return list.filter(function (title) {
      return !isFoundationTitle(title);
    });
  }

  function omitFoundationSteps(steps) {
    var list = Array.isArray(steps) ? steps : [];
    return list.filter(function (step) {
      return !isFoundationTitle(step && step.title);
    });
  }

  function planningEntryTitleForProduct(productId) {
    var id = asText(productId).toLowerCase();
    if (id === "interactive" || id === "practice") return "Design Episode Plan";
    if (id === "expository") return "Expository Journey Plan";
    if (id === "assessment_pack") return "Interpret Evidence Purpose";
    return "";
  }

  function provenanceRecord(sourceField) {
    return {
      authority: "learning_journey_commission",
      source_field: sourceField || "commission_specification",
      not_dlo_generated: true
    };
  }

  /**
   * Attempt bind from commission specification (+ optional journey context for seed only).
   * Success requires valid COMPONENT markers. Journey markers never substitute.
   */
  function tryBindCommissionNativeLos(specificationText, journeyContextText, options) {
    var opts = options && typeof options === "object" ? options : {};
    var component = extractComponentLearningOutcomes(specificationText);
    var sourceField = "commission_specification";
    if (!component.ok && component.kind === "missing" && opts.structuredComponentLearningOutcomes != null) {
      var structuredCheck = validateLearningOutcomesObject(opts.structuredComponentLearningOutcomes);
      if (structuredCheck.ok) {
        component = {
          ok: true,
          kind: "present",
          value: structuredCheck.value,
          errors: []
        };
        sourceField = "commission_learning_outcomes";
      } else {
        component = {
          ok: false,
          kind: "malformed",
          value: null,
          errors: structuredCheck.errors || ["structured_component_lo_invalid"]
        };
      }
    }
    if (!component.ok) {
      return {
        ok: false,
        bound: false,
        reason: component.kind || "invalid",
        errors: component.errors || [],
        componentLearningOutcomes: null,
        journeyLearningOutcomes: null,
        provenance: null
      };
    }
    var journey = extractJourneyLearningOutcomes(journeyContextText || "");
    return {
      ok: true,
      bound: true,
      reason: "component_los_bound",
      errors: [],
      componentLearningOutcomes: component.value,
      journeyLearningOutcomes: journey.ok ? journey.value : null,
      journeyLearningOutcomesStatus: journey.ok ? "present" : journey.kind || "missing",
      provenance: provenanceRecord(sourceField)
    };
  }

  function applyCommissionNativeTopology(built, productId) {
    if (!built || typeof built !== "object") return built;
    var titles = omitFoundationTitles(built.titles);
    var steps = omitFoundationSteps(built.steps);
    var entry = planningEntryTitleForProduct(productId);
    if (entry && titles.length && String(titles[0] || "").trim() !== entry) {
      // Soft check only — callers may assert in tests; do not invent steps.
    }
    return Object.assign({}, built, {
      titles: titles,
      steps: steps
    });
  }

  function composeCommissionNativeOutcomePreamble() {
    return [
      "COMMISSION-NATIVE OUTCOME AUTHORITY",
      "",
      "Outcome authority. The commissioned component learning_outcomes supplied with this workflow are authoritative. Do not replace them or independently regenerate a competing outcome set.",
      "",
      "Journey membership. This component belongs to a larger Learning Journey sequence. It need not be independently comprehensive of the whole journey.",
      "",
      "Prior learning. Build on knowledge and capabilities explicitly established by earlier components (see LEARNING JOURNEY CONTEXT). Do not unnecessarily reteach that material.",
      "",
      "Component responsibility. Fulfil the specified instructional role and the allocated component learning_outcomes only.",
      "",
      "Continuity. Where the commission identifies later dependencies, prepare learners for those subsequent components without assuming this resource must complete the whole journey.",
      "",
      "Disciplinary reasoning. Apply subject knowledge directly as required by the commission and outcomes. Do not invent a parallel knowledge-modelling stage or substitute knowledge_model artefact."
    ].join("\n");
  }

  function wrapComponentLearningOutcomes(obj) {
    return (
      COMPONENT_BEGIN +
      "\n" +
      JSON.stringify(obj, null, 2) +
      "\n" +
      COMPONENT_END
    );
  }

  function wrapJourneyLearningOutcomes(obj) {
    return (
      JOURNEY_BEGIN + "\n" + JSON.stringify(obj, null, 2) + "\n" + JOURNEY_END
    );
  }

  return {
    COMPONENT_BEGIN: COMPONENT_BEGIN,
    COMPONENT_END: COMPONENT_END,
    JOURNEY_BEGIN: JOURNEY_BEGIN,
    JOURNEY_END: JOURNEY_END,
    extractComponentLearningOutcomes: extractComponentLearningOutcomes,
    extractJourneyLearningOutcomes: extractJourneyLearningOutcomes,
    validateLearningOutcomesObject: validateLearningOutcomesObject,
    tryBindCommissionNativeLos: tryBindCommissionNativeLos,
    omitFoundationTitles: omitFoundationTitles,
    omitFoundationSteps: omitFoundationSteps,
    applyCommissionNativeTopology: applyCommissionNativeTopology,
    planningEntryTitleForProduct: planningEntryTitleForProduct,
    isFoundationTitle: isFoundationTitle,
    provenanceRecord: provenanceRecord,
    composeCommissionNativeOutcomePreamble: composeCommissionNativeOutcomePreamble,
    wrapComponentLearningOutcomes: wrapComponentLearningOutcomes,
    wrapJourneyLearningOutcomes: wrapJourneyLearningOutcomes
  };
});
