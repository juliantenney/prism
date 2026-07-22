"use strict";

/**
 * Build the authoritative VideoTranscriptTest assembled page fixture from the
 * RNA material-completeness inventory with production journey-compressed beats.
 *
 * Usage: node scripts/build-videotranscripttest-authoritative-fixture.js
 */

const fs = require("node:fs");
const path = require("node:path");

const WORKFLOW_ID = "0d1c12c0-ad1c-449f-8ad9-8f90b8f01097";
const WORKFLOW_NAME = "VideoTranscriptTest";
const repoRoot = path.resolve(__dirname, "..");
const sourcePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "rna-hcv-assembled-vnext-materials-page.json"
);
const outPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "workflows",
  "videotranscripttest-assembled-page.json"
);

const BEAT_PLANS = Object.freeze({
  A1: {
    archetype: "understand",
    beats: ["orientation", "explanation", "check"],
    learner_task:
      "1. Study the explanatory text introducing RNA virus genome types.\n" +
      "2. Work through the worked example showing how experts classify genomes.\n" +
      "3. Complete the classification table using genome-type evidence.\n" +
      "4. Compare your response with the sample output.\n" +
      "5. Use the checklist to verify accuracy and revise where necessary.",
    self_explanation_prompt:
      "Before you begin, explain what you already know about positive-sense and negative-sense RNA viruses."
  },
  A2: {
    archetype: "understand",
    beats: ["orientation", "explanation", "check"],
    learner_task:
      "1. Study the replication overview text.\n" +
      "2. Work through the worked replication analysis example.\n" +
      "3. Complete the analysis table tracing HCV replication steps.\n" +
      "4. Use the checklist to verify causal order and role distinctions.",
    intellectual_coherence_bridge:
      "Genome classification from Activity 1 informs which replication strategies you should expect for HCV."
  },
  A3: {
    archetype: "apply",
    beats: ["orientation", "practice", "feedback"],
    learner_task:
      "1. Read the outbreak response framing text.\n" +
      "2. Study the outbreak scenario and identify immediate constraints.\n" +
      "3. Complete the planning table with sequenced actions and rationales.\n" +
      "4. Use the checklist to verify that each action is evidence-linked.",
    reasoning_orientation:
      "Balance containment urgency with healthcare capacity when prioritising response actions."
  },
  A4: {
    archetype: "analyse",
    beats: ["orientation", "investigation", "synthesis"],
    learner_task:
      "1. Study the immune evasion introduction.\n" +
      "2. Read the modelling note and apply its framework to the scenario.\n" +
      "3. Complete the analysis table linking mechanisms to evidence cues.\n" +
      "4. Verify that each mechanism is tied to observable evidence.\n" +
      "5. Use the checklist to confirm scenario details informed your analysis.",
    reasoning_orientation:
      "Treat immune evasion as an evidence-matching problem rather than a memorised list of mechanisms."
  },
  A5: {
    archetype: "analyse",
    beats: ["orientation", "investigation", "synthesis"],
    learner_task:
      "1. Study the treatment overview text.\n" +
      "2. Work through the worked comparison of direct-acting antivirals.\n" +
      "3. Complete the analysis table comparing mechanisms and trade-offs.\n" +
      "4. Use the checklist to verify mechanisms and trade-offs are explicit.",
    reasoning_orientation:
      "Compare drug classes by mechanism, resistance barrier, and coverage — not by name familiarity alone."
  },
  A6: {
    archetype: "evaluate",
    beats: ["orientation", "judgement", "reflection"],
    learner_task:
      "1. Read the evaluative framing text.\n" +
      "2. Study the outbreak scenario and identify decision constraints.\n" +
      "3. Review the worked prioritisation example for evaluative structure.\n" +
      "4. Complete the decision table and judgement template independently.\n" +
      "5. Use the checklist to verify your judgement is evidence-based.\n" +
      "6. Complete the transfer prompt applying prioritisation criteria elsewhere.\n" +
      "7. Reflect on which criterion most changed your initial priority ranking.",
    transfer_or_application_task:
      "Identify another public-health setting where the same prioritisation criteria would apply and justify your choice."
  }
});

function beatsFromFunctions(functions) {
  return functions.map(function (name) {
    return { function: name };
  });
}

function main() {
  var page = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  page.title = "RNA Viruses and Hepatitis C — VideoTranscriptTest";
  page._workflow_provenance = {
    workflow_id: WORKFLOW_ID,
    workflow_name: WORKFLOW_NAME,
    assembled_from: "scripts/build-videotranscripttest-authoritative-fixture.js",
    source_fixture: path.relative(repoRoot, sourcePath).replace(/\\/g, "/"),
    beat_vocabulary: "journey-compressed-v1",
    note:
      "Materials inventory from assembled GAM output; episode_plan beats match production browser diagnostics (IMP-014C)."
  };

  page.activities.forEach(function (activity) {
    var plan = BEAT_PLANS[activity.activity_id];
    if (!plan) {
      throw new Error("Missing beat plan for " + activity.activity_id);
    }
    activity.episode_plan = {
      archetype: plan.archetype,
      beats: beatsFromFunctions(plan.beats)
    };
    activity.learner_task = plan.learner_task;
    if (plan.self_explanation_prompt) {
      activity.self_explanation_prompt = plan.self_explanation_prompt;
    }
    if (plan.intellectual_coherence_bridge) {
      activity.intellectual_coherence_bridge = plan.intellectual_coherence_bridge;
    }
    if (plan.reasoning_orientation) {
      activity.reasoning_orientation = plan.reasoning_orientation;
    }
    if (plan.transfer_or_application_task) {
      activity.transfer_or_application_task = plan.transfer_or_application_task;
    }
  });

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(page, null, 2) + "\n", "utf8");
  console.log("Wrote", outPath);
}

main();
