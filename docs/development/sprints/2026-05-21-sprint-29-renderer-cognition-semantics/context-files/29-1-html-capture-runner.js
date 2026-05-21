/**
 * Sprint 29-1 — HTML capture via buildUtilityStructuredHtmlForTest (evidence only).
 * Run from repo root:
 *   node docs/development/sprints/2026-05-21-sprint-29-renderer-cognition-semantics/context-files/29-1-html-capture-runner.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..");
const appJsPath = path.join(repoRoot, "app.js");
const capturePath = path.join(
  __dirname,
  "..",
  "..",
  "2026-05-21-sprint-28-pedagogic-richness-dialogic-learning",
  "context-files",
  "28-5d-stabilisation-capture.json"
);
const outDir = __dirname;

const COGNITION_FIELD_IDS = [
  "reasoning_revision_prompt",
  "initial_position_prompt",
  "revision_trigger",
  "misconception_claim",
  "reconciliation_prompt",
  "evidence_contrast",
  "transformation_activity",
  "source_to_application_prompt",
  "self_explanation_prompt",
  "transfer_or_application_task",
  "scaffold_hint_sequence",
  "uncertainty_tension_prompt"
];

const GAM_LABEL_PATTERNS = [
  { field: "reasoning_revision_prompt", re: /reasoning revision/i },
  { field: "initial_position_prompt", re: /initial position/i },
  { field: "revision_trigger", re: /revision trigger/i },
  { field: "misconception_claim", re: /misconception claim/i },
  { field: "reconciliation_prompt", re: /reconciliation prompt/i },
  { field: "evidence_contrast", re: /evidence contrast/i },
  { field: "transformation_activity", re: /transformation activity/i },
  { field: "source_to_application_prompt", re: /source to application/i },
  { field: "self_explanation_prompt", re: /self-explanation/i },
  { field: "transfer_or_application_task", re: /transfer or application/i },
  { field: "scaffold_hint_sequence", re: /scaffold hint/i },
  { field: "uncertainty_tension_prompt", re: /uncertainty tension/i }
];

const PROBES = [
  { id: "P28-01", r29: "R29-P01", out: "r29-p01-html-capture.md", headingLa: "Learning Activities", headingAc: "Formative Assessment Check" },
  { id: "P28-02", r29: "R29-P02", out: "r29-p02-html-capture.md", headingLa: "Learning Activities", headingAc: "Formative Assessment Check" },
  { id: "P28-07", r29: "R29-P07", out: "r29-p07-html-capture.md", headingLa: "Learning Activities", headingAc: "Formative Assessment Check" }
];

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() { return false; } },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() { return null; },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {}
  };
}

function loadApi() {
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener: () => {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem() {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(appJsPath, "utf8"), sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function sectionAfterHeading(html, headingText) {
  const re = new RegExp(
    headingText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\s\\S]*?(?=<h2|<details class=\"util-meta\"|$)",
    "i"
  );
  const m = String(html || "").match(re);
  return m ? m[0] : "";
}

function stripTags(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function collectCognitionFromPage(page) {
  const found = [];
  const sections = Array.isArray(page.sections) ? page.sections : [];
  sections.forEach((section) => {
    if (String(section.section_id || "").toLowerCase() !== "learning_activities") return;
    const rows = Array.isArray(section.content) ? section.content : [];
    rows.forEach((row) => {
      if (!row || typeof row !== "object") return;
      COGNITION_FIELD_IDS.forEach((fid) => {
        const v = row[fid];
        if (v == null || v === "") return;
        const text = Array.isArray(v) ? v.join(" ") : String(v);
        if (text.trim()) found.push({ field: fid, value: text.trim().slice(0, 200), source: "activity_row" });
      });
      const mats = row.materials;
      if (mats && typeof mats === "object") {
        COGNITION_FIELD_IDS.forEach((fid) => {
          const v = mats[fid];
          if (v == null || v === "") return;
          const text = Array.isArray(v) ? v.join(" ") : String(v);
          if (!text.trim()) return;
          const dup = found.some((f) => f.field === fid);
          if (!dup) found.push({ field: fid, value: text.trim().slice(0, 200), source: "materials_key" });
        });
        const blob = JSON.stringify(mats);
        GAM_LABEL_PATTERNS.forEach((p) => {
          if (!p.re.test(blob)) return;
          const dup = found.some((f) => f.field === p.field);
          if (!dup) found.push({ field: p.field, value: "(in materials text)", source: "materials_embedded" });
        });
      }
    });
  });
  const seen = {};
  return found.filter((f) => {
    const k = f.field + "|" + f.source;
    if (seen[k]) return false;
    seen[k] = true;
    return true;
  });
}

function analyzeFieldInHtml(html, field, value) {
  const plain = stripTags(html);
  const hasUtilCognition = /util-cognition/i.test(html);
  const fieldKeyInHtml = html.includes(field);
  let valueInHtml = false;
  if (value && value !== "(in materials text)") {
    const snippet = value.slice(0, 40).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (snippet.length > 8) valueInHtml = new RegExp(snippet, "i").test(plain);
  }
  const labelPat = GAM_LABEL_PATTERNS.find((p) => p.field === field);
  const labelInHtml = labelPat ? labelPat.re.test(plain) : false;
  const semanticBlock =
    hasUtilCognition ||
    new RegExp(
      '<h4[^>]*>[^<]*' + (labelPat ? labelPat.re.source : field) + "[^<]*</h4>",
      "i"
    ).test(html);
  const titleFromKey = field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const materialsHeading = new RegExp("<span>" + titleFromKey.replace(/ /g, "\\s+") + "</span>", "i").test(html);
  let status = "not_visible";
  if (semanticBlock) status = "semantic_block";
  else if (materialsHeading) status = "materials_key_heading";
  else if (fieldKeyInHtml) status = "raw_field_key";
  else if (labelInHtml || valueInHtml) status = "embedded_prose";
  return { status, labelInHtml, valueInHtml, fieldKeyInHtml, materialsHeading };
}

function scoreDimensions(metrics) {
  const m = metrics;
  return {
    "D-R1": m.cognitionVisibleAsSemantic ? 2 : m.cognitionMaterialHeadings || m.cognitionEmbeddedProse ? 1 : 0,
    "D-R2": m.assessmentItemCount > 0 && m.activityBlockCount > 0 ? (m.laHtmlLen >= m.acHtmlLen ? 2 : 1) : 1,
    "D-R3": m.revisionFlowVisible ? 1 : 0,
    "D-R4": m.repairPairVisible ? 1 : 0,
    "D-R5": m.acHtmlLen > m.laHtmlLen * 0.85 ? 1 : m.assessmentItemCount >= 5 ? 1 : 0,
    "D-R6": m.h2Count >= 2 ? 2 : 1,
    "D-R7": m.phaseMarkers > 0 ? 1 : 0,
    "D-R8": m.hasWhatToDo ? 2 : 1,
    "D-R9": m.htmlLen > 25000 ? 1 : m.htmlLen > 12000 ? 1 : 2,
    "D-R10":
      m.utilCognitionClass ? 0 : m.cognitionMaterialHeadings || m.cognitionEmbeddedProse ? (m.cognitionVisibleAsSemantic ? 1 : 2) : 1
  };
}

function analyzeProbe(page, html, laScope, acScope) {
  const cognition = collectCognitionFromPage(page);
  const fieldReports = cognition.map((c) => {
    const inLa = analyzeFieldInHtml(laScope, c.field, c.value);
    const inAll = analyzeFieldInHtml(html, c.field, c.value);
    return { ...c, inLa, inAll };
  });
  const embedded = fieldReports.filter((f) =>
    f.inAll.status === "embedded_prose" || f.inAll.status === "materials_key_heading"
  ).length;
  const semantic = fieldReports.filter((f) => f.inAll.status === "semantic_block").length;
  const plain = stripTags(html);
  const cognitionMaterialHeadings = GAM_LABEL_PATTERNS.filter((p) => {
    const title = p.field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return new RegExp("<span>" + title.replace(/ /g, "[^<]*") + "</span>", "i").test(laScope) ||
      new RegExp("<span>[^<]*" + p.re.source + "[^<]*</span>", "i").test(laScope);
  }).length > 0;
  const metrics = {
    htmlLen: html.length,
    laHtmlLen: laScope.length,
    acHtmlLen: acScope.length,
    h2Count: (html.match(/<h2\b/gi) || []).length,
    activityBlockCount: (laScope.match(/util-task-block/gi) || []).length - (laScope.match(/util-assessment-item/gi) || []).length,
    assessmentItemCount: (acScope.match(/util-assessment-item/gi) || []).length,
    utilCognitionClass: /util-cognition/i.test(html),
    hasWhatToDo: /What to do/i.test(laScope) || /util-activity-task/i.test(laScope),
    cognitionMaterialHeadings,
    cognitionEmbeddedProse: embedded > 0,
    cognitionVisibleAsSemantic: semantic > 0,
    revisionFlowVisible: /initial position|reasoning revision|revision trigger/i.test(plain),
    repairPairVisible: /misconception claim/i.test(plain) && /reconciliation prompt/i.test(plain),
    phaseMarkers: (plain.match(/initial position|revision trigger|predict/gi) || []).length
  };
  if (metrics.activityBlockCount < 0) metrics.activityBlockCount = (laScope.match(/util-task-block/gi) || []).length;
  return { cognition, fieldReports, metrics, scores: scoreDimensions(metrics) };
}

function truncateHtml(html, max) {
  const s = String(html || "");
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n\n<!-- truncated " + (s.length - max) + " chars -->";
}

function writeCaptureMd(probe, page, html, analysis, eo) {
  const sectionOrder = (page.sections || []).map((s) => s.section_id + " (" + (s.heading || "") + ")");
  const laHeading = probe.headingLa;
  const acHeading = probe.headingAc;
  let laScope = sectionAfterHeading(html, laHeading);
  if (!laScope) {
    laScope = sectionAfterHeading(html, "Learning activities");
  }
  let acScope = sectionAfterHeading(html, acHeading);
  if (!acScope) {
    acScope = sectionAfterHeading(html, "Formative");
  }
  if (!acScope) acScope = sectionAfterHeading(html, "Assessment");

  const lines = [];
  lines.push("# " + probe.r29 + " — HTML capture (29-1)");
  lines.push("");
  lines.push("**Captured:** " + new Date().toISOString().slice(0, 10));
  lines.push("**Method:** `buildUtilityStructuredHtmlForTest` on Sprint 28 post-5d composed page JSON (`28-5d-stabilisation-capture.json`).");
  lines.push("**Renderer:** current `app.js` — no cognition CSS classes.");
  lines.push("");
  lines.push("## 1. Section order (page JSON → HTML h2)");
  lines.push("");
  page.sections.forEach((s, i) => {
    lines.push((i + 1) + ". `" + s.section_id + "` — " + (s.heading || "(no heading)"));
  });
  lines.push("");
  lines.push("**Cognition profile:** " + JSON.stringify((page.metadata && page.metadata.cognition_profile) || null));
  lines.push("");
  lines.push("## 2. Cognition fields in JSON");
  lines.push("");
  lines.push("| Field | Source on page | Value preview |");
  lines.push("|-------|----------------|---------------|");
  analysis.cognition.forEach((c) => {
    lines.push("| `" + c.field + "` | " + c.source + " | " + c.value.replace(/\|/g, "\\|").slice(0, 80) + " |");
  });
  if (!analysis.cognition.length) lines.push("| — | — | none on activity rows |");
  lines.push("");
  lines.push("## 3. Renderer visibility of cognition fields");
  lines.push("");
  lines.push("| Field | HTML status | Label in text | Value in text |");
  lines.push("|-------|-------------|---------------|---------------|");
  analysis.fieldReports.forEach((f) => {
    lines.push(
      "| `" +
        f.field +
        "` | **" +
        f.inAll.status +
        "** | " +
        (f.inAll.labelInHtml ? "yes" : "no") +
        " | " +
        (f.inAll.valueInHtml ? "yes" : "no") +
        " |"
    );
  });
  lines.push("");
  lines.push("**Semantic block** = dedicated `util-cognition*` class (none in 29-1).");
  lines.push("**materials_key_heading** = `renderMaterialValue` emits `util-material-heading` with humanised key title (P02).");
  lines.push("**embedded_prose** = label/value inside task-card markdown only (P01/P07).");
  lines.push("");
  lines.push("## 4. Visual prominence metrics");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(analysis.metrics, null, 2));
  lines.push("```");
  lines.push("");
  lines.push("## 5. Matrix scores (29-1 HTML-backed)");
  lines.push("");
  lines.push("| Dim | 29-0 (doc) | 29-1 (HTML) | Note |");
  lines.push("|-----|------------|-------------|------|");
  const prev = probe.prevScores || {};
  Object.keys(analysis.scores).forEach((dim) => {
    lines.push("| " + dim + " | " + (prev[dim] != null ? prev[dim] : "—") + " | **" + analysis.scores[dim] + "** | |");
  });
  lines.push("");
  lines.push("## 6. learning_activities HTML (excerpt)");
  lines.push("");
  lines.push("```html");
  lines.push(truncateHtml(laScope, 12000));
  lines.push("```");
  lines.push("");
  lines.push("## 7. assessment_check HTML (excerpt)");
  lines.push("");
  lines.push("```html");
  lines.push(truncateHtml(acScope, 8000));
  lines.push("```");
  lines.push("");
  lines.push("## 8. Investigator notes");
  lines.push("");
  lines.push("- Activities use `util-task-block`; assessment uses `util-assessment-item` + `util-assessment-section` — distinct chrome.");
  lines.push("- Cognition labels in P28-01/P07 often appear inside **task card markdown**, not as typed activity-row renderer blocks.");
  lines.push("- No `util-cognition` classes in export HTML (expected — 29-3 not started).");
  lines.push("- Sprint 27 `feedback_display` on page: `" + (page.feedback_display || page.metadata && page.metadata.feedback_display || "n/a") + "`.");
  lines.push("");
  return lines.join("\n");
}

function main() {
  const api = loadApi();
  const capture = JSON.parse(fs.readFileSync(capturePath, "utf8"));
  const prevScores = {
    "P28-01": { "D-R1": 0, "D-R2": 1, "D-R3": 0, "D-R4": 0, "D-R5": 1, "D-R6": 2, "D-R7": 0, "D-R8": 1, "D-R9": 1, "D-R10": 2 },
    "P28-02": { "D-R1": 0, "D-R2": 1, "D-R3": 0, "D-R4": "n/a", "D-R5": 1, "D-R6": 2, "D-R7": 0, "D-R8": 1, "D-R9": 1, "D-R10": 2 },
    "P28-07": { "D-R1": 0, "D-R2": 1, "D-R3": 0, "D-R4": 0, "D-R5": 1, "D-R6": 2, "D-R7": 0, "D-R8": 1, "D-R9": 1, "D-R10": 2 }
  };
  const summary = [];

  PROBES.forEach((probe) => {
    const entry = capture.probes.find((p) => p.id === probe.id);
    if (!entry || !entry.live || !entry.live.page) {
      console.error("Missing page for " + probe.id);
      return;
    }
    const page = entry.live.page;
    const r = api.buildUtilityStructuredHtmlForTest(page);
    if (!r || r.error) {
      console.error(probe.id, r && r.error);
      return;
    }
    const html = String(r.html || "");
    let laScope = sectionAfterHeading(html, probe.headingLa);
    if (!laScope) laScope = sectionAfterHeading(html, "Learning activities");
    let acScope = sectionAfterHeading(html, probe.headingAc);
    if (!acScope) acScope = sectionAfterHeading(html, "Assessment");
    const analysis = analyzeProbe(page, html, laScope, acScope);
    probe.prevScores = prevScores[probe.id];
    fs.writeFileSync(path.join(outDir, probe.out), writeCaptureMd(probe, page, html, analysis, entry.eo), "utf8");
    summary.push({ probe: probe.r29, scores: analysis.scores, metrics: analysis.metrics });
    console.log("Wrote " + probe.out);
  });

  fs.writeFileSync(path.join(outDir, "29-1-html-capture-summary.json"), JSON.stringify(summary, null, 2), "utf8");
}

main();
