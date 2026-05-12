# Sprint 09 — Workflow Brief Semantics Alignment (Pass 1)

**Working title:** Sprint 09 — Workflow Brief Semantics Alignment — Pass 1 (bounded implementation)

## Purpose

Sprint 09 is a **narrow semantics-alignment implementation sprint**: align **user-facing** Workflow Factory wording, help text, and **lightweight** brief-field labelling with the **learner-facing page** and **page composition** vocabulary established in **Sprint 08 planning**—**without** treating this sprint as an **architectural redesign**, **generator rewrite**, or **broad brief-field restructuring**.

Sprint 09 is explicitly **not** an architectural redesign sprint. It is the **first bounded implementation** pass after **Sprint 07 review** and **Sprint 08 planning semantics alignment**, scoped to **pass 1** (copy, labels, clarification) only where blast radius stays low.

## Inputs

| Input | Location / role |
|--------|-----------------|
| **Sprint 07 review findings** | `docs/consolidation/sprint-07-workflow-generation-rationalisation-review.md` — learner-facing page model, planning lifecycle, pedagogic dimensions, sequencing, open questions, stable behaviours called out as strengths |
| **Sprint 08 planning / consolidation artefacts** | `docs/consolidation/sprint-08-workflow-planning-and-brief-semantics-alignment.md` — field/factor audit, planning-factor classification, pre/post-synthesis boundary, **assessment planning** note, **sequencing semantics** / **learner interaction / progression mode** note, backlog separation |
| **Sprint 08 implementation candidate extraction** | Same Sprint 08 doc — **Potential follow-on implementation candidates (not approved)**; Sprint 09 **charters** a **subset** aligned to **Workflow Factory terminology alignment** and related **semantics-first** surfacing only |

Governance separation remains: **review** (Sprint 07) → **planning** (Sprint 08) → **bounded implementation** (Sprint 09). Sprint 08 tables are **not** automatic build approval; Sprint 09 **this charter** bounds what may change in code.

## Candidate implementation scope (bounded)

Only **small**, **review-led**, **compatibility-preserving** candidates belong in Sprint 09 pass 1, for example:

- **Terminology alignment for desired outputs** — labels, hints, and static copy toward **page composition** / **learner-facing page** language where **no** save-key or generator contract change is required
- **Clarification copy for delivery context** — help text and tooltips that **disambiguate** legacy “delivery” wording from **learner interaction / progression** intent (**terminology rename** or **field repurposing** stays out unless a row in the audit proves **no** behavioural or persistence impact)
- **Learner-facing wording alignment** — Workflow Factory and adjacent UI strings consistent with **shared vocabulary** and Sprint 08 lifecycle terms (where user-visible only)
- **Help-text cleanup** — remove or soften **workflow-topology** leakage in author-facing surfaces (wording only)
- **Narrow brief-field semantic clarification** — inline descriptions / placeholders that clarify meaning **without** changing stored semantics, elicitation transcripts, or generation prompts (**prompt-body changes** are **out** unless explicitly listed and reviewed as copy-only with **no** output drift)
- **Reduction of workflow terminology leakage** — prefer **learner-facing page** composition language over “steps/graph” framing in **UI/help** only

Anything requiring **schema**, **save-format**, **generator prompt contract**, **domain-pack**, **renderer**, or **execution path** change is **out of charter** for pass 1 unless escalated as a **separate** explicitly approved micro-task after audit sign-off.

## Explicit non-goals

- **No generator rewrite** (including wholesale prompt / template restructure)
- **No workflow-engine redesign** and **no sequencing engine**
- **No renderer redesign**
- **No domain-pack rewrite**
- **No broad brief-field restructuring** (no new mandatory fields, no field merge/split in persistence)
- **No hidden behavioural changes** — runtime and generation behaviour **preserved** unless a change is **documented**, **reviewed**, and **classified** as intentionally in scope (default: **out of scope**)
- **No major `app.js` restructuring**
- **No assessment-system redesign** (no new assessment product surface; no elicitation flow rewrite in this sprint)

## Explicit boundaries (preserve)

Sprint 09 must **preserve** on delivery:

- **Compact workflows** — do not add authoring burden or new mandatory configuration paths
- **Lightweight elicitation** — no new heavyweight wizards tied to this pass
- **Artefact chaining** — no changes to chaining contracts or step dependency semantics in this pass
- **Learner-facing coherence** — wording aligns with the **learner-facing page** model; no learner-surface redesign required
- **Emergent pedagogic sequencing behaviour** — no new granular sequencing controls; **sequencing wording** in UI/help may clarify **defaults and intent** only, not introduce a sequencing product

## Risk posture

- **Behaviour-preserving where possible** — default assumption: **copy and static UI**; any exception requires an explicit audit row and review
- **Review-led** — the audit table below is the **gating** artefact before code edits
- **No silent semantic migrations** — no renaming of persisted keys, no “same label, different meaning” without changelog and audit entry
- **Avoid hidden coupling changes** — if a string is suspected to participate in export/import, tests, or generator-facing mirrors, **flag in audit** and defer or treat as **high risk**

## Recommended first task

Create and maintain a **small audit table** (expand rows as discovery proceeds):

| UI term / field | Current wording | Proposed wording | Behaviour impact risk | Requires code? | Notes |
|-----------------|-----------------|------------------|-------------------------|-----------------|-------|
| **Desired outputs** | **Factory (`index.html`):** label “Desired outputs (optional)”; hint “What the workflow should produce.”; placeholder “e.g. activities, sequence, assessment, slide deck, facilitator guide, handout”. **LD domain (`domain-learning-design-step-patterns.md` → `uiHints.desired_outputs`):** “Target artefacts (activities, sequence, assessment, facilitator materials).” **Deferred (not changed in pass 1):** brief/elicitation lines still use prefix `Desired outputs: ` in `app.js` (`briefLines`, `extractWorkflowBriefExplicitFactors`) — treated as **prompt-facing**. | Label/hint/placeholder + **LD-selected** hint override in `app.js` only: learner-facing page + supporting artefacts; drop “sequence” as a standalone placeholder token; **do not** change `Desired outputs:` brief prefixes. | **Low** for label/hint/placeholder and post-hint override; **High** if brief line prefixes or `desired_outputs` factor semantics change | Yes | Sprint 08: unstable “desired outputs” framing |
| **Delivery context** | **LD domain extra field:** label “Delivery context (optional)”; `helpText`: “Pedagogic delivery mode (how learners progress), not just platform/environment.” **Factory scope field (`wfDesignScopeConstraints` hint):** “Hard requirements: time, tools, policy, accessibility, delivery conditions.” | **Pass 1:** no label/`helpText` change in domain pack; clarify **scope** hint in `index.html` / app defaults that “delivery conditions” means venue/channel-style constraints, not a sequencing surface. | **Low** for scope/helper clarification; **High** for renaming factor, values, or mapping | Yes | Domain already carries interaction-aware help on the LD control |
| **Inputs / artefacts** | **Factory:** label “Source material / inputs” (or dynamic “Input details (optional)”); hint “Describe the source content or inputs available at the start.” / “Describe or provide the selected starting point.”; `app.js` default `hints.inputs`: “Source content or artefacts available at start.” **Workflows tab:** label “Workflow inputs / artefacts”; hint “Source materials this workflow expects at runtime.” | Wording toward **source materials** + **artefacts** without implying new runtime inputs; keep **dynamic** label logic intact | **Low** for copy; **Medium** if authors misread runtime contract | Yes | No binding/schema change |
| **Workflow** | Tab: “Create Workflow”; panel `aria-label` “Workflow factory”; card “Workflow basics”; intro helper: “Start by describing the workflow you want to design…” | Intro/helper: position **workflow as orchestration** for a **learner-facing page** primary artefact; keep control ids and tab ids | **Low** for helper/intro | Yes (HTML + optional `aria-label` casing only if desired) | Tab label left as-is (navigation stability) |
| **Workflow steps** | **Factory suggested card:** “When the assistant designs a workflow, its summary and steps will appear here.” **List:** `<ol id="wfDesignSteps">` (no static “steps” label beyond section “Suggested workflow”). | “…summary and **authoring steps**…” to reduce topology leakage | **Low** | Yes | No change to list behaviour |
| **Learner-facing page** | **Not** a standalone Factory label today; vocabulary appears in code comments / prompt hygiene strings elsewhere. | Introduce term in **Workflow basics** helper and desired-outputs hint (see above) | **Low** | Yes | Aligns to `shared-vocabulary` / Sprint 07–08 |
| **Learning activities** | **Starting point hint:** “…learning outcomes, activities, or assessment items.” | Optional clarification “**learning activities** on the learner-facing page” in hint only | **Low** | Yes | No taxonomy change |
| **Assessment** | Treated in starting-point hint and desired-outputs placeholder (“assessment”). **No** dedicated Factory field label in basics grid. | Hint/placeholder wording only: “assessment **on the page**” where natural | **Low** for copy; **High** for assessment elicitation/generation | Yes | No assessment engine work |
| **Sequencing wording** | Placeholder lists “sequence”; domain `desired_outputs` hint lists “sequence”; scale hint “multi-step **workflow**”. | Replace standalone “sequence” with neutral “activity flow” / plain-language note that order is **not** a separate sequencing editor; scale hint “multi-step **design**” | **Low** if only author-facing copy; **High** if implying new sequencing controls or changing generation | Yes | **Deferred:** any change to step-generation copy or `briefLines` sequencing semantics |

