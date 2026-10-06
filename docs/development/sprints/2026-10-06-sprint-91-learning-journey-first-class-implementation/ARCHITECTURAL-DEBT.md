# Sprint 91 — Architectural debt

**Sprint:** 91 — Learning Journey First-Class Implementation  
**Status:** **COMPLETE / CLOSED** (ledger frozen at close)  
**Closure:** [SPRINT-91-CLOSURE.md](SPRINT-91-CLOSURE.md)

Canonical ledger for deferred findings and non-blocking debt discovered during Sprint 91. Do not invent speculative items.

---

## Protected prior state

| Item | State |
| ---- | ----- |
| Sprint 90 | **COMPLETE / CLOSED** — foundations authoritative; do not reopen |
| Sprint 89 | **COMPLETE / CLOSED** — first-class pipelines predetermined |
| Sprint 91 | **COMPLETE / CLOSED** — do not reopen |
| Interactive / Expository / Assessment | Not redesigned in S91 |
| Independent Task | Intended product; future work (not an S91 blocker) |

---

## Known constraints (not debt)

| Ref | Constraint |
| --- | ---------- |
| S91-D03 / B1 | **RESOLVED** — authenticated export present; port top-level current `body` only |
| S91-D02 | Product id `learning_journey` remains; Design Page is ordinary `artifact_type: "page"` with `product_id: "learning_journey"` (not a special rendered artefact type) |
| Map B4 | Unknown-product fallthrough to Interactive — LJ recognition added at `promptRoute`; residual fallthroughs for other unknown products remain until a later cleanup |
| Prepare boundary | Preview and package preflight share `prepareLearningJourneyPreviewProductionByCommissionId` |

---

## Debt ledger

| ID | Finding | Status | Notes |
| -- | ------- | ------ | ----- |
| S91-AD-001 | Automatic extraction of machine-readable commission rows from Journey Commissioning prose | **Narrowed / resolved for WP3** | WP3 Design Page now emits structured `commissions[]` on the shared page. WP4 intake still uses author-supplied / structured `specificationText` — not prose parsing. |

---

## Future work recorded at close (not S91 blockers)

- Situated / Self-directed Task first-class product
- Richer learner package navigation (Back to Journey / Previous / Next)
- More compact child presentation in My Workflows
- Aggregate Journey production progress (“3 of 3 complete”)
- Journey-owned banner/media generation
- Richer unsupported-commission UX
- Further package edge-case hardening
- LMS/SCORM or other delivery packaging
- Course Home / programme-level design ([PB-FA-016](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-016--course-home--course-assembly))
