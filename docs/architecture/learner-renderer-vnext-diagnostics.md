# Learner-renderer-vNext Diagnostics Reference

**Status:** Sprint 68 catalogue  
**Source of truth (machine):** `lib/learner-renderer-vnext/certification-diagnostics-catalog.js`  
**Parent:** [learner-renderer-vnext.md](learner-renderer-vnext.md) · [Sprint 69 planning pack](../development/sprints/2026-07-23-sprint-69-archetype-grammar-validation/README.md)

Successful authoritative rendering and certification should emit **no unexpected** warning or error diagnostics. Codes may appear in isolated negative tests.

**Privacy rule:** no diagnostic message may include learner-entered response content.

---

## Severity and release impact

| Severity | Typical use | Release blocking? |
| -------- | ----------- | ----------------- |
| error | Invalid composition / surface / ordering structure | Usually yes when unexpected on authoritative pages |
| warning | Recoverable persistence / adapter issues; some ordering ambiguity | Documented; may or may not block certification |

Certification treats unexpected production diagnostics as release-blocking regardless of subsystem.

---

## Composition / archetype

| Code | Severity | Expected in success? | Blocking | Meaning | Learner impact | Developer action |
| ---- | -------- | -------------------- | -------- | ------- | -------------- | ---------------- |
| `UNKNOWN_ARCHETYPE_VARIANT` | error | no | yes | Beat sequence is not a registered production variant | Activity may fail closed or fall back | Fix episode plan or register only with production evidence |
| `UNASSIGNED_MATERIAL` | error | no | yes | Material not assigned exactly once | Content missing | Fix composition / absorption |
| `MULTIPLY_ASSIGNED_MATERIAL` | error | no | yes | Material assigned more than once | Duplicate content | Deduplicate routing |
| `UNASSIGNED_TASK_STEP` | error | no | yes | Task step not assigned exactly once | Missing instruction/workspace | Fix Do/Check routing |
| `MULTIPLY_ASSIGNED_TASK_STEP` | error | no | yes | Task step assigned more than once | Duplicate tasks | Deduplicate |
| `UNASSIGNED_EXPECTED_OUTPUT` | error | no | yes | Expected output not assigned once | Missing success criteria | Fix assignment |
| `MULTIPLY_ASSIGNED_EXPECTED_OUTPUT` | error | no | yes | Expected output assigned more than once | Duplicate criteria | Deduplicate |

---

## Learner surfaces / response parts

| Code | Severity | Expected in success? | Blocking | Meaning | Learner impact | Developer action |
| ---- | -------- | -------------------- | -------- | ------- | -------------- | ---------------- |
| `UNSUPPORTED_LEARNER_SURFACE` | error | no | yes | Requested surface kind not implemented | Workspace missing / explicit failure | Implement surface or stop requesting it |
| `DUPLICATE_RESPONSE_PART` | warning | no | yes* | Duplicate response-part identity suppressed | Hidden duplicate risk | Fix collection provenance |
| `UNASSIGNED_WRITTEN_RESPONSE` | error | no | yes | Written requirement lacked a workspace | Learner cannot respond | Fix response-part → surface mapping |

\*Release-blocking when unexpected on authoritative certification runs.

---

## Ordering

| Code | Severity | Expected in success? | Blocking | Meaning | Learner impact | Developer action |
| ---- | -------- | -------------------- | -------- | ------- | -------------- | ---------------- |
| `AMBIGUOUS_ORDERING_SEMANTICS` | warning | no | no | Ordering language without sufficient structure | May remain non-interactive | Strengthen schema or leave static |
| `ORDERING_ITEMS_MISSING` | error | no | yes | Fewer than two ordering items | Ordering unusable | Fix item inventory |
| `DUPLICATE_ORDERING_ITEM_ID` | error | no | yes | Non-unique item ids | Broken moves/validation | Stabilise ids |
| `INVALID_EXPECTED_ORDER` | error | no | yes | Expected order refs unknown/duplicate ids | Validation unreliable | Fix expected order |
| `EXPECTED_ORDER_ITEM_MISMATCH` | error | no | yes | Expected order length ≠ candidates | Validation unreliable | Align inventories |

---

## Persistence

| Code | Severity | Expected in success? | Blocking | Meaning | Learner impact | Developer action |
| ---- | -------- | -------------------- | -------- | ------- | -------------- | ---------------- |
| `UNSUPPORTED_WORKSPACE_STATE_ADAPTER` | warning | no | no | No adapter for a workspace kind | That workspace may not restore | Add adapter or ignore unknown kind |
| `UNSTABLE_PERSISTENCE_PAGE_IDENTITY` | warning | sometimes† | no | No workflow/page id; fallback key used | Drafts may collide across similar pages | Supply workflow/page ids in page metadata |
| `UNSUPPORTED_DRAFT_SCHEMA_VERSION` | error | no | no‡ | Envelope version unsupported | Draft ignored | Migrate or clear storage |
| `INVALID_PERSISTED_WORKSPACE_STATE` | warning | no | no | Workspace state failed validation | Partial restore | Fix adapter validation |
| `INVALID_PERSISTED_ORDERING_STATE` | warning | no | no | Ordering order failed validation | Safe fallback order | Fix stored order / adapter |
| `STALE_PERSISTED_WORKSPACE` | warning | no | no | Stored workspace id absent from page | Stale entry dropped | Expected after page edits |
| `LEARNER_DRAFT_READ_FAILED` | warning | no | no | Storage read unavailable/failed | No restore; interaction continues | Check storage permissions |
| `LEARNER_DRAFT_WRITE_FAILED` | warning | no | no | Storage write failed | Status shows failure | Check quota / availability |
| `LEARNER_DRAFT_DELETE_FAILED` | warning | no | no | Clear/delete failed | Clear incomplete | Retry / storage check |
| `LEARNER_DRAFT_PARSE_FAILED` | warning | no | no | Malformed JSON in storage | Draft ignored | Clear corrupted key |

†May appear on fixtures that lack workflow/page identity; certification injects stable ids for authoritative runs without mutating fixture files.  
‡Does not crash the page; draft is rejected.

---

## Certification

Certification aggregates the codes above. It does not introduce a separate production diagnostic namespace beyond the catalogue. Release recommendation states end with exactly one of:

```text
CERTIFIED
CERTIFIED WITH WARNINGS
NOT CERTIFIED
```

---

## Subsystem index

| Subsystem | Codes |
| --------- | ----- |
| archetype | `UNKNOWN_ARCHETYPE_VARIANT` |
| assignment | `UNASSIGNED_*`, `MULTIPLY_ASSIGNED_*` |
| learner-surface / response-parts | `UNSUPPORTED_LEARNER_SURFACE`, `DUPLICATE_RESPONSE_PART`, `UNASSIGNED_WRITTEN_RESPONSE` |
| ordering | `AMBIGUOUS_ORDERING_SEMANTICS`, `ORDERING_ITEMS_MISSING`, `DUPLICATE_ORDERING_ITEM_ID`, `INVALID_EXPECTED_ORDER`, `EXPECTED_ORDER_ITEM_MISMATCH` |
| persistence | all `LEARNER_DRAFT_*`, `UNSUPPORTED_*`, `INVALID_PERSISTED_*`, `STALE_PERSISTED_WORKSPACE`, `UNSTABLE_PERSISTENCE_PAGE_IDENTITY` |
