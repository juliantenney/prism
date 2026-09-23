const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(
  path.resolve(".tmp-bayes-zip-inspect/learner-page.html"),
  "utf8"
);

const figures = html.match(/<figure[\s\S]*?<\/figure>/gi) || [];
console.log("figures", figures.length);
figures.forEach((f, i) => {
  const hasBase = /base|prior|prevalence|va-s6|posterior/i.test(f);
  console.log("--- fig", i + 1, "len", f.length, "base?", hasBase);
  if (hasBase || i === 3) {
    // strip tags lightly for readability
    const text = f
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    console.log(text.slice(0, 1500));
    const src = (f.match(/src=\"([^\"]+)\"/) || [])[1];
    console.log("src", src);
    const alt = (f.match(/alt=\"([^\"]*)\"/) || [])[1];
    console.log("alt", alt && alt.slice(0, 500));
  }
});

for (const n of ["15.4", "81.8", "15%", "82%", "81%", "1%", "20%", "90%", "5%", "lower", "higher"]) {
  const re = new RegExp(n.replace(/[.%]/g, "\\$&"), "gi");
  const c = (html.match(re) || []).length;
  console.log("count", n, c);
}

// Find surrounding prose for S6
const idx = html.toLowerCase().indexOf("base rate");
console.log("base rate idx", idx);
if (idx >= 0) console.log(html.slice(idx - 200, idx + 800).replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
