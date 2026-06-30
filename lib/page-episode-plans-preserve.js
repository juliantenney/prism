/**
 * Episode plans → Design Page preservation (post-compose enrichment).
 * Injects authoritative episode_plans from workflow captures onto composed page JSON.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_PAGE_EPISODE_PLANS_PRESERVE = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var PRESERVE_VERSION = "1";

  function normalizeIdToken(value) {
    return String(value || "")
      .trim()
      .toUpperCase();
  }

  function isLearningActivitiesSection(section) {
    if (!section || typeof section !== "object") return false;
    var sid = String(section.section_id || section.id || "").toLowerCase();
    var heading = String(section.heading || section.title || "").toLowerCase();
    return sid === "learning_activities" || heading.indexOf("learning activit") !== -1;
  }

  function findLearningActivitiesRows(page) {
    if (!page || !Array.isArray(page.sections)) return [];
    for (var i = 0; i < page.sections.length; i += 1) {
      var section = page.sections[i];
      if (!isLearningActivitiesSection(section)) continue;
      var content = section.content;
      if (Array.isArray(content)) return content;
      if (content && Array.isArray(content.content)) return content.content;
      if (content && Array.isArray(content.activities)) return content.activities;
    }
    return [];
  }

  function activityListFromUpstream(learningActivities) {
    if (!learningActivities || typeof learningActivities !== "object") return [];
    if (Array.isArray(learningActivities.activities)) return learningActivities.activities;
    if (Array.isArray(learningActivities.learning_activities)) {
      return learningActivities.learning_activities;
    }
    return [];
  }

  function normalizeEpisodePlansContainer(input) {
    if (!input) return null;
    if (Array.isArray(input)) {
      return input.length ? { episode_plans: input } : null;
    }
    if (
      typeof input === "object" &&
      Array.isArray(input.episode_plans) &&
      input.episode_plans.length
    ) {
      return input;
    }
    return null;
  }

  function collectMappedLearningOutcomeIds(activity, upstreamRow) {
    var sources = [activity, upstreamRow].filter(Boolean);
    var ids = [];
    var seen = {};
    sources.forEach(function (row) {
      var lists = [row.mapped_learning_outcomes, row.mapped_learning_outcome_ids];
      lists.forEach(function (list) {
        if (!Array.isArray(list)) return;
        list.forEach(function (id) {
          var key = normalizeIdToken(id);
          if (!key || seen[key]) return;
          seen[key] = true;
          ids.push(key);
        });
      });
    });
    return ids;
  }

  function planRowOutcomeIds(planRow) {
    var ids = [];
    var seen = {};
    if (!planRow || typeof planRow !== "object") return ids;
    var lists = [planRow.mapped_learning_outcome_ids];
    if (planRow.mapped_learning_outcomes) lists.push(planRow.mapped_learning_outcomes);
    lists.forEach(function (list) {
      if (!Array.isArray(list)) return;
      list.forEach(function (id) {
        var key = normalizeIdToken(id);
        if (!key || seen[key]) return;
        seen[key] = true;
        ids.push(key);
      });
    });
    var activityIdAsLo = normalizeIdToken(planRow.activity_id);
    if (/^LO\d+$/i.test(activityIdAsLo) && !seen[activityIdAsLo]) {
      ids.push(activityIdAsLo);
    }
    return ids;
  }

  function cloneEpisodePlan(plan) {
    if (!plan || typeof plan !== "object") return null;
    var beats = Array.isArray(plan.beats)
      ? plan.beats.map(function (beat) {
          return beat && typeof beat === "object" ? Object.assign({}, beat) : beat;
        })
      : [];
    return {
      archetype: plan.archetype,
      beats: beats
    };
  }

  function clonePlanRows(plans) {
    return (Array.isArray(plans) ? plans : []).map(function (row) {
      if (!row || typeof row !== "object") return row;
      var cloned = {
        activity_id: row.activity_id,
        episode_plan: cloneEpisodePlan(row.episode_plan)
      };
      if (Array.isArray(row.mapped_learning_outcome_ids)) {
        cloned.mapped_learning_outcome_ids = row.mapped_learning_outcome_ids.slice();
      }
      return cloned;
    });
  }

  /**
   * Resolve episode plan row for a page activity.
   * Priority: activity_id → mapped_learning_outcomes bridge → index fallback.
   */
  function resolvePlanRowForActivity(episodePlansContainer, pageActivity, upstreamRow, index) {
    var plans = (episodePlansContainer && episodePlansContainer.episode_plans) || [];
    if (!plans.length) {
      return { planRow: null, method: null, sourceActivityId: null };
    }
    var pageActivityId = String((pageActivity && pageActivity.activity_id) || "").trim();

    if (pageActivityId) {
      var directHit = plans.find(function (planRow) {
        return String(planRow.activity_id || "").trim() === pageActivityId;
      });
      if (directHit && directHit.episode_plan) {
        return { planRow: directHit, method: "activity_id", sourceActivityId: null };
      }
    }

    var outcomeIds = collectMappedLearningOutcomeIds(pageActivity, upstreamRow);
    if (outcomeIds.length) {
      for (var i = 0; i < plans.length; i += 1) {
        var candidate = plans[i];
        if (!candidate || !candidate.episode_plan) continue;
        var planOutcomes = planRowOutcomeIds(candidate);
        var bridged = outcomeIds.some(function (oid) {
          return planOutcomes.indexOf(oid) !== -1;
        });
        if (bridged) {
          var bridgeSourceId = String(candidate.activity_id || "").trim();
          return {
            planRow: candidate,
            method: "mapped_learning_outcomes",
            sourceActivityId:
              bridgeSourceId && pageActivityId && bridgeSourceId !== pageActivityId
                ? bridgeSourceId
                : bridgeSourceId && !pageActivityId
                  ? bridgeSourceId
                  : null
          };
        }
      }
    }

    if (plans[index] && plans[index].episode_plan) {
      var indexRow = plans[index];
      var indexSourceId = String(indexRow.activity_id || "").trim();
      return {
        planRow: indexRow,
        method: "index",
        sourceActivityId:
          indexSourceId && pageActivityId && indexSourceId !== pageActivityId
            ? indexSourceId
            : indexSourceId && !pageActivityId
              ? indexSourceId
              : null
      };
    }

    return { planRow: null, method: null, sourceActivityId: null };
  }

  function ensureSourceArtefactsIncludesEpisodePlans(page) {
    var key = "episode_plans";
    var sa = page.source_artefacts;
    if (Array.isArray(sa)) {
      if (sa.indexOf(key) === -1) sa.push(key);
      return;
    }
    if (sa && typeof sa === "object" && !Array.isArray(sa)) {
      sa[key] = true;
      return;
    }
    page.source_artefacts = [key];
  }

  /**
   * @param {object} page - composed page artefact
   * @param {object|array} episodePlansUpstream - episode_plans capture container or array
   * @param {object} [upstreamLearningActivities] - DLA capture for mapping bridge fields
   * @param {object} [options]
   */
  function applyEpisodePlansToComposedPage(page, episodePlansUpstream, upstreamLearningActivities, options) {
    if (!page || typeof page !== "object") return page;
    var container = normalizeEpisodePlansContainer(episodePlansUpstream);
    if (!container || !container.episode_plans.length) return page;

    var next = JSON.parse(JSON.stringify(page));
    var upstreamRows = activityListFromUpstream(upstreamLearningActivities);
    var upstreamById = {};
    upstreamRows.forEach(function (row) {
      var key = String((row && row.activity_id) || "").trim();
      if (key) upstreamById[key] = row;
    });

    var rows = findLearningActivitiesRows(next);
    var mappingTrace = [];

    rows.forEach(function (row, index) {
      if (!row || typeof row !== "object") return;
      var pageActivityId = String(row.activity_id || "").trim();
      var upstreamRow = pageActivityId ? upstreamById[pageActivityId] : null;
      if (!upstreamRow && upstreamRows[index]) upstreamRow = upstreamRows[index];

      var resolved = resolvePlanRowForActivity(container, row, upstreamRow, index);
      if (!resolved.planRow || !resolved.planRow.episode_plan) return;

      row.episode_plan = cloneEpisodePlan(resolved.planRow.episode_plan);
      if (resolved.sourceActivityId) {
        row.episode_plan_source_activity_id = resolved.sourceActivityId;
      }

      mappingTrace.push({
        activity_id: pageActivityId || "activity_" + (index + 1),
        mapping_method: resolved.method,
        episode_plan_source_activity_id: resolved.sourceActivityId || null
      });
    });

    next.episode_plans = clonePlanRows(container.episode_plans);
    ensureSourceArtefactsIncludesEpisodePlans(next);

    if (!next.metadata || typeof next.metadata !== "object") next.metadata = {};
    next.metadata.episode_plans_preserve = {
      version: PRESERVE_VERSION,
      activities_mapped: mappingTrace.length,
      mappings: mappingTrace
    };

    if (!next.constraints_applied) next.constraints_applied = [];
    if (Array.isArray(next.constraints_applied)) {
      var note = "episode_plans preserve merge applied (page-episode-plans-preserve)";
      if (next.constraints_applied.indexOf(note) === -1) next.constraints_applied.push(note);
    }

    return next;
  }

  return {
    PRESERVE_VERSION: PRESERVE_VERSION,
    normalizeEpisodePlansContainer: normalizeEpisodePlansContainer,
    resolvePlanRowForActivity: resolvePlanRowForActivity,
    findLearningActivitiesRows: findLearningActivitiesRows,
    applyEpisodePlansToComposedPage: applyEpisodePlansToComposedPage
  };
});
