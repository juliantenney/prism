# MathJax Known Risks

- Delimiter corruption during preprocessing/normalization
- Markdown cleanup and escaping conflicts
- Async typeset timing races in preview
- Double-typeset performance regressions
- CSP/script-loading restrictions
- Malformed LaTeX handling quality
- Preview/export parity drift

## Guardrails
- Apply math logic only when delimiters are present
- Keep renderer presentational
- No broad sanitizer relaxations
- Preserve existing non-math behavior
