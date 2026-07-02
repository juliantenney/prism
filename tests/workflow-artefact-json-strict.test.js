/**
 * Strict JSON capture contract — Model Knowledge, Learning Sequence, and Learning Outcomes (fenced).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const repoRoot = path.resolve(__dirname, "..");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

const strict = require(path.join(repoRoot, "lib", "workflow-artefact-json-strict.js"));

function sanitizePrismRunCapturedOutput(raw) {
  return strict.stripTrailingStepFooter(raw);
}

function extractPromptFactory(heading) {
  const md = fs.readFileSync(ldPatternsPath, "utf8");
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    escaped + "[\\s\\S]*?### Prompt Factory\\s*```json\\s*([\\s\\S]*?)\\s*```"
  );
  const m = md.match(re);
  if (!m) throw new Error("Prompt Factory not found for " + heading);
  return JSON.parse(m[1].trim());
}

function fencedJson(obj) {
  return "```json\n" + JSON.stringify(obj, null, 2) + "\n```";
}

const sampleKm = {
  concepts: [{ name: "inflation", definition: "A sustained rise in prices." }],
  relationships: [],
  groupings: [],
  processes: [],
  misconceptions: []
};

const sampleLs = {
  sequence_title: "Session",
  total_duration_minutes: 60,
  timeline: [
    {
      block_id: "b1",
      start_minute: 0,
      duration_minutes: 15,
      phase_type: "activity",
      activity_id: "A1",
      grouping: "individual",
      facilitator_actions: [],
      learner_actions: ["Read"],
      transition_to_next: "Continue"
    }
  ],
  activities_used: ["A1"],
  activities_omitted: [],
  checks: { all_activity_ids_valid: true }
};

const sampleLo = {
  learner_level: "general_adult",
  scope: "module",
  learning_outcomes: [
    {
      statement: "Explain inflation measurement methods.",
      related_concepts: ["CPI"],
      cognitive_level: "Explain",
      notes: ""
    }
  ]
};

const sampleLc = {
  title: "What drives inflation?",
  sections: [{ title: "Measuring inflation", content: "CPI tracks a basket of goods." }],
  key_concepts: ["CPI"],
  examples: [{ title: "Basket update", description: "Weights change over time." }]
};

test("KM strict parse accepts exactly one fenced json block", () => {
  const parsed = strict.parseKnowledgeModelCaptureStrict(
    fencedJson(sampleKm),
    sanitizePrismRunCapturedOutput
  );
  assert.equal(parsed.concepts.length, 1);
});

test("KM strict parse rejects raw JSON plain text (observed failure mode)", () => {
  assert.throws(
    () =>
      strict.parseKnowledgeModelCaptureStrict(
        JSON.stringify(sampleKm),
        sanitizePrismRunCapturedOutput
      ),
    /raw_json_without_fence|fenced JSON/i
  );
});

test("KM strict parse rejects prose before fenced block", () => {
  const raw = "Here is the knowledge model:\n" + fencedJson(sampleKm);
  assert.throws(
    () => strict.parseKnowledgeModelCaptureStrict(raw, sanitizePrismRunCapturedOutput),
    /missing_fenced_json_block|fenced JSON/i
  );
});

test("KM strict parse accepts fenced JSON when STEP footer is stripped", () => {
  const raw = fencedJson(sampleKm) + "\nSTEP 2 OUTPUT: knowledge_model";
  const parsed = strict.parseKnowledgeModelCaptureStrict(raw, sanitizePrismRunCapturedOutput);
  assert.equal(parsed.concepts.length, 1);
});

test("KM strict parse rejects malformed fenced JSON", () => {
  assert.throws(
    () =>
      strict.parseKnowledgeModelCaptureStrict(
        "```json\n{not json\n```",
        sanitizePrismRunCapturedOutput
      ),
    /invalid_json|fenced JSON/i
  );
});

test("LS strict parse accepts exactly one fenced json block", () => {
  const parsed = strict.parseLearningSequenceCaptureStrict(
    fencedJson(sampleLs),
    sanitizePrismRunCapturedOutput
  );
  assert.equal(parsed.timeline.length, 1);
});

test("LS strict parse rejects raw JSON plain text (observed failure mode)", () => {
  assert.throws(
    () =>
      strict.parseLearningSequenceCaptureStrict(
        JSON.stringify(sampleLs),
        sanitizePrismRunCapturedOutput
      ),
    /raw_json_without_fence|fenced JSON/i
  );
  const check = strict.validateWorkflowStepStrictJsonCapture(
    JSON.stringify(sampleLs),
    "learning_sequence",
    sanitizePrismRunCapturedOutput
  );
  assert.equal(check.ok, false);
  assert.ok(check.errors.includes("raw_json_without_fence"));
});

test("LS strict parse accepts fenced JSON when STEP footer is stripped", () => {
  const raw = fencedJson(sampleLs) + "\nSTEP 10 OUTPUT: learning_sequence";
  const parsed = strict.parseLearningSequenceCaptureStrict(raw, sanitizePrismRunCapturedOutput);
  assert.equal(parsed.timeline.length, 1);
});

test("LS strict parse rejects prose before fenced block", () => {
  const raw = "Facilitation plan:\n" + fencedJson(sampleLs);
  assert.throws(
    () => strict.parseLearningSequenceCaptureStrict(raw, sanitizePrismRunCapturedOutput),
    /missing_fenced_json_block|fenced JSON/i
  );
});

test("workflow run validator accepts fenced LS capture", () => {
  const check = strict.validateWorkflowStepStrictJsonCapture(
    fencedJson(sampleLs),
    "learning_sequence",
    sanitizePrismRunCapturedOutput
  );
  assert.equal(check.ok, true);
  assert.ok(Array.isArray(check.parsed.timeline));
});

test("pack §3 KM prompt requires fenced JSON contract", () => {
  const km = extractPromptFactory("## 3. Model Knowledge");
  assert.match(km.promptTemplate, /fenced JSON block only/i);
  assert.match(km.promptTemplate, /```json/i);
  assert.match(km.promptTemplate, /STEP N OUTPUT: knowledge_model/i);
  assert.equal(km.preferredOutputFormat, "json");
  assert.equal(km.structureStyle, "schema_structured");
});

test("pack §2 Generate Learning Content prompt requires fenced JSON contract", () => {
  const glc = extractPromptFactory("## 2. Generate Learning Content");
  assert.match(glc.promptTemplate, /fenced JSON block only/i);
  assert.match(glc.promptTemplate, /learning_content root object/i);
  assert.match(glc.promptTemplate, /STEP N OUTPUT: learning_content/i);
  assert.doesNotMatch(glc.promptTemplate, /Return only the JSON\./i);
  assert.equal(glc.preferredOutputFormat, "json");
  assert.match(glc.defaultPromptNotes, /fenced block/i);
});

test("pack §10 Learning Sequence prompt requires fenced JSON contract", () => {
  const ls = extractPromptFactory("## 10. Construct Learning Sequence");
  assert.match(ls.promptTemplate, /fenced JSON block only/i);
  assert.match(ls.promptTemplate, /learning_sequence root object/i);
  assert.doesNotMatch(ls.promptTemplate, /Return only the raw JSON object/i);
  assert.equal(ls.preferredOutputFormat, "json");
  assert.equal(ls.structureStyle, "schema_structured");
  assert.match(ls.defaultPromptNotes, /fenced block/i);
});

test("pack §4 Learning Outcomes prompt requires fenced JSON contract", () => {
  const lo = extractPromptFactory("## 4. Define Learning Outcomes");
  assert.match(lo.promptTemplate, /fenced JSON block only/i);
  assert.match(lo.promptTemplate, /learning_outcomes root object/i);
  assert.doesNotMatch(lo.promptTemplate, /Return only the JSON\./i);
  assert.equal(lo.preferredOutputFormat, "json");
  assert.equal(lo.structureStyle, "schema_structured");
  assert.match(lo.defaultPromptNotes, /fenced block/i);
  assert.deepEqual(lo.defaultOutputStructure.keys, ["learning_outcomes", "alignment_notes"]);
});

test("LO strict parse accepts exactly one fenced json block", () => {
  const parsed = strict.parseLearningOutcomesCaptureStrict(
    fencedJson(sampleLo),
    sanitizePrismRunCapturedOutput
  );
  assert.equal(parsed.learning_outcomes.length, 1);
});

test("LO strict parse rejects raw JSON plain text (observed failure mode)", () => {
  assert.throws(
    () =>
      strict.parseLearningOutcomesCaptureStrict(
        JSON.stringify(sampleLo),
        sanitizePrismRunCapturedOutput
      ),
    /raw_json_without_fence|fenced JSON/i
  );
  const check = strict.validateWorkflowStepStrictJsonCapture(
    JSON.stringify(sampleLo),
    "learning_outcomes",
    sanitizePrismRunCapturedOutput
  );
  assert.equal(check.ok, false);
  assert.ok(check.errors.includes("raw_json_without_fence"));
});

test("LO strict parse rejects prose before fenced block", () => {
  const raw = "Here are the outcomes:\n" + fencedJson(sampleLo);
  assert.throws(
    () => strict.parseLearningOutcomesCaptureStrict(raw, sanitizePrismRunCapturedOutput),
    /missing_fenced_json_block|fenced JSON/i
  );
});

test("workflow run validator accepts fenced LO capture", () => {
  const check = strict.validateWorkflowStepStrictJsonCapture(
    fencedJson(sampleLo),
    "learning_outcomes",
    sanitizePrismRunCapturedOutput
  );
  assert.equal(check.ok, true);
  assert.ok(Array.isArray(check.parsed.learning_outcomes));
});

test("strict contract blocks include KM, LC, LS, and LO fenced keys", () => {
  const kmBlock = strict.buildStrictKnowledgeModelOutputContractBlock();
  const lcBlock = strict.buildStrictLearningContentOutputContractBlock();
  const lsBlock = strict.buildStrictLearningSequenceOutputContractBlock();
  const loBlock = strict.buildStrictLearningOutcomesOutputContractBlock();
  assert.match(kmBlock, /fenced JSON block only/i);
  assert.match(kmBlock, /STEP N OUTPUT: knowledge_model/i);
  assert.match(kmBlock, /concepts, relationships, groupings, processes, misconceptions/);
  assert.match(lcBlock, /fenced JSON block only/i);
  assert.match(lcBlock, /learning_content root object/i);
  assert.match(lcBlock, /STEP N OUTPUT: learning_content/i);
  assert.match(lsBlock, /fenced JSON block only/i);
  assert.match(lsBlock, /learning_sequence root object/i);
  assert.match(lsBlock, /timeline, activities_used, activities_omitted, checks/);
  assert.match(loBlock, /fenced JSON block only/i);
  assert.match(loBlock, /learning_outcomes root object/i);
  assert.match(loBlock, /learning_outcomes \(required array\)/);
  const epBlock = strict.buildStrictEpisodePlansOutputContractBlock();
  assert.match(epBlock, /fenced JSON block only/i);
  assert.match(epBlock, /episode_plans root object/i);
  assert.match(epBlock, /Pretty-print JSON with 2-space indentation/i);
  assert.match(epBlock, /Do NOT emit minified single-line JSON/i);
  assert.match(epBlock, /"activity_id": "LO1"/);
  assert.match(epBlock, /STEP N OUTPUT: episode_plans/i);
});

test("LC strict parse accepts exactly one fenced json block", () => {
  const parsed = strict.parseLearningContentCaptureStrict(
    fencedJson(sampleLc),
    sanitizePrismRunCapturedOutput
  );
  assert.equal(parsed.sections.length, 1);
});

test("LC strict parse accepts fenced JSON when STEP footer is stripped", () => {
  const raw = fencedJson(sampleLc) + "\nSTEP 2 OUTPUT: learning_content";
  const parsed = strict.parseLearningContentCaptureStrict(raw, sanitizePrismRunCapturedOutput);
  assert.equal(parsed.key_concepts.length, 1);
});

test("LC strict parse rejects prose before fenced block", () => {
  const raw = "Here is the learning content:\n" + fencedJson(sampleLc);
  assert.throws(
    () => strict.parseLearningContentCaptureStrict(raw, sanitizePrismRunCapturedOutput),
    /missing_fenced_json_block|fenced JSON/i
  );
});

test("workflow run validator accepts fenced LC capture", () => {
  const check = strict.validateWorkflowStepStrictJsonCapture(
    fencedJson(sampleLc),
    "learning_content",
    sanitizePrismRunCapturedOutput
  );
  assert.equal(check.ok, true);
  assert.ok(Array.isArray(check.parsed.sections));
});

const sampleEpisodePlans = {
  episode_plans: [
    {
      activity_id: "LO1",
      episode_plan: {
        archetype: "understand",
        beats: [{ function: "explanation" }, { function: "verification" }]
      }
    }
  ]
};

test("workflow run validator rejects minified episode_plans capture", () => {
  const check = strict.validateWorkflowStepStrictJsonCapture(
    "```json\n" + JSON.stringify(sampleEpisodePlans) + "\n```",
    "episode_plans",
    sanitizePrismRunCapturedOutput
  );
  assert.equal(check.ok, false);
  assert.ok(check.errors.includes("minified_single_line_json"));
});

test("workflow run validator accepts pretty-printed fenced episode_plans capture with STEP footer", () => {
  const check = strict.validateWorkflowStepStrictJsonCapture(
    fencedJson(sampleEpisodePlans) + "\nSTEP 3 OUTPUT: episode_plans",
    "episode_plans",
    sanitizePrismRunCapturedOutput
  );
  assert.equal(check.ok, true);
  assert.ok(Array.isArray(check.parsed.episode_plans));
});

test("workflow run validator accepts pretty-printed fenced episode_plans capture", () => {
  const check = strict.validateWorkflowStepStrictJsonCapture(
    fencedJson(sampleEpisodePlans),
    "episode_plans",
    sanitizePrismRunCapturedOutput
  );
  assert.equal(check.ok, true);
  assert.ok(Array.isArray(check.parsed.episode_plans));
});

test("workflow run validator rejects raw JSON KM capture", () => {
  const check = strict.validateWorkflowStepStrictJsonCapture(
    JSON.stringify(sampleKm),
    "knowledge_model",
    sanitizePrismRunCapturedOutput
  );
  assert.equal(check.ok, false);
  assert.ok(check.errors.includes("raw_json_without_fence"));
});

test("workflow run validator accepts fenced KM capture", () => {
  const check = strict.validateWorkflowStepStrictJsonCapture(
    fencedJson(sampleKm),
    "knowledge_model",
    sanitizePrismRunCapturedOutput
  );
  assert.equal(check.ok, true);
  assert.ok(Array.isArray(check.parsed.concepts));
});

test("app.js wires strict JSON workflow validation and prompt augmentation", () => {
  const src = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  assert.match(src, /validateStrictJsonWorkflowRunStepCapture/);
  assert.match(src, /applyStrictJsonArtefactContractToDraft/);
  assert.match(src, /buildStrictLearningOutcomesOutputContractBlock/);
  assert.match(src, /buildStrictEpisodePlansOutputContractBlock/);
  assert.match(src, /episode_plans/);
  assert.match(src, /workflowRunStrictJsonValidation/);
  assert.match(src, /resolveWorkflowArtefactJsonStrictLib/);
});

