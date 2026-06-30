# Sprint 54 Context Pack — Pedagogic Fidelity Audit

**Sprint:** 54 — Pedagogic Fidelity Audit  
**Pack date:** 2026-06-29  
**Status:** Closed — see [SPRINT-54-CLOSURE-REPORT.md](./SPRINT-54-CLOSURE-REPORT.md)  
**Predecessor:** [Sprint 53 closure](../2026-06-29-sprint-53-learner-page-output-fixes/SPRINT-53-CLOSURE-REPORT.md)  
**Companion docs:** [CHARTER](SPRINT-54-CHARTER.md) · [DECISION-LOG](SPRINT-54-DECISION-LOG.md) · [Audit matrix](../2026-06-29-sprint-53-learner-page-output-fixes/SPRINT-53-PEDAGOGIC-FIDELITY-AUDIT-MATRIX.md)

---

## Instructions to the assistant (fresh chat)

You are continuing **Sprint 54 — Pedagogic Fidelity Audit** on PRISM.

**Sprint 53 is closed.** Do not reopen Sprint 53 implementation threads unless the user explicitly rescopes.

**Read this pack before responding.** If the user has not provided it, ask for `SPRINT-54-CONTEXT-PACK.md` and the audit matrix.

**Begin with artefact evidence, not architecture proposals.**

---

## Executive Summary — State of the World

*Read this section first. Under one minute to orient; then proceed to §A or §J.5.*

### Known

* Canonical pedagogic architecture has been identified and catalogued.
* Pedagogic fidelity audit matrix exists (83 rows).
* Sprint 53 established architectural boundaries.
* PRISM does not observe Copilot execution.
* PRISM cannot validate artefacts it never receives.
* Material-body loss has been observed in audited runs.
* HTML has matched Design Page JSON in established audits.
* Sprint 54 is an audit, localisation, and root-cause-analysis sprint — not an implementation sprint.

### Unknown

* First stage of pedagogic fidelity loss.
* Whether first loss occurs in GAM generation, Design Page generation, merge/composition, or another stage.
* Whether all pedagogic element families degrade at the same stage.
* Whether perceived learner-page thinness is caused by:
  * fidelity loss,
  * salience/presentation issues,
  * both.

### Current Leading Hypotheses (Not Established Findings)

* **WH-53-01:** First fidelity loss may occur during Design Page generation (condensation, synopsis substitution, limitation-based truncation).
* **WH-53-02:** First fidelity loss may occur during GAM generation (thin material bodies despite DLA obligations).
* **WH-53-03:** Fidelity loss may occur through material-key collapse during compose/merge.
* **WH-53-04:** Fidelity loss may occur through PEL/GAM deduplication or sanitisation.
* **WH-53-05:** PEL row fields may preserve more reliably than GAM material bodies.

> These are investigation targets, not established findings. They remain Working Hypotheses until supported by Sprint 54 artefact-chain evidence. Full detail: §C.2.

### Sprint Goal

Identify the first fidelity-loss stage for each major pedagogic family **and establish the most plausible evidence-based explanation for that loss**.

### Do Not Start With

* Prompt redesign.
* Validator redesign.
* Workflow UI changes.
* Renderer changes.
* Educational-quality optimisation.
* Pedagogic redesign.

These belong after fidelity localisation **and root-cause analysis**.

---

# A. Sprint Purpose

Measure how much of PRISM’s **canonical instructional architecture** survives from:

**EP → DLA → GAM → LS → Design Page → HTML**

and determine **where fidelity loss first occurs** for each element family **and why that degradation is occurring**.

Sprint 54 is a **localisation and root-cause-analysis** sprint.

It is **not** an implementation sprint.

The sprint seeks to determine both:

1. **where** fidelity first degrades; and  
2. **why** that degradation is occurring.

Potential evidence sources include artefact-chain analysis, prompt-contract inspection, code inspection, validator behaviour, compose behaviour, sanitisation logic, and renderer behaviour.

