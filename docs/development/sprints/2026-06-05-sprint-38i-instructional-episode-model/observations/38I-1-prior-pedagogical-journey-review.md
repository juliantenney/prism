# Slice 38I-1 — Prior pedagogical journey review (Sprints 28–31)

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Pedagogical archaeology and synthesis — no pack, code, schema, or episode-model definition  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38I-1  
**Successor:** 38I-2 Instructional Episode Model (not started)

**Sources reviewed:**

| Sprint | Pack | Primary artefacts |
|--------|------|-------------------|
| **28** | [2026-05-21-sprint-28-pedagogic-richness-dialogic-learning](../../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/) | Charter, evidence matrix, quality notes, 28-4 implementation charter, closure |
| **29** | [2026-05-21-sprint-29-renderer-cognition-semantics](../../2026-05-21-sprint-29-renderer-cognition-semantics/) | Charter, renderer semantics notes, closure |
| **30** | [2026-05-21-sprint-30-pedagogic-enrichment-layer](../../2026-05-21-sprint-30-pedagogic-enrichment-layer/) | Charter, PEC slices, retrospective |
| **31** | [2026-06-01-sprint-31-page-rhetoric-renderer-experience](../../2026-06-01-sprint-31-page-rhetoric-renderer-experience/) | Index, retrospective, slice charters |
| **Bridge** | [38C-1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md), [38G-2 §9](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md) | Workbook function rubric; ACM ↔ 28–31 alignment |

---

## 1. Executive summary

Sprints **28–31** pursued a coherent question that predates the **38C–38H** workbook-contract and fidelity arc:

> Can learner-facing materials encode **how cognition should unfold** — not only **which instructional artefacts exist** — especially when **no tutor** can recover thin output?

The programme answered this in **layers**:

| Era | Primary contribution | Dominant concern |
|-----|---------------------|------------------|
| **Sprint 28** | **Cognitive engagement architecture** — rubric, ontology gap diagnosis, typed cognition factors/packs, activity contracts | **Instructional episode richness** inside materials |
| **Sprint 29** | **Cognition visibility** on the renderer — semantic blocks for row-level fields | **Legibility** of richness already in JSON |
| **Sprint 30** | **Pedagogic Enrichment Layer (PEL)** — `orientation_contract`, `reasoning_contract` for self-directed pages | **Learner orientation + disciplinary reasoning** at generation |
| **Sprint 31** | **Page rhetoric** — cue hierarchy, density, dedupe, assessment polish | **Visible pedagogy** — calm, scannable presentation |

By **38G**, the programme re-centred on **workbook material types and ACM components** (orientation, worked reasoning, verification, etc.). That consolidation **preserved** many 28–31 ideas but **flattened** others — especially **phased progression**, **if-then scaffolding**, **anticipated learner responses**, and **revision cycles** as first-class episode structures.

**38I-1 finding:** The programme already valued a **full instructional episode** (orient → activate → teach/model → practice → verify → reflect → transfer) for self-study. What remains undefined for 38I-2 is not *whether* those functions matter, but **how they bundle by cognitive demand** and **how explicitly** each must appear in a single activity vs across a session arc.

---

## 2. Programme arc (28 → 31)

```text
Sprint 28  "Can materials model learner cognition?"
    → typed cognition factors, packs, DLA/GAM contracts, D1–D10 rubric
Sprint 29  "Can learners SEE cognition on the page?"
    → util-cognition* renderer semantics (row-level fields)
Sprint 30  "Can self-study pages orient and reason like a course?"
    → PEL: orientation_contract + reasoning_contract
Sprint 31  "Can rendered pages feel professionally authored?"
    → R-layer hierarchy, pacing, dedupe (no new pedagogy)
         ↓
Sprints 32–37+  visual/diagram/session framing (out of 38I-1 scope)
         ↓
Sprints 38C–38H  workbook genre, contracts, ACM, realisation fidelity
```

