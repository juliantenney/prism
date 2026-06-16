# 45-1 Pattern Injection Experiment Design

**Date:** 2026-06-18  
**Type:** Experimental design specification  
**Status:** Accepted — design complete; execution per [45-1-experiment-execution-plan.md](45-1-experiment-execution-plan.md)  
**Predecessor:** Sprint 44 closure; [sprint-45-proposal.md](../2026-06-15-sprint-44/sprint-45-proposal.md)  
**Authority:** 44-2 contracts (normative); Pattern Library Draft 1 (subordinate); frozen benchmark corpus (comparative baseline)

---

## Purpose

Sprint 44 established that instructional material realisation — not workflow architecture or upstream pedagogy — is the active quality frontier. The 44-2 contracts discriminate Strong, Minimum, and Failed realisations on frozen Marx and Photosynthesis GAM bodies. The Pattern Library Draft 1 encodes evidence-backed strong-realisation shapes (SP-01–SP-06) and named failure modes (FM-02–FM-11), but **no experiment has tested whether those patterns can influence what generation produces**.

45-1 exists to design a controlled experiment that asks whether pattern-guided generation can move `decision_table` and `transfer_prompt` bodies toward 44-2 Strong realisation — specifically remediating FM-04, FM-02, and FM-03 — while preserving learner ownership. The experiment is bounded to two patterns with the strongest Sprint 44 evidence base (SP-02, SP-03). Outcomes are measured primarily through 44-2 verdicts, not pattern-surface mimicry.

This document specifies the experiment design only. It does not prescribe implementation mechanisms, prompt engineering, code changes, contract redesign, or pattern-library redesign.

---

## Research Question

**Can evidence-backed instructional patterns SP-02 (partial-exemplar decision table) and SP-03 (capstone transfer prompt) be deliberately induced in GAM material generation such that generated bodies show (a) target pattern detection signals, (b) improved 44-2 contract verdicts relative to baseline generation on the same DLA obligations, (c) reduced incidence of FM-04, FM-02, and FM-03, and (d) preserved learner ownership — without benchmark mimicry or scaffold-to-deliverable collapse?**

Secondary questions (informative, not gating):

- Does pattern guidance generalise across domains (Marx Strong reference vs Photosynthesis thin-realisation history), or overfit Marx exemplar shapes?
- Do treatment outputs approach frozen Strong references (Marx M13, M16) on corpus-relative comparison without copying them?

---

## Scope

| Dimension | In scope |
| --------- | -------- |
| **Patterns** | SP-02 / DT-SP-01 (`decision_table`); SP-03 / TP-SP-01 (`transfer_prompt`) only |
| **Material types** | `decision_table`, `transfer_prompt` GAM bodies |
| **Domains** | Marx (`marx-capitalism-v1`); Photosynthesis (`photosynthesis-v1`) |
| **Activities** | Evaluate- and capstone-shaped activities where DLA specifies target types: Marx A4; Photosynthesis A4; Photosynthesis A6 |
| **Inputs** | Frozen benchmark corpus DLA obligations (`design-learning-activities.json` per domain); full upstream artefact chain as already frozen; SP-02 and SP-03 pattern entries; 44-2 §5.6 and §5.8 contracts |
| **Conditions** | Baseline (pre-pattern / non-injected generation) vs treatment (pattern-guided generation) on identical DLA obligations |
| **Evaluation** | 44-2 verdicts (primary); pattern Detection Signals (secondary); FM checks; learner-ownership checks; corpus-relative comparison against frozen benchmark bodies |
| **Failure modes targeted** | FM-04 (`decision_table`); FM-02 and FM-03 (`transfer_prompt`) |

### Evidence basis for scope selection

Sprint 44 evaluation and inter-rater validation justify SP-02 and SP-03 as first-generation injection candidates:

| Criterion | SP-02 (`decision_table`) | SP-03 (`transfer_prompt`) |
| --------- | ------------------------ | --------------------------- |
| Strong reference | Marx M13 — unanimous Strong (Pass 2, Inter-Rater) | Marx M16 — unanimous Strong (Pass 2, Inter-Rater) |
| Failed / weak contrast | Photosynthesis M12, M19 — Minimum; FM-04 recorded | Photosynthesis M14 — unanimous Failed; FM-02, FM-03 |
| Inter-rater agreement | High on M13, M12, M19 — no verdict splits | High on M16 and M14; M22 boundary documented separately |
| Detection signals | Partial exemplar row; empty judgement cells; criteria linkage | Substantive body; learner-context selection; operational completion criteria; criteria linkage |
| Bounded instructional move | Single move: model evidence-gathering on one row; learner owns judgement | Single move: own-context transfer with production criteria; learner writes response |
| Learner ownership | Explicit — judgement column empty on all rows including exemplar row (M13) | Explicit — no pre-written transfer answer (M16) |

Other patterns (SP-01, SP-04, SP-05, SP-06) are intentionally deferred due to calibration sensitivity, verdict splits, or weaker Strong exemplar evidence (see Sprint 45 evidence pack § Why SP-02 and SP-03 Are First-Generation Candidates).

---

