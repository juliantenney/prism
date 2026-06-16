# Contracts and Patterns: Relationship Analysis

**Date:** 2026-06-18  
**Type:** Evidence-grounded conceptual analysis — not design or redesign  
**Purpose:** Determine what relationship between 44-2 contracts and the Pattern Library is supported by Sprint 44 and Sprint 45.1 evidence  
**Authority:** [sprint-44-2-instructional-depth-contracts.md](../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md) · [sprint-44-3-instructional-pattern-library.md](../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md) · [45-1-evidence-workbook.md](45-1-evidence-workbook.md) · [45-1-recommendation.md](45-1-recommendation.md) · [SPRINT-45-1-CLOSURE-REVIEW.md](SPRINT-45-1-CLOSURE-REVIEW.md) · [pattern-aware-evaluation-position-paper.md](pattern-aware-evaluation-position-paper.md) · [FRONTIER-REVIEW-AFTER-SPRINT-45-1.md](FRONTIER-REVIEW-AFTER-SPRINT-45-1.md)

**Non-goals:** Implementation · protocol design · architecture / contract / Pattern Library redesign

---

## Background

### How contracts entered the project

Sprint 44-2 consolidated distributed instructional expectations into **instructional depth contracts** — eleven learner-facing material types, each with educational purpose, minimum realisation, strong realisation, failure modes, and validation signals ([`sprint-44-2-instructional-depth-contracts.md`](../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md) §1–2).

Contracts are normative educational artefacts. They state what each material type must achieve. They do not prescribe prompts, validators, or code. Sprint 44 validated that Draft 1 contracts **discriminate** on a frozen Marx/Photosynthesis benchmark corpus: verdicts spread across Strong, Minimum, and Failed without contract redesign ([`sprint-44-review.md`](../2026-06-15-sprint-44/sprint-44-review.md) § Validated Claims).

### How patterns entered the project

Sprint 44-3 authorised the Pattern Library **after** contract discrimination was demonstrated. The library architecture states that patterns **extend** 44-2 by supplying reusable shapes that satisfy contracts ([`sprint-44-3-instructional-pattern-library.md`](../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md) § Relationship to 44-2 contracts).

Six Draft 1 pattern entries (SP-01–SP-06) were extracted from evaluation evidence — each anchored to a §5.x contract section, traced to benchmark material IDs, and linked to failure modes and Detection Signals. Meta-principles MP-1–MP-8 document cross-pattern regularities; they are **subordinate** to contracts and do not add evaluation criteria.

The Sprint 44 evidence chain runs:

```text
Frozen corpus → 44-2 contract evaluation → inter-rater validation → pattern extraction → meta-principles
```

([`sprint-44-outcomes.md`](../2026-06-15-sprint-44/sprint-44-outcomes.md) § Evidence Chain)

### How Sprint 45.1 used both

Sprint 45.1 tested whether SP-02 and SP-03 could be **deliberately applied** to obligation-matched GAM bodies. Evaluation used 44-2 contract verdicts as **primary** evidence and pattern Detection Signals as **secondary** ([`45-1-evidence-workbook.md`](45-1-evidence-workbook.md) § Workbook Instructions). Six pairs produced 4 Improvements, 2 No Change, 0 Regressions; target FMs reduced on remediation pairs.

Contracts and patterns therefore coexist as two layers in PRISM's instructional quality stack. The question is what relationship between them the evidence actually supports.

---

## The Apparent Tension

Contracts and patterns appear to overlap because they describe similar instructional features for the same material types.

| Overlap area | Contract (44-2) | Pattern (44-3) |
| ------------ | --------------- | -------------- |
| `decision_table` strong bar | §5.6: partial exemplar row; empty learner judgement cells | SP-02: partial-exemplar shape; FM-04 avoidance; Detection Signals |
| `transfer_prompt` strong bar | §5.8: own-context framing; operational completion criterion | SP-03: capstone transfer shape; FM-02/FM-03 avoidance; Detection Signals |
| Minimum vs Strong | Three verdict tiers per type | Minimum shape, Strong shape, Failed signals per pattern |
| Failure diagnosis | Failure modes in §5.x sections | FM-02–FM-11 in Secondary Index; linked per pattern |

This overlap creates apparent tension:

