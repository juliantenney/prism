# Activity materials quality notes — Sprint 28

**Purpose:** Define **pedagogic richness** and **cognitive engagement** rubric dimensions, scoring guidance, and elicitation/generation gap hypotheses.

**Status:** Rubric **Cases 1–5** (28-1). **28-2–28-3 complete** (2026-05-21). **28-4 charter drafted** — [`slice-28-4-charter.md`](slice-28-4-charter.md); §12 representation ceiling.

**Related:** [`pedagogic-richness-evidence-matrix.md`](pedagogic-richness-evidence-matrix.md), LD pack prompts for DLA / GAM steps.

---

## 0. Investigation premise (reframing)

PRISM should increasingly **augment pedagogy** for subject experts who are not expert learning designers — especially in **self-study** and **learner-facing** outputs where **no tutor** can repair thin materials.

| Layer | What Sprint 26–27 largely secured | What Sprint 28 probes |
|-------|-----------------------------------|------------------------|
| Orchestration | Topology, assessment semantics, typed page bind | — |
| Materials intelligence | — | Cognition-in-artefact: scaffolding, repair, progression |

**H7 (working):** Instructional **artefacts** are modelled more strongly than **learner cognition**.

---

## 0a. Pedagogic compensation problem (28-1b)

**Observation:** Facilitator-led workshops can remain **delivery-viable** when generated materials are thin on **adaptive scaffolding (D6)** and **learner-model awareness (D7)** — a skilled tutor supplies contingent moves, pacing, and misconception repair in the room.

**Self-study and learner-facing pages** have **no expert recovery layer**. The learner experiences the **pedagogic architecture encoded in artefacts directly**. Therefore:

| Mode | Test stringency | What fails first when cognition is thin |
|------|-----------------|----------------------------------------|
| Tutor-led seminar (e.g. climate fixture) | Moderate | Tutor compensates; gaps visible on audit (D6/D7 = 0) but session may still “work” |
| Self-study retrieval page | **High** | Lean topology (GAI-forward); MCQ + end reveal; **activities chain often pruned** |
| Assessment-only self-study page (e.g. RNA/HCV fixture) | **High** | Formatting + items; **no** activity materials section despite briefs asking for activities |

**Investigation implication:** Self-study probes are the **more stringent** test of whether PRISM achieves **pedagogically intelligent** output — not merely **instructional formatting**.

**Evidence anchors (28-1b):** Observation harness `retrieval-quiz` topology; `ld-rna-hcv-assessment-page.json`; climate Case 1 rubric; read-only E/O for transcript/RNA sparse briefs.

---

## 1. Richness vs structure vs cognitive engagement

| Concept | Structural correctness | Pedagogic richness | Cognitive engagement (28 framing) |
|---------|------------------------|-------------------|-------------------------------------|
| Task card | Has title, steps, expected_output fields | Scenario stakes, misconception hooks | Learner path through confusion → evidence → repair |
| Discussion prompt | Present in `discussion_prompts[]` | Dialogic exchange | Sustained **productive uncertainty** + self-explanation |
| Facilitator note | Section exists | Contingent moves | **Adaptive scaffolding logic** (if-then pedagogy) |
| Sequencing | Steps ordered in workflow | Phase progression in materials | **Cognitive progression** inside blocks |
| Page export | Renders typed blocks | Content fidelity | Engagement preserved in solo study |

Sprint 28 investigates the **middle and right columns**. Sprint 26–27 largely secured the **left**.

---

## 2. Quality dimensions (rubric axes)

Score each dimension **0–3** per artefact (activity_materials block, or composed section).

| Score | Meaning |
|-------|---------|
| **0** | Absent or generic placeholder |
| **1** | Present but superficial / template-like |
| **2** | Adequate for delivery; some authenticity or tension |
| **3** | Strong dialogic design; specific, contingent, progressive; **cognitively engaging** for solo or facilitated study |

### Rubric dimension interpretation (additive — IDs unchanged)

