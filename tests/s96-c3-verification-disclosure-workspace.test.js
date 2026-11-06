/**
 * C3 learner HTML: verified summaries stay closed until the learner reveals
 * them, and both sample-standard-deviation conditions keep their own
 * calculation records.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const fflate = require("fflate");

const learnerPackage = require("../lib/learner-package.js");
const learnerPackageZip = require("../lib/learner-package-zip.js");
const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext/render-learner-page.js");

const DEGREE = "\u00B0";
const fixturePath = path.join(
  __dirname,
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

const CONDITION_A = [93, 89, 96, 91, 94, 87];
const CONDITION_B = [78, 72, 81, 75, 70, 77];

function pipeTable(headers, rows) {
  const line = (cells) => "| " + cells.join(" | ") + " |";
  return [
    line(headers),
    line(headers.map(() => "---")),
    ...rows.map(line)
  ].join("\n");
}

function calculationTable(observations) {
  const headers = [
    "Trial",
    "Observed dissolution time (s)",
    "Deviation from condition mean (s)",
    "Squared deviation (s²)"
  ];
  return pipeTable(
    headers,
    observations.map((value, index) => [String(index + 1), String(value), "", ""])
  );
}

function summaryTable() {
  return pipeTable(
    ["Calculation", "Value"],
    [
      ["Sum of squared deviations (s²)", ""],
      ["Divisor (n − 1)", ""],
      ["Sample variance (s²)", ""],
      ["Sample standard deviation (s)", ""]
    ]
  );
}

const WORKSPACE_BODY = [
  "### Condition A (20 " + DEGREE + "C)",
  "",
  calculationTable(CONDITION_A),
  "",
  summaryTable(),
  "",
  "### Condition B (40 " + DEGREE + "C)",
  "",
  calculationTable(CONDITION_B),
  "",
  summaryTable()
].join("\n");

const PRACTICE_BODY = [
  "Consider a separate practice dataset containing three recorded times: 10 s, 12 s and 14 s. These are illustrative values, not additional measurements from the tablet experiment.",
  "",
  pipeTable(
    ["Observation (s)", "Deviation from 12 s (s)", "Squared deviation (s²)"],
    [
      ["10", "−2", "4"],
      ["12", "0", "0"],
      ["14", "+2", "4"]
    ]
  ),
  "",
  "The sample standard deviation for this separate practice dataset is 2 s."
].join("\n");

const VERIFIED_BODY = [
  "## Verification values — reveal after your own attempts",
  "",
  "These are the verified descriptive statistics for the canonical synthetic educational investigation. Each statistic should be revealed only after you have attempted that statistic for the corresponding condition. If you have not yet attempted a value, return to your calculation workspace before consulting its verification entry.",
  "",
  pipeTable(
    [
      "Condition",
      "n",
      "Sum (s)",
      "Mean, unrounded (s)",
      "Mean, reported (s)",
      "Range (s)",
      "Sample SD, unrounded (s)",
      "Sample SD, reported (s)"
    ],
    [
      ["A: 20 " + DEGREE + "C", "6", "550", "91.6667", "91.67", "9", "3.3267", "3.33"],
      ["B: 40 " + DEGREE + "C", "6", "453", "75.5000", "75.50", "11", "4.0373", "4.04"]
    ]
  ),
  "",
  "The longer decimal values are displayed for verification; they are rounded representations of the underlying calculations, not instructions to round intermediate working to four decimal places. Sample standard deviations use the \\(n-1\\) convention.",
  "",
  "Use the table to identify agreements and discrepancies in your own calculations. The table provides numerical verification, not a scientific conclusion about the effect of water temperature."
].join("\n");

const INTERPRETATION_BODY = [
  "## Summary of the experimental observations",
  "",
  "Use this table after you have completed the independent calculations and verification activities. The values summarise the canonical synthetic educational measurements.",
  "",
  pipeTable(
    [
      "Condition",
      "Number of observations",
      "Mean dissolution time (s)",
      "Range (s)",
      "Sample standard deviation (s)"
    ],
    [
      ["A: 20 " + DEGREE + "C", "6", "91.67", "9", "3.33"],
      ["B: 40 " + DEGREE + "C", "6", "75.50", "11", "4.04"]
    ]
  ),
  "",
  "The table reports descriptive statistics for the recorded observations. It does not by itself establish a causal relationship, quantify statistical significance or supply a final scientific conclusion."
].join("\n");

function material(id, type, title, body) {
  return {
    material_id: id,
    material_type: type,
    activity_id: id.split("-")[0],
    title: title,
    body_format: "markdown",
    body: body
  };
}

function c3Page() {
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const a2 = page.activities.find((activity) => activity.activity_id === "A2");
  const a3 = page.activities.find((activity) => activity.activity_id === "A3");
  const a4 = page.activities.find((activity) => activity.activity_id === "A4");

  a2.title = "Calculate Sample Standard Deviation";
  a2.materials = [
    material(
      "A2-M2",
      "worked_example",
      "Worked Example: From Observations to Sample Standard Deviation",
      PRACTICE_BODY
    ),
    material(
      "A2-M3",
      "analysis_table",
      "Sample Standard Deviation Calculation Workspace",
      WORKSPACE_BODY
    )
  ];
  a2.required_materials = a2.materials.map((item) => ({
    material_id: item.material_id,
    type: item.material_type,
    purpose: item.title,
    specification: "C3 calculation workspace regression."
  }));

  a3.title = "Diagnose and Correct Calculations";
  a3.episode_plan = {
    archetype: "apply",
    beats: [
      { function: "orientation" },
      { function: "criteria_exposition" },
      { function: "worked_thinking" },
      { function: "guided_practice" },
      { function: "reflection" }
    ]
  };
  a3.materials = [
    material(
      "A3-M1",
      "reference_table",
      "Verified Experimental Summaries",
      VERIFIED_BODY
    )
  ];
  a3.required_materials = [
    {
      material_id: "A3-M1",
      type: "reference_table",
      purpose: "Verified numerical summaries, concealed until the learner chooses to reveal them.",
      specification: "C3 verification disclosure regression."
    }
  ];

  a4.title = "Interpret and Retain Statistical Evidence";
  a4.materials[0] = material(
    "A4-M1",
    "reference_table",
    "Verified Descriptive Statistics for Interpretation",
    INTERPRETATION_BODY
  );
  a4.required_materials = [
    {
      material_id: "A4-M1",
      type: "reference_table",
      purpose: "Interpretation reference after verification.",
      specification: "C4 boundary regression."
    }
  ];
  return page;
}

function articleHtml(html, materialId) {
  const marker = 'data-material-id="' + materialId + '"';
  const at = html.indexOf(marker);
  assert.ok(at >= 0, "missing material " + materialId);
  const open = html.lastIndexOf("<article", at);
  const end = html.indexOf("</article>", at);
  return html.slice(open, end + "</article>".length);
}

function enclosingReveal(html, materialId) {
  const article = articleHtml(html, materialId);
  const at = html.indexOf(article);
  const detailsAt = html.lastIndexOf("<details", at);
  if (detailsAt < 0 || at - detailsAt > 400) return "";
  const end = html.indexOf("</details>", at);
  return html.slice(detailsAt, end + "</details>".length);
}

function workspaceTables(article) {
  return article
    .split('<div class="util-table-scroll util-learner-table-workspace__table">')
    .slice(1)
    .map((part) => part.slice(0, part.indexOf("</table>") + "</table>".length));
}

function renderC3() {
  const rendered = renderLearnerPageHtml(c3Page(), { compositionMode: "moments" });
  assert.equal(rendered.error, null, rendered.error);
  return String(rendered.html || "");
}

test("A2-M3 learner HTML keeps both conditions editable, including summary calculations", () => {
  const html = renderC3();
  const workspace = articleHtml(html, "A2-M3");
  const tables = workspaceTables(workspace);
  assert.equal(tables.length, 4);
  assert.match(workspace, /Condition A \(20 °C\)/);
  assert.match(workspace, /Condition B \(40 °C\)/);

  const conditionA = tables[0];
  const conditionB = tables[2];
  CONDITION_A.forEach((value) => {
    assert.match(conditionA, new RegExp("<t[dh][^>]*>" + value + "</t[dh]>"));
  });
  CONDITION_B.forEach((value) => {
    assert.match(conditionB, new RegExp("<t[dh][^>]*>" + value + "</t[dh]>"));
  });
  assert.equal((conditionA.match(/<textarea\b/g) || []).length, 12);
  assert.equal((conditionB.match(/<textarea\b/g) || []).length, 12);
  assert.equal((tables[1].match(/<textarea\b/g) || []).length, 4);
  assert.equal((tables[3].match(/<textarea\b/g) || []).length, 4);
  assert.match(tables[1], /Sum of squared deviations/);
  assert.match(tables[1], /Sample variance/);
  assert.match(tables[3], /Sample standard deviation/);

  const aIds = conditionA.match(/data-learner-cell="[^"]+"/g) || [];
  const bIds = conditionB.match(/data-learner-cell="[^"]+"/g) || [];
  assert.equal(aIds.length, 12);
  assert.equal(bIds.length, 12);
  assert.ok(aIds.every((id) => id.includes("-t0-")));
  assert.ok(bIds.every((id) => id.includes("-t2-")));
  bIds.forEach((id) => assert.equal(aIds.includes(id), false));
  const workspaceAt = html.indexOf(workspace);
  const workspaceOpen = html.lastIndexOf(
    '<div class="util-learner-table-workspace',
    workspaceAt
  );
  assert.match(
    html.slice(workspaceOpen, workspaceAt + 80),
    /data-workspace-id="a2-a2-m3"/
  );

  const practice = articleHtml(html, "A2-M2");
  assert.match(practice, /10 s, 12 s and 14 s/);
  assert.match(practice, /<td>10<\/td>/);
  assert.match(practice, /<td>12<\/td>/);
  assert.match(practice, /<td>14<\/td>/);
  assert.doesNotMatch(practice, /data-render-mode="table_workspace"/);
  assert.doesNotMatch(workspace, />10</);
});

test("A3-M1 verified results are concealed until the learner reveals them", () => {
  const html = renderC3();
  const reveal = enclosingReveal(html, "A3-M1");
  assert.match(
    reveal,
    /^<details class="util-composition-reveal util-prose-measure" data-reveal-mode="details">/
  );
  assert.doesNotMatch(reveal.slice(0, 180), /\sopen[\s>]/);
  assert.match(reveal, /<summary>Reveal verified results<\/summary>/);
  assert.match(reveal, /Verified Experimental Summaries/);
  assert.match(reveal, /91\.6667/);
  assert.match(reveal, /91\.67/);
  assert.match(reveal, /3\.3267/);
  assert.match(reveal, /3\.33/);
  assert.match(reveal, /75\.5000/);
  assert.match(reveal, /75\.50/);
  assert.match(reveal, /4\.0373/);
  assert.match(reveal, /4\.04/);
  assert.match(reveal, /before consulting its verification entry/);
  assert.match(reveal, /not a scientific conclusion about the effect of water temperature/);
  assert.doesNotMatch(reveal, /<th>Difference/);
  assert.doesNotMatch(reveal, /Your answer has been verified|automatically verified/i);

  const interpretation = articleHtml(html, "A4-M1");
  assert.equal(enclosingReveal(html, "A4-M1"), "");
  assert.match(interpretation, /3\.33/);
  assert.match(interpretation, /4\.04/);
  assert.match(interpretation, /does not by itself establish a causal relationship/);
  assert.doesNotMatch(interpretation, /<summary>Reveal verified results<\/summary>/);
});

test("exported learner HTML keeps the closed verification table and both calculation records", () => {
  const html = renderC3();
  const packaged = learnerPackage.buildLearnerPackage({
    html: html,
    visualAssetManifest: { assets: [] },
    title: "Making Sense of Experimental Statistics"
  });
  assert.equal(packaged.ok, true, JSON.stringify(packaged.error || {}));
  const zipped = learnerPackageZip.serializeLearnerPackageToZip(packaged.package);
  assert.equal(zipped.ok, true, JSON.stringify(zipped.error || {}));
  const entries = fflate.unzipSync(zipped.bytes);
  const exported = fflate.strFromU8(entries["learner-page.html"]);
  const reveal = enclosingReveal(exported, "A3-M1");
  assert.match(reveal, /<summary>Reveal verified results<\/summary>/);
  assert.doesNotMatch(reveal.slice(0, 180), /\sopen[\s>]/);
  assert.match(reveal, /3\.3267/);
  assert.match(reveal, /4\.0373/);
  const tables = workspaceTables(articleHtml(exported, "A2-M3"));
  assert.equal(tables.length, 4);
  assert.match(tables[0], /<td class="[^"]*">93<\/td>/);
  assert.match(tables[2], /<td class="[^"]*">78<\/td>/);
  assert.match(articleHtml(exported, "A2-M2"), /10 s, 12 s and 14 s/);
});
