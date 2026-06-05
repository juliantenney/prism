/**
 * 38J-3 — patch pack §5 DLA promptTemplate + defaultPromptNotes
 */
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..");
const ldPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);
const ifpPath = path.join(__dirname, "ifp-dla-pack-block.txt");

const wbRows = `
- DLA-WB-22 (38J-3 Evaluate archetype): When primary_archetype is Evaluate (IFP-01), the activity MUST include required_materials rows for: criteria exposition (text or modelling_note with ≥3 dimensions); scenario (≥2 perspectives or competing options); modelling_note or worked_example with weak vs strong judgement contrast; guided judgement table (decision_table, comparison_table, or analysis_table with partial learner cells); transfer_or_application_task in learner_task or cognition field; consolidation_summary alone does NOT satisfy Evaluate — EV-CAP-01/02
- DLA-WB-23 (38J-3 Apply archetype): When primary_archetype is Apply and KM-T03 fired (process ≥3 steps), the activity MUST list type worked_example with stepped think-aloud specification before independent practice
- DLA-WB-24 (38J-3 anti-shell): If IFP-05 AS-FAIL-01..05 triggers, replan function_sequence and population BEFORE emitting JSON — do not emit shell activities
- DLA-WB-25 (38J-3 session arc): In delivery_notes when workbook_contract_applied, document activity_index fade: earlier activities heavier teaching/support; later activities integrate prior work; Evaluate finale keeps criteria visible — ARC-01..06`;

const md = fs.readFileSync(ldPath, "utf8");
const heading = "## 5. Design Learning Activities";
const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const re = new RegExp(
  escaped + "[\\s\\S]*?### Prompt Factory\\s*```json\\s*([\\s\\S]*?)\\s*```"
);
const m = md.match(re);
if (!m) throw new Error("§5 Prompt Factory not found");

const factory = JSON.parse(m[1].trim());
let t = factory.promptTemplate;

const oldBundle =
  "- Apply LO cognitive-demand component bundles in activity design: Understand => orientation + concept elucidation + check; Apply => worked example + guided practice + verification; Analyse => comparison/classification + reasoning scaffold + verification + transition; Evaluate => trade-offs + judgement + justification + reflection + transition\\n";
if (!t.includes(oldBundle.slice(0, 80))) {
  const alt =
    "- Apply LO cognitive-demand component bundles in activity design: Understand => orientation + concept elucidation + check; Apply => worked example + guided practice + verification; Analyse => comparison/classification + reasoning scaffold + verification + transition; Evaluate => trade-offs + judgement + justification + reflection + transition\n";
  if (t.includes(alt.slice(0, 80))) {
    t = t.replace(alt, "");
  } else {
    throw new Error("Old bundle line not found");
  }
} else {
  t = t.replace(oldBundle, "");
}

const ifpBlock = fs.readFileSync(ifpPath, "utf8").trim();
const anchor = "- Apply step notes when provided: {{stepNotes}}\n\n";
if (!t.includes(anchor)) throw new Error("stepNotes anchor not found");
if (t.includes("IFP-00 SEQUENCE")) throw new Error("IFP already inserted");
t = t.replace(anchor, anchor + ifpBlock + "\n");

const wbAnchor = "- DLA-WB-21 (38G-3 ACM trace): for each activity specification, include explicit use of KM affordances (definitions/relationships/processes/misconceptions) in purpose/specification language where relevant; do not rely on LO labels alone\n\nConstraints:";
if (!t.includes(wbAnchor)) throw new Error("DLA-WB-21 anchor not found");
t = t.replace(wbAnchor, "- DLA-WB-21 (38G-3 ACM trace): for each activity specification, include explicit use of KM affordances (definitions/relationships/processes/misconceptions) in purpose/specification language where relevant; do not rely on LO labels" + wbRows + "\n\nConstraints:");

factory.promptTemplate = t;

const notesAdd =
  " 38J-3 IFP mandatory per activity: LO→archetype (38I-3 LO-ARC)→function sequence→KM triggers→inference→population→anti-shell (AS-FAIL replan)→anti-spoiler→session arc BEFORE learner_task/required_materials; execute archetype template not one-line bundles; Evaluate A4 bar (criteria, perspectives, trade-offs, worked judgement); DLA-WB-22..25.";
if (!factory.defaultPromptNotes.includes("38J-3")) {
  factory.defaultPromptNotes = factory.defaultPromptNotes.replace(
    "Understand/Apply/Analyse/Evaluate bundles in promptTemplate)",
    "IFP archetype templates in promptTemplate — mandatory internal planning, not LO→task shells)"
  );
  factory.defaultPromptNotes += notesAdd;
}

const newJson = JSON.stringify(factory, null, 2);
const newMd = md.replace(m[1], "\n" + newJson + "\n");
fs.writeFileSync(ldPath, newMd, "utf8");
console.log("Patched §5 DLA: IFP block + DLA-WB-22..25 + defaultPromptNotes");
