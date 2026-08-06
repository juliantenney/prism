# S74A-T-010 — Supported export-path documentation audit and alignment

**Sprint:** 74A — Authoring → Learner Export Path Integrity  
**Task:** S74A-T-010  
**Status:** **Done** (2026-08-06)  
**Mode:** Documentation / architecture narrative only — **no runtime changes**  
**Authority:** [PLAN.md](PLAN.md) · [SPRINT-74A-CHARTER.md](SPRINT-74A-CHARTER.md) · parent [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md) · Domain A in [S74-T-010](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-010-rationalisation-domain-refinement.md)

---

## Operator supersession (2026-08-06)

This report correctly documented the architecture **at the time of T-010**: **vNext Supported** and the previous renderer labelled **Compatibility** (retained).

Later the same day, operator binding direction changed the **target**:

1. Programme principle **`S74-D07`** — one definitive codebase around established functionality.  
2. Sprint decision **`S74A-D02`** — **vNext replaces the obsolete learner renderer** (removal after inventory; not ongoing Compatibility).

**Do not rewrite** the evidence below to pretend T-010 already delivered sole-implementation documentation or removal. Product architecture docs updated under T-010 remain the Compatibility-era narrative until T-045/T-050 reconcile them.

---

## 1. Executive summary

T-010 establishes one truthful Supported export narrative:

```text
Create Workflow → My Workflows → Authoring → Assemble → Preview (vNext) → HTML / learner ZIP / Open in New Tab
```

**vNext** is Supported; **Legacy** is Compatibility. Documentation now distinguishes source modules, generated browser artefact, and browser-loaded runtime; states browser-only / static deployment; and does not treat Node-based tests as deployment proof.

No Legacy code removed. No runtime, test, schema, build, or generated-artefact changes.

---

## 2. Audit questions (evidence)

| # | Question | Finding | Evidence |
| - | -------- | ------- | -------- |
| 1 | Default renderer in Authoring? | **vNext** | `index.html` `#utilitiesRendererVersion` option `vnext` selected (`vNext (default)`); `app.js` `state.utilitiesRendererVersion: "vnext"` |
| 2 | Functions routing page export to vNext? | `runUtilityPageExportPipeline` → when `rendererVersion === "vnext"` → `runLearnerRendererVNextExport` → `window.PRISM_LEARNER_RENDERER_VNEXT.renderLearnerPageHtml` | `app.js` (~50368–50411, ~50186+) |
| 3 | Functions/branches still invoking Legacy? | Non-vNext branch of `runUtilityPageExportPipeline` → `runUtilityRendererByPlan` → `buildUtilityStructuredHtml`; UI option `legacy`; catalogue mappings for some non-page plans still reference `buildUtilityStructuredHtml` | `app.js` (~50413+, ~49649+, select in `index.html`) — exhaustive inventory deferred to **S74A-T-040** |
| 4 | User actions for Preview / HTML / ZIP / Open in New Tab? | Assemble: `handleUtilitiesAssembleFromCurrentWorkflowRun`; Preview: `handleUtilitiesGenerate`; HTML download: `handleUtilitiesDownloadHtml`; ZIP: `handleUtilitiesDownloadLearnerPackage`; Open: `handleUtilitiesOpenInNewTab` | Authoring panel wiring / `app.js` handlers |
| 5 | Generated browser artefact loaded by deployed app? | `lib/learner-renderer-vnext-browser.js` via `index.html` script tag → `window.PRISM_LEARNER_RENDERER_VNEXT` | `index.html` (~1136); source under `lib/learner-renderer-vnext/*` |
| 6 | Docs still Legacy- or Utilities-centred? | **Before T-010:** `renderer-export-behavior.md` described Legacy helpers as the “active” path; README “Utilities HTML Export Renderer” centred on `buildUtilityStructuredHtml` | Corrected in this task |
| 7 | Root README labels vs current UI? | **Before:** four tabs Prompt Factory / Prompt Library / Workflow Factory / Workflows | **After:** five tabs Create Workflow / My Workflows / Authoring / Prompt Studio / Prompt Library |
| 8 | Duplicate export narratives? | Architecture doc vs README vs vNext arch doc could disagree | Aligned: README + `renderer-export-behavior.md` authoritative for product spine; `learner-renderer-vnext.md` points to them for Authoring export |
| 9 | Docs imply Node in production? | Touched export docs now state Node = development/test tooling only | Constraints + rewritten export docs |
| 10 | Docs imply Node tests prove deployment? | Touched docs state Node-based test evidence ≠ deployment proof; production browser path is authoritative | Same |

---

## 3. Files changed (documentation only)

| File | Change |
| ---- | ------ |
| [`docs/architecture/renderer-export-behavior.md`](../../../architecture/renderer-export-behavior.md) | Rewritten: Supported spine, Compatibility Legacy, layers, browser-only framing |
| [`README.md`](../../../../README.md) | Nav terminology + Authoring learner export section |
| [`docs/architecture/learner-renderer-vnext.md`](../../../architecture/learner-renderer-vnext.md) | Authoring export pointer; terminology (generated artefact; Node-based test evidence) |
| This report | Audit evidence |
| Sprint 74A `PLAN.md` / `STATUS.md` / `HANDOVER.md` / `next-chat-briefing.md` / `README.md` / `CONTEXT.md` | Task Done; next = T-020 |

No decision entry added (Supported/Compatibility already binding via parent Sprint 74 / `S74A-D01`).

---

## 4. Stale claims corrected

- Legacy-centred “active Utilities path” in `renderer-export-behavior.md`
- README “Utilities HTML Export Renderer” listing `buildUtilityStructuredHtml` as current active path
- README four-tab Prompt Factory / Workflow Factory / Workflows labels
- vNext architecture wording that read like “Node/browser runtime parity” or equivalent production Node path

---

## 5. Deferred (not T-010)

| Item | Deferred to |
| ---- | ----------- |
| Generated artefact rebuild discipline / staleness gates | **S74A-T-020** |
| Production browser-path **baseline** (pre-removal) | **S74A-T-030** |
| Exhaustive obsolete-renderer responsibility + **exact removal plan** | **S74A-T-040** |
| Remove obsolete learner-renderer implementation | **S74A-T-045** (`S74A-D02`) |
| Sole-renderer verification + docs reconcile | **S74A-T-050** |

Historical sprint archives that still say “Utilities HTML” were **not** rewritten (out of scope; not current operator/export SSOT).

---

## 6. Validation performed

- Diff inspected: documentation / sprint records only  
- Relative links from rewritten docs checked against known paths  
- Searched touched export docs for experimental/secondary vNext, Legacy-as-normal, Node-production, and Utilities-as-current-UI claims  
- Confirmed no runtime, test, schema, generated artefact, or build-tool files changed under this task  
- Internal `utilities*` identifiers left unchanged  

---

## 7. AC contribution (partial — under then-current charter)

At completion, T-010 contributed evidence toward the then-current AC set (Supported/Compatibility docs). After `S74A-D02` / `S74-D07`, charter ACs were revised to sole-implementation / removal criteria (**AC-01…AC-15**). T-010 remains valid historical evidence of the Compatibility-era documentation alignment; sole-renderer AC-01/AC-14 (and related) require later documentation updates in T-045/T-050.

---

## 8. Next task (at T-010 completion)

**S74A-T-020** — vNext generated browser artefact integrity. *(Unchanged as next task after definitive-codebase reconciliation; obsolete-renderer removal remains T-040 → T-045.)*
