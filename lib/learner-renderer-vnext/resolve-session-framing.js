"use strict";

/**
 * Resolve learner-facing session framing labels from existing page delivery metadata.
 * Does not introduce a product registry — reads constraints_applied / page_profile only.
 */

function nonEmptyString(value) {
  return String(value == null ? "" : value).trim();
}

function normalizeDeliveryToken(value) {
  return nonEmptyString(value).toLowerCase().replace(/\s+/g, "_");
}

function readDeliveryMetadata(page) {
  var mode = "";
  var context = "";
  if (page && page.constraints_applied && typeof page.constraints_applied === "object") {
    if (!Array.isArray(page.constraints_applied)) {
      mode = normalizeDeliveryToken(page.constraints_applied.delivery_mode);
      context = normalizeDeliveryToken(page.constraints_applied.delivery_context);
    }
  }
  var profile = page && page.page_profile;
  if (profile && typeof profile === "object" && !Array.isArray(profile)) {
    if (!context) context = normalizeDeliveryToken(profile.delivery_context);
    if (!mode) mode = normalizeDeliveryToken(profile.mode);
  }
  return { mode: mode, context: context };
}

function isFacilitatedSessionPage(page) {
  var delivery = readDeliveryMetadata(page);
  if (delivery.mode === "live_workshop" || delivery.mode === "seminar") return true;
  if (delivery.context === "in_person" || delivery.context === "online_sync") return true;
  return false;
}

var SELF_STUDY_FRAMING = Object.freeze({
  kind: "self_study",
  outcomesIntro: "By the end of this lesson, you should be able to:",
  progressionHeading: "How this lesson progresses"
});

var FACILITATED_SESSION_FRAMING = Object.freeze({
  kind: "facilitated_session",
  outcomesIntro: "By the end of this session, you should be able to:",
  progressionHeading: "How this session progresses"
});

function resolveSessionFramingFromPage(page) {
  return isFacilitatedSessionPage(page) ? FACILITATED_SESSION_FRAMING : SELF_STUDY_FRAMING;
}

module.exports = {
  readDeliveryMetadata: readDeliveryMetadata,
  isFacilitatedSessionPage: isFacilitatedSessionPage,
  resolveSessionFramingFromPage: resolveSessionFramingFromPage,
  SELF_STUDY_FRAMING: SELF_STUDY_FRAMING,
  FACILITATED_SESSION_FRAMING: FACILITATED_SESSION_FRAMING
};
