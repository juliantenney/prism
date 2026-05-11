# Architecture Decisions

## 2026-05-11 - Docs consolidation and legacy example archive

### Decision

We reorganised project documentation into clearer architecture, workflow, examples, and archive areas. Legacy non-canonical workflow examples were moved into archive. Current bundled examples were moved under `docs/examples/bundles/`. Workflow platform docs were moved under `docs/workflow/`. Renderer/export behaviour documentation was moved under `docs/architecture/`.

### Rationale

The project is entering a consolidation phase. The filesystem should reflect the clearer mental model of PRISM as a structured workflow and artefact transformation platform, rather than an exploratory prototype. The cleanup reduces conceptual noise while avoiding risky domain-pack renames.

### Important constraint

Domain-pack filenames were intentionally left unchanged, including artefacts filenames, to avoid breaking manifest paths, fallback loading, and artefact-detection behaviour.

### Verification

A smoke-check confirmed that:

- the app loads
- domain manifest loads
- moved workflow docs resolve
- existing domain artefact files resolve
- Prompt Studio, Prompt Library, Manual Workflows, and Utilities panels open
- lightweight HTML preview still works
- no app console errors or missing-file errors were observed

## 2026-05-11 - HTML-first output philosophy

### Date

2026-05-11

### Decision

PRISM prioritises HTML-first outputs for learner-facing and facilitator-facing delivery surfaces.

### Rationale

HTML output is directly inspectable, easy to verify, and aligns with the current delivery and rendering strengths in Utilities.

### Consequences

- rendering and export checks remain central in smoke-testing
- page/document rendering paths are treated as first-class runtime surfaces
- format expansion is considered later and must not destabilise HTML workflows

## 2026-05-11 - Documentation consolidation and archive cleanup

### Date

2026-05-11

### Decision

Documentation was consolidated into `docs/architecture/`, `docs/workflow/`, `docs/examples/bundles/`, and `archive/docs-legacy/`.

### Rationale

A clear filesystem mental model is required for stabilisation and continuity. Legacy material should remain available without cluttering active paths.

### Consequences

- canonical documentation paths are now explicit
- legacy examples remain recoverable in archive
- manifest-linked docs require path discipline for future moves

## 2026-05-11 - Conservative artefacts naming policy

### Date

2026-05-11

### Decision

Domain-pack filenames using `artefacts` remain unchanged in this consolidation cycle.

### Rationale

Renaming to `artifacts` now would introduce avoidable risk to manifest references, fallback loading, and artefact-detection behavior during a stabilisation phase.

### Consequences

- `domain-*-artefacts.md` remains the operational filename pattern
- naming normalisation is deferred to a dedicated planned migration
- runtime stability is prioritised over immediate naming purity

## 2026-05-11 - Consolidation-before-expansion strategy

### Date

2026-05-11

### Decision

PRISM development follows a consolidation-before-expansion strategy.

### Rationale

Architectural continuity, runtime stability, and reduced conceptual drift are higher-value than rapid feature growth in the current phase.

### Consequences

- narrow implementation scope is preferred
- continuity artifacts (state snapshots, handovers, decisions) are part of normal delivery
- new feature work is gated by architectural clarity and verification readiness

## 2026-05-11 - Continuity vocabulary and bounded consolidation roadmap

### Date

2026-05-11

### Decision

PRISM now uses a shared operational vocabulary, bounded consolidation sprint docs, backlog capture docs, and explicit commit/check-in continuity conventions as part of the standard development continuity workflow.

### Rationale

Long-horizon AI-assisted development requires stable shorthand, bounded task framing, and explicit continuity artifacts across chat/session boundaries. This improves architectural traceability while keeping process lightweight.

### Consequences

- shared phrase meanings are documented in `docs/development/shared-vocabulary.md`
- active bounded work is tracked in `docs/consolidation/` sprint docs
- deferred ideas/issues are captured in `docs/backlog/` to reduce scope drift
- commit/check-in preparation is treated as a continuity artifact, not only source-control bookkeeping

