/**
 * Parent Learning Journey Editorial Opening image appears on the unified Overview
 * and resolves offline from packaged media/.
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

const repoRoot = path.resolve(__dirname, "..");
const appJs = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
const runtimeScript = fs.readFileSync(
  path.join(repoRoot, "lib", "learner-renderer-vnext-browser.js"),
  "utf8"
);

const TINY_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const INTRO_TEXT =
  "This journey helps you make sense of experimental data without revealing later conclusions.";

function journeyPage(extra) {
  const built = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Making Sense of Experimental Data",
    sections: [
      {
        section_id: "journey_intro",
        title: "About this journey",
        order: 1,
        exposition: INTRO_TEXT
      },
      {
        section_id: "exp_1",
        title: "First stop",
        order: 2,
        exposition: "First experience."
      }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "First stop",
        product_id: "expository",
        status: "supported",
        specification_text: "A"
      }
    ]
  });
  assert.equal(built.ok, true, (built.errors || []).join("; "));
  return Object.assign(
    {},
    built.page,
    {
      editorial_opening_image: {
        decision: "generate",
        subject: "A researcher reviewing experimental plots at a desk",
        caption_intent: "Orient the learner to careful experimental interpretation",
        detailed_description: "A calm editorial photograph of a researcher reviewing plots."
      }
    },
    extra && typeof extra === "object" ? extra : {}
  );
}

function editorialAsset(overrides) {
  return Object.assign(
    {
      brief_id: "brief-editorial-opening",
      affordance_id: "va-editorial-opening",
      visual_slot: "editorial-opening",
      mime_type: "image/png",
      alt_text: "A researcher reviewing experimental plots at a desk",
      subject: "A researcher reviewing experimental plots at a desk",
      learner_caption: "A researcher reviewing experimental plots at a desk",
      render_source: { kind: "data_url", value: TINY_PNG }
    },
    overrides && typeof overrides === "object" ? overrides : {}
  );
}

function resourceFragment() {
  return (
    '<article class="util-learner-renderer-vnext" data-renderer="vnext" role="region" ' +
    'aria-label="First stop" data-persistence-page-key="lj-overview-editorial-c1">' +
    '<h2 data-lj-resource-title="true">First stop</h2><p>Resource body.</p></article>'
  );
}

test("unified ZIP download path resolves parent Learning Journey visualAssets for Overview", () => {
  const match = appJs.match(
    /function handleLearningJourneyUnifiedShellPackageDownload\([\s\S]*?\n  function handleLearningJourneyLearnerPackageDownload\(/
  );
  assert.ok(match, "unified download handler missing");
  const source = match[0];
  assert.match(source, /resolveLearningJourneyHomePublicationMedia\s*\(/);
  assert.match(source, /visualAssets:/);
  const resolveIdx = source.indexOf("resolveLearningJourneyHomePublicationMedia");
  const assembleIdx = source.indexOf("ljPackageMod.assembleLearningJourneyUnifiedShellPackage({");
  assert.ok(resolveIdx >= 0 && assembleIdx > resolveIdx);
});

test("attached parent Editorial Opening appears on unified Overview and resolves offline", () => {
  const page = journeyPage();
  const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: page,
    constituents: [
      {
        commissionId: "c1",
        title: "First stop",
        productId: "expository",
        fragmentHtml: resourceFragment()
      }
    ],
    visualAssets: { assets: [editorialAsset()] },
    fflate,
    runtimeScript
  });
  assert.equal(assembled.ok, true, assembled.error && assembled.error.message);

  const entries = fflate.unzipSync(assembled.bytes);
  assert.ok(entries["media/editorial-opening.png"], "packaged editorial asset missing");
  assert.ok(entries["index.html"]);

  const html = Buffer.from(entries["index.html"]).toString("utf8");
  const overviewStart = html.indexOf('data-lj-overview="true"');
  assert.ok(overviewStart >= 0);
  const overviewHtml = html.slice(overviewStart, overviewStart + 2500);
  assert.match(overviewHtml, /lj-shell-overview__title/);
  assert.match(overviewHtml, /data-region="editorial-opening"/);
  assert.match(overviewHtml, /data-visual-slot="editorial-opening"/);
  assert.match(overviewHtml, /src="media\/editorial-opening\.png"/);
  assert.match(overviewHtml, /alt="A researcher reviewing experimental plots at a desk\.?"/);
  assert.match(overviewHtml, new RegExp(INTRO_TEXT.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  const titleIdx = overviewHtml.indexOf("lj-shell-overview__title");
  const imageIdx = overviewHtml.indexOf('src="media/editorial-opening.png"');
  const bodyIdx = overviewHtml.indexOf("lj-shell-overview__body");
  assert.ok(titleIdx >= 0 && imageIdx > titleIdx && bodyIdx > imageIdx);

  const assetBytes = entries["media/editorial-opening.png"];
  assert.ok(assetBytes && assetBytes.length > 0);
});

test("Learning Journeys without an introductory image still render Overview normally", () => {
  const page = journeyPage();
  const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: page,
    constituents: [
      {
        commissionId: "c1",
        title: "First stop",
        productId: "expository",
        fragmentHtml: resourceFragment()
      }
    ],
    visualAssets: { assets: [] },
    fflate,
    runtimeScript
  });
  assert.equal(assembled.ok, true, assembled.error && assembled.error.message);
  const entries = fflate.unzipSync(assembled.bytes);
  assert.equal(entries["media/editorial-opening.png"], undefined);
  const html = Buffer.from(entries["index.html"]).toString("utf8");
  assert.match(html, /data-lj-overview="true"/);
  assert.doesNotMatch(html, /data-region="editorial-opening"/);
  assert.match(html, new RegExp(INTRO_TEXT.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("overview shell HTML inserts optional editorial banner between heading and body", () => {
  const page = journeyPage();
  const shell = unifiedShell.buildLearningJourneyUnifiedShellHtml(
    page,
    [
      {
        commissionId: "c1",
        title: "First stop",
        html: resourceFragment()
      }
    ],
    {
      learnerCss: "/* test */",
      editorialHtml:
        '<div class="util-editorial-opening" data-region="editorial-opening">' +
        '<img src="media/editorial-opening.png" alt="Overview image" />' +
        "</div>"
    }
  );
  assert.equal(shell.ok, true, shell.code);
  const overviewStart = shell.html.indexOf('data-lj-overview="true"');
  const overviewHtml = shell.html.slice(overviewStart, overviewStart + 1200);
  const titleIdx = overviewHtml.indexOf("lj-shell-overview__title");
  const imageIdx = overviewHtml.indexOf('src="media/editorial-opening.png"');
  const bodyIdx = overviewHtml.indexOf("lj-shell-overview__body");
  assert.ok(titleIdx >= 0 && imageIdx > titleIdx && bodyIdx > imageIdx);
  assert.match(overviewHtml, new RegExp(INTRO_TEXT.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});
