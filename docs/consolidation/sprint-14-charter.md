# Sprint 14 — Charter: Research Domain Runnable Maturity

**Date:** 2026-05-14  
**Path:** `docs/consolidation/sprint-14-charter.md`

**Sprint title:** Sprint 14 — Research Domain Runnable Maturity

**Status:** **Charter + first implementation / verification slice (2026-05-14)** — intent, boundaries, and **documented closure** of the initial Research runnable-quality pass. Further work stays bounded by **§9** exclusions (no renderer programme, no Sprint **12**/**13** reopeners). **Residual risks:** **`sprint-14-current-known-issues.md`** §§**10–11**.

---

## 1. Purpose (one sentence)

Make **Research** workflows **usable and trustworthy** for authors who select **Research** as the runnable Workflow Factory domain—not to redesign PRISM’s architecture or domain-pack portability posture.

---

## 2. Goals

- **Author confidence:** Authors can run **Research**-scoped workflow generation and obtain **coherent, reviewable** step plans and prompts without hidden dependence on Learning Design semantics.
- **Pack–runtime alignment:** Research **`workflowPolicy`**, **`workflowBriefConfig`**, step patterns (including **`promptFactory`** / **`runnerInstructions`**), and **`domain-research-artefacts.md`** contracts **read as one story** to humans and to generation paths (gaps documented and reduced).
- **Elicitation fit:** Required / optional factors, **`uiHints`**, **`extraFields`**, and inference/mapping rules for Research are **testable** and **predictable** for common scenarios (topic-only, uploaded material, mixed).
- **Runner usability:** Where Research steps expose **`runnerInstructions`**, guidance is **actionable** in sequence execution—not placeholder tone or LD-shaped copy.
- **Regression safety:** Improvements **do not** regress **Learning Design** runnable behaviour, **General** baseline-only behaviour, persistence/import/export schemas, or Sprint **12** structural tests without explicit charter extension.

---

## 3. Non-goals

- **Orchestration rewrite** of workflow generation, refinement, or run-mode pipelines.
- **Portability programme** or “drop-in third-party pack” redesign (see Sprint 13 boundary docs; Sprint 14 is **product** on Research, not **platform** portability).
- **Schema redesign** for saved workflows, bundles, or manifest structure.
- **Workflow chaining** / multi-workflow orchestration / graph execution engine.
- **Broad `app.js` decomposition** or module-boundary sprint masquerading as Research polish.
- **Learning Design elicitation overhaul** — explicitly deferred; may be a **later** sprint after Research maturity baseline is clear.

---

## 4. Constraints

- **Governance:** Pack and `app.js` changes remain **bounded**; any cross-cutting change needs explicit call-out in sprint notes or a follow-on charter.
- **Compatibility:** Preserve **persistence / import / export** field shapes unless a separate persistence charter approves migration.
- **Baseline General:** **General** stays **always-on** and **not** user-selectable as runnable; Research work **must not** reintroduce General as a Factory runnable option.
- **Sprint boundaries:** **Do not** reopen **Sprint 12** closure obligations. **Do not** restate Sprint **13** as incomplete—Sprint 14 builds **forward** on clarified v1 runnable-domain posture.

---

## 5. Runnable-domain framing (v1)

| Role | Domain ids (conceptual) |
|------|-------------------------|
| **Baseline (always merged)** | **`general`** — principles, prompt rules, shared contracts; not Factory-runnable alone. |
| **Runnable (Factory user choice)** | **`learning-design`**, **`research`** — each supplies structured **`getWorkflowBriefConfig`** and step-pattern catalogue for generation. |

Sprint 14 **owns depth** on **`research`** only for this sprint’s implementation scope.

---

## 6. General baseline-only clarification (reference)

**General baseline-only** behaviour and Factory UX are documented in **`sprint-13-general-alwayson-first-structured-domain-behaviour.md`** §**Current v1 — General baseline-only**. Sprint 14 **assumes** that posture and **does not** revisit it except where Research-specific copy accidentally implies General is runnable.

---

## 7. Expected deliverables

**First slice (delivered, 2026-05-14 — see `sprint-14-current-known-issues.md` §10):** Research pack policy/brief fixes (analysis **`triggerRules`**, **`Generate Research Content`** **`stepRoleAnchors`**, **`objective_type`** value/label selects, **`extraFields` / `uiHints` / `mappingRules`** alignment), targeted **`app.js`** heuristics and normalisation (upload-path **Generate Research Content** suppression, **Design Page** terminal append for briefing-style Research flows, self-binding strip, **`selectedDomains`** sync on edit/save), Node tests under **`node --test tests/*.test.js`**, and **manual API-backed verification** on the local dev server (**`npm run dev`** / **`scripts/dev-server.js`**).

**Later slices (not implied):** further prompt-quality tuning, exhaustive export audits, renderer polish — **§11** remaining-work list; **not** a charter to widen Sprint 14 into LD-style renderer redesign.

---

## 8. Verification expectations

- **Happy-path smoke:** Workflow Factory → select **Research** → complete brief essentials → generate → save → re-open (manual checklist; may be recorded in a sprint verification note).
- **Automated:** **`node --test tests/*.test.js`** (or scoped test glob agreed in implementation pass) **green** after changes.
- **LD / General regression:** Spot-check that **Learning Design** generation still passes smoke; **General-only** Factory path remains blocked as today.
- **No new portability claim:** Verification notes **must not** claim full drop-in pack portability.

---

## 9. Explicit exclusions (must not appear as Sprint 14 scope creep)

| Excluded | Rationale |
|----------|-----------|
| Orchestration rewrite | Stability; out of charter. |
| Portability / manifest architecture redesign | Sprint 13 documented boundaries; Sprint 14 is Research **quality**, not platform **shape**. |
| Schema redesign | Requires persistence charter. |
| Workflow chaining | Different product surface. |
| Broad `app.js` decomposition | Different sprint class. |

---

## 10. Live observations → closure status (pointer)

Original **2026-05-14** observations (**upload-first vs Generate Research Content**, **missing Design Page terminal**) remain **archived in intent** in **`sprint-14-current-known-issues.md`** §**9** as **I9.1** / **I9.2**.

**Current posture (same consolidation pass):**

- **I9.1** — **Mitigated** (heuristic suppression + normalisation/tests).
- **I9.2** — **Partially mitigated / validated** — **Design Page** append for Research briefing-style flows; **manual** runtime chain verified (**Normalize → findings → thematic analysis / briefing → validation → Design Page**). **Residual:** Utilities/renderer polish for Research **`page`** output — **explicitly not** a Sprint 14 scope expansion into full renderer redesign (**known issues §11**).

Authoritative detail, evidence pointers, and **E4.x** register updates: **`sprint-14-current-known-issues.md`**.

---

## 11. Review log

- **2026-05-14** — Initial charter drafted (scaffolding; documentation only).
- **2026-05-14** — §**10** added: pointer to **I9.1** / **I9.2** (validated observations; no implied redesign).
- **2026-05-14** — **Consolidation pass:** §**7** reframed for **delivered first slice**; §**10** updated to **mitigated / partially mitigated** status with pointer to **`sprint-14-current-known-issues.md`** §§**9–11**; document **status** header updated.
