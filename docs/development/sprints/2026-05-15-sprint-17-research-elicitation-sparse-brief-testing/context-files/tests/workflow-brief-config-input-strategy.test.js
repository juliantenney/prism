/**
 * Workflow Factory input_strategy: general-only has no runnable brief pack; structured domains supply input_strategy.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const wgcPath = path.join(repoRoot, "workflowGenerationContext.js");
const manifestFsPath = path.join(repoRoot, "domains", "domain-manifest.json");

const CANONICAL_STARTING_ARTEFACT_VALUES = [
  "generate_from_topic",
  "provided_source_content",
  "mixed"
];

function loadWorkflowGenerationContextWithDiskFiles() {
  const manifestJson = JSON.parse(fs.readFileSync(manifestFsPath, "utf8"));

  function resolveRepoFileFromUrl(url) {
    const normalized = String(url || "").replace(/\\/g, "/");
    const marker = "domains/";
    const pos = normalized.indexOf(marker);
    if (pos === -1) return null;
    const rel = normalized.slice(pos);
    return path.join(repoRoot, rel.replace(/\//g, path.sep));
  }

  function fetchImpl(url) {
    const u = String(url || "");
    if (u.includes("domain-manifest.json")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(manifestJson)
      });
    }
    const disk = resolveRepoFileFromUrl(u);
    if (disk && fs.existsSync(disk)) {
      const text = fs.readFileSync(disk, "utf8");
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(text)
      });
    }
    return Promise.resolve({
      ok: false,
      status: 404,
      text: () => Promise.resolve("")
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
  assert.ok(api && typeof api.getWorkflowBriefConfig === "function");
  return api;
}

test("getWorkflowBriefConfig general-only returns null config (baseline-only)", async () => {
  const api = loadWorkflowGenerationContextWithDiskFiles();
  const r = await api.getWorkflowBriefConfig({ selectedDomains: ["general"] });
  assert.equal(r.domainId, "general");
  assert.equal(r.config, null, "general must not expose a runnable workflowBriefConfig pack");
});

test("getWorkflowBriefConfig structured domain still uses first structured pack", async () => {
  const api = loadWorkflowGenerationContextWithDiskFiles();
  const r = await api.getWorkflowBriefConfig({
    selectedDomains: ["general", "research"]
  });
  assert.equal(r.domainId, "research");
  assert.ok(r.config && typeof r.config === "object");
  const factors = []
    .concat(r.config.requiredFactors || [], r.config.optionalFactors || [])
    .filter(Boolean);
  const f = factors.find(function (x) {
    return x && String(x.id || "").trim() === "input_strategy";
  });
  assert.ok(f, "research pack should define input_strategy");
  assert.ok(Array.isArray(f.choices) && f.choices.length === 3);
  const values = f.choices.map(function (c) {
    return c && typeof c === "object" ? String(c.value || "").trim() : String(c || "").trim();
  });
  for (const v of CANONICAL_STARTING_ARTEFACT_VALUES) {
    assert.ok(values.includes(v), "expected choice value " + v);
  }
});
