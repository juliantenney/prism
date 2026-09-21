# Sprint 83 — Decision Log

**Sprint status:** **CLOSED / COMPLETE** (opened 2026-09-21; closed 2026-09-21)  
**Format:** ID · Decision · Status · Rationale · Consequences

---

## S83-D01 — Open Sprint 83 — Expository Resource Investigation

- **Decision:** Open Sprint 83 as an **investigation sprint** (not implementation) to investigate whether PRISM's existing subsystem architecture can support a high-quality first-class Expository Resource, what product-specific prompt behaviour would be required, and whether any subsystem contracts need adaptation — under backlog item [PB-FA-011](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-011--expository-resource).

- **Status:** **Accepted** (2026-09-21)

- **Rationale:**
  - Alpha development is **complete** ([S82-D04](../2026-09-01-sprint-82-maths-entry-and-alpha-completion/decisions.md#s82-d04--alpha-development-complete)); first-class gate at close was **339/339**.
  - The post-alpha canonical backlog was deliberately pruned; **PB-FA-011** is the significant product investigation now chosen.
  - A detailed investigation brief will be supplied separately; opening the pack does not by itself authorise investigation execution beyond administration, nor any implementation.
  - Working hypothesis (subsystem progression broadly sound; Expository may need its own prompt family) is recorded as **hypothesis only**.

- **Consequences:**
  - Sprint 83 pack became the active programme pointer via [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md).
  - Sprint 82 remains **CLOSED** historical record.
  - Implementation, production prompt/schema/UI/renderer changes, Expository→Interactive transformation, Podcast/Presentation work, and generic extensibility frameworks are **not** authorised by this opening.
  - Intended later Planning and Implementation sprints are **intentions**, not opened and not architecture commitments.
  - Historical debt / pruned backlog residue is **not** automatically active work.

---

## S83-D02 — Accept detailed Expository Resource investigation brief

- **Decision:** Accept the detailed Sprint 83 investigation brief supplied by the operator (product conception; pedagogical quality lens; investigation areas A–K; required stage findings; cross-cutting questions; out-of-scope constraints). Authorise **investigation execution** under that brief. Implementation remains **not** authorised.

- **Status:** **Accepted** (2026-09-21)

- **Rationale:**
  - S83-D01 opened the pack with the brief pending; the detailed brief is now available and matches the charter mission.
  - Bounded investigation tasks can now be recorded in [PLAN.md](PLAN.md) without inventing scope beyond the brief.
  - The brief explicitly forbids implementation, production prompt/schema changes, Create UI/renderer changes, and premature schema/enum design.

- **Consequences:**
  - Investigation execution was **authorised**.
  - Implementation, production behaviour changes, and Expository prompt authoring remained **forbidden**.
  - Findings recorded for a later Planning sprint — not as accidental architecture production.

- **Evidence:** Operator brief; task index [PLAN.md](PLAN.md); findings [S83-INVESTIGATION-REPORT.md](S83-INVESTIGATION-REPORT.md).

---

## S83-D03 — Accept investigation report and close Sprint 83

- **Decision:** Accept [S83-INVESTIGATION-REPORT.md](S83-INVESTIGATION-REPORT.md) as the authoritative substantive output of Sprint 83. Record the investigation as **complete**. Close Sprint 83 — Expository Resource Investigation as **COMPLETE / CLOSED**. The report is the authoritative handoff to a subsequent **Expository Resource Planning** sprint. **No Expository implementation has been authorised.**

- **Status:** **Accepted** (2026-09-21) — operator review

- **Rationale:**
  - Bounded investigation tasks S83-T-001…T-012 are complete.
  - Operator has manually reviewed and accepted the findings.
  - Closeout is administrative; findings are not architecture decisions.
  - Planning principles for the next programme step are recorded separately as [S83-D04](#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline).

- **Evidence:** [SPRINT-83-CLOSURE.md](SPRINT-83-CLOSURE.md) · [S83-INVESTIGATION-REPORT.md](S83-INVESTIGATION-REPORT.md)

- **Consequences:**
  - Sprint 83 pack status → **CLOSED**.
  - No production code, prompt, schema, UI, renderer, or test changes occurred in this sprint.
  - Expository Resource Planning sprint is the **intended next programme step** — **not opened** by this decision.
  - Exact stage names, topology, schemas, prompt contents, MK extension, continuity ownership, Interactive consumption, and Research Synthesis relationship remain **undecided** (Planning).

---

## S83-D04 — Planning handoff: sibling prompt-family & protected-baseline

- **Decision:** Record the following as **binding planning constraints** for any subsequent Expository Resource Planning (and later implementation) work. These are **not** implementation authorisations and do **not** decide topology, schemas, or prompt text.

### Sibling prompt-family principle

Expository Resource is sufficiently different pedagogically from the existing Interactive resource family that it should have its **own coherent sibling prompt family**.

The intended direction is **not**:

- adding `if Expository…` branches to existing Interactive prompts;
- making existing Interactive prompts increasingly generic;
- weakening Interactive-specific pedagogical instructions so that one prompt can serve both products;
- treating Expository as a mode inside DLA/GAM prompts.

Instead:

> Expository should reuse proven PRISM architecture and capabilities while receiving its own pedagogically coherent sibling prompts and, where the investigation shows they are required, sibling contracts/stage semantics.

Existing Interactive prompts contain substantial hard-won quality behaviour. Expository prompt design should **study and learn from** those prompts — including applicable principles around grounding and authority, instructional depth, source fidelity, claim scope, formal fidelity, graphics and representation, material quality, attachment honesty, and other quality protections — but express those principles **appropriately in the Expository prompt family**, not by introducing Expository conditionals into Interactive prompts.

### Protected-baseline principle

Treat the existing Interactive prompt family and its current pedagogical behaviour as a **protected baseline**.

> Existing Interactive prompts are not to be modified in order to make Expository Resource possible.

This does **not** prohibit genuinely shared infrastructure changes during later implementation where necessary, such as:

- product routing;
- selection of sibling prompts/contracts;
- support for additional valid artefact types;
- additive assembly capabilities;
- other product-independent infrastructure.

Such changes must be **additive** and **preserve existing Interactive behaviour**.

**Planning / implementation test:**

> Would this proposed change alter an existing Interactive prompt or its pedagogical behaviour merely so that Expository can work?

If **yes**, prefer a **sibling Expository solution** instead.

Likewise, do not generalise an Interactive-specific contract merely to avoid having a separate Expository contract where the pedagogical semantics genuinely differ.

This is **deliberate separation**, not unnecessary duplication.

- **Status:** **Accepted** (2026-09-21) — operator clarification at Sprint 83 close

- **Consequences:**
  - Planning sprint must treat S83-D04 as a handoff constraint alongside the investigation report.
  - Does not open Planning or Implementation.
  - Does not authorise any Interactive prompt edits.

---

## Pending decisions

| ID | Decision | Status |
| -- | -------- | ------ |
| — | Open Expository Resource Planning sprint | **Not opened** |
| — | Expository topology / contracts / prompt contents / naming | **Deferred to Planning** |
