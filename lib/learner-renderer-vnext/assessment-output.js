"use strict";

/**
 * Learner-owned artefact assembled from a validated output_specification.
 * Concatenation only: authored lines plus the current controls.
 * No model call, no score, and no claim about unmarked writing.
 */

var html = require("./render-html-utils");

/**
 * Simple one-to-one retain/copy: one section, one response_text contribution,
 * and an action_label that asks the learner to copy. Those packs reproduce the
 * source workspace without assembly framing, so a second editable artefact area
 * is omitted. Framed briefs and composite packs keep the assembly interface.
 *
 * Contract limitation: without an explicit presentation field, framed
 * single-response artefacts must avoid a Copy-oriented action_label (or use
 * more than one contribution) to keep the editable assembly UI.
 */
function isSimpleDirectResponseOutput(spec) {
  if (!spec || typeof spec !== "object") return false;
  var action = String(spec.action_label || "").trim();
  if (!action || !/\bcopy\b/i.test(action)) return false;
  var sections = Array.isArray(spec.sections) ? spec.sections : [];
  if (sections.length !== 1 || !sections[0] || typeof sections[0] !== "object") return false;
  var contributions = Array.isArray(sections[0].contributions) ? sections[0].contributions : [];
  if (contributions.length !== 1 || !contributions[0] || typeof contributions[0] !== "object") return false;
  var contribution = contributions[0];
  if (String(contribution.response_part || "").trim() !== "response_text") return false;
  if (!String(contribution.elicitation_id || "").trim()) return false;
  if (contribution.item_id != null && String(contribution.item_id).trim()) return false;
  return true;
}

function renderAssessmentOutputRegion(spec) {
  if (!spec || typeof spec !== "object") return "";
  var specId = String(spec.specification_id || "").trim();
  var title = String(spec.artefact_title || "").trim();
  var action = String(spec.action_label || "").trim();
  if (!specId || !title || !action) return "";
  var encoded = html.escapeAttribute(JSON.stringify(spec).replace(/</g, "\\u003c"));
  if (isSimpleDirectResponseOutput(spec)) {
    var purpose = String(spec.purpose || "").trim();
    return (
      '<section class="util-assessment-output" data-assessment-output-region="true" data-assessment-output-mode="direct_copy" data-assessment-output-spec="' +
      encoded +
      '">' +
      (purpose
        ? '<p class="util-assessment-output-purpose" data-assessment-output-purpose="true">' +
          html.escapeHtml(purpose) +
          "</p>"
        : "") +
      '<p class="util-assessment-output-help" data-assessment-output-help="true">' +
      "A draft of your response is kept on this page only. Later activities will not retrieve it automatically — copy the wording you want to keep for later use." +
      "</p>" +
      "<p><button type=\"button\" class=\"util-assessment-check\" data-assessment-output-copy=\"true\">" +
      html.escapeHtml(action) +
      "</button></p>" +
      '<p class="util-assessment-output-status" aria-live="polite" data-assessment-output-status></p>' +
      "</section>"
    );
  }
  var workspaceId = "assessment-output-" + specId;
  return (
    '<section class="util-assessment-output" data-assessment-output-region="true" data-assessment-output-mode="assemble" data-assessment-output-spec="' +
    encoded +
    '">' +
    '<p><button type="button" class="util-assessment-check" data-assessment-assemble="true">' +
    html.escapeHtml(action) +
    "</button></p>" +
    '<div class="util-learner-workspace util-prose-measure" data-workspace-kind="text_entry" data-workspace-id="' +
    html.escapeAttribute(workspaceId) +
    '" data-assessment-output="true" data-assessment-judgement="none">' +
    '<label class="util-learner-workspace__label" for="' +
    html.escapeAttribute(workspaceId) +
    '">' +
    html.escapeHtml(title) +
    "</label>" +
    '<textarea class="util-learner-workspace__input" id="' +
    html.escapeAttribute(workspaceId) +
    '" name="' +
    html.escapeAttribute(workspaceId) +
    '" rows="12"></textarea>' +
    "</div>" +
    '<p><button type="button" class="util-assessment-check" data-assessment-output-copy="true">Copy</button> ' +
    '<button type="button" class="util-assessment-check" data-assessment-output-replace="true">Replace with current responses</button></p>' +
    '<p class="util-assessment-output-status" aria-live="polite" data-assessment-output-status></p>' +
    "</section>"
  );
}

/**
 * Browser installer. Kept self-contained so the published page can inline it.
 * Sprint 95 M1: scope may be a Document or a renderer root Element.
 * @param {Document|Element} scope
 * @returns {{ ok: boolean, dispose: Function }}
 */
