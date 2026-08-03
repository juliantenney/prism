/**
 * Learner-facing activity title contract (DLA ownership).
 * Final titles are created at Design Learning Activities and frozen thereafter.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LD_ACTIVITY_TITLE_CONTRACT = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var TITLE_HARD_MAX_CHARS = 60;
  var CONTRACT_VERSION = "DLA-ACTIVITY-TITLE-2";

  function nonEmptyString(value) {
    var text = String(value == null ? "" : value).trim();
    return text ? text : "";
  }

  function normalizeTitleForCompare(value) {
    return nonEmptyString(value)
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function buildDlaActivityTitleGuidance() {
    return [
      "Learner-facing activity title (required on every activities[] row):",
      '- Emit activities[].title as the final concise name for the designed activity.',
      "- Normally use 3–7 words; prefer no more than 45 characters; never exceed 60 characters.",
      "- Name the actual topic, action, or learning experience — not the mapped learning-outcome statement.",
      "- Remain meaningful when heard without surrounding visual context.",
      "- Retain necessary disciplinary terminology.",
      "- Be distinct from every sibling activity title in this resource.",
      "- Create semantic distinctness rather than appending A1, A2, or other internal activity IDs.",
      "- Do not include internal activity IDs in learner-facing titles (as standalone tokens or uniqueness suffixes).",
      "- Do not truncate with terminal ellipses (... or …).",
      '- Do not use generic labels such as "Activity A1".',
      "- This title replaces any provisional Episode Plan shell title and must not be regenerated downstream."
    ].join("\n");
  }

  function isGenericActivityPlaceholder(title) {
    return /^activity\s+[a-z]?\d+$/i.test(nonEmptyString(title));
  }

  function hasArtificialTerminalEllipsis(title) {
    return /(\.\.\.|…)\s*$/.test(nonEmptyString(title));
  }

  /**
   * True when the activity's own activity_id appears as a standalone alphanumeric token
   * in the title (label / uniqueness suffix). Token-aware: does not reject unrelated
   * disciplinary alphanumerics such as H2O, B12, or COVID-19 when they are not the ID.
   */
  function titleContainsOwnActivityIdToken(title, activityId) {
    var id = nonEmptyString(activityId);
    if (!id) return false;
    var tokens = nonEmptyString(title)
      .split(/[^A-Za-z0-9]+/)
      .filter(Boolean);
    if (!tokens.length) return false;
    var idNorm = id.toLowerCase();
    return tokens.some(function (token) {
      return String(token).toLowerCase() === idNorm;
    });
  }

  function indexLearningOutcomes(learningOutcomes) {
    var list = Array.isArray(learningOutcomes)
      ? learningOutcomes
      : learningOutcomes && Array.isArray(learningOutcomes.learning_outcomes)
        ? learningOutcomes.learning_outcomes
        : [];
    var map = {};
    list.forEach(function (lo) {
      if (!lo || typeof lo !== "object") return;
      var id = nonEmptyString(lo.id || lo.learning_outcome_id);
      if (!id) return;
      map[id] = nonEmptyString(lo.statement || lo.text || lo.description);
    });
    return map;
  }

  function mappedOutcomeStatementsForActivity(activity, loIndex) {
    var ids = [];
    if (Array.isArray(activity && activity.learning_outcome_ids)) {
      ids = activity.learning_outcome_ids;
    } else if (Array.isArray(activity && activity.mapped_learning_outcome_ids)) {
      ids = activity.mapped_learning_outcome_ids;
    } else if (Array.isArray(activity && activity.mapped_learning_outcomes)) {
      ids = activity.mapped_learning_outcomes;
    }
    var statements = [];
    ids.forEach(function (rawId) {
      var id = nonEmptyString(rawId);
      if (!id) return;
      var statement = loIndex[id];
      if (statement) statements.push(statement);
    });
    return statements;
  }

  function isExactOutcomeCopy(title, statements) {
    var normTitle = normalizeTitleForCompare(title);
    if (!normTitle) return false;
    return statements.some(function (statement) {
      return normalizeTitleForCompare(statement) === normTitle;
    });
  }

  function isTruncatedOutcomePrefix(title, statements) {
    var trimmed = nonEmptyString(title);
    if (!trimmed) return false;
    var withoutEllipsis = trimmed.replace(/(\.\.\.|…)\s*$/, "").trim();
    var normPrefix = normalizeTitleForCompare(withoutEllipsis);
    if (!normPrefix || normPrefix.length < 12) return false;
    return statements.some(function (statement) {
      var normStatement = normalizeTitleForCompare(statement);
      if (!normStatement || normStatement === normPrefix) return false;
      if (normStatement.indexOf(normPrefix) !== 0) return false;
      // Prefix of a longer outcome (typical EP shell truncation pattern).
      return normStatement.length > normPrefix.length;
    });
  }

  /**
   * Validate final learner-facing titles at the DLA output boundary.
   * @param {Array} activities
   * @param {object|Array|null} learningOutcomes - page.learning_outcomes or LO container
   * @returns {{ok:boolean,errors:string[]}}
   */
  function validateActivityTitles(activities, learningOutcomes) {
    var errors = [];
    var rows = Array.isArray(activities) ? activities : [];
    var loIndex = indexLearningOutcomes(learningOutcomes);
    var seen = {};

    rows.forEach(function (activity, index) {
      var label = "activities[" + index + "]";
      if (!activity || typeof activity !== "object" || Array.isArray(activity)) {
        errors.push(label + " must be an object");
        return;
      }
      var title = nonEmptyString(activity.title);
      if (!title) {
        errors.push(label + ".title is required (final learner-facing activity title)");
        return;
      }
      if (title.length > TITLE_HARD_MAX_CHARS) {
        errors.push(
          label +
            ".title must be at most " +
            TITLE_HARD_MAX_CHARS +
            " characters (got " +
            title.length +
            ")"
        );
      }
      if (isGenericActivityPlaceholder(title)) {
        errors.push(label + ".title must not be a generic Activity A# placeholder");
      }
      if (hasArtificialTerminalEllipsis(title)) {
        errors.push(label + ".title must not end with an artificial ellipsis");
      }
      var activityId = nonEmptyString(activity.activity_id);
      if (activityId && titleContainsOwnActivityIdToken(title, activityId)) {
        errors.push(
          label +
            ".title must not include internal activity_id \"" +
            activityId +
            "\" as a standalone token"
        );
      }
      var statements = mappedOutcomeStatementsForActivity(activity, loIndex);
      if (statements.length && isExactOutcomeCopy(title, statements)) {
        errors.push(label + ".title must not copy the mapped learning-outcome statement");
      }
      if (statements.length && isTruncatedOutcomePrefix(title, statements)) {
        errors.push(label + ".title must not be a truncated prefix of the mapped learning outcome");
      }
      var key = normalizeTitleForCompare(title);
      if (key) {
        if (seen[key] != null) {
          errors.push(
            label +
              ".title duplicates activities[" +
              seen[key] +
              "].title after normalisation"
          );
        } else {
          seen[key] = index;
        }
      }
    });

    return { ok: errors.length === 0, errors: errors };
  }

  return {
    CONTRACT_VERSION: CONTRACT_VERSION,
    TITLE_HARD_MAX_CHARS: TITLE_HARD_MAX_CHARS,
    buildDlaActivityTitleGuidance: buildDlaActivityTitleGuidance,
    normalizeTitleForCompare: normalizeTitleForCompare,
    isGenericActivityPlaceholder: isGenericActivityPlaceholder,
    hasArtificialTerminalEllipsis: hasArtificialTerminalEllipsis,
    titleContainsOwnActivityIdToken: titleContainsOwnActivityIdToken,
    validateActivityTitles: validateActivityTitles,
    indexLearningOutcomes: indexLearningOutcomes,
    mappedOutcomeStatementsForActivity: mappedOutcomeStatementsForActivity
  };
});
