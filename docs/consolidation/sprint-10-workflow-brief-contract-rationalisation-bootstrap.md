# Sprint 10 — Workflow Brief Contract Rationalisation (Bootstrap)

**Working title:** Sprint 10 — Workflow Brief Contract Rationalisation  
**Status (this document):** **Bootstrap / architecture framing** — companion to the **committed** contract audit (`docs/consolidation/sprint-10-contract-audit.md`, **`3bd6d10`**). **Not** a charter for immediate implementation. **No** code, generator, persistence, import/export, or domain-pack edits are authorised by this file alone.

## Purpose

Sprint 10 is the **designated** home for work that Sprint 09 **explicitly excluded**: rationalising the **workflow-generation contract** — how author inputs become **`briefLines`**, how **factors** are extracted and normalised, how **planning lifecycle** semantics flow into **step context** and **`workflowGenerationContext.js`**, and how **domain packs** expose **ids, labels, values, and hints** without accidental drift.

Sprint 07 (**review**) and Sprint 08 (**planning**) established concepts; Sprint 09 (**bounded UI**) preserved **compatibility** while clarifying **where** the contract begins. Sprint 10 must **start from audit and compatibility strategy**, not from ad hoc string edits.

## Recommended goals (subject to formal charter)

1. **Document the current contract** end-to-end: Factory UI → collected state → `briefLines` / elicitation → `extractWorkflowBriefExplicitFactors` → `workflowGenerationContext.js` → domain manifest / pack fields → prompt assembly → model output expectations.
2. **Classify surfaces** as: stable public (import/export), generator-internal (prompt-only), domain-owned (pack), vs app-owned (assembly helpers) — with explicit **deprecation** rules if anything must move.
3. **Align brief semantics** with Sprint 08 planning vocabulary **where the contract intentionally carries author intent** — without breaking saved workflows or round-trips.
4. **Factor extraction** — specify invariants (normalisation, synthetic lines, collision rules, empty vs missing) and test hooks.
5. **Planning lifecycle** — map elicitation, synthesis, and post-design edit paths to **which** contract fields mutate and when.
6. **`workflowGenerationContext.js`** — clarify responsibilities vs `app.js` (manifest resolution, brief config, template selection) and reduce implicit coupling.
7. **Domain-pack contract** — separate **presentation** hints from **generation** semantics; document id/label/value stability expectations across pack versions.
8. **Compatibility and regression strategy** — version flags, golden briefs, export fixtures, and “no silent migration” rules.

## Recommended non-goals (carry forward unless explicitly re-chartered)

- **Renderer redesign** or learner-surface layout overhaul.
- **Sequencing engine redesign** or new granular sequencing product.
- **Domain-pack rewrite** as a blanket rewrite (Sprint 10 may **touch** packs only with scoped, reviewed deltas tied to contract tables — not a wholesale replace).
- **Broad workflow-engine rewrite** (orchestration model, step graph semantics, run-mode state machine).
- **Uncontrolled feature expansion** (new wizards, new mandatory fields without audit rows and compatibility plan).

## Recommended first audit tasks (order suggested)

1. **Inventory `briefLines`** — every prefix, join order, conditional branches, and callers (`handleStartWorkflowDesign`, export paths that echo briefs, etc.).
2. **Inventory `extractWorkflowBriefExplicitFactors`** — inputs, outputs, synthetic blobs, interaction with domain `workflowBriefConfig` / factor ids.
3. **Inventory step-context builders** — `lines.push(...)`, template fragments, and any string that mirrors Factory labels.
4. **Read `workflowGenerationContext.js`** — public API, manifest keys, defaults, and all consumers in `app.js`.
5. **Domain-pack matrix** — per factor: id, label, type, persistence key, prompt usage, `uiHints` / `helpText` consumption path.
6. **Planning lifecycle diagram** — author journey from blank design → saved workflow → re-open → export; mark contract touchpoints.
7. **Gap list vs Sprint 08** — which planning terms are **not** yet represented in the contract (intentional vs accidental).

## Risk areas

