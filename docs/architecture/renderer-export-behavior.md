# Authoring → Learner Export Path (Current Behavior)

**Status:** Authoritative for the **sole** learner-page export path (Sprint 74A / `S74A-D02`; removal S74A-T-045; freshness S74A-T-020). Final sole-renderer acceptance is **S74A-T-050**.  
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

## Sole learner renderer

| Kind | Meaning |
| ---- | ------- |
| **Sole learner-page renderer** | **learner-renderer-vNext** via `runUtilityPageExportPipeline` → `runLearnerRendererVNextExport` |
| **Non-page structured HTML** | `slide_deck` (and other non-page catalogue artefacts) still use `runUtilityRendererByPlan` → `buildUtilityStructuredHtml` — **not** a second learner-page renderer |

There is **no** Authoring renderer selector. Historical T-010 “Supported/Compatibility” wording remains accurate as a dated audit only.

Internal identifiers may still use `utilities*` names. That does **not** change the user-facing **Authoring** label.

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

For `artifact_type = "page"`:

1. Authoring actions call into `handleUtilitiesGenerate` (Preview), download handlers, or related regenerate paths.  
2. `runUtilityPageExportPipeline(...)` always calls **`runLearnerRendererVNextExport(...)`**.  
3. That function uses the **browser-loaded** `window.PRISM_LEARNER_RENDERER_VNEXT.renderLearnerPageHtml(...)`.  
4. Optional Workflow Resources sections may be injected; standalone export may compose via `composeStandaloneVnextLearnerExport`.  
5. Resulting HTML is stored for Preview / download / Open in New Tab / package use as applicable.

Missing vNext global → **explicit error** (no obsolete-renderer fallback).

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

## Non-page structured HTML (`slide_deck`)

Non-page artefacts resolve a catalogue plan and call `runUtilityRendererByPlan` → **`buildUtilityStructuredHtml`**. Learner **pages** are rejected by that function and must use the vNext path above.

---

## Material / assessment notes

Authoritative behaviour for learner page HTML is defined by the vNext architecture — see [learner-renderer-vnext.md](learner-renderer-vnext.md). Structured HTML helpers remain for non-page artefacts only.

---

## Regression checklist (documentation / change discipline)

When changing definitive export behaviour or docs:

- Confirm there is **no** user-facing learner-renderer selector  
- Confirm page Preview/export remains unconditional vNext  
- Confirm active docs do **not** present a second learner-page renderer  
- Confirm production confidence is argued from the **production browser path**, not Node-based tests alone  
- Confirm `index.html` still loads the **generated browser artefact** for vNext  
- Confirm freshness: `npm run check:learner-renderer-vnext-browser`  
- Confirm `slide_deck` still renders via structured HTML when changed  

---

## Document history

| Date | Change |
| ---- | ------ |
| 2026-08-06 | S74A-T-045 — sole vNext page path; selector/routing/Legacy page path removed from active guidance |
| 2026-08-06 | Active guidance — vNext definitive; obsolete Legacy pending T-045 (superseded by removal) |
| 2026-08-06 | S74A-T-020 — artefact freshness gate + single-builder discipline |
| 2026-08-06 | S74A-T-010 — rewritten as Supported (vNext) + Compatibility (Legacy); Authoring terminology; browser-only / static deployment framing (historical; retention target superseded by `S74A-D02`) |
| (prior) | Legacy-centred “Utilities Page Export Renderer” narrative (superseded for definitive path) |
