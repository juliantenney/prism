/**
 * Phase 2 — Commissioning-integrated automatic shared-material generation.
 *
 * Detect/generate via learning_commissions markers; persist to parent
 * source_context only when empty; inject established material on revise.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const sibling = require("../lib/learning-journey-sibling-prompts.js");
const shared = require("../lib/learning-journey-shared-source.js");
const intake = require("../lib/first-class-commission-intake.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const TABLET_DATASET = [
  "Illustrative laboratory dataset (fictional — not real experimental evidence).",
  "Experiment: soluble tablet dissolution time",
  "Cool water (20°C): 82, 79, 85, 81, 83, 80 seconds",
  "Warm water (40°C): 43, 46, 44, 42, 45, 44 seconds",
  "Conditions: identical tablets, water volume and agitation"
].join("\n");

const FICTIONAL_SCENARIO = [
  "Fictional workplace scenario (synthetic — not based on a real organisation).",
  "Setting: Meridian Council digital-services team.",
  "Decision: choose among longer library opening hours, additional study spaces, and improved online support.",
  "Constraint: the annual budget increase is capped at £120,000.",
  "Named options remain fixed across the journey: Hours, Spaces, Online."
].join("\n");

function wrapMaterial(body) {
  return shared.wrapSharedAuthoritativeMaterial(body);
}

function commissionArtefact(sharedBodyOrNone, extra) {
  return [
    "LEARNING EXPERIENCE COMMISSIONS",
    "",
    "0. SHARED AUTHORITATIVE MATERIAL",
    "",
    wrapMaterial(sharedBodyOrNone),
    "",
    "1. COMMISSIONING RATIONALE",
    "",
    String(extra || "Commissions follow the locked shared material with progressive disclosure."),
    "",
    "3. PRISM PRODUCT COMMISSIONS",
    "",
    "Commission title: Opening comparison",
    "Product type: Interactive Resource",
    "Educational job: Compare cool and warm dissolution without inventing timings.",
    "Established scenario facts: Use the shared laboratory dataset values.",
    "",
    "STEP 4 OUTPUT: learning_commissions"
  ].join("\n");
}

function loadApi() {
  const loaded = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/first-class-workflow-family.js",
      "lib/first-class-commission-intake.js",
      "lib/learning-journey-sibling-prompts.js",
      "lib/learning-journey-shared-source.js",
      "lib/learning-journey-design-page.js"
    ]
  });
  const host = loaded.window || loaded.sandbox;
  if (host) {
    host.PRISM_LEARNING_JOURNEY_SHARED_SOURCE = shared;
    host.PrismLearningJourneySiblingPrompts = sibling;
  }
  if (loaded.sandbox && loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_LEARNING_JOURNEY_SHARED_SOURCE = shared;
    loaded.sandbox.globalThis.PrismLearningJourneySiblingPrompts = sibling;
  }
  return loaded;
}

function parentJourney(id, sourceContext) {
  return {
    id: id,
    name: "Shared source journey",
    product: "learning_journey",
    artefacts: sourceContext || "",
    steps: [
      {
        id: "step-comm",
        title: "Commissioning",
        outputName: "learning_commissions",
        canonical_step_id: "step_journey_commissioning"
      }
    ],
    workflowBriefResolution: {
      initialBrief: {
        topic: "Shared source journey",
        sourceContext: sourceContext || ""
      },
      resolvedFactors: {
        topic: "Shared source journey",
        source_context: sourceContext || ""
      }
    }
  };
}

test("Commissioning prompt requires SHARED markers and AUTHORITATIVE_SHARED_SOURCE token", () => {
  const body = sibling.TEMPLATES.learning_commissions;
  assert.match(body, /\{\{\s*AUTHORITATIVE_SHARED_SOURCE\s*\}\}/);
  assert.match(body, /<<<SHARED_AUTHORITATIVE_MATERIAL_BEGIN>>>/);
  assert.match(body, /<<<SHARED_AUTHORITATIVE_MATERIAL_END>>>/);
  assert.match(body, /0\. SHARED AUTHORITATIVE MATERIAL/);
  assert.match(body, /progressive disclosure/i);
  assert.match(body, /Do not paste the full shared corpus/i);
  assert.match(body, /illustrative\/fictional\/synthetic|illustrative, fictional or synthetic/i);
  assert.match(body, /Do not fabricate authentic evidence/i);
  // Continuity contract retained.
  assert.match(body, /EDUCATIONAL CONTINUITY CONTRACT/);
});

test("extractSharedAuthoritativeMaterial accepts STEM dataset, scenario, NONE, rejects malformed", () => {
  const stem = shared.extractSharedAuthoritativeMaterial(commissionArtefact(TABLET_DATASET));
  assert.equal(stem.ok, true);
  assert.equal(stem.kind, "material");
  assert.match(stem.body, /82, 79, 85, 81, 83, 80/);

  const scene = shared.extractSharedAuthoritativeMaterial(commissionArtefact(FICTIONAL_SCENARIO));
  assert.equal(scene.ok, true);
  assert.equal(scene.kind, "material");
  assert.match(scene.body, /Meridian Council/);

  const none = shared.extractSharedAuthoritativeMaterial(commissionArtefact("NONE"));
  assert.equal(none.ok, true);
  assert.equal(none.kind, "none");
  assert.equal(none.body, "");

  const missing = shared.extractSharedAuthoritativeMaterial("LEARNING EXPERIENCE COMMISSIONS\nno markers");
  assert.equal(missing.ok, false);
  assert.equal(missing.kind, "missing");

  const empty = shared.extractSharedAuthoritativeMaterial(
    shared.BEGIN_MARKER + "\n\n" + shared.END_MARKER + "\n\n1. COMMISSIONING RATIONALE"
  );
  assert.equal(empty.ok, false);

  const short = shared.extractSharedAuthoritativeMaterial(wrapMaterial("too short"));
  assert.equal(short.ok, false);
  assert.equal(short.kind, "malformed");

  const todo = shared.extractSharedAuthoritativeMaterial(
    wrapMaterial("TODO: insert dataset here with enough filler characters xxxxxxxx")
  );
  assert.equal(todo.ok, false);
});

test("persist writes source_context only when empty; revisions cannot overwrite", () => {
  const { api } = loadApi();
  const wf = parentJourney("wf-lj-p2-write", "");
  api.setWorkflowsForTest([wf]);

  const first = api.applyLearningJourneySharedSourceFromCommissionCapture(
    wf,
    commissionArtefact(TABLET_DATASET)
  );
  assert.equal(first.ok, true);
  assert.equal(first.written, true);
  assert.equal(wf.workflowBriefResolution.resolvedFactors.source_context, TABLET_DATASET);
  assert.equal(api.readLearningJourneyAuthoritativeSourceContext(wf.id), TABLET_DATASET);

  const conflicting = api.applyLearningJourneySharedSourceFromCommissionCapture(
    wf,
    commissionArtefact(FICTIONAL_SCENARIO)
  );
  assert.equal(conflicting.ok, true);
  assert.equal(conflicting.written, false);
  assert.equal(conflicting.skipped, true);
  assert.equal(conflicting.code, "source_context_already_set");
  assert.equal(wf.workflowBriefResolution.resolvedFactors.source_context, TABLET_DATASET);
  assert.doesNotMatch(
    wf.workflowBriefResolution.resolvedFactors.source_context,
    /Meridian Council/
  );
});

test("NONE leaves empty source_context untouched", () => {
  const { api } = loadApi();
  const wf = parentJourney("wf-lj-p2-none", "");
  api.setWorkflowsForTest([wf]);
  const result = api.applyLearningJourneySharedSourceFromCommissionCapture(
    wf,
    commissionArtefact("NONE")
  );
  assert.equal(result.ok, true);
  assert.equal(result.code, "shared_material_none");
  assert.equal(String(wf.workflowBriefResolution.resolvedFactors.source_context || ""), "");
});

test("Create-supplied / pre-existing source is injected into Commissioning prompt verbatim", () => {
  const { api } = loadApi();
  const wf = parentJourney("wf-lj-p2-inject", TABLET_DATASET);
  api.setWorkflowsForTest([wf]);
  const section = api.composeLearningJourneyAuthoritativeSharedSourceToken(wf);
  assert.match(section, /AUTHORITATIVE SHARED SOURCE ALREADY ESTABLISHED/);
  assert.match(section, /without modification or replacement/i);
  assert.match(section, /<<<SHARED_AUTHORITATIVE_MATERIAL_BEGIN>>>/);
  assert.match(section, /82, 79, 85, 81, 83, 80/);

  const step = wf.steps[0];
  const materialized = api.materializeWorkflowPromptTemplateTokens(
    sibling.TEMPLATES.learning_commissions,
    step,
    wf
  );
  assert.match(materialized, /AUTHORITATIVE SHARED SOURCE ALREADY ESTABLISHED/);
  assert.match(materialized, /82, 79, 85, 81, 83, 80/);
  assert.doesNotMatch(materialized, /\{\{\s*AUTHORITATIVE_SHARED_SOURCE\s*\}\}/);
});

test("empty parent gets determine-and-lock prompt section", () => {
  const { api } = loadApi();
  const wf = parentJourney("wf-lj-p2-empty", "");
  api.setWorkflowsForTest([wf]);
  const section = api.composeLearningJourneyAuthoritativeSharedSourceToken(wf);
  assert.match(section, /AUTHORITATIVE SHARED SOURCE — DETERMINE AND LOCK/);
  assert.match(section, /exact(?:ly)? NONE/i);
});

test("save/reload preserves established material and blocks conflicting revision", () => {
  const { api } = loadApi();
  const wf = parentJourney("wf-lj-p2-reload", "");
  api.setWorkflowsForTest([wf]);
  api.applyLearningJourneySharedSourceFromCommissionCapture(wf, commissionArtefact(FICTIONAL_SCENARIO));

  const reloaded = JSON.parse(JSON.stringify(wf));
  api.setWorkflowsForTest([reloaded]);
  assert.equal(
    api.readLearningJourneyAuthoritativeSourceContext(reloaded.id),
    FICTIONAL_SCENARIO
  );

  const revise = api.applyLearningJourneySharedSourceFromCommissionCapture(
    reloaded,
    commissionArtefact(TABLET_DATASET)
  );
  assert.equal(revise.written, false);
  assert.equal(
    reloaded.workflowBriefResolution.resolvedFactors.source_context,
    FICTIONAL_SCENARIO
  );
});

test("Phase 1 handoff still delivers auto-persisted source to two constituents", () => {
  const { api } = loadApi();
  const parentId = "wf-lj-p2-handoff";
  const parent = parentJourney(parentId, "");
  api.setWorkflowsForTest([parent]);
  api.applyLearningJourneySharedSourceFromCommissionCapture(
    parent,
    commissionArtefact(TABLET_DATASET)
  );

  const c1 = intake.intakeCommission({
    productId: "interactive",
    specificationText: "Compare dissolution times using the shared dataset.",
    focus: "Compare",
    journeyContextText: "Opening experience.",
    sourceContext: api.readLearningJourneyAuthoritativeSourceContext(parentId),
    sourceJourneyWorkflowId: parentId,
    sourceCommissionId: "c1"
  });
  const c2 = intake.intakeCommission({
    productId: "expository",
    specificationText: "Explain the temperature effect using the shared dataset.",
    focus: "Explain",
    journeyContextText: "Builds on comparison.",
    sourceContext: api.readLearningJourneyAuthoritativeSourceContext(parentId),
    sourceJourneyWorkflowId: parentId,
    sourceCommissionId: "c2"
  });
  assert.equal(c1.ok, true);
  assert.equal(c2.ok, true);
  assert.equal(c1.family.deliverySeed.source_context, TABLET_DATASET);
  assert.equal(c2.family.deliverySeed.source_context, TABLET_DATASET);
  assert.equal(c1.family.titles.indexOf("Normalize Content"), -1);

  const wf1 = {
    id: "wf-c1",
    product: "interactive",
    sourceWorkflowId: parentId,
    sourceCommissionId: "c1",
    steps: c1.family.steps,
    workflowBriefResolution: {
      resolvedFactors: Object.assign({}, c1.family.deliverySeed),
      initialBrief: {
        commissionSpecification: c1.specificationText,
        journeyContextText: "Opening experience.",
        sourceContext: TABLET_DATASET
      }
    }
  };
  api.setWorkflowsForTest([parent, wf1]);
  const brief = api.composeCommissionedOriginalBrief(wf1);
  assert.match(brief, /82, 79, 85, 81, 83, 80/);
  assert.match(brief, /AUTHORITATIVE SHARED SOURCE MATERIAL/);
  assert.doesNotMatch(brief, /Meridian Council/);
});

test("malformed Commissioning capture is rejected", () => {
  const { api } = loadApi();
  const wf = parentJourney("wf-lj-p2-bad", "");
  api.setWorkflowsForTest([wf]);
  const bad = api.applyLearningJourneySharedSourceFromCommissionCapture(
    wf,
    "LEARNING EXPERIENCE COMMISSIONS\n\n1. COMMISSIONING RATIONALE\nNo markers."
  );
  assert.equal(bad.ok, false);
  assert.ok((bad.errors || []).length);
  assert.equal(String(wf.workflowBriefResolution.resolvedFactors.source_context || ""), "");
});

test("helper module is loaded from index.html", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  assert.match(html, /learning-journey-shared-source\.js/);
});
