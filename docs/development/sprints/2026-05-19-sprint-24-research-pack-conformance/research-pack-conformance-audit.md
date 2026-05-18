# Research pack semantic conformance audit — Sprint 24 Slice 24-1

**Date:** 2026-05-19  
**Slice:** 24-1 — Research pack semantic conformance audit  
**Status:** **Complete** (audit only — no pack or runtime edits)  
**Baseline:** [Sprint 23 governance model](../2026-05-18-sprint-23-learning-design-pack-rationalisation/sprint-23-closeout.md)  
**Target pack:** `domains/research/domain-research-step-patterns.md`

---

## 1. Objective and constraints

### Objective

Determine whether the Research pack **already conforms sufficiently** to Sprint 23 governance patterns, exhibits **minor metadata drift only**, or requires **deeper semantic remediation** comparable to Learning Design Sprint 23.

### Constraints (honoured in this slice)

| Constraint | Status |
|------------|--------|
| Lightweight semantic conformance review | ✓ |
| No runtime redesign | ✓ — no `app.js` edits |
| No Settings redesign | ✓ |
| No provenance redesign | ✓ |
| No workflow graph redesign | ✓ |
| No automatic metadata rationalisation programme | ✓ — recommendations are evidence-led only |
| Do not assume LD-level remediation | ✓ |

### Comparison baseline (Sprint 23)

| Pattern | Sprint 23 expectation |
|---------|----------------------|
| Declarative pack semantics | Pack owns meaning; runtime interprets |
| Ownership classes | Workflow-owned, step-owned, topology-only, artefact-derived, prompt-local |
| Settings operational authority | Post-synthesis tunables via `*ParameterControls` where declared |
| Elicitation initialisation | Brief factors + rules materialise constraints |
| PF vs Settings alignment | Pack control ids own PF keys; no duplicate surfaces |
| Topology vs parameter semantics | Graph inclusion separate from tunable keys |
| Inheritance doctrine | Documented where cross-step defaults exist |
| Canonical-step governance | `canonical_step_id` + pack metadata alignment |

---

## 2. Research pack inventory

### 2.1 Document structure

| Block | Present | Notes |
|-------|---------|--------|
| `workflowPolicy` | ✓ | 13 canonical step **titles**, dependencies, trigger rules, heuristics |
| `workflowBriefConfig` | ✓ | Factors, mapping, validation, conflict/disclosure, planning adequacy |
| Per-step **Prompt Factory** | ✓ | 13 numbered sections (§1–§13) |
| `workflowParameterControls` | **Absent** | — |
| `stepParameterControls` | **Absent** | — |
| `refinementFactors` | **Absent** | Refinement burden handled via essentials + optional + inference |
| `assessmentPolicy` / cross-step inheritance | **Absent** | Not applicable to Research domain |

### 2.2 `workflowBriefConfig` summary

| Category | Count | IDs / notes |
|----------|-------|-------------|
| `requiredFactors` | 4 | `objective_type`, `input_strategy`, `audience`, `output_depth` |
| `optionalFactors` | 1 | `citation_style` |
| `extraFields` | 1 | `evidence_rigour` (exploratory / standard / strict) |
| `mappingRules` | 6 | All target **workflow** paths only (see §5) |
| `inferenceRules` | 1 | Briefing cue → `objective_type: briefing` |
| `validationRules` | 1 | Upload language without inputs |
| `conflictPolicies` | 1 | `objective_type` mixed signals (S13 exception documented) |
| `planningAdequacyChecks` | 3 | Topic scope, evidence language, plan vs depth |
| `planningGateDisclosures` | 1 | Gates GRC + Design Page until essentials resolved |

### 2.3 Step patterns and PF `userOptions`

| § | Step title | PF `userOptions` count | `canonical_step_id` in pack |
|---|------------|------------------------|-----------------------------|
| 1 | Normalize Content | 3 | — |
| 2 | Generate Research Content | 0 | — |
| 3 | Extract Key Findings | 4 | — |
| 4 | Model Argument Structure | 2 | — |
| 5 | Build Evidence Map | 2 | — |
| 6 | Conduct Thematic Analysis | 5 | — |
| 7 | Build Literature Matrix | 1 | — |
| 8 | Generate Research Questions | 2 | — |
| 9 | Generate Research Summary | 2 | — |
| 10 | Generate Briefing Note | 2 | — |
| 11 | Validate Research Output | 1 | — |
| 12 | Format Final Output | 1 | — |
| 13 | Design Page | 1 (`page_profile`) | **`step_design_page`** |

