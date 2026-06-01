# P30-01 — Factory live validation (Sprint 30 Phase 2)

**Captured:** 2026-06-01T08:44:01Z (Factory re-run post–30-2b; composition path includes **30-2c** row sanitiser via `applyPedagogicCognitionSemanticsToComposedPage`)  
**30-2b:** GAM text passed through `sanitizeSelfDirectedGamMaterialsOutput` ([R30-011](../review-log.md)).  
**30-2c:** Page activity rows sanitised before render ([R30-012](../review-log.md)); probe audits `pageRowSanitization`.  
**Method:** LD pack prompts + `applyWorkflowStepRuntimePromptAugmentations` (cognition → self-directed → PEC) + OpenAI `gpt-4.1-mini` + GAM sanitiser + `applyPedagogicCognitionSemanticsToComposedPage` + `buildUtilityStructuredHtmlForTest`.

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

Runtime PEC in prompts: DLA orientation=true, DLA reasoning=true, GAM reasoning=true, Design Page orientation=true (reasoning block on DP=false)

## 4. DLA reasoning fields (Phase 2)

```json
[
  {
    "activity_id": "A1",
    "title": "Chronological Analysis of Karl Marx's Life Phases",
    "learner_task": "1. Arrange the provided unordered list of Karl Marx's life events chronologically.\n2. For each life phase, write a brief…",
    "reasoning_orientation": "Chronological sequencing and causal reasoning to connect life events with intellectual development.",
    "self_explanation_prompt": "Before checking your timeline, explain in your own words how one key life event might have shaped Marx's thinking."
  },
  {
    "activity_id": "A2",
    "title": "Cause-and-Effect Mapping of Marx's Theoretical Developments",
    "learner_task": "Using the provided cause-effect template, match each historical event with the corresponding Marxist theoretical develop…",
    "reasoning_orientation": "Mechanism tracing and causal inference to understand how external events shaped theoretical ideas.",
    "self_explanation_prompt": "Before finalizing your map, summarize why one specific historical event led to a particular Marxist theory."
  },
  {
    "activity_id": "A3",
    "title": "Comparative Analysis of The Communist Manifesto and Das Kapital",
    "learner_task": "Complete the comparison table by filling in the purpose, key theme, and one major difference for each work based on the …",
    "reasoning_orientation": "Textual comparison focusing on argument structure, themes, and intended impact rather than summary.",
    "argument_structure_hint": "For each work: identify one central claim, cite a supporting passage, and note one implication for Marxist theory or practice.",
    "self_explanation_prompt": "Before reviewing the model comparison, write a sentence on which work you find more compelling and why.",
    "conceptual_contrast_prompt": "Contrast the revolutionary call in The Communist Manifesto with the systematic economic critique in Das Kapital, avoiding the common error of treating them as identical."
  },
  {
    "activity_id": "A4",
    "title": "Applying Core Marxist Concepts to Contemporary Issues",
    "learner_task": "1. Select a contemporary issue (e.g., income inequality, labor rights, globalization).\n2. Identify at least two core Mar…",
    "reasoning_orientation": "Conceptual application and critical analysis to connect theory with current real-world phenomena.",
    "self_explanation_prompt": "Before writing your analysis, explain in your own words how one Marxist concept helps illuminate the chosen issue."
  }
]
```

**Evaluator (`evaluatePelReasoningContractSatisfaction`):**

```json
{
  "satisfied": true,
  "missingFields": [],
  "warnings": [],
  "counts": {
    "reasoningOrientationCount": 4,
    "evidencePromptCount": 0,
    "argumentHintCount": 1,
    "contrastPromptCount": 1,
    "selfExplanationCount": 4
  }
}
```

## 5. GAM materials excerpt

**Artefact:** `live-artefacts/marx-activity-materials.txt`

