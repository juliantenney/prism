# GPT bootstrap — Sprint 11 (Workflow generation fixture & regression foundations)

**Use this prompt to start a fresh chat** when beginning **Sprint 11 implementation** (fixtures, regression harness, documentation-backed checks). **This folder** is the portable pack for **`2026-05-13-sprint-11-workflow-generation-fixture-regression-foundations`**.

**Pack path:** `docs/development/sprints/2026-05-13-sprint-11-workflow-generation-fixture-regression-foundations/`

**Portable pack layout (Sprint 09 / 10 pattern):** `HANDOVER.md`, `SPRINT-CONTEXT.md`, `CURRENT-STATE.md` (continuity snapshots); `context-files/` (lightweight mirrors — `current-state.md`, session handover pointer, `GPT-BOOTSTRAP-PROMPT.md` pointer to this file).

---

## 1. PRISM context

PRISM is a **browser-based** authoring product: **Prompt Studio**, **Prompt Library**, **manual Workflow Builder**, **Utilities** rendering, and **domain-pack–constrained** workflow generation (`workflowGenerationContext.js` + `domains/`).

Core workflow-generation code lives mainly in **`app.js`** (large), with **`workflowGenerationContext.js`** as the manifest/file loader and prompt-context builder. **Persistence** uses `localStorage` (workflows, Factory domain selection) and **IndexedDB** / `localStorage` fallback for the Prompt Library (`library.js`).

You are helping with **Sprint 11 only**: **behaviour-preserving** fixture and regression **foundations** — **not** open-ended refactors.

---

## 2. Sprint 09 closure context

Sprint 09 (**closed**, 2026-05-12) shipped **bounded UI copy** only (`index.html`, display-oriented `app.js` strings) and **froze** the **workflow-generation contract surface**:

- `briefLines` assembly and prefixes  
- `extractWorkflowBriefExplicitFactors`  
- Step-context / prompt assembly that echoes brief semantics  
- `workflowGenerationContext.js` contract paths  
- Domain-pack **ids**, **labels**, **choice values**, and prompt-coupled **`uiHints` / `helpText`** where they affect generation or persisted brief meaning  

**Formal closure:** `docs/consolidation/sprint-09-pass-1-closure.md`  
**Canonical charter + verification:** `docs/consolidation/sprint-09-workflow-brief-semantics-alignment-pass-1.md`

**Implication for you:** treat anything in that frozen list as **high governance** — Sprint 11 work **observes** it via tests/fixtures; it does **not** silently “improve” copy that is actually **contract**.

---

## 3. Sprint 10 audit completion context

Sprint 10 **bootstrap contract audit** is **complete** and **committed** (**`3bd6d10`**).

**Canonical audit artefact:** `docs/consolidation/sprint-10-contract-audit.md`  
- **§§3–8:** evidence inventories (`briefLines`, extraction, prompt assembly, WGC, domain packs, persistence / import / export).  
- **§§9–12:** synthesis (compatibility matrix, governance checks, migration **option families** — **not** selected plans).

**Bootstrap framing (not a charter):** `docs/consolidation/sprint-10-workflow-brief-contract-rationalisation-bootstrap.md`

**Implication for you:** use the audit as a **map of channels and blast radius** when choosing what to pin first (e.g. multi-channel brief text, save-path duality, `normalizeWorkflowForV1`, WGC ordering). Do **not** treat §§9–12 tables as new product requirements.

---

## 4. Sprint 11 charter status

**Charter:** `docs/consolidation/sprint-11-workflow-generation-fixture-regression-foundations.md`  
**Status:** Sprint 11 is **chartered for fixture/regression foundations** — **implementation has not started** and **must not** until **written pass scope** is agreed (charter §§11–12). When a pass opens, **implementation is allowed only** inside that scope (tests, shims, docs artefacts, **frozen** golden inputs/outputs). Anything **outside** the charter (semantic renames, factor ids, prompt/pack contract edits, migrations) needs a **different** explicit charter.

**Supporting docs (preparation):**

- `docs/consolidation/sprint-11-working-checklist.md` — pass prep checklists  
- `docs/consolidation/sprint-11-fixture-candidate-inventory.md` — candidate categories, cost, sensitivity tags  

