# Sprint 13 — S13-03 implementation review and bounded implementation proposal

**Date:** 2026-05-13  
**Path:** `docs/consolidation/sprint-13-s13-03-implementation-review-bounded-proposal.md`

**Role:** Define the **narrowest** plausible **DOM-only** hint-neutralisation slice that **preserves prompt/model behaviour and orchestration semantics**, per **`sprint-13-s13-03-display-only-hint-neutralisation-audit.md`** and **`sprint-13-s13-03-decision-gate-note.md`**, aligned with **`sprint-13-portability-boundary-summary.md`** and **`sprint-13-portability-strategy-synthesis.md`**.

**No implementation:** This document **does not** authorise code edits, pack edits, or prompt changes. It is a **pre-implementation** review and **scope boundary** only.

**No portability completion claim.** **Sprint 12** remains **closed** and is **not** reopened here.

---

## 1. Candidate implementation surface

| Boundary | Content |
|----------|---------|
| **In scope (only)** | **`renderWorkflowFactoryDomainUiHints`** in **`app.js`** — the contiguous block that assigns **`textContent`** to Factory helper nodes and **`placeholder`** on **`#wfDesignScale`** from **`hints.*`** fallbacks and the **`learning-design`** branch. |
| **Mechanism** | String literal changes and/or **centralisation of the same literals** inside this function (e.g. local `const` / `var` defaults object) **without** changing function signature, call sites, or consumers of **`uiHints`** beyond existing **`String(hints.key \|\| default)`** pattern. |
| **Call chain (read-only context)** | Callers such as **`renderWorkflowFactoryDomainUiConfig`** remain **unchanged** in this proposal slice; they continue to pass **`hints`** derived from pack config. **No** edits to **`getWorkflowBriefConfig`** or **`workflowGenerationContext.js`**. |

**Rationale for narrowness:** The S13-03 audit bundles other DOM paths (**`updateWorkflowFactoryInputsCopyFromStartingPoint`**, **`renderWorkflowFactoryStartingArtefactOptions`**, **`renderWorkflowDetailDomainUiHints`**) as related copy; this proposal **intentionally defers** them so the first implementation slice touches **one function** and **one proven trace class** (Factory helper `<p>` + one **`placeholder`**, plus optional removal/reword of the **LD-only override branch** inside the same function).

---

## 2. Exact strings / DOM targets potentially eligible

All targets are written **only** via **`textContent`** or **`placeholder`** inside **`renderWorkflowFactoryDomainUiHints`** (`app.js` ~2605–2658).

| DOM target (`els.*`) | Property | Source | Default / override literal (exact responsibility in this function) |
|----------------------|----------|--------|----------------------------------------------------------------------|
| **`wfDesignIntentHint`** | `textContent` | `hints.design_intent` fallback | `State the primary design intent in one line.` |
| **`wfDesignAudienceHint`** | `textContent` | `hints.audience` fallback | `Primary target users or learners.` |
| **`wfDesignScaleHint`** | `textContent` | `hints.scope_scale` fallback | `e.g. single task, short session, multi-step design, or programme` |
| **`wfDesignScale`** | `placeholder` | `hints.scope_scale_placeholder` fallback | `e.g. 30 mins, 1 day, 1 week, ongoing` |
| **`wfDesignInputsHint`** | `textContent` | `hints.inputs` fallback | `Describe source materials or inputs available at the start (runtime artefacts, not workflow mechanics).` |
| **`wfDesignDesiredOutputsHint`** | `textContent` | `hints.desired_outputs` fallback, then possible **LD branch overwrite** | Default: `What the learner-facing page should contain, plus supporting artefacts this design run should produce (orchestrated through the workflow below).` — **LD overwrite:** `Primary learner-facing page and supporting artefacts (activities, assessment on the page, facilitator materials, etc.).` |
| **`wfDesignConstraintsHint`** | `textContent` | `hints.constraints` fallback, then possible **LD branch overwrite** | Default: `Hard requirements: time, tools, policy, accessibility, venue/channel-style delivery conditions. Describe learner pace or grouping in plain language if it matters—there is no separate sequencing editor.` — **LD overwrite:** `Hard constraints: timing, policy, tools, accessibility, venue/channel delivery conditions. Say pace or grouping in plain language if needed—no separate sequencing editor.` |

**Not in this function (explicitly out of this slice):** **`#wfDesignNameHint`** (if present in DOM), **`#wfDesignStartingArtefactHint`**, and other Factory static copy in **`index.html`** — see audit §1.F.

---

## 3. Evidence that each candidate is display-only