| ID | Legacy label | **28 cognitive engagement read** |
|----|--------------|----------------------------------|
| D3 | Productive uncertainty | **Sustained cognitive engagement** — bounded ambiguity that keeps learners reasoning, not only “discuss” |
| D6 | Facilitator contingent moves | **Adaptive scaffolding logic** — if-then pedagogical branches (facilitator or **embedded** in self-study prompts) |
| D7 | Anticipated learner responses | **Learner-model awareness** — explicit partial understandings, errors, escalation |
| D9 | Peer discussion structure | **Reasoning revision cycle** — predict → exchange → revise tied to evidence |
| D4 | Dialogic prompt quality | Peer/seminar **dialogic** quality + **self-explanation** prompts where solo |
| D5 | Misconception confrontation | **Misconception repair** architecture in materials |

### D1 — Authentic scenario design (H2)

- **0:** Abstract topic label only (“discuss climate change”)  
- **3:** Named context, roles, constraints, plausible data/conflict hooks  

### D2 — Task-card specificity (H2)

- **0:** Procedural checklist without scenario anchor  
- **3:** Card embeds scenario + clear deliverable + time/role cues  

### D3 — Productive uncertainty / ambiguity (H4)

- **0:** Closed recall or vague “discuss”  
- **3:** Bounded uncertainty — conflicting evidence, interpretive gap, no single obvious answer  

**28 read:** **Sustained cognitive engagement** — uncertainty that drives ongoing reasoning in **self-study**, not only seminar discussion.

### D4 — Dialogic prompt quality (H4)

- **0:** Monologic instruction  
- **3:** Elicits peer exchange, revoicing, comparison, or argumentation  

### D5 — Misconception confrontation (climate case)

- **0:** Correct facts only  
- **3:** Named false claims, why tempting, evidence contrast, reconciliation path  

### D6 — Facilitator contingent moves (H3)

- **0:** Generic timing (“allow 10 minutes”)  
- **3:** “If learners say X → prompt Y”; silence handling; grouping variants  

**28 read:** **Adaptive scaffolding logic** — equally critical when embedded as **learner-facing** “If your answer was X, consider Y” branches (not only tutor scripts).

### D7 — Anticipated learner responses (H3)

- **0:** Not stated  
- **3:** Partial understandings, common errors, escalation paths  

**28 read:** **Learner-model awareness** — explicit modelling of how understanding typically unfolds and fails.

### D8 — Progressive cognitive sequencing (H6)

- **0:** Flat list of activities  
- **3:** Clear activate → confront → reconcile → apply (or equivalent) across materials  

### D9 — Peer discussion structure (peer case)

- **0:** “Discuss in pairs” only  
- **3:** Prediction, pair exchange, revision, reflection tied to evidence  

**28 read:** **Reasoning revision cycle** — applicable to peer instruction and to **solo** “attempt → reflect → revise” self-study paths.

### D10 — Activity vs assessment balance (H5)

- **0:** Activities far thinner than assessment items on same brief  
- **3:** Activities at least as pedagogically specific as assessment for workshop intents  

**Aggregate:** Report per-case mean and weakest dimension (drives gap priority).

---

## 3. Pedagogic ontology audit (28-2)

**Method:** Read-only review of `domains/learning-design/domain-learning-design-step-patterns.md` (`workflowBriefConfig`, step prompts), `app.js` (`extractWorkflowBriefExplicitFactors`, `applyWorkflowDesignHeuristics`, `augmentWorkflowBriefConfigAssessmentSemantics`), Sprint 28-1 matrix evidence. **No pack/code edits.**

### 3.1 Representation class key

| Class | Meaning |
|-------|---------|
| **A** | **Explicit first-class factor** — `workflowBriefConfig` / runtime-merged optional factor with typed id, extract regex, resolve defaults |
| **B** | **Derived heuristic** — inferred from brief prose or orchestration gates (`leanAssessmentItemIntent`, step order, `activities_required` cue) |
| **C** | **Optional prose pattern** — mentioned in prompt instructions; **not** a required typed field in output schema |
| **D** | **Absent** — no factor, heuristic, or required schema field |

