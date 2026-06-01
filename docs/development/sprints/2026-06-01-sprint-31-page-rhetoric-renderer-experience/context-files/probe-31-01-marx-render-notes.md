# Probe 31-01 — Marx live render (slice 31-1)

**Date:** 2026-06-01  
**Source:** `../2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/live-artefacts/marx-page.json`

## Renderer changes verified

| Check | Result |
|-------|--------|
| `source_artefacts` / `generation_notes` not H2 in main body | Pass |
| Production traceability in `details.util-meta` | Pass |
| Meta summary label `About this page` | Pass |
| `Audience:` line suppressed (`page_profile: learner`) | Pass |
| PEL / activity content unchanged in body | Pass (automated Marx tests green) |

## Rubric rows 7–9 (metadata boundary)

| # | Score | Notes |
|---|-------|-------|
| 7 | Pass | No upstream keys as body H2 |
| 8 | Pass | Meta fold present, collapsed by default |
| 9 | Pass | Fold labelled for traceability, not lesson content |

**Overall:** Pass
