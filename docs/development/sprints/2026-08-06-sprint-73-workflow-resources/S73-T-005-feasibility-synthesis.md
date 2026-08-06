# S73-T-005 — Feasibility synthesis and limits assessment

**Task:** S73-T-005  
**Sprint:** 73 — Workflow Resources  
**Type:** Phase 1 feasibility synthesis (no implementation)  
**Date:** 2026-08-06  
**Authoritative inputs:** [S73-T-001](S73-T-001-generated-image-lifecycle-discovery.md) · [S73-T-002](S73-T-002-canonical-workflow-resource-ownership.md) · [S73-T-003](S73-T-003-persistence-strategy-evaluation.md) · [S73-T-004](S73-T-004-export-and-regeneration-path-implications.md)  
**Status:** Complete (recommendation provided for `S73-D02`; decision not recorded in this task)

---

## 1. Executive feasibility assessment

### Recommendation for S73-D02 input

**Feasible with explicit conditions.**

The Phase 1 evidence supports proceeding to a tightly bounded Phase 2 generated-image vertical slice **only if** acceptance criteria explicitly prove capacity, runtime memory, asynchronous projection, and export-regeneration reliability under realistic workflow bands.

### Why this is not “Feasible” without conditions

- Durable owner architecture is clear (T-002) and regeneration paths are conditionally compatible (T-004), but hard limits are not yet measured in Prism for browser quota, peak memory, and async payload retrieval behavior.
- Current UI export path still depends on session snapshot (`utilitiesLastHtml`) and session manifest clone; this is an implementation shortcut, not a source-of-truth requirement (T-004).
- Browser/Node parity for a future owner adapter remains unresolved and must be proved (T-003, T-004).

### Architecture stance reaffirmed

```text
Durable workflow step data
        +
Minimal canonical Workflow Resource state
        ↓
Rehydrated workflow
        ↓
Transient projections
        ↓
Preview · standalone HTML · learner-package ZIP
```

Rendered HTML, preview blob state, manifests, package paths, and ZIP packages remain **derived outputs**.

---

## 2. Minimal durable-state analysis (generated-image slice)

Categories below are architectural categories, not final schema.

| Durable category | Why durable | Exists elsewhere today? | Reconstructable? | Duplication risk | Consequence if omitted | Evidence label |
| --- | --- | --- | --- | --- | --- | --- |
| Stable `resource_id` | Required to reconnect resource across sessions and replacement | Partial via `asset_id`/`brief_id`/`affordance_id` set | Not safely from payload alone | Medium if duplicated across page + owner + manifest | Cannot guarantee stable rebind or orphan detection | **Observed in Prism** (IDs exist, ownership not durable) |
| Resource type | Required for type-specific projection/render/export adapters | Implicitly image-only today | No, once generalized | Low | Ambiguous projection path for non-image resources | **Observed in Prism** |
| Durable payload or addressable payload reference | Required for new-session reuse without reattach/regenerate | No durable in-workflow payload today | No from workflow captures alone | High if stored inline in multiple places | Rehydration fails for image bytes | **Observed in Prism** |
| MIME + essential file characteristics | Required for package extension, validation, rendering | Partially present in session asset records | Sometimes inferable from data URL header | Medium | Packaging and safety checks degrade | **Observed in Prism** |
| Minimal workflow-intent association | Required to reconnect resource to affordance/slot/activity intent | Present in step/page (`affordance_id`, scope, slot) | Yes for intent; not for bytes | Medium | Resource survives but cannot be reliably placed | **Observed in Prism** |
| Learner-facing metadata not safely reconstructable | Supports prompt independence and accessible rendering | `alt_text`/`detailed_description` in planning rows today | Usually yes from step data; not guaranteed after edits/regens | Medium | Usable resource may lose accessibility semantics | **Observed in Prism** + **Unknown requiring measurement** (edit/regeneration drift) |
| Lifecycle state for replace/orphan handling | Required for reconnect/supersede/orphan policy | Session-only replacement behavior | Not fully | Low/Medium | Stale associations accumulate silently | **Observed in Prism** (partial) |

### Prompt-independence assessment (`generation_instruction`)

- Prompt independence **can be achieved without retaining `generation_instruction`** as canonical durable state if durable records retain: stable identity, payload/ref, learner-facing metadata, and intent linkage.
- `generation_instruction` is useful provenance or optional lineage metadata, but not required for preview/export/package regeneration.
- Persisting prompts by default would violate minimal-persistence discipline where no concrete rehydration need is demonstrated.

Evidence label: **Observed in Prism** (T-001/T-004 show render/export do not require generation prompt).

---

## 3. Capacity and quota analysis

### Remaining strategy set (from T-003)

