# Sprint 19 bootstrap — Learning Design Workflow Rationalisation

**Date:** 2026-05-15  
**Pack path:** `docs/development/sprints/2026-05-15-sprint-19-ld-workflow-rationalisation/`  
**Sprint title:** Sprint 19 — Learning Design Workflow Rationalisation  
**Status:** **Active** — bootstrap / audit-first; audit + portable pack complete; **no LD implementation** until chartered.

**Portable handover:** **`GPT-BOOTSTRAP-PROMPT.md`** + **`HANDOVER.md`**.

**Canonical audit:** [`docs/audits/ld-workflow-generation-rationalisation-audit.md`](../../../audits/ld-workflow-generation-rationalisation-audit.md)

---

## 1. Executive summary

**Sprint 18 (closed)** proved **contextual refinement on Research**: after workflow synthesis, pack-declared **`planning_adequacy`** notices (non-blocking) appear in the Planning panel; essentials and proceed gates stay deterministic. **100 tests green.**

**Sprint 19 (bootstrap)** rationalises **Learning Design** policy so the same model can apply **without** defaulting to a chat **form wizard**:

- **Five essentials** remain the contractual minimum.  
- **~15 refinementFactors** and **three stepRefinementProfiles** are classified for conversion to post-synthesis adequacy or step Settings.  
- **Post-generation chat** that blocks “Ready” is a **remove/defer** candidate once adequacy + Settings cover the same ground.

**One-sentence thesis:**  
*LD users should see the designed workflow before we ask them to tune assessment items or page tone — and tuning belongs in Planning adequacy notices and step Settings, not a second mandatory chat pass.*

**Rule:** Runtime interprets policy; domain packs declare policy.

---

## 2. Why Sprint 19 follows Sprint 18

| Sprint 18 outcome | Sprint 19 use |
|-------------------|---------------|
| Four-layer model (essentials → proceed → synthesis → adequacy) | LD classification lens |
| `planningAdequacyChecks` + generic evaluator in `app.js` | Reuse for LD when chartered — **no new interpreter** |
| Research proves non-blocking adequacy | LD stops promoting tuning factors to required |
| Conflict/validation on Research | LD port **deferred** until Slice 19-4 evidence |
| Prompt Studio lessons (portable pack) | LD UX principles in audit §7 |

**Do not reopen Sprint 18 Research slices** except explicit defects.

---

## 3. LD inventory (workflowBriefConfig)

### 3.1 Deterministic essentials (keep)

| Factor | Purpose |
|--------|---------|
| `topic` | Subject / content focus |
| `learner_level` | Audience calibration |
| `design_scope` | Activity / session / sequence / module |
| `delivery_pattern` | F2F / blended / online |
| `input_strategy` | Generate vs provided source |

### 3.2 Optional factors (keep with defaults)

Examples: `assessment_required`, `session_materials`, `duration_minutes`, `page_profile` — drive heuristics but should not balloon into required unless evidence.

### 3.3 refinementFactors (convert majority)

Assessment tuning (`assessment_type`, `assessment_total_items`, `difficulty_profile`, `coverage_scope`, `feedback_required`, `question_style_mix`, `cognitive_demand`) and activity/sequencing factors → **future `planningAdequacyChecks`** when matching steps exist.

Page tuning (`tone_style`, `depth_level`, `include_examples`, `include_practice_tasks`, `compact_vs_detailed`) → **advanced Settings** on Design Page; optional adequacy nudge only.

### 3.4 stepRefinementProfiles (remove/defer)

| Profile | Overlap |
|---------|---------|
| `assessment_pack` | Duplicates refinementFactors + Settings |
| `design_page` | Re-asks learner_level; duplicates page refinementFactors |
| `learner_page_pack` | Near-duplicate of design_page |

**Direction:** Replace required profile tiers with adequacy notices; keep optional AI review (`callOpenAIForWorkflowReview`) separate.

### 3.5 questionPolicy

Current: `askRefinementByDefault: true`, `maxRefinementQuestions: 8`.

**Slice 19-1 pilot (charter):** `askRefinementByDefault: false` **or** cap `maxRefinementQuestions` to 0–2 for measurement.

---

## 4. Nine audit questions (answered in audit doc)

