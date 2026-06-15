# Sprint 44 — Current Frontier

**Date:** 2026-06-15  
**Type:** Operational orientation — what Sprint 44 is doing now

---

## Where we are

Sprint 43 closed with a stable educational architecture and a reframed quality problem:

- **Settled:** investigation-primary ownership, resource-secondary voice, supporting role of activities/materials/PEL
- **Settled:** architecture generalises (Marx + Photosynthesis)
- **Open:** learner-facing materials often under-realise their instructional function

Sprint 44 moves from diagnosis to **material quality work** — capture safety first, then explicit depth standards, then evaluation and patterns.

---

## Current frontier (in order)

### 1. GAM capture safety — Slice 44-1

**Problem:** Structurally invalid GAM captures (JSON stubs, missing Material/Content format, under-coverage vs DLA) can reach Design Page silently.

**Frontier work:** Implement tiered capture gate — block structural and coverage failures; warn on thin bodies only.

**Out of scope for 44-1:** Prompt changes, renderer changes, LLM repair, inflation-specific semantic gates.

**Spec:** [`sprint-44-slice-1-tiered-gam-capture-gate.md`](sprint-44-slice-1-tiered-gam-capture-gate.md)

---

### 2. Instructional depth contracts — Slice 44-2

**Problem:** Instructional expectations for material types exist but are distributed; reviewers lack a single educational specification.

**Frontier work:** Use Draft 1 contracts as the reference for evaluating material realisation on Marx and Photosynthesis.

**Material types in scope:**

| Type | Instructional move |
| ---- | ------------------ |
| `text` | Exposition / criteria teaching |
| `worked_example` | Modelled procedure + reasoning |
| `modelling_note` | Expert decision visibility |
| `misconception_note` | Error interruption |
| `sample_output` | Quality calibration |
| `decision_table` | Guided judgement grid |
| `checklist` | Criteria-linked verification |
| `transfer_prompt` | Own-context application |
| `consolidation_summary` | Session closure scaffold |
| `rubric` / `quality_criteria` | Judgement standards |

**Spec:** [`sprint-44-2-instructional-depth-contracts.md`](sprint-44-2-instructional-depth-contracts.md)

**Note:** Contracts are normative educational standards. They do not imply current generators already satisfy them.

---

### 3. Cross-domain material evaluation — post 44-2

**Problem:** Need evidence that contracts discriminate real weakness on benchmarks.

**Frontier work:** Score Marx and Photosynthesis GAM/page materials against 44-2 (minimum / strong / failed per type). Identify which failure modes recur.

**Marx:** Strong upstream materials; prototype showed manifestation gains; v4 targets (synthesis, metacognitive depth, criteria) inform evaluation.

**Photosynthesis:** Architecture holds; material realisation gaps more visible (thin exposition, weak modelling, closure collapse).

---

### 4. Instructional pattern library — Slice 44-3 (planned)

**Trigger:** 44-2 evaluation shows contracts discriminate effectively.

**Purpose:** Reusable strong-realisation patterns per material type — still educational design, not prompt implementation.

**Status:** Not yet designed.

---

## Explicitly not the frontier

| Topic | Why excluded |
| ----- | ------------ |
| Ownership model | Settled in 43-02 |
| Two-column manifestation | Settled prototype direction |
| Missing workflow stages | Disproved |
| Missing upstream pedagogy | Disproved |
| Renderer / page layout redesign | Out of Sprint 44 scope unless user rescopes |
| Visual affordances (diagrams, charts) | Separate workflow — page artefact visual affordances |
| Universal inflation A4 gates | 44-1 explicitly excludes FMT-06/07/08 as global gates |

---

## Success signals for Sprint 44

| Signal | Indicator |
| ------ | --------- |
| Capture safety | Bad GAM stubs and under-covered captures cannot advance on self-directed learner-page runs |
| Contract utility | Reviewer can classify material bodies as failed / minimum / strong using 44-2 without inferring from architecture |
| Cross-domain evaluation | Marx and Photosynthesis scored; recurring failure modes named |
| Pattern readiness | Clear whether 44-3 pattern library is warranted |

---

## Handover entry point

Fresh chats: [`sprint-44-chat-handover-pack.md`](sprint-44-chat-handover-pack.md)
