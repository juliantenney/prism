# Sprint 56B — Current State Handover

**Purpose:** Primary entry point for new ChatGPT sessions, new Cursor sessions, future developers, and sprint reviews.  
**Audience:** Readers with **no** prior participation in Sprint 56, 56A, or 56B.  
**Date:** 2026-07-06  
**Sprint folder:** `docs/development/sprints/2026-07-06-sprint-56b-design-page-migration-planning/`

---

## 1. Current status

```
Sprint 56
Status: Complete

Sprint 56A
Status: Closed

Sprint 56B
Status: Active

Sprint 57
Status: Deferred Pending 56B Outcomes
```

| Sprint | Folder | Role |
| ------ | ------ | ---- |
| **56** | [2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation](../2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/) | Closed architecture review programme; DLA/GAM/Design Page audits; remediation |
| **56A** | [2026-07-06-sprint-56a-design-page-simplification-planning](../2026-07-06-sprint-56a-design-page-simplification-planning/) | Closed — evidence base (frozen) |
| **56B** | This folder | Active — decisions, approval, implementation plan |
| **57** | [2026-07-01-sprint-57-learner-experience-product-quality](../2026-07-01-sprint-57-learner-experience-product-quality/) | Prepared; deferred until 56B records impact decision (OQ-23) |

**Implementation policy:** No prompt, code, or workflow changes until [SPRINT-56B-IMPLEMENTATION-PLAN.md](SPRINT-56B-IMPLEMENTATION-PLAN.md) is **approved**.

---

## 2. Executive summary

### Original investigation

Live Design Page runs in Copilot workflows showed recurring **fidelity failures** despite correct upstream Generate Activity Materials (GAM) output: summarised material bodies, metadata substituted for `Content:` payloads, placeholders instead of embedded text, truncation, multi-material omission, and context denial. Sprint 56 remediation (prompt hygiene, L4 preservation invariants) improved consistency but **did not stop** the failure pattern.

### Architectural findings

Investigation concluded failures are **symptoms of competing responsibilities** on a single Design Page step — not isolated bugs. The step simultaneously acts as assembler, wrapper author, visual-affordance specifier, optimiser, and quality enforcer. Preservation patches treat symptoms; **scope reduction** is the structural response.

### Why Sprint 56A was created

Sprint 56 closed the cross-stage architecture programme (GREEN orchestration). Design Page **internal scope** remained overstuffed. Sprint 56A was chartered to **investigate and document** — failure modes, responsibility inventory, derived architecture, dependencies, and migration **sequencing** — without implementing changes.

### Why Sprint 56B now exists

Sprint 56A completed the architecture investigation. The central conclusion — Design Page as **read-only transport-and-organisation** — is a **planning hypothesis**, not yet stakeholder-approved. Sprint 56B converts 56A findings into an **approved implementation-ready programme**: resolve blocker decisions, complete boundary and dependency reviews, obtain architecture approval, and populate the implementation plan.

---

## 3. What has been proven

| Finding | Confidence |
| ------- | ---------- |
| **Generation works** — DLA and GAM produce required learner content | High |
| **Elicitation works** — workflow brief and step transitions function | High |
| **Information is preserved upstream** — GAM `Content:` bodies and DLA scaffolds are correct at handoff | High |
| **Information is available at compose time** — Copilot conversation history contains prior step outputs when searched | High |
| **Design Page fidelity failures are architectural** — modes A–G share a responsibility-conflict pattern | Medium–High |
| **Design Page identity has been derived** — 11 fundamentals; three-layer model; six principles | High (as planning evidence) |

### Key conclusion

> **Design Page is fundamentally a read-only transport-and-organisation stage.**

It should locate upstream artefacts, embed DLA/GAM payloads verbatim, organise them into page structure, and emit a **self-contained** final learner-facing page — without authoring material bodies, replanning pedagogy, or substituting references for content.

