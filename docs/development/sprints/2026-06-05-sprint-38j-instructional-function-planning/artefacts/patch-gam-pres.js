const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..");
const ldPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);
const presPath = path.join(__dirname, "gam-pres-pack-block.txt");
const wbPath = path.join(__dirname, "gam-wb-pres-rows.txt");

const md = fs.readFileSync(ldPath, "utf8");
const m = md.match(
  /## 6\. Generate Activity Materials[\s\S]*?### Prompt Factory\s*```json\s*([\s\S]*?)\s*```/
);
if (!m) throw new Error("§6 Prompt Factory not found");

const factory = JSON.parse(m[1].trim());
let t = factory.promptTemplate;

const presBlock = fs.readFileSync(presPath, "utf8").trim().replace(/\r\n/g, "\n");
const wbRows = fs.readFileSync(wbPath, "utf8").trim().replace(/\r\n/g, "\n");

const presAnchor =
  "- Do not rely on blank-space alignment for table rendering\n\nMaterial-type realisation guidance:";
if (!t.includes(presAnchor)) throw new Error("GAM-PRES anchor not found");
if (t.includes("GAM-PRES-00")) throw new Error("GAM-PRES already inserted");
t = t.replace(
  presAnchor,
  "- Do not rely on blank-space alignment for table rendering\n\n" +
    presBlock +
    "\n\nMaterial-type realisation guidance:"
);

const wbAnchor =
  "- GAM-WB-21 (38G-3 ACM trace + 38H-2 reflection): where DLA specifies component-oriented intent, realise materials that support orientation/concept elucidation/activation/misconception handling/worked reasoning/guidance/practice/verification/reflection/transition with learner-friendly wording and without forcing literal component labels; on learner-write closure tasks consolidation_summary must scaffold reflection per GAM-WB-06b — support answer construction, do not supply the answer\n- Anti-patterns";
if (!t.includes(wbAnchor)) throw new Error("GAM-WB-21 anchor not found");
t = t.replace(
  wbAnchor,
  "- GAM-WB-21 (38G-3 ACM trace + 38H-2 reflection): where DLA specifies component-oriented intent, realise materials that support orientation/concept elucidation/activation/misconception handling/worked reasoning/guidance/practice/verification/reflection/transition with learner-friendly wording and without forcing literal component labels; on learner-write closure tasks consolidation_summary must scaffold reflection per GAM-WB-06b — support answer construction, do not supply the answer" +
    wbRows +
    "\n- Anti-patterns"
);

const failOld =
  "(F7) consolidation_summary authored as model essay, completed learner response, or pre-written synthesis/answer when learner_task and/or expected_output require learner-generated explanation, justification, synthesis, comparison, reflection, or evaluation (GAM-WB-06b)";
const failNew =
  failOld +
  "; (F8) merged multiple DLA required_materials rows into one Material body, or collapsed criteria→worked judgement→guided→independent sequence into prompt_set/consolidation_summary only when DLA listed distinct teaching materials (GAM-WB-22/23 / GAM-PRES-02)";
if (t.includes(failOld) && !t.includes("(F8)")) {
  t = t.replace(failOld, failNew);
}

t = t.replace(
  "plus GAM-WB-38E-9 F1–F7 above",
  "plus GAM-WB-38E-9 F1–F8 above"
);

factory.promptTemplate = t;

const notesAdd =
  " 38J-4 GAM-PRES: DLA decides, GAM realises — preserve DLA required_materials order and instructional-function sequence; no archetype replanning; no function collapse (F8); AS-GAM-FAIL/EV-GAM-FAIL; Evaluate A4 depth (GAM-WB-24); honour DLA scaffold-only specs (GAM-WB-06b/38H-2).";
if (!factory.defaultPromptNotes.includes("38J-4")) {
  factory.defaultPromptNotes = factory.defaultPromptNotes.replace(
    "F1–F7 fail rules",
    "F1–F8 fail rules"
  );
  factory.defaultPromptNotes += notesAdd;
}

const newJson = JSON.stringify(factory, null, 2);
const newMd = md.replace(m[1], "\n" + newJson + "\n");
fs.writeFileSync(ldPath, newMd, "utf8");
console.log("Patched §6 GAM: GAM-PRES + GAM-WB-22..25 + F8 + defaultPromptNotes");
