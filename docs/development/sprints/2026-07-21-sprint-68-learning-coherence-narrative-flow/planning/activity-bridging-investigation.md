# Activity-to-Activity Bridging — Investigation Brief

**Sprint:** 68  
**Backlog:** S68-BL-001  
**Investigation:** INV-001  
**Status:** Ready to start — not yet executed

---

## Problem statement

The heteroscedasticity vNext export shows **one** intellectual coherence bridge. It appears inside Activity 5's first beat rather than as a transition between Activity 4 and Activity 5 (or between other consecutive activities). Learners may experience abrupt context changes between activity articles.

---

## Investigation steps

### 1. JSON audit

Search heteroscedasticity fixture and comparison fixtures for:

- `intellectual_coherence_bridge`
- `activity_preamble`
- `reasoning_orientation`
- `progression_guidance`
- Any other transition-like prompt fields in archetype rules

### 2. Model trace

For each activity A1–A5, document:

```text
JSON field → build-*-model.js → LearnerPageModel path → render module → DOM class/region
```

Pay special attention to A5 orientation beat prompts in `MODEL_REVIEW.md` expected structure.

### 3. Render trace

Load export HTML; for each activity boundary note:

- What appears at end of activity N
- What appears at start of activity N+1
- Whether preamble duplicates bridge intent

### 4. Semantic intent

Determine authoring intent:

- Is `intellectual_coherence_bridge` a **capstone recap** (within activity)?
- Is `activity_preamble` the **inter-activity transition**?
- Are bridges absent from A2–A4 because pipeline never authored them?

### 5. Classification and recommendation

For each coherence gap, assign one of:

1. Renderer defect
2. Render model deficiency
3. Lesson schema deficiency
4. Pipeline generation deficiency

Choose one outcome:

- **A.** Reposition or fix renderer (renderer defect)
- **B.** Fix JSON → model mapping (render model deficiency)
- **C.** Treat preambles as intended transitions; presentation only (renderer)
- **D.** Log deferred schema/pipeline entry with evidence (schema or pipeline deficiency)

---

## Success output

- Updated [investigation-log.md](../investigation-log.md) INV-001 closed
- Findings in [findings-log.md](../findings-log.md)
- Backlog items S68-BL-003 or S68-BL-009 updated with clear next action

---

## Key files

| Layer | Path |
| ----- | ---- |
| Fixture | `tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json` |
| Archetype rules | `lib/learner-renderer-vnext/archetype-rules.js` |
| Activity model | `lib/learner-renderer-vnext/build-activity-model.js` |
| Beat model | `lib/learner-renderer-vnext/build-beat-model.js` |
| Beat sequence | `lib/learner-renderer-vnext/build-beat-content-sequence.js` |
| Render activity | `lib/learner-renderer-vnext/render-activity.js` |
| Render beat | `lib/learner-renderer-vnext/render-beat.js` |
| Prompt labels | `lib/learner-renderer-vnext/prompt-labels.js` |
| Model review | `lib/learner-renderer-vnext/MODEL_REVIEW.md` |
