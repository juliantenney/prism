"use strict";

var constants = require("./learner-draft-constants");
var envelope = require("./learner-draft-envelope");

var adapters = Object.create(null);

function registerLearnerStateAdapter(kind, adapter) {
  var key = String(kind || "");
  if (!key || !adapter || typeof adapter.serialize !== "function" || typeof adapter.restore !== "function") {
    throw new Error("Invalid learner state adapter for kind: " + key);
  }
  adapters[key] = {
    serialize: adapter.serialize,
    restore: adapter.restore,
    validate: typeof adapter.validate === "function" ? adapter.validate : function () {
      return { ok: true, diagnostics: [] };
    },
    clear: typeof adapter.clear === "function" ? adapter.clear : null
  };
}

function getLearnerStateAdapter(kind) {
  return adapters[String(kind || "")] || null;
}

function listRegisteredAdapterKinds() {
  return Object.keys(adapters);
}

function qa(root, selector) {
  return Array.prototype.slice.call(root.querySelectorAll(selector));
}

function q(root, selector) {
  return root.querySelector(selector);
}

function serializeTextEntry(workspaceElement) {
  var input = q(workspaceElement, "textarea.util-learner-workspace__input");
  return envelope.createWorkspaceState("text_entry", {
    text: input ? String(input.value || "") : ""
  });
}

function restoreTextEntry(workspaceElement, state) {
  var diagnostics = [];
  if (!state || state.kind !== "text_entry" || !state.value || typeof state.value !== "object") {
    diagnostics.push({
      code: constants.DIAGNOSTIC.INVALID_PERSISTED_WORKSPACE_STATE,
      message: "Invalid text_entry persisted state."
    });
    return { ok: false, diagnostics: diagnostics };
  }
  if (Number(state.stateVersion) !== constants.WORKSPACE_STATE_VERSION) {
    diagnostics.push({
      code: constants.DIAGNOSTIC.INVALID_PERSISTED_WORKSPACE_STATE,
      message: "Unsupported text_entry state version."
    });
    return { ok: false, diagnostics: diagnostics };
  }
  var input = q(workspaceElement, "textarea.util-learner-workspace__input");
  if (!input) {
    diagnostics.push({
      code: constants.DIAGNOSTIC.STALE_PERSISTED_WORKSPACE,
      message: "text_entry workspace input was not found."
    });
    return { ok: false, diagnostics: diagnostics };
  }
  input.value = String(state.value.text == null ? "" : state.value.text);
  return { ok: true, diagnostics: diagnostics };
}

function clearTextEntry(workspaceElement) {
  var input = q(workspaceElement, "textarea.util-learner-workspace__input");
  if (input) input.value = "";
  return { ok: true, diagnostics: [] };
}

function serializeTableEntry(workspaceElement) {
  var cells = Object.create(null);
  qa(workspaceElement, ".util-learner-table-workspace__input").forEach(function (input) {
    var cellId = input.getAttribute("data-learner-cell") || input.getAttribute("id") || "";
    if (!cellId) return;
    cells[cellId] = String(input.value || "");
  });
  return envelope.createWorkspaceState("table_entry", { cells: cells });
}

function restoreTableEntry(workspaceElement, state) {
  var diagnostics = [];
  if (!state || state.kind !== "table_entry" || !state.value || typeof state.value !== "object") {
    diagnostics.push({
      code: constants.DIAGNOSTIC.INVALID_PERSISTED_WORKSPACE_STATE,
      message: "Invalid table_entry persisted state."
    });
    return { ok: false, diagnostics: diagnostics };
  }
  if (Number(state.stateVersion) !== constants.WORKSPACE_STATE_VERSION) {
    diagnostics.push({
      code: constants.DIAGNOSTIC.INVALID_PERSISTED_WORKSPACE_STATE,
      message: "Unsupported table_entry state version."
    });
    return { ok: false, diagnostics: diagnostics };
  }
  var cells = state.value.cells && typeof state.value.cells === "object" ? state.value.cells : null;
  if (!cells) {
    diagnostics.push({
      code: constants.DIAGNOSTIC.INVALID_PERSISTED_WORKSPACE_STATE,
      message: "table_entry state is missing cells."
    });
    return { ok: false, diagnostics: diagnostics };
  }
  var known = Object.create(null);
  qa(workspaceElement, ".util-learner-table-workspace__input").forEach(function (input) {
    var cellId = input.getAttribute("data-learner-cell") || input.getAttribute("id") || "";
    if (!cellId) return;
    known[cellId] = input;
  });
  Object.keys(cells).forEach(function (cellId) {
    if (!known[cellId]) return;
    known[cellId].value = String(cells[cellId] == null ? "" : cells[cellId]);
  });
  return { ok: true, diagnostics: diagnostics };
}

