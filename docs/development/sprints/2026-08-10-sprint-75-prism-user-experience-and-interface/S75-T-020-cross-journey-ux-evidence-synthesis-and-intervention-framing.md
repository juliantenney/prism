# S75-T-020 — Cross-journey UX evidence synthesis and intervention framing

**Task:** S75-T-020  
**Status:** **Done** (2026-08-10) — synthesis / documentation only  
**Mode:** DISCOVERY SYNTHESIS — **no implementation authorised**  
**Builds on:** [S75-T-010 operator synthesis](S75-T-010-domain-a-operator-observation-synthesis.md) (Parts I–III) · [S75-T-010 journey map](S75-T-010-primary-journey-map-and-domain-a-decomposition.md) · Sprint 75 dependency investigations (2026-08-10, chat/task evidence — not separately persisted)  
**Does not replace:** Operator observation transcript — historical evidence in T-010 synthesis is retained unchanged.

---

## 1. Purpose

Primary end-to-end operator evidence is now complete:

```text
Create Workflow → My Workflows / Run → Authoring → enrichment → inspection/export
```

This document answers: **what should Sprint 75 actually address?** Themes and candidate slices are **evidence-derived**, not forced into the original T-011/T-012/T-013 or A0–A11 boundaries.

---

## 2. Evidence sources

| Source | Role |
| ------ | ---- |
| [S75-T-010-domain-a-operator-observation-synthesis.md](S75-T-010-domain-a-operator-observation-synthesis.md) | Primary operator observations (Domains A, B, C) |
| [S75-T-010-primary-journey-map-and-domain-a-decomposition.md](S75-T-010-primary-journey-map-and-domain-a-decomposition.md) | Implementation/state map (A0–A11); programme domains A–E |
| [CONTEXT.md](CONTEXT.md) | Durable programme context |
| My Workflows / Prompt Studio dependency investigation (2026-08-10) | Supporting — explains Run vs PS coupling, dual “Settings”, Run shell behaviour |
| Settings architecture investigation (2026-08-10) | Supporting — parameter source-of-truth fragmentation; deferral to [PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency) |
| [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md) | PB-FA-005 · PB-R-009 |

**Explicit non-source:** Domains D–E detailed discovery; custom-workflow operator pass; exhaustive validation audit.

---

## 3. Positive behaviours to preserve

Do **not** casually redesign these — they are working or valuable:

| Area | Positive evidence |
| ---- | ----------------- |
| **Create Workflow** | Purpose broadly understandable; field-level help valuable; natural-language brief works within supported capability; elicitation does not over-interrogate when brief is sufficient; pre-save workflow inspection useful |
| **Save / handoff** | Save → My Workflows works; newly saved workflow discoverable |
| **My Workflows** | Workflow **selection** persistence useful |
| **Run execution** | Once BYO-LLM Copy → external LLM → return convention is learned, step execution is **consistent** |
| **Run persistence steps** | Distinction between ordinary steps and steps requiring pasted/validated artefacts is **meaningful** when enforced (e.g. Design Episode Plan) |
| **Authoring post-assembly** | Substantially more coherent than A/B orientation; assembly unlocks tabs and export |
| **Learner preview** | In-tab preview, Open in New Tab, Preview HTML refresh work reasonably well |
| **Graphics** | Job-driven external generation → paste/upload → refresh works reasonably well |
| **Video / Resources** | Optional enrichment straightforward |
| **Export** | HTML vs learner package distinction meaningful; inspection/export feels like natural endpoint |
| **Transparency** | Resolved brief / debug disclosures have value for experienced inspection (may need progressive disclosure, not removal) |
| **Parameterisation intent** | Settings as post-creation tuning for reusable workflows is **deliberate product intent** — underlying contract deferred, not the concept |

---

## 4. Cross-journey themes

Eight themes explain most observed friction. Each includes evidence, scope, consequence, preserve list, implementation qualification, and intervention class.

---

### Theme 1 — Phase handoffs and “what next”

| Field | Content |
| ----- | ------- |
| **Evidence** | Run completion recognisable (no further steps) but **what next** unclear (§3.22, §3.23). No explicit navigation into Authoring. First Authoring entry: empty JSON; **Assemble From Current Workflow Run** purpose and “current” unclear. Misleading pre-save Settings access during Create can send users to My Workflows before save (§3.5). Post-save can land on Settings/Edit from prior sub-tab state (§3.13, §3.14). |
| **Scope** | Create → My Workflows boundary · My Workflows → Authoring · Authoring first entry |
| **User consequence** | Users finish Run or save a workflow without knowing the next production step; may assemble wrong or stale workflow data. |
| **Preserve** | Run end is self-evident; export endpoint in Authoring does not need heavy “completion ceremony”. |
| **Implementation qualification** | Authoring reads from selected workflow run state; “current workflow” exists in app state but is under-exposed in Authoring UI. B→C is a navigation/IA gap, not a missing backend capability. |
| **Intervention class** | **JOURNEY/HANDOFF** · **UX/INTERACTION** (first-use orientation) |

