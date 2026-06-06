# Sprint 38-P — Implementation charter (Instructional Role Fidelity)

**Date:** 2026-06-05  
**Closed:** 2026-06-06  
**Status:** **CLOSED — SUCCESS**  
**Closure:** [38P-7-sprint-closure.md](observations/38P-7-sprint-closure.md)  
**Predecessor:** [Sprint 38-O](../2026-06-05-sprint-38o-instructional-material-role-preservation/) (**CLOSED** — [38O-5](../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-5-sprint-closure.md) · **SUCCESS**)

---

## Background

Sprints 38-M and 38-N closed the **body fidelity** cliff at L4 page composition. GAM bodies survive merge, anti-synopsis and anti-table-shell gates pass, A3 render ordering is hardened, and `proofOk: true` on `EV-38N-AFTER` replay with **21/21** regression tests passing.

Sprint 38-O discovered that body fidelity and **role fidelity** are **orthogonal**. On `EV-38M-AFTER`, merged page JSON can contain full GAM teaching bodies on canonical contract keys while **weaker compose stubs coexist** on parallel keys and the **renderer surfaces compose keys first**. Learners encounter thin or mis-labelled instructional roles despite passing body ratio gates — especially on **A4 capstone** evaluative activities.

The dominant failure pattern (38O-3):

```text
Compose weaken → Additive merge → Render prefers compose keys → Learner sees weaker role first
```

38O recommended **F1 — Registry-led hybrid** as the preservation strategy. Sprint 38-P implements that strategy as production architecture and proof machinery.

---

## Evidence base

| Document | Role |
|----------|------|
| [38M-6-sprint-closure.md](../2026-06-05-sprint-38m-page-composition-fidelity/observations/38M-6-sprint-closure.md) | Body fidelity mission; merge contract; `proofOk` baseline |
| [38N-5-sprint-closure.md](../2026-06-05-sprint-38n-page-fidelity-hardening/observations/38N-5-sprint-closure.md) | Hardening residuals R1–R3 closed; A3 render ordering pattern |
| [38O-5-sprint-closure.md](../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-5-sprint-closure.md) | Discovery verdict; implementation disposition |
| [38O-1-baseline-role-survival-trace.md](../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-1-baseline-role-survival-trace.md) | Role-survival matrix A1–A4; body vs role distinction |
| [38O-2-role-taxonomy-page-mapping-analysis.md](../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-2-role-taxonomy-page-mapping-analysis.md) | 17+ role families; GAM→Page→Render mapping |
| [38O-3-failure-mode-classification.md](../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-3-failure-mode-classification.md) | Ten failure modes; unified A4 pattern; causal model |
| [38O-4-preservation-options-recommendation.md](../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-4-preservation-options-recommendation.md) | F1 strategy; RF-1..RF-8 success criteria |

**Frozen proof baselines:**

- `EV-38M-AFTER-*` — pre-38P inflation capture (body passes, role fails A4)  
- `EV-38N-AFTER-*` — post-38N render replay  
- [38I-4 A4 episode](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) — target episode sequence reference

---

## 38O findings summary

| Finding | Implication for 38P |
|---------|---------------------|
| `proofOk: true` coexists with `roleOk: false` on A4 | Role gates must be additive, not replacements |
| Root cause: missing role authority on page model | Explicit `role_family` + `authority` metadata required |
| Split key vocabularies across GAM / compose / merge / render | Role registry as cross-layer contract |
| Additive merge restores bodies without retiring stubs | Merge supersession policy required |
| Render iterates compose keys before contract keys | Render role precedence required (extend 38N A3 pattern) |
| A4 unified CP→DP→RD pattern | Primary proof target; all four F1 components needed |
| A1–A3 systemic RN/DP/AP noise | Secondary proof scope; should clean without regression |
| RF-1..RF-8 criteria defined | Implement as `roleOk` validator suite |

---

## Mission

**Instructional Role Fidelity Implementation** — establish instructional role fidelity as a first-class architectural guarantee alongside body fidelity, implementing the **F1 registry-led hybrid** from 38O-4.

**Target:**

```text
proofOk: true  +  roleOk: true
```

Role-fidelity guarantees must be **additive** to 38M/38N body-fidelity guarantees.

