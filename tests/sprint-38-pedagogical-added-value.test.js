/**
 * Sprint 38-6 — pedagogical added-value contract catalog and guidance coverage.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const repoRoot = path.resolve(__dirname, "..");
const s38Path = path.join(repoRoot, "lib", "sprint38-visual-affordances.js");
const pvPath = path.join(repoRoot, "lib", "sprint38-representation-pedagogical-value.js");
const appJsPath = path.join(repoRoot, "app.js");
const appJsSource = fs.readFileSync(appJsPath, "utf8");
const recordsPath = path.join(repoRoot, "tests", "fixtures", "sprint-38", "affordance-records.json");
const veuPath = path.join(
  repoRoot,
  "utilities",
  "visual-enhancement-utility",
  "visual-enhancement-utility-v1.2.1.json"
);
const obsDir = path.join(
  repoRoot,
  "docs",
  "development",
  "sprints",
  "2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment",
  "observations"
);

const s38 = require(s38Path);
const pv = require(pvPath);
const records = JSON.parse(fs.readFileSync(recordsPath, "utf8"));

test("catalog: every representation token has must_add and must_not_duplicate", () => {
  const tokens = s38.REPRESENTATIONS;
  assert.equal(pv.REPRESENTATION_TOKEN_LIST.length, tokens.length);
  tokens.forEach((token) => {
    const row = pv.REPRESENTATION_PEDAGOGICAL_VALUE[token];
    assert.ok(row, "missing pedagogical value row for " + token);
    assert.ok(Array.isArray(row.must_add) && row.must_add.length >= 1, token + " must_add");
    assert.ok(
      Array.isArray(row.must_not_duplicate) && row.must_not_duplicate.length >= 1,
      token + " must_not_duplicate"
    );
  });
});

test("catalog: classification_matrix must_not_duplicate blocks worksheet duplication", () => {
  const row = pv.REPRESENTATION_PEDAGOGICAL_VALUE.classification_matrix;
  assert.ok(
    row.must_not_duplicate.some((s) => /worksheet|filled answer/i.test(s)),
    row.must_not_duplicate.join("; ")
  );
  assert.ok(row.must_add.some((s) => /discriminating|decision criteria|category/i.test(s)));
});

test("observations: generic QA rule and human-designer cognitive-support test documented", () => {
  const md38_4 = fs.readFileSync(path.join(obsDir, "38-4-affordance-enrichment-design.md"), "utf8");
  const md38_6 = fs.readFileSync(path.join(obsDir, "38-6-pedagogical-added-value-contract.md"), "utf8");
  const md38_3 = fs.readFileSync(path.join(obsDir, "38-3-representation-guidance.md"), "utf8");
  assert.match(md38_6, /pedagogical_added_value/i);
  assert.match(md38_6, /reasoning support not already adequately provided/i);
  assert.match(md38_4, /cognitive support the figure adds beyond materials/i);
  assert.match(md38_3, /\*\*must_add\*\*/);
  assert.match(md38_3, /\*\*must_not_duplicate\*\*/);
  assert.match(md38_3, /classification_matrix[\s\S]*must_not_duplicate[\s\S]*worksheet/i);
});

test("VEU v1.2.1 Step 1 prompt: generate pedagogical support not structure only", () => {
  const veu = JSON.parse(fs.readFileSync(veuPath, "utf8"));
  const step1 = veu.workflows[0].steps.find((s) => s.canonical_step_id === "step_create_html_package");
  const body = String(step1.override_prompt_body || "");
  assert.match(body, /PEDAGOGICAL ADDED VALUE/i);
  assert.match(body, /Generate the pedagogical support, not merely the visual structure/i);
  assert.match(body, /pedagogical_added_value/i);
  assert.match(body, /classification_matrix[\s\S]*discriminating cues/i);
});

test("Design Page prompt source: pedagogical_added_value and per-token guidance", () => {
  assert.match(appJsSource, /buildSprint38PedagogicalAddedValuePromptLines/);
  assert.match(appJsSource, /Sprint 38 pedagogical added-value contract \(auto-applied\)/);
  assert.match(appJsSource, /pedagogical_added_value/);
  assert.match(appJsSource, /duplicate worksheet/i);
  assert.match(appJsSource, /Per-token must_add \/ must_not_duplicate/);
  assert.match(appJsSource, /REPRESENTATION_PEDAGOGICAL_VALUE/);
  assert.match(appJsSource, /explain what cognitive support/i);
  assert.match(appJsSource, /Adds discriminating cause-type cues/);
});

test("existing affordance fixtures remain valid under strict compose validation", () => {
  const keys = [
    "inflation_a2_generate",
    "inflation_a3_generate",
    "climate_mechanism_generate",
    "ci_a4_generate",
    "inflation_a5_reject"
  ];
  keys.forEach((key) => {
    const row = records[key];
    if (row.visual_decision === "reject") {
      const result = s38.validatePageVisualAffordances({ visual_affordances: [row] });
      assert.equal(result.valid, true, key + ": " + result.errors.join("; "));
      return;
    }
    const result = s38.validatePageVisualAffordances({ visual_affordances: [row] });
    assert.equal(result.valid, true, key + ": " + result.errors.join("; "));
    const next = s38.applyToComposedPage({ visual_affordances: [row] }, { strictValidation: true });
    assert.equal(next.visual_affordances.length, 1, key);
  });
});

test("inflation A3 with pedagogical_added_value survives compose pass", () => {
  const row = records.inflation_a3_generate;
  assert.ok(row.pedagogical_added_value);
  const next = s38.applyToComposedPage(
    { artifact_type: "page", visual_affordances: [row] },
    { strictValidation: true }
  );
  assert.equal(next.visual_affordances[0].pedagogical_added_value, row.pedagogical_added_value);
});
