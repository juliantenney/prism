const test = require("node:test");
const assert = require("node:assert/strict");

const learnerPackage = require("../lib/learner-package.js");

test("additional resource assets are included and rewritten to package paths", () => {
  const pdfData =
    "data:application/pdf;base64," + Buffer.from("%PDF-1.4 fake", "utf8").toString("base64");
  const htmlIn =
    '<main><section class="learner-additional-resources"><a href="' +
    pdfData +
    '" target="_blank" rel="noopener noreferrer">Read brief<span class="sr-only"> (opens in a new tab)</span></a></section></main>';
  const built = learnerPackage.buildLearnerPackage({
    html: htmlIn,
    visualAssetManifest: { assets: [] },
    additionalResourceAssets: [
      {
        resource_id: "wr-doc-1",
        href: pdfData,
        mime_type: "application/pdf",
        package_path: "assets/additional-resource-1.pdf"
      }
    ]
  });
  assert.equal(built.ok, true);
  assert.equal(built.package.assets.length, 1);
  assert.equal(built.package.assets[0].path, "assets/additional-resource-1.pdf");
  assert.match(built.package.html, /assets\/additional-resource-1\.pdf/);
  assert.match(built.package.html, /target="_blank"/);
  assert.match(built.package.html, /opens in a new tab/);
});
