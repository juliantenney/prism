"use strict";

/**
 * Normalise authoritative PRISM ordering / ranking schemas into one internal model.
 *
 * Observed production variants (Sprint 65 sequencing policy + Sprint 59 audits):
 * - activity_interaction_type: "sequencing" | "ranking"
 * - ordering.canonical_order / learner_display_order / shuffle_seed_key
 * - upstream aliases: correct_order, canonical_order, sequence_items, ranking_items
 */

var ORDERING_INTERACTION_TYPES = Object.freeze({
  sequencing: "sequence",
  ranking: "rank",
  sequence: "sequence",
  rank: "rank",
  priority: "priority",
  chronology: "chronology"
});

var EXPLICIT_REORDER_RE =
  /\b(put (?:these|the|them) in order|arrange|reorder|rearrange|sequence the|rank(?:ing)?|prioriti[sz]e|earliest to latest|first to last|most to least|highest to lowest|lowest to highest|drag into order|order the (?:following|events|stages|steps|items))\b/i;

function computeStableSeed(parts) {
  var rows = Array.isArray(parts) ? parts : [parts];
  var text = rows
    .map(function (part) {
      if (part == null) return "";
      if (typeof part === "string" || typeof part === "number" || typeof part === "boolean") {
        return String(part);
      }
      try {
        return JSON.stringify(part);
      } catch (_err) {
        return String(part);
      }
    })
    .join("|");
  var hash = 2166136261;
  for (var i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function deterministicShuffle(items, seed) {
  var list = Array.isArray(items) ? items.slice() : [];
  if (list.length <= 1) return list;
  var state =
    typeof seed === "number" && Number.isFinite(seed) ? seed >>> 0 : computeStableSeed([seed]);
  if (!state) state = 1;
  function nextRand() {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  }
  for (var i = list.length - 1; i > 0; i -= 1) {
    var j = Math.floor(nextRand() * (i + 1));
    var tmp = list[i];
    list[i] = list[j];
    list[j] = tmp;
  }
  return list;
}

function firstNonEmpty(values) {
  for (var i = 0; i < values.length; i += 1) {
    var value = values[i];
    if (value == null) continue;
    var text = String(value).trim();
    if (text) return text;
  }
  return "";
}

function slugify(value) {
  return (
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
  );
}

/**
 * @param {*} entry
 * @param {number} index
 * @returns {{ itemId: string, content: string, authoredIndex: number, accessibleLabel: string }|null}
 */
function normalizeOrderingItem(entry, index) {
  if (entry == null) return null;
  if (typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean") {
    var content = String(entry).trim();
    if (!content) return null;
    var itemId = "item-" + String(index + 1) + "-" + slugify(content).slice(0, 40);
    return {
      itemId: itemId,
      content: content,
      authoredIndex: index,
      accessibleLabel: content
    };
  }
  if (typeof entry !== "object" || Array.isArray(entry)) return null;
  var contentText = firstNonEmpty([
    entry.content,
    entry.title,
    entry.label,
    entry.text,
    entry.name,
    entry.instruction,
    entry.value,
    entry.prompt
  ]);
  if (!contentText) return null;
  var itemId = firstNonEmpty([
    entry.item_id,
    entry.itemId,
    entry.event_id,
    entry.eventId,
    entry.id
  ]);
  if (!itemId) {
    itemId = "item-" + String(index + 1) + "-" + slugify(contentText).slice(0, 40);
  }
  return {
    itemId: String(itemId),
    content: contentText,
    authoredIndex: index,
    accessibleLabel: contentText
  };
}

function normalizeOrderList(value) {
  var out = [];
  (Array.isArray(value) ? value : []).forEach(function (entry, index) {
    var item = normalizeOrderingItem(entry, index);
    if (!item) return;
    out.push(item);
  });
  return out;
}

function resolveInteractionMode(source) {
  var explicit = String(
    (source && (source.activity_interaction_type || source.activityInteractionType)) || ""
  )
    .trim()
    .toLowerCase();
  if (ORDERING_INTERACTION_TYPES[explicit]) return ORDERING_INTERACTION_TYPES[explicit];

  var ordering = source && source.ordering;
  var mode = String((ordering && ordering.mode) || "").trim().toLowerCase();
  if (ORDERING_INTERACTION_TYPES[mode]) return ORDERING_INTERACTION_TYPES[mode];

  return "";
}

function extractCanonicalRaw(source) {
  if (!source || typeof source !== "object") return [];
  var ordering = source.ordering;
  if (ordering && typeof ordering === "object" && !Array.isArray(ordering)) {
    if (Array.isArray(ordering.canonical_order) && ordering.canonical_order.length) {
      return ordering.canonical_order;
    }
    if (Array.isArray(ordering.expected_order) && ordering.expected_order.length) {
      return ordering.expected_order;
    }
  }
  var aliases = [source.canonical_order, source.correct_order, source.expected_order];
  for (var i = 0; i < aliases.length; i += 1) {
    if (Array.isArray(aliases[i]) && aliases[i].length) return aliases[i];
  }
  return [];
}

function extractCandidateRaw(source) {
  if (!source || typeof source !== "object") return [];
  var ordering = source.ordering;
  if (ordering && typeof ordering === "object" && !Array.isArray(ordering)) {
    if (Array.isArray(ordering.items) && ordering.items.length) return ordering.items;
    if (Array.isArray(ordering.sequence_items) && ordering.sequence_items.length) {
      return ordering.sequence_items;
    }
    if (Array.isArray(ordering.ranking_items) && ordering.ranking_items.length) {
      return ordering.ranking_items;
    }
  }
  var aliases = [
    source.sequence_items,
    source.ranking_items,
    source.order_items,
    source.items
  ];
  for (var i = 0; i < aliases.length; i += 1) {
    if (Array.isArray(aliases[i]) && aliases[i].length) return aliases[i];
  }
  return [];
}

function extractPresentationRaw(source) {
  if (!source || typeof source !== "object") return [];
  var ordering = source.ordering;
  if (ordering && typeof ordering === "object" && !Array.isArray(ordering)) {
    if (Array.isArray(ordering.learner_display_order) && ordering.learner_display_order.length) {
      return ordering.learner_display_order;
    }
    if (Array.isArray(ordering.presentation_order) && ordering.presentation_order.length) {
      return ordering.presentation_order;
    }
  }
  return [];
}

function mapExpectedIds(expectedRaw, itemsByContent, itemsById) {
  var ids = [];
  (Array.isArray(expectedRaw) ? expectedRaw : []).forEach(function (entry, index) {
    if (typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean") {
      var token = String(entry).trim();
      if (itemsById[token]) {
        ids.push(token);
        return;
      }
      if (itemsByContent[token]) {
        ids.push(itemsByContent[token].itemId);
        return;
      }
      var normalized = normalizeOrderingItem(entry, index);
      if (normalized && itemsById[normalized.itemId]) ids.push(normalized.itemId);
      return;
    }
    var item = normalizeOrderingItem(entry, index);
    if (!item) return;
    if (itemsById[item.itemId]) {
      ids.push(item.itemId);
      return;
    }
    if (itemsByContent[item.content]) ids.push(itemsByContent[item.content].itemId);
  });
  return ids;
}

function ordersEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  for (var i = 0; i < a.length; i += 1) {
    if (String(a[i]) !== String(b[i])) return false;
  }
  return true;
}

/**
 * @param {Object} sourceActivity
 * @param {{ activityId?: string, seedKey?: string }} [options]
 * @returns {{
 *   ok: boolean,
 *   model?: Object,
 *   diagnostics: Object[]
 * }}
 */
function normalizeOrderingSemantics(sourceActivity, options) {
  var opts = options || {};
  var diagnostics = [];
  var mode = resolveInteractionMode(sourceActivity);
  var orderingBlock =
    sourceActivity && sourceActivity.ordering && typeof sourceActivity.ordering === "object"
      ? sourceActivity.ordering
      : null;
  var hasOrderingBlock = Boolean(orderingBlock);
  var learnerTask = String((sourceActivity && sourceActivity.learner_task) || "");
  var explicitReorder = EXPLICIT_REORDER_RE.test(learnerTask);

  if (!mode && !hasOrderingBlock) {
    return { ok: false, diagnostics: diagnostics };
  }

  if (!mode && hasOrderingBlock && !explicitReorder) {
    diagnostics.push({
      code: "AMBIGUOUS_ORDERING_SEMANTICS",
      message:
        "Ordering metadata is present without a recognised interaction type or explicit reorder instruction."
    });
    return { ok: false, diagnostics: diagnostics };
  }

  if (!mode && explicitReorder && !hasOrderingBlock) {
    diagnostics.push({
      code: "AMBIGUOUS_ORDERING_SEMANTICS",
      message:
        "Learner task asks for ordering but no authoritative ordering item list was found."
    });
    return { ok: false, diagnostics: diagnostics };
  }

  if (!mode) mode = "sequence";

  var canonicalRaw = extractCanonicalRaw(sourceActivity);
  var presentationRaw = extractPresentationRaw(sourceActivity);
  var candidateRaw = extractCandidateRaw(sourceActivity);
  var itemSource = candidateRaw.length
    ? candidateRaw
    : canonicalRaw.length
      ? canonicalRaw
      : presentationRaw;
  if (!itemSource.length && Array.isArray(sourceActivity && sourceActivity.learner_instructions)) {
    itemSource = sourceActivity.learner_instructions;
  }

  var items = normalizeOrderList(itemSource);
  if (items.length < 2) {
    diagnostics.push({
      code: "ORDERING_ITEMS_MISSING",
      message: "Ordering requires at least two candidate items."
    });
    return { ok: false, diagnostics: diagnostics };
  }

  var itemsById = Object.create(null);
  var itemsByContent = Object.create(null);
  items.forEach(function (item) {
    if (itemsById[item.itemId]) {
      diagnostics.push({
        code: "DUPLICATE_ORDERING_ITEM_ID",
        message: "Duplicate ordering item id: " + item.itemId,
        itemId: item.itemId
      });
    }
    itemsById[item.itemId] = item;
    itemsByContent[item.content] = item;
  });
  if (diagnostics.some(function (row) { return row.code === "DUPLICATE_ORDERING_ITEM_ID"; })) {
    return { ok: false, diagnostics: diagnostics };
  }

  var expectedRaw = canonicalRaw.length ? canonicalRaw : [];
  var expectedOrder = mapExpectedIds(expectedRaw, itemsByContent, itemsById);
  var validationMode = "none";
  if (expectedOrder.length) {
    if (expectedOrder.length !== items.length) {
      diagnostics.push({
        code: "EXPECTED_ORDER_ITEM_MISMATCH",
        message: "Expected order length does not match candidate item count."
      });
      return { ok: false, diagnostics: diagnostics };
    }
    var expectedSeen = Object.create(null);
    for (var e = 0; e < expectedOrder.length; e += 1) {
      var expectedId = expectedOrder[e];
      if (!itemsById[expectedId]) {
        diagnostics.push({
          code: "INVALID_EXPECTED_ORDER",
          message: "Expected order references unknown item id: " + expectedId,
          itemId: expectedId
        });
        return { ok: false, diagnostics: diagnostics };
      }
      if (expectedSeen[expectedId]) {
        diagnostics.push({
          code: "INVALID_EXPECTED_ORDER",
          message: "Expected order contains duplicate item id: " + expectedId,
          itemId: expectedId
        });
        return { ok: false, diagnostics: diagnostics };
      }
      expectedSeen[expectedId] = true;
    }
    validationMode = "exact_order";
  }

  var strategy = String(
    (orderingBlock && orderingBlock.learner_display_order_strategy) || ""
  )
    .trim()
    .toLowerCase();
  var seedKey =
    String((orderingBlock && orderingBlock.shuffle_seed_key) || "").trim() ||
    String(opts.seedKey || "").trim() ||
    [String(opts.activityId || ""), mode, items.map(function (item) { return item.itemId; }).join(",")].join("::");

  var initialIds;
  if (presentationRaw.length) {
    initialIds = mapExpectedIds(presentationRaw, itemsByContent, itemsById);
    if (initialIds.length !== items.length) {
      initialIds = items.map(function (item) {
        return item.itemId;
      });
    }
  } else if (strategy === "deterministic_shuffle" || (validationMode === "exact_order" && mode === "sequence")) {
    initialIds = deterministicShuffle(
      items.map(function (item) {
        return item.itemId;
      }),
      computeStableSeed(seedKey)
    );
    if (
      validationMode === "exact_order" &&
      items.length >= 2 &&
      ordersEqual(initialIds, expectedOrder)
    ) {
      // Ensure the unsolved presentation differs from the answer when possible.
      initialIds = initialIds.slice();
      var tmp = initialIds[0];
      initialIds[0] = initialIds[1];
      initialIds[1] = tmp;
    }
  } else {
    initialIds = items.map(function (item) {
      return item.itemId;
    });
  }

  var initialItems = initialIds
    .map(function (id) {
      return itemsById[id];
    })
    .filter(Boolean);

  if (initialItems.length !== items.length) {
    initialItems = items.slice();
  }

  var label =
    mode === "rank" || mode === "priority"
      ? "Rank the options"
      : "Sequence the stages";
  var prompt = firstNonEmpty([
    learnerTask.split("\n").find(function (line) {
      return EXPLICIT_REORDER_RE.test(line);
    }),
    learnerTask,
    mode === "rank" || mode === "priority"
      ? "Rank the options from highest to lowest priority."
      : "Arrange the stages from earliest to latest."
  ]);

  return {
    ok: true,
    diagnostics: diagnostics,
    model: {
      mode: mode,
      label: label,
      prompt: prompt,
      items: items,
      initialItems: initialItems,
      expectedOrder: validationMode === "exact_order" ? expectedOrder : [],
      validationMode: validationMode,
      shuffleSeedKey: seedKey,
      presentationStrategy: strategy || (presentationRaw.length ? "authored_presentation" : "source_order")
    }
  };
}

function isGenuineOrderingActivity(sourceActivity) {
  var result = normalizeOrderingSemantics(sourceActivity, {
    activityId: String((sourceActivity && sourceActivity.activity_id) || "")
  });
  return result.ok === true;
}

module.exports = {
  ORDERING_INTERACTION_TYPES: ORDERING_INTERACTION_TYPES,
  EXPLICIT_REORDER_RE: EXPLICIT_REORDER_RE,
  computeStableSeed: computeStableSeed,
  deterministicShuffle: deterministicShuffle,
  normalizeOrderingItem: normalizeOrderingItem,
  normalizeOrderList: normalizeOrderList,
  normalizeOrderingSemantics: normalizeOrderingSemantics,
  isGenuineOrderingActivity: isGenuineOrderingActivity,
  ordersEqual: ordersEqual
};
