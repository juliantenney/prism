# Sprint 28 review log

**Pack:** `docs/development/sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/`  
**Decisions:** R28-001+

---

## 2026-05-21 — Sprint 28 pack prepared (investigation not started)

### Programme decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R28-001 | Sprint 28 theme is **pedagogic richness & dialogic learning design** — investigation only | Sprint 27 closed assessment/feedback semantics; next quality gap is activity-material depth (see **R28-010** for cognitive engagement reframing) |
| R28-002 | **No implementation** until 28-1–28-3 complete and rubric validated | Avoid prompt churn before evidence |
| R28-003 | **Climate misconception seminar** is primary carry-forward case | Combines task cards, dialogic discussion, misconception framing, stabilised delayed assessment |
| R28-004 | Sprint 27 outcomes are ** Preconditions**, not re-investigated | 311-test floor; observation harness; visibility/topology stabilised |
| R28-005 | Hypothesis verdicts **pending** until 28-1 matrix + rubric scoring | See [`pedagogic-richness-evidence-matrix.md`](pedagogic-richness-evidence-matrix.md) |
| R28-006 | Richness rubric D1–D10 lives in [`activity-materials-quality-notes.md`](activity-materials-quality-notes.md) | Shared probe scoring instrument |
| R28-007 | `slice-28-4-charter.md` **not created** in initial pack | Created only after investigation exit criteria met |
| R28-008 | Renderer layer **secondary** unless export contradicts rich JSON | Sprint 26 closed structural rendering; Sprint 28 targets generative depth |

### Hypothesis register (working)

| ID | Working stance | Notes |
|----|----------------|-------|
| H1 | Open | Topology likely pass; GAM depth unknown |
| H2 | Open | Template task cards suspected |
| H3 | Open | Contingent facilitator moves suspected rare |
| H4 | Open | Analysis prompts ≠ dialogic tension |
| H5 | Open | Post–S27 assessment may exceed activities |
| H6 | Open | CLS prose vs material-level progression |
| H7 | Open | Instructional artefacts vs learner cognition |
| H8 | Open | Lean retrieval topology vs activity cognition |
| H10 | Open | Cognition weakly typed vs assessment |
| H11 | Open | Activity prompts rhetorical not structural |
| H12 | Open | Composition privileges assessment |

Formal Supported/Partial/Refuted: **28-2 draft** H10–H12 in matrix; programme closure after 28-3.

---

## 2026-05-21 — R28-010 (draft): Conceptual reframing — cognitive engagement architecture

**Status:** **Draft** — documentation-only; does not supersede R28-009 climate audit findings.

### Decision

Reframe Sprint 28 from primarily **“dialogic richness”** toward **“pedagogic richness and cognitive engagement architecture”** while **preserving** dialogic/facilitated probes as **stress-tests**.

### Rationale

28-1 and programme context show PRISM is relatively strong at **topology**, **sequencing**, **assessment semantics** (Sprint 27), and **typed composition**, but weak at **learner cognition modelling** inside materials (climate fixture: **D6/D7 = 0**).

### What changed (docs only)

| Area | Update |
|------|--------|
| Charter / index / handover | Core question, H7, strategic use-cases, augmentation principle |
| Rubric notes | Additive **cognitive engagement** interpretation for D3, D6, D7, D9 (IDs unchanged) |
| Probe catalogue | P28-08, P28-09 self-study; climate = stress-test |
| Matrix | Self-study cases 4–5; reframing preamble; H7 row |

### What did not change

- Climate Case 1 **scores**, layer verdicts, and gap IDs (**preserved**)
- Sprint 27 foundations and test floor (**311**)
- No runtime, prompt, schema, or renderer edits

### Explicit non-implications

- Not **autonomous tutoring**
- Not **adaptive runtime personalisation**
- Not claiming **dynamic learner models** in production

---

## 2026-05-21 — R28-011 (draft): Self-study as primary strategic use-case

**Status:** **Draft**

### Decision

Elevate **self-study** and **learner-facing resource generation** to **primary strategic** concern alongside facilitated formats.

### Rationale

When **adaptive scaffolding** and **learner-model awareness** are absent (climate 28-1), facilitated seminars may still “work” via tutor recovery; **solo learners cannot**. Observation harness already includes `retrieval-quiz` and `no-assessment-page` scenarios for matrix Cases 4–5.

### Implications

