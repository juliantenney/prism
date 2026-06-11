#!/usr/bin/env node
/**
 * Sprint 41 Slice 4 — Educational Quality Framework diagnostic CLI.
 * Evaluates manually saved artefacts only (no workflow/runtime integration).
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const evaluator = require("../lib/educational-quality-framework-evaluator.js");

const DIMENSION_LABELS = {
  learner_journey: "Learner Journey",
  understanding: "Understanding",
  capability: "Capability",
  judgement: "Judgement",
  independence: "Independence",
  metacognition: "Metacognition",
  learning_success: "Learning Success",
  cognitive_activity: "Cognitive Activity"
};

function dimensionLabel(key) {
  return DIMENSION_LABELS[key] || String(key || "").replace(/_/g, " ");
}

function detectInputKind(filePath, raw) {
  var ext = path.extname(filePath || "").toLowerCase();
  var trimmed = String(raw || "").trim();
  if (ext === ".json") return "json";
  if (ext === ".html" || ext === ".htm") return "html";
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return "json";
  if (/<[a-z][\s\S]*>/i.test(trimmed)) return "html";
  return "text";
}

function loadInputFromFile(filePath) {
  var resolved = path.resolve(String(filePath || "").trim());
  if (!resolved) {
    throw new Error("File path is required.");
  }
  var raw = fs.readFileSync(resolved, "utf8");
  var kind = detectInputKind(resolved, raw);
  if (kind === "json") {
    try {
      return { filePath: resolved, kind: kind, input: JSON.parse(raw) };
    } catch (err) {
      throw new Error("Failed to parse JSON: " + (err && err.message ? err.message : err));
    }
  }
  return { filePath: resolved, kind: kind, input: raw };
}

function evaluateFile(filePath, options) {
  var loaded = loadInputFromFile(filePath);
  var result = evaluator.evaluateEducationalQualityFrameworkEvidence(loaded.input, options || {});
  return {
    filePath: loaded.filePath,
    kind: loaded.kind,
    result: result
  };
}

function collectDisplayWarnings(result) {
  var warnings = Array.isArray(result.warnings) ? result.warnings.slice() : [];
  evaluator.DIMENSION_ORDER.forEach(function (key) {
    var dim = result.dimensions && result.dimensions[key];
    if (dim && !dim.present) {
      var label = dimensionLabel(key).toLowerCase();
      var msg = label + " evidence weak";
      if (warnings.indexOf(msg) === -1) warnings.push(msg);
    }
  });
  return warnings;
}

function buildDiagnosticReport(evaluated, options) {
  var opts = options && typeof options === "object" ? options : {};
  var threshold =
    typeof opts.threshold === "number" ? opts.threshold : evaluator.DEFAULT_THRESHOLD;
  var filePath = evaluated.filePath;
  var result = evaluated.result;
  var lines = [];
  var rule = "=".repeat(50);

  lines.push(rule);
  lines.push("Educational Quality Framework Diagnostic");
  lines.push(rule);
  lines.push("");
  lines.push("File: " + filePath);
  lines.push("");
  lines.push("Score:");
  lines.push(result.score + " / 8");
  lines.push("");
  lines.push("Status:");
  lines.push((result.ok ? "PASS" : "BELOW") + " (threshold " + threshold + ")");
  lines.push("");
  lines.push("Dimensions:");
  lines.push("");
  evaluator.DIMENSION_ORDER.forEach(function (key) {
    var dim = result.dimensions[key];
    var mark = dim && dim.present ? "\u2713" : "\u2717";
    lines.push(mark + " " + dimensionLabel(key));
  });
  lines.push("");

  var warnings = collectDisplayWarnings(result);
  if (warnings.length) {
    lines.push("Warnings:");
    lines.push("");
    warnings.forEach(function (warning) {
      lines.push("* " + warning);
    });
    lines.push("");
  }

  lines.push("Summary:");
  lines.push(evaluator.summariseEducationalQualityFrameworkEvidence(result));
  lines.push("");
  lines.push("Evidence:");
  lines.push("");

  evaluator.DIMENSION_ORDER.forEach(function (key) {
    var dim = result.dimensions[key];
    if (!dim || !dim.evidence || !dim.evidence.length) return;
    lines.push(dimensionLabel(key) + ":");
    lines.push("");
    dim.evidence.forEach(function (item) {
      lines.push("* " + item);
    });
    lines.push("");
  });

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

function compareDimensionResults(baselineResult, candidateResult) {
  var changes = [];
  evaluator.DIMENSION_ORDER.forEach(function (key) {
    var basePresent =
      baselineResult.dimensions[key] && baselineResult.dimensions[key].present;
    var candPresent =
      candidateResult.dimensions[key] && candidateResult.dimensions[key].present;
    if (basePresent !== candPresent) {
      changes.push({
        key: key,
        label: dimensionLabel(key),
        baselinePresent: !!basePresent,
        candidatePresent: !!candPresent
      });
    }
  });
  return changes;
}

function buildComparisonReport(baselineEvaluated, candidateEvaluated) {
  var baseline = baselineEvaluated.result;
  var candidate = candidateEvaluated.result;
  var delta = candidate.score - baseline.score;
  var deltaText = (delta >= 0 ? "+" : "") + delta;
  var changes = compareDimensionResults(baseline, candidate);
  var lines = [];

  lines.push("Baseline Score: " + baseline.score);
  lines.push("Candidate Score: " + candidate.score);
  lines.push("Delta: " + deltaText);
  lines.push("");
  lines.push("Dimension Changes:");
  lines.push("");
  if (!changes.length) {
    lines.push("* (none)");
  } else {
    changes.forEach(function (change) {
      if (change.candidatePresent && !change.baselinePresent) {
        lines.push("* " + change.label + " (gained)");
      } else if (!change.candidatePresent && change.baselinePresent) {
        lines.push("* " + change.label + " (lost)");
      } else {
        lines.push("* " + change.label);
      }
    });
  }
  lines.push("");
  return lines.join("\n");
}

function parseCliArgs(argv) {
  var args = Array.isArray(argv) ? argv.slice() : [];
  var files = [];
  var threshold = evaluator.DEFAULT_THRESHOLD;
  var comparePath = "";

  for (var i = 0; i < args.length; i += 1) {
    var token = args[i];
    if (token === "--compare") {
      comparePath = String(args[i + 1] || "").trim();
      i += 1;
      continue;
    }
    if (token === "--threshold") {
      var n = Number(args[i + 1]);
      if (!Number.isNaN(n) && n >= 0) threshold = n;
      i += 1;
      continue;
    }
    if (token.indexOf("-") === 0) continue;
    files.push(token);
  }

  return {
    filePath: files[0] || "",
    comparePath: comparePath || files[1] || "",
    threshold: threshold
  };
}

function runDiagnosticCli(argv, io) {
  var out = io && io.stdout ? io.stdout : process.stdout;
  var err = io && io.stderr ? io.stderr : process.stderr;
  var parsed = parseCliArgs(argv);

  if (!parsed.filePath) {
    err.write(
      "Usage: node tools/evaluate-educational-quality-framework.js <file> [--compare <file>] [--threshold N]\n"
    );
    return 1;
  }

  try {
    var options = { threshold: parsed.threshold };
    var primary = evaluateFile(parsed.filePath, options);

    if (parsed.comparePath) {
      var candidate = evaluateFile(parsed.comparePath, options);
      out.write(buildComparisonReport(primary, candidate));
      return 0;
    }

    out.write(buildDiagnosticReport(primary, options));
    return 0;
  } catch (e) {
    err.write("Error: " + (e && e.message ? e.message : e) + "\n");
    return 1;
  }
}

if (require.main === module) {
  process.exit(runDiagnosticCli(process.argv.slice(2)));
}

module.exports = {
  DIMENSION_LABELS: DIMENSION_LABELS,
  dimensionLabel: dimensionLabel,
  detectInputKind: detectInputKind,
  loadInputFromFile: loadInputFromFile,
  evaluateFile: evaluateFile,
  buildDiagnosticReport: buildDiagnosticReport,
  compareDimensionResults: compareDimensionResults,
  buildComparisonReport: buildComparisonReport,
  parseCliArgs: parseCliArgs,
  runDiagnosticCli: runDiagnosticCli
};
