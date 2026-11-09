"use strict";

var mathProtect = require("../math-delimiter-markdown-protection");

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

function joinHtml(fragments) {
  return arrayOrEmpty(fragments)
    .filter(function (fragment) {
      return String(fragment == null ? "" : fragment).trim() !== "";
    })
    .join("");
}

function renderPlainText(value) {
  var text = String(value == null ? "" : value).trim();
  if (!text) return "";

  return text
    .split(/\n\s*\n/)
    .map(function (paragraph) {
      return "<p>" + escapeHtml(paragraph).replace(/\r?\n/g, "<br>") + "</p>";
    })
    .join("");
}

function renderMarkdownInline(text) {
  var raw = String(text == null ? "" : text);
  if (!raw) return "";

  var protectedMath = mathProtect.protectSupportedMathDelimiters(raw, {
    includeInline: true,
    includeBlock: true
  });
  raw = protectedMath.text;

  var escaped = escapeHtml(raw);
  escaped = escaped.replace(/`([^`\n]+)`/g, "<code>$1</code>");
  escaped = escaped.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  escaped = escaped.replace(/__([^_\n]+)__/g, "<strong>$1</strong>");
  escaped = escaped.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  escaped = escaped.replace(/(^|[^_])_([^_\n]+)_/g, "$1<em>$2</em>");
  escaped = escaped.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    function (_match, label, href) {
      return (
        '<a href="' +
        escapeAttribute(href) +
        '" target="_blank" rel="noopener noreferrer">' +
        label +
        "</a>"
      );
    }
  );
  return mathProtect.restoreProtectedMathDelimiters(
    escaped,
    protectedMath.tokens,
    { kind: "both" },
    escapeHtml
  );
}

function isMarkdownTableDivider(line) {
  var trimmed = String(line || "").trim();
  if (!trimmed) return false;
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(trimmed);
}

function parseMarkdownTableRow(line) {
  var trimmed = String(line || "").trim();
  if (!trimmed) return [];
  if (trimmed.charAt(0) === "|") trimmed = trimmed.slice(1);
  if (trimmed.charAt(trimmed.length - 1) === "|") trimmed = trimmed.slice(0, -1);
  return trimmed.split("|").map(function (cell) {
    return String(cell || "").trim();
  });
}

function collectConsistentPipeTableBody(lines, startIdx, columnCount) {
  var rows = [];
  var index = startIdx;
  while (index < lines.length) {
    var line = String(lines[index] || "");
    if (!String(line || "").trim()) break;
    if (line.indexOf("|") === -1) break;
    if (isMarkdownTableDivider(line)) break;
    var cells = parseMarkdownTableRow(line);
    if (!cells.length || cells.length !== columnCount) break;
    rows.push(cells);
    index += 1;
  }
  return { rows: rows, nextIdx: index };
}

/**
 * Recognise a Markdown/GFM table, including Assessment Pack evidence tables that
 * keep row newlines and pipe columns but omit the optional |---| divider row.
 * Require ≥2 columns and ≥1 body row with matching column counts so ordinary
 * single-line prose containing "|" is left alone.
 */
function renderMarkdownTable(lines, startIdx, options) {
  var opts = options && typeof options === "object" ? options : {};
  var headerLine = String(lines[startIdx] || "");
  if (headerLine.indexOf("|") === -1) return null;
  var header = parseMarkdownTableRow(headerLine);
  if (header.length < 2) return null;

  var bodyStart = startIdx + 1;
  if (bodyStart < lines.length && isMarkdownTableDivider(lines[bodyStart])) {
    bodyStart += 1;
  } else {
    var probe = collectConsistentPipeTableBody(lines, bodyStart, header.length);
    if (!probe.rows.length) return null;
  }

  var collected = collectConsistentPipeTableBody(lines, bodyStart, header.length);
  if (!collected.rows.length) return null;
  var rows = collected.rows;
  var index = collected.nextIdx;

  var headHtml =
    "<tr>" +
    header
      .map(function (cell) {
        return "<th>" + renderMarkdownInline(cell) + "</th>";
      })
      .join("") +
    "</tr>";
  var bodyHtml = rows
    .map(function (row) {
      return (
        "<tr>" +
        row
          .map(function (cell) {
            return "<td>" + renderMarkdownInline(cell) + "</td>";
          })
          .join("") +
        "</tr>"
      );
    })
    .join("");
  var tableHtml =
    "<table><thead>" +
    headHtml +
    "</thead>" +
    (bodyHtml ? "<tbody>" + bodyHtml + "</tbody>" : "") +
    "</table>";

  if (opts.wrapTables) {
    tableHtml =
      '<div class="util-table-scroll util-material-table">' + tableHtml + "</div>";
  }

  return { html: tableHtml, nextIdx: index };
}

function isTextFenceOpen(line) {
  return /^```\s*text\s*$/i.test(String(line || "").trim());
}