- Prioritise P28-08 / P28-09 in 28-2/28-3 after climate stress-test
- Score solo briefs emphasising **D3, D6 (embedded), D7, D8**

---

## 2026-05-21 — R28-009 (draft): 28-1 climate misconception seminar evidence audit

**Status:** **Draft** — Case 1 matrix row complete; **investigation not complete** (cases 2–4 and programme hypothesis sign-off pending).

### Evidence reviewed

| Source | Use |
|--------|-----|
| Climate brief + read-only `extractWorkflowBriefExplicitFactors` / `applyWorkflowDesignHeuristics` | **E/O** for exact observation-harness text |
| `tests/workflow-sprint27-post-stabilisation-observation.test.js` + manual observation log | Cross-check assessment semantics (out of richness scope) |
| `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` | **C** proxy for **G** activity + assessment shape |
| `tests/utility-ld-climate-misconception-page-render.test.js` | **R** fidelity |
| `probe-p27-04-assessment-items-excerpt.md` | Fixture lineage label (not live G from climate brief) |
| `probe-p27-02-resolved-factors.md` | **Analogue only** (ocean acidification; pre–Sprint 27) — **not** used as climate E/O |

### Findings (richness-focused)

1. **Structure (H1):** Post–Sprint 27 topology includes DLA → GAM → GAI → Design Feedback → CLS → Design Page for the climate brief — **evidenced**.
2. **Standalone G artefacts:** `learning_activities` and `activity_materials` JSON for this case — **not evidenced** in repo.
3. **Material depth:** Fixture shows **10 misconception claims**, worksheet, **3 discussion prompts**, procedural checklist — **partial** dialogic richness (rubric mean **1.2** on scored dimensions).
4. **Facilitator contingency (H3):** `facilitator_moves` and “if learners say X…” guidance — **not evidenced** on page; brief asks facilitator notes — **not evidenced** as separate artefact.
5. **Scenarios (H2):** Claims without authentic scenario framing — **partial** at best.
6. **Sequencing (H6):** One 40-minute activity vs 60-minute seminar — **partial**.
7. **Assessment contrast (H5):** Activity materials **broader** than 2 T/F items; brief requests **5** items — fixture **not evidenced** as full formative set.
8. **Composition/render (P28-007/008):** Typed materials and prompts **preserved** in export HTML — climate case does **not** support flattening/strip hypotheses.

### Climate-row hypothesis reads (draft — not programme closure)

| ID | Draft read |
|----|------------|
| H1 | Partial |
| H2 | Partial |
| H3 | Supported (absence in fixture) |
| H4 | Partial |
| H5 | Partial |
| H6 | Partial |

### Implications (documentation only)

- **28-2** should inventory missing elicitation factors (`dialogic_mode`, `facilitator_contingency`, `cognitive_progression`, etc.).
- **28-3** should run **P28-01** (richer task cards brief) with live G/C/R capture — not done in 28-1.
- **No implementation** until programme matrix and rubric replicated on ≥2 additional probes (per investigation-plan exit criteria).

### Test floor

`node --test tests/*.test.js` → **311 passed** (28-1 session).

---

## 2026-05-21 — R28-012 (draft): 28-1b self-study cognitive engagement audit

**Status:** **Draft** — Case 5 (profiles A–D) + Case 4 complete; **climate Case 1 unchanged**; cases 2–3 matrix rows still pending.

### Evidence reviewed

| Source | Layer | Use |
|--------|-------|-----|
| Observation harness `retrieval-quiz` | E/O | Lean MCQ revision topology |
| Observation harness `no-assessment-page` | E/O | Explainer chain (DLA → GAM, no GAI) |
| Observation harness `transcript-source` | E/O | Activities+formative wording; **GAI omitted** in heuristic steps |
| `tests/fixtures/workflow-brief-ld-sparse/rna-virus-activities-formative.json` | E | Sparse self-study + transcript brief |
| `tests/workflow-ld-rna-sparse-brief-topology.test.js` | O | Full chain incl. GAI + CLS |
| `tests/fixtures/page-render/ld-rna-hcv-assessment-page.json` | C | Assessment-forward solo page |
| `tests/utility-ld-rna-assessment-page-render.test.js` | R | 10 MCQs; no correct-answer leak |
| Climate Case 1 matrix row | Comparator | Facilitator-mediated vs solo |

### Findings (cognitive engagement)

