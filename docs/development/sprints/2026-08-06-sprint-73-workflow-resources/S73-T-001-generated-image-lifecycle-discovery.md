# S73-T-001 — Generated-image lifecycle discovery

**Task:** S73-T-001  
**Sprint:** 73 — Workflow Resources  
**Type:** Phase 1 architecture discovery (evidence only)  
**Date:** 2026-08-06  
**Status:** Complete (observations recorded; canonical ownership **not** decided — deferred to S73-T-002; no implementation)

---

## Executive summary

Prism’s generated-image path is a **multi-stage, mostly text-first pipeline** with **session-only image bytes**:

| Lifecycle segment | Persisted today? | Current implementation location (observed) |
| ----------------- | ---------------- | -------------------------------------------- |
| Visual planning (`visual_affordances[]`) | Yes — in workflow step captures / page JSON | Design Page partial → assembled page artefact |
| Visual jobs + image briefs | No — recomputed from page | `prism-visual-jobs-planner` + `prism-image-brief-compiler` |
| Image generation (provider) | External to Prism core | Copilot / VEU / manual file intake |
| Image bytes + associations | **No** — browser session only | `app.js` + `utilities-visual-jobs-workspace` + `prism-visual-assets` |
| Rendered learner HTML | Transient until export snapshot | `learner-renderer-vnext` + `app.js` Utilities preview state |
| Export package (`assets/*.png`) | At ZIP download only | `learner-package.js` + `learner-package-zip.js` |

**Key observation:** No durable **canonical owner** of image bytes is evident from the current implementation. Stable semantic IDs exist (`affordance_id`, derived `job_id` / `brief_id` / `asset_id`), but **`render_source` (typically `data_url`) is held only in `state.utilitiesOutputWorkspace.assetsByBriefId`**, which is cleared on workspace refresh. *(Canonical ownership remains undecided — S73-T-002.)*

**Scope:** Generated images on the Sprint 70 visual-jobs / Sprint 38 affordance path only. Legacy workflow-definition `outputType: "image"` brief fields in `app.js` are a **separate, unintegrated** author-UI path.

---

## Lifecycle map

```text
[1] Design Page (Copilot) ──► page JSON: visual_affordances[], visual_affordance_schema_version
         │                        (persisted in workflow run captures / localStorage runstate)
         ▼
[2] Page assembly ──► page-vnext-assemble preserves visual planning fields on assembled page
         │
         ▼
[3] Visual planning contract ──► validateVisualPlanningContract(page)
         │
         ▼
[4] Visual jobs planner ──► planPrismVisualJobs(page) → jobs[] with job_id (transient)
         │
         ▼
[5] Image brief compiler ──► compilePrismImageBriefs() → briefs[] with generation_instruction (transient)
         │
         ├─► [5a] Copy prompt → external Copilot / VEU (generated PNG files external)
         │
         └─► [5b] Manual intake (file picker / drag / paste) → decodeImageFileForVisualJob → data_url + object_url
                    │
                    ▼
[6] Utilities workspace ──► assetsByBriefId[brief_id] → visualAssetManifest (session ephemeral)
         │
         ▼
[7] Learner render ──► renderLearnerPageHtml(page, { visualAssets: manifest })
         │                 buildVisualAssetResolver → figure HTML with img src=data_url (or hidden hook)
         ▼
[8] Export paths
         ├─► Preview iframe: data_url → blob: substitution (transient)
         ├─► utilitiesLastHtml: durable data_url (session snapshot)
         └─► Learner package ZIP: decode data_url → assets/*.png + HTML rewrite (download-time only)
```

---

## Stage-by-stage evidence

### Stage 1 — Planning (Design Page / visual affordances)

| Aspect | Observation |
| ------ | ----------- |
| **Implementing module** | Design Page partial contract: `lib/ld-design-page-partial-contract.js`; validation: `lib/sprint38-visual-affordances.js`, `lib/visual-planning-contract.js` |
| **Inputs** | Upstream page composition; Copilot-authored Design Page JSON |
| **Outputs** | Page root fields: `visual_affordance_schema_version`, `visual_affordances[]` |
| **Data structure** | Each affordance row: `affordance_id`, `visual_decision` (`generate`/`defer`/`skip`/`reject`), `visual_slot`, `scope`, `activity_id`, pedagogical fields (`purpose`, `subject`, `alt_text`, `detailed_description`, evidence anchors, etc.) |
| **Image identifier** | `affordance_id` (author-facing stable planning ID) |
| **Representation** | **Prompt/metadata only** — no image bytes, URLs, or PNG references |
| **Persistence** | Survives workflow refresh via `capturedOutputs` / `capturedOutputsRaw` in `promptr.workflows.runstate.v1` localStorage (`app.js` `buildWorkflowRunStateSnapshotForCurrentSelection`, lines ~27168–27186) |

