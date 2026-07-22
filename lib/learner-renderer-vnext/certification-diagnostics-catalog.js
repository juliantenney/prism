"use strict";

/**
 * Sprint 68 diagnostic catalogue for certification (IMP-020).
 */

var responseParts = require("./response-part-types");
var draft = require("./learner-draft-constants");

var CATALOG = Object.freeze([
  Object.freeze({
    code: "UNKNOWN_ARCHETYPE_VARIANT",
    subsystem: "archetype",
    severity: "error",
    releaseBlocking: true,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Episode-plan archetype/beat sequence is not a recognised production variant."
  }),
  Object.freeze({
    code: responseParts.DIAGNOSTIC.UNSUPPORTED_LEARNER_SURFACE,
    subsystem: "learner-surface",
    severity: "error",
    releaseBlocking: true,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Response part requests a surface kind that is not implemented."
  }),
  Object.freeze({
    code: responseParts.DIAGNOSTIC.DUPLICATE_RESPONSE_PART,
    subsystem: "response-parts",
    severity: "warning",
    releaseBlocking: true,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Duplicate response-part identity suppressed during composition."
  }),
  Object.freeze({
    code: responseParts.DIAGNOSTIC.UNASSIGNED_WRITTEN_RESPONSE,
    subsystem: "response-parts",
    severity: "error",
    releaseBlocking: true,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Written response requirement was not mapped to a workspace."
  }),
  Object.freeze({
    code: responseParts.DIAGNOSTIC.AMBIGUOUS_ORDERING_SEMANTICS,
    subsystem: "ordering",
    severity: "warning",
    releaseBlocking: false,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Ordering wording or metadata is present without sufficient structure."
  }),
  Object.freeze({
    code: responseParts.DIAGNOSTIC.ORDERING_ITEMS_MISSING,
    subsystem: "ordering",
    severity: "error",
    releaseBlocking: true,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Ordering surface lacks at least two candidate items."
  }),
  Object.freeze({
    code: responseParts.DIAGNOSTIC.DUPLICATE_ORDERING_ITEM_ID,
    subsystem: "ordering",
    severity: "error",
    releaseBlocking: true,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Ordering candidate item IDs are not unique."
  }),
  Object.freeze({
    code: responseParts.DIAGNOSTIC.INVALID_EXPECTED_ORDER,
    subsystem: "ordering",
    severity: "error",
    releaseBlocking: true,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Expected order references unknown or duplicate item IDs."
  }),
  Object.freeze({
    code: responseParts.DIAGNOSTIC.EXPECTED_ORDER_ITEM_MISMATCH,
    subsystem: "ordering",
    severity: "error",
    releaseBlocking: true,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Expected order length does not match candidate inventory."
  }),
  Object.freeze({
    code: draft.DIAGNOSTIC.UNSUPPORTED_WORKSPACE_STATE_ADAPTER,
    subsystem: "persistence",
    severity: "warning",
    releaseBlocking: false,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Persisted or live workspace kind has no state adapter."
  }),
  Object.freeze({
    code: draft.DIAGNOSTIC.UNSTABLE_PERSISTENCE_PAGE_IDENTITY,
    subsystem: "persistence",
    severity: "warning",
    releaseBlocking: false,
    expectedInSuccessfulAuthoritativeRender: true,
    mayIncludeResponseContent: false,
    condition: "Page identity falls back when workflow/page ids are absent."
  }),
  Object.freeze({
    code: draft.DIAGNOSTIC.UNSUPPORTED_DRAFT_SCHEMA_VERSION,
    subsystem: "persistence",
    severity: "error",
    releaseBlocking: false,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Stored draft envelope schema version is unsupported."
  }),
  Object.freeze({
    code: draft.DIAGNOSTIC.INVALID_PERSISTED_WORKSPACE_STATE,
    subsystem: "persistence",
    severity: "warning",
    releaseBlocking: false,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Persisted workspace state failed validation."
  }),
  Object.freeze({
    code: draft.DIAGNOSTIC.INVALID_PERSISTED_ORDERING_STATE,
    subsystem: "persistence",
    severity: "warning",
    releaseBlocking: false,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Persisted ordering item-order failed validation."
  }),
  Object.freeze({
    code: draft.DIAGNOSTIC.STALE_PERSISTED_WORKSPACE,
    subsystem: "persistence",
    severity: "warning",
    releaseBlocking: false,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Stored workspace id is no longer present on the page."
  }),
  Object.freeze({
    code: draft.DIAGNOSTIC.LEARNER_DRAFT_READ_FAILED,
    subsystem: "persistence",
    severity: "warning",
    releaseBlocking: false,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Draft storage read failed or is unavailable."
  }),
  Object.freeze({
    code: draft.DIAGNOSTIC.LEARNER_DRAFT_WRITE_FAILED,
    subsystem: "persistence",
    severity: "warning",
    releaseBlocking: false,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Draft storage write failed."
  }),
  Object.freeze({
    code: draft.DIAGNOSTIC.LEARNER_DRAFT_DELETE_FAILED,
    subsystem: "persistence",
    severity: "warning",
    releaseBlocking: false,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Draft storage delete failed."
  }),
  Object.freeze({
    code: draft.DIAGNOSTIC.LEARNER_DRAFT_PARSE_FAILED,
    subsystem: "persistence",
    severity: "warning",
    releaseBlocking: false,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Stored draft JSON could not be parsed."
  }),
  Object.freeze({
    code: "UNASSIGNED_MATERIAL",
    subsystem: "assignment",
    severity: "error",
    releaseBlocking: true,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Material was not assigned to exactly one semantic moment."
  }),
  Object.freeze({
    code: "MULTIPLY_ASSIGNED_MATERIAL",
    subsystem: "assignment",
    severity: "error",
    releaseBlocking: true,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Material was assigned to more than one semantic moment."
  }),
  Object.freeze({
    code: "UNASSIGNED_TASK_STEP",
    subsystem: "assignment",
    severity: "error",
    releaseBlocking: true,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Learner-task step was not assigned exactly once."
  }),
  Object.freeze({
    code: "MULTIPLY_ASSIGNED_TASK_STEP",
    subsystem: "assignment",
    severity: "error",
    releaseBlocking: true,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Learner-task step was assigned more than once."
  }),
  Object.freeze({
    code: "UNASSIGNED_EXPECTED_OUTPUT",
    subsystem: "assignment",
    severity: "error",
    releaseBlocking: true,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Expected output was not assigned exactly once."
  }),
  Object.freeze({
    code: "MULTIPLY_ASSIGNED_EXPECTED_OUTPUT",
    subsystem: "assignment",
    severity: "error",
    releaseBlocking: true,
    expectedInSuccessfulAuthoritativeRender: false,
    mayIncludeResponseContent: false,
    condition: "Expected output was assigned more than once."
  })
]);

function getDiagnosticCatalog() {
  return CATALOG.slice();
}

function catalogCodes() {
  return CATALOG.map(function (row) {
    return row.code;
  });
}

module.exports = {
  CATALOG: CATALOG,
  getDiagnosticCatalog: getDiagnosticCatalog,
  catalogCodes: catalogCodes
};
