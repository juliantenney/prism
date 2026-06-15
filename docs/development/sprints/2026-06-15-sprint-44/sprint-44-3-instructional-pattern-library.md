# Sprint 44-3 Instructional Pattern Library

**Date:** 2026-06-15  
**Type:** Educational design architecture — pattern library structure  
**Status:** Draft 1 (architecture only)  
**Predecessor:** [`sprint-44-2-instructional-depth-contracts.md`](sprint-44-2-instructional-depth-contracts.md)  
**Evidence basis:** Sprint 44-2 Evaluation Pass 1, Pass 2, Inter-Rater Validation; Sprint 44-3 Readiness Assessment  
**Audience:** Learning designers, educational reviewers, downstream specification authors

---

## Purpose

This document defines the **architecture** of the Sprint 44-3 Instructional Pattern Library. It establishes indexes, slot structures, conventions, and evidence traceability. It does **not** contain authored pattern entries.

### Relationship to 44-2 contracts

44-2 contracts state what each material type must achieve — educational purpose, minimum realisation, strong realisation, and failure modes. The pattern library **extends** 44-2 by supplying reusable **shapes** (minimum and strong) that satisfy those contracts. Patterns do not replace, revise, or restate contract text. Every pattern slot anchors to a specific 44-2 §5.x contract section. **Pattern Library Meta-Principles** (MP-1–MP-8) document observed cross-pattern regularities from authored entries; they are subordinate to 44-2 contracts and do not add evaluation criteria.

### Relationship to benchmark corpus

Patterns are derived from frozen benchmark artefacts:

| Corpus | Location |
| ------ | -------- |
| Marx | `benchmark-corpus/marx/activity-materials.txt` |
| Photosynthesis | `benchmark-corpus/photosynthesis/learning-materials.txt` |
| DLA obligations | `benchmark-corpus/{domain}/design-learning-activities.json` |

Benchmark materials are cited by **material ID** (e.g. Marx M13) as exemplar pointers. Pattern authoring must not copy corpus prose verbatim into the library; exemplars are traceability references only.

### Relationship to evaluation evidence

Three evaluation passes and one readiness assessment supply the evidence base:

| Document | Role |
| -------- | ---- |
| Sprint 44-2 Evaluation Pass 1 | Sentinel evaluation — `text`, `worked_example` discrimination |
| Sprint 44-2 Evaluation Pass 2 | Target evaluation — verification, transfer, judgement, closure |
| Sprint 44 Inter-Rater Validation | Independent cross-type scoring; boundary-variance documentation |
| Sprint 44-3 Readiness Assessment | Authorisation to begin Draft 1; hybrid structure recommendation |

Strong patterns (SP-01–SP-06) and failure modes (FM-02–FM-11) entered in this library appear **only** where supported by at least one evaluation pass with direct corpus citation. Capture artefacts (FM-01 stub emission, FM-12 page-composition loss) are documented in Conventions and excluded from instructional pattern indexes.

---

## Scope

### In scope

Material types with evaluation evidence sufficient for pattern slots:

| Material type | 44-2 anchor | Evaluation coverage |
| ------------- | ----------- | ------------------- |
| `text` | §5.1 | Pass 1, Inter-Rater |
| `worked_example` | §5.2 | Pass 1, Inter-Rater |
| `checklist` | §5.7 | Pass 2, Inter-Rater |
| `transfer_prompt` | §5.8 | Pass 2, Inter-Rater |
| `decision_table` | §5.6 | Pass 2, Inter-Rater |
| `consolidation_summary` | §5.9 | Pass 2, Inter-Rater |

Plus:

| Convention | 44-2 anchor | Notes |
| ---------- | ----------- | ----- |
| `template` / `independent_judgement` | §5.9 scaffold principles + cross-cutting scaffold ≠ deliverable | No named 44-2 type; evaluation-method convention applies |

### Out of scope

The following 44-2 material types are **not** indexed until benchmark evaluation provides evidence:

- `modelling_note` (§5.3)
- `misconception_note` (§5.4)
- `sample_output` (§5.5)
- `rubric` (§5.10)
- `quality_criteria` (§5.11)

### Explicit exclusions

| Exclusion | Owner |
| --------- | ----- |
| Capture artefacts (stub emission, page-composition loss) | 44-1 capture gate; Conventions in this document |
| Prompt wording, validator logic, renderer behaviour | Out of Sprint 44-3 scope |
| Contract revision | 44-2 Draft 1 is settled |
| Full pattern entry prose | Future authoring pass |

---

## Conventions

These conventions carry forward from the evaluation programme. They govern how patterns are validated against benchmark evidence and how reviewers apply the library alongside 44-2 contracts.

### Template mapping rule

**Applies to:** `template`, `independent_judgement`, and equivalent judgement-scaffold materials (e.g. Marx M14, Photosynthesis M20).

**Rule:** Evaluate and pattern-map via **§5.9 `consolidation_summary` scaffold principles** and the cross-cutting principle **scaffold ≠ deliverable**. A template succeeds when it structures independent learner judgement without supplying the completed capstone response.

