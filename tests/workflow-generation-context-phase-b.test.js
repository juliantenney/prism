/**
 * Sprint 12 Phase B — structural observability: ### File: path provenance order in promptContext only.
 * Happy-path VM + fetch stub; workflowGenerationContext.js only. No app.js, no loadedFiles/missingFiles,
 * no fallback/cache/missing-file branches.
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
const PLACEHOLDER_FILE_BODY = ".";

/** Mirrors workflowGenerationContext.normalizeSelectedDomains for expected path ordering only. */
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

function expectedDomainFilePathsInOrder(manifest, selectedDomainsInput) {
  const normalized = normalizeSelectedDomainsForExpectation(selectedDomainsInput, manifest);
  const out = [];
  normalized.forEach(function (domainId) {
    const d = manifest.domains[domainId];
    if (d && Array.isArray(d.files)) {
      out.push.apply(out, d.files);
    }
  });
  return out;
}

function extractOrderedFilePathsFromSection(sectionMarkdown) {
  const text = String(sectionMarkdown || "");
  const paths = [];
  const re = /^### File:\s*(.+)$/gm;
  let m;
  while ((m = re.exec(text)) !== null) {
    paths.push(String(m[1] || "").trim());
  }
  return paths;
}

function splitPromptContextSections(promptContext) {
  const pc = String(promptContext || "");
  const parts = pc.split(SECTION_JOIN);
  assert.equal(parts.length, 3, "expected three promptContext sections joined by ====================");
  return { platformSection: parts[0], domainSection: parts[1], briefSection: parts[2] };
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

test("Phase B — general only: ### File: path order in PLATFORM and DOMAIN sections", async () => {
  const ctx = await api.buildWorkflowGenerationContext({
    selectedDomains: ["general"],
    brief: ""
  });
  const { platformSection, domainSection } = splitPromptContextSections(ctx.promptContext);

  const platformPaths = extractOrderedFilePathsFromSection(platformSection);
  const domainPaths = extractOrderedFilePathsFromSection(domainSection);

  assert.deepEqual(platformPaths, manifest.platformFiles.slice());
  assert.deepEqual(domainPaths, expectedDomainFilePathsInOrder(manifest, ["general"]));
});

test("Phase B — general + learning-design: ### File: path order matches normalized domain order", async () => {
  const selectedInput = ["general", "learning-design"];
  const ctx = await api.buildWorkflowGenerationContext({
    selectedDomains: selectedInput,
    brief: ""
  });
  const { platformSection, domainSection } = splitPromptContextSections(ctx.promptContext);

  const platformPaths = extractOrderedFilePathsFromSection(platformSection);
  const domainPaths = extractOrderedFilePathsFromSection(domainSection);

  assert.deepEqual(platformPaths, manifest.platformFiles.slice());
  assert.deepEqual(domainPaths, expectedDomainFilePathsInOrder(manifest, selectedInput));
});
