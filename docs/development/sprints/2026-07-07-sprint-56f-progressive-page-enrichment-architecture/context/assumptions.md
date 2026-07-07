# Assumptions — Sprint 56F

1. No production users — backward compatibility not required.
2. PRISM cannot inspect or validate workflow artefacts after generation.
3. Validation is external audit of exported artefacts only.
4. LLM steps remain appropriate for **content generation** (DLA, GAM authoring).
5. LLM steps are **not appropriate** for deterministic merge/copy of authored content.
6. One evolving `page` artefact is the target transport model.
7. GAM can be changed to emit structured JSON enrichment (markdown pack deprecated).
8. Episode Plan can be extended to create page shell.
9. Renderer consumes final page JSON without recovering missing upstream content.
10. Agent-assisted deterministic tooling (e.g. Python in dev) is acceptable; production Python service is not in scope.
11. `finalise_page` if present owns **`page_synthesis` only** (transport-first; capped gap-fill) — not a merge stage. **Supersedes** early “wrapper-only” assumption. See [finalise-page-responsibility-definition.md](../finalise-page-responsibility-definition.md).
12. ID schemes are never reconciled across stages (`LO1-M1` ≠ `A1-M1`).
