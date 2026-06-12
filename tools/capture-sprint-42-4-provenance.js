#!/usr/bin/env node
/**
 * Sprint 42-4 — provenance capture (fixtures + deterministic render + prompt snapshots).
 * Does NOT invoke LLM workflow generation.
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const outRoot = path.join(
  repoRoot,
  "docs/development/sprints/2026-06-11-sprint-42-authorial-quality-educational-exposition/captures/sprint-42-exposition/42-4-regenerated"
);

const ldPatternsPath = path.join(
  repoRoot,
  "domains/learning-design/domain-learning-design-step-patterns.md"
);

const FIXTURES = [
  {
    id: "marx-self-study",
    pagePath: "tests/fixtures/page-render/marx-self-study-page.json",
    brief: {
      goal:
        "Create a self-directed learning page on Karl Marx covering life phases, cause-effect links, comparison of major works, and application of core concepts.",
      inputs: "Undergraduate (self-directed study)",
      desiredOutputs: "Learner-facing page",
      selectedDomains: ["learning-design"]
    },
    upstreamPath: null
  },
  {
    id: "inflation-workshop",
    pagePath: "tests/fixtures/page-render/ld-inflation-workshop-page.json",
    brief: {
      goal:
        "Design a 60-minute first-year economics workshop introducing inflation, price level changes, CPI and GDP deflator, and household impacts.",
      inputs: "First-year undergraduate economics students",
      desiredOutputs: "Learner-facing page",
      selectedDomains: ["learning-design"]
    },
    upstreamPath: "tests/fixtures/page-render/ld-inflation-workshop-upstream-learning-activities.json"
  },
  {
    id: "climate-workshop",
    pagePath: "tests/fixtures/page-render/ld-climate-misconception-discussion-page.json",
    brief: {
      goal:
        "Using the uploaded lecture on climate change, create a misconception discussion workshop. Provide task cards of common false claims, an analysis worksheet, and discussion prompts. End with true/false diagnostic statements — learners should not see correct answers on the handout.",
      inputs: "Uploaded lecture transcript on climate change science.",
      desiredOutputs: "Facilitator handout and learner handout",
      startingArtefact: "provided_source_content",
      selectedDomains: ["learning-design"]
    },
    upstreamPath: null
  }
];

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
}

function loadPrismTestApi() {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  const bootstrap = require(path.join(repoRoot, "tests/prism-vm-lib-bootstrap.js"));
  bootstrap.runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function gitInfo(filePath) {
  const { execSync } = require("node:child_process");
  const rel = path.relative(repoRoot, filePath).replace(/\\/g, "/");
  let lastCommit = "";
  let committedPreambleSample = "";
  try {
    lastCommit = execSync(`git log -1 --format=%ci%x09%h%x09%s -- "${rel}"`, {
      cwd: repoRoot,
      encoding: "utf8"
    }).trim();
    const show = execSync(`git show HEAD:"${rel}"`, { cwd: repoRoot, encoding: "utf8" });
    const parsed = JSON.parse(show);
    const la = (parsed.sections || []).find((s) => s.section_id === "learning_activities");
    const rows = Array.isArray(la?.content) ? la.content : [];
    const a2 = rows.find((r) => r.activity_id === "A2");
    if (a2 && a2.activity_preamble) committedPreambleSample = a2.activity_preamble;
  } catch (_) {
    lastCommit = "not in git / parse error";
  }
  const stat = fs.statSync(filePath);
  return {
    path: rel,
    lastWriteTime: stat.mtime.toISOString(),
    lastGitCommit: lastCommit,
    committedA2PreambleSample: committedPreambleSample || null
  };
}

function analysePageJson(page, api) {
  const acts =
    (page.sections || [])
      .filter((s) => s.section_id === "learning_activities" || /learning activities/i.test(s.heading || ""))
      .flatMap((s) => (Array.isArray(s.content) ? s.content : s.content?.activities || [])) || [];
  const preambleExposition = api.evaluateActivityPreambleExpositionEvidence
    ? api.evaluateActivityPreambleExpositionEvidence(acts)
    : null;
  const hasPreamble = acts.filter((r) => r.activity_preamble).length;
  const hasBridge = acts.filter((r) => r.intellectual_coherence_bridge).length;
  const hasCognition = acts.filter((r) =>
    ["reasoning_orientation", "self_explanation_prompt", "transfer_or_application_task", "conceptual_contrast_prompt"].some(
      (k) => r[k]
    )
  ).length;
  const facilitatorLeak = acts.some((r) =>
    /circulate during|minutes?\s+\d+\s*[-–]\s*\d+|offer a worked example if groups stall/i.test(
      String(r.support_note || "")
    )
  );
  return {
    activityCount: acts.length,
    activityPreambleCount: hasPreamble,
    intellectualCoherenceBridgeCount: hasBridge,
    cognitionFieldActivityCount: hasCognition,
    facilitatorChoreographyInSupportNote: facilitatorLeak,
    preambleExposition: preambleExposition
  };
}

function promptSnapshot(api, ldBriefConfig, brief, step) {
  const explicit = api.extractWorkflowBriefExplicitFactors(brief);
  const inferred = api.applyWorkflowBriefInferenceRules(ldBriefConfig, brief.goal, brief.inputs);
  const { resolved } = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    brief
  );
  const ctx = {
    workflowGoal: brief.goal,
    desiredOutputs: brief.desiredOutputs,
    stepCanonicalTitle: step.title,
    stepCanonicalStepId: step.id,
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  let text = "Design step output.\n";
  text = api.applyPedagogicCognitionContractScaffoldToDraft(text, ctx);
  text = api.applySelfDirectedLearnerPageStepScaffoldsToDraft(text, ctx);
  if (step.id === "step_design_page") {
    text = api.applyLdDesignPageComposeContractToDraft(text, ctx);
  }
  return {
    delivery_context: resolved.delivery_context,
    hasAuthorialExposition: /LD-AUTHORIAL-EXPOSITION-CONTRACT/i.test(text),
    hasPreambleExposition: /LD-ACTIVITY-PREAMBLE-EXPOSITION-CONTRACT/i.test(text),
    hasLearnerPageFraming: /learner-page activity framing \(auto-applied\)/i.test(text),
    prompt: text
  };
}

function main() {
  const api = loadPrismTestApi();
  const ldBriefConfig = api.normalizeWorkflowBriefConfig(
    extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"))
  );
  const preambleLib = require(path.join(repoRoot, "lib/ld-activity-preamble-exposition.js"));
  const authorialLib = require(path.join(repoRoot, "lib/ld-authorial-exposition.js"));

  const codeProvenance = {
    ld_authorial_exposition_js: gitInfo(path.join(repoRoot, "lib/ld-authorial-exposition.js")),
    ld_activity_preamble_exposition_js: gitInfo(
      path.join(repoRoot, "lib/ld-activity-preamble-exposition.js")
    ),
    app_js: gitInfo(path.join(repoRoot, "app.js")),
    authorial_module_present: fs.existsSync(path.join(repoRoot, "lib/ld-authorial-exposition.js")),
    preamble_module_present: fs.existsSync(path.join(repoRoot, "lib/ld-activity-preamble-exposition.js"))
  };

  const manifest = {
    captured_at: new Date().toISOString(),
    regeneration_method:
      "fixture_snapshot_plus_deterministic_html_render_and_prompt_snapshots",
    llm_workflow_regeneration_performed: false,
    reason_no_llm:
      "PRISM has no automated workflow runner in tools/; workflows execute via browser + external AI. No API credentials in repo.",
    sprint_42_code_committed_to_git: false,
    artefacts: []
  };

  fs.mkdirSync(outRoot, { recursive: true });

  for (const spec of FIXTURES) {
    const pagePath = path.join(repoRoot, spec.pagePath);
    const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
    const dir = path.join(outRoot, spec.id);
    fs.mkdirSync(dir, { recursive: true });

    const prov = gitInfo(pagePath);
    const analysis = analysePageJson(page, api);

    const dlaSnap = promptSnapshot(api, ldBriefConfig, spec.brief, {
      title: "Design Learning Activities",
      id: "step_design_learning_activities"
    });
    const dpSnap = promptSnapshot(api, ldBriefConfig, spec.brief, {
      title: "Design Page",
      id: "step_design_page"
    });

    fs.writeFileSync(path.join(dir, "page.json"), JSON.stringify(page, null, 2));
    if (spec.upstreamPath) {
      fs.copyFileSync(
        path.join(repoRoot, spec.upstreamPath),
        path.join(dir, "upstream-learning-activities.json")
      );
    }
    fs.writeFileSync(path.join(dir, "dla-prompt-snapshot.txt"), dlaSnap.prompt);
    fs.writeFileSync(path.join(dir, "design-page-prompt-snapshot.txt"), dpSnap.prompt);

    const render = api.buildUtilityStructuredHtmlForTest(page);
    if (render.error) throw new Error(render.error);
    fs.writeFileSync(path.join(dir, "page-rendered.html"), render.html);

    const entry = {
      id: spec.id,
      page_fixture: prov,
      json_analysis: analysis,
      dla_prompt: {
        delivery_context: dlaSnap.delivery_context,
        has_LD_AUTHORIAL_EXPOSITION_CONTRACT: dlaSnap.hasAuthorialExposition,
        has_LD_ACTIVITY_PREAMBLE_EXPOSITION_CONTRACT: dlaSnap.hasPreambleExposition,
        has_learner_page_framing: dlaSnap.hasLearnerPageFraming
      },
      design_page_prompt: {
        has_LD_AUTHORIAL_EXPOSITION_CONTRACT: dpSnap.hasAuthorialExposition,
        has_LD_ACTIVITY_PREAMBLE_EXPOSITION_CONTRACT: dpSnap.hasPreambleExposition
      },
      regenerated_after_42_2: false,
      regenerated_after_42_3: false,
      evidence_notes: []
    };

    if (spec.id === "marx-self-study") {
      entry.regenerated_after_42_3 = "partial_hand_edit_only";
      entry.evidence_notes.push(
        "Working-tree page.json has 42-3-style narrative preambles; git HEAD has procedural preambles. Not LLM workflow output."
      );
      if (analysis.preambleExposition?.meetsAuthorialExposition) {
        entry.evidence_notes.push("Working copy passes evaluateActivityPreambleExpositionEvidence.");
      }
    } else {
      entry.evidence_notes.push(
        "Static renderer regression fixture; generation_notes or git history predate Sprint 42."
      );
      entry.evidence_notes.push("No activity_preamble fields in page JSON.");
    }

    entry.evidence_notes.push(
      "LD-AUTHORIAL-EXPOSITION affects Design Page prompts only — not stored in page JSON.",
      "LD-ACTIVITY-PREAMBLE-EXPOSITION affects DLA prompts only — artefact reflects generation that did not run."
    );

    manifest.artefacts.push(entry);
  }

  manifest.prompt_modules_at_capture = {
    authorial_marker: authorialLib.MARKER,
    preamble_marker: preambleLib.MARKER
  };

  fs.writeFileSync(path.join(outRoot, "provenance-manifest.json"), JSON.stringify(manifest, null, 2));

  fs.writeFileSync(
    path.join(outRoot, "REGENERATION-NOTICE.md"),
    [
      "# Sprint 42-4 capture notice",
      "",
      "These captures are **not** fresh LLM workflow outputs.",
      "",
      "- `page.json` — copy of committed/working fixture at capture time",
      "- `page-rendered.html` — deterministic render via `buildUtilityStructuredHtmlForTest`",
      "- `dla-prompt-snapshot.txt` / `design-page-prompt-snapshot.txt` — prompt augmentation from current `app.js` + libs",
      "- `upstream-learning-activities.json` — existing fixture where available",
      "",
      "**GAM / activity_materials JSON was not captured** — no separate material artefact exists for Marx/Climate; inflation upstream has empty materials arrays.",
      "",
      "To obtain true post-42-3 workflow artefacts, run Marx / Inflation / Climate workflows in PRISM UI after loading current code and save captures manually."
    ].join("\n")
  );

  console.log(JSON.stringify(manifest, null, 2));
}

main();
