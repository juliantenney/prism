const fs = require("fs");
const path = require("path");

const buf = fs.readFileSync(
  path.resolve(".tmp-f4-probe/edge-localhost-idb/000098.log")
);
const text = buf.toString("latin1");

const anchors = [
  "va-s5-base-rate-comparison",
  "vb-38-4-va-s5-base-rate",
  "base-rate-comparison-01",
  "must_show",
  "generation_instruction",
  "human_prompt",
  "detailed_description",
  "caption_intent",
  "requires_exact_data_match",
  "Lower prevalence of the condition",
  "81.8%",
  "15.4%",
];

for (const a of anchors) {
  let idx = 0;
  let n = 0;
  while ((idx = text.indexOf(a, idx)) !== -1 && n < 5) {
    n += 1;
    const start = Math.max(0, idx - 800);
    const end = Math.min(text.length, idx + 2500);
    const slice = text
      .slice(start, end)
      .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, ".");
    const out = path.resolve(
      `.tmp-f4-probe/idb-slices/${a.replace(/[^a-zA-Z0-9._-]+/g, "_")}-${n}.txt`
    );
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, slice);
    console.log("wrote", path.basename(out), "at", idx, "len", slice.length);
    idx += a.length;
  }
  if (n === 0) console.log("no", a);
}
