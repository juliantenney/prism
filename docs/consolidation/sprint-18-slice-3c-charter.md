# Sprint 18 — Slice 3C charter (implementation)

**Date:** 2026-05-15  
**Path:** `docs/consolidation/sprint-18-slice-3c-charter.md`  
**Status:** **Closed (3C-1 + 3C-2)** — C–E deferred to 3C-pass-2.

**Proposal (design reference):** [`sprint-18-slice-3c-adequacy-proposal.md`](sprint-18-slice-3c-adequacy-proposal.md)

**Pack:** `docs/development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/`

**Verification:** `node --test tests/*.test.js` → **95 passed**, 0 failed (after 3C-2; was 91 after Slices 1–2).

---

## 1. Slice scope

| In scope (Slice 3C) | Out of scope |
|---------------------|--------------|
| Generic runtime `when` predicate extensions (3C-1) | Checks **C**, **D**, **E** (deferred to **Slice 3C-pass-2** or later charter) |
| Research pack rules **A** and **B** only (3C-2) | Fixtures S10–S12 |
| Fixtures **S8**, **S9** + adequacy tests | New required factors |
| Cap `planning_adequacy` rows at **3** per evaluation | Chat clarification |
| Preserve S1–S7 regression semantics | Dismiss / suppress (Slice 3B) |
| Assistive `planning_adequacy`, `severity: recommendation` | AI phrasing of messages |
| Deterministic pack `disclosurePolicy` text | LD rollout |
| `__PRISM_TEST_API` coverage for new predicates | Renderer / schema / Prompt Studio merge |

**Architectural rules (unchanged):** Runtime interprets policy; packs declare policy. Adequacy evaluates post-synthesis when essentials are complete (Slice 2 contract). RQ-B1 assistive-only; RQ-P1 deterministic pack copy.

---

## 2. Implementation split

### Phase 3C-1 — Runtime predicate extensions only

**Files:** `app.js` (generic adequacy interpreter + test API exports).

| Predicate | Purpose | Used in 3C-2 by |
|-----------|---------|-----------------|
| `briefFieldMentionAnyOf` | `{ fields, terms }` — case-insensitive substring on brief fields | Check **A** |
| `stepsLackAny` | True when **none** of listed normalized step titles are present | Future **C** |
| `stepsExclude` | True when listed normalized step titles are **absent** (same semantics as `stepsLackAny`; pack may use either key) | Future **C** |
| `stepCountAtLeast` | `{ minSteps: n }` on `design.steps.length` | Check **B** (optional tighten) |
| `weakAudienceCue` | Generic audience weakness (mirror `weakTopicScope` shape) | **Runtime only in 3C-1**; pack use deferred with check **E** |

**Cap:** `evaluateWorkflowBriefPlanningAdequacyChecks` (or merge site) returns at most **3** `planning_adequacy` rows per evaluation, preserving pack declaration order (first three matches).

**3C-1 must not:** add pack rules, fixtures, or Factory behaviour changes beyond cap logic.

**Verification after 3C-1:** **91 passed** (no new tests required; optional unit tests for predicates if added in same PR — charter allows zero new tests if predicates are covered in 3C-2).

---

### Phase 3C-2 — Pack rules A & B + fixtures S8 & S9

**Files:**

| File | Change |
|------|--------|
| `domains/research/domain-research-step-patterns.md` | Two new `planningAdequacyChecks`; `disclosurePolicy.messages` + `entries` |
| `tests/fixtures/workflow-brief-research-sparse/S8-*.json` | Check **A** positive |
| `tests/fixtures/workflow-brief-research-sparse/S9-*.json` | Check **B** positive |
| `tests/workflow-research-adequacy.test.js` | S8/S9 positive; negatives per table below |

#### Check A — `evidence_language_generate_from_topic_mismatch`

**`when` (pack):**

```json
{
  "resolvedFactorEquals": { "input_strategy": "generate_from_topic" },
  "briefFieldMentionAnyOf": {
    "fields": ["designIntent", "goal", "desiredOutputs"],
    "terms": [
      "evidence",
      "analyse the evidence",
      "analyze the evidence",
      "from sources",
      "source material",
      "corpus",
      "literature",
      "sector report",
      "uploaded"
    ]
  },
  "stepsIncludeAny": ["Normalize Content", "Extract Key Findings"]
}
```