function installAssessmentOutput(scope) {
  if (!scope) return { ok: false, dispose: function () {} };
  if (scope.__prismAssessmentOutputRuntime) return scope.__prismAssessmentOutputRuntime;

  var doc = scope.ownerDocument || scope;

  function list(root, selector) {
    if (!root || !root.querySelectorAll) return [];
    return Array.prototype.slice.call(root.querySelectorAll(selector));
  }

  function visibleText(node) {
    if (!node) return "";
    return String(node.textContent || "").replace(/\s+/g, " ").trim();
  }

  function slugify(value) {
    return (
      String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "item"
    );
  }

  function byAttribute(root, attribute, expected) {
    var nodes = list(root, "[" + attribute + "]");
    var i;
    for (i = 0; i < nodes.length; i += 1) {
      if (String(nodes[i].getAttribute(attribute) || "") === expected) return nodes[i];
    }
    return null;
  }

  function controlLabel(node) {
    var id = node && node.getAttribute ? String(node.getAttribute("id") || "") : "";
    var scope = node && node.closest ? node.closest("article") || node.parentNode : null;
    if (!id || !scope) return "";
    var labels = list(scope, "label");
    var i;
    for (i = 0; i < labels.length; i += 1) {
      if (String(labels[i].getAttribute("for") || "") === id) return visibleText(labels[i]);
    }
    return "";
  }

  function selectedOptionText(select) {
    var value = String((select && select.value) || "");
    if (!value) return "";
    var options = list(select, "option");
    var i;
    for (i = 0; i < options.length; i += 1) {
      if (String(options[i].getAttribute("value") || options[i].value || "") === value) {
        return visibleText(options[i]);
      }
    }
    return "";
  }

  function findItem(elicitationId, itemId) {
    var host = byAttribute(scope, "data-elicitation-id", String(elicitationId || ""));
    var itemScope = host || scope;
    var wanted = slugify(itemId);
    var items = list(itemScope, "[data-assessment-item-id]");
    var i;
    for (i = 0; i < items.length; i += 1) {
      var id = String(items[i].getAttribute("data-assessment-item-id") || "");
      if (id === wanted || id === String(itemId || "")) return items[i];
    }
    return null;
  }

  function selectionText(item) {
    if (!item) return "";
    var form = String(item.getAttribute("data-assessment-form") || "single_answer_mcq");
    if (form === "multiple_answer_mcq") {
      var chosen = list(item, 'input[type="checkbox"][data-assessment-option]').filter(function (input) {
        return !!input.checked;
      });
      if (!chosen.length) return "";
      return chosen
        .map(function (input) {
          return controlLabel(input) || String(input.value || "");
        })
        .filter(Boolean)
        .join("; ");
    }
    if (form === "ordering") {
      var rows = list(item, "[data-assessment-element-id]");
      if (!rows.length) return "";
      return rows
        .map(function (row, index) {
          var textNode = row.querySelector ? row.querySelector(".util-assessment-order-text") : null;
          return String(index + 1) + ". " + (visibleText(textNode) || visibleText(row));
        })
        .join("\n");
    }
    if (form === "classification" || form === "matching") {
      var selector = form === "classification" ? "select[data-assessment-assignment]" : "select[data-assessment-pair]";
      var lines = [];
      list(item, selector).forEach(function (select) {
        var chosenText = selectedOptionText(select);
        if (!chosenText) return;
        var rowLabel = controlLabel(select);
        lines.push((rowLabel || String(select.getAttribute("data-assessment-subject") || "")) + ": " + chosenText);
      });
      return lines.join("\n");
    }
    var selected = null;
    list(item, 'input[type="radio"][data-assessment-option]').forEach(function (input) {
      if (input.checked && !selected) selected = input;
    });
    if (!selected) return "";
    return controlLabel(selected) || String(selected.value || "");
  }

  function checkText(item) {
    if (!item) return "";
    if (String(item.getAttribute("data-assessment-checked") || "") !== "true") return "";
    var result = String(item.getAttribute("data-assessment-last-result") || "");
    if (result !== "correct" && result !== "incorrect") return "";
    var line = result === "correct" ? "Correct." : "Not quite.";
    var note = String(item.getAttribute("data-assessment-rationale") || "").trim();
    return note ? line + "\n" + note : line;
  }

  function fieldText(workspaceId) {
    var workspace = byAttribute(scope, "data-workspace-id", workspaceId);
    var area = workspace && workspace.querySelector ? workspace.querySelector("textarea") : null;
    return area ? String(area.value || "").trim() : "";
  }

  function contributionValue(contribution) {
    var part = String(contribution.response_part || "");
    var elicitationId = String(contribution.elicitation_id || "");
    if (part === "response_text") return fieldText("assessment-constructed-" + elicitationId);
    if (part === "identified_weakness") return fieldText("assessment-constructed-" + elicitationId + "-weakness");
    var item = findItem(elicitationId, contribution.item_id);
    if (part === "check_result") return checkText(item);
    if (part === "selected_options") return selectionText(item);
    return "";
  }

  function missingSentence(spec, contribution) {
    var override = contribution && typeof contribution.missing_response_text === "string"
      ? contribution.missing_response_text.trim()
      : "";
    if (override) return override;
    return String(spec.missing_response_text || "").trim();
  }

  function assemble(spec) {
    var lines = [
      String(spec.artefact_title || "").trim(),
      "For: " + String(spec.audience || "").trim(),
      String(spec.purpose || "").trim()
    ];
    var sections = Array.isArray(spec.sections) ? spec.sections.slice() : [];
    sections.sort(function (left, right) {
      return Number(left && left.order) - Number(right && right.order);
    });
    sections.forEach(function (section) {
      lines.push("");
      lines.push(String((section && section.heading) || "").trim());
      var contributions = section && Array.isArray(section.contributions) ? section.contributions : [];
      contributions.forEach(function (contribution) {
        lines.push(String((contribution && contribution.label) || "").trim());
        var value = contributionValue(contribution);
        lines.push(value ? value : missingSentence(spec, contribution));
      });
    });
    return lines.join("\n");
  }

  function readSpec(region) {
    var raw = String(region.getAttribute("data-assessment-output-spec") || "");
    if (!raw) return null;
    try {
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch (err) {
      return null;
    }
  }

  function workspaceOf(region) {
    return region.querySelector ? region.querySelector("[data-assessment-output]") : null;
  }

  function areaOf(workspace) {
    return workspace && workspace.querySelector ? workspace.querySelector("textarea") : null;
  }

  function setStatus(region, text) {
    var status = region.querySelector ? region.querySelector("[data-assessment-output-status]") : null;
    if (status) status.textContent = text || "";
  }

  function notify(node) {
    try {
      var root = node.closest
        ? node.closest('[data-renderer="vnext"]') || node.closest("main.util-learner-renderer-vnext")
        : null;
      var target = root || node;
      var event = null;
      if (typeof CustomEvent === "function") {
        event = new CustomEvent("prism:learner-workspace-change", { bubbles: true });
      } else if (doc.createEvent) {
        event = doc.createEvent("Event");
        event.initEvent("prism:learner-workspace-change", true, true);
      }
      if (event && target && target.dispatchEvent) target.dispatchEvent(event);
    } catch (err) {}
  }

  function writeAssembly(region, workspace, area, text) {
    area.value = text;
    workspace.setAttribute("data-assessment-assembled-snapshot", text);
    notify(workspace);
  }

  /**
   * Copy the provided text only. Prefer clipboard.writeText so success means
   * that exact string was written. execCommand("copy") without a selection of
   * that text can report true while leaving the clipboard unchanged — the
   * direct-copy path has no output textarea to select first.
   */
  function copyText(text, done) {
    var payload = String(text == null ? "" : text);
    var view = doc.defaultView || (typeof window !== "undefined" ? window : null);
    var nav = view && view.navigator;
    if (nav && nav.clipboard && typeof nav.clipboard.writeText === "function") {
      try {
        var pending = nav.clipboard.writeText(payload);
        if (pending && typeof pending.then === "function") {
          pending.then(
            function () {
              done(true);
            },
            function () {
              copyTextWithExecCommand(payload, done);
            }
          );
          return;
        }
        done(true);
        return;
      } catch (err) {
        copyTextWithExecCommand(payload, done);
        return;
      }
    }
    copyTextWithExecCommand(payload, done);
  }

  function copyTextWithExecCommand(payload, done) {
    var host = doc.body || doc.documentElement || doc;
    if (!host || typeof doc.createElement !== "function" || typeof doc.execCommand !== "function") {
      done(false);
      return;
    }
    var area = null;
    try {
      area = doc.createElement("textarea");
      area.value = payload;
      area.setAttribute("readonly", "");
      area.setAttribute("aria-hidden", "true");
      area.style.position = "fixed";
      area.style.top = "0";
      area.style.left = "-9999px";
      area.style.opacity = "0";
      host.appendChild(area);
      if (area.focus) area.focus();
      if (area.select) area.select();
      if (area.setSelectionRange) area.setSelectionRange(0, payload.length);
      var synced = !!doc.execCommand("copy");
      done(synced);
    } catch (err) {
      done(false);
    } finally {
      if (area && area.parentNode) {
        try {
          area.parentNode.removeChild(area);
        } catch (removeErr) {}
      }
    }
  }

  function eventInScope(event) {
    var target = event && event.target;
    if (!target) return false;
    if (scope === target) return true;
    if (scope.contains) return scope.contains(target);
    return true;
  }

  function directSourceResponse(spec) {
    if (!isSimpleDirectResponseOutput(spec)) return "";
    var section = spec.sections[0];
    var contribution = section.contributions[0];
    return contributionValue(contribution);
  }

  function emptyDirectCopyStatus(spec) {
    var missing = String((spec && spec.missing_response_text) || "").trim();
    if (missing) return missing + " Write your response before copying.";
    return "Write your response before copying.";
  }

  function onClick(event) {
    if (!eventInScope(event)) return;
    var target = event.target;
    if (!target || !target.closest) return;
    var region = target.closest("[data-assessment-output-region]");
    if (!region) return;
    var assembleButton = target.closest("[data-assessment-assemble]");
    var copyButton = target.closest("[data-assessment-output-copy]");
    var replaceButton = target.closest("[data-assessment-output-replace]");
    if (!assembleButton && !copyButton && !replaceButton) return;
    if (event.preventDefault) event.preventDefault();
    var mode = String(region.getAttribute("data-assessment-output-mode") || "").trim();
    var spec = readSpec(region);
    if (mode === "direct_copy") {
      if (!copyButton || !spec) return;
      var sourceText = directSourceResponse(spec);
      if (!sourceText) {
        setStatus(region, emptyDirectCopyStatus(spec));
        return;
      }
      copyText(sourceText, function (ok) {
        setStatus(region, ok ? "Copied." : "Copy was not available. Select your response and copy it manually if needed.");
      });
      return;
    }
    var workspace = workspaceOf(region);
    var area = areaOf(workspace);
    if (!workspace || !area) return;
    if (copyButton) {
      var assembledText = String(area.value || "");
      if (!assembledText.trim()) {
        setStatus(region, "Assemble your responses before copying.");
        return;
      }
      copyText(assembledText, function (ok) {
        setStatus(region, ok ? "Copied." : "Copy was not available.");
      });
      return;
    }
    if (!spec) return;
    var fresh = assemble(spec);
    if (replaceButton) {
      writeAssembly(region, workspace, area, fresh);
      setStatus(region, "");
      return;
    }
    var snapshot = workspace.getAttribute("data-assessment-assembled-snapshot");
    var current = String(area.value || "");
    if (snapshot == null || current === snapshot) {
      writeAssembly(region, workspace, area, fresh);
      setStatus(region, "");
      return;
    }
    setStatus(region, "Your edits were kept.");
  }

  if (!scope || !scope.addEventListener) return { ok: false, dispose: function () {} };

  scope.addEventListener("click", onClick);

  function dispose() {
    if (!scope.__prismAssessmentOutputRuntime) return;
    if (typeof scope.removeEventListener === "function") {
      scope.removeEventListener("click", onClick);
    }
    delete scope.__prismAssessmentOutputRuntime;
  }

  var api = { ok: true, dispose: dispose };
  scope.__prismAssessmentOutputRuntime = api;
  return api;
}

function disposeAssessmentOutput(root) {
  if (root && root.__prismAssessmentOutputRuntime && typeof root.__prismAssessmentOutputRuntime.dispose === "function") {
    root.__prismAssessmentOutputRuntime.dispose();
  }
}

function getAssessmentOutputRuntimeScript() {
  return (
    "(function(){" +
    isSimpleDirectResponseOutput.toString() +
    ";" +
    installAssessmentOutput.toString() +
    ";" +
    disposeAssessmentOutput.toString() +
    ";" +
    "function boot(){" +
    "var roots=document.querySelectorAll('[data-renderer=\"vnext\"]');" +
    "if(roots&&roots.length){Array.prototype.forEach.call(roots,function(root){installAssessmentOutput(root);});return;}" +
    "installAssessmentOutput(document);" +
    "}" +
    "if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);" +
    "else boot();" +
    "})();"
  );
}

module.exports = {
  isSimpleDirectResponseOutput: isSimpleDirectResponseOutput,
  renderAssessmentOutputRegion: renderAssessmentOutputRegion,
  installAssessmentOutput: installAssessmentOutput,
  disposeAssessmentOutput: disposeAssessmentOutput,
  getAssessmentOutputRuntimeScript: getAssessmentOutputRuntimeScript
};
