"use strict";

/**
 * Sprint 93 Gate 10 Slice 2.
 * Hydrate a canonical Assessment Pack page into a learner model.
 * Does not invent educational content or a new workspace architecture.
 * Constructed performance uses the existing written text-entry workspace.
 */

var diagnostic = require("./validate-input").diagnostic;
var canonical = require("../assessment-pack-canonical.js");

function readLearnerProse(value) {
  return canonical.learnerProse(value);
}

function proseError(path) {
  return diagnostic(
    "error",
    "learner_prose_unreadable",
    "A learner-facing field is an object without text, body, statement, stem, or assumption. It was not published.",
    { path: path }
  );
}

/**
 * One stored E4 forward_orientation sentence addresses a design proposal
 * the learner has not written yet. Equality is the whole sentence.
 * Other uses of "design proposal" stay as authored.
 */
var PREMATURE_DESIGN_PROPOSAL_FORWARD =
  "In your design proposal, identify the comparison condition and explain why it would provide a more credible counterfactual. Also explain which differences between groups would still need attention.";
var FORTHCOMING_JUDGEMENT_FORWARD =
  "When you write your methodological judgement, identify the comparison condition and explain why it would provide a more credible counterfactual. Also explain which differences between groups would still need attention.";

/**
 * The stored E6 forward orientation asks the learner to compare an original
 * and a revised judgement. Revision replaces the draft in place, so both
 * versions are not on the page. Equality is the whole paragraph.
 */
var COMPARE_BOTH_VERSIONS_FORWARD =
  "Compare your original and revised judgements. Notice whether your revision improved the precision of the causal conclusion, the prioritisation of rival explanations or the connection between design choices and validity threats. Your response is not being automatically judged; the value of this stage lies in making your reasoning visible to yourself and improving one consequential part of it. Use the uncertainty that remains to consider what additional evidence would most change your confidence.";
var REFLECT_ON_CHANGES_FORWARD =
  "Reflect on the changes you made. Notice whether your revision improved the precision of the causal conclusion, the prioritisation of rival explanations or the connection between design choices and validity threats. Your response is not being automatically judged; the value of this stage lies in making your reasoning visible to yourself and improving one consequential part of it. Use the uncertainty that remains to consider what additional evidence would most change your confidence.";

function publishForwardOrientation(text) {
  if (text === PREMATURE_DESIGN_PROPOSAL_FORWARD) return FORTHCOMING_JUDGEMENT_FORWARD;
  if (text === COMPARE_BOTH_VERSIONS_FORWARD) return REFLECT_ON_CHANGES_FORWARD;
  return text;
}

function mapDeterminateItem(item, path, errors) {
  var prompt = item && item.prompt && typeof item.prompt === "object" ? item.prompt : {};
  var judgement = item && item.judgement && typeof item.judgement === "object" ? item.judgement : {};
  var form = String((item && item.form) || "").trim();
  var note = readLearnerProse(item && item.feedback_note);
  if (!note.ok) errors.push(proseError(path + ".feedback_note"));
  var stem = readLearnerProse(prompt.stem);
  if (!stem.ok) errors.push(proseError(path + ".prompt.stem"));
  var mapped = {
    id: String((item && item.item_id) || "").trim(),
    item_id: String((item && item.item_id) || "").trim(),
    item_type: form,
    form: form,
    stem: stem.text,
    options: prompt.options,
    prompt: prompt,
    judgement: judgement,
    feedback_note: note.text,
    mapped_learning_outcomes: Array.isArray(item && item.mapped_learning_outcome_ids)
      ? item.mapped_learning_outcome_ids
      : [],
    representation: item && item.representation ? item.representation : null,
    auto_checkable: true
  };
  if (form === "single_answer_mcq") mapped.correct_answer = judgement.correct_answer;
  if (form === "multiple_answer_mcq") mapped.correct_answers = judgement.correct_answers;
  if (form === "ordering") mapped.correct_order = judgement.correct_order;
  return mapped;
}

function readMaterials(materials, path, errors) {
  return (Array.isArray(materials) ? materials : []).map(function (material, index) {
    if (!material || typeof material !== "object") return material;
    var body = readLearnerProse(material.body);
    if (material.body != null && !body.ok) {
      errors.push(proseError(path + ".materials[" + index + "].body"));
    }
    return Object.assign({}, material, { body: body.text, attention: "" });
  });
}

function isPlainObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function firstNonEmptyString(candidates) {
  var i;
  for (i = 0; i < candidates.length; i += 1) {
    if (typeof candidates[i] === "string" && candidates[i].trim()) {
      return candidates[i].trim();
    }
  }
  return "";
}

function looksLikeStructuredStimulus(value) {
  if (!isPlainObject(value)) return false;
  return (
    value.scenario != null ||
    Array.isArray(value.alternatives) ||
    Array.isArray(value.evidence) ||
    value.evidence_boundary != null
  );
}

