"use strict";

/**
 * Ordering workspace client runtime.
 * Sprint 95 M4: container-scoped install/dispose for unified shell mounting.
 * Standalone export still auto-boots via getOrderingRuntimeScript().
 */

function validateExactOrder(learnerIds, expectedIds) {
  if (!Array.isArray(learnerIds) || !Array.isArray(expectedIds)) {
    return { ok: false, state: "incorrect" };
  }
  if (learnerIds.length !== expectedIds.length || !expectedIds.length) {
    return { ok: false, state: "incorrect" };
  }
  for (var i = 0; i < expectedIds.length; i += 1) {
    if (String(learnerIds[i]) !== String(expectedIds[i])) {
      return { ok: false, state: "incorrect" };
    }
  }
  return { ok: true, state: "correct" };
}

/**
 * @param {Element|Document} root
 * @returns {{ ok: boolean, dispose: Function }}
 */
function installOrderingRuntime(root) {
  if (!root) return { ok: false, dispose: function () {} };
  if (root.__prismOrderingRuntime) return root.__prismOrderingRuntime;

  function q(scope, sel) {
    return scope.querySelector(sel);
  }
  function qa(scope, sel) {
    return Array.prototype.slice.call(scope.querySelectorAll(sel));
  }
  function readExpected(workspace) {
    var node = q(workspace, ".util-ordering-expected");
    if (!node) return [];
    try {
      return JSON.parse(node.textContent || "[]");
    } catch (e) {
      return [];
    }
  }
  function announce(workspace, message) {
    var status = q(workspace, "[data-ordering-status]");
    if (!status) return;
    status.textContent = "";
    void status.offsetWidth;
    status.textContent = message;
  }
  function refresh(workspace) {
    var list = q(workspace, "[data-ordering-list]");
    if (!list) return;
    var items = qa(list, ".util-ordering-item");
    var total = items.length;
    items.forEach(function (item, index) {
      var pos = index + 1;
      item.setAttribute("data-position", String(pos));
      var posEl = q(item, ".util-ordering-item__position");
      if (posEl) posEl.textContent = pos + " of " + total;
      var content = q(item, ".util-ordering-item__content");
      var label = ((content && content.textContent) || "").trim() || "Item " + pos;
      var hidden = q(item, ".util-visually-hidden");
      if (hidden) hidden.textContent = "Item " + pos + " of " + total + ": " + label;
      var up = q(item, ".util-ordering-item__move--up");
      var down = q(item, ".util-ordering-item__move--down");
      if (up) {
        up.disabled = pos === 1;
        up.setAttribute("aria-label", 'Move "' + label + '" up');
      }
      if (down) {
        down.disabled = pos === total;
        down.setAttribute("aria-label", 'Move "' + label + '" down');
      }
    });
  }
  function notifyChange(workspace) {
    try {
      var scopeRoot =
        workspace.closest &&
        (workspace.closest('[data-renderer="vnext"]') ||
          workspace.closest("main.util-learner-renderer-vnext") ||
          workspace.closest("article.util-learner-renderer-vnext"));
      var target = scopeRoot || workspace;
      var event = null;
      if (typeof CustomEvent === "function") {
        event = new CustomEvent("prism:learner-workspace-change", {
          bubbles: true,
          detail: {
            kind: "ordering",
            workspaceId: workspace.getAttribute("data-workspace-id") || ""
          }
        });
      } else if (document.createEvent) {
        event = document.createEvent("Event");
        event.initEvent("prism:learner-workspace-change", true, true);
      }
      if (event && target && target.dispatchEvent) target.dispatchEvent(event);
    } catch (e) {}
  }
  function moveItem(workspace, item, direction) {
    var list = q(workspace, "[data-ordering-list]");
    if (!list || !item) return;
    var sibling = direction === "up" ? item.previousElementSibling : item.nextElementSibling;
    if (!sibling || !sibling.classList.contains("util-ordering-item")) return;
    if (direction === "up") list.insertBefore(item, sibling);
    else list.insertBefore(sibling, item);
    refresh(workspace);
    var content = q(item, ".util-ordering-item__content");
    var label = ((content && content.textContent) || "").trim() || "Item";
    var pos = Number(item.getAttribute("data-position") || 0);
    var total = qa(list, ".util-ordering-item").length;
    announce(workspace, 'Moved "' + label + '" to position ' + pos + " of " + total + ".");
    notifyChange(workspace);
    var focusBtn = q(
      item,
      direction === "up" ? ".util-ordering-item__move--up" : ".util-ordering-item__move--down"
    );
    if (focusBtn && !focusBtn.disabled) focusBtn.focus();
    else if (item.focus) item.focus();
  }
  function currentOrder(workspace) {
    return qa(workspace, "[data-ordering-list] .util-ordering-item").map(function (item) {
      return item.getAttribute("data-ordering-item-id") || "";
    });
  }
  function checkOrder(workspace) {
    var expected = readExpected(workspace);
    var learner = currentOrder(workspace);
    var feedback = q(workspace, "[data-ordering-feedback]");
    if (!feedback) return;
    feedback.hidden = false;
    var ok =
      expected.length &&
      learner.length === expected.length &&
      expected.every(function (id, i) {
        return String(id) === String(learner[i]);
      });
    feedback.textContent = ok ? "Correct sequence." : "Review the sequence and try again.";
    feedback.setAttribute("data-ordering-state", ok ? "correct" : "incorrect");
    announce(workspace, feedback.textContent);
  }
  function eventInScope(event) {
    if (!event || !event.target) return false;
    if (root === document || root.nodeType === 9) return true;
    if (typeof root.contains === "function") return root.contains(event.target);
    return true;
  }
  function onClick(event) {
    if (!eventInScope(event)) return;
    var btn =
      event.target && event.target.closest
        ? event.target.closest("[data-ordering-action]")
        : null;
    if (!btn) return;
    var workspaceId = btn.getAttribute("data-ordering-workspace-id") || "";
    var workspace = q(
      root,
      '.util-ordering-workspace[data-workspace-id="' +
        String(workspaceId).replace(/"/g, '\\"') +
        '"]'
    );
    if (!workspace) return;
    var action = btn.getAttribute("data-ordering-action");
    if (action === "check") {
      checkOrder(workspace);
      return;
    }
    var item = btn.closest(".util-ordering-item");
    if (!item) return;
    moveItem(workspace, item, action);
  }

  qa(root, ".util-ordering-workspace").forEach(refresh);
  root.addEventListener("click", onClick);

  function dispose() {
    if (!root.__prismOrderingRuntime) return;
    if (typeof root.removeEventListener === "function") {
      root.removeEventListener("click", onClick);
    }
    delete root.__prismOrderingRuntime;
    delete root.__prismOrderingBound;
  }

  var api = { ok: true, dispose: dispose, refresh: refresh };
  root.__prismOrderingRuntime = api;
  root.__prismOrderingBound = true;
  return api;
}

function disposeOrderingRuntime(root) {
  if (root && root.__prismOrderingRuntime && typeof root.__prismOrderingRuntime.dispose === "function") {
    root.__prismOrderingRuntime.dispose();
  }
}

function getOrderingRuntimeScript() {
  return (
    "(function(){" +
    installOrderingRuntime.toString() +
    disposeOrderingRuntime.toString() +
    "function boot(){" +
    "var roots=document.querySelectorAll('[data-renderer=\"vnext\"]');" +
    "if(roots&&roots.length){Array.prototype.forEach.call(roots,function(root){installOrderingRuntime(root);});return;}" +
    "installOrderingRuntime(document);" +
    "}" +
    "if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);" +
    "else boot();" +
    "window.PRISM_ORDERING_RUNTIME={install:installOrderingRuntime,dispose:disposeOrderingRuntime};" +
    "})();"
  );
}

module.exports = {
  validateExactOrder: validateExactOrder,
  installOrderingRuntime: installOrderingRuntime,
  disposeOrderingRuntime: disposeOrderingRuntime,
  getOrderingRuntimeScript: getOrderingRuntimeScript
};
