"use strict";

var buildSequenceContext =
  require("./compose-sequence-context").buildSequenceContext;
var composeActivityMoments = require("./compose-activity-moments");

function normalizeActivityIds(model, options) {
  if (options && Array.isArray(options.activityIds) && options.activityIds.length) {
    return options.activityIds.map(String).filter(Boolean);
  }
  return (Array.isArray(model && model.activities) ? model.activities : []).map(function (
    activity
  ) {
    return String((activity && activity.id) || "").trim();
  }).filter(Boolean);
}

function cloneModelActivity(activity) {
  return {
    id: activity.id,
    context: Object.assign({}, activity.context || {}),
    moments: (activity.moments || []).map(function (moment) {
      return {
        kind: moment.kind,
        items: (moment.items || []).map(function (item) {
          return Object.assign({}, item, {
            sourceRef: Object.assign({}, item.sourceRef),
            prompt: item.prompt ? Object.assign({}, item.prompt) : undefined
          });
        })
      };
    }),
    renderHints: Object.assign({}, activity.renderHints || {})
  };
}

/**
 * Build a render-time composed view from a validated LearnerPageModel.
 * Does not mutate sourcePage or modelResult.model.
 *
 * Fallback policy:
 * - When at least one moment (orient/learn/do/check) has content, the activity
 *   uses the moments rendering path with only the moments that were composed.
 * - When zero moments can be composed, the activity is excluded from the
 *   composition map and renders through the beats fallback path.
 * - Partial moment sets are allowed; empty moment headings are never fabricated.
 *
 * @param {import("./types").LearnerPageModelResult} modelResult
 * @param {Object} sourcePage
 * @param {{ activityIds?: string[], compositionMode?: string }} [options]
 * @returns {{ ok: boolean, composed: import("./types").ComposedLearnerPageModel|null, errors: Object[], warnings: Object[], diagnostics: { composedActivityCount: number, beatsFallbackActivityCount: number, beatsFallbackActivityIds: string[] } }}
 */