### 3.2 Ontology audit table

#### A — Strongly represented (assessment & delivery orchestration)

| Concept | Representation | Where it lives |
|---------|----------------|----------------|
| `assessment_required` | **A** | Extract + optional factor |
| `assessment_total_items` | **A** | Extract (count regex) + refinement |
| `assessment_type` / item formats | **A** | `assessment_pack` intent + refinement |
| `feedback_timing` | **A** | Runtime-merged optional factor + extract (`tutor_led`, `after_peer`, `immediate_self_check`) |
| `learner_answer_visibility` | **A** | Merged factor + extract (negation-safe hide-answer) |
| `assessment_interaction_mode` | **A** | Merged factor + extract (`retrieval_practice`, `discussion_oriented`, `diagnostic_misconception`) |
| `peer_instruction_phase` | **A** (partial) | Merged factor + extract (`think_pair_share`, `small_group_discussion_then_check`); harness can leave **`none`** while brief says peer instruction |
| `misconception_assessment_link` | **A** (partial) | Boolean factor + extract on misconception workshop cues |
| `design_feedback_required` | **A** | Merged boolean; topology includes Design Feedback when true |
| `provided_source_content` / `input_strategy` | **A** | `startingArtefact` + extract; epistemic tests |
| `activities_required` | **B→A** | Extract activity cues (`task cards`, `learning activities`, peer phases) |
| `materials_required` | **B** | Heuristic from page/activity delivery cues |
| `page_profile` | **A** | Extract from desired outputs / MCQ wording |
| `include_answers` | **A** | Extract with negation guards |
| Delivery scope | **A** | `design_scope`, `delivery_pattern`, `delivery_context`, `duration_minutes` |

**Sprint 27 outcome:** Assessment semantics are **typed end-to-end** (E → presentation mapping → `applyAssessmentSemanticsToComposedPage`).

#### B — Structurally represented, cognitively weak

| Concept | Representation | Evidence |
|---------|----------------|----------|
| Workflow **step order** | **B** | DLA → GAM → GAI → CLS → Design Page when gates pass; **pruned** when `leanAssessmentItemIntent` (28-1 Case 4/5A) |
| `learning_sequence` / timeline | **B + C** | CLS JSON (`phase_type`, `facilitator_actions`, `learner_actions`) — **scheduling**, not misconception repair or revision cycles |
| `grouping` (pair / small_group) | **B** | DLA activity field + inflation fixtures — **format**, not dialogic quality |
| `facilitator_moves` | **C** (label) | **Required field name** in DLA JSON list; **no** schema for if-then branches, anticipated errors |
| `discussion_prompts` / `task_cards` | **C** | GAM material types; climate fixture = claim bullets |
| `reflection` prompts | **C** | Brief prose → sometimes `support_notes`; not a factor |
| `difficulty_level` / Bloom-ish tags | **C** | GAI `difficulty_level` per item; assessment refinement `cognitive_demand` — **item tagging**, not activity-phase cognition |
| `progressive_scaffold` sequencing style | **C** | CLS user option only; not elicited from brief |
| Misconception in **assessment** stems | **C** | GAI prompt when `diagnostic_misconception` / `misconception_assessment_link` — **items**, not repair arc in activities |

#### C — Weak or absent (cognitive engagement — 28-1 rubric targets)

