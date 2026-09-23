const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const zip = path.resolve(
  "C:/Users/cczjrt/Downloads/rendered-output-learner-package (48).zip"
);
const out = path.resolve(".tmp-bayes-post-refine");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

execFileSync(
  "powershell.exe",
  [
    "-NoProfile",
    "-Command",
    `Add-Type -AssemblyName System.IO.Compression.FileSystem; [IO.Compression.ZipFile]::ExtractToDirectory('${zip.replace(/'/g, "''")}', '${out.replace(/'/g, "''")}')`,
  ],
  { stdio: "inherit" }
);

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}
const files = walk(out);
console.log("files", files.length);
for (const f of files) {
  console.log(path.relative(out, f), fs.statSync(f).size);
}