```
Activity: Chronological Analysis of Karl Marx's Life Phases  
Activity ID: A1  
Mapped outcomes: Analyze the key phases of Karl Marx's life and their influence on his philosophical and political ideas.

Material: M1 (text)  
Purpose: Unordered list of key events in Karl Marx's life  
Content:  
- 1883: Karl Marx dies in London after years of political activism and writing.  
- 1848: Publication of *The Communist Manifesto*, co-authored with Friedrich Engels.  
- 1818: Karl Marx is born on May 5th in Trier, Prussia (now Germany).  
- 1843: Marx marries Jenny von Westphalen, his lifelong partner and supporter.  
- 1849: Marx moves to London after political exile from Germany and France.  
- 1835–1841: Studies law and philosophy at the universities of Bonn and Berlin.  
- 1859: Publication of *A Contribution to the Critique of Political Economy*, marking the beginning of his economic writings.  
- 1867: First volume of *Das Kapital* is published, presenting a detailed critique of capitalism.  
- 1842: Begins work as a journalist in Cologne, writing for radical newspapers.  
- 1871: Marx writes *The Civil War in France*, analyzing the Paris Commune.  
- 1844: Writes the *Economic and Philosophic Manuscripts*, exploring alienation and human nature.  
- 1824–1835: Childhood and early education in Trier, influenced by Enlightenment ideas and the political climate of the time.

---

Activity: Cause-and-Effect Mapping of Marx's Theoretical Developments  
Activity ID: A2  
Mapped outcomes: Explain the cause-and-effect relationships between historical events and Marx's theoretical developments.

Material: M2 (template)  
Purpose: Cause-effect mapping template  
Content:

| Historical Event                        | Marxist Theoretical Development          | Explanation of Causal Link                                                                                       |
|---------------------------------------|------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| 1848 Revolutions                      | Call for proletarian revolution          |                                                                                                                 |
| Industrial Revolution                 | Theory of alienation and exploitation    |                                                                                                                 |
| Rise of capitalism in Europe          | Critique of political economy             |                                                                                                                 |
| Paris Commune (1871)                  | Analysis of class struggle and state power|                                                                                                                 |
| Growth of factory labor and wage system| Concept of commodity fetishism            |                                                                                                                 |
| Censorship and political repression  | Emphasis on revolutionary praxis          |                                                                                                                 |
| Expansion of bourgeois democracy      | Critique of ideology and false consciousness|                                                                                                                 |
| Economic
```

GAM heuristics: {"facilitatorUse":false,"teacherNotes":false,"minutesChoreo":false,"thinkCritically":false,"beforeReread":false,"workedExample":true}

## 6. DLA orientation fields

```json
[
  {
    "activity_id": "A1",
    "title": "Chronological Analysis of Karl Marx's Life Phases",
    "study_orientation": "This page guides you through Karl Marx's life, ideas, and their relevance today. Start by mapping his life phases to understand how his experiences influenced his theories. This foundational step prepares you for deeper analysis and application in subsequent activities.",
    "intellectual_frame": "Thinking as a historian about biographical influence and intellectual development.",
    "activity_preamble": "Understanding the timeline of Marx's life helps reveal how his personal experiences and historical context shaped his ideas. This activity invites you to order key life events and reflect on their influence on his philosophy."
  },
  {
    "activity_id": "A2",
    "title": "Cause-and-Effect Mapping of Marx's Theoretical Developments",
    "intellectual_coherence_bridge": "Building on the timeline of Marx's life, this activity deepens understanding by linking historical context to his theoretical output.",
    "activity_preamble": "Marx's theories emerged in response to specific historical events and social conditions. Tracing these cause-and-effect relationships clarifies why and how his ideas developed."
  },
  {
    "activity_id": "A3",
    "title": "Comparative Analysis of The Communist Manifesto and Das Kapital",
    "intellectual_coherence_bridge": "This activity builds on understanding Marx's life and historical context by focusing on his written legacy and argumentation.",
    "activity_preamble": "Comparing Marx's major works reveals differences in purpose, audience, and argument style. This helps you grasp the scope and focus of his key writings."
  },
  {
    "activity_id": "A4",
    "title": "Applying Core Marxist Concepts to Contemporary Issues",
    "intellectual_coherence_bridge": "This final activity applies your knowledge of Marx's life, context, and writings to analyze present-day challenges.",
    "activity_preamble": "Marxist concepts remain influential in analyzing modern social, economic, and political challenges. Applying these ideas sharpens your critical thinking and relevance of theory."
  }
]
```

## 7. Composed page orientation fields (post-merge)

```json
[]
```

## 8. Rendered HTML excerpt

