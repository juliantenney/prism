"use strict";

var html = require("./render-html-utils");

/**
 * Compact expand/maximise control for learner figures.
 * Kept local so the vNext browser bundle does not need an extra sibling module.
 */
function renderExpandControlHtml() {
  var icon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" ' +
    'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<polyline points="15 3 21 3 21 9"></polyline>' +
    '<polyline points="9 21 3 21 3 15"></polyline>' +
    '<line x1="21" y1="3" x2="14" y2="10"></line>' +
    '<line x1="3" y1="21" x2="10" y2="14"></line>' +
    "</svg>";
  return (
    '<button type="button" class="util-learner-content-expand" ' +
    'aria-label="View image larger" title="View image larger">' +
    icon +
    "</button>"
  );
}

function asTrimmedString(value) {
  return String(value == null ? "" : value).trim();
}

function normalizeStableIdToken(value) {
  return asTrimmedString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveFigureStableId(asset, hook) {
  var raw =
    (asset && (asset.asset_id || asset.brief_id || asset.affordance_id)) ||
    (hook && hook.affordanceId) ||
    "";
  var token = normalizeStableIdToken(raw);
  return token || "visual";
}

function stripLeadingFigureNumberLabel(text) {
  return asTrimmedString(text).replace(/^figure\s*\d+\s*[.:]\s*/i, "");
}

function allocateFigureNumber(renderOptions) {
  if (!renderOptions || typeof renderOptions !== "object") return null;
  if (typeof renderOptions.nextFigureNumber === "function") {
    return renderOptions.nextFigureNumber();
  }
  if (typeof renderOptions.figureCounter === "object" && renderOptions.figureCounter) {
    var counter = renderOptions.figureCounter;
    var current = Number(counter.value);
    if (!Number.isFinite(current) || current < 0) current = 0;
    current += 1;
    counter.value = current;
    return current;
  }
  return null;
}

/**
 * Caption body priority for substantive instructional figures:
 * 1. detailed_description (textbook learner prose; never invent)
 * 2. learner_caption (legacy short caption only when no detailed_description)
 * Figure N. is renderer-owned and never taken from generated prose.
 */
function resolveFigureCaptionParts(asset, figureNumber) {
  var detailed = stripLeadingFigureNumberLabel(
    asset && (asset.detailed_description || asset.detailedDescription)
  );
  var legacyCaption = stripLeadingFigureNumberLabel(asset && asset.learner_caption);
  var numberLabel =
    typeof figureNumber === "number" && figureNumber > 0 ? "Figure " + figureNumber + "." : "";

  if (detailed) {
    return {
      hasVisibleDescription: true,
      numberLabel: numberLabel,
      body: detailed,
      // Prefer detailed_description; do not duplicate a short caption that merely restates it.
      shortCaption: ""
    };
  }
  if (legacyCaption) {
    return {
      hasVisibleDescription: true,
      numberLabel: numberLabel,
      body: legacyCaption,
      shortCaption: ""
    };
  }
  if (numberLabel) {
    return {
      hasVisibleDescription: false,
      numberLabel: numberLabel,
      body: "",
      shortCaption: ""
    };
  }
  return {
    hasVisibleDescription: false,
    numberLabel: "",
    body: "",
    shortCaption: ""
  };
}

function renderFigureCaptionHtml(parts, descriptionId) {
  if (!parts.numberLabel && !parts.body) return "";
  var idAttr = descriptionId
    ? ' id="' + html.escapeAttribute(descriptionId) + '"'
    : "";
  var inner = "";
  if (parts.numberLabel) {
    inner += "<strong>" + html.escapeHtml(parts.numberLabel) + "</strong>";
  }
  if (parts.body) {
    inner += (parts.numberLabel ? " " : "") + html.escapeHtml(parts.body);
  }
  return (
    '<figcaption class="util-visual-asset-caption"' +
    idAttr +
    ">" +
    inner +
    "</figcaption>"
  );
}

/**
 * Emit a learner figure with optional caption and expand affordance.
 *
 * @param {object} asset
 * @param {import("./types").VisualAffordanceHook} hook
 * @param {object} [renderOptions]
 * @returns {string}
 */
function renderVisualAffordanceFigure(asset, hook, renderOptions) {
  var src = asset && asset.render_source ? String(asset.render_source.value || "").trim() : "";
  if (!src) return "";

  var figureNumber = allocateFigureNumber(renderOptions);
  var stableId = resolveFigureStableId(asset, hook);
  var descriptionId = "figure-description-" + stableId;
  var captionParts = resolveFigureCaptionParts(asset, figureNumber);
  var hasVisibleDescription = !!(captionParts.hasVisibleDescription && captionParts.body);

  var alt =
    asTrimmedString(asset && asset.alt_text) ||
    asTrimmedString(hook && hook.subject) ||
    "Learning visual";

  if (
    hasVisibleDescription &&
    !/detailed description follows/i.test(alt) &&
    asTrimmedString(asset && (asset.detailed_description || asset.detailedDescription))
  ) {
    // Soft signpost when authored alt omitted it; keep within a reasonable bound without mid-word cuts when short.
    var signposted = alt.replace(/[.]+$/, "") + "; detailed description follows.";
    if (signposted.length <= 160) alt = signposted;
  }

  if (
    renderOptions &&
    typeof renderOptions.registerVisualAssetWarning === "function" &&
    !asTrimmedString(asset && (asset.detailed_description || asset.detailedDescription))
  ) {
    renderOptions.registerVisualAssetWarning({
      code: "FIGURE_DETAILED_DESCRIPTION_MISSING",
      severity: "warn",
      brief_id: asTrimmedString(asset && asset.brief_id),
      affordance_id: asTrimmedString(asset && asset.affordance_id) || asTrimmedString(hook && hook.affordanceId),
      visual_slot: asTrimmedString(hook && hook.slot),
      message:
        "Substantive instructional figure is missing detailed_description (learner-facing textbook description)."
    });
  }

  var describedByAttr = hasVisibleDescription
    ? ' aria-describedby="' + html.escapeAttribute(descriptionId) + '"'
    : "";
  // Always attach a stable figcaption id when we emit a caption (number and/or body).
  // aria-describedby is only set when a real description body is present.
  var captionIdForDom =
    captionParts.numberLabel || captionParts.body ? descriptionId : "";
  var caption = renderFigureCaptionHtml(captionParts, captionIdForDom);

  return (
    '<figure class="util-visual-asset util-visual-asset--expandable util-visual-asset--' +
    html.escapeAttribute(String((hook && hook.slot) || "").trim()) +
    '" data-visual-slot="' +
    html.escapeAttribute(String((hook && hook.slot) || "").trim()) +
    '" data-learner-content-kind="image"' +
    (typeof figureNumber === "number" && figureNumber > 0
      ? ' data-figure-number="' + html.escapeAttribute(String(figureNumber)) + '"'
      : "") +
    ' data-figure-id="' +
    html.escapeAttribute(stableId) +
    '">' +
    '<div class="util-visual-asset-media">' +
    '<img class="util-visual-asset-image" src="' +
    html.escapeAttribute(src) +
    '" alt="' +
    html.escapeAttribute(alt) +
    '"' +
    describedByAttr +
    ' loading="lazy" decoding="async" />' +
    renderExpandControlHtml() +
    "</div>" +
    caption +
    "</figure>"
  );
}

/**
 * Emit a hidden DOM hook for downstream visual enhancement (Sprint 36/38 contract).
 *
 * @param {import("./types").VisualAffordanceHook} hook
 * @returns {string}
 */
function renderVisualAffordanceHook(hook, renderOptions) {
  if (!hook || !hook.slot) return "";
  var slotId = String(hook.slot || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-");
  if (!slotId) return "";

  var subject = String(hook.subject || "").trim();
  var activityId = String(hook.activityId || "").trim();
  var affordanceId = String(hook.affordanceId || "").trim();

  var attrs =
    ' class="util-visual-affordance util-visual-affordance--' +
    html.escapeAttribute(slotId) +
    '" data-visual-slot="' +
    html.escapeAttribute(slotId) +
    '" hidden aria-hidden="true"';

  if (subject) {
    attrs += ' data-visual-subject="' + html.escapeAttribute(subject) + '"';
  }
  if (activityId) {
    attrs += ' data-visual-activity-id="' + html.escapeAttribute(activityId) + '"';
    attrs += ' data-activity-id="' + html.escapeAttribute(activityId) + '"';
  }
  if (affordanceId) {
    attrs += ' data-affordance-id="' + html.escapeAttribute(affordanceId) + '"';
  }

  var resolver =
    renderOptions && typeof renderOptions.resolveVisualAsset === "function"
      ? renderOptions.resolveVisualAsset
      : null;
  if (resolver) {
    var asset = resolver(hook);
    if (asset) {
      var figure = renderVisualAffordanceFigure(asset, hook, renderOptions);
      if (!figure) {
        if (renderOptions && typeof renderOptions.registerVisualAssetWarning === "function") {
          renderOptions.registerVisualAssetWarning({
            code: "VAR_ASSET_SOURCE_UNAVAILABLE",
            brief_id: String(asset.brief_id || ""),
            affordance_id: String(asset.affordance_id || ""),
            visual_slot: String(hook.slot || "")
          });
        }
        return "";
      }
      if (renderOptions && typeof renderOptions.registerVisualAssetPlacement === "function") {
        renderOptions.registerVisualAssetPlacement({
          brief_id: String(asset.brief_id || ""),
          affordance_id: String(asset.affordance_id || ""),
          activity_id: String(asset.activity_id || ""),
          visual_slot: String(hook.slot || ""),
          figure_emitted: true
        });
      }
      return figure;
    }
  }
  return "<div" + attrs + "></div>";
}

module.exports = {
  renderVisualAffordanceHook: renderVisualAffordanceHook,
  renderVisualAffordanceFigure: renderVisualAffordanceFigure,
  renderExpandControlHtml: renderExpandControlHtml,
  resolveFigureCaptionParts: resolveFigureCaptionParts,
  allocateFigureNumber: allocateFigureNumber
};
