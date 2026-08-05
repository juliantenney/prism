# Sprint 72 — Plan

**Status:** OPEN / IN PROGRESS  
**Opened:** 2026-07-31  
**Scope discipline:** Distinguish **committed** · **stretch** · **discovery** · **deferred** · **dependent**  
**Do not overcommit:** Completing every roadmap item in one sprint is not required.

Task IDs: `S72-T-###`. New backlog observations (non-S71): `S72-B-###`.

---

## Phase overview

| Phase | Name | Default commitment |
| ----- | ---- | ------------------ |
| 0 | Sprint setup and traceability | **Committed** (docs — this pack) |
| 1 | Platform principles and generation contracts | **Committed** (implemented evidence-centred activity architecture; further hardening ongoing) |
| 2 | Diagnostic feedback and related system improvements | **Committed** focus (guided-review + delayed-disclosure constraints implemented) |
| 3 | Workflow elicitation redesign | **Committed** discovery (source-bound attachment guidance implemented; broader UX prototype pending) |
| 4 | Evidence architecture | **Committed** architecture (activity-level selective model implemented; upload-byte storage deferred by design) |
| 5 | Product/UX and disciplinary representation | Mix: headings/nav ownership **committed**; additional learner-page refinement slice implemented (uncommitted) |
| 6 | Raise-the-ceiling experiments | **Discovery** (at least one strong resource) |
| 7 | Cross-disciplinary regression and sprint synthesis | **Committed** before close |

---

## Phase 0 — Sprint setup and traceability

| ID | Task | Commitment | Status |
| -- | ---- | ---------- | ------ |
| S72-T-001 | Open Sprint 72 pack to repository conventions | Committed | **Done** (2026-07-31) |
| S72-T-002 | Categorise all applicable S71 findings/obs into destinations A–F | Committed | **Done** — [findings-traceability.md](findings-traceability.md) |
| S72-T-003 | Operator approval of Charter success criteria (amendment pass) | Committed | **Done** — `S72-D07` Accepted |
| S72-T-004 | Confirm reading order / indexes (top-level + S71 successor pointers) | Committed | **Done** (2026-07-31) |

**Phase 0 status: COMPLETE.** Implementation is underway; statuses below reflect completed vs pending items.

---

## Phase 1 — Platform principles and generation contracts

| ID | Task | Commitment | Status | Depends |
| -- | ---- | ---------- | ------ | ------- |
| S72-T-010 | Map Evidence-Centred Learning + validated principles → stage/contract owners | Committed | **Done** (activity-level evidence design selected and executed) | T-002 |
| S72-T-011 | Specify Evidence-Centred Learning as first-class umbrella in platform docs/contracts | Committed | **Done** | T-010 |
| S72-T-012 | Select one major validated principle for first implementation slice | Committed | **Done** (evidence-centred activity-level slice) | T-010 |
| S72-T-013 | Implement smallest coherent Layer-1 change for selected principle | **Committed** | **Done** (DLA/GAM evidence contracts, closure, selective evidence model) | T-012 |
| S72-T-014 | Regenerate + Benchmark + Validation vs baseline | **Committed** | **Done** (indicative: RNA ~93, Heteroscedasticity ~92, Owen ~92 source-bound run) | T-013 |
| S72-T-015 | Specify Evidence Sufficiency (`S71-F-001` route A): activities evidence-completable by default | Committed | **Done (slice-level)** | T-010; dual-route `S72-D08` |

Sprint 72 **must** complete `S72-T-013` and `S72-T-014` for at least one coherent Layer-1 improvement. Other principle implementations may still be deferred.

---

## Phase 2 — Diagnostic feedback and related system improvements

| ID | Task | Commitment | Status | Depends |
| -- | ---- | ---------- | ------ | ------- |
| S72-T-020 | Behaviour spec for diagnostic feedback distinctions (vs checklist) | Committed | **Partial** (guided-review vs sample-output/check sequencing implemented) | T-010 |
| S72-T-021 | Attribute feedback gaps to Design Feedback / contributing stages | Committed | Not started | T-020 |
| S72-T-022 | Implement smallest coherent diagnostic-feedback improvement | Committed | **Done (slice)** | T-021 |
| S72-T-023 | Validate on suitable resources; check dimension gains + regressions | Committed | **Partial** (focused suites passed; broader programme pending) | T-022 |
| S72-T-024 | Related Layer-1 improvements (uncertainty, timing, evidence-centred activities) | Stretch / dependent | Not started | T-023 |

---

## Phase 3 — Workflow elicitation redesign

| ID | Task | Commitment | Status | Depends |
| -- | ---- | ---------- | ------ | ------- |
| S72-T-030 | Inventory current arcane brief fields vs instructional questions needed | Committed discovery | **Partial** | — |
| S72-T-031 | Propose progressive disclosure + discipline-sensitive elicitation model | Committed | Not started | T-030 |
| S72-T-032 | Prototype clearer elicitation UX / flow (prefer prototype) | Stretch (prefer) | Not started | T-031 |
| S72-T-033 | Define elicitation for evidence availability / upload vs generate vs forbid invent (`S71-F-001` route B) | Committed discovery | **Partial** (source-bound attachment handling + diagnostics implemented; no upload-byte ingestion) | T-031; T-015; Phase 4 |

