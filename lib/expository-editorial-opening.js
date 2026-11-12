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

  function isLearningJourneyPage(page) {
    if (!page || typeof page !== "object" || Array.isArray(page)) return false;
    return text(page.product_id).toLowerCase() === "learning_journey";
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

  /**
   * Standalone Interactive learner page: activities + Design Page synthesis, and not
   * another first-class product that owns its own editorial opening path.
   */
  function isInteractivePage(page) {
    if (!page || typeof page !== "object" || Array.isArray(page)) return false;
    if (
      isSituatedTaskPage(page) ||
      isAssessmentPackPage(page) ||
      isLearningJourneyPage(page) ||
      isExpositoryPage(page)
    ) {
      return false;
    }
    if (text(page.product_id).toLowerCase() === "interactive") return true;
    var hasActivities = Array.isArray(page.activities) && page.activities.length > 0;
    if (!hasActivities) return false;
    var enriched =
      page.assembly_state && Array.isArray(page.assembly_state.enriched_by)
        ? page.assembly_state.enriched_by
        : [];
    var hasDesignPage = false;
    var i;
    for (i = 0; i < enriched.length; i += 1) {
      if (text(enriched[i]) === "design_page") {
        hasDesignPage = true;
        break;
      }
    }
    if (hasDesignPage) return true;
    return !!(
      page.page_synthesis &&
      typeof page.page_synthesis === "object" &&
      !Array.isArray(page.page_synthesis)
    );
  }

  function isEditorialOpeningPage(page) {
    return (
      isSituatedTaskPage(page) ||
      isAssessmentPackPage(page) ||
      isLearningJourneyPage(page) ||
      isExpositoryPage(page) ||
      isInteractivePage(page)
    );
  }

  function editorialProduct(page) {
    if (isSituatedTaskPage(page)) return "situated_task";
    if (isAssessmentPackPage(page)) return "assessment_pack";
    if (isLearningJourneyPage(page)) return "learning_journey";
    if (isExpositoryPage(page)) return "expository";
    if (isInteractivePage(page)) return "interactive";
    return "";
  }

  function isExplicitGenerate(page) {
    var row = decisionRecord(page);
    return !!(row && text(row.decision).toLowerCase() === "generate");
  }

  function wantsEditorialJob(page) {
    if (!isEditorialOpeningPage(page) || isJustifiedSkip(page)) return false;
    var product = editorialProduct(page);
    // Assessment Pack: optional decision (generate or skip). Interactive authoring now
    // requires generate, but legacy Interactive pages may still omit the field — only
    // commission when Design Page explicitly chooses generate. Skip/omit leave layout unchanged.
    if (product === "assessment_pack" || product === "interactive") {
      return isExplicitGenerate(page);
    }
    return true;
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
    if (product === "learning_journey") return "this journey";
    if (product === "interactive") return "this resource";
    return "this chapter";
  }

  function activityTitles(page) {
    var titles = [];
    var activities = page && Array.isArray(page.activities) ? page.activities : [];
    activities.forEach(function (activity) {
      var title = text(activity && activity.title);
      if (title && titles.indexOf(title) === -1) titles.push(title);
    });
    return titles;
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
    if (product === "learning_journey") {
      var journey =
        "Editorial opening for \"" +
        title +
        "\". Orient the learner to the journey as a whole. Do not reveal answers, findings, or decisions from later experiences.";
      if (headings.length) journey += " Journey movement: " + headings.join("; ") + ".";
      return journey;
    }
    if (product === "interactive") {
      var interactive =
        "Editorial opening for \"" +
        title +
        "\". Establish atmosphere or context for the Interactive resource. Do not reveal evidence, clues, interpretations or answers reserved for later activities.";
      var titles = activityTitles(page);
      if (titles.length) interactive += " Activity sequence: " + titles.join("; ") + ".";
      return interactive;
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
    // caption_intent / caption are production authoring guidance for the image job.
    // They are not learner-facing figure captions. Only an explicit learner_caption
    // field (when authored) becomes a visible caption at publish time.
    var productionCaption =
      text(row.caption_intent) || text(row.caption) || text(row.caption_guidance) || "";
    var learnerCaption =
      text(row.learner_caption) || text(row.learner_facing_caption) || "";
    var caption = productionCaption || subject;
    var detailed =
      text(row.detailed_description) ||
      text(row.text_alternative) ||
      (product === "assessment_pack"
        ? "A decorative, text-free editorial opening image for " +
          title +
          ". It establishes context for the assessment through scene and atmosphere only. It contains no overlays or labels, does not reveal answers or judgement information, does not imply a level of competence, and is not an assessment stimulus."
        : product === "situated_task"
        ? "A decorative, text-free editorial opening image for " +
          title +
          ". It shows an authentic setting for learner-owned action. It contains no overlays or labels, does not reveal findings, model answers, or decisions the learner must make, and it is not documentary evidence."
        : product === "learning_journey"
        ? "A decorative, text-free editorial opening image for " +
          title +
          ". It orients the learner to the journey as a whole through scene and atmosphere. It contains no overlays or labels, does not reveal answers, findings, or decisions from later experiences, and it is not documentary evidence."
        : product === "interactive"
        ? "A decorative, text-free editorial opening image for " +
          title +
          ". It establishes atmosphere or context for the Interactive resource. It contains no overlays or labels, does not reveal evidence, clues, interpretations or answers reserved for later activities, and it is not a Knowledge Summary or activity illustration."
        : "A decorative, text-free editorial opening image for " +
          title +
          ". It establishes setting and atmosphere through scene and composition only. It contains no overlays or labels, is not documentary evidence, and does not teach a mechanism.");
    var sharedTextFreeExclusions = [
      "Text overlays, caption panels, titles, labels, slogans, embedded typography, or explanatory banners",
      "Instructional diagrams or any visual that conveys essential facts only available in the image"
    ];
    var exclusions =
      product === "assessment_pack"
        ? sharedTextFreeExclusions.concat([
            "Correct answers, answer sequences, classifications, matches, or other judgement information",
            "A claim that the learner has achieved a level of competence",
            "Inferred learner needs, diagnoses, or personal characteristics presented as facts",
            "Essential instructions or evidence that are not also in accessible text"
          ])
        : product === "situated_task"
        ? sharedTextFreeExclusions.concat([
            "Findings, model answers, or decisions the learner must make",
            "Documentary evidence of a completed activity",
            "A labelled explanatory diagram"
          ])
        : product === "learning_journey"
        ? sharedTextFreeExclusions.concat([
            "Answers, findings, or decisions from later experiences",
            "A labelled explanatory diagram of a later task",
            "Documentary or photographic evidence of a real event"
          ])
        : product === "interactive"
        ? sharedTextFreeExclusions.concat([
            "Evidence, clues, interpretations or answers reserved for later activities",
            "A Knowledge Summary diagram or activity-specific illustration",
            "A labelled explanatory diagram that teaches the activity method",
            "Documentary or photographic evidence of a real event"
          ])
        : sharedTextFreeExclusions.concat([
            "Documentary or photographic evidence of a real event",
            "A labelled explanatory diagram of a mechanism",
            "Factual specifics that the chapter does not state"
          ]);
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
        : product === "learning_journey"
        ? [
            "The image reveals answers, findings, or decisions from later experiences.",
            "The image is documentary evidence."
          ]
        : product === "interactive"
        ? [
            "The image reveals evidence, clues, interpretations or answers reserved for later activities.",
            "The image substitutes for the Knowledge Summary or an activity graphic.",
            "The image is documentary evidence."
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
      learner_caption: learnerCaption || undefined,
      // Decorative opening: learner img uses empty alt; no figure caption unless learner_caption is set.
      alt_text: "",
      decorative: true,
      detailed_description: detailed,
      content_requirements: { authored: [subject], derived: [] },
      exclusion_requirements: {
        authored_must_not_show: exclusions,
        authored_disallowed_claims: [],
        authored_representation_avoid: []
      },
      claim_constraints: {
        allowed: [],
        disallowed: disallowed.concat([
          "The image contains text overlays, labels, titles, slogans, or explanatory banners."
        ])
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
    isLearningJourneyPage: isLearningJourneyPage,
    isInteractivePage: isInteractivePage,
    isJustifiedSkip: isJustifiedSkip,
    buildEditorialOpeningBrief: buildEditorialOpeningBrief,
    openingHook: openingHook
  };
});
