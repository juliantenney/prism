"use strict";

var fs = require("node:fs");
var path = require("node:path");

var vnext = require("../lib/learner-renderer-vnext");
var classification = require("../lib/learner-renderer-vnext/compose-moment-classification");
var genericMoments = require("../lib/learner-renderer-vnext/compose-generic-moments");
var composePageModel = require("../lib/learner-renderer-vnext/compose-page-model");

var pagePath =
  process.argv[2] ||
  path.join(__dirname, "..", "tests", "fixtures", "page-render", "roman-roads-page-min.json");

var page = JSON.parse(fs.readFileSync(pagePath, "utf8"));

function instructionSurfaceAffinity(instruction) {
  var text = String((instruction && instruction.text) || "").toLowerCase();
  if (!text) return "";
  if (/transfer/.test(text)) return "transfer_prompt";
  if (/sample output|example response/.test(text)) return "sample_output";
  if (/checklist|self-check|self check|verify|revision|revise/.test(text)) return "checklist";
  if (/consolidation|summary|key takeaways/.test(text)) return "consolidation_summary";
  if (/worked example|worked judgement/.test(text)) return "worked_example";
  if (/scenario|case-study|case study/.test(text)) return "scenario";
  return "";
}

function traceActivity(activityId) {
  var built = vnext.buildPageModel(page);
  var activity = built.model.activities.find(function (a) {
    return a.id === activityId;
  });
  if (!activity) {
    console.log("Activity not found:", activityId);
    return;
  }
  var groups = classification.classifyActivityBeats(activity);
  console.log("\n=== " + activityId + " beat classification ===");
  console.log(
    "learn:",
    groups.learnBeats.map(function (b) {
      return b.sourceFunction;
    })
  );
  console.log(
    "do:",
    groups.doBeats.map(function (b) {
      return b.sourceFunction;
    })
  );
  console.log(
    "check:",
    groups.checkBeats.map(function (b) {
      return b.sourceFunction;
    })
  );
  console.log(
    "split:",
    groups.splitBeats.map(function (b) {
      return b.sourceFunction;
    })
  );

  activity.beats.forEach(function (beat) {
    console.log("\n-- beat " + beat.sourceFunction + " role=" + beat.learnerRole + " --");
    (beat.instructions || []).forEach(function (inst) {
      console.log(
        "  I step",
        inst.sourceStepNumber,
        "affinity=" + instructionSurfaceAffinity(inst),
        "|",
        String(inst.text || "").slice(0, 70)
      );
    });
    (beat.materials || []).forEach(function (mat) {
      console.log("  M", mat.id, mat.type, mat.title);
    });
    if (groups.splitBeats.indexOf(beat) >= 0) {
      var split = genericMoments.splitBeatDoCheckContent(beat);
      console.log("  SPLIT checkPairs:");
      (split.checkPairs || []).forEach(function (pair, i) {
        console.log(
          "   pair",
          i,
          "inst step=" +
            (pair.instruction ? pair.instruction.sourceStepNumber : "null"),
          "mat=" + (pair.material ? pair.material.id : "null")
        );
      });
      console.log("  SPLIT doInstructions:", split.doInstructions.map(function (i) {
        return i.sourceStepNumber;
      }));
    }
  });

  var composed = composePageModel.buildComposedPageModel(built, page, {
    compositionMode: "moments"
  });
  var composedActivity = composed.composed.activities.find(function (a) {
    return a.id === activityId;
  });
  if (!composedActivity) return;
  var checkMoment = (composedActivity.moments || []).find(function (m) {
    return m.kind === "check";
  });
  var doMoment = (composedActivity.moments || []).find(function (m) {
    return m.kind === "do";
  });
  console.log("\n-- composed check moment items --");
  if (checkMoment) {
    (checkMoment.items || []).forEach(function (item, idx) {
      if (item.kind === "instruction") {
        console.log(
          idx,
          "instruction step",
          item.instruction.sourceStepNumber,
          String(item.instruction.text || "").slice(0, 60)
        );
      } else if (item.kind === "material") {
        console.log(idx, "material", item.material && item.material.id);
      } else {
        console.log(idx, item.kind);
      }
    });
  }
  console.log("\n-- composed do moment items --");
  if (doMoment) {
    (doMoment.items || []).forEach(function (item, idx) {
      if (item.kind === "instruction") {
        console.log(
          idx,
          "instruction step",
          item.instruction.sourceStepNumber,
          String(item.instruction.text || "").slice(0, 60)
        );
      } else if (item.kind === "material") {
        console.log(idx, "material", item.material && item.material.id);
      } else {
        console.log(idx, item.kind);
      }
    });
  }
}

["A1", "A4", "A5"].forEach(traceActivity);
