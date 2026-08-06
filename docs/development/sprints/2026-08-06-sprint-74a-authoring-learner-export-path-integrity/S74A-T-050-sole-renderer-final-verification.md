# S74A-T-050 — Sole-Renderer Final Verification

**Sprint:** 74A — Authoring → Learner Export Path Integrity  
**Task:** S74A-T-050  
**Status:** **Done** (2026-08-06)  
**Authority:** [SPRINT-74A-CHARTER.md](SPRINT-74A-CHARTER.md) · [S74A-D02](decisions.md#s74a-d02--vnext-replaces-the-obsolete-learner-renderer) · [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality)  
**Pre-removal rollback:** `065b3acab820f9f45a0079f7c266e57e86cf3225`  
**Post-removal start:** `e63e37deca009d12316ac54344e5a50d31420daa`  
**Verification revision:** `eadcbbdc0fc32616d1c501e208c25a499a5bf986` (+ this docs commit)

---

## 1. Executive summary

T-050 confirms Prism has **one definitive learner-page renderer (vNext)** on the production browser path. Preview, standalone HTML content, learner ZIP packaging, Open-in-New-Tab readiness, Workflow Resources panes, and corrected T-042 activity/task interleaving all pass with fresh evidence. `slide_deck` remains owned by structured HTML. Final obsolete journey-compass / dead page-only structured-HTML residue was removed under T-050. **Sprint 74A is ready to close.**

---

## 2. Source revision and environment

| Item | Value |
| ---- | ----- |
| OS | Windows 10 (win32 10.0.26100) |
| Browser | Cursor IDE browser (Chromium/Electron 40 / Chrome 144) |
| URL | `http://localhost/prism/?t=s74a-t-050-verify&nocache=1` |
| Timestamp (UTC) | 2026-08-06T14:48:33Z |
| Verification HEAD (runtime) | `eadcbbd` |
| Fixture (pages) | `tests/fixtures/page-render/owen-a1-assembled-shape.json` |
| Fixture (slides) | inline minimal `slide_deck` JSON in browser |

---

## 3. Provenance ledger

| Step | Result |
| ---- | ------ |
| Record commit | `eadcbbd` (after residue cleanup) |
| Freshness before rebuild | **OK** |
| Rebuild | `npm run build:learner-renderer-vnext-browser` — no authored source change; outputs byte-stable |
| Freshness after rebuild | **OK**; working tree clean of generated churn |
| Fresh browser context | New URL with `nocache=1` |
| Fresh Preview/HTML/ZIP evidence | Generated during this run (Owen page + slide_deck spot-check) |

---

## 4. Generated-artefact verification

| Check | Result |
| ----- | ------ |
| `npm run check:learner-renderer-vnext-browser` | **OK** |
| Rebuild delta | **None** after T-050 residue (no `lib/learner-renderer-vnext/*` source edits in T-050) |
| Scripts loaded | `learner-renderer-vnext-browser.js`, export-runtime-source, standalone-embed, `app.js` |

---

## 5. Production-browser verification matrix

| Item | Result | Evidence |
| ---- | ------ | -------- |
| `index.html` loads | **Pass** | Document title PRISM; tabs present |
| Create / My Workflows / Authoring tabs | **Pass** | CDP / snapshot |
| No renderer selector | **Pass** | `#utilitiesRendererVersion` absent; no “Learner renderer” label |
| `PRISM_LEARNER_RENDERER_VNEXT` loaded | **Pass** | `typeof object`; `renderLearnerPageHtml` present |
| No obsolete renderer globals | **Pass** | Probe list empty |
| Assemble control present | **Pass** | `#utilitiesAssembleCurrentRunBtn` present |
| Live Assemble-from-current-run | **Qualified** | Not re-executed; saved runs still lack runnable prompts (same T-030 limitation). Downstream path proven with controlled Owen fixture. |
| Preview | **Pass** | ~121 989 HTML; no preview error |
| vNext markers | **Pass** | `data-renderer=vnext`, `util-learner-page`, `util-vnext-activity` |
| No obsolete compass markers | **Pass** | `util-journey-compass-header` false |
| Console | **Pass** | No application error toast/panel during Preview |
| Resources panes | **Pass** | Graphics (0) / Video (0) / **Resources (2)** |
| Download/Open controls enabled | **Pass** | HTML / ZIP / Open enabled after Preview |

---

## 6. Activity/task interleaving (T-042) — required

| Check | Result |
| ---- | ------ |
| Study appears in Learn moment | **Pass** (`studyInLearn: true`) |
| Study not duplicated into Do | **Pass** (`studyInDo: false`) |
| Write/Apply in Do | **Pass** (`writeInDo: true`) |
| Moment order | **Pass** — orient → learn → do → check |
| Single terminal Your task (not aggregate collapse of study+write) | **Pass** — Learn holds study; Do holds “Your task” + Write/Apply |
| Numbered-list behaviour | **Pass** (Node supporting T-042 suite) |

---

## 7. Standalone HTML

| Check | Result |
| ---- | ------ |
| Current Preview HTML parses | **Pass** |
| vNext only | **Pass** |
| Activities present | **Pass** (7 activity nodes) |
| No compass | **Pass** |
| Scripts present | **Pass** (3) |
| File-save dialog | Not exercised (UI enabled; same as T-030) |

---

## 8. Learner ZIP

| Check | Result |
| ---- | ------ |
| `buildLearnerPackage` | **Pass** (`ok: true`) |
| `PRISM_LEARNER_PACKAGE_ZIP.serializeLearnerPackageToZip` | **Pass** — **22 671** bytes |
| Package HTML is vNext | **Pass** |
| Interleaving preserved in packaged HTML source | **Pass** (same Preview HTML) |

---

## 9. Open in New Tab

| Check | Result |
| ---- | ------ |
| Control enabled with current HTML | **Pass** |
| Uses session Preview HTML | **Pass** (readiness) |
| Actual popup navigation | Not opened (automation constraint; same as T-030) |

---

## 10. Workflow Resources

| Check | Result |
| ---- | ------ |
| Graphics / Video / Resources toggles | **Pass** |
| Resources (2) after Owen Preview | **Pass** |
| Implementation unchanged under T-050 | Yes |

---

## 11. Slide-deck boundary

| Check | Result |
| ---- | ------ |
| Authoring Preview of minimal `slide_deck` | **Pass** — doctype HTML ~60 336; `util-slide` / content present |
| No vNext page markers on slide output | **Pass** |
| Node: structured HTML rejects pages; renders slides | **Pass** (`s74a-t-045-structured-html-nonpage`) |
| Owner | `runUtilityRendererByPlan` → `buildUtilityStructuredHtml` |

---

## 12. Node-based supporting evidence

| Suite | Result |
| ----- | ------ |
| Freshness + browser registration + feature-flag + export-shell + T-042 + Owen S72 + T-045 nonpage | **56/56 pass** |
| `s73-t-022-024-learner-package-resources` | **1/1 pass** |
| Label | **Supporting only** — not deployment proof |

---

## 13. Final residue sweep

| Match | Classification |
| ----- | -------------- |
| `utilitiesRendererVersion` / selector | **Removed** (asserted absent in UI + tests) |
| Journey compass helpers | **Removed** in `eadcbbd` |
| Dead `isPageArtefact` branches | **Removed** in `eadcbbd` |
| `buildUtilityStructuredHtml` | **Retained** — slide_deck / non-page owner |
| `runUtilityRendererByPlan` | **Retained** — non-page owner |
| `rendererVersion: "legacy"` in tests | **Intentional** — proves option ignored → still vNext |
| Historical sprint docs / T-010 / T-040 | **Historical evidence** |
| Unrelated “legacy” (workflows, visual-affordance `plan.legacy`, PF11 fallbacks) | **Unrelated** |
| Sprint-70 E4 drift | **Deferred debt** (out of scope; not a production blocker) |
| Active Compatibility retention wording | **Cleared** in T-045 docs |
| Blocking unresolved | **None** |

**Could a maintainer infer another learner renderer remains available?** **No.**

---

## 14. Journey-compass / `isPageArtefact` findings

| Item | Finding | Action |
| ---- | ------- | ------ |
| Journey-compass + Legacy header/nav cluster | Unreachable after T-045; only unit-tested | **Deleted** (~1.5k LOC incl. tests) in `eadcbbd` |
| `isPageArtefact` dead branches | Hardwired false after page reject | **Deleted**; structured HTML now non-page-only |
| `utilityRenderPageSections` | Still present; not deleted wholesale (INV-IM-02 investigate surface; not required for sole-renderer closure) | **Retained** with owner = structured/non-page helpers; not a second learner-page renderer |

---

## 15. AC-01…AC-15 matrix

| AC | Status | Evidence |
| -- | ------ | -------- |
| AC-01 | **Pass** | Architecture/README sole-vNext docs (T-045/T-050) |
| AC-02 | **Pass** | Selector absent in `index.html` + live DOM |
| AC-03 | **Pass** | Preview/HTML/ZIP/Open route via vNext pipeline; browser markers |
| AC-04 | **Pass** | Freshness OK before/after rebuild |
| AC-05 | **Pass** | Browser matrix §5–11 (Assemble live run **qualified**) |
| AC-06 | **Pass** | T-040 inventory Done (historical) |
| AC-07 | **Pass** | T-045 + T-050 residue removal |
| AC-08 | **Pass** | No selector/globals/fallbacks/compass residue |
| AC-09 | **Pass** | Legacy parity tests removed; compass/nav tests deleted |
| AC-10 | **Pass** | slide_deck owner explicit; shared helpers retained with owner |
| AC-11 | **Pass** | Preview/ZIP/Open/Resources/interleaving stable |
| AC-12 | **Pass** | Node suites labelled supporting |
| AC-13 | **Pass** | Static `index.html` localhost path |
| AC-14 | **Pass** | Active docs + code present one architecture |
| AC-15 | **Pass** | No 74B/74C; no schema redesign; no broad modularisation |

---

## 16. Remaining limitations / debt

- Live Assemble-from-current-run still not end-to-end proven when saved runs lack prompts (retained T-030 limitation).  
- Open-in-New-Tab popup not automation-opened.  
- Sprint-70 E4 Node harness `app.js?v=` drift unchanged.  
- Large `utilityRenderPageSections` remains for possible non-page/test use — not a learner-page renderer alternative.

---

## 17. Before / after architectural summary

| Before (pre-`065b3ac` intent) | After T-050 |
| ----------------------------- | ----------- |
| Selectable Legacy + vNext | **Sole vNext** learner pages |
| Dual routing in page pipeline | Unconditional `runLearnerRendererVNextExport` |
| Structured HTML rendered pages | Structured HTML **rejects** pages; serves `slide_deck` |
| Journey compass Legacy chrome | **Removed** |
| Compatibility retention docs | Sole-renderer active guidance |

Git scale indicator `065b3ac..eadcbbd` (retrospective only; line counts do **not** determine architectural success):

| Bucket | Files | +/- (approx) |
| ------ | ----- | ------------ |
| Authored runtime (`app.js`, `index.html`, `lib/learner-renderer-vnext*`) | few | large net deletion in `app.js` |
| Tests / fixtures | several | +266 / −2206 in that window |
| Documentation | 14 | +261 / −112 |
| Generated artefacts | minor | byte-stable after rebuild; no acceptance churn |
| **Combined window** | **31** | **+532 / −2330** |

Do not combine generated-bundle churn with authored-source reduction when judging success.

---

## 18. Closure recommendation

All acceptance criteria are evidenced with qualifications recorded. **Close Sprint 74A as COMPLETE / Closed.** Leave Sprint 74 programme wrapper **OPEN**. Do **not** open 74B/74C.
