/**
 * Sprint 70 Slice 3 — Design Page → Prism visual-planning contract (frozen at schema 38.4).
 * Non-mutating validation boundary for assembled pages before future Prism planner consumption.
 * Row-shape and vocabulary authority delegates to lib/sprint38-visual-affordances.js.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./sprint38-visual-affordances.js"));
  } else {
    var s38 = root.PRISM_SPRINT38_VISUAL_AFFORDANCES;
    root.PRISM_VISUAL_PLANNING_CONTRACT = factory(s38);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (sprint38Mod) {
  "use strict";

  if (!sprint38Mod || typeof sprint38Mod.validatePageVisualAffordances !== "function") {
    throw new Error("visual-planning-contract requires sprint38-visual-affordances");
  }

  var SUPPORTED_SCHEMA_VERSION = sprint38Mod.SCHEMA_VERSION || "38.4";

  var PAGE_SYNTHESIS_ANCHOR_FIELDS = [
    "overview",
    "knowledge_summary",
    "learning_purpose",
    "study_tips"
  ];

  var PAGE_SYNTHESIS_FIELD_SET = {};
  PAGE_SYNTHESIS_ANCHOR_FIELDS.forEach(function (field) {
    PAGE_SYNTHESIS_FIELD_SET[field] = true;
  });

  function isNonEmptyString(value) {
    return typeof value === "string" && String(value).trim().length > 0;
  }

  function normalizeKey(value) {
    return String(value == null ? "" : value)
      .trim()
      .toLowerCase();
  }

  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function detectFieldPresence(page) {
    if (!page || typeof page !== "object") {
      return { hasVersion: false, hasReview: false, hasAffordances: false };
    }
    return {
      hasVersion: hasOwn(page, "visual_affordance_schema_version"),
      hasReview: hasOwn(page, "activities_visual_review"),
      hasAffordances: hasOwn(page, "visual_affordances")
    };
  }

  function authoritativePlanningPresent(presence) {
    return !!(presence && (presence.hasVersion || presence.hasReview || presence.hasAffordances));
  }

  function collectPageActivityIds(page) {
    var map = {};
    function register(id) {
      var trimmed = String(id == null ? "" : id).trim();
      if (!trimmed) return;
      map[normalizeKey(trimmed)] = trimmed;
    }
    if (page && Array.isArray(page.activities)) {
      page.activities.forEach(function (row) {
        register(row && row.activity_id);
      });
    }
    if (page && Array.isArray(page.sections)) {
      page.sections.forEach(function (section) {
        if (!section || typeof section !== "object") return;
        if (String(section.section_id || "").trim() !== "learning_activities") return;
        if (!Array.isArray(section.content)) return;
        section.content.forEach(function (row) {
          register(row && row.activity_id);
        });
      });
    }
    return map;
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
      typeof issue.index === "number"
        ? String(issue.index).padStart(6, "0")
        : "999999";
    return [path, index, issue.code || "", issue.message || ""].join("\u0001");
  }

  function sortIssues(list) {
    return list.slice().sort(function (a, b) {
      return issueSortKey(a).localeCompare(issueSortKey(b));
    });
  }

  function enrichSprint38IssueDetails(message, defaults) {
    var details = {
      path: defaults.path,
      index: defaults.index,
      affordance_id: defaults.affordance_id,
      activity_id: defaults.activity_id
    };
    var text = String(message || "");
    if (/learner_stage must be pre_classification \| post_reasoning/i.test(text)) {
      details.field = "learner_stage";
      details.allowed_values = copyVocabulary(
        sprint38Mod.LEARNER_STAGES || ["pre_classification", "post_reasoning"]
      );
      details.title = "Invalid learner stage";
    } else if (/tier must be essential \| valuable/i.test(text)) {
      details.field = "tier";
      details.allowed_values = copyVocabulary(sprint38Mod.TIERS || ["essential", "valuable"]);
      details.title = "Invalid tier";
    } else if (/discipline_risk_level must be low \| medium \| high/i.test(text)) {
      details.field = "discipline_risk_level";
      details.allowed_values = copyVocabulary(
        sprint38Mod.DISCIPLINE_RISK_LEVELS || ["low", "medium", "high"]
      );
      details.title = "Invalid discipline risk level";
    }
    return details;
  }

  function pushSprint38Messages(target, messages, defaults) {
    (messages || []).forEach(function (msg) {
      var text = String(msg || "");
      target.push(makeIssue(defaults.code, text, enrichSprint38IssueDetails(text, defaults)));
    });
  }

  function mapSprint38AffordanceErrors(record, index, target) {
    var sprintErrors = sprint38Mod.validateAffordanceEnvelope(record, index);
    pushSprint38Messages(target, sprintErrors, {
      code: "VPC_AFFORDANCE_ROW_INVALID",
      path: "visual_affordances[" + index + "]",
      index: index,
      affordance_id: record && record.affordance_id
    });
  }

  function resolvedScope(record) {
    var scope = String((record && record.scope) || "").trim();
    if (scope) return scope;
    if (record && isNonEmptyString(record.region)) return "page";
    return "activity";
  }

  function resolvedDecision(record) {
    var decision = String((record && record.visual_decision) || "").trim();
    if (decision === "skip") return "reject";
    return decision;
  }

  function validateGeneratePlanningFields(record, index, activityIdSet, target) {
    var prefix = "visual_affordances[" + index + "]";
    var affordanceId = record && record.affordance_id;
    if (!isNonEmptyString(record.subject)) {
      target.push(
        makeIssue("VPC_GENERATE_SUBJECT_REQUIRED", prefix + ": subject is required for generate", {
          path: prefix,
          index: index,
          affordance_id: affordanceId
        })
      );
    }
    if (!isNonEmptyString(record.context)) {
      target.push(
        makeIssue("VPC_GENERATE_CONTEXT_REQUIRED", prefix + ": context is required for generate", {
          path: prefix,
          index: index,
          affordance_id: affordanceId
        })
      );
    }
    if (!Array.isArray(record.evidence_anchors)) {
      target.push(
        makeIssue(
          "VPC_GENERATE_EVIDENCE_ANCHORS_REQUIRED",
          prefix + ": evidence_anchors array is required for generate",
          { path: prefix, index: index, affordance_id: affordanceId }
        )
      );
      return;
    }
    if (!record.evidence_anchors.length) {
      target.push(
        makeIssue(
          "VPC_GENERATE_EVIDENCE_ANCHORS_EMPTY",
          prefix + ": evidence_anchors must contain at least one entry",
          { path: prefix, index: index, affordance_id: affordanceId }
        )
      );
      return;
    }
    record.evidence_anchors.forEach(function (anchor, anchorIndex) {
      validateEvidenceAnchorSyntax(anchor, anchorIndex, prefix, activityIdSet, target, affordanceId, index);
    });
  }

  function validateOptionalEvidenceAnchors(record, index, activityIdSet, target) {
    if (!record || record.evidence_anchors == null) return;
    var prefix = "visual_affordances[" + index + "]";
    var affordanceId = record.affordance_id;
    if (!Array.isArray(record.evidence_anchors)) {
      target.push(
        makeIssue(
          "VPC_EVIDENCE_ANCHORS_NOT_ARRAY",
          prefix + ": evidence_anchors must be an array when present",
          { path: prefix, index: index, affordance_id: affordanceId }
        )
      );
      return;
    }
    record.evidence_anchors.forEach(function (anchor, anchorIndex) {
      validateEvidenceAnchorSyntax(anchor, anchorIndex, prefix, activityIdSet, target, affordanceId, index);
    });
  }

  function validateEvidenceAnchorSyntax(
    anchor,
    anchorIndex,
    rowPrefix,
    activityIdSet,
    target,
    affordanceId,
    rowIndex
  ) {
    var anchorPath = rowPrefix + ".evidence_anchors[" + anchorIndex + "]";
    if (!isNonEmptyString(anchor)) {
      target.push(
        makeIssue("VPC_EVIDENCE_ANCHOR_EMPTY", anchorPath + ": anchor must be a non-empty string", {
          path: anchorPath,
          index: rowIndex,
          affordance_id: affordanceId
        })
      );
      return;
    }
    var trimmed = String(anchor).trim();
    if (trimmed.indexOf("page_synthesis.") === 0) {
      var synthesisField = trimmed.slice("page_synthesis.".length);
      if (!isNonEmptyString(synthesisField)) {
        target.push(
          makeIssue(
            "VPC_EVIDENCE_ANCHOR_MALFORMED",
            anchorPath + ": page_synthesis anchor missing field segment",
            { path: anchorPath, index: rowIndex, affordance_id: affordanceId }
          )
        );
        return;
      }
      if (!PAGE_SYNTHESIS_FIELD_SET[synthesisField]) {
        target.push(
          makeIssue(
            "VPC_EVIDENCE_ANCHOR_UNKNOWN_SYNTHESIS_FIELD",
            anchorPath +
              ": unknown page_synthesis field '" +
              synthesisField +
              "' (supported: " +
              PAGE_SYNTHESIS_ANCHOR_FIELDS.join(", ") +
              ")",
            { path: anchorPath, index: rowIndex, affordance_id: affordanceId }
          )
        );
      }
      return;
    }
    var dot = trimmed.indexOf(".");
    if (dot <= 0) {
      target.push(
        makeIssue(
          "VPC_EVIDENCE_ANCHOR_MALFORMED",
          anchorPath + ": anchor must use activity_id.path or page_synthesis.field form",
          { path: anchorPath, index: rowIndex, affordance_id: affordanceId }
        )
      );
      return;
    }
    var activityId = trimmed.slice(0, dot);
    var remainder = trimmed.slice(dot + 1);
    if (!isNonEmptyString(remainder)) {
      target.push(
        makeIssue(
          "VPC_EVIDENCE_ANCHOR_MALFORMED",
          anchorPath + ": activity anchor missing path segment after activity_id",
          { path: anchorPath, index: rowIndex, affordance_id: affordanceId }
        )
      );
      return;
    }
    if (!activityIdSet[normalizeKey(activityId)]) {
      target.push(
        makeIssue(
          "VPC_EVIDENCE_ANCHOR_UNKNOWN_ACTIVITY",
          anchorPath + ": unknown activity_id '" + activityId + "' in evidence anchor",
          {
            path: anchorPath,
            index: rowIndex,
            affordance_id: affordanceId,
            activity_id: activityId
          }
        )
      );
    }
  }

  function validateAffordanceCrossReferences(records, activityIdSet, target) {
    var seenIds = {};
    (records || []).forEach(function (record, index) {
      if (!record || typeof record !== "object") return;
      var prefix = "visual_affordances[" + index + "]";
      var idKey = normalizeKey(record.affordance_id);
      if (idKey) {
        if (seenIds[idKey]) {
          target.push(
            makeIssue(
              "VPC_AFFORDANCE_DUPLICATE_ID",
              prefix + ": duplicate affordance_id " + record.affordance_id,
              { path: prefix, index: index, affordance_id: record.affordance_id }
            )
          );
        } else {
          seenIds[idKey] = true;
        }
      }
      var scope = resolvedScope(record);
      if (scope === "activity") {
        if (!isNonEmptyString(record.activity_id)) {
          target.push(
            makeIssue(
              "VPC_ACTIVITY_SCOPE_MISSING_ACTIVITY_ID",
              prefix + ": activity_id is required when scope is activity",
              { path: prefix, index: index, affordance_id: record.affordance_id }
            )
          );
        } else if (!activityIdSet[normalizeKey(record.activity_id)]) {
          target.push(
            makeIssue(
              "VPC_ACTIVITY_SCOPE_UNKNOWN_ACTIVITY_ID",
              prefix + ": unknown activity_id " + record.activity_id,
              {
                path: prefix,
                index: index,
                affordance_id: record.affordance_id,
                activity_id: record.activity_id
              }
            )
          );
        }
      } else if (scope === "page" && isNonEmptyString(record.activity_id)) {
        target.push(
          makeIssue(
            "VPC_PAGE_SCOPE_ACTIVITY_ID_FORBIDDEN",
            prefix + ": activity_id must not be set when scope is page",
            {
              path: prefix,
              index: index,
              affordance_id: record.affordance_id,
              activity_id: record.activity_id
            }
          )
        );
      }
      var decision = resolvedDecision(record);
      if (decision === "generate") {
        validateGeneratePlanningFields(record, index, activityIdSet, target);
      } else {
        validateOptionalEvidenceAnchors(record, index, activityIdSet, target);
      }
    });
  }

  function validateReviewCrossReferences(reviews, activityIdSet, target) {
    if (!Array.isArray(reviews)) return;
    reviews.forEach(function (row, index) {
      if (!row || typeof row !== "object") return;
      if (!isNonEmptyString(row.activity_id)) return;
      var prefix = "activities_visual_review[" + index + "]";
      if (!activityIdSet[normalizeKey(row.activity_id)]) {
        target.push(
          makeIssue(
            "VPC_REVIEW_UNKNOWN_ACTIVITY_ID",
            prefix + ": unknown activity_id " + row.activity_id,
            { path: prefix, index: index, activity_id: row.activity_id }
          )
        );
      }
    });
  }

  function validateSchemaVersion(page, presence, target, warnings) {
    if (!authoritativePlanningPresent(presence)) {
      return { version: null, supported: false, absent: true };
    }
    if (!presence.hasVersion) {
      target.push(
        makeIssue(
          "VPC_SCHEMA_VERSION_MISSING",
          "visual_affordance_schema_version is required when visual planning fields are present",
          { path: "visual_affordance_schema_version" }
        )
      );
      return { version: null, supported: false, absent: true };
    }
    var raw = page.visual_affordance_schema_version;
    if (raw == null || (typeof raw === "string" && !String(raw).trim())) {
      target.push(
        makeIssue(
          "VPC_SCHEMA_VERSION_MALFORMED",
          "visual_affordance_schema_version must be a non-empty string",
          { path: "visual_affordance_schema_version" }
        )
      );
      return { version: null, supported: false, absent: false };
    }
    if (typeof raw !== "string" && typeof raw !== "number") {
      target.push(
        makeIssue(
          "VPC_SCHEMA_VERSION_MALFORMED",
          "visual_affordance_schema_version must be a string value",
          { path: "visual_affordance_schema_version" }
        )
      );
      return { version: String(raw), supported: false, absent: false };
    }
    var version = String(raw).trim();
    if (version !== SUPPORTED_SCHEMA_VERSION) {
      target.push(
        makeIssue(
          "VPC_SCHEMA_VERSION_UNSUPPORTED",
          "visual_affordance_schema_version '" +
            version +
            "' is not supported (supported: " +
            SUPPORTED_SCHEMA_VERSION +
            ")",
          { path: "visual_affordance_schema_version" }
        )
      );
      return { version: version, supported: false, absent: false };
    }
    if (presence.hasVersion && !presence.hasReview && !presence.hasAffordances) {
      warnings.push(
        makeIssue(
          "VPC_PLANNING_PARTIAL_ENVELOPE",
          "visual_affordance_schema_version is present without activities_visual_review or visual_affordances",
          { path: "visual_affordance_schema_version" }
        )
      );
    }
    return { version: version, supported: true, absent: false };
  }

  function validateTopLevelArrays(page, presence, target) {
    if (presence.hasReview && !Array.isArray(page.activities_visual_review)) {
      target.push(
        makeIssue(
          "VPC_ACTIVITIES_VISUAL_REVIEW_NOT_ARRAY",
          "activities_visual_review must be an array when present",
          { path: "activities_visual_review" }
        )
      );
    }
    if (presence.hasAffordances && !Array.isArray(page.visual_affordances)) {
      target.push(
        makeIssue(
          "VPC_VISUAL_AFFORDANCES_NOT_ARRAY",
          "visual_affordances must be an array when present",
          { path: "visual_affordances" }
        )
      );
    }
  }

  function buildSummary(page, presence) {
    var reviews = presence.hasReview && Array.isArray(page.activities_visual_review)
      ? page.activities_visual_review
      : [];
    var affordances =
      presence.hasAffordances && Array.isArray(page.visual_affordances) ? page.visual_affordances : [];
    var summary = {
      activity_reviews: reviews.length,
      affordances: affordances.length,
      generate: 0,
      defer: 0,
      skip: 0,
      page_scoped: 0,
      activity_scoped: 0
    };
    affordances.forEach(function (row) {
      if (!row || typeof row !== "object") return;
      var scope = resolvedScope(row);
      if (scope === "page") summary.page_scoped += 1;
      if (scope === "activity") summary.activity_scoped += 1;
      var decision = resolvedDecision(row);
      if (decision === "generate") summary.generate += 1;
      else if (decision === "defer") summary.defer += 1;
      else if (decision === "reject") summary.skip += 1;
    });
    return summary;
  }

  function validateVisualPlanningContract(page) {
    if (page == null || typeof page !== "object" || Array.isArray(page)) {
      throw new TypeError("validateVisualPlanningContract(page) requires a plain object");
    }

    var errors = [];
    var warnings = [];
    var presence = detectFieldPresence(page);
    var planningPresent = authoritativePlanningPresent(presence);

    if (!planningPresent) {
      return {
        valid: true,
        schema_version: null,
        authoritative_planning_present: false,
        errors: [],
        warnings: [],
        summary: {
          activity_reviews: 0,
          affordances: 0,
          generate: 0,
          defer: 0,
          skip: 0,
          page_scoped: 0,
          activity_scoped: 0
        }
      };
    }

    validateTopLevelArrays(page, presence, errors);
    var versionInfo = validateSchemaVersion(page, presence, errors, warnings);

    var activityIdSet = collectPageActivityIds(page);
    var reviews =
      presence.hasReview && Array.isArray(page.activities_visual_review)
        ? page.activities_visual_review
        : null;
    var affordances =
      presence.hasAffordances && Array.isArray(page.visual_affordances) ? page.visual_affordances : null;

    if (reviews) {
      var reviewResult = sprint38Mod.validateActivitiesVisualReview(reviews);
      if (!reviewResult.valid) {
        pushSprint38Messages(errors, reviewResult.errors, {
          code: "VPC_ACTIVITY_REVIEW_INVALID"
        });
      }
      validateReviewCrossReferences(reviews, activityIdSet, errors);
    }

    if (affordances) {
      affordances.forEach(function (record, index) {
        if (!record || typeof record !== "object") {
          errors.push(
            makeIssue("VPC_AFFORDANCE_ROW_NOT_OBJECT", "visual_affordances[" + index + "]: must be an object", {
              path: "visual_affordances[" + index + "]",
              index: index
            })
          );
          return;
        }
        mapSprint38AffordanceErrors(record, index, errors);
      });
      validateAffordanceCrossReferences(affordances, activityIdSet, errors);
    }

    errors = sortIssues(errors);
    warnings = sortIssues(warnings);

    return {
      valid: errors.length === 0,
      schema_version: versionInfo.supported ? versionInfo.version : versionInfo.version || null,
      authoritative_planning_present: true,
      errors: errors,
      warnings: warnings,
      summary: buildSummary(page, presence)
    };
  }

  function copyVocabulary(list) {
    return Array.isArray(list) ? list.slice() : [];
  }

  return {
    SUPPORTED_SCHEMA_VERSION: SUPPORTED_SCHEMA_VERSION,
    PAGE_SYNTHESIS_ANCHOR_FIELDS: PAGE_SYNTHESIS_ANCHOR_FIELDS.slice(),
    PURPOSES: copyVocabulary(sprint38Mod.PURPOSES),
    REPRESENTATIONS: copyVocabulary(sprint38Mod.REPRESENTATIONS),
    VISUAL_SLOTS: copyVocabulary(sprint38Mod.VISUAL_SLOTS),
    SCOPES: copyVocabulary(sprint38Mod.SCOPES),
    LEARNER_STAGES: copyVocabulary(sprint38Mod.LEARNER_STAGES || ["pre_classification", "post_reasoning"]),
    DISCIPLINE_RISK_LEVELS: copyVocabulary(
      sprint38Mod.DISCIPLINE_RISK_LEVELS || ["low", "medium", "high"]
    ),
    ACTIVITY_VISUAL_VALUE_DECISIONS: copyVocabulary(sprint38Mod.ACTIVITY_VISUAL_VALUE_DECISIONS),
    detectFieldPresence: detectFieldPresence,
    authoritativePlanningPresent: authoritativePlanningPresent,
    collectPageActivityIds: collectPageActivityIds,
    validateVisualPlanningContract: validateVisualPlanningContract,
    /** Read-only access to underlying Sprint 38 row validator (compose/mutating path — not the Prism boundary). */
    sprint38: sprint38Mod
  };
});