function clearTableEntry(workspaceElement) {
  qa(workspaceElement, ".util-learner-table-workspace__input").forEach(function (input) {
    input.value = "";
  });
  return { ok: true, diagnostics: [] };
}

function currentOrderingIds(workspaceElement) {
  return qa(workspaceElement, "[data-ordering-list] .util-ordering-item").map(function (item) {
    return String(item.getAttribute("data-ordering-item-id") || "");
  });
}

function candidateOrderingIds(workspaceElement) {
  var attr = workspaceElement.getAttribute("data-initial-item-order") || "";
  if (attr) {
    try {
      var parsed = JSON.parse(attr);
      if (Array.isArray(parsed) && parsed.length) {
        return parsed.map(function (id) {
          return String(id);
        });
      }
    } catch (_err) {
      // fall through
    }
  }
  return currentOrderingIds(workspaceElement).slice().sort();
}

function validateOrderingValue(itemOrder, candidateIds) {
  var diagnostics = [];
  if (!Array.isArray(itemOrder)) {
    diagnostics.push({
      code: constants.DIAGNOSTIC.INVALID_PERSISTED_ORDERING_STATE,
      message: "Ordering state must be an array of item ids."
    });
    return { ok: false, diagnostics: diagnostics };
  }
  if (itemOrder.length !== candidateIds.length) {
    diagnostics.push({
      code: constants.DIAGNOSTIC.INVALID_PERSISTED_ORDERING_STATE,
      message: "Ordering state length does not match candidate items."
    });
    return { ok: false, diagnostics: diagnostics };
  }
  var seen = Object.create(null);
  var candidateSet = Object.create(null);
  candidateIds.forEach(function (id) {
    candidateSet[String(id)] = true;
  });
  for (var i = 0; i < itemOrder.length; i += 1) {
    var id = String(itemOrder[i] || "");
    if (!id || !candidateSet[id]) {
      diagnostics.push({
        code: constants.DIAGNOSTIC.INVALID_PERSISTED_ORDERING_STATE,
        message: "Ordering state references an unknown or missing item id."
      });
      return { ok: false, diagnostics: diagnostics };
    }
    if (seen[id]) {
      diagnostics.push({
        code: constants.DIAGNOSTIC.INVALID_PERSISTED_ORDERING_STATE,
        message: "Ordering state contains duplicate item ids."
      });
      return { ok: false, diagnostics: diagnostics };
    }
    seen[id] = true;
  }
  return { ok: true, diagnostics: diagnostics };
}

function applyOrderingIds(workspaceElement, itemOrder, options) {
  var opts = options || {};
  var list = q(workspaceElement, "[data-ordering-list]");
  if (!list) return { ok: false };
  var byId = Object.create(null);
  qa(list, ".util-ordering-item").forEach(function (item) {
    byId[String(item.getAttribute("data-ordering-item-id") || "")] = item;
  });
  itemOrder.forEach(function (id) {
    var item = byId[String(id)];
    if (item) list.appendChild(item);
  });
  if (typeof opts.refresh === "function") {
    opts.refresh(workspaceElement);
  } else if (
    typeof window !== "undefined" &&
    window.PRISM_ORDERING_RUNTIME &&
    typeof window.PRISM_ORDERING_RUNTIME.refresh === "function"
  ) {
    window.PRISM_ORDERING_RUNTIME.refresh(workspaceElement);
  }
  return { ok: true };
}

function serializeOrdering(workspaceElement) {
  return envelope.createWorkspaceState("ordering", {
    itemOrder: currentOrderingIds(workspaceElement)
  });
}