**Continuity:** `docs/development/current-state.md` — **Next Active Focus** describes Sprint 10 complete + Sprint 11 **not started** until pass scope is confirmed; align with that before large PRs.

---

## 5. Read-first files (in order)

1. `docs/consolidation/sprint-11-workflow-generation-fixture-regression-foundations.md` — scope, non-goals, entry/exit  
2. `docs/consolidation/sprint-11-working-checklist.md` — operational prep  
3. `docs/consolidation/sprint-11-fixture-candidate-inventory.md` — what to build first  
4. `docs/consolidation/sprint-09-pass-1-closure.md` — frozen surface  
5. `docs/consolidation/sprint-10-contract-audit.md` — at least §§3.1, 4.1–4.3, 5.1, 5.6, 6.1–6.7, 6.17, 7.8, 8.1–8.4, 8.9, 9.2  
6. `app.js` — search for: `extractWorkflowBriefExplicitFactors`, `continueWorkflowDesignGeneration`, `normalizeWorkflowForV1`, `importWorkflowsAndPrompts`, `exportAllData`, `buildWorkflowBundle`, `handleSaveDesignedWorkflow`, `handleSaveWorkflow`, `gatherWorkflowDetailFormData`, `canonicalizeWorkflowStepPromptAttachment`, `resolveUtilityRenderPlan`  
7. `workflowGenerationContext.js` — `loadManifest`, `buildWorkflowGenerationContext`, `getWorkflowBriefConfig`, `getArtefactRenderCatalog`  
8. `library.js` — import/export of prompts when bundles are mixed  
9. `domains/domain-manifest.json` + manifest-listed files under `domains/general/`, `domains/learning-design/`, `domains/research/`  
10. `docs/development/shared-vocabulary.md` — if documenting manual matrices in `docs/`

---

## 6. Governance posture

- **Audit-before-diff** (carry forward): no **contract semantic** change without a compatibility row (factor/field, old/new meaning, blast radius, rollback) **unless** a separate charter explicitly waives it for a pilot.  
- **Sprint 11 scope = observability first:** fixtures encode **today’s** behaviour; they do **not** define a new normative spec.  
- **Sprint 09 boundary remains:** UI-only copy tweaks **do not** replace contract work; contract work stays explicit.  
- **Baseline discipline:** record commit hash (or tag) fixtures target; bump baselines deliberately with log notes.

---

## 7. Explicit non-goals (do not do in Sprint 11)

Unless a **separate** charter says otherwise:

- Semantic **renaming** of **contract-coupled** strings  
- **Factor id** changes, mapping rule changes, or **`workflowBriefConfig`** structural edits in **domain-pack source** files  
- **`briefLines` prefix** edits, **F-INT** synthetic line rewrites, **generator** / step-context **prompt contract** changes  
- **Domain-pack rewrite**, **renderer** redesign, **sequencing engine** redesign, **broad workflow-engine** rewrite  
- **Persistence schema migration** (new storage version, mandatory new fields) without its own charter  

Sprint 11 **may** add **test-only** shims — **not** production behaviour changes smuggled in as “fixture fixes”.

---

## 8. First recommended implementation tasks

Pick a **narrow pass**; typical **first** slices (see inventory + charter §5 table):

1. **Confirm pass scope in writing** — automation vs manual-first; which **two+ audit channels** (e.g. extraction JSON **and** import round-trip, **not** step titles alone).  
2. **`briefLines` / `base` golden** — minimal + one maximal row set; assert joined string or stable hash (strip volatile fields).  
3. **`extractWorkflowBriefExplicitFactors` snapshot** — fixed `base` → JSON subset for stable factor keys.  
4. **`normalizeWorkflowForV1` round-trip** — small workflow object in → normalised object out (no new migration rules).  
5. **Import bundle minimal** — `buildWorkflowBundle` / `exportAllData` shape → `importWorkflowsAndPrompts` with **`newerWins`** behaviour as documented in audit §8.  
6. **WGC excerpt** — stub `fetch`, fixed manifest + file text → assert section headers and **platform → domain → brief** order (redact long bodies).  
7. **Implementation log entry** — list channels pinned and baseline commit.

Defer **mixed Library + workflow** bundles and full prompt dumps until the above are stable (higher cost).

---

