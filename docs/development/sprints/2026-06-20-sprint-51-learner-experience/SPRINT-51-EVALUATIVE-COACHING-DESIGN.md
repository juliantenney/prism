# Sprint 51 — Evaluative Coaching Design

**Mode:** Design only — no implementation in this document  
**Predecessor:** [SPRINT-51-ANNOTATED-MODELS-PHASE-1-IMPLEMENTATION-REPORT.md](./SPRINT-51-ANNOTATED-MODELS-PHASE-1-IMPLEMENTATION-REPORT.md)  
**Problem:** Learners can see why expert models are strong, but receive limited support for evaluating and improving **their own** work.  
**Constraint:** No workflow redesign, no new stages, prefer generation-layer solutions and existing material structures.

---

# Current State

## What Phase 1 delivered

Annotated Models Phase 1 (SP-06 / SP-07 + PEL reinforcement) strengthened **expert-outward** commentary on models:

| Material | Subsection | Instructional job |
| -------- | ---------- | ----------------- |
| `sample_output` | `## Why this works` | Explains disciplinary strengths of the exemplar |
| `worked_example` | `## What experts notice` | Exposes expert reasoning moves and novice blind spots on the **model** |
| Judgement materials | `## A weaker response would` / `## A stronger response would` | Comparative quality discrimination between **exemplar responses** |

Fresh Marx validation confirms these sections can appear in GAM bodies and render through the existing Sprint 50 grammar (**Read and model** / **Check your work**) as plain markdown.

## Pipeline (unchanged)

```
DLA required_materials[] + cognition fields
  → GAM activity_materials (markdown bodies)
  → Design Page compose → page.json materials.*
  → Renderer instructional grammar (Orient → Think → Study → Explain → Do → Check → Reflect → Transfer)
```

All evaluative coaching must continue to live in **existing fields** — primarily `materials.checklist`, `materials.prompt_set`, judgement materials, and activity-row `support_note` / `self_explanation_prompt`.

## Existing evaluative structures

| Structure | Grammar placement | Current evaluative job | Self-regulation strength |
| --------- | ----------------- | ---------------------- | ------------------------ |
| **`checklist`** | **Check your work** | SP-05: ≥4 criteria-linked checks + `### If any check is not met:` revise block | **Moderate** — verifies criteria; revision guidance often generic or absent in corpus |
| **`prompt_set`** | **What to do** (Do bucket) | PEL: self-check bullets with repair-if-fail when DLA lists `prompt_set` | **Variable** — often thin or absent; not a dedicated SP pattern |
| **`worked_judgement_weak_strong` / judgement `modelling_note`** | **Read and model** | Weak vs strong **exemplar** contrast; fidelity markers `weak_worked_judgement` / `strong_worked_judgement` | **Strong for discrimination** — compares **responses**, not learner's draft |
| **`sample_output` + Phase 1 annotation** | Study or Check | `## Why this works` — quality of **model** | **Indirect** — learner must transfer criteria to own work unaided |
| **`support_note`** | **Watch for this mistake** | Single misconception guard (`Check your thinking:`) | **Reactive** — one error pattern, no revision path |
| **`self_explanation_prompt`** | **Explain before you check** | Elicits learner articulation before consulting model | **Metacognitive** — monitors reasoning, does not diagnose weakness |
| **`expected_output`** | Inside **Check your work** | Deliverable shape spec | **Structural** — what to produce, not how to judge quality |
| **`decision_table` exemplar row** | Do / Study | One strong row models evidence → reasoning | **Implicit** — learner infers quality from populated cells |
| **`misconception_note`** | Would be generic material | 44-2 contract type | **Not runtime-registered** — unused in Marx corpora |

## Corpus evidence (Marx inflation self-study)

Post–Phase 1 prompt contracts exist, but **Check-bucket coaching remains thin** in composed output:

| Activity | Study / model quality | Check / self-eval quality |
| -------- | --------------------- | ------------------------- |
| A3 (evaluate scenario) | Worked example with steps; checklist **embedded inside** worked example body | `evaluation_checklist` is four stub bullets without SP-05 revise block or mistake diagnosis |
| A2 | Tasks reference modelling note | **modelling_note body absent** from `page.json` despite DLA obligation |
| A4 | Decision table exemplar row | Checklist / weak–strong judgement often missing or thin |
| Row fields | `self_explanation_prompt` present on several activities | Prompts elicit explanation but do not name weak patterns or remediation moves |

