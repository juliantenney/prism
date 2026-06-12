/**
 * Post-Sprint-27 workflow observation harness (read-only).
 * Extract → resolve → topology + presentation mapping; no OpenAI / no full generation.
 *
 * Run: node --test tests/*.test.js
 * Report: docs/.../context-files/manual-validation-observation-log.md (updated on harness test)
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);
const observationLogPath = path.join(
  repoRoot,
  "docs",
  "development",
  "sprints",
  "2026-05-21-sprint-27-assessment-feedback-elicitation-semantics",
  "context-files",
  "manual-validation-observation-log.md"
);

const TOPOLOGY_SEED = {
  steps: [
    { title: "Normalize Content", role: "" },
    { title: "Model Knowledge", role: "" },
    { title: "Define Learning Outcomes", role: "" },
    { title: "Generate Assessment Items", role: "" },
    { title: "Design Learning Activities", role: "" },
    { title: "Generate Activity Materials", role: "" },
    { title: "Design Page", role: "" }
  ]
};

const SCENARIOS = [
  {
    id: "retrieval-quiz",
    label: "Simple retrieval quiz",
    brief: {
      goal:
        "Create a self-study revision page on photosynthesis with a 10-item MCQ quiz. Show answers at the end.",
      inputs: "",
      desiredOutputs: "Self-study revision page with MCQ and answer reveal.",
      selectedDomains: ["learning-design"]
    },
    mustPassInCi: true
  },
  {
    id: "tutor-led-seminar",
    label: "Tutor-led delayed feedback seminar",
    brief: {
      goal:
        "Design a 60-minute seminar on climate misconceptions. Small groups discuss scenario questions using task cards and prompts, then complete a 5-item formative check. Do not reveal correct answers on the student handout. The tutor will debrief answers after group discussion. Include facilitator notes and delayed feedback guidance.",
      inputs:
        "Include facilitator notes with pacing for discussion, scenario prompts, and debrief guidance for the formative check.",
      desiredOutputs: "Learner handout page plus facilitator session notes.",
      selectedDomains: ["learning-design"]
    },
    mustPassInCi: true
  },
  {
    id: "peer-instruction",
    label: "Peer instruction",
    brief: {
      goal:
        "Create a peer instruction session on opportunity cost. Students answer individually, discuss in pairs, then revise answers. Include 6 MCQs and reflection prompts. Confirm solutions only after pair discussion.",
      inputs: "Undergraduate economics tutorial.",
      desiredOutputs: "Learner-facing session page with MCQs and reflection prompts.",
      selectedDomains: ["learning-design"]
    },
    mustPassInCi: false
  },
  {
    id: "transcript-source",
    label: "Uploaded transcript/source workflow",
    brief: {
      goal:
        "Using the provided lecture transcript, create learning activities and a short formative assessment on RNA viruses.",
      inputs: "",
      desiredOutputs: "Learning activities and short formative assessment.",
      selectedDomains: ["learning-design"]
    },
    mustPassInCi: true
  },
  {
    id: "no-assessment-page",
    label: "No-assessment teaching page",
    brief: {
      goal:
        "Create a short undergraduate teaching page explaining Bayesian inference with one worked example. No quiz or assessment.",
      inputs: "",
      desiredOutputs: "Undergraduate teaching page with one worked example.",
      selectedDomains: ["learning-design"]
    },
    mustPassInCi: true
  }
];

function extractLdWorkflowPolicy(md) {
  const idx = md.indexOf("### Workflow Policy");
  assert.ok(idx !== -1);
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowPolicy;
}

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  assert.ok(idx !== -1);
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = {
    readyState: "loading",
    addEventListener: () => {}
  };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

function stepTitles(out) {
  return (out.steps || []).map((s) => String(s.title || "").trim());
}

function indexOfTitle(titles, name) {
  return titles.findIndex((t) => t.toLowerCase() === String(name).toLowerCase());
}

function beforeTitle(titles, a, b) {
  const ia = indexOfTitle(titles, a);
  const ib = indexOfTitle(titles, b);
  return ia !== -1 && ib !== -1 && ia < ib;
}

function hasTitle(titles, name) {
  return indexOfTitle(titles, name) !== -1;
}

function check(label, pass, detail) {
  return { label, pass: !!pass, detail: detail || "" };
}

function formatFactorSummary(resolved, sources) {
  const keys = [
    "input_strategy",
    "assessment_required",
    "assessment_total_items",
    "assessment_interaction_mode",
    "peer_instruction_phase",
    "feedback_timing",
    "learner_answer_visibility",
    "design_feedback_required"
  ];
  return keys
    .map((k) => {
      const src = sources && sources[k] ? ` (${sources[k]})` : "";
      const v = resolved[k];
      if (v === undefined || v === null || v === "") return null;
      return `${k}=${JSON.stringify(v)}${src}`;
    })
    .filter(Boolean)
    .join("; ");
}

const api = loadPrismTestApi();
const ldMd = fs.readFileSync(ldPatternsPath, "utf8");
const ldWorkflowPolicy = extractLdWorkflowPolicy(ldMd);
const ldBriefConfig = api.normalizeWorkflowBriefConfig(extractWorkflowBriefConfig(ldMd));

function observeScenario(scenario) {
  const brief = scenario.brief;
  const explicit = api.extractWorkflowBriefExplicitFactors({
    goal: brief.goal,
    inputs: brief.inputs || "",
    desiredOutputs: brief.desiredOutputs || "",
    startingArtefact: brief.startingArtefact || "",
    selectedDomains: brief.selectedDomains || ["learning-design"]
  });
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    brief.goal,
    brief.inputs || ""
  );
  const { resolved, sources } = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    brief
  );

  const topo = api.applyWorkflowDesignHeuristics(JSON.parse(JSON.stringify(TOPOLOGY_SEED)), {
    selectedDomains: ["general", "learning-design"],
    workflowPolicy: ldWorkflowPolicy,
    stepPatternCatalog: [],
    goal: brief.goal,
    inputs: brief.inputs || "",
    desiredOutputs: brief.desiredOutputs || "",
    startingArtefact: brief.startingArtefact || "",
    explicitBriefFactors: explicit,
    resolvedBriefFactors: Object.assign(
      {
        session_materials: ["page"],
        input_strategy: resolved.input_strategy || brief.startingArtefact || "generate_from_topic",
        design_scope: "session",
        delivery_context: "in_person"
      },
      resolved
    )
  });

  const titles = stepTitles(topo);
  const presentation = api.resolveAssessmentPresentationFromBriefFactors(resolved);
  const presentationTimingOnly = api.resolveAssessmentPresentationFromBriefFactors({
    feedback_timing: resolved.feedback_timing
  });

  const checks = buildChecks(scenario, {
    brief,
    explicit,
    resolved,
    sources,
    titles,
    presentation,
    presentationTimingOnly
  });

  return {
    id: scenario.id,
    label: scenario.label,
    mustPassInCi: !!scenario.mustPassInCi,
    factors: formatFactorSummary(resolved, sources),
    steps: titles.join(" → "),
    checks,
    passCount: checks.filter((c) => c.pass).length,
    failCount: checks.filter((c) => !c.pass).length
  };
}

function buildChecks(scenario, ctx) {
  const { resolved, sources, titles, presentation, presentationTimingOnly, brief } = ctx;
  const id = scenario.id;
  const out = [];

  if (id === "retrieval-quiz") {
    out.push(
      check(
        "Generate Learning Content before Model Knowledge",
        beforeTitle(titles, "Generate Learning Content", "Model Knowledge")
      ),
      check("assessment_required true", resolved.assessment_required === true),
      check(
        "assessment_total_items 10",
        Number(resolved.assessment_total_items) === 10,
        `got ${resolved.assessment_total_items}`
      ),
      check(
        "learner visibility allows end reveal",
        resolved.learner_answer_visibility === "show_answer_grid_end" ||
          presentation.feedbackDisplay === "answer_grid_end" ||
          presentation.includeAnswers === true,
        `visibility=${resolved.learner_answer_visibility}, display=${presentation.feedbackDisplay}`
      ),
      check(
        "no Design Feedback unless policy requires",
        !hasTitle(titles, "Design Feedback") && resolved.design_feedback_required !== true,
        `design_feedback_required=${resolved.design_feedback_required}`
      )
    );
  }

  if (id === "tutor-led-seminar") {
    out.push(
      check(
        "assessment_total_items 5 explicit",
        Number(resolved.assessment_total_items) === 5 && sources.assessment_total_items === "explicit",
        `items=${resolved.assessment_total_items}, source=${sources.assessment_total_items}`
      ),
      check(
        "include_answers false",
        presentation.includeAnswers === false,
        `includeAnswers=${presentation.includeAnswers}`
      ),
      check(
        "learner_answer_visibility hidden_until_reveal",
        resolved.learner_answer_visibility === "hidden_until_reveal"
      ),
      check(
        "feedback_timing tutor_led_reveal_only (or equivalent)",
        resolved.feedback_timing === "tutor_led_reveal_only",
        resolved.feedback_timing
      ),
      check(
        "Generate Learning Content before Model Knowledge",
        beforeTitle(titles, "Generate Learning Content", "Model Knowledge")
      ),
      check(
        "Design Learning Activities before Generate Activity Materials",
        beforeTitle(titles, "Design Learning Activities", "Generate Activity Materials")
      ),
      check(
        "Generate Assessment Items before Design Feedback",
        beforeTitle(titles, "Generate Assessment Items", "Design Feedback")
      ),
      check(
        "Design Feedback before Construct Learning Sequence / Design Page",
        beforeTitle(titles, "Design Feedback", "Construct Learning Sequence") &&
          beforeTitle(titles, "Design Feedback", "Design Page")
      )
    );
  }

  if (id === "peer-instruction") {
    const peerModeOk =
      resolved.assessment_interaction_mode === "peer_instruction" ||
      resolved.assessment_interaction_mode === "discussion_oriented";
    const peerPhaseOk =
      (resolved.peer_instruction_phase &&
        resolved.peer_instruction_phase !== "none") ||
      /\bpeer instruction\b/i.test(brief.goal);
    const reflectionMappingOk =
      presentation.feedbackDisplay === "reflection_then_answers" ||
      presentationTimingOnly.feedbackDisplay === "reflection_then_answers";

    out.push(
      check(
        "assessment_interaction_mode peer_instruction or discussion_oriented",
        peerModeOk,
        resolved.assessment_interaction_mode
      ),
      check(
        "peer_instruction_phase set (or peer-instruction brief cue)",
        peerPhaseOk,
        resolved.peer_instruction_phase
      ),
      check(
        "assessment_total_items 6",
        Number(resolved.assessment_total_items) === 6,
        `got ${resolved.assessment_total_items}`
      ),
      check(
        "feedback_timing after_peer_discussion",
        resolved.feedback_timing === "after_peer_discussion"
      ),
      check(
        "reflection_then_answers presentation mapping",
        reflectionMappingOk,
        `full=${presentation.feedbackDisplay}, timing-only=${presentationTimingOnly.feedbackDisplay}`
      )
    );
  }

  if (id === "transcript-source") {
    const sourceIngestChainOk =
      resolved.input_strategy === "provided_source_content" &&
      hasTitle(titles, "Normalize Content") &&
      hasTitle(titles, "Generate Learning Content") &&
      beforeTitle(titles, "Normalize Content", "Generate Learning Content") &&
      beforeTitle(titles, "Generate Learning Content", "Model Knowledge");

    out.push(
      check(
        "input_strategy provided_source_content",
        resolved.input_strategy === "provided_source_content"
      ),
      check(
        "source ingest: Normalize → Generate Learning Content → Model Knowledge",
        sourceIngestChainOk,
        titles.join(" → ")
      ),
      check("assessment_required true", resolved.assessment_required === true)
    );
  }

  if (id === "no-assessment-page") {
    out.push(
      check(
        "assessment_required false",
        resolved.assessment_required === false,
        `got ${resolved.assessment_required}`
      ),
      check(
        "no Generate Assessment Items step",
        !hasTitle(titles, "Generate Assessment Items")
      ),
      check(
        "no Design Feedback from assessment semantics",
        !hasTitle(titles, "Design Feedback") && resolved.design_feedback_required !== true
      ),
      check(
        "Generate Learning Content before Model Knowledge",
        beforeTitle(titles, "Generate Learning Content", "Model Knowledge")
      )
    );
  }

  return out;
}

function printConsoleTable(results) {
  const rows = results.map((r) => {
    const status = r.failCount === 0 ? "PASS" : `FAIL (${r.failCount})`;
    return {
      Brief: r.label,
      Status: status,
      Factors: r.factors.slice(0, 72) + (r.factors.length > 72 ? "…" : ""),
      Steps: r.steps.slice(0, 56) + (r.steps.length > 56 ? "…" : "")
    };
  });
  console.log("\n--- Post-Sprint-27 workflow observation harness ---\n");
  console.table(rows);
  for (const r of results) {
    const failed = r.checks.filter((c) => !c.pass);
    if (!failed.length) continue;
    console.log(`\n${r.label} — failed checks:`);
    for (const c of failed) {
      console.log(`  ✗ ${c.label}${c.detail ? `: ${c.detail}` : ""}`);
    }
  }
  console.log("");
}

function buildMarkdownReport(results) {
  const stamp = new Date().toISOString().slice(0, 19).replace("T", " ");
  const lines = [
    "# Post-Sprint-27 manual validation observation log",
    "",
    `Generated by \`tests/workflow-sprint27-post-stabilisation-observation.test.js\` at ${stamp} (UTC).`,
    "",
    "Read-only harness: extract → resolve → topology + presentation mapping. No OpenAI; no full workflow generation.",
    "",
    "| Brief | Pass | Key factors | Step chain (abbrev.) |",
    "| --- | --- | --- | --- |"
  ];

  for (const r of results) {
    const status = r.failCount === 0 ? "✓" : `✗ (${r.failCount})`;
    const stepsShort =
      r.steps.length > 80 ? r.steps.slice(0, 77) + "…" : r.steps;
    lines.push(
      `| ${r.label} | ${status} | ${r.factors.replace(/\|/g, "\\|")} | ${stepsShort.replace(/\|/g, "\\|")} |`
    );
  }

  lines.push("", "## Per-brief checks", "");

  for (const r of results) {
    lines.push(`### ${r.label}`, "");
    for (const c of r.checks) {
      lines.push(`- ${c.pass ? "PASS" : "FAIL"}: ${c.label}${c.detail ? ` — ${c.detail}` : ""}`);
    }
    lines.push("");
  }

  lines.push(
    "## CI gate",
    "",
    "Scenarios marked **mustPassInCi** in the harness are asserted in the test run; others are informational (known extraction gaps may fail while still documenting behaviour).",
    ""
  );

  return lines.join("\n");
}

function writeObservationLog(results) {
  const dir = path.dirname(observationLogPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(observationLogPath, buildMarkdownReport(results), "utf8");
}

test("post-Sprint-27 workflow observation harness", () => {
  const results = SCENARIOS.map(observeScenario);
  printConsoleTable(results);
  writeObservationLog(results);

  const ciFailures = [];
  for (const r of results) {
    if (!r.mustPassInCi) continue;
    const failed = r.checks.filter((c) => !c.pass);
    if (failed.length) {
      ciFailures.push(
        `${r.id}: ${failed.map((f) => f.label).join("; ")}`
      );
    }
  }

  assert.equal(
    ciFailures.length,
    0,
    `CI-gated observation scenarios failed:\n${ciFailures.join("\n")}`
  );
});
