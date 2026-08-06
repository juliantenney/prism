# PRISM Product Backlog

**Canonical location:** `docs/backlog/PRODUCT-BACKLOG.md`  
**Status:** Active — maturation / v1.0 stabilisation phase  
**Last updated:** 2026-08-06 (PB-FA-001 renamed to Workflow Resources; Sprint 73 pack refinement)  
**Source migrations:** Sprint 72 cut-line (`S72-T-077`); Sprint 71 disposition audit; historical notes in `ideas.md`, `known-issues.md`, `future-directions.md` (see [README.md](README.md))

---

## Planning principle (binding)

> A backlog item should only enter a sprint when it has a concrete implementation approach, clear ownership and acceptance criteria. Ideas and possible future enhancements remain in the product backlog until they are ready for planning.

**How Sprint 73 is selected:** Pull a sufficiently mature item from **Stabilisation** or **Future architecture** below. Do **not** pre-assign a sprint number to a feature until a sprint pack is opened with approach and acceptance criteria.

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

**Implementation mechanism (initial architectural problem):** **Workflow asset persistence** — stable identity, storage, reconnect, and regeneration semantics. Generated images are the first implementation slice; the persistence architecture must not be specialised for images alone (Sprint 73 design constraint).

**Broader direction (not Sprint 73 commitments):** Workflow Resources are expected ultimately to encompass **generated media**, **uploaded documents**, and **embedded external resources**. PDF, Word, and video remain anticipated architecture consumers until a later sprint assigns them.

**Evidence basis:** `S72-D09` (shared workflow asset-persistence model); `S72-D10` (conversation-attachment bytes intentionally out of Sprint 72 scope); Sprint 72 Phase 4/5 path work; Owen source-bound runs proved conversation-bound source use without byte storage.

**Scope sketch (not a charter):**

- Workflow Resources model (resource-type-neutral persistence architecture)
- Image / generated-media persistence (IDs, generation metadata, reconnect, selective regeneration) — first slice
- Conversation-attachment persistence (byte path — harder; bound by `S72-D10`)
- Stable resource identity
- Byte-level fidelity verification
- Reconnection and regeneration semantics
- Workflow ↔ author-evidence association persistence (shared model per `S72-D09`)

**Readiness:** Sprint 73 **OPEN** (2026-08-06) — [SPRINT-73-START-HERE.md](../development/sprints/2026-08-06-sprint-73-workflow-resources/SPRINT-73-START-HERE.md). Phase 1 discovery must establish implementation approach and acceptance criteria before Phase 2 begins.

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

**Readiness:** Direction clear; needs concrete audit plan and acceptance criteria before sprint open.

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
| 1 | **PB-FA-001** Workflow Resources | **Sprint 73 OPEN** — binding decisions (`S72-D09`/`D10`); Phase 1 discovery not yet started |
| 2 | **PB-FA-003** Pipeline integrity | Recent public-export/bundle parity lesson; hardening for maturation phase |
| 3 | **PB-FA-002** Programming learning resources | Confirmed S71 finding; needs requirements pass first |
| — | Stabilisation PB-S-001 | Fix when capacity allows; do not block sprint selection on greenwashing the full suite |

**Sprint 73** is open on **PB-FA-001** — see [SPRINT-73-START-HERE.md](../development/sprints/2026-08-06-sprint-73-workflow-resources/SPRINT-73-START-HERE.md).

---

## Related

- Sprint 72 closure: [SPRINT-72-CLOSURE.md](../development/sprints/2026-07-31-sprint-72-productising-instructional-architecture/SPRINT-72-CLOSURE.md)  
- Sprint 72 cut-line history: [SPRINT-72-BACKLOG-RATIONALISATION.md](../development/sprints/2026-07-31-sprint-72-productising-instructional-architecture/SPRINT-72-BACKLOG-RATIONALISATION.md)  
- Next sprint pointer: [docs/sprints/NEXT-SPRINT.md](../sprints/NEXT-SPRINT.md)  
