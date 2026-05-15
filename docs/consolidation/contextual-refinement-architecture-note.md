# Contextual refinement — architecture note (Sprint 17 → Sprint 18)

**Date:** 2026-05-15  
**Path:** `docs/consolidation/contextual-refinement-architecture-note.md`  
**Status:** Architectural documentation — **no implementation**, **no orchestration redesign**.

**Related:** [`sprint-17-implementation-summary.md`](sprint-17-implementation-summary.md), [`sprint-18-bootstrap.md`](../development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/sprint-18-bootstrap.md).

---

## 1. What changed conceptually

| Before (implicit model) | After (Sprint 17 evidence + Sprint 18 direction) |
|-------------------------|--------------------------------------------------|
| Resolve **required factors** → safe to **generate workflow** | Resolve factors → **safe**; adequacy and fit are **separate** |
| Elicitation = **upfront questionnaire** | Elicitation = **essentials + disclosed assumptions + designed workflow as context** |
| Refinement = **more factors** or **step settings** | Refinement = **workflow-aware recommendations** on a concrete plan |
| AI and rules compete for “truth” | **Deterministic guardrails** first; **AI synthesis and refinement** second |

Sprint 17 **implemented** the guardrail half (pack-driven validation, conflict, disclosure, proceed gates). Sprint 18 **names** the missing half: **contextual refinement** that uses the **designed workflow** as the semantic surface for intelligent, usually **non-blocking** guidance.

**Carry-forward rule:** Runtime interprets policy; domain packs declare policy.

---

## 2. Why the previous elicitation model hit scaling limits

The Factory elicitation path was built around **factor enumeration**:

1. Extract / infer values from free text into a flat factor map.  
2. Block or queue until **requiredFactors** are filled.  
3. Map factors into `workflowOutputSpec` constraints.  
4. Run heuristics and AI to emit steps.

That model works for **safety** (“don’t assume upload without files”) but scales poorly for **judgment**:

| Limit | Symptom |
|-------|---------|
| **Finite required set ≠ complete intent** | Four Research essentials can all be resolved while topic scope stays vague |
| **LD surface area** | Many required, optional, and **refinement** factors; long post-gen queues |
| **Emergent commitments hidden** | “Analysis + briefing + page” appears only after **step titles** exist |
| **Step settings as escape hatch** | Expert users tune roles/bindings per step; novices never see workflow-level “wrong plan” |
| **Prompt Studio vs Factory split** | PS refines **with session context**; Factory refines **with factor ids** |

Sprint 17 did **not** fail — it proved that **pack-declared deterministic policy** can be generic and testable. It also proved that **passing the essentials gate is not the same as a good plan**.

---

## 3. Four layers (distinct responsibilities)

```text
┌─────────────────────────────────────────────────────────────────┐
│  Expert tuning (advanced, optional, persistent)                 │
│  Per-step roles, bindings, output names, manual edits           │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ overrides
┌─────────────────────────────────────────────────────────────────┐
│  Contextual refinement (assistive, usually non-blocking)        │
│  Recommendations, clarifications, deltas scoped to workflow     │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ reads
┌─────────────────────────────────────────────────────────────────┐
│  Workflow synthesis (AI + policy-shaped heuristics)             │
│  Step list, order, artefact graph, domain canonical titles        │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ constrained by
┌─────────────────────────────────────────────────────────────────┐
│  Deterministic essentials (blocking when unsafe or incomplete)  │
│  Validate, conflict, resolve, gates, disclosures, mapping       │
└─────────────────────────────────────────────────────────────────┘
```

### 3.1 Deterministic essentials

**Purpose:** Answer *“Are we allowed to plan, and what is explicitly committed?”*

- Required factor resolution (`objective_type`, `input_strategy`, …).  
- **validationRules** — block unsafe values (e.g. upload language without inputs).  
- **conflictPolicies** — block ambiguous combined intent.  
- **disclosurePolicy** / Planning notices — show blocked, rejected, missing, gated steps.  
- **proceed gates** — withhold specific heuristic steps until essentials exist.

**Mode:** **Blocking** when safety or contract requires it.

**Sprint 17 proof:** Research sparse fixtures S1–S6; **85 tests green**.

### 3.2 Workflow synthesis

