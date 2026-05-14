# Sprint 14 — Current known issues (Research runnable maturity)

**Date:** 2026-05-14 (initial register); **consolidation pass:** 2026-05-14  
**Path:** `docs/consolidation/sprint-14-current-known-issues.md`

**Role:** Register **observed or suspected** gaps affecting **Research** as a runnable domain, plus **Sprint 14 implementation closure** notes where items moved to **mitigated** / **partially mitigated**. This file **does not** charter renderer redesign, **does not** reopen Sprint **12** or **13**, and **does not** substitute executable verification (see evidence pointers).

**Portable pack mirror:** `docs/development/sprints/2026-05-14-sprint-14-research-domain-runnable-maturity/context-files/sprint-14-current-known-issues.md` should match this document when the pack is refreshed.

---

## 1. How to use this register

- **Status:** Each item should move to **validated**, **mitigated**, **won’t fix (chartered)**, or **out of scope** as work completes.
- **Evidence:** Prefer **test names**, **file paths**, or **short verification notes** (manual Factory run, export checklist). Where automation did not read a downloaded export file, that limitation is stated explicitly.

---

## 2. Generated prompt quality (Research)

- **G2.1** — Research-generated step prompts may read **generic** relative to the breadth implied by **`workflowPolicy`** (many canonical steps; unclear which subset applies to a short brief). **Status:** Open.
- **G2.2** — **Objective type** may not **tighten** the model’s step selection as much as authors expect (**trigger rules** vs planner behaviour). **Status:** Open for exhaustive planner proof; **partial relief** — Research **`workflowPolicy.triggerRules`** now includes an **`analysis`** branch (see **E4.4**), so analysis briefs are no longer structurally untriggered at the pack level.
- **G2.3** — Cross-step **artefact naming** in generated workflows may not always match Research pack vocabulary—usability when editing in Manual Builder not systematically reviewed. **Status:** Open (see **§11** naming consistency note).

---

## 3. Runner usability (Research)

- **R3.1** — **`runnerInstructions.what_this_step_does`** exists per Research step pattern in pack; **length, tone, and ordering** for long research sequences not validated for cognitive load in run mode. **Status:** Open (**§11** — quality review remains optional follow-up).
- **R3.2** — Research steps that assume **prior artefact** quality may give **weak** runner guidance when upstream steps were skipped or thin—no “recovery” pattern documented. **Status:** Open.

---

## 4. Elicitation / brief weaknesses (Research)

- **E4.1** — **`objective_type`** select choices previously used **bare strings** while other factors used **`{ value, label }`** — potential UI / normalisation inconsistency vs Learning Design. **Status: Mitigated** — Research **`workflowBriefConfig`** now uses **`{ value, label }`** objects for **`objective_type`** (and related selects where aligned). **Evidence:** `domains/research/domain-research-step-patterns.md` (**`### Workflow Brief Config`**).
- **E4.2** — **Optional** factors (e.g. citation style, evidence rigour) may be **under-elicited** in fast paths—whether defaults are safe for research outputs not assessed. **Status:** Open.
- **E4.3** — **(`extraFields` / `uiHints` / `mappingRules`)** — Risk that Research **`extraFields`** (e.g. evidence rigour), Factory **`uiHints`**, and **`mappingRules`** would not propagate consistently into gather UI, inferred brief state, and persisted **`workflowOutputSpec`** / constraints. **Status: Mitigated** for the Sprint 14 chartered alignment pass (pack + app wiring reviewed; not a claim of formal proof for every edge path). **Evidence:** Research pack **`workflowBriefConfig`**; Factory resolution behaviour covered by workflow-brief tests where factors map to constraints.
- **E4.4** — **(`objective_type: analysis` vs `triggerRules`)** — Baseline audit **K8.2**: **`triggerRules`** branched on **`summary` / `briefing` / `questions`** only while **`analysis`** was a required **`objective_type`** choice. **Status: Mitigated** — **`analysis`** branch added to **`workflowPolicy.triggerRules`**. **Evidence:** `domains/research/domain-research-step-patterns.md` (**`### Workflow Policy`** JSON).
- **E4.5** — **`stepRoleAnchors`** omitted **`Generate Research Content`** while **`canonicalSteps`** included it. **Status: Mitigated** — anchor text added for **`Generate Research Content`**. **Evidence:** `domains/research/domain-research-step-patterns.md` — **`stepRoleAnchors`**.

