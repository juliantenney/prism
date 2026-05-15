# Research — method vs output conflict refinement (proposal)

**Date:** 2026-05-15  
**Path:** `docs/consolidation/sprint-18-research-method-vs-output-conflict-proposal.md`  
**Status:** **Implemented** (2026-05-15). **100 tests** green. See **S13** fixture and `workflow-research-conflict-exceptions.test.js`.

**Problem:** Briefs such as *“Analyse the evidence and produce a concise executive briefing…”* match both **analysis** and **briefing** signals on `objective_type_mixed_signals`. The user is prompted to choose a primary output even when **briefing** is clearly the deliverable and *analyse the evidence* is the **method**.

**Prerequisite:** Sprint 17 blocking conflict for genuinely mixed intents (e.g. S4) must remain. Sprint 18 adequacy (S7–S9) assumes essentials can complete without spurious conflict.

**Rule:** Runtime interprets policy; Research pack declares policy.

---

## 1. Recommended approach

### 1.1 Pack: `conflictPolicyExceptions` on the mixed-signals policy

Extend `workflowBriefConfig.conflictPolicies[]` entry `objective_type_mixed_signals` with an **`exceptions`** array (or add a sibling `conflictPolicyExceptions[]` processed by the same interpreter — charter choice at implementation).

**Exception intent:** When an **explicit briefing deliverable phrase** is present and analysis/evidence wording fits **method** patterns, treat conflict as **not fired** — allow `objective_type: briefing` from explicit extract / inference to stand.

### 1.2 Runtime (small, generic — not scenario-specific)

In `applyWorkflowBriefConflictPolicies` / `collectWorkflowBriefConflictSignalValues`:

1. Compute `detected` signal values as today.
2. For each applicable **exception** on the policy:
   - If `exceptWhen` matches `base` goal blob → **suppress** listed signals from `detected` (e.g. drop `analysis`) **or** skip the policy entirely when `primaryObjectiveType: briefing` is declared.
3. Apply `minConflictingSignals` to the **adjusted** set.

**Do not** add a hard-coded branch for one smoke brief; pack declares phrases.

### 1.3 Alternative (pack-only, higher risk)

Narrow the **analysis** signal `mentionAnyOf` (remove bare `analyse` / `analyze`) — **not recommended**: breaks legitimate analysis-primary briefs and is brittle for inflections.

### 1.4 Alternative (inference-only)

Stronger inference rule for briefing — **insufficient**: conflict pass still strips explicit `objective_type` after inference (see `applyWorkflowBriefConflictPolicies`).

---

## 2. Proposed pack shape (sketch)

```json
{
  "id": "objective_type_mixed_signals",
  "factorId": "objective_type",
  "minConflictingSignals": 2,
  "signals": [ "... unchanged ..." ],
  "exceptions": [
    {
      "id": "briefing_deliverable_with_analysis_method",
      "when": {
        "briefDeliverableMentionAnyOf": [
          "executive briefing",
          "briefing note",
          "produce a briefing",
          "produce an executive briefing",
          "decision briefing",
          "briefing for"
        ],
        "methodLanguageMentionAnyOf": [
          "analyse the evidence",
          "analyze the evidence",
          "analysing the evidence",
          "analysis of the evidence",
          "from the evidence",
          "evidence-led",
          "evidence based",
          "evidence-based"
        ]
      },
      "suppressSignals": ["analysis"]
    }
  ],
  "effect": { "blockFactor": true, "disclosureId": "objective_type_mixed_signals" }
}
```

**Semantics:**

- Exception matches only when **both** deliverable and method phrase lists hit (AND).
- `suppressSignals` removes `analysis` from the conflict set before counting — briefing + summary would still conflict if both present.
- Compound phrases like **“analysis briefing”** must **not** match `briefDeliverableMentionAnyOf` alone if listed only as separate tokens — use **exclusion** list in runtime or omit `"briefing"` without qualifier from method-only path.

**Optional `exceptWhen.excludeMentionAnyOf`:** `["analysis briefing", "analysis and briefing", "briefing and analysis", "both analysis"]` — if any hit, exception does **not** apply (S4 guard).

---

## 3. Examples that should resolve to briefing **without** asking

| Brief (design intent / goal) | Why |
|------------------------------|-----|
| *Analyse the evidence and produce a concise **executive briefing** on AI governance risks* | Deliverable explicit; “analyse the evidence” = method (M0 / S13) |
| *Analyze the evidence and draft a **briefing note** for the board* | Same pattern |
| *Evidence-led synthesis — deliver an **executive briefing** for leadership* | Method + deliverable |
| *From the evidence, produce a **decision briefing** on cyber resilience* | Method phrase + briefing deliverable |
| Desired outputs: *executive briefing* + intent *review the evidence and summarise for executives* | Deliverable in `desiredOutputs` |

**Expected:** `objective_type` resolves to `briefing` (explicit or inferred); **no** `conflicting_intent` / `objective_type_mixed_signals`; **no** `rejected_inference` for objective_type.

---

## 4. Examples that should **still** ask (conflict unchanged)

| Brief | Why |
|-------|-----|
| *Produce an **analysis briefing** on digital inclusion evidence* | Compound product noun — **S4** |
| *Deliver **both analysis and briefing** outputs* | Dual deliverables |
| *Summary and briefing for stakeholders* | summary + briefing (≥2 signals) |
| *Research **questions** and a briefing note* | questions + briefing |
| *Analysis report plus executive summary* | analysis + summary |
| *Analyse competitors and publish a thematic analysis report* | Analysis is primary output, not method wrapper |

