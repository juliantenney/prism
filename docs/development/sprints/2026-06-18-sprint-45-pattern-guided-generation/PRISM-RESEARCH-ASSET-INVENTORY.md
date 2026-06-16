# PRISM Research Asset Inventory

**Date:** 2026-06-18  
**Type:** Analytical inventory — not a roadmap, implementation plan, or architecture review  
**Purpose:** Identify durable research assets that exist after Sprint 45.1  
**Authority:** [sprint-44-2-instructional-depth-contracts.md](../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md) · [sprint-44-3-instructional-pattern-library.md](../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md) · [45-1-recommendation.md](45-1-recommendation.md) · [SPRINT-45-1-CLOSURE-REVIEW.md](SPRINT-45-1-CLOSURE-REVIEW.md) · [pattern-aware-evaluation-position-paper.md](pattern-aware-evaluation-position-paper.md) · [CONTRACTS-AND-PATTERNS-RELATIONSHIP-ANALYSIS.md](CONTRACTS-AND-PATTERNS-RELATIONSHIP-ANALYSIS.md) · [FRONTIER-REVIEW-AFTER-SPRINT-45-1.md](FRONTIER-REVIEW-AFTER-SPRINT-45-1.md) · [LESSONS-FROM-SP-02-AND-SP-03.md](LESSONS-FROM-SP-02-AND-SP-03.md) · [METHODOLOGICAL-CONTRIBUTIONS-OF-SPRINT-45-1.md](METHODOLOGICAL-CONTRIBUTIONS-OF-SPRINT-45-1.md)

**Non-goals:** Implementation · architecture · sprint planning · redesign

---

## What Counts As A Research Asset?

For this inventory, a **research asset** is a durable artefact or demonstrated method that:

1. **Persists beyond a single sprint session** — documented, referenceable, and usable in future research without re-deriving from scratch.
2. **Has evidenced value** — demonstrated utility in Sprint 44 and/or Sprint 45.1, not merely proposed.
3. **Supports reproducible inquiry** — enables another researcher to ask the same or extended questions with traceable evidence.
4. **Is educational-research grade** — states instructional claims, evaluation criteria, or methods; not runtime code or workflow configuration.
5. **Can be assessed independently of implementation** — retains value if generation pipelines, prompts, or capture mechanisms change completely.

**Not counted as research assets here:**

- Sprint 43 architectural decisions (settled context, not Sprint 44–45.1 deliverables).
- 44-1 capture gate design (implementation-adjacent; excluded per task constraints).
- Individual 45-1 artefact text files (evidence records, not standalone reusable assets — subsumed under experimental method).
- Post-45.1 interpretation documents (synthesis of assets, not assets themselves).

**Value labels used below:**

| Label | Meaning |
| ----- | ------- |
| **Demonstrated** | Used successfully with recorded outcomes in Sprint 44 and/or 45.1 |
| **Projected** | Plausible future value; not yet validated beyond current evidence |
| **Closed** | Authoritative; sprint closure forbids redesign without explicit new authorisation |

---

## Asset: 44-2 Instructional Contracts

### Description

Draft 1 instructional depth contracts for eleven learner-facing material types: educational purpose, minimum realisation, strong realisation, failure modes, and validation signals per type. Verdict scale: Failed / Minimum / Strong.

**Location:** [`sprint-44-2-instructional-depth-contracts.md`](../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md)  
**Status:** Accepted reference · **Closed**

### Demonstrated value

| Evidence | Source |
| -------- | ------ |
| Operational for human evaluation across 25+ materials | Sprint 44 three-pass programme |
| Discriminates across domains within material type | Marx vs Photosynthesis verdict splits |
| Sufficient without redesign for Sprint 44 evaluation | Sprint 44 review — falsified "contracts require redesign" |
| Primary measure in 45-1 — all six pair classifications driven by §5.6/§5.8 verdict deltas | 45-1 workbook, recommendation |
| Normative hierarchy preserved — patterns subordinate | 44-3 architecture; contracts-and-patterns analysis |

### Role

