# Sprint 91 — Decisions

## S91-D01 — Open Sprint 91 — Learning Journey First-Class Implementation

**Date:** 2026-10-06  
**Status:** Accepted

**Decision:** Open **Sprint 91 — Learning Journey First-Class Implementation** as a bounded **implementation** sprint.

**Objective:** Implement Learning Journey as a first-class PRISM product and establish the modular commission→product boundary needed for Learning Journey outputs to initialise downstream first-class product creation.

**Authoritative basis:**

- [LEARNING-JOURNEY-FOUNDATIONS.md](../2026-10-05-sprint-90-learning-journey-foundations/LEARNING-JOURNEY-FOUNDATIONS.md) (Sprint 90 — **CLOSED**; do not reopen)
- Sprint 89 first-class product architecture ([S89-D02](../2026-10-02-sprint-89-architectural-consolidation/decisions.md#s89-d02--first-class-product-pipelines-are-predetermined); `lib/first-class-workflow-family.js`)

**Not authorised by opening alone:** redesign of Interactive / Expository; Assessment Pack expansion beyond integration; Course Home; programme-level design; speculative product taxonomy; persistence platform; opportunistic rewrite of the experimentally validated reasoning prompts.

**Independent Task:** intended first-class product for subsequent implementation planning. Not a prerequisite for the Learning Journey reasoning-pipeline vertical slice. Design the commission/transfer boundary so Independent Task can join the same family cleanly; implement Independent Task in this sprint only if it remains a small extension after that boundary works.

**First deliverable:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md). No production code until the map is reviewed.

**Predecessor:** Sprint 90 remains **COMPLETE / CLOSED**.

---

## S91-D02 — Learning Journey product identity

**Date:** 2026-10-06  
**Status:** Accepted

**Decision:** The canonical first-class product id is **`learning_journey`**.

The existing Interactive renderer **page-section** id `learning_journey` is a **different namespace**. Do **not** rename the first-class product merely to avoid that collision. Disambiguate local renderer / publish usage where necessary. Do **not** conflate page-section identity with product identity.

---

## S91-D03 — Experimental prompt source

**Date:** 2026-10-06  
**Status:** Accepted

**Decision:** Production Learning Journey stage prompts must be ported from the **actual authenticated Prompt Studio experimental versions** used in Sprint 90 experiments.

Do **not** reconstruct, approximate, or “improve” those prompts from documentation.

**Source artefact (2026-10-06):** [JOURNEY-PROTOTYPE-AUTHENTICATED-EXPORT.json](JOURNEY-PROTOTYPE-AUTHENTICATED-EXPORT.json) is the authoritative in-pack export. Production ports must use each prompt’s **current top-level `body`** (JourneyRequirements, JourneyProgression, JourneyElements, JourneyCommissioning / JourneyCommission) — **not** an arbitrary historical entry from `versions[]`. Map blocker **B1 is RESOLVED**. The export file itself must not be modified.

---

## S91-D04 — First commission-intake target

**Date:** 2026-10-06  
**Status:** Accepted

**Decision:** Use **Interactive** as the first downstream commission-intake proof target.

**Reason:** Interactive provides the cleanest proof of the generic contract:

Learning Journey commission → shared commission intake → Interactive Create/briefing → existing predetermined Interactive pipeline.

Do **not** use Assessment Pack as the first proof: its existing `product_output` ingestion is a specialised finished-product-output path and could obscure whether the new commission boundary is genuinely generic.

---

## S91-D05 — Commissionability is family-declared

**Date:** 2026-10-06  
**Status:** Accepted

**Decision:** First-class product status does **not** automatically imply that a product accepts Learning Journey commissions.

Represent commissionability as a family-declared capability such as **`acceptsCommission`**, or the smallest equivalent consistent with `lib/first-class-workflow-family.js`.

Interactive, Expository, and Assessment Pack may declare that capability where appropriate.

Do **not** mark Learning Journey itself commissionable unless there is an actual supported requirement for a Learning Journey to commission another Learning Journey.

Independent Task should later attach through the same declaration mechanism.

---

## S91-D06 — Close Sprint 91 — Learning Journey First-Class Implementation complete

**Date:** 2026-10-06  
**Status:** Accepted

**Decision:** Mark **Sprint 91 — Learning Journey First-Class Implementation** **COMPLETE / CLOSED**.

**Basis:** Exit criteria and live E2E acceptance in [SPRINT-91-CLOSURE.md](SPRINT-91-CLOSURE.md) are met. Architecture at close (composition ownership, provenance hierarchy, derived production status, authoritative prepare boundary, final learner package) is recorded there.

**Explicitly not authorised by this close:**

- Situated / Self-directed Task (Independent Task) implementation;
- LMS/SCORM or other delivery packaging;
- Course Home / programme-level design;
- Journey-owned banner/media generation;
- opportunistic redesign of Interactive / Expository / Assessment Pack;
- automatic opening of a successor sprint.

**Successor:** None opened. Further work requires an explicit new opening decision from the product backlog.
