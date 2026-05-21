# Slice 28-4 — Implementation charter (typed pedagogic cognition programme)

**Pack:** `docs/development/sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/`  
**Date:** 2026-05-21  
**Status:** **Approved for implementation** — **28-5a complete** (2026-05-21); **28-5b+** in progress  
**Gate:** Explicit approval of this document before any `app.js`, LD pack, prompt, schema, or test implementation

**Inputs:** R28-009–018, [`pedagogic-richness-evidence-matrix.md`](pedagogic-richness-evidence-matrix.md), [`activity-materials-quality-notes.md`](activity-materials-quality-notes.md) §3–12, [`workflow-probe-catalogue.md`](workflow-probe-catalogue.md), 28-3 live captures (`context-files/probe-p28-0*-live.md`, `28-3-probe-capture.json`), Sprint 27 stabilised assessment semantics (closed — do not re-litigate)

---

## Executive answer — architectural shift

**FROM:** Workflow + **assessment orchestration** as the strongest typed programme (factors, JSON contracts, composition mapping, visibility policy).

**TOWARD:** **Typed pedagogic cognition** and **learning-process architecture** — parity for how cognition unfolds in activities, materials, and composed pages, not only how instructional artefacts and assessable items are sequenced.

**Smallest credible programme (not a single PR):**

1. **E — Cognition factors + intent packs** (`activity_cognition_pack`, transcript/self-study variants) with extract/heuristic gates comparable to `assessment_pack`.
2. **O — Cognition-preserving topology** — block lean pruning of DLA/GAM/CLS when cognition packs active; progression-aware step order.
3. **G — Typed activity contracts** — DLA/GAM JSON sub-schemas for phases, reconciliation, anticipated responses, scaffold ladders (move GAM toward JSON where validation matters).
4. **C — Composition parity** — preserve learning-process sections as strongly as `assessment_check`; canonical `section_id`; anti-assessment-forward collapse guards.
5. **E — Evaluation harness** — rubric automation / fixture baselines for D1–D10 and cognition factors (28-5e).

**Explicit invariant (carry forward from Sprint 27):**

| Channel | Owns | Does not own |
|---------|------|----------------|
| **Assessment semantics** (Sprint 27) | Item authorship, visibility, feedback timing, misconception **in items** | Full activity cognition arcs |
| **Pedagogic cognition** (Sprint 28+) | Learning-process phases, repair, revision, scaffolding **in activities/materials** | Replacing assessment engine or renderer materials architecture |

---

## A. Problem statement (evidence-backed)

PRISM reliably produces **structurally correct instructional orchestration** and **rich assessment artefacts** when briefs are ambiguous or assessment-forward. It does **not** yet reliably produce **pedagogically intelligent learning experiences** — especially for **asynchronous CPD** and **self-study** where **no tutor recovers** thin materials.

### Confirmed symptoms (28-1 → 28-3)

| ID | Finding | Layers | Source |
|----|---------|--------|--------|
| P28-001–006 | Climate fixture: thin task cards, no contingent moves, single activity block | G, C | Case 1 fixture |
| P28-009–012 | Self-study lean path; assessment-only pages; no reconciliation | O, G, C | Cases 4–5 |
| P28-013–014 | Peer revision in brief ≠ phased materials; transcript harness drops GAI | E, O | Cases 2–3 |
| P28-015–016 | No cognition factors; `assessment_pack` lean attractor | E, O | 28-2 audit |
| P28-017–018 | Live compose: missing `section_id`; MCQ duplication | C, G | 28-3 live |
| H10 | Cognition **weakly typed** vs assessment | E, G | 28-2 |
| H11 | Activity prompts **rhetorical**; explicit briefs help live only | G | 28-2, 28-3 |
| H12 | Composition **favours assessable** artefacts | C | 28-2; weakened 28-3 when brief forces activities |
| H13 | **Representation ceiling** — prose lift without ontology extension | G, E | 28-3 (~1.5–1.7 vs ~0.2–1.2) |

