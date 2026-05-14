# Sprint 13 — S13-02 decision framing audit (default domain behaviour)

**Date:** 2026-05-13  
**Role:** Document **current** default-domain and related behaviour **as implemented**, and surface **decision points** for a possible future S13-02 charter. **This is not** a product policy change, **not** an implementation plan, and **not** a recommendation to merge any behaviour change.

**Related reference (v1 architecture):** `docs/consolidation/sprint-13-general-alwayson-first-structured-domain-behaviour.md` — manifest **`alwaysOnDomains`**, **`normalizeSelectedDomains`**, **`general`** as baseline, Factory collapse to **`["general"]`** or **`["general", oneExtra]`**.

**Explicit statement — no implementation occurred:** **No** edits were made to **`app.js`**, **`workflowGenerationContext.js`**, domain packs, prompts, persistence/import/export, or Sprint 12 artefacts for this audit.

**Out of scope for this note:** S13-03 implementation; Sprint 12 reopening; **full drop-in portability** claims.

**Superseded (2026-05-14) — Factory `<select>` rows:** Inventory rows that tie default **`["general"]`** state to a visible **General** `<option>` / **`selectedExtra`** coercion to **`"general"`** describe the **2026-05-13** implementation snapshot. **Current** Factory UI: **General baseline-only** (placeholder + **Learning Design** / **Research**). See **`sprint-13-general-alwayson-first-structured-domain-behaviour.md`** §**Current v1 — General baseline-only**. Rows below remain **useful** for S13-02 framing but are **not** exact line-level UI truth for **`#wfDesignDomainSelect`**.

---

## 1. Inventory of default-domain behaviours

| # | Behaviour | Summary (as implemented) |
|---|-----------|---------------------------|
| 1 | **Initial in-memory Factory selection** | **`state.workflowSelectedDomains`** is initialised to **`["general"]`** at app state creation (`app.js` ~186). |
| 2 | **Re-init on Factory domain selector setup** | **`initWorkflowDomainSelector`** assigns **`state.workflowSelectedDomains = ["general"]`** again before async domain load (`app.js` ~3081). |
| 3 | **Collapsed domain list for Factory** | **`getSelectedWorkflowDomains()`** always returns **`["general"]`** or **`["general", firstNonGeneralFromState]`** — at most one structured id after **`general`** (`app.js` ~2537–2551). |
| 4 | **`<select>` visible value vs state** | **`renderWorkflowDomainSelector`** sets **`selectedExtra`** to the first non-**`general`** entry from **`getSelectedWorkflowDomains()`**, else **`"general"`**; coerces to **`"general"`** if no matching `<option>` (`app.js` ~2575–2601). With default state **`["general"]`**, the combobox shows **General**. |
| 5 | **User change path** | **`handleWorkflowDomainSelectionChange`** sets **`state.workflowSelectedDomains`** to **`["general"]`** or **`["general", selectedValue]`** when **`selectedValue !== "general"`**, and calls **`persistSelectedDomains`** when available (`app.js` ~3051–3062). |
| 6 | **Learning Design recommendation gate** | **`shouldRecommendLearningDesignDomain`** returns **true** only when **no** structured (non-**`general`**) domain is already selected and a regex matches **workshop / lesson / teaching / assessment / learner(s) / course / module** in **`designIntent` + `goal`** text (`app.js` ~3159–3167). |
| 7 | **Recommendation flow (chat)** | **`handleStartWorkflowDesign`** clears prior design state, then if **`shouldRecommendLearningDesignDomain`** is true, stores **`workflowDomainSuggestionPending`** (captures form fields) and logs an assistant message asking to switch to **Learning Design** (`app.js` ~5713–5733). **Design does not start** until the user resolves this branch. |
| 8 | **User accepts recommendation** | **`handleWorkflowAnswer`**: if **`workflowDomainSuggestionPending`** and answer is yes-like, sets **`#wfDesignDomainSelect.value = "learning-design"`** and invokes **`handleWorkflowDomainSelectionChange()`** (`app.js` ~13488–13498). |
| 9 | **Prompt Studio / step “Construct learning sequence”** | When opening Prompt Studio from a step titled **“Construct learning sequence”**, if **`learning-design`** is not in the workflow’s **`selectedDomains`**, it is **pushed** into a temporary domain list used to refresh the step pattern catalog (`app.js` ~11277–11291). **`general`** is prepended if missing. |
| 10 | **Saved workflow domain normalisation** | **`normalizeWorkflowForV1`** (or equivalent path ~12751–12759) collapses **`wf.selectedDomains`** to **`["general"]`** or **`["general", existingExtra]`** — same shape as Factory state. |
| 11 | **Saving a Factory-designed workflow** | **`handleSaveDesignedWorkflow`** sets **`wf.selectedDomains`** from **`getSelectedWorkflowDomains()`** (`app.js` ~13393), then **`normalizeWorkflowForV1`** (~13407). |
| 12 | **Prompt Studio refinement context** | **`buildPromptRefinementContext`** is called with **`selectedDomains: state.workflowSelectedDomains || ["general"]`** when injecting domain context for workflow-step refinement (`app.js` ~8512–8518). |
| 13 | **Manifest `alwaysOnDomains`** | **`domains/domain-manifest.json`** lists **`"general"`** under **`alwaysOnDomains`** — **architectural** merge into effective domain sets in **`workflowGenerationContext.js`** **`normalizeSelectedDomains`** (see v1 reference doc); **not** the same variable as **`state.workflowSelectedDomains`**, but **`general`** is always treated as the Factory baseline id. |
| 14 | **localStorage write-through** | **`persistSelectedDomains`** writes **`promptr.workflowFactory.domains.v1`** (`workflowGenerationContext.js` ~159–162). **`loadPersistedDomains`** is **defined and exported** in the same module (~165–173) but **no call site** was found in **`app.js`** or inside **`workflowGenerationContext.js`** in this audit — **rehydration of Factory `state` from that key is not evidenced** here. |

