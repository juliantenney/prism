# Architecture Decision — Progressive Page Enrichment

## Status

**Proposed** (Sprint 56F setup)

## Context

35+ sprints of Design Page preservation issues culminated in Sprint 56E showing LLM-based assembly cannot reliably perform deterministic join/copy. Current workflow emits separate artefacts (DLA, GAM markdown, Episode Plan, Sequence) and asks Design Page to merge them.

## Decision

Adopt **Progressive Page Enrichment (Option 3)** as the target architecture:

- One evolving `page` artefact through the workflow
- Episode Plan creates skeletal page
- DLA, GAM, Learning Sequence enrich in place
- Optional `finalise_page` for page-level non-material enrichment only
- **Retire LLM Design Page merge step**
- Renderer renders final page JSON only

## Rationale

- Eliminates late-stage markdown parsing and ID reconciliation
- Matches LLM strengths (generation) vs weaknesses (deterministic assembly)
- Reduces failure modes observed in 56D/56E (summarisation, ID remap, gatekeeping)
- Enables agent-assisted deterministic operations on structured JSON when needed
- Aligns with PRISM constraint: no post-run validation — structure must be correct at each enrichment boundary

## Consequences

### Positive

- Single source of truth for page state
- Material bodies written once at GAM enrichment
- Clear ownership per field
- External audit becomes field comparison, not semantic inference

### Negative / trade-offs

- Requires workflow contract changes across multiple steps
- Episode Plan must create page shell (new responsibility)
- Migration from current separate-artefact model
- Existing tests/fixtures assume markdown GAM + Design Page compose

## Alternatives considered

See [architectural-options-comparison.md](architectural-options-comparison.md).

| Option | Verdict |
| ------ | ------- |
| 1. Current separate artefacts + Design Page merge | Reject — proven unreliable |
| 2. Separate JSON artefacts + deterministic assembly | Viable interim; still merge step |
| 3. Progressive enrichment | **Preferred target** |

## Design Page disposition

**Recommendation:** Remove LLM Design Page step entirely.

If a final stage is needed, use **`finalise_page`** with strictly bounded non-material responsibilities (see [finalise-page-investigation.md](finalise-page-investigation.md)).

## GAM disposition

GAM should enrich the page artefact directly with structured material records:

```json
{
  "material_id": "A1-M1",
  "material_type": "text",
  "title": "...",
  "body": "full learner-facing content"
}
```

Separate markdown `activity_materials` artefact is deprecated in target architecture.

## Implementation note

Sprint 56F is planning only. Implementation is a follow-on sprint after schema freeze and migration plan approval.
