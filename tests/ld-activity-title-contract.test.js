/**
 * Final learner-facing activity title contract (DLA ownership + downstream freeze).
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const titleContract = require("../lib/ld-activity-title-contract.js");
const dlaContract = require("../lib/ld-dla-page-enrich-contract.js");
const dlaEnrich = require("../lib/page-dla-enrich.js");
const assemble = require("../lib/page-vnext-assemble.js");
const gamEnrich = require("../lib/page-gam-enrich.js");
const shellCreate = require("../lib/page-shell-create.js");
const integration = require("../lib/episode-plan-dla-integration.js");
const vnext = require("../lib/learner-renderer-vnext");
const { applyS76CommissionShape } = require("./s76-dla-commission-shape.js");

const LO = {
  learning_outcomes: [
    {
      id: "LO1",
      cognitive_level: "analyse",
      statement:
        "Analyse how nineteenth-century political economy texts construct competing accounts of industrial change and worker agency."
    },
    {
      id: "LO2",
      cognitive_level: "apply",
      statement: "Apply stoichiometric mole ratios to balanced reaction equations."
    }
  ]
};

function pageShell() {
  const episodePlans = integration.deriveEpisodePlansFromLearningOutcomes(LO);
  return shellCreate.createPageShellFromEpisodePlan(episodePlans, {
    title: "Title contract fixture",
    audience: "Learners",
    learning_outcomes: LO
  });
}

function dlaActivity(overrides) {
  return applyS76CommissionShape(
    Object.assign(
      {
        activity_id: "A1",
        title: "Compare political economy frames",
        learner_task: "Compare the texts using shared criteria.",
        expected_output: "A justified comparison paragraph.",
        activity_preamble: "Orient to the contrast before judging.",
        learning_outcome_ids: ["LO1"],
        required_materials: [
          {
            material_id: "A1-M1",
            material_type: "text",
            purpose: "Source extracts"
          }
        ],
        materials: []
      },
      overrides || {}
    ),
    { fillEvidenceDecision: true }
  );
}

function dlaPartialPage(activities) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: activities,
    learning_outcomes: LO.learning_outcomes
  };
}

test("1. Valid DLA title accepted", () => {
  const page = dlaPartialPage([dlaActivity()]);
  const check = dlaEnrich.validateDlaPartialPageCapture(page, { baseline: pageShell() });
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("2. Title at 60 characters accepted", () => {
  const title = "T".repeat(60);
  const page = dlaPartialPage([dlaActivity({ title: title })]);
  const check = titleContract.validateActivityTitles(page.activities, LO);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
  assert.equal(dlaEnrich.validateDlaPartialPageCapture(page).ok, true);
});

test("3. Title over 60 rejected", () => {
  const page = dlaPartialPage([dlaActivity({ title: "T".repeat(61) })]);
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.match((check.errors || []).join("; "), /at most 60/i);
});

test("4. Missing title rejected", () => {
  const row = dlaActivity();
  delete row.title;
  const page = dlaPartialPage([row]);
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.match((check.errors || []).join("; "), /title is required/i);
});

test("5. Exact learning-outcome copy rejected", () => {
  const statement = LO.learning_outcomes[0].statement;
  const page = dlaPartialPage([dlaActivity({ title: statement })]);
  const check = dlaEnrich.validateDlaPartialPageCapture(page, { baseline: pageShell() });
  assert.equal(check.ok, false);
  assert.match((check.errors || []).join("; "), /must not copy the mapped learning-outcome/i);
});

test("6. Truncated outcome prefix rejected", () => {
  const statement = LO.learning_outcomes[0].statement;
  const truncated = statement.slice(0, 48);
  const page = dlaPartialPage([dlaActivity({ title: truncated })]);
  const check = dlaEnrich.validateDlaPartialPageCapture(page, { baseline: pageShell() });
  assert.equal(check.ok, false);
  assert.match((check.errors || []).join("; "), /truncated prefix/i);
});

test("7. Terminal ellipsis rejected", () => {
  const page = dlaPartialPage([dlaActivity({ title: "Analyse industrial change texts..." })]);
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.match((check.errors || []).join("; "), /ellipsis/i);
});

test("8. Generic placeholder rejected", () => {
  const page = dlaPartialPage([dlaActivity({ title: "Activity A1" })]);
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.match((check.errors || []).join("; "), /generic Activity A#/i);
});

test("9. Duplicate title rejected", () => {
  const page = dlaPartialPage([
    dlaActivity({ activity_id: "A1", title: "Mole ratio practice set" }),
    dlaActivity({
      activity_id: "A2",
      title: "  mole ratio practice set ",
      learning_outcome_ids: ["LO2"]
    })
  ]);
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.match((check.errors || []).join("; "), /duplicates/i);
});

test("9a. Own activity ID appended to title is rejected", () => {
  const page = dlaPartialPage([dlaActivity({ title: "Source Evaluation A1" })]);
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.match((check.errors || []).join("; "), /activity_id/i);
});

test("9b. Own activity ID at beginning is rejected", () => {
  const page = dlaPartialPage([
    dlaActivity({ activity_id: "A2", title: "A2 Compare Arguments", learning_outcome_ids: ["LO1"] })
  ]);
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.match((check.errors || []).join("; "), /activity_id/i);
});

test("9c. Own activity ID with punctuation is rejected", () => {
  const page = dlaPartialPage([dlaActivity({ title: "Stoichiometry Practice (A1)" })]);
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.match((check.errors || []).join("; "), /activity_id/i);
});

test("9d. Legitimate technical alphanumeric term is not rejected for unrelated activity ID", () => {
  const page = dlaPartialPage([
    dlaActivity({
      activity_id: "A1",
      title: "Interpret H2O mole ratios",
      learning_outcome_ids: ["LO2"]
    })
  ]);
  const check = titleContract.validateActivityTitles(page.activities, LO);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
  assert.equal(titleContract.titleContainsOwnActivityIdToken("Interpret H2O mole ratios", "A1"), false);
  assert.equal(titleContract.titleContainsOwnActivityIdToken("COVID-19 case comparison", "A1"), false);
  assert.equal(titleContract.titleContainsOwnActivityIdToken("Vitamin B12 uptake model", "A1"), false);
});

test("9e. Valid distinct sibling titles without IDs are accepted", () => {
  const page = dlaPartialPage([
    dlaActivity({ activity_id: "A1", title: "Compare industrial-change arguments" }),
    dlaActivity({
      activity_id: "A2",
      title: "Trace stoichiometric mole ratios",
      learning_outcome_ids: ["LO2"]
    })
  ]);
  const check = dlaEnrich.validateDlaPartialPageCapture(page, { baseline: pageShell() });
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("10. Every active DLA route requires a title", () => {
  const live = dlaContract.assembleDlaCanonicalContract().text;
  const legacy = integration.buildDlaPopulationOnlyPromptBlock();
  assert.equal(
    (live.split("Learner-facing activity title (required on every activities[] row):").length - 1),
    1
  );
  assert.match(live, /never exceed 60 characters/i);
  assert.match(live, /activities\[\]\.title/);
  assert.match(live, /Do not include internal activity IDs/i);
  assert.match(live, /semantic distinctness rather than appending/i);
  assert.match(live, /"title": "Map inflation cause chains"/);
  assert.match(legacy, /Learner-facing activity title \(required/);
  assert.match(legacy, /never exceed 60 characters/i);
  assert.match(legacy, /Do not include internal activity IDs/i);
});

test("11. DLA title replaces the Episode Plan provisional title", () => {
  const shell = pageShell();
  const provisional = shell.activities[0].title;
  assert.ok(provisional);
  const dla = dlaPartialPage([
    dlaActivity({
      activity_id: shell.activities[0].activity_id,
      title: "Compare political economy frames",
      learning_outcome_ids: shell.activities[0].learning_outcome_ids
    })
  ]);
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: shell,
    dla: dla
  });
  assert.equal(result.ok, true);
  const merged = result.page.activities[0];
  assert.equal(merged.title, "Compare political economy frames");
  assert.notEqual(merged.title, provisional);
});

test("12. Downstream omission preserves DLA title", () => {
  const base = [
    {
      activity_id: "A1",
      title: "Compare political economy frames",
      learner_task: "Task"
    }
  ];
  const merged = assemble.mergeActivitiesById(
    base,
    [{ activity_id: "A1", learner_task: "Updated task" }],
    { stageLabel: "design_page", preserveActivityTitle: true, diagnostics: [] }
  );
  assert.equal(merged[0].title, "Compare political economy frames");
  assert.equal(merged[0].learner_task, "Updated task");
});

test("13. Downstream attempted rename cannot overwrite DLA title", () => {
  const diagnostics = [];
  const base = [
    {
      activity_id: "A1",
      title: "Compare political economy frames",
      learner_task: "Task"
    }
  ];
  const merged = assemble.mergeActivitiesById(
    base,
    [{ activity_id: "A1", title: "Renamed by Design Page" }],
    {
      stageLabel: "design_page",
      preserveActivityTitle: true,
      diagnostics: diagnostics
    }
  );
  assert.equal(merged[0].title, "Compare political economy frames");
  assert.ok(
    diagnostics.some((row) => row.code === "DOWNSTREAM_ACTIVITY_TITLE_OVERWRITE_IGNORED")
  );
});

test("14. GAM equality validation remains valid", () => {
  const shell = pageShell();
  const enriched = dlaEnrich.enrichPageWithDla(shell);
  enriched.activities.forEach(function (row, index) {
    if (
      !String(row.intellectual_coherence_bridge || "").trim() ||
      dlaEnrich.isShellPlaceholder(row.intellectual_coherence_bridge)
    ) {
      row.intellectual_coherence_bridge =
        index === 0
          ? "The page orientation established the enquiry. This first activity begins from that foundation."
          : "You completed the previous activity. This activity carries that capability into the next demand.";
    }
  });
  assert.equal(
    dlaEnrich.validateDlaEnrichedPage(enriched, shell).ok,
    true,
    (dlaEnrich.validateDlaEnrichedPage(enriched, shell).errors || []).join("; ")
  );
  const gamPage = gamEnrich.enrichPageWithGam(enriched);
  const check = gamEnrich.validateGamEnrichedPage(gamPage, enriched);
  assert.equal(check.ok, true, (check.errors || []).join("; "));

  const renamed = JSON.parse(JSON.stringify(gamPage));
  renamed.activities[0].title = "Different GAM title";
  const bad = gamEnrich.validateGamEnrichedPage(renamed, enriched);
  assert.equal(bad.ok, false);
  assert.match((bad.errors || []).join("; "), /title must match upstream DLA/i);
});

test("15. Final heading and all navigation representations use the same title", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const fixturePath = path.join(
    __dirname,
    "fixtures",
    "page-render",
    "heteroscedasticity-beat-assignment-page.json"
  );
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const titleA1 = "Defining Heteroscedasticity and Homoscedasticity";
  const a1 = (page.activities || []).find((row) => row.activity_id === "A1");
  assert.ok(a1);
  a1.title = titleA1;

  const model = vnext.buildPageModel(page);
  assert.equal(model.ok, true, JSON.stringify(model.errors || []).slice(0, 500));
  const modelA1 = model.model.activities.find((row) => row.id === "A1");
  assert.equal(modelA1.title, titleA1);

  // Mirrors utilityBuildVnextJourneyActivityNavItems — prev/current/next + All Activities.
  const navItems = model.model.activities.map(function (activity, index) {
    var fullTitle = String(activity && activity.title ? activity.title : "").trim();
    var fallbackShort = "Activity " + String(index + 1);
    var label = fullTitle || fallbackShort;
    return {
      id: "activity-" + String(activity.id || "").trim(),
      label: label,
      accessibleLabel: label,
      title: label
    };
  });
  const navA1 = navItems.find((row) => row.id === "activity-A1");
  assert.equal(navA1.title, titleA1);
  assert.equal(navA1.label, titleA1);
  assert.equal(navA1.accessibleLabel, titleA1);

  const rendered = vnext.renderLearnerPageHtml(page, { rendererVersion: "vnext" });
  const html = String(rendered && rendered.html ? rendered.html : "");
  const escaped = titleA1.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  assert.match(html, new RegExp('class="util-activity-title">' + escaped));
});
