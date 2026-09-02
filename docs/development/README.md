# PRISM Development Docs

This directory contains the active documentation for **how PRISM is developed**, the canonical sprint history, and the programme-level Governance layer.

PRISM is in **alpha development complete** status (recorded 2026-09-02 — [S82-D04](sprints/2026-09-01-sprint-82-maths-entry-and-alpha-completion/decisions.md#s82-d04--alpha-development-complete)). Post-alpha work proceeds via backlog and future opening decisions — see [NEXT-SPRINT.md](../sprints/NEXT-SPRINT.md).

---

## Active structure

```text
docs/development/
├── governance/
├── sprints/
├── archive/
├── README.md
├── development-protocol.md
├── ENGINEERING-DISCIPLINES.md
├── shared-vocabulary.md
└── DESIGN-PAGE-EPISODE-PLANS-SCHEMA.md
```

### `governance/`

Programme-level memory and milestone alignment.

Start with:

- `MILESTONES.md`
- `EVIDENCE-AND-DECISIONS.md`
- `ARCHITECTURAL-DEBT.md`

Use `PROJECT-TRAJECTORY.md` for broader architectural context and the programme synthesis only when deeper historical provenance is needed.

See `governance/README.md`.

### `sprints/`

Canonical bounded development history.

Each sprint folder contains the material needed to understand, verify and continue that sprint. Sprint structure may vary according to the work undertaken.

### `archive/`

Superseded development-process artefacts and historical documentation retained for provenance.

Archived documents do not describe current operating practice unless explicitly revalidated.

---

## Root documents

### `development-protocol.md`

The current development workflow: sprint opening, evidence-led implementation, sprint closure, Governance curation, collaboration roles and context loading.

### `ENGINEERING-DISCIPLINES.md`

Evidence-led practices for safe architectural consolidation and removal.

### `shared-vocabulary.md`

Stable operational shorthand and current technical/documentation vocabulary.

### `DESIGN-PAGE-EPISODE-PLANS-SCHEMA.md`

A canonical technical architecture/schema document for portable Episode Plan data.

Its current implementation status should be established through repository/runtime evidence when relevant; do not casually alter architectural authorities as part of process-document cleanup.

---

# Current operating model

```text
programme milestone / Governance
            ↓
      bounded sprint
            ↓
investigate → implement → verify
            ↓
   sprint evidence / closure
            ↓
programme-significant curation
            ↓
        Governance
```

The older continuity model based on global `current-state.md`, session handovers, chat bootstraps and context packs is retired.

---

# Starting or continuing work

For routine development:

1. open the active sprint folder;
2. establish the bounded task;
3. check the current milestone;
4. load only relevant Governance evidence/debt;
5. inspect current implementation/evidence as needed;
6. work according to `development-protocol.md` and, for architectural consolidation, `ENGINEERING-DISCIPLINES.md`.

Do not load the whole historical record by default.

---

# Closing sprint work

Before declaring a bounded slice complete:

- verify behaviour with explicit provenance;
- record the evidence in the sprint;
- prepare a coherent commit/checkpoint;
- record unresolved issues;
- ask whether anything changed at programme level.

If nothing programme-significant changed, Governance does not need an update.

If something did change, curate only the relevant delta into the appropriate Governance artefact.

---

# Other project authorities

The product backlog remains separate from Governance.

A backlog item is not automatically a milestone requirement.

QA remains an evidence source for instructional quality; it does not by itself prove structural conformance, semantic lineage or completeness.

Current code and fresh behavioural evidence outrank historical documentation for claims about present runtime behaviour.

---

Keep this directory small and truthful.

Active documentation should describe **how PRISM is actually developed now**, not preserve every development method the project has used historically.