**Strategic through-line (28 charter):** **Self-study / learner-facing resources** are the **stringent** test case; tutor-led seminars are **stress-tests** that make scaffolding gaps visible before they harm solo learners.

**Architectural through-line:** Pedagogy remains **authoritative upstream** (E/O/G/C); renderer **expresses** rather than **invents** (29, 30, 31 discipline).

---

## 3. Sprint-by-sprint recovery

### 3.1 Sprint 28 — Pedagogic richness & cognitive engagement architecture

**Core belief:** Structural orchestration (topology, sequencing, assessment semantics) was **stronger** than **learner cognition modelling** inside activities and materials (**H7 Supported**).

**Recurring instructional functions (explicit in charter, rubric, probes):**

| Function | Sprint 28 expression |
|----------|---------------------|
| **Orientation** | Session framing; activity purpose within arc |
| **Activation** | Prior knowledge; “activate → confront” progression (**D8**) |
| **Framing** | Authentic scenario design (**D1**); stakes and roles |
| **Misconception handling** | Named false claims, evidence contrast, reconciliation path (**D5**) |
| **Reasoning support** | Self-explanation (**D4**); productive uncertainty (**D3**) |
| **Worked thinking** | Task-card specificity with deliverables (**D2**) |
| **Guided inquiry** | Dialogic prompts; peer exchange structure (**D4, D9**) |
| **Reflection** | Reflection-before-answers; post-activity consolidation |
| **Revision** | Predict → discuss → revise cycle (**D9**; P28-02 peer probe) |
| **Transfer** | `transfer_or_application_task`; apply phase in progression |

**Key journey pattern (28-4 charter):** `activate → confront → reconcile → apply` as **`cognitive_progression_phase`** — not only workflow step order.

**Learner support patterns:**

- **Adaptive scaffolding logic** — if-then moves (“If learners say X → prompt Y”) for facilitator **or** embedded self-study branches (**D6**)
- **Learner-model awareness** — anticipated partial understandings and error trajectories (**D7**)
- **Scaffold fading** — hint ladders that narrow over the session
- **Reasoning revision cycle** — initial position → exchange → revision → (optional) reveal

**Self-study insight (28-1b compensation problem):** Tutor-led delivery can **mask** thin materials; solo learners experience **only what artefacts encode**.

**Implementation legacy (28-5a–5d):** Five cognition factors, four packs (`misconception_repair_pack`, `peer_instruction_pack`, `transcript_transformation_pack`, `self_study_cognition_pack`), typed DLA/GAM contract fields, composition parity (`applyPedagogicCognitionSemanticsToComposedPage`).

**What 28 primarily addressed:** **Instructional support** + **cognitive process** + **activity structure** — with **learner orientation** as a prerequisite for self-study credibility.

---

### 3.2 Sprint 29 — Renderer cognition semantics

**Core belief:** Cognition fields on composed `page` JSON were **flattened** into undifferentiated prose inside generic activity cards — learners could not distinguish revision, repair, uncertainty, or transformation prompts.

**Contribution:** Bounded **R-layer** semantics — `util-cognition--revision`, `--repair`, `--uncertainty`, `--transformation` for **top-level activity-row fields** already present post–28-5d.

**Instructional functions affected (visibility only):**

| Field family | Pedagogical role |
|--------------|------------------|
| `initial_position_prompt`, `reasoning_revision_prompt`, `revision_trigger` | **Revision** cycle visibility |
| `misconception_claim`, `reconciliation_prompt`, `evidence_contrast` | **Misconception handling** |
| `uncertainty_tension_prompt` | **Framing** / productive uncertainty |
| `self_explanation_prompt` | **Reflection** / reasoning support |
| `scaffold_hint_sequence` | **Guided inquiry** / fading |
| `transfer_or_application_task` | **Transfer** |

**Residual limitation (by design):** Cognition **embedded inside `task_cards` markdown** stayed generic — data placement is composition, not renderer.

**What 29 primarily addressed:** **Visible pedagogy** — semantic legibility of episode richness already authored upstream. **Not** episode design itself.