| Concept | Class | Extraction | Orchestration | Prompt contract | Composed page |
|---------|-------|------------|---------------|-----------------|---------------|
| Misconception **reconciliation** | **D** | **not evidenced** | — | GAI “misconception-aware distractors”; no reconcile stage | Climate: claims, no repair path |
| Adaptive **scaffolding** logic | **D** | **not evidenced** | — | DLA requires `facilitator_moves` **string**; no if-then schema | D6 = 0 all cases |
| **Learner-model** awareness | **D** | **not evidenced** | — | No `anticipated_responses` in DLA/GAM keys | D7 = 0–1 generic tips |
| **Reasoning revision** cycle | **D/E partial** | `peer_instruction_phase`, `feedback_timing` only | Order DLA→GAI | GAI peer framing | No predict/discuss/revise **sections** (Case 2) |
| **Conceptual conflict** | **D** | — | — | CLS “increasing complexity” prose | **not evidenced** |
| **Productive uncertainty** | **D** | — | — | DLA “progress understanding→evaluation” prose | **not evidenced** as sustained tension |
| **Scaffold fading** | **D** | — | — | **not evidenced** | **not evidenced** |
| **Self-explanation** architecture | **D** | — | — | **not evidenced** required fields | **not evidenced** |
| **Cognitive progression** phases (activate→confront→reconcile) | **D** | — | CLS `phase_type` untyped | **not evidenced** mandatory phase ontology | Single activity blocks |
| **Epistemic comparison** / alt explanations | **D** | — | — | GAI “compare ideas” when `discussion_oriented` | **not evidenced** in materials |
| **Uncertainty management** | **D** | — | — | **not evidenced** | **not evidenced** |
| **Conceptual change** pathways | **D** | — | — | **not evidenced** | **not evidenced** |
| `dialogic_mode` | **D** | — | — | **not evidenced** | — |
| `scenario_authenticity` | **D** | Topic/subject extract only | — | GAM “scenario” material type | Weak scenarios (H2) |

### 3.3 Where pedagogic richness “lives” (28-2 synthesis)

| Layer | Assessment cognition | Activity / dialogic cognition |
|-------|---------------------|------------------------------|
| **E** | **Strong** — typed factors + regex | **Weak** — `activities_required`, topic, delivery; peer/misconception **partial** |
| **O** | **Strong** — order, Design Feedback, visibility mapping | **Structural** — chain present or **pruned**; no cognitive-phase topology |
| **G (prompts)** | **Constrained JSON** — `items[]`, types, answer_key, semantics hooks | **Permissive prose** — DLA lists fields; GAM **text** output, no richness schema |
| **C** | **High fidelity** — `assessment_check` object, items preserved | **Variable** — can preserve materials; **often** assessment-forward (RNA) |
| **R** | **Policy-stable** — hide/reveal answers | Fidelity to fixture; does not add cognition |

**Attractor (28-1 + 28-2):** `intentClasses.assessment_pack` + `preferLeanAssessmentFlow` + `leanAssessmentItemIntent` (`app.js` ~10720) steer ambiguous briefs toward **GAI → Design Page** without activity chain — assessment as **default completion shape**.

---

## 4. Prompt / schema asymmetry (28-2 findings)

| Question | Finding (evidence) |
|----------|-------------------|
| Are assessment semantics more explicit than activity cognition? | **Yes.** GAI: JSON contract + Sprint 27 semantic factors propagated into prompt. DLA: JSON activities array but **no** cognition sub-schema. GAM: **`preferredOutputFormat: text`** — weak structural validation. |
| Are activity prompts permissive vs contractually rich? | **Yes (H11).** DLA **requires field names** (`facilitator_moves`, `failure_mode`) but not contingent structure, anticipated responses, or revision phases. GAM forbids redesign but does not require misconception repair blocks. |
| Are cognitive progression stages required? | **No (D).** CLS asks for `phase_type` per timeline block but **no** enumerated activate/confront/reconcile ontology; `sequencing_style` is a step option, not a brief factor. |
| Are learner-response structures typed? | **No (D)** for activities. GAI has `explanation_or_rationale`, distractor guidance — **assessment-only**. |
| Does Design Page privilege assessment composition? | **Partial (H12).** Prompt mandates rich `learning_activities` when upstream exists, but `page_profile: assessment` + lean paths + fixtures show **assessment_check** survival when activities omitted upstream. Assessment items: “include **all** provided items”; activities: omissions allowed via `generation_notes.activities_omitted[]` — **asymmetric strictness**. |

