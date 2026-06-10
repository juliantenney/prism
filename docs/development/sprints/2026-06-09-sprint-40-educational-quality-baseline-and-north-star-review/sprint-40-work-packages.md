# Sprint 40 — Work Packages

**Date:** 2026-06-09  
**Authority:** [sprint-40-handover-pack.md](sprint-40-handover-pack.md) · [sprint-40-plan.md](sprint-40-plan.md)

---

## Package 1 — North Star Review

### Purpose

Review existing North Star and teaching-architecture documentation; separate educational aspirations from settled architectural assumptions; produce a practical **North Star v2** standard for subsequent educational quality work.

### Scope

| In | Out |
|----|-----|
| Synthesis of 38Q, 38I, 38E–38P fidelity lineage, contract floors (GAM-PRES, workbook) | Episode Plan schema changes |
| Classification: aspiration vs architecture vs retired | DLA/GAM/Page prompt rewrites |
| North Star v2 observable output criteria | Implementation of quality improvements |
| Mapping 38Q gaps to post–38S status (planning vs generation) | Reopening H1/H2/H3 abstraction redesign |

### Exclusions

- Code, pack, or runtime changes
- Architecture ownership proposals
- Benchmark capture (Package 2)
- Gap scoring (Package 3)

### Inputs

| Input | Location |
|-------|----------|
| 38Q “what good looks like” baseline | [38Q-1](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-1-what-good-looks-like-baseline.md) |
| Episode taxonomy catalogue | [38Q-2](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-2-episode-taxonomy-catalogue.md) |
| DLA/GAM gap register | [38Q-3](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md) |
| 38Q closure and recommendation | [38Q-5](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) · [38Q-6](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-6-sprint-closure.md) |
| 38I instructional episode exemplars | [38I-4 artefacts](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/) |
| Settled architecture | [38S-architecture-closure-note.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-3/38S-architecture-closure-note.md) |
| Post–39 state | [sprint-39-closure-note.md](../2026-06-08-sprint-39-architecture-optimisation-and-prompt-debt-reduction/sprint-39-closure-note.md) |
| Deferred EQ items | [sprint-39-deferred-items.md](../2026-06-08-sprint-39-architecture-optimisation-and-prompt-debt-reduction/sprint-39-deferred-items.md) § Educational Quality Programme |

### Detailed tasks

| ID | Task | Notes |
|----|------|-------|
| NS-1 | Inventory all North Star / “what good looks like” sources | Include 38Q, 38I, GAM-PRES floors, PEL aspirations, VA north-star reject/generate cues |
| NS-2 | Classify each element: **aspiration** / **settled architecture** / **retire** / **clarify** | Episode Plan = settled (38S); worksheet critique may need reframing |
| NS-3 | Reconcile 38Q G3/G5 planning gaps with Episode Plan implementation | Mark resolved vs residual quality gaps |
| NS-4 | Draft North Star v2 — observable output requirements per quality dimension | Practical terms: exposition depth, worked reasoning, journey coherence, etc. |
| NS-5 | Document explicit non-goals for North Star v2 | No ownership change; no prompt implementation in Sprint 40 |
| NS-6 | Publish review observation | `observations/40S-1-north-star-review.md` |

### Deliverables

| Deliverable | Location |
|-------------|----------|
| North Star review observation | `observations/40S-1-north-star-review.md` |
| North Star v2 summary table | Within 40S-1 (confirmed / revised / retired register) |

### Completion criteria

- [ ] NS-1–NS-6 complete
- [ ] North Star v2 stated in **observable output** terms
- [ ] Settled 38S/39 architecture explicitly excluded from revision scope
- [ ] 38Q Episode Plan recommendation recorded as **implemented**, not open
- [ ] No code or prompt changes made
- [ ] Review published

---

## Package 2 — Educational Quality Benchmark Suite

### Purpose

Define and capture a baseline suite of current outputs from the frozen architecture for cross-mode and cross-domain quality comparison.

### Scope

| In | Out |
|----|-----|
| Benchmark candidate definition and capture metadata | Prompt or code changes to improve outputs |
| Indexing EV-38S-AFTER-4 and other existing artefacts | New architecture features |
| Qualitative strength/weakness notes per benchmark | Full quantitative scoring (Package 3) |
| Optional fresh production runs for capture only | Benchmark automation harness (future) |

### Exclusions

- Output editing or post-processing
- Architecture changes to support benchmarks
- Gap analysis against North Star (Package 3)

### Inputs