**Evidence:** `lib/page-vnext-assemble.js` — `DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS` includes `visual_affordances`, `visual_affordance_schema_version`.

---

### Stage 2 — Visual job creation (deterministic planner)

| Aspect | Observation |
| ------ | ----------- |
| **Implementing module** | `lib/prism-visual-jobs-planner.js` |
| **Inputs** | Assembled page with validated `visual_affordances[]` |
| **Outputs** | `planPrismVisualJobs(page)` → `jobs[]`, diagnostics; each job carries resolved evidence sources |
| **Data structure** | Job fields mirror affordance core fields + `job_id` |
| **Image identifier** | `job_id` — deterministic: `vj-{schema}-{affordance_id}-{scope}-{activity\|page}-{visual_slot}` (`buildJobId`, lines ~621–632) |
| **Representation** | **Structured planning record** — no image asset |
| **Persistence** | **Transient** — recomputed on every `buildVisualJobsPipelineFromPage` call |

Module header explicitly excludes assets: *“No prompts, providers, assets, or rendering.”*

---

### Stage 3 — Image brief compilation

| Aspect | Observation |
| ------ | ----------- |
| **Implementing module** | `lib/prism-image-brief-compiler.js` |
| **Inputs** | Planner result (`jobs[]`) |
| **Outputs** | `compilePrismImageBriefs()` → `briefs[]` with `generation_instruction`, human-facing prompt text |
| **Data structure** | Brief includes `brief_id` (`vb-` + job suffix), pedagogical passthrough, `generation_instruction` |
| **Image identifier** | `brief_id` — derived from `job_id` via `briefIdFromJobId` |
| **Representation** | **Prompt** (`generation_instruction`) — machine-oriented image generation text; explicitly not learner HTML |
| **Persistence** | **Transient** — no storage; test asserts no persistence introduced (`tests/sprint-70-slice-5-image-brief-compiler.test.js`) |

---

### Stage 4 — Image generation (external / manual)

#### Path A — External generation (Copilot / Visual Enhancement Utility)

| Aspect | Observation |
| ------ | ----------- |
| **Implementing module** | External: `utilities/visual-enhancement-utility/visual-enhancement-utility-v1.2.1.json` |
| **Inputs** | Enhanced HTML with hooks; optional affordance JSON handover |
| **Outputs** | Step 1: `image_queue[]` with prompts + filenames; Step 2: `generated_image` JSON + downloaded PNG |
| **Representation** | **Temporary files** in Copilot chat (`images/VO1-example.png` convention per VEU README) |
| **Persistence** | **Outside Prism workflow state** — author manually brings PNG back via Path B |

Prism Utilities exposes **copy human prompt / generation instruction** to clipboard — no in-app provider API.

#### Path B — Manual intake (in-app)

| Aspect | Observation |
| ------ | ----------- |
| **Implementing module** | `app.js` (`decodeImageFileForVisualJob`, `applyVisualJobAssetFile`); association logic: `lib/prism-visual-assets.js` |
| **Inputs** | User-selected PNG/JPEG/WebP file |
| **Outputs** | Asset record in `assetsByBriefId[brief_id]` |
| **Representation** | **`render_source`:** `{ kind: "data_url", value: "data:image/...;base64,..." }`; **`preview_source`:** `{ kind: "object_url", value: "blob:..." }` |
| **Image identifier** | `asset_id` = `asset-{normalized-brief-id}` (`buildAssetIdForBrief`); stable across replace on same brief |
| **Persistence** | **Session only** — `prism-visual-assets.js` header: *“no network, no persistence, no renderer mutation”* |

---

### Stage 5 — Workflow / Utilities workspace state