### Programme question for 28-4+

> How does PRISM evolve from **AI learning-content orchestration** toward **pedagogically credible expertise transformation** — reproducibly, not only when educators write unusually explicit briefs?

**Answer:** Extend the **ontology and contracts** that already succeeded for assessment semantics — **not** another round of prompt adjectives alone.

---

## B. Investigation conclusions (do not re-open without new evidence)

| Hypothesis | Verdict | Implication for implementation |
|------------|---------|--------------------------------|
| **H6** | **Partial** (strengthened on explicit briefs) | Need **typed progression phases**, not only CLS prose |
| **H7** | **Supported** (weakened when brief forces rich G) | Default path still artefact-heavy; self-study remains stringent |
| **H8** | **Supported** | Guard lean topology when `self_study_cognition_pack` |
| **H9** | **Partial** (P28-02 live D9=3) | Need `reasoning_revision_cycle` factor + schema |
| **H10** | **Supported** | Model cognition like assessment: factors + JSON |
| **H11** | **Partial** | Structural requirements in DLA/GAM, not rhetoric |
| **H12** | **Partial** | Composition guards + section parity |
| **H13** | **Partial** | Ceiling lifts with brief + types; plateaus without both |

**Live probe anchor (28-3):** P28-01 **~1.7**, P28-02 **~1.5**, P28-07 **~1.6** investigator means vs fixture baselines **~0.2–1.2** — proves **generation can improve**; does **not** prove **reliability under ordinary briefs**.

---

## C. Why prompt engineering alone is insufficient

28-3 live generation under **current pack contracts** demonstrates:

| Observation | Evidence | Why prompts alone fail |
|-------------|----------|------------------------|
| Richer **prose** and phased activities emerge | P28-01/02/07 live G/C | Models fill **existing string fields** when briefs are explicit |
| **E** factors stay thin or wrong | P28-01: `page_profile`, missing `misconception_assessment_link` | Extract/queue has **no cognition factors** to bind prompts |
| No typed **reconciliation** or repair ladder | All live probes | Schemas do not **require** `reconciliation_stage`, `anticipated_responses[]`, hint levels |
| **Regression** under ordinary briefs | 28-1 fixtures, lean retrieval | Without factors, **`leanAssessmentItemIntent`** + assessment JSON remain **attractors** |
| **Composition drift** | P28-017 `section_id`; P28-018 MCQ dup | C layer has no **cognition parity** rules like assessment preservation |

**Working rule:** Prompt enrichment is a **necessary amplifier** after representation exists; it is **not** a substitute for **typed slots** that E/O/G/C can validate, test, and preserve.

---

## D. Commercial CPD implications

| Requirement | Why PRISM’s current shape falls short | Charter response |
|-------------|--------------------------------------|------------------|
| **Transcript/document → learning experience** | P28-07 live shows transformation **possible**; RNA fixture shows **assessment-only collapse** without packs | `transcript_transformation_pack` + mandatory activity sections |
| **Asynchronous professional learners** | No tutor recovery (28-1b); D6/D7 often **0** on fixtures | `self_study_cognition_pack`; scaffold + self-explanation types |
| **Pedagogic credibility** | Stakeholders judge **process** (conflict, revision, evidence), not MCQ count | Rubric D1–D10 + harness gates |
| **Expertise → learning** | Extraction summarises content; does not guarantee **conceptual change pathway** | `cognitive_progression_phase` + `misconception_reconciliation` in G |
| **CPD transformation vs content generation** | H5: assessment can exceed activities | **Composition parity** — activities not omissible when pack active |

**Strategic use-case priority (implementation order bias):**

1. **Transcript/source transformation** (P28-07, P28-08 probes) — highest commercial signal.  
2. **Self-study cognition** (P28-08, P28-09) — no facilitator safety net.  
3. **Facilitated stress-tests** (P28-01, P28-02) — regression anchors for dialogic quality.

