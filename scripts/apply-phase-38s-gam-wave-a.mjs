/**
 * Sprint 38S GAM Cleanup Wave A — pack-only dedupe (subtraction + cross-ref merge).
 * Authority: phase-2/38S-final-gam-cleanup-audit.md
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

const NEW_DEFAULT_PROMPT_NOTES =
  "Realise DLA required_materials per GAM-PRES (38J-4 — DLA decides, GAM realises): order/membership GAM-PRES-01/02; types GAM-PRES-03; depth GAM-PRES-08/09 (38L-3); Evaluate trio GAM-PRES-10 + EV-GAM-FAIL-07 (38L-4). Self_directed: LD-TABLE-FIDELITY, LD-MATERIALS-COPY, LD-SELF-DIRECTED-RHETORIC, LD-MATH-RENDER at runtime. Workbook (38F-2/38E-9): GAM-WB-38F-01 pipe tables; GAM-WB-02/06 per PRES-08; GAM-WB-06b (38H-2). FAIL: F1–F9, AP-01/05, DEPTH-COLLAPSE (GAM-PRES-09).";

function extractGamFactory(md) {
  const heading = "## 6. Generate Activity Materials";
  const idx = md.indexOf(heading);
  if (idx === -1) throw new Error("GAM section not found");
  const rest = md.slice(idx);
  const jstart = rest.indexOf("```json");
  const jend = rest.indexOf("```", jstart + 7);
  return {
    jstart: idx + jstart,
    jend: idx + jend,
    factory: JSON.parse(rest.slice(jstart + 7, jend).trim())
  };
}

/** @param {string} tpl */
function waveATemplate(tpl) {
  let t = tpl;

  t = t.replace(
    /Canonical contracts \(runtime modules; obey all\):[\s\S]*?LD-SELF-DIRECTED-RHETORIC when self_directed\.\n\n/,
    "Canonical contracts (runtime modules; obey all): LD-TABLE-FIDELITY, LD-MATERIALS-COPY, LD-MATH-RENDER, LD-SELF-DIRECTED-RHETORIC when self_directed.\n\n"
  );

  t = t.replace(
    /- Use available knowledge_model \+ learning_outcomes affordances[\s\S]*?transition cues where specified\n/,
    ""
  );

  t = t.replace(
    /(not specification restatement)\n/,
    "$1; type labels per GAM-PRES-03 (GAM-WB-11..19 authoritative map — template, sample_output, checklist, rubric, misconception_note, *_table companion, task_cards, prompt_set, reflection_prompt optional)\n"
  );

  t = t.replace(
    /(do not compress teaching to meet duration — realise fully per LD-MATERIALS-COPY)\n/,
    "$1; text exposition ≥120 words linking ≥2 ideas outside table cells when DLA lists text\n"
  );

  t = t.replace(
    /(L3 spec with restatement-only body = DEPTH-FAIL)\n/,
    "$1; GAM-WB-01/02/06 depth floors authoritative here (exposition ≥120w; worked_example|sample_output|modelling_note full bodies; consolidation_summary ≥80 words per GAM-WB-06b when required)\n"
  );

  t = t.replace(
    /(triggers contract FAIL \(F9\))\n/,
    `$1; workbook FAIL taxonomy (authoritative — F1–F9): (F1) consolidation_summary missing when required; (F2) prompt_set-only closure; (F3) worked_example|sample_output|modelling_note body missing; (F4) template-only worked obligation; (F5) scenario only in task_cards (GAM-WB-10/AP-04); (F6) missing pipe table (GAM-WB-38F-01); (F7) spoiler consolidation (GAM-WB-06b); (F9) DEPTH-COLLAPSE-01..05. MIX: GAM-WB-MIX-01 table-only invalid (AP-01); MIX-03 prompt_set-only capstone closure = FAIL; MIX-04 template-only worked_example FAIL; MIX-05 retrieval needs learner-check; MIX-06 capstone weight limit. AP: AP-01 table-only; AP-02 reference-dump capstone; AP-03 pre-filled ratings; AP-04 scenario without Material body; AP-05 spoiler consolidation\n`
  );

  t = t.replace(
    /make only the assumptions necessary to produce a complete and usable output\n/,
    "make only the assumptions necessary to produce complete and usable material bodies\n"
  );

  t = t.replace(
    /- GAM-WB-01 exposition:[\s\S]*?- GAM-WB-02 \(38E-9 mandatory\):[\s\S]*?missing Material body when DLA requested = contract FAIL\n/,
    "- GAM-WB-02 (38E-9 mandatory): worked_example|sample_output|modelling_note per GAM-PRES-08 — full Content for each; missing body = contract FAIL (F3/F4)\n"
  );

  t = t.replace(
    /- GAM-WB-03 modelling:[\s\S]*?- GAM-WB-04 guided practice:[\s\S]*?- GAM-WB-05 retrieval:[\s\S]*?\n/,
    ""
  );

  t = t.replace(
    /- GAM-WB-06 \(38E-9 mandatory \+ 38H-2\):[\s\S]*?missing consolidation_summary when consolidation_requirement=true = contract FAIL \(F1\)\n/,
    "- GAM-WB-06 (38E-9 mandatory + 38H-2): consolidation_summary per GAM-PRES-08; consolidation_summary ≥80 words; capstone prompt_set alone does NOT satisfy; missing when required = contract FAIL (F1)\n"
  );

  t = t.replace(
    /- GAM-WB-06b \(38H-2 mandatory when learner-production required\):[\s\S]*?informational consolidation bodies may remain\n/,
    '- GAM-WB-06b (38H-2, learner-production required): consolidation_summary = reflective scaffolding only — sentence starters, criteria comparison, self-check prompts; FORBID model essays, past-tense summaries (e.g. "you have learned"), completed learner responses; ≥80 words; violating scaffold-only = contract FAIL (F7)\n'
  );

  t = t.replace(
    /- GAM-WB-07 synthesis capstone:[\s\S]*?- GAM-WB-08 transfer:[\s\S]*?- GAM-WB-09 \/ AP-03 evaluative judgement:[\s\S]*?\n/,
    ""
  );

  t = t.replace(
    /- GAM-WB-11 template:[\s\S]*?- GAM-WB-MIX-06:[\s\S]*?\n/,
    ""
  );

  t = t.replace(
    /- GAM-WB-38E-9 contract FAIL \(explicit\):[\s\S]*?DEPTH-COLLAPSE-01\.\.05\)\n/,
    "- Workbook contract FAIL: see GAM-PRES-09 fail taxonomy (F1–F9, MIX, AP-01..05)\n"
  );

  t = t.replace(
    /- GAM-WB-21 \(38G-3 ACM trace \+ 38H-2 reflection\):[\s\S]*?do not supply theanswer\n/,
    ""
  );

  t = t.replace(
    /- Anti-patterns \(workbook FAIL\):[\s\S]*?GAM-WB-38E-9 F1–F9 above\n\n/,
    "\n"
  );

  return t;
}

