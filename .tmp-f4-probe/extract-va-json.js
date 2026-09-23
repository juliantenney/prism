const fs = require("fs");
const path = require("path");

const text = fs
  .readFileSync(path.resolve(".tmp-f4-probe/edge-localhost-idb/000098.log"))
  .toString("latin1");

const id = '"affordance_id": "va-S5-base-rate-comparison-01"';
const idx = text.indexOf(id);
if (idx < 0) {
  console.log("not found");
  process.exit(1);
}
// find enclosing object - walk back to nearest '{' before affordance and forward matching braces
let start = idx;
while (start > 0 && text[start] !== "{") start--;
let depth = 0;
let end = start;
for (let i = start; i < text.length; i++) {
  const ch = text[i];
  if (ch === "{") depth++;
  else if (ch === "}") {
    depth--;
    if (depth === 0) {
      end = i + 1;
      break;
    }
  }
}
let raw = text.slice(start, end);
// clean non-printable that might break JSON
raw = raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
fs.writeFileSync(
  path.resolve(".tmp-f4-probe/va-s5-base-rate-comparison-01.json"),
  raw
);
console.log("extracted bytes", raw.length);
try {
  const obj = JSON.parse(raw);
  console.log(JSON.stringify(obj, null, 2));
} catch (e) {
  console.log("JSON parse failed", e.message);
  console.log(raw.slice(0, 2000));
}
