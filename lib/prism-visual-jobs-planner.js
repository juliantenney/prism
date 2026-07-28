/**
 * Sprint 70 Slice 4 — Prism visual-jobs planner.
 * Deterministic compiler: validated Design Page visual affordances → canonical visual jobs
 * with resolved evidence sources. Non-mutating. No prompts, providers, assets, or rendering.
 *
 * Pipeline:
 *   assembled page
 *     → validateVisualPlanningContract(page)
 *     → planPrismVisualJobs(page)
 *     → future Prism Prompt Builder
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./visual-planning-contract.js"));
  } else {
    var contract = root.PRISM_VISUAL_PLANNING_CONTRACT;
    root.PRISM_VISUAL_JOBS_PLANNER = factory(contract);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (contractMod) {
  "use strict";

  if (!contractMod || typeof contractMod.validateVisualPlanningContract !== "function") {
    throw new Error("prism-visual-jobs-planner requires visual-planning-contract");
  }

  var PLANNER_VERSION = "70.4";
  var SUPPORTED_SCHEMA_VERSION = contractMod.SUPPORTED_SCHEMA_VERSION || "38.4";
  var VISUAL_SLOTS = Array.isArray(contractMod.VISUAL_SLOTS) ? contractMod.VISUAL_SLOTS.slice() : [];
  var PAGE_SYNTHESIS_FIELDS = Array.isArray(contractMod.PAGE_SYNTHESIS_ANCHOR_FIELDS)
    ? contractMod.PAGE_SYNTHESIS_ANCHOR_FIELDS.slice()
    : ["overview", "knowledge_summary", "learning_purpose", "study_tips"];

  var JOB_CORE_FIELDS = [
    "affordance_id",
    "scope",
    "activity_id",
    "region",
    "visual_slot",
    "tier",
    "purpose",
    "preferred_representation",
    "pedagogical_added_value",
    "rationale",
    "subject",
    "context",
    "evidence_anchors",
    "reasoning_supported",
    "learner_stage",
    "anti_spoiler",
    "spoiler_boundary",
    "representation_avoid",
    "canonical_discipline_note",
    "must_show",
    "must_not_show",
    "allowed_claims",
    "disallowed_claims",
    "caption_intent",
    "discipline_risk_level",
    "requires_exact_data_match",
    "source_basis",
    "material_anchor",
    "defer_reason",
    "skip_reason",
    "rejection_reason"
  ];

  var ACTIVITY_FIELD_KINDS = {
    learner_task: "learner_task",
    activity_preamble: "learner_visible_material",
    expected_output: "activity_metadata",
    support_note: "activity_metadata",
    support_notes: "activity_metadata",
    purpose: "activity_metadata",
    title: "activity_metadata",
    instructions: "learner_visible_material",
    prompts: "learner_visible_material",
    feedback: "feedback",
    answer: "answer",
    answers: "answer",
    answer_key: "answer",
    model_answer: "model_answer",
    model_solution: "model_answer",
    classification_key: "classification_key",
    classification_keys: "classification_key"
  };

  var MATERIAL_SPOILER_TOKENS = {
    feedback: "feedback",
    answer: "answer",
    answers: "answer",
    answer_key: "answer",
    model_answer: "model_answer",
    model_solution: "model_answer",
    classification_key: "classification_key",
    classification_keys: "classification_key",
    filled_worksheet: "answer",
    answer_guidance: "feedback"
  };

  function isNonEmptyString(value) {
    return typeof value === "string" && String(value).trim().length > 0;
  }

  function normalizeKey(value) {
    return String(value == null ? "" : value)
      .trim()
      .toLowerCase();
  }

  function slugToken(value) {
    var slug = String(value == null ? "" : value)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug || "x";
  }

  function deepClone(value) {
    if (value == null) return value;
    return JSON.parse(JSON.stringify(value));
  }

  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function makeIssue(code, message, details) {
    var issue = { code: code, message: message };
    if (details && typeof details === "object") {
      Object.keys(details).forEach(function (key) {
        issue[key] = details[key];
      });
    }
    return issue;
  }

  function issueSortKey(issue) {
    var path = String(issue.path || "");
    var index =
      typeof issue.index === "number" ? String(issue.index).padStart(6, "0") : "999999";
    return [path, index, issue.code || "", issue.message || ""].join("\u0001");
  }

  function sortIssues(list) {
    return list.slice().sort(function (a, b) {
      return issueSortKey(a).localeCompare(issueSortKey(b));
    });
  }

  function resolvedDecision(record) {
    var decision = String((record && record.visual_decision) || "").trim();
    if (decision === "reject") return "skip";
    return decision;
  }

  function resolvedScope(record) {
    var scope = String((record && record.scope) || "").trim();
    if (scope) return scope;
    if (record && isNonEmptyString(record.region)) return "page";
    return "activity";
  }

  function slotOrderIndex(slot) {
    var key = String(slot || "").trim();
    var idx = VISUAL_SLOTS.indexOf(key);
    return idx === -1 ? 9999 : idx;
  }

  /**
   * Build one activity index (by normalized activity_id) from assembled page.
   * Prefer page.activities[]; also register learning_activities section rows and
   * activity_materials section entries under materials_by_key.
   */
  function buildActivityIndex(page) {
    var index = {};

    function ensure(activityId) {
      var key = normalizeKey(activityId);
      if (!key) return null;
      if (!index[key]) {
        index[key] = {
          activity_id: String(activityId).trim(),
          activity: null,
          materials_by_key: {},
          materials_list: []
        };
      }
      return index[key];
    }

    function registerMaterial(entry, activityId) {
      var bucket = ensure(activityId);
      if (!bucket || !entry || typeof entry !== "object") return;
      bucket.materials_list.push(entry);
      var keys = materialLookupKeys(entry);
      keys.forEach(function (mk) {
        if (!bucket.materials_by_key[mk]) {
          bucket.materials_by_key[mk] = entry;
        }
      });
    }

    function ingestActivity(row) {
      if (!row || typeof row !== "object") return;
      var activityId = String(row.activity_id || "").trim();
      if (!activityId) return;
      var bucket = ensure(activityId);
      if (!bucket.activity) bucket.activity = row;
      else bucket.activity = Object.assign({}, bucket.activity, row);

      var materials = row.materials;
      if (Array.isArray(materials)) {
        materials.forEach(function (mat) {
          registerMaterial(mat, activityId);
        });
      } else if (materials && typeof materials === "object") {
        Object.keys(materials).forEach(function (key) {
          var val = materials[key];
          if (val && typeof val === "object" && !Array.isArray(val)) {
            registerMaterial(Object.assign({ material_key: key }, val), activityId);
          } else {
            registerMaterial(
              { material_key: key, material_type: key, type: key, body: val, content: val },
              activityId
            );
          }
          bucket.materials_by_key[normalizeKey(key)] = bucket.materials_by_key[normalizeKey(key)] || {
            material_key: key,
            material_type: key,
            type: key,
            body: val,
            content: val
          };
        });
      }
    }

    if (page && Array.isArray(page.activities)) {
      page.activities.forEach(ingestActivity);
    }

    if (page && Array.isArray(page.sections)) {
      page.sections.forEach(function (section) {
        if (!section || typeof section !== "object") return;
        var sid = String(section.section_id || "").trim();
        if (sid === "learning_activities" && Array.isArray(section.content)) {
          section.content.forEach(ingestActivity);
        }
        if (sid === "activity_materials" && Array.isArray(section.content)) {
          section.content.forEach(function (mat) {
            if (!mat || typeof mat !== "object") return;
            var aid = String(mat.activity_id || "").trim();
            if (aid) registerMaterial(mat, aid);
          });
        }
      });
    }

    return index;
  }

  function materialLookupKeys(mat) {
    var keys = [];
    function push(v) {
      var n = normalizeKey(v);
      if (n && keys.indexOf(n) === -1) keys.push(n);
    }
    if (!mat || typeof mat !== "object") return keys;
    push(mat.material_key);
    push(mat.material_type);
    push(mat.type);
    push(mat.material_id);
    push(mat.title);
    push(mat.field);
    push(mat.destination_field);
    var mid = String(mat.material_id || "");
    var slugMatch = mid.match(/_([a-z0-9]+(?:_[a-z0-9]+)*)$/i);
    if (slugMatch) push(slugMatch[1].replace(/_/g, "-"));
    if (slugMatch) push(slugMatch[1]);
    // Common authored forms: scenarios, comparison_table, debrief, text, …
    var typeToken = normalizeKey(mat.material_type || mat.type || "");
    if (typeToken === "scenario") push("scenarios");
    if (typeToken === "scenarios") push("scenario");
    if (typeToken === "discussion_prompts") push("debrief");
    if (typeToken === "prompt_set") push("debrief");
    return keys;
  }

  function extractContentPayload(value) {
    if (value == null) {
      return { empty: true, content: null, content_structured: null, content_text: "", content_type: "text" };
    }
    if (typeof value === "string") {
      var trimmed = value.trim();
      if (!trimmed) {
        return { empty: true, content: "", content_structured: null, content_text: "", content_type: "text" };
      }
      return {
        empty: false,
        content: value,
        content_structured: null,
        content_text: value,
        content_type: "markdown"
      };
    }
    if (typeof value === "number" || typeof value === "boolean") {
      var asText = String(value);
      return {
        empty: false,
        content: asText,
        content_structured: value,
        content_text: asText,
        content_type: "text"
      };
    }
    if (typeof value === "object") {
      // Common synthesis / material wrappers
      if (isNonEmptyString(value.body)) {
        return {
          empty: false,
          content: value.body,
          content_structured: deepClone(value),
          content_text: value.body,
          content_type: isNonEmptyString(value.format) ? String(value.format).trim() : "markdown"
        };
      }
      if (isNonEmptyString(value.content) && typeof value.content === "string") {
        return {
          empty: false,
          content: value.content,
          content_structured: deepClone(value),
          content_text: value.content,
          content_type: isNonEmptyString(value.body_format)
            ? String(value.body_format).trim()
            : isNonEmptyString(value.format)
              ? String(value.format).trim()
              : "markdown"
        };
      }
      if (isNonEmptyString(value.text)) {
        return {
          empty: false,
          content: value.text,
          content_structured: deepClone(value),
          content_text: value.text,
          content_type: "markdown"
        };
      }
      if (typeof value.content === "object" && value.content != null) {
        var nested = extractContentPayload(value.content);
        if (!nested.empty) {
          return {
            empty: false,
            content: nested.content,
            content_structured: deepClone(value),
            content_text: nested.content_text,
            content_type: nested.content_type === "markdown" ? "json" : nested.content_type
          };
        }
      }
      var jsonText = JSON.stringify(value);
      if (jsonText === "{}" || jsonText === "[]") {
        return {
          empty: true,
          content: null,
          content_structured: deepClone(value),
          content_text: jsonText,
          content_type: "json"
        };
      }
      return {
        empty: false,
        content: null,
        content_structured: deepClone(value),
        content_text: jsonText,
        content_type: "json"
      };
    }
    return { empty: true, content: null, content_structured: null, content_text: "", content_type: "text" };
  }

  function classifyActivityFieldKind(field) {
    var key = normalizeKey(field);
    if (ACTIVITY_FIELD_KINDS[key]) return ACTIVITY_FIELD_KINDS[key];
    if (/feedback/.test(key)) return "feedback";
    if (/answer|solution|key/.test(key)) return "answer";
    return "activity_metadata";
  }

  function classifyMaterialKind(materialKey, mat) {
    var key = normalizeKey(materialKey);
    if (MATERIAL_SPOILER_TOKENS[key]) return MATERIAL_SPOILER_TOKENS[key];
    var type = normalizeKey((mat && (mat.material_type || mat.type)) || "");
    if (MATERIAL_SPOILER_TOKENS[type]) return MATERIAL_SPOILER_TOKENS[type];
    if (/feedback|answer|solution|answer_key|classification_key/.test(key + " " + type)) {
      if (/feedback/.test(key + type)) return "feedback";
      if (/model|solution/.test(key + type)) return "model_answer";
      if (/classification_key/.test(key + type)) return "classification_key";
      return "answer";
    }
    if (/debrief/.test(key)) return "learner_visible_material";
    return "learner_visible_material";
  }

  function classifyPageSynthesisKind(field) {
    var key = normalizeKey(field);
    if (key === "knowledge_summary") return "knowledge_summary";
    return "page_synthesis";
  }

  function spoilerProhibited(affordance, sourceKind) {
    if (!affordance || affordance.anti_spoiler !== true) return false;
    var boundary =
      affordance.spoiler_boundary && typeof affordance.spoiler_boundary === "object"
        ? affordance.spoiler_boundary
        : {};
    if (sourceKind === "answer" || sourceKind === "model_answer") {
      if (boundary.hide_answers === true || boundary.hide_model_solution === true) return true;
    }
    if (sourceKind === "classification_key" && boundary.hide_classification_keys === true) {
      return true;
    }
    if (sourceKind === "feedback" && boundary.hide_answers === true) return true;
    return false;
  }

  function resolvePageSynthesisAnchor(page, field) {
    var synthesis = page && page.page_synthesis && typeof page.page_synthesis === "object"
      ? page.page_synthesis
      : null;
    if (!synthesis || !hasOwn(synthesis, field)) {
      return {
        ok: false,
        code: "VPC_PLANNER_SOURCE_UNRESOLVED",
        message: "page_synthesis." + field + " is not present on the assembled page"
      };
    }
    var payload = extractContentPayload(synthesis[field]);
    if (payload.empty) {
      return {
        ok: false,
        code: "VPC_PLANNER_SOURCE_EMPTY",
        message: "page_synthesis." + field + " resolved to empty content"
      };
    }
    return {
      ok: true,
      record: {
        anchor: "page_synthesis." + field,
        source_type: "page_synthesis",
        scope: "page",
        field: field,
        content: payload.content,
        content_structured: payload.content_structured,
        content_text: payload.content_text,
        content_type: payload.content_type,
        source_kind: classifyPageSynthesisKind(field)
      }
    };
  }

  function resolveActivityField(bucket, activityId, field) {
    var activity = bucket && bucket.activity;
    if (!activity || !hasOwn(activity, field)) {
      return {
        ok: false,
        code: "VPC_PLANNER_SOURCE_UNRESOLVED",
        message: activityId + "." + field + " is not present on the assembled activity"
      };
    }
    var payload = extractContentPayload(activity[field]);
    if (payload.empty) {
      return {
        ok: false,
        code: "VPC_PLANNER_SOURCE_EMPTY",
        message: activityId + "." + field + " resolved to empty content"
      };
    }
    return {
      ok: true,
      record: {
        anchor: activityId + "." + field,
        source_type: "activity_field",
        scope: "activity",
        activity_id: activityId,
        field: field,
        content: payload.content,
        content_structured: payload.content_structured,
        content_text: payload.content_text,
        content_type: payload.content_type,
        source_kind: classifyActivityFieldKind(field)
      }
    };
  }

  function resolveActivityMaterial(bucket, activityId, materialKey) {
    var key = normalizeKey(materialKey);
    var mat = bucket && bucket.materials_by_key ? bucket.materials_by_key[key] : null;
    if (!mat && bucket && Array.isArray(bucket.materials_list)) {
      for (var i = 0; i < bucket.materials_list.length; i += 1) {
        var candidate = bucket.materials_list[i];
        var keys = materialLookupKeys(candidate);
        if (keys.indexOf(key) !== -1) {
          mat = candidate;
          break;
        }
      }
    }
    if (!mat) {
      return {
        ok: false,
        code: "VPC_PLANNER_SOURCE_UNRESOLVED",
        message:
          activityId +
          ".materials." +
          materialKey +
          " could not be resolved on the assembled page"
      };
    }
    var payload = extractContentPayload(mat);
    if (payload.empty) {
      // Try raw body/content fields already handled; still empty
      return {
        ok: false,
        code: "VPC_PLANNER_SOURCE_EMPTY",
        message: activityId + ".materials." + materialKey + " resolved to empty content"
      };
    }
    return {
      ok: true,
      record: {
        anchor: activityId + ".materials." + materialKey,
        source_type: "activity_material",
        scope: "activity",
        activity_id: activityId,
        field: "materials." + materialKey,
        material_key: materialKey,
        content: payload.content,
        content_structured: payload.content_structured,
        content_text: payload.content_text,
        content_type: payload.content_type,
        source_kind: classifyMaterialKind(materialKey, mat)
      }
    };
  }

  function resolveEvidenceAnchor(page, activityIndex, anchor, affordance) {
    var trimmed = String(anchor || "").trim();
    if (!trimmed) {
      return {
        ok: false,
        code: "VPC_PLANNER_SOURCE_UNRESOLVED",
        message: "empty evidence anchor"
      };
    }

    if (trimmed.indexOf("page_synthesis.") === 0) {
      var field = trimmed.slice("page_synthesis.".length);
      var pageResult = resolvePageSynthesisAnchor(page, field);
      if (!pageResult.ok) return pageResult;
      if (spoilerProhibited(affordance, pageResult.record.source_kind)) {
        return {
          ok: false,
          code: "VPC_PLANNER_SPOILER_SOURCE_PROHIBITED",
          message:
            "evidence anchor '" +
            trimmed +
            "' targets source_kind '" +
            pageResult.record.source_kind +
            "' prohibited by anti_spoiler boundary"
        };
      }
      return pageResult;
    }

    var dot = trimmed.indexOf(".");
    if (dot <= 0) {
      return {
        ok: false,
        code: "VPC_PLANNER_SOURCE_UNRESOLVED",
        message: "malformed evidence anchor '" + trimmed + "'"
      };
    }
    var activityId = trimmed.slice(0, dot);
    var remainder = trimmed.slice(dot + 1);
    var bucket = activityIndex[normalizeKey(activityId)];
    if (!bucket) {
      return {
        ok: false,
        code: "VPC_PLANNER_SOURCE_UNRESOLVED",
        message: "unknown activity_id '" + activityId + "' for evidence anchor"
      };
    }

    var result;
    if (remainder.indexOf("materials.") === 0) {
      var materialKey = remainder.slice("materials.".length);
      result = resolveActivityMaterial(bucket, bucket.activity_id, materialKey);
    } else {
      result = resolveActivityField(bucket, bucket.activity_id, remainder);
    }
    if (!result.ok) return result;
    if (spoilerProhibited(affordance, result.record.source_kind)) {
      return {
        ok: false,
        code: "VPC_PLANNER_SPOILER_SOURCE_PROHIBITED",
        message:
          "evidence anchor '" +
          trimmed +
          "' targets source_kind '" +
          result.record.source_kind +
          "' prohibited by anti_spoiler boundary"
      };
    }
    return result;
  }

  function buildJobId(schemaVersion, affordance) {
    var scope = resolvedScope(affordance);
    var activityPart =
      scope === "page" ? "page" : String((affordance && affordance.activity_id) || "activity");
    return [
      "vj",
      slugToken(schemaVersion),
      slugToken(affordance && affordance.affordance_id),
      slugToken(scope),
      slugToken(activityPart),
      slugToken(affordance && affordance.visual_slot)
    ].join("-");
  }

  function collectAuthoredPassthrough(affordance) {
    var passthrough = {};
    if (!affordance || typeof affordance !== "object") return passthrough;
    Object.keys(affordance).forEach(function (key) {
      if (key === "visual_decision") return;
      if (JOB_CORE_FIELDS.indexOf(key) !== -1) return;
      passthrough[key] = deepClone(affordance[key]);
    });
    return passthrough;
  }

  function buildJobFromAffordance(affordance, index, schemaVersion, resolvedSources) {
    var scope = resolvedScope(affordance);
    var job = {
      job_id: buildJobId(schemaVersion, affordance),
      affordance_id: String(affordance.affordance_id || "").trim(),
      schema_version: schemaVersion,
      scope: scope,
      visual_slot: deepClone(affordance.visual_slot),
      tier: deepClone(affordance.tier),
      purpose: deepClone(affordance.purpose),
      preferred_representation: deepClone(affordance.preferred_representation),
      pedagogical_added_value: deepClone(affordance.pedagogical_added_value),
      rationale: deepClone(affordance.rationale),
      subject: deepClone(affordance.subject),
      context: deepClone(affordance.context),
      evidence_anchors: deepClone(affordance.evidence_anchors),
      resolved_sources: resolvedSources,
      reasoning_supported: deepClone(affordance.reasoning_supported),
      learner_stage: deepClone(affordance.learner_stage),
      anti_spoiler: deepClone(affordance.anti_spoiler),
      spoiler_boundary: deepClone(affordance.spoiler_boundary),
      representation_avoid: deepClone(affordance.representation_avoid),
      canonical_discipline_note: deepClone(affordance.canonical_discipline_note),
      must_show: deepClone(affordance.must_show),
      must_not_show: deepClone(affordance.must_not_show),
      allowed_claims: deepClone(affordance.allowed_claims),
      disallowed_claims: deepClone(affordance.disallowed_claims),
      caption_intent: deepClone(affordance.caption_intent),
      discipline_risk_level: deepClone(affordance.discipline_risk_level),
      provenance: {
        source: "design-page-visual-affordance",
        schema_version: schemaVersion,
        affordance_index: index,
        affordance_id: String(affordance.affordance_id || "").trim(),
        scope: scope
      },
      authored_passthrough: collectAuthoredPassthrough(affordance)
    };

    if (scope === "activity") {
      job.activity_id = String(affordance.activity_id || "").trim();
      job.provenance.activity_id = job.activity_id;
    } else {
      job.provenance.page_scope = true;
      if (isNonEmptyString(affordance.region)) {
        job.region = String(affordance.region).trim();
        job.provenance.region = job.region;
      }
    }

    // Preserve optional generate metadata when present
    [
      "requires_exact_data_match",
      "source_basis",
      "material_anchor"
    ].forEach(function (key) {
      if (hasOwn(affordance, key)) job[key] = deepClone(affordance[key]);
    });

    return job;
  }

  function emptyDiagnostics() {
    return {
      affordances: 0,
      generate: 0,
      defer: 0,
      skip: 0,
      jobs_created: 0,
      page_scoped_jobs: 0,
      activity_scoped_jobs: 0,
      anchors_resolved: 0,
      anchors_unresolved: 0,
      deferred: [],
      skipped: [],
      failed_generate: [],
      partial_planning: false,
      legacy_path_applicable: false
    };
  }

  function planPrismVisualJobs(page) {
    if (page == null || typeof page !== "object" || Array.isArray(page)) {
      throw new TypeError("planPrismVisualJobs(page) requires a plain object");
    }

    var contract = contractMod.validateVisualPlanningContract(page);
    var diagnostics = emptyDiagnostics();
    var errors = [];
    var warnings = [];

    if (!contract.authoritative_planning_present) {
      diagnostics.legacy_path_applicable = true;
      return {
        valid: true,
        planner_version: PLANNER_VERSION,
        schema_version: null,
        authoritative_planning_present: false,
        jobs: [],
        errors: [],
        warnings: [],
        diagnostics: diagnostics,
        contract: {
          valid: contract.valid,
          authoritative_planning_present: false,
          schema_version: contract.schema_version
        }
      };
    }

    diagnostics.affordances = Array.isArray(page.visual_affordances)
      ? page.visual_affordances.length
      : 0;

    if (!contract.valid) {
      (contract.errors || []).forEach(function (err) {
        errors.push(
          makeIssue(
            err.code || "VPC_CONTRACT_INVALID",
            err.message || String(err),
            {
              path: err.path,
              index: err.index,
              affordance_id: err.affordance_id,
              activity_id: err.activity_id
            }
          )
        );
      });
      (contract.warnings || []).forEach(function (warn) {
        warnings.push(
          makeIssue(warn.code || "VPC_CONTRACT_WARNING", warn.message || String(warn), {
            path: warn.path,
            index: warn.index
          })
        );
      });
      return {
        valid: false,
        planner_version: PLANNER_VERSION,
        schema_version: contract.schema_version,
        authoritative_planning_present: true,
        jobs: [],
        errors: sortIssues(errors),
        warnings: sortIssues(warnings),
        diagnostics: diagnostics,
        contract: {
          valid: false,
          authoritative_planning_present: true,
          schema_version: contract.schema_version
        }
      };
    }

    (contract.warnings || []).forEach(function (warn) {
      warnings.push(
        makeIssue(warn.code || "VPC_CONTRACT_WARNING", warn.message || String(warn), {
          path: warn.path,
          index: warn.index
        })
      );
    });

    var schemaVersion = contract.schema_version || SUPPORTED_SCHEMA_VERSION;
    var activityIndex = buildActivityIndex(page);
    var affordances = Array.isArray(page.visual_affordances) ? page.visual_affordances : [];
    var pendingJobs = [];
    var seenJobIds = {};

    affordances.forEach(function (affordance, index) {
      if (!affordance || typeof affordance !== "object") return;
      var decision = resolvedDecision(affordance);
      var path = "visual_affordances[" + index + "]";
      var affordanceId = String(affordance.affordance_id || "").trim();

      if (decision === "defer") {
        diagnostics.defer += 1;
        diagnostics.deferred.push({
          affordance_id: affordanceId,
          affordance_index: index,
          defer_reason: affordance.defer_reason || null
        });
        return;
      }
      if (decision === "skip") {
        diagnostics.skip += 1;
        diagnostics.skipped.push({
          affordance_id: affordanceId,
          affordance_index: index,
          skip_reason: affordance.skip_reason || affordance.rejection_reason || null
        });
        return;
      }
      if (decision !== "generate") {
        errors.push(
          makeIssue(
            "VPC_PLANNER_UNKNOWN_DECISION",
            path + ": unsupported visual_decision for planning",
            { path: path, index: index, affordance_id: affordanceId }
          )
        );
        return;
      }

      diagnostics.generate += 1;
      var anchors = Array.isArray(affordance.evidence_anchors) ? affordance.evidence_anchors : [];
      var resolvedSources = [];
      var failed = false;

      for (var ai = 0; ai < anchors.length; ai += 1) {
        var resolved = resolveEvidenceAnchor(page, activityIndex, anchors[ai], affordance);
        if (!resolved.ok) {
          failed = true;
          diagnostics.anchors_unresolved += 1;
          errors.push(
            makeIssue(resolved.code, path + ": " + resolved.message, {
              path: path + ".evidence_anchors[" + ai + "]",
              index: index,
              affordance_id: affordanceId,
              anchor: String(anchors[ai] || "")
            })
          );
          // Continue collecting all unresolved diagnostics for this affordance
          continue;
        }
        diagnostics.anchors_resolved += 1;
        resolvedSources.push(resolved.record);
      }

      if (failed) {
        diagnostics.failed_generate.push({
          affordance_id: affordanceId,
          affordance_index: index
        });
        return;
      }

      var job = buildJobFromAffordance(affordance, index, schemaVersion, resolvedSources);
      if (seenJobIds[job.job_id]) {
        errors.push(
          makeIssue(
            "VPC_PLANNER_DUPLICATE_JOB_ID",
            path + ": duplicate derived job_id " + job.job_id,
            { path: path, index: index, affordance_id: affordanceId, job_id: job.job_id }
          )
        );
        diagnostics.failed_generate.push({
          affordance_id: affordanceId,
          affordance_index: index,
          job_id: job.job_id
        });
        return;
      }
      seenJobIds[job.job_id] = true;
      pendingJobs.push({ job: job, affordance_index: index, slot: job.visual_slot });
    });

    pendingJobs.sort(function (a, b) {
      var slotDiff = slotOrderIndex(a.slot) - slotOrderIndex(b.slot);
      if (slotDiff !== 0) return slotDiff;
      return a.affordance_index - b.affordance_index;
    });

    var jobs = pendingJobs.map(function (row) {
      return row.job;
    });

    jobs.forEach(function (job) {
      diagnostics.jobs_created += 1;
      if (job.scope === "page") diagnostics.page_scoped_jobs += 1;
      if (job.scope === "activity") diagnostics.activity_scoped_jobs += 1;
    });

    diagnostics.partial_planning = jobs.length > 0 && diagnostics.failed_generate.length > 0;

    errors = sortIssues(errors);
    warnings = sortIssues(warnings);

    return {
      valid: errors.length === 0,
      planner_version: PLANNER_VERSION,
      schema_version: schemaVersion,
      authoritative_planning_present: true,
      jobs: jobs,
      errors: errors,
      warnings: warnings,
      diagnostics: diagnostics,
      contract: {
        valid: true,
        authoritative_planning_present: true,
        schema_version: schemaVersion
      }
    };
  }

  return {
    PLANNER_VERSION: PLANNER_VERSION,
    SUPPORTED_SCHEMA_VERSION: SUPPORTED_SCHEMA_VERSION,
    VISUAL_SLOTS: VISUAL_SLOTS.slice(),
    PAGE_SYNTHESIS_FIELDS: PAGE_SYNTHESIS_FIELDS.slice(),
    JOB_CORE_FIELDS: JOB_CORE_FIELDS.slice(),
    planPrismVisualJobs: planPrismVisualJobs,
    buildActivityIndex: buildActivityIndex,
    buildJobId: buildJobId,
    resolveEvidenceAnchor: resolveEvidenceAnchor,
    /** Read-only access to Slice 3 contract module. */
    contract: contractMod
  };
});
