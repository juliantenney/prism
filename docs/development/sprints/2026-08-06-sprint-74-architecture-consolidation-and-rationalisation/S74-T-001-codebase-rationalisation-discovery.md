# S74-T-001 — Codebase Rationalisation Discovery

**Sprint:** 74 — Architecture Consolidation and Rationalisation  
**Task:** S74-T-001  
**Status:** **Done** (2026-08-06)  
**Mode:** Discovery only — **no runtime code changes**  
**Classification key:** Supported · Compatibility · Duplicate · Experimental · Candidate for consolidation · Candidate for removal · Needs further discovery

---

## Executive summary

Prism’s **supported product path** is clear:

> **Create Workflow → My Workflows → Authoring → assemble page → Preview (vNext) → HTML / learner ZIP**

with Prompt Studio / Prompt Library as parallel prompt surfaces, and Sprint 73 Workflow Resources as the durable owner for generated images, downloadable resources, and embedded video payloads.

The repository also retains **compatibility** paths (legacy learner renderer still selectable), **documentation drift** (export architecture doc still describes legacy-only path; root README tab labels stale), a large **`app.js` monolith**, dual **Node module / browser-bundle** surfaces (Sprint 72 parity lesson), and accumulation of **archive / scratch / experiment** artefacts.

Sprint 74 should **not** delete or consolidate yet. Recommended follow-on domains (high-level only):

| Domain | Theme |
| ------ | ----- |
| **74A** | Renderer & export path integrity (vNext vs legacy; docs; bundle parity) |
| **74B** | Prompt / contract / `app.js` surface hygiene |
| **74C** | Workflow Resources residuals, fixtures, and repo hygiene |

**Sprint 74A / 74B / 74C are not opened by this report.**

---

## Repository map

| Path | Role | Classification |
| ---- | ---- | -------------- |
| `index.html` | Product shell; main tabs; script bootstrap (~70 tags) | **Supported** |
| `app.js` | Monolith orchestration (~50k lines): workflows, Authoring export, runstate, visual jobs UX | **Supported** · **Candidate for consolidation** (surface size) |
| `library.js` | Prompt Library persistence (IndexedDB + LS fallback) | **Supported** |
| `utils.js` | Shared helpers | **Supported** |
| `workflowGenerationContext.js` | Domain manifest / artefact render catalog | **Supported** |
| `style.css`, `icon.png` | Presentation | **Supported** |
| `lib/` (~71 JS + `learner-renderer-vnext/` modules) | Contracts, page pipeline, vNext renderer, visual jobs, Workflow Resources, packages | **Supported** |
| `domains/` | Domain packs (`general`, `learning-design`, `research`) + `domain-manifest.json` | **Supported** |
| `tests/` (~287 `*.test.js` + fixtures) | Node `--test` corpus | **Supported** |
| `scripts/` | Dev server; vNext browser bundle build; inventories | **Supported** (+ probe/ops scripts may be **Experimental**) |
| `docs/` | Architecture, backlog, sprint packs, consolidation | **Supported** |
| `utilities/visual-enhancement-utility/` | External VEU packs — adjacent tool, not Authoring tab | **Compatibility** |
| `archive/`, `_archive/` | Archived docs / failed investigation | **Candidate for removal** (already archived; confirm unused) |
| `artifacts/` | Certification artefacts | **Supported** (evidence) |
| `tools/`, `captures/`, `tmp-*`, root scratch HTML/txt | Ops / scratch | **Experimental** · **Candidate for removal** |
| `dist/`, `public/` | **Absent** — browser serves repo root | N/A |

---

## Supported runtime path

### Product surface (`index.html` tabs)

1. **Create Workflow** → `#workflowFactoryPanel`  
2. **My Workflows** → `#workflowsPanel`  
3. **Authoring** (`#tabUtilities` / `#utilitiesPanel` — internal ids retained)  
4. **Prompt Studio**  
5. **Prompt Library**

Default Authoring renderer control: **vNext** (`utilitiesRendererVersion`).

### Happy path (Learning Design page)