| Input | Use |
|-------|-----|
| [EV-38S-AFTER-4 artefacts](../2026-06-06-sprint-38s-episode-plan-v1-implementation/artefacts/) | Primary Inflation self-study baseline (B1) |
| `ev-38s-production-pipeline-chase.mjs` | Harness provenance and `fullOk` status |
| `tests/fixtures/page-render/marx-self-study-page.json` | Marx fixture reference |
| Workshop workflow definitions | Inflation workshop, Marx workshop brief resolution |
| [sprint-39-artefact-pathway-inventory.md](../2026-06-08-sprint-39-architecture-optimisation-and-prompt-debt-reduction/sprint-39-artefact-pathway-inventory.md) | Workflow path documentation |

### Benchmark specifications

#### B1 — Inflation (self-study) — **mandatory**

| Field | Requirement |
|-------|-------------|
| Delivery mode | `self_directed` / self-study learner page |
| Workflow path | KM → LO → EP → DLA → GAM → Design Page → Render |
| Primary artefacts | `episode_plans`, `learning_activities`, `activity_materials`, `page`, `EV-38S-AFTER-4-render.html` |
| Harness | `EV-38S-AFTER-4` — `fullOk: true` |

#### B2 — Inflation (workshop) — **mandatory**

| Field | Requirement |
|-------|-------------|
| Delivery mode | Facilitated workshop |
| Workflow path | Primary chain + `learning_sequence` where brief resolves |
| Artefacts | As produced; note facilitator vs learner profile |
| Capture | Existing run or dedicated capture — document source |

#### B3 — Karl Marx (workshop) — **mandatory**

| Field | Requirement |
|-------|-------------|
| Delivery mode | Workshop (may include PEC-enriched brief patterns) |
| Domain | Humanities / source-based comparison |
| Artefacts | Fixture and/or fresh run; Marx workflow test references |
| Notes | PEC gate behaviour; comparison/scenario activity patterns |

#### B4 — Research Methods (self-study) — **optional**

Add if low-cost capture available; not required for sprint closure.

### Detailed tasks

| ID | Task | Notes |
|----|------|-------|
| BM-1 | Confirm benchmark candidate list and capture plan | B1–B3 mandatory |
| BM-2 | Capture B1 from EV-38S-AFTER-4 index | File paths, run log, warnings |
| BM-3 | Capture B2 Inflation workshop | Document workflow steps and artefacts |
| BM-4 | Capture B3 Karl Marx workshop | Fixture +/or production run |
| BM-5 | Per benchmark: brief, path, artefacts, strengths, weaknesses | Qualitative; evidence-linked |
| BM-6 | Optional: copy key artefacts to `artefacts/40S-BENCHMARK-*` | Index in observation doc |
| BM-7 | Publish benchmark suite observation | `observations/40S-2-educational-quality-baseline-suite.md` |

### Deliverables

| Deliverable | Location |
|-------------|----------|
| Benchmark suite observation | `observations/40S-2-educational-quality-baseline-suite.md` |
| Artefact index table | Within 40S-2 |
| Optional artefact copies | `artefacts/40S-BENCHMARK-*.json` / `.html` |

### Completion criteria

- [ ] B1–B3 captured with provenance
- [ ] Each benchmark has brief, delivery mode, workflow path, artefact paths
- [ ] Strengths and weaknesses documented (≥3 each per benchmark where evidence allows)
- [ ] Harness / validator warnings recorded (e.g. G13, RF2)
- [ ] No code or prompt changes made
- [ ] Benchmark suite observation published

---

## Package 3 — Output vs North Star Gap Analysis

### Purpose

Compare Package 2 benchmark outputs against North Star v2 (Package 1) across agreed evaluation dimensions; document educational quality gaps with evidence.

### Scope

| In | Out |
|----|-----|
| Dimension-by-dimension gap analysis per benchmark | Priority ranking (Package 4) |
| Evidence-linked gap register | Implementation recommendations |
| Cross-benchmark patterns (self-study vs workshop) | Architecture defect proposals |
| Severity / confidence ratings | Automated quality scoring tooling |

### Exclusions

- Code or prompt changes
- Fixing identified gaps
- Revising North Star without Package 1 completion

### Inputs

| Input | Source |
|-------|--------|
| North Star v2 | `observations/40S-1-north-star-review.md` |
| Benchmark suite | `observations/40S-2-educational-quality-baseline-suite.md` |
| Artefact bodies | Indexed JSON/HTML from benchmarks |
| 38Q-3 gap register | Prior gap IDs for continuity where still relevant |

### Evaluation dimensions

1. Explanation quality  
2. Worked thinking quality  
3. Guided practice quality  
4. Verification quality  
5. Transfer quality  
6. Evaluation and judgement quality  
7. Coherence of learning journey  
8. Authenticity  
9. Learner independence  
10. Workshop usefulness  
11. Instructor support  

### Detailed tasks

