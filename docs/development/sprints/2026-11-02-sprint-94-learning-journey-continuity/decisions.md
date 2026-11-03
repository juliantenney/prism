# Sprint 94 — Decisions

## S94-D01 — Open Sprint 94 — Learning Journey Continuity

**Date:** 2026-11-02  
**Status:** Accepted  
**Depends on:** [Sprint 93 CLOSED — ACCEPTED](../2026-10-07-sprint-93-assessment-pack-educational-contract/SPRINT-93-CLOSURE.md) (S93-D12)

**Decision:** Open **Sprint 94 — Learning Journey Continuity** as a bounded **implementation** sprint.

**Objective:** Make Learning Journey continuity a reliable commissioning contract, so later independently generated components preserve essential shared context and understand what earlier components asked learners to do.

**Authoritative basis:**

- Established investigation (2026-11-02): continuity fields exist; they are optional; Situated Task binds them; Interactive, Expository, and Assessment Pack do not consistently honour them in live first-stage prompts.
- Sprint 91 commission intake (`lib/first-class-commission-intake.js`, `commissionToIntakeEnvelope`).
- Sprint 92 educational handoff rule (honour explicit dependencies; learner-facing bring-forward; no hidden runtime state).
- Sprint 93 Gate 4 restatement of that rule for Assessment Pack.

**Not authorised by opening alone:**

- Interactive V2 / PB-FA-019;
- cross-component learner-response sharing or a unified runtime;
- Learning Journey home-page redesign;
- new first-class products;
- production code before the continuity contract was agreed.

**Predecessor:** Sprint 93 remains **CLOSED — ACCEPTED**. Do not reopen.

**First deliverable:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md). Contract agreement followed as [S94-D02](#s94-d02--retain-existing-commission-fields-p-1) … [S94-D06](#s94-d06--author-only-inspectability-p-5).

---

## S94-D02 — Retain existing commission fields (P-1)

**Date:** 2026-11-02  
**Status:** Accepted  
**Depends on:** [S94-D01](#s94-d01--open-sprint-94--learning-journey-continuity)

**Decision:** Continuity uses the existing commission fields:

- `specification_text`
- `journey_context_text`
- `dependencies`

Do **not** introduce a new structured continuity object unless implementation later demonstrates that these fields are insufficient.

The contract must distinguish:

- this component’s educational job;
- established scenario facts that must remain consistent;
- relevant preceding learner activities;
- what learners should bring forward from their own earlier work.

**Recommended field use:**

| Field | Use |
| ----- | --- |
| `specification_text` | This component’s educational job and constraints |
| `journey_context_text` | Established scenario facts (or an explicit no-shared-scenario statement) + relevant preceding activities + bring-forward |
| `dependencies` | Short pointer to earlier `commission_id`s / experience ids |

**Not authorised:** a new `preceding_activities[]` object, continuity schema, or second intake system.

---

## S94-D03 — Recurring scenarios are optional (P-2)

**Date:** 2026-11-02  
**Status:** Accepted  
**Depends on:** [S94-D02](#s94-d02--retain-existing-commission-fields-p-1)

**Decision:** Not every Learning Journey uses a shared scenario. The commissioning contract must explicitly distinguish:

1. a journey with **established scenario facts** that later components must preserve;
2. a journey that **deliberately has no recurring scenario**;
3. a journey where **required continuity information has been omitted** (validation failure — not a legitimate “no scenario” case).

Later components may introduce new evidence or developments. They must not contradict established facts where those facts exist.

A journey without a recurring scenario must say so explicitly. It must not invent locked options.

---

## S94-D04 — Meaningful preceding-activity context (P-3)

**Date:** 2026-11-02  
**Status:** Accepted  
**Depends on:** [S94-D02](#s94-d02--retain-existing-commission-fields-p-1)

**Decision:** Later commissions must describe **relevant** earlier components and what those components asked learners to do.

A generic statement such as “Continue the previous scenario” is **insufficient**.

Validation must check for **meaningful context**, not merely a non-empty string.

Later components need not reference every preceding component when only some are educationally relevant.

**Limitation (binding):** Earlier commissions describe **intended** learner activities. They do not prove what independently generated or published resources actually contain. Later components must **not** be written as if they had inspected previous published outputs or knew individual learner responses.

First commission in journey order may omit preceding-activity context.

---

## S94-D05 — Bind context from the earliest relevant generation stage (P-4)

**Date:** 2026-11-02  
**Status:** Accepted  
**Depends on:** [S94-D02](#s94-d02--retain-existing-commission-fields-p-1)

**Decision:** Use the existing Situated Task commissioning approach (`composeSituatedTaskOriginalBrief` / labelled ORIGINAL_BRIEF blocks) as the implementation pattern.

For commissioned Interactive, Expository, and Assessment Pack products, authoritative continuity context must reach the **earliest relevant content-generating stages**.

For Assessment Pack this includes the prefixed **Generate Learning Content**, **Model Knowledge**, and **Define Learning Outcomes** stages where those stages exist, not merely Interpret Evidence Purpose.

Preserve standalone (uncommissioned) product behaviour and existing pipeline stages. Do not remove Assessment Pack prefix stages. Do not invent a second intake system.

---

## S94-D06 — Author-only inspectability (P-5)

**Date:** 2026-11-02  
**Status:** Accepted  
**Depends on:** [S94-D02](#s94-d02--retain-existing-commission-fields-p-1)

**Decision:** Authors must be able to inspect the commissioning contract, including continuity requirements.

Keep `specification_text`, `journey_context_text`, and `dependencies` out of the published learner home and constituent ZIP content, except for appropriate **learner-facing instructions derived from** that contract.

Reuse existing authoring conventions. Do **not** introduce a new inspection system unless existing Authoring / commissioning surfaces cannot show the contract.

---

## S94-D07 — Close Sprint 94 — Learning Journey Continuity accepted

**Date:** 2026-11-03  
**Status:** Accepted  
**Depends on:** [S94-D01](#s94-d01--open-sprint-94--learning-journey-continuity) … [S94-D06](#s94-d06--author-only-inspectability-p-5)

**Decision:** Mark **Sprint 94 — Learning Journey Continuity** **CLOSED — ACCEPTED**.

**Basis:** Acceptance criteria in [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md) are met. WP0–WP6 are complete. Focused verification is recorded in [VALIDATION.md](VALIDATION.md) and [SPRINT-94-CLOSURE.md](SPRINT-94-CLOSURE.md). Continuity is a reliable commissioning contract for independently generated Learning Journey constituents.

**WP6 evidence (2026-11-03):** Sprint 94 + related LJ commissioning/package suites **139 passed, 0 failed**; adjacent AP/DLA suites **29 passed, 0 failed**. Live full regeneration of *Making Decisions Under Uncertainty* was intentionally not required; continuity rules are encoded in automated tests.

**Explicitly not authorised by this close:**

- cross-component learner-response transport or automatic retrieval of earlier answers;
- unified single-document Learning Journey runtime (see Sprint 95);
- Interactive V2 / PB-FA-019;
- regenerating existing Learning Journeys as a closure condition;
- Course Home / Assessment Pack calibration.

Sprint 93 remains **CLOSED — ACCEPTED**. Do not reopen Sprint 94 after this close.
