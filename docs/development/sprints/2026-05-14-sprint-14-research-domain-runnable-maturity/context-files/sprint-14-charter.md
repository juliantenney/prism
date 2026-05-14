# Sprint 14 — Charter: Research Domain Runnable Maturity

**Date:** 2026-05-14  
**Path:** `docs/consolidation/sprint-14-charter.md`

**Sprint title:** Sprint 14 — Research Domain Runnable Maturity

**Status:** **Charter / scaffolding** — defines intent and boundaries before implementation passes are opened. This document **does not** alone authorise code or pack edits; execution requires an explicit implementation gate consistent with project governance.

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

## 7. Expected deliverables (when implementation is chartered)

Deliverables are **staged**; exact commits depend on a future implementation gate. **Illustrative** categories:

1. **Research pack revisions** — step titles, policies, prompt factories, runner instructions, artefact names, brief factors, and **`uiHints`** tuned for research workflows.
2. **Targeted `app.js` adjustments** — only where Research **must** align with Factory UI, elicitation, or generation (no broad refactors).
3. **Tests / fixtures** — Node or golden tests where Sprint 11 / 12 patterns already exist; extend **only** as needed for Research assertions.
4. **Documentation** — closure or “pass” note updating this charter with **verified** behaviours and **known residual risks**.

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

## 10. Review log

- **2026-05-14** — Initial charter drafted (scaffolding; documentation only).