| ID | Task | Notes |
|----|------|-------|
| GA-1 | Build gap analysis matrix (benchmarks × dimensions) | Use North Star v2 criteria as column headers |
| GA-2 | Score or qualitatively rate each cell | met / partial / gap / not applicable |
| GA-3 | Document top gaps per benchmark with artefact citations | Activity IDs, material IDs, page sections |
| GA-4 | Identify cross-cutting patterns | e.g. worksheet feel, thin Evaluate judgement, weak transfer |
| GA-5 | Separate **quality gaps** from **architecture limitations** | Architecture items → deferred register only |
| GA-6 | Map residual gaps to 38Q register where applicable | Note planning gaps now closed by Episode Plan |
| GA-7 | Publish gap analysis observation | `observations/40S-3-current-output-vs-north-star-gap-analysis.md` |

### Deliverables

| Deliverable | Location |
|-------------|----------|
| Gap analysis observation | `observations/40S-3-current-output-vs-north-star-gap-analysis.md` |
| Gap register (ID’d) | Within 40S-3 — feeds Package 4 |

### Completion criteria

- [ ] All eleven dimensions addressed for B1–B3
- [ ] Every gap links to benchmark evidence
- [ ] Planning vs generation gaps distinguished
- [ ] No architecture change proposals presented as Sprint 40 actions
- [ ] Gap analysis observation published

---

## Package 4 — Educational Quality Priority Setting

### Purpose

Produce a prioritised register of future educational quality work packages based on gap analysis — **documentation only**.

### Scope

| In | Out |
|----|-----|
| Ranked priority list with rationale | Implementation in Sprint 40 |
| Work package sketches (objective, scope sketch, dependencies) | Prompt or code edits |
| Mapping gaps → candidate interventions | Commitment to delivery dates |
| Suggested successor sprint themes | Architecture optimisation work |

### Exclusions

- Any implementation of listed priorities
- Prompt rewrites, contract changes, new validators
- PEL or VA programme execution

### Inputs

| Input | Source |
|-------|--------|
| Gap register | `observations/40S-3-current-output-vs-north-star-gap-analysis.md` |
| North Star v2 | `observations/40S-1-north-star-review.md` |
| Deferred EQ register | [sprint-39-deferred-items.md](../2026-06-08-sprint-39-architecture-optimisation-and-prompt-debt-reduction/sprint-39-deferred-items.md) |
| Strategic position | [sprint-39-artefact-pathway-inventory.md](../2026-06-08-sprint-39-architecture-optimisation-and-prompt-debt-reduction/sprint-39-artefact-pathway-inventory.md) §4 |

### Likely priority themes (to be validated by gaps)

| Theme | Example gaps |
|-------|--------------|
| Richer concept exposition | Thin orienting text; generic definitions |
| Stronger worked examples | GAM-PRES-08 floor met but not rich L3 |
| Better judgement modelling | Evaluate memo scaffold depth (G13 warnings) |
| Improved transfer prompts | Transfer activities generic |
| Verification and repair | Checklist without repair path quality |
| Evaluation activities | Independent judgement template depth |
| Workshop facilitation value | Sequence/run guidance thin |
| Learner narrative | Journey coherence; intellectual bridges |

### Detailed tasks

| ID | Task | Notes |
|----|------|-------|
| PR-1 | Consolidate gaps into themes | Deduplicate across benchmarks |
| PR-2 | Rank priorities by impact × feasibility × strategic fit | Self-study and workshop lenses |
| PR-3 | Draft work package sketches (WP-40-EQ-01…) | Objective, scope sketch, dependencies, intervention class |
| PR-4 | Classify intervention class per priority | prompt / contract / exemplar / harness / manual review — not implementation |
| PR-5 | Note dependencies on ARCH-* or VA programme | Keep architecture separate |
| PR-6 | Propose Educational Quality Benchmark Suite maintenance | Re-run cadence for future sprints |
| PR-7 | Publish priorities observation | `observations/40S-4-educational-quality-priorities.md` |

### Deliverables

| Deliverable | Location |
|-------------|----------|
| Priorities observation | `observations/40S-4-educational-quality-priorities.md` |
| Ranked work package register | Within 40S-4 |
| Suggested Sprint 41+ themes | Within 40S-4 (optional section) |

### Completion criteria

- [ ] Priorities ranked with evidence links to gap IDs
- [ ] No implementation committed in Sprint 40
- [ ] Self-study vs workshop priorities distinguished where needed
- [ ] Intervention classes assigned (not implementation plans)
- [ ] Priorities observation published

---

## Package dependency graph

```text
Package 1 (North Star) ────────────────┐
                                        ├──► Package 3 (Gap analysis) ──► Package 4 (Priorities) ──► Sprint 40 closure
Package 2 (Benchmarks) ────────────────┘
```

**Recommended order:** Read 38S/39 closure → Package 1 ∥ Package 2 → Package 3 → Package 4 → closure note

**Harness check:** Run `ev-38s-production-pipeline-chase.mjs` at sprint start and end — expect no code changes; confirms accidental drift absent.

---

*End of Sprint 40 work packages.*