**Process:** complete **Current wording** from the live app and exports; **Proposed wording** must be reviewed against **shared vocabulary**; **Requires code?** is almost always **Yes** for Factory surfaces—**documentation-only** updates may occur in the same sprint pack but **do not substitute** for tracked UI decisions.

### Pass 1 risk classification (summary)

| Row | Pass 1 risk |
|-----|-------------|
| Desired outputs | **Low** for `index.html` + `app.js` hint/placeholder defaults + learning-design hint override (copy only). **High** deferred: `briefLines` / `extractWorkflowBriefExplicitFactors` prefixes still say `Desired outputs: `. |
| Delivery context | **Low** deferred for domain label (no domain-pack edits); scope-field hint clarified in HTML/app. LD `delivery_context` control already has `helpText` in domain JSON (unchanged). |
| Inputs / artefacts | **Low** (copy only). |
| Workflow | **Low** (intro helper + `aria-label` casing). |
| Workflow steps | **Low** (summary placeholder copy). |
| Learner-facing page | **Low** (introduced via copy). |
| Learning activities | **Low** (starting-point hint). |
| Assessment | **Low** (incidental wording in hints/placeholders). |
| Sequencing wording | **Low** for author-facing “no sequencing editor” disclaimers; **High** deferred for generation/runtime strings. |

## Pass 1 implementation log (2026-05-12)

**Changed (copy / UI only):**

- `index.html` — Workflow Factory basics intro; desired-outputs label, hint, placeholder; inputs, starting-point, scale, scope/constraint hints; suggested-workflow summary empty state; panel `aria-label` capitalisation; Workflows tab labels/hints/placeholders for goal, constraints, audience, artefacts, outputs (learner-facing run + orchestration framing).
- `app.js` — `renderWorkflowFactoryDomainUiHints` default fallbacks and learning-design hint overrides for desired-outputs and constraints hints; `updateWorkflowFactoryInputsCopyFromStartingPoint` inputs hint; scale default string; `handleStartWorkflowDesign` empty summary placeholder text aligned with HTML; `renderWorkflowDetailDomainUiHints` default hints when domain does not override (Workflows tab).

**Explicitly not changed (deferred):**

- `briefLines` and `extractWorkflowBriefExplicitFactors` string prefixes (`Desired outputs: `, etc.) — **prompt-facing**; treat as **high risk** for pass 1.
- Domain-pack files (including `uiHints.desired_outputs` text in `domain-learning-design-step-patterns.md`) — no edit; learning-design author hints overridden in `app.js` instead.
- `workflowGenerationContext.js`, generator templates, step pattern prompt bodies, save/import/export formats, persisted keys, renderer, assessment logic, sequencing engine — unchanged.

## Smoke check (lightweight, manual)

Environment: Node CLI was not available in the agent shell; **no** automated JS parse was run. Recommended manual checks:

- Load app, open Workflow Factory and Workflows tabs — verify strings render, no console errors.
- Load an existing saved workflow JSON — still parses and lists.
- Export / import round-trip — unchanged code paths for I/O.
- Start workflow design (with API key if used) — brief construction still uses same factor keys and `Desired outputs:` internal prefix.
- Run mode / step execution — untouched files logically; spot-check if time permits.

