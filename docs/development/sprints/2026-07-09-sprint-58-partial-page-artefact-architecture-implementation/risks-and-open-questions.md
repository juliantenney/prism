# Risks and Open Questions — Sprint 58

## Risks

| ID | Risk | Likelihood | Impact | Mitigation |
| -- | ---- | ---------- | ------ | ---------- |
| R1 | Copilot cannot find upstream context without PRISM embed | Medium | High | Clear prompt "search STEP N OUTPUT"; user workflow discipline |
| R2 | Partial GAM missing activities | Medium | High | Assembly errors; prompt requires every `activity_id` with materials |
| R3 | Partial validators too strict — reject valid pastes | Medium | Medium | Stage-subset schemas; warn-first mode optional |
| R4 | Partial validators too loose — bad data reaches render | Medium | Medium | Minimal assembly validation; render closure warnings |
| R5 | Legacy workflow regression | Low | High | Flag gating + dedicated legacy test |
| R6 | `isPageEnrichmentV2WorkflowEnabled` hard-coded true masks legacy | High (current) | High | Phase 1 restore flag |
| R7 | Compose closure mutates partial captures on paste | High (current) | High | Gate in `syncWorkflowRunCapturedOutputToState` |
| R8 | `page_synthesis` vs `sections[]` mismatch in DP partial | Medium | Medium | ADR: prefer `page_synthesis`; dual-write optional |
| R9 | Uncommitted full-page v2 code conflicts with Sprint 58 | Medium | Medium | Revert/replace per implementation plan |
| R10 | Assembly `material_id` mismatch silent drop | Low | High | Explicit errors for missing required materials |

---

## Open questions

| ID | Question | Owner | Target resolution |
| -- | -------- | ----- | ----------------- |
| OQ-1 | GAM partial: minimal `{ activity_id, materials }` only vs include `required_materials` echo? | Sprint 58 | Phase 1 assembly design — **prefer minimal** |
| OQ-2 | DLA partial: include per-activity `episode_plan` or rely on EP shell only? | Sprint 58 | **Shell only** unless DLA partial includes it |
| OQ-3 | Design Page partial: `page_synthesis` only, or also emit `sections[]`? | Sprint 58 | **`page_synthesis` primary**; sections optional for renderer |
| OQ-4 | Where does assembly trigger — Utilities only, workflow button, or both? | Sprint 58 | Phase 4: test API + Utilities path minimum |
| OQ-5 | Should `partialPageOutputs` default true for all v2 workflows? | Sprint 58 | Yes after E2E smoke |
| OQ-6 | Retain full-page v2 rollback path for how long? | Post-58 | One sprint after partial E2E proven |
| OQ-7 | Chat-only context sufficient for LS/DP without activity lists in prompt? | Operational | Monitor first manual runs |
| OQ-8 | Assessment partial stage field names (`assessment_check` vs `assessment_design`)? | Future sprint | Stub slots in assembly only |

---

## Resolved by 57A (do not re-open)

- Full-page enrich-in-place viability → **Rejected**
- Instructional budgeting blocks implementation → **No**
- Schema version change required → **No**

---

## Escalation

If chat-only context proves insufficient in manual E2E runs, options are:

1. User pastes upstream into Copilot manually (out of band) — still not PRISM injection
2. Stronger conversational instructions in prompts
3. **Not in scope:** re-introduce PRISM upstream embed

Escalation requires ADR amendment.
