# Sprint 18 bootstrap — Contextual Workflow Refinement

**Date:** 2026-05-15  
**Pack path:** `docs/development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/`  
**Sprint title:** Sprint 18 — Contextual Workflow Refinement  
**Status:** **Checkpoint** — Slices 1–2 **closed**; see [`SPRINT-18-CHECKPOINT.md`](SPRINT-18-CHECKPOINT.md). Architecture bootstrap below remains valid; verification floor is **91 tests**.

**Portable handover:** Use **`GPT-BOOTSTRAP-PROMPT.md`** + **`HANDOVER.md`** to start a fresh chat. **`context-files/`** holds snapshots when the repo root is not attached.

**Canonical live repo:** Prefer `docs/consolidation/`, `docs/exploration/`, `docs/audits/`, and live `app.js` / `domains/research/` when implementing.

---

## 1. Executive summary

**Sprint 17 (closed)** proved that **pack-driven deterministic planning** makes sparse Research briefs **safe**: validation, conflict, disclosure, proceed gates, and golden fixtures **S1–S6** (**85 tests green**).

**Sprint 18 (Slices 1–2 closed)** delivered **planning adequacy** and **workflow-aware refinement** for Research: assistive, **non-blocking** `planning_adequacy` guidance grounded in the **designed workflow**, starting with **topic scope** when `generate_from_topic` meets an analysis chain (S7).

**Architectural breakthrough (one sentence):**  
*Workflow generation turns abstract brief factors into a concrete step-and-artefact commitment; that record is the semantic substrate for elicitation and refinement that factor IDs alone cannot provide.*

**Carry-forward rule:** Runtime interprets policy; domain packs declare policy.

---

## 2. Sprint 17 outcomes (do not reopen implementation)

| Delivered | Role for Sprint 18 |
|-----------|-------------------|
| Fixtures **S1–S6** + `workflow-research-sparse-briefs.test.js` | Regression baseline — **unchanged** at checkpoint |
| **S7** + `workflow-research-adequacy.test.js` | Topic-sufficiency adequacy — **delivered** Slice 1–2 |
| `validationRules`, `conflictPolicies`, `disclosurePolicy` | Stay **deterministic** and **blocking** when unsafe |
| Proceed gates (`generateResearchContentHeuristic`, `researchDesignPageAppend`) | **Proceedability** — withhold steps until essentials allow |
| Planning disclosure (categories, `rejectedInference`, `planningGateDisclosures`) | Template for **assistive** adequacy notices |
| `explicitExtract` proposal (Slice 4) | **Deferred** — optional parallel track |
| **85 tests** (S17) → **91 tests** (S18 checkpoint) | Verification floor |

**Post-closeout gap (motivation, not a defect):**  
Brief: *“Analyse the evidence and produce an executive briefing on AI governance risks.”*  
All four required factors resolved including `generate_from_topic`; full analysis chain generated; **no topic scope question**. See `context-files/sprint-17-topic-sufficiency-gap.md`.

---

## 3. The four planning concepts (explicit distinctions)

Sprint 18 work must keep these separate in design, packs, UX, and tests.

| Concept | Question it answers | Blocking? | Sprint 17 examples |
|---------|---------------------|-----------|-------------------|
| **Required essentials** | “What must be known before planning is contractually valid?” | **Yes** when missing or unsafe | Four Research factors; S2 upload-without-inputs validation |
| **Proceedability** | “Which heuristic steps may attach to the plan now?” | **Yes** for gated steps only | GRC / Design Page withheld until `objective_type` + `input_strategy` (S1, S2, S4, S6) |
| **Refinement opportunities** | “What could improve fit or clarity?” | **Usually no** | Future: topic scope prompt after design; LD post-gen optional tiers |
| **Workflow-quality enrichment** | “What signals describe plan shape?” | **No** (derived) | Future: `workflowQualitySignals`; analysis chain without sources |

```text
Required essentials ──► Proceedability gates ──► Workflow synthesis
                                                        │
                        ◄── Workflow-quality signals ───┤
                        ◄── Refinement opportunities ─┘
```

