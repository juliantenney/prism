/**
 * S82 — local MathJax packaging for offline learner packages.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

const repoRoot = path.resolve(__dirname, "..");
const mathJaxPackageAssets = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "mathjax-package-assets.js"
));
const mathEntryPackageAssets = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "math-entry-package-assets.js"
));
const learnerPackage = require(path.join(repoRoot, "lib", "learner-package.js"));
const zipApi = require(path.join(repoRoot, "lib", "learner-package-zip.js"));
const fflate = require("fflate");

const CDN_SRC = mathJaxPackageAssets.MATHJAX_CDN_LOADER_SRC;
const LOCAL_LOADER = mathJaxPackageAssets.MATHJAX_PACKAGE_LOADER_PATH;

function buildMathJaxBootstrapHtml(body) {
  return (
    "<!doctype html><html><head>" +
    "<!-- " +
    mathJaxPackageAssets.MATHJAX_EXPORT_BOOTSTRAP_MARKER +
    " -->" +
    "<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]}};</script>" +
    '<script id="' +
    mathJaxPackageAssets.MATHJAX_EXPORT_LOADER_ID +
    '" async src="' +
    CDN_SRC +
    '"></script>' +
    "</head><body>" +
    String(body || "") +
    "</body></html>"
  );
}

function buildAndUnzipLearnerPackage(buildOpts) {
  const built = learnerPackage.buildLearnerPackage(buildOpts);
  assert.equal(built.ok, true, built.error && built.error.message);
  const zipped = zipApi.serializeLearnerPackageToZip(built.package);
  assert.equal(zipped.ok, true, zipped.error && zipped.error.message);
  const entries = fflate.unzipSync(zipped.bytes);
  return { built, zipped, entries };
}

function expectedMathJaxZipPaths() {
  return mathJaxPackageAssets.MATHJAX_PACKAGE_FILES.map((rel) =>
    mathJaxPackageAssets.MATHJAX_ASSET_ROOT + "/" + rel.replace(/\\/g, "/")
  );
}

function collectAllZipAssetPaths(entries) {
  return Object.keys(entries).filter((p) => p !== "learner-page.html");
}

function assertEveryHtmlMathJaxReferenceResolves(html, zipPaths) {
  const loaderMatch = html.match(/src="([^"]*tex-chtml\.js)"/);
  assert.ok(loaderMatch, "expected local tex-chtml loader reference");
  assert.ok(zipPaths.includes(loaderMatch[1]), "loader missing from ZIP: " + loaderMatch[1]);
  assert.doesNotMatch(html, /cdn\.jsdelivr\.net\/npm\/mathjax/i);
}

test("A: maths-bearing package contains local MathJax assets and no jsDelivr reference", () => {
  const html = buildMathJaxBootstrapHtml("<p>Constraint \\( g(x,y)=c \\).</p>");
  const { built, entries } = buildAndUnzipLearnerPackage({
    html,
    visualAssetManifest: { assets: [] },
    repoRoot
  });

  expectedMathJaxZipPaths().forEach((expectedPath) => {
    assert.ok(entries[expectedPath], "missing ZIP entry: " + expectedPath);
    assert.ok(entries[expectedPath].length > 0, "empty ZIP entry: " + expectedPath);
  });

  assert.match(built.package.html, new RegExp(LOCAL_LOADER.replace(/\//g, "\\/")));
  assert.doesNotMatch(built.package.html, /cdn\.jsdelivr\.net\/npm\/mathjax/i);

  const htmlInZip = fflate.strFromU8(entries["learner-page.html"]);
  assertEveryHtmlMathJaxReferenceResolves(htmlInZip, collectAllZipAssetPaths(entries));
});

test("B: every MathJax asset referenced by packaged HTML resolves within ZIP", () => {
  const html = buildMathJaxBootstrapHtml(
    "<p>Display: \\[ \\mathcal{L}(x,y,\\lambda)=f(x,y)+\\lambda[c-g(x,y)] \\]</p>"
  );
  const { entries } = buildAndUnzipLearnerPackage({
    html,
    visualAssetManifest: { assets: [] },
    repoRoot
  });
  const htmlInZip = fflate.strFromU8(entries["learner-page.html"]);
  const zipPaths = collectAllZipAssetPaths(entries);
  assertEveryHtmlMathJaxReferenceResolves(htmlInZip, zipPaths);
  expectedMathJaxZipPaths().forEach((p) => assert.ok(zipPaths.includes(p), p));
});

test("C: MathJax bootstrap config contract preserved after packaging", () => {
  const html = buildMathJaxBootstrapHtml("<p>Inline \\(x^2\\).</p>");
  const { built } = buildAndUnzipLearnerPackage({
    html,
    visualAssetManifest: { assets: [] },
    repoRoot
  });
  assert.match(built.package.html, /inlineMath:\[\['\\\\\(','\\\\\)'\]\]/);
  assert.match(built.package.html, /displayMath:\[\['\\\\\[','\\\\\]'\]\]/);
  assert.match(
    built.package.html,
    new RegExp('id="' + mathJaxPackageAssets.MATHJAX_EXPORT_LOADER_ID + '"')
  );
  assert.match(
    built.package.html,
    new RegExp(mathJaxPackageAssets.MATHJAX_EXPORT_BOOTSTRAP_MARKER)
  );
});

test("D: MathLive packaging remains intact alongside MathJax", () => {
  const mathEntryRuntime = require(path.join(
    repoRoot,
    "lib",
    "learner-renderer-vnext",
    "math-entry-runtime.js"
  ));
  const renderComposedMoment = require(path.join(
    repoRoot,
    "lib",
    "learner-renderer-vnext",
    "render-composed-moment.js"
  ));
  const learnerSurfaceRegistry = require(path.join(
    repoRoot,
    "lib",
    "learner-renderer-vnext",
    "learner-surface-registry.js"
  ));
  const types = require(path.join(
    repoRoot,
    "lib",
    "learner-renderer-vnext",
    "response-part-types.js"
  ));

  const mapped = learnerSurfaceRegistry.workspaceFromResponsePart({
    responsePartId: "A3-template-1",
    sourceKind: types.SOURCE_KIND.TEMPLATE_SECTION,
    sourceId: "A3-M1",
    label: "Lagrangian",
    prompt: "Record.",
    surfaceKind: types.SURFACE_KIND.TEXT_ENTRY,
    inputModality: types.INPUT_MODALITY.MATH,
    order: 1,
    provenance: {},
    sourceStepNumber: null,
    rows: 6
  });
  assert.equal(mapped.ok, true);
  const workspaceHtml = renderComposedMoment.renderLearnerWorkspace(mapped.workspace, "A3");
  const html =
    "<!doctype html><html><head>" +
    mathEntryRuntime.getMathEntryHeadMarkup() +
    "<!-- " +
    mathJaxPackageAssets.MATHJAX_EXPORT_BOOTSTRAP_MARKER +
    " -->" +
    "<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]}};</script>" +
    '<script id="' +
    mathJaxPackageAssets.MATHJAX_EXPORT_LOADER_ID +
    '" async src="' +
    CDN_SRC +
    '"></script>' +
    "</head><body>" +
    workspaceHtml +
    "</body></html>";

  const { built, entries } = buildAndUnzipLearnerPackage({
    html,
    visualAssetManifest: { assets: [] },
    repoRoot
  });

  mathEntryPackageAssets.MATHLIVE_PACKAGE_FILES.forEach((rel) => {
    const p = mathEntryPackageAssets.MATHLIVE_ASSET_ROOT + "/" + rel.replace(/\\/g, "/");
    assert.ok(entries[p], "MathLive asset missing: " + p);
  });
  expectedMathJaxZipPaths().forEach((p) => assert.ok(entries[p], "MathJax asset missing: " + p));
  assert.match(built.package.html, /data-input-modality="math"/);
  assert.match(built.package.html, /lib\/mathlive\/mathlive\.min\.js/);
  assert.match(built.package.html, new RegExp(LOCAL_LOADER.replace(/\//g, "\\/")));
  assert.match(built.package.html, /util-learner-workspace__input--canonical/);
});

test("E: missing MathJax assets fail closed when package requires MathJax", () => {
  const html = buildMathJaxBootstrapHtml("<p>\\(a=b\\)</p>");
  const built = learnerPackage.buildLearnerPackage({
    html,
    visualAssetManifest: { assets: [] },
    mathJaxPackageAssets: []
  });
  assert.equal(built.ok, false);
  assert.equal(built.error && built.error.code, "mathjax_assets_missing");
});

test("F: non-MathJax package does not acquire MathJax payload", () => {
  const html = "<!doctype html><html><body><p>No maths delimiters here.</p></body></html>";
  const { built, entries } = buildAndUnzipLearnerPackage({
    html,
    visualAssetManifest: { assets: [] },
    repoRoot
  });
  const paths = built.package.assets.map((a) => a.path);
  assert.equal(paths.filter((p) => p.indexOf("lib/mathjax/") === 0).length, 0);
  assert.equal(Object.keys(entries).filter((p) => p.indexOf("lib/mathjax/") === 0).length, 0);
  assert.doesNotMatch(built.package.html, /lib\/mathjax\//);
});

test("G: existing non-maths learner package behaviour unchanged", () => {
  const romanPath = path.join(
    __dirname,
    "fixtures",
    "page-assemble",
    "roman-roads-visual-jobs-valid.json"
  );
  const page = JSON.parse(fs.readFileSync(romanPath, "utf8"));
  const html =
    "<!doctype html><html><body><h1>" +
    String(page.title || "Roman roads") +
    "</h1><p>Historical overview.</p></body></html>";
  const { built, entries } = buildAndUnzipLearnerPackage({
    html,
    visualAssetManifest: { assets: [] },
    repoRoot
  });
  assert.equal(
    Object.keys(entries).filter((p) => p.indexOf("lib/mathlive/") === 0).length,
    0
  );
  assert.equal(
    Object.keys(entries).filter((p) => p.indexOf("lib/mathjax/") === 0).length,
    0
  );
  assert.doesNotMatch(built.package.html, /lib\/mathlive\//);
  assert.doesNotMatch(built.package.html, /lib\/mathjax\//);
});

test("browser export path supplies MathJax assets via mathJaxPackageAssets option", () => {
  const html = buildMathJaxBootstrapHtml("<p>\\(x\\)</p>");
  const mathJaxAssets = mathJaxPackageAssets.collectMathJaxPackageAssets({ repoRoot }).map(
    (asset) => ({
      path: asset.path,
      bytes: new Uint8Array(asset.bytes),
      mime: asset.mime
    })
  );
  const { entries } = buildAndUnzipLearnerPackage({
    html,
    visualAssetManifest: { assets: [] },
    mathJaxPackageAssets: mathJaxAssets
  });
  expectedMathJaxZipPaths().forEach((expectedPath) => {
    assert.ok(entries[expectedPath], "browser-path ZIP missing: " + expectedPath);
  });
});

test("vendored MathJax asset manifest matches on-disk files", () => {
  mathJaxPackageAssets.MATHJAX_PACKAGE_FILES.forEach((rel) => {
    const abs = path.join(
      repoRoot,
      mathJaxPackageAssets.MATHJAX_ASSET_ROOT,
      rel.replace(/\//g, path.sep)
    );
    assert.ok(fs.existsSync(abs), "missing vendored MathJax file: " + rel);
    assert.ok(fs.statSync(abs).size > 0, "empty vendored MathJax file: " + rel);
  });
});