1. **Redundancy** — If contracts already specify partial exemplar rows (§5.6 strong) and own-context transfer (§5.8), what do patterns add?
2. **Authority conflict** — If patterns have Detection Signals that look like scoring checklists, do they compete with contract verdicts?
3. **Direction of dependence** — Patterns were extracted **from** contract evaluation, yet 45-1 used patterns **to guide** generation evaluated **by** contracts.
4. **Discrimination without patterns** — M12 and M19 score Minimum under §5.6 without satisfying SP-02 Strong shape; contracts discriminate without pattern checklist pass.

The tension is real at the conceptual level. Sprint 44 and 45.1 evidence constrain how it should be resolved.

---

## Relationship Model A: Patterns as Explanations

### Model

Patterns are **retrospective explanations** of why contract evaluation produced particular verdicts on benchmark materials. They codify contrast exemplars: what Strong bodies had that Minimum/Failed bodies lacked.

### Assessment

**Supported by Sprint 44:**

- Pattern extraction followed evaluation; patterns were not authored before discrimination evidence existed ([`sprint-44-review.md`](../2026-06-15-sprint-44/sprint-44-review.md): "Pattern library as speculative wishlist — **Avoided**").
- SP-02 explicitly frames its instructional problem through M13 (Strong) vs M12/M19 (Minimum) contrast ([`SP-02`](../2026-06-15-sprint-44/patterns/SP-02-DT-SP-01-partial-exemplar-decision-table.md) § Instructional Problem).
- SP-03 frames through M16 (Strong) vs M14 (Failed).
- Each pattern traces to evaluation pass verdicts and benchmark IDs ([`sprint-44-outcomes.md`](../2026-06-15-sprint-44/sprint-44-outcomes.md) § Evidence Chain).

**Weakened by Sprint 45.1:**

- 45-1 did not merely re-explain frozen corpus verdicts. It applied pattern-guided treatment to **new bodies** on identical obligations and observed verdict improvement (4/4 Photosynthesis pairs).
- Pattern guidance was a **prospective intervention**, not only a post-hoc account.
- Workbook requires verdict justification from contract bullets, not pattern names — explanations do not replace normative scoring.

**Verdict:** Model A captures the **historical genesis** of the Pattern Library (extraction from evaluation) but is **insufficient as the full relationship**. Treating patterns only as explanations under-describes their role after 45-1.

*Speculation:* Patterns may still function as pedagogical explanations for reviewers learning to apply contracts — not tested in 45-1.

---

## Relationship Model B: Patterns as Operationalisations

### Model

Patterns are **concrete, reusable operationalisations** of contract requirements — evidenced shapes that show how to satisfy minimum and strong realisation for a material type, without replacing contract text.

### Assessment

**Strongly supported by Sprint 44:**

- 44-3 architecture explicitly: patterns supply reusable **shapes** that **satisfy** contracts; they do not replace, revise, or restate contract text.
- Every pattern slot anchors to a specific §5.x section.
- SP-02 Minimum Realisation Shape maps to §5.6 minimum (structure, row count, empty learner cells); Strong Realisation Shape maps to §5.6 strong (partial exemplar row, reasoning columns, criteria linkage) — with benchmark citations for each.
- SP-02 states minimum does **not** require a partial exemplar row — consistent with M12/M19 scoring Minimum under contract without Strong pattern shape.
- Contracts were **sufficient for evaluation without redesign**; patterns added reusability, not new verdict tiers ([`sprint-44-review.md`](../2026-06-15-sprint-44/sprint-44-review.md) § Falsified: "Contracts require redesign to evaluate — **Falsified**").

**Strongly supported by Sprint 45.1:**

- Treatment bodies were collected under "SP-02 / SP-03 pattern-guided condition" on identical DLA obligations ([`45-1-evidence-workbook.md`](45-1-evidence-workbook.md) pair metadata).
- DT-PS-A4 treatment operationalised partial-exemplar reasoning on Student A *Reason* cell → Minimum → Strong, FM-04 cleared.
- TP-PS-A4 treatment operationalised learner-context selection, word band, multi-cue scaffolding → Failed → Strong, FM-02/FM-03 cleared.
- Improvements attributed to **instructional-function moves** matching pattern shapes, distinguished from superficial structure (workbook: exemplar reasoning vs table shell; scaffolding vs transfer-slot presence).
- Contract verdicts remained primary; patterns operationalised **what to aim for**, contracts judged **whether it was achieved**.

**Verdict:** Model B is **strongly supported** by both sprints. It matches 44-3's stated architecture and 45-1's experimental use of patterns as deliberate realisation targets evaluated by unchanged contracts.

---

## Relationship Model C: Patterns as Causal Hypotheses

