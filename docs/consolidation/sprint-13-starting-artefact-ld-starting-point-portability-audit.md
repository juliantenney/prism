# Sprint 13 — portability audit: starting artefact & Learning Design starting-point coupling

**Date:** 2026-05-13  
**Role:** Map **hardcoded** Workflow Factory starting-point behaviour and its coupling to **`learning-design`**, for **domain-pack portability** reasoning. **Audit documentation only.**

**Explicit confirmation — no implementation was done:** **No** edits to **`app.js`**, **`workflowGenerationContext.js`**, domain packs, prompts, persistence/import/export, orchestration, tests, Sprint 12 artefacts, or other consolidation notes for this task.

**Out of scope for this audit:** Sprint 12 reopening; **full drop-in portability** completion claims; S13-03 hint implementation; S13-02 default-domain **policy** selection beyond how it intersects **`visibleDomainId`**.

---

## 1. Inventory of hardcoded starting artefact / starting-point behaviours

| # | Behaviour | Where / trigger |
|---|-----------|-----------------|
| 1 | **`STARTING_ARTEFACT_ALLOWLIST`** — literal object keyed by **`"general"`** and **`"learning-design"`** only (no **`research`** key). | `app.js` inside **`renderWorkflowFactoryStartingArtefactOptions`** (~2856–2877). |
| 2 | **`getVisibleDomainId`** — first non-**`general`** id in **`selectedDomains`**, lowercased, else **`"general"`**. | Nested in **`renderWorkflowFactoryStartingArtefactOptions`** (~2878–2884). |
| 3 | **`getAllowSetForDomain`** — builds a **Set** of allowed **starting artefact ids** from the allowlist row for **`domainId`**; returns **`null`** if domain key missing or empty list. | ~2885–2894. |
| 4 | **`renderLearningDesignStartingPointOptions`** — **replaces** `<select>` contents with placeholder + **three** fixed rows: **`generate_from_topic`**, **`provided_source_content`**, **`mixed`** with fixed English labels. | ~2895–2917. |
| 5 | **LD branch short-circuit** — if **`getVisibleDomainId() === "learning-design"`**, call **`renderLearningDesignStartingPointOptions()`** and **return** (does **not** run **`getDomainArtefactOptions`** path for that render). | ~2974–2978. |
| 6 | **`renderFromBriefConfig`** — loads **`getWorkflowBriefConfig`**, finds factor **`input_strategy`**, if **`choices`** non-empty calls **`renderInputStrategyOptions(choices)`** (DOM from pack-driven config). | ~2947–2972, early exit ~2979–2980. |
| 7 | **`renderOptions(items)`** — builds `<select>` from **`getDomainArtefactOptions`** results: filters by **`item.domainId`** vs **`visibleDomainId`**, then by **`allowSet`** id membership when **`allowSet`** is non-null. | ~2918–2946. |
| 8 | **Fallback when no WGC / no `getDomainArtefactOptions`** | **`renderOptions([])`** — empty list → placeholder only (~2981–2986). |
| 9 | **Placeholder label** | **`"Select starting point…"`** repeated in **`renderInputStrategyOptions`**, **`renderLearningDesignStartingPointOptions`**, **`renderOptions`** (~2841, ~2903–2904, ~2931–2932). |
| 10 | **`updateWorkflowFactoryInputsCopyFromStartingPoint`** | Label + hint + **`#wfDesignInputs`** **placeholder** depend on whether a starting artefact **value** is selected (~2800–2818; separate S13-03 surface but **coupled** to starting-point control). |
| 11 | **Persisted / brief usage of selected value** | **`startingArtefact`** read from **`#wfDesignStartingArtefact.value`** into **`buildWorkflowDesignBase`**, **`handleStartWorkflowDesign`**, **`handleSaveDesignedWorkflow`**; **`buildWorkflowDesignBrief`** emits **`Starting artefact: `** + effective id when present (~5343–5371, ~5663, ~13216–13395). |
| 12 | **Heuristic consumption of starting artefact (design pipeline)** | **`applyWorkflowDesignHeuristics`** uses **`h.startingArtefact`** among other hints (~6224+). |

---

## 2. File / function references

