import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const md = fs.readFileSync(
  path.join(repoRoot, "domains/learning-design/domain-learning-design-step-patterns.md"),
  "utf8"
);
const m = md.match(
  /## 6\. Generate Activity Materials[\s\S]*?### Prompt Factory\s*```json\s*([\s\S]*?)\s*```/
);
const f = JSON.parse(m[1].trim());
const metricsPath = path.join(
  repoRoot,
  "docs/development/sprints/2026-06-06-sprint-38s-episode-plan-v1-implementation/artefacts/EV-38S-WAVE-A-gam-prompt-metrics.json"
);
const metrics = JSON.parse(fs.readFileSync(metricsPath, "utf8"));
metrics.promptTemplateAfter = f.promptTemplate.length;
metrics.notesAfter = (f.defaultPromptNotes || "").length;
metrics.packCombinedAfter = metrics.promptTemplateAfter + metrics.notesAfter;
metrics.promptTemplateDelta = metrics.promptTemplateBefore - metrics.promptTemplateAfter;
metrics.notesDelta = metrics.notesBefore - metrics.notesAfter;
metrics.packCombinedDelta = metrics.packCombinedBefore - metrics.packCombinedAfter;
fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2));
console.log(JSON.stringify(metrics, null, 2));
