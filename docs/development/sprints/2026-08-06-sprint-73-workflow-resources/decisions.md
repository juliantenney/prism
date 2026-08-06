# Sprint 73 — Decision Log

**Sprint status:** **OPEN** (2026-08-06)  
**Format:** ID · Decision · Status · Rationale · Consequences  

Inherited Sprint 72 binding decisions are **linked, not duplicated** — see [Sprint 72 decisions.md](../2026-07-31-sprint-72-productising-instructional-architecture/decisions.md) (`S72-D09`, `S72-D10`, `S72-D14`).

Design principles **resource-type neutrality** and **prompt-independence** are recorded in [SPRINT-73-CHARTER.md](SPRINT-73-CHARTER.md) and [CONTEXT.md](CONTEXT.md) as planning constraints — no separate decision ID unless Phase 1 elevates them to binding implementation decisions.

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

## Pending decisions (expected from Phase 1)

| Topic | Expected ID | Trigger |
| ----- | ----------- | ------- |
| Persistence feasibility | `S73-D02` | **Recorded** — feasible with explicit conditions (2026-08-06) |
| Canonical owner of a workflow resource | Discovery output | `S73-T-002` — [recommends workflow-scoped Workflow Resources layer](S73-T-002-canonical-workflow-resource-ownership.md) |
| Storage technology choice | TBD | **S73-T-003** — P5/P6/P4 promising; not selected |
| Export/regeneration compatibility | Discovery output | **S73-T-004** — **conditionally compatible**; not **S73-D02** |
| Feasibility synthesis recommendation | Discovery output | **S73-T-005** — recommendation adopted by `S73-D02` |
| Attachment-byte path in sprint scope | TBD | Default: defer; revisit only if discovery proves narrow coupling |

Do not record implementation decisions before Phase 1 evidence exists.
