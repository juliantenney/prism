# Sprint 59 — First Audit Cross-Workflow Summary

**Date:** 2026-07-14  
**Sample:** Historical first-audit pass (3 workflows)  
**Rubric:** `rubric-v0.1` (pilot — not calibrated)  
**Evidence:** Stage captures only; assembly/render treated as transient (not defects)

**Later supersession (same day / sprint):** Follow-on work (constraint audit, Iterations 1–7, heteroscedasticity vs enzymes, instructional archetype audit) reframes systematic thinness as **soft enforcement + instructional-archetype support asymmetry**. This document remains the historical first-pass record — see [instructional-archetype-audit.md](instructional-archetype-audit.md) for the locked root-cause conclusion.

| Sample | Workflow | Type | Captures reviewed |
| ------ | -------- | ---- | ----------------- |
| S59-FA-01 | WasMarxRight | Self-study / simple | EP, DLA, GAM, items, LS, DP |
| S59-FA-02 | Introduction to Educational Psychology | Self-study / simple | EP, DLA, GAM, items, LS, DP |
| S59-FA-03 | Was Marx Right? Test | Workshop / simple | EP, DLA, GAM, LS, DP (no assess) |

Per-workflow detail: [findings/](findings/)

---

## 1. Recurring strengths

| Pattern | Evidence | Samples |
| ------- | -------- | ------- |
| **DLA instructional scaffolding** | Numbered learner tasks (5–7 steps), explicit `expected_output`, progressive activity arc | All 3 |
| **Activity–material structure** | 4–8 materials per activity; tables, checklists, templates support guided practice | All 3 |
| **LS sequencing metadata** | Ordered activities, timeline phases, 60-minute framing | All 3 |
| **Partial DP knowledge_summary** | Substantive prose when present (~227–280 words) | FA-01, FA-03 |
| **Assessment item alignment** (where items exist) | MCQ stems reference session/material concepts; plausible distractors | FA-01, FA-02 |
| **Worked-example peaks** | Workshop Marx A1-M2 shows multi-step model — demonstrates generation can produce adequate examples | FA-03 only |

---

## 2. Recurring content thinness

| Pattern | Typical evidence | Primary class | Frequency |
| ------- | ---------------- | ------------- | --------- |
| **GAM body length** | 100% of materials &lt;80 words in FA-01/02; 84% in FA-03 | A | 3/3 |
| **Explanatory text** | Bullet/glossary style; rarely multi-paragraph teaching | A | 3/3 |
| **Scenarios / cases** | Named actors only; minimal stakes, data, or decision framing (18–39 words) | A | 3/3 |
| **Worked examples (typical)** | Outline bullets or single-paragraph skips (21–44 words) except FA-03 A1 | A | 3/3 |
| **DP wrapper incompleteness** | knowledge_summary only; no overview, learning_purpose, study_tips | A | 2/2 with page_synthesis |
| **DP wrong partial (FA-02)** | DP emits `learning_sequence` instead of `page_synthesis` | A | 1/3 |
| **Assessment feedback** | Zero items include feedback/rationale | A | 2/2 with items |

---

## 3. Unsupported learner actions

| Pattern | Example | Class |
| ------- | ------- | ----- |
| Production tasks exceed explanation depth | DLA: “three historical conditions… linked to critique” vs ~64-word GAM text (FA-01 A1) | A |
| Analysis without adequate scenario context | DLA: “justify which theory visible in each scenario” vs ~31-word cases (FA-02 A2) | A |
| Independent explanation without model | DLA: explain retrieval/spaced practice; GAM A3 has no worked example (FA-02) | A |
| Concept integration without worked model | DLA A2 tasks; GAM lacks worked example (FA-03) | A |

Instructional-flow review: **support gap = Y on all 15 activities** across three workflows (explanation and/or example often **Partial**, never **Absent** on guided scaffolds).

---

## 4. Assessment observations

| Topic | Finding |
| ----- | ------- |
| **Assessment design** | Not assessable on any workflow (no design stage). Recorded; not classified as defect. |
| **Items present** | 5 MCQ each on FA-01 and FA-02; stems generally answerable from GAM/DLA content |
| **Feedback / rationale** | Absent on all items — consistent Class A |
| **Item diversity** | MCQ only; matches brief constraints |
| **Alignment chains** | Q1–Q3 traceable to activities/materials on FA-01/02; material thinness limits “Partial” answerability on application items |
| **Missing assessment (FA-03)** | Workflow has no assess step — Class F (expected variation) |

---

## 5. Workload observations

| Sample | Stated duration | Activity load | Assessment | Verdict |
| ------ | --------------- | ------------- | ---------- | ------- |
| FA-01 | 60 min self-study | 5 production activities | 5 MCQ | **questionable** |
| FA-02 | 60 min | LS timeline = 60 min activities alone | 5 MCQ | **unrealistic** |
| FA-03 | 60 min workshop | 5 production activities | none | **questionable** |