**Evidence:** [DESIGN-PAGE-TARGET-ARCHITECTURE-DERIVATION.md](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-TARGET-ARCHITECTURE-DERIVATION.md)

---

## 4. Sprint 56A deliverables

All artefacts live in [Sprint 56A folder](../2026-07-06-sprint-56a-design-page-simplification-planning/). **Do not modify** — reference only.

| Artefact | File | Description |
| -------- | ---- | ----------- |
| **Architecture audit** | [DESIGN-PAGE-ARCHITECTURE-AUDIT.md](../2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/DESIGN-PAGE-ARCHITECTURE-AUDIT.md) | Accepted working diagnosis: five concurrent jobs on Design Page; transport-first direction |
| **Failure modes** | [DESIGN-PAGE-FAILURE-MODES.md](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-FAILURE-MODES.md) | Catalogue A–G with common conflict-pattern conclusion |
| **Responsibility analysis** | [DESIGN-PAGE-RESPONSIBILITY-ANALYSIS.md](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-RESPONSIBILITY-ANALYSIS.md) | Transport vs organise vs author vs present vs workflow typing |
| **Responsibility matrix** | [DESIGN-PAGE-RESPONSIBILITY-MATRIX.md](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-RESPONSIBILITY-MATRIX.md) | Authoritative inventory: 86 responsibilities (R-01–R-86), classified Core / Secondary / External |
| **Core reduction analysis** | [DESIGN-PAGE-CORE-REDUCTION-ANALYSIS.md](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-CORE-REDUCTION-ANALYSIS.md) | 11 fundamentals vs 40 Core; guardrail inflation; minimum identity set |
| **Target architecture derivation** | [DESIGN-PAGE-TARGET-ARCHITECTURE-DERIVATION.md](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-TARGET-ARCHITECTURE-DERIVATION.md) | Derived identity, three layers, principles, approval-oriented summary |
| **Dependency analysis** | [DESIGN-PAGE-DEPENDENCY-ANALYSIS.md](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-DEPENDENCY-ANALYSIS.md) | 13 clusters; upstream/downstream; coupling; dual-path Copilot vs PRISM |
| **Migration strategy** | [DESIGN-PAGE-MIGRATION-STRATEGY.md](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-MIGRATION-STRATEGY.md) | Planning phases A→E; risk ordering; readiness gates |
| **Closure report** | [SPRINT-56A-CLOSURE-REPORT.md](../2026-07-06-sprint-56a-design-page-simplification-planning/SPRINT-56A-CLOSURE-REPORT.md) | Objectives achieved; handover to 56B |

---

## 5. Current architectural position

*Source: Sprint 56A target architecture derivation — planning hypothesis pending 56B approval.*

### Identity

Design Page is the **terminal read-only assembly stage**: locate upstream outputs → embed DLA activity content and GAM material bodies without redesign → organise into page JSON → emit a **self-contained** learner deliverable.

**Distinct from upstream:**
- **DLA** specifies scaffolds and material obligations — Design Page **copies**
- **GAM** realises material bodies — Design Page **embeds**
- **Design Page** **assembles** the final page — does not author bodies or serve as an index

### Three-layer model

| Layer | Name | Content |
| ----- | ---- | ------- |
| **1** | Preserve & embed | Upstream access, read-only compose, GAM/DLA embed, self-contained output, conditional assessment/episode transport |
| **2** | Organise | Page schema, activity membership, section/activity order, title/audience/profile, workflow constraints |
| **3** | Optional & supporting | Wrapper prose, visual affordances, guardrails, brevity params, validation, plumbing — **subordinate** to Layer 1–2 |

Layer 3 disposition (retain, bound, or remove) is **not decided** — Sprint 56B Workstreams 1–2.

### Fundamental responsibilities (11)

Emit page artefact · identify page (title, audience, profile) · obtain upstream content · compose read-only · embed GAM materials · embed DLA rows · close activity membership · self-contained final output · honour workflow constraints · transport assessment/episode plans when bound · organise (sections, sequence, provenance).

