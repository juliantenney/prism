# Sprint 92 — Closure Record

**Sprint:** 92 — Situated Task First-Class Product  
*(portable pack folder retains historical discovery title: Situated Learning Activity First-Class Product)*  
**Opened:** 2026-10-07  
**Closed:** 2026-10-07  
**Status:** **COMPLETE / CLOSED**  
**Type:** Product definition → first-class implementation  
**Opening:** [S92-D01](decisions.md#s92-d01--open-sprint-92--situated-learning-activity-first-class-product)  
**Close:** [S92-D10](decisions.md#s92-d10--close-sprint-92--situated-task-first-class-product-complete)  
**Predecessor:** [Sprint 91 — COMPLETE / CLOSED](../2026-10-06-sprint-91-learning-journey-first-class-implementation/SPRINT-91-CLOSURE.md)  
**Product identity:** [S92-D09](decisions.md#s92-d09--product-name-and-identity--situated-task)

## Closure statement

Sprint 92 closed after defining and implementing **Situated Task** as a first-class PRISM product and live-proving Gate 8 end-to-end acceptance.

| Field | Value |
| ----- | ----- |
| Label | **Situated Task** |
| `product_id` | `situated_task` |
| Commissionability | `acceptsCommission: true` |

**Core definition:**

> This product enables learning through purposeful activity undertaken by the learner in an authentic or situated context, where carrying out the activity itself is the principal learning vehicle.
>
> It prepares and bounds that activity, supports the learner in acting appropriately when circumstances vary, preserves resulting evidence/observations/thinking/other meaningful record, and reconnects that record to subsequent learning.

**Gate 8 — Live end-to-end acceptance: PASS.**

**Closing Sprint 92 does not mean** any of the following have been done:

- account / LMS / cross-device / Learning Journey learner-state interoperability for Record;
- a dedicated Assessment Pack first-class revisit ([PB-FA-017](../../../backlog/PRODUCT-BACKLOG.md));
- Course Home / programme-level design;
- LMS/SCORM or other delivery packaging;
- a Situated-specific renderer or package format;
- automatic opening of Sprint 93 / any successor.

Those remain future work. No successor sprint is opened by this closure.

---

## Architecture recorded at close

### 1. Predetermined pipeline

```text
Situation → Activity → Support → Learning Return → Design Page
```

One continuous model conversation. Stages 1–4 perform educational reasoning. Stage 5 synthesises the canonical structured artefact from that accumulated reasoning. After the structured artefact boundary, validation, workspace composition, graphics handling, rendering, persistence plumbing and publishing are deterministic.

### 2. Canonical artefact

- Ordinary shared `artifact_type: "page"` / `schema_version: "2.0.0"`.
- Product identity remains workflow/product (`situated_task`); no special page artefact type.
- Canonical Situated semantics live in `situated_learning`.
- Core educational semantics include: purpose, activity, boundaries, attention, adaptation, social configuration, stopping, record, reconnection.
- `activities: []` — Situated Task does **not** reuse Interactive DLA/GAM educational semantics.

### 3. Record architecture (Hybrid A′)

| Layer | Role |
| ----- | ---- |
| `situated_learning.record` | Educational record requirement (`retain`, optional distinctions/depth) |
| `situated_learning.record.entries[]` (optional) | Stage 5 authoring of learner recording surfaces when embedded capture is warranted (`entry_id`, `order`, `label`, optional `prompt`, optional `placement`) |
| Shared `text_entry` + draft runtime | Deterministic delivery; not the principal learning experience |
| Browser-local draft persistence | Same-browser / same-origin only — not account, LMS, cross-device, or LJ learner-state transport |

Learner response values are **not** stored in the canonical page.

### 4. Record placement (presentation)

Optional:

```json
"placement": { "after_section_id": "<section_id>" }
```

Enables **Embedded**, **Consolidated**, and **Hybrid** presentation. Stage 5 decides educationally; deterministic rendering only obeys the structured decision. No post-boundary inference from labels, IDs, prompts, section titles, or semantic similarity. Entries without placement retain the consolidated Situated record path. Multiple entries may share one section. Introduced from live evidence that all-guidance-then-all-recording separated purposeful action from recording unnecessarily.

### 5. Page-kind identity

Situated Task learner pages stamp `data-page-kind="situated_task"` from authoritative canonical `situated_learning` (not from activities[] / workspace heuristics). Interactive pages remain Interactive. Shared learner renderer; no Situated-specific renderer.

### 6. Learning Journey commissioning

Learning Journey supports `product_id: situated_task` via the shared commission-intake architecture. A commissioned Situated Task is an ordinary child workflow with normal provenance. No special runtime commissioning mechanism.

### 7. Educational handoff rule (live finding)

Learning Journey constituents are self-contained by default, but **explicit educational dependencies** between constituent experiences are legitimate.

**Accepted rule:** A commissioned product must honour explicit educational dependencies in its commission context. It must not recreate, replace, or independently determine learner work that the Learning Journey says is produced by an earlier experience.

**Learner-facing corollary:** Where a task depends on prior learner work, the product must clearly identify what the learner needs to bring forward and how it will be used. It must not depend on inaccessible hidden state.

Also:

- educational handoff is **not** learner-state interoperability;
- PRISM does not currently transport learner response values between constituent products;
- no dependency graph was required;
- LJ `specification_text`, `journey_context_text`, and `dependencies` already provide the necessary educational handoff semantics;
- **standalone:** establishes everything required to undertake its activity;
- **commissioned:** may specialise around an explicit LJ handoff without recreating earlier constituent learning.

### 8. Graphics

Reuses shared graphics architecture. Product-neutral purpose `action_support` added for visuals that help learners carry out, orient within, or notice appropriately during learner-owned action without performing the substantive learning work. Existing planner/compiler/owner-store/render path. No Situated-specific graphics subsystem.

### 9. Publishing / packaging

Shared page learner-package pipeline:

```text
authoritative assembled page
  → runUtilityPageExportPipeline
  → buildLearnerPackage
```

Standalone publishing uses shared renderer/package infrastructure. A Complete Situated Task can be included unchanged as a Learning Journey constituent. No special Situated package format.

### 10. Centre-of-gravity boundaries

| Product | Principal learning vehicle |
| ------- | -------------------------- |
| Expository | Explanation / representation |
| Interactive | Engagement with a designed/facilitated experience |
| Assessment Pack | Interpretable evidence of capability for judgement |
| Situated Task | Purposeful learner action in authentic/situated context |
| Learning Journey | Composition of progression across learning experiences |

**Negative invariant:** An activity does not belong to Situated Task merely because it asks the learner to do something.

---

## Live E2E acceptance (PASSED)

### Standalone accessibility Situated Task (five stages, unsteered)

**Brief:** “Design a situated task for university staff learning about accessibility. Learners should investigate an aspect of accessibility in their own working context and use what they discover to improve their practice. Allow approximately 2–3 hours.”

| Stage | Result | Evidence summary |
| ----- | ------ | ---------------- |
| Situation | **PASS** | Authentic workplace context; bounded 2–3 hour enquiry; learner agency; ethical/privacy boundaries; no prior LJ handoff; activity itself principal learning vehicle |
| Activity | **PASS** | Concrete Choose → Investigate → Interpret → Improve → Recheck; authentic resource/process/practice; evidence-led investigation; learner-owned judgement/action; explicit stopping |
| Support | **PASS** | Scaffolding supported rather than replaced action; observation/interpretation/action distinctions; evidence and ethical boundaries; no automatic diagnosis |
| Learning Return | **PASS** | Consequential trace from question through evidence, interpretation, improvement and recheck; reconnection to future professional practice |
| Design Page | **PASS** | Valid `page` / `2.0.0`; `activities: []`; complete `situated_learning`; educationally derived `record.entries`; learner-facing sections; shared recording workspaces |

### Live record / persistence

Proved:

```text
canonical record.entries
  → deterministic Situated workspace composition
  → shared text_entry workspaces
  → browser-local draft save
  → browser-local draft restore
```

Manual persistence testing **passed**. No further persistence plumbing was required for Gate 8 close.

### Final presentation acceptance (Stage 5 HYBRID placement)

Regenerated standalone accessibility Design Page independently chose **HYBRID** record placement:

| Entry | Placement |
| ----- | --------- |
| focus | after `choose` |
| evidence | after `investigate` |
| interpretation | after `interpret_improve` |
| improvement | after `interpret_improve` |
| recheck | after `recheck` |
| future_practice | *(omitted — consolidated reflective entry)* |

Important because the model did **not** mechanically place every entry. Rendered learner page confirmed embedded workspaces after intended sections; multiple workspaces after one section; unplaced entry in consolidated Situated record region; stable workspace IDs; shared draft persistence active; `data-page-kind="situated_task"`; `data-composed-activity-count="0"`.

### Development evidence preserved (not rewritten as inevitable)

Live findings that shaped the final architecture and must remain visible in the history:

- Stage 5 Interactive Copy fallthrough (`wrong_artifact_type`) — wiring fix;
- enactability / how-to-guide shape without recording surfaces — Slice 5 Hybrid A′;
- brittle NL enactability regex false positive — removed from schema validation;
- LJ commissioned handoff (c6→c7) vs absolute standalone — educational handoff rule;
- all-guidance-then-all-recording scroll separation + `data-page-kind="interactive"` — placement + page-kind refinement.

---

## Exit-criteria assessment

| Criterion | Assessment |
| --------- | ---------- |
| Product definition stable (gates 1–7) | **Met** |
| First-class product + five-stage pipeline | **Met** |
| Canonical `situated_learning` + `activities: []` | **Met** |
| Record entries → shared text_entry + local draft | **Met** |
| Optional placement (embedded / consolidated / hybrid) | **Met** |
| `data-page-kind="situated_task"` | **Met** |
| Learning Journey commission intake | **Met** |
| Educational handoff synthesis contract | **Met** |
| Shared graphics `action_support` | **Met** |
| Standalone + LJ constituent packaging | **Met** |
| Live Gate 8 E2E acceptance | **Met — PASS** |
| Sibling product boundaries respected | **Met** |
| Interactive / Expository / Assessment Pack not redesigned | **Met** |

## Validation at close

| Gate | Result |
| ---- | ------ |
| Sprint 92 Situated Task suites (`tests/s92-situated-task-*.test.js`) | **77/77 PASS** |
| `npm run test:first-class` | **339/339 PASS** |
| Browser bundle rebuild/check | **PASS** |

Live evidence and automated evidence both matter; test counts do not replace live acceptance. Ledger: [VALIDATION.md](VALIDATION.md).

## Production modules (checkpoint)

| Area | Location |
| ---- | -------- |
| Family registration | `lib/first-class-workflow-family.js` |
| Sibling prompts | `lib/situated-task-sibling-prompts.js` |
| Design Page | `lib/situated-task-design-page.js` |
| Record compose | `lib/learner-renderer-vnext/compose-situated-record-surfaces.js` |
| Page model / page-kind | `lib/learner-renderer-vnext/build-page-model.js` |
| Render (shared) | `lib/learner-renderer-vnext/render-page.js` |
| Graphics purpose | shared Sprint 38 visual planning vocabulary (`action_support`) |
| LJ commission / package | shared Sprint 91 intake + package path |

## Future work (not S92 blockers)

- Durable / account / LMS / cross-product Record transport
- Assessment Pack dedicated revisit ([PB-FA-017](../../../backlog/PRODUCT-BACKLOG.md))
- Richer LJ package navigation and aggregate progress UX
- Course Home / programme-level design
- LMS/SCORM or other delivery packaging

## Successor

**None opened.** Further work requires an explicit new opening decision from the product backlog. Do **not** start Sprint 93 from this closure alone.
