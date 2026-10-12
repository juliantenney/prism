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

  function buildEditorialOpeningBrief(page) {
    if (!isExpositoryPage(page) || isJustifiedSkip(page)) return null;
    var row = decisionRecord(page) || {};
    var title = text(page.title) || "this chapter";
    var headings = sectionHeadings(page);
    var subject = text(row.subject) || title;
    var setting = text(row.context) || text(row.setting);
    if (!setting) {
      setting = "Editorial opening for \"" + title + "\".";
      if (headings.length) {
        setting += " Chapter movement: " + headings.join("; ") + ".";
      }
    }
    var caption = text(row.caption_intent) || text(row.caption) || subject;
    var detailed =
      text(row.detailed_description) ||
      text(row.text_alternative) ||
      "An editorial opening image for " +
        title +
        ". It establishes setting and atmosphere. It is an illustration, not documentary evidence, and it does not teach a mechanism.";
    return {
      editorial_opening: true,
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
        authored_must_not_show: [
          "Documentary or photographic evidence of a real event",
          "A labelled explanatory diagram of a mechanism",
          "Factual specifics that the chapter does not state"
        ],
        authored_disallowed_claims: [],
        authored_representation_avoid: []
      },
      claim_constraints: {
        allowed: [],
        disallowed: [
          "The image is documentary evidence.",
          "The image teaches a causal mechanism."
        ]
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
    if (!isExpositoryPage(page) || isJustifiedSkip(page)) return null;
    var row = decisionRecord(page) || {};
    return {
      slot: VISUAL_SLOT,
      activityId: "",
      sectionId: "",
      affordanceId: AFFORDANCE_ID,
      subject: text(row.subject) || text(page && page.title)
    };
  }

  return {
    AFFORDANCE_ID: AFFORDANCE_ID,
    BRIEF_ID: BRIEF_ID,
    JOB_ID: JOB_ID,
    VISUAL_SLOT: VISUAL_SLOT,
    isExpositoryPage: isExpositoryPage,
    isJustifiedSkip: isJustifiedSkip,
    buildEditorialOpeningBrief: buildEditorialOpeningBrief,
    openingHook: openingHook
  };
});
