# Design Page Responsibility Audit

## Purpose

Identify every responsibility currently assigned to Design Page and determine reassignment under progressive enrichment.

## Current Design Page responsibilities (from 56E contract/spec)

| Responsibility | Current mechanism | Progressive enrichment disposition |
| -------------- | ----------------- | -------------------------------- |
| Assemble page from upstream artefacts | LLM compose | **Retired** — enrichment replaces |
| Preserve activity IDs | Prompt + compose | **DLA** writes into page at enrich time |
| Preserve material IDs | Prompt + compose | **GAM** writes at enrich time |
| Copy full GAM bodies | Markdown parse + prompt | **GAM** writes `body` directly into page |
| Attach episode plans | Prompt merge | **Episode Plan** at shell + linkage |
| Preserve sequence order | Prompt merge | **Learning Sequence** enrichment |
| Preserve metadata | Prompt | **Profile + finalise_page** |
| Emit valid page JSON | Prompt | **Each stage** validates its slice; final artefact is page |
| Self-containment | Prompt invariant | **Structural** — bodies in page from GAM |
| Wrapper sections (overview, etc.) | Prompt derive | **finalise_page** (bounded) |
| Provenance (`source_artefacts`) | Prompt | **Per-stage append** |
| Validation reporting | `generation_notes` | **External audit** — not DP self-report |

## Options analysis

### A. Remove Design Page entirely

**Recommendation: Yes** (for LLM merge role)

Rationale:
- Core failures are merge/parsing/ID transport — eliminated by enrichment
- No pedagogical value in late-stage LLM pass
- 56E minimal prompt still failed fidelity tests

### B. Deterministic assembly only

Equivalent to Option 2 interim — separate JSON artefacts merged by code. Not target architecture but usable as migration bridge.

### C. Minimal `finalise_page`

**Recommendation: Optional, bounded**

See [finalise-page-investigation.md](finalise-page-investigation.md). Not a merge step.

## Responsibilities that must not survive in any final stage

- Merging independent artefacts
- Parsing GAM markdown
- Regenerating/summarising material bodies
- Renaming activity_id or material_id
- Inferring missing bodies from specifications or learning outcomes
- Acting as auditor (length, authority, confidence gatekeeping)

## Migration note

Existing Design Page prompt contracts (`LD-DESIGN-PAGE-COMPOSE-CONTRACT`, `LD-MATERIALS-COPY`, production step patterns) become **deprecated** under Option 3. Record in migration plan; do not delete in 56F setup phase.

## Recommendation

**Retire LLM Design Page step.** Replace with progressive enrichment pipeline. Optionally retain **`finalise_page`** for page-level wrapper enrichment only.
