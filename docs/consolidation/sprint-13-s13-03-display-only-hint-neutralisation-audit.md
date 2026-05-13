# Sprint 13 — S13-03 prep: display-only hint neutralisation audit (read-only)

**Date:** 2026-05-13  
**Scope:** Determine whether **Learning Design–specific** (and related **domain-selected**) **UI hint / helper / placeholder / label** strings in **`app.js`** are **display-only** and **non–prompt-facing** along the **DOM → brief → model** paths audited below.

**Explicit statement — no implementation was done:** This note is **audit documentation only**. **No** production code, domain packs, prompts, persistence, import/export, or orchestration logic was modified for this prep task.

**Out of scope for this audit:** S13-02 default-domain work; Sprint 12 reopening; any claim of **full drop-in portability**; Prompt Studio–specific flows beyond shared `app.js` wiring where not touched by the listed functions.

---

## 1. Inventory of candidate hint strings (and related copy)

### A. `renderWorkflowFactoryDomainUiHints` — default / pack-driven strings

When `hints` is built from `cfg.uiHints` (see §3), each key below falls back to the **literal** in the third column if missing. All are written only to **helper `<p>`** elements (or **`placeholder`** on `#wfDesignScale`) via **`textContent`** / **`placeholder`**.

| Key / target | DOM target | Default literal (when `hints.*` absent) |
|--------------|------------|-------------------------------------------|
| `scope_scale` | `#wfDesignScaleHint` | `e.g. single task, short session, multi-step design, or programme` |
| `design_intent` | `#wfDesignIntentHint` | `State the primary design intent in one line.` |
| `audience` | `#wfDesignAudienceHint` | `Primary target users or learners.` |
| `scope_scale_placeholder` | `#wfDesignScale` | `e.g. 30 mins, 1 day, 1 week, ongoing` |
| `inputs` | `#wfDesignInputsHint` | `Describe source materials or inputs available at the start (runtime artefacts, not workflow mechanics).` |
| `desired_outputs` | `#wfDesignDesiredOutputsHint` | `What the learner-facing page should contain, plus supporting artefacts this design run should produce (orchestrated through the workflow below).` |
| `constraints` | `#wfDesignConstraintsHint` | `Hard requirements: time, tools, policy, accessibility, venue/channel-style delivery conditions. Describe learner pace or grouping in plain language if it matters—there is no separate sequencing editor.` |

### B. `renderWorkflowFactoryDomainUiHints` — **Learning Design–specific `app.js` overrides**

When **`getSelectedWorkflowDomains()`** contains **`"learning-design"`**, **after** the generic assignments above, **`app.js`** overwrites only these two hints:

| DOM target | LD-only string (exact) |
|------------|-------------------------|
| `#wfDesignDesiredOutputsHint` | `Primary learner-facing page and supporting artefacts (activities, assessment on the page, facilitator materials, etc.).` |
| `#wfDesignConstraintsHint` | `Hard constraints: timing, policy, tools, accessibility, venue/channel delivery conditions. Say pace or grouping in plain language if needed—no separate sequencing editor.` |

### C. `updateWorkflowFactoryInputsCopyFromStartingPoint`

Not keyed by **“learning-design”** string, but runs from **`renderWorkflowFactoryDomainUiConfig`** success path and when the starting-artefact `<select>` changes — **copy that co-varies with domain-driven starting-point UI**.

| DOM target | Branch | String |
|------------|--------|--------|
| `#wfDesignInputsLabel` | no starting artefact selected | `Source material / inputs` |
| `#wfDesignInputsLabel` | starting artefact selected | `Input details (optional)` |
| `#wfDesignInputsHint` | no selection | `Describe source materials or inputs available at the start (runtime artefacts, not workflow mechanics).` |
| `#wfDesignInputsHint` | selection | `Describe or provide the selected starting point.` |
| `#wfDesignInputs` | no selection | placeholder `e.g. PDF, notes, transcript, list of topics...` |
| `#wfDesignInputs` | selection | placeholder `e.g. paste or describe the selected starting point, or note where it comes from` |