**Normative foundation** for all instructional quality research in PRISM after Sprint 44. Answers: *What must each material type achieve?* Every other asset in this inventory measures against, extends, or intervenes upon contract criteria.

### Projected value

Guides evaluation on unevaluated material types (`modelling_note`, `rubric`, etc.) where contracts exist but Pattern Library v1 has no entries — **projected**, not demonstrated at pattern-intervention level.

### Limitations

- Strong/Minimum calibration boundaries documented but not globally resolved (M2, M22, etc.).
- Does not imply current generators satisfy contract bars.
- Cross-cutting principles overlap with pattern meta-principles; contract governs on conflict.

---

## Asset: Benchmark Corpus

### Description

Frozen cross-domain fixtures: Marx (`marx-capitalism-v1`) and Photosynthesis (`photosynthesis-v1`) — GAM material bodies, DLA obligations, upstream JSON chain. Evaluation unit: material-level GAM body text.

**Location:** [`benchmark-corpus/`](../2026-06-15-sprint-44/benchmark-corpus/)  
**Status:** Complete · frozen for reproducible evaluation

### Demonstrated value

| Evidence | Source |
| -------- | ------ |
| Supported three evaluation passes + inter-rater validation | Sprint 44 outcomes |
| Enabled pattern extraction with material-ID traceability | SP-01–SP-06 entries |
| Served as baseline anchors in 45-1 paired design | BL-DT-PS-A4/A6, BL-TP-PS-A4/A6 byte-identical to M12, M19, M14, M22 |
| Anti-mimicry comparison reference | M13, M16 Strong; M14 Failed; corpus-comparison fields in workbook |
| Cross-domain contrast without relitigating scores | 45-1 frozen baselines |

### Role

**Empirical anchor** — reproducible contrast exemplars that ground contract verdicts and pattern claims in observed bodies. Converts abstract contract tiers into scored historical references (M13 Strong, M14 Failed, etc.).

### Projected value

Corpus-wide regression baseline for future generation comparison (45-3 concept) — **projected**; distribution-level comparison not executed in 45-1.

### Limitations

- Two domains only.
- Manually captured, frozen at Sprint 44 — may diverge from future pipeline output.
- Page-composition channel (FM-12) documented separately from body scoring.
- Re-freezing requires explicit decision.

---

## Asset: Failure Mode Taxonomy

### Description

Named instructional failure modes (FM-02–FM-11) in Pattern Library Secondary Index, plus capture artefacts (FM-01, FM-12) in Conventions. Each instructional FM traces to contract sections, benchmark material IDs, and detection signals where evidenced.

**Location:** [`sprint-44-3-instructional-pattern-library.md`](../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md) § Secondary Index; contract §5.x failure mode sections  
**Status:** Closed architecture · evidence-backed entries

### Demonstrated value

| Evidence | Source |
| -------- | ------ |
| Recurred cross-domain in Sprint 44 evaluation | FM-04, FM-05, FM-07, FM-11, etc. |
| Linked per pattern to SP-02 (FM-04), SP-03 (FM-02, FM-03) | 44-3 type indexes |
| Pre-specified as 45-1 paired delta metrics | Experiment design |
| Cleared on remediation pairs when verdicts improved | FM-04: 2→0; FM-02: 1→0; FM-03: 2→0 |
| Diagnostically separable from contract tier | M12 Minimum + FM-04; M14 Failed + FM-02/FM-03 |

### Role

**Diagnostic bridge** between contract verdicts and pattern targets. Explains *why* a body is weak (named failure) while verdict states *how much* it achieves. Enables convergent evidence in intervention research.

### Projected value

FM linkage as experimental traceability standard for untested patterns — **projected** from SP-02/SP-03 success.

### Limitations

- Only FM-04, FM-02, FM-03 tested under intervention in 45-1.
- FM-08 boundary-sensitive (Pass 1 only).
- Capture FMs (FM-01, FM-12) not stress-tested in 45-1.
- Taxonomy does not add verdict tiers beyond contracts.

---

## Asset: Pattern Library

### Description

