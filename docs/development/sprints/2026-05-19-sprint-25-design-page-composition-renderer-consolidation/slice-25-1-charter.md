# Sprint 25 Slice 25-1 — Design Page pipeline investigation and governance framing

**Date:** 2026-05-19  
**Status:** **Open**  
**Sprint:** 25 — Design Page composition and renderer consolidation  
**Slice:** 25-1

**Baseline:** Sprints [23](../2026-05-18-sprint-23-learning-design-pack-rationalisation/sprint-23-closeout.md) (LD semantics) and [24](../2026-05-19-sprint-24-research-pack-conformance/sprint-24-index.md) (Research conformance) complete.

---

## Objective

Establish an **evidence-led audit** of the path from upstream LD artefacts to exported HTML, with emphasis on **activity preservation** and **layer boundaries**.

**Primary case study:** inflation workshop activity **A2** — present upstream, absent in Design Page export.

**Deliverable:** completed sections in [`design-page-composition-pipeline-investigation.md`](design-page-composition-pipeline-investigation.md) sufficient to charter remediation in a **later slice** (proposed 25-2 / 25-5).

---

## Constraints

| Constraint | Honoured |
|------------|----------|
| Investigation and documentation only | Required |
| No pack edits | Required |
| No runtime fixes | Required |
| No renderer feature work | Required |
| No Settings / PF changes | Required |
| Test floor must not regress | Required |

---

## In scope

| Area | 25-1 activities |
|------|-----------------|
| **Pipeline map** | Document stages: artefacts → Design Page step → `page` JSON → Utilities → HTML |
| **A2 trace** | For each stage: is A2 present? under what keys? what transform runs? |
| **Shape audit** | Compare live export JSON vs test fixtures vs catalog `renderConfig.sectionOrder` |
| **Boundary map** | Composition vs renderer vs export integration — ownership table |
| **Governance draft** | Renderer/layout principles and safe refinement boundaries |
| **Visual direction capture** | Record current v1 renderer intent (do not redesign) |
| **Slice proposals** | Recommend 25-2+ charters based on findings |

---

## Out of scope

| Item | Deferred to |
|------|-------------|
| Fixing A2 or any composition bug | 25-5 or hotfix slice |
| New renderer patterns | 25-4+ |
| Pack prompt changes for Design Page | Separate pack charter if needed |
| Research page flows | Reference only; LD workshop is primary trace |

---

## Investigation tasks (checklist)

### A. Upstream artefacts

- [ ] Capture representative `learning_activities` JSON (confirm A2 row + title).
- [ ] Capture `activity_materials` entries keyed to A2.
- [ ] Capture `learning_sequence` references to A2.
- [ ] Note `design_scope`, `page_profile`, and workflow path (workshop vs self-study).

### B. Design Page composition

- [ ] Locate Design Page step prompt / pattern requirements (`domain-learning-design-step-patterns.md`).
- [ ] Identify composition rules in pack artefacts spec (`page` §18).
- [ ] Compare **synthesised `page` artefact** (live) vs inflation full fixture.
- [ ] Record whether A2 is missing from `sections[].content` for `learning_activities` or only from export view.

### C. Saved artefact shape

- [ ] Document top-level keys on live `page` (`overview`, `learning_activities`, `sections`, etc.).
- [ ] Detect duplicate / conflicting bodies (canonical top-level vs `sections[]`).
- [ ] Record `generation_notes.limitations` if present.

### D. Export / Utilities path

- [ ] Trace `resolveUtilityRenderPlan` → `buildUtilityStructuredHtml` for `artifact_type: page`.
- [ ] Compare catalog `sectionOrder` (no `"sections"`) vs test helper `["sections"]`.
- [ ] Confirm whether `pageSections` is passed on live generate path.
- [ ] Run **control test:** render full fixture through catalog `sectionOrder` (test exists: catalog prefers `sections[]`).

### E. Renderer control test

- [ ] Render `ld-inflation-workshop-page-full.json` — confirm A2 title in HTML.
- [ ] If live `page` JSON available, render through Utilities — compare.
- [ ] Classify failure: **composition** | **shape** | **export** | **renderer**.

### F. Governance outputs

- [ ] Draft composition vs renderer ownership table (for investigation doc §4).
- [ ] Draft renderer refinement boundaries (investigation doc §6).
- [ ] Draft visual direction summary (investigation doc §7).

---

## Deliverables

| Artefact | Path | Done when |
|----------|------|-----------|
| Investigation document | [`design-page-composition-pipeline-investigation.md`](design-page-composition-pipeline-investigation.md) | Sections 1–8 populated; §9 findings + §10 recommendations |
| Review decisions | [`review-log.md`](review-log.md) | R25-007+ recorded at slice close |
| Current state update | [`CURRENT-STATE.md`](CURRENT-STATE.md) | 25-1 marked closed; next slice named |

**Optional (recommended, not blocking):**

- `context-files/` snapshots of live `page` JSON (redacted) and upstream artefacts for A2 case
- One-line update to [`docs/architecture/renderer-export-behavior.md`](../../../architecture/renderer-export-behavior.md) **only if** export path finding is confirmed (can defer to 25-3)

---

## Success criteria (25-1 close)

1. **Root-cause class** for A2 loss is identified (composition / shape / export / renderer) with evidence.
2. **Pipeline diagram** and stage ownership table are agreed.
3. **Renderer governance principles** are documented (safe vs unsafe changes).
4. **Proposed slice 25-2 charter** is sketched in investigation doc §10.
5. **No code changes** except documentation under this sprint pack (unless explicitly approved as out-of-band hotfix).

---

## Verification

```bash
node --test tests/*.test.js
```

**Entry floor:** **220 passed**, 0 failed.

**25-1 close:** same command; record count in review log.

---

## Proposed follow-on slices (not chartered)

| Slice | Purpose | Trigger |
|-------|---------|---------|
| **25-2** | Activity preservation contract for Design Page composition | 25-1 finds composition gap |
| **25-3** | Export shape + `pageSections` contract + fixtures | 25-1 finds export/shape gap |
| **25-4** | Renderer governance + bounded visual refinements | After contracts stable |
| **25-5** | Implementation (composition and/or export and/or renderer) | Approved remediation plan |

---

## References

| Resource | Path |
|----------|------|
| Investigation scaffold | [`design-page-composition-pipeline-investigation.md`](design-page-composition-pipeline-investigation.md) |
| Full inflation fixture | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` |
| Page render tests | `tests/utility-ld-inflation-page-render.test.js` |
| Page artefact spec | `domains/learning-design/domain-learning-design-artefacts.md` |
| Page render config | `domains/learning-design/domain-learning-design-artefacts.md` (`renderHints` for `page`) |
