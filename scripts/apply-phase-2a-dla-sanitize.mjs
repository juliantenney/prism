/**
 * Sprint 38S Phase 2A — Remove superseded IFP blocks from DLA pack promptTemplate.
 * Also restores 38S workflow policy (prerequisite — was uncommitted; required for verification).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const mdPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

function removeBetween(text, startMarker, endMarker) {
  const start = text.indexOf(startMarker);
  if (start === -1) {
    console.warn("start not found:", startMarker.slice(0, 40));
    return text;
  }
  const end = text.indexOf(endMarker, start + startMarker.length);
  if (end === -1) {
    throw new Error("end not found after " + startMarker.slice(0, 40));
  }
  return text.slice(0, start) + text.slice(end);
}

function sanitizeDlaPromptTemplate(t) {
  let out = t;
  out = removeBetween(out, "- IFP-00 SEQUENCE:", "- IFP-01 ARCHETYPE");
  out = removeBetween(out, "- IFP-01 ARCHETYPE SELECTION", "- IFP-02 ARCHETYPE TEMPLATES");
  out = removeBetween(out, "- IFP-02 ARCHETYPE TEMPLATES", "- IFP-03 KM TRIGGERS");
  out = removeBetween(out, "- IFP-03 KM TRIGGERS", "- IFP-04 INFERENCE");
  out = removeBetween(out, "- IFP-07 SESSION ARC", "- IFP-08:");
  out = removeBetween(out, "- IFP-08:", "- IFP-09 DEPTH FLOORS");
  out = out.replace(/IFP-00 A–K/g, "IFP-04–10");
  out = out.replace(/IFP-00 A-K/g, "IFP-04-10");
  out = out.replace(/before IFP-00 A–K complete/gi, "before IFP-04–10 gates complete");
  out = out.replace(/replan IFP-00 A–K before JSON/gi, "replan IFP-04–10 gates before JSON");
  out = out.replace(/replan per IFP-00 A–K before JSON/gi, "replan per IFP-04–10 gates before JSON");
  out = out.replace(
    /Instructional function planning \(IFP — 38J-3 mandatory internal logic for EACH activity BEFORE emitting learner_task or required_materials; internal reasoning only — not a stored artefact, not a new JSON field\):/,
    "Instructional function planning (IFP — 38J-3 / 38S-2A obligation gates BEFORE emitting learner_task or required_materials; upstream episode_plans owns archetype and beat order — do not replan; internal reasoning only — not a stored artefact):"
  );
  return out;
}

function sanitizeDlaNotes(notes) {
  let out = notes;
  out = out.replace(
    /Build coached episodes, not LO->task shells: orientation, concept elucidation\/activation, worked reasoning, guidance, practice, verification, reflection\/transition according to LO level \(IFP archetype templates in promptTemplate — mandatory internal planning, not LO→task shells\)\. /,
    "Populate obligations from upstream episode_plans; build coached episodes from beat order — not LO→task shells. "
  );
  out = out.replace(
    /38J-3 IFP mandatory per activity: LO→archetype \(38I-3 LO-ARC\)→function sequence→KM triggers→inference→population→anti-shell \(AS-FAIL replan\)→anti-spoiler→session arc BEFORE learner_task\/required_materials; execute archetype template not one-line bundles; Evaluate A4 bar \(criteria, perspectives, trade-offs, worked judgement\); DLA-WB-22\.\.25\. /,
    "38S-2A: Episode Plan owns archetype and beat order; IFP-04–10 obligation gates before learner_task/required_materials; DLA-WB-22..25. "
  );
  return out;
}

function restoreWorkflowPolicy(md) {
  let out = md;
  if (!out.includes('"Design Episode Plan"')) {
    out = out.replace(
      '"Define Learning Outcomes",\n      "Design Learning Activities",',
      '"Define Learning Outcomes",\n      "Design Episode Plan",\n      "Design Learning Activities",'
    );
    out = out.replace(
      '"Define Learning Outcomes": 1,\n      "Design Learning Activities": 1,',
      '"Define Learning Outcomes": 1,\n      "Design Episode Plan": 1,\n      "Design Learning Activities": 1,'
    );
    out = out.replace(
      '"Define Learning Outcomes": { "requires": ["knowledge_model"], "produces": ["learning_outcomes"] },\n      "Design Learning Activities": { "requires": ["learning_outcomes"], "produces": ["learning_activities"] },',
      '"Define Learning Outcomes": { "requires": ["knowledge_model"], "produces": ["learning_outcomes"] },\n      "Design Episode Plan": { "requires": ["learning_outcomes"], "produces": ["episode_plans"] },\n      "Design Learning Activities": { "requires": ["learning_outcomes", "episode_plans"], "produces": ["learning_activities"] },'
    );
    out = out.replace(
      '["Define Learning Outcomes", "Design Learning Activities"],',
      '["Define Learning Outcomes", "Design Episode Plan"],\n      ["Design Episode Plan", "Design Learning Activities"],'
    );
    out = out.replace(
      '"Define Learning Outcomes",\n          "Design Learning Activities",',
      '"Define Learning Outcomes",\n          "Design Episode Plan",\n          "Design Learning Activities",'
    );
    out = out.replace(
      '"include": ["Define Learning Outcomes", "Design Learning Activities", "Generate Activity Materials"]',
      '"include": ["Define Learning Outcomes", "Design Episode Plan", "Design Learning Activities", "Generate Activity Materials"]'
    );
    out = out.replace(
      '"stepRoleAnchors": {\n      "Design Learning Activities":',
      '"stepRoleAnchors": {\n      "Design Episode Plan": "Episode planning — derive frozen Episode Plan V1 (archetype + ordered instructional-function beats) from learning outcomes for downstream population.",\n      "Design Learning Activities":'
    );
  }
  return out;
}

function extractDlaFactory(md) {
  const heading = "## 5. Design Learning Activities";
  const idx = md.indexOf(heading);
  if (idx === -1) throw new Error("DLA section not found");
  const rest = md.slice(idx);
  const jstart = rest.indexOf("```json");
  const jend = rest.indexOf("```", jstart + 7);
  return {
    idx,
    jstart: idx + jstart,
    jend: idx + jend,
    factory: JSON.parse(rest.slice(jstart + 7, jend).trim())
  };
}

let md = fs.readFileSync(mdPath, "utf8");
const metrics = { phase: "38S-2A", timestamp: new Date().toISOString() };

const { factory, jstart, jend } = extractDlaFactory(md);
metrics.dlaPromptBefore = factory.promptTemplate.length;
metrics.dlaNotesBefore = (factory.defaultPromptNotes || "").length;

factory.promptTemplate = sanitizeDlaPromptTemplate(factory.promptTemplate);
factory.defaultPromptNotes = sanitizeDlaNotes(factory.defaultPromptNotes || "");

metrics.dlaPromptAfter = factory.promptTemplate.length;
metrics.dlaNotesAfter = factory.defaultPromptNotes.length;
metrics.dlaPromptRemoved = metrics.dlaPromptBefore - metrics.dlaPromptAfter;
metrics.dlaNotesRemoved = metrics.dlaNotesBefore - metrics.dlaNotesAfter;

const checks = {
  hasIFP00: /IFP-00 SEQUENCE/.test(factory.promptTemplate),
  hasIFP01: /IFP-01 ARCHETYPE/.test(factory.promptTemplate),
  hasIFP02: /IFP-02 ARCHETYPE/.test(factory.promptTemplate),
  hasIFP03: /IFP-03 KM TRIGGERS/.test(factory.promptTemplate),
  hasIFP07: /IFP-07 SESSION ARC/.test(factory.promptTemplate),
  hasIFP08: /- IFP-08:/.test(factory.promptTemplate),
  hasIFP04: /IFP-04 INFERENCE/.test(factory.promptTemplate),
  hasIFP05: /IFP-05 ANTI-SHELL/.test(factory.promptTemplate),
  hasIFP06: /IFP-06 ANTI-SPOILER/.test(factory.promptTemplate),
  hasIFP09: /IFP-09 DEPTH FLOORS/.test(factory.promptTemplate),
  hasIFP10: /IFP-10 CLOSURE/.test(factory.promptTemplate),
  hasDlaWb: /Self-study workbook contract \(DLA-WB/.test(factory.promptTemplate)
};
metrics.checks = checks;

if (checks.hasIFP00 || checks.hasIFP01 || checks.hasIFP02 || checks.hasIFP03 || checks.hasIFP07 || checks.hasIFP08) {
  throw new Error("Sanitisation incomplete: " + JSON.stringify(checks));
}
if (!checks.hasIFP04 || !checks.hasIFP05 || !checks.hasIFP06 || !checks.hasIFP09 || !checks.hasIFP10) {
  throw new Error("Required IFP blocks missing: " + JSON.stringify(checks));
}

const newJson = JSON.stringify(factory, null, 2);
md = md.slice(0, jstart + 7) + "\n\n" + newJson + "\n" + md.slice(jend);
md = restoreWorkflowPolicy(md);
md = md.replace(
  "### Input\nlearning_outcomes (and optionally knowledge_model or learning_content)",
  "### Input\nlearning_outcomes, episode_plans (and optionally knowledge_model or learning_content)"
);

fs.writeFileSync(mdPath, md, "utf8");
fs.writeFileSync(
  path.join(
    repoRoot,
    "docs/development/sprints/2026-06-06-sprint-38s-episode-plan-v1-implementation/artefacts/EV-38S-2A-dla-prompt-metrics.json"
  ),
  JSON.stringify(metrics, null, 2),
  "utf8"
);

console.log(JSON.stringify(metrics, null, 2));
