# S81-T-005 — Sprint 81 recommendation and decision gate

**Sprint:** 81 — Learner Workspace Investigation & Surface Architecture  
**Status:** **COMPLETE — ACCEPTED** (operator 2026-08-28)  
**Decision:** [S81-D02](decisions.md#s81-d02--b-targeted-enhancement-narrowed) — **ACCEPTED** (narrowed operator scope)  
**Follow-on:** [S81-T-006](S81-T-006-revision-co-access-design-validation-r3-vs-r4.md) · [S81-T-007](S81-T-007-implement-r1-task-check-navigation.md) — **READY** (not executed)

---

## 1. Recommendation (one outcome)

# **B — TARGETED ENHANCEMENT**

**Bounded meaning of B (this sprint):** keep the current default learner representations; authorise a **small** programme of **contextual / revision-phase progressive enhancements** and **commissioning discipline** around existing surfaces — **not** a specialised-widget programme, **not** a surface-family architecture, **not** an overhaul.

Charter wording for B mentions “few specialised surfaces.” Accepted evidence does **not** justify new LA-level specialised widgets. This recommendation **narrows** B to: *targeted enhancement of the existing accessible text / table / self-review architecture*.

**Why B beats A, C, and D:** see §6–§9. Short version: N1/N4 is real, recurring on production-shaped pages, and addressable at low architectural risk; A knowingly leaves that friction unaddressed without a reopen trigger being forced; C and D lack premises in the evidence.

---

## 2. Binding findings (preserved)

1. No useful 1:1 activity-type → widget model (T-001).  
2. Six useful learner actions: study, compose, table, self-review, order, select (T-002).  
3. Basic current representations are pedagogically appropriate (T-003).  
4. No **MATERIAL CURRENT CONSTRAINT** on text/table/self-review (T-003).  
5. Study, select, typical order, typical compose: NONE/MINOR headroom (T-003).  
6. Strongest need: **N1/N4** co-access during revision (T-003/T-004).  
7. **N2** scale-dependent; partly upstream commissioning (T-003/T-004).  
8. **N3** modest; no new compose family (T-004).  
9. `diagnostic_review` = commission/structural only — not free-text/table assessment (T-001/T-002).  
10. Native-control a11y strengths are assets (T-003).  
11. Evidence favours enhancement-around-existing-surfaces over many new LA surfaces (T-004).

---

## 3. Outcome A — DO NOTHING (genuine case)

**What A means:** leave the working-alpha learner experience unchanged; accept current interaction costs.

| Facet | Case for A |
| ----- | ---------- |
| Friction knowingly accepted | Scroll-away / scroll-back between substantial production and self-review criteria (N1/N4); occasional high table-cell entry cost (N2); mild multi-field scanning (N3) |
| Why tolerable at working alpha | No material constraint; pages remain educationally coherent and completable; feedback model is honest; first-class journeys already WORK (Sprint 80) |
| Complexity avoided | No new PE state, disclosure copy risk, sticky/focus-order work, commissioning-policy churn, regression surface |
| Product coherence | Explore / Task / Check remains clear; native controls unchanged |
| Reopen later if… | Repeated learner/support evidence of revision failure; accessibility defects tied to linear Check; commissioning systematically emits unusable mega-tables; product priority elevates revision UX |

**A is not failure.** It would be a successful Sprint 81 conclusion: investigation proved the architecture is sound enough to leave alone.

**Why not recommended as the primary outcome:** the strongest need (N1/N4) is **structural** in moment composition (Do then Check), evidenced on authoritative certification fixtures, and mitigable **without** changing the evidence or feedback model. Leaving it unaddressed indefinitely forgoes low-risk pedagogical usability gains the investigation was opened to judge. A remains the correct choice if the operator prioritises **zero** near-term learner-workspace product work.

---

## 4. Outcome B — TARGETED ENHANCEMENT (recommended)

### 4.1 What “targeted” means here

| In | Out |
| -- | --- |
| Progressive enhancement around existing compose / table / self-review | New LA-level surface families |
| Optional commissioning guidance for table scale | Replacing tables as the thinking frame |
| Preserve native controls, moments, honest drafts, learner-led diagnosis | Runtime free-text/table scoring; dual-pane default; matching/canvas programmes |

Baseline remains **R0 / T0 / C0** (retain current). Enhancements degrade to the linear document.

### 4.2 Shortlist disposition (MUST / SHOULD / COULD / PARK)

| Priority | Item | Need | Disposition |
| -------- | ---- | ---- | ----------- |
| **MUST** (if B accepted) | **R1** landmarks / jump links between Task production and Check criteria | N1 | Carry forward — lowest cost, highest safety |
| **SHOULD** | **R3 and/or R4** contextual co-access PE (production near criterion and/or criterion near production), honesty-labelled | N1/N4 | Carry forward one primary pattern after lightweight design validation — not both as parallel products |
| **COULD** | **T1** commissioning discipline (fewer gratuitous blanks / narrower grids) | N2 | Authoring/policy; not a renderer “surface” |
| **COULD** | **T2** in-table orientation PE (only where large grids remain) | N2 | After T1; keep `<table>` + textareas |
| **COULD** | **C1** modest multi-field grouping / numbering | N3 | Presentational only |
| **PARK** | R5 default dual-pane; R6/R7 unless R1+R3/R4 insufficient; T5 table replacement; C3 new compose family; matching/canvas/new select families | — | No evidence mandate (T-004) |

It is intentional that B carries **only a subset** of the T-004 shortlist.

### 4.3 Value vs complexity (B, bounded as above)

| Dimension | Assessment |
| --------- | ---------- |
| Learner benefit | Faster relocate + optional co-view during revision; reduced scroll thrash on long activities |
| Learning-design benefit | Strengthens intended Check/revise loop without changing pedagogy of production |
| Accessibility | Must preserve native controls; R1 strengthens landmarks; R3/R4 need careful disclosure/focus; mandatory linear fallback |
| Architecture | No new LA surface taxonomy; client presentation state only |
| Evidence schema | **No change** required |
| Renderer | Local PE / landmarks; no diagnostic engine |
| Authoring/commissioning | T1 optional guidance only |
| New UI state | Jump targets; optional disclosure / active-criterion presentation state |
| Maintenance | Low–medium if scoped to R1 + one co-access pattern |
| Regression risk | Low for R1; medium for R3/R4 (copy/honesty, focus) — mitigated by fallback-to-R0 |
| Static export / no-JS | R1 links work; disclosures closed → linear document |

---

## 5. Outcome C — SURFACE-FAMILY ARCHITECTURE — **REJECT**

| Question | Evidence disposition |
| -------- | -------------------- |
| Need for systematic new surface-family architecture? | **No** |
| Six actions | Already served by existing surfaces + moments |
| Multiplicity | Representation varies by **phase/scale**, not by inventing families per material type |
| Dominant option class | Enhancement around existing surfaces (T-004) |
| Many new LA-level widgets | Outside N1–N4; unsupported |

**Rejected because premises fail**, not because C would be more work. A surface-family programme would overfit the problem and risk the native-control strengths T-003 protects.

---

## 6. Outcome D — SUBSTANTIAL OVERHAUL — **REJECT**

| Claim | Evidence |
| ----- | -------- |
| Current architecture materially constrains learning design or alpha accessibility? | **Unsupported** |
| Material current constraint? | Explicitly **not** found (T-003) |
| Working alpha usable? | Yes (Sprint 80 boundary + T-003) |

**D rejected clearly.** Overhaul would be disproportionate and evidence-contrary.

---

## 7. Why B over A (decision rationale)

| | Prefer B | Prefer A |
| - | -------- | -------- |
| N1/N4 | Structural, fixture-evidenced, low-risk mitigations exist | Accept permanent scroll friction |
| Complexity | Bounded MUST/SHOULD keeps burden small | Absolute minimum |
| Alpha posture | Improves revision usability without claiming new product class | Freeze workspace UX |
| Risk | Manageable if honesty + fallback enforced | None |

**Recommendation holds B** because Sprint 81’s job was to decide whether *any* change is justified; the evidence supports a **narrow yes** (revision co-access), not a freeze. Operators who want zero product motion should **accept A instead** — that remains a valid alternate decision on the same record.

---

## 8. Sprint-level answers (charter investigation)

| # | Question | Answer | Trace |
| - | -------- | ------ | ----- |
| 1 | What learner activity does PRISM produce? | Multi-layer production (archetype × beat × material × response_kind × surface); not one activity enum | T-001 |
| 2 | How many fundamentally different learner-action/surface needs? | **Six** actions; only **two** with evidence-consuming feedback (order, select); unmet UX needs are mainly **revision co-access** and **table scale** | T-002, T-003 |
| 3 | Activity → surface 1:1? | **No** | T-001, T-002 |
| 4 | Alternative representations legitimate? | **Yes**, mainly as **phase/scale enhancements** or commissioning choices — not many new LA widgets | T-004 |
| 5 | Need surface-family architecture? | **No** (reject C) | T-004, §5 |
| 6 | Role of text-based approach? | **Default production affordance** for compose; retain; enhance around it | T-003, T-004 |
| 7 | Preserve about feedback/self-review? | Learner diagnoses; authored criteria; no false Prism free-text/table assessment; `diagnostic_review` stays commission-only | T-002 |
| 8 | A11y constraints? | Native controls, keyboard, landmarks/live regions, table semantics, linearisable fallback, reflow | T-003, T-004 |
| 9 | What should PRISM do next? | Operator accepts **B** (or chooses **A**); if B, authorise bounded implementation/validation tasks below — **not** auto-implement | §9–§10 |

---

## 9. If B is accepted — next tasks (not executed)

Proposed follow-ons (separate authorisation; still may be design-validation before code):

1. **S81-T-006 (or next-sprint T-001)** — Design validation / acceptance criteria for **R1** + one of **R3|R4** (honesty copy, focus order, mobile stack, no-JS fallback).  
2. **Implementation task(s)** — R1 first; then chosen co-access PE; optional T1 commissioning note; optional C1/T2 later.  
3. **Explicit non-goals** for that programme: R5 default, T5, C3, matching/canvas, free-text diagnostic engine, GAM redesign, D-014 reopen, WCAG remediation programme.

### Success proofs (implementation must show)

- Revision co-access improves without changing learner evidence kinds or feedback model.  
- Native accessible controls remain authoritative.  
- Enhancement degrades safely to the linear document.  
- Mobile/reflow remains viable.  
- No implication that PRISM assessed free-text/table quality.  
- Any table work preserves semantic table behaviour.  
- First-class gate `npm run test:first-class` remains protected.

**T-005 does not implement these.**

---

## 10. If operator chooses A instead

Record A as the Sprint 81 decision. Reopen learner-workspace product work only if triggers in §3 fire (or a later programme explicitly prioritises revision UX). No R*/T*/C* implementation authorised.

---

## 11. Sprint 81 status recommendation

| Item | Recommendation |
| ---- | -------------- |
| T-005 | Complete — await operator accept/reject of **B** |
| Sprint 81 | **Ready for operator decision / closeout** — investigation programme finished |
| Auto-close? | **No** — operator decides accept recommendation, choose A instead, and whether to close Sprint 81 or open implementation under a new decision |

Investigation deliverables for the charter are satisfied. Remaining work is **operator decision**, then optionally a **new authorised implementation slice** (same sprint or next).

---

## 12. Out of scope (confirmed not done)

Production code; implementation of R*/T*/C*; selecting specialised surface widgets; closing Sprint 81 unilaterally; inventing free-text/table diagnosis.
