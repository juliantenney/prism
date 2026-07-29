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

/**
 * Emit a learner figure with optional caption and expand affordance.
 *
 * @param {object} asset
 * @param {import("./types").VisualAffordanceHook} hook
 * @returns {string}
 */
function renderVisualAffordanceFigure(asset, hook) {
  var src = asset && asset.render_source ? String(asset.render_source.value || "").trim() : "";
  if (!src) return "";
  var alt = String(asset.alt_text || "").trim() || String(hook.subject || "").trim() || "Learning visual";
  var caption = "";
  if (asset.learner_caption) {
    caption =
      '<figcaption class="util-visual-asset-caption">' +
      html.escapeHtml(String(asset.learner_caption || "")) +
      "</figcaption>";
  }
  return (
    '<figure class="util-visual-asset util-visual-asset--expandable util-visual-asset--' +
    html.escapeAttribute(String(hook.slot || "").trim()) +
    '" data-visual-slot="' +
    html.escapeAttribute(String(hook.slot || "").trim()) +
    '" data-learner-content-kind="image">' +
    '<div class="util-visual-asset-media">' +
    '<img class="util-visual-asset-image" src="' +
    html.escapeAttribute(src) +
    '" alt="' +
    html.escapeAttribute(alt) +
    '" loading="lazy" decoding="async" />' +
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
      var figure = renderVisualAffordanceFigure(asset, hook);
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
  renderExpandControlHtml: renderExpandControlHtml
};
