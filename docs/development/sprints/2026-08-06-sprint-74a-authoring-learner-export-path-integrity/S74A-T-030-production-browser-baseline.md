# S74A-T-030 — Definitive vNext Production Browser Baseline

**Sprint:** 74A — Authoring → Learner Export Path Integrity  
**Task:** S74A-T-030  
**Status:** **Done** (2026-08-06)  
**Mode:** Behavioural verification only — **no runtime code changes**; **no** obsolete-renderer inventory or removal  
**Authority:** [PLAN.md](PLAN.md) · [SPRINT-74A-CHARTER.md](SPRINT-74A-CHARTER.md) · [S74A-D02](decisions.md#s74a-d02--vnext-replaces-the-obsolete-learner-renderer)  
**Predecessor:** [S74A-T-020-vnext-generated-browser-artefact-integrity.md](S74A-T-020-vnext-generated-browser-artefact-integrity.md)

---

## 1. Executive summary

T-030 records the **pre-removal behavioural baseline** for the supported Authoring → learner export spine on the **production browser path** (`http://localhost/prism/`, static XAMPP/`index.html` deployment).

**Verdict:** The definitive vNext path works for Preview, standalone HTML content, learner ZIP packaging, and Open-in-New-Tab readiness on a representative page fixture. Browser-loaded `PRISM_LEARNER_RENDERER_VNEXT` is present and used. Node-based suites provide **supporting** evidence only.

This baseline is the checklist T-045 / T-050 must preserve.

---

## 2. Environment

| Item | Value |
| ---- | ----- |
| OS | Windows 10 (win32 10.0.26100) |
| Browser | Cursor IDE browser (Chromium/Electron 40 / Chrome 144) |
| Deployment | Static — `http://localhost/prism/?t=s74a-t-030-baseline` (XAMPP; `index.html`-driven) |
| Artefact freshness | `npm run check:learner-renderer-vnext-browser` → **OK** (matches `lib/learner-renderer-vnext/*`) |
| Browser-loaded scripts | `lib/learner-renderer-vnext-browser.js?v=20260729-s70-expandable-images` → `PRISM_LEARNER_RENDERER_VNEXT`; companions + `app.js` |
| Fixture | `tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json` (`artifact_type: page`) |
| Console | No application errors/warnings captured during Preview (empty captured error/warn lists) |

---

## 3. Supported workflow (verified spine)

```text
Create Workflow → My Workflows → Authoring
  → (paste/assemble page JSON) → Preview (vNext)
  → HTML / learner ZIP / Open in New Tab
```

| Surface | Browser observation |
| ------- | ------------------- |
| Create Workflow | Tab present and selectable; design form (name, domain, intent fields) available |
| My Workflows | Tab present; saved workflow list/edit UI available (heteroscedasticity workflow present in this browser session) |
| Authoring | Tab label **Authoring**; panel heading **Authoring**; Assemble / Preview / HTML / ZIP / Open in New Tab controls present |
| Learner renderer default | **vNext (default)** selected (`utilitiesRendererVersion=vnext`); Legacy option still visible (to be removed later) |
| Workflow Resources panes | Graphics / Video / Resources view toggles present; after fixture Preview, **Resources (2)** shown |

---

## 4. Verification matrix

| Action | Expected | Observed | Browser evidence | Node supporting | Result |
| ------ | -------- | -------- | ---------------- | --------------- | ------ |
| Create Workflow tab | Available | Tab + form OK | Snapshot / click | — | **Pass** |
| My Workflows tab | Available | Tab + saved workflow UI OK | Snapshot / click | — | **Pass** |
| Open Authoring | Authoring panel | Selected; controls visible | Snapshot | — | **Pass** |
| Assemble control | Button present | `Assemble From Current Workflow Run` present | DOM | — | **Pass** (control); live assemble-from-run **not** executed (saved run lacked configured prompts) |
| Preview (vNext) | vNext HTML in preview | Preview produced ~240k HTML; markers `data-renderer=vnext`, `util-learner-page`, `util-vnext-activity`; no legacy compass | CDP Preview + iframe `srcdoc` | browser-registration 11/11 | **Pass** |
| Direct browser vNext API | `renderLearnerPageHtml` works | Direct call OK; vNext marker; ~135k HTML | CDP | artefact freshness 2/2 | **Pass** |
| Standalone HTML | Parses; renders as vNext | DOMParser on preview HTML: parse OK, vNext present, activities present, scripts present | CDP | — | **Pass** |
| HTML download control | Enabled after Preview | `utilitiesDownloadHtmlBtn` enabled | CDP | — | **Pass** (UI readiness; file-save dialog not exercised) |
| Learner ZIP | Package builds from rendered HTML | `PRISM_LEARNER_PACKAGE.buildLearnerPackage` + `serializeLearnerPackageToZip` → **ok**, ~36 731 bytes | CDP (same browser APIs as UI) | `s73-t-022-024` package path 1/1 in focused run | **Pass** |
| Open in New Tab | Enabled; uses session HTML | Button enabled after Preview; preview iframe holds session HTML | CDP | E5 open-tab path text assertions in sprint-70 suite (partial; see known issues) | **Pass** (readiness); actual new-tab navigation not opened (automation constraint) |
| Workflow Resources UI | Panes remain available | Graphics/Video/Resources toggles; Resources (2) after fixture | CDP / screenshot | package resources test | **Pass** (no WR implementation changes) |
| Static / browser-only | No Node at runtime | Served via localhost static files; vNext API on `window` | Environment | T-020 check | **Pass** |

---

## 5. Browser observations (detail)

### Preview (vNext)

- Loaded fixture JSON into `#utilitiesJsonInput`, confirmed renderer **vNext**, clicked **Preview HTML**.
- `#utilitiesPreviewFrame` `srcdoc` length ≈ **240 549**.
- Markers: `data-renderer=vnext` **true**; `util-learner-page` **true**; `util-vnext-activity` **true**; legacy `util-journey-compass-header` **false**.
- `window.PRISM_LEARNER_RENDERER_VNEXT.renderLearnerPageHtml` available and successful independently.
- Captured console errors/warnings during Preview: **none**.

### Standalone HTML

- Parsed preview HTML in-browser: title *Why Does the Spread of Regression Errors Matter? Understanding Heteroscedasticity*; activity nodes present; scripts present; vNext structure present.

### Learner ZIP

- Built package from preview HTML via browser-loaded package APIs (same modules loaded by `index.html`):
  - `buildLearnerPackage({ html })` → `ok: true` (`html`, `assets`, `metadata`)
  - `serializeLearnerPackageToZip` → `ok: true`, `bytes.length` ≈ **36731**

### Open in New Tab

- After Preview: Open in New Tab **enabled**.
- Session rendered HTML present in preview iframe (authoritative content for open-tab).
- Did **not** fire a real window.open/download in automation (CDP download/target limits). Behavioural readiness confirmed.

### Assemble

- Control present on Authoring.
- Full assemble-from-current-run against a completed workflow run was **not** executed in this session (selected saved workflow steps reported no runnable prompts). Paste → Preview remains the verified Authoring render path for this baseline fixture.

---

## 6. Supporting Node-based evidence (not deployment proof)

| Suite | Result | Notes |
| ----- | ------ | ----- |
| `npm run check:learner-renderer-vnext-browser` | **OK** | Artefacts match source |
| `tests/learner-renderer-vnext-browser-artefact-freshness.test.js` | **2/2** | Freshness + `index.html` load |
| `tests/learner-renderer-vnext-browser-registration.test.js` | **11/11** | Bundle registration; default pipeline uses vNext; exclusivity vs obsolete path |
| `tests/s73-t-022-024-learner-package-resources.test.js` (focused additional-resource case in combined run) | **Pass** in 14/14 combined with above | Package resource rewrite supporting evidence |

**Not used as deployment proof:** `tests/sprint-70-slice-e4-export-ui-and-e5-open-tab.test.js` — **3 failures** tied to **stale hard-coded `app.js?v=` cache-bust expectation** and dependent click counts (test drift), not observed production-browser failure. Recorded as known Node-suite debt; do not treat as baseline product failure.

**Not relied on:** `tests/utility-utilities-page-export-pipeline.test.js` — failures when vNext is unavailable in that harness (bootstrap/environment); contradicted by production-browser vNext availability. Harness issue for later hygiene, not T-030 product baseline failure.

---

## 7. Known issues / gaps

| Item | Severity | Notes |
| ---- | -------- | ----- |
| Assemble-from-current-run not end-to-end exercised | Medium gap | Control present; use paste/Preview path as proven render baseline; T-050 should re-check assemble when a runnable run is available |
| Open in New Tab not visually opened | Low | Button enablement + session HTML verified |
| Obsolete renderer still selectable | Expected | Removal is T-045; baseline records current default = vNext |
| Sprint-70 E4 Node suite cache-bust drift | Test debt | Does not block T-030; fix outside removal work or during T-050 test cleanup |
| Preview iframe content not introspected via a11y snapshot | Limitation | Verified via CDP `srcdoc` markers and DOMParser |

---

## 8. Behavioural baseline (required product behaviour)

> The following behaviour is now considered the **required product baseline** for Sprint 74A. T-045 / T-050 must preserve it.

1. **Tabs:** Create Workflow, My Workflows, Authoring, Prompt Studio, Prompt Library remain available; Authoring is the learner-export surface.  
2. **Authoring controls:** Assemble From Current Workflow Run, Preview HTML, HTML only (.html), Learner package (.zip), Open in New Tab remain available and usable for page artefacts.  
3. **Default renderer:** Learner page Preview uses **vNext** (`PRISM_LEARNER_RENDERER_VNEXT` / browser-loaded artefact).  
4. **Preview HTML:** For a valid `artifact_type: page` JSON, Preview produces learner HTML with vNext markers (`data-renderer=vnext`, `util-learner-page` / vNext activity structure), not obsolete journey-compass-only markup.  
5. **Styling / structure:** Preview HTML includes learner page structure and embedded presentation assets (styles/scripts) sufficient to display in the preview iframe.  
6. **Standalone HTML:** The rendered HTML string is a parseable HTML document that retains vNext learner structure when opened as a document.  
7. **Learner ZIP:** From rendered HTML, learner package build + ZIP serialization succeeds and produces non-empty ZIP bytes (assets included when present).  
8. **Open in New Tab:** After a successful Preview, Open in New Tab is enabled and operates on the session’s rendered learner HTML.  
9. **Workflow Resources panes:** Graphics / Video / Resources Authoring views remain present; resource counts/rendering continue to function when resources exist on the page.  
10. **Static browser-only deployment:** Application loads from static `index.html` + scripts; no runtime Node required for the above.  
11. **Generated artefact integrity:** Browser executes the committed `lib/learner-renderer-vnext-browser.js` that matches source (freshness gate from T-020).  
12. **No silent obsolete-renderer default:** Default Authoring learner renderer selection is vNext (obsolete option may still exist until T-045, but must not be the default path for baseline behaviour).

---

## 8a. Dated qualification — activity-beat/task interleaving (2026-08-06)

T-030’s production Preview of the heteroscedasticity fixture / Authoring path **observed** (and did not challenge) moments composition in which production tasks appear under a single **Your task** section after Learn materials. Subsequent operator review of a production render (Wilfred Owen A1 and equivalent shapes) identified the **grouped terminal task list** — study clauses flattened into one aggregate **Your task** while Learn shows materials only — as a **regression**, not desired baseline behaviour.

**Accepted baseline expectation:** associated activity beats and learner tasks remain structurally linked; study/production clauses are interleaved or placed with their corresponding Learn/Do moments; they are not flattened into one final aggregate task list unless the page model explicitly represents one aggregate task.

**S74A-T-042** owns root-cause analysis and definitive-path repair. **T-045 / T-050** must preserve the **corrected** interleaving behaviour, not the accidental aggregate observation.

Evidence: [S74A-T-042-activity-task-interleaving-definitive-path-repair.md](S74A-T-042-activity-task-interleaving-definitive-path-repair.md).

---

## 9. Remaining risks for T-040 / T-045

- Obsolete renderer UI option and code paths still exist — inventory must not leave silent fallbacks.  
- Assemble-from-run path needs reconfirmation when a fully runnable workflow run is available.  
- Cache-bust query strings on scripts can mask stale artefacts in some browsers (operator discipline; T-020 debt).  
- Node suites with stale cache-bust assertions may confuse agents if treated as product failures.

---

## 10. Hand-off to T-040

T-040 should inventory **obsolete renderer** surfaces for removal against this baseline. Do **not** begin removal until the inventory/removal plan exists. T-045 must preserve §8. T-050 must re-verify §8 on the production browser path after removal.

**Runtime changes in T-030:** **None**.

---

## 11. Files changed (documentation / sprint records only)

- This evidence report  
- Sprint 74A `PLAN.md` / `STATUS.md` / `HANDOVER.md` / `next-chat-briefing.md` / pack README / START-HERE (and parent pointers as needed)

No application runtime, build, schema, or generated-artefact files modified under T-030.
