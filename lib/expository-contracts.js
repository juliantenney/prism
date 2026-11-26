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

  function loadMaterialAnchorsApi() {
    if (typeof require === "function") {
      try {
        return require("./expository-material-anchors.js");
      } catch (_err) {}
    }
    if (typeof globalThis !== "undefined" && globalThis.PrismExpositoryMaterialAnchors) {
      return globalThis.PrismExpositoryMaterialAnchors;
    }
    return null;
  }

  /** Conservative planning assumption for reading-time → words-equivalent (S85-D05). */
  var EXPOSITORY_PLANNING_WORDS_PER_MINUTE = 200;

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function str(value) {
    return String(value == null ? "" : value).trim();
  }

  /**
   * Preferred string-bearing keys for planning/list objects emitted by models.
   * Order matters: take the first usable prose/label, never concatenate properties.
   * Sprint 99 M3-1 — avoid String(object) → "[object Object]".
   */
  var PLANNING_STRING_OBJECT_KEYS = [
    "text",
    "prompt",
    "body",
    "statement",
    "content",
    "invitation",
    "question",
    "hook",
    "continuity_hook",
    "kind",
    "intention",
    "need",
    "type",
    "connection",
    "dependency",
    "to",
    "target",
    "section_id",
    "sectionId",
    "id",
    "label",
    "note",
    "description",
    "value"
  ];

  /**
   * Coerce one planning/list entry to a usable string without inventing content.
   * - strings preserved (trimmed); literal "[object Object]" treated as empty
   * - numbers/booleans stringified
   * - plain objects: extract first supported string-bearing key only
   * - arrays / unsupported objects / null: empty (dropped by callers)
   */
  function normalizePlanningStringListItem(value, depth) {
    var level = typeof depth === "number" ? depth : 0;
    if (value == null) return "";
    if (typeof value === "string") {
      var trimmed = value.trim();
      if (!trimmed || trimmed === "[object Object]") return "";
      return trimmed;
    }
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value).trim();
    }
    if (typeof value !== "object" || Array.isArray(value)) {
      return "";
    }
    if (level >= 2) return "";
    for (var i = 0; i < PLANNING_STRING_OBJECT_KEYS.length; i++) {
      var key = PLANNING_STRING_OBJECT_KEYS[i];
      if (!Object.prototype.hasOwnProperty.call(value, key)) continue;
      var extracted = normalizePlanningStringListItem(value[key], level + 1);
      if (extracted) return extracted;
    }
    return "";
  }

  function normalizePlanningStringList(value) {
    // Do not pass Array.map's index into normalizePlanningStringListItem's depth slot.
    return asArray(value)
      .map(function (entry) {
        return normalizePlanningStringListItem(entry, 0);
      })
      .filter(Boolean);
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
   * EQ1 (S87-T-002): commissioned_purpose + epistemic_form — free-text semantic
   * contract preserving the commissioned intellectual question/task and the kind
   * of understanding required. Not a closed taxonomy. Origin: EJP from user/
   * workflow commission (+ LO/GLC clarification); XD treats as binding.
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
        dependencies: normalizePlanningStringList(r.dependencies),
        lo_refs: normalizePlanningStringList(r.lo_refs),
        elaboration_intentions: normalizePlanningStringList(r.elaboration_intentions),
        representation_needs: normalizePlanningStringList(r.representation_needs),
        connections: normalizePlanningStringList(r.connections),
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
      // EQ1 — free-text only; trim whitespace; never enum-normalise epistemic_form.
      commissioned_purpose: str(src.commissioned_purpose),
      epistemic_form: str(src.epistemic_form),
      sections: sections,
      learning_outcomes: asArray(src.learning_outcomes),
      generation_notes: normalizeGenerationNotes(src.generation_notes)
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
        invitations_to_think: normalizePlanningStringList(r.invitations_to_think),
        continuity_hooks: normalizePlanningStringList(r.continuity_hooks),
        materials_commission: commissions
      };
    });
    return {
      artifact_type: "expository_development",
      schema_version: str(src.schema_version) || XD_SCHEMA_VERSION,
      sections: sections,
      generation_notes: normalizeGenerationNotes(src.generation_notes)
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
   * generation_notes may be prose or a structured object (register, unicode_math, …).
   * Preserve objects/arrays exactly; never coerce via String(object) → "[object Object]".
   */
  function normalizeGenerationNotes(value) {
    if (value == null) return "";
    if (typeof value === "string") {
      var trimmed = value.trim();
      if (!trimmed || trimmed === "[object Object]") return "";
      return trimmed;
    }
    if (typeof value === "object") {
      var cloned = cloneJsonValue(value);
      return cloned == null ? "" : cloned;
    }
    return str(value);
  }

  /**
   * formal_notes may be prose or structured authoring guidance.
   * Preserve objects/arrays; never coerce via String(object) → "[object Object]".
   * Author-only — not learner-facing by default.
   */
  function normalizeFormalNotes(value) {
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
        formal_notes: normalizeFormalNotes(r.formal_notes)
      };
    });
    return {
      artifact_type: "expository_materials",
      schema_version: str(src.schema_version) || XM_SCHEMA_VERSION,
      materials: materials,
      generation_notes: normalizeGenerationNotes(src.generation_notes)
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
    var anchorsApi = loadMaterialAnchorsApi();
    if (anchorsApi && typeof anchorsApi.validateExpositoryDevelopmentAnchors === "function") {
      var xdAnchorCheck = anchorsApi.validateExpositoryDevelopmentAnchors(xd);
      if (!xdAnchorCheck.ok) {
        xdAnchorCheck.errors.forEach(function (err) {
          warnings.push(err);
        });
      }
      var materialsBySection = {};
      xm.materials.forEach(function (m) {
        var sid = str(m.section_id);
        if (!sid) return;
        if (!materialsBySection[sid]) materialsBySection[sid] = [];
        materialsBySection[sid].push(m);
      });
      xd.sections.forEach(function (sec) {
        var mergedSec = Object.assign({}, sec, {
          materials: materialsBySection[sec.section_id] || []
        });
        var secAnchorCheck = anchorsApi.validateSectionMaterialAnchors(mergedSec, {
          allSections: xd.sections,
          requireRealisedMaterials: true
        });
        if (!secAnchorCheck.ok) {
          secAnchorCheck.errors.forEach(function (err) {
            if (warnings.indexOf(err) === -1) warnings.push(err);
          });
        }
      });
    }
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

  function isPlainObject(v) {
    return !!(v && typeof v === "object" && !Array.isArray(v));
  }

  var RAW_HTML_CHART_RE = /<(?:svg|canvas)\b|<\/svg>/i;
  var MISNAMED_SCATTERPLOT_KEYS = [
    "scatter_plot",
    "scatterplot_spec",
    "scatterplot_specification",
    "plot_specification",
    "plot_spec"
  ];

  function extractCanonicalScatterplotObservations(spec) {
    if (!isPlainObject(spec)) return [];
    var raw = Array.isArray(spec.observations)
      ? spec.observations
      : Array.isArray(spec.points)
        ? spec.points
        : null;
    if (!raw && Array.isArray(spec.series) && spec.series.length) {
      var collected = [];
      spec.series.forEach(function (entry) {
        if (!isPlainObject(entry)) return;
        var pts = Array.isArray(entry.points)
          ? entry.points
          : Array.isArray(entry.observations)
            ? entry.observations
            : null;
        if (pts) pts.forEach(function (pt) { collected.push(pt); });
      });
      if (collected.length) raw = collected;
    }
    if (!Array.isArray(raw)) return [];
    return raw.filter(function (pt) {
      return isPlainObject(pt) && isFinite(Number(pt.x)) && isFinite(Number(pt.y));
    });
  }

  function validateExpositoryScatterplotBody(body, pathPrefix, errors) {
    if (!isPlainObject(body)) return;
    for (var mk = 0; mk < MISNAMED_SCATTERPLOT_KEYS.length; mk += 1) {
      var badKey = MISNAMED_SCATTERPLOT_KEYS[mk];
      if (isPlainObject(body[badKey]) && !isPlainObject(body.scatterplot)) {
        errors.push(
          pathPrefix +
            "." +
            badKey +
            ' [XM-SCATTER-01]: unsupported scatterplot key "' +
            badKey +
            '"; use canonical body.scatterplot with x_axis, y_axis, and inline observations[]'
        );
        return;
      }
    }
    var spec = isPlainObject(body.scatterplot)
      ? body.scatterplot
      : /scatter/i.test(str(body.chart_type))
        ? body
        : null;
    if (!spec) return;
    var specPath = isPlainObject(body.scatterplot) ? pathPrefix + ".scatterplot" : pathPrefix;
    var validObs = extractCanonicalScatterplotObservations(spec);
    if (validObs.length < 2) {
      var hasRelationalRef =
        !!str(spec.data_reference) ||
        spec.observation_identifier_column_index != null ||
        (isPlainObject(spec.x_axis) && spec.x_axis.column_index != null) ||
        (isPlainObject(spec.y_axis) && spec.y_axis.column_index != null);
      errors.push(
        specPath +
          " [XM-SCATTER-01]: structured scatterplot requires at least 2 finite numeric { x, y } entries in inline observations[] (or points[]/series[].points[])" +
          (hasRelationalRef
            ? "; relational data_reference/column_index scatterplot specifications are not supported — supply inline observations[] directly"
            : "")
      );
    }
    if (!isPlainObject(spec.x_axis) || !str(spec.x_axis.label)) {
      errors.push(specPath + ".x_axis.label [XM-SCATTER-01]: required non-empty x-axis label");
    }
    if (!isPlainObject(spec.y_axis) || !str(spec.y_axis.label)) {
      errors.push(specPath + ".y_axis.label [XM-SCATTER-01]: required non-empty y-axis label");
    }
  }

  function validateExpositoryFormativeCheckBody(body, pathPrefix, errors) {
    if (!isPlainObject(body)) return;
    var responseType = str(body.response_type).toLowerCase();
    var looksLikeCheck =
      !!responseType ||
      !!str(body.correct_option_id) ||
      Array.isArray(body.response_categories) ||
      (Array.isArray(body.statements) &&
        body.statements.some(function (st) {
          return isPlainObject(st) && !!str(st.correct_category_id);
        }));
    if (!looksLikeCheck) return;

    if (responseType === "single_selection" || (!responseType && !!str(body.correct_option_id))) {
      if (!str(body.question) && !str(body.prompt)) {
        errors.push(pathPrefix + ".question [XM-CHECK-01]: single_selection check requires non-empty question");
      }
      var opts = Array.isArray(body.options) ? body.options : [];
      if (opts.length < 2) {
        errors.push(pathPrefix + ".options [XM-CHECK-01]: single_selection check requires at least 2 options");
      }
      var optIds = Object.create(null);
      opts.forEach(function (opt, idx) {
        if (!isPlainObject(opt) || !str(opt.option_id || opt.id || opt.key) || !str(opt.text || opt.label)) {
          errors.push(
            pathPrefix + ".options[" + idx + "] [XM-CHECK-01]: each option requires option_id and text"
          );
          return;
        }
        optIds[str(opt.option_id || opt.id || opt.key)] = true;
      });
      var correctId = str(body.correct_option_id);
      if (!correctId || (opts.length >= 2 && !optIds[correctId])) {
        errors.push(
          pathPrefix + ".correct_option_id [XM-CHECK-01]: must match one of options[].option_id"
        );
      }
      var fb = Array.isArray(body.feedback) ? body.feedback : [];
      if (!fb.length && !str(body.shared_feedback) && !str(body.feedback)) {
        errors.push(pathPrefix + ".feedback [XM-CHECK-01]: single_selection check requires explanatory feedback");
      }
      return;
    }

    if (responseType === "classification" || (!responseType && Array.isArray(body.response_categories))) {
      if (!str(body.instruction) && !str(body.question) && !str(body.prompt)) {
        errors.push(pathPrefix + ".instruction [XM-CHECK-01]: classification check requires non-empty instruction");
      }
      var cats = Array.isArray(body.response_categories) ? body.response_categories : [];
      if (cats.length < 2) {
        errors.push(
          pathPrefix + ".response_categories [XM-CHECK-01]: classification check requires at least 2 categories"
        );
      }
      var catIds = Object.create(null);
      cats.forEach(function (cat, idx) {
        if (!isPlainObject(cat) || !str(cat.category_id || cat.id) || !str(cat.label || cat.text)) {
          errors.push(
            pathPrefix +
              ".response_categories[" +
              idx +
              "] [XM-CHECK-01]: each category requires category_id and label"
          );
          return;
        }
        catIds[str(cat.category_id || cat.id)] = true;
      });
      var stmts = Array.isArray(body.statements) ? body.statements : [];
      if (!stmts.length) {
        errors.push(
          pathPrefix + ".statements [XM-CHECK-01]: classification check requires at least 1 statement"
        );
      }
      stmts.forEach(function (st, idx) {
        if (!isPlainObject(st) || !str(st.text)) {
          errors.push(pathPrefix + ".statements[" + idx + "] [XM-CHECK-01]: statement requires text");
          return;
        }
        var cid = str(st.correct_category_id);
        if (!cid || (cats.length >= 2 && !catIds[cid])) {
          errors.push(
            pathPrefix +
              ".statements[" +
              idx +
              "].correct_category_id [XM-CHECK-01]: must match one of response_categories[].category_id"
          );
        }
      });
      return;
    }

    errors.push(
      pathPrefix +
        '.response_type [XM-CHECK-01]: unsupported embedded Expository check response_type "' +
        responseType +
        '"; use "single_selection" or "classification"'
    );
  }

  function validateExpositoryMaterialsBodies(materials, errors) {
    (Array.isArray(materials) ? materials : []).forEach(function (mat, idx) {
      if (!isPlainObject(mat)) return;
      var pathPrefix = "expository_materials.materials[" + idx + "].body";
      var body = mat.body;
      if (typeof body === "string") {
        if (RAW_HTML_CHART_RE.test(body)) {
          errors.push(
            pathPrefix +
              " [XM-SVG-01]: raw <svg> or <canvas> markup is forbidden; use canonical body.scatterplot"
          );
        }
        return;
      }
      if (!isPlainObject(body)) return;
      validateExpositoryScatterplotBody(body, pathPrefix, errors);
      validateExpositoryFormativeCheckBody(body, pathPrefix, errors);
    });
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
      if (!str(normalized.commissioned_purpose)) {
        errors.push("expository_journey_plan.commissioned_purpose required (non-empty)");
      }
      if (!str(normalized.epistemic_form)) {
        errors.push("expository_journey_plan.epistemic_form required (non-empty free text)");
      }
      // Diagnostic only — does not relax EQ1/sections requirements (S87-T-007 live).
      var rawObj = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : null;
      if (
        rawObj &&
        Array.isArray(rawObj.learning_outcomes) &&
        rawObj.learning_outcomes.length &&
        (!Array.isArray(rawObj.sections) || !rawObj.sections.length) &&
        !str(rawObj.commissioned_purpose) &&
        !str(rawObj.epistemic_form)
      ) {
        errors.push(
          "expository_journey_plan expected — received learning_outcomes-shaped capture (Define Learning Outcomes is an upstream input, not this step's output)"
        );
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
        var anchorsApi = loadMaterialAnchorsApi();
        if (anchorsApi && typeof anchorsApi.validateExpositoryDevelopmentAnchors === "function") {
          var anchorCheck = anchorsApi.validateExpositoryDevelopmentAnchors(normalized);
          if (!anchorCheck.ok) {
            anchorCheck.errors.forEach(function (err) {
              errors.push(err);
            });
          }
        }
      }
    }
    if (kind === "expository_materials") {
      if (!Array.isArray(normalized.materials)) {
        errors.push("expository_materials.materials[] required");
      } else {
        validateExpositoryMaterialsBodies(normalized.materials, errors);
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
    PLANNING_STRING_OBJECT_KEYS: PLANNING_STRING_OBJECT_KEYS,
    normalizePlanningStringListItem: normalizePlanningStringListItem,
    normalizePlanningStringList: normalizePlanningStringList,
    normalizeExpositoryScopeExtent: normalizeExpositoryScopeExtent,
    normalizeExpositoryJourneyPlan: normalizeExpositoryJourneyPlan,
    normalizeExpositoryDevelopment: normalizeExpositoryDevelopment,
    normalizeExpositoryMaterials: normalizeExpositoryMaterials,
    normalizeGenerationNotes: normalizeGenerationNotes,
    normalizeFormalNotes: normalizeFormalNotes,
    validateCommissionLock: validateCommissionLock,
    resolveExpositoryArtefactKind: resolveExpositoryArtefactKind,
    normalizeExpositoryArtefact: normalizeExpositoryArtefact,
    validateExpositoryArtefactShape: validateExpositoryArtefactShape
  };
});