function buildComposedPageModel(modelResult, sourcePage, options) {
  var opts = options && typeof options === "object" ? options : {};
  var errors = [];
  var warnings = [];

  if (!modelResult || !modelResult.ok || !modelResult.model) {
    return {
      ok: false,
      composed: null,
      errors: [{ message: "Cannot compose without a validated learner page model." }],
      warnings: warnings,
      diagnostics: {
        composedActivityCount: 0,
        beatsFallbackActivityCount: 0,
        beatsFallbackActivityIds: []
      }
    };
  }

  var model = modelResult.model;
  var sequenceContext = buildSequenceContext(sourcePage || {});
  var targetActivityIds = normalizeActivityIds(model, opts);
  var targetSet = Object.create(null);
  targetActivityIds.forEach(function (id) {
    targetSet[id] = true;
  });

  var composedActivities = [];
  var beatsFallbackActivityIds = [];

  (Array.isArray(model.activities) ? model.activities : []).forEach(function (modelActivity) {
    var activityId = String((modelActivity && modelActivity.id) || "").trim();
    if (!targetSet[activityId]) return;

    var orientMoment = composeActivityMoments.composeOrientMoment(
      modelActivity,
      sequenceContext
    );
    var learnMoment = composeActivityMoments.composeLearnMoment(modelActivity);
    var doMoment = composeActivityMoments.composeDoMoment(modelActivity);
    var checkMoment = composeActivityMoments.composeCheckMoment(modelActivity);

    if (!orientMoment && !learnMoment && !doMoment && !checkMoment) {
      beatsFallbackActivityIds.push(activityId);
      return;
    }

    var beatAnchors = composeActivityMoments.momentBeatAnchorsForActivity(
      modelActivity,
      {
        orientMoment: orientMoment,
        learnMoment: learnMoment,
        doMoment: doMoment,
        checkMoment: checkMoment
      }
    );

    var doHints = composeActivityMoments.doRenderHints(
      doMoment,
      beatAnchors.do,
      beatAnchors.check
    );
    var learnHints = composeActivityMoments.learnRenderHintsFromItems(learnMoment);
    var checkHints = composeActivityMoments.checkRenderHintsFromItems(
      checkMoment,
      doHints,
      beatAnchors.check
    );
    var renderHints = composeActivityMoments.mergeActivityRenderHints(
      composeActivityMoments.orientRenderHints(orientMoment),
      learnHints,
      doHints,
      checkHints
    );
    renderHints.learnMomentBeat = beatAnchors.learn;
    renderHints.doMomentBeat = beatAnchors.do;
    renderHints.checkMomentBeat = beatAnchors.check;
    renderHints.omitBeatFunctions = renderHints.omitBeatFunctions.concat(
      composeActivityMoments.activityOmitBeatFunctions(modelActivity, {
        orientMoment: orientMoment,
        learnMoment: learnMoment,
        doMoment: doMoment,
        checkMoment: checkMoment
      })
    );
    renderHints.omitBeatFunctions = renderHints.omitBeatFunctions.filter(function (
      value,
      index,
      array
    ) {
      return array.indexOf(value) === index;
    });
    renderHints.renderPath = "moments";

    var moments = [];
    if (orientMoment) moments.push(orientMoment);
    if (learnMoment) moments.push(learnMoment);
    if (doMoment) moments.push(doMoment);
    if (checkMoment) moments.push(checkMoment);

    composedActivities.push({
      id: activityId,
      context: {
        studyPhase:
          (sequenceContext.studyPhaseByActivityId &&
            sequenceContext.studyPhaseByActivityId[activityId]) ||
          "",
        activityPurpose:
          (sequenceContext.purposeByActivityId &&
            sequenceContext.purposeByActivityId[activityId]) ||
          ""
      },
      moments: moments,
      renderHints: renderHints
    });
  });

  var composed = {
    mode: "moments",
    sourceModel: model,
    pageContext: {
      progressionLogic: String(model.progressionGuidance || "").trim(),
      sequenceContext: sequenceContext
    },
    activities: composedActivities
  };

  return {
    ok: true,
    composed: composed,
    errors: errors,
    warnings: warnings.concat(modelResult.warnings || []),
    diagnostics: {
      composedActivityCount: composedActivities.length,
      beatsFallbackActivityCount: beatsFallbackActivityIds.length,
      beatsFallbackActivityIds: beatsFallbackActivityIds
    }
  };
}

/**
 * Map composed activities to render-time lookup by activity id.
 *
 * @param {import("./types").ComposedLearnerPageModel|null} composed
 * @returns {Object.<string, import("./types").ActivityCompositionRenderHints>}
 */
function buildActivityCompositionMap(composed) {
  var map = Object.create(null);
  if (!composed || !Array.isArray(composed.activities)) return map;

  composed.activities.forEach(function (activity) {
    var orientMoment = null;
    var learnMoment = null;
    var doMoment = null;
    var checkMoment = null;
    (activity.moments || []).forEach(function (moment) {
      if (moment && moment.kind === "orient") orientMoment = moment;
      if (moment && moment.kind === "learn") learnMoment = moment;
      if (moment && moment.kind === "do") doMoment = moment;
      if (moment && moment.kind === "check") checkMoment = moment;
    });
    map[String(activity.id || "")] = {
      orientMoment: orientMoment,
      learnMoment: learnMoment,
      doMoment: doMoment,
      checkMoment: checkMoment,
      suppressFraming: !!(activity.renderHints && activity.renderHints.suppressFraming),
      omitBeatFunctions:
        (activity.renderHints && activity.renderHints.omitBeatFunctions) || [],
      suppressBeatContent:
        (activity.renderHints && activity.renderHints.suppressBeatContent) ||
        Object.create(null),
      learnMomentBeat:
        (activity.renderHints && activity.renderHints.learnMomentBeat) || null,
      doMomentBeat: (activity.renderHints && activity.renderHints.doMomentBeat) || null,
      checkMomentBeat:
        (activity.renderHints && activity.renderHints.checkMomentBeat) || null,
      renderPath:
        (activity.renderHints && activity.renderHints.renderPath) || "moments"
    };
  });
  return map;
}

module.exports = {
  buildComposedPageModel: buildComposedPageModel,
  buildActivityCompositionMap: buildActivityCompositionMap,
  cloneModelActivity: cloneModelActivity
};