**Matrix anchors:** R-01, R-03, R-05, R-09, R-12, R-16, R-17, R-23, R-27, R-28, R-66 (conditional).

### Key architectural principles

| # | Principle |
| - | --------- |
| P1 | **Preservation before optimisation** — transport wins over brevity/readability conflicts |
| P2 | **Transport before narration** — embed payloads before wrapper prose is complete |
| P3 | **Final output, not index** — no dereferenceable learner content |
| P4 | **Read-only assembly** — no specify (DLA), realise (GAM), or replan (DEP) on this step |
| P5 | **Archival vs authorable** — `activity.materials.*` and rows are archival; wrapper sections only may be authorable |
| P6 | **Upstream authority for bodies** — never regenerate from brief or `required_materials` alone |

---

## 6. Active Sprint 56B work

Seeded from [DESIGN-PAGE-MIGRATION-STRATEGY.md](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-MIGRATION-STRATEGY.md). Detail: [SPRINT-56B-BACKLOG.md](SPRINT-56B-BACKLOG.md).

### Workstream 1 — Open question resolution

Resolve blocker decisions: **OQ-02, OQ-13, OQ-17, OQ-24, OQ-25** (+ coordination **OQ-23**). Migration strategy **Phase A**.

### Workstream 2 — Boundary review

Analyse Layer 3 candidates **without changing production**: generation notes, EQF, guardrails, brevity params, profiles, knowledge summaries, wrapper stack, visual affordances, transport core affirmation. Migration strategy **Phase B**.

### Workstream 3 — Dependency impact review

Trace each boundary option to export contract, validators, renderer, and learner-output impact. Produce dependency impact matrix. Migration strategy **Phase C**.

### Workstream 4 — Architecture approval

Stakeholder sign-off on derived identity and Layer 3 disposition. [SPRINT-56B-ARCHITECTURE-APPROVAL-TRACKER.md](SPRINT-56B-ARCHITECTURE-APPROVAL-TRACKER.md). Migration strategy **Phase D**.

### Workstream 5 — Implementation plan population

Populate and approve [SPRINT-56B-IMPLEMENTATION-PLAN.md](SPRINT-56B-IMPLEMENTATION-PLAN.md) only after Workstream 4. Migration strategy **Phase E**.

**Dependency chain:** W1 → W2 → W3 → W4 → W5

---

## 7. Current blockers

| ID | Description | Why it matters | Current impact |
| -- | ----------- | -------------- | -------------- |
| **OQ-02** | Should Design Page **author** new learner-facing prose or only **organise** upstream? | Defines whether wrapper stack (journey, authorial, rhetoric) remains, is bounded, or is removed | **Blocks** wrapper boundary review (W2-08), architecture disposition (CP-2), guardrail scope |
| **OQ-13** | Should **visual affordances** remain on Design Page? | Largest non-transport load; `source_basis` can substitute for embedded materials (mode G) | **Blocks** VA boundary review (W2-09), compose pipeline planning |
| **OQ-17** | **Knowledge summary:** transport KM/LC verbatim, omit section, or author preview? | Clearest structural conflict with transport; drives summarisation (mode A) | **Blocks** knowledge boundary review (W2-07) |
| **OQ-24** | **Copilot-primary** acceptance vs **PRISM repair** as backstop? | Copilot has no capture validators; repair may mask transport failures | **Blocks** validation strategy in implementation plan |
| **OQ-25** | Which workflows are **canonical acceptance fixtures**? | Required to operationalise pass/fail criteria and rollback | **Blocks** implementation plan §validation |

**Tracker:** [SPRINT-56B-OPEN-QUESTIONS.md](SPRINT-56B-OPEN-QUESTIONS.md)

---

## 8. Readiness assessment

```
Architecture Investigation
Complete

Migration Planning
In Progress

Implementation Planning
Partially Ready

Implementation Sprint
Not Ready
```

