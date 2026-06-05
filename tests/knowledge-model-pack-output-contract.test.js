/**
 * Model Knowledge (pack §3) — strict raw JSON output contract regression guard.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

function extractPromptFactory(heading) {
  const md = fs.readFileSync(ldPatternsPath, "utf8");
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    escaped + "[\\s\\S]*?### Prompt Factory\\s*```json\\s*([\\s\\S]*?)\\s*```"
  );
  const m = md.match(re);
  if (!m) throw new Error("Prompt Factory not found for " + heading);
  return JSON.parse(m[1].trim());
}

const km = extractPromptFactory("## 3. Model Knowledge");
const dla = extractPromptFactory("## 5. Design Learning Activities");
const gam = extractPromptFactory("## 6. Generate Activity Materials");

const { buildKmHarnessOutputContract } = require(path.join(
  repoRoot,
  "docs",
  "development",
  "sprints",
  "2026-06-05-sprint-38h-workbook-realisation-fidelity",
  "artefacts",
  "ev-harness-artefact-parse.js"
));

test("pack §3 KM: requires raw JSON object only", () => {
  const t = km.promptTemplate;
  assert.match(t, /parseable JSON artefact only/i);
  assert.match(t, /exactly one valid JSON object/i);
  assert.match(t, /knowledge_model root object/i);
  assert.equal(km.preferredOutputFormat, "json");
});

test("pack §3 KM: forbids markdown fences and prose wrapper", () => {
  const t = km.promptTemplate;
  assert.match(t, /Do NOT wrap output in markdown code fences/i);
  assert.match(t, /Do NOT include any prose/i);
  assert.doesNotMatch(t, /Emit exactly one markdown fenced JSON/i);
  assert.doesNotMatch(t, /fenced JSON code block/i);
  assert.doesNotMatch(t, /```json/i);
});

test("pack §3 KM: forbids STEP footer and JSON comments", () => {
  const t = km.promptTemplate;
  assert.match(t, /Do NOT prefix or suffix workflow metadata/i);
  assert.match(t, /no STEP N OUTPUT/i);
  assert.match(t, /Do NOT include JSON comments/i);
});

test("pack §3 KM: preserves required top-level structure keys", () => {
  const t = km.promptTemplate;
  for (const key of [
    "concepts",
    "relationships",
    "groupings",
    "processes",
    "misconceptions"
  ]) {
    assert.match(t, new RegExp(key));
  }
  assert.deepEqual(km.defaultOutputStructure.keys, [
    "concepts",
    "relationships",
    "groupings",
    "processes",
    "misconceptions"
  ]);
});

test("pack §3 KM: defaultPromptNotes reinforce raw JSON only", () => {
  assert.match(km.defaultPromptNotes, /raw JSON only/i);
  assert.match(km.defaultPromptNotes, /No markdown fences/i);
  assert.doesNotMatch(km.defaultPromptNotes, /fenced/i);
});

test("harness KM contract: aligned to raw JSON only (no fences)", () => {
  const contract = buildKmHarnessOutputContract(2);
  assert.match(contract, /parseable JSON only/i);
  assert.match(contract, /raw JSON object/i);
  assert.match(contract, /No markdown code fences/i);
  assert.doesNotMatch(contract, /fenced/i);
  assert.doesNotMatch(contract, /STEP \d+ OUTPUT:\s*knowledge_model/i);
});

test("38L harness: KM system prompt uses raw JSON contract", () => {
  const harnessPath = path.join(
    repoRoot,
    "docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/ev-38l-inflation-pipeline-capture-once.mjs"
  );
  const src = fs.readFileSync(harnessPath, "utf8");
  assert.match(src, /valid JSON object/i);
  assert.match(src, /No markdown fences/i);
  assert.doesNotMatch(src, /fenced ```json block/i);
});

test("pack §5/§6 38L depth rules unchanged after KM contract fix", () => {
  assert.match(dla.promptTemplate, /IFP-09 DEPTH FLOORS/i);
  assert.match(dla.promptTemplate, /DLA-WB-31.*38L-4/i);
  assert.match(gam.promptTemplate, /GAM-PRES-10.*38L-4/i);
  assert.match(gam.promptTemplate, /GAM-WB-31.*38L-4/i);
});