**Pattern implications:**

- Minimum shape: labelled sections (claim, evidence, counterpoint, conclusion or equivalent) with empty learner-completion prompts.
- Strong shape: word band stated; sentence starters or section prompts that guide without filling; explicit preservation of learner agency.
- Anti-patterns: pre-written synthesis; capstone spoiler; labels only without structural depth (FM-10).

**Evidence:** Pass 2 applied this mapping to Marx M14 (Strong) and Photosynthesis M20 (Minimum). Inter-Rater scored Marx M14 Minimum — boundary documented under SP-05 / FM-10.

### Stub detection rule

**Applies to:** Any material body that is a pointer, reference, or label without checkable instructional content.

**Rule:** Score the **GAM body literally**. A body reading `Material: M13 (checklist) — as above` or equivalent pointer text performs **no instructional function** regardless of DLA obligation upstream.

**Pattern implications:**

- Stub bodies are **not** instructional anti-patterns; they are **capture failures** (44-1 domain).
- The pattern library does not define remediation patterns for stubs.
- Authors validating drafts must reject pointer-only bodies before pattern matching.

**Evidence:** Photosynthesis M13 (Failed, all passes); Photosynthesis M17 (same `"as above"` pattern noted in Pass 2, out of Inter-Rater target set).

### Body vs composition rule

**Applies to:** All material types when citing benchmark evidence.

**Rule:** Distinguish two quality channels:

| Channel | What it measures | Example |
| ------- | ---------------- | ------- |
| **Instructional body quality** | Whether the GAM material body performs its 44-2 educational function | Marx M13 partial-exemplar row in `activity-materials.txt` |
| **Page composition fidelity** | Whether the composed learner page includes materials present in GAM | Photosynthesis M2 absent from `page.json` A1 (Pass 1); Photosynthesis M22/M21 absent from `page.json` A6 (Pass 2) |

**Pattern implications:**

- Strong patterns and failure modes in this library address **instructional body quality** only.
- Composition loss is recorded in evidence traceability for context but does not generate instructional pattern entries.
- Future pattern validation must score GAM bodies, not composed pages, unless a separate composition-pattern slice is authorised.

---

# Pattern Library Meta-Principles

**Source:** Sprint 44 Pattern Synthesis — observed cross-pattern regularities from authored entries SP-02 through SP-06.  
**Status:** Documentary reference only.

### Relationship to 44-2 contracts

Meta-principles (MP-1–MP-8) summarise **recurring design moves** that appear across multiple pattern entries. They:

- **Do not** replace, supersede, or extend 44-2 contract minimum or strong realisation criteria.
- **Do not** create new evaluation verdicts, failure modes, or scoring rules.
- **Do** help authors and reviewers see how type-specific patterns instantiate shared instructional intent already present in 44-2 cross-cutting principles (e.g. scaffold ≠ deliverable, criteria before judgement).

When an MP appears to conflict with a 44-2 §5.x contract, **the contract governs**.

### MP-1 — Scaffold ≠ deliverable

**Observed principle:** Materials structure thinking or model a move but do not complete the learner's assigned output when independent production is required.

| Pattern | Evidence |
| ------- | -------- |
| SP-02 | Evidence cells modelled; judgement cells empty (M13) |
| SP-03 | Transfer prompt assigns production; no pre-written response (M16) |
| SP-04 | Prompts and sentence starters only; no consolidation essay (M17, M23) |
| SP-05 | Learner self-check; not facilitator completion audit |
| SP-06 | Worked item distinct from learner deliverable (both M2) |

**44-2 anchor:** Cross-cutting — scaffold ≠ deliverable.

---

### MP-2 — Model the move before independent production

**Observed principle:** Expert modelling precedes learner practice at reduced support; the learner sees how to perform the move before doing it independently.

| Pattern | Evidence |
| ------- | -------- |
| SP-02 | Partial exemplar row before empty learner rows (M13) |
| SP-06 | Step-by-step worked example before parallel learner task (M2) |
| SP-03 | Capstone transfer after session modelling arc (M16 on A4) |
| SP-04 | Closure scaffold after activities completed (M17) |

**44-2 anchor:** Fading arc (cross-cutting); type-specific minimum/strong per §5.2, §5.6.

---

### MP-3 — Explicit bridge to the learner's next task

**Observed principle:** The material connects modelling or session ideas to the learner's upcoming independent task or production context.

| Pattern | Evidence |
| ------- | -------- |
| SP-06 | Parallel-task bridge — **absent on benchmark M2 bodies** (FM-05); contract strong signal |
| SP-03 | Framework bridge: `apply the same analytical framework but in a new context` (M16) |
| SP-04 | Integrative instruction: `Bring these together…`; `summarise your understanding` (M17, M23) |

**44-2 anchor:** §5.2 strong (parallel-task link); §5.8 strong (application cues); §5.9 strong (application forward).

**Note:** Bridge wording and strictness vary by type. Absence is an evidenced weakness (FM-05) on worked examples; not all types require identical bridge phrasing.

---

### MP-4 — Criteria linkage across adjacent materials

