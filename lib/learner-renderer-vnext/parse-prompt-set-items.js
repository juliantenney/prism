"use strict";

/**
 * Parse distinct authored prompt items from prompt_set material bodies.
 * Only numbered list items at line start are treated as separate prompts.
 *
 * @param {string} body
 * @returns {Array<{ order: number, label: string, prompt: string }>}
 */
function parsePromptSetItems(body) {
  var text = String(body == null ? "" : body).replace(/\r\n?/g, "\n").trim();
  if (!text) return [];

  var marker = /(?:^|\n)\s*(\d+)[.)]\s+/g;
  var matches = [];
  var match;
  while ((match = marker.exec(text)) !== null) {
    matches.push({
      number: Number(match[1]),
      textStart: marker.lastIndex,
      markerStart: match.index
    });
  }

  if (!matches.length) return [];

  return matches.map(function (entry, index) {
    var end = index + 1 < matches.length ? matches[index + 1].markerStart : text.length;
    var slice = text.slice(entry.textStart, end).trim();
    var prompt = slice.replace(/^\d+[.)]\s*/, "").trim();
    return {
      order: entry.number,
      label: "Your response",
      prompt: prompt
    };
  });
}

module.exports = {
  parsePromptSetItems: parsePromptSetItems
};
