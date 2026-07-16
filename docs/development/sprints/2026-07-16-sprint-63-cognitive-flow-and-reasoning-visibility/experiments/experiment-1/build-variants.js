/**
 * Sprint 63 Experiment 1 — non-production cognitive manifestation prototypes.
 * Uses only authored fixture fields. Does not modify production renderer.
 *
 * Usage: node build-variants.js
 */
const fs = require("fs");
const path = require("path");

const FIXTURE = path.resolve(
  __dirname,
  "../../../../../../tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json"
);
const OUT = __dirname;

const page = JSON.parse(fs.readFileSync(FIXTURE, "utf8"));
const byId = Object.fromEntries(page.activities.map((a) => [a.activity_id, a]));

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function mdLite(s) {
  // Preserve authored markdown lightly; do not invent content.
  return esc(s).replace(/\n/g, "<br>\n");
}

function material(act, type) {
  return (act.materials || []).filter((m) => m.material_type === type);
}

function first(act, type) {
  const list = material(act, type);
  return list[0] || null;
}

function renderMaterialBlock(m, roleLabel) {
  if (!m) return "";
  const label = roleLabel
    ? `<p class="exp-role"><strong>${esc(roleLabel)}</strong></p>`
    : "";
  const title = m.title && !/^S\d{2}\s+RNA\s+/i.test(m.title) ? m.title : null;
  // Suppress RNA fixture artefact titles (same spirit as Sprint 62 rule); keep body.
  const titleHtml = title ? `<h4>${esc(title)}</h4>` : "";
  let body = mdLite(m.body);
  if (m.material_type && String(m.material_type).includes("table")) {
    body = `<pre class="exp-table">${esc(m.body)}</pre>`;
  }
  if (m.material_type === "checklist") {
    body =
      "<ul>" +
      String(m.body || "")
        .split(/\n/)
        .filter((l) => l.trim())
        .map((l) => `<li>${esc(l.replace(/^[-*]\s*/, ""))}</li>`)
        .join("") +
      "</ul>";
  }
  return `<section class="exp-material" data-material-id="${esc(m.material_id)}" data-material-type="${esc(m.material_type)}">${label}${titleHtml}<div class="exp-body">${body}</div></section>`;
}

