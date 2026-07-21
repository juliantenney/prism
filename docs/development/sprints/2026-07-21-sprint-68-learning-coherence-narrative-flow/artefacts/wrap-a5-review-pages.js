"use strict";
const fs = require("node:fs");
const path = require("node:path");
const dir = __dirname;

function wrap(mode) {
  const full = fs.readFileSync(
    path.join(dir, "heteroscedasticity-a5-" + mode + "-mode-export.html"),
    "utf8"
  );
  const a5 = fs.readFileSync(
    path.join(dir, "heteroscedasticity-a5-" + mode + "-mode-a5-only.html"),
    "utf8"
  );
  const css = (full.match(/<style>([\s\S]*?)<\/style>/) || [])[1] || "";
  const title = mode === "beats" ? "A5 beats mode review" : "A5 moments mode review";
  const html =
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    "<title>" +
    title +
    "</title><style>" +
    css +
    '</style></head><body class="util-page-export util-page-export--vnext util-page-export--with-learning-header">' +
    '<div class="util-learner-page util-learner-renderer-vnext">' +
    a5 +
    "</div></body></html>";
  const out = path.join(dir, "heteroscedasticity-a5-" + mode + "-mode-a5-review.html");
  fs.writeFileSync(out, html);
  console.log("Wrote", out);
}

wrap("beats");
wrap("moments");
