"use strict";

/**
 * Sequential section/activity navigation for Interactive (and multi-section) learner pages.
 *
 * Standalone publishing still composes this chrome via app.js export helpers.
 * Sprint 95 unified shell: inject the same chrome into mountable fragments and
 * install/dispose a container-scoped runtime that does not steal journey hashes.
 */

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function stripHtmlToPlainText(html) {
  return String(html == null ? "" : html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function ensureAttrOnOpenTag(tag, attrName, attrValue) {
  var open = String(tag || "");
  if (!open) return open;
  var re = new RegExp("\\b" + attrName + "\\s*=", "i");
  if (re.test(open)) return open;
  return open.replace(/>$/, " " + attrName + '="' + attrValue + '">');
}

function descriptor(id, label) {
  var text = String(label || "").trim() || id;
  return {
    id: String(id || "").trim(),
    label: text,
    title: text,
    accessibleLabel: text
  };
}

function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Resolve a logical section id to the actual element id present in HTML.
 * Supports unified-shell namespacing (e.g. journey-orient → lj-c1--journey-orient).
 */
function resolveNavDestinationId(html, logicalId) {
  var id = String(logicalId || "").trim();
  if (!id) return id;
  var source = String(html || "");
  var exact = new RegExp(
    "(?:^|\\s)id\\s*=\\s*[\"']" + escapeRegExp(id) + "[\"']",
    "i"
  );
  if (exact.test(source)) return id;
  var namespaced = new RegExp(
    "(?:^|\\s)id\\s*=\\s*[\"']([^\"']*--" + escapeRegExp(id) + ")[\"']",
    "i"
  );
  var match = source.match(namespaced);
  if (match && match[1]) return match[1];
  return id;
}

function hasElementIdAttr(tag) {
  // Do not treat data-section-id / data-activity-id as an element id.
  return /(?:^|\s)id\s*=/i.test(String(tag || ""));
}

function ensureIdAndSectionMarker(tag, idValue) {
  var next = ensureAttrOnOpenTag(tag, "data-journey-section", "true");
  if (idValue && !hasElementIdAttr(next)) {
    next = next.replace(/^<(\w+)\b/i, '<$1 id="' + idValue + '"');
  }
  return next;
}

function prepareJourneySectionMarkers(contentHtml) {
  var content = String(contentHtml || "");
  if (!content) return content;
  content = content.replace(
    /<div\b[^>]*\bid="(?:[^"]*--)?journey-orient"[^>]*>/i,
    function (tag) {
      return ensureAttrOnOpenTag(tag, "data-journey-section", "true");
    }
  );
  content = content.replace(
    /<section\b[^>]*data-region="activities"[^>]*>/i,
    function (tag) {
      return ensureIdAndSectionMarker(tag, "journey-activities");
    }
  );
  content = content.replace(
    /<section\b[^>]*data-region="assessment"[^>]*>/i,
    function (tag) {
      // Pack pages use finer destinations; still ensure a stable wrapper id for legacy.
      return ensureIdAndSectionMarker(tag, "journey-assessment");
    }
  );
  content = content.replace(
    /<article\b[^>]*\bid="activity-[^"]+"[^>]*>/gi,
    function (tag) {
      return ensureAttrOnOpenTag(tag, "data-journey-section", "true");
    }
  );
  content = content.replace(
    /<aside\b[^>]*data-region="study-tips"[^>]*>/i,
    function (tag) {
      return ensureIdAndSectionMarker(tag, "journey-study-tips");
    }
  );

  // Expository / Situated authored sections.
  content = content.replace(
    /<section\b([^>]*\bdata-region-item\s*=\s*["']exposition-section["'][^>]*)>/gi,
    function (tag, attrs) {
      var sectionIdMatch = String(attrs || "").match(
        /\bdata-section-id\s*=\s*["']([^"']+)["']/i
      );
      var sectionId = sectionIdMatch ? sectionIdMatch[1] : "";
      var destId = sectionId ? "exposition-" + sectionId : "";
      return ensureIdAndSectionMarker(tag, destId);
    }
  );

  // Consolidated Situated Record only (not embedded).
  content = content.replace(
    /<section\b[^>]*data-region="situated-record"[^>]*>/i,
    function (tag) {
      return ensureIdAndSectionMarker(tag, "journey-situated-record");
    }
  );

  // Assessment Pack briefing: orientation preferred, else intro.
  var briefingAssigned = false;
  content = content.replace(
    /<section\b[^>]*data-region="assessment-orientation"[^>]*>/i,
    function (tag) {
      briefingAssigned = true;
      return ensureIdAndSectionMarker(tag, "journey-assessment-briefing");
    }
  );
  content = content.replace(
    /<section\b[^>]*data-region="assessment-intro"[^>]*>/i,
    function (tag) {
      if (briefingAssigned) return ensureAttrOnOpenTag(tag, "data-journey-section", "true");
      briefingAssigned = true;
      return ensureIdAndSectionMarker(tag, "journey-assessment-briefing");
    }
  );

  var elicitationCount = (
    content.match(/<article\b[^>]*\bdata-elicitation-id\s*=\s*["'][^"']+["']/gi) || []
  ).length;
  var singleElicitation = elicitationCount === 1;

  // Judgement: stimulus region when present (single constructed packs).
  var judgementAssigned = false;
  if (singleElicitation) {
    content = content.replace(
      /<section\b[^>]*data-region="assessment-stimulus"[^>]*>/i,
      function (tag) {
        if (judgementAssigned) return tag;
        judgementAssigned = true;
        return ensureIdAndSectionMarker(tag, "journey-assessment-judgement");
      }
    );
  }

  // Elicitation articles: multi-unit destinations, or single-unit Judgement fallback.
  content = content.replace(
    /<article\b([^>]*\bdata-elicitation-id\s*=\s*["']([^"']+)["'][^>]*)>/gi,
    function (tag, _attrs, elicitationId) {
      var id = String(elicitationId || "").trim();
      var destId = id ? "elicitation-" + id : "";
      if (singleElicitation) {
        if (!judgementAssigned) {
          judgementAssigned = true;
          // Prefer Judgement id even when render already stamped elicitation-*.
          var retargeted = String(tag || "").replace(/\s\bid\s*=\s*["'][^"']*["']/i, "");
          return ensureIdAndSectionMarker(
            retargeted,
            "journey-assessment-judgement"
          );
        }
        return ensureAttrOnOpenTag(tag, "data-journey-section", "true");
      }
      return ensureIdAndSectionMarker(tag, destId);
    }
  );

  content = content.replace(
    /<section\b[^>]*data-region="pack-forward"[^>]*>/i,
    function (tag) {
      return ensureIdAndSectionMarker(tag, "journey-assessment-pack-forward");
    }
  );

  return content;
}

function collectActivityNavItemsFromHtml(contentHtml) {
  var source = String(contentHtml || "");
  var items = [];
  var articleRe =
    /<article\b[^>]*\bid="((?:[^"]*--)?activity-[^"]+)"[^>]*>[\s\S]*?<h2[^>]*class="util-activity-title"[^>]*>([\s\S]*?)<\/h2>/gi;
  var match;
  while ((match = articleRe.exec(source)) !== null) {
    items.push({
      id: match[1],
      label: stripHtmlToPlainText(match[2]) || match[1],
      title: stripHtmlToPlainText(match[2]) || match[1]
    });
  }
  return items;
}