## Out of Scope

| Exclusion | Rationale |
| --------- | --------- |
| Implementation mechanisms, prompt engineering, code changes | 45-1 is design-only; injection mechanism is an open question (Q-02) |
| Patterns beyond SP-02 and SP-03 | Bounded experiment; other patterns lack equivalent evidence confidence |
| 44-2 contract redesign | Draft 1 accepted (D-10); patterns subordinate to contracts |
| Pattern Library architecture redesign | Validated Sprint 44 (D-11) |
| Ownership model, salience model, investigation/resource architecture | Settled Sprint 43; do not reopen |
| Missing-stage or missing-upstream-pedagogy hypotheses | Disproved (D-06, D-07) |
| Unevaluated material types (`modelling_note`, `rubric`, etc.) | No SP entries; no Sprint 44 verdict discrimination |
| FM-01 (stub) and FM-12 (page-composition loss) as instructional outcomes | Capture/channel artefacts (D-12); scored separately from body quality |
| Page composition, renderer, layout | Body vs composition separation (Sprint 44 evaluation method) |
| Universal Strong enforcement or semantic capture gates | 44-1 design excludes semantic depth blocking (D-14) |
| Material-level repair (45-4) | Depends on 45-1 results |
| Pattern-aware evaluation method design (45-2) | Separate slice; 45-1 defines what 45-2 will score |
| Corpus re-freezing or extension | Benchmark corpus frozen (D-15) |
| Resolving M22 own-context boundary by new rule | Document ambiguity; do not legislate via experiment design |

---

## Experimental Inputs

### SP-02 — Partial-exemplar decision table (DT-SP-01)

**Source:** [`../2026-06-15-sprint-44/patterns/SP-02-DT-SP-01-partial-exemplar-decision-table.md`](../2026-06-15-sprint-44/patterns/SP-02-DT-SP-01-partial-exemplar-decision-table.md)

| Field | Content |
| ----- | ------- |
| **Pattern ID** | SP-02 / DT-SP-01 |
| **Material type** | `decision_table` |
| **Contract anchor** | 44-2 §5.6 |
| **Intent** | Guided judgement grid with one partially completed row modelling evidence-gathering; learner-owned judgement cells remain empty |
| **Instructional problem addressed** | FM-04 — table shell without demonstrated judgement move |
| **Strong shape (abstract)** | One partial exemplar row with evidence/reasoning cells populated on that row only; judgement/decision column empty on **all** rows; remaining rows empty in learner-completion columns; row labels aligned to adjacent criteria |
| **Minimum shape (abstract)** | Proper tabular structure; adequate row count; empty learner judgement cells — **no** partial exemplar required for Minimum |
| **Strong reference** | Marx M13 (Activity A4) |
| **Contrast references** | Photosynthesis M12 (A4, Minimum, FM-04); Photosynthesis M19 (A6, Minimum, FM-04) |
| **Detection Signals (secondary)** | Minimum: usable table, empty judgement columns, no partial exemplar. Strong: one modelled row, empty judgement on all rows, distinguishable modelled vs learner-owned cells, criteria linkage |

### SP-03 — Capstone transfer prompt (TP-SP-01)

**Source:** [`../2026-06-15-sprint-44/patterns/SP-03-TP-SP-01-capstone-transfer-prompt.md`](../2026-06-15-sprint-44/patterns/SP-03-TP-SP-01-capstone-transfer-prompt.md)

| Field | Content |
| ----- | ------- |
| **Pattern ID** | SP-03 / TP-SP-01 |
| **Material type** | `transfer_prompt` |
| **Contract anchor** | 44-2 §5.8 |
| **Intent** | Require application in learner-selected or owned context with explicit production requirements, multiple application cues, and session criteria linkage |
| **Instructional problems addressed** | FM-02 (thin body; no operational completion criterion); FM-03 (third-person procedural transfer without own-context) |
| **Strong shape (abstract)** | Learner-context selection; operational word/element band; multiple application bullets; criteria linkage; framework bridge; capstone placement; no pre-written learner response |
| **Failed floor (abstract)** | Body too thin; no operational completion criterion; third-person claim-correction only |
| **Strong reference** | Marx M16 (Activity A4) |
| **Failed contrast** | Photosynthesis M14 (A4, unanimous Failed) |
| **Boundary case (document, do not resolve)** | Photosynthesis M22 (A6) — Pass 2 Minimum / Inter-Rater Failed on own-context conjunctive minimum |
| **Detection Signals (secondary)** | Strong: capstone placement, completion criterion, learner-context selection, multiple cues, criteria linkage, no pre-written response. Failed: M14-scale thinness, no word band, third-person correction only |

### 44-2 contracts (normative evaluation framework)

**Source:** [`../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md`](../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md)

| Contract section | Role in 45-1 |
| ---------------- | ------------ |
| **§4 Cross-cutting principles** | Scaffold ≠ deliverable; criteria before judgement; own-context transfer — govern ownership checks |
| **§5.6 `decision_table`** | Primary verdict rubric for SP-02 outputs |
| **§5.8 `transfer_prompt`** | Primary verdict rubric for SP-03 outputs |
| **§7 Realisation depth rubric** | Failed / Minimum / Strong classification — unchanged; no new tiers |

