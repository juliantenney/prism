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
  if (typeof mathProtect.normalizeDollarMath === "function") {
    text = mathProtect.normalizeDollarMath(text);
  } else if (typeof mathProtect.normalizeInlineDollarMath === "function") {
    text = mathProtect.normalizeInlineDollarMath(text);
  }

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
    var isWide = isWideMarkdownTable(header, rows);
    tableHtml =
      '<div class="util-table-scroll util-material-table' +
      (isWide ? " util-exposition-table-breakout" : "") +
      '">' +
      tableHtml +
      "</div>";
  }

  return { html: tableHtml, nextIdx: index };
}

function isWideMarkdownTable(header, rows) {
  var colCount = Array.isArray(header) ? header.length : 0;
  if (colCount >= 5) return true;
  if (colCount === 4) {
    var headerChars = header.reduce(function (sum, cell) {
      return sum + String(cell || "").trim().length;
    }, 0);
    if (headerChars > 100) return true;
    var maxRowChars = (Array.isArray(rows) ? rows : []).reduce(function (best, row) {
      var len = (Array.isArray(row) ? row : []).reduce(function (sum, cell) {
        return sum + String(cell || "").trim().length;
      }, 0);
      return len > best ? len : best;
    }, 0);
    if (maxRowChars > 140) return true;
  }
  return false;
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

/**
 * Recognise strictly paired <details><summary>...</summary>...</details> blocks
 * authored in Markdown exposition without enabling arbitrary HTML.
 * Skips fenced code blocks and inline backtick spans; always defaults closed.
 */
function extractDisclosureBlocks(raw) {
  var source = String(raw || "");
  if (!/<details[\s>]/i.test(source)) {
    return { text: source, disclosures: [] };
  }

  var disclosures = [];
  var out = "";
  var i = 0;
  var len = source.length;

  while (i < len) {
    // Skip fenced code blocks (``` ... ```)
    if (source.slice(i, i + 3) === "```" && (i === 0 || source.charAt(i - 1) === "\n")) {
      var fenceEnd = source.indexOf("\n```", i + 3);
      if (fenceEnd !== -1) {
        var afterFence = source.indexOf("\n", fenceEnd + 4);
        var endPos = afterFence === -1 ? len : afterFence + 1;
        out += source.slice(i, endPos);
        i = endPos;
        continue;
      }
    }

    // Skip inline backtick code spans
    if (source.charAt(i) === "`") {
      var tickRun = 1;
      while (i + tickRun < len && source.charAt(i + tickRun) === "`") tickRun += 1;
      var closer = source.indexOf(source.slice(i, i + tickRun), i + tickRun);
      if (closer !== -1) {
        out += source.slice(i, closer + tickRun);
        i = closer + tickRun;
        continue;
      }
      out += source.slice(i, i + tickRun);
      i += tickRun;
      continue;
    }

    if (source.charAt(i) === "<") {
      var openMatch = source.slice(i).match(/^<details(?:\s[^>]*)?>/i);
      if (openMatch) {
        var openTagLen = openMatch[0].length;
        var afterOpen = i + openTagLen;
        var rest = source.slice(afterOpen);
        var closeMatch = rest.match(/<\/details\s*>/i);
        if (closeMatch) {
          var inner = rest.slice(0, closeMatch.index);
          // Do not match malformed nested <details>
          if (!/<details[\s>]/i.test(inner)) {
            var summaryMatch = inner.match(/<summary(?:\s[^>]*)?>([\s\S]*?)<\/summary\s*>/i);
            if (summaryMatch) {
              var summaryText = String(summaryMatch[1] || "").trim();
              if (summaryText) {
                var bodyBefore = inner.slice(0, summaryMatch.index).trim();
                var bodyAfter = inner
                  .slice(summaryMatch.index + summaryMatch[0].length)
                  .trim();
                var bodyText = [bodyBefore, bodyAfter].filter(Boolean).join("\n\n");
                var token = "@@PRISMDISCLOSURE" + disclosures.length + "@@";
                disclosures.push({ summary: summaryText, body: bodyText });
                out += "\n\n" + token + "\n\n";
                i = afterOpen + closeMatch.index + closeMatch[0].length;
                continue;
              }
            }
          }
        }
      }
    }

    out += source.charAt(i);
    i += 1;
  }

  return { text: out, disclosures: disclosures };
}

function renderDisclosureBlock(disclosure, options) {
  var summary = String(disclosure && disclosure.summary || "").trim();
  var body = String(disclosure && disclosure.body || "").trim();
  if (!summary) return "";
  var bodyHtml = body ? renderMarkdownBlock(body, options) : "";
  return (
    '<details class="util-composition-reveal util-prose-measure" data-reveal-mode="details">' +
    "<summary>" +
    renderMarkdownInline(summary) +
    "</summary>" +
    '<div class="util-composition-reveal__body">' +
    bodyHtml +
    "</div>" +
    "</details>"
  );
}

function renderMarkdownBlock(text, options) {
  var opts = options && typeof options === "object" ? options : {};
  var raw = String(text == null ? "" : text).replace(/\r\n?/g, "\n").trim();
  if (!raw) return "";

  var extracted = extractTextFences(raw);
  var fencedTexts = extracted.fences;
  var extractedDisclosures = extractDisclosureBlocks(extracted.text);
  var disclosures = extractedDisclosures.disclosures;
  var protectedBlocks = mathProtect.protectSupportedMathBlocks(extractedDisclosures.text);
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

    var disclosureToken = trimmed.match(/^@@PRISMDISCLOSURE(\d+)@@$/);
    if (disclosureToken) {
      var renderedDisclosure = renderDisclosureBlock(
        disclosures[Number(disclosureToken[1])],
        opts
      );
      if (renderedDisclosure) parts.push(renderedDisclosure);
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
      if (/^@@PRISMDISCLOSURE\d+@@$/.test(next)) break;
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
