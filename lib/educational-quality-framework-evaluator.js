/**
 * EDUCATIONAL-QUALITY-FRAMEWORK-EVALUATOR — Sprint 41 diagnostic evidence scanner.
 * Heuristic only — does not block generation or score full educational quality.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_EDUCATIONAL_QUALITY_FRAMEWORK_EVALUATOR = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var MODULE_ID = "EDUCATIONAL-QUALITY-FRAMEWORK-EVALUATOR";
  var EVALUATOR_VERSION = "41E-1";
  var DEFAULT_THRESHOLD = 5;
  var MAX_SNIPPET = 72;

  var DIMENSION_ORDER = [
    "learner_journey",
    "understanding",
    "capability",
    "judgement",
    "independence",
    "metacognition",
    "learning_success",
    "cognitive_activity"
  ];

  var DIMENSION_PATTERNS = {
    learner_journey: [
      /\b(learner[- ]?development|learning journey|intellectual journey|learner journey)\b/i,
      /\b(activity arc|session arc|progression|staged development|overview.{0,40}closure)\b/i,
      /\b(orientation|guided practice|independent decision|transfer)\b/i,
      /\b(intellectual_coherence_bridge|study_orientation|learning_purpose)\b/i,
      /\b(how activities build|from .{3,30} to .{3,30})\b/i
    ],
    understanding: [
      /\b(explain|distinguish|concept|misconception|prior knowledge|conceptual contrast)\b/i,
      /\b(connect|definition|understanding|what .{2,20} means)\b/i,
      /\b(non[- ]?example|confusion point|key idea)\b/i
    ],
    capability: [
      /\b(practice|apply|application|procedure|worked example|worked_thinking)\b/i,
      /\b(faded|partial completion|learner_task|expected_output|observable output)\b/i,
      /\b(complete the|task completion|demonstrate|can do)\b/i
    ],
    judgement: [
      /\b(compare|evaluate|justify|critique|defend|decide|prioriti[sz]e)\b/i,
      /\b(trade[- ]?off|criteria|weak.{0,20}strong|reasoning quality)\b/i,
      /\b(which .{2,30} (best|stronger|more convincing))\b/i
    ],
    independence: [
      /\b(independent|transfer|self[- ]?check|decision making|on your own)\b/i,
      /\b(reduced scaffolding|responsibility|without (support|scaffolding))\b/i,
      /\b(guided .{0,20} independent|faded .{0,20} independent)\b/i
    ],
    metacognition: [
      /\b(reflect|confidence|uncertainty|progress check|self[- ]?explanation)\b/i,
      /\b(next step|check your thinking|what changed in your understanding)\b/i,
      /\b(reasoning_orientation|uncertainty_tension_prompt)\b/i
    ],
    learning_success: [
      /\b(what you now understand|can do|can judge|manage independently)\b/i,
      /\b(study_tips|completion evidence|what should now be clearer)\b/i,
      /\b(expected_output|learning success|recognise.{0,20}progress)\b/i
    ],
    cognitive_activity: [
      /\b(think|compare|evaluate|justify|reflect|decide|transfer)\b/i,
      /\b(interpret|analyse|analyze|argue|synthesi[sz]e)\b/i
    ]
  };

  var SURFACE_ONLY_PATTERNS = [
    /\b(click|select all that apply|drag and drop)\b/i,
    /\b(complete the (form|quiz) only|surface interaction)\b/i
  ];

  var ACTIVITY_FIELD_KEYS = [
    "title",
    "activity_preamble",
    "learner_task",
    "learner_instructions",
    "expected_output",
    "support_note",
    "support_notes",
    "purpose",
    "study_orientation",
    "intellectual_frame",
    "intellectual_coherence_bridge",
    "reasoning_orientation",
    "self_explanation_prompt",
    "transfer_or_application_task",
    "scaffold_hint_sequence",
    "uncertainty_tension_prompt"
  ];

  var PAGE_SECTION_IDS = [
    "overview",
    "learning_purpose",
    "study_tips",
    "knowledge_summary",
    "learning_activities",
    "assessment_check",
    "support_notes"
  ];

  function emptyDimension() {
    return { present: false, evidence: [] };
  }

  function emptyResult(warnings) {
    var dimensions = {};
    DIMENSION_ORDER.forEach(function (key) {
      dimensions[key] = emptyDimension();
    });
    return {
      ok: false,
      score: 0,
      dimensions: dimensions,
      warnings: Array.isArray(warnings) ? warnings.slice() : []
    };
  }

  function clipSnippet(text) {
    var t = String(text || "")
      .replace(/\s+/g, " ")
      .trim();
    if (!t) return "";
    if (t.length <= MAX_SNIPPET) return t;
    return t.slice(0, MAX_SNIPPET - 1) + "\u2026";
  }

  function pushEvidence(bucket, source, text, patternLabel) {
    if (!bucket || bucket.present) return;
    var snippet = clipSnippet(text);
    var entry = patternLabel
      ? source + ": pattern " + patternLabel
      : source + (snippet ? ': "' + snippet + '"' : "");
    if (!entry) return;
    if (bucket.evidence.indexOf(entry) === -1) {
      bucket.evidence.push(entry);
    }
    if (bucket.evidence.length >= 3) {
      bucket.present = true;
    }
  }

  function markPresent(bucket, source, text) {
    pushEvidence(bucket, source, text, "");
    bucket.present = true;
  }

  function stripHtml(html) {
    return String(html || "")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/\s+/g, " ")
      .trim();
  }

  function flattenValue(value, depth) {
    var d = typeof depth === "number" ? depth : 0;
    if (value == null) return "";
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    if (Array.isArray(value)) {
      return value
        .map(function (item) {
          return flattenValue(item, d + 1);
        })
        .filter(Boolean)
        .join("\n");
    }
    if (typeof value === "object" && d < 6) {
      return Object.keys(value)
        .map(function (k) {
          return flattenValue(value[k], d + 1);
        })
        .filter(Boolean)
        .join("\n");
    }
    return "";
  }

  function collectCorpusEntries(input) {
    var entries = [];
    function add(source, text) {
      var body = String(text || "").trim();
      if (!body) return;
      entries.push({ source: source, text: body });
    }

    if (input == null) return entries;

    if (typeof input === "string") {
      var trimmed = input.trim();
      if (!trimmed) return entries;
      if (/<[a-z][\s\S]*>/i.test(trimmed)) {
        add("html", stripHtml(trimmed));
      } else {
        add("text", trimmed);
      }
      return entries;
    }

    if (typeof input !== "object") return entries;

    if (Array.isArray(input.activities)) {
      input.activities.forEach(function (activity, idx) {
        collectActivityEntries(activity, "activities[" + idx + "]", add);
      });
    }
    if (Array.isArray(input.learning_activities)) {
      input.learning_activities.forEach(function (activity, idx) {
        collectActivityEntries(activity, "learning_activities[" + idx + "]", add);
      });
    }

    if (input.delivery_notes && typeof input.delivery_notes === "object") {
      add("delivery_notes", flattenValue(input.delivery_notes));
    }

    if (Array.isArray(input.sections)) {
      input.sections.forEach(function (section) {
        if (!section || typeof section !== "object") return;
        var sid = String(section.section_id || section.heading || "section").trim();
        var content = section.content;
        if (Array.isArray(content)) {
          content.forEach(function (activity, idx) {
            collectActivityEntries(activity, sid + ".content[" + idx + "]", add);
          });
        } else {
          add(sid, flattenValue(content));
        }
      });
    }

    if (!entries.length) {
      add("object", flattenValue(input));
    }

    return entries;
  }

  function collectActivityEntries(activity, prefix, add) {
    if (!activity || typeof activity !== "object") return;
    ACTIVITY_FIELD_KEYS.forEach(function (field) {
      if (activity[field] != null) {
        add(prefix + "." + field, flattenValue(activity[field]));
      }
    });
    if (Array.isArray(activity.required_materials)) {
      activity.required_materials.forEach(function (mat, idx) {
        if (!mat || typeof mat !== "object") return;
        add(
          prefix + ".required_materials[" + idx + "]",
          flattenValue({
            type: mat.type,
            purpose: mat.purpose,
            specification: mat.specification
          })
        );
      });
    }
    if (activity.materials && typeof activity.materials === "object") {
      add(prefix + ".materials", flattenValue(activity.materials));
    }
  }

  function scanDimension(dimensionKey, entries) {
    var bucket = emptyDimension();
    var patterns = DIMENSION_PATTERNS[dimensionKey] || [];
    entries.forEach(function (entry) {
      patterns.forEach(function (pattern, patternIdx) {
        if (!pattern.test(entry.text)) return;
        pushEvidence(
          bucket,
          entry.source,
          entry.text.match(pattern)[0] || entry.text,
          "p" + (patternIdx + 1)
        );
        bucket.present = true;
      });
    });
    return bucket;
  }

  function applyProgressiveIndependenceHeuristic(entries, dimensions) {
    var combined = entries
      .map(function (e) {
        return e.text;
      })
      .join("\n")
      .toLowerCase();
    var hasWorked = /\b(worked|modelled|modeled|example)\b/.test(combined);
    var hasGuided = /\b(guided|supported decision|partial|faded)\b/.test(combined);
    var hasIndependent = /\b(independent|on your own|without support)\b/.test(combined);
    var hasTransfer = /\b(transfer|new context|apply to)\b/.test(combined);
    var count = (hasWorked ? 1 : 0) + (hasGuided ? 1 : 0) + (hasIndependent ? 1 : 0) + (hasTransfer ? 1 : 0);
    if (count >= 2) {
      markPresent(
        dimensions.independence,
        "progression-heuristic",
        "worked/modelled → guided → independent → transfer language"
      );
    }
    if (hasWorked && hasGuided && hasIndependent) {
      markPresent(dimensions.learner_journey, "progression-heuristic", "staged development arc");
    }
  }

  function applyCognitiveActivityHeuristic(entries, dimensions) {
    var combined = entries
      .map(function (e) {
        return e.text;
      })
      .join("\n");
    var cognitiveHits = DIMENSION_PATTERNS.cognitive_activity.filter(function (pattern) {
      return pattern.test(combined);
    }).length;
    var surfaceOnly =
      SURFACE_ONLY_PATTERNS.some(function (pattern) {
        return pattern.test(combined);
      }) && cognitiveHits === 0;
    if (surfaceOnly) {
      dimensions.cognitive_activity.present = false;
      dimensions.cognitive_activity.evidence.push("warning: surface-interaction language without cognitive verbs");
      return;
    }
    if (cognitiveHits > 0) {
      markPresent(dimensions.cognitive_activity, "cognitive-heuristic", combined);
    }
  }

  function evaluateEducationalQualityFrameworkEvidence(input, options) {
    var opts = options && typeof options === "object" ? options : {};
    var threshold =
      typeof opts.threshold === "number" && opts.threshold >= 0
        ? opts.threshold
        : DEFAULT_THRESHOLD;
    var warnings = [];

    if (input == null || (typeof input === "object" && !Array.isArray(input) && !Object.keys(input).length)) {
      var empty = emptyResult(["input missing or empty"]);
      empty.warnings = warnings.concat(empty.warnings);
      return empty;
    }

    var entries = collectCorpusEntries(input);
    if (!entries.length) {
      var noCorpus = emptyResult(["no evaluable text corpus extracted from input"]);
      return noCorpus;
    }

    var dimensions = {};
    DIMENSION_ORDER.forEach(function (key) {
      dimensions[key] = scanDimension(key, entries);
    });

    applyProgressiveIndependenceHeuristic(entries, dimensions);
    applyCognitiveActivityHeuristic(entries, dimensions);

    var score = DIMENSION_ORDER.filter(function (key) {
      return dimensions[key].present;
    }).length;

    if (score < threshold) {
      warnings.push(
        "educational quality evidence below threshold (" + score + "/" + threshold + " dimensions)"
      );
    }

    return {
      ok: score >= threshold,
      score: score,
      dimensions: dimensions,
      warnings: warnings
    };
  }

  function summariseEducationalQualityFrameworkEvidence(result) {
    if (!result || typeof result !== "object") {
      return "Educational quality evaluation unavailable.";
    }
    var present = [];
    var missing = [];
    DIMENSION_ORDER.forEach(function (key) {
      var dim = result.dimensions && result.dimensions[key];
      if (dim && dim.present) present.push(key.replace(/_/g, " "));
      else missing.push(key.replace(/_/g, " "));
    });
    var score = typeof result.score === "number" ? result.score : 0;
    var ok = !!result.ok;
    var parts = [
      "Educational quality evidence: " + score + "/8 dimensions",
      ok ? "meets threshold" : "below threshold"
    ];
    if (present.length) parts.push("present: " + present.join(", "));
    if (missing.length) parts.push("missing: " + missing.join(", "));
    if (Array.isArray(result.warnings) && result.warnings.length) {
      parts.push("warnings: " + result.warnings.join("; "));
    }
    return parts.join(". ") + ".";
  }

  return {
    MODULE_ID: MODULE_ID,
    EVALUATOR_VERSION: EVALUATOR_VERSION,
    DEFAULT_THRESHOLD: DEFAULT_THRESHOLD,
    DIMENSION_ORDER: DIMENSION_ORDER,
    evaluateEducationalQualityFrameworkEvidence: evaluateEducationalQualityFrameworkEvidence,
    summariseEducationalQualityFrameworkEvidence: summariseEducationalQualityFrameworkEvidence
  };
});