---

## E. Implementation themes (programme structure)

### Theme A — Typed pedagogic cognition

Introduce **first-class cognition concepts** (class **D** → **A** in ontology audit) as factors and/or required JSON sub-objects.

| Concept ID | Purpose | Suggested representation |
|------------|---------|------------------------|
| `reasoning_revision_cycle` | Predict → discuss → revise → reveal | Factor enum + DLA activity `phases[]` |
| `misconception_reconciliation` | False claim → evidence → reconcile | Required material block type |
| `cognitive_progression_phase` | activate / confront / reconcile / apply | Enum per activity or CLS phase |
| `productive_uncertainty_mode` | Sustained interpretive gap | Factor + prompt constraints |
| `adaptive_scaffolding` | If-then hint ladder | Typed `scaffold_steps[]` with trigger |
| `learner_model_expectations` | Anticipated partial understandings | `anticipated_responses[]` required when pack on |
| `conceptual_conflict` | Competing explanations | Task card + discussion schema |
| `self_explanation_prompting` | Articulate reasoning | Required prompt_set entries |

**Maps to gaps:** P28-003, P28-012, P28-015, H10.

### Theme B — Activity cognition packs

Mirror Sprint 27 **`assessment_pack`** / `intentClasses` pattern for **learning-process intent**.

| Pack ID | Trigger cues (draft) | Topology expectation |
|---------|---------------------|-------------------|
| `activity_cognition_pack` | Base: `activities_required` + workshop/seminar | DLA → GAM → GAI → CLS → Design Page |
| `seminar_dialogic_pack` | Misconception seminar, task cards, dialogic | + `misconception_reconciliation`, rich task cards |
| `peer_instruction_pack` | Predict, pair, revise, confidence | + `reasoning_revision_cycle`; peer phase factors |
| `transcript_transformation_pack` | `provided_source_content`, transcript upload | **Forbid** lean-only GAI path; min activity count |
| `misconception_repair_pack` | Diagnostic workshop, false claims | Links to `misconception_assessment_link` but **activity-side** repair |
| `self_study_cognition_pack` | Solo revision, CPD, no tutor | **Block** `leanAssessmentItemIntent` when activities implied |

**Maps to gaps:** P28-009, P28-010, P28-014, P28-016, H8, H12.

### Theme C — Richer orchestration semantics

| Change | Bounded detail |
|--------|----------------|
| Cognition-preserving topology | When any cognition pack active: **do not** apply `preferLeanAssessmentFlow` / drop DLA/GAM |
| Progression-aware sequencing | CLS phases must align with `cognitive_progression_phase` factors |
| Harness alignment | Observation scenarios assert GAI **and** DLA when `assessment_required` + activities (fix P28-014 class) |
| `peer_instruction_phase` consistency | Reconcile harness `none` vs brief peer cues (Case 2) |

**Maps to gaps:** P28-006, P28-013, P28-014, P28-016.

**Preserve:** Sprint 27 step order for assessment semantics when `assessment_pack` active; Design Feedback inclusion rules unchanged.

### Theme D — Stronger activity-generation contracts

Move **GAM** toward **JSON** (or JSON sections) with validation; tighten **DLA** required keys.

| Requirement | When active (example) | Contract owner |
|-------------|----------------------|----------------|
| Required **reconciliation stage** | `misconception_repair_pack` | GAM / DLA |
| Required **revision prompt** | `peer_instruction_pack` | DLA `phases[]` |
| Required **misconception anticipation** | `seminar_dialogic_pack` | `anticipated_responses[]` min length |
| Required **scaffold progression** | `self_study_cognition_pack` | `scaffold_steps[]` with fade |
| Required **transfer/application** stage | `cognitive_progression_phase: apply` | Final activity block |

**Maps to gaps:** P28-001–004, P28-011, P28-013, H11.

