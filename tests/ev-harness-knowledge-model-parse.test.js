/**
 * Sprint 38-H — Model Knowledge harness artefact parse contract.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const {
  parseKnowledgeModelCapture,
  normalizeKnowledgeModelShape,
  extractFencedJsonBlock
} = require(path.join(
  __dirname,
  "..",
  "docs",
  "development",
  "sprints",
  "2026-06-05-sprint-38h-workbook-realisation-fidelity",
  "artefacts",
  "ev-harness-artefact-parse.js"
));

function sanitizePrismRunCapturedOutput(raw) {
  let s = String(raw || "");
  const re = /\r?\nSTEP\s*\d+\s*OUTPUT:[\s\S]*$/i;
  let prev;
  do {
    prev = s;
    s = s.replace(re, "");
  } while (s !== prev);
  const fenceLine = /\r?\n```[a-zA-Z0-9_-]*\s*$/;
  do {
    prev = s;
    s = s.replace(fenceLine, "");
  } while (s !== prev);
  return s;
}

const sampleKm = {
  concepts: [{ name: "inflation", definition: "A sustained rise in the general price level." }],
  relationships: [{ from: "CPI", to: "inflation", type: "measures" }],
  groupings: [],
  processes: [],
  misconceptions: []
};

test("KM parse: fenced JSON with STEP 2 footer", () => {
  const raw =
    "```json\n" +
    JSON.stringify(sampleKm, null, 2) +
    "\n```\nSTEP 2 OUTPUT: knowledge_model\n";
  const parsed = parseKnowledgeModelCapture(raw, sanitizePrismRunCapturedOutput);
  assert.equal(parsed.concepts.length, 1);
  assert.deepEqual(parsed.groupings, []);
  assert.ok(Array.isArray(parsed.misconceptions));
});

test("KM parse: strips conversational preamble when fenced block present", () => {
  const raw =
    "Here is the knowledge model you asked for:\n\n```json\n" +
    JSON.stringify(sampleKm) +
    "\n```\n\nSTEP 2 OUTPUT: knowledge_model";
  const parsed = parseKnowledgeModelCapture(raw, sanitizePrismRunCapturedOutput);
  assert.equal(parsed.concepts[0].name, "inflation");
});

test("KM parse: inline JSON with footer still salvages", () => {
  const raw = JSON.stringify(sampleKm) + "\nSTEP 2 OUTPUT: knowledge_model";
  const parsed = parseKnowledgeModelCapture(raw, sanitizePrismRunCapturedOutput);
  assert.equal(parsed.concepts.length, 1);
});

test("KM parse: rejects unparseable capture", () => {
  assert.throws(
    () => parseKnowledgeModelCapture("Sure, here is the model: not json", sanitizePrismRunCapturedOutput),
    /parseable JSON/
  );
});

test("KM parse: normalizes missing top-level keys to arrays", () => {
  const normalized = normalizeKnowledgeModelShape({ concepts: [] });
  assert.deepEqual(Object.keys(normalized).sort(), [
    "concepts",
    "groupings",
    "misconceptions",
    "processes",
    "relationships"
  ]);
});

test("extractFencedJsonBlock: reads json fence body", () => {
  const body = extractFencedJsonBlock("```json\n{\"concepts\":[]}\n```");
  assert.equal(body, '{"concepts":[]}');
});
