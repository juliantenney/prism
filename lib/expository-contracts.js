/**
 * Sprint 85 — minimum Expository sibling artefact contracts (WP2).
 * Field-level schemas within accepted S84-D11 section primary structure.
 * Not Interactive EP/DLA/GAM contracts.
 *
 * S85-D05: Scale/scope remains the user-facing elicitation field.
 * Expository-only normalisation derives optional approximate words-equivalent
 * for EJP explanatory-attention allocation. Word count is a planning constraint,
 * not a mechanical prose quota.
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PrismExpositoryContracts = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var EJP_SCHEMA_VERSION = "1.0.0";
  var XD_SCHEMA_VERSION = "1.0.0";
  var XM_SCHEMA_VERSION = "1.0.0";

  /** Conservative planning assumption for reading-time → words-equivalent (S85-D05). */
  var EXPOSITORY_PLANNING_WORDS_PER_MINUTE = 200;

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function str(value) {
    return String(value == null ? "" : value).trim();
  }

  function parseLooseInt(raw) {
    var n = Number(String(raw || "").replace(/,/g, "").trim());
    return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
  }

  function detectQualitativeHint(text) {
    var lower = String(text || "").toLowerCase();
    if (!lower) return "";
    if (/\bbrief\s+overview\b|\bconcise\s+introduction\b|\bshort\s+overview\b|\bbrief\s+introduction\b/.test(lower)) {
      return "brief";
    }
    if (/\bdetailed\s+treatment\b|\bsubstantial\s+chapter\b|\bin[-\s]?depth\b|\bcomprehensive\b/.test(lower)) {
      return "substantial";
    }
    if (/\bintroduction\b|\boverview\b|\bsummary\b/.test(lower)) {
      return "overview";
    }
    return "";
  }

  /**
   * Expository-only scope normalisation.
   * Preserves original user text; derives approximate words_equivalent only when
   * explicit word-count or reading-time intent is present. Does not invent
   * numeric precision for qualitative-only inputs.
   */
  function normalizeExpositoryScopeExtent(scopeText) {
    var text = str(scopeText);
    var out = {
      scope_text: text,
      words_equivalent: null,
      reading_minutes: null,
      interpretation: text ? "qualitative" : "empty",
      qualitative_hint: detectQualitativeHint(text),
      words_per_minute_assumption: EXPOSITORY_PLANNING_WORDS_PER_MINUTE,
      is_approximate: true,
      planning_role: "content_extent"
    };
    if (!text) return out;

    var rangeMatch = text.match(
      /(?:(?:about|approx(?:imately)?|around|roughly|~)\s*)?([\d,]+)\s*[–\-to]+\s*([\d,]+)\s*-?\s*words?\b/i
    );
    var singleMatch = text.match(
      /(?:(?:about|approx(?:imately)?|around|roughly|~)\s*)?([\d,]+)\s*-?\s*words?\b/i
    );
    var compoundMatch = text.match(/([\d,]+)\s*-?\s*word(?:ed)?\b/i);
    var readingMatch = text.match(
      /(?:(?:about|approx(?:imately)?|around|roughly|~)\s*)?(\d{1,3})\s*(?:minutes?|mins?|min)\b/i
    );

    if (rangeMatch) {
      var lo = parseLooseInt(rangeMatch[1]);
      var hi = parseLooseInt(rangeMatch[2]);
      if (lo != null && hi != null) {
        out.words_equivalent = Math.round((lo + hi) / 2);
        out.interpretation = "explicit_words";
        return out;
      }
    }
    if (singleMatch) {
      var words = parseLooseInt(singleMatch[1]);
      if (words != null) {
        out.words_equivalent = words;
        out.interpretation = "explicit_words";
        return out;
      }
    }
    if (compoundMatch) {
      var compoundWords = parseLooseInt(compoundMatch[1]);
      if (compoundWords != null) {
        out.words_equivalent = compoundWords;
        out.interpretation = "explicit_words";
        return out;
      }
    }
    if (readingMatch) {
      var minutes = parseLooseInt(readingMatch[1]);
      if (minutes != null) {
        out.reading_minutes = minutes;
        out.words_equivalent = minutes * EXPOSITORY_PLANNING_WORDS_PER_MINUTE;
        out.interpretation = "reading_time";
        return out;
      }
    }

    return out;
  }

  function normalizeExtentObject(raw, fallbackScopeText) {
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      var scopeText = str(raw.scope_text) || str(fallbackScopeText);
      var base = normalizeExpositoryScopeExtent(scopeText || str(raw.qualitative_hint));
      if (raw.words_equivalent != null && raw.words_equivalent !== "") {
        var we = Number(raw.words_equivalent);
        if (Number.isFinite(we) && we > 0) {
          base.words_equivalent = Math.round(we);
          if (base.interpretation === "qualitative" || base.interpretation === "empty") {
            base.interpretation = "explicit_words";
          }
        }
      }
      if (raw.reading_minutes != null && raw.reading_minutes !== "") {
        var rm = Number(raw.reading_minutes);
        if (Number.isFinite(rm) && rm > 0) {
          base.reading_minutes = Math.round(rm);
          if (base.words_equivalent == null) {
            base.words_equivalent = base.reading_minutes * EXPOSITORY_PLANNING_WORDS_PER_MINUTE;
            base.interpretation = "reading_time";
          }
        }
      }
      if (str(raw.qualitative_hint)) base.qualitative_hint = str(raw.qualitative_hint);
      if (str(raw.interpretation)) base.interpretation = str(raw.interpretation);
      base.is_approximate = raw.is_approximate !== false;
      base.planning_role = str(raw.planning_role) || "content_extent";
      base.words_per_minute_assumption =
        Number(raw.words_per_minute_assumption) > 0
          ? Number(raw.words_per_minute_assumption)
          : EXPOSITORY_PLANNING_WORDS_PER_MINUTE;
      return base;
    }
    return normalizeExpositoryScopeExtent(fallbackScopeText);
  }

  /**
   * Minimum EJP shape: ordered learner-facing exposition sections.
   * Owns progressive construction of understanding (not TOC-only).
   *
   * Substantive section fields:
   * - purpose / conceptual_move / knowledge_focus: role of this section in the journey
   * - dependencies / connections / synthesis: whole-resource progression (not serial coverage)
   * - elaboration_intentions / representation_needs: planned kinds of support (judgement labels, not checklist schema)
   * - lo_refs: destinations in the LO set this section advances
   *
   * extent (optional): Expository planning constraint derived from Scale/scope.
   * EJP owns allocation of explanatory attention across the intellectual journey.
   */
  function normalizeExpositoryJourneyPlan(raw) {
    var src = raw && typeof raw === "object" ? raw : {};
    var sections = asArray(src.sections).map(function (row, idx) {
      var r = row && typeof row === "object" ? row : {};
      return {
        section_id: str(r.section_id) || "section_" + (idx + 1),
        title: str(r.title) || "Section " + (idx + 1),
        purpose: str(r.purpose),
        knowledge_focus: str(r.knowledge_focus),
        conceptual_move: str(r.conceptual_move),
        dependencies: asArray(r.dependencies).map(str).filter(Boolean),
        lo_refs: asArray(r.lo_refs).map(str).filter(Boolean),
        elaboration_intentions: asArray(r.elaboration_intentions).map(str).filter(Boolean),
        representation_needs: asArray(r.representation_needs).map(str).filter(Boolean),
        connections: asArray(r.connections).map(str).filter(Boolean),
        synthesis: str(r.synthesis),
        order: typeof r.order === "number" ? r.order : idx + 1
      };
    });
    var extent = normalizeExtentObject(
      src.extent,
      src.scope_scale || src.scope_text || src.scopeScale || ""
    );
    var out = {
      artifact_type: "expository_journey_plan",
      schema_version: str(src.schema_version) || EJP_SCHEMA_VERSION,
      title: str(src.title),
      audience: str(src.audience),
      journey_intent: str(src.journey_intent),
      sections: sections,
      learning_outcomes: asArray(src.learning_outcomes),
      generation_notes: str(src.generation_notes)
    };
    if (extent.scope_text || extent.words_equivalent != null || extent.qualitative_hint) {
      out.extent = extent;
    }
    return out;
  }

  /**
   * XD: per-section design rationale + learner-facing exposition + material commissions
   * (no Interactive evidence).
   * explanation_intent = authorial/design rationale (not learner-facing prose).
   * exposition = learner-facing explanatory content that realises that intent.
   * materials_commission = supporting intellectual artefacts only (not activities).
   * Section-level extent implications are inherited from EJP allocation (not re-derived).
   * Do not silently promote explanation_intent into exposition.
   */
  function normalizeExpositoryDevelopment(raw) {
    var src = raw && typeof raw === "object" ? raw : {};
    var sections = asArray(src.sections).map(function (row, idx) {
      var r = row && typeof row === "object" ? row : {};
      var commissions = asArray(r.materials_commission).map(function (c, cidx) {
        var m = c && typeof c === "object" ? c : {};
        return {
          commission_id: str(m.commission_id) || "commission_" + (idx + 1) + "_" + (cidx + 1),
          section_id: str(m.section_id) || str(r.section_id) || "section_" + (idx + 1),
          // Free pedagogical kind label (example, comparison, diagram, …) — not a fixed taxonomy.
          kind: str(m.kind),
          intent: str(m.intent),
          constraints: str(m.constraints)
        };
      });
      return {
        section_id: str(r.section_id) || "section_" + (idx + 1),
        explanation_intent: str(r.explanation_intent) || str(r.explanatory_treatment),
        // Learner-facing prose only — never fabricate from explanation_intent.
        exposition: str(r.exposition),
        invitations_to_think: asArray(r.invitations_to_think).map(str).filter(Boolean),
        continuity_hooks: asArray(r.continuity_hooks).map(str).filter(Boolean),
        materials_commission: commissions
      };
    });
    return {
      artifact_type: "expository_development",
      schema_version: str(src.schema_version) || XD_SCHEMA_VERSION,
      sections: sections,
      generation_notes: str(src.generation_notes)
    };
  }

  function cloneJsonValue(value) {
    if (value == null || typeof value !== "object") return value;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_err) {
      return null;
    }
  }

  /**
   * Preserve string prose and structured object/array bodies.
   * Never coerce plain objects via String(object) → "[object Object]".
   */
  function normalizeMaterialBody(value) {
    if (value == null) return "";
    if (typeof value === "string") return value.trim();
    if (typeof value === "object") {
      var cloned = cloneJsonValue(value);
      return cloned == null ? "" : cloned;
    }
    return str(value);
  }

  /**
   * XM: realised material bodies under commission lock (1:1 commissions).
   * Realises within EJP/XD extent constraints; does not independently expand scope.
   * body may be learner prose (string) or a structured semantic object.
   * formal_notes are authoring/render guidance only (not learner-facing by default).
   */
  function normalizeExpositoryMaterials(raw) {
    var src = raw && typeof raw === "object" ? raw : {};
    var materials = asArray(src.materials).map(function (row, idx) {
      var r = row && typeof row === "object" ? row : {};
      return {
        material_id: str(r.material_id) || "material_" + (idx + 1),
        commission_id: str(r.commission_id),
        section_id: str(r.section_id),
        kind: str(r.kind) || "prose",
        body: normalizeMaterialBody(r.body),
        formal_notes: str(r.formal_notes)
      };
    });
    return {
      artifact_type: "expository_materials",
      schema_version: str(src.schema_version) || XM_SCHEMA_VERSION,
      materials: materials,
      generation_notes: str(src.generation_notes)
    };
  }

  function validateCommissionLock(development, materials) {
    var xd = normalizeExpositoryDevelopment(development);
    var xm = normalizeExpositoryMaterials(materials);
    var commissioned = {};
    xd.sections.forEach(function (sec) {
      asArray(sec.materials_commission).forEach(function (c) {
        if (c.commission_id) commissioned[c.commission_id] = true;
      });
    });
    var warnings = [];
    var seen = {};
    xm.materials.forEach(function (m) {
      if (!m.commission_id) {
        warnings.push("material missing commission_id: " + m.material_id);
        return;
      }
      if (!commissioned[m.commission_id]) {
        warnings.push("uncommissioned material: " + m.commission_id);
      }
      if (seen[m.commission_id]) {
        warnings.push("duplicate realisation for commission: " + m.commission_id);
      }
      seen[m.commission_id] = true;
    });
    Object.keys(commissioned).forEach(function (id) {
      if (!seen[id]) warnings.push("missing realisation for commission: " + id);
    });
    return { ok: warnings.length === 0, warnings: warnings };
  }

  function resolveExpositoryArtefactKind(rawOrKind) {
    if (typeof rawOrKind === "string") {
      var k = str(rawOrKind).toLowerCase().replace(/\s+/g, "_");
      if (
        k === "expository_journey_plan" ||
        k === "expository_development" ||
        k === "expository_materials"
      ) {
        return k;
      }
      return "";
    }
    var src = rawOrKind && typeof rawOrKind === "object" ? rawOrKind : {};
    return resolveExpositoryArtefactKind(src.artifact_type);
  }

  function normalizeExpositoryArtefact(raw, kindHint) {
    var kind = resolveExpositoryArtefactKind(kindHint) || resolveExpositoryArtefactKind(raw);
    if (kind === "expository_journey_plan") return normalizeExpositoryJourneyPlan(raw);
    if (kind === "expository_development") return normalizeExpositoryDevelopment(raw);
    if (kind === "expository_materials") return normalizeExpositoryMaterials(raw);
    return null;
  }

  function validateExpositoryArtefactShape(raw, kindHint) {
    var kind = resolveExpositoryArtefactKind(kindHint) || resolveExpositoryArtefactKind(raw);
    if (!kind) {
      return { ok: false, errors: ["unknown_expository_artefact_kind"], kind: "" };
    }
    var normalized = normalizeExpositoryArtefact(raw, kind);
    var errors = [];
    if (!normalized || String(normalized.artifact_type) !== kind) {
      errors.push('artifact_type must be "' + kind + '"');
    }
    if (kind === "expository_journey_plan") {
      if (!Array.isArray(normalized.sections) || !normalized.sections.length) {
        errors.push("expository_journey_plan.sections[] required");
      }
    }
    if (kind === "expository_development") {
      if (!Array.isArray(normalized.sections) || !normalized.sections.length) {
        errors.push("expository_development.sections[] required");
      } else {
        normalized.sections.forEach(function (sec, index) {
          if (!sec || typeof sec !== "object") {
            errors.push("expository_development.sections[" + index + "] must be an object");
            return;
          }
          if (!str(sec.exposition)) {
            errors.push(
              "expository_development.sections[" +
                index +
                "].exposition required (non-empty learner-facing prose; incomplete Expository Development)"
            );
          }
        });
      }
    }
    if (kind === "expository_materials") {
      if (!Array.isArray(normalized.materials)) {
        errors.push("expository_materials.materials[] required");
      }
    }
    return {
      ok: errors.length === 0,
      errors: errors,
      kind: kind,
      normalized: normalized
    };
  }

  return {
    EJP_SCHEMA_VERSION: EJP_SCHEMA_VERSION,
    XD_SCHEMA_VERSION: XD_SCHEMA_VERSION,
    XM_SCHEMA_VERSION: XM_SCHEMA_VERSION,
    EXPOSITORY_PLANNING_WORDS_PER_MINUTE: EXPOSITORY_PLANNING_WORDS_PER_MINUTE,
    normalizeExpositoryScopeExtent: normalizeExpositoryScopeExtent,
    normalizeExpositoryJourneyPlan: normalizeExpositoryJourneyPlan,
    normalizeExpositoryDevelopment: normalizeExpositoryDevelopment,
    normalizeExpositoryMaterials: normalizeExpositoryMaterials,
    validateCommissionLock: validateCommissionLock,
    resolveExpositoryArtefactKind: resolveExpositoryArtefactKind,
    normalizeExpositoryArtefact: normalizeExpositoryArtefact,
    validateExpositoryArtefactShape: validateExpositoryArtefactShape
  };
});

