# S73-T-004 — Export and regeneration-path implications

**Task:** S73-T-004  
**Sprint:** 73 — Workflow Resources  
**Type:** Phase 1 export / regeneration architecture analysis (no implementation)  
**Date:** 2026-08-06  
**Prerequisites:** [S73-T-001](S73-T-001-generated-image-lifecycle-discovery.md) · [S73-T-002](S73-T-002-canonical-workflow-resource-ownership.md) · [S73-T-003](S73-T-003-persistence-strategy-evaluation.md)  
**Status:** Complete (compatibility assessed; no technology or schema chosen)

---

## 1. Architectural premise — exports are derived, not persisted

**Binding for this analysis:**

- **Learner HTML**, **preview HTML**, **standalone export documents**, and **learner-package ZIPs** are **regenerable projections** — not Workflow Resources and not canonical persistence targets.
- **Durable source state** (hypothesis, per T-002 / T-003) consists of:
  - workflow step data and captures (intent + references);
  - Workflow Resource **metadata**;
  - durable resource **payloads** or **addressable references**;
  - associations between workflow intent and resources;
  - resource-specific metadata required for rendering and export (incl. learner-facing alt/description for **R9**).

Images remain the concrete investigation slice; PDF, Word, and video are **out of scope** for implementation but used to test **resource-type-neutral** regeneration boundaries.

---

## 2. Core regeneration model

```text
Durable workflow step data
        +
Canonical Workflow Resources
        ↓
Assembled learner page (reproducible from captures where applicable)
        +
Transient resource projection (e.g. visualAssetManifest)
        ↓
Fresh render (runUtilityPageExportPipeline / renderLearnerPageHtml)
        ├── Preview (iframe; blob URLs transient)
        ├── Standalone HTML (download / open tab)
        └── Learner-package ZIP (disposable snapshot)
```

| Layer | Classification |
| ----- | -------------- |
| Workflow step captures + assembled page JSON | **Durable source** (text / planning today) |
| Workflow Resources (hypothesis) | **Durable source** (bytes + metadata — not implemented) |
| Visual asset manifest | **Transient projection** |
| Utilities workspace `assetsByBriefId` | **Transient working state / cache** (today) |
| `utilitiesLastHtml` | **Transient cache / convenience snapshot** (today) |
| Preview iframe HTML (blob substituted) | **Transient projection** |
| Downloaded HTML / ZIP | **Regenerated output** (disposable) |

---

## 3. Durable regeneration inputs (minimum by output path)

### Summary table

| Output path | Minimum durable inputs (target model) | Current practical inputs (observed) | Recoverable from workflow + owner alone? |
| ----------- | ------------------------------------- | ----------------------------------- | ---------------------------------------- |
| **Utilities preview (iframe)** | Assembled page + projected manifest + render options | `assembledPageSnapshot` + session `visualAssetManifest`; optional `utilitiesLastHtml` reuse | **Partial today** — bytes not in workflow; session manifest only |
| **Learner HTML (render result)** | Same | `runUtilityPageExportPipeline(page, { visualAssets })` | **Yes** if owner supplies manifest projection |
| **Standalone HTML download** | Fresh render + standalone compose + export runtime embed | **`utilitiesLastHtml`** snapshot → MathJax enhance → download | **Not required architecturally** — currently **gated on snapshot** |
| **Learner-package ZIP** | Fresh HTML + manifest with `data_url` per asset | **`utilitiesLastHtml`** + cloned session manifest | **Not required architecturally** — `buildLearnerPackage({ html, visualAssetManifest })` accepts any fresh pair |
| **Browser / public Utilities path** | Same as above via `window.PRISM_LEARNER_RENDERER_VNEXT` | Browser bundle + separate visual-asset scripts (`index.html`) | **Conditional** — owner API must load on browser path (T-003 Q10) |
| **Node tests / package generation** | `require` renderer + `learner-package` | `runUtilityPageExportPipelineForTest` + direct `buildLearnerPackage` | **Yes** — tests already bypass `utilitiesLastHtml` |

### Input classification (target model)

