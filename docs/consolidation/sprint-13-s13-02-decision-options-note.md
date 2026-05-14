# Sprint 13 — S13-02 decision options note (default domain semantics)

**Date:** 2026-05-13  
**Basis:** `docs/consolidation/sprint-13-s13-02-decision-framing-audit.md`  
**Related:** `docs/consolidation/sprint-13-general-alwayson-first-structured-domain-behaviour.md`

**Purpose:** Summarise **current v1** default-domain semantics and bound the **future decision space** for a possible S13-02 charter. This note **does not** select a policy, **does not** recommend a path, and **does not** authorise implementation.

**No implementation:** Creating this file is **documentation only**. **No** changes were made to **`app.js`**, **`workflowGenerationContext.js`**, domain packs, prompts, persistence, import/export, orchestration, or Sprint 12 artefacts.

**Scope boundary:** This note **does not** add new Sprint 13 work items beyond framing S13-02 against the completed audit.

**Superseded (2026-05-14) — Factory `<select>` presentation:** Bullets in §**1. Current v1 behaviour summary** that describe **General** as the visible Factory combobox value / **`selectedExtra`** → **`"general"`** reflect the **2026-05-13** UI. **Current** product: **placeholder** + runnable **Learning Design** / **Research**; internal state **`["general"]`** until a runnable id is chosen. **`sprint-13-general-alwayson-first-structured-domain-behaviour.md`** §**Current v1 — General baseline-only**. **Sprint 12** unchanged.

---

## 1. Current v1 behaviour summary

- **Factory in-memory selection** starts and is reset (on domain init) to **`["general"]`**; **`getSelectedWorkflowDomains()`** collapses to **`["general"]`** or **`["general", one structured id]`**.
- **Factory `<select>`** shows **General** when state is **`["general"]`** (**`selectedExtra`** logic in **`renderWorkflowDomainSelector`**).
- **User** changes domain via **`handleWorkflowDomainSelectionChange`**; **`persistSelectedDomains`** writes **localStorage**; **`loadPersistedDomains`** is **not evidenced** as rehydrating Factory **`state`** in the audit trace.
- **Design start** can be **interrupted** by a **chat-based** branch: English-keyword heuristic → pending state → user **yes/no**; **yes** sets domain to **`learning-design`** by **hard-coded** path.
- **Saved workflows** store **`selectedDomains`** from **`getSelectedWorkflowDomains()`** at save time, then **normalise** to the same **`["general"]` / `["general", extra]`** shape.
- **Other surfaces:** Prompt Studio refinement may pass **`state.workflowSelectedDomains || ["general"]`** into context build; **“Construct learning sequence”** step title path can **inject `learning-design`** into a temporary domain list for catalog refresh.

---

## 2. Separation of concerns (four layers)

| Layer | Meaning in v1 | Primary artefacts / mechanisms |
|--------|----------------|----------------------------------|
| **General as architectural baseline** | **`general`** is **always-on** in the shipped manifest and merged into **normalised** domain lists for **WGC** / **`getWorkflowBriefConfig`** input via **`normalizeSelectedDomains`** — distinct from the Factory **`<select>`** variable alone. | `domains/domain-manifest.json` **`alwaysOnDomains`**; **`workflowGenerationContext.js`** **`normalizeSelectedDomains`** (see v1 reference doc). |
| **Factory UI defaults** | What the author **sees** first on the Factory domain control: **General** selected until they choose otherwise; state initialisation and **`initWorkflowDomainSelector`** reassert **`["general"]`**. | **`state.workflowSelectedDomains`**; **`initWorkflowDomainSelector`**; **`renderWorkflowDomainSelector`** / **`selectedExtra`**. |
| **Recommendation heuristics** | **Optional** interrupt before design run: regex on **intent text**; **only `learning-design`** is named in the assistant prompt and applied on **confirmed yes**. | **`shouldRecommendLearningDesignDomain`**; **`workflowDomainSuggestionPending`**; **`handleStartWorkflowDesign`** / **`handleWorkflowAnswer`**. |
| **Persisted state** | **Workflow JSON** carries **`selectedDomains`** (normalised). **localStorage** receives writes on domain change; **rehydration into Factory `state`** was **not evidenced** in the audit. | **`handleSaveDesignedWorkflow`**; **`normalizeWorkflowForV1`**; **`persistSelectedDomains`** / **`loadPersistedDomains`** (definition vs usage gap per audit). |

---

## 3. Current hardcoded Learning Design preference paths

| Path | Mechanism (descriptive) |
|------|-------------------------|
| **Design wizard gate** | Regex over **`designIntent` + `goal`**; assistant message asks to switch to **Learning Design**; **Research** is not offered by the same heuristic. |
| **Affirmative answer** | **`learning-design`** is the **fixed** domain applied when the user accepts (not chosen from a list of structured domains in the message). |
| **Prompt Studio / step title** | **“Construct learning sequence”** causes **`learning-design`** to be **added** to a temporary domain list for catalog loading if absent. |
| **Factory hints (adjacent surface)** | When **`learning-design`** is selected, **LD-specific** helper copy overrides defaults (**`renderWorkflowFactoryDomainUiHints`** — documented under S13-03 audit); this is **not** the same as **default selected domain**, but is part of **LD-special-casing** in the same product area. |