```html
<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" /><title>Self-Directed Study on Karl Marx: Life, Ideas, and Contemporary Relevance</title><style>body{font-family:Segoe UI,Arial,sans-serif;margin:24px auto;padding:0 8px;max-width:920px;color:#111827;line-height:1.65}h1{margin:0 0 10px;font-size:1.9rem;line-height:1.25}h2{margin:28px 0 10px;font-size:1.2rem;line-height:1.35}h3{margin:18px 0 8px;font-size:1rem}h4{margin:12px 0 8px;font-size:.95rem;color:#374151}p{margin:0 0 12px}ul{margin:0 0 14px 20px;padding:0}li{margin:0 0 6px}section{margin:0 0 16px}table{width:100%;border-collapse:collapse;margin:10px 0 16px}th,td{border:1px solid #e5e7eb;padding:10px 12px;text-align:left;vertical-align:top}th{background:#f9fafb;font-weight:600}tbody tr:nth-child(even){background:#fcfcfd}tbody tr{min-height:2.2rem}.util-task-block{border:1px solid #dbe4f0;border-radius:12px;padding:16px;margin:14px 0;background:#fff;box-shadow:0 2px 6px rgba(17,24,39,.04)}.util-task-block p strong{line-height:1.4}.util-activity-header{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;margin-bottom:6px}.util-activity-header h3{margin:0}.util-activity-task{margin:0 0 12px}.util-badge-row{display:flex;gap:6px;flex-wrap:wrap}.util-badge{display:inline-block;border:1px solid #dbe4f0;background:#f8fafc;color:#374151;border-radius:999px;padding:2px 10px;font-size:.78rem;font-weight:600}.util-badge-time{background:#eff6ff;border-color:#bfdbfe;color:#1d4ed8}.util-badge-group{background:#f0fdf4;border-color:#bbf7d0;color:#166534}.util-section-heading{display:flex;align-items:center;gap:.55rem;margin-bottom:8px}h2.util-section-heading{margin:22px 0 6px}.util-icon-heading{display:flex;align-items:flex-start;gap:.6rem}.util-icon-heading>span,.util-icon-heading>strong{flex:1;min-width:0}.util-material-icon{font-size:.88em;line-height:1;flex-shrink:0;width:1.05em;text-align:center;margin-top:.18em}.util-section-heading .util-section-icon,.util-section-heading .util-material-icon{margin-top:0;font-size:.95em;width:1.15em}.util-section-icon{margin-right:0}.util-section-icon--overview{color:#475569}.util-section-icon--learning-purpose{color:#2563eb}.util-section-icon--knowledge-summary{color:#d97706}.util-section-icon--learning-activities{color:#6366f1}.util-section-icon--assessment{color:#0891b2}.util-section-icon--study-tips{color:#059669}.util-section-icon--default{color:#64748b}.util-task-card-icon{color:#6366f1}.util-scenario-card-icon{color:#0f766e}.util-prompt-set-icon{color:#2563eb}.util-template-icon{color:#b45309}.util-table-icon{color:#475569}.util-output-icon{color:#16a34a}.util-support-note-icon{color:#64748b}.util-activity-task-icon{color:#334155}.util-meta-icon{color:#64748b}.util-strategy-icon{color:#6b7280}.util-generic-material-icon{color:#64748b}.util-visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.util-material-heading{margin:14px 0 10px;font-size:.95rem;line-height:1.35}.util-material-heading--plain{margin:10px 0 8px;font-weight:600;color:#4b5563}.util-task-block h4.util-material-heading{margin:12px 0 8px}.util-task-block h4.util-material-heading+.util-card-grid,.util-task-block h4.util-material-heading+.util-scenario-list,.util-task-block h4.util-material-heading+.util-prompt-set{margin-top:2px}.util-task-block h4.util-material-heading+h4.util-material-heading{margin-top:6px}.util-output-block{margin:10px 0 14px;padding:10px 12px;border:1px solid #e5e7eb;border-left:3px solid #86efac;background:#f9fafb;border-radius:0 8px 8px 0}.util-output-inline{margin:8px 0}.util-line-label{margin:0 0 6px;color:#334155}.util-card-subheading{margin:8px 0 6px;font-size:.95rem;color:#374151;font-weight:600}.util-session-step{border-style:dashed;background:#f9fafb}.util-slide{border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin:10px 0}.util-scenario-list{margin:8px 0 14px;padding-left:0}.util-scenario-card{margin:0 0 12px;padding:14px 16px;border:1px solid #e5e7eb;border-left:3px solid #2dd4bf;border-radius:8px;background:#fafafa}.util-scenario-card:last-child{margin-bottom:0}.util-scenario-card h3,.util-scenario-card h4{margin:0 0 8px;font-size:1rem}.util-scenario-title{margin:0 0 10px;font-size:1rem;line-height:1.35;color:#374151;font-weight:600}.util-stage-list{display:grid;gap:10px}.util-stage-card{border-left:3px solid #93c5fd;background:#fff;border-radius:8px;padding:10px 12px}.util-stage-card h5{margin:0 0 6px}.util-material-card{margin:0 0 12px;padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa}.util-material-card:last-child{margin-bottom:0}.util-material-card h4,.util-material-card h5{margin:0 0 8px}.util-card-grid{display:grid;gap:12px;margin:10px 0 14px}.util-task-card{margin:0 0 12px;padding:14px 16px;border:1px solid #e5e7eb;border-left:3px solid #a5b4fc;border-radius:8px;background:#fafafa}.util-task-card h5,.util-task-card-heading{margin:0 0 10px;font-size:.95rem;font-weight:600;color:#374151;line-height:1.35}.util-prompt-set{margin:10px 0 14px;padding:12px 14px;border:1px solid #e0e7ff;border-left:3px solid #93c5fd;border-radius:8px;background:#f8fafc}.util-prompt-set h5{margin:0 0 8px}.util-mini-card{margin:0 0 10px;padding:10px 12px;border:1px solid #e5e7eb;border-radius:8px;background:#fff}.util-mini-card h5{margin:0 0 6px}.util-template-block{margin:0 0 10px;padding:10px 12px;border:1px dashed #cbd5e1;border-left:3px solid #fbbf24;border-radius:8px;background:#fff}.util-template-block h5{margin:0 0 6px}.util-template-note-line{height:1.1rem;border-bottom:1px dotted #cbd5e1;margin-top:8px}.util-structured-block{margin:0 0 12px;padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;background:#fafaf
```