function stimulusStructureError(path, message) {
  return diagnostic("error", "assessment_stimulus_invalid", message, { path: path });
}

function stimulusConflictError(path) {
  return diagnostic(
    "error",
    "assessment_stimulus_conflict",
    "Both elicitation.stimulus prose and delivery.stimulus structured case material are present. Resolve to one learner-facing stimulus so required case information is not dropped.",
    { path: path }
  );
}

/**
 * Normalise a structured assessment stimulus.
 * Expected shape: scenario, alternatives[], evidence[], optional title / evidence_boundary.
 */
function normaliseStructuredStimulus(value, path, errors) {
  if (!isPlainObject(value)) {
    errors.push(stimulusStructureError(path, "delivery.stimulus must be a structured object when used as case material."));
    return null;
  }
  var title = firstNonEmptyString([value.title]);
  var scenario = firstNonEmptyString([value.scenario]);
  if (!scenario) {
    errors.push(stimulusStructureError(path + ".scenario", "Structured stimulus requires a non-empty scenario."));
  }
  var alternatives = Array.isArray(value.alternatives) ? value.alternatives : null;
  if (!alternatives || !alternatives.length) {
    errors.push(
      stimulusStructureError(path + ".alternatives", "Structured stimulus requires a non-empty alternatives list.")
    );
    alternatives = [];
  }
  var evidence = Array.isArray(value.evidence) ? value.evidence : null;
  if (!evidence || !evidence.length) {
    errors.push(stimulusStructureError(path + ".evidence", "Structured stimulus requires a non-empty evidence list."));
    evidence = [];
  }
  var normalisedAlternatives = alternatives.map(function (row, index) {
    var rowPath = path + ".alternatives[" + index + "]";
    if (!isPlainObject(row)) {
      errors.push(stimulusStructureError(rowPath, "Each alternative must be an object."));
      return null;
    }
    var id = firstNonEmptyString([row.id, row.key, row.alternative_id, row.option_id]);
    var label = firstNonEmptyString([row.label, row.name, row.title, row.option]);
    var description = firstNonEmptyString([row.description, row.text, row.body, row.summary]);
    if (!label) {
      errors.push(stimulusStructureError(rowPath + ".label", "Each alternative needs a label."));
    }
    if (!description) {
      errors.push(stimulusStructureError(rowPath + ".description", "Each alternative needs a description."));
    }
    return { id: id, label: label, description: description };
  });
  var normalisedEvidence = evidence.map(function (row, index) {
    var rowPath = path + ".evidence[" + index + "]";
    if (!isPlainObject(row)) {
      errors.push(stimulusStructureError(rowPath, "Each evidence item must be an object."));
      return null;
    }
    var id = firstNonEmptyString([row.id, row.evidence_id, row.key]);
    var heading = firstNonEmptyString([row.heading, row.title, row.label]);
    var information = firstNonEmptyString([row.information, row.body, row.text, row.content]);
    var qualification = firstNonEmptyString([
      row.qualification,
      row.caveat,
      row.limitation,
      row.note
    ]);
    if (!heading) {
      errors.push(stimulusStructureError(rowPath + ".heading", "Each evidence item needs a heading."));
    }
    if (!information) {
      errors.push(stimulusStructureError(rowPath + ".information", "Each evidence item needs information."));
    }
    if (!qualification) {
      errors.push(
        stimulusStructureError(rowPath + ".qualification", "Each evidence item needs a qualification.")
      );
    }
    return { id: id, heading: heading, information: information, qualification: qualification };
  });
  var evidenceBoundary = firstNonEmptyString([value.evidence_boundary, value.boundary]);
  if (
    !scenario ||
    !normalisedAlternatives.length ||
    normalisedAlternatives.some(function (row) {
      return !row || !row.label || !row.description;
    }) ||
    !normalisedEvidence.length ||
    normalisedEvidence.some(function (row) {
      return !row || !row.heading || !row.information || !row.qualification;
    })
  ) {
    return null;
  }
  return {
    title: title,
    scenario: scenario,
    alternatives: normalisedAlternatives,
    evidence: normalisedEvidence,
    evidenceBoundary: evidenceBoundary
  };
}

/**
 * Resolve elicitation-level prose stimulus and optional delivery.stimulus.
 * Structured delivery case material is preserved; conflicts fail closed.
 */
