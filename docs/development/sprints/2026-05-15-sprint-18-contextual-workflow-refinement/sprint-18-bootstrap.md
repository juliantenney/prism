# Sprint 18 bootstrap — Contextual Workflow Refinement

**Date:** 2026-05-15  
**Pack path:** `docs/development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/`  
**Status:** **Bootstrap / exploration** — documentation only; no implementation charter yet.

**Sprint title:** Sprint 18 — Contextual Workflow Refinement

**Canonical consolidation (live repo):** `docs/consolidation/` — prefer live paths when implementing; `context-files/` are portable snapshots.

---

## 1. Executive summary

Sprint 17 proved that **pack-driven deterministic planning** can make sparse Research briefs **safe** (validation, conflict, disclosure, proceed gates). Post-closeout manual testing showed it is **not sufficient** for **planning adequacy**: resolving four required factors does not guarantee that a topic-only workflow has enough semantic scope to justify the generated step chain.

Sprint 18 documents and explores an architectural shift:

1. **Deterministic essentials** establish guardrails; they do not replace judgment about scope and fit.
2. **Workflow generation** produces the first concrete artefact of “what this workflow is” — steps, roles, dependencies — and thereby creates the **substrate for meaningful refinement**.
3. **Refinement** should become **workflow-aware**, **recommendation-driven**, and **contextual** — informed by the designed workflow, not only by upfront factor enumeration.
4. **AI refinement** should sit **on top of** deterministic planning, not **replace** it.

---

## 2. Sprint 17 outcomes (baseline for Sprint 18)

| Delivered | Role |
|-----------|------|
| Sparse fixtures **S1–S6** + `workflow-research-sparse-briefs.test.js` | Pin extract, resolve, heuristics |
| `validationRules`, `conflictPolicies`, `disclosurePolicy` | Block unsafe inference; Planning notices |
| Heuristic proceed gates (`generateResearchContentHeuristic`, `researchDesignPageAppend`) | Withhold GRC / Design Page until essentials resolved |
| Structured planning disclosure (Slice 5) | Categories: missing, blocked, conflict, rejected, gated |
| `explicitExtract` proposal (Slice 4) | **Deferred** — shared parser still LD-heavy |
| **85 tests green** | Sprint 16 renderer baseline preserved |

**Architectural rule (carry forward):** Runtime interprets policy; domain packs declare policy.

**Post-closeout gap (not a Sprint 17 defect):**  
Brief: *“Analyse the evidence and produce an executive briefing on AI governance risks.”*  
Elicitation correctly resolved factors including `input_strategy = generate_from_topic`, but **no clarification** on topical scope of “AI governance risks” before a full analysis chain was planned. See `context-files/sprint-17-topic-sufficiency-gap.md`.

---

## 3. Deterministic planning vs AI refinement

| Layer | Responsibility | Sprint 17 state |
|-------|----------------|-----------------|
| **Deterministic planning** | Factor extract/infer/validate/resolve; step heuristics; gates; disclosures; mapping to `workflowOutputSpec` | Research pack + generic `app.js` interpreters |
| **AI workflow design** | Model proposes step list, roles, narrative design from brief + policy context | Factory `continueWorkflowDesignGeneration` |
| **AI refinement (today)** | Post-generation factor queue (LD-heavy); Prompt Studio separate product surface | Research: no `refinementFactors`; LD: long refinement list |
| **Gap** | Refinement not strongly coupled to **designed workflow semantics** or **assistive recommendations** | Sprint 18 exploration target |

**Principle:** Deterministic layer answers *“Is it allowed and coherent?”* AI layer answers *“What should change, given what we built?”* Refinement must read **workflow context** (steps, artefacts, bindings), not only **brief factor IDs**.

---

## 4. Prompt Studio lessons (patterns, not merge)

| Prompt Studio strength | Implication for Workflow Factory |
|------------------------|----------------------------------|
| Assumptions visible before proceed | Sprint 17 Planning notices — extend to **planning adequacy** and **post-design** assumptions |
| Clear rejected vs accepted inference | `rejectedInference` category — extend to **workflow-level** recommendations |
| User steers without retyping everything | Refinement as **targeted deltas**, not full brief re-entry |
| Session grounded in prior choices | **Workflow record** as session substrate after first design |

**Non-goal:** Merge Prompt Studio UI, template library, or orchestration into Factory in Sprint 18.

---

## 5. Workflow-aware refinement

**Today:** Refinement is largely **factor-centric** (`getWorkflowRefinementQueue`, post-gen elicitation keyed by factor ids). Step-level nuance lives in **step settings** and manual edit, disconnected from elicitation narrative.

**Target shape (exploration):**

- Refinement prompts reference **canonical step titles**, **artefact flow**, and **resolved brief factors** together.
- Recommendations are **scoped**: e.g. “Your plan includes Thematic Analysis but topic scope is broad — narrow sector or geography?”
- Pack may declare **`refinementRecommendations`** or **`contextualClarificationRules`** triggered by workflow shape + brief posture (Research first).

**Workflow-aware** means: the system knows which steps made it into the design and what each step is for, not only that `objective_type = analysis`.

---

## 6. Assistive vs blocking elicitation

