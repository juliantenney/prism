/**
 * Sprint 96 M4 — unified Learning Journey MathLive / MathJax packaging & shell.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const fflate = require("fflate");

const ljDesign = require("../lib/learning-journey-design-page.js");
const ljPackage = require("../lib/learning-journey-learner-package.js");
const unifiedShell = require("../lib/learning-journey-unified-shell.js");
const mathJaxPackageAssets = require("../lib/learner-renderer-vnext/mathjax-package-assets.js");
const mathEntryPackageAssets = require("../lib/learner-renderer-vnext/math-entry-package-assets.js");
const repoRoot = path.join(__dirname, "..");
const runtimeScript = fs.readFileSync(
  path.join(repoRoot, "lib", "learner-renderer-vnext-browser.js"),
  "utf8"
);

function journeyPage(title) {
  return ljDesign.buildLearningJourneyDesignPageFixture({
    title: title || "S96 M4 maths journey",
    sections: [
      {
        section_id: "journey_intro",
        title: "About",
        order: 1,
        exposition: "Maths compatibility fixture."
      },
      { section_id: "s1", title: "Stop one", order: 2, exposition: "A." },
      { section_id: "s2", title: "Stop two", order: 3, exposition: "B." },
      { section_id: "s3", title: "Stop three", order: 4, exposition: "C." }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "s1",
        order: 1,
        title: "Stop one",
        product_id: "expository",
        status: "supported",
        specification_text: "A"
      },
      {
        commission_id: "c2",
        section_id: "s2",
        order: 2,
        title: "Stop two",
        product_id: "interactive",
        status: "supported",
        specification_text: "B"
      },
      {
        commission_id: "c3",
        section_id: "s3",
        order: 3,
        title: "Stop three",
        product_id: "expository",
        status: "supported",
        specification_text: "C"
      }
    ]
  });
}

function plainFragment(title, pageKey, body) {
  return (
    '<article class="util-learner-renderer-vnext" data-renderer="vnext" role="region" ' +
    'aria-label="' +
    title +
    '" data-persistence-page-key="' +
    pageKey +
    '"><h2 data-lj-resource-title="true">' +
    title +
    "</h2><p>" +
    body +
    "</p></article>"
  );
}

function mathJaxFragment(pageKey) {
  return (
    '<article class="util-learner-renderer-vnext" data-renderer="vnext" role="region" ' +
    'aria-label="Display maths" data-persistence-page-key="' +
    pageKey +
    '"><h2 data-lj-resource-title="true">Display maths</h2>' +
    "<p>The identity \\(e^{i\\\\pi}+1=0\\) anchors the reading.</p>" +
    "<p>\\[\\\\int_0^1 x^2\\\\,dx=\\\\tfrac{1}{3}\\]</p></article>"
  );
}

function mathLiveFragment(pageKey) {
  return (
    '<article class="util-learner-renderer-vnext" data-renderer="vnext" role="region" ' +
    'aria-label="Math entry" data-persistence-page-key="' +
    pageKey +
    '"><h2 data-lj-resource-title="true">Math entry</h2>' +
    '<div class="util-learner-workspace util-learner-workspace--math-entry" data-workspace-kind="text_entry" ' +
    'data-workspace-id="math-ws-1" data-input-modality="math" data-math-entry="true" ' +
    'data-math-field-id="math-ws-1-field" data-math-label-id="math-ws-1-label">' +
    '<label id="math-ws-1-label" for="math-ws-1-field">Express the prior</label>' +
    '<div data-math-entry-mount class="util-math-entry__mount" hidden></div>' +
    '<textarea id="math-ws-1-field" class="util-learner-workspace__input util-learner-workspace__input--canonical"></textarea>' +
    "</div></article>"
  );
}

function unzipEntries(bytes) {
  const unzipped = fflate.unzipSync(bytes);
  const entries = Object.create(null);
  Object.keys(unzipped).forEach((key) => {
    entries[key] = unzipped[key];
  });
  return entries;
}

function pathsWithPrefix(entries, prefix) {
  return Object.keys(entries).filter((p) => p.indexOf(prefix) === 0).sort();
}

test("M4 detect: MathJax-only vs MathLive-only vs none", () => {
  assert.deepEqual(unifiedShell.detectUnifiedMathRequirements([plainFragment("A", "k", "plain")]), {
    needsMathJax: false,
    needsMathLive: false
  });
  assert.deepEqual(unifiedShell.detectUnifiedMathRequirements([mathJaxFragment("k")]), {
    needsMathJax: true,
    needsMathLive: false
  });
  assert.deepEqual(unifiedShell.detectUnifiedMathRequirements([mathLiveFragment("k")]), {
    needsMathJax: false,
    needsMathLive: true
  });
  const both = unifiedShell.detectUnifiedMathRequirements([
    mathJaxFragment("a"),
    mathLiveFragment("b")
  ]);
  assert.equal(both.needsMathJax, true);
  assert.equal(both.needsMathLive, true);
});

test("M4 packaging: no-maths journey omits both libraries", () => {
  const journey = journeyPage("No maths");
  assert.equal(journey.ok, true);
  const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: journey.page,
    constituents: [
      {
        commissionId: "c1",
        title: "Stop one",
        productId: "expository",
        fragmentHtml: plainFragment("Stop one", "m4-none-c1", "No formulae.")
      },
      {
        commissionId: "c2",
        title: "Stop two",
        productId: "interactive",
        fragmentHtml: plainFragment("Stop two", "m4-none-c2", "Still plain.")
      }
    ],
    fflate,
    runtimeScript
  });
  assert.equal(assembled.ok, true, assembled.error && assembled.error.message);
  assert.equal(assembled.mathRequirements.needsMathJax, false);
  assert.equal(assembled.mathRequirements.needsMathLive, false);
  const entries = unzipEntries(assembled.bytes);
  assert.equal(pathsWithPrefix(entries, "lib/mathjax/").length, 0);
  assert.equal(pathsWithPrefix(entries, "lib/mathlive/").length, 0);
  const html = Buffer.from(entries["index.html"]).toString("utf8");
  assert.doesNotMatch(html, /lib\/mathjax\//);
  assert.doesNotMatch(html, /lib\/mathlive\//);
  assert.doesNotMatch(html, /cdn\.jsdelivr\.net\/npm\/mathjax/i);
});

test("M4 packaging: MathJax-only includes MathJax once and omits MathLive", () => {
  const journey = journeyPage("MathJax only");
  assert.equal(journey.ok, true);
  const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: journey.page,
    constituents: [
      {
        commissionId: "c1",
        title: "Display maths",
        productId: "expository",
        fragmentHtml: mathJaxFragment("m4-jax-c1")
      },
      {
        commissionId: "c2",
        title: "Plain",
        productId: "expository",
        fragmentHtml: plainFragment("Plain", "m4-jax-c2", "No entry.")
      }
    ],
    fflate,
    runtimeScript
  });
  assert.equal(assembled.ok, true, assembled.error && assembled.error.message);
  assert.equal(assembled.mathRequirements.needsMathJax, true);
  assert.equal(assembled.mathRequirements.needsMathLive, false);
  const entries = unzipEntries(assembled.bytes);
  const jaxPaths = pathsWithPrefix(entries, "lib/mathjax/");
  assert.ok(jaxPaths.length > 0);
  assert.ok(entries["lib/mathjax/es5/tex-chtml.js"]);
  assert.equal(pathsWithPrefix(entries, "lib/mathlive/").length, 0);
  const html = Buffer.from(entries["index.html"]).toString("utf8");
  assert.match(html, /prism-mathjax-export-bootstrap/);
  assert.match(html, /id="prism-mathjax-export-loader"/);
  assert.match(html, /src="lib\/mathjax\/es5\/tex-chtml\.js"/);
  assert.match(html, /typeset:\s*false/);
  assert.doesNotMatch(html, /cdn\.jsdelivr\.net\/npm\/mathjax/i);
  assert.doesNotMatch(html, /lib\/mathlive\//);
  assert.match(html, /typesetMountedMath/);
  assert.equal(
    jaxPaths.length,
    mathJaxPackageAssets.MATHJAX_PACKAGE_FILES.length
  );
});

test("M4 packaging: MathLive-only includes MathLive once and omits MathJax", () => {
  const journey = journeyPage("MathLive only");
  assert.equal(journey.ok, true);
  const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: journey.page,
    constituents: [
      {
        commissionId: "c1",
        title: "Math entry",
        productId: "interactive",
        fragmentHtml: mathLiveFragment("m4-live-c1")
      },
      {
        commissionId: "c2",
        title: "Plain",
        productId: "expository",
        fragmentHtml: plainFragment("Plain", "m4-live-c2", "No display maths.")
      }
    ],
    fflate,
    runtimeScript
  });
  assert.equal(assembled.ok, true, assembled.error && assembled.error.message);
  assert.equal(assembled.mathRequirements.needsMathJax, false);
  assert.equal(assembled.mathRequirements.needsMathLive, true);
  const entries = unzipEntries(assembled.bytes);
  const livePaths = pathsWithPrefix(entries, "lib/mathlive/");
  assert.ok(livePaths.length > 0);
  assert.ok(entries["lib/mathlive/mathlive.min.js"]);
  assert.equal(pathsWithPrefix(entries, "lib/mathjax/").length, 0);
  const html = Buffer.from(entries["index.html"]).toString("utf8");
  assert.match(html, /lib\/mathlive\/mathlive\.min\.js/);
  assert.match(html, /lib\/mathlive\/mathlive-fonts\.css/);
  assert.match(html, /util-learner-workspace--math-enhanced/);
  assert.doesNotMatch(html, /lib\/mathjax\//);
  assert.doesNotMatch(html, /cdn\.jsdelivr\.net\/npm\/mathjax/i);
  assert.equal(livePaths.length, mathEntryPackageAssets.MATHLIVE_PACKAGE_FILES.length);
});

test("M4 packaging: both capabilities include each library once", () => {
  const journey = journeyPage("Both maths");
  assert.equal(journey.ok, true);
  const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: journey.page,
    constituents: [
      {
        commissionId: "c1",
        title: "Display maths",
        productId: "expository",
        fragmentHtml: mathJaxFragment("m4-both-c1")
      },
      {
        commissionId: "c2",
        title: "Math entry",
        productId: "interactive",
        fragmentHtml: mathLiveFragment("m4-both-c2")
      },
      {
        commissionId: "c3",
        title: "Plain",
        productId: "expository",
        fragmentHtml: plainFragment("Plain", "m4-both-c3", "No maths.")
      }
    ],
    fflate,
    runtimeScript
  });
  assert.equal(assembled.ok, true, assembled.error && assembled.error.message);
  assert.equal(assembled.mathRequirements.needsMathJax, true);
  assert.equal(assembled.mathRequirements.needsMathLive, true);
  const entries = unzipEntries(assembled.bytes);
  assert.equal(
    pathsWithPrefix(entries, "lib/mathjax/").length,
    mathJaxPackageAssets.MATHJAX_PACKAGE_FILES.length
  );
  assert.equal(
    pathsWithPrefix(entries, "lib/mathlive/").length,
    mathEntryPackageAssets.MATHLIVE_PACKAGE_FILES.length
  );
  const html = Buffer.from(entries["index.html"]).toString("utf8");
  assert.equal((html.match(/lib\/mathlive\/mathlive\.min\.js/g) || []).length, 1);
  assert.equal((html.match(/id="prism-mathjax-export-loader"/g) || []).length, 1);
  assert.doesNotMatch(html, /cdn\.jsdelivr\.net\/npm\/mathjax/i);
  // Maths libs must not be duplicated under media/
  assert.equal(
    Object.keys(entries).filter((p) => /media\/[^/]+\/lib\/math(live|jax)\//.test(p)).length,
    0
  );
});

test("M4 packaging: missing MathLive assets fail closed", () => {
  const journey = journeyPage("Fail closed MathLive");
  assert.equal(journey.ok, true);
  const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: journey.page,
    constituents: [
      {
        commissionId: "c1",
        title: "Math entry",
        productId: "interactive",
        fragmentHtml: mathLiveFragment("m4-fail-live")
      }
    ],
    fflate,
    runtimeScript,
    mathLivePackageAssets: []
  });
  assert.equal(assembled.ok, false);
  assert.equal(assembled.error && assembled.error.code, "mathlive_assets_missing");
  assert.match(String(assembled.error && assembled.error.message), /MathLive/i);
});

test("M4 packaging: missing MathJax assets fail closed", () => {
  const journey = journeyPage("Fail closed MathJax");
  assert.equal(journey.ok, true);
  const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: journey.page,
    constituents: [
      {
        commissionId: "c1",
        title: "Display maths",
        productId: "expository",
        fragmentHtml: mathJaxFragment("m4-fail-jax")
      }
    ],
    fflate,
    runtimeScript,
    mathJaxPackageAssets: []
  });
  assert.equal(assembled.ok, false);
  assert.equal(assembled.error && assembled.error.code, "mathjax_assets_missing");
  assert.match(String(assembled.error && assembled.error.message), /MathJax/i);
});

test("M4 shell HTML injects local maths loaders when requirements forced", () => {
  const journey = journeyPage("Forced head");
  assert.equal(journey.ok, true);
  const shell = unifiedShell.buildLearningJourneyUnifiedShellHtml(
    journey.page,
    [
      {
        commissionId: "c1",
        title: "Plain",
        html: plainFragment("Plain", "forced", "x")
      }
    ],
    {
      mathRequirements: { needsMathJax: true, needsMathLive: true },
      runtimeSrc: "runtime/learner-renderer-vnext-browser.js"
    }
  );
  assert.equal(shell.ok, true);
  assert.match(shell.html, /lib\/mathlive\/mathlive\.min\.js/);
  assert.match(shell.html, /lib\/mathjax\/es5\/tex-chtml\.js/);
  assert.doesNotMatch(shell.html, /cdn\.jsdelivr\.net\/npm\/mathjax/i);
  assert.match(shell.html, /ensureMathLiveEnhanced/);
  assert.match(shell.html, /bumpMathTypesetGen/);
});
