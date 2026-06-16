# Lessons From SP-02 and SP-03

**Date:** 2026-06-18  
**Type:** Interpretation document — not a Pattern Library redesign  
**Purpose:** Determine what Sprint 45.1 reveals about the Pattern Library through the first experimental evaluation of library patterns  
**Authority:** [sprint-44-3-instructional-pattern-library.md](../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md) · [45-1-evidence-workbook.md](45-1-evidence-workbook.md) · [45-1-recommendation.md](45-1-recommendation.md) · [SPRINT-45-1-CLOSURE-REVIEW.md](SPRINT-45-1-CLOSURE-REVIEW.md) · [pattern-aware-evaluation-position-paper.md](pattern-aware-evaluation-position-paper.md) · [CONTRACTS-AND-PATTERNS-RELATIONSHIP-ANALYSIS.md](CONTRACTS-AND-PATTERNS-RELATIONSHIP-ANALYSIS.md)  
**Scope:** SP-02 (`decision_table`) and SP-03 (`transfer_prompt`) only

**Non-goals:** Pattern Library redesign · pattern expansion proposals · implementation · architecture discussion

---

## Background

Sprint 45.1 was the first experiment to apply Pattern Library entries as **deliberate generation targets** and evaluate outcomes through 44-2 contracts. SP-02 and SP-03 were not chosen at random; they were the only patterns in scope.

[`45-1-pattern-injection-experiment-design.md`](45-1-pattern-injection-experiment-design.md) bounded the experiment to patterns with the **strongest Sprint 44 evidence base**. Sprint 44 evaluation and inter-rater validation supplied the selection rationale:

| Criterion | SP-02 | SP-03 |
| --------- | ----- | ----- |
| Strong reference | Marx M13 — unanimous Strong (Pass 2, Inter-Rater) | Marx M16 — unanimous Strong (Pass 2, Inter-Rater) |
| Weak / Failed contrast | Photosynthesis M12, M19 — Minimum; FM-04 | Photosynthesis M14 — unanimous Failed; FM-02, FM-03 |
| Inter-rater agreement | High on M13, M12, M19 — no verdict splits on core contrast | High on M16 and M14; M22 boundary documented separately |
| Detection signals | Partial exemplar row; empty judgement cells; criteria linkage | Substantive body; learner-context selection; operational completion criteria |
| Instructional move | Model evidence-gathering on one row; learner owns judgement | Own-context transfer with production criteria; learner writes response |
| Learner ownership | Judgement column empty on all rows including exemplar (M13) | No pre-written transfer answer (M16) |

SP-01, SP-04, SP-05, and SP-06 were **deferred** — calibration sensitivity, verdict splits, or weaker Strong exemplar evidence per design authority.

The experiment therefore tests whether the Pattern Library's **best-evidenced entries** can function as controlled intervention targets before any claim is made about the library as a whole.

---

## What Was Tested

| Dimension | Scope |
| --------- | ----- |
| **Patterns** | SP-02 / DT-SP-01; SP-03 / TP-SP-01 only |
| **Material types** | `decision_table` (44-2 §5.6); `transfer_prompt` (44-2 §5.8) |
| **Domains** | Marx (`marx-capitalism-v1`); Photosynthesis (`photosynthesis-v1`) |
| **Pairs** | 6 obligation-matched baseline/treatment pairs (12 bodies) |
| **Design** | Marx maintain-test (2 pairs per pattern) + Photosynthesis remediation (2 pairs per pattern) |
| **Target FMs** | FM-04 (SP-02); FM-02, FM-03 (SP-03) |
| **Primary measure** | 44-2 contract verdict delta per pair |
| **Secondary measure** | Detection Signals, ownership audit, anti-mimicry comparison |
| **Injection mechanism** | Open (Q-02) — pattern-guided bodies, not production pipeline |

**Pair register:**

| Pair | Pattern | Domain | Role |
| ---- | ------- | ------ | ---- |
| DT-MRX-A4 | SP-02 | Marx | Maintain Strong (M13 reference) |
| DT-PS-A4 | SP-02 | Photosynthesis | Remediate FM-04 (M12 reference) |
| DT-PS-A6 | SP-02 | Photosynthesis | Remediate FM-04 (M19 reference) |
| TP-MRX-A4 | SP-03 | Marx | Maintain Strong (M16 reference) |
| TP-PS-A4 | SP-03 | Photosynthesis | Remediate FM-02/FM-03 (M14 reference) |
| TP-PS-A6 | SP-03 | Photosynthesis | Boundary + remediation (M22 reference) |

