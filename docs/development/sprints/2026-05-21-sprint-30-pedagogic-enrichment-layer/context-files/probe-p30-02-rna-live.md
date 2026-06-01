# P30-02 — Factory live validation (Sprint 30 Phase 2)

**Captured:** 2026-06-01T08:45:53Z (Factory re-run post–30-2b; composition path includes **30-2c** row sanitiser)  
**30-2b:** GAM text passed through `sanitizeSelfDirectedGamMaterialsOutput` ([R30-011](../review-log.md)).  
**30-2c:** Page activity rows sanitised before render ([R30-012](../review-log.md)); probe audits `pageRowSanitization`.  
**Method:** LD pack prompts + `applyWorkflowStepRuntimePromptAugmentations` (cognition → self-directed → PEC) + OpenAI `gpt-4.1-mini` + GAM sanitiser + `applyPedagogicCognitionSemanticsToComposedPage` + `buildUtilityStructuredHtmlForTest`.

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

Runtime PEC in prompts: DLA orientation=true, DLA reasoning=true, GAM reasoning=true, Design Page orientation=true (reasoning block on DP=false)

## 4. DLA reasoning fields (Phase 2)

```json
[
  {
    "activity_id": "A1",
    "title": "Distinguish Positive-Sense and Negative-Sense RNA Viruses",
    "learner_task": "Using the provided reference text, complete the comparison table by filling in the key differences between positive-sens…",
    "reasoning_orientation": "Compare and contrast key mechanistic features of two virus genome types to clarify functional differences.",
    "evidence_use_prompt": "Refer to the provided text to support your table entries with specific terminology and examples.",
    "self_explanation_prompt": "Explain in your own words why positive-sense RNA can be directly translated but negative-sense RNA cannot.",
    "conceptual_contrast_prompt": "Focus on contrasting genome polarity and its impact on translation and replication, avoiding confusion between genome type and virus family."
  },
  {
    "activity_id": "A2",
    "title": "Explore Hepatitis C Virus Features and Host Interaction",
    "learner_task": "Read the HCV overview extract and complete the summary worksheet by listing the virus classification, its replication si…",
    "reasoning_orientation": "Identify and explain biological roles of viral and host factors in HCV replication.",
    "evidence_use_prompt": "Use direct phrases from the extract to support your explanations.",
    "self_explanation_prompt": "Summarize why microRNA-122 is important for HCV replication before checking your worksheet.",
    "conceptual_contrast_prompt": "Distinguish HCV’s host interaction mechanisms from general virus replication strategies."
  },
  {
    "activity_id": "A3",
    "title": "Identify the Role of HCV NS5B Protein in Viral Replication",
    "learner_task": "Read the description of NS5B and answer the guided questions to explain its role and importance in HCV replication.…",
    "reasoning_orientation": "Focus on mechanistic explanation of enzyme function within viral replication.",
    "evidence_use_prompt": "Support your answers with specific terms from the NS5B description.",
    "self_explanation_prompt": "Before answering, try to explain how NS5B contributes to the viral life cycle in your own words.",
    "conceptual_contrast_prompt": "Avoid confusing NS5B with host polymerases or other viral proteins."
  },
  {
    "activity_id": "A4",
    "title": "Clarify Misconceptions: HCV vs Influenza and Retroviruses",
    "learner_task": "Using the misconceptions briefing, complete the correction table by identifying which viruses have segmented genomes or …",
    "reasoning_orientation": "Analyze and contrast virus genome structures and replication strategies to repair misconceptions.",
    "evidence_use_prompt": "Quote or paraphrase key points from the briefing to support your corrections.",
    "self_explanation_prompt": "Before completing the table, write a sentence explaining why HCV is often confused with these other viruses.",
    "conceptual_contrast_prompt": "Focus on contrasting segmentation and integration mechanisms, avoiding conflation of these distinct viral features."
  }
]
```

**Evaluator (`evaluatePelReasoningContractSatisfaction`):**

```json
{
  "satisfied": false,
  "missingFields": [
    "argument_structure_hint"
  ],
  "warnings": [
    "argument_structure_hint expected on compare/evaluate activities"
  ],
  "counts": {
    "reasoningOrientationCount": 4,
    "evidencePromptCount": 4,
    "argumentHintCount": 0,
    "contrastPromptCount": 4,
    "selfExplanationCount": 4
  }
}
```

## 5. GAM materials excerpt

**Artefact:** `live-artefacts/rna-activity-materials.txt`

