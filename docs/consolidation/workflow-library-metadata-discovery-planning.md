# Workflow Library — metadata and discovery (feature planning)

**Date:** 2026-05-13  
**Path:** `docs/consolidation/workflow-library-metadata-discovery-planning.md`

**Role:** Plan **Prompt Library–style** metadata and discovery for **My Workflows**, adapted to **workflow definition semantics**, without implementation yet.

**Constraints (this document):** **No** implementation, **no** workflow generation changes, **no** prompt/model changes, **no** domain-pack changes, **no** persistence/import/export **code** edits yet, **no** orchestration changes, **no** Sprint 12 / Sprint 13 reopening or charter drift.

**Non-goals for the feature (per product direction):** Do **not** add a **“Workflow” filter inside My Workflows** (Prompt Library’s `libraryWorkflowFilter` pattern is **not** copied here — that concept is deferred / not relevant yet).

---

## 1. Current Prompt Library implementation references to reuse

| Concern | Location | Reuse pattern |
|---------|----------|---------------|
| **Durable schema (tags, timestamps, usage)** | `library.js` (comment block ~L8–22: `tags`, `createdAt`, `updatedAt`, `usageCount`, …) | Treat workflow objects in `state.workflows` as the same **class** of “local durable JSON” with explicit optional fields; workflows stay in **`localStorage`** (`WORKFLOW_STORAGE_KEY`), not IndexedDB, unless a later charter moves them. |
| **Filter state (derived, not canonical)** | `app.js` **`getActiveFilters`** ~9910–9923 | Returns `{ query, tag, workflowId, sort }` from DOM; **workflow panel** should use a **parallel** helper (e.g. `getWorkflowListFilters`) — **omit** `workflowId`. |
| **Tag filter semantics** | `app.js` **`applyLibraryFilters`** ~9989–9998 | Comma-separated filter tokens → **lowercase** list; **every** filter tag must match **some** workflow tag via **substring** on prompt tag (`pt.indexOf(ft)`). **Match for workflows:** same “all must match” rule unless product prefers **exact** match (call out as decision). |
| **Search haystack** | `app.js` **`applyLibraryFilters`** ~9977–9985 | Single concatenated string + `indexOf` on **lowercased** query. Workflows need a **richer** `buildWorkflowSearchHaystack(wf)` (see §6). |
| **Sort branches** | `app.js` **`applyLibraryFilters`** ~10002–10018 | `createdDesc`, `title`, `usage`, default `updatedDesc`. Extend with **oldest** variants and **step count** (new comparator). |
| **List item layout** | `app.js` **`renderLibraryList`** ~10037–10084 | Title + meta line + optional tag pills + “In workflow” pill. **`renderWorkflowList`** ~10524–10555 today: title + step count only — extend meta/tags similarly. |
| **Detail form: tags / notes / meta** | `index.html` `#detailTags`, `#detailNotes`, `#detailMetaCreated`, `#detailMetaUpdated` ~393–408 | Mirror with **`#workflowLibraryTags`**, **`#workflowLibraryNotes`**, read-only **`#workflowMetaCreated`**, **`#workflowMetaUpdated`** (names TBD) in `workflowsPanel`. |
| **Gather + merge metadata on save** | `app.js` **`buildPromptAssetFromDetailForm`** ~10111–10128; **`updatePromptAssetMetadata`** ~10145–10157 | Workflows: extend **`gatherWorkflowDetailFormData`** ~11828–11940 to include **library** tags + notes; **`handleSaveWorkflow`** ~11973+ already sets **`createdAt`/`updatedAt`** ~12034–12045 — preserve and merge like existing branch. |
| **Library ↔ list refresh** | `loadLibrary` → `renderLibraryList`; save handlers call **`renderLibraryList`** | After workflow save, keep calling **`renderWorkflowList`** and any new **`applyWorkflowListFilters`**; **`renderLibraryWorkflowFilterOptions`** ~9926–9949 repopulates Prompt Library’s workflow filter — **unchanged** (still valid). |
| **Styling** | `style.css` `.library-filters`, `.library-item`, `.library-item-meta`, `.library-item-tags`, `.workflow-item` ~742–780, ~1065+ | Reuse **shared** list/filter patterns; optionally add **`workflow-filters`** class alias to `.library-filters` for consistency without duplicating rules. |

---

