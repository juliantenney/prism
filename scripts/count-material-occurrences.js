"use strict";
var page = require("../tests/fixtures/page-render/roman-roads-association-page.json");
var { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");
var h = String(renderLearnerPageHtml(page, { compositionMode: "moments" }).html || "");
function count(id) {
  var re = new RegExp('data-material-id="' + id + '"', "g");
  return (h.match(re) || []).length;
}
["A1-M3", "A1-M4", "A4-M5", "A4-M6", "A5-M4", "A5-M5", "A5-M6"].forEach(function (id) {
  console.log(id, count(id));
});