---

### Theme 2 — First-use orientation vs experienced-use efficiency

| Field | Content |
| ----- | ------- |
| **Evidence** | **API key** required for Create Workflow generation but gate discovered only at disabled Design workflow (§3.1, §3.3). **BYO-LLM Run** convention (Copy → **new** Copilot chat → paste/run → return) not surfaced (§3.15). **Authoring** purpose and assembly requirement unclear on first entry (§3.23). |
| **Scope** | Create Workflow · My Workflows Run · Authoring entry |
| **User consequence** | Inexperienced users invest effort before discovering prerequisites or execution model; experienced users should not face repeated explanatory clutter. |
| **Preserve** | Repeat Run steps need not re-explain Copy/return every time; workflow selection persistence supports experienced continuity. |
| **Implementation qualification** | Create uses direct API LLM; Run uses external LLM — mixed product model (§3.3 hypothesis). First-use guidance can be layered without changing execution architecture. |
| **Intervention class** | **UX/INTERACTION** · **UX/PRESENTATION** (first-use only where possible) |

---

### Theme 3 — Capability and consequence visibility

| Field | Content |
| ----- | ------- |
| **Evidence** | “What are you trying to design or produce?” appears open-ended but LD path supports **narrower** outputs (self-study, workshop) (§3.2). Optional brief fields (input details, learner-facing outputs, scope/constraints) hard to interpret (§3.2). Refinement yes/no suggestions lack consequence visibility; **Complete** badge while refinement continues (§3.10). Users asked to judge workflow quality before any output exists (§3.8). |
| **Scope** | Create Workflow (brief, refinement) · generated workflow review |
| **User consequence** | Users encode wrong assumptions in free text; accept refinement changes without understanding Run impact; over-trust or under-trust workflow proposals. |
| **Preserve** | Natural-language brief flexibility; do not remove optional fields without replacement strategy. |
| **Implementation qualification** | Output types are pack/domain constrained; refinement inserts steps via assistant path — semantic coupling to Run ordering not verified. |
| **Intervention class** | **PRODUCT SEMANTICS** · **UX/INTERACTION** · **UX/PRESENTATION** |

---

### Theme 4 — Control relevance and progressive disclosure

| Field | Content |
| ----- | ------- |
| **Evidence** | Run shows **Step output artefact (stored)** paste field even when step does not require persistence (§3.17). **Instructions** textarea often empty while prose exists above (§3.16). Resolved brief disclosure valuable but may not belong in primary novice path (§3.4). Generic Run shell exposes schema-driven surfaces for domain and custom workflows alike (implementation investigation). Step output **visibility** and **advance gate** use different rules (`workflowStepProducesStoredArtefact` vs capture-ready checks — implementation investigation). |
| **Scope** | My Workflows Run · Create Workflow (resolved brief) |
| **User consequence** | Cognitive load; false impression that paste is always required; empty fields imply broken or incomplete UI. |
| **Preserve** | Custom workflows **may** depend on Instructions — verify before removal (§3.16 open investigation). Persisted-output steps must remain obvious when required. |
| **Implementation qualification** | Run UI is largely schema-driven; conditional relevance requires step-capability metadata or runtime-aware rendering — UX change may need small product rules, not full architecture reopen. |
| **Intervention class** | **UX/INTERACTION** · **UX/PRESENTATION** |

---

### Theme 5 — Operator guidance vs implementation concept leakage

| Field | Content |
| ----- | ------- |
| **Evidence** | Later Run steps mix task guidance with implementation terms (partial page artefact, schema, downstream prompts, deterministic assembly) (§3.16). Dual guidance surfaces (prose + Instructions) without clear division of labour. |
| **Scope** | My Workflows Run (domain workflows observed) |
| **User consequence** | Operators must translate engineering concepts to tasks; increases cognitive load and error risk in external LLM step. |
| **Preserve** | Consistent step shell; Copy action; technical detail may remain available on demand for power users. |
| **Implementation qualification** | Run Copy assembles from `buildWorkflowStepInstructions()` + `resolveStepPromptText()` (baked `override_prompt_body`) with runtime augmentations — guidance text is presentation layer over stable assembly path. |
| **Intervention class** | **UX/PRESENTATION** · **UX/INTERACTION** |

---

### Theme 6 — State, location, and mode feedback

