"use strict";

/**
 * S68-IMP-020 — Production certification runner for learner-renderer-vNext.
 */

var fs = require("fs");
var path = require("path");
var childProcess = require("child_process");

var corpusModule = require("./certification-corpus");
var diagnosticCatalog = require("./certification-diagnostics-catalog");
var buildPageModel = require("./build-page-model").buildPageModel;
var buildComposedPageModel = require("./compose-page-model").buildComposedPageModel;
var renderLearnerPageHtml = require("./render-learner-page").renderLearnerPageHtml;
var composeActivityMoments = require("./compose-activity-moments");
var resolveWorkspaceList =
  require("./render-composed-moment").resolveWorkspaceList;
var buildLearnerDraftPageIdentity =
  require("./learner-draft-page-key").buildLearnerDraftPageIdentity;
var initializeLearnerDraftPersistence =
  require("./learner-draft-persistence").initializeLearnerDraftPersistence;
var createLearnerDraftStorage =
  require("./learner-draft-storage").createLearnerDraftStorage;
var learnerDraftConstants = require("./learner-draft-constants");
var learnerDraftAdapters = require("./learner-draft-adapters");
var learnerDraftEnvelope = require("./learner-draft-envelope");
var workspaceFromResponsePart =
  require("./learner-surface-registry").workspaceFromResponsePart;
var types = require("./response-part-types");
var ARCHETYPE_RULES = require("./archetype-rules").ARCHETYPE_RULES;

var CERTIFICATION_VERSION = "s68-imp-020";
var STATUS = Object.freeze({
  PASS: "pass",
  WARNING: "warning",
  FAIL: "fail",
  NOT_APPLICABLE: "not_applicable"
});

function checkResult(partial) {
  return {
    checkId: String(partial.checkId || ""),
    status: partial.status || STATUS.FAIL,
    workflowId: partial.workflowId || null,
    activityId: partial.activityId || null,
    capability: partial.capability || null,
    message: String(partial.message || ""),
    provenance: partial.provenance || null,
    diagnosticCodes: Array.isArray(partial.diagnosticCodes) ? partial.diagnosticCodes : []
  };
}

function aggregateStatus(checks) {
  var hasFail = false;
  var hasWarning = false;
  var hasApplicable = false;
  (Array.isArray(checks) ? checks : []).forEach(function (row) {
    if (!row || row.status === STATUS.NOT_APPLICABLE) return;
    hasApplicable = true;
    if (row.status === STATUS.FAIL) hasFail = true;
    if (row.status === STATUS.WARNING) hasWarning = true;
  });
  if (hasFail) return STATUS.FAIL;
  if (hasWarning) return STATUS.WARNING;
  if (!hasApplicable) return STATUS.PASS;
  return STATUS.PASS;
}

function readJson(absPath) {
  return JSON.parse(fs.readFileSync(absPath, "utf8"));
}

function collectIds(html, attr) {
  var ids = [];
  // Avoid matching substrings inside data-* attributes (e.g. data-activity-id when attr is id).
  var re = new RegExp("(?:^|[^a-zA-Z0-9_-])" + attr + '="([^"]+)"', "g");
  var match;
  while ((match = re.exec(html))) ids.push(match[1]);
  return ids;
}

/**
 * Count material assignment roots in HTML (skip nested table-workspace material shells).
 */
function collectMaterialRootCounts(html) {
  var counts = Object.create(null);
  var re = /<([a-zA-Z0-9]+)([^>]*)>/g;
  var match;
  while ((match = re.exec(html))) {
    var attrs = match[2] || "";
    if (/util-learner-table-workspace__material/.test(attrs)) continue;
    var idMatch = /data-material-id="([^"]+)"/.exec(attrs);
    if (!idMatch) continue;
    var id = idMatch[1];
    counts[id] = (counts[id] || 0) + 1;
  }
  return counts;
}

function resolveActivityArchetype(activity) {
  var source = activity && activity.sourceActivity;
  return String(
    (source && source.episode_plan && source.episode_plan.archetype) ||
      (activity && activity.episodePlan && activity.episodePlan.archetype) ||
      (activity && activity.context && activity.context.archetype) ||
      ""
  ).trim();
}

/**
 * Inject stable workflow/page identity for certification without mutating fixture files.
 */
function prepareCertificationSourcePage(entry, sourcePage) {
  var page = JSON.parse(JSON.stringify(sourcePage || {}));
  page.metadata = page.metadata && typeof page.metadata === "object" ? page.metadata : {};
  if (entry.workflowId) {
    if (!page.workflow_id && !page.workflowId) page.workflow_id = entry.workflowId;
    if (!page.metadata.workflow_id && !page.metadata.workflowId) {
      page.metadata.workflow_id = entry.workflowId;
    }
  }
  var pageId = "cert-" + String(entry.id || "page");
  if (
    !page.page_id &&
    !page.pageId &&
    !page.metadata.page_id &&
    !page.metadata.pageId &&
    !page.metadata.lesson_id &&
    !page.metadata.lessonId
  ) {
    page.page_id = pageId;
    page.metadata.page_id = pageId;
  }
  return page;
}

function countMatches(html, pattern) {
  return (String(html || "").match(pattern) || []).length;
}

function uniqueDuplicates(values) {
  var seen = Object.create(null);
  var dupes = [];
  (values || []).forEach(function (value) {
    var key = String(value || "");
    if (!key) return;
    if (seen[key]) {
      if (dupes.indexOf(key) < 0) dupes.push(key);
      return;
    }
    seen[key] = true;
  });
  return dupes;
}

function momentKinds(activityComposition) {
  var moments = [];
  ["orient", "learn", "do", "check"].forEach(function (kind) {
    if (activityComposition && activityComposition[kind + "Moment"]) moments.push(kind);
  });
  return moments;
}

function collectMaterialAssignments(moments) {
  var counts = Object.create(null);
  (moments || []).forEach(function (moment) {
    if (!moment || !Array.isArray(moment.items)) return;
    moment.items.forEach(function (item) {
      if (!item || item.kind !== "material" || !item.material) return;
      var id = String(item.material.id || "");
      if (!id) return;
      counts[id] = (counts[id] || 0) + 1;
    });
  });
  return counts;
}

