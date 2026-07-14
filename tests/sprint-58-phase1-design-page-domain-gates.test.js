/**
 * Sprint 58 Phase 1 — Design Page domain §13 alignment with vNext partial contract.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

const LEGACY_MATERIALS_PATTERNS = [
  /learning_activities\.content/i,
  /GAM Content:/i,
  /search conversation history for activity_materials/i,
  /WHOLE-BLOCK MATERIAL EXTRACTION/i,
  /MATERIAL COMPLETENESS CHECK/i,
  /archival copy-only from GAM/i,
  /copy each upstream Generate Activity Materials/i
];

function extractDesignPagePromptFactory(md) {
  const dpSection = md.slice(md.indexOf("## 13. Design Page"));
  const match = dpSection.match(/### Prompt Factory\s*```json\s*([\s\S]*?)\s*```/);
  assert.ok(match, "Design Page prompt factory JSON not found");
  return JSON.parse(match[1].trim());
}

function loadPrismTestApi(extraLibs) {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, extraLibs);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function seededDesignPagePrompt(api, wf) {
  const factory = extractDesignPagePromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  const seeded = api.buildSeededStepPromptForWorkflowStep({
    workflowName: "Sprint 58 partial page",
    step: {
      title: "Design Page",
      canonical_step_id: "step_design_page",
      inputBindings: []
    },
    matchedPattern: { promptFactory: factory }
  });
  return api
    .applyWorkflowStepRuntimePromptAugmentations(
      seeded,
      { canonical_step_id: "step_design_page", title: "Design Page" },
      wf || {
        id: "wf-partial",
        pageEnrichmentV2: true,
        partialPageOutputs: true,
        goal: "Learner page",
        desiredOutputs: "page",
        steps: [
          {
            id: "dp",
            title: "Design Page",
            outputName: "page",
            canonical_step_id: "step_design_page"
          }
        ]
      }
    )
    .trim();
}

test("Phase 1: domain §13 is page_synthesis-first", () => {
  const factory = extractDesignPagePromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  const keys = factory.defaultOutputStructure.keys;
  assert.ok(keys.includes("page_synthesis"));
  assert.ok(keys.includes("assembly_state"));
  assert.ok(!keys.includes("sections"));
  assert.ok(!keys.includes("episode_plans"));
  assert.match(factory.promptTemplate, /page_synthesis\.knowledge_summary — mandatory/i);
  assert.match(factory.defaultPromptNotes, /page_synthesis\.knowledge_summary \(mandatory\)/i);
});

test("Phase 1: domain §13 treats sections[] as optional legacy dual-read only", () => {
  const factory = extractDesignPagePromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  assert.match(factory.promptTemplate, /sections\[\] is optional legacy dual-read/i);
  assert.match(factory.defaultPromptNotes, /sections\[\] is optional legacy dual-read/i);
  assert.match(factory.runnerInstructions.what_to_check, /sections\[\] optional legacy dual-read/i);
});

test("Phase 1: domain §13 names partial contract authoritative and compose rollback-only", () => {
  const factory = extractDesignPagePromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  assert.match(factory.defaultPromptNotes, /LD-DESIGN-PAGE-PARTIAL-CONTRACT is authoritative/i);
  assert.match(factory.defaultPromptNotes, /partialPageOutputs mode/i);
  assert.match(factory.defaultPromptNotes, /LD-DESIGN-PAGE-COMPOSE-CONTRACT applies only to rollback\/legacy/i);
  assert.match(factory.promptTemplate, /partialPageOutputs mode: LD-DESIGN-PAGE-PARTIAL-CONTRACT/i);
  assert.match(factory.promptTemplate, /rollback\/legacy modes.*LD-DESIGN-PAGE-COMPOSE-CONTRACT/i);
});

test("Phase 1: domain §13 excludes legacy materials transport language", () => {
  const factory = extractDesignPagePromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  const surfaces = [
    factory.promptTemplate,
    factory.defaultPromptNotes,
    factory.runnerInstructions.what_to_check,
    factory.runnerInstructions.what_this_step_does
  ];
  for (const text of surfaces) {
    for (const pattern of LEGACY_MATERIALS_PATTERNS) {
      assert.doesNotMatch(text, pattern, `legacy materials language ${pattern}`);
    }
  }
  assert.match(factory.promptTemplate, /activities\[\]\.materials\[\] bodies are already hydrated/i);
  assert.match(factory.promptTemplate, /Do not regenerate/i);
});

test("Phase 1: partial mode seeded prompt references partial contract at runtime", () => {
  const api = loadPrismTestApi(["lib/ld-design-page-partial-contract.js"]);
  const prompt = seededDesignPagePrompt(api);
  assert.match(prompt, /LD-DESIGN-PAGE-PARTIAL-CONTRACT \(auto-applied\)/i);
  assert.match(prompt, /page_synthesis\.knowledge_summary is mandatory/i);
  assert.doesNotMatch(prompt, /LD-DESIGN-PAGE-COMPOSE-CONTRACT \(auto-applied\)/i);
});

test("Phase 1: buildDesignPageV2CopyAuthoringBrief aligns with page_synthesis partial contract", () => {
  const api = loadPrismTestApi(["lib/ld-design-page-partial-contract.js"]);
  const brief = api.buildDesignPageV2CopyAuthoringBrief();
  assert.match(brief, /page_synthesis object \(canonical transport shape\)/i);
  assert.match(brief, /Knowledge summary is mandatory/i);
  assert.match(brief, /sections\[\] is optional legacy dual-read/i);
  assert.match(brief, /Forbidden: activities\[\] regeneration/i);
  assert.match(brief, /activity_materials chat binding/i);
  assert.doesNotMatch(brief, /page_synthesis and\/or sections/i);
});
