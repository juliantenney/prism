"use strict";

var fs = require("fs");
var path = require("path");

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
  return String(html == null ? "" : html).indexOf('data-input-modality="math"') >= 0;
}

function resolveRepoRoot(repoRoot) {
  if (repoRoot) return path.resolve(repoRoot);
  return path.resolve(__dirname, "..", "..");
}

/**
 * @param {{ repoRoot?: string }} [options]
 * @returns {Array<{ path: string, bytes: Buffer, mime: string }>}
 */
function collectMathLivePackageAssets(options) {
  var opts = options && typeof options === "object" ? options : {};
  var root = resolveRepoRoot(opts.repoRoot);
  var assets = [];

  MATHLIVE_PACKAGE_FILES.forEach(function (rel) {
    var abs = path.join(root, MATHLIVE_ASSET_ROOT, rel);
    if (!fs.existsSync(abs)) {
      throw new Error("Missing MathLive package asset: " + MATHLIVE_ASSET_ROOT + "/" + rel);
    }
    var mime = "application/octet-stream";
    if (rel.endsWith(".js")) mime = "text/javascript";
    else if (rel.endsWith(".css")) mime = "text/css";
    else if (rel.endsWith(".woff2")) mime = "font/woff2";
    assets.push({
      path: MATHLIVE_ASSET_ROOT + "/" + rel.replace(/\\/g, "/"),
      bytes: fs.readFileSync(abs),
      mime: mime
    });
  });

  return assets;
}

module.exports = {
  MATHLIVE_ASSET_ROOT: MATHLIVE_ASSET_ROOT,
  MATHLIVE_PACKAGE_FILES: MATHLIVE_PACKAGE_FILES,
  pageHtmlNeedsMathEntry: pageHtmlNeedsMathEntry,
  collectMathLivePackageAssets: collectMathLivePackageAssets
};
