/**
 * Sprint 70 Slice 7 — simplified Visual Jobs human prompt handoff UI.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const workspace = require("../lib/utilities-visual-jobs-workspace.js");
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
const brief = ws.compilerResult.briefs[0];
const briefBefore = clone(brief);

// --- Human prompt generation ---

test("Slice 7: one brief produces one deterministic human prompt", () => {
  const a = workspace.buildVisualJobHumanPrompt(brief);
  const b = workspace.buildVisualJobHumanPrompt(brief);
  assert.ok(a);
  assert.equal(a, b);
  assert.notEqual(a, brief.generation_instruction);
});

test("Slice 7: human prompt derives only from compiler brief fields", () => {
  const prompt = workspace.buildVisualJobHumanPrompt(brief);
  assert.match(prompt, /Generate a finished rendered educational image/i);
  assert.match(prompt, new RegExp(brief.subject.slice(0, 20)));
  assert.match(prompt, /Show:/);
  brief.content_requirements.authored.forEach((item) => {
    assert.match(prompt, new RegExp(item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
});

test("Slice 7: human prompt excludes internal IDs, anchors, schema and provider syntax", () => {
  const prompt = workspace.buildVisualJobHumanPrompt(brief);
  assert.doesNotMatch(prompt, /brief_id|job_id|affordance_id|schema_version|compiler_version/i);
  assert.doesNotMatch(prompt, /\[A1\.|learner_task \|/i);
  assert.doesNotMatch(prompt, /openai|dall-e|midjourney|```|\{"/i);
});

test("Slice 7: human prompt includes representation, purpose, exclusions and spoiler guidance", () => {
  const prompt = workspace.buildVisualJobHumanPrompt(brief);
  assert.match(prompt, /Educational goal:/i);
  assert.match(prompt, /Text and labels:/i);
  assert.match(prompt, /Avoid:/i);
  assert.match(prompt, /Learner reasoning:/i);
  assert.match(prompt, /learner should still need to interpret/i);
});

test("Slice 7: empty allowed claims are not converted into invented claims", () => {
  const local = clone(brief);
  local.claim_constraints = { allowed: [], disallowed: ["All Roman roads served only military purposes."] };
  const prompt = workspace.buildVisualJobHumanPrompt(local);
  assert.match(prompt, /Do not claim: All Roman roads served only military purposes/);
  assert.doesNotMatch(prompt, /Supported claim boundary:/i);
});

test("Slice 7: prompt length classification uses documented thresholds", () => {
  assert.equal(workspace.classifyPromptLength("x".repeat(500)), "concise");
  assert.equal(workspace.classifyPromptLength("x".repeat(1500)), "extended");
  assert.equal(workspace.classifyPromptLength("x".repeat(3000)), "unusually_long");
  const pres = workspace.buildVisualJobPresentation(brief, 0);
  assert.ok(["concise", "extended", "unusually_long"].includes(pres.prompt_length_class));
});

test("Slice 7: buildVisualJobPresentation exposes handoff fields", () => {
  const pres = workspace.buildVisualJobPresentation(brief, 0);
  assert.equal(pres.brief_id, brief.brief_id);
  assert.ok(pres.location_label);
  assert.ok(pres.representation_label);
  assert.ok(pres.title);
  assert.ok(pres.purpose_text);
  assert.ok(pres.human_prompt);
  assert.ok(Array.isArray(pres.include_items));
  assert.ok(Array.isArray(pres.avoid_items));
});

// --- Default card HTML ---

test("Slice 7: default card shows simplified handoff layout only", () => {
  const html = workspace.renderVisualJobsWorkspaceHtml(ws);
  assert.match(html, /util-vj-two-pane/);
  assert.match(html, /Copy Prompt/);
  assert.match(html, /Developer and debug details/);
  assert.match(html, /Selected image job/);
  assert.match(html, /util-vj-debug-details/);
  assert.doesNotMatch(html, /<summary>Requirements and safeguards<\/summary>/);
  assert.doesNotMatch(html, /<summary>Evidence used<\/summary>/);
  assert.doesNotMatch(html, /<summary>Technical details<\/summary>/);
});

test("Slice 7: canonical prompt and Copy Canonical Prompt live in debug details only", () => {
  const html = workspace.renderVisualJobsWorkspaceHtml(ws);
  assert.match(html, /util-vj-canonical-prompt/);
  assert.match(html, /Copy Canonical Prompt/);
  assert.match(html, new RegExp(brief.generation_instruction.slice(0, 24)));
});

test("Slice 7: workspace summary is compact and pipeline details are optional", () => {
  const html = workspace.renderVisualJobsWorkspaceHtml(ws);
  assert.match(html, /4<\/strong> image prompts/);
  assert.match(html, /util-vj-summary-meta/);
  assert.match(html, /<summary>Pipeline details<\/summary>/);
  const summaryChunk = html.split("util-vj-summary")[1].split("util-vj-two-pane")[0];
  assert.doesNotMatch(summaryChunk, /compiler_version/i);
});

// --- Copy behaviour ---

test("Slice 7: copy helpers preserve canonical and human prompts separately", async () => {
  const human = workspace.getBriefHumanPrompt(ws, brief.brief_id);
  const canonical = workspace.getBriefGenerationInstruction(ws, brief.brief_id);
  assert.equal(human, workspace.buildVisualJobHumanPrompt(brief));
  assert.equal(canonical, brief.generation_instruction);
  assert.notEqual(human, canonical);
  let copiedHuman = "";
  await workspace.copyVisualJobPrompt(human, {
    writeText: (text) => {
      copiedHuman = text;
      return Promise.resolve();
    }
  });
  assert.equal(copiedHuman, human);
});

// --- Non-mutation ---

test("Slice 7: rendering and human prompt generation do not mutate compiler briefs", () => {
  workspace.renderVisualJobsWorkspaceHtml(ws);
  workspace.buildVisualJobHumanPrompt(brief);
  workspace.buildVisualJobPresentation(brief, 0);
  assert.deepEqual(brief, briefBefore);
  assert.deepEqual(ws.compilerResult.briefs[0], briefBefore);
});

// --- Slice 6A regression ---

test("Slice 7: contract errors still render once with blocked downstream stages", () => {
  const invalid = clone(page);
  invalid.visual_affordances[0].learner_stage = "foundation";
  const invalidWs = workspace.buildVisualJobsWorkspaceState(invalid);
  const html = workspace.renderVisualJobsWorkspaceHtml(invalidWs);
  assert.match(html, /Invalid learner stage/);
  assert.match(html, /Not run because the visual-planning contract is invalid/);
  assert.doesNotMatch(html, /<div class="util-vj-summary"><\/div>/);
  assert.doesNotMatch(html, /util-vj-two-pane/);
});
