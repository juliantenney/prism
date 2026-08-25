/**
 * S78-T-048 — Resource-level image visual consistency (PRISM house visual language).
 * Presentation policy only — does not weaken T-047 instructional fidelity.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const houseVisual = require("../lib/prism-house-visual-language.js");
const compiler = require("../lib/prism-image-brief-compiler.js");

const romanRoadsPath = path.join(
  __dirname,
  "fixtures",
  "page-assemble",
  "roman-roads-visual-jobs-valid.json"
);
const rnaPath = path.join(
  __dirname,
  "fixtures",
  "page-assemble",
  "rna-hcv-visual-affordances-with-figure-desc.json"
);

const romanPage = JSON.parse(fs.readFileSync(romanRoadsPath, "utf8"));
const romanWs = workspace.buildVisualJobsWorkspaceState(romanPage);
const romanBriefs = romanWs.compilerResult.briefs.filter(
  (b) => b && b.generation_instruction
);

const activityBrief = romanBriefs.find((b) => b.affordance_id === "va-a1-concept-map-01");
const synthesisBrief = romanBriefs.find(
  (b) => b.affordance_id === "va-page-knowledge-summary-01"
);

test("T-048 inventory: multi-affordance Roman roads briefs available", () => {
  assert.ok(romanBriefs.length >= 2);
  assert.ok(activityBrief);
  assert.ok(synthesisBrief);
});

test("T-048 every generated-image HUMAN prompt contains Resource visual language", () => {
  romanBriefs.forEach((brief) => {
    const prompt = workspace.buildVisualJobHumanPrompt(brief);
    assert.match(prompt, /Resource visual language:/i);
    assert.match(prompt, /university-level educational illustration/i);
    assert.match(prompt, /same visual family/i);
    const diag = workspace.diagnoseHumanPrompt(prompt, brief);
    assert.equal(diag.resource_visual_language_present, true);
  });
});

test("T-048 style block is byte-identical across jobs on the same page", () => {
  const blocks = romanBriefs.map((brief) =>
    workspace.extractResourceVisualLanguageBlock(workspace.buildVisualJobHumanPrompt(brief))
  );
  assert.ok(blocks.every((b) => b && b.length));
  const first = blocks[0];
  blocks.forEach((block) => {
    assert.equal(block, first);
  });
  assert.equal(first, houseVisual.formatResourceVisualLanguageSection());
});

test("T-048 same deterministic house block across different page/domain fixtures", () => {
  const rnaPage = JSON.parse(fs.readFileSync(rnaPath, "utf8"));
  let rnaWs;
  try {
    rnaWs = workspace.buildVisualJobsWorkspaceState(rnaPage);
  } catch (err) {
    rnaWs = null;
  }
  const romanBlock = houseVisual.formatResourceVisualLanguageSection();
  assert.match(romanBlock, /Resource visual language:/);
  if (rnaWs && rnaWs.compilerResult && Array.isArray(rnaWs.compilerResult.briefs)) {
    const rnaBrief = rnaWs.compilerResult.briefs.find((b) => b.generation_instruction);
    if (rnaBrief) {
      const rnaPrompt = workspace.buildVisualJobHumanPrompt(rnaBrief);
      assert.equal(
        workspace.extractResourceVisualLanguageBlock(rnaPrompt),
        romanBlock
      );
    }
  }
  // Policy constant itself is product-wide (domain-agnostic):
  assert.equal(
    workspace.formatResourceVisualLanguageSection(),
    houseVisual.formatResourceVisualLanguageSection()
  );
  assert.doesNotMatch(romanBlock, /Hydrology|Roman|RNA|HCV|precipitation|road/i);
});

test("T-048 representation-specific Visual structure remains distinct", () => {
  const stubs = [
    { preferred_representation: "annotated_system", scope: "activity", purpose: "distinction" },
    { preferred_representation: "causal_model", scope: "activity", purpose: "mechanism" },
    { preferred_representation: "causal_chain", scope: "activity", purpose: "mechanism" },
    { preferred_representation: "concept_map", scope: "page", purpose: "synthesis" }
  ];
  const structures = stubs.map((stub) => {
    const prompt = workspace.buildVisualJobHumanPrompt({
      ...stub,
      subject: "Fixture subject",
      content_requirements: { authored: ["Authorised cue"] },
      exclusion_requirements: { authored_must_not_show: [], authored_representation_avoid: [] },
      claim_constraints: { allowed: ["Authorised claim"], disallowed: [] },
      spoiler_constraints: { anti_spoiler: false }
    });
    assert.match(prompt, /Resource visual language:/i);
    assert.match(prompt, /Visual structure:/i);
    const vs = prompt.split("Visual structure:")[1].split("\n\n")[0];
    return vs.trim();
  });
  assert.notEqual(structures[0], structures[1]);
  assert.notEqual(structures[1], structures[2]);
  assert.notEqual(structures[2], structures[3]);
  assert.match(structures[0], /central system|callouts|leader lines/i);
  assert.match(structures[1], /causal or mechanism/i);
  assert.match(structures[2], /causal sequence|ordered causal/i);
  assert.match(structures[3], /concept nodes|hierarchy or central idea/i);
});

test("T-048 activity and synthesis share style block; retain different pedagogical modes", () => {
  const activityPrompt = workspace.buildVisualJobHumanPrompt(activityBrief);
  const synthesisPrompt = workspace.buildVisualJobHumanPrompt(synthesisBrief);
  assert.equal(
    workspace.extractResourceVisualLanguageBlock(activityPrompt),
    workspace.extractResourceVisualLanguageBlock(synthesisPrompt)
  );
  assert.match(activityPrompt, /activity learning support/i);
  assert.match(synthesisPrompt, /knowledge synthesis/i);
  assert.doesNotMatch(activityPrompt, /knowledge synthesis/i);
  assert.doesNotMatch(synthesisPrompt, /activity learning support/i);
});

test("T-048 style block contains no instructional claims / evidence / must_show", () => {
  const block = houseVisual.formatResourceVisualLanguageSection();
  assert.equal(houseVisual.resourceVisualLanguageLooksInstructional(block), false);
  assert.doesNotMatch(block, /must_show|must_not_show|allowed_claims|disallowed_claims/i);
  assert.doesNotMatch(block, /Authorised source evidence|Concept \/ claim boundary/i);
  assert.doesNotMatch(block, /Supported claim boundary|Do not claim:/i);
  assert.doesNotMatch(block, /sibling|previous image|reference image|generated asset/i);
});

test("T-047 fidelity protections remain on synthesis human prompt", () => {
  const prompt = workspace.buildVisualJobHumanPrompt(synthesisBrief);
  assert.match(prompt, /Concept \/ claim boundary:/i);
  assert.match(prompt, /Authorised source evidence:/i);
  assert.match(prompt, /AUTHORISED relationships from Show/i);
  assert.doesNotMatch(prompt, /integrate relationships across the lesson/i);
  const diag = workspace.diagnoseHumanPrompt(prompt, synthesisBrief);
  assert.equal(diag.concept_boundary_present, true);
  assert.equal(diag.authorised_evidence_present, true);
  assert.equal(diag.resource_visual_language_present, true);
});

test("T-048 prompts do not reference sibling image bytes or prior assets", () => {
  romanBriefs.forEach((brief) => {
    const prompt = workspace.buildVisualJobHumanPrompt(brief);
    assert.doesNotMatch(
      prompt,
      /previous (generated )?image|sibling (figure|image)|reference image|asset_id|visual_asset/i
    );
  });
});

test("T-048 canonical generation_instruction mirrors the same house-style lines", () => {
  const instr = synthesisBrief.generation_instruction;
  assert.match(instr, /12\. Resource visual language/);
  houseVisual.getHouseVisualLanguageLines().forEach((line) => {
    assert.match(instr, new RegExp(line.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
  assert.equal(
    typeof compiler.compilePrismImageBriefs,
    "function",
    "compiler still available"
  );
});

test("T-048 human prompt byte-identical for same brief", () => {
  assert.equal(
    workspace.buildVisualJobHumanPrompt(synthesisBrief),
    workspace.buildVisualJobHumanPrompt(synthesisBrief)
  );
});