---

## 4. Candidate future decision models (descriptive only)

These are **orthogonal conceptual models** a future charter might combine or reject; they are **not** mutually exclusive in every dimension.

### 4.1 Status quo

**Description:** Preserve current v1 semantics: **General** as Factory default, **existing** recommendation interrupt, **existing** title-based injection, **existing** normalisation and persistence write-through.

### 4.2 Manifest-declared default

**Description:** Introduce or use a **manifest-level** (or otherwise **central config**) declaration of which structured domain (if any) is the **default `<select>`** or **default extra** beyond **`general`**, instead of—or in addition to—**hard-coded** **`app.js`** defaults.

### 4.3 Recommendation-only

**Description:** Keep **all non-user** steering of structured domain inside an **explicit recommendation** subsystem (chat or UI banner); **other** code paths would **not** add **`learning-design`** (e.g. title-based catalog injection) **if** that subsystem were narrowed in a future charter. (Framing label only — exact scope would be charter-defined.)

### 4.4 Persisted-last-selection

**Description:** On load or Factory entry, **rehydrate** Factory **`state.workflowSelectedDomains`** (or equivalent) from **`localStorage`** or another **durable** store so the **last** author selection reappears, **instead of** always resetting to **`["general"]`** on **`initWorkflowDomainSelector`** — **if** wired (today **`loadPersistedDomains`** is **not evidenced** as driving Factory state per audit).

### 4.5 No implicit promotion

**Description:** Remove or **gate off** behaviours where **Learning Design** (or any structured domain) is **inferred** from **text** or **step titles** without a **neutral** default of **explicit user choice**; user would pick structured domain **only** through direct control (charter would define what counts as “implicit”).

---

## 5. Risks / tradeoffs by model (descriptive)

| Model | Tradeoffs / risks (non-exhaustive) |
|-------|-------------------------------------|
| **Status quo** | **Stability** of known paths; continued **LD-only** suggestion and **title** special-case; heuristic **false positives/negatives**; **split** between Factory UI and **WGC** normalisation remains as today. |
| **Manifest-declared default** | **Single source of truth** for default structured id **if** implemented consistently; **coupling** between manifest schema, **`app.js`**, and **WGC** loaders; risk of **drift** if only one layer reads the new key. |
| **Recommendation-only** (as a framing direction) | Concentrates **surprise** behaviour in one subsystem; **reducing** other promotions **would** shrink **Prompt Studio** / title coupling **if** those paths were in scope — **cross-surface** regression risk. |
| **Persisted-last-selection** | **Continuity** across sessions vs **predictability** of “fresh” **General** default; must align **`initWorkflowDomainSelector`** reset, **`localStorage`**, and **saved workflow** semantics to avoid **contradictory** first paint. |
| **No implicit promotion** | **Fewer** surprise domain switches; **more** explicit user burden; **removal** of heuristics may shift **which** authors ever pick a structured domain; **title** rules and **recommendation** copy would need **replacement** governance if anything remains. |

---

## 6. Explicit dependencies / gates before any future implementation

Any future S13-02 **implementation** would require **written** charter approval **separate from** this note, including at minimum:

- **Scope boundary** naming which of §4 models (or combinations) are in/out, and whether **Prompt Studio** title paths, **`briefLines`**, or **pack** edits are touched.
- **Trace / regression evidence** plan for **`getWorkflowBriefConfig`**, **`getFirstStructuredDomainId`**, **`normalizeSelectedDomains`**, Factory **`<select>`**, **save** path, and any **rehydration** story.
- **Cross-artifact review** if manifest, **`workflowGenerationContext.js`**, or **persistence contracts** change.
- **S13-03** and **S13-01** boundaries respected unless a **new** explicit charter widens them.

---

## 7. Explicitly deferred items

- **S13-03** implementation (display-only hint neutralisation) — separate decision gate (`docs/consolidation/sprint-13-s13-03-decision-gate-note.md`).
- **S13-01** follow-on work beyond the delivered first-pass slice.
- **Domain pack** edits, **`uiHints`** JSON changes, **semantic prompt** migration, **`briefLines` / extraction** changes — unless a **dedicated** charter covers them.
- **New Sprint 13** themes not already framed in existing prep/closure docs.

---

## 8. Sprint 12

**Sprint 12** first-pass structural observability (**A–E**) remains **closed**. This note **does not** reopen Sprint 12.

---

## 9. No portability completion claim

**Full drop-in domain-pack portability** is **not** claimed, implied, or advanced as an outcome of any option in §4.

---

## Review log

- **2026-05-13** — S13-02 decision-options note added from decision framing audit (documentation only).
