# Sprint 84 — Decision Log

**Sprint status:** **COMPLETE / CLOSED** (opened 2026-09-21; closed 2026-09-21)  
**Closure:** [SPRINT-84-CLOSURE.md](SPRINT-84-CLOSURE.md) · [S84-D12](decisions.md#s84-d12--accept-refined-planning-design-and-close-sprint-84)  
**Format:** ID · Decision · Status · Rationale · Consequences  
**Authoritative design:** [S84-EXPOSITORY-RESOURCE-DESIGN.md](S84-EXPOSITORY-RESOURCE-DESIGN.md)

---

## S84-D01 — Open Sprint 84 — Expository Resource Planning

- **Decision:** Open Sprint 84 as a **Planning** sprint (not implementation) to turn accepted Sprint 83 evidence into the smallest coherent design for a first-class Expository Resource under [PB-FA-011](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-011--expository-resource), subject to binding [S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline) (sibling prompt-family · protected Interactive baseline).

- **Status:** **Accepted** (2026-09-21)

- **Rationale:**
  - Sprint 83 investigation is **COMPLETE / CLOSED**; the accepted report is the authoritative handoff.
  - Alpha development remains complete; this is the first post-investigation Planning programme for Expository.
  - Implementation and production changes remain **not** authorised.

- **Consequences:**
  - Sprint 84 pack is the active programme pointer via [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md).
  - Sprint 83 remains **CLOSED** historical evidence — do not reopen or modify it for Planning.
  - S83-D04 is **binding** for all Sprint 84 Planning work.
  - Implementation sprint is **not** opened.

---

## S84-D02 — Accept detailed Sprint 84 Planning brief

- **Decision:** Accept the detailed Sprint 84 Planning brief supplied by the operator (objectives; binding principles A–C; pedagogical conception; richness; Planning areas A–K; required design output; exit criteria). Authorise **Planning execution** under that brief. Implementation remains **not** authorised.

- **Status:** **Accepted** (2026-09-21)

- **Rationale:** Brief defines bounded Planning scope; inventing unrelated tasks would violate Planning discipline.

- **Consequences:**
  - Bounded Planning tasks recorded in [PLAN.md](PLAN.md) (S84-T-001…T-010).
  - Architecture decisions S84-D03…D09 authorised as Planning outcomes.
  - No production changes; sprint remains OPEN for operator review after design delivery.

---

## S84-D03 — Expository product definition & Create representation

- **Decision:** First-class Learning Design Create product **Expository Resource** (`expository_resource`), alongside Self-study resource and Workshop. It produces a predominantly reading/viewing intellectual chapter — **not** an Interactive page with activities removed. First implementation does **not** promise Expository→Interactive, Workshop packaging, Podcast/Presentation, or Research Synthesis resolution.

- **Status:** **Accepted** (2026-09-21) — Planning

- **Evidence:** S83 product gap (Create only Self-study/Workshop); PB-FA-011; Planning brief product conception.

- **Design detail:** [S84-EXPOSITORY-RESOURCE-DESIGN.md](S84-EXPOSITORY-RESOURCE-DESIGN.md) §1

---

## S84-D04 — Authority & knowledge flow

- **Decision:** Adopt the authority model: source → (normalize) → **`learning_content` as explanatory richness spine** → **Model Knowledge as conceptual graph (not textbook)** → **Learning Outcomes** → Expository Journey Plan → Expository Development → Expository Materials → Design Page → assembly → renderer. Do **not** require all explanatory richness to pass solely through MK. Avoid duplicated authority; Design Page must not rewrite exposition bodies for coherence.

- **Status:** **Accepted** (2026-09-21) — Planning

- **Evidence:** S83 MK compression vs LC richness; S83 Design Page thin-assembly discipline.

- **Design detail:** [S84-EXPOSITORY-RESOURCE-DESIGN.md](S84-EXPOSITORY-RESOURCE-DESIGN.md) §4

---

## S84-D05 — Expository topology & sibling stage names

- **Decision:** Adopt Expository topology:

```text
[Normalize?] → Generate Learning Content → Model Knowledge → Learning Outcomes
  → Expository Journey Plan → Expository Development → Expository Materials
  → Design Page → assembly → learner-renderer-vnext
```

- Reuse Normalize, MK (unchanged), assembly (additive), renderer (reuse).
- Sibling prompts: Generate Learning Content, Learning Outcomes, Design Page.
- **Bypass** Interactive Episode Plan, DLA, GAM, and Learning Sequence for Expository.
- Sibling stages named: **Expository Journey Plan**, **Expository Development**, **Expository Materials** (not DLA/GAM/EP names).

- **Status:** **Accepted** (2026-09-21) — Planning

- **Evidence:** S83 Interactive DLA/GAM/EP semantic mismatch; S83-D04 sibling family; capability preservation principle.

- **Alternatives rejected:** Prompt-only DLA/GAM reuse; generic shared pedagogy prompts; new renderer.

- **Design detail:** [S84-EXPOSITORY-RESOURCE-DESIGN.md](S84-EXPOSITORY-RESOURCE-DESIGN.md) §3, §5, §6, §12

---

## S84-D06 — Narrative continuity model

- **Decision:** **Expository Journey Plan owns the chapter** (whole-resource intellectual structure / progressive construction of understanding). Expository Development realises **sections** without replanning the whole. Expository Materials keep commissioned recurrence consistent. Design Page provides orientation/thin glue only. **Reject** chunk+thin-glue as sole strategy and **reject** a final unrestricted LLM coherence rewrite. **Refined by [S84-D10](decisions.md#s84-d10--expository-instructional-design-north-star):** EJP owns progressive construction of understanding, not merely a TOC.

- **Status:** **Accepted** (2026-09-21) — Planning; refined 2026-09-21 by S84-D10

- **Evidence:** S83 continuity findings (activity-chained / thin glue); operator review refinement.

- **Design detail:** [S84-EXPOSITORY-RESOURCE-DESIGN.md](S84-EXPOSITORY-RESOURCE-DESIGN.md) §8

---

## S84-D07 — Materials & Page/assembly/renderer strategy

- **Decision:**
  - Supporting intellectual artefacts are **commissioned by Expository Development** (pedagogical judgement, not checklist) and **realised by Expository Materials** under commission lock.
  - Do not force Interactive activity/material semantics.
  - **Reuse** learner-renderer-vnext; **additive** assembly/page-shape/validation for Expository primary structure; allow zero-workspace Expository pages; leave Interactive path untouched.
  - Graphics/maths/a11y display capabilities remain available via shared infrastructure with additive binding to exposition **sections** where needed.
  - **Refined by [S84-D11](decisions.md#s84-d11--ordered-exposition-sections-as-semantic-primary-structure):** semantic primary structure is ordered learner-facing exposition **sections** (not deferred; field-level schema remains implementation detail).

- **Status:** **Accepted** (2026-09-21) — Planning; primary-structure refinement 2026-09-21

- **Evidence:** S83 GAM/renderer findings; capability preservation principle; operator review refinement.

- **Design detail:** [S84-EXPOSITORY-RESOURCE-DESIGN.md](S84-EXPOSITORY-RESOURCE-DESIGN.md) §9–§10

---

## S84-D08 — Contract strategy

- **Decision:** Reuse MK and LO contracts unchanged; reuse `learning_content` shape; do **not** use Interactive EP/DLA/GAM contracts in Expository topology; introduce **sibling contracts** for Expository Journey Plan, Expository Development, and Expository Materials; additive Page/assembly support as needed. Field-level schemas deferred to implementation within these boundaries. Do not generalise Interactive contracts to avoid siblings (S83-D04).

- **Status:** **Accepted** (2026-09-21) — Planning

- **Design detail:** [S84-EXPOSITORY-RESOURCE-DESIGN.md](S84-EXPOSITORY-RESOURCE-DESIGN.md) §7, §11

---

## S84-D09 — Quality/acceptance & implementation handoff

- **Decision:** Adopt the judgement-based acceptance framework and implementation handoff in the design document (§13, §15): manual Create→Run→assemble→render/export journey; focused Expository tests; Interactive first-class gate remains green; no Interactive prompt edits. Work packages WP1–WP7 are **planning guidance only** — implementation sprint **not** opened.

- **Status:** **Accepted** (2026-09-21) — Planning

- **Design detail:** [S84-EXPOSITORY-RESOURCE-DESIGN.md](S84-EXPOSITORY-RESOURCE-DESIGN.md) §13–§15

---

## S84-D10 — Expository instructional-design north star

- **Decision:** Adopt the Expository instructional-design north star:

> An Expository Resource should progressively construct a coherent mental model of its subject, moving the learner from appropriate orientation and foundational understanding towards increasingly connected, discriminating, qualified and usable understanding.

- Interactive and Expository use different instructional grammars (activity competence vs understanding through explanation/elaboration/representation/connection/synthesis). Do **not** create an Expository beat-sequence template.
- EJP’s governing question: *What intellectual journey will allow this audience to construct the understanding represented by these Learning Outcomes?*
- EJP owns progressive construction of understanding across the whole resource (ordered sections); XD owns per-section explanatory treatment for the intended conceptual move; XM owns realisation of commissioned intellectual materials under commission lock.
- Avoid serial explanation; connections, distinctions, recurrence, dependencies, qualifications and synthesis are instructional design, not polish.
- No named external instructional-design model is adopted.

- **Status:** **Accepted** (2026-09-21) — Planning refinement (operator review)

- **Preserves:** S84-D03…D09 architecture (topology, authority, siblings, Interactive baseline, capability preservation).

- **Design detail:** [S84-EXPOSITORY-RESOURCE-DESIGN.md](S84-EXPOSITORY-RESOURCE-DESIGN.md) §2.D, §5–§6, §8, §13

---

## S84-D11 — Ordered exposition sections as semantic primary structure

- **Decision:** The first-class Expository Resource is semantically organised as an **ordered set of learner-facing exposition sections**. Conceptually: Resource/chapter → ordered sections → explanation + supporting intellectual materials. The **section** is the primary learner-facing structural unit.
- EJP plans the intellectual journey across ordered sections; XD develops each section; XM realises materials for relevant section(s); Design Page supplies orientation/synthesis/visual planning without re-authoring section bodies; assembly constructs deterministically; renderer remains shared.
- Do **not** introduce an abstract `exposition unit` layer unless later implementation evidence requires it.
- Explicitly **reject** fake Interactive activities or a thin activity-compatible shell as the primary Expository structure.
- Field names, IDs, nesting, schema representation, capture/enrich and renderer plumbing remain **implementation detail**.

- **Status:** **Accepted** (2026-09-21) — Planning refinement (operator review)

- **Supersedes:** prior deferral of “exact page primary shape” as an architecture open question (field-level mechanics only remain open).

- **Preserves:** S84-D03…D10; Interactive baseline; shared renderer; additive assembly.

- **Design detail:** [S84-EXPOSITORY-RESOURCE-DESIGN.md](S84-EXPOSITORY-RESOURCE-DESIGN.md) §7, §10, §12, §15–§16

---

## S84-D12 — Accept refined Planning design and close Sprint 84

- **Decision:** Accept the refined Sprint 84 Expository Resource Planning design ([S84-EXPOSITORY-RESOURCE-DESIGN.md](S84-EXPOSITORY-RESOURCE-DESIGN.md), decisions S84-D03…D11) **as-is**. Record Planning as **complete**. Close Sprint 84 — Expository Resource Planning as **COMPLETE / CLOSED**.

> Sprint 84 Expository Resource Planning is complete. The first-class Expository product, instructional-design model, workflow topology, authority boundaries, sibling-stage responsibilities, semantic section structure, capability-preservation requirements and implementation handoff are accepted. Implementation has not begun and must be opened separately.

- **Status:** **Accepted** (2026-09-21)

- **Consequences:**
  - [S84-EXPOSITORY-RESOURCE-DESIGN.md](S84-EXPOSITORY-RESOURCE-DESIGN.md) is the authoritative Planning handoff to a later implementation sprint.
  - Implementation remains **not authorised**; no implementation sprint is opened by this decision.
  - No production code, prompt, schema, UI, renderer, or test changes occurred in Sprint 84.
  - Remaining questions (field-level schemas; GAM reuse behind XM; zero-workspace export; Adjustments; Research Synthesis) stay at implementation/deferred/open levels — they do **not** keep Sprint 84 open.
  - [PB-FA-011](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-011--expository-resource) remains the relevant backlog item.
  - Programme pointer: [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md)

- **Evidence:** [SPRINT-84-CLOSURE.md](SPRINT-84-CLOSURE.md) · [S84-EXPOSITORY-RESOURCE-DESIGN.md](S84-EXPOSITORY-RESOURCE-DESIGN.md)

---

## Pending decisions

| ID | Decision | Status |
| -- | -------- | ------ |
| — | Field-level section/page schema mechanics | **Deferred to implementation** (within S84-D11) |
| — | Open Expository implementation sprint | **Not opened** — requires separate operator decision |
| — | Research Synthesis identity | **Remains open** (non-blocking) |
| — | Expository-specific Adjustments | **Deferred** until evidence requires |
