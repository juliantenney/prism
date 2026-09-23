/**
 * S87-T-007 Figure 4 failure shape — authorised comparison numerics must survive
 * into the human image brief without conflicting activity-mode / qualitative
 * guidance that makes blank result fields and lower/higher stand-ins likely.
 *
 * Live defect: DP must_show required 1%→~15.4% and 20%→~81.8% with 90%/5% held
 * constant; compiled Show listed them; generated image used qualitative
 * prevalence labels and blank posterior boxes.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const planner = require("../lib/prism-visual-jobs-planner.js");
const compiler = require("../lib/prism-image-brief-compiler.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");

const FIXTURE = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "fixtures", "s87-t007-fig4-comparison-numerics-brief.json"),
    "utf8"
  )
);

function compileHumanPrompt(va) {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Comparison numerics brief regression",
    visual_affordance_schema_version: "38.4",
    sections: [
      {
        section_id: va.section_id || "S5",
        title: "Controlled comparison",
        exposition: "Section prose.",
        knowledge_focus: "comparison",
        synthesis: "held-constant evidence",
        representation_needs: "matched comparison"
      }
    ],
    visual_affordances: [va]
  };
  const planned = planner.planPrismVisualJobs(page);
  assert.equal(planned.errors.length, 0, JSON.stringify(planned.errors));
  assert.ok(planned.jobs && planned.jobs.length === 1);
  const compiled = compiler.compilePrismImageBriefs(planned);
  assert.ok(compiled.briefs && compiled.briefs.length === 1);
  const brief = compiled.briefs[0];
  const human = workspace.buildVisualJobHumanPrompt(brief);
  return { planned, brief, human, gen: String(brief.generation_instruction || "") };
}

test("Fig 4 shape: comparison values survive into Show / Required content", () => {
  const { human, gen } = compileHumanPrompt(FIXTURE.visual_affordance);
  const required = [
    "1% prevalence leading to a posterior of about 15.4%",
    "20% prevalence leading to a posterior of about 81.8%",
    "90% positive rate among people with the condition in both scenarios",
    "5% positive rate among people without the condition in both scenarios",
    "A clear indication that prevalence is the quantity that changes"
  ];
  required.forEach((item) => {
    assert.match(human, new RegExp(item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(gen, new RegExp(item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
  assert.match(human, /exact data match/i);
  assert.match(gen, /exact data match/i);
});

test("Fig 4 shape: exact-match brief does not forbid authorised numerics as answer-key", () => {
  const { human } = compileHumanPrompt(FIXTURE.visual_affordance);
  assert.doesNotMatch(
    human,
    /Do not supply completed interpretations or answer-key style diagrams/i
  );
  assert.match(
    human,
    /Authorised Show \/ must_show values \(including numeric results\) are required on-image content/i
  );
  assert.match(human, /Show fidelity:/i);
  assert.match(human, /Do not leave labelled numeric result fields blank/i);
  assert.doesNotMatch(
    human,
    /Use qualitative mechanism labels rather than inventing a concrete capacity scenario/i
  );
  assert.match(
    human,
    /render those values on the image; use qualitative labels only for relationships that are not given specific values/i
  );
});

test("Non-exact conceptual brief keeps qualitative / anti-answer-key guidance", () => {
  const va = JSON.parse(JSON.stringify(FIXTURE.visual_affordance));
  va.requires_exact_data_match = false;
  va.must_show = [
    "Prior probability",
    "Evidence",
    "Posterior probability",
    "Direction of update"
  ];
  va.canonical_discipline_note =
    "Show the update direction without inventing scenario-specific percentages.";
  const { human } = compileHumanPrompt(va);
  assert.match(
    human,
    /Do not supply completed interpretations or answer-key style diagrams/i
  );
  assert.match(
    human,
    /Use qualitative mechanism labels rather than inventing a concrete capacity scenario/i
  );
  assert.doesNotMatch(human, /Show fidelity:/i);
});