### D. `renderWorkflowFactoryStartingArtefactOptions` — Learning Design **trio** labels

When **`getVisibleDomainId()`** is **`learning-design`**, **`renderLearningDesignStartingPointOptions`** builds three `<option>` rows (plus placeholder):

| Option `value` | Visible label (`textContent`) |
|----------------|--------------------------------|
| *(empty)* | `Select starting point…` |
| `generate_from_topic` | `Generate from topic` |
| `provided_source_content` | `Use existing source content` |
| `mixed` | `Both source content and generated content` |

Other domains use **`getDomainArtefactOptions`** / **`renderOptions`** with **`item.label`** from context — labels are **data-driven**; this path is the main **hardcoded LD label** set besides §1.B.

### E. `renderWorkflowDetailDomainUiHints` — **My Workflows** detail hints

**`defaults`** literals (used when `hints` from `getWorkflowBriefConfig` lacks a key):

| Key | Default literal |
|-----|-----------------|
| goal / `design_intent` | `What the saved workflow should achieve for the learner-facing run (workflows orchestrate generation; they are not the primary learner artefact).` |
| audience | `Primary end users or learners for the learner-facing output.` |
| constraints | `Non-negotiables such as policy, compliance, style, or venue/channel delivery constraints (plain language; not a sequencing engine).` |
| inputs | `Source materials this workflow expects at run time (artefacts passed into steps).` |
| desired_outputs | `Comma-separated artefact names this workflow should produce for the learner-facing run.` |

**Fixed** (not from `hints`):

| DOM | String |
|-----|--------|
| `#workflowNameHint` | `A clear internal name for this saved workflow.` |

**Call sites:** `populateWorkflowDetail` passes **`selectedDomains`** into **`renderWorkflowDetailDomainUiHints`** (`app.js` ~10579 when clearing, ~10611 when editing a workflow).

### F. `index.html` — static Factory copy (not updated by these functions)

`#wfDesignNameHint`, static paragraph under **Domain** `<select>`, **`#wfBriefResolvedDetails`** helper text, and several **`placeholder`** attributes on Factory inputs are **static HTML**. They are **not** rewritten by **`renderWorkflowFactoryDomainUiHints`**. **`#wfDesignStartingArtefactHint`** is bound on **`els`** but **no assignment** to it appears in **`app.js`** (grep single definition line). Listed for completeness so S13-03 scope does not assume parity with dynamic hints.

---

## 2. File / function locations

| Unit | File | Approx. lines (current `app.js`) |
|------|------|----------------------------------|
| **`renderWorkflowFactoryDomainUiHints`** | `app.js` | ~2605–2658 |
| **`renderWorkflowFactoryDomainUiConfig`** (loads `cfg.uiHints`, calls hints renderer) | `app.js` | ~2757–2797 |
| **`updateWorkflowFactoryInputsCopyFromStartingPoint`** | `app.js` | ~2800–2818 |
| **`renderWorkflowFactoryStartingArtefactOptions`** (+ nested **`renderLearningDesignStartingPointOptions`**, **`renderOptions`**, allowlists) | `app.js` | ~2821–2997 |
| **`renderWorkflowDetailDomainUiHints`** | `app.js` | ~2999–3048 |
| **`handleWorkflowDomainSelectionChange`** (clears hints then reloads config) | `app.js` | ~3051–3066 |
| **`handleStartWorkflowDesign`** (reads **input `.value`**, not hint nodes) | `app.js` | ~5656–5748 |
| **`buildWorkflowDesignBrief`** (`briefLines` / **`brief`**) | `app.js` | ~5336–5382 |
| **`continueWorkflowDesignGeneration`** (passes **`brief`** into **`buildWorkflowGenerationContext`**) | `app.js` | ~5385+ |
| Domain **`workflowBriefConfig`** / **`uiHints`** source | `domains/*/domain-*-step-patterns.md` (JSON blocks) | (pack files; not modified) |