**Primary questions (carried from Sprint 53 close):**

> Where does pedagogic fidelity first degrade between upstream artefacts and learner output?

> Why does degradation occur at that stage?

**Sprint 54 scope formula:**

```text
Fidelity localisation
+
Root-cause analysis
-
Implementation
```

---

# B. Architectural Context

## B.1 PRISM execution model

```
PRISM assembles prompt
        ↓
Operator runs prompt in Copilot (external)
        ↓
Copilot generates artefact
        ↓
Operator supplies artefact to PRISM (paste / Utilities) OR uses artefact externally
        ↓
PRISM assembles next prompt (if upstream in workflow state)
```

## B.2 Design Page → learner output

```
Design Page JSON (artifact_type: page)
        ↓
PRISM compose validation / merge (when supplied)
        ↓
Renderer (Utilities export / HTML pipeline)
        ↓
Learner-facing HTML
```

## B.3 Non-negotiable boundaries

**PRISM does not observe Copilot execution.**

PRISM does **not**:

* execute prompts  
* run Copilot  
* observe workflow runs  
* retrieve Copilot outputs automatically  
* validate artefacts it never receives  
* repair or reconcile generation failures at runtime  

**PRISM does**:

* define prompt contracts and workflow steps  
* validate **supplied** artefacts (paste, Utilities JSON, test fixtures)  
* merge upstream GAM onto supplied page JSON (compose helpers)  
* render supplied page JSON to HTML  

Any solution requiring PRISM to observe, retrieve, or repair Copilot output without user supply is:

**"Requires architectural change outside current PRISM scope"**

### Validation carve-out (in scope)

* Validation of artefacts **explicitly supplied to PRISM**  
* Renderer gating on failed validation before HTML export  
* Prompt contracts instructing Copilot how to compose  

---

# C. Current Known State

Use **ED / WH / AH** tags. Never present WH or AH as established facts.

## C.1 Established findings (ED)

*From Sprint 53 closure — do not re-litigate without new evidence.*

| ID | Finding |
| -- | ------- |
| ED-53-01 | PRISM does not observe Copilot execution |
| ED-53-02 | PRISM cannot validate artefacts it never receives |
| ED-53-03 | `validatePageMaterialsClosure` → `skip` when upstream GAM absent from PRISM state |
| ED-53-04 | Workflow Next does not gate on material-closure failure |
| ED-53-05 | Utilities export gates on material-closure `fail` (when upstream supplied) |
| ED-53-06 | Prompts contain strict preservation + `generation_notes.limitations` escape hatches |
| ED-53-07 | Utilities activity-omission test expects fail; baseline may pass (`utility-page-composition-closure.test.js:156`) |
| ED-53-08 | In audited runs, Design Page is first chain artefact with material-body loss; HTML matches DP JSON |
| ED-53-09 | GAM merge runs before material-closure validation |
| ED-53-10 | Canonical elements catalogued in audit matrix (83 rows, committed registries) |

## C.2 Working hypotheses (WH)

*Require Sprint 54 artefact-chain measurement.*

| ID | Hypothesis |
| -- | ---------- |
| WH-53-01 | First loss at **Copilot Design Page generation** (condensation, synopsis, limitation excuses) |
| WH-53-02 | First loss at **GAM generation** (thin/synopsis bodies despite DLA obligations) |
| WH-53-03 | Loss at **merge key collapse** (multiple `material_id` → one type key) |
| WH-53-04 | Loss at **PEL/GAM dedup sanitizer** (`pelGamStripRedundantParagraphsFromText`) |
| WH-53-05 | PEL row fields preserve more reliably than GAM material bodies on DP compose |

## C.3 Archived hypotheses (AH)

*Do not re-investigate unless user supplies new evidence.*