1. **Pedagogic compensation:** Tutor-led climate materials can be **delivery-viable** with **D6/D7 = 0**; solo learners **cannot** recover — self-study is the **stricter** test (**§0a** quality notes).
2. **Formatting vs cognition:** PRISM outputs lean **instructional formatting** (typed sections, MCQ blocks, `page_profile: assessment`) over **cognitive engagement design** (scaffolding branches, repair, revision cycles) — supports **H7**.
3. **Retrieval-quiz (profile A):** Topology **prunes** DLA/GAM/CLS; rubric mean **≈ 0.1**; supports **H8** and **P28-009**.
4. **RNA/HCV page (profile C):** Topology tests show **full chain**; composed page is **assessment-only** with generic `support_notes` — **P28-010**, **P28-011**; rubric mean **≈ 0.3**.
5. **No-assessment (profile B):** O-layer activity chain **preserved**; **no** page fixture — G/C/R not scored.
6. **Transcript harness (profile D):** `assessment_required` + default item count but **no GAI** in steps — topology inconsistency under sparse harness text.

### Case 5 hypothesis reads (draft)

| ID | Draft read |
|----|------------|
| H7 | **Supported** (self-study) — cognition thin in learner-facing artefacts |
| H8 | **Supported** — retrieval-first lean path |
| H1 | **Partial** — structure/orchestration can pass; cognition fails |
| H5 | **Partial** — assessment dominates composed page vs activities |

### Gaps confirmed (self-study)

**P28-009** (lean topology), **P28-010** (assessment-forward page), **P28-011** (mechanical reflection), **P28-012** (no reconciliation stage).

### Key investigation answer (draft)

> Can PRISM remain pedagogically effective without tutor compensation?

**Evidence-based answer:** **Not yet demonstrated** for solo paths — orchestration and assessment generation **outpace** embedded cognitive architecture in fixtures and harness E/O.

### Test floor

`node --test tests/*.test.js` → **311 passed** (28-1b session; docs only).

---

## 2026-05-21 — R28-013 (draft): 28-1c peer instruction reasoning-cycle audit (Case 2)

**Status:** **Draft** — matrix row complete; **no live G/C/R**; programme not closed.

### Evidence reviewed

| Source | Use |
|--------|-----|
| Observation harness `peer-instruction` + `manual-validation-observation-log.md` | E/O for opportunity-cost brief |
| `tests/workflow-ld-assessment-semantics-extract.test.js` (P27-03) | `think_pair_share`, `page_profile: learner` |
| `tests/workflow-ld-assessment-semantics-topology.test.js` | DLA before GAI |
| `tests/workflow-ld-assessment-semantics-e2e.test.js` (27-4f) | `reflection_then_answers` composition when timing resolved |
| `probe-p27-03-peer-instruction.md` | Historical E/O gaps (timing null at capture) |

### Findings

1. Briefs encode **revise answers** and **after pair discussion** — linguistic **reasoning revision** intent.
2. **E partial:** harness captures `feedback_timing: after_peer_discussion` but `peer_instruction_phase: none` (default); P27-03 captures `think_pair_share` only on stoichiometry variant.
3. **O pass (structure):** activity chain before assessment; **no** distinct predict / discuss / revise **phases** in topology output names.
4. **G/C/R not evidenced** for full peer session page; 27-4f shows **assessment-only** page path with hidden answers until self-check block — **ordering**, not dialogic activity design.
5. **D9 ≈ 1**, **D6/D7 = 0**; mean rubric **≈ 0.2**.
6. Strengthens **H6**, **H7**; **H4** Partial; does **not** refute **H8** (peer is not lean-retrieval).

### Gap

**P28-013** — revision cycle in prose, not in materials.

---

## 2026-05-21 — R28-014 (draft): 28-1c transcript transformation audit (Case 3)

**Status:** **Draft**

### Evidence reviewed

| Source | Use |
|--------|-----|
| `rna-virus-activities-formative.json` + `workflow-ld-rna-sparse-brief-topology.test.js` | E/O full chain with GAI |
| Observation harness `transcript-source` + log | Topology **without GAI** |
| `ld-rna-hcv-assessment-page.json` + render test | C/R assessment-forward |
| `workflow-ld-epistemic-grounding.test.js` | `provided_source_content`; GLC omission |
| P27-04 note + climate fixture | Transcript **workshop** analogue |

### Findings

