"use strict";

/**
 * Read page-level learning sequence fields for composition (non-mutating).
 *
 * @param {Object} sourcePage
 * @returns {{ studyPhaseByActivityId: Object.<string,string>, purposeByActivityId: Object.<string,string> }}
 */
function buildSequenceContext(sourcePage) {
  var studyPhaseByActivityId = Object.create(null);
  var purposeByActivityId = Object.create(null);
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
    });
  }

  return {
    studyPhaseByActivityId: studyPhaseByActivityId,
    purposeByActivityId: purposeByActivityId
  };
}

module.exports = {
  buildSequenceContext: buildSequenceContext
};
