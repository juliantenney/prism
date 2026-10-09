/**
 * Sprint 93 Gate 10 Slice 1 — Assessment Pack canonical validation.
 * Structural fail-closed checks from Gate 9. Does not render, publish, or call a model.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.PRISM_ASSESSMENT_PACK_CANONICAL = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var ROLES = { R1: true, R2: true, R1_and_R2: true };
  var CLASSES = { determinate: true, non_determinate: true };
  var SUMMATIVE_KEYS = {
    grade: true,
    grades: true,
    pass_fail: true,
    passfail: true,
    certification: true,
    summative: true,
    score_threshold: true,
    mastery_gate: true
  };

  function formsApi() {
    if (typeof require === "function") {
      try {
        return require("./assessment-component-forms.js");
      } catch (err) {}
    }
    var host = typeof globalThis !== "undefined" ? globalThis : this;
    return host && host.PRISM_ASSESSMENT_COMPONENT_FORMS ? host.PRISM_ASSESSMENT_COMPONENT_FORMS : null;
  }

  var LEARNER_PROSE_KEYS = ["text", "body", "statement", "stem", "assumption"];

  function text(value) {
    return String(value == null ? "" : value).trim();
  }

  /**
   * Learner-facing prose. A string is used as written.
   * An object is used only when one of the closed semantic keys holds that prose.
   * Other objects are unreadable. Callers must not stringify them.
   */
  function learnerProse(value) {
    if (typeof value === "string") return { ok: true, text: value.trim() };
    if (value == null) return { ok: true, text: "" };
    if (typeof value !== "object" || Array.isArray(value)) return { ok: false, text: "" };
    var i;
    for (i = 0; i < LEARNER_PROSE_KEYS.length; i += 1) {
      var candidate = value[LEARNER_PROSE_KEYS[i]];
      if (typeof candidate === "string" && candidate.trim()) {
        return { ok: true, text: candidate.trim() };
      }
    }
    return { ok: false, text: "" };
  }

  function rejectUnreadableLearnerProse(value, path, errors) {
    var read = learnerProse(value);
    if (value != null && value !== "" && !read.ok) {
      push(
        errors,
        "learner_prose_unreadable",
        path,
        "A learner-facing field is an object without text, body, statement, stem, or assumption."
      );
    }
    return read;
  }

  function isObject(value) {
    return !!value && typeof value === "object" && !Array.isArray(value);
  }

  var CONSTRUCTED_PROMPT_KEYS = [
    "title",
    "context",
    "task",
    "response_expectation",
    "suggested_length",
    "indicative_time"
  ];

  /**
   * Constructed delivery.prompt.
   * A string, or a single closed prose key, is the learner task.
   * The authored E6 brief is accepted only as that exact six-string object.
   * Any other object stays unreadable.
   */
  function readConstructedLearnerPrompt(value) {
    var empty = {
      ok: true,
      text: "",
      title: "",
      context: "",
      task: "",
      responseExpectation: "",
      suggestedLength: "",
      indicativeTime: ""
    };
    if (typeof value === "string") {
      var trimmed = value.trim();
      return Object.assign({}, empty, { text: trimmed, task: trimmed });
    }
    if (value == null) return empty;
    if (!isObject(value)) return { ok: false, text: "" };
    var keys = Object.keys(value);
    var exactBrief =
      keys.length === CONSTRUCTED_PROMPT_KEYS.length &&
      CONSTRUCTED_PROMPT_KEYS.every(function (key) {
        return typeof value[key] === "string" && value[key].trim();
      });
    if (exactBrief) {
      var task = value.task.trim();
      return {
        ok: true,
        text: task,
        title: value.title.trim(),
        context: value.context.trim(),
        task: task,
        responseExpectation: value.response_expectation.trim(),
        suggestedLength: value.suggested_length.trim(),
        indicativeTime: value.indicative_time.trim()
      };
    }
    var prose = learnerProse(value);
    if (prose.ok && prose.text && keys.length === 1 && LEARNER_PROSE_KEYS.indexOf(keys[0]) !== -1) {
      return Object.assign({}, empty, { text: prose.text, task: prose.text });
    }
    return { ok: false, text: "" };
  }

  function push(errors, code, path, message) {
    errors.push({ code: code, path: path, message: message });
  }

  function supportedForms() {
    var api = formsApi();
    return api && Array.isArray(api.SUPPORTED_FORMS) ? api.SUPPORTED_FORMS : [];
  }

  function hasSummativeKey(value, path, errors, depth) {
    if (!isObject(value) || depth > 4) return;
    Object.keys(value).forEach(function (key) {
      if (SUMMATIVE_KEYS[String(key).toLowerCase()]) {
        push(errors, "summative_semantics", path + "." + key, "Assessment Pack is formative only.");
      }
    });
  }

  function forwardText(value) {
    if (typeof value === "string") return text(value);
    if (isObject(value)) return text(value.text || value.body);
    return "";
  }

  function judgementPresent(form, judgement) {
    if (!isObject(judgement)) return false;
    if (form === "single_answer_mcq") return !!text(judgement.correct_answer);
    if (form === "multiple_answer_mcq") {
      return Array.isArray(judgement.correct_answers) && judgement.correct_answers.length > 0;
    }
    if (form === "ordering") {
      return Array.isArray(judgement.correct_order) && judgement.correct_order.length > 0;
    }
    if (form === "classification") {
      return isObject(judgement.assignments) && Object.keys(judgement.assignments).length > 0;
    }
    if (form === "matching") {
      return isObject(judgement.pairs) && Object.keys(judgement.pairs).length > 0;
    }
    return false;
  }

  function validatePurpose(purpose, path, errors) {
    if (!isObject(purpose)) {
      push(errors, "purpose_required", path, "purpose is required.");
      return;
    }
    if (!ROLES[text(purpose.role)]) {
      push(errors, "purpose_role_invalid", path + ".role", "role must be R1, R2, or R1_and_R2.");
    }
    ["visibility_claim", "stop_rationale", "forward_intent"].forEach(function (field) {
      if (!text(purpose[field])) {
        push(errors, "purpose_field_required", path + "." + field, field + " is required.");
      }
    });
  }

  function validateLearnerContext(context, path, errors) {
    if (!isObject(context)) {
      push(errors, "learner_context_required", path, "learner_context is required.");
      return;
    }
    if (context.depends_on_prior_work === true) {
      var rows = Array.isArray(context.bring_forward) ? context.bring_forward : [];
      var usable = rows.filter(function (row) {
        return isObject(row) && text(row.what) && text(row.how_used);
      });
      if (!usable.length) {
        push(
          errors,
          "bring_forward_required",
          path + ".bring_forward",
          "Prior-work dependence requires bring_forward entries with what and how_used."
        );
      }
    }
    if (context.entry_assumptions != null && !Array.isArray(context.entry_assumptions)) {
      push(errors, "entry_assumptions_invalid", path + ".entry_assumptions", "entry_assumptions must be an array.");
    } else if (Array.isArray(context.entry_assumptions)) {
      context.entry_assumptions.forEach(function (item, index) {
        rejectUnreadableLearnerProse(item, path + ".entry_assumptions[" + index + "]", errors);
      });
    }
    if (Array.isArray(context.bring_forward)) {
      context.bring_forward.forEach(function (row, index) {
        if (!isObject(row)) return;
        rejectUnreadableLearnerProse(row.what, path + ".bring_forward[" + index + "].what", errors);
        rejectUnreadableLearnerProse(row.how_used, path + ".bring_forward[" + index + "].how_used", errors);
      });
    }
  }

  function validateAutoItems(delivery, path, errors) {
    var items = Array.isArray(delivery.items) ? delivery.items : [];
    if (!items.length) {
      push(errors, "determinate_judgement_missing", path + ".items", "Determinate delivery needs auto-checkable items.");
      return false;
    }
    var forms = supportedForms();
    var ok = true;
    items.forEach(function (item, index) {
      var itemPath = path + ".items[" + index + "]";
      var form = text(item && item.form);
      if (forms.length && forms.indexOf(form) === -1) {
        ok = false;
        push(errors, "item_form_invalid", itemPath + ".form", "Item form must be one of the five determinate forms.");
      }
      if (!judgementPresent(form, item && item.judgement) || (item && item.judgement && item.judgement.auto_checkable !== true && item.auto_checkable !== true)) {
        ok = false;
        push(
          errors,
          "determinate_judgement_missing",
          itemPath + ".judgement",
          "Each determinate item needs authored deterministic judgement."
        );
      }
      if (item && item.prompt) {
        rejectUnreadableLearnerProse(item.prompt.stem, itemPath + ".prompt.stem", errors);
      }
      if (item && item.feedback_note != null) {
        rejectUnreadableLearnerProse(item.feedback_note, itemPath + ".feedback_note", errors);
      }
    });
    return ok;
  }

  function impliesRuntimeJudgement(delivery) {
    if (!isObject(delivery)) return false;
    if (delivery.kind === "auto_checkable_items") return true;
    if (Array.isArray(delivery.items) && delivery.items.length) return true;
    if (isObject(delivery.judgement)) return true;
    if (delivery.auto_checkable === true || delivery.score != null || delivery.model_score != null) return true;
    if (delivery.runtime_ai === true || delivery.automatic_marking === true) return true;
    return false;
  }

  function validateDelivery(elicitation, path, errors) {
    var delivery = elicitation.delivery;
    var epistemic = text(elicitation.epistemic_class);
    if (!isObject(delivery) || (delivery.kind !== "auto_checkable_items" && delivery.kind !== "constructed_performance")) {
      push(errors, "delivery_kind_invalid", path + ".delivery.kind", "delivery.kind must be auto_checkable_items or constructed_performance.");
      return;
    }
    if (epistemic === "determinate") {
      if (delivery.kind !== "auto_checkable_items") {
        push(
          errors,
          "determinate_delivery_mismatch",
          path + ".delivery.kind",
          "A determinate unit uses auto_checkable_items."
        );
      } else {
        validateAutoItems(delivery, path + ".delivery", errors);
      }
    }
    if (epistemic === "non_determinate") {
      if (delivery.kind !== "constructed_performance" || impliesRuntimeJudgement(delivery)) {
        push(
          errors,
          "non_determinate_runtime_judgement",
          path + ".delivery",
          "A non-determinate unit must not carry runtime quality judgement."
        );
      }
      var workspace = delivery.response_workspace;
      var intention = isObject(workspace) ? workspace.intention : "";
      var promptRead = readConstructedLearnerPrompt(delivery.prompt);
      if (delivery.prompt != null && delivery.prompt !== "" && !promptRead.ok) {
        push(
          errors,
          "learner_prose_unreadable",
          path + ".delivery.prompt",
          "A learner-facing field is an object without text, body, statement, stem, or assumption."
        );
      }
      if (isObject(workspace) && workspace.guidance != null) {
        rejectUnreadableLearnerProse(workspace.guidance, path + ".delivery.response_workspace.guidance", errors);
      }
      if (
        promptRead.ok &&
        (!promptRead.text || !isObject(workspace) || typeof intention !== "string" || !intention.trim())
      ) {
        push(
          errors,
          "constructed_performance_incomplete",
          path + ".delivery",
          "Constructed performance needs a learner-facing prompt and a string response_workspace.intention."
        );
      }
    }
  }

  function explanatoryFeedbackPresent(elicitation) {
    var materials =
      elicitation.formative_return && Array.isArray(elicitation.formative_return.materials)
        ? elicitation.formative_return.materials
        : [];
    if (
      materials.some(function (row) {
        return isObject(row) && text(row.material_id) && learnerProse(row.body).text;
      })
    ) {
      return true;
    }
    var items =
      elicitation.delivery && Array.isArray(elicitation.delivery.items) ? elicitation.delivery.items : [];
    return items.some(function (item) {
      return learnerProse(item && item.feedback_note).text;
    });
  }

  function validateFormativeReturn(elicitation, path, errors) {
    var formative = elicitation.formative_return;
    if (!isObject(formative)) {
      push(errors, "formative_return_required", path + ".formative_return", "formative_return is required.");
      return;
    }
    if (!forwardText(formative.forward_orientation)) {
      push(
        errors,
        "forward_orientation_required",
        path + ".formative_return.forward_orientation",
        "Unit forward orientation is required."
      );
    } else if (typeof formative.forward_orientation !== "string") {
      rejectUnreadableLearnerProse(
        formative.forward_orientation,
        path + ".formative_return.forward_orientation",
        errors
      );
    }
    if (formative.revision && formative.revision.prompt != null) {
      rejectUnreadableLearnerProse(
        formative.revision.prompt,
        path + ".formative_return.revision.prompt",
        errors
      );
    }
    var epistemic = text(elicitation.epistemic_class);
    var materials = Array.isArray(formative.materials) ? formative.materials : [];
    materials.forEach(function (row, index) {
      if (!isObject(row) || row.body == null) return;
      rejectUnreadableLearnerProse(row.body, path + ".formative_return.materials[" + index + "].body", errors);
    });
    if (epistemic === "non_determinate") {
      var usable = materials.filter(function (row) {
        return isObject(row) && text(row.material_id) && learnerProse(row.body).text;
      });
      if (!usable.length) {
        push(
          errors,
          "self_evaluation_materials_required",
          path + ".formative_return.materials",
          "A non-determinate unit needs at least one self-evaluation material."
        );
      }
    }
    if (epistemic === "determinate" && !explanatoryFeedbackPresent(elicitation)) {
      push(
        errors,
        "explanatory_feedback_required",
        path + ".formative_return",
        "A determinate unit needs explanatory feedback."
      );
    }
  }

  function validateElicitation(elicitation, index, errors, options) {
    var path = "elicitations[" + index + "]";
    if (!isObject(elicitation)) {
      push(errors, "elicitation_invalid", path, "Each elicitation must be an object.");
      return;
    }
    if (!text(elicitation.elicitation_id)) {
      push(errors, "elicitation_id_required", path + ".elicitation_id", "elicitation_id is required.");
    }
    if (elicitation.order == null || !isFinite(Number(elicitation.order))) {
      push(errors, "elicitation_order_required", path + ".order", "order is required.");
    }
    var evidenceAsk = rejectUnreadableLearnerProse(elicitation.evidence_ask, path + ".evidence_ask", errors);
    if (evidenceAsk.ok && !evidenceAsk.text) {
      push(errors, "evidence_ask_required", path + ".evidence_ask", "evidence_ask is required.");
    }
    if (elicitation.instructions != null) {
      rejectUnreadableLearnerProse(elicitation.instructions, path + ".instructions", errors);
    }
    if (elicitation.stimulus != null) {
      rejectUnreadableLearnerProse(elicitation.stimulus, path + ".stimulus", errors);
    }
    if (!CLASSES[text(elicitation.epistemic_class)]) {
      push(
        errors,
        "epistemic_class_invalid",
        path + ".epistemic_class",
        "epistemic_class must be determinate or non_determinate."
      );
    }
    validateDelivery(elicitation, path, errors);
    if (!options || options.includeFormativeReturn !== false) {
      validateFormativeReturn(elicitation, path, errors);
    } else if (isObject(elicitation.formative_return)) {
      push(
        errors,
        "formative_return_too_early",
        path + ".formative_return",
        "Formative return is authored after epistemic class is frozen."
      );
    }
  }

  var OUTPUT_SPEC_KEYS = {
    specification_id: true,
    artefact_title: true,
    audience: true,
    purpose: true,
    action_label: true,
    missing_response_text: true,
    sections: true
  };
  var OUTPUT_SECTION_KEYS = {
    section_id: true,
    order: true,
    heading: true,
    contributions: true
  };
  var OUTPUT_CONTRIBUTION_KEYS = {
    contribution_id: true,
    label: true,
    elicitation_id: true,
    item_id: true,
    response_part: true,
    missing_response_text: true
  };
  var OUTPUT_RESPONSE_PARTS = {
    selected_options: true,
    check_result: true,
    response_text: true,
    identified_weakness: true
  };
  var LEGACY_SUMMARY_LABEL = "Summarise this assessment";

  function requiredSpecString(value) {
    return typeof value === "string" && !!value.trim();
  }

  function rejectUnsupportedOutputKeys(object, allowed, path, errors) {
    Object.keys(object).forEach(function (key) {
      if (!allowed[key]) {
        push(errors, "output_unsupported_key", path + "." + key, "Unsupported output specification field.");
      }
    });
  }

  function elicitationIndex(elicitations) {
    var byId = {};
    (Array.isArray(elicitations) ? elicitations : []).forEach(function (row) {
      var id = text(row && row.elicitation_id);
      if (!id || byId[id]) return;
      byId[id] = row;
    });
    return byId;
  }

  function itemIdSet(elicitation) {
    var items =
      elicitation && elicitation.delivery && Array.isArray(elicitation.delivery.items)
        ? elicitation.delivery.items
        : [];
    var ids = {};
    items.forEach(function (item) {
      var id = text(item && (item.item_id || item.id));
      if (id) ids[id] = true;
    });
    return ids;
  }

  function revisionOffered(elicitation) {
    var revision = elicitation && elicitation.formative_return && elicitation.formative_return.revision;
    return !!(revision && revision.offered === true);
  }

  function validateOutputContribution(contribution, index, sectionPath, elicitationById, seenContributionIds, seenSources, errors) {
    var path = sectionPath + ".contributions[" + index + "]";
    if (!isObject(contribution)) {
      push(errors, "output_contribution_invalid", path, "Each output contribution must be an object.");
      return;
    }
    rejectUnsupportedOutputKeys(contribution, OUTPUT_CONTRIBUTION_KEYS, path, errors);
    if (!requiredSpecString(contribution.contribution_id)) {
      push(errors, "output_contribution_field_required", path + ".contribution_id", "contribution_id is required.");
    } else if (seenContributionIds[contribution.contribution_id.trim()]) {
      push(errors, "output_duplicate_id", path + ".contribution_id", "contribution_id must be unique.");
    } else {
      seenContributionIds[contribution.contribution_id.trim()] = true;
    }
    if (!requiredSpecString(contribution.label)) {
      push(errors, "output_contribution_field_required", path + ".label", "label is required.");
    }
    if (!requiredSpecString(contribution.elicitation_id)) {
      push(errors, "output_contribution_field_required", path + ".elicitation_id", "elicitation_id is required.");
    }
    if (contribution.missing_response_text != null && !requiredSpecString(contribution.missing_response_text)) {
      push(
        errors,
        "output_contribution_field_required",
        path + ".missing_response_text",
        "missing_response_text must be a non-empty string when present."
      );
    }
    var part = text(contribution.response_part);
    if (!OUTPUT_RESPONSE_PARTS[part]) {
      push(
        errors,
        "output_response_part_invalid",
        path + ".response_part",
        "response_part must be selected_options, check_result, response_text, or identified_weakness."
      );
    }
    var elicitationId = requiredSpecString(contribution.elicitation_id) ? contribution.elicitation_id.trim() : "";
    var itemId = requiredSpecString(contribution.item_id) ? contribution.item_id.trim() : "";
    var sourceKey = elicitationId + "\n" + itemId + "\n" + part;
    if (elicitationId && part && seenSources[sourceKey]) {
      push(
        errors,
        "output_duplicate_source",
        path,
        "A section cannot cite the same elicitation response twice."
      );
    } else if (elicitationId && part) {
      seenSources[sourceKey] = true;
    }
    if (!elicitationId || !OUTPUT_RESPONSE_PARTS[part]) return;
    var elicitation = elicitationById[elicitationId];
    if (!elicitation) {
      push(errors, "output_elicitation_unknown", path + ".elicitation_id", "elicitation_id does not match an elicitation.");
      return;
    }
    var delivery = elicitation.delivery || {};
    var determinateItem = text(elicitation.epistemic_class) === "determinate" && delivery.kind === "auto_checkable_items";
    var constructed = delivery.kind === "constructed_performance";
    if (determinateItem) {
      if (part !== "selected_options" && part !== "check_result") {
        push(
          errors,
          "output_response_part_incompatible",
          path + ".response_part",
          "A determinate item can supply selected_options or check_result."
        );
        return;
      }
      if (!itemId) {
        push(errors, "output_item_required", path + ".item_id", "item_id is required for an auto-checkable item.");
        return;
      }
      if (!itemIdSet(elicitation)[itemId]) {
        push(errors, "output_item_unknown", path + ".item_id", "item_id does not match an item in that elicitation.");
      }
      return;
    }
    if (itemId) {
      push(errors, "output_item_forbidden", path + ".item_id", "item_id is only valid for an auto-checkable item.");
    }
    if (!constructed || (part !== "response_text" && part !== "identified_weakness")) {
      push(
        errors,
        "output_response_part_incompatible",
        path + ".response_part",
        "This response part is not available on that elicitation."
      );
      return;
    }
    if (part === "identified_weakness" && !revisionOffered(elicitation)) {
      push(
        errors,
        "output_response_part_incompatible",
        path + ".response_part",
        "identified_weakness requires revision.offered on that elicitation."
      );
    }
  }

  function validateOutputSection(section, index, elicitationById, seenSectionIds, seenOrders, seenContributionIds, errors) {
    var path = "assessment_evidence.output_specification.sections[" + index + "]";
    if (!isObject(section)) {
      push(errors, "output_section_invalid", path, "Each output section must be an object.");
      return;
    }
    rejectUnsupportedOutputKeys(section, OUTPUT_SECTION_KEYS, path, errors);
    if (!requiredSpecString(section.section_id)) {
      push(errors, "output_section_field_required", path + ".section_id", "section_id is required.");
    } else if (seenSectionIds[section.section_id.trim()]) {
      push(errors, "output_duplicate_id", path + ".section_id", "section_id must be unique.");
    } else {
      seenSectionIds[section.section_id.trim()] = true;
    }
    if (!isFinite(Number(section.order))) {
      push(errors, "output_section_field_required", path + ".order", "section order is required.");
    } else if (seenOrders[String(Number(section.order))]) {
      push(errors, "output_duplicate_order", path + ".order", "section order must be unique.");
    } else {
      seenOrders[String(Number(section.order))] = true;
    }
    if (!requiredSpecString(section.heading)) {
      push(errors, "output_section_field_required", path + ".heading", "heading is required.");
    }
    if (!Array.isArray(section.contributions) || !section.contributions.length) {
      push(errors, "output_section_contributions_required", path + ".contributions", "A section needs at least one contribution.");
      return;
    }
    var seenSources = {};
    section.contributions.forEach(function (contribution, contributionIndex) {
      validateOutputContribution(
        contribution,
        contributionIndex,
        path,
        elicitationById,
        seenContributionIds,
        seenSources,
        errors
      );
    });
  }

  function validateOutputSpecification(body, errors) {
    if (!isObject(body) || !Object.prototype.hasOwnProperty.call(body, "output_specification")) return;
    var spec = body.output_specification;
    var path = "assessment_evidence.output_specification";
    if (!isObject(spec)) {
      push(errors, "output_specification_invalid", path, "output_specification must be an object when present.");
      return;
    }
    rejectUnsupportedOutputKeys(spec, OUTPUT_SPEC_KEYS, path, errors);
    ["specification_id", "artefact_title", "audience", "purpose", "action_label", "missing_response_text"].forEach(
      function (field) {
        if (!requiredSpecString(spec[field])) {
          push(errors, "output_specification_field_required", path + "." + field, field + " is required.");
        }
      }
    );
    if (requiredSpecString(spec.action_label) && spec.action_label.trim() === LEGACY_SUMMARY_LABEL) {
      push(
        errors,
        "output_action_label_legacy",
        path + ".action_label",
        "action_label must not reuse the legacy summary control."
      );
    }
    if (!Array.isArray(spec.sections) || !spec.sections.length) {
      push(errors, "output_specification_sections_required", path + ".sections", "At least one output section is required.");
      return;
    }
    var elicitationById = elicitationIndex(body.elicitations);
    var seenSectionIds = {};
    var seenOrders = {};
    var seenContributionIds = {};
    spec.sections.forEach(function (section, index) {
      validateOutputSection(section, index, elicitationById, seenSectionIds, seenOrders, seenContributionIds, errors);
    });
  }

  function validateEvidenceCore(source, errors, options) {
    var evidence = source && (source.assessment_evidence || source);
    if (!isObject(evidence) || (source && source.assessment_evidence == null && source.purpose == null && !options.loose)) {
      if (source && source.assessment_evidence == null && options.requireEvidenceObject) {
        push(errors, "assessment_evidence_required", "assessment_evidence", "assessment_evidence is required.");
        return;
      }
    }
    var body = source && source.assessment_evidence ? source.assessment_evidence : source;
    if (!isObject(body)) {
      push(errors, "assessment_evidence_required", "assessment_evidence", "assessment_evidence is required.");
      return;
    }
    hasSummativeKey(body, "assessment_evidence", errors, 0);
    validatePurpose(body.purpose, "assessment_evidence.purpose", errors);
    validateLearnerContext(body.learner_context, "assessment_evidence.learner_context", errors);
    var elicitations = Array.isArray(body.elicitations) ? body.elicitations : null;
    if (!elicitations || !elicitations.length) {
      if (!options.purposeOnly) {
        push(errors, "elicitations_required", "assessment_evidence.elicitations", "At least one elicitation is required.");
      }
    } else {
      elicitations.forEach(function (row, index) {
        validateElicitation(row, index, errors, options);
      });
    }
    if (options.requirePackForward && !forwardText(body.pack_forward_orientation)) {
      push(
        errors,
        "pack_forward_orientation_required",
        "assessment_evidence.pack_forward_orientation",
        "Pack forward orientation is required."
      );
    }
    validateOutputSpecification(body, errors);
  }

  function validateEvidencePurposeArtefact(artefact) {
    var errors = [];
    if (!isObject(artefact) || text(artefact.artifact_type) !== "assessment_evidence_purpose") {
      push(errors, "artifact_type_invalid", "artifact_type", "Stage 1 artifact_type must be assessment_evidence_purpose.");
    }
    validateEvidenceCore(artefact, errors, { purposeOnly: true, loose: true });
    return { ok: errors.length === 0, errors: errors };
  }

  function validateElicitationArtefact(artefact) {
    var errors = [];
    if (!isObject(artefact) || text(artefact.artifact_type) !== "assessment_evidence_elicitation") {
      push(errors, "artifact_type_invalid", "artifact_type", "Stage 2 artifact_type must be assessment_evidence_elicitation.");
    }
    validateEvidenceCore(artefact, errors, { includeFormativeReturn: false, loose: true });
    return { ok: errors.length === 0, errors: errors };
  }

  function validateFormativeReturnArtefact(artefact, elicitationArtefact) {
    var errors = [];
    if (!isObject(artefact) || text(artefact.artifact_type) !== "assessment_formative_return") {
      push(errors, "artifact_type_invalid", "artifact_type", "Stage 3 artifact_type must be assessment_formative_return.");
    }
    validateEvidenceCore(artefact, errors, { requirePackForward: true, loose: true });
    if (isObject(elicitationArtefact) && Array.isArray(elicitationArtefact.elicitations) && Array.isArray(artefact && artefact.elicitations)) {
      var frozen = {};
      elicitationArtefact.elicitations.forEach(function (row) {
        if (row && text(row.elicitation_id)) frozen[text(row.elicitation_id)] = text(row.epistemic_class);
      });
      artefact.elicitations.forEach(function (row, index) {
        var id = text(row && row.elicitation_id);
        if (id && frozen[id] && frozen[id] !== text(row.epistemic_class)) {
          push(
            errors,
            "epistemic_class_reopened",
            "elicitations[" + index + "].epistemic_class",
            "Formative return must not change the frozen epistemic class."
          );
        }
      });
    }
    return { ok: errors.length === 0, errors: errors };
  }

  function validateAssessmentPackCanonicalPage(page) {
    var errors = [];
    if (!isObject(page)) {
      return { ok: false, errors: [{ code: "page_required", path: "", message: "A page object is required." }] };
    }
    if (text(page.artifact_type) !== "page") {
      push(errors, "artifact_type_invalid", "artifact_type", "artifact_type must be page.");
    }
    if (text(page.schema_version) !== "2.0.0") {
      push(errors, "schema_version_invalid", "schema_version", "schema_version must be 2.0.0.");
    }
    if (text(page.product_id) !== "assessment_pack") {
      push(errors, "product_id_invalid", "product_id", "product_id must be assessment_pack.");
    }
    if (text(page.page_kind) !== "assessment") {
      push(errors, "page_kind_invalid", "page_kind", "page_kind must be assessment.");
    }
    if (!text(page.title)) {
      push(errors, "title_required", "title", "A learner-facing title is required.");
    }
    if (!Array.isArray(page.activities) || page.activities.length !== 0) {
      push(errors, "activities_must_be_empty", "activities", "activities must be an empty array.");
    }
    hasSummativeKey(page, "page", errors, 0);
    if (!isObject(page.assessment_evidence)) {
      push(errors, "assessment_evidence_required", "assessment_evidence", "assessment_evidence is required.");
    } else {
      validateEvidenceCore(page, errors, { requireEvidenceObject: true, requirePackForward: true });
    }
    return { ok: errors.length === 0, errors: errors };
  }

  /**
   * Lift a Gate 9 one-item determinate unit that was authored flat on delivery.
   * Copies existing form, prompt, judgement, and feedback_note. Does not invent them.
   * The delivery kind already declares the item auto-checkable, so that flag is set
   * only when the authored judgement keys are present.
   */
  function normalizeAssessmentPackCanonicalPage(page) {
    var notes = [];
    if (!isObject(page) || !isObject(page.assessment_evidence)) {
      return { page: page, normalizations: notes };
    }
    var copy;
    try {
      copy = JSON.parse(JSON.stringify(page));
    } catch (err) {
      return { page: page, normalizations: notes };
    }
    var elicitations = Array.isArray(copy.assessment_evidence.elicitations)
      ? copy.assessment_evidence.elicitations
      : [];
    elicitations.forEach(function (elicitation, index) {
      if (!isObject(elicitation) || !isObject(elicitation.delivery)) return;
      var delivery = elicitation.delivery;
      if (delivery.kind !== "auto_checkable_items") return;
      if (Array.isArray(delivery.items) && delivery.items.length) return;
      var form = text(delivery.form);
      if (supportedForms().indexOf(form) === -1) return;
      if (!isObject(delivery.prompt) || !isObject(delivery.judgement)) return;
      var item = {
        item_id: text(delivery.item_id) || text(elicitation.elicitation_id),
        order: delivery.order != null ? delivery.order : elicitation.order,
        form: form,
        prompt: delivery.prompt,
        judgement: delivery.judgement
      };
      if (judgementPresent(form, delivery.judgement)) {
        item.judgement = Object.assign({}, delivery.judgement, { auto_checkable: true });
        item.auto_checkable = true;
      }
      var note = text(delivery.feedback_note);
      if (!note && isObject(elicitation.formative_return)) {
        note = text(elicitation.formative_return.feedback_note);
      }
      if (note) item.feedback_note = note;
      delivery.items = [item];
      delete delivery.form;
      delete delivery.prompt;
      delete delivery.judgement;
      delete delivery.item_id;
      delete delivery.order;
      delete delivery.feedback_note;
      delete delivery.auto_checkable;
      notes.push({
        elicitation_id: text(elicitation.elicitation_id),
        index: index,
        action: "lifted_flat_determinate_item"
      });
    });
    return { page: copy, normalizations: notes };
  }

  return {
    learnerProse: learnerProse,
    readConstructedLearnerPrompt: readConstructedLearnerPrompt,
    validateEvidencePurposeArtefact: validateEvidencePurposeArtefact,
    validateElicitationArtefact: validateElicitationArtefact,
    validateFormativeReturnArtefact: validateFormativeReturnArtefact,
    validateAssessmentPackCanonicalPage: validateAssessmentPackCanonicalPage,
    normalizeAssessmentPackCanonicalPage: normalizeAssessmentPackCanonicalPage
  };
});
