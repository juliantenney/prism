# finalise_page Investigation

> **SUPERSEDED (2026-07-07)** — Early scaffold. The phrase “wrapper-only” here conflicts with the repository audit conclusion.
>
> **Authoritative replacement:** [finalise-page-responsibility-definition.md](finalise-page-responsibility-definition.md)
>
> `finalise_page` is the **sole writer** of `page_synthesis` (overview, learning_purpose, knowledge_summary, study_tips, support_notes). Transport-first; capped gap-fill synthesis when upstream bodies are absent. Not a merge step; does not touch activities or materials.

---

## Question
Is a final workflow stage still required after progressive enrichment?

## Answer

**Optional but likely useful** for page-level, non-material enrichment.

It is **not** a replacement for Design Page merge.

## Proposed role

`finalise_page` receives one already-enriched `page` artefact and may:

- Add or normalise page-level metadata (`title`, `audience` display labels)
- Generate navigation labels and section headings (wrapper only)
- Add page introduction / overview text **only from upstream sources or explicit profile** — not from inferring materials
- Add page summaries that transport upstream closure content
- Perform renderer-facing enrichment (section ordering labels, export metadata)
- Append final `source_artefacts` / assembly provenance entries

## Must not

- Generate learner-facing activity materials
- Merge independent artefacts (DLA, GAM, etc.)
- Rename `activity_id` or `material_id`
- Regenerate GAM content
- Replace or summarise DLA content
- Infer missing upstream content
- Parse markdown GAM blocks
- Act as fidelity validator

## Implementation options

| Approach | Description | Recommendation |
| -------- | ----------- | -------------- |
| LLM `finalise_page` | Small prompt for wrapper-only fields | Acceptable if strictly bounded |
| Deterministic `finalise_page` | Code fills metadata from profile | Preferred where possible |
| No stage | Renderer consumes enriched page directly | Valid if wrappers not needed |

## Ownership model

| Field | finalise_page may touch? |
| ----- | ------------------------ |
| `sections[].heading` | Yes |
| `overview` / `learning_purpose` (wrapper) | Yes — transport only |
| `activities[].materials[].body` | **No** |
| `activities[].learner_task` | **No** |
| `episode_plans[]` | **No** (read-only) |
| `learning_sequence` | **No** (read-only) |

## Failure model

If required material bodies are missing before `finalise_page`, the page should already have failed at GAM enrichment. `finalise_page` must not mask missing bodies.

## Recommendation

Include `finalise_page` as an **optional, bounded, non-material** stage. Default implementation should be **deterministic** where possible; any LLM use is wrapper-only with no material authority.