**Preserve:** GAI `assessment_items` schema and Sprint 27 semantic propagation — **extend**, do not replace.

### Theme E — Composition parity

| Change | Bounded detail |
|--------|----------------|
| Preserve activities | When cognition pack + `activities_required`: **fail or warn** if zero `learning_activities` sections |
| Anti-assessment-forward collapse | RNA-class pages must not ship assessment-only if brief requested activities (P28-010) |
| Cognitive phase visibility | `section_id` canonical: `learning_activities`, `formative_assessment`, `facilitator_notes` |
| De-duplicate assessable content | Single source of truth: page items **or** embedded activity MCQs, not both (P28-018) |
| Metadata bridge | `page.cognition_profile` echoing resolved factors (mirror assessment visibility pattern) |

**Maps to gaps:** P28-005, P28-010, P28-017, P28-018, H12.

**Preserve:** `applyAssessmentSemanticsToComposedPage`, epistemic grounding (`provided_source_content`), renderer typed blocks (Sprint 26) — **policy mapping only** in 28-5d unless new section types required.

---

## F. Prioritised implementation slices

### 28-5a — Ontology / factor layer

| Attribute | Detail |
|-----------|--------|
| **Rationale** | Without factors, prompts and topology lack stable IDs (H10, P28-015) |
| **Likely impact** | **High** — enables all downstream packs and extract fidelity |
| **Regression risk** | **Medium** — extract false positives; mitigated by negation patterns from 27-4 |
| **Dependencies** | None (first) |
| **Test implications** | `workflow-ld-cognition-factors-extract.test.js`; extend observation harness factor assertions |

**Scope (draft):** Add cognition optionalFactors to `workflowBriefConfig`; runtime merge like assessment semantics; `activity_cognition_pack` selector; map P28-003 dialogic richness cues.

### 28-5b — Orchestration semantics

| Attribute | Detail |
|-----------|--------|
| **Rationale** | Fixes lean attractor and harness GAI omission (P28-009, P28-014, P28-016) |
| **Likely impact** | **High** for self-study and transcript paths |
| **Regression risk** | **High** — topology changes affect all LD workflows |
| **Dependencies** | 28-5a packs defined |
| **Test implications** | Topology tests for each pack; **regression:** retrieval-quiz unchanged when pack unset; RNA full chain preserved |

### 28-5c — Activity schemas / generation contracts

| Attribute | Detail |
|-----------|--------|
| **Rationale** | Closes H11 rhetoric gap; makes 28-3 live quality **reproducible** |
| **Likely impact** | **High** on rubric D2–D9 |
| **Regression risk** | **Medium** — stricter JSON may fail legacy briefs; feature-flag per pack |
| **Dependencies** | 28-5a factors; 28-5b topology includes GAM |
| **Test implications** | Fixture JSON snapshots for DLA/GAM; optional live smoke (not CI-required) |

### 28-5d — Composition preservation

| Attribute | Detail |
|-----------|--------|
| **Rationale** | Closes H12 assessment-forward collapse (P28-010, P28-017, P28-018) |
| **Likely impact** | **High** for CPD/export credibility |
| **Regression risk** | **Medium** — page shape changes; renderer must already support section types |
| **Dependencies** | 28-5c upstream activities exist |
| **Test implications** | Page fixtures: climate, RNA, peer, transcript; assert `section_id` + activity section count |

### 28-5e — Evaluation harness / rubric automation

| Attribute | Detail |
|-----------|--------|
| **Rationale** | Prevent regression to representation ceiling; support CPD QA |
| **Likely impact** | **Medium** long-term; **high** for programme governance |
| **Regression risk** | **Low** if read-only analysers |
| **Dependencies** | Rubric D1–D10 frozen (28-1); optional cognition factor checks |
| **Test implications** | Static analysers on fixtures (no LLM judge in CI); extend post-stabilisation harness |

**Rollout order (recommended):**

