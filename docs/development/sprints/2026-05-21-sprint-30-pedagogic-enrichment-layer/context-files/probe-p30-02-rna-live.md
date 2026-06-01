# P30-02 — Factory live validation (Sprint 30 Phase 1)

**Captured:** 2026-06-01T07:53:54Z (pre–**30-1c** prompt guard)  
**Method:** LD pack prompts + `applyWorkflowStepRuntimePromptAugmentations` (cognition → self-directed → PEC) + OpenAI `gpt-4.1-mini` + `applyPedagogicCognitionSemanticsToComposedPage` + `buildUtilityStructuredHtmlForTest`.

**Post–30-1c (2026-06-01):** Same GAM learner voice guard and `evaluatePelOrientationContractSatisfaction` as P30-01 (R30-008). Live artefacts unchanged until probe re-run.

## 1. Brief

| Field | Value |
|-------|--------|
| Goal | create a one hour self-study session for undergraduate students based on uploaded transcript |
| Inputs | Uploaded lecture transcript on RNA viruses and hepatitis C (HCV).  Transcript excerpt:  RNA viruses carry RNA genomes. Positive-sense RNA can be translated directly; negative-sense RNA requires virion |
| Outputs | Learner-facing page |
| Starting artefact | provided_source_content |

## 2. Resolved factors

```json
{
  "explicit": {
    "desired_outputs": "Learner-facing page",
    "input_strategy": "provided_source_content",
    "session_materials": [
      "page"
    ],
    "learner_level": "undergraduate",
    "delivery_context": "self_directed",
    "page_profile": "learner",
    "delivery_mode": "async",
    "topic": "RNA viruses and hepatitis C (HCV)",
    "workshop_subject": "RNA viruses and hepatitis C (HCV)",
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
    ],
    "topic": "RNA viruses and hepatitis C (HCV)",
    "workshop_subject": "RNA viruses and hepatitis C (HCV)"
  }
}
```

## 3. Workflow topology

Normalize Content → Model Knowledge → Define Learning Outcomes → Design Learning Activities → Generate Activity Materials → Construct Learning Sequence → Design Page

Runtime prompts included PEL: DLA=true, Design Page=true

## 4. DLA orientation fields

```json
[
  {
    "activity_id": "A1",
    "title": "Understanding RNA Virus Genome Types and Replication",
    "activity_preamble": "RNA viruses differ in how their genomes are interpreted and replicated. Understanding these differences is crucial to grasping viral biology and treatment approaches."
  },
  {
    "activity_id": "A2",
    "title": "Role of Host microRNA-122 in Hepatitis C Virus Stability",
    "activity_preamble": "Host factors can influence viral replication. The interaction between microRNA-122 and HCV's 5' UTR is a key example of how host molecules support virus stability."
  },
  {
    "activity_id": "A3",
    "title": "Identifying the Function of NS5B in HCV Replication",
    "activity_preamble": "Viral replication depends on specialized enzymes. NS5B is a critical protein that enables HCV to copy its RNA genome."
  },
  {
    "activity_id": "A4",
    "title": "Distinguishing Hepatitis C Virus from Other RNA Viruses",
    "activity_preamble": "Misunderstandings about viruses can hinder learning. Clarifying how Hepatitis C virus differs from other RNA viruses helps solidify accurate knowledge."
  }
]
```

## 5. Composed page orientation fields (post-merge)

**Artefact:** `context-files/live-artefacts/rna-page.json`

```json
[
  {
    "activity_id": "A1",
    "study_orientation": "This first activity introduces… positive-sense and negative-sense RNA viruses… HCV replication…",
    "activity_preamble": "RNA viruses differ in how their genomes are interpreted…"
  },
  {
    "activity_id": "A2",
    "intellectual_coherence_bridge": "Building on understanding RNA virus replication, this activity explores… microRNA-122…"
  },
  {
    "activity_id": "A3",
    "intellectual_coherence_bridge": "This activity extends your understanding… NS5B…"
  },
  {
    "activity_id": "A4",
    "intellectual_coherence_bridge": "This final activity consolidates… misconceptions… HCV and other RNA viruses."
  }
]
```

Intro section prose references **HCV**, replication, and misconception focus (topic-faithful).

## 6. Rendered HTML excerpt

