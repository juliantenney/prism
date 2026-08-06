# S73-T-002 — Canonical Workflow Resource ownership analysis

**Task:** S73-T-002  
**Sprint:** 73 — Workflow Resources  
**Type:** Phase 1 architecture analysis (no implementation)  
**Date:** 2026-08-06  
**Prerequisite:** [S73-T-001-generated-image-lifecycle-discovery.md](S73-T-001-generated-image-lifecycle-discovery.md) (authoritative evidence base)  
**Status:** Complete (recommendation recorded; persistence technology **not** chosen)

---

## Executive recommendation

**Recommended canonical owner:** a **workflow-scoped Workflow Resources layer** — a logical registry that holds durable resource identity, byte or addressable payload, workflow linkage, and lifecycle metadata for each Workflow Resource **within a workflow run**.

This layer **does not exist as a first-class module today**. It is the architectural gap T-001 exposed. It should **not** be equated with current custody locations (especially Utilities session state).

| Role | Recommended assignment |
| ---- | ---------------------- |
| **Canonical owner** | **Workflow-scoped Workflow Resources layer** (to be introduced; anchored to workflow / run identity) |
| **Primary intent contributor** | **Learner page artefact** (`visual_affordances[]` / assembled page JSON) — semantic anchor via `affordance_id` |
| **Derived planning** | **Visual job** + **image brief** pipeline — deterministic derivatives, not owners |
| **Transient working state** | **Utilities workspace** (`assetsByBriefId`, manifest assembly UI) |
| **Render input** | **Visual asset manifest** (projection passed to renderer) |
| **Export artefact** | **Learner package** / HTML snapshot — downstream consumer |

**Rejected as canonical owner (architectural reasoning):** Utilities workspace, visual job, image brief, export package, renderer, and learner page **as currently shaped** — each lacks one or more owner responsibilities or is explicitly derived/transient/consuming.

**Partial contributor (not owner):** **Workflow data / workflow step captures** — durable workflow persistence boundary for **text** artefacts; must **reference** the Workflow Resources layer rather than absorb binary payloads inline.

---

## 1. Responsibilities of a canonical Workflow Resource owner

Derived from Sprint 73 charter constraints, T-001 evidence, and `S72-D09` / `S72-D10`. Refinement notes cite evidence; list is **not closed**.

| ID | Responsibility | Rationale (architectural) | T-001 / binding evidence |
| -- | -------------- | ------------------------- | ------------------------ |
| **R1** | **Stable resource identity** | Same resource remains addressable across attach, replace, refresh, export, and selective regeneration | Identifiers exist (`affordance_id`, `brief_id`, `asset_id`) but byte linkage is not durable (T-001 identifier catalog) |
| **R2** | **Lifecycle authority** | Define create / attach / replace / detach / supersede semantics; one authoritative record per resource identity | Utilities workspace can replace on same brief but has no durable lifecycle contract (T-001 Stage 4–5) |
| **R3** | **Workflow intent association** | Bind each resource to workflow meaning (e.g. affordance, slot, activity scope) independent of UI session | Page JSON holds intent; bytes do not (T-001 custody split) |
| **R4** | **Persistence boundary** | Decide what survives workflow save/load, refresh, navigation — **not** preview/export-only | Runstate persists text captures only (T-001 Stage 5) |
| **R5** | **Refresh / navigation survival** | Resources remain available when Utilities workspace is rebuilt | Workspace reset clears bytes (T-001 persistence matrix) |
| **R6** | **Export participation** | Supply canonical bytes + metadata for package/HTML rewrite **without being defined by export** | Export reads manifest snapshot; no write-back (T-001 export observations) |
| **R7** | **Browser / public-path compatibility** | Resources resolvable on browser Utilities path and Node/test path without stale-bundle assumptions | Renderer bundle vs separate asset scripts (T-001 Stage 8) |
| **R8** | **Selective regeneration** | Reconnect new generation to stable identity when page planning unchanged or explicitly versioned | `replaceVisualAssetAssociation` preserves `asset_id` in session only (T-001 prompt-independence section) |
| **R9** | **Prompt independence** | Resource remains usable when `generation_instruction` or Copilot prompt is unavailable | Learner HTML uses alt/description, not generation prompt (T-001; compiler note) |
| **R10** | **Resource-type neutrality** | Owner model applies to generated media, uploads, embeds — not image-specialized | Current path is image-specific; manifest shape is loosely generic (T-001 resource-type neutrality) |
| **R11** | **`S72-D09` shared-model compatibility** | Same ownership/persistence model must eventually cover generated images **and** author-evidence associations | Binding decision; image path today is isolated from evidence associations |
| **R12** | **Authoritative metadata for render** | Provide render-facing fields (mime, dimensions, alt/description or references) without requiring renderer to own bytes | Renderer is manifest-fed (T-001 boundary obs. 2) |
| **R13** | **Provenance / generation metadata** | Record intake method, source, timestamps, optional generation lineage — for audit and regen | Asset record shape in `prism-visual-assets.js` (T-001 Stage 4B) — session-only today |