**Anti-pattern:** Adding every adequacy nuance as a new **required factor** — recreates LD-scale enumeration and still misses emergent plan shape (Sprint 17 smoke test).

---

## 4. Deterministic planning vs contextual refinement

| Layer | Responsibility | Owner |
|-------|----------------|-------|
| **Deterministic essentials** | Extract, infer, validate, conflict, resolve, map, disclose, gate | Pack + generic `app.js` interpreters |
| **Workflow synthesis** | AI + `workflowPolicy` heuristics → step list, roles, deps | Factory generation |
| **Contextual refinement** | Recommendations, clarifications, deltas scoped to **workflow + brief** | Sprint 18 target (pack triggers + runtime + optional AI phrasing) |
| **Expert tuning** | Per-step Settings, manual edit | Advanced override — not primary UX |

**Principles:**

- Deterministic layer: *“Is it allowed and coherent?”*
- Refinement layer: *“Given what we built, what should the user consider changing?”*
- AI **augments** refinement; it does **not** replace validation, conflict, or factor precedence.

---

## 5. Why upfront factor enumeration does not scale

| Evidence | Implication |
|----------|-------------|
| Research needs only **four** required factors yet smoke test failed **adequacy** | Essentials ⊂ fit-for-purpose |
| LD **`refinementFactors`** + post-gen profiles — long queues | Works for step params; poor for “is this the right workflow?” |
| **S4** mixed analysis+briefing — conflict blocks factor; step bloat is a **plan** issue | Factor layer + workflow layer both needed |
| **S1** topic in goal but `input_strategy` unset | Must ask essentials; scope may still be vague after resolve |
| Factors are **labels**; steps are **commitments** | Thematic Analysis in the plan makes under-specified topics visible |

**Target model:** Small essential set + deterministic safety + **contextual refinement pass** over the designed workflow.

---

## 6. Workflow generation as elicitation substrate

```text
Brief (sparse)
  → deterministic essentials [blocking when unsafe/incomplete]
  → proceedability gates
  → AI designs workflow (steps, order, roles, artefact graph)
  → workflow record = semantic context
  → contextual refinement (recommendations, optional clarifications)
  → confirm / edit / save / run
```

**Substrate properties refinement may read:**

- Canonical step titles and `depends_on`
- Which gates fired (GRC, Design Page, Validate stripped)
- `workflowOutputSpec` / mapped constraints
- Planning disclosures already shown
- Pack `workflowPolicy` (what could have been included)

**Insight:** The smoke-test gap appeared **after** successful generation — factor elicitation alone did not surface that “AI governance risks” was never bounded.

---

## 7. Workflow-aware refinement (Sprint 18 focus)

**Today (audit):** Factor-centric `getWorkflowRefinementQueue` (LD); post-gen `stepRefinementProfiles` keyed on **which steps exist**; generic `callOpenAIForWorkflowReview`; Research has **no** `refinementFactors`.

**Target (exploration):**

- Triggers on **workflow shape + brief posture**, not only missing factor ids
- Messages reference **steps and artefacts** (“Thematic Analysis + generate_from_topic + broad topic”)
- Pack-declared policy interpreted generically (Sprint 17 pattern)

**Research-first; LD later** — same bounded-lab approach as Sprint 17.

---

## 8. Assistive vs blocking refinement

| Mode | When | Examples |
|------|------|----------|
| **Blocking** | Safety or incomplete contract | S2 `upload_language_without_inputs`; S4 `objective_type_mixed_signals`; missing essentials (S6) |
| **Assistive (transparent)** | Proceed but disclose | Planning notices; rejected inference; gated step disclosures |
| **Assistive (recommendation)** | Proceed; suggest improvement | **Sprint 18** — topic scope; optional step add/remove; reflection prompts |

**Bias:** More **assistive after design**; selective blocking only when essentials/safety demand it — not another long upfront form.

---

## 9. Prompt Studio lessons (no orchestration merge)

See `context-files/prompt-studio-workflow-factory-lessons.md`.