---

### 3.3 Sprint 30 — Pedagogic Enrichment Layer (PEL)

**Core belief:** Self-directed higher-education study needs **notebook-and-pencil intellectual work** — structured tasks with **orientation** and **disciplinary reasoning**, not conversational tutoring.

**Shipped PECs:**

| PEC | Instructional functions |
|-----|-------------------------|
| **`orientation_contract`** | **Orientation**, **framing**, **transition** — `activity_preamble` (required), `study_orientation`, `intellectual_frame`, `intellectual_coherence_bridge` |
| **`reasoning_contract`** | **Worked thinking**, **reasoning support** — `disciplinary_lens`, `evidence_use_prompt`, `argument_structure_hint`, `conceptual_contrast_prompt` |

**Deferred:** `metacognition_contract` (Phase 3) — synthesis, regulation, explicit metacognitive closure beyond orientation/reasoning.

**Learner journey patterns (30 charter + probes):**

- Multi-activity pages as **sequenced studies**, not isolated tasks
- **Intellectual coherence bridges** between activities (explicit transition)
- Domain-proportional emphasis (Marx: causation/transfer; RNA: evidence/contrast/misconception repair)

**Sanitisation philosophy (30-2b/2c):** Strip facilitator leakage on self-directed pages — learner voice only in materials and composed rows.

**What 30 primarily addressed:** **Learner orientation** + **instructional support** (reasoning scaffolds) at the **generation layer**, gated to `delivery_context: self_directed`.

---

### 3.4 Sprint 31 — Page rhetoric & renderer experience

**Core belief:** Sprint 30 made output **pedagogically intelligent**; Sprint 31 made it **pedagogically elegant** — calm, scannable, professionally authored **HTML**.

**Contribution (R-layer only):**

| Slice | Visible-pedagogy effect |
|-------|-------------------------|
| **31-1** | Metadata boundary — learner body free of upstream artefact noise |
| **31-2** | Cue hierarchy — framing vs task vs PEL/cognition chrome weighting |
| **31-3** | Knowledge-summary consistency — definitions/relationships readable |
| **31-4** | Worked-example & material polish — tables, templates, prompt tiers |
| **31-5** | Density / anti-repetition — deterministic dedupe within activity |
| **31-6** | Assessment presentation — formative readability |

**Explicit non-goals:** No generation, composition, PEC, or schema changes; no semantic rewriting.

**What 31 primarily addressed:** **Visible pedagogy** — presentation of functions already in JSON. Reinforces **renderer-passive** discipline inherited from 29–30.

---

## 4. Visible pedagogy vs instructional episode richness

| Dimension | **Visible pedagogy** | **Instructional episode richness** |
|-----------|---------------------|-----------------------------------|
| **Question** | Can the learner **find, read, and navigate** guidance? | Does the activity **teach, model, scaffold, and verify** the intellectual move? |
| **Typical locus** | Preambles, bridges, headings, cue CSS, section order | Worked examples, phased practice, misconception repair paths, verification beats |
| **Sprint emphasis** | 29 (semantics), 30 (orientation/reasoning fields), 31 (hierarchy/density) | 28 (cognition architecture, rubric D1–D10), 30 (reasoning_contract), 38C (function rubric) |
| **Failure mode** | Page looks assembled or noisy; cues compete; facilitator voice leaks | Page looks fine but learner is asked to **perform** without teaching, modelling, or check points |
| **38G–38H era** | Partially recovered (preambles on `EV-38G-AFTER`; 38H table-adjunct fidelity) | Improved via ACM rows; **Evaluate-level practice** still thin (H-04) |

**Programme mistake to avoid in 38I-2:** Equating **presence of labels** (`activity_preamble`, `learner_task`, material types) with **episode completeness**. Sprint 28 rubric and 38C-1 both insist on **substance** thresholds (word counts, step visibility, non-spoiler closure, retrieval episodes).

---

## 5. Recurring learner journey patterns

Patterns that appear **across multiple sprints** (not one-off probe wording):