**Not:** discovery sprint; reopening 38M body preservation; reopening 38N hardening; schema/ACM/workflow redesign; general instructional quality review; prompt-only compose fix without merge/render contract.

---

## Scope

### In scope

| Component | Description |
|-----------|-------------|
| **Role registry** | GAM `type`+`purpose` → `role_family` → canonical page key → learner heading → sequence weight |
| **Explicit role metadata** | `role_family`, `authority` (`gam` \| `compose` \| `superseded`) on page materials |
| **Merge supersession** | Retire or mark non-renderable compose stubs when GAM wins for same role family |
| **Render role precedence** | One block per role family; authoritative instance first; ordered by registry sequence |
| **roleOk validation** | RF-1..RF-8 proof gates alongside existing `proofOk` |
| **Proof harness** | `EV-38P-AFTER` replay on inflation workload |
| **Regression tests** | Role fidelity tests additive to existing 21/21 suite |

### Expected touch surfaces (indicative — confirmed in 38P-1)

| Surface | Scope |
|---------|--------|
| `lib/page-gam-materials-preserve.js` | Role registry extension; supersession policy; authority tagging |
| `lib/page-a3-materials-sequencing.js` | Role-aware render ordering (generalise alias groups) |
| `app.js` | Role-precedence render path |
| New role validator module | `validate38PRoleFidelity` / `roleOk` aggregator |
| `tests/page-38p-role-fidelity.test.js` | Role fidelity regression suite |
| `artefacts/ev-38p-proof-replay.mjs` | 38P-6 proof harness |

### Out of scope (this sprint)

| Item | Notes |
|------|-------|
| Compose LLM prompt redesign | May complement 38P but not primary surface; merge/render contract is sufficient for merged-path proof |
| Schema expansion beyond role metadata | Minimal additive fields only |
| ACM / IFP / DLA changes | Upstream role authority already in GAM |
| Renderer CSS / styling | Structural role fidelity only |
| New material types or archetypes | Existing 38O-2 taxonomy |

---

## Non-goals

| Non-goal | Notes |
|----------|--------|
| Reopen 38M body preservation | Closed — SUCCESS; extend merge contract only |
| Reopen 38N hardening | Closed — SUCCESS; extend render precedence pattern only |
| Replace `proofOk` with `roleOk` | Both must pass independently |
| Mandate identical GAM `type` strings on page | Renaming acceptable if role family and authority explicit |
| Eliminate all alias keys globally | Aliases may remain if marked `superseded` and suppressed at render |
| Full 38I-4 episode quality benchmark | Role survival and sequence alignment; not depth scoring |
| Word-count-only role metrics | Role function and authority, not length alone |

---

## Architecture targets

### Layered fidelity model

```text
Body fidelity (38M/38N)     — Is the substantive GAM body present at ≥ contract ratio?
                            — Gate: proofOk

Role fidelity (38P)         — Is exactly one authoritative instance rendered with correct
                              function, label, and order per role family?
                            — Gate: roleOk

Full L4 instructional fidelity = proofOk AND roleOk
```

### F1 — Registry-led hybrid (implementation targets)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ GAM — role authority: type + purpose                                         │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │ Role registry lookup
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ ROLE REGISTRY — role_family, canonical_key, heading, sequence_weight         │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
┌──────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│ PAGE MATERIALS   │    │ MERGE                │    │ RENDER               │
│ role_family      │    │ supersession policy  │    │ role precedence      │
│ authority flag   │    │ GAM body injection   │    │ one block per role   │
│ (38M body intact)│    │ (38M ratio intact)   │    │ registry sequence    │
└──────────────────┘    └──────────────────────┘    └──────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ PROOF — proofOk (38M/38N) + roleOk (RF-1..RF-8)                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Authority rules (conceptual)

| Rule | Description |
|------|-------------|
| **GAM wins body** | 38M merge contract unchanged — GAM body on canonical contract key |
| **GAM wins role** | When GAM body applied, compose stubs for same `role_family` → `authority: superseded` |
| **One render block** | Renderer emits highest-authority surviving instance per `(activity, role_family)` |
| **Registry headings** | Learner-facing heading from registry map, not ad hoc `prettyMaterialHeading(key)` where registry applies |
| **Sequence order** | Capstone activities ordered by registry `sequence_weight` (38I-4 alignment for A4) |

