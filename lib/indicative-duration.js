/**
 * Sprint 104 — Shared indicative duration convention & learner timing guidance.
 *
 * Governing principle: precision internally, flexibility externally.
 *
 * - Internal design, commissioning, locking, transport, and arithmetic always
 *   use the exact authoritative numeric allocated duration.
 * - Learner-facing displays use this single shared helper to present inclusive
 *   indicative planning ranges (never calculated by summing component ranges).
 * - Advisory workload feasibility adapters use the shared upper indicative
 *   boundary (`highMinutes`) to detect significant design disproportion.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.PrismIndicativeDuration = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var SCHEMA_VERSION = "104.indicative-duration.v1";

  var LEARNER_TIMING_GUIDANCE_NOTE =
    "The suggested timings are a guide to help you plan your learning. You may need more or less time depending on your prior knowledge and how you approach the activities. Work at a pace that suits you.";

  function parsePositiveMinutes(value) {
    if (value == null || value === "") return null;
    var n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return null;
    return Math.round(n * 1e6) / 1e6;
  }

  function roundToNearest5(value) {
    return Math.round(value / 5) * 5;
  }

  /**
   * Compute the shared indicative duration band and learner-facing label for an
   * exact internal allocated duration (in minutes).
   *
   * Benchmark examples:
   *   5  -> "Around 5 minutes"   (internal tolerance 3–7, upperBoundary 7)
   *   10 -> "5–15 minutes"       (5–15, upperBoundary 15)
   *   15 -> "10–20 minutes"      (10–20, upperBoundary 20)
   *   20 -> "15–25 minutes"      (15–25, upperBoundary 25)
   *   30 -> "20–40 minutes"      (20–40, upperBoundary 40)
   *   45 -> "35–55 minutes"      (35–55, upperBoundary 55)
   *   90 -> "75–105 minutes"     (75–105, upperBoundary 105)
   *
   * Strictly non-decreasing across all positive durations (including short,
   * fractional, and extended durations). Never sum component ranges for an
   * aggregate duration — pass the exact aggregate total directly.
   *
   * @param {number|string|null|undefined} allocatedMinutes
   * @returns {object|null}
   */
  function computeIndicativeDuration(allocatedMinutes) {
    var exact = parsePositiveMinutes(allocatedMinutes);
    if (exact == null) return null;

    var base = Math.max(1, Math.round(exact));
    var tolerance;
    var isShortAround = false;

    if (base <= 7) {
      isShortAround = true;
      tolerance = Math.max(1, Math.round(base * 0.4));
    } else if (base <= 9) {
      tolerance = 4;
    } else if (base <= 24) {
      tolerance = 5;
    } else if (base <= 29) {
      tolerance = Math.min(10, Math.round(base * 0.3));
    } else if (base <= 60) {
      tolerance = 10;
    } else if (base <= 74) {
      tolerance = 12;
    } else if (base <= 120) {
      tolerance = 15;
    } else {
      tolerance = Math.max(15, roundToNearest5(base * 0.15));
    }

    var lowMinutes = Math.max(1, base - tolerance);
    var highMinutes = base + tolerance;
    var label = isShortAround
      ? "Around " + base + (base === 1 ? " minute" : " minutes")
      : lowMinutes + "–" + highMinutes + " minutes";

    return {
      schemaVersion: SCHEMA_VERSION,
      allocatedMinutes: exact,
      roundedAllocatedMinutes: base,
      toleranceMinutes: tolerance,
      lowMinutes: lowMinutes,
      highMinutes: highMinutes,
      upperBoundaryMinutes: highMinutes,
      isShortAround: isShortAround,
      label: label
    };
  }

  /**
   * Format an exact allocated duration as learner-facing indicative text.
   * Returns "" when input is not a positive finite number.
   */
  function formatIndicativeDuration(allocatedMinutes) {
    var info = computeIndicativeDuration(allocatedMinutes);
    return info ? info.label : "";
  }

  /**
   * Return the shared internal upper tolerance boundary (minutes) for advisory
   * workload feasibility comparison. Returns null when duration is unavailable.
   */
  function getUpperIndicativeBoundaryMinutes(allocatedMinutes) {
    var info = computeIndicativeDuration(allocatedMinutes);
    return info ? info.upperBoundaryMinutes : null;
  }

  return {
    SCHEMA_VERSION: SCHEMA_VERSION,
    LEARNER_TIMING_GUIDANCE_NOTE: LEARNER_TIMING_GUIDANCE_NOTE,
    computeIndicativeDuration: computeIndicativeDuration,
    formatIndicativeDuration: formatIndicativeDuration,
    getUpperIndicativeBoundaryMinutes: getUpperIndicativeBoundaryMinutes
  };
});
