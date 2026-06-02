# Sprint 33 Context

## Title
MathJax-aware mathematical notation support across Prism generation and rendering.

## In Scope
- Delimiter preservation (`\(...\)`, `\[...\]`)
- MathJax-aware preview/export rendering
- Prompt-contract alignment for math-safe outputs
- Regression-safe rollout path

## Out of Scope
- CAS/symbolic solving
- Graphing systems
- Equation editor workflows
- Automatic checking/solving

## Primary Acceptance Criteria
- Inline/block delimiters survive transport
- Preview and export render math consistently
- Existing non-math rendering remains stable
- Rollout remains reversible
