"use strict";

/**
 * Learner HTML for a hydrated Assessment Pack.
 * Determinate items reuse the existing closed-form checker.
 * Constructed performance reuses the written text-entry workspace and is not checked.
 */

var html = require("./render-html-utils");
var assessmentInteractive = require("./assessment-interactive");
var assessmentOutput = require("./assessment-output");

function paragraphs(values) {
  return values
    .filter(function (value) {
      return typeof value === "string" && value.trim();
    })
    .map(function (value) {
      return "<p>" + html.escapeHtml(value.trim()) + "</p>";
    })
    .join("");
}

function renderOrientation(pack) {
  var bringForward = html.arrayOrEmpty(pack.bringForward).filter(function (item) {
    return item && ((typeof item.what === "string" && item.what.trim()) || (typeof item.how_used === "string" && item.how_used.trim()));
  });
  var bringHtml = bringForward.length
    ? "<h3>What to bring with you</h3><ul>" +
      bringForward
        .map(function (item) {
          var what = typeof item.what === "string" ? item.what.trim() : "";
          var how = typeof item.how_used === "string" ? item.how_used.trim() : "";
          return (
            "<li>" +
            (what ? "<p>" + html.escapeHtml(what) + "</p>" : "") +
            (how ? "<p>" + html.escapeHtml(how) + "</p>" : "") +
            "</li>"
          );
        })
        .join("") +
      "</ul>"
    : "";
  if (!bringHtml) return "";
  return (
    '<section class="util-assessment-orientation" data-region="assessment-orientation">' +
    bringHtml +
    "</section>"
  );
}

function materialRows(materials) {
  return html.arrayOrEmpty(materials).filter(function (material) {
    return material && typeof material.body === "string" && material.body.trim();
  });
}

function isSelfEvaluationCriterion(material) {
  var title = material && typeof material.title === "string" ? material.title.trim() : "";
  return /^Self-evaluation\b/i.test(title);
}

function renderMaterialArticle(material) {
  var title = typeof material.title === "string" ? material.title.trim() : "";
  var body = typeof material.body === "string" ? material.body.trim() : "";
  if (!body) return "";
  return (
    '<article class="util-formative-material" data-material-id="' +
    html.escapeAttribute(String(material.material_id || "")) +
    '">' +
    (title ? "<h4>" + html.escapeHtml(title) + "</h4>" : "") +
    "<p>" +
    html.escapeHtml(body) +
    "</p></article>"
  );
}

function renderMaterials(materials, constructed) {
  var rows = materialRows(materials);
  if (!rows.length) return "";
  return (
    '<section class="util-formative-return" data-region="formative-return" data-automated-judgement="false">' +
    (constructed
      ? "<h3>Compare your work with these criteria</h3>" +
        "<p>These are for your own comparison. Your response is not marked correct or incorrect.</p>"
      : "") +
    rows.map(renderMaterialArticle).join("") +
    "</section>"
  );
}

function renderSelfEvaluationCarousel(criteria, responseFieldId) {
  var total = criteria.length;
  var panels = criteria
    .map(function (material, index) {
      var title = typeof material.title === "string" ? material.title.trim() : "";
      var body = typeof material.body === "string" ? material.body.trim() : "";
      var headingId = responseFieldId + "-criterion-" + String(index);
      return (
        '<section class="util-guided-review__panel" data-guided-review-index="' +
        html.escapeAttribute(String(index)) +
        '" data-material-id="' +
        html.escapeAttribute(String(material.material_id || "")) +
        '"' +
        (title ? ' aria-labelledby="' + html.escapeAttribute(headingId) + '"' : "") +
        ">" +
        '<p class="util-guided-review__progress" data-guided-review-progress>' +
        html.escapeHtml(String(index + 1) + " of " + String(total)) +
        "</p>" +
        (title ? '<h4 id="' + html.escapeAttribute(headingId) + '">' + html.escapeHtml(title) + "</h4>" : "") +
        "<p>" +
        html.escapeHtml(body) +
        "</p></section>"
      );
    })
    .join("");
  return (
    '<section class="util-formative-return" data-region="formative-return" data-automated-judgement="false">' +
    "<h3>Compare your work with these criteria</h3>" +
    "<p>These are for your own comparison. Your response is not marked correct or incorrect.</p>" +
    '<div class="util-assessment-self-evaluation util-guided-review" data-guided-review="true" data-guided-review-count="' +
    html.escapeAttribute(String(total)) +
    '" role="region" aria-label="Guided self-evaluation">' +
    '<p class="util-guided-review__status util-visually-hidden" aria-live="polite" data-guided-review-status></p>' +
    '<div class="util-guided-review__panels">' +
    panels +
    "</div>" +
    '<div class="util-guided-review__nav" hidden data-guided-review-nav>' +
    '<button type="button" class="util-guided-review__nav-btn util-guided-review__nav-btn--prev" data-guided-review-prev disabled aria-label="Previous criterion">Previous</button>' +
    '<button type="button" class="util-guided-review__nav-btn util-guided-review__nav-btn--next" data-guided-review-next aria-label="Next criterion">Next</button>' +
    "</div>" +
    '<p><a href="#' +
    html.escapeAttribute(responseFieldId) +
    '" data-assessment-return-to-response="' +
    html.escapeAttribute(responseFieldId) +
    '">Return to your written judgement</a></p>' +
    "</div></section>"
  );
}

