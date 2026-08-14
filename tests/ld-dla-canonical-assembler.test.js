/**
 * S77-T-013 Phase A — canonical DLA assembler (not live production).
 * Live Copy/Studio use 77-DLA-CANONICAL-3 via assembleDlaCanonicalContract once.
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const dla = require("../lib/ld-dla-page-enrich-contract.js");

const HEADINGS = dla.DLA_CANONICAL_SECTION_HEADINGS;
const ORDER = dla.DLA_CANONICAL_SECTION_IDS;

const OVERLAY_FIXTURE = [
  "Self-study workbook overlay (test fixture — not production pack rewrite):",
  "- DLA-WB-08: early activity must list worked_example and sample_output (or modelling_note).",
  "- DLA-WB-12: capstone consolidation_summary.",
  "- DLA-WB-06a: practice table/reference family row.",
  "- G1 Verification: checklist with depth_floor L3 when Verification is Required."
].join("\n");

function headingCount(text, heading) {
  const re = new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
  return (text.match(re) || []).length;
}

test("Phase A: assembler exposes 11 sections in deterministic order", () => {
  const out = dla.assembleDlaCanonicalContract();
  assert.equal(ORDER.length, 11);
  assert.deepEqual(out.sectionOrder, ORDER);
  assert.equal(Object.keys(HEADINGS).length, 11);
  ORDER.forEach((id) => {
    assert.equal(typeof out.sections[id], "string");
    assert.ok(out.sections[id].startsWith(HEADINGS[id]));
  });
  let cursor = 0;
  ORDER.forEach((id) => {
    const idx = out.text.indexOf(HEADINGS[id], cursor);
    assert.ok(idx >= cursor, id);
    cursor = idx + HEADINGS[id].length;
  });
});

test("Phase A: each canonical heading appears once", () => {
  const text = dla.assembleDlaCanonicalContract().text;
  ORDER.forEach((id) => {
    assert.equal(headingCount(text, HEADINGS[id]), 1, id);
  });
});

test("Phase A: Copy vs Studio path does not change canonical §§1–11", () => {
  const copy = dla.assembleDlaCanonicalContract({ path: "copy" });
  const studio = dla.assembleDlaCanonicalContract({ path: "studio" });
  assert.equal(copy.text, studio.text);
  ORDER.forEach((id) => {
    assert.equal(copy.sections[id], studio.sections[id]);
  });
});

test("Phase A: §9 empty when overlay false; populated once when supplied", () => {
  const off = dla.assembleDlaCanonicalContract({ workbookOverlay: false });
  const bodyOff = off.sections.overlay.slice(HEADINGS.overlay.length).trim();
  assert.equal(bodyOff, "");
  assert.equal(off.sections.overlay, HEADINGS.overlay);

  const on = dla.assembleDlaCanonicalContract({
    workbookOverlay: true,
    overlayText: OVERLAY_FIXTURE
  });
  assert.ok(on.sections.overlay.includes(OVERLAY_FIXTURE));
  assert.equal(headingCount(on.text, HEADINGS.overlay), 1);
  assert.equal((on.text.split(OVERLAY_FIXTURE).length - 1), 1);
  assert.ok(on.sections.overlay.includes("DLA-WB-08"));
});

test("Phase A: slot fragments land in named sections", () => {
  const out = dla.assembleDlaCanonicalContract({
    productionSlot: "SLOT-PRODUCTION-MARKER",
    commissioningSlot: "SLOT-COMMISSIONING-MARKER",
    outputSlot: "SLOT-OUTPUT-MARKER"
  });
  assert.match(out.sections.production, /SLOT-PRODUCTION-MARKER/);
  assert.match(out.sections.commissioning, /SLOT-COMMISSIONING-MARKER/);
  assert.match(out.sections.output, /SLOT-OUTPUT-MARKER/);
  assert.doesNotMatch(out.sections.examples, /SLOT-PRODUCTION-MARKER/);
});

test("Phase A: T-033 markers in §4", () => {
  const s = dla.assembleDlaCanonicalContract().sections.production;
  assert.match(s, /Define the learner production obligation \(expected_output and learner_task intent\)/);
  assert.match(
    s,
    /Completing it must require every load-bearing operation needed to demonstrate the mapped LO/
  );
  assert.match(s, /A supporting check must not substitute for the operation the mapped LO requires/);
  assert.match(
    s,
    /If completed perfectly, would the work demonstrate every load-bearing mapped-LO operation/
  );
  assert.match(s, /redesign production before commissioning materials/);
});

test("Phase A: P01-R1 markers in §5", () => {
  const s = dla.assembleDlaCanonicalContract().sections.task_inputs;
  assert.match(s, /particular content upon which the learner performs the required operation/);
  assert.match(s, /already-formed object or state/);
  assert.match(s, /when the system must supply it/);
  assert.match(s, /Recording work in a workspace does not make the workspace the operand/);
  assert.match(s, /prior-activity product is not a new GAM commission/);
  assert.match(
    s,
    /if they lose only an example of how, a place to write, guidance, or a checklist, it is not/
  );
  assert.match(
    s,
    /Listing a task input does not set evidence_decision\.required; P01 and P02 remain independent/
  );
});

test("Phase A: T-031 / P03 markers in §6; no must-be-solvable", () => {
  const s = dla.assembleDlaCanonicalContract().sections.commissioning;
  assert.match(s, /non-empty purpose \(the job of this material\)/);
  assert.match(
    s,
    /binding GAM bounds: content, load-bearing count\/variation\/constraints\/exclusions/
  );
  assert.match(
    s,
    /Include any pedagogically chosen method, condition, assumption, boundary, or exclusion/
  );
  assert.match(
    s,
    /If omitting it would permit an operand that requires a different operation or untaught reasoning/
  );
  assert.match(s, /this commissioned operation only/);
  assert.match(s, /GAM fulfils required materials/);
  assert.match(s, /Do not write materials\[\]\.body/);
  assert.doesNotMatch(s, /must be solvable/i);
  const all = dla.assembleDlaCanonicalContract().text;
  assert.doesNotMatch(all, /must be solvable/i);
});

test("Phase A: P02 markers in §7", () => {
  const s = dla.assembleDlaCanonicalContract().sections.evidence;
  assert.match(s, /particulars-as-grounds/);
  assert.match(s, /DLA owns evidence_decision\.required/);
  assert.match(s, /it does not mean no materials/);
  assert.match(s, /list those task-input rows in provider_material_ids/);
  assert.match(s, /P01 and P02 remain independent/);
});

test("Phase A: Sprint 72 provider markers in §8", () => {
  const s = dla.assembleDlaCanonicalContract().sections.providers;
  assert.match(s, /evidence_requirement\.learner_action/);
  assert.match(s, /observable_features/);
  assert.match(s, /must not analyse the focal evidence provider/);
  assert.match(s, /conversation_attachment/);
  assert.match(s, /system_generated_simulation/);
  assert.match(s, /Teaching or explanatory material is not a provider/);
  assert.match(s, /evidence_layout separate_provider/);
});

test("T-016: canonical evidence_requirement required shape is model-visible once", () => {
  const out = dla.assembleDlaCanonicalContract();
  const p = out.sections.providers;
  const o = out.sections.output;
  const e = out.sections.examples;
  assert.match(p, /evidence_requirement\.kind: required literal "learner_evidence"/);
  assert.match(p, /evidence_requirement\.purpose: required non-empty string/);
  assert.match(p, /evidence_requirement\.learner_action/);
  assert.match(p, /evidence_requirement\.observable_features: non-empty string array/);
  assert.match(p, /Provenance: "system_generated_simulation"/);
  assert.match(p, /evidence_layout separate_provider/);
  assert.match(p, /must not analyse the focal evidence provider/);
  assert.match(o, /kind \(literal "learner_evidence"\)/);
  assert.match(o, /purpose \(non-empty string\)/);
  assert.match(o, /learner_action \(non-empty string\)/);
  assert.match(o, /observable_features \(non-empty string array\)/);
  assert.match(o, /combined_evidence_workspace also requires fixed_observation_fields/);
  assert.match(e, /"kind": "learner_evidence"/);
  assert.match(e, /"purpose": "Provide inspectable observations needed for diagnosis\."/);
  assert.match(e, /"learner_action":/);
  assert.match(e, /"observable_features":/);
  assert.equal((out.text.match(/Evidence-provider authoring/g) || []).length, 1);
  assert.doesNotMatch(out.text, /### Sprint 58 vNext DLA partial-page contract/);
});

test("Phase A: source/attachment markers in §3", () => {
  const s = dla.assembleDlaCanonicalContract().sections.sources;
  assert.match(s, /Before designing activities, inspect material attached/);
  assert.match(s, /Do not invent related but unattached works/);
  assert.match(s, /provenance conversation_attachment/);
});

test("Phase A: title guidance once; archetype in §6", () => {
  const out = dla.assembleDlaCanonicalContract();
  const titleNeedle = "Learner-facing activity title (required on every activities[] row):";
  assert.equal((out.text.split(titleNeedle).length - 1), 1);
  assert.ok(out.sections.production.includes(titleNeedle));
  assert.ok(out.sections.commissioning.includes("Instructional archetype planning on required_materials"));
  assert.doesNotMatch(out.sections.examples, /Instructional archetype planning on required_materials/);
});

test("Phase A: §10 partial-page dialect; no pack Output dialect; no body authoring", () => {
  const s = dla.assembleDlaCanonicalContract().sections.output;
  assert.match(s, /artifact_type: "page"/);
  assert.match(s, /schema_version: "2\.0\.0"/);
  assert.match(s, /assembly_state\.current_stage: "dla"/);
  assert.match(s, /task_material_decision/);
  assert.match(s, /materials\[\]\.body/);
  assert.doesNotMatch(s, /outcome_alignment/);
  assert.doesNotMatch(s, /delivery_notes/);
  assert.doesNotMatch(s, /Return JSON: activities/);
  const all = dla.assembleDlaCanonicalContract().text;
  assert.doesNotMatch(all, /not a learning-design, sequencing, archetype-selection, or session-arc step/);
});

test("Phase A: examples use material_type not wrong type dialect", () => {
  const s = dla.assembleDlaCanonicalContract().sections.examples;
  assert.match(s, /"material_type": "scenario"/);
  assert.doesNotMatch(s, /"type":\s*"/);
  assert.match(s, /task_material_decision/);
  assert.match(s, /evidence_decision/);
});

test("Phase C: assembler multiplicity 1; live version 77-DLA-CANONICAL-3", () => {
  const out = dla.assembleDlaCanonicalContract();
  assert.equal(out.multiplicity, 1);
  assert.equal(out.version, "77-DLA-CANONICAL-3");
  assert.equal(dla.CONTRACT_VERSION, "77-DLA-CANONICAL-3");
  assert.equal(dla.LEGACY_CONTRACT_VERSION, "76-DLA-PARTIAL-9");
  assert.doesNotMatch(out.text, /### Sprint 58 vNext DLA partial-page contract/);
  assert.equal(headingCount(out.text, HEADINGS.role), 1);
});

test("Phase A: includeExamples false leaves §11 heading only", () => {
  const out = dla.assembleDlaCanonicalContract({ includeExamples: false });
  assert.equal(out.sections.examples, HEADINGS.examples);
});

test("Phase C: legacy builders retained for rollback", () => {
  assert.equal(typeof dla.buildDlaPageEnrichContractBlock, "function");
  assert.equal(typeof dla.buildCanonicalDlaPageShapeSnippet, "function");
  const live = dla.buildDlaPageEnrichContractBlock();
  assert.match(live, /### Sprint 58 vNext DLA partial-page contract/);
  assert.match(live, /Completing it must require every load-bearing operation needed to demonstrate the mapped LO/);
});

test("Phase C: app.js uses canonical assembler; rollback flag present", () => {
  const appSrc = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  assert.match(appSrc, /function isDlaCanonicalAssemblerEnabled/);
  assert.match(appSrc, /assembleDlaCanonicalContract/);
  assert.ok((appSrc.match(/buildDlaPageEnrichContractBlock\(\)/g) || []).length >= 1);
  assert.ok((appSrc.match(/buildCanonicalDlaPageShapeSnippet\(\)/g) || []).length >= 1);
});

test("Phase C: §9 overlay has no generic T-033/P01-R1/P02 constitution", () => {
  const overlay = dla.buildDlaWorkbookOverlayBlock();
  assert.doesNotMatch(overlay, /Completing it must require every load-bearing operation needed to demonstrate the mapped LO/);
  assert.doesNotMatch(overlay, /Absence test:/);
  assert.doesNotMatch(overlay, /particulars-as-grounds/);
  const on = dla.assembleDlaCanonicalContract({
    workbookOverlay: true,
    overlayText: overlay
  });
  const body = on.sections.overlay.slice(HEADINGS.overlay.length);
  assert.doesNotMatch(body, /Completing it must require every load-bearing operation needed to demonstrate the mapped LO/);
  assert.match(body, /DLA-WB-08/);
});

test("§6 material_type is presentation vocabulary from live renderer registry", () => {
  const parseMaterial = require("../lib/learner-renderer-vnext/parse-material.js");
  const registry = parseMaterial.MATERIAL_RENDERER_TYPES.slice();
  assert.deepEqual(dla.listDlaPresentationMaterialTypes(), registry);
  const commissioning = dla.assembleDlaCanonicalContract().sections.commissioning;
  assert.match(
    commissioning,
    /material_type is a presentation\/rendering token, not a pedagogical or semantic label/
  );
  assert.match(
    commissioning,
    /Every required_materials\[\]\.material_type MUST be one of these supported presentation tokens/
  );
  assert.equal(
    (commissioning.match(/Every required_materials\[\]\.material_type MUST be one of these supported presentation tokens/g) || []).length,
    1
  );
  assert.ok(commissioning.includes(registry.join(" | ")));
  assert.match(
    commissioning,
    /Put the pedagogical job in purpose, specification, and instructional_archetype \/ archetype_plan/
  );
  assert.match(commissioning, /material_type is presentation format/i);
  const discouraged = [
    "comparison_examples",
    "explanation",
    "practice_problems",
    "worked_process",
    "problem_set",
    "solution_framework",
    "process_reference",
    "interpretation_cases",
    "concept_explanation"
  ];
  discouraged.forEach((label) => {
    assert.match(commissioning, new RegExp("Do not invent semantic type names[\\s\\S]*" + label));
  });
  const examples = dla.assembleDlaCanonicalContract().sections.examples;
  discouraged.forEach((label) => {
    assert.doesNotMatch(examples, new RegExp('"material_type": "' + label + '"'));
  });
  assert.match(examples, /"material_type": "scenario"/);
});