Pattern Library Draft 1: architecture, six pattern entries (SP-01–SP-06), Detection Signals, meta-principles MP-1–MP-8, slot indexes, conventions, evidence traceability. Patterns supply reusable minimum/strong shapes anchored to §5.x contracts.

**Location:** [`sprint-44-3-instructional-pattern-library.md`](../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md) · [`patterns/`](../2026-06-15-sprint-44/patterns/)  
**Status:** Draft 1 complete · **Closed** architecture

### Demonstrated value

| Evidence | Source |
| -------- | ------ |
| Authorised after contract discrimination evidence | 44-3 Readiness Assessment |
| Six patterns extracted without contract redesign | Sprint 44 evidence chain |
| SP-02, SP-03 used as intervention targets in 45-1 | 4 Improvements, 2 No Change, 0 Regressions |
| Detection Signals corroborated Strong verdicts on all six treatments | Workbook |
| FM linkage actionable for SP-02/SP-03 | Remediation pairs |
| MPs (especially MP-1) load-bearing under pattern guidance | 0 ownership regressions |

### Role

**Operationalisation layer** — evidence-backed shapes that satisfy contract strong/minimum bars. Patterns answer: *What evidenced form realises the contract?* Subordinate to contracts; extends without replacing.

### Partial vs full library value

| Scope | Status |
| ----- | ------ |
| SP-02, SP-03 | **Demonstrated** as intervention targets (45-1) |
| SP-01, SP-04, SP-05, SP-06 | **Catalogued** from Sprint 44 evaluation; **not** injection-tested |
| Unevaluated material types | No pattern entries; contracts only |

### Projected value

Remaining four patterns as intervention candidates — **projected**; deferred at 45-1 design for calibration/evidence reasons.

### Limitations

- Draft 1 — not claimed complete for all instructional moves.
- Detection Signals are secondary, not primary success criteria.
- Pattern checklist pass ≠ contract satisfaction (45-1 evidence).

---

## Asset: Pattern-Aware Evaluation

### Description

Multi-layer evaluative concept and 45-1 practice: contract verdict (primary) + Detection Signals (secondary) + FM checks + ownership audit + anti-mimicry comparison + boundary declarations → convergent judgement. Named in position paper; not a standing protocol.

**Location:** [`pattern-aware-evaluation-position-paper.md`](pattern-aware-evaluation-position-paper.md); exercised in [`45-1-evidence-workbook.md`](45-1-evidence-workbook.md)  
**Status:** **Demonstrated once** · chartered for formalisation (45-2)

### Demonstrated value

| Evidence | Source |
| -------- | ------ |
| All six pairs evaluated through full stack | Workbook structure |
| Pair classifications followed verdict-first ordering | Closure review |
| Convergent evidence on 4/4 Photosynthesis improvements | Recommendation |
| Ownership separable from verdict (TP-PS-A4 baseline) | Workbook |
| Anti-mimicry negative on all pairs | Recommendation |
| Boundary declaration operational (TP-PS-A6) | M22 note |
| Distinguished cosmetic from substantive shape | DT-PS, TP-PS-A4 workbook notes |

### Role

**Intervention-trust machinery** — answers whether pattern-guided improvement is real, ownership-safe, and non-mimetic. Required when research shifts from corpus characterisation to generation intervention. Insufficient for Sprint 44 task; necessary for 45-1 claims.

### Projected value

Standing research protocol (45-2) — **projected**; repeatability, multi-rater consistency, generalisability unproven.

### Limitations

- Single evaluator session.
- No independent re-score.
- Superficial-match control not triggered in-sample.
- Not validated beyond SP-02/SP-03, two material types, six pairs.

---

## Asset: Experimental Intervention Method

### Description

Obligation-matched baseline/treatment paired design for pattern-guided generation research: frozen corpus baselines; pattern-guided treatment on identical DLA obligations; maintain-test + remediation slots; pre-specified FM targets; convergent success/failure criteria; explicit pair classifications (Improvement / No Change / Regression / Inconclusive).