| Input class | Examples | Durable? |
| ----------- | -------- | -------- |
| **Workflow step data** | `capturedOutputs`, Design Page partial, `visual_affordances[]` | Yes (runstate) |
| **Assembled learner-page data** | Output of `resolvePageForRenderOrAssembly` / `page-vnext-assemble` | Reproducible from captures — **projection of step data**, not a separate durable tier unless cached |
| **Workflow Resource metadata** | `resource_id`, mime, dimensions, alt/description copy, affordance linkage | Yes (owner — hypothesis) |
| **Payload / external reference** | Bytes, `data_url` materialized at export, future URL/embed ref | Yes (owner — hypothesis) |
| **Transient render state** | Composition mode, section order, presentation mode | Session / UI prefs — not Workflow Resources |
| **Export-only configuration** | MathJax enhance, standalone embed injection, package slug | Ephemeral per export request |

### Information not recoverable today from workflow data alone

| Gap | T-001 evidence |
| --- | -------------- |
| Image **bytes** / `render_source` | Session `assetsByBriefId` only |
| Attached manifest entries for missing briefs | Built from session map |
| Post-attach renderer placement diagnostics | Session `rendererPlacementByBriefId` |

These gaps close when **canonical Workflow Resources** persist bytes/metadata keyed to workflow scope — not by persisting HTML/ZIP.

---

## 4. Current versus required regeneration flow

### Current (generated-image path)

```text
[Author attach] → assetsByBriefId (session)
                      ↓
         buildVisualAssetManifest (projection)
                      ↓
    runUtilityPageExportPipeline(page, { visualAssets: manifest })
                      ↓
         utilitiesLastHtml := durable data_url HTML
                      ↓
    Preview: iframe (blob swap)  |  Export: read utilitiesLastHtml + manifest clone
```

**Observation:** Render pipeline is **already regenerative** from `(page, manifest)`. Export handlers **shortcut** through `utilitiesLastHtml` + session manifest rather than re-invoking render.

### Required (target — no HTML/ZIP persistence)

```text
[Load workflow] → step captures + owner store
                      ↓
         assemble page (if needed)
                      ↓
         project manifest from owner (sync or async payload resolve)
                      ↓
    runUtilityPageExportPipeline(page, { visualAssets: projected })
                      ↓
    ├── Preview → blob swap (transient)
    ├── Standalone → composeStandaloneVnextLearnerExport (fresh)
    └── Package → buildLearnerPackage(fresh html, projected manifest)
```

**Gap:** Owner projection + optional **async payload read** layer not present. **Render/package mechanics** already align with target model.

---

## 5. Workflow step and resource relationship (observations)

| Topic | Observation |
| ----- | ----------- |
| **Fields surviving in captures** | Design Page output includes `visual_affordances[]`, `visual_affordance_schema_version`, page synthesis fields (T-001 Stage 1; `page-vnext-assemble.js` owned fields) |
| **Fields to reconnect resource** | `affordance_id` (primary resolver key), `scope`, `activity_id`, `visual_slot`; derived `brief_id`/`job_id` for planning regen (T-001 identifier catalog) |
| **References vs payloads in captures** | T-002 / T-003: step captures should hold **references** (e.g. `resource_id` list or affordance→resource map), **not** embedded payloads — aligns with P5/P6 strategies |
| **Step regen / orphan behaviour** | Unresolved — if affordance removed but resource persists, or affordance retained but resource replaced; detection belongs to **owner lifecycle** + assembly validation (T-005) |
| **Assembled page artefact** | **Reproducible projection** of step captures via `resolvePageForRenderOrAssembly` — durable as cached text in runstate but **not** authoritative over step partials |

**No reference schema defined in this task.**

---

## 6. Renderer projection and manifest assessment

### Can `visualAssetManifest` remain an image-specific projection?

**Yes, as a transient projection** — it must **not** become the canonical store (T-001, T-002).

| Aspect | Assessment |
| ------ | ---------- |
| **Renderer-required fields** | `affordance_id`, `scope`, `activity_id`, `visual_slot`, `render_source` (value + kind), `alt_text`, `detailed_description`, mime/dimensions optional (T-001 Stage 7; `render-visual-affordance.js`) |
| **Package-required fields** | Same `render_source.data_url` for decode; `brief_id` for path collision suffix; scope/slot/activity for basename (`learner-package.js`) |
| **ID coexistence** | `resource_id` (canonical owner) can map 1:1 to exported `asset_id` / `brief_id` in projection; `affordance_id` remains resolver primary key; `brief_id` remains planning derivative |
| **Manifest transience** | **Should remain transient** — rebuilt per preview/export from owner |
| **Projection timing** | **Each preview/export request** (or on owner change notification) — not persisted |
| **Image-specific concerns** | PNG/JPEG/WebP MIME validation, `data_url` decode, figure HTML — stay in image adapter + renderer |
| **Generic layer concerns** | Resource record identity, workflow linkage, payload ref resolution, provenance, lifecycle — **Workflow Resources owner** |