---

## What SP-02 Demonstrated

Recorded evidence only — from workbook and recommendation.

### Maintain-test (DT-MRX-A4)

- Baseline and treatment both **Strong** per §5.6; classification **No Change**.
- FM-04 **absent** in both conditions.
- Ownership pass; no regression; mimicry suspect = no.
- Treatment retained Strong instructional features with lexical variation from frozen M13 (workbook corpus comparison).

### Photosynthesis remediation (DT-PS-A4, DT-PS-A6)

- **DT-PS-A4:** Minimum → Strong; FM-04 present in baseline → absent in treatment.
- **DT-PS-A6:** Minimum → Strong; FM-04 present in baseline → absent in treatment.
- Baselines byte-identical to frozen M12 and M19 (valid table structure, no partial-exemplar reasoning).
- Treatments added partial-exemplar **reasoning** on one row while learner judgement loci (*Correct/Incorrect*, *Impact*) remained empty.
- Workbook explicitly distinguishes substantive exemplar reasoning from superficial non-empty cell completion (both pairs).
- Anti-mimicry: Photosynthesis column layout and domain content; not M13 criteria transplant.

### Detection Signals and ownership (all three SP-02 treatments)

- Strong signal profiles recorded on all three treatment bodies (secondary evidence).
- Zero ownership regressions across SP-02 treatments.
- Pair classifications followed **verdict** ordering, not signals alone.

### SP-02 evidence summary

| Claim | Supported? | Evidence |
| ----- | ---------- | -------- |
| SP-02 guidance maintains Strong on already-Strong obligation | Yes (n=1) | DT-MRX-A4 |
| SP-02 guidance remediates FM-04 on weak Photosynthesis tables | Yes (n=2) | DT-PS-A4, DT-PS-A6 |
| Improvement requires exemplar reasoning, not structure alone | Yes | Baselines had valid tables + FM-04; treatments added modelled reasoning |
| SP-02 compatible with MP-1 (scaffold ≠ deliverable) | Yes | Judgement loci empty on all treatment rows |
| SP-02 Strong signals coincide with Strong verdicts on treatments | Yes | All three treatments |

---

## What SP-03 Demonstrated

Recorded evidence only.

### Maintain-test (TP-MRX-A4)

- Baseline and treatment both **Strong** per §5.8; classification **No Change**.
- FM-02 and FM-03 **absent** in both conditions.
- Ownership pass; mimicry suspect = no.
- Treatment used workplace frame vs M16 digital-platform frame; distinct bullet phrasing (workbook).

### Photosynthesis remediation — clear Failed case (TP-PS-A4)

- **Failed → Strong**; FM-02 and FM-03 both present in baseline → absent in treatment.
- Baseline: two-sentence third-person claim correction; transfer slot present; ownership pass but instructional fail.
- Treatment: learner-context selection, operational word band, multi-cue ecological transfer scaffolding; no pre-written learner response.
- Workbook attributes gain to substantive transfer support, **not** transfer-slot presence.

### Photosynthesis boundary case (TP-PS-A6)

- Baseline scored **Failed** under declared Inter-Rater conjunctive §5.8 minimum (completion present; own-context absent; FM-03 present).
- Treatment **Strong**; FM-03 reduced; FM-02 absent in both conditions.
- Frozen M22 historical verdict unchanged; boundary documented in-pair only.
- Treatment added explicit learner-context selection.

### Detection Signals and ownership (all three SP-03 treatments)

- Strong signal profiles on all three treatment bodies.
- Zero ownership regressions; no pre-written transfer responses in treatments.
- TP-PS-A4 baseline: Failed signal profile + Failed verdict + ownership pass — demonstrating separable channels.

### SP-03 evidence summary

| Claim | Supported? | Evidence |
| ----- | ---------- | -------- |
| SP-03 guidance maintains Strong on already-Strong obligation | Yes (n=1) | TP-MRX-A4 |
| SP-03 guidance remediates unanimous Failed transfer (M14 shape) | Yes (n=1) | TP-PS-A4 |
| SP-03 guidance improves boundary transfer under declared interpretation | Yes (n=1, scoped) | TP-PS-A6 |
| Transfer slot ≠ transfer success | Yes | TP-PS-A4 baseline |
| Learner-context selection discriminates minimum/strong on capstone transfer | Yes | TP-PS-A6 baseline vs treatment |
| SP-03 compatible with MP-1 | Yes | No pre-written learner responses in treatments |

