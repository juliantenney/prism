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
  var DESIGN_PAGE_PROSE_FIELD_ORDER = LEARNER_PROSE_KEYS.concat([
    "orientation",
    "purpose",
    "context",
    "audience",
    "introduction",
    "summary",
    "learner_message"
  ]);
  var DESIGN_PAGE_PROSE_SKIP = {
    id: true,
    kind: true,
    decision: true,
    skip_reason: true,
    material_id: true,
    elicitation_id: true,
    item_id: true,
    specification_id: true
  };

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

  /**
   * Design Page framing / attempt_instructions are one learner-facing string.
   * Arrays of strings, or objects whose own string fields hold that prose, convert
   * without inventing wording. Metadata-only objects stay unreadable.
   */
  function readAssessmentDesignPageLearnerString(value) {
    if (typeof value === "string") return { ok: true, text: value.trim(), converted: false };
    if (value == null) return { ok: true, text: "", converted: false };
    if (Array.isArray(value)) {
      var parts = [];
      var i;
      for (i = 0; i < value.length; i += 1) {
        var item = readAssessmentDesignPageLearnerString(value[i]);
        if (!item.ok) return { ok: false, text: "", converted: false };
        if (item.text) parts.push(item.text);
      }
      return parts.length
        ? { ok: true, text: parts.join("\n\n"), converted: true }
        : { ok: false, text: "", converted: false };
    }
    if (!isObject(value)) return { ok: false, text: "", converted: false };
    var collected = [];
    var seen = {};
    DESIGN_PAGE_PROSE_FIELD_ORDER.forEach(function (field) {
      if (typeof value[field] === "string" && value[field].trim()) {
        collected.push(value[field].trim());
        seen[field] = true;
      }
    });
    Object.keys(value).forEach(function (key) {
      if (seen[key] || DESIGN_PAGE_PROSE_SKIP[key]) return;
      if (typeof value[key] === "string" && value[key].trim()) {
        collected.push(value[key].trim());
      }
    });
    if (collected.length) return { ok: true, text: collected.join("\n\n"), converted: true };
    return { ok: false, text: "", converted: false };
  }

  function repairAssessmentDesignPageLearnerFacingStrings(page) {
    if (!isObject(page)) return { page: page, repairApplied: false, repairs: [] };
    var copy;
    try {
      copy = JSON.parse(JSON.stringify(page));
    } catch (err) {
      return { page: page, repairApplied: false, repairs: [] };
    }
    var repairs = [];
    ["framing", "attempt_instructions"].forEach(function (field) {
      if (copy[field] == null || typeof copy[field] === "string") return;
      var read = readAssessmentDesignPageLearnerString(copy[field]);
      if (!read.ok || !read.converted) return;
      copy[field] = read.text;
      repairs.push(field);
    });
    return {
      page: copy,
      repairApplied: repairs.length > 0,
      repairs: repairs
    };
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

  function firstNonEmptyString(candidates) {
    var i;
    for (i = 0; i < candidates.length; i += 1) {
      if (typeof candidates[i] === "string" && candidates[i].trim()) {
        return candidates[i].trim();
      }
    }
    return "";
  }

  /**
   * Closed structured delivery.stimulus contract markers.
   * Lone evidence_boundary is not enough — research-study objects also use that key.
   */
  function looksLikeStructuredStimulus(value) {
    if (!isObject(value)) return false;
    return (
      value.scenario != null ||
      Array.isArray(value.alternatives) ||
      Array.isArray(value.evidence)
    );
  }

  /**
   * Generated research-account case material sometimes arrives as a structured
   * study object (research_question / method / findings / …). That shape is not
   * learner-facing prose and is not the closed structured delivery.stimulus
   * contract (scenario/alternatives/evidence). Detect only this study shape.
   */
  function looksLikeResearchStudyStimulus(value) {
    if (!isObject(value) || looksLikeStructuredStimulus(value)) return false;
    return (
      value.research_question != null ||
      value.method != null ||
      Array.isArray(value.findings) ||
      value.observed_difference != null ||
      value.methodological_limitations != null
    );
  }

  function formatScalarFigure(value) {
    if (value == null || value === "") return "";
    if (typeof value === "number" && isFinite(value)) return String(value);
    if (typeof value === "string" && value.trim()) return value.trim();
    return "";
  }

  function formatResearchStudyFindingLine(row) {
    if (!isObject(row)) return "";
    var group = firstNonEmptyString([row.group, row.name, row.title, row.label]);
    var students = formatScalarFigure(
      row.number_of_students != null ? row.number_of_students : row.students
    );
    var reporting = formatScalarFigure(
      row.students_reporting_good_concentration != null
        ? row.students_reporting_good_concentration
        : row.reporting_good_concentration
    );
    var percentage = firstNonEmptyString([
      row.percentage_reporting_good_concentration,
      row.percentage
    ]);
    var parts = [];
    if (students) parts.push(students + " students");
    if (reporting) parts.push(reporting + " reporting good concentration");
    if (percentage) parts.push("(" + percentage + ")");
    if (!group && !parts.length) {
      return firstNonEmptyString([row.information, row.body, row.text, row.summary]);
    }
    if (!parts.length) return group;
    return group ? group + ": " + parts.join("; ") + "." : parts.join("; ") + ".";
  }

  function formatResearchStudyLimitations(value) {
    var asString = firstNonEmptyString([typeof value === "string" ? value : ""]);
    if (asString) return asString;
    if (!Array.isArray(value) || !value.length) return "";
    return value
      .map(function (row) {
        if (typeof row === "string" && row.trim()) return row.trim();
        if (!isObject(row)) return "";
        return firstNonEmptyString([row.text, row.body, row.limitation, row.note]);
      })
      .filter(Boolean)
      .join(" ");
  }

  /**
   * Flatten authored research-study case material into learner-facing prose.
   * Copies authored strings and figures; does not invent interpretation.
   */
  function formatResearchStudyStimulusProse(value) {
    if (!isObject(value)) return "";
    var blocks = [];
    var title = firstNonEmptyString([value.title]);
    if (title) blocks.push(title);
    var status = firstNonEmptyString([value.status]);
    if (status) blocks.push(status);
    var researchQuestion = firstNonEmptyString([value.research_question]);
    if (researchQuestion) blocks.push("Research question: " + researchQuestion);
    var method = firstNonEmptyString([value.method]);
    if (method) blocks.push("Method: " + method);
    if (Array.isArray(value.findings) && value.findings.length) {
      var findingLines = value.findings
        .map(function (row) {
          return formatResearchStudyFindingLine(row);
        })
        .filter(Boolean);
      if (findingLines.length) {
        blocks.push("Findings:\n" + findingLines.join("\n"));
      }
    }
    var observedDifference = firstNonEmptyString([value.observed_difference]);
    if (observedDifference) blocks.push("Observed difference: " + observedDifference);
    var limitations = formatResearchStudyLimitations(value.methodological_limitations);
    if (limitations) blocks.push("Methodological limitations: " + limitations);
    var evidenceBoundary = firstNonEmptyString([value.evidence_boundary, value.boundary]);
    if (evidenceBoundary) blocks.push("Evidence boundary: " + evidenceBoundary);
    return blocks.join("\n\n");
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

  var PACK_FORWARD_PROSE_FIELDS = [
    "learner_message",
    "review_guidance",
    "next_use",
    "learner_agency",
    "completion_message"
  ];

  /**
   * Pack forward orientation is one learner-facing implication.
   * A string is that implication. The captured Planning My Learning Journey
   * page stores the same implication as an object: learner_message plus the
   * later review, use, agency, and completion sentences. Assembly instructions
   * on that object are not the forward text.
   */
  function readPackForwardOrientation(value) {
    if (typeof value === "string") {
      var direct = value.trim();
      return direct ? { ok: true, text: direct } : { ok: false };
    }
    if (!isObject(value)) return { ok: false };
    var parts = [];
    PACK_FORWARD_PROSE_FIELDS.forEach(function (field) {
      if (typeof value[field] === "string" && value[field].trim()) parts.push(value[field].trim());
    });
    if (parts.length) return { ok: true, text: parts.join("\n\n") };
    var prose = learnerProse(value);
    if (prose.ok && prose.text) return { ok: true, text: prose.text };
    return { ok: false };
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

  var HEDGE_RE = /\b(likely|probably|might|appears to|seems to|could be|may be|suggests that)\b/i;
  var BLOCKING_KEY_STATUS = {
    equally_defensible: true,
    omitted_but_defensible: true,
    included_without_support: true,
    unresolved: true
  };

  function labelKey(value) {
    return text(value).toLowerCase().replace(/[^a-z]/g, "");
  }

  function nestedCategoryPairs(categories) {
    var pairs = [];
    if (!Array.isArray(categories)) return pairs;
    categories.forEach(function (left) {
      categories.forEach(function (right) {
        if (!isObject(left) || !isObject(right) || left === right) return;
        var weaker = labelKey(left.label || left.id);
        var stronger = labelKey(right.label || right.id);
        if (weaker.length >= 4 && stronger.length > weaker.length && stronger.indexOf(weaker) !== -1) {
          pairs.push({ weakerId: text(left.id), strongerId: text(right.id) });
        }
      });
    });
    return pairs;
  }

  function asksComparativeBest(stem) {
    return /\b(?:most|best)[-\s]+(?:justified|useful|appropriate|supported|defensible|relevant)\b|\bstrongest\s+conclusion\b/i.test(
      text(stem)
    );
  }

  function learnerCorpus(item, elicitation) {
    var parts = [];
    function add(value) {
      var row = text(value);
      if (row) parts.push(row);
    }
    add(elicitation && elicitation.stimulus);
    add(elicitation && elicitation.instructions);
    var prompt = item && item.prompt;
    if (!isObject(prompt)) return parts.join("\n");
    add(prompt.stem);
    ["options", "items", "categories", "left", "right"].forEach(function (key) {
      var rows = prompt[key];
      if (!Array.isArray(rows)) return;
      rows.forEach(function (row) {
        if (!isObject(row)) return;
        add(row.text);
        add(row.label);
      });
    });
    return parts.join("\n");
  }

  function defenceRecord(item) {
    if (isObject(item && item.key_defence)) return item.key_defence;
    if (isObject(item && item.keyDefence)) return item.keyDefence;
    return null;
  }

  function feedbackNotes(item, elicitation) {
    var notes = [];
    if (text(item && item.feedback_note)) notes.push(text(item.feedback_note));
    var items =
      elicitation && elicitation.delivery && Array.isArray(elicitation.delivery.items)
        ? elicitation.delivery.items
        : [];
    if (items.length !== 1) return notes;
    var materials =
      elicitation.formative_return && Array.isArray(elicitation.formative_return.materials)
        ? elicitation.formative_return.materials
        : [];
    materials.forEach(function (row) {
      if (isObject(row) && text(row.body)) notes.push(text(row.body));
    });
    return notes;
  }

  function escapeQuantityRegExp(value) {
    return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function corpusHasPercentToken(corpus, numerator) {
    return new RegExp("\\b" + escapeQuantityRegExp(numerator) + "%").test(String(corpus || ""));
  }

  // Licensed numerators from explicit count-out-of-100 groups only. Patterns keep
  // numerator and denominator inside one expression or one sentence-local group.
  function countOutOfHundredNumeratorsInText(value) {
    var found = [];
    function add(numerator) {
      if (numerator && found.indexOf(numerator) === -1) found.push(numerator);
    }
    var textValue = String(value || "");
    var match;
    var ofHundred = /\b(\d+(?:\.\d+)?)\s*(?:of|out\s+of|\/)\s*100\b/gi;
    while ((match = ofHundred.exec(textValue))) add(match[1]);
    var ofTheHundred =
      /\b(\d+(?:\.\d+)?)\s+of\s+(?:the\s+)?100\s+(?:students|respondents|participants|undergraduates)\b/gi;
    while ((match = ofTheHundred.exec(textValue))) add(match[1]);
    var amongHundredReported =
      /\b(?:among|of)\s+(?:the\s+)?100\s+(?:students|respondents|participants|undergraduates)\b[^.?!]{0,160}?\b(\d+(?:\.\d+)?)\s+reported\b/gi;
    while ((match = amongHundredReported.exec(textValue))) add(match[1]);
    return found;
  }

  function corpusHasCountOutOfHundred(corpus, numerator) {
    return countOutOfHundredNumeratorsInText(corpus).indexOf(String(numerator)) !== -1;
  }

  // Exact-token match first. Narrow equivalence only for explicit count-out-of-100
  // expressions paired with the same numerator as a percent (N of 100 ↔ N%).
  function quantitySupportedByVisibleEvidence(quantity, corpus, note) {
    var q = String(quantity || "");
    var corpusText = String(corpus || "");
    if (!q) return true;
    if (corpusText.indexOf(q) !== -1) return true;

    var percent = q.match(/^(\d+(?:\.\d+)?)%$/);
    if (percent) {
      return corpusHasCountOutOfHundred(corpusText, percent[1]);
    }

    var bare = q.match(/^(\d+(?:\.\d+)?)$/);
    if (!bare) return false;
    var num = bare[1];
    var noteNumerators = countOutOfHundredNumeratorsInText(note);

    if (noteNumerators.indexOf(num) !== -1 && corpusHasPercentToken(corpusText, num)) {
      return true;
    }

    if (num === "100") {
      return noteNumerators.some(function (numerator) {
        return corpusHasPercentToken(corpusText, numerator);
      });
    }

    return false;
  }

  function reviewFeedbackAgainstKey(note, item, corpus, path, errors) {
    var quantities = String(note || "").match(/\d+(?:\.\d+)?%?/g) || [];
    var invented = false;
    quantities.forEach(function (quantity) {
      if (invented || quantitySupportedByVisibleEvidence(quantity, corpus, note)) return;
      invented = true;
      push(
        errors,
        "answer_key_invented_evidence",
        path + ".feedback",
        "Explanatory feedback introduces a quantity the learner cannot see. Revise the feedback so it uses only the visible evidence."
      );
    });
    var prompt = isObject(item.prompt) ? item.prompt : {};
    var categories = Array.isArray(prompt.categories) ? prompt.categories : [];
    var assignments =
      item.judgement && isObject(item.judgement.assignments) ? item.judgement.assignments : {};
    var assignedIds = {};
    Object.keys(assignments).forEach(function (key) {
      assignedIds[text(assignments[key])] = true;
    });
    var lower = String(note || "").toLowerCase();
    categories.forEach(function (category) {
      if (!isObject(category)) return;
      var id = text(category.id);
      var label = text(category.label).toLowerCase();
      if (!label || label.length < 4 || assignedIds[id]) return;
      if (lower.indexOf("is a " + label) === -1 && lower.indexOf("is an " + label) === -1) return;
      push(
        errors,
        "answer_key_feedback_conflict",
        path + ".feedback",
        "Explanatory feedback names a different category from the answer key."
      );
    });
    if (text(item.form) === "single_answer_mcq") {
      var keyed = text(item.judgement && item.judgement.correct_answer).toLowerCase();
      var named = lower.match(/correct answer is\s+([a-z0-9]+)/);
      if (named && keyed && named[1] !== keyed) {
        push(
          errors,
          "answer_key_feedback_conflict",
          path + ".feedback",
          "Explanatory feedback names a different option from the answer key."
        );
      }
    }
  }

  function reviewDeterminateItem(item, elicitation, path, errors) {
    if (!isObject(item)) return;
    var prompt = isObject(item.prompt) ? item.prompt : {};
    var defence = defenceRecord(item);
    var resolution = text(defence && defence.resolution)
      .toLowerCase()
      .replace(/[\s-]+/g, "_");
    if (defence) {
      if (resolution !== "unambiguous" && resolution !== "most_justified") {
        push(
          errors,
          "answer_key_ambiguous",
          path + ".key_defence.resolution",
          "A determinate key needs an unambiguous or most-justified resolution. Revise the item before publication."
        );
      }
      var alternatives = Array.isArray(defence.alternatives) ? defence.alternatives : [];
      if (resolution === "most_justified" && !asksComparativeBest(prompt.stem)) {
        push(
          errors,
          "answer_key_ambiguous",
          path + ".prompt.stem",
          "A most-justified key is only for a comparative stem, such as the most justified conclusion, the most useful evidence, or the most appropriate action."
        );
      }
      if (resolution === "most_justified" && asksComparativeBest(prompt.stem)) {
        var addressed = alternatives.some(function (alternative) {
          var status = text(alternative && alternative.status)
            .toLowerCase()
            .replace(/[\s-]+/g, "_");
          return status === "less_defensible" && text(alternative && alternative.reason);
        });
        if (!addressed) {
          push(
            errors,
            "answer_key_ambiguous",
            path + ".key_defence.alternatives",
            "A comparative key must address the other options in key_defence and show why they are less defensible."
          );
        }
      }
      alternatives.forEach(function (alternative, index) {
        var status = text(alternative && alternative.status)
          .toLowerCase()
          .replace(/[\s-]+/g, "_");
        if (!BLOCKING_KEY_STATUS[status]) return;
        push(
          errors,
          "answer_key_ambiguous",
          path + ".key_defence.alternatives[" + index + "]",
          "A determinate item still has another defensible answer. Revise the item so the published key is the defensible one."
        );
      });
    }
    if (text(item.form) === "classification") {
      var pairs = nestedCategoryPairs(prompt.categories);
      var assignments =
        item.judgement && isObject(item.judgement.assignments) ? item.judgement.assignments : {};
      var statements = Array.isArray(prompt.items) ? prompt.items : [];
      statements.forEach(function (statement) {
        if (!isObject(statement) || !HEDGE_RE.test(text(statement.text))) return;
        var assigned = text(assignments[text(statement.id)]);
        var contested = pairs.some(function (pair) {
          return pair.weakerId === assigned || pair.strongerId === assigned;
        });
        if (!contested) return;
        push(
          errors,
          "answer_key_ambiguous",
          path + ".judgement.assignments." + text(statement.id),
          "A hedged statement sits on a nested category boundary, so more than one category is defensible. Revise the statement or the categories."
        );
      });
    }
    var corpus = learnerCorpus(item, elicitation);
    feedbackNotes(item, elicitation).forEach(function (note) {
      reviewFeedbackAgainstKey(note, item, corpus, path, errors);
    });
  }

  function reviewDeterminateKeys(source) {
    var errors = [];
    var body = source && source.assessment_evidence ? source.assessment_evidence : source;
    var rows = body && Array.isArray(body.elicitations) ? body.elicitations : [];
    rows.forEach(function (elicitation, index) {
      if (!isObject(elicitation) || text(elicitation.epistemic_class) !== "determinate") return;
      var items =
        elicitation.delivery && Array.isArray(elicitation.delivery.items) ? elicitation.delivery.items : [];
      items.forEach(function (item, itemIndex) {
        reviewDeterminateItem(
          item,
          elicitation,
          "elicitations[" + index + "].delivery.items[" + itemIndex + "]",
          errors
        );
      });
    });
    return { ok: errors.length === 0, errors: errors };
  }

  function validateAutoItems(delivery, path, errors, elicitation) {
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
      reviewDeterminateItem(item, elicitation, itemPath, errors);
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
        validateAutoItems(delivery, path + ".delivery", errors, elicitation);
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
    if (options.requirePackForward && !readPackForwardOrientation(body.pack_forward_orientation).ok) {
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
  function isAssessmentActivityCarrier(row) {
    if (!isObject(row)) return false;
    if (text(row.elicitation_id) || text(row.epistemic_class) || isObject(row.delivery) || isObject(row.formative_return)) {
      return true;
    }
    if (text(row.form) && isObject(row.judgement)) return true;
    var prompt = row.prompt;
    return isObject(prompt) && (text(prompt.stem) || Array.isArray(prompt.options) || Array.isArray(prompt.items));
  }

  function isGenericInteractiveActivity(row) {
    if (!isObject(row)) return true;
    if (
      row.learner_task != null ||
      row.beats != null ||
      row.episode_plan != null ||
      row.episode_plans != null ||
      row.activity_materials != null ||
      row.materials != null
    ) {
      return true;
    }
    return text(row.activity_id) && !isAssessmentActivityCarrier(row) && !orientationProse(row);
  }

  function orientationProse(row) {
    if (!isObject(row)) return "";
    return text(row.exposition) || text(row.body) || text(row.overview) || text(row.introduction);
  }

  function knownAssessmentIds(evidence) {
    var known = {};
    var rows = Array.isArray(evidence.elicitations) ? evidence.elicitations : [];
    rows.forEach(function (row) {
      if (!isObject(row)) return;
      if (text(row.elicitation_id)) known[text(row.elicitation_id)] = true;
      var items = row.delivery && Array.isArray(row.delivery.items) ? row.delivery.items : [];
      items.forEach(function (item) {
        if (isObject(item) && text(item.item_id)) known["item:" + text(item.item_id)] = true;
      });
      if (text(row.item_id)) known["item:" + text(row.item_id)] = true;
    });
    return known;
  }

  function rememberAssessmentRow(known, row) {
    if (!isObject(row)) return;
    if (text(row.elicitation_id)) known[text(row.elicitation_id)] = true;
    if (text(row.item_id)) known["item:" + text(row.item_id)] = true;
    var items = row.delivery && Array.isArray(row.delivery.items) ? row.delivery.items : [];
    items.forEach(function (item) {
      if (isObject(item) && text(item.item_id)) known["item:" + text(item.item_id)] = true;
    });
  }

  /**
   * Step 7 sometimes copies elicitations or orientation into activities[].
   * Those rows are not Interactive activities. Keep any question that is not
   * already in assessment_evidence, and leave genuine learning activities in
   * place so publication still rejects them.
   */
  function salvageAssessmentActivities(page, notes) {
    if (!Array.isArray(page.activities) || !page.activities.length) return;
    if (!isObject(page.assessment_evidence)) return;
    var evidence = page.assessment_evidence;
    if (!Array.isArray(evidence.elicitations)) evidence.elicitations = [];
    var known = knownAssessmentIds(evidence);
    var blocked = false;
    var moved = [];
    page.activities.forEach(function (row) {
      if (isGenericInteractiveActivity(row)) {
        blocked = true;
        return;
      }
      if (isAssessmentActivityCarrier(row)) {
        var id = text(row.elicitation_id);
        var itemId = text(row.item_id);
        var already = (id && known[id]) || (itemId && known["item:" + itemId]);
        if (already) return;
        if (id && (isObject(row.delivery) || text(row.epistemic_class))) {
          evidence.elicitations.push(row);
          rememberAssessmentRow(known, row);
          moved.push(id);
          return;
        }
        blocked = true;
        return;
      }
      var prose = orientationProse(row);
      if (!prose) {
        blocked = true;
        return;
      }
      if (!Array.isArray(page.sections)) page.sections = [];
      var present = page.sections.some(function (section) {
        return text(section && section.exposition) === prose;
      });
      if (!present) {
        page.sections.push({
          section_id: text(row.section_id) || "orientation",
          title: text(row.title),
          exposition: prose
        });
      }
    });
    if (blocked) return;
    page.activities = [];
    notes.push({
      action: moved.length ? "lifted_activities_into_assessment_evidence" : "cleared_activities_already_in_assessment_evidence",
      elicitation_ids: moved
    });
  }

  var LEGACY_RETAIN_OUTPUT_KEYS = {
    output_id: true,
    title: true,
    source_elicitation_ids: true,
    source_response: true,
    output_format: true,
    preserve_verbatim: true,
    reviewable: true,
    editable: true,
    copyable: true,
    later_use: true,
    assessment_constraints: true
  };

  function sectionIsCanonicalOutputSection(section) {
    return (
      isObject(section) &&
      requiredSpecString(section.section_id) &&
      Array.isArray(section.contributions) &&
      section.contributions.length > 0
    );
  }

  function legacySectionMappedElicitationId(section) {
    if (!isObject(section)) return "";
    var fromSource = text(section.source_elicitation_id);
    var fromDirect = text(section.elicitation_id);
    if (fromSource && fromDirect && fromSource !== fromDirect) return "";
    return fromSource || fromDirect;
  }

  function sectionIsLegacyMappedOutputSection(section) {
    if (!isObject(section) || sectionIsCanonicalOutputSection(section)) return false;
    // Mixed partial-canonical rows are ambiguous; do not treat as shorthand.
    if (Array.isArray(section.contributions) && section.contributions.length) return false;
    return !!legacySectionMappedElicitationId(section);
  }

  /**
   * Sections authored as shorthand retain mappings instead of canonical
   * { section_id, order, heading, contributions }:
   *   { title|heading, source_elicitation_id|elicitation_id, response_part }
   * Safe only when every section carries an explicit source elicitation id
   * and no contribution array is already present.
   */
  function looksLikeLegacySectionMappedOutputSpecification(spec) {
    if (!isObject(spec) || !Array.isArray(spec.sections) || !spec.sections.length) return false;
    return spec.sections.every(sectionIsLegacyMappedOutputSection);
  }

  /**
   * Detect the generated retain/copy shape that names educational affordances
   * (output_id, reviewable, editable, copyable, …) instead of the closed
   * publisher contract (specification_id, sections, …). Also detects closed
   * top-level fields with legacy section rows. Already-valid authoritative
   * specs are left alone.
   */
  function looksLikeLegacyRetainOutputSpecification(spec) {
    if (!isObject(spec)) return false;
    if (looksLikeLegacySectionMappedOutputSpecification(spec)) return true;
    if (requiredSpecString(spec.specification_id) && Array.isArray(spec.sections) && spec.sections.length) {
      return false;
    }
    return Object.keys(LEGACY_RETAIN_OUTPUT_KEYS).some(function (key) {
      return Object.prototype.hasOwnProperty.call(spec, key);
    });
  }

  function constructedElicitationIds(elicitations) {
    var ids = [];
    (Array.isArray(elicitations) ? elicitations : []).forEach(function (row) {
      if (!isObject(row) || !isObject(row.delivery)) return;
      if (row.delivery.kind !== "constructed_performance") return;
      var id = text(row.elicitation_id);
      if (id) ids.push(id);
    });
    return ids;
  }

  function resolveLegacyRetainSourceElicitationIds(spec, evidence) {
    var declared = Array.isArray(spec.source_elicitation_ids)
      ? spec.source_elicitation_ids
          .map(function (id) {
            return text(id);
          })
          .filter(Boolean)
      : [];
    if (declared.length) return declared;
    var elicitations = Array.isArray(evidence.elicitations) ? evidence.elicitations : [];
    var outputId = text(spec.output_id);
    if (outputId) {
      var matched = [];
      elicitations.forEach(function (row) {
        if (!isObject(row) || !isObject(row.delivery) || !isObject(row.delivery.learner_output)) return;
        if (text(row.delivery.learner_output.output_id) !== outputId) return;
        var id = text(row.elicitation_id);
        if (id) matched.push(id);
      });
      if (matched.length) return matched;
    }
    var constructed = constructedElicitationIds(elicitations);
    return constructed.length === 1 ? constructed : [];
  }

  function contributionLabelForLegacyRetain(elicitation, artefactTitle) {
    if (!isObject(elicitation)) return artefactTitle;
    var promptRead = readConstructedLearnerPrompt(elicitation.delivery && elicitation.delivery.prompt);
    if (promptRead.ok && promptRead.title) return promptRead.title;
    if (promptRead.ok && promptRead.task) {
      var task = promptRead.task;
      return task.length > 80 ? artefactTitle : task;
    }
    return artefactTitle;
  }

  function resolveLegacyRetainAudience(spec, purpose) {
    var audience = text(spec && spec.audience);
    if (audience) return audience;
    var retentionSignal =
      (spec && spec.preserve_verbatim === true) ||
      (spec && spec.reviewable === true) ||
      (spec && spec.copyable === true) ||
      (Array.isArray(spec && spec.later_use) && spec.later_use.length > 0) ||
      /later revision|later comparison|baseline|retain/i.test(String(purpose || ""));
    return retentionSignal ? "You, for later revision and comparison" : "";
  }

  /**
   * Convert legacy section rows
   * { title|heading, source_elicitation_id|elicitation_id, response_part }
   * into canonical { section_id, order, heading, contributions } when each
   * source id resolves to a constructed_performance elicitation. Leaves the
   * page unchanged when any mapping is ambiguous or unresolvable.
   */
  function normalizeLegacySectionMappedOutputSpecification(page, evidence, spec, notes) {
    var byId = elicitationIndex(evidence.elicitations);
    var specificationId = text(spec.specification_id) || text(spec.output_id);
    var artefactTitle = text(spec.artefact_title) || text(spec.title) || text(page && page.title);
    var purpose = text(spec.purpose);
    var actionLabel = text(spec.action_label);
    if (!specificationId || !artefactTitle || !purpose || !actionLabel) return;
    if (actionLabel.trim() === LEGACY_SUMMARY_LABEL) return;

    var audience = resolveLegacyRetainAudience(spec, purpose);
    if (!audience) return;

    var missingResponseText = text(spec.missing_response_text) || "Not yet written.";
    var seenSectionIds = {};
    var seenOrders = {};
    var sections = [];
    var sourceIds = [];
    var i;
    for (i = 0; i < spec.sections.length; i += 1) {
      var legacy = spec.sections[i];
      if (Array.isArray(legacy && legacy.contributions) && legacy.contributions.length) return;
      var fromSource = text(legacy && legacy.source_elicitation_id);
      var fromDirect = text(legacy && legacy.elicitation_id);
      if (fromSource && fromDirect && fromSource !== fromDirect) return;
      var elicitationId = fromSource || fromDirect;
      var source = byId[elicitationId];
      if (!source || !isObject(source.delivery) || source.delivery.kind !== "constructed_performance") {
        return;
      }
      var responsePart = text(legacy && legacy.response_part) || "response_text";
      if (responsePart !== "response_text" && responsePart !== "identified_weakness") return;
      if (responsePart === "identified_weakness" && !revisionOffered(source)) return;
      if (legacy && legacy.item_id != null && text(legacy.item_id)) return;

      var heading =
        text(legacy && legacy.title) ||
        text(legacy && legacy.heading) ||
        contributionLabelForLegacyRetain(source, artefactTitle);
      if (!heading) return;

      var sectionId = text(legacy && legacy.section_id) || specificationId + "-" + elicitationId;
      if (seenSectionIds[sectionId]) sectionId = sectionId + "-" + (i + 1);
      if (seenSectionIds[sectionId]) return;
      seenSectionIds[sectionId] = true;

      var order = isFinite(Number(legacy && legacy.order)) ? Number(legacy.order) : i + 1;
      if (seenOrders[String(order)]) return;
      seenOrders[String(order)] = true;

      sourceIds.push(elicitationId);
      sections.push({
        section_id: sectionId,
        order: order,
        heading: heading,
        contributions: [
          {
            contribution_id: sectionId + "-response",
            label: heading,
            elicitation_id: elicitationId,
            response_part: responsePart
          }
        ]
      });
    }

    evidence.output_specification = {
      specification_id: specificationId,
      artefact_title: artefactTitle,
      audience: audience,
      purpose: purpose,
      action_label: actionLabel,
      missing_response_text: missingResponseText,
      sections: sections
    };
    notes.push({
      action: "normalized_legacy_retain_output_specification",
      specification_id: specificationId,
      source_elicitation_ids: sourceIds.slice(),
      section_count: sections.length
    });
  }

  /**
   * Convert a known-bad retain/copy output_specification into the closed
   * publisher contract when the mapping is unambiguous. Does not rename
   * fields blindly: unsupported educational markers are dropped, and
   * sections/contributions are built from constructed elicitations only.
   * Leaves the page unchanged when required publisher fields cannot be
   * derived without inventing educational content.
   */
  function normalizeLegacyRetainOutputSpecification(page, notes) {
    if (!isObject(page) || !isObject(page.assessment_evidence)) return;
    var evidence = page.assessment_evidence;
    var spec = evidence.output_specification;
    if (!looksLikeLegacyRetainOutputSpecification(spec)) return;

    if (looksLikeLegacySectionMappedOutputSpecification(spec)) {
      normalizeLegacySectionMappedOutputSpecification(page, evidence, spec, notes);
      return;
    }

    var sourceIds = resolveLegacyRetainSourceElicitationIds(spec, evidence);
    if (!sourceIds.length) return;

    var byId = elicitationIndex(evidence.elicitations);
    var i;
    for (i = 0; i < sourceIds.length; i += 1) {
      var source = byId[sourceIds[i]];
      if (!source || !isObject(source.delivery) || source.delivery.kind !== "constructed_performance") {
        return;
      }
    }

    var specificationId = text(spec.output_id) || text(spec.specification_id);
    var artefactTitle = text(spec.title) || text(spec.artefact_title) || text(page.title);
    var purpose = text(spec.purpose);
    var actionLabel = text(spec.action_label);
    if (!specificationId || !artefactTitle || !purpose || !actionLabel) return;
    if (actionLabel.trim() === LEGACY_SUMMARY_LABEL) return;

    var audience = resolveLegacyRetainAudience(spec, purpose);
    if (!audience) return;

    var missingResponseText = text(spec.missing_response_text) || "Not yet written.";
    var contributions = sourceIds.map(function (id) {
      return {
        contribution_id: specificationId + "-" + id,
        label: contributionLabelForLegacyRetain(byId[id], artefactTitle),
        elicitation_id: id,
        response_part: "response_text"
      };
    });

    evidence.output_specification = {
      specification_id: specificationId,
      artefact_title: artefactTitle,
      audience: audience,
      purpose: purpose,
      action_label: actionLabel,
      missing_response_text: missingResponseText,
      sections: [
        {
          section_id: specificationId,
          order: 1,
          heading: artefactTitle,
          contributions: contributions
        }
      ]
    };
    notes.push({
      action: "normalized_legacy_retain_output_specification",
      specification_id: specificationId,
      source_elicitation_ids: sourceIds.slice()
    });
  }

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
    salvageAssessmentActivities(copy, notes);
    var designStrings = repairAssessmentDesignPageLearnerFacingStrings(copy);
    if (designStrings.repairApplied) {
      copy = designStrings.page;
      designStrings.repairs.forEach(function (field) {
        notes.push({ action: "design_page_" + field + "_to_string" });
      });
    }
    normalizeLegacyRetainOutputSpecification(copy, notes);
    var elicitations = Array.isArray(copy.assessment_evidence.elicitations)
      ? copy.assessment_evidence.elicitations
      : [];
    elicitations.forEach(function (elicitation, index) {
      if (!isObject(elicitation)) return;
      // Research-study objects are not learnerProse and are not structured
      // delivery.stimulus. Flatten the known study shape into prose so publish
      // preserves findings without accepting arbitrary objects.
      if (looksLikeResearchStudyStimulus(elicitation.stimulus)) {
        var studyProse = formatResearchStudyStimulusProse(elicitation.stimulus);
        if (studyProse) {
          elicitation.stimulus = studyProse;
          notes.push({
            elicitation_id: text(elicitation.elicitation_id),
            index: index,
            action: "research_study_stimulus_to_prose"
          });
        }
      }
      if (!isObject(elicitation.delivery)) return;
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
      if (isObject(delivery.key_defence)) item.key_defence = delivery.key_defence;
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
      delete delivery.key_defence;
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
    readAssessmentDesignPageLearnerString: readAssessmentDesignPageLearnerString,
    repairAssessmentDesignPageLearnerFacingStrings: repairAssessmentDesignPageLearnerFacingStrings,
    looksLikeResearchStudyStimulus: looksLikeResearchStudyStimulus,
    formatResearchStudyStimulusProse: formatResearchStudyStimulusProse,
    readPackForwardOrientation: readPackForwardOrientation,
    readConstructedLearnerPrompt: readConstructedLearnerPrompt,
    validateEvidencePurposeArtefact: validateEvidencePurposeArtefact,
    validateElicitationArtefact: validateElicitationArtefact,
    validateFormativeReturnArtefact: validateFormativeReturnArtefact,
    validateAssessmentPackCanonicalPage: validateAssessmentPackCanonicalPage,
    normalizeAssessmentPackCanonicalPage: normalizeAssessmentPackCanonicalPage,
    reviewDeterminateKeys: reviewDeterminateKeys
  };
});
