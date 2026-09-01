/**
 * Gate 1 — Material-role grounding for instructional visuals.
 * Derives effective Graphics policy from material_anchor + authoritative LD metadata.
 * Read-only with respect to DLA/GAM learning-design semantics.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_VISUAL_MATERIAL_ROLE_GROUNDING = api;
  }
})(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  function () {
    "use strict";

    var MODEL_MATERIAL_TYPES = Object.freeze({
      worked_example: true,
      modelling_note: true
    });

    var OPERAND_MATERIAL_TYPES = Object.freeze({
      scenario: true,
      task_card: true,
      scenarios: true,
      task_cards: true,
      study_scenarios: true,
      prompt_set: true
    });

    var EFFECTIVE_POLICY = Object.freeze({
      CONCEPTUAL: "conceptual",
      WORKED_EXAMPLE: "worked_example",
      GROUNDED_SOURCE: "grounded_source"
    });

    var SCENARIO_GROUNDING_CONTEXT_RE =
      /\b(?:use|using)\s+the\s+activity(?:'s|’s)\s+(?:simulated\s+)?(?:capacity\s+setting|scenario)\b|\bactivity(?:'s|’s)\s+(?:simulated\s+)?(?:capacity\s+setting|scenario)\s+as\s+(?:contextual\s+)?grounding\b/i;

    function normalizeKey(value) {
      return String(value == null ? "" : value)
        .trim()
        .toLowerCase();
    }

    function normalizeMaterialId(value) {
      return String(value == null ? "" : value).trim();
    }

    function materialTypeToken(mat) {
      return normalizeKey(mat && (mat.material_type || mat.type));
    }

    function extractContentText(mat) {
      if (!mat || typeof mat !== "object") return "";
      if (typeof mat.body === "string" && mat.body.trim()) return mat.body;
      if (typeof mat.content === "string" && mat.content.trim()) return mat.content;
      if (typeof mat.text === "string" && mat.text.trim()) return mat.text;
      return "";
    }

    function readPracticeIndependence(mat) {
      var pi = mat && mat.practice_independence;
      if (!pi || typeof pi !== "object" || Array.isArray(pi)) return null;
      var ids = Array.isArray(pi.attempt_operand_material_ids)
        ? pi.attempt_operand_material_ids.map(normalizeMaterialId).filter(Boolean)
        : [];
      return { attempt_operand_material_ids: ids };
    }

    function resolveMaterialAnchorStrict(activityIndex, activityId, materialAnchor) {
      var anchorId = normalizeMaterialId(materialAnchor);
      if (!anchorId) {
        return {
          ok: false,
          code: "VPC_MATERIAL_ANCHOR_EMPTY",
          message: "material_anchor must be a non-empty material_id"
        };
      }
      var bucket = activityIndex[normalizeKey(activityId)];
      if (!bucket) {
        return {
          ok: false,
          code: "VPC_MATERIAL_ANCHOR_ACTIVITY",
          message: "unknown activity_id '" + activityId + "' for material_anchor"
        };
      }
      var matches = [];
      (bucket.materials_list || []).forEach(function (mat) {
        if (normalizeMaterialId(mat && mat.material_id) === anchorId) matches.push(mat);
      });
      if (!matches.length) {
        return {
          ok: false,
          code: "VPC_MATERIAL_ANCHOR_UNRESOLVED",
          message:
            "material_anchor '" +
            anchorId +
            "' did not resolve to a material on activity " +
            activityId
        };
      }
      if (matches.length > 1) {
        return {
          ok: false,
          code: "VPC_MATERIAL_ANCHOR_AMBIGUOUS",
          message:
            "material_anchor '" +
            anchorId +
            "' matched multiple materials on activity " +
            activityId
        };
      }
      return { ok: true, material: matches[0] };
    }

    function deriveEffectivePolicy(representedMaterial) {
      if (!representedMaterial) return EFFECTIVE_POLICY.CONCEPTUAL;
      var type = materialTypeToken(representedMaterial);
      if (MODEL_MATERIAL_TYPES[type]) return EFFECTIVE_POLICY.WORKED_EXAMPLE;
      return EFFECTIVE_POLICY.GROUNDED_SOURCE;
    }

    function buildRepresentedMaterialMeta(material, activityId) {
      if (!material || typeof material !== "object") return null;
      var materialId = normalizeMaterialId(material.material_id);
      var type = materialTypeToken(material);
      var pi = readPracticeIndependence(material);
      return {
        material_id: materialId,
        material_type: type,
        activity_id: String(activityId || material.activity_id || "").trim(),
        practice_independence: pi,
        content_text: extractContentText(material),
        title: String(material.title || "").trim()
      };
    }

    function buildMaterialRoleContext(options) {
      var opts = options && typeof options === "object" ? options : {};
      var represented = opts.representedMaterial || null;
      var policy = opts.effectivePolicy || deriveEffectivePolicy(represented);
      var representedMeta = represented
        ? buildRepresentedMaterialMeta(represented, opts.activityId)
        : null;
      var excludedAttemptIds = [];
      if (policy === EFFECTIVE_POLICY.WORKED_EXAMPLE && representedMeta && representedMeta.practice_independence) {
        excludedAttemptIds = representedMeta.practice_independence.attempt_operand_material_ids.slice();
      }
      return {
        effective_policy: policy,
        material_anchor: normalizeMaterialId(opts.materialAnchor) || null,
        represented_material: representedMeta,
        excluded_attempt_material_ids: excludedAttemptIds,
        requires_exact_data_match:
          policy === EFFECTIVE_POLICY.GROUNDED_SOURCE ? true : !!opts.authoredExactDataMatch
      };
    }

    function sourceMaterialId(src) {
      return normalizeMaterialId(src && (src.material_id || src.represented_material_id));
    }

    function isAttemptOperandSource(src, excludedIds) {
      var mid = sourceMaterialId(src);
      if (mid && excludedIds.indexOf(mid) !== -1) return true;
      if (!src || src.source_type !== "activity_material") return false;
      var type = normalizeKey(src.material_type);
      return !!OPERAND_MATERIAL_TYPES[type];
    }

    function filterSourcesForPrecision(sourceEvidence, roleContext) {
      var sources = Array.isArray(sourceEvidence) ? sourceEvidence : [];
      var policy = roleContext && roleContext.effective_policy;
      if (!policy || policy === EFFECTIVE_POLICY.CONCEPTUAL) {
        return sources.filter(function (src) {
          return !isAttemptOperandSource(src, []);
        });
      }
      if (policy === EFFECTIVE_POLICY.WORKED_EXAMPLE) {
        var excluded = (roleContext && roleContext.excluded_attempt_material_ids) || [];
        return sources.filter(function (src) {
          if (src && src.evidence_role === "represented_material") return true;
          return !isAttemptOperandSource(src, excluded);
        });
      }
      if (policy === EFFECTIVE_POLICY.GROUNDED_SOURCE) {
        var repId =
          roleContext &&
          roleContext.represented_material &&
          roleContext.represented_material.material_id;
        return sources.filter(function (src) {
          if (src && src.evidence_role === "represented_material") return true;
          if (repId && sourceMaterialId(src) === repId) return true;
          return src && src.source_type !== "activity_material";
        });
      }
      return sources;
    }

    function contextClaimsScenarioGroundingWithoutAnchor(record) {
      if (!record || typeof record !== "object") return false;
      if (normalizeMaterialId(record.material_anchor)) return false;
      var text = String(record.context || "") + "\n" + String(record.subject || "");
      return SCENARIO_GROUNDING_CONTEXT_RE.test(text);
    }

    function buildRepresentedSourceEvidence(representedMeta) {
      if (!representedMeta) return null;
      var activityId = representedMeta.activity_id;
      var materialId = representedMeta.material_id;
      return {
        anchor: activityId + ".materials." + materialId,
        source_type: "activity_material",
        scope: "activity",
        activity_id: activityId,
        field: "materials." + materialId,
        material_key: materialId,
        material_id: materialId,
        material_type: representedMeta.material_type,
        content: representedMeta.content_text,
        content_structured: null,
        content_text: representedMeta.content_text,
        content_type: "markdown",
        source_kind: "learner_visible_material",
        evidence_role: "represented_material"
      };
    }

    function buildWorkedExampleLabelling(representedMeta) {
      var label = "Worked example";
      if (representedMeta && representedMeta.title) {
        return (
          label +
          " — " +
          representedMeta.title +
          " (a different scenario/context from your independent task)"
        );
      }
      return label + " — a different scenario/context from your independent task";
    }

    return {
      MODEL_MATERIAL_TYPES: MODEL_MATERIAL_TYPES,
      OPERAND_MATERIAL_TYPES: OPERAND_MATERIAL_TYPES,
      EFFECTIVE_POLICY: EFFECTIVE_POLICY,
      SCENARIO_GROUNDING_CONTEXT_RE: SCENARIO_GROUNDING_CONTEXT_RE,
      resolveMaterialAnchorStrict: resolveMaterialAnchorStrict,
      deriveEffectivePolicy: deriveEffectivePolicy,
      buildRepresentedMaterialMeta: buildRepresentedMaterialMeta,
      buildMaterialRoleContext: buildMaterialRoleContext,
      filterSourcesForPrecision: filterSourcesForPrecision,
      contextClaimsScenarioGroundingWithoutAnchor: contextClaimsScenarioGroundingWithoutAnchor,
      buildRepresentedSourceEvidence: buildRepresentedSourceEvidence,
      buildWorkedExampleLabelling: buildWorkedExampleLabelling,
      isAttemptOperandSource: isAttemptOperandSource,
      materialTypeToken: materialTypeToken
    };
  }
);
