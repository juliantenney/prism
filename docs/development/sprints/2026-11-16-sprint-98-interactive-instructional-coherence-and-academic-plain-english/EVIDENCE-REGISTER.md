# Sprint 98 — Evidence register

**Sprint:** 98 — Interactive Instructional Coherence and Academic Plain English  
**Opened:** 2026-11-16  
**Case study:** *Why the constraint matters* (standalone Interactive)  
**Baseline HEAD:** `54774cde3810bea1f666b2456c6edff4bb6181ee`  
**M2 package:** learner export `why-the-constraint-matters.zip` (HTML + assets; title preserved)

Status vocabulary: **Confirmed** · **Hypothesis** · **Monitoring** · **Resolved** · **Verified** · **Provisional** · **Not claimed** · **Architectural gap**

---

## Findings ledger

| ID | Status | Finding |
| -- | ------ | ------- |
| S98-E01 | **Confirmed (pre-M2)** → **Improved under M2 (partial for Purpose)** | Pre-M2 Overview and Learning purpose repeated the same activity itinerary. M2 regen: Overview improved (less itinerary); Learning purpose partially improved (some itinerary language remains; better prediction / calculation / justification distinction). |
| S98-E02 | **Confirmed** | Design Page transport rules restrict rewriting of upstream Overview / Learning purpose / Knowledge Summary / study_tips bodies. |
| S98-E03 | **Verified at M1** | Design Page role-separation guidance changed + focused tests; related opening set 78 pass / 1 fail (S98-E07). |
| S98-E04 | **Architectural gap (M3) → partially addressed (M5)** | Authored `timeline[].learner_study_flow` was retained but unused (M3). M5 Option C now consumes disclosure allow-list for attempt-before scaffolds on Interactive only. Moment order remains Orient→Learn→Do→Check→Transfer (no global swap). See [M3-SEQUENCING-INVESTIGATION.md](M3-SEQUENCING-INVESTIGATION.md) · [S98-D07](decisions.md#s98-d07--authorise-and-implement-m5-option-c-bounded-scaffold-sequencing). |
| S98-E05 | **Monitoring** | Word extraction remains a secondary signal only. Pre-M2 ~6,944; M2 package ~7,331 approximate HTML words. **Not** an optimisation target. |
| S98-E06 | **Resolved** | Title/filename preservation — M2 package H1/title = *Why the constraint matters*. |
| S98-E07 | **Independent / open** | `s96-interactive-editorial-opening` figcaption failure — not reopened in M2/M3. |
| S98-E08 | **Provisional (M2)** | Educational improvement observed in Overview / Purpose / KS. DP partial bodies **match** assembled `page_synthesis` (passthrough confirmed). **Not claimed:** DP guidance alone caused every improvement. **Still unverified:** newly authored vs upstream transport (effective DP prompt not supplied). Study tips match A4-M5 closure (transport-consistent). |
| S98-E09 | **Confirmed (M3, case package)** | A1–A4 render Orient→Learn→Do→Check (+ Transfer on A4). Destination sample_outputs Check-deferred. Learn holds preparatory / scaffold texts; A3 Learn holds full illustrative proof before Do. |
| S98-E10 | **Confirmed (M3)** | Worked answers deferred when typed/marked for Check; voluntary closed details; not attempt-gated. Aligns with LS `navigation.feedback_disclosure` material ids at type level, not because timeline study-flow is executed. |
| S98-E11 | **Resolved (authored shape)** | Assembled page has `timeline[].learner_study_flow` (not top-level `study_flow`). Top-level `study_flow` absent. |
| S98-E12 | **Confirmed mismatch (M3) → corrected for A2/A3 (M5 code)** | Pre-M5: A3-M1 open Learn before A3-M2; A2-M2 open Learn. Post-M5 Option C (fixture-verified): A3-M2 attempt before collapsed A3-M1; A2-M2 collapsed optional support on Do. A1 dual-use residual unchanged (S98-AD-012). Author regen evaluation still pending. |

---

## M2 — Regenerated comparison (provisionally accepted)

**Decision:** [S98-D03](decisions.md#s98-d03--provisionally-accept-m2--educational-improvement-observed)

| Aspect | Record |
| ------ | ------ |
| Overview | Improved orientation and practical instructions; less activity-itinerary repetition |
| Learning purpose | Partially improved; retains some itinerary language; better distinguishes prediction, calculation and mathematical justification |
| Knowledge Summary | Improved instructional economy; preserves substantive advance organisation, conceptual precision, methodological preparation and discovery protection |
| Title preservation | Correct in regenerated output |
| Study tips | Potentially useful reinforcement; no defect established |
| Reading volume | Monitoring only |
| Generation provenance | DP→assembly passthrough confirmed (identical bodies). Newly authored vs upstream transport still **unverified** without effective DP prompt. Study tips match A4-M5 closure. |
| Causation limit | Do **not** claim DP guidance alone caused every observed improvement |

---

## M3 — Sequencing vs render (investigation complete)

**Decision:** [S98-D04](decisions.md#s98-d04--accept-m3-investigation-findings-read-only--architectural-gap-no-automatic-learner-facing-defect)  
**Detail:** [M3-SEQUENCING-INVESTIGATION.md](M3-SEQUENCING-INVESTIGATION.md)

### Confirmed implementation behaviour

- Prompt `learner_study_flow` ≠ executable control.  
- Authored `timeline[].learner_study_flow` present on this page; retained in assembled JSON; **not** read for order/disclosure.  
- Top-level `study_flow` absent here; would be Orient labels only if present.  
- Moment order fixed: Orient → Learn → Do → Check → Transfer.  
- Post-attempt sample_outputs Check-deferred; voluntary closed details; no attempt gate.

### Pedagogical implications

- Answer withholding can succeed via material types even while LS step order for scaffolds is not honoured.  
- A3 illustrative completed proof before first attempt is a real coherence mismatch with authored intention, even though the *original* destination proof remains in Check.

### Unverified

- Effective Design Page prompt (newly authored vs transport for Overview/Purpose/KS).  
- Other Interactive regenerations’ Learn placement quality.

### Case A1–A4 (summary)

See M3 investigation table + [evidence/M2-PAGE-SYNTHESIS-AND-LS-SUMMARY.md](evidence/M2-PAGE-SYNTHESIS-AND-LS-SUMMARY.md).

---

## M4 — Consolidation (closed)

**Decision:** [S98-D05](decisions.md#s98-d05--close-sprint-98--accepted--qualified) · [SPRINT-98-CLOSURE.md](SPRINT-98-CLOSURE.md) · [VALIDATION.md](VALIDATION.md)

Consolidated conclusions match M1–M3 evidence without elevating provisional claims:

- Overview / KS improved; Purpose partially improved; KS remains advance organiser before activities.  
- Precision / completeness / discovery protection intact in the evaluated package.  
- Productive repetition ≠ avoidable duplication; no arbitrary word limits.  
- `timeline[].learner_study_flow` authored + preserved; not executed by renderer.  
- A3 / A2 presentation mismatches recorded; complete answer spoiling not established.  
- Instructional coherence limitation ≠ mandate for immediate redesign.  
- Provenance, reading-volume and figcaption limits remain qualified.

M4 suite: **67 pass / 1 known fail** (S98-E07).

---

## M5 — Sequencing resolution (IMPLEMENTED — Option C; accepted at close)

**Decisions:** [S98-D06](decisions.md#s98-d06--reopen-sprint-98-for-m5-instructional-sequencing-resolution) · [S98-D07](decisions.md#s98-d07--authorise-and-implement-m5-option-c-bounded-scaffold-sequencing) · [S98-D09](decisions.md#s98-d09--close-sprint-98--accepted-with-qualifications)  
**Options:** [M5-SEQUENCING-OPTIONS.md](M5-SEQUENCING-OPTIONS.md)  
**Validation:** [VALIDATION.md](VALIDATION.md)

| Item | Record |
| ---- | ------ |
| Approach | Option **C** only — disclosure allow-list `optional_scaffold` \| `conceptual_scaffold` after attempt step |
| Option B | **Not implemented** — C identifies A2/A3; B not required |
| A2 before → after | Open modelling note in Learn → collapsed “Optional support…” on Do after task materials |
| A3 before → after | Open illustrative proof in Learn → blank template first in Do; proof collapsed “Worked illustration…” |
| A1 | Residual — dual-purpose material; not auto-split (S98-AD-012) |
| Tests | `tests/s98-m5-attempt-before-scaffold-sequencing.test.js` **9/9 pass**; post-attempt suite pass |
| Known baselines | S98-E07 figcaption; A5 heteroscedasticity compose expectations (pre-existing) |
| Original case | Unreproducible (deleted workflow runtime) — M5 accepted on focused regression evidence |
| Close | Sprint closed S98-D09; qualifications preserved |

## S98-D08 — Prose typography (editorial quality)

**Decision:** [S98-D08](decisions.md#s98-d08--global-ban-on-discretionary-inline-emphasis-in-learner-facing-prose)

| Item | Record |
| ---- | ------ |
| Problem | Generated prose used Markdown bold to emphasise words/concepts, fragmenting reading and substituting for effective wording |
| Scope | **Global** PRISM editorial standard — not Interactive-only; Learning Journeys + standalone routes |
| Shared owner | `lib/ld-learner-facing-prose-typography.js` → injected before route branching in `applyWorkflowStepRuntimePromptAugmentations`; also GAM V2 canonical assembler |
| Contradictions fixed | GAM enrich + assembler no longer say “ordinary inline emphasis remains valid” |
| Preserved | Headings; UI/disclosure labels; template `**Label:`**; tables; maths; conventional title italics |
| Tests | `tests/s98-learner-facing-prose-typography.test.js` **5/5** |
| Limitations | Guidance-level only (no renderer strip). Paths that never call runtime augmentation or the GAM assembler still need separate coverage if discovered. Sibling static templates may not embed the marker until assembled through those ingresses. |

## Remaining considerations

3. Required vs optional / hidden / feedback content for duration evaluation.  
4. Design Page authorship / transport provenance.  
5. Residual Overview / Learning purpose overlap.  
6. A1 authoring split if prediction-before-explanation must be fully realised (S98-AD-012).
