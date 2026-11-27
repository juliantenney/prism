"use strict";

/**
 * Read page-level learning sequence fields for composition (non-mutating).
 *
 * Sprint 98 M5 (Option C): derive attempt-before scaffold material ids from
 * timeline[].learner_study_flow disclosure metadata.
 */

var ATTEMPT_DISCLOSURES = Object.freeze({
  initial_attempt: true,
  independent_completion: true,
  independent_reflection: true,
  independent_transfer_attempt: true
});

var SCAFFOLD_DISCLOSURES = Object.freeze({
  optional_scaffold: true,
  conceptual_scaffold: true
});

var SCAFFOLD_SUMMARY = Object.freeze({
  optional_scaffold: "Optional support — open after your first attempt",
  conceptual_scaffold: "Worked illustration — open after your first attempt"
});

var POST_ATTEMPT_DISCLOSURES = Object.freeze({
  post_attempt: true,
  after_attempt: true,
  after_commitment: true,
  post_commitment: true,
  post_submission: true,
  post_response: true,
  post_interpretation: true,
  feedback_disclosure: true,
  reconsideration: true,
  deferred: true
});

/**
 * @param {string} disclosure
 * @returns {boolean}
 */
function isPostAttemptDisclosure(disclosure) {
  var key = String(disclosure || "").trim().toLowerCase();
  if (!key) return false;
  if (POST_ATTEMPT_DISCLOSURES[key]) return true;
  return /^(?:post|after)[_-]|reconsider|feedback_disclosure/.test(key);
}

/**
 * @param {string} disclosure
 * @returns {boolean}
 */
function isAttemptDisclosure(disclosure) {
  return !!ATTEMPT_DISCLOSURES[String(disclosure || "").trim()];
}

/**
 * @param {string} disclosure
 * @returns {boolean}
 */
function isScaffoldDisclosure(disclosure) {
  return !!SCAFFOLD_DISCLOSURES[String(disclosure || "").trim()];
}

/**
 * Materials whose first study-flow appearance is optional_scaffold or
 * conceptual_scaffold, after an earlier attempt step that omits them.
 *
 * @param {Object[]} flow
 * @returns {Object.<string,{ disclosure: string, summary: string }>}
 */
function attemptBeforeScaffoldsFromStudyFlow(flow) {
  var scaffolds = Object.create(null);
  if (!Array.isArray(flow) || !flow.length) return scaffolds;

  var steps = flow
    .map(function (entry, index) {
      return {
        step: Number(entry && entry.step),
        index: index,
        disclosure: String((entry && entry.disclosure) || "").trim(),
        materialIds: Array.isArray(entry && entry.material_ids)
          ? entry.material_ids
              .map(function (id) {
                return String(id || "").trim();
              })
              .filter(Boolean)
          : []
      };
    })
    .sort(function (left, right) {
      var leftStep = Number.isFinite(left.step) ? left.step : left.index;
      var rightStep = Number.isFinite(right.step) ? right.step : right.index;
      if (leftStep !== rightStep) return leftStep - rightStep;
      return left.index - right.index;
    });

  var firstDisclosureByMaterial = Object.create(null);
  steps.forEach(function (step) {
    step.materialIds.forEach(function (id) {
      if (!firstDisclosureByMaterial[id]) {
        firstDisclosureByMaterial[id] = step.disclosure;
      }
    });
  });

  var seenAttemptSteps = [];
  steps.forEach(function (step) {
    if (isAttemptDisclosure(step.disclosure)) {
      seenAttemptSteps.push(step);
    }
    step.materialIds.forEach(function (id) {
      if (firstDisclosureByMaterial[id] !== step.disclosure) return;
      if (!isScaffoldDisclosure(step.disclosure)) return;
      var omittedByEarlierAttempt = seenAttemptSteps.some(function (attempt) {
        return attempt.materialIds.indexOf(id) === -1;
      });
      if (!omittedByEarlierAttempt) return;
      scaffolds[id] = {
        disclosure: step.disclosure,
        summary: SCAFFOLD_SUMMARY[step.disclosure] || "Support — open after your first attempt"
      };
    });
  });

  return scaffolds;
}

/**
 * Material IDs whose first study-flow appearance is a post-attempt /
 * reconsideration disclosure (e.g. post_attempt, after_commitment).
 *
 * @param {Object[]} flow
 * @returns {Object.<string, string>}
 */
