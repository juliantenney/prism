# Sprint 59 — Instructional Archetype Audit

**Document type:** Formal project audit and historical record  
**Date:** 2026-07-14  
**Sprint:** 59 — Instructional Content Richness Audit  
**Status:** Completed investigation (findings locked for handoff)  
**Related:** [GENERATION-CONSTRAINT-AUDIT.md](GENERATION-CONSTRAINT-AUDIT.md), [FIRST-AUDIT-SUMMARY.md](FIRST-AUDIT-SUMMARY.md), [instructional-archetype-framework.md](instructional-archetype-framework.md)

**Follow-on (2026-07-15):** The framework MVP and transfer outcomes (mechanism **PASS**, process **PASS**, mental model **PASS**, GAM Copy delivery fix) are recorded in [instructional-archetype-framework.md](instructional-archetype-framework.md), [roadmap.md](roadmap.md), and [SPRINT-59-CONTEXT-FOR-NEW-CHAT.md](SPRINT-59-CONTEXT-FOR-NEW-CHAT.md). Operationalisation is proposed in [Sprint 60](../2026-07-15-sprint-60-instructional-archetype-operationalisation/SPRINT-60-CHARTER.md). This audit’s root-cause conclusions remain locked.

---

## 1. Background

Sprint 59 began as a **diagnostic** instructional-content richness audit after Sprint 58 closed the partial-page artefact architecture. The aim was to establish evidence-based richness criteria and backlog before renderer redesign or broad prompt campaigns.

Initial work confirmed a systemic Class A pattern across three historical workflows (first audit): nearly all GAM bodies under 80 words; scenarios with names but few stakes; DLA tasks demanding more than materials supplied.

A **generation-constraint audit** then showed that thinness was not explained by PRISM run-mode token caps. Depth rules existed in prompts but v2 GAM capture was **presence-only**; DLA scaffolds were hard-gated while GAM bodies were not.

Remedial **Iteration 1–7** work then introduced and refined `LD-GAM-INSTRUCTIONAL-DEPTH` on the GAM path (causal chains, exemplars, anti-rubric-gaming, anti-exemplar-leakage). A **heteroscedasticity** workflow showed marked instructional improvement and was treated as a success case.

A **biology transfer experiment** (Enzymes and Reaction Rates) then produced structurally strong LO/DLA/LS/DP outputs but substantially weaker GAM teaching materials despite similar specifications. That contrast made the investigation strategic: if quality tracked **domain**, science would need special handling; if it tracked **instructional archetype**, the system needed explicit archetype contracts independent of topic.

---

## 2. Heteroscedasticity findings

### Remedial work performed (Iterations 1–7)

| Iteration | Focus | Outcome |
| --------- | ----- | ------- |
| 1 | Explanatory depth, worked-example stages, scenario richness | Structural sections appeared more consistently |
| 2 | Reasoning quality inside sections | Less hollow labelling; still incomplete causal chains |
| 3 | Explicit multi-step causal-chain completeness | Model often emitted `Cause:` / `Mechanism:` rubric labels |
| 4 | Anti-gaming: stages internal-only; natural prose; exemplars | Rubric labels reduced; intervening process still often skipped |
| 5 | Intervening process + scenario authenticity + method operation | Improved; some meta leakage (“weak/strong explanation”) |
| 6 | Exemplar-driven weak-vs-better pairs | Behaviour improved; exemplars leaked into learner-facing text |
| 7 | Internalise exemplars; subject-matter-first; ban meta-commentary | Exemplar leakage controlled; instructional behaviour retained |

Supporting modules/contracts: `lib/ld-gam-instructional-depth.js`, GAM-PRES-11 in `domain-learning-design-step-patterns.md`, `lib/ld-gam-page-enrich-contract.js`, `lib/ld-materials-copy.js` author role.

### Successful behaviours observed (heteroscedasticity)

When materials aligned with richly supported instructional shapes, outputs reliably showed:

- **Diagnostic reasoning** — residual/diagnostic patterns interpreted with linking logic  
- **Evidence interpretation** — plot/data → meaning → consequence  
- **Comparison** — competing accounts evaluated against evidence  
- **Judgement and evaluation** — preferential conclusions justified  
- **Recommendation generation** — remedies tied to evidence and limits  

### Why heteroscedasticity was treated as a success case

The workflow demonstrated that GAM **can** produce instructor-independent instructional materials after Sprint 59 depth iteration — especially for interpretation → diagnosis → comparison → judgement → recommendation arcs. That established a quality ceiling for later comparison, not a claim that all domains or all material roles were solved.

---

## 3. Enzymes investigation

**Topic:** Enzymes and Reaction Rates  

**Pipeline health:** Learning outcomes, activity progression, DLA scaffolds, page synthesis, and sequencing generally strong and structurally valid.

**GAM weaknesses observed:**

| Pattern | Description |
| ------- | ----------- |
| Compressed explanations | Factual summaries without teaching how effects transmit |
| Weak mechanism teaching | Enzyme–substrate / temperature–pH effects listed rather than taught |
| Missing intermediate causal links | Condition → outcome jumps (e.g. “higher temperature speeds reaction” without collision/activation pathway) |
| Shallow process explanations | Step lists instead of expert reasoning walkthroughs |
| Scenario realism issues | Case labels (Alpha/Beta/Gamma) without numerical or experimental substance |
| Weak worked evaluation | Criteria named without modelled evaluation |
| Spec under-realisation | DLA `specification` phrases (stepped walkthrough; named investigations with numbers) not honoured in bodies |