| ID | Archived position |
| -- | ----------------- |
| AH-53-01 | Renderer is primary material-body loss location |
| AH-53-02 | PRISM truncates GAM before Design Page prompt assembly |
| AH-53-03 | Missing-ingredients (pedagogy absent upstream) |
| AH-53-04 | Run-capture / Copilot output injection via PRISM |
| AH-53-05 | Placeholder detection blocks live capture at `04c9e81` baseline |
| AH-53-06 | Reopen Sprint 52 education-quality as Sprint 54 work |

---

# D. Canonical Pedagogic Fidelity Model

**Authoritative catalogue:** [SPRINT-53-PEDAGOGIC-FIDELITY-AUDIT-MATRIX.md](../2026-06-29-sprint-53-learner-page-output-fixes/SPRINT-53-PEDAGOGIC-FIDELITY-AUDIT-MATRIX.md)

Do not infer new categories. Use exact PRISM names from matrix rows.

## D.1 Element families (summary counts)

| Family | Rows | Source registries |
| ------ | ---- | ----------------- |
| **PEL bundle label** | 1 | `PEL` — bundle over row fields; not a JSON key |
| **Activity-row fields** | 27 | `FIELD_PRESERVATION_FIELD_IDS`, `MANDATORY_COGNITION_FIELD_IDS`, cognition packs |
| **GAM/page material types** | 20 | Domain §6, `page-role-registry.js`, `pageFieldKeyForMaterial` |
| **Page wrapper/session** | 10 | Domain §18 page sections + upstream artefacts |
| **Episode-plan functions** | 24 | `lib/episode-plan-population-contract.js` `FUNCTION_SPECS` |
| **Workflow constraint** | 1 | `accessibility` (brief policy only) |

## D.2 PEL bundle

* **Name:** `PEL` (Pedagogic Enrichment Layer — label only)  
* **Covers:** `activity_preamble`, cognition-orientation fields, preserved verbatim with `learner_task`, `expected_output`, `support_note`  
* **Sources:** `lib/ld-design-page-compose-contract.js`, `lib/ld-self-directed-rhetoric.js`, `app.js` PEL sanitizers  

## D.3 Activity-row fields (preserve on Design Page)

`activity_preamble`, `prior_knowledge_activation`, `reasoning_orientation`, `reasoning_orientation_prompt`, `self_explanation_prompt`, `evidence_use_prompt`, `argument_structure_hint`, `conceptual_contrast_prompt`, `disciplinary_lens`, `transfer_or_application_task`, `scaffold_hint_sequence`, `uncertainty_tension_prompt`, `study_orientation`, `intellectual_frame`, `intellectual_coherence_bridge`, `learner_task`, `expected_output`, `support_note`, plus cognition-pack fields (`misconception_claim`, `reconciliation_prompt`, `evidence_contrast`, `reasoning_revision_prompt`, `initial_position_prompt`, `revision_trigger`, `transformation_activity`, `source_to_application_prompt`).

## D.4 GAM material types

`task_cards`, `prompt_set`, `scenario`, `checklist`, `template`, `sample_output`, `text`, `worked_example`, `modelling_note`, `worked_analytic_pass`, `worked_judgement_weak_strong`, `decision_table`, `analysis_table`, `classification_table`, `comparison_table`, `impact_table`, `consolidation_summary`, `transfer_prompt`, `reflection_prompt` (**renderer-only**), `misconception_note` (**weak** — not in committed registry).

## D.5 Page wrapper/session elements

`overview`, `learning_purpose`, `knowledge_summary`, `study_tips`, `learning_activities`, `assessment_check`, `support_notes`, `feedback_pack`, `marking_rubric`, `learning_sequence`.

## D.6 Episode-plan functions

`orientation`, `framing`, `activation`, `explanation`, `example`, `non_example`, `misconception_confrontation`, `criteria_exposition`, `criteria_construction`, `perspective_construction`, `worked_thinking`, `worked_judgement`, `guided_inquiry`, `guided_reasoning`, `guided_practice`, `independent_performance`, `evaluative_judgement`, `verification`, `revision`, `reflection`, `transfer`, `prediction`, `observation`, `transition`.

## D.7 Workflow constraints

