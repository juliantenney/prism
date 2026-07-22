"use strict";

/**
 * Semantic constants for learner response parts and surface kinds.
 * Educational intent is modelled here; renderers consume normalised workspaces.
 */

var SOURCE_KIND = Object.freeze({
  PROMPT_ITEM: "prompt_item",
  TEMPLATE_SECTION: "template_section",
  TASK_STEP: "task_step",
  TRANSFER_PROMPT: "transfer_prompt",
  REFLECTION_PROMPT: "reflection_prompt",
  EXPECTED_OUTPUT: "expected_output",
  ORDERING: "ordering"
});

var SURFACE_KIND = Object.freeze({
  TEXT_ENTRY: "text_entry",
  TABLE_ENTRY: "table_entry",
  ORDERING: "ordering",
  MATCHING: "matching",
  SINGLE_SELECT: "single_select",
  MULTI_SELECT: "multi_select"
});

var DIAGNOSTIC = Object.freeze({
  UNSUPPORTED_LEARNER_SURFACE: "UNSUPPORTED_LEARNER_SURFACE",
  DUPLICATE_RESPONSE_PART: "DUPLICATE_RESPONSE_PART",
  UNASSIGNED_WRITTEN_RESPONSE: "UNASSIGNED_WRITTEN_RESPONSE",
  AMBIGUOUS_ORDERING_SEMANTICS: "AMBIGUOUS_ORDERING_SEMANTICS",
  ORDERING_ITEMS_MISSING: "ORDERING_ITEMS_MISSING",
  DUPLICATE_ORDERING_ITEM_ID: "DUPLICATE_ORDERING_ITEM_ID",
  INVALID_EXPECTED_ORDER: "INVALID_EXPECTED_ORDER",
  EXPECTED_ORDER_ITEM_MISMATCH: "EXPECTED_ORDER_ITEM_MISMATCH"
});

module.exports = {
  SOURCE_KIND: SOURCE_KIND,
  SURFACE_KIND: SURFACE_KIND,
  DIAGNOSTIC: DIAGNOSTIC
};
