# Sprint 33 Handover: MathJax Support

## Sprint Goal
Enable reliable generation, transport, rendering, preview, and export of mathematical notation in Prism using MathJax.

## Non-Goals
- Symbolic algebra/CAS
- Graph plotting
- Equation editor UX
- Auto-solving/checking
- Advanced STEM interaction systems

## Initial Delimiter Scope
- Inline: `\(...\)`
- Block: `\[...\]`

## Agreed Architecture
- Preservation-first transport (no delimiter corruption)
- MathJax render layer after HTML generation
- Preview/export parity
- No equation editor in this sprint

## Current Findings
- No active MathJax runtime support currently.
- Custom markdown renderer does not typeset TeX.
- Normalization path risk exists for escaped delimiter corruption in Utilities flow.

## Implementation Phases
1. Baseline lock + fixture setup
2. Normalization hardening
3. MathJax lifecycle integration (preview/export)
4. Prompt/producer alignment (DLA/GAM/Design Page)
5. Export parity and hardening
6. Rollout/guardrails/regression confidence

## Risks
- Delimiter corruption in preprocessing
- Async typeset timing/race in preview iframe
- CSP/script loading constraints
- Performance on equation-heavy pages

## Open Decisions
- These decisions are non-blocking for Sprint 33 merge readiness and can be finalized as post-sprint follow-up.
- [ ] Whether to include `$...$`/`$$...$$` now or defer
- [ ] Local bundle vs pinned CDN for MathJax
- [ ] Export mode: JS runtime only vs static pre-typeset
- [ ] CSP baseline requirements

## Phase F Release Note
- Supported delimiters: inline `\(...\)`, block `\[...\]` only.
- Unsupported delimiters remain: `$...$`, `$$...$$`.
- Preview and exported HTML now share guarded MathJax activation when supported delimiters are present.
- Non-math content is no-op; raw delimiter text remains readable if MathJax is unavailable or blocked.
- Export currently uses pinned CDN MathJax (`mathjax@3.2.2`) as a temporary choice pending local-bundle/CSP decision.

## Linked Context
- `context-files/mathjax-rendering-architecture.md`
- `context-files/mathjax-testing-strategy.md`
- `context-files/mathjax-known-risks.md`
- `context-files/mathjax-investigation-notes.md`
- `context-files/mathjax-implementation-roadmap.md`
- `context-files/mathjax-test-fixture-plan.md`
