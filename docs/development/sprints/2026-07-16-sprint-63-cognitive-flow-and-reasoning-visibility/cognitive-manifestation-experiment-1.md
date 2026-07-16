# Cognitive Manifestation Experiment 1

**Sprint:** 63 — Cognitive Flow & Reasoning Visibility  
**Type:** Non-production experiment + educational review  
**Date:** 2026-07-16  
**Status:** Complete (discovery)

**Artefacts:** [experiments/experiment-1/](experiments/experiment-1/)  
**Evidence bases:** [activity-type-system-inventory.md](activity-type-system-inventory.md) · [cognitive-activity-manifestation-catalogue.md](cognitive-activity-manifestation-catalogue.md)  
**Fixture:** `tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json`

---

## 1. Purpose

Test whether **existing assembled-page / render-time signals** can support meaningfully differentiated activity manifestations for three cognitively distinct RNA activities **without** schema changes or propagation of GAM-only `instructional_archetype` / `archetype_plan`.

Primary question:

> Can existing assembled-page signals support meaningfully differentiated activity manifestations without schema changes or propagation of GAM-only archetype plans?

---

## 2. Activities and Selection Rationale

| Activity | Title | Why selected |
| -------- | ----- | ------------ |
| **A1** | Classify RNA Virus Genomes | Distinct material signal (`classification_table`); classification cognition |
| **A2** | Analyse HCV Replication Steps | Causal/mechanism cognition; goal-shaped task; `analysis_table` |
| **A6** | Evaluate Outbreak Priorities | Evaluative cognition; `evaluate` episode; decision_table + template + transfer |

These three share a broadly similar **generic** journey grammar (exposition → model → practice → check) while demanding different reasoning operations — matching catalogue Experiment 1 design.

---

## 3. Available Render-Time Signals

Source: fixture JSON + [signal-diagnostic.json](experiments/experiment-1/signal-diagnostic.json).

| Activity | Signal | Value | Available at Render Time? | Evidential Strength |
| -------- | ------ | ----- | ------------------------- | ------------------- |
| A1 | episode archetype | `understand` | Yes | Medium |
| A1 | beat functions | explanation → worked_thinking → guided_practice → verification | Yes | Medium (same shortened list as A2) |
| A1 | material types | text, worked_example, sample_output, **classification_table**, checklist | Yes | **High** |
| A1 | interaction type | *(absent)* | No | — |
| A1 | learner_task | inventory-style study list | Yes | Medium (family cue weak; blocks “Your goal”) |
| A1 | expected_output | Completed classification table and verified checklist | Yes | Medium |
| A1 | title | Classify RNA Virus Genomes | Yes | Medium |
| A1 | reasoning_orientation / self_explanation | *(absent)* | No | — |
| A1 | instructional_archetype | *(absent on materials)* | No | — |
| A2 | episode archetype | `analyse` | Yes | Medium–High |
| A2 | beat functions | explanation → worked_thinking → guided_practice → verification | Yes | Medium (identical to A1) |
| A2 | material types | text, worked_example, **analysis_table**, checklist | Yes | **High** |
| A2 | learner_task | Complete the analysis table using the worked example | Yes | **High** (goal-shaped) |
| A2 | expected_output | Completed analysis table verified with checklist | Yes | Medium (checklist restatement) |
| A2 | title | Analyse HCV Replication Steps | Yes | Medium |
| A2 | instructional_archetype | absent | No | — |
| A6 | episode archetype | `evaluate` | Yes | **High** |
| A6 | beat functions | explanation → worked_judgement → guided_practice → transfer → verification | Yes | **High** |
| A6 | material types | text, scenario, worked_example, **decision_table**, **template**, checklist, transfer_prompt | Yes | **High** |
| A6 | learner_task | inventory of artefacts | Yes | Low for goal; Medium for artefact set |
| A6 | expected_output | Evaluative judgement memo and transfer response | Yes | Medium |
| A6 | title | Evaluate Outbreak Priorities | Yes | Medium |
| A6 | instructional_archetype / archetype_plan | absent | No | — |

---

## 4. Inference Method and Confidence

**Method (experiment-only):** multi-signal convergence per catalogue §7 — require material type **plus** at least one of episode archetype, distinctive beat, or task/title verbs. Never material type alone.

