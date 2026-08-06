# S73-T-010 — Phase 2 acceptance criteria (generated-image persistence slice)

**Task:** S73-T-010  
**Sprint:** 73 — Workflow Resources  
**Type:** Phase 2 acceptance-criteria definition (no implementation)  
**Date:** 2026-08-06  
**Authoritative inputs:** [S73-T-001](S73-T-001-generated-image-lifecycle-discovery.md) · [S73-T-002](S73-T-002-canonical-workflow-resource-ownership.md) · [S73-T-003](S73-T-003-persistence-strategy-evaluation.md) · [S73-T-004](S73-T-004-export-and-regeneration-path-implications.md) · [S73-T-005](S73-T-005-feasibility-synthesis.md) · [S73-D02](decisions.md#s73-d02-workflow-resource-persistence-is-feasible-with-explicit-conditions)  
**Status:** Complete (criteria recorded; implementation not started)

---

## 1. Scope statement

This document defines **bounded, verifiable acceptance criteria** for **S73-T-011** — the first generated-image Workflow Resource persistence vertical slice.

**In scope:**

- One workflow-scoped **Workflow Resources owner layer** (logical; implementation choice open).
- **Manual image attach** on the Sprint 70 visual-jobs path (file picker / drag / paste into Utilities).
- **Single-workflow, single-browser/profile** durability across page refresh and new Prism session.
- **Rehydration → preview → standalone HTML or learner-package ZIP** from durable state.
- **Focused verification** per `S72-D14`.

**Out of scope for S73-T-011** (see §11 Non-goals): PDF/Word/video, server sync, cross-device portability, package re-import, full orphan UI, evidence-architecture changes, learner-renderer redesign.

**Binding:** Criteria encode **S73-D02** conditions. Feasibility is **not** reopened.

---

## 2. User outcome

> A user can attach a generated image to a visual affordance on a workflow, leave or refresh the current session, reopen the same workflow in the same browser/profile, and continue to preview and re-package the learner output using the **existing image** without reattaching the file or regenerating the image.

The slice **MUST** prove durable Workflow Resource ownership and new-session rehydration. It **MUST NOT** claim completion of the full future Workflow Resources architecture.

---

## 3. Minimal vertical slice — user path

### Included path (Sprint 70 visual-jobs / Design Page)

Refined from observed Prism behaviour (T-001):

```text
[START] User selects or creates a workflow with a saved Design Page step
            ↓
        Design Page capture includes visual_affordances[] with at least one
        affordance eligible for image attach (e.g. visual_decision: generate)
            ↓
        User opens Utilities → visual jobs workspace builds from assembled page
            ↓
        Planner + compiler derive transient jobs/briefs (not persisted)
            ↓
        User attaches PNG/JPEG/WebP via manual intake (file picker / drag / paste)
            ↓
        Owner persists minimum Workflow Resource state (identity, metadata, payload/ref)
            ↓
        Workflow runstate persists resource reference(s) — not inline payload in captures
            ↓
[CHECKPOINT A] User refreshes browser OR closes tab and reopens Prism (same profile)
            ↓
        User reloads the same workflow from runstate
            ↓
        Owner rehydrates resource record(s); workflow reconnects association(s)
            ↓
        Utilities workspace hydrates from owner (not from empty assetsByBriefId)
            ↓
        Transient visualAssetManifest projected from owner + page
            ↓
        Preview regenerated (iframe; blob URLs transient only)
            ↓
[END] User generates standalone HTML download OR learner-package ZIP
      containing the same image bytes — without reattach and without utilitiesLastHtml
      from the prior session as required input
```

### Exact boundaries

| Boundary | Definition |
| -------- | ---------- |
| **Start** | Workflow exists in `promptr.workflows.runstate.v1` with Design Page step output containing valid `visual_affordances[]`; user reaches Utilities with a compilable visual-jobs workspace for that page. |
| **End** | After CHECKPOINT A, preview shows the attached figure for the target affordance **and** at least one export path (standalone HTML **or** learner-package ZIP) completes with image content matching the persisted payload. |
| **Attach method** | Manual intake only (`decodeImageFileForVisualJob` / `applyVisualJobAssetFile` path). External Copilot/VEU PNGs enter only via this re-intake — no automated ingest. |
| **Workflow count** | One workflow, one or more attached images on distinct affordances within that workflow (multi-image within one workflow **MAY** be tested; cross-workflow sharing **MUST NOT** be required). |
| **Excluded paths** | Legacy workflow-definition `outputType: "image"` brief fields; attachment-byte author-evidence path (`S72-D10`); VEU automated handoff. |

---

## 4. Acceptance criteria by category

Requirement keywords: **MUST**, **MUST NOT**, **SHOULD**, **MAY**.

### 4.1 Stable resource identity

| ID | Criterion |
| -- | --------- |
| **AC-ID-01** | On first successful attach, the owner **MUST** assign a stable `resource_id` that survives browser refresh and new-session workflow reload. |
| **AC-ID-02** | `resource_id` **MUST NOT** be derived solely from transient `brief_id` or recomputed planner output without an explicit stored mapping. |
| **AC-ID-03** | Each active persisted resource **MUST** have a stored association to workflow intent (at minimum: workflow scope + `affordance_id`; **SHOULD** also record scope, `activity_id`, `visual_slot` for resolver parity). |
| **AC-ID-04** | Replacing an image on the same affordance **MUST** follow one explicit rule, recorded in implementation notes: either (a) supersede prior `resource_id` with lifecycle state `superseded`, or (b) retain `resource_id` and update payload in place. The slice **MUST NOT** leave two active resources bound to the same affordance. |
| **AC-ID-05** | Selective regeneration of page planning (re-run Design Page / re-assemble) **MUST** preserve association when `affordance_id` is unchanged; when an affordance is removed, the owner **MUST** mark the resource `orphaned` or equivalent — **MUST NOT** silently treat it as still active for that slot. |
| **AC-ID-06** | Projection to manifest **MAY** expose `asset_id` / `brief_id` for export compatibility; canonical identity for persistence **MUST** remain `resource_id`. |

### 4.2 Minimal durable metadata

For each category: **required** = persist in owner unless authoritative elsewhere and reliably reconstructable on rehydration.

| Category | Required? | Why | Authoritative source if duplicated | Criterion |
| -------- | --------- | --- | ---------------------------------- | --------- |
| **Resource type** | Yes | Projection/render adapter selection | Owner | **AC-META-01**: Owner **MUST** store resource type (e.g. `generated_image` or neutral `binary` + mime). |
| **MIME type** | Yes | Validation, package extension | Owner (may mirror intake detection) | **AC-META-02**: Owner **MUST** store MIME type used at attach. |
| **Payload reference** | Yes | Rehydration without session map | Owner | **AC-META-03**: Owner **MUST** store payload reference resolvable to bytes (implementation-specific ref; not object URL). |
| **Workflow association** | Yes | Scoped lookup | Owner index + runstate ref | **AC-META-04**: Owner **MUST** record workflow scope key aligned with runstate selection. |
| **Affordance association** | Yes | Resolver primary key | Owner; planning in page JSON | **AC-META-05**: Owner **MUST** store `affordance_id` linkage. |
| **Alt text / description** | Conditional | R9 prompt-independence if page row lost/changed | Page JSON authoritative when present | **AC-META-06**: Owner **SHOULD NOT** duplicate `alt_text` / `detailed_description` when page capture remains authoritative; owner **MUST** retain copy only if rehydration cannot reliably read page JSON at projection time. |
| **Lifecycle state** | Yes | Replace/orphan/supersede | Owner | **AC-META-07**: Owner **MUST** store lifecycle state (`active`, `superseded`, `orphaned` minimum). |
| **Original filename** | No | Not required for render/export | — | **AC-META-08**: Filename **MAY** be stored for author UX; **MUST NOT** be required for rehydration success. |
| **Dimensions** | No | Renderer does not require today | — | **AC-META-09**: Dimensions **MAY** be stored; **MUST NOT** be required for slice acceptance. |
| **Timestamps** | Optional | Audit only | Owner | **AC-META-10**: Created/updated timestamps **MAY** be stored; **MUST NOT** be required for reuse. |
| **Generation instruction** | No | Prompt independence | Transient brief | **AC-META-11**: `generation_instruction` **MUST NOT** be persisted solely to enable preview/export reuse. |

### 4.3 Durable payload

| ID | Criterion |
| -- | --------- |
| **AC-PAY-01** | Attached image bytes **MUST** survive browser refresh without reattach. |
| **AC-PAY-02** | Attached image bytes **MUST** survive closing Prism and reopening in a **new session** (same browser origin/profile). |
| **AC-PAY-03** | Payload retrieval **MUST** go through the canonical owner API — **MUST NOT** treat `assetsByBriefId`, `utilitiesLastHtml`, or `blob:`/`object_url` as durable stores. |
| **AC-PAY-04** | On payload persistence failure (write error, quota exceeded, storage unavailable), attach **MUST** fail with an explicit, user-visible or logged error — **MUST NOT** report success while only holding session memory. |
| **AC-PAY-05** | Intake validation **MUST** continue to reject payloads exceeding the configured maximum (observed default: 12 MiB per file in `prism-visual-assets.js`); slice **MUST** document measured behaviour at that ceiling. |
| **AC-PAY-06** | Storage technology **MAY** be chosen in implementation; acceptance requires **capability** (binary durability per workflow scope in browser profile), not a named product/API in this document. |

### 4.4 Workflow association and rehydration

| ID | Criterion |
| -- | --------- |
| **AC-REH-01** | Workflow runstate **MUST** persist enough reference data to reconnect to owner record(s) on reload (reference, not inline base64 in `capturedOutputs`). |
| **AC-REH-02** | On workflow reload, owner **MUST** rebuild the image projection (manifest entry or equivalent) for each `active` resource referenced by the workflow. |
| **AC-REH-03** | User **MUST NOT** need to re-select the original file after CHECKPOINT A for included path. |
| **AC-REH-04** | Missing owner record for a persisted reference **MUST** produce explicit unresolved state (warning/diagnostic) — **MUST NOT** fail silently as “no image planned”. |
| **AC-REH-05** | Orphaned resources (payload exists, no active workflow reference) **MUST NOT** appear in preview/export as active figures for current workflow. |
| **AC-REH-06** | Rehydration **MUST NOT** require `generation_instruction`, compiler output, or visual job records. |
| **AC-REH-07** | Visual jobs and image briefs **MAY** be recomputed on workspace open; persisted resources **MUST** remain attachable via owner hydration independent of brief re-derivation. |

### 4.5 Prompt independence

| ID | Criterion |
| -- | --------- |
| **AC-PROMPT-01** | After CHECKPOINT A, preview **MUST** render the figure using persisted payload + learner-facing metadata without access to `generation_instruction`. |
| **AC-PROMPT-02** | Standalone HTML and ZIP export **MUST** succeed without `generation_instruction` in durable storage. |
| **AC-PROMPT-03** | Regenerating a new image for one affordance (new attach/replace) **MUST NOT** invalidate unrelated persisted resources on other affordances in the same workflow. |
| **AC-PROMPT-04** | Proof **MUST** include a test or scripted scenario where compiler/brief state is empty or freshly recomputed while owner records remain — image still renders. |

### 4.6 Preview regeneration

| ID | Criterion |
| -- | --------- |
| **AC-PREV-01** | Preview HTML **MUST** be produced by fresh render from assembled page + rehydrated projection — **MUST NOT** require reading prior session `utilitiesLastHtml`. |
| **AC-PREV-02** | Renderer **MUST** receive transient `visualAssets` manifest (or successor projection); manifest **MUST NOT** be written to canonical storage. |
| **AC-PREV-03** | Iframe preview **MAY** use `blob:` substitution; object URLs **MUST** remain session-transient and **MUST NOT** be persisted as canonical state. |
| **AC-PREV-04** | Preview generation **MUST NOT** mutate canonical owner records (read-only for preview). |
| **AC-PREV-05** | Missing payload for a referenced resource **MUST** yield bounded outcome: hidden hook and/or explicit Utilities diagnostic — consistent with current resolver behaviour, not a broken inline `src` without indication. |
| **AC-PREV-06** | If payload retrieval is asynchronous, preview **MUST** either (a) defer figure render until payload resolves, or (b) show explicit unresolved state — **MUST NOT** render stale or empty figure while claiming success. |

### 4.7 Standalone HTML and package regeneration

| ID | Criterion |
| -- | --------- |
| **AC-EXP-01** | After CHECKPOINT A, standalone learner HTML **MUST** be generatable via fresh export pipeline (`runUtilityPageExportPipeline` or equivalent). |
| **AC-EXP-02** | After CHECKPOINT A, learner-package ZIP **MUST** be generatable via `buildLearnerPackage` with fresh HTML + projected manifest. |
| **AC-EXP-03** | Export handlers **MUST NOT** require non-empty `utilitiesLastHtml` from a prior session as the sole HTML source. |
| **AC-EXP-04** | Package path assignment and `data_url` → `assets/...` rewrite **MUST** remain deterministic and match pre-persistence behaviour for the same affordance/slot/brief collision rules (`learner-package.js`). |
| **AC-EXP-05** | Decoded bytes in ZIP **MUST** match persisted owner payload (byte-identical or equivalent decode) for each exported asset. |
| **AC-EXP-06** | If any referenced resource lacks resolvable payload at export time, export **MUST** emit warnings and **MUST NOT** present a complete package as fully successful without documenting omitted assets. |
| **AC-EXP-07** | Generated HTML and ZIP **MUST NOT** be written back to canonical Workflow Resource storage. |

### 4.8 Limits and measurement requirements

Limits are **test bands** and **measurement obligations** — not final product guarantees unless recorded during S73-T-011.

| Dimension | Minimum supported test band | Warning threshold | Hard limit | Evidence label |
| --------- | --------------------------- | ----------------- | ---------- | -------------- |
| Individual image size | 1 image ≤ 500 KiB (smoke) | To be determined during T-011 | Observed intake cap 12 MiB (`MAX_IMAGE_BYTES`) | **Observed in Prism** (cap); **Unknown requiring measurement** (comfort band) |
| Resource count per workflow | 1 affordance attached | To be determined | To be determined | **Proposed test band** |
| Total payload per workflow | 1 × 500 KiB (smoke) | To be determined | To be determined | **Proposed test band** |
| Typical band | 3–5 images, mixed PNG/JPEG, total ≤ 5 MiB | Record user-visible latency | Record failure mode | **Proposed test band** |
| Heavy band | 8–12 images OR total payload approaching measured quota comfort | Record warnings | Record hard-stop behaviour | **Proposed test band** |
| Excessive band | Deliberately exceed measured comfort | N/A | **MUST** fail gracefully with explicit error | **Proposed test band** |
| Preview peak memory | Measure at typical + heavy band | To be determined | To be determined | **Unknown requiring measurement** |
| ZIP generation peak memory | Measure at typical + heavy band | To be determined | To be determined | **Unknown requiring measurement** |
| Base64/data-URL overhead | Record ratio encoded size vs binary at typical band | Informational | Informational | **Unknown requiring measurement** |
| Quota failure | Simulate or force quota exceed once | N/A | Explicit failure, no silent drop | **Required proof** |
| Browser storage unavailable | Simulate private mode / denied storage once | N/A | Explicit degradation message | **Required proof** |
| Package size | Record ZIP bytes at typical band | To be determined | To be determined | **Unknown requiring measurement** |

**AC-LIM-01:** S73-T-011 **MUST** produce a **measurement record** (table or appendix) with observed values for smoke, typical, and heavy bands.  
**AC-LIM-02:** Browser quota **MUST NOT** be documented as a single fixed constant; measurements **MUST** note browser/profile context.  
**AC-LIM-03:** Warning and hard-stop thresholds **MAY** remain “to be determined” in code until measurement; acceptance **MUST** include at least one documented threshold decision for individual file size and one for total workflow payload OR explicit statement that only smoke band is supported in v1 slice with hard cap at intake limit.

### 4.9 Reliability and failure behaviour

| Condition | Expected outcome | Criterion |
| --------- | ---------------- | --------- |
| Storage write fails mid-attach | Attach fails; no `active` resource; explicit error | **AC-FAIL-01** |
| Quota exceeded | Attach or save fails explicitly; no partial silent state | **AC-FAIL-02** |
| Metadata/index persists, payload missing | Rehydration reports missing payload; preview/export omit or warn | **AC-FAIL-03** |
| Payload persists, workflow reference missing | Resource not projected as active; orphan state recorded | **AC-FAIL-04** |
| Projection cannot rebuild | Utilities diagnostic; no false-positive figure | **AC-FAIL-05** |
| Browser storage API unavailable | Persistence disabled or attach blocked with explicit message | **AC-FAIL-06** |
| Retrieval interrupted | Operation aborts; no corrupt `active` record | **AC-FAIL-07** |
| Package started with unresolved resources | ZIP blocked or completed with documented omissions + warnings | **AC-FAIL-08** |
| User clears site data | All workflow resources lost — **MUST** be treated as durability boundary, not product defect | **AC-FAIL-09** |

**AC-FAIL-10:** Documentation **MUST** state that browser persistence is **same-origin, same-profile** durability — **MUST NOT** imply permanent archival or cross-device sync.

### 4.10 Browser and Node parity

| ID | Criterion |
| -- | --------- |
| **AC-PAR-01** | Owner/projection logic **MUST** be testable via Node `require` path with a documented test substitute for browser payload storage. |
| **AC-PAR-02** | Browser-loaded Utilities path **MUST** be verified manually or via automated browser check for at least: attach → refresh → preview. |
| **AC-PAR-03** | If renderer browser bundle is used for preview/export, implementation **MUST** include explicit bundle rebuild verification step or CI check when owner modules affect load order (`index.html` script chain). |
| **AC-PAR-04** | Node tests alone **MUST NOT** be the only evidence for persistence — at least one browser-profile rehydration proof **MUST** be recorded. |
| **AC-PAR-05** | Browser storage **MUST** sit behind an adapter boundary isolating `IndexedDB` / `localStorage` / other API from core owner logic. |
| **AC-PAR-06** | Regressions **MUST** follow `S72-D14`: stop, fix owning layer, add focused test before widening scope. |

### 4.11 Resource-type neutrality (owner boundary)

| ID | Criterion |
| -- | --------- |
| **AC-NEU-01** | Canonical owner record **MUST** use neutral field names at the persistence boundary (e.g. `resource_type`, `payload_ref`, `mime_type`) — **MUST NOT** name the owner store `visualAssetsPersistent` or equivalent image-only registry. |
| **AC-NEU-02** | Image-specific logic **MUST** live in attach adapter, manifest projection, and existing renderer — **MUST NOT** embed PNG/JPEG validation in the generic owner CRUD layer beyond type dispatch. |
| **AC-NEU-03** | Owner **MUST** conceptually admit future payload kinds: binary blob, external URL reference, embed metadata string — image slice **MUST** implement binary only. |
| **AC-NEU-04** | Record shape **SHOULD** align with `S72-D09` shared-model direction (no separate evidence store in this slice). |

---

## 5. Minimal durable-state summary

**MUST persist (owner + workflow reference rail):**

- `resource_id`
- `resource_type` (or equivalent neutral discriminator)
- `mime_type`
- `payload_ref` → resolvable bytes
- workflow scope key
- `affordance_id` (+ linkage fields as needed for resolver)
- `lifecycle_state`
- learner-facing text copy **only if** not reliably sourced from page JSON on rehydration

**MUST persist (workflow runstate / index rail):**

- reference(s) from workflow to `resource_id`(s) — not inline image bytes in step captures

---

## 6. Explicit transient / derived state

The following **MUST NOT** be treated as canonical persisted Workflow Resource state in S73-T-011:

| Artefact | Classification |
| -------- | -------------- |
| Visual jobs (`planPrismVisualJobs` output) | Derived — recompute |
| Image briefs (`compilePrismImageBriefs` output) | Derived — recompute |
| `generation_instruction` | Transient unless independently required (not for slice) |
| `visualAssetManifest` | Transient projection |
| `assetsByBriefId` | Transient Utilities cache |
| `object_url` / `blob:` preview URLs | Transient |
| Preview iframe HTML | Transient |
| `utilitiesLastHtml` | Transient cache — optional convenience only |
| Rendered learner HTML | Derived output |
| Package paths inside ZIP | Derived at export |
| Learner-package ZIP file | Derived disposable snapshot |
| Planner/compiler diagnostics | Transient |

---

## 7. Verification matrix (S73-T-012 / alongside S73-T-011)

| # | Verification | Type | Pass condition |
| - | ------------ | ---- | -------------- |
| V1 | Resource record creation on attach | Unit / integration | Owner returns `resource_id`; lifecycle `active` |
| V2 | Payload persistence | Integration | Bytes retrievable via owner after write |
| V3 | Refresh rehydration | Browser manual or automated | After reload, same figure in preview without reattach |
| V4 | New-session rehydration | Browser manual | New tab/session, same origin; workflow reload succeeds |
| V5 | Association reconstruction | Integration | Manifest entry maps to correct `affordance_id` |
| V6 | Preview regeneration | Integration + browser | Fresh HTML; no prior `utilitiesLastHtml` |
| V7 | Standalone HTML regeneration | Integration | Download/open path succeeds post-rehydration |
| V8 | ZIP package regeneration | Integration | `buildLearnerPackage` bytes match payload |
| V9 | Missing-payload failure | Unit / integration | Explicit warn/fail; no false success |
| V10 | Quota/storage failure | Integration with mock | Explicit error; no orphan `active` without payload |
| V11 | Resource replacement | Integration | Single active resource per affordance per AC-ID-04 |
| V12 | Selective regeneration | Integration | Unrelated affordance resources unchanged |
| V13 | Browser/public-path coverage | Manual checklist | Utilities attach → refresh → preview documented |
| V14 | Existing renderer/package regressions | CI | `utility-utilities-page-export-pipeline`, `sprint-70-slice-e2/e3`, `learner-renderer-vnext-visual-affordances` remain green |

**Measurement evidence (required appendix to T-011):** V15 limits table (§4.8) filled for smoke/typical/heavy bands.

---

## 8. Non-goals (Phase 2 slice)

S73-T-011 **MUST NOT** implement or require:

- PDF, Word, or embedded-video resources
- Programming resources (PB-FA-002)
- Pipeline-integrity redesign (PB-FA-003)
- Learner-renderer redesign
- Evidence-architecture changes
- Server synchronisation or multi-device portability
- Permanent archival guarantees
- Learner-package re-import / round-trip
- Persistence of rendered HTML or ZIP as canonical state
- Full orphan-management UI or bulk GC tooling
- Migration of all historical workflows (only workflows using the new attach path)
- Automated VEU/Copilot image ingest
- Author-evidence attachment bytes (`S72-D10` deferred path)
- Cross-workflow resource libraries or shared asset pools

---

## 9. Stop / pivot conditions (return to discovery)

Implementation **MUST** stop and escalate if any of the following is observed during S73-T-011:

| Condition | Action |
| --------- | ------ |
| Smoke band (1 × ≤500 KiB) cannot rehydrate reliably in browser | Stop — feasibility contradiction |
| Measured heavy band shows unavoidable tab crash OOM during preview or ZIP | Stop or narrow scope — document in sprint review |
| Only viable storage is inline base64 in runstate captures | Pivot — violates T-002/T-003 owner model |
| Browser path cannot hydrate owner without breaking public bundle load order unfixably | Stop — R7 parity failure |
| Image-specific fields permeate generic owner layer (AC-NEU violated) | Stop — fix design before continuing |
| Implementation requires evidence-architecture coupling | Stop — record separate decision; default out |
| Quota failures cannot be detected explicitly | Stop — AC-FAIL unmet |

---

## 10. Definition of done — S73-T-011

S73-T-011 **MAY** be marked complete only when **all** of the following are true:

1. **AC-REH-02, AC-REH-03:** Resource and association survive new-session reload (V4).
2. **AC-PREV-01, AC-PREV-06:** Preview regenerates from durable state (V6).
3. **AC-EXP-01, AC-EXP-02, AC-EXP-03:** At least one export path (HTML or ZIP) regenerates without prior-session snapshot (V7 or V8).
4. **AC-PROMPT-01, AC-PROMPT-04:** Reuse without `generation_instruction` demonstrated (V12 scenario).
5. **AC-FAIL-01 through AC-FAIL-03, AC-FAIL-09:** Failure cases explicit (V9, V10).
6. **AC-LIM-01:** Measurement record published for smoke + typical + heavy bands.
7. **AC-PAR-02, AC-PAR-04:** Browser rehydration proof recorded (V13).
8. **§6 compliance:** No derived artefact stored as canonical owner state.
9. **V14:** Focused existing export/renderer tests green.
10. **S72-D14:** New focused regressions added for persistence path (S73-T-012 minimum bar).

---

## 11. Open implementation choices (not decided by this task)

| Choice | Status | Constraint from acceptance criteria |
| ------ | ------ | ----------------------------------- |
| Payload storage technology (IDB vs hybrid vs other) | Open | Must satisfy AC-PAY-01–04 capability |
| Exact `resource_id` format | Open | Must satisfy AC-ID-01–03 |
| Runstate index shape vs parallel store key | Open | Must satisfy AC-REH-01; no inline blobs |
| Duplicate metadata policy for alt/description | Open | AC-META-06 minimisation |
| Replace semantics (supersede vs in-place) | Open | Must pick one per AC-ID-04 and document |
| Async projection API surface | Open | Must satisfy AC-PREV-06, AC-EXP-06 |
| Warning vs hard-stop numeric thresholds | Open | AC-LIM-03 after measurement |
| Utilities UX for failure states | Open | Must satisfy AC-FAIL explicit reporting |

---

## 12. Evidence references

### Phase 1 and decision

- [S73-T-001](S73-T-001-generated-image-lifecycle-discovery.md) — lifecycle, session loss, export path
- [S73-T-002](S73-T-002-canonical-workflow-resource-ownership.md) — owner responsibilities R1–R13
- [S73-T-003](S73-T-003-persistence-strategy-evaluation.md) — P5/P6 promising; P1/P8/P9 excluded
- [S73-T-004](S73-T-004-export-and-regeneration-path-implications.md) — regeneration model; `utilitiesLastHtml` non-authoritative
- [S73-T-005](S73-T-005-feasibility-synthesis.md) — conditional feasibility; proof obligations
- [S73-D02](decisions.md#s73-d02-workflow-resource-persistence-is-feasible-with-explicit-conditions)

### Code anchors (behaviour boundaries)

- `lib/prism-visual-assets.js` — intake, manifest build, `MAX_IMAGE_BYTES`
- `lib/utilities-visual-jobs-workspace.js` — workspace rebuild
- `app.js` — runstate, preview/export orchestration, `utilitiesLastHtml`
- `lib/learner-renderer-vnext/` — manifest-fed render (unchanged contract)
- `lib/learner-package.js` — ZIP rewrite (unchanged contract)

### Existing tests (regression baseline)

- `tests/utility-utilities-page-export-pipeline.test.js`
- `tests/sprint-70-slice-e2-learner-package-rewrite.test.js`
- `tests/sprint-70-slice-e3-learner-package-zip.test.js`
- `tests/sprint-70-final-expandable-learner-images.test.js`
- `tests/learner-renderer-vnext-visual-affordances.test.js`

---

## Explicit non-deliverables (honoured)

- No persistence implementation in this task.
- No storage adapter code, schema files, or runtime changes.
- No new architecture decision ID (criteria implement S73-D02; storage choice remains pending in decisions.md).
