import fs from "fs";
const md = fs.readFileSync("domains/learning-design/domain-learning-design-step-patterns.md", "utf8");
const m = md.match(
  /## 6\. Generate Activity Materials[\s\S]*?### Prompt Factory\s*```json\s*([\s\S]*?)\s*```/
);
const f = JSON.parse(m[1]);
const t = f.promptTemplate;
console.log("len", t.length);
const markers = [
  "Material-type realisation guidance:",
  "Output organisation:",
  "Scope boundaries:",
  "GAM-WB-22",
  "GAM-WB-31",
  "Anti-patterns (workbook FAIL)"
];
for (const mk of markers) console.log(mk, t.indexOf(mk));

let c = 0;
for (let i = 0; i >= 0; ) {
  i = t.indexOf("Output organisation:", i + 1);
  if (i >= 0) {
    c += 1;
    console.log("Output org #" + c + " at", i);
  }
}
c = 0;
for (let i = 0; i >= 0; ) {
  i = t.indexOf("Scope boundaries:", i + 1);
  if (i >= 0) {
    c += 1;
    console.log("Scope #" + c + " at", i);
  }
}
c = 0;
for (let i = 0; i >= 0; ) {
  i = t.indexOf("Material-type realisation guidance:", i + 1);
  if (i >= 0) {
    c += 1;
    console.log("Material-type #" + c + " at", i);
  }
}

console.log("\nGAM-PRES-10 at", t.indexOf("GAM-PRES-10"));
console.log("\n--- 8800-9900 ---");
console.log(t.slice(8800, 9900));
console.log("\n--- GAM-WB-22 region ---");
const i22 = t.indexOf("GAM-WB-22");
console.log(t.slice(i22, i22 + 800));
console.log("\n--- tail from 24800 ---");
console.log(t.slice(24800));

console.log("\n--- find Usability ---");
console.log("Usability", t.indexOf("Usability requirements:"));

console.log("\n--- material-type end (13800-14000) ---");
console.log(t.slice(13750, 13950));

console.log("\n--- before GAM-WB-22 ---");
console.log(t.slice(22300, 22600));

console.log("\n--- GAM-WB-31 to Anti-pattern ---");
console.log(t.slice(24500, 25100));

const phrases = [
  "Organise content with clear sections",
  "Activity: <activity title>",
  "Do not perform final platform/export packaging",
  "Return only the final organised materials"
];
for (const p of phrases) {
  let n = 0;
  for (let i = 0; i >= 0; ) {
    i = t.indexOf(p, i + 1);
    if (i >= 0) n += 1;
  }
  console.log(p, "count", n);
}

// GAM-WB-22 through 31 - list all lines
const wb22 = t.indexOf("GAM-WB-22");
const anti = t.indexOf("- Anti-patterns (workbook FAIL)");
console.log("\nGAM-WB-22..31 block length", anti - wb22);
console.log(t.slice(wb22, anti));

const phrases2 = ["Purpose: <instructional purpose>", "Material type labelling (38E-9)", "Mapped outcomes:"];
for (const p of phrases2) {
  let n = 0;
  for (let i = 0; i >= 0; ) {
    i = t.indexOf(p, i + 1);
    if (i >= 0) n += 1;
  }
  console.log(p, "count", n);
}

console.log("F8 count", (t.match(/\(F8\)/g) || []).length);
console.log("F9 count", (t.match(/\(F9\)/g) || []).length);

const pres02 = t.indexOf("GAM-PRES-02");
console.log("\nGAM-PRES-02 excerpt:", t.slice(pres02, pres02 + 400));

const i22b = t.indexOf("GAM-WB-22");
if (i22b >= 0) {
  console.log("\nBefore WB-22 JSON:", JSON.stringify(t.slice(i22b - 90, i22b + 15)));
}

const pres03 = t.indexOf("GAM-PRES-03");
console.log("\nGAM-PRES-03 excerpt:", t.slice(pres03, pres03 + 600));
console.log("scenario in tpl", /scenario/i.test(t));
console.log("task_cards in tpl", /task_cards/i.test(t));
console.log("GAM-WB-29", t.indexOf("GAM-WB-29"));
console.log("GAM-WB-29 excerpt:", t.slice(t.indexOf("GAM-WB-29") - 80, t.indexOf("GAM-WB-29") + 120));
