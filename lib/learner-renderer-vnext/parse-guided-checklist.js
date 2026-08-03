"use strict";

/**
 * Guided-review checklist parsing and validation.
 * Explicit structured (JSON) mode only — never detect JSON inside Markdown.
 */

var DEFAULT_CONFIRMATION_LABEL = "My response now meets this criterion";
var MAX_CRITERIA = 5;
var MIN_GUIDED_CRITERIA = 2;
var MAX_FEATURES = 4;

function nonEmptyString(value) {
  var text = String(value == null ? "" : value).trim();
  return text || "";
}

function asObject(raw) {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw;
  if (typeof raw !== "string") return null;
  var text = raw.trim();
  if (!text) return null;
  try {
    var parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
  } catch (_) {
    return null;
  }
  return null;
}

function normalizeFeature(raw) {
  if (!raw || typeof raw !== "object") return null;
  var expected = nonEmptyString(raw.expected || raw.look_for || raw.feature);
  var repair = nonEmptyString(raw.repair || raw.if_missing || raw.corrective_action);
  if (!expected || !repair) return null;
  return { expected: expected, repair: repair };
}

function normalizeGuidedCriterion(raw, index, materialId) {
  if (!raw || typeof raw !== "object") return null;
  var statement = nonEmptyString(
    raw.statement || raw.criterion || raw.question || raw.prompt
  );
  if (!statement) return null;

  var featureSource = Array.isArray(raw.features)
    ? raw.features
    : Array.isArray(raw.look_for)
      ? raw.look_for
      : [];
  var features = [];
  var fi;
  for (fi = 0; fi < featureSource.length && features.length < MAX_FEATURES; fi += 1) {
    var feature = normalizeFeature(featureSource[fi]);
    if (feature) features.push(feature);
  }
  if (!features.length) return null;

  var why = nonEmptyString(raw.why_it_matters || raw.whyItMatters || raw.rationale);
  var confirmation = nonEmptyString(
    raw.confirmation_label || raw.confirmationLabel || raw.confirm_label
  );
  if (!confirmation) confirmation = DEFAULT_CONFIRMATION_LABEL;

  var authoredId = nonEmptyString(raw.id || raw.criterion_id);
  var id =
    authoredId ||
    String(materialId || "checklist")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") +
      "-c-" +
      String(index);

  return {
    id: id,
    statement: statement,
    whyItMatters: why || null,
    features: features,
    confirmationLabel: confirmation
  };
}

/**
 * @param {string|Object|null|undefined} rawBody
 * @param {{ materialId?: string }} [options]
 * @returns {{
 *   ok: boolean,
 *   model: Object|null,
 *   fallbackCriteria: string[],
 *   diagnostics: Object[]
 * }}
 */
