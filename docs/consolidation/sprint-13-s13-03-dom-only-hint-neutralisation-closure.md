# Sprint 13 — S13-03 DOM-only hint neutralisation closure

**Date:** 2026-05-13  
**Path:** `docs/consolidation/sprint-13-s13-03-dom-only-hint-neutralisation-closure.md`

**Role:** Close the **bounded** S13-03 implementation slice: **Factory DOM helper copy** only, per **`sprint-13-s13-03-implementation-review-bounded-proposal.md`**.

**No full portability claim.** This slice **does not** neutralise **prompt-facing** domain markdown or pack **`uiHints`** in WGC-loaded context.

---

## 1. Scope (strict)

| In scope | Out of scope (unchanged) |
|----------|--------------------------|
| **`renderWorkflowFactoryDomainUiHints`** in **`app.js`** only | Domain-pack markdown; **`uiHints`** JSON in packs; **`workflowGenerationContext.js`**; **`buildWorkflowDesignBrief`** / **`briefLines`**; Prompt Studio; persistence / import / export; orchestration; starting-artefact logic; **`renderWorkflowDetailDomainUiHints`**; **`updateWorkflowFactoryInputsCopyFromStartingPoint`**; title-based heuristics; Sprint 12 artefacts |

---

## 2. Exact copy changes (`app.js`)

All edits are **fallback `String(... \|\| literal)`** values and **removal** of a post-assign overwrite block. **`hints.*`** from **`getWorkflowBriefConfig`** still win when present.

| DOM target | Change |
|------------|--------|
| **`#wfDesignDesiredOutputsHint`** | **Fallback** when `hints.desired_outputs` absent: **from** `What the learner-facing page should contain, plus supporting artefacts this design run should produce (orchestrated through the workflow below).` **to** `Primary deliverables and supporting artefacts this design run should produce (orchestrated through the workflow below).` |
| **`#wfDesignConstraintsHint`** | **Fallback** when `hints.constraints` absent: **from** `…Describe learner pace or grouping…` **to** `…Describe pace or grouping…` |
| **Learning Design overwrite removed** | **Deleted** the block that, when **`learning-design`** was selected, **always** overwrote **`#wfDesignDesiredOutputsHint`** and **`#wfDesignConstraintsHint`** with LD-specific strings (after pack values had been applied). Learning Design now respects **`hints.desired_outputs`** / **`hints.constraints`** when the pack supplies them, and uses the **shared** fallbacks above when not. |

**Unchanged** in this function: **`#wfDesignIntentHint`**, **`#wfDesignAudienceHint`**, **`#wfDesignScaleHint`**, **`#wfDesignScale`** placeholder, **`#wfDesignInputsHint`** literals and logic.

---

## 3. Verification

| Check | Result |
|-------|--------|
| **`node --test tests/*.test.js`** | **16** passed, **0** failed (recorded at closure authoring time). |
| **Runtime smoke** (browser) | **Not run** for this closure — **not inferred** from tests. |

---

## 4. Residual risk (explicit)

- **Prompt-facing domain markdown and pack `uiHints`** loaded by **`workflowGenerationContext`** into **`promptContext`** are **unchanged**. DOM neutralisation **does not** remove or rewrite that channel.
- **Dual wording:** **`briefLines`** prefixes in **`buildWorkflowDesignBrief`** are unchanged; on-screen helpers may still **diverge** from brief line labels.

---

## 5. Boundaries confirmed

| Statement | Status |
|-----------|--------|
| **Sprint 12** | **Untouched** — no Sprint 12 reopening or artefact edits for this slice. |
| **Prompt / model payloads** | **Unchanged** — no edits to **`buildWorkflowDesignBrief`**, **`continueWorkflowDesignGeneration`**, **`callOpenAIForWorkflowDesign`**, or WGC assemblers. |
| **Domain packs** | **Unchanged** — no pack file edits. |
| **Persistence / import / export / orchestration** | **Unchanged**. |

---

## 6. Related artefacts

| Document | Role |
|----------|------|
| [`sprint-13-s13-03-implementation-review-bounded-proposal.md`](sprint-13-s13-03-implementation-review-bounded-proposal.md) | Pre-implementation scope |
| [`sprint-13-s13-03-display-only-hint-neutralisation-audit.md`](sprint-13-s13-03-display-only-hint-neutralisation-audit.md) | Evidence audit |
| [`sprint-13-s13-03-decision-gate-note.md`](sprint-13-s13-03-decision-gate-note.md) | Governance |

---

## Review log

- **2026-05-13** — S13-03 DOM-only hint neutralisation closure recorded (`sprint-13-s13-03-dom-only-hint-neutralisation-closure.md`).
