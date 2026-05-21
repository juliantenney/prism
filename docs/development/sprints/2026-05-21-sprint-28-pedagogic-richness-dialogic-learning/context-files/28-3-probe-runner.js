/**
 * Sprint 28-3 — live workflow probe capture (documentation tooling only).
 * Uses current pack prompts + app.js E/O heuristics; optional OpenAI via .env.local.
 *
 * Run from repo root:
 *   node docs/development/sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/context-files/28-3-probe-runner.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);
const outDir = __dirname;
const model = process.env.PRISM_PROBE_MODEL || "gpt-4.1-mini";

const PROBES = [
  {
    id: "P28-01",
    brief: {
      goal:
        "Design a 60-minute seminar on climate misconceptions for undergraduate students. Small groups use rich task cards with authentic scenarios (named places, roles, and conflicting claims), discussion prompts that create productive uncertainty, and facilitator moves that respond to common learner arguments. After group work, students complete a 5-item formative check; do not reveal correct answers on the student handout — the tutor debriefs after discussion. Include contingent facilitator notes (if learners say X, ask Y) and delayed feedback guidance.",
      inputs:
        "Include facilitator notes with pacing for discussion, scenario prompts, and debrief guidance for the formative check.",
      desiredOutputs: "Learner handout page plus facilitator session notes.",
      startingArtefact: "generate_from_topic",
      selectedDomains: ["learning-design"]
    }
  },
  {
    id: "P28-02",
    brief: {
      goal:
        "Create a peer instruction session on stoichiometry: students predict answers individually, discuss in pairs with structured prompts, then revise predictions. Include 6 MCQs and reflection prompts. Confirm solutions only after pair discussion. Emphasise dialogic comparison, not silent voting.",
      inputs: "First-year chemistry; 90-minute lab session.",
      desiredOutputs: "Learner-facing session page with activities and MCQ check.",
      startingArtefact: "generate_from_topic",
      selectedDomains: ["learning-design"]
    }
  },
  {
    id: "P28-07",
    brief: {
      goal:
        "Using the provided lecture transcript on RNA viruses and hepatitis C, create dialogic learning activities (discussion prompts, misconception confrontation, pair tasks) and a short formative assessment. Do not invent facts beyond the transcript; surface uncertainty where evidence is incomplete.",
      inputs:
        "Uploaded lecture transcript excerpt:\n\nRNA viruses carry RNA genomes. Positive-sense RNA can be translated directly; negative-sense RNA requires virion polymerase. Hepatitis C virus (HCV) is a positive-sense flavivirus replicating in hepatocytes. Host microRNA-122 stabilises the HCV 5' UTR. NS5B is the RNA-dependent RNA polymerase. Many RNA viruses generate quasispecies under selection. Learners often confuse influenza segmentation with HCV, or assume HCV integrates into host DNA like retroviruses.",
      desiredOutputs: "Learner-facing page with activities and formative check.",
      startingArtefact: "provided_source_content",
      selectedDomains: ["learning-design"]
    }
  }
];

function readEnvKey() {
  const envPath = path.join(repoRoot, ".env.local");
  try {
    const raw = fs.readFileSync(envPath, "utf8");
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

function loadApi() {
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(appJsPath, "utf8"), sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function extractLdWorkflowPolicy(md) {
  const idx = md.indexOf("### Workflow Policy");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowPolicy;
}

function extractPromptTemplate(md, sectionHeading) {
  const idx = md.indexOf(sectionHeading);
  if (idx === -1) return "";
  const pf = md.indexOf("### Prompt Factory", idx);
  if (pf === -1) return "";
  const fence = md.indexOf("```json", pf);
  const close = md.indexOf("```", fence + 7);
  if (fence === -1 || close === -1) return "";
  try {
    const obj = JSON.parse(md.slice(fence + 7, close).trim());
    return String(obj.promptTemplate || "");
  } catch (_e) {
    return "";
  }
}

function stepTitles(out) {
  return (out.steps || []).map((s) => String(s.title || "").trim());
}

function captureEo(api, wp, probe) {
  const b = probe.brief;
  const ex = api.extractWorkflowBriefExplicitFactors(b);
  const res = api.resolveWorkflowBriefFactors({}, ex, {}, {}, b).resolved;
  const chain = {
    steps: [
      { title: "Normalize Content", role: "" },
      { title: "Model Knowledge", role: "" },
      { title: "Define Learning Outcomes", role: "" },
      { title: "Design Learning Activities", role: "" },
      { title: "Generate Activity Materials", role: "" },
      { title: "Generate Assessment Items", role: "" },
      { title: "Design Page", role: "" }
    ]
  };
  const out = api.applyWorkflowDesignHeuristics(JSON.parse(JSON.stringify(chain)), {
    selectedDomains: ["general", "learning-design"],
    workflowPolicy: wp,
    stepPatternCatalog: [],
    resolvedBriefFactors: Object.assign(
      {
        session_materials: ["page"],
        input_strategy: b.startingArtefact === "provided_source_content"
          ? "provided_source_content"
          : "generate_from_topic"
      },
      ex,
      res
    ),
    explicitBriefFactors: ex,
    goal: b.goal,
    inputs: b.inputs || "",
    desiredOutputs: b.desiredOutputs || "",
    startingArtefact: b.startingArtefact || ""
  });
  const presentation = api.resolveAssessmentPresentationFromBriefFactors(
    Object.assign({}, res, ex)
  );
  return { explicit: ex, resolved: res, steps: stepTitles(out), presentation };
}

function parseJsonFromText(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return null;
  let slice = trimmed;
  if (slice.startsWith("```")) {
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

async function callOpenAI(apiKey, system, user, maxTokens) {
  const body = {
    model,
    input: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    max_output_tokens: maxTokens,
    temperature: 0.4
  };
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error("OpenAI " + res.status + ": " + err.slice(0, 400));
  }
  const data = await res.json();
  const text =
    data &&
    data.output &&
    data.output[0] &&
    data.output[0].content &&
    data.output[0].content[0] &&
    data.output[0].content[0].text;
  if (typeof text !== "string") throw new Error("Unexpected OpenAI response shape");
  return text.trim();
}

async function runLiveGeneration(apiKey, md, probe, eo) {
  const b = probe.brief;
  const templates = {
    dlo:
      "Generate 3-5 learning outcomes as JSON: { learning_outcomes: [{ outcome_id, statement, level }] }. Topic from brief.",
    dla: extractPromptTemplate(md, "## 5. Design Learning Activities"),
    gam: extractPromptTemplate(md, "## 6. Generate Activity Materials"),
    gai: extractPromptTemplate(md, "## 8. Generate Assessment Items"),
    dp: extractPromptTemplate(md, "## 13. Design Page")
  };
  const ctxHeader =
    "Workflow brief (authoritative):\nGoal: " +
    b.goal +
    "\nInputs: " +
    (b.inputs || "") +
    "\nDesired outputs: " +
    (b.desiredOutputs || "") +
    "\nResolved factors (E/O): " +
    JSON.stringify(eo.resolved, null, 2);

  const artefacts = {};

  const loText = await callOpenAI(
    apiKey,
    "You are an LD step runner. Return JSON only.",
    ctxHeader + "\n\nTask: Define learning outcomes for this brief.",
    1200
  );
  artefacts.learning_outcomes = parseJsonFromText(loText) || { raw: loText };

  const dlaUser =
    ctxHeader +
    "\n\nUpstream learning_outcomes:\n" +
    JSON.stringify(artefacts.learning_outcomes, null, 2) +
    "\n\n---\n\n" +
    (templates.dla || "Design learning_activities JSON.");

  const dlaText = await callOpenAI(
    apiKey,
    "You are an LD step runner. Return JSON only unless prompt says otherwise.",
    dlaUser,
    4000
  );
  artefacts.learning_activities = parseJsonFromText(dlaText) || { raw: dlaText };

  const gamUser =
    ctxHeader +
    "\n\nUpstream learning_activities:\n" +
    JSON.stringify(artefacts.learning_activities, null, 2) +
    "\n\n---\n\n" +
    (templates.gam || "Generate activity materials text.");

  const gamText = await callOpenAI(
    apiKey,
    "You are an LD step runner. Follow the pack prompt.",
    gamUser,
    6000
  );
  artefacts.activity_materials = { text: gamText };

  const itemCount = eo.resolved.assessment_total_items || eo.explicit.assessment_total_items || 5;
  const gaiUser =
    ctxHeader +
    "\n\nConstraints: assessment_total_items=" +
    itemCount +
    "; feedback_timing=" +
    (eo.resolved.feedback_timing || eo.explicit.feedback_timing || "unset") +
    "; assessment_interaction_mode=" +
    (eo.resolved.assessment_interaction_mode || eo.explicit.assessment_interaction_mode || "unset") +
    "; learner_answer_visibility=" +
    (eo.resolved.learner_answer_visibility || eo.explicit.learner_answer_visibility || "unset") +
    "; peer_instruction_phase=" +
    (eo.resolved.peer_instruction_phase || eo.explicit.peer_instruction_phase || "unset") +
    "; misconception_assessment_link=" +
    (eo.resolved.misconception_assessment_link || eo.explicit.misconception_assessment_link || "unset") +
    "\n\nUpstream learning_outcomes:\n" +
    JSON.stringify(artefacts.learning_outcomes, null, 2) +
    "\n\n---\n\n" +
    (templates.gai || "Generate assessment_items JSON.");

  const gaiText = await callOpenAI(
    apiKey,
    "You are an LD step runner. Return JSON only.",
    gaiUser,
    5000
  );
  artefacts.assessment_items = parseJsonFromText(gaiText) || { raw: gaiText };

  const dpUser =
    ctxHeader +
    "\n\npage_profile=learner; include_answers=false for learner handout unless brief allows reveal.\n\nUpstream learning_activities:\n" +
    JSON.stringify(artefacts.learning_activities, null, 2) +
    "\n\nUpstream activity_materials (text):\n" +
    String(artefacts.activity_materials.text || "").slice(0, 12000) +
    "\n\nUpstream assessment_items:\n" +
    JSON.stringify(artefacts.assessment_items, null, 2) +
    "\n\n---\n\n" +
    (templates.dp || "Assemble page JSON.");

  const dpText = await callOpenAI(
    apiKey,
    "You are an LD step runner. Return JSON only.",
    dpUser,
    6000
  );
  artefacts.page = parseJsonFromText(dpText) || { raw: dpText };

  return artefacts;
}

function scoreHeuristic(probeId, artefacts, eo) {
  const la = artefacts.learning_activities;
  const page = artefacts.page;
  const acts =
    la && la.activities
      ? la.activities
      : la && la.raw
      ? []
      : [];
  const fm = (acts[0] && acts[0].facilitator_moves) || "";
  const hasIfThen = /\bif learners?\b/i.test(JSON.stringify(la)) || /\bif learners?\b/i.test(fm);
  const hasRevise = /\brevise\b/i.test(JSON.stringify(artefacts));
  const pageSections =
    page && page.sections ? page.sections.map((s) => s.section_id) : [];
  const hasLaSection = pageSections.includes("learning_activities");
  const hasAssess = pageSections.includes("assessment_check");
  const itemCount =
    page && page.sections
      ? page.sections
          .filter((s) => s.section_id === "assessment_check")
          .reduce((n, s) => n + ((s.content && s.content.items && s.content.items.length) || 0), 0)
      : 0;
  const rubric = {
    D1: acts.length && /scenario|role|place|stakeholder/i.test(JSON.stringify(acts)) ? 1 : 0,
    D2: acts.length ? 1 : 0,
    D3: /uncertain|conflict|disagree|tension/i.test(JSON.stringify(artefacts)) ? 1 : 2,
    D4: /discuss|pair|compare|argue/i.test(JSON.stringify(artefacts)) ? 1 : 2,
    D5: /misconception|false claim|myth/i.test(JSON.stringify(artefacts)) ? 1 : 2,
    D6: hasIfThen ? 1 : 0,
    D7: /common error|partial understanding|anticipated/i.test(JSON.stringify(artefacts)) ? 1 : 0,
    D8: acts.length > 1 ? 1 : 0,
    D9:
      probeId === "P28-02" && /predict|revise|pair/i.test(JSON.stringify(artefacts))
        ? hasRevise
          ? 1
          : 0
        : 0,
    D10: hasLaSection && hasAssess ? 2 : hasAssess && !hasLaSection ? 0 : 1
  };
  const nums = Object.keys(rubric)
    .filter((k) => k.startsWith("D"))
    .map((k) => rubric[k]);
  rubric.mean = Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
  rubric.pageSections = pageSections;
  rubric.assessmentItemCountOnPage = itemCount;
  rubric.facilitator_moves_sample = String(fm).slice(0, 500);
  return rubric;
}

function writeProbeMd(probe, eo, live, rubric) {
  const lines = [];
  lines.push("# " + probe.id + " — live workflow probe (28-3)");
  lines.push("");
  lines.push("**Captured:** " + new Date().toISOString().slice(0, 10));
  lines.push("**Method:** Pack prompt templates + `extractWorkflowBriefExplicitFactors` / heuristics; " + (live ? "OpenAI `" + model + "` step chain (DLA→GAM→GAI→Design Page)." : "**E/O only** — no API key."));
  lines.push("");
  lines.push("## A. Exact brief");
  lines.push("");
  lines.push("**Goal:**");
  lines.push("");
  lines.push("> " + probe.brief.goal);
  lines.push("");
  lines.push("**Inputs:** " + (probe.brief.inputs || "(empty)"));
  lines.push("");
  lines.push("**Desired outputs:** " + probe.brief.desiredOutputs);
  lines.push("");
  lines.push("## B. Resolved factors (E)");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify({ explicit: eo.explicit, resolved: eo.resolved, presentation: eo.presentation }, null, 2));
  lines.push("```");
  lines.push("");
  lines.push("## C. Topology (O)");
  lines.push("");
  lines.push(eo.steps.join(" → "));
  lines.push("");
  if (!live) {
    lines.push("## D–H. Live generation");
    lines.push("");
    lines.push("**Not run** — set `OPENAI_API_KEY` in repo-root `.env.local` and re-run runner.");
    lines.push("");
    return lines.join("\n");
  }
  lines.push("## D. learning_activities (G)");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(live.learning_activities, null, 2).slice(0, 12000));
  lines.push("```");
  lines.push("");
  lines.push("## E. activity_materials (G)");
  lines.push("");
  lines.push("```");
  lines.push(String(live.activity_materials.text || "").slice(0, 8000));
  lines.push("```");
  lines.push("");
  lines.push("## F. assessment_items (G)");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(live.assessment_items, null, 2).slice(0, 8000));
  lines.push("```");
  lines.push("");
  lines.push("## G. Composed page (C)");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(live.page, null, 2).slice(0, 12000));
  lines.push("```");
  lines.push("");
  if (live.page && live.page.sections) {
    lines.push("**Section IDs:** " + live.page.sections.map((s) => s.section_id).join(", "));
    lines.push("");
  }
  lines.push("## I. Render (R)");
  lines.push("");
  lines.push("**Not captured** in 28-3 runner (composition JSON only). Use PRISM run mode + `buildUtilityStructuredHtmlForTest` for HTML.");
  lines.push("");
  lines.push("## J. Rubric (live heuristic)");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(rubric, null, 2));
  lines.push("```");
  lines.push("");
  lines.push("## Investigator interpretation");
  lines.push("");
  lines.push("(See sprint pack matrix / review-log R28-017.)");
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const api = loadApi();
  const wp = extractLdWorkflowPolicy(fs.readFileSync(ldPatternsPath, "utf8"));
  const md = fs.readFileSync(ldPatternsPath, "utf8");
  const apiKey = readEnvKey();
  const report = { capturedAt: new Date().toISOString(), model, probes: [] };

  for (const probe of PROBES) {
    console.log("Capturing " + probe.id + "...");
    const eo = captureEo(api, wp, probe);
    let live = null;
    let rubric = null;
    if (apiKey) {
      try {
        live = await runLiveGeneration(apiKey, md, probe, eo);
        rubric = scoreHeuristic(probe.id, live, eo);
      } catch (err) {
        live = { error: String(err.message || err) };
      }
    }
    const entry = { id: probe.id, eo, live, rubric };
    report.probes.push(entry);
    fs.writeFileSync(
      path.join(outDir, "probe-" + probe.id.toLowerCase() + "-live.md"),
      writeProbeMd(probe, eo, live, rubric || {}),
      "utf8"
    );
  }

  fs.writeFileSync(path.join(outDir, "28-3-probe-capture.json"), JSON.stringify(report, null, 2), "utf8");
  console.log("Wrote " + path.join(outDir, "28-3-probe-capture.json"));
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
