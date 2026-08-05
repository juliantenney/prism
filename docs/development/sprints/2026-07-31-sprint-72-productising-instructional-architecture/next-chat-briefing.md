# Sprint 72 — Next-chat briefing

**Use this** to start a fresh implementation or planning session.  
**Pack status:** OPEN / IN PROGRESS  
**Phase 0:** COMPLETE  
**Implementation:** Substantially progressed  
**Next task:** **`S72-T-073`** (rerender + inspect Owen)  
**Do not** reopen Sprint 71 or edit its evidence.

---

## One-line mission

Productise Sprint 71’s validated instructional architecture into Prism (platform first, then elicitation, then author evidence) without collapsing into generic prompt improvement.

## Read first

1. [SPRINT-72-START-HERE.md](SPRINT-72-START-HERE.md)  
2. [HANDOVER.md](HANDOVER.md)  
3. [CONTEXT.md](CONTEXT.md)  
4. [findings-traceability.md](findings-traceability.md) — note `S71-F-001` dual routing  
5. [PLAN.md](PLAN.md) · [decisions.md](decisions.md)

## Binding decisions already made

- `S72-D01` three-layer routing  
- `S72-D02` priority order P1→P5 (unchanged)  
- `S72-D03` no generic prompt-improvement collapse  
- `S72-D04` Evidence-Centred Learning first-class umbrella  
- `S72-D05` Benchmark + Validation, not score alone  
- `S72-D06` elicitation redesign authorised in Sprint 72  
- `S72-D07` success criteria **Accepted**  
- `S72-D08` `S71-F-001` dual-routed A → B → C  
- `S72-D09` shared workflow asset-persistence model (T-042 + T-051)
- `S72-D10` evidence-centred slice supports simulated + conversation-attachment source-bound evidence; deferred boundary is stable attachment ingestion/persistence + byte-level fidelity verification
- `S72-D11` no new pipeline stage/page type/complex evidence spine required for this slice
- `S72-D12` evidence use is selective and bounded by pedagogy/time/prerequisites
- `S72-D13` distinguish implemented-but-uncommitted work from committed baseline state

## Immediate execution sequence

1. **`S72-T-073`** — Re-render Owen after bridge + presentation refinements; inspect learner-facing output  
2. Run focused QA/benchmark checks if needed  
3. **`S72-T-074`** — Commit verified Sprint 72 slice  
4. Continue deferred hardening backlog only after demo-day verification

## Current implemented state snapshot

- Evidence-centred activity architecture implemented (activity-level evidence decisions; provider/response separation; selective evidence use).
- Simulated evidence route implemented (`system_generated_simulation`).
- Source-bound conversation-attachment route implemented (`conversation_attachment`) with source-unit inventory and attributed source-native evidence rendering.
- Bridge correction and learner-page presentation refinements implemented but currently uncommitted in working tree.

## Hard rules

- Link Sprint 71 authorities; do not duplicate evidence  
- Prefer Layer 1 when solvable system-side  
- `S71-F-001`: platform evidence-completable first; then elicit; then author supply  
- Distinguish Design Page / assembly / renderer  
- Mark work committed / stretch / discovery / deferred  
- No Sprint 72 closure pack until work warrants it  

## Predecessor gold links

- [SPRINT-71-FINAL-REPORT.md](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/SPRINT-71-FINAL-REPORT.md)  
- [design-principles.md](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/design-principles.md)  
- [improvement-register.md](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/improvement-register.md)  
