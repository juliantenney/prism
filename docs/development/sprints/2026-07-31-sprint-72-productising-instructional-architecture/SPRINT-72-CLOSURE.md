# Sprint 72 — Closure Record

**Sprint:** 72 — Productising the Instructional Architecture Validated in Sprint 71  
**Opened:** 2026-07-31  
**Closed:** 2026-08-05  
**Status:** **COMPLETE / CLOSED**  
**Predecessor:** [Sprint 71 closure](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/SPRINT-71-CLOSURE.md) — evidence frozen; not reopened  
**Successor:** Sprint 73 **not opened** — select from [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md) via [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md)  
**Final report:** [SPRINT-72-FINAL-REPORT.md](SPRINT-72-FINAL-REPORT.md)  
**Top-level closeout:** [docs/sprints/sprint-72-closeout.md](../../../sprints/sprint-72-closeout.md)  
**Product backlog:** [docs/backlog/PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md)

---

## Closure authority

Sprint 72 is closed by operator decision on 2026-08-05 after delivery of the primary productisation objective and backlog cut-line (`S72-T-077`). Large unfinished streams are migrated to the canonical product backlog — Sprint 72 is **not** incomplete because those streams remain.

Dedicated final cross-disciplinary verification was **not** required for closure. Ongoing real content generation provides continuous verification; regressions observed later stop at the owning layer with focused regression coverage (`S72-D14`).

---

## Original objective

Embed validated Sprint 71 instructional principles into Prism so high-quality instructional design is produced by default; authors are asked only for genuinely needed information; and discipline-specific evidence can be supplied where Prism must not invent it — without collapsing into generic prompt improvement.

Governing principle delivered: **“Make activities use evidence for reasoning.”**

---

## Outcome summary

- Activity-level evidence decisions and provider/scaffold separation (separate + combined workspace patterns).  
- Simulated evidence with honest provenance; source-bound `conversation_attachment` path with inventory, attribution, and source-native diagnostics.  
- Delayed-answer-disclosure protection; diagnostic guided review.  
- Intellectual-coherence bridges on every activity; learner-page presentation refinements (divider, tables, Check→Transfer, preambles, template prompts).  
- Activity 1 Do/workspace and public-export-path / browser-bundle parity corrections.  
- Copilot unnecessary-follow-up suppression; DLA optional-evidence user guidance.  
- Indicative benchmarks: RNA ~93; Heteroscedasticity ~92; Owen source-bound ~92.  
- Unfinished large work → product backlog (not Sprint 72 incompleteness).

---

## Completion criteria checklist

| Criterion | Status |
| --------- | ------ |
| Layer-1 principle productised (`S72-T-013` / `T-014`) | **Met** |
| Evidence-Centred Learning umbrella represented | **Met** |
| Three-layer routing respected | **Met** |
| Dedicated final cross-disciplinary sweep | **Closed via continuous-verification strategy** (`S72-D14`) — not falsely reported as an executed formal sweep |
| Backlog rationalisation | **Met** (`S72-T-077`) |
| Documentation / traceability / closure | **Met** |
| Sprint 73 not prematurely scoped | **Met** |

---

## Known boundaries at close

- Uploaded / attachment **byte** ingestion, persistence, and fidelity verification remain out of Sprint 72 (`S72-D10`) → product backlog **PB-FA-001**.  
- Broader evidence-centred test file: **28 known pre-existing failures** (fixture enrichment) — focused suites passed; full suite **not** claimed green.  
- Some late-slice working-tree changes (including T-075/T-076 wiring and docs) may still await **operator commit** — operational follow-up, not reopening of scope.  
- No Sprint 73 charter or feature assignment in this closure.

---

## Binding carry-forward

Retain `S72-D01`…`S72-D15` unless a later sprint revises them. Sprint 71 evidence remains linked, not rewritten.

---

## Sprint 71 disposition audit

Completed 2026-08-05: [SPRINT-71-DISPOSITION-AUDIT.md](SPRINT-71-DISPOSITION-AUDIT.md).

Every validated Sprint 71 finding and Final Report recommendation for Sprint 72 has an explicit disposition (implemented in Sprint 72, deferred into the product backlog, superseded by an architectural decision, or intentionally not adopted). Four underspecified residuals (`S71-F-009`, `S71-F-011`, residual `S71-F-007`, Benchmark instrument paths) were added to [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md) during the audit. **No dispositions remain missing.** Sprint 73 was not opened by this audit.