let md = fs.readFileSync(mdPath, "utf8");
const metrics = {
  phase: "38S-WAVE-A",
  timestamp: new Date().toISOString()
};

const { factory, jstart, jend } = extractGamFactory(md);
metrics.promptTemplateBefore = factory.promptTemplate.length;
metrics.notesBefore = (factory.defaultPromptNotes || "").length;
metrics.packCombinedBefore =
  metrics.promptTemplateBefore + metrics.notesBefore;

factory.promptTemplate = waveATemplate(factory.promptTemplate);
factory.defaultPromptNotes = NEW_DEFAULT_PROMPT_NOTES;

metrics.promptTemplateAfter = factory.promptTemplate.length;
metrics.notesAfter = (factory.defaultPromptNotes || "").length;
metrics.packCombinedAfter = metrics.promptTemplateAfter + metrics.notesAfter;
metrics.promptTemplateDelta = metrics.promptTemplateBefore - metrics.promptTemplateAfter;
metrics.notesDelta = metrics.notesBefore - metrics.notesAfter;
metrics.packCombinedDelta = metrics.packCombinedBefore - metrics.packCombinedAfter;
metrics.promptTemplateReductionPct = Number(
  ((100 * metrics.promptTemplateDelta) / metrics.promptTemplateBefore).toFixed(1)
);
metrics.packCombinedReductionPct = Number(
  ((100 * metrics.packCombinedDelta) / metrics.packCombinedBefore).toFixed(1)
);

const checks = {
  hasGamPres07: /GAM-PRES-07/.test(factory.promptTemplate),
  hasGamPres08: /GAM-PRES-08 DEPTH-SHAPED BODIES/.test(factory.promptTemplate),
  hasGamPres09: /GAM-PRES-09 ANTI-DEPTH-COLLAPSE/.test(factory.promptTemplate),
  hasGamPres10: /GAM-PRES-10 EVALUATE COMPLETION/.test(factory.promptTemplate),
  hasGamWb11Line: /GAM-WB-11 template:/.test(factory.promptTemplate),
  hasGamWb38e9Long: /GAM-WB-38E-9 contract FAIL \(explicit\)/.test(factory.promptTemplate),
  hasMinimalAssumptions: /minimal, reasonable assumptions/i.test(factory.promptTemplate),
  hasBriefPurpose: /Purpose: <brief purpose>/i.test(factory.promptTemplate),
  hasF1F9: /\(F1\)/.test(factory.promptTemplate) && /\(F9\)/.test(factory.promptTemplate),
  hasMix03: /MIX-03/.test(factory.promptTemplate),
  outputOrgCount: (factory.promptTemplate.match(/Output organisation:/g) || []).length,
  scopeCount: (factory.promptTemplate.match(/Scope boundaries:/g) || []).length
};
metrics.checks = checks;

if (!checks.hasGamPres07 || !checks.hasGamPres08 || !checks.hasGamPres09 || !checks.hasGamPres10) {
  throw new Error("GAM-PRES-07..10 missing: " + JSON.stringify(checks));
}
if (checks.hasGamWb11Line || checks.hasGamWb38e9Long || checks.hasMinimalAssumptions || checks.hasBriefPurpose) {
  throw new Error("Wave A residue check failed: " + JSON.stringify(checks));
}
if (metrics.packCombinedDelta < 4500) {
  throw new Error(
    `Reduction ${metrics.packCombinedDelta} chars < 4500 required (${metrics.packCombinedBefore} → ${metrics.packCombinedAfter})`
  );
}
if (checks.outputOrgCount !== 1 || checks.scopeCount !== 1) {
  throw new Error("Output organisation / Scope must appear exactly once");
}

const newJson = JSON.stringify(factory, null, 2);
md = md.slice(0, jstart + 7) + "\n\n" + newJson + "\n" + md.slice(jend);
fs.writeFileSync(mdPath, md, "utf8");

const metricsPath = path.join(
  repoRoot,
  "docs/development/sprints/2026-06-06-sprint-38s-episode-plan-v1-implementation/artefacts/EV-38S-WAVE-A-gam-prompt-metrics.json"
);
fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2), "utf8");
console.log(JSON.stringify(metrics, null, 2));
