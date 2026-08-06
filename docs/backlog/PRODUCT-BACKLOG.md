# PRISM Product Backlog

**Canonical location:** `docs/backlog/PRODUCT-BACKLOG.md`  
**Status:** Active — maturation / v1.0 stabilisation phase  
**Last updated:** 2026-08-06 (Sprint 74 opened — architecture consolidation discovery; Sprint 73 closed)  
**Source migrations:** Sprint 72 cut-line (`S72-T-077`); Sprint 71 disposition audit; Sprint 73 closeout; Sprint 74 open; historical notes in `ideas.md`, `known-issues.md`, `future-directions.md` (see [README.md](README.md))

---

## Planning principle (binding)

> A backlog item should only enter a sprint when it has a concrete implementation approach, clear ownership and acceptance criteria. Ideas and possible future enhancements remain in the product backlog until they are ready for planning.

**How the next sprint is selected:** Pull a sufficiently mature item from **Stabilisation** or **Future architecture** below. Do **not** pre-assign a sprint number to a feature until a sprint pack is opened with approach and acceptance criteria.

---

## 1. Stabilisation

Concrete defects, friction, polish and robustness. Suitable to pull into a sprint once understood.

| ID | Observation | Impact | Possible direction | Readiness |
| -- | ----------- | ------ | ------------------ | --------- |
| PB-S-001 | Broader `sprint-72-evidence-centred-activity-slice.test.js` has **28 known pre-existing failures** tied to `intellectual_coherence_bridge` fixture enrichment | Focused suites pass; full suite not green — risk of false confidence | Enrich fixtures or align validators; keep focused suites authoritative until resolved | **Investigation needed** — not sprint-ready |
| PB-S-002 | Residual nav / long-title / heading a11y polish beyond Sprint 72 bounded T-056 fixes | Occasional overflow / hierarchy friction on long titles | Targeted CSS / nav acceptance criteria | **Partial** — needs clear acceptance criteria |
| PB-S-003 | Historical UX/runtime friction notes (inspectability, `app.js` state complexity, domain-pack overlap) | Ongoing author friction and maintenance cost | See legacy [known-issues.md](known-issues.md); promote only when scoped | **Low readiness** — needs scoping |
| PB-S-004 | Duplicate / legacy UI–state pathways | Clarity and regression risk | Incremental rationalisation with fixtures | **Low readiness** |

---

## 2. Future architecture

Coherent capabilities large enough to become a sprint. **No sprint numbers assigned.** Do not create detailed sprint plans here.

### PB-FA-001 — Workflow Resources

**Product-facing capability:** First-class **Workflow Resources** — durable learner-facing and workflow-bound assets that authors and learners can rely on across refresh, navigation, export, and regeneration.

**Sprint 73 outcome (COMPLETE / Closed 2026-08-06):** Established the workflow-scoped Workflow Resources owner; IndexedDB-backed generated-image persistence with same-browser/profile rehydration; downloadable Additional Resources; one provider-supplied embedded video with page-owned presentation; authoring tabs and Orient-supporting learner presentation. See [SPRINT-73-FINAL-REPORT.md](../development/sprints/2026-08-06-sprint-73-workflow-resources/SPRINT-73-FINAL-REPORT.md) · [SPRINT-73-CLOSURE.md](../development/sprints/2026-08-06-sprint-73-workflow-resources/SPRINT-73-CLOSURE.md).