## 2. Current My Workflows data shape and render/save/import/export references

| Concern | Location | Notes |
|---------|----------|--------|
| **Persistence** | `app.js` **`WORKFLOW_STORAGE_KEY`** ~`"promptr.workflows.v1"` ~L198; **`loadWorkflows`** ~10476–10512; **`saveWorkflows`** ~10515–10521 | Array of workflow objects **JSON** in `localStorage`. |
| **Load normalisation** | **`loadWorkflows`** maps each entry through **`normalizeWorkflowForV1`** ~12636–12763 | Extend normaliser for **tags / notes / timestamps** defaults (§4). |
| **Canonical gather (definition)** | **`gatherWorkflowDetailFormData`** ~11828–11940 | Returns `id`, `name`, `selectedDomains`, `artefacts`, `workflowInputs`, `workflowOutputs`, `workflowOutputSpec`, `steps` (step-level **`notes`** already exist per step — **different** field from planned **workflow-level** `notes`). |
| **Save path** | **`handleSaveWorkflow`** ~11973+ | Merges **`createdAt`** / **`updatedAt`** on update vs new ~12034–12046; pushes to `state.workflows`, **`saveWorkflows`**, **`renderWorkflowList`**, **`selectWorkflow`**, **`renderLibraryList`**. |
| **List UI** | **`renderWorkflowList`** ~10524–10555 | Title + step count meta; calls **`renderLibraryWorkflowFilterOptions`** (Prompt Library only). |
| **Detail UI** | **`populateWorkflowDetail`** ~10597+; `index.html` `#workflowName`, `#workflowGoal`, … `#workflowStartingArtefact` ~714+ | No workflow-level tags/notes yet. |
| **Factory → Workflows scaffold** | **`handleSaveDesignedWorkflow`** (scaffold `wf` ~13379–13393) | Already sets **`createdAt`/`updatedAt`**; passes through **`normalizeWorkflowForV1`**. New fields should be **`[]` / `""`** here unless Factory later collects them. |
| **Import / merge** | **`importWorkflowsAndPrompts`** ~12950+ | **`newerWins`** compares **`existing.updatedAt`** vs **`normalizedWorkflow.updatedAt`** ~12996–13005 — timestamps already participate in merge; missing `updatedAt` on import should be normalised (§4). |
| **Export bundle** | **`buildWorkflowBundle`** ~12861–12867; **`handleExportWorkflow`** ~12874–12887; **`exportAllData`** ~10445–10463 | Exports **`{ version: 1, workflows, prompts }`** or workflow array legacy paths in **`handleImportChange`** ~12913–12931. Extra keys on workflow objects **round-trip** as JSON today. |

---

## 3. Proposed workflow metadata schema

**Top-level on each workflow object** (alongside existing fields such as `id`, `name`, `steps`, `workflowOutputSpec`, …):

| Field | Type | Required | Semantics |
|-------|------|----------|-----------|
| **`tags`** | `string[]` | No (default `[]`) | User-authored labels for discovery (trimmed, non-empty strings). Normalise to **array** on load/save; optional future: dedupe case-insensitively (product decision). |
| **`notes`** | `string` | No (default `""`) | **Workflow-level** internal notes — **not** the same as each step’s **`step.notes`** (step authoring/runner notes). |
| **`createdAt`** | `number` (epoch ms) | **Effectively yes** after first save | Already written on create/update path ~12034–12045 and Factory scaffold ~13391–13392. |
| **`updatedAt`** | `number` (epoch ms) | Same | Already written on save and used in import merge. |

**Optional / defer (explicit):** `usageCount`, `collections`, nested workflow references, analytics — **out of scope** for first delivery; do not reserve schema keys unless needed to avoid collisions with future features.

**Naming alignment:** Prompt Library uses **`createdAt`/`updatedAt`** (camelCase). Workflows already use the same — **keep** for parity with import merge and Prompt bundle exports.

---

## 4. Normalisation plan for existing workflows and seeded examples

**Single owner:** extend **`normalizeWorkflowForV1`** (`app.js` ~12636+) **or** a small helper called from it, e.g. **`normalizeWorkflowLibraryMetadata(wf)`**, so **every** load and import path receives the same shape.