1. **Epistemic grounding preserved** — `provided_source_content`; no forced GLC on authoritative upload.
2. **Pedagogic transformation not evidenced** on RNA learner page — **no** `learning_activities` section; MCQ-only (**P28-010**).
3. Harness `transcript-source`: `assessment_required: true` but step chain **omits Generate Assessment Items** (**P28-014**).
4. RNA sparse topology test: DLA → GAM → GAI order **passes** — contrast shows **O inconsistency** across brief shapes.
5. P27-04 climate analogue: transcript + **misconception workshop** brief yields richer **C** than RNA follow-up page — transformation depends on brief vocabulary, still shallow on D6/D7.
6. Rubric mean **≈ 0.2** (RNA page); strengthens **H5**, **H6**, **H7**; **H8** not applicable.

### Test floor

`node --test tests/*.test.js` → **311 passed** (28-1c session; docs only).

---

## 2026-05-21 — R28-015 (draft): Representational ontology audit (28-2)

**Status:** **Draft** — read-only architecture audit; no pack/code changes.

### Scope

Map pedagogic concepts to representation classes **A** (first-class factor) / **B** (heuristic) / **C** (prose) / **D** (absent) across E/O/G/C.

### Sources

- `domain-learning-design-step-patterns.md` — `workflowBriefConfig`, DLA, GAM, GAI, CLS, Design Page prompts  
- `app.js` — `extractWorkflowBriefExplicitFactors`, `augmentWorkflowBriefConfigAssessmentSemantics`, `leanAssessmentItemIntent`, `applyAssessmentSemanticsToComposedPage`  
- Sprint 28-1 matrix Cases 1–5

### Findings

1. **Assessment lane** is first-class: factors, `assessment_pack` intent, typed GAI JSON, presentation mapping (Sprint 27).  
2. **Cognition lane** is mostly **class D** at E; **class C** at G (required field **names** without cognitive sub-schema); GAM **text** output.  
3. **Only `assessment_pack`** intent class — no activity/dialogic intent class.  
4. §3.2 ontology table and §3.3 “where richness lives” in [`activity-materials-quality-notes.md`](activity-materials-quality-notes.md).  
5. Supports **H10** (draft **Supported**).

### Gaps

**P28-015** — cognitive-engagement factors absent from brief config.

---

## 2026-05-21 — R28-016 (draft): Pedagogic representation asymmetry (28-2)

**Status:** **Draft**

### Decision

Programme primary gap is **internal representation**, not isolated prompt quality on one step.

### Evidence

| Asymmetry | Assessment | Activities / cognition |
|-----------|------------|----------------------|
| Prompt output | JSON + required keys | DLA JSON labels; GAM **text** |
| Elicitation queue | `assessment_pack` ordered factors | No cognition queue |
| Orchestration attractor | `leanAssessmentItemIntent` | Drops DLA/GAM on ambiguous briefs |
| Composition | Preserve **all** items | Activities omissible with `generation_notes` |
| 28-1 outcomes | Semantics stabilised | Rubric means ≤1.2; D6/D7 often 0 |

### Hypotheses (draft)

- **H11 Supported** — rhetorical activity prompts  
- **H12 Partial** — composition favours assessment blocks when upstream thin  

### Architectural synthesis

See matrix **“Emerging architectural diagnosis”** and quality notes §11.

### Test floor

`node --test tests/*.test.js` → **311 passed** (28-2 session; docs only).

---

## 2026-05-21 — R28-017 (draft): Live generation validation (28-3)

**Status:** **Draft**

### Decision

Live generation under **current pack contracts** (DLA → GAM → GAI → Design Page, `gpt-4.1-mini`) **substantially exceeds** 28-1 fixture depth when briefs **explicitly** demand rich task cards, peer revision, or transcript dialogic conversion — but **does not** fix E factor gaps or add typed cognition schema.

### Evidence

| Probe | vs 28-1 | Live rubric mean | Key |
|-------|---------|------------------|-----|
| P28-01 | Climate fixture **1.2** | **~1.7** | Named scenarios, if-then moves; E still wrong |
| P28-02 | Case 2 **~0.2** (no G) | **~1.5** | Predict → pair revise → reveal (D9 **3**) |
| P28-07 | RNA page **~0.2** | **~1.6** | Four activities; not assessment-only |

**Captures:** `context-files/probe-p28-0*-live.md`, `28-3-probe-capture.json`.

**Method caveat:** Runner validates **pack prompt contracts**, not full PRISM Run UI / Factory wiring.