### 5.1 Session-level arcs

| Pattern | Sources | Description |
|---------|---------|-------------|
| **Teach → model → practice → check → consolidate** | 38C-1 workbook definition; 28 self-study probes | Minimum viable solo session |
| **Activate → confront → reconcile → apply** | 28-4 `cognitive_progression_phase`; D8 rubric | Conceptual change pathway inside materials |
| **Support fading across activities** | 38C-1 §3.5; 28 scaffold fading; 28-4 `scaffold_steps[]` | Early hints/checklists; later independence |
| **Integration capstone** | 38C synthesis/transfer; 28 apply phase | Combine ≥3 prior ideas in one artefact |

### 5.2 Activity-level micro-cycles

| Pattern | Sources | Description |
|---------|---------|-------------|
| **Predict → exchange → revise → (reveal)** | 28 P28-02; D9; Sprint 27 peer factors | Reasoning revision cycle |
| **Claim → evidence → reconciliation** | 28 D5; `misconception_repair_pack` | Misconception handling arc |
| **Orient → elucidate → task → verify → reflect** | 38G-2 ACM components; 30 orientation + 28 verification | Single-activity coached episode |
| **Worked example → parallel learner task** | 38C-1 §3.2–3.4; 38E-8 types | Modelling before performance |

### 5.3 Learner support structures

| Structure | Sources | Self-study role |
|-----------|---------|-----------------|
| **Contingent scaffolding** | 28 D6; if-then facilitator or embedded branches | Substitute for tutor responsiveness |
| **Anticipated responses / error trajectories** | 28 D7 | Learner-model awareness without adaptive engine |
| **Productive uncertainty** | 28 D3; `uncertainty_tension_prompt` | Sustained reasoning, not vague “discuss” |
| **Self-explanation prompts** | 28 D4; P28-08/09 probes | Articulate reasoning in solo study |
| **Verification artefacts** | 38C retrieval; 38G checklist/prompt_set/task_cards | Check before continue |
| **Non-spoiler consolidation** | 38C §3.8; 38H-2 anti-spoiler | Reflection without model essay |

### 5.4 Mode distinction (retained from 28)

| Mode | Journey requirement |
|------|---------------------|
| **Self-directed workbook** | All support structures must live in **artefacts** — no compensation layer |
| **Facilitated seminar/workshop** | Same cognition targets; facilitator moves **optional** in materials but gaps **visible** on audit |

---

## 6. Survival and dilution through ACM / DLA / GAM evolution

### 6.1 Concepts that **survived** into later architecture

| Prior concept (28–31) | Later home | Evidence |
|----------------------|------------|----------|
| Structure vs cognition distinction | 38G-2 material type vs activity component | 38G-2 §2 |
| Self-study as primary bar | 38C-1 workbook model; 38E+ self_directed contracts | Programme charter chain |
| Orientation + preamble | 30 `orientation_contract`; 38G `activity_preamble` on `EV-38G-AFTER` | 38G-5 trace |
| Reasoning scaffolds | 30 `reasoning_contract`; DLA cognition-orientation fields | 38G-3 pack |
| Misconception concern | 28 packs; 38G misconception handling component | DLA-WB-21 KM-aware specs |
| Verification beats | 28 rubric D10 balance; 38G checklist/prompt_set/task_cards | `EV-38G-AFTER` |
| Renderer passive discipline | 29–31; 38G “generation not renderer invention” | 38G-2 §9.1 |
| Worked example / sample output types | 38E-8/9 structural contracts | Preserved through 38F–38H |
| Session coherence / bridges | 30 `intellectual_coherence_bridge` | Field surface exists; uneven authoring |

### 6.2 Concepts **diluted or flattened**