**Location:** [`45-1-pattern-injection-experiment-design.md`](45-1-pattern-injection-experiment-design.md) · [`45-1-experiment-execution-plan.md`](45-1-experiment-execution-plan.md) · [`45-1-evidence-workbook.md`](45-1-evidence-workbook.md) (evidence record)  
**Status:** **Demonstrated once** (45-1 complete)

### Demonstrated value

| Evidence | Source |
| -------- | ------ |
| 6/6 pairs completed with traceable evidence chain | Workbook artefact register |
| Maintain-test detected no Marx degradation | DT-MRX-A4, TP-MRX-A4 No Change |
| Remediation slots produced interpretable deltas | 4 Photosynthesis Improvements |
| Marx outcomes did not predict Photosynthesis per pair | Closure review assumptions challenged |
| Design success/failure criteria operable | Recommendation criteria review |
| Injection mechanism explicitly excluded — method separable from pipeline | Q-02 open |

### Role

**Generation research instrument** — first PRISM method for testing Pattern Library entries as deliberate intervention targets with defensible causal framing (qualified: controlled pairs, not production causation).

### Projected value

Reusable template for future pattern injection experiments — **projected**; replication variance not measured.

### Limitations

- Single body per pair; one run.
- SP-02, SP-03 only.
- Pattern-guided bodies, not documented production injection.
- Depends on pattern-aware evaluation for trustworthy classification.

---

## Asset Relationships

```text
                    ┌─────────────────────────┐
                    │  44-2 Contracts         │
                    │  (normative foundation) │
                    └───────────┬─────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
    ┌─────────────────┐ ┌──────────────┐ ┌──────────────────┐
    │ Benchmark Corpus │ │ FM Taxonomy  │ │ Pattern Library  │
    │ (empirical       │ │ (diagnostic  │ │ (operational     │
    │  anchor)         │ │  bridge)     │ │  shapes)         │
    └────────┬─────────┘ └──────┬───────┘ └────────┬─────────┘
             │                  │                   │
             └──────────────────┼───────────────────┘
                                │
                                ▼
              ┌─────────────────────────────────────┐
              │ Experimental Intervention Method      │
              │ (paired design; 45-1)               │
              └─────────────────┬───────────────────┘
                                │
                                ▼
              ┌─────────────────────────────────────┐
              │ Pattern-Aware Evaluation            │
              │ (multi-layer judgement; 45-1)       │
              └─────────────────────────────────────┘
```

| Relationship | Nature |
| ------------ | ------ |
| Contracts → all assets | Normative authority; verdict tiers govern |
| Corpus → patterns | Patterns extracted from scored corpus exemplars |
| Corpus → intervention method | Frozen baselines anchor paired comparison |
| FM taxonomy → patterns | Each pattern links to FMs it avoids |
| FM taxonomy → pattern-aware evaluation | FM delta as convergent channel |
| Pattern Library → intervention method | Patterns as treatment specification |
| Pattern-aware evaluation → intervention method | Classifies whether intervention succeeded |
| Contracts → pattern-aware evaluation | Primary verdict layer |

**Reinforcement loop (demonstrated in 45-1):** Pattern guidance → body change → contract verdict delta + FM clearance + ownership pass + anti-mimicry clearance → convergent Improvement classification.

---

## Which Assets Are Foundational?

Ranked by **dependency importance** — what other assets require to function.

| Rank | Asset | Rationale |
| ---- | ----- | ----------- |
| **1** | **44-2 Instructional Contracts** | Every other asset measures against, extends, or intervenes upon contract criteria. Closed and demonstrated across Sprint 44 + 45.1. |
| **2** | **Benchmark Corpus** | Grounds contracts and patterns in reproducible scored exemplars. Without corpus, contract discrimination and pattern traceability lack empirical anchor. |
| **3** | **Failure Mode Taxonomy** | Diagnostic layer linking contracts to pattern targets; convergent evidence channel in 45-1. Subordinate to contracts but essential for intervention diagnosis. |
| **4** | **Pattern Library** | Operationalises contracts for authoring and intervention; depends on contracts + corpus evidence. Partially demonstrated (SP-02/SP-03). |
| **5** | **Pattern-Aware Evaluation** | Depends on contracts, FMs, patterns, corpus; enables trustworthy intervention claims. Demonstrated once. |
| **6** | **Experimental Intervention Method** | Depends on all above; highest-order research instrument. Demonstrated once. |

