# Sprint 13 — starting artefact / LD starting-point code-derived parity matrix

**Date:** 2026-05-13  
**Path:** `docs/consolidation/sprint-13-starting-artefact-starting-point-code-derived-parity-matrix.md`

**Role:** **Runtime / code-derived** parity matrix for **`#wfDesignStartingArtefact`** behaviour **before** any Tier **B/C** helper extraction (see [`sprint-13-starting-artefact-bounded-implementation-review.md`](sprint-13-starting-artefact-bounded-implementation-review.md)). Grounded in [`sprint-13-starting-artefact-ld-starting-point-portability-audit.md`](sprint-13-starting-artefact-ld-starting-point-portability-audit.md) and current **`app.js`** / **`workflowGenerationContext.js`** sources.

**Documentation only:** **No** implementation, domain-pack, prompt, persistence, import/export, orchestration edits, or Sprint 12 reopening. **No** full portability completion claim.

**Code references (authoritative line numbers):** `app.js` **`renderWorkflowFactoryStartingArtefactOptions`** ~2810–2986; **`updateWorkflowFactoryInputsCopyFromStartingPoint`** ~2789–2808; **`renderWorkflowFactoryDomainUiConfig`** ~2746–2786; **`workflowGenerationContext.js`** **`getDomainArtefactOptions`** ~714–749.

**Superseded (2026-05-14) — row 1 “General selected” / brief path (a):** This matrix was derived against a snapshot where **General** could be the **only** “visible” structured domain and **`getWorkflowBriefConfig`** could still supply **`input_strategy`** from a General pack. **Current:** **General baseline-only** Factory (**Learning Design** / **Research** runnable); **general-only** **`getWorkflowBriefConfig`** returns **`config: null`** — row **1 (a)** is **not** a steady-state for new installs at that coupling. Row **1** remains **historical** code-path evidence; re-derive if baselines change.

---

## 1. Matrix table

### 1.1 Preconditions (all rows)

| Item | Code-derived rule |
|------|-------------------|
| **Entry** | If **`!els.wfDesignStartingArtefact`**, **`renderWorkflowFactoryStartingArtefactOptions` returns immediately** — no inner renders, **no** `updateWorkflowFactoryInputsCopyFromStartingPoint` from this function. |
| **`current` capture** | At entry: **`var current = String(els.wfDesignStartingArtefact.value \|\| "").trim()`** — used for restore in every inner render path. |
| **Starting `<select>` placeholder option** | In **`renderInputStrategyOptions`**, **`renderLearningDesignStartingPointOptions`**, and **`renderOptions`**: first child is **`value=""`**, **`textContent`** exactly **`Select starting point…`** (ellipsis character **…**). |
| **Restore / clear selection** | After rebuilding options: **`els.wfDesignStartingArtefact.value = els.wfDesignStartingArtefact.querySelector('option[value="' + current + '"]') ? current : ""`**. If **`current`** contains characters that break the attribute selector, **no match** → value reset to **`""`** (code-derived edge risk). |
| **`getVisibleDomainId`** | First **`selectedDomains`** element whose lowercased id **≠** **`"general"`**; if none, **`"general"`**. |
| **`getAllowSetForDomain`** | Looks up **`STARTING_ARTEFACT_ALLOWLIST`** with key **`String(domainId).toLowerCase()`**. Returns **`null`** if missing or non-array or empty. Otherwise returns a **plain object** used as a **string-keyed set** of **lowercased** artefact ids. **No `research` key** → **`null`** for research. |
| **`STARTING_ARTEFACT_ALLOWLIST` ids (frozen in code)** | **`general`:** `normalized_content`, `summary`, `key_points`, `structured_data`, `analysis`, `entities`, `relationships`. **`learning-design`:** `normalized_content`, `knowledge_model`, `learning_outcomes`, `learning_activities`, `activity_materials`, `assessment_blueprint`, `mcq_items`, `learning_sequence`, `marking_rubric`. |

### 1.2 Summary matrix

