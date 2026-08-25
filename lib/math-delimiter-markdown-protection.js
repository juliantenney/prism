"use strict";

/**
 * Protect supported MathJax TeX delimiters before Markdown inline transforms.
 * Mirrors legacy semantics in app.js utilityProtectSupportedMathDelimiters.
 */

function protectSupportedMathDelimiters(text, options) {
  var raw = String(text == null ? "" : text);
  if (!raw) return { text: "", tokens: [] };
  var cfg = options && typeof options === "object" ? options : {};
  var includeInline = cfg.includeInline !== false;
  var includeBlock = cfg.includeBlock !== false;
  var tokens = [];
  var out = raw;
  if (includeBlock) {
    out = out.replace(/\\\[[\s\S]*?\\\]/g, function (m) {
      var token = "@@PRISMMATHBLOCK" + tokens.length + "@@";
      tokens.push(String(m == null ? "" : m));
      return token;
    });
  }
  if (includeInline) {
    out = out.replace(/\\\([\s\S]*?\\\)/g, function (m) {
      var token = "@@PRISMMATHINLINE" + tokens.length + "@@";
      tokens.push(String(m == null ? "" : m));
      return token;
    });
  }
  return { text: out, tokens: tokens };
}

function restoreProtectedMathDelimiters(htmlText, tokens, options, escapeHtmlFn) {
  var htmlOut = String(htmlText == null ? "" : htmlText);
  var saved = Array.isArray(tokens) ? tokens : [];
  var cfg = options && typeof options === "object" ? options : {};
  var kind = String(cfg.kind || "both").toLowerCase();
  var escapeHtml =
    typeof escapeHtmlFn === "function"
      ? escapeHtmlFn
      : function (value) {
          return String(value == null ? "" : value);
        };
  saved.forEach(function (mathText, idx) {
    var mathEsc = escapeHtml(String(mathText == null ? "" : mathText));
    function replaceToken(token) {
      var tokenEsc = escapeHtml(token);
      htmlOut = htmlOut.replace(new RegExp(tokenEsc, "g"), mathEsc);
      htmlOut = htmlOut.replace(new RegExp(token, "g"), mathEsc);
    }
    if (kind === "inline" || kind === "both") {
      replaceToken("@@PRISMMATHINLINE" + idx + "@@");
    }
    if (kind === "block" || kind === "both") {
      replaceToken("@@PRISMMATHBLOCK" + idx + "@@");
    }
  });
  return htmlOut;
}

function protectSupportedMathBlocks(text) {
  var result = protectSupportedMathDelimiters(text, {
    includeInline: false,
    includeBlock: true
  });
  return { text: result.text, blocks: result.tokens };
}

function restoreProtectedMathBlocks(htmlText, blocks, escapeHtmlFn) {
  return restoreProtectedMathDelimiters(htmlText, blocks, { kind: "block" }, escapeHtmlFn);
}

module.exports = {
  protectSupportedMathDelimiters: protectSupportedMathDelimiters,
  restoreProtectedMathDelimiters: restoreProtectedMathDelimiters,
  protectSupportedMathBlocks: protectSupportedMathBlocks,
  restoreProtectedMathBlocks: restoreProtectedMathBlocks
};
