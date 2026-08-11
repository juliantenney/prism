# S75-T-010 — Primary journey map and Domain A decomposition

> **Historical discovery artefact (2026-08-10).**  
> This document records the journey map and Domain A decomposition **as understood during discovery**. It does **not** describe the current post-`S75-D25` Create interface or settled persistence model.  
> **Current product state:** [STATUS.md](STATUS.md) · [decisions.md](decisions.md) · [next-chat-briefing.md](next-chat-briefing.md).

**Task:** S75-T-010  
**Status:** **Done** (2026-08-10)  
**Mode:** DISCOVERY ONLY — no UI, runtime, test, fixture, or architecture changes  
**Binding decisions:** [S75-D01](decisions.md#s75-d01--open-sprint-75--prism-user-experience-and-interface) · [S75-D02](decisions.md#s75-d02--sprint-75-follows-the-product-journey-and-major-product-surfaces-sequentially)  
**Authorisation:** Operator message 2026-08-10 — execute T-010 after programme structure refinement

---

## 1. Evidence reviewed

| Source | Class | What was used |
| ------ | ----- | ------------- |
| Live product (`http://127.0.0.1/prism/index.html`) | **Agent browser session** (supplementary — not operator/Julian observation) | Tab chrome, default visible panel on load vs after tab click, Create Workflow form fields, disabled states without API key, accessibility tree structure |
| `index.html` | Implementation (supporting) | Tab IA (`#tabWorkflowFactory`…`#tabLibrary`); `#workflowFactoryPanel` structure; panel visibility classes on load |
| `app.js` | Implementation (supporting) | `switchTab`, `handleStartWorkflowDesign`, `workflowBriefElicitation` stages, `continueWorkflowDesignGeneration`, `handleWorkflowAnswer`, `handleSaveDesignedWorkflow`, `renderWorkflowDesignResult`, init sequence (`finalizeInitialUiSetup`) |
| [SPRINT-75-CHARTER.md](SPRINT-75-CHARTER.md) · [CONTEXT.md](CONTEXT.md) · [S75-D02](decisions.md#s75-d02--sprint-75-follows-the-product-journey-and-major-product-surfaces-sequentially) | Product intent | Five programme domains; experience-before-implementation; sequential discovery |
| [Sprint 74 CONTEXT](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/CONTEXT.md) | Product intent | Apparent narrative Create Workflow → My Workflows → Authoring → export |
| [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md) | Methodology | Browser authority; evidence provenance |

**Evidence gap (primary):** ~~No operator observation~~ **Resolved** — see [S75-T-010-domain-a-operator-observation-synthesis.md](S75-T-010-domain-a-operator-observation-synthesis.md) and §11 addendum below.

**Explicit non-claim:** Usability quality, friction severity, cognitive load, accessibility compliance, and visual effectiveness are **not** assessed in this task — only journey structure, transitions, and investigation questions.

---

## 2. High-level product journey map (Domains A–E)

### 2.1 Programme domain summary

| Domain | Product chrome | Apparent primary user goal | Entry | Exit / handoff |
| ------ | -------------- | --------------------------- | ----- | -------------- |
| **A** Elicitation & Workflow Generation | **Create Workflow** tab | Define design intent and obtain a saved multi-step workflow orchestration | App load; tab navigation | **Save as workflow** → Domain B (auto tab switch) |
| **B** My Workflows | **My Workflows** tab | Manage, configure, run, and refine saved workflows | Tab; import; handoff from A | Run outputs → Domain C (**Assemble from current run**); step prompt editing may use Domain D surfaces |
| **C** Authoring | **Authoring** tab | Preview and export learner-facing HTML / ZIP from structured JSON | Tab; assemble from B run | Download HTML/ZIP; open preview (learner-facing artefact) |
| **D** Prompt Studio | **Prompt Studio** tab | Refine a **single prompt** via brief + conversation; save prompt asset | Tab; possible entry from workflow step prompt wizard | **Save to library** → Domain E |
| **E** Prompt Library | **Prompt Library** tab | Store, search, reuse prompt assets | Tab; save from D | Prompts attachable to workflow steps in B (relationship TBD in detail) |

Equal effort **not** assumed. Tab order (A, B, C, D, E) reflects **current chrome only** — not validated as correct IA.

### 2.2 Domain transitions (map level)

```text
[App entry / API key]
        │
        ▼
┌───────────────────────────────────────┐
│ A  Create Workflow                     │
│   basics → elicitation → generation   │
│   → review → Save as workflow         │
└───────────────┬───────────────────────┘
                │ save + switchTab("workflows")
                ▼
┌───────────────────────────────────────┐
│ B  My Workflows                        │
│   list → select → Edit / Run / Settings│
└───────┬───────────────────┬───────────┘
        │ run / outputs      │ step prompts (TBD)
        ▼                    ▼
┌───────────────┐    ┌──────────────────┐
│ C  Authoring   │    │ D  Prompt Studio  │──save──▶ E Prompt Library
│ preview/export │    │ (single prompt)   │              │
└───────────────┘    └──────────────────┘              │
        ▲                                                │
        └──────── assemble / JSON ◀────────────────────┘
                    (prompt assets used in B — detail TBD)
```

### 2.3 Unclear relationships (flagged — not resolved)

| Topic | Observation | Question for operator / later discovery |
| ----- | ----------- | --------------------------------------- |
| **D/E vs primary journey** | D and E are peer top-level tabs, not steps in A→B→C | Are prompt refinement and library **author tools** parallel to workflow creation, or should they be nested under B? |
| **Prompt Studio ↔ My Workflows** | `#refinementPanel` hosts `#workflowStepConfigPanel` and `#workflowPromptWizardNotice` — workflow step prompt mode lives in D's DOM | When editing step prompts in B, does the user land in Prompt Studio? Is that discoverable? |
| **Terminology: Workflows vs My Workflows** | Domain A helper: “use the **Workflows** tab”; chrome says **My Workflows** | Which label do users see mentally as the destination after save? |
| **Authoring vs workflow run** | C helper emphasises paste JSON; B offers run + **Assemble from current workflow run** in C | Is paste-JSON a secondary/dev path? What do authors actually do after Run? |
| **First paint / orientation** | `index.html`: `#tabWorkflowFactory` active but `#workflowFactoryPanel` has `hidden`; `#refinementPanel` visible until JS `switchTab("workflowFactory")` runs | **Requires operator observation:** flash of wrong panel on slow load? |
| **Settings location** | Resolved brief copy references **Settings tab** inside B, not A | Users completing A may not know Settings exists until B — is that intentional? |

### 2.4 Domains B–E (programme-map only — no detailed audit)

| Domain | Map-level notes |
| ------ | ---------------- |
| **B** | Split view: workflow list + detail; modes **Run / Settings / Edit**; header actions (New, Duplicate, Save, Import/Export, Clear run data); steps list; unified workflow settings panel for pack parameters |
| **C** | JSON input, Preview HTML, download HTML/ZIP, view bar (Preview / HTML / ZIP / Open / Resources per Sprint 73); iframe preview |
| **D** | Define the Brief (output type, audience, task, etc.); refinement conversation; Final Prompt + Save to library; distinct from workflow **design** brief in A |
| **E** | Library list, search/tag filter, prompt editor, version history sidebar |

---

## 3. Domain A — stage decomposition

Evidence merges/splits initial hypotheses as follows. **Eleven stages** (A0–A10) — finer than the eight hypotheses where implementation shows distinct state machines or UI ownership.

| Stage ID | Name | Hypothesis mapping |
| -------- | ---- | ------------------ |
| **A0** | Application entry & tab orientation | application entry / orientation |
| **A1** | API key prerequisite | (added — gates generation) |
| **A2** | Workflow basics capture | initial brief entry |
| **A3** | Domain selection & suggestion | part of pre-generation setup |
| **A4** | Pre-generation required-factor elicitation | elicitation interaction |
| **A5** | Inference confirmation | elicitation (sub-phase) |
| **A6** | Resolved brief advisory review | elicitation progress / completion |
| **A7** | Workflow generation execution | transition → generation; generation progress |
| **A8** | Post-generation refinement elicitation | (split from single “generation” — distinct stage) |
| **A9** | Generated workflow review & edit | generated workflow review / confirmation |
| **A10** | Optional reviewer loop | sub-stage of review |
| **A11** | Save & handoff to My Workflows | saving / transition into My Workflows |

*(A11 retained as eleventh stage — IDs A0–A11 = 12 stages; acceptable.)*

---

### Stage A0 — Application entry & tab orientation

| Field | Content |
| ----- | ------- |
| **Apparent user goal** | Understand what PRISM is and where to start creating a workflow |
| **Entry condition** | Navigate to `index.html` |
| **Main actions** | Load API key (header); choose main tab |
| **System response** | Header (PRISM title, subtitle, API key loader); five tabs; default selected tab **Create Workflow** (after init) |
| **Resulting state** | One main panel visible; others hidden |
| **Exit / transition** | User focuses Domain A form (A2) or navigates away |

**Journey questions:** Is “Create Workflow” clearly the intended starting point for new authors?  
**Interaction questions:** Are five peer tabs understandable without prior knowledge?  
**Presentation questions:** Does subtitle “Programmable Reasoning Intelligent System Mapping” orient or confuse?

**Requires operator observation:** First visual second after load (panel flash); whether users know to start on Create Workflow vs Prompt Studio.

**Implementation map:** `index.html` tablist; `finalizeInitialUiSetup()` → `switchTab("workflowFactory")` (`app.js` ~50114–50120). Initial HTML: `#workflowFactoryPanel.hidden` while `#tabWorkflowFactory.active`.

---

### Stage A1 — API key prerequisite

| Field | Content |
| ----- | ------- |
| **Apparent user goal** | Enable LLM-backed features |
| **Entry condition** | No `state.apiKey` |
| **Main actions** | Select `.txt` API key file (header) |
| **System response** | Badge “Not loaded” / “Loaded”; `#wfDesignStartBtn` disabled until loaded; creativity/detail settings appear when loaded |
| **Resulting state** | `state.apiKey` set in memory |
| **Exit / transition** | **Design workflow** enabled → A2+ |

**Journey questions:** Do users discover the key requirement before investing in the basics form?  
**Interaction questions:** Is file-picker the right affordance on first run?  
**Presentation questions:** Is gating only on **Design workflow** sufficient feedback?

**Requires operator observation:** First-time user path without dev auto-key; error toasts when clicking Design without key.

**Implementation map:** `updateApiKeyStatus` (~22840–22857); `handleStartWorkflowDesign` API key check (~19832–19835); `tryLoadLocalDevOpenAiApiKey` for localhost dev only.

---

### Stage A2 — Workflow basics capture

| Field | Content |
| ----- | ------- |
| **Apparent user goal** | Describe what workflow should produce (design intent, audience, inputs, constraints) |
| **Entry condition** | Create Workflow tab visible |
| **Main actions** | Fill `#wfDesignName`, `#wfDesignIntent`, `#wfDesignAudience`, `#wfDesignScale`, `#wfDesignStartingArtefact`, `#wfDesignInputs`, `#wfDesignDesiredOutputs`, `#wfDesignScopeConstraints`; optional `#wfDomainExtraFields` |
| **System response** | Static form with helper text; domain-specific extra fields when domain selected |
| **Resulting state** | Form values in DOM (not yet persisted) |
| **Exit / transition** | Click **Design workflow** → A3+ |

**Journey questions:** Is the form scoped correctly for “essentials” vs overwhelming detail before any assistant interaction?  
**Interaction questions:** Which fields are truly required vs optional in practice? (`name` + `designIntent` enforced in code)  
**Presentation questions:** Helper on line 611 references “**Workflows** tab” not “My Workflows”.

**Requires operator observation:** Time to complete; fields users skip; confusion between design intent, desired outputs, and constraints.

**Implementation map:** `#workflowFactoryPanel` → `.workflow-factory-basics-card`; `handleStartWorkflowDesign` validation (~19818–19831); `buildWorkflowDesignBase`; `renderWorkflowFactoryDomainUiConfig`.

---

### Stage A3 — Domain selection & suggestion

| Field | Content |
| ----- | ------- |
| **Apparent user goal** | Choose domain pack (Learning Design / Research) for quality rules |
| **Entry condition** | User clicks **Design workflow** with name + intent |
| **Main actions** | Select `#wfDesignDomainSelect`; answer yes/no if LD suggested |
| **System response** | Error toast if general-only; optional chat suggestion to switch to Learning Design; status badge “Needs domain” / “Domain suggestion” |
| **Resulting state** | `state.workflowSelectedDomains`; possible `state.workflowDomainSuggestionPending` |
| **Exit / transition** | Valid domain → brief resolution (A4+) |

**Journey questions:** Is blocking general-only clear **before** click?  
**Interaction questions:** Is conversational domain suggestion better than inline UI guidance?  
**Presentation questions:** “General is always included” — do users understand two-layer domain model?

**Requires operator observation:** LD suggestion trigger quality; user response to yes/no in log vs dropdown.

**Implementation map:** `shouldRecommendLearningDesignDomain`; `isGeneralOnlySelection`; `handleWorkflowAnswer` domain branch (~31360–31377); `getSelectedWorkflowDomains`.

---

### Stage A4 — Pre-generation required-factor elicitation

| Field | Content |
| ----- | ------- |
| **Apparent user goal** | Supply missing essential brief factors the system cannot infer |
| **Entry condition** | Brief config loaded; `firstPass.missing.length > 0` |
| **Main actions** | Type answers in `#wfDesignAnswer`; **Send** |
| **System response** | Assistant messages in `#wfDesignLog`; status “Needs essentials”; questions from `buildWorkflowBriefQuestionText`; `#wfBriefResolvedDetails` may populate |
| **Resulting state** | `state.workflowBriefElicitation` (`stage: "required"`, queue/index); `state.workflowBriefResolved` |
| **Exit / transition** | Queue exhausted → A5 or A6 → A7 |

**Journey questions:** Can users answer multi-factor questions in one message as invited?  
**Interaction questions:** Is chat log the right surface vs structured form for missing essentials?  
**Presentation questions:** Is resolved brief panel discoverable while elicitation continues?

**Requires operator observation:** Full elicitation transcript for LD workflow; cognitive load of factor jargon.

**Implementation map:** `workflowBriefElicitation` stage `"required"` (~19994–20004); `handleWorkflowAnswer` elicitation queue processing; `renderWorkflowBriefResolvedPanel`.

---

### Stage A5 — Inference confirmation

| Field | Content |
| ----- | ------- |
| **Apparent user goal** | Confirm or override high-impact inferred brief values |
| **Entry condition** | Pending inferred factors require confirmation (`workflowBriefInferenceConfirmation`) |
| **Main actions** | yes/no/confirm in answer box |
| **System response** | Assistant confirms; may re-queue missing or proceed |
| **Resulting state** | Updated `workflowBriefResolved`; cleared confirmation |
| **Exit / transition** | → A6 or A7 |

**Journey questions:** Do users understand what is inferred vs what they typed?  
**Interaction questions:** Is yes/no sufficient for nuanced pedagogical factors?

**Requires operator observation:** Typical inference prompts for LD; error recovery when user says “no”.

**Implementation map:** `workflowBriefInferenceConfirmation`; `getPendingHighImpactInferredFactors`; `handleWorkflowAnswer` (~31457+).

---

### Stage A6 — Resolved brief advisory review

| Field | Content |
| ----- | ------- |
| **Apparent user goal** | Inspect planning assumptions, mappings, defaults (optional) |
| **Entry condition** | `state.workflowBriefResolved` populated |
| **Main actions** | Expand `#wfBriefResolvedDetails`; toggles for planning info, workflow mappings, defaults, rejected, inferred-all |
| **System response** | Advisory disclosures; copy states Settings in B for execution tuning |
| **Resulting state** | Display-only toggles (`workflowBriefShow*` flags) |
| **Exit / transition** | Automatic alongside A4/A5; non-blocking → A7 |

**Journey questions:** Do users know this is advisory and non-blocking?  
**Interaction questions:** Should review happen before or after generation?  
**Presentation questions:** Engineering concepts: “step mappings”, “resolved factors”, “pack parameters”.

**Requires operator observation:** Whether users open panel; whether content aids or overwhelms.

**Implementation map:** `#wfBriefResolvedDetails`; `renderWorkflowBriefResolvedPanel`; `attachWorkflowBriefPlanningToResolvedState`.

---

### Stage A7 — Workflow generation execution

| Field | Content |
| ----- | ------- |
| **Apparent user goal** | Obtain proposed multi-step workflow orchestration |
| **Entry condition** | Brief resolved; user path reaches `continueWorkflowDesignGeneration` |
| **Main actions** | Wait (no primary user action) |
| **System response** | Status “Designing…”; log “Designing workflow from your brief…”; LLM call `callOpenAIForWorkflowDesign`; then `#wfDesignSummary`, `#wfDesignSteps` populated |
| **Resulting state** | `state.workflowDesignVersions` (draft/refined); `state.workflowDesignResult` |
| **Exit / transition** | Success → A8 or A9; failure → error badge/toast |

**Journey questions:** Is wait state understandable for long generations?  
**Interaction questions:** Can user cancel or edit basics mid-flight?  
**Presentation questions:** Token/cost visibility only in header — sufficient?

**Requires operator observation:** Duration, failure modes, partial progress feedback.

**Implementation map:** `continueWorkflowDesignGeneration` (~19532+); `renderWorkflowDesignResult` (~5454+); `WorkflowGenerationContext.buildWorkflowGenerationContext`.

---

### Stage A8 — Post-generation refinement elicitation

| Field | Content |
| ----- | ------- |
| **Apparent user goal** | Answer step-specific refinement questions (e.g. assessment/page settings) after initial orchestration |
| **Entry condition** | Post-generation queue non-empty (`stage: "post_generation_refinement"`) |
| **Main actions** | Answer in `#wfDesignAnswer` (yes/no; factor answers) |
| **System response** | May regenerate workflow once (`continueWorkflowDesignGeneration` with `skipPostGenerationRefinement`); assessment/page profile messages |
| **Resulting state** | Updated design versions; cleared or advanced elicitation queue |
| **Exit / transition** | Queue complete → A9 |

**Journey questions:** Do users expect more questions **after** seeing suggested steps?  
**Interaction questions:** Optional opt-in vs required questions — clear?

**Requires operator observation:** Full post-gen conversation for assessment-heavy workflow.

**Implementation map:** `workflowBriefElicitation.stage === "post_generation_refinement"`; `getPostGenerationElicitationQueueFromProfile`; `handleWorkflowAnswer` (~31380+).

---

### Stage A9 — Generated workflow review & edit

| Field | Content |
| ----- | ------- |
| **Apparent user goal** | Review, lightly edit, choose draft vs refined version before saving |
| **Entry condition** | `renderWorkflowDesignResult` completed |
| **Main actions** | Select `#wfDesignVersionSelect`; edit step title/role; delete steps; read summary |
| **System response** | Status “Complete” / “Ready”; editable step list; **Review & suggest improvements** enabled |
| **Resulting state** | Mutated `workflowDesignVersions` in memory |
| **Exit / transition** | **Save as workflow** → A11; optional A10 |

**Journey questions:** Is draft vs refined meaningful to users?  
**Interaction questions:** Are step title/role edits sufficient for review?  
**Presentation questions:** “Suggested workflow” vs saved workflow distinction.

**Requires operator observation:** User mental model of version select; step settings discoverability.

**Implementation map:** `#wfDesignSteps`, `#wfDesignVersionSelect`; `renderWorkflowDesignResult`; step delete handlers.

---

### Stage A10 — Optional reviewer loop (sub-stage)

> **Status (2026-08-10):** **Retired** under [`S75-D03`](decisions.md#s75-d03--retire-generic-create-workflow-workflow-review-step-insertion). Rows below are the **historical** implementation map from discovery — not live product behaviour. Future QA → [PB-FA-006](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-006--qa--workflow-and-resource-refinement-lifecycle).

| Field | Content |
| ----- | ------- |
| **Apparent user goal** | Accept/reject AI-suggested improvements to steps |
| **Entry condition** | Click **Review & suggest improvements** |
| **Main actions** | yes/no per suggestion in answer box |
| **System response** | Sequential suggestions in log (`workflowReviewSuggestions`) |
| **Resulting state** | Updated refined version |
| **Exit / transition** | → A11 |

**Requires operator observation:** Value vs fatigue; suggestion quality.

**Implementation map (historical):** `handleWorkflowReview`; `callOpenAIForWorkflowReview`; `handleWorkflowAnswer` suggestion branch — **removed** from live product.

---

### Stage A11 — Save & handoff to My Workflows

| Field | Content |
| ----- | ------- |
| **Apparent user goal** | Persist workflow and continue refinement/execution in B |
| **Entry condition** | User clicks **Save as workflow** |
| **Main actions** | Save (name from basics form) |
| **System response** | Toast; `switchTab("workflows")`; `selectWorkflow(wfId)`; workflow scaffold in list |
| **Resulting state** | Workflow in local persistence (`saveWorkflows`); Domain B selected |
| **Exit / transition** | **Domain B** — detailed discovery not in T-010 |

**Journey questions:** Does auto-switch match user expectation?  
**Interaction questions:** Save enabled even when design incomplete — intentional? (`wfDesignSaveBtn` behaviour)  
**Presentation questions:** Toast mentions “add prompts and refine steps in the Workflows tab”.

**Requires operator observation:** Post-save orientation in B; whether users return to A.

**Implementation map:** `handleSaveDesignedWorkflow` (~31280–31296); `switchTab("workflows")`.

---

## 4. Cross-cutting observations (Domain A context)

| Concern | Where it arose | Notes (questions only — no redesign) |
| ------- | -------------- | ------------------------------------- |
| **Navigation** | A0, A11 | Five peer tabs; A11 auto-jumps to B |
| **Orientation** | A0, A2 | Product purpose split across header subtitle + per-card helpers |
| **Terminology** | A2, A6, A11 | “Workflows” vs “My Workflows”; “Workflow Factory” aria-label vs “Create Workflow”; brief vs design intent |
| **Progress / feedback** | A1, A4, A7, A8 | Badges (`#wfDesignStatus`); conversation log; toasts |
| **Errors / recovery** | A1, A3, A7 | Toasts; domain suggestion retry; **operator observation needed** for LLM failures |
| **Empty / disabled states** | A1, A9 | Design workflow disabled; Review disabled until design exists |
| **Discoverability** | A6, A10 | Resolved brief collapsed; reviewer optional |
| **Cognitive load** | A2, A4, A8 | Large basics form + conversational elicitation + post-gen questions |
| **Accessibility** | A0 | Agent snapshot: hidden panels still expose Prompt Studio fields in a11y tree until tab sync — **verify with operator/screen reader** |
| **Consistency** | A2 vs D | Two different “brief” forms (workflow basics vs Prompt Studio Define the Brief) |
| **Engineering leakage** | A6, A3 | Domain packs, resolved factors, step mappings, canonical step IDs (in code/docs) |

---

## 5. Supporting implementation map (Domain A)

| Stage | Primary DOM | Primary state (`app.js`) | Notes |
| ----- | ----------- | ------------------------ | ----- |
| A0 | `#tabWorkflowFactory`, panels | `switchTab` | Init fixes tab/panel mismatch |
| A1 | `#apiKeyFile`, `#wfDesignStartBtn` | `state.apiKey` | |
| A2 | `.workflow-factory-basics-card` inputs | DOM values → `buildWorkflowDesignBase` | |
| A3 | `#wfDesignDomainSelect`, `#wfDesignLog` | `workflowDomainSuggestionPending` | |
| A4–A5 | `#wfDesignLog`, `#wfDesignAnswer` | `workflowBriefElicitation`, `workflowBriefInferenceConfirmation` | Shared conversation UI |
| A6 | `#wfBriefResolvedDetails` | `workflowBriefResolved`, show flags | |
| A7 | `#wfDesignStatus`, `#wfDesignLog` | `workflowDesignVersions`, `workflowStepPatternCatalog` | |
| A8 | same as A4 | `stage: "post_generation_refinement"` | Same shell, different queue |
| A9–A10 | `#wfDesignSteps`, `#wfDesignReviewBtn` | `workflowReviewSuggestions` | |
| A11 | `#wfDesignSaveBtn` | `state.workflows` | Persists + tab switch |

**Implementation ≠ UX truth:** Shared `#wfDesignLog` / answer box across elicitation, domain suggestion, review, and post-gen phases — users may not perceive separate stages.

---

## 6. Evidence gaps

| Gap | Impact | Mitigation |
| --- | ------ | ---------- |
| No operator session with API key + LD workflow end-to-end | Cannot validate journey coherence, friction, or timing | Operator observation checklist (§7) |
| No elicitation/post-gen transcripts | A4, A5, A8 questions speculative | Targeted discovery tasks |
| D/E role in author mental model | Map-level only | Domain D/E discovery after Domain A |
| Accessibility beyond agent snapshot | a11y tree may not match visual | Operator + assistive tech pass |
| Mobile / narrow viewport | Not observed | Later cross-cutting pass |

---

## 7. Operator observation checklist (Julian)

Execute with API key loaded; prefer Learning Design domain; one realistic module/workshop intent.

### A0–A1 Orientation & gate
- [ ] Hard refresh: is Prompt Studio visible before Create Workflow panel settles?
- [ ] Without API key: what happens when clicking **Design workflow**?
- [ ] First-time understanding: where to start?

### A2–A3 Basics & domain
- [ ] Complete basics with minimal fields — sufficient?
- [ ] General-only domain error — discoverable before click?
- [ ] LD suggestion: helpful or intrusive?

### A4–A6 Elicitation & resolved brief
- [ ] Record full `#wfDesignLog` transcript for one LD workflow
- [ ] Open **Resolved workflow brief** — useful or noise?
- [ ] Any factor wording that feels like engineering not product language?

### A7–A8 Generation & post-gen
- [ ] Wait experience during **Designing…**
- [ ] Post-generation questions: expected or surprising?
- [ ] Regeneration after answers: clear what changed?

### A9–A11 Review & save
- [ ] Draft vs Refined version — meaningful?
- [ ] Edit/delete steps — sufficient review control?
- [ ] **Review & suggest improvements** — worth it?
- [ ] After **Save as workflow**: orientation in My Workflows — clear next step?

---

## 8. Recommended next Domain A discovery tasks

Proposed **UX discovery** tasks only — **not authorised** by T-010.

| ID | Task | Stages | Rationale |
| -- | ---- | ------ | --------- |
| **S75-T-011** | Domain A — orientation, API gate & basics capture | A0–A3 | Operator-first; low LLM cost; fixes map-level terminology/orientation gaps |
| **S75-T-012** | Domain A — pre-generation elicitation & resolved brief | A4–A6 | Requires live elicitation; shared conversation UI; highest jargon/leakage risk |
| **S75-T-013** | Domain A — generation, post-gen refinement, review & save | A7–A11 | Observed wait states, post-gen surprise, handoff to B |

Alternative: single **S75-T-011** end-to-end operator journey record before splitting — operator may prefer one scripted pass first.

**Not proposed:** Implementation tasks; Domains B–E detailed audit.

---

## 9. Explicit non-findings

- No usability verdicts (good/bad) on any stage  
- No redesign or IA recommendations  
- No accessibility audit (WCAG)  
- No detailed audit of Domains B–E  
- No Prompt Studio / Library role determination beyond map-level uncertainty  
- No claim that code-derived stages match user-felt stages  
- Agent browser session is **not** a substitute for Julian’s operator observation  

---

## 10. Stop condition

T-010 complete. Do **not** execute S75-T-011/012/013 without operator authorisation.

---

## 11. Addendum — operator observation complete (2026-08-10)

**Supersedes for planning purposes only:** §6 evidence gap (“no operator observation”), §7 checklist (completed), §8 recommended task split (boundaries **under reconsideration**). **Does not rewrite** §§1–5 historical discovery content.

### 11.1 Operator observation status

| Item | State |
| ---- | ----- |
| T-010 §7 checklist | **Completed** by Julian (operator) |
| Scenario | Learning Design — “Programme Manager CPD” / 60 min self-study “Managing Risk” |
| Primary evidence document | [S75-T-010-domain-a-operator-observation-synthesis.md](S75-T-010-domain-a-operator-observation-synthesis.md) |

Agent browser session (§1) remains supplementary; operator pass is **authoritative** for Domain A UX findings.

### 11.2 Major synthesis (summary)

- **A0–A11 retained** as implementation/state decomposition — still valid for tracing UI/state ownership.
- **Not** twelve user-experienced stages. Operator experienced fewer phases; elicitation often **collapsed** (Design workflow → Designing… → Ready).
- **Provisional experienced journey:** **DEFINE → UNDERSTAND → DESIGN → IMPROVE → COMMIT** (discovery synthesis only — not target IA).
- **Positive evidence retained:** understandable Create Workflow purpose; helpful field text; natural language intent; no unnecessary elicitation when brief sufficient; pre-save inspection; save/handoff works.
- **Major friction themes:** API gate unexplained at disabled action; capability visibility (open-ended intent vs narrow LD outputs); Settings boundary before save; review suggestions off-screen; consequence visibility for yes/no review steps; refinement vs Run sequence mismatch (**hypothesis**); duplicate save vs update; post-save Settings landing from prior tab state.
- **Settings vs elicitation:** full elicitation is **not** product target; 25 settings observed; Settings efficacy/completeness = **Domain B gap**.
- **Executable integrity:** refinement display vs Run ordering requires later investigation — **not** diagnosed here.

### 11.3 Proposed T-011 / T-012 / T-013 — reconsideration

Original proposal (§8):

| ID | Boundary | Status after operator evidence |
| -- | -------- | ------------------------------ |
| S75-T-011 | A0–A3 | **Not authorised** — follows implementation stages too closely |
| S75-T-012 | A4–A6 | **Not authorised** — elicitation often invisible to user |
| S75-T-013 | A7–A11 | **Not authorised** — spans DESIGN/IMPROVE/COMMIT user phases |

**Provisional alternative slices** (not tasks — see synthesis doc §6):

- A. Intent, capability & brief formation  
- B. Generated design, refinement & parameterisation  
- C. Workflow commitment & handoff  

**Next action:** Operator decision on revised discovery boundaries — not automatic authorisation of T-011.

### 11.4 Mapping: experienced phases ↔ A0–A11

| Experienced phase | A0–A11 (indicative) |
| ----------------- | ------------------- |
| DEFINE | A0, A2, A3 (A1 prerequisite) |
| UNDERSTAND | A4–A6 (may collapse) |
| DESIGN | A7, A9 |
| IMPROVE | A8, A10 |
| COMMIT | A11 |

---

## 12. Addendum — Domain B Run operator observation (2026-08-10)

**Supplements:** §2.4 (Domain B programme-map only), §11 (Domain A operator pass). **Does not rewrite** §§1–5 or §11 historical content.

### 12.1 Observation status

| Item | State |
| ---- | ----- |
| Scenario | Same LD workflow — Programme Manager CPD (10 steps, refined) |
| Surface | Domain B — My Workflows / **Run** (Settings/Edit observed for orientation) |
| Extent | Entry through final page-artefact step; **stopped at Authoring handover** |
| Primary evidence | [S75-T-010-domain-a-operator-observation-synthesis.md](S75-T-010-domain-a-operator-observation-synthesis.md) **Part II** (§§3.14–3.22, §4.3, §5.1, §6.1) |
| Walkthrough closure | **Sufficient** — no need to repeat established Run interaction pattern on every remaining step |

### 12.2 Major synthesis (summary)

**Positive:**

- Workflow selection persistence appears useful.
- Once BYO-LLM Copy → Copilot → return convention is learned, step execution is **consistent**.

**Major friction / hypotheses:**

- First-use orientation weak: execution model, fresh Copilot chat, Run vs Edit/Settings landing.
- Mode persistence (Run/Edit/Settings) may need different behaviour from workflow selection persistence — **not decided**.
- Dual guidance surfaces (prose + Instructions); Instructions often empty on domain workflow.
- Later-step prose uses implementation terminology (partial page artefact, assembly, schema, etc.).
- Paste/store-output field shown when step does not require PRISM persistence — **strong UX direction** to show only when needed.
- Distinction between execution-only steps and persisted-artefact steps (e.g. Design Episode Plan) is important.
- Blocking validation defect at Design Learning Activities (Step 7) — recorded; targeted fix requested during walkthrough (**outside this doc**).
- Copilot follow-up suggestions undesirable in workflow context — prompt-level mitigation vs host UI limits.
- Refinement/QA steps incoherent at Run (duplicate adjacent steps) — reinforces §11.2 executable-integrity hypothesis; **do not** reinstate QA as solution.
- No clear **My Workflows → Authoring** handover after final step.

### 12.3 Domain B map-level update (evidence-informed, not detailed audit)

| B sub-area | Operator evidence depth |
| ---------- | ------------------------ |
| List / selection | Observed — persistence useful; default-selection rule **provisional** |
| Run / Edit / Settings modes | Observed — orientation problem; mode vs selection **hypothesis** |
| Run step execution | Observed — BYO-LLM orchestration; consistency positive post-learning |
| Run UI (paste, Instructions, prose) | Observed — control relevance and guidance layering issues |
| Settings (efficacy) | **Not** systematically audited — gap preserved |
| Handoff to Authoring | Observed gap at Part II record — **extended in §13** |

### 12.4 Proposed next UX-review boundary (NOT a task) — *superseded by §13.4*

*Historical record when Part II closed at Authoring boundary:*

```text
Closed:  Domain A Create Workflow · Domain B Run (through final artefact step)
Next:    My Workflows → Authoring handover · Domain C Authoring journey
Not now: Full Settings audit · custom-workflow Instructions study · Run redesign
```

**No detailed discovery task authorised** by this addendum.

---

## 13. Addendum — B→C handover and Domain C Authoring (2026-08-10)

**Supplements:** §2.4 (Domain C programme-map only), §12 (Domain B Run). **Does not rewrite** §§11–12 historical content.

### 13.1 Observation status

| Item | State |
| ---- | ----- |
| Scenario | Same LD workflow — Programme Manager CPD |
| Surface | B→C handover + Domain C — **Authoring** |
| Extent | Entry → assemble → preview → optional enrichment (Graphics exercised; Video/Resources forms observed) → export |
| Primary evidence | [S75-T-010-domain-a-operator-observation-synthesis.md](S75-T-010-domain-a-operator-observation-synthesis.md) **Part III** (§§3.23–3.31, §4.4, §5.2, §6.2) |
| Primary journey | **Substantively complete** through output (A→B→C) |

### 13.2 Major synthesis (summary)

**Strongest issue — Authoring ENTRY (not post-assembly core):**

- No explicit B→C transition after Run completes (confirms §12.2).
- Empty JSON on first entry; **Assemble From Current Workflow Run** purpose and “current” workflow unclear.
- Stale assembled content possible; workflow identity not surfaced in Authoring.
- Reassembly requirement not obvious on return visits.

**Positive (post-assembly):**

- Assembly unlocks JSON, auto-preview, enrichment tabs, export actions.
- Learner preview, Open in New Tab, Preview HTML refresh — work reasonably well.
- Graphics job workflow (external gen → paste/upload → refresh) — works reasonably well.
- Video/Resources optional enrichment — straightforward (minor duplicated Video heading).
- Export (HTML vs learner package) — natural endpoint; no strong “completion ceremony” needed.

**IA observation (not redesign):** Learner Page / Graphics / Video / Resources are **different activity types** despite peer tabs.

**Future context only:** SCORM as eventual output format — not Sprint 75 scope.

**Experienced sequence (synthesis, not IA labels):** ASSEMBLE → PREVIEW → optional ENRICH → REFRESH/INSPECT → EXPORT.

### 13.3 Domain C map-level update (evidence-informed, not exhaustive audit)

| C sub-area | Operator evidence depth |
| ---------- | ------------------------ |
| B→C handover | Observed — orientation/provenance gap |
| Assembly / JSON | Observed — gateway; assemble vs auto-preview clarity question |
| Learner preview / inspection | Observed — positive |
| Graphics | Observed — positive; structurally distinct from Video/Resources |
| Video | Observed — adequate; minor duplicated heading |
| Resources | Observed — adequate |
| Export | Observed — HTML vs ZIP distinction meaningful |
| Prompt Studio / Library linkage | **Not** audited in this pass |

### 13.4 Primary journey status and proposed deferrals (NOT tasks)

**Complete (discovery evidence):** Create Workflow → My Workflows/Run → Authoring → enrichment → export.

**Deferred (unchanged gaps):** Settings efficacy · custom-workflow Instructions · Domain A slice decision · Domains D–E · executable integrity diagnosis · implementation.

**No detailed discovery task authorised** by this addendum.
