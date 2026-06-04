# Sprint 38 — observations

Store **pedagogical visual affordance** review notes here: audit findings, taxonomy, representation mapping, enrichment schema, and enhancement handover.

Prefer short markdown with fixture IDs, prompt/domain paths, and date. Do not commit large HTML dumps unless needed for diff review; reference `buildUtilityStructuredHtmlForTest` or VEU analyse JSON instead.

---

## Affordance review template (copy per slice)

```markdown
# Slice 38-X — [title]

**Date:** YYYY-MM-DD  
**Reviewer lens:** learning designer | instructional designer | visual designer | discipline expert | enhancement operator  
**Anchors:** [fixture paths, inflation live notes, rendered HTML]  
**Change type:** observation only | prompt/domain | hook passthrough | test fixture

## Review method
- Fixtures: `tests/fixtures/page-render/….json`
- Render: `buildUtilityStructuredHtmlForTest` / `tests/utility-visual-affordance-hooks.test.js`
- Enhancement: VEU analyse step output (if run)
- Upstream fields: page / activity / materials affordance objects (if any)

## Charter questions (score Pass / Partial / Fail each)
| Question | Score | Notes |
|----------|-------|-------|
| Why is this visual here? | | |
| What cognitive job should it perform? | | |
| Is purpose explicit or inferred? | | |
| Is anti-spoiler intent explicit? | | |
| Would a human LD know what to create from affordance alone? | | |

## Current affordance payload
- Slot / hook: …
- Metadata fields present: …
- Inferred by enhancement from HTML: …

## Failure modes (if any)
- Duplicate / spoiler / wrong representation / decorative / unsupported claim

## Shallow vs enriched comparison
- Before (topic-only): …
- Target (38-4 shape): …

## Proposed changes
1. Prompt/domain: …
2. Schema / fields: …
3. VEU consumption: …

## Rejected scope creep
- …

## Regression
- `node --test tests/*.test.js` → pass / fail count
```

---

## Rubric — pedagogical quality

| Category | Pass | Partial | Fail |
|----------|------|---------|------|
| **Purpose** | Taxonomy category named | Implied by activity title only | Topic label only |
| **Representation** | `preferred_representation` matches purpose | Generic “diagram” | Stock photo / infographic summary |
| **Anti-spoiler** | Explicit boolean + avoid list when pre-task | Implicit | Reveals answers or classification keys |
| **Activity binding** | `activity_id` + material anchor | Slot only | Page-global decoration |
| **Discipline fidelity** | Canonical form cited | Acceptable simplification | Misleading metaphor |
| **Tier** | essential / valuable with justification | optional | decorative-rejected missing |

---

## File naming

- `38-1-visual-affordance-audit.md`
- `38-2-visual-purpose-taxonomy.md`
- `38-3-representation-guidance.md`
- `38-4-affordance-enrichment-design.md`
- `38-5-workflow-alignment.md`

---

## Cross-references

| Source | Path |
|--------|------|
| Sprint 36 placement inventory | `../../2026-06-03-sprint-36-session-design-visual-pedagogy/observations/36-4-imaging-placement-affordances.md` |
| Sprint 37 inflation workshop | `../../2026-06-03-sprint-37-session-framing-intellectual-coherence/observations/37-6-workshop-pedagogical-support-recalibration.md` |
| Sprint 38 fixtures | `../fixtures/README.md` |
| VEU v1.2 (repo) | `../../../../utilities/visual-enhancement-utility/` |
| VEU v1.1.1 (historical) | `../../../workflow/exports/visual-enhancement-utility-v1.1.1-patch-note.md` |