---

## 2. File / function references

| Concern | Primary location |
|---------|------------------|
| Initial state | `app.js` — initial **`state`** object (~186). |
| **`getSelectedWorkflowDomains`** | `app.js` (~2537–2551). |
| **`renderWorkflowDomainSelector`** / **`selectedExtra`** | `app.js` (~2570–2603). |
| **`handleWorkflowDomainSelectionChange`** | `app.js` (~3051–3066). |
| **`initWorkflowDomainSelector`** | `app.js` (~3077+). |
| **`shouldRecommendLearningDesignDomain`** | `app.js` (~3159–3167). |
| **`handleStartWorkflowDesign`** (recommendation branch) | `app.js` (~5656–5734). |
| **`handleWorkflowAnswer`** (yes → LD) | `app.js` (~13488–13502). |
| **Construct learning sequence** domain push | `app.js` (~11277–11291). |
| **Workflow normalisation** | `app.js` (~12751–12759). |
| **`handleSaveDesignedWorkflow`** (`selectedDomains` snapshot) | `app.js` (~13192–13407). |
| **`persistSelectedDomains` / `loadPersistedDomains`** | `workflowGenerationContext.js` (~159–173, export ~904–905). |
| **Manifest always-on** | `domains/domain-manifest.json` (`alwaysOnDomains`). |
| **WGC normalisation** | `workflowGenerationContext.js` — **`normalizeSelectedDomains`** (v1 reference doc). |

---

## 3. Distinction: architectural baseline vs UI defaults vs recommendation vs persisted

| Layer | What it is in v1 | How it shows up |
|--------|------------------|-----------------|
| **Architectural baseline** | **`general`** in **`alwaysOnDomains`** + **`normalizeSelectedDomains`** ensures **`general`** is in **effective** domain sets for **context / brief-config** paths when manifests load (`workflowGenerationContext.js`; see consolidation v1 note). | Affects **which domain files** and **normalised order** for **WGC**, not necessarily the **Factory `<select>`** value in isolation. |
| **UI defaults (Factory)** | **`state.workflowSelectedDomains`** starts **`["general"]`**; **`initWorkflowDomainSelector`** resets to **`["general"]`**; **`selectedExtra`** logic shows **General** until the user picks another domain. | User-visible **default** is **General** on the Factory combobox for a fresh session / re-init path audited. |
| **Recommendation flows** | **`shouldRecommendLearningDesignDomain`** + **`workflowDomainSuggestionPending`** + chat **`handleWorkflowAnswer`** — **opt-in** switch to **`learning-design`** via simulated select + **`handleWorkflowDomainSelectionChange`**. | **Does not** auto-switch domain without user confirmation; **does** hard-code **Learning Design** as the **only** suggested structured domain in that path. |
| **Persisted state behaviour** | **Workflow objects:** **`selectedDomains`** on saved workflows normalised to **`["general"]`** or **`["general", extra]`** (~12751–12759). **`persistSelectedDomains`:** writes current Factory selection to **localStorage** on user change. **Evidence gap:** **`loadPersistedDomains`** not called from traced **`app.js`** / WGC internals — **unclear** whether the localStorage value is read back into **`state.workflowSelectedDomains`** on reload. |

