# Sprint 85 — Decision Log

**Sprint status:** **OPEN** (opened 2026-09-21) — Implementation in progress  
**Format:** ID · Decision · Status · Rationale · Consequences  
**Authoritative design:** [S84-EXPOSITORY-RESOURCE-DESIGN.md](../2026-09-21-sprint-84-expository-resource-planning/S84-EXPOSITORY-RESOURCE-DESIGN.md)

---

## S85-D01 — Open Sprint 85 — Expository Resource Implementation

- **Decision:** Open Sprint 85 as an **Implementation** sprint to build the accepted first-class Expository Resource under [PB-FA-011](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-011--expository-resource), following [S84-EXPOSITORY-RESOURCE-DESIGN.md](../2026-09-21-sprint-84-expository-resource-planning/S84-EXPOSITORY-RESOURCE-DESIGN.md) and binding [S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline) (sibling prompt-family · protected Interactive baseline).

- **Status:** **Accepted** (2026-09-21)

- **Rationale:**
  - Sprint 84 Planning is **COMPLETE / CLOSED**; the refined design is operator-accepted ([S84-D12](../2026-09-21-sprint-84-expository-resource-planning/decisions.md#s84-d12--accept-refined-planning-design-and-close-sprint-84)).
  - Operator has separately authorised opening the implementation successor.
  - A detailed implementation brief will be supplied separately; opening the pack does not invent the task list or begin production work.

- **Consequences:**
  - Sprint 85 pack is the active programme pointer via [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md).
  - Sprint 83 and Sprint 84 remain **CLOSED** — do not reopen architecture.
  - Production implementation is now **authorised only within Sprint 85 scope**, after the separate implementation brief is accepted.
  - Alpha-complete programme state and Interactive first-class engineering baseline remain protected.

---

## S85-D02 — Accept detailed Sprint 85 implementation brief

- **Decision:** Accept the detailed Sprint 85 implementation brief (objectives; binding principles A1–A3; elicitation invariance; domain-pack/capability trace; authority/north star; section structure; sibling stages F1–F7; graphics/maths/a11y; assembly/renderer/export; vertical work packages WP1–WP7; implementation discipline). Authorise **production implementation** under that brief within Sprint 85 scope.

- **Status:** **Accepted** (2026-09-21)

- **Consequences:**
  - Bounded implementation tasks recorded in [PLAN.md](PLAN.md) (S85-T-001… mapped to WP1–WP7).
  - Do not reopen S84 architecture; do not modify Interactive prompts to enable Expository.
  - Create elicitation remains shared; add only `expository_resource` product choice.
  - Commit only when operator instructs.

---

## S85-D03 — Create product entry and Expository topology routing (WP1)

- **Decision:** Add Create product `expository_resource` (“Expository Resource”) alongside Self-study and Workshop without a separate Create form. Product selection seeds self-directed learner-page factors with `activities_required: false` and drives heuristics to construct:

```text
[Normalize?] → GLC → MK → LO → Expository Journey Plan → Expository Development → Expository Materials → Design Page
```

bypassing Interactive EP / DLA / GAM / Learning Sequence. Register EJP/XD/XM as LD canonical steps with scaffolding prompt factories (full pedagogy in WP3). Domain packs continue via existing selected-domain context (General + LD).

- **Status:** **Accepted** (2026-09-21)

- **Evidence:** `tests/s85-wp1-expository-topology.test.js` · extended `tests/s75-c06-ld-create-output-selection.test.js`

---

## S85-D04 — Minimum EJP/XD/XM contract trim (WP2 verification)

- **Decision:** Keep ordered `sections[]` as primary semantic unit. Collapse redundant XD `explanatory_treatment` into `explanation_intent` (legacy alias read). Do not default commission `kind` (free pedagogical label, not taxonomy). Preserve commission-lock validator. No Interactive activity/workspace/evidence fields.

- **Status:** **Accepted** (2026-09-21) — verification checkpoint

- **Evidence:** `lib/expository-contracts.js` · `tests/s85-wp2-expository-contracts.test.js`

---

## S85-D05 — Expository Scale / scope → explanatory-attention extent (WP2)

- **Decision:** Preserve the existing Create **Scale / scope** field unchanged as the single user-facing extent elicitation. For `expository_resource` only, derive an optional approximate **content extent** planning input (`expository_extent` / EJP `extent`) from that text:
  - explicit word-count intent → `words_equivalent` (approximate);
  - reading-time intent → `words_equivalent` via documented **200 words/minute** planning assumption;
  - qualitative descriptions remain meaningful without inventing numeric precision.
  Word count is a **planning constraint**, not a pedagogical objective and not a pad/truncate quota. **EJP** is the primary pedagogical owner: it allocates explanatory attention across the intellectual journey. **XD** inherits section-level implications of that allocation; **XM** realises commissions within those constraints. Do **not** change Interactive scale/scope semantics; do **not** build a generic token/content-budget framework.

- **Status:** **Accepted** (2026-09-21)

- **Placement:** Smallest coherent path — Expository-specific normalisation in `lib/expository-contracts.js`, optional factor `expository_extent` on Create product seed path, minimal optional EJP `extent` field, brief injection for EJP authoring. No new subsystem.

- **Evidence:** `lib/expository-contracts.js` · `lib/page-vnext-assemble.js` (Expository merge) · `tests/s85-wp2-expository-contracts.test.js`

---

## S85-D06 — XM does not reuse GAM Interactive machinery (WP3)

- **Decision:** At WP3, **Expository Materials** uses the native Expository materials contract and sibling prompt only. Do **not** route XM through GAM Interactive assembly/copy paths, activity `required_materials`, or GAM verification gates. Lower-level product-independent body-authoring aids (e.g. maths/table fidelity overlays) may be considered later in WP4 only where genuinely product-independent and without Interactive contract coupling.

- **Status:** **Accepted** (2026-09-21)

- **Rationale:** S83-D04 / S84 require sibling pedagogy; GAM is Interactive materials realisation. Commission lock and extent constraints are Expository-owned.

---

## S85-D07 — Expository sibling prompt family + domain guidance consumption (WP3)

- **Decision:** Author production Expository sibling prompts in `lib/expository-sibling-prompts.js`, selected at Run/Copy via `resolveWorkflowStepPromptTemplate` when the workflow is Expository (or the step is a dedicated `step_expository_*`). Interactive pack `promptTemplate` strings for GLC/LO/DP/EP/DLA/GAM remain unmodified. Domain guidance reaches Expository stages by injecting General + selected-domain **prompt-rules** through established pack paths (`PrismExpositoryDomainGuidance` + WGC cache / disk), without Expository-specific domain pack copies. Catalog extraction accepts lettered headings (`## 11A.`).

- **Status:** **Accepted** (2026-09-21)

- **Evidence:** `lib/expository-sibling-prompts.js` · `lib/expository-domain-guidance.js` · `tests/s85-wp3-expository-sibling-prompts.test.js`

---

## Pending decisions

| ID | Decision | Status |
| -- | -------- | ------ |
| — | Product-independent body-authoring overlays for XM (maths/tables) | **Pending** (WP4; S85-D06) |
| — | Research Synthesis identity | **Remains open** (non-blocking) |
| — | Expository-specific Adjustments | **Deferred** unless evidence requires |
