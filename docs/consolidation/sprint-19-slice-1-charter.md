# Sprint 19 Slice 19-1 — LD Question Policy Pilot

**Date:** 2026-05-15  
**Status:** **Closed** — Option A implemented; see [`sprint-19-slice-1-closeout.md`](sprint-19-slice-1-closeout.md)  
**Sprint:** 19 — Learning Design Workflow Rationalisation  
**Slice:** 19-1

**Context pack:** `docs/development/sprints/2026-05-15-sprint-19-ld-workflow-rationalisation/`  
**LD audit:** `docs/audits/ld-workflow-generation-rationalisation-audit.md`  
**Sprint 18 closeout:** `docs/development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md`

**Verification baseline:**

```bash
node --test tests/*.test.js
```

**Expected:** **100 passed**, 0 failed

---

## 0. Runtime wiring (authoritative — read before interpreting this slice)

`questionPolicy.askRefinementByDefault` is read in **`getWorkflowRefinementQueue`** (`app.js`). That function is called from **`continueWorkflowDesignGeneration` after workflow synthesis**, not before the first design pass.

| Mechanism | When it runs | Slice 19-1 effect |
|-----------|--------------|-------------------|
| **Required essentials** | Pre-synthesis when `resolveWorkflowBriefFactors` has `missing` | **Unchanged** — still blocking |
| **`getWorkflowRefinementQueue`** | **Post-synthesis** — generic `refinementFactors` | **Disabled** when `askRefinementByDefault: false` (Option A) |
| **`stepRefinementProfiles`** | **Post-synthesis** — replaces queue when profile matches | **Unchanged** |
| **Post-workflow elicitation** | After design when profile required tiers need unresolved step parameters | **Still legitimate** for LD |

**Documentation correction:** Early charter and audit text referred to reducing **“pre-design”** refinement. That was **imprecise**. Slice 19-1 pilots disabling the **generic post-synthesis `refinementFactors` queue**, not a separate pre-design refinement queue (the runtime does not call `getWorkflowRefinementQueue` before synthesis).

---

## 1. Purpose

Reduce **generic post-synthesis** refinement noise (form-wizard feel from `refinementFactors` chat after the step list exists) by piloting `workflowBriefConfig.questionPolicy` **before** implementing `planningAdequacyChecks` (Slice 19-2).

Sprint 19 is **audit-first**; Slice 19-1 was a **pack-policy pilot only** — no runtime, adequacy, or profile changes.

---

## 2. Scope

| In scope (Slice 19-1) | Out of scope (Slice 19-1) |
|-------------------------|---------------------------|
| LD `questionPolicy` pilot (Option A implemented) | Runtime changes (`app.js`) |
| Manual validation matrix M1–M4 | LD `planningAdequacyChecks` |
| Closeout + charter wording correction | `stepRefinementProfiles` removal or thinning |
| | Research pack or tests |
| | Renderer, schema, Prompt Studio merge |

**Implemented:** `askRefinementByDefault: false` in LD pack only.

**Not implemented:** Option B; `maxRefinementQuestions` left at **8**.

---

## 3. Non-goals

- No runtime rewrite  
- No LD adequacy checks (`planningAdequacyChecks`)  
- No `stepRefinementProfiles` removal or profile queue thinning  
- No Research pack, Research tests, or Research fixture changes  
- No renderer or workflow schema changes  
- No Prompt Studio product merge  
- No change to **`getWorkflowRefinementQueue` implementation** — policy-only pilot uses existing interpreter

**Preserved by design:**

- **Required essentials** remain blocking when missing.  
- **`stepRefinementProfiles`** (`assessment_pack`, `design_page`, `learner_page_pack`) behave as before.  
- **Post-workflow elicitation** remains appropriate when profile required tiers need unresolved step parameters.

---

## 4. Hypothesis (revised after validation)

LD workflows remain **usable** when generic **post-synthesis** `refinementFactors` chat is off, because:

1. **Essentials** still gate unsafe/incomplete planning.  
2. **Profile-based post-gen** still asks high-value setup when assessment/page steps are in the plan.  
3. **Step Settings** (`mappingRules` → `stepParams`) cover expert tuning.  
4. **Future** `planning_adequacy` (Slice 19-2) will add non-blocking Planning panel guidance.

Turning off `askRefinementByDefault` reduces **duplicate generic refinement** after synthesis without removing legitimate profile post-gen or essentials.

---

## 5. Implementation options

