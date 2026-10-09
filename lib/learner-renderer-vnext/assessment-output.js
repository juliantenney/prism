"use strict";

/**
 * Learner-owned artefact assembled from a validated output_specification.
 * Concatenation only: authored lines plus the current controls.
 * No model call, no score, and no claim about unmarked writing.
 */

var html = require("./render-html-utils");

function renderAssessmentOutputRegion(spec) {
  if (!spec || typeof spec !== "object") return "";
  var specId = String(spec.specification_id || "").trim();
  var title = String(spec.artefact_title || "").trim();
  var action = String(spec.action_label || "").trim();
  if (!specId || !title || !action) return "";
  var workspaceId = "assessment-output-" + specId;
  var encoded = html.escapeAttribute(JSON.stringify(spec).replace(/</g, "\\u003c"));
  return (
    '<section class="util-assessment-output" data-assessment-output-region="true" data-assessment-output-spec="' +
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
 * @param {Document} doc
 */
function installAssessmentOutput(doc) {
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
    var host = byAttribute(doc, "data-elicitation-id", String(elicitationId || ""));
    var scope = host || doc;
    var wanted = slugify(itemId);
    var items = list(scope, "[data-assessment-item-id]");
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
    var workspace = byAttribute(doc, "data-workspace-id", workspaceId);
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
      var root = node.closest ? node.closest("main.util-learner-renderer-vnext") : null;
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

  function copyText(text, done) {
    var synced = false;
    try {
      synced = !!(doc.execCommand && doc.execCommand("copy"));
    } catch (err) {
      synced = false;
    }
    if (synced) {
      done(true);
      return;
    }
    var view = doc.defaultView || (typeof window !== "undefined" ? window : null);
    var nav = view && view.navigator;
    if (nav && nav.clipboard && typeof nav.clipboard.writeText === "function") {
      try {
        var pending = nav.clipboard.writeText(text);
        if (pending && typeof pending.then === "function") {
          pending.then(
            function () {
              done(true);
            },
            function () {
              done(false);
            }
          );
          return;
        }
        done(true);
        return;
      } catch (err) {
        done(false);
        return;
      }
    }
    done(false);
  }

  if (!doc || !doc.addEventListener) return;

  doc.addEventListener("click", function (event) {
    var target = event.target;
    if (!target || !target.closest) return;
    var region = target.closest("[data-assessment-output-region]");
    if (!region) return;
    var assembleButton = target.closest("[data-assessment-assemble]");
    var copyButton = target.closest("[data-assessment-output-copy]");
    var replaceButton = target.closest("[data-assessment-output-replace]");
    if (!assembleButton && !copyButton && !replaceButton) return;
    if (event.preventDefault) event.preventDefault();
    var workspace = workspaceOf(region);
    var area = areaOf(workspace);
    if (!workspace || !area) return;
    if (copyButton) {
      var selection = area;
      if (selection.focus) selection.focus();
      if (selection.select) selection.select();
      copyText(String(area.value || ""), function (ok) {
        setStatus(region, ok ? "Copied." : "Copy was not available.");
      });
      return;
    }
    var spec = readSpec(region);
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
  });
}

function getAssessmentOutputRuntimeScript() {
  return "(function(){" + installAssessmentOutput.toString() + "installAssessmentOutput(document);})();";
}

module.exports = {
  renderAssessmentOutputRegion: renderAssessmentOutputRegion,
  installAssessmentOutput: installAssessmentOutput,
  getAssessmentOutputRuntimeScript: getAssessmentOutputRuntimeScript
};