**Architectural conclusion:** The self-regulation gap is **not** missing renderer sections or schema fields. Sprint 50 grammar already surfaces **Check your work**, **Explain before you check**, and **Watch for this mistake**. The gap is **generation coverage and convention** for learner-owned evaluative coaching — symmetric to the pre–Phase 1 annotated-models gap.

## Instructional asymmetry (design anchor)

| Direction | Phase 1 (complete) | This design (target) |
| --------- | ------------------ | -------------------- |
| Expert → learner | Why the **model** is strong | — |
| Learner → self | — | How to recognise **weak own work**, diagnose errors, and revise |

Phase 1 exports expert discrimination. Evaluative coaching must **import** that discrimination into the learner's self-check and revision loop.

---

# Observed Learner Gap

After Phase 1, a learner can answer:

- *What does strong work look like?* — via worked examples and sample outputs  
- *Why is that example effective?* — via `## Why this works` and `## What experts notice`

They still struggle to answer:

| Learner need | Current support | Gap |
| ------------ | --------------- | --- |
| **Recognising weak work** | `support_note` (one guard); weak/strong exemplars when generated | No systematic weak-pattern catalogue tied to **their** deliverable |
| **Diagnosing mistakes** | Checklist items sometimes name criteria | Items often completion-shaped; no “if you wrote X, the weakness is Y” discrimination |
| **Judging quality differences** | Weak/strong exemplar contrast in Study | Contrast rarely bridges to learner's draft; sample_output annotation does not say “your work lacks this if…” |
| **Deciding how to improve** | SP-05 `### If any check is not met:` | Often missing, generic, or not tied to named mistake categories |
| **Monitoring own reasoning** | `self_explanation_prompt` | Elicits prose; does not supply discriminative probes or repair cues |

**Sprint 51 charter alignment:** This is an **inference burden** and **instructional coaching quality** issue — learners must still infer how model-quality criteria apply to their own incomplete or weak responses.

**Success criterion (this design):** A learner should be able not only to see a strong example, but also to **recognise weaknesses in their own work** and **understand how to improve it**.

---

# Candidate Approaches

## A. Checklist evaluative coaching (SP-05 extension) — recommended primary

**Idea:** Extend SP-05 so every `checklist` body includes discriminative weak-pattern coaching and specific revision moves, not only criteria retrieval.

| Subsection | Content |
| ---------- | ------- |
| Existing SP-05 checks | ≥4 `Have you / Did you` items tied to `expected_output` |
| **`## Common mistakes`** | 2–4 novice traps or weak-response shapes for this task (label-only, mechanism missing, evidence-free judgement, etc.) |
| **`### If any check is not met:`** | Remediation tied to mistake categories — what to add, re-read, or restructure |

**Representation:** Inline markdown in `materials.checklist` — already routed to **Check your work**.

| Pros | Cons |
| ---- | ---- |
| Smallest diff; uses highest-salience self-regulation section | Only applies when DLA lists `checklist` |
| Complements Phase 1 without duplicating model commentary | Checklist bodies may grow long |
| Directly serves revise/improve loop | LLM may still emit thin lists |

---

## B. Self-check `prompt_set` pattern (PEL / new SP block)

**Idea:** When DLA lists `prompt_set`, require discriminative **If your … / When your …** bullets that expose weak reasoning without giving answers.

Example shape:

```markdown
## Self-check your reasoning
- If your classification names a cause but not the mechanism linking agents, revisit the scenario evidence column.
- If your justification could apply to any inflation case, add one scenario-specific detail.
```

**Representation:** `materials.prompt_set` in Do bucket — learner sees during production, before Check.

| Pros | Cons |
| ---- | ---- |
| Supports monitoring **during** task execution | Do-bucket placement — lower salience than Check |
| Aligns with Sprint 35 embedded-feedback conventions | `prompt_set` not present on all activities |
| No schema change | Overlaps with checklist if both present |

---

## C. Draft-audit bridge on `sample_output` (SP-07 extension)

**Idea:** After `## Why this works`, add `## Use this to judge your draft` with 2–3 comparative prompts mapping model strengths to learner self-audit (not answer keys).