function isWeaknessRevisionMaterial(material) {
  var title = typeof material.title === "string" ? material.title.trim() : "";
  return /^Identify one weakness\b/i.test(title);
}

function renderConstructedMaterials(materials, responseFieldId) {
  var rows = materialRows(materials);
  var criteria = rows.filter(isSelfEvaluationCriterion);
  var accompanying = [];
  if (criteria.length >= 2) {
    accompanying = rows.filter(function (material) {
      return !isSelfEvaluationCriterion(material);
    });
  }
  var authoredRevisionMaterial = (criteria.length >= 2 ? accompanying : rows).some(isWeaknessRevisionMaterial);
  var argumentReview = criteria.length >= 2 || criteria.length === 1 || authoredRevisionMaterial;
  var criteriaHtml =
    criteria.length >= 2
      ? renderSelfEvaluationCarousel(criteria, responseFieldId)
      : renderMaterials(criteria.length >= 2 ? criteria : rows, criteria.length === 1);
  return {
    html: criteriaHtml + (criteria.length >= 2 ? renderMaterials(accompanying, false) : ""),
    guided: criteria.length >= 2,
    argumentReview: argumentReview,
    authoredRevisionMaterial: authoredRevisionMaterial
  };
}

function renderDeterminateExplanation(materials) {
  var inner = renderMaterials(materials, false);
  if (!inner) return "";
  return inner.replace("<section ", '<section hidden data-assessment-explanation="true" ');
}

function renderReviewDisclosure(fieldId, bodyHtml) {
  if (!bodyHtml) return "";
  var regionId = fieldId + "-review";
  return (
    '<p><button type="button" class="util-assessment-check" data-assessment-open-review aria-expanded="false" aria-controls="' +
    html.escapeAttribute(regionId) +
    '">Review your response</button></p>' +
    '<div id="' +
    html.escapeAttribute(regionId) +
    '" class="util-assessment-review-region" data-assessment-review-region hidden tabindex="-1">' +
    '<p class="util-visually-hidden" aria-live="polite" data-assessment-review-status></p>' +
    bodyHtml +
    "</div>"
  );
}
function renderForward(text, revision) {
  var forward = typeof text === "string" ? text.trim() : "";
  var prompt = revision && revision.offered && typeof revision.prompt === "string" ? revision.prompt.trim() : "";
  if (!forward && !prompt) return "";
  return (
    '<section class="util-elicitation-forward" data-region="elicitation-forward">' +
    (forward ? "<p>" + html.escapeHtml(forward) + "</p>" : "") +
    (prompt
      ? '<p class="util-revision-offer" data-revision-offered="true">' +
        html.escapeHtml(prompt) +
        "</p>"
      : "") +
    "</section>"
  );
}

function renderRevisionStep(unit, fieldId, argumentReview, authoredRevisionMaterial) {
  var prompt =
    unit.revision && unit.revision.offered && typeof unit.revision.prompt === "string"
      ? unit.revision.prompt.trim()
      : "";
  if (authoredRevisionMaterial) prompt = "";
  if (!prompt && !argumentReview) return "";
  if (!argumentReview) {
    return (
      '<section class="util-assessment-revision" data-region="assessment-revision" data-automated-judgement="false">' +
      '<p class="util-revision-offer" data-revision-offered="true">' +
      html.escapeHtml(prompt) +
      "</p>" +
      '<p><a href="#' +
      html.escapeAttribute(fieldId) +
      '" data-assessment-return-to-response="' +
      html.escapeAttribute(fieldId) +
      '">Return to your response</a></p>' +
      "</section>"
    );
  }
  var weaknessId = fieldId + "-weakness";
  return (
    '<section class="util-assessment-revision" data-region="assessment-revision" data-automated-judgement="false">' +
    (prompt
      ? '<p class="util-revision-offer" data-revision-offered="true">' + html.escapeHtml(prompt) + "</p>"
      : "") +
    '<div class="util-learner-workspace" data-workspace-kind="text_entry" data-workspace-id="' +
    html.escapeAttribute(weaknessId) +
    '" data-assessment-judgement="none">' +
    '<label class="util-learner-workspace__label" for="' +
    html.escapeAttribute(weaknessId) +
    '">What is the most important weakness you identified in your argument?</label>' +
    '<textarea class="util-learner-workspace__input" id="' +
    html.escapeAttribute(weaknessId) +
    '" name="' +
    html.escapeAttribute(weaknessId) +
    '" rows="3"></textarea>' +
    "</div>" +
    "<p>Revision is yours to make. It is not marked correct or incorrect.</p>" +
    '<p><a href="#' +
    html.escapeAttribute(fieldId) +
    '" data-assessment-return-to-response="' +
    html.escapeAttribute(fieldId) +
    '">Revise your written judgement</a></p>' +
    "</section>"
  );
}