| Input shape | Action |
|-------------|--------|
| **`tags` missing** | Set `wf.tags = []`. |
| **`tags` string** (legacy mistake) | Split like `detailTags` comma parsing **or** wrap as single-element array — prefer **document** once and implement one rule. |
| **`tags` non-array** | Coerce to `[]` + optional warning in dev-only or silent. |
| **`notes` missing** | `wf.notes = ""`. |
| **`notes` non-string** | `String(...)` or `""`. |
| **`createdAt` / `updatedAt` missing** | Set both to **`Date.now()`** on first normalisation after feature ship **or** use **`updatedAt` = now**, **`createdAt` = updatedAt** if only one timestamp exists — **prefer**: if `updatedAt` present, `createdAt = createdAt || updatedAt`; else both `now` — avoids all workflows showing “same second” unless acceptable. |
| **Factory / hand-built JSON** | Already mostly consistent; scaffold includes timestamps — add empty **`tags`/`notes`** in normaliser only. |
| **Exported bundles re-imported** | Already pass **`normalizeWorkflowForV1`** before merge — new fields survive JSON round-trip. |

**Step `notes`:** Do **not** rename step fields; workflow-level **`notes`** is a **new** sibling property.

---

## 5. UI change plan

### 5.1 Discovery (`workflowsPanel` — `index.html` + `style.css`)

- Add a **filter row** structurally similar to **Prompt Library** `.library-filters` (~358–383 in `index.html` for library), **without** a Workflow `<select>`:
  - **`#workflowListSearch`** — search input.
  - **`#workflowTagFilter`** — comma-separated, placeholder “all must match”.
  - **`#workflowSortSelect`** — options for sorts in §6.
- Layout: insert **above** `#workflowList` inside `.workflow-body` (or beside list per design — default: **above** list for parity with library UX).

### 5.2 List items (`renderWorkflowList`)

- Keep **title** as today.
- **Meta line:** `Updated {formatDate(wf.updatedAt)} · {n} steps` (use **`window.Utils.formatDate`** if available — same as library list ~10063–10065).
- **Tag pills:** reuse `.library-item-tags` / `.tag-pill` pattern ~10078–10083.

### 5.3 Editor (`workflowDetail`)

- After **`workflowName`** (or after **Starting artefact** block — product choice), add:
  - **Tags:** `<input type="text">` — comma-separated, same mental model as **`#detailTags`**.
  - **Notes:** `<textarea>` — workflow library notes, **not** replacing step notes UI.
  - **Read-only meta:** “Created … / Updated …” populated from `wf.createdAt` / `wf.updatedAt` in **`populateWorkflowDetail`**; updated again after save.

### 5.4 `els` wiring

- Follow existing pattern in `app.js` init (~L400 area) for `els.workflowName`, etc. — register new element ids once.

### 5.5 Accessibility

- Mirror labels / `aria-label` on list and filters consistent with library panel.

---

## 6. Search / filter / sort behaviour

### 6.1 Search (single query string, case-insensitive)

Build **`buildWorkflowSearchHaystack(wf)`** concatenating (with spaces) lowercased:

| Source | Field(s) |
|--------|----------|
| Name | `wf.name` |
| Goal / outcome | `wf.workflowOutputSpec.goal` |
| Constraints | `wf.workflowOutputSpec.constraints` |
| Audience | `wf.workflowOutputSpec.audience` |
| Runtime inputs | `wf.artefacts`, joined `wf.workflowInputs` |
| Named outputs | `wf.workflowOutputs` (array or string list normalised) |
| Step titles | each `step.title` |
| **Workflow tags** | `wf.tags.join(" ")` |
| **Workflow notes** | `wf.notes` |

**Optional extension (later slice):** step **`roleLabel`**, **`outputName`**, step **`notes`** — increases noise vs discoverability; **product call**.

### 6.2 Tag filter

- Same semantics as Prompt Library: **comma-separated** tokens, **trim**, **lowercase**; **all** tokens must match **at least one** tag on the workflow using **substring** match on normalised tag strings (library behaviour ~9994–9997), unless decision is **exact** match only.

### 6.3 Sort options

| Value | Behaviour |
|-------|-----------|
| `updatedDesc` | Default — `(b.updatedAt||0) - (a.updatedAt||0)` |
| `updatedAsc` | Oldest updated first |
| `createdDesc` / `createdAsc` | Same on `createdAt` |
| `nameAsc` / `nameZ` | `localeCompare` on `name` |
| `stepsDesc` / `stepsAsc` | Compare `(steps||[]).length` |