**Observed principle:** Material bodies align with criteria, rubric dimensions, or key ideas named in adjacent exposition, scenario, or activity materials in the same arc.

| Pattern | Evidence |
| ------- | -------- |
| SP-02 | M13 rows mirror M12 criteria (explanatory power, predictive accuracy, relevance) |
| SP-03 | M16 names session evaluation criteria from evaluate arc |
| SP-05 | M15 items map to capstone criteria (Pass 2); M4–M11 tied to `expected_output` |

**44-2 anchor:** Criteria before judgement (cross-cutting); §5.7, §5.6, §5.8 validation signals.

---

### MP-5 — Operational production criteria

**Observed principle:** Learner-facing materials state what "done" looks like — word band, element count, or checkable item set — not vague completion language alone.

| Pattern | Evidence |
| ------- | -------- |
| SP-03 | `100–150 words`; M14 Failed without operational band |
| SP-04 | `80–120 words` / `minimum 80 words` (M17, M23) |
| SP-05 | ≥4 checkable items (seven surviving bodies); M13 Failed with zero items |

**44-2 anchor:** §5.8 minimum (completion criterion); §5.7 minimum (≥4 items); §5.9 minimum (substantive scaffold).

---

### MP-6 — Reasoning quality over structural completeness

**Observed principle:** Materials test or model interpretive, evidential, or causal reasoning — not only whether rows, steps, or fields are filled.

| Pattern | Evidence |
| ------- | -------- |
| SP-05 | Weak-pattern guards (`not just named`; `not in general`) vs `Is each row complete?` (FM-09 on M10) |
| SP-06 | Because/therefore steps (Marx M2) vs inventory listing (Photosynthesis M2) |
| SP-02 | Evidence-for/against before judgement column (M13) |

**44-2 anchor:** Procedure linked to meaning (cross-cutting); learner-check retrieval (cross-cutting).

---

### MP-7 — Multi-cue / multi-angle structure

**Observed principle:** Strong materials decompose the instructional move into multiple explicit cues, angles, steps, or check items rather than a single compound prompt.

| Pattern | Evidence |
| ------- | -------- |
| SP-03 | Four application bullets (M16) |
| SP-04 | ≥3 closure angles (M17: 3; M23: 4) |
| SP-05 | ≥4 checklist items (all surviving bodies) |
| SP-02 | Multiple rows/columns with distinct reasoning labels |

**44-2 anchor:** Type-specific minimums (item count, row count, closure angles).

---

### MP-8 — One instructional move per material

**Observed principle:** Each material performs one clear instructional function; upstream orientation metadata must not collapse into the GAM body as extraneous moves.

| Pattern | Evidence |
| ------- | -------- |
| SP-06 | Cognition-cue blocks appended to worked-example bodies (FM-07 on Photosynthesis M2) |
| SP-04 | Consolidation distinct from capstone judgement materials (Marx A4 arc) |

**44-2 anchor:** One move per material (cross-cutting); anti-collapse rules (§6.1).

---

### Meta-principles → authored patterns (reference)

| MP | SP-01 | SP-02 | SP-03 | SP-04 | SP-05 | SP-06 |
| -- | ----- | ----- | ----- | ----- | ----- | ----- |
| MP-1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| MP-2 | — | ✓ | ✓ | ✓ | — | ✓ |
| MP-3 | — | — | ✓ | ✓ | — | ✓ |
| MP-4 | — | ✓ | ✓ | — | ✓ | — |
| MP-5 | — | — | ✓ | ✓ | ✓ | — |
| MP-6 | ✓ | ✓ | — | — | ✓ | ✓ |
| MP-7 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| MP-8 | ✓ | — | — | ✓ | — | ✓ |

Dash (—) = not a primary evidenced emphasis for that pattern entry. SP-01 maps MP-1, MP-6, MP-7, MP-8 per authored entry Traceability.

### Traceability guidance for pattern entries

Authors **may** add an optional line to the **Traceability** section of any pattern entry:

```text
Meta-principles: MP-{n}, MP-{n}, … (observed cross-pattern principles; 44-2 contracts govern)
```

Rules:

- List only MPs evidenced by that pattern's benchmark citations — do not assign all eight by default.
- MPs supplement — do not replace — Contract, Benchmark Materials, and Evaluation Reports lines.
- Reviewers use MPs for orientation only; verdicts remain against 44-2 §5.x and evaluation evidence.

---

Each material type section below defines **pattern slots** — empty shells for future authoring. No pattern entry prose is written in Draft 1.

---

## Text

**Contract:** 44-2 §5.1 `text` — exposition connecting ideas in prose before practice.

**Related failure modes:** FM-07 (cognition-cue collapse), FM-08 (exposition without applied bridge — boundary-sensitive; Pass 1 only)

**Strong pattern slots:**

| Slot ID | Registry link | Status |
| ------- | ------------- | ------ |
| TEXT-SP-01 | SP-01 | Draft Complete — [`patterns/SP-01-TEXT-SP-01-connective-exposition-prose.md`](patterns/SP-01-TEXT-SP-01-connective-exposition-prose.md) |

