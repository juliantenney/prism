# Session Handover — Sprint 26 (Pedagogical intent & workflow topology)

**Role:** authoritative for **this pack only**.

**Pack path:** `docs/development/sprints/2026-05-20-sprint-26-pedagogical-intent-elicitation-orchestration/`

**Date:** 2026-05-20 (updated after Track B closure)

**Live repo rule:** Files under `app.js`, `domains/learning-design/`, and `tests/` are **authoritative**. This pack holds **bounded excerpts and investigation notes** — refresh snapshots when behaviour changes.

---

## Continue here — Track A only (next chat)

**Assessment rendering is no longer a blocker.** Track B is **closed** (renderer/export hotfix complete, tests passing). Resume Sprint 26 on **workflow topology / elicitation** for the RNA/HCV case.

### Primary case (unchanged)

| Item | Detail |
|------|--------|
| Brief | Sparse RNA virus / HCV **self-study** from uploaded lecture transcript |
| Explicit ask | **Learning activities** (and implied materials) |
| Acceptable | Self-study interpretation; topic grounding from transcript |
| **Problem** | Workflow **skipped** Design Learning Activities and Generate Activity Materials |
| Observed chain | Normalize → Model Knowledge → Outcomes → **Assessment Items** → Design Page |
| Expected chain | … → Outcomes → **Design Learning Activities** → **Generate Activity Materials** → Assessment Items → Design Page |
| Downstream | Page noted no upstream `learning_activities` (renderer was faithful; topology was not) |

### What not to re-investigate

- Whether `page.sections[]` can render `assessment_check` when items exist — **yes** (fixed).
- Whether Design Page failed to compose assessment — **not the reported failure** when JSON contained `assessment_check` + `content.items[]`.
- Renderer/export path for MCQs — see **Track B closed** below.

### Read first (Track A)

| Order | File | Why |
|-------|------|-----|
| 1 | [`context-files/rna-virus-brief-case.md`](context-files/rna-virus-brief-case.md) | Case narrative |
| 2 | [`context-files/workflow-topology-rules-current-state.md`](context-files/workflow-topology-rules-current-state.md) | Pruning / triggerRules |
| 3 | [`context-files/elicitation-runtime-entrypoints.md`](context-files/elicitation-runtime-entrypoints.md) | Function map |
| 4 | [`slice-26-1-charter.md`](slice-26-1-charter.md) | Track A questions + hypotheses H1–H6 |
| 5 | [`review-log.md`](review-log.md) | R26-PI-001+ decisions |

Track B reference (closed): [`context-files/assessment-items-output-trace.md`](context-files/assessment-items-output-trace.md), [`page-assessment-renderer-notes.md`](context-files/page-assessment-renderer-notes.md).

---

## Track status at a glance

| Track | Issue | Status |
|-------|--------|--------|
| **A** | Missing Generate Learning Activities / Generate Activity Materials despite brief | **Open** — 26-1 primary investigation |
| **B** | Assessment MCQs missing from rendered/exported HTML | **Closed** — renderer/export hotfix (R26-PI-007, R26-PI-008) |

---

## Track B — closed (assessment on rendered page)

### Original symptom

- Page artefact contained `section_id: assessment_check`, heading **Formative Assessment Check**, `content.items` Q1–Q10.
- Exported HTML initially **omitted** the assessment section.
- First hotfix: section detected but **placeholder** + wrong heading (**Study and Revision Guidance** from adjacent `support_notes`).
- Follow-up fix: correct heading, all MCQs, separate support section.

### Conclusion

**Renderer/export issue only** — not orchestration, not Design Page composition (for the reported RNA shape with valid `sections[]`).

| Layer | Finding |
|-------|---------|
| Generation | Assessment items present in workflow |
| Composition | `assessment_check` + `items[]` in page JSON (reported) |
| Renderer | **A-RENDER** — detection + section object binding |

### Final renderer behaviour

- Binds to **current section** `section_id`, `heading`, `content.items[]`.
- **No placeholder** when real items exist.
- **`support_notes` / Study and Revision Guidance** renders separately.
- **No invented answer key** when none in artefact.
- Catalogue `sectionOrder` index no longer mis-tags adjacent sections.

### Verification (Track B)

```bash
node --test tests/*.test.js
```

**252 passed**, 0 failed (last run 2026-05-20).

| Item | Path |
|------|------|
| Code | `app.js` — `isAssessmentCheckSection`, `renderAssessmentCheckSectionBlock`, `collectAssessmentQuestionRows`, … |
| Fixture | `tests/fixtures/page-render/ld-rna-hcv-assessment-page.json` |
| Tests | `tests/utility-ld-rna-assessment-page-render.test.js` |
| Regression | `tests/utility-ld-inflation-page-render.test.js` (assessment assert) |

### Known limitations (Track B)

- Non-canonical `section_id` values (e.g. `quiz`, `formative_assessment`) may still need heading heuristics — see `page-assessment-renderer-notes.md`.
- Live RNA browser re-export not re-recorded in pack; fixture + unit tests are authority for render path.
- If `sections[]` lacks `assessment_check` but `source_artefacts.assessment_items` is true — still a **composition** gap, not renderer.

---

## Track A — open (workflow topology)

Workflow omitted activity/material steps while assessment ran. Failure locus: **elicitation → workflow design → heuristics / pack triggerRules** (see pipeline below).

**Open decisions:** D1–D4 in review log (D5–D6 resolved for Track B).

---

## Pipeline (frozen investigation model)

```
Factory brief
  → getWorkflowBriefConfig (workflowGenerationContext.js + LD pack)
  → extractWorkflowBriefExplicitFactors (app.js)
  → applyWorkflowBriefInferenceRules (pack)
  → resolveWorkflowBriefFactors (+ elicitation)
  → AI workflow JSON (callOpenAIForWorkflowDesign)
  → applyWorkflowDesignHeuristics (app.js)
  → workflowPolicy.triggerRules + step pruning
  → persisted workflow steps
```

---

## In scope (26-1 remainder)

| Area | Status |
|------|--------|
| Track A: topology evidence + rules draft | **Active** |
| Track B: assessment trace / render | **Done** (code + docs) |
| Pedagogical topology selection | 26-1 → 26-2 |
| Artefact composition integrity (activities) | 26-1 → 26-4 |
| Learner-facing inclusion (activities) | 26-1 → 26-4 |

---

## Out of scope (unless re-chartered)

- Further renderer work (Track B closed)
- Sprint 25 composition contract changes
- Settings unified panel redesign
- Full domain-pack rewrite

---

## Test floor

```bash
node --test tests/*.test.js
```

**252 passed**, 0 failed.

---

## Active slice

**26-1** — investigation/documentation for **Track A** only. See [`CURRENT-STATE.md`](CURRENT-STATE.md).

When 26-1 completes: propose 26-2 (rules design) and 26-3 (fixtures) in review log.

---

## Related programmes

| Sprint | Relevance |
|--------|-----------|
| Sprint 23 | `assessment_required` gates topology |
| Sprint 17 | Sparse brief Research lab |
| Sprint 25 | Page composition when activities exist upstream |
| Renderer pack (sibling) | Presentation CSS — **paused**, orthogonal to Track B hotfix |
