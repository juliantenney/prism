# MathJax Testing Strategy

## Core Coverage
- Inline math rendering (`\(...\)`)
- Block math rendering (`\[...\]`)
- Delimiter preservation through normalization
- Mixed markdown+math safety
- Preview/export parity
- Malformed delimiter non-crash behavior

## Fixture Families
- Inline-only
- Block-only
- Mixed markdown + math
- Assessment items with math
- Learner/facilitator parity
- Malformed delimiter cases

## Performance and Accessibility
- Long-page equation fixture for responsiveness checks
- Baseline accessibility/fallback readability verification