**Evidence sources:** Pass 1 (Marx M1 Strong, Photosynthesis M1 Minimum); Inter-Rater (both M1 Strong)

**Contrast exemplars:**

| Verdict | Domain | Material |
| ------- | ------ | -------- |
| Strong | Marx | M1 |
| Strong / Minimum (boundary) | Photosynthesis | M1 |

---

### Pattern slot structure (all types)

Each authored pattern entry under a material type will use this schema:

```
Pattern ID:           {TYPE}-SP-{nn}  (links to Strong Pattern Registry where applicable)
Pattern Name:         Short descriptive title
Intent:               One-sentence instructional move this pattern achieves
Minimum Shape:        Abstract structural description (not corpus copy)
Strong Shape:         Abstract structural description elevating beyond minimum
Failure Modes Avoided: FM-IDs from Secondary Index
Evidence Basis:       Evaluation pass(es) and verdict
Benchmark Exemplars:  Material IDs with domain label (strong / contrast)
Authoring Status:     Draft Pending | Draft Complete | Reviewed

Traceability (in authored entry file):
  Contract:             44-2 §5.x (required)
  Benchmark Materials:  Material IDs (required)
  Evaluation Reports:   Pass references (required)
  Meta-principles:      MP-IDs (optional; see Pattern Library Meta-Principles)
```

---

## Worked Example

**Contract:** 44-2 §5.2 `worked_example` — modelled procedure with visible expert reasoning before learner practice.

**Related failure modes:** FM-05 (no parallel-task bridge), FM-06 (thin reasoning chain — evidenced Pass 1; not in Secondary Index per readiness scope), FM-07 (cognition-cue collapse)

**Strong pattern slots:**

| Slot ID | Registry link | Status |
| ------- | ------------- | ------ |
| WE-SP-01 | SP-06 | Draft Complete — [`patterns/SP-06-WE-SP-01-visible-reasoning-worked-example.md`](patterns/SP-06-WE-SP-01-visible-reasoning-worked-example.md) |

**Evidence sources:** Pass 1 (Marx M2 Strong, Photosynthesis M2 Minimum); Inter-Rater (both M2 Minimum)

**Contrast exemplars:**

| Verdict | Domain | Material |
| ------- | ------ | -------- |
| Strong / Minimum (boundary) | Marx | M2 |
| Minimum | Photosynthesis | M2 |

---

## Checklist

**Contract:** 44-2 §5.7 `checklist` — criteria-linked verification before continuing or submitting.

**Related failure modes:** FM-09 (verification completeness bias), FM-11 (minimum threshold only)

**Strong pattern slots:**

| Slot ID | Registry link | Status |
| ------- | ------------- | ------ |
| CL-SP-01 | SP-05 | Draft Complete — [`patterns/SP-05-CL-SP-01-criteria-linked-verification-checklist.md`](patterns/SP-05-CL-SP-01-criteria-linked-verification-checklist.md) |

**Evidence sources:** Pass 2 (Marx M4, M8, M11, M15 Strong; Photosynthesis M4, M7, M10 Minimum; M13 Failed stub); Inter-Rater (all Marx Minimum; Photosynthesis Minimum where body exists; M13 Failed)

**Contrast exemplars:**

| Verdict | Domain | Material |
| ------- | ------ | -------- |
| Strong / Minimum (boundary) | Marx | M4, M8, M11, M15 |
| Minimum | Photosynthesis | M4, M7, M10 |

---

## Transfer Prompt

**Contract:** 44-2 §5.8 `transfer_prompt` — own-context application with explicit completion expectations.

**Related failure modes:** FM-02 (thin transfer body), FM-03 (third-person procedural transfer)

**Strong pattern slots:**

| Slot ID | Registry link | Status |
| ------- | ------------- | ------ |
| TP-SP-01 | SP-03 | Draft Complete — [`patterns/SP-03-TP-SP-01-capstone-transfer-prompt.md`](patterns/SP-03-TP-SP-01-capstone-transfer-prompt.md) |

**Evidence sources:** Pass 2 (Marx M16 Strong; Photosynthesis M14 Failed, M22 Minimum); Inter-Rater (Marx M16 Strong; Photosynthesis M14 Failed, M22 Failed)

**Contrast exemplars:**

| Verdict | Domain | Material |
| ------- | ------ | -------- |
| Strong | Marx | M16 |
| Failed | Photosynthesis | M14 |
| Minimum / Failed (boundary) | Photosynthesis | M22 |

---

## Decision Table

**Contract:** 44-2 §5.6 `decision_table` — guided judgement grid with partial modelling and learner-empty judgement cells.

**Related failure modes:** FM-04 (table shell without partial exemplar)

**Strong pattern slots:**

| Slot ID | Registry link | Status |
| ------- | ------------- | ------ |
| DT-SP-01 | SP-02 | Draft Complete — [`patterns/SP-02-DT-SP-01-partial-exemplar-decision-table.md`](patterns/SP-02-DT-SP-01-partial-exemplar-decision-table.md) |