| Field | Content |
| ----- | ------- |
| **Evidence** | Review & suggest improvements response appeared off-screen above workflow (§3.9). Post-save lands on last-used My Workflows sub-tab (Settings/Edit) not necessarily Run (§3.13, §3.14). **Complete** while refinement active (§3.10). Two different concepts both called **Settings** — workflow Settings tab vs step **Settings…** opening Prompt Studio (implementation investigation). |
| **Scope** | Create Workflow · My Workflows |
| **User consequence** | Users miss system responses; wrong mode appears recommended; Settings naming collision causes confusion. |
| **Preserve** | Workflow selection persistence; Settings tab concept for pack parameters (contract fix deferred separately). |
| **Implementation qualification** | Mode persistence is client UI state; PS opens via `state.promptFactoryWorkflowContext` — naming/entry-point fix is UX; parameter authority is PB-FA-005. |
| **Intervention class** | **UX/INTERACTION** · **UX/PRESENTATION** · **JOURNEY/HANDOFF** (mode landing) |

---

### Theme 7 — Workflow identity, save semantics, and Authoring provenance

| Field | Content |
| ----- | ------- |
| **Evidence** | Second save during refinement created **duplicate** workflow (8-step vs 10-step same name) rather than clear update (§3.13). Authoring may show **stale assembled JSON** from another workflow (§3.23). Selected workflow identity not shown in Authoring. |
| **Scope** | Create Workflow save · My Workflows · Authoring |
| **User consequence** | Workflow library clutter; wrong learner artefact assembled/exported; user cannot verify which workflow Authoring reflects. |
| **Preserve** | Save as workflow fundamentally works; reassembly path exists for intentional refresh. |
| **Implementation qualification** | Save/update/duplicate semantics are product rules in client persistence; Authoring assembly binds to selected workflow run — provenance display is primarily UX. |
| **Intervention class** | **PRODUCT SEMANTICS** · **UX/INTERACTION** · **JOURNEY/HANDOFF** |

---

### Theme 8 — Executable truth / refinement semantic integrity

| Field | Content |
| ----- | ------- |
| **Evidence** | Refinement proposed review/QA steps; saved 10-step workflow; Run showed **duplicate adjacent** learning-outcomes steps rather than coherent review stages (§3.12, §3.20). Operator recollection: explicit QA steps previously explored and abandoned. |
| **Scope** | Create Workflow refinement · My Workflows Run |
| **User consequence** | Users trust refinement that does not produce runnable, intelligible workflow; wasted Run effort; erodes confidence in assistant. |
| **Preserve** | Refinement concept (IMPROVE phase) as a product intent; do **not** reinstate generic QA step insertion. Assessment pack QA steps and Prompt Studio prompt review remain separate. |
| **Implementation qualification** | **Root cause established (2026-08-10 investigation):** generic `callOpenAIForWorkflowReview` freeform insert → fuzzy `pickCanonicalWorkflowStepTitle` → duplicate production steps; save path skipped heuristics dedup. **Retired** under **`S75-D03`**. Future closed-loop QA → **[PB-FA-006](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-006--qa--workflow-and-resource-refinement-lifecycle)**. |
| **Intervention class** | **PRODUCT SEMANTICS** · **IMPLEMENTATION DEFECT** (retired) · future work **DEFERRED** (PB-FA-006) |

---

### Theme 9 — Settings / parameterisation (deferred underlying model)

