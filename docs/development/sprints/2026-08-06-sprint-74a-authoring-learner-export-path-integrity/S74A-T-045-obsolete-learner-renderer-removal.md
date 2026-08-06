# S74A-T-045 â€” Obsolete Learner Renderer Removal

**Sprint:** 74A â€” Authoring â†’ Learner Export Path Integrity  
**Task:** S74A-T-045  
**Status:** **Done** (2026-08-06) â€” sole-renderer **acceptance** remains **S74A-T-050**  
**Authority:** [PLAN.md](PLAN.md) Â· [S74A-D02](decisions.md#s74a-d02--vnext-replaces-the-obsolete-learner-renderer) Â· [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality) Â· [S74A-T-040](S74A-T-040-obsolete-renderer-responsibility-removal-inventory.md)  
**Pre-removal rollback:** `065b3acab820f9f45a0079f7c266e57e86cf3225`

---

## 1. Executive summary

T-045 removed the obsolete learner-page renderer choice, routing, fallback, registry page variant, and Legacy parity tests. Learner **pages** export unconditionally through `runLearnerRendererVNextExport` / `PRISM_LEARNER_RENDERER_VNEXT`. **`slide_deck`** retains `runUtilityRendererByPlan` â†’ `buildUtilityStructuredHtml`. Active docs describe a sole vNext learner-page path. Final production-browser acceptance is **T-050**.

---

## 2. Pre-removal checkpoint

| Item | Value |
| ---- | ----- |
| Hash | `065b3acab820f9f45a0079f7c266e57e86cf3225` |
| Note | Clean tree after T-020â€¦T-042; freshness green |

---

## 3. Slice commits

| Slice | Subject | Short | Full |
| ----- | ------- | ----- | ---- |
| S1 | S74A-T-045: remove learner renderer selection | `76f274b` | `76f274b266e674ff0c1313cb55ee018ca6d8bd85` |
| S2 | S74A-T-045: route learner page export exclusively through vNext | `f4bc8ce` | `f4bc8cec4c9d378bccdd6eff140e80333839b5b8` |
| S3 | S74A-T-045: remove obsolete learner page routing | `105274e` | `105274ef289f49916f300350107bad125d82e4ff` |
| S4 | S74A-T-045: remove obsolete learner renderer implementation | `8396e01` | `8396e01a1f55e26d3ec11db04fbd4d647db4d604` |
| S5a | S74A-T-045: remove obsolete renderer browser bootstrap | `2271549` | `227154910b812e6be20dc4f47fe98bcd25ab089b` |
| S5b | S74A-T-045: rebuild vNext browser artefacts after renderer removal | `521d511` | `521d511a84dab3ef56c66a28860666500f24f63b` |
| S6 | S74A-T-045: remove obsolete renderer tests and fixtures | `ccab7e2` | `ccab7e221d75837e1efdca673f25c64cdefac6f4` |
| S7 | S74A docs: describe sole vNext renderer after removal | `9cc73e6` | `9cc73e65ca6835d18a9647f08a1eb25ec7ccdef8` |
| S8 | S74A docs: record obsolete renderer removal | `e08ff59` | `e08ff59a9efe4146f76f064e453213cdd2481caf` |

---

## 4. Inventory items completed

| ID | Outcome |
| -- | ------- |
| INV-UI-01 | **Removed** â€” `#utilitiesRendererVersion` / Legacy option |
| INV-UI-02 | **Retained** â€” unrelated â€œLegacy saved valuesâ€ workflow hint |
| INV-ST-01â€¦07 | **Removed** â€” no renderer choice state/DOM/persistence |
| INV-RT-01â€¦03,05,06,08 | **Done** â€” unconditional vNext; explicit missing-global error |
| INV-RT-04 | **Retained** â€” `runUtilityRendererByPlan` for non-page |
| INV-RT-07 | **Removed** â€” `buildDefaultUtilityPageRenderPlan` |
| INV-IM-01 | **Retained** â€” `buildUtilityStructuredHtml`; **rejects** `artefactType=page` |
| INV-IM-03 apply path | **Removed** from structured HTML exit; helper fns remain for unit tests |
| INV-IM-06 page registry | **Removed** â€” `document.variants.page` |
| INV-IM-08 | **Done** â€” `normalizeRendererVersion` accepts only vNext |
| INV-TE-01â€¦07 | **Done** â€” Legacy parity deleted/rewritten |
| INV-TE-09 | **Deferred** â€” Sprint-70 E4 drift (out of scope) |
| INV-DO-01,02,04 | **Updated** â€” active sole-renderer guidance |
| INV-DO-05 | **Retained historically** â€” T-010 / discovery packs |

---

## 5. Files removed / changed (summary)

- `index.html` â€” selector removed  
- `app.js` â€” state/els/version plumbing; unconditional pipeline; registry; page reject in structured HTML  
- `lib/learner-renderer-vnext/render-learner-page.js`, `index.js` â€” sole-version API  
- `lib/learner-renderer-vnext-browser.js` â€” rebuilt  
- Tests â€” Legacy parity removed; `tests/s74a-t-045-structured-html-nonpage.test.js` added  
- Active docs â€” README + architecture export narrative  

---

## 6. Retained shared responsibilities and owners

| Responsibility | Owner |
| -------------- | ----- |
| Learner page Preview/HTML/ZIP/Open | `runLearnerRendererVNextExport` + `PRISM_LEARNER_RENDERER_VNEXT` |
| Workflow Resources injection | Existing Authoring / export helpers (unchanged ownership) |
| `slide_deck` HTML | `runUtilityRendererByPlan` â†’ `buildUtilityStructuredHtml` |
| Markdown/escape helpers | Structured-HTML family (shared) |
| Beat/task interleaving | vNext `parse-learner-task` + `compose-generic-moments` (T-042) |

---

## 7. Persisted-state outcome

No durable renderer preference existed. Selector/state removed. Nothing to migrate.

---

## 8. Routing outcome

`runUtilityPageExportPipeline` always calls `runLearnerRendererVNextExport`. Page path does not call `runUtilityRendererByPlan`. `buildUtilityStructuredHtml` returns an error for `artefactType === "page"`.

---

## 9. Bootstrap / global outcome

No obsolete learner-renderer script tag existed. vNext scripts retained. `normalizeRendererVersion("legacy")` throws. Browser artefact rebuilt and freshness **OK**.

---

## 10. Tests / fixtures outcome

Legacy exclusivity / parity suites removed. Focused suites green (feature-flag, browser-registration, export-shell, field-coverage, icons, visual-affordances, journey-nav helpers, T-042, T-045 non-page). Intentional tests that pass `rendererVersion: "legacy"` assert the option is **ignored** and output remains vNext.

---

## 11. Residue sweep (classifier)

| Match class | Examples | Classification |
| ----------- | -------- | -------------- |
| Removed | `utilitiesRendererVersion`, selector DOM, `resolveLearnerRendererVersion`, page registry variant, Legacy parity tests | Gone from runtime |
| Historical evidence | T-010, T-030, T-040, S74-T-001/010, sprint-67 capture scripts | **Retain** with dated context |
| Retained shared | `buildUtilityStructuredHtml`, `runUtilityRendererByPlan`, slide_deck | **Owner:** non-page structured HTML |
| Unrelated â€œlegacyâ€ | workflow `wf-legacy` ids, PF11 capture_shape_fallback, visual-affordance `plan.legacy`, material `resolveLegacyTableWorksheet` | **Unrelated** to learner-renderer choice |
| Dead helpers (non-blocking) | `utilityApplyLearningJourneyHeaderToExportHtml*`, journey compass builders still in `app.js` | Unreachable from page export; unit-tested only â€” optional later delete; **not** a second renderer |
| Dead `isPageArtefact` branches | Inside `buildUtilityStructuredHtml` after early page reject | Unreachable; optional cleanup |
| Active CONTEXT pre-removal sentence | Updated in S8 with supersession | Fixed |
| Unresolved blocking | **None** for â€œanother learner renderer available?â€ | Answer: **no** |

---

## 12. Production-browser evidence (Node supporting + freshness)

| Check | Result |
| ----- | ------ |
| Freshness | `npm run check:learner-renderer-vnext-browser` â†’ **OK** |
| Focused Node suites | Pass (see Â§10) |
| Operator browser re-baseline of T-030 Â§8 | **Deferred to T-050** (required for final acceptance) |

---

## 13. Generated-artefact provenance

| Item | Value |
| ---- | ----- |
| Builder | `scripts/build-learner-renderer-vnext-browser.js` |
| Rebuild commit | `521d511` |
| Source trigger | `normalizeRendererVersion` sole-vNext change (`2271549`) |

---

## 14. Risks and unresolved items

- Dead journey-compass / page-only structured-HTML branches remain as unreachable code (size cleanup optional).  
- Sprint-70 E4 Node harness drift unchanged (out of scope).  
- T-030 Assemble-from-current-run evidence limitation unchanged.  
- Full production-browser Â§8 re-proof is **T-050**.

---

## 15. Hand-off to T-050

1. Fresh browser context; cache bypass; static `index.html`.  
2. Confirm no renderer selector; Preview/HTML/ZIP/Open are vNext.  
3. Preserve T-042 interleaving and Workflow Resources.  
4. Spot-check `slide_deck` if available.  
5. Close ACs only when T-050 evidence is recorded.  

Do **not** claim sprint closure from T-045 alone.