```mermaid
flowchart LR
  A[28-5a Factors/Packs] --> B[28-5b Topology]
  B --> C[28-5c Activity contracts]
  C --> D[28-5d Composition]
  D --> E[28-5e Harness]
```

| Order | Slice | Rationale |
|-------|-------|-----------|
| 1 | **28-5a** | IDs for extract, queue, and prompt binding |
| 2 | **28-5b** | Stop wrong topology before schema work |
| 3 | **28-5c** | Typed G outputs |
| 4 | **28-5d** | Learner-visible parity |
| 5 | **28-5e** | Lock gains in CI |

**Suggested PR sizing:** 5a+5b (one PR), 5c (pack-heavy), 5d+fixtures (one PR), 5e (incremental).

---

## G. Regression anchors (must preserve)

| Area | Sprint | Guard |
|------|--------|-------|
| Assessment factor extract | 27-4a | Existing P27-02/03/04 brief tests |
| `feedback_timing`, `learner_answer_visibility` | 27-4 | No factor rename without migration |
| Design Feedback inclusion | 27-4b | Formative + discussion briefs |
| Epistemic grounding | 27-3 | `provided_source_content` ≠ facilitator invention |
| Renderer visibility | 27-4e | Hidden answers on learner handouts |
| Activity chain when `activities_required` | 26 | Climate topology tests |
| Test floor | 27 post-stabilisation | **311+** passing; add, do not delete |

**Climate fixture (`ld-climate-misconception-discussion-page.json`):** Retain as **baseline**; post-implementation fixture should **meet or exceed** live P28-01 rubric under **default** brief, not only “rich brief” variant.

---

## H. Proposed fixtures / tests (implementation phase — paths only)

| Fixture | Probe / gap | Asserts |
|---------|-------------|---------|
| `workflow-brief-ld-sparse/p28-01-climate-rich-task-cards.json` | P28-01 live | cognition pack + factors + full chain |
| `workflow-brief-ld-sparse/p28-02-peer-revision.json` | P28-02 | `reasoning_revision_cycle`, no MCQ dup at C |
| `workflow-brief-ld-sparse/p28-07-transcript-dialogic.json` | P28-07 | activities ≥ N, not assessment-only page |
| `workflow-brief-ld-sparse/p28-08-self-study-cpd.json` | P28-08 | `self_study_cognition_pack`, no lean prune |
| `page-render/p28-02-peer-learner-page.json` | P28-018 | single MCQ source, canonical `section_id` |
| `page-render/p28-07-transcript-learner-page.json` | P28-010 | `learning_activities` section present |

| Test file | Coverage |
|-----------|----------|
| `tests/workflow-ld-cognition-factors-extract.test.js` | 28-5a |
| `tests/workflow-ld-cognition-pack-topology.test.js` | 28-5b |
| `tests/workflow-ld-activity-schema-validation.test.js` | 28-5c (static JSON schema) |
| `tests/utility-ld-cognition-page-compose.test.js` | 28-5d |
| Extend `workflow-sprint27-post-stabilisation-observation.test.js` | No regression on 27 scenarios |

**Post-implementation:** Re-run `28-3-probe-runner.js` under Factory wiring; compare rubric means to 28-3 baseline.

---

## I. Explicit non-goals

| Non-goal | Rationale |
|----------|-----------|
| Autonomous tutoring / adaptive runtime learner models | Investigation scope; not evidenced in production |
| Replacing Sprint 27 assessment semantics | Closed programme |
| Full renderer redesign | Sprint 26 consolidation; map new metadata only |
| LLM-as-judge in CI for “pedagogy quality” | Flaky; use D1–D10 static checks |
| Mandatory rich brief wording for quality | Product must work on **ordinary** educator prose via factors |
| Confidence/CARS item types | Deferred unless blocking |
| Dual-page facilitator auto-generation | Product decision; use flags |
| Re-opening answer-visibility contracts | Unless probe proves regression |