**Intent class asymmetry:** Only **`assessment_pack`** intent class in `workflowBriefConfig` (`preferLeanAssessmentFlow`, must-ask type/count). **No** `activity_cognition_pack` or `dialogic_workshop_pack` equivalent.

---

## 5. Layer responsibility map (working)

| Symptom | Likely layer | Investigation action |
|---------|--------------|----------------------|
| Brief asks for rich cards; topology drops GAM | O | Trace `activities_required`, lean pruning |
| Topology correct; JSON shallow | G | Prompt + model behaviour |
| Rich JSON; page is generic prose | C | Design Page composition rules |
| Rich page; export loses tension | R | Renderer normalisation (usually secondary) |
| No brief signal for dialogic mode | E | Factor gap (28-2) |

---

## 6. Gap list template (P1–Pn)

Populate after rubric scoring:

| ID | Layer | Description | Evidence | Priority |
|----|-------|-------------|----------|----------|
| P28-001 | G | Task cards are claim bullets, not authentic scenarios | Climate fixture `task_cards` | High |
| P28-002 | G | No contingent `facilitator_moves`; facilitator notes not in page | Climate fixture | High |
| P28-003 | E | No dialogic richness factors in brief config / extract | 28-1 extract audit | High |
| P28-004 | G | Discussion prompts analytic; limited tension | Climate fixture prompts | Medium |
| P28-005 | G/C | Formative check 2 items in fixture vs 5 in brief | Climate fixture assessment section | Medium |
| P28-006 | O/G | Single activity block vs multi-phase seminar | Climate fixture | Medium |
| P28-009 | O | Self-study retrieval path prunes DLA/GAM/CLS | `retrieval-quiz` E/O | High |
| P28-010 | G/C | Self-study pages assessment-forward; activities absent on page | `ld-rna-hcv-assessment-page.json` | High |
| P28-011 | G | Reflection / study guidance generic (mechanical loop) | RNA `support_notes` | Medium |
| P28-012 | G | Misconception repair lacks reconciliation in solo materials | 28-1b comparison | Medium |
| P28-013 | E/G | Peer revision cycle in brief; phased reasoning **not** in artefacts | Case 2 | High |
| P28-014 | O | Transcript harness drops GAI despite assessment_required | Case 3 harness | High |
| P28-015 | E | No first-class cognitive-engagement factors in brief config | §3.2 class **D** concepts | **High** |
| P28-016 | O/E | `assessment_pack` lean attractor vs activity chain | `leanAssessmentItemIntent`, Case 4 | **High** |
| P28-017 | C | Live Design Page outputs omit canonical `section_id` on sections | 28-3 live pages | **Medium** |
| P28-018 | C/G | Peer page duplicates/alternates MCQ sets (activity vs page items) | P28-02 live | **Medium** |

Copy confirmed gaps to [`pedagogic-richness-evidence-matrix.md`](pedagogic-richness-evidence-matrix.md).

---

## 10. Representational diagnosis (28-2)

Sprint 28-1 showed **outputs** are pedagogically shallow. Sprint 28-2 shows **why** that is structurally likely:

### Instructional orchestration vs pedagogic cognition modelling

| Model lane | What PRISM represents internally | What briefs often ask for |
|------------|----------------------------------|---------------------------|
| **Orchestration** | Steps, factors, assessment visibility, source strategy | Quizzes, handouts, timing, hide answers |
| **Cognition** | Mostly **prompt prose** and optional material shapes | Revision cycles, scaffolding, misconception repair, progression |

The system has invested in a **delivery and assessment contract** (Sprint 27). It has **not** invested in a parallel **learning-process contract** for activities.

### Stable attractor toward assessment formatting

When briefs are ambiguous (“formative assessment”, “revision page”, “MCQ check”):

