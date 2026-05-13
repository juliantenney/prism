const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const fixtureDir = path.join(repoRoot, "tests", "fixtures", "workflow-brief-pass1");
const appJsPath = path.join(repoRoot, "app.js");

function loadFixture(fileName) {
  const fullPath = path.join(fixtureDir, fileName);
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

function assertSubset(actual, expected, label) {
  Object.keys(expected).forEach((key) => {
    assert.ok(Object.prototype.hasOwnProperty.call(actual, key), `${label}: missing key "${key}"`);
    assert.deepEqual(actual[key], expected[key], `${label}: value mismatch for "${key}"`);
  });
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise
  };
  const documentStub = {
    readyState: "loading",
    addEventListener: () => {}
  };
  const windowStub = {
    document: documentStub
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;

  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });

  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API to be exposed");
  assert.equal(typeof api.buildWorkflowDesignBase, "function");
  assert.equal(typeof api.buildWorkflowDesignBrief, "function");
  assert.equal(typeof api.extractWorkflowBriefExplicitFactors, "function");
  return api;
}

const api = loadPrismTestApi();
const fixtures = [
  loadFixture("minimal.json"),
  loadFixture("maximal-factor-rich.json"),
  loadFixture("cross-domain-ordering.json")
];

test("buildWorkflowDesignBase returns stable trimmed base object", () => {
  fixtures.forEach((fixture) => {
    const actual = api.buildWorkflowDesignBase(fixture.baseInput);
    assert.deepEqual(actual, fixture.expectedBase, `base mismatch for ${fixture.caseId}`);
  });
});

test("buildWorkflowDesignBrief preserves exact briefLines ordering and prefixes", () => {
  fixtures.forEach((fixture) => {
    const base = api.buildWorkflowDesignBase(fixture.baseInput);
    const briefPayload = api.buildWorkflowDesignBrief(base, fixture.resolvedState);
    assert.deepEqual(
      briefPayload.briefLines,
      fixture.expectedBriefLines,
      `briefLines mismatch for ${fixture.caseId}`
    );
    assert.equal(
      briefPayload.brief,
      fixture.expectedBriefLines.join("\n"),
      `brief join mismatch for ${fixture.caseId}`
    );
  });
});

test("extractWorkflowBriefExplicitFactors preserves expected JSON subset", () => {
  fixtures.forEach((fixture) => {
    const base = api.buildWorkflowDesignBase(fixture.baseInput);
    const actual = api.extractWorkflowBriefExplicitFactors(base);
    assertSubset(actual, fixture.expectedExtractSubset, fixture.caseId);
  });
});