| Claim | Evidence (from S13-03 audit + code trace) |
|-------|---------------------------------------------|
| **Helper nodes are not read into `brief` / `briefLines`** | **`handleStartWorkflowDesign`** builds **`base`** from **`els.wfDesignName`**, **`els.wfDesignIntent`**, **`els.wfDesignAudience`**, **`els.wfDesignScale`**, **`els.wfDesignInputs`**, **`els.wfDesignStartingArtefact`**, **`els.wfDesignDesiredOutputs`**, **`els.wfDesignScopeConstraints`** **`.value`** (`app.js` ~5656–5666, ~5700) — **not** from **`wfDesign*Hint`** nodes. |
| **`buildWorkflowDesignBrief`** uses **`base`**, not hint DOM | **`briefLines`** are built from **`base`** fields and **`resolvedState`** (`app.js` ~5336–5376); **no** reference to **`wfDesignDesiredOutputsHint`** etc. |
| **Generation context uses `brief` string** | **`continueWorkflowDesignGeneration`** passes **`brief`** into **`buildWorkflowGenerationContext({ brief })`** (`app.js` ~5398–5403) — sourced from **`buildWorkflowDesignBrief`**, not from hint **`textContent`**. |
| **LD branch is still display-only** | The **`learning-design`** branch **only** assigns **`textContent`** on **`#wfDesignDesiredOutputsHint`** and **`#wfDesignConstraintsHint`** (~2649–2656); it does **not** mutate **`selectedDomains`**, factors, or **`startingArtefact`**. |

**Sign-off burden:** Implementers repeat the **§5 trace** in the decision gate note (static or scripted) after any edit to confirm **no new** read path from these nodes into **`brief`**, persistence, or export.

---

## 4. Remaining ambiguity / risk

| Risk | Notes |
|------|--------|
| **Dual channel (unchanged)** | Rewording DOM defaults **does not** change **model-visible** duplicate prose in **pack markdown** / JSON loaded by WGC — decision gate §2.B; boundary summary **display vs prompt-facing** lens. |
| **Terminology drift vs `briefLines`** | **`briefLines`** prefixes remain **`app.js`-owned** and **fixed**; helper copy can still **diverge** from what the model sees in the user-typed brief — pre-existing risk; this slice **must not** “fix” that by touching **`buildWorkflowDesignBrief`**. |
| **LD branch is still a domain-id special case** | **`getSelectedWorkflowDomains().indexOf("learning-design")`** remains **domain-specific orchestration in UI copy**; neutralising **wording** without removing the branch is still a **policy** choice (neutral vs LD-specific). Removing the branch so LD uses pack **`uiHints` only** changes **UX** when pack omits keys (fallback behaviour) — needs **product** agreement, not just engineering. |
| **When pack supplies `uiHints`** | Changing **`app.js`** defaults **does not** change displayed text for sessions where **`hints.*`** is populated from pack — impact is limited to **fallback** and **LD overwrite** paths. |
| **`state.workflowDomainUiConfig`** | Audit flags **unknown long-term** use; this slice does **not** touch that assignment in **`renderWorkflowFactoryDomainUiConfig`**. |

---

## 5. Proposed stop conditions

Implementation **must halt** and return to the **S13-03 decision gate** if any of the following would be required to land the change:

- Edits outside **`renderWorkflowFactoryDomainUiHints`** (including **`updateWorkflowFactoryInputsCopyFromStartingPoint`**, **`renderWorkflowFactoryStartingArtefactOptions`**, **`renderWorkflowDetailDomainUiHints`**, **`handleWorkflowDomainSelectionChange`**, **`buildWorkflowDesignBase` / `buildWorkflowDesignBrief`**, **`continueWorkflowDesignGeneration`**).
- Any change to **domain packs**, **`uiHints`** JSON in repo, **`workflowGenerationContext.js`**, prompts, persistence, import/export, or **orchestration** logic.
- Any change to **`<option>` `value`s**, starting-artefact **allowlists**, **factor ids**, or **regex extraction** “to align copy.”
- **Trace proof failure:** a reviewer cannot show that hint nodes are **not** read into **`brief`** / **`briefLines`** / saved workflow fields **after** the edit.

---

## 6. Suggested verification matrix

