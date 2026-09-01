"use strict";

const fs = require("fs");
const path = require("path");

const repo = path.resolve(__dirname, "..");
const renderComposed = require(path.join(
  repo,
  "lib/learner-renderer-vnext/render-composed-moment.js"
));
const registry = require(path.join(
  repo,
  "lib/learner-renderer-vnext/learner-surface-registry.js"
));
const types = require(path.join(
  repo,
  "lib/learner-renderer-vnext/response-part-types.js"
));
const mathRt = require(path.join(
  repo,
  "lib/learner-renderer-vnext/math-entry-runtime.js"
));
const draftRt = require(path.join(
  repo,
  "lib/learner-renderer-vnext/learner-draft-runtime.js"
));

function mathPart(id, label, order) {
  return {
    responsePartId: "S82G2A-" + id,
    sourceKind: types.SOURCE_KIND.TEMPLATE_SECTION,
    sourceId: id,
    label: label,
    prompt: "Construct using the maths editor (no TeX typing).",
    surfaceKind: types.SURFACE_KIND.TEXT_ENTRY,
    inputModality: types.INPUT_MODALITY.MATH,
    order: order,
    provenance: {},
    sourceStepNumber: null,
    rows: 4
  };
}

const activityId = "S82G2A";
const parts = [
  mathPart("lagrangian", "Lagrangian", 1),
  mathPart("foc", "First-order condition (partial x)", 2)
];
const workspaces = parts
  .map(function (p) {
    const mapped = registry.workspaceFromResponsePart(p);
    if (!mapped.ok) throw new Error(mapped.error);
    mapped.workspace.responseLabel = p.label;
    return renderComposed.renderLearnerWorkspace(mapped.workspace, activityId);
  })
  .join("");

const html =
  "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\">" +
  "<meta name=\"viewport\" content=\"width=1024\">" +
  "<title>S82-G2A browser validation</title>" +
  '<link rel="stylesheet" href="../lib/mathlive/mathlive-fonts.css">' +
  '<script src="../lib/mathlive/mathlive.min.js"></script>' +
  "<style>body{font-family:system-ui,sans-serif;max-width:48rem;margin:1rem auto;padding:0 1rem}" +
  "main{border:1px solid #ccc;padding:1rem;border-radius:8px}" +
  ".util-learner-workspace{margin-bottom:2rem}" +
  mathRt.getMathEntryPresentationCss() +
  "</style></head><body>" +
  "<h1>S82-G2A manual validation</h1>" +
  '<main class="util-learner-renderer-vnext" data-persistence-page-key="s82-g2a-browser-validation" data-persistence-storage-key="s82-g2a-browser-validation">' +
  '<div class="util-learner-draft-controls" data-learner-draft-controls="true">' +
  '<p class="util-learner-draft-status" aria-live="polite" data-learner-draft-status>Draft not saved</p>' +
  '<button type="button" data-learner-draft-clear>Clear saved responses</button></div>' +
  '<div data-region="activities">' +
  workspaces +
  "</div>" +
  '<button type="button" id="after-maths">Next control (Tab target)</button>' +
  '<p id="debug" aria-live="polite"></p></main>' +
  '<script>if(location.search.indexOf("fallback=1")>=0)window.__PRISM_MATH_ENTRY_DISABLE__=true;</script>' +
  '<script src="../lib/learner-renderer-vnext-browser.js"></script>' +
  "<script>" +
  draftRt.getLearnerDraftRuntimeScript() +
  "</script>" +
  "<script>" +
  mathRt.getMathEntryRuntimeScript() +
  "</script>" +
  "<script>" +
  "window.addEventListener('input',function(){" +
  "var t=document.querySelectorAll('textarea.util-learner-workspace__input--canonical');" +
  "var d=document.getElementById('debug');" +
  "if(d)d.textContent=Array.from(t).map(function(x,i){return (i+1)+':'+x.value;}).join(' | ');" +
  "});" +
  "</script>" +
  "</body></html>";

const out = path.join(repo, "tests/s82-g2a-browser-validation.html");
fs.writeFileSync(out, html);
console.log("Wrote " + out);
