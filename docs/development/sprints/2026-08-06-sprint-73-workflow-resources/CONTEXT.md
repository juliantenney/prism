# Sprint 73 — Context

**Status:** **COMPLETE / Closed** (2026-08-06)  
**Role:** Durable architectural context for Workflow Resources (historical + carry-forward)  
**Predecessor authority:** Sprint 72 closed pack — **link, do not rewrite evidence**  
**Backlog anchor:** [PB-FA-001](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-001--workflow-resources)  
**Final report:** [SPRINT-73-FINAL-REPORT.md](SPRINT-73-FINAL-REPORT.md)

---

## Why this sprint exists

Sprint 72 delivered evidence-centred instructional architecture but **deferred workflow asset persistence** to the product backlog as **PB-FA-001 — Workflow Resources**. **`S72-D09`** requires a **single shared model** for generated images and workflow ↔ author-evidence associations. **`S72-D10`** preserves the boundary that Copilot attachment **bytes** are not yet stable, addressable artefacts.

Sprint 73 investigates whether Prism can provide first-class Workflow Resources — starting with **generated images** as the first persistence slice — without breaking export paths, workflow continuity, author experience, or the evidence architecture validated in Sprint 72.

---

## Workflow Resources direction

Workflow Resources are expected ultimately to encompass:

- **Generated media**  
- **Uploaded documents**  
- **Embedded external resources**

Sprint 73 evaluated persistence beginning with generated images, then shipped downloadable Additional Resources and one provider-supplied embedded video under the same owner. Manually uploaded graphics and further media types remain backlog ([PB-FA-004](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-004--manually-uploaded-graphics)).

---

## Platform phase (maturation)

| Aspect | State at Sprint 73 open |
| ------ | ------------------------ |
| Instructional architecture | Productised in Sprint 72 |
| Sprint 71 findings | Fully dispositioned |
| v1.0 posture | Approaching feature completeness |
| Emphasis shift | Durability · workflow continuity · content quality · author experience · polish |
| Verification | Continuous (`S72-D14`) — not a dedicated final sweep |

---

## Workflow Resources (working definition)

A **workflow resource** is a durable learner-facing or workflow-bound asset with:

- **Stable identity** within a workflow run (and potentially across saves)  
- **Generation or upload metadata** sufficient for reconnect and selective regeneration  
- **Clear ownership** in the pipeline (which layer is canonical owner; which stages contribute or reference)  
- **Export-safe representation** (Node module path and public/browser bundle where applicable)  
- **Prompt-independence (durability target):** a persisted resource should remain usable even if its generating prompt is no longer available — Phase 1 must evaluate feasibility

Sprint 73 **evaluates** this definition against the codebase; it is not yet an implemented contract.

---

## Design principle — resource-type neutrality

> **Resource-type neutrality:** the persistence architecture must not be specialised for images. Images are the first implementation slice of a resource model intended to support multiple learner-facing resource types.

Planning constraint for discovery and design — not an implementation decision.

---

## Canonical ownership (Phase 1 central question)

> **What is the canonical owner of a workflow resource?**

Phase 1 must investigate and compare possible ownership locations, then identify the **primary owner** and **contributing/reference layers**:

| Candidate location | Role to determine |
| ------------------ | ----------------- |
| Workflow data | ? |
| Workflow step | ? |
| Visual job | ? |
| Learner page | ? |
| Export package | ? |
| Shared resource/asset store | ? |

Discovery output: documented primary owner + contributor/reference map.

---

## Generated images — known starting points (to verify in Phase 1)

Investigation should map actual code paths, including but not limited to:

- Visual planning / visual jobs planner (Sprint 70 lineage — jobs without file persistence at planning time)  
- Design Page and learner-page assembly references to images  
- Visual enhancement utility queue consumption (Copilot-generated PNGs)  
- Workflow data structures that may hold transient vs durable references  
- Export and public-export-path behaviour (Sprint 72 parity lesson)

**Do not treat this list as complete** — Phase 1 discovery must produce an authoritative lifecycle map.

---

## Shared persistence model constraint (`S72-D09`)

Workflow asset persistence for generated images and workflow ↔ author-evidence association persistence must **not** diverge into incompatible storage approaches. Phase 1 should **evaluate** a unified, **resource-type-neutral** model even if Phase 2 implements images first.

Conversation-attachment byte persistence (`S72-D10`, PB-R-001) may inform storage design but is a **separate, harder path** — do not collapse attachment bytes and generated images into one rushed design without explicit decision.

---

## Anticipated future consumers (architecture only)

| Resource type | Sprint 73 |
| ------------- | --------- |
| Generated images / media | Investigate · first implementation candidate |
| PDF uploads | Anticipated consumer — not scheduled |
| Word documents | Anticipated consumer — not scheduled |
| Embedded video | Anticipated consumer — not scheduled |

---

## Explicit non-scope

- PB-FA-002 programming learning resources  
- PB-FA-003 pipeline integrity  
- Unrelated UI polish  
- Learner renderer redesign  
- Evidence architecture changes (default: out of scope)

---

## Open questions requiring investigation (Phase 1)

| Question | Why it matters |
| -------- | -------------- |
| **What is the canonical owner of a workflow resource?** | Primary architectural decision for PB-FA-001 |
| Where do generated images live today (memory, chat, workflow JSON, URLs)? | Baseline for persistence design |
| What survives workflow refresh / navigation today? | Defines user-visible defect; author experience |
| What must export bundles include for offline/public paths? | Sprint 72 browser-bundle parity lesson |
| What storage technology fits Prism (inline base64, sidecar files, indexed blob store)? | `S72-D09` left technology open; must be resource-type-neutral |
| Can a persisted resource remain usable without its generating prompt? | Prompt-independence durability requirement |
| Can selective regeneration reconnect to stable resource IDs? | Core PB-FA-001 requirement |
| Does attachment-byte persistence belong in the same sprint slice? | Scope risk — default defer unless gate proves narrow coupling |

---

## What not to do

- Reopen Sprint 71 or Sprint 72 instructional evidence  
- Assume persistence is feasible before Phase 1 completes  
- Design an image-only persistence layer (violates resource-type neutrality)  
- Implement PDF/video/Word in Sprint 73  
- Absorb unrelated product-backlog work  
- Over-commit in charter language — use *investigate*, *determine*, *establish*, *evaluate*