function postAttemptMaterialsFromStudyFlow(flow) {
  var deferred = Object.create(null);
  if (!Array.isArray(flow) || !flow.length) return deferred;

  var steps = flow
    .map(function (entry, index) {
      return {
        step: Number(entry && entry.step),
        index: index,
        disclosure: String((entry && entry.disclosure) || "").trim(),
        materialIds: Array.isArray(entry && entry.material_ids)
          ? entry.material_ids
              .map(function (id) {
                return String(id || "").trim();
              })
              .filter(Boolean)
          : []
      };
    })
    .sort(function (left, right) {
      var leftStep = Number.isFinite(left.step) ? left.step : left.index;
      var rightStep = Number.isFinite(right.step) ? right.step : right.index;
      if (leftStep !== rightStep) return leftStep - rightStep;
      return left.index - right.index;
    });

  var firstDisclosureByMaterial = Object.create(null);
  steps.forEach(function (step) {
    step.materialIds.forEach(function (id) {
      if (!firstDisclosureByMaterial[id]) {
        firstDisclosureByMaterial[id] = step.disclosure;
      }
    });
  });

  Object.keys(firstDisclosureByMaterial).forEach(function (id) {
    var disclosure = firstDisclosureByMaterial[id];
    if (isPostAttemptDisclosure(disclosure)) {
      deferred[id] = disclosure;
    }
  });

  return deferred;
}

/**
 * Material IDs whose first study-flow appearance is available before/during
 * independent performance (neither post-attempt nor an attempt-before scaffold).
 *
 * @param {Object[]} flow
 * @returns {Object.<string, string>}
 */
function initialAvailableMaterialsFromStudyFlow(flow) {
  var available = Object.create(null);
  if (!Array.isArray(flow) || !flow.length) return available;

  var steps = flow
    .map(function (entry, index) {
      return {
        step: Number(entry && entry.step),
        index: index,
        disclosure: String((entry && entry.disclosure) || "").trim(),
        materialIds: Array.isArray(entry && entry.material_ids)
          ? entry.material_ids
              .map(function (id) {
                return String(id || "").trim();
              })
              .filter(Boolean)
          : []
      };
    })
    .sort(function (left, right) {
      var leftStep = Number.isFinite(left.step) ? left.step : left.index;
      var rightStep = Number.isFinite(right.step) ? right.step : right.index;
      if (leftStep !== rightStep) return leftStep - rightStep;
      return left.index - right.index;
    });

  var firstDisclosureByMaterial = Object.create(null);
  steps.forEach(function (step) {
    step.materialIds.forEach(function (id) {
      if (!Object.prototype.hasOwnProperty.call(firstDisclosureByMaterial, id)) {
        firstDisclosureByMaterial[id] = step.disclosure;
      }
    });
  });

  Object.keys(firstDisclosureByMaterial).forEach(function (id) {
    var disclosure = firstDisclosureByMaterial[id];
    if (!isPostAttemptDisclosure(disclosure) && !isScaffoldDisclosure(disclosure)) {
      available[id] = disclosure || "initial";
    }
  });

  return available;
}

/**
 * @param {Object} sourcePage
 * @returns {{
 *   studyPhaseByActivityId: Object.<string,string>,
 *   purposeByActivityId: Object.<string,string>,
 *   attemptBeforeScaffoldsByActivityId: Object.<string, Object.<string,{ disclosure: string, summary: string }>>,
 *   postAttemptMaterialIdsByActivityId: Object.<string, Object.<string, string>>,
 *   postAttemptMaterialIds: Object.<string, string>,
 *   initialAvailableMaterialIdsByActivityId: Object.<string, Object.<string, string>>,
 *   initialAvailableMaterialIds: Object.<string, string>
 * }}
 */