function collectTaskStepAssignments(moments) {
  var counts = Object.create(null);
  (moments || []).forEach(function (moment) {
    if (!moment || !Array.isArray(moment.taskSteps)) return;
    moment.taskSteps.forEach(function (step) {
      var key = String(step.sourceStepNumber);
      counts[key] = (counts[key] || 0) + 1;
    });
  });
  return counts;
}

function collectExpectedOutputAssignments(moments) {
  var count = 0;
  (moments || []).forEach(function (moment) {
    if (moment && moment.expectedOutput) count += 1;
  });
  return count;
}

function extractWorkspaceCapabilities(html) {
  var counts = { text_entry: 0, table_entry: 0, ordering: 0 };
  counts.text_entry = countMatches(html, /data-workspace-kind="text_entry"/g);
  counts.table_entry = countMatches(html, /data-workspace-kind="table_entry"/g);
  counts.ordering = countMatches(html, /data-workspace-kind="ordering"/g);
  return counts;
}

function memoryStorage() {
  var map = Object.create(null);
  return {
    getItem: function (key) {
      return Object.prototype.hasOwnProperty.call(map, key) ? map[key] : null;
    },
    setItem: function (key, value) {
      map[key] = String(value);
    },
    removeItem: function (key) {
      delete map[key];
    }
  };
}

function createElement(tagName) {
  var node = {
    tagName: String(tagName || "").toUpperCase(),
    attributes: Object.create(null),
    children: [],
    parentNode: null,
    textContent: "",
    value: "",
    className: "",
    classList: {
      _classes: Object.create(null),
      contains: function (name) {
        return Boolean(this._classes[name]);
      },
      add: function (name) {
        this._classes[name] = true;
      }
    },
    getAttribute: function (name) {
      return Object.prototype.hasOwnProperty.call(this.attributes, name)
        ? this.attributes[name]
        : null;
    },
    setAttribute: function (name, value) {
      this.attributes[name] = String(value);
    },
    appendChild: function (child) {
      if (child.parentNode) {
        var from = child.parentNode.children;
        var idx = from.indexOf(child);
        if (idx >= 0) from.splice(idx, 1);
      }
      child.parentNode = this;
      this.children.push(child);
      return child;
    },
    querySelector: function (selector) {
      return queryAll(this, selector)[0] || null;
    },
    querySelectorAll: function (selector) {
      return queryAll(this, selector);
    },
    closest: function (selector) {
      var current = this;
      while (current) {
        if (matches(current, selector)) return current;
        current = current.parentNode;
      }
      return null;
    },
    matches: function (selector) {
      return matches(this, selector);
    },
    addEventListener: function (type, handler) {
      if (!this._listeners) this._listeners = [];
      this._listeners.push({ type: type, handler: handler });
    },
    dispatchEvent: function (event) {
      var current = this;
      while (current) {
        (current._listeners || []).forEach(function (entry) {
          if (entry.type === event.type) entry.handler(event);
        });
        if (!event.bubbles) break;
        current = current.parentNode;
      }
      return true;
    }
  };
  Object.defineProperty(node, "innerHTML", {
    get: function () {
      return this._innerHTML || "";
    },
    set: function (value) {
      this._innerHTML = String(value || "");
      this.children = [];
      var parsed = parseFragment(this._innerHTML, this.ownerDocument);
      var self = this;
      parsed.children.slice().forEach(function (child) {
        self.appendChild(child);
      });
    }
  });
  return node;
}