- Promising shape: **P5 metadata/payload separation + P6 hybrid index+payload tier**, with **P4 IndexedDB payload tier** as strong candidate.
- P1/P8/P9 remain unsuitable and excluded from feasibility options.

### Capacity constraints (non-constant)

Prism cannot assume a single reliable quota constant. Capacity varies by browser, profile mode, origin policy, available disk, and institutional controls.

| Constraint area | Impact | Evidence label |
| --- | --- | --- |
| localStorage practical ceiling for metadata/index | Limits how much index/metadata can remain in runstate-like rails | **Externally imposed platform constraint** |
| IndexedDB availability and quota behavior | Determines realistic payload durability for generated images | **Externally imposed platform constraint** |
| Private/incognito/storage partitioning | May disable or heavily constrain durable browser storage | **Externally imposed platform constraint** |
| Origin eviction policy and user-cleared data | Makes browser durability non-archival | **Externally imposed platform constraint** |
| Prism workflow capture growth | Competes with any metadata persisted on local rails | **Observed in Prism** |

### What must be measured in Prism (not assumed)

1. Metadata/index growth under realistic workflow resource counts.
2. Payload durability headroom for generated-image bands in browser environments used by Prism authors.
3. Failure rates and behavior under forced quota exceed/write interruption.
4. Recovery behavior after simulated storage eviction.

Evidence label: **Unknown requiring measurement**.

---

## 4. Workflow-scale variables and proposed test bands

### Variables that drive feasibility

- Resources per workflow.
- Average payload bytes.
- Maximum individual payload bytes.
- Total payload per workflow.
- Number of steps referencing resources.
- Resource reuse ratio across steps.
- Replacement frequency and orphan accumulation.
- Concurrent resources rendered in one preview/export operation.
- Standalone HTML size and ZIP size.

### Proposed validation bands (for Phase 2 proof tasks)

These are **test bands**, not product limits.

| Band | Purpose | Evidence label |
| --- | --- | --- |
| Small workflow | Confirm baseline behavior and functional parity | **Proposed product limit/test band** |
| Typical workflow | Validate normal authoring experience under moderate resource count/size | **Proposed product limit/test band** |
| Heavy workflow | Stress likely upper practical use before browser instability | **Proposed product limit/test band** |
| Deliberately excessive | Characterize graceful failure and guardrail behavior | **Proposed product limit/test band** |

### Observed vs unknown

- Observed: generated-image path accepts per-file intake up to configured byte validation thresholds and uses base64/data URL forms during render/export.
- Unknown: realistic resource count and total payload distributions in production-like author workflows.

Evidence labels: **Observed in Prism** + **Unknown requiring measurement**.

---

## 5. Representation and memory-overhead analysis

### Representation chain and duplication risk

```text
persistent payload
    ↓
resource retrieval
    ↓
manifest projection
    ↓
data_url or object URL
    ↓
image decode
    ↓
fresh HTML render
    ↓
ZIP packaging
```

### Overhead observations

| Representation | Feasibility note | Evidence label |
| --- | --- | --- |
| Binary Blob/payload bytes | Most compact durable payload representation among browser-side options | **Externally imposed platform constraint** (format behavior) |
| `data_url` / base64 text | Inflates payload size and duplicates bytes inside HTML/manifest snapshots | **Observed in Prism** |
| Object URL (`blob:`) | Good transient preview optimization; not durable/export-safe form | **Observed in Prism** |
| Decoded image memory | Adds runtime expansion beyond encoded source bytes | **Externally imposed platform constraint** |
| ZIP buffers | Introduce additional peak memory during package serialization | **Observed in Prism** + **Externally imposed platform constraint** |

### Material risk

Current `data_url`-centered paths are compatible with regeneration but can create significant transient duplication during heavy exports (payload + base64 + decoded bitmap + HTML + ZIP buffers).

Evidence label: **Feasible with constraints** conclusion based on observed path and known browser memory behavior; exact thresholds remain **Unknown requiring measurement**.

---

## 6. Rehydration-performance analysis

### Expected new-session path

```text
Load workflow metadata
        ↓
Resolve resource records
        ↓
Retrieve required payloads
        ↓
Rebuild projections
        ↓
Render preview or package
```

### Async boundary assessment

| Question | Assessment | Evidence label |
| --- | --- | --- |
| Current path assumes sync payload availability? | Yes, current session workspace and export path are largely sync from in-memory/session state | **Observed in Prism** |
| Durable payload retrieval likely async? | Yes for IDB/hybrid tiers | **Externally imposed platform constraint** |
| Must all resources load immediately? | Not required for preview if projection resolves only referenced assets; package export should await complete required payload set | **Feasible with constraints** |
| Progress/failure signaling needed? | Yes, to avoid apparent hang under large payloads/slow reads | **Unknown requiring measurement** (UX timing budgets) |