| Unit | File | Approx. lines (`app.js` unless noted) |
|------|------|----------------------------------------|
| **`renderWorkflowFactoryStartingArtefactOptions`** (contains allowlist, **`getVisibleDomainId`**, **`getAllowSetForDomain`**, **`renderLearningDesignStartingPointOptions`**, **`renderOptions`**, **`renderFromBriefConfig`**, orchestration **`renderFromBriefConfig().then`**) | `app.js` | ~2821–2997 |
| **`updateWorkflowFactoryInputsCopyFromStartingPoint`** | `app.js` | ~2800–2818 |
| **`renderWorkflowFactoryDomainUiConfig`** (caller of starting-artefact render) | `app.js` | ~2757–2797 |
| **`getDomainArtefactOptions`** | `workflowGenerationContext.js` | ~714–749 |
| **`getWorkflowBriefConfig`** / **`normalizeWorkflowBriefConfig`** | `workflowGenerationContext.js` / `app.js` | WGC export; `app.js` **`renderFromBriefConfig`** ~2954–2957 |
| **`buildWorkflowDesignBrief`**, **`handleStartWorkflowDesign`**, **`handleSaveDesignedWorkflow`** | `app.js` | ~5336+, ~5656+, ~13192+ |
| **`applyWorkflowDesignHeuristics`** | `app.js` | ~6207+ |
| **DOM wiring** | `app.js` | **`wfDesignStartingArtefact`** `change` → **`updateWorkflowFactoryInputsCopyFromStartingPoint`** (~19071–19074) |

---

## 3. Display-only vs value / semantic vs prompt-facing

| Surface | Display-only | Value / semantic | Prompt-facing (downstream) |
|---------|--------------|------------------|----------------------------|
| **Option `textContent` / labels** (including LD trio English strings) | **Yes** — label strings are not persisted as the canonical value; **`value`** is. | **`opt.value`** determines **`startingArtefact`** field. | **Indirectly** — selected **value** flows into **`brief`** / generation after user runs design. |
| **Placeholder “Select starting point…”** | **Yes** | Empty **`value`** = no starting line in brief (unless resolved elsewhere). | N/A |
| **`STARTING_ARTEFACT_ALLOWLIST` membership** | **No** — filters which **ids** appear for **general** / structured non-LD path. | **Yes** — constrains author-visible **values** for **`getDomainArtefactOptions`** path. | **Yes** — allowed ids determine what can be chosen and thus what can reach **`briefLines`**. |
| **`renderLearningDesignStartingPointOptions` ids** | Labels only (display). | **Yes** — **three** ids are product semantics for LD path only. | **Yes** — when selected, enter **`Starting artefact:`** line and design heuristics. |
| **`renderInputStrategyOptions` from `input_strategy.choices`** | Labels from pack JSON. | **Yes** — choice **values** from **`workflowBriefConfig`**. | **Yes** — same as any brief-derived field. |
| **`getDomainArtefactOptions` items** | **`item.label`** from artefact markdown. | **`item.id`**, **`item.domainId`** drive filtering and **value**. | **Yes** — chosen id becomes part of brief context. |

---

## 4. Domain-pack-owned today vs `app.js`-owned

| Component | Owner today |
|-----------|-------------|
| **Artefact catalog entries** (ids, labels, `domainId`) parsed from **`*artefacts*`** markdown paths per manifest | **Domain packs** + **`workflowGenerationContext.js`** **`getDomainArtefactOptions`** |
| **`input_strategy` factor `choices`** inside **`workflowBriefConfig`** | **Domain pack** JSON (via **`getWorkflowBriefConfig`**); rendered by **`renderInputStrategyOptions`** |
| **`STARTING_ARTEFACT_ALLOWLIST`** (ids for **`general`** and **`learning-design`** only) | **`app.js`** only — **not** in manifest |
| **LD trio (`generate_from_topic`, …)** — ids + labels | **`app.js`** only — **not** from **`getDomainArtefactOptions`** or **`input_strategy`** for LD branch |
| **Branch: “if visible domain is LD, always show trio”** | **`app.js`** policy |
| **Research** domain allowlist row | **Absent** — **`getAllowSetForDomain("research")`** → **`null`** → **no id-level allowlist filter** in **`renderOptions`** (domain tag filter still applies) |