`accessibility` — brief hard-constraint category only (`domain-learning-design-step-patterns.md`).

---

# E. Audit Protocol

## E.1 Three-stage audit

| Stage | Question | Pass criterion |
| ----- | -------- | -------------- |
| **A — Upstream exists** | Does required learner-support information exist **before** Design Page? | DLA obligations + GAM bodies present per matrix |
| **B — Design Page preserves** | Does DP JSON preserve upstream verbatim (row fields + material bodies)? | String/body match; no undocumented omission |
| **C — Renderer displays** | Does HTML surface preserved DP content in expected buckets? | Framing, cognition, materials, sections visible |

## E.2 Minimal sprint audit checklist

*Full tables in audit matrix § “Minimal sprint audit checklist”.*

### A — Upstream (before DP)

| ID | Check |
| -- | ----- |
| A1 | EP beats valid in `FUNCTION_SPECS` |
| A2 | DLA: `learner_task`, `expected_output`, `required_materials`; learner-page preamble + ≥1 cognition field |
| A3 | EP beats → DLA obligations |
| A4 | Every DLA `material_id` → substantive GAM `content` |
| A5 | GAM depth spot-check (no synopsis-only worked/checklist/transfer) |
| A6 | Cognition packs/factors → DLA fields when active |
| A7 | LS ⊆ DLA activity set (LS not membership authority) |

### B — Design Page preserves

| ID | Check |
| -- | ----- |
| B1 | Activity membership closure |
| B2 | Row-field verbatim (`FIELD_PRESERVATION_FIELD_IDS` + task/output/support) |
| B3 | Material bodies per `material_id` / mapped key |
| B4 | No type-key collapse (multiple Mxx → one type alias) |
| B5 | `validatePageMaterialsClosure` ≠ `fail` when GAM in PRISM state (note `skip`) |
| B6 | Wrapper sections may synthesise; must not replace B2/B3 |
| B7 | Assessment/support sections when upstream provides |

### C — Renderer displays

| ID | Check |
| -- | ----- |
| C1 | PEL/framing HTML |
| C2 | Cognition pack blocks |
| C3 | Task / expected output |
| C4 | Materials in Study/Do/Check/Reflect/Transfer buckets |
| C5 | Salience callouts (worked/checklist headings) |
| C6 | No facilitator leakage |
| C7 | Display-only transforms flagged (compare DP JSON, not HTML alone) |

## E.3 Evidence classification after audit

| Tag | Meaning |
| --- | ------- |
| **ED** | Supported by artefact diff, committed test, or code inspection |
| **WH** | Plausible; needs more runs or rows |
| **AH** | Disproven or out of scope |

---

# F. Evidence Inventory

## F.1 Sprint 53 documents (primary)

| Artefact | Path |
| -------- | ---- |
| Context pack | `../2026-06-29-sprint-53-learner-page-output-fixes/SPRINT-53-CONTEXT-PACK.md` |
| Closure report | `../2026-06-29-sprint-53-learner-page-output-fixes/SPRINT-53-CLOSURE-REPORT.md` |
| Audit matrix | `../2026-06-29-sprint-53-learner-page-output-fixes/SPRINT-53-PEDAGOGIC-FIDELITY-AUDIT-MATRIX.md` |

## F.2 Committed code (validators, contracts, renderer)

| Area | Path |
| ---- | ---- |
| Design Page compose contract | `lib/ld-design-page-compose-contract.js` |
| Materials copy contract | `lib/ld-materials-copy.js` |
| GAM preserve + material closure | `lib/page-gam-materials-preserve.js` |
| Placeholder/synopsis heuristics | `lib/design-page-materials-fidelity.js` |
| Page role registry | `lib/page-role-registry.js` |
| Episode plan population | `lib/episode-plan-population-contract.js` |
| Instructional manifestation render | `lib/ld-instructional-manifestation-render.js` |
| Pedagogic salience render | `lib/ld-pedagogic-salience-render.js` |
| App wiring (capture, export, renderer) | `app.js` |

