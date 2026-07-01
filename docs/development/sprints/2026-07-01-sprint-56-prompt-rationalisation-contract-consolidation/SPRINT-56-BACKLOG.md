# Sprint 56 — Backlog

**Ordering:** Investigation-first · no new features · measurable rationalisation outputs  
**Baseline:** [SPRINT-56-BASELINE-METRICS.md](SPRINT-56-BASELINE-METRICS.md)

---

## P1 — DLA / Guided Learning

### DLA-01 — Emitted prompt size CI baseline

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Objective** | Lock Sprint 55 char counts into automated regression |
| **Deliverable** | Test: RNA HCV DLA emitted core ≤49,949 (baseline); post-rationalisation ≤32,000 |
| **Success measure** | CI fails on unapproved size increase |
| **Dependencies** | None |
| **Risk** | Low |
| **Traceability** | Baseline 49,949 chars |

---

### DLA-02 — Scaffold contract layer map

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Objective** | Document every block in `applySelfDirectedLearnerPageStepScaffoldsToDraft` with ownership |
| **Deliverable** | Layer map + supersession targets |
| **Success measure** | 5 layers → 1 SSOT design approved |
| **Dependencies** | None |
| **Risk** | Low |
| **Traceability** | 5 overlapping layers |

---

### DLA-03 — Word-range conflict resolution spec

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Objective** | Authoritative numeric table; elimination of 25–80, dual transfer ranges |
| **Deliverable** | SSOT range spec signed off |
| **Success measure** | 0 conflict classes in emitted prompt regex scan |
| **Dependencies** | DLA-02 |
| **Risk** | Medium — brief matrix edge cases |
| **Traceability** | 7 conflict classes |

---

### DLA-04 — Unified PRE-EMIT gate design

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Objective** | Merge presence + word-count; deprecate LD-COGNITION PRE-EMIT |
| **Deliverable** | PRE-EMIT spec in SSOT |
| **Success measure** | 1 gate system; 0 presence-only scaffold gates |
| **Dependencies** | DLA-03 |
| **Risk** | Medium |
| **Traceability** | 7 presence-only gates |

---

### DLA-05 — Duplicate guidance removal (implementation)

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Objective** | Remove ~19k chars redundant scaffold prose |
| **Deliverable** | PR: consolidated SSOT emission |
| **Success measure** | ≥35% emitted char reduction; duplicate chars ≤2k |
| **Dependencies** | DLA-02, DLA-03, DLA-04 |
| **Risk** | High — regression on brief matrix |
| **Traceability** | ~19k duplicate estimate |

---

### DLA-06 — Exemplar rationalisation

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Objective** | Single compliant exemplar set; remove short Strong self_explanation |
| **Deliverable** | One JSON example + one weak/strong contrast set |
| **Success measure** | 1 exemplar system; all Strong examples ≥ word floor |
| **Dependencies** | DLA-05 |
| **Risk** | Low |
| **Traceability** | 4 exemplar systems; LD-COGNITION short Strong |

---

### DLA-07 — Instruction competition trim

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Objective** | Address EQF “reduce scaffolding”, PEL one-cue, learner_task concise ambiguity |
| **Deliverable** | Trim/qualify competing lines or move SSOT earlier |
| **Success measure** | Competition source checklist cleared |
| **Dependencies** | DLA-05 |
| **Risk** | Medium |
| **Traceability** | Emitted-prompt audit § instruction competition |

---

### DLA-08 — Copy path external generation spot-check

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Objective** | Validate rationalised prompt improves scaffold word counts (manual) |
| **Deliverable** | Spot-check record (RNA/HCV) |
| **Success measure** | ≥80% activities meet word floors on sample run |
| **Dependencies** | DLA-05 |
| **Risk** | Medium — model variance |
| **Traceability** | Sprint 55 unresolved output quality |

---

### DLA-09 — Deprecation register

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Objective** | Log all superseded blocks with removal sprint |
| **Deliverable** | `DEPRECATION-REGISTER.md` |
| **Success measure** | Every removed marker documented |
| **Dependencies** | DLA-05 |
| **Risk** | Low |

---

## P2 — GAM

