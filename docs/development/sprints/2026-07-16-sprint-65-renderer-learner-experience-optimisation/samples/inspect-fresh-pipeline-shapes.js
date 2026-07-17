const fs = require("fs");
const path = require("path");

const liveRoot =
  "docs/development/sprints/2026-06-11-sprint-42-authorial-quality-educational-exposition/captures/sprint-42-exposition/42-4-live-runs";

function walk(o, fn) {
  if (!o || typeof o !== "object") return;
  if (Array.isArray(o)) {
    o.forEach((x) => walk(x, fn));
    return;
  }
  Object.keys(o).forEach((k) => {
    fn(k, o[k], o);
    walk(o[k], fn);
  });
}

function inspectJson(file) {
  if (!fs.existsSync(file)) return { missing: true };
  const j = JSON.parse(fs.readFileSync(file, "utf8"));
  let beatsArrays = 0;
  let beatCount = 0;
  let episodePlans = 0;
  const archetypes = new Set();
  let learnerTasks = 0;
  let activityIds = 0;
  let cognitionHits = 0;
  const cognitionKeys = [
    "activity_preamble",
    "reasoning_orientation",
    "disciplinary_lens",
    "intellectual_coherence_bridge",
    "self_explanation_prompt"
  ];
  walk(j, (k, v) => {
    if (k === "beats" && Array.isArray(v)) {
      beatsArrays += 1;
      beatCount += v.length;
    }
    if (k === "episode_plan" && v && typeof v === "object") episodePlans += 1;
    if (k === "archetype" && typeof v === "string" && v.trim()) archetypes.add(v.trim().toLowerCase());
    if (k === "learner_task") learnerTasks += 1;
    if (k === "activity_id") activityIds += 1;
    if (cognitionKeys.includes(k) && v) cognitionHits += 1;
  });
  const sections = Array.isArray(j.sections)
    ? j.sections.map((s) => s.section_id || s.heading || "?")
    : [];
  return {
    bytes: fs.statSync(file).size,
    sections,
    sectionCount: sections.length,
    beatsArrays,
    beatCount,
    episodePlans,
    archetypes: [...archetypes],
    learnerTasks,
    activityIds,
    cognitionHits
  };
}

const dirs = fs
  .readdirSync(liveRoot)
  .filter((d) => d.includes("2026-07-16"))
  .sort();

console.log("Fresh run dirs:", dirs);
for (const d of dirs) {
  const base = path.join(liveRoot, d);
  console.log("\n===", d, "===");
  console.log("design-page", inspectJson(path.join(base, "design-page.json")));
  console.log("dla", inspectJson(path.join(base, "dla-learning-activities.json")));
}