| Mode | Purpose | Sprint 17 examples |
|------|---------|-------------------|
| **Blocking** | Cannot proceed until resolved | Required factor queue; validation blocks unsafe `input_strategy`; conflict strips `objective_type` |
| **Assistive** | Proceed, but surface what was assumed | Planning notices; rejected inference; gated step disclosures |
| **Missing today** | Assistive **high-impact clarification** before or after design | Topic scope for `generate_from_topic` |

Sprint 18 should bias toward **assistive refinement after workflow exists**, supplemented by **selective blocking** when safety or adequacy fails — not toward more upfront questionnaires.

---

## 7. Why step settings are the wrong primary UX

- Step settings are **implementation knobs** (role text, output names, bindings) — expert-facing, per-step, high friction.
- Users asking *“Is this the right workflow for my intent?”* need **workflow-level** conversation, not twelve textareas.
- Elicitation and refinement should **propose changes** (“add Validate”, “remove Design Page”, “narrow objective”) and optionally apply them — settings remain **advanced override**, not the main refinement surface.

---

## 8. Why upfront factor enumeration does not scale

- LD packs need many factors + refinement factors; Research needed only four yet still proved **insufficient** for adequacy.
- Enumerating every semantic dimension as a **required factor** explodes Factory UX and still misses emergent gaps (topic scope, evidence base, geographic frame).
- **Workflow generation** reveals implicit commitments (analysis chain, briefing path, page delivery) that factors alone do not surface until steps exist.
- Better model: **small essential factor set** + **deterministic safety** + **contextual refinement pass** over the designed workflow.

---

## 9. Workflow generation as elicitation substrate

```text
Brief (sparse) → deterministic pass → [optional essentials queue]
       → AI designs workflow (steps, order, roles)
       → workflow record becomes semantic context
       → contextual refinement (recommendations, clarifications, deltas)
       → user confirms → run / edit / save
```

**Substrate properties the refinement layer can use:**

- Canonical step list and `depends_on` / artefact producers
- Resolved `workflowOutputSpec` / constraints from factor mapping
- Planning disclosures already shown (blocked, rejected, gated)
- Domain `workflowPolicy` (what could have been included but was not)

**Insight from Sprint 17 smoke test:** Only after seeing analysis + evidence-map steps does the user (or system) recognize that “AI governance risks” was never bounded — factor elicitation alone did not make that visible.

---

## 10. Constraints and non-goals

| In scope (exploration / future implementation) | Out of scope |
|---------------------------------------------|--------------|
| Research-first contextual refinement design | Renderer / Utilities HTML |
| Pack-declared recommendation / clarification policy | Workflow schema redesign |
| Generic runtime interpreters (Sprint 17 pattern) | Prompt Studio product merge |
| Docs, fixtures plan, spike charters | LD implementation sprint |
| Assistive adequacy after design | Broad Factory UI redesign |
| | Replacing deterministic planning with end-to-end AI elicitation |

**LD:** Document cross-domain lessons; **do not** implement LD refinement in Sprint 18 unless explicitly chartered later.

**Verification baseline:** `node --test tests/*.test.js` → **85 passed** (Sprint 17 closeout). Sprint 18 docs must not regress tests.

---

## 11. Proposed exploration areas

| Area | Question |
|------|----------|
| **A. Contextual refinement model** | What inputs does refinement receive (workflow JSON subset, disclosures, factor map)? What outputs (recommendations, factor patches, step add/remove)? |
| **B. Recommendation policy** | Pack shape for `refinementRecommendations` / `highImpactClarificationRules` — trigger on workflow + brief, not factors alone |
| **C. Topic-generation sufficiency** | First Research candidate from Sprint 17 §12 — `topicSpecificityChecks`, `minimumContextForTopicGeneration` |
| **D. Timing** | Refinement **after** initial design vs interleaved before save; relationship to `continueWorkflowDesignGeneration` |
| **E. UX surface** | Factory chat / resolved panel extensions vs dedicated “Review plan” — minimal DOM, no step-settings-first |
| **F. Fixtures** | S7+ sparse briefs for adequacy + post-design recommendation snapshots |
| **G. explicitExtract** | Optional parallel track (Slice 4 proposal) — reduces upstream noise before design |

**Suggested first charter slice (when implementation starts):** Document-only **refinement context contract** (fields passed to AI + pack triggers) → one Research **assistive** rule with fixture → no step-settings UI.

---

## 12. Read-first order (this pack)

1. `sprint-18-bootstrap.md` (this file)
2. `sprint-18-index.md`
3. `context-files/sprint-17-implementation-summary.md`
4. `context-files/sprint-17-topic-sufficiency-gap.md`
5. Live `docs/consolidation/sprint-17-*.md`
6. Live `domains/research/domain-research-step-patterns.md`
7. Live `app.js` — elicitation queue, `continueWorkflowDesignGeneration`, `getWorkflowRefinementQueue`, `renderWorkflowBriefResolvedPanel`

---

## 13. Related artefacts

| Path | Role |
|------|------|
| [`sprint-18-index.md`](sprint-18-index.md) | Pack index |
| [`review-log.md`](review-log.md) | Sprint 18 decision log |
| `context-files/` | Portable snapshots |
| `docs/consolidation/sprint-17-implementation-summary.md` | Closed Sprint 17 closeout |
