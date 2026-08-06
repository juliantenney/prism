# Sprint 73 — Decision Log

**Sprint status:** **COMPLETE / Closed** (2026-08-06)  
**Format:** ID · Decision · Status · Rationale · Consequences  
**Final report:** [SPRINT-73-FINAL-REPORT.md](SPRINT-73-FINAL-REPORT.md) · [SPRINT-73-CLOSURE.md](SPRINT-73-CLOSURE.md)

Inherited Sprint 72 binding decisions are **linked, not duplicated** — see [Sprint 72 decisions.md](../2026-07-31-sprint-72-productising-instructional-architecture/decisions.md) (`S72-D09`, `S72-D10`, `S72-D14`).

Design principles **resource-type neutrality** and **prompt-independence** are recorded in [SPRINT-73-CHARTER.md](SPRINT-73-CHARTER.md) and [CONTEXT.md](CONTEXT.md). Page-owned video/resource presentation and final UI tab-count polish are recorded in implementation/verification notes (not separate decision IDs).

---

## S73-D01 Sprint 73 scope — PB-FA-001 Workflow Resources (discovery-led)

- **Decision:** Sprint 73 is opened on **PB-FA-001 — Workflow Resources**. Workflow asset persistence is the initial implementation mechanism, beginning with generated images. Phase 1 is architecture discovery; Phases 2–3 (persistent generated images; generalised resource model) proceed **only if** the feasibility decision gate confirms persistence is practical.
- **Status:** Accepted (2026-08-06)
- **Rationale:** Strongest future-architecture candidate with binding predecessor decisions (`S72-D09`, `S72-D10`); maturation-phase priority (durability / workflow continuity / author experience); readiness bar for *implementation* not yet met — discovery completes approach and acceptance criteria.
- **Consequences:** Sprint pack scoped to PB-FA-001; unrelated backlog items excluded; Phase 2 tasks remain blocked until gate; resource-type neutrality applies to all persistence design options evaluated in Phase 1.

---

## S73-D02 Workflow Resource persistence is feasible with explicit conditions

- **Decision:** Workflow Resource persistence is **feasible with explicit conditions**. Prism may proceed to a tightly bounded Phase 2 generated-image persistence slice **only if** the Phase 2 acceptance criteria explicitly include the proof obligations and operational limits identified in Phase 1.
- **Status:** Accepted (2026-08-06)
- **Rationale:** Phase 1 evidence (`S73-T-001` through `S73-T-005`) shows stable semantic identity anchors already exist (`affordance_id` plus derived `job_id`/`brief_id`/`asset_id`), while the missing capability is durable canonical ownership and payload persistence across sessions. The recommended owner remains a workflow-scoped Workflow Resources layer; current Utilities workspace custody (`assetsByBriefId`) and `visualAssetManifest` remain transient. Render/export paths are projection-fed and can consume regenerated `(workflow + owner + projection)` inputs; preview/standalone HTML/ZIP are derived outputs and should not be persisted as canonical state. Promising persistence shapes exist (P5/P6 with P4 payload tier), but practical constraints remain: browser capacity variability, runtime memory overhead across multiple representations (`data_url`, decoded image, ZIP buffers), asynchronous payload-read boundaries, browser storage reliability/eviction, and browser/Node parity risks. Therefore feasibility is conditional, not absolute.
- **Consequences:** Phase 2 is unblocked for **planning only**. `S73-T-010` may now define and record the bounded acceptance criteria; `S73-T-011` and `S73-T-012` remain blocked until `S73-T-010` completes. Implementation must persist only minimal authoritative state for rehydration/reuse (stable resource identity, workflow-intent linkage, payload or durable payload reference, essential learner-facing metadata, and necessary workflow reconstruction context) and must not treat visual jobs, image briefs, generation prompts (unless independently required), manifests, object URLs, preview/standalone HTML, `utilitiesLastHtml`, package paths, or ZIPs as canonical persisted resources. No final storage technology, final schema, or implementation design is selected by this decision. Phase 3 remains blocked. PDF/Word/video implementation and programming-resources scope remain out of scope. Evidence architecture remains unchanged unless a later narrow necessity is demonstrated. `S72-D09` remains binding: Workflow Resources persistence and future workflow-author-evidence association persistence must remain model-compatible.

---

## S73-D03 MVP video embed contract is verbatim storage/render

- **Decision:** Provider-supplied video embed code is stored and rendered verbatim. Prism does not parse, normalise, sanitise or reconstruct embed code in the MVP. Empty input is rejected; responsibility for valid provider markup remains with the author/provider.
- **Status:** Accepted (2026-08-06)
- **Rationale:** Keeps Phase 3 MVP implementation small and reversible while preserving the requested provider wrapper markup contract.
- **Consequences:** Video rendering uses provider markup as-is; no provider adapters, no player abstraction, and no sanitisation controls in this slice.

---

## Discovery / gate topics (resolved or deferred at close)

| Topic | Outcome |
| ----- | ------- |
| Persistence feasibility | **`S73-D02`** — feasible with explicit conditions |
| Canonical owner of a workflow resource | Workflow-scoped Workflow Resources layer — [S73-T-002](S73-T-002-canonical-workflow-resource-ownership.md); implemented in Phase 2/3 |
| Minimal authoritative persistence / regenerate HTML·ZIP | Binding via `S73-D02` + T-004; shipped |
| Provider embed verbatim | **`S73-D03`** |
| Attachment-byte path in sprint scope | **Deferred** — [PB-R-001](../../../backlog/PRODUCT-BACKLOG.md#3-research--design-questions) / `S72-D10` |
| Manually uploaded graphics | **Backlog** — [PB-FA-004](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-004--manually-uploaded-graphics) |
| Orphan / mixed-data cleanup | **Research** — [PB-R-008](../../../backlog/PRODUCT-BACKLOG.md#3-research--design-questions) |

No further Sprint 73 decisions are pending. Sprint 74 was not opened by closeout.
