"use strict";

var fs = require("node:fs");

var html = fs.readFileSync(process.argv[2], "utf8");

function activitySlice(id) {
  var marker = 'id="activity-' + id + '"';
  var idx = html.indexOf(marker);
  if (idx < 0) return "";
  var open = html.lastIndexOf("<article", idx);
  var depth = 0;
  var re = /<(\/?)article\b[^>]*>/gi;
  re.lastIndex = open;
  var m;
  while ((m = re.exec(html))) {
    if (m[1]) depth--;
    else depth++;
    if (depth === 0) return html.slice(open, re.lastIndex);
  }
  return "";
}

function momentSlice(activityHtml, kind) {
  var marker = 'data-composition-moment="' + kind + '"';
  var start = activityHtml.indexOf(marker);
  if (start < 0) return "";
  var open = activityHtml.lastIndexOf("<section", start);
  var close = activityHtml.indexOf("</section>", start);
  return activityHtml.slice(open, close + 10);
}

function pos(text, search) {
  var i = text.indexOf(search);
  return i >= 0 ? i : -1;
}

["A1", "A4", "A5"].forEach(function (id) {
  var act = activitySlice(id);
  console.log("\n=== " + id + " ===");
  ["learn", "do", "check"].forEach(function (kind) {
    var moment = momentSlice(act, kind);
    if (!moment) return;
    console.log("\n-- " + kind + " --");
    var steps = moment.match(/data-source-step-number="(\d+)"/g) || [];
    console.log("steps:", steps.join(", ") || "(none)");
    var mats = moment.match(/data-material-id="([^"]+)"/g) || [];
    console.log("materials:", mats.join(", ") || "(none)");
  });
});