| # | Question | Answer location |
|---|----------|-----------------|
| 1 | True deterministic essentials? | Audit §1 |
| 2 | refinementFactors → adequacy? | Audit §2 |
| 3 | Post-gen vs Settings overlap? | Audit §3 |
| 4 | Questions only after workflow visible? | Audit §4 |
| 5 | Brittle / redundant pack rules? | Audit §5 |
| 6 | Form-wizard symptoms? | Audit §6 |
| 7 | Prompt Studio lessons? | Audit §7 |
| 8 | Untouched until after v10? | Audit §8 |
| 9 | Safest first simplification slice? | Audit §9 |

---

## 5. Phased delivery (charter-gated)

```text
Sprint 19-0 (bootstrap)     Audit + pack + classification sign-off
        │
        ▼
Slice 19-1                Pack flags only — reduce pre-design refinement default
        │
        ▼
Slice 19-2                LD planningAdequacyChecks (3–5 rules) + Planning panel
        │
        ▼
Slice 19-3                Thin post-gen profiles; LD golden fixtures L1–L4
        │
        ▼
Slice 19-4 (optional)     LD validation/conflict port from Research pattern
```

### Slice 19-1 (recommended next charter)

- Edit LD pack `questionPolicy` only (or document A/B flag).  
- No `app.js` changes unless a one-line default read is required.  
- Manual: one assessment brief + one page brief — count chat turns before Ready.

### Slice 19-2

- Add `planningAdequacyChecks` to LD pack (mirror Research JSON shape).  
- Reuse `evaluateWorkflowBriefPlanningAdequacyChecks` / `applyWorkflowBriefPlanningAdequacyAfterDesign`.  
- Candidate rules (docs only until charter): assessment without type when generate step present; page without profile when design_page present; sequence scope vs step count; weak audience cue (reuse predicate if applicable).

### Slice 19-3

- Set profile required tiers to empty or profile-gated off.  
- Add `tests/workflow-ld-adequacy.test.js` + fixtures L1–L4.  
- Confirm Settings still receive mapped defaults.

---

## 6. LD adequacy candidates (draft — not implemented)

| Id (proposed) | Trigger sketch | Message intent |
|---------------|----------------|----------------|
| `assessment_type_unspecified` | Assessment generate step + no `assessment_type` | Suggest type before run |
| `assessment_volume_unspecified` | Generate items step + no item count | Suggest count or default |
| `page_profile_unspecified` | Design Page step + no page_profile | Learner vs facilitator |
| `scope_step_mismatch` | `design_scope` session but long sequence chain | Scope vs plan weight |
| `generate_without_source` | `input_strategy` generate + normalize-from-source chain | Parallel Research S2 pattern |

Cap **3** active adequacy rows (Research precedent).

---

## 7. Constraints (locked for Sprint 19 programme)

| Constraint | Detail |
|------------|--------|
| Research regression | No pack/test changes without charter |
| Runtime rewrite | Not in 19-0 / 19-1 |
| Renderer / schema | Out of scope |
| Prompt Studio merge | Out of scope |
| AI phrasing for adequacy | Defer — pack supplies `message` |
| `callOpenAIForWorkflowReview` | Keep; do not merge with adequacy evaluator |

---

## 8. Manual validation (when Slice 19-1+ runs)

| Scenario | Pass signal |
|----------|-------------|
| Sparse LD brief (topic + level only) | Essentials resolve; ≤2 pre-design refinement questions (if 19-1) |
| Assessment pack brief | Plan shows generate step; adequacy suggests type/count **after** design (19-2) |
| Page-only brief | No mandatory post-gen page profile chat (19-3) |
| Settings | Mapped fields editable on Design Page / Generate Assessment |

---

## 9. Verification

```bash
node --test tests/*.test.js
```

**Bootstrap:** **100 passed** — docs-only.

**After any LD slice:** same floor + new LD tests; Research suite unchanged.

---

## 10. Related documents

| Document | Role |
|----------|------|
| [`ld-workflow-generation-rationalisation-audit.md`](../../../audits/ld-workflow-generation-rationalisation-audit.md) | Full classification |
| [`contextual-refinement-architecture-note.md`](../../../consolidation/contextual-refinement-architecture-note.md) | Four layers |
| [`SPRINT-18-CHECKPOINT.md`](../2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md) | Research closeout |
| [`existing-refinement-infrastructure-audit.md`](../../../audits/existing-refinement-infrastructure-audit.md) | Cross-domain inventory |
| `domain-learning-design-step-patterns.md` | LD policy source |