- **Silent semantic migration** — same export shape, different model interpretation.
- **Prefix coupling** — models or tests assuming literal `Desired outputs: ` strings.
- **Factor id renames** — breaking saved JSON, domain overrides, or partial imports.
- **Split brain** — `app.js` defaults vs domain `uiHints` vs prompt text disagreeing on “source of truth”.
- **Elicitation vs synthesis** — changing one path without the other doubles inconsistency risk.
- **Scope creep** — fixing “one string” in `briefLines` without updating extraction, tests, and docs together.

## Suggested regression concerns

- Saved workflow **reload** after contract change.
- **Export / import** round-trip including bundles with mixed provenance (library prompts, local overrides).
- **Design-from-brief** with and without optional fields populated.
- **Cross-domain** behaviour if manifest or pack version changes.
- **Step generation** output shape (steps count, titles, artefact fields) under fixed brief fixtures.

## Suggested fixture / test strategy

- **Golden brief fixtures** — canonical brief objects / `briefLines` arrays representing minimal, full, and edge-case author inputs per domain.
- **Snapshot or contract tests** (where tooling exists) for `extractWorkflowBriefExplicitFactors` outputs given fixed inputs.
- **Before/after prompt excerpts** — redacted, stored as artefacts for human diff during pilot changes — **not** as production logs.
- **Manual smoke checklist** — extended from Sprint 09: include **design-from-brief** and **run-mode** when touching generation context.
- **Version tagging** — if contract evolves, document **minimum reader** version for import if applicable (policy decision in charter).

## Recommended governance posture

- **Audit before diff** — no production contract edit without a row in a contract table (factor id, field, old/new semantics, blast radius, rollback).
- **Explicit charter** — Sprint 10 passes (e.g. audit-only → pilot → migrate) approved per pass; this bootstrap doc does **not** substitute for charter sign-off.
- **Pair risky changes** — factor renames / prefix changes require extraction + fixture updates in the **same** change set or explicitly staged releases.
- **Preserve Sprint 07 strengths** as design constraints: compact workflows, artefact chaining, lightweight elicitation, learner-facing coherence, emergent sequencing behaviour — **unless** a chartered exception documents trade-offs.

## Related references

- **Canonical** Sprint 10 bootstrap contract audit (**committed `3bd6d10`**): `docs/consolidation/sprint-10-contract-audit.md` — inventories §§3–8 + governance synthesis §§9–12; **audit-only** / **no** implementation charter implied.
- Sprint 09 closure: `docs/consolidation/sprint-09-pass-1-closure.md`
- Sprint 09 charter + audit: `docs/consolidation/sprint-09-workflow-brief-semantics-alignment-pass-1.md`
- Sprint 08 planning: `docs/consolidation/sprint-08-workflow-planning-and-brief-semantics-alignment.md`
- Sprint 07 review: `docs/consolidation/sprint-07-workflow-generation-rationalisation-review.md`
- `docs/development/shared-vocabulary.md`, `workflowGenerationContext.js`, `domains/` manifests and packs

## Portable pack

Bootstrap prompt and continuity snapshots: `docs/development/sprints/2026-05-12-sprint-10-workflow-brief-contract-rationalisation/`

## Review log

- **2026-05-12** — **Bootstrap continuity alignment:** canonical audit path + **`3bd6d10`** echoed in consolidation refs; Sprint 09 closure handoff line updated; pack `HANDOVER` duplicate removed.
- **2026-05-12** — **Bootstrap closure / continuity alignment:** contract audit **committed** (**`3bd6d10`**); `docs/development/current-state.md`, `docs/development/session-handovers/2026-05-12-session-handover.md`, and portable sprint snapshots aligned; **audit-only** posture preserved; implementation **still** unchartered; Sprint 09 governance boundary unchanged.
- **2026-05-12** — **Contract audit scaffold added:** `docs/consolidation/sprint-10-contract-audit.md` (sections 1–11; inventory placeholders; staged migration discussion only).
- **2026-05-12** — **Bootstrap created:** goals, non-goals, audit order, risks, regression and fixture notes, governance posture. **Implementation explicitly out of scope** until Sprint 10 is chartered.