function restoreOrdering(workspaceElement, state, options) {
  var diagnostics = [];
  if (!state || state.kind !== "ordering" || !state.value || typeof state.value !== "object") {
    diagnostics.push({
      code: constants.DIAGNOSTIC.INVALID_PERSISTED_ORDERING_STATE,
      message: "Invalid ordering persisted state."
    });
    return { ok: false, diagnostics: diagnostics };
  }
  if (Number(state.stateVersion) !== constants.WORKSPACE_STATE_VERSION) {
    diagnostics.push({
      code: constants.DIAGNOSTIC.INVALID_PERSISTED_ORDERING_STATE,
      message: "Unsupported ordering state version."
    });
    return { ok: false, diagnostics: diagnostics };
  }
  var itemOrder = state.value.itemOrder;
  var candidates = candidateOrderingIds(workspaceElement);
  var validation = validateOrderingValue(itemOrder, candidates);
  if (!validation.ok) {
    var initial = candidateOrderingIds(workspaceElement);
    applyOrderingIds(workspaceElement, initial, options);
    return { ok: false, diagnostics: validation.diagnostics, fellBackToInitial: true };
  }
  applyOrderingIds(workspaceElement, itemOrder.map(String), options);
  return { ok: true, diagnostics: diagnostics };
}

function clearOrdering(workspaceElement, options) {
  var initial = candidateOrderingIds(workspaceElement);
  applyOrderingIds(workspaceElement, initial, options);
  return { ok: true, diagnostics: [] };
}

function serializeAssessmentSelection(workspaceElement) {
  var checked = q(workspaceElement, 'input[type="radio"][data-assessment-option]:checked');
  var selectedOption = checked ? String(checked.value || "") : "";
  var checkedAttr = String(workspaceElement.getAttribute("data-assessment-checked") || "");
  return envelope.createWorkspaceState("assessment_selection", {
    selectedOption: selectedOption,
    checked: checkedAttr === "true"
  });
}

function restoreAssessmentSelection(workspaceElement, state) {
  var diagnostics = [];
  if (
    !state ||
    state.kind !== "assessment_selection" ||
    !state.value ||
    typeof state.value !== "object"
  ) {
    diagnostics.push({
      code: constants.DIAGNOSTIC.INVALID_PERSISTED_WORKSPACE_STATE,
      message: "Invalid assessment_selection persisted state."
    });
    return { ok: false, diagnostics: diagnostics };
  }
  if (Number(state.stateVersion) !== constants.WORKSPACE_STATE_VERSION) {
    diagnostics.push({
      code: constants.DIAGNOSTIC.INVALID_PERSISTED_WORKSPACE_STATE,
      message: "Unsupported assessment_selection state version."
    });
    return { ok: false, diagnostics: diagnostics };
  }

  qa(workspaceElement, 'input[type="radio"][data-assessment-option]').forEach(function (input) {
    input.checked = false;
  });
  var selected = String(state.value.selectedOption || "");
  if (selected) {
    qa(workspaceElement, 'input[type="radio"][data-assessment-option]').forEach(function (input) {
      if (String(input.value || "") === selected) input.checked = true;
    });
  }

  var resultRegion = q(workspaceElement, "[data-assessment-result]");
  if (resultRegion) {
    resultRegion.hidden = true;
    resultRegion.textContent = "";
  }
  workspaceElement.setAttribute("data-assessment-checked", state.value.checked ? "true" : "false");
  if (typeof workspaceElement.removeAttribute === "function") {
    workspaceElement.removeAttribute("data-assessment-last-result");
  } else if (workspaceElement.attributes) {
    delete workspaceElement.attributes["data-assessment-last-result"];
  }

  if (state.value.checked && selected) {
    var correct = String(workspaceElement.getAttribute("data-assessment-correct") || "");
    var rationale = String(workspaceElement.getAttribute("data-assessment-rationale") || "").trim();
    var ok = selected === correct;
    if (resultRegion) {
      resultRegion.hidden = false;
      var html =
        ok
          ? "<p><strong>Correct.</strong></p>"
          : "<p><strong>Not quite.</strong> The correct answer is " +
            String(correct)
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;") +
            ".</p>";
      if (rationale) {
        html +=
          '<p class="util-assessment-rationale">' +
          String(rationale)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;") +
          "</p>";
      }
      resultRegion.innerHTML = html;
      workspaceElement.setAttribute(
        "data-assessment-last-result",
        ok ? "correct" : "incorrect"
      );
    }
  }

  return { ok: true, diagnostics: diagnostics };
}