Patterns operationalise strong-realisation features within these contracts. Verdicts are justified by §5.6 and §5.8, not by pattern checklist alone.

### Frozen Marx / Photosynthesis benchmark corpus

**Source:** [`../2026-06-15-sprint-44/benchmark-corpus/`](../2026-06-15-sprint-44/benchmark-corpus/)

| Domain | Corpus ID | GAM bodies | DLA obligations |
| ------ | --------- | ---------- | --------------- |
| Marx | `marx-capitalism-v1` | `activity-materials.txt` | `design-learning-activities.json` |
| Photosynthesis | `photosynthesis-v1` | `learning-materials.txt` | `design-learning-activities.json` |

**Evaluation unit:** GAM material **bodies** only. Page composition (`page.json`, rendered HTML) is a separate channel and must not be conflated with instructional body scoring.

**Corpus role in 45-1:**

- **Regression reference** — frozen bodies provide Strong, Minimum, and Failed anchors for corpus-relative comparison
- **DLA anchor** — obligations define *what* must be generated; experiment holds DLA constant across baseline and treatment
- **Not a copy target** — treatment success is not reproduction of Marx M13/M16 text; it is contract improvement on the same obligations

### FM-04 — Decision-table shell without partial exemplar

| Field | Content |
| ----- | ------- |
| **Type** | Instructional failure mode (Secondary Index) |
| **Definition** | Usable grid structure with adequate rows and empty learner cells, but no modelled row demonstrating the evidence-before-judgement move |
| **Benchmark evidence** | Photosynthesis M12, M19 — scored Minimum (not Failed) in all passes; FM-04 recorded as weakness |
| **SP-02 remediation shape** | One partial exemplar row with populated evidence/reasoning cells; judgement column empty on all rows (M13) |
| **45-1 success indicator** | FM-04 absent or reduced in treatment vs baseline on `decision_table` bodies where DLA specifies evaluate/compare judgement |

### FM-02 — Thin transfer body

| Field | Content |
| ----- | ------- |
| **Type** | Instructional failure mode |
| **Definition** | Transfer slot present but body too thin to guide production; no operational completion criterion |
| **Benchmark evidence** | Photosynthesis M14 — unanimous Failed; Pass 2: "body too thin to guide production beyond a single sentence task" |
| **SP-03 remediation shape** | Substantive body with stated word/element band and multi-cue structure (M16) |
| **45-1 success indicator** | FM-02 absent in treatment `transfer_prompt` bodies on capstone/transfer-designated activities |

### FM-03 — Third-person procedural transfer

| Field | Content |
| ----- | ------- |
| **Type** | Instructional failure mode |
| **Definition** | Transfer framed as third-person claim correction or generic scenario without learner-context selection |
| **Benchmark evidence** | Photosynthesis M14 — unanimous Failed; M22 flagged in Inter-Rater when own-context absent despite completion band |
| **SP-03 remediation shape** | Learner-context selection (M16 platform choice) |
| **45-1 success indicator** | FM-03 absent in treatment outputs; reviewer can identify what context the learner selects or owns |

### Learner ownership constraints

Derived from Sprint 43 architecture, 44-2 §4 cross-cutting principles, MP-1 (scaffold ≠ deliverable), and SP-02/SP-03 Detection Signals. These are **mandatory** in both baseline and treatment evaluation; treatment must not trade ownership for pattern surface features.

| Material move | Learner must own | Treatment must not supply |
| ------------- | ---------------- | --------------------------- |
| **Decision / judgement** (`decision_table`) | Evaluative conclusion in empty judgement/rating/decision cells | Pre-filled ratings, rank ordinals, or final judgements in learner columns |
| **Partial exemplar (SP-02)** | Judgement on the modelled row and all other rows | Completed judgement column on any row, including the exemplar row (M13 kept Judgement blank on exemplar row) |
| **Transfer (SP-03)** | Context selection (where applicable) and written transfer production | Pre-written transfer essay or completed learner response in the material body |
| **Cross-cutting** | Independent performance of the instructional move after scaffolding | Scaffold that completes the learner's assigned `expected_output` deliverable |

**Ownership check protocol (for 45-2):**

1. Identify cells, prompts, or sections designated learner-owned per 44-2 §5.6 / §5.8 and activity `expected_output`.
2. Confirm treatment bodies leave those loci empty or assign production to the learner explicitly.
3. Flag any increase in pre-filled judgement or pre-written transfer relative to baseline as an ownership regression — regardless of pattern signal presence.

---

## Baseline Condition

**Definition:** Pre-pattern / non-injected generation is GAM material-body production for target `decision_table` and `transfer_prompt` slots using the **frozen benchmark DLA obligations and upstream artefact chain**, **without** SP-02 or SP-03 pattern specifications informing generation intent.

### What baseline represents

Baseline approximates the Sprint 44 corpus generation regime — the conditions that produced the frozen bodies now scored against 44-2. It is the counterfactual: *what does generation produce when patterns are observational artefacts only, not generation guidance?*