**Refinements from evidence:**

- **R9** implies the owner must hold **learner-usable metadata** (or references to it), not only provider prompts.
- **R11** rules out an owner that is **Utilities-visual-jobs-only** or **image-pipeline-only**.
- **R4–R5** imply the owner must sit **inside or behind the workflow persistence boundary**, not inside a Utilities UI session.

---

## 2. Candidate ownership evaluation

**Classification key:** CO = canonical owner · CT = contributor · DA = derived artefact · CA = cache / transient workspace · PR = projection · CN = consumer · EX = export representation only · — = not applicable

| Candidate | Classification | Fulfils (responsibilities) | Cannot fulfil | Advantages | Limitations | Architectural consequences if treated as owner |
| --------- | -------------- | --------------------------- | ------------- | ---------- | ----------- | ---------------------------------------------- |
| **Workflow data** (run captures / runstate) | **CT** (persistence host) | R3 partial (page JSON intent), R4 partial (durable text boundary exists) | R1–R2 for bytes, R5 for images, R10–R11 as-is, R12 without overloading captures | Established save/load path (`promptr.workflows.runstate.v1`) | Binary-in-JSON would bloat captures; mixes step outputs with media; no resource lifecycle API | Runstate becomes monolithic blob store; breaks stage separation; poor resource-type neutrality |
| **Workflow step** (Design Page capture) | **CT** | R3 (affordance rows authored here), provenance for planning | R1–R2, R4–R6 for bytes, R8–R11 | Clear stage ownership of **planning intent** | Step output is **partial page JSON**, not resource store | Confuses instructional authoring with media custody |
| **Visual job** | **DA** | Deterministic identity helper (`job_id`) | R1 durable, R2, R4–R9, R11 — explicitly non-persistent | Recomputable from page; no storage by design | Transient; disappears on workspace rebuild | Regen would lose resources whenever page re-planned |
| **Image brief** | **DA** | Prompt compilation (`generation_instruction`); derived `brief_id` | R1 durable, R2, R4–R6, **R9** (prompt-bound), R10–R11 | Clean provider-neutral prompt layer | **Prompt is not the resource**; briefs recomputed | Prompt-independence violated; owner tied to generation episode |
| **Learner page** (assembled artefact) | **CT** | R3 (`affordance_id`, slots, alt/description intent), semantic anchor for resolver | R1–R2 for bytes, R4–R6, R8 as binary store | Instructional artefact already durable in runstate | Page model excludes images by design (T-001 Stage 6) | Embedding binaries in page JSON couples content + media; undermines renderer manifest pattern |
| **Utilities workspace** | **CA** | R12 partial (manifest assembly), R2 partial (attach/replace in session) | **R4–R5**, R6 authoritative, R8–R11, durable R1 | Rich authoring UX; existing attach flow | **Explicitly non-persistent** module boundary | Refresh data loss permanent; cannot satisfy Workflow Resources product goal |
| **Visual asset manifest** | **PR** | R12 render-time aggregation | R1–R5, R2 lifecycle, R6 alone, R8–R11 | Clean renderer contract | Built from workspace each session (`buildVisualAssetManifest`) | Manifest without backing store is a view, not owner |
| **Export package** | **CN / EX** | R6 output snapshot | R1–R5, R2, R8–R11, R7 live workflow | Portable distributable artefact | One-way; no rehydration (T-001) | Export becomes source of truth — breaks authoring loop |
| **Shared Workflow Resource / asset store** (logical; **not implemented**) | **CO** *(recommended)* | R1–R2, R4–R6, R8–R11 *(when implemented)*, R10 | None inherent — implementation risk only | Matches `S72-D09`; resource-type-neutral by design intent; separates bytes from page JSON | Does not exist; needs workflow anchor and reference model | Enables feasibility for PB-FA-001 without relocating renderer or page ownership |
| **Renderer (vNext)** | **CN** | R12 consumption, hook resolution | R1–R5, R2, R6 source, R8–R11 | Stateless rendering scale | Manifest-fed by design | Media hidden in HTML only — duplicates export snapshot problem |
| **External VEU / Copilot** | **—** (out of scope) | Generation outside Prism | All in-workflow responsibilities | External compute | No workflow identity | Not a Prism ownership candidate |

