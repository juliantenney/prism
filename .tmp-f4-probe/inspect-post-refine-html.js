const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(
  path.resolve(".tmp-bayes-post-refine/learner-page.html"),
  "utf8"
);

const figures = html.match(/<figure[\s\S]*?<\/figure>/gi) || [];
console.log("figures", figures.length);
figures.forEach((f, i) => {
  const text = f
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const src = (f.match(/src=\"([^\"]+)\"/) || [])[1];
  const alt = (f.match(/alt=\"([^\"]*)\"/) || [])[1];
  console.log("\n==== FIG", i + 1, "====");
  console.log("src", src);
  console.log("alt", alt);
  console.log("text", text.slice(0, 1200));
});

for (const n of [
  "15.4",
  "81.8",
  "15%",
  "82%",
  "81%",
  "1%",
  "20%",
  "90%",
  "5%",
  "lower",
  "higher",
  "prevalence",
  "posterior",
]) {
  const re = new RegExp(n.replace(/[.%]/g, "\\$&"), "gi");
  console.log("count", n, (html.match(re) || []).length);
}

// sections
const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) =>
  m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
);
console.log("\nH2s:");
h2s.forEach((t, i) => console.log(i + 1, t));
