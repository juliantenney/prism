/**
 * Sprint 38S Phase 2B — GAM pack dedupe (subtraction only).
 * 1. Remove standalone Material-type realisation section
 * 2. Deduplicate Output organisation / Scope (keep last canonical copy)
 * 3. Remove GAM-WB-22..31 archetype-conditioned packs
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

function removeMaterialTypeSection(t) {
  const startMarker = "\n\nMaterial-type realisation guidance:";
  const endMarker = "\n\nUsability requirements:";
  const start = t.indexOf(startMarker);
  if (start === -1) {
    console.warn("Material-type section not found");
    return { text: t, removed: 0 };
  }
  const end = t.indexOf(endMarker, start + startMarker.length);
  if (end === -1) throw new Error("Usability requirements not found after Material-type");
  return { text: t.slice(0, start) + t.slice(end), removed: end - start };
}

function removeGamWb22Through31(t) {
  const start = t.indexOf("GAM-WB-22");
  if (start === -1) {
    console.warn("GAM-WB-22 not found");
    return { text: t, removed: 0 };
  }
  const endMarker = "- Anti-patterns (workbook FAIL)";
  const end = t.indexOf(endMarker, start);
  if (end === -1) throw new Error("Anti-patterns marker not found after GAM-WB-22");
  let before = t.slice(0, start);
  const after = t.slice(end);
  if (before.endsWith("answer- ")) {
    before = before.slice(0, -9) + "answer";
  } else if (before.endsWith("answer-")) {
    before = before.slice(0, -8) + "answer";
  }
  if (!before.endsWith("\n") && before.length) before += "\n";
  return { text: before + after, removed: end - start };
}

function dedupeOutputOrganisationBlocks(t) {
  const scopeMarker = "Scope boundaries:";
  const tailMarker = "Return only the final organised materials content.";
  const blocks = [];
  let searchFrom = 0;
  while (searchFrom < t.length) {
    const scopeIdx = t.indexOf(scopeMarker, searchFrom);
    if (scopeIdx === -1) break;
    const tailIdx = t.indexOf(tailMarker, scopeIdx);
    if (tailIdx === -1) break;
    const blockEnd = tailIdx + tailMarker.length;
    blocks.push({ start: scopeIdx, end: blockEnd });
    searchFrom = blockEnd;
  }
  if (blocks.length <= 1) {
    return { text: t, removed: 0, duplicateBlocks: 0 };
  }
  let out = t;
  let removed = 0;
  for (let i = blocks.length - 2; i >= 0; i -= 1) {
    const b = blocks[i];
    removed += b.end - b.start;
    out = out.slice(0, b.start) + out.slice(b.end);
  }
  return { text: out, removed, duplicateBlocks: blocks.length - 1 };
}

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

let md = fs.readFileSync(mdPath, "utf8");
const metrics = { phase: "38S-2B", timestamp: new Date().toISOString() };

const { factory, jstart, jend } = extractGamFactory(md);
metrics.promptTemplateBefore = factory.promptTemplate.length;
metrics.notesBefore = (factory.defaultPromptNotes || "").length;
metrics.packCombinedBefore = metrics.promptTemplateBefore + metrics.notesBefore;

let tpl = factory.promptTemplate;
const r1 = removeMaterialTypeSection(tpl);
tpl = r1.text;
metrics.materialTypeRemoved = r1.removed;

const r2 = removeGamWb22Through31(tpl);
tpl = r2.text;
metrics.gamWb2231Removed = r2.removed;

const r3 = dedupeOutputOrganisationBlocks(tpl);
tpl = r3.text;
metrics.outputOrgDuplicatesRemoved = r3.duplicateBlocks;
metrics.outputOrgCharsRemoved = r3.removed;

factory.promptTemplate = tpl;

metrics.promptTemplateAfter = factory.promptTemplate.length;
metrics.notesAfter = (factory.defaultPromptNotes || "").length;
metrics.packCombinedAfter = metrics.promptTemplateAfter + metrics.notesAfter;
metrics.promptTemplateDelta = metrics.promptTemplateBefore - metrics.promptTemplateAfter;
metrics.packCombinedDelta = metrics.packCombinedBefore - metrics.packCombinedAfter;
metrics.promptTemplateReductionPct = Number(
  ((100 * metrics.promptTemplateDelta) / metrics.promptTemplateBefore).toFixed(1)
);

const checks = {
  hasMaterialTypeStandalone: /Material-type realisation guidance:/.test(factory.promptTemplate),
  hasGamWb22: /GAM-WB-22/.test(factory.promptTemplate),
  hasGamWb31: /GAM-WB-31/.test(factory.promptTemplate),
  hasGamPres00: /GAM-PRES-00/.test(factory.promptTemplate),
  hasGamPres10: /GAM-PRES-10/.test(factory.promptTemplate),
  hasOutputOrg: /Output organisation:/.test(factory.promptTemplate),
  hasScope: /Scope boundaries:/.test(factory.promptTemplate),
  outputOrgCount: (factory.promptTemplate.match(/Output organisation:/g) || []).length,
  scopeCount: (factory.promptTemplate.match(/Scope boundaries:/g) || []).length
};
metrics.checks = checks;

if (checks.hasMaterialTypeStandalone || checks.hasGamWb22 || checks.hasGamWb31) {
  throw new Error("Sanitisation incomplete: " + JSON.stringify(checks));
}
if (!checks.hasGamPres00 || !checks.hasGamPres10 || !checks.hasOutputOrg || !checks.hasScope) {
  throw new Error("Required GAM blocks missing: " + JSON.stringify(checks));
}
if (checks.outputOrgCount !== 1 || checks.scopeCount !== 1) {
  throw new Error("Output organisation / Scope must appear exactly once: " + JSON.stringify(checks));
}

const newJson = JSON.stringify(factory, null, 2);
md = md.slice(0, jstart + 7) + "\n\n" + newJson + "\n" + md.slice(jend);
fs.writeFileSync(mdPath, md, "utf8");

const metricsPath = path.join(
  repoRoot,
  "docs/development/sprints/2026-06-06-sprint-38s-episode-plan-v1-implementation/artefacts/EV-38S-2B-gam-prompt-metrics.json"
);
fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2), "utf8");
console.log(JSON.stringify(metrics, null, 2));