---

## 3. Ownership responsibility matrix

Rows = responsibilities (R1–R13). Columns = candidates.  
**Legend:** ✓ = can fulfil architecturally · p = partial · ✗ = cannot · n/a = not applicable

| Resp. | Workflow data | Workflow step | Visual job | Image brief | Learner page | Utilities workspace | Manifest | Export pkg | **Workflow Resources layer** | Renderer |
| ----- | ------------- | ------------- | ---------- | ----------- | ------------ | ------------------- | -------- | ---------- | ------------------------------ | -------- |
| R1 Stable identity | p | p | p | p | p | p | ✗ | ✗ | **✓** | ✗ |
| R2 Lifecycle authority | ✗ | ✗ | ✗ | ✗ | ✗ | p | ✗ | ✗ | **✓** | ✗ |
| R3 Intent association | p | ✓ | p | p | **✓** | p | p | ✗ | **✓** | ✗ |
| R4 Persistence boundary | p | p | ✗ | ✗ | p | ✗ | ✗ | ✗ | **✓** | ✗ |
| R5 Refresh survival | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | **✓** | ✗ |
| R6 Export participation | ✗ | ✗ | ✗ | ✗ | ✗ | p | p | p | **✓** | ✗ |
| R7 Browser/public compat | p | p | ✗ | ✗ | p | p | p | p | **✓** *(req.)* | ✓ |
| R8 Selective regen | ✗ | ✗ | ✗ | ✗ | ✗ | p | ✗ | ✗ | **✓** | ✗ |
| R9 Prompt independence | ✗ | p | ✗ | ✗ | p | p | p | p | **✓** | n/a |
| R10 Type neutrality | ✗ | ✗ | ✗ | ✗ | p | ✗ | p | p | **✓** *(req.)* | p |
| R11 S72-D09 shared model | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | **✓** *(req.)* | ✗ |
| R12 Render metadata | ✗ | p | ✗ | ✗ | p | p | **✓** | p | **✓** | p |
| R13 Provenance metadata | ✗ | ✗ | ✗ | p | ✗ | p | p | p | **✓** | ✗ |

**Matrix conclusion:** Only the **Workflow Resources layer** (logical store, workflow-scoped) can satisfy the full responsibility set. Existing locations satisfy **subsets** and should remain **contributors, derivatives, caches, projections, or consumers**.

---

## 4. Ownership relationship diagram

```text
                    ┌─────────────────────────────────────────┐
                    │  CANONICAL OWNER (recommended)          │
                    │  Workflow-scoped Workflow Resources      │
                    │  • stable resource_id                    │
                    │  • durable payload / addressable ref     │
                    │  • lifecycle + provenance metadata       │
                    │  • links to workflow intent keys         │
                    └─────────────────┬───────────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          │                           │                           │
          ▼                           ▼                           ▼
   ┌──────────────┐          ┌──────────────┐            ┌──────────────┐
   │ CONTRIBUTORS │          │   DERIVED    │            │  TRANSIENT   │
   │              │          │              │            │   WORKSPACE  │
   │ • Workflow   │          │ • Visual job │            │              │
   │   step /     │          │ • Image brief│            │ • Utilities  │
   │   runstate   │          │   (prompts)  │            │   workspace  │
   │   (text      │          │              │            │   assetsBy   │
   │   captures)  │          │              │            │   BriefId    │
   │ • Learner    │          └──────┬───────┘            └──────┬───────┘
   │   page JSON  │                 │                           │
   │   visual_    │                 │ recompute                 │ attach/preview
   │   affordances│                 ▼                           │
   └──────┬───────┘          (deterministic from page)           │
          │ intent keys                                      hydrate / flush
          │ affordance_id ───────────────► link ────────────────┘
          │
          ▼
   ┌──────────────┐          ┌──────────────┐            ┌──────────────┐
   │ PROJECTIONS  │          │   RENDERER   │            │  CONSUMERS   │
   │              │          │   INPUTS     │            │              │
   │ • visualAsset│─────────►│ vNext render │            │ • Export pkg │
   │   Manifest   │          │ + resolver   │            │ • utilities  │
   │              │          │              │            │   LastHtml   │
   └──────────────┘          └──────────────┘            └──────────────┘
```