*Interpretation:* Ranks 1–3 form the **observability stack** (Sprint 44). Ranks 4–6 form the **intervention research stack** (Sprint 45.1 extension).

---

## Which Assets Are Experimental?

Assets requiring **further validation** before standing research infrastructure status.

| Asset | Experimental aspect | What 45.1 proved | What remains unproven |
| ----- | -------------------- | ---------------- | --------------------- |
| **Pattern-Aware Evaluation** | Entire concept as repeatable method | Operable once on six pairs | Multi-rater, replication, new bodies, standing protocol |
| **Experimental Intervention Method** | Paired injection design | 6/6 pairs complete; positive in scope | Replication variance, additional patterns, production injection |
| **Pattern Library (partial)** | SP-02, SP-03 as intervention targets | Maintain + remediate success | SP-01, SP-04–SP-06; unevaluated types |
| **Pattern Library (full)** | Library as complete intervention catalogue | Six entries catalogued from Sprint 44 | Library-wide intervention claims |
| **FM Taxonomy (partial)** | FM remediation under guidance | FM-04, FM-02, FM-03 cleared on remediation | Other FMs under intervention |
| **Benchmark Corpus (extended use)** | Regression baseline | Paired anchoring | Corpus-wide distribution shift |

**Not experimental — foundational and closed:**

- 44-2 contracts (accepted, demonstrated, closed).
- Benchmark corpus as frozen reference (complete for stated purpose).
- FM taxonomy as diagnostic catalogue (evidence-backed for Sprint 44 scope).
- Pattern Library architecture (closed; entries Draft 1).

---

## Which Assets Would Survive Implementation Change?

Assume future generation architecture, prompts, validators, and capture pipelines change **completely**.

| Asset | Survives? | Rationale |
| ----- | --------- | --------- |
| **44-2 Contracts** | **Yes** | Educational normative specification; explicitly not implementation. Sprint 44-2: "does not prescribe workflow changes, rendering, prompts, validators, or code." |
| **Benchmark Corpus** | **Yes** | Frozen historical reference; evaluation unit is GAM body text, not pipeline path. New generation compared against frozen exemplars. |
| **Failure Mode Taxonomy** | **Yes** | Instructional diagnosis tied to contract sections and observed bodies; independent of how bodies are produced. |
| **Pattern Library (entries as educational shapes)** | **Yes** | Operationalisations of contract requirements; 45-1 tested pattern-guided bodies, not a specific pipeline. Q-02 injection mechanism open. |
| **Pattern-Aware Evaluation (concept)** | **Yes** | Multi-layer judgement method applies to any GAM body regardless of origin. |
| **Experimental Intervention Method (design logic)** | **Yes** | Paired obligation-matched comparison, maintain-test, convergent criteria — independent of injection mechanism. |
| **45-1 specific treatment bodies** | **Partial** | Evidence record for one experiment; bodies themselves are not reusable assets. Design and workbook structure survive. |
| **Detection Signals** | **Yes** | Observational checklists on body text; not tied to implementation. |

**Would not survive unchanged (but are not counted as core research assets here):**

- Any specific prompt, validator, or capture configuration (never claimed as assets).
- 44-1 gate runtime behaviour (implementation-adjacent).

*Conclusion:* The **educational and methodological assets** are implementation-independent by design. Only particular experimental evidence records are pipeline-specific.

---

## Strategic Assessment

### What appears to be the most valuable long-term asset?

**The observability stack: 44-2 contracts + benchmark corpus + failure mode taxonomy** — as a combined asset system.

**Evidence for this assessment:**

1. **Widest demonstrated reuse.** Contracts scored 25+ materials in Sprint 44 and all twelve 45-1 bodies. Corpus anchored both pattern extraction and intervention baselines. FMs diagnosed weakness in both sprints.

2. **Implementation-independent by design.** Explicitly educational artefacts; survive complete pipeline replacement.

