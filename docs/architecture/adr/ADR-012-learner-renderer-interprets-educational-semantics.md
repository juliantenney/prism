# ADR-012 — Learner renderer interprets educational semantics

**Status:** Accepted  
**Date:** 2026-07-22  
**Sprint:** 68 (IMP-021)  
**Related:** [learner-renderer-vnext.md](../learner-renderer-vnext.md) · [Sprint 68 closeout](../../sprints/sprint-68-closeout.md)

---

## Context

After Sprint 67, learner-renderer-vNext faithfully rendered authored structure. Sprint 68 needed richer learner interaction (composition, tables, multi-part text, ordering, local drafts) without destabilising the educational pipeline.

Two tempting directions appeared:

1. **Push interaction structure upstream** — invent renderer-oriented fields in Episode Plans / DLA / manifestation so the renderer becomes a thin template.
2. **Invent educational structure in the renderer** — hard-code activity-specific layouts and “fix” missing pedagogy in presentation code.

Both conflict with evidence from Sprints 62–67: pedagogical authority belongs upstream; presentation defects and interaction defects are different classes of problem.

---

## Decision

**Learner-renderer-vNext interprets educational semantics; it does not own educational authoring.**

Concretely:

1. Assembled page semantics (archetypes, beats, materials, tasks, ordering schemas) remain authoritative.
2. The renderer composes those semantics into Orient / Learn / Do / Check moments.
3. Learner interaction is expressed as **capability-based surfaces** (`text_entry`, `table_entry`, `ordering`, …) requested through response parts and a registry.
4. Unknown capabilities and unknown archetype variants **fail explicitly**.
5. Local draft persistence and browser runtime enhance rendered HTML; they do not redefine lesson meaning.
6. Production certification validates behaviour on an authoritative corpus.

Renderer-specific educational structures (activity-id composition tables as product rules, speculative aliases, silent surface fallbacks) are rejected.

---

## Alternatives considered

| Alternative | Rejected because |
| ----------- | ---------------- |
| Activity-hardcoded render paths (“A3 always gets a planning table”) | Couples UX to fixture ids; breaks generic composition; untestable at corpus scale |
| Expand DLA/PRISM schemas for every widget | Forces pipeline churn for presentation concerns; slows interaction iteration |
| Silent fallback (`matching` → `text_entry`) | Hides missing capabilities; corrupts assessment intent |
| Nearest-match archetype placement | Mis-assigns materials/tasks; certification cannot guarantee exactly-once |
| Persist drafts by visible label / DOM order | Unstable across re-render and i18n; breaks restore |
| Certification via full HTML golden files only | Brittle to benign markup refactors; encodes implementation |

---

## Consequences

### Positive

- New surfaces can land without PRISM/DLA/manifestation changes when semantics already exist.
- Exactly-once assignment and diagnostics make defects visible.
- Node/browser parity and deterministic identity enable certification.
- Upstream teams retain ownership of pedagogy.

### Negative / trade-offs

- Ambiguous educational data cannot be “rescued” by clever UI; it surfaces as diagnostics or non-interactive content.
- Alias support stays narrow until production evidence appears.
- Interaction features require registry + adapter + certification work (intentional cost).

### Neutral

- Legacy renderer remains available behind version selection where product policy requires it.
- Deferred items (matching, submission, remote sync) are roadmap, not incomplete Sprint 68 scope.

---

## Compliance notes for future sprints

- Prefer extending `SURFACE_KIND` + registry over new activity-special case modules.
- Prefer composition/absorption rules keyed by **semantic role**, not activity id.
- Prefer corpus certification updates over one-off HTML snapshots for release gates.
