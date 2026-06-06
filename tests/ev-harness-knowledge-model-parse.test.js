/**
 * Sprint 38-H — Model Knowledge harness artefact parse contract (fenced JSON only).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const {
  parseKnowledgeModelCapture,
  parseLearningSequenceCapture,
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

const strict = require(path.join(__dirname, "..", "lib", "workflow-artefact-json-strict.js"));

function sanitizePrismRunCapturedOutput(raw) {
  return strict.stripTrailingStepFooter(raw);
}

function fencedJson(obj) {
  return "```json\n" + JSON.stringify(obj, null, 2) + "\n```";
}

const sampleKm = {
  concepts: [{ name: "inflation", definition: "A sustained rise in the general price level." }],
  relationships: [{ from: "CPI", to: "inflation", type: "measures" }],
  groupings: [],
  processes: [],
  misconceptions: []
};

const sampleLs = {
  sequence_title: "Session",
  total_duration_minutes: 60,
  timeline: [
    {
      block_id: "b1",
      start_minute: 0,
      duration_minutes: 15,
      phase_type: "activity",
      activity_id: "A1",
      grouping: "individual",
      facilitator_actions: [],
      learner_actions: ["Read"],
      transition_to_next: "Continue"
    }
  ],
  activities_used: ["A1"],
  activities_omitted: [],
  checks: { all_activity_ids_valid: true }
};

test("KM parse: accepts exactly one fenced json block", () => {
  const parsed = parseKnowledgeModelCapture(fencedJson(sampleKm), sanitizePrismRunCapturedOutput);
  assert.equal(parsed.concepts.length, 1);
  assert.deepEqual(parsed.groupings, []);
});

test("KM parse: rejects raw JSON plain text (observed failure mode)", () => {
  const raw = JSON.stringify(sampleKm);
  assert.throws(
    () => parseKnowledgeModelCapture(raw, sanitizePrismRunCapturedOutput),
    /raw_json_without_fence|fenced JSON/i
  );
});

test("KM parse: rejects fenced JSON with conversational preamble", () => {
  const raw =
    "Here is the knowledge model you asked for:\n\n" + fencedJson(sampleKm);
  assert.throws(
    () => parseKnowledgeModelCapture(raw, sanitizePrismRunCapturedOutput),
    /missing_fenced_json_block|fenced JSON/i
  );
});

test("KM parse: accepts fenced JSON when STEP footer is stripped by sanitizer", () => {
  const raw = fencedJson(sampleKm) + "\nSTEP 2 OUTPUT: knowledge_model\n";
  const parsed = parseKnowledgeModelCapture(raw, sanitizePrismRunCapturedOutput);
  assert.equal(parsed.concepts.length, 1);
});

test("KM parse: rejects unparseable capture", () => {
  assert.throws(
    () => parseKnowledgeModelCapture("Sure, here is the model: not json", sanitizePrismRunCapturedOutput),
    /missing_fenced_json_block|fenced JSON/i
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

test("extractFencedJsonBlock: reads json fence body (diagnostic helper only)", () => {
  const body = extractFencedJsonBlock("```json\n{\"concepts\":[]}\n```");
  assert.equal(body, '{"concepts":[]}');
});

test("LS parse: accepts exactly one fenced json block", () => {
  const parsed = parseLearningSequenceCapture(fencedJson(sampleLs), sanitizePrismRunCapturedOutput);
  assert.equal(parsed.timeline.length, 1);
});

test("LS parse: rejects raw JSON plain text (observed failure mode)", () => {
  assert.throws(
    () => parseLearningSequenceCapture(JSON.stringify(sampleLs), sanitizePrismRunCapturedOutput),
    /raw_json_without_fence|fenced JSON/i
  );
});

test("LS parse: rejects prose before fenced block", () => {
  const raw = "Facilitation plan:\n" + fencedJson(sampleLs);
  assert.throws(
    () => parseLearningSequenceCapture(raw, sanitizePrismRunCapturedOutput),
    /missing_fenced_json_block|fenced JSON/i
  );
});

test("LS parse: accepts fenced JSON when STEP footer is stripped by sanitizer", () => {
  const raw = fencedJson(sampleLs) + "\nSTEP 10 OUTPUT: learning_sequence\n";
  const parsed = parseLearningSequenceCapture(raw, sanitizePrismRunCapturedOutput);
  assert.equal(parsed.timeline.length, 1);
});