## F.3 Committed tests

| Test file | Role |
| --------- | ---- |
| `tests/page-materials-closure.test.js` | Material closure Phase 1/2 |
| `tests/utility-page-composition-closure.test.js` | Activity closure |
| `tests/utility-page-render.test.js` | HTML render shape |
| `tests/design-page-materials-fidelity.test.js` | Placeholder heuristics |
| `tests/ld-design-page-compose-contract.test.js` | Compose prompt anchors |
| `tests/page-38p-role-fidelity.test.js` | Role fidelity |
| `tests/sprint-51-pedagogic-salience-render.test.js` | Checklist salience split |

## F.4 Fixture corpus

| Fixture | Path |
| ------- | ---- |
| Inflation workshop page | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` |
| Inflation missing activity | `tests/fixtures/page-render/ld-inflation-workshop-page-missing-a2.json` |
| Marx self-study page | `tests/fixtures/page-render/marx-self-study-page.json` |
| Climate misconception | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` |

## F.5 Prior sprint verification runs

| Run | Path |
| --- | ---- |
| Marx self-study (Sprint 50) | `../2026-06-20-sprint-50-pedagogic-manifestation/verification-runs/2026-06-18-marx-self-study/` |
| Sprint 49 Marx run2 | `../2026-06-19-sprint-49-sp-01-text-pattern/marx-run-artefacts-run2/` |

## F.6 Quarantined (not evidence)

| Location | Rule |
| -------- | ---- |
| `_archive/failed-investigation-2026-06-29/` | Do not use as baseline; failed speculative investigation |

## F.7 Sprint 54 to create

* [ ] `verification-runs/<date>-<workflow-slug>/` — full EP, DLA, GAM, LS, DP JSON, HTML, prompts  
* [ ] `observations/54-1-first-loss-stage-audit.md` — localisation + root-cause audit log with ED/WH/AH per family  

---

# G. Known Risks

| Risk | Description | Matrix risk codes |
| ---- | ----------- | ----------------- |
| Loss before Design Page | Copilot composes thin DP JSON despite rich GAM in prompt context | O, SS, BR |
| Material-type collapse | Multiple `material_id` merged to one canonical type key | KC |
| Synopsis substitution | Catalogue prose replaces GAM bodies | SS |
| Limitation excuses | `generation_notes.limitations` admits truncation | O (validator Phase 2) |
| Validator skip | No GAM in PRISM state → closure `skip` | VS |
| Wrapper synthesis | `overview` / `study_tips` rewrite journey; must not replace materials | WS |
| Dedup stripping | `pelGamStripRedundantParagraphsFromText` removes GAM paragraphs | DS |
| Renderer deprioritisation | Manifestation grammar / task-card suppression hides content | RD |
| Weak registry types | `misconception_note`, `rubric`, `quality_criteria` — sprint docs only | VS, O |
| False acceptance | Workflow Next marks step complete despite closure fail | ED-53-04 |

---

# H. Open Questions

1. **First degradation stage** — EP, DLA, GAM, LS, Copilot DP, PRISM merge, or renderer? (per family)  
2. **Uniformity** — Do PEL row fields and GAM materials fail at the same stage?  
3. **Copilot-only vs full paste** — Does fidelity differ when only DP is pasted into PRISM?  
4. **Which limitation strings** correlate with material-body loss in real artefacts?  
5. **Workbook / evaluate contracts** — Do inflation/Marx runs exercise mandatory `consolidation_summary` / evaluate trio obligations?  

## H.1 Root-Cause Analysis Principles

### Localisation comes first

Sprint 54 must first determine **where** fidelity degrades (artefact-chain audit A/B/C per matrix).

### Root-cause analysis follows localisation

Once first-loss localisation is complete, Sprint 54 should attempt to **explain** the degradation using available evidence.

### Acceptable evidence sources

* prompt contracts  
* artefact contracts  
* compose/merge logic  
* validator behaviour  
* sanitisation/deduplication logic  
* renderer behaviour  
* committed tests  
* artefact diffs  