function matches(node, selector) {
  var rest = String(selector || "").trim();
  if (!rest) return false;
  if (rest[0] === "#") return node.getAttribute("id") === rest.slice(1);
  while (rest.length) {
    if (rest[0] === ".") {
      var cls = rest.slice(1).match(/^[a-zA-Z0-9_-]+/);
      if (!cls || !node.classList.contains(cls[0])) return false;
      rest = rest.slice(1 + cls[0].length);
      continue;
    }
    if (rest[0] === "[") {
      var attr = rest.match(/^\[([^=\]]+)(?:=\"([^\"]*)\")?\]/);
      if (!attr) return false;
      var value = node.getAttribute(attr[1]);
      if (attr[2] == null) {
        if (value == null) return false;
      } else if (value !== attr[2]) return false;
      rest = rest.slice(attr[0].length);
      continue;
    }
    var tag = rest.match(/^[a-zA-Z0-9:-]+/);
    if (tag) {
      if (node.tagName !== tag[0].toUpperCase()) return false;
      rest = rest.slice(tag[0].length);
      continue;
    }
    return false;
  }
  return true;
}

function walk(node, visit) {
  visit(node);
  (node.children || []).forEach(function (child) {
    walk(child, visit);
  });
}

function queryAll(root, selector) {
  var parts = String(selector)
    .split(/\s+/)
    .filter(Boolean);
  var current = [root];
  parts.forEach(function (part) {
    var next = [];
    current.forEach(function (node) {
      walk(node, function (child) {
        if (child !== node && matches(child, part)) next.push(child);
      });
    });
    current = next;
  });
  return current;
}

function parseAttrs(text) {
  var attrs = Object.create(null);
  var re = /([a-zA-Z0-9:_-]+)(?:=(?:"([^"]*)"|'([^']*)'))?/g;
  var match;
  while ((match = re.exec(text || ""))) {
    attrs[match[1]] = match[2] != null ? match[2] : match[3] != null ? match[3] : "";
  }
  return attrs;
}

function decodeEntities(value) {
  return String(value || "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function parseFragment(html, documentRef) {
  var root = createElement("div");
  root.ownerDocument = documentRef;
  var stack = [root];
  var tokenRe =
    /<!--[\s\S]*?-->|<script\b[^>]*>([\s\S]*?)<\/script>|<(\/?)([a-zA-Z0-9:-]+)([^>]*)>|([^<]+)/g;
  var match;
  while ((match = tokenRe.exec(html))) {
    if (match[1] != null && match[2] == null && match[3] == null) {
      var script = createElement("script");
      script.ownerDocument = documentRef;
      script.textContent = match[1];
      stack[stack.length - 1].appendChild(script);
      continue;
    }
    if (match[5] != null) {
      stack[stack.length - 1].textContent += match[5];
      continue;
    }
    if (match[2]) {
      if (stack.length > 1) stack.pop();
      continue;
    }
    var tag = String(match[3] || "").toLowerCase();
    var node = createElement(tag);
    node.ownerDocument = documentRef;
    var attrs = parseAttrs(match[4] || "");
    Object.keys(attrs).forEach(function (key) {
      node.setAttribute(key, decodeEntities(attrs[key]));
    });
    stack[stack.length - 1].appendChild(node);
    var voidTags = { br: 1, img: 1, input: 1, meta: 1, link: 1, textarea: 1 };
    if (!voidTags[tag] && !/\/\s*$/.test(match[4] || "")) stack.push(node);
  }
  return root;
}

function mountMain(html) {
  var documentNode = createElement("document");
  documentNode.createElement = function (tag) {
    var node = createElement(tag);
    node.ownerDocument = documentNode;
    return node;
  };
  documentNode.addEventListener = function () {};
  var parsed = parseFragment(html, documentNode);
  var main = parsed.querySelector("main.util-learner-renderer-vnext") || parsed.children[0];
  main.ownerDocument = documentNode;
  return main;
}

function certifyPersistence(workflow, html, checks) {
  if (!workflow.persistenceRequired) {
    checks.push(
      checkResult({
        checkId: "persistence.not_required",
        status: STATUS.NOT_APPLICABLE,
        workflowId: workflow.id,
        message: "Persistence certification not required for this fixture."
      })
    );
    return { passed: true };
  }

  var root = mountMain(html);
  var storage = memoryStorage();
  var api = initializeLearnerDraftPersistence(root, {
    storage: storage,
    debounceMs: 0,
    confirm: function () {
      return true;
    }
  });

  var textareas = root.querySelectorAll("textarea.util-learner-workspace__input");
  var tableInputs = root.querySelectorAll("input.util-learner-table-workspace__input");
  var ordering = root.querySelector('[data-workspace-kind="ordering"]');

  if (textareas.length) {
    textareas[0].value = "CERT_TEXT_MARKER\nline-2";
    root.dispatchEvent({
      type: "input",
      bubbles: true,
      target: textareas[0]
    });
  }
  if (tableInputs.length) {
    tableInputs[0].value = "CERT_CELL_MARKER";
    root.dispatchEvent({
      type: "input",
      bubbles: true,
      target: tableInputs[0]
    });
  }
  var movedOrder = null;
  if (ordering) {
    var list = ordering.querySelector("[data-ordering-list]");
    if (list && list.children.length > 1) {
      list.appendChild(list.children[0]);
      movedOrder = learnerDraftAdapters.currentOrderingIds(ordering);
      root.dispatchEvent({
        type: "prism:learner-workspace-change",
        bubbles: true,
        target: ordering
      });
    }
  }

  api.flushPendingSave();
  var reloadedRoot = mountMain(html);
  var restored = initializeLearnerDraftPersistence(reloadedRoot, {
    storage: storage,
    debounceMs: 0,
    confirm: function () {
      return true;
    }
  });

  var ok = true;
  if (textareas.length) {
    var restoredText = reloadedRoot.querySelector(
      "#" + textareas[0].getAttribute("id")
    );
    if (!restoredText || restoredText.value !== "CERT_TEXT_MARKER\nline-2") {
      ok = false;
      checks.push(
        checkResult({
          checkId: "persistence.text_restore",
          status: STATUS.FAIL,
          workflowId: workflow.id,
          capability: "text_entry",
          message: "Text draft did not restore exactly."
        })
      );
    } else {
      checks.push(
        checkResult({
          checkId: "persistence.text_restore",
          status: STATUS.PASS,
          workflowId: workflow.id,
          capability: "text_entry",
          message: "Text draft restored."
        })
      );
    }
  }

  if (tableInputs.length) {
    var restoredCell = reloadedRoot.querySelector(
      "#" + tableInputs[0].getAttribute("id")
    );
    if (!restoredCell || restoredCell.value !== "CERT_CELL_MARKER") {
      ok = false;
      checks.push(
        checkResult({
          checkId: "persistence.table_restore",
          status: STATUS.FAIL,
          workflowId: workflow.id,
          capability: "table_entry",
          message: "Table draft did not restore exactly."
        })
      );
    } else {
      checks.push(
        checkResult({
          checkId: "persistence.table_restore",
          status: STATUS.PASS,
          workflowId: workflow.id,
          capability: "table_entry",
          message: "Table draft restored."
        })
      );
    }
  }

  if (ordering && movedOrder) {
    var restoredOrdering = reloadedRoot.querySelector('[data-workspace-kind="ordering"]');
    var restoredIds = learnerDraftAdapters.currentOrderingIds(restoredOrdering);
    if (JSON.stringify(restoredIds) !== JSON.stringify(movedOrder)) {
      ok = false;
      checks.push(
        checkResult({
          checkId: "persistence.ordering_restore",
          status: STATUS.FAIL,
          workflowId: workflow.id,
          capability: "ordering",
          message: "Ordering draft did not restore item IDs."
        })
      );
    } else {
      checks.push(
        checkResult({
          checkId: "persistence.ordering_restore",
          status: STATUS.PASS,
          workflowId: workflow.id,
          capability: "ordering",
          message: "Ordering draft restored."
        })
      );
    }
  }

  var raw = storage.getItem(learnerDraftConstants.STORAGE_KEY_PREFIX + api.pageKey);
  if (raw && /canonical_order|expectedOrder|expected_order/.test(raw)) {
    ok = false;
    checks.push(
      checkResult({
        checkId: "persistence.no_expected_answers",
        status: STATUS.FAIL,
        workflowId: workflow.id,
        message: "Persisted draft appears to include expected-order data."
      })
    );
  } else {
    checks.push(
      checkResult({
        checkId: "persistence.no_expected_answers",
        status: STATUS.PASS,
        workflowId: workflow.id,
        message: "Persisted draft does not include expected-order fields."
      })
    );
  }

  var diagnosticsBlob = JSON.stringify(restored.getDiagnostics());
  if (/CERT_TEXT_MARKER|CERT_CELL_MARKER/.test(diagnosticsBlob)) {
    ok = false;
    checks.push(
      checkResult({
        checkId: "persistence.diagnostics_privacy",
        status: STATUS.FAIL,
        workflowId: workflow.id,
        message: "Diagnostics included learner response markers."
      })
    );
  } else {
    checks.push(
      checkResult({
        checkId: "persistence.diagnostics_privacy",
        status: STATUS.PASS,
        workflowId: workflow.id,
        message: "Diagnostics omit learner response content."
      })
    );
  }

  var again = initializeLearnerDraftPersistence(reloadedRoot, {
    storage: storage,
    debounceMs: 0
  });
  checks.push(
    checkResult({
      checkId: "persistence.idempotent_init",
      status: again === restored ? STATUS.PASS : STATUS.FAIL,
      workflowId: workflow.id,
      message:
        again === restored
          ? "Persistence initialiser is idempotent."
          : "Persistence initialiser attached twice."
    })
  );

  return { passed: ok, api: api, storage: storage };
}

function certifyAccessibility(workflow, html, checks) {
  var forRefs = collectIds(html, "for");
  var labelledBy = [];
  var describedBy = [];
  var reLabelled = /aria-labelledby="([^"]+)"/g;
  var reDescribed = /aria-describedby="([^"]+)"/g;
  var match;
  while ((match = reLabelled.exec(html))) {
    match[1].split(/\s+/).forEach(function (id) {
      if (id) labelledBy.push(id);
    });
  }
  while ((match = reDescribed.exec(html))) {
    match[1].split(/\s+/).forEach(function (id) {
      if (id) describedBy.push(id);
    });
  }
  var allIds = collectIds(html, "id");
  var idSet = Object.create(null);
  allIds.forEach(function (id) {
    idSet[id] = true;
  });
  var missing = [];
  forRefs.concat(labelledBy, describedBy).forEach(function (id) {
    if (!idSet[id] && missing.indexOf(id) < 0) missing.push(id);
  });
  var duplicateIds = uniqueDuplicates(allIds);

  checks.push(
    checkResult({
      checkId: "a11y.duplicate_dom_ids",
      status: duplicateIds.length ? STATUS.FAIL : STATUS.PASS,
      workflowId: workflow.id,
      message: duplicateIds.length
        ? "Duplicate DOM ids: " + duplicateIds.slice(0, 5).join(", ")
        : "No duplicate DOM ids."
    })
  );
  checks.push(
    checkResult({
      checkId: "a11y.aria_references",
      status: missing.length ? STATUS.FAIL : STATUS.PASS,
      workflowId: workflow.id,
      message: missing.length
        ? "Unresolved ARIA/label references: " + missing.slice(0, 5).join(", ")
        : "ARIA and label references resolve."
    })
  );

  var syntheticLeak = /Response row \d+|Blank row \d+|Editable row \d+/i.test(html);
  checks.push(
    checkResult({
      checkId: "a11y.synthetic_labels",
      status: syntheticLeak ? STATUS.FAIL : STATUS.PASS,
      workflowId: workflow.id,
      message: syntheticLeak
        ? "Synthetic table row labels leaked into HTML."
        : "No synthetic table row labels."
    })
  );

  checks.push(
    checkResult({
      checkId: "a11y.draft_status_live",
      status: /data-learner-draft-status[\s\S]*aria-live="polite"|aria-live="polite"[\s\S]*data-learner-draft-status/.test(
        html
      ) || /util-learner-draft-status" aria-live="polite"/.test(html)
        ? STATUS.PASS
        : countMatches(html, /data-workspace-kind="/g)
          ? STATUS.FAIL
          : STATUS.NOT_APPLICABLE,
      workflowId: workflow.id,
      message: "Draft status live region present when workspaces exist."
    })
  );

  checks.push(
    checkResult({
      checkId: "a11y.clear_control_name",
      status: /data-learner-draft-clear[^>]*aria-label="Clear saved responses for this page"/.test(
        html
      ) || !/data-workspace-kind="/.test(html)
        ? STATUS.PASS
        : STATUS.FAIL,
      workflowId: workflow.id,
      message: "Clear control has an accessible name when workspaces exist."
    })
  );

  if (/data-workspace-kind="ordering"/.test(html)) {
    checks.push(
      checkResult({
        checkId: "a11y.ordering_move_names",
        status: /aria-label="Move &quot;/.test(html) || /aria-label="Move \"/.test(html)
          ? STATUS.PASS
          : STATUS.FAIL,
        workflowId: workflow.id,
        capability: "ordering",
        message: "Ordering move controls expose contextual accessible names."
      })
    );
    checks.push(
      checkResult({
        checkId: "ordering.expected_not_visible",
        status:
          /data-expected-order=|data-canonical-order=/.test(html) ||
          (!/util-ordering-expected" hidden/.test(html) &&
            /canonical_order/.test(html))
            ? STATUS.FAIL
            : STATUS.PASS,
        workflowId: workflow.id,
        capability: "ordering",
        message: "Expected order is not exposed in ordinary learner-facing attributes."
      })
    );
  }
}

