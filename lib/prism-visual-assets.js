/**
 * Sprint 70 Slice 8 — deterministic local visual-asset association.
 * Presentation-layer only: no network, no persistence, no renderer mutation.
 */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.PRISM_VISUAL_ASSETS = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  var MANIFEST_VERSION = "70.8";
  var MAX_IMAGE_BYTES = 12 * 1024 * 1024;
  var ACCEPTED_MIME_TYPES = Object.freeze({
    "image/png": true,
    "image/jpeg": true,
    "image/webp": true
  });
  var VALID_INTAKE_METHODS = Object.freeze({
    drag: true,
    paste: true,
    file_picker: true
  });
  var VALID_RENDER_SOURCE_KINDS = Object.freeze({
    object_url: true,
    data_url: true,
    blob_reference: true
  });

  function deepClone(value) {
    if (value == null) return value;
    return JSON.parse(JSON.stringify(value));
  }

  function asTrimmedString(value) {
    return String(value == null ? "" : value).trim();
  }

  function normalizeToken(value) {
    return asTrimmedString(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function normalizeIntakeMethod(method) {
    var key = asTrimmedString(method).toLowerCase();
    return VALID_INTAKE_METHODS[key] ? key : "file_picker";
  }

  function normalizeBriefIdentity(brief) {
    var source = brief && typeof brief === "object" ? brief : {};
    return {
      brief_id: asTrimmedString(source.brief_id),
      job_id: asTrimmedString(source.job_id),
      affordance_id: asTrimmedString(source.affordance_id),
      scope: asTrimmedString(source.scope),
      activity_id: asTrimmedString(source.activity_id),
      visual_slot: asTrimmedString(source.visual_slot),
      schema_version: asTrimmedString(source.schema_version),
      subject: asTrimmedString(source.subject),
      preferred_representation: asTrimmedString(source.preferred_representation),
      caption_guidance: asTrimmedString(source.caption_guidance || source.caption_intent),
      alt_text: asTrimmedString(source.alt_text || source.altText),
      detailed_description: asTrimmedString(
        source.detailed_description || source.detailedDescription
      ),
      purpose: asTrimmedString(source.purpose),
      must_show: Array.isArray(source.must_show)
        ? source.must_show.slice()
        : Array.isArray(source.content_requirements && source.content_requirements.authored)
          ? source.content_requirements.authored.slice()
          : []
    };
  }

  function buildAssetIdForBrief(brief) {
    var identity = normalizeBriefIdentity(brief);
    if (!identity.brief_id) {
      throw new Error("buildAssetIdForBrief requires brief.brief_id");
    }
    return "asset-" + normalizeToken(identity.brief_id);
  }

  function inferExtensionFromMime(mime) {
    if (mime === "image/png") return "png";
    if (mime === "image/jpeg") return "jpg";
    if (mime === "image/webp") return "webp";
    return "img";
  }

  function normalizeFilename(filename, mimeType) {
    var base = asTrimmedString(filename);
    if (!base) return "visual." + inferExtensionFromMime(mimeType);
    return base.replace(/[\\\/]+/g, "_");
  }

  function getFigureDescriptionContract() {
    if (typeof root !== "undefined" && root.PRISM_LEARNER_FIGURE_DESCRIPTION_CONTRACT) {
      return root.PRISM_LEARNER_FIGURE_DESCRIPTION_CONTRACT;
    }
    if (typeof require === "function") {
      try {
        return require("./learner-figure-description-contract.js");
      } catch (err) {
        return null;
      }
    }
    return null;
  }

  function buildDeterministicAltText(brief) {
    var identity = normalizeBriefIdentity(brief);
    var contract = getFigureDescriptionContract();
    if (contract && typeof contract.buildConciseAltText === "function") {
      return contract.buildConciseAltText({
        alt_text: identity.alt_text,
        subject: identity.subject,
        purpose: identity.purpose,
        caption_intent: identity.caption_guidance
      });
    }
    if (identity.alt_text) return identity.alt_text;
    var rep = identity.preferred_representation
      ? identity.preferred_representation.replace(/[_-]+/g, " ")
      : "visual";
    var repLabel = rep.charAt(0).toUpperCase() + rep.slice(1);
    var subject = identity.subject || "the lesson topic";
    return repLabel + " showing " + subject + ".";
  }

  function validateVisualImageInput(imageInput, options) {
    var opts = options && typeof options === "object" ? options : {};
    var maxBytes = typeof opts.maxBytes === "number" && opts.maxBytes > 0 ? opts.maxBytes : MAX_IMAGE_BYTES;
    var input = imageInput && typeof imageInput === "object" ? imageInput : {};

    var mimeType = asTrimmedString(input.mime_type || input.mimeType).toLowerCase();
    if (!ACCEPTED_MIME_TYPES[mimeType]) {
      return { ok: false, code: "unsupported_mime_type", message: "Unsupported image type." };
    }
    var byteSize = Number(input.byte_size != null ? input.byte_size : input.byteSize);
    if (!Number.isFinite(byteSize) || byteSize <= 0) {
      return { ok: false, code: "empty_file", message: "Image file is empty." };
    }
    if (byteSize > maxBytes) {
      return {
        ok: false,
        code: "file_too_large",
        message: "Image exceeds the local size limit.",
        limit_bytes: maxBytes
      };
    }
    var width = Number(input.width);
    var height = Number(input.height);
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      return {
        ok: false,
        code: "invalid_dimensions",
        message: "Image decode failed or dimensions are invalid."
      };
    }
    var renderSource = input.render_source || input.renderSource || {};
    var renderKind = asTrimmedString(renderSource.kind).toLowerCase();
    var renderValue = asTrimmedString(renderSource.value);
    if (!VALID_RENDER_SOURCE_KINDS[renderKind] || !renderValue) {
      return {
        ok: false,
        code: "missing_render_source",
        message: "Missing local render source for preview."
      };
    }
    var previewSource = input.preview_source || input.previewSource || null;
    var normalizedPreviewSource = null;
    if (previewSource && typeof previewSource === "object") {
      var previewKind = asTrimmedString(previewSource.kind).toLowerCase();
      var previewValue = asTrimmedString(previewSource.value);
      if (VALID_RENDER_SOURCE_KINDS[previewKind] && previewValue) {
        normalizedPreviewSource = { kind: previewKind, value: previewValue };
      }
    }
    return {
      ok: true,
      normalized: {
        filename: normalizeFilename(input.filename || input.name, mimeType),
        mime_type: mimeType,
        byte_size: Math.floor(byteSize),
        width: Math.floor(width),
        height: Math.floor(height),
        render_source: { kind: renderKind, value: renderValue },
        preview_source: normalizedPreviewSource
      }
    };
  }

  function createVisualAssetAssociation(brief, imageInput, options) {
    var opts = options && typeof options === "object" ? options : {};
    var identity = normalizeBriefIdentity(brief);
    if (!identity.brief_id || !identity.job_id || !identity.affordance_id || !identity.visual_slot) {
      throw new Error("createVisualAssetAssociation requires canonical brief identity fields.");
    }
    var validation = validateVisualImageInput(imageInput, opts);
    if (!validation.ok) return validation;
    var normalized = validation.normalized;
    var detailedDescription = identity.detailed_description || undefined;
    return {
      ok: true,
      asset: {
        asset_id: buildAssetIdForBrief(identity),
        brief_id: identity.brief_id,
        job_id: identity.job_id,
        affordance_id: identity.affordance_id,
        scope: identity.scope || "activity",
        activity_id: identity.activity_id || undefined,
        visual_slot: identity.visual_slot,
        filename: normalized.filename,
        mime_type: normalized.mime_type,
        byte_size: normalized.byte_size,
        width: normalized.width,
        height: normalized.height,
        intake_method: normalizeIntakeMethod(opts.intakeMethod),
        status: "attached",
        source: "user-supplied",
        alt_text: buildDeterministicAltText(identity),
        detailed_description: detailedDescription,
        render_source: normalized.render_source,
        preview_source: normalized.preview_source,
        provenance: { source: "manual-visual-job-intake" }
      }
    };
  }

  function replaceVisualAssetAssociation(existingAsset, brief, imageInput, options) {
    var created = createVisualAssetAssociation(brief, imageInput, options);
    if (!created.ok) return created;
    if (existingAsset && typeof existingAsset === "object" && existingAsset.asset_id) {
      created.asset.asset_id = String(existingAsset.asset_id);
    }
    return created;
  }

  function removeVisualAssetAssociation(asset) {
    if (!asset || typeof asset !== "object") return { ok: false, code: "asset_not_found" };
    return { ok: true, asset_id: asTrimmedString(asset.asset_id), brief_id: asTrimmedString(asset.brief_id) };
  }

  function buildVisualAssetManifest(compilerResult, assetsByBriefId) {
    var briefs = compilerResult && Array.isArray(compilerResult.briefs) ? compilerResult.briefs : [];
    var map = assetsByBriefId && typeof assetsByBriefId === "object" ? assetsByBriefId : {};
    var assets = [];
    var missing = [];
    var activityAssets = 0;
    var pageAssets = 0;

    briefs.forEach(function (brief) {
      var briefId = asTrimmedString(brief && brief.brief_id);
      if (!briefId) return;
      var asset = map[briefId];
      if (asset && typeof asset === "object") {
        assets.push(deepClone(asset));
        if (String(asset.scope) === "page") pageAssets += 1;
        else activityAssets += 1;
      } else {
        missing.push(briefId);
      }
    });

    return {
      manifest_version: MANIFEST_VERSION,
      schema_version: asTrimmedString(compilerResult && compilerResult.schema_version),
      assets: assets,
      missing_brief_ids: missing,
      diagnostics: {
        briefs_received: briefs.length,
        assets_attached: assets.length,
        assets_missing: missing.length,
        activity_assets: activityAssets,
        page_assets: pageAssets
      }
    };
  }

  return {
    MANIFEST_VERSION: MANIFEST_VERSION,
    MAX_IMAGE_BYTES: MAX_IMAGE_BYTES,
    ACCEPTED_MIME_TYPES: ACCEPTED_MIME_TYPES,
    normalizeBriefIdentity: normalizeBriefIdentity,
    buildAssetIdForBrief: buildAssetIdForBrief,
    buildDeterministicAltText: buildDeterministicAltText,
    validateVisualImageInput: validateVisualImageInput,
    createVisualAssetAssociation: createVisualAssetAssociation,
    replaceVisualAssetAssociation: replaceVisualAssetAssociation,
    removeVisualAssetAssociation: removeVisualAssetAssociation,
    buildVisualAssetManifest: buildVisualAssetManifest
  };
});