**Purpose:** Answer *“What workflow are we actually building?”*

- Model proposes steps, roles, narrative intent from brief + domain policy + mapped constraints.  
- Heuristics canonicalise titles, dependencies, optional Validate / Design Page.  
- Output is a **workflow record** — the first shared artefact both user and system can reason about.

**Mode:** Proceeds once essentials pass (today); may later receive **assistive** adequacy prompts without blocking save.

**Key insight:** Synthesis **creates** semantic context that factors alone do not carry (which analysis steps, which delivery path, how heavy the chain is).

### 3.3 Contextual refinement

**Purpose:** Answer *“Given this plan, what should the user consider changing?”*

- Inputs: designed steps, artefact producers/consumers, resolved factors, planning disclosures, pack recommendation rules.  
- Outputs: targeted suggestions (“narrow topic”, “add reflection”, “remove assessment pack”), optional apply-as-delta.  
- **Recommendation-driven** — not another twenty required fields.

**Mode:** **Usually optional and non-blocking** — user can accept, dismiss, or defer; blocking reserved for safety (essentials layer).

**Sprint 18:** Exploration and charter; not yet implemented.

### 3.4 Expert tuning

**Purpose:** Answer *“How should this step execute technically?”*

- Step settings: role text, `outputName`, `depends_on`, input bindings.  
- Appropriate for **authors and integrators**, not the primary “is this the right workflow?” loop.

**Risk if primary:** High friction; hides workflow-level mistakes until run time.

---

## 4. Why workflow generation creates semantic context for intelligent elicitation

Factors are **labels on the brief**. A workflow is a **commitment structure**:

| Factor alone | Same factors + synthesised workflow |
|--------------|-------------------------------------|
| `objective_type: analysis` | **Conduct Thematic Analysis**, **Build Evidence Map**, … |
| `input_strategy: generate_from_topic` | Possible **Generate Research Content** (if gates pass) + downstream chain |
| `audience: executives` | Still vague until steps show **briefing note** vs **summary** vs **page** |

Intelligent elicitation needs to ask: *“Does this chain match what you meant?”* That question is **meaningless** before steps exist and **obvious** after — e.g. when a broad topic label produced a full analysis pipeline.

```text
Brief text  →  factors (abstract)
                ↓
         workflow synthesis
                ↓
         concrete step semantics  →  refinement & recommendations (grounded)
```

This is why Sprint 17’s post-closeout gap appeared **after** successful generation, not during factor queue failure.

---

## 5. Why Prompt Studio refinement feels more natural

Prompt Studio (PS) optimises for **refinement in context**:

| PS behaviour | Factory gap (pre–Sprint 18) |
|--------------|----------------------------|
| User already chose a **task** and **prompt body** | Factory user chose a **brief**; workflow may not exist yet |
| Assumptions visible in **session** | Sprint 17 added Planning notices; still pre-design centric |
| Refinement is **conversational delta** on known text | Factory post-gen queue asks for **factor ids** (LD) |
| Domain files ground **how to write**, not **which steps** | `workflowPolicy` grounds steps but refinement queue is not step-aware |

**Lesson, not merge:** Factory should adopt PS **patterns** — visible assumptions, rejected-vs-applied inference, scoped deltas — applied to the **workflow record** as the session object, without importing PS orchestration or UI.

---

## 6. Why recommendation-driven refinement beats giant factor schemas

| Giant factor schema | Recommendation-driven refinement |
|---------------------|--------------------------------|
| Every nuance becomes a **required or refinement field** | Nuance appears as **conditional suggestions** when workflow + brief trigger |
| UX: long forms and queues | UX: short essentials + “Review plan” cards |
| Hard to test all combinations | Pack rules target **workflows shapes** (fixtures on step sets) |
| LD: dozens of refinement ids | LD: same essentials + **domain recommendation profiles** |

Pack shape (future, illustrative — not implemented):

- `highImpactClarificationRules` — one question when trigger fires.  
- `refinementRecommendations[]` — `{ whenStepsInclude, whenFactors, message, action, optionalPatch }`.  
- `topicSpecificityChecks` — assistive, post-synthesis.

Deterministic essentials stay **small**; the long tail moves to **contextual** policy.

---