| Aspect | Observation |
| ------ | ----------- |
| **Implementing module** | `lib/utilities-visual-jobs-workspace.js` (pipeline); `app.js` (`state.utilitiesOutputWorkspace`) |
| **Inputs** | Assembled page snapshot |
| **Outputs** | Workspace object: `assembledPageSnapshot`, `plannerResult`, `compilerResult`, `assetsByBriefId`, `visualAssetManifest`, UI state |
| **Key fields** | `assetsByBriefId`: map `brief_id → asset`; `visualAssetManifest`: `{ manifest_version, assets[], missing_brief_ids[] }` from `buildVisualAssetManifest` |
| **Representation** | **Workflow JSON (page)** + **session map (bytes as data_url)** |
| **Reset behaviour** | `buildVisualJobsWorkspaceState` sets `assetsByBriefId = {}` (lines ~848–848); `refreshUtilitiesOutputWorkspaceFromPage` revokes object URLs and rebuilds workspace (`app.js` ~48101–48104) |

**Workflow runstate (`localStorage`):** stores text captures per step — **no image bytes, no `assetsByBriefId`, no manifest**.

---

### Stage 6 — Learner page construction

| Aspect | Observation |
| ------ | ----------- |
| **Implementing module** | `lib/learner-renderer-vnext/build-page-model.js`, `build-visual-affordance-placements.js`, `render-learner-page.js` |
| **Inputs** | Assembled page JSON; optional `visualAssets` manifest passed at render time |
| **Outputs** | Page model with `VisualAffordanceHook` descriptors (`slot`, `activityId`, `affordanceId`, `subject`) |
| **Image in model?** | **No** — images are not embedded in page model; hooks only |
| **Representation** | Planning hooks; figures appear only when manifest supplied |

`attachVisualAffordancePlacements` uses Sprint 38 render plan from page `visual_affordances[]`.

---

### Stage 7 — Rendering

| Aspect | Observation |
| ------ | ----------- |
| **Implementing module** | `lib/learner-renderer-vnext/render-page.js`, `render-visual-affordance.js` |
| **Inputs** | Page model + optional `visualAssets` manifest |
| **Outputs** | HTML string |
| **Resolver** | `buildVisualAssetResolver` — match by `affordance_id` (primary) or `scope|activity_id|visual_slot` (fallback) |
| **With asset** | `<figure>` + `<img src="{render_source.value}">` — typically inline **data_url** |
| **Without asset** | Hidden `<div class="util-visual-affordance" data-visual-slot="..." hidden>` |
| **DOM identifiers** | `data-figure-id`, `data-visual-slot`, `data-learner-content-kind="image"`, `data-figure-number` |
| **Representation in HTML** | **data_url** in `src` (durable form) or **blob:** in iframe preview path only |

Browser entry: `window.PRISM_LEARNER_RENDERER_VNEXT.renderLearnerPageHtml` from `lib/learner-renderer-vnext-browser.js` (built by `scripts/build-learner-renderer-vnext-browser.js`).

---

### Stage 8 — Export and browser/public bundle

#### Utilities HTML snapshot

| Aspect | Observation |
| ------ | ----------- |
| **Implementing module** | `app.js` — `runUtilityPageExportPipeline`, `runLearnerRendererVNextExport`, `state.utilitiesLastHtml` |
| **Pipeline** | Assemble page (optional) → vNext render with `visualAssets` → `composeStandaloneVnextLearnerExport` |
| **Representation** | HTML with inline `data_url` in `<img src>` after `normalizeUtilitiesVisualAssetSourcesForDurableHtml` |

#### Preview vs durable split

| Function | Behaviour |
| -------- | --------- |
| `buildIframePreviewHtmlFromRendered` | Replaces `data_url` → `blob:` for iframe performance (`app.js` ~48311–48334) |
| `normalizeUtilitiesVisualAssetSourcesForDurableHtml` | Replaces `blob:` → `data_url` before storing `utilitiesLastHtml` (~48337–48368) |

#### Learner package (ZIP)

| Aspect | Observation |
| ------ | ----------- |
| **Implementing module** | `lib/learner-package.js`, `lib/learner-package-zip.js` |
| **Entry** | `handleUtilitiesDownloadLearnerPackage` — passes `utilitiesLastHtml` + manifest snapshot (`app.js` ~49760–49804) |
| **Path assignment** | `assignPackageAssetPaths` → `assets/{visual_slot}.ext` or `assets/activity-{id}-{slot}.ext`; collision suffix from `brief_id` |
| **HTML rewrite** | `rewriteHtmlImageSources` — exact `data_url` → relative `assets/...` path |
| **Bytes** | Decoded from `data_url` at package build time; **blob: rejected** (`decodeImageDataUrl`) |
| **Representation in package** | **Exported asset files** + relative paths in HTML |

