# Sprint 29 review log

**Pack:** `docs/development/sprints/2026-05-21-sprint-29-renderer-cognition-semantics/`  
**Decisions:** R29-001+

---

## 2026-05-21 — R29-001: Renderer cognition investigation opened

**Status:** **Accepted** (programme)

### Decision

Open Sprint 29 as **renderer-only** follow-on to closed Sprint 28. First slice **29-0** is evidence and framing — no `app.js` renderer edits.

### Rationale

Cognition fields survive composition (Sprint 28) but `renderLearningActivitiesBlocks` does not treat them as first-class presentation keys.

### Preconditions

- Sprint 28 closed — [`sprint-28-closure.md`](../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/sprint-28-closure.md)
- Test floor **350**

---

## 2026-05-21 — R29-002: Semantic rendering scope defined

**Status:** **Accepted** (documentation)

### Decision

**In scope:** Lightweight semantic classes, callouts, hierarchy, spacing, tokens — mapped to existing cognition field IDs.

**Out of scope:** Pedagogy generation, workflows, factors, tutoring UI, illustrations, branding redesign.

### Principles

Documented in [`sprint-29-charter.md`](sprint-29-charter.md) and [`renderer-semantics-notes.md`](renderer-semantics-notes.md).

### Hypothesis register (working)

| ID | Working verdict (29-0) |
|----|------------------------|
| R29-H1 | **Supported** — assessment visual dominance |
| R29-H2 | **Open** |
| R29-H3 | **Supported** — cognition fields flattened in render path |
| R29-H4 | **Open** |
| R29-H5 | **Partial** — profile at C, not consumed at R |

### Next

**29-1** — HTML export capture and matrix scoring refresh.

---

## 2026-05-21 — R29-003: 29-1 HTML capture complete

**Status:** **Accepted** (evidence)

### Decision

Complete Sprint **29-1** for probes **R29-P01**, **R29-P02**, **R29-P07** using `buildUtilityStructuredHtmlForTest` on Sprint 28 post-5d composed page JSON (`28-5d-stabilisation-capture.json`). No renderer, CSS, workflow, or schema changes.

### Evidence

| Artefact | Role |
|----------|------|
| [`context-files/r29-p01-html-capture.md`](context-files/r29-p01-html-capture.md) | Climate misconception — embedded cognition labels in task cards |
| [`context-files/r29-p02-html-capture.md`](context-files/r29-p02-html-capture.md) | Peer instruction — `materials_key` headings via `renderMaterialValue` |
| [`context-files/r29-p07-html-capture.md`](context-files/r29-p07-html-capture.md) | RNA transcript — embedded labels; high assessment item count in AC |
| [`context-files/29-1-html-capture-runner.js`](context-files/29-1-html-capture-runner.js) | Regenerates captures + `29-1-html-capture-summary.json` |
| [`renderer-cognition-evidence-matrix.md`](renderer-cognition-evidence-matrix.md) | 29-1 HTML-backed matrix; 29-0 rows retained as superseded |

### Verification

`node --test tests/*.test.js` — **350** pass (unchanged).

### Next

**29-2** semantic spec — do not start without user approval for implementation track.

---

## 2026-05-21 — R29-004: 29-2 bounded renderer implementation

**Status:** **Accepted** (implementation)

### Decision

Ship minimal cognition semantics in the Utilities HTML renderer:

- `renderCognitionFieldsForActivity(row, cognitionProfile)` — revision / repair / uncertainty / transformation groups
- Inserted after activity task summary, before materials
- `util-cognition*` classes + print-safe CSS in `getUtilityCognitionPresentationCss()`
- Materials remainder skips cognition keys when present on activity row (no duplicate generic headings)

**Out of scope (unchanged):** composition, workflows, assessment_check path, broad token architecture.

### Evidence

- `app.js` renderer + CSS
- `tests/utility-renderer-cognition-fields.test.js` (+5)
- Existing assessment visibility tests unchanged

### Verification

`node --test tests/*.test.js` — **355** pass.

### Next

**29-3** not chartered — programme stops at bounded 29-2 unless user expands scope.

---

## 2026-05-21 — R29-005: Sprint 29 programme closure

**Status:** **Accepted** (closure)

### Decision

Formally **close Sprint 29** after:

| Slice | Confirmation |
|-------|----------------|
| **29-0** | Investigation pack and renderer audit complete (no implementation) |
| **29-1** | HTML capture audit complete (R29-P01/P02/P07; matrix updated) |
| **29-2** | Bounded renderer complete — `util-cognition*` blocks for top-level activity-row fields |

### Outcomes recorded

- **Tests:** **355** passing (`node --test tests/*.test.js`)
- **Renderer:** Top-level activity-row cognition fields render as labelled `util-cognition*` semantic blocks
- **Residual:** Cognition embedded in `task_cards` markdown remains generic; row promotion is composition/data placement (Sprint 28), not Sprint 29 renderer scope
- **Unchanged:** Workflow, generation, composition, assessment_check rendering

### Evidence

[`sprint-29-closure.md`](sprint-29-closure.md), [`CURRENT-STATE.md`](CURRENT-STATE.md), [`HANDOVER.md`](HANDOVER.md)

### Next programme

Pick a **new sprint theme** — do not extend Sprint 29 renderer scope without a new charter.

---

## Decision template

```markdown
### R29-0XX — [title]

**Date:** YYYY-MM-DD  
**Status:** Accepted | Superseded | Deferred  

**Context:** …  
**Decision:** …  
**Evidence:** matrix row / probe ID  
```
