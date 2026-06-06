/**
 * Sprint 38-H — Harness artefact capture parsing (strict JSON contracts).
 */

const path = require("path");

const {
  parseKnowledgeModelCaptureStrict,
  parseLearningSequenceCaptureStrict,
  parseStrictJsonObjectCapture,
  normalizeKnowledgeModelShape,
  buildStrictKnowledgeModelOutputContractBlock,
  buildStrictLearningSequenceOutputContractBlock
} = require(path.join(__dirname, "..", "..", "..", "..", "..", "lib", "workflow-artefact-json-strict.js"));

const KM_REQUIRED_TOP_KEYS = [
  "concepts",
  "relationships",
  "groupings",
  "processes",
  "misconceptions"
];

function extractFencedJsonBlock(text) {
  const s = String(text || "").trim();
  if (!s) return null;
  const re = /```(?:json)?\s*\r?\n([\s\S]*?)\r?\n```/i;
  const m = s.match(re);
  return m ? m[1].trim() : null;
}

function parseKnowledgeModelCapture(raw, sanitizeFn) {
  return parseKnowledgeModelCaptureStrict(raw, sanitizeFn);
}

function parseLearningSequenceCapture(raw, sanitizeFn) {
  return parseLearningSequenceCaptureStrict(raw, sanitizeFn);
}

function buildKmHarnessOutputContract(stepNumber) {
  void stepNumber;
  return buildStrictKnowledgeModelOutputContractBlock().replace(/^\n/, "");
}

function buildLearningSequenceHarnessOutputContract(stepNumber) {
  void stepNumber;
  return buildStrictLearningSequenceOutputContractBlock().replace(/^\n/, "");
}

module.exports = {
  KM_REQUIRED_TOP_KEYS,
  extractFencedJsonBlock,
  parseStrictJsonObjectCapture,
  normalizeKnowledgeModelShape,
  parseKnowledgeModelCapture,
  parseLearningSequenceCapture,
  buildKmHarnessOutputContract,
  buildLearningSequenceHarnessOutputContract
};
