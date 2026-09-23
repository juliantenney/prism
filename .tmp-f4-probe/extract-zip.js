const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const zip = path.resolve(
  "docs/development/sprints/2026-09-22-sprint-86-expository-editorial-quality-and-qa/evidence/case-01-bayes/Bayes.zip"
);
const out = path.resolve(".tmp-bayes-zip-inspect");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

// Use tar (Windows 10+) or powershell expand
try {
  execFileSync(
    "powershell.exe",
    [
      "-NoProfile",
      "-Command",
      `Add-Type -AssemblyName System.IO.Compression.FileSystem; [IO.Compression.ZipFile]::ExtractToDirectory('${zip.replace(/'/g, "''")}', '${out.replace(/'/g, "''")}')`,
    ],
    { stdio: "inherit" }
  );
} catch (e) {
  console.error("extract failed", e.message);
  process.exit(1);
}

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
  const rel = path.relative(out, f);
  const st = fs.statSync(f);
  console.log(rel, st.size);
}
