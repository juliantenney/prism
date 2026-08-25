/**
 * S78-T-026 — S78-DP disciplinary-warrant authoring salience (prompt-contract tests).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const dlaContract = require(path.join(repoRoot, "lib", "ld-dla-page-enrich-contract.js"));
const gamContract = require(path.join(repoRoot, "lib", "ld-gam-page-enrich-contract.js"));
const designPagePartial = require(path.join(repoRoot, "lib", "ld-design-page-partial-contract.js"));
const visualJobs = require(path.join(repoRoot, "lib", "utilities-visual-jobs-workspace.js"));
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

function loadPrismTestApi() {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

const api = loadPrismTestApi();

const DP_MARKER = /S78-DP/;
const SIMPLIFY_RULE = /Omit advanced theory freely;\s*do not upgrade the strength of what remains/i;

test("T-026 DLA production surfaces S78-DP claim-strength salience", () => {
  const production = dlaContract.assembleDlaCanonicalContract().sections.production;
  assert.match(production, DP_MARKER);
  assert.match(production, /stronger disciplinary conclusion/i);
  assert.match(production, /accurate strength/i);
  assert.match(production, /candidate or feasible/i);
  assert.match(production, /one short scope bound/i);
  assert.match(production, SIMPLIFY_RULE);
  assert.doesNotMatch(production, /banned.?term|domain.?solver|Lagrangian-specific/i);
});

test("T-026 DLA commissioning surfaces S78-DP without mandatory verbose caveats", () => {
  const commissioning = dlaContract.assembleDlaCanonicalContract().sections.commissioning;
  assert.match(commissioning, /S78-DP \(commissioning\)/);
  assert.match(commissioning, /necessary or intermediate results/i);
  assert.match(commissioning, /bind scope to stated scenario\/conditions/i);
  assert.doesNotMatch(commissioning, /legalistic caveat on every material/i);
});

test("T-026 DLA S78-DP is domain-general (necessary≠sufficient typology, not Lagrangian rules)", () => {
  const text = dlaContract.assembleDlaCanonicalContract().text;
  assert.match(text, /S78-DP disciplinary warrant/);
  assert.doesNotMatch(text, /Lagrange|shadow price|first-order condition|g_i\(x\)/i);
});

test("T-026 GAM enrich contract honours S78-DP warrant boundary", () => {
  const block = gamContract.buildGamPageEnrichContractBlock();
  assert.match(block, /honour S78-DP disciplinary warrant/i);
  assert.match(block, /taught model class/i);
  assert.match(block, /do not strengthen claim strength beyond the commission/i);
  assert.match(block, /candidate\/feasible\/scoped interpretation/i);
  assert.match(block, /S78-OPERATIONAL-SUITABILITY/);
});

test("T-026 GAM Copy brief includes S78-DP claim-strength line", () => {
  const brief = api.buildGamV2CopyMaterialAuthoringBrief();
  assert.match(brief, /S78-DP:/);
  assert.match(brief, /necessary or intermediate results/i);
  assert.match(brief, /Prefer accurate scoped language over establishment slogans/i);
  assert.match(brief, SIMPLIFY_RULE);
  assert.match(brief, /S78-OPERATIONAL-SUITABILITY \(auto-applied\)/);
});

test("T-026 Design Page partial encodes synthesis + visual claim model-class salience", () => {
  const block = designPagePartial.buildDesignPagePartialContractBlock();
  assert.match(block, /S78-DP disciplinary warrant \(Design Page\)/);
  assert.match(block, /knowledge_summary/);
  assert.match(block, /unrestricted disciplinary slogans/i);
  assert.match(block, /allowed_claims/);
  assert.match(block, /disallowed_claims/);
  assert.match(block, /taught model-class and claim-strength bounds/i);
  assert.match(block, /broader notation\/representation classes/i);
  assert.match(block, SIMPLIFY_RULE);
});

test("T-026 Sprint 38 visual affordance authoring projects S78-DP claim bounds", () => {
  assert.equal(typeof api.buildSprint38VisualAffordanceDesignPagePromptBlock, "function");
  const va = api.buildSprint38VisualAffordanceDesignPagePromptBlock();
  assert.match(va, /S78-DP:/);
  assert.match(va, /taught model-class and claim-strength bounds/i);
  assert.match(va, /broaden the taught representation class/i);
  assert.match(va, /S78-VA synthesis/i);
  assert.match(va, /inputs and outputs around the system/i);
});

test("T-026 image human prompt reinforces claim/model-class bounds", () => {
  const brief = {
    preferred_representation: "comparison_framework",
    subject: "Association versus causation in observational data",
    context: "Visual brief: contrast sample association with unwarranted causal certainty.",
    purpose: "comparison",
    content_requirements: { authored: ["Sample association shown", "Population claim left open"] },
    exclusion_requirements: {
      authored_must_not_show: ["Causal arrow from association alone"],
      authored_representation_avoid: []
    },
    claim_constraints: {
      allowed: ["Association observed in the supplied sample"],
      disallowed: ["Established population causation from sample association alone"]
    },
    spoiler_constraints: { anti_spoiler: false },
    pedagogical_metadata: {
      pedagogical_added_value: "Keeps association distinct from causation.",
      reasoning_supported: "Learners judge claim strength from the visual."
    },
    placement: { visual_slot: "materials-entry" }
  };
  const prompt = visualJobs.buildVisualJobHumanPrompt(brief);
  assert.match(prompt, /Claim discipline:/i);
  assert.match(
    prompt,
    /Do not introduce mathematical forms, constraint classes, or optimality\/evidence claims stronger or broader than the allowed claims, disallowed claims, and exclusions in this brief/i
  );
  assert.match(prompt, /Supported claim boundary: Association observed in the supplied sample/);
  assert.match(
    prompt,
    /Do not claim: Established population causation from sample association alone/
  );
});

test("T-026 cross-disciplinary fixture shapes stay general (stats / programming / humanities analogues)", () => {
  const dla = dlaContract.assembleDlaCanonicalContract().text;
  const gam = gamContract.buildGamPageEnrichContractBlock();
  const dp = designPagePartial.buildDesignPagePartialContractBlock();
  const combined = [dla, gam, dp].join("\n");
  assert.match(combined, /taught model class/i);
  assert.match(combined, /stronger/i);
  // Domain-general typology language, not subject packs:
  assert.doesNotMatch(combined, /Lagrange multiplier|shadow-price tightness|q\s*≤\s*6/i);
});

test("T-026 does not expand operational-suitability verifier surfaces", () => {
  const reviewPath = path.join(repoRoot, "lib", "gam-operational-suitability-prompt.js");
  const reviewSrc = fs.readFileSync(reviewPath, "utf8");
  assert.doesNotMatch(reviewSrc, /S78-DP/);
  const brief = api.buildGamV2CopyMaterialAuthoringBrief();
  assert.match(brief, /S78-DP:/);
  assert.match(brief, /S78-OPERATIONAL-SUITABILITY/);
});