### Hypothesis adjustments (28-3)

| ID | Verdict |
|----|---------|
| H6 | **Strengthened** (explicit briefs) — programme **Partial** |
| H7 | **Weakened** — live G can encode cognition in prose when forced |
| H8 | **Unchanged** |
| H9 | **Strengthened** (P28-02) |
| H10 | **Unchanged** / **Supported** |
| H11 | **Partial** — rhetoric can deliver when brief explicit; not structural |
| H12 | **Weakened** — live pages include activities; `section_id` drift |

### Cosmetic vs structural

**Outcome B:** Richer prose and phased activities within **existing fields** — not a new internal cognition layer.

### Test floor

`node --test tests/*.test.js` → **311 passed** (28-3 session; docs only).

---

## 2026-05-21 — R28-018 (draft): Representation ceiling evidence (28-3)

**Status:** **Draft**

### Decision

Introduce working hypothesis **H13 (Representation ceiling):** pedagogic language **elaborates stylistically** within the strongest **typed** structures PRISM exposes; outputs **plateau** without ontology extension even when brief wording is rich.

### Evidence

| Ceiling signal | Live probes |
|----------------|-------------|
| Generic `facilitator_moves` despite rich brief | P28-01, P28-07 |
| No `anticipated_responses[]`, reconciliation stages | All three |
| E factors still thin / wrong | P28-01 (`page_profile`, missing link factors) |
| Page compose omits canonical `section_id` | All three (**P28-017**) |
| Assessment MCQ duplication | P28-02 (**P28-018**) |

### Implication

28-4 charter should prioritise **typed cognition factors + schemas + composition parity**, not prompt-only iteration.

### Documentation

Matrix **“Representation ceiling hypothesis”**; quality notes **§12**.

### Test floor

`node --test tests/*.test.js` → **311 passed** (28-3 session; docs only).

---

## 2026-05-21 — R28-019 (draft): Implementation charter drafted (28-4)

**Status:** **Draft**

### Decision

Create [`slice-28-4-charter.md`](slice-28-4-charter.md) — first bounded implementation programme for **typed pedagogic cognition**, structured as themes A–E and slices **28-5a–28-5e**.

### Evidence

28-1–28-3 complete; gaps P28-001–018; H6–H13; live probes; representation ceiling §12.

### Architectural shift

**FROM** assessment-orchestration maturity **TOWARD** cognition factors, activity packs, topology guards, typed G contracts, composition parity.

### Gate

**No implementation** until user approves charter. Sprint 28 investigation **substantially complete**; programme **not closed** until 28-5 delivery + post-implementation validation.

### Test floor

`node --test tests/*.test.js` → **311 passed** (28-4 session; docs only).

---

## 2026-05-21 — R28-020 (draft): Pedagogic cognition programme established (28-4)

**Status:** **Draft**

### Decision

Establish **Pedagogic Cognition Programme** as the next implementation track (28-5a→5e), mirroring Sprint 27 assessment-semantics success pattern.

### Programme elements

| Element | Charter section |
|---------|-----------------|
| Cognition factors + packs | Theme B, 28-5a |
| Topology anti-lean guards | Theme C, 28-5b |
| DLA/GAM typed contracts | Theme D, 28-5c |
| Composition parity | Theme E, 28-5d |
| Rubric/harness automation | 28-5e |
| CPD/transcript strategic bias | §D Commercial |
| Emerging proposition | §K |

### Preserve

Sprint 27 assessment semantics, epistemic grounding, renderer stability, 311+ test floor.

### Test floor

`node --test tests/*.test.js` → **311 passed** (28-4 session; docs only).

---

## 2026-05-21 — R28-021: Typed cognition factors introduced (28-5a)

**Status:** **Accepted** (implementation)

### Decision

Add five boolean **optionalFactors** (runtime-merged for LD `assessment_pack` configs only): `cognitive_engagement_required`, `reasoning_revision_required`, `misconception_reconciliation_required`, `adaptive_scaffolding_required`, `productive_uncertainty_required`.

Conservative **extract** regex in `extractWorkflowBriefExplicitFactors`; factors preserved through `resolveWorkflowBriefFactors`.

### Evidence

P28-015; charter 28-5a; `tests/workflow-ld-cognition-factors-extract.test.js`.

### Test floor

`node --test tests/*.test.js` → **324 passed** (+13).

---

## 2026-05-21 — R28-022: Cognition packs established (28-5a)