Future generic **`workflowResourceManifest`** may supersede or wrap `visualAssetManifest`; renderer contract can remain manifest-fed.

---

## 7. Preview regeneration analysis

**Conceptual path:** Workflow data + owner → assembled page + projection → learner HTML → optional blob URLs → iframe.

| Question | Assessment |
| -------- | ---------- |
| Can preview HTML always be regenerated? | **Architecturally yes** — `refreshUtilitiesLearnerPreviewWithVisualAssets` already re-renders from `assembledPageSnapshot` + manifest without reading `utilitiesLastHtml` (`app.js` ~48505–48575) |
| Blob URLs transient? | **Yes** — `buildIframePreviewHtmlFromRendered` swaps `data_url`→`blob:` for iframe only; must not persist (T-001) |
| Payload required before preview? | **`render_source` resolvable** (typically materialized `data_url` for images) — owner must supply or async-resolve before render |
| Async retrieval? | **Required** if payload tier is IndexedDB (T-003 P4/P6) — current path is **synchronous** |
| Preview mutates canonical state? | **Must not** — attach flow updates session then re-renders; owner writes only on attach/replace, not on preview |
| Object URL cleanup | **Separate** — `revokeAllVisualAssetObjectUrls` on workspace refresh; cleanup must not delete durable owner payloads |

---

## 8. Standalone HTML regeneration analysis

| Topic | Assessment |
| ----- | ---------- |
| **Regeneration on demand** | **Supported by pipeline** — `runUtilityPageExportPipeline` → `composeStandaloneVnextLearnerExport` → `injectStandaloneVnextExportRuntime` |
| **Inline `data_url` for images** | Current durable interchange for export HTML (T-001); alternative href-only HTML possible but package/export rewrite assumes exact `data_url` match today |
| **Self-contained vs external refs** | Standalone export embeds runtime scripts; images inline as `data_url` in current path — external refs would need parallel rewrite rules (future resource types) |
| **Size / memory** | Large base64 in HTML — acceptable for export snapshot generation, not for persistence as primary strategy |
| **Alt / description metadata** | From affordance rows + asset record — owner should retain **R9** fields if page JSON changes |
| **Prompt independence** | Standalone HTML does not embed `generation_instruction` (T-001) — satisfied if owner holds learner metadata |
| **External resources (video embed, etc.)** | Conceptually: durable embed snippet or canonical URL in owner; renderer emits appropriate HTML — **not traced** in image slice |

**No final HTML representation selected.**

---

## 9. Learner-package regeneration analysis

**Conceptual path:** Workflow data + owner → fresh render → payload resolution → paths → HTML rewrite → ZIP.

| Topic | Assessment |
| ----- | ----------- |
| **Can package builder consume fresh projection?** | **Yes** — `buildLearnerPackage({ html, visualAssetManifest })` is **pure** over inputs (T-001; tests in `sprint-70-slice-e2`, `e3`) |
| **Operations likely unchanged** | `assignPackageAssetPaths`, `decodeImageDataUrl`, `rewriteHtmlImageSources`, ZIP serialization |
| **Depends on `utilitiesLastHtml` today?** | **Download handlers yes** (`handleUtilitiesDownloadLearnerPackage` reads snapshot first — `app.js` ~49760–49761) — **architecturally optional** |
| **Could use freshly rendered HTML?** | **Yes** — same pipeline output used to populate `utilitiesLastHtml` today |
| **Async resource retrieval** | Package build is **sync** today; async owner requires **await payloads → then** `buildLearnerPackage` |
| **Deterministic naming** | Stable `brief_id` suffix on collision — owner should preserve `brief_id` or map in projection |
| **MIME / extension** | From asset mime + inference in `learner-package.js` |
| **Missing resource** | Asset omitted with warning if no `data_url` (`missing_data_url`) — HTML may retain broken inline src unless render omitted figure |
| **Memory** | Decodes all assets into memory for ZIP — multi-image workflows need awareness (T-003 quota risk) |

**ZIP remains disposable export snapshot** — no package persistence or re-import.

---

## 10. Assessment of `utilitiesLastHtml`

