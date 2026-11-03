"use strict";
const fs = require("fs");
const html = fs.readFileSync(__dirname + "/index.html", "utf8");

// Pull commission-ish dependency prose near c4/c5
const needles = ["dependencies", "commission_id", '"c4"', '"c5"', '"c3"', "c4", "c5"];
for (const n of needles) {
  console.log(n, html.split(n).length - 1);
}

// Find lj-shell-manifest and nearby
const mid = html.indexOf("lj-shell-manifest");
console.log("manifest idx", mid);
if (mid >= 0) console.log(html.slice(mid, mid + 1500));

const aid = html.indexOf("lj-shell-artefact-contract");
console.log("artefact idx", aid);
if (aid >= 0) console.log(html.slice(aid, aid + 1800));
