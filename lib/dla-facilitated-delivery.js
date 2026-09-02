"use strict";

/**
 * Shared facilitated-workshop delivery semantics for DLA contract text and capture validation.
 * Reuses existing activities[].grouping vocabulary — no new taxonomy.
 */

var FACILITATED_DELIVERY_CONTEXTS = Object.freeze({
  in_person: true,
  online_sync: true
});

var FACILITATED_DELIVERY_MODES = Object.freeze({
  live_workshop: true,
  seminar: true
});

var KNOWN_GROUPING_TOKENS = Object.freeze([
  "individual",
  "pair",
  "pairs",
  "small_group",
  "whole_group",
  "individual_then_small_group",
  "individual_then_pair",
  "mixed"
]);

var GROUPING_ORCHESTRATION_PATTERNS = Object.freeze({
  pair: /\b(pair|partner|partners|in twos?|with a partner|pair up|working with one other)\b/i,
  pairs: /\b(pair|partner|partners|in twos?|with a partner|pair up|working with one other)\b/i,
  small_group: /\b(small group|in your group|with your group|in groups|group discussion|discuss in your group|as a group|your table group)\b/i,
  whole_group: /\b(whole group|whole-class|whole class|class discussion|plenary|share with the (?:whole )?group|as a class|with the class)\b/i,
  individual_then_small_group:
    /\b(small group|in your group|with your group|in groups|group discussion|discuss in your group|as a group)\b/i,
  individual_then_pair:
    /\b(pair|partner|partners|in twos?|with a partner|pair up|working with one other)\b/i
});

function nonEmptyString(value) {
  return String(value == null ? "" : value).trim();
}

function normalizeGroupingToken(value) {
  return nonEmptyString(value).toLowerCase().replace(/\s+/g, "_");
}

function isFacilitatedDeliveryContext(deliveryContext, deliveryMode) {
  var ctx = normalizeGroupingToken(deliveryContext);
  var mode = normalizeGroupingToken(deliveryMode);
  if (FACILITATED_DELIVERY_CONTEXTS[ctx]) return true;
  if (FACILITATED_DELIVERY_MODES[mode]) return true;
  return false;
}

function isKnownGroupingToken(grouping) {
  var token = normalizeGroupingToken(grouping);
  if (!token) return false;
  return KNOWN_GROUPING_TOKENS.indexOf(token) !== -1;
}

function groupingRequiresParticipantOrchestration(grouping) {
  var token = normalizeGroupingToken(grouping);
  if (!token || token === "individual" || token === "mixed") return false;
  return !!GROUPING_ORCHESTRATION_PATTERNS[token];
}

function learnerTaskExpressesGroupingOrchestration(grouping, learnerTask) {
  var token = normalizeGroupingToken(grouping);
  var task = nonEmptyString(learnerTask);
  if (!token || token === "individual" || token === "mixed") return true;
  if (!task) return false;
  var pattern = GROUPING_ORCHESTRATION_PATTERNS[token];
  if (!pattern) return true;
  return pattern.test(task);
}

function appendFacilitatedActivityGroupingValidationErrors(activity, index, errors) {
  if (!activity || typeof activity !== "object" || Array.isArray(activity)) return;
  var grouping = activity.grouping;
  if (!nonEmptyString(grouping)) {
    errors.push("activities[" + index + "].grouping required for facilitated delivery");
    return;
  }
  if (!isKnownGroupingToken(grouping)) {
    errors.push(
      "activities[" + index + "].grouping must use an existing grouping token (individual, pair, pairs, small_group, whole_group, individual_then_small_group, individual_then_pair, mixed)"
    );
    return;
  }
  if (!nonEmptyString(activity.learner_task)) {
    errors.push("activities[" + index + "].learner_task required when grouping is present");
    return;
  }
  if (
    groupingRequiresParticipantOrchestration(grouping) &&
    !learnerTaskExpressesGroupingOrchestration(grouping, activity.learner_task)
  ) {
    errors.push(
      "activities[" +
        index +
        "].learner_task must include participant-facing orchestration consistent with grouping \"" +
        normalizeGroupingToken(grouping) +
        "\" (facilitator_moves alone is insufficient)"
    );
  }
}

function buildDlaFacilitatedDeliveryContractBlock() {
  return [
    "Facilitated session delivery (mandatory when delivery_context is in_person or online_sync, or delivery_mode is live_workshop):",
    "- Every activities[] row MUST include grouping using the existing schema vocabulary: individual | pair | pairs | small_group | whole_group | individual_then_small_group | individual_then_pair | mixed.",
    "- individual is valid when the activity is genuinely solo-completable; do not force collaborative wording onto individual activities.",
    "- learner_task MUST express participant-facing orchestration consistent with grouping:",
    "  • pair / pairs → instruct participants to work with a partner (e.g. in pairs, with a partner).",
    "  • small_group → instruct participants to work/discuss in a small group.",
    "  • whole_group → instruct participants to share, compare, or contribute as a whole group/class.",
    "  • individual_then_* → include both phases where applicable (solo work, then pair/group as named).",
    "- facilitator_moves may supplement timing or facilitation cues but MUST NOT be the sole carrier of social mode when grouping implies collaborative participation.",
    "- Do not rely on Learning Sequence timeline grouping alone — activities[].grouping is the learner-display authority."
  ].join("\n");
}

module.exports = {
  FACILITATED_DELIVERY_CONTEXTS: FACILITATED_DELIVERY_CONTEXTS,
  FACILITATED_DELIVERY_MODES: FACILITATED_DELIVERY_MODES,
  KNOWN_GROUPING_TOKENS: KNOWN_GROUPING_TOKENS,
  normalizeGroupingToken: normalizeGroupingToken,
  isFacilitatedDeliveryContext: isFacilitatedDeliveryContext,
  isKnownGroupingToken: isKnownGroupingToken,
  groupingRequiresParticipantOrchestration: groupingRequiresParticipantOrchestration,
  learnerTaskExpressesGroupingOrchestration: learnerTaskExpressesGroupingOrchestration,
  appendFacilitatedActivityGroupingValidationErrors: appendFacilitatedActivityGroupingValidationErrors,
  buildDlaFacilitatedDeliveryContractBlock: buildDlaFacilitatedDeliveryContractBlock
};
