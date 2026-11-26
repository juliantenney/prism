/**
 * Restrictive parser-based SVG structural validator & allowlist for inline
 * assessment stimulus SVG markup (and shared security check for SVG intake).
 *
 * Defense-in-depth: works identically in Node, browser preview, standalone
 * HTML publication, and LMS export with zero external dependencies.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.PRISM_SVG_STIMULUS_SECURITY = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var ALLOWED_SVG_ELEMENTS = Object.freeze({
    svg: true,
    title: true,
    desc: true,
    g: true,
    rect: true,
    circle: true,
    ellipse: true,
    line: true,
    polyline: true,
    polygon: true,
    path: true,
    text: true,
    tspan: true,
    defs: true,
    clippath: true
  });

  var ALLOWED_SVG_ATTRIBUTES = Object.freeze({
    xmlns: true,
    role: true,
    viewbox: true,
    width: true,
    height: true,
    preserveaspectratio: true,
    id: true,
    class: true,
    "aria-label": true,
    "aria-labelledby": true,
    "aria-describedby": true,
    "aria-hidden": true,
    focusable: true,
    x: true,
    y: true,
    x1: true,
    y1: true,
    x2: true,
    y2: true,
    cx: true,
    cy: true,
    r: true,
    rx: true,
    ry: true,
    dx: true,
    dy: true,
    d: true,
    points: true,
    transform: true,
    fill: true,
    "fill-opacity": true,
    "fill-rule": true,
    stroke: true,
    "stroke-width": true,
    "stroke-opacity": true,
    "stroke-dasharray": true,
    "stroke-linecap": true,
    "stroke-linejoin": true,
    opacity: true,
    "font-family": true,
    "font-size": true,
    "font-weight": true,
    "font-style": true,
    "text-anchor": true,
    "dominant-baseline": true,
    "alignment-baseline": true,
    "clip-path": true,
    "clip-rule": true
  });

  var ALLOWED_ROLES = Object.freeze({
    img: true,
    presentation: true,
    none: true
  });

  var SAFE_LOCAL_CLIP_PATH_RE = /^(?:none|url\(\s*#[A-Za-z_][A-Za-z0-9_.:-]*\s*\))$/i;
  var UNSAFE_ATTR_VALUE_RE =
    /(?:javascript\s*:|vbscript\s*:|data\s*:|https?\s*:|\/\/|expression\s*\(|@import|url\s*\()/i;
  var TAG_NAME_RE = /^[A-Za-z][A-Za-z0-9:-]*$/;
  var ATTR_NAME_RE = /^[A-Za-z_][A-Za-z0-9:._-]*$/;

  function fail(code, reason, message) {
    return {
      ok: false,
      code: code || "unsafe_svg_stimulus",
      reason: reason || "invalid_svg",
      message: message || "Inline SVG stimulus failed security validation."
    };
  }

  function decodeXmlEntitiesForInspection(value) {
    return String(value == null ? "" : value)
      .replace(/&#x([0-9a-f]+);?/gi, function (_m, hex) {
        var cp = parseInt(hex, 16);
        return isFinite(cp) && cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : "";
      })
      .replace(/&#([0-9]+);?/g, function (_m, dec) {
        var cp = parseInt(dec, 10);
        return isFinite(cp) && cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : "";
      })
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&apos;/gi, "'");
  }

  function validateAttribute(attrNameRaw, attrValueRaw) {
    if (!ATTR_NAME_RE.test(attrNameRaw)) {
      return fail(
        "unsafe_svg_stimulus",
        "malformed_attribute_name",
        "Inline SVG contains a malformed attribute name."
      );
    }
    var lower = attrNameRaw.toLowerCase();
    if (lower.indexOf("on") === 0) {
      return fail(
        "unsafe_svg_stimulus",
        "disallowed_event_handler",
        "Inline SVG event handler attribute '" + attrNameRaw + "' is not permitted."
      );
    }
    if (!ALLOWED_SVG_ATTRIBUTES[lower]) {
      return fail(
        "unsafe_svg_stimulus",
        "disallowed_attribute",
        "Inline SVG attribute '" + attrNameRaw + "' is not on the permitted allowlist."
      );
    }

    var decoded = decodeXmlEntitiesForInspection(attrValueRaw);
    // Strip ASCII control characters and whitespace when checking protocol/URI schemes.
    var compact = decoded.replace(/[\u0000-\u0020]+/g, "");

    if (lower === "xmlns") {
      if (String(decoded).trim() !== "http://www.w3.org/2000/svg") {
        return fail(
          "unsafe_svg_stimulus",
          "invalid_xmlns",
          "Inline SVG xmlns must be 'http://www.w3.org/2000/svg'."
        );
      }
      return { ok: true };
    }

    if (lower === "role") {
      if (!ALLOWED_ROLES[String(decoded).trim().toLowerCase()]) {
        return fail(
          "unsafe_svg_stimulus",
          "disallowed_role",
          "Inline SVG role '" + decoded + "' is not permitted."
        );
      }
      return { ok: true };
    }

    if (lower === "clip-path") {
      if (!SAFE_LOCAL_CLIP_PATH_RE.test(String(decoded).trim())) {
        return fail(
          "unsafe_svg_stimulus",
          "unsafe_clip_path",
          "Inline SVG clip-path must be 'none' or a local '#id' reference."
        );
      }
      return { ok: true };
    }

    if (UNSAFE_ATTR_VALUE_RE.test(decoded) || UNSAFE_ATTR_VALUE_RE.test(compact)) {
      return fail(
        "unsafe_svg_stimulus",
        "unsafe_attribute_value",
        "Inline SVG attribute '" + attrNameRaw + "' contains a disallowed URI or external reference."
      );
    }

    return { ok: true };
  }

  /**
   * Parse and validate a single self-contained <svg>...</svg> string using a
   * strict XML/SVG state-machine parser and restrictive element/attribute allowlist.
   */
  function validateSafeInlineSvgStimulus(rawMarkup) {
    if (typeof rawMarkup !== "string") {
      return fail("unsafe_svg_stimulus", "empty_svg", "Inline SVG markup must be a non-empty string.");
    }
    var src = rawMarkup.trim();
    if (!src) {
      return fail("unsafe_svg_stimulus", "empty_svg", "Inline SVG markup is empty.");
    }
    if (src.indexOf("\u0000") !== -1) {
      return fail("unsafe_svg_stimulus", "null_byte", "Inline SVG contains a null byte.");
    }
    if (src.charCodeAt(0) !== 60) {
      return fail(
        "unsafe_svg_stimulus",
        "content_outside_root",
        "Inline SVG must begin directly with an <svg> root element."
      );
    }

    var len = src.length;
    var i = 0;
    var stack = [];
    var rootSeen = false;
    var rootClosed = false;

    while (i < len) {
      if (src[i] === "<") {
        if (rootClosed) {
          return fail(
            "unsafe_svg_stimulus",
            "content_outside_root",
            "Inline SVG must not contain elements or markup after the closing </svg> root."
          );
        }
        var next = src[i + 1];
        if (!next) {
          return fail("unsafe_svg_stimulus", "malformed_markup", "Truncated '<' in inline SVG.");
        }
        // Reject DOCTYPE, ENTITY, CDATA, XML comments, and processing instructions.
        if (next === "!" || next === "?") {
          return fail(
            "unsafe_svg_stimulus",
            "disallowed_xml_construct",
            "XML declarations, DOCTYPE, comments, CDATA, and processing instructions are not permitted in inline SVG."
          );
        }

        // Closing tag: </name>
        if (next === "/") {
          i += 2;
          var closeStart = i;
          while (i < len && !/[\s>]/.test(src[i])) i += 1;
          var closeName = src.slice(closeStart, i);
          while (i < len && /\s/.test(src[i])) i += 1;
          if (i >= len || src[i] !== ">") {
            return fail("unsafe_svg_stimulus", "malformed_closing_tag", "Malformed closing tag in inline SVG.");
          }
          i += 1;
          if (!closeName || !stack.length || stack[stack.length - 1] !== closeName.toLowerCase()) {
            return fail(
              "unsafe_svg_stimulus",
              "mismatched_closing_tag",
              "Mismatched or unexpected closing tag '</" + closeName + ">' in inline SVG."
            );
          }
          stack.pop();
          if (stack.length === 0) {
            rootClosed = true;
          }
          continue;
        }

        // Opening or self-closing tag: <name attr="val" ...>
        i += 1;
        var nameStart = i;
        while (i < len && !/[\s/>]/.test(src[i])) i += 1;
        var tagNameRaw = src.slice(nameStart, i);
        if (!TAG_NAME_RE.test(tagNameRaw)) {
          return fail("unsafe_svg_stimulus", "malformed_tag_name", "Malformed tag name in inline SVG.");
        }
        var tagLower = tagNameRaw.toLowerCase();

        if (!rootSeen) {
          if (tagLower !== "svg") {
            return fail(
              "unsafe_svg_stimulus",
              "invalid_root_element",
              "Inline SVG root element must be <svg>, found <" + tagNameRaw + ">."
            );
          }
          rootSeen = true;
        } else if (tagLower === "svg") {
          return fail(
            "unsafe_svg_stimulus",
            "nested_svg_disallowed",
            "Nested <svg> elements are not permitted in inline SVG stimulus."
          );
        }

        if (!ALLOWED_SVG_ELEMENTS[tagLower]) {
          return fail(
            "unsafe_svg_stimulus",
            "disallowed_element",
            "Inline SVG element '<" + tagNameRaw + ">' is not on the permitted allowlist."
          );
        }

        var seenAttrs = Object.create(null);
        var selfClosing = false;
        while (i < len) {
          while (i < len && /\s/.test(src[i])) i += 1;
          if (i >= len) {
            return fail("unsafe_svg_stimulus", "unclosed_tag", "Unclosed tag '<" + tagNameRaw + ">' in inline SVG.");
          }
          if (src[i] === ">") {
            i += 1;
            break;
          }
          if (src[i] === "/" && src[i + 1] === ">") {
            selfClosing = true;
            i += 2;
            break;
          }
          var attrStart = i;
          while (i < len && !/[\s=/>]/.test(src[i])) i += 1;
          var attrName = src.slice(attrStart, i);
          if (!attrName) {
            return fail("unsafe_svg_stimulus", "malformed_attribute", "Malformed attribute in <" + tagNameRaw + ">.");
          }
          while (i < len && /\s/.test(src[i])) i += 1;
          if (i >= len || src[i] !== "=") {
            return fail(
              "unsafe_svg_stimulus",
              "missing_attribute_value",
              "Attribute '" + attrName + "' in <" + tagNameRaw + "> must have a quoted value."
            );
          }
          i += 1;
          while (i < len && /\s/.test(src[i])) i += 1;
          var quote = src[i];
          if (quote !== '"' && quote !== "'") {
            return fail(
              "unsafe_svg_stimulus",
              "unquoted_attribute",
              "Attribute '" + attrName + "' in <" + tagNameRaw + "> must be quoted."
            );
          }
          i += 1;
          var valStart = i;
          while (i < len && src[i] !== quote) i += 1;
          if (i >= len) {
            return fail(
              "unsafe_svg_stimulus",
              "unterminated_attribute",
              "Unterminated attribute value for '" + attrName + "'."
            );
          }
          var attrVal = src.slice(valStart, i);
          i += 1;

          var attrLower = attrName.toLowerCase();
          if (seenAttrs[attrLower]) {
            return fail(
              "unsafe_svg_stimulus",
              "duplicate_attribute",
              "Duplicate attribute '" + attrName + "' in <" + tagNameRaw + ">."
            );
          }
          seenAttrs[attrLower] = true;

          var attrCheck = validateAttribute(attrName, attrVal);
          if (!attrCheck.ok) return attrCheck;
        }

        if (selfClosing) {
          if (stack.length === 0) {
            rootClosed = true;
          }
        } else {
          stack.push(tagLower);
        }
      } else {
        // Text node
        var textStart = i;
        while (i < len && src[i] !== "<") i += 1;
        var textChunk = src.slice(textStart, i);
        if (textChunk.indexOf(">") !== -1) {
          return fail(
            "unsafe_svg_stimulus",
            "stray_angle_bracket",
            "Inline SVG text contains a raw '>' character."
          );
        }
        if (rootClosed && textChunk.trim()) {
          return fail(
            "unsafe_svg_stimulus",
            "content_outside_root",
            "Inline SVG must not contain text outside the <svg> root element."
          );
        }
      }
    }

    if (!rootSeen || !rootClosed || stack.length !== 0) {
      return fail(
        "unsafe_svg_stimulus",
        "unbalanced_svg_root",
        "Inline SVG must consist of a single complete, balanced <svg>...</svg> element."
      );
    }

    return { ok: true, svgMarkup: src };
  }

  function inspectRepresentationMedia(rep, path, errors, diagnostics) {
    if (!rep || typeof rep !== "object" || Array.isArray(rep)) return;
    var media = rep.media;
    if (!media || typeof media !== "object" || Array.isArray(media)) return;
    if (String(media.format || "").trim().toLowerCase() !== "svg") return;

    var check = validateSafeInlineSvgStimulus(media.markup);
    if (!check.ok) {
      var msg = path + ": " + check.message;
      errors.push(msg);
      diagnostics.push({
        level: "error",
        code: check.code,
        reason: check.reason,
        path: path,
        message: check.message
      });
    }
  }

  /**
   * Scan a learner page artefact across all supported authoring/publication
   * structures (Assessment Pack elicitations/items, Practice/Expository/Interactive
   * activities, materials, and assessment_items) for inline SVG stimulus markup.
   */
  function validatePageInlineSvgStimuli(sourcePage) {
    var errors = [];
    var diagnostics = [];
    if (!sourcePage || typeof sourcePage !== "object") {
      return { ok: true, errors: errors, diagnostics: diagnostics };
    }

    // 1. Canonical Assessment Pack elicitations & determinate items
    var ev = sourcePage.assessment_evidence;
    if (ev && typeof ev === "object" && Array.isArray(ev.elicitations)) {
      ev.elicitations.forEach(function (el, eIdx) {
        if (!el || typeof el !== "object") return;
        var elPath = "assessment_evidence.elicitations[" + eIdx + "]";
        inspectRepresentationMedia(el.representation, elPath + ".representation.media", errors, diagnostics);
        var items = el.delivery && Array.isArray(el.delivery.items) ? el.delivery.items : [];
        items.forEach(function (item, iIdx) {
          if (!item || typeof item !== "object") return;
          inspectRepresentationMedia(
            item.representation,
            elPath + ".delivery.items[" + iIdx + "].representation.media",
            errors,
            diagnostics
          );
        });
      });
    }

    // 2. Legacy Assessment Pack assessment_check.items
    if (
      sourcePage.assessment_check &&
      typeof sourcePage.assessment_check === "object" &&
      Array.isArray(sourcePage.assessment_check.items)
    ) {
      sourcePage.assessment_check.items.forEach(function (item, iIdx) {
        if (!item || typeof item !== "object") return;
        inspectRepresentationMedia(
          item.representation,
          "assessment_check.items[" + iIdx + "].representation.media",
          errors,
          diagnostics
        );
      });
    }

    // 3. Activities (Practice, Expository, Interactive, Legacy Assessment Pack)
    if (Array.isArray(sourcePage.activities)) {
      sourcePage.activities.forEach(function (act, aIdx) {
        if (!act || typeof act !== "object") return;
        var actPath = "activities[" + aIdx + "]";
        if (Array.isArray(act.assessment_items)) {
          act.assessment_items.forEach(function (item, iIdx) {
            if (!item || typeof item !== "object") return;
            inspectRepresentationMedia(
              item.representation,
              actPath + ".assessment_items[" + iIdx + "].representation.media",
              errors,
              diagnostics
            );
          });
        }
        if (Array.isArray(act.materials)) {
          act.materials.forEach(function (mat, mIdx) {
            if (!mat || typeof mat !== "object") return;
            var matPath = actPath + ".materials[" + mIdx + "]";
            inspectRepresentationMedia(mat.representation, matPath + ".representation.media", errors, diagnostics);
            if (mat.assessmentItem && typeof mat.assessmentItem === "object") {
              inspectRepresentationMedia(
                mat.assessmentItem.representation,
                matPath + ".assessmentItem.representation.media",
                errors,
                diagnostics
              );
            }
          });
        }
      });
    }

    return {
      ok: errors.length === 0,
      errors: errors,
      diagnostics: diagnostics
    };
  }

  return {
    ALLOWED_SVG_ELEMENTS: ALLOWED_SVG_ELEMENTS,
    ALLOWED_SVG_ATTRIBUTES: ALLOWED_SVG_ATTRIBUTES,
    validateSafeInlineSvgStimulus: validateSafeInlineSvgStimulus,
    validatePageInlineSvgStimuli: validatePageInlineSvgStimuli
  };
});
