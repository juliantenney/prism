"use strict";

/**
 * Parse authored learner_task into ordered instructional steps.
 *
 * Numbered entries (`1.` / `1)`) are never further split — authored numbering
 * is authoritative.
 *
 * Unnumbered prose may contain sequential instructional clauses joined by
 * discourse markers (Then / Finally / Next / …). Those markers are split so
 * beat↔task association and Learn/Do placement can operate on each clause.
 * Clause text is not rewritten beyond trimming the leading discourse marker.
 *
 * @param {*} value
 * @returns {Array<{sourceStepNumber:number,text:string}>}
 */

var SEQUENTIAL_MARKER_RE =
  /(?:^|[.!?])\s+(?=(?:Then|Finally|Next|Afterwards|After that)\b)/gi;

var LEADING_MARKER_RE =
  /^(?:Then|Finally|Next|Afterwards|After that),?\s+/i;

function splitUnnumberedSequentialClauses(text) {
  var source = String(text || "").trim();
  if (!source) return [];

  var cuts = [0];
  var match;
  SEQUENTIAL_MARKER_RE.lastIndex = 0;
  while ((match = SEQUENTIAL_MARKER_RE.exec(source)) !== null) {
    var cut = match.index + (match[0].match(/[.!?]/) ? 1 : 0);
    // Cut after the punctuation so the prior clause keeps its terminator.
    if (cut > 0 && cut < source.length) cuts.push(cut);
  }
  cuts.push(source.length);

  var clauses = [];
  for (var i = 0; i < cuts.length - 1; i += 1) {
    var raw = source.slice(cuts[i], cuts[i + 1]).trim();
    if (!raw) continue;
    // Drop a leading punctuation remnant when the cut landed on ". Then".
    raw = raw.replace(/^[.!?]\s*/, "").trim();
    if (!raw) continue;
    raw = raw.replace(LEADING_MARKER_RE, "").trim();
    if (!raw) continue;
    // Capitalise first letter after marker strip (Then write → Write).
    raw = raw.charAt(0).toUpperCase() + raw.slice(1);
    clauses.push(raw);
  }

  return clauses.length ? clauses : [source];
}

function parseLearnerTask(value) {
  var text = String(value == null ? "" : value).replace(/\r\n?/g, "\n").trim();
  if (!text) return [];

  var marker = /(?:^|\n)\s*(\d+)[.)]\s+/g;
  var matches = [];
  var match;
  while ((match = marker.exec(text)) !== null) {
    matches.push({
      number: Number(match[1]),
      markerStart: match.index,
      textStart: marker.lastIndex
    });
  }

  if (matches.length) {
    return matches.map(function (entry, index) {
      var end = index + 1 < matches.length ? matches[index + 1].markerStart : text.length;
      return {
        sourceStepNumber: entry.number,
        text: text.slice(entry.textStart, end).trim()
      };
    });
  }

  return splitUnnumberedSequentialClauses(text).map(function (clause, index) {
    return {
      sourceStepNumber: index + 1,
      text: clause
    };
  });
}

module.exports = {
  parseLearnerTask: parseLearnerTask,
  splitUnnumberedSequentialClauses: splitUnnumberedSequentialClauses
};
