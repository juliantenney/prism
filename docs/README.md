# PRISM Documentation Pack

This folder contains workflow-bundle documentation intended for:
- Humans designing reusable workflow JSON
- AI assistants (e.g., ChatGPT) generating import-ready bundles

## Files

- `workflow/workflow-spec.md`
  - JSON schema, field semantics, merge/import rules, validation checklist
- `workflow/workflow-authoring.md`
  - Practical authoring guidance (pedagogy-first)
- `workflow/pattern-library.md`
  - Domain pattern starter set (currently pedagogy)
- `architecture/renderer-export-behavior.md`
  - Active Utilities page export path, rendering/sanitization behavior, and regression checklist
- `development/README.md`
  - Lightweight continuity docs for session handovers, check-ins, and new-chat bootstrapping
- `examples/`
  - Import-ready JSON bundles

## Example Bundles

- `examples/bundles/minimal-valid-bundle.json`
- `examples/bundles/multi-step-bundle.json`
- `examples/bundles/step-chaining-bundle.json`
- `examples/bundles/pedagogy-complex-bundle.json`

### Gold Standard Example

Use `examples/bundles/pedagogy-complex-bundle.json` as the reference example for AI generation quality.

It demonstrates:
- Clear, action-oriented step naming
- Strong `outputName` usage for reusable artifacts
- Consistent step chaining with `inputFromStepId`
- Explicit scope/constraints and pedagogical alignment
- Prompt-step coherence across the full workflow

## Maintenance Routine

When app schema/behavior changes:

1. Update `workflow/workflow-spec.md`
2. Update JSON examples
3. Update authoring/pattern docs where relevant
4. Re-import examples into PRISM to confirm compatibility
5. If page export rendering changed, update `architecture/renderer-export-behavior.md` and run the renderer regression checklist
