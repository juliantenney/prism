/**
 * Sprint 38-H — Harness artefact capture parsing (Model Knowledge contract).
 */

const KM_REQUIRED_TOP_KEYS = ["concepts", "relationships", "groupings", "processes", "misconceptions"];

function extractFencedJsonBlock(text) {
  const s = String(text || "").trim();
  if (!s) return null;
  const re = /```(?:json)?\s*\r?\n([\s\S]*?)\r?\n```/i;
  const m = s.match(re);
  return m ? m[1].trim() : null;
}

function parseJsonObjectFromArtefact(raw, sanitizeFn) {
  const sanitized =
    typeof sanitizeFn === "function" ? sanitizeFn(raw) : String(raw || "").trim();
  if (!sanitized) return null;

  const candidates = [];
  const fenced = extractFencedJsonBlock(sanitized);
  if (fenced) candidates.push(fenced);

  const start = sanitized.indexOf("{");
  const end = sanitized.lastIndexOf("}");
  if (start !== -1 && end > start) candidates.push(sanitized.slice(start, end + 1));

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
    } catch {
      /* try next candidate */
    }
  }
  return null;
}

function normalizeKnowledgeModelShape(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return null;
  const out = Object.assign({}, obj);
  for (const key of KM_REQUIRED_TOP_KEYS) {
    if (!Array.isArray(out[key])) out[key] = [];
  }
  return out;
}

function parseKnowledgeModelCapture(raw, sanitizeFn) {
  const parsed = parseJsonObjectFromArtefact(raw, sanitizeFn);
  if (!parsed) {
    throw new Error("Model Knowledge capture did not contain parseable JSON");
  }
  const normalized = normalizeKnowledgeModelShape(parsed);
  if (!normalized || !Array.isArray(normalized.concepts)) {
    throw new Error("knowledge_model must include a concepts array");
  }
  return normalized;
}

function buildKmHarnessOutputContract(stepNumber) {
  void stepNumber;
  return [
    "Output contract (strict — parseable JSON only):",
    "- Return exactly one valid JSON object: the knowledge_model root object.",
    "- No markdown code fences (no triple-backtick json blocks).",
    "- No prose, headings, or commentary before or after the JSON object.",
    "- No JSON comments.",
    "- No STEP N OUTPUT footer lines.",
    "- JSON top-level keys (use empty arrays when none apply): concepts, relationships, groupings, processes, misconceptions.",
    "- concepts: each entry includes name and definition.",
    "- Return only the raw JSON object."
  ].join("\n");
}

module.exports = {
  KM_REQUIRED_TOP_KEYS,
  extractFencedJsonBlock,
  parseJsonObjectFromArtefact,
  normalizeKnowledgeModelShape,
  parseKnowledgeModelCapture,
  buildKmHarnessOutputContract
};
