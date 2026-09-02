"use strict";

/**
 * MathLive learner-package asset collector (Node fs + browser fetch).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_MATH_ENTRY_PACKAGE_ASSETS = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var MATHLIVE_ASSET_ROOT = "lib/mathlive";

  var MATHLIVE_PACKAGE_FILES = [
    "mathlive.min.js",
    "mathlive-fonts.css",
    "fonts/KaTeX_AMS-Regular.woff2",
    "fonts/KaTeX_Caligraphic-Bold.woff2",
    "fonts/KaTeX_Caligraphic-Regular.woff2",
    "fonts/KaTeX_Fraktur-Bold.woff2",
    "fonts/KaTeX_Fraktur-Regular.woff2",
    "fonts/KaTeX_Main-Bold.woff2",
    "fonts/KaTeX_Main-BoldItalic.woff2",
    "fonts/KaTeX_Main-Italic.woff2",
    "fonts/KaTeX_Main-Regular.woff2",
    "fonts/KaTeX_Math-BoldItalic.woff2",
    "fonts/KaTeX_Math-Italic.woff2",
    "fonts/KaTeX_SansSerif-Bold.woff2",
    "fonts/KaTeX_SansSerif-Italic.woff2",
    "fonts/KaTeX_SansSerif-Regular.woff2",
    "fonts/KaTeX_Script-Regular.woff2",
    "fonts/KaTeX_Size1-Regular.woff2",
    "fonts/KaTeX_Size2-Regular.woff2",
    "fonts/KaTeX_Size3-Regular.woff2",
    "fonts/KaTeX_Size4-Regular.woff2",
    "fonts/KaTeX_Typewriter-Regular.woff2"
  ];

  function pageHtmlNeedsMathEntry(html) {
    var text = String(html == null ? "" : html);
    return (
      text.indexOf('data-input-modality="math"') >= 0 ||
      text.indexOf(MATHLIVE_ASSET_ROOT + "/") >= 0
    );
  }

  function mimeForRelativePath(rel) {
    if (rel.endsWith(".js")) return "text/javascript";
    if (rel.endsWith(".css")) return "text/css";
    if (rel.endsWith(".woff2")) return "font/woff2";
    return "application/octet-stream";
  }

  function packagePathForRelative(rel) {
    return MATHLIVE_ASSET_ROOT + "/" + String(rel || "").replace(/\\/g, "/");
  }

  function resolveRepoRoot(repoRoot) {
    if (repoRoot) {
      var path = require("path");
      return path.resolve(repoRoot);
    }
    var path = require("path");
    return path.resolve(__dirname, "..", "..");
  }

  /**
   * @param {{ repoRoot?: string }} [options]
   * @returns {Array<{ path: string, bytes: Buffer, mime: string }>}
   */
  function collectMathLivePackageAssets(options) {
    if (typeof require !== "function") {
      throw new Error(
        "collectMathLivePackageAssets requires Node; use fetchMathLivePackageAssets in the browser."
      );
    }
    var fs = require("fs");
    var path = require("path");
    var opts = options && typeof options === "object" ? options : {};
    var root = resolveRepoRoot(opts.repoRoot);
    var assets = [];

    MATHLIVE_PACKAGE_FILES.forEach(function (rel) {
      var abs = path.join(root, MATHLIVE_ASSET_ROOT, rel);
      if (!fs.existsSync(abs)) {
        throw new Error("Missing MathLive package asset: " + MATHLIVE_ASSET_ROOT + "/" + rel);
      }
      assets.push({
        path: packagePathForRelative(rel),
        bytes: fs.readFileSync(abs),
        mime: mimeForRelativePath(rel)
      });
    });

    return assets;
  }

  /**
   * Browser export path — fetch local MathLive files from the served repo.
   * @param {string} baseUrl Page base URL (directory containing lib/)
   * @returns {Promise<Array<{ path: string, bytes: Uint8Array, mime: string }>>}
   */
  function fetchMathLivePackageAssets(baseUrl) {
    if (typeof fetch !== "function") {
      return Promise.reject(new Error("fetch is unavailable for MathLive packaging."));
    }
    var base = String(baseUrl == null ? "" : baseUrl);
    if (base && base.charAt(base.length - 1) !== "/") {
      base += "/";
    }
    return Promise.all(
      MATHLIVE_PACKAGE_FILES.map(function (rel) {
        var url = base + MATHLIVE_ASSET_ROOT + "/" + rel.replace(/\\/g, "/");
        return fetch(url).then(function (response) {
          if (!response || !response.ok) {
            throw new Error(
              "Failed to fetch MathLive package asset (" +
                (response ? response.status : "no response") +
                "): " +
                url
            );
          }
          return response.arrayBuffer();
        }).then(function (buffer) {
          return {
            path: packagePathForRelative(rel),
            bytes: new Uint8Array(buffer),
            mime: mimeForRelativePath(rel)
          };
        });
      })
    );
  }

  return {
    MATHLIVE_ASSET_ROOT: MATHLIVE_ASSET_ROOT,
    MATHLIVE_PACKAGE_FILES: MATHLIVE_PACKAGE_FILES,
    pageHtmlNeedsMathEntry: pageHtmlNeedsMathEntry,
    collectMathLivePackageAssets: collectMathLivePackageAssets,
    fetchMathLivePackageAssets: fetchMathLivePackageAssets
  };
});
