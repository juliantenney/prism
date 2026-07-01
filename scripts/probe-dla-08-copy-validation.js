/**
 * Sprint 56 DLA-08 — Copy-path external generation spot-check (RNA/HCV).
 * Run: node scripts/probe-dla-08-copy-validation.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { runPrismLibScriptsInSandbox } = require("../tests/prism-vm-lib-bootstrap.js");
const templates = require("../lib/episode-plan-v1-templates.js");

const repoRoot = path.resolve(__dirname, "..");
const model = process.env.PRISM_PROBE_MODEL || "gpt-4.1-mini";
const outJson = path.join(repoRoot, "tests/fixtures/dla/rna-hcv-dla-08-run.json");
const outPrompt = path.join(
  repoRoot,
  "docs/development/prompt-contracts/artefacts/dla-08-rna-hcv-emitted-copy-prompt.txt"
);

const RNA_HCV_BRIEF = {
  goal:
    "Create a self-directed learning page on RNA virus genome organisation, replication, HCV mechanisms, and transmission strategies.",
  inputs: "Undergraduate biomedical students (self-directed study)",
  desiredOutputs: "Learner-facing page",
  selectedDomains: ["learning-design"]
};

const RNA_LO = {
  learning_outcomes: [
    {
      id: "LO1",
      cognitive_level: "understand",
      statement:
        "Explain how positive-sense, negative-sense, and ambisense RNA genomes differ in translation and replication requirements."
    },
    {
      id: "LO2",
      cognitive_level: "understand",
      statement:
        "Describe how RNA-dependent RNA polymerase function and error-prone replication produce viral quasispecies."
    },
    {
      id: "LO3",
      cognitive_level: "analyse",
      statement:
        "Analyse key steps in the RNA virus replication cycle and how genome type shapes each stage."
    },
    {
      id: "LO4",
      cognitive_level: "analyse",
      statement:
        "Analyse how Hepatitis C virus uses host factors and viral proteins to establish replication and assembly."
    },
    {
      id: "LO5",
      cognitive_level: "evaluate",
      statement:
        "Evaluate how RNA viruses use immune evasion and transmission strategies to persist in host populations."
    }
  ]
};

const FIELD_RANGES = {
  activity_preamble: { min: 50, max: 120 },
  reasoning_orientation: { min: 35, max: 80 },
  self_explanation_prompt: { min: 35, max: 80 },
  conceptual_contrast_prompt: { min: 35, max: 80 },
  argument_structure_hint: { min: 35, max: 80 },
  transfer_or_application_task: { min: 35, max: 80 },
  expected_output: { min: 30, max: 70 },
  intellectual_coherence_bridge: { min: 30, max: 60 },
  support_note: { min: 20, max: 70 }
};

const COGNITION_FIELDS = [
  "reasoning_orientation",
  "self_explanation_prompt",
  "conceptual_contrast_prompt",
  "argument_structure_hint",
  "transfer_or_application_task"
];

function readEnvKey() {
  try {
    const raw = fs.readFileSync(path.join(repoRoot, ".env.local"), "utf8");
    const m = raw.match(/^OPENAI_API_KEY\s*=\s*(.+)$/m);
    if (!m) return "";
    let v = m[1].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    return v;
  } catch (_e) {
    return "";
  }
}

const DEFAULT_PROBE_LIBS = [
  "lib/episode-plan-population-contract.js",
  "lib/episode-plan-v1-templates.js",
  "lib/episode-plan-v1-validation.js",
  "lib/episode-plan-dla-integration.js"
];

function loadApi() {
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  DEFAULT_PROBE_LIBS.forEach(function (rel) {
    vm.runInContext(fs.readFileSync(path.join(repoRoot, rel), "utf8"), sandbox, { filename: rel });
  });
  vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, {
    filename: "app.js"
  });
  return sandbox.window.__PRISM_TEST_API;
}

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
}

function extractDlaPromptFactory(md) {
  const sectionIdx = md.indexOf("## 5. Design Learning Activities");
  const fence = md.indexOf("```json", md.indexOf("### Prompt Factory", sectionIdx));
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim());
}

function wordCount(text) {
  const raw = String(text || "").trim();
  if (!raw) return 0;
  return raw.split(/\s+/).filter(Boolean).length;
}

function parseJsonFromText(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return null;
  let slice = trimmed;
  if (slice.includes("```")) {
    const start = slice.indexOf("{");
    const end = slice.lastIndexOf("}");
    if (start !== -1 && end > start) slice = slice.slice(start, end + 1);
  }
  try {
    return JSON.parse(slice);
  } catch (_e) {
    const s = trimmed.indexOf("{");
    const e = trimmed.lastIndexOf("}");
    if (s !== -1 && e > s) {
      try {
        return JSON.parse(trimmed.slice(s, e + 1));
      } catch (_e2) {
        return null;
      }
    }
    return null;
  }
}

function normalizeActivities(parsed) {
  if (!parsed || typeof parsed !== "object") return [];
  if (Array.isArray(parsed.activities)) return parsed.activities;
  if (parsed.learning_activities && Array.isArray(parsed.learning_activities.content)) {
    return parsed.learning_activities.content;
  }
  if (Array.isArray(parsed.learning_activities)) return parsed.learning_activities;
  return [];
}

function scoreActivity(row, index, total) {
  const id = String(row.activity_id || row.id || "A" + (index + 1)).trim();
  const fieldScores = {};
  const failures = [];
  const missing = [];

  Object.keys(FIELD_RANGES).forEach((field) => {
    const val = row[field];
    const wc = wordCount(val);
    const range = FIELD_RANGES[field];
    if (!val || !String(val).trim()) {
      fieldScores[field] = { words: 0, status: "absent" };
      return;
    }
    const below = wc < range.min;
    const above = wc > range.max;
    fieldScores[field] = {
      words: wc,
      status: below ? "below_floor" : above ? "above_ceiling" : "ok"
    };
    if (below || above) failures.push(field + (below ? "_below" : "_above"));
  });

  if (!row.activity_preamble || wordCount(row.activity_preamble) < FIELD_RANGES.activity_preamble.min) {
    missing.push("activity_preamble_floor");
  }
  if (!row.expected_output || wordCount(row.expected_output) < FIELD_RANGES.expected_output.min) {
    missing.push("expected_output_floor");
  }
  const hasCognition = COGNITION_FIELDS.some(
    (f) => row[f] && wordCount(row[f]) >= FIELD_RANGES[f].min
  );
  if (!hasCognition) missing.push("cognition_field");

  if (total > 1 && index > 0) {
    const bridge = row.intellectual_coherence_bridge;
    if (!bridge || wordCount(bridge) < FIELD_RANGES.intellectual_coherence_bridge.min) {
      missing.push("intellectual_coherence_bridge");
    }
  }

  const populatedFails = Object.entries(fieldScores)
    .filter(([, v]) => v.status === "below_floor" || v.status === "above_ceiling")
    .map(([k]) => k);

  const meetsMandatory =
    wordCount(row.activity_preamble) >= FIELD_RANGES.activity_preamble.min &&
    wordCount(row.expected_output) >= FIELD_RANGES.expected_output.min &&
    hasCognition &&
    (index === 0 ||
      total <= 1 ||
      wordCount(row.intellectual_coherence_bridge) >= FIELD_RANGES.intellectual_coherence_bridge.min);

  const meetsAllPopulated =
    meetsMandatory && populatedFails.length === 0;

  return {
    activity_id: id,
    fieldScores,
    missing,
    populatedFails,
    meetsMandatory,
    meetsAllPopulated
  };
}

async function callOpenAI(apiKey, userPrompt) {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content:
            "You are an expert learning designer. Follow the prompt exactly. Return valid JSON for learning_activities as specified."
        },
        { role: "user", content: userPrompt }
      ],
      max_output_tokens: 16000,
      temperature: 0.35
    })
  });
  if (!res.ok) throw new Error("OpenAI " + res.status + ": " + (await res.text()).slice(0, 800));
  const data = await res.json();
  const text = data?.output?.[0]?.content?.[0]?.text;
  if (typeof text !== "string") throw new Error("Unexpected OpenAI response shape");
  return text.trim();
}

function buildCopyPrompt(api) {
  const ldMd = fs.readFileSync(
    path.join(repoRoot, "domains/learning-design/domain-learning-design-step-patterns.md"),
    "utf8"
  );
  const ldBriefConfig = api.normalizeWorkflowBriefConfig(extractWorkflowBriefConfig(ldMd));
  const dlaPF = extractDlaPromptFactory(ldMd);
  const explicit = api.extractWorkflowBriefExplicitFactors(RNA_HCV_BRIEF);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    RNA_HCV_BRIEF.goal,
    RNA_HCV_BRIEF.inputs
  );
  const resolved = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    RNA_HCV_BRIEF
  ).resolved;

  const episodePlans = templates.deriveEpisodePlansFromLearningOutcomes(RNA_LO);
  const wf = {
    id: "wf-dla-08-rna",
    goal: RNA_HCV_BRIEF.goal,
    desiredOutputs: RNA_HCV_BRIEF.desiredOutputs,
    workflowOutputs: ["Learner-facing page"],
    workflowOutputSpec: {
      goal: RNA_HCV_BRIEF.goal,
      desiredOutputs: RNA_HCV_BRIEF.desiredOutputs
    },
    workflowBriefResolution: { resolvedFactors: resolved },
    steps: [
      {
        id: "lo_step",
        title: "Define Learning Outcomes",
        outputName: "learning_outcomes",
        canonical_step_id: "step_define_learning_outcomes"
      },
      {
        id: "ep_step",
        title: "Design Episode Plan",
        outputName: "episode_plans",
        canonical_step_id: "step_design_episode_plan"
      },
      {
        id: "dla_step",
        title: "Design Learning Activities",
        outputName: "learning_activities",
        canonical_step_id: "step_design_learning_activities",
        prompt_source_type: "local_override",
        override_prompt_body: api.buildSeededStepPromptForWorkflowStep({
          workflowGoal: RNA_HCV_BRIEF.goal,
          workflowOutputs: ["Learner-facing page"],
          workflowOutputSpec: {
            goal: RNA_HCV_BRIEF.goal,
            desiredOutputs: RNA_HCV_BRIEF.desiredOutputs
          },
          step: {
            title: "Design Learning Activities",
            canonical_step_id: "step_design_learning_activities",
            outputName: "learning_activities"
          },
          matchedPattern: { promptFactory: dlaPF }
        })
      }
    ]
  };

  wf.steps = api.ensureDlaEpisodePlanInputBindingsForSteps(wf.steps);

  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest("wf-dla-08-rna");
  api.setWorkflowRunCapturedOutputsForTest({
    lo_step: JSON.stringify(RNA_LO, null, 2),
    ep_step: JSON.stringify(episodePlans, null, 2)
  });

  const dlaStep = wf.steps[2];
  const copyText = api.buildWorkflowStepInstructions(dlaStep, 2, null);
  if (/PF-11: missing episode_plans upstream/i.test(copyText)) {
    throw new Error("Copy prompt still missing upstream episode_plans embed");
  }
  const coreOnly = api.applyWorkflowStepRuntimePromptAugmentations(
    dlaStep.override_prompt_body,
    dlaStep,
    wf,
    {}
  );
  return { copyText, coreOnly, episodePlanCount: episodePlans.episode_plans?.length || 0 };
}

function scoreFixture(label, activities, lib) {
  const evidence = lib.evaluateGuidedLearningScaffoldEvidence({ activities });
  const detailed = activities.map((row, i) => scoreActivity(row, i, activities.length));
  const passMandatory = detailed.filter((r) => r.meetsMandatory).length;
  const passAll = detailed.filter((r) => r.meetsAllPopulated).length;
  return {
    label,
    activityCount: activities.length,
    passMandatory,
    passMandatoryPct: activities.length
      ? Math.round((passMandatory / activities.length) * 1000) / 10
      : 0,
    passAllPopulated: passAll,
    passAllPct: activities.length ? Math.round((passAll / activities.length) * 1000) / 10 : 0,
    evidence,
    detailed
  };
}

function fieldFailureHistogram(detailed) {
  const counts = {};
  detailed.forEach((row) => {
    row.populatedFails.forEach((f) => {
      const field = f.replace(/_below|_above$/, "");
      counts[field] = (counts[field] || 0) + 1;
    });
    row.missing.forEach((m) => {
      counts[m] = (counts[m] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([field, count]) => ({ field, count }));
}

function scoreWithRepair(label, parsed, scaffoldLib, repairOptions) {
  const rawActs = normalizeActivities(parsed);
  const rawScore = scoreFixture(label + " (raw)", rawActs, scaffoldLib);
  const repaired = scaffoldLib.repairGuidedLearningScaffoldOnDlaCapture(
    parsed && parsed.activities ? parsed : { activities: rawActs },
    repairOptions || {}
  );
  const postActs = normalizeActivities(repaired.parsed);
  const postScore = scoreFixture(label + " (post-repair)", postActs, scaffoldLib);
  return {
    raw: rawScore,
    postRepair: postScore,
    repairApplied: repaired.repairApplied,
    evidence: repaired.evidence
  };
}

function loadScaffoldLib() {
  return require("../lib/ld-guided-learning-scaffold.js");
}

function buildRepairOptions() {
  return {
    workflowGoal: RNA_HCV_BRIEF.goal,
    learningOutcomes: RNA_LO,
    episodePlans: templates.deriveEpisodePlansFromLearningOutcomes(RNA_LO)
  };
}

async function runFixturesOnlyProbe(scaffoldLib) {
  const repairOptions = buildRepairOptions();
  const fixtureNames = [
    "rna-hcv-dla-08-cognition-best-run.json",
    "rna-hcv-dla-08-run.json",
    "rna-hcv-dla-08-stab-run-1.json",
    "rna-hcv-terse-scaffold-dla.json"
  ];
  const fixtures = fixtureNames.map((name) => {
    const parsed = JSON.parse(
      fs.readFileSync(path.join(repoRoot, "tests/fixtures/dla", name), "utf8")
    );
    return { name, ...scoreWithRepair(name, parsed, scaffoldLib, repairOptions) };
  });
  const report = {
    date: new Date().toISOString().slice(0, 10),
    mode: "fixtures-only",
    thresholdPct: 80,
    repairOptions: { workflowGoal: repairOptions.workflowGoal },
    fixtures,
    summary: fixtures.map((f) => ({
      name: f.name,
      rawPassMandatoryPct: f.raw.passMandatoryPct,
      postRepairPassMandatoryPct: f.postRepair.passMandatoryPct,
      repairApplied: f.repairApplied,
      meetsScaffoldQuality: f.evidence && f.evidence.meetsGuidedLearningScaffoldQuality
    }))
  };
  console.log(JSON.stringify(report, null, 2));
  return report;
}

async function main() {
  const scaffoldLib = loadScaffoldLib();
  const fixturesOnly = process.argv.includes("--fixtures-only");

  if (fixturesOnly) {
    await runFixturesOnlyProbe(scaffoldLib);
    return;
  }

  const apiKey = readEnvKey();
  if (!apiKey) {
    console.error("OPENAI_API_KEY missing in .env.local");
    process.exit(1);
  }
  const api = loadApi();
  const lib = {
    evaluateGuidedLearningScaffoldEvidence: (x, o) =>
      scaffoldLib.evaluateGuidedLearningScaffoldEvidence(x, o)
  };

  const { copyText, coreOnly } = buildCopyPrompt(api);
  fs.mkdirSync(path.dirname(outPrompt), { recursive: true });
  fs.writeFileSync(outPrompt, copyText, "utf8");

  console.log("Emitted core:", coreOnly.length, "chars");
  console.log("Copy wrapper:", copyText.length, "chars");
  console.log("Calling", model, "...");

  const raw = await callOpenAI(apiKey, copyText);
  const parsed = parseJsonFromText(raw);
  const activities = normalizeActivities(parsed);
  if (!activities.length) {
    console.error("Failed to parse activities from model output");
    fs.writeFileSync(outJson.replace(".json", "-raw.txt"), raw, "utf8");
    process.exit(1);
  }

  const payload = { activities };
  fs.writeFileSync(outJson, JSON.stringify(payload, null, 2), "utf8");

  const repairOptions = buildRepairOptions();
  const currentRaw = scoreFixture("DLA-08 (raw)", activities, lib);
  const repaired = scaffoldLib.repairGuidedLearningScaffoldOnDlaCapture(payload, repairOptions);
  const postActivities = normalizeActivities(repaired.parsed);
  const currentPostRepair = scoreFixture("DLA-08 (post-repair)", postActivities, lib);
  const sprint55Latest = scoreFixture(
    "Sprint 55 rna-hcv-latest-run",
    JSON.parse(fs.readFileSync(path.join(repoRoot, "tests/fixtures/dla/rna-hcv-latest-run.json"), "utf8"))
      .activities,
    lib
  );
  const sprint55Terse = scoreFixture(
    "Sprint 55 rna-hcv-observed-terse-full",
    JSON.parse(
      fs.readFileSync(path.join(repoRoot, "tests/fixtures/dla/rna-hcv-observed-terse-full.json"), "utf8")
    ).activities,
    lib
  );

  const report = {
    date: new Date().toISOString().slice(0, 10),
    model,
    emittedCoreChars: coreOnly.length,
    copyWrapperChars: copyText.length,
    sprint55BaselineEmittedCore: 49949,
    dla05EmittedCore: 31551,
    thresholdPct: 80,
    current: currentRaw,
    currentPostRepair,
    repairApplied: repaired.repairApplied,
    scaffoldEvidence: repaired.evidence,
    sprint55Latest,
    sprint55Terse,
    histogram: fieldFailureHistogram(currentRaw.detailed),
    histogramPostRepair: fieldFailureHistogram(currentPostRepair.detailed)
  };
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