---

## Why These Patterns Were Suitable First Targets

Assessment against recorded selection criteria and 45-1 outcomes.

### Evidence properties (Sprint 44)

1. **Unanimous Strong anchors** — M13 and M16 scored Strong across Pass 2 and Inter-Rater without verdict splits on the core reference. Maintain-test pairs could test degradation risk on known-good shapes.

2. **Sharp weak/failed contrasts on the same material type** — M12/M19 (Minimum + FM-04) and M14 (Failed + FM-02/FM-03) provided remediation targets with named library FMs already linked in 44-3 indexes.

3. **High inter-rater agreement on discrimination** — The core Strong vs weak contrast was not calibration-contested (unlike M2, M22 globally, or Marx checklist boundaries).

4. **Observable Detection Signals** — Partial exemplar row; empty judgement cells; substantive body; learner-context selection; operational completion criteria — features reviewers could score without inferring hidden intent.

5. **Single bounded instructional move (MP-8)** — One move per material: model evidence-gathering (SP-02) or own-context transfer scaffolding (SP-03). Reduces confounding when attributing verdict change.

6. **Explicit ownership compatibility (MP-1)** — M13 and M16 precedents keep learner loci empty. Ownership regression was a designable failure mode; zero observed.

### Experimental properties (confirmed by 45-1)

7. **Paired obligation design workable** — Frozen baselines anchored comparison; treatment on identical DLA obligations produced interpretable deltas.

8. **Maintain + remediate dual role** — Both patterns served Marx hold slots and Photosynthesis improvement slots; neither role contradicted the other.

9. **FM linkage actionable** — Target FMs in pattern entries (FM-04 for SP-02; FM-02/FM-03 for SP-03) cleared on remediation pairs when verdicts improved.

*Interpretation:* Suitability was a function of **evidence sharpness + FM traceability + ownership safety + observable signals** — not merely because decision tables and transfer prompts are important material types.

---

## Common Characteristics

Shared properties of SP-02 and SP-03 that 45-1 evidence illuminates:

| Characteristic | SP-02 | SP-03 |
| -------------- | ----- | ----- |
| **Unanimous Strong benchmark reference** | M13 | M16 |
| **Named FM target(s) in library index** | FM-04 | FM-02, FM-03 |
| **Photosynthesis weak shape remediable** | M12, M19 → Strong | M14, M22 (declared) → Strong |
| **Contract anchor** | §5.6 | §5.8 |
| **Minimum achievable without Strong pattern shape** | Yes (baselines) | N/A for M14 (Failed); M22 boundary |
| **Discriminating move is instructional, not structural** | Exemplar reasoning vs table shell | Scaffolding vs slot presence |
| **Strong Detection Signals on all treatments** | Yes (3/3) | Yes (3/3) |
| **Ownership preserved under guidance** | Yes (0 regressions) | Yes (0 regressions) |
| **Anti-mimicry negative** | Yes (3/3 pairs) | Yes (3/3 pairs) |
| **Verdict-primary classification** | Yes | Yes |
| **Marx maintain-test passed** | DT-MRX-A4 No Change | TP-MRX-A4 No Change |

**Shared lesson:** Both patterns link a **specific FM** to a **specific operational move** that contract minimum alone does not require. Both required **substantive instructional content** beyond container presence to reach Strong.

---

## What The Results Suggest About The Pattern Library

*Interpretation — cautious, grounded in 45-1 evidence only.*

1. **Library entries can function as operational intervention targets.** When SP-02/SP-03 shapes were deliberately applied, obligation-matched bodies moved toward Strong on weak Photosynthesis slots and held Strong on Marx slots. This supports the contracts-and-patterns relationship: patterns as **evidence-backed operationalisations**, not merely retrospective explanations ([`CONTRACTS-AND-PATTERNS-RELATIONSHIP-ANALYSIS.md`](CONTRACTS-AND-PATTERNS-RELATIONSHIP-ANALYSIS.md)).

