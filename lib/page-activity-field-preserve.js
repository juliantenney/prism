/**
 * Sprint 55 — learner-facing DLA activity-row field preservation on Design Page compose.
 * Validates and supports repair of activity_preamble, learner_task, cognition fields, etc.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_PAGE_ACTIVITY_FIELD_PRESERVE = api;
  }
})(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  function () {
    "use strict";

    var MODULE_ID = "PAGE-ACTIVITY-FIELD-PRESERVE";

    var AUDITED_LEARNER_FIELD_IDS = [
      "activity_preamble",
      "learner_task",
      "expected_output",
      "reasoning_orientation",
      "self_explanation_prompt",
      "conceptual_contrast_prompt",
      "argument_structure_hint",
      "support_note"
    ];

    var THIN_PREAMBLE_WORD_MAX = 18;

    function normalizeFieldText(value) {
      if (value == null) return "";
      if (Array.isArray(value)) return value.map(String).join("\n").trim();
      return String(value).trim();
    }

    function fieldHasValue(value) {
      return normalizeFieldText(value).length > 0;
    }

    function wordCount(text) {
      var raw = normalizeFieldText(text);
      if (!raw) return 0;
      return raw.split(/\s+/).filter(Boolean).length;
    }

    function shouldPreferUpstreamFieldContent(pageVal, upstreamVal) {
      var upstream = normalizeFieldText(upstreamVal);
      if (!upstream) return false;
      var page = normalizeFieldText(pageVal);
      if (!page) return true;
      if (page === upstream) return false;
      if (page.length < 20 && upstream.length > page.length * 2) return true;
      return upstream.length > page.length * 1.1;
    }

    function preambleLooksLikeTopicLabel(preamble) {
      var text = normalizeFieldText(preamble);
      if (!text) return false;
      var words = wordCount(text);
      if (words > THIN_PREAMBLE_WORD_MAX) return false;
      if (/[.!?].+[.!?]/.test(text)) return false;
      return true;
    }

    function findLearningActivityRows(page) {
      var rows = [];
      if (!page || !Array.isArray(page.sections)) return rows;
      page.sections.forEach(function (section) {
        var kind = String(section.section_id || section.id || section.heading || "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_");
        if (kind.indexOf("learning_activit") === -1) return;
        var content = section.content;
        if (Array.isArray(content)) rows = rows.concat(content);
        else if (content && Array.isArray(content.activities)) rows = rows.concat(content.activities);
      });
      return rows;
    }

    function indexUpstreamActivities(upstream) {
      var map = {};
      var rows = [];
      if (Array.isArray(upstream)) rows = upstream;
      else if (upstream && Array.isArray(upstream.activities)) rows = upstream.activities;
      else if (upstream && Array.isArray(upstream.content)) rows = upstream.content;
      else if (
        upstream &&
        upstream.content &&
        typeof upstream.content === "object" &&
        Array.isArray(upstream.content.activities)
      ) {
        rows = upstream.content.activities;
      } else if (
        upstream &&
        upstream.learning_activities &&
        typeof upstream.learning_activities === "object"
      ) {
        if (Array.isArray(upstream.learning_activities.activities)) {
          rows = upstream.learning_activities.activities;
        } else if (Array.isArray(upstream.learning_activities.content)) {
          rows = upstream.learning_activities.content;
        } else if (
          upstream.learning_activities.content &&
          typeof upstream.learning_activities.content === "object" &&
          Array.isArray(upstream.learning_activities.content.activities)
        ) {
          rows = upstream.learning_activities.content.activities;
        }
      }
      rows.forEach(function (row) {
        if (!row || typeof row !== "object") return;
        var key = String(row.activity_id || row.activityId || row.id || "")
          .trim()
          .toUpperCase();
        if (key) map[key] = row;
      });
      return map;
    }

    function validatePageActivityFieldClosure(page, upstreamLearningActivities, options) {
      var opts = options && typeof options === "object" ? options : {};
      var minRatio = typeof opts.minLengthRatio === "number" ? opts.minLengthRatio : 0.9;
      var upstreamById = indexUpstreamActivities(upstreamLearningActivities);
      var messages = [];
      var diagnostics = { fields: [], thin_preambles: [] };

      findLearningActivityRows(page).forEach(function (row) {
        if (!row || typeof row !== "object") return;
        var activityId = String(row.activity_id || row.activityId || row.id || "").trim() || "?";
        var upstreamRow = upstreamById[String(activityId).toUpperCase()];
        if (!upstreamRow) return;

        AUDITED_LEARNER_FIELD_IDS.forEach(function (fieldId) {
          var upstreamVal = upstreamRow[fieldId];
          if (fieldId === "support_note" && !fieldHasValue(upstreamVal)) {
            upstreamVal = upstreamRow.support_notes;
          }
          if (!fieldHasValue(upstreamVal)) return;

          var pageVal = row[fieldId];
          if (fieldId === "support_note" && !fieldHasValue(pageVal)) {
            pageVal = row.support_notes;
          }

          if (!fieldHasValue(pageVal)) {
            messages.push(
              "Activity " + activityId + ": missing learner field " + fieldId + " present upstream."
            );
            diagnostics.fields.push({ activity_id: activityId, field: fieldId, issue: "missing" });
            return;
          }

          var pageText = normalizeFieldText(pageVal);
          var upstreamText = normalizeFieldText(upstreamVal);
          if (pageText !== upstreamText && upstreamText.length > 0) {
            var ratio = pageText.length / upstreamText.length;
            if (ratio < minRatio || shouldPreferUpstreamFieldContent(pageVal, upstreamVal)) {
              messages.push(
                "Activity " +
                  activityId +
                  ": " +
                  fieldId +
                  " appears compressed relative to upstream (" +
                  Math.round(ratio * 100) +
                  "% length)."
              );
              diagnostics.fields.push({
                activity_id: activityId,
                field: fieldId,
                issue: "compressed",
                ratio: ratio
              });
            }
          }

          if (fieldId === "activity_preamble" && preambleLooksLikeTopicLabel(pageVal)) {
            messages.push(
              "Activity " + activityId + ": activity_preamble reads like a topic label, not orientation prose."
            );
            diagnostics.thin_preambles.push({ activity_id: activityId, words: wordCount(pageVal) });
          }
        });
      });

      var outcome = messages.length ? "fail" : "pass";
      if (!Object.keys(upstreamById).length) outcome = "warn";

      return {
        validation: "page_activity_field_closure",
        outcome: outcome,
        messages: messages,
        diagnostics: diagnostics,
        module: MODULE_ID
      };
    }

    return {
      MODULE_ID: MODULE_ID,
      AUDITED_LEARNER_FIELD_IDS: AUDITED_LEARNER_FIELD_IDS,
      normalizeFieldText: normalizeFieldText,
      fieldHasValue: fieldHasValue,
      shouldPreferUpstreamFieldContent: shouldPreferUpstreamFieldContent,
      preambleLooksLikeTopicLabel: preambleLooksLikeTopicLabel,
      validatePageActivityFieldClosure: validatePageActivityFieldClosure
    };
  }
);