| Pros | Cons |
| ---- | ---- |
| Closes loop between Study model and Check | Only when `sample_output` exists |
| Leverages Phase 1 annotation vocabulary | Risk of duplicating checklist content |
| Keeps coaching near the exemplar | Post-check `sample_output` placement may bury bridge |

---

## D. Reinforced weak/strong on all evaluative arcs

**Idea:** Mandate `## A weaker response would` / `## A stronger response would` whenever DLA `purpose` matches evaluate / judgement / verification — not only `worked_judgement` materials.

| Pros | Cons |
| ---- | ---- |
| Strongest discrimination pattern already in architecture | Compares **responses**, not learner draft |
| Fidelity markers exist | Does not alone teach self-revision |
| Phase 1 PEL line partially does this | Coverage depends on DLA listing judgement materials |

**Verdict:** **Complement** A/B — not sufficient alone for self-regulation.

---

## E. Activity-row coaching expansion (`support_note`, `expected_output`)

**Idea:** Put weak-pattern lists in `support_note` or expand `expected_output` with quality discrimination prose.

| Pros | Cons |
| ---- | ---- |
| Always visible on activity card | **Wrong semantics** — blurs guard/deliverable spec with coaching body |
| No GAM material dependency | `support_note` capped at 1–2 sentences in rhetoric contract |
| | Sprint 50 already partitions row fields vs materials |

**Rejected as primary** — keep `support_note` as one sharp guard; coaching belongs in Check materials.

---

## F. New material type (`misconception_note`, `quality_criteria`, `rubric`)

**Idea:** Introduce dedicated types for evaluative coaching.

| Pros | Cons |
| ---- | ---- |
| Clean semantic separation | **Violates constraint** — contract types not in role registry; implies schema/DLA work |
| | Disproportionate to problem when markdown subsections work |

**Rejected** for Sprint 51.

---

## G. Renderer salience for Check coaching (Phase 2)

**Idea:** Wrap recognised headings (`Common mistakes`, `If any check is not met`, `Self-check your reasoning`) in `util-evaluative-coaching` callout inside **Check your work**.

| Pros | Cons |
| ---- | ---- |
| Improves visibility without new fields | Renderer change — defer until generation verified |
| Mirrors optional Phase 2 for annotated models | Heading vocabulary must stay stable |

**Deferred** — optional after GAM conventions proven.

---

## H. DLA obligation expansion

**Idea:** Require every evaluate-beat activity to list `checklist` + `prompt_set` in DLA.

| Pros | Cons |
| ---- | ---- |
| Increases material presence | **DLA layer change** — user prefers generation-first |
| | Does not fix thin bodies when obligations exist (Marx A3) |

**Rejected as primary** — tighten GAM contracts first; DLA hints optional later.

---

# Recommended Approach

**Two-layer, generation-only Phase 1** — mirror Annotated Models Phase 1 pattern.

## Principle

> **Export expert discrimination in Study (Phase 1); import it into self-regulation in Check and Do (this design).**

Commentary stays inside existing `materials.*` markdown. No workflow stages, no `page.json` schema changes, no compose or renderer changes in the MVP slice.

## Layer 1 — SP-05 extension (primary, mandatory when `checklist` emitted)

Extend `lib/instructional-pattern-prompt.js` SP-05:

| Requirement | Detail |
| ----------- | ------ |
| **`## Common mistakes`** | 2–4 bullets naming weak response **shapes** or novice traps tied to `learner_task` / `expected_output` — not generic “be clear” |
| **Discriminative checks** | Retain ≥4 criteria-linked items; at least one must discriminate strong vs weak reasoning (not row completion only) |
| **`### If any check is not met:`** | Specific remediation: what to add, re-read, or restructure — map to mistake categories |
| **Instructional fail** | **FM-13** (new): checklist without `## Common mistakes` or without substantive revise block — do not emit |
| **FORBIDDEN** | “Revise until correct”; “check your work”; reflection-only lists; mistake bullets that only restate checklist items |

**GOOD shape example** should mirror Marx A3 evaluate arc (inflation classification / evidence-based judgement).

## Layer 2 — `prompt_set` self-check contract (secondary, when material type present)

Extend `buildSelfDirectedGamPelReasoningMaterialPromptBlock()` in `app.js` (or add **SP-08** if pattern-library parity desired):