function clearAssessmentSelection(workspaceElement) {
  qa(workspaceElement, 'input[type="radio"][data-assessment-option]').forEach(function (input) {
    input.checked = false;
  });
  var resultRegion = q(workspaceElement, "[data-assessment-result]");
  if (resultRegion) {
    resultRegion.hidden = true;
    resultRegion.textContent = "";
  }
  workspaceElement.setAttribute("data-assessment-checked", "false");
  if (typeof workspaceElement.removeAttribute === "function") {
    workspaceElement.removeAttribute("data-assessment-last-result");
  } else if (workspaceElement.attributes) {
    delete workspaceElement.attributes["data-assessment-last-result"];
  }
  return { ok: true, diagnostics: [] };
}

function serializeChecklistEntry(workspaceElement) {
  var items = Object.create(null);
  qa(workspaceElement, 'input[type="checkbox"][data-checklist-item-id]').forEach(function (input) {
    var itemId = input.getAttribute("data-checklist-item-id") || input.getAttribute("id") || "";
    if (!itemId) return;
    items[itemId] = Boolean(input.checked);
  });
  return envelope.createWorkspaceState("checklist_entry", { items: items });
}

function restoreChecklistEntry(workspaceElement, state) {
  var diagnostics = [];
  if (
    !state ||
    state.kind !== "checklist_entry" ||
    !state.value ||
    typeof state.value !== "object"
  ) {
    diagnostics.push({
      code: constants.DIAGNOSTIC.INVALID_PERSISTED_WORKSPACE_STATE,
      message: "Invalid checklist_entry persisted state."
    });
    return { ok: false, diagnostics: diagnostics };
  }
  if (Number(state.stateVersion) !== constants.WORKSPACE_STATE_VERSION) {
    diagnostics.push({
      code: constants.DIAGNOSTIC.INVALID_PERSISTED_WORKSPACE_STATE,
      message: "Unsupported checklist_entry state version."
    });
    return { ok: false, diagnostics: diagnostics };
  }
  var items =
    state.value.items && typeof state.value.items === "object" ? state.value.items : null;
  if (!items) {
    diagnostics.push({
      code: constants.DIAGNOSTIC.INVALID_PERSISTED_WORKSPACE_STATE,
      message: "checklist_entry state is missing items."
    });
    return { ok: false, diagnostics: diagnostics };
  }
  qa(workspaceElement, 'input[type="checkbox"][data-checklist-item-id]').forEach(function (input) {
    var itemId = input.getAttribute("data-checklist-item-id") || input.getAttribute("id") || "";
    if (!itemId) return;
    input.checked = Boolean(items[itemId]);
  });
  return { ok: true, diagnostics: diagnostics };
}

function clearChecklistEntry(workspaceElement) {
  qa(workspaceElement, 'input[type="checkbox"][data-checklist-item-id]').forEach(function (input) {
    input.checked = false;
  });
  return { ok: true, diagnostics: [] };
}

registerLearnerStateAdapter("text_entry", {
  serialize: serializeTextEntry,
  restore: restoreTextEntry,
  clear: clearTextEntry,
  validate: function (state) {
    if (!state || state.kind !== "text_entry") {
      return {
        ok: false,
        diagnostics: [
          {
            code: constants.DIAGNOSTIC.INVALID_PERSISTED_WORKSPACE_STATE,
            message: "Invalid text_entry state kind."
          }
        ]
      };
    }
    return { ok: true, diagnostics: [] };
  }
});

registerLearnerStateAdapter("table_entry", {
  serialize: serializeTableEntry,
  restore: restoreTableEntry,
  clear: clearTableEntry,
  validate: function (state) {
    if (!state || state.kind !== "table_entry") {
      return {
        ok: false,
        diagnostics: [
          {
            code: constants.DIAGNOSTIC.INVALID_PERSISTED_WORKSPACE_STATE,
            message: "Invalid table_entry state kind."
          }
        ]
      };
    }
    return { ok: true, diagnostics: [] };
  }
});