### GAM-01 — GAM emitted prompt accretion audit

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Objective** | Replicate DLA audit methodology for `step_generate_activity_materials` |
| **Deliverable** | GAM rationalisation audit doc + char inventory |
| **Success measure** | Top 10 contributors identified; duplication estimate |
| **Dependencies** | DLA audit methodology |
| **Risk** | Medium — scope expansion |
| **Traceability** | DLA 82% single-step pattern hypothesis |

---

### GAM-02 — GAM SSOT mapping

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Objective** | Map instructional-pattern, materials-copy, table fidelity, rhetoric layers |
| **Deliverable** | GAM SSOT proposal |
| **Success measure** | Ownership gaps listed |
| **Dependencies** | GAM-01 |
| **Risk** | Medium |

---

### GAM-03 — GAM duplicate/conflict scan

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Objective** | Identify superseded guidance vs DLA-upstream preservation rules |
| **Deliverable** | Conflict + duplication inventory |
| **Success measure** | Rationalisation candidates ranked |
| **Dependencies** | GAM-01 |
| **Risk** | Low |

---

### GAM-04 — GAM rationalisation plan (plan only)

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Objective** | Phased plan for Sprint 57 or late Sprint 56 |
| **Deliverable** | GAM programme doc |
| **Success measure** | Size budget proposed |
| **Dependencies** | GAM-01, GAM-02, GAM-03 |
| **Risk** | Low |

---

## P3 — Design Page

### DP-01 — Design Page emitted prompt accretion audit

| Field | Value |
|-------|-------|
| **Priority** | P3 |
| **Objective** | Audit `step_design_page` augmentation chain |
| **Deliverable** | Design Page rationalisation audit |
| **Success measure** | Char breakdown + top 10 contributors |
| **Dependencies** | DLA audit methodology |
| **Risk** | Medium |

---

### DP-02 — Compose vs scaffold boundary audit

| Field | Value |
|-------|-------|
| **Priority** | P3 |
| **Objective** | Separate preservation (L4) rules from generation rhetoric duplicates |
| **Deliverable** | Boundary doc |
| **Success measure** | No duplicate scaffold ranges on compose step |
| **Dependencies** | DP-01 |
| **Risk** | Medium — preservation regression |

---

### DP-03 — Design Page rationalisation plan

| Field | Value |
|-------|-------|
| **Priority** | P3 |
| **Objective** | Plan consolidation for journey assimilation, authorial exposition, guided scaffold on compose |
| **Deliverable** | DP programme doc |
| **Success measure** | SSOT pointers defined |
| **Dependencies** | DP-01, DP-02, DLA-05 |
| **Risk** | Low |

---

## P4 — Governance & cross-cutting

### GOV-01 — Adopt prompt governance framework

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Objective** | Ratify [SPRINT-56-PROMPT-GOVERNANCE.md](SPRINT-56-PROMPT-GOVERNANCE.md) |
| **Deliverable** | Governance doc + PR checklist in repo |
| **Success measure** | DoD additions used in DLA-05 PR |
| **Dependencies** | None |
| **Risk** | Low |

---

### GOV-02 — Duplicate/conflict CI guards

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Objective** | Automated regex checks for range duplication |
| **Deliverable** | Test suite guards |
| **Success measure** | CI catches reintroduced 25–80 vs 35–80 |
| **Dependencies** | DLA-03, GOV-01 |
| **Risk** | Low |

---

### GOV-03 — Remaining prompt systems inventory

| Field | Value |
|-------|-------|
| **Priority** | P4 |
| **Objective** | List assessment, episode plan, LO, KM steps with augmentation |
| **Deliverable** | Inventory spreadsheet/doc |
| **Success measure** | All canonical steps classified |
| **Dependencies** | None |
| **Risk** | Low |

---

## Suggested sprint sequencing

```
Week 1: DLA-01, DLA-02, GAM-01, GOV-01
Week 2: DLA-03, DLA-04, DLA-05 (start), GAM-02, GAM-03, DP-01
Week 3: DLA-05 (complete), DLA-06, DLA-07, DLA-09, GOV-02
Week 4: DLA-08, GAM-04, DP-02, DP-03, closure metrics
```
