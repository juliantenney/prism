"use strict";

/**
 * MathLive ↔ canonical textarea TeX sync helpers (testable).
 * Canonical learner evidence remains textarea.value.
 */

var MATHLIVE_VERSION = "0.110.0";
var MATHLIVE_LICENSE = "MIT";

function normalizeInputModality(value) {
  return String(value == null ? "" : value).trim() === "math" ? "math" : "text";
}

function readLatexFromMathfield(mathfield) {
  if (!mathfield || typeof mathfield.getValue !== "function") return "";
  var latex = mathfield.getValue("latex");
  return String(latex == null ? "" : latex);
}

function writeLatexToMathfield(mathfield, latex, options) {
  if (!mathfield || typeof mathfield.setValue !== "function") return false;
  var opts = options && typeof options === "object" ? options : {};
  try {
    mathfield.setValue(String(latex == null ? "" : latex), {
      silenceNotifications: opts.silenceNotifications !== false
    });
    return true;
  } catch (_err) {
    return false;
  }
}

function syncLatexFromMathfield(mathfield, textarea) {
  if (!textarea) return false;
  try {
    textarea.value = readLatexFromMathfield(mathfield);
    return true;
  } catch (_err) {
    return false;
  }
}

function syncLatexToMathfield(textarea, mathfield, options) {
  if (!textarea || !mathfield) return false;
  return writeLatexToMathfield(mathfield, textarea.value, options);
}

function dispatchTextareaInput(textarea) {
  if (!textarea || typeof textarea.dispatchEvent !== "function") return;
  try {
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  } catch (_err) {
    // legacy engines not required
  }
}

module.exports = {
  MATHLIVE_VERSION: MATHLIVE_VERSION,
  MATHLIVE_LICENSE: MATHLIVE_LICENSE,
  normalizeInputModality: normalizeInputModality,
  readLatexFromMathfield: readLatexFromMathfield,
  writeLatexToMathfield: writeLatexToMathfield,
  syncLatexFromMathfield: syncLatexFromMathfield,
  syncLatexToMathfield: syncLatexToMathfield,
  dispatchTextareaInput: dispatchTextareaInput
};