### Performance feasibility conclusion

Technically feasible, but only if Phase 2 acceptance criteria include explicit async orchestration proof and bounded behavior under heavy resource sets.

---

## 7. Reliability and eviction analysis

Browser durability is durable-in-profile, not archival permanence.

| Failure condition | Expected layer to detect/report | Feasibility implication | Evidence label |
| --- | --- | --- | --- |
| Metadata survives, payload missing | Owner/projection layer | Should degrade with explicit missing-resource state | **Feasible with constraints** |
| Payload survives, workflow refs missing | Owner lifecycle/orphan tracker | Requires orphan policy and cleanup/reporting | **Feasible with constraints** |
| Origin storage eviction or user clear | Owner open/rehydrate path | Must surface recovery state; cannot claim guaranteed archival retention | **Externally imposed platform constraint** |
| Private mode disallows persistence | Capability gate at initialization | Requires graceful fallback/degradation policy | **Externally imposed platform constraint** |
| Mid-write failure/quota exceeded | Owner write transaction boundary | Needs atomicity/repair semantics in slice acceptance criteria | **Unknown requiring measurement** |
| Open on another browser/device | Out of browser-local scope unless explicit portability path exists | Browser-local durability only by default | **Externally imposed platform constraint** |

---

## 8. Export/package limits

Per T-004, regeneration limits are export-time operational limits, not reasons to persist HTML or ZIP packages.

| Limit area | Assessment | Evidence label |
| --- | --- | --- |
| Self-contained HTML size | Can grow quickly with inline image data URLs | **Observed in Prism** |
| Large inline HTML memory pressure | Risk during render/string operations | **Externally imposed platform constraint** + **Observed in Prism** |
| ZIP in-memory generation | Peak memory pressure for large resource sets | **Observed in Prism** |
| Package generation duration | Scales with payload count/size and encode/decode steps | **Unknown requiring measurement** |
| Deterministic name collisions | Existing package builder has collision suffix behavior | **Observed in Prism** |
| Missing-resource behavior | Existing warning/omit behavior exists; robustness needs boundary tests | **Observed in Prism** |

---

## 9. Browser/Node parity assessment

### Feasibility position

Parity is achievable but unresolved until an owner adapter contract is tested in both browser and Node paths.

| Parity topic | Assessment | Evidence label |
| --- | --- | --- |
| Browser-loaded Prism path | Must load owner/projection modules in script path with correct order | **Observed in Prism** (script split/stale bundle risks) |
| Source-module Node path | Must expose equivalent projection API for tests/package generation | **Observed in Prism** |
| Browser-only storage APIs | Require Node test substitutes/mocks/adapters | **Externally imposed platform constraint** |
| Async vs sync callers | Existing sync assumptions must be updated at orchestration boundaries | **Observed in Prism** |
| Bundle-size/stale-bundle risk | Separate bundle/script pipelines can drift | **Observed in Prism** |

### Parity feasibility conclusion

**Feasible with constraints**, conditional on explicit parity proof tasks and CI coverage in Phase 2.

---

## 10. Future-resource limit considerations (resource-type neutrality check)

Future types are used here only to test neutrality, not to design implementation.

| Resource type | Neutral-model fit | Practical limits/risks | Evidence label |
| --- | --- | --- | --- |
| Generated image bytes | Strong fit with metadata+payload/ref model | Payload size/memory/export overhead | **Observed in Prism** |
| Uploaded documents | Fits same owner model with MIME/name metadata | Larger payloads may tighten storage/memory limits | **Feasible with constraints** |
| External hosted resources | Fits as durable reference + learner metadata | Link rot, availability, privacy, offline export behavior | **Externally imposed platform constraint** |
| Video embed code/URL/provider metadata | Fits as non-binary durable payload/reference | Sanitization/security, provider terms, runtime availability | **Externally imposed platform constraint** + **Unknown requiring measurement** |

---

## 11. Feasibility classification matrix

| Capability | Classification | Notes |
| --- | --- | --- |
| Stable resource identity | **Technically feasible** | Existing ID anchors provide path; canonical `resource_id` policy still open |
| Durable metadata | **Technically feasible** | Must minimize duplication and preserve learner-facing fields needed for R9 |
| Durable image payload | **Feasible with constraints** | Requires payload tier with quota-aware behavior |
| New-session rehydration | **Feasible with constraints** | Depends on owner lookup + payload retrieval + projection |
| Prompt-independent reuse | **Technically feasible** | Does not require durable generation prompt |
| Preview regeneration | **Technically feasible** | Manifest-fed render path already supports regeneration model |
| Standalone HTML regeneration | **Technically feasible** | Fresh render path available; snapshot gating is incidental |
| ZIP regeneration | **Feasible with constraints** | Memory and async payload resolution constraints |
| Browser/Node parity | **Unresolved pending focused proof** | Adapter and async parity tests required |
| Realistic workflow capacity | **Unresolved pending focused proof** | Needs measured bands, not assumed quotas |
| Failure recovery | **Feasible with constraints** | Requires explicit policies for missing payloads/orphans/eviction |
| Resource-type-neutral extension | **Feasible with constraints** | Owner/projection boundary is neutral; per-type adapters still needed |