**Total PF option keys:** 26 across 12 steps with options (GRC has none).

### 2.4 Runtime test coverage (Research)

| Test area | File | Role |
|-----------|------|------|
| Sparse brief fixtures S1–S13 | `tests/workflow-research-sparse-briefs.test.js` | Elicitation, heuristics, validation intent |
| Planning adequacy | `tests/workflow-research-adequacy.test.js` | Pack `planningAdequacyChecks` |
| Policy keys | `tests/workflow-generation-context-get-workflow-policy.test.js` | `researchDesignPageAppend`, domain selection |
| Input strategy | `tests/workflow-brief-config-input-strategy.test.js` | Research pack brief config load |

---

## 3. Workflow vs step ownership review

### 3.1 Observed ownership model (Research)

Research uses a **workflow-constraint + PF-authoritative** split that differs from post–Sprint 23 LD but remains **internally coherent**:

| Class | Research implementation | Sprint 23 alignment |
|-------|-------------------------|---------------------|
| **Workflow-owned** | All `mappingRules` write `workflow.workflowOutputSpec.constraints.*` or `audience` | ✓ Declarative; materialised at synthesis |
| **Topology-only** | `workflowPolicy.triggerRules`, `planningGateDisclosures`, validation/conflict effects on plan shape | ✓ Not promoted to Settings controls |
| **Step-owned (effective)** | PF `userOptions` per step; persisted via step notes when used | ✓ Step-scoped; **Edit/PF surface** not unified Settings |
| **Inherited** | None declared | ✓ N/A — no DA-style chain |
| **Artefact-derived** | Dependencies / `requiresAnyOf` in `workflowPolicy` | ✓ Graph driven by artefacts |
| **Prompt-local** | Templates, `stepNotes`, runner copy | ✓ |

### 3.2 No `stepParams.*` mapping targets

Unlike LD (post-23), **no** `mappingRules` entry maps brief factors to `stepParams.<canonicalStepId>.*`. Operational step tuning is **not** initialised from brief mapping into step param blocks; users adjust via PF (or manual notes) per step.

**Assessment:** Intentional domain posture — not a defect — but means **Settings cannot expose Research step tunables** until `stepParameterControls` are authored (optional future work).

### 3.3 `extraFields` vs workflow controls

`evidence_rigour` appears in `extraFields` and maps to `constraints.evidence_rigour`, mirroring the **pre-23-6 LD pattern** (`delivery_context` duplication). Research has **no** `workflowParameterControls` row for it.

**Drift severity:** **Minor** — elicitation-only path works; no Settings duplicate because Settings has no Research workflow control rows.

---

## 4. PF vs Settings alignment

### 4.1 Collision analysis

| Check | Result |
|-------|--------|
| Pack `stepParameterControls` vs PF ids | **No controls declared** → **no collision** |
| Pack `workflowParameterControls` vs PF | **No workflow controls** → **no collision** |
| Shared `step_design_page` with LD | Research PF exposes `page_profile`; LD pack declares `page_profile` in `stepParameterControls` for LD workflows only |

### 4.2 Settings behaviour for Research-only workflows

Unified Settings (Sprint 22 runtime) aggregates **pack-declared** controls for included steps with `canonical_step_id`. Research pack declares **no** `stepParameterControls` and **no** `workflowParameterControls`.

**Expected UX:** Research-only workflows show **no Research step parameter sections** in Settings unless another domain’s brief config is merged or steps carry LD controls from mixed-domain workflows.

**Assessment:** **Aligned with current pack** — PF remains the step tuning surface for Research. Not a Sprint 23 non-conformance; it is an **unexpanded** metadata surface.

### 4.3 PF as declarative step semantics

Each step’s `userOptions` ids align with `{{option:…}}` placeholders in that step’s template (spot-checked: Normalize `structure_mode`, Design Page `page_profile`). This matches the **Content/Normalize reference pattern** from LD Sprint 23 **within PF-only scope**.