### Baseline anchors from frozen corpus

| Material | Type | Domain | Activity | Frozen verdict | Relevant FMs |
| -------- | ---- | ------ | -------- | -------------- | ------------ |
| M13 | `decision_table` | Marx | A4 | Strong | — (not baseline weakness) |
| M12 | `decision_table` | Photosynthesis | A4 | Minimum | FM-04 |
| M19 | `decision_table` | Photosynthesis | A6 | Minimum | FM-04 |
| M16 | `transfer_prompt` | Marx | A4 | Strong | — |
| M14 | `transfer_prompt` | Photosynthesis | A4 | Failed | FM-02, FM-03 |
| M22 | `transfer_prompt` | Photosynthesis | A6 | Minimum (P2) / Failed (IR) | FM-03 risk |

**Important:** Frozen corpus bodies are **historical baseline evidence**, not re-generated baseline runs. Where new baseline generation is executed in a future approved experiment, it must use identical DLA obligations and be scored independently. Expected baseline weakness on Photosynthesis-shaped obligations: FM-04 on decision tables; FM-02/FM-03 on transfer prompts — matching Sprint 44 Pass 2 findings.

### Baseline generation invariants

Held constant between baseline and treatment:

- Domain (Marx or Photosynthesis)
- Activity ID and evaluate/capstone shape
- DLA `required_materials` obligations for target slots (type, purpose, specification text)
- Upstream artefacts as frozen in benchmark corpus
- Material type targets (`decision_table`, `transfer_prompt` only)
- Evaluation rubric (44-2 §5.6, §5.8)

**Variable:** Whether SP-02 and SP-03 pattern specifications inform generation intent (absent in baseline; present in treatment).

### What baseline is not

- Not an excuse to re-litigate DLA obligations or upstream pedagogy
- Not scored against pattern Detection Signals as a success criterion (baseline may lack Strong pattern signals by definition)
- Not a channel to blame FM-01/FM-12 for instructional weakness on target bodies

---

## Treatment Condition

**Definition:** Pattern-guided generation is GAM material-body production for the same target slots, obligations, and upstream inputs as baseline, **with SP-02 and SP-03 pattern specifications informing generation intent** for `decision_table` and `transfer_prompt` bodies respectively.

### Conceptual specification

Treatment generation is **guided by** the evidence-backed shapes in SP-02 and SP-03 — not by ad hoc prompt folklore or unconstrained Strong-exemplar imitation. Conceptually, the generator receives:

| Target type | Pattern guidance conveys |
| ----------- | ------------------------ |
| `decision_table` | SP-02 intent, minimum/strong shapes, failure modes avoided (FM-04), and Detection Signals as **generation targets** — especially: one partial exemplar row with evidence cells populated; judgement column empty on all rows; row labels aligned to task criteria |
| `transfer_prompt` | SP-03 intent, strong shape, failure modes avoided (FM-02, FM-03), and Detection Signals — especially: substantive body; operational completion criterion; learner-context selection; multiple application cues; session criteria linkage; no pre-written learner response |

### Treatment invariants (non-negotiable)

1. **Contract subordination** — pattern guidance serves 44-2 §5.6 and §5.8; it does not override them or introduce new verdict tiers.
2. **Learner ownership preservation** — pattern guidance scaffolds the move; it does not complete learner judgement or transfer production (MP-1).
3. **Obligation fidelity** — treatment must realise the DLA-specified material for the activity; it must not redesign activity structure, archetype, or session arc.
4. **Domain-appropriate content** — treatment outputs must reflect domain knowledge and activity context (Marx evaluate arc vs Photosynthesis evaluate/capstone arc), not transplant Marx M13/M16 prose into Photosynthesis slots.
5. **Anti-mimicry** — treatment success is not lexical or structural copying of frozen Strong bodies; it is contract-compliant realisation on the obligation set.

### Treatment is not

- Benchmark corpus pastiche (copying M13/M16 table rows or transfer bullets verbatim across domains)
- Pre-filled deliverables disguised as scaffolds (full grid completion; supplied transfer essay)
- An expansion to other patterns or material types
- A substitute for 44-2 evaluation ("pattern checklist passed" ≠ success)

*How* pattern specifications reach the generator is explicitly out of scope for this design document (Q-02 remains open).

---

## Required Output Set

The experiment requires paired baseline and treatment GAM bodies for each target slot below. All outputs are scored as material bodies per 44-2; adjacent materials (criteria exposition, scenarios, rubrics) remain as frozen corpus context for linkage checks but are not re-generated in 45-1.

### `decision_table`

| Output ID | Domain | Activity | DLA context | Frozen reference | Expected baseline weakness | Treatment target |
| --------- | ------ | -------- | ----------- | ---------------- | -------------------------- | ---------------- |
| DT-MRX-A4 | Marx | A4 — *Was Marx Right? Final Evaluation* | Three criteria rows; DLA specifies partial exemplar | M13 (Strong) | Low — corpus already Strong; treatment should maintain or justify equivalence | SP-02 Strong signals; FM-04 absent |
| DT-PS-A4 | Photosynthesis | A4 — *Evaluating Misconceptions* | Two claim rows; DLA specifies model row | M12 (Minimum, FM-04) | FM-04 likely | SP-02 Strong signals; verdict ≥ Minimum with FM-04 absent; Strong target |
| DT-PS-A6 | Photosynthesis | A6 — capstone | Three factor rows | M19 (Minimum, FM-04) | FM-04 likely | SP-02 Strong signals; FM-04 absent; Strong target |

