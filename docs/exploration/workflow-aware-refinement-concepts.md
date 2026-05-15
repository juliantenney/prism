# Workflow-aware refinement — forward-looking concepts

**Date:** 2026-05-15  
**Path:** `docs/exploration/workflow-aware-refinement-concepts.md`  
**Status:** **Exploration only** — possible Sprint 18+ mechanisms; **no implementation**, no pack JSON committed here.

**Related:**

- [`docs/consolidation/contextual-refinement-architecture-note.md`](../consolidation/contextual-refinement-architecture-note.md) — Sprint 17 → 18 transition
- [`docs/consolidation/sprint-17-implementation-summary.md`](../consolidation/sprint-17-implementation-summary.md) — deterministic essentials (closed)
- [`docs/development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/sprint-18-bootstrap.md`](../development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/sprint-18-bootstrap.md) — Sprint 18 bootstrap

**Rule (if implemented):** Domain packs **declare** policy; runtime **interprets** generically — same pattern as Sprint 17 `validationRules` / `conflictPolicies` / proceed gates.

---

## 0. Deterministic substrate (non-negotiable)

Any refinement mechanism sits **above** a frozen planning baseline:

```text
Brief → deterministic essentials → workflow synthesis → [refinement layer] → save / run
```

| Layer | Blocking? | Owned by |
|-------|-----------|----------|
| Required factors, validation, conflict, gates | **Yes**, when unsafe or incomplete | Pack + generic interpreters (Sprint 17) |
| Workflow synthesis | Proceeds when essentials allow | AI + `workflowPolicy` heuristics |
| Concepts in this document | **Usually no** | Pack triggers + runtime evaluation + optional AI phrasing |

Refinement must **not** replace validation, conflict resolution, or factor precedence. It **reads** their outputs (disclosures, rejected inference, resolved map) and the **designed workflow**.

---

## 1. Concept catalogue (summary)

| Concept | One-line purpose |
|---------|------------------|
| `recommendedRefinementPrompts` | Pack-authored suggestion templates keyed to workflow/brief triggers |
| `workflowQualitySignals` | Derived indicators that a plan may be thin, mismatched, or over-heavy |
| `planningAdequacyChecks` | Rules that judge “fit for purpose” after synthesis, not field completeness |
| `highImpactClarificationRules` | One targeted question when a consequential choice lacks scope |
| `refinementRecommendationEngine` | Runtime orchestrator: evaluate pack rules → ranked recommendations |
| `contextual workflow-aware elicitation` | Umbrella UX: refinement grounded in step list + artefacts, not factor IDs alone |
| `optional review / improvement passes` | Explicit non-blocking review step(s) in Factory flow |
| `refinement opportunity detection` | Deterministic “something worth suggesting” predicate before calling AI |
| `workflow-semantic enrichment` | Enriched context object passed to refinement AI (steps, deps, disclosures) |

---

## 2. `recommendedRefinementPrompts`

### Purpose

Pack-declared **message templates** (and optional actions) shown when triggers fire — e.g. “Your workflow includes Thematic Analysis but the topic is still broad; specify region or sector?”

Analogous to `disclosurePolicy.messages` but aimed at **improvement**, not **blocking**.

### Why not required factors?

Required factors ask *“What is the value of X?”* before design. Recommended prompts ask *“Does this **plan** still match your intent?”* after partial commitments exist. The user may **dismiss** without invalidating `objective_type` or `input_strategy`.

### Why recommendation-driven?

The trigger is **workflow shape + brief posture**, not a missing schema field. Forcing a new required factor `topic_scope_facet` for every `generate_from_topic` brief recreates enumeration scaling.

### Runtime vs pack

| Pack | Runtime |
|------|---------|
| `recommendedRefinementPrompts[]`: `id`, `when`, `message`, `action`, `priority`, optional `suggestedPatch` | Match `when` against workflow snapshot + brief; dedupe; render in panel/chat; optional AI rephrase of fixed template |

---

## 3. `workflowQualitySignals`

### Purpose

**Computed flags** on a designed workflow — not user-facing factors — e.g. `analysis_chain_without_source`, `delivery_step_without_synthesis`, `step_count_high_for_concise_depth`, `assessment_steps_without_assessment_intent`.