---

## 5. mappingRules review

| Factor | Maps to | Step params? |
|--------|---------|--------------|
| `objective_type` | `constraints.objective_type` | No |
| `evidence_rigour` | `constraints.evidence_rigour` | No |
| `input_strategy` | `constraints.input_strategy` | No |
| `audience` | `workflowOutputSpec.audience` | No |
| `output_depth` | `constraints.output_depth` | No |
| `citation_style` | `constraints.citation_style` | No |

**Findings:**

- Rules are **consistent and minimal** — no orphan targets.
- **No auto-promotion risk** — nothing creates phantom Settings controls.
- Gap vs LD: brief factors that could map to step params (e.g. `output_depth` → thematic `synthesis_depth`) are **not** mapped; PF defaults apply instead.

**Assessment:** **Conformant** for workflow-level ownership; optional enhancement only if product wants brief→step initialisation.

---

## 6. Elicitation posture review

| Mechanism | Research pack | Sprint 23 fit |
|-----------|---------------|----------------|
| Essentials gating | 4 required factors + `stopConditions` | ✓ Initialises core state |
| Optional factors | `citation_style` | ✓ Low burden (`askOptionalByDefault: false`) |
| Inference | Briefing language → `objective_type` | ✓ Safe, disclosed via provenance |
| Validation / conflict | Upload-without-inputs; mixed objective signals | ✓ Topology / safety |
| Planning gates | GRC + Design Page withheld until essentials | ✓ Topology-only |
| Planning adequacy | 3 advisory checks + disclosure copy | ✓ Non-blocking recommendations |
| Refinement queue | **None** (`refinementFactors` absent) | ✓ Simpler than LD; no duplicate Settings asks |

**Assessment:** Research elicitation is **mature and declarative** — arguably **lower duplication risk** than pre-23 LD because there is no parallel refinement layer competing with Settings.

---

## 7. Runtime bespoke logic review

Research-specific behaviour in `app.js` is **pack-configured**, not hard-coded LD-style title branches for assessment inheritance.

| Concern | Pack source | Runtime role |
|---------|-------------|--------------|
| Validate step inclusion | `researchValidationIntent` | Brief phrase/word-boundary gate |
| Design Page append | `researchDesignPageAppend` | Terminal page when delivery cues + objective allow |
| GRC inclusion | `generateResearchContentHeuristic` | Requires resolved `objective_type`, `input_strategy` |
| Objective-specific steps | `triggerRules` | Include summary/briefing/questions/analysis steps |
| Upload authoritative path | Heuristic branch ~11241 | Drops GRC when upload path authoritative |

**Not present (vs LD):** `resolveAssessmentItemsInheritedOptions`, assessment PF advanced toggle, Design Assessment title walk-back.

**Assessment:** Bespoke logic is **policy-driven** and documented in pack prose. **No immediate runtime rewrite** warranted for conformance.

---

## 8. Canonical-step governance classification

| Step | Title governance | `canonical_step_id` in pack | Settings discoverability |
|------|------------------|----------------------------|----------------------------|
| §1–§12 | `workflowPolicy.canonicalSteps` **title strings** | Not declared in PF JSON | Settings: none (no pack controls) |
| §13 Design Page | Title + **`step_design_page`** | Declared | Could use LD `page_profile` control **only if** LD brief config merged and step included |

**Finding:** Research relies on **title-stable** `workflowPolicy` for graph composition; canonical IDs are **sparse** (1/13). Tests and heuristics use title regex / policy canonicalisation, not `stepParams` keys.

**Drift severity:** **Minor** for conformance; **moderate** only if product goal is full Settings parity across all Research steps.

---

## 9. Semantic drift findings

| ID | Finding | Severity | Notes |
|----|---------|----------|--------|
| F1 | No `workflowParameterControls` / `stepParameterControls` | **Informational** | Different surface split, not broken semantics |
| F2 | `extraFields.evidence_rigour` without workflow control row | **Minor** | Same class as pre-23-6 LD `delivery_context` |
| F3 | `citation_style` optional factor not exposed in Settings | **Minor** | Elicitation-only |
| F4 | Only Design Page has `canonical_step_id` in pack | **Minor** | Title governance sufficient for current tests |
| F5 | No brief→`stepParams` mapping | **Informational** | PF defaults stand alone |
| F6 | Shared `step_design_page` with LD without Research pack control row | **Minor** | Mixed-domain workflows may show LD page controls |
| F7 | No cross-step inheritance policy block | **N/A** | No Research equivalent to DA→Gen |