## 7. Why refinement should usually be optional / non-blocking

| Blocking | Non-blocking assistive |
|----------|----------------------|
| Upload without inputs | “Your plan includes Thematic Analysis for a broad topic — narrow scope?” |
| Mixed analysis + briefing signals | “Consider adding a reflection step — dismiss if N/A” |
| Missing `audience` | Must ask before design continues |

**Rationale:**

- **Flow:** Users want a draft plan quickly; adequacy gaps are often fixed **after** seeing the plan.  
- **Expertise:** Experts dismiss noise; novices benefit from suggestions without being trapped in queues.  
- **Safety already covered:** Sprint 17 blocking handles **unsafe** inference, not **suboptimal** plans.  
- **PS alignment:** PS does not block save on every ambiguity; it surfaces and lets the user edit.

Blocking refinement should remain for **essentials** and **hard safety**, not for every semantic improvement.

---

## 8. Concrete examples (manual tests and scenarios)

### 8.1 Research — broad topic after essentials (Sprint 17 post-closeout)

**Brief:**  
“Analyse the evidence and produce an executive briefing on AI governance risks.”

**Observed (manual):**

- Conflict handling and factor elicitation behaved correctly.  
- `input_strategy` → `generate_from_topic`; audience and output_depth elicited.  
- Workflow generated with analysis-chain steps (evidence map, thematic analysis, etc.).  
- **No question** scoped “AI governance risks” (jurisdiction, sector, time horizon, evidence corpus).

**Layer diagnosis:**

| Layer | Result |
|-------|--------|
| Deterministic essentials | **Pass** — not unsafe |
| Workflow synthesis | **Ran** — analysis-shaped chain |
| Contextual refinement | **Absent** — no adequacy recommendation |
| Expert tuning | Only path user would see step-level detail |

**Sprint 18-style assistive copy (illustrative):**  
*“Your workflow analyses evidence and builds a briefing, but the topic ‘AI governance risks’ is still broad. Consider specifying region, sector, or policy frame — or confirm you want a wide exploratory scan.”*

### 8.2 Research — Sprint 17 sparse fixtures (deterministic only)

| Case | What essentials proved |
|------|-------------------------|
| **S2** upload language, empty inputs | Blocks unsafe `input_strategy`; disclosure + rejected inference |
| **S4** mixed analysis + briefing | Conflict strips `objective_type`; no false resolution |
| **S1 / S6** topic-only | Gates withhold GRC and Design Page until essentials resolved |

These pin **safety**, not **topic sufficiency** — intentional boundary of Sprint 17.

### 8.3 Learning Design — climate ethics session (illustrative manual scenario)

**Brief (design intent):**  
“90-minute seminar on climate ethics for second-year undergraduates — debate activities and a short reading.”

**Likely essentials resolution:**

- `learner_level`, `delivery_mode: live_workshop`, `duration_minutes: 90`, session materials cues.  
- Assessment not requested unless user mentions quiz/test.

**After synthesis (typical LD-shaped plan):**

- Define Learning Outcomes → Design Learning Activities → Generate Activity Materials → Design Page (or slide deck).

**Scaling limit of factor-only elicitation:**

- Factors do not ask whether **ethics framing** is deontological vs consequentialist vs climate-justice focused.  
- Factors do not ask if **debate** means structured controversy vs free discussion until **activities** appear.

**Contextual refinement (illustrative, non-blocking):**

1. *“Activities step is generic — do you want explicit debate structure (positions, evidence cards)?”*  
2. *“No assessment step included — add formative check on ethical reasoning?”* (recommendation, not required factor)  
3. *“Reading mentioned but no source material step — attach PDF or generate from topic?”*

**Expert tuning:** Facilitator edits role on “Design Learning Activities”; refinement should have suggested **workflow-level** changes first.

### 8.4 Learning Design — assessment refinement (factor queue vs recommendation)

**Brief:**  
“Create a 10-question MCQ quiz with model answers for formative check on cell biology.”

**Today (LD-leaning path):**

- `assessment_required`, `assessment_type: mcq`, `assessment_total_items: 10` extracted.  
- Post-gen **refinementFactors** may still ask: difficulty profile, coverage scope, feedback_required, cognitive_demand, …

