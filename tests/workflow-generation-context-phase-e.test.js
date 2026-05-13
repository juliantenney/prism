/**
 * Sprint 12 Phase E — structural observability: `Selected domains:` token order in DOMAIN CONTEXT only.
 * workflowGenerationContext.js via VM; happy-path fetch stub; promptContext parsing only.
 * Does not assert ### File: order, loadedFiles, missingFiles, fallback/cache, or app.js.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const wgcPath = path.join(repoRoot, "workflowGenerationContext.js");
const manifestFsPath = path.join(repoRoot, "domains", "domain-manifest.json");

const SECTION_JOIN = "\n\n====================\n\n";

/** Must not contain "##", "### File:", or "Selected domains:" — avoids colliding with structural parses. */
const PLACEHOLDER_FILE_BODY = ".";

/** Mirrors workflowGenerationContext.normalizeSelectedDomains for expected id order only. */
function normalizeSelectedDomainsForExpectation(selectedDomains, manifest) {
  const selected = {};
  (Array.isArray(selectedDomains) ? selectedDomains : []).forEach(function (id) {
    if (id && manifest.domains[id]) selected[id] = true;
  });
  (manifest.alwaysOnDomains || []).forEach(function (id) {
    if (manifest.domains[id]) selected[id] = true;
  });
  return Object.keys(selected);
}

function extractDomainContextSection(promptContext) {
  const pc = String(promptContext || "");
  const parts = pc.split(SECTION_JOIN);
  assert.equal(parts.length, 3, "expected three promptContext sections joined by SECTION_JOIN");
  return parts[1];
}

/**
 * First line in DOMAIN CONTEXT whose trimmed content starts with "Selected domains:".
 * Returns normalized id tokens (empty list when body is none).
 */
function parseFirstSelectedDomainsLine(domainSection) {
  const text = String(domainSection || "");
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const trimmed = String(lines[i] || "").trim();
    if (!trimmed.toLowerCase().startsWith("selected domains:")) continue;
    const rest = trimmed.slice(trimmed.indexOf(":") + 1).trim();
    if (!rest || rest === "none") return [];
    return rest
      .split(",")
      .map(function (s) {
        return String(s || "").trim();
      })
      .filter(Boolean);
  }
  assert.ok(false, "expected a Selected domains: line in DOMAIN CONTEXT");
}

function loadWorkflowGenerationContextApi() {
  const manifestJson = JSON.parse(fs.readFileSync(manifestFsPath, "utf8"));

  function fetchImpl(url) {
    const u = String(url || "");
    if (u.includes("domain-manifest.json")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(manifestJson)
      });
    }
    return Promise.resolve({
      ok: true,
      text: () => Promise.resolve(PLACEHOLDER_FILE_BODY)
    });
  }

  const sandbox = {
    console,
    Promise,
    fetch: fetchImpl
  };
  sandbox.window = sandbox;

  const source = fs.readFileSync(wgcPath, "utf8");
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "workflowGenerationContext.js" });

  const api = sandbox.WorkflowGenerationContext;
  assert.ok(api && typeof api.buildWorkflowGenerationContext === "function");
  return { api, manifest: manifestJson };
}

const { api, manifest } = loadWorkflowGenerationContextApi();

test("Phase E — learning-design + research: Selected domains token order matches normalization", async () => {
  const selectedInput = ["learning-design", "research"];
  const expectedIds = normalizeSelectedDomainsForExpectation(selectedInput, manifest);

  const ctx = await api.buildWorkflowGenerationContext({
    selectedDomains: selectedInput,
    brief: ""
  });

  const domainSection = extractDomainContextSection(ctx.promptContext);
  const tokens = parseFirstSelectedDomainsLine(domainSection);

  assert.deepEqual(tokens, expectedIds);
});

test("Phase E — invalid/duplicate input: filtered, deduped, always-on once", async () => {
  const selectedInput = ["", "not-a-domain", "research", "research"];
  const expectedIds = normalizeSelectedDomainsForExpectation(selectedInput, manifest);

  const ctx = await api.buildWorkflowGenerationContext({
    selectedDomains: selectedInput,
    brief: ""
  });

  const domainSection = extractDomainContextSection(ctx.promptContext);
  const tokens = parseFirstSelectedDomainsLine(domainSection);

  assert.deepEqual(tokens, expectedIds);
});