| Adopt | Do not merge |
|-------|----------------|
| Concrete session object (workflow record ≈ prompt body) | PS UI, library DB, template flows |
| Visible assumptions and rejected inference | Shared orchestration with `handleStartRefinement` |
| Delta-oriented suggestions | Making step Settings the main refinement surface |
| Non-blocking ambiguity handling | Copying PS `brief` field names into Factory planning |

---

## 10. Active exploration themes

| # | Theme | Primary doc |
|---|--------|-------------|
| 1 | Contextual refinement model (inputs/outputs contract) | `context-files/contextual-refinement-architecture-note.md` |
| 2 | Assistive vs blocking balance | `context-files/sprint-18-research-questions.md` §2 |
| 3 | Topic-generation sufficiency / high-impact clarification | `context-files/sprint-17-topic-sufficiency-gap.md` |
| 4 | Pack-driven recommendation policy | `context-files/workflow-aware-refinement-concepts.md` |
| 5 | Refinement timing vs `continueWorkflowDesignGeneration` | research-questions §1 |
| 6 | UX surface (Planning vs chat vs step annotations) | research-questions §3 |
| 7 | Research vs LD divergence | research-questions §9; infrastructure audit §9 |
| 8 | Pack vs AI reasoning boundary | research-questions §10 |
| 9 | Regression strategy (S7+, manual tests) | research-questions §11 |

---

## 11. Candidate refinement concepts (not implemented)

Illustrative pack/runtime names from exploration — **no JSON committed in this sprint pack:**

| Concept | Purpose |
|---------|---------|
| `recommendedRefinementPrompts` | Template messages when triggers fire |
| `workflowQualitySignals` | Derived flags on designed workflow |
| `planningAdequacyChecks` | Fit-for-purpose after synthesis |
| `highImpactClarificationRules` | One targeted question when consequence + weak scope |
| `topicSpecificityChecks` | Topic-only / generate-from-topic heuristics |
| `refinementRecommendationEngine` | Evaluate pack rules → ranked recommendations |
| `refinement opportunity detection` | Deterministic predicate before AI phrasing |

---

## 12. Likely first experiments (when implementation is chartered)

| Order | Experiment | Success signal |
|-------|--------------|----------------|
| 1 | **Refinement context contract** (doc + TypeScript-shaped comment or test stub) | Fields: steps[], factors{}, disclosures[], gates{} |
| 2 | One Research **`highImpactClarificationRule`** or adequacy check for smoke-test pattern | Fixture **S7** pins trigger + non-blocking message |
| 3 | Runtime interpreter: evaluate `when` on workflow snapshot | No change to S1–S6 resolve semantics |
| 4 | Planning panel or chat renders **one** recommendation id | Dismiss does not alter resolve map |
| 5 | Manual: smoke brief + S2/S4 regressions in browser | Blocking behaviour unchanged |

**Not first:** LD `refinementFactors` port; full AI review rewrite; `explicitExtract` unless parallel charter.

---

## 13. Suggested manual workflow tests

Run in Factory with Research domain; record Planning panel + chat + step list.

| ID | Brief / scenario | What to observe |
|----|------------------|-----------------|
| **M0** | Smoke: “Analyse the evidence… executive briefing on **AI governance risks**” | Essentials OK → plan generated → **should** surface scope adequacy (Sprint 18 target) |
| **M1** | **S1** text: “Need research on AI policy for universities” | Essentials asked; gated chain; no spurious Design Page |
| **M2** | **S2** text: “Summarise **uploaded PDFs**…” empty inputs | Blocking validation; upload disclosure |
| **M3** | **S3** with inputs + audience | Design Page when gates pass |
| **M4** | **S4** “analysis briefing on digital inclusion” | Conflict blocks silent briefing resolve |
| **M5** | **S5** HTML-ready desired outputs | Page cues; Design Page timing vs essentials |
| **M6** | **S6** “Research help” | Essentials only; minimal chain |
| **M7** | After M0, user dismisses scope suggestion | Save allowed; dismissal remembered? (design choice) |
| **M8** | “Review & suggest improvements” button | Unchanged generic reviewer unless chartered |

---

