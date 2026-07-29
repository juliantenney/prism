"use strict";

var fs = require("node:fs");
var path = require("node:path");
var { renderLearnerPageHtml, buildPageModel } = require("../lib/learner-renderer-vnext");
var classification = require("../lib/learner-renderer-vnext/compose-moment-classification");

var pagePath = process.argv[2] || path.join(
  __dirname,
  "..",
  "tests",
  "fixtures",
  "page-render",
  "roman-roads-association-page.json"
);

var page = JSON.parse(fs.readFileSync(pagePath, "utf8"));

function slice(html, id, kind) {
  var marker = 'id="activity-' + id + '"';
  var a = html.indexOf(marker);
  var ah = html.slice(html.lastIndexOf("<article", a));
  var m = 'data-composition-moment="' + kind + '"';
  var s = ah.indexOf(m);
  var o = ah.lastIndexOf("<section", s);
  var c = ah.indexOf("</section>", s);
  return ah.slice(o, c + 10);
}

["A1", "A4", "A5"].forEach(function (id) {
  var built = buildPageModel(page);
  var act = built.model.activities.find(function (a) {
    return a.id === id;
  });
  var g = classification.classifyActivityBeats(act);
  console.log(
    id,
    "split",
    g.splitBeats.map(function (b) {
      return b.sourceFunction;
    }),
    "check",
    g.checkBeats.map(function (b) {
      return b.sourceFunction;
    })
  );
  act.beats.forEach(function (b) {
    if (b.instructions.length || b.materials.length) {
      console.log(
        " ",
        b.sourceFunction,
        "steps",
        b.instructions.map(function (i) {
          return i.sourceStepNumber;
        }),
        "mats",
        b.materials.map(function (m) {
          return m.id;
        })
      );
    }
  });
});

var r = renderLearnerPageHtml(page, { compositionMode: "moments" });
if (r.error) {
  console.error("render error", r.error);
  process.exit(1);
}
var html = String(r.html || "");
["A1", "A4", "A5"].forEach(function (id) {
  ["learn", "do", "check"].forEach(function (k) {
    var m = slice(html, id, k);
    var steps = (m.match(/data-source-step-number="(\d+)"/g) || []).join(",");
    var mats = (m.match(/data-material-id="([^"]+)"/g) || []).join(",");
    console.log(id, k, "steps", steps || "none", "mats", mats || "none");
  });
});
