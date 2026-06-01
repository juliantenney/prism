# P30-01 — Factory live validation (Sprint 30 Phase 1)

**Captured:** 2026-06-01T07:51:31Z (pre–**30-1c** prompt guard)  
**Method:** LD pack prompts + `applyWorkflowStepRuntimePromptAugmentations` (cognition → self-directed → PEC) + OpenAI `gpt-4.1-mini` + `applyPedagogicCognitionSemanticsToComposedPage` + `buildUtilityStructuredHtmlForTest`.

**Post–30-1c (2026-06-01):** Self-directed GAM now appends `buildSelfDirectedGamLearnerVoicePromptBlock()` — forbids “Facilitator use:”, teacher/instructor notes, and timing choreography. `evaluatePelOrientationContractSatisfaction` can flag live DLA/page + `gamText` (warn/test only). Re-run `sprint-30-probe-runner.js` to refresh artefacts.

## 1. Brief

| Field | Value |
|-------|--------|
| Goal | Create a self-directed learning page on Karl Marx covering life phases, cause-effect links, comparison of major works, and application of core concepts. |
| Inputs | Undergraduate (self-directed study) |
| Outputs | Learner-facing page |

## 2. Resolved factors

```json
{
  "explicit": {
    "desired_outputs": "Learner-facing page",
    "session_materials": [
      "page"
    ],
    "learner_level": "undergraduate",
    "delivery_context": "self_directed",
    "page_profile": "learner",
    "topic": "karl marx covering life phases",
    "workshop_subject": "karl marx covering life phases",
    "delivery_mode": "async",
    "delivery_pattern": "mostly_online",
    "learning_environments": [
      "vle"
    ]
  },
  "resolved": {
    "delivery_context": "self_directed",
    "delivery_mode": "async",
    "delivery_pattern": "mostly_online",
    "learning_environments": [
      "vle"
    ]
  }
}
```

## 3. Workflow topology

Normalize Content → Generate Learning Content → Model Knowledge → Define Learning Outcomes → Design Learning Activities → Generate Activity Materials → Construct Learning Sequence → Design Page

Runtime prompts included PEL: DLA=true, Design Page=true

## 4. DLA orientation fields

```json
[
  {
    "activity_id": "A1",
    "title": "Chronological Phases of Karl Marx's Life",
    "study_orientation": "This page guides you through Karl Marx's life, theories, and their application. Start by situating his life events chronologically to build a foundation for understanding his work. Each activity builds on the previous to deepen your insight into Marxist thought.",
    "activity_preamble": "Understanding the timeline of Karl Marx's life helps you see how his experiences shaped his thinking. By putting his life events in order, you will better grasp the context behind his theories."
  },
  {
    "activity_id": "A2",
    "title": "Cause-Effect Analysis of Marx's Theoretical Development",
    "activity_preamble": "Marx's ideas did not develop in isolation but were responses to real historical events. Analyzing these cause-effect links reveals how his theories emerged from specific social and political contexts."
  },
  {
    "activity_id": "A3",
    "title": "Comparing Major Works: The Communist Manifesto vs. Das Kapital",
    "activity_preamble": "Comparing Marx's major works side-by-side helps clarify their distinct roles and messages. This comparison deepens your understanding of his evolving arguments and intended audiences."
  },
  {
    "activity_id": "A4",
    "title": "Applying Marxist Concepts to Contemporary Issues",
    "activity_preamble": "Applying Marxist concepts to today's issues allows you to see the continuing relevance of his ideas. This exercise develops your critical thinking and ability to connect theory with real-world problems."
  }
]
```

## 5. Composed page orientation fields (post-merge)

**Artefact:** `context-files/live-artefacts/marx-page.json` (Design Page model output; merge applied).

Page uses `heading: "Learning Activities"` (no `section_id` in model JSON — renderer normalizes by heading).