**Status:** **Accepted** (implementation)

### Decision

Add four **intentClasses** (LD-only runtime merge): `self_study_cognition_pack`, `peer_instruction_pack`, `misconception_repair_pack`, `transcript_transformation_pack`.

**Orchestration (minimal):** `hasPedagogicCognitionIntent` suppresses lean assessment pruning; heuristic trace logs `activeCognitionPacks`.

**Not done:** topology redesign, GAM/DLA schemas, composition parity (28-5b–5d).

### Code

- `app.js` — `augmentWorkflowBriefConfigPedagogicCognition`, `resolvePedagogicCognitionPackIds`, extract cues
- `tests/workflow-ld-cognition-pack-propagation.test.js`
- [`context-files/28-5a-baseline.md`](context-files/28-5a-baseline.md)

### Test floor

**324 passed**; Sprint 27 assessment extract/topology tests unchanged.

---

## 2026-05-21 — R28-023: Cognition-aware orchestration semantics (28-5b)

**Status:** **Accepted** (implementation)

### Decision

When cognition packs are active, orchestration **preserves learning-process structure** via `resolvePedagogicCognitionOrchestrationSemantics`:

- Stage injection for pack-minimal chains
- `explicitlyRequiredStepSet` protection (`protect:activity_chain`)
- `cognitionAwareAssessmentFlow` → DLA/GAM before GAI (reuses discussion-oriented ordering pass)
- CLS retained for `misconception_repair_pack`
- Lean outcome bypass suppressed when `cognitionTopologyRequired`

### Evidence

P28-016; charter 28-5b; `tests/workflow-ld-cognition-topology.test.js`.

### Test floor

**332 passed** (+8).

---

## 2026-05-21 — R28-024: Bounded topology preservation (28-5b)

**Status:** **Accepted** (implementation)

### Decision

Topology changes are **pack-specific and minimal** — no universal maximal chain. Non-cognition briefs (e.g. retrieval quiz) remain lean.

### Trace

Heuristic log fields: `cognitionTopologyRequired`, `preservedCognitionStages`, `cognitionPruningPrevented`.

### Not done

Composition guards, GAM JSON contracts, renderer — deferred 28-5c+.

### Test floor

**332 passed**; 27-4b assessment topology regressions pass.

---

## 2026-05-21 — R28-025: Typed cognition contracts introduced (28-5c)

**Status:** **Accepted** (implementation)

### Decision

When cognition packs or factor-only cognition intent is active, DLA/GAM prompts receive a **bounded auto-applied contract** listing required typed fields — additive to existing activity schema, not a new ontology.

### Pack → field mapping (DLA JSON per activity; GAM labelled subsections)

| Pack / factor | Fields |
|---------------|--------|
| `peer_instruction_pack` | `reasoning_revision_prompt`, `initial_position_prompt`, `revision_trigger` |
| `misconception_repair_pack` | `misconception_claim`, `reconciliation_prompt`, `evidence_contrast` |
| `transcript_transformation_pack` | `transformation_activity`, `source_to_application_prompt` |
| `self_study_cognition_pack` | `self_explanation_prompt`, `transfer_or_application_task` |
| `adaptive_scaffolding_required` | `scaffold_hint_sequence` (string or short array) |
| `productive_uncertainty_required` | `uncertainty_tension_prompt` |

### API

`resolvePedagogicCognitionContractRequirements`, `applyPedagogicCognitionContractScaffoldToDraft`, `evaluatePedagogicCognitionContractSatisfaction`.

### Evidence

`tests/workflow-ld-cognition-contracts.test.js` (+11).

### Test floor

**343 passed** (+11).

---

## 2026-05-21 — R28-026: Bounded pedagogic generation semantics (28-5c)

**Status:** **Accepted** (implementation)

### Decision

Generation contracts are **prompt- and validation-oriented**, not runtime engines: no learner models, branching dialogue, or adaptive scaffold execution.

### Trace

Heuristic log extends with `cognitionContractRequirements` (DLA field ids), `generatedCognitionFields` (placeholder at design time), `cognitionContractSatisfied` (null until output validation).

### Not done (28-5c)

- Cognition-aware **composition** parity (28-5d)
- Renderer cognition semantics
- Automatic rubric/harness enforcement on every run
- Giant pedagogic schemas or educational-theory formalisation

### Backwards compatibility