function resolveElicitationStimulus(elicitation, delivery, path, errors) {
  var elicitationStimulus = readLearnerProse(elicitation.stimulus);
  if (elicitation.stimulus != null && !elicitationStimulus.ok) {
    errors.push(proseError(path + ".stimulus"));
  }
  var deliveryStimulus = delivery && delivery.stimulus != null ? delivery.stimulus : null;
  var structured = null;
  var deliveryProse = { ok: true, text: "" };

  if (deliveryStimulus != null) {
    if (looksLikeStructuredStimulus(deliveryStimulus)) {
      structured = normaliseStructuredStimulus(deliveryStimulus, path + ".delivery.stimulus", errors);
    } else {
      deliveryProse = readLearnerProse(deliveryStimulus);
      if (!deliveryProse.ok) {
        errors.push(proseError(path + ".delivery.stimulus"));
      }
    }
  }

  if (structured && elicitationStimulus.text) {
    errors.push(stimulusConflictError(path));
    return { prose: "", structured: null };
  }
  if (structured) {
    return { prose: "", structured: structured };
  }
  if (elicitationStimulus.text) {
    return { prose: elicitationStimulus.text, structured: null };
  }
  return { prose: deliveryProse.text || "", structured: null };
}

function mapElicitation(elicitation, index, errors) {
  var delivery = elicitation.delivery || {};
  var formative = elicitation.formative_return || {};
  var path = "assessment_evidence.elicitations[" + index + "]";
  var instructions = readLearnerProse(elicitation.instructions);
  if (elicitation.instructions != null && !instructions.ok) {
    errors.push(proseError(path + ".instructions"));
  }
  var resolvedStimulus = resolveElicitationStimulus(elicitation, delivery, path, errors);
  var evidenceAsk = readLearnerProse(elicitation.evidence_ask);
  if (!evidenceAsk.ok) errors.push(proseError(path + ".evidence_ask"));
  var forward = readLearnerProse(formative.forward_orientation);
  if (formative.forward_orientation != null && !forward.ok) {
    errors.push(proseError(path + ".formative_return.forward_orientation"));
  }
  var revisionPrompt = formative.revision ? readLearnerProse(formative.revision.prompt) : { ok: true, text: "" };
  if (formative.revision && formative.revision.prompt != null && !revisionPrompt.ok) {
    errors.push(proseError(path + ".formative_return.revision.prompt"));
  }
  var base = {
    elicitationId: String(elicitation.elicitation_id || "").trim(),
    order: elicitation.order,
    instructions: instructions.text,
    stimulus: resolvedStimulus.prose,
    structuredStimulus: resolvedStimulus.structured,
    materials: readMaterials(formative.materials, path + ".formative_return", errors),
    forwardOrientation: publishForwardOrientation(forward.text),
    revision:
      formative.revision && formative.revision.offered
        ? { offered: true, prompt: revisionPrompt.text }
        : null
  };
  if (delivery.kind === "constructed_performance") {
    var workspace = delivery.response_workspace || {};
    var prompt = canonical.readConstructedLearnerPrompt(delivery.prompt);
    if (!prompt.ok || !prompt.text) errors.push(proseError(path + ".delivery.prompt"));
    var guidance = readLearnerProse(workspace.guidance);
    if (workspace.guidance != null && !guidance.ok) {
      errors.push(proseError(path + ".delivery.response_workspace.guidance"));
    }
    return Object.assign(base, {
      kind: "constructed",
      promptTitle: prompt.title,
      promptContext: prompt.context,
      prompt: prompt.task,
      responseExpectation: prompt.responseExpectation,
      suggestedLength: prompt.suggestedLength,
      indicativeTime: prompt.indicativeTime,
      guidance: guidance.text,
      workspaceKind: "text_entry"
    });
  }
  return Object.assign(base, {
    kind: "determinate",
    items: (Array.isArray(delivery.items) ? delivery.items : []).map(function (item, itemIndex) {
      return mapDeterminateItem(item, path + ".delivery.items[" + itemIndex + "]", errors);
    })
  });
}

/**
 * List elicitations from a page or stage artefact without inventing structure.
 * @param {Object} artefact
 * @returns {{ elicitations: Object[], pathPrefix: string }}
 */
function listAssessmentElicitations(artefact) {
  if (!artefact || typeof artefact !== "object" || Array.isArray(artefact)) {
    return { elicitations: [], pathPrefix: "" };
  }
  if (
    artefact.assessment_evidence &&
    typeof artefact.assessment_evidence === "object" &&
    Array.isArray(artefact.assessment_evidence.elicitations)
  ) {
    return {
      elicitations: artefact.assessment_evidence.elicitations,
      pathPrefix: "assessment_evidence.elicitations"
    };
  }
  if (Array.isArray(artefact.elicitations)) {
    return { elicitations: artefact.elicitations, pathPrefix: "elicitations" };
  }
  return { elicitations: [], pathPrefix: "" };
}

/**
 * Authoring-boundary check for structured delivery.stimulus.
 * Reuses normaliseStructuredStimulus (same schema and aliases as hydration).
 * Skips packs/elicitations without structured stimulus. Does not invent content.
 *
 * @param {Object} artefact page, assessment_evidence_elicitation, or formative_return stage JSON
 * @returns {{ ok: boolean, errors: Object[] }}
 */