| Prior concept | How dilution happened | Symptom on anchors |
|---------------|----------------------|-------------------|
| **Phased progression** (`activate→confront→reconcile→apply`) | Typed in 28-4 but not carried as **mandatory episode ontology** in workbook era | Single activity blocks; CLS scheduling ≠ cognitive phases |
| **If-then adaptive scaffolding** | 28 D6 target; remained **prose in `facilitator_moves`** or absent | D6 = 0 on climate fixture; no embedded branches in self-study |
| **Anticipated learner responses** | 28 D7; no durable required field in workbook contracts | Generic tips; no error trajectories |
| **Reasoning revision cycle** | 28 packs + peer factors; not enforced in inflation workbook DLA arc | Peer pattern in probes only |
| **Scaffold fading** | 38C function; not a pack obligation in 38E–38G | Flat support density A1–A4 |
| **Row-level cognition fields** | Authored inconsistently; often buried in `task_cards` markdown | 29 residual: generic card prose |
| **Metacognitive regulation** | 30 Phase 3 **deferred** | No synthesis/regulation PEC in production |
| **Evaluate-level episode** | 38G bundles defined; **not realised** on capstone | H-04 — Evaluate LO without evaluative practice |
| **Orientation on page** | DLA authored preambles; **dropped** on some 38F pages | 38G-2 §9.2; recovered partially in 38G |

### 6.3 Architectural shift that caused flattening

```text
Sprints 28–31:  "Model cognition IN materials" (typed fields, phases, rubric)
       ↓
Sprints 38C–38F: "Define workbook GENRE + material TYPES" (structural PASS)
       ↓
Sprint 38G:       "Encode ACM COMPONENTS in prompts" (coached episodes)
       ↓
Sprint 38H:       "PRESERVE components to page" (fidelity, not redesign)
```

The shift was **productive** — 38G proved richer output without schema expansion. But it **re-prioritised** checklistable components and material types over **28’s process ontology** (phases, repair ladders, revision cycles as typed structures).

**38G-2 explicit conclusion:** Do not reinvent the journey; **consolidate and reapply** proven concepts. 38I-2 should do that consolidation at **episode-pattern** level, not re-derive from material types alone.

---

## 7. What prior work primarily addressed

| Focus area | Sprint weight | Notes |
|------------|---------------|-------|
| **Learner orientation** | **High** (30, 31, 38C intro) | Preambles, study orientation, bridges, cue hierarchy |
| **Instructional support** | **High** (28, 30, 38C, 38G) | Scaffolding, guidance, materials depth, verification |
| **Cognitive process** | **High** (28 core mission) | Progression, repair, revision, uncertainty — **typed then rhetorical** |
| **Activity structure** | **Medium–high** (26–28 topology, 38E types) | Steps, sequencing, material types — often confused with pedagogy |
| **Visible presentation** | **Medium** (29, 31) | Legibility without changing episode design |
| **Combinations** | **All self-study work assumes combination** | 28-1b: orientation without cognition is insufficient; cognition without orientation fails solo learners |

**Centre of gravity before 38C:** **Cognitive process + instructional support** inside activities.  
**Centre of gravity 38C–38H:** **Activity structure + component checklist** with fidelity to page.  
**38I opportunity:** Re-merge — **episode patterns** that specify **both** process and support **by cognitive level**.

---

## 8. Recovered Instructional Functions

The following instructional moves were **already treated as valuable** for self-directed learning across Sprints 28–31 and the 38C workbook bar. This is **recovery**, not a new model.

### 8.1 Entry and framing

| Function | What the programme believed | Typical expression |
|----------|----------------------------|-------------------|
| **Orientation** | Solo learners need to know *why this activity now* and how it fits the session | `activity_preamble`, `study_orientation`, intellectual frame |
| **Framing** | Tasks need authentic stakes, context, and bounded problem space | Scenarios, D1 authenticity, topic-specific preamble |
| **Transition** | Activities must connect — not isolated worksheets | `intellectual_coherence_bridge`, session arc cues |

### 8.2 Activation and conceptual preparation