**Expected:** `objective_type_mixed_signals` disclosure; `objective_type` blocked until user chooses; S4 golden **unchanged**.

---

## 5. Expected Planning disclosure change

### Before (M0-style brief today)

| Category | Present? |
|----------|----------|
| `conflicting_intent` | **Yes** — mixed signals |
| `rejected_inference` | **Yes** — objective_type briefing rejected |
| `missing_essential` | May persist until user picks objective |
| `planning_adequacy` | **No** until conflict cleared and design runs |

### After (exception applies)

| Category | Present? |
|----------|----------|
| `conflicting_intent` | **No** (for this pattern) |
| `rejected_inference` | **No** for objective_type |
| `missing_essential` | Only genuinely missing factors (audience, input_strategy, output_depth) |
| `planning_adequacy` | **After synthesis** — topic scope, evidence-language, etc., as today |

**User-visible improvement:** Planning panel no longer asks to “choose primary output” when the brief already names an executive briefing; essentials elicitation can proceed to briefing-shaped heuristics without an extra cognitive step.

---

## 6. Fixture proposal — **S13**

**Path:** `tests/fixtures/workflow-brief-research-sparse/S13-briefing-deliverable-analysis-method.json`

| Field | Value |
|-------|--------|
| `caseId` | `S13-briefing-deliverable-analysis-method` |
| `scenario` | Analysis/evidence phrasing as method; explicit briefing deliverable — should not trigger mixed-signal conflict |
| `designIntent` | *Analyse the evidence and produce a concise executive briefing on AI governance risks* |
| `desiredOutputs` | *executive briefing* (optional — strengthens explicit extract) |
| `audience` | *Executive leadership* |

**`expectedCurrent` (after implementation):**

- `explicitSubset.objective_type`: `briefing`
- **No** `validationDisclosures` with `objective_type_mixed_signals`
- **No** `rejectedInference` for `objective_type` from conflict rule
- `resolvedFactors.objective_type`: `briefing` when other essentials supplied in test harness
- Distinct from **S7**: S13 asserts **validation/conflict** path; S7 asserts **adequacy** post-design (can share same brief text with different `expectedCurrent` sections)

**S7 JSON:** leave unchanged; S13 is the conflict-regression fixture.

---

## 7. Risk to S4 mixed-signal conflict

| Risk | Mitigation |
|------|------------|
| S4 stops blocking | **`excludeMentionAnyOf`** includes `analysis briefing`; do not list bare `briefing` as sufficient without deliverable qualifier in exception |
| Exception too broad | Require **both** `briefDeliverableMentionAnyOf` **and** `methodLanguageMentionAnyOf` |
| “Brief” alone matches briefing signal + exception | Deliverable list uses **executive briefing**, **briefing note**, not lone `brief` in exception path (conflict signal may still use `brief` — exception only suppresses analysis when deliverable phrase is explicit) |
| Regression in sparse tests | **Do not edit S4.json**; `workflow-research-sparse-briefs.test.js` must still expect conflict |
| M6 manual scenario | **3A-M6** still valid — S4 text still conflicts |

**Acceptance:** S4 `expectedCurrent` in `workflow-research-sparse-briefs.test.js` remains identical; CI fails if S4 gains conflict clearance.

---

## 8. Test strategy

| Layer | Action |
|-------|--------|
| **Automated — sparse regression** | Keep **S1–S6** files immutable; S4 must still expect `objective_type_mixed_signals` |
| **Automated — new** | Add **S13** to `workflow-research-sparse-briefs.test.js` **or** new `workflow-research-conflict-exceptions.test.js` (preferred if sparse file is golden-frozen) |
| **Automated — adequacy** | Optional: M0 brief through full resolve in adequacy tests without conflict — may duplicate S13 + S7; avoid over-coupling |
| **Manual** | Re-run **3A-M0**, **3A-M6** from [`sprint-18-slice-3a-manual-validation.md`](sprint-18-slice-3a-manual-validation.md) |
| **Count** | Expect **+1–3** tests → ~96–98 green |

**Test cases (minimum):**

1. S13 — no mixed-signal disclosure; briefing objective kept in explicit/resolved.
2. S4 — still has mixed-signal (negative control in same file or existing sparse test).
3. Optional: S13 + complete essentials → adequacy evaluator returns rows (integration smoke).

---

## 9. Implementation slice (when chartered — not now)

| Phase | Deliverable |
|-------|-------------|
| **A** | Approve this proposal + pack `exceptions` / `excludeMentionAnyOf` lists |
| **B** | Generic `app.js` exception handling in conflict collection |
| **C** | Research pack update + **S13** fixture + tests |
| **D** | Manual 3A-M0 confirmation |

**Out of scope:** AI inference, chat, new required factors, adequacy check changes, LD/renderer.

---

## 10. Related artefacts

| Document | Role |
|----------|------|
| [`sprint-18-slice-3a-manual-validation.md`](sprint-18-slice-3a-manual-validation.md) | M0/M6 manual scenarios |
| `tests/fixtures/.../S4-mixed-analysis-briefing.json` | Must stay blocking |
| `domains/research/domain-research-step-patterns.md` | `conflictPolicies`, `inferenceRules` |
| [`SPRINT-18-CHECKPOINT.md`](../development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md) | Sprint status |
