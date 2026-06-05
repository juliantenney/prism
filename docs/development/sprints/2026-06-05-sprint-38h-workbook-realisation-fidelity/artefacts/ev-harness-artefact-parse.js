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
  const n = typeof stepNumber === "number" && stepNumber > 0 ? stepNumber : 2;
  return [
    "Output contract (strict — harness capture):",
    "- Emit exactly one fenced ```json block containing the knowledge_model object.",
    "- No prose before the opening fence.",
    "- No prose after the closing fence except the runner footer line on its own line.",
    `- Runner footer (outside the fence, not inside JSON): STEP ${n} OUTPUT: knowledge_model`,
    "- JSON top-level keys (use empty arrays when none apply): concepts, relationships, groupings, processes, misconceptions.",
    "- concepts: each entry includes name and definition.",
    "- Return only the fenced JSON and the footer line."
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
