# Glossary — Sprint 56F

| Term | Definition |
| ---- | ---------- |
| **Page artefact** | Single JSON object (`artifact_type: page`) representing the learner-facing page; evolves through workflow |
| **Progressive enrichment** | Each stage mutates only its owned fields in the page artefact — no late merge |
| **Design Page (legacy)** | LLM workflow step that merged DLA + GAM + EP + Sequence — candidate for retirement |
| **finalise_page** | Optional stage; **sole writer** of `page_synthesis` (overview, learning_purpose, knowledge_summary, study_tips, support_notes). Transport-first; not material merge. See [finalise-page-responsibility-definition.md](finalise-page-responsibility-definition.md) |
| **page_synthesis** | First-class page object for cross-activity framing and closure — not `sections[]` entries. Owner: finalise_page |
| **GAM** | Generate Activity Materials — authors full learner-facing material bodies |
| **DLA** | Design Learning Activities — activity structure, tasks, required material IDs |
| **Episode Plan** | Activity choreography; proposed to create page shell |
| **Learning Sequence** | Activity order and timing metadata |
| **activity_materials (legacy)** | Separate GAM markdown pack artefact — deprecated in target architecture |
| **Material body** | Full learner-facing content in `materials[].body` — must not be summary |
| **material_id** | Stable identifier (e.g. `A1-M1`) — immutable after assignment |
| **activity_id** | Stable activity identifier (e.g. `A1`) — immutable after DLA |
| **Enrichment** | Writing owned fields into page artefact at a workflow stage |
| **Merge (retired pattern)** | Late-stage combination of separate artefacts — rejected |
| **Transport** | Copying upstream content without authoring — deterministic where possible |
| **External audit** | Post-workflow validation by exported artefact review — PRISM cannot do this at runtime |
| **Agent-assisted assembly** | Deterministic ID lookup/copy via dev tooling on structured JSON — not production service |
| **HR Essentials** | Reference test case with materials `A1-M1` through `A6-M7` |
| **Self-containment** | Page contains full material bodies — learner does not need GAM artefact separately |