**Relationship rules (architectural):**

1. **Contributors supply keys and metadata; they do not hold authoritative bytes.**
2. **Derived artefacts (jobs/briefs) are recomputed; owner holds bindings across recompute.**
3. **Utilities workspace is a cache/editor view over owner records — not the owner.**
4. **Manifest is a read model for render/export, rebuilt from owner + derived planning.**
5. **Export artefacts are immutable snapshots — consumers only.**

---

## 5. Recommended canonical owner (detailed)

### What “Workflow-scoped Workflow Resources layer” means

A **logical ownership domain** — not yet a named module in the codebase — responsible for:

- Assigning and preserving **`resource_id`** (may align with today’s `asset_id` / stable `brief_id` / `affordance_id` binding policy — **policy choice deferred to T-003+**).
- Storing or referencing **durable payload** (bytes or stable URI) and **render metadata**.
- Maintaining **`workflow_id` / run scope** so resources survive Utilities workspace rebuild.
- Exposing **references** into workflow persistence (workflow data holds **refs**, not inline blobs).
- Serving **manifest assembly** for renderer and export pipelines.

### Why not an existing custody location

| Rejected candidate | Reason (responsibility-based, not custody-based) |
| ------------------ | ------------------------------------------------ |
| Utilities workspace | Responsible for **authoring UX and transient assembly**, not workflow durability (`prism-visual-assets` design boundary) |
| Learner page JSON | Responsible for **instructional content and visual planning intent**, not binary lifecycle (renderer manifest pattern) |
| Visual job / brief | **Derived** from page; responsible for **planning compilation**, not durable resource records |
| Export package | **Consumer** of snapshots; no round-trip or lifecycle |
| Workflow step capture alone | **Contributor** to intent and runstate persistence; overloading with bytes violates separation and `S72-D09` neutrality |

### Workflow data’s role (clarification)

**Workflow data / runstate** should remain the **persistence rail** for workflow-scoped **references and indices** into the Workflow Resources layer — analogous to how it already persists Design Page JSON while not owning rendered HTML.

---

## 6. Contributor / reference layer map

| Layer | Classification | References / keys supplied | Reads from owner | Writes to owner |
| ----- | -------------- | --------------------------- | ---------------- | --------------- |
| **Workflow step (Design Page)** | Contributor | `affordance_id`, planning rows | — | Indirect (authoring only) |
| **Workflow data / runstate** | Contributor + persistence rail | Step captures; future resource index refs | — | Should persist refs, not blobs |
| **Learner page (assembled)** | Contributor | `visual_affordances[]`, slots, alt/description | Resource metadata for display | — |
| **Visual job planner** | Derived | `job_id` | — | — |
| **Image brief compiler** | Derived | `brief_id`, `generation_instruction` | — | — |
| **Utilities workspace** | Cache / transient workspace | UI selection, attach errors | **Should** hydrate from owner | **Should** flush attach/replace to owner |
| **Visual asset manifest** | Projection | Manifest entries for render | Owner + attached briefs | — |
| **learner-renderer-vnext** | Consumer | Hook resolution | Manifest / render_source | — |
| **learner-package** | Consumer / export representation | Package paths | Manifest snapshot | — |
| **app.js Utilities export** | Orchestrator | Preview/export pipeline | Owner via manifest | — |

**Primary reference key (observed, not mandated):** linkage **`affordance_id` ↔ resource record** with derived **`brief_id` / `job_id`** for planning regeneration — T-001 identifier catalog.

---

## 7. Risks, assumptions, and unresolved questions

### Risks