### Split authority model — before vs after

| Layer | Before (38O finding) | After (38P target) |
|-------|---------------------|-------------------|
| GAM | `type` + `purpose` | Unchanged — source of truth |
| Page | Untyped key→body | Key + `role_family` + `authority` |
| Merge | Additive overlay only | Additive body + supersession for same role |
| Render | Key-order iteration | Role-precedence + registry sequence |
| Proof | `proofOk` only | `proofOk` + `roleOk` |

---

## Success criteria

At sprint completion:

| ID | Criterion | Source |
|----|-----------|--------|
| **SC-1** | One authoritative role instance per instructional role family per activity | RF-1 |
| **SC-2** | No weaker duplicate role precedes authoritative role in render | RF-2 |
| **SC-3** | Stable role identity GAM → Page → Render | RF-3 |
| **SC-4** | No role inversion (consolidation ≠ learner-write prompt) | RF-5 |
| **SC-5** | Pedagogical function markers on authoritative body, not stub | RF-4 |
| **SC-6** | A4 capstone render sequence aligns with 38I-4 episode within tolerance | RF-6 |
| **SC-7** | Body fidelity on authoritative instance ≥ 38M tier minimum | RF-7 |
| **SC-8** | Compose vs GAM authority auditable on raw and merged page | RF-8 |
| **SC-9** | `roleOk: true` on `EV-38P-AFTER` proof workload | Proof run |
| **SC-10** | `proofOk: true` remains on `EV-38P-AFTER` — no 38M/38N regression | Proof run |
| **SC-11** | Existing regression suite passes (≥21/21 + new 38P tests) | Tests |

---

## Proof requirements

### Baseline comparison

| Run | Purpose |
|-----|---------|
| `EV-38M-AFTER` / `EV-38N-AFTER` | Pre-38P baseline — `proofOk: true`, `roleOk: false` (A4) |
| `EV-38P-AFTER` | Post-38P proof — `proofOk: true`, `roleOk: true` |

### Proof harness (38P-6)

Replay inflation pipeline on frozen or fresh capture. Report:

| Field | Expected |
|-------|----------|
| `proofOk` | `true` |
| `roleOk` | `true` |
| `validation38M.ok` | `true` |
| `validation38P.ok` | `true` |
| `a4RoleSequencing.render.ok` | `true` |
| Regression tests | All pass |

### Primary proof activities

| Activity | Role fidelity focus |
|----------|---------------------|
| **A4** | Capstone — CP/DP/RD cluster; worked judgement, guided table, template, transfer, consolidation |
| **A3** | Sequence alignment — extend 38N ordering to role-family model |
| **A1–A2** | Systemic RN/DP/AP cleanup; checklist duplication |

### A4 specific checks (from 38O-1)

Pre-38P failure cases that must pass post-38P:

- `Modelling Note` stub must not precede `Worked Judgement Weak Strong` full body  
- `Decision Table` shell must not precede `Guided Judgement Table` full body  
- `Transfer Prompt` stub must not precede `Transfer Prompt Evaluate` full body  
- No duplicate weak+strong pairs in learner render for same role family

---

## Phase plan

### 38P-1 — Role authority architecture

| Field | Content |
|-------|---------|
| **Purpose** | Design role authority model: registry schema, metadata fields, authority rules, integration points with 38M merge and 38N render |
| **Deliverable** | `observations/38P-1-role-authority-architecture.md` |
| **Depends on** | 38O-4 F1 recommendation |
| **Permissions** | Design doc only — no production code |
| **Status** | **Complete** |

---

### 38P-2 — Role registry implementation

| Field | Content |
|-------|---------|
| **Purpose** | Implement role registry: GAM type/purpose → role_family → canonical key → heading → sequence weight |
| **Deliverable** | Code in registry module; observation doc |
| **Depends on** | 38P-1 |
| **Permissions** | Code + tests |
| **Status** | **Complete** |

---

### 38P-3 — Merge supersession implementation

| Field | Content |
|-------|---------|
| **Purpose** | Extend merge contract with supersession: retire/mark compose stubs when GAM wins for same role family; tag authority metadata |
| **Deliverable** | Code in merge layer; observation doc |
| **Depends on** | 38P-2 |
| **Permissions** | Code + tests |
| **Status** | **Complete** |

