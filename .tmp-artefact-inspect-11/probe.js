"use strict";
const fs = require("fs");
const html = fs.readFileSync(__dirname + "/index.html", "utf8");
const markers = [
  "artefactContract",
  "artefact-contract",
  "data-artefact",
  '"produces"',
  '"references"',
  "c5.E1",
  "assessment-constructed-E1",
  "ljArtefact",
  "learnerArtefact"
];
for (const m of markers) {
  console.log(m, "count", html.split(m).length - 1);
}
const re = /<script[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let n = 0;
while ((match = re.exec(html))) {
  const body = match[1];
  if (/produces|references|c5\.E1|artefact/i.test(body)) {
    console.log("---script", n, "len", body.length);
    const pi = body.indexOf("produces");
    if (pi >= 0) console.log(body.slice(Math.max(0, pi - 80), pi + 1200));
    const ri = body.indexOf('"references"');
    if (ri >= 0) console.log("REF@", ri, body.slice(ri, ri + 800));
  }
  n += 1;
}
console.log("scripts", n);

const dataRe = /data-lj-artefact-contract='([^']+)'|data-lj-artefact-contract="([^"]+)"/;
const dm = html.match(dataRe);
if (dm) console.log("data attr", (dm[1] || dm[2]).slice(0, 500));

const jsonRe = /PRISM_LJ_ARTEFACT[^=]*=\s*(\{[\s\S]*?\});/;
const jm = html.match(jsonRe);
if (jm) console.log("global", jm[1].slice(0, 800));
