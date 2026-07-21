"use strict";

/**
 * Sprint 67 golden invariant suite for the heteroscedasticity fixture.
 * Builds the canonical LearnerPageModel, renders via vNext, and asserts
 * semantic structure — not byte-for-byte HTML snapshots.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { buildPageModel } = require("../lib/learner-renderer-vnext");
const { renderPage } = require("../lib/learner-renderer-vnext/render-page");

const repoRoot = path.resolve(__dirname, "..");
const moduleDir = path.join(repoRoot, "lib", "learner-renderer-vnext");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

const EXPECTED_ACTIVITY_ORDER = ["A1", "A2", "A3", "A4", "A5"];
const EXPECTED_BEAT_COUNTS = Object.freeze({
  A1: 3,
  A2: 4,
  A3: 3,
  A4: 3,
  A5: 4
});

const MATERIAL_LABEL_ASSOCIATIONS = Object.freeze({
  "A1-M1": "Understand",
  "A1-M2": "Check your work",
  "A1-M3": "Check your work",
  "A2-M1": "See it modelled",
  "A2-M3": "Your turn",
  "A2-M2": "Your turn",
  "A4-M1": "Understand",
  "A4-M2": "Understand",
  "A4-M3": "Your turn",
  "A5-M4": "Your turn",
  "A5-M5": "Your turn",
  "A5-M8": "Apply elsewhere",
  "A5-M7": "Apply elsewhere"
});

const RAW_SCHEMA_HEADINGS = [
  "check_understanding",
  "worked_example",
  "guided_practice",
  "independent_practice",
  "orientation"
];

const FORBIDDEN_ARCHITECTURE_TOKENS = [
  "scoreClauseForBeat",
  "scoreMaterialForBeat",
  "chooseSinkBeatIndex",
  "earliestStepMention",
  "resolveBeatMaterialPlan",
  "orderedMaterialKeysRendered",
  "checklistRendered",
  "insertExpectedOutputGuidanceBeforeChecklist"
];

const RENDERER_FILES = [
  "render-page.js",
  "render-activity.js",
  "render-beat.js",
  "render-material.js",
  "render-html-utils.js"
];

function loadGoldenContext() {
  const source = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const result = buildPageModel(source);
  assert.equal(result.ok, true, "fixture model must build successfully");
  const html = renderPage(result.model);
  return { source, model: result.model, html };
}

function countOccurrences(haystack, needle) {
  const escaped = String(needle).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = String(haystack).match(new RegExp(escaped, "g"));
  return matches ? matches.length : 0;
}

function extractActivityHtml(pageHtml, activityId, activityIds) {
  const marker = `data-activity-id="${activityId}"`;
  const start = pageHtml.indexOf(marker);
  assert.ok(start >= 0, `missing activity wrapper for ${activityId}`);
  const nextStart = activityIds
    .map((id) => pageHtml.indexOf(`data-activity-id="${id}"`))
    .filter((position) => position > start)
    .sort((left, right) => left - right)[0];
  return nextStart >= 0 ? pageHtml.slice(start, nextStart) : pageHtml.slice(start);
}

function beatSections(activityHtml) {
  return [
    ...String(activityHtml).matchAll(
      /<section class="util-beat-section"[^>]*data-beat-function="([^"]*)"[^>]*>([\s\S]*?)<\/section>/gi
    )
  ].map((match) => {
    var headingMatch =
      match[0].match(
        /<h3 class="util-beat-heading[^"]*">[\s\S]*?<span class="util-semantic-icon__label">([^<]*)<\/span>/
      ) || match[0].match(/<h3 class="util-beat-heading">([^<]*)<\/h3>/);
    return {
      sourceFunction: match[1],
      html: match[0],
      heading: headingMatch ? String(headingMatch[1]).trim() : ""
    };
  });
}

function beatOwningMaterial(activityHtml, materialId) {
  const marker = `data-material-id="${materialId}"`;
  for (const beat of beatSections(activityHtml)) {
    if (beat.html.includes(marker)) return beat;
  }
  return null;
}

function materialWrapperHtml(activityHtml, materialId) {
  const re = new RegExp(
    `<article[^>]*data-material-id="${materialId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>[\\s\\S]*?</article>`,
    "i"
  );
  return (activityHtml.match(re) || [])[0] || "";
}

function extractRegionHtml(pageHtml, startMarker, endMarker) {
  const start = pageHtml.indexOf(startMarker);
  if (start < 0) return "";
  const end = endMarker ? pageHtml.indexOf(endMarker, start + 1) : -1;
  return end >= 0 ? pageHtml.slice(start, end) : pageHtml.slice(start);
}

function allModelMaterialIds(model) {
  return model.activities.flatMap((activity) =>
    activity.beats.flatMap((beat) => beat.materials.map((material) => material.id))
  );
}

function allModelChecklistMaterials(model) {
  return model.activities.flatMap((activity) =>
    activity.beats.flatMap((beat) =>
      beat.materials.filter((material) => material.type === "checklist")
    )
  );
}

function activityIdsFromModel(model) {
  return model.activities.map((activity) => activity.id);
}

function assertMaterialLabelAssociation(pageHtml, activityIds, materialId, expectedLabel) {
  const activityId = materialId.split("-")[0];
  const activityHtml = extractActivityHtml(pageHtml, activityId, activityIds);
  const beat = beatOwningMaterial(activityHtml, materialId);
  assert.ok(
    beat,
    `Expected ${materialId} to render inside an owning beat section in ${activityId}.`
  );
  assert.equal(
    beat.heading,
    expectedLabel,
    `Expected ${materialId} to belong to "${expectedLabel}"; found "${beat.heading || "(missing heading)"}".`
  );
}

test("golden: activity order follows canonical page model", () => {
  const { model, html } = loadGoldenContext();
  const positions = model.activities.map((activity) =>
    html.indexOf(`data-activity-id="${activity.id}"`)
  );

  assert.deepEqual(model.activities.map((activity) => activity.id), EXPECTED_ACTIVITY_ORDER);
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, positions.slice().sort((left, right) => left - right));
});

test("golden: every model material renders exactly once", () => {
  const { model, html } = loadGoldenContext();
  const missing = [];
  const duplicated = [];

  allModelMaterialIds(model).forEach((materialId) => {
    const count = countOccurrences(html, `data-material-id="${materialId}"`);
    if (count === 0) missing.push(materialId);
    if (count > 1) duplicated.push(`${materialId} (${count})`);
  });

  assert.deepEqual(
    missing,
    [],
    `Missing material IDs in rendered HTML: ${missing.join(", ") || "(none)"}`
  );
  assert.deepEqual(
    duplicated,
    [],
    `Duplicate material IDs in rendered HTML: ${duplicated.join(", ") || "(none)"}`
  );
});

test("golden: every model learner-task step renders exactly once per activity", () => {
  const { model, html } = loadGoldenContext();
  const activityIds = activityIdsFromModel(model);
  const missing = [];
  const duplicated = [];

  model.activities.forEach((activity) => {
    const activityHtml = extractActivityHtml(html, activity.id, activityIds);
    activity.beats.forEach((beat) => {
      beat.instructions.forEach((instruction) => {
        const marker = `data-source-step-number="${instruction.sourceStepNumber}"`;
        const count = countOccurrences(activityHtml, marker);
        const label = `${activity.id} step ${instruction.sourceStepNumber}`;
        if (count === 0) missing.push(label);
        if (count > 1) duplicated.push(`${label} (${count})`);
      });
    });
  });

  assert.deepEqual(
    missing,
    [],
    `Missing learner-task step markers: ${missing.join(", ") || "(none)"}`
  );
  assert.deepEqual(
    duplicated,
    [],
    `Duplicate learner-task step markers: ${duplicated.join(", ") || "(none)"}`
  );
});

test("golden: expected output renders once inside owning beat", () => {
  const { model, html } = loadGoldenContext();
  const activityIds = activityIdsFromModel(model);

  model.activities.forEach((activity) => {
    const activityHtml = extractActivityHtml(html, activity.id, activityIds);
    const expectedBeats = activity.beats.filter((beat) => beat.expectedOutput !== null);
    assert.equal(
      countOccurrences(activityHtml, "util-expected-output"),
      expectedBeats.length,
      `Expected ${expectedBeats.length} expected-output block(s) in ${activity.id}; found ${countOccurrences(activityHtml, "util-expected-output")}.`
    );

    expectedBeats.forEach((beat) => {
      const beatMatch = beatSections(activityHtml).find(
        (section) => section.sourceFunction === beat.sourceFunction
      );
      assert.ok(beatMatch, `Missing beat section ${beat.sourceFunction} in ${activity.id}.`);
      assert.match(
        beatMatch.html,
        /util-expected-output/,
        `Expected output for ${activity.id}/${beat.sourceFunction} must stay inside the owning beat.`
      );
    });
  });
});

test("golden: checklist materials render once with criteria and revision guidance", () => {
  const { model, html } = loadGoldenContext();
  const activityIds = activityIdsFromModel(model);

  allModelChecklistMaterials(model).forEach((material) => {
    const activityId = material.id.split("-")[0];
    const activityHtml = extractActivityHtml(html, activityId, activityIds);
    assert.equal(
      countOccurrences(activityHtml, `data-material-id="${material.id}"`),
      1,
      `Checklist ${material.id} must render exactly once.`
    );

    const wrapper = materialWrapperHtml(activityHtml, material.id);
    assert.ok(wrapper, `Missing checklist wrapper for ${material.id}.`);
    assert.match(wrapper, /util-checklist/);

    material.checklist.criteria.forEach((criterion) => {
      assert.match(
        wrapper,
        new RegExp(criterion.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
        `Missing checklist criterion in ${material.id}.`
      );
    });

    if (material.checklist.revisionInstruction) {
      assert.match(
        wrapper,
        /util-checklist-instruction/,
        `Missing revision instruction wrapper for ${material.id}.`
      );
    }
  });
});

test("golden: no empty beat sections and omitted orientations stay absent", () => {
  const { html } = loadGoldenContext();
  const activityIds = EXPECTED_ACTIVITY_ORDER;

  activityIds.forEach((activityId) => {
    const activityHtml = extractActivityHtml(html, activityId, activityIds);
    beatSections(activityHtml).forEach((beat) => {
      const hasInstructions = beat.html.includes("util-beat-instruction");
      const hasPrompts = beat.html.includes("util-pedagogical-guidance");
      const hasMaterials = beat.html.includes("data-material-id=");
      const hasExpectedOutput = beat.html.includes("util-expected-output");
      assert.ok(
        hasInstructions || hasPrompts || hasMaterials || hasExpectedOutput,
        `Empty beat section ${activityId}/${beat.sourceFunction} must not render.`
      );
    });
  });

  ["A3", "A4"].forEach((activityId) => {
    const activityHtml = extractActivityHtml(html, activityId, activityIds);
    assert.doesNotMatch(
      activityHtml,
      /data-beat-function="orientation"/,
      `${activityId} empty orientation must not emit a beat section.`
    );
  });
});

test("golden: non-empty beat counts match model per activity", () => {
  const { html } = loadGoldenContext();
  const activityIds = EXPECTED_ACTIVITY_ORDER;
  const actual = {};
  const expected = {};

  activityIds.forEach((activityId) => {
    const activityHtml = extractActivityHtml(html, activityId, activityIds);
    actual[activityId] = beatSections(activityHtml).length;
    expected[activityId] = EXPECTED_BEAT_COUNTS[activityId];
  });

  assert.deepEqual(
    actual,
    expected,
    `Unexpected beat counts: ${JSON.stringify(actual)} (expected ${JSON.stringify(expected)}).`
  );
});

test("golden: material wrappers inherit correct learner-facing beat labels", () => {
  const { html, model } = loadGoldenContext();
  const activityIds = activityIdsFromModel(model);

  Object.entries(MATERIAL_LABEL_ASSOCIATIONS).forEach(([materialId, expectedLabel]) => {
    assertMaterialLabelAssociation(html, activityIds, materialId, expectedLabel);
  });
});

test("golden: visible beat headings use learner labels not raw schema functions", () => {
  const { html } = loadGoldenContext();
  const activityIds = EXPECTED_ACTIVITY_ORDER;

  activityIds.forEach((activityId) => {
    beatSections(extractActivityHtml(html, activityId, activityIds)).forEach((beat) => {
      RAW_SCHEMA_HEADINGS.forEach((token) => {
        assert.notEqual(
          beat.heading.toLowerCase(),
          token,
          `Raw schema token "${token}" must not appear as visible heading in ${activityId}.`
        );
        assert.doesNotMatch(
          beat.html,
          new RegExp(`<h3 class="util-beat-heading">${token}</h3>`, "i"),
          `Raw schema token "${token}" must not appear as visible heading in ${activityId}.`
        );
        assert.doesNotMatch(
          beat.html,
          new RegExp(
            `<span class="util-semantic-icon__label">${token}</span>`,
            "i"
          ),
          `Raw schema token "${token}" must not appear as visible heading in ${activityId}.`
        );
      });
      assert.match(beat.html, /data-beat-function="/);
    });
  });
});

test("golden: critical material order preserved in rendered HTML", () => {
  const { html } = loadGoldenContext();
  const activityIds = EXPECTED_ACTIVITY_ORDER;

  const a2 = extractActivityHtml(html, "A2", activityIds);
  assert.ok(
    a2.indexOf('data-material-id="A2-M3"') < a2.indexOf('data-material-id="A2-M2"'),
    "Expected A2-M3 to appear before A2-M2 in rendered HTML."
  );

  const a5 = extractActivityHtml(html, "A5", activityIds);
  assert.ok(
    a5.indexOf('data-material-id="A5-M8"') < a5.indexOf('data-material-id="A5-M7"'),
    "Expected A5-M8 to appear before A5-M7 in rendered HTML."
  );
});

test("golden: page and activity framing remain outside beat and material streams", () => {
  const { html } = loadGoldenContext();
  const activityIds = EXPECTED_ACTIVITY_ORDER;

  const orientationStart = html.indexOf('data-region="orientation"');
  const activitiesStart = html.indexOf('data-region="activities"');
  const assessmentStart = html.indexOf('data-region="assessment"');
  const studyTipsStart = html.indexOf('data-region="study-tips"');

  assert.ok(orientationStart >= 0 && orientationStart < activitiesStart);
  assert.ok(assessmentStart > activitiesStart);
  assert.ok(studyTipsStart > assessmentStart);

  activityIds.forEach((activityId) => {
    const activityHtml = extractActivityHtml(html, activityId, activityIds);
    const firstBeat = activityHtml.indexOf("util-beat-section");
    const preamble = activityHtml.indexOf("util-activity-preamble");
    const reasoning = activityHtml.indexOf("util-reasoning-orientation");

    if (preamble >= 0) {
      assert.ok(
        firstBeat < 0 || preamble < firstBeat,
        `${activityId} preamble must appear before beat sections.`
      );
    }

    if (reasoning >= 0) {
      assert.ok(
        firstBeat < 0 || reasoning < firstBeat,
        `${activityId} reasoning orientation must appear before beat sections.`
      );
    }

    beatSections(activityHtml).forEach((beat) => {
      assert.doesNotMatch(
        beat.html,
        /util-activity-preamble|util-reasoning-orientation/,
        `${activityId}/${beat.sourceFunction} must not contain activity framing.`
      );
    });
  });

  assert.doesNotMatch(
    html.slice(0, activitiesStart),
    /data-material-id="/,
    "Page orientation must not nest activity material wrappers."
  );
});

test("golden: page title and synthesis regions render once without overview duplication", () => {
  const { html, model } = loadGoldenContext();
  const assessmentRegion = extractRegionHtml(html, 'data-region="assessment"', 'data-region="study-tips"');

  assert.equal(countOccurrences(html, "<h1>"), 1);
  assert.equal(
    countOccurrences(html, "heteroscedasticity, a common issue in applied economic regression analysis"),
    1,
    "Overview content must not duplicate between header and orientation."
  );
  assert.equal(
    countOccurrences(html, 'data-orientation-type="overview"'),
    1,
    "Overview orientation section must render once."
  );
  assert.equal(
    countOccurrences(assessmentRegion, "util-assessment-item--formative"),
    model.assessment.items.length,
    "Each assessment item must render exactly once."
  );
  assert.equal(countOccurrences(html, 'data-region="study-tips"'), 1);
});

test("golden: vNext production renderer sources exclude legacy planner architecture", () => {
  const source = RENDERER_FILES.map((name) =>
    fs.readFileSync(path.join(moduleDir, name), "utf8")
  ).join("\n");

  assert.doesNotMatch(source, /ld-beat-assignment-compose/);
  FORBIDDEN_ARCHITECTURE_TOKENS.forEach((token) => {
    assert.equal(source.includes(token), false, `Forbidden architecture token found: ${token}`);
  });
  assert.doesNotMatch(
    source,
    /(?:activityId|activity\.id|activity\["id"\])\s*={2,3}\s*["']A\d+["']/
  );
});