**Remaining under this theme (not Sprint 73):** Conversation-attachment byte persistence (`S72-D10` / PB-R-001); orphan/mixed-data cleanup; cross-device/server sync; package re-import; central resource library. **Manually uploaded graphics** (non–visual-job images) are tracked separately as [PB-FA-004](#pb-fa-004--manually-uploaded-graphics).

**Evidence basis:** `S72-D09`, `S72-D10`; Sprint 73 decisions `S73-D01`…`S73-D03` and implementation/verification notes in the Sprint 73 pack.

**Readiness:** Sprint 73 **COMPLETE / Closed** (2026-08-06). Residual follow-ons are separate backlog items — do not continue work under Sprint 73.

**Former Sprint 72 links (retired from S72):** T-040 remaining, T-041, T-042, T-044, T-051, B-002.

### PB-FA-002 — Programming learning-resource support

**Evidence basis:** `S71-F-014` (Confirmed); Sprint 72 operator backlog `S72-B-003`; requirements task never started in Sprint 72.

**Scope sketch:**

- Learner code handling
- Programming-specific workspaces
- Language-aware rendering
- Programming evidence and feedback

**Readiness:** Evidence of need exists; **implementation approach and acceptance criteria not yet written** — mature enough to remain Future architecture, not yet sprint-allocated.

**Former Sprint 72 links:** T-052, B-003.

### PB-FA-003 — Pipeline integrity

**Evidence basis:** Sprint 72 capacity cut-line / operator hardening notes; public-export vs Node-module path divergence lesson in Sprint 72 (browser-bundle parity).

**Scope sketch:**

- Finalized-page schema-currency audit
- Model-to-DOM / render-closure validation
- Renderer-contract validation

**Readiness:** Direction clear; needs concrete audit plan and acceptance criteria before sprint open. Sprint 74 discovery ([S74-T-001](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-001-codebase-rationalisation-discovery.md)) recommends a **74A** domain aligned with this item — **74A is not opened**.

### PB-FA-004 — Manually uploaded graphics

**Product need:** Authors should be able to add an existing image directly through the Graphics authoring area without requiring an AI-generated visual job.

**Desired behaviour:**

- Allow an author to upload an image as a graphic
- Persist it through the established Workflow Resources owner
- Allow it to participate in learner rendering and packaging
- Present generated and manually uploaded graphics through the same Graphics authoring concept
- Distinguish origin only where useful
- Do not require the learner renderer or package builder to care whether a graphic was generated or uploaded

**Architectural alignment:**

- Uploaded graphics are Workflow Resources
- Use the existing resource-type-neutral owner
- Use the existing binary-payload persistence path
- Do not create a separate image attachment system
- Do not assume a graphic must originate from a visual job
- Image origin may be recorded as minimal metadata if required
- Renderer and package output consume the same image-resource projection

**Predecessor evidence:** Sprint 73 Workflow Resources architecture — [PB-FA-001](#pb-fa-001--workflow-resources); [S73-T-002](../development/sprints/2026-08-06-sprint-73-workflow-resources/S73-T-002-canonical-workflow-resource-ownership.md); [S73-T-011](../development/sprints/2026-08-06-sprint-73-workflow-resources/S73-T-011-generated-image-persistence-implementation.md); [S73-T-020](../development/sprints/2026-08-06-sprint-73-workflow-resources/S73-T-020-workflow-resources-generalisation-design.md); [SPRINT-73-FINAL-REPORT.md](../development/sprints/2026-08-06-sprint-73-workflow-resources/SPRINT-73-FINAL-REPORT.md).

**Explicit non-scope (for this item):**

- Implementation in Sprint 73
- AI image generation changes
- Central media library
- Cross-workflow resource sharing
- Image editor
- Automatic image optimisation
- Bulk upload unless separately prioritised
- Learner-renderer redesign

**Readiness:** Evidence of need and architectural alignment exist after Sprint 73; **implementation approach and acceptance criteria not yet written** — Future architecture candidate, **not sprint-allocated**.

---

## 3. Research / design questions

Unresolved questions requiring investigation before planning. **No implementation commitment.**

| ID | Question | Why it matters | Notes |
| -- | -------- | -------------- | ----- |
| PB-R-001 | What is the minimal durable store for Copilot conversation attachments with rights and fidelity guarantees? | Unlocks PB-FA-001 byte path without overbuilding | Bound by `S72-D10` |
| PB-R-002 | Which programming languages and IO/debug affordances are first-class for v1.0? | Scopes PB-FA-002 | Anchored by `S71-F-014` |
| PB-R-003 | How should “raise the ceiling” (~90–91 → aspirational 95–98) be measured without score-chasing? | Avoids premature ceiling sprints | Sprint 72 T-060 baseline selected; T-061/T-062 not completed |
| PB-R-004 | When is a dedicated case-study / shared-evidence-spine page type warranted vs activity-level evidence? | Prevents premature page-type proliferation | Explicitly deferred in Sprint 72 (`S72-D11`) |
| PB-R-005 | How far should progressive-disclosure elicitation go beyond source-bound attachment guidance? | Layer 2 redesign still largely discovery | Former T-030–T-032 |
| PB-R-006 | What does discipline-appropriate source / evidence evaluation require beyond the Evidence-Centred Learning umbrella? | Residual Confirmed `S71-F-007` after Sprint 72 umbrella adoption | Do not import history provenance rules into literature; investigate per-discipline profiles |
| PB-R-007 | Where should Benchmark v2.1 / Validation Review v2.0 instruments live in-repo (if at all)? | Sprint 71 Final Report recommendation; paths unresolved at S71 close | Methodology / tooling — not a generation-contract defect |
| PB-R-008 | How should unreferenced / orphan Workflow Resources be cleaned up without destructive surprise? | Sprint 73 retained mixed-data limitation; only referenced resources render | Follow-on to PB-FA-001; no automatic cleanup shipped |

---

## 4. Product ideas

Lightly formed possibilities. Concise only. **No task IDs, sprint allocation, or implied commitment.**

- Case-study page type / shared evidence spines
- Image-style consistency hardening (run/workflow visual style profile)
- Specialist discipline renderers (music, maths notation beyond current TeX, chemistry, engineering diagrams)
- Richer evidence visualisations
- Design Feedback attribution programme beyond guided-review slice
- Broader Layer-1 uncertainty / timing / competing-interpretations programme beyond shipped constraints (`S71-F-005`, related)
- Ambiguous / conflicting diagnostic evidence for professional judgement (`S71-F-009`) — **PB-I-009**
- Worked-example conceptual explanation depth (`S71-F-011`) — **PB-I-011**
- Transfer / modelling depth beyond Check→Transfer ordering (`S71-F-010`)
- Rejection-of-alternatives prompting (`S71-F-006`); scholarly-perspective specificity (`S71-F-008`); later-stage prediction (`S71-F-012`); contrasting worked patterns (`S71-F-013`)
- Controlled raise-the-ceiling experiment
- Further nav/heading a11y polish beyond Sprint 72 bounded fixes
- Historical ideas retained from [ideas.md](ideas.md): richer parameter systems; reusable workflow templates; workflow inspectability surfaces; optional API gateway; utility transforms; renderer quality presets
- Longer-horizon notes from [future-directions.md](future-directions.md): institutional deployment; collaborative authoring; domain-pack marketplaces — programme-level only

---

## Sprint 71 disposition audit

Completed 2026-08-05: [SPRINT-71-DISPOSITION-AUDIT.md](../development/sprints/2026-07-31-sprint-72-productising-instructional-architecture/SPRINT-71-DISPOSITION-AUDIT.md). Every validated Sprint 71 finding/recommendation has an explicit disposition (implemented, deferred to this backlog, superseded, or intentionally not adopted).

---

## Maturity ranking for next-sprint selection (non-binding)

| Rank | Item | Why |
| ---- | ---- | --- |
| 1 | **PB-FA-003** Pipeline integrity | Recent public-export/bundle parity lesson; hardening for maturation phase; aligned with Sprint 74 recommended **74A** (not opened) |
| 2 | **PB-FA-004** Manually uploaded graphics | Extends Sprint 73 Graphics path; approach/acceptance criteria still needed |
| 3 | **PB-FA-002** Programming learning resources | Confirmed S71 finding; needs requirements pass first |
| — | Stabilisation PB-S-001 | Fix when capacity allows; do not block sprint selection on greenwashing the full suite |
| — | Stabilisation PB-S-004 | Duplicate/legacy pathways — informed by Sprint 74 discovery; not auto-consumed |
| — | **PB-FA-001** Workflow Resources | Sprint 73 **closed**; residual follow-ons via PB-FA-004 / PB-R-001 / PB-R-008 |

**Sprint 74** is **OPEN** (discovery wrapper) — see [SPRINT-74-START-HERE.md](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/SPRINT-74-START-HERE.md). **Sprint 74A / 74B / 74C are not opened.** Select follow-on domains from discovery + this backlog via [NEXT-SPRINT.md](../sprints/NEXT-SPRINT.md).

---

## Related

- Sprint 74 pack: [SPRINT-74-START-HERE.md](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/SPRINT-74-START-HERE.md)  
- Sprint 74 discovery: [S74-T-001](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-001-codebase-rationalisation-discovery.md)  
- Sprint 73 closure: [SPRINT-73-CLOSURE.md](../development/sprints/2026-08-06-sprint-73-workflow-resources/SPRINT-73-CLOSURE.md)  
- Sprint 73 final report: [SPRINT-73-FINAL-REPORT.md](../development/sprints/2026-08-06-sprint-73-workflow-resources/SPRINT-73-FINAL-REPORT.md)  
- Sprint 72 closure: [SPRINT-72-CLOSURE.md](../development/sprints/2026-07-31-sprint-72-productising-instructional-architecture/SPRINT-72-CLOSURE.md)  
- Sprint 72 cut-line history: [SPRINT-72-BACKLOG-RATIONALISATION.md](../development/sprints/2026-07-31-sprint-72-productising-instructional-architecture/SPRINT-72-BACKLOG-RATIONALISATION.md)  
- Next sprint pointer: [docs/sprints/NEXT-SPRINT.md](../sprints/NEXT-SPRINT.md)  