#### VEU convention (external)

Separate path convention: `images/*.png` beside `enhanced-learner-page.html` — **not** the Prism `assets/` learner-package layout.

#### Browser bundle parity (Sprint 72 lesson)

- Renderer bundle: `lib/learner-renderer-vnext-browser.js` — includes visual affordance rendering/resolver.
- Visual-jobs / asset / package modules: loaded as **separate scripts** in `index.html` (lines ~1055–1061), not inside renderer bundle.
- Node tests can pass against source modules while browser bundle is stale if not rebuilt.

---

## Identifier catalog (observed)

| ID | Format / example | Created by | Stored in (today) |
| -- | ---------------- | ---------- | ------------------- |
| `affordance_id` | Author-defined, e.g. `va-a1-concept-map-01` | Design Page | Page JSON / run captures |
| `job_id` | `vj-38-4-{affordance}-...` | Planner | Transient planner result |
| `brief_id` | `vb-38-4-{affordance}-...` | Compiler | Transient compiler result |
| `asset_id` | `asset-{brief-id-normalized}` | `prism-visual-assets` | Session `assetsByBriefId` only |
| Package path | `assets/activity-a1-materials-entry.png` | `learner-package` | ZIP export only |
| VEU filename | `VO1-example.png` | External VEU | Copilot download / `images/` folder |

---

## Custody and storage boundary observations (S73-T-001 only)

**This section records implementation observations only.** It describes where generated-image data and bytes are **currently stored, held, or processed** in the codebase. It does **not** determine **canonical ownership** of a workflow resource — that analysis is deferred to **S73-T-002**. Candidate locations below are **custody/storage observations**, not architectural conclusions.

Observed **candidate locations** and what each **currently holds** for generated images:

| Candidate location | Current custody / storage (observed) | Not held here (observed) |
| ------------------ | ------------------------------------ | ------------------------ |
| **Workflow data** (run captures / localStorage) | Design Page text JSON including `visual_affordances[]` | Image bytes, `render_source`, manifest |
| **Workflow step** (Design Page step output) | Same — planning metadata per step capture | Generated PNGs, associations |
| **Visual job** (planner/compiler) | Derived `job_id`, `brief_id`, `generation_instruction` (transient, recomputed) | Durable storage; recomputed each session |
| **Learner page** (assembled page artefact) | Affordance planning rows; hook placement derived at render | No embedded image payloads |
| **Export package** | Snapshot of HTML + decoded PNG files at download | Not a live workflow store; not rehydrated on load |
| **Shared resource/asset store** | **Does not exist** for images in current implementation | N/A |
| **Utilities session state** (`assetsByBriefId`) | **Observed current byte holder** — image bytes as `data_url` for the active Utilities session | Not in workflow persistence; cleared on refresh |

**Boundary observations (implementation only):**

1. **Planning vs bytes split:** Page JSON and runstate **hold planning intent**; the Utilities session workspace **holds image bytes transiently** — no persisted bridge between them in current code.
2. **Render is manifest-fed:** Renderer does not retain bytes; caller must supply `visualAssets` on each render.
3. **Export is copy-out:** Package builder reads manifest + HTML snapshot; does not write back to workflow.
4. **External generation gap:** VEU/Copilot PNGs enter Prism only through manual re-intake — no automated ingest.
5. **Legacy parallel path:** Workflow definition `outputType: "image"` brief fields (`app.js` ~621, ~23522) are UI/authoring metadata — **not wired** to visual-jobs pipeline.

**Canonical ownership:** **Not determined in S73-T-001** — feeds **S73-T-002**.

---

## Persistence observations

