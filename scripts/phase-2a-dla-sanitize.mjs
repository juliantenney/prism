/**
 * Phase 2A: Remove superseded IFP blocks from DLA pack promptTemplate.
 */
import fs from "fs";
import path from "path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const mdPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

const md = fs.readFileSync(mdPath, "utf8");
const heading = "## 6. Design Learning Activities";
const idx = md.indexOf(heading);
if (idx < 0) throw new Error("DLA section not found");
const rest = md.slice(idx);
const jstart = rest.indexOf("```json");
const jend = rest.indexOf("```", jstart + 7);
const jsonText = rest.slice(jstart + 7, jend);
const factory = JSON.parse(jsonText.trim());

const beforeLen = factory.promptTemplate.length;
let t = factory.promptTemplate;

function removeBlock(startRe, endRe) {
  const start = t.search(startRe);
  if (start === -1) {
    console.warn("Block not found:", startRe);
    return;
  }
  const afterStart = t.slice(start);
  const endMatch = afterStart.slice(1).search(endRe);
  const end =
    endMatch === -1
      ? t.length
      : start + 1 + endMatch;
  t = t.slice(0, start) + t.slice(end);
}

// Remove IFP-01 through IFP-03, IFP-07, IFP-08 (order: later first to preserve indices)
removeBlock(/- IFP-08:/, /- IFP-09 DEPTH FLOORS/);
removeBlock(/- IFP-07 SESSION ARC/, /- IFP-08:/);
removeBlock(/- IFP-03 KM TRIGGERS/, /- IFP-04 INFERENCE/);
removeBlock(/- IFP-02 ARCHETYPE TEMPLATES/, /- IFP-03 KM TRIGGERS/);
removeBlock(/- IFP-01 ARCHETYPE SELECTION/, /- IFP-02 ARCHETYPE TEMPLATES/);
t = t.replace(/- IFP-00 SEQUENCE:[^\n]*\n/, "");

// Update IFP header — subtract planning refs, keep obligation gates
t = t.replace(
  /Instructional function planning \(IFP — 38J-3 mandatory internal logic for EACH activity BEFORE emitting learner_task or required_materials; internal reasoning only — not a stored artefact, not a new JSON field\):/,
  "Instructional function planning (IFP — 38J-3 / 38S-2A: obligation specification gates BEFORE emitting learner_task or required_materials; Episode Plan V1 owns archetype and beat order — do not replan; internal reasoning only — not a stored artefact):"
);

// Fix cross-references to removed IFP-00..08
t = t.replace(/IFP-00 A–K/g, "IFP-04–10");
t = t.replace(/IFP-00 A-K/g, "IFP-04-10");
t = t.replace(/before IFP-00 A–K complete/gi, "before IFP-04–10 gates complete");
t = t.replace(/replan IFP-00 A–K before JSON/gi, "replan IFP-04–10 gates before JSON");
t = t.replace(/replan per IFP-00 A–K before JSON/gi, "replan per IFP-04–10 gates before JSON");

// IFP-05 still references primary_archetype in AS-FAIL - keep
// IFP-04 INF-EVAL still in IFP-04 block - keep

const afterLen = t.length;
factory.promptTemplate = t;

// Trim defaultPromptNotes — remove IFP-01/02/07 planning refs
let notes = factory.defaultPromptNotes || "";
notes = notes.replace(
  /Build coached episodes, not LO->task shells: orientation, concept elucidation\/activation, worked reasoning, guidance, practice, verification, reflection\/transition according to LO level \(IFP archetype templates in promptTemplate — mandatory internal planning, not LO→task shells\)\. /,
  "Populate obligations from upstream episode_plans; build coached episodes from beat order — not LO→task shells. "
);
notes = notes.replace(
  /38J-3 IFP mandatory per activity: LO→archetype \(38I-3 LO-ARC\)→function sequence→KM triggers→inference→population→anti-shell \(AS-FAIL replan\)→anti-spoiler→session arc BEFORE learner_task\/required_materials; execute archetype template not one-line bundles; Evaluate A4 bar \(criteria, perspectives, trade-offs, worked judgement\); DLA-WB-22\.\.25\. /,
  "38S-2A: Episode Plan owns archetype and beat order; IFP-04–10 obligation gates (inference, anti-shell, anti-spoiler, depth floors, emission) BEFORE learner_task/required_materials; DLA-WB-22..25. "
);

factory.defaultPromptNotes = notes;

const newJson = JSON.stringify(factory, null, 2);
const newMd =
  md.slice(0, idx + jstart + 7) + "\n\n" + newJson + "\n" + md.slice(idx + jend);

fs.writeFileSync(mdPath, newMd, "utf8");

console.log(
  JSON.stringify({
    beforeChars: beforeLen,
    afterChars: afterLen,
    removed: beforeLen - afterLen,
    notesBefore: (factory.defaultPromptNotes || "").length,
    stillHasIFP00: /IFP-00 SEQUENCE/.test(t),
    stillHasIFP01: /IFP-01 ARCHETYPE/.test(t),
    stillHasIFP04: /IFP-04 INFERENCE/.test(t),
    stillHasIFP09: /IFP-09 DEPTH FLOORS/.test(t)
  }, null, 2)
);