function renderConstructed(unit) {
  var fieldId = "assessment-constructed-" + String(unit.elicitationId || "response");
  var materials = renderConstructedMaterials(unit.materials, fieldId);
  var revisionPrompt =
    unit.revision && unit.revision.offered && typeof unit.revision.prompt === "string" ? unit.revision.prompt : "";
  var argumentReview =
    materials.argumentReview || /\b(weakness|written judgement|argument)\b/i.test(revisionPrompt);
  return (
    '<article class="util-assessment-item util-assessment-item--constructed" data-assessment-mode="constructed" data-auto-checkable="false" data-elicitation-id="' +
    html.escapeAttribute(unit.elicitationId || "") +
    '">' +
    (typeof unit.promptTitle === "string" && unit.promptTitle.trim()
      ? "<h3>" + html.escapeHtml(unit.promptTitle.trim()) + "</h3>"
      : "") +
    paragraphs([
      unit.instructions,
      unit.stimulus,
      unit.promptContext,
      unit.prompt,
      unit.responseExpectation,
      unit.suggestedLength,
      unit.indicativeTime
    ]) +
    '<div class="util-learner-workspace util-prose-measure" data-workspace-kind="text_entry" data-workspace-id="' +
    html.escapeAttribute(fieldId) +
    '" data-assessment-judgement="none">' +
    '<label class="util-learner-workspace__label" for="' +
    html.escapeAttribute(fieldId) +
    '">Your response</label>' +
    (typeof unit.guidance === "string" && unit.guidance.trim()
      ? "<p>" + html.escapeHtml(unit.guidance.trim()) + "</p>"
      : "") +
    '<textarea class="util-learner-workspace__input" id="' +
    html.escapeAttribute(fieldId) +
    '" name="' +
    html.escapeAttribute(fieldId) +
    '" rows="8"></textarea>' +
    "<p>Your response is not marked correct or incorrect.</p>" +
    "</div>" +
    renderReviewDisclosure(
      fieldId,
      materials.html + renderRevisionStep(unit, fieldId, argumentReview, materials.authoredRevisionMaterial)
    ) +
    renderForward(unit.forwardOrientation, null) +
    "</article>"
  );
}

function renderDeterminate(unit, indexStart) {
  var sourceItems = html.arrayOrEmpty(unit.items);
  var explanationText = materialRows(unit.materials)
    .map(function (material) {
      return String(material.body || "").trim();
    })
    .filter(Boolean)
    .join("\n\n");
  var sole = sourceItems.length === 1 ? sourceItems[0] : null;
  var folded =
    !!(sole && explanationText && !String(sole.feedback_note || sole.explanation || "").trim());
  var items = folded ? [Object.assign({}, sole, { feedback_note: explanationText })] : sourceItems;
  var rendered = items
    .map(function (item, offset) {
      return assessmentInteractive.renderAssessmentItem(item, indexStart + offset);
    })
    .join("");
  return {
    html:
      '<article class="util-assessment-elicitation" data-assessment-mode="determinate" data-elicitation-id="' +
      html.escapeAttribute(unit.elicitationId || "") +
      '">' +
      paragraphs([unit.instructions, unit.stimulus]) +
      rendered +
      (folded ? "" : renderDeterminateExplanation(unit.materials)) +
      renderForward(unit.forwardOrientation, unit.revision) +
      "</article>",
    nextIndex: indexStart + items.length
  };
}

function renderAssessmentEvidence(pack) {
  if (!pack) return "";
  var index = 0;
  var hasDeterminate = false;
  var units = html.arrayOrEmpty(pack.units).map(function (unit) {
    if (unit.kind === "constructed") return renderConstructed(unit);
    var rendered = renderDeterminate(unit, index);
    index = rendered.nextIndex;
    if (rendered.nextIndex > 0) hasDeterminate = true;
    return rendered.html;
  });
  if (html.arrayOrEmpty(pack.units).some(function (unit) {
    return unit.kind === "determinate" && html.arrayOrEmpty(unit.items).length;
  })) {
    hasDeterminate = true;
  }
  var timing = String(pack.feedbackTiming || "per_component");
  // The legacy learning-outcome summary is not an Assessment Pack output.
  // End-of-pack Finish still runs the existing item checks. It has no summary region.
  var summary =
    hasDeterminate && timing === "end_of_pack"
      ? '<button type="button" class="util-assessment-check" data-assessment-finish>Finish assessment</button>'
      : "";
  var packForward = typeof pack.packForward === "string" ? pack.packForward.trim() : "";
  return (
    '<section class="util-assessment-guidance util-assessment-section" data-region="assessment" data-assessment-product="assessment_pack" data-feedback-timing="' +
    html.escapeAttribute(timing) +
    '">' +
    renderOrientation(pack) +
    units.join("") +
    (packForward
      ? '<section class="util-pack-forward" data-region="pack-forward"><h2>What to take forward</h2>' +
        paragraphs(packForward.split(/\n\n+/)) +
        "</section>"
      : "") +
    assessmentOutput.renderAssessmentOutputRegion(pack.outputSpecification) +
    summary +
    "</section>"
  );
}

module.exports = {
  renderAssessmentEvidence: renderAssessmentEvidence
};