Rows assume **`selectedDomains`** yields the stated **visible** structured domain via **`getVisibleDomainId()`** (e.g. **General only** ⇒ **`["general"]`** or any list whose first non-general is absent). **WGC** = **`window.WorkflowGenerationContext`**.

| # | Scenario (visible domain + reachability) | Option **values** (ordered) & **labels** | **Selected value after render** | `updateWorkflowFactoryInputsCopyFromStartingPoint` | Async / supersession | Owner mix | Semantic vs display |
|---|------------------------------------------|-------------------------------------------|----------------------------------|------------------------------------------------------|------------------------|------------|------------------------|
| **1** | **General selected** — **two mutually exclusive sub-paths** per render: **(a)** brief **`input_strategy`** has **≥1** normalized choice ⇒ `usedBriefConfigOptions === true`; **(b)** else catalogue path | **(a)** **`""`** then pack **`choice.value` / `choice.label`** (**no** `STARTING_ARTEFACT_ALLOWLIST` filter). **(b)** **`""`** then filtered **`item.id`** with **`textContent` = `item.label \|\| item.id`**: domain filter (`item.domainId` empty **or** lowercased match to **`general`**) **and** id ∈ **`STARTING_ARTEFACT_ALLOWLIST.general`** (case-insensitive). **(b2)** if **`!WGC`** or **`getDomainArtefactOptions` not a function** after brief false: same as row **5** (placeholder only). | **`current`** if matched by **`option[value="…"]`**; else **`""`** | **Yes** — end of whichever inner render ran **(a)** **`renderInputStrategyOptions`** (~2843) **(b)** **`renderOptions`** (~2934). Parent **`renderWorkflowFactoryDomainUiConfig`** may call **update** (~2774 / ~2785) **before** async child finishes (**§1.3**). | **(a)** outer **`.then`** returns after brief (~2969); **no** `getDomainArtefactOptions`. **(b)** `getDomainArtefactOptions` **`.then`** → **`renderOptions`**. **(b)** rejection → row **5**-style empty list via **`.catch`** (~2983–2984). | **(a)** **pack** + **app.js**. **(b)** **WGC** (**pack** markdown) + **app.js** allowlist + DOM | **Semantic** values; labels mostly **display** |
| **2** | **Learning Design selected** — **normal** **`renderFromBriefConfig`** / WGC stack (promise resolves, no throw); **`input_strategy`** may be empty or populated | **Final:** **`""`**, `generate_from_topic`, `provided_source_content`, `mixed` + fixed English labels. **If** choices existed: **intermediate** brief-driven **`value`/`label`** pairs until LD rebuild | **Final:** **`current`** if in trio; else **`""`** | **Yes** — **`renderLearningDesignStartingPointOptions`** (~2905); **plus** **`renderInputStrategyOptions`** (~2843) **iff** choices rendered | **Ordering:** inner **`getWorkflowBriefConfig`** **`.then`** may call **`renderInputStrategyOptions`**; **then** outer **`renderFromBriefConfig().then`** **always** runs **`renderLearningDesignStartingPointOptions`** for LD (~2965–2967) | **Final** trio **app.js**; optional brief step **pack** + **app.js** | **Final** trio **semantic**; brief step **intermediate** for final parity |
| **3** | **Learning Design selected** — **brief slow / async then LD trio supersedes** (same code path as **2**; row highlights **observable** timing) | Same **final** as row **2** | Same **final** as row **2** | Same as row **2** (potentially **two** **update** calls when brief had choices) | **Supersession:** any **`input_strategy`** DOM is **not** authoritative until outer **`.then`** completes; parity must sample **after** microtasks for **final** DOM | Same as **2** | **Final** state **semantic**; intermediate **display-only** for strict “starting artefact” parity |
| **4** | **Research selected** (`getAllowSetForDomain` → **`null`**) | **`""`** then items passing domain filter for **`research`**; **no** id allowlist filter | Same restore rule | **Yes** — **`renderOptions`** (~2934) when catalogue path runs | Same async pattern as general **(b)** | **WGC** + **app.js** domain filter | **Semantic** visible ids |
| **5** | **`getDomainArtefactOptions` unavailable or failure** — after **`usedBriefConfigOptions === false`**: **`!WGC`** / missing **`getDomainArtefactOptions`**, **or** promise **rejects** | **Only** placeholder **`""` / `Select starting point…`** | **`""`** (placeholder is only **`value=""`**; **`current`** non-empty with no matching option → **`""`**) | **Yes** — **`renderOptions([])`** (~2934); reject path ~2983–2984 | Sync empty render on missing API; async **`.catch`** on rejection | **app.js** fallback (**WGC** absent or failed) | **Display-only** list; cleared / empty value **semantic** |
| **6** | **Previously selected `startingArtefact` restored if valid** — **outcome** after **any** inner rebuild (applies to rows **1–5** when list includes **`current`**) | Same as the active branch’s **final** list | **`current`** when **`querySelector('option[value="' + current + '"]')`** succeeds | **Yes** — after restore in that inner render | None beyond parent/child **update** ordering (**§1.3**) | **app.js** restore logic | **Semantic** value retained |
| **7** | **Previously selected reset if invalid** — **outcome** when **`current`** not in **final** list (wrong domain, removed pack id, selector hazard, etc.) | Same as the active branch’s **final** list | **`""`** | **Yes** | None | **app.js** restore logic | **Semantic** — clears starting artefact for downstream |