### Model

Patterns are **testable causal hypotheses**: if a named pattern is applied to a body, specific contract and FM outcomes will follow (e.g. applying SP-02 reduces FM-04 and raises verdict toward Strong).

### Assessment

**Supported by Sprint 45.1 (within scope):**

- 45-1 primary research question tested deliberate induction of SP-02/SP-03 with predicted outcomes: improved verdicts, reduced FM-04/FM-02/FM-03, preserved ownership ([`SPRINT-45-1-CLOSURE-REVIEW.md`](SPRINT-45-1-CLOSURE-REVIEW.md) § Original Research Question).
- All four Photosynthesis remediation pairs improved with target FM clearance — consistent with SP-02 → FM-04 remediation and SP-03 → FM-02/FM-03 remediation hypotheses.
- Marx maintain-test pairs held Strong — consistent with no-degradation hypothesis when Strong references receive pattern guidance.
- FM delta aligned with verdict delta on all remediation pairs (workbook pair outcomes).

**Limited / not demonstrated:**

- Single baseline/treatment body per pair; no replication variance; injection mechanism open (Q-02).
- Correlation in controlled pairs, not proven causation at production scale.
- Marx No Change did not predict Photosynthesis outcome — hypotheses must be tested per obligation, not assumed from domain.
- Detection Signals alone did not drive classifications — causal claim runs through contract verdict + FM convergence, not pattern checklist alone.

**Not supported as Sprint 44's primary relationship:**

- Sprint 44 extracted patterns from observed outcomes; it did not test intervention. Causal framing was proposed for Sprint 45 ([`sprint-45-proposal.md`](../2026-06-15-sprint-44/sprint-45-proposal.md)) but not evidenced until 45-1.

**Verdict:** Model C is **supported as a research role introduced by 45.1**, qualified to controlled experiment scope. Patterns function as **intervention hypotheses** testable through obligation-matched pairs — but 45-1 demonstrates association under deliberate application, not general causal law. Model C **extends** Model B; it does not replace it.

*Speculation:* Whether patterns cause improvement in automated production pipelines remains untested.

---

## Relationship Model D: Patterns as Latent Contract Structure

### Model

Patterns **surface latent structure** already implicit in contracts — making tacit discrimination criteria explicit that contracts state abstractly but do not fully operationalise.

### Assessment

**Partially supported:**

- 44-2 validation signals are "educational indicators" — patterns crystallise what reviewers actually observed (e.g. §5.6: "Presence of partial exemplar row"; SP-02 Detection Signals expand this into checkable lists).
- Sprint 44 discrimination on M13 vs M12 hinged on features that patterns name explicitly (partial exemplar row) while M12 met contract minimum without it.
- Meta-principles (MP-1–MP-8) document cross-cutting regularities that appear across pattern entries but are also present in 44-2 cross-cutting principles (scaffold ≠ deliverable, own-context transfer).

**Weakened:**

- Contracts are **not incomplete** without patterns. Draft 1 was sufficient for three evaluation passes; patterns were authorised after discrimination, not to fill contractual gaps ([`sprint-44-review.md`](../2026-06-15-sprint-44/sprint-44-review.md)).
- Strong criteria already appear in contract text — §5.6 strong explicitly requires "partial exemplar row"; §5.8 strong requires own-context and completion criteria. Patterns do not reveal requirements absent from contracts; they **instantiate** them with benchmark-evidenced shapes.
- M12/M19 demonstrate contract minimum is achievable **without** Strong pattern shape — the discriminating feature is in the contract's minimum/strong tier distinction, not hidden until patterns expose it.
- 45-1 required verdict-first ordering precisely because pattern signals could theoretically diverge from contract verdict — if patterns were simply latent contract structure, divergence would be incoherent. The subordination rule implies patterns are a **second layer**, not a decoding of the first.

**Verdict:** Model D captures a **useful partial truth** — patterns make contract discrimination **concrete and traceable** to corpus exemplars. It overstates if taken as the primary relationship: contracts are authoritative and complete for verdict purposes; patterns are evidenced operationalisations, not excavated hidden rules.

---

## Evidence From Sprint 44

