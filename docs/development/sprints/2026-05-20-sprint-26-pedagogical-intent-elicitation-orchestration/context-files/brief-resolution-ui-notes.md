# Brief resolution UI — notes

**Authoritative:** `app.js` — Factory workflow brief / elicitation UI  
**Why it matters:** Educators trust **resolved assumptions**; weak activity signalling here correlates with wrong topology.

---

## Surfaces

| Surface | Purpose |
|---------|---------|
| Workflow brief form | User-authored goal, inputs, desired outputs, audience |
| Resolved assumptions panel | Shows merged factors after `resolveWorkflowBriefFactors` |
| Elicitation Q&A | Asks for required missing factors (`maxDefaultQuestions` from pack) |
| Refinement pass | Post-workflow optional factors (assessment-heavy in LD) |

---

## What users see today (typical)

- Factor labels from pack `workflowBriefConfig.essentialFactors` / `refinementFactors`
- Source hints: explicit vs inferred vs default (where implemented)
- **Assessment** factors often visible (`assessment_required`, `assessment_type`)
- **Activity intent** may appear only as **free text** in goal — not as a dedicated resolved factor

**26-5 scope (future):** clearer language when activity steps omitted despite brief phrasing; confidence / ambiguity display.

---

## Investigation notes for 26-1

| UI question | Code search target |
|-------------|-------------------|
| Which factors are required before generate? | `getRequiredWorkflowBriefFactorIds`, pack config |
| When is elicitation skipped? | `workflowBriefElicitation` state machine |
| Are domain extras shown? | `domainExtraValues` on brief base object |

---

## Related Sprint 23 doctrine

Elicitation **initialises structured state**; Settings own operational params; prose brief is **provenance**, not sole authority — but topology still **reads** prose via extract + heuristics.

If extract/heuristics under-read activity phrases, UI can look "correct" while topology is wrong.

---

## 26-1 capture

Screenshot or copy **resolved panel JSON** from RNA run into `resolved-brief-screenshot-notes.md` table.
