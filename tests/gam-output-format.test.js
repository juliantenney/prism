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