**Implementation:** either **`applyWorkflowListFilters`** returning sorted slice, or sort **after** filter — match library pattern (filter then sort in one function).

### 6.4 Interaction with selection

- When filter changes, **keep** `selectedWorkflowId` if still visible; else select **first visible** or **clear** — mirror how library selection behaves when list changes (verify current `selectPrompt` / workflow click handlers for edge cases).

---

## 7. Import/export compatibility plan

| Path | Plan |
|------|------|
| **Export** (`buildWorkflowBundle`, `exportAllData`, array export) | New keys **`tags`**, **`notes`** ride along in JSON **unchanged**. No **`version`** bump strictly required if consumers ignore unknown keys; optional **`version: 2`** later if a charter wants strict reader negotiation — **v1 default:** additive fields only. |
| **Import** | **`normalizeWorkflowForV1`** ensures defaults — older files without fields remain valid. |
| **`newerWins`** | Continues to use **`updatedAt`**; saving workflow library fields should **`touch`** `updatedAt` when tags/notes/search-only? **Decision:** update **`updatedAt`** whenever **Save** is pressed (consistent with today’s save semantics). |
| **Prompt Library export bundle** | Workflows embedded in **`prism-export`** gain new fields — same as above. |

**No** change to **`library.js`** schema required for this feature.

---

## 8. Tests / manual smoke plan

### 8.1 Automated (if / when implemented)

- **Unit-style** (Node): pure functions **`normalizeWorkflowLibraryMetadata`**, **`buildWorkflowSearchHaystack`**, **`applyWorkflowListFilters`** — small fixtures with minimal `wf` objects (no DOM), aligned with Sprint 11/12 style tests under `tests/`.
- **Optional:** one test that **`normalizeWorkflowForV1`** leaves new fields intact when already present.

### 8.2 Manual smoke

1. **New workflow:** tags empty, notes empty, timestamps appear after first save; meta displays in detail.
2. **Edit tags/notes:** save → reload page → fields persist (`localStorage`).
3. **Search:** query matches goal, step title, tag string; does **not** match unrelated workflow.
4. **Tag filter:** `a, b` requires both substrings present across tags.
5. **Sort:** each option orders correctly with 3+ workflows (vary step counts and dates).
6. **Import older JSON** (no tags): loads, list shows no tag pills, search still works on name.
7. **Export / re-import:** round-trip preserves tags and notes.
8. **Duplicate / rename flows:** already reset timestamps on clone ~12067–12068, ~12118–12119 — **verify** tags/notes copy behaviour (**expected:** duplicate copies tags/notes like other fields; rename clone path same).
9. **Factory scaffold save:** new workflow has empty tags/notes and valid timestamps.
10. **Prompt Library tab:** workflow filter dropdown still works; **no** “workflow filter inside workflows” control added.

---

## 9. Suggested implementation slices

| Slice | Scope | Outcome |
|-------|--------|---------|
| **A** | Schema + **`normalizeWorkflowForV1`** (+ import path) + **`gatherWorkflowDetailFormData`** + **`populateWorkflowDetail`** + **`handleSaveWorkflow`** merge | Tags, notes, timestamps **persist** and display in **detail** only; list UI **unchanged** except maybe read-only meta if cheap. |
| **B** | **`renderWorkflowList`** + **`index.html`** filters DOM + **`applyWorkflowListFilters`** + event listeners | Discovery: search, tag filter, sort; list meta line. |
| **C** | **`style.css`** polish + shared classes + a11y pass | Visual parity with library. |
| **D** (optional) | Extend search haystack (step roles, output names, step notes) | Richer search per product feedback. |
| **E** (defer) | `usageCount`, collections, analytics | Separate charter. |

---

## 10. Recommendation for first slice

**Start with Slice A (schema + normalisation + gather/save/detail UI).**

**Rationale:** Establishes **durable data** and **edit surfaces** without touching list derivation or filter event wiring; lowest risk of breaking selection/tab flows; import/export compatibility is fixed **once** at the normaliser; Slice B then becomes **mostly UI + pure filter function** on stable data.

---

## Review log

- **2026-05-13** — Workflow Library metadata and discovery planning drafted (`workflow-library-metadata-discovery-planning.md`).