Non-cognition briefs unchanged; RNA sparse fixture scaffold unchanged; Sprint 27 assessment semantics preserved.

### Test floor

**343 passed**.

---

## 2026-05-21 — R28-027: Cognition-aware composition parity (28-5d)

**Status:** **Accepted** (implementation)

### Decision

When cognition packs/factors are active, composed pages receive a bounded post-pass: canonical `section_id`, inject missing `learning_activities`, merge typed cognition fields from upstream, dedupe assessment rows from activities, reorder activities before assessment.

### API

`applyPedagogicCognitionSemanticsToComposedPage`, `resolvePedagogicCognitionCompositionSemantics`, `assignComposedPageMutations`.

### Evidence

`tests/workflow-ld-cognition-composition.test.js` (+7); wired through utilities and captured-page validation.

### Test floor

**350 passed** (+7).

---

## 2026-05-21 — R28-028: Bounded cognition preservation in page composition (28-5d)

**Status:** **Accepted** (implementation)

### Decision

Composition preservation is **policy + ordering**, not renderer/UI reinvention. Trace lives in `generation_notes.cognition_composition` and `metadata.cognition_profile`.

### Not done

Renderer redesign, adaptive tutoring UI, learner-state engine, dynamic branching layouts, visual pedagogy framework, 28-5e harness automation.

### Backwards compatibility

Lean/non-cognition pages unchanged; Sprint 27 `applyAssessmentSemanticsToComposedPage` composable (cognition first, assessment semantics second).

### Test floor

**350 passed**.

---

## 2026-05-21 — R28-029: Post-implementation live validation (stabilisation)

**Status:** **Accepted** (verification)

### Decision

Re-ran **P28-01, P28-02, P28-07** with **unchanged briefs** using current architecture: cognition packs in E/O, contract scaffold on DLA, composition post-pass on page.

### Evidence

| Probe | DLA contract | Page parity |
|-------|--------------|-------------|
| P28-01 | satisfied | `learning_activities` before `assessment_check` |
| P28-02 | satisfied | canonical section_ids; peer fields present |
| P28-07 | satisfied | transcript transformation fields; activities preserved |

Artefacts: `context-files/probe-p28-*-post-5d.md`, `28-5d-stabilisation-capture.json`.

### Note

G-layer quality still **model-dependent**; C-layer parity is **deterministic** when upstream activities exist.

---

## 2026-05-21 — R28-030: Sprint 28 stabilisation and closure

**Status:** **Accepted** — programme **closed**

### Decision

Sprint 28 **implementation complete** through **28-5d**. **28-5e deferred.** Formal closure summary: [`sprint-28-closure.md`](sprint-28-closure.md).

### Hypothesis programme status (H6–H13)

See matrix update — H10/H8 **Supported**; H6/H7/H9/H11/H12/H13 **Partial** with **Stabilised** composition/orchestration for cognition workflows.

### Confirmations

No workflow explosion; no renderer redesign; no ontology bloat; lean paths intact; **350** tests; Sprint 27 semantics preserved.

### Recommendation

**Close Sprint 28.** Next: new theme (renderer/illustration) or optional **28-5e** harness — not further cognition packs without new charter.

---

## Decision template (use during investigation)

```markdown
### R28-0XX — [title]

**Date:** YYYY-MM-DD  
**Status:** Accepted | Superseded | Deferred  

**Context:** …  
**Decision:** …  
**Evidence:** matrix row / probe ID / fixture path  
**Implications:** 28-4 slice only | out of scope  
```

---

## Investigation exit (record when complete)

| Criterion | R28 ID | Done |
|-----------|--------|------|
| Climate row complete | R28-009 | [x] |
| ≥2 probes rubric-scored | R28-009 / R28-017 | [x] |
| H1–H13 adjudicated | R28-010–R28-018 | [x] |
| Gap list P28-001–018 prioritised | R28-016 / R28-019 | [x] |
| Live probes complete | R28-017 | [x] |
| Representation ceiling documented | R28-018 | [x] |
| 28-4 charter **drafted** | R28-019 | [x] |
| Cognition programme **defined** | R28-020 | [x] |
| 28-4 charter **user-approved** | R28-019 | [ ] |
| 28-5 implementation + post-probe validation | R28-029 | [x] |
| Sprint 28 programme closure | R28-030 | [x] |

**Note:** Sprint 28 **closed** 2026-05-21. See [`sprint-28-closure.md`](sprint-28-closure.md).
