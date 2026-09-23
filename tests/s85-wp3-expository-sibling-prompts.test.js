/**
 * Sprint 85 WP3 — Expository sibling prompt selection, domain guidance, contracts.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const sibling = require("../lib/expository-sibling-prompts.js");
const guidance = require("../lib/expository-domain-guidance.js");
const contracts = require("../lib/expository-contracts.js");

const repoRoot = path.resolve(__dirname, "..");
const stepPatternsPath = path.join(
  repoRoot,
  "domains/learning-design/domain-learning-design-step-patterns.md"
);

function loadWgcApi() {
  const source = fs.readFileSync(path.join(repoRoot, "workflowGenerationContext.js"), "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    fetch: async () => ({ ok: false }),
    window: {},
    document: { readyState: "complete", addEventListener() {} }
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return sandbox.window.WorkflowGenerationContext;
}

test("catalog extraction includes lettered Expository stages 11A/B/C", () => {
  const api = loadWgcApi();
  const text = fs.readFileSync(stepPatternsPath, "utf8");
  const patterns = api.extractStepPatternCatalogFromText(text);
  const byId = {};
  patterns.forEach((p) => {
    byId[p.canonicalStepId] = p;
  });
  assert.ok(byId.step_expository_journey_plan);
  assert.ok(byId.step_expository_development);
  assert.ok(byId.step_expository_materials);
  assert.match(byId.step_expository_journey_plan.title, /Expository Journey Plan/i);
});

test("Interactive GLC promptTemplate remains unchanged (no Expository mutation)", () => {
  const text = fs.readFileSync(stepPatternsPath, "utf8");
  const glcIdx = text.indexOf("## 2. Generate Learning Content");
  const mkIdx = text.indexOf("## 3. Model Knowledge");
  const chunk = text.slice(glcIdx, mkIdx);
  assert.match(chunk, /suitable for downstream learning design/i);
  assert.doesNotMatch(chunk, /expositoryPromptTemplate/);
  assert.doesNotMatch(chunk, /Expository Resource \(reading\/viewing/i);
});

test("sibling prompt routing selects Expository bodies for EJP/XD/XM", () => {
  assert.match(
    sibling.resolveTemplate({ canonical_step_id: "step_expository_journey_plan" }),
    /Governing question/i
  );
  assert.match(
    sibling.resolveTemplate({ canonical_step_id: "step_expository_journey_plan" }),
    /Extent \(planning constraint/i
  );
  assert.match(
    sibling.resolveTemplate({ canonical_step_id: "step_expository_development" }),
    /Preserve EJP authority/i
  );
  assert.match(
    sibling.resolveTemplate({ canonical_step_id: "step_expository_materials" }),
    /Commission lock/i
  );
});

test("Expository GLC/LO/DP siblings differ from Interactive emphasis and forbid evidence obligations", () => {
  const glc = sibling.resolveTemplate("generate_learning_content");
  assert.match(glc, /explanatory richness spine/i);
  assert.match(glc, /Judgement rule \(not a checklist\)/i);
  assert.match(glc, /do NOT design the final learner-facing chapter journey/i);
  assert.match(glc, /Do NOT design Interactive activities/i);

  const lo = sibling.resolveTemplate("define_learning_outcomes");
  assert.match(lo, /intended understanding \/ competence/i);
  assert.match(lo, /do NOT require Interactive evidence production/i);
  assert.match(lo, /Do NOT design exposition sections/i);
  assert.doesNotMatch(lo, /suitable for downstream assessment and activity design/i);

  const dp = sibling.resolveTemplate("design_page");
  assert.match(dp, /CHAPTER PRESENTATION|NO PROSPECTUS FURNITURE|Do NOT generate by default/i);
  assert.match(dp, /Must not:[\s\S]*coherence rewrite/i);
  assert.match(dp, /Invent Interactive activities/i);

  ["generate_learning_content", "define_learning_outcomes", "expository_journey_plan", "expository_development", "expository_materials", "design_page"].forEach(
    (stage) => {
      const text = sibling.resolveTemplate(stage);
      assert.match(text, /Do NOT|Must not|do not invent|Invent Interactive/i, stage);
    }
  );
});

test("checklist-risk language prefers judgement over repertoire completion", () => {
  const glc = sibling.resolveTemplate("generate_learning_content");
  const ejp = sibling.resolveTemplate("expository_journey_plan");
  const xd = sibling.resolveTemplate("expository_development");
  [glc, ejp, xd].forEach((text) => {
    assert.match(text, /Judgement rule \(not a checklist\)/i);
    assert.match(text, /which kind of elaboration/i);
  });
  assert.match(ejp, /leave empty when none are warranted/i);
  assert.match(xd, /Empty commissions are valid/i);
  assert.match(xd, /often empty/i);
});

test("XD continuity requires EJP whole-resource context", () => {
  const xd = sibling.resolveTemplate("expository_development");
  assert.match(xd, /Narrative continuity/i);
  assert.match(xd, /journey_intent/i);
  assert.match(xd, /preceding and following conceptual moves/i);
  assert.match(xd, /learning_content \(explanatory richness spine/i);
  assert.match(xd, /explanation_intent vs exposition/i);
  assert.match(xd, /exposition IS the actual learner-facing/i);
  assert.match(xd, /Do NOT write exposition as authorial directives/i);
  assert.match(xd, /required non-empty learner-facing prose/i);
});

test("EJP and XM keep learning_content as richness / source authority", () => {
  const ejp = sibling.resolveTemplate("expository_journey_plan");
  assert.match(ejp, /do not plan from MK\/LO alone when learning_content is available/i);
  assert.match(ejp, /not as an instruction to produce N words/i);
  const xm = sibling.resolveTemplate("expository_materials");
  assert.match(xm, /learning_content \/ source material/i);
  assert.match(xm, /Prefer learning_content \/ source wording/i);
});

test("domain guidance resolves General + selected-domain prompt-rules without pack copies", () => {
  const paths = guidance.resolvePromptRulePaths(["learning-design", "general"]);
  assert.deepEqual(
    paths.map((p) => p.domainId),
    ["general", "learning-design"]
  );
  assert.equal(paths[0].path, "domains/general/domain-general-prompt-rules.md");
  assert.equal(
    paths[1].path,
    "domains/learning-design/domain-learning-design-prompt-rules.md"
  );

  const textsByPath = {};
  paths.forEach((row) => {
    textsByPath[row.path] = fs.readFileSync(path.join(repoRoot, row.path), "utf8");
  });
  const block = guidance.buildDomainGuidanceBlock({
    stage: "expository_journey_plan",
    why: sibling.DOMAIN_GUIDANCE_CONSUMPTION.expository_journey_plan.why,
    selectedDomains: ["general", "learning-design"],
    textsByPath
  });
  assert.match(block, /EXPOSITORY-DOMAIN-GUIDANCE \(auto-applied\)/);
  assert.match(block, /domain-general-prompt-rules/);
  assert.match(block, /domain-learning-design-prompt-rules/);
  assert.match(block, /Grounding/i);
  assert.match(block, /Interactive activity \/ workspace \/ evidence rhetoric.*does not apply/i);
  assert.doesNotMatch(block, /Learner-action rhetoric/i);
  assert.doesNotMatch(block, /learner_task/i);
});

test("LD prompt-rules filter drops Interactive rhetoric sections", () => {
  const raw = fs.readFileSync(
    path.join(repoRoot, "domains/learning-design/domain-learning-design-prompt-rules.md"),
    "utf8"
  );
  assert.match(raw, /Learner-action rhetoric/i);
  const filtered = guidance.filterRulesForExpository("learning-design", raw);
  assert.match(filtered, /Grounding in Source Content/i);
  assert.doesNotMatch(filtered, /Learner-action rhetoric/i);
  assert.doesNotMatch(filtered, /For activities:/i);
});

test("extent reaches EJP template and contract", () => {
  const ejpPrompt = sibling.resolveTemplate("expository_journey_plan");
  assert.match(ejpPrompt, /words-equivalent/i);
  assert.match(ejpPrompt, /different intellectual choices/i);
  const ejp = contracts.normalizeExpositoryJourneyPlan({
    title: "T",
    scope_scale: "about 10 minutes",
    sections: [{ title: "A", purpose: "p" }]
  });
  assert.equal(ejp.extent.words_equivalent, 2000);
});

test("EJP/XD/XM template contracts remain section-primary without activities", () => {
  assert.match(
    sibling.resolveTemplate("expository_journey_plan"),
    /artifact_type must be "expository_journey_plan"/
  );
  assert.match(sibling.resolveTemplate("expository_development"), /materials_commission\[\]/);
  assert.match(sibling.resolveTemplate("expository_materials"), /expository_materials/);
  assert.doesNotMatch(sibling.resolveTemplate("expository_journey_plan"), /activities\[\] must/);
});

test("domain guidance consumption matrix covers all Expository stages", () => {
  const stages = [
    "generate_learning_content",
    "define_learning_outcomes",
    "expository_journey_plan",
    "expository_development",
    "expository_materials",
    "design_page"
  ];
  stages.forEach((stage) => {
    assert.ok(sibling.DOMAIN_GUIDANCE_CONSUMPTION[stage], stage);
    assert.ok(Array.isArray(sibling.DOMAIN_GUIDANCE_CONSUMPTION[stage].consumes));
    assert.ok(sibling.DOMAIN_GUIDANCE_CONSUMPTION[stage].why);
  });
});
