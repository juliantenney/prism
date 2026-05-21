/**
 * Sprint 28 stabilisation — post-5d live probe capture (documentation tooling).
 * Same briefs as 28-3; adds cognition packs/contracts (5a), topology (5b),
 * DLA contract scaffold (5c), composition parity pass (5d).
 *
 * Run from repo root:
 *   node docs/development/sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/context-files/28-5d-stabilisation-probe-runner.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("node:vm");

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

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
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

function captureEo(api, wp, briefConfig, probe) {
  const b = probe.brief;
  const ex = api.extractWorkflowBriefExplicitFactors(b);
  const res = api.resolveWorkflowBriefFactors(briefConfig, ex, {}, {}, b).resolved;
  const packs = api.resolvePedagogicCognitionPackIds(briefConfig, res, ex, b);
  const contract = api.resolvePedagogicCognitionContractRequirements(
    packs,
    res,
    ex,
    briefConfig,
    b
  );
  const orch = api.resolvePedagogicCognitionOrchestrationSemantics(packs, res, ex, b);
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
    workflowBriefConfig: briefConfig,
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
  return {
    explicit: ex,
    resolved: res,
    packs,
    contract,
    orchestration: orch,
    steps: stepTitles(out),
    presentation
  };
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

function cognitionFieldAudit(api, la, contract) {
  if (!contract || !contract.active) return { fields: [], satisfied: null };
  const evalResult = api.evaluatePedagogicCognitionContractSatisfaction(
    la,
    contract,
    "dla"
  );
  return {
    required: contract.dlaFieldIds || [],
    generated: evalResult.generatedFields || [],
    missing: evalResult.missingFields || [],
    satisfied: evalResult.satisfied
  };
}

function pageParityAudit(api, page, eo, brief) {
  const semantics = api.resolvePedagogicCognitionCompositionSemantics(
    eo.packs,
    eo.contract,
    eo.resolved,
    eo.explicit,
    brief,
    {}
  );
  const sectionIds = (page.sections || []).map((s) => s.section_id);
  const laIdx = sectionIds.indexOf("learning_activities");
  const acIdx = sectionIds.indexOf("assessment_check");
  const trace =
    page.generation_notes && page.generation_notes.cognition_composition
      ? page.generation_notes.cognition_composition
      : null;
  return {
    sectionIds,
    learningActivitiesBeforeAssessment: laIdx !== -1 && acIdx !== -1 && laIdx < acIdx,
    cognitionProfile: page.metadata && page.metadata.cognition_profile,
    compositionTrace: trace,
    semantics
  };
}

async function runLiveGeneration(api, apiKey, md, probe, eo, briefConfig) {
  const b = probe.brief;
  let templates = {
    dlo:
      "Generate 3-5 learning outcomes as JSON: { learning_outcomes: [{ outcome_id, statement, level }] }. Topic from brief.",
    dla: extractPromptTemplate(md, "## 5. Design Learning Activities"),
    gam: extractPromptTemplate(md, "## 6. Generate Activity Materials"),
    gai: extractPromptTemplate(md, "## 8. Generate Assessment Items"),
    dp: extractPromptTemplate(md, "## 13. Design Page")
  };
  templates.dla = api.applyPedagogicCognitionContractScaffoldToDraft(templates.dla, {
    stepCanonicalStepId: "step_design_learning_activities",
    stepCanonicalTitle: "Design Learning Activities",
    workflowGoal: b.goal,
    workflowOutputSpec: { goal: b.goal }
  });

  const ctxHeader =
    "Workflow brief (authoritative):\nGoal: " +
    b.goal +
    "\nInputs: " +
    (b.inputs || "") +
    "\nDesired outputs: " +
    (b.desiredOutputs || "") +
    "\nCognition packs (28-5a): " +
    JSON.stringify(eo.packs) +
    "\nRequired DLA cognition fields (28-5c): " +
    JSON.stringify((eo.contract && eo.contract.dlaFieldIds) || []) +
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
    templates.dla;

  const dlaText = await callOpenAI(
    apiKey,
    "You are an LD step runner. Return JSON only unless prompt says otherwise.",
    dlaUser,
    4000
  );
  artefacts.learning_activities = parseJsonFromText(dlaText) || { raw: dlaText };
  artefacts.dlaCognitionAudit = cognitionFieldAudit(api, artefacts.learning_activities, eo.contract);

  const gamUser =
    ctxHeader +
    "\n\nUpstream learning_activities:\n" +
    JSON.stringify(artefacts.learning_activities, null, 2) +
    "\n\n---\n\n" +
    templates.gam;

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
    "\n\nUpstream learning_outcomes:\n" +
    JSON.stringify(artefacts.learning_outcomes, null, 2) +
    "\n\n---\n\n" +
    templates.gai;

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
    templates.dp;

  const dpText = await callOpenAI(
    apiKey,
    "You are an LD step runner. Return JSON only.",
    dpUser,
    6000
  );
  let page = parseJsonFromText(dpText) || { raw: dpText };
  if (page && page.artifact_type) {
    page = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
      upstreamLearningActivities: artefacts.learning_activities,
      resolvedFactors: eo.resolved,
      explicitBriefFactors: eo.explicit,
      workflowBriefConfig: briefConfig,
      base: b
    });
    page = api.applyAssessmentSemanticsToComposedPage(
      page,
      Object.assign({}, eo.resolved, eo.explicit)
    );
    artefacts.pageRaw = parseJsonFromText(dpText);
    artefacts.page = page;
    artefacts.pageParity = pageParityAudit(api, page, eo, b);
  } else {
    artefacts.page = page;
  }
  return artefacts;
}

function loadBaseline28_3(probeId) {
  const p = path.join(outDir, "probe-" + probeId.toLowerCase() + "-live.md");
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, "utf8");
}

function writeProbeMd(probe, eo, live, baselineExists) {
  const lines = [];
  lines.push("# " + probe.id + " — post-5d stabilisation probe");
  lines.push("");
  lines.push("**Captured:** " + new Date().toISOString().slice(0, 10));
  lines.push(
    "**Method:** Sprint 28-5a–5d runtime (packs, topology, DLA contracts, composition parity) + " +
      (live && !live.error
        ? "OpenAI `" + model + "` step chain with cognition scaffold and composition post-pass."
        : "**E/O architectural capture** — no API key or generation error.")
  );
  lines.push("");
  lines.push("## A. Brief (unchanged from 28-3)");
  lines.push("");
  lines.push("> " + probe.brief.goal);
  lines.push("");
  lines.push("## B. E/O + cognition architecture (28-5a/b)");
  lines.push("");
  lines.push("```json");
  lines.push(
    JSON.stringify(
      {
        explicit: eo.explicit,
        resolved: eo.resolved,
        cognition_packs: eo.packs,
        cognition_contract: eo.contract,
        orchestration: eo.orchestration,
        presentation: eo.presentation
      },
      null,
      2
    )
  );
  lines.push("```");
  lines.push("");
  lines.push("## C. Topology (O)");
  lines.push("");
  lines.push(eo.steps.join(" → "));
  lines.push("");
  if (!live || live.error) {
    lines.push("## D–G. Live generation");
    lines.push("");
    if (live && live.error) {
      lines.push("**Error:** " + live.error);
      lines.push("");
    } else {
      lines.push("**Not run** — set `OPENAI_API_KEY` in `.env.local`.");
      lines.push("");
    }
    lines.push("## H. Before vs after Sprint 28 (architectural)");
    lines.push("");
    lines.push("| Dimension | 28-3 live (pre-implementation) | Post-5d architecture |");
    lines.push("|-----------|-------------------------------|----------------------|");
    lines.push("| Cognition packs | Not resolved in E/O runner | `" + eo.packs.join("`, `") + "` |");
    lines.push(
      "| DLA typed fields | Rhetoric only | Contract requires: " +
        ((eo.contract && eo.contract.dlaFieldIds) || []).join(", ") +
        " |"
    );
    lines.push(
      "| Composition pass | LLM-only page | `applyPedagogicCognitionSemanticsToComposedPage` |"
    );
    lines.push(
      "| DLA before GAI | Brief-dependent | Topology guard when packs active |"
    );
    lines.push("");
    lines.push("**Baseline file:** " + (baselineExists ? "probe-" + probe.id.toLowerCase() + "-live.md (28-3)" : "n/a"));
    lines.push("");
    return lines.join("\n");
  }

  lines.push("## D. learning_activities + cognition fields (G / 28-5c)");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(live.learning_activities, null, 2).slice(0, 14000));
  lines.push("```");
  lines.push("");
  lines.push("**DLA contract audit:**");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(live.dlaCognitionAudit, null, 2));
  lines.push("```");
  lines.push("");
  lines.push("## E. activity_materials (G)");
  lines.push("");
  lines.push("```");
  lines.push(String(live.activity_materials.text || "").slice(0, 6000));
  lines.push("```");
  lines.push("");
  lines.push("## F. assessment_items (G)");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(live.assessment_items, null, 2).slice(0, 6000));
  lines.push("```");
  lines.push("");
  lines.push("## G. Composed page after 28-5d pass (C)");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(live.page, null, 2).slice(0, 14000));
  lines.push("```");
  lines.push("");
  if (live.pageParity) {
    lines.push("**Composition parity:**");
    lines.push("");
    lines.push("```json");
    lines.push(JSON.stringify(live.pageParity, null, 2));
    lines.push("```");
    lines.push("");
  }
  lines.push("## H. Before vs after Sprint 28");
  lines.push("");
  lines.push("| Check | 28-3 | Post-5d |");
  lines.push("|-------|------|---------|");
  const pre = baselineExists ? "See 28-3 live MD" : "n/a";
  const sectionIds =
    live.page && live.page.sections ? live.page.sections.map((s) => s.section_id).join(", ") : "—";
  lines.push("| Page section_ids | Often non-canonical | " + sectionIds + " |");
  lines.push(
    "| Cognition fields in DLA | Usually absent | satisfied=" +
      (live.dlaCognitionAudit && live.dlaCognitionAudit.satisfied) +
      " |"
  );
  lines.push(
    "| LA before assessment | Variable | " +
      (live.pageParity && live.pageParity.learningActivitiesBeforeAssessment ? "yes" : "no/na") +
      " |"
  );
  lines.push(
    "| Assessment dominance | MCQ-only pages possible | injection + reorder when packs active |"
  );
  lines.push("");
  lines.push("## I. Investigator notes");
  lines.push("");
  lines.push("- Sprint 28 adds **structural** preservation; live LLM compliance with typed fields remains variable.");
  lines.push("- Composition pass is deterministic; G outputs still depend on model + prompt adherence.");
  lines.push("- Sprint 27 assessment presentation preserved via `applyAssessmentSemanticsToComposedPage` after cognition pass.");
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const api = loadApi();
  const md = fs.readFileSync(ldPatternsPath, "utf8");
  const wp = extractLdWorkflowPolicy(md);
  const briefConfig = api.normalizeWorkflowBriefConfig(extractWorkflowBriefConfig(md));
  const apiKey = readEnvKey();
  const report = { capturedAt: new Date().toISOString(), model, sprint: "28-stabilisation", probes: [] };

  for (const probe of PROBES) {
    console.log("Capturing " + probe.id + " (post-5d)...");
    const eo = captureEo(api, wp, briefConfig, probe);
    let live = null;
    if (apiKey) {
      try {
        live = await runLiveGeneration(api, apiKey, md, probe, eo, briefConfig);
      } catch (err) {
        live = { error: String(err.message || err) };
      }
    }
    const baselineExists = fs.existsSync(
      path.join(outDir, "probe-" + probe.id.toLowerCase() + "-live.md")
    );
    report.probes.push({ id: probe.id, eo, live });
    fs.writeFileSync(
      path.join(outDir, "probe-" + probe.id.toLowerCase() + "-post-5d.md"),
      writeProbeMd(probe, eo, live, baselineExists),
      "utf8"
    );
  }

  fs.writeFileSync(
    path.join(outDir, "28-5d-stabilisation-capture.json"),
    JSON.stringify(report, null, 2),
    "utf8"
  );
  console.log("Wrote 28-5d-stabilisation-capture.json");
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