| Activity | Inferred family | Tier | Notes |
| -------- | --------------- | ---- | ----- |
| A1 | **Classification** | **2** | Confirmed — `classification_table` + title/classify language; beats alone insufficient |
| A2 | **Mechanism / causal explanation** | **2** | Confirmed — `analyse` + analysis_table + “using the worked example” + checklist “causal order”; no Tier 1 plan |
| A6 | **Evaluation and judgement** | **2** | Confirmed — `evaluate` + worked_judgement + decision_table + template + transfer |

Provisional classifications in the brief **held**. No contradiction forced a revision.

---

## 5. Generic Baseline

| Artefact | Role |
| -------- | ---- |
| [variant-G-generic-baseline.html](experiments/experiment-1/variant-G-generic-baseline.html) | Full-page production renderer HTML (`buildUtilityStructuredHtmlForTest`) |
| [variant-G-generic-A1-A2-A6.html](experiments/experiment-1/variant-G-generic-A1-A2-A6.html) | Experiment-local generic approximation for A1/A2/A6 side-by-side review |

**Observation:** Production baseline uses Sprint 62 labels (Understand / See it modelled / Your turn / Check your work / Apply elsewhere). A1 and A2 remain highly similar in phase grammar; A6 differs mainly by Transfer + evaluative materials, not by a distinct judgement scaffold grammar.

---

## 6. Classification Manifestation — A1

**Artefact:** [variant-C1-classification-A1.html](experiments/experiment-1/variant-C1-classification-A1.html)

**Applied structure (only where content exists):**

```text
What to do (inventory task retained)
→ Success looks like (checklist)
→ Understand the categories (authored exposition)
→ See a classification modelled (worked_example + sample_output)
→ Classify the cases (classification_table)
→ Check your classification (checklist)
→ Output (expected_output)
```

**Withheld (unsafe / unavailable):** “What separates the categories?” as a claimed principle heading; “Explain your classification”; “Check the boundaries” as separate prompts; “Your goal”.

---

## 7. Causal Manifestation — A2

**Artefact:** [variant-C2-causal-A2.html](experiments/experiment-1/variant-C2-causal-A2.html)

**Applied structure:**

```text
Your goal (authored learner_task)
→ Success looks like (checklist)
→ Start with the mechanism (text)
→ Follow the causal chain (worked_example)
→ Trace the chain (analysis_table)
→ Test your explanation (checklist)
```

**Withheld:** separate `start` condition field; extracted link list; “cross-scale consequence”; duplicate trailing Output (checklist restatement).

---

## 8. Evaluation Manifestation — A6

**Artefact:** [variant-C3-evaluation-A6.html](experiments/experiment-1/variant-C3-evaluation-A6.html)

**Applied structure:**

```text
What to do (inventory retained)
→ Success looks like (checklist)
→ Situation framing (text)
→ Options under constraint (scenario)
→ See a judgement modelled (worked_example)
→ Weigh the options (decision_table)
→ Make your judgement (template Claim/Reasons/Limits)
→ Check your work (checklist)
→ Apply elsewhere (transfer_prompt)
→ Output
```

**Withheld:** invented evaluative question/goal; invented criteria list from `archetype_plan`; “Defend your conclusion” beyond template’s existing Limits heading.

**Combined:** [variant-combined-A1-A2-A6.html](experiments/experiment-1/variant-combined-A1-A2-A6.html)

---

## 9. Manifestation Difference Record

### A1 — Classification vs generic

| Difference | Existing Source Signal | Learner-Facing Purpose | Invented Meaning Risk | Class |
| ---------- | ---------------------- | ---------------------- | --------------------- | ----- |
| Group exposition before models before table | material order + types | Clarifies classify-after-model | Low | grouping |
| Label “Classify the cases” on classification_table | material_type + title verbs | Names the cognitive move | Low | labelling |
| Label “See a classification modelled” | worked_example + sample_output | Separates model from attempt | Low | labelling |
| Suppress “Your goal” | inventory learner_task | Avoid false goal | N/A (preservation) | task framing |
| Omit “organising principle” heading | no authored principle field | Avoid over-claim | Excluded | unsupported |
| Dual checklist (success + verify) | checklist | Orientation + instrument | Low noise risk | grouping |

### A2 — Causal vs generic

