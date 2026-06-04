# Sprint 39 — Reasoning Cue Specification

**Pack path:** `docs/sprints/sprint-39/`  
**Status:** **PLANNING** — discovery / planning only; no runtime implementation — **DEFERRED** behind [Sprint 38-B](../../development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/)  
**Date:** 2026-06-03  
**Predecessor:** [Sprint 38 — Pedagogical Visual Affordance Enrichment](../../development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/) (**COMPLETE**, 706 tests)  
**Gate:** [Sprint 38-B — LD Prompt Architecture & Materials Fidelity](../../development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/) must complete 38B-1 + 38B-4 before Sprint 39 prompt work

**Quick resume:** [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) · Root mirror: [NEXT-CHAT-CONTEXT.md](../../../NEXT-CHAT-CONTEXT.md)

---

## Sprint overview

Sprint 38 delivered a working **pedagogical visual affordance pipeline** (Design Page → Compose → Renderer → VEU v1.2.1 → Image Generation). The remaining quality bottleneck is **not** plumbing, placement, renderer logic, VEU topology, or image generation.

The next bottleneck is **reasoning cue specificity**:

```text
purpose
  ↓
representation
  ↓
pedagogical_added_value
  ↓
reasoning cues          ← Sprint 39
  ↓
image
```

Sprint 39 investigates how to author cues so generated visuals become **genuine pedagogical supports** rather than structurally correct but weak diagrams.

---

## Core hypothesis

Visuals become instructionally useful when they make **relevant reasoning cues perceptible**. Sprint 38 taught the system *when*, *where*, *why*, *what family*, and *what not to show*. Sprint 39 asks: **what cues must the visual make visible?**

---

## Programme question

> What reasoning cues must learners notice, compare, classify, interpret, evaluate, or trace — and how should those cues be represented in visual affordances?

---

## Boundaries (do not reopen)

| Assume complete (Sprint 38) | Out of scope for Sprint 39 |
|-----------------------------|----------------------------|
| Schema 38.4, generate/defer/reject, `activity_visual_value` | Renderer redesign |
| `pedagogical_added_value`, representation guidance | CSS / DOM placement (Sprint 36) |
| Authoritative renderer + VEU v1.2.1 | VEU workflow topology |
| Legacy fallback | Image model changes |
| 697-test floor | Schema expansion unless audit proves necessity |

**Start as discovery / planning, not implementation.**

---

## Proposed slices

| Slice | Title | Deliverable |
|-------|-------|-------------|
| **39-1** | Reasoning cue audit | [observations/39-1-reasoning-cue-audit.md](observations/39-1-reasoning-cue-audit.md) |
| **39-2** | Reasoning cue taxonomy | [observations/39-2-reasoning-cue-taxonomy.md](observations/39-2-reasoning-cue-taxonomy.md) |
| **39-3** | Cue authoring design | [observations/39-3-cue-authoring-design.md](observations/39-3-cue-authoring-design.md) |
| **39-4** | Representation cue alignment | [observations/39-4-representation-cue-alignment.md](observations/39-4-representation-cue-alignment.md) |
| **39-5** | Authoring guidance | [observations/39-5-authoring-guidance.md](observations/39-5-authoring-guidance.md) |
| **39-6** | Validation plan | [observations/39-6-validation-plan.md](observations/39-6-validation-plan.md) |

Charter: [SPRINT-39-CHARTER.md](SPRINT-39-CHARTER.md) · Handover: [HANDOVER-AND-FORWARD-PLAN.md](HANDOVER-AND-FORWARD-PLAN.md)

---

## Evaluation anchors (reuse Sprint 38)

| Anchor | Fixture path |
|--------|----------------|
| Inflation workshop | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` |
| Climate | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` |
| CI golden | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` |
| Marx self-study | `tests/fixtures/page-render/marx-self-study-page.json` |
| Affordance probes | `tests/fixtures/sprint-38/affordance-records.json` |

---

## Regression command (unchanged)

```bash
node --test tests/*.test.js
```

**Floor:** 697 pass / 0 fail — Sprint 39 must not regress Sprint 38 without explicit implementation slice approval.

---

## Pack contents

| File | Purpose |
|------|---------|
| [README.md](README.md) | Overview (this file) |
| [SPRINT-39-CHARTER.md](SPRINT-39-CHARTER.md) | Governance and success criteria |
| [HANDOVER-AND-FORWARD-PLAN.md](HANDOVER-AND-FORWARD-PLAN.md) | Sprint 38 → 39 transition |
| [NOTES.md](NOTES.md) | Programme notes |
| [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) | Paste-ready next chat context |
| [observations/](observations/) | Slice templates and findings |
| [fixtures/](fixtures/) | Probes and examples |