```json
[
  {
    "activity_id": "A1",
    "study_orientation": "This page guides you through Karl Marx's life, theories, and their application…",
    "activity_preamble": "Understanding the timeline of Karl Marx's life…",
    "intellectual_coherence_bridge": null
  },
  {
    "activity_id": "A2",
    "intellectual_coherence_bridge": "This activity builds on your understanding of Marx's life phases…",
    "activity_preamble": "Marx's ideas did not develop in isolation…"
  },
  {
    "activity_id": "A3",
    "intellectual_coherence_bridge": "This activity extends your analysis by comparing the themes…"
  },
  {
    "activity_id": "A4",
    "intellectual_coherence_bridge": "This final activity applies your understanding…"
  }
]
```

**Note:** Page also includes **Introduction and Study Orientation** prose (duplicates A1 `study_orientation` theme).

## 6. Rendered HTML excerpt

```html
<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" /><title>Self-Directed Study on Karl Marx: Life, Theories, and Contemporary Applications</title><style>body{font-family:Segoe UI,Arial,sans-serif;margin:24px auto;padding:0 8px;max-width:920px;color:#111827;line-height:1.65}h1{margin:0 0 10px;font-size:1.9rem;line-height:1.25}h2{margin:28px 0 10px;font-size:1.2rem;line-height:1.35}h3{margin:18px 0 8px;font-size:1rem}h4{margin:12px 0 8px;font-size:.95rem;color:#374151}p{margin:0 0 12px}ul{margin:0 0 14px 20px;padding:0}li{margin:0 0 6px}section{margin:0 0 16px}table{width:100%;border-collapse:collapse;margin:10px 0 16px}th,td{border:1px solid #e5e7eb;padding:10px 12px;text-align:left;vertical-align:top}th{background:#f9fafb;font-weight:600}tbody tr:nth-child(even){background:#fcfcfd}tbody tr{min-height:2.2rem}.util-task-block{border:1px solid #dbe4f0;border-radius:12px;padding:16px;margin:14px 0;background:#fff;box-shadow:0 2px 6px rgba(17,24,39,.04)}.util-task-block p strong{line-height:1.4}.util-activity-header{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;margin-bottom:6px}.util-activity-header h3{margin:0}.util-activity-task{margin:0 0 12px}.util-badge-row{display:flex;gap:6px;flex-wrap:wrap}.util-badge{display:inline-block;border:1px solid #dbe4f0;background:#f8fafc;color:#374151;border-radius:999px;padding:2px 10px;font-size:.78rem;font-weight:600}.util-badge-time{background:#eff6ff;border-color:#bfdbfe;color:#1d4ed8}.util-badge-group{background:#f0fdf4;border-color:#bbf7d0;color:#166534}.util-section-heading{display:flex;align-items:center;gap:.55rem;margin-bottom:8px}h2.util-section-heading{margin:22px 0 6px}.util-icon-heading{display:flex;align-items:flex-start;gap:.6rem}.util-icon-heading>span,.util-icon-heading>strong{flex:1;min-width:0}.util-material-icon{font-size:.88em;line-height:1;flex-shrink:0;width:1.05em;text-align:center;margin-top:.18em}.util-section-heading .util-section-icon,.util-section-heading .util-material-icon{margin-top:0;font-size:.95em;width:1.15em}.util-section-icon{margin-right:0}.util-section-icon--overview{color:#475569}.util-section-icon--learning-purpose{color:#2563eb}.util-section-icon--knowledge-summary{color:#d97706}.util-section-icon--learning-activities{color:#6366f1}.util-section-icon--assessment{color:#0891b2}.util-section-icon--study-tips{color:#059669}.util-section-icon--default{color:#64748b}.util-task-card-icon{color:#6366f1}.util-scenario-card-icon{color:#0f766e}.util-prompt-set-icon{color:#2563eb}.util-template-icon{color:#b45309}.util-table-icon{color:#475569}.util-output-icon{color:#16a34a}.util-support-note-icon{color:#64748b}.util-activity-task-icon{color:#334155}.util-meta-icon{color:#64748b}.util-strategy-icon{color:#6b7280}.util-generic-material-icon{color:#64748b}.util-visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.util-material-heading{margin:14px 0 10px;font-size:.95rem;line-height:1.35}.util-material-heading--plain{margin:10px 0 8px;font-weight:600;color:#4b5563}.util-task-block h4.util-material-heading{margin:12px 0 8px}.util-task-block h4.util-material-heading+.util-card-grid,.util-task-block h4.util-material-heading+.util-scenario-list,.util-task-block h4.util-material-heading+.util-prompt-set{margin-top:2px}.util-task-block h4.util-material-heading+h4.util-material-heading{margin-top:6px}.util-output-block{margin:10px 0 14px;padding:10px 12px;border:1px solid #e5e7eb;border-left:3px solid #86efac;background:#f9fafb;border-radius:0 8px 8px 0}.util-output-inline{margin:8px 0}.util-line-label{margin:0 0 6px;color:#334155}.util-card-subheading{margin:8px 0 6px;font-size:.95rem;color:#374151;font-weight:600}.util-session-step{border-style:dashed;background:#f9fafb}.util-slide{border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin:10px 0}.util-scenario-list{margin:8px 0 14px;padding-left:0}.util-scenario-card{margin:0 0 12px;padding:14px 16px;border:1px solid #e5e7eb;border-left:3px solid #2dd4bf;border-radius:8px;background:#fafafa}.util-scenario-card:last-child{margin-bottom:0}.util-scenario-card h3,.util-scenario-card h4{margin:0 0 8px;font-size:1rem}.util-scenario-title{margin:0 0 10px;font-size:1rem;line-height:1.35;color:#374151;font-weight:600}.util-stage-list{display:grid;gap:10px}.util-stage-card{border-left:3px solid #93c5fd;background:#fff;border-radius:8px;padding:10px 12px}.util-stage-card h5{margin:0 0 6px}.util-material-card{margin:0 0 12px;padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa}.util-material-card:last-child{margin-bottom:0}.util-material-card h4,.util-material-card h5{margin:0 0 8px}.util-card-grid{display:grid;gap:12px;margin:10px 0 14px}.util-task-card{margin:0 0 12px;padding:14px 16px;border:1px solid #e5e7eb;border-left:3px solid #a5b4fc;border-radius:8px;background:#fafafa}.util-task-card h5,.util-task-card-heading{margin:0 0 10px;font-size:.95rem;font-weight:600;color:#374151;line-height:1.35}.util-prompt-set{margin:10px 0 14px;padding:12px 14px;border:1px solid #e0e7ff;border-left:3px solid #93c5fd;border-radius:8px;background:#f8fafc}.util-prompt-set h5{margin:0 0 8px}.util-mini-card{margin:0 0 10px;padding:10px 12px;border:1px solid #e5e7eb;border-radius:8px;background:#fff}.util-mini-card h5{margin:0 0 6px}.util-template-block{margin:0 0 10px;padding:10px 12px;border:1px dashed #cbd5e1;border-left:3px solid #fbbf24;border-radius:8px;background:#fff}.util-template-block h5{margin:0 0 6px}.util-template-note-line{height:1.1rem;border-bottom:1px dotted #cbd5e1;margin-top:8px}.util-structured-block{margin:0 0 12px;padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;background:
```

