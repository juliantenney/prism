/**
 * Sprint 70 Slice 7A — human prompt modality, low-text pedagogy, representation guidance.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const s38 = require("../lib/sprint38-visual-affordances.js");
const compiler = require("../lib/prism-image-brief-compiler.js");
const planner = require("../lib/prism-visual-jobs-planner.js");

const romanRoadsPath = path.join(
  __dirname,
  "fixtures",
  "page-assemble",
  "roman-roads-visual-jobs-valid.json"
);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const page = JSON.parse(fs.readFileSync(romanRoadsPath, "utf8"));
const ws = workspace.buildVisualJobsWorkspaceState(page);
const briefsByRep = {};
ws.compilerResult.briefs.forEach((brief) => {
  briefsByRep[brief.preferred_representation] = brief;
});

function annotatedSystemPage() {
  const local = clone(page);
  local.visual_affordances = [
    {
      affordance_id: "va-a2-annotated-01",
      scope: "activity",
      activity_id: "A2",
      visual_decision: "generate",
      visual_slot: "materials-entry",
      tier: "valuable",
      purpose: "mechanism",
      preferred_representation: "annotated_system",
      subject: "Layered Roman road construction system",
      context:
        "Visual brief: annotate the layered road structure so learners can inspect components before completing sequencing; do not reveal worked answers.",
      evidence_anchors: ["A2.learner_task", "A2.materials.worked_example"],
      must_show: ["surface layer", "foundation layers", "drainage cues"],
      must_not_show: ["completed stage answers", "model solution narrative"],
      allowed_claims: ["Road construction uses layered components."],
      disallowed_claims: ["Construction order is arbitrary."],
      rationale: "Support component inspection before sequencing.",
      pedagogical_added_value: "Makes layered system parts visible without completing the sequence.",
      anti_spoiler: true,
      spoiler_boundary: {
        hide_answers: true,
        hide_classification_keys: true,
        hide_model_solution: true,
        allow_structural_hint: true
      },
      representation_avoid: ["filled_worksheet", "generic_infographic"],
      requires_exact_data_match: false,
      source_basis: "A2 learner_task; A2 materials.worked_example",
      caption_intent: "Component callouts only.",
      discipline_risk_level: "medium",
      reasoning_supported: "Learners inspect system parts before completing sequence reasoning.",
      learner_stage: "pre_classification",
      canonical_discipline_note: "Annotate supported layers only."
    }
  ];
  local.activities_visual_review = [
    {
      activity_id: "A2",
      activity_visual_value: { decision: "high", rationale: "Annotated system supports inspection." }
    }
  ];
  return local;
}

function assertModality(prompt) {
  assert.match(prompt, /^Generate a finished rendered educational image\./);
  assert.match(prompt, /Do not respond with prose/i);
  assert.match(prompt, /ASCII art/i);
  assert.match(prompt, /Markdown/i);
  assert.match(prompt, /\bcode\b/i);
  assert.match(prompt, /Mermaid/i);
  assert.match(prompt, /written outline/i);
  assert.match(prompt, /Return the finished visual itself/i);
  assert.doesNotMatch(prompt, /openai|dall-e|midjourney|stability|```|\{"/i);
}

function assertLowTextPedagogy(prompt) {
  assert.match(prompt, /visual organisation/i);
  assert.match(prompt, /layout, grouping, arrows, shapes, icons and spatial relationships/i);
  assert.match(prompt, /2–6 words|2-6 words/i);
  assert.match(prompt, /Do not use paragraph text/i);
}

// --- Output modality ---

test("Slice 7A: every Roman-roads human prompt begins with rendered-image modality", () => {
  ws.compilerResult.briefs.forEach((brief) => {
    const prompt = workspace.buildVisualJobHumanPrompt(brief);
    assertModality(prompt);
    assertLowTextPedagogy(prompt);
  });
});

test("Slice 7A: concept map / process / comparison fixtures discourage text-heavy output", () => {
  assert.ok(briefsByRep.concept_map, "concept_map brief");
  assert.ok(briefsByRep.process, "process brief");
  assert.ok(briefsByRep.comparison, "comparison brief");

  const concept = workspace.buildVisualJobHumanPrompt(briefsByRep.concept_map);
  assert.match(concept, /essay arranged in boxes|paragraph boxes/i);
  assert.match(concept, /Learner reasoning:/i);

  const processPrompt = workspace.buildVisualJobHumanPrompt(briefsByRep.process);
  assert.match(processPrompt, /Ordered stages/i);
  assert.match(processPrompt, /Dense written instructions/i);

  const comparisonPrompt = workspace.buildVisualJobHumanPrompt(briefsByRep.comparison);
  assert.match(comparisonPrompt, /Parallel layout|aligned comparison/i);
  assert.match(comparisonPrompt, /paragraph-length descriptions/i);
  assert.match(comparisonPrompt, /Preferred visual output:/i);
  assert.match(comparisonPrompt, /Explanatory diagrams/i);
  assert.match(comparisonPrompt, /Conceptual relationship diagrams/i);
  assert.match(comparisonPrompt, /Worksheets or activity sheets/i);
  assert.match(comparisonPrompt, /Question prompts inside the image/i);
});

test("Slice 7A: annotated_system fixture limits label clutter and requires rendered image", () => {
  const annotatedWs = workspace.buildVisualJobsWorkspaceState(annotatedSystemPage());
  assert.equal(annotatedWs.compilerResult.valid, true, JSON.stringify(annotatedWs.compilerResult.errors));
  const brief = annotatedWs.compilerResult.briefs[0];
  assert.equal(brief.preferred_representation, "annotated_system");
  const prompt = workspace.buildVisualJobHumanPrompt(brief);
  assertModality(prompt);
  assert.match(prompt, /label clutter/i);
  assert.match(prompt, /leader lines/i);
  assert.match(prompt, /Learner reasoning:/i);
});

// --- Representations ---

test("Slice 7A: all 15 representations have deterministic visual-language guidance", () => {
  const keys = Object.keys(workspace.HUMAN_REPRESENTATION_GUIDANCE).sort();
  assert.deepEqual(keys, s38.REPRESENTATIONS.slice().sort());
  s38.REPRESENTATIONS.forEach((token) => {
    const g = workspace.HUMAN_REPRESENTATION_GUIDANCE[token];
    assert.ok(g.structure);
    assert.ok(g.prefer);
    assert.ok(g.avoid);
  });
});

test("Slice 7A: each representation guidance appears in a prompt for that token", () => {
  s38.REPRESENTATIONS.forEach((token) => {
    const stub = {
      preferred_representation: token,
      subject: "Stub subject for " + token,
      context: "Visual brief: inspect relationships without completing learner work.",
      purpose: "mechanism",
      content_requirements: { authored: ["concept alpha"], derived: [] },
      exclusion_requirements: { authored_must_not_show: ["answer key"], authored_representation_avoid: [] },
      claim_constraints: { allowed: [], disallowed: ["Unsupported claim."] },
      spoiler_constraints: {
        anti_spoiler: true,
        boundary: {
          hide_answers: true,
          hide_classification_keys: true,
          hide_model_solution: true,
          allow_structural_hint: true
        }
      },
      pedagogical_metadata: {
        pedagogical_added_value: "Makes structure visible without completing the answer.",
        reasoning_supported: "Learners interpret structure before concluding."
      },
      caption_guidance: "Short labels only."
    };
    const prompt = workspace.buildVisualJobHumanPrompt(stub);
    assertModality(prompt);
    assert.match(prompt, /Visual structure:/i);
    assert.match(prompt, new RegExp(workspace.HUMAN_REPRESENTATION_GUIDANCE[token].structure.slice(0, 24)));
  });
});

test("Slice 7A: classification_matrix does not auto-complete learner classification under anti_spoiler", () => {
  const stub = {
    preferred_representation: "classification_matrix",
    subject: "Road role classification cues",
    content_requirements: { authored: ["category headers"] },
    exclusion_requirements: { authored_must_not_show: ["completed cells"] },
    claim_constraints: { allowed: [], disallowed: [] },
    spoiler_constraints: { anti_spoiler: true, boundary: { allow_structural_hint: true } },
    pedagogical_metadata: { pedagogical_added_value: "Category cues only." }
  };
  const prompt = workspace.buildVisualJobHumanPrompt(stub);
  assert.match(prompt, /Completing classifications learners are expected to perform/i);
  assert.match(prompt, /completed written conclusion/i);
});

// --- Learner reasoning ---

test("Slice 7A: non-anti-spoiler prompt does not invent learner-reasoning boundary", () => {
  const local = clone(briefsByRep.concept_map);
  local.spoiler_constraints = { anti_spoiler: false, boundary: null };
  const prompt = workspace.buildVisualJobHumanPrompt(local);
  assert.doesNotMatch(prompt, /Learner reasoning:/i);
  const diag = workspace.diagnoseHumanPrompt(prompt, local);
  assert.equal(diag.learner_reasoning_boundary_present, true);
});

// --- Content integrity ---

test("Slice 7A: must_show and must_not_show survive; no anchors or IDs", () => {
  const brief = briefsByRep.concept_map;
  const before = clone(brief);
  const prompt = workspace.buildVisualJobHumanPrompt(brief);
  brief.content_requirements.authored.forEach((item) => {
    assert.match(prompt, new RegExp(item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
  brief.exclusion_requirements.authored_must_not_show.forEach((item) => {
    assert.match(prompt, new RegExp(item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
  assert.doesNotMatch(prompt, /\[A1\.|brief_id|job_id|schema_version|compiler_version/i);
  assert.deepEqual(brief, before);
});

test("Slice 7A: empty allowed claims remain empty and no invented approved claims", () => {
  const local = clone(briefsByRep.process);
  local.claim_constraints = { allowed: [], disallowed: ["Construction order is arbitrary."] };
  const prompt = workspace.buildVisualJobHumanPrompt(local);
  assert.match(prompt, /Do not claim: Construction order is arbitrary/);
  assert.doesNotMatch(prompt, /Supported claim boundary:/i);
});

test("Slice 7A: identical input produces byte-identical human prompt", () => {
  const brief = briefsByRep.process;
  assert.equal(
    workspace.buildVisualJobHumanPrompt(brief),
    workspace.buildVisualJobHumanPrompt(brief)
  );
});

// --- Diagnostics ---

test("Slice 7A: prompt-quality diagnostics pass for successful briefs", () => {
  const presentation = workspace.buildVisualJobPresentation(briefsByRep.concept_map, 0);
  const d = presentation.prompt_quality_diagnostics;
  assert.equal(d.modality_instruction_present, true);
  assert.equal(d.rejects_text_only_output, true);
  assert.equal(d.visual_organisation_instruction_present, true);
  assert.equal(d.paragraph_text_prohibited, true);
  assert.equal(d.learner_reasoning_boundary_present, true);
  assert.equal(d.representation_guidance_present, true);
  assert.equal(d.finished_visual_reminder_present, true);
  assert.ok(["concise", "extended", "unusually_long"].includes(d.prompt_length_class));
});

test("Slice 7A: representative affordances include explicit non-worksheet guardrails", () => {
  // Add annotated_system from the dedicated fixture
  const annotatedWs = workspace.buildVisualJobsWorkspaceState(annotatedSystemPage());
  const localByRep = Object.assign({}, briefsByRep);
  annotatedWs.compilerResult.briefs.forEach((b) => { localByRep[b.preferred_representation] = b; });
  const reps = ["concept_map", "process", "comparison", "annotated_system"];
  reps.forEach((rep) => {
    const brief = localByRep[rep];
    assert.ok(brief, rep + " brief");
    const prompt = workspace.buildVisualJobHumanPrompt(brief);
    assert.match(prompt, /The image should explain concepts/i);
    assert.match(prompt, /Worksheets or activity sheets/i);
    assert.match(prompt, /Tables intended for learner completion/i);
    // "Moving learner exercises" only appears in activity mode
    if (/activity learning support/i.test(prompt)) {
      assert.match(prompt, /Moving learner exercises into the image itself/i);
    }
  });
});

test("Slice 7A: UI keeps simplified card and exposes rendered-image note", () => {
  const html = workspace.renderVisualJobsWorkspaceHtml(ws);
  assert.match(html, /Rendered image required/);
  assert.match(html, /util-vj-human-prompt/);
  assert.match(html, /Developer and debug details/);
  assert.match(html, /modality_instruction_present/);
});

test("Slice 7A: Copy Prompt still uses revised human prompt; canonical unchanged", () => {
  const brief = briefsByRep.concept_map;
  const human = workspace.getBriefHumanPrompt(ws, brief.brief_id);
  const canonical = workspace.getBriefGenerationInstruction(ws, brief.brief_id);
  assert.equal(human, workspace.buildVisualJobHumanPrompt(brief));
  assert.equal(canonical, brief.generation_instruction);
  assert.match(human, /^Generate a finished rendered educational image\./);
  assert.notEqual(human, canonical);
});

test("Slice 7A: compiler generation_instruction remains byte-equivalent after presentation", () => {
  const before = clone(ws.compilerResult);
  workspace.renderVisualJobsWorkspaceHtml(ws);
  workspace.buildVisualJobPresentation(ws.compilerResult.briefs[0], 0);
  assert.deepEqual(ws.compilerResult, before);
});

test("Slice 7A: no new representation tokens introduced", () => {
  assert.deepEqual(
    Object.keys(workspace.HUMAN_REPRESENTATION_GUIDANCE).sort(),
    compiler.REPRESENTATIONS.slice().sort()
  );
  assert.equal(typeof planner.planPrismVisualJobs, "function");
});
