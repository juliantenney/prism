const fs = require("fs");
const path = ".tmp-t007-closure-probe/c1/learner-page.html";
const html = fs.readFileSync(path, "utf8");

const re = /<figure[\s\S]*?<\/figure>/gi;
let m;
let i = 0;
while ((m = re.exec(html))) {
  i += 1;
  const f = m[0];
  if (/base|prior|prevalence|15|81|posterior|1%|20%|va-s6/i.test(f)) {
    console.log("==== FIGURE", i, "len", f.length, "====");
    console.log(f.slice(0, 4000));
    console.log("---END---");
  }
}
console.log("total figures", i);

const idxs = [];
const needle = "va-s6-base-rate";
let pos = 0;
while ((pos = html.indexOf(needle, pos)) !== -1) {
  idxs.push(pos);
  pos += needle.length;
}
console.log("va-s6-base-rate occurrences", idxs.length);
for (const p of idxs.slice(0, 5)) {
  console.log("---ctx---");
  console.log(html.slice(Math.max(0, p - 400), p + 1200));
}

// Also search numerical values
for (const n of ["15.4", "81.8", "15%", "81%", "1%", "20%", "90%", "5%"]) {
  const c = (html.match(new RegExp(n.replace(".", "\\."), "g")) || []).length;
  console.log("count", n, c);
}