**No critical metadata defect** identified that would require emergency pack or runtime change in 24-1.

---

## 10. Conformance assessment

### Verdict

**The Research pack already conforms sufficiently to the Sprint 23 governance model** for a domain that intentionally uses:

1. **Declarative workflow policy** for topology and planning.  
2. **Workflow-level `mappingRules`** for persistent constraints.  
3. **PF `userOptions`** as the step operational surface (instead of unified Settings controls).  

This is a **valid variant** of the Sprint 23 architecture — not an incomplete LD rationalisation.

### Comparison to LD (Sprint 23 outcome)

| Dimension | LD (post-23-6) | Research (current) |
|-----------|----------------|-------------------|
| Settings step controls | 39 `stepParameterControls` | 0 |
| Assessment inheritance | `assessmentPolicy` + runtime helper | None |
| Refinement factors | Rich queue | Absent (simpler) |
| Topology gates | `assessment_required`, WGC | `triggerRules`, planning gates, validation intent |
| Conformance to *principles* | Full | **Sufficient** |
| Conformance to *LD metadata shape* | — | **Not required** |

### Acceptable outcome statement

> **Research does not need the same treatment as Learning Design** unless product goals explicitly require Settings parity for PF options or canonical-step coverage across all 13 steps.

---

## 11. Recommendations

### Tier A — No action required (default)

- **Close Slice 24-1** with this audit as the deliverable.  
- Record Research posture as **workflow-constraint + PF-authoritative** in programme docs.

### Tier B — Optional documentation-only follow-up (if chartered)

| Item | Effort | Benefit |
|------|--------|---------|
| Add pack comment block describing Research ownership variant | Low | Onboarding clarity |
| Document shared `step_design_page` behaviour in mixed-domain workflows | Low | Prevents false “non-conformance” reports |

### Tier C — Optional metadata programme (only if evidence / product demand)

| Item | Trigger | Scope |
|------|---------|--------|
| `workflowParameterControls` for `citation_style`, `evidence_rigour`, `output_depth` | Users need post-synthesis workflow tuning in Settings | Small pack slice |
| `stepParameterControls` for high-traffic PF keys (e.g. Normalize, Thematic Analysis) | Settings parity goal | Medium — **not** Sprint 23-6 parity |
| `canonical_step_id` on all PF blocks | Settings aggregation + cross-domain consistency | Medium pack + workflow save hygiene |
| Brief→`stepParams` mappingRules | Reduce PF re-configuration after synthesis | Selective rules only |

### Tier D — Explicitly defer

| Item | Reason |
|------|--------|
| LD-style `assessmentPolicy` / inheritance | No Research assessment chain |
| Sprint 23-6 bulk rationalisation | No audit evidence |
| Runtime rewrite of research heuristics | Pack policy already drives behaviour |
| Provenance / graph / Settings redesign | Out of Sprint 24 scope |

---

## 12. Verification

```bash
node --test tests/*.test.js
```

**Result (2026-05-19):** **195 passed**, 0 failed.

No pack or runtime changes in Slice 24-1.

---

## References

| Document | Path |
|----------|------|
| Research step patterns | `domains/research/domain-research-step-patterns.md` |
| Sprint 23 closeout | [`../2026-05-18-sprint-23-learning-design-pack-rationalisation/sprint-23-closeout.md`](../2026-05-18-sprint-23-learning-design-pack-rationalisation/sprint-23-closeout.md) |
| LD ownership model | [`../2026-05-18-sprint-23-learning-design-pack-rationalisation/ld-parameter-ownership-model.md`](../2026-05-18-sprint-23-learning-design-pack-rationalisation/ld-parameter-ownership-model.md) |
| Slice 24-1 charter | [`slice-24-1-charter.md`](slice-24-1-charter.md) |
