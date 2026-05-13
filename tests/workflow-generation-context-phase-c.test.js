/**
 * Sprint 12 Phase C — structural observability: buildWorkflowGenerationContext return shape (happy path only).
 * workflowGenerationContext.js via VM only. No promptContext parsing (no headings / ### File:). No app.js.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const wgcPath = path.join(repoRoot, "workflowGenerationContext.js");
const manifestFsPath = path.join(repoRoot, "domains", "domain-manifest.json");

const PLACEHOLDER_FILE_BODY = ".";

function canonicalizeJson(value) {
  return JSON.parse(JSON.stringify(value));
}

/** Mirrors workflowGenerationContext.normalizeSelectedDomains for expected selectedDomains / load order only. */
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

function expectedAllLoadedPathsInOrder(manifest, selectedDomainsInput) {
  const platformFiles = Array.isArray(manifest.platformFiles) ? manifest.platformFiles.slice() : [];
  const normalized = normalizeSelectedDomainsForExpectation(selectedDomainsInput, manifest);
  const domainFiles = [];
  normalized.forEach(function (domainId) {
    const d = manifest.domains[domainId];
    if (d && Array.isArray(d.files)) {
      domainFiles.push.apply(domainFiles, d.files);
    }
  });
  return platformFiles.concat(domainFiles);
}

function assertReturnShapeHappyPath(ctx, manifest, selectedDomainsInput) {
  assert.equal(typeof ctx.promptContext, "string", "promptContext must be a string");

  const loadedFiles = canonicalizeJson(ctx.loadedFiles);
  const missingFiles = canonicalizeJson(ctx.missingFiles);
  const selectedDomains = canonicalizeJson(ctx.selectedDomains);

  assert.ok(Array.isArray(loadedFiles), "loadedFiles must be an array");
  loadedFiles.forEach(function (p) {
    assert.equal(typeof p, "string", "each loadedFiles entry must be a path string");
  });

  assert.ok(Array.isArray(missingFiles), "missingFiles must be an array");
  assert.equal(
    missingFiles.length,
    0,
    "missingFiles must be empty in controlled happy-path branch only"
  );

  assert.ok(Array.isArray(selectedDomains), "selectedDomains must be an array");
  assert.deepEqual(
    selectedDomains,
    normalizeSelectedDomainsForExpectation(selectedDomainsInput, manifest),
    "selectedDomains must match production-normalized domain ids"
  );

  assert.deepEqual(
    loadedFiles,
    expectedAllLoadedPathsInOrder(manifest, selectedDomainsInput),
    "loadedFiles must list paths in platform-then-domain happy-path order"
  );
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

test("Phase C — general only: return-shape happy path", async () => {
  const input = ["general"];
  const ctx = await api.buildWorkflowGenerationContext({
    selectedDomains: input,
    brief: ""
  });
  assertReturnShapeHappyPath(ctx, manifest, input);
});

test("Phase C — general + learning-design: return-shape happy path", async () => {
  const input = ["general", "learning-design"];
  const ctx = await api.buildWorkflowGenerationContext({
    selectedDomains: input,
    brief: ""
  });
  assertReturnShapeHappyPath(ctx, manifest, input);
});