```
Material: M1 (text)  
Purpose: Reference material on RNA virus genome types  
Content:  
### RNA Virus Genome Types: Positive-Sense vs Negative-Sense RNA

RNA viruses carry their genetic information as RNA genomes. These genomes can be classified based on their polarity:

- **Positive-sense RNA (+RNA):**  
  - The viral RNA genome has the same polarity as messenger RNA (mRNA).  
  - It can be directly recognized by host ribosomes and translated into viral proteins immediately upon infection.  
  - No need for a viral polymerase to generate a complementary strand before translation.  
  - Example viruses: Hepatitis C virus (HCV), Poliovirus, West Nile virus.

- **Negative-sense RNA (−RNA):**  
  - The viral RNA genome is complementary to mRNA and cannot be translated directly.  
  - The virus must carry its own RNA-dependent RNA polymerase (virion polymerase) within the virion to synthesize a positive-sense RNA strand from the negative-sense genome.  
  - Only the synthesized positive-sense RNA can then be translated by host ribosomes.  
  - Example viruses: Influenza virus, Rabies virus, Ebola virus.

**Summary of key differences:**  
| Feature                  | Positive-Sense RNA Virus            | Negative-Sense RNA Virus              |  
|--------------------------|-----------------------------------|-------------------------------------|  
| Genome polarity          | Same as mRNA                      | Complementary to mRNA                |  
| Translation              | Directly translated by host ribosomes | Requires synthesis of complementary +RNA first |  
| Viral polymerase         | Not packaged in virion (usually) | Packaged in virion (essential)      |  
| Example viruses          | Hepatitis C virus, Poliovirus     | Influenza virus, Rabies virus       |

---

Material: M2 (template)  
Purpose: Comparison table template  
Content:  
| Feature                     | Positive-Sense RNA Virus                          | Negative-Sense RNA Virus                          |  
|-----------------------------|-------------------------------------------------|-------------------------------------------------|  
| Genome type                 |                                                 |                                                 |  
| Translation mechanism       |                                                 |                                                 |  
| Replication enzyme required |                                                 |                                                 |  
| Example viruses             |                                                 |                                                 |

---

Activity: Explore Hepatitis C Virus Features and Host Interaction  
Activity ID: A2  
Mapped outcomes: Describe the key features of Hepatitis C virus (HCV), including its classification, replication site, and role of host microRNA-122.

Material: M3 (text)  
Purpose: HCV overview extract  
Content:  
### Overview of Hepatitis C Virus (HCV)

Hepatitis C virus (HCV) is a member of the *Flaviviridae* family and is classified as a positive-sense single-stranded RNA virus. It primarily infects liver cells, known as hepatocytes, where it replicates its genome and produces new virus particles.

A unique feature of HCV replication is its interaction with a host cellular factor called microRNA-122 (miR-122). This small RNA molecule binds to the 5' untranslated region (5' UTR) of the HCV RNA genome. The bin
```

GAM heuristics: {"facilitatorUse":false,"teacherNotes":false,"minutesChoreo":false,"thinkCritically":false,"beforeReread":false,"workedExample":true}

## 6. DLA orientation fields

```json
[
  {
    "activity_id": "A1",
    "title": "Distinguish Positive-Sense and Negative-Sense RNA Viruses",
    "activity_preamble": "Understanding how RNA viruses differ in their genome translation and replication is fundamental to grasping their biology. This activity helps you clarify these differences by organizing key features side-by-side."
  },
  {
    "activity_id": "A2",
    "title": "Explore Hepatitis C Virus Features and Host Interaction",
    "activity_preamble": "Hepatitis C virus has unique features that influence its replication and interaction with the host. This activity guides you to identify these critical aspects and understand their biological significance."
  },
  {
    "activity_id": "A3",
    "title": "Identify the Role of HCV NS5B Protein in Viral Replication",
    "activity_preamble": "The NS5B protein is a key enzyme in HCV replication. Understanding its function helps clarify how the virus copies its RNA genome."
  },
  {
    "activity_id": "A4",
    "title": "Clarify Misconceptions: HCV vs Influenza and Retroviruses",
    "activity_preamble": "Common misconceptions about viral genome organization and replication can hinder understanding. This activity helps you distinguish HCV’s biology from influenza and retroviruses by correcting typical errors."
  }
]
```

## 7. Composed page orientation fields (post-merge)

```json
[]
```

## 8. Rendered HTML excerpt