| Gate | Rationale |
| ---- | --------- |
| **Architecture investigation complete** | Sprint 56A closed with full artefact set |
| **Migration planning in progress** | Sprint 56B active; Workstreams 1–5 not started / early |
| **Implementation planning partially ready** | Derived architecture and dependency map exist; blocker OQs and approval gates open |
| **Implementation sprint not ready** | No approved implementation plan; Layer 3 disposition undecided; stakeholder sign-off pending |

---

## 9. Recommended next task

**Resolve OQ-02: Authoring vs organisation boundary**

| Field | Detail |
| ----- | ------ |
| **Activity** | Gather evidence and record decision on whether Design Page may author wrapper prose or must only organise upstream content |
| **Backlog** | W1-01 in [SPRINT-56B-BACKLOG.md](SPRINT-56B-BACKLOG.md) |
| **Output** | Resolution in [SPRINT-56B-OPEN-QUESTIONS.md](SPRINT-56B-OPEN-QUESTIONS.md) + approval tracker D1 |

### Why highest leverage

OQ-02 is the **critical path** for Layer 3:

- **Wrapper content (C6)** — journey assimilation, authorial exposition, rhetoric exist to *author* connective prose; if organise-only, scope collapses or must be strictly bounded
- **Knowledge summaries (C7)** — authoring from KM/LC is a second summarisation layer; policy depends on whether any Design Page authoring is allowed
- **Guardrails (C9)** — R-46, R-50, R-72, R-83 exist because authoring modules compete with transport; guardrail count shrinks if authoring scope narrows
- **Brevity and optimisation** — “readable page” pressure is partly an *authoring* mandate; organise-only clarifies precedence

Until OQ-02 is resolved, boundary review cannot produce meaningful disposition options for the highest-risk areas.

---

## 10. Guidance for new AI sessions

### Do not reinvestigate

These are **established** — cite Sprint 56A evidence instead:

- Upstream preservation (GAM bodies, DLA scaffolds are correct at handoff)
- Context visibility (chat history contains prior `STEP N OUTPUT:` when searched)
- Material generation (GAM realises `Content:` correctly)
- DLA ownership (specifies; does not assemble pages)
- GAM ownership (realises bodies; does not compose pages)
- Sprint 57 stage orchestration GREEN (DLA → GAM → Design Page verbs)

### Start from

1. [SPRINT-56B-START-HERE.md](SPRINT-56B-START-HERE.md) reading order  
2. Sprint 56A findings (§4 above) — especially target derivation and migration strategy  
3. [SPRINT-56B-OPEN-QUESTIONS.md](SPRINT-56B-OPEN-QUESTIONS.md) blockers  
4. Active workstream in [SPRINT-56B-BACKLOG.md](SPRINT-56B-BACKLOG.md)

**Dense onboarding:** [SPRINT-56B-CONTEXT-FOR-NEW-CHAT.md](SPRINT-56B-CONTEXT-FOR-NEW-CHAT.md)

### Avoid

- **Prompt patching** — implementation follows approved plan  
- **Preservation-rule accumulation** — symptom treatment; 56A proved scope conflict  
- **Re-opening closed architecture findings** — 56A artefacts are frozen  
- **Modifying Sprint 56A or Sprint 57 folders** — read-only reference  
- **Recreating analysis** already in responsibility matrix, core reduction, dependency analysis

### Pipeline quick reference

```
DLA specifies  →  GAM realises  →  Design Page assembles  →  Repair/validate (PRISM)  →  Export/HTML
```

Compose contract SSOT: `lib/ld-design-page-compose-contract.js` (ADR-06)  
Export authority: `page.sections[]` per Sprint 25 export contract

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `SPRINT-56B-CURRENT-STATE-HANDOVER.md` |
| Supersedes as entry point | Use this document before deep-diving 56A artefacts |
| Related | [SPRINT-56B-EXECUTIVE-HANDOVER.md](SPRINT-56B-EXECUTIVE-HANDOVER.md) (shorter executive view) |

**Last updated:** 2026-07-06