1. **`assessment_pack`** detection fires (`assessment`, `quiz`, `mcq` in goal).
2. **`leanAssessmentItemIntent`** can drop DLA/GAM/CLS (`app.js` heuristic).
3. **`page_profile: assessment`** extract bias labels output as assessment shell.
4. Design Page **preserves all assessment items**; activities may be omitted if upstream missing.

Result (28-1): **mechanically correct** quizzes with **weak** activity cognition — not primarily a “bad prompt sentence” failure.

### Representation gaps vs generation-quality gaps

| Symptom | Often misattributed to | 28-2 diagnosis |
|---------|------------------------|----------------|
| Thin task cards | “Model didn’t try” | **No schema** for scenario stakes, repair path, anticipated responses |
| Missing facilitator moves | “Prompt too short” | Field **required** but **untyped**; fixture still empty |
| Peer revision missing | “Need better instructions” | Only **assessment timing** factors; no **phase** objects in activities or page |
| RNA page assessment-only | “Composition bug” | Upstream activities **not evidenced** + C allows assessment-only survival |

**Implication:** Rich pedagogy cannot emerge **reliably** from weak internal representations — models satisfy **explicit** contracts (items, visibility, step order) and treat cognition as **optional prose**.

### Relation to H10–H12

See matrix hypothesis table. **H10–H12** formalise this asymmetry for 28-4 charter work.

### Post-implementation stabilisation (28-5d, 2026-05-21)

Live re-runs **P28-01/02/07** with Sprint 28 runtime show **typed DLA cognition fields satisfied** and **canonical page sections** with `learning_activities` before `assessment_check`. Rubric means may still vary by model; **structural** E→O→G→C preservation is the validated gain. See [`sprint-28-closure.md`](sprint-28-closure.md) and `context-files/probe-p28-*-post-5d.md`.

---

## 11. Emerging architectural diagnosis (28-2)

Evidence-backed shift in programme framing:

| Prior framing | Updated framing (28-2) |
|---------------|------------------------|
| “Improve dialogic prompts” | **Extend the pedagogic ontology** — factors + typed activity schemas + composition parity |
| “Generate richer task cards” | **Require cognitive fields** in DLA/GAM JSON, not only in prompt adjectives |
| “Fix Design Page flattening” | **Fix upstream absence + asymmetric omission rules** — C often faithful to thin upstream |
| “Self-study needs better copy” | **Self-study needs embedded scaffolding types** — no tutor to supply D6/D7 |

**One-sentence diagnosis:** PRISM systematically produces **pedagogically shallow learning artefacts** because **assessment and orchestration are first-class**, while **learner cognition is rhetorical in prompts** — not because workflow topology is broadly broken.

**28-4 direction:** Implemented as [`slice-28-4-charter.md`](slice-28-4-charter.md) — cognition factors, activity packs, 28-5a–5e slices.

---

## 12. Representation ceiling hypothesis (28-3)

**Question:** Can explicit pedagogic wording overcome weak internal cognition representations, or do live outputs converge to assessment-forward shells?

**Method:** Live probes **P28-01**, **P28-02**, **P28-07** via pack prompt contracts + OpenAI step chain (`context-files/28-3-probe-runner.js`). **Not** full PRISM Run UI.

### Verdict (evidence-backed, not overstated)

| Mode | Behaviour | Rubric mean (investigator) |
|------|-----------|----------------------------|
| **Sparse / fixture briefs** (28-1) | Assessment-forward or thin activities; D6/D7 often **0** | **~0.2–1.2** |
| **Explicit rich briefs** (28-3 live) | Phased activities, if-then `facilitator_moves`, dialogic tasks within **same JSON fields** | **~1.5–1.7** |
| **E layer** | Still misses factors (`misconception_assessment_link`, wrong `page_profile` on climate live) | — |

**Answer:** **Partial B** — wording raises **stylistic and phase structure** inside existing types; it does **not** introduce typed reconciliation, learner-model branches, or factor-gated cognition. **Not** “prompt quality alone fixes the programme.”

