"use strict";
const fs = require("node:fs");
const path = require("node:path");

const app = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
const fns = [
  "buildSelfDirectedLearnerActionRhetoricPromptBlock",
  "buildSelfDirectedWorkedExampleFadingPromptBlock",
  "buildSelfDirectedEmbeddedFeedbackMisconceptionPromptBlock",
  "buildSelfDirectedConceptProcedureIntegrationPromptBlock",
  "buildSelfDirectedMetacognitiveJudgementPromptBlock",
  "buildSelfDirectedSessionOrientationRhetoricPromptBlock",
  "buildSelfDirectedConceptualTensionDifficultyPromptBlock",
  "buildSelfDirectedIntellectualProgressionPromptBlock",
  "buildSelfDirectedEpistemicSynthesisClosurePromptBlock",
  "buildSelfDirectedTransferDurableUnderstandingPromptBlock"
];

function extractBlock(fn) {
  const start = app.indexOf("function " + fn + "()");
  if (start < 0) throw new Error("missing " + fn);
  const ret = app.indexOf("return [", start);
  const end = app.indexOf("].join(\"\\n\")", ret);
  const slice = app.slice(ret + 8, end + 1);
  // eslint-disable-next-line no-eval
  const arr = eval(slice);
  return arr.join("\n");
}

let stackTotal = 0;
const per = {};
for (const fn of fns) {
  const text = extractBlock(fn);
  per[fn] = text.length;
  stackTotal += text.length;
}

const lib = require(path.join(__dirname, "..", "lib", "ld-self-directed-rhetoric.js"));
const canonical = lib.buildLdSelfDirectedRhetoricPromptBlock();
const canonicalDp = lib.buildLdSelfDirectedRhetoricPromptBlock({ role: "design_page" });

console.log(
  JSON.stringify(
    {
      per,
      stackTotal,
      count: fns.length,
      canonicalCore: canonical.length,
      canonicalDesignPage: canonicalDp.length,
      savingPerStepCore: stackTotal - canonical.length,
      savingFourStepsCore: (stackTotal - canonical.length) * 4
    },
    null,
    2
  )
);