Render markers (orientation): Study orientation=true; Intellectual frame=true; Connection=true
Render markers (reasoning): How to think=true; self_explanation cognition=true; evidence_use_prompt=false; argument_structure_hint=false; conceptual_contrast_prompt=false; disciplinary_lens=false

## 9. Slice 30-2 rubric (Phase 2 — live)

| Criterion | Score | Notes |
|-----------|-------|-------|
| thinking visible | **Yes** | |
| evidence discipline | **N/A** | |
| argument structure | **Yes** | |
| conceptual contrast | **Yes** | |
| generative retrieval | **Partial** | |
| gam worked support | **Partial** | |
| redundancy | **Yes** | |
| facilitator regression | **Yes** | |

## 10. Slice 30-1 rubric (orientation — live)

| Criterion | Score |
|-----------|-------|
| purpose clear quickly | true |
| sequentially connected | Yes |
| no facilitator choreography | Yes |
| topic specific | Yes |
| bridges useful not boilerplate | Yes |

Anti-patterns detected: {"welcome":false,"inSession":false,"minutesChoreo":false,"uploadedOnly":false}
Field counts: {"studyCount":1,"bridgeCount":3,"preambleCount":4,"activityCount":4}

## 11. Comparison vs pre-30-1 fixtures

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
    "intellectual_coherence_bridge_count": 3
  },
  "marx_self_study_page_fixture": {
    "activities_in_page": 2,
    "had_framing_fields": false
  },
  "qualitative": "Live DLA should show more framing/orientation than marx-dla-procedural-output.json; compare HTML for learner-visible coherence."
}
```

## 12. Layer verdict

| Layer | Verdict |
|-------|---------|
| E | ✅ |
| G (orientation) | ✅ |
| G (reasoning) | ✅ |
| C | ⚠️ |
| R (orientation) | ✅ |
| R (reasoning JSON→HTML) | ✅ **30-2r** (passive passthrough when fields in JSON) |
| G (GAM materials) | ✅ **30-2b** — 0× `Facilitator use:` in saved `marx-activity-materials.txt` |

## 13. Visibility gap assessment (30-2r)

**Closed (R30-010).** `renderActivityFramingForActivity` passively displays PEL reasoning fields when present in activity JSON.

## 14. GAM stabilisation (30-2b)

**Closed (R30-011 / GAP-30-10).** Post-generation `sanitizeSelfDirectedGamMaterialsOutput` applied in probe runner after OpenAI GAM step.

| Check | Result |
|-------|--------|
| `Facilitator use:` in GAM artefact | **0** |
| `phase2Heuristics.facilitatorUse` | **false** |
| Worked support retained | **Yes** — cause→effect sample row, comparison template, biographical list |
| Tables / evidence scaffolds | **Yes** — `\| Historical Event \|` tables present |

Sanitiser strips facilitator headings and short tutor-directed blocks only — **does not rewrite** learner-facing reference prose.

## 15. Design Page row sanitisation (30-2c)

**Closed (R30-012).** `sanitizeSelfDirectedLearnerPageActivityRows` runs at end of `applyPedagogicCognitionSemanticsToComposedPage` (composition path used by probe runner). Strips `facilitator_notes` / `facilitator_note` / `facilitator_moves` and choreographic `support_note` on self-directed learner pages; learner-facing support notes preserved; facilitated/workshop pages no-op.

| Check | Result |
|-------|--------|
| `facilitator_notes` / `facilitator_note` on activity rows | **None** (sanitiser + probe audit) |
| Choreographic `support_note` on rows | **None** |
| Support note HTML from facilitator aliases | **None** when rows clean |
| Probe `pageRowSanitization.clean` | **true** (see `sprint-30-probe-capture.json`) |

## 16. Weaknesses / next slice (proposal only)

**C:** Design Page dropped or altered orientation fields vs DLA — composition merge or model.
**Phase 3 (chartering):** sparse `intellectual_frame`, DLA `argument_structure_hint` compliance — not facilitator row leakage.
