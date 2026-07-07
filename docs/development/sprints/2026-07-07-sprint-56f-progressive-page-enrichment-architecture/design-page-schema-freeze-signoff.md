# design-page.schema.vNext — Freeze Sign-Off

**Sprint:** 56F  
**Date:** 2026-07-07  
**Schema version:** `2.0.0`  
**JSON Schema:** [design-page.schema.vNext.json](design-page.schema.vNext.json)  
**Human proposal:** [design-page-schema-vnext-freeze-proposal.md](design-page-schema-vnext-freeze-proposal.md)

---

## Status

| Item | Status |
|------|--------|
| Architecture investigation | Complete |
| Ownership audit | Complete |
| Human-readable freeze proposal | Complete |
| Open decisions OD-01–OD-10 | **Resolved** (see below) |
| JSON Schema (`design-page.schema.vNext.json`) | **Frozen** (this sign-off) |
| Workflow / prompt / renderer implementation | **Deferred** |
| Git commit of 56F folder | Pending user request |

---

## Architectural decisions frozen

1. **Progressive enrichment** — one evolving `page` artefact; each stage writes only owned fields.
2. **Design Page LLM merge retired** — no late-stage merge of DLA + GAM + EP + Sequence.
3. **`page_synthesis`** — first-class top-level object; not `sections[]` wrapper entries.
4. **Top-level `activities[]`** — not nested under `sections[]`.
5. **`activities[].materials[]`** — array with stable `material_id` (not legacy object-map `materials.text`).
6. **`finalise_page`** — sole writer of `page_synthesis`; transport-first, capped gap-fill.
7. **`sections[]`** — deprecated for new writes; renderer dual-read adapter during migration (implementation deferred).
8. **56E orphan fields removed** — `pel_links`, `metacognition_checks`, `confidence_checks`, journey arrays, `journey_extensions`.
9. **No page-level reflection/transfer/consolidation keys** — decomposed to DLA row fields + GAM materials + `study_tips`.
10. **`schema_version`:** `"2.0.0"`.

---

## Open decisions resolved

| ID | Decision | Resolution |
|----|----------|------------|
| OD-01 | finalise_page mandatory? | **Optional step.** `page_synthesis` object required; all child keys optional. |
| OD-02 | knowledge_summary prose-only? | **Allowed** with `prose_only_fallback: true` audit flag when KM bound. |
| OD-03 | activities[] placement | **Top-level** (frozen). |
| OD-04 | title owner | **Profile** default; **finalise_page** if still empty. |
| OD-05 | learning_outcomes | **Always present** array (may be `[]`). |
| OD-06 | episode_plans | **Required iff** Episode Plan step in workflow; optional in schema. |
| OD-07 | cognition pack namespace | **Flat keys** on Activity (frozen). |
| OD-08 | material_type | **Open string** + documented vocabulary in schema description. |
| OD-09 | LC/KM write page_synthesis? | **No** — finalise transport only. |
| OD-10 | schema_version value | **`"2.0.0"`** (frozen). |

---

## Freeze checklist

- [x] Approve `page_synthesis` model
- [x] Approve top-level `activities[]`
- [x] Approve `finalise_page` as sole `page_synthesis` writer
- [x] Approve removal of 56E orphan fields
- [x] Approve Design Page step retirement (architecture; implementation deferred)
- [x] Approve renderer dual-read scope (documented; implementation deferred)
- [x] Resolve OD-01–OD-10
- [x] Generate JSON Schema from approved proposal

---

## What this schema covers

- **Complete page artefact** at export/render boundary.
- Per-stage subset schemas (EP shell, post-DLA, post-GAM, etc.) are **deferred** to implementation sprint.
- External validation only (exported artefact audit) — no PRISM post-validation of workflow outputs.

---

## Deferred to implementation sprint

| Item | Notes |
|------|-------|
| Episode Plan page shell creation | First `page` artefact write |
| GAM JSON enrich in-place | `activities[].materials[]` write-once |
| `finalise_page` workflow step | Transport + capped gap-fill |
| Retire Design Page step | Remove/bypass DP merge |
| `normalizePageForRender()` adapter | Dual-read `page_synthesis` + legacy `sections[]` |
| Per-stage boundary validators | Structure correct at each enrichment boundary |
| HR Essentials test fixture | External audit snapshots |
| Stage-specific JSON Schema subsets | Optional; derived from this freeze |

---

## Superseded artefacts

| Document | Superseded by |
|----------|---------------|
| `ownership-matrix.md` | `ownership-matrix-vnext.md` |
| `finalise-page-investigation.md` | `finalise-page-responsibility-definition.md` |
| `design-page.schema.json` (56E) | `design-page.schema.vNext.json` |

---

## Related documents

- [ownership-matrix-vnext.md](ownership-matrix-vnext.md)
- [finalise-page-responsibility-definition.md](finalise-page-responsibility-definition.md)
- [repository-ownership-schema-audit.md](repository-ownership-schema-audit.md)
- [page-synthesis-vs-sections-investigation.md](page-synthesis-vs-sections-investigation.md)
- [next-chat-briefing.md](next-chat-briefing.md)