```html
<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" /><title>Self-Study Session: RNA Viruses and Hepatitis C (HCV)</title><style>body{font-family:Segoe UI,Arial,sans-serif;margin:24px auto;padding:0 8px;max-width:920px;color:#111827;line-height:1.65}h1{margin:0 0 10px;font-size:1.9rem;line-height:1.25}h2{margin:28px 0 10px;font-size:1.2rem;line-height:1.35}h3{margin:18px 0 8px;font-size:1rem}h4{margin:12px 0 8px;font-size:.95rem;color:#374151}p{margin:0 0 12px}ul{margin:0 0 14px 20px;padding:0}li{margin:0 0 6px}section{margin:0 0 16px}table{width:100%;border-collapse:collapse;margin:10px 0 16px}th,td{border:1px solid #e5e7eb;padding:10px 12px;text-align:left;vertical-align:top}th{background:#f9fafb;font-weight:600}tbody tr:nth-child(even){background:#fcfcfd}tbody tr{min-height:2.2rem}.util-task-block{border:1px solid #dbe4f0;border-radius:12px;padding:16px;margin:14px 0;background:#fff;box-shadow:0 2px 6px rgba(17,24,39,.04)}.util-task-block p strong{line-height:1.4}.util-activity-header{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;margin-bottom:6px}.util-activity-header h3{margin:0}.util-activity-task{margin:0 0 12px}.util-badge-row{display:flex;gap:6px;flex-wrap:wrap}.util-badge{display:inline-block;border:1px solid #dbe4f0;background:#f8fafc;color:#374151;border-radius:999px;padding:2px 10px;font-size:.78rem;font-weight:600}.util-badge-time{background:#eff6ff;border-color:#bfdbfe;color:#1d4ed8}.util-badge-group{background:#f0fdf4;border-color:#bbf7d0;color:#166534}.util-section-heading{display:flex;align-items:center;gap:.55rem;margin-bottom:8px}h2.util-section-heading{margin:22px 0 6px}.util-icon-heading{display:flex;align-items:flex-start;gap:.6rem}.util-icon-heading>span,.util-icon-heading>strong{flex:1;min-width:0}.util-material-icon{font-size:.88em;line-height:1;flex-shrink:0;width:1.05em;text-align:center;margin-top:.18em}.util-section-heading .util-section-icon,.util-section-heading .util-material-icon{margin-top:0;font-size:.95em;width:1.15em}.util-section-icon{margin-right:0}.util-section-icon--overview{color:#475569}.util-section-icon--learning-purpose{color:#2563eb}.util-section-icon--knowledge-summary{color:#d97706}.util-section-icon--learning-activities{color:#6366f1}.util-section-icon--assessment{color:#0891b2}.util-section-icon--study-tips{color:#059669}.util-section-icon--default{color:#64748b}.util-task-card-icon{color:#6366f1}.util-scenario-card-icon{color:#0f766e}.util-prompt-set-icon{color:#2563eb}.util-template-icon{color:#b45309}.util-table-icon{color:#475569}.util-output-icon{color:#16a34a}.util-support-note-icon{color:#64748b}.util-activity-task-icon{color:#334155}.util-meta-icon{color:#64748b}.util-strategy-icon{color:#6b7280}.util-generic-material-icon{color:#64748b}.util-visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.util-material-heading{margin:14px 0 10px;font-size:.95rem;line-height:1.35}.util-material-heading--plain{margin:10px 0 8px;font-weight:600;color:#4b5563}.util-task-block h4.util-material-heading{margin:12px 0 8px}.util-task-block h4.util-material-heading+.util-card-grid,.util-task-block h4.util-material-heading+.util-scenario-list,.util-task-block h4.util-material-heading+.util-prompt-set{margin-top:2px}.util-task-block h4.util-material-heading+h4.util-material-heading{margin-top:6px}.util-output-block{margin:10px 0 14px;padding:10px 12px;border:1px solid #e5e7eb;border-left:3px solid #86efac;background:#f9fafb;border-radius:0 8px 8px 0}.util-output-inline{margin:8px 0}.util-line-label{margin:0 0 6px;color:#334155}.util-card-subheading{margin:8px 0 6px;font-size:.95rem;color:#374151;font-weight:600}.util-session-step{border-style:dashed;background:#f9fafb}.util-slide{border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin:10px 0}.util-scenario-list{margin:8px 0 14px;padding-left:0}.util-scenario-card{margin:0 0 12px;padding:14px 16px;border:1px solid #e5e7eb;border-left:3px solid #2dd4bf;border-radius:8px;background:#fafafa}.util-scenario-card:last-child{margin-bottom:0}.util-scenario-card h3,.util-scenario-card h4{margin:0 0 8px;font-size:1rem}.util-scenario-title{margin:0 0 10px;font-size:1rem;line-height:1.35;color:#374151;font-weight:600}.util-stage-list{display:grid;gap:10px}.util-stage-card{border-left:3px solid #93c5fd;background:#fff;border-radius:8px;padding:10px 12px}.util-stage-card h5{margin:0 0 6px}.util-material-card{margin:0 0 12px;padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa}.util-material-card:last-child{margin-bottom:0}.util-material-card h4,.util-material-card h5{margin:0 0 8px}.util-card-grid{display:grid;gap:12px;margin:10px 0 14px}.util-task-card{margin:0 0 12px;padding:14px 16px;border:1px solid #e5e7eb;border-left:3px solid #a5b4fc;border-radius:8px;background:#fafafa}.util-task-card h5,.util-task-card-heading{margin:0 0 10px;font-size:.95rem;font-weight:600;color:#374151;line-height:1.35}.util-prompt-set{margin:10px 0 14px;padding:12px 14px;border:1px solid #e0e7ff;border-left:3px solid #93c5fd;border-radius:8px;background:#f8fafc}.util-prompt-set h5{margin:0 0 8px}.util-mini-card{margin:0 0 10px;padding:10px 12px;border:1px solid #e5e7eb;border-radius:8px;background:#fff}.util-mini-card h5{margin:0 0 6px}.util-template-block{margin:0 0 10px;padding:10px 12px;border:1px dashed #cbd5e1;border-left:3px solid #fbbf24;border-radius:8px;background:#fff}.util-template-block h5{margin:0 0 6px}.util-template-note-line{height:1.1rem;border-bottom:1px dotted #cbd5e1;margin-top:8px}.util-structured-block{margin:0 0 12px;padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa}.util-structured-b
```

