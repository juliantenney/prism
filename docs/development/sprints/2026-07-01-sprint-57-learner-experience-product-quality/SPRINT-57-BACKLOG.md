# Sprint 57 — Backlog

**Status:** Discovery-first — no implementation commitments  
**Theme:** Learner experience and product quality  
**Explicitly excluded:** Architecture audit programmes, prompt rationalisation tranches

Prioritisation emerges from evidence on **fresh exports**. Items below are **candidate workstreams**, not scheduled work.

---

## Learner experience

| ID | Candidate | Discovery question |
| -- | --------- | ------------------ |
| LX-01 | **Perceived duplication** | Where do learners see the same instruction in preamble, materials, and checklist? |
| LX-02 | **Over-scaffolding visibility** | Which scaffold fields feel redundant on the rendered page vs supportive? |
| LX-03 | **Cognitive load** | Where do activity pages overwhelm (wall of text, nested lists, dense tables)? |
| LX-04 | **Page flow** | Does Journey → Activity → Beat → Material read as one arc or disconnected blocks? |
| LX-05 | **Beat progression clarity** | Can learners tell what to do now vs next without re-reading overview? |
| LX-06 | **Closure and synthesis** | Do consolidation / transfer sections feel actionable or boilerplate? |
| LX-07 | **Self-directed orientation** | Does overview/learning_purpose establish stakes without facilitator residue? |

---

## Presentation

| ID | Candidate | Discovery question |
| -- | --------- | ------------------ |
| PR-01 | **Typography hierarchy** | Are h2/h3/body distinct enough for scan-reading? |
| PR-02 | **Table readability** | Pipe tables in HTML — spacing, headers, mobile wrap |
| PR-03 | **Materials card rhythm** | Consistent spacing between material types within a beat |
| PR-04 | **List and step formatting** | Numbered steps vs compressed inline lists (Sprint 38H material shape) |
| PR-05 | **Math display** | TeX block separation from prose; MathJax presentation |
| PR-06 | **Visual affordance figures** | When generated, do figures add value or duplicate tables? |
| PR-07 | **Checklist / Common mistakes** | Diagnostic sections visually distinct from learner task |

---

## Navigation

| ID | Candidate | Discovery question |
| -- | --------- | ------------------ |
| NV-01 | **Section anchors / TOC** | Can learners jump to activities and return to overview? |
| NV-02 | **Progress visibility** | Is completion state legible across multi-activity pages? |
| NV-03 | **Transition prose** | Do wrapper transitions help or repeat journey assimilation content? |
| NV-04 | **Activity boundaries** | Clear visual break between A1, A2, A3 without schema labels |
| NV-05 | **Revision entry points** | Easy path back to prior activity materials from synthesis |

---

## Quality

| ID | Candidate | Discovery question |
| -- | --------- | ------------------ |
| QL-01 | **Cross-activity consistency** | Same material types styled and structured consistently |
| QL-02 | **Instructional clarity** | learner_task vs materials vs expected_output — distinct roles visible? |
| QL-03 | **Learner confidence** | study_tips, support_notes — helpful or generic? |
| QL-04 | **Empty or thin render** | When capture repair filled gaps, is UI honest about limitations? |
| QL-05 | **Corpus comparison** | Marx self-study vs RNA vs inflation workshop — shared UX gaps? |

---

## Evidence sources (suggested)

| Corpus | Use |
| ------ | --- |
| Marx self-study | Long-form self-directed reference |
| RNA/HCV | High material volume; compose stress |
| Inflation workshop | Table-heavy; comparison activities |
| Sprint 55 design principles | Non-negotiable UX constraints |
| Sprint 54 fidelity audit | Separated fidelity loss vs product thinness |

---

## Deferred (documented, not Sprint 57 default)

| Item | Source | Notes |
| ---- | ------ | ----- |
| Design Page journey↔rhetoric dedupe | FINAL-ARCHITECTURE-CLEANUP F-02 | ~0.8–1.2k chars; behaviour risk |
| GAM pack density reduction | GAM-RATIONALISATION-RECOMMENDATION | Evidence-triggered only |
| Sprint 38 exemplar abbreviation | DESIGN-PAGE-REMEDIATION-RESULTS | Optional size tranche |
| DLA ≥80% mandatory pass reliability | SPRINT-56-DLA-STABILISATION-PASS | May need product/capture strategy, not prompt |

---

## How to add items

1. Observe on fresh export with learner heuristics  
2. Record evidence (screenshot, fixture, URL to HTML)  
3. Add row with ID and discovery question  
4. Link implemented slice in closure report — not here

**Do not** add “audit GAM prompts” or “reduce DLA chars” without learner-defect evidence.