function buildSequenceContext(sourcePage) {
  var studyPhaseByActivityId = Object.create(null);
  var purposeByActivityId = Object.create(null);
  var attemptBeforeScaffoldsByActivityId = Object.create(null);
  var postAttemptMaterialIdsByActivityId = Object.create(null);
  var postAttemptMaterialIds = Object.create(null);
  var initialAvailableMaterialIdsByActivityId = Object.create(null);
  var initialAvailableMaterialIds = Object.create(null);
  var sequence = sourcePage && sourcePage.learning_sequence;

  if (sequence && Array.isArray(sequence.study_flow)) {
    sequence.study_flow.forEach(function (entry) {
      var phase = String((entry && entry.phase) || "").trim();
      if (!phase) return;
      var activityIds = Array.isArray(entry.activity_ids) ? entry.activity_ids : [];
      activityIds.forEach(function (activityId) {
        var id = String(activityId || "").trim();
        if (id) studyPhaseByActivityId[id] = phase;
      });
    });
  }

  if (sequence && Array.isArray(sequence.timeline)) {
    sequence.timeline.forEach(function (entry) {
      var activityId = String((entry && entry.activity_id) || "").trim();
      var purpose = String((entry && entry.purpose) || "").trim();
      if (activityId && purpose) purposeByActivityId[activityId] = purpose;
      if (!activityId) return;
      var scaffolds = attemptBeforeScaffoldsFromStudyFlow(entry.learner_study_flow);
      if (Object.keys(scaffolds).length) {
        attemptBeforeScaffoldsByActivityId[activityId] = scaffolds;
      }
      var postAttempt = postAttemptMaterialsFromStudyFlow(entry.learner_study_flow);
      if (Object.keys(postAttempt).length) {
        postAttemptMaterialIdsByActivityId[activityId] = postAttempt;
        Object.keys(postAttempt).forEach(function (matId) {
          postAttemptMaterialIds[matId] = postAttempt[matId];
        });
      }
      var initialAvailable = initialAvailableMaterialsFromStudyFlow(entry.learner_study_flow);
      if (Object.keys(initialAvailable).length) {
        initialAvailableMaterialIdsByActivityId[activityId] = initialAvailable;
        Object.keys(initialAvailable).forEach(function (matId) {
          initialAvailableMaterialIds[matId] = initialAvailable[matId];
        });
      }
    });
  }

  var navFeedback =
    sequence &&
    sequence.navigation &&
    typeof sequence.navigation === "object" &&
    sequence.navigation.feedback_disclosure;
  if (navFeedback && typeof navFeedback === "object") {
    var navPolicy = String(navFeedback.policy || "post_attempt").trim();
    if (!navPolicy || isPostAttemptDisclosure(navPolicy)) {
      var navIds = Array.isArray(navFeedback.material_ids) ? navFeedback.material_ids : [];
      navIds.forEach(function (rawId) {
        var matId = String(rawId || "").trim();
        if (!matId) return;
        postAttemptMaterialIds[matId] = navPolicy || "post_attempt";
        var actMatch = matId.match(/^([A-Za-z]+\d+)-/);
        if (actMatch) {
          var actId = actMatch[1];
          if (!postAttemptMaterialIdsByActivityId[actId]) {
            postAttemptMaterialIdsByActivityId[actId] = Object.create(null);
          }
          postAttemptMaterialIdsByActivityId[actId][matId] = navPolicy || "post_attempt";
        }
      });
    }
  }

  return {
    studyPhaseByActivityId: studyPhaseByActivityId,
    purposeByActivityId: purposeByActivityId,
    attemptBeforeScaffoldsByActivityId: attemptBeforeScaffoldsByActivityId,
    postAttemptMaterialIdsByActivityId: postAttemptMaterialIdsByActivityId,
    postAttemptMaterialIds: postAttemptMaterialIds,
    initialAvailableMaterialIdsByActivityId: initialAvailableMaterialIdsByActivityId,
    initialAvailableMaterialIds: initialAvailableMaterialIds
  };
}

/**
 * @param {Object} material
 * @returns {string}
 */
function materialIdOf(material) {
  if (!material) return "";
  return String(material.id || material.material_id || "").trim();
}

/**
 * @param {string} disclosure
 * @param {string} summary
 * @returns {{ mode: string, defaultOpen: boolean, summary: string, studyFlowDisclosure: string }}
 */
function scaffoldRevealBehaviour(disclosure, summary) {
  return {
    mode: "details",
    defaultOpen: false,
    summary: String(summary || SCAFFOLD_SUMMARY[disclosure] || "Support — open after your first attempt"),
    studyFlowDisclosure: String(disclosure || "").trim()
  };
}

/**
 * Move attempt-before scaffolds out of open Learn and attach them to Do as
 * collapsed learner-controlled support. No-op when scaffolds map is empty.
 *
 * @param {import("./types").CompositionMoment|null} learnMoment
 * @param {import("./types").CompositionMoment|null} doMoment
 * @param {Object.<string,{ disclosure: string, summary: string }>|null} scaffolds
 * @returns {{ learnMoment: import("./types").CompositionMoment|null, doMoment: import("./types").CompositionMoment|null, movedIds: string[] }}
 */
