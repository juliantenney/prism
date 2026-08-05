"use strict";

/**
 * Parse independently meaningful template sections that request learner writing.
 *
 * @param {string} body
 * @returns {Array<{ order: number, label: string, prompt: string }>}
 */
function parseTemplateSections(body) {
  function fallbackPromptForLabel(label) {
    var sectionLabel = String(label || "").trim();
    if (!sectionLabel) return "Record your response.";
    return "Record your response for " + sectionLabel + ".";
  }

  var text = String(body == null ? "" : body).replace(/\r\n?/g, "\n").trim();
  if (!text) return [];

  var markers = [];
  var boldRe = /(?:^|\n)\s*\*\*([^*]+):\*\*[ \t]*/g;
  var match;
  while ((match = boldRe.exec(text)) !== null) {
    markers.push({
      label: String(match[1] || "").trim(),
      contentStart: boldRe.lastIndex,
      markerStart: match.index
    });
  }

  if (markers.length) {
    return markers.map(function (entry, index) {
      var end = index + 1 < markers.length ? markers[index + 1].markerStart : text.length;
      var prompt = text.slice(entry.contentStart, end).trim();
      return {
        order: index + 1,
        label: entry.label,
        prompt: prompt || fallbackPromptForLabel(entry.label)
      };
    });
  }

  var sections = [];
  var headingPattern = /(?:^|\n)(#{1,3})\s+([^\n]+)\n([\s\S]*?)(?=(?:\n#{1,3}\s+)|$)/g;
  var headingMatch;
  while ((headingMatch = headingPattern.exec(text)) !== null) {
    var heading = String(headingMatch[2] || "").trim();
    var content = String(headingMatch[3] || "").trim();
    if (!heading) continue;
    if (/^evidence assessed against criteria$/i.test(heading) && /^-\s/m.test(content)) {
      continue;
    }
    sections.push({
      order: sections.length + 1,
      label: heading,
      prompt: content || fallbackPromptForLabel(heading)
    });
  }

  return sections;
}

module.exports = {
  parseTemplateSections: parseTemplateSections
};
