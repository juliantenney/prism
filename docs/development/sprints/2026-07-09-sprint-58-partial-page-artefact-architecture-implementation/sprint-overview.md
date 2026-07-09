# Sprint Overview — 58

## Sprint

| Field | Value |
| ----- | ----- |
| ID | 58 |
| Title | Partial Page Artefact Architecture Implementation |
| Type | Implementation |
| Status | Active |
| Opened | 2026-07-09 |
| Predecessor | Sprint 57A (closed) |
| Schema baseline | Sprint 56F `2.0.0` (frozen) |

## Goal

Deliver a working end-to-end page generation pipeline where post-Episode-Plan stages emit partial v2 page artefacts, PRISM stores them per workflow step, and deterministic code assembles a renderable page.

## Problem being solved

Full-page enrich-in-place failed empirically: LLMs reconstruct, prune, or truncate prior page content when asked to return complete pages. Partial outputs + code assembly removes the preservation burden from the model.

## Success criteria (summary)

- Post-EP prompts request partial artefacts only
- No upstream capture injection into post-EP prompts
- Partial captures validate and store correctly
- Assembly produces structurally valid full pages from step captures
- Renderer produces HTML from assembled pages
- Legacy non-v2 workflows unchanged

## Phases

| Phase | Focus |
| ----- | ----- |
| 1 | Gates, ADR, assembly module (pure) |
| 2 | Partial validators + capture sync |
| 3 | Prompt contract rewrites + injection removal |
| 4 | Render integration + E2E smoke |
| 5 | Test hardening + legacy regression |

Detail: [implementation-plan.md](implementation-plan.md)

## Out of scope

Instructional-budget research, API integration, LLM reconciliation, schema amendment without ADR.