function relocateAttemptBeforeScaffolds(learnMoment, doMoment, scaffolds) {
  if (!scaffolds || !Object.keys(scaffolds).length) {
    return { learnMoment: learnMoment, doMoment: doMoment, movedIds: [] };
  }

  var movedItems = [];
  var movedIds = [];
  var nextLearn = learnMoment;
  var learnChanged = false;
  if (learnMoment && Array.isArray(learnMoment.items)) {
    var keptItems = [];
    var keptMaterials = [];
    learnMoment.items.forEach(function (item) {
      if (!item || item.kind !== "material" || !item.material) {
        keptItems.push(item);
        return;
      }
      var id = materialIdOf(item.material);
      var meta = id ? scaffolds[id] : null;
      if (!meta) {
        keptItems.push(item);
        if (item.material) keptMaterials.push(item.material);
        return;
      }
      movedIds.push(id);
      movedItems.push({
        kind: "material",
        role: item.role || "explanation",
        material: item.material,
        reveal: scaffoldRevealBehaviour(meta.disclosure, meta.summary),
        sourceRef: Object.assign({}, item.sourceRef || {}, {
          studyFlowScaffold: meta.disclosure
        })
      });
    });
    if (movedItems.length) {
      learnChanged = true;
      if (!keptItems.length) {
        nextLearn = null;
      } else {
        nextLearn = Object.assign({}, learnMoment, {
          items: keptItems,
          materials: keptMaterials.length
            ? keptMaterials
            : (learnMoment.materials || []).filter(function (material) {
                var id = materialIdOf(material);
                return !(id && scaffolds[id]);
              })
        });
      }
    }
  }

  var nextDo = doMoment;
  var doChanged = false;
  if (doMoment && Array.isArray(doMoment.items)) {
    var doItems = doMoment.items.map(function (item) {
      if (!item || item.kind !== "material" || !item.material) return item;
      var id = materialIdOf(item.material);
      var meta = id ? scaffolds[id] : null;
      if (!meta) return item;
      if (item.reveal && item.reveal.mode === "details" && item.reveal.defaultOpen === false) {
        return item;
      }
      doChanged = true;
      if (movedIds.indexOf(id) === -1) movedIds.push(id);
      return Object.assign({}, item, {
        reveal: scaffoldRevealBehaviour(meta.disclosure, meta.summary),
        sourceRef: Object.assign({}, item.sourceRef || {}, {
          studyFlowScaffold: meta.disclosure
        })
      });
    });
    if (movedItems.length || doChanged) {
      doChanged = true;
      nextDo = Object.assign({}, doMoment, {
        items: doItems.concat(movedItems),
        materials: (Array.isArray(doMoment.materials) ? doMoment.materials : []).concat(
          movedItems.map(function (item) {
            return item.material;
          })
        )
      });
    }
  } else if (doMoment && movedItems.length) {
    doChanged = true;
    nextDo = Object.assign({}, doMoment, {
      items: movedItems,
      materials: movedItems.map(function (item) {
        return item.material;
      })
    });
  } else if (!doMoment && movedItems.length) {
    // No Do moment: keep scaffolds collapsed inside Learn so they are not
    // fully exposed, without inventing a task surface.
    learnChanged = true;
    nextLearn = {
      kind: "learn",
      items: (nextLearn && Array.isArray(nextLearn.items) ? nextLearn.items : []).concat(
        movedItems
      ),
      explanatorySteps: (nextLearn && nextLearn.explanatorySteps) || [],
      materials: (nextLearn && Array.isArray(nextLearn.materials) ? nextLearn.materials : []).concat(
        movedItems.map(function (item) {
          return item.material;
        })
      )
    };
    nextDo = null;
  }

  if (!learnChanged && !doChanged) {
    return { learnMoment: learnMoment, doMoment: doMoment, movedIds: [] };
  }

  return { learnMoment: nextLearn, doMoment: nextDo, movedIds: movedIds };
}

module.exports = {
  buildSequenceContext: buildSequenceContext,
  attemptBeforeScaffoldsFromStudyFlow: attemptBeforeScaffoldsFromStudyFlow,
  postAttemptMaterialsFromStudyFlow: postAttemptMaterialsFromStudyFlow,
  relocateAttemptBeforeScaffolds: relocateAttemptBeforeScaffolds,
  isAttemptDisclosure: isAttemptDisclosure,
  isScaffoldDisclosure: isScaffoldDisclosure,
  isPostAttemptDisclosure: isPostAttemptDisclosure,
  ATTEMPT_DISCLOSURES: ATTEMPT_DISCLOSURES,
  SCAFFOLD_DISCLOSURES: SCAFFOLD_DISCLOSURES,
  POST_ATTEMPT_DISCLOSURES: POST_ATTEMPT_DISCLOSURES
};
