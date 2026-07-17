"use strict";

/**
 * Parse authored numbered entries without rewriting or splitting their text.
 *
 * @param {*} value
 * @returns {Array<{sourceStepNumber:number,text:string}>}
 */
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

  if (!matches.length) {
    return [{ sourceStepNumber: 1, text: text }];
  }

  return matches.map(function (entry, index) {
    var end = index + 1 < matches.length ? matches[index + 1].markerStart : text.length;
    return {
      sourceStepNumber: entry.number,
      text: text.slice(entry.textStart, end).trim()
    };
  });
}

module.exports = {
  parseLearnerTask: parseLearnerTask
};
