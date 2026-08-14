# Post–Sprint 77 — Lagrangian QA baseline (Friday close)

**Recorded:** 2026-08-14  
**Mode:** DOCUMENTATION / STATE ONLY — no implementation  
**Sprint 77:** remains **CLOSED** — do not reopen  
**Next sprint:** **not selected**

This is the close-of-day QA baseline after a completed fresh Lagrangian pipeline (valid EP → DLA → GAM → assemble → Preview/package). It does **not** treat the architecture as failed.

Related: [POST-S77-dla-material-type-presentation-vocabulary.md](POST-S77-dla-material-type-presentation-vocabulary.md) · [S77-T-027-sprint-77-closeout.md](S77-T-027-sprint-77-closeout.md) · [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md)

---

## QA scores (PRISM Resource Quality Benchmark v2.2)

| Measure | Result |
| ------- | ------ |
| Uncapped weighted score | **70/100 — Competent** |
| Release score | **69/100 — Adequate** |
| Confidence | **High** |
| Inspection coverage | **Complete package** |
| Recommendation | **Revision recommended** |
| QA Feedback & Self-Regulation | **30** |

---

## Production defects (do not diagnose here)

**Major 1 — Activity 1 workspace unusable as instructed.** Learners are told to enter responses into a comparison table, but the table is already populated and non-editable. Learner production/workspace is therefore unusable as instructed.

**Major 2 — Activity 3 independent practice spoiled.** A complete worked solution to the **identical** optimisation problem is provided immediately before learners are asked to solve it. Intended independent problem solving is removed.

**Moderate — Activity 3 solution workspace.** Renders as multiple free-text fields containing Markdown-like table scaffolding rather than an appropriate structured mathematical workspace.

---

## Systemic instructional finding

All four activities lack a substantive **Check / revision** stage.

The resource provides Orient / Learn / Do reasonably well but lacks criterion-based guided review, diagnostic feedback, model comparison, or another explicit mechanism through which learners can evaluate and improve their responses.

---

## Strengths (preserve)

QA found strengths in:

- coherent conceptual progression;
- constructive alignment;
- disciplinary quality;
- accessibility / inclusive design;
- visual synthesis;
- economic interpretation of shadow prices.

Do not treat the whole architecture as failed.

---

## Monday queue — three candidate diagnostic tracks (not diagnosed)

Do **not** assume the repair belongs to GAM, DLA, assembler, or renderer before diagnosis.

### 1. Do / workspace fulfilment

**Question:** Why can a commissioned learner-production workspace become completed non-editable content?

**Exhibit:** Activity 1 (fresh Lagrangian QA package).

### 2. Worked-example → practice independence

**Question:** Why can modelling use the identical problem subsequently commissioned for independent learner practice?

**Exhibit:** Activity 3 (fresh Lagrangian QA package).

### 3. Check / revision architecture

**Question:** Why does the generated page systematically provide Orient/Learn/Do but no substantive learner checking/revision mechanism?

Treat as the potentially **architectural** finding.

---

## Retained deferred / open items

- **E2** intermittent generation corruption — wait-state / T-026 recurrence protocol (latest exhibit: [S77-T-026-e2-recurrence-2026-08-14-post-t027-gam.md](S77-T-026-e2-recurrence-2026-08-14-post-t027-gam.md)).
- **EP→DLA A5 topology-loss** — retain as unresolved observation from the earlier clean run if still open (do not diagnose Friday). T-017 withdrew an invalid A5/T-033 conclusion; topology-loss vs generation-set remains a Monday/later check, not a live repair.
- Other previously deferred Sprint 76/77 backlog items (T-032 residual, PB-FA-010, Continue-to-Authoring UX, PB-FA-005 Settings, Phase D cleanup, RECOVER, evidence-injection rollback). Remaining graphics work (PB-FA-004, generation availability) stays separate from closed queue G.

---

## Today’s completed maintenance (do not reopen)

| Item | Status |
| ---- | ------ |
| DLA canonical architecture | Completed / gated (Gate D PASS; live `77-DLA-CANONICAL-3` after presentation-vocabulary repair) |
| E1 | **CLOSED** (T-023/T-024) |
| GAM Case 1 | **CLOSED** |
| GAM D | No independent live defect proven |
| E2 | Remains intermittent / **OPEN** |
| Ordinary GAM material body-format | Completed (post–Sprint-77 bounded repair) |
| Graphics Clear Run Data lifecycle | Completed (queue G) |
| DLA `material_type` presentation vocabulary | Completed (`77-DLA-CANONICAL-3`) |
| Final assembly / render / package | **Achieved** (this QA baseline is against that package) |

---

## Operator Monday start

1. Do **not** reopen Sprint 77 or open Sprint 78 unless the operator selects a sprint.
2. Do **not** implement workspace/Check repairs from this record.
3. Pull one Monday diagnostic track at a time, starting only when authorised.
4. Fresh Lagrangian QA package is the exhibit set for tracks 1–3.
