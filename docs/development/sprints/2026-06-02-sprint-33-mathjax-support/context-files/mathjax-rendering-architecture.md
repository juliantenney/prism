# MathJax Rendering Architecture

## Ownership Boundaries
- Producer layer: preserve delimiters in generated content.
- Transport/normalization layer: do not rewrite math delimiters.
- Renderer layer: typeset math only; no reasoning logic.
- Export layer: match preview behavior.

## Lifecycle
1. Build HTML with existing renderer.
2. Inject into preview/export container.
3. Trigger scoped MathJax typeset.
4. Fail safe to raw text if typeset fails.

## Notes
- Keep support initially limited to `\(...\)` and `\[...\]`.
- Preserve non-math rendering behavior.
- Ensure preview/export parity.

## CSP/Loading
- Decision required: local bundle vs pinned CDN.