Render markers: Study orientation=true; Intellectual frame=false; Connection=true

## 7. Slice 30-1 rubric (manual — live Factory)

| Criterion | Score | Notes |
|-----------|-------|-------|
| Learner understands purpose quickly | **Yes** | Intro section + A1 `study_orientation`; topic-specific Marx framing |
| Activities feel sequentially connected | **Yes** | Bridges on A2–A4 in composed page |
| No facilitator choreography | **Partial** (live) | DLA `facilitator_moves` empty; **GAM text** had “Facilitator use:” — **30-1c** adds generation guard; live capture predates guard |
| Topic-specific orientation | **Yes** | Marx life, Manifesto/Capital, contemporary application — no module welcome |
| Bridges useful vs boilerplate | **Partial** | Bridges present but generic (“builds on your understanding…”) |

**Anti-patterns:** No “Welcome to this module” / “In this session”; no timing choreography in DLA.  
**Crowding:** Intro paragraph + A1 `study_orientation` + preambles — some repetition.  
**Missing:** `intellectual_frame` not generated.

## 8. Comparison vs pre-30-1 fixtures

```json
{
  "marx_dla_procedural": {
    "activities": 2,
    "activity_preamble_count": 0,
    "facilitator_moves_count": 2,
    "orientation_fields": 0
  },
  "live_dla": {
    "activities": 4,
    "activity_preamble_count": 4,
    "study_orientation_count": 1,
    "intellectual_coherence_bridge_count": 0
  },
  "marx_self_study_page_fixture": {
    "activities_in_page": 2,
    "had_framing_fields": false
  },
  "qualitative": "Live DLA should show more framing/orientation than marx-dla-procedural-output.json; compare HTML for learner-visible coherence."
}
```