---

## 3. Classification: display-only vs prompt-facing vs persisted vs exported vs unknown

**Legend**

- **Display-only:** String is applied only to **non-input** helper nodes, **`placeholder`**, or **`<option>` label text**; **no** read-back into **`briefLines`** in the audited paths.
- **Prompt-facing:** String (or its semantic twin) can appear in **`brief`**, **`briefLines`**, **`promptContext`**, or model payloads **as audited**.
- **Persisted / exported:** String itself or an unavoidable mirror is stored in saved workflow / bundle **as audited**.

| # | Item | Classification | Evidence trail |
|---|------|----------------|----------------|
| 1 | §1.A defaults + pack-driven `hints.*` in **`renderWorkflowFactoryDomainUiHints`** | **Display-only** | Only **`textContent`** on **`#wfDesign*Hint`** and **`placeholder`** on **`#wfDesignScale`** (`app.js` ~2610–2646). **`handleStartWorkflowDesign`** builds **`base`** from **`els.wfDesign*.value`** (e.g. ~5658–5666), **not** from hint nodes. **`buildWorkflowDesignBrief`** (~5364–5376) uses **`base`** fields only. |
| 2 | §1.B LD **`app.js` overrides** (`#wfDesignDesiredOutputsHint`, `#wfDesignConstraintsHint`) | **Display-only** | Same as row 1: overrides are **only** **`textContent`** (~2649–2656). No consumer reads these nodes into **`brief`**. |
| 3 | §1.C **`updateWorkflowFactoryInputsCopyFromStartingPoint`** | **Display-only** | **`textContent`** on label + hint; **`placeholder`** on **`#wfDesignInputs`** (~2806–2818). **`handleStartWorkflowDesign`** reads **`els.wfDesignInputs.value`** only (~5662). |
| 4 | §1.D LD starting-point **option labels** | **Display-only** (labels); **values** are product data | **`opt.textContent = row.label`** (~2907–2909). **`handleStartWorkflowDesign`** persists **`startingArtefact`** from **`<select>.value`** (ids), not label text (~5663–5665, ~5743). **`briefLines`** uses **`Starting artefact: ` + effectiveStartingArtefact** (~5370) — **value id**, not label. |
| 5 | §1.E **`renderWorkflowDetailDomainUiHints`** defaults + `hints` | **Display-only** | **`apply`** sets **`textContent`** on **`#workflow*Hint`** only (~3010–3028). Workflow persistence uses goal/audience/etc. from **detail inputs**, not these hint nodes (separate fields; not re-audited line-by-line here — no grep hit tying **`workflowGoalHint.textContent`** into **`buildWorkflowBundle`**). |
| 6 | **`state.workflowDomainUiConfig`** | **Unknown for “never mirrored”** beyond **unused read** | Assigned from **`getWorkflowBriefConfig`** result (`app.js` ~2779). **Grep** shows **no other reads** of **`state.workflowDomainUiConfig`** in **`app.js`** — suggests **not** used for export; **not** proof against future use. |
| 7 | **Same prose inside domain markdown** (including JSON **`uiHints`**) | **Prompt-facing (parallel channel)** | **`buildWorkflowGenerationContext`** loads **domain file bodies** into **`promptContext`** (documented in `docs/consolidation/sprint-10-contract-audit.md` — markdown **permeability**). Changing **only** what **`renderWorkflowFactoryDomainUiHints`** paints on the DOM **does not remove** that text from loaded files. **Not** “unknown” for model visibility of **pack-originated** copy — **out of scope for “neutralise in app.js only”** unless packs or loaders change. |

---

## 4. Evidence trail (summary diagram)

**Factory → design run (audited path)**

