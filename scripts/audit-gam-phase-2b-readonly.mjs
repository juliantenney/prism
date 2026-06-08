/**
 * Sprint 38S Phase 2B — read-only GAM prompt audit probe.
 * Run: node scripts/audit-gam-phase-2b-readonly.mjs
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const md = fs.readFileSync(
  path.join(repoRoot, "domains", "learning-design", "domain-learning-design-step-patterns.md"),
  "utf8"
);

const heading = "## 6. Generate Activity Materials";
const m = md.match(
  new RegExp(
    heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
      "[\\s\\S]*?### Prompt Factory\\s*```json\\s*([\\s\\S]*?)\\s*```"
  )
);
if (!m) throw new Error("GAM Prompt Factory not found");
const factory = JSON.parse(m[1]);
const tpl = factory.promptTemplate || "";
const notes = factory.defaultPromptNotes || "";

function findBlock(text, startRe, endRes) {
  const start = text.search(startRe);
  if (start < 0) return { found: false, text: "", start: -1, chars: 0 };
  let end = text.length;
  for (const er of endRes) {
    const idx = text.slice(start + 1).search(er);
    if (idx >= 0) end = Math.min(end, start + 1 + idx);
  }
  return { found: true, text: text.slice(start, end), start, chars: end - start };
}

const blocks = [
  { id: "header", label: "Context / Role / Task", ...findBlock(tpl, /^Context:/m, [/^Instructions:/m]) },
  { id: "instructions", label: "Core Instructions", ...findBlock(tpl, /^Instructions:/m, [/^Canonical contracts/m, /^GAM-PRES/m, /^Material-type/m]) },
  { id: "contracts_preamble", label: "Canonical contracts preamble", ...findBlock(tpl, /Canonical contracts \(runtime modules/m, [/^GAM-PRES/m, /^---/m]) },
  { id: "gam_pres", label: "GAM-PRES preservation block", ...findBlock(tpl, /GAM-PRES-00/m, [/GAM-WB-00/m, /^Usability requirements/m, /^Output organisation/m]) },
  { id: "gam_wb", label: "GAM-WB workbook genre block", ...findBlock(tpl, /GAM-WB-00/m, [/^Usability requirements/m, /^Output organisation/m, /^Material-type realisation/m]) },
  { id: "material_types", label: "Material-type realisation guidance", ...findBlock(tpl, /Material-type realisation/m, [/^Usability requirements/m, /^Output organisation/m, /^Anti-pattern/m]) },
  { id: "usability", label: "Usability requirements", ...findBlock(tpl, /^Usability requirements/m, [/^Output organisation/m, /^Anti-pattern/m, /^Self-directed/m]) },
  { id: "output_org", label: "Output organisation / format", ...findBlock(tpl, /^Output organisation/m, [/^Anti-pattern/m, /^Examples/m, /^Hard rules/m]) },
  { id: "anti_patterns", label: "Anti-patterns / FAIL rules", ...findBlock(tpl, /^Anti-pattern|^Hard rules|^FAIL rules/m, [/^Examples/m, /^Quality gates/m]) },
  { id: "examples", label: "Examples / illustrations", ...findBlock(tpl, /^Examples/m, [/^Quality gates/m, /^Session materials/m]) },
  { id: "quality_gates", label: "Quality gates / closure", ...findBlock(tpl, /^Quality gates/m, [/^Session materials/m, /^Appendix/m]) },
  { id: "default_notes", label: "defaultPromptNotes", text: notes, chars: notes.length, found: !!notes }
];

const shallowWords = [
  "concise",
  "brief",
  "short",
  "compact",
  "minimal",
  "summary-only",
  "summary only",
  "outline only",
  "lightweight",
  "terse"
];

function shallowHits(text, label) {
  return shallowWords
    .map((w) => {
      const re = new RegExp(`\\b${w}\\b`, "gi");
      const hits = text.match(re) || [];
      return hits.length ? { word: w, count: hits.length, label } : null;
    })
    .filter(Boolean);
}

const themes = [
  "do not redesign",
  "learning_activities as the source of truth",
  "full usable",
  "placeholder",
  "pipe table",
  "LD-TABLE-FIDELITY",
  "LD-MATERIALS-COPY",
  "anti-collapse",
  "depth_floor",
  "L3",
  "worked_example",
  "verification",
  "transfer",
  "consolidation",
  "template-only",
  "prompt_set",
  "orientation",
  "activation",
  "archetype",
  "function_sequence",
  "episode plan",
  "instructional function"
];

function themeCounts(text) {
  const out = {};
  themes.forEach((t) => {
    const re = new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    out[t] = (text.match(re) || []).length;
  });
  return out;
}

const gamPres = [...new Set(tpl.match(/GAM-PRES-\d+/g) || [])].sort();
const gamWb = [...new Set(tpl.match(/GAM-WB-\d+/g) || [])].sort();

// Runtime blocks via app.js probe pattern
function loadApi() {
  function createElementStub() {
    return {
      value: "",
      textContent: "",
      className: "",
      classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => false },
      style: {},
      dataset: {},
      children: [],
      appendChild() {},
      removeChild() {},
      setAttribute() {},
      removeAttribute() {},
      getAttribute: () => null,
      addEventListener: () => {},
      removeEventListener: () => {},
      focus: () => {},
      click: () => {}
    };
  }
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
    body: { appendChild: () => {}, removeChild: () => {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener: () => {},
    location: { hash: "", pathname: "/" },
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem: () => {} },
    URL: { createObjectURL: () => "", revokeObjectURL: () => {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  windowStub.window = windowStub;
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    document: documentStub,
    window: windowStub,
    _: { debounce: (fn) => fn }
  };
  vm.createContext(sandbox);
  for (const lib of [
    "sprint38-visual-affordances.js",
    "ld-table-fidelity.js",
    "ld-materials-copy.js",
    "ld-math-render.js",
    "ld-self-directed-rhetoric.js",
    "ld-design-page-compose-contract.js"
  ]) {
    vm.runInContext(fs.readFileSync(path.join(repoRoot, "lib", lib), "utf8"), sandbox, { filename: lib });
  }
  vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

const api = loadApi();
const wf = {
  goal: "Learner self-study inflation workbook",
  desiredOutputs: "activity_materials, page",
  workflowOutputs: ["page"],
  workflowBriefResolution: { resolvedFactors: { delivery_context: "self_directed", learning_environments: ["self_study"] } }
};
const step = {
  canonical_step_id: "step_generate_activity_materials",
  title: "Generate Activity Materials",
  outputName: "activity_materials"
};
const seeded = api.buildSeededStepPromptForWorkflowStep({
  workflowName: "Audit",
  step,
  matchedPattern: { promptFactory: factory }
});
const augmented = api.applyWorkflowStepRuntimePromptAugmentations(seeded, step, wf, {});

function extractRuntimeBlock(title) {
  const re = new RegExp(
    `(?:^|\\n)(${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\(auto-applied\\):[\\s\\S]*?)(?=\\n[A-Z][^\\n]{0,80} \\(auto-applied\\):|$)`,
    "i"
  );
  const hit = augmented.match(re);
  return hit ? hit[1].trim() : "";
}

const runtimeBlocks = [
  "LD-TABLE-FIDELITY",
  "Self-directed learner-page reading sufficiency",
  "Self-directed learner-page material voice",
  "Self-directed timeline sequencing alignment",
  "LD-SELF-DIRECTED-RHETORIC",
  "LD-MATH-RENDER"
].map((title) => ({
  title,
  chars: extractRuntimeBlock(title).length,
  shallow: shallowHits(extractRuntimeBlock(title), title)
}));

// Overlap: table rules in pack vs LD-TABLE-FIDELITY
const tableFidelityLib = fs.readFileSync(path.join(repoRoot, "lib", "ld-table-fidelity.js"), "utf8");
const materialsCopyLib = fs.readFileSync(path.join(repoRoot, "lib", "ld-materials-copy.js"), "utf8");

const report = {
  measuredAt: new Date().toISOString(),
  sizes: {
    packTemplateChars: tpl.length,
    packNotesChars: notes.length,
    packCombinedChars: tpl.length + notes.length,
    seededChars: seeded.length,
    augmentedSelfDirectedChars: augmented.length,
    runtimeDeltaChars: augmented.length - seeded.length
  },
  packBlocks: blocks.map((b) => ({
    id: b.id,
    label: b.label,
    chars: b.chars,
    pctOfTemplate: b.chars ? Math.round((100 * b.chars) / tpl.length) : 0
  })),
  clauseIds: { gamPres, gamWb, gamPresCount: gamPres.length, gamWbCount: gamWb.length },
  shallowLanguage: {
    template: shallowHits(tpl, "template"),
    notes: shallowHits(notes, "notes"),
    runtime: runtimeBlocks.flatMap((b) => b.shallow)
  },
  themeRepetition: {
    template: themeCounts(tpl),
    notes: themeCounts(notes),
    combined: themeCounts(tpl + "\n" + notes)
  },
  runtimeBlocks: runtimeBlocks.map(({ title, chars, shallow }) => ({ title, chars, shallow })),
  overlapSignals: {
    packPipeTableMentions: (tpl.match(/pipe table|pipe-table|\|[^\n]+\|/gi) || []).length,
    packLdTableFidelityMentions: (tpl.match(/LD-TABLE-FIDELITY/gi) || []).length,
    packMaterialsCopyMentions: (tpl.match(/LD-MATERIALS-COPY/gi) || []).length,
    runtimeTableBlockChars: extractRuntimeBlock("LD-TABLE-FIDELITY").length,
    libTableFidelityChars: tableFidelityLib.length,
    libMaterialsCopyChars: materialsCopyLib.length
  }
};

console.log(JSON.stringify(report, null, 2));

const markers = [
  "Context:",
  "Role:",
  "Task:",
  "Instructions:",
  "Canonical contracts",
  "GAM-PRES-00",
  "GAM-PRES-08",
  "GAM-WB-00",
  "GAM-WB-06b",
  "GAM-WB-20",
  "Usability requirements",
  "Output organisation",
  "Material-type realisation",
  "Anti-pattern",
  "AP-01",
  "AP-05"
];
console.log("\n=== Marker offsets ===");
const offsets = markers.map((mk) => ({ mk, idx: tpl.indexOf(mk) }));
offsets.forEach(({ mk, idx }) => console.log(mk, idx >= 0 ? idx : "MISSING"));
console.log("\n=== Span sizes between markers ===");
for (let i = 0; i < offsets.length - 1; i += 1) {
  const a = offsets[i];
  const b = offsets[i + 1];
  if (a.idx >= 0 && b.idx >= 0 && b.idx > a.idx) {
    console.log(`${a.mk} → ${b.mk}: ${b.idx - a.idx} chars`);
  }
}

function sliceBetween(startMk, endMk) {
  const s = tpl.indexOf(startMk);
  const e = tpl.indexOf(endMk, s + startMk.length);
  if (s < 0 || e < 0) return "";
  return tpl.slice(s, e);
}

const pres00to08 = sliceBetween("GAM-PRES-00", "GAM-PRES-08");
const pres08toWb = sliceBetween("GAM-PRES-08", "GAM-WB-00");
const wb00toUsability = sliceBetween("GAM-WB-00", "Usability requirements");
const usabilityToOutput = sliceBetween("Usability requirements", "Output organisation");
const materialTypesBlock = sliceBetween("Material-type realisation", "Usability requirements");

const overlapPairs = [
  ["GAM-PRES vs GAM-WB worked_example", /worked_example/gi],
  ["GAM-PRES vs GAM-WB verification", /verification/gi],
  ["GAM-PRES vs GAM-WB transfer", /transfer/gi],
  ["GAM-PRES vs GAM-WB consolidation", /consolidation/gi],
  ["GAM-PRES vs GAM-WB depth_floor", /depth_floor|L3/gi],
  ["GAM-PRES vs GAM-WB anti-collapse", /anti-collapse|collapse/gi],
  ["GAM-PRES vs GAM-WB template-only", /template-only|template only/gi],
  ["Pack vs runtime pipe table", /pipe table|LD-TABLE-FIDELITY/gi],
  ["Pack vs runtime materials copy", /LD-MATERIALS-COPY|full bodies|placeholder/gi]
];

console.log("\n=== Refined block sizes ===");
[
  ["GAM-PRES-00..07", pres00to08.length],
  ["GAM-PRES-08..09 + tail", pres08toWb.length],
  ["GAM-WB block", wb00toUsability.length],
  ["Usability requirements", usabilityToOutput.length],
  ["Material-type realisation", materialTypesBlock.length],
  ["Output organisation+", tpl.length - tpl.indexOf("Output organisation")]
].forEach(([name, n]) => console.log(name + ":", n));

console.log("\n=== Theme counts by block ===");
const blockMap = {
  "GAM-PRES-00..07": pres00to08,
  "GAM-PRES-08+": pres08toWb,
  "GAM-WB": wb00toUsability,
  Usability: usabilityToOutput,
  "Material-types": materialTypesBlock
};
Object.entries(blockMap).forEach(([name, text]) => {
  console.log(
    name,
    JSON.stringify({
      worked_example: (text.match(/worked_example/gi) || []).length,
      verification: (text.match(/verification/gi) || []).length,
      transfer: (text.match(/transfer/gi) || []).length,
      consolidation: (text.match(/consolidation/gi) || []).length,
      depth_floor: (text.match(/depth_floor/gi) || []).length,
      L3: (text.match(/\bL3\b/g) || []).length,
      brief: (text.match(/\bbrief\b/gi) || []).length,
      pipe_table: (text.match(/pipe table|LD-TABLE-FIDELITY/gi) || []).length
    })
  );
});

// GAM-PRES-07/08 depth language
const depthSnippets = [];
["GAM-PRES-07", "GAM-PRES-08", "GAM-WB-01", "GAM-WB-02", "GAM-WB-06b"].forEach((id) => {
  const idx = tpl.indexOf(id);
  if (idx < 0) return;
  depthSnippets.push({ id, excerpt: tpl.slice(idx, idx + 420).replace(/\n/g, " ") });
});
console.log("\n=== Depth clause excerpts ===");
depthSnippets.forEach((s) => console.log(s.id + ":", s.excerpt.slice(0, 380) + "..."));

const outPath = path.join(repoRoot, "docs/development/sprints/2026-06-06-sprint-38s-episode-plan-v1-implementation/artefacts/EV-38S-2B-gam-audit-structure.txt");
const structureLines = [];
structureLines.push("GAM PACK STRUCTURE AUDIT");
structureLines.push("template chars: " + tpl.length);
structureLines.push("");
const headingRe = /^(GAM-PRES-\d+|GAM-WB-\d+|GAM-WB-38F-01|Usability requirements|Output organisation|Material-type realisation|Anti-pattern|AP-\d+|F\d+|Canonical contracts)/gm;
let hm;
const hits = [];
while ((hm = headingRe.exec(tpl)) !== null) {
  hits.push({ label: hm[1], idx: hm.index });
}
hits.sort((a, b) => a.idx - b.idx);
for (let i = 0; i < hits.length; i += 1) {
  const cur = hits[i];
  const next = hits[i + 1];
  const span = next ? next.idx - cur.idx : tpl.length - cur.idx;
  structureLines.push(`${String(cur.idx).padStart(6)} | ${String(span).padStart(5)} chars | ${cur.label}`);
}
fs.writeFileSync(outPath, structureLines.join("\n"), "utf8");
console.log("\nWrote structure map:", outPath);

const clauseRe = /(?:^|\n|\- )(GAM-PRES-\d+|GAM-WB-\d+|GAM-WB-38F-01|AP-\d+|AS-GAM-FAIL-\d+|EV-GAM-\d+)/g;
const clauseHits = [];
let cm;
while ((cm = clauseRe.exec(tpl)) !== null) {
  clauseHits.push({ id: cm[1], idx: cm.index });
}
const uniqClauses = [];
const seenClause = new Set();
clauseHits.forEach((row) => {
  if (seenClause.has(row.id)) return;
  seenClause.add(row.id);
  uniqClauses.push(row);
});
console.log("\n=== Per-clause spans (first occurrence) ===");
const clauseSizes = [];
for (let i = 0; i < uniqClauses.length; i += 1) {
  const cur = uniqClauses[i];
  const nxt = uniqClauses[i + 1];
  const span = nxt ? nxt.idx - cur.idx : tpl.length - cur.idx;
  clauseSizes.push({ id: cur.id, chars: span });
  console.log(String(span).padStart(5), cur.id);
}
const clauseOut = path.join(
  repoRoot,
  "docs/development/sprints/2026-06-06-sprint-38s-episode-plan-v1-implementation/artefacts/EV-38S-2B-gam-clause-sizes.json"
);
fs.writeFileSync(clauseOut, JSON.stringify({ clauseSizes, notesChars: notes.length }, null, 2));

const excerptPath = path.join(
  repoRoot,
  "docs/development/sprints/2026-06-06-sprint-38s-episode-plan-v1-implementation/artefacts/EV-38S-2B-gam-section-excerpts.txt"
);
const excerptParts = [];
["GAM-PRES-10", "GAM-WB-11", "GAM-WB-31", "Usability requirements", "Material-type realisation", "Anti-pattern", "AP-01", "AP-05"].forEach(
  (mk) => {
    const idx = tpl.indexOf(mk);
    if (idx < 0) return;
    excerptParts.push("\n===== " + mk + " (first 1200 chars) =====\n");
    excerptParts.push(tpl.slice(idx, idx + 1200));
  }
);
fs.writeFileSync(excerptPath, excerptParts.join("\n"), "utf8");
