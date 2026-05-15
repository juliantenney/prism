# Sprint 20 — parameterisation reflection

**Date:** 2026-05-15  
**Path:** `docs/consolidation/sprint-20-parameterisation-reflection.md`  
**Status:** Architectural reflection — **no implementation**, **no charter**.

**Related:**

| Document | Role |
|----------|------|
| [`contextual-refinement-architecture-note.md`](contextual-refinement-architecture-note.md) | Four guidance layers (Sprint 17 → 18) |
| [`sprint-20-slice-1-closeout.md`](sprint-20-slice-1-closeout.md) | Settings discoverability |
| [`sprint-20-slice-2-charter.md`](sprint-20-slice-2-charter.md) | Assumptions / provenance (charter) |
| [`sprint-19-closeout.md`](sprint-19-closeout.md) | LD rationalisation baseline |

---

## 1. Architectural transition

Sprints 18–20 did not only reduce chat in the Factory. They shifted what a PRISM workflow **is**: less a one-off generated artefact, more an **instantiated parameterised system** whose behaviour is declared in domain packs, resolved from a brief, mapped onto steps, and tuned after synthesis.

### From (implicit prior model)

| Characteristic | Symptom |
|----------------|---------|
| **AI-led conversational workflow design** | Long factor queues and post-gen refinement chat |
| **Repeated refinement questions** | Users answer the same pedagogical dimension in chat and again in profiles |
| **Hidden assumptions** | Inferred and defaulted values invisible until run time or expert inspection |
| **Opaque generated artefacts** | Step list looks final; tuning buried in Prompt Studio or notes |

### To (emerging model after Sprint 18–20)

| Characteristic | Mechanism |
|----------------|-----------|
| **Parameterised workflow systems** | `resolvedFactors` + `mappingRules` + `stepParams` shape concrete plans |
| **Inspectable resolved factors** | Source labels: explicit, elicited, inferred, default |
| **Factor → step mappings** | `mappedBindings.mapped` and provenance UI show what affects which steps |
| **Post-generation tuning through Settings** | Authoritative step configuration without re-elicitation |
| **Transparent assumptions and provenance** | Resolved brief panel explains *what* was assumed and *where* it applies |

**Carry-forward rule (unchanged):** Runtime interprets policy; domain packs declare policy. Sprint 20 makes that contract **visible** in the Factory UI.

### User journey (target state)

```text
1. Lightweight brief
2. Concrete workflow synthesis
3. Inspect assumptions and provenance
4. Understand which values affect which steps
5. Tune behaviour through Settings
6. Iterate without re-elicitation
```

This replaces the older loop of “answer more questions until the model stops asking.”

---

## 2. Why Sprint 20 matters

Sprint 19 proved that **pack policy** can reduce noise while keeping safety. Sprint 20 addresses the **visibility gap** that policy change created: when chat drops, users still need to see **what was decided** and **where to change it**.

| Slice | Contribution | Effect on the parameterisation story |
|-------|--------------|--------------------------------------|
| **Sprint 20-1** — Settings discoverability | Badges, summaries, planning → Settings navigation | Surfaces that workflows are **tunable systems**, not frozen outputs |
| **Sprint 20-2** — Assumptions / provenance | Source-labelled factors, step relevance from mappings | Surfaces that workflows are **instantiated from parameters**, not opaque AI guesses |

Together, 20-1 and 20-2 do not add a new elicitation layer. They expose an architecture that was already present in runtime and packs:

- **Trust** — users see inferred vs explicit vs default.  
- **Controllability** — Settings remain authoritative; provenance explains what Settings will change.  
- **Reusability** — the same brief + factor resolution pattern can support variants without re-asking every dimension in chat.

Sprint 20’s programme thesis still holds: *Generate with minimal questions; then clearly expose assumptions and tuning affordances afterward.* Parameterisation is the structural reading of that thesis.

---

## 3. Outstanding issue: are the right parameters exposed?

PRISM now has a credible **mechanism** to expose parameters (factors, mappings, Settings, provenance). The next product and design question is **judgement**: whether the parameters users can see and tune are the ones that actually matter for their decisions.

A parameter deserves Factory exposure when it is:

| Criterion | Question |
|-----------|----------|
| **Pedagogically meaningful** | Does changing it alter learning intent or experience in a way authors care about? |
| **Understandable** | Can a non-expert name what they are choosing without reading implementation docs? |
| **Decision-relevant** | Would a reasonable author want to decide this before or after seeing the plan? |
| **Visibly impactful** | Does a change show up in step behaviour, outputs, or adequacy signals? |
| **Safe to tune** | Can the user adjust it without breaking safety gates or contract assumptions? |

### Examples of strong parameters (especially Learning Design)

| Parameter (illustrative) | Why it tends to qualify |
|--------------------------|-------------------------|
| Assessment type | Shapes entire assessment pack behaviour |
| Assessment item count | Directly affects workload and coverage |
| Feedback strategy | Formative vs summative intent is author-facing |
| Tone / register | Affects page and activity voice |
| Difficulty / depth | Pedagogically salient for audience fit |
| Scaffolding intensity | Activity design and support level |
| Learner level | Audience and complexity alignment |
| Collaboration mode | Workflow shape (individual vs group) |
| Formative / summative intent | Stakes and feedback expectations |
| Authenticity level | Real-world vs simplified framing |
| Include examples | Concrete materials vs abstract exposition |

