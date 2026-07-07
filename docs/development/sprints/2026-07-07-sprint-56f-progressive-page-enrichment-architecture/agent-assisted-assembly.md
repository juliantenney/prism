# Agent-Assisted Deterministic Assembly

## Scope

Document how structured artefacts enable deterministic operations via agent tooling (e.g. Python scripts in development sessions). **Not** a production Python service design.

## Principle

When artefacts are structured JSON with stable IDs, assembly operations become:

```
lookup(activity_id) → enrich field
lookup(material_id) → copy body
```

These are **deterministic** and suitable for code or agent execution — not LLM judgment.

## When agent-assisted assembly applies

| Scenario | Deterministic operation |
| -------- | ----------------------- |
| GAM enrichment | Write `materials[]` records into page by `activity_id` |
| ID validation | Set difference: required IDs vs present IDs |
| Body fidelity check | String equality or hash compare |
| Sequence attach | Copy `ordered_activity_ids` into page |
| Failure report | Emit `missing_material_ids` list |

## What agents should not do

- Summarise bodies for brevity
- Rename IDs for consistency
- Infer bodies from `required_materials.specification`
- Refuse assembly due to output length

## Relationship to progressive enrichment

Under Option 3, **each workflow stage performs its own deterministic enrichment** into the page. Agent tooling supports:

- Development-time validation scripts
- Fixture generation
- External audit automation
- Migration helpers (markdown GAM → JSON page materials)

## Not in scope

- Repository Python microservice
- PRISM runtime post-validation
- Production deployment architecture

## Example enrichment pseudocode

```python
for activity in dla.activities:
    page_activity = page.find_activity(activity.activity_id)
    for req in activity.required_materials:
        mat = gam.find_material(req.material_id)
        if mat is None:
            missing.append(req.material_id)
        else:
            page_activity.materials.append({
                "material_id": mat.material_id,
                "body": mat.body  # verbatim
            })
```

## 56E lesson applied

LLM prompts asking for this logic failed. Code/agent execution on structured JSON is the reliable path.
