"use strict";

var BOLD_LABEL_RE_SOURCE = "(?:^|\\n)\\s*\\*\\*([^*]+):\\*\\*[ \\t]*";
var HEADING_SECTION_RE_SOURCE = "(?:^|\\n)(#{1,3})\\s+([^\\n]+)\\n([\\s\\S]*?)(?=(?:\\n#{1,3}\\s+)|$)";

function normaliseBody(body) {
  return String(body == null ? "" : body).replace(/\r\n?/g, "\n").trim();
}

function scanBoldMarkers(text) {
  var markers = [];
  var boldRe = new RegExp(BOLD_LABEL_RE_SOURCE, "g");
  var match;
  while ((match = boldRe.exec(text)) !== null) {
    markers.push({
      label: String(match[1] || "").trim(),
      contentStart: boldRe.lastIndex,
      markerStart: match.index
    });
  }
  return markers;
}

/** Heading-form sections that are deliberately not response sections (kept as visible content). */
function isSkippedEvidenceSection(heading, content) {
  return /^evidence assessed against criteria$/i.test(heading) && /^-\s/m.test(content);
}

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

  var text = normaliseBody(body);
  if (!text) return [];

  var markers = scanBoldMarkers(text);

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
  var headingPattern = new RegExp(HEADING_SECTION_RE_SOURCE, "g");
  var headingMatch;
  while ((headingMatch = headingPattern.exec(text)) !== null) {
    var heading = String(headingMatch[2] || "").trim();
    var content = String(headingMatch[3] || "").trim();
    if (!heading) continue;
    if (isSkippedEvidenceSection(heading, content)) {
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

/**
 * Template content that parseTemplateSections does NOT turn into response sections:
 * text before the first response label/heading, and heading-form evidence lists that are
 * intentionally skipped. Used to decide whether a response-composed template still has
 * learner-visible content once its sections are realised as workspaces.
 *
 * @param {string} body
 * @returns {string} Markdown (empty when the body is wholly consumed by sections)
 */
function templateResidualBody(body) {
  var text = normaliseBody(body);
  if (!text) return "";

  var markers = scanBoldMarkers(text);
  if (markers.length) {
    return text.slice(0, markers[0].markerStart).trim();
  }

  var headingPattern = new RegExp(HEADING_SECTION_RE_SOURCE, "g");
  var residual = [];
  var firstStart = -1;
  var headingMatch;
  while ((headingMatch = headingPattern.exec(text)) !== null) {
    if (firstStart < 0) firstStart = headingMatch.index;
    var heading = String(headingMatch[2] || "").trim();
    var content = String(headingMatch[3] || "").trim();
    if (heading && isSkippedEvidenceSection(heading, content)) {
      residual.push("### " + heading + "\n" + content);
    }
  }
  if (firstStart < 0) return text;
  var leading = text.slice(0, firstStart).trim();
  return (leading ? [leading] : []).concat(residual).join("\n\n").trim();
}

module.exports = {
  parseTemplateSections: parseTemplateSections,
  templateResidualBody: templateResidualBody
};