| Stage | Survives refresh? | Survives regeneration? | Survives export? | Survives browser bundle? | Transient only? | Persistence opportunity (observation) | Architectural constraint (observation) |
| ----- | ----------------- | ---------------------- | ---------------- | ------------------------ | --------------- | --------------------------------------- | ---------------------------------------- |
| `visual_affordances[]` | **Yes** (runstate) | **Yes** (re-authored) | Indirect (in assembled page JSON if exported as text) | N/A (data, not bundle) | No | Stable semantic anchor for resource identity | Text-only; no byte linkage |
| Visual jobs / briefs | Recomputed | Recomputed | No | N/A | **Yes** | Could re-derive from page — already deterministic | No storage by design (Sprint 70) |
| `generation_instruction` | With page | With page | No (not in learner HTML) | N/A | Partially | Prompt-independence requirement: image may outlive prompt if bytes persisted separately | Learner HTML uses `alt_text` + `detailed_description`, not generation prompt |
| Manual `assetsByBriefId` | **No** | **No** — workspace reset on page refresh / many preview paths | **Only if** user downloads HTML/ZIP first | **No** | **Yes** | Primary user-visible gap: attach then refresh loses images | `refreshUtilitiesOutputWorkspaceFromPage` clears assets; UX guard tries to avoid reset when assets attached (`app.js` ~49583–49610) |
| `object_url` / `blob:` preview | **No** | **No** | **No** (rejected for package) | Session | **Yes** | Preview optimization only | Must normalize to `data_url` before durable export |
| `data_url` in HTML | Session (`utilitiesLastHtml`) | Lost on workspace reset | **Yes** in downloaded HTML/ZIP | Inline in standalone export HTML | Partially | Durable within session/export snapshot | Large inline base64; not in workflow JSON |
| ZIP `assets/*.png` | N/A | N/A | **Yes** (file on disk) | N/A | No (file) | Closest current durable binary form | Not re-imported into workflow; one-way export |
| VEU `images/*.png` | External | External | External package | N/A | External | Separate convention from Prism `assets/` | Manual handoff required |

---

## Export observations

### Path rewriting

| Location | Mechanism |
| -------- | --------- |
| `lib/learner-package.js` `assignPackageAssetPaths` | Deterministic `assets/...` paths from `scope`, `activity_id`, `visual_slot`, `brief_id` collision suffix |
| `lib/learner-package.js` `rewriteHtmlImageSources` | Exact string replace: full `data_url` → relative path (incl. HTML-escaped variants) |
| `app.js` `buildIframePreviewHtmlFromRendered` | `data_url` → `blob:` (preview only — reversed before export) |
| `app.js` `normalizeUtilitiesVisualAssetSourcesForDurableHtml` | `blob:` → `data_url` before `utilitiesLastHtml` / download |

### Browser/public path handling

- Production Utilities uses **browser-loaded** `PRISM_LEARNER_RENDERER_VNEXT` + separate visual-asset scripts (`index.html`).
- Export pipeline: `runUtilityPageExportPipeline` → optional workflow assembly from captures → vNext render with manifest.
- Standalone export embed: `composeStandaloneVnextLearnerExport` / export runtime scripts — **draft persistence for learner drafts, not images** (`learner-renderer-vnext-export-runtime`).

### Packaging behaviour

- `buildLearnerPackage` requires `render_source.kind === "data_url"` — assets without durable data URL are **omitted with warnings**.
- ZIP contains `learner-page.html` + binary files under `assets/`.
- Export is **read-only snapshot** — does not mutate workspace, page JSON, or planner state (`app.js` comment ~49787).

### Assumptions affecting durable Workflow Resources

1. **Durable export form today is `data_url`** — any persistence model must either preserve data URLs or map to addressable files with stable rewrite semantics.
2. **`brief_id` / `affordance_id` already link planning → asset → export path** — candidate keys for Workflow Resources identity.
3. **Two filesystem conventions** (`assets/` vs VEU `images/`) — export/import alignment unresolved.
4. **No round-trip:** exported ZIP cannot be loaded back into Utilities workspace with assets restored.
5. **Manifest is session-derived:** `visualAssetManifest` rebuilt from `assetsByBriefId` + compiler briefs — not loaded from workflow storage.
6. **S72-D09 constraint:** any image persistence must align with future shared workflow asset-persistence model (author-evidence associations) — currently isolated.
7. **S72-D10 boundary:** Copilot attachment **bytes** remain a separate deferred path — distinct from generated-image PNG intake.

---

## Prompt-independence (durability requirement — evaluate only)

| Observation | Evidence |
| ----------- | -------- |
| Learner-facing HTML does **not** embed `generation_instruction` | Compiler note: learner HTML uses `alt_text` + `detailed_description` (`prism-image-brief-compiler.js` ~456) |
| If page JSON lost but bytes retained, alt/description could be lost | Descriptions live in `visual_affordances[]` rows and asset copy — both session/page bound |
| Replacing image on same brief preserves `asset_id` | `replaceVisualAssetAssociation` (`prism-visual-assets.js` ~236–242) |
| Regenerating page from captures restores planning text, not images | Runstate has no byte fields |