```html
<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" /><title>Self-Directed Study: RNA Viruses and Hepatitis C (HCV)</title><style>body{font-family:Segoe UI,Arial,sans-serif;margin:24px auto;padding:0 8px;max-width:920px;color:#111827;line-height:1.65}h1{margin:0 0 10px;font-size:1.9rem;line-height:1.25}h2{margin:28px 0 10px;font-size:1.2rem;line-height:1.35}h3{margin:18px 0 8px;font-size:1rem}h4{margin:12px 0 8px;font-size:.95rem;color:#374151}p{margin:0 0 12px}ul{margin:0 0 14px 20px;padding:0}li{margin:0 0 6px}section{margin:0 0 16px}table{width:100%;border-collapse:collapse;margin:10px 0 16px}th,td{border:1px solid #e5e7eb;padding:10px 12px;text-align:left;vertical-align:top}th{background:#f9fafb;font-weight:600}tbody tr:nth-child(even){background:#fcfcfd}tbody tr{min-height:2.2rem}.util-task-block{border:1px solid #dbe4f0;border-radius:12px;padding:16px;margin:14px 0;background:#fff;box-shadow:0 2px 6px rgba(17,24,39,.04)}.util-task-block p strong{line-height:1.4}.util-activity-header{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;margin-bottom:6px}.util-activity-header h3{margin:0}.util-activity-task{margin:0 0 12px}.util-badge-row{display:flex;gap:6px;flex-wrap:wrap}.util-badge{display:inline-block;border:1px solid #dbe4f0;background:#f8fafc;color:#374151;border-radius:999px;padding:2px 10px;font-size:.78rem;font-weight:600}.util-badge-time{background:#eff6ff;border-color:#bfdbfe;color:#1d4ed8}.util-badge-group{background:#f0fdf4;border-color:#bbf7d0;color:#166534}.util-section-heading{display:flex;align-items:center;gap:.55rem;margin-bottom:8px}h2.util-section-heading{margin:22px 0 6px}.util-icon-heading{display:flex;align-items:flex-start;gap:.6rem}.util-icon-heading>span,.util-icon-heading>strong{flex:1;min-width:0}.util-material-icon{font-size:.88em;line-height:1;flex-shrink:0;width:1.05em;text-align:center;margin-top:.18em}.util-section-heading .util-section-icon,.util-section-heading .util-material-icon{margin-top:0;font-size:.95em;width:1.15em}.util-section-icon{margin-right:0}.util-section-icon--overview{color:#475569}.util-section-icon--learning-purpose{color:#2563eb}.util-section-icon--knowledge-summary{color:#d97706}.util-section-icon--learning-activities{color:#6366f1}.util-section-icon--assessment{color:#0891b2}.util-section-icon--study-tips{color:#059669}.util-section-icon--default{color:#64748b}.util-task-card-icon{color:#6366f1}.util-scenario-card-icon{color:#0f766e}.util-prompt-set-icon{color:#2563eb}.util-template-icon{color:#b45309}.util-table-icon{color:#475569}.util-output-icon{color:#16a34a}.util-support-note-icon{color:#64748b}.util-activity-task-icon{color:#334155}.util-meta-icon{color:#64748b}.util-strategy-icon{color:#6b7280}.util-generic-material-icon{color:#64748b}.util-visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.util-material-heading{margin:14px 0 10px;font-size:.95rem;line-height:1.35}.util-material-heading--plain{margin:10px 0 8px;font-weight:600;color:#4b5563}.util-task-block h4.util-material-heading{margin:12px 0 8px}.util-task-block h4.util-material-heading+.util-card-grid,.util-task-block h4.util-material-heading+.util-scenario-list,.util-task-block h4.util-material-heading+.util-prompt-set{margin-top:2px}.util-task-block h4.util-material-heading+h4.util-material-heading{margin-top:6px}.util-output-block{margin:10px 0 14px;padding:10px 12px;border:1px solid #e5e7eb;border-left:3px solid #86efac;background:#f9fafb;border-radius:0 8px 8px 0}.util-output-inline{margin:8px 0}.util-line-label{margin:0 0 6px;color:#334155}.util-card-subheading{margin:8px 0 6px;font-size:.95rem;color:#374151;font-weight:600}.util-session-step{border-style:dashed;background:#f9fafb}.util-slide{border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin:10px 0}.util-scenario-list{margin:8px 0 14px;padding-left:0}.util-scenario-card{margin:0 0 12px;padding:14px 16px;border:1px solid #e5e7eb;border-left:3px solid #2dd4bf;border-radius:8px;background:#fafafa}.util-scenario-card:last-child{margin-bottom:0}.util-scenario-card h3,.util-scenario-card h4{margin:0 0 8px;font-size:1rem}.util-scenario-title{margin:0 0 10px;font-size:1rem;line-height:1.35;color:#374151;font-weight:600}.util-stage-list{display:grid;gap:10px}.util-stage-card{border-left:3px solid #93c5fd;background:#fff;border-radius:8px;padding:10px 12px}.util-stage-card h5{margin:0 0 6px}.util-material-card{margin:0 0 12px;padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa}.util-material-card:last-child{margin-bottom:0}.util-material-card h4,.util-material-card h5{margin:0 0 8px}.util-card-grid{display:grid;gap:12px;margin:10px 0 14px}.util-task-card{margin:0 0 12px;padding:14px 16px;border:1px solid #e5e7eb;border-left:3px solid #a5b4fc;border-radius:8px;background:#fafafa}.util-task-card h5,.util-task-card-heading{margin:0 0 10px;font-size:.95rem;font-weight:600;color:#374151;line-height:1.35}.util-prompt-set{margin:10px 0 14px;padding:12px 14px;border:1px solid #e0e7ff;border-left:3px solid #93c5fd;border-radius:8px;background:#f8fafc}.util-prompt-set h5{margin:0 0 8px}.util-mini-card{margin:0 0 10px;padding:10px 12px;border:1px solid #e5e7eb;border-radius:8px;background:#fff}.util-mini-card h5{margin:0 0 6px}.util-template-block{margin:0 0 10px;padding:10px 12px;border:1px dashed #cbd5e1;border-left:3px solid #fbbf24;border-radius:8px;background:#fff}.util-template-block h5{margin:0 0 6px}.util-template-note-line{height:1.1rem;border-bottom:1px dotted #cbd5e1;margin-top:8px}.util-structured-block{margin:0 0 12px;padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa}.util-structured-
```

