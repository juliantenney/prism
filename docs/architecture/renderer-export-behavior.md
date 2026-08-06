# Authoring → Learner Export Path (Current Behavior)

**Status:** Authoritative for the **supported** page export path (Sprint 74A / S74A-T-010)  
**Product surface:** **Authoring** tab (`#utilitiesPanel` — internal id retained; user-facing label is Authoring)  
**Related:** [learner-renderer-vnext.md](learner-renderer-vnext.md) · [ADR-012](adr/ADR-012-learner-renderer-interprets-educational-semantics.md) · Sprint 74 [ARCHITECTURAL-CONSTRAINTS.md](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md)

---

## Supported product spine

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

## Supported vs Compatibility

| Kind | Meaning |
| ---- | ------- |
| **Supported** | Page artefacts rendered with **learner-renderer-vNext** via the Authoring UI default (`utilitiesRendererVersion` = `vnext`) |
| **Compatibility** | **Legacy** Authoring renderer option (`utilitiesRendererVersion` = `legacy`) — still selectable; not the normal page path; **not** removed |

Internal identifiers may still use `utilities*` names. That does **not** change the user-facing **Authoring** label or the Supported/Compatibility classification above.

---

## Layers of the supported implementation

| Layer | What it is | Where |
| ----- | ---------- | ----- |
| Source modules | Editable vNext renderer source | `lib/learner-renderer-vnext/*` |
| Generated browser artefact | Built for browser loading (development/test tooling) | `lib/learner-renderer-vnext-browser.js` via `scripts/build-learner-renderer-vnext-browser.js` |
| Browser-loaded implementation | What the deployed app actually runs | Script tag in `index.html` → `window.PRISM_LEARNER_RENDERER_VNEXT` |
| Application orchestration | Authoring assemble / preview / download wiring | `app.js` (`handleUtilities*`, `runUtilityPageExportPipeline`, …) |

End users do **not** run a build step. They open/serve the static application files. Generated artefacts are produced during development and committed/served as static files.

---

## Supported page export path (vNext)

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

## Compatibility path (Legacy)

When Authoring **Learner renderer** is set to **Legacy**, or a call explicitly requests Legacy:

1. `runUtilityPageExportPipeline(...)` does **not** take the vNext branch.  
2. It uses `runUtilityRendererByPlan(...)` → **`buildUtilityStructuredHtml(...)`** and related helpers (`utilityRenderPageSections`, `sanitizeUtilityHtmlOutput`, …).  

Legacy remains available for Compatibility (including some non-page artefact catalog mappings that still reference `buildUtilityStructuredHtml`). Exhaustive invocation inventory is **S74A-T-040** — this document only establishes the Supported/Compatibility distinction.

---

## Material / assessment notes

### Supported (vNext)

Authoritative behaviour for learner page HTML is defined by the vNext architecture and implementation — see [learner-renderer-vnext.md](learner-renderer-vnext.md). Do not treat the Legacy section below as the Supported page narrative.

### Compatibility (Legacy) — historical page HTML helpers

When Legacy is selected for pages, structured material/assessment rendering historically used rules such as:

- Markdown-like headings and bullet/checkbox normalisation in material contexts  
- `renderQuestionBlocks` / `feedback_display` for assessment sections  
- `sanitizeUtilityHtmlOutput` conservative cleanup  

These rules apply to the **Compatibility** path. They are retained here so Compatibility behaviour remains documented; they are **not** the Supported page export narrative.

---

## Regression checklist (documentation / change discipline)

When changing **Supported** export behaviour or docs:

- Confirm Authoring default remains **vNext** unless an explicit product decision changes it  
- Confirm docs still label Legacy as **Compatibility**  
- Confirm production confidence is argued from the **production browser path**, not Node-based tests alone  
- Confirm `index.html` still loads the **generated browser artefact** for vNext  

When changing **Compatibility** (Legacy) helpers, verify Legacy-selected exports separately; do not assume vNext coverage.

---

## Document history

| Date | Change |
| ---- | ------ |
| 2026-08-06 | S74A-T-010 — rewritten as Supported (vNext) + Compatibility (Legacy); Authoring terminology; browser-only / static deployment framing |
| (prior) | Legacy-centred “Utilities Page Export Renderer” narrative (superseded for Supported path) |
