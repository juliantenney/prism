# Sprint 99 — Closure Record

**Sprint:** 99 — Expository Instructional Quality and Academic Plain English  
**Opened:** 2026-11-16  
**Closed:** 2026-11-16  
**Status:** **CLOSED — ACCEPTED WITH QUALIFICATIONS**  
**Type:** Bounded, evidence-led Expository instructional quality (investigation, targeted contract/guidance fixes, generation validation)  
**Opening:** [S99-D01](decisions.md#s99-d01--open-sprint-99--expository-instructional-quality-and-academic-plain-english)  
**Final close:** [S99-D05](decisions.md#s99-d05--close-sprint-99--accepted-with-qualifications)  
**Predecessor:** [Sprint 98 — CLOSED — ACCEPTED WITH QUALIFICATIONS](../2026-11-16-sprint-98-interactive-instructional-coherence-and-academic-plain-english/SPRINT-98-CLOSURE.md) — **do not reopen**  
**Successor (at close):** Sprint 100 — Assessment Pack Instructional Quality (review-first; not opened by this close)  
**Post-close programme (2026-11-16):** Assessment Pack four-case review **accepted** (Sprint 100 stub **superseded**); next activity **Interactive + Expository corpus regeneration** — [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md). Situated Task **not separately evaluated** this phase. D-015 and deferred M3-3/M3-4 **unchanged**.

## Closure statement

Sprint 99 is **closed** as **ACCEPTED WITH QUALIFICATIONS**. The programme mapped the Expository pipeline, reviewed three representative Expository resources, completed a focused M2 investigation, implemented M3-1 (structured string-list coercion) and M3-2 (Expository Academic Plain English), and reviewed a normal Expository regeneration including assembled JSON and learner-facing export (M4).

**Closing Sprint 99 does not mean** that all Expository editorial or effort-estimation issues have been eliminated. It does **not** claim:

- that original object-shaped XD invitation/hook payloads from the M1 set were recovered or re-verified live;  
- that learner effort estimates fully represent explanatory and reflective engagement;  
- that exposition/supporting-material near-duplication has been eliminated;  
- that deferred M3-3 / M3-4 were implemented;  
- that Assessment Pack or Situated Task were reviewed or changed;  
- that Interactive Learning Sequence study-flow fidelity was delivered (that residual is programme debt [D-015](../../../governance/ARCHITECTURAL-DEBT.md#d-015--interactive-learning-sequence-study-flow-fidelity), not a Sprint 99 Expository defect);  
- that uncommitted trees were committed or pushed.

Do not reopen Sprint 98 for Interactive polish or the study-flow engine residual.

---

## Accepted outcomes

| Outcome | Basis |
| ------- | ----- |
| Expository pipeline mapped (EJP→XD→XM→DP→assembly→render) | M0 · [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md) |
| Three representative Expository resources show coherent progression, disciplinary precision and meaningful understanding development | M1 · S99-D02 (maths, philosophy, research communication) |
| Targeted investigation classified APE gap, coercion defect, effort and duplication concerns | M2 · S99-D03 · [M2-INVESTIGATION.md](M2-INVESTIGATION.md) |
| Structured string-list coercion corrected (XD invitations/hooks + EJP lists) | M3-1 · S99-D04 · focused regressions |
| Expository Academic Plain English guidance at GLC, XD and XM | M3-2 · S99-D04 |
| Normal Expository regeneration reviewed (assembled JSON + learner export) | M4 · author evaluation |
| Focused/related tests green; broader failures are known baselines | [VALIDATION.md](VALIDATION.md) — 44/0 focused; 79/4 broader |

---

## Qualifications and remaining debt

1. **Original object-shaped XD payloads unavailable** — live extraction of those exact M1 shapes remains unverified; M3-1 is accepted on contract behaviour + focused tests + M4 generation review.  
2. **Learner effort estimates** may underrepresent explanatory and reflective engagement (deferred M3-4; monitoring).  
3. **Some exposition ↔ supporting-material duplication** remains acceptable but worth monitoring (deferred M3-3).  
4. **M3-3 and M3-4** are **deferred — not implemented**.  
5. **Interactive LS study-flow fidelity** remains programme residual [D-015](../../../governance/ARCHITECTURAL-DEBT.md#d-015--interactive-learning-sequence-study-flow-fidelity) (S98 M5 Option C; S98-AD-004; Sprint 99 carry **S99-AD-012**). **S99-AD-008** remains deferred XD/XM duplication monitoring (M3-3), not the study-flow item. **Do not reopen Sprint 98**.  
6. Known baseline test failures (A5 compose; S98-E07 figcaption) remain distinguished from Sprint 99 regressions.

---

## Completed scope

| ID | Title | Status |
| -- | ----- | ------ |
| M0 | Pipeline investigation | **COMPLETE** — S99-D01 |
| M1 | Educational evaluation (3 resources) | **COMPLETE (provisional → accepted at close)** — S99-D02 |
| M2 | Focused investigation | **COMPLETE** — S99-D03 |
| M3-1 | String-list coercion fix | **IMPLEMENTED** — S99-D04 |
| M3-2 | Expository Academic Plain English | **IMPLEMENTED** — S99-D04 |
| M3-3 | Complementarity reinforcement | **DEFERRED — not implemented** |
| M3-4 | Extent / effort clarification | **DEFERRED — not implemented** |
| M4 | Normal regeneration review | **COMPLETE** — author evaluation at close |
| Close | Qualified close | **COMPLETE** — S99-D05 |

---

## Verification summary

| Suite | Result | Notes |
| ----- | ------ | ----- |
| M3 focused + related | **44 pass / 0 fail** | Coercion + Expository APE + Interactive APE + Expository contracts/siblings + typography |
| Broader subset | **79 pass / 4 fail** | Fails = known A5 compose ×3 + S98-E07 figcaption — not Sprint 99 regressions |

---

## Carry-forward

See [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md). Deferred **M3-3 / M3-4** and qualifications above remain as recorded at close.

**Post-close programme transition (2026-11-16):** the four-case Assessment Pack quality review was **accepted without substantive implementation**; the planned Sprint 100 stub is **superseded** ([sprint-100-assessment-pack-instructional-quality.md](../../../sprints/sprint-100-assessment-pack-instructional-quality.md)). Situated Task was **not separately evaluated** in this phase and must not be described as independently validated or passed. Next programme activity is **Interactive and Expository corpus regeneration** ([NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md)) — use existing inventory/evidence mechanisms; do not create duplicate corpus governance. Programme [D-015](../../../governance/ARCHITECTURAL-DEBT.md#d-015--interactive-learning-sequence-study-flow-fidelity) remains the authoritative Interactive LS fidelity record.