Render markers: Study orientation=true; Intellectual frame=false; Connection=true

## 7. Slice 30-1 rubric (manual — live Factory)

| Criterion | Score | Notes |
|-----------|-------|-------|
| Learner understands purpose quickly | **Yes** | Intro + A1 `study_orientation` (composed page); HCV/RNA named |
| Activities feel sequentially connected | **Yes** | Bridges A2–A4 |
| No facilitator choreography | **Partial** (live) | DLA clean; GAM facilitator voice risk — **30-1c** guard on self-directed GAM prompts |
| Topic-specific orientation | **Yes** | RNA/HCV/miR-122/NS5B — **not** “the uploaded transcript” as topic |
| Bridges useful vs boilerplate | **Partial** | Present; somewhat template-like |

**DLA-only gap:** DLA JSON lacked `study_orientation` / bridges; **Design Page composed them** — model compliance split across steps.

## 8. Comparison vs pre-30-1 fixtures

```json
{
  "note": "RNA — no pre-30-1 Marx fixture pair"
}
```

## 9. Layer verdict

| Layer | Verdict |
|-------|---------|
| E | ✅ (`topic`: RNA viruses and hepatitis C) |
| G | ✅ (PEL in prompts; page step compensated weak DLA orientation) |
| C | ✅ |
| R | ✅ |

## 10. Qualitative notes

- **vs brief-defaults tests:** `delivery_context: self_directed`, `input_strategy: provided_source_content` confirmed live.
- **Transcript fidelity:** Materials and tasks reference HCV, NS5B, miR-122, quasispecies misconceptions — good Phase 1 outcome for P30-02.
- **Improvement over sparse fixtures:** Stronger multi-activity coherence than topology-only regression fixtures.

## 11. Artefacts

| File | Description |
|------|-------------|
| `live-artefacts/rna-learning-activities.json` | DLA |
| `live-artefacts/rna-page.json` | Composed page |
| `live-artefacts/rna-render.html` | HTML excerpt |

## 12. Weaknesses / corrective status

| Issue | Likely layer | Status |
|-------|--------------|--------|
| DLA omits orientation fields; Design Page adds them | **Model compliance** / step split | **30-1c** — `evaluatePelOrientationContractSatisfaction` flags missing `study_orientation`/bridges on DLA (warn/test); no runtime block |
| GAM facilitator voice | **G** | **30-1c** — self-directed GAM material voice guard |
| Missing `intellectual_frame` | Model | **Open** |
| Orientation crowding (intro + fields + cognition cues) | Model | **Open** |

Do **not** start 30-2 `reasoning_contract` until team accepts Phase 1 residual model-compliance risk (R30-008).