**Representative mismatch:**

- Spec: *“stepped expert walkthrough showing concept identification, activation-energy reasoning, and conclusion formation with visible intermediate thinking”*  
- Generated: numbered bullets restating catalyst / activation energy / barrier lowering  

- Spec: *“at least two named experimental investigations with distinct enzyme conditions, numerical observations, and contextual information”*  
- Generated: *“Case Alpha… Case Beta… Case Gamma…”* without evidentiary substance  

**Relative pattern:** Evaluation-oriented materials (e.g. A5) were often stronger than pure teaching activities (e.g. A2, A4) — foreshadowing archetype asymmetry rather than wholesale biology failure.

---

## 4. Comparative analysis

| Dimension | Heteroscedasticity | Enzymes |
| --------- | ------------------ | ------- |
| Structural pipeline | Strong | Strong |
| Diagnostic / comparison / evaluation materials | Strong | Mixed–strong where evaluative |
| Mechanism / process / concept exposition | Adequate when framed as diagnostic consequence chains | Weak |
| Transfer of Iteration 1–7 behaviours | Strong on privileged shapes | Incomplete on mechanism teaching |

**Hypothesis shift:**

1. Initial: quality differences might be **domain-specific** (economics vs biology).  
2. Revised (evidence-backed): differences track **instructional-archetype support** — interpret/diagnose/compare/evaluate enjoy denser SP + PRES + (historical) gates; mechanism/process/concept exposition ride thinner contracts.  
3. Secondary: **domain exemplar bias** (economics-heavy DEPTH exemplars) helps already-privileged shapes on heteroscedasticity; not a biology skip path.

---

## 5. Prompt and validation audit findings

**Sources:** GAM pack (`GAM-PRES-*`, `GAM-WB-*`), `lib/instructional-pattern-prompt.js` (SP-01..07), `lib/ld-gam-instructional-depth.js`, `lib/gam-output-format.js`, `lib/page-gam-enrich.js`, runtime augmentations in `app.js`. Full ranking details preserved in chat investigation 2026-07-14.

### Strong archetypes (rich typed guidance and/or denser historical gates)

- Evidence interpretation  
- Diagnostic reasoning  
- Comparison (especially `decision_table` / competing interpretations)  
- Evaluation / worked judgement  
- Judgement / independent evaluative performance  
- Verification (`checklist`)  
- Transfer (`transfer_prompt`)  

### Weak archetypes (thin or non-first-class contracts)

- Concept exposition (`text` / SP-01 connective prose only)  
- Mechanism explanation (DEPTH intervening-process exemplars; no typed SP; no semantic capture gate)  
- Process walkthrough (no dedicated type; falls to text/worked_example fallback)  
- Mental-model building (not named as first-class intent)  

### Structural findings

| Finding | Status |
| ------- | ------ |
| Prompt asymmetry privileging Evaluate / verification / transfer / SP-02..07 | Confirmed |
| Validation asymmetry: A4 weak/strong + transfer band historically blocking; mechanism completeness never blocking on v2 | Confirmed |
| Material inheritance: type maps to function; depth floors advisory on v2 presence-only path | Confirmed |
| Fallback under thin guidance: usability + anti-collapse + optional numbered-step stubs → definition lists | Confirmed |
| Biology-specific GAM routing / study-notes path | Not supported |

---

## 6. Conclusions

**Primary explanation:** Instructional-archetype support asymmetry.

**Secondary explanation:** Domain exemplar bias within already-strong archetypes.

**No evidence of:**

- Biology-specific routing  
- Domain-specific GAM path divergence  

**Architectural implication:** `Material type ≠ instructional archetype`. Presentation format (`text`, `worked_example`, `scenario`, …) is distinct from pedagogical function (`mechanism_explanation`, `evaluation`, `transfer`, …). Continuing to improve only material-type wording without archetype contracts will keep repeating enzymes-like under-realisation for teaching-heavy topics.

---

## 7. Recommended direction

Create an **Instructional Archetype Framework** within Sprint 59 that:

1. Inventories instructional roles independently of material types.  
2. Defines purpose, generation procedure, required components, quality criteria, anti-patterns, exemplars, and validation strategy per archetype.  
3. Starts with Priority 1: `mechanism_explanation`, `process_walkthrough`, `mental_model_building`.  
4. Separates contracts so Evaluate/diagnostic strength is preserved while closing the teaching-archetype gap.

See [instructional-archetype-framework.md](instructional-archetype-framework.md) and [backlog.md](backlog.md).

---

## Document control

| Field | Value |
| ----- | ----- |
| Authors | Sprint 59 investigation (agent-assisted) |
| Evidence basis | First audit FA-01..03; generation-constraint audit; Iterations 1–7; heteroscedasticity & enzymes live runs; code/prompt archetype audit |
| Next review | After Priority 1 archetype package design |
