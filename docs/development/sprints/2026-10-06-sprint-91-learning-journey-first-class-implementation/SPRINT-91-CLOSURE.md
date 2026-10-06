# Sprint 91 — Closure Record

**Sprint:** 91 — Learning Journey First-Class Implementation  
**Opened:** 2026-10-06  
**Closed:** 2026-10-06  
**Status:** **COMPLETE / CLOSED**  
**Type:** Implementation — first-class Learning Journey + commission→product boundary + hierarchy + derived production status + final learner package  
**Opening:** [S91-D01](decisions.md#s91-d01--open-sprint-91--learning-journey-first-class-implementation)  
**Close:** [S91-D06](decisions.md#s91-d06--close-sprint-91--learning-journey-first-class-implementation-complete)  
**Predecessor:** [Sprint 90 — COMPLETE / CLOSED](../2026-10-05-sprint-90-learning-journey-foundations/SPRINT-90-CLOSURE.md)  
**Foundation:** [LEARNING-JOURNEY-FOUNDATIONS.md](../2026-10-05-sprint-90-learning-journey-foundations/LEARNING-JOURNEY-FOUNDATIONS.md)

## Closure statement

Sprint 91 closed after implementing Learning Journey as a first-class PRISM product and live-proving the end-to-end lifecycle:

Learning Journey design → structured commissions → ordinary first-class constituent workflows → derived Complete status ×N → deterministic final learner package.

A real publishing fixture (short ~30-minute Learning Journey, three supported commissions) was produced independently (including parallel GPT conversations), tracked to **Complete ×3**, packaged, and manually inspected in-browser. That live E2E acceptance **PASSED**.

**Closing Sprint 91 does not mean** any of the following have been done:

- Situated / Self-directed Task (Independent Task) implemented;
- LMS/SCORM or other delivery packaging;
- Journey-owned banner/media generation;
- richer learner package navigation (Back to Journey / Previous / Next);
- aggregate Journey progress UI (“3 of 3 complete”);
- Course Home / programme-level design ([PB-FA-016](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-016--course-home--course-assembly)).

Those remain future work. No successor sprint is opened by this closure.

## Architecture recorded at close

### 1. Learning Journey is first-class

- Product id: `learning_journey` ([S91-D02](decisions.md#s91-d02--learning-journey-product-identity)).
- One continuous GPT conversation for reasoning Steps 1–4 (Requirements → Progression → Elements → Commissioning).
- Step 5 Design Page is the structured synthesis boundary.
- Canonical artefact: shared `artifact_type: "page"` with `product_id: "learning_journey"`.
- **A page is a page** — not a special `learning_journey_page` artefact type.

### 2. Composition ownership

- Learning Journey owns composition.
- Constituent products own production.
- PRISM owns deterministic commissioning, association, readiness derivation, and final assembly.
- The canonical page holds journey introduction, ordered learner-facing sections, exposition, structured commissions, and bounded LJ design metadata.
- No later AI assembly reconstructs those relationships.

### 3. Commissioning

- Supported commissions instantiate ordinary first-class workflows.
- Supported commissioned families: Interactive, Expository, Assessment Pack (`acceptsCommission` — [S91-D05](decisions.md#s91-d05--commissionability-is-family-declared)).
- Shared intake: `lib/first-class-commission-intake.js`; `specification_text` remains authoritative.
- Commissioned products are not nested execution stages.

### 4. Provenance / hierarchy

- Relationship derived from durable provenance:
  - `child.sourceWorkflowId === learningJourney.id`
  - `child.sourceCommissionId === commission.commission_id`
- No `parent.children[]`.
- My Workflows nests valid constituents under their source Learning Journey as organisational hierarchy only; children remain ordinary workflows.

### 5. Production status (derived)

Lifecycle: `not_commissioned` → `production` → `authoring` → `complete` (+ `unsupported` / `ambiguous`).

| Status | Meaning |
| ------ | ------- |
| Not commissioned | No matching constituent workflow |
| Production | Constituent exists; final Design Page / terminal capture does not |
| Authoring | Design Page exists; required graphics incomplete or indeterminate |
| Complete | Design Page exists **and** all required graphics complete |

Resources and Video do not gate Complete. Zero required graphics may Complete from Design Page alone. Unsupported commissions do not become Complete.

### 6. Authoritative status preparation

Graphics/readiness must use the same deterministic authoritative representation as Authoring:

persisted constituent state → hydrate captures → `resolvePageForRenderOrAssembly` → hydrate durable generated-image refs from owner store → assess required graphics → derive status.

Raw Design Page capture alone is insufficient where visual anchors depend on assembled content.

Shared async preparation boundary (Preview **and** package preflight):

`prepareLearningJourneyPreviewProductionByCommissionId`

Package preflight must consume its enriched `runStateByWorkflowId` — not discard it and reload lightweight runstate. Live-proven on the 3-constituent fixture.

### 7. Final learner package

Deterministic ZIP contract:

```
root/
  index.html          ← learner-facing Journey Home (not author Preview)
  [media/ …]
  c1/
    index.html
    media/…
  c2/ …
  c3/ …
```

Commission IDs are directories. Constituent packages stay isolated (media not merged). Home is rendered from the canonical LJ composition using existing section exposition. Canonical commission/section order controls composition — not My Workflows display order.

### 8. Package preflight

Reuses the **same** production-status semantics as LJ Preview. Fail closed for unsupported / missing / ambiguous / Production / Authoring / failed constituent build / missing entry points. No second completion definition for export.

## Live E2E acceptance (PASSED)

| Step | Result |
| ---- | ------ |
| Designed short Learning Journey | Met |
| Three supported commissions | Met |
| Three real constituent workflows (independent / parallel production) | Met |
| Status ladder to Complete ×3 | Met |
| Package preflight | Met |
| One learner ZIP | Met |
| Learner-facing root Journey Home + nested c1/c2/c3 | Met |
| Constituent media preserved; packages open in-browser | Met |

## Exit-criteria assessment

| Criterion | Assessment |
| --------- | ---------- |
| Learning Journey first-class product + predetermined pipeline | **Met** |
| Design Page as shared page + structured commissions | **Met** |
| Modular commission intake (Interactive / Expository / Assessment Pack) | **Met** |
| Provenance hierarchy without `parent.children[]` | **Met** |
| Derived production status + authoritative prepare boundary | **Met** |
| Final learner package + preflight | **Met** |
| Live E2E publishing fixture | **Met — PASSED** |
| Interactive / Expository / Assessment Pack not redesigned | **Met** |
| Situated / Independent Task not required for close | **Met** (future work) |

## Validation at close

| Gate | Result |
| ---- | ------ |
| Focused S91 suites (design page, commissioning, intake, hierarchy, status, package, spoiler_boundary, …) | **106/106 pass** (2026-10-06) |
| `npm run test:first-class` | **339/339 pass** (2026-10-06) |

Evidence ledger: [VALIDATION.md](VALIDATION.md).

## Production modules (checkpoint)

| Area | Location |
| ---- | -------- |
| Family registration | `lib/first-class-workflow-family.js` |
| Sibling prompts | `lib/learning-journey-sibling-prompts.js` |
| Design Page | `lib/learning-journey-design-page.js` |
| Commission intake | `lib/first-class-commission-intake.js` |
| Production status | `lib/learning-journey-commission-production-status.js` |
| Workflow hierarchy | `lib/learning-journey-workflow-hierarchy.js` |
| Learner package | `lib/learning-journey-learner-package.js` |
| Prepare / Preview / package wiring | `app.js` |

## Future work (not S91 blockers)

- Situated / Self-directed Task first-class product (motivated by unsupported LJ experiences)
- Richer learner package navigation (Back to Journey / Previous / Next)
- More compact child presentation in My Workflows
- Aggregate Journey production progress (“3 of 3 complete”)
- Journey-owned banner/media generation
- Richer unsupported-commission UX
- Further package edge-case hardening as real cases expose them
- LMS/SCORM or other delivery packaging

## Successor

**None opened.** Further work requires an explicit new opening decision from the product backlog.
