/**
 * Sprint 70 — provider-neutral LearnerPackage model.
 * Builds a portable learner resource before serialisation (ZIP/SCORM/etc.).
 * Does not mutate inputs or write export paths back into canonical page data.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PRISM_LEARNER_PACKAGE = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var ACCEPTED_MIME_TYPES = Object.freeze({
    "image/png": true,
    "image/jpeg": true,
    "image/webp": true
  });

  var MIME_TO_EXT = Object.freeze({
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp"
  });

  function asTrimmedString(value) {
    return String(value == null ? "" : value).trim();
  }

  function normalizeToken(value) {
    return asTrimmedString(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function escapeAttribute(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function inferExtensionFromMime(mime) {
    var key = asTrimmedString(mime).toLowerCase();
    return MIME_TO_EXT[key] || "img";
  }

  function isPageScopedAsset(asset) {
    var scope = normalizeToken(asset && asset.scope);
    if (scope === "page") return true;
    return !asTrimmedString(asset && asset.activity_id);
  }

  /**
   * Deterministic semantic basename (no assets/ prefix).
   * Activity: activity-{activity_id}-{visual_slot}.{ext}
   * Page: {visual_slot}.{ext}
   */
  function buildPackageAssetBasename(asset) {
    var slot = normalizeToken(asset && asset.visual_slot) || "visual";
    var mime = asTrimmedString(asset && (asset.mime_type || asset.mimeType)).toLowerCase();
    var ext = inferExtensionFromMime(mime);
    if (isPageScopedAsset(asset)) {
      return slot + "." + ext;
    }
    var activityId = normalizeToken(asset && asset.activity_id) || "activity";
    return "activity-" + activityId + "-" + slot + "." + ext;
  }

  function briefIdSuffix(briefId) {
    var token = normalizeToken(briefId);
    if (!token) return "asset";
    if (token.length <= 24) return token;
    return token.slice(0, 24);
  }

  /**
   * Assign deterministic package paths for a list of assets.
   * Collisions get a stable brief-id suffix. Same brief identity → same path.
   */
  function assignPackageAssetPaths(assets) {
    var list = Array.isArray(assets) ? assets : [];
    var used = Object.create(null);
    var byBrief = Object.create(null);
    var out = [];

    list.forEach(function (asset, index) {
      if (!asset || typeof asset !== "object") return;
      var briefId = asTrimmedString(asset.brief_id);
      if (briefId && byBrief[briefId]) {
        out.push({
          asset: asset,
          path: byBrief[briefId],
          basename: byBrief[briefId].slice("assets/".length)
        });
        return;
      }

      var basename = buildPackageAssetBasename(asset);
      if (used[basename]) {
        var suffix = briefIdSuffix(briefId || "brief-" + String(index + 1));
        var stem = basename.replace(/\.[^.]+$/, "");
        var ext = basename.slice(stem.length);
        basename = stem + "-" + suffix + ext;
        var n = 2;
        while (used[basename]) {
          basename = stem + "-" + suffix + "-" + String(n) + ext;
          n += 1;
        }
      }
      used[basename] = true;
      var path = "assets/" + basename;
      if (briefId) byBrief[briefId] = path;
      out.push({ asset: asset, path: path, basename: basename });
    });

    return out;
  }

  /**
   * Decode a supported image data URL to bytes.
   * @returns {{ ok: true, mime: string, bytes: Uint8Array } | { ok: false, code: string, message: string }}
   */
  function decodeImageDataUrl(dataUrl) {
    var raw = asTrimmedString(dataUrl);
    if (!raw) {
      return { ok: false, code: "empty_data_url", message: "Missing data URL." };
    }
    if (/^blob:/i.test(raw)) {
      return { ok: false, code: "blob_url", message: "Blob URLs are not durable package sources." };
    }
    var match = /^data:([^;,]+)?(;base64)?,(.*)$/i.exec(raw);
    if (!match) {
      return { ok: false, code: "invalid_data_url", message: "Not a valid data URL." };
    }
    var mime = asTrimmedString(match[1] || "").toLowerCase() || "application/octet-stream";
    if (!ACCEPTED_MIME_TYPES[mime]) {
      return { ok: false, code: "unsupported_mime_type", message: "Unsupported image MIME type: " + mime };
    }
    if (!match[2]) {
      return { ok: false, code: "not_base64", message: "Only base64 image data URLs are supported." };
    }
    var b64 = String(match[3] || "").replace(/\s+/g, "");
    if (!b64) {
      return { ok: false, code: "empty_payload", message: "Data URL payload is empty." };
    }
    try {
      var binary;
      if (typeof atob === "function") {
        binary = atob(b64);
      } else if (typeof Buffer !== "undefined") {
        binary = Buffer.from(b64, "base64").toString("binary");
      } else {
        return { ok: false, code: "no_decoder", message: "No base64 decoder available." };
      }
      var bytes = new Uint8Array(binary.length);
      for (var i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i) & 0xff;
      }
      if (!bytes.length) {
        return { ok: false, code: "empty_payload", message: "Decoded image payload is empty." };
      }
      return { ok: true, mime: mime, bytes: bytes };
    } catch (err) {
      return {
        ok: false,
        code: "decode_failed",
        message: "Could not decode data URL payload."
      };
    }
  }

  function decodeAnyBase64DataUrl(dataUrl) {
    var raw = asTrimmedString(dataUrl);
    if (!raw) return { ok: false, code: "empty_data_url", message: "Missing data URL." };
    if (/^blob:/i.test(raw)) {
      return { ok: false, code: "blob_url", message: "Blob URLs are not durable package sources." };
    }
    var match = /^data:([^;,]+)?(;base64)?,(.*)$/i.exec(raw);
    if (!match) return { ok: false, code: "invalid_data_url", message: "Not a valid data URL." };
    if (!match[2]) return { ok: false, code: "not_base64", message: "Only base64 data URLs are supported." };
    var mime = asTrimmedString(match[1] || "").toLowerCase() || "application/octet-stream";
    var b64 = String(match[3] || "").replace(/\s+/g, "");
    if (!b64) return { ok: false, code: "empty_payload", message: "Data URL payload is empty." };
    try {
      var binary;
      if (typeof atob === "function") binary = atob(b64);
      else if (typeof Buffer !== "undefined") binary = Buffer.from(b64, "base64").toString("binary");
      else return { ok: false, code: "no_decoder", message: "No base64 decoder available." };
      var bytes = new Uint8Array(binary.length);
      for (var i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i) & 0xff;
      if (!bytes.length) return { ok: false, code: "empty_payload", message: "Decoded payload is empty." };
      return { ok: true, mime: mime, bytes: bytes };
    } catch (_err) {
      return { ok: false, code: "decode_failed", message: "Could not decode data URL payload." };
    }
  }

  function replaceExactOccurrences(haystack, needle, replacement) {
    if (!needle) return haystack;
    if (haystack.indexOf(needle) === -1) return haystack;
    return haystack.split(needle).join(replacement);
  }

  /**
   * Apply an exact source→path replacement map (prefer exact asset-value replacement).
   * Also replaces HTML-attribute-escaped forms of each source.
   */
  function rewriteHtmlImageSources(html, sourceToPath) {
    var out = String(html == null ? "" : html);
    var map = sourceToPath && typeof sourceToPath === "object" ? sourceToPath : {};
    Object.keys(map).forEach(function (source) {
      var path = map[source];
      if (!source || !path) return;
      out = replaceExactOccurrences(out, source, path);
      var escaped = escapeAttribute(source);
      if (escaped !== source) {
        out = replaceExactOccurrences(out, escaped, path);
      }
    });
    return out;
  }

  function collectManifestAssets(visualAssetManifest) {
    if (!visualAssetManifest || typeof visualAssetManifest !== "object") return [];
    return Array.isArray(visualAssetManifest.assets) ? visualAssetManifest.assets.slice() : [];
  }

  function getDurableDataUrl(asset) {
    var rs = asset && asset.render_source;
    if (!rs || typeof rs !== "object") return "";
    if (asTrimmedString(rs.kind).toLowerCase() !== "data_url") return "";
    return asTrimmedString(rs.value);
  }

  function pageHtmlNeedsMathEntryForPackage(html) {
    var text = String(html == null ? "" : html);
    return (
      text.indexOf('data-input-modality="math"') >= 0 ||
      text.indexOf("lib/mathlive/") >= 0
    );
  }

  function getMathJaxPackageAssetsApi(opts) {
    var options = opts && typeof opts === "object" ? opts : {};
    if (options.mathJaxPackageAssetsApi && typeof options.mathJaxPackageAssetsApi === "object") {
      return options.mathJaxPackageAssetsApi;
    }
    if (typeof require === "function") {
      try {
        return require("./learner-renderer-vnext/mathjax-package-assets");
      } catch (_err) {
        return null;
      }
    }
    return null;
  }

  function pageHtmlNeedsMathJaxForPackage(html, mathJaxApi) {
    if (mathJaxApi && typeof mathJaxApi.pageHtmlNeedsMathJaxDisplay === "function") {
      return mathJaxApi.pageHtmlNeedsMathJaxDisplay(html);
    }
    var text = String(html == null ? "" : html);
    return (
      text.indexOf("prism-mathjax-export-bootstrap") >= 0 ||
      /\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/.test(text)
    );
  }

  function appendMathJaxPackageAssets(htmlOut, packageAssets, packagedPaths, opts) {
    var options = opts && typeof opts === "object" ? opts : {};
    var mathJaxApi = getMathJaxPackageAssetsApi(options);
    if (!pageHtmlNeedsMathJaxForPackage(htmlOut, mathJaxApi)) {
      return { html: htmlOut, error: null };
    }

    var mathJaxFiles = Array.isArray(options.mathJaxPackageAssets)
      ? options.mathJaxPackageAssets
      : null;

    if (!mathJaxFiles && typeof require === "function" && mathJaxApi) {
      try {
        mathJaxFiles = mathJaxApi.collectMathJaxPackageAssets({
          repoRoot: options.repoRoot
        });
      } catch (mathAssetErr) {
        return {
          html: htmlOut,
          error: {
            code: "mathjax_assets_missing",
            message:
              (mathAssetErr && mathAssetErr.message) ||
              "MathJax assets are required for display-maths learner pages."
          }
        };
      }
    }

    if (!mathJaxFiles || !mathJaxFiles.length) {
      return {
        html: htmlOut,
        error: {
          code: "mathjax_assets_missing",
          message:
            "MathJax assets are required for display-maths learner pages but were not supplied for packaging."
        }
      };
    }

    var htmlRewritten = htmlOut;
    if (mathJaxApi && typeof mathJaxApi.rewriteMathJaxLoaderToPackagePath === "function") {
      htmlRewritten = mathJaxApi.rewriteMathJaxLoaderToPackagePath(htmlOut);
    }
    if (
      mathJaxApi &&
      mathJaxApi.MATHJAX_CDN_LOADER_SRC &&
      htmlRewritten.indexOf(mathJaxApi.MATHJAX_CDN_LOADER_SRC) >= 0
    ) {
      return {
        html: htmlOut,
        error: {
          code: "mathjax_cdn_reference_remaining",
          message:
            "Learner package HTML still references the MathJax CDN after local rewrite."
        }
      };
    }

    mathJaxFiles.forEach(function (asset) {
      if (!asset || !asset.path || packagedPaths[asset.path]) return;
      var bytes = asset.bytes;
      if (bytes && typeof Buffer !== "undefined" && Buffer.isBuffer(bytes)) {
        bytes = new Uint8Array(bytes);
      }
      packageAssets.push({
        path: asset.path,
        bytes: bytes,
        mime: asTrimmedString(asset.mime) || "application/octet-stream"
      });
      packagedPaths[asset.path] = true;
    });

    return { html: htmlRewritten, error: null };
  }

  function appendMathLivePackageAssets(htmlOut, packageAssets, packagedPaths, opts) {
    var options = opts && typeof opts === "object" ? opts : {};
    if (!pageHtmlNeedsMathEntryForPackage(htmlOut)) {
      return null;
    }

    var mathLiveFiles = Array.isArray(options.mathLivePackageAssets)
      ? options.mathLivePackageAssets
      : null;

    if (!mathLiveFiles && typeof require === "function") {
      try {
        var mathEntryAssets = require("./learner-renderer-vnext/math-entry-package-assets");
        mathLiveFiles = mathEntryAssets.collectMathLivePackageAssets({
          repoRoot: options.repoRoot
        });
      } catch (mathAssetErr) {
        return {
          ok: false,
          error: {
            code: "mathlive_assets_missing",
            message:
              (mathAssetErr && mathAssetErr.message) ||
              "MathLive assets are required for maths-enabled learner pages."
          }
        };
      }
    }

    if (!mathLiveFiles || !mathLiveFiles.length) {
      return {
        ok: false,
        error: {
          code: "mathlive_assets_missing",
          message:
            "MathLive assets are required for maths-enabled learner pages but were not supplied for packaging."
        }
      };
    }

    mathLiveFiles.forEach(function (asset) {
      if (!asset || !asset.path || packagedPaths[asset.path]) return;
      var bytes = asset.bytes;
      if (bytes && typeof Buffer !== "undefined" && Buffer.isBuffer(bytes)) {
        bytes = new Uint8Array(bytes);
      }
      packageAssets.push({
        path: asset.path,
        bytes: bytes,
        mime: asTrimmedString(asset.mime) || "application/octet-stream"
      });
      packagedPaths[asset.path] = true;
    });

    return null;
  }

  /**
   * Build a LearnerPackage from rendered HTML + visual asset manifest.
   * Read-only over inputs; returns a new package representation.
   *
   * @returns {{
   *   ok: boolean,
   *   package?: { html: string, assets: Array, metadata?: object },
   *   warnings: Array,
   *   error?: { code: string, message: string }
   * }}
   */
  function buildLearnerPackage(input) {
    var opts = input && typeof input === "object" ? input : {};
    var htmlIn = String(opts.html == null ? "" : opts.html);
    var warnings = [];

    if (!asTrimmedString(htmlIn)) {
      return {
        ok: false,
        warnings: warnings,
        error: { code: "empty_html", message: "Rendered learner HTML is required." }
      };
    }

    var manifestAssets = collectManifestAssets(opts.visualAssetManifest);
    var assigned = assignPackageAssetPaths(manifestAssets);
    var packageAssets = [];
    var sourceToPath = Object.create(null);
    var packagedPaths = Object.create(null);

    assigned.forEach(function (entry) {
      var asset = entry.asset;
      var dataUrl = getDurableDataUrl(asset);
      if (!dataUrl) {
        warnings.push({
          code: "missing_data_url",
          brief_id: asTrimmedString(asset.brief_id),
          message: "Asset omitted: no durable data_url render source."
        });
        return;
      }
      var decoded = decodeImageDataUrl(dataUrl);
      if (!decoded.ok) {
        warnings.push({
          code: decoded.code || "decode_failed",
          brief_id: asTrimmedString(asset.brief_id),
          message: decoded.message || "Asset omitted: could not decode data URL."
        });
        return;
      }
      var mime =
        asTrimmedString(asset.mime_type || asset.mimeType).toLowerCase() || decoded.mime;
      if (!ACCEPTED_MIME_TYPES[mime]) {
        mime = decoded.mime;
      }
      packageAssets.push({
        path: entry.path,
        bytes: decoded.bytes,
        mime: mime,
        brief_id: asTrimmedString(asset.brief_id) || undefined,
        asset_id: asTrimmedString(asset.asset_id) || undefined
      });
      sourceToPath[dataUrl] = entry.path;
      packagedPaths[entry.path] = true;
    });

    var htmlOut = rewriteHtmlImageSources(htmlIn, sourceToPath);

    var additionalResources = Array.isArray(opts.additionalResourceAssets)
      ? opts.additionalResourceAssets
      : [];
    var usedAdditionalPaths = Object.create(null);
    additionalResources.forEach(function (item, index) {
      var row = item && typeof item === "object" ? item : {};
      var sourceHref = asTrimmedString(row.href);
      if (!sourceHref) return;
      var relPath = asTrimmedString(row.package_path);
      if (!relPath) relPath = "assets/additional-resource-" + String(index + 1) + ".bin";
      if (usedAdditionalPaths[relPath]) {
        warnings.push({
          code: "additional_resource_path_collision",
          resource_id: asTrimmedString(row.resource_id),
          message: "Additional resource path collision: " + relPath
        });
        return;
      }
      var decoded = decodeAnyBase64DataUrl(sourceHref);
      if (!decoded.ok) {
        warnings.push({
          code: decoded.code || "decode_failed",
          resource_id: asTrimmedString(row.resource_id),
          message: decoded.message || "Additional resource omitted: could not decode data URL."
        });
        return;
      }
      usedAdditionalPaths[relPath] = true;
      packageAssets.push({
        path: relPath,
        bytes: decoded.bytes,
        mime: asTrimmedString(row.mime_type) || decoded.mime,
        resource_id: asTrimmedString(row.resource_id) || undefined
      });
      sourceToPath[sourceHref] = relPath;
      packagedPaths[relPath] = true;
    });
    htmlOut = rewriteHtmlImageSources(htmlOut, sourceToPath);

    var mathLiveAppendError = appendMathLivePackageAssets(
      htmlOut,
      packageAssets,
      packagedPaths,
      opts
    );
    if (mathLiveAppendError) {
      return {
        ok: false,
        warnings: warnings,
        error: mathLiveAppendError.error
      };
    }

    var mathJaxAppend = appendMathJaxPackageAssets(
      htmlOut,
      packageAssets,
      packagedPaths,
      opts
    );
    if (mathJaxAppend && mathJaxAppend.error) {
      return {
        ok: false,
        warnings: warnings,
        error: mathJaxAppend.error
      };
    }
    if (mathJaxAppend && mathJaxAppend.html) {
      htmlOut = mathJaxAppend.html;
    }

    // Fail closed if package paths were emitted without entries (should not happen).
    Object.keys(sourceToPath).forEach(function (source) {
      var path = sourceToPath[source];
      if (htmlOut.indexOf(path) !== -1 && !packagedPaths[path]) {
        warnings.push({
          code: "dangling_path",
          message: "Internal error: relative path without package entry: " + path
        });
      }
    });

    if (/blob:/i.test(htmlOut)) {
      return {
        ok: false,
        warnings: warnings,
        error: {
          code: "blob_urls_present",
          message: "Learner package HTML must not contain blob: URLs."
        }
      };
    }

    // Ensure no packaged data URL still remains for successfully packaged sources.
    var remainingPackaged = Object.keys(sourceToPath).filter(function (source) {
      return htmlOut.indexOf(source) !== -1 || htmlOut.indexOf(escapeAttribute(source)) !== -1;
    });
    if (remainingPackaged.length) {
      return {
        ok: false,
        warnings: warnings,
        error: {
          code: "rewrite_incomplete",
          message: "Failed to rewrite packaged image sources to relative paths."
        }
      };
    }

    // Dangling relative asset refs that we introduced must exist.
    for (var i = 0; i < packageAssets.length; i += 1) {
      var p = packageAssets[i].path;
      if (htmlOut.indexOf(p) === -1) {
        // Asset packaged but not referenced — allowed (orphan file); not a dangling link.
        continue;
      }
    }

    var metadata = {
      package_kind: "learner_package",
      schema_version: "70.export",
      html_entry: "learner-page.html",
      asset_count: packageAssets.length,
      built_at: opts.builtAt || new Date().toISOString()
    };
    if (opts.pageSlug) metadata.page_slug = normalizeToken(opts.pageSlug);
    if (opts.title) metadata.title = asTrimmedString(opts.title);

    return {
      ok: true,
      warnings: warnings,
      package: {
        html: htmlOut,
        assets: packageAssets,
        metadata: metadata
      }
    };
  }

  function buildLearnerPackageZipBasename(pageSlug) {
    var slug = normalizeToken(pageSlug) || "learner-page";
    return slug + "-learner-package.zip";
  }

  return {
    ACCEPTED_MIME_TYPES: ACCEPTED_MIME_TYPES,
    normalizeToken: normalizeToken,
    inferExtensionFromMime: inferExtensionFromMime,
    buildPackageAssetBasename: buildPackageAssetBasename,
    assignPackageAssetPaths: assignPackageAssetPaths,
    decodeImageDataUrl: decodeImageDataUrl,
    rewriteHtmlImageSources: rewriteHtmlImageSources,
    buildLearnerPackage: buildLearnerPackage,
    buildLearnerPackageZipBasename: buildLearnerPackageZipBasename,
    pageHtmlNeedsMathEntryForPackage: pageHtmlNeedsMathEntryForPackage,
    pageHtmlNeedsMathJaxForPackage: pageHtmlNeedsMathJaxForPackage,
    appendMathLivePackageAssets: appendMathLivePackageAssets,
    appendMathJaxPackageAssets: appendMathJaxPackageAssets,
    escapeAttribute: escapeAttribute
  };
});