| Finding | Implication for relationship |
| ------- | ---------------------------- |
| Contracts discriminate without redesign | Contracts are **primary normative layer** |
| Patterns extracted after evaluation, not before | Patterns are **downstream of contract scoring** historically |
| Six patterns + MPs without new verdict tiers | Patterns **extend**, not **replace**, contracts |
| SP-02/SP-03 anchor to §5.6/§5.8 | Patterns are **type-specific operationalisations** |
| M12/M19 Minimum without Strong pattern shape | Contract minimum ≠ pattern Strong shape |
| M13/M16 unanimous Strong as pattern sources | Patterns encode **evidenced strong shapes**, not all contract-satisfying bodies |
| FM-04, FM-02, FM-03 named with benchmark citations | Failure modes bridge contracts and patterns diagnostically |
| MPs subordinate to contracts | Cross-pattern regularities do not supersede §5.x text |
| Evaluation → pattern workflow viable | Model A (explanation) and Model B (operationalisation) both describe extraction phase |
| Patterns do not imply implementation | Operationalisation is **educational**, not code-level |

Sprint 44 alone best supports **Model B** with **Model A** describing genesis. Model D is partial. Model C was not yet evidenced.

---

## Evidence From Sprint 45.1

| Finding | Implication for relationship |
| ------- | ---------------------------- |
| Verdict justification cites §5.6/§5.8, not pattern names | Contracts remain **normative for scoring** |
| Detection Signals secondary to contract verdict | Patterns are **corroborative**, not authoritative |
| 4 Improvements on pattern-guided treatment | Patterns are **applicable intervention targets** (Model C, scoped) |
| FM clearance coincides with verdict improvement | Patterns link to **named FMs** as predicted operational moves |
| Baselines met contract minimum (DT-PS) or Failed (TP-PS) without Strong signals | Contract tier and pattern signal profile **can diverge** |
| Superficial structure ≠ improvement | Operationalisation must be **substantive**, not checklist-shaped |
| 0 ownership regressions under pattern guidance | Operationalisations must respect contract cross-cutting principles (MP-1) |
| Anti-mimicry negative on all pairs | Operationalising a pattern ≠ copying benchmark prose |
| Marx No Change + Photosynthesis Improvement | Pattern operationalisation effects are **obligation-specific**, not domain-guaranteed |

Sprint 45.1 adds **Model C (qualified)** to the relationship: patterns are testable intervention hypotheses whose success is measured by **unchanged contract verdicts** and associated FM/ownership evidence — not by pattern checklist pass alone.

---

## Which Relationship Is Best Supported?

**Primary relationship (best supported): Model B — Patterns as Operationalisations**

Evidence justification:

1. **Stated architecture.** 44-3 defines this relationship explicitly and it was validated through Sprint 44 delivery without contract amendment.

2. **Evaluation hierarchy preserved in 45-1.** Contracts score; patterns guide and corroborate. No evidence supports patterns superseding contracts.

3. **Minimum/Strong discrimination.** Bodies can satisfy contract minimum without Strong pattern shape (M12, M19, DT-PS baselines). Patterns operationalise the **strong bar** and associated failure avoidance — not the existence of contracts themselves.

4. **45-1 experimental logic.** Treatment conditions were named SP-02/SP-03 guided; success was defined as contract verdict improvement and FM clearance. Patterns were the **means**; contracts were the **measure**.

**Secondary relationship (45.1 extension): Model C — Patterns as Causal Hypotheses (qualified)**

45-1 supports treating patterns as **testable intervention hypotheses** in controlled generation research — but only within experiment scope (six pairs, deliberate application, convergent evaluation). This is an **empirical research role**, not a redesign of the normative contract–pattern hierarchy.

**Partial / subordinate roles:**

| Model | Status |
| ----- | ------ |
| **A — Explanations** | Valid for Sprint 44 extraction history; insufficient alone after 45-1 |
| **D — Latent structure** | Partially valid as concretisation aid; overstated as primary — contracts already contain strong/minimum criteria |

**Not supported:**

- Patterns as **replacement** for contracts
- Patterns as **independent scoring authority**
- Patterns as **complete latent contract text** that contracts lack

*Speculation:* A strict hierarchy (contracts > patterns > signals) may prove insufficient if future evidence shows systematic verdict/signal divergence on generated bodies — not observed in 45-1.

---

## Implications For Pattern-Aware Evaluation

The supported relationship (B primary, C qualified) implies:

1. **Contract verdict is the primary evidence layer.** Pattern-aware evaluation judges bodies against §5.x first; pattern names do not justify verdicts ([`pattern-aware-evaluation-position-paper.md`](pattern-aware-evaluation-position-paper.md) § Relationship To 44-2 Contracts).

