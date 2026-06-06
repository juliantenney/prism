/**
 * Model Knowledge (pack §3) — strict fenced JSON output contract regression guard.
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
const ls = extractPromptFactory("## 10. Construct Learning Sequence");
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

test("pack §3 KM: requires exactly one fenced json block", () => {
  const t = km.promptTemplate;
  assert.match(t, /fenced JSON block only/i);
  assert.match(t, /exactly one markdown fenced JSON block/i);
  assert.match(t, /opened with ```json/i);
  assert.match(t, /knowledge_model root object/i);
  assert.equal(km.preferredOutputFormat, "json");
});

test("pack §3 KM: rejects raw JSON without fence", () => {
  const t = km.promptTemplate;
  assert.match(t, /Do NOT return raw JSON without the ```json fence/i);
  assert.match(t, /Do NOT include any prose/i);
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

test("pack §3 KM: defaultPromptNotes reinforce fenced JSON block", () => {
  assert.match(km.defaultPromptNotes, /```json fenced block/i);
  assert.match(km.defaultPromptNotes, /No prose before or after/i);
});

test("pack §10 Learning Sequence: requires exactly one fenced json block", () => {
  const t = ls.promptTemplate;
  assert.match(t, /fenced JSON block only/i);
  assert.match(t, /exactly one markdown fenced JSON block/i);
  assert.match(t, /learning_sequence root object/i);
  assert.equal(ls.preferredOutputFormat, "json");
  assert.equal(ls.structureStyle, "schema_structured");
});

test("pack §10 Learning Sequence: rejects raw JSON without fence", () => {
  const t = ls.promptTemplate;
  assert.match(t, /Do NOT return raw JSON without the ```json fence/i);
  assert.match(t, /Do NOT include any prose/i);
});

test("pack §10 Learning Sequence: preserves required top-level structure keys", () => {
  const t = ls.promptTemplate;
  for (const key of [
    "sequence_title",
    "total_duration_minutes",
    "timeline",
    "activities_used",
    "activities_omitted",
    "checks"
  ]) {
    assert.match(t, new RegExp(key));
  }
  assert.deepEqual(ls.defaultOutputStructure.keys, [
    "sequence_title",
    "total_duration_minutes",
    "timeline",
    "activities_used",
    "activities_omitted",
    "checks"
  ]);
});

test("pack §10 Learning Sequence: defaultPromptNotes reinforce fenced JSON block", () => {
  assert.match(ls.defaultPromptNotes, /fenced block/i);
  assert.match(ls.defaultPromptNotes, /No prose before or after/i);
});

test("harness KM contract: aligned to fenced JSON block", () => {
  const contract = buildKmHarnessOutputContract(2);
  assert.match(contract, /fenced JSON block only/i);
  assert.match(contract, /```json/i);
  assert.match(contract, /Do NOT return raw JSON without the ```json fence/i);
});

test("38M harness: KM system prompt uses fenced JSON contract", () => {
  const harnessPath = path.join(
    repoRoot,
    "docs/development/sprints/2026-06-05-sprint-38m-page-composition-fidelity/artefacts/ev-38m-inflation-pipeline-capture-once.mjs"
  );
  const src = fs.readFileSync(harnessPath, "utf8");
  assert.match(src, /fenced ```json block/i);
  assert.match(src, /No raw JSON outside a fence/i);
});

test("38L harness: KM system prompt uses fenced JSON contract", () => {
  const harnessPath = path.join(
    repoRoot,
    "docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/ev-38l-inflation-pipeline-capture-once.mjs"
  );
  const src = fs.readFileSync(harnessPath, "utf8");
  assert.match(src, /fenced ```json block/i);
  assert.match(src, /No raw JSON outside a fence/i);
});

test("harness LS contract: aligned to fenced JSON block", () => {
  const { buildLearningSequenceHarnessOutputContract } = require(path.join(
    repoRoot,
    "docs",
    "development",
    "sprints",
    "2026-06-05-sprint-38h-workbook-realisation-fidelity",
    "artefacts",
    "ev-harness-artefact-parse.js"
  ));
  const contract = buildLearningSequenceHarnessOutputContract(10);
  assert.match(contract, /fenced JSON block only/i);
  assert.match(contract, /```json/i);
  assert.match(contract, /Do NOT return raw JSON without the ```json fence/i);
  assert.match(contract, /learning_sequence root object/i);
});

test("pack §5/§6 38L depth rules unchanged after KM contract fix", () => {
  assert.match(dla.promptTemplate, /IFP-09 DEPTH FLOORS/i);
  assert.match(dla.promptTemplate, /DLA-WB-31.*38L-4/i);
  assert.match(gam.promptTemplate, /GAM-PRES-10.*38L-4/i);
  assert.match(gam.promptTemplate, /GAM-WB-31.*38L-4/i);
});