| Risk | Description |
| ---- | ----------- |
| **Identity drift on page regen** | If page JSON changes affordance set, resource bindings may orphan or collide — owner needs explicit rebind/supersede rules (T-005) |
| **Runstate size / localStorage** | Workflow-scoped store may exceed text-capture scale if mis-designed as inline base64 — T-003 must evaluate |
| **Dual-path parity** | Browser bundle vs Node module paths must receive same owner API (T-001 Stage 8) |
| **S72-D09 scope creep** | Shared model with author-evidence may expand owner responsibilities beyond generated images |
| **False owner shortcut** | Treating Utilities workspace as owner would **appear** to work in-session but fail R4–R5 by design |

### Assumptions (explicit)

1. Workflow Resources remain **scoped to a workflow run** (not global CDN/library) for v1.0 slice.
2. **Renderer stays manifest-fed** — owner does not require renderer redesign (Sprint 73 boundary).
3. **`affordance_id` remains the semantic anchor** for generated-image slice unless T-003 disproves.
4. Introducing an owner layer **does not require** changing evidence architecture (`S72-D10` boundary preserved).

### Unresolved (for S73-T-003 … T-005 — not decided here)

| Question | Owner task |
| -------- | ---------- |
| Inline vs sidecar vs indexed blob store | T-003 |
| Whether owner store is embedded in runstate vs parallel keyed store | T-003 |
| Exact `resource_id` policy (reuse `asset_id` vs new UUID vs affordance-bound) | T-003 / T-005 |
| How much metadata duplicates page JSON vs references it (prompt-independence) | T-003 / T-005 |
| Attachment-byte resources under same owner (`S72-D10` / PB-R-001) | T-005 feasibility |
| Feasibility within localStorage / browser constraints | T-005 → **S73-D02** |

---

## 8. Implications for feasibility (S73-D02 — not decided here)

This analysis **does not** assert implementation feasibility. It establishes:

- **A canonical owner is architecturally identifiable** (Workflow Resources layer, workflow-scoped).
- **Current architecture lacks that layer** — gap is structural, not merely a missing field in `assetsByBriefId`.
- **Feasibility depends on T-003–T-005** — whether a durable owner can be introduced **without** violating runstate limits, renderer boundaries, export parity, and `S72-D09`.

If feasibility fails, failure is likely **implementation constraint** (storage rail, size, browser), **not** absence of an ownership model.

---

## 9. Evidence references

### From S73-T-001 (established facts — not re-derived)

- Lifecycle map and custody split (planning in page JSON; bytes in session workspace)
- Workspace reset on refresh (`buildVisualJobsWorkspaceState`, `refreshUtilitiesOutputWorkspaceFromPage`)
- Renderer manifest-fed pattern; export one-way snapshot
- Identifier catalog; persistence matrix; export rewrite chain
- Explicit statement: canonical ownership deferred to T-002

### Codebase anchors (architectural boundaries)

| File | Relevance to ownership |
| ---- | ------------------------ |
| `lib/prism-visual-assets.js` | Asset **shape** and manifest build; **no persistence** — rules out as owner |
| `lib/prism-visual-jobs-planner.js` | **Derived** jobs; no assets |
| `lib/prism-image-brief-compiler.js` | **Derived** briefs; prompts not resources |
| `lib/utilities-visual-jobs-workspace.js` | Pipeline + **session** workspace |
| `lib/page-vnext-assemble.js` | Page owns **visual planning fields** |
| `lib/learner-renderer-vnext/render-page.js` | **Consumer** resolver |
| `lib/learner-package.js` | **Export consumer** |
| `app.js` | Runstate persistence rail; Utilities orchestration |

### Binding decisions

| ID | Relevance |
| -- | --------- |
| `S72-D09` | Owner must support **shared** model (images + author-evidence) |
| `S72-D10` | Attachment bytes deferred — separate hard path; must not collapse into image owner by accident |

---

## 10. Inputs to subsequent Phase 1 tasks

| Task | T-002 provides |
| ---- | -------------- |
| **S73-T-003** (storage strategy) | Owner layer defined; workflow data as ref rail; reject inline-in-page and session-cache as owner |
| **S73-T-004** (export) | Owner participates in export; package remains consumer; manifest is projection |
| **S73-T-005** (feasibility synthesis) | Recommended owner + responsibility gaps → input to **S73-D02** |
| **S73-T-006** | Record **S73-D02** feasibility decision informed by T-003–T-005 |

---

## Explicit non-deliverables (honoured)

- No persistence technology chosen.
- No storage format or schema designed.
- No code or architecture modified.
- No answer to **how** the Workflow Resources layer is implemented — only **who** should own resources architecturally.