### Prompt-contract inspection

If first loss occurs in a **Copilot-generated artefact**, prompt-contract inspection is **mandatory**.

PRISM cannot inspect model internals.

Therefore prompt contracts are one of the **primary available evidence sources** when investigating degradation occurring inside Copilot-generated artefacts.

Failure to inspect the prompt contract leaves the root-cause investigation **incomplete**.

This includes examination of:

* prompt size  
* instruction ordering  
* preservation directives  
* synthesis directives  
* omission allowances  
* limitation clauses  
* competing objectives  
* compression/brevity instructions  

**Prompt redesign remains out of scope.** Inspection informs root-cause conclusions and evidence-backed implementation candidates for a subsequent sprint.

---

# I. Next Investigation Steps

1. **Select one representative workflow** (inflation workshop or Marx self-study — must include EP→DLA→GAM→DP).  
2. **Collect artefacts** into `verification-runs/` (see F.7).  
3. **Run A1–A7** on the chain; record pass/fail per check.  
4. **Run B1–B7** on Design Page JSON vs DLA+GAM.  
5. **Run C1–C7** on HTML vs DP JSON.  
6. **Localise first failure** per family (PEL rows, GAM types, wrapper).  
7. **Update §C.1** with new ED entries only where evidenced.  
8. **Write** `observations/54-1-first-loss-stage-audit.md` — begin with localisation evidence.  
9. **Determine the most plausible explanation** for the first identified degradation.  
10. If degradation occurs in a **Copilot-generated artefact**, perform **prompt-contract inspection**.  
    **This step is mandatory when the localised degradation stage is Copilot-generated.**  
11. **Examine** (as applicable to the localised stage):
    * prompt size and structure  
    * instruction ordering  
    * preservation directives  
    * synthesis directives  
    * omission allowances  
    * limitation clauses  
    * competing objectives  
    * compression or brevity instructions  

    If prompt-contract inspection is not performed, root-cause analysis for that artefact family is **incomplete** and cannot be considered closed.  
12. **Record root-cause conclusions** as ED / WH / AH.  
13. **Separate** in the observation log:
    * localisation evidence  
    * root-cause evidence  
    * implementation recommendations (for a future sprint — not executed in Sprint 54)  
14. **Do not implement fixes** during Sprint 54.  

**Sprint 54 deliverable chain:**

```text
Where is the loss?
        ↓
Why is the loss occurring?
        ↓
Evidence-backed implementation candidates (documented only)
```

---

# J. Handover Notes For New Chats

## J.1 What has already been proven (do not re-prove)

* PRISM does not observe Copilot (ED-53-01).  
* Validators only run on supplied artefacts (ED-53-02).  
* Renderer follows DP JSON in audited cases (AH-53-01).  
* Canonical element list exists (matrix, ED-53-10).  
* Workflow Next does not block material closure (ED-53-04).  
* Sprint 50/49 Marx runs show upstream pedagogy **can** be generated and rendered when chain is healthy.

## J.2 What has not been proven

* **First stage of fidelity loss** and **most plausible root-cause explanation** for a fresh end-to-end run (primary Sprint 54 deliverable).  
* Per-element first-loss map across all 83 matrix rows.  
* Whether Phase 1/2 `validatePageMaterialsClosure` in working tree changes real-world Copilot outcomes.  
* Whether perceived learner-page thinness is caused primarily by **fidelity loss**, **presentation/salience issues**, or a **combination of both** — **unproven**.  
* Whether learner-experience concerns raised during Sprint 53 are **design issues** or **artefacts of upstream fidelity degradation** — **unproven**.  

## J.3 What should not be re-investigated

* Renderer as primary body-loss location (AH-53-01).  
* PRISM pre-prompt GAM truncation (AH-53-02).  
* Missing upstream pedagogy (AH-53-03).  
* Copilot capture/injection plumbing (AH-53-04).  
* Sprint 52 education-quality scope (AH-53-06).  
* `_archive/failed-investigation-2026-06-29/` content.  