**Evidence sources:** Pass 2 (Marx M13 Strong; Photosynthesis M12, M19 Minimum); Inter-Rater (Marx M13 Strong; Photosynthesis M12, M19 Minimum)

**Contrast exemplars:**

| Verdict | Domain | Material |
| ------- | ------ | -------- |
| Strong | Marx | M13 |
| Minimum | Photosynthesis | M12, M19 |

---

## Consolidation Summary

**Contract:** 44-2 §5.9 `consolidation_summary` — session closure scaffold without replacing learner-produced synthesis.

**Related failure modes:** FM-10 (thin judgement/closure scaffold)

**Strong pattern slots:**

| Slot ID | Registry link | Status |
| ------- | ------------- | ------ |
| CS-SP-01 | SP-04 | Draft Complete — [`patterns/SP-04-CS-SP-01-multi-angle-consolidation-scaffold.md`](patterns/SP-04-CS-SP-01-multi-angle-consolidation-scaffold.md) |

**Evidence sources:** Pass 2 (Marx M17 Strong; Photosynthesis M23 Minimum); Inter-Rater (both M17, M23 Strong)

**Contrast exemplars:**

| Verdict | Domain | Material |
| ------- | ------ | -------- |
| Strong | Marx | M17 |
| Minimum / Strong (boundary) | Photosynthesis | M23 |

---

## Template / Independent Judgement (convention)

**Contract anchor:** 44-2 §5.9 scaffold principles + cross-cutting scaffold ≠ deliverable (see Conventions — Template mapping rule).

**Related failure modes:** FM-10 (thin judgement/closure scaffold)

**Strong pattern slots:**

| Slot ID | Registry link | Status |
| ------- | ------------- | ------ |
| TM-SP-01 | — (compositional; links SP-04 arc) | Draft Pending |

**Evidence sources:** Pass 2 (Marx M14 Strong; Photosynthesis M20 Minimum); Inter-Rater (Marx M14 Minimum; Photosynthesis M20 Minimum)

**Contrast exemplars:**

| Verdict | Domain | Material |
| ------- | ------ | -------- |
| Strong / Minimum (boundary) | Marx | M14 |
| Minimum | Photosynthesis | M20 |

**Note:** No SP registry entry is assigned exclusively to template. Future authoring may split TM-SP-01 from consolidation patterns or document as capstone-arc compositional pattern (Marx A4: M12 → M13 → M14 → M15 → M16 → M17).

---

# Secondary Index: Failure Modes

Instructional failure modes only. Capture artefacts (FM-01 stub emission, FM-12 page-composition loss) are excluded — see Conventions.

---

## FM-02

| Field | Value |
| ----- | ----- |
| **Name** | Thin transfer body |
| **Description** | Transfer material slot present but body lacks operational completion criterion (word band, element count, or evidence requirement). Body too thin to guide learner production. |
| **Classification** | Genuine material-realisation problem |
| **Affected material types** | `transfer_prompt` |
| **Detection signals** | §5.8 failure mode "transfer body so thin it cannot guide production"; no stated completion band; "short" without word count |
| **Related strong patterns** | SP-03 (capstone transfer with word band and multi-cue structure) |
| **Benchmark materials** | Photosynthesis M14 (Failed, Pass 2, Inter-Rater) |

---

## FM-03

| Field | Value |
| ----- | ----- |
| **Name** | Third-person procedural transfer |
| **Description** | Transfer prompt supplies a third-person claim or generic scenario without own-context framing. Learner is not asked to apply ideas to their setting, role, data, or selected context. |
| **Classification** | Genuine material-realisation problem |
| **Affected material types** | `transfer_prompt` |
| **Detection signals** | §5.8 failure mode "third-person scenarios only"; absence of possessive second-person references; correct-this-claim or hypothetical-global framing only |
| **Related strong patterns** | SP-03 |
| **Benchmark materials** | Photosynthesis M14 (Failed); Photosynthesis M22 (Pass 2 Minimum, Inter-Rater Failed — boundary case) |

---

## FM-04

| Field | Value |
| ----- | ----- |
| **Name** | Decision-table shell without partial exemplar |
| **Description** | Tabular structure present with adequate rows but no modelled judgement move. All learner-completion cells empty with no reference or partial exemplar row demonstrating evidence gathering or reasoning. |
| **Classification** | Genuine material-realisation problem |
| **Affected material types** | `decision_table` |
| **Detection signals** | §5.6 failure mode "table shell… no exemplar content"; DLA specifies model row absent from body; reviewer cannot identify modelled vs learner-owned cells beyond emptiness |
| **Related strong patterns** | SP-02 |
| **Benchmark materials** | Photosynthesis M12, M19 (Minimum, Pass 2, Inter-Rater) |

---

## FM-05