| Difference | Source | Purpose | Risk | Class |
| ---------- | ------ | ------- | ---- | ----- |
| “Start with the mechanism” / “Follow the causal chain” / “Trace the chain” | text, worked_example, analysis_table, checklist “causal order” | Sequence mechanism cognition | Low–medium (label stronger than body richness) | labelling |
| Retain “Your goal” | goal-shaped learner_task | Clear product | Low | task framing |
| Omit trailing Output | expected_output ≈ checklist restatement | Dedupe | Low | output framing |
| No extracted causal step list | no archetype_plan.required_links | Avoid invention | Excluded | unsupported |

### A6 — Evaluation vs generic

| Difference | Source | Purpose | Risk | Class |
| ---------- | ------ | ------- | ---- | ----- |
| Group scenario → model → decision → template | material types + evaluate beats | Judgement scaffold | Low | grouping |
| “Weigh the options” / “Make your judgement” | decision_table + template headings | Name evaluative moves | Low | labelling |
| Keep inventory What to do | inventory learner_task | No invented decision question | Low | task framing |
| Template Claim/Reasons/Limits foregrounded | authored template markdown | Justification without new prompts | Low | relationship exposure |
| No invented criteria block | no archetype_plan.criteria | Avoid invention | Excluded | unsupported |

---

## 10. Information Sufficiency Findings

| Desired Element | A1 | A2 | A6 | Information Source | Status |
| --------------- | -- | -- | -- | ------------------ | ------ |
| Organising / mechanism / judgement question | partially | available (task) | unavailable as goal | learner_task / title | A1 partial; A2 available; A6 **unavailable** (inventory) |
| Principle / start / criteria structure | unavailable | unavailable as plan | partial (table column + checklist) | archetype_plan absent; checklist/table | A1/A2 **unavailable** as structure; A6 **partial** |
| Modelled reasoning | available | available | available | worked_example / sample_output | available |
| Learner attempt artefact | available | available | available | classification_table / analysis_table / decision_table+template | available |
| Boundary / causal-link / trade-off explicit structure | unavailable | partial (checklist “causal order”) | partial (checklist trade-offs; scenario options) | checklist / scenario | partial / unsafe to invent lists |
| Self-explanation prompt | unavailable | unavailable | partial (template Limits/Reasons) | cognition fields absent | A1/A2 unavailable; A6 partial |
| Output clarity | available | available | available | expected_output | available |
| Transfer | n/a | n/a | available | transfer_prompt | available |

**Requires upstream for fuller manifestation:** `instructional_archetype` + `archetype_plan`; authored non-inventory goals (A6); optional self_explanation fields (A1/A2).

---

## 11. Educational Review Results

Scores are from an implementer educational review of the HTML variants (1 = weak, 5 = strong). **Not** a multi-reviewer panel (see §12).

| Activity | Variant | Orientation | Sequence | Information | Relationships | Output | Self-Explanation | Coherence | Preservation | Noise |
| -------- | ------- | ----------- | -------- | ----------- | ------------- | ------ | ---------------- | --------- | ------------ | ----- |
| A1 | G | 3 | 3 | 3 | 2 | 3 | 2 | 3 | 5 | 2 |
| A1 | C1 | **4** | **4** | 3 | **3** | 4 | 2 | **4** | 5 | 3 |
| A2 | G | 4 | 3 | 4 | 3 | 4 | 2 | 4 | 5 | 2 |
| A2 | C2 | **5** | **4** | 4 | **4** | 4 | 3 | **5** | 5 | 2 |
| A6 | G | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 5 | 2 |
| A6 | C3 | **4** | **4** | 3 | **4** | 4 | **4** | **4** | 5 | 3 |

### Score-change summary

| Activity | Strongest gains | Little/no gain |
| -------- | --------------- | -------------- |
| A1 | Orientation +1, Sequence +1, Relationships +1, Coherence +1 | Information unchanged (no new principle); self-explanation unchanged |
| A2 | Orientation +1, Sequence +1, Relationships +1, Coherence +1 | Information already relatively strong |
| A6 | Orientation +1, Sequence +1, Relationships +1, Self-explanation +1, Coherence +1 | Information sufficiency still capped by missing authored goal/plan criteria |

**Meaning preservation:** 5 across all variants — bodies unchanged; withheld labels documented.

**Noise:** slight increase on C1/C3 from dual checklist presentation and exclusion notes (acceptable for experiment; production would hide exclusion notes).

