/**
 * Sprint 12 Phase A — structural observability only (workflow-generation-context assembly skeleton).
 * Happy-path harness; stubbed fetch only. Does not assert file-path provenance, loadedFiles, missingFiles,
 * cache/fallback branches, or app.js.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const wgcPath = path.join(repoRoot, "workflowGenerationContext.js");
const manifestFsPath = path.join(repoRoot, "domains", "domain-manifest.json");

/** Minimal placeholder: no "## " substring so it cannot collide with section heading checks. */
const PLACEHOLDER_FILE_BODY = ".";

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
  return api;
}

/**
 * Phase A: promptContext section skeleton only — no full snapshots, no semantic assertions.
 */
function assertPromptContextAssemblySkeleton(promptContext) {
  const pc = String(promptContext || "");

  const hPlatform = "## PLATFORM CONTEXT";
  const hDomain = "## DOMAIN CONTEXT";
  const hBrief = "## WORKFLOW BRIEF";

  const iPlatform = pc.indexOf(hPlatform);
  const iDomain = pc.indexOf(hDomain);
  const iBrief = pc.indexOf(hBrief);

  assert.notEqual(iPlatform, -1, "expected ## PLATFORM CONTEXT heading");
  assert.notEqual(iDomain, -1, "expected ## DOMAIN CONTEXT heading");
  assert.notEqual(iBrief, -1, "expected ## WORKFLOW BRIEF heading");
  assert.ok(
    iPlatform < iDomain && iDomain < iBrief,
    "expected section order PLATFORM CONTEXT → DOMAIN CONTEXT → WORKFLOW BRIEF"
  );

  const iSelected = pc.indexOf("Selected domains:");
  assert.notEqual(iSelected, -1, "expected Selected domains: line in domain section");
  assert.ok(
    iDomain < iSelected && iSelected < iBrief,
    "expected Selected domains: between DOMAIN CONTEXT and WORKFLOW BRIEF sections"
  );
}

const api = loadWorkflowGenerationContextApi();

test("Phase A — general only: workflow-generation-context assembly skeleton", async () => {
  const ctx = await api.buildWorkflowGenerationContext({
    selectedDomains: ["general"],
    brief: ""
  });
  assertPromptContextAssemblySkeleton(ctx.promptContext);
});

test("Phase A — general + learning-design: workflow-generation-context assembly skeleton", async () => {
  const ctx = await api.buildWorkflowGenerationContext({
    selectedDomains: ["general", "learning-design"],
    brief: ""
  });
  assertPromptContextAssemblySkeleton(ctx.promptContext);
});