> **Id note:** **E4.3** and **E4.4** were **introduced at this consolidation pass** to track closures that the initial register folded into baseline **K8.x** / narrative gaps; older notes may refer only to **K8.2** for the analysis trigger item.

---

## 5. Artefact-flow risks (Research)

- **A5.1** — **`workflowPolicy.dependencies`** reference artefact ids; alignment with **`domain-research-artefacts.md`** and generated step **`outputName`** conventions not fully proven under stress scenarios. **Status:** Open.
- **A5.2** — **Generate Research Content** vs **Normalize Content** ordering in policy vs numbered sections in pack—authors may misunderstand which step “owns” first materialisation. **Status:** Open (pack clarifies documentation order vs **`canonicalSteps`**; further author UX optional).

---

## 6. UX confusion points (Workflow Factory)

- **U6.1** — After **General baseline-only** change, shared Factory hints may still feel **LD-flavoured** unless Research **`uiHints`** consistently override—needs **spot-check** per screen. **Status:** Open (spot-check not exhaustively recorded).
- **U6.2** — **Starting point** / **`input_strategy`** behaviour for Research uses pack-driven choices; parity with Learning Design **trio** path may confuse authors who switch domains. **Status:** Open.

---

## 7. Prompt Studio vs Workflow Factory (quality mismatch)

- **P7.1** — Prompt Studio refinement with **`state.workflowSelectedDomains`** including **Research** vs Factory-generated workflows — systematic comparison **not** completed. **Status:** Open.
- **P7.2** — **Perceived quality gap:** users may judge Research Factory output against **LD-shaped** mental models. **Status:** Open.

---

## 8. Items observed elsewhere but not deeply analysed here

- Deferred WGC/runtime orchestration coverage from **Sprint 11 closure** — **not** Sprint 14 unless a narrow test is chartered.
- **S13-02** default-domain policy remains **decision-gated**—Sprint 14 **does not** resolve S13-02 by changing defaults.

---

## 9. Runnable delivery & ingestion (live generation + heuristics)

