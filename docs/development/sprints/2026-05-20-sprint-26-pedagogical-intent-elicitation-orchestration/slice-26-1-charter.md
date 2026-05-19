# Slice 26-1 — Evidence-led elicitation and topology investigation

**Date:** 2026-05-20  
**Status:** **Active** (documentation only — **Track A**)  
**Scope:** Investigation and sprint-pack evidence — **no topology/pack implementation in 26-1**

**Track B:** **Closed** — renderer hotfix complete (R26-PI-007–009); see [`review-log.md`](review-log.md).

---

## Charter

| Item | Detail |
|------|--------|
| **Focus** | **Track A:** workflow topology / elicitation — RNA virus case |
| **Track B** | **Closed** — assessment export rendering (reference only) |
| **Case study** | Sparse HCV/RNA virus self-study brief — `context-files/rna-virus-brief-case.md` |
| **Deliverables** | Pipeline maps, evidence tables (×2 tracks), failure classification, trigger rules, fixture candidates, 26-2/26-3 outlines |
| **Constraints** | No runtime, pack, renderer, Settings, or workflow schema changes |

---

## Investigation questions — Track A (topology)

1. Where are brief signals extracted?
2. Where are signals classified as explicit, inferred, answered, or defaulted?
3. Where is workflow topology selected or mutated?
4. Why do assessment signals trigger assessment steps strongly?
5. Why do activity signals not trigger activity/material steps strongly?
6. Are activity signals stored but ignored, or never canonicalised?
7. Does `self-study` / `delivery_context: self_directed` suppress activity generation unintentionally?
8. How are “learning activities”, “practice tasks”, “exercises”, “worksheets”, “scenarios”, “reflection prompts”, and “active learning” interpreted today?
9. What should explicit topology trigger rules be (proposal only)?
10. What regression fixtures are needed (candidates only)?

## Track B — closed (reference)

Assessment items missing from **rendered/exported HTML** — **resolved** (renderer/export, R26-PI-007–009).

| Outcome | Detail |
|---------|--------|
| Locus | **A-RENDER** — not orchestration or Design Page for valid `assessment_check` + `items[]` |
| Tests | `tests/utility-ld-rna-assessment-page-render.test.js` — **252** suite pass |
| Docs | `context-files/assessment-items-output-trace.md`, `page-assessment-renderer-notes.md` |

Do not re-open Track B unless export regression.

---

## Expected workflow (RNA case — pedagogical reference)

When the brief explicitly requests **learning activities** for a self-study page:

```
Normalize Content
→ Model Knowledge
→ Define Learning Outcomes
→ Design Learning Activities
→ Generate Activity Materials
→ Generate Assessment Items
→ Design Page
```

(Assessment position may vary; **activity + materials must not be silently dropped**.)

---

## Observed workflow (case study — to verify in 26-1)

Reported generated chain:

- Normalize Content  
- Model Knowledge  
- Define Learning Outcomes  
- Generate Assessment Items  
- Design Page  

**Omitted:** Design Learning Activities, Generate Activity Materials.

**Downstream symptom:** Design Page noted no upstream `learning_activities` were provided.

### Track B — same run (closed)

- Workflow included Generate Assessment Items; page JSON had `assessment_check` + items.  
- Export initially omitted MCQs; **fixed** in renderer (2026-05-20).  
- **Not a blocker** for continuing Track A work.

---

## Investigation work plan

| Step | Output |
|------|--------|
| Trace RNA brief through `extractWorkflowBriefExplicitFactors` | Factor snapshot table |
| Trace `resolveWorkflowBriefFactors` + elicitation | Source map (explicit / inferred / default) |
| Capture AI draft steps pre-heuristic (if available via trace/logs) | Model vs heuristic responsibility |
| Trace `applyWorkflowDesignHeuristics` | `leanAssessmentItemIntent`, `formativeAssessmentPackDefaultIntent`, triggerRules, pruning |
| Cross-check pack `workflowPolicy.triggerRules` | Include/exclude interactions |
| Document self-study + page-only paths | `session_materials`, `page_profile`, thin-page rules |
| Propose topology trigger rules (draft) | For 26-2 charter |
| List fixture candidates | For 26-3 charter |
| ~~Track B~~ | **Done** — A-RENDER; see review log R26-PI-009 |

---

## Hypotheses — Track A (topology)

| ID | Hypothesis | Inspect first |
|----|------------|---------------|
| H1 | `formativeAssessmentPackDefaultIntent` prunes activity/material steps when brief mentions formative assessment | `app.js` ~10185–11158 |
| H2 | `leanAssessmentItemIntent` prunes pedagogy chain when assessment + MCQ cues without “session” cues | `app.js` ~10176–11148 |
| H3 | `assessment_required: true` from regex strongly includes assessment via pack `triggerRules` but lacks symmetric `activities_required` | Pack JSON ~122–147; extract ~7294 |
| H4 | `explicitSessionOrActivityRequested` fails to fire on actual brief wording (phrase gap) | `hasIntent` regex ~10173 |
| H5 | AI model proposes thin workflow; heuristics do not repair missing activity steps | Workflow design prompt + post-heuristic step list |
| H6 | `self_directed` + page intent prefers ingest + page without activity chain | `allowGenerateLearningContent`, pack exclude rules ~149–161 |

**26-1 outcome:** mark each hypothesis **confirmed / rejected / partial** with line-level evidence.

## Hypotheses — Track B (archived — closed)

**B6 confirmed** (renderer/export). B2/B5 rejected for reported case (composition had section). See R26-PI-009.

---

## Deliverables checklist

- [ ] Pipeline diagram in `review-log.md` or linked investigation note
- [ ] RNA case evidence table — Track A (`context-files/` + review log)
- [x] Track B closed — `assessment-items-output-trace.md`, `page-assessment-renderer-notes.md`, R26-PI-009
- [ ] Failure point classification (extract / resolve / model / heuristics / pack policy)
- [ ] Proposed trigger rules (draft, non-binding)
- [ ] `regression-fixture-candidates.md` updated with priorities
- [ ] Proposed `slice-26-2-charter.md` / `slice-26-3-charter.md` outlines in review log or separate stubs
- [ ] `HANDOVER.md` complete for new chat
- [ ] `CURRENT-STATE.md` updated

---

## Verification

```bash
node --test tests/*.test.js
```

**252 passed** (includes Track B renderer tests); **no further** `app.js` changes for 26-1 unless Track A investigation requires read-only traces only.

---

## Out of scope

- Implementation fixes (26-4)
- New test fixtures (26-3) — candidates only in 26-1
- Renderer / Design Page composition changes
- Pack rewrites without charter
