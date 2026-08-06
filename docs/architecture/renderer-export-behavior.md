# Authoring → Learner Export Path (Current Behavior)

**Status:** Authoritative for the **definitive** page export path (Sprint 74A / `S74A-D02`; freshness discipline S74A-T-020)  
**Product surface:** **Authoring** tab (`#utilitiesPanel` — internal id retained; user-facing label is Authoring)  
**Related:** [learner-renderer-vnext.md](learner-renderer-vnext.md) · [ADR-012](adr/ADR-012-learner-renderer-interprets-educational-semantics.md) · Sprint 74 [ARCHITECTURAL-CONSTRAINTS.md](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md)

---

## Definitive product spine

```text
Create Workflow
  → My Workflows
  → Authoring
  → Assemble
  → Preview (vNext)
  → HTML / learner ZIP / Open in New Tab
```

Prism is a **browser-only** application. Deployment is **static** and **`index.html`-driven**. There is no backend and no runtime Node.js. Node.js is **development/test tooling** only. **Node-based test evidence** informs shared logic; it is **not** proof that the deployed application works. The **production browser path** is authoritative for deployment confidence.

---

## Definitive vs obsolete (current tree)

| Kind | Meaning |
| ---- | ------- |
| **Definitive** | Page artefacts rendered with **learner-renderer-vNext** (Authoring UI default; `utilitiesRendererVersion` = `vnext`) |
| **Obsolete (pending removal)** | Legacy Authoring selector / route (`utilitiesRendererVersion` = `legacy`) — may still exist in code until **S74A-T-045**; **not** a retention target (`S74A-D02` / `S74-D07`) |

Internal identifiers may still use `utilities*` names. That does **not** change the user-facing **Authoring** label. Historical T-010 “Supported/Compatibility” wording remains accurate as a dated audit; active guidance is sole-renderer.

---

## Layers of the definitive implementation

| Layer | What it is | Where |
| ----- | ---------- | ----- |
| Source modules | Editable vNext renderer source | `lib/learner-renderer-vnext/*` |
| Generated browser artefact | Built for browser loading (development/test tooling) | `lib/learner-renderer-vnext-browser.js` via **one** builder: `scripts/build-learner-renderer-vnext-browser.js` |
| Freshness gate | Fails if committed artefacts ≠ rebuild from source | `npm run check:learner-renderer-vnext-browser` |
| Browser-loaded implementation | What the deployed app actually runs | Script tag in `index.html` → `window.PRISM_LEARNER_RENDERER_VNEXT` |
| Application orchestration | Authoring assemble / preview / download wiring | `app.js` (`handleUtilities*`, `runUtilityPageExportPipeline`, …) |

End users do **not** run a build step. They open/serve the static application files. Generated artefacts are produced during development and committed/served as static files. After editing `lib/learner-renderer-vnext/*`, run `npm run build:learner-renderer-vnext-browser` and commit the generated outputs; confirm with `npm run check:learner-renderer-vnext-browser`.

---

## Definitive page export path (vNext)

Default in Authoring UI and `app.js` state: **`vnext`** (`index.html` option `vNext (default)`; `state.utilitiesRendererVersion: "vnext"`).

For `artifact_type = "page"` when renderer version resolves to **`vnext`**:

1. Authoring actions call into `handleUtilitiesGenerate` (Preview), download handlers, or related regenerate paths.  
2. `runUtilityPageExportPipeline(...)` resolves renderer version.  
3. When `rendererVersion === "vnext"`, it calls **`runLearnerRendererVNextExport(...)`**.  
4. That function uses the **browser-loaded** `window.PRISM_LEARNER_RENDERER_VNEXT.renderLearnerPageHtml(...)`.  
5. Optional Workflow Resources sections may be injected; standalone export may compose via `composeStandaloneVnextLearnerExport`.  
6. Resulting HTML is stored for Preview / download / Open in New Tab / package use as applicable.

### User actions (Authoring)

| Action | Typical handler | Notes |
| ------ | --------------- | ----- |
| Assemble From Current Workflow Run | `handleUtilitiesAssembleFromCurrentWorkflowRun` | Builds page JSON from the current run |
| Preview HTML | `handleUtilitiesGenerate` | Renders via export pipeline; updates preview |
| HTML only (download) | `handleUtilitiesDownloadHtml` | Downloads last rendered HTML; does **not** re-render by itself |
| Learner package (.zip) | `handleUtilitiesDownloadLearnerPackage` | Packages learner HTML/assets |
| Open in New Tab | `handleUtilitiesOpenInNewTab` | Opens rendered HTML |

If download/open output looks stale, regenerate Preview first, then download or open.

---

## Obsolete Legacy page path (present until T-045)

Until **S74A-T-045** completes, selecting **Legacy** (or an explicit Legacy call) still takes a non-vNext branch:

1. `runUtilityPageExportPipeline(...)` does **not** take the vNext branch.  
2. It uses `runUtilityRendererByPlan(...)` → **`buildUtilityStructuredHtml(...)`** and related helpers (`utilityRenderPageSections`, `sanitizeUtilityHtmlOutput`, …).  

That branch is **obsolete for learner pages** and scheduled for removal under the T-040 inventory. Non-page artefacts (notably **`slide_deck`**) that still use `buildUtilityStructuredHtml` are a separate retain surface — see T-040. Do **not** treat Legacy page selection as a Compatibility retention goal.

---

## Material / assessment notes

### Definitive (vNext)

Authoritative behaviour for learner page HTML is defined by the vNext architecture and implementation — see [learner-renderer-vnext.md](learner-renderer-vnext.md). Do not treat the obsolete Legacy section below as the page-export narrative.

### Obsolete Legacy — historical page HTML helpers

When Legacy is still selected for pages (pre-T-045), structured material/assessment rendering historically used rules such as:

- Markdown-like headings and bullet/checkbox normalisation in material contexts  
- `renderQuestionBlocks` / `feedback_display` for assessment sections  
- `sanitizeUtilityHtmlOutput` conservative cleanup  

These rules describe the obsolete page path only; they are **not** the definitive page export narrative.

---

## Regression checklist (documentation / change discipline)

When changing definitive export behaviour or docs:

- Confirm Authoring default remains **vNext** unless an explicit product decision changes it  
- Confirm active docs do **not** present Legacy page retention as the target; removal is authorised under **T-045**  
- Confirm production confidence is argued from the **production browser path**, not Node-based tests alone  
- Confirm `index.html` still loads the **generated browser artefact** for vNext  
- Confirm freshness: `npm run check:learner-renderer-vnext-browser`  

Until T-045, if exercising the obsolete Legacy branch for comparison, verify it separately; do not assume vNext coverage.

---

## Document history

| Date | Change |
| ---- | ------ |
| 2026-08-06 | Active guidance — vNext definitive; obsolete Legacy pending T-045 (not Compatibility retention) |
| 2026-08-06 | S74A-T-020 — artefact freshness gate + single-builder discipline |
| 2026-08-06 | S74A-T-010 — rewritten as Supported (vNext) + Compatibility (Legacy); Authoring terminology; browser-only / static deployment framing (historical; retention target superseded by `S74A-D02`) |
| (prior) | Legacy-centred “Utilities Page Export Renderer” narrative (superseded for definitive path) |