function validateAssessmentPackStructuredStimuli(artefact) {
  var listed = listAssessmentElicitations(artefact);
  var errors = [];
  listed.elicitations.forEach(function (elicitation, index) {
    if (!elicitation || typeof elicitation !== "object") return;
    var path = listed.pathPrefix + "[" + index + "]";
    var delivery = elicitation.delivery && typeof elicitation.delivery === "object" ? elicitation.delivery : {};
    var deliveryStimulus = delivery.stimulus != null ? delivery.stimulus : null;
    if (deliveryStimulus == null) return;
    if (!looksLikeStructuredStimulus(deliveryStimulus)) return;
    var elicitationStimulus = readLearnerProse(elicitation.stimulus);
    if (elicitationStimulus.text) {
      errors.push(stimulusConflictError(path));
      return;
    }
    normaliseStructuredStimulus(deliveryStimulus, path + ".delivery.stimulus", errors);
  });
  return { ok: errors.length === 0, errors: errors };
}

/**
 * Format structured-stimulus diagnostics for capture UI (include paths).
 * @param {Object[]} errors
 * @returns {string[]}
 */
function formatStructuredStimulusCaptureErrors(errors) {
  return (Array.isArray(errors) ? errors : []).map(function (error) {
    var path = error && error.path ? String(error.path) + ": " : "";
    return path + String((error && (error.message || error.code)) || "invalid structured stimulus");
  });
}

/**
 * @param {Object} page
 * @returns {null|{ok:boolean, errors:Object[], pack:Object|null}}
 * null when the page is not a canonical Assessment Pack payload.
 */
function hydrateAssessmentEvidence(page) {
  if (!page || typeof page !== "object") return null;
  var productId = String(page.product_id || "").trim();
  var hasEvidence = page.assessment_evidence && typeof page.assessment_evidence === "object";
  if (productId !== "assessment_pack" && !hasEvidence) return null;

  var validated = canonical.validateAssessmentPackCanonicalPage(page);
  if (!validated.ok) {
    return {
      ok: false,
      errors: validated.errors.map(function (error) {
        return diagnostic(
          "error",
          String(error.code || "ASSESSMENT_EVIDENCE_INVALID"),
          String(error.message || "Assessment evidence cannot be rendered."),
          { path: error.path || "" }
        );
      }),
      pack: null
    };
  }

  var evidence = page.assessment_evidence;
  var context = evidence.learner_context || {};
  var preferences = evidence.delivery_preferences || {};
  var proseErrors = [];
  (Array.isArray(context.entry_assumptions) ? context.entry_assumptions : []).forEach(function (item, index) {
    var read = readLearnerProse(item);
    if (!read.ok) {
      proseErrors.push(proseError("assessment_evidence.learner_context.entry_assumptions[" + index + "]"));
    }
  });
  var bringForward = (Array.isArray(context.bring_forward) ? context.bring_forward : []).map(function (item, index) {
    if (!item || typeof item !== "object") return null;
    var what = readLearnerProse(item.what);
    var how = readLearnerProse(item.how_used);
    if (item.what != null && !what.ok) {
      proseErrors.push(proseError("assessment_evidence.learner_context.bring_forward[" + index + "].what"));
    }
    if (item.how_used != null && !how.ok) {
      proseErrors.push(proseError("assessment_evidence.learner_context.bring_forward[" + index + "].how_used"));
    }
    return { what: what.text, how_used: how.text };
  });
  var units = (Array.isArray(evidence.elicitations) ? evidence.elicitations : [])
    .slice()
    .sort(function (a, b) {
      return Number(a.order) - Number(b.order);
    })
    .map(function (elicitation, index) {
      return mapElicitation(elicitation, index, proseErrors);
    });
  var packForward = canonical.readPackForwardOrientation(evidence.pack_forward_orientation);
  if (!packForward.ok) proseErrors.push(proseError("assessment_evidence.pack_forward_orientation"));
  if (proseErrors.length) {
    return { ok: false, errors: proseErrors, pack: null };
  }
  return {
    ok: true,
    errors: [],
    pack: {
      bringForward: bringForward,
      feedbackTiming: String(preferences.feedback_timing || "per_component").trim() || "per_component",
      units: units,
      packForward: packForward.text,
      outputSpecification:
        evidence.output_specification && typeof evidence.output_specification === "object"
          ? evidence.output_specification
          : null
    }
  };
}

module.exports = {
  hydrateAssessmentEvidence: hydrateAssessmentEvidence,
  validateAssessmentPackStructuredStimuli: validateAssessmentPackStructuredStimuli,
  formatStructuredStimulusCaptureErrors: formatStructuredStimulusCaptureErrors,
  looksLikeStructuredStimulus: looksLikeStructuredStimulus
};
