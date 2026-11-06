"use strict";

/**
 * Progressive enhancement for guided-review checklists.
 * One criterion at a time with Previous/Next; no auto-advance.
 * Focus stays on the activated nav button; status announced politely.
 *
 * Sprint 95 M1: container-scoped install/dispose.
 */

function installGuidedReviewRuntime(root) {
  if (!root) return { ok: false, dispose: function () {} };
  if (root.__prismGuidedReviewRuntime) return root.__prismGuidedReviewRuntime;

  function qa(scope, sel) {
    return Array.prototype.slice.call(scope.querySelectorAll(sel));
  }
  function q(scope, sel) {
    return scope.querySelector(sel);
  }
  function setPanelState(panel, active) {
    if (!panel) return;
    if (active) {
      panel.hidden = false;
      panel.removeAttribute("inert");
      panel.setAttribute("data-active", "true");
    } else {
      panel.hidden = true;
      panel.setAttribute("inert", "");
      panel.removeAttribute("data-active");
    }
  }
  function sync(reviewRoot, index, announce) {
    var panels = qa(reviewRoot, "[data-guided-review-index]");
    var total = panels.length;
    if (!total) return;
    var safe = Math.max(0, Math.min(index, total - 1));
    reviewRoot.setAttribute("data-guided-review-active", String(safe));
    panels.forEach(function (panel) {
      var i = Number(panel.getAttribute("data-guided-review-index") || 0);
      setPanelState(panel, i === safe);
    });
    var nav = findNav(reviewRoot);
    var prev = nav ? q(nav, "[data-guided-review-prev]") : q(reviewRoot, "[data-guided-review-prev]");
    var next = nav ? q(nav, "[data-guided-review-next]") : q(reviewRoot, "[data-guided-review-next]");
    if (prev) prev.disabled = safe === 0;
    if (next) next.disabled = safe >= total - 1;
    var panel = q(reviewRoot, '[data-guided-review-index="' + safe + '"]');
    var progress = panel ? q(panel, "[data-guided-review-progress]") : null;
    var status = q(reviewRoot, "[data-guided-review-status]");
    if (announce && status && progress) {
      status.textContent = progress.textContent || "Criterion " + (safe + 1) + " of " + total;
    }
    if (reviewRoot.getAttribute("data-guided-review-presentation") === "sidebar") {
      panels.forEach(function (item) {
        var active = item.getAttribute("data-active") === "true";
        qa(item, "details.util-guided-review__guidance").forEach(function (details) {
          details.open = active;
        });
      });
      writeSidebarProgress(reviewRoot, safe, total);
    }
  }
  function findNav(reviewRoot) {
    var nav = q(reviewRoot, "[data-guided-review-nav]");
    if (nav) return nav;
    var section = reviewRoot.closest ? reviewRoot.closest("[data-check-sidebar]") : null;
    return section ? q(section, "[data-guided-review-nav]") : null;
  }
  function writeSidebarProgress(reviewRoot, index, total) {
    var section = reviewRoot.closest ? reviewRoot.closest("[data-check-sidebar]") : null;
    if (!section) return;
    var host = q(section, "[data-check-sidebar-progress]");
    if (host) host.textContent = String(index + 1) + " of " + String(total);
  }
  function reviewForControl(control) {
    var reviewRoot =
      control && control.closest ? control.closest('[data-guided-review="true"]') : null;
    if (reviewRoot) return reviewRoot;
    var section = control && control.closest ? control.closest("[data-check-sidebar]") : null;
    return section ? q(section, '[data-guided-review="true"]') : null;
  }
  function dockNav(section) {
    var review = q(section, '[data-guided-review="true"]');
    var nav = (review && q(review, "[data-guided-review-nav]")) || q(section, "[data-guided-review-nav]");
    if (!nav) return;
    if (!nav.__prismNavHome) nav.__prismNavHome = nav.parentNode;
    nav.classList.add("util-check-sidebar__footer");
    section.appendChild(nav);
  }
  function undockNav(section) {
    var nav = q(section, "[data-guided-review-nav]");
    if (!nav || !nav.__prismNavHome) return;
    nav.classList.remove("util-check-sidebar__footer");
    nav.__prismNavHome.appendChild(nav);
  }
  function exitSidebarReview(reviewRoot) {
    if (!reviewRoot) return;
    reviewRoot.setAttribute("data-guided-review-presentation", "listed");
    qa(reviewRoot, "[data-guided-review-index]").forEach(function (panel) {
      panel.hidden = false;
      panel.removeAttribute("inert");
      panel.removeAttribute("data-active");
      qa(panel, "details.util-guided-review__guidance").forEach(function (details) {
        details.open = false;
      });
    });
    var nav = q(reviewRoot, "[data-guided-review-nav]");
    if (nav) nav.hidden = true;
    reviewRoot.removeAttribute("data-guided-review-enhanced");
  }
  function enterSidebarReview(reviewRoot) {
    if (!reviewRoot) return;
    reviewRoot.setAttribute("data-guided-review-presentation", "sidebar");
    var panels = qa(reviewRoot, "[data-guided-review-index]");
    var nav = q(reviewRoot, "[data-guided-review-nav]");
    if (panels.length < 2) {
      if (nav) nav.hidden = true;
      panels.forEach(function (panel) {
        panel.hidden = false;
        panel.removeAttribute("inert");
        qa(panel, "details.util-guided-review__guidance").forEach(function (details) {
          details.open = true;
        });
      });
      writeSidebarProgress(reviewRoot, 0, panels.length || 1);
      return;
    }
    if (nav) nav.hidden = false;
    reviewRoot.setAttribute("data-guided-review-enhanced", "true");
    sync(reviewRoot, Number(reviewRoot.getAttribute("data-guided-review-active") || 0), false);
  }
  function sidebarSectionById(id) {
    if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) return null;
    return q(root, "#" + id);
  }
  function sidebarLauncher(section) {
    if (!section || !section.id) return null;
    return q(root, '[data-check-sidebar-open][aria-controls="' + section.id + '"]');
  }
  function restorePageScroll(x, y) {
    if (typeof window === "undefined" || !window.scrollTo) return;
    try {
      window.scrollTo(x, y);
    } catch (e) {}
  }
  function closeSidebar(section, restoreFocus) {
    if (!section) return;
    undockNav(section);
    if (section.__prismCheckLabel) {
      section.setAttribute("aria-labelledby", section.__prismCheckLabel);
    }
    exitSidebarReview(q(section, '[data-guided-review="true"]'));
    section.setAttribute("data-check-sidebar-state", "closed");
    var launcher = sidebarLauncher(section);
    if (launcher) launcher.setAttribute("aria-expanded", "false");
    var scrollX = typeof window !== "undefined" ? window.scrollX : 0;
    var scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    if (restoreFocus && launcher && typeof launcher.focus === "function") {
      try {
        launcher.focus({ preventScroll: true });
      } catch (e) {
        try {
          launcher.focus();
        } catch (e2) {}
      }
    }
    restorePageScroll(scrollX, scrollY);
  }
  function openSidebar(section, launcher) {
    if (!section) return;
    qa(root, '[data-check-sidebar-state="open"]').forEach(function (other) {
      if (other !== section) closeSidebar(other, false);
    });
    section.setAttribute("data-check-sidebar-mode", "dock");
    section.setAttribute("data-check-sidebar-state", "open");
    if (!section.__prismCheckLabel) {
      section.__prismCheckLabel = section.getAttribute("aria-labelledby") || "";
    }
    var sidebarTitle = q(section, ".util-check-sidebar__title");
    if (sidebarTitle && sidebarTitle.id) {
      section.setAttribute("aria-labelledby", sidebarTitle.id);
    }
    if (launcher) launcher.setAttribute("aria-expanded", "true");
    enterSidebarReview(q(section, '[data-guided-review="true"]'));
    dockNav(section);
    var scrollX = typeof window !== "undefined" ? window.scrollX : 0;
    var scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    var closeBtn = q(section, "[data-check-sidebar-close]");
    if (closeBtn && typeof closeBtn.focus === "function") {
      try {
        closeBtn.focus({ preventScroll: true });
      } catch (e) {
        try {
          closeBtn.focus();
        } catch (e2) {}
      }
    }
    restorePageScroll(scrollX, scrollY);
  }
  function dockFits() {
    if (typeof window === "undefined" || !window.innerWidth) return false;
    var page = root;
    if (!page || typeof page.getBoundingClientRect !== "function") {
      page = typeof root.querySelector === "function" ? root.querySelector(".util-learner-page") : null;
    }
    if (!page || typeof page.getBoundingClientRect !== "function") return false;
    var rect = page.getBoundingClientRect();
    if (!rect || !rect.width) return false;
    var gutter = 16;
    try {
      var fontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
      if (fontSize) gutter = fontSize;
    } catch (e) {}
    var available = window.innerWidth - rect.right - gutter;
    return available >= gutter * 15;
  }
  function syncDock() {
    var fit = dockFits();
    qa(root, '[data-check-sidebar="available"]').forEach(function (section) {
      if (fit) {
        section.setAttribute("data-check-sidebar-mode", "dock");
        if (section.getAttribute("data-check-sidebar-state") !== "open") {
          section.setAttribute("data-check-sidebar-state", "closed");
        }
        return;
      }
      section.setAttribute("data-check-sidebar-mode", "inline");
      if (section.getAttribute("data-check-sidebar-state") === "open") {
        closeSidebar(section, false);
      }
    });
  }
  function enhance(reviewRoot) {
    if (!reviewRoot || reviewRoot.getAttribute("data-guided-review-enhanced") === "true") return;
    // Listed reviews keep every criterion question visible. Guidance opens
    // through native details, so the one-at-a-time carousel must not hide panels.
    if (reviewRoot.getAttribute("data-guided-review-presentation") === "listed") return;
    var panels = qa(reviewRoot, "[data-guided-review-index]");
    if (panels.length < 2) return;
    var nav = q(reviewRoot, "[data-guided-review-nav]");
    if (nav) nav.hidden = false;
    reviewRoot.setAttribute("data-guided-review-enhanced", "true");
    sync(reviewRoot, 0, false);
  }
  function eventInScope(event) {
    var target = event && event.target;
    if (!target) return false;
    if (root === target) return true;
    if (root.nodeType === 9) return true;
    if (typeof document !== "undefined" && root === document) return true;
    if (typeof root.contains === "function") return root.contains(target);
    return true;
  }
  function onClick(event) {
    if (!eventInScope(event)) return;
    var sidebarTarget =
      event.target && event.target.closest
        ? event.target.closest(
            "[data-check-sidebar-open],[data-check-sidebar-close],[data-verified-review-toggle]"
          )
        : null;
    if (sidebarTarget) {
      if (sidebarTarget.hasAttribute("data-check-sidebar-close")) {
        if (event.preventDefault) event.preventDefault();
        closeSidebar(sidebarTarget.closest("[data-check-sidebar]"), true);
        return;
      }
      if (sidebarTarget.hasAttribute("data-verified-review-toggle")) {
        if (event.preventDefault) event.preventDefault();
        var panelId = String(sidebarTarget.getAttribute("aria-controls") || "");
        var panel = sidebarSectionById(panelId);
        if (!panel) return;
        var show = panel.getAttribute("data-verified-visible") !== "true";
        if (show) panel.setAttribute("data-verified-visible", "true");
        else panel.removeAttribute("data-verified-visible");
        sidebarTarget.setAttribute("aria-expanded", show ? "true" : "false");
        return;
      }
      var section = sidebarSectionById(sidebarTarget.getAttribute("aria-controls"));
      if (!section || section.getAttribute("data-check-sidebar-mode") !== "dock") return;
      if (event.preventDefault) event.preventDefault();
      if (section.getAttribute("data-check-sidebar-state") === "open") closeSidebar(section, true);
      else openSidebar(section, sidebarTarget);
      return;
    }
    var btn =
      event.target && event.target.closest
        ? event.target.closest("[data-guided-review-prev],[data-guided-review-next]")
        : null;
    if (!btn || btn.disabled) return;
    var reviewRoot = reviewForControl(btn);
    if (!reviewRoot) return;
    event.preventDefault();
    var current = Number(reviewRoot.getAttribute("data-guided-review-active") || 0);
    var delta = btn.hasAttribute("data-guided-review-next") ? 1 : -1;
    sync(reviewRoot, current + delta, true);
    try {
      btn.focus();
    } catch (e) {}
  }
  function onReturn(event) {
    if (!eventInScope(event)) return;
    var link =
      event.target && event.target.closest
        ? event.target.closest("[data-assessment-return-to-response]")
        : null;
    if (!link) return;
    var id = String(link.getAttribute("data-assessment-return-to-response") || "").replace(/"/g, "");
    if (!id) return;
    var field = q(root, '[id="' + id.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"]');
    if (!field && root.getElementById) field = root.getElementById(id);
    if (!field) return;
    if (event.preventDefault) event.preventDefault();
    try {
      field.focus();
    } catch (e) {}
  }

  function onKeyDown(event) {
    if (!eventInScope(event)) return;
    if (!event || event.key !== "Escape") return;
    var section = q(root, '[data-check-sidebar-state="open"]');
    if (!section || typeof section.contains !== "function" || !section.contains(event.target)) return;
    closeSidebar(section, true);
  }

  qa(root, '[data-guided-review="true"]').forEach(enhance);
  syncDock();
  root.addEventListener("click", onClick);
  root.addEventListener("click", onReturn);
  if (typeof root.addEventListener === "function") root.addEventListener("keydown", onKeyDown);
  if (typeof window !== "undefined" && window.addEventListener) {
    window.addEventListener("resize", syncDock);
  }

  function dispose() {
    if (!root.__prismGuidedReviewRuntime) return;
    if (typeof root.removeEventListener === "function") {
      root.removeEventListener("click", onClick);
      root.removeEventListener("click", onReturn);
      root.removeEventListener("keydown", onKeyDown);
    }
    if (typeof window !== "undefined" && window.removeEventListener) {
      window.removeEventListener("resize", syncDock);
    }
    delete root.__prismGuidedReviewRuntime;
  }

  var api = { ok: true, dispose: dispose };
  root.__prismGuidedReviewRuntime = api;
  return api;
}

function disposeGuidedReviewRuntime(root) {
  if (root && root.__prismGuidedReviewRuntime && typeof root.__prismGuidedReviewRuntime.dispose === "function") {
    root.__prismGuidedReviewRuntime.dispose();
  }
}

function getGuidedReviewRuntimeScript() {
  return (
    "(function(){" +
    installGuidedReviewRuntime.toString() +
    disposeGuidedReviewRuntime.toString() +
    "function boot(){" +
    "var roots=document.querySelectorAll('[data-renderer=\"vnext\"]');" +
    "if(roots&&roots.length){Array.prototype.forEach.call(roots,function(root){installGuidedReviewRuntime(root);});return;}" +
    "installGuidedReviewRuntime(document);" +
    "}" +
    "if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);" +
    "else boot();" +
    "})();"
  );
}

module.exports = {
  installGuidedReviewRuntime: installGuidedReviewRuntime,
  disposeGuidedReviewRuntime: disposeGuidedReviewRuntime,
  getGuidedReviewRuntimeScript: getGuidedReviewRuntimeScript
};