---

### 1.3 `updateWorkflowFactoryInputsCopyFromStartingPoint` — code-derived side effects

**Guard:** If **`!els.wfDesignInputs`**, **no-op** (label / hint / placeholder unchanged).

**Inputs read:** **`els.wfDesignStartingArtefact.value`** (trimmed) after whatever options were last applied.

| Condition | **`wfDesignInputsLabel`** | **`wfDesignInputsHint`** | **`els.wfDesignInputs.placeholder`** |
|-----------|---------------------------|--------------------------|--------------------------------------|
| **No selection** (`!selected`) | `Source material / inputs` | `Describe source materials or inputs available at the start (runtime artefacts, not workflow mechanics).` | `e.g. PDF, notes, transcript, list of topics...` |
| **Selection present** | `Input details (optional)` | `Describe or provide the selected starting point.` | `e.g. paste or describe the selected starting point, or note where it comes from` |

**Ownership:** **app.js** only (not pack, not WGC). **Classification:** **display-only** for Factory UX copy, but **driven by** the **semantic** `<select>` value (which **does** affect briefs downstream elsewhere).

**Extra caller (outside `renderWorkflowFactoryStartingArtefactOptions`):** **`renderWorkflowFactoryDomainUiConfig`** invokes **`updateWorkflowFactoryInputsCopyFromStartingPoint()`** immediately **after** **`renderWorkflowFactoryStartingArtefactOptions(domains)`** on **success** and **catch** paths (~2774, ~2785). Because **`renderWorkflowFactoryStartingArtefactOptions`** only **schedules** async work and returns, that **update** can run against **stale** `<select>` DOM / value **before** inner **`renderInputStrategyOptions` / `renderLearningDesignStartingPointOptions` / `renderOptions`** run. Inner paths **always** call **update** again when they finish.

---

## 2. Known unknowns (requires runtime / pack state, not derivable from `app.js` alone)

| Unknown | Why |
|---------|-----|
| **Exact option list for rows 1 / 4** | **`input_strategy.choices`** and artefact **`id` / `label` / domainId** come from **loaded packs + manifest paths** via WGC. |
| **Whether brief path triggers for a given domain mix** | Depends on **`getWorkflowBriefConfig`** return for **`selectedDomains`**. |
| **`item.domainId` distribution** | Parsed from file path in **`getDomainArtefactOptions`**; empty string behaviour interacts with domain filter. |
| **Intermediate paint / a11y** | Whether users observe flicker when **row 2–3** runs two DOM rebuilds — **not** derivable from code. |
| **Saved-workflow `startingArtefact` inventory** | Audit §7; **not** repeated here. |

