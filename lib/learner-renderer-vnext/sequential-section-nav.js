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

function prepareJourneySectionMarkers(contentHtml) {
  var content = String(contentHtml || "");
  if (!content) return content;
  content = content.replace(/<div\b[^>]*\bid="journey-orient"[^>]*>/i, function (tag) {
    return ensureAttrOnOpenTag(tag, "data-journey-section", "true");
  });
  content = content.replace(
    /<section\b[^>]*data-region="activities"[^>]*>/i,
    function (tag) {
      var next = ensureAttrOnOpenTag(tag, "data-journey-section", "true");
      if (!/\bid\s*=/i.test(next)) {
        next = next.replace(/^<section\b/i, '<section id="journey-activities"');
      }
      return next;
    }
  );
  content = content.replace(
    /<section\b[^>]*data-region="assessment"[^>]*>/i,
    function (tag) {
      var next = ensureAttrOnOpenTag(tag, "data-journey-section", "true");
      if (!/\bid\s*=/i.test(next)) {
        next = next.replace(/^<section\b/i, '<section id="journey-assessment"');
      }
      return next;
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
      var next = ensureAttrOnOpenTag(tag, "data-journey-section", "true");
      if (!/\bid\s*=/i.test(next)) {
        next = next.replace(/^<aside\b/i, '<aside id="journey-study-tips"');
      }
      return next;
    }
  );
  return content;
}

function collectActivityNavItemsFromHtml(contentHtml) {
  var source = String(contentHtml || "");
  var items = [];
  var articleRe =
    /<article\b[^>]*\bid="(activity-[^"]+)"[^>]*>[\s\S]*?<h2[^>]*class="util-activity-title"[^>]*>([\s\S]*?)<\/h2>/gi;
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

function buildSectionNavItems(contentHtml, model) {
  var source = String(contentHtml || "");
  var items = [];
  if (/id="journey-orient"|data-region="orientation"/i.test(source)) {
    items.push({
      id: "journey-orient",
      label: "Orient",
      title: "Orient",
      accessibleLabel: "Orient"
    });
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
    items.push({
      id: "journey-assessment",
      label: "Self assessment",
      title: "Self assessment",
      accessibleLabel: "Self assessment"
    });
  }
  if (
    /id="journey-study-tips"|data-region="study-tips"/i.test(source) ||
    (model && String(model.studyTips || "").trim())
  ) {
    items.push({
      id: "journey-study-tips",
      label: "Study tips",
      title: "Study tips",
      accessibleLabel: "Study tips"
    });
  }
  return items;
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
    '<p class="util-journey-all-panel__title">All activities</p>',
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
    '<button type="button" class="util-journey-all-btn" aria-expanded="false" aria-controls="util-journey-all-panel" title="All activities" aria-label="All activities">' +
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

function injectNavIntoFragment(fragmentHtml, navHtml) {
  var source = String(fragmentHtml || "");
  var nav = String(navHtml || "");
  if (!source || !nav) return source;
  if (/util-journey-nav--sequential/i.test(source)) return source;
  var headerClose = source.match(/<\/header>/i);
  if (headerClose && typeof headerClose.index === "number") {
    var at = headerClose.index + headerClose[0].length;
    return source.slice(0, at) + nav + source.slice(at);
  }
  var openMatch = source.match(/^(\s*<(?:article|main)\b[^>]*>)/i);
  if (openMatch) {
    return openMatch[1] + nav + source.slice(openMatch[1].length);
  }
  return nav + source;
}

/**
 * Ensure mountable fragment includes section markers + sequential nav chrome when warranted.
 *
 * @param {string} fragmentHtml
 * @param {{ model?: object, sourcePage?: object }=} options
 * @returns {string}
 */
function enhanceFragmentWithSectionNavigation(fragmentHtml, options) {
  var opts = options && typeof options === "object" ? options : {};
  var prepared = prepareJourneySectionMarkers(fragmentHtml);
  if (/util-journey-nav--sequential/i.test(prepared)) {
    return prepared;
  }
  var model = opts.model || null;
  if (!model && opts.sourcePage && typeof require === "function") {
    try {
      var buildPageModel = require("./build-page-model").buildPageModel;
      var built = buildPageModel(opts.sourcePage);
      if (built && built.ok) model = built.model;
    } catch (_err) {}
  }
  var navItems = buildSectionNavItems(prepared, model);
  if (navItems.length < 2) return prepared;
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

  var panel = nav.querySelector("#util-journey-all-panel") || nav.querySelector(".util-journey-all-panel");
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

  function computeIndex() {
    var offset = stickyClearanceHeight() + 8;
    var idx = 0;
    for (var i = 0; i < sections.length; i += 1) {
      if (sections[i].getBoundingClientRect().top - offset <= 1) idx = i;
    }
    var maxScroll = Math.max(
      0,
      (document.documentElement.scrollHeight || 0) - (window.innerHeight || 0)
    );
    var scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    if (maxScroll > 0 && scrollTop >= maxScroll - 4) idx = sections.length - 1;
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
        stickyClearanceHeight() -
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

  if (allBtn && panel) {
    allBtn.addEventListener("click", onAllBtnClick);
    if (closeBtn) closeBtn.addEventListener("click", onCloseClick);
    panel.addEventListener("click", onPanelClick);
  }
  nav.addEventListener("click", onNavClick);
  document.addEventListener("keydown", onKeydown);
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", onResize);
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
    window.removeEventListener("resize", onResize);
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
  enhanceFragmentWithSectionNavigation: enhanceFragmentWithSectionNavigation,
  installSequentialSectionNav: installSequentialSectionNav,
  disposeSequentialSectionNav: disposeSequentialSectionNav
};
