const fs = require("fs");
const path = require("path");

const dir = path.resolve(".tmp-f4-probe/edge-localhost-idb");
const files = fs.readdirSync(dir).filter((f) => /\.(ldb|log)$/i.test(f));

const needles = [
  "va-s5-base-rate",
  "15.4",
  "81.8",
  "Lower prevalence",
  "Higher prevalence",
  "generation_instruction",
  "must_show",
  "base-rate",
  "Only the prior probability changes",
  "Posterior probability",
  "content_requirements",
  "human_prompt",
];

function extractPrintable(buf) {
  // Extract ASCII runs of length >= 40
  const out = [];
  let cur = "";
  for (let i = 0; i < buf.length; i++) {
    const c = buf[i];
    if (c >= 32 && c <= 126) {
      cur += String.fromCharCode(c);
    } else {
      if (cur.length >= 40) out.push(cur);
      cur = "";
    }
  }
  if (cur.length >= 40) out.push(cur);
  return out;
}

for (const file of files) {
  const full = path.join(dir, file);
  const buf = fs.readFileSync(full);
  console.log("\n====", file, buf.length, "====");
  const strings = extractPrintable(buf);
  for (const n of needles) {
    const hits = strings.filter((s) => s.includes(n));
    console.log(n, "stringHits", hits.length);
    for (const h of hits.slice(0, 3)) {
      const idx = h.indexOf(n);
      const start = Math.max(0, idx - 120);
      const end = Math.min(h.length, idx + 400);
      console.log("---ctx---");
      console.log(h.slice(start, end));
    }
  }
}