**Scope:** Product/runtime behaviour and **narrow** `app.js` heuristics / normalisation—**not** orchestration redesign and **not** Sprint **12**/**13** reopeners.

- **I9.1** — **Uploaded-source ingestion posture:** Workflows with **authoritative uploaded material** previously **over-used** **Generate Research Content**; desired semantics: prefer **Normalize → Extract Key Findings →** analysis/synthesis unless generation-only / topic-first paths apply. **Status: Mitigated** — **`applyWorkflowDesignHeuristics`** in **`app.js`** strips **Generate Research Content** when Research is active, **`input_strategy`** is **`provided_source_content`** (or equivalent posture), the brief is not generation-only, and source inputs / starting artefact indicate upload authority (parallel to the LD rule for **Generate Learning Content**; **`mixed`** / **`generate_from_topic`** unchanged). **Evidence:** heuristic logic in **`app.js`**; **`node --test`** includes workflow design / normalisation coverage (e.g. research design-page heuristic tests, persistence export shape tests).
- **I9.2** — **Render / review endpoint:** Research-shaped workflows often terminated at abstract synthesis/formatting without a **Design Page**-class step. **Status: Partially mitigated / validated** — **Research Design Page** terminal delivery: pack policy + **`applyWorkflowDesignHeuristics`** append a **Design Page** step for briefing-style objectives when the model did not already emit one; duplicate insertion guarded. **Runtime verification (manual, API-backed dev server):** Research + **Use uploaded material** + **evidence rigour: standard** + briefing-style brief produced **Normalize Content → Extract Key Findings → Conduct Thematic Analysis → Generate Briefing Note → Validate Research Output → Design Page** with **`outputName`** **`page`** on the terminal step. **Residual:** Utilities/renderer polish for Research-originated **`page`** payloads remains **out of charter** for Sprint 14 core (**§11**); broader **Learning Design** renderer lessons stay **later**.

---

## 10. Consolidation — completed work captured (Sprint 14, no renderer programme)

The following shipped or was verified in the **Sprint 14** pass documented here (code exists in repo; this section is the **documentation mirror**):

| Theme | Notes |
|-------|--------|
| **Research `workflowPolicy`** | **`triggerRules`** extended for **`objective_type: analysis`**; **`stepRoleAnchors`** completed for **Generate Research Content** (see **E4.4**, **E4.5**). |
| **`objective_type` UI** | Value/label objects for primary objective select (see **E4.1**). |
| **`extraFields` / `uiHints` / `mappingRules`** | Propagation and mapping into brief/constraints paths aligned for chartered Research scenarios (see **E4.3**). |
| **Upload-path suppression** | **Generate Research Content** removed from default chain when uploads are authoritative (see **I9.1**). |
| **Local dev API-key server** | **`npm run dev`** → **`scripts/dev-server.js`** serves PRISM on **`127.0.0.1:8787`** (default), reading **`OPENAI_API_KEY`** from **`.env.local`** when present — suitable for API-backed Factory verification without widening sprint scope. |
| **Self-binding hygiene** | Generated/saved workflows: **`normalizeWorkflowForV1`** strips internal bindings where **`sourceStepId`** equals the consuming step; tests cover no-self-binding and related persistence paths (**`PE-normalise-no-self-binding`**, related **`PE-*`** tests). |
| **`selectedDomains` on edit/save** | **`syncWorkflowSelectedDomainsFromWorkflowRecord`** prevents My Workflows edit/save from collapsing Research workflows back to general-only global state; covered by **`PE-selected-domains-*`** tests. |
| **Research Design Page endpoint** | Terminal **Design Page** heuristic + pack **§13**-style policy for briefing/page intent; **`tests/workflow-research-design-page-heuristic.test.js`** and related **`node --test`** coverage. |
| **Automated regression** | **`node --test tests/*.test.js`** green on the consolidation pass (full glob). |

---

## 11. Consolidation — remaining work (explicitly not a renderer redesign charter)

| Item | Rationale |
|------|-----------|
| **Renderer polish** | Research-originated **`page`** JSON may still need Utilities/HTML polish—**product follow-up**, not Sprint 14 portability or LD renderer **redesign**. |
| **Naming consistency** | Observed generated **`outputName`** for validation sometimes **`validated`** vs pack vocabulary **`validated_research_output`** — optional normalisation / docs crosswalk (**§9** verification used UI + heuristics; export JSON byte audit optional). |
| **Optional export JSON audit** | Downloaded **Export selected** bundle not always parsed in automated verification; manual audit of **`inputBindings`**, **`selectedDomains`**, and DAG still useful for governance. |
| **`runnerInstructions` quality** | **R3.1** — editorial pass on tone, length, ordering for long sequences. |
| **Broader LD renderer lessons** | Explicitly **later**; **does not** belong in Sprint 14 closure scope creep. |

---

## Review log

- **2026-05-14** — Initial register seeded from charter context and high-level pack skim (documentation only).
- **2026-05-14** — §**9** added (**I9.1**, **I9.2**): validated live-generation notes on ingestion semantics and render-bridge gap (observations only).
- **2026-05-14** — **I9.1** mitigation note: Research upload-path **Generate Research Content** suppression in **`app.js`** **`applyWorkflowDesignHeuristics`** (prior register text).
- **2026-05-14** — **Consolidation documentation pass:** **E4.1**, **E4.3**, **E4.4**, **E4.5**, **I9.1** marked **mitigated**; **I9.2** **partially mitigated** with Design Page endpoint + runtime verification summary; added **§§10–11** (completed / remaining work); **G2.2** cross-reference to **E4.4**; id note for **E4.3**/**E4.4**.