**Per-output minimum body requirements (from DLA + 44-2 §5.6):**

- Proper pipe-markdown tabular structure with headers and task-adequate row count
- Learner judgement/decision cells empty
- Treatment additionally targets: one partial exemplar row (SP-02 Strong shape) where evaluate/compare arc warrants guided judgement

### `transfer_prompt`

| Output ID | Domain | Activity | DLA context | Frozen reference | Expected baseline weakness | Treatment target |
| --------- | ------ | -------- | ----------- | ---------------- | -------------------------- | ---------------- |
| TP-MRX-A4 | Marx | A4 — capstone; `purpose: transfer` | Apply evaluation lens to new context | M16 (Strong) | Low — corpus already Strong | SP-03 Strong signals; FM-02/FM-03 absent |
| TP-PS-A4 | Photosynthesis | A4; `purpose: transfer` | Transfer on misconception evaluate arc | M14 (Failed) | FM-02, FM-03 likely | Verdict ≥ Minimum; FM-02/FM-03 absent; Strong target |
| TP-PS-A6 | Photosynthesis | A6 — capstone; `purpose: transfer` | Capstone transfer | M22 (boundary) | FM-03 risk; verdict unstable | SP-03 Strong signals per M16 shape; document M22-boundary handling in review |

**Per-output minimum body requirements (from DLA + 44-2 §5.8):**

- Capstone or transfer-designated placement
- Treatment targets: substantive body; operational completion criterion; learner-context selection; multiple application cues where Strong is the goal; criteria linkage to session arc; no pre-written learner transfer text

### Output set summary

| Condition | `decision_table` count | `transfer_prompt` count | Total bodies |
| --------- | ---------------------- | ------------------------- | ------------ |
| Baseline | 3 | 3 | 6 |
| Treatment | 3 | 3 | 6 |
| **Paired comparison** | 3 obligation-matched pairs | 3 obligation-matched pairs | **6 pairs** |

---

## Evaluation Method

Evaluation follows Sprint 44 conventions: body quality scored separately from composition/capture channel. Three evidence layers apply in strict priority order.

### Layer 1 — 44-2 verdicts (primary)

| Material type | Contract | Verdict scale |
| ------------- | -------- | ------------- |
| `decision_table` | §5.6 | Failed / Minimum / Strong |
| `transfer_prompt` | §5.8 | Failed / Minimum / Strong |

**Procedure:**

1. Score each baseline and treatment body independently against §5.6 or §5.8.
2. Record verdict with brief justification citing contract bullets (not pattern names alone).
3. Compare paired outputs: baseline verdict → treatment verdict (improvement, hold, regression).
4. Apply §7 depth rubric consistently with Sprint 44 Pass 2 and Inter-Rater Validation precedents.

**Primary outcome measure:** Distribution of verdicts on treatment bodies and **paired delta** vs baseline on identical DLA obligations. Pattern presence without verdict improvement does not constitute success.

### Layer 2 — Pattern Detection Signals (secondary)

Apply SP-02 and SP-03 Detection Signals checklists to treatment bodies (and baseline for diagnostic comparison).

| Pattern | Signal categories |
| ------- | ----------------- |
| SP-02 | Minimum signals; Strong signals (partial exemplar row, empty judgement on all rows, modelled vs learner-owned distinguishable, criteria linkage) |
| SP-03 | Strong signals; Failed signals; boundary flags for M22-like bodies |

**Role:** Secondary corroboration. Detection Signals confirm *how* contract improvement manifests — or reveal superficial pattern matching when verdicts do not improve. A treatment body may pass Detection Signals but score Minimum if ownership is violated or strong bar is not met (e.g. exemplar row with pre-filled judgement).

### Layer 3 — Failure Mode checks

| FM | Apply to | Record |
| -- | -------- | ------ |
| FM-04 | `decision_table` bodies | Present / absent; note if Minimum despite FM-04 (M12/M19 precedent) |
| FM-02 | `transfer_prompt` bodies | Present / absent |
| FM-03 | `transfer_prompt` bodies | Present / absent; flag M22-boundary cases |

Compare FM incidence: baseline vs treatment per paired output. Targeted reduction on Photosynthesis-shaped obligations is the key diagnostic.

### Layer 4 — Learner ownership checks

Mandatory pass/fail gate independent of verdict:

| Check | `decision_table` | `transfer_prompt` |
| ----- | ---------------- | ------------------- |
| Learner judgement cells empty | Required | N/A |
| No pre-filled ratings/rank ordinals | Required | N/A |
| Exemplar row does not complete judgement column | Required (SP-02) | N/A |
| No pre-written transfer response | N/A | Required |
| Learner-context selection or own-context framing | N/A | Required for Strong; document if absent (FM-03 risk) |

