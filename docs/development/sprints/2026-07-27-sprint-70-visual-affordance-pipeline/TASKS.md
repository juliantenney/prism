# Sprint 70 Task Breakdown

## T1 Visual job model
- [ ] define job schema (affordance_id, activity_id, filename, prompt, caption, alt, visual_status)
- [ ] filter `visual_decision: generate` + activity gate
- [ ] exclude defer/reject from jobs
- [ ] unit tests: job count, field presence, gate behaviour

## T2 Deterministic prompt builder
- [ ] extract/consolidate prompt composition from VEU v1.2.1 field rules
- [ ] implement `build-visual-prompt.js`
- [ ] unit tests: golden affordance → golden prompt (deterministic)
- [ ] unit tests: `requires_exact_data_match` prompt clause

## T3 Filename assignment
- [ ] decide convention (see DECISIONS D70-02 TBD)
- [ ] implement `assign-filename.js`
- [ ] unit tests: sanitisation, uniqueness

## T4 Asset storage
- [ ] decide storage backend (see DECISIONS D70-03 TBD)
- [ ] implement upload store with validation (PNG/WebP policy TBD)
- [ ] wire replace + remove semantics
- [ ] unit tests: store/retrieve/delete lifecycle

## T5 UI — Visual pipeline panel
- [ ] job list for current page/workflow
- [ ] copy prompt action
- [ ] upload / replace / remove actions
- [ ] visual_status indicators
- [ ] manual smoke test checklist

## T6 Package assembler
- [ ] hook → figure insertion at matched affordance_id + visual_slot
- [ ] `<img src="media/{filename}">` paths
- [ ] figcaption from caption_intent; alt text generation
- [ ] copy uploaded binaries to `media/`
- [ ] unit tests on fixture HTML

## T7 Visual manifest
- [ ] implement `build-visual-manifest.js`
- [ ] include jobs, defer/reject ledgers, export metadata
- [ ] unit tests: manifest shape

## T8 Export
- [ ] export action (folder or zip — see DECISIONS)
- [ ] validate completeness policy (all jobs uploaded vs partial)
- [ ] end-to-end test: affordances → jobs → upload → export → local open

## T9 Regression
- [ ] `node --test tests/visual-affordance-pipeline*.test.js`
- [ ] learner-renderer-vNext certification unchanged
- [ ] Sprint 38 affordance validation tests unchanged

## T10 Documentation
- [ ] update STATUS.md per phase
- [ ] resolve open DECISIONS items
- [ ] sprint closeout prep (post-implementation)

---

## Suggested commits

1. `feat(visual-pipeline): add visual job model and affordance filter`
2. `feat(visual-pipeline): deterministic prompt builder from Sprint 38 fields`
3. `feat(visual-pipeline): filename assignment convention`
4. `feat(visual-pipeline): asset storage adapter for uploaded images`
5. `feat(ui): visual pipeline panel — copy prompt and upload actions`
6. `feat(visual-pipeline): assemble figures and media folder`
7. `feat(visual-pipeline): visual manifest builder`
8. `feat(visual-pipeline): export HTML package download`
9. `test(visual-pipeline): golden prompt and assembly fixtures`
10. `docs(sprint-70): update STATUS and DECISIONS at phase checkpoints`

Keep commits phase-aligned; do not combine UI and assembler in one commit unless tightly coupled.

---

## Implementation order

1. T1 → T2 → T3 (lib foundation, testable without UI)
2. T4 (storage — unblocks UI)
3. T5 (UI)
4. T6 → T7 → T8 (assembly + export)
5. T9 → T10 (regression + docs)
