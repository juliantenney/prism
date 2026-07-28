# Prism Image Brief Compiler — Sprint 70 Slice 5

**Status:** Frozen compiler boundary (compiler **70.5**, planner **70.4**, schema **38.4**)  
**Module:** `lib/prism-image-brief-compiler.js`  
**Public API:** `compilePrismImageBriefs(plannerResult)`  
**Input:** complete output of `planPrismVisualJobs(page)`  
**Does not:** crawl pages, re-resolve evidence anchors, call providers, create assets, or change rendering

---

## Responsibility

Translate canonical Prism visual jobs into **provider-neutral image briefs**.

```
assembled page
  → validateVisualPlanningContract(page)
  → planPrismVisualJobs(page)
  → compilePrismImageBriefs(plannerResult)
  → future provider adapter
```

The Design Page owns pedagogical intent. The planner owns jobs and resolved sources. This compiler owns generation-ready structured briefs plus a deterministic `generation_instruction` view.

It must **not** invent pedagogy, change representation, or add claims absent from the job / resolved sources / allowed claims.

---

## Atomicity policy

| Condition | Briefs | `valid` |
|-----------|--------|---------|
| `authoritative_planning_present: false` | `[]` | `true` (legacy) |
| Unsupported planner/schema version | `[]` | `false` |
| `plannerResult.valid === false` | `[]` (no partial briefs) | `false` |
| Malformed individual job / spoiler conflict / unsupported representation | No brief for that job; siblings may appear | `false` if any error |
| Duplicate brief IDs | Affected brief omitted | `false` |

Downstream provider use must require `compilerResult.valid === true`. Partial briefs in the array when `valid === false` are inspectable diagnostics only — not executable for providers.

---

## Brief schema (minimum)

Each brief includes: `brief_id`, `job_id`, `affordance_id`, version trio, `scope`, `activity_id?`, `visual_slot`, `purpose`, `preferred_representation`, `subject`, `context`, `source_evidence[]`, `composition`, `content_requirements`, `exclusion_requirements`, `claim_constraints`, `spoiler_constraints`, `representation_constraints`, `caption_guidance`, `discipline_guidance`, `generation_instruction`, `provenance`, `authored_passthrough`.

### Authored vs derived

`content_requirements`:

```json
{
  "authored": ["…must_show items exactly…"],
  "derived": [
    { "kind": "pedagogical_added_value", "text": "…" },
    { "kind": "reasoning_supported", "text": "…" }
  ]
}
```

Derived entries copy job fields only — no paraphrasing of `must_show`, no invented facts.

Representation `structural_guidance` is **compiler template metadata** (provider-neutral layout rules), not Design Page authored text.

---

## Deterministic brief IDs

```
job_id:  vj-38-4-va-a1-generate-01-activity-a1-materials-entry
brief_id: vb-38-4-va-a1-generate-01-activity-a1-materials-entry
```

`vj-` → `vb-` prefix swap. Duplicate IDs → `PIC_DUPLICATE_BRIEF_ID`.

---

## Source evidence

Copied only from `job.resolved_sources`. Boundaries preserved. No page crawl. Unreferenced content is never added.

---

## Representation templates

Controlled tokens = Slice 3 / Sprint 38 `REPRESENTATIONS` (15 tokens). Each has structural guidance only — no photorealistic / cinematic / watercolour / 3D / vector style presets.

Unsupported token → `PIC_REPRESENTATION_UNSUPPORTED`.

---

## Generation instruction format

Stable labelled sections:

1. Educational objective  
2. Representation (+ structural guidance)  
3. Subject  
4. Context  
5. Evidence basis  
6. Required content  
7. Excluded content  
8. Claim boundaries  
9. Spoiler boundary  
10. Discipline guidance  
11. Caption guidance  

Provider-neutral. No API syntax, dimensions, or invented artistic styles. Structured fields remain authoritative.

---

## Spoiler safety

If `anti_spoiler: true` and any resolved `source_kind` is `feedback` / `answer` / `model_answer` / `classification_key` → `PIC_SPOILER_CONFLICT`, no brief for that job. No source substitution.

Missing `spoiler_boundary` when `anti_spoiler` is true → warning `PIC_SPOILER_BOUNDARY_MISSING` (does not alone fail the job).

---

## Ordering

Preserve planner `jobs[]` order one-to-one. No re-sort by representation or ID.

---

## Legacy

Zero briefs; `legacy_path_applicable: true`. No legacy prompt heuristics.

---

## Non-mutating guarantee

Does not mutate planner result, jobs, resolved sources, or nested structured content.

---

## Explicit non-goals

No provider calls, request payloads, API keys, images, assets, alt text, final captions, renderer changes, HTML placeholders, job mutation, evidence re-resolution, page crawl, Design Page prompt changes, contract/assembly changes, provider selection, retries, caching, persistence, cost calculation, dimensions/aspect-ratio policy, or unauthored artistic styles.
