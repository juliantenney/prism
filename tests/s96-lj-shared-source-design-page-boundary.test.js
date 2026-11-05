/**
 * Phase 2 correction — durable shared material at Design Page JSON capture.
 *
 * Learning Journey Steps 1–4 are chat-context (no captures required).
 * Step 5 Design Page paste is one JSON block with shared_authoritative_material;
 * content persists write-once into parent source_context before constituents launch.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const design = require("../lib/learning-journey-design-page.js");
const shared = require("../lib/learning-journey-shared-source.js");
const intake = require("../lib/first-class-commission-intake.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const TABLET_RAW = [
  "Illustrative laboratory dataset (fictional — not real experimental evidence).",
  "Experiment: soluble tablet dissolution time",
  "Cool water (20°C): 93, 89, 96, 91, 94, 87 seconds",
  "Warm water (40°C): 78, 72, 81, 75, 70, 77 seconds",
  "Condition A sample standard deviation = 3.3862 s",
  "Progressive disclosure: later components may reveal warm-water values after cool-water comparison."
].join("\n");

function loadApi() {
  const loaded = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/learning-journey-shared-source.js",
      "lib/learning-journey-design-page.js",
      "lib/learning-journey-sibling-prompts.js"
    ]
  });
  const host = loaded.window || loaded.sandbox;
  if (host) host.PRISM_LEARNING_JOURNEY_SHARED_SOURCE = shared;
  if (loaded.sandbox && loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_LEARNING_JOURNEY_SHARED_SOURCE = shared;
  }
  return loaded;
}

function parentJourney(id, sourceContext) {
  return {
    id: id,
    name: "STEM – Making Sense of Experimental Data",
    product: "learning_journey",
    steps: [
      {
        id: "s1",
        title: "Requirements",
        outputName: "learning_requirements",
        canonical_step_id: "step_journey_requirements"
      },
      {
        id: "s4",
        title: "Commissioning",
        outputName: "learning_commissions",
        canonical_step_id: "step_journey_commissioning"
      },
      {
        id: "s5",
        title: "Design Page",
        outputName: "learning_journey_page",
        canonical_step_id: "step_design_page"
      }
    ],
    workflowBriefResolution: {
      initialBrief: { topic: "STEM data", sourceContext: sourceContext || "" },
      resolvedFactors: {
        topic: "STEM data",
        source_context: sourceContext || ""
      }
    }
  };
}

function designPageObject(overrides) {
  const fixture = design.buildLearningJourneyDesignPageFixture({
    title: "Learning Journey: STEM data",
    specificationText: "Compare cool-water dissolution times using the shared dataset."
  });
  assert.equal(fixture.ok, true);
  const page = Object.assign({}, fixture.page, overrides || {});
  return page;
}

function designPageCapture(sharedMaterial) {
  const page = designPageObject({
    shared_authoritative_material: sharedMaterial
  });
  return [
    "```json",
    JSON.stringify(page, null, 2),
    "```",
    "",
    "STEP 5 OUTPUT: learning_journey_page"
  ].join("\n");
}

test("Steps 1–4 chat-context: missing Commissioning markers are soft-nonblocking", () => {
  const { api } = loadApi();
  const wf = parentJourney("wf-lj-chat-soft", "");
  api.setWorkflowsForTest([wf]);
  const result = api.applyLearningJourneySharedSourceFromCommissionCapture(
    wf,
    "LEARNING EXPERIENCE COMMISSIONS\n\n1. Rationale without markers.\n",
    { softMissing: true }
  );
  assert.equal(result.ok, true);
  assert.equal(result.soft, true);
  assert.equal(api.readLearningJourneyAuthoritativeSourceContext(wf.id), "");
});

test("Design Page prompt requires shared_authoritative_material in JSON only", () => {
  const prompt = design.buildLearningJourneyDesignPagePrompt();
  assert.match(prompt, /\{\{\s*AUTHORITATIVE_SHARED_SOURCE\s*\}\}/);
  assert.match(prompt, /shared_authoritative_material/);
  assert.match(prompt, /Steps 1–4 remain chat context|chat context/i);
  assert.match(prompt, /Do not paste the full shared corpus into commissions/i);
  assert.doesNotMatch(prompt, /<<<SHARED_AUTHORITATIVE_MATERIAL_BEGIN>>>/);
  assert.doesNotMatch(prompt, /"shared_source"/);
  assert.match(prompt, /"specification_text"/);
  assert.match(prompt, /"journey_context_text"/);
});

test("sanitize corrects incorrect Condition A sample SD before lock", () => {
  const result = shared.sanitizeDerivedStatisticsInSharedMaterial(TABLET_RAW);
  assert.ok(result.corrections.length >= 1);
  assert.equal(result.corrections[0].statistic, "sample_sd");
  assert.ok(Math.abs(result.corrections[0].claimed - 3.3862) < 1e-6);
  assert.ok(Math.abs(result.corrections[0].corrected - 3.3267) < 0.001);
  assert.doesNotMatch(result.text, /3\.3862/);
  assert.match(result.text, /3\.3267|3\.3266/);
  assert.match(result.text, /93, 89, 96, 91, 94, 87/);
});

test("normal LJ journey with no Step 1–4 captures persists shared material from Design Page JSON", () => {
  const { api } = loadApi();
  const wf = parentJourney("wf-lj-dp-boundary", "");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  const capture = designPageCapture({
    status: "generated",
    content: TABLET_RAW
  });
  const parsed = api.parseLearningJourneyDesignPageCaptureForStorage(capture, wf);
  assert.equal(parsed.ok, true, (parsed.errors || []).join("; "));
  assert.ok(parsed.parsed && parsed.parsed.product_id === "learning_journey");
  assert.ok(parsed.sharedSource && parsed.sharedSource.written);

  const locked = api.readLearningJourneyAuthoritativeSourceContext(wf.id);
  assert.match(locked, /93, 89, 96, 91, 94, 87/);
  assert.doesNotMatch(locked, /3\.3862/);
  assert.match(locked, /3\.3267|3\.3266/);
  assert.doesNotMatch(JSON.stringify(parsed.parsed.commissions || []), /93, 89, 96, 91, 94, 87/);
});

test("JSON-only Step 5 capture (no marker text) persists shared_authoritative_material", () => {
  const { api } = loadApi();
  const wf = parentJourney("wf-lj-dp-json-only", "");
  api.setWorkflowsForTest([wf]);
  const page = designPageObject({
    shared_authoritative_material: { status: "generated", content: TABLET_RAW }
  });
  // Paste is only the JSON object — no fence, no markers (parser also accepts raw JSON).
  const parsed = api.parseLearningJourneyDesignPageCaptureForStorage(
    JSON.stringify(page, null, 2),
    wf
  );
  assert.equal(parsed.ok, true, (parsed.errors || []).join("; "));
  assert.ok(parsed.sharedSource && parsed.sharedSource.written);
  assert.match(api.readLearningJourneyAuthoritativeSourceContext(wf.id), /93, 89, 96/);
});

test("legacy Design Page without property is soft-accepted when source_context empty", () => {
  const { api } = loadApi();
  const wf = parentJourney("wf-lj-dp-legacy-empty", "");
  api.setWorkflowsForTest([wf]);
  const page = designPageObject();
  assert.equal(Object.prototype.hasOwnProperty.call(page, "shared_authoritative_material"), false);
  const raw =
    "```json\n" + JSON.stringify(page, null, 2) + "\n```\nSTEP 5 OUTPUT: learning_journey_page";
  const parsed = api.parseLearningJourneyDesignPageCaptureForStorage(raw, wf);
  assert.equal(parsed.ok, true, (parsed.errors || []).join("; "));
  assert.equal(parsed.sharedSource && parsed.sharedSource.soft, true);
  assert.equal(api.readLearningJourneyAuthoritativeSourceContext(wf.id), "");
});

test("legacy Design Page without property is accepted when source_context already established", () => {
  const { api } = loadApi();
  const established = shared.sanitizeDerivedStatisticsInSharedMaterial(TABLET_RAW).text;
  const wf = parentJourney("wf-lj-dp-existing", established);
  api.setWorkflowsForTest([wf]);
  const page = designPageObject();
  const raw =
    "```json\n" + JSON.stringify(page, null, 2) + "\n```\nSTEP 5 OUTPUT: learning_journey_page";
  const parsed = api.parseLearningJourneyDesignPageCaptureForStorage(raw, wf);
  assert.equal(parsed.ok, true, (parsed.errors || []).join("; "));
  assert.equal(parsed.sharedSource.skipped, true);
  assert.equal(api.readLearningJourneyAuthoritativeSourceContext(wf.id), established);
});

test("write-once: Design Page cannot overwrite established source_context", () => {
  const { api } = loadApi();
  const first = "Illustrative locked corpus v1 with enough characters for validation gate.";
  const wf = parentJourney("wf-lj-dp-once", first);
  api.setWorkflowsForTest([wf]);
  const second =
    "Illustrative locked corpus v2 REPLACEMENT that must not overwrite established material.";
  const result = api.applyLearningJourneySharedSourceFromDesignPageCapture(
    wf,
    designPageObject({
      shared_authoritative_material: { status: "generated", content: second }
    })
  );
  assert.equal(result.ok, true);
  assert.equal(result.written, false);
  assert.equal(api.readLearningJourneyAuthoritativeSourceContext(wf.id), first);
});

test("Design Page NONE leaves empty source_context", () => {
  const { api } = loadApi();
  const wf = parentJourney("wf-lj-dp-none", "");
  api.setWorkflowsForTest([wf]);
  const parsed = api.parseLearningJourneyDesignPageCaptureForStorage(
    designPageCapture({ status: "none", content: "" }),
    wf
  );
  assert.equal(parsed.ok, true, (parsed.errors || []).join("; "));
  assert.equal(api.readLearningJourneyAuthoritativeSourceContext(wf.id), "");
});

test("contradictory derived figures in commission specs are rejected", () => {
  const { api } = loadApi();
  const wf = parentJourney("wf-lj-dp-contra", "");
  api.setWorkflowsForTest([wf]);
  const page = designPageObject({
    shared_authoritative_material: {
      status: "generated",
      content: [
        "Illustrative laboratory dataset (fictional — not real experimental evidence).",
        "Cool water (20°C): 93, 89, 96, 91, 94, 87 seconds",
        "Warm water (40°C): 78, 72, 81, 75, 70, 77 seconds",
        "Progressive disclosure rules apply across commissions."
      ].join("\n")
    },
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Cool-water comparison",
        product_id: "interactive",
        status: "supported",
        specification_text:
          "Learners compute Condition A sample standard deviation = 3.3862 s from the cool-water observations.",
        journey_context_text:
          "Opening experience. Use cool-water observations only; no recurring scenario beyond the shared dataset.",
        dependencies: ""
      },
      {
        commission_id: "c2",
        section_id: "exp_2",
        order: 2,
        title: "Warm-water extension",
        product_id: "interactive",
        status: "supported",
        specification_text: "Reveal warm-water observations after cool-water comparison.",
        journey_context_text:
          "Builds on cool-water comparison. Learners bring forward their Condition A SD calculation.",
        dependencies: "c1"
      }
    ],
    sections: [
      {
        section_id: "journey_intro",
        title: "About this journey",
        order: 1,
        exposition: "Judge experimental evidence carefully."
      },
      {
        section_id: "exp_1",
        title: "Cool-water comparison",
        order: 2,
        exposition: "Compare cool-water dissolution times."
      },
      {
        section_id: "exp_2",
        title: "Warm-water extension",
        order: 3,
        exposition: "Extend the comparison with warm water."
      }
    ]
  });
  const parsed = api.parseLearningJourneyDesignPageCaptureForStorage(
    "```json\n" + JSON.stringify(page, null, 2) + "\n```",
    wf
  );
  assert.equal(parsed.ok, false);
  assert.ok(
    (parsed.errors || []).some((e) => /contradictory_derived_statistic/i.test(String(e))),
    (parsed.errors || []).join("; ")
  );
  assert.equal(api.readLearningJourneyAuthoritativeSourceContext(wf.id), "");
});

test("constituent handoff receives parent source_context after Design Page JSON capture", () => {
  const { api } = loadApi();
  const wf = parentJourney("wf-lj-dp-handoff", "");
  api.setWorkflowsForTest([wf]);
  const parsed = api.parseLearningJourneyDesignPageCaptureForStorage(
    designPageCapture({ status: "generated", content: TABLET_RAW }),
    wf
  );
  assert.equal(parsed.ok, true, (parsed.errors || []).join("; "));
  const locked = api.readLearningJourneyAuthoritativeSourceContext(wf.id);
  assert.match(locked, /93, 89, 96/);

  const commission = design.resolveCommissionFromPage(parsed.parsed, "c1");
  const envelope = design.commissionToIntakeEnvelope(commission, parsed.parsed, {
    sourceJourneyWorkflowId: wf.id,
    focus: commission.title,
    sourceContext: locked
  });
  const result = intake.intakeCommission(envelope);
  assert.equal(result.ok, true, (result.errors || []).join("; "));
  assert.equal(result.family.deliverySeed.source_context, locked);
});

test("Design Page token section prefers JSON property guidance (not external markers)", () => {
  const section = shared.composeAuthoritativeSharedSourceDesignPageSection("");
  assert.match(section, /shared_authoritative_material/);
  assert.doesNotMatch(section, /<<<SHARED_AUTHORITATIVE_MATERIAL_BEGIN>>>/);
  const established = shared.composeAuthoritativeSharedSourceDesignPageSection(TABLET_RAW);
  assert.match(established, /status \"provided\"|status "provided"/);
  assert.match(established, /93, 89, 96/);
});

test("real Step 5 JSON: prose SD 3.3862 + C3 rounded 3.39 s must not lock", () => {
  const { api } = loadApi();
  const wf = parentJourney("wf-lj-dp-stem-sd-fail", "");
  api.setWorkflowsForTest([wf]);

  // Exact dataset / incorrect values observed in the live browser failure.
  const sharedContent = [
    "Illustrative laboratory dataset (fictional — not real experimental evidence).",
    "Experiment: soluble tablet dissolution time under two water temperatures.",
    "Condition A (cool water, 20°C): 93, 89, 96, 91, 94, 87 seconds",
    "Condition B (warm water, 40°C): 78, 72, 81, 75, 70, 77 seconds",
    "The sample standard deviation for Condition A is 3.3862 s.",
    "Progressive disclosure: later components may reveal Condition B values only after Condition A comparison."
  ].join("\n");

  const page = designPageObject({
    shared_authoritative_material: {
      status: "generated",
      content: sharedContent
    },
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Explore Condition A observations",
        product_id: "interactive",
        status: "supported",
        specification_text:
          "Learners inspect Condition A dissolution times and describe spread without being told a pre-computed SD.",
        journey_context_text:
          "Opening experience. Use Condition A observations only from the shared illustrative dataset.",
        dependencies: ""
      },
      {
        commission_id: "c2",
        section_id: "exp_2",
        order: 2,
        title: "Compute sample SD",
        product_id: "interactive",
        status: "supported",
        specification_text:
          "Learners compute the sample standard deviation for Condition A from the locked observations.",
        journey_context_text:
          "Builds on exploring Condition A observations. Learners bring forward their own calculated SD.",
        dependencies: "c1"
      },
      {
        commission_id: "c3",
        section_id: "exp_3",
        order: 3,
        title: "Compare with Condition B",
        product_id: "interactive",
        status: "supported",
        specification_text:
          "Reveal Condition B and compare variability with Condition A (sample standard deviation 3.39 s).",
        journey_context_text:
          "Builds on the Condition A SD calculation. Learners bring forward their Condition A result for comparison.",
        dependencies: "c2"
      }
    ],
    sections: [
      {
        section_id: "journey_intro",
        title: "About this journey",
        order: 1,
        exposition: "Make sense of experimental dissolution data."
      },
      {
        section_id: "exp_1",
        title: "Explore Condition A observations",
        order: 2,
        exposition: "Inspect cool-water dissolution times."
      },
      {
        section_id: "exp_2",
        title: "Compute sample SD",
        order: 3,
        exposition: "Compute the sample standard deviation for Condition A."
      },
      {
        section_id: "exp_3",
        title: "Compare with Condition B",
        order: 4,
        exposition: "Compare variability across conditions."
      }
    ]
  });

  // Reproduce JSON-only paste (multiline content string inside the page object).
  const raw = JSON.stringify(page, null, 2);
  assert.match(raw, /3\.3862/);
  assert.match(raw, /3\.39 s/);

  const proseSan = shared.sanitizeDerivedStatisticsInSharedMaterial(sharedContent);
  assert.ok(proseSan.corrections.length >= 1);
  assert.ok(Math.abs(proseSan.corrections[0].claimed - 3.3862) < 1e-6);
  assert.ok(Math.abs(proseSan.corrections[0].corrected - 3.3267) < 0.001);
  assert.doesNotMatch(proseSan.text, /3\.3862/);

  const parsed = api.parseLearningJourneyDesignPageCaptureForStorage(raw, wf);
  assert.equal(parsed.ok, false, "must reject contradictory C3 rounded SD");
  assert.ok(
    (parsed.errors || []).some((e) => /contradictory_derived_statistic/i.test(String(e))),
    (parsed.errors || []).join("; ")
  );
  const locked = api.readLearningJourneyAuthoritativeSourceContext(wf.id);
  assert.equal(locked, "");
  assert.doesNotMatch(locked, /3\.3862/);
});

test("prose Condition A SD is corrected when commissions stay consistent", () => {
  const { api } = loadApi();
  const wf = parentJourney("wf-lj-dp-prose-ok", "");
  api.setWorkflowsForTest([wf]);
  const content = [
    "Illustrative laboratory dataset (fictional — not real experimental evidence).",
    "Condition A (cool water, 20°C): 93, 89, 96, 91, 94, 87 seconds",
    "Condition B (warm water, 40°C): 78, 72, 81, 75, 70, 77 seconds",
    "The sample standard deviation for Condition A is 3.3862 s.",
    "Progressive disclosure: reveal Condition B after Condition A comparison."
  ].join("\n");
  const parsed = api.parseLearningJourneyDesignPageCaptureForStorage(
    designPageCapture({ status: "generated", content }),
    wf
  );
  assert.equal(parsed.ok, true, (parsed.errors || []).join("; "));
  const locked = api.readLearningJourneyAuthoritativeSourceContext(wf.id);
  assert.doesNotMatch(locked, /3\.3862/);
  assert.match(locked, /3\.3267|3\.3266/);
});

test("exact STEM table-format Step 5 JSON is rejected; worked-example 12/2 are not false positives", () => {
  const { api } = loadApi();
  const fixture = require("./fixtures/s96-stem-contradictory-step5.js");
  const page = fixture.buildStemContradictoryStep5Page();
  const wf = parentJourney("wf-lj-stem-exact", "");
  api.setWorkflowsForTest([wf]);

  const san = shared.sanitizeDerivedStatisticsInSharedMaterial(
    page.shared_authoritative_material.content
  );
  assert.ok(san.corrections.some((c) => Math.abs(c.claimed - 3.3862) < 1e-6));
  assert.ok(san.corrections.some((c) => Math.abs(c.claimed - 3.39) < 1e-6));
  assert.ok(san.corrections.every((c) => Math.abs(c.corrected - 3.3267) < 0.001));
  assert.ok(
    san.corrections.every((c) => c.claimed !== 12 && c.claimed !== 2),
    "worked-example mean/SD must not become Condition corrections"
  );

  const contra = shared.collectContradictoryDerivedStatisticErrors(
    page,
    page.shared_authoritative_material.content
  );
  assert.ok(contra.some((e) => /commissions\[c3\].*(3\.39|3\.3862)/i.test(String(e))), contra.join("; "));
  assert.ok(
    contra.every((e) => !/contradictory_derived_statistic:(12|2)\b/.test(String(e))),
    "false positives: " + contra.join("; ")
  );
  assert.ok(
    contra.every((e) => !/commissions\[c2\]/.test(String(e))),
    "C2 worked-example must not be flagged: " + contra.join("; ")
  );

  const designStep = wf.steps.find((s) => s.id === "s5");
  const raw = JSON.stringify(page, null, 2);
  const pasteGate = api.parseWorkflowRunPageStructureCaptureForStorage(raw, designStep, wf);
  assert.equal(pasteGate.ok, false, (pasteGate.errors || []).join("; "));
  assert.equal(String(wf.workflowBriefResolution.resolvedFactors.source_context || ""), "");

  const nextGate = api.applyLearningJourneySharedSourceFromDesignPageCapture(wf, raw);
  assert.equal(nextGate.ok, false);
  assert.equal(nextGate.code, "contradictory_derived_statistics");
  assert.equal(String(wf.workflowBriefResolution.resolvedFactors.source_context || ""), "");
});

test("STEM Step 5 with Condition A SD corrected to 3.3267/3.33 is accepted", () => {
  const { api } = loadApi();
  const fixture = require("./fixtures/s96-stem-contradictory-step5.js");
  const page = fixture.buildStemCorrectedStep5Page();
  const wf = parentJourney("wf-lj-stem-corrected", "");
  api.setWorkflowsForTest([wf]);

  assert.match(page.shared_authoritative_material.content, /3\.3267/);
  assert.doesNotMatch(page.shared_authoritative_material.content, /3\.3862/);
  assert.match(page.commissions[2].specification_text, /3\.33/);
  assert.doesNotMatch(page.commissions[2].specification_text, /3\.39/);

  const contra = shared.collectContradictoryDerivedStatisticErrors(
    page,
    page.shared_authoritative_material.content
  );
  assert.deepEqual(contra, []);

  const designStep = wf.steps.find((s) => s.id === "s5");
  const raw = JSON.stringify(page, null, 2);
  const pasteGate = api.parseWorkflowRunPageStructureCaptureForStorage(raw, designStep, wf);
  assert.equal(pasteGate.ok, true, (pasteGate.errors || []).join("; "));
  assert.ok(pasteGate.sharedSource && pasteGate.sharedSource.written);
  const locked = api.readLearningJourneyAuthoritativeSourceContext(wf.id);
  assert.match(locked, /3\.3267/);
  assert.doesNotMatch(locked, /3\.3862/);
  assert.match(locked, /10 s, 12 s and 14 s|practice dataset|worked-example/i);
});

test("browser paste path rejects contradictory JSON even when artefacts fallback still set", () => {
  const { api } = loadApi();
  const staleArtefacts = [
    "Illustrative laboratory dataset (fictional — not real experimental evidence).",
    "Condition A (cool water, 20°C): 93, 89, 96, 91, 94, 87 seconds",
    "Condition B (warm water, 40°C): 78, 72, 81, 75, 70, 77 seconds",
    "The sample standard deviation for Condition A is 3.3862 s."
  ].join("\n");
  // Simulates partial clear: slot empty, but artefacts fallback still present.
  const wf = parentJourney("wf-lj-dp-browser-path", "");
  wf.artefacts = staleArtefacts;
  api.setWorkflowsForTest([wf]);
  assert.equal(
    String(wf.workflowBriefResolution.resolvedFactors.source_context || ""),
    ""
  );
  // read* may still see artefacts — that previously skipped contradiction checks.
  assert.match(api.readLearningJourneyAuthoritativeSourceContext(wf.id), /3\.3862/);

  const page = designPageObject({
    shared_authoritative_material: {
      status: "generated",
      content: [
        "Illustrative laboratory dataset (fictional — not real experimental evidence).",
        "Condition A (cool water, 20°C): 93, 89, 96, 91, 94, 87 seconds",
        "Condition B (warm water, 40°C): 78, 72, 81, 75, 70, 77 seconds",
        "Condition A sample standard deviation = 3.3862 s (approximately 3.39 s).",
        "Progressive disclosure: reveal Condition B after Condition A comparison."
      ].join("\n")
    },
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Explore Condition A",
        product_id: "interactive",
        status: "supported",
        specification_text: "Inspect Condition A dissolution times from the shared dataset.",
        journey_context_text: "Opening experience using Condition A observations only.",
        dependencies: ""
      },
      {
        commission_id: "c2",
        section_id: "exp_2",
        order: 2,
        title: "Compute SD",
        product_id: "interactive",
        status: "supported",
        specification_text: "Compute the sample standard deviation for Condition A.",
        journey_context_text:
          "Builds on exploring Condition A. Learners bring forward their calculated SD.",
        dependencies: "c1"
      },
      {
        commission_id: "c3",
        section_id: "exp_3",
        order: 3,
        title: "Compare conditions",
        product_id: "interactive",
        status: "supported",
        specification_text:
          "Compare Condition B with Condition A using the Condition A sample standard deviation of 3.39 s.",
        journey_context_text:
          "Builds on the Condition A SD calculation. Bring forward that result for comparison.",
        dependencies: "c2"
      }
    ],
    sections: [
      {
        section_id: "journey_intro",
        title: "About this journey",
        order: 1,
        exposition: "Make sense of experimental dissolution data."
      },
      {
        section_id: "exp_1",
        title: "Explore Condition A",
        order: 2,
        exposition: "Inspect cool-water times."
      },
      {
        section_id: "exp_2",
        title: "Compute SD",
        order: 3,
        exposition: "Compute Condition A sample SD."
      },
      {
        section_id: "exp_3",
        title: "Compare conditions",
        order: 4,
        exposition: "Compare variability across conditions."
      }
    ]
  });

  const designStep = wf.steps.find((s) => s.id === "s5");
  const raw = JSON.stringify(page, null, 2);

  // Exact browser paste/accept path: parseWorkflowRunPageStructureCaptureForStorage.
  const pasteGate = api.parseWorkflowRunPageStructureCaptureForStorage(raw, designStep, wf);
  assert.equal(pasteGate.ok, false, (pasteGate.errors || []).join("; "));
  assert.ok(
    (pasteGate.errors || []).some((e) => /contradictory_derived_statistic/i.test(String(e))),
    (pasteGate.errors || []).join("; ")
  );
  // Rejected paste must not write the authoritative slot.
  assert.equal(String(wf.workflowBriefResolution.resolvedFactors.source_context || ""), "");

  // Next-click gate uses the same apply helper against body text.
  const nextGate = api.applyLearningJourneySharedSourceFromDesignPageCapture(wf, raw);
  assert.equal(nextGate.ok, false);
  assert.equal(nextGate.code, "contradictory_derived_statistics");
  assert.equal(String(wf.workflowBriefResolution.resolvedFactors.source_context || ""), "");
});

test("locked source_context still rejects contradictory Design Page without altering lock", () => {
  const { api } = loadApi();
  const locked = [
    "Illustrative laboratory dataset (fictional — not real experimental evidence).",
    "Condition A (cool water, 20°C): 93, 89, 96, 91, 94, 87 seconds",
    "Condition B (warm water, 40°C): 78, 72, 81, 75, 70, 77 seconds",
    "Condition A sample standard deviation = 3.3267 s.",
    "Progressive disclosure rules apply."
  ].join("\n");
  const wf = parentJourney("wf-lj-dp-locked-contra", locked);
  api.setWorkflowsForTest([wf]);

  const page = designPageObject({
    shared_authoritative_material: {
      status: "provided",
      content: locked.replace("3.3267", "3.3862") + "\nApproximately 3.39 s."
    },
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Cool-water comparison",
        product_id: "interactive",
        status: "supported",
        specification_text:
          "Use Condition A sample standard deviation 3.39 s from the shared dataset.",
        journey_context_text: "Opening experience with Condition A observations.",
        dependencies: ""
      }
    ]
  });
  const parsed = api.parseLearningJourneyDesignPageCaptureForStorage(
    JSON.stringify(page, null, 2),
    wf
  );
  assert.equal(parsed.ok, false);
  assert.equal(api.readLearningJourneyAuthoritativeSourceContext(wf.id), locked);
  assert.equal(wf.workflowBriefResolution.resolvedFactors.source_context, locked);
});

test("narrow repair clears only this parent source_context for corrected re-capture", () => {
  const { api } = loadApi();
  const bad =
    "Illustrative locked corpus with Condition A sample standard deviation = 3.3862 s and observations 93, 89, 96, 91, 94, 87.";
  const wf = parentJourney("wf-lj-dp-repair", bad);
  wf.steps.push({ id: "keep-me", title: "Requirements", outputName: "learning_requirements" });
  api.setWorkflowsForTest([wf]);
  assert.equal(api.readLearningJourneyAuthoritativeSourceContext(wf.id), bad);

  const denied = api.clearLearningJourneyAuthoritativeSourceContextForRepair(
    wf.id,
    "wrong-id"
  );
  assert.equal(denied.ok, false);
  assert.equal(api.readLearningJourneyAuthoritativeSourceContext(wf.id), bad);

  const cleared = api.clearLearningJourneyAuthoritativeSourceContextForRepair(wf.id, wf.id);
  assert.equal(cleared.ok, true);
  assert.equal(cleared.cleared, true);
  assert.equal(api.readLearningJourneyAuthoritativeSourceContext(wf.id), "");
  assert.equal(wf.steps.length >= 1, true);

  const repaired = api.parseLearningJourneyDesignPageCaptureForStorage(
    designPageCapture({
      status: "generated",
      content: [
        "Illustrative laboratory dataset (fictional — not real experimental evidence).",
        "Condition A (cool water, 20°C): 93, 89, 96, 91, 94, 87 seconds",
        "Condition B (warm water, 40°C): 78, 72, 81, 75, 70, 77 seconds",
        "Condition A sample standard deviation = 3.3267 s.",
        "Progressive disclosure rules apply."
      ].join("\n")
    }),
    wf
  );
  assert.equal(repaired.ok, true, (repaired.errors || []).join("; "));
  assert.match(api.readLearningJourneyAuthoritativeSourceContext(wf.id), /3\.3267/);
  assert.doesNotMatch(api.readLearningJourneyAuthoritativeSourceContext(wf.id), /3\.3862/);
});
