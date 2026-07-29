"use strict";

var fs = require("node:fs");
var path = require("node:path");
var { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");

var page = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "tests", "fixtures", "page-render", "roman-roads-association-page.json"),
    "utf8"
  )
);

function pos(text, search) {
  var i = text.indexOf(search);
  return i >= 0 ? i : Number.MAX_SAFE_INTEGER;
}

var r = renderLearnerPageHtml(page, { compositionMode: "moments" });
var html = String(r.html || "");

function moment(id, kind) {
  var a = html.indexOf('id="activity-' + id + '"');
  var ah = html.slice(html.lastIndexOf("<article", a));
  var m = 'data-composition-moment="' + kind + '"';
  var s = ah.indexOf(m);
  var o = ah.lastIndexOf("<section", s);
  var c = ah.indexOf("</section>", s);
  return ah.slice(o, c + 10);
}

var a5 = moment("A5", "check");
console.log("A5 step5 pos", pos(a5, "Review the consolidation summary"));
console.log("A5-M4 pos", pos(a5, 'data-material-id="A5-M4"'));
console.log("A5-M5 pos", pos(a5, 'data-material-id="A5-M5"'));
console.log("A5-M6 pos", pos(a5, 'data-material-id="A5-M6"'));
console.log("step5 before M5?", pos(a5, "Review the consolidation") < pos(a5, 'data-material-id="A5-M5"'));
console.log("M5 before M6?", pos(a5, 'data-material-id="A5-M5"') < pos(a5, 'data-material-id="A5-M6"'));

var a1 = moment("A1", "check");
console.log("\nA1 step2 before M3?", pos(a1, "Examine the sample output") < pos(a1, 'data-material-id="A1-M3"'));
console.log("A1 step4 before M4?", pos(a1, "Complete the verification checklist") < pos(a1, 'data-material-id="A1-M4"'));

var a4do = moment("A4", "do");
var a4check = moment("A4", "check");
console.log("\nA4 step5 in do?", a4do.indexOf("Complete the checklist and revise") >= 0);
console.log("A4 step5 before M5?", pos(a4check, "Complete the checklist and revise") < pos(a4check, 'data-material-id="A4-M5"'));