These align with factors and `stepParams` already common in LD packs and Settings.

### Examples of weak parameters

| Kind | Why to deprioritise or hide |
|------|---------------------------|
| Internal routing flags | Meaningful to runtime, not to authors |
| Implementation details | e.g. composition modes visible only for engine correctness |
| Duplicate aliases | Same decision exposed under two names (confuses provenance) |
| Low-impact values | Changing them does not materially change outputs |
| Values users cannot confidently judge | Authors guess or ignore; drives distrust |

Sprint 20-1 and 20-2 **surface what the pack and runtime already expose**. They do **not** decide whether that set is pedagogically complete. That is a separate curation problem.

---

## 4. Domain pack responsibility

As Factory runtime becomes more **generic** (shared interpreters for essentials, adequacy, mapping, disclosure), **domain packs** carry more of the semantic weight.

Packs increasingly define:

| Responsibility | Pack artefacts (illustrative) |
|----------------|-------------------------------|
| **What factors exist** | `requiredFactors`, `optionalFactors`, `refinementFactors` |
| **What can be inferred** | `inferenceRules`, `triggerRules` |
| **What can be explained** | Factor labels, `plainEnglish`, disclosure copy |
| **What can be tuned** | `mappingRules` → `stepParams`, `promptFactory.userOptions` |
| **Which pedagogical dimensions are controllable** | Profiles, intent classes, step patterns |

### Packs as evolving contracts

Domain packs are moving from “step pattern libraries” toward:

| Role | Description |
|------|-------------|
| **Policy definitions** | Validation, conflict, adequacy, disclosure |
| **Parameter schemas** | Factors + defaults + inference boundaries |
| **Workflow configuration contracts** | What a synthesized workflow instance may contain |
| **Domain-specific pedagogical models** | Which dimensions are essential vs tunable vs advisory |

Runtime’s job is to **interpret** these contracts consistently. Sprint 20’s job was to **render** them legibly. Future work must **curate** them.

---

## 5. Future audit direction (post–Sprint 20)

This reflection recommends a **pack-centred audit programme** after Sprint 20 UX slices stabilise. It is not part of Sprint 20 implementation scope.

### Audit goals

| Goal | Intent |
|------|--------|
| **Factor coverage by domain** | Map factors to pedagogical dimensions; find gaps and orphans |
| **Pedagogical significance** | Score exposed parameters against §3 criteria |
| **Mapping completeness** | Every salient factor should map to workflow or step semantics where relevant |
| **Hidden but important decisions** | Decisions buried only in synthesis prompts or heuristics |
| **Prune low-value controls** | Reduce noise in Settings and provenance |
| **Clarify domain semantics** | Shared vocabulary across factors, Settings labels, and adequacy copy |

### Learning Design — candidate audit areas

| Area | Example questions |
|------|-------------------|
| Feedback strategy | Is formative/summative intent one factor or several? |
| Scaffolding intensity | Exposed in activities vs only in narrative synthesis? |
| Collaboration mode | Factor vs adequacy-only signal? |
| Learner autonomy | Distinct from delivery mode and page profile? |
| Authenticity | Author-facing or internal only? |
| Assessment stakes | High-stakes vs practice — mapped to steps? |
| Reflection depth | Emergent in synthesis vs explicit parameter? |
| Adaptive support | Tunable or out of scope for v1 parameterisation? |

Research domain audits would follow the same method but respect **frozen fixture** policy unless explicitly chartered.

---

## 6. Relationship to Sprint 20 scope

| This document | Sprint 20 implementation |
|---------------|---------------------------|
| Reflection and guidance | Charters, closeouts, UI slices |
| No code changes proposed | 20-1 and 20-2 shipped UI-only hooks |
| Does not require 20-2 to solve parameter curation | 20-2 explains existing `resolvedState`; it does not add factors |
| Informs **future** pack audits or later slices | e.g. 20-3 adequacy UX; post–Sprint 20 LD parameter audit |

Sprint 20-2 closeout and tests should be read as **provenance rendering complete**, not as **parameter set validated**.

---

## 7. Closing insight

Sprints 18–20 establish a coherent model for Factory workflows:

| Layer | Role |
|-------|------|
| **Essentials** | Ensure minimum viability — blocking when unsafe or incomplete |
| **Synthesis** | Create concrete structure — the workflow instance |
| **Adequacy** | Advise on fit — non-blocking, pack-authored |
| **Provenance** | Explain assumptions and factor → step influence |
| **Settings** | Tune execution — authoritative, persistent on steps |

That stack marks a transition from **conversational workflow assembly** toward **transparent, parameterised workflow systems**. The remaining work is not primarily “more UI”; it is **better parameters** in domain packs — chosen, mapped, and labelled so that explainability and Settings discoverability point at decisions authors actually want to make.

---

## Review log

- **2026-05-15** — Initial reflection note (post Slice 20-2 planning / implementation).
