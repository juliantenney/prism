# 38S-1 — Episode Plan V1 integration

**Date:** 2026-06-06  
**Status:** **COMPLETE**  
**Type:** Architectural discovery — minimal insertion point; no population implementation  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38S-1  
**Inputs:** [38R-6 handoff](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-6-sprint-closure.md) · [38R-2 A1–A4 plans](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-2-archetype-fit-test.md) · [38Q-5 architecture](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) · [38Q-3 gaps](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md) · [38I-3 KM/LO mapping](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md) · [38J-2 function-plan (superseded behaviour)](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-2-function-plan-prompt-design.md)  
**Successor:** [38S-2 Population contract](38S-2-population-contract-implementation.md)

---

## Executive framing

**Frozen plan (authoritative):**

```yaml
episode_plan:
  archetype: <archetype>
  beats:
    - function: <FunctionEnum>
```

**Rule:** Beat order is pedagogically authoritative.

**Primary question:**

> Where should Episode Plan V1 sit so that DLA stops planning, DLA starts populating, GAM remains a realisation layer, and 38M–38P fidelity remains intact?

**Integration verdict (summary):**

**Option A** — insert Episode Plan **between LO and DLA** as a **first-class persisted artefact**, implemented as a **new workflow step** (or explicit two-pass with plan artefact) before `step_design_learning_activities`. DLA becomes **population-only**. GAM and Page compose **unchanged**.

---

## Task 1 — Trace current planning flow

### Canonical pipeline (Prism LD workflow)

Evidence: [domain-learning-design-step-patterns.md](../../../../domains/learning-design/domain-learning-design-step-patterns.md) `workflowPolicy.dependencies` and `precedenceRules`.

```text
Learning Content / Normalize Content
  ↓
Model Knowledge                    → knowledge_model
  ↓
Define Learning Outcomes           → learning_outcomes
  ↓
Design Learning Activities         → learning_activities   ← DLA (planning + population today)
  ↓
Generate Activity Materials        → activity_materials    ← GAM (realisation)
  ↓
Design Page                        → page                  ← compose (38M–38P fidelity path)
```

Optional parallel branch: **Construct Learning Sequence** (`learning_sequence`) — session timing, not episode choreography ([38R-6 Task 7](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-6-sprint-closure.md) — out of V1 scope).

Inflation proof harness path (representative runtime): [ev-38l-inflation-pipeline-capture-once.mjs](../../2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/ev-38l-inflation-pipeline-capture-once.mjs) — `Brief → LC → KM → frozen LO → DLA §5 → GAM §6 → Design Page`.

### Where planning happens today

| Locus | What is decided | Evidence |
|-------|-----------------|----------|
| **KM step** | Concept substance, relationships, misconceptions | [38I-3 §1](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md) |
| **LO step** | Performance intent, cognitive level, concept scope | `learning_outcomes`; [38I-3 §2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md) LO-ARC |
| **DLA step (`step_design_learning_activities`)** | **All episode choreography** — archetype, function order, materials, learner_task | Pack §5 prompt ([domain-learning-design-step-patterns.md](../../../../domains/learning-design/domain-learning-design-step-patterns.md) L2632+); [38J-2](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-2-function-plan-prompt-design.md) internal IFP pass |
| **GAM step (`step_generate_activity_materials`)** | Material **bodies** from DLA specs | Pack §6: "do not redesign activities"; [38Q-1 §A4](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-1-what-good-looks-like-baseline.md) |
| **Page compose** | Merge, order propagation, render fidelity | 38M–38P closed |

### Native DLA output shape (planning embedded)

From [domain-learning-design-artefacts.md](../../../../domains/learning-design/domain-learning-design-artefacts.md) and `EV-38M-AFTER-dla-learning-activities.json`:

```text
activities[]
  mapped_learning_outcomes[]
  required_materials[]      ← parallel obligation bundle
  learner_task              ← completion shell
  activity_preamble, prior_knowledge_activation, …
```

