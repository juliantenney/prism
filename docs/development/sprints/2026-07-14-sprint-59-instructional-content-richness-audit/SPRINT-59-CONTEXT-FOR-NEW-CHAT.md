# Sprint 59 — Context for New Chat

**Document role:** Compact architecture and handover **facts** for a fresh conversation.  
**Not** the authoritative scope document — see [README.md](README.md).  
**Reading order:** [SPRINT-59-START-HERE.md](SPRINT-59-START-HERE.md).

**Sprint status:** In progress — Priority-1 MVP validated for mechanism + process; mental-model transfer not started  
**Updated:** 2026-07-15

---

## Locked conclusion

| Claim | Status |
| ----- | ------ |
| Quality variation driven by **instructional-archetype support asymmetry** | Accepted |
| Secondary: **domain exemplar bias** | Accepted |
| Biology-specific GAM routing / path divergence | Rejected (no evidence) |
| Material type = instructional archetype | Rejected — keep separate |

See [instructional-archetype-audit.md](instructional-archetype-audit.md).

---

## Milestone status (2026-07-15)

| Component | Status |
| --------- | ------ |
| DLA contract generation | **PASS** |
| Contract persistence | **PASS** |
| Archetype routing | **PASS** |
| GAM Copy delivery | **PASS** |
| Runtime verification | **PASS** |
| Mechanism transfer test | **PASS** |
| Process transfer test | **PASS** |
| Mental model validation | **NOT STARTED** |

---

## Architecture

Instructional archetypes are an **independent instructional dimension**.

Current Priority-1 archetypes:

```text
mechanism_explanation   → PASS (transfer validated)
process_walkthrough     → PASS (transfer validated; rule v20260715-4)
mental_model_building   → NOT STARTED (routing present; transfer not run)
```

Pipeline (unchanged):

```text
LO
→ EP shell
→ DLA partial
→ GAM partial
→ Assessment
→ LS partial
→ DP synthesis
→ deterministic assembly
→ render
```

Instructional intent is transmitted through archetype contracts on DLA `required_materials` (`instructional_archetype` + `archetype_plan`). Material type and instructional archetype remain independent.

**Facts (Sprint 58 baseline — do not reopen):**

- Partial mode requires `pageEnrichmentV2` + `partialPageOutputs`.
- Post-EP prompts use Copilot conversation context; PRISM does not embed fenced upstream page JSON in partial mode.
- Design Page owns `page_synthesis`; `sections[]` is optional dual-read only.
- Compose contract is **rollback/legacy only**.
- Assembly is deterministic; renderer is presentation only.

---

## Mechanism archetype — PASS

Validated fixture (enzymes A2-M1):

```json
{
  "instructional_archetype": "mechanism_explanation",
  "archetype_plan": {
    "start": "temperature increases within and beyond the enzyme's stable range",
    "outcome": "reaction rate first increases and then decreases",
    "required_links": [
      "molecular kinetic energy and collision frequency",
      "enzyme-substrate complex formation",
      "disruption of enzyme structure at high temperature"
    ]
  }
}
```

Validated behaviour: `required_link` → realised causal transition → `outcome`.

---

## Process archetype — PASS

Validated fixture (enzymes A4-M1):

```json
{
  "instructional_archetype": "process_walkthrough",
  "archetype_plan": {
    "process_goal": "interpret an enzyme reaction-rate investigation",
    "stages": [
      "identify the manipulated condition and measured outcome",
      "inspect the pattern across observations",
      "connect the pattern to enzyme behaviour",
      "form a bounded conclusion"
    ]
  }
}
```

Final validated rule version: **`20260715-4`**.

Validated behaviour: stage → reasoning performed → finding produced → finding transferred → conclusion.

### Critical delivery-path discovery

Earlier “process rule failed” observations were often **invalid tests**: the `v20260715-4` process rule never reached the GAM Copy prompt.

Root cause:

```text
outer GAM recognition used shaped context (stepTitle / stepCanonicalStepId)
inner routing used raw step context (title / canonical_step_id)

outer gate = true
inner gate = false
→ routing skipped
```

The process rule itself was not the failure. The **delivery path** was.

Fixed via `buildWorkflowStepRecognitionContext(...)` and unified recognition across:

```text
GAM recognition
archetype routing
snapshot publication
```

Live snapshots (`window.__PRISM_S59_FINAL_GAM_PROMPT`) confirmed the process rule reaches the exact clipboard-bound string.

---

## Runtime verification (cache-bust)

```text
lib/ld-instructional-archetype.js?v=20260715-4
lib/workflow-step-recognition-context.js?v=20260715-s59-gam-ctx-1
app.js?v=20260715-s59-gam-ctx-1
```

Hard-reload before re-running manual gates. See [artefacts/enzymes-archetype-mvp/MANUAL-PROCESS-TEST.md](artefacts/enzymes-archetype-mvp/MANUAL-PROCESS-TEST.md).

---

## Ownership

| Owner | Owns |
| ----- | ---- |
| Episode Plan (EP) | Page shell |
| DLA | `activities[]` instructional fields + optional archetype planning on `required_materials` |
| GAM | `activities[].materials[]` + conditional archetype routing on Copy |
| Assessment | Assessment design **and** generated assessment items (review separately) |
| Learning Sequence (LS) | Sequence |
| Design Page (DP) | `page_synthesis` |
| Assembly | Deterministic merge |
| Renderer | Presentation only |

---

## Sprint 58 closure (complete)

Sprint 58 is **closed** (2026-07-14). Report: [SPRINT-58-CLOSURE.md](../2026-07-09-sprint-58-partial-page-artefact-architecture-implementation/SPRINT-58-CLOSURE.md).

| SHA | Role |
| --- | ---- |
| `d5e8fbd` | Stabilisation |
| `4fb4c09` | Phase 0 partial DP contract |
| `12a447a` | Phase 1 domain §13 alignment |
| `961ba2f` | Flag preservation |
| `adbf43a` | Closure documentation |

---

## Sprint 59 progress summary

| Phase | Outcome |
| ----- | ------- |
| First audit (FA-01…03) | Class A thin GAM pattern; DLA richer than materials |
| Constraint audit | Soft GAM depth vs hard DLA scaffolds; v2 presence-only bodies |
| Iterations 1–7 | DEPTH contract; causal/anti-gaming/anti-leakage |
| Heteroscedasticity run | Success on diagnostic / evaluate archetypes |
| Enzymes run | Weak mechanism / process / concept teaching (pre-MVP) |
| Archetype audit | → Framework workstream |
| MVP routing + DLA emission | Done |
| Mechanism transfer | **PASS** |
| Process transfer + Copy delivery fix | **PASS** (rule `v20260715-4`) |
| Mental model transfer | **NOT STARTED** |

Runtime touched: `lib/ld-instructional-archetype.js`, `lib/workflow-step-recognition-context.js`, `app.js` (recognition + Copy snapshot), GAM depth / pack notes, `lib/page-shell-create.js` (`alignEpisodePlansActivityIds`), related contracts/tests.

---

## Material type vs instructional archetype

| Material types (examples) | Instructional archetypes (examples) |
| ------------------------- | ----------------------------------- |
| text, worked_example, scenario, checklist, decision_table, modelling_note, template, prompt_set | mechanism_explanation, evaluation, transfer, process_walkthrough, … |

Presentation format ≠ pedagogical function.

---

## Deferred (not current priority)

Renderer redesign · hard validators without archetype definitions · compose shrink · legacy removal · Sprint 60

---

## First actions for new chat

1. Read [next-chat-briefing.md](next-chat-briefing.md)  
2. Treat mechanism + process MVP transfer as **done**; next Priority-1 gap is **`mental_model_building`**  
3. Do not re-litigate the process-rule wording (`v20260715-4`) or the recognition-context fix unless new evidence appears  
4. Implement/design without regressing Evaluate/diagnostic support