```text
Create Workflow (factory + domain packs)
  → persist workflow (localStorage promptr.workflows.v1)
My Workflows → Edit / Run (runstate promptr.workflows.runstate.v1)
  → progressive stages (EP → DLA → GAM → LS → assessment → Design Page)
Authoring
  → Assemble From Current Workflow Run
       → page assembly / PRISM_PAGE_VNEXT_ASSEMBLE
  → Preview HTML
       → rehydrate Workflow Resources (Sprint 73)
       → runUtilityPageExportPipeline
            → rendererVersion === "vnext"
                 → PRISM_LEARNER_RENDERER_VNEXT / browser bundle
            → else legacy buildUtilityStructuredHtml path
  → Graphics / Video / Resources authoring tabs (Sprint 70/73)
  → Download HTML | Learner package ZIP | Open in New Tab
```

| Concern | Evidence anchor | Classification |
| ------- | --------------- | -------------- |
| Tab wiring | `app.js` `switchTab`; `tabUtilities` id | **Supported** |
| Assemble / preview / download | `handleUtilitiesAssembleFromCurrentWorkflowRun`, `handleUtilitiesGenerate`, download handlers in `app.js` | **Supported** |
| vNext export | `runLearnerRendererVNextExport` / `lib/learner-renderer-vnext-browser.js` | **Supported** |
| Legacy export option | UI select + `buildUtilityStructuredHtml` branch | **Compatibility** |

---

## Ownership map

| Concern | Current owner | Key paths | Classification |
| ------- | ------------- | --------- | -------------- |
| Workflows / runstate | `app.js` + localStorage | `promptr.workflows.v1`, `promptr.workflows.runstate.v1` | **Supported** |
| Prompts / library | `library.js` + Prompt Studio UI | `promptRefinerDB` / `promptRefiner.prompts` | **Supported** |
| Page artefacts (schema 2.0.0 direction) | Stage contracts + assembly | `lib/page-shell-create.js`, `page-*-enrich.js`, `page-vnext-assemble.js`, LD `*-contract.js` | **Supported** |
| Visual jobs / session assets | Planning + Authoring workspace (transient bytes) | `lib/visual-planning-contract.js`, planner/compiler, `utilities-visual-jobs-workspace.js` | **Supported** (derived) |
| Workflow Resources | `PRISM_WORKFLOW_RESOURCES` (workflow-scoped IDB) | `lib/prism-workflow-resources.js`; Sprint 73 T-002 | **Supported** |
| Learner renderer | `lib/learner-renderer-vnext/*` → browser bundle | Sprint 67; `docs/architecture/learner-renderer-vnext.md` | **Supported** |
| Domain packs | Manifest-driven markdown | `domains/`, `workflowGenerationContext.js` | **Supported** |
| Learner package / ZIP | Package + fflate | `lib/learner-package.js`, `learner-package-zip.js` | **Supported** |
| External VEU | Separate utility | `utilities/visual-enhancement-utility/` | **Compatibility** |

Sprint 73 binding: Workflow Resources owns durable media payloads; page owns lightweight presentation refs; preview/HTML/ZIP are **regenerated**, not persisted as canonical state.

---

## Schema inventory

| Contract | Authoritative location | Notes | Classification |
| -------- | ---------------------- | ----- | -------------- |
| Page schema vNext 2.0.0 | Sprint 56F `design-page.schema.vNext.json` (frozen) | Runtime mirrored in `lib/page-shell-create.js`; `lib/schemas/` planned historically but absent | **Supported** · **Needs further discovery** (drift risk) |
| Episode Plan v1 | `lib/episode-plan-v1-*.js` | Production pipeline | **Supported** |
| Stage enrich / compose contracts | `lib/ld-*-contract.js`, guided-review, figure-description, visual-planning, etc. | Prompt + validation | **Supported** |
| Assembly | `lib/page-vnext-assemble.js` | Authoring assemble/render | **Supported** |
| Design Page compose vs partial | Dual contract modules with legacy/rollback notes | Duality | **Compatibility** · **Candidate for consolidation** |
| Domain pack contract | `domains/domain-manifest.json` + pack markdown | Factory / generation | **Supported** |
| Architecture ADRs | `docs/architecture/adr/`, `decisions.md`, episode ownership | Governance | **Supported** |
| Workflow persistence shape | Implicit via normalisers; early audits in `docs/consolidation/` | Implicit SSOT | **Needs further discovery** |

---

## Bundle inventory