| Field | Content |
| ----- | ------- |
| **Evidence** | ~25 Settings on LD workflow; intentional post-creation tuning (§3.5–3.7, §3.21). Architecture investigation: Settings UI **persists** pack metadata; **Settings → Save → Run** does **not** reliably apply values. Divergent stores: `workflowBriefResolution.resolvedFactors`, `workflowOutputSpec`, wf/step `[PRISM_STEP_PARAMS]`, baked `override_prompt_body`, PS drafts, runtime augmentations. PS shares parameter infrastructure with unified Settings; Run uses different assembly path. Design Episode Plan no Settings **intentional**; Generate Learning Content **likely gap**; Design Page **partial** coverage. |
| **Scope** | My Workflows Settings · Prompt Studio step mode · Run prompt assembly |
| **User consequence** | Users believe they tuned workflow; Run may ignore changes — trust and reusability broken. |
| **Preserve** | Pack-declared parameter controls; PS as prompt customisation surface; intentional minimal elicitation. |
| **Implementation qualification** | Parameter-contract problem documented — **[PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency)** · research **[PB-R-009](../../../backlog/PRODUCT-BACKLOG.md#pb-r-009)**. Not Sprint 75 implementation. |
| **Intervention class** | **DEFERRED UNDERLYING MODEL** |

---

## 5. Domain syntheses (grouped)

### 5.1 Create Workflow

Operator evidence clusters into **four experience problems** (not four tasks):

1. **Prerequisites & capability honesty** — API gate; supported output types vs open-ended intent (Themes 2, 3).
2. **Brief field cognitive load** — optional fields, duplication across fields, resolved brief exposure (Themes 3, 4).
3. **Refinement & executable promise** — consequence visibility, Complete state, QA/review incoherence (Themes 3, 8).
4. **Commit & handoff** — save semantics, duplicate workflows, misleading Settings access, post-save landing (Themes 1, 6, 7).

**Positive cluster retained:** purpose clarity, help text, NL elicitation, skip unnecessary questions, pre-save inspection, save works.

### 5.2 My Workflows / Run

Clusters:

1. **First-use execution model** — BYO-LLM, fresh chat (Theme 2).
2. **Run shell relevance** — paste field, Instructions, generic schema shell (Themes 4, 5).
3. **Mode & naming** — Edit/Run/Settings persistence; dual Settings (Themes 6, 9 partial).
4. **External LLM discipline** — Copilot follow-up suggestions (§3.19 — prompt/product boundary).
5. **Completion handoff** — B→C (Theme 1).
6. **Refinement fallout at Run** — Theme 8.

**Implementation findings incorporated:**

- Run is orchestration shell, not PS execution.
- Copy uses baked prompt bodies + runtime wrappers — explains why Settings efficacy ties to contract not UI alone.
- Custom workflow behaviour **not** operator-validated — do not redesign from domain evidence alone.

### 5.3 Authoring

Clusters:

1. **Entry & provenance** — assemble, current workflow, stale JSON (Themes 1, 7) — **strongest Authoring gap**.
2. **Assembly vs preview affordance** — auto-preview vs Preview HTML button (Theme 4, minor).
3. **Post-assembly coherence** — **positive** — do not restructure peer tabs without cause.

Minor: duplicated Video heading — presentation nit, not structural theme.

### 5.4 Settings — explicit deferral

Sprint 75 **does not** propose Settings UI redesign. Operator observations stand. Implementation belongs to **PB-FA-005** when prioritised. Per-run profile question: **PB-R-009**. **Not assigned to Sprint 76.**

---

## 6. First-use vs repeat-use matrix

| Concern | First-use severity | Repeat-use need | Orientation vs persistent |
| ------- | ------------------ | --------------- | --------------------------- |
| API key for Create | High | Low once configured | **Orientation** |
| Supported LD output types | High | Medium | **Orientation** + honest capability copy |
| BYO-LLM Run convention | High | Low | **Orientation** (dismissible / contextual) |
| Fresh Copilot chat | High | Low | **Orientation** |
| Authoring / assemble purpose | High | Medium | **Orientation** at B→C; lighter on return |
| Workflow provenance in Authoring | High | **High** | **Persistent** — not one-time |
| Run paste field when not needed | Medium | Medium | **Persistent** relevance fix |
| Resolved brief debug panel | Low for novices | Useful for experts | **Progressive disclosure** |
| Mode landing after save | High first save | Medium | **Interaction rule** change |
| Settings tuning efficacy | High when reused | High | Blocked on **PB-FA-005** |

---

## 7. Experienced journey model (cross-journey)

**A0–A11** remains the **implementation/state map** — not user-facing IA.

**Domain A five-phase model** (DEFINE → … → COMMIT) remains valid **within Create Workflow only**.

**Cross-journey model** (user terms, not navigation labels):

| Phase | User intent | Primary surfaces |
| ----- | ----------- | ---------------- |
| **1. PLAN** | Decide what learner resource to make and bound the brief | Create Workflow |
| **2. SHAPE** | Confirm PRISM understood; optionally improve the proposed process before saving | Create Workflow (understand / design / improve) |
| **3. COMMIT** | Save a reusable workflow definition | Create Workflow → My Workflows |
| **4. EXECUTE** | Run the process step-by-step with external LLM assistance | My Workflows Run |
| **5. ASSEMBLE** | Turn run outputs into a learner-facing artefact | Authoring (assembly gateway) |
| **6. ENRICH & PUBLISH** | Optional media/resources; inspect and export | Authoring |

**Shorthand:** PLAN → SHAPE → COMMIT → EXECUTE → ASSEMBLE → ENRICH & PUBLISH

**Notes:**

- UNDERSTAND/DESIGN/IMPROVE collapse inside **SHAPE** when elicitation is invisible.
- Settings tuning is part of **COMMIT/EXECUTE** intent but **blocked** on parameter contract (PB-FA-005).
- Prompt Studio / Library roles **not** placed in this primary journey — insufficient D/E evidence.

---

## 8. Refinement / QA assessment

| Question | Current evidence answer |
| -------- | ------------------------ |
| Primarily UX? | **Partially** — consequence visibility and Complete labelling remain UX concerns; the duplicate-step failure was not copy-only. |
| Product semantics? | **Yes for generic insertion** — invented “review” stages are not first-class executable steps. Assessment pack Validate/Feedback/Revise remain distinct and preserved. |
| Implementation defect? | **Confirmed** for the generic Create Workflow reviewer path — freeform insert + fuzzy canonicalisation + missing save-path dedup. |
| Obsolete functionality? | Generic graph reviewer **retired** (`S75-D03`). No prior formal abandonment decision found; Sprint 18 had left the reviewer generic intentionally. |
| Restore generic QA insertion? | **No**. |

**Investigation outcome (2026-08-10):** Root cause established; generic reviewer removed. Future closed-loop QA/refinement → **[PB-FA-006](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-006--qa--workflow-and-resource-refinement-lifecycle)** (Sprint 71 Benchmark/Validation corpus review recorded there as **prior art**). Productised author-facing closed loop remains **undesigned**.

Historical operator observations (§3.10–3.12, §3.20) are **retained as evidence** and are not rewritten.

---

## 9. T-011 / T-012 / T-013 reassessment

| ID | Original boundary | Assessment | Recommendation |
| -- | ----------------- | ---------- | -------------- |
| **S75-T-011** | A0–A3 | Follows implementation stages; mixes orientation, capability, API, brief fields | **Supersede** as discovery boundary |
| **S75-T-012** | A4–A6 | Elicitation often **invisible** to user — poor discovery slice | **Retire** as discovery boundary |
| **S75-T-013** | A7–A11 | Spans user phases DESIGN/IMPROVE/COMMIT; crosses into B handoff | **Supersede** as discovery boundary |

**Reasoning:** Operator pass already covered end-to-end journey. Remaining work is **intervention framing**, not more Domain A stage discovery. A0–A11 stays in T-010 as engineering map.

**Replacement:** Evidence-derived **candidate intervention slices** (§11) — **not authorised** as tasks until operator review.

**Provisional slices A/B/C** from operator synthesis §6 remain **conceptually closer** to user problems than T-011/012/013 but are **superseded for implementation planning** by cross-journey slices that respect B→C and Run evidence.

---

## 10. Dependency investigations (summary)

Persisted here because standalone investigation docs were not filed. Findings limited to evidence available 2026-08-10.

### 10.1 My Workflows / Prompt Studio dependency

- Same SPA (`app.js`); PS workflow-step mode via `state.promptFactoryWorkflowContext`.
- **Workflow Settings tab** ≠ step **Settings…** (opens PS).
- Shared: `[PRISM_STEP_PARAMS]`, `renderWorkflowPackParameterControlsSection()`.
- **Run Copy** path: `buildWorkflowStepInstructions()` + `resolveStepPromptText()` → baked `override_prompt_body`; not PS refinement API.
- Run shell is **generic** (domain + custom workflows).
- Output visibility vs advance requirement: **different rules** — explains misleading empty/paste surfaces.

### 10.2 Settings architecture

- UI persistence **works**; Run consumption **inconsistent**.
- Frozen brief resolution preserved on save; runtime augmentations may read stale brief.
- Workflow-level params in notes largely not consumed at Run (`readWorkflowParamsObject` UI-oriented).
- PS regenerates from params; seed/build paths may not apply same defaults.
- Coverage: Design Episode Plan intentional; Generate Learning Content gap; Design Page partial.

**Sprint 75 action:** None — **PB-FA-005**.

---

## 11. Candidate intervention slices (NOT authorised)

Small, evidence-coherent slices for operator review. **No implementation steps.**

---

### C-01 — B→C handoff and Authoring entry orientation

| Field | Content |
| ----- | ------- |
| **Problem** | After Run, users do not know Authoring is next; assemble action and “current workflow” unclear; stale data risk |
| **Evidence** | §3.22–3.23 · Theme 1 · Theme 7 |
| **Surfaces** | My Workflows Run (completion) · Authoring entry · possibly primary nav context |
| **Constraints** | Do not reopen assemble architecture; no SCORM |
| **Dependencies** | None blocking |
| **Exclusions** | Full Authoring IA redesign; peer-tab restructure |
| **Confidence** | **High** |
| **Status (2026-08-10)** | **Implemented** with C-02 under [`S75-D04`](decisions.md#s75-d04--implement-c-01c-02-run--authoring-handoff-and-provenance-clarity) — final-step **Continue to Authoring**; selected-workflow context near Assemble. No auto-assemble. |

---

### C-02 — Authoring workflow provenance display

| Field | Content |
| ----- | ------- |
| **Problem** | User cannot see which workflow/run assembled JSON belongs to |
| **Evidence** | §3.23 · Theme 7 |
| **Surfaces** | Authoring header/context |
| **Constraints** | Display/state clarity only unless product decides reassembly rules |
| **Dependencies** | Complements C-01; may stand alone |
| **Exclusions** | Automatic reassembly on workflow switch (product decision) |
| **Confidence** | **High** |
| **Status (2026-08-10)** | **Implemented** with C-01 under [`S75-D04`](decisions.md#s75-d04--implement-c-01c-02-run--authoring-handoff-and-provenance-clarity) — assembled-from identity + non-destructive mismatch warning from page metadata. **Deferred:** same-workflow run freshness / fingerprints. |

---

### C-03 — Run first-use BYO-LLM orientation

| Field | Content |
| ----- | ------- |
| **Problem** | Copy → new external chat → return convention not taught |
| **Evidence** | §3.15 · Theme 2 |
| **Surfaces** | My Workflows Run (first visit / first step) |
| **Constraints** | Must not clutter repeat use; browser-only |
| **Dependencies** | None |
| **Exclusions** | Changing BYO-LLM execution model |
| **Confidence** | **High** |
| **Status (2026-08-10)** | **Implemented** under [`S75-D06`](decisions.md#s75-d06--implement-c-03-as-persistent-lightweight-run-execution-orientation); wording compacted under [`S75-D07`](decisions.md#s75-d07--implement-c-04-run-capture-relevance-page-structure-producers-only) to one persistent line: fresh AI chat **per workflow run**; **same chat** for all steps; paste back **only when the step asks you to**. |

---

### C-04 — Run conditional paste/store-output UI

| Field | Content |
| ----- | ------- |
| **Problem** | Paste field shown when step does not require capture |
| **Evidence** | §3.17–3.18 · Theme 4 · implementation investigation |
| **Surfaces** | My Workflows Run step panel |
| **Constraints** | Must not break custom workflows — **verify** before ship |
| **Dependencies** | Custom-workflow verification (see §12) |
| **Exclusions** | Validator/schema changes |
| **Confidence** | **Medium–High** (pending custom-workflow check) |
| **Status (2026-08-10)** | **Implemented** under [`S75-D07`](decisions.md#s75-d07--implement-c-04-run-capture-relevance-page-structure-producers-only). Visibility = `isWorkflowStepPageStructureProducer` (not `workflowStepProducesStoredArtefact`). Product principle: external AI chat carries ordinary inter-step info; PRISM captures only page-pipeline structured artefacts. Empty Run Instructions hidden; meaningful custom notes preserved. Non-page custom `outputName` stash no longer shows paste (intentional). Runtime assembly / capture / Next gating unchanged. |

---

### C-05 — Create Workflow API prerequisite visibility

| Field | Content |
| ----- | ------- |
| **Problem** | API key requirement discovered too late |
| **Evidence** | §3.1, §3.3 · Theme 2 |
| **Surfaces** | Create Workflow · header API control linkage |
| **Constraints** | Presentation/interaction only |
| **Dependencies** | None |
| **Exclusions** | BYO-LLM for workflow creation (strategy) |
| **Confidence** | **High** |
| **Status (2026-08-10)** | **Implemented** under [`S75-D09`](decisions.md#s75-d09--create-workflow-api-key-prerequisite-c-05); **amended** same day: Create Workflow always navigable; API key required on **Design workflow** (first OpenAI-dependent Create action), with reveal/focus of existing `#apiKeyFile` — not on tab entry. |
| **Status (2026-08-11)** | **Presentation amended** under [`S75-D23`](decisions.md#s75-d23--workflow-design-assistant-progressive-disclosure): Design disabled without key; proactive **API key required** action; resting prose removed. Navigation rule unchanged. |

---

### C-06 — Supported output capability honesty (Create)

| Field | Content |
| ----- | ------- |
| **Problem** | Open-ended intent field overstates LD capability |
| **Evidence** | §3.2 · Theme 3 |
| **Surfaces** | Create Workflow brief fields |
| **Constraints** | Product semantics + copy/control — not pack rewrite in first slice |
| **Dependencies** | None |
| **Exclusions** | Expanding LD output types |
| **Confidence** | **Medium** (needs product call on explicit vs guided encoding) |
| **Status (2026-08-10)** | **Implemented** under [`S75-D11`](decisions.md#s75-d11--explicit-learning-design-create-output-selection-c-06): LD Create asks **What are you creating?** with **Self-study resource** · **Workshop** only; Create-time mapping onto existing delivery/page factors; no new output-type architecture; no Other/slideshow/assessment-pack options. Longer-term note: pack-declared outputs later — not in this slice. |

---

### C-07 — My Workflows mode landing vs selection persistence

| Field | Content |
| ----- | ------- |
| **Problem** | Post-save / return opens Edit or Settings when Run is likely next |
| **Evidence** | §3.13–3.14 · Theme 6 |
| **Surfaces** | My Workflows |
| **Constraints** | Preserve selection persistence |
| **Dependencies** | None |
| **Exclusions** | Settings parameter efficacy (PB-FA-005) |
| **Confidence** | **Medium–High** |
| **Status (2026-08-10)** | **Implemented** under [`S75-D10`](decisions.md#s75-d10--my-workflows-default--handoff-mode-c-07): Run = fresh-session default + Create→Run handoff; active-session mode preserved across area navigation. |

---

### C-08 — Create refinement state feedback and discoverability

| Field | Content |
| ----- | ------- |
| **Problem** | Review responses off-screen; Complete while refining |
| **Evidence** | §3.9–3.10 · Theme 3, 6 |
| **Surfaces** | Create Workflow assistant shell |
| **Constraints** | UX only — does not fix executable integrity |
| **Dependencies** | Independent of Theme 8 investigation |
| **Exclusions** | New review/QA mechanisms |
| **Confidence** | **Medium** |
| **Status (2026-08-11)** | **CLOSED AS RESOLVED** under [`S75-D22`](decisions.md#s75-d22--one-workflow--one-product-learning-design-create-simplification): original off-screen Review-responses / Complete-while-refining problem tracked the retired generic Create reviewer (`S75-D03`). Current pack-driven Q&A is adequate; no polish slice implemented. |

---

### C-09 — Save / update / duplicate semantics clarity

| Field | Content |
| ----- | ------- |
| **Problem** | Second save created duplicate workflow unintentionally |
| **Evidence** | §3.13 · Theme 7 |
| **Surfaces** | Create Workflow save · My Workflows list |
| **Constraints** | Product semantics — may need explicit update vs save-as-new |
| **Dependencies** | None |
| **Exclusions** | Version control system |
| **Confidence** | **Medium** (needs product rule) |

---

### C-10 — Run step guidance de-jargonisation

| Field | Content |
| ----- | ------- |
| **Problem** | Later-step Run prose dominated by implementation vocabulary |
| **Evidence** | §3.16 · Theme 5 |
| **Surfaces** | My Workflows Run step headers/guidance |
| **Constraints** | Preserve Copy accuracy; may be pack/content pass |
| **Dependencies** | None |
| **Exclusions** | Prompt contract changes |
| **Confidence** | **Medium** |
| **Status (2026-08-10)** | **Implemented** under [`S75-D08`](decisions.md#s75-d08--run-ux-simplification-operator-copy--execution-bar) via **Run-UI-only** descriptions (pack `runnerInstructions` deliberately not rewritten). Also: top Prev/Copy/Next bar; read-only Instructions prose; simplified paste placeholder. |

---

### C-11 — Dual “Settings” naming disambiguation

| Field | Content |
| ----- | ------- |
| **Problem** | Workflow Settings tab vs step Settings… (PS) share name |
| **Evidence** | Implementation investigation · Theme 6 |
| **Surfaces** | My Workflows · PS entry labels |
| **Constraints** | Labelling/entry clarity only — not PB-FA-005 contract fix |
| **Dependencies** | Optional coordination with future PB-FA-005 |
| **Exclusions** | PS UX discovery · parameter authority |
| **Confidence** | **Medium** |

---

### C-12 — Copilot follow-up suggestion mitigation (prompt-level)

| Field | Content |
| ----- | ------- |
| **Problem** | External LLM suggests continuing conversation after step terminal output |
| **Evidence** | §3.19 |
| **Surfaces** | Step prompt bodies (pack/content) |
| **Constraints** | Host UI may not be controllable |
| **Dependencies** | None |
| **Exclusions** | Copilot product changes |
| **Confidence** | **Low–Medium** |

---

## 12. Prioritisation recommendation (operator review — not authorisation)

### MUST ADDRESS IN SPRINT 75 (if implementation authorised)

| Rank | Slice | Rationale |
| ---- | ----- | --------- |
| 1 | **C-01** B→C handoff | **Done** (`S75-D04`) |
| 2 | **C-02** Authoring provenance | **Done** (`S75-D04`) |
| 3 | **C-03** Run first-use orientation | **Done** (`S75-D06`) — shipped as persistent lightweight Run guidance |
| 4 | **C-04** Conditional paste/store | **Done** (`S75-D07`) — page-structure producer visibility |
| 5 | **C-10** Run de-jargon + execution bar | **Done** (`S75-D08`) — Run-UI-only copy; top Prev/Copy/Next |

### SHOULD ADDRESS IF CAPACITY ALLOWS

| Slice | Rationale |
| ----- | --------- |
| **C-05** API prerequisite | **Done** (`S75-D09`, amended) — action gate on Design workflow; Create always navigable |
| **C-07** Mode landing | **Done** (`S75-D10`) — Run default + Create handoff; session mode preserved |
| **C-06** Output capability | **Done** (`S75-D11`) — Self-study · Workshop Create chooser |
| **C-08** Refinement feedback | **CLOSED AS RESOLVED** (`S75-D22`) — original problem superseded by `S75-D03` retirement |

### DEFER / BACKLOG

| Item | Rationale |
| ---- | --------- |
| **PB-FA-005** Settings / parameterisation | Underlying model — documented; not Sprint 75 |
| **PB-R-009** Per-run profile | Research — tied to PB-FA-005 |
| **C-09** Save/update semantics | Needs product rule |
| **C-11** Settings naming | Lower severity; partial overlap PB-FA-005 |
| **C-12** Copilot follow-ups | Uncertain controllability |
| Domains **D–E** discovery | Not observed |
| Authoring peer-tab IA | Adequate; hypothesis only |
| Video duplicated heading | Minor presentation |
| SCORM | Future context |
| Pack-declared `supportedOutputs` | Longer-term architecture note under `S75-D11` — not this slice |

### REQUIRES MORE EVIDENCE

| Item | Rationale |
| ---- | --------- |
| **Custom-workflow Run behaviour** | **Resolved** under `S75-D07` — non-page `outputName` ≠ paste; page/`page` producer keeps gate |

*(Theme 8 generic reviewer: investigation **complete**; retired under `S75-D03`. Future QA lifecycle → **PB-FA-006** — not “more evidence” for the retired path.)*

---

## 13. Documentation contradictions noted

| Location | Issue | Resolution in programme |
| -------- | ----- | ---------------------- |
| Operator synthesis §6.2 | “Settings efficacy not systematically audited” | Superseded for programme position: investigation **complete**, deferred **PB-FA-005** — see [STATUS.md](STATUS.md), this document |
| Operator synthesis §3.7, §3.21 | Design Episode Plan no Settings “may be omission” | Investigation: **intentional** (deterministic derive) — backlog PB-FA-005 §4 |
| Operator synthesis §6.3 item 1 | Lists Settings efficacy as deferred investigation | Now **backlog-deferred**, not open Sprint 75 investigation |
| T-010 journey map § deferred | Settings “not audited” | Updated in pack STATUS/CONTEXT; historical T-010 addenda unchanged |

No contradiction on Sprint 74 closure or Sprint 76 not opened.

---

## 14. Related documents

- Operator transcript (historical): [S75-T-010-domain-a-operator-observation-synthesis.md](S75-T-010-domain-a-operator-observation-synthesis.md)  
- Journey map: [S75-T-010-primary-journey-map-and-domain-a-decomposition.md](S75-T-010-primary-journey-map-and-domain-a-decomposition.md)  
- Backlog: [PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency)  
- Programme status: [STATUS.md](STATUS.md) · [PLAN.md](PLAN.md) · [HANDOVER.md](HANDOVER.md)

---

## 15. Stop condition

Cross-journey synthesis **complete**. Theme 8 generic reviewer **retired** (`S75-D03`). **C-01/C-02** handoff + provenance **implemented** (`S75-D04`). **C-03** Run orientation **implemented** as persistent lightweight guidance (`S75-D06`). **C-04** Run capture relevance **implemented** (`S75-D07`). **C-10** / Run UX simplification **implemented** (`S75-D08` — Run-UI-only descriptions + execution bar; pack RI unchanged). **C-05** Create Workflow API-key prerequisite **implemented** (`S75-D09`; **amended**: action gate, not navigation; **presentation** further amended by `S75-D23`). **C-07** My Workflows mode default/handoff **implemented** (`S75-D10`). **C-06** LD Create output honesty **implemented** (`S75-D11`). **C-08** refinement discoverability **CLOSED AS RESOLVED** (`S75-D22`). LD Create one-product simplification **implemented** (`S75-D22`). Create assistant progressive disclosure **implemented** (`S75-D23`). Resolved workflow brief panel **removed from Create UI** (`S75-D24`; resolution engine retained). Create **Proposed workflow** read-only preview; Create Draft/Refined chrome retired (`S75-D25`; pack post-generation refinement retained for **PB-FA-005**). Remaining candidate slices (C-09/C-11/C-12) **await operator review**. Sprint 76 **not opened.**
