# Sprint 38-Q — Instructional Episode Depth and Teaching Architecture

**Pack path:** `docs/development/sprints/2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/`  
**Date:** 2026-06-06  
**Status:** **CLOSED — SUCCESS** — [38Q-6 closure](observations/38Q-6-sprint-closure.md)  
**Predecessor:** [Sprint 38-P — Instructional Role Fidelity](../2026-06-05-sprint-38p-instructional-role-fidelity/) (**CLOSED** — [38P-7](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-7-sprint-closure.md) · **SUCCESS**)  
**Successor:** [Sprint 38-R — Instructional Episode Plan Design Proof](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/) (**CHARTERED**)

**Quick resume:** [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) · [HANDOVER.md](HANDOVER.md) · [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Sprint purpose

**Educational abstraction investigation** — determine what should sit between knowledge representation and instructional materials if the goal is rich teaching episodes rather than worksheet-oriented activities.

| Prior sprint | Established |
|--------------|-------------|
| **38-M** | Body fidelity — `proofOk` |
| **38-N** | Render fidelity |
| **38-O** | Role fidelity discovery |
| **38-P** | Role fidelity implementation — `fullOk: true` on EV-38P-AFTER |
| **38-I** | Instructional episode model — target states, 38I-4 exemplars |
| **38-Q** | **Abstraction adequacy** — H1/H2/H3 investigation |

**Fidelity is considered solved.** Do not reopen 38M, 38N, 38O, or 38P.

Current outputs are coherent, complete, structurally valid, and faithfully preserved — but **worksheet-oriented**. 38Q established the cause: **missing episode planning (G3/G5)**, not fidelity. Recommendation: **Instructional Episode Plan** between LO and DLA ([38Q-5](observations/38Q-5-recommended-architecture.md)).

---

## Core questions

**Primary (governing):**

> What educational abstraction should sit between knowledge representation and instructional materials if the goal is to generate rich teaching episodes rather than worksheet-oriented activities?

**Subsidiary (not assumed):**

> How can DLA and GAM generate richer episodes while preserving `fullOk`?

The subsidiary question applies **only if** investigation supports implementation improvement (H1) or abstraction extension (H2).

---

## Educational abstraction challenge

38Q is an **educational abstraction investigation**, not merely a DLA/GAM improvement sprint.

| Principle | Statement |
|-----------|-----------|
| **No default abstraction** | 38Q must **not** assume DLA and GAM are the correct educational abstractions. |
| **Gap ≠ cause** | The generation gap is established; its cause is **not yet settled**. |
| **Three resolution paths** | DLA/GAM may need: **(A)** implementation improvement, **(B)** abstraction extension, or **(C)** abstraction redesign or replacement. |

---

## Three hypotheses

| ID | Summary |
|----|---------|
| **H1** | Abstractions sound — need better implementation |
| **H2** | Abstractions partial — need episode/planning extension |
| **H3** | Abstractions misaligned — wrong educational units → worksheets |

See [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md) for full definitions.

---

## Blank-sheet thought experiment (in scope)

> **If Prism were designed today from scratch, would we recreate the current DLA and GAM abstractions?**

Explicitly in scope — 38Q-5 must address with evidence.

---

## Prompt accretion challenge

| Principle | Statement |
|-----------|-----------|
| **No prompt-length assumption** | Do not assume richer outputs require longer prompts. |
| **Symptom vs solution** | Prompt growth may represent genuine educational complexity, **or** compensation for a weak underlying educational model. |
| **Investigation duty** | 38Q should determine whether prompt complexity is a **symptom** rather than a **solution**. |

---

## Target learner arc

```text
Observe → Predict → Compare → Explain → Evaluate → Transfer → Reflect
```

vs current dominant pattern:

```text
Read → Complete table → Checklist
```

The objective is **not more content**. The objective is **better instructional architecture** — which may require a different abstraction.

---

## Phase table

| Phase | Focus | Deliverable | Status |
|-------|--------|-------------|--------|
| **38Q-1** | Baseline + abstraction adequacy matrix | [38Q-1](observations/38Q-1-what-good-looks-like-baseline.md) | **COMPLETE** |
| **38Q-2** | Episode taxonomy and pattern catalogue | [38Q-2](observations/38Q-2-episode-taxonomy-catalogue.md) | **COMPLETE** |
| **38Q-3** | Gap analysis + H1/H2/H3 evidence | [38Q-3](observations/38Q-3-dla-gam-gap-analysis.md) | **COMPLETE** |
| **38Q-4** | Abstraction design options | [38Q-4](observations/38Q-4-episode-generation-design-options.md) | **COMPLETE** |
| **38Q-5** | Recommended architecture + blank-sheet answer | [38Q-5](observations/38Q-5-recommended-architecture.md) | **COMPLETE** |
| **38Q-6** | Closure (SC-8, SC-9) | [38Q-6](observations/38Q-6-sprint-closure.md) | **COMPLETE** |

---

## Success criteria — all PASS

| ID | Criterion | Status |
|----|-----------|:------:|
| **SC-1** – **SC-7** | Baseline through fidelity hold | **PASS** |
| **SC-8** | Educational abstraction assessment completed | **PASS** |
| **SC-9** | Abstraction recommendation completed | **PASS** |

**Conclusion (with evidence):** Extend with **Instructional Episode Plan** layer (H2 confirmed). See [38Q-6](observations/38Q-6-sprint-closure.md).

---

## Hold conditions

| Hold | Source |
|------|--------|
| **38M–38P closed** | Do not reopen fidelity machinery |
| **fullOk must hold** | Hard constraint on any future implementation |
| **Docs-only default** | 38Q-1–38Q-6 unless charter authorises otherwise |
| **38I is anchor** | Target states authoritative — not re-litigated |
| **No H1 default** | DLA/GAM improvement is one hypothesis, not the mission |

---

**Closed.** Start with [38Q-6 closure](observations/38Q-6-sprint-closure.md) for standalone summary.