Feeds adequacy checks and the recommendation engine without expanding the brief form.

### Why not required factors?

Signals describe **properties of the plan**, not inputs the user must supply upfront. Many signals only exist **after** synthesis.

### Why recommendation-driven?

A signal like `broad_topic_analysis_chain` is a **hint**, not a hard stop. User may intend a wide exploratory scan; the system suggests narrowing, not blocks save.

### Runtime vs pack

| Pack | Runtime |
|------|---------|
| `workflowQualitySignals[]`: `id`, `emitWhen` (step set, factor values, missing artefacts) | Walk workflow steps + `dependencies` + resolved factors; set signal map; no user elicitation |

---

## 4. `planningAdequacyChecks`

### Purpose

Pack rules that ask *“Is this plan adequate for the stated intent?”* — distinct from Sprint 17 **safety** validation (upload without files, mixed objective signals).

Example: `generate_from_topic` + analysis steps + topic label shorter than N tokens or lacking constraint keywords → adequacy notice.

### Why not required factors?

Adequacy is **relational** (intent × steps × posture). Encoding every adequacy dimension as factors multiplies required questions; still misses emergent mismatches (reflection asked in brief, no reflection-shaped step).

### Why recommendation-driven?

False positives are common (“broad but intentional”). Blocking on adequacy frustrates experts; **assistive notices** match Prompt Studio’s “here’s a risk” pattern.

### Runtime vs pack

| Pack | Runtime |
|------|---------|
| `planningAdequacyChecks[]`: `when`, `signalRequires`, `disclosureId`, `severity` | Run after synthesis; append to planning disclosures category `planning_adequacy` (new category); never delete resolved factors |

---

## 5. `highImpactClarificationRules`

### Purpose

**At most one** (or few) **high-stakes** clarifications when a consequential factor is chosen but context is thin — e.g. `input_strategy: generate_from_topic` without bounded topic, geography, corpus, or time horizon.

Sprint 17 post-closeout driver: *“AI governance risks”* with full essentials but no scope question.

### Why not required factors?

Making `topic_boundary` always required collapses every topic brief into extra blocking Q&A. High-impact rules fire **only when** triggers match — sparse, justified questions.

### Why recommendation-driven (usually)?

**Pre-design blocking** variant possible for extreme safety (empty design intent) — already covered by required factors. For scope nuance, **post-synthesis assistive** question works better: user sees **why** it matters (analysis steps listed).

Optional hybrid: **soft block** (“Continue anyway”) — still not a new eternal required field.

### Runtime vs pack

| Pack | Runtime |
|------|---------|
| `highImpactClarificationRules[]`: `factorId`, `whenFactorValue`, `whenWeakScopeSignals`, `question`, `action` | Evaluate after resolve and/or after synthesis; may insert one chat turn or panel card; respect `maxDefaultQuestions` spirit without counting as required factor |

---

## 6. `refinementRecommendationEngine`

### Purpose

Central **runtime coordinator** that:

1. Collects workflow snapshot, resolved factors, disclosures, quality signals.  
2. Evaluates pack rules (`recommendedRefinementPrompts`, adequacy checks, opportunities).  
3. Produces a **ranked list** of recommendations (deterministic ordering; optional AI polish).  
4. Applies user accept/dismiss state.

Not a single monolith in the pack — the pack stays declarative; the engine is generic.

### Why not required factors?

The engine is **machinery**, not user-facing schema. Collapsing “engine” into dozens of refinement factors was the old LD queue anti-pattern.

### Why recommendation-driven?

The engine’s default output type is **`Recommendation`**, not `MissingFactor`. Blocking is delegated to essentials only.

### Runtime vs pack

| Pack | Runtime |
|------|---------|
| Rule arrays above; optional `recommendationPolicy`: max shown, sort, suppress after dismiss | `evaluateRefinementRecommendations(config, workflow, briefState)` in `app.js`; test API for fixtures |

---

## 7. Contextual workflow-aware elicitation

### Purpose

