"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const vnext = require("../lib/learner-renderer-vnext");
const parseMaterial = require("../lib/learner-renderer-vnext/parse-material");
const renderMaterial = require("../lib/learner-renderer-vnext/render-material").renderMaterial;
const classifyActivityBeats =
  require("../lib/learner-renderer-vnext/compose-moment-classification").classifyActivityBeats;
const buildBeatModels = require("../lib/learner-renderer-vnext/build-beat-model").buildBeatModels;
const buildCanonicalVariant =
  require("../lib/learner-renderer-vnext/archetype-canonical-binding")
    .buildCanonicalFunctionEnumVariant;

function pageWithMaterial(material) {
  return {
    schema_version: "2.0.0",
    title: "Phase4 cards page",
    page_profile: "learner",
    activities: [
      {
        activity_id: "A1",
        title: "Card activity",
        learner_task: "Complete each card in order.",
        expected_output: "Completed card responses.",
        episode_plan: {
          archetype: "apply",
          beats: [
            { function: "explanation" },
            { function: "worked_thinking" },
            { function: "guided_inquiry" },
            { function: "guided_practice" },
            { function: "verification" }
          ]
        },
        materials: [material]
      }
    ]
  };
}

test("phase4 card-family: aliases canonicalize to task_card and preserve semantic authored type", () => {
  ["task_card", "task_cards", "cards"].forEach(function (type) {
    const source = {
      material_id: "A1-M1",
      material_type: type,
      title: "Card set",
      content: [
        { title: "Card 1", instruction: "Do <alpha> safely." },
        { title: "Card 2", instruction: "Explain & compare." }
      ]
    };
    const model = parseMaterial.buildMaterialModel(source, 0);
    assert.equal(model.type, "task_card");
    assert.equal(model.taskCards.length, 2);
    assert.equal(model.taskCards[0].title, "Card 1");
    assert.equal(model.taskCards[1].title, "Card 2");
    if (type === "task_card") assert.equal(model.authoredType, undefined);
    else assert.equal(model.authoredType, type);
  });
});

test("phase4 card-family: shared renderer preserves all cards, order, and escaping", () => {
  const model = parseMaterial.buildMaterialModel(
    {
      material_id: "A1-M1",
      material_type: "cards",
      title: "Escaping cards",
      content: [
        { title: "Card <1>", instruction: "Use <tag> and & sign." },
        { title: "Card 2", instruction: "Second card > first card?" }
      ]
    },
    0
  );
  const html = renderMaterial(model);
  assert.match(html, /util-material-task-cards/);
  assert.match(html, /util-task-card-list/);
  assert.match(html, /Card &lt;1&gt;/);
  assert.match(html, /Use &lt;tag&gt; and &amp; sign\./);
  assert.ok(html.indexOf("Card &lt;1&gt;") < html.indexOf("Card 2"));
  assert.doesNotMatch(html, /data-render-status="unsupported"/);
});

test("phase4 card-family: vnext build accepts single task_card and composes Do moment", () => {
  const page = pageWithMaterial({
    material_id: "A1-M1",
    material_type: "task_card",
    title: "One card",
    content: { title: "Card 1", instruction: "Draft a concise response." }
  });
  page.activities[0].learner_task = "";
  page.activities[0].expected_output = "";
  const validated = vnext.validateInput(page);
  assert.equal(validated.errors.length, 0);
  const variant = buildCanonicalVariant("apply", ["guided_practice"]);
  const beatResult = buildBeatModels(page.activities[0], variant);
  assert.equal(beatResult.errors.length, 0);
  const material = beatResult.beats[0].materials[0];
  assert.equal(material.type, "task_card");
  assert.equal(material.taskCards.length, 1);
  assert.equal(material.taskCards[0].body, "Draft a concise response.");
  const moments = classifyActivityBeats({ beats: beatResult.beats });
  assert.equal(moments.doBeats.length >= 1, true);
});

test("phase4 card-family: markdown heading card collection expands to all cards", () => {
  const source = {
    material_id: "A1-M1",
    material_type: "task_cards",
    content:
      "### Card 1 - Define\nWrite a one-sentence definition.\n\n### Card 2 - Evidence\nQuote one number.\n\n### Card 3 - Review\nRevise your wording."
  };
  const model = parseMaterial.buildMaterialModel(source, 0);
  assert.equal(model.type, "task_card");
  assert.equal(model.taskCards.length, 3);
  assert.equal(model.taskCards[0].title, "Card 1 - Define");
  assert.equal(model.taskCards[1].body, "Quote one number.");
  assert.equal(model.taskCards[2].body, "Revise your wording.");
});

test("phase4 card-family: malformed card payload fails clearly", () => {
  const page = pageWithMaterial({
    material_id: "A1-M1",
    material_type: "task_cards",
    title: "Invalid cards",
    content: [{ title: "Card 1" }]
  });
  const result = vnext.buildPageModel(page);
  assert.equal(result.ok, false);
  assert.ok(
    result.errors.some(function (error) {
      return (
        error.code === "INVALID_MATERIAL_PAYLOAD" &&
        error.authoredMaterialType === "task_cards" &&
        error.canonicalMaterialType === "task_card"
      );
    })
  );
});

test("phase4 card-family: fixture-backed legacy task_cards markdown is structured collection", () => {
  const fixture = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "fixtures/page-render/ld-inflation-workshop-page-full.json"
      ),
      "utf8"
    )
  );
  const materialsSection = fixture.sections.find(function (section) {
    return section.section_id === "activity_materials";
  });
  const taskCardsEntry = materialsSection.content.find(function (entry) {
    return entry.activity_id === "A1" && String(entry.type || "").toLowerCase() === "task_cards";
  });
  assert.ok(taskCardsEntry);
  const model = parseMaterial.buildMaterialModel(
    {
      material_id: "A1-M-task-cards",
      material_type: taskCardsEntry.type,
      content: taskCardsEntry.content
    },
    0
  );
  assert.equal(model.type, "task_card");
  assert.equal(model.taskCards.length, 6);
  assert.equal(model.taskCards[0].title, "Card 1 - Define inflation");
  assert.equal(model.taskCards[5].title, "Card 6 - Group agreement");
});