2. **Detection Signals are secondary corroboration.** They indicate whether an operationalised shape appears — useful for diagnosis and superficial-match flags — but pair classifications in 45-1 followed verdict ordering.

3. **Failure modes are the diagnostic bridge.** FMs link contract weakness (why Minimum/Failed) to pattern targets (what SP-02/SP-03 avoid). FM-04 present + Minimum verdict + Minimum-only signals = coherent weak shape; FM absent + Strong verdict + Strong signals = coherent improvement.

4. **Pattern-aware evaluation is not pattern scoring.** Checklist-only success was explicitly rejected in 45-1 design. Evaluation asks whether contract realisation improved when pattern operationalisation was attempted — Model C tested through Model B means, measured by contracts.

5. **Anti-mimicry and ownership sit outside both layers.** A body can exhibit pattern-shaped features or pass ownership while failing contracts (TP-PS-A4 baseline). Operationalisation success requires convergent evidence across layers.

6. **Boundary declarations govern contract application; patterns do not resolve calibration.** M22 ambiguity is a contract interpretation issue; TP-PS-A6 handled via declared §5.8 reading, not pattern override.

---

## Implications For Future Research

Conceptual implications only — no sprint planning.

1. **Generation research should treat patterns as operational targets, contracts as success criteria.** Further injection experiments test whether additional SP entries move verdicts on matched obligations — not whether pattern checklists pass in isolation.

2. **Expansion to SP-01, SP-04–SP-06 should preserve the hierarchy.** New patterns are operationalisations of existing §5.x contracts; evaluation remains contract-primary ([`45-1-recommendation.md`](45-1-recommendation.md) gates expansion on evaluation standing).

3. **Causal claims require paired, obligation-matched evidence.** 45-1's Model C support depends on baseline/treatment comparison on identical DLA obligations — not cross-corpus analogy alone.

4. **Minimum realisation remains contract-defined, not pattern-defined.** Research should not conflate "pattern not applied" with "contract failed" or "pattern applied" with "contract satisfied" without verdict evidence.

5. **Discriminating substantive operationalisation from cosmetic shape is a core evaluation problem.** The overlap that creates apparent tension (structure looks like pattern) is resolved by multi-layer evaluation, not by collapsing patterns into contracts or contracts into patterns.

6. **Corpus regression (45-3) measures distribution shifts in contract verdicts** with pattern/FM diagnosis — not pattern adoption rates alone.

*Speculation:* If standing pattern-aware evaluation is established, patterns may eventually serve as structured authoring guidance for human reviewers — epistemic status unchanged: operationalisations subordinate to contracts.

---

## Conclusion

The relationship between contracts and patterns currently **best supported by evidence** is:

> **44-2 contracts are the primary normative specification of instructional realisation. Pattern Library entries are evidence-backed operationalisations of how to satisfy those contracts — especially the strong bar and named failure-mode avoidance — with Detection Signals as secondary observational corroboration. Sprint 45.1 additionally supports treating patterns as qualified intervention hypotheses in controlled generation research, where success is measured by unchanged contract verdicts and convergent FM/ownership evidence.**

Contracts answer: *What must this material achieve?*  
Patterns answer: *What evidenced shape operationalises that achievement, and what failure modes does it target?*  
Sprint 45.1 asked: *When that shape is deliberately applied, does the contract verdict move as predicted?*

Models A and D describe useful partial truths about pattern genesis and concretisation. Model C describes the research role opened by 45.1. **Model B is the authoritative structural relationship** — stated in 44-3, preserved in 45-1 evaluation, and required for pattern-aware evaluation.

Neither sprint supports patterns replacing, amending, or scoring above contracts.

---

## Traceability

| Section | Primary sources |
| ------- | --------------- |
| Background | `sprint-44-2` §1–2; `sprint-44-3` Purpose; `sprint-44-outcomes` Evidence Chain |
| Apparent tension | `sprint-44-2` §5.6, §5.8; SP-02, SP-03; `45-1-evidence-workbook` instructions |
| Model assessments | `sprint-44-review` Validated/Falsified; `SPRINT-45-1-CLOSURE-REVIEW`; `45-1-recommendation` |
| Best supported relationship | `sprint-44-3` § Relationship to 44-2; `45-1-evidence-workbook` pair outcomes |
| Pattern-aware evaluation implications | `pattern-aware-evaluation-position-paper` |
| Future research implications | `FRONTIER-REVIEW-AFTER-SPRINT-45-1`; `45-1-recommendation` |
