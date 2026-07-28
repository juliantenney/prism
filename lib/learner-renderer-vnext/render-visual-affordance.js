"use strict";

var html = require("./render-html-utils");

/**
 * Emit a hidden DOM hook for downstream visual enhancement (Sprint 36/38 contract).
 *
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
    '<figure class="util-visual-asset util-visual-asset--' +
    html.escapeAttribute(String(hook.slot || "").trim()) +
    '" data-visual-slot="' +
    html.escapeAttribute(String(hook.slot || "").trim()) +
    '">' +
    '<img class="util-visual-asset-image" src="' +
    html.escapeAttribute(src) +
    '" alt="' +
    html.escapeAttribute(alt) +
    '" loading="lazy" decoding="async" />' +
    caption +
    "</figure>"
  );
}

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
  renderVisualAffordanceHook: renderVisualAffordanceHook
};
