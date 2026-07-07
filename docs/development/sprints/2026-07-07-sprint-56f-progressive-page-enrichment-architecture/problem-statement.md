# Problem Statement

## Summary

The PRISM learning-design workflow treats **Design Page** as a late-stage assembler that merges DLA, GAM, Episode Plan, and Learning Sequence into one learner-facing page. Repeated sprints (including 56D and 56E) show this model fails reliably when implemented via LLM compose.

## Observed failures (56D / 56E)

Design Page outputs have repeatedly:

- Summarised GAM material bodies instead of copying them verbatim
- Regenerated or paraphrased learner-facing content
- Renamed IDs (e.g. `A1` → `LO1`, `A1-M1` → `LO1-M1`)
- Emitted empty `material.body` while material IDs were present
- Behaved as an auditor/gatekeeper (refusing to emit due to length, authority, or validation concerns)
- Claimed success (`material_coverage: pass`) while bodies were incomplete
- Required parsing markdown GAM blocks (`Material:` / `Content:`) at assembly time

## Root cause hypothesis

The failure is **architectural**, not prompt-tuning:

| Capability | LLM fit |
| ---------- | ------- |
| Generate instructional content (DLA, GAM authoring) | Good |
| Deterministic ID-preserving join/copy across artefacts | Poor |
| Markdown block extraction under token pressure | Poor |
| Self-validation of fidelity | Unreliable |

The workflow asks Design Page to perform **transport and assembly** after content has already been authored in separate artefacts. That creates:

- Duplicate representation of the same content
- Format drift (markdown GAM vs JSON page)
- ID reconciliation burden
- Late-stage failure surface with no authoritative single artefact

## What must change

Instead of:

```
DLA + GAM + Episode Plan + Learning Sequence → Design Page merge → page
```

Use:

```
Episode Plan → skeletal page
DLA → enrich page
GAM → enrich page
Learning Sequence → enrich page
optional finalise_page → page-level enrichment only
Renderer → render page
```

## Success criteria for the new architecture

- No late-stage LLM merge of independent artefacts
- Material bodies written once at GAM enrichment time
- Activity and material IDs stable from first assignment
- Assembly failures are explicit ID lookup failures, not model judgment
- Renderer consumes one final page JSON artefact

## Non-goals

- Redesigning pedagogy or instructional quality
- Building PRISM post-run validation
- Implementing a production Python microservice in this sprint
