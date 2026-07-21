# Sprint 68 — Known Invariants

Preserve these while improving coherence.

## Model invariants (Sprint 67)

- Episode-plan activity order preserved in render
- Material IDs render exactly once
- Critical material order (e.g. A2-M3 before A2-M2; A5-M8 before A5-M7)
- Empty beats omitted
- Assessment items without answer reveal in learner view
- Beat labels from learner role mapping, not global orientation map

## Export shell invariants (Sprint 67)

- 1200px header and navigation shell
- 70ch learner reading column
- Header intro scrolls away; journey nav sticky
- Journey scroll-margin on `[data-journey-section]`
- Semantic icons on section headings and labelled prompts

## Sprint 68 coherence targets (to improve without breaking above)

- Inter-activity transitions feel intentional
- Preamble / bridge / progression fields used consistently
- Reduced redundant orientation copy where authoritative data allows consolidation **without deletion of authored content**
