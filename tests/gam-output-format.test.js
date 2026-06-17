/**
 * Sprint 38-S — GAM pack text output format tests.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

const repoRoot = path.resolve(__dirname, "..");
const gamFormat = require(path.join(repoRoot, "lib", "gam-output-format.js"));

const EV38L_GAM = fs.readFileSync(
  path.join(
    repoRoot,
    "docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/EV-38L-AFTER-gam.txt"
  ),
  "utf8"
);

test("EV-38L GAM text passes pack validation", () => {
  const v = gamFormat.validateGamPackTextOutput(EV38L_GAM, {
    minMaterials: 10,
    minActivities: 4
  });
  assert.equal(v.ok, true, v.errors.join("; "));
  assert.ok(v.metrics.material_count >= 10);
});

test("A4 thin scenario and worked judgement fails compose contract", () => {
  const thinA4 =
    "Activity: A4\nActivity ID: A4_Evaluate\n\n" +
    "Material: M12_Scenario (scenario)\nPurpose: strategy menu\nContent:\nBrief menu only.\n---\n" +
    "Material: M14_Worked (modelling_note)\nPurpose: worked judgement weak strong\nContent:\nWeak vs strong note.\n---\n";
  const v = gamFormat.validateGamA4ComposeContract(
    gamFormat.parseGamMaterialsFromText(thinA4),
    [{ activity_id: "A4_Evaluate" }]
  );
  assert.equal(v.ok, false);
  assert.match(v.errors.join(" "), /GAM-FMT-06/);
  assert.match(v.errors.join(" "), /GAM-FMT-07/);
});

test("JSON stub fails validation", () => {
  const stub = JSON.stringify({
    pack: {
      activities: [
        {
          activity_id: "A1",
          required_materials: [
            { material_id: "M1", type: "text", purpose: "explanation", specification: "Short spec" }
          ]
        }
      ]
    }
  });
  const v = gamFormat.validateGamPackTextOutput(stub);
  assert.equal(v.ok, false);
  assert.match(v.errors.join(" "), /GAM-FMT-01/);
});

test("thin pack text fails validation", () => {
  const thin =
    "Activity: Test\nActivity ID: A1\n\nMaterial: M1 (checklist)\nPurpose: verification\nContent:\nToo short\n---\n";
  const v = gamFormat.validateGamPackTextOutput(thin, { minMaterials: 1, minActivities: 1 });
  assert.equal(v.ok, false);
  assert.match(v.errors.join(" "), /GAM-FMT-04/);
});

test("parseGamMaterialsExtended prefers text over JSON", () => {
  const mats = gamFormat.parseGamMaterialsExtended(EV38L_GAM);
  assert.ok(mats.length >= 10);
  assert.ok(mats.some((m) => m.type === "checklist" && m.contentLen >= 80));
});

const EV38L_DLA = JSON.parse(
  fs.readFileSync(
    path.join(
      repoRoot,
      "docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/EV-38L-AFTER-dla-learning-activities.json"
    ),
    "utf8"
  )
);

test("tiered capture gate: EV-38L GAM passes with upstream DLA", () => {
  const v = gamFormat.validateGamPackTextCaptureGate(EV38L_GAM, {
    learningActivities: EV38L_DLA,
    upstreamAvailable: true
  });
  assert.equal(v.ok, true, v.blockingErrors.join("; "));
  assert.equal(v.blockingErrors.length, 0);
  assert.ok(v.metrics.material_count >= gamFormat.countExpectedMaterialsFromLearningActivities(EV38L_DLA));
});

test("tiered capture gate: JSON stub blocks (GAM-FMT-01)", () => {
  const stub = JSON.stringify({
    pack: { activities: [{ activity_id: "A1", required_materials: [{ material_id: "M1" }] }] }
  });
  const v = gamFormat.validateGamPackTextCaptureGate(stub, { upstreamAvailable: false });
  assert.equal(v.ok, false);
  assert.match(v.blockingErrors.join(" "), /GAM-FMT-01/);
});

test("tiered capture gate: missing Material/Content blocks (GAM-FMT-02)", () => {
  const v = gamFormat.validateGamPackTextCaptureGate("Activity: A1\nActivity ID: A1\nPlain prose only.", {
    upstreamAvailable: false
  });
  assert.equal(v.ok, false);
  assert.match(v.blockingErrors.join(" "), /GAM-FMT-02/);
});

test("tiered capture gate: parsed count below upstream expected blocks (GAM-FMT-03)", () => {
  const thinPack =
    "Activity: A1\nActivity ID: A1\n\nMaterial: M1 (text)\nPurpose: one\nContent:\n" +
    "A".repeat(120) +
    "\n---\n";
  const v = gamFormat.validateGamPackTextCaptureGate(thinPack, {
    learningActivities: EV38L_DLA,
    upstreamAvailable: true
  });
  assert.equal(v.ok, false);
  assert.match(v.blockingErrors.join(" "), /GAM-FMT-03/);
});

test("tiered capture gate: missing upstream activity_id blocks (GAM-FMT-05)", () => {
  const onlyA1 =
    "Activity: A1\nActivity ID: A1_Understand_CPI_GDP\n\nMaterial: M1 (text)\nPurpose: one\nContent:\n" +
    "A".repeat(120) +
    "\n---\n";
  const v = gamFormat.validateGamPackTextCaptureGate(onlyA1, {
    learningActivities: EV38L_DLA,
    upstreamAvailable: true
  });
  assert.equal(v.ok, false);
  assert.match(v.blockingErrors.join(" "), /GAM-FMT-05/);
});

test("tiered capture gate: thin checklist is warning only (GAM-FMT-04)", () => {
  const thin =
    "Activity: A1\nActivity ID: A1\n\nMaterial: M1 (checklist)\nPurpose: verification\nContent:\nToo short\n---\n";
  const v = gamFormat.validateGamPackTextCaptureGate(thin, { upstreamAvailable: false });
  assert.equal(v.ok, true);
  assert.match(v.warnings.join(" "), /GAM-FMT-04/);
});

test("tiered capture gate: thin A4 inflation fixture excludes FMT-06/07/08", () => {
  const thinA4 =
    "Activity: A4\nActivity ID: A4_Evaluate\n\n" +
    "Material: M12_Scenario (scenario)\nPurpose: strategy menu\nContent:\nBrief menu only.\n---\n" +
    "Material: M14_Worked (modelling_note)\nPurpose: worked judgement weak strong\nContent:\nWeak vs strong note.\n---\n";
  const v = gamFormat.validateGamPackTextCaptureGate(thinA4, {
    learningActivities: [{ activity_id: "A4_Evaluate" }],
    upstreamAvailable: true
  });
  const all = v.blockingErrors.concat(v.warnings).join(" ");
  assert.doesNotMatch(all, /GAM-FMT-06/);
  assert.doesNotMatch(all, /GAM-FMT-07/);
  assert.doesNotMatch(all, /GAM-FMT-08/);
});

test("tiered capture gate: upstream unavailable skips coverage blocking", () => {
  const thinPack =
    "Activity: A1\nActivity ID: A1\n\nMaterial: M1 (text)\nPurpose: one\nContent:\n" +
    "A".repeat(120) +
    "\n---\n";
  const v = gamFormat.validateGamPackTextCaptureGate(thinPack, {
    learningActivities: EV38L_DLA,
    upstreamAvailable: false
  });
  assert.equal(v.skippedCoverage, true);
  assert.equal(v.ok, true);
  assert.doesNotMatch(v.blockingErrors.join(" "), /GAM-FMT-03/);
  assert.doesNotMatch(v.blockingErrors.join(" "), /GAM-FMT-05/);
  assert.match(v.warnings.join(" "), /coverage check skipped/i);
});