**Ownership regression:** Any treatment output that fills learner-owned loci that baseline left empty → failure regardless of pattern signals.

### Layer 5 — Corpus-relative comparison

Compare treatment bodies against frozen benchmark anchors:

| Comparison type | Question |
| --------------- | -------- |
| **Strong reference proximity** | Does treatment move Photosynthesis weak bodies toward Marx Strong feature set (M13, M16) without copying them? |
| **Weak reference distance** | Does treatment avoid M12/M19/M14 failure shapes? |
| **Cross-domain generalisation** | Does Photosynthesis treatment improve more than Marx treatment (where corpus is already Strong)? |
| **Non-target regression** | Do non-target materials in the same generation run regress? (Recorded; full regression is 45-3 scope) |

Corpus comparison is **relative** — feature and verdict alignment, not text overlap scoring.

### Evaluation conventions (inherited from Sprint 44)

- Score GAM body text only; do not penalise instructional bodies for FM-12 page-composition loss in the same pass.
- Record FM-01 stub emission if present, but classify as capture artefact — not SP-02/SP-03 instructional failure.
- For M22-like transfer bodies, declare which §5.8 minimum interpretation is applied (Pass 2 compensatory vs Inter-Rater conjunctive) in the review record.
- DLA cross-check: if DLA specifies partial exemplar and body has none, record FM-04 even when Minimum threshold is met (M12 precedent).

---

## Success Criteria

A treatment output (or the experiment overall) succeeds only when **multiple evidence types align**. Pattern signals alone are insufficient.

### Per-output success (treatment body)

| Criterion | Threshold | Evidence source |
| --------- | --------- | --------------- |
| **Contract improvement** | Treatment verdict strictly better than paired baseline on same obligation, **or** baseline already Strong and treatment maintains Strong without ownership regression | 44-2 §5.6 / §5.8 |
| **Target FM absent** | FM-04 absent (`decision_table`); FM-02 and FM-03 absent (`transfer_prompt`) | Pattern Library Secondary Index |
| **Ownership preserved** | All learner-ownership checks pass | §4 principles; SP-02/SP-03 guards |
| **Pattern signals present** | SP-02 Strong signals (`decision_table`) or SP-03 Strong signals (`transfer_prompt`) confirmed on treatment body | Detection Signals (secondary) |

**Minimum per-output success:** Verdict improvement (or Strong maintained) + target FM absent + ownership preserved.

**Strong per-output success:** Above + Strong verdict + full Strong Detection Signal set.

### Experiment-level success

| Criterion | Threshold |
| --------- | --------- |
| **Photosynthesis remediation** | Majority of Photosynthesis paired outputs (DT-PS-A4, DT-PS-A6, TP-PS-A4, TP-PS-A6) show verdict improvement or FM clearance vs baseline |
| **No systematic ownership regression** | Zero treatment outputs fill learner-owned judgement or transfer loci |
| **Cross-domain signal** | At least one Photosynthesis `decision_table` and one Photosynthesis `transfer_prompt` reach Strong with SP-02/SP-03 signals — not only Marx |
| **Not mimicry** | Reviewers confirm treatment bodies are domain-appropriate and not verbatim copies of M13/M16 |
| **Primary measure met** | 44-2 verdict distribution shifts toward Strong on target types without Failed increase |

Experiment-level success does **not** require universal Strong on all six treatment bodies. Bounded improvement on Photosynthesis weak slots with Marx Strong maintained is the expected Sprint 44-aligned outcome.

---

## Failure Criteria

### Per-output failure (treatment body)

| Condition | Classification |
| --------- | -------------- |
| Verdict regression vs paired baseline | Failure |
| Target FM present in treatment (FM-04, FM-02, or FM-03) | Failure |
| Learner ownership violation (pre-filled judgement, pre-written transfer, completed exemplar judgement) | Failure — regardless of pattern signals |
| Pattern signals present but verdict unchanged or worse | **Superficial pattern match** — failure |
| Failed verdict on treatment where baseline was Minimum or better | Failure |
| Benchmark mimicry: domain-inappropriate copying of M13/M16 content | Failure (process + outcome) |

### Experiment-level failure

| Condition | Implication |
| --------- | ----------- |
| No Photosynthesis paired output improves vs baseline | Pattern guidance does not generalise; do not proceed to broader injection |
| Treatment increases FM-02/FM-03/FM-04 vs baseline aggregate | Pattern guidance ineffective or harmful |
| Systematic ownership regression across treatment set | Pattern guidance violates MP-1; halt injection approach |
| Strong Detection Signals on majority of outputs without verdict improvement | Patterns operate as prompt folklore — not instructional improvement |
| Marx treatment bodies regress from Strong references while chasing pattern surface features | Overfitting or mimicry failure |

### Inconclusive (not success, not hard failure)

| Condition | Handling |
| --------- | -------- |
| M22-boundary transfer outputs score Minimum under one interpretation, Failed under another | Document; do not treat as SP-03 validation or invalidation alone |
| Marx outputs hold Strong with no delta vs already-Strong corpus | Expected; not experiment failure |
| FM-01 stub on treatment output | Capture issue; repair or re-run; do not score as SP-02/SP-03 failure |