3. **Closed and authoritative.** Sprint 44 closure; not reopened by 45-1. Stable reference for future research.

4. **Enables everything downstream.** Pattern Library, intervention method, and pattern-aware evaluation all depend on this stack — none function without normative criteria and empirical anchors.

**Runner-up (highest-value emerging asset):** **Pattern-aware evaluation** — demonstrated in 45.1, frontier-leading per post-sprint analysis, likely the most **transferable new capability** PRISM has produced. It is not yet foundational because it has been exercised once and depends on the observability stack.

**Not the strategic centre:**

- Individual pattern entries (SP-02/SP-03) — high demonstrated value but scoped to two types; library partially validated.
- Experimental intervention method — valuable instrument but single-run; derivative of observability + evaluation.

*Projected (not demonstrated):* If pattern-aware evaluation becomes standing protocol, it may equal the observability stack in strategic importance for generation-era research — not yet evidenced.

---

## Conclusion

After Sprint 45.1, PRISM holds a **portfolio of research assets**, not merely a sequence of completed sprints.

### The portfolio

| Layer | Assets | Maturity |
| ----- | ------ | -------- |
| **Normative** | 44-2 Instructional Contracts | Closed · demonstrated |
| **Empirical** | Benchmark Corpus | Frozen · demonstrated |
| **Diagnostic** | Failure Mode Taxonomy | Evidence-backed · demonstrated |
| **Operational** | Pattern Library (SP-01–SP-06) | Draft 1 closed · partially demonstrated (SP-02/SP-03) |
| **Methodological** | Pattern-Aware Evaluation | Demonstrated once · experimental |
| **Instrumental** | Experimental Intervention Method | Demonstrated once · experimental |

### Portfolio state

Sprint 44 built the **observability portfolio** — contracts, corpus, failure modes, and patterns as catalogue — making instructional material realisation measurable and reusable.

Sprint 45.1 **stress-tested** two pattern entries and **produced** intervention evaluation methodology — proving the portfolio can support generation research, not only corpus science.

The portfolio's **centre of gravity** is the observability stack. Its **growth edge** is pattern-aware evaluation and the intervention method — experimental assets that depend on the foundation and determine whether generation claims can scale.

### Demonstrated vs projected

| Claim | Status |
| ----- | ------ |
| Instructional quality is observable and discriminable | **Demonstrated** (Sprint 44) |
| Patterns operationalise contracts with evidence traceability | **Demonstrated** (Sprint 44) |
| Pattern guidance can improve weak bodies on matched obligations | **Demonstrated in scope** (45-1) |
| Pattern-aware evaluation is standing infrastructure | **Projected** (45-2 chartered) |
| Pattern Library is a validated intervention catalogue | **Projected** (SP-02/SP-03 only) |
| Portfolio survives implementation change | **Demonstrated by design** for educational/methodological assets |

PRISM after Sprint 45.1 is best understood as a **research asset portfolio** with a stable observability core and an experimental intervention-evaluation extension — not as a pipeline product or a closed sprint sequence.

---

## Traceability

| Section | Primary sources |
| ------- | --------------- |
| Asset criteria | Sprint 44-2 scope; 45-1 design scope exclusions |
| Per-asset assessments | `sprint-44-outcomes.md`; `sprint-44-review.md`; `45-1-recommendation.md`; `SPRINT-45-1-CLOSURE-REVIEW.md` |
| Relationships | `CONTRACTS-AND-PATTERNS-RELATIONSHIP-ANALYSIS.md`; `sprint-44-outcomes.md` Evidence Chain |
| Foundational ranking | `FRONTIER-REVIEW-AFTER-SPRINT-45-1.md`; dependency logic in position paper |
| Experimental vs closed | `METHODOLOGICAL-CONTRIBUTIONS-OF-SPRINT-45-1.md`; `LESSONS-FROM-SP-02-AND-SP-03.md` |
| Strategic assessment | `FRONTIER-REVIEW-AFTER-SPRINT-45-1.md`; `METHODOLOGICAL-CONTRIBUTIONS-OF-SPRINT-45-1.md` |
