const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");

function loadRomanRoadsAssociationPage() {
  const fixturePath = path.join(
    __dirname,
    "fixtures",
    "page-render",
    "roman-roads-association-page.json"
  );
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function extractActivityHtml(html, activityId) {
  var marker = 'id="activity-' + activityId + '"';
  var markerIndex = html.indexOf(marker);
  if (markerIndex < 0) return "";
  var openTagStart = html.lastIndexOf("<article", markerIndex);
  if (openTagStart < 0) return "";
  var tagRe = /<(\/?)article\b[^>]*>/gi;
  tagRe.lastIndex = openTagStart;
  var depth = 0;
  var match;
  while ((match = tagRe.exec(html)) !== null) {
    if (match[1]) depth -= 1;
    else depth += 1;
    if (depth === 0) {
      return html.slice(openTagStart, tagRe.lastIndex);
    }
  }
  return "";
}

function extractMomentHtml(activityHtml, kind) {
  var marker = 'data-composition-moment="' + kind + '"';
  var start = activityHtml.indexOf(marker);
  if (start < 0) return "";
  var open = activityHtml.lastIndexOf("<section", start);
  var close = activityHtml.indexOf("</section>", start);
  if (open < 0 || close < 0) return "";
  return activityHtml.slice(open, close + "</section>".length);
}

function indexOfOrEnd(text, search) {
  var idx = String(text || "").indexOf(search);
  return idx >= 0 ? idx : Number.MAX_SAFE_INTEGER;
}

function countMaterialOccurrences(html, materialId) {
  var re = new RegExp('data-material-id="' + materialId + '"', "g");
  return (String(html || "").match(re) || []).length;
}

function countLegacyVerificationBeforeLearn(activityHtml) {
  var learnPos = activityHtml.indexOf('data-composition-moment="learn"');
  if (learnPos < 0) return 0;
  var prefix = activityHtml.slice(0, learnPos);
  var re = /class="util-beat-section"[^>]*data-beat-function="verification"/g;
  return (prefix.match(re) || []).length;
}

test("Roman Roads full episode-plan shape keeps check instruction-material pairing", () => {
  const page = loadRomanRoadsAssociationPage();
  const rendered = renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(rendered.error, null);
  const html = String(rendered.html || "");
  assert.match(html, /data-composition-mode="moments"/);
  assert.match(html, /data-composed-activity-count="3"/);
  assert.match(html, /data-beats-fallback-activity-count="0"/);

  ["A1-M3", "A1-M4", "A4-M5", "A4-M6", "A5-M4", "A5-M5", "A5-M6"].forEach(function (materialId) {
    assert.equal(
      countMaterialOccurrences(html, materialId),
      1,
      materialId + " should render exactly once"
    );
  });

  const a1Html = extractActivityHtml(html, "A1");
  const a4Html = extractActivityHtml(html, "A4");
  assert.equal(countLegacyVerificationBeforeLearn(a1Html), 0);
  assert.equal(countLegacyVerificationBeforeLearn(a4Html), 0);

  const a1Check = extractMomentHtml(a1Html, "check");
  assert.equal(countMaterialOccurrences(a1Check, "A1-M3"), 1);
  assert.equal(countMaterialOccurrences(a1Check, "A1-M4"), 1);
  assert.equal(countMaterialOccurrences(a1Html, "A1-M3"), 1);

  const a4Check = extractMomentHtml(a4Html, "check");
  assert.equal(countMaterialOccurrences(a4Check, "A4-M5"), 1);
  assert.equal(countMaterialOccurrences(a4Check, "A4-M6"), 1);
  assert.ok(
    indexOfOrEnd(
      a1Check,
      "Examine the sample output and identify how evidence is linked to interpretation."
    ) < indexOfOrEnd(a1Check, 'data-material-id="A1-M3"')
  );
  assert.ok(
    indexOfOrEnd(a1Check, "Complete the verification checklist and revise your concept map if needed.") <
      indexOfOrEnd(a1Check, 'data-material-id="A1-M4"')
  );

  const a4Do = extractMomentHtml(a4Html, "do");
  assert.equal(a4Do.indexOf("Complete the checklist and revise your conclusion."), -1);
  assert.ok(
    indexOfOrEnd(a4Check, "Complete the checklist and revise your conclusion.") <
      indexOfOrEnd(a4Check, 'data-material-id="A4-M5"')
  );

  const a5Check = extractMomentHtml(extractActivityHtml(html, "A5"), "check");
  const a5M4 = indexOfOrEnd(a5Check, 'data-material-id="A5-M4"');
  const a5Step5 = indexOfOrEnd(
    a5Check,
    "Review the consolidation summary and complete the final transfer prompt."
  );
  const a5M5 = indexOfOrEnd(a5Check, 'data-material-id="A5-M5"');
  const a5M6 = indexOfOrEnd(a5Check, 'data-material-id="A5-M6"');
  assert.ok(a5M4 < a5Step5);
  assert.ok(a5Step5 < a5M5);
  assert.ok(a5M5 < a5M6);
});
