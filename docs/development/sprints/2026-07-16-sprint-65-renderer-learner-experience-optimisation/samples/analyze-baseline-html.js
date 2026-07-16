const fs = require("node:fs");
const path = require("node:path");
const pack = path.join(
  __dirname
);
const html = fs.readFileSync(path.join(pack, "rna-hcv-baseline-render.html"), "utf8");
const ahtml = fs.readFileSync(path.join(pack, "ld-rna-hcv-assessment-baseline-render.html"), "utf8");

function headings(h) {
  return [...h.matchAll(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => ({
    t: m[1],
    text: m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 140)
  }));
}

function utilClasses(h) {
  const s = new Set();
  for (const m of h.matchAll(/class="([^"]+)"/g)) {
    m[1].split(/\s+/).forEach((c) => {
      if (c.startsWith("util-")) s.add(c);
    });
  }
  return [...s].sort();
}

function count(h, re) {
  return (h.match(re) || []).length;
}

const out = {
  heading_count: headings(html).length,
  headings: headings(html),
  body_label_count: count(html, />\s*Body\s*</gi),
  how_to_think: count(html, /How to think/gi),
  success_looks_like: count(html, /Success looks like/gi),
  what_to_do: count(html, /What to do/gi),
  connection: count(html, /Connection|Why this activity|activity preamble|coherence/gi),
  util_meta: count(html, /<details class="util-meta"/g),
  util_warn: count(html, /util-warn/g),
  planning_table: count(html, /planning_table/gi),
  closure: count(html, /closure|unmapped|beat.?material/gi),
  archetype_visible_labels: {
    understand: count(html, /\bunderstand\b/gi),
    apply: count(html, /\bapply\b/gi),
    analyse: count(html, /\banalyse\b|\banalyze\b/gi),
    evaluate: count(html, /\bevaluate\b/gi)
  },
  material_type_mentions: {
    worked_example: count(html, /worked example|worked_example/gi),
    classification_table: count(html, /classification table|classification_table/gi),
    checklist: count(html, /checklist/gi),
    scenario: count(html, /scenario/gi)
  },
  util_classes: utilClasses(html),
  learner_chars: html.split(/<details class="util-meta"/i)[0].length,
  meta_present: /<details class="util-meta"/i.test(html),
  meta_summary_preview: (() => {
    const parts = html.split(/<details class="util-meta"/i);
    if (parts.length < 2) return null;
    return parts[1].slice(0, 1500).replace(/\s+/g, " ");
  })(),
  assessment_headings: headings(ahtml).slice(0, 50)
};

fs.writeFileSync(path.join(pack, "rna-hcv-baseline-structure.json"), JSON.stringify(out, null, 2));
console.log("wrote structure json");
console.log("headings:", out.headings.length);
console.log("body labels:", out.body_label_count);
console.log("meta:", out.meta_present, "util classes:", out.util_classes.length);