| Requirement | Detail |
| ----------- | ------ |
| Heading | `## Self-check your reasoning` |
| Bullets | 2–4 **If / When your …** discriminative probes |
| Content | Names weak pattern → points to evidence or criterion to revisit — **no answer keys** |
| Fail | Thin generic bullets (“make sure you explained”) — treat as instructional fail when `prompt_set` purpose is self-check |

Optional **SP-07 extension (Phase 1b):** `## Use this to judge your draft` on `sample_output` — only if checklist absent and sample is post-check; avoid duplicating Layer 1.

## Layer 3 — Reinforce existing weak/strong (no new pattern)

Strengthen PEL line already added in Phase 1:

- When `purpose` matches evaluate / evaluative judgement / verification, **require** weak/strong sections if `modelling_note` or judgement `worked_example` is listed.
- Align heading vocabulary with Phase 1: `## A weaker response would` / `## A stronger response would`.

## What not to change

| Item | Rationale |
| ---- | --------- |
| `self_explanation_prompt` semantics | Elicitation field — keep generative; do not turn into coaching dump |
| `expected_output` | Deliverable spec — not coaching body |
| `support_note` | Single guard — reactive mistake only |
| Workflow / DLA schema | Generation-first per constraint |
| Renderer | Phase 2 optional salience only |

## Grammar interaction (no changes required)

| Coaching content | Renders in |
| ---------------- | ---------- |
| `checklist` + extensions | **Check your work** (`util-checklist-block`) |
| `prompt_set` | **What to do** |
| Weak/strong / sample audit | **Read and model** or **Check** (partition rules unchanged) |
| `support_note` | **Watch for this mistake** |

Learner journey: Study strong model + why → Do task with self-check probes → Explain (optional) → Check with mistake catalogue + revise guidance.

---

# Example Before/After

*Synthetic example based on Marx Activity 3 (evaluate inflation scenario). Domain: inflation classification.*

## Before (current corpus pattern)

**Read and model — worked example (embedded checklist):**

```markdown
In 2023, rising global commodity prices combined with strong consumer demand led to inflation.

*Step 1:* Identify price pressures.
*Step 2:* Examine affected agents.
*Step 3:* Classify inflation cause(s).

Checklist:
- Have you identified all relevant price pressures?
- Have you considered the role of wages?
- Have you justified your classification with evidence?
```

**Check your work — evaluation_checklist:**

```markdown
- Identify price pressures
- Assess economic agents affected
- Provide evidence-based classification
- Reflect on uncertainties
```

**Learner experience:** Sees a model sequence and a bullet list. Cannot reliably distinguish a weak draft from a strong one, or know **what to change** when a check fails.

---

## After (evaluative coaching target)

**Read and model — worked example** (Phase 1 shape, checklist **not** embedded in model):

```markdown
**Step 1:** Separate demand-led from cost-led pressures using scenario prices and wages.
**Step 2:** Map which agents gain or lose under each pressure.
**Step 3:** Classify with a mechanism statement, not a label alone.

## What experts notice
- Strong analysis names the transmission mechanism, not only "demand-pull" or "cost-push".
- Novices list agents without explaining how the pressure reaches prices.

**Bridge:** Apply the same sequence to your assigned scenario — do not copy this conclusion.
```

**What to do — prompt_set (during task):**

```markdown
## Self-check your reasoning
- If your classification uses only a single label, add one sentence naming the mechanism from scenario evidence.
- If your agent impacts could apply to any inflation case, anchor one claim to a specific detail in this scenario.
- If you treated wage rises as only cost-push, check whether demand conditions also shifted.
```

**Check your work — checklist (SP-05 + coaching):**

```markdown
Use this to evaluate your evaluation report:

• Have you linked each price pressure to a specific agent and transmission mechanism?
• Have you cited at least one scenario detail per major claim?
• Have you addressed whether multiple causes interact, not only a single label?
• Have you stated what remains uncertain rather than forcing false precision?

## Common mistakes
- Label-only classification ("it's demand-pull") with no mechanism or evidence.
- Listing affected agents without explaining how the pressure reaches them.
- Treating cost-push and demand-pull as mutually exclusive when the scenario shows both.
- Generic justification that could fit any inflation case.

### If any check is not met:
Revise your report by (1) adding a mechanism sentence for each classification, (2) quoting one scenario detail per claim, and (3) naming one genuine uncertainty you still hold.
```