## Success criteria

Sprint 09 pass 1 succeeds if:

- Audit table is **substantively filled** for Factory-visible rows and **risk-rated** before risky merges
- **User-visible** terminology and help text **better match** Sprint 08 planning language where chartered, **without** violating non-goals
- **No** unintended generation, runtime, renderer, or domain-pack **behaviour** regressions (smoke per `development-protocol` / team practice)
- **Explicit preservation** of compact workflows, lightweight elicitation, artefact chaining, learner-facing coherence, and emergent sequencing posture

## Related references

- `docs/consolidation/sprint-08-workflow-planning-and-brief-semantics-alignment.md`
- `docs/consolidation/sprint-07-workflow-generation-rationalisation-review.md`
- `docs/development/shared-vocabulary.md`
- `docs/development/development-protocol.md`
- `docs/workflow/workflow-spec.md`, `docs/workflow/workflow-authoring.md`

## Review log

- **2026-05-12** — **Sprint 09 opened:** charter recorded; portable pack `docs/development/sprints/2026-05-12-sprint-09-workflow-brief-semantics-alignment-pass-1/` created; **first task** = seed and fill **UI term / field audit table** (this doc). **No implementation commits** required solely by opening this sprint—implementation follows audit sign-off per team practice.
- **2026-05-12** — **Pass 1 audit completed** from live `index.html` + `app.js` + LD domain `workflowBriefConfig` (via `domain-learning-design-step-patterns.md`). **Low-risk copy implemented** in `index.html` and `app.js` only. **Medium/high-risk** items deferred per table and implementation log above.
- **2026-05-12** — **Pass 1 implementation merged:** author-facing Workflow Factory and Workflows-tab copy only; internal brief prefixes (`Desired outputs: `, etc.) unchanged; domain-pack files unchanged (LD hints overridden in `app.js` for selected domain).
- **2026-05-12** — **Stabilisation review (post–Pass 1):** `git diff` of `app.js` and `index.html` reviewed against Sprint 09 charter. Confirmed: edits are **user-facing copy, placeholders, helper text, and `aria-label` casing only**; `textContent` / static HTML updates and hint-string defaults only—**no** persisted-key, save-shape, import/export, generator brief-prefix, workflow-runtime, sequencing, renderer, assessment, or domain-pack file changes. Learning-design hint **display** override in `renderWorkflowFactoryDomainUiHints` does **not** alter collected field values or `briefLines`. Portable `context-files/sprint-09-workflow-brief-semantics-alignment-pass-1.md` verified **byte-identical** to this canonical file (SHA256 match). **No reverts** required.

### Check-in summary (for commit / handover)

- **Audit:** Completed; audit table, risk classification, and deferrals recorded in this document (see **Pass 1 risk classification**, **Pass 1 implementation log**, and **Explicitly not changed (deferred)**).
- **Implemented:** Low-risk wording only in `index.html` (Workflow Factory + Workflows edit panel) and `app.js` (`renderWorkflowFactoryDomainUiHints` defaults + learning-design display-only hint overrides, `updateWorkflowFactoryInputsCopyFromStartingPoint`, `renderWorkflowDetailDomainUiHints` defaults, `handleStartWorkflowDesign` empty-summary placeholder).
- **Explicit deferrals:** Internal brief/elicitation prefixes (e.g. `Desired outputs: ` in `briefLines` / `extractWorkflowBriefExplicitFactors`), domain-pack source edits, generator templates / `workflowGenerationContext.js`, save-format and runtime paths—unchanged; see **Explicitly not changed (deferred)** above.
- **Verification limitations:** Node CLI was not available in the review environment; **no** automated `node --check` run. **Browser smoke checks remain required** before commit.
- **Recommended manual browser checks before commit:** Open Workflow Factory and Workflows tabs (no console errors); load an existing workflow; export/import round-trip; optional workflow-design start with API key to confirm brief construction still behaves as before; spot-check run mode if time permits (see **Smoke check (lightweight, manual)**).
- **Portable parity:** `docs/development/sprints/2026-05-12-sprint-09-workflow-brief-semantics-alignment-pass-1/context-files/sprint-09-workflow-brief-semantics-alignment-pass-1.md` matches this file; re-copy after any canonical edit.