function isTextFenceClose(line) {
  return /^```\s*$/.test(String(line || "").trim());
}

/**
 * A fenced ```text block is fixed-width learner content, such as an
 * individual-value plot. Keep every character; do not wrap or restyle it
 * as prose. An unclosed fence is left for the ordinary paragraph path.
 */
function readTextFence(lines, startIdx) {
  var end = startIdx + 1;
  while (end < lines.length) {
    var candidate = String(lines[end] || "");
    if (isTextFenceClose(candidate)) {
      return {
        body: lines.slice(startIdx + 1, end).join("\n"),
        nextIdx: end + 1
      };
    }
    if (/^```/.test(candidate.trim())) return null;
    end += 1;
  }
  return null;
}

function renderFencedText(body) {
  return '<div class="util-fenced-text"><pre>' + escapeHtml(body) + "</pre></div>";
}

function extractTextFences(raw) {
  var lines = String(raw || "").split("\n");
  var fences = [];
  var out = [];
  var index = 0;
  while (index < lines.length) {
    if (isTextFenceOpen(lines[index])) {
      var fenced = readTextFence(lines, index);
      if (fenced) {
        out.push("@@PRISMFENCEDTEXT" + fences.length + "@@");
        fences.push(fenced.body);
        index = fenced.nextIdx;
        continue;
      }
    }
    out.push(lines[index]);
    index += 1;
  }
  return { text: out.join("\n"), fences: fences };
}

function renderMarkdownBlock(text, options) {
  var opts = options && typeof options === "object" ? options : {};
  var raw = String(text == null ? "" : text).replace(/\r\n?/g, "\n").trim();
  if (!raw) return "";

  var extracted = extractTextFences(raw);
  var fencedTexts = extracted.fences;
  var protectedBlocks = mathProtect.protectSupportedMathBlocks(extracted.text);
  raw = protectedBlocks.text;

  var bulletLineRe = /^[-*•]\s+(.+)$/;
  var lines = raw.split("\n");
  var index = 0;
  var parts = [];

  while (index < lines.length) {
    var line = String(lines[index] || "");
    var trimmed = line.trim();
    if (!trimmed) {
      index += 1;
      continue;
    }

    var fenceToken = trimmed.match(/^@@PRISMFENCEDTEXT(\d+)@@$/);
    if (fenceToken) {
      parts.push(renderFencedText(fencedTexts[Number(fenceToken[1])] || ""));
      index += 1;
      continue;
    }

    var table = renderMarkdownTable(lines, index, opts);
    if (table) {
      parts.push(table.html);
      index = table.nextIdx;
      continue;
    }

    var headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      var sourceDepth = headingMatch[1].length;
      parts.push(
        '<h3 class="util-md-heading util-md-heading--source-' +
          String(sourceDepth) +
          '">' +
          renderMarkdownInline(headingMatch[2]) +
          "</h3>"
      );
      index += 1;
      continue;
    }

    var bulletMatch = trimmed.match(bulletLineRe);
    if (bulletMatch) {
      var bulletBodies = [];
      while (index < lines.length) {
        var bulletLine = String(lines[index] || "").trim().match(bulletLineRe);
        if (!bulletLine) break;
        bulletBodies.push(String(bulletLine[1] || "").trim());
        index += 1;
      }
      parts.push(
        "<ul>" +
          bulletBodies
            .map(function (bodyText) {
              return "<li>" + renderMarkdownInline(bodyText) + "</li>";
            })
            .join("") +
          "</ul>"
      );
      continue;
    }

    var orderedMatch = trimmed.match(/^\d+[\)\.]\s+(.+)$/);
    if (orderedMatch) {
      var orderedBodies = [];
      while (index < lines.length) {
        var orderedLine = String(lines[index] || "").trim().match(/^\d+[\)\.]\s+(.+)$/);
        if (!orderedLine) break;
        orderedBodies.push(String(orderedLine[1] || "").trim());
        index += 1;
      }
      parts.push(
        "<ol>" +
          orderedBodies
            .map(function (bodyText) {
              return "<li>" + renderMarkdownInline(bodyText) + "</li>";
            })
            .join("") +
          "</ol>"
      );
      continue;
    }

    var paragraphLines = [trimmed];
    index += 1;
    while (index < lines.length) {
      var next = String(lines[index] || "").trim();
      if (!next) break;
      if (/^@@PRISMFENCEDTEXT\d+@@$/.test(next)) break;
      if (/^(#{1,6})\s+/.test(next)) break;
      if (bulletLineRe.test(next) || /^\d+[\)\.]\s+/.test(next)) break;
      if (isMarkdownTableDivider(next)) break;
      if (next.indexOf("|") !== -1 && index + 1 < lines.length && isMarkdownTableDivider(lines[index + 1])) {
        break;
      }
      paragraphLines.push(next);
      index += 1;
    }
    parts.push("<p>" + renderMarkdownInline(paragraphLines.join(" ")) + "</p>");
  }

  return mathProtect.restoreProtectedMathBlocks(parts.join(""), protectedBlocks.blocks, escapeHtml);
}

function renderMaterialHeading(title) {
  var text = String(title || "").trim();
  if (!text) return "";
  return '<p class="util-material-heading">' + escapeHtml(text) + "</p>";
}

module.exports = {
  escapeHtml: escapeHtml,
  escapeAttribute: escapeAttribute,
  arrayOrEmpty: arrayOrEmpty,
  joinHtml: joinHtml,
  renderPlainText: renderPlainText,
  renderMarkdownInline: renderMarkdownInline,
  renderMarkdownBlock: renderMarkdownBlock,
  renderMaterialHeading: renderMaterialHeading,
  isMarkdownTableDivider: isMarkdownTableDivider,
  parseMarkdownTableRow: parseMarkdownTableRow
};