2. **FM linkage in the library is diagnostically and experimentally actionable.** FM-04, FM-02, and FM-03 cleared on remediation pairs in alignment with pattern intent. The Secondary Index is not decorative for these patterns.

3. **Detection Signals correlate with contract improvement when both are present** — all six treatments showed Strong signals alongside Strong verdicts. Signals did not drive pair classifications.

4. **Maintain-test slots are necessary, not optional.** Marx No Change outcomes confirm pattern guidance did not degrade already-Strong references — a risk the library's Strong anchors were chosen to detect.

5. **Cross-domain operationalisation is possible without mimicry** — Photosynthesis treatments reached Strong using domain-appropriate content, not Marx prose transplant (anti-mimicry negative on all pairs).

6. **The library's MP-1 emphasis is experimentally load-bearing.** Zero ownership regressions across six treatments suggests Strong shapes in the library can be applied without scaffold-to-deliverable collapse — on this sample.

7. **Boundary-documented patterns (M22 via SP-03) require explicit evaluation handling** — TP-PS-A6 did not resolve M22 globally; pattern application still produced improvement under declared interpretation.

*Speculation (not demonstrated):* Other library entries with similar evidence properties (unanimous Strong, sharp FM contrast, high agreement) may behave similarly in future experiments. SP-01, SP-04–SP-06 were not tested.

---

## What The Results Do Not Support

Explicit limits — avoid over-generalisation.

### Untested patterns

| Pattern | Status |
| ------- | ------ |
| SP-01 (`text`) | Not in 45-1 scope |
| SP-04 (`consolidation_summary`) | Not in 45-1 scope |
| SP-05 (`checklist`) | Not in 45-1 scope |
| SP-06 (`worked_example`) | Not in 45-1 scope |

**No evidence** that 45-1 outcomes generalise to SP-01, SP-04, SP-05, or SP-06. Those patterns were deferred for calibration sensitivity, verdict splits, or weaker Strong exemplar evidence at experiment design time.

### Untested material types

Only `decision_table` and `transfer_prompt` were evaluated. No evidence for `text`, `worked_example`, `checklist`, `consolidation_summary`, or unevaluated 44-2 types.

### Production behaviour

- Injection mechanism explicitly open (Q-02).
- 45-1 tested pattern-guided **bodies**, not a production pipeline, prompt configuration, or automated generation.
- **No evidence** that library patterns improve output when embedded in runtime workflow.

### Scalability

| Limit | Recorded fact |
| ----- | ------------- |
| Single body per pair | No replication variance |
| Six DLA slots | Two domains, three activities |
| Single evaluator session | Independent re-score not recorded |
| All treatments reached Strong | No partial-improvement or ambiguous cases in aggregate |

**No evidence** for industrial scale, multi-rater consistency, or stable effect sizes across generation runs.

### Other unsupported claims

- **Detection Signals alone declare success** — explicitly rejected; no pair improved on signals without verdict rise.
- **Marx Strong predicts Photosynthesis remediation** — Marx No Change did not predict Photosynthesis outcomes per pair.
- **Pattern checklist pass equals contract satisfaction** — baselines could lack Strong signals while meeting contract minimum (DT-PS) or pass ownership while failing instructionally (TP-PS-A4).
- **Pattern Library entries eliminate calibration ambiguity** — M22 boundary persisted; handled by declaration, not pattern resolution.
- **All Pattern Library FMs are equally remediable** — only FM-04, FM-02, FM-03 tested.
- **Library patterns imply implementation readiness** — 45-1 recommendation gates further injection on evaluation standing, not library completeness.

---

## Implications For Pattern Selection

Conceptual implications only — no redesign.

1. **Prioritise patterns with unanimous Strong references and sharp FM-linked contrasts** for first-generation experiments. SP-02/SP-03 selection criteria were validated by 45-1 outcomes; defer patterns with documented calibration splits until evaluation method can handle boundary declarations.

2. **Require named FM targets in pattern entries** for experimental traceability. FM clearance coincided with verdict improvement on all remediation pairs — FM linkage supported experimental design.

3. **Include maintain-test slots on Strong references** when testing pattern guidance. Degradation risk is real in principle; 45-1 Marx pairs did not regress, but n=1 per pattern per domain.

4. **Select patterns with observable Detection Signals and explicit MP-1 compatibility** before generation experiments. Superficial-shape discrimination was necessary on both patterns (table shell; transfer slot).