| Function | What the programme believed | Typical expression |
|----------|----------------------------|-------------------|
| **Activation** | Prior knowledge must be elicited before demanding performance | `prior_knowledge_activation`, retrieval prompts |
| **Concept elucidation** | Terms and relationships taught before practice | Exposition, `knowledge_summary`, worked setup prose |
| **Misconception handling** | Likely errors named, tempted, and corrected with evidence | Misconception pairs, repair packs, `failure_mode` (learner-facing) |

### 8.3 Modelling and reasoning support

| Function | What the programme believed | Typical expression |
|----------|----------------------------|-------------------|
| **Worked thinking** | Expert steps visible before parallel learner work | `worked_example`, `modelling_note`, staged solutions |
| **Reasoning support** | Decision rules and disciplinary lens explicit | `reasoning_contract` fields, `reasoning_orientation` |
| **Guided inquiry** | Bounded exploration with prompts that sustain tension | `uncertainty_tension_prompt`, dialogic prompts, hint sequences |
| **Scaffold fading** | Support reduces across session | Early `task_cards`/checklists; later open tasks |

### 8.4 Practice and verification

| Function | What the programme believed | Typical expression |
|----------|----------------------------|-------------------|
| **Guided practice** | Completable task + aligned materials + success criteria | `learner_task`, `expected_output`, tables/scenarios |
| **Independent practice** | Learner performs intellectual move with reduced hints | Later activities in arc |
| **Verification** | Check understanding before continuing | `checklist`, `prompt_set`, `task_cards`, retrieval episodes |

### 8.5 Reflection, revision, and transfer

| Function | What the programme believed | Typical expression |
|----------|----------------------------|-------------------|
| **Reflection** | Learner articulates meaning in own words | Reflection prompts, non-spoiler consolidation |
| **Revision** | Attempt → compare → revise reasoning | Peer/revision cycle fields; predict–revise prompts |
| **Transfer** | Apply to learner’s own context | `transfer_or_application_task`, personal scenarios |
| **Synthesis / evaluative judgement** | Integrate ideas; justify with criteria | Capstone tasks, rubrics, ranking with justification (38C §3.9–3.11) |

### 8.6 Cross-cutting design rules (implicit in 28–31)

1. **Self-study has no tutor recovery** — functions must be **in artefacts**, not assumed.  
2. **Structure ≠ pedagogy** — correct topology and material types do not imply coached episodes.  
3. **Pedagogy upstream, presentation passive** — renderer shows what generation composed.  
4. **Explicit briefs lift quality; ordinary briefs regress** — episode model must be **default**, not optional rhetoric.  
5. **Cognitive demand must not thin support** — Evaluate needs **more** episode structure, not fewer components (38G-2 §6; H-04).

---

## 9. Implications for 38I-2

### 9.1 What can be carried forward

| Carry-forward | Source | 38I-2 use |
|---------------|--------|-----------|
| **Session arc templates** | 38C teach→model→practice→check→consolidate; 28 activate→reconcile→apply | Session-level episode scaffolding |
| **Micro-cycle templates** | 28 revision cycle; misconception repair arc; worked→parallel task | Activity-internal phase sequences |
| **Function inventory above** | §8 | Vocabulary for episode components (not new names) |
| **Cognitive-level minimum bundles** | 38G-2 §6 (Understand/Apply/Analyse/Evaluate) | Starting hypothesis for 38I-2 patterns — **to refine**, not adopt blindly |
| **KM/LO affordance mapping** | 38G-2 §5–6 | Input to 38I-3; informs which functions mandatory per level |
| **Visible vs richness distinction** | §4 this doc | Separate **presentation criteria** from **episode completeness criteria** |
| **Self-study stringent bar** | 28-1b, 38C R1–R7 | Evaluation criteria for target-state mock-ups (38I-4) |
| **Non-spoiler closure rule** | 38H-2 | Preserve in Evaluate/Reflect episode design |
| **Existing field surfaces** | 28 cognition fields, 30 PEL, 38G DLA/GAM | Map functions to surfaces — **no schema expansion in 38I** |

### 9.2 What remains undefined