---

## 12. Blind Review Results

A formal multi-reviewer blind panel was **not** run in this session.

**Proxy blind procedure (implementer, delayed label check):** Comparing unmarked excerpts of G vs cognitive phase headings for each activity, the cognitive variants made it easier to answer “what kind of thinking?” for A2 and A6; A1 improved moderately. Risk noted: causal labels on A2 could **over-claim** relative to short fixture bodies if a reviewer assumes a full mechanism chain exists in structured form.

**Recommended follow-up:** Run §7 blind questions with 1–2 educational reviewers on `variant-G-generic-A1-A2-A6.html` vs `variant-combined-A1-A2-A6.html` with banners removed.

---

## 13. Unsupported Manifestation Elements

| Element | Why unsupported |
| ------- | --------------- |
| Explicit organising principle (A1) | Not authored as a field; only implicit in short exposition |
| `archetype_plan.start` / `required_links` / `outcome` (A2) | Not on assembled page; GAM-only when instructional archetype used |
| `archetype_plan.question` / `criteria` / `evidence` / `tradeoffs` / `judgement_focus` (A6) | Not on assembled page |
| Invented evaluative goal (A6) | Inventory learner_task — Sprint 62 / catalogue unsafe |
| Self-explanation prompts (A1/A2) | No `self_explanation_prompt` on fixture |
| Boundary-case materials (A1) | Not authored |
| Cross-scale consequence block (A2) | Not authored |

---

## 14. Findings

1. **Render-time signals distinguished A1, A2, and A6 reliably at Tier 2** when material types + episode/beats + task/title were combined. Beats alone would **not** distinguish A1 from A2.
2. **Differentiated manifestation improved cognitive visibility**, especially orientation, sequence, and coherence scores (+1 typical).
3. **Most gain came from grouping and labelling** existing materials into cognitively named phases — not from new content.
4. **Deeper semantic structure** (plan keys, explicit principles, authored goals) was **not** reconstructable safely downstream.
5. **Over-inference risk** is highest on A2 causal phase labels if bodies remain thin; mitigated by exclusion notes and not extracting fake link lists.
6. **A2 gained the most** relative to an already-good Sprint 62 Frame; **A6 gained structural clarity** but remains information-limited on goal/criteria; **A1** gained moderate orientation.
7. **Could not safely generate:** organising principle block; causal link list from plan; evaluative decision question; full criteria framework.
8. **Archetype-plan propagation is justified as Experiment 2**, especially for mechanism and evaluation — not required to get Tier 2 labelling gains.
9. **No schema change is justified by this experiment alone.**
10. **Do not proceed to production renderer design yet** — further renderer *experimentation* (refined prototypes + external educational review) is warranted first.

---

## 15. Implications

| Path | Verdict |
| ---- | ------- |
| No further work | **Reject** — visibility improved without invented meaning |
| Further renderer experimentation | **Recommend** — grouping/labelling works; refine noise; external blind review |
| Archetype-plan propagation prototype | **Recommend next** — Experiment 2; clear GAM→render information gap for Tier 1 structures |
| Schema investigation | **Not yet** — required semantics often exist upstream as instructional archetypes; problem is propagation/absence on this fixture, not proven non-existence system-wide |

---

## 16. Recommendation

1. Keep Experiment 1 artefacts as the Sprint 63 reference for render-time differentiation.  
2. Proceed to **catalogue Experiment 2** (archetype-plan propagation prototype) for one mechanism and one evaluation material.  
3. Optionally run an external blind review on G vs Combined.  
4. **Do not** merge cognitive manifestations into production `app.js` in this sprint.  
5. **Do not** open schema redesign based on Experiment 1 alone.

---

## Appendix — How to inspect

```text
docs/development/sprints/2026-07-16-sprint-63-cognitive-flow-and-reasoning-visibility/experiments/experiment-1/
  variant-G-generic-baseline.html      # production renderer output
  variant-G-generic-A1-A2-A6.html      # generic approximation
  variant-C1-classification-A1.html
  variant-C2-causal-A2.html
  variant-C3-evaluation-A6.html
  variant-combined-A1-A2-A6.html
  signal-diagnostic.json
  build-variants.js                    # regenerate experiment HTML
```

Regenerate: `node build-variants.js` from the experiment-1 directory (or via path from repo root).
