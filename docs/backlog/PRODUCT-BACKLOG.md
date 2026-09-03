# PRISM Product Backlog

**Canonical location:** `docs/backlog/PRODUCT-BACKLOG.md`  
**Status:** Active — **alpha-use period** (Alpha development complete, 2026-09-02)  
**Last updated:** 2026-09-03 (post-alpha backlog reconciliation)  
**Active sprint:** none

This file answers: **what might we actually choose to work on next?**

It is **not** a catalogue of every historical observation. Sprint debt ledgers and governance records remain historical evidence; they are not automatically planning obligations.

**Planning principle:** A backlog item should only enter a sprint when it has a concrete implementation approach, clear ownership and acceptance criteria. Do **not** pre-assign a sprint number until a sprint pack is opened.

**How next work is selected:** Deliberately from this backlog and/or **evidenced alpha-use findings**. Open a new sprint only via an explicit opening decision.

---

## 1. Significant product investigations / capabilities

### PB-FA-011 — Expository Resource

Investigate a first-class **Expository Resource**: a high-quality, richly written and illustrated explanatory learning resource analogous to a strong book chapter, designed for understanding through exposition rather than learner activity.

The central challenge is **richness**: coherent narrative supported where appropriate by examples/non-examples, cases, evidence, applications, misconceptions, worked examples, comparisons, source material and purposeful graphics, without turning richness into a mechanical checklist.

**Key architectural hypothesis:** Expository Resource may be both a learner-facing product and a rich realised-content input to other PRISM products. In particular, generating grounded exposition before interactive learning design may address PRISM's recurring content-richness problem: establish rich intellectual material first, then determine what learners should do with it.

This could also support later Podcast and Presentation products and combinations such as:

> “Read this, then come to the workshop tomorrow.”

Investigation must determine whether the existing pipeline can support this cleanly, where richness is currently lost, and whether Expository Resource can become an upstream input to Interactive generation without compromising PRISM's authority model.

**Unresolved relationship to Research Synthesis** (do not decide now):

> Is Research Synthesis a distinct PRISM product/domain, or is it a specialised source/provenance treatment of Expository Resource?

A possible distinction: Research Synthesis may require stronger multi-source synthesis, provenance, evidence and citation semantics; Expository Resource is concerned more generally with producing a rich, coherent explanation. Former **PB-FA-009** (Research domain pack maturation) is **merged into this open question** — not retained as an independent future product.

**Explicit non-scope now:** schemas; topology decisions; generic output frameworks; assuming new stages are required (or that Episode Plan/DLA/GAM is sufficient); implementation; opening a sprint; promoting Podcast or Presentation to committed work merely as downstream applications.

**Readiness:** Significant post-alpha investigation — **not sprint-allocated**.

### PB-FA-002 — Programming / code learning-resource support

Genuine missing future capability for programming learning resources.

**Scope sketch:** learner code handling; programming-specific workspaces; language-aware rendering; programming evidence and feedback.

**Evidence basis:** `S71-F-014` (Confirmed). Former research question PB-R-002 (which languages / IO affordances first) is absorbed here as discovery work when this item is planned — not a separate standing research theme.

**Readiness:** Evidence of need exists; approach and acceptance criteria not yet written — **not sprint-allocated**.

### PB-S-005 — Release / deployment packaging

Establish a repeatable path from active development to a **known-good stable release** (version/build identity, cache-bust discipline, regression gate, checklist, rollback, deployment/update procedure).

**Evidence:** Sprint 75 operator/debug experience; governance release-packaging requirement (D-006).

**Readiness:** Problem documented; approach and acceptance criteria not yet written — **not sprint-allocated**.

---

## 2. Optional engineering / capability follow-ons

### PB-FA-010 — Prompt-contract consistency

Optional consistency / standardisation exercise: determine whether remaining PRISM prompts should be migrated to the structured prompt-contract format established for DLA/GAM **where this improves consistency, inspectability and testability**.

**Not:** architectural uncertainty, an alpha issue, or a required system-wide rewrite. Rationalise prompts individually in later bounded work if chosen.

**Readiness:** Method proven on DLA (Sprint 77); optional follow-on — **not sprint-allocated**.

### PB-M-001 — Future maths capabilities

Light future capabilities — **no commitment or scheduling**:

| Capability | Notes |
| ---------- | ----- |
| Mixed prose + maths editing | Rich editor spanning prose and mathematics |
| Per-cell maths in table-style response surfaces | Table cells with `input_modality: math` |
| CAS / symbolic correctness support | Symbolic checking beyond TeX entry/display |