---

## 12. Required conditions and focused proof tasks

Proceeding recommendation is conditional on these Phase 2 proof tasks becoming acceptance criteria for the slice:

1. **Rehydration proof:** reopen-in-new-session retains and rebinds resources without reattach/regenerate.
2. **Fresh export proof:** standalone HTML and ZIP generation from durable state + regenerated projection, without reliance on `utilitiesLastHtml` as required input.
3. **Capacity proof:** execute small/typical/heavy/excessive bands and record pass/fail boundaries.
4. **Peak-memory proof:** measure preview/export/package peaks and failure modes under heavy bands.
5. **Async orchestration proof:** payload retrieval and projection timing do not lock UI path beyond acceptable thresholds.
6. **Reliability proof:** simulate quota exceeded, partial write failure, missing payload, and storage eviction with explicit outcomes.
7. **Parity proof:** browser and Node test paths produce equivalent projection/render/package outputs for shared fixtures.
8. **Policy guardrail proof:** warnings/hard-fail behavior exercised for limit thresholds and unsupported persistence contexts.

Evidence label for all above: **Unknown requiring measurement**.

---

## 13. Recommended S73-D02 outcome (input only)

**Recommend:** **Feasible with explicit conditions**.

Rationale:

- Ownership model is architecturally sound (T-002).
- Regeneration/export model is conditionally compatible and already close in pipeline shape (T-004).
- Persistence strategy space is narrowed to plausible shapes (T-003).
- Remaining uncertainty is practical and operational (capacity, memory, async parity, reliability), not conceptual.

`S73-D02` should be recorded in `S73-T-006`, not in this task.

---

## 14. Draft Phase 2 acceptance criteria (if proceeding)

These are draft criteria for the generated-image vertical slice only.

1. Reopen workflow in a new browser session and regenerate preview without reattaching any previously attached generated image in the tested bands.
2. Regenerate standalone HTML and learner-package ZIP from durable workflow+resource state with no requirement to reuse stale `utilitiesLastHtml`.
3. Demonstrate prompt-independent reuse: resources remain renderable/exportable after prompt context loss.
4. Document and enforce provisional operational limits (warning and hard-stop behavior) for size/capacity conditions discovered in tests.
5. Provide deterministic handling for replace/orphan/missing-resource conditions.
6. Prove browser/Node parity for projection-render-package tests in CI-reproducible fixtures.

These criteria define proof obligations; they do not select final storage technology or schema.

---

## 15. Evidence references (docs, code, tests)

### Phase 1 discovery documents

- [S73-T-001-generated-image-lifecycle-discovery.md](S73-T-001-generated-image-lifecycle-discovery.md)
- [S73-T-002-canonical-workflow-resource-ownership.md](S73-T-002-canonical-workflow-resource-ownership.md)
- [S73-T-003-persistence-strategy-evaluation.md](S73-T-003-persistence-strategy-evaluation.md)
- [S73-T-004-export-and-regeneration-path-implications.md](S73-T-004-export-and-regeneration-path-implications.md)

### Key source references

- `app.js` (workspace hydration/refresh, preview/export orchestration, `utilitiesLastHtml`)
- `lib/prism-visual-assets.js` (asset association, manifest projection, image intake limits)
- `lib/utilities-visual-jobs-workspace.js` (workspace build/rebuild behavior)
- `lib/learner-renderer-vnext/render-learner-page.js`
- `lib/learner-renderer-vnext/render-page.js`
- `lib/learner-package.js`
- `lib/learner-package-zip.js`
- `index.html` (browser script-load and parity risk surface)

### Existing tests relevant to regeneration feasibility

- `tests/utility-utilities-page-export-pipeline.test.js`
- `tests/sprint-70-slice-e2-learner-package-rewrite.test.js`
- `tests/sprint-70-slice-e3-learner-package-zip.test.js`
- `tests/sprint-70-final-expandable-learner-images.test.js`
- `tests/learner-renderer-vnext-visual-affordances.test.js`

---

## Explicit non-deliverables (honoured)

- No storage implementation.
- No runtime/renderer/package code changes.
- No final storage technology selection.
- No schema definition.
- No persistence of HTML or ZIP as canonical resources.
- No scope expansion into PB-FA-003 pipeline integrity.