| Gap | Why undefined after 28–31 |
|-----|---------------------------|
| **Canonical episode pattern per cognitive level** | 38G bundles list components but not **ordered phases** or **minimum depth** per phase |
| **Single-activity vs multi-activity episode scope** | 28 phases sometimes CLS-level, sometimes activity-level — not unified |
| **Required vs optional functions per level** | 38G minimum bundles exist; **acceptance thresholds** (Present/Partial) not tied to levels |
| **Evaluate episode** | H-04 deferred — no worked example of evaluative judgement arc on inflation anchor |
| **Fading specification** | Named in 38C; no deterministic “A1 hints → A4 open” contract |
| **Contingent scaffolding in self-study** | 28 target; never standardised as learner-facing if-then pattern |
| **Relationship ACM components ↔ 28 cognition fields** | Both exist; **mapping table** incomplete |
| **Metacognitive regulation episode** | 30 Phase 3 deferred — synthesis/regulation slot empty |

### 9.3 What should be investigated further (38I-2+)

| Investigation | Suggested phase |
|---------------|-----------------|
| Compare **38I-2 draft patterns** (Understand/Apply/Analyse/Evaluate) against §8 recovered functions — gaps and overlaps | **38I-2** |
| Map recovered functions to **ACM components** without redesigning ACM | **38I-2 / 38I-3** |
| Audit **which 28 cognition fields + 30 PEL fields** best realise each function on inflation anchor | **38I-3** |
| Draft **Present/Partial/Absent criteria per function per level** (extend 38C style) | **38I-2** |
| Identify **one inflation activity per level** as target-state exemplar | **38I-4** |
| Document **implementation implications** for future DLA/GAM/pack work — no implementation in 38I | **38I-5** |
| Optional: re-read **Sprint 37 session framing** if episode model needs page-level rhetoric beyond activity | **38I-2 note** |

---

## 10. Key question — answered for 38I-1

> **What instructional functions and learner-support structures did the programme already believe were important before architectural concerns became dominant?**

The programme believed self-directed learning requires **coached episodes**, not artefact assembly:

- **Orient and frame** the intellectual work  
- **Activate and teach** before demanding performance  
- **Model reasoning** with worked thinking, not only answers  
- **Guide practice** with aligned materials and clear evidence of completion  
- **Verify** understanding repeatedly  
- **Handle misconceptions** explicitly  
- **Sustain productive uncertainty** and **self-explanation**  
- **Revise** reasoning when evidence conflicts  
- **Fade scaffolding** across the session  
- **Reflect, synthesise, and transfer** — with **non-spoiler** closure  
- At **Evaluate** level, support **judgement with criteria** — not thin capstone tasks  

Sprints **29 and 31** added: these functions must also be **visible and calm** on the rendered page.  
Sprints **38G and 38H** added: these functions must **survive** DLA → GAM → page.

**38I-2** should formalise **episode patterns** that encode this belief **by cognitive demand** — building on archaeology in this document, not replacing it.

---

## References

- [Sprint 28 index](../../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/sprint-28-index.md) · [closure](../../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/sprint-28-closure.md) · [quality notes](../../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/activity-materials-quality-notes.md)
- [Sprint 29 closure](../../2026-05-21-sprint-29-renderer-cognition-semantics/sprint-29-closure.md) · [renderer semantics notes](../../2026-05-21-sprint-29-renderer-cognition-semantics/renderer-semantics-notes.md)
- [Sprint 30 retrospective](../../2026-05-21-sprint-30-pedagogic-enrichment-layer/SPRINT-30-RETROSPECTIVE.md) · [charter](../../2026-05-21-sprint-30-pedagogic-enrichment-layer/sprint-30-charter.md)
- [Sprint 31 retrospective](../../2026-06-01-sprint-31-page-rhetoric-renderer-experience/SPRINT-31-RETROSPECTIVE.md)
- [38C-1 workbook pedagogy model](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)
- [38G-2 ACM §9](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md)
- [38H-5 closure](../../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-5-sprint-closure.md)
