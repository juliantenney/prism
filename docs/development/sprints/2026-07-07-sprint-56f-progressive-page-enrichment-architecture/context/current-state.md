# Current State — As-Is Architecture

## Workflow model (today)

Independent artefacts are generated per step:

1. Learning Outcomes
2. Learning Sequence
3. DLA → `learning_activities`
4. GAM → `activity_materials` (markdown pack text: `Material:` / `Content:`)
5. Episode Plans → `episode_plans`
6. **Design Page** → merges into `page` artefact (LLM)
7. Renderer → HTML

## Design Page role today

- Consumes multiple upstream artefacts from conversation history
- Parses GAM markdown blocks
- Assembles page JSON via LLM prompt (large defensive contracts)
- Subject to summarisation, ID remapping, gatekeeping failures

## Key code touchpoints (reference)

| Area | Location |
| ---- | -------- |
| GAM pack text format enforcement | `lib/gam-output-format.js` |
| GAM markdown parser | `parseGamMaterialsFromText()` |
| Materials copy contract | `lib/ld-materials-copy.js` |
| Design Page compose contract | `lib/ld-design-page-compose-contract.js` |
| Workflow prompt augmentations | `app.js` |
| Design Page step patterns | `domains/learning-design/domain-learning-design-step-patterns.md` |

## GAM output format today

- **Canonical:** markdown pack text (`Material:`, `Purpose:`, `Content:`)
- **JSON stubs:** explicitly rejected (`GAM-FMT-01`)

## Validation today

- Prompt-path and capture gates in PRISM
- No reliable post-run artefact fidelity validation
- External audit required for material body truth

## 56E investigation outcome

- Schema-led minimal Design Page prompt still failed fidelity
- Root issue classified as architectural, not prompt-tuning

## Target state (56F)

See [progressive-enrichment-architecture.md](../progressive-enrichment-architecture.md).