registerLearnerStateAdapter("ordering", {
  serialize: serializeOrdering,
  restore: restoreOrdering,
  clear: clearOrdering,
  validate: function (state) {
    if (!state || state.kind !== "ordering") {
      return {
        ok: false,
        diagnostics: [
          {
            code: constants.DIAGNOSTIC.INVALID_PERSISTED_ORDERING_STATE,
            message: "Invalid ordering state kind."
          }
        ]
      };
    }
    return { ok: true, diagnostics: [] };
  }
});

registerLearnerStateAdapter("assessment_selection", {
  serialize: serializeAssessmentSelection,
  restore: restoreAssessmentSelection,
  clear: clearAssessmentSelection,
  validate: function (state) {
    if (!state || state.kind !== "assessment_selection") {
      return {
        ok: false,
        diagnostics: [
          {
            code: constants.DIAGNOSTIC.INVALID_PERSISTED_WORKSPACE_STATE,
            message: "Invalid assessment_selection state kind."
          }
        ]
      };
    }
    return { ok: true, diagnostics: [] };
  }
});

registerLearnerStateAdapter("checklist_entry", {
  serialize: serializeChecklistEntry,
  restore: restoreChecklistEntry,
  clear: clearChecklistEntry,
  validate: function (state) {
    if (!state || state.kind !== "checklist_entry") {
      return {
        ok: false,
        diagnostics: [
          {
            code: constants.DIAGNOSTIC.INVALID_PERSISTED_WORKSPACE_STATE,
            message: "Invalid checklist_entry state kind."
          }
        ]
      };
    }
    return { ok: true, diagnostics: [] };
  }
});

function serializeWorkspaceState(workspaceElement) {
  var kind = String(
    (workspaceElement &&
      (workspaceElement.getAttribute("data-workspace-kind") ||
        workspaceElement.getAttribute("data-workspace-capability"))) ||
      ""
  );
  var adapter = getLearnerStateAdapter(kind);
  if (!adapter) {
    return {
      ok: false,
      diagnostic: {
        code: constants.DIAGNOSTIC.UNSUPPORTED_WORKSPACE_STATE_ADAPTER,
        message: "No learner state adapter is registered for workspace kind.",
        kind: kind
      }
    };
  }
  return { ok: true, state: adapter.serialize(workspaceElement) };
}

function restoreWorkspaceState(workspaceElement, persistedState, options) {
  var kind = String(
    (workspaceElement &&
      (workspaceElement.getAttribute("data-workspace-kind") ||
        workspaceElement.getAttribute("data-workspace-capability"))) ||
      ""
  );
  var adapter = getLearnerStateAdapter(kind);
  if (!adapter) {
    return {
      ok: false,
      diagnostics: [
        {
          code: constants.DIAGNOSTIC.UNSUPPORTED_WORKSPACE_STATE_ADAPTER,
          message: "No learner state adapter is registered for workspace kind.",
          kind: kind
        }
      ]
    };
  }
  return adapter.restore(workspaceElement, persistedState, options || {});
}

function clearWorkspaceState(workspaceElement, options) {
  var kind = String(
    (workspaceElement &&
      (workspaceElement.getAttribute("data-workspace-kind") ||
        workspaceElement.getAttribute("data-workspace-capability"))) ||
      ""
  );
  var adapter = getLearnerStateAdapter(kind);
  if (!adapter || !adapter.clear) {
    return {
      ok: false,
      diagnostics: [
        {
          code: constants.DIAGNOSTIC.UNSUPPORTED_WORKSPACE_STATE_ADAPTER,
          message: "No clear handler for workspace kind.",
          kind: kind
        }
      ]
    };
  }
  return adapter.clear(workspaceElement, options || {});
}

module.exports = {
  registerLearnerStateAdapter: registerLearnerStateAdapter,
  getLearnerStateAdapter: getLearnerStateAdapter,
  listRegisteredAdapterKinds: listRegisteredAdapterKinds,
  serializeWorkspaceState: serializeWorkspaceState,
  restoreWorkspaceState: restoreWorkspaceState,
  clearWorkspaceState: clearWorkspaceState,
  validateOrderingValue: validateOrderingValue,
  applyOrderingIds: applyOrderingIds,
  currentOrderingIds: currentOrderingIds,
  candidateOrderingIds: candidateOrderingIds
};
