# Sprint 14 — Current known issues (Research runnable maturity)

**Date:** 2026-05-14  
**Path:** `docs/consolidation/sprint-14-current-known-issues.md`

**Role:** Register **observed or suspected** gaps affecting **Research** as a runnable domain—**before** deep implementation analysis. Items are **not** prioritised commitments; they feed charter scoping and later verification.

**Documentation only:** This file **does not** assert root causes or mandate fixes.

---

## 1. How to use this register

- **Status:** Each item should eventually move to **validated**, **mitigated**, **won’t fix (chartered)**, or **out of scope** during Sprint 14 execution.
- **Evidence:** When implementation begins, each item should gain a pointer (test name, issue id, or verification note)—empty for now.

---

## 2. Generated prompt quality (Research)

- **G2.1** — Research-generated step prompts may read **generic** relative to the breadth implied by **`workflowPolicy`** (many canonical steps; unclear which subset applies to a short brief).
- **G2.2** — **Objective type** (`summary` / `analysis` / `briefing` / `questions`) may not **tighten** the model’s step selection as much as authors expect (trigger rules vs planner behaviour not yet validated under real API runs).
- **G2.3** — Cross-step **artefact naming** in generated workflows may not always match Research pack vocabulary—usability when editing in Manual Builder not systematically reviewed.

---

## 3. Runner usability (Research)

- **R3.1** — **`runnerInstructions.what_this_step_does`** exists per Research step pattern in pack; **length, tone, and ordering** for long research sequences not validated for cognitive load in run mode.
- **R3.2** — Research steps that assume **prior artefact** quality may give **weak** runner guidance when upstream steps were skipped or thin—no “recovery” pattern documented.

---

## 4. Elicitation / brief weaknesses (Research)

- **E4.1** — **`objective_type`** choices in Research **`workflowBriefConfig`** use **bare string** select choices (`"summary"`, …) whereas other factors use **`{ value, label }`** objects—potential UI / normalisation inconsistency vs Learning Design (cosmetic or deeper—**unvalidated**).
- **E4.2** — **Optional** factors (e.g. citation style, evidence rigour) may be **under-elicited** in fast paths—whether defaults are safe for research outputs not assessed.
- **E4.5** — **`stepRoleAnchors`** in Research **`workflowPolicy`** omits **`Generate Research Content`** while **`canonicalSteps`** includes it — pack **completeness / planner hint** gap (see baseline audit §**3**).

---

## 5. Artefact-flow risks (Research)

- **A5.1** — **`workflowPolicy.dependencies`** reference artefact ids (`research_content`, `topic`, …); alignment with **`domain-research-artefacts.md`** and generated step **outputName** conventions not fully proven under stress scenarios.
- **A5.2** — **Generate Research Content** vs **Normalize Content** ordering in policy vs numbered sections in pack—authors may misunderstand which step “owns” first materialisation (documentation / UX clarity).

---

## 6. UX confusion points (Workflow Factory)

- **U6.1** — After **General baseline-only** change, placeholder **“Choose a domain…”** + **Research** may still show **LD-flavoured** copy in shared Factory hints unless Research **`uiHints`** consistently override—needs **spot-check** per screen.
- **U6.2** — **Starting point** / **input_strategy** behaviour for Research uses pack-driven choices; parity with Learning Design **trio** path (app-owned literals) may confuse authors who switch domains (`sprint-13-starting-artefact-*` lineage—Research branch not re-baselined in browser).

---

## 7. Prompt Studio vs Workflow Factory (quality mismatch)

- **P7.1** — Prompt Studio refinement may inject **`state.workflowSelectedDomains`** including **Research**; behaviour when Research **step pattern catalog** is thinner or different from LD **not** systematically compared to Factory-generated workflows.
- **P7.2** — **Perceived quality gap:** users may judge Research Factory output against **LD-shaped** mental models (“lesson”, “assessment”)—expectation management and copy not yet unified.

---

## 8. Items observed elsewhere but not deeply analysed here

- Deferred WGC/runtime orchestration coverage from **Sprint 11 closure** (fetch failure, cache, missing files)—**not** Sprint 14 unless a narrow test is chartered.
- **S13-02** default-domain policy remains **decision-gated**—Sprint 14 should **not** silently resolve S13-02 by changing defaults.

---

## 9. Runnable delivery & ingestion (validated under live workflow generation)

**Scope note:** Items here record **observed product/runtime behaviour** from **live** Workflow Factory generation runs. They are **not** approved changes, **not** a charter to redesign orchestration, and **not** portability work.

- **I9.1** — **Uploaded-source ingestion posture:** Workflows that rely on **authoritative uploaded material** currently **over-trigger** or over-emphasise **Generate Research Content**. Observed expectation: processing should **preferentially** begin **Normalize → Extract Key Findings →** downstream analysis/synthesis as the brief implies **Generate Research Content** should mainly denote **topic-only** materialisation, **exploratory synthesis**, **grounding expansion**, or **gap-filling**—not the default first hop when uploads are primary. **Evidence:** live generation (Sprint 14); treat as **runnable-quality** register entry, not a hypothesis alone. **Mitigation (2026-05-14):** `applyWorkflowDesignHeuristics` in `app.js` strips **Generate Research Content** when **Research** is in `hints.selectedDomains`, **`input_strategy`** is **`provided_source_content`**, the brief is not **generation-only**, and either **source inputs** are present or the Factory **starting artefact** is **provided_source_content** (parallel to the existing LD rule for **Generate Learning Content**; **`mixed`** and **`generate_from_topic`** unchanged).
- **I9.2** — **Render / review endpoint:** Research-shaped generated workflows commonly **terminate at abstract synthesis or formatting** stages and **do not** normally end in a **Design Page**-class step the way many **Learning Design** flows do. Effect: weaker **renderer integration**, **human reviewability**, and **downstream platform consistency** relative to LD-shaped “page at the end” expectations. **Possible** future direction (documentation only): a **normal runnable endpoint** using **Design Page** (or equivalent) as a **render bridge**—**not** chartered here.

---

## Review log

- **2026-05-14** — Initial register seeded from charter context and high-level pack skim (documentation only).
- **2026-05-14** — §**9** added (**I9.1**, **I9.2**): validated live-generation notes on ingestion semantics and render-bridge gap (observations only).
- **2026-05-14** — **I9.1** mitigation: Research upload-path **Generate Research Content** suppression in `app.js` `applyWorkflowDesignHeuristics` (see **I9.1** bullet).
