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

## Review log

- **2026-05-14** — Initial register seeded from charter context and high-level pack skim (documentation only).