function collectActivityNavItemsFromModel(model) {
  var rows = model && Array.isArray(model.activities) ? model.activities : [];
  return rows.map(function (activity, index) {
    var activityId = String(activity && activity.id ? activity.id : "").trim();
    var fullTitle = String(activity && activity.title ? activity.title : "").trim();
    var label = fullTitle || "Activity " + String(index + 1);
    return {
      id: "activity-" + activityId,
      label: label,
      title: label,
      accessibleLabel: label
    };
  });
}

function pageKindOf(model, sourceHtml) {
  var kind = model && String(model.pageKind || "").trim();
  if (kind) return kind;
  var html = String(sourceHtml || "");
  if (
    /data-assessment-product\s*=\s*["']assessment_pack["']/i.test(html) ||
    /data-page-kind\s*=\s*["']assessment["']/i.test(html)
  ) {
    return "assessment";
  }
  if (/data-page-kind\s*=\s*["']situated_task["']/i.test(html)) return "situated_task";
  if (/data-page-kind\s*=\s*["']expository["']/i.test(html)) return "expository";
  if (/data-region-item\s*=\s*["']exposition-section["']/i.test(html)) return "expository";
  return "interactive";
}

function isAssessmentPackContext(model, sourceHtml) {
  if (model && model.assessmentPack) return true;
  return /data-assessment-product\s*=\s*["']assessment_pack["']/i.test(
    String(sourceHtml || "")
  );
}

function collectExpositionNavItemsFromModel(model) {
  var rows =
    model && Array.isArray(model.expositionSections) ? model.expositionSections : [];
  return rows
    .map(function (section, index) {
      var sectionId = String(section && section.id ? section.id : "").trim();
      if (!sectionId) return null;
      var label =
        String(section && section.title ? section.title : "").trim() ||
        "Section " + String(index + 1);
      return descriptor("exposition-" + sectionId, label);
    })
    .filter(Boolean);
}

function collectExpositionNavItemsFromHtml(contentHtml) {
  var source = String(contentHtml || "");
  var items = [];
  var re =
    /<section\b[^>]*data-region-item\s*=\s*["']exposition-section["'][^>]*data-section-id\s*=\s*["']([^"']+)["'][^>]*>[\s\S]*?<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
  var match;
  while ((match = re.exec(source)) !== null) {
    items.push(
      descriptor(
        "exposition-" + match[1],
        stripHtmlToPlainText(match[2]) || match[1]
      )
    );
  }
  if (items.length) return items;
  // Fallback: id already stamped (bare or namespaced), title from nearby heading may vary.
  re =
    /<section\b[^>]*\bid\s*=\s*["'](?:[^"']*--)?exposition-([^"']+)["'][^>]*>/gi;
  while ((match = re.exec(source)) !== null) {
    items.push(descriptor("exposition-" + match[1], match[1]));
  }
  return items;
}

function elicitationLabel(unit, index) {
  if (!unit || typeof unit !== "object") return "Task " + String(index + 1);
  var title = String(unit.promptTitle || "").trim();
  if (title) return title;
  var instructions = String(unit.instructions || "").trim();
  if (instructions) {
    var first = instructions.split(/\n/)[0].trim();
    if (first.length > 72) first = first.slice(0, 69) + "…";
    if (first) return first;
  }
  var id = String(unit.elicitationId || "").trim();
  return id || "Task " + String(index + 1);
}

function collectAssessmentPackNavItems(model, sourceHtml) {
  var source = String(sourceHtml || "");
  var pack = model && model.assessmentPack ? model.assessmentPack : null;
  var units = pack && Array.isArray(pack.units) ? pack.units : [];
  var items = [];

  if (units.length >= 2) {
    units.forEach(function (unit, index) {
      var id = String(unit && unit.elicitationId ? unit.elicitationId : "").trim();
      if (!id) return;
      items.push(descriptor("elicitation-" + id, elicitationLabel(unit, index)));
    });
    return items;
  }

  if (units.length === 1) {
    var unit = units[0];
    var isConstructed = unit && unit.kind === "constructed";
    var hasBriefing =
      /id="journey-assessment-briefing"|data-region="assessment-orientation"|data-region="assessment-intro"/i.test(
        source
      );
    var hasJudgement =
      /id="journey-assessment-judgement"|data-region="assessment-stimulus"|data-elicitation-id=/i.test(
        source
      );
    var hasForward =
      /id="journey-assessment-pack-forward"|data-region="pack-forward"/i.test(source) ||
      (pack && String(pack.packForward || "").trim());

    if (isConstructed) {
      if (hasBriefing) items.push(descriptor("journey-assessment-briefing", "Briefing"));
      if (hasJudgement) items.push(descriptor("journey-assessment-judgement", "Judgement"));
      if (hasForward) {
        items.push(descriptor("journey-assessment-pack-forward", "Take forward"));
      }
      return items;
    }

    // Single determinate unit: elicitation destination; add Briefing when present.
    if (hasBriefing) items.push(descriptor("journey-assessment-briefing", "Briefing"));
    var eid = String(unit.elicitationId || "").trim();
    if (eid) items.push(descriptor("elicitation-" + eid, elicitationLabel(unit, 0)));
    else if (hasJudgement) {
      items.push(descriptor("journey-assessment-judgement", elicitationLabel(unit, 0)));
    }
    if (hasForward) items.push(descriptor("journey-assessment-pack-forward", "Take forward"));
    return items;
  }

  // HTML fallback when model pack is unavailable (extracted package fragments).
  var elicitationRe =
    /<article\b[^>]*data-elicitation-id\s*=\s*["']([^"']+)["'][^>]*>[\s\S]*?(?:<h3\b[^>]*>([\s\S]*?)<\/h3>)?/gi;
  var found = [];
  var match;
  while ((match = elicitationRe.exec(source)) !== null) {
    found.push({
      id: match[1],
      label: stripHtmlToPlainText(match[2] || "") || match[1]
    });
  }
  if (found.length >= 2) {
    return found.map(function (row) {
      return descriptor("elicitation-" + row.id, row.label);
    });
  }
  if (found.length === 1) {
    if (
      /id="journey-assessment-briefing"|data-region="assessment-orientation"|data-region="assessment-intro"/i.test(
        source
      )
    ) {
      items.push(descriptor("journey-assessment-briefing", "Briefing"));
    }
    if (
      /id="journey-assessment-judgement"|data-region="assessment-stimulus"/i.test(source) ||
      found[0]
    ) {
      items.push(descriptor("journey-assessment-judgement", "Judgement"));
    }
    if (/id="journey-assessment-pack-forward"|data-region="pack-forward"/i.test(source)) {
      items.push(descriptor("journey-assessment-pack-forward", "Take forward"));
    }
  }
  return items;
}

function collectInteractiveNavItems(contentHtml, model) {
  var source = String(contentHtml || "");
  var items = [];
  if (
    /id="(?:[^"]*--)?journey-orient"|data-region="orientation"/i.test(source)
  ) {
    items.push(descriptor("journey-orient", "Orient"));
  }
  var fromModel = collectActivityNavItemsFromModel(model);
  if (fromModel.length) {
    fromModel.forEach(function (row) {
      items.push(row);
    });
  } else {
    collectActivityNavItemsFromHtml(source).forEach(function (row) {
      items.push(row);
    });
  }
  if (
    /id="journey-assessment"|data-region="assessment"/i.test(source) ||
    (model &&
      model.assessment &&
      Array.isArray(model.assessment.items) &&
      model.assessment.items.length)
  ) {
    // Interactive self-check region only — not Assessment Pack pages.
    if (!isAssessmentPackContext(model, source)) {
      items.push(descriptor("journey-assessment", "Self assessment"));
    }
  }
  if (
    /id="(?:[^"]*--)?journey-study-tips"|data-region="study-tips"/i.test(
      source
    ) ||
    (model && String(model.studyTips || "").trim())
  ) {
    items.push(descriptor("journey-study-tips", "Study tips"));
  }
  return items;
}

/**
 * Resource-neutral section descriptors for sequential navigation.
 * Prefer the canonical page model; fall back to stamped HTML landmarks.
 *
 * @param {string} contentHtml
 * @param {object|null} model
 * @returns {Array<{id:string,label:string,title:string,accessibleLabel:string}>}
 */
function buildSectionNavItems(contentHtml, model) {
  var source = String(contentHtml || "");
  var kind = pageKindOf(model, source);

  if (kind === "assessment" || isAssessmentPackContext(model, source)) {
    return collectAssessmentPackNavItems(model, source);
  }

  if (kind === "expository" || kind === "situated_task") {
    var expositionFromModel = collectExpositionNavItemsFromModel(model);
    var items =
      expositionFromModel.length > 0
        ? expositionFromModel
        : collectExpositionNavItemsFromHtml(source);
    // Consolidated Record only (embedded uses data-region="situated-record-embedded").
    if (
      kind === "situated_task" &&
      /<section\b[^>]*data-region="situated-record"[^>]*>/i.test(source)
    ) {
      items.push(descriptor("journey-situated-record", "Record"));
    }
    return items;
  }

  return collectInteractiveNavItems(source, model);
}

function renderAdjacentLinkHtml(item, direction) {
  if (!item || !item.id) return "";
  var title = String(item.label || item.title || "").trim();
  if (!title) return "";
  var isPrev = direction === "prev";
  var prefix = isPrev ? "Previous section: " : "Next section: ";
  var chevron = isPrev ? "‹" : "›";
  var chevronHtml =
    '<span class="util-journey-adjacent__chevron" aria-hidden="true">' + chevron + "</span>";
  var titleHtml =
    '<span class="util-journey-adjacent__title">' + escapeHtml(title) + "</span>";
  return (
    '<a class="util-journey-adjacent util-journey-adjacent--' +
    (isPrev ? "prev" : "next") +
    '" href="#' +
    escapeAttr(item.id) +
    '" aria-label="' +
    escapeAttr(prefix + title) +
    '">' +
    (isPrev ? chevronHtml + titleHtml : titleHtml + chevronHtml) +
    "</a>"
  );
}

function renderAllActivitiesPanelHtml(navItems, currentIndex) {
  var rows = Array.isArray(navItems) ? navItems : [];
  var parts = [
    '<div id="util-journey-all-panel" class="util-journey-all-panel" hidden>',
    '<div class="util-journey-all-panel__header">',
    '<p class="util-journey-all-panel__title">All sections</p>',
    '<button type="button" class="util-journey-all-close">Close</button>',
    "</div>",
    '<ul class="util-journey-all-list">'
  ];
  rows.forEach(function (item, index) {
    var title = String((item && (item.label || item.title)) || "").trim() || "Section " + (index + 1);
    var id = String((item && item.id) || "").trim();
    if (!id) return;
    var isCurrent = index === currentIndex;
    parts.push("<li>");
    parts.push(
      '<a class="util-journey-all-link" href="#' +
        escapeAttr(id) +
        '"' +
        (isCurrent ? ' aria-current="location"' : "") +
        ">" +
        escapeHtml(title) +
        "</a>"
    );
    parts.push("</li>");
  });
  parts.push("</ul></div>");
  return parts.join("");
}

function renderSequentialSectionNavHtml(navItems, renderOpts) {
  var rows = Array.isArray(navItems) ? navItems : [];
  if (rows.length < 2) return "";
  var opts = renderOpts && typeof renderOpts === "object" ? renderOpts : {};
  var currentIndex =
    typeof opts.currentIndex === "number" &&
    opts.currentIndex >= 0 &&
    opts.currentIndex < rows.length
      ? opts.currentIndex
      : 0;
  var total = rows.length;
  var current = rows[currentIndex] || {};
  var currentTitle =
    String(current.label || current.title || "").trim() || "Section " + (currentIndex + 1);
  var prevItem = currentIndex > 0 ? rows[currentIndex - 1] : null;
  var nextItem = currentIndex < total - 1 ? rows[currentIndex + 1] : null;
  var positionVisible = String(currentIndex + 1) + " of " + String(total);
  var positionAria = "Section " + String(currentIndex + 1) + " of " + String(total);
  var listIcon =
    '<svg class="util-journey-all-btn__icon" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">' +
    '<path fill="currentColor" d="M3 4.5h12v1.5H3V4.5zm0 3.75h12v1.5H3V8.25zm0 3.75h12V13.5H3v-1.5z"/>' +
    "</svg>";
  return (
    '<nav class="util-journey-nav util-journey-nav--sequential" aria-label="Learning sections" data-journey-total="' +
    escapeAttr(String(total)) +
    '">' +
    '<div class="util-journey-sequential">' +
    '<div class="util-journey-sequential__row">' +
    '<button type="button" class="util-journey-all-btn" aria-expanded="false" aria-controls="util-journey-all-panel" title="All sections" aria-label="All sections">' +
    listIcon +
    "</button>" +
    (prevItem
      ? renderAdjacentLinkHtml(prevItem, "prev")
      : '<span class="util-journey-adjacent util-journey-adjacent--placeholder util-journey-adjacent--prev" aria-hidden="true"></span>') +
    '<div class="util-journey-current-wrap">' +
    '<span class="util-journey-current" data-journey-current-title="true">' +
    escapeHtml(currentTitle) +
    "</span>" +
    '<p class="util-journey-position" aria-label="' +
    escapeAttr(positionAria) +
    '">' +
    '<span class="util-journey-position__visible" aria-hidden="true">' +
    escapeHtml(positionVisible) +
    "</span></p>" +
    "</div>" +
    (nextItem
      ? renderAdjacentLinkHtml(nextItem, "next")
      : '<span class="util-journey-adjacent util-journey-adjacent--placeholder util-journey-adjacent--next" aria-hidden="true"></span>') +
    "</div>" +
    renderAllActivitiesPanelHtml(rows, currentIndex) +
    "</div>" +
    "</nav>"
  );
}

function extractSequentialSectionNav(html) {
  var source = String(html || "");
  var match = source.match(
    /<nav\b[^>]*\butil-journey-nav--sequential\b[^>]*>[\s\S]*?<\/nav>/i
  );
  if (!match) {
    return { html: source, navHtml: "" };
  }
  return {
    html: source.slice(0, match.index) + source.slice(match.index + match[0].length),
    navHtml: match[0]
  };
}

/**
 * Insertion index for resource section nav.
 * Prefer the page title header — never an activity header (standalone exports strip
 * util-page-header, so the first </header> is often activity-A1 and would bury the nav).
 */
function findSectionNavInsertionIndex(source) {
  var html = String(source || "");
  var pageHeader = html.match(
    /<header\b[^>]*(?:\butil-page-header\b|\butil-learning-header\b)[^>]*>[\s\S]*?<\/header>/i
  );
  if (pageHeader && typeof pageHeader.index === "number") {
    return pageHeader.index + pageHeader[0].length;
  }
  var draft = html.match(
    /<div\b[^>]*\bdata-learner-draft-controls\b[^>]*>[\s\S]*?<\/div>/i
  );
  if (draft && typeof draft.index === "number") {
    return draft.index + draft[0].length;
  }
  var openMatch = html.match(/^(\s*<(?:article|main)\b[^>]*>)/i);
  if (openMatch) return openMatch[1].length;
  return 0;
}

function isSequentialNavWellPlaced(html) {
  var source = String(html || "");
  var navAt = source.search(/<nav\b[^>]*\butil-journey-nav--sequential\b/i);
  if (navAt < 0) return false;
  var activityAt = source.search(/<article\b[^>]*\bid=["']activity-/i);
  if (activityAt >= 0 && navAt > activityAt) return false;
  var activitiesRegionAt = source.search(
    /<section\b[^>]*(?:\bid=["']journey-activities["']|data-region=["']activities["'])/i
  );
  if (activitiesRegionAt >= 0 && navAt > activitiesRegionAt) return false;
  var expositionAt = source.search(
    /data-region-item\s*=\s*["']exposition-section["']/i
  );
  if (expositionAt >= 0 && navAt > expositionAt) return false;
  var assessmentBodyAt = source.search(
    /data-region\s*=\s*["']assessment["']/i
  );
  if (assessmentBodyAt >= 0 && navAt > assessmentBodyAt) return false;
  return true;
}

function injectNavIntoFragment(fragmentHtml, navHtml) {
  var source = String(fragmentHtml || "");
  var nav = String(navHtml || "");
  if (!source || !nav) return source;
  if (/util-journey-nav--sequential/i.test(source)) {
    if (isSequentialNavWellPlaced(source)) return source;
    var relocated = extractSequentialSectionNav(source);
    source = relocated.html;
  }
  var at = findSectionNavInsertionIndex(source);
  if (at < 0) at = 0;
  if (at > source.length) at = source.length;
  return source.slice(0, at) + nav + source.slice(at);
}

/**
 * Ensure mountable fragment includes section markers + sequential nav chrome when warranted.
 * Always reseats nav at the resource top (after page title / draft controls) so package
 * fragments that lost util-page-header do not bury nav inside the first activity header.
 *
 * @param {string} fragmentHtml
 * @param {{ model?: object, sourcePage?: object }=} options
 * @returns {string}
 */
function enhanceFragmentWithSectionNavigation(fragmentHtml, options) {
  var opts = options && typeof options === "object" ? options : {};
  var extracted = extractSequentialSectionNav(fragmentHtml);
  var prepared = prepareJourneySectionMarkers(extracted.html);
  var existingNav = extracted.navHtml;
  var model = opts.model || null;
  if (!model && opts.sourcePage && typeof require === "function") {
    try {
      var buildPageModel = require("./build-page-model").buildPageModel;
      var built = buildPageModel(opts.sourcePage);
      if (built && built.ok) model = built.model;
    } catch (_err) {}
  }
  var navItems = buildSectionNavItems(prepared, model).map(function (item) {
    if (!item || !item.id) return item;
    var resolved = resolveNavDestinationId(prepared, item.id);
    if (resolved === item.id) return item;
    return {
      id: resolved,
      label: item.label,
      title: item.title,
      accessibleLabel: item.accessibleLabel
    };
  });
  if (navItems.length < 2) {
    // Drop any leftover chrome when the fragment is not multi-section.
    return prepared;
  }
  // Always rebuild chrome from descriptors so labels/destinations stay in sync
  // (do not reuse stale "All activities" markup from older packages).
  void existingNav;
  return injectNavIntoFragment(
    prepared,
    renderSequentialSectionNavHtml(navItems, { currentIndex: 0 })
  );
}

function findScrollParent(node) {
  var el = node;
  while (el && el !== document.body && el !== document.documentElement) {
    if (el.nodeType === 1) {
      var style = window.getComputedStyle(el);
      var overflowY = style && style.overflowY;
      if (
        (overflowY === "auto" || overflowY === "scroll") &&
        el.scrollHeight > el.clientHeight + 1
      ) {
        return el;
      }
    }
    el = el.parentElement;
  }
  return null;
}

/**
 * Container-scoped sequential section navigation.
 * Uses in-resource scrolling and preserves the host journey hash when inside lj-shell.
 *
 * @param {Element} root
 * @returns {{ ok: boolean, dispose: Function }}
 */
function installSequentialSectionNav(root) {
  if (!root || !root.querySelector) {
    return { ok: false, dispose: function () {} };
  }
  if (root.__prismSequentialSectionNav) return root.__prismSequentialSectionNav;

  var nav = root.querySelector(".util-journey-nav--sequential");
  if (!nav) return { ok: false, dispose: function () {} };

  // Prefer the class hook: unified-shell ID namespacing rewrites util-journey-all-panel.
  var panel =
    nav.querySelector(".util-journey-all-panel") ||
    nav.querySelector('[id$="util-journey-all-panel"]') ||
    nav.querySelector("#util-journey-all-panel");
  var allBtn = nav.querySelector(".util-journey-all-btn");
  var closeBtn = panel ? panel.querySelector(".util-journey-all-close") : null;
  var titlesHost = nav.querySelector(".util-journey-sequential__row");
  var positionEl = nav.querySelector(".util-journey-position");
  var positionVisible = nav.querySelector(".util-journey-position__visible");
  var currentTitleEl = nav.querySelector("[data-journey-current-title]");
  var panelLinks = panel
    ? Array.prototype.slice.call(panel.querySelectorAll(".util-journey-all-link"))
    : [];
  var sectionMeta = [];
  var sections = [];
  function findById(id) {
    if (!id) return null;
    if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
      return root.querySelector("#" + CSS.escape(id));
    }
    return root.querySelector('[id="' + String(id).replace(/"/g, '\\"') + '"]');
  }

  panelLinks.forEach(function (link) {
    var href = String(link.getAttribute("href") || "");
    var id = href.charAt(0) === "#" ? href.slice(1) : "";
    if (!id) return;
    var el = findById(id);
    if (!el) return;
    sectionMeta.push({
      id: id,
      title: String(link.textContent || "").replace(/\s+/g, " ").trim() || id
    });
    sections.push(el);
  });
  if (sections.length < 2) {
    return { ok: false, dispose: function () {} };
  }

  nav.setAttribute("data-journey-total", String(sectionMeta.length));
  var ticking = false;
  var currentIndex = -1;
  var lastStickyClearance = 0;
  var disposed = false;
  var preserveJourneyHash = !!(
    root.closest &&
    (root.closest('[data-lj-shell="unified"]') || root.closest("#lj-shell-main"))
  );

  function readCssPxVar(name) {
    try {
      var raw = window.getComputedStyle(document.documentElement).getPropertyValue(name);
      var n = parseFloat(String(raw || "").trim());
      return Number.isFinite(n) ? n : 0;
    } catch (_err) {
      return 0;
    }
  }

  function shellToolbarHeight() {
    if (!preserveJourneyHash) return 0;
    var fromVar = readCssPxVar("--lj-shell-toolbar-height");
    if (fromVar > 0) return Math.round(fromVar);
    var toolbar = document.querySelector(".lj-shell__toolbar");
    if (!toolbar) return 0;
    return Math.round(toolbar.getBoundingClientRect().height) || 0;
  }

  function stickyClearanceHeight() {
    var sequential = nav.querySelector(".util-journey-sequential");
    var h = (sequential && sequential.getBoundingClientRect().height) || 0;
    if (!h) {
      h = nav.offsetHeight || 0;
      if (panel && !panel.hidden) {
        h = Math.max(0, h - (panel.offsetHeight || 0));
      }
    } else if (panel && !panel.hidden) {
      h = Math.max(0, h - (panel.offsetHeight || 0));
    }
    var cs = window.getComputedStyle(nav);
    h += (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
    return Math.max(Math.round(h), 72);
  }

  /** Section-nav height only — used for --learner-sticky-nav-height. */
  function syncStickyOffset() {
    var h = stickyClearanceHeight();
    var prev = lastStickyClearance || 0;
    document.documentElement.style.setProperty("--learner-sticky-nav-height", h + "px");
    if (prev > 0 && Math.abs(h - prev) > 1) {
      try {
        window.scrollBy(0, -(h - prev));
      } catch (_e) {}
    }
    lastStickyClearance = h;
  }

  /** Full sticky stack for scroll/index math inside the unified shell. */
  function totalStickyClearanceHeight() {
    return stickyClearanceHeight() + shellToolbarHeight();
  }

  function adjacentHtml(item, direction) {
    if (!item || !item.id) {
      return (
        '<span class="util-journey-adjacent util-journey-adjacent--placeholder util-journey-adjacent--' +
        direction +
        '" aria-hidden="true"></span>'
      );
    }
    return renderAdjacentLinkHtml(item, direction);
  }

  function focusedAdjacentDirection() {
    var ae = document.activeElement;
    if (!ae || !titlesHost || !titlesHost.contains(ae)) return null;
    if (ae.classList && ae.classList.contains("util-journey-adjacent--prev")) return "prev";
    if (ae.classList && ae.classList.contains("util-journey-adjacent--next")) return "next";
    return null;
  }

  function renderAdjacentSlot(item, direction) {
    if (!titlesHost) return;
    var existing = titlesHost.querySelector(".util-journey-adjacent--" + direction);
    var html = adjacentHtml(item, direction);
    if (!existing) {
      var currentWrap = titlesHost.querySelector(".util-journey-current-wrap");
      if (direction === "prev" && currentWrap) {
        currentWrap.insertAdjacentHTML("beforebegin", html);
      } else {
        titlesHost.insertAdjacentHTML("beforeend", html);
      }
      return;
    }
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    var nextNode = tmp.firstChild;
    if (!nextNode) return;
    var keepFocus = document.activeElement === existing;
    existing.replaceWith(nextNode);
    if (keepFocus && nextNode.focus && nextNode.tagName === "A") {
      try {
        nextNode.focus({ preventScroll: true });
      } catch (_e) {
        nextNode.focus();
      }
    }
  }

  function setPanelOpen(open) {
    if (!panel || !allBtn) return;
    if (open) {
      panel.hidden = false;
      allBtn.setAttribute("aria-expanded", "true");
      var cur = panel.querySelector('[aria-current="location"]');
      if (cur && panel.scrollHeight > panel.clientHeight) {
        try {
          var top = cur.offsetTop - panel.clientHeight / 2 + cur.offsetHeight / 2;
          panel.scrollTop = Math.max(0, top);
        } catch (_e) {}
      }
    } else {
      panel.hidden = true;
      allBtn.setAttribute("aria-expanded", "false");
    }
    syncStickyOffset();
  }

  function updateNav(index) {
    if (index === currentIndex) {
      syncStickyOffset();
      return;
    }
    currentIndex = index;
    var total = sectionMeta.length;
    var cur = sectionMeta[index] || { title: "Section " + (index + 1) };
    var prev = index > 0 ? sectionMeta[index - 1] : null;
    var next = index < total - 1 ? sectionMeta[index + 1] : null;
    var focusDir = focusedAdjacentDirection();
    if (currentTitleEl) currentTitleEl.textContent = cur.title;
    if (positionVisible) positionVisible.textContent = String(index + 1) + " of " + String(total);
    if (positionEl) {
      positionEl.setAttribute(
        "aria-label",
        "Section " + String(index + 1) + " of " + String(total)
      );
    }
    renderAdjacentSlot(prev, "prev");
    renderAdjacentSlot(next, "next");
    if (!currentTitleEl) currentTitleEl = nav.querySelector("[data-journey-current-title]");
    if (!positionEl) positionEl = nav.querySelector(".util-journey-position");
    if (!positionVisible) positionVisible = nav.querySelector(".util-journey-position__visible");
    panelLinks.forEach(function (link, i) {
      if (i === index) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    syncStickyOffset();
    if (focusDir) {
      var restore =
        titlesHost && titlesHost.querySelector("a.util-journey-adjacent--" + focusDir);
      if (restore && restore.focus) {
        try {
          restore.focus({ preventScroll: true });
        } catch (_e) {
          restore.focus();
        }
      }
    }
  }

  var scrollRoot = sections[0] ? findScrollParent(sections[0]) : null;

  function computeIndex() {
    var offset = totalStickyClearanceHeight() + 8;
    var idx = 0;
    for (var i = 0; i < sections.length; i += 1) {
      if (sections[i].getBoundingClientRect().top - offset <= 1) idx = i;
    }
    if (scrollRoot) {
      var maxNested = Math.max(0, scrollRoot.scrollHeight - scrollRoot.clientHeight);
      if (maxNested > 0 && scrollRoot.scrollTop >= maxNested - 4) {
        idx = sections.length - 1;
      }
    } else {
      var maxScroll = Math.max(
        0,
        (document.documentElement.scrollHeight || 0) - (window.innerHeight || 0)
      );
      var scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      if (maxScroll > 0 && scrollTop >= maxScroll - 4) idx = sections.length - 1;
    }
    return idx;
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      if (!disposed) updateNav(computeIndex());
    });
  }

  function closePanelToButton() {
    setPanelOpen(false);
    if (allBtn) allBtn.focus();
  }

  function scrollToSection(id) {
    var target = findById(id);
    if (!target) return;
    var scrollParent = findScrollParent(target);
    if (scrollParent) {
      var parentRect = scrollParent.getBoundingClientRect();
      var targetRect = target.getBoundingClientRect();
      var top =
        scrollParent.scrollTop +
        (targetRect.top - parentRect.top) -
        totalStickyClearanceHeight() -
        8;
      scrollParent.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    } else if (typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    var idx = -1;
    for (var i = 0; i < sectionMeta.length; i += 1) {
      if (sectionMeta[i].id === id) {
        idx = i;
        break;
      }
    }
    if (idx >= 0) updateNav(idx);
  }

  function onNavClick(event) {
    var link =
      event.target && event.target.closest
        ? event.target.closest(
            "a.util-journey-adjacent, a.util-journey-all-link"
          )
        : null;
    if (!link || !nav.contains(link)) return;
    var href = String(link.getAttribute("href") || "");
    if (href.charAt(0) !== "#") return;
    var id = href.slice(1);
    if (!id) return;
    event.preventDefault();
    if (panel && !panel.hidden && link.classList.contains("util-journey-all-link")) {
      setPanelOpen(false);
    }
    scrollToSection(decodeURIComponent(id));
    if (preserveJourneyHash) {
      // Keep the unified-shell resource hash intact.
      return;
    }
  }

  function onKeydown(event) {
    if (event.key === "Escape" && panel && !panel.hidden) {
      closePanelToButton();
    }
  }

  function onAllBtnClick() {
    setPanelOpen(panel.hidden);
  }

  function onCloseClick() {
    closePanelToButton();
  }

  function onPanelClick(ev) {
    var t = ev.target;
    if (t && t.closest && t.closest(".util-journey-all-link")) {
      setPanelOpen(false);
    }
  }

  function onResize() {
    syncStickyOffset();
    requestUpdate();
  }

  function onShellLayout() {
    syncStickyOffset();
    requestUpdate();
  }

  if (allBtn && panel) {
    allBtn.addEventListener("click", onAllBtnClick);
    if (closeBtn) closeBtn.addEventListener("click", onCloseClick);
    panel.addEventListener("click", onPanelClick);
  }
  nav.addEventListener("click", onNavClick);
  document.addEventListener("keydown", onKeydown);
  window.addEventListener("scroll", requestUpdate, { passive: true });
  if (scrollRoot && scrollRoot !== window && scrollRoot.addEventListener) {
    scrollRoot.addEventListener("scroll", requestUpdate, { passive: true });
  }
  window.addEventListener("resize", onResize);
  if (preserveJourneyHash) {
    window.addEventListener("prism:lj-shell-layout", onShellLayout);
  }
  syncStickyOffset();
  updateNav(computeIndex());

  function dispose() {
    if (disposed) return;
    disposed = true;
    if (allBtn) allBtn.removeEventListener("click", onAllBtnClick);
    if (closeBtn) closeBtn.removeEventListener("click", onCloseClick);
    if (panel) panel.removeEventListener("click", onPanelClick);
    nav.removeEventListener("click", onNavClick);
    document.removeEventListener("keydown", onKeydown);
    window.removeEventListener("scroll", requestUpdate);
    if (scrollRoot && scrollRoot !== window && scrollRoot.removeEventListener) {
      scrollRoot.removeEventListener("scroll", requestUpdate);
    }
    window.removeEventListener("resize", onResize);
    if (preserveJourneyHash) {
      window.removeEventListener("prism:lj-shell-layout", onShellLayout);
    }
    try {
      delete root.__prismSequentialSectionNav;
    } catch (_err) {
      root.__prismSequentialSectionNav = null;
    }
  }

  var handle = { ok: true, dispose: dispose };
  root.__prismSequentialSectionNav = handle;
  return handle;
}

function disposeSequentialSectionNav(root) {
  if (!root) return { ok: false };
  if (root.__prismSequentialSectionNav && typeof root.__prismSequentialSectionNav.dispose === "function") {
    root.__prismSequentialSectionNav.dispose();
    return { ok: true };
  }
  return { ok: false };
}

module.exports = {
  prepareJourneySectionMarkers: prepareJourneySectionMarkers,
  buildSectionNavItems: buildSectionNavItems,
  renderSequentialSectionNavHtml: renderSequentialSectionNavHtml,
  extractSequentialSectionNav: extractSequentialSectionNav,
  findSectionNavInsertionIndex: findSectionNavInsertionIndex,
  isSequentialNavWellPlaced: isSequentialNavWellPlaced,
  injectNavIntoFragment: injectNavIntoFragment,
  enhanceFragmentWithSectionNavigation: enhanceFragmentWithSectionNavigation,
  installSequentialSectionNav: installSequentialSectionNav,
  disposeSequentialSectionNav: disposeSequentialSectionNav
};