**Umbrella behaviour**: any Factory elicitation/refinement that uses **canonical steps**, **artefact producers/consumers**, **`depends_on`**, and **heuristic gates already applied** as first-class context — not only `workflowBriefConfig.requiredFactors`.

Includes chat copy, panel sections, and optional AI turns that reference *“your workflow includes X before Y”*.

### Why not required factors?

Workflow-aware elicitation is a **mode of interaction**, not a single factor. Factors remain the **compact contract** for constraints mapping; workflow is the **semantic contract** for fit.

### Why recommendation-driven?

The user should **see the plan** and choose refinements. Blocking queues of factor IDs without referencing steps felt like form-filling, not planning (LD post-gen refinement today).

### Runtime vs pack

| Pack | Runtime |
|------|---------|
| Domain vocabulary for step titles, artefact names, trigger vocabulary | Build `workflowRefinementContext` object; pass to chat/panel/AI; no change to `resolveWorkflowBriefFactors` precedence |

---

## 8. Optional review / improvement passes

### Purpose

Explicit **Factory lifecycle hooks** — e.g. “Review plan” after first synthesis, before save — where refinement runs **once** or **on demand**, separate from essentials queue and separate from per-step settings.

Passes might be: `post_synthesis_review`, `pre_save_review`, `on_user_request`.

### Why not required factors?

A pass is **orchestration timing**, not data. Conflating “run review” with `review_required: true` factor adds blocking friction without semantic gain.

### Why recommendation-driven?

Passes are **skippable** by default (“Looks good — continue”). Only essentials gate **Design workflow** when unsafe.

### Runtime vs pack

| Pack | Runtime |
|------|---------|
| `refinementPasses[]`: `id`, `default`, `triggers`, `runRules` | Factory state machine calls engine at pass boundaries; **no** new WGC loader required for exploration |

---

## 9. Refinement opportunity detection

### Purpose

**Cheap deterministic predicate**: is there anything worth surfacing? Avoids calling AI on every workflow; avoids notification fatigue.

Examples: any `workflowQualitySignals` true; any `planningAdequacyChecks` failed; brief mentions “reflection” but no step title matches reflection vocabulary; assessment steps present without `assessment_required`.

### Why not required factors?

Opportunity detection is **meta** — it does not ask the user to fill a field; it decides whether to show the refinement UI badge.

### Why recommendation-driven?

If no opportunities, **silent proceed** — better UX than mandatory review screens.

### Runtime vs pack

| Pack | Runtime |
|------|---------|
| `opportunityRules[]`: combine signals with AND/OR | `hasRefinementOpportunities(context) → boolean`; drives badge / pass suggestion |

---

## 10. Workflow-semantic enrichment

### Purpose

A structured **context bundle** for refinement AI and panel copy — not raw full `app.js` state:

- Canonical step titles + order  
- Artefact graph (produces / requires)  
- Resolved factors + sources  
- Planning disclosures (blocked, rejected, gated, adequacy)  
- Dismissed / accepted recommendation ids  
- Domain id + policy version  

### Why not required factors?

Enrichment is **derived view** for consumers (AI, UI). It should never become a second factor store users must maintain.

### Why recommendation-driven?

Enrichment **feeds** suggestions; it does not add blocking fields. AI may phrase recommendations but **must not** override deterministic resolutions without explicit user accept.

### Runtime vs pack

| Pack | Runtime |
|------|---------|
| Optional: which fields are safe to include in AI context (`contextExportPolicy`) | `buildWorkflowSemanticEnrichment(workflow, briefResolvedState)` — stable JSON subset for prompts; redact huge role texts |

---

## 11. How concepts compose (exploration diagram)

```text
                    ┌──────────────────────────────┐
                    │  workflow-semantic          │
                    │  enrichment (context blob)   │
                    └──────────────┬───────────────┘
                                   │
     ┌─────────────────────────────┼─────────────────────────────┐
     │                             │                             │
     v                             v                             v
workflowQualitySignals    planningAdequacyChecks    highImpactClarificationRules
     │                             │                             │
     └─────────────────────────────┼─────────────────────────────┘
                                   v
                    refinement opportunity detection
                                   │
                                   v
                    refinementRecommendationEngine
                                   │
              ┌────────────────────┼────────────────────┐
              v                    v                    v
 recommendedRefinementPrompts   optional review passes   contextual workflow-aware
                               (UI timing)              elicitation (UX mode)
```