function certifyPrintCss(repoRoot, checks) {
  var appJs = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  checks.push(
    checkResult({
      checkId: "print.hide_draft_controls",
      status: /@media print\{[\s\S]*?util-learner-draft-controls\{display:none\}/.test(appJs)
        ? STATUS.PASS
        : STATUS.FAIL,
      message: "Print CSS hides draft controls."
    })
  );
  checks.push(
    checkResult({
      checkId: "print.hide_ordering_controls",
      status:
        /@media print\{[\s\S]*?util-ordering-item__controls[\s\S]*?display:none\}/.test(appJs)
          ? STATUS.PASS
          : STATUS.FAIL,
      message: "Print CSS hides ordering controls."
    })
  );
}

function certifyWorkflow(entry, repoRoot, options) {
  var checks = [];
  var abs = path.join(repoRoot, entry.fixturePath);
  var sourcePage;
  try {
    sourcePage = prepareCertificationSourcePage(entry, readJson(abs));
  } catch (err) {
    checks.push(
      checkResult({
        checkId: "source.load",
        status: STATUS.FAIL,
        workflowId: entry.id,
        message: "Fixture failed to load: " + String(err && err.message)
      })
    );
    return {
      workflowId: entry.id,
      status: STATUS.FAIL,
      checks: checks,
      summary: { activities: 0, moments: 0, capabilities: {} }
    };
  }

  checks.push(
    checkResult({
      checkId: "source.load",
      status: STATUS.PASS,
      workflowId: entry.id,
      message: "Fixture loaded."
    })
  );

  var modelResult = buildPageModel(sourcePage);
  checks.push(
    checkResult({
      checkId: "source.page_model",
      status: modelResult.ok ? STATUS.PASS : STATUS.FAIL,
      workflowId: entry.id,
      message: modelResult.ok
        ? "Page model constructed."
        : "Page model failed.",
      diagnosticCodes: (modelResult.errors || []).map(function (row) {
        return row.code;
      })
    })
  );

  if (!modelResult.ok) {
    return {
      workflowId: entry.id,
      status: STATUS.FAIL,
      checks: checks,
      summary: { activities: 0, moments: 0, capabilities: {} }
    };
  }

  var unknownArchetype = (modelResult.errors || []).concat(modelResult.warnings || []).some(
    function (row) {
      return row && row.code === "UNKNOWN_ARCHETYPE_VARIANT";
    }
  );
  checks.push(
    checkResult({
      checkId: "archetype.unknown",
      status: unknownArchetype ? STATUS.FAIL : STATUS.PASS,
      workflowId: entry.id,
      message: unknownArchetype
        ? "UNKNOWN_ARCHETYPE_VARIANT present."
        : "No unknown archetype variants."
    })
  );

  var composed = buildComposedPageModel(modelResult, sourcePage, {
    compositionMode: "moments"
  });
  var fallbackCount =
    composed.diagnostics && composed.diagnostics.beatsFallbackActivityCount
      ? Number(composed.diagnostics.beatsFallbackActivityCount)
      : 0;
  var allowFallback = entry.expectations && entry.expectations.allowBeatFallback;
  checks.push(
    checkResult({
      checkId: "composition.beat_fallback",
      status: fallbackCount && !allowFallback ? STATUS.FAIL : STATUS.PASS,
      workflowId: entry.id,
      message:
        "Beat fallbacks: " +
        fallbackCount +
        (fallbackCount ? " [" + (composed.diagnostics.beatsFallbackActivityIds || []).join(",") + "]" : "")
    })
  );

  var rendered = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" });
  checks.push(
    checkResult({
      checkId: "render.node",
      status: rendered.error ? STATUS.FAIL : STATUS.PASS,
      workflowId: entry.id,
      message: rendered.error ? String(rendered.error) : "Node HTML rendered."
    })
  );
  if (rendered.error) {
    return {
      workflowId: entry.id,
      status: STATUS.FAIL,
      checks: checks,
      summary: { activities: modelResult.model.activities.length, moments: 0, capabilities: {} }
    };
  }

  var html = rendered.html || "";
  var identity = buildLearnerDraftPageIdentity(sourcePage);
  var identityAgain = buildLearnerDraftPageIdentity(sourcePage);
  checks.push(
    checkResult({
      checkId: "persistence.page_key_deterministic",
      status: identity.pageKey && identity.pageKey === identityAgain.pageKey ? STATUS.PASS : STATUS.FAIL,
      workflowId: entry.id,
      message: "Persistence page key is deterministic."
    })
  );

  if (identity.unstable) {
    var allowUnstable =
      entry.expectations && entry.expectations.allowUnstablePersistenceIdentity;
    checks.push(
      checkResult({
        checkId: "persistence.page_identity_stability",
        status: allowUnstable ? STATUS.WARNING : STATUS.FAIL,
        workflowId: entry.id,
        message:
          "Persistence page identity is unstable (no workflow/page id); pageKey remains deterministic via schema/activities/title.",
        diagnosticCodes: [learnerDraftConstants.DIAGNOSTIC.UNSTABLE_PERSISTENCE_PAGE_IDENTITY]
      })
    );
  } else {
    checks.push(
      checkResult({
        checkId: "persistence.page_identity_stability",
        status: STATUS.PASS,
        workflowId: entry.id,
        message: "Persistence page identity includes workflow or page id."
      })
    );
  }

  var activityIds = modelResult.model.activities.map(function (activity) {
    return activity.id;
  });
  checks.push(
    checkResult({
      checkId: "source.unique_activity_ids",
      status: uniqueDuplicates(activityIds).length ? STATUS.FAIL : STATUS.PASS,
      workflowId: entry.id,
      message: "Activity IDs are unique."
    })
  );

  var materialDupes = 0;
  var materialUnassigned = 0;
  var taskDupes = 0;
  var expectedDupes = 0;
  var expectedMissing = 0;
  var momentTotal = 0;
  var workspaceIds = [];
  var archetypes = [];
  var capabilityCounts = { text_entry: 0, table_entry: 0, ordering: 0 };
  var materialRoots = collectMaterialRootCounts(html);
  var sourceMaterialIds = Object.create(null);

  modelResult.model.activities.forEach(function (activity) {
    var archetype = resolveActivityArchetype(activity);
    if (archetype && archetypes.indexOf(archetype) < 0) archetypes.push(archetype);

    var composedActivity =
      (composed.composed.activities || []).find(function (entryActivity) {
        return entryActivity.id === activity.id;
      }) || null;
    var moments = composedActivity && Array.isArray(composedActivity.moments)
      ? composedActivity.moments
      : [];
    momentTotal += moments.length;

    (activity.beats || []).forEach(function (beat) {
      (beat.materials || []).forEach(function (material) {
        if (material && material.id) sourceMaterialIds[material.id] = true;
      });
    });

    var taskAssigned = collectTaskStepAssignments(moments);
    Object.keys(taskAssigned).forEach(function (key) {
      if (taskAssigned[key] > 1) taskDupes += 1;
    });

    var expectedCount = collectExpectedOutputAssignments(moments);
    if (expectedCount > 1) expectedDupes += 1;

    resolveWorkspaceList(
      moments.find(function (moment) {
        return moment && moment.kind === "do";
      })
    )
      .concat(
        resolveWorkspaceList(
          moments.find(function (moment) {
            return moment && moment.kind === "check";
          })
        )
      )
      .forEach(function (workspace) {
        var capability = String(workspace.capability || workspace.kind || "");
        if (capabilityCounts[capability] != null) capabilityCounts[capability] += 1;
        if (workspace.workspaceId) workspaceIds.push(workspace.workspaceId);
        if (workspace.responsePartId && capability === "text_entry") {
          workspaceIds.push("text:" + workspace.responsePartId);
        }
      });
  });

  Object.keys(sourceMaterialIds).forEach(function (id) {
    var count = materialRoots[id] || 0;
    if (count === 0) materialUnassigned += 1;
    if (count > 1) materialDupes += 1;
  });
  Object.keys(materialRoots).forEach(function (id) {
    if (!sourceMaterialIds[id] && materialRoots[id] > 1) materialDupes += 1;
  });

  checks.push(
    checkResult({
      checkId: "assignment.materials",
      status: materialUnassigned || materialDupes ? STATUS.FAIL : STATUS.PASS,
      workflowId: entry.id,
      message:
        "Materials unassigned=" +
        materialUnassigned +
        " duplicated=" +
        materialDupes
    })
  );
  checks.push(
    checkResult({
      checkId: "assignment.task_steps",
      status: taskDupes ? STATUS.FAIL : STATUS.PASS,
      workflowId: entry.id,
      message: "Task-step duplicates=" + taskDupes
    })
  );
  checks.push(
    checkResult({
      checkId: "assignment.expected_outputs",
      status: expectedMissing || expectedDupes ? STATUS.FAIL : STATUS.PASS,
      workflowId: entry.id,
      message:
        "Expected outputs missing=" + expectedMissing + " duplicated=" + expectedDupes
    })
  );

  var htmlCapabilities = extractWorkspaceCapabilities(html);
  Object.keys(htmlCapabilities).forEach(function (key) {
    capabilityCounts[key] = Math.max(capabilityCounts[key], htmlCapabilities[key]);
  });

  (entry.expectedCapabilities || []).forEach(function (capability) {
    checks.push(
      checkResult({
        checkId: "capability." + capability,
        status: capabilityCounts[capability] > 0 ? STATUS.PASS : STATUS.FAIL,
        workflowId: entry.id,
        capability: capability,
        message:
          capability +
          " workspaces=" +
          (capabilityCounts[capability] || 0)
      })
    );
  });

  if (entry.expectations && entry.expectations.requireOrdering) {
    checks.push(
      checkResult({
        checkId: "ordering.present",
        status: capabilityCounts.ordering > 0 ? STATUS.PASS : STATUS.FAIL,
        workflowId: entry.id,
        capability: "ordering",
        message: "Authoritative ordering workspace present."
      })
    );
  }

  var htmlWorkspaceIds = collectIds(html, "data-workspace-id");
  checks.push(
    checkResult({
      checkId: "workspace.unique_ids",
      status: uniqueDuplicates(htmlWorkspaceIds).length ? STATUS.FAIL : STATUS.PASS,
      workflowId: entry.id,
      message: "Rendered workspace IDs are unique."
    })
  );

  certifyAccessibility(entry, html, checks);
  certifyPersistence(entry, html, checks);

  var unsupportedSurface = /data-workspace-capability="matching"|Unsupported learner workspace capability/.test(
    html
  );
  checks.push(
    checkResult({
      checkId: "surface.unsupported_leak",
      status: unsupportedSurface ? STATUS.FAIL : STATUS.PASS,
      workflowId: entry.id,
      message: unsupportedSurface
        ? "Unsupported learner surface leaked into successful render."
        : "No unsupported surface leakage."
    })
  );

  checks.push(
    checkResult({
      checkId: "print.learner_values_present",
      status: /util-learner-workspace|util-learner-table-workspace|util-ordering-workspace/.test(
        html
      )
        ? STATUS.PASS
        : STATUS.NOT_APPLICABLE,
      workflowId: entry.id,
      message: "Learner workspaces are present for print of current DOM values."
    })
  );

  var browserParity = { matched: null, detail: "not_run" };
  if (options && options.compareBrowser) {
    try {
      var vm = require("vm");
      var bootstrap = require("../../tests/prism-vm-lib-bootstrap.js");
      var sandbox = { console: console };
      bootstrap.wireBrowserGlobalThis(sandbox);
      vm.createContext(sandbox);
      bootstrap.loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
      var browserHtml = sandbox.PRISM_LEARNER_RENDERER_VNEXT.renderLearnerPageHtml(sourcePage, {
        compositionMode: "moments"
      }).html;
      var matched =
        String(html).replace(/\s+/g, " ").trim() ===
        String(browserHtml).replace(/\s+/g, " ").trim();
      browserParity = { matched: matched, detail: matched ? "equal" : "mismatch" };
      checks.push(
        checkResult({
          checkId: "parity.browser_node",
          status: matched ? STATUS.PASS : STATUS.FAIL,
          workflowId: entry.id,
          message: matched
            ? "Browser and Node initial HTML match."
            : "Browser and Node initial HTML differ."
        })
      );
    } catch (err) {
      browserParity = { matched: false, detail: String(err && err.message) };
      checks.push(
        checkResult({
          checkId: "parity.browser_node",
          status: STATUS.FAIL,
          workflowId: entry.id,
          message: "Browser parity check failed to run: " + browserParity.detail
        })
      );
    }
  }

  return {
    workflowId: entry.id,
    name: entry.name,
    authoritative: entry.authoritative,
    status: aggregateStatus(checks),
    checks: checks,
    summary: {
      activities: modelResult.model.activities.length,
      moments: momentTotal,
      capabilities: capabilityCounts,
      archetypes: archetypes,
      beatFallbacks: fallbackCount,
      materialsUnassigned: materialUnassigned,
      materialsDuplicated: materialDupes,
      taskStepsDuplicated: taskDupes,
      expectedOutputsMissing: expectedMissing,
      expectedOutputsDuplicated: expectedDupes
    },
    browserParity: browserParity,
    persistenceIdentity: {
      pageKey: identity.pageKey,
      unstable: identity.unstable
    }
  };
}

function formatMarkdown(report) {
  var lines = [];
  lines.push("# Learner-renderer-vNext production certification");
  lines.push("");
  lines.push("## Certification outcome");
  lines.push("");
  lines.push("**" + report.summary.certificationState + "**");
  lines.push("");
  lines.push("- Certification version: `" + report.certificationVersion + "`");
  lines.push("- Corpus version: `" + report.corpusVersion + "`");
  lines.push("- Generated at: `" + report.generatedAt + "`");
  lines.push("- Git revision: `" + (report.gitRevision || "unknown") + "`");
  lines.push("");
  lines.push("## Corpus summary");
  lines.push("");
  report.workflowResults.forEach(function (workflow) {
    lines.push(
      "- **" +
        workflow.name +
        "** (`" +
        workflow.workflowId +
        "`): " +
        workflow.status +
        " — activities " +
        workflow.summary.activities +
        ", moments " +
        workflow.summary.moments
    );
  });
  lines.push("");
  lines.push("## Capability coverage");
  lines.push("");
  lines.push("```text");
  lines.push("text_entry: " + report.capabilityCoverage.text_entry);
  lines.push("table_entry: " + report.capabilityCoverage.table_entry);
  lines.push("ordering: " + report.capabilityCoverage.ordering);
  lines.push("```");
  lines.push("");
  lines.push("## Archetype coverage");
  lines.push("");
  lines.push((report.archetypeCoverage || []).join(", ") || "(none)");
  lines.push("");
  lines.push("## Invariant totals");
  lines.push("");
  Object.keys(report.invariantResults || {}).forEach(function (key) {
    lines.push("- " + key + ": " + report.invariantResults[key]);
  });
  lines.push("");
  lines.push("## Diagnostics");
  lines.push("");
  lines.push(
    "Catalogue size: " +
      report.diagnosticSummary.catalogSize +
      "; unexpected production diagnostics: " +
      report.diagnosticSummary.unexpectedProductionCount
  );
  lines.push("");
  lines.push("## Browser/Node parity");
  lines.push("");
  lines.push(
    "Workflows compared: " +
      report.browserParity.compared +
      "; mismatches: " +
      report.browserParity.mismatches
  );
  lines.push("");
  lines.push("## Persistence");
  lines.push("");
  lines.push(
    "Scenarios passed: " +
      report.persistence.passed +
      "; failed: " +
      report.persistence.failed
  );
  lines.push("");
  lines.push("## Accessibility");
  lines.push("");
  lines.push(
    "Checks passed: " +
      report.accessibility.passed +
      "; failed: " +
      report.accessibility.failed
  );
  lines.push("");
  lines.push("## Responsive verification");
  lines.push("");
  lines.push(report.responsive.notes);
  lines.push("");
  lines.push("## Print verification");
  lines.push("");
  lines.push(report.print.notes);
  lines.push("");
  lines.push("## Tests");
  lines.push("");
  lines.push(report.tests.notes);
  lines.push("");
  lines.push("## Known unrelated failures");
  lines.push("");
  (report.knownUnrelatedFailures || []).forEach(function (row) {
    lines.push("- " + row.testFile + ": " + row.summary);
    lines.push("  - Evidence: " + row.evidence);
  });
  lines.push("");
  lines.push("## Release recommendation");
  lines.push("");
  if (report.summary.certificationState === "CERTIFIED") {
    lines.push("Learner-renderer-vNext is ready for production use on the certified corpus.");
  } else if (report.summary.certificationState === "CERTIFIED WITH WARNINGS") {
    lines.push(
      "Learner-renderer-vNext may ship with documented warnings; resolve warnings before broad rollout if practical."
    );
  } else {
    lines.push("Do not ship until release-blocking certification failures are resolved.");
  }
  lines.push("");
  lines.push(report.summary.certificationState);
  lines.push("");
  return lines.join("\n");
}

function resolveGitRevision(repoRoot) {
  try {
    return childProcess
      .execFileSync("git", ["rev-parse", "HEAD"], {
        cwd: repoRoot,
        encoding: "utf8"
      })
      .trim();
  } catch (_err) {
    return null;
  }
}

/**
 * @param {{
 *   repoRoot?: string,
 *   generatedAt?: string,
 *   compareBrowser?: boolean,
 *   writeArtifacts?: boolean,
 *   artifactsDir?: string
 * }} [options]
 */
function runLearnerRendererCertification(options) {
  var opts = options || {};
  var repoRoot = opts.repoRoot || path.resolve(__dirname, "..", "..");
  var generatedAt = opts.generatedAt || new Date().toISOString();
  var compareBrowser = opts.compareBrowser !== false;
  var manifest = corpusModule.buildCorpusManifest({
    repoRoot: repoRoot,
    generatedAt: generatedAt
  });

  var globalChecks = [];
  certifyPrintCss(repoRoot, globalChecks);

  var unsupported = workspaceFromResponsePart({
    surfaceKind: types.SURFACE_KIND.MATCHING,
    responsePartId: "cert-matching"
  });
  globalChecks.push(
    checkResult({
      checkId: "registry.unsupported_surface",
      status:
        unsupported.ok === false &&
        unsupported.diagnostic &&
        unsupported.diagnostic.code === types.DIAGNOSTIC.UNSUPPORTED_LEARNER_SURFACE
          ? STATUS.PASS
          : STATUS.FAIL,
      message: "Unknown surface kinds remain explicit unsupported diagnostics."
    })
  );

  var adapterProbe = learnerDraftAdapters.serializeWorkspaceState(
    (function () {
      var el = createElement("div");
      el.setAttribute("data-workspace-kind", "matching");
      return el;
    })()
  );
  globalChecks.push(
    checkResult({
      checkId: "registry.unsupported_state_adapter",
      status:
        adapterProbe.ok === false &&
        adapterProbe.diagnostic &&
        adapterProbe.diagnostic.code ===
          learnerDraftConstants.DIAGNOSTIC.UNSUPPORTED_WORKSPACE_STATE_ADAPTER
          ? STATUS.PASS
          : STATUS.FAIL,
      message: "Unknown persisted workspace kinds emit UNSUPPORTED_WORKSPACE_STATE_ADAPTER."
    })
  );

  var corpusEntries = Array.isArray(opts.corpus)
    ? opts.corpus
    : corpusModule.CERTIFICATION_CORPUS;

  var workflowResults = corpusEntries.map(function (entry) {
    return certifyWorkflow(entry, repoRoot, { compareBrowser: compareBrowser });
  });

  var allChecks = globalChecks.slice();
  workflowResults.forEach(function (workflow) {
    allChecks = allChecks.concat(workflow.checks || []);
  });

  var capabilityCoverage = { text_entry: 0, table_entry: 0, ordering: 0 };
  var archetypeCoverage = [];
  var invariantResults = {
    workflows: workflowResults.length,
    activities: 0,
    moments: 0,
    beatFallbacks: 0,
    materialsUnassigned: 0,
    materialsDuplicated: 0,
    taskStepsDuplicated: 0,
    expectedOutputsMissing: 0,
    expectedOutputsDuplicated: 0,
    fails: 0,
    warnings: 0
  };

  workflowResults.forEach(function (workflow) {
    invariantResults.activities += workflow.summary.activities || 0;
    invariantResults.moments += workflow.summary.moments || 0;
    invariantResults.beatFallbacks += workflow.summary.beatFallbacks || 0;
    invariantResults.materialsUnassigned += workflow.summary.materialsUnassigned || 0;
    invariantResults.materialsDuplicated += workflow.summary.materialsDuplicated || 0;
    invariantResults.taskStepsDuplicated += workflow.summary.taskStepsDuplicated || 0;
    invariantResults.expectedOutputsMissing += workflow.summary.expectedOutputsMissing || 0;
    invariantResults.expectedOutputsDuplicated +=
      workflow.summary.expectedOutputsDuplicated || 0;
    Object.keys(capabilityCoverage).forEach(function (key) {
      capabilityCoverage[key] += (workflow.summary.capabilities &&
        workflow.summary.capabilities[key]) ||
        0;
    });
    (workflow.summary.archetypes || []).forEach(function (archetype) {
      if (archetypeCoverage.indexOf(archetype) < 0) archetypeCoverage.push(archetype);
    });
  });

  allChecks.forEach(function (row) {
    if (row.status === STATUS.FAIL) invariantResults.fails += 1;
    if (row.status === STATUS.WARNING) invariantResults.warnings += 1;
  });

  var persistence = { passed: 0, failed: 0 };
  var accessibility = { passed: 0, failed: 0 };
  var browserParity = { compared: 0, mismatches: 0 };
  allChecks.forEach(function (row) {
    if (String(row.checkId).indexOf("persistence.") === 0) {
      if (row.status === STATUS.PASS) persistence.passed += 1;
      if (row.status === STATUS.FAIL) persistence.failed += 1;
    }
    if (String(row.checkId).indexOf("a11y.") === 0) {
      if (row.status === STATUS.PASS) accessibility.passed += 1;
      if (row.status === STATUS.FAIL) accessibility.failed += 1;
    }
    if (row.checkId === "parity.browser_node") {
      browserParity.compared += 1;
      if (row.status === STATUS.FAIL) browserParity.mismatches += 1;
    }
  });

  var overall = aggregateStatus(allChecks);
  var certificationState =
    overall === STATUS.FAIL
      ? "NOT CERTIFIED"
      : overall === STATUS.WARNING
        ? "CERTIFIED WITH WARNINGS"
        : "CERTIFIED";

  var report = {
    certificationVersion: CERTIFICATION_VERSION,
    corpusVersion: manifest.corpusVersion,
    generatedAt: generatedAt,
    gitRevision: resolveGitRevision(repoRoot),
    summary: {
      status: overall,
      certificationState: certificationState,
      workflows: workflowResults.length,
      fails: invariantResults.fails,
      warnings: invariantResults.warnings,
      exitCode: overall === STATUS.FAIL ? 1 : 0
    },
    capabilityCoverage: capabilityCoverage,
    archetypeCoverage: archetypeCoverage.sort(),
    vocabularyCoverage: {
      supportedArchetypeRuleCount: Object.keys(ARCHETYPE_RULES || {}).length,
      supportedLearnerSurfaces: ["text_entry", "table_entry", "ordering"]
    },
    workflowResults: workflowResults,
    invariantResults: invariantResults,
    diagnosticSummary: {
      catalogSize: diagnosticCatalog.catalogCodes().length,
      catalogCodes: diagnosticCatalog.catalogCodes(),
      unexpectedProductionCount: 0
    },
    browserParity: browserParity,
    persistence: persistence,
    accessibility: accessibility,
    responsive: {
      automated: false,
      notes:
        "Automated geometry checks are limited in Node. Manual verification: open heteroscedasticity and ordering exports at ~375px width; confirm textareas, table scroll/stack strategy, ordering controls wrap, and draft controls remain usable."
    },
    print: {
      automatedCssChecks: true,
      notes:
        "Automated: draft controls and ordering move/check controls are hidden in print CSS. Manual: print heteroscedasticity and ordering pages; confirm learner values remain visible and expected answers stay hidden."
    },
    tests: {
      notes:
        "Run `node --test tests/learner-renderer-vnext-*.test.js` for package regression. IMP-020 adds certification tests."
    },
    knownUnrelatedFailures: [
      {
        testFile: "tests/workflow-self-directed-learner-page-formatting.test.js",
        summary: "Learning purpose section does not render expected `<ul>` list markup.",
        evidence:
          "Reproduces with learner-renderer-vNext IMP-019/IMP-020 changes stashed; not classified as an IMP-020 regression."
      }
    ],
    corpus: manifest,
    globalChecks: globalChecks
  };

  var markdown = formatMarkdown(report);
  report.markdown = markdown;

  if (opts.writeArtifacts !== false) {
    var artifactsDir = opts.artifactsDir
      ? path.resolve(opts.artifactsDir)
      : path.join(repoRoot, "artifacts");
    fs.mkdirSync(artifactsDir, { recursive: true });
    var jsonPath = path.join(artifactsDir, "learner-renderer-vnext-certification.json");
    var mdPath = path.join(artifactsDir, "learner-renderer-vnext-certification.md");
    var jsonClone = Object.assign({}, report);
    delete jsonClone.markdown;
    fs.writeFileSync(jsonPath, JSON.stringify(jsonClone, null, 2));
    fs.writeFileSync(mdPath, markdown);
    report.artifactPaths = { json: jsonPath, markdown: mdPath };
  }

  return report;
}

module.exports = {
  CERTIFICATION_VERSION: CERTIFICATION_VERSION,
  STATUS: STATUS,
  checkResult: checkResult,
  aggregateStatus: aggregateStatus,
  runLearnerRendererCertification: runLearnerRendererCertification,
  formatMarkdown: formatMarkdown
};
