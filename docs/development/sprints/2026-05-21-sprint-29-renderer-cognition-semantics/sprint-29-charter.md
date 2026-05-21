# Sprint 29 charter — Renderer cognition semantics (investigation)

**Date:** 2026-05-21  
**Status:** **Closed** (29-0–29-2; see [`sprint-29-closure.md`](sprint-29-closure.md))  
**Precondition:** Sprint 28 **closed** — cognition fields survive E→O→G→C in JSON

---

## 1. Charter statement

Sprint 29 asks whether **semantic visual presentation** in the Utilities HTML renderer can materially improve how learners **perceive and navigate** cognition-bearing structures **already present** on composed pages — without changing pedagogy, orchestration, workflows, or introducing tutoring UI.

This is **renderer semantics only** (R-layer). It is **not** illustration generation, **not** a branding refresh, and **not** a return to Sprint 28 ontology work.

---

## 2. Core question

**Can lightweight renderer semantics improve cognitive orientation, learning-process visibility, reasoning-flow clarity, and pedagogic readability — while pedagogy remains authoritative upstream?**

---

## 3. Renderer semantics vs pedagogic generation

| Layer | Role | Sprint 29 touch? |
|-------|------|------------------|
| **E/O** | Brief factors, topology | **No** — frozen (Sprint 28) |
| **G** | DLA/GAM/GAI generation | **No** |
| **C** | Page composition, `metadata.cognition_profile` | **No** — may **consume** profile later |
| **R** | HTML export presentation | **Yes** — investigation then bounded implementation |

**Principle:** The renderer **expresses** cognition already encoded in `page.sections[]` and activity rows. It does not **invent** pedagogy.

**Illustration workflow** (diagrams, generated figures) is a **future separate enrichment pipeline** — out of scope for 29-0.

---

## 4. In scope (renderer semantics MAY include)

- Icons and typographic hierarchy tied to **learning-process roles**
- Semantic spacing and section affordances
- Lightweight cognition **CSS classes** (e.g. `util-cognition--revision`)
- Cognition-aware callouts (misconception, uncertainty, evidence contrast)
- Comparison layouts for paired fields (`misconception_claim` + `reconciliation_prompt`)
- Progressive rhythm for `scaffold_hint_sequence`
- Visual rhythm and semantic colour **tokens** (accessible, print-safe)
- Cognitive flow visibility (revision cycle, reflection-before-answers)

---

## 5. Out of scope (MUST NOT)

| Excluded | Notes |
|----------|--------|
| New cognition factors / packs | Sprint 28 complete |
| Orchestration / workflow steps | No topology changes |
| Learner modelling / adaptive tutoring | No runtime adaptation |
| Branching UI / dynamic sequencing | No interactive paths |
| Generated illustrations / diagrams | Future workflow |
| Instructional redesign | Upstream authority |
| New frontend framework | PRISM Utilities export only |
| LMS replacement | Export artefact focus |
| Motion / animation sprint | Static HTML first |
| Full visual redesign / branding | Semantic differentiation only |

---

## 6. Architectural principles (investigation baseline)

1. **Renderer expresses cognition already present** — read typed fields + `metadata.cognition_profile`.
2. **Pedagogy remains authoritative upstream** — no prompt/schema changes in Sprint 29.
3. **Semantic, not decorative** — every class maps to a learning-process role.
4. **Lightweight and accessible** — WCAG-minded contrast; degrades to plain prose.
5. **Printable / exportable** — single HTML file; no JS-dependent tutoring.
6. **Graceful degradation** — missing fields → generic activity block (current behaviour).

---

## 7. Candidate cognition semantic classes (document only — not implemented)

| Class ID | Maps to fields (Sprint 28) | Presentation intent |
|----------|---------------------------|---------------------|
| `reasoning-revision` | `initial_position_prompt`, `reasoning_revision_prompt`, `revision_trigger` | Predict → discuss → revise rhythm |
| `misconception-repair` | `misconception_claim`, `reconciliation_prompt`, `evidence_contrast` | Warning + repair adjacency |
| `productive-uncertainty` | `uncertainty_tension_prompt` | Exploratory / tension callout |
| `self-explanation` | `self_explanation_prompt` | Reflective annotation |
| `transfer-application` | `transfer_or_application_task` | Practice / application emphasis |
| `scaffold-sequence` | `scaffold_hint_sequence` | Numbered hint ladder |
| `reflection-cycle` | Assessment `reflection_then_answers` + activity prompts | Defer answers visually |

---

## 8. Investigation phases (29-0 → 29-x)

| Phase | Focus | Status |
|-------|--------|--------|
| **29-0** | Evidence programme + probes + matrix | **Complete** |
| **29-1** | HTML capture via `buildUtilityStructuredHtmlForTest` (P01/P02/P07) | **Complete** |
| **29-2** | Bounded cognition renderer (`util-cognition*`) | **Complete** |
| **29-3** | Not chartered | — |

---

## 9. Regression anchors

- **355** tests (`node --test tests/*.test.js`) — +5 cognition render tests (29-2)
- Sprint 27 assessment visibility contracts (reflection, hidden answers)
- Sprint 28 composition parity — renderer must not drop activities

---

## 10. Success criteria (programme)

| Criterion | Evidence |
|-----------|----------|
| Flattening documented | Matrix rows for each probe |
| Semantic opportunities prioritised | `renderer-semantics-notes.md` |
| Hypotheses adjudicated | R29-H1–H4+ in matrix |
| Bounded renderer shipped | 29-2 + **R29-005** closure |

---

## Related

- Sprint 29 closure: [`sprint-29-closure.md`](sprint-29-closure.md)
- Sprint 28 closure: [`../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/sprint-28-closure.md`](../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/sprint-28-closure.md)
- Renderer governance: Sprint 26 presentation consolidation
