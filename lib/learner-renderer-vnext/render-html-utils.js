"use strict";

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
  return escaped;
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

function renderMarkdownTable(lines, startIdx, options) {
  var opts = options && typeof options === "object" ? options : {};
  var header = parseMarkdownTableRow(lines[startIdx]);
  if (!header.length) return null;
  var dividerIdx = startIdx + 1;
  if (dividerIdx >= lines.length || !isMarkdownTableDivider(lines[dividerIdx])) {
    return null;
  }

  var rows = [];
  var index = dividerIdx + 1;
  while (index < lines.length) {
    var line = String(lines[index] || "");
    if (!String(line || "").trim()) break;
    if (line.indexOf("|") === -1) break;
    rows.push(parseMarkdownTableRow(line));
    index += 1;
  }

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

function renderMarkdownBlock(text, options) {
  var opts = options && typeof options === "object" ? options : {};
  var raw = String(text == null ? "" : text).replace(/\r\n?/g, "\n").trim();
  if (!raw) return "";

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

    var table = renderMarkdownTable(lines, index, opts);
    if (table) {
      parts.push(table.html);
      index = table.nextIdx;
      continue;
    }

    var headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      var tag = "h" + String(headingMatch[1].length);
      parts.push(
        "<" + tag + ">" + renderMarkdownInline(headingMatch[2]) + "</" + tag + ">"
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

  return parts.join("");
}

function renderMaterialHeading(title) {
  var text = String(title || "").trim();
  if (!text) return "";
  return '<h4 class="util-material-heading">' + escapeHtml(text) + "</h4>";
}

module.exports = {
  escapeHtml: escapeHtml,
  escapeAttribute: escapeAttribute,
  arrayOrEmpty: arrayOrEmpty,
  joinHtml: joinHtml,
  renderPlainText: renderPlainText,
  renderMarkdownInline: renderMarkdownInline,
  renderMarkdownBlock: renderMarkdownBlock,
  renderMaterialHeading: renderMaterialHeading
};
