const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const preambleExposition = require("../lib/ld-activity-preamble-exposition.js");

const marxFixturePath = path.join(
  __dirname,
  "fixtures",
  "page-render",
  "marx-self-study-page.json"
);

test("LD-ACTIVITY-PREAMBLE-EXPOSITION: module metadata", () => {
  assert.equal(preambleExposition.MODULE_ID, "LD-ACTIVITY-PREAMBLE-EXPOSITION");
  assert.match(preambleExposition.MARKER, /LD-ACTIVITY-PREAMBLE-EXPOSITION-CONTRACT/);
});

test("LD-ACTIVITY-PREAMBLE-EXPOSITION: prompt block covers authorial purpose and anti-procedural rules", () => {
  const text = preambleExposition.buildLdActivityPreambleExpositionPromptBlock();
  assert.match(text, /ACTIVITY_PREAMBLE AUTHORIAL PURPOSE/i);
  assert.match(text, /narrative progression/i);
  assert.match(text, /AVOID as standalone opening sentences/i);
  assert.match(text, /Identify/);
  assert.match(text, /Study the model row/);
  assert.match(text, /EXEMPLAR CONTRAST/i);
  assert.match(text, /Marx believed that capitalism contains pressures/i);
});

test("LD-ACTIVITY-PREAMBLE-EXPOSITION: procedural opening heuristic", () => {
  assert.equal(
    preambleExposition.preambleLooksProcedural(
      "Identify and organise Marx's key predictions about capitalism."
    ),
    true
  );
  assert.equal(
    preambleExposition.preambleLooksProcedural(
      "Marx believed that capitalism contains pressures that push societies in particular directions."
    ),
    false
  );
  assert.equal(
    preambleExposition.preambleLooksProcedural("Study the model row before completing the table."),
    true
  );
});

test("LD-ACTIVITY-PREAMBLE-EXPOSITION: evaluateActivityPreambleExpositionEvidence", () => {
  const weak = preambleExposition.evaluateActivityPreambleExpositionEvidence({
    activities: [
      {
        activity_id: "A1",
        activity_preamble: "Complete the comparison table using the prompts.",
        learner_task: "Fill each row."
      },
      {
        activity_id: "A2",
        activity_preamble:
          "Many of Marx's claims remain controversial because some appear strikingly relevant while others seem less convincing in light of modern evidence.",
        learner_task: "Write a short analysis."
      }
    ]
  });
  assert.equal(weak.proceduralOpeningCount, 1);
  assert.equal(weak.meetsAuthorialExposition, false);

  const marx = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const acts = marx.sections.find((s) => s.section_id === "learning_activities").content;
  const strong = preambleExposition.evaluateActivityPreambleExpositionEvidence(acts);
  assert.equal(strong.meetsPreambleCoverage, true);
  assert.equal(strong.proceduralOpeningCount, 0);
  assert.equal(strong.meetsAuthorialExposition, true);
});

test("LD-ACTIVITY-PREAMBLE-EXPOSITION: expositionAlreadyPresent", () => {
  assert.equal(preambleExposition.expositionAlreadyPresent(""), false);
  assert.equal(
    preambleExposition.expositionAlreadyPresent(
      "LD-ACTIVITY-PREAMBLE-EXPOSITION-CONTRACT (auto-applied):\n"
    ),
    true
  );
});
