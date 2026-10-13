/**
 * Expository editorial opening image.
 * Resource-level presentation, separate from pedagogical visual affordances.
 * Does not generate an image; it prepares one Copy Prompt job and a stable attach id.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PRISM_EXPOSITORY_EDITORIAL_OPENING = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var AFFORDANCE_ID = "va-editorial-opening";
  var BRIEF_ID = "brief-editorial-opening";
  var JOB_ID = "vj-editorial-opening";
  var VISUAL_SLOT = "editorial-opening";

  function text(value) {
    return String(value == null ? "" : value).trim();
  }

  function isSituatedTaskPage(page) {
    if (!page || typeof page !== "object" || Array.isArray(page)) return false;
    return !!(
      page.situated_learning &&
      typeof page.situated_learning === "object" &&
      !Array.isArray(page.situated_learning)
    );
  }

  function isAssessmentPackPage(page) {
    if (!page || typeof page !== "object" || Array.isArray(page)) return false;
    if (text(page.page_kind) === "assessment" || text(page.product_id) === "assessment_pack") {
      return true;
    }
    return !!(
      page.assessment_evidence &&
      typeof page.assessment_evidence === "object" &&
      !Array.isArray(page.assessment_evidence)
    );
  }

  function isEditorialOpeningPage(page) {
    return isSituatedTaskPage(page) || isAssessmentPackPage(page) || isExpositoryPage(page);
  }

  function editorialProduct(page) {
    if (isSituatedTaskPage(page)) return "situated_task";
    if (isAssessmentPackPage(page)) return "assessment_pack";
    if (isExpositoryPage(page)) return "expository";
    return "";
  }

  function isExplicitGenerate(page) {
    var row = decisionRecord(page);
    return !!(row && text(row.decision).toLowerCase() === "generate");
  }

  function wantsEditorialJob(page) {
    if (!isEditorialOpeningPage(page) || isJustifiedSkip(page)) return false;
    if (editorialProduct(page) === "assessment_pack") return isExplicitGenerate(page);
    return true;
  }

  function isExpositoryPage(page) {
    if (!page || typeof page !== "object" || Array.isArray(page)) return false;
    if (page.expository_journey && typeof page.expository_journey === "object") return true;
    var enriched =
      page.assembly_state && Array.isArray(page.assembly_state.enriched_by)
        ? page.assembly_state.enriched_by
        : [];
    var i;
    for (i = 0; i < enriched.length; i += 1) {
      var stage = text(enriched[i]);
      if (
        stage === "expository_journey_plan" ||
        stage === "expository_development" ||
        stage === "expository_materials"
      ) {
        return true;
      }
    }
    return false;
  }

  function decisionRecord(page) {
    var row = page && page.editorial_opening_image;
    if (!row || typeof row !== "object" || Array.isArray(row)) return null;
    return row;
  }

  function isJustifiedSkip(page) {
    var row = decisionRecord(page);
    if (!row) return false;
    if (text(row.decision).toLowerCase() !== "skip") return false;
    return text(row.skip_reason).length > 0;
  }

  function sectionHeadings(page) {
    var headings = [];
    var sections = page && Array.isArray(page.sections) ? page.sections : [];
    sections.forEach(function (section) {
      var heading = text(section && (section.title || section.section_title));
      if (heading && headings.indexOf(heading) === -1) headings.push(heading);
    });
    return headings;
  }

  function clipAlt(subject) {
    var base = text(subject).replace(/[.]+$/g, "");
    var suffix = "; detailed description follows.";
    if (!base) base = "Editorial opening image";
    var alt = base + suffix;
    if (alt.length <= 140) return alt;
    return base.slice(0, Math.max(1, 140 - suffix.length)).trim() + suffix;
  }

  function fallbackTitle(product) {
    if (product === "situated_task") return "this task";
    if (product === "assessment_pack") return "this assessment";
    return "this chapter";
  }

  function defaultSetting(page, product) {
    var title = text(page.title) || fallbackTitle(product);
    var headings = sectionHeadings(page);
    if (product === "assessment_pack") {
      return (
        "Editorial opening for \"" +
        title +
        "\". Establish context, atmosphere or relevance for the assessment. Do not reveal correct answers, answer sequences, classifications, matches, or other judgement information."
      );
    }
    if (product === "situated_task") {
      var activity =
        page.situated_learning && page.situated_learning.activity
          ? page.situated_learning.activity
          : null;
      var setting =
        "Editorial opening for \"" +
        title +
        "\". Favour an authentic setting or context for learner-owned action. Do not depict findings, model answers, or decisions the learner must make.";
      var activityContext = text(activity && activity.context);
      if (activityContext) setting += " Context: " + activityContext;
      if (headings.length) setting += " Learner-facing movement: " + headings.join("; ") + ".";
      return setting;
    }
    var chapter = "Editorial opening for \"" + title + "\".";
    if (headings.length) chapter += " Chapter movement: " + headings.join("; ") + ".";
    return chapter;
  }

  function buildEditorialOpeningBrief(page) {
    if (!wantsEditorialJob(page)) return null;
    var product = editorialProduct(page);
    var row = decisionRecord(page) || {};
    var title = text(page.title) || fallbackTitle(product);
    var subject = text(row.subject) || title;
    var setting = text(row.context) || text(row.setting) || defaultSetting(page, product);
    var caption = text(row.caption_intent) || text(row.caption) || subject;
    var detailed =
      text(row.detailed_description) ||
      text(row.text_alternative) ||
      (product === "assessment_pack"
        ? "An editorial opening image for " +
          title +
          ". It establishes context for the assessment. It does not reveal answers or judgement information, it does not imply a level of competence, and it is not an assessment stimulus."
        : product === "situated_task"
        ? "An editorial opening image for " +
          title +
          ". It shows an authentic setting for learner-owned action. It does not reveal findings, model answers, or decisions the learner must make, and it is not documentary evidence."
        : "An editorial opening image for " +
          title +
          ". It establishes setting and atmosphere. It is an illustration, not documentary evidence, and it does not teach a mechanism.");
    var exclusions =
      product === "assessment_pack"
        ? [
            "Correct answers, answer sequences, classifications, matches, or other judgement information",
            "A claim that the learner has achieved a level of competence",
            "Inferred learner needs, diagnoses, or personal characteristics presented as facts",
            "Essential instructions or evidence that are not also in accessible text"
          ]
        : product === "situated_task"
        ? [
            "Findings, model answers, or decisions the learner must make",
            "Documentary evidence of a completed activity",
            "A labelled explanatory diagram"
          ]
        : [
            "Documentary or photographic evidence of a real event",
            "A labelled explanatory diagram of a mechanism",
            "Factual specifics that the chapter does not state"
          ];
    var disallowed =
      product === "assessment_pack"
        ? [
            "The image reveals correct answers or other judgement information.",
            "The image implies the learner has achieved a level of competence.",
            "The image states an inferred learner need, diagnosis, or personal characteristic as fact."
          ]
        : product === "situated_task"
        ? [
            "The image reveals findings, model answers, or decisions the learner must make.",
            "The image is documentary evidence of a completed activity."
          ]
        : [
            "The image is documentary evidence.",
            "The image teaches a causal mechanism."
          ];
    return {
      editorial_opening: true,
      editorial_product: product,
      brief_id: BRIEF_ID,
      job_id: JOB_ID,
      affordance_id: AFFORDANCE_ID,
      scope: "editorial",
      region: "editorial_opening",
      visual_slot: VISUAL_SLOT,
      subject: subject,
      context: setting,
      purpose: "editorial_opening",
      preferred_representation: "editorial_opening",
      caption_guidance: caption,
      caption_intent: caption,
      alt_text: text(row.alt_text) || clipAlt(subject),
      detailed_description: detailed,
      content_requirements: { authored: [subject], derived: [] },
      exclusion_requirements: {
        authored_must_not_show: exclusions,
        authored_disallowed_claims: [],
        authored_representation_avoid: []
      },
      claim_constraints: {
        allowed: [],
        disallowed: disallowed
      },
      spoiler_constraints: { anti_spoiler: false, learner_stage: "" },
      composition: {
        educational_function: "editorial_opening",
        learner_stage: "",
        primary_subject: subject
      }
    };
  }

  function openingHook(page) {
    if (!wantsEditorialJob(page)) return null;
    var row = decisionRecord(page) || {};
    return {
      slot: VISUAL_SLOT,
      activityId: "",
      sectionId: "",
      affordanceId: AFFORDANCE_ID,
      subject: text(row.subject)
    };
  }

  return {
    AFFORDANCE_ID: AFFORDANCE_ID,
    BRIEF_ID: BRIEF_ID,
    JOB_ID: JOB_ID,
    VISUAL_SLOT: VISUAL_SLOT,
    isExpositoryPage: isExpositoryPage,
    isSituatedTaskPage: isSituatedTaskPage,
    isAssessmentPackPage: isAssessmentPackPage,
    isJustifiedSkip: isJustifiedSkip,
    buildEditorialOpeningBrief: buildEditorialOpeningBrief,
    openingHook: openingHook
  };
});
