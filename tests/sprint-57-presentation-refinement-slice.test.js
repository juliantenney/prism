"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");
const { parseTemplateSections } = require("../lib/learner-renderer-vnext/parse-template-sections");

const fixturePath = path.join(
  __dirname,
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);
const appJsPath = path.join(__dirname, "..", "app.js");

function loadFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function extractActivityHtml(html, activityId) {
  const source = String(html || "");
  const marker = 'id="activity-' + activityId + '"';
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) return "";
  const openTagStart = source.lastIndexOf("<article", markerIndex);
  if (openTagStart < 0) return "";
  const tagRe = /<(\/?)article\b[^>]*>/gi;
  tagRe.lastIndex = openTagStart;
  let depth = 0;
  let match;
  while ((match = tagRe.exec(source)) !== null) {
    if (match[1]) depth -= 1;
    else depth += 1;
    if (depth === 0) return source.slice(openTagStart, tagRe.lastIndex);
  }
  return "";
}

function momentHtml(activityHtml, kind) {
  const marker = 'data-composition-moment="' + kind + '"';
  const start = activityHtml.indexOf(marker);
  if (start < 0) return "";
  const sectionStart = activityHtml.lastIndexOf("<section", start);
  const sectionEnd = activityHtml.indexOf("</section>", start);
  if (sectionStart < 0 || sectionEnd < 0) return "";
  return activityHtml.slice(sectionStart, sectionEnd + "</section>".length);
}

test("orientation-to-activity boundary uses spacing plus divider", () => {
  const source = fs.readFileSync(appJsPath, "utf8");
  assert.match(
    source,
    /section\.util-learning-activities>\.util-activity:first-child\{[^"]*margin-top:var\(--space-4\)[^"]*padding-top:var\(--space-4\)[^"]*border-top:1px solid #e5e7eb/
  );
  assert.equal(
    (source.match(/section\.util-learning-activities>\.util-activity:first-child\{/g) || []).length,
    1
  );
  assert.doesNotMatch(source, /section\.util-learning-activities>article\.util-task-block:first-child\{/);
});

test("table css avoids first-column width lock and mid-word wrapping", () => {
  const source = fs.readFileSync(appJsPath, "utf8");
  assert.doesNotMatch(
    source,
    /\.util-learner-table-workspace__table th\[scope=\\"row\\"\][^"]*width:1%/
  );
  assert.doesNotMatch(
    source,
    /\.util-table-scroll\.util-material-table th:first-child[^"]*width:1%/
  );
  assert.match(source, /overflow-wrap:normal;word-break:normal/);
});

test("A1 Check renders guided review before sample output", () => {
  const html = renderLearnerPageHtml(loadFixture(), { compositionMode: "moments" }).html;
  const a1 = extractActivityHtml(html, "A1");
  const check = momentHtml(a1, "check");
  const checklistPos = check.indexOf('data-material-id="A1-M4"');
  const samplePos = check.indexOf('data-material-id="A1-M3"');
  assert.ok(checklistPos >= 0 && samplePos > checklistPos);
});

test("worked examples remain in Learn while sample output is in Check", () => {
  const html = renderLearnerPageHtml(loadFixture(), { compositionMode: "moments" }).html;
  const a1 = extractActivityHtml(html, "A1");
  const learn = momentHtml(a1, "learn");
  const check = momentHtml(a1, "check");
  assert.match(learn, /data-material-id="A1-M2"/);
  assert.doesNotMatch(check, /data-material-id="A1-M2"/);
  assert.match(check, /data-material-id="A1-M3"/);
});

test("Transfer moment follows Check and transfer content renders once", () => {
  const html = renderLearnerPageHtml(loadFixture(), { compositionMode: "moments" }).html;
  const a5 = extractActivityHtml(html, "A5");
  const checkPos = a5.indexOf('data-composition-moment="check"');
  const transferPos = a5.indexOf('data-composition-moment="transfer"');
  assert.ok(checkPos >= 0 && transferPos > checkPos);
  assert.match(a5, /Transfer your learning/);
  assert.equal((a5.match(/data-material-id="A5-M6"/g) || []).length, 1);
  assert.equal((a5.match(/data-material-id="A5-M7"/g) || []).length, 1);
  assert.equal((a5.match(/data-material-id="A5-M8"/g) || []).length, 1);
});

test("framing fields remain distinct in orient framing", () => {
  const html = renderLearnerPageHtml(loadFixture(), { compositionMode: "moments" }).html;
  const a1 = extractActivityHtml(html, "A1");
  const orient = momentHtml(a1, "orient");
  assert.match(orient, /util-composition-preamble/);
  assert.match(orient, /util-composition-reasoning-orientation/);
  assert.match(orient, /util-composition-activity-purpose/);
});

test("preamble is normal body text, bridge remains the only callout guidance", () => {
  const source = fs.readFileSync(appJsPath, "utf8");
  assert.match(
    source,
    /\.util-learner-renderer-vnext \.util-composition-preamble\{[^"]*padding:0;[^"]*border:0;[^"]*background:transparent;[^"]*font-size:var\(--learner-text-base\);[^"]*line-height:var\(--learner-leading-body\);[^"]*color:#1f2937/
  );
  assert.doesNotMatch(
    source,
    /\.util-learner-renderer-vnext \.util-composition-preamble\{[^"]*border-left:[^"]*/
  );
  const html = renderLearnerPageHtml(loadFixture(), { compositionMode: "moments" }).html;
  const a1 = extractActivityHtml(html, "A1");
  const orient = momentHtml(a1, "orient");
  assert.equal((orient.match(/util-composition-preamble/g) || []).length, 1);
  assert.match(source, /\.util-learner-renderer-vnext \.util-pedagogical-guidance\{[^"]*border-left:3px solid/);
});

test("template section fallback prompts use section label context", () => {
  const sections = parseTemplateSections("**Counter-argument:**\n\n**Evidence check:**");
  assert.equal(sections.length, 2);
  assert.equal(sections[0].prompt, "Record your response for Counter-argument.");
  assert.equal(sections[1].prompt, "Record your response for Evidence check.");
  assert.ok(sections.every((section) => !/for this section/i.test(section.prompt)));
});

