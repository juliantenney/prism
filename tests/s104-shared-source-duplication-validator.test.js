/**
 * Sprint 104 — shared-source duplication validator.
 *
 * specification_text_duplicates_full_shared_source must reject genuine full-source duplication
 * while permitting legitimate references to authoritative facts, numerical values and selected
 * evidence from the shared corpus.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const shared = require("../lib/learning-journey-shared-source.js");
const fixture = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "fixtures", "s104-diagnostic-shared-corpus-and-commissions.json"),
    "utf8"
  )
);
const corpus = fixture.shared_content;
const looksLikeDump = shared.commissionTextLooksLikeFullSharedDump;

test("live false positive: commissions citing selected Dataset A/B/C values are not full-source duplication (live rejected: comm_5, 7, 8, 9)", () => {
  // comm_5/7/8/9 (0-based indices 4, 6, 7, 8) were rejected by the former numeric-count rule; comm_4/6 are controls.
  assert.deepEqual(fixture.live_rejected, ["comm_5", "comm_7", "comm_8", "comm_9"]);
  Object.keys(fixture.commissions).forEach((id) => {
    const spec = fixture.commissions[id];
    assert.ok(spec && spec.length > 500, id + " fixture present");
    assert.equal(looksLikeDump(spec, corpus), false, id);
  });
});

test("legitimate references: a handful of verbatim authoritative lines and values are permitted", () => {
  const spec =
    "Present Dataset A with these exact frequencies. Population size: 200 people. " +
    "Positive results among people with the condition (TP): 90. " +
    "Positive results among people without the condition (FP): 20. " +
    "Positive predictive value: 90/110, approximately 81.8%. " +
    "Contrast with Dataset B where positive predictive value is 18/54, approximately 33.3%, and " +
    "Dataset C where 128 of the 132 negative results are true negatives (97.0%).";
  assert.equal(looksLikeDump(spec, corpus), false);
});

test("genuine duplication is still rejected: the complete corpus pasted verbatim", () => {
  assert.equal(looksLikeDump(corpus, corpus), true);
  assert.equal(looksLikeDump("Create a component.\n\n" + corpus + "\n\nKeep it short.", corpus), true);
});

test("genuine duplication is still rejected: most of the corpus reproduced with whitespace/case drift", () => {
  const paragraphs = corpus.split("\n\n");
  // Drop the opening disclaimer and the closing rules, keep the datasets and interpretations.
  const mostOfIt = paragraphs.slice(1, -1).join("\n").toUpperCase().replace(/\n/g, "\n  ");
  assert.equal(looksLikeDump(mostOfIt, corpus), true);
});

test("genuine duplication is still rejected: all datasets re-typed as numeric tables", () => {
  const numericCorpus =
    "Raw synthetic measurements for the study.\nSample 1: 112 118 125 131 140 152 160 171 183 195 204 219 233 241.\nSample 2: 98 104 111 119 127 138 149 158 166 177.";
  const retyped = "Include a table: 112, 118, 125, 131, 140, 152, 160, 171, 183, 195, 204, 219, 233, 241 and 98, 104, 111, 119, 127, 138, 149, 158, 166, 177.";
  assert.equal(looksLikeDump(retyped, numericCorpus), true);
  // Citing a few of the values is a legitimate reference.
  assert.equal(
    looksLikeDump("Use the sample values 112, 140 and 204, and the second-sample value 98.", numericCorpus),
    false
  );
});

test("unrelated or empty text is not duplication", () => {
  assert.equal(looksLikeDump("", corpus), false);
  assert.equal(looksLikeDump("Create a concise introduction to diagnostic tests.", corpus), false);
  assert.equal(looksLikeDump("anything", ""), false);
});