**Evaluation status:** Requirement is **not satisfied today** for session-attached images — loss of workspace or page context loses association even if author still holds PNG file.

---

## Resource-type neutrality (observation only)

Current implementation is **image-specific** (PNG/JPEG/WebP MIME validation, `render_source` kinds, figure HTML). However, identifier patterns (`brief_id`, manifest shape) are **not inherently image-only** — manifest is an array of asset records with scope/slot/affordance linkage. No generic “workflow resource” type exists yet.

---

## Evidence references (source files)

### Core pipeline

| File | Relevance |
| ---- | --------- |
| `lib/ld-design-page-partial-contract.js` | Design Page visual planning contract |
| `lib/sprint38-visual-affordances.js` | Affordance schema |
| `lib/visual-planning-contract.js` | Planning validation gate |
| `lib/prism-visual-jobs-planner.js` | Visual job derivation |
| `lib/prism-image-brief-compiler.js` | Image brief / generation_instruction |
| `lib/utilities-visual-jobs-workspace.js` | Workspace pipeline orchestration |
| `lib/prism-visual-assets.js` | Asset association + manifest (no persistence) |
| `lib/page-vnext-assemble.js` | Preserves visual fields on assembly |

### Runtime / UI

| File | Relevance |
| ---- | --------- |
| `app.js` | Workspace state, intake, preview/export normalization, runstate |
| `index.html` | Script load order (visual jobs + renderer bundle) |

### Render

| File | Relevance |
| ---- | --------- |
| `lib/learner-renderer-vnext/render-learner-page.js` | Entry render API |
| `lib/learner-renderer-vnext/build-visual-affordance-placements.js` | Hook placement |
| `lib/learner-renderer-vnext/render-page.js` | Asset resolver |
| `lib/learner-renderer-vnext/render-visual-affordance.js` | Figure HTML emission |
| `lib/learner-renderer-vnext-browser.js` | Browser bundle |

### Export

| File | Relevance |
| ---- | --------- |
| `lib/learner-package.js` | Path assignment, data_url decode, HTML rewrite |
| `lib/learner-package-zip.js` | ZIP serialization |
| `utilities/visual-enhancement-utility/visual-enhancement-utility-v1.2.1.json` | External VEU generation contract |
| `utilities/visual-enhancement-utility/README.md` | VEU handover modes |

### Tests / fixtures

| File | Relevance |
| ---- | --------- |
| `tests/fixtures/page-assemble/roman-roads-visual-jobs-valid.json` | Page with visual affordances |
| `tests/sprint-70-slice-4-visual-jobs-planner.test.js` | Planner |
| `tests/sprint-70-slice-5-image-brief-compiler.test.js` | Compiler; no persistence assertion |
| `tests/sprint-70-slice-8-two-pane-manual-assets.test.js` | Manual intake + render |
| `tests/sprint-70-slice-e2-learner-package-rewrite.test.js` | Export rewrite |
| `tests/learner-renderer-vnext-visual-affordances.test.js` | Renderer + manifest |

### Prior documentation

| File | Relevance |
| ---- | --------- |
| `docs/development/sprints/2026-07-28-sprint-70-visual-planning-and-synthesis/prism-visual-jobs-planner.md` | Planner design — no file persistence at planning |
| `docs/development/sprints/2026-07-28-sprint-70-visual-planning-and-synthesis/learner-package-export.md` | Export design |

---

## Inputs to subsequent Phase 1 tasks

| Task | This discovery provides |
| ---- | ----------------------- |
| **S73-T-002** (canonical ownership) | Candidate location table; observed split between page JSON (planning custody) and session workspace (transient byte custody); no shared durable store evident |
| **S73-T-003** (storage strategy) | Current forms: text JSON, data_url, blob, ZIP files; manifest keyed by `brief_id` |
| **S73-T-004** (export implications) | Rewrite chain, dual path conventions, round-trip gap, browser bundle split |
| **S73-T-005** (feasibility synthesis) | Evidence that semantic IDs exist but byte persistence is absent; refresh loss reproduced by code paths |

---

## Explicit non-findings (out of scope for S73-T-001)

- No implementation or storage design proposed.
- No change to evidence architecture.
- PDF / Word / video paths not traced (not on generated-image lifecycle).
- Legacy workflow `outputType: "image"` not fully traced — noted as parallel, unintegrated.
