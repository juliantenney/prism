"use strict";

const fs = require("fs");
const path = require("path");
const {
  renderTableWorkspace
} = require("../../../lib/learner-renderer-vnext/render-table-workspace");

const body = [
  "| Label | Observation | Notes |",
  "| --- | --- | --- |",
  "| Short | | |",
  "| Two line label that wraps onto a second line in a narrow column | | |",
  "| Three line label that wraps onto a second line and then a third line when the column is constrained | | |",
  "| Four line label that wraps onto a second line then a third line and finally a fourth line under a narrow column constraint for depth | | |"
].join("\n");

const tableHtml = renderTableWorkspace(
  {
    id: "CELL-FILL-M1",
    type: "decision_table",
    title: "Cell fill probe",
    bodyFormat: "markdown",
    body: body
  },
  "A1"
);

const css = `
.util-learner-renderer-vnext{font:16px/1.4 system-ui;padding:1rem;max-width:1100px;margin:0 auto}
.util-table-scroll{overflow-x:auto}
.util-learner-table-breakout{width:min(75rem,calc(100vw - 2rem));max-width:none}
.util-learner-table-workspace__table table{width:100%;table-layout:auto;border-collapse:collapse}
.util-learner-table-workspace__table th,
.util-learner-table-workspace__table td{border:1px solid #cbd5e1;min-width:8rem;white-space:normal;overflow-wrap:anywhere;vertical-align:top}
.util-learner-table-workspace__table th[scope="row"],
.util-learner-table-workspace__table th:first-child,
.util-learner-table-workspace__table td:first-child{width:1%;min-width:6rem;white-space:normal}
.util-learner-table-workspace__table .util-learner-table-workspace__cell--fixed{padding:.5rem .65rem;background:#f1f5f9;color:#0f172a}
.util-learner-table-workspace__table .util-learner-table-workspace__cell--editable{padding:2px;background:#fff;min-width:8rem;height:1px;vertical-align:top}
.util-learner-table-workspace__cell--editable-inner{display:flex;flex-direction:column;align-items:stretch;box-sizing:border-box;min-height:100%;height:100%}
.util-learner-table-workspace__input{flex:1 1 auto;display:block;width:100%;min-width:0;min-height:4.5rem;box-sizing:border-box;margin:0;padding:.4rem .5rem;resize:vertical;overflow:auto;font:inherit;font-size:0.875rem;line-height:1.4;color:#111827;border:1px solid #cbd5e1;border-radius:4px;background:#fff;vertical-align:top}
.util-learner-table-workspace__input:focus{outline:2px solid #2563eb;outline-offset:0;border-color:#93c5fd}
@media (max-width:720px){.util-learner-table-workspace__cell--editable{min-width:8rem}}
@media print{.util-learner-table-workspace__input{border-color:#94a3b8;background:transparent;box-shadow:none;-webkit-appearance:none;appearance:none;min-height:4.5rem;resize:none}.util-learner-table-workspace__cell--editable{background:#fff}.util-learner-table-workspace__cell--fixed{background:#f8fafc;-webkit-print-color-adjust:exact;print-color-adjust:exact}}
`.trim();

const script = `
function measure(label) {
  var rows = [].slice.call(document.querySelectorAll("tbody tr"));
  var lines = rows.map(function (tr, i) {
    var td = tr.querySelector("td.util-learner-table-workspace__cell--editable");
    var input = td && td.querySelector(".util-learner-table-workspace__input");
    if (!td || !input) return null;
    var cellH = td.getBoundingClientRect().height;
    var inputH = input.getBoundingClientRect().height;
    var pad = 4;
    return {
      row: i,
      cellH: +cellH.toFixed(1),
      inputH: +inputH.toFixed(1),
      insetDelta: +(cellH - inputH).toFixed(1),
      ok: Math.abs(cellH - inputH - pad) <= 2.5
    };
  }).filter(Boolean);
  document.getElementById("metrics").textContent = label + "\\n" + JSON.stringify(lines, null, 2);
  window.__cellFillMetrics = { label: label, lines: lines };
  return lines;
}
window.__measure = measure;
measure("desktop-" + window.innerWidth);
`.trim();

const out = [
  "<!doctype html>",
  "<html lang=\"en\">",
  "<head>",
  "<meta charset=\"utf-8\">",
  "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">",
  "<title>Table workspace cell fill probe</title>",
  "<style>" + css + "</style>",
  "</head>",
  "<body>",
  "<div class=\"util-learner-renderer-vnext\" id=\"probe\">" + tableHtml + "</div>",
  "<pre id=\"metrics\"></pre>",
  "<script>" + script + "</script>",
  "</body>",
  "</html>"
].join("\n");

const dir = path.join(__dirname);
fs.mkdirSync(dir, { recursive: true });
const filePath = path.join(dir, "layout-probe.html");
fs.writeFileSync(filePath, out);
console.log("wrote", filePath);
