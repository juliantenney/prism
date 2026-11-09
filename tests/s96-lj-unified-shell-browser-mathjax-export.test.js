/**
 * Learning Journey unified ZIP must package MathJax via the browser fetch path,
 * not Node-only collectMathJaxPackageAssets.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const fflate = require("fflate");

const ljDesign = require("../lib/learning-journey-design-page.js");
const ljPackage = require("../lib/learning-journey-learner-package.js");
const mathJaxPackageAssets = require("../lib/learner-renderer-vnext/mathjax-package-assets.js");

const repoRoot = path.resolve(__dirname, "..");
const appJs = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
const runtimeScript = fs.readFileSync(
  path.join(repoRoot, "lib", "learner-renderer-vnext-browser.js"),
  "utf8"
);

function journeyPage() {
  return ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Browser MathJax LJ export",
    sections: [
      {
        section_id: "journey_intro",
        title: "About",
        order: 1,
        exposition: "Intro."
      },
      {
        section_id: "s1",
        title: "Display maths",
        order: 2,
        exposition: "A."
      }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "s1",
        order: 1,
        title: "Display maths",
        product_id: "expository",
        status: "supported",
        specification_text: "A"
      }
    ]
  });
}

function mathJaxFragment() {
  return (
    '<article class="util-learner-renderer-vnext" data-renderer="vnext" role="region" ' +
    'aria-label="Display maths" data-persistence-page-key="lj-browser-mathjax-c1">' +
    '<h2 data-lj-resource-title="true">Display maths</h2>' +
    "<p>The identity \\(e^{i\\\\pi}+1=0\\) anchors the reading.</p>" +
    "</article>"
  );
}

function browserFetchedMathJaxAssets() {
  return mathJaxPackageAssets.collectMathJaxPackageAssets({ repoRoot }).map((asset) => ({
    path: asset.path,
    bytes: new Uint8Array(asset.bytes),
    mime: asset.mime
  }));
}

function unifiedDownloadHandlerSource() {
  const match = appJs.match(
    /function handleLearningJourneyUnifiedShellPackageDownload\([\s\S]*?\n  function handleLearningJourneyLearnerPackageDownload\(/
  );
  assert.ok(match, "unified shell download handler not found in app.js");
  return match[0];
}

function loadBrowserOnlyUnifiedShellApi() {
  const sandbox = {
    module: { exports: {} },
    exports: {},
    globalThis: null,
    Buffer,
    Uint8Array,
    Array,
    Object,
    String,
    Number,
    Date,
    RegExp,
    Error,
    Math,
    JSON,
    console
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(
    fs.readFileSync(path.join(repoRoot, "lib", "learner-renderer-vnext", "mathjax-package-assets.js"), "utf8"),
    sandbox
  );
  sandbox.PRISM_MATHJAX_PACKAGE_ASSETS = sandbox.module.exports;
  sandbox.module = { exports: {} };
  sandbox.exports = sandbox.module.exports;
  vm.runInContext(
    fs.readFileSync(path.join(repoRoot, "lib", "learning-journey-unified-shell.js"), "utf8"),
    sandbox
  );
  return sandbox.module.exports || sandbox.PRISM_LEARNING_JOURNEY_UNIFIED_SHELL;
}

test("LJ unified ZIP download path prefetches MathJax with fetchMathJaxPackageAssets before assemble", () => {
  const source = unifiedDownloadHandlerSource();
  const fetchIdx = source.indexOf("fetchMathJaxPackageAssets");
  const assembleCallIdx = source.indexOf(
    "ljPackageMod.assembleLearningJourneyUnifiedShellPackage({"
  );
  assert.ok(fetchIdx >= 0, "download path must call fetchMathJaxPackageAssets");
  assert.ok(assembleCallIdx > fetchIdx, "fetch must precede assemble");
  assert.match(source, /mathJaxPackageAssets:\s*assetRows\[1\]/);
  assert.match(source, /fetchMathLivePackageAssets/);
  assert.match(source, /mathLivePackageAssets:\s*assetRows\[0\]/);
  assert.doesNotMatch(
    source.slice(source.indexOf("var mathAssetsApi ="), assembleCallIdx),
    /collectMathJaxPackageAssets\s*\(/
  );
});

test("browser-only unified math collection fails closed without prefetched MathJax assets", () => {
  const api = loadBrowserOnlyUnifiedShellApi();
  assert.equal(typeof api.collectUnifiedMathPackageAssets, "function");

  const result = api.collectUnifiedMathPackageAssets(
    { needsMathJax: true, needsMathLive: false },
    { mathJaxPackageAssets: null }
  );
  assert.equal(result.ok, false);
  assert.equal(result.error && result.error.code, "mathjax_assets_missing");
  assert.doesNotMatch(String(result.error && result.error.message), /requires Node/);
});

test("browser export path: prefetched MathJax assets assemble without Node collect", () => {
  const journey = journeyPage();
  assert.equal(journey.ok, true, (journey.errors || []).join("; "));
  const fetched = browserFetchedMathJaxAssets();

  const originalCollect = mathJaxPackageAssets.collectMathJaxPackageAssets;
  let collectCalls = 0;
  mathJaxPackageAssets.collectMathJaxPackageAssets = function () {
    collectCalls += 1;
    throw new Error(
      "collectMathJaxPackageAssets requires Node; use fetchMathJaxPackageAssets in the browser."
    );
  };

  try {
    const missing = ljPackage.assembleLearningJourneyUnifiedShellPackage({
      page: journey.page,
      constituents: [
        {
          commissionId: "c1",
          title: "Display maths",
          productId: "expository",
          fragmentHtml: mathJaxFragment()
        }
      ],
      fflate,
      runtimeScript
    });
    assert.equal(missing.ok, false);
    assert.equal(missing.error && missing.error.code, "mathjax_assets_missing");
    assert.ok(collectCalls >= 1);

    collectCalls = 0;
    const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
      page: journey.page,
      constituents: [
        {
          commissionId: "c1",
          title: "Display maths",
          productId: "expository",
          fragmentHtml: mathJaxFragment()
        }
      ],
      fflate,
      runtimeScript,
      mathJaxPackageAssets: fetched
    });
    assert.equal(assembled.ok, true, assembled.error && assembled.error.message);
    assert.equal(collectCalls, 0, "prefetched assets must not invoke Node collect");
    assert.equal(assembled.mathRequirements.needsMathJax, true);

    const entries = fflate.unzipSync(assembled.bytes);
    assert.ok(entries["lib/mathjax/es5/tex-chtml.js"]);
    const html = Buffer.from(entries["index.html"]).toString("utf8");
    assert.match(html, /src="lib\/mathjax\/es5\/tex-chtml\.js"/);
    assert.doesNotMatch(html, /cdn\.jsdelivr\.net\/npm\/mathjax/i);
  } finally {
    mathJaxPackageAssets.collectMathJaxPackageAssets = originalCollect;
  }
});
