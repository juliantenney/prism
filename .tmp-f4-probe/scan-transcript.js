const fs = require("fs");
const path = require("path");
const readline = require("readline");

const file =
  "C:/Users/cczjrt/.cursor/projects/c-xampp-htdocs-prism/agent-transcripts/ba5346ff-db6a-465b-b4c3-10d65c96914c/ba5346ff-db6a-465b-b4c3-10d65c96914c.jsonl";

const rl = readline.createInterface({
  input: fs.createReadStream(file, { encoding: "utf8" }),
  crlfDelay: Infinity,
});

const needles = [
  "va-s6-base-rate",
  "15.4",
  "81.8",
  "lower-prevalence",
  "lower prevalence",
  "higher prevalence",
  "must_show",
  "post-refinement",
  "Figure 4",
  "base-rate",
  "generation_instruction",
  ".tmp-bayes",
  "learner-page.html",
];

let lineNo = 0;
const hits = [];
rl.on("line", (line) => {
  lineNo += 1;
  // Only scan recent-ish portion by size: keep last ~2000 lines mentally via counting later
  const lower = line.toLowerCase();
  for (const n of needles) {
    if (lower.includes(n.toLowerCase())) {
      hits.push({ lineNo, needle: n, len: line.length });
      break;
    }
  }
});
rl.on("close", () => {
  console.log("total lines", lineNo);
  console.log("hits", hits.length);
  // show last 80 hits
  for (const h of hits.slice(-80)) {
    console.log(h.lineNo, h.needle, "len", h.len);
  }
});