---

## 3. Reachability notes

| Path | Reachability |
|------|----------------|
| **1 (a) vs 1 (b)** | Mutually exclusive per render: outer **`.then`** returns early when **`usedBriefConfigOptions`** is true (~2969), skipping **`getDomainArtefactOptions`**. |
| **2 / 3** | Reachable whenever **`getVisibleDomainId() === "learning-design"`** (e.g. **`["general","learning-design"]`** with LD as first non-general). **Not** reachable from **general-only** selection. |
| **4** | **`["general","research"]`** (or research first non-general) ⇒ **`visibleDomainId === "research"`** and **`allowSet === null`**. |
| **5** (missing API vs rejection) | **Missing API:** synchronous **`renderOptions([])`**. **Rejection:** promise **`.catch`** → same empty render (~2983–2984). |
| **6 / 7** | **Outcomes** of the shared restore expression on every inner rebuild — they **annotate** rows **1–5**, not separate domain branches. |
| **Early WGC-less `renderWorkflowFactoryDomainUiConfig`** (~2750–2758) | Calls **`renderWorkflowFactoryStartingArtefactOptions`** **without** the trailing parent **`update`** present on the success/catch branches — inner async still supplies **update** when renders complete. |

---

## 4. Parity risks (for Tier B/C extraction / regression hunting)

| Risk | Detail |
|------|--------|
| **Double DOM + double `update`** | LD + non-empty brief choices ⇒ **`renderInputStrategyOptions`** then **`renderLearningDesignStartingPointOptions`**; parity must target **final** state. |
| **Parent `update` vs async child** | **`renderWorkflowFactoryDomainUiConfig`** may call **`update`** before starting-artefact async completes — tests that snapshot “immediately after caller returns” can disagree with “after microtasks drain”. |
| **Brief path bypasses allowlist** | **`renderInputStrategyOptions`** does **not** consult **`STARTING_ARTEFACT_ALLOWLIST`** — parity docs must not assume allowlist applies to row **1**. |
| **`querySelector` + `current` injection** | Odd **`current`** strings can fail match → forced **`""`** (row **7**). |
| **Orchestration coupling** | Changing **only** nested helper placement without preserving **promise** ordering could alter supersession or **update** counts. |

---

## 5. Whether Tier B/C helper extraction is now evidence-ready

| Criterion | Status |
|-----------|--------|
| **Branch order, short-circuit, allowlist keys, LD trio ids/labels, restore expression, empty fallbacks, `update` call sites** | **Code-derived** — covered above. |
| **Per-environment option **sets** for catalogue/brief paths** | **Not** code-complete — still needs **runtime** snapshots (or fixture-driven tests) per pack/manifest. |
| **Parent-caller `update` race** | **Documented** — any Tier B/C change should re-verify **both** “after tick” and “final microtask” expectations if tests are sensitive. |

**Verdict:** **Partially evidence-ready.** Structural parity (Tier **B/C** mechanical refactor) has a **code-derived** contract; **full** regression evidence still needs **runtime snapshots** for **rows 1 / 4** option inventories and optional UI timing assertions.

---

## 6. Confirmation that no implementation occurred

**No** edits to **`app.js`**, **`workflowGenerationContext.js`**, domain packs, prompts, persistence, import/export, orchestration, tests, or Sprint 12 artefacts were made to produce this matrix. This file is **documentation only**.

---

## Related artefacts

| Document | Role |
|----------|------|
| [`sprint-13-starting-artefact-bounded-implementation-review.md`](sprint-13-starting-artefact-bounded-implementation-review.md) | Tier A/B/C scope and stop conditions |
| [`sprint-13-starting-artefact-ld-starting-point-portability-audit.md`](sprint-13-starting-artefact-ld-starting-point-portability-audit.md) | Inventory and cross-surface map |

---

## Review log

- **2026-05-13** — Code-derived starting-artefact / LD starting-point parity matrix drafted (`sprint-13-starting-artefact-starting-point-code-derived-parity-matrix.md`).