| Row | Scenario | Expected |
|-----|----------|----------|
| A | **General-only** selection, **`getWorkflowBriefConfig`** returns **no** config (catch path) | Hints render from **`app.js`** defaults inside **`renderWorkflowFactoryDomainUiHints`**; **`handleStartWorkflowDesign`** still succeeds; **`brief`** unchanged vs baseline for same **typed** inputs (diff or golden capture). |
| B | **Learning-design** selected, pack provides **`uiHints`** for outputs/constraints | Pack strings appear on DOM; **if** LD branch remains, behaviour matches **chartered** choice (either overwrite still runs after pack apply, or branch removed per product decision). |
| C | **Learning-design** selected, pack omits **`desired_outputs` / `constraints`** keys | Fallback + LD branch path exercised; confirm **no** change to **`startingArtefact`** **`<select>`** **values** or **`brief`** from hint nodes. |
| D | **Static trace** | **`grep` / search** confirms **`buildWorkflowDesignBrief`**, **`extractWorkflowBriefExplicitFactors`**, **`buildWorkflowGenerationContext`**, **`persistSelectedDomains`**, **`saveWorkflows`** / export builders have **no** new references to **`wfDesignIntentHint`**, **`wfDesignDesiredOutputsHint`**, **`wfDesignConstraintsHint`**, **`wfDesignScaleHint`**, **`wfDesignAudienceHint`**, **`wfDesignInputsHint`**. |
| E | **Automated tests** | Existing **`node --test tests/*.test.js`** (or project-standard suite) **green**; any **new** test is **optional** and must stay **DOM/copy** scoped if added later under charter. |

---

## 7. Explicit exclusions (this proposal slice)

**Excluded by charter (must not be bundled into “S13-03 slice 1”):**

- **Domain-pack markdown** and **`uiHints`** JSON files.
- **`buildWorkflowDesignBrief`**, **`briefLines`**, **`buildWorkflowDesignBase`**, **`extractWorkflowBriefExplicitFactors`**.
- **`workflowGenerationContext.js`** (loaders, **`buildWorkflowGenerationContext`**, **`buildPromptRefinementContext`**).
- **Prompt Studio** surfaces and refinement orchestration.
- **Persistence / import / export** and **`normalizeWorkflowForV1`**.
- **Orchestration** (elicitation, post-gen queues, **`continueWorkflowDesignGeneration`** logic beyond unchanged call).
- **Title-based heuristics** and **starting-artefact** logic (including **`updateWorkflowFactoryInputsCopyFromStartingPoint`** and **`renderWorkflowFactoryStartingArtefactOptions`** — **deferred** to a **separate** S13-03 follow-on or other sprint if ever chartered).
- **`renderWorkflowDetailDomainUiHints`** (My Workflows detail hints) — **deferred**; not the same DOM surface as Factory **`#wfDesign*Hint`**.

---

## 8. Recommendation on whether implementation should proceed

| Assessment | Detail |
|------------|--------|
| **Technical eligibility** | The **single-function** surface **`renderWorkflowFactoryDomainUiHints`** is **consistent** with the S13-03 audit’s **display-only** classification for §1.A defaults and §1.B LD overrides, **provided** trace proof in §6 rows **D–E** is executed **after** any edit. |
| **Governance** | **`sprint-13-s13-03-decision-gate-note.md`** §7: implementation is **not** authorised by default; **written** scope approval and §5–§6 evidence are **prerequisites**. |
| **Recommendation** | **Do not implement yet.** **If** a product owner approves a **written charter** limited to **§1** surface and **§5–§7** exclusions, **then** a **minimal** **`app.js`** copy pass **may** proceed as **S13-03 slice 1** — still **without** claiming prompt neutralisation (channel **B** unchanged). **Otherwise** keep **decision-gated** and defer. |

**Post-closure (2026-05-13):** The **bounded DOM-only slice** in **§1** was **implemented** and closed in [`sprint-13-s13-03-dom-only-hint-neutralisation-closure.md`](sprint-13-s13-03-dom-only-hint-neutralisation-closure.md). The table above remains the **pre-execution** eligibility and governance record.

This is a **proceed-only-with-explicit-charter** posture, not a green light to merge copy changes ad hoc.

---

## Related artefacts

| Document | Role |
|----------|------|
| [`sprint-13-s13-03-display-only-hint-neutralisation-audit.md`](sprint-13-s13-03-display-only-hint-neutralisation-audit.md) | Evidence inventory and trace |
| [`sprint-13-s13-03-decision-gate-note.md`](sprint-13-s13-03-decision-gate-note.md) | Governance and stop conditions |
| [`sprint-13-portability-boundary-summary.md`](sprint-13-portability-boundary-summary.md) | Category separation |
| [`sprint-13-portability-strategy-synthesis.md`](sprint-13-portability-strategy-synthesis.md) | Tractable vs coupled framing |

---

## Review log

- **2026-05-13** — S13-03 implementation review and bounded proposal drafted (`sprint-13-s13-03-implementation-review-bounded-proposal.md`).
- **2026-05-13** — Bounded slice implemented (`app.js`); closure: [`sprint-13-s13-03-dom-only-hint-neutralisation-closure.md`](sprint-13-s13-03-dom-only-hint-neutralisation-closure.md).