---

## Evidence Standard

### What constitutes a meaningful result

A meaningful 45-1 result requires **convergent evidence** across primary and secondary layers:

```text
Pattern Detection Signals present
        AND
44-2 contract verdict improvement (or Strong maintained on already-Strong obligations)
        AND
FM-04 / FM-02 / FM-03 reduction on targeted Photosynthesis-shaped outputs
        AND
Learner ownership preserved
        AND
Corpus-relative comparison shows movement toward Strong feature set — not benchmark text reproduction
```

**Meaningful** means an evaluator can trace: *this body performs the instructional move better because evidence-gathering is modelled / transfer production is guidable* — not merely *this body has a filled first row / a word count / four bullets*.

### What does not constitute evidence of success

| False positive shape | Why it fails the standard |
| -------------------- | ------------------------- |
| **Benchmark mimicry** | Copying M13 row content or M16 bullet structure into Photosynthesis without domain-appropriate instructional function |
| **Superficial pattern matching** | Partial exemplar row with pre-filled judgement; transfer with word band but third-person correction only (M14 shape with cosmetic band) |
| **Scaffold → deliverable collapse** | Full grid pre-completed; transfer essay supplied in body — violates MP-1 even if tables look "complete" |
| **Pattern signals without contract improvement** | Detection checklist passes but verdict holds at Minimum or Failed (M12 has structure without exemplar — pattern signal absence is not the only failure mode) |
| **Presence = success** | Transfer slot populated with thin body — the Sprint 43/44 lesson; M14 had presence, Failed unanimously |
| **Capture artefact misclassified** | FM-01 stub or FM-12 composition loss scored as FM-04 or FM-02 instructional failure |

### Evidence documentation standard

Follow Sprint 44 evidence chain:

```text
Frozen DLA obligations
    → baseline generation bodies
    → treatment generation bodies
    → 44-2 verdict (primary) + Detection Signals (secondary) + FM + ownership checks
    → paired comparison + corpus-relative notes
    → experiment record with direct body citations
```

Each verdict must cite contract bullets and, where applicable, frozen benchmark IDs (M12, M13, M14, M16, M19, M22) for comparison — not pattern names in isolation.

---

## Risks and Controls

| Risk | Description | Control |
| ---- | ----------- | ------- |
| **Benchmark mimicry** | Generator reproduces M13/M16 lexical or structural templates in wrong domain; looks Strong superficially | Corpus-relative comparison checks domain appropriateness; reviewers flag verbatim/copy-paste; success requires obligation-matched improvement not text overlap |
| **Scaffold becoming deliverable** | Pattern "help" fills learner judgement cells or supplies transfer essay to meet Strong shape | Mandatory ownership checks; SP-02 requires empty judgement on **all** rows; SP-03 forbids pre-written response; MP-1 as hard gate |
| **Pre-filled learner judgement** | Partial exemplar row includes completed Correct/Incorrect, rating, or rank | SP-02 Detection Signal: judgement column empty on exemplar row (M13 precedent); Failed per §5.6 if ratings pre-supplied |
| **Pre-written transfer answers** | Transfer prompt body contains model transfer text | §5.8 failure mode; SP-03 Failed signal; ownership check fail |
| **Pattern signals without contract improvement** | Filled first row or word band present but body still Minimum/Failed | Primary outcome is 44-2 verdict; Detection Signals are secondary; superficial match classified as experiment failure |
| **Capture/channel artefacts misclassified as instructional failures** | FM-01 `"as above"` stub or FM-12 page loss scored as FM-04 or FM-02 | Body vs composition separation; FM-01/FM-12 documented under Conventions, not SP-02/SP-03 remediation |
| **M22 boundary unresolved** | Photosynthesis capstone transfer treated as success or failure inconsistently | Document minimum interpretation used; do not resolve by new rule; M16 is unambiguous Strong target |
| **Marx overfitting** | Treatment learns Marx Strong shapes; Photosynthesis unchanged | Require Photosynthesis paired improvements for experiment-level success |
| **Pattern folklore** | Pattern checklists replace 44-2 in practice | Evaluation method mandates verdict-first scoring; patterns subordinate to contracts (D-10, D-11) |
| **Obligation drift** | Generation changes DLA or activity structure to make pattern easier | Hold DLA and upstream artefacts constant; obligation fidelity as treatment invariant |
| **Calibration expansion** | Pressure to add SP-01, SP-04, SP-05, SP-06 before 45-1 resolves | Scope lock: SP-02 and SP-03 only; deferred patterns documented in Sprint 45 evidence pack |

---

## Recommendation Gate

Progression to **45-2 Pattern-Aware Evaluation** (and subsequently 45-3 corpus regression) requires the following evidence from an approved 45-1 experiment run. Design approval alone does not satisfy this gate.

### Gate 1 — Design completeness (pre-implementation)