---

## 12. Cross-cutting risks

### 12.1 Over-automation

| Risk | Mitigation (conceptual) |
|------|-------------------------|
| Auto-removing steps the user wanted | Recommendations require **explicit accept**; no silent graph surgery |
| AI “fixes” brief against user intent | AI phrasing only; **patches** from pack templates or user-confirmed deltas |
| Repeated nagging on dismiss | `suppressAfterDismiss`, per-session caps, `recommendationPolicy.maxShown` |
| Replacing user authorship | Refinement suggests; synthesis remains user-triggered |

### 12.2 Giant refinement schemas

| Risk | Mitigation |
|------|------------|
| LD-style `refinementFactors` explosion | **No** new global required/refinement enum; triggers on **workflow + brief** |
| Every pedagogy nuance → factor id | Use `recommendedRefinementPrompts` + signals |
| Untestable combinatorics | Golden fixtures on **workflow + brief → recommendations[]**, not N factor queues |
| Pack fork per course | Generic interpreters; domain declares rules only |

### 12.3 Prompt Studio overreach

| Risk | Mitigation |
|------|------------|
| Merging PS session model into Factory | Adopt **patterns** (visibility, deltas), not PS loaders/UI |
| Refinement loads full domain markdown like design | Separate **lean refinement context** export policy |
| Single AI surface for prompt + workflow | Factory refinement targets **workflow record**; PS stays prompt-centric |
| Duplicate orchestration graphs | No new context pipeline in exploration — enrichment from existing workflow JSON |

### 12.4 Eroding deterministic substrate

| Risk | Mitigation |
|------|------------|
| AI overrides `validationRules` outcomes | Recommendations cannot write `resolvedFactors` without elicited/explicit path |
| Adequacy checks block like required factors | Default **assistive** severity; blocking reserved for essentials |
| Heuristic gates bypassed by refinement | Gates apply at synthesis; refinement may suggest **adding** steps, not bypassing gates silently |
| Untested regression of S1–S6 | Keep sparse safety fixtures; add **S7+** for recommendations only |

---

## 13. Research vs Learning Design (exploration stance)

| Domain | First concepts to trial | Defer |
|--------|-------------------------|-------|
| **Research** | `planningAdequacyChecks`, `highImpactClarificationRules`, `workflowQualitySignals` for topic-only + analysis chains | Full `refinementFactors` queue |
| **Learning Design** | `recommendedRefinementPrompts` for assessment / reflection / collaboration mismatches | Implementation until Research contract stable |
| **Both** | `refinementRecommendationEngine`, enrichment blob, optional `post_synthesis_review` pass | Orchestration redesign |

---

## 14. Illustrative triggers (not spec)

**Research — broad topic + analysis chain**

- Signal: `analysis_steps_present` ∧ `input_strategy = generate_from_topic` ∧ `weak_topic_scope`  
- Prompt: narrow geography / sector / policy frame  
- **Not** blocking `continueWorkflowDesignGeneration`

**LD — reflection in brief, no reflection step**

- Signal: `goal_mentions_reflection` ∧ `no_reflection_vocabulary_in_steps`  
- Prompt: add reflection activity or rubric step  
- Dismiss: proceed without new required factor

**LD — collaboration in brief, individual-shaped plan**

- Signal: `goal_mentions_groups` ∧ `no_peer_or_group_step`  
- Prompt: suggest collaboration checkpoint  
- Optional patch template: insert canonical activity step (user accept)

---

## 15. Open questions (for charter)

1. Single `post_synthesis_review` pass vs badge-only opportunistic UI?  
2. May high-impact clarifications **soft-block** with “continue anyway”?  
3. Should accepted recommendations mutate workflow JSON deterministically or via second AI pass?  
4. Fixture strategy: snapshot `recommendations[]` or full panel text?  
5. Relationship to `explicitExtract` (Sprint 17 proposal) — upstream noise reduction vs downstream adequacy?

---

## 16. Review log

- **2026-05-15** — Exploration document created; concepts only, no implementation.