5. **Do not select patterns for experiments based on material-type importance alone.** Suitability was evidence sharpness and experimental controllability — both patterns had the strongest Sprint 44 discrimination on their types.

6. **Treat obligation-matched pairing as a selection constraint for the experiment design**, not a property of the patterns themselves. Effects were measured per DLA slot; Marx success did not transfer by domain.

*Speculation:* Patterns with boundary-sensitive exemplars (like M22 for SP-03) remain selectable but require pre-committed evaluation declarations — not exclusion.

---

## Implications For Future Experiments

What should be learned from the SP-02/SP-03 choice — not a sprint plan.

1. **Start with best-evidenced entries.** 45-1 was a library **proof-of-concept** on the highest-confidence patterns. Negative results would have been more informative about the library than negative results on deferred patterns.

2. **Design for both remediation and maintain-test.** The dual-slot structure prevented false success from Photosynthesis-only improvement or Marx-only hold without cross-check.

3. **Anchor baselines to frozen corpus weak shapes** (M12, M14, M19, M22) — enables paired delta without relitigating Sprint 44 scoring.

4. **Pre-specify target FMs per pattern** — FM delta was a convergent evidence channel alongside verdict delta.

5. **Pre-commit boundary handling for known calibration cases** — TP-PS-A6 demonstrated M22 can be included without reopening Sprint 44 calibration if interpretation is declared in-pair.

6. **Evaluate with verdict-first multi-layer stack** — contract + signals + FM + ownership + anti-mimicry; SP-02/SP-03 outcomes depended on convergence, not pattern checklist alone.

7. **Do not expand to additional patterns until evaluation method is standing** — per 45-1 recommendation; SP-02/SP-03 success does not automatically authorise SP-01/04/05/06 experiments.

8. **Discriminate substantive operationalisation from cosmetic shape** — the central experimental lesson from both patterns; future pattern choices should favour moves that are **reviewer-distinguishable** from container presence.

---

## Conclusion

The strongest **evidence-supported** lessons from Sprint 45.1's first experimental use of Pattern Library entries:

1. **SP-02 and SP-03 were appropriate first targets** because Sprint 44 supplied unanimous Strong references, sharp FM-linked weak contrasts, high inter-rater agreement on core discrimination, observable Detection Signals, single bounded moves, and explicit MP-1 compatibility — all confirmed workable in the six-pair design.

2. **SP-02 demonstrated** that partial-exemplar guidance can remediate FM-04 on Photosynthesis weak tables (Minimum → Strong), maintain Strong on Marx, and preserve empty learner judgement loci — with exemplar **reasoning** discriminated from table **structure**.

3. **SP-03 demonstrated** that capstone transfer scaffolding can remediate FM-02/FM-03 on Failed transfer (M14 shape), improve boundary transfer under declared interpretation (M22), maintain Strong on Marx, and preserve learner production ownership — with **scaffolding** discriminated from transfer-slot **presence**.

4. **The Pattern Library's FM linkage and Detection Signals are experimentally usable** for SP-02 and SP-03 — FMs cleared on remediation; Strong signals corroborated Strong verdicts on treatments; neither layer replaced contract verdicts.

5. **45-1 does not generalise beyond these two patterns, two material types, six slots, and one experiment run.** Untested patterns, production behaviour, scalability, and library-wide claims remain unsupported.

*Interpretation in one line:* The first experimental evaluation suggests the Pattern Library can encode **actionable, ownership-safe instructional moves** tied to **named failure modes** — at least for its best-evidenced entries — but says nothing yet about the library as a complete or production-ready system.

---

## Traceability

| Section | Primary sources |
| ------- | --------------- |
| Background / selection | `45-1-pattern-injection-experiment-design.md` § Evidence basis; `sprint-44-3` Transfer Prompt, Decision Table indexes |
| Experimental scope | `45-1-evidence-workbook.md` artefact register; `SPRINT-45-1-CLOSURE-REVIEW.md` § Evidence Collected |
| SP-02 / SP-03 demonstrated | `45-1-recommendation.md` § SP-02/SP-03 Findings; workbook pair sections |
| Limits | `SPRINT-45-1-CLOSURE-REVIEW.md` § What 45-1 Did Not Demonstrate |
| Library relationship | `CONTRACTS-AND-PATTERNS-RELATIONSHIP-ANALYSIS.md` |
