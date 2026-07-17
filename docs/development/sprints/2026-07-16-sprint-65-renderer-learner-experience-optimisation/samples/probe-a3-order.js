const fs = require("fs");
const dir =
  "docs/development/sprints/2026-07-16-sprint-65-renderer-learner-experience-optimisation/samples/validation/";
const c = fs.readFileSync(dir + "rna-hcv-current.html", "utf8");
const p = fs.readFileSync(dir + "rna-hcv-s65-prototype.html", "utf8");
function a3(html) {
  const start = html.search(/Plan an Outbreak/i);
  const end = html.search(/Analyse Immune Evasion/i);
  return html.slice(start, end > start ? end : start + 12000);
}
const A = a3(c);
const B = a3(p);
function idx(s, re) {
  return s.search(re);
}
console.log("CURRENT A3", {
  whatToDo: idx(A, />What to do</i),
  success: idx(A, />Success looks like</i),
  planning: idx(A, />Planning Table</i),
  checkWork: idx(A, />Check your work</i)
});
console.log("PROTO A3", {
  yourTask: idx(B, />Your task</i),
  produce: idx(B, />Produce</i),
  planning: idx(B, />Planning Table</i),
  tryItBeforePlan: (() => {
    const t = idx(B, />Try it</i);
    const pl = idx(B, />Planning Table</i);
    return t > -1 && pl > -1 && t < pl;
  })(),
  checkWork: idx(B, />Check your work</i),
  residual: idx(B, /data-s65-residual/),
  planBeforeCheck: idx(B, />Planning Table</i) < idx(B, />Check your work</i)
});
console.log("CURRENT plan before check?", idx(A, />Planning Table</i) < idx(A, />Check your work</i));

// marx-beat first activity
const mc = fs.readFileSync(dir + "marx-beat-current.html", "utf8");
const mp = fs.readFileSync(dir + "marx-beat-s65-prototype.html", "utf8");
console.log("marx badges", {
  c: (mc.match(/<span class="s65-mode-badge"/g) || []).length,
  p: (mp.match(/<span class="s65-mode-badge"/g) || []).length,
  modes: [...mp.matchAll(/<span class="s65-mode-badge">([^<]+)/g)].map((m) => m[1])
});

// role headings rna
console.log("role headings proto", {
  understandIdea: (p.match(/Understand the idea/g) || []).length,
  seeExample: (p.match(/See an example/g) || []).length,
  tryIt: (p.match(/>Try it</g) || []).length,
  beatUnderstand: (p.match(/>Understand</g) || []).length
});
console.log("beat labels current", {
  understand: (c.match(/>Understand</g) || []).length,
  yourTurn: (c.match(/>Your turn</g) || []).length
});
