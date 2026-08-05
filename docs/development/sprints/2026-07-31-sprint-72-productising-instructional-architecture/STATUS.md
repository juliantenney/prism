# Sprint 72 — Status

**Sprint status:** **OPEN / IN PROGRESS**  
**Opened:** 2026-07-31  
**Phase 0:** **COMPLETE**  
**Implementation:** **Substantially progressed**  
**Next task:** Re-render and inspect Owen after bridge + presentation updates; then commit verified Sprint 72 slice  
**Predecessor:** Sprint 71 — COMPLETE / Closed  

---

## Dashboard

| Area | Status |
| ---- | ------ |
| Pack / documentation | **Open** — handover updated to reflect implemented slices and boundaries |
| Phase 0 setup / traceability | **COMPLETE** |
| Traceability (S71 → S72) | **Complete for open** — [findings-traceability.md](findings-traceability.md); `S71-F-001` dual-routed |
| Success criteria | **Accepted** (`S72-D07`) |
| Phase 1 Platform principles | **In progress** — evidence-centred DLA/GAM contracts implemented; simulated + source-bound evidence paths implemented; bridge semantics correction implemented (currently uncommitted) |
| Phase 2 Diagnostic feedback | **Partial** — guided-review slice implemented and validated; delayed-disclosure diagnostics and non-reveal constraints implemented |
| Phase 3 Elicitation | **Partial** — source-bound attachment usage guidance and diagnostics implemented (Copilot-conversation boundary preserved) |
| Phase 4 Evidence architecture | **Partial** — selective activity-level evidence architecture implemented (no new pipeline stage/page type); uploaded-byte ingestion/storage still unresolved by design (`S72-D10`) |
| Phase 5 Product / UX | **Partial** — orientation boundary, table layout fixes, Check→Transfer sequencing, and template prompt refinements implemented (currently uncommitted) |
| Phase 6 Raise the ceiling | **Partial evidence** — indicative benchmark outcomes captured from completed experiments |
| Phase 7 Regression / synthesis | **In progress** — focused suites passing for implemented slices; final Owen rerender + synthesis pending |
| Closure / final report | **Not opened** |

---

## Priority order (binding — unchanged)

1. Platform / system  
2. Workflow elicitation  
3. Author-supplied evidence  
4. Product / UX  
5. Raise the ceiling  

System-side routing remains the default (`S72-D01` / `S72-D08`).

---

## Active blockers / decisions needed

| Item | Owner | Notes |
| ---- | ----- | ----- |
| Owen rerender + inspection after latest fixes | Implementer | Immediate verification step before sprint-slice commit; commit remains blocked until rerender inspection passes |
| Source-bound uploaded evidence bytes | Architect / implementer | Still out of implemented scope by design (`S72-D10`) |
| Capacity cut-line for deferred hardening | Operator mid-sprint | Schema-currency audit, render-closure validation, image persistence, learner-code handling |

~~Approve proposed success criteria~~ — **cleared** (`S72-D07` Accepted).  
~~First Layer-1 principle slice choice~~ — **cleared for shipped slices** (navigation/heading; guided-review; evidence-centred activity).

---

## Counters

| Metric | Value |
| ------ | ----- |
| Layer-1 principles implemented & validated | Evidence-centred activity architecture implemented; DLA/GAM contracts and closure checks implemented; simulated provenance + source-bound diagnostics implemented |
| Diagnostic-feedback validation runs | Guided-review slice validated; delayed-disclosure and no-premature-reveal constraints implemented |
| Elicitation progress | Attachment-aware source-bound guidance and diagnostics implemented; no new standalone elicitation UI |
| Evidence architecture | Activity-level evidence decisions, provider/response separation, separate-provider + combined layouts, provider-ID closure, selective evidence usage; no uploaded-byte ingestion/storage (`S72-D10`) |
| Indicative benchmark evidence | RNA evidence-centred run approx **93/100**; heteroscedasticity approx **92/100**; source-bound Owen approx **92/100** after full package inspection |
| Bridge correction suite | Reported **73/73 passing** (implemented work currently uncommitted in this branch state) |
| Presentation refinement suite | **118/118 passing** in current branch run |

---

## Recent activity

| Date | Note |
| ---- | ---- |
| 2026-07-31 | Opening pack created |
| 2026-07-31 | Pre-implementation amendment: F-001 dual-route; T-013 committed; Evidence-Centred Learning umbrella; shared persistence; `S72-D07` Accepted; Phase 0 complete |
| 2026-08-04 | Implementation in progress: navigation/heading package complete; diagnostic guided-review slice implemented and validated; activity-level evidence-centred learning slice implemented (DLA/GAM evidence decisions + provider contracts); cross-disciplinary validation RNA/HCV 93, Heteroscedasticity 92; `S72-D10` boundary narrowed to stable attachment ingestion/persistence and byte-level fidelity verification |
| 2026-08-05 | Additional uncommitted slice present in working tree: bridge semantics hardening + learner-page presentation refinements; focused presentation suites passing 118/118; immediate next step is Owen rerender/inspection and sprint-slice commit |
| 2026-08-05 | S72-T-073 rerender findings: Activity 1 missing Do text-entry workspace and orientation-to-activities divider not visible. Focused fixes applied (Do expected-output fallback now gated by authored response intent; first-activity divider selector corrected to `.util-learning-activities > .util-activity:first-child`). Focused regression suites pass; Owen rerender inspection still required before commit. |
| 2026-08-05 | Follow-up on real Owen rerender: initial A1 fallback fix validated only synthetic path and did not restore real A1 Do composition. Boundary trace on Owen A1 established loss at Do-instruction filtering: mixed `Study ... Then write ...` step was dropped because `instructionSurfaceAffinity` matched `worked example`. Corrected ownership by retaining affinity-tagged instructions when placement is explicitly Do. Integration fixture based on Owen A1 assembled shape now composes `orient > learn > do > check` with exactly one Do textarea before Check. |
| 2026-08-05 | Public-path divergence closed: normal export uses `window.PRISM_LEARNER_RENDERER_VNEXT` (browser bundle), while lower-level fixture tests used Node module path. Browser bundle was stale relative to source composer fix. Rebuilt bundle and added public export-path regression. Also corrected cross-beat Learn collection so Do-owned mixed study+write instruction is not rendered in Learn. Public-path rerender now yields A1 moments `orient,learn,do,check` with exactly one textarea. |

---

## Links

- [SPRINT-72-START-HERE.md](SPRINT-72-START-HERE.md)  
- [PLAN.md](PLAN.md)  
- [HANDOVER.md](HANDOVER.md)  
- [decisions.md](decisions.md)  
