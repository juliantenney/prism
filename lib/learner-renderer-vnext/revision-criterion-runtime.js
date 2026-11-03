"use strict";

/**
 * S81-T-008 R4 — progressive enhancement for revision-pass criterion accompaniment.
 * Sprint 95 M4: container-scoped install/dispose for unified shell mounting.
 *
 * State (per activity Task region):
 *   activeRevisionCriterionId = null | criterionId
 * Derived:
 *   - full guidance visible iff activeRevisionCriterionId is set
 *   - compact reminder visible iff active + full guidance not in view + task still in view
 *
 * Compact reminder uses position:fixed when active (not sticky-from-above-fold).
 * Sticky from a slot already scrolled off-screen does not re-enter the viewport.
 *
 * TEMP (local preview): window.__PRISM_R4_DUMP__(activityId?) and optional
 * window.__PRISM_R4_DEBUG__=true console logging of the visibility decision.
 */

/**
 * @param {Element|Document} root
 * @returns {{ ok: boolean, dispose: Function }}
 */
function installRevisionCriterionRuntime(root) {
  if (!root) return { ok: false, dispose: function () {} };
  if (root.__prismRevisionCriterionRuntime) return root.__prismRevisionCriterionRuntime;

  var doc = root.nodeType === 9 ? root : root.ownerDocument || (typeof document !== "undefined" ? document : null);
  var win = (doc && doc.defaultView) || (typeof window !== "undefined" ? window : null);
  if (!doc || !win) return { ok: false, dispose: function () {} };

  function qa(scope, sel) {
    return Array.prototype.slice.call((scope || doc).querySelectorAll(sel));
  }
  function q(scope, sel) {
    return (scope || doc).querySelector(sel);
  }
  var observers = [];
  var lastDumpKey = "";
  var disposed = false;

  function debugEnabled() {
    try {
      if (win.__PRISM_R4_DEBUG__ === true) return true;
      var s = String((win.location && win.location.search) || "");
      return s.indexOf("r4debug=1") >= 0;
    } catch (e) {
      return false;
    }
  }
  function findTask(activityId) {
    return q(
      root,
      '[data-composition-moment="do"][data-activity-id="' + String(activityId || "").replace(/"/g, "") + '"]'
    );
  }
  function findGuidance(task) {
    return task ? q(task, '[data-revision-guidance="true"]') : null;
  }
  function findReminder(task) {
    return task ? q(task, '[data-revision-reminder="true"]') : null;
  }
  function findCriterionRoot(el) {
    if (!el || !el.closest) return null;
    return el.closest("[data-revision-criterion-root]");
  }
  function getScrollParent(el) {
    var node = el && el.parentElement;
    while (node && node !== doc.body && node !== doc.documentElement) {
      try {
        var style = win.getComputedStyle(node);
        var oy = style && style.overflowY;
        if ((oy === "auto" || oy === "scroll" || oy === "overlay") && node.scrollHeight > node.clientHeight + 1) {
          return node;
        }
      } catch (e) {}
      node = node.parentElement;
    }
    return null;
  }
  function isInView(el) {
    if (!el || !el.getBoundingClientRect) return false;
    var rect = el.getBoundingClientRect();
    var scrollRoot = getScrollParent(el);
    if (scrollRoot && scrollRoot.getBoundingClientRect) {
      var rr = scrollRoot.getBoundingClientRect();
      return rect.bottom > rr.top + 1 && rect.top < rr.bottom - 1;
    }
    var vh = win.innerHeight || (doc.documentElement && doc.documentElement.clientHeight) || 0;
    return rect.bottom > 1 && rect.top < vh - 1;
  }
  function rectOf(el) {
    if (!el || !el.getBoundingClientRect) return null;
    var r = el.getBoundingClientRect();
    return {
      top: r.top,
      right: r.right,
      bottom: r.bottom,
      left: r.left,
      width: r.width,
      height: r.height
    };
  }
  function scrollRootInfo(el) {
    var scrollRoot = getScrollParent(el);
    if (!scrollRoot) {
      return {
        type: "WINDOW",
        scrollY: win.scrollY || win.pageYOffset || 0,
        innerHeight: win.innerHeight || 0
      };
    }
    return {
      type: "ELEMENT",
      tag: scrollRoot.tagName,
      className: scrollRoot.className || "",
      scrollTop: scrollRoot.scrollTop,
      clientHeight: scrollRoot.clientHeight,
      scrollHeight: scrollRoot.scrollHeight
    };
  }
  function extractStatementHtml(criterionRoot) {
    if (!criterionRoot) return "";
    var statement = q(criterionRoot, ".util-guided-review__statement");
    if (statement) return statement.innerHTML;
    var label = q(criterionRoot, ".util-interactive-checklist__label");
    return label ? label.innerHTML : "";
  }
  function buildBodyFromRoot(criterionRoot) {
    if (!criterionRoot) return "";
    var parts = [];
    var statementHtml = extractStatementHtml(criterionRoot);
    if (statementHtml) {
      parts.push('<div class="util-revision-guidance__statement">' + statementHtml + "</div>");
    }
    var why = q(criterionRoot, ".util-guided-review__why");
    if (why) parts.push(why.outerHTML);
    var look = q(criterionRoot, ".util-guided-review__look-for");
    if (look) parts.push(look.outerHTML);
    var miss = q(criterionRoot, ".util-guided-review__missing");
    if (miss) parts.push(miss.outerHTML);
    return parts.join("");
  }
  function setReminderVisible(reminder, visible) {
    if (!reminder) return;
    if (visible) {
      reminder.hidden = false;
      reminder.setAttribute("data-revision-reminder-active", "true");
    } else {
      reminder.hidden = true;
      reminder.removeAttribute("data-revision-reminder-active");
    }
  }
  function collectDump(task) {
    var guidance = findGuidance(task);
    var reminder = findReminder(task);
    var heading = task ? q(task, ".util-composition-moment-heading") : null;
    var body = task ? q(task, ".util-composition-moment__body") : null;
    var active = task && task.getAttribute("data-active-revision-criterion-id");
    var guidanceFound = !!guidance;
    var guidanceHidden = guidance ? !!guidance.hidden : null;
    var guidanceInView = guidanceFound && !guidance.hidden ? isInView(guidance) : false;
    var taskFound = !!task;
    var taskInView = taskFound ? isInView(task) : false;
    var headingInView = heading ? isInView(heading) : false;
    var bodyInView = body ? isInView(body) : false;
    var shouldShow = !!(active && guidanceFound && !guidance.hidden && !guidanceInView && taskInView);
    var cs = reminder ? win.getComputedStyle(reminder) : null;
    return {
      activeRevisionCriterionId: active || null,
      taskMeans:
        'section[data-composition-moment=do] (entire Do/activity Task region — NOT the heading alone)',
      guidanceFound: guidanceFound,
      guidanceHidden: guidanceHidden,
      guidanceRect: rectOf(guidance),
      guidanceInView: guidanceInView,
      taskFound: taskFound,
      taskRect: rectOf(task),
      taskInView: taskInView,
      headingFound: !!heading,
      headingRect: rectOf(heading),
      headingInView: headingInView,
      bodyFound: !!body,
      bodyRect: rectOf(body),
      bodyInView: bodyInView,
      scrollRoot: scrollRootInfo(guidance || task),
      shouldShowReminder: shouldShow,
      dataRevisionReminderActive: reminder ? reminder.getAttribute("data-revision-reminder-active") : null,
      reminderHidden: reminder ? !!reminder.hidden : null,
      computed: cs
        ? {
            display: cs.display,
            visibility: cs.visibility,
            opacity: cs.opacity,
            position: cs.position,
            top: cs.top,
            bottom: cs.bottom,
            zIndex: cs.zIndex,
            width: cs.width
          }
        : null,
      reminderRect: rectOf(reminder)
    };
  }
  function logDump(dump, reason) {
    if (!debugEnabled() || !dump) return;
    var key = [
      dump.activeRevisionCriterionId,
      dump.guidanceInView,
      dump.taskInView,
      dump.headingInView,
      dump.bodyInView,
      dump.shouldShowReminder,
      dump.dataRevisionReminderActive
    ].join("|");
    if (key === lastDumpKey && reason === "scroll") return;
    lastDumpKey = key;
    try {
      console.log("[PRISM_R4]", reason || "sync", dump);
    } catch (e) {}
  }
  function syncReminderFromGuidance(task) {
    var guidance = findGuidance(task);
    var reminder = findReminder(task);
    if (!reminder) return;
    var active = task && task.getAttribute("data-active-revision-criterion-id");
    if (!active || !guidance || guidance.hidden) {
      setReminderVisible(reminder, false);
      logDump(collectDump(task), "inactive-or-hidden-guidance");
      return;
    }
    var guidanceInView = isInView(guidance);
    var taskInView = isInView(task);
    var shouldShow = !guidanceInView && taskInView;
    setReminderVisible(reminder, shouldShow);
    logDump(collectDump(task), "scroll");
  }
  function ensureObserver(task) {
    var guidance = findGuidance(task);
    if (!guidance || typeof win.IntersectionObserver !== "function") return;
    var io = new win.IntersectionObserver(
      function () {
        syncReminderFromGuidance(task);
      },
      { root: getScrollParent(guidance), threshold: 0, rootMargin: "0px" }
    );
    io.observe(guidance);
    io.observe(task);
    observers.push(io);
  }
  function setActive(task, criterionId, bodyHtml, statementHtml) {
    var guidance = findGuidance(task);
    var reminder = findReminder(task);
    if (!guidance) return null;
    var body = q(guidance, "[data-revision-guidance-body]");
    if (body) body.innerHTML = bodyHtml || "";
    var stmt = reminder ? q(reminder, "[data-revision-reminder-statement]") : null;
    if (stmt) stmt.innerHTML = statementHtml || "";
    if (criterionId) {
      guidance.hidden = false;
      guidance.setAttribute("data-active-revision-criterion-id", String(criterionId));
      task.setAttribute("data-active-revision-criterion-id", String(criterionId));
      if (reminder) reminder.setAttribute("data-active-revision-criterion-id", String(criterionId));
      ensureObserver(task);
      syncReminderFromGuidance(task);
    } else {
      guidance.hidden = true;
      guidance.removeAttribute("data-active-revision-criterion-id");
      task.removeAttribute("data-active-revision-criterion-id");
      if (reminder) {
        reminder.removeAttribute("data-active-revision-criterion-id");
        setReminderVisible(reminder, false);
        if (stmt) stmt.innerHTML = "";
      }
      if (body) body.innerHTML = "";
    }
    return guidance;
  }
  function activateFromControl(control) {
    var activityId = control.getAttribute("data-activity-id") || "";
    var criterionId = control.getAttribute("data-revision-criterion-id") || "";
    var task = findTask(activityId);
    if (!task || !criterionId) return;
    var criterionRoot = findCriterionRoot(control);
    var bodyHtml = buildBodyFromRoot(criterionRoot);
    var statementHtml = extractStatementHtml(criterionRoot);
    var guidance = setActive(task, criterionId, bodyHtml, statementHtml);
    var href = control.getAttribute("href");
    if (href && href.charAt(0) === "#") {
      try {
        if (win.history && win.history.pushState) {
          win.history.pushState(null, "", href);
        } else {
          win.location.hash = href.slice(1);
        }
      } catch (e) {
        try {
          win.location.hash = href.slice(1);
        } catch (e2) {}
      }
    }
    var heading = guidance ? q(guidance, ".util-revision-guidance__heading") : null;
    if (heading) {
      try {
        heading.focus();
      } catch (e3) {}
    }
    syncReminderFromGuidance(task);
    logDump(collectDump(task), "activate");
  }
  function hideFromControl(btn) {
    var guidance = btn.closest ? btn.closest('[data-revision-guidance="true"]') : null;
    if (!guidance) return;
    var task = guidance.closest ? guidance.closest('[data-composition-moment="do"]') : null;
    if (!task) return;
    setActive(task, null, "", "");
    var taskHeading = q(task, ".util-composition-moment-heading");
    if (taskHeading) {
      try {
        taskHeading.focus();
      } catch (e) {}
    }
  }
  function viewGuidanceFromControl(btn) {
    var reminder = btn.closest ? btn.closest('[data-revision-reminder="true"]') : null;
    if (!reminder) return;
    var task = reminder.closest ? reminder.closest('[data-composition-moment="do"]') : null;
    if (!task) return;
    var guidance = findGuidance(task);
    if (!guidance || guidance.hidden) return;
    try {
      if (guidance.scrollIntoView) guidance.scrollIntoView({ block: "start", behavior: "smooth" });
    } catch (e) {
      try {
        guidance.scrollIntoView(true);
      } catch (e2) {}
    }
    var heading = q(guidance, ".util-revision-guidance__heading");
    if (heading) {
      try {
        heading.focus();
      } catch (e3) {}
    }
    setReminderVisible(reminder, false);
    if (typeof setTimeout === "function") {
      setTimeout(function () {
        syncReminderFromGuidance(task);
      }, 50);
    }
  }
  function eventInScope(event) {
    if (!event || !event.target) return false;
    if (root === doc || root.nodeType === 9) return true;
    if (typeof root.contains === "function") return root.contains(event.target);
    return true;
  }
  function onClick(event) {
    if (!eventInScope(event)) return;
    var t = event.target;
    if (!t) return;
    var revise = t.closest ? t.closest("[data-revise-with-criterion]") : null;
    if (revise) {
      event.preventDefault();
      activateFromControl(revise);
      return;
    }
    var hide = t.closest ? t.closest("[data-revision-guidance-hide]") : null;
    if (hide) {
      event.preventDefault();
      hideFromControl(hide);
      return;
    }
    var view = t.closest ? t.closest("[data-revision-reminder-view]") : null;
    if (view) {
      event.preventDefault();
      viewGuidanceFromControl(view);
    }
  }
  function onScrollOrResize() {
    qa(root, '[data-composition-moment="do"][data-active-revision-criterion-id]').forEach(
      syncReminderFromGuidance
    );
  }

  win.__PRISM_R4_DUMP__ = function (activityId) {
    var task = activityId
      ? findTask(activityId)
      : q(root, '[data-composition-moment="do"][data-active-revision-criterion-id]');
    if (!task) task = q(root, '[data-composition-moment="do"]');
    var dump = collectDump(task);
    try {
      console.log("[PRISM_R4_DUMP]", dump);
    } catch (e) {}
    return dump;
  };

  if (typeof root.addEventListener === "function") {
    root.addEventListener("click", onClick);
  } else {
    doc.addEventListener("click", onClick);
  }
  doc.addEventListener("scroll", onScrollOrResize, true);
  win.addEventListener("scroll", onScrollOrResize, { passive: true });
  win.addEventListener("resize", onScrollOrResize);

  function dispose() {
    if (disposed) return;
    disposed = true;
    if (typeof root.removeEventListener === "function") {
      root.removeEventListener("click", onClick);
    } else if (doc.removeEventListener) {
      doc.removeEventListener("click", onClick);
    }
    if (doc.removeEventListener) {
      doc.removeEventListener("scroll", onScrollOrResize, true);
    }
    if (win.removeEventListener) {
      win.removeEventListener("scroll", onScrollOrResize);
      win.removeEventListener("resize", onScrollOrResize);
    }
    observers.forEach(function (io) {
      try {
        io.disconnect();
      } catch (e) {}
    });
    observers = [];
    delete root.__prismRevisionCriterionRuntime;
  }

  var api = { ok: true, dispose: dispose };
  root.__prismRevisionCriterionRuntime = api;
  return api;
}

function disposeRevisionCriterionRuntime(root) {
  if (
    root &&
    root.__prismRevisionCriterionRuntime &&
    typeof root.__prismRevisionCriterionRuntime.dispose === "function"
  ) {
    root.__prismRevisionCriterionRuntime.dispose();
  }
}

function getRevisionCriterionRuntimeScript() {
  return (
    "(function(){" +
    installRevisionCriterionRuntime.toString() +
    disposeRevisionCriterionRuntime.toString() +
    "function boot(){" +
    "var roots=document.querySelectorAll('[data-renderer=\"vnext\"]');" +
    "if(roots&&roots.length){Array.prototype.forEach.call(roots,function(root){installRevisionCriterionRuntime(root);});return;}" +
    "installRevisionCriterionRuntime(document);" +
    "}" +
    "if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();" +
    "window.PRISM_REVISION_CRITERION={install:installRevisionCriterionRuntime,dispose:disposeRevisionCriterionRuntime};" +
    "})();"
  );
}

module.exports = {
  getRevisionCriterionRuntimeScript: getRevisionCriterionRuntimeScript,
  installRevisionCriterionRuntime: installRevisionCriterionRuntime,
  disposeRevisionCriterionRuntime: disposeRevisionCriterionRuntime
};