function parseGuidedChecklist(rawBody, options) {
  var opts = options && typeof options === "object" ? options : {};
  var materialId = String(opts.materialId || "checklist").trim() || "checklist";
  var diagnostics = [];
  var payload = asObject(rawBody);
  if (!payload) {
    diagnostics.push({
      code: "GUIDED_CHECKLIST_INVALID_JSON",
      message: "Guided checklist body is not valid JSON object."
    });
    return { ok: false, model: null, fallbackCriteria: [], diagnostics: diagnostics };
  }

  var mode = nonEmptyString(payload.review_mode || payload.reviewMode || payload.mode)
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  if (mode && mode !== "guided_criteria" && mode !== "guided_review") {
    diagnostics.push({
      code: "GUIDED_CHECKLIST_UNKNOWN_MODE",
      message: "Unsupported review_mode for guided checklist."
    });
    return { ok: false, model: null, fallbackCriteria: [], diagnostics: diagnostics };
  }

  var sourceList = Array.isArray(payload.criteria) ? payload.criteria : [];
  if (!sourceList.length) {
    diagnostics.push({
      code: "GUIDED_CHECKLIST_EMPTY",
      message: "Guided checklist has no criteria array."
    });
    return { ok: false, model: null, fallbackCriteria: [], diagnostics: diagnostics };
  }

  var guidedCriteria = [];
  var fallbackCriteria = [];
  var i;
  for (i = 0; i < sourceList.length; i += 1) {
    if (guidedCriteria.length >= MAX_CRITERIA) {
      diagnostics.push({
        code: "GUIDED_CHECKLIST_TRUNCATED",
        message: "Guided checklist exceeded maximum of " + MAX_CRITERIA + " criteria."
      });
      break;
    }
    var normalized = normalizeGuidedCriterion(sourceList[i], guidedCriteria.length, materialId);
    if (!normalized) {
      var maybeStatement = nonEmptyString(
        sourceList[i] &&
          (sourceList[i].statement ||
            sourceList[i].criterion ||
            sourceList[i].question ||
            sourceList[i].prompt)
      );
      if (maybeStatement) fallbackCriteria.push(maybeStatement);
      diagnostics.push({
        code: "GUIDED_CHECKLIST_CRITERION_SKIPPED",
        message: "Incomplete guided criterion at index " + String(i) + " was skipped."
      });
      continue;
    }
    guidedCriteria.push(normalized);
    fallbackCriteria.push(normalized.statement);
  }

  if (guidedCriteria.length < MIN_GUIDED_CRITERIA) {
    diagnostics.push({
      code: "GUIDED_CHECKLIST_TOO_FEW",
      message:
        "Guided checklist requires at least " +
        MIN_GUIDED_CRITERIA +
        " complete criteria."
    });
    return {
      ok: false,
      model: null,
      fallbackCriteria: fallbackCriteria,
      diagnostics: diagnostics
    };
  }

  return {
    ok: true,
    model: {
      mode: "guided_review",
      criteria: guidedCriteria.map(function (row) {
        return row.statement;
      }),
      revisionInstruction: null,
      guidedCriteria: guidedCriteria
    },
    fallbackCriteria: fallbackCriteria,
    diagnostics: diagnostics
  };
}

/**
 * Resolve checklist model from material body + format.
 * JSON guided mode only when body_format is "json" (or body is already an object).
 *
 * @param {string|Object|null|undefined} rawBody
 * @param {string} bodyFormat
 * @param {{ materialId?: string, parseChecklistBody?: Function }} [options]
 * @returns {Object}
 */
function resolveChecklistModel(rawBody, bodyFormat, options) {
  var opts = options && typeof options === "object" ? options : {};
  var format = String(bodyFormat || "markdown").trim().toLowerCase();
  var isObjectBody = !!(rawBody && typeof rawBody === "object" && !Array.isArray(rawBody));
  var useGuided = format === "json" || isObjectBody;

  if (useGuided) {
    var guided = parseGuidedChecklist(rawBody, { materialId: opts.materialId });
    if (guided.ok) return guided.model;
    if (guided.fallbackCriteria && guided.fallbackCriteria.length) {
      return {
        mode: "simple",
        criteria: guided.fallbackCriteria.slice(0, MAX_CRITERIA),
        revisionInstruction: null,
        guidedCriteria: null
      };
    }
    return {
      mode: "simple",
      criteria: [],
      revisionInstruction: null,
      guidedCriteria: null
    };
  }

  var parseSimple =
    typeof opts.parseChecklistBody === "function" ? opts.parseChecklistBody : null;
  var simple = parseSimple
    ? parseSimple(typeof rawBody === "string" ? rawBody : "")
    : { criteria: [], revisionInstruction: null };
  return {
    mode: "simple",
    criteria: Array.isArray(simple.criteria) ? simple.criteria : [],
    revisionInstruction: simple.revisionInstruction || null,
    guidedCriteria: null
  };
}

function isGuidedChecklistPayload(rawBody) {
  var parsed = parseGuidedChecklist(rawBody, { materialId: "probe" });
  return parsed.ok;
}

module.exports = {
  DEFAULT_CONFIRMATION_LABEL: DEFAULT_CONFIRMATION_LABEL,
  MAX_CRITERIA: MAX_CRITERIA,
  MIN_GUIDED_CRITERIA: MIN_GUIDED_CRITERIA,
  MAX_FEATURES: MAX_FEATURES,
  parseGuidedChecklist: parseGuidedChecklist,
  resolveChecklistModel: resolveChecklistModel,
  isGuidedChecklistPayload: isGuidedChecklistPayload
};
