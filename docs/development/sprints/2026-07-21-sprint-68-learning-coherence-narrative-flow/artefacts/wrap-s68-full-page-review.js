"use strict";
const fs = require("node:fs");
const path = require("node:path");
const dir = __dirname;

function extractBodyInner(html) {
  const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return match ? match[1] : html;
}

function extractStyles(html) {
  return (html.match(/<style>([\s\S]*?)<\/style>/gi) || [])
    .map(function (block) {
      return block.replace(/^<style>/i, "").replace(/<\/style>$/i, "");
    })
    .join("\n");
}

function main() {
  const beats = fs.readFileSync(
    path.join(dir, "heteroscedasticity-s68-full-page-beats-mode-export.html"),
    "utf8"
  );
  const moments = fs.readFileSync(
    path.join(dir, "heteroscedasticity-s68-full-page-moments-mode-export.html"),
    "utf8"
  );
  const css = extractStyles(moments) || extractStyles(beats);
  const comparison = JSON.parse(
    fs.readFileSync(
      path.join(dir, "heteroscedasticity-s68-full-page-composition-structural-comparison.json"),
      "utf8"
    )
  );

  const html =
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    "<title>Sprint 68 full-page composition review</title>" +
    "<style>" +
    "body{margin:0;font-family:system-ui,sans-serif;background:#f8fafc;color:#0f172a}" +
    "header{padding:1rem 1.25rem;background:#0f172a;color:#fff}" +
    "header h1{margin:0 0 .35rem;font-size:1.15rem}" +
    "header p{margin:0;font-size:.9rem;opacity:.88}" +
    ".metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.75rem;padding:1rem 1.25rem}" +
    ".metric{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:.75rem}" +
    ".metric h2{margin:0 0 .35rem;font-size:.95rem}" +
    ".metric dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:.2rem .65rem;font-size:.85rem}" +
    ".panels{display:grid;grid-template-columns:1fr 1fr;gap:1rem;padding:0 1.25rem 1.25rem}" +
    ".panel{background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;min-width:0}" +
    ".panel h2{margin:0;padding:.75rem 1rem;background:#eef2ff;font-size:.95rem}" +
    ".panel__frame{border:0;width:100%;min-height:120vh;display:block}" +
    "@media (max-width:960px){.panels{grid-template-columns:1fr}}" +
    css +
    "</style></head><body>" +
    "<header><h1>Sprint 68 — full-page composition review</h1>" +
    "<p>Default application export (moments) compared with explicit beats mode.</p></header>" +
    '<section class="metrics">' +
    metricPanel("Beats mode", comparison.beats) +
    metricPanel("Moments mode (default)", comparison.moments) +
    "</section>" +
    '<section class="panels">' +
    panel("Beats mode", extractBodyInner(beats)) +
    panel("Moments mode (default)", extractBodyInner(moments)) +
    "</section></body></html>";

  const out = path.join(dir, "heteroscedasticity-s68-full-page-review.html");
  fs.writeFileSync(out, html);
  console.log("Wrote", out);
}

function metricPanel(title, metrics) {
  return (
    '<article class="metric"><h2>' +
    title +
    "</h2><dl>" +
    row("Composition mode", metrics.active_composition_mode) +
    row("Activities", metrics.activity_count) +
    row("Composition moments", metrics.composition_moments) +
    row("Beat sections", metrics.beat_sections) +
    row("Table workspaces", metrics.table_entry_workspaces) +
    row("Text workspaces", metrics.text_entry_workspaces) +
    row("Table inputs", metrics.table_inputs) +
    row("Textareas", metrics.textareas) +
    row("Duplicate IDs", (metrics.duplicate_ids || []).length) +
    "</dl></article>"
  );
}

function row(label, value) {
  return "<dt>" + label + "</dt><dd>" + String(value) + "</dd>";
}

function panel(title, bodyHtml) {
  return (
    '<article class="panel"><h2>' +
    title +
    '</h2><iframe class="panel__frame" title="' +
    title +
    '" srcdoc="' +
    bodyHtml.replace(/&/g, "&amp;").replace(/"/g, "&quot;") +
    '"></iframe></article>'
  );
}

main();