| Item | Evidence | Classification |
| ---- | -------- | -------------- |
| npm scripts | `dev`, `build:learner-renderer-vnext-browser`, `pretest:learner-renderer-vnext`, kitchen-sink / GAM inventory | **Supported** |
| Dev server | `scripts/dev-server.js` | **Supported** |
| vNext browser artefacts | `lib/learner-renderer-vnext-browser.js` (generated), export runtime companions | **Supported** |
| Dual surface pattern | `module.exports` + `window.PRISM_*` across many `lib/*` | **Supported** pattern; parity risk |
| Public path | Repo root `index.html` (no `dist/` / `public/`) | **Supported** |
| Sprint 72 lesson | Node tests ≠ browser public path; stale bundle risk | Operational constraint → aligns with **PB-FA-003** |

---

## Browser / runtime entry points

1. Load `index.html` (static).  
2. Scripts: contracts → visual / Workflow Resources → package → LD / page pipeline → **learner-renderer-vnext-browser.js** → export runtime → `app.js`.  
3. User selects Authoring (`tabUtilities`) → assemble / generate / download.  
4. Globals of note: `PRISM_LEARNER_RENDERER_VNEXT`, `PRISM_WORKFLOW_RESOURCES`, `PRISM_PAGE_VNEXT_ASSEMBLE`, and other `PRISM_*` surfaces.

Deep links / internal ids (`utilitiesPanel`, `switchTab("utilities")`) remain stable after the user-facing **Authoring** label change.

---

## Test inventory

| Aspect | Evidence | Classification |
| ------ | -------- | -------------- |
| Corpus | ~287 `tests/*.test.js` + `tests/fixtures/` | **Supported** |
| Focused guardians | `learner-renderer-vnext-*`, `sprint-70-slice-*`, `s73-t-*`, stage/contract tests | **Supported** |
| Bootstrap | `tests/prism-vm-lib-bootstrap.js` | **Supported** |
| Documented health | Sprint 73 focused runs green (41 / 25 / 47 — separate); Sprint 72 broader evidence suite **28 known failures** → **PB-S-001** | Focused = authority until PB-S-001 resolved |
| Full-suite CI claim | Not asserted as all-green | **Needs further discovery** |

---

## Documentation inventory

| Area | Path | Classification |
| ---- | ---- | -------------- |
| Live architecture | `docs/architecture/` (vNext, ADR-012, episode ownership, export behavior, …) | **Supported** (export-behavior doc may be **stale** — see findings) |
| Programme sprints | `docs/sprints/` | **Supported** |
| Development packs | `docs/development/sprints/` | **Supported** (historical evidence) |
| Backlog | `docs/backlog/PRODUCT-BACKLOG.md` | **Supported** |
| Rolling current state | `docs/development/current-state.md` | **Supported** (may lag UI labels) |
| Consolidation audits | `docs/consolidation/` | Historical / still useful |
| Root `README.md` | Product/dev onboarding | **Compatibility** (tab labels drift) |

---

## Findings classification

### Supported (do not break)

- Create → Run → Authoring → vNext preview/HTML/ZIP happy path  
- Domain packs + progressive page enrichment pipeline  
- Learner-renderer-vNext production path  
- Workflow Resources owner and Sprint 73 resource/video behaviours  
- Focused regression suites tied to those paths  

### Compatibility (retain until evidence allows change)

- Legacy learner renderer selectable in Authoring UI  
- Legacy structured HTML builders still present for Legacy / non-page cases  
- Legacy capture validators / `@deprecated` prompt wrappers in `app.js`  
- External `utilities/visual-enhancement-utility/`  
- Internal `utilities*` ids vs user-facing **Authoring** label  

### Duplicate / drift

- `docs/architecture/renderer-export-behavior.md` documents legacy-only active path while default UI is vNext  
- Root README navigation vocabulary lags current tabs  
- Dual compose/partial Design Page contract surfaces  

### Experimental / scratch

- Sprint pack `experiments/` folders  
- Root `tmp-*`, captured `page - *.html`, assorted tools scratch  

### Candidate for consolidation (needs plan + AC — not approved)

- Legacy vs vNext Authoring export path (after coverage proof)  
- Browser-bundle rebuild discipline + public-path tests (PB-FA-003)  
- Deprecated prompt helpers / legacy validators (after call-site audit)  
- `app.js` surface modularisation (high risk — defer until domains clear)  

### Candidate for removal (evidence incomplete — do not delete yet)

