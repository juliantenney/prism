/**
 * Sprint 30 Phase 1–2 — live Factory validation (P30-01, P30-02).
 * Pack prompts + applyWorkflowStepRuntimePromptAugmentations + composition merge + render.
 * Phase 2: reasoning_contract evaluation via evaluatePelReasoningContractSatisfaction.
 *
 * Run from repo root:
 *   node docs/development/sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/sprint-30-probe-runner.js
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
const outDir = path.join(__dirname);
const artefactDir = path.join(outDir, "live-artefacts");
const model = process.env.PRISM_PROBE_MODEL || "gpt-4.1-mini";

const ORIENTATION_FIELDS = [
  "study_orientation",
  "intellectual_frame",
  "intellectual_coherence_bridge",
  "activity_preamble"
];

const REASONING_FIELDS = [
  "reasoning_orientation",
  "evidence_use_prompt",
  "argument_structure_hint",
  "self_explanation_prompt",
  "conceptual_contrast_prompt",
  "disciplinary_lens"
];

const PROBES = [
  {
    id: "P30-01",
    slug: "marx",
    mdOut: "probe-p30-01-marx-live.md",
    brief: {
      goal:
        "Create a self-directed learning page on Karl Marx covering life phases, cause-effect links, comparison of major works, and application of core concepts.",
      inputs: "Undergraduate (self-directed study)",
      desiredOutputs: "Learner-facing page",
      selectedDomains: ["learning-design"]
    }
  },
  {
    id: "P30-02",
    slug: "rna",
    mdOut: "probe-p30-02-rna-live.md",
    brief: {
      goal:
        "create a one hour self-study session for undergraduate students based on uploaded transcript",
      inputs:
        "Uploaded lecture transcript on RNA viruses and hepatitis C (HCV).\n\nTranscript excerpt:\n\nRNA viruses carry RNA genomes. Positive-sense RNA can be translated directly; negative-sense RNA requires virion polymerase. Hepatitis C virus (HCV) is a positive-sense flavivirus replicating in hepatocytes. Host microRNA-122 stabilises the HCV 5' UTR. NS5B is the RNA-dependent RNA polymerase. Many RNA viruses generate quasispecies under selection. Learners often confuse influenza segmentation with HCV, or assume HCV integrates into host DNA like retroviruses.",
      desiredOutputs: "Learner-facing page",
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

function extractJsonBlock(md, heading) {
  const idx = md.indexOf(heading);
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim());
}

function extractPromptTemplate(md, sectionHeading) {
  const idx = md.indexOf(sectionHeading);
  if (idx === -1) return "";
  const pf = md.indexOf("### Prompt Factory", idx);
  const fence = md.indexOf("```json", pf);
  const close = md.indexOf("```", fence + 7);
  if (fence === -1 || close === -1) return "";
  try {
    return String(JSON.parse(md.slice(fence + 7, close).trim()).promptTemplate || "");
  } catch (_e) {
    return "";
  }
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
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey
    },
    body: JSON.stringify({
      model,
      input: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      max_output_tokens: maxTokens,
      temperature: 0.35
    })
  });
  if (!res.ok) throw new Error("OpenAI " + res.status + ": " + (await res.text()).slice(0, 500));
  const data = await res.json();
  const text =
    data?.output?.[0]?.content?.[0]?.text;
  if (typeof text !== "string") throw new Error("Unexpected OpenAI response shape");
  return text.trim();
}

function captureEo(api, ldConfig, wp, probe) {
  const b = probe.brief;
  const explicit = api.extractWorkflowBriefExplicitFactors(b);
  const inferred = api.applyWorkflowBriefInferenceRules(ldConfig, b.goal, b.inputs);
  const resolved = api.resolveWorkflowBriefFactors(
    ldConfig,
    explicit,
    {},
    inferred,
    b
  ).resolved;
  const chain = {
    steps: [
      { title: "Normalize Content", role: "" },
      { title: "Model Knowledge", role: "" },
      { title: "Define Learning Outcomes", role: "" },
      { title: "Design Learning Activities", role: "" },
      { title: "Generate Activity Materials", role: "" },
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
        input_strategy:
          b.startingArtefact === "provided_source_content"
            ? "provided_source_content"
            : resolved.input_strategy || "generate_from_topic"
      },
      explicit,
      resolved
    ),
    explicitBriefFactors: explicit,
    goal: b.goal,
    inputs: b.inputs || "",
    desiredOutputs: b.desiredOutputs || "",
    startingArtefact: b.startingArtefact || ""
  });
  return {
    explicit,
    resolved,
    inferred,
    steps: (out.steps || []).map((s) => String(s.title || "").trim())
  };
}

function buildAugmentedPrompt(api, probe, eo, template, stepId, stepTitle) {
  const b = probe.brief;
  const wf = {
    goal: b.goal,
    inputs: b.inputs || "",
    desiredOutputs: b.desiredOutputs,
    startingArtefact: b.startingArtefact || "",
    workflowOutputSpec: { goal: b.goal, desiredOutputs: b.desiredOutputs },
    workflowOutputs: [b.desiredOutputs],
    workflowBriefResolution: { resolvedFactors: eo.resolved }
  };
  const step = {
    title: stepTitle,
    canonical_step_id: stepId,
    canonical_title: stepTitle
  };
  return api.applyWorkflowStepRuntimePromptAugmentations(template, step, wf);
}

function listActivities(la) {
  if (!la) return [];
  if (Array.isArray(la.activities)) return la.activities;
  if (Array.isArray(la)) return la;
  return [];
}

function orientationSnapshot(activities) {
  return activities.map((a) => {
    const row = { activity_id: a.activity_id, title: a.title };
    ORIENTATION_FIELDS.forEach((f) => {
      if (a[f] != null && String(a[f]).trim()) row[f] = String(a[f]).trim();
    });
    if (a.facilitator_moves) row.facilitator_moves = String(a.facilitator_moves).slice(0, 200);
    return row;
  });
}

function reasoningSnapshot(activities) {
  return activities.map((a) => {
    const row = { activity_id: a.activity_id, title: a.title };
    if (a.learner_task) row.learner_task = String(a.learner_task).trim().slice(0, 120) + "…";
    REASONING_FIELDS.forEach((f) => {
      if (a[f] != null && String(a[f]).trim()) row[f] = String(a[f]).trim();
    });
    return row;
  });
}

function htmlReasoningMarkers(html) {
  const h = String(html || "");
  return {
    howToThink: /How to think:/i.test(h),
    reflectCognition: /Reflect<\/div>|data-cognition-field="self_explanation_prompt"/i.test(h),
    evidenceUse: /evidence_use_prompt|Evidence use:/i.test(h),
    argumentHint: /argument_structure_hint|Argument structure:/i.test(h),
    conceptualContrast: /conceptual_contrast_prompt|Conceptual contrast:/i.test(h),
    disciplinaryLens: /disciplinary_lens|Disciplinary lens:/i.test(h)
  };
}

function pageActivityOrientation(page) {
  const rows = [];
  if (!page?.sections) return rows;
  page.sections.forEach((s) => {
    if (s.section_id !== "learning_activities") return;
    const content = s.content;
    const acts = Array.isArray(content) ? content : content?.activities || [];
    acts.forEach((a) => {
      const row = { activity_id: a.activity_id, title: a.title };
      ORIENTATION_FIELDS.forEach((f) => {
        if (a[f] != null && String(a[f]).trim()) row[f] = String(a[f]).trim();
      });
      rows.push(row);
    });
  });
  return rows;
}

function listPageLearningActivityRows(page) {
  const rows = [];
  if (!page?.sections) return rows;
  page.sections.forEach((s) => {
    const sid = String(s.section_id || "").toLowerCase();
    const heading = String(s.heading || "").toLowerCase();
    if (sid !== "learning_activities" && !/learning activities/.test(heading)) return;
    const content = s.content;
    const acts = Array.isArray(content) ? content : content?.activities || [];
    acts.forEach((a) => rows.push(a));
  });
  return rows;
}

function supportNoteLooksChoreographic(text) {
  const s = String(text || "");
  if (!s.trim()) return false;
  return (
    /\b(facilitator|teacher notes|instructor guidance|tutor notes|tutor guidance)\b/i.test(s) ||
    /\bcirculate\b/i.test(s) ||
    /\bask students to share\b/i.test(s) ||
    /\bin pairs\b/i.test(s) ||
    /\bsmall groups?\b/i.test(s) ||
    /\bminutes?\s+\d+\s*[-–]\s*\d+\b/i.test(s) ||
    /\bduring class\b/i.test(s)
  );
}

function auditLearnerPageActivityRowSanitization(page, html) {
  const rows = listPageLearningActivityRows(page);
  const facilitatorNotesOnRows = rows.some(
    (a) =>
      (a.facilitator_notes != null && String(a.facilitator_notes).trim()) ||
      (a.facilitator_note != null && String(a.facilitator_note).trim())
  );
  const choreoSupportNote = rows.some(
    (a) =>
      supportNoteLooksChoreographic(a.support_note) ||
      supportNoteLooksChoreographic(a.support_notes)
  );
  const htmlBlob = String(html || "");
  const supportNoteFromFacilitatorAlias =
    facilitatorNotesOnRows && /<aside class="util-support-note"/i.test(htmlBlob);
  const choreoSupportNoteHtml =
    choreoSupportNote &&
    /\butil-support-note[\s\S]*\b(circulate|ask students to share|in pairs|small groups?)\b/i.test(
      htmlBlob
    );
  return {
    facilitatorNotesOnRows,
    choreoSupportNote,
    supportNoteFromFacilitatorAlias,
    choreoSupportNoteHtml,
    clean:
      !facilitatorNotesOnRows && !choreoSupportNote && !supportNoteFromFacilitatorAlias
  };
}

function evaluateRubric(probeId, dlaActs, pageActs, html) {
  const blob = JSON.stringify({ dlaActs, pageActs, html }).toLowerCase();
  const welcome = /\bwelcome to this module\b/i.test(blob);
  const inSession = /\bin this session\b/i.test(blob);
  const minutesChoreo = /\bminutes?\s+\d+|\bminute\s+\d+/i.test(blob);
  const uploadedOnly = /\bthe uploaded transcript\b/i.test(blob);
  const rnaTopic = /rna virus|hepatitis c|hcv|ns5b|microRNA-122/i.test(blob);

  let studyCount = 0;
  let bridgeCount = 0;
  let preambleCount = 0;
  dlaActs.forEach((a) => {
    if (a.study_orientation) studyCount += 1;
    if (a.intellectual_coherence_bridge) bridgeCount += 1;
    if (a.activity_preamble) preambleCount += 1;
  });

  const rubric = {
    purpose_clear_quickly:
      studyCount > 0 || (preambleCount >= Math.max(1, Math.floor(dlaActs.length / 2)) ? "Yes" : "Partial"),
    sequentially_connected: bridgeCount >= 1 || dlaActs.length <= 1 ? (bridgeCount >= 1 ? "Yes" : "Partial") : "No",
    no_facilitator_choreography:
      !minutesChoreo && !/\bfacilitator_moves\b/i.test(JSON.stringify(dlaActs).slice(0, 3000))
        ? "Yes"
        : "No",
    topic_specific:
      probeId === "P30-02"
        ? rnaTopic && !uploadedOnly
          ? "Yes"
          : uploadedOnly
            ? "No"
            : "Partial"
        : /marx|bourgeoisie|proletariat|manifesto|class struggle/i.test(blob)
          ? "Yes"
          : "Partial",
    bridges_useful_not_boilerplate:
      bridgeCount > 0 && !/previous activity\./i.test(blob) ? "Yes" : bridgeCount === 0 ? "N/A" : "Partial"
  };

  return {
    rubric,
    anti_patterns: { welcome, inSession, minutesChoreo, uploadedOnly },
    counts: { studyCount, bridgeCount, preambleCount, activityCount: dlaActs.length },
    htmlHasStudyOrientation: /Study orientation:/i.test(html),
    htmlHasIntellectualFrame: /Intellectual frame:/i.test(html),
    htmlHasBridge: /Connection to previous activity:/i.test(html)
  };
}

async function runProbe(api, ldConfig, md, wp, apiKey, probe, eo) {
  const ctxHeader =
    "Workflow brief:\nGoal: " +
    probe.brief.goal +
    "\nInputs: " +
    (probe.brief.inputs || "") +
    "\nDesired outputs: " +
    probe.brief.desiredOutputs +
    "\nResolved factors:\n" +
    JSON.stringify(eo.resolved, null, 2);

  const dlaTemplate = extractPromptTemplate(md, "## 5. Design Learning Activities");
  const gamTemplate = extractPromptTemplate(md, "## 6. Generate Activity Materials");
  const dpTemplate = extractPromptTemplate(md, "## 13. Design Page");

  const dlaPrompt = buildAugmentedPrompt(
    api,
    probe,
    eo,
    dlaTemplate,
    "step_design_learning_activities",
    "Design Learning Activities"
  );
  const dpPrompt = buildAugmentedPrompt(
    api,
    probe,
    eo,
    dpTemplate,
    "step_design_page",
    "Design Page"
  );

  const loText = await callOpenAI(
    apiKey,
    "Return JSON only.",
    ctxHeader + "\n\nTask: Define 3-4 learning_outcomes as JSON { learning_outcomes: [...] }.",
    1200
  );
  const learning_outcomes = parseJsonFromText(loText) || { raw: loText };

  const dlaText = await callOpenAI(
    apiKey,
    "Return JSON only for learning_activities.",
    ctxHeader +
      "\n\nUpstream learning_outcomes:\n" +
      JSON.stringify(learning_outcomes, null, 2) +
      "\n\n---\n\n" +
      dlaPrompt,
    4500
  );
  const learning_activities = parseJsonFromText(dlaText) || { raw: dlaText };

  const gamPrompt = buildAugmentedPrompt(
    api,
    probe,
    eo,
    gamTemplate,
    "step_generate_activity_materials",
    "Generate Activity Materials"
  );

  let gamText = await callOpenAI(
    apiKey,
    "Follow the pack prompt; return learner-facing materials text.",
    ctxHeader +
      "\n\nUpstream learning_activities:\n" +
      JSON.stringify(learning_activities, null, 2) +
      "\n\n---\n\n" +
      gamPrompt,
    5500
  );
  const gamSanitizeCtx = {
    workflowGoal: probe.brief.goal,
    desiredOutputs: probe.brief.desiredOutputs,
    workflowInputs: probe.brief.inputs || "",
    stepCanonicalStepId: "step_generate_activity_materials",
    stepCanonicalTitle: "Generate Activity Materials",
    workflowBriefResolution: { resolvedFactors: eo.resolved },
    upstreamActivities: listActivities(learning_activities)
  };
  const gamSanitized = api.sanitizeSelfDirectedGamMaterialsOutput(gamText, gamSanitizeCtx);
  gamText = String(gamSanitized.text != null ? gamSanitized.text : gamText);

  const dpText = await callOpenAI(
    apiKey,
    "Return JSON only for composed learner page.",
    ctxHeader +
      "\n\npage_profile=learner; preserve all activity_preamble and orientation fields from upstream.\n\nUpstream learning_activities:\n" +
      JSON.stringify(learning_activities, null, 2) +
      "\n\nUpstream activity_materials (excerpt):\n" +
      String(gamText).slice(0, 10000) +
      "\n\n---\n\n" +
      dpPrompt,
    6500
  );
  let page = parseJsonFromText(dpText) || { raw: dpText };

  if (page && page.sections) {
    page = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
      upstreamLearningActivities: learning_activities,
      resolvedFactors: eo.resolved,
      explicitBriefFactors: eo.explicit,
      workflowBriefConfig: ldConfig,
      base: probe.brief
    });
  }

  const render = page?.sections
    ? api.buildUtilityStructuredHtmlForTest(page)
    : { error: "no page sections" };
  const html = render?.html ? String(render.html) : "";

  const dlaActs = listActivities(learning_activities);
  const evalResult = evaluateRubric(probe.id, dlaActs, pageActivityOrientation(page), html);
  const reasoningEvalOpts = {
    sourceBrief: probe.brief.startingArtefact === "provided_source_content",
    inputStrategy: eo.resolved.input_strategy || eo.explicit.input_strategy,
    startingArtefact: probe.brief.startingArtefact,
    gamText: gamText,
    page: page
  };
  const reasoningEval = api.evaluatePelReasoningContractSatisfaction(learning_activities, reasoningEvalOpts);
  const orientationEval = api.evaluatePelOrientationContractSatisfaction(learning_activities, {
    page,
    gamText
  });
  const gamBlob = String(gamText).toLowerCase();
  const phase2Heuristics = {
    facilitatorUse: /\bfacilitator use:/i.test(gamBlob),
    teacherNotes: /\bteacher notes\b/i.test(gamBlob),
    minutesChoreo: /\bminutes?\s+\d+|\bminute\s+\d+/i.test(gamBlob),
    thinkCritically: /\bthink critically\b/i.test(JSON.stringify(dlaActs).toLowerCase()),
    beforeReread:
      /\bbefore you re-read\b|\bwithout looking back\b|\bbefore checking\b/i.test(gamBlob) ||
      /\bbefore you re-read\b|\bwithout looking back\b/i.test(JSON.stringify(dlaActs).toLowerCase()),
    workedExample:
      /\bworked example\b|\bsample row\b|\bexample:\b|\be\.g\.\s*["']/i.test(gamBlob) ||
      /\|\s*[^|]+\s*\|\s*[^|]+\s*\|/.test(gamBlob.slice(0, 8000))
  };
  const htmlMarkers = htmlReasoningMarkers(html);
  const pageRowSanitization = auditLearnerPageActivityRowSanitization(page, html);

  return {
    prompts: {
      dlaHasPelOrientation: /pedagogic enrichment — orientation contract/i.test(dlaPrompt),
      dlaHasPelReasoning: /pedagogic enrichment — reasoning contract/i.test(dlaPrompt),
      gamHasPelReasoning: /pedagogic enrichment — reasoning contract/i.test(gamPrompt),
      gamHasReasoningMaterials: /self-directed learner-page reasoning materials/i.test(gamPrompt),
      gamHasVoiceGuard: /self-directed learner-page material voice/i.test(gamPrompt),
      dpHasPel: /pedagogic enrichment — orientation contract/i.test(dpPrompt),
      dpHasPelReasoning: /pedagogic enrichment — reasoning contract/i.test(dpPrompt)
    },
    learning_outcomes,
    learning_activities,
    activity_materials: { text: gamText },
    page,
    html,
    htmlExcerpt: html.slice(0, 6000),
    dlaOrientation: orientationSnapshot(dlaActs),
    pageOrientation: pageActivityOrientation(page),
    dlaReasoning: reasoningSnapshot(dlaActs),
    evaluation: evalResult,
    reasoningEval,
    orientationEval,
    phase2Heuristics,
    htmlMarkers,
    pageRowSanitization
  };
}

function compareFixtures(repoRoot, probeSlug, dlaOrientation) {
  const proceduralPath = path.join(
    repoRoot,
    "tests/fixtures/workflow-brief/marx-dla-procedural-output.json"
  );
  const marxPagePath = path.join(repoRoot, "tests/fixtures/page-render/marx-self-study-page.json");
  if (probeSlug !== "marx") return { note: "RNA — no pre-30-1 Marx fixture pair" };
  const procedural = JSON.parse(fs.readFileSync(proceduralPath, "utf8"));
  const oldPage = JSON.parse(fs.readFileSync(marxPagePath, "utf8"));
  const procActs = procedural.activities || [];
  const procPreambles = procActs.filter((a) => a.activity_preamble).length;
  const procFac = procActs.filter((a) => a.facilitator_moves).length;
  const newPreambles = dlaOrientation.filter((a) => a.activity_preamble).length;
  const newStudy = dlaOrientation.filter((a) => a.study_orientation).length;
  const newBridge = dlaOrientation.filter((a) => a.intellectual_coherence_bridge).length;
  return {
    marx_dla_procedural: {
      activities: procActs.length,
      activity_preamble_count: procPreambles,
      facilitator_moves_count: procFac,
      orientation_fields: 0
    },
    live_dla: {
      activities: dlaOrientation.length,
      activity_preamble_count: newPreambles,
      study_orientation_count: newStudy,
      intellectual_coherence_bridge_count: newBridge
    },
    marx_self_study_page_fixture: {
      activities_in_page: (oldPage.sections?.[1]?.content || oldPage.sections?.[0]?.content || []).length,
      had_framing_fields: false
    },
    qualitative:
      "Live DLA should show more framing/orientation than marx-dla-procedural-output.json; compare HTML for learner-visible coherence."
  };
}

function phase2RubricScores(probeId, live) {
  const acts = live.dlaReasoning || [];
  const blob = JSON.stringify(acts).toLowerCase();
  const gam = String(live.activity_materials?.text || "").toLowerCase();
  const roCount = acts.filter((a) => a.reasoning_orientation).length;
  const evCount = acts.filter((a) => a.evidence_use_prompt).length;
  const argCount = acts.filter((a) => a.argument_structure_hint).length;
  const ccCount = acts.filter((a) => a.conceptual_contrast_prompt).length;
  const genericRo = acts.some((a) =>
    a.reasoning_orientation && /\bthink critically|analyse the topic carefully\b/i.test(a.reasoning_orientation)
  );
  const topicOk =
    probeId === "P30-02"
      ? /hcv|hepatitis|ns5b|mir-122|rna virus|quasispecies/i.test(blob)
      : /marx|manifesto|kapital|bourgeois|proletariat|class struggle/i.test(blob);
  return {
    thinking_visible:
      roCount >= 2 && !genericRo && topicOk ? "Yes" : roCount >= 1 ? "Partial" : "No",
    evidence_discipline:
      probeId === "P30-02"
        ? evCount >= 1 && topicOk
          ? "Yes"
          : evCount >= 1
            ? "Partial"
            : "No"
        : evCount >= 1
          ? "Partial"
          : "N/A",
    argument_structure: argCount >= 1 ? "Yes" : "Partial",
    conceptual_contrast: ccCount >= 1 ? "Yes" : "Partial",
    generative_retrieval: live.phase2Heuristics.beforeReread ? "Yes" : "Partial",
    gam_worked_support: live.phase2Heuristics.workedExample ? "Partial" : "No",
    redundancy:
      (live.reasoningEval?.missingFields || []).includes("reasoning_field_duplication")
        ? "Partial"
        : "Yes",
    facilitator_regression:
      live.phase2Heuristics.facilitatorUse ||
      live.phase2Heuristics.minutesChoreo ||
      live.pageRowSanitization?.facilitatorNotesOnRows ||
      live.pageRowSanitization?.choreoSupportNote
        ? "No"
        : "Yes"
  };
}

function writeLiveMd(probe, eo, live, compare, apiKeyPresent) {
  const lines = [];
  lines.push("# " + probe.id + " — Factory live validation (Sprint 30 Phase 2)");
  lines.push("");
  lines.push("**Captured:** " + new Date().toISOString().slice(0, 19) + "Z");
  lines.push(
    "**Method:** LD pack prompts + `applyWorkflowStepRuntimePromptAugmentations` (cognition → self-directed → PEC) + OpenAI `" +
      model +
      "` + `applyPedagogicCognitionSemanticsToComposedPage` + `buildUtilityStructuredHtmlForTest`."
  );
  lines.push("");
  if (!apiKeyPresent) {
    lines.push("## Live generation");
    lines.push("");
    lines.push("**Not run** — set `OPENAI_API_KEY` in repo-root `.env.local` and re-run runner.");
    lines.push("");
    return lines.join("\n");
  }
  if (live?.error) {
    lines.push("## Live generation error");
    lines.push("");
    lines.push("```");
    lines.push(live.error);
    lines.push("```");
    return lines.join("\n");
  }

  lines.push("## 1. Brief");
  lines.push("");
  lines.push("| Field | Value |");
  lines.push("|-------|--------|");
  lines.push("| Goal | " + probe.brief.goal.replace(/\|/g, "\\|") + " |");
  lines.push("| Inputs | " + String(probe.brief.inputs || "").slice(0, 200).replace(/\n/g, " ") + " |");
  lines.push("| Outputs | " + probe.brief.desiredOutputs + " |");
  if (probe.brief.startingArtefact) {
    lines.push("| Starting artefact | " + probe.brief.startingArtefact + " |");
  }
  lines.push("");

  lines.push("## 2. Resolved factors");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify({ explicit: eo.explicit, resolved: eo.resolved }, null, 2));
  lines.push("```");
  lines.push("");

  lines.push("## 3. Workflow topology");
  lines.push("");
  lines.push(eo.steps.join(" → "));
  lines.push("");
  lines.push(
    "Runtime PEC in prompts: DLA orientation=" +
      live.prompts.dlaHasPelOrientation +
      ", DLA reasoning=" +
      live.prompts.dlaHasPelReasoning +
      ", GAM reasoning=" +
      live.prompts.gamHasPelReasoning +
      ", Design Page orientation=" +
      live.prompts.dpHasPel +
      " (reasoning block on DP=" +
      live.prompts.dpHasPelReasoning +
      ")"
  );
  lines.push("");

  lines.push("## 4. DLA reasoning fields (Phase 2)");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(live.dlaReasoning, null, 2));
  lines.push("```");
  lines.push("");
  lines.push("**Evaluator (`evaluatePelReasoningContractSatisfaction`):**");
  lines.push("");
  lines.push("```json");
  lines.push(
    JSON.stringify(
      {
        satisfied: live.reasoningEval.satisfied,
        missingFields: live.reasoningEval.missingFields,
        warnings: live.reasoningEval.warnings,
        counts: {
          reasoningOrientationCount: live.reasoningEval.reasoningOrientationCount,
          evidencePromptCount: live.reasoningEval.evidencePromptCount,
          argumentHintCount: live.reasoningEval.argumentHintCount,
          contrastPromptCount: live.reasoningEval.contrastPromptCount,
          selfExplanationCount: live.reasoningEval.selfExplanationCount
        }
      },
      null,
      2
    )
  );
  lines.push("```");
  lines.push("");

  lines.push("## 5. GAM materials excerpt");
  lines.push("");
  lines.push("**Artefact:** `live-artefacts/" + probe.slug + "-activity-materials.txt`");
  lines.push("");
  lines.push("```");
  lines.push(String(live.activity_materials?.text || "").slice(0, 3500));
  lines.push("```");
  lines.push("");
  lines.push("GAM heuristics: " + JSON.stringify(live.phase2Heuristics));
  lines.push("");
  lines.push(
    "Page row sanitization (30-2c): " +
      JSON.stringify(live.pageRowSanitization || { clean: true })
  );
  lines.push("");

  lines.push("## 6. DLA orientation fields");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(live.dlaOrientation, null, 2));
  lines.push("```");
  lines.push("");

  lines.push("## 7. Composed page orientation fields (post-merge)");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(live.pageOrientation, null, 2));
  lines.push("```");
  lines.push("");

  lines.push("## 8. Rendered HTML excerpt");
  lines.push("");
  lines.push("```html");
  lines.push(live.htmlExcerpt);
  lines.push("```");
  lines.push("");
  lines.push(
    "Render markers (orientation): Study orientation=" +
      live.evaluation.htmlHasStudyOrientation +
      "; Intellectual frame=" +
      live.evaluation.htmlHasIntellectualFrame +
      "; Connection=" +
      live.evaluation.htmlHasBridge
  );
  lines.push(
    "Render markers (reasoning): How to think=" +
      live.htmlMarkers.howToThink +
      "; self_explanation cognition=" +
      live.htmlMarkers.reflectCognition +
      "; evidence_use_prompt=" +
      live.htmlMarkers.evidenceUse +
      "; argument_structure_hint=" +
      live.htmlMarkers.argumentHint +
      "; conceptual_contrast_prompt=" +
      live.htmlMarkers.conceptualContrast +
      "; disciplinary_lens=" +
      live.htmlMarkers.disciplinaryLens
  );
  lines.push("");

  lines.push("## 9. Slice 30-2 rubric (Phase 2 — live)");
  lines.push("");
  lines.push("| Criterion | Score | Notes |");
  lines.push("|-----------|-------|-------|");
  const p2 = phase2RubricScores(probe.id, live);
  Object.entries(p2).forEach(([k, v]) => {
    lines.push("| " + k.replace(/_/g, " ") + " | **" + v + "** | |");
  });
  lines.push("");

  lines.push("## 10. Slice 30-1 rubric (orientation — live)");
  lines.push("");
  lines.push("| Criterion | Score |");
  lines.push("|-----------|-------|");
  Object.entries(live.evaluation.rubric).forEach(([k, v]) => {
    lines.push("| " + k.replace(/_/g, " ") + " | " + v + " |");
  });
  lines.push("");
  lines.push("Anti-patterns detected: " + JSON.stringify(live.evaluation.anti_patterns));
  lines.push("Field counts: " + JSON.stringify(live.evaluation.counts));
  lines.push("");

  lines.push("## 11. Comparison vs pre-30-1 fixtures");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(compare, null, 2));
  lines.push("```");
  lines.push("");

  lines.push("## 12. Layer verdict");
  lines.push("");
  lines.push("| Layer | Verdict |");
  lines.push("|-------|---------|");
  lines.push("| E | ✅ |");
  lines.push(
    "| G (orientation) | " +
      (live.prompts.dlaHasPelOrientation && live.evaluation.counts.preambleCount > 0 ? "✅" : "⚠️") +
      " |"
  );
  lines.push(
    "| G (reasoning) | " +
      (live.prompts.dlaHasPelReasoning && live.reasoningEval.reasoningOrientationCount >= 1 ? "✅" : "⚠️") +
      " |"
  );
  lines.push("| C | " + (live.pageOrientation.length ? "✅" : "⚠️") + " |");
  lines.push(
    "| R (orientation) | " +
      (live.evaluation.htmlHasStudyOrientation || live.evaluation.htmlHasBridge ? "✅" : "⚠️") +
      " |"
  );
  lines.push(
    "| R (reasoning JSON→HTML) | " +
      (live.htmlMarkers.howToThink ? "⚠️ partial" : "⚠️ gap") +
      " — see visibility assessment |"
  );
  lines.push("");

  lines.push("## 13. Visibility gap assessment");
  lines.push("");
  lines.push(live.visibilityNote || "(See capture JSON visibilityNote)");
  lines.push("");

  lines.push("## 14. Weaknesses / next slice (proposal only)");
  lines.push("");
  lines.push(live.weaknessNote || "(See sprint-30-probe-capture.json weaknessNotes)");
  lines.push("");

  return lines.join("\n");
}

function visibilityGapNote(live) {
  const m = live.htmlMarkers;
  const inJson =
    (live.reasoningEval?.evidencePromptCount || 0) > 0 ||
    (live.reasoningEval?.argumentHintCount || 0) > 0 ||
    (live.reasoningEval?.contrastPromptCount || 0) > 0;
  const unrendered =
    !m.evidenceUse && !m.argumentHint && !m.conceptualContrast && !m.disciplinaryLens;
  if (!inJson) {
    return (
      "**Model compliance gap** — reasoning fields thin in DLA JSON; visibility is secondary. " +
      "Prioritise prompt/model compliance before **30-2r** renderer work."
    );
  }
  if (inJson && unrendered && m.howToThink) {
    return (
      "**Yes — materially harms learner experience** for source/compare activities: " +
      "`reasoning_orientation` / `self_explanation_prompt` render, but " +
      "`evidence_use_prompt`, `argument_structure_hint`, `conceptual_contrast_prompt`, and `disciplinary_lens` " +
      "do not appear in HTML though present in JSON. Learners lose evidence/contrast guidance on the page. " +
      "**Recommend 30-2r first** (minimal passthrough, ~4 labels) before **30-2b** (GAM anti-redundancy), " +
      "unless live GAM shows severe scaffold explosion."
    );
  }
  return "**Low material harm** — either fields absent in JSON or partial render sufficient for this probe.";
}

function weaknessNotes(probeId, live) {
  const notes = [];
  const e = live.evaluation;
  const re = live.reasoningEval;
  if (e.counts.studyCount === 0) notes.push("**G/model:** no study_orientation in DLA — prompt compliance gap.");
  if (e.counts.bridgeCount === 0 && e.counts.activityCount > 1) {
    notes.push("**G/model:** missing intellectual_coherence_bridge on follow-on activities.");
  }
  if (e.anti_patterns.welcome || e.anti_patterns.inSession) {
    notes.push("**G/model:** session/module boilerplate detected.");
  }
  if (e.anti_patterns.uploadedOnly && probeId === "P30-02") {
    notes.push("**G/model:** generic uploaded-transcript wording — topic fidelity weak.");
  }
  if (e.anti_patterns.minutesChoreo) notes.push("**G/model:** timing choreography leaked.");
  const pageVsDla =
    JSON.stringify(live.pageOrientation) !== JSON.stringify(live.dlaOrientation);
  if (pageVsDla) notes.push("**C:** Design Page dropped or altered orientation fields vs DLA — composition merge or model.");
  if (!e.htmlHasStudyOrientation && e.counts.studyCount > 0) {
    notes.push("**R:** fields in JSON but not in HTML — renderer (unlikely post-30-1b).");
  }
  if (e.counts.preambleCount > 0 && e.counts.studyCount > 0) {
    const dupRisk = live.dlaOrientation.some(
      (a) =>
        a.study_orientation &&
        a.activity_preamble &&
        String(a.study_orientation).slice(0, 40) === String(a.activity_preamble).slice(0, 40)
    );
    if (dupRisk) notes.push("**G:** study_orientation duplicates activity_preamble opening.");
  }
  if (live.phase2Heuristics.facilitatorUse) {
    notes.push("**GAM:** \"Facilitator use:\" still present — 30-1c guard not fully complied.");
  }
  if (live.pageRowSanitization && !live.pageRowSanitization.clean) {
    notes.push(
      "**C/page:** facilitator_notes/facilitator_note or choreographic support_note on learner activity rows (or in Support note HTML)."
    );
  }
  if (re && re.missingFields && re.missingFields.length) {
    notes.push("**Reasoning evaluator:** " + re.missingFields.join(", "));
  }
  if ((re?.warnings || []).some((w) => w.includes("substantially overlaps"))) {
    notes.push("**Redundancy:** reasoning field duplicates learner_task or orientation.");
  }
  if (!notes.length) notes.push("No major weaknesses flagged by heuristics; manual read still advised.");
  return notes.join("\n");
}

async function main() {
  const api = loadApi();
  const md = fs.readFileSync(ldPatternsPath, "utf8");
  const ldConfig = api.normalizeWorkflowBriefConfig(extractJsonBlock(md, "### Workflow Brief Config"));
  const wp = extractJsonBlock(md, "### Workflow Policy").workflowPolicy;
  const apiKey = readEnvKey();
  fs.mkdirSync(artefactDir, { recursive: true });

  const report = { capturedAt: new Date().toISOString(), model, apiKeyPresent: !!apiKey, probes: [] };

  for (const probe of PROBES) {
    console.log("=== " + probe.id + " ===");
    const eo = captureEo(api, ldConfig, wp, probe);
    let live = null;
    let compare = null;
    if (apiKey) {
      try {
        live = await runProbe(api, ldConfig, md, wp, apiKey, probe, eo);
        live.weaknessNote = weaknessNotes(probe.id, live);
        live.visibilityNote = visibilityGapNote(live);
        compare = compareFixtures(repoRoot, probe.slug, live.dlaOrientation);
        const base = path.join(artefactDir, probe.slug);
        fs.writeFileSync(base + "-learning-activities.json", JSON.stringify(live.learning_activities, null, 2));
        fs.writeFileSync(base + "-activity-materials.txt", String(live.activity_materials?.text || ""));
        fs.writeFileSync(base + "-page.json", JSON.stringify(live.page, null, 2));
        fs.writeFileSync(base + "-render.html", live.html || live.htmlExcerpt);
      } catch (err) {
        live = { error: String(err.message || err) };
      }
    }
    report.probes.push({ id: probe.id, eo, live, compare });
    fs.writeFileSync(
      path.join(outDir, probe.mdOut),
      writeLiveMd(probe, eo, live, compare, !!apiKey),
      "utf8"
    );
    console.log("Wrote " + probe.mdOut);
  }

  fs.writeFileSync(path.join(outDir, "sprint-30-probe-capture.json"), JSON.stringify(report, null, 2), "utf8");
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
