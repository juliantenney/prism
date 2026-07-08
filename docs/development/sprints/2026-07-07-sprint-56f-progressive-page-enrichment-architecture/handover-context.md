# Handover Context

## Sprint closure status (2026-07-08)

- Sprint 56F is **complete and closed**.
- Architecture/schema/ownership/finalise boundary outcomes are frozen.
- No production implementation was performed in 56F.
- Implementation is deferred.
- Follow-on investigation moves to Sprint 57A (instructional sufficiency and content budgeting).

> New work must not be added to 56F after closure except typo/link maintenance.

## For a new chat with zero prior context

### What happened before 56F

Sprints 56C–56E attempted to fix Design Page material preservation. Sprint 56E concluded that **LLM-based Design Page assembly is the wrong architecture** for deterministic transport. Investigation is frozen in commit:

`Sprint 56E complete: freeze Design Page investigation before progressive enrichment architecture`

### What 56F decides

Adopt **progressive page enrichment**: one `page` artefact enriched by Episode Plan → DLA → GAM → Learning Sequence → optional `finalise_page`. **Retire LLM Design Page merge.**

### Architecture in one paragraph

Each workflow stage writes its owned fields into a single evolving page JSON. GAM writes full material bodies once. No late-stage merge. No markdown parsing at assembly time. Renderer renders the final page. Validation is external audit only.

## Key documents

### Authoritative (post-audit, 2026-07-07)

| Priority | Document |
| -------- | -------- |
| 1 | [next-chat-briefing.md](next-chat-briefing.md) |
| 2 | [design-page-schema-vnext-freeze-proposal.md](design-page-schema-vnext-freeze-proposal.md) |
| 3 | [ownership-matrix-vnext.md](ownership-matrix-vnext.md) |
| 4 | [finalise-page-responsibility-definition.md](finalise-page-responsibility-definition.md) |
| 5 | [page-synthesis-vs-sections-investigation.md](page-synthesis-vs-sections-investigation.md) |
| 6 | [repository-ownership-schema-audit.md](repository-ownership-schema-audit.md) |

### Context (still valid)

| Document |
| -------- |
| [SPRINT-56F-START-HERE.md](SPRINT-56F-START-HERE.md) |
| [architecture-decision.md](architecture-decision.md) |
| [progressive-enrichment-architecture.md](progressive-enrichment-architecture.md) |
| [migration-plan.md](migration-plan.md) |
| [context/lessons-learned-56e.md](context/lessons-learned-56e.md) |

### Superseded (historical scaffold only)

| Document | Replacement |
| -------- | ----------- |
| [ownership-matrix.md](ownership-matrix.md) | ownership-matrix-vnext.md |
| [finalise-page-investigation.md](finalise-page-investigation.md) | finalise-page-responsibility-definition.md |

## 56E artefacts (reference only — do not extend)

Folder: `docs/development/sprints/2026-07-07-sprint-56e-design-page-minimal-refactor/`

Notable outputs:
- `design-page-contract.md` — what DP was supposed to do
- `design-page.schema.json` — page schema starting point
- `design-page-v2.prompt.md` — minimal assembler (failed fidelity in test runs)

## Discovered failure modes

- Summarised material bodies
- Empty bodies with correct IDs
- ID remapping (`A*` → `LO*`)
- LLM gatekeeping (length, authority, registry not supplied)
- Schema-valid but contract-invalid output
- False positive validation claims
- Activity-object reconstruction (reduced activity objects that drop immutable DLA-owned fields)
- Status-only / error-only self-failure output under preservation pressure

## Evidence status update (2026-07-08)

### DLA access hypothesis

Current evidence indicates GAM had access to DLA content:
- activity-specific materials were aligned to correct activities,
- page-level structure and activity titles were preserved in later runs.

Therefore, "GAM cannot see DLA" is **DISPROVEN**.

### Current dominant failure mode

Activity-object reconstruction is the active issue:
- page shell may survive,
- activity objects are still often reconstructed/compacted,
- immutable DLA-owned activity fields are dropped.

Status: **ACTIVE INVESTIGATION**.

### Current unknowns

Unknown at present:
- actual Copilot response budget,
- whether full-page GAM is comfortably within budget,
- whether full-page GAM is only slightly over budget,
- whether required-depth full-page GAM is fundamentally too large.

Status: **UNKNOWN**.

### Unsupported diagnoses (historical only)

The following are not supported by current evidence and should not be treated as current root cause:
- missing DLA artefact,
- runtime DLA access failure,
- orchestration lookup failure,
- resolver-based embedding as root cause,
- PRISM runtime inability to access prior outputs.

Keep these as historical hypotheses only.

## Ownership decisions (proposed)

- **GAM:** material bodies
- **DLA:** activity structure and required material IDs
- **Episode Plan:** page shell + episode plans
- **Learning Sequence:** order/timing
- **finalise_page:** sole owner of `page_synthesis` (optional stage; transport-first synthesis)
- **Design Page:** retire merge responsibilities

## Open questions

See [context/open-questions.md](context/open-questions.md).

Additional open architectural question:

Can PRISM's additive page-artefact model support full-page GAM enrichment at required instructional depth within practical model output limits?

No architectural decision has been made.
No architectural change has been approved.

## Recommended next actions

1. Establish evidence about output-budget constraints before architecture changes.
2. Continue prompt-level mitigation for activity-object reconstruction.
3. Keep unsupported runtime-access diagnoses out of active root-cause analysis.
4. Defer architecture changes until budget evidence is available.

## New-chat handover (minimal)

- DLA access appears available.
- Activity reconstruction remains unresolved.
- Status-only self-failure remains unresolved.
- Output-budget limits are unknown.

Current priority: gather budget evidence before architecture changes.

## Glossary

See [glossary.md](glossary.md).

## Constraints reminder

- No production changes in 56F setup
- PRISM does not post-validate workflow outputs
- LLMs generate; artefacts transport; renderer renders