Render markers (orientation): Study orientation=false; Intellectual frame=false; Connection=false
Render markers (reasoning): How to think=true; self_explanation cognition=true; evidence_use_prompt=false; argument_structure_hint=false; conceptual_contrast_prompt=false; disciplinary_lens=false

## 9. Slice 30-2 rubric (Phase 2 — live)

| Criterion | Score | Notes |
|-----------|-------|-------|
| thinking visible | **Yes** | |
| evidence discipline | **Yes** | |
| argument structure | **Partial** | |
| conceptual contrast | **Yes** | |
| generative retrieval | **Partial** | |
| gam worked support | **Partial** | |
| redundancy | **Yes** | |
| facilitator regression | **Yes** | |

## 10. Slice 30-1 rubric (orientation — live)

| Criterion | Score |
|-----------|-------|
| purpose clear quickly | Yes |
| sequentially connected | No |
| no facilitator choreography | No |
| topic specific | Yes |
| bridges useful not boilerplate | N/A |

Anti-patterns detected: {"welcome":false,"inSession":false,"minutesChoreo":false,"uploadedOnly":false}
Field counts: {"studyCount":0,"bridgeCount":0,"preambleCount":4,"activityCount":4}

## 11. Comparison vs pre-30-1 fixtures

```json
{
  "note": "RNA — no pre-30-1 Marx fixture pair"
}
```

## 12. Layer verdict

| Layer | Verdict |
|-------|---------|
| E | ✅ |
| G (orientation) | ✅ |
| G (reasoning) | ✅ |
| C | ⚠️ |
| R (orientation) | ⚠️ |
| R (reasoning JSON→HTML) | ✅ **30-2r** (passive passthrough when fields in JSON) |
| G (GAM materials) | ✅ **30-2b** — 0× `Facilitator use:` in saved `rna-activity-materials.txt` |

## 13. Visibility gap assessment (30-2r)

**Closed (R30-010).** Evidence/contrast/lens cues render when present in activity JSON — primary Phase 2 learner-visible value for transcript self-study.

## 14. GAM stabilisation (30-2b)

**Closed (R30-011 / GAP-30-10).** Eight prior `Facilitator use:` blocks (pre–30-2b capture) eliminated by probe-runner sanitisation on this re-run.

| Check | Result |
|-------|--------|
| `Facilitator use:` in GAM artefact | **0** |
| `phase2Heuristics.facilitatorUse` | **false** |
| Reference tables / replication template | **Retained** |
| `facilitator regression` (30-2 rubric) | **Yes** |

## 15. Design Page row sanitisation (30-2c)

**Closed (R30-012).** Same composition sanitiser as P30-01 — activity rows audited by probe runner (`pageRowSanitization`).

| Check | Result |
|-------|--------|
| `facilitator_notes` / `facilitator_note` on activity rows | **None** |
| Choreographic `support_note` | **None** |
| Facilitated/workshop regression | **N/A** — self-directed probe only |

## 16. Weaknesses / next slice (proposal only)

**G/model:** no study_orientation in DLA — prompt compliance gap.
**G/model:** missing intellectual_coherence_bridge on follow-on activities.
**C:** Design Page dropped or altered orientation fields vs DLA — composition merge or model.
**Reasoning evaluator:** `argument_structure_hint` still missing on live DLA (Phase 3 / generation compliance — not 30-2c scope).
