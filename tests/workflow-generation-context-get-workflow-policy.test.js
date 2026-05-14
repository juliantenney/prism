/**
 * Integration: getWorkflowPolicy must load the Research pack when Research is selected,
 * even if Learning Design appears first — otherwise app.js heuristics use LD dependencies
 * and the topo pass drops terminal Design Page from research-shaped drafts.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const wgcPath = path.join(repoRoot, "workflowGenerationContext.js");
const manifestFsPath = path.join(repoRoot, "domains", "domain-manifest.json");

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
  assert.ok(api && typeof api.getWorkflowPolicy === "function");
  return api;
}

test("getWorkflowPolicy: learning-design + research uses Research pack (researchDesignPageAppend)", async () => {
  const api = loadWorkflowGenerationContextWithDiskFiles();
  const policy = await api.getWorkflowPolicy({
    selectedDomains: ["learning-design", "research"]
  });
  assert.ok(policy && typeof policy === "object", "expected workflowPolicy object");
  assert.ok(
    policy.researchDesignPageAppend && typeof policy.researchDesignPageAppend === "object",
    "Research pack must drive heuristics when Research is among selected domains"
  );
});

test("getWorkflowPolicy: general + research uses Research pack", async () => {
  const api = loadWorkflowGenerationContextWithDiskFiles();
  const policy = await api.getWorkflowPolicy({ selectedDomains: ["general", "research"] });
  assert.ok(policy && policy.researchDesignPageAppend);
});

test("getWorkflowPolicy: learning-design only uses Learning Design pack", async () => {
  const api = loadWorkflowGenerationContextWithDiskFiles();
  const policy = await api.getWorkflowPolicy({ selectedDomains: ["general", "learning-design"] });
  assert.ok(policy && typeof policy === "object");
  assert.equal(
    !!policy.researchDesignPageAppend,
    false,
    "LD-only selection must not expose research-only policy keys"
  );
});