### Ceiling signals (live)

| Signal | P28-01 | P28-02 | P28-07 |
|--------|--------|--------|--------|
| `facilitator_moves` present but generic | Yes (if-then improved vs fixture) | Partial | Yes |
| Reflection without cognitive consequence | Some prompts | Post-reveal reflect | Misconception prompts |
| Discussion without epistemic tension | Moderate | Pair revise strong | Moderate |
| Reasoning-cycle labels without typed revision | N/A | **D9=3** in prose chain | N/A |
| Richer prose, same schema | Yes | Yes | Yes |
| `section_id` canonical on page | **Missing** | **Missing** | **Missing** |

### Cognitive engagement checklist (28-3)

| Dimension | Live evidence |
|-----------|---------------|
| **A. True reasoning revision** | **P28-02:** predict → pair revise → reveal (**strengthened**); **P28-01/07:** discussion + misconception confrontation, **no typed reconciliation pathway** |
| **B. Adaptive scaffolding** | If-then moves on P28-01; **no** staged hint ladder or misconception-targeted repair types |
| **C. Cognitive progression** | Phased activities on all three; **no** scaffold-fading types; uncertainty partial (D3) |
| **D. Pedagogic transformation** | **P28-07:** four activities + formative vs RNA assessment-only fixture (**transformation**, not extraction-only) |

### Hypothesis H13 (draft)

**Representation ceiling:** LLMs elaborate pedagogic language within the **strongest typed structures PRISM exposes** (assessment items, activity JSON strings, page sections). Ceiling **rises** when briefs are explicit; **plateaus** without ontology extension.

**Programme implication:** 28-4 should target **typed cognition slots + factors**, not prompt adjectives alone.

**Gaps:** **P28-017** (non-canonical page `section_id` on live compose), **P28-018** (duplicate/alternate MCQ sets peer page).

---

## 9. Peer instruction & transcript transformation (28-1c)

| Pattern | Evidence | Implication |
|---------|----------|-------------|
| Brief says “revise answers” | Case 2 harness + P27-03 | Linguistic intent ≠ **D9** in materials |
| `think_pair_share` vs `peer_instruction_phase: none` | P27-03 test vs harness log | Inconsistent phase elicitation |
| `feedback_timing: after_peer_discussion` | Harness peer | **Assessment** timing captured; **activity** phases not |
| Transcript → activities brief | RNA sparse topology test | O can include DLA → GAM → GAI |
| Transcript harness topology | Observation log | **GAI missing** — assessment intent not orchestrated |
| RNA composed page | `ld-rna-hcv-assessment-page.json` | Source grounding in E; **pedagogic transformation** not in C |
| P27-04 climate analogue | Climate fixture | Transcript **can** yield `learning_activities` when brief demands workshop shape |

**Conclusion:** Reasoning revision and transcript transformation remain **instructional-formatting** problems at **C** even when **O** passes.

---

## 7. Formatting vs cognitive engagement (28-1b)

| Signal | Evidence | Cognition gap |
|--------|----------|---------------|
| Typed sections render | Climate + inflation render tests | Structure without scaffolding branches |
| MCQ stems + options | `ld-rna-hcv-assessment-page.json` | Retrieval, not sustained uncertainty |
| `page_profile: assessment` on revision brief | `retrieval-quiz` extract | Pack labels **assessment**, not learning journey |
| Lean topology | NC → GLC → MK → GAI → DP (no DLA/GAM) | Items over activity cognition |
| Generic study bullets | RNA fixture `support_notes` | Not learner-model-aware branches |

**Working conclusion:** Stronger at **instructional formatting** than **cognitive engagement design** (supports **H7**).

---

## 8. Non-goals (quality programme)

- Equating word count with richness  
- Mandating live API runs for every matrix cell  
- Re-opening Sprint 27 answer-visibility contracts  
- CSS/layout improvements as substitute for generative depth