| Field | Value |
| ----- | ----- |
| **Name** | Worked example without parallel-task bridge |
| **Description** | Expert steps and reasoning are present but the material does not explicitly link the modelled method to the learner's upcoming independent task. |
| **Classification** | Genuine material-realisation problem — **recurrent cross-domain** |
| **Affected material types** | `worked_example` |
| **Detection signals** | §5.2 strong signal "explicit link to the parallel task" absent; steps end with domain conclusion only; reviewer cannot state how to reuse method on learner item |
| **Related strong patterns** | SP-06 (partial — strong features present, bridge absent in benchmark) |
| **Benchmark materials** | Marx M2 (Pass 1 Strong, Inter-Rater Minimum); Photosynthesis M2 (Minimum, Pass 1, Inter-Rater) |

---

## FM-07

| Field | Value |
| ----- | ----- |
| **Name** | Cognition-cue collapse |
| **Description** | Upstream activity-orientation fields (self-explanation, transfer, misconception, revision triggers) materialised inside GAM bodies for non-matching material types. Violates one-move-per-material; weakens strong realisation on exposition and modelling slots. |
| **Classification** | Genuine material-realisation problem (emission channel) |
| **Affected material types** | `text`, `worked_example` (and potentially others in Photosynthesis corpus) |
| **Detection signals** | Cross-cutting "one move per material"; appended `Cognition cues:` blocks after instructional body; verification/transfer/misconception moves inside explanation or worked-example slots |
| **Related strong patterns** | SP-01 (Marx M1 avoids this collapse) |
| **Benchmark materials** | Photosynthesis M1, M2, M4 (Pass 1, Inter-Rater) |

---

## FM-09

| Field | Value |
| ----- | ----- |
| **Name** | Verification completeness bias |
| **Description** | Checklist items test row, table, or task completion rather than reasoning quality. Dominant mode is "is it complete?" over "is the reasoning criteria-aligned?" |
| **Classification** | Genuine material-realisation problem |
| **Affected material types** | `checklist` |
| **Detection signals** | §5.7 failure mode adjacent — items like "Is each row complete?"; thin presentation without revise section; absence of weak-reasoning guards |
| **Related strong patterns** | SP-05 |
| **Benchmark materials** | Photosynthesis M10 (Minimum, Pass 2) |

---

## FM-10

| Field | Value |
| ----- | ----- |
| **Name** | Thin judgement/closure scaffold |
| **Description** | Template or consolidation material provides bullet labels or prompt list without sentence starters, word bands, or criteria-linked self-check. Scaffold performs minimum closure move but not strong scaffold depth. |
| **Classification** | Genuine material-realisation problem |
| **Affected material types** | `consolidation_summary`, `template` / `independent_judgement` |
| **Detection signals** | §5.9 strong signals absent (no sentence starters, no recall/change/application framing); template with labels only ("explain links"); prompt bullets without "you might begin with…" |
| **Related strong patterns** | SP-04 (Marx M17 contrast); TM-SP-01 (future) |
| **Benchmark materials** | Photosynthesis M20 (Minimum, Pass 2, Inter-Rater); Photosynthesis M23 (Pass 2 Minimum, Inter-Rater Strong — boundary case) |

---

## FM-11

| Field | Value |
| ----- | ----- |
| **Name** | Checklist at minimum threshold only |
| **Description** | Checklist meets ≥4 criteria-linked items and revise guidance at minimum bar but lacks strong features: grouped sections, weak-pattern exposure, misconception guard, or rubric-dimension mapping. |
| **Classification** | Genuine material-realisation problem — **recurrent cross-domain** |
| **Affected material types** | `checklist` |
| **Detection signals** | §5.7 minimum met, strong not met; items criteria-linked but generic; no "not just named" / "not in general" style guards; inter-rater stable Minimum band |
| **Related strong patterns** | SP-05 |
| **Benchmark materials** | Marx M4, M8, M11, M15 (Inter-Rater Minimum; Pass 2 Strong — boundary); Photosynthesis M4, M7, M10 (Minimum, Pass 2, Inter-Rater) |

---

# Strong Pattern Registry

Placeholder entries only. Full pattern content is **Draft Pending**.

---

## SP-01

| Field | Value |
| ----- | ----- |
| **Title** | Integrative exposition with applied closing example |
| **Contract anchor** | §5.1 `text` |
| **Primary slot** | TEXT-SP-01 |
| **Benchmark source** | Marx M1 (Strong, all passes) |
| **Contrast source** | Photosynthesis M1 (Minimum Pass 1; Strong Inter-Rater — boundary) |
| **Failure modes avoided** | FM-07 (primary); FM-08 (Pass 1 applied-bridge; boundary-sensitive) |
| **Authoring status** | Draft Complete — [`patterns/SP-01-TEXT-SP-01-connective-exposition-prose.md`](patterns/SP-01-TEXT-SP-01-connective-exposition-prose.md) |

---

## SP-02

| Field | Value |
| ----- | ----- |
| **Title** | Partial-exemplar decision table |
| **Contract anchor** | §5.6 `decision_table` |
| **Primary slot** | DT-SP-01 |
| **Benchmark source** | Marx M13 (Strong, Pass 2, Inter-Rater) |
| **Contrast source** | Photosynthesis M12, M19 (Minimum) |
| **Failure modes avoided** | FM-04 |
| **Authoring status** | Draft Complete — [`patterns/SP-02-DT-SP-01-partial-exemplar-decision-table.md`](patterns/SP-02-DT-SP-01-partial-exemplar-decision-table.md) |

