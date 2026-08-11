# Sprint 75 — Handover

**From:** `S75-D25` Create Proposed workflow: one graph, read-only preview  
**To:** Operator review of remaining S75-T-020 candidate slices (C-09/C-11/C-12) — **no automatic further implementation**

---

## Current state

- Sprint **75** **OPEN**  
- **Latest:** `S75-D25` — Create shows one **Proposed workflow** as a compact read-only table; Draft/Refined Create chrome and Create-time graph edit (title/role/Delete/Tunable cues) retired; Save always persists `workflowDesignResult`; pack `post_generation_refinement` retained for later Settings/pack cleanup (**PB-FA-005**)  
- Prior: `S75-D24` hide resolved-brief panel; `S75-D23` progressive disclosure; `S75-D22` one-product Create; persistence closed (`S75-D21`)  
- **Sprint 76** — **not opened**

---

## Residual (not implemented)

- Rename currently creates new workflow identity  
- Duplicate creates new identity without copying runstate  
- Delete can leave orphan runstate  
- No browser unload flush for never-persisted pastes  
- `session_materials` sibling delivery artefacts (e.g. `slide_deck`) — **not** first-class Slideshow → [PB-FA-008](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-008--first-class-slideshow-product--architecture-extensibility-test)  
- Weak constraint → Run prompt propagation → [PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency)  
- Research product selection still immature → [PB-FA-009](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-009--research-domain-pack-maturation)  
- Settings IA / parameter contract → [PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency)  
- Dormant pack post-generation refinement / profile opt-in cleanup → [PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency)  
- User storage management UX → [PB-FA-007](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-007--user-controlled-storage-management)  
- Stable release process → [PB-S-005](../../../backlog/PRODUCT-BACKLOG.md#pb-s-005--stable-release--development-process)

---

## Do not

- Reopen persistence / IndexedDB Run-capture work  
- Invite multiple independent final products on LD Create  
- Add Slideshow / Assessment pack / Module outline to Create without product-contract maturity  
- Wire Create source material to DLA learner evidence  
- Reintroduce Authoring Learning object presentation mode without a new product decision  
- Reintroduce user-facing Resolved workflow brief diagnostics without a new product decision  
- Reintroduce Create Draft/Refined version chrome or Create-time graph surgery without a new product decision  
- Broadly delete pack post-generation refinement machinery without Settings/pack authorisation  
- Open Sprint 76  