## 9. Verification expectations

- **CI:** project’s existing test command passes; new tests **additive** where possible.  
- **Pre-merge review:** PR diffs exclude §7 non-goals (no pack prefix/ids, no contract string edits “for clarity”).  
- **Post-merge:** Sprint 09–class smoke still passes; extend with **design-from-brief** / **run-mode** when touching generation surfaces (charter / audit guidance).  
- **Exit (charter §12):** ≥ **two** audit channels covered; cross-domain case **documented** and **one** row executed; log confirms §7 not violated.

---

## 10. Fixture / regression–first philosophy

- **Pin behaviour before rationalising it** — golden inputs/outputs and import/export shapes give a **detectable** baseline for **future** contract sprints.  
- **Prefer structure over volume** — short prompt **excerpts** (headers, file path lines, counts) over megabyte WGC dumps.  
- **Channel-tag everything** — BL vs F-INT vs PA-WGC vs PE-import, per audit §5–§6, so tests do not create **false confidence** from a single surface.  
- **Failures flag drift** — triage: bug vs intentional follow-on charter; Sprint 11 does **not** mandate immediate product fixes for every red test.

---

## 11. Warnings — hidden coupling from Sprint 10 (do not ignore)

When implementing, watch for:

- **Multi-channel brief vocabulary** — same semantics, **different** prefixes/lines (**BL-***, **F-INT**, **RC-***, **PF-***, etc., audit §3.3, §5.6). Assertions on **one** channel miss others.  
- **Split authority** — `briefLines` / `base`, extraction, WGC file text, heuristics (`applyWorkflowDesignHeuristics`), persistence **gather vs design save** (audit §8.9: **`workflowBriefResolution`** and related fields can **differ** by save path).  
- **`selectedDomains` normaliser collapse** — at most one non-`general` domain in stored workflow vs multi-domain at design time (§8.4).  
- **First-structured-domain** `workflowBriefConfig` — LD vs research ordering matters (§6.6, §7.8).  
- **`normalizeWorkflowForV1` as soft migrator** — implicit reader behaviour; tests should pin **inputs and outputs**, not assume “pretty JSON” stability of every field.  
- **WGC `textCache` / manifest fetch** — determinism needs **stubbed network** or frozen file text.  
- **Render / utilities** — `getArtefactRenderCatalog` / `resolveUtilityRenderPlan` are **runtime** and **pack-sensitive**; not the same as saved workflow JSON (audit §8.7).  
- **Import heuristics** — object vs array top-level shapes (`handleImportChange`); **`newerWins`** depends on **`updatedAt`** (§8.2).

---

## Copy-paste block for the assistant

You are joining **PRISM** for **Sprint 11 — Workflow generation fixture & regression foundations**. Sprint 09 **contract-boundary governance** and Sprint 10 **canonical audit** (`docs/consolidation/sprint-10-contract-audit.md`, `3bd6d10`) are complete. **Pass scope must be agreed first** (charter §§11–12); until then **no** application code or fixture files. **When the pass opens, implementation is permitted only** within `docs/consolidation/sprint-11-workflow-generation-fixture-regression-foundations.md`: build **fixtures, tests, or documentation-backed regression** that **preserve** current workflow-generation **semantics**, **import/export**, **saved workflow** behaviour, and **domain-pack ids/labels/values** — **no** semantic rationalisation, **no** renderer/sequencing/engine redesign, **no** persistence migration unless separately chartered. **Fixture/regression first.** Read the charter, working checklist, fixture inventory, Sprint 09 closure, and Sprint 10 audit §§3–8 for the relevant slice before proposing code. Prefer **deterministic**, **channel-tagged** baselines; stub **`fetch`** for WGC when needed.

---

## Review log

- **2026-05-13** — **Portable continuity pack aligned** (`HANDOVER.md`, `SPRINT-CONTEXT.md`, `CURRENT-STATE.md`, `context-files/`); implementation **not started**.
- **2026-05-13** — **Readiness review (documentation):** §4 + copy-paste block clarify **implementation has not started** until pass scope agreed (charter §§11–12); when open, work stays inside charter scope.
- **2026-05-13** — **Created** `GPT-BOOTSTRAP-PROMPT.md` (documentation only) for Sprint 11 portable pack.