---

## SP-03

| Field | Value |
| ----- | ----- |
| **Title** | Capstone transfer with word band, multi-cue application, and session-criteria linkage |
| **Contract anchor** | §5.8 `transfer_prompt` |
| **Primary slot** | TP-SP-01 |
| **Benchmark source** | Marx M16 (Strong, Pass 2, Inter-Rater) |
| **Contrast source** | Photosynthesis M14 (Failed); M22 (boundary) |
| **Failure modes avoided** | FM-02, FM-03 |
| **Authoring status** | Draft Complete — [`patterns/SP-03-TP-SP-01-capstone-transfer-prompt.md`](patterns/SP-03-TP-SP-01-capstone-transfer-prompt.md) |

---

## SP-04

| Field | Value |
| ----- | ----- |
| **Title** | Multi-angle consolidation scaffold |
| **Contract anchor** | §5.9 `consolidation_summary` |
| **Primary slot** | CS-SP-01 |
| **Benchmark source** | Marx M17 (Strong, Pass 2, Inter-Rater) |
| **Contrast source** | Photosynthesis M23 (Pass 2 Minimum; Inter-Rater Strong — boundary) |
| **Failure modes avoided** | FM-10 (M23 exhibited in Pass 2 only) |
| **Authoring status** | Draft Complete — [`patterns/SP-04-CS-SP-01-multi-angle-consolidation-scaffold.md`](patterns/SP-04-CS-SP-01-multi-angle-consolidation-scaffold.md) |

---

## SP-05

| Field | Value |
| ----- | ----- |
| **Title** | Criteria-linked verification with weak-pattern exposure and revise path |
| **Contract anchor** | §5.7 `checklist` |
| **Primary slot** | CL-SP-01 |
| **Benchmark source** | Marx M4, M8, M11, M15 (Pass 2 Strong; Inter-Rater Minimum — document Minimum→Strong boundary in authored entry) |
| **Contrast source** | Photosynthesis M4, M7, M10 (Minimum) |
| **Failure modes avoided** | FM-11 (disputed on Marx bodies); FM-09 (M10 completion bias) |
| **Authoring status** | Draft Complete — [`patterns/SP-05-CL-SP-01-criteria-linked-verification-checklist.md`](patterns/SP-05-CL-SP-01-criteria-linked-verification-checklist.md) |

---

## SP-06

| Field | Value |
| ----- | ----- |
| **Title** | Step-labelled worked example with visible interpretive reasoning |
| **Contract anchor** | §5.2 `worked_example` |
| **Primary slot** | WE-SP-01 |
| **Benchmark source** | Marx M2 (Pass 1 Strong; Inter-Rater Minimum — bridge gap documented) |
| **Contrast source** | Photosynthesis M2 (Minimum) |
| **Failure modes avoided** | FM-05 (documented gap on benchmark bodies; bridge is remediation shape) |
| **Authoring status** | Draft Complete — [`patterns/SP-06-WE-SP-01-visible-reasoning-worked-example.md`](patterns/SP-06-WE-SP-01-visible-reasoning-worked-example.md) |

---

# Evidence Traceability

## Strong patterns → benchmark materials

| Pattern | Strong exemplar | Contrast exemplar | Evaluation verdicts |
| ------- | --------------- | ----------------- | ------------------- |
| SP-01 | Marx M1 | Photosynthesis M1 | Marx Strong (P1, IR); Psy Strong (IR) / Minimum (P1) |
| SP-02 | Marx M13 | Photosynthesis M12, M19 | Marx Strong (P2, IR); Psy Minimum (P2, IR) |
| SP-03 | Marx M16 | Photosynthesis M14, M22 | Marx Strong (P2, IR); Psy M14 Failed; M22 Min (P2) / Failed (IR) |
| SP-04 | Marx M17 | Photosynthesis M23 | Marx Strong (P2, IR); Psy Minimum (P2) / Strong (IR) |
| SP-05 | Marx M4, M8, M11, M15 | Photosynthesis M4, M7, M10 | Marx Strong (P2) / Minimum (IR); Psy Minimum (P2, IR) |
| SP-06 | Marx M2 | Photosynthesis M2 | Marx Strong (P1) / Minimum (IR); Psy Minimum (P1, IR) |

## Failure modes → benchmark materials

| Failure mode | Benchmark materials | Evaluation verdicts | Classification |
| ------------ | -------------------- | -------------------- | -------------- |
| FM-02 | Photosynthesis M14 | Failed (P2, IR) | Genuine |
| FM-03 | Photosynthesis M14; M22 | M14 Failed; M22 Min (P2) / Failed (IR) | Genuine |
| FM-04 | Photosynthesis M12, M19 | Minimum (P2, IR) | Genuine |
| FM-05 | Marx M2; Photosynthesis M2 | See SP-06 traceability | Genuine, cross-domain |
| FM-07 | Photosynthesis M1, M2, M4 | Contamination noted (P1, IR) | Genuine, emission channel |
| FM-09 | Photosynthesis M10 | Minimum (P2) | Genuine |
| FM-10 | Photosynthesis M20; M23 | M20 Minimum; M23 boundary | Genuine |
| FM-11 | Marx M4, M8, M11, M15; Photosynthesis M4, M7, M10 | Minimum band (IR); Marx Strong (P2) boundary | Genuine, cross-domain |