## J.4 Common misconceptions from Sprint 53

| Misconception | Correction |
| ------------- | ---------- |
| “PRISM accepted the page so validation passed” | Next may complete step without material-closure gate; or validator `skip` without GAM in state |
| “Sprint 53 validators block Copilot” | Validators run only when user supplies artefacts to PRISM |
| “Fix the renderer first” | HTML matched DP JSON in established audits |
| “Add PRISM run-capture from Copilot” | Architecturally out of scope (AH-53-04) |
| “Hypotheses from chat are defects” | Use ED/WH/AH; WH needs artefact-chain proof |

## Before Beginning Any Investigation

The first responsibility of Sprint 54 is **not** to improve output quality.

The first responsibility is to establish whether the observed learner experience reflects:

**A.** fidelity loss,  
**B.** presentation/salience issues,  
or  
**C.** both.

Do not evaluate pedagogic quality until fidelity localisation **and root-cause analysis** are complete.

> ### Common Failure Mode
>
> Fresh investigations often jump directly from  
> **“the page feels thin”**  
> to  
> **“the pedagogy is weak”**  
> without first proving fidelity.
>
> Sprint 54 exists specifically to prevent that inference.
>
> A degraded artefact cannot be used as evidence of poor pedagogic design until fidelity has been measured.

## Localisation vs Root Cause

Sprint 54 is **not** complete when localisation is complete.

Sprint 54 is complete when both questions have been addressed:

1. **Where** does fidelity first degrade?  
2. **Why** does fidelity degrade there?

A localisation result without a root-cause investigation should be considered **incomplete**.

### Copilot-generated stages

When localisation identifies a **Copilot-generated artefact** as the first degradation stage:

1. localisation alone is insufficient;  
2. prompt-contract inspection is **required**;  
3. root-cause analysis is **incomplete** until prompt-contract evidence has been reviewed.

This requirement does not imply prompt redesign.

It only affects investigation completeness.

## J.5 Exact starting point for Sprint 54

1. Open [SPRINT-53-PEDAGOGIC-FIDELITY-AUDIT-MATRIX.md](../2026-06-29-sprint-53-learner-page-output-fixes/SPRINT-53-PEDAGOGIC-FIDELITY-AUDIT-MATRIX.md).  
2. Pick workflow: **inflation workshop** (material-depth stress) or **Marx self-study** (PEL manifestation).  
3. Obtain or re-export: `episode_plans`, `learning_activities`, `activity_materials`, `learning_sequence` (if any), `page.json`, `page.html`.  
4. Execute checklist **A1→C7**; log first failing stage per family.  
5. Complete §I steps **9–13** (root-cause analysis; mandatory prompt-contract inspection per §H.1 when first loss is Copilot-generated).  
6. Record in `observations/54-1-first-loss-stage-audit.md`; tag ED/WH/AH; separate localisation, root-cause, and implementation-candidate sections.  

**Do not begin with:** prompt edits, new validators, or workflow UI changes.

---

## Appendix — Quality standard (restored from early sprints)

This pack follows patterns from **Sprint 44** (`context-pack/06-fresh-chat-bootstrap.md`) and **Sprint 50** (`SPRINT-50-HANDOVER-PACK.md`):

| Element | Sprint 54 location |
| ------- | ------------------ |
| Read-first instructions | Top of pack |
| Executive summary (state of the world) | After instructions |
| ED / WH / AH separation | §C |
| Do-not-reinvestigate list | §J.3 |
| Artefact inventory | §F |
| Exact starting steps | §J.5 |
| Decision log (separate file) | `SPRINT-54-DECISION-LOG.md` |
| Charter + README entry | `SPRINT-54-CHARTER.md`, `README.md` |

**Sprint 53 drift corrected:** single closure doc with ED/WH/AH; matrix as durable catalogue; mandatory handover §J; explicit “not proven” list.

---

*End of Sprint 54 context pack.*
