/**
 * Guided-review generation quality contract for GAM.
 * Shared by SP-05 runtime injection and GAM page-enrich / shape guidance.
 * Soft diagnostics only for stored material — does not break parse/render of one-feature bodies.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_GUIDED_REVIEW_GENERATION_CONTRACT = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var CONTRACT_VERSION = "71-GUIDED-REVIEW-QUALITY-2";
  var FEATURES_NORMAL_MIN = 2;
  var FEATURES_NORMAL_MAX = 3;
  var FEATURES_HARD_MAX = 4;

  var GENERIC_REPAIR_ONLY_PATTERNS = [
    /^revisit\b/i,
    /^review\b/i,
    /^reread\b/i,
    /^add more detail\b/i,
    /^add detail\b/i,
    /^clarify\b/i,
    /^be more precise\b/i,
    /^use precise (terms|terminology|language)\b/i,
    /^replace vague\b/i,
    /^add links?\b/i,
    /^add connections?\b/i,
    /^check your work\b/i,
    /^explain further\b/i,
    /^include missing information\b/i,
    /^make (it|your answer) clearer\b/i,
    /^improve (clarity|precision|accuracy)\b/i
  ];

  var GENERIC_WHY_PATTERNS = [
    /^accuracy\b/i,
    /^precision\b/i,
    /^evidence\b/i,
    /^systems thinking\b/i,
    /^this (improves|ensures|shows) (accuracy|precision|quality)\b/i,
    /^so (the|your) (answer|response) is (accurate|precise|clear)\b/i,
    /^because (accuracy|precision|clarity|evidence) (matters|is important)\b/i
  ];

  function nonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  function isPlainObject(value) {
    return !!value && typeof value === "object" && !Array.isArray(value);
  }

  function asGuidedPayload(body) {
    if (isPlainObject(body)) return body;
    if (typeof body !== "string" || !body.trim()) return null;
    try {
      var parsed = JSON.parse(body);
      return isPlainObject(parsed) ? parsed : null;
    } catch (_err) {
      return null;
    }
  }

  function isGuidedReviewMode(value) {
    var mode = String(value == null ? "" : value)
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_");
    return mode === "guided_criteria" || mode === "guided_review";
  }

  function hasConcreteDisciplinaryContent(text) {
    var sample = String(text || "").trim();
    if (!sample) return false;
    // Acronym / symbol-like terms (IRES, NS5B, CPI, HCV).
    if (/\b[A-Z]{2,}[0-9A-Za-z-]*\b/.test(sample)) return true;
    // Explicit mechanism / role language with a concrete verb.
    if (
      /\b(recruit|recruits|binding|protects|distinguish|distinguishes|enabling|initiate|initiates|catalyse|catalyze|polymerase|mechanism|ribosome|genome)\b/i.test(
        sample
      )
    ) {
      return true;
    }
    // Longer clause that names what to add with a specific that/how construction.
    if (sample.length >= 72 && /\b(that|how)\b.+\b(to|for|without|from|between)\b/i.test(sample)) {
      return true;
    }
    return false;
  }

  function looksGenericRepairOnly(repair) {
    var text = String(repair || "").trim();
    if (!text) return true;
    for (var i = 0; i < GENERIC_REPAIR_ONLY_PATTERNS.length; i += 1) {
      if (!GENERIC_REPAIR_ONLY_PATTERNS[i].test(text)) continue;
      var remainder = text.replace(GENERIC_REPAIR_ONLY_PATTERNS[i], "").trim();
      remainder = remainder.replace(/^[,:;—–-]+\s*/, "").trim();
      if (!remainder) return true;
      if (remainder.length < 24) return true;
      if (/^(your answer|the material|the response|more detail|precise terms|any component)\b/i.test(remainder)) {
        return true;
      }
      // Generic stem is only acceptable when followed by concrete disciplinary content.
      if (!hasConcreteDisciplinaryContent(remainder) && !hasConcreteDisciplinaryContent(text)) {
        return true;
      }
    }
    return false;
  }

  function looksGenericWhy(why) {
    var text = String(why || "").trim();
    if (!text) return true;
    if (text.length < 28) return true;
    for (var i = 0; i < GENERIC_WHY_PATTERNS.length; i += 1) {
      if (GENERIC_WHY_PATTERNS[i].test(text) && text.length < 80) return true;
    }
    return false;
  }

  function looksCompleteModelAnswer(repair) {
    var text = String(repair || "").trim();
    if (text.length < 220) return false;
    var sentenceCount = (text.match(/[.!?](?:\s|$)/g) || []).length;
    if (sentenceCount >= 4 && text.length >= 280) return true;
    if (/^(write|provide|produce) (a |the )?(full|complete|finished)\b/i.test(text)) return true;
    return false;
  }

  /**
   * Soft quality diagnostics for guided-review bodies.
   * Does not invalidate one-feature legacy material for parse/render.
   */
  function diagnoseGuidedReviewGenerationQuality(body, options) {
    var opts = options || {};
    var diagnostics = [];
    var payload = asGuidedPayload(body);
    if (!payload) {
      return { ok: true, guided: false, diagnostics: diagnostics };
    }
    if (!isGuidedReviewMode(payload.review_mode) && !Array.isArray(payload.criteria)) {
      return { ok: true, guided: false, diagnostics: diagnostics };
    }
    if (!isGuidedReviewMode(payload.review_mode)) {
      diagnostics.push({
        code: "GUIDED_REVIEW_MODE_UNEXPECTED",
        severity: "warn",
        message: 'review_mode should be "guided_criteria" for guided-review checklists.'
      });
    }
    var criteria = Array.isArray(payload.criteria) ? payload.criteria : [];
    criteria.forEach(function (criterion, index) {
      if (!isPlainObject(criterion)) return;
      var path = "criteria[" + index + "]";
      var features = Array.isArray(criterion.features) ? criterion.features : [];
      var validFeatures = features.filter(function (feature) {
        return (
          isPlainObject(feature) &&
          nonEmptyString(feature.expected) &&
          nonEmptyString(feature.repair || feature.if_missing)
        );
      });

      if (validFeatures.length < 1) {
        diagnostics.push({
          code: "GUIDED_REVIEW_FEATURE_PAIR_MISSING",
          severity: "warn",
          message: path + " needs at least one expected/repair pair."
        });
      } else if (validFeatures.length === 1 && opts.requireMultiFeature !== false) {
        diagnostics.push({
          code: "GUIDED_REVIEW_FEATURE_DEPTH_THIN",
          severity: "warn",
          message:
            path +
            " has only one feature/repair pair; normally emit " +
            FEATURES_NORMAL_MIN +
            "–" +
            FEATURES_NORMAL_MAX +
            " independently observable pairs (max " +
            FEATURES_HARD_MAX +
            ") unless the criterion is genuinely atomic."
        });
      } else if (validFeatures.length > FEATURES_HARD_MAX) {
        diagnostics.push({
          code: "GUIDED_REVIEW_FEATURE_COUNT_HIGH",
          severity: "warn",
          message: path + " exceeds " + FEATURES_HARD_MAX + " feature/repair pairs."
        });
      }

      if (looksGenericWhy(criterion.why_it_matters || criterion.whyItMatters || "")) {
        diagnostics.push({
          code: "GUIDED_REVIEW_WHY_GENERIC",
          severity: "warn",
          message:
            path +
            ".why_it_matters should state the criterion-specific consequence for response quality, not a generic accuracy/precision claim."
        });
      }

      validFeatures.forEach(function (feature, fIndex) {
        var repair = feature.repair || feature.if_missing || "";
        var featurePath = path + ".features[" + fIndex + "]";
        if (looksGenericRepairOnly(repair)) {
          diagnostics.push({
            code: "GUIDED_REVIEW_REPAIR_GENERIC",
            severity: "warn",
            message:
              featurePath +
              ".repair is generic-only; name the missing content, relationship, or reasoning operation to add."
          });
        }
        if (looksCompleteModelAnswer(repair)) {
          diagnostics.push({
            code: "GUIDED_REVIEW_REPAIR_MODEL_ANSWER",
            severity: "warn",
            message:
              featurePath +
              ".repair appears to supply a complete replacement answer; keep repairs as targeted revision moves (MP-1)."
          });
        }
        if (!nonEmptyString(feature.expected)) {
          diagnostics.push({
            code: "GUIDED_REVIEW_EXPECTED_MISSING",
            severity: "warn",
            message: featurePath + ".expected required for each repair."
          });
        }
      });
    });

    return {
      ok: diagnostics.length === 0,
      guided: true,
      diagnostics: diagnostics
    };
  }

  function buildGuidedReviewFeatureQualityLines() {
    return [
      "- Feature/repair depth (generation quality — required for new guided reviews):",
      "  - Normally emit " +
        FEATURES_NORMAL_MIN +
        "–" +
        FEATURES_NORMAL_MAX +
        " independently observable {expected, repair} pairs per criterion (hard maximum " +
        FEATURES_HARD_MAX +
        ").",
      "  - One feature is permitted only for a genuinely atomic criterion and MUST still carry an explicit, discipline-specific repair.",
      "  - Every expected feature MUST have a paired repair that corresponds to that feature alone.",
      "  - Each expected must identify something the learner can locate in their response, such as: required content/components; distinctions between concepts; causal or functional relationships; necessary explanatory stages; evidence supporting a claim; an alternative, limitation or qualification; or a discipline-specific reasoning operation.",
      "  - Each repair must: identify the missing content, relationship or reasoning operation; tell the learner what to add, distinguish, connect, justify, qualify or reconsider; use appropriate disciplinary language; and help improve their own response without supplying a complete replacement answer (MP-1).",
      "  - why_it_matters must state the criterion's consequence for response quality — not a generic claim about accuracy, precision, evidence or systems thinking.",
      "- Forbidden as stand-alone repairs (generic-only): revisit/review the material; add more detail; clarify your answer; use precise terminology; replace vague wording; add links/connections; check your work; explain further; include missing information; or restate the criterion as an instruction. Such stems are allowed only when immediately followed by the specific content or relationship required.",
      "- Forbidden: repairs that become a complete model answer or finished deliverable for the learner."
    ];
  }

  function buildGuidedReviewGoodShapeExampleLines() {
    return [
      "- GOOD guided depth example (adapt entities and mechanisms to the upstream subject — do not copy biology if the page is not biological):",
      '  {"review_mode":"guided_criteria","criteria":[{',
      '    "statement":"Have you identified the correct role of each replication component?",',
      '    "why_it_matters":"If roles are collapsed or swapped, the response cannot show how the replication system actually works.",',
      '    "features":[',
      '      {"expected":"IRES is connected to translation initiation.","repair":"State that the IRES recruits ribosomes to viral RNA, enabling translation without conventional cap-dependent initiation."},',
      '      {"expected":"microRNA-122 is connected to viral RNA stability.","repair":"Explain that microRNA-122 binding protects the HCV genome and supports its availability for translation and replication."},',
      '      {"expected":"NS5A and NS5B are assigned distinct but connected functions.","repair":"Distinguish NS5A’s coordinating role from NS5B’s RNA-polymerase activity, then explain why successful replication requires both."}',
      "    ],",
      '    "confirmation_label":"My response now meets this criterion"',
      "  }]}"
    ];
  }

  /**
   * Core generation rules shared by SP-05 and GAM enrich contract (without SP marker).
   */
  function buildGuidedReviewGenerationGuidanceLines() {
    return [
      '- Prefer body_format: "json" with structured guided-review body (not Markdown bullets).',
      '- Body object shape: { "review_mode": "guided_criteria", "criteria": [ ... ] }',
      "- Emit 3–4 criteria (hard maximum 5). Each criterion MUST include:",
      "  - statement: learner-check question (Have you / Did you / Does your) tied to expected_output or activity criteria",
      "  - why_it_matters: criterion-specific consequence for response quality (not generic motivation)",
      "  - features: normally " +
        FEATURES_NORMAL_MIN +
        "–" +
        FEATURES_NORMAL_MAX +
        " objects { expected, repair } (maximum " +
        FEATURES_HARD_MAX +
        "); each expected paired with a specific repair",
      '  - confirmation_label: optional; default "My response now meets this criterion"'
    ]
      .concat(buildGuidedReviewFeatureQualityLines())
      .concat([
        "- A checklist that verifies row/table/task completion only without reasoning-quality or criteria-evidence checks is an instructional FAIL (FM-09).",
        "- A guided checklist with fewer than three complete criteria, missing feature/repair pairs, or pointer-only body is an instructional FAIL — do not emit.",
        "- Simple Markdown bullet checklists remain valid only for backward-compatible non-guided cases; do not embed JSON inside Markdown."
      ])
      .concat(buildGuidedReviewGoodShapeExampleLines())
      .concat([
        "- FORBIDDEN: motivational coaching without naming a weak pattern or revision move.",
        "- FORBIDDEN: generic revise guidance without specific remediation.",
        "- FORBIDDEN: Did you finish? or other generic completion checks without criteria linkage.",
        "- FORBIDDEN: MCQs, or claiming Prism assessed the free-text response."
      ]);
  }

  return {
    CONTRACT_VERSION: CONTRACT_VERSION,
    FEATURES_NORMAL_MIN: FEATURES_NORMAL_MIN,
    FEATURES_NORMAL_MAX: FEATURES_NORMAL_MAX,
    FEATURES_HARD_MAX: FEATURES_HARD_MAX,
    buildGuidedReviewGenerationGuidanceLines: buildGuidedReviewGenerationGuidanceLines,
    buildGuidedReviewFeatureQualityLines: buildGuidedReviewFeatureQualityLines,
    buildGuidedReviewGoodShapeExampleLines: buildGuidedReviewGoodShapeExampleLines,
    diagnoseGuidedReviewGenerationQuality: diagnoseGuidedReviewGenerationQuality,
    looksGenericRepairOnly: looksGenericRepairOnly,
    looksGenericWhy: looksGenericWhy,
    looksCompleteModelAnswer: looksCompleteModelAnswer
  };
});
