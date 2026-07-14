# Sprint 59 — Renderer Input Pack Template

Use this template when consolidating **class B** findings for a future renderer sprint.

**Sprint 59 status:** Deferred until Full HTML evidence samples exist. Not on the active Instructional Archetype Framework critical path ([roadmap.md](roadmap.md)).

**Scope:** evidence and expected presentation outcomes only. Do **not** include CSS, components, implementation design, architecture changes, or code.

One row or section per renderer issue. Link to finding and backlog IDs.

---

## Issue record

| Field | Value |
| ----- | ----- |
| Issue ID | e.g. `S59-R-001` |
| Related finding ID(s) | e.g. `S59-F-012` |
| Related backlog ID(s) | e.g. `S59-BL-003` |
| Affected content type | From [content-type-rubric.md](content-type-rubric.md) |
| Primary class | B (renderer) |
| Frequency | e.g. 4 / 12 lessons reviewed |
| Representative lesson IDs | e.g. S01, S09, S12 |

## Evidence — content is present

| Field | Value |
| ----- | ----- |
| Assembled JSON path | |
| JSON field / material id | |
| Excerpt or summary (≤80 words) | |
| Owning stage (canonical) | EP / DLA / GAM / Assess / LS / DP |

Confirm content exists in assembled JSON before filing a renderer issue.

## Evidence — rendered presentation

| Field | Value |
| ----- | ----- |
| Rendered HTML path | |
| Observed presentation behaviour | What the learner sees (ordering, visibility, truncation, detachment, density) |
| Comparison note | What differs from JSON expectation |

Renderer issues require **Full evidence** status per [audit-plan.md](audit-plan.md).

## Impact

| Field | Value |
| ----- | ----- |
| Learner impact | How presentation affects comprehension, navigation, or task completion |
| Severity | S0–S3 |

## Expected presentation outcome

Describe the **user-visible result** a future renderer sprint should achieve — not how to implement it.

Example pattern: “Learner sees scenario body immediately above the related decision prompt, within the same activity block, without scrolling past unrelated materials.”

| Field | Value |
| ----- | ----- |
| Expected presentation outcome | |
| Success observable | How reviewers will verify without prescribing code |

## Explicit exclusions

List what this issue is **not** asking the renderer sprint to do:

- [ ] Not a generation / prompt fix
- [ ] Not a validator change
- [ ] Not an assembly merge fix
- [ ] Not new instructional content
- [ ] Other: |

---

## Markdown sketch (copy per issue)

```markdown
## S59-R-XXX — Short title

- **Content type:**
- **Frequency:**
- **Representative lessons:**
- **JSON evidence:** (path + field)
- **HTML evidence:** (path + behaviour)
- **Learner impact:**
- **Expected presentation outcome:**
- **Exclusions:**
- **Finding IDs:**
- **Backlog IDs:**
```

---

## Pack assembly checklist (sprint close)

- [ ] Every entry has primary class B with Full evidence
- [ ] JSON presence confirmed for each issue
- [ ] No implementation or CSS prescriptions included
- [ ] Linked to backlog items and per-lesson findings
- [ ] Duplicates clustered with shared frequency count