**Disclosure id:** `evidence_language_generate_from_topic_mismatch`  
**Severity:** `recommendation`  
**Category:** `planning_adequacy`

#### Check B — `plan_heavy_for_output_depth`

**`when` (pack — all clauses AND):**

| Clause | Value |
|--------|--------|
| `resolvedFactorEquals` | `output_depth: concise` |
| `stepsIncludeAny` | `Conduct Thematic Analysis`, `Build Literature Matrix` |
| `stepCountAtLeast` | `{ "minSteps": 7 }` |

**Rationale:** `stepCountAtLeast` signals a heavy chain without adding a second `stepsIncludeAny` group in 3C-1.

**Disclosure id:** `plan_heavy_for_output_depth`  
**Severity:** `recommendation`  
**Category:** `planning_adequacy`

---

## 3. Fixtures and tests (3C-2)

| Fixture | `caseId` | Asserts |
|---------|----------|---------|
| **S8** | `S8-evidence-language-generate-from-topic` | Check **A** fires post-design; may stack with S7 `topic_scope` on same brief shape |
| **S9** | `S9-concise-depth-heavy-plan` | Check **B** fires; `output_depth: concise` + heavy chain |

| Negative | Asserts |
|----------|---------|
| **S3** | Check **A** does **not** fire (`provided_source_content`) |
| **S7** with `output_depth: standard` | Check **B** does **not** fire (variant in test via `resolvedFactorsForAdequacy` override, not editing S7 JSON) |

**Do not edit:** S1–S6 fixtures; S7 JSON semantics for topic_scope test.

**Estimated tests after 3C-2 closeout:** 91 + ~4–6 → **~95–97**.

---

## 4. Deferred (post–3C-2)

| Item | Proposal ref | Target |
|------|--------------|--------|
| Check **C** `page_delivery_without_design_page` | Candidate C | Slice **3C-pass-2** or **3D** |
| Check **D** `objective_synthesis_path_mismatch` | Candidate D | Same |
| Check **E** `audience_generic_for_executive_delivery` | Candidate E | Same; uses `weakAudienceCue` already in 3C-1 |
| Fixtures S10–S12 | §5 proposal | With C–E |

`weakAudienceCue` is implemented in **3C-1** for forward compatibility but **no pack rule** until check **E** is chartered.

---

## 5. Cross-cutting policies (locked)

| Policy | Value |
|--------|--------|
| Max `planning_adequacy` rows | **3** (pack order) |
| Severity | `recommendation` |
| Blocking | **Never** for 3C checks |
| Evaluation gate | `missingFactorIds.length === 0` + design snapshot |
| S1–S6 | Unchanged |
| S7 | Unchanged golden; B negative via resolved-factor override in test |

---

## 6. Files by phase

| Phase | Files |
|-------|--------|
| **3C-1** | `app.js` — `workflowBriefAdequacyWhenMatches`, helpers, cap in `evaluateWorkflowBriefPlanningAdequacyChecks`, `__PRISM_TEST_API` |
| **3C-2** | `domain-research-step-patterns.md`, `S8-*.json`, `S9-*.json`, `workflow-research-adequacy.test.js` |

**Explicitly not in 3C:** `index.html`, LD pack, renderer, workflow schema, dismiss state.

---

## 7. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| S7 + S8 same brief double/triple notices | Cap at 3; tests assert ids present, not exact count unless chartered |
| S1–S7 regression | Separate adequacy test file section; no sparse-brief edits |
| Check B false positives | `output_depth: concise` + `minSteps: 7`; S7-standard-depth negative |

---

## 8. Review log

- **2026-05-15** — Slice 3C **chartered** (docs only): split 3C-1 runtime / 3C-2 pack A+B + S8/S9; defer C–E.
- **2026-05-15** — Slice 3C **closed** (3C-1 + 3C-2): **95 passed**, 0 failed.