---

## 5. Risks for drop-in domain-pack portability

1. **Split path by domain id:** **Learning Design** does **not** use the same option source as **General** / **Research** when the structured domain is LD — **pack-derived** lists are **skipped** in favour of **`app.js`** literals.
2. **Allowlist drift:** New artefact ids added only in **pack** markdown will **not** appear for **general** / **learning-design`** `getDomainArtefactOptions` path unless also added to **`STARTING_ARTEFACT_ALLOWLIST`** (when allowlist is non-null for that domain).
3. **Research gap:** No **`research`** allowlist row — behaviour differs (**allowSet` null`**) vs **general** / **LD** (filtered or bypassed).
4. **LD ids not in pack catalog:** The **trio** values may **not** exist in **`getDomainArtefactOptions`** output; they are **app-defined** contract for LD only.
5. **`renderFromBriefConfig` ordering:** If **`input_strategy`** choices exist for LD in a future pack change, current code **still** prefers **`renderLearningDesignStartingPointOptions`** when **`visibleDomainId === "learning-design"`** — brief-driven choices for LD starting point are **not** consulted on that branch today.
6. **Cross-surface coupling:** **`updateWorkflowFactoryInputsCopyFromStartingPoint`** ties **inputs** UI copy to starting-point **value** presence — portability edits to starting-point behaviour would need **regression** on that path.

---

## 6. Candidate future slices (audit-only labels — not approved work)

| Slice label | Meaning (descriptive) |
|-------------|------------------------|
| **Doc-only** | Record pack vs **`app.js`** split in user-facing docs / charter; **no** code movement. |
| **Strict parity refactor** | Any future change that preserves **exact** option sets and **values** per domain as today while moving **ownership** — would require **parity matrix**-style evidence per domain path (not started here). |
| **Manifest-owned config** | Hypothetical future: allowlist and/or LD trio declared in **manifest or pack JSON**, consumed by loader — would touch **governance** of manifest schema and **`app.js`** init. |
| **Deferred / unsafe** | Removing LD special-case **without** replacing **trio** semantics; changing **`startingArtefact`** ids **without** migration for saved workflows / **`briefLines`** extraction; editing packs under an S13 label **without** charter — **treated as unsafe** until separately governed. |

---

## 7. Required evidence before any implementation

- **Per-domain matrix** of option source: **brief `input_strategy`**, **`getDomainArtefactOptions`**, or **`renderLearningDesignStartingPointOptions`**, for **`["general"]`**, **`["general","learning-design"]`**, **`["general","research"]`**, including **empty** and **WGC missing** branches.
- **Inventory of saved workflows** / fixtures that store **`startingArtefact`** values tied to each path.
- **Trace** from **`#wfDesignStartingArtefact.value`** → **`buildWorkflowDesignBrief`** → **`buildWorkflowGenerationContext`** for each representative value (including LD trio ids).
- **Pack diff policy** if any id is **moved** from **`app.js`** to manifest — **import/export** and **normalisation** (`normalizeWorkflowForV1`) implications must be named in charter (this audit does **not** execute that trace).

---

## 8. Explicitly deferred items

- **S13-02** default-domain **policy** implementation (see **`sprint-13-s13-02-decision-framing-audit.md`** / **`sprint-13-s13-02-decision-options-note.md`**) — intersects **`visibleDomainId`** but **not** resolved here.
- **S13-03** display-only hint neutralisation implementation — separate gate (**`sprint-13-s13-03-decision-gate-note.md`**).
- **S13-01** follow-on beyond delivered **`#wfDesignDomainSelect`** slice.
- **Semantic prompt**, **`briefLines`**, extraction regex, persistence schema, orchestration redesign — unless **separately** chartered.
- **Sprint 12** — **not** reopened by this audit.

---

## 9. Confirmation that no implementation was done

This file is an **audit note** only. **No** repository implementation was performed to produce it.

---

## Review log

- **2026-05-13** — Starting artefact / Learning Design starting-point portability audit drafted (`sprint-13-starting-artefact-ld-starting-point-portability-audit.md`).