[38Q-1](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-1-what-good-looks-like-baseline.md): ordered instructional functions **not** the native planning unit — `required_materials[]` + `learner_task` is.

## Current planning responsibilities

| Responsibility | Current owner | How it manifests | Gap class |
|----------------|---------------|------------------|-----------|
| **Archetype selection** | DLA prompt (IFP / LO-ARC) | Per-activity archetype from `mapped_learning_outcomes` + cognitive_level | — |
| **Instructional sequencing** | DLA prompt (implicit) | Order of `required_materials[]` + cognition fields; **not authoritative** | **G5** ([GAP-13](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) |
| **Transition / fade planning** | DLA prompt | Should be worked→guided→independent; collapses to single table (EV-38M A2 M7) | **G3, G5** |
| **Function identity per beat** | DLA `purpose` field (ad hoc) | No canonical `instructional_function` | G4/G5 |
| **Material obligation generation** | DLA | `required_materials[]` rows with type/spec | Correct layer — wrong **authority** |
| **Learner-task synthesis** | DLA | `learner_task` prose prepended to bundle | **G5** ([38R-3 P8](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-3-plan-to-dla-mapping.md)) |
| **Judgement / perspective progression** | DLA | A4 parallel M13–M20 without chain | **G3** |
| **Material body authoring** | GAM | Long-form bodies, tables | Correct — preserve |
| **Page fidelity** | Page compose + 38M–38P | `fullOk` path | Correct — preserve |
| **Session timing** | Construct Learning Sequence | Duration / facilitation plan | Out of V1 scope |

**Diagnosis:** DLA is **both planner and populator**. Episode choreography is prompt-internal ([38J-2](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-2-function-plan-prompt-design.md) "mental scratch") — not a persisted structural object. That is the root of G3/G5 at `fullOk`.

---

## Task 2 — DLA planning behaviour classification

| Responsibility | Keep in DLA | Move to Episode Plan | Evidence |
|----------------|:-----------:|:--------------------:|----------|
| **Archetype selection** | | **✓** | [38I-3](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md): LO selects archetype signal; **plan owns** `archetype` field |
| **Ordered instructional function sequence** | | **✓** | [38R-1](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-1-minimum-viable-episode-plan.md): beats[] is the plan |
| **Transition / fade choreography** | | **✓** | T1 encoded as function triple in plan — not DLA table choice |
| **Judgement progression (perspective→criteria→judgement)** | | **✓** | [38Q-3 A4](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md); [38R-2 A4 plan](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-2-archetype-fit-test.md) |
| **Beat-level function selection (R/C/O upgrades)** | | **✓** | KM triggers choose optional beats — still **ordered functions in plan** ([38I-3 §1.3](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md)) |
| **Material obligation rows** | **✓** (populate) | | DLA emits `required_materials[]` **from** plan — [38R-3 OBL-M](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-3-plan-to-dla-mapping.md) |
| **Cognition field population** | **✓** | | OBL-C: preamble, activation, reflection prompts — **from** plan beats |
| **`learner_task` segment assembly** | **✓** (populate) | | P8: assemble from beats — plan defines segments, DLA concatenates |
| **Material type selection** | | | **GAM/downstream** — [38Q-5 M-4, M-6](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| **Material body / prose depth** | | | **GAM** — pack §6 explicit |
| **Activity metadata** (duration, grouping, mapped LOs) | **✓** | | Container fields — not choreography |
| **Inference content** (criteria text, scenario facts) | **✓** (with KM/LO) | | [38Q-5 M-11](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) — content layer, not plan shape |
| **Session-level sequencing** | **✓** (Construct Learning Sequence) | | Multi-episode — future session plan |

**Rule after integration:** DLA **must not** invent beat order or merge beats. DLA **maps** each plan beat → ≥1 obligation ([38R-3 P1](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-3-plan-to-dla-mapping.md)).

---

## Task 3 — Candidate insertion points

### Option A — LO → Episode Plan → DLA → GAM → Page

```text
KM → LO → [NEW: Episode Plan artefact] → DLA (populate) → GAM → Page
```

| Criterion | Assessment |
|-----------|------------|
| **Educational fit** | **Strong** — matches [38Q-5 Option F](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) and [38R-6 architecture](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-6-sprint-closure.md) |
| **Fidelity risk** | **Low** — GAM/Page path untouched; upstream shape change only ([38Q-5 M-1, M-2](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md)) |
| **Complexity** | **Medium** — new workflow step + DLA prompt refactor; no compose redesign |

**Implementation forms (increasing explicitness):**

| Form | Description | Touch surface |
|------|-------------|---------------|
| **A1 (recommended)** | New step `Design Instructional Episode Plan` → artefact `episode_plans` | Workflow graph + pack + harness |
| **A2 (minimal code path)** | Two-pass in pipeline: emit `episode_plan` JSON per activity, then DLA populate pass | Harness-first; same logical boundary |
| **A3 (not recommended)** | IFP-only inside DLA prompt without persisted plan | [38J-2](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-2-function-plan-prompt-design.md) — **decorative plan** risk (PF-11) |

### Option B — LO → DLA → Episode Plan → GAM

| Criterion | Assessment |
|-----------|------------|
| **Educational fit** | **Failed** — DLA still plans; plan is post-hoc annotation |
| **Fidelity risk** | **Medium** — GAM would need plan for realisation discipline |
| **Complexity** | **High** — splits authority across DLA and GAM |

**Rejected** — contradicts [38Q-5 M-3, M-13](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) plan-before-populate.

### Option C — Episode Plan embedded only in `learning_activities[]` without new step

Add `activities[i].episode_plan` while keeping single DLA step.

| Criterion | Assessment |
|-----------|------------|
| **Educational fit** | **Partial** — structurally valid if **plan emitted before** `required_materials[]` in same step with gate |
| **Fidelity risk** | **Low** |
| **Complexity** | **Low–Medium** — smaller workflow change; harder to enforce M-13 gate |

**Verdict:** Acceptable **only** if plan is persisted and validated **before** population fields in the same step. Logically still Option A (plan before DLA obligations); weaker enforcement than separate artefact/step.

### Selected option

**Option A1** — new artefact + step between LO and DLA. Aligns with 38Q H2, 38R handoff, and M-13 gate.

---

## Task 4 — LO → Episode Plan derivation contract

**Principle:** Prefer **derivation** over new authoring burden ([38S-1 charter questions](../../2026-06-06-sprint-38s-episode-plan-v1-implementation/observations/38S-1-episode-plan-v1-integration.md); [38R-5 IC-4](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-5-implementation-recommendation.md)).

## LO → Episode Plan derivation contract

### Inputs (minimum)

| Input | Required | Role |
|-------|:--------:|------|
| `learning_outcomes` | **Yes** | Archetype signal, concept scope, mapped LO per activity |
| `knowledge_model` | **Yes** | Optional-beat triggers (misconception, contrast, processes) |
| `activity_index` / session position | **Yes** | Activation beat, session arc modifiers ([38I-3](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md)) |
| Workflow brief / `delivery_notes` | **Yes** | Evaluate capstone anchors, domain context (e.g. household A4) |
| Frozen archetype templates | **Yes** | [38R-2 A1–A4 YAML](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-2-archetype-fit-test.md) as seed/validation authority |

**No new user-facing authoring fields** in V1.

### Derivation algorithm (design-level)

```text
1. Map activity → primary LO(s) from learning_activities planning or LO container
2. archetype := f(LO.cognitive_level, LO verbs)     — 38I-3 LO-ARC-01..03
3. base_beats := template(archetype)                 — 38R-2 frozen sequence
4. Apply KM triggers:
     - misconceptions present → ensure misconception_confrontation beat
     - contrasts_with → ensure non_example beat
     - inquiry relationships → ensure guided_inquiry beat
5. Prune optional C-class beats not triggered (38I-2 R/C/O) — order preserved
6. Emit episode_plan { archetype, beats: [{function}, …] }
```

### Output shape (frozen V1)

One `episode_plan` per activity. Container artefact proposal:

```json
{
  "episode_plans": [
    {
      "activity_id": "A1",
      "mapped_learning_outcome_ids": ["LO1"],
      "episode_plan": {
        "archetype": "understand",
        "beats": [{ "function": "orientation" }, …]
      }
    }
  ]
}
```

**Note:** `activity_id` and mapping ids are **pipeline attachment** — not V1 schema fields inside `episode_plan` ([38R-1](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-1-minimum-viable-episode-plan.md) rejected episode identity in plan body).

### What LO information is sufficient

| LO field | Sufficiency for |
|----------|-----------------|
| `cognitive_level` | Archetype selection |
| `statement` / verbs | Archetype edge cases (Apply vs Analyse) |
| Related concepts | Beat pruning scope |
| Outcome index → activity mapping | One plan per activity |

**Additional information required:** KM triggers only — **no new schema** ([38I-3 §1.5 non-expansion rule](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md)).

### Anti-patterns (forbidden)

| Pattern | Why forbidden |
|---------|---------------|
| Prompt-only plan with no persisted artefact | PF-11 ([38R-4](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-4-proof-validation-design.md)) |
| Author manually edits beat lists in UI (v1) | New authoring burden — defer |
| Material types in plan | [38R-1](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-1-minimum-viable-episode-plan.md) rejection |

---

## Task 5 — Episode Plan ownership

| Decision | Owner | Rationale |
|----------|-------|-----------|
| **Performance intent** | **LO** | KM/LO chain — [38I-3 §1.2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md) |
| **Archetype label** | **Episode Plan** (derived from LO) | V1 field; LO supplies signal only |
| **Beat sequence** | **Episode Plan** | Planning authority — [38Q-5 M-3](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| **Function selection per beat** | **Episode Plan** (template + KM triggers) | Ordered functions are the plan unit |
| **Beat order authority** | **Episode Plan** | Pedagogically authoritative rule |
| **Obligation rows (`required_materials[]`)** | **DLA** (populate from plan) | [38R-3](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-3-plan-to-dla-mapping.md) |
| **`instructional_function` tags** | **DLA** (on obligations) | Limited extension — beat identity at realisation |
| **Material types** | **GAM** | Realisation — [38Q-5 M-6](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| **Material bodies** | **GAM** | Pack §6 |
| **Page render order** | **Page compose** (from obligation order) | 38N/38P — generalise `materials_order` |

**38R framing:** Episode Plan is **planning authority**, not a planning **engine** — templates + derivation, not orchestration runtime.

---

## Task 6 — Downstream contract

## Episode Plan → DLA contract

### Minimum inputs to DLA population (per activity)

| Field | Source | Required |
|-------|--------|:--------:|
| `episode_plan` | Episode Plan step | **Yes** |
| `mapped_learning_outcomes[]` | LO / activity binding | **Yes** |
| `knowledge_model` | KM step | **Yes** |
| `activity_id` | Activity container | **Yes** |
| Brief / delivery context | Workflow | **Yes** |
| `activity_index`, `session_size` | Session context | **Yes** (for optional beats) |

### DLA obligations (38S-2)

1. **Gate:** Refuse population if `episode_plan` missing or empty beats (M-13).  
2. **Map:** For each beat `i`, emit ≥1 obligation with `instructional_function` = beat.function.  
3. **Order:** Obligation order = beat order (P2).  
4. **Surfaces:** OBL-M → `required_materials[]`; OBL-C → cognition fields; OBL-T → `learner_task` segments ([38R-3](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-3-plan-to-dla-mapping.md)).  
5. **Anti-collapse:** AC-01–AC-10 at population ([38R-3 Task 4](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-3-plan-to-dla-mapping.md)).

### GAM contract (unchanged)

GAM receives `learning_activities` with populated obligations — **does not read** Episode Plan directly. Plan influence is **already realised** in DLA obligation specs.

### Page contract (unchanged)

Page compose consumes GAM + design-page — fidelity path preserved. Order must propagate via DLA obligation indices → `materials_order` / role index ([38R-3 R-05](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-3-plan-to-dla-mapping.md)).

---

## Task 7 — Implementation touchpoints

| Touchpoint | Impact | Role in integration |
|------------|:------:|---------------------|
| [domain-learning-design-step-patterns.md](../../../../domains/learning-design/domain-learning-design-step-patterns.md) | **High** | New step definition; §5 DLA prompt → population-only; dependencies/precedence |
| [domain-learning-design-artefacts.md](../../../../domains/learning-design/domain-learning-design-artefacts.md) | **Medium** | Document `episode_plans` artefact (docs); optional runtime registration |
| [app.js](../../../../app.js) (`step_design_learning_activities`, workflow runtime) | **High** | Step ordering, artefact pass-through, prompt resolution |
| [lib/dla-38l-obligation-check.js](../../../../lib/dla-38l-obligation-check.js) | **Medium** | Extend/replace with plan-gate + AC checks (38S-3) |
| [lib/page-gam-materials-preserve.js](../../../../lib/page-gam-materials-preserve.js) | **Low** | Unchanged; consumes ordered materials |
| [lib/ld-table-fidelity.js](../../../../lib/ld-table-fidelity.js) | **Low** | GAM table rules unchanged |
| Pack §6 GAM prompt ([step-patterns L2831+](../../../../domains/learning-design/domain-learning-design-step-patterns.md)) | **Low** | "Do not redesign activities" — still valid |
| [ev-38l-inflation-pipeline-capture-once.mjs](../../2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/ev-38l-inflation-pipeline-capture-once.mjs) | **High** | Proof harness — insert plan step/pass |
| `tests/workflow-*.test.js`, `tests/mathjax-producer-prompt-contract.test.js` | **Medium** | Step inventory / precedence updates |
| 38M–38P proof replay (`ev-38p-proof-replay.mjs`) | **Low** | Regression consumer — no change expected |
| UI workflow builder (saved `local_override` prompts) | **Medium** | [38L-DLA diagnosis](../../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-DLA-obligation-run-path-diagnosis.md) — stale overrides bypass pack |

**Not in scope for touch:** role registry, supersession render, RF gates, GAM body merge logic.

---

## Task 8 — Complexity review

| Question | Evidence-based answer |
|----------|----------------------|
| **New workflow?** | **Yes — one step** (or one explicit artefact phase). Precedence: `LO → Episode Plan → DLA`. Not a new orchestration platform. |
| **New author task?** | **No** — derivation from LO + KM + [38R-2 templates](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-2-archetype-fit-test.md). |
| **New review step?** | **Optional** — proof harness validates structure (M-01–M-08). No human review gate required for v1. |
| **New governance process?** | **No** — V1 frozen; template changes are programme docs ([38R-2](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-2-archetype-fit-test.md)), not author workflow. |
| **Prompt size growth?** | **Risk** — IFP block in §5 (~39k chars per [38B probe](../../2026-06-06-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/probe-38B-5-workflow-prompt-inventory.md)) should **shrink** when choreography moves to plan artefact; population prompt stays. |

**38R reminder:** Plan is **authority**, not **engine** — template derivation, not branching runtime.

---

## Task 9 — Integration verdict

### 1. What is the minimum insertion point?

**Between `Define Learning Outcomes` and `Design Learning Activities`**, producing a persisted **`episode_plans`** artefact (one V1 plan per activity), consumed by a **population-only** DLA step.

Logical path:

```text
KM → LO → Episode Plan (NEW) → DLA (populate) → GAM → Page
```

### 2. What responsibilities move from DLA to Episode Plan?

- Archetype selection (as plan field)  
- Ordered instructional function sequence  
- Transition/fade/judgement **choreography** (as ordered beats)  
- Beat-level function identity  

### 3. What responsibilities remain in DLA?

- Obligation population (`required_materials[]`, cognition fields, `learner_task` segments)  
- `instructional_function` tagging on obligations  
- Activity container metadata (duration, grouping, mapped LOs)  
- Inference-filled **specifications** (content), not beat order  

### 4. Does integration preserve 38M–38P?

**Yes** — by design. Changes are **upstream** of GAM and Page compose. [38R-4 Task 5](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-4-proof-validation-design.md) replay path unchanged. Risk is indirect only if population breaks body contracts — detected by existing RF/proof gates.

### 5. Does integration preserve V1 minimality?

**Yes** — plan artefact uses **only** `archetype` + `beats[].function`. Pipeline attachment (`activity_id`, container) lives outside V1 body. No V2 fields introduced.

---

## Task 10 — Inputs to 38S-2

## Population contract inputs

### Integration point

- **New step:** `Design Instructional Episode Plan` (proposed canonical: `step_design_episode_plan`)  
- **Precedence:** after `step_define_learning_outcomes`, before `step_design_learning_activities`  
- **Produces:** `episode_plans`  
- **Consumes:** `learning_outcomes`, `knowledge_model`, brief  

### Ownership model

- Episode Plan **owns** archetype + beat sequence + functions  
- LO **signals** archetype; KM **triggers** optional beats  
- DLA **populates** obligations from plan — does not replan  

### Downstream contract

Per activity: `{ episode_plan, mapped_learning_outcomes, knowledge_model, activity_id, session context }` → DLA obligations per [38R-3 P1–P10](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-3-plan-to-dla-mapping.md).

### Implementation risks

| Risk | Mitigation owner |
|------|------------------|
| Decorative plan (PF-11) | M-13 hard gate in 38S-2 |
| IFP prompt remains primary planner | Remove/replace IFP choreography in §5 with population-only |
| Stale UI workflow overrides | Reseed or validate prompt surface ([38L diagnosis](../../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-DLA-obligation-run-path-diagnosis.md)) |
| Beat collapse at population | AC-01–AC-10 (38S-3) |
| `fullOk` regression | EV-38P replay (38S-4) |

### Migration assumptions

1. **38J IFP internal pass** is superseded by **structural plan artefact** — not prompt accretion ([38R-5](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-5-implementation-recommendation.md)).  
2. **38L DLA-WB rows** remain valid **population obligations** — they specify *what* DLA must emit per function, not *order*. Order comes from plan.  
3. **Inflation harness** (`ev-38l-*` or `EV-38S-AFTER`) is the proof vehicle — insert plan pass before DLA.  
4. **A1–A4 templates** from [38R-2](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-2-archetype-fit-test.md) seed derivation until full LO→template inference is proven.  

---

## Sprint SC contribution

| SC | Status after 38S-1 |
|----|-------------------|
| **SC-1** | **On track** — insertion point and artefact contract defined; implementation in 38S-1 code phase / 38S-2 |

---

## Hold conditions (respected)

- V1 schema not expanded  
- No population behaviour implemented (38S-2)  
- No `instructional_function` tagging implemented (38S-3)  
- No 38M–38P changes  

---

## Status

| Field | Value |
|-------|-------|
| Phase | 38S-1 |
| Status | **COMPLETE** |
| Integration verdict | **Option A** — LO → Episode Plan → DLA (new step + population-only DLA) |
| Next | **38S-2** — Population contract implementation |