1. **`renderWorkflowFactoryDomainUiConfig`** → **`getWorkflowBriefConfig`** → `cfg.uiHints` → **`renderWorkflowFactoryDomainUiHints(hints)`** → DOM hint nodes.
2. User fills **`#wfDesignIntent`**, **`#wfDesignDesiredOutputs`**, etc. (**`.value`**).
3. **`handleStartWorkflowDesign`** → **`buildWorkflowDesignBase`** (field values + extras) → **`buildWorkflowDesignBrief`** → **`brief` / `briefLines`** (`app.js` ~5336–5381).
4. **`continueWorkflowDesignGeneration`** → **`buildWorkflowGenerationContext({ brief })`** — **`brief`** is built from **step 2 values**, **not** from hint **`textContent`**.

**Separate channel (not neutralised by DOM-only edits)**

- Domain markdown (including embedded **`workflowBriefConfig` / `uiHints` JSON**) is still loaded for **WGC** assembly; same English prose may appear in **model context** via files, independent of what is shown in helper `<p>` nodes.

---

## 5. Risks

1. **Dual source of truth:** Author sees **`app.js`** LD overrides on the Factory hints, while **`briefLines`** still use fixed prefixes (`Task / design intent:`, `Desired outputs:`, etc.) from **`buildWorkflowDesignBrief`** — terminology can **diverge** from on-screen hints (already noted in Sprint 09 / Sprint 10 consolidation).
2. **Markdown permeability:** Neutralising **only** `app.js` DOM strings **does not** remove equivalent strings from **domain-pack files** loaded into **`promptContext`**.
3. **`state.workflowDomainUiConfig`:** Written but **never read** elsewhere in **`app.js` today** — low risk of accidental persistence today; still a **footgun** if a future feature serialises full **`config`**.
4. **Starting-point labels vs values:** Safe to treat **labels** as display-only; **values** (`generate_from_topic`, …) affect **`briefLines`** and saved workflows — S13-03 must not conflate **label copy** with **value / allowlist** semantics.
5. **Static `index.html` helpers:** Unchanged by **`renderWorkflowFactoryDomainUiHints`** — any “neutralisation” story must account for **HTML defaults** vs **JS overrides**.

---

## 6. Recommendation (for future S13-03 — not approved here)

| Bucket | Items | Recommendation |
|--------|--------|----------------|
| **Safe candidate (future S13-03)** | §1.B LD **`textContent` overrides** on **`#wfDesignDesiredOutputsHint`** / **`#wfDesignConstraintsHint`**; §1.A **default literals** that mirror display-only paths; §1.C copy; §1.D **option label** strings (not values); §1.E detail **`defaults`** + fixed **`workflowNameHint`** | **Safe candidate** **for a charter that limits work to DOM helper / label / placeholder copy** in **`app.js`**, with acceptance tests = **grep / regression** ensuring **`buildWorkflowDesignBrief`**, **`extractWorkflowBriefExplicitFactors`**, and **export shapes** are **unchanged**. |
| **Decision-gated / needs more proof** | Any change that **alters** **`briefLines` prefixes**, **factor ids**, **starting artefact values**, or **domain markdown** “to match” hints | **Decision-gated** — crosses into **prompt-facing** or **pack** work (explicitly out of narrow S13-03 display-only definition). |
| **Out of scope for “display-only in `app.js`”** | Removing duplicate phrasing from **model-visible** domain files while leaving DOM unchanged | **Out of scope** for an **`app.js`-only** S13-03 slice; belongs to **pack / contract** passes. |

---

## 7. Explicit statement — no implementation was done

This audit was **documentation only**. **No** edits were made to **`app.js`**, **`workflowGenerationContext.js`**, **`index.html`**, domain packs, prompts, persistence, import/export, orchestration, or Sprint 12 artefacts for this task.

---

## Review log

- **2026-05-13** — S13-03 prep audit drafted: candidate strings inventoried; DOM vs **`briefLines`** / WGC paths traced; risks and gated recommendations recorded.