**Direction:** structured elicitation · progressive disclosure · discipline profiles · sensible defaults · platform-owned principles · clear asks for missing subject-specific info — **not** longer free-text prompts.

---

## Phase 4 — Evidence architecture

| ID | Task | Commitment | Status | Depends |
| -- | ---- | ---------- | ------ | ------- |
| S72-T-040 | Define request / upload-select / store / associate / reuse / version model (`S71-F-001` route C) | Committed architecture | **Partial** (conversation-attachment provenance and checks implemented; storage/ingestion model deferred) | T-002 (`S71-F-001`); prefer after T-015 |
| S72-T-041 | Define how generated activities reference author-supplied artefacts | Committed | Not started | T-040 |
| S72-T-042 | Persist **workflow ↔ author-evidence** associations across refresh / navigation | Dependent on shared asset-persistence model | Not started | T-040; align with T-051 (`S72-D09`) |
| S72-T-043 | Distinguish author-supplied vs illustrative generated material in contracts | Committed | **Done (contract + diagnostics boundary)** | T-040 |
| S72-T-044 | Implement thin vertical slice of evidence upload→consume | Stretch | Not started | T-041 |

**Persistence distinction (`S72-D09`):** `S72-T-042` = workflow-to-author-evidence association persistence. `S72-T-051` = generated image assets, asset IDs, generation metadata, reconnection, and selective regeneration. Both must align with **one shared workflow asset-persistence model** — do not invent incompatible storage approaches.

---

## Phase 5 — Product / UX and disciplinary representation

| ID | Task | Commitment | Status | Linked / Depends |
| -- | ---- | ---------- | ------ | ---------------- |
| S72-T-050 | Image consistency: run/workflow visual style profile requirements | Discovery → stretch | Not started | `S72-B-001` |
| S72-T-051 | Image persistence: generated assets, IDs, generation metadata, reconnect, selective regen | Discovery → path **committed**; impl stretch | Not started | `S72-B-002`; align with T-040/T-042 shared model (`S72-D09`) |
| S72-T-052 | Programming/code representation requirements + prioritisation | Committed requirements | Not started | `S71-F-014`, `S72-B-003` |
| S72-T-053 | Specialist representations architecture path (music/maths/chem/eng) | Discovery | Not started | `S72-B-004` |
| S72-T-054 | Heading hierarchy ownership + acceptance (≤3 meaningful levels default) | Committed | Not started | `S71-O-005` |
| S72-T-055 | Navigation long-title / overflow / a11y acceptance criteria | Committed | Not started | `S71-O-001`, `S72-B-005` |
| S72-T-056 | Implement headings and/or nav fixes attributed correctly | Stretch / dependent | **Done** | T-054, T-055 |
| S72-T-057 | Bounded learner-page presentation refinement (orientation divider, table wrapping, Check→Transfer ordering, template prompts) | Committed bounded slice | **Done (currently uncommitted)** | T-056 |

---

## Phase 6 — Raise-the-ceiling experiments

| ID | Task | Commitment | Status |
| -- | ---- | ---------- | ------ |
| S72-T-060 | Select ≥1 strong ~90–91 resource as ceiling investigation baseline | Discovery committed | **Done** |
| S72-T-061 | Analyse why not ~95–98 (authenticity, evidence, feedback, transfer, fading, independence, representations, synthesis, visual coherence) | Discovery | **Partial** |
| S72-T-062 | Run one controlled improvement experiment; validate dimensions | Stretch | Not started |

Aspirational target **95–98** — not a universal score mandate.

---

## Phase 7 — Cross-disciplinary regression and sprint synthesis

| ID | Task | Commitment | Status |
| -- | ---- | ---------- | ------ |
| S72-T-070 | Cross-discipline regression checks for Layer-1 changes | Committed before close | **Partial** |
| S72-T-071 | Update STATUS / traceability with outcomes | Committed | **In progress** |
| S72-T-072 | Sprint synthesis + closure pack (later — **not** opened at pack create) | Deferred until ready | Not started |
| S72-T-073 | Owen rerender/inspection after bridge + presentation updates | Immediate | **In progress** (lower-level fixture coverage passed while real export path diverged; traced divergence to browser-bundle runtime path + cross-beat Learn pull from Do-owned instruction; corrected and validated on public export path; awaiting operator rerender inspection pass) |
| S72-T-074 | Commit verified Sprint 72 implementation slice | Immediate | **Pending** |

---

## Initial ordered task list (execution start)

1. **`S72-T-073`** — Re-render Owen page after bridge + presentation updates (**next**)  
2. `S72-T-070` — Final focused QA / benchmark checks for this slice  
3. `S72-T-074` — Commit verified Sprint 72 implementation slice  
4. `S72-T-071` — Update sprint synthesis/status after commit  
5. `S72-T-040` / `S72-T-042` / `S72-T-051` — Deferred hardening path (shared persistence model)

---

## Explicit non-promises

- Not every Phase 3–6 implementation item will ship in Sprint 72.  
- Specialist renderers beyond a prioritised path are out of default scope.  
- Image persistence **implementation** is included only if dependencies permit after the path is documented — the path itself remains committed and must share the workflow asset-persistence model with `S72-T-042`.  
- Additional principle implementations beyond the one committed Layer-1 slice may be deferred.