| Requirement | Status when met |
| ----------- | --------------- |
| 45-1 design document accepted | This document reviewed and approved |
| Scope locked to SP-02 + SP-03 | No expansion to other patterns in experiment charter |
| Evaluation method specifies verdict-first, ownership-mandatory scoring | § Evaluation Method |
| Required output set defined per obligation | § Required Output Set |
| Baseline and treatment conditions defined without mechanism assumption | § Baseline / Treatment Conditions |

*Gate 1 is satisfied by design approval. Gates 2–4 require experiment execution — out of scope for this document but specified here for continuity.*

### Gate 2 — Experiment execution evidence (required before 45-2 method finalisation)

| Evidence | Minimum threshold |
| -------- | ----------------- |
| **Paired output set complete** | 6 baseline + 6 treatment bodies for defined slots |
| **Primary verdict data** | All 12 bodies scored against 44-2 §5.6 / §5.8 |
| **FM incidence recorded** | FM-04, FM-02, FM-03 per body |
| **Ownership audit complete** | Pass/fail per body; zero regressions for 45-2 to build on |
| **Detection Signals recorded** | SP-02 and SP-03 checklists applied to treatment set |

### Gate 3 — Outcome evidence (required before 45-3 regression or pattern expansion)

| Evidence | Minimum threshold |
| -------- | ----------------- |
| **Meaningful result demonstrated** | Meets § Evidence Standard on ≥50% of Photosynthesis paired outputs |
| **No experiment-level failure** | None of § Experiment-level failure conditions met |
| **Convergent improvement** | Verdict improvement + FM reduction + ownership preserved on at least DT-PS-A4 and TP-PS-A4 |
| **Anti-mimicry confirmed** | Reviewer attestation that improvement is instructional, not corpus copy |
| **Mechanism-agnostic learning** | Document which pattern features correlated with verdict improvement — for 45-2 method either way |

### Gate 4 — Negative result handling (valid outcome)

If experiment-level failure occurs, the following evidence is still required before 45-2:

| Evidence | Purpose |
| -------- | ------- |
| Documented superficial matches | Distinguish pattern folklore from viable guidance |
| Ownership regression analysis | Determine if patterns inherently encourage deliverable collapse |
| Photosynthesis vs Marx delta | Inform whether injection generalises or needs domain-conditional shapes |
| Recommendation: halt, revise, or scope-reduce injection | Do not proceed to SP-01/SP-04/SP-05/SP-06 injection without 45-1 learning |

### What 45-2 may assume if Gate 3 passes

- 44-2 remains the sole verdict authority
- Detection Signals are a validated secondary layer — not a parallel rubric
- FM-04, FM-02, FM-03 are the primary negative constraints for `decision_table` and `transfer_prompt` evaluation
- Learner ownership checks are mandatory gates, not optional annotations
- M22-boundary bodies require declared minimum interpretation

### What must not proceed regardless of gate

| Action | Blocker |
| ------ | ------- |
| Inject SP-01, SP-04, SP-05, SP-06 without 45-1 outcome | Calibration-sensitive; weaker evidence |
| Treat pattern checklists as sufficient success | Violates D-10, D-11 |
| Implement semantic Strong gates from 45-1 results | 44-1 scope excludes (D-14) |
| Redesign 44-2 or Pattern Library from 45-1 | Closed Sprint 44 deliverables |

---

## Traceability

| Link | Reference |
| ---- | --------- |
| **Sprint 45 proposal** | [`../2026-06-15-sprint-44/sprint-45-proposal.md`](../2026-06-15-sprint-44/sprint-45-proposal.md) |
| **Sprint 45 slice index** | [`sprint-45-slice-index.md`](sprint-45-slice-index.md) |
| **44-2 contracts** | [`../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md`](../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md) |
| **Pattern Library** | [`../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md`](../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md) |
| **SP-02** | [`../2026-06-15-sprint-44/patterns/SP-02-DT-SP-01-partial-exemplar-decision-table.md`](../2026-06-15-sprint-44/patterns/SP-02-DT-SP-01-partial-exemplar-decision-table.md) |
| **SP-03** | [`../2026-06-15-sprint-44/patterns/SP-03-TP-SP-01-capstone-transfer-prompt.md`](../2026-06-15-sprint-44/patterns/SP-03-TP-SP-01-capstone-transfer-prompt.md) |
| **Benchmark corpus** | [`../2026-06-15-sprint-44/benchmark-corpus/`](../2026-06-15-sprint-44/benchmark-corpus/) |
| **Evidence pack** | [`context-pack/03-evidence-pack.md`](context-pack/03-evidence-pack.md) |
| **Educational theory** | [`context-pack/04-current-educational-theory.md`](context-pack/04-current-educational-theory.md) |
| **Settled decisions** | [`context-pack/02-settled-decisions-register.md`](context-pack/02-settled-decisions-register.md) |

---

## Document Status

| Field | Value |
| ----- | ----- |
| **Type** | Design specification only |
| **Implementation** | Not authorised by this document |
| **Next slice** | 45-2 Pattern-Aware Evaluation (depends on Gate 2–3 evidence) |
| **Approval** | Requires explicit review per APPROVE WITH MODIFICATIONS recommendation |