**Problem:** User already said **10 MCQs with model answers** — queue feels like **schema completion**, not help.

**Recommendation-driven alternative (non-blocking):**

- After design: *“Workflow includes Generate Assessment Items and Design Page. Confirm items are formative-only (no grade sync)?”*  
- Optional: *“Add Validate Learning Design?”* only if validation intent signals absent.  
- Dismissible — user proceeds to save.

### 8.5 Learning Design — reflection (emergent, not in essentials)

**Brief:**  
“Workshop on teamwork skills; include individual reflection at the end.”

**Synthesis** may or may not add reflection-oriented activities depending on model + heuristics.

**Factor schema approach:** Add `reflection_required` required factor → one more blocking question for every workshop brief.

**Contextual refinement approach:**

- If plan has activities but no reflection closure: *“You asked for individual reflection — add a dedicated reflection task or rubric step?”*  
- One-click suggest: append **Design Learning Activities** variant or rubric step — not a new global factor.

### 8.6 Learning Design — collaboration (workflow shape trigger)

**Brief:**  
“Students work in teams to produce a shared poster on sustainability.”

**Synthesis** might produce individual-assignment-shaped steps (page, materials) without group formation or peer review.

**Recommendation (illustrative):**

- *“Brief mentions teams; current sequence is individual-facing. Add collaboration checkpoint or peer feedback activity?”*  
- Trigger: `whenGoalMentionsAnyOf: ["teams", "group", "collaborative"]` + `whenStepsLack: ["peer", "collaboration", "group"]`.

Again: **assistive**, not a mandatory **collaboration_mode** enum on every LD workflow.

---

## 9. Implications by domain

### 9.1 Research (first proving surface)

| Implication | Notes |
|-------------|--------|
| Keep **small required factor set** | Sprint 17 validated |
| Add **adequacy / topic sufficiency** as **post-synthesis recommendations** | Post-closeout driver |
| Extend pack policy | `topicSpecificityChecks`, `highImpactClarificationRules`, planning adequacy notices |
| Fixtures **S7+** | Pin recommendations against step sets, not only factor maps |
| **No** reopen Sprint 17 safety mechanisms | Layer on top |

### 9.2 Learning Design (document and defer implementation)

| Implication | Notes |
|-------------|--------|
| **Do not** grow required factors to cover reflection, collaboration, pedagogy nuance | Use recommendations |
| **RefinementFactors** queue should shrink or become **conditional** on workflow shape | Reduce completionist UX |
| **Assessment packs** benefit most from recommendation-driven review | MCQ/bank briefs already over-extract |
| **intentClasses** / assessment metadata remain deterministic | Safety and mapping unchanged |
| Separate sprint for LD adoption | Same runtime interpreters, LD pack rules |

---

## 10. Target flow (conceptual — no orchestration redesign)

```text
1. Brief in Factory
2. Deterministic essentials (extract → infer → validate → conflict → resolve → disclose)
3. [Blocking queue only if required missing or hard stop]
4. Workflow synthesis (AI + heuristics) → workflow record
5. Contextual refinement pass (pack rules + AI phrasing) → recommendations in panel/chat
6. User: accept / dismiss / edit workflow
7. Expert tuning (step settings) as needed
8. Save / run
```

Orchestration **order** may vary (e.g. refinement on demand vs automatic); this note does not specify new services or file loaders.

---

## 11. Non-goals (this architecture pass)

- Renderer, Utilities, workflow schema redesign  
- Prompt Studio product merge  
- Replacing deterministic planning with end-to-end AI elicitation  
- LD implementation in the same sprint as Research proof  
- New orchestration graph or context-loader redesign  

---

## 12. Summary

Sprint 17 established **deterministic essentials** as pack-driven, testable guardrails. Manual testing showed the next bottleneck is **planning adequacy and fit**, visible only once a **workflow exists**. Sprint 18 reframes elicitation as a **stack**: essentials → synthesis → **contextual refinement** → expert tuning, with refinement **workflow-aware**, **recommendation-driven**, and **mostly optional** — the pattern Prompt Studio already demonstrates for prompts, applied to workflow plans.

---

## Review log

- **2026-05-15** — Initial architecture note (Sprint 17 → Sprint 18 transition).
