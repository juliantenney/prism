# Sprint 38-B — Handover and forward plan

**From:** Sprint 38 completion + materials-fidelity patch  
**To:** Prompt architecture audit → consolidation design → (future) implementation phase  
**Pack:** `docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/`

---

## Entry state (2026-06-03)

| Item | State |
|------|--------|
| Sprint 38 pipeline | Validated E2E; documented in [ARCHITECTURE.md](../2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/ARCHITECTURE.md) |
| Test floor | **706 pass** (`node --test tests/*.test.js`) |
| Materials placeholder regression | **Partially mitigated** — `buildDesignPageActivityMaterialsFidelityPromptBlock()` in `app.js`; pack §13 notes; `lib/design-page-materials-fidelity.js` |
| Table fidelity regression | **Open** — comma-row / Headers-Rows prose (38B-4) |
| Sprint 39 pack | Exists at `docs/sprints/sprint-39/` — **deferred** behind 38-B |

---

## Recommended slice order

```text
38B-1 Prompt Audit
    ↓
38B-2 Instruction Taxonomy
    ↓
38B-4 Materials and Table Fidelity  ← can parallel 38B-2 after 38B-1 Design Page inventory
    ↓
38B-3 Design Page Consolidation Plan
    ↓
38B-5 Workflow-wide Review
    ↓
38B-6 Regression Validation Plan
    ↓
38B-7 Governance and Maintenance
```

**Rationale:** Audit before taxonomy; table fidelity early because it is the active production regression; Design Page consolidation plan consumes 38B-1/2/4; validation and governance close the programme.

---

## Exit criteria (planning phase complete)

- [ ] 38B-1: All priority steps have prompt source + augmentation inventory rows  
- [ ] 38B-2: Taxonomy populated; top duplication clusters named  
- [ ] 38B-3: Design Page target hierarchy and migration sketch (no implementation required in planning)  
- [ ] 38B-4: Table fidelity failure modes documented with upstream → Design Page → renderer hypotheses  
- [ ] 38B-5: Secondary steps ranked for consolidation wave 2  
- [ ] 38B-6: Anchor validation matrix signed off  
- [ ] 38B-7: Governance rules agreed  

**Forward to implementation (optional 38-B execution charter):**

- Prompt merge behind feature flag or versioned pack section  
- Prompt length / block count metrics in CI or manual probe  
- Table fidelity tests extended beyond placeholder detection  
- Inflation + CI + Climate + Marx reruns per 38B-6 checklist  

**Forward to Sprint 39:**

- Only after 38-B planning exit criteria met  
- Sprint 39 additions must slot into hierarchy layer 5–6, not append unbounded blocks  

---

## Handoff artefacts

| Audience | Start here |
|----------|------------|
| New chat | [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) |
| Charter | [SPRINT-38-B-CHARTER.md](SPRINT-38-B-CHARTER.md) |
| Active regression | [observations/38B-4-materials-and-table-fidelity.md](observations/38B-4-materials-and-table-fidelity.md) |
| Design Page case | [observations/38B-3-design-page-consolidation-plan.md](observations/38B-3-design-page-consolidation-plan.md) |

---

## Risks if 38-B is skipped

- Further prompt patches compound length and contradictions  
- Table and materials regressions recur on anchor workflows  
- Sprint 39 cue guidance amplifies Design Page compression behaviour  
- Maintenance cost of “which block wins” becomes unbounded  