---

### 38P-4 — Render role-precedence implementation

| Field | Content |
|-------|---------|
| **Purpose** | Generalise 38N A3 render ordering to role-family precedence; one block per role; registry sequence order |
| **Deliverable** | Code in render/sequencing layer; observation doc |
| **Depends on** | 38P-2, 38P-3 |
| **Permissions** | Code + tests |
| **Status** | **Complete** |

---

### 38P-5 — roleOk validation and proof harness

| Field | Content |
|-------|---------|
| **Purpose** | Implement RF-1..RF-8 validators; `roleOk` aggregator; regression test suite |
| **Deliverable** | Validator module; `tests/page-38p-role-fidelity.test.js`; observation doc |
| **Depends on** | 38P-2, 38P-3, 38P-4 |
| **Permissions** | Code + tests |
| **Status** | **Complete** |

---

### 38P-6 — Proof run

| Field | Content |
|-------|---------|
| **Purpose** | Execute proof replay; capture `EV-38P-AFTER-*`; confirm `proofOk` + `roleOk` |
| **Deliverable** | `observations/38P-6-proof-run.md` · `artefacts/EV-38P-AFTER-*` |
| **Depends on** | 38P-5 |
| **Permissions** | Harness run + artefacts |
| **Status** | **Complete** |

---

### 38P-7 — Sprint closure

| Field | Content |
|-------|---------|
| **Purpose** | Sprint closure record with implementation verdict |
| **Deliverable** | `observations/38P-7-sprint-closure.md` |
| **Depends on** | 38P-6 |
| **Permissions** | Docs only |
| **Status** | **Complete** |

**Dependency chain:**

```text
38P-1 Architecture → 38P-2 Registry → 38P-3 Supersession → 38P-4 Render precedence
                                                          ↘
38P-5 roleOk validators ←─────────────────────────────────┘
       → 38P-6 Proof → 38P-7 Closure
```

---

## Implementation permissions by phase

| Phase | Code / pack changes | Notes |
|-------|---------------------|-------|
| **38P-1** | **None** | Architecture design only |
| **38P-2** | **Code** | Registry module |
| **38P-3** | **Code** | Merge supersession |
| **38P-4** | **Code** | Render role precedence |
| **38P-5** | **Code + tests** | roleOk validators |
| **38P-6** | **Harness + artefacts** | Proof run |
| **38P-7** | **Docs only** | Closure |

**Hold:** 38M body preservation guarantees and 38N hardening must remain intact throughout.

---

## Risks (from 38O-4 — monitor during implementation)

| Risk | Mitigation |
|------|------------|
| 38M regression from supersession | Supersede only same `role_family`; body gates on authoritative instance first |
| Registry drift vs GAM-PRES | Version registry; tie to GAM `material_id` |
| Manual path skips merge | RF-8 authority audit; roleOk fails on compose-only thin page |
| Over-unification of checklist aliases | Registry allows sub-roles or single checklist family |
| Compose-stage CP/RI persists on raw-only path | Merge + render fix merged path; raw compose out of primary proof scope unless RF-8 flags |

---

## Programme lineage

```text
38M — Body fidelity (merge contract, proofOk)                    CLOSED SUCCESS
38N — Body-fidelity hardening (markers, render order, schema)  CLOSED SUCCESS
38O — Role-fidelity discovery (taxonomy, failure modes, F1)    CLOSED SUCCESS
38P — Role-fidelity implementation (registry, supersession, roleOk)  CLOSED SUCCESS
Next — Instructional episode depth / 38I alignment (recommended)
```

---

## Sprint closure (38P-7)

| Field | Value |
|-------|-------|
| **Verdict** | **CLOSED — SUCCESS** |
| **Proof run** | EV-38P-AFTER — `proofOk: true`, `roleOk: true`, `fullOk: true` |
| **Regression** | 58/58 pass |
| **Closure doc** | [observations/38P-7-sprint-closure.md](observations/38P-7-sprint-closure.md) |
| **Next recommended** | Instructional episode depth (DLA/GAM); 38I-4 alignment — not fidelity preservation |