## 14. Implementation constraints

| Constraint | Detail |
|------------|--------|
| **Research proving surface** | Policy and fixtures in Research pack first |
| **LD rollout deferred** | Document lessons; no LD implementation unless chartered |
| **Pack declares; runtime interprets** | Same as Sprint 17 |
| **85 tests must stay green** | Extend, do not break S1–S6 |
| **No renderer / schema / orchestration redesign** | Per sprint boundaries |
| **No Prompt Studio merge** | Patterns only |
| **No step-settings-first refinement UX** | Workflow-level recommendations primary |

---

## 15. Non-goals

- Reopening Sprint 17 slices 0–5 implementation
- Replacing deterministic planning with end-to-end AI elicitation
- Broad Factory UI redesign
- LD `refinementFactors` alignment sprint
- `explicitExtract` unless explicitly parallel-chartered
- Committing full pack JSON for all exploration concepts in bootstrap phase

---

## 16. Read-first order

### From this pack (fresh chat without repo)

1. `GPT-BOOTSTRAP-PROMPT.md` (or copy-paste block at end)
2. `HANDOVER.md`
3. `sprint-18-bootstrap.md` (this file)
4. `context-files/sprint-17-implementation-summary.md`
5. `context-files/contextual-refinement-architecture-note.md`
6. `context-files/sprint-17-topic-sufficiency-gap.md`
7. `context-files/workflow-aware-refinement-concepts.md`
8. `context-files/existing-refinement-infrastructure-audit.md`
9. `context-files/sprint-18-research-questions.md`
10. `context-files/sprint-17-research-elicitation-sparse-brief-prep.md` (S1–S6 table)
11. `context-files/prompt-studio-workflow-factory-lessons.md`

### Live repo (when mounted)

| Path | Role |
|------|------|
| `docs/consolidation/sprint-17-implementation-summary.md` | Closed Sprint 17 |
| `docs/consolidation/contextual-refinement-architecture-note.md` | Architecture |
| `docs/exploration/workflow-aware-refinement-concepts.md` | Concept catalogue |
| `docs/exploration/sprint-18-research-questions.md` | Open questions |
| `docs/audits/existing-refinement-infrastructure-audit.md` | What exists in code |
| `domains/research/domain-research-step-patterns.md` | Pack policy |
| `tests/fixtures/workflow-brief-research-sparse/S1`–`S6.json` | Golden sparse briefs |
| `tests/workflow-research-sparse-briefs.test.js` | Regression |
| `app.js` | `continueWorkflowDesignGeneration`, elicitation, `buildWorkflowBriefPlanningDisclosures`, `getWorkflowRefinementQueue`, `callOpenAIForWorkflowReview` |

---

## 17. Pack file map

| File | Role |
|------|------|
| `sprint-18-bootstrap.md` | Primary architecture bootstrap (this file) |
| `sprint-18-index.md` | Pack index |
| `GPT-BOOTSTRAP-PROMPT.md` | Fresh-chat entry + copy-paste block |
| `HANDOVER.md` | Session handover summary |
| `SPRINT-CONTEXT.md` | Focus, boundaries, verification |
| `CURRENT-STATE.md` | Active sprint pointer |
| `SPRINT-18-CHECKPOINT.md` | Slices 1–2 closeout + next candidate slices |
| `review-log.md` | Decisions and closeout log |
| `context-files/` | Portable snapshots |

---

## 18. Verification

```bash
node --test tests/*.test.js
```

| Milestone | Result |
|-----------|--------|
| Sprint 17 closeout | **85 passed**, 0 failed |
| Sprint 18 checkpoint (Slices 1–2) | **91 passed**, 0 failed |

S1–S6 sparse-brief semantics unchanged. See [`SPRINT-18-CHECKPOINT.md`](SPRINT-18-CHECKPOINT.md) for next candidate slices (3A–3C).

---

## 19. Related Sprint 17 pack

`docs/development/sprints/2026-05-15-sprint-17-research-elicitation-sparse-brief-testing/` — closed implementation handover; use for historical slice detail and original S1–S6 prep.