- Confirmed-unused scratch / `_archive` contents after reference audit  
- Legacy renderer UI **only after** vNext-only sufficiency is proven  

### Needs further discovery

- Schema JSON placement vs runtime validator drift  
- Full-suite failure taxonomy beyond PB-S-001 note  
- Workflow Resource orphan cleanup semantics (PB-R-008)  
- Which recommended domain should become first planning-ready 74A  

---

## Architectural reference points used

| Reference | Path | Use in this discovery |
| --------- | ---- | --------------------- |
| Sprint 38 programme | `docs/development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/` (+ 38b–38s) | Why LD visual/pedagogical architecture exists |
| vNext Prompt / page | `…/2026-07-01-sprint-56-…`, `…/2026-07-07-sprint-56f-…` | Progressive page enrichment / schema direction |
| Learner Renderer vNext | `…/2026-07-17-sprint-67-learner-renderer-vnext/` · `docs/architecture/learner-renderer-vnext.md` | Supported render path |
| Sprint 73 Workflow Resources | `…/2026-08-06-sprint-73-workflow-resources/` | Resource ownership, Authoring integration, known limitations |

Do **not** reconstruct their implementation histories here.

---

## Proposed Sprint 74A / 74B / 74C domains

> High-level recommendations only. **Not opened. Not scheduled as implementation.**

### Sprint 74A — Renderer & export path integrity

**Intent:** Clarify and harden the supported Authoring → learner HTML path.

Candidate themes:

- Document and test **vNext as supported**; quarantine or plan Legacy retirement only with evidence  
- Refresh stale export docs / onboarding labels  
- Enforce browser-bundle rebuild + public-path regression (Sprint 72 / PB-FA-003 alignment)  

**Related backlog:** PB-FA-003  

### Sprint 74B — Prompt / contract / app.js surface hygiene

**Intent:** Reduce dual paths and deprecated surfaces without changing pedagogy.

Candidate themes:

- Inventory `@deprecated` prompt builders and legacy `{ legacy: true }` validators  
- Clarify compose vs partial Design Page contracts  
- Incremental PB-S-004 duplicate UI–state pathway work with fixtures  

**Related backlog:** PB-S-004 (partial)  

### Sprint 74C — Workflow Resources residuals, fixtures, repo hygiene

**Intent:** Address retained Sprint 73 limitations and repository noise without inventing new persistence systems.

Candidate themes:

- Orphan / mixed-data cleanup research → PB-R-008  
- Fixture enrichment for PB-S-001  
- Archive/scratch reference audit (removal only after proof)  
- Product follow-ons (PB-FA-004 manually uploaded graphics) remain **backlog** unless separately planned  

**Related backlog:** PB-R-008, PB-S-001, PB-FA-004 (adjacent product, not auto-included)

---

## Risks

| Risk | Why it matters |
| ---- | -------------- |
| Premature deletion | Compatibility paths may still be required for non-page artefacts or recovery |
| Bundle staleness | Node tests green while browser path drifts |
| `app.js` coupling | Broad refactors can break unrelated surfaces |
| False confidence from broad suite | PB-S-001 — 28 known failures |
| Doc drift | Operators follow legacy export docs while UI defaults to vNext |
| Opening 74A too early | Domains need approach, ownership, acceptance criteria |

---

## Open questions

1. Is Legacy renderer still required for any supported non-page artefact types, or only for historical comparison?  
2. Should `lib/schemas/` be established as the schema SSOT, or keep frozen sprint-pack schemas + runtime mirrors?  
3. What is the first planning-ready domain (74A vs another) after operator review?  
4. How should Authoring/`utilities*` naming drift be handled long-term (UI-only vs gradual id migration)?  
5. What orphan-cleanup policy is safe given Sprint 73 mixed-data limitation?

---

## Recommended next task

**S74-T-010 — Prioritise and refine recommended domains into planning-ready candidates**

- Operator reviews this report  
- Rank 74A / 74B / 74C for readiness  
- Draft approach / ownership / acceptance-criteria sketches for the first domain  
- Still **no runtime changes**  
- Still **do not open** Sprint 74A / 74B / 74C packs until readiness bar is met  

---

## Explicit non-actions taken

- No code deleted, consolidated, renamed, or refactored  
- No schema updates  
- No Sprint 73 reopen  
- No Sprint 74A / 74B / 74C pack created  