---

## 4. Evidence of implicit Learning Design preference paths

| Path | Evidence | “Preference” character (descriptive) |
|------|----------|----------------------------------------|
| **Design wizard keyword gate** | **`shouldRecommendLearningDesignDomain`** regex on pedagogy-like English tokens; message text explicitly **recommends** switching to **Learning Design** (`app.js` ~3159–3167, ~5731). | **Single** promoted structured domain (**`learning-design`**) when gate fires; **Research** is **not** suggested by the same heuristic. |
| **Chat confirmation** | On yes-like answer, **`wfDesignDomainSelect`** is set to **`"learning-design"`** (not a user-picked id from message) (`app.js` ~13494–13496). | **Hard-coded** target domain for the affirmative branch. |
| **Construct learning sequence** | **`learning-design`** injected into catalog refresh list if absent (`app.js` ~11277–11284). | **Title-triggered** augmentation of domain list for **Prompt Studio** prefill — **not** the Factory default, but **LD-specific** promotion for that step title. |
| **LD-specific UI hints** | **`renderWorkflowFactoryDomainUiHints`** overrides when **`learning-design`** is in **`getSelectedWorkflowDomains()`** (S13-03 audit). | **Presentation** bias toward LD copy when LD is selected — **orthogonal** to default **which domain is selected**, but part of “LD is special in Factory” surface area. |

**Counter-evidence (default is not LD):** Fresh **`state`** and **`initWorkflowDomainSelector`** default **`["general"]`**; **`selectedExtra`** resolves to **General** until the user (or confirmation flow) selects otherwise.

---

## 5. Risks of changing default semantics (descriptive, not prescriptive)

- **WGC / brief-config coupling:** Changing Factory defaults or recommendation rules without aligning **`getWorkflowBriefConfig`**, **`getFirstStructuredDomainId`**, and **manifest `alwaysOnDomains`** semantics can desynchronise **author expectations** from **which domain’s `workflowBriefConfig` loads**.
- **Recommendation false positives/negatives:** Regex heuristics may suggest **LD** for text that authors consider **Research** (or **general-only**), or miss cases authors consider LD — any change shifts **who sees** the interrupting gate.
- **Saved workflow + export shape:** **`selectedDomains`** is part of **saved** workflow identity; normalisation already collapses to one extra domain; changing rules can affect **import round-trip** expectations.
- **localStorage:** **`persistSelectedDomains`** already stores arrays; if a future change **reads** this key into **`state`**, behaviour diverges from **current** “always reset to **`["general"]`** on **`initWorkflowDomainSelector`**” unless coordinated.
- **Construct learning sequence:** Changing title-based injection affects **Prompt Studio** pattern availability without touching Factory defaults.

---

## 6. Candidate future decision options (descriptive only)

These are **possible** directions a **future** S13-02 charter might consider; **none** are endorsed here.

- **Status quo documentation** — keep behaviour; only clarify in product/docs when the LD recommendation appears.
- **Manifest-driven default structured domain** — introduce an explicit config key for “default extra domain” or “default `<select>` value” (would touch charter scope beyond **`app.js`**).
- **Broaden / replace recommendation heuristics** — extend regex or add **Research**-aware gates; or remove the gate.
- **Make recommendation non-blocking** — e.g. run design without interrupting (large UX change).
- **Rehydrate Factory selection from `localStorage`** — wire **`loadPersistedDomains`** into init (if product wants session continuity).
- **Neutralise LD-only hard-coding** — route suggestions through config or multi-domain policy (cross-cuts S13-02 / portability).
- **Title-based rules audit** — inventory all title/domain special cases ( **`Construct learning sequence`** and any others).

---

## 7. Explicitly deferred items

- **S13-03** — display-only hint neutralisation implementation (separate decision gate).
- **S13-01** follow-on — any further manifest/UI parity work beyond delivered first-pass slice.
- **Domain pack edits** and **`uiHints`** / prompt-body edits tied to “default domain” copy.
- **`briefLines` / extraction / model payload** policy changes under an S13-02 label without a dedicated semantics charter.
- **Sprint 12** — tests, closure, or structural observability scope.
- **Portability completion** — no milestone claim tied to this audit.

---

## 8. Statement that no implementation occurred

This document is **audit-only**. **No** production or documentation **implementation** of S13-02 was performed—only **observation** and **classification** as recorded above.

---

## Review log

- **2026-05-13** — S13-02 decision framing audit drafted from **`app.js`**, **`workflowGenerationContext.js`**, and **`domains/domain-manifest.json`** (read-only).
