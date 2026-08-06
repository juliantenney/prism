# S74A-T-040 — Obsolete Renderer Responsibility and Removal Inventory

**Sprint:** 74A — Authoring → Learner Export Path Integrity  
**Task:** S74A-T-040  
**Status:** **Done** (2026-08-06)  
**Mode:** Inventory and removal design only — **no runtime deletion**, **no routing/state/UI/test/fixture changes**  
**Authority:** [PLAN.md](PLAN.md) · [SPRINT-74A-CHARTER.md](SPRINT-74A-CHARTER.md) · [S74A-D02](decisions.md#s74a-d02--vnext-replaces-the-obsolete-learner-renderer) · parent [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality)  
**Behavioural baseline:** [S74A-T-030-production-browser-baseline.md](S74A-T-030-production-browser-baseline.md) **§8**  
**Artefact freshness (pre-inventory):** `npm run check:learner-renderer-vnext-browser` → **OK** (2026-08-06)

---

## 1. Executive summary

T-040 maps every surface that still makes the **obsolete learner page renderer** reachable or appear available, and states what must happen under **T-045**.

**Verdict**

| Question | Answer |
| -------- | ------ |
| What can be removed? | Authoring renderer selector + Legacy option; `utilitiesRendererVersion` state/DOM plumbing; `resolveLearnerRendererVersion` / Legacy branch of `runUtilityPageExportPipeline`; Legacy-only journey-nav apply path for pages; version-selector test hooks; tests that assert Legacy exclusivity or force `rendererVersion: "legacy"`; active docs that still describe Legacy as selectable Compatibility |
| What replaces it? | Unconditional page export through `runLearnerRendererVNextExport` → browser-loaded `PRISM_LEARNER_RENDERER_VNEXT` (T-020 chain) |
| What must remain? | `buildUtilityStructuredHtml` + `runUtilityRendererByPlan` + registry for **non-page** artefacts (notably **`slide_deck`**); shared markdown/object/HTML helpers those paths use; vNext modules, generated browser artefacts, and Authoring export controls from T-030 §8 |
| Persist migration? | **No** localStorage/IndexedDB preference found. Session DOM/`state` only. After selector removal, always vNext — already governed by **S74A-D02** |
| Binding decision needed? | **None** beyond S74A-D02 for selector/routing. Flag **investigate** items (page-only branches inside shared structured HTML; dead registry variants) for evidence during T-045 slices — not product architecture choices |

**Runtime code under T-040:** unchanged.

---

## 2. Method and search strategy

| Approach | What was done |
| -------- | ------------- |
| Freshness | Ran `npm run check:learner-renderer-vnext-browser` before treating generated vNext artefacts as current |
| Baseline authority | Used T-030 production-browser evidence + §8 checklist; did **not** use historical HTML/ZIP/screenshots as acceptance |
| Symbol / string search | `utilitiesRendererVersion`, `resolveLearnerRendererVersion`, `buildUtilityStructuredHtml`, `runUtilityRendererByPlan`, `runUtilityPageExportPipeline`, `runLearnerRendererVNextExport`, `rendererVersion: "legacy"`, UI `value="legacy"` |
| Call-site tracing | Page pipeline branch; Authoring Preview/regenerate; `prismTestApi` hooks; registry mappings |
| Bootstrap | `index.html` script tags for vNext vs absence of obsolete renderer scripts |
| Docs | Active architecture + root README Compatibility wording vs historical sprint packs (left historically accurate) |
| Exclusion filter | Unrelated “legacy” uses (workflow brief UI, capture `{legacy:true}`, episode_plans back-compat, visual-affordance `plan.legacy` / handover mode `"legacy"`, starting-artefact hint text) — **not** inventory items unless they select the obsolete page renderer |

Stale Node debt recorded in T-030 (**Sprint-70 E4** `app.js?v=` drift) was **not** treated as production failure and is **out of scope** for T-040/T-045 removal work.

---

## 3. Current renderer architecture

```text
Authoring (index.html #utilitiesRendererVersion)
  ├─ vnext (default) ──► runUtilityPageExportPipeline
  │                         └─ runLearnerRendererVNextExport
  │                              └─ window.PRISM_LEARNER_RENDERER_VNEXT
  │                                   (lib/learner-renderer-vnext-browser.js ← build from lib/learner-renderer-vnext/*)
  └─ legacy ──────────► runUtilityPageExportPipeline
                          └─ runUtilityRendererByPlan → buildUtilityStructuredHtml (page branch)
                               + utilityApplyLearningJourneyHeaderToExportHtml (page-only)

Non-page (e.g. slide_deck):
  renderUtilitiesArtefactHtmlWithResolvedPlan
    └─ runUtilityRendererByPlan → buildUtilityStructuredHtml (slides path; no version select)
```

**Definitive owner (pages):** vNext source + generated browser artefact + `runLearnerRendererVNextExport`.  
**Obsolete (pages):** Legacy select value + non-vNext pipeline branch + page-only journey-compass/header path inside structured HTML.  
**Shared (retain):** structured HTML builder for **slide_deck** (and any live non-page registry consumers).

---

## 4. Complete inventory

### Legend

| Proposed action | Meaning |
| --------------- | ------- |
| **Remove** | Exists solely for obsolete page renderer / selection |
| **Retain** | Supports current behaviour; named owner |
| **Move / rename** | Responsibility remains; ownership or name misleading |
| **Migrate** | Persisted/session values need controlled transition |
| **Investigate** | Evidence incomplete for safe deletion |

### 4.1 User-facing surface

| ID | File | Symbol / selector / state | Category | Current responsibility | Caller / consumer | vNext/current replacement | Behaviour protected (T-030 §8) | Shared? | Proposed action | Verification | Removal slice | Confidence | Notes |
| -- | ---- | ------------------------- | -------- | ---------------------- | ----------------- | ------------------------- | ------------------------------ | ------- | --------------- | ------------ | ------------- | ---------- | ----- |
| INV-UI-01 | `index.html` ~486–490 | `#utilitiesRendererVersion`; label “Learner renderer”; options `vnext` / `legacy` | UI | Lets operator choose obsolete vs vNext page renderer | Authoring form; `els.utilitiesRendererVersion`; `getUtilitiesRendererVersion` | No control — always vNext | §8.3, §8.12 (after removal: no choice; still vNext) | No | **Remove** entire control + Legacy option | T-045 browser: control absent; Preview still vNext | S1 | High | Do not leave hidden select |
| INV-UI-02 | `index.html` ~675 | “Legacy saved values” in `wfDesignStartingArtefactHint` | UI | Workflow starting-artefact hint | Design panel | Unrelated | None (not learner renderer) | N/A | **Retain** | Residue sweep must not delete this text as “Legacy renderer” | — | High | **Exclude** from renderer removal |
| INV-UI-03 | `style.css` | `.form-row.compact` etc. | CSS | Shared form layout | Many forms | Same | Layout | Yes | **Retain** | No renderer-specific CSS found for select | — | High | No `#utilitiesRendererVersion` CSS |

### 4.2 State and persistence

| ID | File | Symbol / selector / state | Category | Current responsibility | Caller / consumer | Replacement | Behaviour (§8) | Shared? | Proposed action | Verification | Slice | Conf | Notes |
| -- | ---- | ------------------------- | -------- | ---------------------- | ----------------- | ----------- | -------------- | ------- | --------------- | ------------ | ----- | ---- | ----- |
| INV-ST-01 | `app.js` ~221 | `state.utilitiesRendererVersion: "vnext"` | state | In-memory renderer choice | Generate / clear / test setters | Drop field; hardwire vNext | §8.3, §8.12 | No | **Remove** | Grep state key gone; Preview still works | S1 | High | |
| INV-ST-02 | `app.js` ~494 | `els.utilitiesRendererVersion` | state | DOM cache for select | init + get/set helpers | Drop | §8.3 | No | **Remove** | No getElementById | S1 | High | |
| INV-ST-03 | `app.js` ~50509–50516 | `getUtilitiesRendererVersion()` | state | Reads DOM/state; preserves `"legacy"` | Preview, regenerate, refresh | Always `"vnext"` then delete | §8.3, §8.12 | No | **Remove** | Call sites deleted or inlined | S1–S2 | High | |
| INV-ST-04 | `app.js` ~50578–50579, ~50641 | Generate syncs version into pipeline opts | state/routing | Passes version into export | `handleUtilitiesGenerate` | Omit; pipeline always vNext | §8.4–8.8 | No | **Remove** version plumbing | Preview/HTML/ZIP/Open still work | S1–S2 | High | |
| INV-ST-05 | `app.js` ~50915, ~50946 | Clear resets select + state to vnext | state | Reset choice | `handleUtilitiesClear` | Remove with select | Clear still resets Authoring | No | **Remove** those lines | Clear still usable | S1 | High | |
| INV-ST-06 | — | localStorage / IndexedDB for renderer version | state | **None found** | — | N/A | — | — | **Migrate** = no-op (delete in-memory only) | Confirm no storage keys in residue sweep | S1 | High | Intended final: no preference to migrate |
| INV-ST-07 | — | Dedicated `change` listener on select | state | **None** — value read at export time | — | — | — | — | n/a | — | — | High | |

**Persisted Legacy selections (design outcome):** There is **no durable stored preference**. Mid-session Legacy selection dies with the page. T-045 should remove the control and always route pages to vNext. Covered by **S74A-D02**; no new decision.

### 4.3 Routing and orchestration

| ID | File | Symbol | Category | Responsibility | Consumer | Replacement | §8 | Shared? | Action | Verification | Slice | Conf | Notes |
| -- | ---- | ------ | -------- | -------------- | -------- | ----------- | -- | ------- | ------ | ------------ | ----- | ---- | ----- |
| INV-RT-01 | `app.js` ~49983–49989 | `resolveLearnerRendererVersion` | routing | Accepts `legacy`\|`vnext`; throws otherwise | Page pipeline; tests | Delete or collapse to always vNext then delete | §8.3, §8.12 | No | **Remove** | Invalid version tests retired; pages always vNext | S2 | High | |
| INV-RT-02 | `app.js` ~50405–50428 | Legacy branch of `runUtilityPageExportPipeline` | routing | Non-vNext → structured HTML page render | When version ≠ vnext | Delete branch; always `runLearnerRendererVNextExport` | §8.4–8.6 | Spine shared; branch obsolete | **Remove** Legacy branch | Page Preview never emits Legacy-only markers | S2–S3 | High | Keep assembly/validation prefix |
| INV-RT-03 | `app.js` ~50186+ | `runLearnerRendererVNextExport` | routing | Definitive page export | Pipeline vnext path | **Retain** | §8.3–8.8, §8.11 | No (vNext) | **Retain** | T-050 browser recheck | — | High | |
| INV-RT-04 | `app.js` ~49771+ | `runUtilityRendererByPlan` | routing | Dispatches registry renderer | Page Legacy + non-page | Retain for non-page | Non-page HTML | **Yes** | **Retain** | slide_deck Preview still works | S3–S4 | High | After S2, page path must not call it |
| INV-RT-05 | `app.js` ~50450–50507 | `renderUtilitiesArtefactHtmlWithResolvedPlan` | routing | Pages → versioned pipeline; else plan render | Async Authoring render | Pages: always vNext opts omitted | §8.4+ | Partial | **Remove** `rendererVersion` on page; **Retain** non-page | Page + slide paths | S2 | High | |
| INV-RT-06 | `app.js` ~48566, ~49197 | regenerate/refresh pass `getUtilitiesRendererVersion()` | routing | Keeps version on refresh | Preview refresh | Drop arg | §8.4 | No | **Remove** version arg | Refresh still vNext | S2 | High | |
| INV-RT-07 | `app.js` ~49947+ | `buildDefaultUtilityPageRenderPlan` | routing/impl | Default plan for Legacy page path | Legacy branch | Unused after branch removal → **Remove** if only Legacy caller | — | Legacy-page | **Remove** if sole caller is Legacy | Grep callers | S3 | Medium | Confirm no other callers in T-045 |
| INV-RT-08 | Fallbacks | Silent Legacy if vNext missing | routing | (Must not remain) | — | Fail explicitly if vNext unavailable | §8.3, §8.11 | No | **Replace** silent fallback with explicit error | Force missing global → error toast | S2–S3 | High | Align with T-020: no silent obsolete default |

### 4.4 Obsolete / shared implementation

| ID | File | Symbol | Category | Responsibility | Consumer | Replacement | §8 | Shared? | Action | Verification | Slice | Conf | Notes |
| -- | ---- | ------ | -------- | -------------- | -------- | ----------- | -- | ------- | ------ | ------------ | ----- | ---- | ----- |
| INV-IM-01 | `app.js` ~47427–47913 | `buildUtilityStructuredHtml` | implementation | Structured HTML for **page** (Legacy) **and** **slide_deck** | Registry; Legacy page path | Page: vNext; slides: **this fn** | Non-page export | **Yes** (slides) | **Retain**; strip unreachable **page-only** subpaths later | slide_deck still renders; page never via this for Authoring | S4 | High | Do **not** delete wholesale |
| INV-IM-02 | `app.js` ~35446+ | `utilityRenderPageSections` | implementation | Page section HTML inside structured builder | Page structured path | vNext owns page sections | — | Page-structured | **Investigate** then remove if only Legacy page | Prove no slide_deck call | S4 | Medium | Large surface |
| INV-IM-03 | `app.js` ~44090+, ~44610+ | `utilityRenderLearningJourneyNavHtml` / `utilityApplyLearningJourneyHeaderToExportHtml` | implementation | Obsolete page journey header/compass | End of `buildUtilityStructuredHtml` when `isPageArtefact` | vNext sequential journey nav helpers | §8.4 (vNext markers, not compass-only) | Legacy-page | **Remove** when page Legacy path gone | No Legacy journey header on pages | S4 | High | Keep `utilityRenderVnextSequentialJourneyNavHtml*` |
| INV-IM-04 | `app.js` ~43157–43780 | `getUtilityPagePresentationCss*` | implementation | Presentation CSS embedded in structured HTML docs | Structured HTML standalone | Retain while slides use it | Non-page styling | **Yes** (likely) | **Investigate** / retain subset for slides | Slide HTML still styled | S4–S7 | Medium | Some rules reference `.util-learner-renderer-vnext` — keep those owned by vNext export CSS paths |
| INV-IM-05 | `app.js` ~32564–35025+ | `utilityRenderMarkdown*` / object/array/escape helpers | implementation | Shared HTML helpers | Structured HTML family | Retain under structured-HTML owner | — | **Yes** | **Retain** | Existing non-page + any shared tests | S4 | High | Not used by `lib/learner-renderer-vnext/*` |
| INV-IM-06 | `app.js` ~49645–49665 | `UTILITY_RENDERER_REGISTRY` page → `buildUtilityStructuredHtml` | routing/impl | Catalog page variant still maps to structured HTML | Legacy page via plan | Page Authoring must not use this for live pages | — | Registry entry for Legacy | **Remove** live page→structured mapping **or** leave dead only if unreachable — prefer remove page variant after S2 | Grep page plan never hits structured for Authoring | S3–S4 | Medium | slide_deck mapping **Retain** |
| INV-IM-07 | Registry `generic_document` / `generic_assessment` | same | implementation | Registered; no live domain `renderHints` found in current packs | Possibly unused | Confirm dead | — | Unknown | **Investigate** | Catalog + call traces | S4 | Low | Reserved vs dead |
| INV-IM-08 | `lib/learner-renderer-vnext/render-learner-page.js` | `normalizeRendererVersion` accepts `"legacy"` | implementation | Version normaliser still names legacy | Exported API; bundled artefact | Accept only vnext / default; drop legacy | §8.12 | vNext API residue | **Remove** `"legacy"` acceptance | Freshness check + tests | S5 | High | Rebuild browser artefact after source change |
| INV-IM-09 | Journey compass / Legacy page framing helpers only called from structured page path | `app.js` | implementation | Obsolete page chrome | Legacy page HTML | vNext composition | §8.4 | No | **Remove** with INV-IM-03 after caller proof | Grep | S4 | Medium | |

### 4.5 Browser bootstrap

| ID | File | Symbol | Category | Responsibility | Consumer | Replacement | §8 | Shared? | Action | Verification | Slice | Conf | Notes |
| -- | ---- | ------ | -------- | -------------- | -------- | ----------- | -- | ------- | ------ | ------------ | ----- | ---- | ----- |
| INV-BB-01 | `index.html` ~1136–1138 | vNext browser scripts | bootstrap | Load definitive renderer | Production path | **Retain** | §8.10–8.11 | No | **Retain** | Freshness + T-050 | — | High | |
| INV-BB-02 | — | Obsolete renderer as separate script tag | bootstrap | **None** (Legacy is inlined in `app.js`) | — | — | — | — | n/a | Confirm no second learner renderer script | S5 | High | |
| INV-BB-03 | `index.html` cache-bust `?v=` | query strings | bootstrap | Cache bust | Browser | Operator discipline (T-020 debt) | §8.11 | Yes | **Retain** (no auto-bump under T-040) | — | — | High | Do not “fix” under removal |

### 4.6 Packaging and export

| ID | File | Symbol | Category | Responsibility | Consumer | Replacement | §8 | Shared? | Action | Verification | Slice | Conf | Notes |
| -- | ---- | ------ | -------- | -------------- | -------- | ----------- | -- | ------- | ------ | ------------ | ----- | ---- | ----- |
| INV-PK-01 | `runLearnerRendererVNextExport` + package/ZIP helpers | packaging | Learner ZIP / HTML from vNext HTML | Authoring download controls | **Retain** | §8.6–8.8 | No | **Retain** | T-050 ZIP non-empty | — | High | T-030 baseline |
| INV-PK-02 | Historical exported HTML/ZIP in fixtures/docs | fixture | Past outputs | Historical | Regenerate if used as evidence | — | Historical | **Retain as historical**; do not treat as current | Provenance rule | — | High | |
| INV-PK-03 | Non-page structured HTML export | packaging | slide_deck HTML | Authoring non-page | **Retain** `buildUtilityStructuredHtml` | Not §8 page spine | Yes | **Retain** | Spot-check slide_deck if available | S4 | Medium | |

### 4.7 Tests and fixtures

| ID | File | Symbol | Category | Responsibility | Consumer | Replacement | §8 | Shared? | Action | Verification | Slice | Conf | Notes |
| -- | ---- | ------ | -------- | -------------- | -------- | ----------- | -- | ------- | ------ | ------------ | ----- | ---- | ----- |
| INV-TE-01 | `tests/learner-renderer-vnext-feature-flag.test.js` | Legacy baseline / selector set/get / invalid version | test | Protects dual-version flag | CI | Rewrite for sole path | Supporting | No | **Remove**/rewrite Legacy cases | Focused suite green | S6 | High | |
| INV-TE-02 | `tests/learner-renderer-vnext-export-shell.test.js` | `renderLegacyExport`; legacy unchanged | test | Legacy shell parity | CI | Delete Legacy cases | Supporting | No | **Remove** | Suite green | S6 | High | |
| INV-TE-03 | `tests/learner-renderer-vnext-browser-registration.test.js` | explicit legacy matches baseline | test | Legacy registration | CI | Delete Legacy cases | Supporting | No | **Remove** | Keep vNext registration | S6 | High | |
| INV-TE-04 | `tests/learner-renderer-vnext-field-coverage.test.js` | “legacy unchanged” | test | Diff vs Legacy | CI | Delete | Supporting | No | **Remove** | — | S6 | High | |
| INV-TE-05 | `tests/learner-renderer-vnext-icons.test.js` | `rendererVersion: "legacy"` | test | Legacy icon parity | CI | Delete Legacy asserts | Supporting | No | **Remove** | — | S6 | High | |
| INV-TE-06 | `tests/learner-renderer-vnext-visual-affordances.test.js` | legacy baseline compare | test | Legacy VA parity | CI | Delete | Supporting | No | **Remove** | — | S6 | High | |
| INV-TE-07 | `tests/utility-learning-journey-nav-render.test.js` | forces `rendererVersion: "legacy"` | test | Obsolete journey nav | CI | Replace with vNext nav tests or delete | Supporting | No | **Remove** or replace | vNext nav coverage exists via other hooks | S6 | High | |
| INV-TE-08 | Many `buildUtilityStructuredHtmlForTest` suites **without** version | test | Default pipeline → **vNext** today | CI | Keep as page pipeline tests; rename later | Supporting | Mixed | **Retain** (behaviour); **rename** API later | Confirm still vNext-only after S2 | S6 | Medium | Name is misleading |
| INV-TE-09 | `tests/sprint-70-slice-e4-export-ui-and-e5-open-tab.test.js` | stale `app.js?v=` | test | Export UI Node harness | CI | Fix separately | Not product | Drift | **Retain as debt** — **do not fix under T-040/T-045 removal** | Recorded T-030 | — | High | Out of scope |
| INV-API-01 | `app.js` ~52027–52032 | `get/setUtilitiesRendererVersionForTest` | test | Mutate selector in tests | TE-01 etc. | **Remove** | — | No | **Remove** | Grep | S5–S6 | High | |
| INV-API-02 | `app.js` ~52059 | `resolveLearnerRendererVersionForTest` | test | Expose resolver | TE-01 | **Remove** | — | No | **Remove** | Grep | S5–S6 | High | |
| INV-API-03 | `app.js` ~52045–52057 | `buildUtilityStructuredHtmlForTest` → page pipeline | test | Misnamed wrapper | Many tests | Rename to page-export test helper | Supporting | Mixed | **Move / rename** | Update callers | S6 | Medium | |
| INV-API-04 | `app.js` journey Legacy ForTest hooks | test | Legacy nav apply | TE-07 | **Remove** with helpers | — | No | **Remove** | Grep | S5–S6 | Medium | Keep vNext ForTest nav APIs |

### 4.8 Presentation residue

| ID | File | Symbol | Category | Responsibility | Action | Conf | Notes |
| -- | ---- | ------ | -------- | -------------- | ------ | ---- | ----- |
| INV-CSS-01 | Renderer-select-specific CSS | — | CSS | None found | n/a | High | |
| INV-CSS-02 | Comments / labels “Learner renderer” choice | `index.html`, docs | docs/UI | Choice chrome | **Remove** with INV-UI-01 | High | |

### 4.9 Tooling

| ID | File | Symbol | Category | Responsibility | Action | Conf | Notes |
| -- | ---- | ------ | -------- | -------------- | ------ | ---- | ----- |
| INV-TL-01 | `npm run check:learner-renderer-vnext-browser` | tooling | Freshness gate | **Retain** | High | T-020 |
| INV-TL-02 | `npm run build:learner-renderer-vnext-browser` | tooling | Single builder | **Retain** | High | Rebuild after INV-IM-08 |
| INV-TL-03 | Scripts probing Legacy page render | tooling | Historical probes in old sprints | **Retain historical**; do not use as current evidence | High | |

### 4.10 Documentation and naming

| ID | File | Category | Responsibility | Action | Conf | Notes |
| -- | ---- | -------- | -------------- | ------ | ---- | ----- |
| INV-DO-01 | `docs/architecture/renderer-export-behavior.md` | docs | Still Supported/Compatibility dual path | **Update** to sole renderer in T-045/T-050 | High | Do not rewrite T-010 evidence |
| INV-DO-02 | `docs/architecture/learner-renderer-vnext.md` | docs | Mentions dual selection | **Update** | High | |
| INV-DO-03 | ADR-012 (and similar) Legacy-behind-selection wording | docs | Historical ADR text | **Supersede note** / update active summary | Medium | |
| INV-DO-04 | Root `README.md` Compatibility wording | docs | User-facing | **Update** | High | |
| INV-DO-05 | Historical sprint packs / T-010 report | docs | Accurate for their time | **Retain historically** | High | Supersession notes already exist |
| INV-DO-06 | Comments in `lib/learner-renderer-vnext/*` “legacy \| vnext” | docs/impl | Misleading API docs | **Update** with INV-IM-08 | High | |
| INV-DO-07 | Internal IDs `utilities*` | naming | Authoring DOM IDs | **Retain** (Authoring label already user-facing) | High | Not obsolete renderer |

---

## 5. Responsibility ownership map

| Responsibility | Definitive owner after T-045 | Notes |
| -------------- | ---------------------------- | ----- |
| Learner **page** HTML (Preview / HTML / Open) | `runLearnerRendererVNextExport` + `PRISM_LEARNER_RENDERER_VNEXT` | Sole path |
| Learner ZIP packaging | Existing package helpers consuming rendered HTML | Unchanged ownership |
| Workflow Resources panes | Existing Authoring resource UI | Unrelated to renderer choice |
| Non-page structured HTML (`slide_deck`) | `runUtilityRendererByPlan` → `buildUtilityStructuredHtml` | **Retain**; rename/clarify later if desired |
| Markdown/object HTML helpers | Same structured-HTML family | **Retain** |
| Version selection UI | **None** (removed) | S74A-D02 |
| Obsolete page journey compass header | **None** (removed) | Replaced by vNext journey nav |

---

## 6. Persisted-state findings

| Finding | Evidence |
| ------- | -------- |
| No localStorage key for renderer version | Grep of `utilitiesRendererVersion` / renderer version storage — session `state` + DOM only |
| No IndexedDB preference | No matches tying IDB to renderer version |
| Reset behaviour today | Clear → `"vnext"` |
| Intended after T-045 | No field; no select; pages always vNext |
| Migration of “previously saved Legacy” | **Not applicable** for durable storage; in-session value discarded when control removed |

**Decision:** No new `S74A-D##`. **S74A-D02** already requires removing user-facing selection and unconditional vNext routing.

---

## 7. Routing and fallback findings

| Path | Today | Intended final |
| ---- | ----- | -------------- |
| Page + vNext | `runLearnerRendererVNextExport` | Same — only path |
| Page + Legacy | `runUtilityRendererByPlan` → `buildUtilityStructuredHtml` | **Deleted** |
| Page + missing vNext global | (behaviour depends on export helper) | **Fail explicitly** — no silent Legacy |
| Non-page artefact | `runUtilityRendererByPlan` (no version) | **Retain** (not a learner-page renderer fallback) |
| Invalid version string | throw / pipeline error | N/A after resolver removal |

---

## 8. Browser-bootstrap findings

- Obsolete renderer is **not** a separate `index.html` script; it lives in `app.js`.
- vNext scripts remain required (T-020).
- No feature flag module separate from the select/version helpers.

---

## 9. Test/fixture provenance findings

- Suites listed INV-TE-01…07 **explicitly** protect Legacy — delete or rewrite under T-045.
- Suites calling `buildUtilityStructuredHtmlForTest` **without** `rendererVersion` already exercise the **default vNext** pipeline — treat as current page coverage, not Legacy proof.
- Do **not** treat old snapshots / exported HTML / Sprint-70 E4 failures as acceptance of production behaviour.
- Fixtures that are **inputs** (page JSON) remain valid; **derived** renderer HTML in fixtures must be regenerated if used as evidence (T-030 discipline).

---

## 10. Documentation and terminology findings

Active docs still describe **Compatibility / selectable Legacy** (pre-D02 narrative). Update in T-045/T-050. Historical sprint evidence (including T-010) stays accurate with supersession notes.

Preferred terms: definitive implementation · sole learner renderer · obsolete/superseded renderer · production browser path · generated browser artefact · Node-based test evidence.

---

## 11. Exact proposed removal map

### Renderer selector (final state)

- Remove `#utilitiesRendererVersion` and label from Authoring.
- Remove associated `els` / `state` / get/set/clear/test hooks.
- No replacement control.

### Persisted Legacy

- No durable migrate step.
- Always vNext after removal.

### Routing

- `runUtilityPageExportPipeline`: after validation/assembly, **only** `runLearnerRendererVNextExport`.
- Stop passing `rendererVersion` from Authoring handlers.

### Fallbacks

- No Legacy fallback.
- Missing vNext → explicit error.
- Non-page structured HTML is **not** a Legacy fallback.

### Implementation deletion (expected)

- Legacy branch body in `runUtilityPageExportPipeline`.
- `resolveLearnerRendererVersion` + test wrappers.
- Selector UI/state helpers.
- Page-only Legacy journey header apply path once unreachable.
- Legacy-only tests/assertions.
- `"legacy"` arm of `normalizeRendererVersion` (rebuild browser artefact).

### Shared helpers (keep)

- `buildUtilityStructuredHtml` for **slide_deck**.
- `runUtilityRendererByPlan` + registry slides mapping.
- Shared `utilityRenderMarkdown*` / escape helpers.
- All vNext export shell helpers.

### Tests

- Delete/rewrite INV-TE-01…07 Legacy cases.
- Retain/rename INV-TE-08-style pipeline tests.
- Leave Sprint-70 E4 drift for separate hygiene.

### Docs

- Update INV-DO-01…04, INV-DO-06 during T-045/T-050.
- Do not rewrite historical packs.

---

## 12. T-045 slice plan (reversible)

Do **not** combine into one mega-commit.

| Slice | Name | Files expected | Behaviour at risk | Focused verification | Production-browser checkpoint | Rollback boundary |
| ----- | ---- | -------------- | ----------------- | -------------------- | ----------------------------- | ----------------- |
| **S1** | Remove renderer choice UI + session state | `index.html`; `app.js` state/els/get/clear/generate version sync | Authoring layout; default still vNext | DOM absent; generate still works in Node/browser smoke | Authoring loads; Preview default vNext | Revert S1 commit |
| **S2** | Unconditional vNext page routing | `app.js` `runUtilityPageExportPipeline`, regenerate/refresh, artefact async opts | Page Preview/HTML | Pipeline always vNext; explicit error if global missing | Preview markers `data-renderer=vnext` | Revert S2 |
| **S3** | Remove obsolete page routing leftovers | Legacy branch dead code; `buildDefaultUtilityPageRenderPlan` if unused; registry page variant if unreachable | Non-page must stay | Grep no Legacy branch; slide_deck still resolves | Page export; optional slide spot-check | Revert S3 |
| **S4** | Reassign/remove obsolete page helpers inside structured HTML | Journey header apply; page-only sections if proven unused | slide_deck HTML | slide_deck fixture/render; pages unchanged | Preview/ZIP still OK | Revert S4 |
| **S5** | Globals / test hooks / `normalizeRendererVersion` | `app.js` prismTestApi; `lib/learner-renderer-vnext/*`; rebuild browser artefact | Freshness | `npm run check:learner-renderer-vnext-browser`; rebuild | Scripts still load | Revert S5 + artefact |
| **S6** | Tests/fixtures Legacy-only | INV-TE-* files; rename misleading helpers | CI noise | Focused suites green; **do not** “fix” Sprint-70 E4 | — | Revert S6 |
| **S7** | CSS/comments/docs/terminology | architecture docs, README, comments | Narrative only | Doc search residue checklist | Authoring UI copy clean | Revert S7 |
| **S8** | Repository-wide residue sweep | Whole repo search | Missed references | Checklist in §13; every hit classified | T-050 full §8 | Fix-forward or revert offending commit |

**Order rationale:** UI/state first (stops operators selecting Legacy) → routing (stops Legacy execution) → dead helpers → API/artefact → tests → docs → sweep.

---

## 13. Residue sweep checklist (T-045 / T-050)

After removal, search and classify **every** remaining match:

| Search target | Examples |
| ------------- | -------- |
| Obsolete symbols | `resolveLearnerRendererVersion`, `getUtilitiesRendererVersion`, Legacy journey apply helpers |
| Option values | `"legacy"` as renderer version; `value="legacy"` on learner renderer |
| State | `utilitiesRendererVersion` |
| DOM | `#utilitiesRendererVersion`, label “Learner renderer” choice |
| CSS | selectors tied to removed IDs |
| Globals / APIs | `*RendererVersionForTest`, `renderLegacyExport` |
| Script tags | unexpected second learner renderer |
| Fallback branches | `rendererVersion === "legacy"`, `if (version === "legacy")` |
| Tests / fixtures / snapshots | forced Legacy; golden Legacy HTML |
| Exported HTML/ZIP artefacts | treat as historical unless provenance current |
| Comments / docs | “Compatibility renderer”, “select Legacy” |
| Debug hooks / feature flags | dual-renderer flags |
| Adapters / imports / exports | `normalizeRendererVersion` legacy arm |

**Criterion:** Could a new maintainer or Cursor session still reasonably infer that another learner renderer exists or remains available? **Final answer must be no** (except clearly historical sprint archives).

Every remaining hit → **removed** · **reassigned to current owner** · **renamed** · or **explicitly deferred with reason**.

---

## 14. Risks and unresolved questions

| Risk / question | Severity | Mitigation |
| --------------- | -------- | ---------- |
| Deleting `buildUtilityStructuredHtml` wholesale breaks `slide_deck` | High | INV-IM-01 Retain; investigate page-only internals in S4 |
| Large `utilityRenderPageSections` surface hard to prove unused | Medium | Call-graph before delete; Investigate |
| `generic_document` / `generic_assessment` dead vs reserved | Low | Investigate in S3–S4 |
| Assemble-from-current-run not E2E in T-030 | Medium evidence gap | Not product failure; re-check in T-050 when runnable run exists |
| Sprint-70 E4 Node drift | Low (test debt) | Do not fix under removal slices |
| Cache-bust `?v=` not auto-bumped | Low | T-020 debt; operator refresh |

---

## 15. Decisions required

| Topic | Required? | Resolution |
| ----- | --------- | ---------- |
| Remove selector + unconditional vNext | No (already decided) | **S74A-D02** |
| Persist migrate Legacy preference | No | No durable preference found |
| Keep structured HTML for slides | No new decision | Evidence → **Retain** as current non-page owner |
| Rename `buildUtilityStructuredHtmlForTest` | Optional hygiene | Can defer to S6 without binding decision |
| Delete page-only internals of structured HTML | **Investigate in T-045 S4** — not a product decision | Evidence of callers |

**Pending decisions list:** none blocking T-045 start.

---

## 16. Acceptance-criteria contribution

| AC (charter) | Contribution |
| ------------ | ------------ |
| AC-06 | **Met** — complete responsibility/removal inventory with actions |
| AC-07…AC-10 | **Enabled** — exact map + slices for T-045 (not yet executed) |
| AC-01, AC-14, removal ACs | **Not** marked complete — require T-045/T-050 |

---

## 17. Hand-off to T-045

1. Execute slices **S1→S8** in order; preserve **T-030 §8**.  
2. Do not begin T-050 until residue sweep criterion is met.  
3. Do not open 74B/74C.  
4. Do not fix Sprint-70 E4 drift as part of renderer removal.  
5. Rebuild + freshness-check after any `lib/learner-renderer-vnext` change.

**Runtime changes in T-040:** **None**.

---

## 18. Inventory totals (by category)

| Category | Count (inventory IDs) | Dominant actions |
| -------- | --------------------- | ---------------- |
| UI | 3 | Remove 1; Retain 2 |
| State | 7 | Remove / migrate no-op |
| Routing | 8 | Remove Legacy; Retain vNext + non-page |
| Implementation | 9 | Retain shared; Remove Legacy-page; Investigate internals |
| Bootstrap | 3 | Retain vNext |
| Packaging | 3 | Retain current; historical stay historical |
| Test / API | 13 | Remove Legacy cases; Retain/rename shared |
| CSS / presentation | 2 | Minimal |
| Tooling | 3 | Retain gates |
| Docs / naming | 7 | Update active; retain historical |

**Proposed removals (high confidence):** INV-UI-01, INV-ST-01…05, INV-RT-01/02/06/08, INV-IM-03/08 (legacy arm), INV-TE-01…07, INV-API-01/02/04, INV-DO active Compatibility wording.

**Retained shared with owners:** INV-IM-01/05, INV-RT-03/04, INV-BB-01, INV-PK-01, INV-TL-01/02, non-page packaging.

**Ambiguous / Investigate:** INV-IM-02/04/07/09, INV-RT-07, INV-API-03 rename timing, INV-TE-08 naming.

---

## 19. Files changed under T-040

Documentation / sprint records only (this report + Sprint 74A tracking / CONTEXT engineering disciplines). **No** `app.js`, `index.html` runtime edits, tests, fixtures, or generated artefacts modified for removal.

---

## 20. Follow-up — S74A-T-042 (2026-08-06)

Do **not** rewrite the inventory findings above. T-042 investigated whether the activity-beat/task interleaving regression involved obsolete page logic inside retained shared structured HTML.

**Result:** The regression lived entirely on the **definitive vNext** path (`parse-learner-task` + `compose-generic-moments`). Export used `runLearnerRendererVNextExport` only — **no** call into `runUtilityRendererByPlan` / `buildUtilityStructuredHtml` for the defective page render.

**Refined T-045 guidance:**

| Inventory item | Refinement |
| -------------- | ---------- |
| INV-IM-01 `buildUtilityStructuredHtml` | Still **retain** for `slide_deck`. Confirmed it must **not** be treated as owner of learner-page beat/task interleaving. Page-only internals remain removable without moving interleaving responsibility into this module. |
| INV-IM-02 / page-only structured HTML | Still **investigate** for T-045 page-branch removal; not the interleaving fix site. |
| INV-RT-03 / vNext export | Remains definitive page owner; T-042 strengthened compose/parse under that owner. |
| T-045 behavioural gate | Preserve **corrected** interleaving (T-042 + T-030 §8a), not the accidental aggregate Your task observation. |

Evidence: [S74A-T-042-activity-task-interleaving-definitive-path-repair.md](S74A-T-042-activity-task-interleaving-definitive-path-repair.md).