| Criterion | Finding |
| --------- | ------- |
| **Classification** | **Transient preview/export cache** + **convenience snapshot** — also acts as **accidental export gate** (“Preview HTML first”) |
| **Required regeneration input?** | **No** for render pipeline; **Yes** for current download/open-tab UX |
| **Source of truth?** | **No** — derived from last successful render; cleared on Utilities clear (`app.js` ~49899) |
| **Export without snapshot?** | **Architecturally viable:** re-run `runUtilityPageExportPipeline` + package builder with owner-backed manifest — not wired in UI today |

**Recommendation for Phase 2 (analysis only):** Treat `utilitiesLastHtml` as **optional cache**; export should **regenerate from durable state + owner** when cache miss or stale.

---

## 11. Browser / Node / public-path parity

### Modules involved (read → project → render → package)

| Concern | Node path | Browser path |
| ------- | --------- | -------------- |
| Page assembly | `page-vnext-assemble.js`, app helpers via tests | `app.js` workflow assembly |
| Resource projection | `prism-visual-assets.js` `buildVisualAssetManifest` | Same scripts (`index.html` ~1057–1058) |
| Render | `require("learner-renderer-vnext")` | `window.PRISM_LEARNER_RENDERER_VNEXT` (`learner-renderer-vnext-browser.js`) |
| Standalone compose | `learner-renderer-vnext-standalone-embed.js` | Same + export runtime scripts (~1115–1117) |
| Package | `learner-package.js`, `learner-package-zip.js` | `PRISM_LEARNER_PACKAGE` globals (~1060–1061) |
| **Owner store (future)** | **Not present** — needs adapter usable in tests | **Not present** — needs IDB/localStorage + script load |

### Parity risks (T-001 Sprint 72 lesson)

| Risk | Implication |
| ---- | ----------- |
| Stale renderer bundle | Browser render ≠ Node source until rebuild (`scripts/build-learner-renderer-vnext-browser.js`) |
| Owner API only in browser | Node tests fail parity if owner is browser-only |
| Async IDB in browser only | Export orchestration diverges unless test mock store |
| Separate script load order | Owner module must load before Utilities export (`index.html` pattern) |

**No bundles rebuilt in this task.**

---

## 12. Resource-type-neutral boundary map

| Concern | Generic (Workflow Resources layer) | Image-specific (current slice) | Future types (conceptual only) |
| ------- | ------------------------------------ | ------------------------------ | ------------------------------ |
| Identity / lifecycle | `resource_id`, attach/replace/detach | `asset_id`, brief linkage | Document ID, embed ID |
| Payload resolution | Ref → bytes or external URL | `data_url` / future IDB blob | PDF bytes, video embed HTML |
| Projection to manifest | Generic record → manifest entry | `visualAssetManifest` | e.g. document manifest adapter |
| Render | Manifest-fed resolver pattern | `buildVisualAssetResolver`, figure HTML | iframe/embed renderer |
| Package export | Path assignment + rewrite rules | `data_url` → `assets/*.png` | PDF copy, no image decode |
| Preview | Transient blob for heavy inline | `data_url`↔`blob:` swap | embed preview sandbox |

**Regeneration model is resource-type neutral at the owner→projection→render boundary** if each type supplies manifest entries the renderer/export adapters understand.

---

## 13. Failure and consistency boundaries

| Condition | Detecting layer (conceptual) | Expected behaviour (analysis) |
| --------- | --------------------------- | ------------------------------ |
| Workflow ref → missing resource | Assembly or owner lookup | Warning; render hook without figure; package warning / omit asset |
| Resource without workflow ref | Owner GC / orphan report | Orphan retained until policy deletes — not renderer concern |
| Metadata ok, payload read fails | Owner projection | Failed attach state; preview/export omit or error |
| External embed unavailable | Owner + render | Placeholder or learner-visible message — type-specific |
| Preview before payload resolved | Export orchestrator | Defer render or show loading — **new** if async owner |
| Package before payloads resolved | Export orchestrator | Block ZIP or partial package with warnings |
| Workflow step regenerated | Assembly + owner | Rebind or orphan rules — T-005 |
| Stale association | Owner vs page diff | Resolver miss → hidden hook (current behaviour) |
| Browser vs Node projection diverge | CI parity tests | Fail test; not user-facing |

**Not expanded into PB-FA-003 pipeline-integrity work.**

---

## 14. Regeneration architecture compatibility verdict