## Capture artefacts (excluded from pattern indexes)

| ID | Benchmark materials | Channel | Owner |
| -- | ------------------- | ------- | ----- |
| FM-01 | Photosynthesis M13 | GAM stub (`"as above"`) | 44-1; Stub detection rule |
| FM-12 | Photosynthesis M2 (page); M22, M21 (page) | Page composition loss | 44-1; Body vs composition rule |

## Compositional arc reference (future appendix)

Marx Activity A4 capstone sequence — evidenced as coherent strong arc in Pass 2:

`M12 (criteria text) → M13 (decision table) → M14 (template) → M15 (checklist) → M16 (transfer) → M17 (consolidation)`

Not a pattern registry entry in Draft 1. Reserved for future arc-level authoring under TM-SP-01 / compositional appendix.

---

# Future Expansion

## Adding material types

A material type enters the library when:

1. Benchmark evaluation scores ≥2 materials of that type across ≥1 domain using 44-2 contracts.
2. At least one Strong or Failed verdict is evidenced with direct corpus citation.
3. Readiness review confirms discrimination utility for that type.

**Expansion procedure:**

1. Add Primary Index section with contract anchor, failure mode links, and empty pattern slots.
2. Author pattern entries using the slot structure defined in this document.
3. Update Strong Pattern Registry and Evidence Traceability tables.
4. Update Scope (in / out) in this document.

**Next types expected:** `modelling_note`, `misconception_note`, `sample_output`, `rubric` / `quality_criteria` — present in corpus, unevaluated in Pass 2/3.

## Adding strong patterns

A new strong pattern (SP-07+) requires:

| Requirement | Detail |
| ----------- | ------ |
| Evidence | ≥1 Strong verdict with corpus citation from an evaluation pass or inter-rater validation |
| Contrast | ≥1 Minimum or Failed exemplar of the same material type preferred |
| Contract anchor | Explicit 44-2 §5.x reference |
| Failure mode link | ≥1 FM-ID from Secondary Index that the pattern avoids |
| Slot assignment | Primary Index slot ID under the relevant material type |
| Registry entry | Title, benchmark source, authoring status |

Boundary-only patterns (verdict split across passes) may be registered with explicit boundary documentation in the Evidence Basis field — as with SP-05 and SP-06.

## Adding failure modes

A new failure mode (FM-12+ instructional) requires:

| Requirement | Detail |
| ----------- | ------ |
| Evidence | Direct corpus citation from an evaluation pass; ≥1 material instance |
| Classification | Genuine realisation, capture artefact, or boundary — stated explicitly |
| Non-duplication | Must not restate an existing FM-ID; merge if overlapping |
| Index update | Secondary Index entry + Primary Index cross-references + traceability table |

Capture artefacts must not be added to the Secondary Index. Document them under Conventions or 44-1 spec.

## Authoring workflow (Draft 1 onward)

```text
1. Select Primary Index slot (e.g. TP-SP-01)
2. Read 44-2 contract minimum + strong
3. Read linked SP registry entry and benchmark exemplars
4. Read related FM entries (anti-patterns to avoid)
5. Read applicable Meta-principles (MP-1–MP-8) for cross-pattern orientation
6. Author pattern entry using slot schema
7. Set Authoring Status → Draft Complete
8. Reviewer validates against 44-2 + benchmark traceability (MPs optional reference)
9. Set Authoring Status → Reviewed
```

---

## Document status

| Field | Value |
| ----- | ----- |
| **Version** | Draft 1 — architecture + meta-principles (MP-1–MP-8) |
| **Pattern entries authored** | 6 of 7 slots (SP-01–SP-06 core material types complete) |
| **Next action** | Optional: TM-SP-01 template convention entry; unevaluated types remain out of scope |
| **Related slices** | 44-1 capture gate; 44-2 contracts |

---

## Source documents

| Document | Path |
| -------- | ---- |
| 44-2 contracts | [`sprint-44-2-instructional-depth-contracts.md`](sprint-44-2-instructional-depth-contracts.md) |
| 44-3 readiness | Sprint 44-3 Readiness Assessment (accepted evidence) |
| 44-3 architecture review | Sprint 44-3 Architecture Review (accepted evidence) |
| 44-3 pattern synthesis | Sprint 44 Pattern Synthesis — source for MP-1–MP-8 |
| Evaluation Pass 1 | Sprint 44-2 Evaluation Pass 1 (accepted evidence) |
| Evaluation Pass 2 | Sprint 44-2 Evaluation Pass 2 (accepted evidence) |
| Inter-rater validation | Sprint 44 Inter-Rater Validation (accepted evidence) |
| Benchmark corpus | [`benchmark-corpus/`](benchmark-corpus/) |
