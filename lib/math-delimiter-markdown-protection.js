"use strict";

/**
 * Protect supported MathJax TeX delimiters before Markdown inline transforms,
 * and conservatively normalize currency-safe inline `$ ... $` TeX expressions
 * into canonical `\(...\)` delimiters.
 *
 * MathJax itself remains configured exclusively for `\(...\)` and `\[...\]`
 * so ordinary currency values (e.g. "$500 to $1,200") are never misinterpreted
 * as mathematics.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_MATH_DELIMITER_PROTECTION = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var MAX_INLINE_DOLLAR_LENGTH = 200;

  function isEscapedAt(str, index) {
    var backslashes = 0;
    var i = index - 1;
    while (i >= 0 && str.charAt(i) === "\\") {
      backslashes += 1;
      i -= 1;
    }
    return backslashes % 2 === 1;
  }

  /**
   * Determine whether the candidate content between two single `$` signs on the
   * same line is a legitimate inline mathematical expression rather than
   * currency or ordinary prose.
   */
  function isLikelyInlineDollarMath(expr) {
    var s = String(expr == null ? "" : expr);
    if (!s || s.length > MAX_INLINE_DOLLAR_LENGTH) return false;
    if (/[\r\n]/.test(s)) return false;
    // Opening `$` cannot be followed by whitespace; closing `$` cannot be preceded by whitespace.
    if (/^\s/.test(s) || /\s$/.test(s)) return false;

    // Hard currency / prose rejections:
    // 1. Starts with a currency-shaped number followed by whitespace, multiplier (50k, 5M, 10%), or range separator (10-, 10–, 10/)
    if (/^\d[\d,]*(?:\.\d+)?(?:\s*[kKmMbB%]\b|\s+[^\s=<>+\-*/^_\\|]|[-–—/]$)/.test(s)) {
      return false;
    }
    // 2. Comma-formatted number with no math operators/commands (e.g. "1,200" or "40,000")
    if (/^\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(s)) {
      return false;
    }
    // 3. Ends with a dangling range/punctuation separator typical of "$10-$20" or "$50/$100"
    if (/[-–—/,;:]$/.test(s) && !/\\[A-Za-z]+$/.test(s)) {
      return false;
    }

    var hasTexCommand = /\\[A-Za-z]+/.test(s);

    // 4. Two or more consecutive multi-letter prose words (unless TeX commands are present, e.g. \text{...})
    if (!hasTexCommand && /[A-Za-z]{2,}\s+[A-Za-z]{2,}/.test(s)) {
      return false;
    }

    // Positive mathematical signal required:
    // (a) Single ASCII variable letter: $r$, $x$, $n$, $p$, $y$, $t$, $F$, $R$
    if (/^[A-Za-z]$/.test(s)) return true;
    // (b) TeX command: $\alpha$, $\bar{x}$, $\frac{a}{b}$, $\le$, $\pm$, $\hat{y}$
    if (hasTexCommand) return true;
    // (c) Subscript or superscript: $x_i$, $x_1$, $R^2$, $H_0$, $e^x$
    if (/[_^]/.test(s)) return true;
    // (d) Function / probability / expectation notation: $f(x)$, $P(A|B)$, $E(X)$, $Var(X)$
    if (/^[A-Za-z][A-Za-z0-9]*\([^)]+\)$/.test(s)) return true;
    // (e) Mathematical relation or binary/unary operator: $r=0.96$, $r = -0.82$, $p < 0.05$, $y = mx + b$
    if (/[=<>+\-*\/±×÷≤≥≠≈|]/.test(s)) {
      // Reject bare currency-style phrases that happened to include a hyphenated word like "per-unit"
      if (/^[A-Za-z]{2,}-[A-Za-z]{2,}$/.test(s)) return false;
      // Reject currency-number followed by a space and non-operator text (double-guard)
      if (/^\d[\d,]*(?:\.\d+)?\s+[A-Za-z(]/.test(s)) return false;
      return true;
    }
    // (f) Single digit in math notation (e.g. $0$, $1$)
    if (/^\d$/.test(s)) return true;

    return false;
  }

  /**
   * Find the end of a backtick inline code span starting at `startIdx`.
   * Returns index immediately after closing backticks, or -1 if unclosed.
   */
  function findCodeSpanEnd(str, startIdx) {
    var ticks = 0;
    while (startIdx + ticks < str.length && str.charAt(startIdx + ticks) === "`") {
      ticks += 1;
    }
    if (!ticks) return -1;
    var i = startIdx + ticks;
    while (i < str.length) {
      if (str.charAt(i) === "`") {
        var run = 0;
        while (i + run < str.length && str.charAt(i + run) === "`") {
          run += 1;
        }
        if (run === ticks) {
          return i + run;
        }
        i += run;
      } else {
        i += 1;
      }
    }
    return -1;
  }

  /**
   * Scan `raw` and replace currency-safe inline `$ ... $` expressions using `onMatch(canonicalLatex)`.
   * Preserves existing `\[...\]`, `\(...\)`, inline code spans, `$$...$$`, escaped `\$`, and currency.
   */
  function transformInlineDollarMath(text, onMatch) {
    var raw = String(text == null ? "" : text);
    if (!raw || raw.indexOf("$") === -1) return raw;

    var out = "";
    var i = 0;
    var len = raw.length;

    while (i < len) {
      var ch = raw.charAt(i);

      // Skip inline backtick code spans untouched
      if (ch === "`") {
        var codeEnd = findCodeSpanEnd(raw, i);
        if (codeEnd !== -1) {
          out += raw.slice(i, codeEnd);
          i = codeEnd;
          continue;
        }
      }

      // Skip already-delimited \[...\] and \(...\) untouched
      if (ch === "\\" && i + 1 < len) {
        var nextCh = raw.charAt(i + 1);
        if (nextCh === "[") {
          var closeBracket = raw.indexOf("\\]", i + 2);
          if (closeBracket !== -1) {
            out += raw.slice(i, closeBracket + 2);
            i = closeBracket + 2;
            continue;
          }
        } else if (nextCh === "(") {
          var closeParen = raw.indexOf("\\)", i + 2);
          if (closeParen !== -1) {
            out += raw.slice(i, closeParen + 2);
            i = closeParen + 2;
            continue;
          }
        }
      }

      if (ch === "$" && !isEscapedAt(raw, i)) {
        // Skip double dollar $$ untouched
        if (i + 1 < len && raw.charAt(i + 1) === "$") {
          out += "$$";
          i += 2;
          continue;
        }

        var prevCh = i > 0 ? raw.charAt(i - 1) : "";
        var afterOpen = i + 1 < len ? raw.charAt(i + 1) : "";

        // Opening `$` must not follow an alphanumeric character (e.g. US$50, var$x)
        // and must not be followed by whitespace or `$`.
        if (afterOpen && !/\s/.test(afterOpen) && afterOpen !== "$" && !/[A-Za-z0-9]/.test(prevCh)) {
          // Search forward on the same line for the next single unescaped `$`
          var j = i + 1;
          var matchedEnd = -1;
          while (j < len && j - i <= MAX_INLINE_DOLLAR_LENGTH + 1) {
            var cj = raw.charAt(j);
            if (cj === "\n" || cj === "\r") break;
            if (cj === "$" && !isEscapedAt(raw, j)) {
              if (j + 1 < len && raw.charAt(j + 1) === "$") {
                // Hit a `$$`, abort candidate
                break;
              }
              var afterClose = j + 1 < len ? raw.charAt(j + 1) : "";
              var candidate = raw.slice(i + 1, j);
              // Closing `$` cannot be immediately followed by a digit (currency like "$500 to $1,200" or "$10-$20")
              if (!/[0-9]/.test(afterClose) && isLikelyInlineDollarMath(candidate)) {
                matchedEnd = j;
              }
              // Only consider the nearest single `$` for this opening `$`; if rejected,
              // this `$` is currency/literal, so advance past it and let later `$` pair cleanly.
              break;
            }
            j += 1;
          }

          if (matchedEnd !== -1) {
            var inner = raw.slice(i + 1, matchedEnd);
            var canonical = "\\(" + inner + "\\)";
            out += typeof onMatch === "function" ? onMatch(canonical) : canonical;
            i = matchedEnd + 1;
            continue;
          }
        }
      }

      out += ch;
      i += 1;
    }

    return out;
  }

  /**
   * Scan `raw` and replace paired display `$$...$$` (single-line or multiline)
   * with canonical `\[...\]` via `onMatch(canonicalLatex)`.
   * Preserves fenced/inline code spans, existing `\[...\]`/`\(...\)`, and escaped `\$`.
   */
  function transformDisplayDollarMath(text, onMatch) {
    var raw = String(text == null ? "" : text);
    if (!raw || raw.indexOf("$$") === -1) return raw;

    var out = "";
    var i = 0;
    var len = raw.length;

    while (i < len) {
      var ch = raw.charAt(i);

      // Skip inline and fenced backtick code spans untouched
      if (ch === "`") {
        var codeEnd = findCodeSpanEnd(raw, i);
        if (codeEnd !== -1) {
          out += raw.slice(i, codeEnd);
          i = codeEnd;
          continue;
        }
      }

      // Skip already-delimited \[...\] and \(...\) untouched
      if (ch === "\\" && i + 1 < len) {
        var nextCh = raw.charAt(i + 1);
        if (nextCh === "[") {
          var closeBracket = raw.indexOf("\\]", i + 2);
          if (closeBracket !== -1) {
            out += raw.slice(i, closeBracket + 2);
            i = closeBracket + 2;
            continue;
          }
        } else if (nextCh === "(") {
          var closeParen = raw.indexOf("\\)", i + 2);
          if (closeParen !== -1) {
            out += raw.slice(i, closeParen + 2);
            i = closeParen + 2;
            continue;
          }
        }
      }

      if (ch === "$" && i + 1 < len && raw.charAt(i + 1) === "$" && !isEscapedAt(raw, i)) {
        // Search forward for the matching unescaped closing `$$`
        var j = i + 2;
        var closeIdx = -1;
        while (j + 1 < len) {
          if (raw.charAt(j) === "$" && raw.charAt(j + 1) === "$" && !isEscapedAt(raw, j)) {
            closeIdx = j;
            break;
          }
          j += 1;
        }
        if (closeIdx !== -1) {
          var inner = raw.slice(i + 2, closeIdx);
          if (inner.trim().length > 0) {
            var canonical = "\\[" + inner + "\\]";
            out += typeof onMatch === "function" ? onMatch(canonical) : canonical;
            i = closeIdx + 2;
            continue;
          }
        }
        // Unclosed or empty `$$` — emit literally
        out += "$$";
        i += 2;
        continue;
      }

      out += ch;
      i += 1;
    }

    return out;
  }

  function normalizeDisplayDollarMath(text) {
    return transformDisplayDollarMath(text, null);
  }

  function normalizeInlineDollarMath(text) {
    return transformInlineDollarMath(text, null);
  }

  function normalizeDollarMath(text) {
    return normalizeInlineDollarMath(normalizeDisplayDollarMath(text));
  }

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
      out = transformDisplayDollarMath(out, function (canonicalLatex) {
        var token = "@@PRISMMATHBLOCK" + tokens.length + "@@";
        tokens.push(canonicalLatex);
        return token;
      });
    }
    if (includeInline) {
      out = out.replace(/\\\([\s\S]*?\\\)/g, function (m) {
        var token = "@@PRISMMATHINLINE" + tokens.length + "@@";
        tokens.push(String(m == null ? "" : m));
        return token;
      });
      out = transformInlineDollarMath(out, function (canonicalLatex) {
        var token = "@@PRISMMATHINLINE" + tokens.length + "@@";
        tokens.push(canonicalLatex);
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
        htmlOut = htmlOut.replace(new RegExp(tokenEsc, "g"), function () {
          return mathEsc;
        });
        htmlOut = htmlOut.replace(new RegExp(token, "g"), function () {
          return mathEsc;
        });
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

  return {
    isLikelyInlineDollarMath: isLikelyInlineDollarMath,
    normalizeDisplayDollarMath: normalizeDisplayDollarMath,
    normalizeInlineDollarMath: normalizeInlineDollarMath,
    normalizeDollarMath: normalizeDollarMath,
    protectSupportedMathDelimiters: protectSupportedMathDelimiters,
    restoreProtectedMathDelimiters: restoreProtectedMathDelimiters,
    protectSupportedMathBlocks: protectSupportedMathBlocks,
    restoreProtectedMathBlocks: restoreProtectedMathBlocks
  };
});