function shell(title, note, body) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(title)}</title>
<style>
body{font-family:Georgia,serif;max-width:820px;margin:24px auto;padding:0 16px;line-height:1.55;color:#111}
.exp-banner{background:#f3f4f6;border:1px solid #d1d5db;padding:12px 14px;margin-bottom:20px;font-size:.92rem}
.exp-banner strong{display:block;margin-bottom:4px}
article{border:1px solid #e5e7eb;border-radius:8px;padding:18px 20px;margin:0 0 28px}
h1{font-size:1.35rem}h2{font-size:1.15rem;margin-top:0}h3{font-size:1.05rem;margin:18px 0 8px;color:#1f2937}
.exp-meta{font-size:.85rem;color:#4b5563;margin:0 0 12px}
.exp-phase{margin:16px 0;padding:12px 14px;border-left:3px solid #64748b;background:#f8fafc}
.exp-phase h3{margin-top:0;color:#0f172a}
.exp-role{margin:0 0 6px;font-size:.9rem;color:#334155}
.exp-material{margin:10px 0 14px}
.exp-table{white-space:pre-wrap;background:#fff;border:1px solid #e5e7eb;padding:10px;font-family:ui-monospace,Consolas,monospace;font-size:.85rem}
.exp-generic .exp-phase{border-left-color:#94a3b8}
.exp-class .exp-phase{border-left-color:#2563eb}
.exp-causal .exp-phase{border-left-color:#b45309}
.exp-eval .exp-phase{border-left-color:#7c3aed}
.exp-excluded{font-size:.85rem;color:#6b7280;font-style:italic}
ul{margin:8px 0 8px 1.2rem}
</style>
</head>
<body>
<div class="exp-banner"><strong>Sprint 63 — Experiment 1 (non-production)</strong>${note}</div>
${body}
</body>
</html>`;
}

function genericActivity(act) {
  const beats = (act.episode_plan && act.episode_plan.beats) || [];
  const beatLabels = {
    explanation: "Understand",
    worked_thinking: "See it modelled",
    worked_judgement: "See it modelled",
    guided_practice: "Your turn",
    verification: "Check your work",
    transfer: "Apply elsewhere"
  };
  const mats = act.materials || [];
  // Approximate Sprint 62 generic: task, then beats with materials in authored order grouped loosely by beat index
  let html = `<article class="exp-generic" data-activity-id="${esc(act.activity_id)}">
<h2>${esc(act.title)}</h2>
<p class="exp-meta">Duration: ${esc(act.duration_minutes)} mins · Grouping: ${esc(act.grouping)} · Episode: ${esc(act.episode_plan && act.episode_plan.archetype)}</p>`;

  const inventory = /,\s*and\s+|,\s*[^,]+,\s*/.test(act.learner_task);
  if (!inventory && /^(complete|analyse|analyze|compare)/i.test(act.learner_task)) {
    html += `<div class="exp-phase"><h3>Your goal</h3><p>${esc(act.learner_task)}</p></div>`;
  } else {
    html += `<div class="exp-phase"><h3>What to do</h3><p>${esc(act.learner_task)}</p></div>`;
  }

  const checklist = first(act, "checklist");
  if (checklist) {
    html += `<div class="exp-phase"><h3>Success looks like</h3>${renderMaterialBlock(checklist, null)}</div>`;
  }

  // Generic: dump materials under beat labels in sequence by type heuristic
  const order = mats.slice();
  let bi = 0;
  for (const m of order) {
    const beat = beats[Math.min(bi, beats.length - 1)];
    const fn = beat && beat.function;
    const label = beatLabels[fn] || fn || "Material";
    html += `<div class="exp-phase"><h3>${esc(label)}</h3>${renderMaterialBlock(m, null)}</div>`;
    if (fn === "explanation" && m.material_type === "text") bi = 1;
    else if ((fn === "worked_thinking" || fn === "worked_judgement") && /worked|sample|modelling/.test(m.material_type)) bi = Math.max(bi, 2);
    else if (/table|template|scenario/.test(m.material_type)) bi = Math.max(bi, 2);
    else if (m.material_type === "checklist") bi = Math.max(bi, 3);
    else if (m.material_type === "transfer_prompt") bi = Math.max(bi, 3);
  }

  html += `</article>`;
  return html;
}

function classificationA1(act) {
  const text = first(act, "text");
  const worked = first(act, "worked_example");
  const sample = first(act, "sample_output");
  const table = first(act, "classification_table");
  const checklist = first(act, "checklist");

  // Labels only when corresponding content exists. No invented principle.
  let html = `<article class="exp-class" data-activity-id="A1" data-manifestation="classification">
<h2>${esc(act.title)}</h2>
<p class="exp-meta">Experimental manifestation: <strong>Classification</strong> (Tier 2) · Episode: understand</p>`;

  html += `<div class="exp-phase"><h3>What to do</h3><p>${esc(act.learner_task)}</p>
<p class="exp-excluded">Excluded: “Your goal” — inventory-style learner_task (Sprint 62 rule).</p></div>`;

  if (checklist) {
    html += `<div class="exp-phase"><h3>Success looks like</h3>${renderMaterialBlock(checklist, null)}</div>`;
  }

  // Organising content = existing exposition only (no invented principle label claiming more than body)
  if (text) {
    html += `<div class="exp-phase"><h3>Understand the categories</h3>
<p class="exp-excluded">Label “What separates the categories?” withheld — organising principle is not separately authored; exposition body is shown unchanged.</p>
${renderMaterialBlock(text, "Authored exposition")}</div>`;
  }

  if (worked || sample) {
    html += `<div class="exp-phase"><h3>See a classification modelled</h3>`;
    if (worked) html += renderMaterialBlock(worked, "Worked classification");
    if (sample) html += renderMaterialBlock(sample, "Sample classification");
    html += `</div>`;
  }

  if (table) {
    html += `<div class="exp-phase"><h3>Classify the cases</h3>${renderMaterialBlock(table, "Classification table")}</div>`;
  }

  if (checklist) {
    html += `<div class="exp-phase"><h3>Check your classification</h3>
<p class="exp-excluded">“Explain your classification” / “Check the boundaries” withheld as separate prompts — no self-explanation field or boundary material authored. Checklist reused as verification instrument.</p>
${renderMaterialBlock(checklist, "Checklist")}</div>`;
  }

  html += `<div class="exp-phase"><h3>Output</h3><p>${esc(act.expected_output)}</p></div>`;
  html += `</article>`;
  return html;
}

function causalA2(act) {
  const text = first(act, "text");
  const worked = first(act, "worked_example");
  const table = first(act, "analysis_table");
  const checklist = first(act, "checklist");

  let html = `<article class="exp-causal" data-activity-id="A2" data-manifestation="causal">
<h2>${esc(act.title)}</h2>
<p class="exp-meta">Experimental manifestation: <strong>Mechanism / causal explanation</strong> (Tier 2) · Episode: analyse</p>`;

  html += `<div class="exp-phase"><h3>Your goal</h3><p>${esc(act.learner_task)}</p></div>`;

  if (checklist) {
    html += `<div class="exp-phase"><h3>Success looks like</h3>${renderMaterialBlock(checklist, null)}</div>`;
  }

  if (text) {
    html += `<div class="exp-phase"><h3>Start with the mechanism</h3>
${renderMaterialBlock(text, "Authored overview")}
<p class="exp-excluded">“Starting condition” as a separate structural field unavailable — no archetype_plan.start at render time.</p></div>`;
  }

  if (worked) {
    html += `<div class="exp-phase"><h3>Follow the causal chain</h3>
${renderMaterialBlock(worked, "Worked analysis")}
<p class="exp-excluded">Causal steps not extracted into a separate list — only authored worked-example prose is shown (no invented links).</p></div>`;
  }

  if (table) {
    html += `<div class="exp-phase"><h3>Trace the chain</h3>
${renderMaterialBlock(table, "Analysis table")}
<p class="exp-excluded">“Cross-scale consequence” element unavailable — not authored as a distinct field.</p></div>`;
  }

  if (checklist) {
    html += `<div class="exp-phase"><h3>Test your explanation</h3>${renderMaterialBlock(checklist, "Causal-chain check (authored checklist)")}</div>`;
  }

  // Expected output is checklist-restatement style — omit duplicate trailing output if already in success
  html += `<p class="exp-excluded">Trailing Output omitted — expected_output restates checklist verification (“verified with checklist”).</p>`;
  html += `</article>`;
  return html;
}

function evaluationA6(act) {
  const text = first(act, "text");
  const scenario = first(act, "scenario");
  const worked = first(act, "worked_example");
  const table = first(act, "decision_table");
  const template = first(act, "template");
  const checklist = first(act, "checklist");
  const transfer = first(act, "transfer_prompt");

  let html = `<article class="exp-eval" data-activity-id="A6" data-manifestation="evaluation">
<h2>${esc(act.title)}</h2>
<p class="exp-meta">Experimental manifestation: <strong>Evaluation and judgement</strong> (Tier 2) · Episode: evaluate</p>`;

  html += `<div class="exp-phase"><h3>What to do</h3><p>${esc(act.learner_task)}</p>
<p class="exp-excluded">Excluded: “What are you deciding?” / “Your goal” — inventory-style learner_task; inventing an evaluative question would add meaning. Framing text below is authored material only.</p></div>`;

  if (checklist) {
    html += `<div class="exp-phase"><h3>Success looks like</h3>${renderMaterialBlock(checklist, null)}</div>`;
  }

  if (text) {
    html += `<div class="exp-phase"><h3>Situation framing</h3>${renderMaterialBlock(text, "Authored framing")}</div>`;
  }

  if (scenario) {
    html += `<div class="exp-phase"><h3>Options under constraint</h3>${renderMaterialBlock(scenario, "Authored scenario")}</div>`;
  }

  if (worked) {
    html += `<div class="exp-phase"><h3>See a judgement modelled</h3>${renderMaterialBlock(worked, "Worked judgement")}</div>`;
  }

  if (table) {
    html += `<div class="exp-phase"><h3>Weigh the options</h3>
${renderMaterialBlock(table, "Decision table")}
<p class="exp-excluded">“Explicit criteria” as archetype_plan.criteria unavailable at render time. Criteria appear only where authored (checklist + table column header “Criterion”).</p></div>`;
  }

  if (template) {
    html += `<div class="exp-phase"><h3>Make your judgement</h3>
${renderMaterialBlock(template, "Memo template")}
<p class="exp-role">Template already asks for Claim / Reasons / Limits — used as justification scaffold without adding new prompts.</p></div>`;
  }

  if (checklist) {
    html += `<div class="exp-phase"><h3>Check your work</h3>${renderMaterialBlock(checklist, "Checklist")}</div>`;
  }

  if (transfer) {
    html += `<div class="exp-phase"><h3>Apply elsewhere</h3>${renderMaterialBlock(transfer, "Transfer prompt")}
<p class="exp-excluded">Transfer kept in authored relative position after practice materials; not moved after Verify beyond checklist pairing for review clarity. Authored beat order remains Transfer before Verification in source episode_plan.</p></div>`;
  }

  html += `<div class="exp-phase"><h3>Output</h3><p>${esc(act.expected_output)}</p></div>`;
  html += `</article>`;
  return html;
}

const A1 = byId.A1;
const A2 = byId.A2;
const A6 = byId.A6;

const noteG =
  "Variant <strong>G</strong> — generic baseline approximation (Sprint 62-style labels; materials in authored order). Full production HTML also saved as variant-G-generic-baseline.html.";
const noteC1 =
  "Variant <strong>C1</strong> — classification manifestation on A1 only; A2/A6 generic.";
const noteC2 =
  "Variant <strong>C2</strong> — causal manifestation on A2 only; A1/A6 generic.";
const noteC3 =
  "Variant <strong>C3</strong> — evaluation manifestation on A6 only; A1/A2 generic.";
const noteAll =
  "Variant <strong>Combined</strong> — A1 classification + A2 causal + A6 evaluation manifestations active together.";

fs.writeFileSync(
  path.join(OUT, "variant-C1-classification-A1.html"),
  shell(
    "Experiment 1 — C1 Classification",
    noteC1,
    classificationA1(A1) + genericActivity(A2) + genericActivity(A6)
  )
);
fs.writeFileSync(
  path.join(OUT, "variant-C2-causal-A2.html"),
  shell(
    "Experiment 1 — C2 Causal",
    noteC2,
    genericActivity(A1) + causalA2(A2) + genericActivity(A6)
  )
);
fs.writeFileSync(
  path.join(OUT, "variant-C3-evaluation-A6.html"),
  shell(
    "Experiment 1 — C3 Evaluation",
    noteC3,
    genericActivity(A1) + genericActivity(A2) + evaluationA6(A6)
  )
);
fs.writeFileSync(
  path.join(OUT, "variant-combined-A1-A2-A6.html"),
  shell(
    "Experiment 1 — Combined",
    noteAll,
    classificationA1(A1) + causalA2(A2) + evaluationA6(A6)
  )
);

// Lightweight generic A1–A6-only page for side-by-side review (in addition to full production HTML)
fs.writeFileSync(
  path.join(OUT, "variant-G-generic-A1-A2-A6.html"),
  shell(
    "Experiment 1 — G Generic (A1/A2/A6)",
    noteG,
    genericActivity(A1) + genericActivity(A2) + genericActivity(A6)
  )
);

const diagnostic = {
  activities: ["A1", "A2", "A6"].map((id) => {
    const a = byId[id];
    return {
      activity_id: id,
      title: a.title,
      episode_archetype: a.episode_plan.archetype,
      beat_functions: a.episode_plan.beats.map((b) => b.function),
      material_types: a.materials.map((m) => m.material_type),
      interaction_type: a.activity_interaction_type || null,
      learner_task: a.learner_task,
      expected_output: a.expected_output,
      reasoning_orientation: a.reasoning_orientation || null,
      self_explanation_prompt: a.self_explanation_prompt || null,
      instructional_archetype_on_materials: a.materials.some((m) => m.instructional_archetype) || false
    };
  })
};
fs.writeFileSync(path.join(OUT, "signal-diagnostic.json"), JSON.stringify(diagnostic, null, 2));

console.log("Wrote experiment variants to", OUT);
