const fs = require("fs");
const readline = require("readline");

const file =
  "C:/Users/cczjrt/.cursor/projects/c-xampp-htdocs-prism/agent-transcripts/ba5346ff-db6a-465b-b4c3-10d65c96914c/ba5346ff-db6a-465b-b4c3-10d65c96914c.jsonl";

const want = new Set([7630, 7643, 7656, 7812, 7813, 7957, 7993, 8008, 8009, 8024]);
const rl = readline.createInterface({
  input: fs.createReadStream(file, { encoding: "utf8" }),
  crlfDelay: Infinity,
});
let lineNo = 0;
const outDir = ".tmp-f4-probe/transcript-slices";
fs.mkdirSync(outDir, { recursive: true });

rl.on("line", (line) => {
  lineNo += 1;
  if (!want.has(lineNo)) return;
  let obj;
  try {
    obj = JSON.parse(line);
  } catch {
    fs.writeFileSync(pathJoin(lineNo + ".txt"), line.slice(0, 20000));
    return;
  }
  const role = obj.role || "?";
  let text = "";
  const content = obj.message && obj.message.content;
  if (Array.isArray(content)) {
    for (const c of content) {
      if (c.type === "text" && c.text) text += c.text + "\n";
      if (c.type === "tool_use") {
        text += `\n[tool_use ${c.name}]\n`;
        if (c.input) {
          const s = JSON.stringify(c.input, null, 2);
          text += s.slice(0, 15000) + (s.length > 15000 ? "\n...truncated...\n" : "");
        }
      }
    }
  } else if (typeof content === "string") text = content;
  fs.writeFileSync(
    `${outDir}/${lineNo}-${role}.md`,
    `# line ${lineNo} role=${role}\n\n` + text.slice(0, 50000)
  );
  console.log("wrote", lineNo, role, text.length);
});
rl.on("close", () => console.log("done"));

function pathJoin(n) {
  return `${outDir}/${n}`;
}