---

## J. Gap → slice mapping (P28-001–018)

| Gap | Priority | Primary slice |
|-----|----------|---------------|
| P28-001–004 | High | 28-5c, 28-5a (`seminar_dialogic_pack`) |
| P28-005 | Medium | 28-5d, 28-5c (item count linkage) |
| P28-006 | Medium | 28-5b, 28-5c (multi-phase) |
| P28-009 | High | 28-5b (`self_study_cognition_pack`) |
| P28-010 | High | 28-5d |
| P28-011–012 | Medium | 28-5c, 28-5a |
| P28-013 | High | 28-5a, 28-5c (`peer_instruction_pack`) |
| P28-014 | High | 28-5b |
| P28-015 | High | 28-5a |
| P28-016 | High | 28-5b |
| P28-017 | Medium | 28-5d |
| P28-018 | Medium | 28-5d |

---

## K. Emerging PRISM proposition

**Evidence-backed framing only:**

PRISM has demonstrated **mature instructional orchestration** and **assessment-semantics engineering** (Sprints 26–27). Sprint 28 shows the next bottleneck is **not** topology alone but **learner cognition representation**: instructional artefacts are generated reliably; **how learning unfolds** is mostly **prompt prose** unless briefs are unusually explicit (28-3 live lifts; fixtures regress).

**Emerging proposition:**

> PRISM is evolving from **AI learning-content orchestration** toward **pedagogically intelligent expertise transformation** — converting subject-matter artefacts (briefs, transcripts, documents) into **credible learning processes** (conflict, revision, scaffolding, reconciliation), not only **formatted instructional outputs**.

**Claims we can make today:**

- Orchestration and assessment paths are **production-grade** relative to cognition paths.  
- **CPD/transcript transformation** is **technically feasible** under explicit contracts (P28-07 live).  
- **Reliability** for typical briefs requires **typed cognition** (H13), not prompt tuning alone.

**Claims we cannot make yet:**

- Reproducible **adaptive scaffolding** or **learner-model-aware** materials without tutor.  
- Guaranteed **conceptual change pathways** in default exports.  
- Pedagogic parity between **activities** and **assessment_items** on ambiguous briefs.

---

## L. Investigation exit vs implementation gate

| Criterion | Status |
|-----------|--------|
| Evidence matrix Cases 1–5 | **Complete** |
| Ontology audit H10–H12 | **Complete** |
| Live probes P28-01/02/07 | **Complete** |
| Gap list P28-001–018 prioritised | **Complete** (this charter) |
| Implementation charter drafted | **Complete** (this document — **draft**) |
| Charter **user-approved** | **Pending** |
| **28-5a** factors/packs | **Complete** — [`context-files/28-5a-baseline.md`](context-files/28-5a-baseline.md) |
| **28-5b** orchestration | **Complete** — [`context-files/28-5b-baseline.md`](context-files/28-5b-baseline.md) |
| Implementation 28-5c+ | **Next** |
| Sprint 28 programme **closed** | **No** — awaits 28-5 implementation and post-implementation probe re-run |

---

## M. References

| Document | Role |
|----------|------|
| [`pedagogic-richness-evidence-matrix.md`](pedagogic-richness-evidence-matrix.md) | Layer evidence + hypothesis table |
| [`activity-materials-quality-notes.md`](activity-materials-quality-notes.md) | Rubric D1–D10, ontology §3, ceiling §12 |
| [`context-files/probe-p28-01-live.md`](context-files/probe-p28-01-live.md) | Live climate |
| [`context-files/probe-p28-02-live.md`](context-files/probe-p28-02-live.md) | Live peer |
| [`context-files/probe-p28-07-live.md`](context-files/probe-p28-07-live.md) | Live transcript |
| [`../2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/slice-27-4-charter.md`](../2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/slice-27-4-charter.md) | Precedent charter pattern |

---

*End of slice 28-4 charter (draft).*
