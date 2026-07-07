# Handover Context

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

## Ownership decisions (proposed)

- **GAM:** material bodies
- **DLA:** activity structure and required material IDs
- **Episode Plan:** page shell + episode plans
- **Learning Sequence:** order/timing
- **finalise_page:** sole owner of `page_synthesis` (optional stage; transport-first synthesis)
- **Design Page:** retire merge responsibilities

## Open questions

See [context/open-questions.md](context/open-questions.md).

## Recommended next actions

1. Approve architecture decision (Option 3)
2. Freeze evolving page schema (extend 56E schema)
3. Define GAM enrichment contract (JSON materials into page)
4. Plan workflow binding changes per migration phases
5. Implement Phase 2 (GAM JSON) in follow-on implementation sprint

## Glossary

See [glossary.md](glossary.md).

## Constraints reminder

- No production changes in 56F setup
- PRISM does not post-validate workflow outputs
- LLMs generate; artefacts transport; renderer renders