**Learner experience:** Can compare draft to named weak shapes, discriminate quality, and execute a concrete revision plan — without receiving a model answer to copy.

---

# Files Affected

## Phase 1 — GAM evaluative coaching (smallest viable slice)

| File | Change |
| ---- | ------ |
| `lib/instructional-pattern-prompt.js` | Extend `SP05_LINES` with `## Common mistakes`, FM-13, strengthened GOOD shape and FORBIDDEN floors |
| `app.js` | Extend `buildSelfDirectedGamPelReasoningMaterialPromptBlock()` — `prompt_set` self-check heading and discriminative bullet rules; optional cross-ref forbidding checklist inside `worked_example` |
| `tests/workflow-instructional-pattern-prompt.test.js` | SP-05 extension assertions; FM-13; GOOD shape includes Common mistakes + revise block |
| `tests/sprint-51-evaluative-coaching-generation.test.js` | **New** — SP-05 coaching contract, PEL prompt_set block, example body shapes |

## Phase 1b — Optional sample-output bridge

| File | Change |
| ---- | ------ |
| `lib/instructional-pattern-prompt.js` | SP-07 optional `## Use this to judge your draft` when checklist absent |
| `tests/sprint-51-evaluative-coaching-generation.test.js` | Bridge subsection tests |

## Phase 2 — Renderer salience (optional, after verification)

| File | Change |
| ---- | ------ |
| `lib/ld-model-commentary-render.js` or sibling | Wrap Check coaching headings in `util-evaluative-coaching` |
| `app.js` | Invoke from checklist / material HTML path |
| `tests/sprint-51-evaluative-coaching-render.test.js` | **New** — wrapper + grammar placement |

**Not affected:** workflow stages, DLA OUTPUT CONTRACT, `page.json` schema, compose merge, episode plan, ontology, instructional grammar section order.

---

# Risks

| Risk | Likelihood | Mitigation |
| ---- | ---------- | ---------- |
| **Overlap with Phase 1 `What experts notice`** | Medium | Study = expert on **model**; Check = weak shapes on **learner deliverable** — distinct headings and prompt FORBIDDEN overlap |
| **Checklist bloat** | Medium | Cap mistake bullets at 4; require concise remediation paragraph |
| **Duplication checklist ↔ prompt_set** | Medium | prompt_set = during-task probes; checklist = post-task verification + revise — prompt may forbid repeating identical bullets |
| **DLA does not list checklist** | High on some activities | Phase 1b sample bridge; later optional DLA hint — not MVP blocker |
| **Model non-compliance** | Medium | FM-13 fail language; Marx re-run verification |
| **Embedded checklist in worked_example** | Observed in Marx A3 | PEL line: forbid checklist inside `worked_example`; realise verification as separate `checklist` material |
| **Generic coaching creep** | Medium | FORBIDDEN floors mirroring Phase 1 (clear, detailed, well structured without disciplinary move) |

---

# Smallest Viable Slice

**Ship Layer 1 only first** — SP-05 extension with `## Common mistakes` + substantive `### If any check is not met:` + FM-13.

| In scope | Out of scope (defer) |
| -------- | -------------------- |
| `lib/instructional-pattern-prompt.js` SP-05 extension | Renderer callouts |
| PEL one-liner: do not embed checklist in `worked_example` | SP-07 draft-audit bridge |
| Tests for SP-05 coaching shape | `prompt_set` SP-08 block (Layer 2 — next PR if Layer 1 verifies) |
| Marx verification: Check section inspect | DLA obligation changes |

**Estimated diff:** ~80–120 lines prompt + tests — comparable to Annotated Models Phase 1.

**Verification:** Fresh Marx run → composed `page.json` → confirm evaluate activities have standalone `checklist` bodies with `## Common mistakes` and revise guidance; **Check your work** in `page.html` shows coaching without grammar changes.

**Success criterion:** Learner completing an evaluate activity can name at least one weak pattern their draft might exhibit and one concrete revision move — from Check materials alone, without inferring from the model commentary.

---

*Design v1 — generation-layer evaluative coaching; no implementation in this document.*