## 9. Layer verdict

| Layer | Verdict |
|-------|---------|
| E | ✅ |
| G | ✅ (DLA strong; GAM facilitator voice **leaked in this capture** — mitigated by 30-1c) |
| C | ✅ (page retains orientation fields; intro duplication) |
| R | ✅ (30-1b — fields render when present on activity rows) |

## 10. Qualitative comparison vs pre-30-1 fixtures

| Dimension | `marx-dla-procedural-output.json` | Live Factory (2026-06-01) |
|-----------|-----------------------------------|---------------------------|
| `activity_preamble` | 0 / 2 activities | **4 / 4** |
| `study_orientation` | none | **A1** (+ intro section prose) |
| `intellectual_coherence_bridge` | none | **A2–A4** on composed page |
| `facilitator_moves` in DLA | 2 activities with timing choreography | **empty** in DLA |
| GAM / materials | n/a | **“Facilitator use:”** sections (regression risk) |

**Verdict:** Material improvement in learner-facing activity framing and coherence vs procedural baseline. GAM step wrote facilitator-oriented material notes in this run; **30-1c** addresses via prompt guard (R30-008).

**Evaluator (30-1c):** Live `marx-learning-activities.json` + `marx-page.json` pass `evaluatePelOrientationContractSatisfaction` preamble/bridge/study_orientation counts; historical GAM text would flag `facilitator_facing_language` if passed as `gamText`.

## 11. Artefacts

| File | Description |
|------|-------------|
| `live-artefacts/marx-learning-activities.json` | DLA output |
| `live-artefacts/marx-page.json` | Composed page |
| `live-artefacts/marx-render.html` | HTML excerpt (truncated) |
| `sprint-30-probe-capture.json` | Full capture bundle |

## 12. Weaknesses / corrective status

| Issue | Likely layer | Status |
|-------|--------------|--------|
| GAM “Facilitator use:” blocks | **G** (GAM prompt / model) | **30-1c shipped** — `buildSelfDirectedGamLearnerVoicePromptBlock`; re-run probe to verify model compliance |
| Missing `intellectual_frame` | **Model compliance** | **Open** — optional field; evaluator does not require |
| Duplicate study orientation (intro + A1) | **Model / Design Page** | **Open** — Design Page / model discipline |
| Generic bridge wording | **Model compliance** | **Open** — 30-2+ or prompt examples |
| DLA orientation field gaps | **Model compliance** | **Warn only** — `evaluatePelOrientationContractSatisfaction` (30-1c); no runtime block |

**Not required:** Further renderer changes (30-1b sufficient). Composition merge path OK when page uses Learning Activities rows.