LS timelines allocate full duration to activities, leaving no explicit time for assessment or synthesis in FA-01/02.

---

## 6. Instructional-flow observations

Dominant arc across workflows:

```
Partial explanation → Partial example → Present guided practice → Present/Partial independent practice → (Assessment if step exists)
```

- **Guided practice** (tables, checklists, cards) is the strongest generated layer.
- **Explanation and example** are systematically weaker than **DLA task demands**.
- **Independent practice** is frequently specified in DLA before materials provide adequate models (especially FA-02 A3, FA-03 A2).

---

## 7. Rubric ambiguities discovered (pilot)

| Ambiguity | Why it matters | Suggested calibration action |
| --------- | -------------- | ------------------------------ |
| **DLA vs GAM when tasks reference thin materials** | Score activity instructions high (3) while support gap is GAM/A | Keep separate scores; use instructional-flow table for support gaps |
| **Table/checklist as “explanation”** | GAM tables carry structure but not teaching prose | Rubric: tables count toward guided practice, not explanatory text word count |
| **EP shell vs stage partials** | EP may include empty `page_synthesis`; DP owns wrapper | Score DP capture only for knowledge_summary |
| **LS timeline vs learning journey** | LS has sequencing; rubric expects overview/purpose at DP | Score journey as Partial when LS only; do not double-count LS at DP |
| **Worked example threshold** | FA-03 A1-M2 meets hypothesis; most others do not | Validate whether ≥3 steps + reasoning is sufficient regardless of word count |
| **Scenario vs case study** | Generated “scenarios” are often case labels | Treat as scenario type; case study bar may rarely apply |
| **Assessment without design stage** | Cannot review design intent formally | Keep items review separate; document “not assessable” consistently |
| **Workshop vs self-study same topic** | FA-01 vs FA-03 differ on worked-example depth | Profile may affect GAM; not yet enough samples to confirm |

---

## 8. Evidence limitations

| Limitation | Impact |
| ---------- | ------ |
| LO, LC, KM captures empty on all three | Cannot audit upstream content generation; EP carries embedded LOs only |
| No assessment-design stage | Design review skipped by workflow shape, not absence of content |
| No persisted assembled JSON / HTML | No Class B/C findings; by design for this audit |
| Single discipline cluster (humanities/social + ed psych) | No STEM/transcript/short-lesson coverage |
| Pilot n=3 | Patterns are recurring but not statistically generalised |

---

## 9. Patterns to test in future workflows

See [FIRST-AUDIT-HYPOTHESES.md](FIRST-AUDIT-HYPOTHESES.md).

---

## 10. Audit readiness recommendation

### Rubric usability

**Usable for pilot with documented ambiguities.** Scores 1–4 discriminated meaningfully between knowledge_summary (3), scenarios (1), DLA instructions (3), and feedback (1). Instructional-flow table added essential signal beyond rubric scores alone.

### Calibration concerns

1. Revise **explanatory text** scoring guidance to exclude scaffold-only tables from word-count thresholds.
2. Confirm **worked-example** adequacy criteria using step structure vs word count (FA-03 A1-M2 vs FA-01 A3-M1).
3. Document **DP partial variance** (page_synthesis vs learning_sequence mis-emission) as generation observation, not assembly.
4. Add explicit **workload realism** note when LS timeline equals full session duration.

### Process adjustments before larger sample

| Adjustment | Rationale |
| ---------- | --------- |
| Keep **instructional-flow review mandatory** | Surfaces support gaps rubric alone misses |
| Record **material body word counts** descriptively | Supports thinness findings without new scores |
| Maintain **assessment design N/A** rule | Avoid false defects |
| Add **profile/delivery** column to register | FA-01 vs FA-03 suggests profile may affect GAM |
| Do **not** require assembled/HTML for generation audit | Aligns pack with architecture; update inventory doc if still stating otherwise |

### Proceed to larger sample?

**Yes, with calibration log update (`rubric-v0.1` → `v0.2` hypotheses)** after reviewing this summary. Next samples should prioritise: transcript-complete, STEM, short lesson, assessment-design stage, and profile contrast — without changing prompts or architecture.

---

## Finding index

| ID | Sample | Summary |
| -- | ------ | ------- |
| FA01-001–007 | WasMarxRight | GAM thinness, scenarios, DLA–material gap, DP wrapper, no feedback |
| FA02-001–005 | Ed Psych | DP wrong partial, GAM thinness, workload unrealistic, no feedback |
| FA03-001–005 | Marx Test | Thin GAM except A1 example; no assessment (expected) |

No Class B, C, or D findings in first audit.