### Option A — `askRefinementByDefault: false` (**implemented**)

| Aspect | Detail |
|--------|--------|
| Change | `questionPolicy.askRefinementByDefault: false` in LD pack |
| Effect | `getWorkflowRefinementQueue` returns **[]** → no generic **`refinementFactors`** post-synthesis queue |
| Rationale | Matches Research (no LD-style generic refinement queue when off) |
| Note | Does **not** disable profile post-gen or essentials |

### Option B — cap `maxRefinementQuestions` (not implemented)

Retain `askRefinementByDefault: true` with a lower cap — deferred; Option A chosen.

**Implemented policy:** see [closeout §3](sprint-19-slice-1-closeout.md).

---

## 6. Files changed (implementation)

| File | Change |
|------|--------|
| `domains/learning-design/domain-learning-design-step-patterns.md` | `askRefinementByDefault: false` |

---

## 7. Files explicitly frozen

| Path | Reason |
|------|--------|
| `app.js` | No runtime rewrite |
| `domains/research/domain-research-step-patterns.md` | Sprint 18 Research frozen |
| `tests/workflow-research-sparse-briefs.test.js` | S1–S6 regression |
| `tests/workflow-research-adequacy.test.js` | S7–S9 adequacy |
| `tests/workflow-research-conflict-exceptions.test.js` | S13 conflict |
| `tests/fixtures/workflow-brief-research-sparse/S1`–`S13.json` | Research golden fixtures |

---

## 8. Manual validation

**Closeout record:** [`sprint-19-slice-1-closeout.md`](sprint-19-slice-1-closeout.md) §4 (M1–M4, API limitation on XAMPP).

| ID | Brief sketch | Pass signal (revised) |
|----|--------------|------------------------|
| **19-1-M1** | Sparse session brief | Essentials only pre-synthesis; **no generic post-synthesis refinementFactors**; synthesis proceeds; **Ready** when no profile |
| **19-1-M2** | Assessment-pack brief | Plan includes assessment steps; **profile post-gen may still run**; generic refinementFactors queue off |
| **19-1-M3** | Learner-page brief | **Profile post-gen** for page settings may still run; generic queue off |
| **19-1-M4** | Source-provided brief | `input_strategy` / source path OK; essentials when sparse; no generic queue regression |

**Noise rubric:** After synthesis, avoid **generic** refinement-factor interrogation; **profile** and **essentials** prompts remain acceptable.

---

## 9. Acceptance criteria

| Criterion | Status |
|-----------|--------|
| Charter approved | **Done** |
| LD pack `questionPolicy` only | **Done** — Option A |
| `node --test tests/*.test.js` → **100 passed** | **Done** |
| Research unchanged | **Done** |
| Manual M1–M4 logged | **Done** — see closeout |
| Wording corrected (post-synthesis vs pre-design) | **Done** — §0 + closeout |

---

## 10. Rollback

Restore previous LD `questionPolicy` in `domains/learning-design/domain-learning-design-step-patterns.md`:

```json
"questionPolicy": {
  "maxDefaultQuestions": 8,
  "askOptionalByDefault": false,
  "maxRefinementQuestions": 8,
  "askRefinementByDefault": true
}
```

Re-run tests → **100 passed**.

---

## 11. Next slice

**Slice 19-2 — LD `planningAdequacyChecks`**

- **3–5** pack-declared rules; reuse Research adequacy interpreter  
- Non-blocking Planning panel after synthesis  

**Slice 19-3 — profile thinning**

- Reduce `stepRefinementProfiles` duplication (`learner_level` re-ask, `forceAsk` on inferred factors)

Slice 19-1 removed **generic post-synthesis refinement noise** only; 19-2 owns assistive adequacy; 19-3 owns profile chat reduction.

---

## 12. References

| Document | Role |
|----------|------|
| [`sprint-19-slice-1-closeout.md`](sprint-19-slice-1-closeout.md) | Implementation + validation closeout |
| `docs/audits/ld-workflow-generation-rationalisation-audit.md` | LD classification (note §9 “pre-design” lever — superseded by §0 here for 19-1) |
| `docs/consolidation/contextual-refinement-architecture-note.md` | Four-layer model |

---

## Charter approval

| Field | Value |
|-------|--------|
| **Slice** | 19-1 |
| **Implementation** | **Closed** — Option A |
| **Closeout** | [`sprint-19-slice-1-closeout.md`](sprint-19-slice-1-closeout.md) |