| Verdict | **Conditionally compatible** |
| ------- | ---------------------------- |

**Compatible elements:**

- Manifest-fed renderer is already a **projection** pattern.
- `runUtilityPageExportPipeline` + `buildLearnerPackage` accept **fresh** inputs (proven in Node tests).
- Preview refresh path re-renders without HTML persistence.
- Export rewrite/path logic is **downstream** of render — reusable with owner-projected manifest.

**Conditions / blockers:**

- **Canonical Workflow Resources layer** must exist (T-002 hypothesis).
- **Projection orchestrator** must materialize payloads (possibly **async**) before render/export.
- Export UI must **stop requiring** `utilitiesLastHtml` as sole input (behaviour change — Phase 2).
- **Browser/Node owner adapter parity** must be proven (T-003 Q3, Q10).
- **Reference model** in step captures must link affordances to `resource_id` (schema — later).

**Incompatible if:** owner payloads cannot be read within browser constraints **and** no acceptable materialization path exists for `data_url` at export time — **T-005 / S73-D02** decision.

---

## 15. Feasibility risks and constraints (export/regeneration specific)

| Risk | Source |
| ---- | ------ |
| Export UX coupled to stale `utilitiesLastHtml` | Current `handleUtilitiesDownload*` |
| Sync pipeline vs async owner store | T-003 P4/P6 |
| Large inline HTML generation memory spikes | Multi-image `data_url` in one string |
| Missing asset silent degradation | Package warnings but HTML may still reference missing src |
| Standalone embed script drift | Separate export runtime scripts from renderer bundle |

---

## 16. Evidence required for S73-T-005

| ID | Evidence | Why |
| -- | -------- | --- |
| E1 | Prototype projection: owner records → manifest (mock store) | Proves regeneration path end-to-end |
| E2 | Export from fresh render without `utilitiesLastHtml` in test harness | Validates decoupling |
| E3 | Async payload read timing budget (IDB mock) | Feasibility of P6 |
| E4 | Typical manifest size + HTML size for N images | Memory/quota |
| E5 | Orphan/rebind scenarios when page JSON changes | Lifecycle policy input |
| E6 | Browser script-load plan for owner module | R7 parity |

---

## 17. Source-file and test references

### Runtime / export

| File | Role |
| ---- | ---- |
| `app.js` | `runUtilityPageExportPipeline`, `runLearnerRendererVNextExport`, `composeStandaloneVnextLearnerExport`, `utilitiesLastHtml`, download handlers, preview apply, workspace refresh |
| `lib/learner-renderer-vnext/render-learner-page.js` | Render entry |
| `lib/learner-renderer-vnext/render-page.js` | Manifest resolver |
| `lib/prism-visual-assets.js` | Manifest projection from briefs + assets |
| `lib/learner-package.js` | Package build, rewrite, decode |
| `lib/learner-package-zip.js` | ZIP serialization |
| `lib/learner-renderer-vnext-browser.js` | Browser render bundle |
| `lib/learner-renderer-vnext-standalone-embed.js` | Standalone export |
| `index.html` | Script load order |

### Tests (regeneration without HTML persistence)

| File | Role |
| ---- | ---- |
| `tests/sprint-70-slice-e2-learner-package-rewrite.test.js` | Rewrite + decode |
| `tests/sprint-70-slice-e3-learner-package-zip.test.js` | ZIP from built package |
| `tests/sprint-70-final-expandable-learner-images.test.js` | Pipeline + package with images |
| `tests/utility-utilities-page-export-pipeline.test.js` | `runUtilityPageExportPipelineForTest` |
| `tests/sprint-70-instruction-material-association-regression.test.js` | Direct `buildLearnerPackage` |

### Prior discovery

| Doc | Use |
| --- | --- |
| [S73-T-001](S73-T-001-generated-image-lifecycle-discovery.md) | Current paths, export one-way, manifest session-bound |
| [S73-T-002](S73-T-002-canonical-workflow-resource-ownership.md) | Owner hypothesis, manifest = projection |
| [S73-T-003](S73-T-003-persistence-strategy-evaluation.md) | P5/P6 promising; async/quota questions |

---

## Explicit non-deliverables (honoured)

- No HTML/ZIP persistence strategy.
- No storage technology or schema selection.
- No owner implementation or renderer/package code changes.
- No bundle rebuild; no evidence architecture changes; no PB-FA-003 scope.