Sprint 82 delivered first-class MathLive entry + MathJax display for dedicated maths fields. These remain optional post-alpha follow-ons.

---

## 3. Lightweight future product ideas

Concise only. **No implementation commitment.**

| Idea | Note |
| ---- | ---- |
| **Podcast Script** | Distinct downstream product (speaker roles, conversational form, pacing, segment structure). Hypothesis only: Expository Resource could provide strong upstream material. Not TTS of an Expository Resource. |
| **Presentation / slideshow** | Distinct visual/presenter treatment. Hypothesis only: may be downstream of Expository Resource. **Not** PRISM's next architecture extensibility test (former PB-FA-008 superseded). |

---

## 4. Research

### PB-R-011 — Expository vs Interactive comparison

Given comparable Expository and Interactive resources derived from the same Content, Model Knowledge and Learning Outcomes:

1. which do **learners** prefer;
2. which produces better demonstrated **learning, retention and/or transfer**;
3. which do **educators** actually choose to create and deploy?

The educator question concerns **actual behaviour**, not merely stated pedagogical preference.

**Readiness:** Post-alpha research opportunity — no implementation commitment; informs PB-FA-011.

---

## 5. Retired / superseded (planning authority only)

These IDs are **no longer live planning items**. Historical detail remains in prior backlog revisions, sprint packs, and governance records.

| Former ID | Disposition |
| --------- | ----------- |
| **PB-FA-001** | **Retired** — Workflow Resources core closed in Sprint 73; no standing FA theme |
| **PB-FA-003** | **Retired** — pipeline integrity not permanently open work; handle evidenced defects from alpha use |
| **PB-FA-004** | **Retired** — manually uploaded graphics; current graphics authoring sufficient |
| **PB-FA-005** | **Retired** — old Settings/parameterisation problem; Sprint 80 Adjustments answered the architectural question |
| **PB-FA-006** | **Retired** — QA/refinement productisation; operating QA is Part 1 Benchmark + Part 2 Validation as custom ChatGPT workflow |
| **PB-FA-007** | **Retired** — user-controlled storage management; workflow deletion is sufficient practical control |
| **PB-FA-008** | **Superseded** — Slideshow-as-architecture-test; Presentation remains a lightweight idea only (§3) |
| **PB-FA-009** | **Merged** into PB-FA-011 Research Synthesis relationship question |
| **PB-S-001…PB-S-004** | **Retired** from canonical planning (historical suite/UX notes; not current “what next” items) |
| **PB-R-001** | **Retired** from canonical planning (conversation-attachment store) |
| **PB-R-002** | **Absorbed** into PB-FA-002 discovery when planned |
| **PB-R-003** | **Retired** — raise-the-ceiling measurement; addressed operationally by Benchmark Part 1 + Validation Part 2 |
| **PB-R-004** | **Merged** into Expository Resource richness (PB-FA-011); not a distinct page-type programme |
| **PB-R-005** | **Retired** — progressive-disclosure elicitation; no concrete current product problem stated |
| **PB-R-006** | **Retired** from canonical planning |
| **PB-R-007** | **Retired** — Benchmark/Validation instrument homes; custom workflow is accepted operating architecture |
| **PB-R-008** | **Retired** from canonical planning (orphan Workflow Resources cleanup) |
| **PB-R-009** | **Retired** — per-run configuration/profile; Adjustments substantially answered the need |
| **PB-R-010** | **Retired** — QA feedback destination; with PB-FA-006 |

**Not promoted into this backlog:** Sprint 81 debt (S81-D-001…007), RC3–RC8 (D-014 residue), Group F tooling, and older governance D-IDs remain in their historical ledgers unless alpha use produces a concrete new requirement.

---

## Related

- Programme pointer: [docs/sprints/NEXT-SPRINT.md](../sprints/NEXT-SPRINT.md)  
- Alpha close: [SPRINT-82-CLOSURE.md](../development/sprints/2026-09-01-sprint-82-maths-entry-and-alpha-completion/SPRINT-82-CLOSURE.md) · [S82-D04](../development/sprints/2026-09-01-sprint-82-maths-entry-and-alpha-completion/decisions.md#s82-d04--alpha-development-complete)  
- Legacy notes (non-planning): [ideas.md](ideas.md) · [known-issues.md](known-issues.md) · [future-directions.md](future-directions.md)  
